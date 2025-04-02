import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { TaxRateService } from "../../../services/tables/tax-rate.service";
import { pagingSelectionSchema } from "../../../types/zod/paging";
import { taxRateZod } from "../../../types/zod/tax-rate";

const taxRateService = new TaxRateService(loadMoneyWorksConfig());

export function registerTaxRateTools(server: McpServer) {
  server.tool(
    "searchTaxRates",
    "Search for tax rates",
    { paging: pagingSelectionSchema, search: z.optional(taxRateZod.partial()) },
    async ({ paging, search }) => {
      const result = await taxRateService.getTaxRates({ ...paging, search });

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
