import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Job, JobFields } from "../../types/interface/job";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/job-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Job table
 * Job entries in MoneyWorks
 */
export class JobService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToJob(data: ANY): Job {
    return JobFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Job record`);
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Job);
  }

  /**
   * Get jobs from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed job data with pagination metadata
   */
  async getJobs(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Job>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Job> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("job", mwParams);

      // Parse the response
      const jobs = data.map(this.dataCenterJsonToJob);

      return {
        data: jobs,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  }
}
