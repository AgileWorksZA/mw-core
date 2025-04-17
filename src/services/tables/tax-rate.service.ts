import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type TaxRate,
  type TaxRateField,
  TaxRateFields,
} from "../../types/interface/tables/taxrate";
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

  dataCenterJsonToTaxRateUsingFields(
    fields: TaxRateField[],
    data: ANY,
  ): TaxRate {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for TaxRate record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as TaxRate);
  }

  dataCenterJsonToTaxRate(data: ANY): TaxRate {
    return TaxRateFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for TaxRate record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    // Validate fields against TaxRateFields if provided
    if (params.fields && params.fields.length > 0) {
      for (const field of params.fields) {
        if (!TaxRateFields.includes(field as TaxRateField)) {
          throw new Error(
            `Invalid field '${field}' for TaxRate table. Valid fields are: ${TaxRateFields.join(", ")}`,
          );
        }
      }
    }

    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<TaxRate> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("taxrate", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to taxRate objects
      const taxRates = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToTaxRateUsingFields(
              params.fields as TaxRateField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToTaxRate);

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
