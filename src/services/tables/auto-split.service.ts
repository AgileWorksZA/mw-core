import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type AutoSplit,
  AutoSplitFields,
} from "../../types/interface/auto-split";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/autosplit-schema";
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
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<AutoSplit> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("autosplit", mwParams);

      // Parse the response
      const autoSplits = data.map(this.dataCenterJsonToAutoSplit);

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
