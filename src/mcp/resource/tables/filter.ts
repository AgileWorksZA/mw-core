import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { FilterService } from "../../../services/tables/filter.service";
import { filterZod } from "../../../types/zod/tables/filter";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";

const filterService = new FilterService(loadMoneyWorksConfig());

export function registerFilterTools(server: McpServer) {
  server.tool(
    "searchFilters",
    "Search for filters",
    { paging: pagingSelectionSchema, search: z.optional(filterZod.partial()) },
    async ({ paging, search }) => {
      const result = await filterService.getFilters({ ...paging, search });

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
