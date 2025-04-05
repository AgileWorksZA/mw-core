import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { AutoSplitService } from "../services/tables/auto-split.service";
import { autoSplitObject } from "../types/constants.eden";

// Initialize the auto-split service with configuration
const config = loadMoneyWorksConfig();
const autoSplitService = new AutoSplitService(config);

export const autoSplitRoutes = new Elysia({ prefix: "/api" }).get(
  "/auto-splits",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await autoSplitService.getAutoSplits({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search,
      });
    } catch (error) {
      console.error("Error in GET /auto-splits:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(autoSplitObject),
    }),
    detail: {
      summary: "Get all auto splits",
      tags: ["MoneyWorks Data"],
    },
    tags: ["Financial"],
    // response: AutoSplitMany,
  },
);
