// Create an MCP server
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export const server: McpServer = new McpServer({
  name: "MoneyWorks MCP Server",
  version: "1.0.0",
});
