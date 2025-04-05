import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { TransactionService } from "../../services/tables/transaction.service";
import { transactionObject } from "../../types/constants.eden";
import { TransactionMany } from "../../types/eden/tables/Transaction";
import {
  type Transaction,
  TransactionFields,
} from "../../types/interface/tables/transaction";

// Initialize the transaction service with configuration
const config = loadMoneyWorksConfig();
const transactionService = new TransactionService(config);

export const transactionRoutes = new Elysia({ prefix: "/api" }).get(
  "/transactions",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await transactionService.getTransactions({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Transaction>,
      });
    } catch (error) {
      console.error("Error in GET /transactions:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(transactionObject),
    }),
    detail: {
      summary: "Transactions",
      description: `Get all transactions. Search by: ${TransactionFields.join(", ")}`,
    },
    tags: ["Financial"],
    response: TransactionMany,
  },
);
