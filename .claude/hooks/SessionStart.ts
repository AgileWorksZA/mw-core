#!/usr/bin/env bun

/**
 * SessionStart Hook - Automatic Session Naming
 *
 * Automatically assigns user-friendly names to Claude Code sessions.
 * Sessions get memorable names like "brave-elephant" instead of UUIDs.
 *
 * Names are stored in .claude/sessions.json for bidirectional lookup.
 */

import { SessionNamer } from 'claude-hooks-sdk';

interface HookInput {
  hook_event_name: string;
  session_id: string;
  cwd: string;
  timestamp: string;
  context?: Record<string, any>;
}

// Read input from stdin
const stdinText = await Bun.stdin.text();
let input: HookInput;

try {
  input = JSON.parse(stdinText);
} catch (error) {
  // Fallback if JSON parsing fails
  input = {
    hook_event_name: 'SessionStart',
    session_id: process.env.SESSION_ID || 'unknown',
    cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    timestamp: new Date().toISOString(),
    context: {}
  };
}

try {
  // Initialize session namer
  const namer = new SessionNamer();

  // Assign session name automatically
  const sessionName = namer.assignName(input.session_id, {
    source: input.context?.resumedFrom ? 'resume' : 'new'
  });

  // Output success message with session name
  console.error(JSON.stringify({
    continue: true,
    message: `Session: ${sessionName} (${input.session_id})`
  }));

  process.exit(0);
} catch (error) {
  console.error('[SessionStart Hook] Error:', error instanceof Error ? error.message : String(error));

  // Always continue even on error
  console.error(JSON.stringify({
    continue: true
  }));

  process.exit(0);
}
