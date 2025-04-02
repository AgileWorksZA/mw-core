import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { LedgerService } from "../services/tables/ledger.service";
import { ledgerObject } from "../types/constants.eden";
import { type Ledger, LedgerFields } from "../types/interface/ledger";

// Initialize the ledger service with configuration
const config = loadMoneyWorksConfig();
const ledgerService = new LedgerService(config);

export const ledgerRoutes = new Elysia({ prefix: "/api" }).get(
  "/ledgers",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await ledgerService.getLedgers({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Ledger,
      });
    } catch (error) {
      console.error("Error in GET /ledgers:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(ledgerObject),
    }),
    detail: {
      summary: "Get ledgers.",
      description: `Get all ledgers. Search by: ${LedgerFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    // response: LedgerMany,
  },
);
