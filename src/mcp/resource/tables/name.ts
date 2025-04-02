import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { NameService } from "../../../services/tables/name.service";
import { nameZod } from "../../../types/zod/name";
import { pagingSelectionSchema } from "../../../types/zod/paging";

const nameService = new NameService(loadMoneyWorksConfig());

export function registerNameTools(server: McpServer) {
  server.tool(
    "searchNames",
    "Search for names",
    { paging: pagingSelectionSchema, search: z.optional(nameZod.partial()) },
    async ({ paging, search }) => {
      const result = await nameService.getNames({ ...paging, search });

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
