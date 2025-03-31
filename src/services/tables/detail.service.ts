import { MoneyWorksApiService } from "../moneyworks-api.service";
import { Detail, DetailFields } from "../../moneyworks/types/detail";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../../types/moneyworks";
import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/detail-schema";

/**
 * Service for interacting with MoneyWorks Detail table
 * Details are line items in transactions
 */
export class DetailService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToDetail(data: any): Detail {
    return DetailFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Detail record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as Detail);
  }

  /**
   * Get detail records from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed detail data with pagination metadata
   */
  async getDetails(params: {
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
      const { data, pagination } = await this.api.export("detail", mwParams);

      // Parse the response
      const details = data.map(this.dataCenterJsonToDetail);

      return {
        data: details,
        pagination
      };
    } catch (error) {
      console.error("Error fetching details:", error);
      throw error;
    }
  }

  /**
   * Get detail records for a specific transaction
   *
   * @param transactionId The transaction sequence number
   * @returns Detail records for the transaction
   */
  async getDetailsByTransaction(transactionId: number) {
    try {
      const response = await this.api.export("detail", {
        search: `transactionreference=${transactionId}`,
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const details = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToDetail)
        : [this.dataCenterJsonToDetail(response.data)];

      return {
        data: details,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching details for transaction ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Get a single detail by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Detail record
   */
  async getDetailBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("detail", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Detail with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const detailData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToDetail(detailData);
    } catch (error) {
      console.error(`Error fetching detail with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}