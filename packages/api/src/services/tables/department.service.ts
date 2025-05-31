import { type Department, DepartmentFields } from "../../types/interface/tables/department";
import schema from "../../types/optimized/table/department-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Department table
 * Department entries in MoneyWorks
 */
export class DepartmentService extends TableService<Department> {
  constructor() {
    super("department", schema, DepartmentFields);
  }
}
