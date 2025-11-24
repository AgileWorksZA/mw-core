#!/usr/bin/env bun

/**
 * Universal Hook Logger - Logs ALL hook events to .claude/logs/
 *
 * This hook captures every hook event type and logs them to files
 * for debugging and tracking purposes.
 */

import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { enrichEvent } from "claude-hooks-sdk";

// Read hook input from stdin
const stdinText = await Bun.stdin.text();
const hookData = stdinText ? JSON.parse(stdinText) : {};

const logsDir = join(process.cwd(), ".claude/logs");
if (!existsSync(logsDir)) {
	mkdirSync(logsDir, { recursive: true });
}

try {
	// Use SDK helper to enrich event with conversation + git context
	const enriched = await enrichEvent(hookData, {
		includeConversation: true, // Get last conversation message
		includeGit: true, // Get git context
		conversationLines: 1, // Just the last message
	});

	// Log to daily file
	const date = new Date().toISOString().split("T")[0];
	const logFile = join(logsDir, `hooks-${date}.jsonl`);

	// Append to log file (JSONL format)
	appendFileSync(logFile, `${JSON.stringify(enriched)}\n`);

	// Also send to agios if it's a significant event
	const SIGNIFICANT_HOOKS = [
		"PostToolUse",
		"SessionStart",
		"SessionEnd",
		"Stop",
	];
	const TRACKED_TOOLS = ["Write", "Edit", "Bash", "SlashCommand", "Task"];

	const hookEvent =
		hookData.hook_event_name || hookData.hook_event || "unknown";
	const isSignificant =
		SIGNIFICANT_HOOKS.includes(hookEvent) ||
		(hookData.tool_name && TRACKED_TOOLS.includes(hookData.tool_name));

	if (isSignificant) {
		const configPath = join(process.cwd(), ".agent/config.json");
		let apiUrl = "http://localhost:5173/api/v1/hook-events";

		if (existsSync(configPath)) {
			const config = JSON.parse(await Bun.file(configPath).text());
			apiUrl = config.agiosUrl || config.apiUrl || apiUrl;
		}

		// Send to agios (fire and forget)
		fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sessionId: hookData.session_id,
				project: "mw-core",
				hookEvent: hookEvent,
				toolName: hookData.tool_name,
				metadata: enriched, // Send the enriched payload
				timestamp: enriched.timestamp,
			}),
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
