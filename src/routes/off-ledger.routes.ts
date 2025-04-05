import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { OffLedgerService } from "../services/tables/off-ledger.service";
import { offLedgerObject } from "../types/constants.eden";
import { OffLedgerMany } from "../types/eden/OffLedger";
import { type OffLedger, OffLedgerFields } from "../types/interface/off-ledger";

// Initialize the off-ledger service with configuration
const config = loadMoneyWorksConfig();
const offLedgerService = new OffLedgerService(config);

export const offLedgerRoutes = new Elysia({ prefix: "/api" }).get(
  "/off-ledgers",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await offLedgerService.getOffLedgerItems({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as OffLedger,
      });
    } catch (error) {
      console.error("Error in GET /off-ledgers:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(offLedgerObject),
    }),
    detail: {
      summary: "Get off-ledgers.",
      description: `Get all off-ledgers. Search by: ${OffLedgerFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    tags: ["Financial"],
    // response: OffLedgerMany,
  },
);
