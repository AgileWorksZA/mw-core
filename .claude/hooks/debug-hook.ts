#!/usr/bin/env bun
// debug-hook.ts - Simple hook to verify triggering

import * as fs from "fs/promises";
import * as path from "path";

async function logHookTrigger() {
  const logFile = path.join(process.cwd(), "claude-hook-debug.log");
  const timestamp = new Date().toISOString();
  
  // Read stdin
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  
  const data = Buffer.concat(chunks).toString();
  
  // Log to file
  const logEntry = `
========================================
HOOK TRIGGERED AT: ${timestamp}
HOOK TYPE: PostSession
DATA RECEIVED:
${data}
========================================\n`;
  
  await fs.appendFile(logFile, logEntry);
  
  // Also log to console
  console.log("🎯 PostSession hook triggered!");
  console.log("📝 Logged to:", logFile);
}

logHookTrigger().catch(err => {
  console.error("Debug hook error:", err);
  process.exit(1);
});
