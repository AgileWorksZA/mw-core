import { MoneyWorksApiService } from "../moneyworks-api.service";
import { Stickies, StickiesFields } from "../../moneyworks/types/stickies";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../../types/moneyworks";
import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/stickies-schema";

/**
 * Service for interacting with MoneyWorks Stickies table
 * Stickies are sticky notes attached to records
 */
export class StickiesService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToStickies(data: any): Stickies {
    return StickiesFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Stickies record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as Stickies);
  }

  /**
   * Get stickies from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed stickies data with pagination metadata
   */
  async getStickies(params: {
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
      const { data, pagination } = await this.api.export("stickies", mwParams);

      // Parse the response
      const stickies = data.map(this.dataCenterJsonToStickies);

      return {
        data: stickies,
        pagination
      };
    } catch (error) {
      console.error("Error fetching stickies:", error);
      throw error;
    }
  }

  /**
   * Get stickies for a specific record type and ID
   * 
   * @param recordType The record type (e.g., "name", "transaction")
   * @param recordId The record ID
   * @returns Stickies for the record
   */
  async getStickiesByRecord(recordType: string, recordId: string) {
    try {
      const response = await this.api.export("stickies", {
        search: `recordtype=\`${recordType}\` AND recordid=\`${recordId}\``,
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const stickies = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToStickies)
        : [this.dataCenterJsonToStickies(response.data)];

      return {
        data: stickies,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching stickies for ${recordType} ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Get a single sticky by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Stickies details
   */
  async getStickyBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("stickies", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Sticky note with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const stickyData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToStickies(stickyData);
    } catch (error) {
      console.error(`Error fetching sticky note with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}