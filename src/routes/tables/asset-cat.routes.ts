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
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await assetCatService.getAssetCats({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<AssetCat>,
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
    }),
    detail: {
      summary: "Asset Categories",
      description: `Get all asset categories. Search by: ${AssetCatFields.join(", ")}`,
    },
    tags: ["Assets"],
    response: AssetCatMany,
  },
);
