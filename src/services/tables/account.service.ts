import { enforceType } from "../../types/helpers";
import { type Account, AccountFields } from "../../types/interface/account";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/account-schema";
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
    search?: Partial<Account>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Account> = {
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
}
