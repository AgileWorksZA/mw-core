import { MoneyWorksApiService } from "./moneyworks-api.service";
import { Account, AccountFields } from "../moneyworks/types/account";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/account-schema";

/**
 * Service for interacting with MoneyWorks Account table
 * Accounts represent GL accounts in the chart of accounts
 */
export class AccountService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAccount(data: any): Account {
    return AccountFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Account record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as Account);
  }

  /**
   * Get accounts from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed account data with pagination metadata
   */
  async getAccounts(params: {
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
      const { data, pagination } = await this.api.export("account", mwParams);

      // Parse the response
      const accounts = data.map(this.dataCenterJsonToAccount);

      return {
        data: accounts,
        pagination
      };
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  }

  /**
   * Get a single account by code
   *
   * @param code The account code to look up
   * @returns Account details
   */
  async getAccountByCode(code: string) {
    try {
      const response = await this.api.export("account", {
        search: `code=\`${code}\``,
        format: "xml-verbose"
      });

      if (!response.data[0]) {
        throw new Error(`Account with code "${code}" not found`);
      }

      return this.dataCenterJsonToAccount(response.data[0]);
    } catch (error) {
      console.error(`Error fetching account with code ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get a single account by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Account details
   */
  async getAccountBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("account", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Account with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const accountData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToAccount(accountData);
    } catch (error) {
      console.error(`Error fetching account with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}