import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { ListsService } from "../../../services/tables/lists.service";
import { listsZod } from "../../../types/zod/lists";
import { pagingSelectionSchema } from "../../../types/zod/paging";

const listsService = new ListsService(loadMoneyWorksConfig());

export function registerListTools(server: McpServer) {
  server.tool(
    "searchLists",
    "Search for lists",
    { paging: pagingSelectionSchema, search: z.optional(listsZod.partial()) },
    async ({ paging, search }) => {
      const result = await listsService.getLists({ ...paging, search });

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
