#!/usr/bin/env bun
// Test MCP server tools directly

import { spawn } from "child_process";
import { resolve } from "path";

// Start the MCP server
const serverPath = resolve("packages/mcp-server/src/index.ts");
const configPath = resolve("packages/core/mw-config.json");

console.log("Starting MCP server...");
const server = spawn("bun", ["run", serverPath], {
  env: {
    ...process.env,
    MW_CONFIG_PATH: configPath,
  },
  stdio: ["pipe", "pipe", "pipe"]
});

// Wait for server to start
await new Promise(resolve => setTimeout(resolve, 2000));

// Test transaction_operations tool
console.log("\nTesting transaction_operations tool...");

const testRequest = {
  jsonrpc: "2.0",
  method: "tools/call",
  params: {
    name: "transaction_operations",
    arguments: {
      operation: "search",
      limit: 1
    }
  },
  id: 1
};

console.log("Sending request:", JSON.stringify(testRequest, null, 2));

server.stdin.write(JSON.stringify(testRequest) + "\n");

// Listen for response
server.stdout.on("data", (data) => {
  console.log("Response:", data.toString());
});

server.stderr.on("data", (data) => {
  console.log("Server log:", data.toString());
});

// Clean up after 5 seconds
setTimeout(() => {
  console.log("\nShutting down server...");
  server.kill();
  process.exit(0);
}, 5000);