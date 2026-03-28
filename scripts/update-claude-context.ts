#!/usr/bin/env bun

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

// Types
interface PackageLocation {
  version: string;
  type: 'dependencies' | 'devDependencies';
  packagePath: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  body: string;
  html_url: string;
  name: string;
}

interface NpmVersion {
  version: string;
  time: string;
}

interface PackageInfo {
  name: string;
  actualName: string; // The actual package name in package.json
  locations: PackageLocation[];
}

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_DIR = 'ai-docs';
const CUTOFF_DATE = new Date('2025-01-01');
const CACHE_DIR = '.claude-cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Common package aliases
const PACKAGE_ALIASES: Record<string, string[]> = {
  'react': ['react', '@types/react'],
  'typescript': ['typescript', '@types/node'],
  'node': ['@types/node'],
  'express': ['express', '@types/express'],
  'jest': ['jest', '@types/jest'],
  'vite': ['vite', '@vitejs/plugin-react'],
  'nextjs': ['next', '@types/react', '@types/node'],
  'next': ['next', '@types/react', '@types/node'],
  'bun': ['bun', 'bun-types', '@types/bun'],
};

// Utility functions
async function ensureDir(path: string) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

// Cache functions
async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cachePath = join(CACHE_DIR, `${key}.json`);
    if (!existsSync(cachePath)) return null;
    
    const cached = JSON.parse(await readFile(cachePath, 'utf-8'));
    if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

async function setCache<T>(key: string, data: T): Promise<void> {
  await ensureDir(CACHE_DIR);
  const cachePath = join(CACHE_DIR, `${key}.json`);
  await writeFile(cachePath, JSON.stringify({ timestamp: Date.now(), data }));
}

// Extract GitHub repo from package.json
function extractGitHubRepo(packageJson: any): string | null {
  const repository = packageJson.repository;
  if (!repository) return null;
  
  const url = typeof repository === 'string' ? repository : repository.url;
  if (!url) return null;
  
  const match = url.match(/github\.com[:/]([^/]+\/[^/.]+)/);
  return match ? match[1].replace(/\.git$/, '') : null;
}

// Find package in all package.json files
async function findPackageInProject(packageName: string): Promise<PackageInfo | null> {
  const locations: PackageLocation[] = [];
  const packages = [packageName];
  
  // Check aliases
  const lowerName = packageName.toLowerCase();
  if (PACKAGE_ALIASES[lowerName]) {
    packages.push(...PACKAGE_ALIASES[lowerName]);
  }
  
  // Check root package.json
  async function checkPackageJson(path: string): Promise<string | null> {
    if (!existsSync(path)) return null;
    
    try {
      const content = JSON.parse(await readFile(path, 'utf-8'));
      
      for (const pkg of packages) {
        // Check dependencies
        if (content.dependencies && content.dependencies[pkg]) {
          locations.push({
            version: content.dependencies[pkg],
            type: 'dependencies',
            packagePath: dirname(path)
          });
          return pkg;
        }
        
        // Check devDependencies
        if (content.devDependencies && content.devDependencies[pkg]) {
          locations.push({
            version: content.devDependencies[pkg],
            type: 'devDependencies',
            packagePath: dirname(path)
          });
          return pkg;
        }
      }
    } catch (error) {
      console.error(`Error reading ${path}:`, error);
    }
    
    return null;
  }
  
  // Check root
  let foundPackage = await checkPackageJson('package.json');
  
  // Check workspaces
  const workspacePackages = ['api', 'mcp-server', 'web'];
  for (const workspace of workspacePackages) {
    const pkgPath = join('packages', workspace, 'package.json');
    const found = await checkPackageJson(pkgPath);
    if (found && !foundPackage) foundPackage = found;
  }
  
  if (!foundPackage || locations.length === 0) return null;
  
  return {
    name: packageName,
    actualName: foundPackage,
    locations
  };
}

