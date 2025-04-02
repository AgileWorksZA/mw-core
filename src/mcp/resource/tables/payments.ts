import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { PaymentsService } from "../../../services/tables/payments.service";
import { pagingSchema } from "../../../types/zod/paging";
import { paymentsZod } from "../../../types/zod/payments";

const paymentsService = new PaymentsService(loadMoneyWorksConfig());

export function registerPaymentsTools(server: McpServer) {
  server.tool(
    "searchPayments",
    "Search for payments",
    { paging: pagingSchema, search: z.optional(paymentsZod.partial()) },
    async ({ paging, search }) => {
      const result = await paymentsService.getPayments({ ...paging, search });

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
