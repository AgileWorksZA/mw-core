import { MoneyWorksApiService } from "./moneyworks-api.service";
import { AutoSplit, AutoSplitFields } from "../moneyworks/types/auto-split";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/autosplit-schema";

/**
 * Service for interacting with MoneyWorks AutoSplit table
 * AutoSplits define rules for automatically splitting transaction amounts
 */
export class AutoSplitService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAutoSplit(data: any): AutoSplit {
    return AutoSplitFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for AutoSplit record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as AutoSplit);
  }

  /**
   * Get autoSplits from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed autoSplit data with pagination metadata
   */
  async getAutoSplits(params: {
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
      const { data, pagination } = await this.api.export("autosplit", mwParams);

      // Parse the response
      const autoSplits = data.map(this.dataCenterJsonToAutoSplit);

      return {
        data: autoSplits,
        pagination
      };
    } catch (error) {
      console.error("Error fetching autoSplits:", error);
      throw error;
    }
  }

  /**
   * Get a single autoSplit by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns AutoSplit details
   */
  async getAutoSplitBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("autosplit", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`AutoSplit with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const autoSplitData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToAutoSplit(autoSplitData);
    } catch (error) {
      console.error(`Error fetching autoSplit with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}