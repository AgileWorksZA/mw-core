import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type User2, User2Fields } from "../../types/interface/tables/user2";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/user2-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks User2 table
 * User2 entries in MoneyWorks
 */
export class User2Service {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToUser2(data: ANY): User2 {
    return User2Fields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for User2 record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as User2);
  }

  /**
   * Get user2s from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed user2 data with pagination metadata
   */
  async getUser2s(params: {
    limit?: number;
    offset?: number;
    search?: Partial<User2>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<User2> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("user2", mwParams);

      // Parse the response
      const user2s = data.map(this.dataCenterJsonToUser2);

      return {
        data: user2s,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching user2s:", error);
      throw error;
    }
  }
}
