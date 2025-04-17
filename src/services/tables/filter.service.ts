import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Filter,
  type FilterField,
  FilterFields,
} from "../../types/interface/tables/filter";
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Filter);
  }

  dataCenterJsonToFilterUsingFields(fields: FilterField[], data: ANY): Filter {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Filter record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!FilterFields.includes(field as FilterField)) {
            throw new Error(
              `Invalid field '${field}' for Filter table. Valid fields are: ${FilterFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Filter> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("filter", mwParams);

      // Parse the response
      const filters = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToFilterUsingFields(
              params.fields as FilterField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToFilter);

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
