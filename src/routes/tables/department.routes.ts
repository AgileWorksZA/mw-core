import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { DepartmentService } from "../../services/tables/department.service";
import { departmentObject } from "../../types/constants.eden";
import { DepartmentMany } from "../../types/eden/tables/Department";
import {
  type Department,
  DepartmentFields,
} from "../../types/interface/tables/department";

// Initialize the department service with configuration
const config = loadMoneyWorksConfig();
const departmentService = new DepartmentService(config);

export const departmentRoutes = new Elysia({ prefix: "/api" }).get(
  "/departments",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await departmentService.getDepartments({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Department>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /departments:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(departmentObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Departments",
      description: `Defines Departments or cost centres used for sub-ledger accounting and reporting (Gold/Datacentre only).

      Search by: ${DepartmentFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/departments?format=SequenceNumber,Code,Description`,
    },
    tags: ["CRM"],
    response: { $schema: { $ref: "#/components/schemas/Departments" } },
  },
);
