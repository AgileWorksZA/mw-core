import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Stickies, StickiesFields } from "../../types/interface/stickies";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/stickies-schema";
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

  dataCenterJsonToStickies(data: ANY): Stickies {
    return StickiesFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Stickies record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Stickies);
  }

  /**
   * Get stickiess from MoneyWorks with pagination and filtering
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
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Stickies> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("stickies", mwParams);

      // Parse the response
      const stickies = data.map(this.dataCenterJsonToStickies);

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
