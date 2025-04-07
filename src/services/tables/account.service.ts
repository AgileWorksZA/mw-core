import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Account,
  type AccountField,
  AccountFields,
} from "../../types/interface/tables/account";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/account-schema";
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

  dataCenterJsonToAccountUsingFields(
    fields: AccountField[],
    data: ANY,
  ): Account {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Account record`,
        );
      }
      const value = enforceType(data[key], schema[key] as "string");
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Account);
  }
  dataCenterJsonToAccount(data: ANY): Account {
    return AccountFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Account record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[]; // Array of field names to include in the response
    skip_validation?: boolean; // Skip validation of fields
  }) {
    // Validate fields against AccountFields if provided and skip_validation is not true
    if (params.fields && params.fields.length > 0 && !params.skip_validation) {
      for (const field of params.fields) {
        if (!AccountFields.includes(field as AccountField)) {
          throw new Error(
            `Invalid field '${field}' for Account table. Valid fields are: ${AccountFields.join(", ")}`,
          );
        }
      }
    }
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Account> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("account", mwParams);
      console.log("Data:", data, data.map(this.dataCenterJsonToAccount));
      console.log("params.fields:", params.fields);

      // Parse the response
      // If we're using custom fields, the data is already in the correct format
      // Otherwise, map the full data to account objects
      const accounts = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToAccountUsingFields(
              params.fields as AccountField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToAccount);

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
