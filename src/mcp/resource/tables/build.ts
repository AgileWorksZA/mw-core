import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { BuildService } from "../../../services/tables/build.service";
import { buildZod } from "../../../types/zod/build";
import { pagingSchema } from "../../../types/zod/paging";

const buildService = new BuildService(loadMoneyWorksConfig());

export function registerBuildTools(server: McpServer) {
  server.tool(
    "searchBuilds",
    "Search for builds",
    { paging: pagingSchema, search: z.optional(buildZod.partial()) },
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
