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
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await filterService.getFilters({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Filter>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Filters",
      description: `Get all saved filters. Search by: ${FilterFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/filters?format=SequenceNumber,Name,FilterFunction
      Note: This endpoint is deprecated and will be removed in a future release.`,
    },
    tags: ["System"],
    response: FilterMany,
  },
);
