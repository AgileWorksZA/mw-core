import { MoneyWorksApiService } from "./moneyworks-api.service";
import { Filter, FilterFields } from "../moneyworks/types/filter";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/filter-schema";

/**
 * Service for interacting with MoneyWorks Filter table
 * Filters are saved search criteria
 */
export class FilterService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToFilter(data: any): Filter {
    return FilterFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Filter record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
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
      const { data, pagination } = await this.api.export("filter", mwParams);

      // Parse the response
      const filters = data.map(this.dataCenterJsonToFilter);

      return {
        data: filters,
        pagination
      };
    } catch (error) {
      console.error("Error fetching filters:", error);
      throw error;
    }
  }

  /**
   * Get a single filter by name
   *
   * @param name The filter name to look up
   * @returns Filter details
   */
  async getFilterByName(name: string) {
    try {
      const response = await this.api.export("filter", {
        search: `name=\`${name}\``,
        format: "xml-verbose"
      });

      if (!response.data[0]) {
        throw new Error(`Filter with name "${name}" not found`);
      }

      return this.dataCenterJsonToFilter(response.data[0]);
    } catch (error) {
      console.error(`Error fetching filter with name ${name}:`, error);
      throw error;
    }
  }

  /**
   * Get a single filter by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Filter details
   */
  async getFilterBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("filter", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Filter with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const filterData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToFilter(filterData);
    } catch (error) {
      console.error(`Error fetching filter with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}