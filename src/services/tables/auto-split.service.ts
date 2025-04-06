import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type AutoSplit,
  type AutoSplitField,
  AutoSplitFields,
} from "../../types/interface/tables/autosplit";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/autosplit-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks AutoSplit table
 * Auto splits represent automatic transaction splits
 */
export class AutoSplitService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAutoSplit(data: ANY): AutoSplit {
    return AutoSplitFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for AutoSplit record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as AutoSplit);
  }

  dataCenterJsonToAutoSplitUsingFields(
    fields: AutoSplitField[],
    data: ANY,
  ): AutoSplit {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for AutoSplit record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as AutoSplit);
  }

  /**
   * Get autoSplits from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed auto-split data with pagination metadata
   */
  async getAutoSplits(params: {
    limit?: number;
    offset?: number;
    search?: Partial<AutoSplit>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!AutoSplitFields.includes(field as AutoSplitField)) {
            throw new Error(
              `Invalid field '${field}' for AutoSplit table. Valid fields are: ${AutoSplitFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<AutoSplit> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("autosplit", mwParams);

      // Parse the response
      const autoSplits = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToAutoSplitUsingFields(
              params.fields as AutoSplitField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToAutoSplit);

      return {
        data: autoSplits,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching autoSplits:", error);
      throw error;
    }
  }
}
