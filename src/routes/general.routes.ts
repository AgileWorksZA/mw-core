import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { GeneralService } from "../services/tables/general.service";
import { generalObject } from "../types/constants.eden";
import { type General, GeneralFields } from "../types/interface/general";

// Initialize the general service with configuration
const config = loadMoneyWorksConfig();
const generalService = new GeneralService(config);

export const generalRoutes = new Elysia({ prefix: "/api" }).get(
  "/generals",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await generalService.getGenerals({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as General,
      });
    } catch (error) {
      console.error("Error in GET /generals:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(generalObject),
    }),
    detail: {
      summary: "Get generals.",
      description: `Get all saved generals. Search by: ${GeneralFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    tags: ["System"],
    // response: GeneralMany,
  },
);
