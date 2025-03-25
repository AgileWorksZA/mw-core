import { MoneyWorksApiService } from "./moneyworks-api.service";
import { BankRecs, BankRecsFields } from "../moneyworks/types/bank-recs";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/bankrecs-schema";

/**
 * Service for interacting with MoneyWorks BankRecs table
 * BankRecs represent bank reconciliation entries
 */
export class BankRecsService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToBankRecs(data: any): BankRecs {
    return BankRecsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for BankRecs record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as BankRecs);
  }

  /**
   * Get bankRecs from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed bankRecs data with pagination metadata
   */
  async getBankRecs(params: {
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
      const { data, pagination } = await this.api.export("bankrecs", mwParams);

      // Parse the response
      const bankRecs = data.map(this.dataCenterJsonToBankRecs);

      return {
        data: bankRecs,
        pagination
      };
    } catch (error) {
      console.error("Error fetching bankRecs:", error);
      throw error;
    }
  }

  /**
   * Get bankRecs for a specific account
   *
   * @param accountCode The account code to look up
   * @returns BankRecs for the account
   */
  async getBankRecsByAccount(accountCode: string) {
    try {
      const response = await this.api.export("bankrecs", {
        search: `account=\`${accountCode}\``,
        format: "xml-verbose"
      });

      if (!response.data[0]) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const bankRecs = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToBankRecs)
        : [this.dataCenterJsonToBankRecs(response.data)];

      return {
        data: bankRecs,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching bankRecs for account ${accountCode}:`, error);
      throw error;
    }
  }

  /**
   * Get a single bankRec by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns BankRecs details
   */
  async getBankRecsBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("bankrecs", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`BankRecs with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const bankRecsData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToBankRecs(bankRecsData);
    } catch (error) {
      console.error(`Error fetching bankRecs with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}