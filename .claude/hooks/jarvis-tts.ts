#!/usr/bin/env bun

// JARVIS TTS Hook - Sends audio summaries to central queue

import * as fs from "node:fs/promises";

const JARVIS_SERVER = process.env.JARVIS_SERVER || "http://localhost:4000";
const JARVIS_API_URL = `${JARVIS_SERVER}/api/audio`;
const PROJECT_NAME = process.cwd().split('/').pop() || 'unknown';

async function main() {
  try {
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }

    const data = JSON.parse(input);
    const transcript = await fs.readFile(data.transcript_path, "utf-8");
    const messages = transcript.split("\n").filter(line => line.trim()).map(line => JSON.parse(line));

    const lastAssistant = messages.filter(m => m.message?.role === "assistant").pop();
    if (!lastAssistant) return;

    const content = lastAssistant.message.content.map((c: {text: string}) => c.text).join(" ");
    const summaryMatch = content.match(/<summary>(.*?)<\/summary>/s);
    if (!summaryMatch) return;

    await fetch(JARVIS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: summaryMatch[1].trim(),
        session_id: data.session_id,
        repo_name: PROJECT_NAME,
        timestamp: new Date().toISOString()
      }),
    });

    console.error(`🔊 Audio queued in JARVIS`);
  } catch (error) {
    console.error(`❌ Audio queue failed: ${(error as Error).message}`);
  }
  process.exit(0);
}

main();