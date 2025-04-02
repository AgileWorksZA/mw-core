import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { LogService } from "../../../services/tables/log.service";
import { logZod } from "../../../types/zod/log";
import { pagingSchema } from "../../../types/zod/paging";

const logService = new LogService(loadMoneyWorksConfig());

export function registerLogTools(server: McpServer) {
  server.tool(
    "searchLogs",
    "Search for logs",
    { paging: pagingSchema, search: z.optional(logZod.partial()) },
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
