import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { DepartmentService } from "../../../services/tables/department.service";
import { departmentZod } from "../../../types/zod/tables/department";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";

const departmentService = new DepartmentService(loadMoneyWorksConfig());

export function registerDepartmentTools(server: McpServer) {
  server.tool(
    "searchDepartments",
    "Search for departments",
    {
      paging: pagingSelectionSchema,
      search: z.optional(departmentZod.partial()),
    },
    async ({ paging, search }) => {
      const result = await departmentService.getDepartments({
        ...paging,
        search,
      });

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
