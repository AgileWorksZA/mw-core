import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { UserService } from "../../../services/tables/user.service";
import { pagingSchema } from "../../../types/zod/paging";
import { userZod } from "../../../types/zod/user";

const userService = new UserService(loadMoneyWorksConfig());

export function registerUserTools(server: McpServer) {
  server.tool(
    "searchUsers",
    "Search for users",
    { paging: pagingSchema, search: z.optional(userZod.partial()) },
    async ({ paging, search }) => {
      const result = await userService.getUsers({ ...paging, search });

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