// Fetch GitHub releases
async function fetchGitHubReleases(repo: string, packageName: string): Promise<GitHubRelease[]> {
  const cacheKey = `github_${repo.replace('/', '_')}`;
  const cached = await getCached<GitHubRelease[]>(cacheKey);
  if (cached) {
    console.log(`  Using cached GitHub data for ${packageName}`);
    return cached;
  }
  
  try {
    console.log(`  Fetching GitHub releases for ${repo}...`);
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MoneyWorks-Claude-Context-Updater'
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    const response = await fetch(`https://api.github.com/repos/${repo}/releases`, { headers });
    
    if (!response.ok) {
      console.warn(`  Failed to fetch GitHub releases: ${response.statusText}`);
      return [];
    }
    
    const releases = await response.json();
    const filtered = releases.filter((release: GitHubRelease) => 
      new Date(release.published_at) > CUTOFF_DATE
    );
    
    await setCache(cacheKey, filtered);
    return filtered;
  } catch (error) {
    console.error(`  Error fetching GitHub releases:`, error);
    return [];
  }
}

// Fetch NPM versions
async function fetchNpmVersions(packageName: string): Promise<NpmVersion[]> {
  const cacheKey = `npm_${packageName.replace('/', '_')}`;
  const cached = await getCached<NpmVersion[]>(cacheKey);
  if (cached) {
    console.log(`  Using cached NPM data for ${packageName}`);
    return cached;
  }
  
  try {
    console.log(`  Fetching NPM versions for ${packageName}...`);
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    
    if (!response.ok) {
      console.warn(`  Failed to fetch NPM data: ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    const versions: NpmVersion[] = [];
    
    if (data.time) {
      for (const [version, time] of Object.entries(data.time)) {
        if (version !== 'created' && version !== 'modified') {
          const publishDate = new Date(time as string);
          if (publishDate > CUTOFF_DATE) {
            versions.push({ version, time: time as string });
          }
        }
      }
    }
    
    const sorted = versions.sort((a, b) => 
      new Date(b.time).getTime() - new Date(a.time).getTime()
    );
    
    await setCache(cacheKey, sorted);
    return sorted;
  } catch (error) {
    console.error(`  Error fetching NPM versions:`, error);
    return [];
  }
}

// Extract key information from release notes
function extractKeyInfo(body: string): {
  breaking: string[];
  features: string[];
  fixes: string[];
  other: string[];
} {
  const breaking: string[] = [];
  const features: string[] = [];
  const fixes: string[] = [];
  const other: string[] = [];
  
  const lines = body.split('\n');
  let currentSection = 'other';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect sections
    if (trimmed.match(/breaking\s*change/i)) {
      currentSection = 'breaking';
      continue;
    } else if (trimmed.match(/new\s*feature|feature/i) && !trimmed.match(/bug|fix/i)) {
      currentSection = 'features';
      continue;
    } else if (trimmed.match(/bug\s*fix|fix/i)) {
      currentSection = 'fixes';
      continue;
    }
    
    // Parse bullet points
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      const content = bulletMatch[1];
      
      // Categorize based on content
      if (content.match(/breaking|BREAKING/)) {
        breaking.push(content);
      } else if (content.match(/^(feat|feature|add|new):/i)) {
        features.push(content);
      } else if (content.match(/^(fix|bugfix|fixed):/i)) {
        fixes.push(content);
      } else {
        switch (currentSection) {
          case 'breaking': breaking.push(content); break;
          case 'features': features.push(content); break;
          case 'fixes': fixes.push(content); break;
          default: other.push(content);
        }
      }
    }
  }
  
  return { breaking, features, fixes, other };
}

// Generate markdown for the package
async function generatePackageMarkdown(
  packageInfo: PackageInfo,
  releases: GitHubRelease[],
  npmVersions: NpmVersion[]
): Promise<string> {
  let markdown = `# ${packageInfo.actualName}\n\n`;
  markdown += `**Last Updated:** ${new Date().toISOString()}\n`;
  markdown += `**Requested as:** ${packageInfo.name}\n\n`;
  
  // Current usage
  markdown += `## Current Usage\n\n`;
  for (const loc of packageInfo.locations) {
    markdown += `- **${loc.packagePath}**: \`${loc.version}\` (${loc.type})\n`;
  }
  markdown += '\n';
  
  // Version progression
  if (releases.length > 0 || npmVersions.length > 0) {
    markdown += `## Version Progression (since ${CUTOFF_DATE.toISOString().split('T')[0]})\n\n`;
    
    if (releases.length > 0) {
      // GitHub releases with detailed info
      for (const release of releases) {
        markdown += `### ${release.tag_name} - ${new Date(release.published_at).toLocaleDateString()}\n\n`;
        
        if (release.name && release.name !== release.tag_name) {
          markdown += `**${release.name}**\n\n`;
        }
        
        if (release.body) {
          const info = extractKeyInfo(release.body);
          
          if (info.breaking.length > 0) {
            markdown += `#### 🚨 Breaking Changes\n`;
            for (const item of info.breaking) {
              markdown += `- ${item}\n`;
            }
            markdown += '\n';
          }
          
          if (info.features.length > 0) {
            markdown += `#### ✨ Key Features\n`;
            for (const item of info.features) {
              markdown += `- ${item}\n`;
            }
            markdown += '\n';
          }
          
          if (info.fixes.length > 0) {
            markdown += `#### 🐛 Bug Fixes\n`;
            for (const item of info.fixes.slice(0, 5)) {
              markdown += `- ${item}\n`;
            }
            if (info.fixes.length > 5) {
              markdown += `- ...and ${info.fixes.length - 5} more fixes\n`;
            }
            markdown += '\n';
          }
        }
        
        markdown += `[View full release](${release.html_url})\n\n`;
      }
    } else if (npmVersions.length > 0) {
      // NPM versions only
      markdown += `*No GitHub releases found. Showing NPM version history:*\n\n`;
      for (const version of npmVersions.slice(0, 10)) {
        markdown += `- **${version.version}** - ${new Date(version.time).toLocaleDateString()}\n`;
      }
      if (npmVersions.length > 10) {
        markdown += `- ...and ${npmVersions.length - 10} more versions\n`;
      }
    }
  } else {
    markdown += `*No updates found since ${CUTOFF_DATE.toISOString().split('T')[0]}*\n`;
  }
  
  // Migration notes
  if (releases.some(r => extractKeyInfo(r.body || '').breaking.length > 0)) {
    markdown += `\n## Migration Notes\n\n`;
    markdown += `This package has breaking changes in recent versions. `;
    markdown += `Review the breaking changes above before upgrading.\n`;
  }
  
  return markdown;
}

// Update the main claude.md file
async function updateMainIndex(packageName: string, actualName: string, hasUpdates: boolean) {
  const indexPath = join(OUTPUT_DIR, 'claude.md');
  let content = '';
  
  if (existsSync(indexPath)) {
    content = await readFile(indexPath, 'utf-8');
  } else {
    // Create initial structure
    content = `# MoneyWorks Dependencies - Claude Context\n\n`;
    content += `**Last Updated:** ${new Date().toISOString()}\n\n`;
    content += `## Stack Updates\n\n`;
    content += `*Dependencies with recent updates since ${CUTOFF_DATE.toISOString().split('T')[0]}:*\n\n`;
  }
  
  // Update the last updated timestamp
  content = content.replace(
    /\*\*Last Updated:\*\* .+/,
    `**Last Updated:** ${new Date().toISOString()}`
  );
  
  // Check if package already exists in the list
  const fileName = `claude.${actualName.replace(/[@/]/g, '_')}.md`;
  const linkPattern = new RegExp(`- \\[${actualName}\\]\\([^)]+\\)`, 'g');
  
  if (content.match(linkPattern)) {
    // Update existing entry
    console.log(`  Updating existing entry for ${actualName} in claude.md`);
  } else {
    // Add new entry
    console.log(`  Adding new entry for ${actualName} to claude.md`);
    
    // Find the Stack Updates section
    const stackUpdatesIndex = content.indexOf('## Stack Updates');
    if (stackUpdatesIndex !== -1) {
      // Find the end of the list
      const listStart = content.indexOf('*Dependencies with recent updates', stackUpdatesIndex);
      const nextSection = content.indexOf('\n## ', listStart + 1);
      const insertPoint = nextSection !== -1 ? nextSection : content.length;
      
      // Find the right place to insert (after the asterisk line)
      const afterAsterisk = content.indexOf('\n\n', listStart) + 2;
      
      const entry = `- [${actualName}](./${fileName})${hasUpdates ? '' : ' *(no recent updates)*'}\n`;
      content = content.slice(0, afterAsterisk) + entry + content.slice(afterAsterisk);
    } else {
      // Add the section if it doesn't exist
      content += `\n## Stack Updates\n\n`;
      content += `*Dependencies with recent updates since ${CUTOFF_DATE.toISOString().split('T')[0]}:*\n\n`;
      content += `- [${actualName}](./${fileName})${hasUpdates ? '' : ' *(no recent updates)*'}\n`;
    }
  }
  
  await writeFile(indexPath, content);
}

// Main function
async function main() {
  // Get library name from arguments
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ Error: Please provide a library name');
    console.error('Usage: bun run scripts/update-claude-context.ts <library-name>');
    console.error('Example: bun run scripts/update-claude-context.ts react');
    process.exit(1);
  }
  
  const libraryName = args[0];
  console.log(`🔍 Looking for "${libraryName}" in project dependencies...\n`);
  
  // Find the package in the project
  const packageInfo = await findPackageInProject(libraryName);
  
  if (!packageInfo) {
    console.error(`❌ Error: Package "${libraryName}" not found in any package.json`);
    console.error('\nTried checking:');
    console.error('- Direct package name');
    if (PACKAGE_ALIASES[libraryName.toLowerCase()]) {
      console.error(`- Common aliases: ${PACKAGE_ALIASES[libraryName.toLowerCase()].join(', ')}`);
    }
    process.exit(1);
  }
  
  console.log(`✅ Found ${packageInfo.actualName} in ${packageInfo.locations.length} location(s)\n`);
  
  // Ensure output directory exists
  await ensureDir(OUTPUT_DIR);
  
  // Try to get GitHub repo info
  let githubRepo: string | null = null;
  try {
    const npmResponse = await fetch(`https://registry.npmjs.org/${packageInfo.actualName}/latest`);
    if (npmResponse.ok) {
      const npmData = await npmResponse.json();
      githubRepo = extractGitHubRepo(npmData);
      if (githubRepo) {
        console.log(`  GitHub repository: ${githubRepo}`);
      }
    }
  } catch (error) {
    console.warn(`  Could not fetch package metadata`);
  }
  
  // Fetch release information
  const releases = githubRepo ? await fetchGitHubReleases(githubRepo, packageInfo.actualName) : [];
  const npmVersions = await fetchNpmVersions(packageInfo.actualName);
  
  const hasUpdates = releases.length > 0 || npmVersions.length > 0;
  
  console.log(`\n📊 Found:`);
  console.log(`  - ${releases.length} GitHub releases`);
  console.log(`  - ${npmVersions.length} NPM versions`);
  console.log(`  - Since ${CUTOFF_DATE.toISOString().split('T')[0]}\n`);
  
  // Generate markdown
  const markdown = await generatePackageMarkdown(packageInfo, releases, npmVersions);
  const fileName = `claude.${packageInfo.actualName.replace(/[@/]/g, '_')}.md`;
  const filePath = join(OUTPUT_DIR, fileName);
  
  await writeFile(filePath, markdown);
  console.log(`📝 Generated: ${filePath}`);
  
  // Update main index
  await updateMainIndex(packageInfo.name, packageInfo.actualName, hasUpdates);
  console.log(`📝 Updated: ${join(OUTPUT_DIR, 'claude.md')}`);
  
  console.log(`\n✅ Successfully updated context for ${packageInfo.actualName}`);
  
  if (!hasUpdates) {
    console.log('ℹ️  No updates found since January 2025');
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});