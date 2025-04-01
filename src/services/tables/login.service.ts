import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Login, LoginFields } from "../../types/interface/login";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/login-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Login table
 * Login entries in MoneyWorks
 */
export class LoginService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLogin(data: ANY): Login {
    return LoginFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Login record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Login);
  }

  /**
   * Get logins from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed login data with pagination metadata
   */
  async getLogins(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Login>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Login> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("login", mwParams);

      // Parse the response
      const logins = data.map(this.dataCenterJsonToLogin);

      return {
        data: logins,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching logins:", error);
      throw error;
    }
  }
}
