import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { TransactionService } from "../../../services/tables/transaction.service";
import { pagingSelectionSchema } from "../../../types/zod/paging";
import { transactionZod } from "../../../types/zod/transaction";

const transactionService = new TransactionService(loadMoneyWorksConfig());

export function registerTransactionTools(server: McpServer) {
  server.tool(
    "searchTransactions",
    "Search for transactions",
    { paging: pagingSelectionSchema, search: z.optional(transactionZod.partial()) },
    async ({ paging, search }) => {
      const result = await transactionService.getTransactions({
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
