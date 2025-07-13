#!/usr/bin/env node

// Simple test to debug MCP supplier search directly
import { spawn } from 'child_process';

const mcpServerPath = './packages/mcp-server/src/index.ts';

console.log('Testing MCP supplier search...');

// Create MCP client request to get suppliers
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "mw_get_suppliers",
    arguments: {
      limit: 5
    }
  }
};

console.log('Sending request:', JSON.stringify(request, null, 2));

// Start MCP server process
const mcp = spawn('bun', ['--cwd', 'packages/mcp-server', 'dev'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

// Send request
mcp.stdin.write(JSON.stringify(request) + '\n');

let response = '';
mcp.stdout.on('data', (data) => {
  response += data.toString();
  console.log('Server response:', data.toString());
});

mcp.on('error', (error) => {
  console.error('MCP server error:', error);
});

setTimeout(() => {
  console.log('Full response:', response);
  mcp.kill();
}, 5000);