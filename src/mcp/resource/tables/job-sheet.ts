import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { JobSheetService } from "../../../services/tables/job-sheet.service";
import { jobSheetZod } from "../../../types/zod/job-sheet";
import { pagingSchema } from "../../../types/zod/paging";

const jobSheetService = new JobSheetService(loadMoneyWorksConfig());

export function registerJobSheetTools(server: McpServer) {
  server.tool(
    "searchJobSheets",
    "Search for job sheets",
    { paging: pagingSchema, search: z.optional(jobSheetZod.partial()) },
    async ({ paging, search }) => {
      const result = await jobSheetService.getJobSheets({ ...paging, search });

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
