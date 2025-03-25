import { MoneyWorksApiService } from "./moneyworks-api.service";
import { Transaction, TransactionFields } from "../moneyworks/types/transaction";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/transaction-schema";

/**
 * Service for interacting with MoneyWorks Transaction table
 * Transactions are accounting entries like invoices, receipts, etc.
 */
export class TransactionService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToTransaction(data: any): Transaction {
    return TransactionFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Transaction record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
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
      const { data, pagination } = await this.api.export("transaction", mwParams);

      // Parse the response
      const transactions = data.map(this.dataCenterJsonToTransaction);

      return {
        data: transactions,
        pagination
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  /**
   * Get a single transaction by ID (sequence number)
   *
   * @param sequenceNumber The transaction sequence number to look up
   * @returns Transaction details
   */
  async getTransactionBySequenceNumber(sequenceNumber: number) {
    try {
      const response = await this.api.export("transaction", {
        search: `sequencenumber=${sequenceNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Transaction with sequence number "${sequenceNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const transactionData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToTransaction(transactionData);
    } catch (error) {
      console.error(`Error fetching transaction with sequence number ${sequenceNumber}:`, error);
      throw error;
    }
  }
}