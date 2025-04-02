import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { JobService } from "../../../services/tables/job.service";
import { jobZod } from "../../../types/zod/job";
import { pagingSchema } from "../../../types/zod/paging";

const jobService = new JobService(loadMoneyWorksConfig());

export function registerJobTools(server: McpServer) {
  server.tool(
    "searchJobs",
    "Search for jobs",
    { paging: pagingSchema, search: z.optional(jobZod.partial()) },
    async ({ paging, search }) => {
      const result = await jobService.getJobs({ ...paging, search });

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
