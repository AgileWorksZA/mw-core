import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { User2Service } from "../../../services/tables/user2.service";
import { pagingSelectionSchema } from "../../../types/zod/paging";
import { user2Zod } from "../../../types/zod/user2";

const user2Service = new User2Service(loadMoneyWorksConfig());

export function registerUser2Tools(server: McpServer) {
  server.tool(
    "searchUser2s",
    "Search for user2 entries",
    { paging: pagingSelectionSchema, search: z.optional(user2Zod.partial()) },
    async ({ paging, search }) => {
      const result = await user2Service.getUser2s({ ...paging, search });

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
