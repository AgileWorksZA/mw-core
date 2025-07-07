#!/usr/bin/env bun

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as fs from "fs/promises";
import * as path from "path";
import { spawn } from "child_process";

async function main() {
  try {
    // Read input from stdin
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }
    
    const data = JSON.parse(input);
    console.error(`Stop hook received`);
    
    // Extract the last assistant message for summary
    let textToSpeak = "Task completed";
    
    if (data.messages && data.messages.length > 0) {
      // Find the last assistant message
      const assistantMessages = data.messages.filter((m: any) => m.role === "assistant");
      if (assistantMessages.length > 0) {
        const lastMessage = assistantMessages[assistantMessages.length - 1];
        // Extract text content, limiting to first 200 characters for brevity
        textToSpeak = lastMessage.content.substring(0, 200).replace(/```[\s\S]*?```/g, '').trim() || "Task completed";
      }
    }
    
    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY!
    });
    
    const audio = await client.generate({
      voice: "Rachel",
      text: textToSpeak,
      model_id: "eleven_turbo_v2"
    });
    
    // Save and play
    const chunks: Uint8Array[] = [];
    const reader = (audio as ReadableStream).getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    const audioFile = path.join(process.env.TMPDIR || "/tmp", "tts_summary.mp3");
    await fs.writeFile(audioFile, Buffer.concat(chunks));
    
    spawn("afplay", [audioFile], { detached: true }).unref();
    
  } catch (error) {
    console.error("Summary TTS Hook error:", error);
  }
  
  process.exit(0);
}

main();