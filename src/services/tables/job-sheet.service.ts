import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type JobSheet,
  type JobSheetField,
  JobSheetFields,
} from "../../types/interface/tables/jobsheet";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/jobsheet-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks JobSheet table
 * Job sheets represent work sheets for jobs
 */
export class JobSheetService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToJobSheet(data: ANY): JobSheet {
    return JobSheetFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for JobSheet record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as JobSheet);
  }

  dataCenterJsonToJobSheetUsingFields(
    fields: JobSheetField[],
    data: ANY,
  ): JobSheet {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for JobSheet record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as JobSheet);
  }

  /**
   * Get jobSheets from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed job-sheet data with pagination metadata
   */
  async getJobSheets(params: {
    limit?: number;
    offset?: number;
    search?: Partial<JobSheet>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!JobSheetFields.includes(field as JobSheetField)) {
            throw new Error(
              `Invalid field '${field}' for JobSheet table. Valid fields are: ${JobSheetFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<JobSheet> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("jobsheet", mwParams);

      // Parse the response
      const jobSheets = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToJobSheetUsingFields(
              params.fields as JobSheetField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToJobSheet);

      return {
        data: jobSheets,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching jobSheets:", error);
      throw error;
    }
  }
}
