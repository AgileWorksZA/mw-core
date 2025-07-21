#!/usr/bin/env bun

import { spawn } from "node:child_process";

// Read notification data from stdin
let input = "";
for await (const chunk of process.stdin) {
  input += chunk;
}

try {
  const data = JSON.parse(input);
  console.error(`🔔 Notification: ${data.hook_event_name}`);
  
  // Play system sound (macOS)
  try {
    spawn("afplay", ["/System/Library/Sounds/Hero.aiff"], { detached: true }).unref();
  } catch {
    // Ignore sound errors
  }
} catch (error: any) {
  console.error(`❌ Notification hook error: ${error.message}`);
}

process.exit(0);