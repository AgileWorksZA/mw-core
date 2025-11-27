#!/usr/bin/env bun
/**
 * Loom Task Creation Utility
 *
 * Creates tasks and adds them to a story.
 *
 * Usage:
 *   bun .agent/loom/scripts/task-create.ts US-001 --title "Implement API" --role backend-dev
 *   echo '[{"title":"...","description":"...","assignedAgent":"..."}]' | bun .agent/loom/scripts/task-create.ts US-001 --stdin
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

// ============================================================================
// Types
// ============================================================================

interface Task {
  id: string;
  storyId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'blocked' | 'completed';
  assignedAgent: string;
  dependencies: string[];
  sessionId: string | null;
  transactionId: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface TaskInput {
  title: string;
  description: string;
  assignedAgent: string;
  dependencies?: string[];
}

interface Story {
  id: string;
  tasks: Task[];
  [key: string]: any;
}

interface LoomConfig {
  taskCounter: number;
  roles: string[];
  [key: string]: any;
}

// ============================================================================
// ID Generation
// ============================================================================

function getNextTaskId(storyId: string): string {
  const configPath = '.agent/loom/config.json';

  if (!existsSync(configPath)) {
    console.error('❌ Loom not initialized. Run bootstrap first.');
    process.exit(1);
  }

  const config: LoomConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
  const nextId = config.taskCounter + 1;

  // Update counter
  config.taskCounter = nextId;
  writeFileSync(configPath, JSON.stringify(config, null, 2));

  // Format: US-001-T-001, US-001-T-002, etc.
  return `${storyId}-T-${String(nextId).padStart(3, '0')}`;
}

// ============================================================================
// Task Creation
// ============================================================================

function createTask(storyId: string, input: TaskInput): Task {
  const taskId = getNextTaskId(storyId);

  const task: Task = {
    id: taskId,
    storyId,
    title: input.title,
    description: input.description,
    status: 'pending',
    assignedAgent: input.assignedAgent,
    dependencies: input.dependencies || [],
    sessionId: null,
    transactionId: null,
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  return task;
}

// ============================================================================
// Story Updates
// ============================================================================

function loadStory(storyId: string): Story {
  const storyPath = `.claude/loom/stories/${storyId}.json`;

  if (!existsSync(storyPath)) {
    console.error(`❌ Story not found: ${storyPath}`);
    process.exit(1);
  }

  return JSON.parse(readFileSync(storyPath, 'utf-8'));
}

function saveStory(story: Story): void {
  const storyPath = `.claude/loom/stories/${story.id}.json`;
  writeFileSync(storyPath, JSON.stringify(story, null, 2));
}

function addTaskToStory(storyId: string, task: Task): void {
  const story = loadStory(storyId);

  if (!story.tasks) {
    story.tasks = [];
  }

  story.tasks.push(task);
  saveStory(story);

  console.log(`✅ Task added to story ${storyId}: ${task.id}`);
}

// ============================================================================
// Validation
// ============================================================================

function validateTask(task: Task, story: Story, config: LoomConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate role exists in config
  if (!config.roles.includes(task.assignedAgent)) {
    errors.push(`Unknown role: ${task.assignedAgent}. Available: ${config.roles.join(', ')}`);
  }

  // Validate dependencies exist
  const existingTaskIds = story.tasks.map(t => t.id);
  for (const depId of task.dependencies) {
    if (!existingTaskIds.includes(depId)) {
      errors.push(`Dependency not found: ${depId}`);
    }
  }

  // Validate no circular dependencies (basic check)
  if (task.dependencies.includes(task.id)) {
    errors.push('Task cannot depend on itself');
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
📋 Loom Task Creation

Usage:
  # Single task
  bun .agent/loom/scripts/task-create.ts US-001 \\
    --title "Implement API endpoint" \\
    --description "Create POST /api/users endpoint" \\
    --role backend-dev \\
    --depends US-001-T-001

  # Multiple tasks from stdin
  echo '[
    {"title":"...","description":"...","assignedAgent":"backend-dev"},
    {"title":"...","description":"...","assignedAgent":"frontend-dev","dependencies":["US-001-T-001"]}
  ]' | bun .agent/loom/scripts/task-create.ts US-001 --stdin

Options:
  --title       Task title (required)
  --description Task description (required)
  --role        Agent role to assign (required)
  --depends     Task ID this depends on (can specify multiple times)
  --stdin       Read task array from stdin (JSON)
  --help, -h    Show this help
`);
    process.exit(0);
  }

  if (args.length === 0) {
    console.error('❌ Story ID required');
    process.exit(1);
  }

  const storyId = args[0];
  const story = loadStory(storyId);

  const configPath = '.agent/loom/config.json';
  const config: LoomConfig = JSON.parse(readFileSync(configPath, 'utf-8'));

  // Read from stdin (array of tasks)
  if (args.includes('--stdin')) {
    const stdinData = await Bun.stdin.text();
    const inputs: TaskInput[] = JSON.parse(stdinData);

    console.log(`\n📋 Creating ${inputs.length} tasks for ${storyId}...\n`);

    for (const input of inputs) {
      const task = createTask(storyId, input);
      const validation = validateTask(task, story, config);

      if (!validation.valid) {
        console.error(`❌ Invalid task: ${task.title}`);
        for (const error of validation.errors) {
          console.error(`   - ${error}`);
        }
        continue;
      }

      addTaskToStory(storyId, task);
      console.log(`   ${task.id}: ${task.title} (${task.assignedAgent})`);

      // Reload story for next iteration (to include this task)
      Object.assign(story, loadStory(storyId));
    }

    console.log('');
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
    const role = getArg('--role');

    if (!title || !description || !role) {
      console.error('❌ Missing required arguments: --title, --description, --role');
      process.exit(1);
    }

    const input: TaskInput = {
      title,
      description,
      assignedAgent: role,
      dependencies: getArgs('--depends')
    };

    const task = createTask(storyId, input);
    const validation = validateTask(task, story, config);

    if (!validation.valid) {
      console.error('❌ Invalid task:');
      for (const error of validation.errors) {
        console.error(`   - ${error}`);
      }
      process.exit(1);
    }

    addTaskToStory(storyId, task);

    console.log('\n📊 Task Summary:');
    console.log(`   ID: ${task.id}`);
    console.log(`   Title: ${task.title}`);
    console.log(`   Role: ${task.assignedAgent}`);
    console.log(`   Dependencies: ${task.dependencies.length > 0 ? task.dependencies.join(', ') : 'none'}`);
    console.log('');
  }

  console.log('✅ Tasks created successfully');
  console.log('   Use dependency-graph.ts to visualize task order');
  console.log('');
}

main().catch(console.error);
