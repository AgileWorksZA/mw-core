import { MoneyWorksApiService } from "./moneyworks-api.service";
import { TaxRate, TaxRateFields } from "../moneyworks/types/tax-rate";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/tax-rate-schema";

/**
 * Service for interacting with MoneyWorks TaxRate table
 * Tax rates define different tax codes and rates
 */
export class TaxRateService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToTaxRate(data: any): TaxRate {
    return TaxRateFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for TaxRate record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as TaxRate);
  }

  /**
   * Get tax rates from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed tax rate data with pagination metadata
   */
  async getTaxRates(params: {
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
      const { data, pagination } = await this.api.export("taxrate", mwParams);

      // Parse the response
      const taxRates = data.map(this.dataCenterJsonToTaxRate);

      return {
        data: taxRates,
        pagination
      };
    } catch (error) {
      console.error("Error fetching tax rates:", error);
      throw error;
    }
  }

  /**
   * Get a single tax rate by code
   *
   * @param code The tax rate code to look up
   * @returns TaxRate details
   */
  async getTaxRateByCode(code: string) {
    try {
      const response = await this.api.export("taxrate", {
        search: `code=\`${code}\``,
        format: "xml-verbose"
      });

      if (!response.data[0]) {
        throw new Error(`Tax rate with code "${code}" not found`);
      }

      return this.dataCenterJsonToTaxRate(response.data[0]);
    } catch (error) {
      console.error(`Error fetching tax rate with code ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get a single tax rate by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns TaxRate details
   */
  async getTaxRateBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("taxrate", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Tax rate with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const taxRateData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToTaxRate(taxRateData);
    } catch (error) {
      console.error(`Error fetching tax rate with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}