import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Payments,
  type PaymentsField,
  PaymentsFields,
} from "../../types/interface/tables/payments";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/payments-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Payments table
 * Payments entries in MoneyWorks
 */
export class PaymentsService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToPaymentsUsingFields(
    fields: PaymentsField[],
    data: ANY,
  ): Payments {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Payments record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Payments);
  }

  dataCenterJsonToPayments(data: ANY): Payments {
    return PaymentsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Payments record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Payments);
  }

  /**
   * Get payments from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed payments data with pagination metadata
   */
  async getPayments(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Payments>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    // Validate fields against PaymentsFields if provided
    if (params.fields && params.fields.length > 0) {
      for (const field of params.fields) {
        if (!PaymentsFields.includes(field as PaymentsField)) {
          throw new Error(
            `Invalid field '${field}' for Payments table. Valid fields are: ${PaymentsFields.join(", ")}`,
          );
        }
      }
    }

    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Payments> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("payments", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to payments objects
      const payments = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToPaymentsUsingFields(
              params.fields as PaymentsField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToPayments);

      return {
        data: payments,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }
}
