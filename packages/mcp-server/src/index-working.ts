#!/usr/bin/env /Users/hgeldenhuys/.bun/bin/bun

/**
 * Working MoneyWorks MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

console.error('Starting MoneyWorks MCP server...');

// Create an MCP server
const server = new McpServer({
  name: "moneyworks-mcp",
  version: "0.1.0"
});

// Add a simple test tool
server.registerTool(
  "mw_ping",
  {
    title: "Ping MoneyWorks",
    description: "Test if MoneyWorks MCP server is running",
    inputSchema: {}
  },
  async () => ({
    content: [{ 
      type: "text", 
      text: "MoneyWorks MCP Server is running! Once fully configured, you'll be able to export data, evaluate MWScript expressions, and more." 
    }]
  })
);

// Add export tool (simplified for now)
server.registerTool(
  "mw_list_tables",
  {
    title: "List MoneyWorks Tables",
    description: "List available MoneyWorks tables",
    inputSchema: {}
  },
  async () => ({
    content: [{ 
      type: "text", 
      text: JSON.stringify({
        available: ["TaxRate"],
        upcoming: ["Account", "Transaction", "Name", "Product", "Job"]
      }, null, 2)
    }]
  })
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MoneyWorks MCP server started successfully');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});