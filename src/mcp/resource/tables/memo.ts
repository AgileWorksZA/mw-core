import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { MemoService } from "../../../services/tables/memo.service";
import { memoZod } from "../../../types/zod/tables/memo";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";

const memoService = new MemoService(loadMoneyWorksConfig());

export function registerMemoTools(server: McpServer) {
  server.tool(
    "searchMemos",
    "Search for memos",
    { paging: pagingSelectionSchema, search: z.optional(memoZod.partial()) },
    async ({ paging, search }) => {
      const result = await memoService.getMemos({ ...paging, search });

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
