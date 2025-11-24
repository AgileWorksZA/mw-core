#!/usr/bin/env bun

/**
 * Universal Hook Logger - Logs ALL hook events to .claude/logs/
 *
 * This hook captures every hook event type and logs them to files
 * for debugging and tracking purposes.
 */

import { EventRecorder } from 'claude-hooks-sdk';
import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';

// Read hook input from stdin
const stdinText = await Bun.stdin.text();
const hookData = stdinText ? JSON.parse(stdinText) : {};

const logsDir = join(process.cwd(), '.claude/logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

try {
  // Log to daily file
  const date = new Date().toISOString().split('T')[0];
  const logFile = join(logsDir, `hooks-${date}.jsonl`);

  const logEntry = {
    timestamp: new Date().toISOString(),
    hook_event: hookData.hook_event_name || hookData.hook_event || 'unknown',
    session_id: hookData.session_id,
    tool_name: hookData.tool_name,
    agent_name: hookData.agent_name,
    cwd: hookData.cwd
  };

  // Append to log file (JSONL format)
  appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

  // Also send to agios if it's a significant event
  const SIGNIFICANT_HOOKS = ['PostToolUse', 'SessionStart', 'SessionEnd', 'Stop'];
  const TRACKED_TOOLS = ['Write', 'Edit', 'Bash', 'SlashCommand', 'Task'];

  const isSignificant = SIGNIFICANT_HOOKS.includes(logEntry.hook_event) ||
    (logEntry.tool_name && TRACKED_TOOLS.includes(logEntry.tool_name));

  if (isSignificant) {
    const configPath = join(process.cwd(), '.agent/config.json');
    let apiUrl = 'http://localhost:5173/api/v1/hook-events';

    if (existsSync(configPath)) {
      const config = JSON.parse(await Bun.file(configPath).text());
      apiUrl = config.agiosUrl || config.apiUrl || apiUrl;
    }

    // Send to agios (fire and forget)
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: logEntry.session_id,
        project: 'mw-core',
        hookEvent: logEntry.hook_event,
        toolName: logEntry.tool_name,
        metadata: hookData,
        timestamp: logEntry.timestamp
      })
    }).catch(() => {
      // Silently fail
    });
  }

  // Always continue
  console.error(JSON.stringify({ continue: true }));
  process.exit(0);
} catch (error) {
  console.error(`[AllHooks] Error: ${error}`);
  console.error(JSON.stringify({ continue: true }));
  process.exit(0);
}
