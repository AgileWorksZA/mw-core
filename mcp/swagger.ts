import { createTransport } from "@smithery/sdk"

const transport = createTransport("https://server.smithery.ai/@tuskermanshu/swagger-mcp-server", {})

// Create MCP client
import { Client } from "@modelcontextprotocol/sdk/client/index.js"

const client = new Client({
  name: "Test client",
  version: "1.0.0"
})
await client.connect(transport)

// Use the server tools with your LLM application
const tools = await client.listTools()
console.log(`Available tools:`, tools)

// Example: Call a tool
// const result = await client.callTool("tool_name", { param1: "value1" })
