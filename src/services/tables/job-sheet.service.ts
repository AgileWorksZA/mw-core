import { MoneyWorksApiService } from "../moneyworks-api.service";
import { JobSheet, JobSheetFields } from "../../moneyworks/types/job-sheet";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../../types/moneyworks";
import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/jobsheet-schema";

/**
 * Service for interacting with MoneyWorks JobSheet table
 * JobSheets record time and expenses against jobs
 */
export class JobSheetService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToJobSheet(data: any): JobSheet {
    return JobSheetFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for JobSheet record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as JobSheet);
  }

  /**
   * Get jobSheets from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed jobSheet data with pagination metadata
   */
  async getJobSheets(params: {
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
      const { data, pagination } = await this.api.export("jobsheet", mwParams);

      // Parse the response
      const jobSheets = data.map(this.dataCenterJsonToJobSheet);

      return {
        data: jobSheets,
        pagination
      };
    } catch (error) {
      console.error("Error fetching jobSheets:", error);
      throw error;
    }
  }

  /**
   * Get jobSheets for a specific job
   *
   * @param jobCode The job code to look up
   * @returns JobSheets for the job
   */
  async getJobSheetsByJob(jobCode: string) {
    try {
      const response = await this.api.export("jobsheet", {
        search: `jobcode=\`${jobCode}\``,
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const jobSheets = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToJobSheet)
        : [this.dataCenterJsonToJobSheet(response.data)];

      return {
        data: jobSheets,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching jobSheets for job ${jobCode}:`, error);
      throw error;
    }
  }

  /**
   * Get a single jobSheet by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns JobSheet details
   */
  async getJobSheetBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("jobsheet", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`JobSheet with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const jobSheetData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToJobSheet(jobSheetData);
    } catch (error) {
      console.error(`Error fetching jobSheet with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}