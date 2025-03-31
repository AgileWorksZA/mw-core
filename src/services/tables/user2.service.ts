import { enforceType } from "../../types/helpers";
import { type User2, User2Fields } from "../../types/interface/user2";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/user2-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks User2 table
 * User2 contains additional user information
 */
export class User2Service {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToUser2(data: any): User2 {
    return User2Fields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for User2 record`,
        );
      }
      (acc as any)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as User2);
  }

  /**
   * Get user2 records from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed user2 data with pagination metadata
   */
  async getUser2Records(params: {
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
      const { data, pagination } = await this.api.export("user2", mwParams);

      // Parse the response
      const user2Records = data.map(this.dataCenterJsonToUser2);

      return {
        data: user2Records,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching user2 records:", error);
      throw error;
    }
  }

  /**
   * Get a single user2 record by username
   *
   * @param username The username to look up
   * @returns User2 details
   */
  async getUser2ByUsername(username: string) {
    try {
      const response = await this.api.export("user2", {
        search: `username=\`${username}\``,
        format: "xml-verbose",
      });

      if (!response.data[0]) {
        throw new Error(`User2 record with username "${username}" not found`);
      }

      return this.dataCenterJsonToUser2(response.data[0]);
    } catch (error) {
      console.error(
        `Error fetching user2 record with username ${username}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get a single user2 record by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns User2 details
   */
  async getUser2BySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("user2", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose",
      });

      if (!response?.data) {
        throw new Error(
          `User2 record with sequence number "${seqNumber}" not found`,
        );
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const user2Data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return this.dataCenterJsonToUser2(user2Data);
    } catch (error) {
      console.error(
        `Error fetching user2 record with sequence number ${seqNumber}:`,
        error,
      );
      throw error;
    }
  }
}
