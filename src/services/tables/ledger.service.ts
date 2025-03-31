import { MoneyWorksApiService } from "../moneyworks-api.service";
import { Ledger, LedgerFields } from "../../moneyworks/types/ledger";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../../types/moneyworks";
import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/ledger-schema";

/**
 * Service for interacting with MoneyWorks Ledger table
 * Ledger entries represent account transactions
 */
export class LedgerService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLedger(data: any): Ledger {
    return LedgerFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Ledger record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as Ledger);
  }

  /**
   * Get ledger entries from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed ledger data with pagination metadata
   */
  async getLedgerEntries(params: {
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
      const { data, pagination } = await this.api.export("ledger", mwParams);

      // Parse the response
      const ledgerEntries = data.map(this.dataCenterJsonToLedger);

      return {
        data: ledgerEntries,
        pagination
      };
    } catch (error) {
      console.error("Error fetching ledger entries:", error);
      throw error;
    }
  }

  /**
   * Get ledger entries for a specific account
   *
   * @param accountCode The account code
   * @returns Ledger entries for the account
   */
  async getLedgerEntriesByAccount(accountCode: string) {
    try {
      const response = await this.api.export("ledger", {
        search: `account=\`${accountCode}\``,
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const ledgerEntries = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToLedger)
        : [this.dataCenterJsonToLedger(response.data)];

      return {
        data: ledgerEntries,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching ledger entries for account ${accountCode}:`, error);
      throw error;
    }
  }

  /**
   * Get ledger entries for a specific transaction
   *
   * @param transactionId The transaction sequence number
   * @returns Ledger entries for the transaction
   */
  async getLedgerEntriesByTransaction(transactionId: number) {
    try {
      const response = await this.api.export("ledger", {
        search: `transactionreference=${transactionId}`,
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const ledgerEntries = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToLedger)
        : [this.dataCenterJsonToLedger(response.data)];

      return {
        data: ledgerEntries,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching ledger entries for transaction ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Get a single ledger entry by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Ledger entry
   */
  async getLedgerEntryBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("ledger", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Ledger entry with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const ledgerData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToLedger(ledgerData);
    } catch (error) {
      console.error(`Error fetching ledger entry with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}