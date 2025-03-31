import { enforceType } from "../../types/helpers";
import {
  type OffLedger,
  OffLedgerFields,
} from "../../types/interface/off-ledger";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/offledger-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks OffLedger table
 * OffLedger entries represent transactions outside the main ledger
 */
export class OffLedgerService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToOffLedger(data: any): OffLedger {
    return OffLedgerFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for OffLedger record`,
        );
      }
      (acc as any)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as OffLedger);
  }

  /**
   * Get offLedger entries from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed offLedger data with pagination metadata
   */
  async getOffLedgerEntries(params: {
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
      const { data, pagination } = await this.api.export("offledger", mwParams);

      // Parse the response
      const offLedgerEntries = data.map(this.dataCenterJsonToOffLedger);

      return {
        data: offLedgerEntries,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching offLedger entries:", error);
      throw error;
    }
  }

  /**
   * Get offLedger entries for a specific account
   *
   * @param accountCode The account code
   * @returns OffLedger entries for the account
   */
  async getOffLedgerEntriesByAccount(accountCode: string) {
    try {
      const response = await this.api.export("offledger", {
        search: `account=\`${accountCode}\``,
        format: "xml-verbose",
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const offLedgerEntries = Array.isArray(response.data)
        ? response.data.map(this.dataCenterJsonToOffLedger)
        : [this.dataCenterJsonToOffLedger(response.data)];

      return {
        data: offLedgerEntries,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error(
        `Error fetching offLedger entries for account ${accountCode}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get a single offLedger entry by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns OffLedger entry
   */
  async getOffLedgerEntryBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("offledger", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose",
      });

      if (!response?.data) {
        throw new Error(
          `OffLedger entry with sequence number "${seqNumber}" not found`,
        );
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const offLedgerData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return this.dataCenterJsonToOffLedger(offLedgerData);
    } catch (error) {
      console.error(
        `Error fetching offLedger entry with sequence number ${seqNumber}:`,
        error,
      );
      throw error;
    }
  }
}
