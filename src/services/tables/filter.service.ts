import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Filter, FilterFields } from "../../types/interface/tables/filter";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/filter-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Filter table
 * Filter entries in MoneyWorks
 */
export class FilterService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToFilter(data: ANY): Filter {
    return FilterFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Filter record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Filter);
  }

  /**
   * Get filters from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed filter data with pagination metadata
   */
  async getFilters(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Filter>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Filter> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("filter", mwParams);

      // Parse the response
      const filters = data.map(this.dataCenterJsonToFilter);

      return {
        data: filters,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching filters:", error);
      throw error;
    }
  }
}
