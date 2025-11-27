#!/usr/bin/env bun
/**
 * Loom Agent Hydration Script
 *
 * Progressive Definition Level 2: Hydration
 *
 * Generates agent prompts by injecting Weave context into templates.
 * Called during execution phase to prepare specialized agents.
 *
 * Usage:
 *   bun .agent/loom/scripts/hydrate-agents.ts US-001 backend-dev
 *   bun .agent/loom/scripts/hydrate-agents.ts US-001 --all
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

interface Story {
  id: string;
  title: string;
  description: string;
  why: string;
  status: string;
  priority: string;
  estimatedComplexity: string;
  tasks: Task[];
  acceptanceCriteria: any[];
  weaveRefs: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedAgent: string;
}

interface LoomConfig {
  stack: any;
  patterns: any;
  wayOfWorking: any;
  definitionOfDone: string[];
  roles: string[];
}

interface AgentContext {
  role: string;
  story: Story;
  config: LoomConfig;
  weaveContext: WeaveContext;
}

interface WeaveContext {
  patterns: string[];
  painPoints: string[];
  bestPractices: string[];
  relevantEntities: any[];
}

// ============================================================================
// Weave Query
// ============================================================================

function queryWeave(storyRefs: string[]): WeaveContext {
  const context: WeaveContext = {
    patterns: [],
    painPoints: [],
    bestPractices: [],
    relevantEntities: []
  };

  // Check if Weave exists
  if (!existsSync('.agent/weave')) {
    return context;
  }

  // Read relevant Weave dimensions
  try {
    // Qualia (Q) - Pain points, best practices, solutions
    if (existsSync('.agent/weave/qualia.json')) {
      const qualia = JSON.parse(readFileSync('.agent/weave/qualia.json', 'utf-8'));

      // Extract pain points
      if (qualia.painpoints) {
        context.painPoints = Object.values(qualia.painpoints)
          .map((p: any) => p.description || p.issue)
          .filter(Boolean);
      }

      // Extract best practices
      if (qualia.bestpractices) {
        context.bestPractices = Object.values(qualia.bestpractices)
          .map((bp: any) => bp.description || bp.practice)
          .filter(Boolean);
      }
    }

    // Epistemology (E) - Patterns
    if (existsSync('.agent/weave/epistemology.json')) {
      const epistemology = JSON.parse(readFileSync('.agent/weave/epistemology.json', 'utf-8'));

      if (epistemology.patterns) {
        context.patterns = Object.values(epistemology.patterns)
          .map((p: any) => p.description || p.pattern)
          .filter(Boolean);
      }
    }

    // Praxeology (Π) - Way of Working patterns
    if (existsSync('.agent/weave/praxeology.json')) {
      const praxeology = JSON.parse(readFileSync('.agent/weave/praxeology.json', 'utf-8'));

      if (praxeology.wowpatterns) {
        const wowPatterns = Object.values(praxeology.wowpatterns)
          .map((p: any) => p.description || p.pattern)
          .filter(Boolean);
        context.bestPractices = [...context.bestPractices, ...wowPatterns];
      }
    }

    // If story has specific Weave references, load those entities
    if (storyRefs && storyRefs.length > 0) {
      for (const ref of storyRefs) {
        // Parse ref format: "dimension:entity-id" (e.g., "Q:painpoint-001", "E:pattern-sse")
        const [dimension, entityId] = ref.split(':');

        const dimensionMap: Record<string, string> = {
          'Q': 'qualia.json',
          'E': 'epistemology.json',
          'O': 'ontology.json',
          'M': 'mereology.json',
          'C': 'causation.json',
          'A': 'axiology.json',
          'T': 'teleology.json',
          'Η': 'history.json',
          'Π': 'praxeology.json',
          'Μ': 'modality.json',
          'Δ': 'deontics.json'
        };

        const dimensionFile = dimensionMap[dimension];
        if (dimensionFile && existsSync(`.agent/weave/${dimensionFile}`)) {
          const dimensionData = JSON.parse(readFileSync(`.agent/weave/${dimensionFile}`, 'utf-8'));

          // Find the specific entity in the dimension
          for (const [category, entities] of Object.entries(dimensionData)) {
            if (typeof entities === 'object' && entities !== null) {
              const entity = (entities as any)[entityId];
              if (entity) {
                context.relevantEntities.push({
                  id: ref,
                  dimension,
                  category,
                  ...entity
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('⚠️  Error reading Weave dimensions:', error);
  }

  return context;
}

// ============================================================================
// Template Loading
// ============================================================================

function loadAgentTemplate(role: string): string {
  const templatePath = `.agent/loom/templates/agents/${role}.md`;

  if (existsSync(templatePath)) {
    return readFileSync(templatePath, 'utf-8');
  }

  // Fallback to basic template
  return generateDefaultTemplate(role);
}

function generateDefaultTemplate(role: string): string {
  return `# ${role} Agent

You are a **${role}** agent working on a Loom story.

## Your Role
{ROLE_DESCRIPTION}

## Story Context
{STORY_CONTEXT}

## Task
{TASK_CONTEXT}

## Stack & Patterns
{STACK_CONTEXT}

## Weave Knowledge
{WEAVE_CONTEXT}

## Definition of Done
{DOD_CONTEXT}

## Instructions
{INSTRUCTIONS}
`;
}

// ============================================================================
// Context Injection
// ============================================================================

function hydrateTemplate(
  template: string,
  context: AgentContext,
  task?: Task
): string {
  let hydrated = template;

  // Role description
  const roleDescriptions: Record<string, string> = {
    'backend-dev': 'Backend developer responsible for API implementation, business logic, and data layer',
    'frontend-dev': 'Frontend developer responsible for UI components, user interactions, and client-side logic',
    'cli-dev': 'CLI developer responsible for command-line tools, scripts, and terminal interactions',
    'backend-qa': 'QA specialist for backend testing, API validation, and integration tests',
    'frontend-qa': 'QA specialist for UI testing, accessibility, and user experience validation',
    'cli-qa': 'QA specialist for CLI testing, command validation, and error handling',
    'system-architect': 'System architect responsible for technical design, architecture decisions, and ADRs',
    'requirements-planner': 'Requirements specialist responsible for extracting clear, testable requirements',
    'spec-writer': 'Specification writer responsible for detailed technical specifications'
  };

  hydrated = hydrated.replace(
    '{ROLE_DESCRIPTION}',
    roleDescriptions[context.role] || 'Specialized agent for this task'
  );

  // Story context
  const storyContext = `
**Story**: ${context.story.id} - ${context.story.title}

**Why** (Root Motivation):
${context.story.why}

**What** (Description):
${context.story.description}

**Priority**: ${context.story.priority}
**Complexity**: ${context.story.estimatedComplexity}

**Acceptance Criteria** (${context.story.acceptanceCriteria.length}):
${context.story.acceptanceCriteria.map((ac, i) => `${i + 1}. ${ac.description}`).join('\n')}
`.trim();

  hydrated = hydrated.replace('{STORY_CONTEXT}', storyContext);

  // Task context
  if (task) {
    const taskContext = `
**Task**: ${task.id} - ${task.title}

${task.description}

**Assigned to**: ${task.assignedAgent}
`.trim();

    hydrated = hydrated.replace('{TASK_CONTEXT}', taskContext);
  } else {
    hydrated = hydrated.replace('{TASK_CONTEXT}', 'Multiple tasks - see story context');
  }

  // Stack context
  const stackContext = `
**Runtime**: ${context.config.stack.runtime || 'unknown'}
**Backend**: ${context.config.stack.backend.join(', ') || 'none'}
**Frontend**: ${context.config.stack.frontend.join(', ') || 'none'}
**Database**: ${context.config.stack.database.join(', ') || 'none'}

**Patterns in Use**:
${Object.entries(context.config.patterns)
    .filter(([_, v]) => v)
    .map(([k]) => `- ${k}`)
    .join('\n') || '- None detected'}
`.trim();

  hydrated = hydrated.replace('{STACK_CONTEXT}', stackContext);

  // Weave context
  let weaveContext = '';
  if (context.weaveContext.patterns.length > 0) {
    weaveContext += '**Relevant Patterns**:\n';
    weaveContext += context.weaveContext.patterns.map(p => `- ${p}`).join('\n');
    weaveContext += '\n\n';
  }
  if (context.weaveContext.painPoints.length > 0) {
    weaveContext += '**Pain Points to Avoid**:\n';
    weaveContext += context.weaveContext.painPoints.map(p => `- ${p}`).join('\n');
    weaveContext += '\n\n';
  }
  if (context.weaveContext.bestPractices.length > 0) {
    weaveContext += '**Best Practices**:\n';
    weaveContext += context.weaveContext.bestPractices.map(p => `- ${p}`).join('\n');
  }

  hydrated = hydrated.replace(
    '{WEAVE_CONTEXT}',
    weaveContext.trim() || 'No specific Weave knowledge for this story'
  );

  // DoD context
  const dodContext = context.config.definitionOfDone
    .map(item => `- ${item}`)
    .join('\n');

  hydrated = hydrated.replace('{DOD_CONTEXT}', dodContext);

  // Instructions (role-specific)
  const instructions = generateRoleInstructions(context.role, context.config.wayOfWorking);
  hydrated = hydrated.replace('{INSTRUCTIONS}', instructions);

  return hydrated;
}

function generateRoleInstructions(role: string, wow: any): string {
  const baseInstructions = `
## General Guidelines
- Follow project conventions and patterns
- Test your work before marking complete
- Ask questions if requirements are unclear
- Document significant decisions
`.trim();

  const roleSpecific: Record<string, string> = {
    'backend-dev': `
## Backend Development
- Use existing patterns (CQRS, SSE, workers) where appropriate
- Follow database schema conventions
- Write clear error messages
- Add appropriate logging
- Test API endpoints
`,
    'frontend-dev': `
## Frontend Development
- Follow React/UI component patterns
- Use shadcn/ui components where available
- Ensure accessibility (a11y)
- Test user interactions
- Handle loading and error states
`,
    'cli-dev': `
## CLI Development
- Use Commander.js for command structure
- Provide clear help text
- Handle errors gracefully
- Use chalk for colored output
- Test all command variations
`,
    'backend-qa': `
## Backend QA
- Test all API endpoints
- Verify error handling
- Check edge cases
- Validate data persistence
- Test integration points
`,
    'frontend-qa': `
## Frontend QA
- Test UI components
- Verify accessibility
- Check responsive design
- Test user flows
- Validate error states
`,
    'cli-qa': `
## CLI QA
- Test all commands
- Verify output format
- Check error messages
- Test edge cases
- Validate help text
`
  };

  return (
    baseInstructions +
    '\n\n' +
    (roleSpecific[role] || '') +
    `\n\n**Testing Approach**: ${wow.testingApproach}\n**Workflow Style**: ${wow.workflowStyle}`
  ).trim();
}

// ============================================================================
// Helper Functions
// ============================================================================

function findStoryPath(storyId: string): string | null {
  // Try old flat structure first
  const flatPath = `.claude/loom/stories/${storyId}.json`;
  if (existsSync(flatPath)) {
    return flatPath;
  }

  // Try new feature-based structure
  const featuresDir = '.claude/loom/features';
  if (existsSync(featuresDir)) {
    const featureDirs = readdirSync(featuresDir);

    for (const featureDir of featureDirs) {
      const storyPath = join(featuresDir, featureDir, 'stories', storyId, 'story.json');
      if (existsSync(storyPath)) {
        return storyPath;
      }
    }
  }

  return null;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🧬 Loom Agent Hydration

Usage:
  bun .agent/loom/scripts/hydrate-agents.ts <story-id> <role>
  bun .agent/loom/scripts/hydrate-agents.ts <story-id> --all

Options:
  --all        Generate prompts for all roles in story
  --help, -h   Show this help

Examples:
  bun .agent/loom/scripts/hydrate-agents.ts US-001 backend-dev
  bun .agent/loom/scripts/hydrate-agents.ts US-001 --all
`);
    process.exit(0);
  }

  const storyId = args[0];
  const roleOrAll = args[1];

  // Load story (supports both flat and feature-based structure)
  const storyPath = findStoryPath(storyId);
  if (!storyPath) {
    console.error(`❌ Story not found: ${storyId}`);
    console.error(`   Searched in:`);
    console.error(`   - .claude/loom/stories/${storyId}.json (flat structure)`);
    console.error(`   - .claude/loom/features/*/stories/${storyId}/story.json (feature structure)`);
    process.exit(1);
  }

  console.log(`📖 Loading story from: ${storyPath}`);
  const story: Story = JSON.parse(readFileSync(storyPath, 'utf-8'));

  // Load config
  const configPath = '.agent/loom/config.json';
  if (!existsSync(configPath)) {
    console.error('❌ Loom not initialized. Run bootstrap first.');
    process.exit(1);
  }

  const config: LoomConfig = JSON.parse(readFileSync(configPath, 'utf-8'));

  // Query Weave for context
  const weaveContext = queryWeave(story.weaveRefs);

  // Determine which roles to hydrate
  let rolesToHydrate: string[];
  if (roleOrAll === '--all') {
    // Get unique roles from tasks
    rolesToHydrate = Array.from(new Set(story.tasks.map(t => t.assignedAgent)));
  } else {
    rolesToHydrate = [roleOrAll];
  }

  console.log(`\n🧬 Hydrating agents for ${storyId}...\n`);

  // Hydrate each role
  for (const role of rolesToHydrate) {
    const template = loadAgentTemplate(role);

    const context: AgentContext = {
      role,
      story,
      config,
      weaveContext
    };

    const hydrated = hydrateTemplate(template, context);

    console.log(`\n${'='.repeat(80)}`);
    console.log(`Role: ${role}`);
    console.log('='.repeat(80));
    console.log(hydrated);
    console.log('='.repeat(80));
  }

  console.log(`\n✅ Hydrated ${rolesToHydrate.length} agent(s)\n`);
}

main().catch(console.error);
