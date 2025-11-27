#!/usr/bin/env bun
/**
 * Unified Hooks Script for mw-core
 * Handles all Claude Code hook events
 */

import { existsSync, readFileSync, appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface HookInput {
  hook_event_name?: string;
  hook_event?: string;
  session_id: string;
  cwd: string;
  tool_name?: string;
  [key: string]: any;
}

/**
 * Log to file (using stderr for debug, keeps stdout clean)
 */
function debug(msg: string): void {
  console.error(`[mw-core hooks] ${msg}`);
}

/**
 * Get session name from sessions.json
 */
function getSessionName(sessionId: string, cwd: string): string | null {
  try {
    const sessionsPath = join(cwd, '.claude/sessions.json');
    if (!existsSync(sessionsPath)) return null;

    const sessions = JSON.parse(readFileSync(sessionsPath, 'utf-8'));
    return sessions[sessionId]?.name || null;
  } catch {
    return null;
  }
}

/**
 * Log hook event to daily file
 */
function logHookEvent(input: HookInput): void {
  try {
    const logsDir = join(input.cwd, '.claude/logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    const logFile = join(logsDir, `hooks-${date}.jsonl`);

    const entry = {
      timestamp: new Date().toISOString(),
      event: input.hook_event_name || input.hook_event,
      sessionId: input.session_id,
      toolName: input.tool_name,
    };

    appendFileSync(logFile, JSON.stringify(entry) + '\n');
  } catch {
    // Silently fail
  }
}

/**
 * Main hook handler
 */
async function main(): Promise<void> {
  try {
    // Read JSON from stdin
    const stdinText = await Bun.stdin.text();

    if (!stdinText.trim()) {
      console.log(JSON.stringify({ continue: true }));
      process.exit(0);
    }

    const input: HookInput = JSON.parse(stdinText);
    const eventName = input.hook_event_name || input.hook_event || 'unknown';

    // Log event
    logHookEvent(input);

    // Build response
    const response: { continue: true; message?: string } = { continue: true };

    // Add context for specific events
    switch (eventName) {
      case 'SessionStart': {
        const sessionName = getSessionName(input.session_id, input.cwd);
        if (sessionName) {
          response.message = `Session: ${sessionName} (${input.session_id.substring(0, 8)})`;
        } else {
          response.message = `Session: ${input.session_id}`;
        }
        debug(`SessionStart - ${response.message}`);
        break;
      }

      case 'UserPromptSubmit': {
        const sessionName = getSessionName(input.session_id, input.cwd);
        if (sessionName) {
          response.message = `Current session: ${sessionName} (${input.session_id.substring(0, 8)})`;
        }
        break;
      }

      case 'Stop':
        debug('Stop hook fired');
        break;

      default:
        // No special handling needed
        break;
    }

    // Output ONLY the JSON response to stdout
    console.log(JSON.stringify(response));
    process.exit(0);

  } catch (error) {
    // On error, still output valid response
    console.error('[mw-core hooks] Error:', error);
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  }
}

main();
