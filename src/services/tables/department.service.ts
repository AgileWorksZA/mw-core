import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Department,
  DepartmentFields,
} from "../../types/interface/tables/department";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/department-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Department table
 * Department entries in MoneyWorks
 */
export class DepartmentService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToDepartment(data: ANY): Department {
    return DepartmentFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Department record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Department);
  }

  /**
   * Get departments from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed department data with pagination metadata
   */
  async getDepartments(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Department>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Department> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export(
        "department",
        mwParams,
      );

      // Parse the response
      const departments = data.map(this.dataCenterJsonToDepartment);

      return {
        data: departments,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  }
}
