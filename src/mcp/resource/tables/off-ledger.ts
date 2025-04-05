import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { OffLedgerService } from "../../../services/tables/off-ledger.service";
import { offLedgerZod } from "../../../types/zod/tables/off-ledger";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";

const offLedgerService = new OffLedgerService(loadMoneyWorksConfig());

export function registerOffLedgerTools(server: McpServer) {
  server.tool(
    "searchOffLedgers",
    "Search for off-ledger entries",
    {
      paging: pagingSelectionSchema,
      search: z.optional(offLedgerZod.partial()),
    },
    async ({ paging, search }) => {
      const result = await offLedgerService.getOffLedgerItems({
        ...paging,
        search,
      });

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
