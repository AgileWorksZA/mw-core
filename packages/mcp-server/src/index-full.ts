#!/usr/bin/env /Users/hgeldenhuys/.bun/bin/bun

/**
 * MoneyWorks MCP Server Entry Point
 * Full featured version
 * 
 * @moneyworks-dsl PURE
 */

import { startServer } from './server-v2.js';

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\nShutting down MoneyWorks MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\nShutting down MoneyWorks MCP Server...');
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start MoneyWorks MCP Server:', error);
  process.exit(1);
});