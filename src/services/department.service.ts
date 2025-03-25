import { MoneyWorksApiService } from "./moneyworks-api.service";
import { Department, DepartmentFields } from "../moneyworks/types/department";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/department-schema";

/**
 * Service for interacting with MoneyWorks Department table
 * Departments represent cost centers or profit centers
 */
export class DepartmentService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToDepartment(data: any): Department {
    return DepartmentFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Department record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
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
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose"
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("department", mwParams);

      // Parse the response
      const departments = data.map(this.dataCenterJsonToDepartment);

      return {
        data: departments,
        pagination
      };
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  }

  /**
   * Get a single department by code
   *
   * @param code The department code to look up
   * @returns Department details
   */
  async getDepartmentByCode(code: string) {
    try {
      const response = await this.api.export("department", {
        search: `code=\`${code}\``,
        format: "xml-verbose"
      });

      if (!response.data[0]) {
        throw new Error(`Department with code "${code}" not found`);
      }

      return this.dataCenterJsonToDepartment(response.data[0]);
    } catch (error) {
      console.error(`Error fetching department with code ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get a single department by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Department details
   */
  async getDepartmentBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("department", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Department with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const departmentData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToDepartment(departmentData);
    } catch (error) {
      console.error(`Error fetching department with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}