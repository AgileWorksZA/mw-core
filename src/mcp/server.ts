import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { server } from "./config";
import { registerAccountTTools } from "./resource/account";

registerAccountTTools(server);

const transport = new StdioServerTransport();
(async () => {
  try {
    await server.connect(transport);
    console.log("MCP server connected successfully.");
  } catch (error) {
    console.error("Failed to connect MCP server:", error);
  }
})();
