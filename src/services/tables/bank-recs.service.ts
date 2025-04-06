import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type BankRecs,
  type BankRecsField,
  BankRecsFields,
} from "../../types/interface/tables/bankrecs";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/bankrecs-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks BankRecs table
 * Bank reconciliations represent bank statement reconciliations
 */
export class BankRecsService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToBankRecsUsingFields(
    fields: BankRecsField[],
    data: ANY,
  ): BankRecs {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for BankRecs record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as BankRecs);
  }

  dataCenterJsonToBankRecs(data: ANY): BankRecs {
    return BankRecsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for BankRecs record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as BankRecs);
  }

  /**
   * Get bankRecs from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed bank-recs data with pagination metadata
   */
  async getBankRecs(params: {
    limit?: number;
    offset?: number;
    search?: Partial<BankRecs>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[]; // Array of field names to include in the response
  }) {
    // Validate fields against BankRecsFields if provided
    if (params.fields && params.fields.length > 0) {
      for (const field of params.fields) {
        if (!BankRecsFields.includes(field as BankRecsField)) {
          throw new Error(
            `Invalid field '${field}' for BankRecs table. Valid fields are: ${BankRecsFields.join(", ")}`,
          );
        }
      }
    }

    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<BankRecs> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("bankrecs", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to bankRecs objects
      const bankRecs = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToBankRecsUsingFields(
              params.fields as BankRecsField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToBankRecs);

      return {
        data: bankRecs,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching bankRecs:", error);
      throw error;
    }
  }
}
