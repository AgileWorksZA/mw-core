import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Payments, PaymentsFields } from "../../types/interface/payments";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/payments-schema";
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

  dataCenterJsonToPayments(data: ANY): Payments {
    return PaymentsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Payments record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Payments);
  }

  /**
   * Get paymentss from MoneyWorks with pagination and filtering
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
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Payments> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("payments", mwParams);

      // Parse the response
      const payments = data.map(this.dataCenterJsonToPayments);

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
