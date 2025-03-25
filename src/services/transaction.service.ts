import { MoneyWorksApiService } from "./moneyworks-api.service";
import { Transaction } from "../moneyworks/types/transaction";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";

/**
 * Service for interacting with MoneyWorks Transaction table
 * Transactions are invoices, payments, credit notes, etc.
 */
export class TransactionService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
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
    fromDate?: Date;
    toDate?: Date;
    type?: string;
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams = {
        limit: params.limit,
        start: params.offset,
        search: this.buildSearchQuery(params),
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose"
      };

      // Call MoneyWorks API
      const response = await this.api.export("transaction", mwParams);


      if (!response?.table?.transaction) {
        return { data: [], pagination: this.createPagination(0, params) };
      }

      // Parse the response
      const transactions = this.parseTransactionResponse(response.table);

      // Create pagination metadata
      const total = Number.parseInt(response.table._found, 10)

      const pagination = this.createPagination(total, params);

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
   * Get a single transaction by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Transaction details
   */
  async getTransactionBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("transaction", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.table?.transaction) {
        throw new Error(`Transaction with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const transactionData = Array.isArray(response.table.n) ? response.table.n[0] : response.table.n;
      return this.parseTransactionRecord(transactionData);
    } catch (error) {
      console.error(`Error fetching transaction with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }

  /**
   * Get a single transaction by reference number
   *
   * @param reference The our reference to look up
   * @returns Transaction details
   */
  async getTransactionByReference(reference: string) {
    try {
      const response = await this.api.export("transaction", {
        search: `ourref=\`${reference}\``,
        format: "xml-verbose"
      });

      if (!response?.table?.transaction) {
        throw new Error(`Transaction with reference "${reference}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const transactionData = Array.isArray(response.table.n) ? response.table.n[0] : response.table.n;
      return this.parseTransactionRecord(transactionData);
    } catch (error) {
      console.error(`Error fetching transaction with reference ${reference}:`, error);
      throw error;
    }
  }

  /**
   * Build a search query string from the provided parameters
   */
  private buildSearchQuery(params: {
    search?: string;
    fromDate?: Date;
    toDate?: Date;
    type?: string;
  }): string {
    const conditions: string[] = [];

    // Add custom search query if provided
    if (params.search) {
      conditions.push(params.search);
    }

    // Add date range if provided
    if (params.fromDate) {
      const fromDate = this.formatDateForMoneyWorks(params.fromDate);
      conditions.push(`transdate>=${fromDate}`);
    }

    if (params.toDate) {
      const toDate = this.formatDateForMoneyWorks(params.toDate);
      conditions.push(`transdate<=${toDate}`);
    }

    // Add transaction type if provided
    if (params.type) {
      conditions.push(`type=\`${params.type}\``);
    }

    return conditions.join(" and ");
  }

  /**
   * Format a date for MoneyWorks search queries (YYYYMMDD)
   */
  private formatDateForMoneyWorks(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  /**
   * Parse XML transaction response into structured data
   */
  private parseTransactionResponse(tableData: any): Partial<Transaction>[] {
    // Handle case when only one transaction is returned
    if (!Array.isArray(tableData.transaction)) {
      return [this.parseTransactionRecord(tableData.transaction)];
    }

    // Handle multiple transactions
    return tableData.transaction.map((record: any) => this.parseTransactionRecord(record));
  }

  /**
   * Parse a single transaction record from XML response
   */
  private parseTransactionRecord(record: any): Partial<Transaction> {
    const result: Partial<Transaction> = {};

    // Loop through all properties in the record
    for (const [key, value] of Object.entries(record)) {
      // Skip attributes and nested objects
      if (key === "$" || key === "_" || (value !== null && typeof value === "object" && !("text" in value))) continue;

      // Get the text value if its available
      const textValue = value && typeof value === "object" && "text" in value ? value.text : value;

      // Skip empty values
      if (textValue === undefined || textValue === null) continue;

      // Handle dates
      if ((key.toLowerCase().includes("date") || key === "TimePosted") && typeof textValue === "string") {
        result[key as keyof Transaction] = this.parseMoneyWorksDate(textValue) as any;
        continue;
      }

      // Handle booleans
      if (key === "Hold" || key === "Recurring") {
        result[key as keyof Transaction] = (textValue === "1" || textValue === 1 ||
                                           textValue === true || textValue === "true") as any;
        continue;
      }

      // Handle numbers
      if (!isNaN(Number(textValue)) && typeof textValue === "string" &&
          !["OurRef", "TheirRef", "NameCode", "Flag", "Analysis", "Contra", "Status",
            "Salesperson", "Currency", "EnteredBy", "PostedBy", "ApprovedBy1", "ApprovedBy2"].includes(key)) {
        result[key as keyof Transaction] = Number(textValue) as any;
        continue;
      }

      // For everything else, just copy the value
      result[key as keyof Transaction] = textValue as any;
    }

    return result;
  }

  /**
   * Parse MoneyWorks date format (YYYYMMDD) to JavaScript Date
   */
  private parseMoneyWorksDate(dateStr: string): Date | null {
    if (!dateStr || dateStr === "0") return null;

    // Handle YYYYMMDD format
    if (/^\d{8}$/.test(dateStr)) {
      const year = parseInt(dateStr.substring(0, 4), 10);
      const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JS months are 0-based
      const day = parseInt(dateStr.substring(6, 8), 10);
      return new Date(year, month, day);
    }

    // Handle YYYYMMDDhhmmss format
    if (/^\d{14}$/.test(dateStr)) {
      const year = parseInt(dateStr.substring(0, 4), 10);
      const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JS months are 0-based
      const day = parseInt(dateStr.substring(6, 8), 10);
      const hour = parseInt(dateStr.substring(8, 10), 10);
      const minute = parseInt(dateStr.substring(10, 12), 10);
      const second = parseInt(dateStr.substring(12, 14), 10);
      return new Date(year, month, day, hour, minute, second);
    }

    // Try standard date parsing
    return new Date(dateStr);
  }

  /**
   * Create pagination metadata
   */
  private createPagination(total: number, params: { limit?: number, offset?: number }) {
    const limit = params.limit || 10;
    const offset = params.offset || 0;

    return {
      total,
      limit,
      offset,
      next: offset + limit < total ? offset + limit : null,
      prev: offset > 0 ? Math.max(0, offset - limit) : null
    };
  }
}
