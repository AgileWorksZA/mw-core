import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Stickies,
  type StickiesField,
  StickiesFields,
} from "../../types/interface/tables/stickies";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/stickies-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Stickies table
 * Stickies entries in MoneyWorks
 */
export class StickiesService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToStickiesUsingFields(
    fields: StickiesField[],
    data: ANY,
  ): Stickies {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Stickies record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Stickies);
  }

  dataCenterJsonToStickies(data: ANY): Stickies {
    return StickiesFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Stickies record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Stickies);
  }

  /**
   * Get stickies from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed stickies data with pagination metadata
   */
  async getStickies(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Stickies>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    // Validate fields against StickiesFields if provided
    if (params.fields && params.fields.length > 0) {
      for (const field of params.fields) {
        if (!StickiesFields.includes(field as StickiesField)) {
          throw new Error(
            `Invalid field '${field}' for Stickies table. Valid fields are: ${StickiesFields.join(", ")}`,
          );
        }
      }
    }

    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Stickies> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("stickies", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to stickies objects
      const stickies = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToStickiesUsingFields(
              params.fields as StickiesField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToStickies);

      return {
        data: stickies,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching stickies:", error);
      throw error;
    }
  }
}
