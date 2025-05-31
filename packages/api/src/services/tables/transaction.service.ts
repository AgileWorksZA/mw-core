import { type Transaction, TransactionFields } from "../../types/interface/tables/transaction";
import schema from "../../types/optimized/table/transaction-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Transaction table
 * Transactions are accounting entries like invoices, receipts, etc.
 */
export class TransactionService extends TableService<Transaction> {
  constructor() {
    super("transaction", schema, TransactionFields);
  }
}
