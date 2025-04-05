import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { LogService } from "../../../services/tables/log.service";
import { logZod } from "../../../types/zod/tables/log";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";

const logService = new LogService(loadMoneyWorksConfig());

export function registerLogTools(server: McpServer) {
  server.tool(
    "searchLogs",
    "Search for logs",
    { paging: pagingSelectionSchema, search: z.optional(logZod.partial()) },
    async ({ paging, search }) => {
      const result = await logService.getLogs({ ...paging, search });

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
