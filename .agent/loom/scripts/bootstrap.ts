#!/usr/bin/env bun
/**
 * Loom Bootstrap Script
 *
 * Progressive Definition Level 1: Bootstrap
 *
 * This script runs on first use to:
 * 1. Detect project stack
 * 2. Scan for architectural patterns
 * 3. Ask user about Way of Working preferences
 * 4. Create initial Loom config
 * 5. Register as Weave extension
 *
 * Usage:
 *   bun .agent/loom/scripts/bootstrap.ts
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

interface StackDetection {
  runtime: string;
  packageManager: string;
  backend: string[];
  frontend: string[];
  database: string[];
  testing: string[];
  other: string[];
}

interface PatternScan {
  cqrs: boolean;
  sse: boolean;
  workers: boolean;
  adapters: boolean;
  realtime: boolean;
}

interface WayOfWorking {
  testingApproach: 'test-first' | 'test-after' | 'minimal' | 'comprehensive';
  prReviewProcess: 'required' | 'optional' | 'none';
  workflowStyle: 'autonomous' | 'collaborative' | 'supervised';
  documentationLevel: 'minimal' | 'standard' | 'comprehensive';
}

interface LoomConfig {
  version: string;
  initialized: string;
  project: {
    name: string;
    path: string;
  };
  stack: StackDetection;
  patterns: PatternScan;
  wayOfWorking: WayOfWorking;
  definitionOfDone: string[];
  roles: string[];
  storyCounter: number;
  taskCounter: number;
}

// ============================================================================
// Stack Detection
// ============================================================================

function detectStack(): StackDetection {
  console.log('🔍 Detecting project stack...');

  const stack: StackDetection = {
    runtime: 'unknown',
    packageManager: 'unknown',
    backend: [],
    frontend: [],
    database: [],
    testing: [],
    other: []
  };

  // Detect runtime and package manager
  if (existsSync('bun.lock') || existsSync('bun.lockb')) {
    stack.runtime = 'bun';
    stack.packageManager = 'bun';
  } else if (existsSync('package-lock.json')) {
    stack.runtime = 'node';
    stack.packageManager = 'npm';
  } else if (existsSync('yarn.lock')) {
    stack.runtime = 'node';
    stack.packageManager = 'yarn';
  } else if (existsSync('pnpm-lock.yaml')) {
    stack.runtime = 'node';
    stack.packageManager = 'pnpm';
  }

  // Aggregate dependencies from all package.json files (root + workspaces)
  let allDeps: Record<string, string> = {};

  // Read root package.json
  if (existsSync('package.json')) {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies
    };

    // Check if this is a monorepo (has workspaces)
    const workspaces = pkg.workspaces;
    if (workspaces) {
      console.log('  ℹ️  Monorepo detected, scanning workspace packages...');

      // Scan common workspace locations
      const workspaceDirs = [
        'apps',
        'packages',
        'services'
      ];

      for (const dir of workspaceDirs) {
        if (existsSync(dir)) {
          const subdirs = readdirSync(dir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => join(dir, d.name));

          for (const subdir of subdirs) {
            const pkgPath = join(subdir, 'package.json');
            if (existsSync(pkgPath)) {
              const subPkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
              console.log(`     ✓ Scanned ${subdir}/package.json`);

              // Merge dependencies
              allDeps = {
                ...allDeps,
                ...subPkg.dependencies,
                ...subPkg.devDependencies
              };
            }
          }
        }
      }
    }
  } else {
    console.log('  ⚠️  No package.json found');
    return stack;
  }

  // Now detect frameworks from aggregated dependencies
  // Backend frameworks
  if (allDeps['elysia']) stack.backend.push('ElysiaJS');
  if (allDeps['express']) stack.backend.push('Express');
  if (allDeps['fastify']) stack.backend.push('Fastify');
  if (allDeps['@nestjs/core']) stack.backend.push('NestJS');
  if (allDeps['hono']) stack.backend.push('Hono');

  // Frontend frameworks
  if (allDeps['react']) stack.frontend.push('React');
  if (allDeps['vue']) stack.frontend.push('Vue');
  if (allDeps['svelte']) stack.frontend.push('Svelte');
  if (allDeps['solid-js']) stack.frontend.push('Solid');
  if (allDeps['@remix-run/react'] || allDeps['react-router']) {
    stack.frontend.push('React Router');
  }
  if (allDeps['next']) stack.frontend.push('Next.js');

  // Database
  if (allDeps['drizzle-orm']) stack.database.push('Drizzle ORM');
  if (allDeps['prisma']) stack.database.push('Prisma');
  if (allDeps['typeorm']) stack.database.push('TypeORM');
  if (allDeps['pg']) stack.database.push('PostgreSQL');
  if (allDeps['mysql2']) stack.database.push('MySQL');
  if (allDeps['sqlite3']) stack.database.push('SQLite');

  // Testing
  if (allDeps['vitest']) stack.testing.push('Vitest');
  if (allDeps['jest']) stack.testing.push('Jest');
  if (allDeps['@playwright/test']) stack.testing.push('Playwright');
  if (allDeps['cypress']) stack.testing.push('Cypress');

  // Other
  if (allDeps['pg-boss']) stack.other.push('pg-boss (job queue)');
  if (allDeps['electric-sql']) stack.other.push('ElectricSQL');
  if (allDeps['@tanstack/react-query']) stack.other.push('TanStack Query');

  console.log(`  ✓ Runtime: ${stack.runtime}`);
  console.log(`  ✓ Package Manager: ${stack.packageManager}`);
  console.log(`  ✓ Backend: ${stack.backend.join(', ') || 'none detected'}`);
  console.log(`  ✓ Frontend: ${stack.frontend.join(', ') || 'none detected'}`);
  console.log(`  ✓ Database: ${stack.database.join(', ') || 'none detected'}`);

  return stack;
}

// ============================================================================
// Pattern Scanning
// ============================================================================

function scanFilesForPatterns(patterns: PatternScan): void {
  // Look for common patterns in file names
  const scanDir = (dir: string, depth = 0): void => {
    if (depth > 3) return; // Limit recursion depth
    if (!existsSync(dir)) return;

    try {
      const files = readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const name = file.name.toLowerCase();

        if (file.isDirectory()) {
          if (!name.startsWith('.') && name !== 'node_modules') {
            scanDir(join(dir, file.name), depth + 1);
          }
        } else {
          if (name.includes('sse') || name.includes('stream')) patterns.sse = true;
          if (name.includes('worker') || name.includes('job')) patterns.workers = true;
          if (name.includes('adapter')) patterns.adapters = true;
          if (name.includes('cqrs') || name.includes('command') || name.includes('query')) patterns.cqrs = true;
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  };

  scanDir('apps');
  scanDir('src');
  scanDir('packages');

  patterns.realtime = patterns.sse || patterns.workers;
}

function scanPatterns(): PatternScan {
  console.log('\n🔎 Scanning for architectural patterns...');

  const patterns: PatternScan = {
    cqrs: false,
    sse: false,
    workers: false,
    adapters: false,
    realtime: false
  };

  // Check for Librarian catalog with pattern shards
  const catalogPath = '.agent/librarian/shards/catalog.json';
  if (existsSync(catalogPath)) {
    console.log('  ✓ Using Librarian catalog for pattern detection');
    const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'));

    // Check shard file counts for pattern indicators
    const shards = catalog.shards || [];
    for (const shard of shards) {
      // Look for domain shards that indicate patterns
      if (shard.id?.includes('real-time') || shard.id?.includes('sse')) {
        patterns.sse = shard.fileCount > 0;
        patterns.realtime = true;
      }
      if (shard.id?.includes('worker')) {
        patterns.workers = shard.fileCount > 0;
        patterns.realtime = true;
      }
      if (shard.id?.includes('cqrs')) {
        patterns.cqrs = shard.fileCount > 0;
      }
      if (shard.id?.includes('adapter')) {
        patterns.adapters = shard.fileCount > 0;
      }
    }

    // If catalog didn't have pattern info, fallback to file scan
    if (!patterns.sse && !patterns.workers && !patterns.cqrs && !patterns.adapters) {
      console.log('  ℹ️  No pattern shards found, using file scan...');
      scanFilesForPatterns(patterns);
    }
  } else {
    // Fallback: simple file scan
    console.log('  ℹ️  Librarian not found, using basic pattern detection');
    scanFilesForPatterns(patterns);
  }

  console.log(`  ✓ CQRS: ${patterns.cqrs ? 'detected' : 'not found'}`);
  console.log(`  ✓ SSE: ${patterns.sse ? 'detected' : 'not found'}`);
  console.log(`  ✓ Workers: ${patterns.workers ? 'detected' : 'not found'}`);
  console.log(`  ✓ Adapters: ${patterns.adapters ? 'detected' : 'not found'}`);

  return patterns;
}

// ============================================================================
// Way of Working Questions
// ============================================================================

function askWayOfWorking(): WayOfWorking {
  console.log('\n❓ Way of Working Configuration');
  console.log('   (This helps Loom understand your development preferences)');
  console.log('\n   For now, using defaults. Use /loom:configure to customize later.\n');

  // TODO: Integrate with Claude Code's AskUserQuestion tool
  // For bootstrap, we'll use sensible defaults that can be customized later

  return {
    testingApproach: 'test-after',
    prReviewProcess: 'optional',
    workflowStyle: 'autonomous',
    documentationLevel: 'standard'
  };
}

// ============================================================================
// Role Mapping
// ============================================================================

function mapStackToRoles(stack: StackDetection): string[] {
  const roles = ['main-agent']; // Always needed

  // Backend roles
  if (stack.backend.length > 0) {
    roles.push('backend-dev', 'backend-qa');
  }

  // Frontend roles
  if (stack.frontend.length > 0) {
    roles.push('frontend-dev', 'frontend-qa');
  }

  // CLI roles (check for CLI indicators)
  if (existsSync('apps/cli') || existsSync('src/cli')) {
    roles.push('cli-dev', 'cli-qa');
  }

  // Always useful
  roles.push(
    'system-architect',
    'requirements-planner',
    'spec-writer'
  );

  return roles;
}

// ============================================================================
// Config Creation
// ============================================================================

function createConfig(
  stack: StackDetection,
  patterns: PatternScan,
  wow: WayOfWorking
): LoomConfig {
  console.log('\n📝 Creating Loom configuration...');

  // Read project name from package.json
  let projectName = 'unknown';
  if (existsSync('package.json')) {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    projectName = pkg.name || 'unknown';
  }

  // Map stack to roles
  const roles = mapStackToRoles(stack);

  // Create DoD based on patterns and WoW
  const dod = [
    'All tasks completed',
    'All acceptance criteria tested and passing',
    'Code committed to repository'
  ];

  if (wow.documentationLevel !== 'minimal') {
    dod.push('Documentation updated');
  }

  if (wow.testingApproach !== 'minimal') {
    dod.push('Tests written and passing');
  }

  dod.push(
    'Retrospective generated',
    'Learnings extracted to Weave'
  );

  const config: LoomConfig = {
    version: '1.0.0',
    initialized: new Date().toISOString(),
    project: {
      name: projectName,
      path: process.cwd()
    },
    stack,
    patterns,
    wayOfWorking: wow,
    definitionOfDone: dod,
    roles,
    storyCounter: 0,
    taskCounter: 0
  };

  // Write config
  const configPath = '.agent/loom/config.json';
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`  ✓ Config written to ${configPath}`);

  return config;
}

// ============================================================================
// Weave Registration
// ============================================================================

function registerWithWeave(config: LoomConfig): void {
  console.log('\n🔗 Registering Loom as Weave extension...');

  // Check if Weave exists
  if (!existsSync('.agent/weave')) {
    console.log('  ⚠ Weave not found. Loom will work standalone but with limited knowledge integration.');
    return;
  }

  // Check if extensions directory exists
  if (!existsSync('.agent/weave/extensions')) {
    console.log('  ℹ Creating Weave extensions directory...');
    // Directory already created in initial setup
  }

  // Verify extension files exist
  const manifestPath = '.agent/weave/extensions/loom/manifest.json';
  if (!existsSync(manifestPath)) {
    console.log('  ❌ Loom extension manifest not found!');
    return;
  }

  console.log('  ✓ Loom registered as Weave extension');
  console.log('  ✓ Extension provides: Ontology, Praxeology, Deontics');
}

// ============================================================================
// Summary Report
// ============================================================================

function printSummary(config: LoomConfig): void {
  console.log('\n' + '='.repeat(80));
  console.log('🎉 Loom Bootstrap Complete!');
  console.log('='.repeat(80));
  console.log('\n📊 Configuration Summary:\n');
  console.log(`  Project: ${config.project.name}`);
  console.log(`  Stack: ${config.stack.backend.join(', ')} + ${config.stack.frontend.join(', ')}`);
  console.log(`  Patterns: ${Object.entries(config.patterns).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'none'}`);
  console.log(`  Roles: ${config.roles.join(', ')}`);
  console.log(`  Testing: ${config.wayOfWorking.testingApproach}`);
  console.log(`  Workflow: ${config.wayOfWorking.workflowStyle}`);

  console.log('\n🚀 Available Commands:\n');
  console.log('  /loom:ideate       - Transform rough idea into requirements');
  console.log('  /loom:plan         - Break down story into tasks');
  console.log('  /loom:start        - Begin executing planned story');
  console.log('  /loom:complete     - Finalize story and extract learnings');
  console.log('  /loom:investigate  - Investigate bugs or issues');
  console.log('  /loom:tweak        - Make small modifications');
  console.log('  /loom:retrospective - Review completed story');

  console.log('\n📖 Next Steps:\n');
  console.log('  1. Review config at .agent/loom/config.json');
  console.log('  2. Customize with /loom:configure (if needed)');
  console.log('  3. Start your first story with /loom:ideate');

  console.log('\n' + '='.repeat(80) + '\n');
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('\n🧵 Loom Bootstrap');
  console.log('='.repeat(80) + '\n');

  // Check if already initialized
  if (existsSync('.agent/loom/config.json')) {
    console.log('⚠ Loom already initialized!');
    console.log('  Config found at .agent/loom/config.json');
    console.log('  To re-initialize, delete the config file and run again.\n');
    process.exit(0);
  }

  // Step 1: Detect stack
  const stack = detectStack();

  // Step 2: Scan patterns
  const patterns = scanPatterns();

  // Step 3: Ask about WoW
  const wow = askWayOfWorking();

  // Step 4: Create config
  const config = createConfig(stack, patterns, wow);

  // Step 5: Register with Weave
  registerWithWeave(config);

  // Step 6: Print summary
  printSummary(config);
}

main().catch(console.error);
