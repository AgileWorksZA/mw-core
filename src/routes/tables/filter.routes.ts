import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { FilterService } from "../../services/tables/filter.service";
import { filterObject } from "../../types/constants.eden";
import { FilterMany } from "../../types/eden/tables/Filter";
import { type Filter, FilterFields } from "../../types/interface/tables/filter";

// Initialize the filter service with configuration
const config = loadMoneyWorksConfig();
const filterService = new FilterService(config);

export const filterRoutes = new Elysia({ prefix: "/api" }).get(
  "/filters",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await filterService.getFilters({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Filter>,
      });
    } catch (error) {
      console.error("Error in GET /filters:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(filterObject),
    }),
    detail: {
      summary: "Filters",
      description: `Get all saved filters. Search by: ${FilterFields.join(", ")}. Note: This endpoint is deprecated and will be removed in a future release.`,
    },
    tags: ["System"],
    response: FilterMany,
  },
);
