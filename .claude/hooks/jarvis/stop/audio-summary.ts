#!/usr/bin/env bun

import * as fs from "node:fs/promises";
import * as path from "node:path";

const JARVIS_SERVER = process.env.JARVIS_SERVER || "http://localhost:4000";
const JARVIS_AUDIO_API = `${JARVIS_SERVER}/api/audio`;
const PROJECT_PATH = process.cwd();
const PROJECT_NAME = path.basename(PROJECT_PATH);

type Message = {
  message?: {
    role: "assistant" | "user";
    content: [{ type: "text"; text: string }];
  };
};

type Input = {
  session_id: string;
  transcript_path: string;
  hook_event_name: "Stop" | string;
  stop_hook_active: boolean;
};

async function main() {
  try {
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }
    
    const data: Input = JSON.parse(input);
    
    // Only process if stop hook is active
    if (!data.stop_hook_active) {
      process.exit(0);
    }
    
    const transcript = await fs.readFile(data.transcript_path, "utf-8");
    const messages = transcript.split("\n").filter(line => line.trim()).map(line => JSON.parse(line) as Message);
    
    const lastAssistant = messages.filter(m => m.message?.role === "assistant").pop();
    if (!lastAssistant || !lastAssistant.message) {
      process.exit(0);
    }
    
    const content = lastAssistant.message.content.map(c => c.text).join(" ");
    const summaryMatch = content.match(/<summary>(.*?)<\/summary>/s);
    if (!summaryMatch) {
      process.exit(0);
    }

    const response = await fetch(JARVIS_AUDIO_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: summaryMatch[1].trim(),
        session_id: data.session_id,
        repo_name: PROJECT_NAME,
        timestamp: new Date().toISOString()
      }),
    });
    
    if (response.ok) {
      console.error(`🔊 Audio queued in JARVIS`);
    } else {
      const errorText = await response.text();
      console.error(`❌ Audio queue failed: ${errorText}`);
    }
  } catch (error: any) {
    console.error(`❌ Audio hook error: ${error.message}`);
  }
  process.exit(0);
}

main();