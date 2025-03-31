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
 * Payments represent payment transactions
 */
export class PaymentsService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToPayments(data: any): Payments {
    return PaymentsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Payments record`,
        );
      }
      (acc as any)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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

  /**
   * Get payments for a specific name
   *
   * @param nameCode The name code
   * @returns Payments for the name
   */
  async getPaymentsByName(nameCode: string) {
    try {
      const response = await this.api.export("payments", {
        search: `name=\`${nameCode}\``,
        format: "xml-verbose",
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const payments = Array.isArray(response.data)
        ? response.data.map(this.dataCenterJsonToPayments)
        : [this.dataCenterJsonToPayments(response.data)];

      return {
        data: payments,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error(`Error fetching payments for name ${nameCode}:`, error);
      throw error;
    }
  }

  /**
   * Get a single payment by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Payments details
   */
  async getPaymentBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("payments", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose",
      });

      if (!response?.data) {
        throw new Error(
          `Payment with sequence number "${seqNumber}" not found`,
        );
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const paymentData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return this.dataCenterJsonToPayments(paymentData);
    } catch (error) {
      console.error(
        `Error fetching payment with sequence number ${seqNumber}:`,
        error,
      );
      throw error;
    }
  }
}
