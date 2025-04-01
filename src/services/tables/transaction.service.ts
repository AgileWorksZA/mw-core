import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Transaction,
  TransactionFields,
} from "../../types/interface/transaction";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/transaction-schema";
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

  dataCenterJsonToTransaction(data: ANY): Transaction {
    return TransactionFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for record`);
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Transaction> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export(
        "transaction",
        mwParams,
      );

      // Parse the response
      const transactions = data.map(this.dataCenterJsonToTransaction);

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
