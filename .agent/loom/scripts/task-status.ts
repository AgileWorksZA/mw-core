#!/usr/bin/env bun
/**
 * Loom Task Status Utility
 *
 * Updates task status in story.json files.
 * Called during execution to track progress.
 *
 * Usage:
 *   bun .agent/loom/scripts/task-status.ts <story-id> <task-id> <status>
 *   bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 in-progress
 *   bun .agent/loom/scripts/task-status.ts US-001 US-001-T-002 completed
 *   bun .agent/loom/scripts/task-status.ts US-001 US-001-T-003 failed
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'blocked';

interface Task {
  id: string;
  storyId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedAgent: string;
  dependencies: string[];
  sessionId: string | null;
  transactionId: string | null;
  createdAt: string;
  startedAt?: string;
  completedAt: string | null;
  error?: string;
}

interface Story {
  id: string;
  status: string;
  tasks: Task[];
  [key: string]: any;
}

// ============================================================================
// Story Path Resolution
// ============================================================================

function findStoryPath(storyId: string): string | null {
  // Try flat structure
  const flatPath = `.claude/loom/stories/${storyId}.json`;
  if (existsSync(flatPath)) {
    return flatPath;
  }

  // Try feature-based structure
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
// Task Status Update
// ============================================================================

function updateTaskStatus(
  storyId: string,
  taskId: string,
  newStatus: TaskStatus,
  options?: {
    sessionId?: string;
    transactionId?: string;
    error?: string;
  }
): void {
  // Find story
  const storyPath = findStoryPath(storyId);
  if (!storyPath) {
    console.error(`❌ Story not found: ${storyId}`);
    process.exit(1);
  }

  // Load story
  const story: Story = JSON.parse(readFileSync(storyPath, 'utf-8'));

  // Find task
  const task = story.tasks.find(t => t.id === taskId);
  if (!task) {
    console.error(`❌ Task not found: ${taskId}`);
    console.error(`   Available tasks: ${story.tasks.map(t => t.id).join(', ')}`);
    process.exit(1);
  }

  // Update task status
  const oldStatus = task.status;
  task.status = newStatus;

  // Update timestamps
  const now = new Date().toISOString();
  if (newStatus === 'in-progress' && !task.startedAt) {
    task.startedAt = now;
  }
  if (newStatus === 'completed' || newStatus === 'failed') {
    task.completedAt = now;
  }

  // Update session/transaction IDs
  if (options?.sessionId) {
    task.sessionId = options.sessionId;
  }
  if (options?.transactionId) {
    task.transactionId = options.transactionId;
  }

  // Store error if failed
  if (newStatus === 'failed' && options?.error) {
    task.error = options.error;
  }

  // Write updated story
  writeFileSync(storyPath, JSON.stringify(story, null, 2));

  // Output confirmation
  console.log(`✅ Task status updated`);
  console.log(`   Story: ${storyId}`);
  console.log(`   Task: ${taskId}`);
  console.log(`   Status: ${oldStatus} → ${newStatus}`);
  if (task.startedAt && newStatus === 'in-progress') {
    console.log(`   Started: ${task.startedAt}`);
  }
  if (task.completedAt && (newStatus === 'completed' || newStatus === 'failed')) {
    console.log(`   Completed: ${task.completedAt}`);
  }
}

// ============================================================================
// CLI
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length < 3 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🔄 Loom Task Status Utility

Usage:
  bun .agent/loom/scripts/task-status.ts <story-id> <task-id> <status>

Arguments:
  story-id    Story identifier (e.g., US-001)
  task-id     Task identifier (e.g., US-001-T-001)
  status      New status: pending | in-progress | completed | failed | blocked

Options:
  --session-id <id>       Session ID to record
  --transaction-id <id>   Transaction ID to record
  --error <message>       Error message (for failed status)
  --help, -h              Show this help

Examples:
  # Mark task as in-progress
  bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 in-progress

  # Mark task as completed with session tracking
  bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 completed \\
    --session-id "abc-123" \\
    --transaction-id "tx-456"

  # Mark task as failed with error
  bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 failed \\
    --error "Database migration failed"
`);
    process.exit(0);
  }

  const storyId = args[0];
  const taskId = args[1];
  const status = args[2] as TaskStatus;

  // Validate status
  const validStatuses: TaskStatus[] = ['pending', 'in-progress', 'completed', 'failed', 'blocked'];
  if (!validStatuses.includes(status)) {
    console.error(`❌ Invalid status: ${status}`);
    console.error(`   Valid statuses: ${validStatuses.join(', ')}`);
    process.exit(1);
  }

  // Parse options
  const options: {
    sessionId?: string;
    transactionId?: string;
    error?: string;
  } = {};

  const sessionIdx = args.indexOf('--session-id');
  if (sessionIdx !== -1 && sessionIdx + 1 < args.length) {
    options.sessionId = args[sessionIdx + 1];
  }

  const txIdx = args.indexOf('--transaction-id');
  if (txIdx !== -1 && txIdx + 1 < args.length) {
    options.transactionId = args[txIdx + 1];
  }

  const errorIdx = args.indexOf('--error');
  if (errorIdx !== -1 && errorIdx + 1 < args.length) {
    options.error = args[errorIdx + 1];
  }

  // Update task status
  updateTaskStatus(storyId, taskId, status, options);
}

main();
