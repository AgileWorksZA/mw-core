#!/usr/bin/env bun

import { spawn } from "node:child_process";
import * as fs from "node:fs/promises";

async function main() {
  try {
    // Read input from stdin
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }

    if (!(await fs.exists('./temp'))) {
      await fs.mkdir('./temp');
    }
    await fs.writeFile(`./temp/pre-tool-${Date.now()}.json`, input);
    
    const data = JSON.parse(input);
    console.error(`Notification hook received: ${data.type}`);
    
    // Play system notification sound
    // Using macOS built-in sounds
    const soundFile = "/System/Library/Sounds/Funk.aiff";
    
    spawn("afplay", [soundFile], { detached: true }).unref();
    
  } catch (error) {
    console.error("Notification Hook error:", error);
  }
  
  process.exit(0);
}

main();