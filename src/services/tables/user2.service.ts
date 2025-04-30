import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type User2,
  type User2Field,
  User2Fields,
} from "../../types/interface/tables/user2";
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

  dataCenterJsonToUser2UsingFields(fields: User2Field[], data: ANY): User2 {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for User2 record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as User2);
  }

  dataCenterJsonToUser2(data: ANY): User2 {
    return User2Fields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for User2 record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
    skip_validation?: boolean;
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<User2> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("user2", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to user2 objects
      const user2s = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToUser2UsingFields(
              params.fields as User2Field[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToUser2);

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
