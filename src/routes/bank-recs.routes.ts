import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { BankRecsService } from "../services/tables/bank-recs.service";
import { bankRecsObject } from "../types/constants.eden";
import { BankRecsMany } from "../types/eden/BankRecs";

// Initialize the bank-recs service with configuration
const config = loadMoneyWorksConfig();
const bankRecsService = new BankRecsService(config);

export const bankRecsRoutes = new Elysia({ prefix: "/api" }).get(
  "/bank-recs",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await bankRecsService.getBankRecs({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search,
      });
    } catch (error) {
      console.error("Error in GET /bank-recs:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(bankRecsObject),
    }),
    detail: {
      summary: "Get all bank reconciliation entries",
      tags: ["MoneyWorks Data"],
    },
    response: BankRecsMany,
  },
);
