import fs from "node:fs";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { AccountService } from "../services/tables/account.service";
import { accountZod } from "../types/zod/account";
import { pagingSchema } from "../types/zod/paging";
import { server } from "./config";

const accountingService = new AccountService(loadMoneyWorksConfig());

server.tool(
  "searchAccounts",
  { paging: pagingSchema, search: z.optional(accountZod.partial()) },
  async ({ paging, search }) => {
    const result = await accountingService.getAccounts({ ...paging, search });
    fs.writeFileSync("accounts.json", JSON.stringify(result, null, 2));
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
