import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { AccountService } from "../../../services/tables/account.service";
import { accountZod } from "../../../types/zod/account";
import { pagingSelectionSchema } from "../../../types/zod/paging";

const accountingService = new AccountService(loadMoneyWorksConfig());

export function registerAccountTools(server: McpServer) {
  server.tool(
    "searchAccounts",
    "Search for accounts",
    { paging: pagingSelectionSchema, search: z.optional(accountZod.partial()) },
    async ({ paging, search }) => {
      const result = await accountingService.getAccounts({ ...paging, search });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );
}
