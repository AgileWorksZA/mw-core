import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { BankRecsService } from "../../../services/tables/bank-recs.service";
import { bankRecsZod } from "../../../types/zod/bank-recs";
import { pagingSchema } from "../../../types/zod/paging";

const bankRecsService = new BankRecsService(loadMoneyWorksConfig());

export function registerBankRecsTools(server: McpServer) {
  server.tool(
    "searchBankRecs",
    "Search for bank reconciliations",
    { paging: pagingSchema, search: z.optional(bankRecsZod.partial()) },
    async ({ paging, search }) => {
      const result = await bankRecsService.getBankRecs({ ...paging, search });

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
