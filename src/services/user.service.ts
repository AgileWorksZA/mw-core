import { MoneyWorksApiService } from "./moneyworks-api.service";
import { User, UserFields } from "../moneyworks/types/user";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/user-schema";

/**
 * Service for interacting with MoneyWorks User table
 * Users represent system users with access permissions
 */
export class UserService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToUser(data: any): User {
    return UserFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for User record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
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
      const { data, pagination } = await this.api.export("user", mwParams);

      // Parse the response
      const users = data.map(this.dataCenterJsonToUser);

      return {
        data: users,
        pagination
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  /**
   * Get a single user by username
   *
   * @param username The username to look up
   * @returns User details
   */
  async getUserByUsername(username: string) {
    try {
      const response = await this.api.export("user", {
        search: `username=\`${username}\``,
        format: "xml-verbose"
      });

      if (!response.data[0]) {
        throw new Error(`User with username "${username}" not found`);
      }

      return this.dataCenterJsonToUser(response.data[0]);
    } catch (error) {
      console.error(`Error fetching user with username ${username}:`, error);
      throw error;
    }
  }

  /**
   * Get a single user by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns User details
   */
  async getUserBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("user", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`User with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToUser(userData);
    } catch (error) {
      console.error(`Error fetching user with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}