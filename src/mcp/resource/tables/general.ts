import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { GeneralService } from "../../../services/tables/general.service";
import { generalZod } from "../../../types/zod/general";
import { pagingSchema } from "../../../types/zod/paging";

const generalService = new GeneralService(loadMoneyWorksConfig());

export function registerGeneralTools(server: McpServer) {
  server.tool(
    "searchGeneral",
    "Search for general settings",
    { paging: pagingSchema, search: z.optional(generalZod.partial()) },
    async ({ paging, search }) => {
      const result = await generalService.getGenerals({ ...paging, search });

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
