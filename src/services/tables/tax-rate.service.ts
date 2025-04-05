import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type TaxRate,
  TaxRateFields,
} from "../../types/interface/tables/tax-rate";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/tax-rate-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks TaxRate table
 * Tax rates represent tax codes and rates
 */
export class TaxRateService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToTaxRate(data: ANY): TaxRate {
    return TaxRateFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for TaxRate record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as TaxRate);
  }

  /**
   * Get taxRates from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed tax-rate data with pagination metadata
   */
  async getTaxRates(params: {
    limit?: number;
    offset?: number;
    search?: Partial<TaxRate>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<TaxRate> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("taxrate", mwParams);

      // Parse the response
      const taxRates = data.map(this.dataCenterJsonToTaxRate);

      return {
        data: taxRates,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching taxRates:", error);
      throw error;
    }
  }
}
