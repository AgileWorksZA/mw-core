import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Department,
  type DepartmentField,
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Department);
  }

  dataCenterJsonToDepartmentUsingFields(
    fields: DepartmentField[],
    data: ANY,
  ): Department {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Department record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!DepartmentFields.includes(field as DepartmentField)) {
            throw new Error(
              `Invalid field '${field}' for Department table. Valid fields are: ${DepartmentFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Department> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export(
        "department",
        mwParams,
      );

      // Parse the response
      const departments = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToDepartmentUsingFields(
              params.fields as DepartmentField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToDepartment);

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
