import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { LedgerService } from "../../../services/tables/ledger.service";
import { ledgerZod } from "../../../types/zod/ledger";
import { pagingSelectionSchema } from "../../../types/zod/paging";

const ledgerService = new LedgerService(loadMoneyWorksConfig());

export function registerLedgerTools(server: McpServer) {
  server.tool(
    "searchLedgers",
    "Search for ledgers",
    { paging: pagingSelectionSchema, search: z.optional(ledgerZod.partial()) },
    async ({ paging, search }) => {
      const result = await ledgerService.getLedgers({ ...paging, search });

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
