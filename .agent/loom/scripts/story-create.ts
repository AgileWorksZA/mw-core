#!/usr/bin/env bun
/**
 * Loom Story Creation Utility
 *
 * Creates story artifacts (JSON + MD) with proper ID generation
 * and validation.
 *
 * Usage:
 *   bun .agent/loom/scripts/story-create.ts --title "Feature title" --description "..." --why "..."
 *   echo '{"title":"...","description":"...","why":"...","acceptanceCriteria":[...]}' | bun .agent/loom/scripts/story-create.ts --stdin
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types (matching Loom ontology)
// ============================================================================

interface AcceptanceCriterion {
  id: string;
  storyId: string;
  description: string;
  testable: boolean;
  tested: boolean;
  evidence: string | null;
  status: 'pending' | 'pass' | 'fail';
}

interface Story {
  id: string;
  title: string;
  description: string;
  why: string;
  status: 'idea' | 'planned' | 'in-progress' | 'complete' | 'archived';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedComplexity: 'trivial' | 'simple' | 'moderate' | 'complex' | 'epic';
  sessions: any[];
  hookEvents: any[];
  tasks: any[];
  acceptanceCriteria: AcceptanceCriterion[];
  decisions: any[];
  learnings: string[];
  weaveRefs: string[];
  createdAt: string;
  completedAt: string | null;
}

interface StoryInput {
  title: string;
  description: string;
  why: string;
  priority?: string;
  estimatedComplexity?: string;
  acceptanceCriteria: Array<{
    description: string;
    testable?: boolean;
  }>;
  weaveRefs?: string[];
  feature?: string;
}

interface LoomConfig {
  storyCounter: number;
  taskCounter: number;
  [key: string]: any;
}

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generate next story ID for a feature
 * @param feature - Feature name (e.g., "metrics-dashboard")
 * @returns Feature-scoped story ID (e.g., "MD-001")
 */
