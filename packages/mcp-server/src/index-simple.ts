#!/usr/bin/env /Users/hgeldenhuys/.bun/bin/bun

/**
 * Simple MoneyWorks MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

console.error('Starting simple MCP server...');

const server = new Server(
  {
    name: 'moneyworks-mcp-simple',
    version: '0.1.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Register handlers using the handler methods
server.setRequestHandler({
  method: 'tools/list',
  handler: async () => ({
    tools: [
      {
        name: 'mw_ping',
        description: 'Test if MoneyWorks MCP server is running',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  })
});

server.setRequestHandler({
  method: 'tools/call',
  handler: async (request) => {
    const { name } = request.params;
    
    if (name === 'mw_ping') {
      return {
        content: [
          {
            type: 'text',
            text: 'MoneyWorks MCP Server is running!'
          }
        ]
      };
    }
    
    return {
      error: {
        code: -32601,
        message: `Unknown tool: ${name}`
      }
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Simple MCP server started');
}

main().catch((error) => {
  console.error('Failed to start:', error);
  process.exit(1);
});