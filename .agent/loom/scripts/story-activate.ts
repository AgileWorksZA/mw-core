#!/usr/bin/env bun
/**
 * Loom Story Activation Utility
 *
 * Marks a story as active for session tracking.
 * Creates .claude/loom/.active file with story ID.
 *
 * Usage:
 *   bun .agent/loom/scripts/story-activate.ts US-001
 *   bun .agent/loom/scripts/story-activate.ts --clear
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';

const ACTIVE_FILE = '.claude/loom/.active';

function activateStory(storyId: string): void {
  // Verify story exists
  const storyPath = `.claude/loom/stories/${storyId}.json`;
  if (!existsSync(storyPath)) {
    console.error(`❌ Story not found: ${storyPath}`);
    process.exit(1);
  }

  // Read story to get title
  const story = JSON.parse(readFileSync(storyPath, 'utf-8'));

  // Write active marker
  writeFileSync(ACTIVE_FILE, storyId);

  console.log(`✅ Story activated: ${storyId} - ${story.title}`);
  console.log(`   Session tracking enabled`);
  console.log(`   All hook events will be correlated to this story`);
}

function clearActive(): void {
  if (existsSync(ACTIVE_FILE)) {
    const storyId = readFileSync(ACTIVE_FILE, 'utf-8').trim();
    unlinkSync(ACTIVE_FILE);
    console.log(`✅ Cleared active story: ${storyId}`);
  } else {
    console.log('ℹ️  No active story to clear');
  }
}

function getActive(): string | null {
  if (!existsSync(ACTIVE_FILE)) {
    return null;
  }
  return readFileSync(ACTIVE_FILE, 'utf-8').trim();
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎯 Loom Story Activation

Usage:
  # Activate a story
  bun .agent/loom/scripts/story-activate.ts US-001

  # Clear active story
  bun .agent/loom/scripts/story-activate.ts --clear

  # Check current active story
  bun .agent/loom/scripts/story-activate.ts --status

Purpose:
  When a story is active, all session tracking hooks will
  automatically correlate events to this story. This enables:
  - Session tracking (sessionId, transactionId)
  - Hook event correlation
  - Transcript correlation
  - Complete audit trail

The active marker is cleared when:
  - Story is completed (/loom:complete)
  - Explicitly cleared (--clear)
  - Different story is activated
`);
    process.exit(0);
  }

  if (args.includes('--clear')) {
    clearActive();
    return;
  }

  if (args.includes('--status')) {
    const activeId = getActive();
    if (activeId) {
      const storyPath = `.claude/loom/stories/${activeId}.json`;
      if (existsSync(storyPath)) {
        const story = JSON.parse(readFileSync(storyPath, 'utf-8'));
        console.log(`📌 Active story: ${activeId} - ${story.title}`);
        console.log(`   Status: ${story.status}`);
        console.log(`   Sessions: ${story.sessions?.length || 0}`);
      } else {
        console.log(`⚠️  Active marker exists but story not found: ${activeId}`);
      }
    } else {
      console.log('ℹ️  No active story');
    }
    return;
  }

  if (args.length === 0) {
    console.error('❌ Story ID required');
    console.error('   Usage: bun .agent/loom/scripts/story-activate.ts US-001');
    process.exit(1);
  }

  const storyId = args[0];
  activateStory(storyId);
}

main();
