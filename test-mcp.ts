#!/usr/bin/env bun

console.log('Testing MCP SDK import...');

try {
  const sdk = await import('@modelcontextprotocol/sdk/server/index.js');
  console.log('✓ MCP SDK imported successfully');
  console.log('Available exports:', Object.keys(sdk));
} catch (error) {
  console.error('❌ Failed to import MCP SDK:', error.message);
  console.error('\nTrying to install it now...');
  
  // Try to install it
  const { $ } = await import('bun');
  await $`bun add @modelcontextprotocol/sdk`;
  
  console.log('\nPlease run this script again after installation completes.');
}