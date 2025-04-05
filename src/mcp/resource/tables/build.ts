import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { BuildService } from "../../../services/tables/build.service";
import { buildZod } from "../../../types/zod/tables/build";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";

const buildService = new BuildService(loadMoneyWorksConfig());

export function registerBuildTools(server: McpServer) {
  server.tool(
    "searchBuilds",
    "Search for builds",
    { paging: pagingSelectionSchema, search: z.optional(buildZod.partial()) },
    async ({ paging, search }) => {
      const result = await buildService.getBuilds({ ...paging, search });

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
