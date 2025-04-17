import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AssetCatService } from "../../services/tables/asset-cat.service";
import { assetCatObject } from "../../types/constants.eden";
import { AssetCatMany } from "../../types/eden/tables/AssetCat";
import {
  type AssetCat,
  AssetCatFields,
} from "../../types/interface/tables/assetcat";

// Initialize the asset category service with configuration
const config = loadMoneyWorksConfig();
const assetCatService = new AssetCatService(config);

export const assetCatRoutes = new Elysia({ prefix: "/api" }).get(
  "/asset-categories",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;

    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await assetCatService.getAssetCats({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<AssetCat>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /asset-categories:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(assetCatObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Asset Categories",
      description: `Get all asset categories. Search by: ${AssetCatFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/asset-categories?format=SequenceNumber,Code,Description`,
    },
    tags: ["Assets"],
    response: { $schema: { $ref: "#/components/schemas/AssetCats" } },
  },
);
