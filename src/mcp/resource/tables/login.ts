import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { LoginService } from "../../../services/tables/login.service";
import { loginZod } from "../../../types/zod/login";
import { pagingSelectionSchema } from "../../../types/zod/paging";

const loginService = new LoginService(loadMoneyWorksConfig());

export function registerLoginTools(server: McpServer) {
  server.tool(
    "searchLogins",
    "Search for logins",
    { paging: pagingSelectionSchema, search: z.optional(loginZod.partial()) },
    async ({ paging, search }) => {
      const result = await loginService.getLogins({ ...paging, search });

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
