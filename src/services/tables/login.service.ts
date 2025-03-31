import { MoneyWorksApiService } from "../moneyworks-api.service";
import { Login, LoginFields } from "../../moneyworks/types/login";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../../types/moneyworks";
import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/login-schema";

/**
 * Service for interacting with MoneyWorks Login table
 * Logins record user login sessions
 */
export class LoginService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLogin(data: any): Login {
    return LoginFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Login record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
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
        sort: params.sort || 'when',
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose"
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("login", mwParams);

      // Parse the response
      const logins = data.map(this.dataCenterJsonToLogin);

      return {
        data: logins,
        pagination
      };
    } catch (error) {
      console.error("Error fetching logins:", error);
      throw error;
    }
  }

  /**
   * Get logins for a specific user
   *
   * @param username The username to look up
   * @returns Login entries for that user
   */
  async getLoginsByUser(username: string) {
    try {
      const response = await this.api.export("login", {
        search: `user=\`${username}\``,
        sort: 'when',
        direction: 'descending',
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const logins = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToLogin)
        : [this.dataCenterJsonToLogin(response.data)];

      return {
        data: logins,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching logins for user ${username}:`, error);
      throw error;
    }
  }

  /**
   * Get a single login entry by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Login details
   */
  async getLoginBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("login", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Login entry with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const loginData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToLogin(loginData);
    } catch (error) {
      console.error(`Error fetching login with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}