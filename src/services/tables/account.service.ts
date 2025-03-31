import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/account-schema";
import { type Account, AccountFields } from "../../moneyworks/types/account";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import { MoneyWorksApiService } from "../moneyworks-api.service";

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
        console.error(
          `Missing key ${key} in data center json for Account record`,
        );
      }
      (acc as any)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("account", mwParams);

      // Parse the response
      const accounts = data.map(this.dataCenterJsonToAccount);

      return {
        data: accounts,
        pagination,
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
  async getAccountBy(key: string, code: string) {
    try {
      const response = await this.api.export("account", {
        search: `${key}=\`${code}\``,
        format: "xml-verbose",
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
}
