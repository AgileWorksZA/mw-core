#!/Users/hgeldenhuys/.bun/bin/bun

import {ElevenLabsClient} from "@elevenlabs/elevenlabs-js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import {spawn} from "node:child_process";

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
  console.log("DEBUG: transcript data:", data);
  const messages = data
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as Message)
  const lastAssistantMessages = messages.filter((message) =>
    message.message && message.message.role === "assistant"
  );
  return lastAssistantMessages[lastAssistantMessages.length - 1];
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

    // Extract accomplishment
    const accomplishment = await findLastAssistantMessage(toolData);
    if (!accomplishment) {
      await updateSessionState("No accomplishment");
      console.log("Accomplishment:", accomplishment);
    } else {

      // Update session state
      await updateSessionState(accomplishment.message.content.map((c) => c.text).join(". "));
      console.log("Accomplishment:", accomplishment);
    }
  } catch (error) {
    console.error("Hook error:", error);
    process.exit(1);
  }
}

async function updateSessionState(accomplishment: string) {
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
  scheduleSummaryPlayback();
}

let summaryTimeout: NodeJS.Timeout | null = null;

function scheduleSummaryPlayback() {
  // Cancel existing timeout
  if (summaryTimeout) {
    clearTimeout(summaryTimeout);
  }

  // Schedule new timeout
  summaryTimeout = setTimeout(async () => {
    try {
      await playSessionSummary();
    } catch (error) {
      console.error("Failed to play summary:", error);
    }
  }, DEBOUNCE_MS);
}

async function playSessionSummary() {
  try {
    // Read final state
    const stateData = await fs.readFile(STATE_FILE, "utf-8");
    const state: SessionState = JSON.parse(stateData);

    if (state.accomplishments.length === 0) {
      return;
    }

    // Create summary
    const unique = Array.from(new Set(state.accomplishments));
    let summary: string;

    if (unique.length === 1) {
      summary = unique[0];
    } else if (unique.length === 2) {
      summary = `${unique[0]} and ${unique[1].toLowerCase()}`;
    } else {
      const last = unique.pop()!;
      summary = `${unique.join(", ")}, and ${last.toLowerCase()}`;
    }

    // Clean up state file
    await fs.unlink(STATE_FILE).catch(() => {
    });

    // Generate and play audio
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error("ELEVENLABS_API_KEY not set");
      return;
    }

    const client = new ElevenLabsClient({apiKey});

    const audio = await client.textToSpeech.convert(
      "Bj9UqZbhQsanLzgalpEG",
      {
        text: summary,
        modelId: "eleven_ttv_v3",
        voiceSettings: {
          stability: 0.7,
          similarityBoost: 0.8
        }
      }
    );

    // Handle stream
    const chunks: Uint8Array[] = [];
    const reader = (audio as ReadableStream).getReader();
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    // Save original audio
    const originalFile = path.join(os.tmpdir(), `tts_original_${Date.now()}.mp3`);
    await fs.writeFile(originalFile, Buffer.concat(chunks));

    // Speed up audio using ffmpeg
    const speedFile = path.join(os.tmpdir(), `tts_speed_${Date.now()}.mp3`);
    const speedFactor = 1.3; // 1.5x speed

    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i", originalFile,
        "-filter:a", `atempo=${speedFactor}`,
        "-y", // overwrite output file
        speedFile
      ], {stdio: "pipe"});

      ffmpeg.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg failed with code ${code}`));
      });
    });

    // Play sped-up audio
    if (process.platform === "darwin") {
      const player = spawn("afplay", [speedFile], {
        stdio: "ignore",
        detached: true
      });
      player.unref();
    }

    // Cleanup audio files after 10 seconds
    setTimeout(() => {
      fs.unlink(originalFile).catch(() => {
      });
      fs.unlink(speedFile).catch(() => {
      });
    }, 10000);

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