#!/usr/bin/env node

/**
 * MoneyWorks MCP Server Entry Point
 * 
 * @moneyworks-dsl PURE
 */

import { startServer } from './server.js';

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