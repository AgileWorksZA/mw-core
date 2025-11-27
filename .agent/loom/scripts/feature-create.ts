#!/usr/bin/env bun
/**
 * Loom Feature Creation Utility
 *
 * Creates a new feature directory with manifest and structure.
 * Features group related stories together.
 *
 * Usage:
 *   bun .agent/loom/scripts/feature-create.ts metrics-dashboard
 *   bun .agent/loom/scripts/feature-create.ts metrics-dashboard --epic "EPIC-ANALYTICS" --description "..."
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

interface FeatureManifest {
  feature: string;
  code: string;                    // Short code for story IDs (e.g., "MD", "AUTH")
  epic: string;
  description: string;
  status: 'planning' | 'active' | 'complete' | 'archived';
  phase: string;
  stories: string[];
  storyCounter: number;            // Feature-scoped story counter
  storyDependencies: Record<string, string[]>;  // Cross-story dependencies
  startDate: string;
  targetDate: string | null;
  completedDate: string | null;
  notes: string[];
}

/**
 * Auto-generate feature code from feature name
 * Examples:
 *   metrics-dashboard -> MD
 *   auth-system -> AUTH
 *   user-profile -> UP
 */
function generateFeatureCode(featureName: string): string {
  const words = featureName.split('-');

  if (words.length === 1) {
    // Single word: take first 2-4 chars
    return featureName.substring(0, Math.min(4, featureName.length)).toUpperCase();
  }

  // Multiple words: take first letter of each word
  const code = words.map(w => w[0]).join('').toUpperCase();

  // If too long, take only first 4 chars
  return code.substring(0, 4);
}

function createFeature(featureName: string, options: {
  epic?: string;
  description?: string;
  phase?: string;
  code?: string;
}): void {
  const featureDir = `.claude/loom/features/${featureName}`;

  if (existsSync(featureDir)) {
    console.error(`❌ Feature already exists: ${featureName}`);
    process.exit(1);
  }

  // Generate or use provided feature code
  const featureCode = options.code || generateFeatureCode(featureName);

  // Create directory structure
  mkdirSync(join(featureDir, 'stories'), { recursive: true });
  mkdirSync(join(featureDir, 'docs'), { recursive: true });

  // Create manifest
  const manifest: FeatureManifest = {
    feature: featureName,
    code: featureCode,
    epic: options.epic || `EPIC-${featureName.toUpperCase()}`,
    description: options.description || `Feature: ${featureName}`,
    status: 'planning',
    phase: options.phase || 'MVP',
    stories: [],
    storyCounter: 0,
    storyDependencies: {},
    startDate: new Date().toISOString().split('T')[0],
    targetDate: null,
    completedDate: null,
    notes: []
  };

  writeFileSync(
    join(featureDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Create README
  const readme = `# ${featureName}

${manifest.description}

## Epic
${manifest.epic}

## Status
**${manifest.status}** | Phase: **${manifest.phase}**

## Stories
${manifest.stories.length > 0 ? manifest.stories.map(s => `- ${s}`).join('\n') : '_No stories yet_'}

## Documentation
- See \`docs/\` for feature-specific documentation
- API contracts in \`docs/api-contracts.md\`
- Architecture decisions in \`docs/architecture.md\`

## Notes
${manifest.notes.length > 0 ? manifest.notes.join('\n') : '_No notes yet_'}
`;

  writeFileSync(join(featureDir, 'README.md'), readme);

  console.log(`✅ Feature created: ${featureName}`);
  console.log(`   Directory: ${featureDir}`);
  console.log(`   Code: ${manifest.code}`);
  console.log(`   Epic: ${manifest.epic}`);
  console.log(`   Status: ${manifest.status}`);
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Create stories with: bun .agent/loom/scripts/story-create.ts --feature ${featureName}`);
  console.log(`  2. Update manifest.json with target date and notes`);
  console.log(`  3. Add documentation to docs/`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
📦 Loom Feature Creation

Usage:
  bun .agent/loom/scripts/feature-create.ts <feature-name> [options]

Options:
  --code <code>         Feature code for story IDs (default: auto-generated)
  --epic <name>         Epic identifier (default: EPIC-<FEATURE>)
  --description <text>  Feature description
  --phase <name>        Development phase (default: MVP)
  --help, -h            Show this help

Examples:
  # Basic feature
  bun .agent/loom/scripts/feature-create.ts metrics-dashboard

  # With code, epic and description
  bun .agent/loom/scripts/feature-create.ts metrics-dashboard \\
    --code "MD" \\
    --epic "EPIC-ANALYTICS" \\
    --description "Real-time session metrics dashboard" \\
    --phase "MVP"
`);
    process.exit(0);
  }

  const featureName = args[0];

  const getArg = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    return index !== -1 && index + 1 < args.length ? args[index + 1] : undefined;
  };

  const options = {
    code: getArg('--code'),
    epic: getArg('--epic'),
    description: getArg('--description'),
    phase: getArg('--phase')
  };

  createFeature(featureName, options);
}

main();
