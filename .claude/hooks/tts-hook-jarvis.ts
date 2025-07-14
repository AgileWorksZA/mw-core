#!/usr/bin/env bun

import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

const JARVIS_API_URL = "http://localhost:5174/api/audio";
const PROJECT_NAME = "jarvis";
const PROJECT_PATH = process.cwd();

type Message = {
  "parentUuid": string,
  "isSidechain": boolean,
  "userType": "external",
  "cwd": string,
  "sessionId": string,
  "version": string,
  "message": {
    "id": string,
    "type": "message",
    "role": "assistant" | "user",
    "model": string,
    "content": [{ "type": "text", "text": string }],
    "stop_reason": null | string,
    "stop_sequence": null,
    "usage": {
      "input_tokens": number,
      "cache_creation_input_tokens": number,
      "cache_read_input_tokens": number,
      "output_tokens": number,
      "service_tier": "standard"
    }
  },
  "requestId": string,
  "type": "assistant" | "user",
  "uuid": string,
  "timestamp": string
}

type Input = {
  "session_id": string,
  "transcript_path": string,
  "hook_event_name": "Stop" | string,
  "stop_hook_active": boolean
}

async function findLastAssistantMessage(input: Input): Promise<Message | undefined> {
  const data = (await fs.readFile(input.transcript_path, "utf-8"))
  const messages = data
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as Message)
  const lastAssistantMessages = messages.filter((message) =>
    message.message && message.message.role === "assistant"
  );
  return lastAssistantMessages[lastAssistantMessages.length - 1];
}

function extractSummaryFromMessage(message: Message): string | null {
  const content = message.message.content.map((c) => c.text).join(" ");
  const summaryMatch = content.match(/<summary>(.*?)<\/summary>/s);
  return summaryMatch ? summaryMatch[1].trim() : null;
}

async function sendToJarvisAudio(text: string, sessionId: string, retries = 3): Promise<boolean> {
  const payload = {
    text: text,
    session_id: sessionId,
    agent_name: `JARVIS-${sessionId.slice(0, 8)}`,
    agent_role: "system",
    repo_name: PROJECT_NAME,
    project_path: PROJECT_PATH,
    voice: "Alex", // System voice for JARVIS itself
    timestamp: new Date().toISOString()
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(JARVIS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.error(`✅ Audio sent to JARVIS (attempt ${attempt}):`, {
          success: result.success,
          audio_id: result.audio_id,
          queue_position: result.queue_position,
          estimated_wait: result.estimated_wait
        });
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ JARVIS Audio API error (attempt ${attempt}):`, response.status, errorText);
      }
    } catch (error) {
      console.error(`🔄 Failed to send audio to JARVIS (attempt ${attempt}):`, error);
    }

    // Wait before retry (exponential backoff)
    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return false;
}

// Simple in-memory state for the current session
const STATE_FILE = path.join(os.tmpdir(), "claude-tts-state.json");
const DEBOUNCE_MS = 3000; // Wait 3 seconds of inactivity before playing summary

interface SessionState {
  accomplishments: string[];
  lastUpdate: number;
  timeoutId?: NodeJS.Timeout;
}

async function processToolUse() {
  try {
    // Read tool data from stdin (Claude Code pipes it)
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }

    const input = Buffer.concat(chunks).toString().trim();
    if (!input) {
      console.error("No input received");
      process.exit(0);
    }

    let toolData: Input;
    try {
      toolData = JSON.parse(input);
    } catch (e) {
      console.error("Failed to parse input:", e);
      process.exit(0);
    }
    
    if (!(await fs.exists('./temp'))) {
      await fs.mkdir('./temp');
    }
    await fs.writeFile(`./temp/stop-${Date.now()}.json`, JSON.stringify(toolData, null, 2));

    // Extract accomplishment
    const accomplishment = await findLastAssistantMessage(toolData);
    if (!accomplishment) {
      console.log("No assistant message found");
      return;
    }

    // Extract summary from the message
    const summary = extractSummaryFromMessage(accomplishment);
    if (!summary) {
      console.log("No summary tag found in assistant message");
      return;
    }

    // Update session state with the summary
    await updateSessionState(summary, toolData.session_id);
    console.log("Summary extracted:", summary);
  } catch (error) {
    console.error("Hook error:", error);
    process.exit(1);
  }
}

async function updateSessionState(accomplishment: string, sessionId: string) {
  let state: SessionState;

  // Read existing state
  try {
    const existing = await fs.readFile(STATE_FILE, "utf-8");
    state = JSON.parse(existing);
  } catch {
    state = {
      accomplishments: [],
      lastUpdate: 0
    };
  }

  // Add accomplishment if not duplicate
  if (!state.accomplishments.includes(accomplishment)) {
    state.accomplishments.push(accomplishment);
  }

  state.lastUpdate = Date.now();

  // Save state
  await fs.writeFile(STATE_FILE, JSON.stringify(state));

  // Schedule summary playback (cancel previous timeout)
  scheduleSummaryPlayback(sessionId);
}

let summaryTimeout: NodeJS.Timeout | null = null;

function scheduleSummaryPlayback(sessionId: string) {
  // Cancel existing timeout
  if (summaryTimeout) {
    clearTimeout(summaryTimeout);
  }

  // Schedule new timeout
  summaryTimeout = setTimeout(async () => {
    try {
      await playSessionSummary(sessionId);
    } catch (error) {
      console.error("Failed to play summary:", error);
    }
  }, DEBOUNCE_MS);
}

async function playSessionSummary(sessionId: string) {
  try {
    // Read final state
    const stateData = await fs.readFile(STATE_FILE, "utf-8");
    const state: SessionState = JSON.parse(stateData);

    if (state.accomplishments.length === 0) {
      return;
    }

    // Create summary - just join all the summaries collected
    const unique = Array.from(new Set(state.accomplishments));
    const summary = unique.join(". ");

    // Clean up state file
    await fs.unlink(STATE_FILE).catch(() => {});

    // Send to JARVIS audio queue instead of playing locally
    const sent = await sendToJarvisAudio(summary, sessionId);
    
    if (sent) {
      console.log(`📢 Audio summary queued in JARVIS: "${summary.substring(0, 100)}${summary.length > 100 ? '...' : ''}"`);
    } else {
      console.log(`❌ Failed to queue audio in JARVIS, summary was: "${summary}"`);
    }

  } catch (error) {
    console.error("Summary playback error:", error);
  }
}

// Handle process termination gracefully
process.on("SIGTERM", () => {
  if (summaryTimeout) {
    clearTimeout(summaryTimeout);
  }
  process.exit(0);
});

// Main execution
processToolUse().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});