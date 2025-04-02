import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { DetailService } from "../../../services/tables/detail.service";
import { detailZod } from "../../../types/zod/detail";
import { pagingSelectionSchema } from "../../../types/zod/paging";

const detailService = new DetailService(loadMoneyWorksConfig());

export function registerDetailTools(server: McpServer) {
  server.tool(
    "searchDetails",
    "Search for details",
    { paging: pagingSelectionSchema, search: z.optional(detailZod.partial()) },
    async ({ paging, search }) => {
      const result = await detailService.getDetails({ ...paging, search });

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
