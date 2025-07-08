// tts-posttooluse-fixed.ts
// Fixed TTS hook for PostToolUse - handles the actual data format
// Save as: .claude/hooks/tts-hook.ts

import {ElevenLabsClient} from "@elevenlabs/elevenlabs-js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import {spawn} from "node:child_process";

// const sampleInput = [{"parentUuid":null,"isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","type":"user","message":{"role":"user","content":"hi"},"uuid":"c273d269-569a-4c30-9faf-477c3e2cdf67","timestamp":"2025-07-08T02:59:35.514Z"}
//   {"parentUuid":"c273d269-569a-4c30-9faf-477c3e2cdf67","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","message":{"id":"msg_01SJNBkAiWLQMz8svWdTBNy9","type":"message","role":"assistant","model":"claude-opus-4-20250514","content":[{"type":"text","text":"Hello! How can I help you today?"}],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":4,"cache_creation_input_tokens":34321,"cache_read_input_tokens":0,"output_tokens":1,"service_tier":"standard"}},"requestId":"req_011CQtoaPmksbS2M4DVF4Rdc","type":"assistant","uuid":"64752e5c-d2f9-4da0-9593-83ff0c784d8d","timestamp":"2025-07-08T02:59:43.936Z"}
//   {"parentUuid":"64752e5c-d2f9-4da0-9593-83ff0c784d8d","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","type":"system","content":"\u001b[1mStop\u001b[22m [bun --bun .claude/hooks/tts-hook.ts >> _stop.log] completed successfully","isMeta":false,"timestamp":"2025-07-08T02:59:45.005Z","uuid":"47517ef5-ecde-4a65-91a8-ebef581fbfcf","toolUseID":"8437b76a-6c99-49dd-a74a-657a81f854f9","level":"info"}
//   {"parentUuid":"47517ef5-ecde-4a65-91a8-ebef581fbfcf","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","type":"user","message":{"role":"user","content":"hi"},"uuid":"f2a3bd62-c1f8-4b53-8131-99eb927be6d2","timestamp":"2025-07-08T03:03:00.250Z"}
//   {"parentUuid":"f2a3bd62-c1f8-4b53-8131-99eb927be6d2","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","message":{"id":"msg_01WXAa7fDTkBbwRtZTJ1ZaSL","type":"message","role":"assistant","model":"claude-opus-4-20250514","content":[{"type":"text","text":"Hi! What can I assist you with?"}],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":4,"cache_creation_input_tokens":16,"cache_read_input_tokens":34321,"output_tokens":1,"service_tier":"standard"}},"requestId":"req_011CQtoqV2gQDrr9Vg418ePF","type":"assistant","uuid":"d03d9575-3622-4e5d-a05e-3c2cb151a6fd","timestamp":"2025-07-08T03:03:03.522Z"}
//   {"parentUuid":"d03d9575-3622-4e5d-a05e-3c2cb151a6fd","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","type":"system","content":"\u001b[1mStop\u001b[22m [bun --bun .claude/hooks/tts-hook.ts >> _stop.log] completed successfully","isMeta":false,"timestamp":"2025-07-08T03:03:04.064Z","uuid":"d1307a48-515b-49a4-b0bb-7f45c1106ae7","toolUseID":"c4293a2f-31ec-4c78-a9a4-9efbdc4033a5","level":"info"}
//   {"parentUuid":"d1307a48-515b-49a4-b0bb-7f45c1106ae7","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","type":"user","message":{"role":"user","content":"hi"},"uuid":"d2b859ca-0005-41ea-95a7-49e3e84a38fb","timestamp":"2025-07-08T03:03:49.301Z"}
//   {"parentUuid":"d2b859ca-0005-41ea-95a7-49e3e84a38fb","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","message":{"id":"msg_011F1cyJox6AQmpdfZQHcbGL","type":"message","role":"assistant","model":"claude-opus-4-20250514","content":[{"type":"text","text":"Hello! Is there something specific you'd like help with?"}],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":4,"cache_creation_input_tokens":16,"cache_read_input_tokens":34337,"output_tokens":15,"service_tier":"standard"}},"requestId":"req_011CQtou6kqhEf17Rh73i68K","type":"assistant","uuid":"6fe9302b-f1dc-49a8-9c1a-fd3e991d4dbd","timestamp":"2025-07-08T03:03:52.760Z"}
//   {"parentUuid":"6fe9302b-f1dc-49a8-9c1a-fd3e991d4dbd","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","type":"system","content":"\u001b[1mStop\u001b[22m [bun --bun .claude/hooks/tts-hook.ts >> _stop.log] completed successfully","isMeta":false,"timestamp":"2025-07-08T03:03:53.919Z","uuid":"2508c625-6ddc-482f-a2a1-9968c35578ca","toolUseID":"fec5759d-9707-450a-9909-7be0951ddff4","level":"info"}
//   {"parentUuid":"2508c625-6ddc-482f-a2a1-9968c35578ca","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","type":"user","message":{"role":"user","content":"hi"},"uuid":"bdb115d2-7cd3-4853-a80d-c8b05a85f72e","timestamp":"2025-07-08T03:08:30.935Z"}
//   {"parentUuid":"bdb115d2-7cd3-4853-a80d-c8b05a85f72e","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","message":{"id":"msg_01BSFEn8AM19fn8jnPzvj1VQ","type":"message","role":"assistant","model":"claude-opus-4-20250514","content":[{"type":"text","text":"Hi there! Feel free to let me know if you need any help with coding or development tasks."}],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":4,"cache_creation_input_tokens":19,"cache_read_input_tokens":34353,"output_tokens":1,"service_tier":"standard"}},"requestId":"req_011CQtpFrr1pZY6p3JF58ifh","type":"assistant","uuid":"5dced815-04d5-494c-9a1c-427de4387f87","timestamp":"2025-07-08T03:08:34.777Z"}
//   {"parentUuid":"5dced815-04d5-494c-9a1c-427de4387f87","isSidechain":false,"userType":"external","cwd":"/Users/hgeldenhuys/WebstormProjects/mw-core","sessionId":"2f15cdea-38cb-451e-9c60-923e33de353d","version":"1.0.44","type":"system","content":"\u001b[1mStop\u001b[22m [bun --bun .claude/hooks/tts-hook.ts >> _stop.log] failed with non-blocking status code 1: 15 | const STATE_FILE = path.join(os.tmpdir(), \"claude-tts-state.json\");\n     ^\nerror: Unexpected const\n    at /Users/hgeldenhuys/WebstormProjects/mw-core/.claude/hooks/tts-hook.ts:15:1\n\nBun v1.2.15 (macOS arm64)\n","isMeta":false,"timestamp":"2025-07-08T03:08:34.896Z","uuid":"060247cd-1e6f-4444-9397-00938d10ccc8","toolUseID":"7ffcfd07-ed8c-4f58-8921-907488436097","level":"warning"}
// ]

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
    await fs.unlink(STATE_FILE).catch(() => {});

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
        modelId: "eleven_flash_v2_5",
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
    const speedFactor = 1.5; // 1.5x speed

    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i", originalFile,
        "-filter:a", `atempo=${speedFactor}`,
        "-y", // overwrite output file
        speedFile
      ], { stdio: "pipe" });

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
      fs.unlink(originalFile).catch(() => {});
      fs.unlink(speedFile).catch(() => {});
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