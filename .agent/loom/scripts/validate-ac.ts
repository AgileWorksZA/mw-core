#!/usr/bin/env bun
/**
 * Loom Acceptance Criteria Validation Utility
 *
 * Validates and updates acceptance criteria status in story.json.
 * Can run automated checks or record manual verification results.
 *
 * Usage:
 *   # List all AC for a story
 *   bun .agent/loom/scripts/validate-ac.ts US-001 --list
 *
 *   # Update AC status
 *   bun .agent/loom/scripts/validate-ac.ts US-001 US-001-AC-001 pass
 *   bun .agent/loom/scripts/validate-ac.ts US-001 US-001-AC-002 fail --evidence "SSE endpoint returns 404"
 *
 *   # Validate all AC (interactive)
 *   bun .agent/loom/scripts/validate-ac.ts US-001 --validate-all
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

type ACStatus = 'pending' | 'pass' | 'fail';

interface AcceptanceCriterion {
  id: string;
  storyId: string;
  description: string;
  testable: boolean;
  tested: boolean;
  evidence: string | null;
  status: ACStatus;
}

interface Story {
  id: string;
  status: string;
  acceptanceCriteria: AcceptanceCriterion[];
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
// AC Status Update
// ============================================================================

function updateACStatus(
  storyId: string,
  acId: string,
  newStatus: ACStatus,
  evidence?: string
): void {
  // Find story
  const storyPath = findStoryPath(storyId);
  if (!storyPath) {
    console.error(`❌ Story not found: ${storyId}`);
    process.exit(1);
  }

  // Load story
  const story: Story = JSON.parse(readFileSync(storyPath, 'utf-8'));

  // Find AC
  const ac = story.acceptanceCriteria.find(a => a.id === acId);
  if (!ac) {
    console.error(`❌ AC not found: ${acId}`);
    console.error(`   Available AC: ${story.acceptanceCriteria.map(a => a.id).join(', ')}`);
    process.exit(1);
  }

  // Update AC
  const oldStatus = ac.status;
  ac.status = newStatus;
  ac.tested = true;

  if (evidence) {
    ac.evidence = evidence;
  }

  // Write updated story
  writeFileSync(storyPath, JSON.stringify(story, null, 2));

  // Output confirmation
  const statusIcon = newStatus === 'pass' ? '✅' : newStatus === 'fail' ? '❌' : '⏳';
  console.log(`${statusIcon} AC status updated`);
  console.log(`   Story: ${storyId}`);
  console.log(`   AC: ${acId}`);
  console.log(`   Status: ${oldStatus} → ${newStatus}`);
  if (evidence) {
    console.log(`   Evidence: ${evidence}`);
  }
}

// ============================================================================
// List All AC
// ============================================================================

function listAcceptanceCriteria(storyId: string): void {
  // Find story
  const storyPath = findStoryPath(storyId);
  if (!storyPath) {
    console.error(`❌ Story not found: ${storyId}`);
    process.exit(1);
  }

  // Load story
  const story: Story = JSON.parse(readFileSync(storyPath, 'utf-8'));

  console.log(`\n📋 Acceptance Criteria for ${storyId}`);
  console.log(`   Story: ${story.id}`);
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (story.acceptanceCriteria.length === 0) {
    console.log('   No acceptance criteria defined.\n');
    return;
  }

  for (const ac of story.acceptanceCriteria) {
    const statusIcon = ac.status === 'pass' ? '✅' : ac.status === 'fail' ? '❌' : '⏳';
    const testedBadge = ac.tested ? '[TESTED]' : '[UNTESTED]';

    console.log(`   ${statusIcon} ${ac.id} ${testedBadge}`);
    console.log(`      ${ac.description}`);
    if (ac.evidence) {
      console.log(`      Evidence: ${ac.evidence}`);
    }
    console.log('');
  }

  // Summary
  const total = story.acceptanceCriteria.length;
  const passed = story.acceptanceCriteria.filter(a => a.status === 'pass').length;
  const failed = story.acceptanceCriteria.filter(a => a.status === 'fail').length;
  const pending = story.acceptanceCriteria.filter(a => a.status === 'pending').length;

  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Summary: ${passed}/${total} passed, ${failed} failed, ${pending} pending\n`);
}

// ============================================================================
// Validate All AC (Framework)
// ============================================================================

function validateAllAcceptanceCriteria(storyId: string): void {
  // Find story
  const storyPath = findStoryPath(storyId);
  if (!storyPath) {
    console.error(`❌ Story not found: ${storyId}`);
    process.exit(1);
  }

  // Load story
  const story: Story = JSON.parse(readFileSync(storyPath, 'utf-8'));

  console.log(`\n🧪 Validating Acceptance Criteria for ${storyId}\n`);

  // This is a framework - actual validation logic should be implemented
  // in the main agent during /loom:start execution
  console.log('⚠️  This utility provides AC validation infrastructure.');
  console.log('    Actual validation should be performed by specialized QA agents');
  console.log('    during the /loom:start workflow.\n');

  console.log('Suggested validation approaches by AC type:\n');

  for (const ac of story.acceptanceCriteria) {
    console.log(`📋 ${ac.id}: ${ac.description}`);

    // Suggest validation method based on AC description
    const desc = ac.description.toLowerCase();

    if (desc.includes('test') || desc.includes('passing')) {
      console.log('   → Run automated test suite');
      console.log('   → Command: bun test --grep "your-test-pattern"');
    } else if (desc.includes('api') || desc.includes('endpoint')) {
      console.log('   → Test API endpoint');
      console.log('   → Command: curl or HTTP test');
    } else if (desc.includes('ui') || desc.includes('display') || desc.includes('dashboard')) {
      console.log('   → Manual UI verification');
      console.log('   → Use Chrome MCP or manual inspection');
    } else if (desc.includes('real-time') || desc.includes('sse')) {
      console.log('   → Test SSE connection');
      console.log('   → Verify WebSocket/SSE updates');
    } else {
      console.log('   → Manual verification required');
    }

    console.log(`   → Update status: bun .agent/loom/scripts/validate-ac.ts ${storyId} ${ac.id} pass|fail --evidence "..."`);
    console.log('');
  }
}

// ============================================================================
// CLI
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🧪 Loom Acceptance Criteria Validation

Usage:
  # List all AC for a story
  bun .agent/loom/scripts/validate-ac.ts <story-id> --list

  # Update AC status
  bun .agent/loom/scripts/validate-ac.ts <story-id> <ac-id> <status> [--evidence "..."]

  # Show validation suggestions
  bun .agent/loom/scripts/validate-ac.ts <story-id> --validate-all

Arguments:
  story-id    Story identifier (e.g., US-001)
  ac-id       AC identifier (e.g., US-001-AC-001)
  status      New status: pass | fail | pending

Options:
  --list              List all AC for story
  --validate-all      Show validation suggestions for all AC
  --evidence <text>   Evidence for verification (required for fail)
  --help, -h          Show this help

Examples:
  # List all AC
  bun .agent/loom/scripts/validate-ac.ts US-001 --list

  # Mark AC as passing
  bun .agent/loom/scripts/validate-ac.ts US-001 US-001-AC-001 pass \\
    --evidence "Test suite passing: all 15 tests green"

  # Mark AC as failing
  bun .agent/loom/scripts/validate-ac.ts US-001 US-001-AC-002 fail \\
    --evidence "SSE endpoint returns 404, expected 200"

  # Show validation suggestions
  bun .agent/loom/scripts/validate-ac.ts US-001 --validate-all
`);
    process.exit(0);
  }

  const storyId = args[0];

  // Handle flags
  if (args.includes('--list')) {
    listAcceptanceCriteria(storyId);
    return;
  }

  if (args.includes('--validate-all')) {
    validateAllAcceptanceCriteria(storyId);
    return;
  }

  // Update AC status
  if (args.length < 3) {
    console.error('❌ Missing required arguments: <ac-id> <status>');
    console.error('   Use --help for usage information');
    process.exit(1);
  }

  const acId = args[1];
  const status = args[2] as ACStatus;

  // Validate status
  const validStatuses: ACStatus[] = ['pending', 'pass', 'fail'];
  if (!validStatuses.includes(status)) {
    console.error(`❌ Invalid status: ${status}`);
    console.error(`   Valid statuses: ${validStatuses.join(', ')}`);
    process.exit(1);
  }

  // Parse evidence
  let evidence: string | undefined;
  const evidenceIdx = args.indexOf('--evidence');
  if (evidenceIdx !== -1 && evidenceIdx + 1 < args.length) {
    evidence = args[evidenceIdx + 1];
  }

  // Require evidence for failures
  if (status === 'fail' && !evidence) {
    console.error('❌ Evidence is required when marking AC as failed');
    console.error('   Use --evidence "description of failure"');
    process.exit(1);
  }

  // Update AC status
  updateACStatus(storyId, acId, status, evidence);
}

main();