function getNextStoryId(feature?: string): string {
  if (feature) {
    // Feature-scoped ID: read from feature manifest
    const manifestPath = `.claude/loom/features/${feature}/manifest.json`;

    if (!existsSync(manifestPath)) {
      console.error(`❌ Feature manifest not found: ${manifestPath}`);
      console.error(`   Create feature first: bun .agent/loom/scripts/feature-create.ts ${feature}`);
      process.exit(1);
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    const nextId = manifest.storyCounter + 1;

    // Update counter
    manifest.storyCounter = nextId;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    // Format: {CODE}-{nnn} (e.g., MD-001, AUTH-001)
    return `${manifest.code}-${String(nextId).padStart(3, '0')}`;
  } else {
    // Legacy global ID: read from Loom config
    const configPath = '.agent/loom/config.json';

    if (!existsSync(configPath)) {
      console.error('❌ Loom not initialized. Run bootstrap first.');
      process.exit(1);
    }

    const config: LoomConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
    const nextId = config.storyCounter + 1;

    // Update counter
    config.storyCounter = nextId;
    writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Format: US-001, US-002, etc.
    return `US-${String(nextId).padStart(3, '0')}`;
  }
}

function generateAcId(storyId: string, index: number): string {
  return `${storyId}-AC-${String(index + 1).padStart(3, '0')}`;
}

// ============================================================================
// Story Creation
// ============================================================================

function createStory(input: StoryInput, feature?: string): Story {
  const storyId = getNextStoryId(feature);

  // Create acceptance criteria with proper IDs
  const acceptanceCriteria: AcceptanceCriterion[] = input.acceptanceCriteria.map((ac, i) => ({
    id: generateAcId(storyId, i),
    storyId,
    description: ac.description,
    testable: ac.testable ?? true,
    tested: false,
    evidence: null,
    status: 'pending' as const
  }));

  const story: Story = {
    id: storyId,
    title: input.title,
    description: input.description,
    why: input.why,
    status: 'planned',
    priority: (input.priority as any) || 'medium',
    estimatedComplexity: (input.estimatedComplexity as any) || 'moderate',
    sessions: [],
    hookEvents: [],
    tasks: [],
    acceptanceCriteria,
    decisions: [],
    learnings: [],
    weaveRefs: input.weaveRefs || [],
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  return story;
}

// ============================================================================
// File Generation
// ============================================================================

function generateStoryJson(story: Story): string {
  return JSON.stringify(story, null, 2);
}

function generateStoryMarkdown(story: Story): string {
  const md: string[] = [];

  md.push(`# ${story.id}: ${story.title}`);
  md.push('');

  md.push('## Why (Root Motivation)');
  md.push(story.why);
  md.push('');

  md.push('## Description');
  md.push(story.description);
  md.push('');

  md.push('## Acceptance Criteria');
  for (const ac of story.acceptanceCriteria) {
    md.push(`- [ ] ${ac.id}: ${ac.description}`);
  }
  md.push('');

  if (story.weaveRefs.length > 0) {
    md.push('## Weave Knowledge');
    md.push('');
    md.push('**Referenced Entities**:');
    for (const ref of story.weaveRefs) {
      md.push(`- ${ref}`);
    }
    md.push('');
  }

  md.push(`## Metadata`);
  md.push('');
  md.push(`- **Complexity**: ${story.estimatedComplexity}`);
  md.push(`- **Priority**: ${story.priority}`);
  md.push(`- **Status**: ${story.status}`);
  md.push(`- **Created**: ${new Date(story.createdAt).toLocaleDateString()}`);
  md.push('');

  md.push('## Notes');
  md.push('');
  md.push('_Add any additional context, decisions, or considerations here._');
  md.push('');

  return md.join('\n');
}

function writeStoryFiles(story: Story, feature?: string): void {
  let storyDir: string;

  if (feature) {
    // Feature-based structure: .claude/loom/features/{feature}/stories/{id}/
    storyDir = `.claude/loom/features/${feature}/stories/${story.id}`;
  } else {
    // Legacy flat structure: .claude/loom/stories/{id}/
    storyDir = `.claude/loom/stories/${story.id}`;
  }

  // Ensure directory exists
  if (!existsSync(storyDir)) {
    mkdirSync(storyDir, { recursive: true });
  }

  // Write JSON
  const jsonPath = join(storyDir, `story.json`);
  writeFileSync(jsonPath, generateStoryJson(story));

  // Write Markdown
  const mdPath = join(storyDir, `story.md`);
  writeFileSync(mdPath, generateStoryMarkdown(story));

  // Create notes placeholder
  const notesPath = join(storyDir, `notes.md`);
  if (!existsSync(notesPath)) {
    writeFileSync(notesPath, `# Notes for ${story.id}\n\n_Add additional context, decisions, or notes here._\n`);
  }

  console.log(`✅ Story created: ${story.id}`);
  console.log(`   Directory: ${storyDir}`);
  console.log(`   ${feature ? 'Feature: ' + feature : 'No feature (legacy)'}`);

  // Update feature manifest if using feature structure
  if (feature) {
    updateFeatureManifest(feature, story.id);
  }
}

// ============================================================================
// Feature Manifest Update
// ============================================================================

function updateFeatureManifest(feature: string, storyId: string): void {
  const manifestPath = `.claude/loom/features/${feature}/manifest.json`;

  if (!existsSync(manifestPath)) {
    console.warn(`⚠️  Feature manifest not found: ${manifestPath}`);
    console.warn(`   Create feature first: bun .agent/loom/scripts/feature-create.ts ${feature}`);
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  if (!manifest.stories.includes(storyId)) {
    manifest.stories.push(storyId);
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`   Updated feature manifest: ${feature}`);
  }
}

// ============================================================================
// DoR Validation
// ============================================================================

function validateDoR(story: Story): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // From deontics.json > definition_of_ready > story-dor:
  // ✓ WHY extracted (business motivation clear)
  if (!story.why || story.why.trim().length < 10) {
    errors.push('WHY not extracted - business motivation must be clear');
  }

  // ✓ 3-7 testable acceptance criteria defined
  if (story.acceptanceCriteria.length < 3) {
    errors.push('Too few acceptance criteria - need at least 3');
  }
  if (story.acceptanceCriteria.length > 7) {
    errors.push('Too many acceptance criteria - should be 3-7 (consider splitting story)');
  }

  const untestable = story.acceptanceCriteria.filter(ac => !ac.testable);
  if (untestable.length > 0) {
    errors.push(`${untestable.length} acceptance criteria marked as untestable`);
  }

  // Story should be in planned status after ideation
  if (story.status !== 'planned') {
    errors.push(`Story status should be 'planned', got '${story.status}'`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📝 Loom Story Creation

Usage:
  # From arguments
  bun .agent/loom/scripts/story-create.ts \\
    --feature metrics-dashboard \\
    --title "Feature title" \\
    --description "What needs to be built" \\
    --why "Root motivation" \\
    --priority high \\
    --complexity moderate \\
    --ac "First criterion" \\
    --ac "Second criterion" \\
    --ac "Third criterion" \\
    --weave-ref "E:pattern-xxx"

  # From stdin (JSON)
  echo '{"title":"...","description":"...","why":"...","acceptanceCriteria":[{"description":"..."}]}' | \\
    bun .agent/loom/scripts/story-create.ts --stdin

  # Interactive (TODO)
  bun .agent/loom/scripts/story-create.ts --interactive

Options:
  --feature        Feature name (recommended for organization)
  --title          Story title (required)
  --description    Story description (required)
  --why            Root motivation (required)
  --priority       critical|high|medium|low (default: medium)
  --complexity     trivial|simple|moderate|complex|epic (default: moderate)
  --ac             Acceptance criterion (can specify multiple times)
  --weave-ref      Weave entity reference (can specify multiple times)
  --stdin          Read JSON from stdin
  --skip-dor       Skip Definition of Ready validation
  --help, -h       Show this help
`);
    process.exit(0);
  }

  let input: StoryInput;

  // Read from stdin
  if (args.includes('--stdin')) {
    const stdinData = await Bun.stdin.text();
    input = JSON.parse(stdinData);
  } else {
    // Parse from arguments
    const getArg = (flag: string): string | undefined => {
      const index = args.indexOf(flag);
      return index !== -1 && index + 1 < args.length ? args[index + 1] : undefined;
    };

    const getArgs = (flag: string): string[] => {
      const values: string[] = [];
      for (let i = 0; i < args.length; i++) {
        if (args[i] === flag && i + 1 < args.length) {
          values.push(args[i + 1]);
        }
      }
      return values;
    };

    const title = getArg('--title');
    const description = getArg('--description');
    const why = getArg('--why');

    if (!title || !description || !why) {
      console.error('❌ Missing required arguments: --title, --description, --why');
      console.error('   Use --help for usage information');
      process.exit(1);
    }

    const acDescriptions = getArgs('--ac');
    if (acDescriptions.length === 0) {
      console.error('❌ At least one acceptance criterion required (--ac)');
      process.exit(1);
    }

    input = {
      title,
      description,
      why,
      priority: getArg('--priority'),
      estimatedComplexity: getArg('--complexity'),
      acceptanceCriteria: acDescriptions.map(desc => ({ description: desc })),
      weaveRefs: getArgs('--weave-ref')
    };
  }

  // Parse feature flag (need it before creating story for ID generation)
  const feature = args.includes('--stdin')
    ? input.feature
    : (args.includes('--feature') ? args[args.indexOf('--feature') + 1] : undefined);

  // Create story
  console.log('\n📝 Creating story...\n');
  const story = createStory(input, feature);

  // Validate DoR
  if (!args.includes('--skip-dor')) {
    const validation = validateDoR(story);
    if (!validation.valid) {
      console.error('❌ Story does not meet Definition of Ready:');
      for (const error of validation.errors) {
        console.error(`   - ${error}`);
      }
      console.error('\nUse --skip-dor to create anyway (not recommended)');
      process.exit(1);
    }
  }

  // Write files
  writeStoryFiles(story, feature);

  // Summary
  console.log('\n📊 Story Summary:');
  console.log(`   ID: ${story.id}`);
  console.log(`   Title: ${story.title}`);
  console.log(`   Priority: ${story.priority}`);
  console.log(`   Complexity: ${story.estimatedComplexity}`);
  console.log(`   AC Count: ${story.acceptanceCriteria.length}`);
  console.log(`   Status: ${story.status}`);
  if (feature) {
    console.log(`   Feature: ${feature}`);
  }
  console.log('');

  console.log('✅ Story ready for planning!');
  console.log('   Next: /loom:plan to break down into tasks');
  console.log('');
}

main().catch(console.error);
