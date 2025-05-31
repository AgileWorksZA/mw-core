import { TransactionService } from "../../services/tables/transaction.service";
import { transactionObject } from "../../types/constants.eden";
import type { Transaction } from "../../types/interface/tables/transaction";
import { moneyworksRoute } from "./base/moneyworks.route";

export const transactionRoutes = moneyworksRoute<Transaction, "Transaction", typeof transactionObject>(
  "Transaction",
  transactionObject,
  new TransactionService(),
  {
    summary: "Transactions",
    description: "Stores header information for all financial transactions (invoices, payments, receipts, journals, orders, quotes).",
    tags: ["Transaction"],
  },
);
