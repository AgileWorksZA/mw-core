import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Transaction,
  type TransactionField,
  TransactionFields,
} from "../../types/interface/tables/transaction";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/transaction-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Transaction table
 * Transactions are accounting entries like invoices, receipts, etc.
 */
export class TransactionService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToTransactionUsingFields(
    fields: TransactionField[],
    data: ANY,
  ): Transaction {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Transaction record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Transaction);
  }

  dataCenterJsonToTransaction(data: ANY): Transaction {
    return TransactionFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Transaction record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Transaction);
  }

  /**
   * Get transactions from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed transaction data with pagination metadata
   */
  async getTransactions(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Transaction>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[]; // Array of field names to include in the response
    skip_validation?: boolean; // Skip validation of fields
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Transaction> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export(
        "transaction",
        mwParams,
      );

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to transaction objects
      const transactions = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToTransactionUsingFields(
              params.fields as TransactionField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToTransaction);

      return {
        data: transactions,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }
}
