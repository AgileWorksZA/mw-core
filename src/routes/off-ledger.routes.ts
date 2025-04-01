import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { OffLedgerService } from "../services/tables/off-ledger.service";
import { OffLedgerMany, OffLedgerOne } from "../types/eden/OffLedger";

// Initialize the off-ledger service with configuration
const config = loadMoneyWorksConfig();
const offLedgerService = new OffLedgerService(config);

export const offLedgerRoutes = new Elysia({ prefix: "/api" }).get(
  "/off-ledger",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await offLedgerService.getOffLedgerItems({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search,
      });
    } catch (error) {
      console.error("Error in GET /off-ledger:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(t.String()),
    }),
    detail: {
      summary: "Get all off-ledger entries",
      tags: ["MoneyWorks Data"],
    },
    response: OffLedgerMany,
  },
);
