import { MoneyWorksApiService } from "../moneyworks-api.service";
import { Build, BuildFields } from "../../moneyworks/types/build";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../../types/moneyworks";
import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/build-schema";

/**
 * Service for interacting with MoneyWorks Build table
 * Builds represent item assembly operations
 */
export class BuildService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToBuild(data: any): Build {
    return BuildFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Build record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as Build);
  }

  /**
   * Get builds from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed build data with pagination metadata
   */
  async getBuilds(params: {
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
      const { data, pagination } = await this.api.export("build", mwParams);

      // Parse the response
      const builds = data.map(this.dataCenterJsonToBuild);

      return {
        data: builds,
        pagination
      };
    } catch (error) {
      console.error("Error fetching builds:", error);
      throw error;
    }
  }

  /**
   * Get a single build by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Build details
   */
  async getBuildBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("build", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Build with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const buildData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToBuild(buildData);
    } catch (error) {
      console.error(`Error fetching build with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}