import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type User,
  type UserField,
  UserFields,
} from "../../types/interface/tables/user";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/user-schema";
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

  dataCenterJsonToUserUsingFields(fields: UserField[], data: ANY): User {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(`Missing key ${key} in data center json for User record`);
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as User);
  }

  dataCenterJsonToUser(data: ANY): User {
    return UserFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for User record`);
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<User> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("user", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to user objects
      const users = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToUserUsingFields(
              params.fields as UserField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToUser);

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
