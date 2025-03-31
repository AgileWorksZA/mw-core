import { enforceType } from "../../types/helpers";
import { type Memo, MemoFields } from "../../types/interface/memo";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/memo-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Memo table
 * Memos are notes attached to other records
 */
export class MemoService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToMemo(data: any): Memo {
    return MemoFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Memo record`);
      }
      (acc as any)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Memo);
  }

  /**
   * Get memos from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed memo data with pagination metadata
   */
  async getMemos(params: {
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
      const { data, pagination } = await this.api.export("memo", mwParams);

      // Parse the response
      const memos = data.map(this.dataCenterJsonToMemo);

      return {
        data: memos,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching memos:", error);
      throw error;
    }
  }

  /**
   * Get memos for a specific record type and ID
   *
   * @param recordType The type of record (e.g., "name", "transaction")
   * @param recordId The ID of the record
   * @returns Memo details
   */
  async getMemosByRecord(recordType: string, recordId: string) {
    try {
      const response = await this.api.export("memo", {
        search: `recordtype=\`${recordType}\` AND recordid=\`${recordId}\``,
        format: "xml-verbose",
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const memos = Array.isArray(response.data)
        ? response.data.map(this.dataCenterJsonToMemo)
        : [this.dataCenterJsonToMemo(response.data)];

      return {
        data: memos,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error(
        `Error fetching memos for ${recordType} ${recordId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get a single memo by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Memo details
   */
  async getMemoBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("memo", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose",
      });

      if (!response?.data) {
        throw new Error(`Memo with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const memoData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return this.dataCenterJsonToMemo(memoData);
    } catch (error) {
      console.error(
        `Error fetching memo with sequence number ${seqNumber}:`,
        error,
      );
      throw error;
    }
  }
}
