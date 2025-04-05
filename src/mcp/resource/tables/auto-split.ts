import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { AutoSplitService } from "../../../services/tables/auto-split.service";
import { autoSplitZod } from "../../../types/zod/tables/auto-split";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";

const autoSplitService = new AutoSplitService(loadMoneyWorksConfig());

export function registerAutoSplitTools(server: McpServer) {
  server.tool(
    "searchAutoSplits",
    "Search for auto splits",
    {
      paging: pagingSelectionSchema,
      search: z.optional(autoSplitZod.partial()),
    },
    async ({ paging, search }) => {
      const result = await autoSplitService.getAutoSplits({
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
