import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type User, UserFields } from "../../types/interface/user";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/user-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks User table
 * User entries in MoneyWorks
 */
export class UserService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToUser(data: ANY): User {
    return UserFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for User record`);
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as User);
  }

  /**
   * Get users from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed user data with pagination metadata
   */
  async getUsers(params: {
    limit?: number;
    offset?: number;
    search?: Partial<User>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<User> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("user", mwParams);

      // Parse the response
      const users = data.map(this.dataCenterJsonToUser);

      return {
        data: users,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}
