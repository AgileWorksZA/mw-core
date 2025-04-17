import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Job,
  type JobField,
  JobFields,
} from "../../types/interface/tables/job";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/job-schema";
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Job);
  }

  dataCenterJsonToJobUsingFields(fields: JobField[], data: ANY): Job {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(`Missing key ${key} in data center json for Job record`);
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!JobFields.includes(field as JobField)) {
            throw new Error(
              `Invalid field '${field}' for Job table. Valid fields are: ${JobFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Job> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("job", mwParams);

      // Parse the response
      const jobs = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToJobUsingFields(params.fields as JobField[], d),
          )
        : data.map(this.dataCenterJsonToJob);

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
