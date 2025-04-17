import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { GeneralService } from "../../services/tables/general.service";
import { generalObject } from "../../types/constants.eden";
import { GeneralMany } from "../../types/eden/tables/General";
import {
  type General,
  GeneralFields,
} from "../../types/interface/tables/general";

// Initialize the general service with configuration
const config = loadMoneyWorksConfig();
const generalService = new GeneralService(config);

export const generalRoutes = new Elysia({ prefix: "/api" }).get(
  "/generals",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await generalService.getGenerals({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<General>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "General",
      description: `Stores lookup definitions such as Account Categories, Department Classifications, and Department Groups, used for organizing accounts and departments.

      Search by: ${GeneralFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/generals?format=SequenceNumber,Code,Description
      Note: This endpoint is deprecated and will be removed in a future release.`,
    },
    tags: ["System"],
    response: { $schema: { $ref: "#/components/schemas/Generals" } },
  },
);
