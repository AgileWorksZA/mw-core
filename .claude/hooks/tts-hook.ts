// tts-posttooluse-fixed.ts
// Fixed TTS hook for PostToolUse - handles the actual data format
// Save as: .claude/hooks/tts-hook.ts

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { spawn } from "child_process";

// Simple in-memory state for the current session
const STATE_FILE = path.join(os.tmpdir(), "claude-tts-state.json");
const DEBOUNCE_MS = 3000; // Wait 3 seconds of inactivity before playing summary

interface ToolData {
  tool_name: string;
  tool_output?: string;
  tool_input?: any;
  success?: boolean;
  [key: string]: any; // Handle additional fields
}

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

    let toolData: ToolData;
    try {
      toolData = JSON.parse(input);
    } catch (e) {
      console.error("Failed to parse input:", e);
      process.exit(0);
    }

    const { tool_name, tool_output } = toolData;
    
    // Skip if no output or failed
    if (!tool_output || toolData.success === false) {
      process.exit(0);
    }

    // Extract accomplishment
    const accomplishment = extractAccomplishment(tool_name, tool_output);
    if (!accomplishment) {
      process.exit(0);
    }

    // Update session state
    await updateSessionState(accomplishment);
    
  } catch (error) {
    console.error("Hook error:", error);
    process.exit(1);
  }
}

function extractAccomplishment(toolName: string, output: string): string | null {
  const lines = output.split('\n').filter(line => line.trim());
  
  switch (toolName) {
    case "Write":
    case "write_file":
      for (const line of lines) {
        const match = line.match(/(?:Created|Wrote to|Created file) (?:file )?['"]?([^\s'"]+)['"]?/i);
        if (match) {
          return `Created ${path.basename(match[1])}`;
        }
      }
      return null;
      
    case "Edit":
    case "edit_file":
      for (const line of lines) {
        const match = line.match(/(?:Updated|Modified|Edited) (?:file )?['"]?([^\s'"]+)['"]?/i);
        if (match) {
          return `Updated ${path.basename(match[1])}`;
        }
      }
      // Check if it mentions a specific file in the first line
      if (lines[0]) {
        const fileMatch = lines[0].match(/^([^\s:]+)(?::|$)/);
        if (fileMatch) {
          return `Updated ${path.basename(fileMatch[1])}`;
        }
      }
      return null;
      
    case "Bash":
    case "run_bash":
      // Common command patterns
      if (output.includes("npm install") || output.includes("bun add")) {
        return "Installed dependencies";
      }
      if (output.includes("git commit")) {
        return "Committed changes";
      }
      if (output.includes("git push")) {
        return "Pushed to repository";
      }
      if (lines.some(l => l.includes("created") || l.includes("Created"))) {
        return "Created files";
      }
      return null;
      
    default:
      return null;
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
    const unique = [...new Set(state.accomplishments)];
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
    
    const client = new ElevenLabsClient({ apiKey });
    
    const audio = await client.generate({
      voice: "Bj9UqZbhQsanLzgalpEG", // Austin
      text: summary,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.8
      }
    });
    
    // Handle stream
    const chunks: Uint8Array[] = [];
    const reader = (audio as ReadableStream).getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    // Save audio
    const audioFile = path.join(os.tmpdir(), `tts_${Date.now()}.mp3`);
    await fs.writeFile(audioFile, Buffer.concat(chunks));
    
    // Play audio
    if (process.platform === "darwin") {
      const player = spawn("afplay", [audioFile], { 
        stdio: "ignore",
        detached: true
      });
      player.unref();
    }
    
    // Cleanup audio file after 10 seconds
    setTimeout(() => {
      fs.unlink(audioFile).catch(() => {});
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
