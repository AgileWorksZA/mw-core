import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { StickiesService } from "../../../services/tables/stickies.service";
import { pagingSelectionSchema } from "../../../types/zod/paging";
import { stickiesZod } from "../../../types/zod/stickies";

const stickiesService = new StickiesService(loadMoneyWorksConfig());

export function registerStickiesTools(server: McpServer) {
  server.tool(
    "searchStickies",
    "Search for stickies",
    { paging: pagingSelectionSchema, search: z.optional(stickiesZod.partial()) },
    async ({ paging, search }) => {
      const result = await stickiesService.getStickies({ ...paging, search });

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
