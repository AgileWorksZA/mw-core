import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AutoSplitService } from "../../services/tables/auto-split.service";
import { autoSplitObject } from "../../types/constants.eden";
import { AutoSplitMany } from "../../types/eden/tables/AutoSplit";
import {
  type AutoSplit,
  AutoSplitFields,
} from "../../types/interface/tables/autosplit";

// Initialize the auto-split service with configuration
const config = loadMoneyWorksConfig();
const autoSplitService = new AutoSplitService(config);

export const autoSplitRoutes = new Elysia({ prefix: "/api" }).get(
  "/auto-splits",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await autoSplitService.getAutoSplits({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<AutoSplit>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Auto Splits",
      description: `Get all auto splits. Search by: ${AutoSplitFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/auto-splits?format=SequenceNumber,MatchName,SplitAcct1`,
    },
    tags: ["Transaction"],
    response: { $schema: { $ref: "#/components/schemas/AutoSplits" } },
  },
);
