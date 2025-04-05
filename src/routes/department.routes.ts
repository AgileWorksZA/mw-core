import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { DepartmentService } from "../services/tables/department.service";
import { departmentObject } from "../types/constants.eden";
import {
  type Department,
  DepartmentFields,
} from "../types/interface/department";

// Initialize the department service with configuration
const config = loadMoneyWorksConfig();
const departmentService = new DepartmentService(config);

export const departmentRoutes = new Elysia({ prefix: "/api" }).get(
  "/departments",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await departmentService.getDepartments({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Department,
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
    }),
    detail: {
      summary: "Get departments.",
      description: `Get all departments. Search by: ${DepartmentFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    tags: ["CRM"],
    // response: DepartmentMany,
  },
);
