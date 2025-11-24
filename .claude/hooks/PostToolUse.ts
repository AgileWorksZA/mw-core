#!/usr/bin/env bun

/**
 * PostToolUse Hook - Send Events to Agios
 *
 * Sends significant tool use events from mw-core to agios for tracking.
 * This allows agios to monitor Loom activity in real-time.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface HookInput {
  hook_event_name: string;
  session_id: string;
  cwd: string;
  tool_name?: string;
  tool_input?: Record<string, any>;
  tool_output?: string;
  timestamp: string;
}

// Significant tools we want to track
const TRACKED_TOOLS = [
  'Write',
  'Edit',
  'Bash',
  'SlashCommand',
  'Task'
];

// Read hook input from stdin
const stdinText = await Bun.stdin.text();
const hookData = stdinText ? JSON.parse(stdinText) : {};

const input: HookInput = {
  hook_event_name: hookData.hook_event_name || 'PostToolUse',
  session_id: hookData.session_id || process.env.SESSION_ID || 'unknown',
  cwd: hookData.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd(),
  tool_name: hookData.tool_name,
  tool_input: hookData.tool_input,
  tool_output: hookData.tool_output,
  timestamp: new Date().toISOString()
};

try {
  // Only track significant tools
  if (!input.tool_name || !TRACKED_TOOLS.includes(input.tool_name)) {
    console.error(JSON.stringify({ continue: true }));
    process.exit(0);
  }

  // Get config for API URL
  const configPath = join(input.cwd, '.agent/config.json');
  let apiUrl = 'http://localhost:5173/api/v1/hook-events';

  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    apiUrl = config.agiosUrl || config.apiUrl || apiUrl;
  }

  // Prepare event payload
  const eventPayload = {
    sessionId: input.session_id,
    project: 'mw-core',
    hookEvent: 'PostToolUse',
    toolName: input.tool_name,
    metadata: {
      tool_input: input.tool_input,
      cwd: input.cwd
    },
    timestamp: input.timestamp
  };

  // Send to agios (fire and forget)
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayload)
  }).catch(() => {
    // Silently fail - don't block Claude if agios is down
  });

  // Always continue
  console.error(JSON.stringify({ continue: true }));
  process.exit(0);
} catch (error) {
  // Always continue even on error
  console.error(JSON.stringify({ continue: true }));
  process.exit(0);
}
