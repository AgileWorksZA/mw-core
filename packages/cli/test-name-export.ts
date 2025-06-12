#!/usr/bin/env bun

// Simple test to export Name table
const args = [
  "export", 
  "Name", 
  "--format", 
  "xml-verbose", 
  "--limit", 
  "1",
  "-c",
  "../core/mw-config.json",
  "--debug"
];

// Set process.argv to simulate CLI call
process.argv = ["bun", "src/index.ts", ...args];

// Import and run the CLI
import("./src/index.ts");