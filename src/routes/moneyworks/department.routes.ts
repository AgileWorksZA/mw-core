import { DepartmentService } from "../../services/tables/department.service";
import { departmentObject } from "../../types/constants.eden";
import type { Department } from "../../types/interface/tables/department";
import { moneyworksRoute } from "./base/moneyworks.route";

export const departmentRoutes = moneyworksRoute<Department, "Department", typeof departmentObject>(
  "Department",
  departmentObject,
  new DepartmentService(),
  {
    summary: "Departments",
    description: "Defines Departments or cost centres used for sub-ledger accounting and reporting (Gold/Datacentre only).",
    tags: ["CRM"],
  },
);
