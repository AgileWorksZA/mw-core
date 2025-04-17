import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { DetailService } from "../../services/tables/detail.service";
import { detailObject } from "../../types/constants.eden";
import { DetailMany } from "../../types/eden/tables/Detail";
import { type Detail, DetailFields } from "../../types/interface/tables/detail";

// Initialize the detail service with configuration
const config = loadMoneyWorksConfig();
const detailService = new DetailService(config);

export const detailRoutes = new Elysia({ prefix: "/api" }).get(
  "/details",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await detailService.getDetails({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Detail>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Details",
      description: `Get all transaction details. Search by: ${DetailFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/details?format=SequenceNumber,Description,Credit,Debit,Account
      Note: This endpoint is deprecated and will be removed in a future release.`,
    },
    tags: ["Transaction"],
    response: { $schema: { $ref: "#/components/schemas/Details" } },
  },
);
