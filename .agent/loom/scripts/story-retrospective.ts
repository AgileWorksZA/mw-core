#!/usr/bin/env bun
/**
 * Loom Story Retrospective Generator
 *
 * Analyzes completed story and generates comprehensive retrospective
 * by correlating:
 * - Story metadata (tasks, AC, decisions)
 * - Session transcripts (scrolls)
 * - Hook events (by transactionId)
 *
 * Usage:
 *   bun .agent/loom/scripts/story-retrospective.ts US-001
 *   bun .agent/loom/scripts/story-retrospective.ts US-001 --verbose
 *   bun .agent/loom/scripts/story-retrospective.ts US-001 --force
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// ============================================================================
// Types (matching Loom ontology)
// ============================================================================

interface Story {
  id: string;
  title: string;
  description: string;
  why: string;
  status: string;
  priority: string;
  estimatedComplexity: string;
  sessions: Session[];
  hookEvents: HookEvent[];
  tasks: Task[];
  acceptanceCriteria: AcceptanceCriterion[];
  decisions: Decision[];
  learnings: string[];
  weaveRefs: string[];
  createdAt: string;
  completedAt: string | null;
}

interface Session {
  sessionId: string;
  sessionName: string;
  transactionId: string;
  transcriptPath: string;
  storyId: string;
  phase: string;
  started: string;
  ended: string | null;
  significant: boolean;
}

interface HookEvent {
  transactionId: string;
  sessionId: string;
  eventType: string;
  toolName: string | null;
  metadata: any;
  timestamp: string;
}

interface Task {
  id: string;
  storyId: string;
  title: string;
  description: string;
  status: string;
  assignedAgent: string;
  dependencies: string[];
  sessionId: string | null;
  transactionId: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface AcceptanceCriterion {
  id: string;
  storyId: string;
  description: string;
  testable: boolean;
  tested: boolean;
  evidence: string | null;
  status: string;
}

interface Decision {
  id: string;
  storyId: string;
  question: string;
  options: string[];
  chosen: string;
  rationale: string;
  sessionId: string;
  timestamp: string;
}

// ============================================================================
// Transcript Analysis
// ============================================================================

function getTranscriptPath(sessionId: string): string {
  const cwd = process.cwd();
  const encodedPath = cwd.replace(/\//g, '-');
  const projectDir = join(homedir(), '.claude', 'projects', encodedPath);
  return join(projectDir, `${sessionId}.jsonl`);
}

function analyzeTranscript(transcriptPath: string, transactionId: string): {
  keyMoments: string[];
  toolsUsed: Set<string>;
  summary: string;
} {
  if (!existsSync(transcriptPath)) {
    return {
      keyMoments: [],
      toolsUsed: new Set(),
      summary: 'Transcript not found'
    };
  }

  const content = readFileSync(transcriptPath, 'utf-8');
  const lines = content.split('\n').filter(Boolean);

  const keyMoments: string[] = [];
  const toolsUsed = new Set<string>();

  for (const line of lines) {
    try {
      const obj = JSON.parse(line);

      // Collect tool uses
      if (obj.type === 'assistant' && obj.message?.content) {
        for (const block of obj.message.content) {
          if (block.type === 'tool_use') {
            toolsUsed.add(block.name);
          }
        }
      }

      // Collect key user questions/inputs
      if (obj.type === 'user' && obj.message?.content) {
        const content = typeof obj.message.content === 'string'
          ? obj.message.content
          : JSON.stringify(obj.message.content);

        if (content.includes('?') || content.length > 100) {
          keyMoments.push(content.slice(0, 150));
        }
      }
    } catch (error) {
      // Skip malformed lines
    }
  }

  return {
    keyMoments: keyMoments.slice(0, 5), // Top 5
    toolsUsed,
    summary: `Session analyzed: ${keyMoments.length} key moments, ${toolsUsed.size} tools used`
  };
}

// ============================================================================
// Retrospective Generation
// ============================================================================

function generateRetrospective(story: Story, verbose: boolean = false): string {
  const output: string[] = [];

  // Header
  output.push(`# Retrospective: ${story.id} - ${story.title}`);
  output.push('');
  output.push(`**Generated**: ${new Date().toISOString()}`);
  output.push(`**Status**: ${story.status}`);
  output.push('');
  output.push('---');
  output.push('');

  // Summary
  output.push('## 📊 Summary');
  output.push('');

  const duration = story.completedAt
    ? Math.ceil((new Date(story.completedAt).getTime() - new Date(story.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 'in progress';

  const completedTasks = story.tasks.filter(t => t.status === 'completed').length;
  const passedAC = story.acceptanceCriteria.filter(ac => ac.status === 'pass').length;

  const phases = new Set(story.sessions.map(s => s.phase));

  output.push(`- **Duration**: ${new Date(story.createdAt).toLocaleDateString()} to ${story.completedAt ? new Date(story.completedAt).toLocaleDateString() : 'ongoing'} (${duration} days)`);
  output.push(`- **Sessions**: ${story.sessions.length} sessions`);
  output.push(`- **Tasks**: ${completedTasks}/${story.tasks.length}`);
  output.push(`- **Acceptance Criteria**: ${passedAC}/${story.acceptanceCriteria.length}`);
  output.push(`- **Complexity**: ${story.estimatedComplexity}`);
  output.push(`- **Phases**: ${Array.from(phases).join(', ')}`);
  output.push('');
  output.push('---');
  output.push('');

  // Story Context
  output.push('## 🎯 Story Context');
  output.push('');
  output.push('### Why (Motivation)');
  output.push(story.why || 'Not documented');
  output.push('');
  output.push('### What (Description)');
  output.push(story.description);
  output.push('');
  output.push('### Acceptance Criteria');
  for (const ac of story.acceptanceCriteria) {
    const icon = ac.status === 'pass' ? '✅' : ac.status === 'fail' ? '❌' : '⏳';
    output.push(`- [${icon}] ${ac.id}: ${ac.description}`);
    if (ac.tested) {
      output.push(`  - Tested: yes`);
      if (ac.evidence) {
        output.push(`  - Evidence: ${ac.evidence}`);
      }
    }
  }
  output.push('');
  output.push('---');
  output.push('');

  // Key Decisions
  if (story.decisions.length > 0) {
    output.push('## 🎯 Key Decisions');
    output.push('');
    for (const decision of story.decisions) {
      output.push(`### ${decision.id}: ${decision.question}`);
      output.push(`- **Options Considered**: ${decision.options.join(', ')}`);
      output.push(`- **Chosen**: ${decision.chosen}`);
      output.push(`- **Rationale**: ${decision.rationale}`);
      output.push(`- **Session**: ${decision.sessionId.slice(0, 8)}...`);
      output.push('');
    }
    output.push('---');
    output.push('');
  }

  // Learnings
  if (story.learnings.length > 0) {
    output.push('## 💡 Learnings');
    output.push('');
    for (const learning of story.learnings) {
      output.push(`- ${learning}`);
    }
    output.push('');
    output.push('---');
    output.push('');
  }

  // Session Breakdown
  output.push('## 📈 Session Breakdown');
  output.push('');

  for (let i = 0; i < story.sessions.length; i++) {
    const session = story.sessions[i];
    const sessionEvents = story.hookEvents.filter(e => e.sessionId === session.sessionId);

    output.push(`### Session ${i + 1}: ${session.sessionName || 'unnamed'}`);
    output.push(`- **ID**: ${session.sessionId} (short: ${session.sessionId.slice(0, 8)})`);
    output.push(`- **Phase**: ${session.phase}`);
    output.push(`- **Started**: ${new Date(session.started).toLocaleString()}`);
    if (session.ended) {
      output.push(`- **Ended**: ${new Date(session.ended).toLocaleString()}`);
      const durationMs = new Date(session.ended).getTime() - new Date(session.started).getTime();
      const durationMin = Math.round(durationMs / (1000 * 60));
      output.push(`- **Duration**: ${durationMin} minutes`);
    }
    output.push(`- **Transaction ID**: ${session.transactionId}`);
    output.push('');

    // Significant events
    if (sessionEvents.length > 0) {
      output.push(`**Significant Events** (${sessionEvents.length}):`);
      for (const event of sessionEvents.slice(0, 10)) { // Limit to 10 per session
        const meta = event.metadata?.file || JSON.stringify(event.metadata);
        output.push(`- [${new Date(event.timestamp).toLocaleTimeString()}] ${event.eventType}: ${event.toolName || 'unknown'} - ${meta}`);
      }
      if (sessionEvents.length > 10) {
        output.push(`- ... and ${sessionEvents.length - 10} more events`);
      }
      output.push('');
    }

    // Transcript analysis
    if (verbose) {
      const transcriptPath = getTranscriptPath(session.sessionId);
      const analysis = analyzeTranscript(transcriptPath, session.transactionId);

      if (analysis.toolsUsed.size > 0) {
        output.push(`**Tools Used**: ${Array.from(analysis.toolsUsed).join(', ')}`);
        output.push('');
      }

      if (analysis.keyMoments.length > 0) {
        output.push(`**Key Moments**:`);
        for (const moment of analysis.keyMoments) {
          output.push(`- ${moment}`);
        }
        output.push('');
      }
    }

    output.push('');
  }

  output.push('---');
  output.push('');

  // Weave Recommendations
  output.push('## 🔗 Weave Recommendations');
  output.push('');
  output.push('Based on this retrospective, consider adding to Weave:');
  output.push('');

  if (story.learnings.length > 0) {
    output.push('### Praxeology (Π:)');
    output.push('{Best practices identified during this story}');
    output.push('');
  }

  if (story.decisions.length > 0) {
    output.push('### Modality (Μ:)');
    for (const decision of story.decisions) {
      output.push(`- \`decision:${decision.id.toLowerCase()}\`: Chose "${decision.chosen}" over ${decision.options.filter(o => o !== decision.chosen).join(', ')} because ${decision.rationale}`);
    }
    output.push('');
  }

  if (story.weaveRefs.length > 0) {
    output.push('### Related Weave Entities');
    for (const ref of story.weaveRefs) {
      output.push(`- ${ref}`);
    }
    output.push('');
  }

  output.push('---');
  output.push('');

  // Artifacts
  output.push('## 📦 Artifacts');
  output.push('');
  output.push(`- **Story**: \`.claude/loom/stories/${story.id}.json\` + \`.md\``);
  output.push(`- **Retrospective**: \`.claude/loom/retrospectives/${story.id}.md\``);
  output.push(`- **Transcripts**:`);
  for (const session of story.sessions) {
    output.push(`  - ${session.sessionName || session.sessionId.slice(0, 8)}: ${getTranscriptPath(session.sessionId)}`);
  }
  output.push('');

  output.push('---');
  output.push('');

  // Next Action
  output.push('**Next Action**: Use `/weave:reflect` to add these learnings to the institutional knowledge base.');
  output.push('');

  return output.join('\n');
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🔍 Loom Story Retrospective Generator

Usage:
  bun .agent/loom/scripts/story-retrospective.ts <story-id> [options]

Options:
  --verbose, -v    Include detailed transcript analysis
  --force, -f      Regenerate even if retrospective exists
  --help, -h       Show this help

Examples:
  bun .agent/loom/scripts/story-retrospective.ts US-001
  bun .agent/loom/scripts/story-retrospective.ts US-001 --verbose
  bun .agent/loom/scripts/story-retrospective.ts US-001 --force
`);
    process.exit(0);
  }

  const storyId = args[0];
  const verbose = args.includes('--verbose') || args.includes('-v');
  const force = args.includes('--force') || args.includes('-f');

  // Load story
  const storyJsonPath = `.claude/loom/stories/${storyId}.json`;
  if (!existsSync(storyJsonPath)) {
    console.error(`❌ Story not found: ${storyJsonPath}`);
    process.exit(1);
  }

  const story: Story = JSON.parse(readFileSync(storyJsonPath, 'utf-8'));

  // Check if retrospective exists
  const retroPath = `.claude/loom/retrospectives/${storyId}.md`;
  if (existsSync(retroPath) && !force) {
    console.log(`ℹ Retrospective already exists: ${retroPath}`);
    console.log('  Use --force to regenerate');
    process.exit(0);
  }

  console.log(`\n🔍 Generating retrospective for ${storyId}...\n`);

  // Generate retrospective
  const retrospective = generateRetrospective(story, verbose);

  // Write to file
  writeFileSync(retroPath, retrospective);

  console.log(`✅ Retrospective generated: ${retroPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Sessions: ${story.sessions.length}`);
  console.log(`   - Tasks: ${story.tasks.filter(t => t.status === 'completed').length}/${story.tasks.length}`);
  console.log(`   - AC: ${story.acceptanceCriteria.filter(ac => ac.status === 'pass').length}/${story.acceptanceCriteria.length}`);
  console.log(`   - Decisions: ${story.decisions.length}`);
  console.log(`   - Hook Events: ${story.hookEvents.length}`);
  console.log('');
}

main().catch(console.error);
