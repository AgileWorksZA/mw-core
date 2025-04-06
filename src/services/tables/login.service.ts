import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Login, LoginFields } from "../../types/interface/tables/login";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/login-schema";
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Login);
  }

  dataCenterJsonToLoginUsingFields(fields: string[], data: ANY): Login {
    return fields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Login record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!LoginFields.includes(field as keyof typeof schema)) {
            throw new Error(
              `Invalid field '${field}' for Login table. Valid fields are: ${LoginFields.join(", ")}`
            );
          }
        }
      }
      
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Login> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("login", mwParams);

      // Parse the response
      const logins = params.fields
        ? data.map((d) => this.dataCenterJsonToLoginUsingFields(params.fields as string[], d))
        : data.map(this.dataCenterJsonToLogin);

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
