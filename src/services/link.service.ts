import { MoneyWorksApiService } from "./moneyworks-api.service";
import { Link, LinkFields } from "../moneyworks/types/link";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/link-schema";

/**
 * Service for interacting with MoneyWorks Link table
 * Links represent associations between different records
 */
export class LinkService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLink(data: any): Link {
    return LinkFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Link record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as Link);
  }

  /**
   * Get links from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed link data with pagination metadata
   */
  async getLinks(params: {
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
      const { data, pagination } = await this.api.export("link", mwParams);

      // Parse the response
      const links = data.map(this.dataCenterJsonToLink);

      return {
        data: links,
        pagination
      };
    } catch (error) {
      console.error("Error fetching links:", error);
      throw error;
    }
  }

  /**
   * Get links for a specific record type and ID
   * 
   * @param recordType The record type (e.g., "name", "transaction")
   * @param recordId The record ID
   * @returns Links for the record
   */
  async getLinksByRecord(recordType: string, recordId: string) {
    try {
      const response = await this.api.export("link", {
        search: `source=\`${recordType}\` AND sourceid=\`${recordId}\``,
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const links = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToLink)
        : [this.dataCenterJsonToLink(response.data)];

      return {
        data: links,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching links for ${recordType} ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Get a single link by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Link details
   */
  async getLinkBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("link", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Link with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const linkData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToLink(linkData);
    } catch (error) {
      console.error(`Error fetching link with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}