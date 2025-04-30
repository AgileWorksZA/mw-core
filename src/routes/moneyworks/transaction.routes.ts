import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { TransactionService } from "../../services/tables/transaction.service";
import { transactionObject } from "../../types/constants.eden";
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
    const {
      limit = 10,
      offset = 0,
      sort,
      order,
      search,
      format,
      skip_validation,
    } = query;

    // Parse the format parameter as an array of field names if provided
    const fields = format ? format.split(",") : undefined;

    try {
      return await transactionService.getTransactions({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Transaction>,
        fields,
        skip_validation,
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
      format: t.Optional(t.String()),
      skip_validation: t.Optional(t.Boolean()),
    }),
    detail: {
      summary: "Transactions",
      description: `Stores header information for all financial transactions (invoices, payments, receipts, journals, orders, quotes).

      Search by: ${TransactionFields.join(", ")}. 
      Optionally specify field names with "format" parameter to retrieve only specific fields.
      Example: /api/transactions?format=Type,Status,Gross
      
      Use skip_validation=true to bypass field validation when using custom fields.`,
    },
    tags: ["Transaction"],
    response: {
      $schema: {
        $ref: "#/components/schemas/Transactions",
      },
    },
  },
);
