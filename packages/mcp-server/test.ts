#!/usr/bin/env bun

/**
 * Test script for MoneyWorks MCP Server
 */

console.error('Starting MCP server test...');

try {
  // Test imports
  console.error('Testing imports...');
  const { startServer } = await import('./src/server.js');
  console.error('✓ Server import successful');
  
  // Test starting server
  console.error('Starting server...');
  await startServer();
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}