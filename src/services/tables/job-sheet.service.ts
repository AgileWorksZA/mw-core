import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type JobSheet, JobSheetFields } from "../../types/interface/job-sheet";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/jobsheet-schema";
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
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<JobSheet> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("jobsheet", mwParams);

      // Parse the response
      const jobSheets = data.map(this.dataCenterJsonToJobSheet);

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
