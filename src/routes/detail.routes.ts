import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { DetailService } from "../services/tables/detail.service";
import { detailObject } from "../types/constants.eden";
import { type Detail, DetailFields } from "../types/interface/detail";

// Initialize the detail service with configuration
const config = loadMoneyWorksConfig();
const detailService = new DetailService(config);

export const detailRoutes = new Elysia({ prefix: "/api" }).get(
  "/details",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await detailService.getDetails({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Detail,
      });
    } catch (error) {
      console.error("Error in GET /details:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(detailObject),
    }),
    detail: {
      summary: "Get details.",
      description: `Get all transaction details. Search by: ${DetailFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    tags: ["Financial"],
    // response: DetailMany,
  },
);
