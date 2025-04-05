import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { StickiesService } from "../services/tables/stickies.service";
import { stickiesObject } from "../types/constants.eden";
import { StickiesMany } from "../types/eden/Stickies";
import { type Stickies, StickiesFields } from "../types/interface/stickies";

// Initialize the stickies service with configuration
const config = loadMoneyWorksConfig();
const stickiesService = new StickiesService(config);

export const stickiesRoutes = new Elysia({ prefix: "/api" }).get(
  "/stickies",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await stickiesService.getStickies({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Stickies,
      });
    } catch (error) {
      console.error("Error in GET /stickies:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(stickiesObject),
    }),
    detail: {
      summary: "Get stickies.",
      description: `Get all stickies. Search by: ${StickiesFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    // response: StickiesMany,
  },
);
