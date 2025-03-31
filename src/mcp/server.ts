import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { AccountService } from "../services/tables/account.service";
import { accountZodKeys } from "../types/enums";
import { pagingSchema } from "../types/zod/paging";

// Create an MCP server
const server = new McpServer({
  name: "MoneyWorks MCP Server",
  version: "1.0.0",
});

const accountingService = new AccountService(loadMoneyWorksConfig());

server.tool(
  "findAccounts",
  { paging: pagingSchema },
  async ({ paging }, extra) => {
    const result = await accountingService.getAccounts(paging);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.tool(
  "findAccountBy",
  { value: z.string(), key: accountZodKeys },
  async ({ value, key }, extra) => {
    const result = await accountingService.getAccountBy(key, value);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
(async () => {
  try {
    await server.connect(transport);
    console.log("MCP server connected successfully.");
  } catch (error) {
    console.error("Failed to connect MCP server:", error);
  }
})();
