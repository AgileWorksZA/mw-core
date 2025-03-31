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
 * Jobs represent projects or activities that costs/revenue can be tracked against
 */
export class JobService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToJob(data: any): Job {
    return JobFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Job record`);
      }
      (acc as any)[key] = enforceType(
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

  /**
   * Get a single job by code
   *
   * @param code The job code to look up
   * @returns Job details
   */
  async getJobByCode(code: string) {
    try {
      const response = await this.api.export("job", {
        search: `code=\`${code}\``,
        format: "xml-verbose",
      });

      if (!response.data[0]) {
        throw new Error(`Job with code "${code}" not found`);
      }

      return this.dataCenterJsonToJob(response.data[0]);
    } catch (error) {
      console.error(`Error fetching job with code ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get a single job by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Job details
   */
  async getJobBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("job", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose",
      });

      if (!response?.data) {
        throw new Error(`Job with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const jobData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return this.dataCenterJsonToJob(jobData);
    } catch (error) {
      console.error(
        `Error fetching job with sequence number ${seqNumber}:`,
        error,
      );
      throw error;
    }
  }
}
