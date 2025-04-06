import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AssetService } from "../../services/tables/asset.service";
import { assetObject } from "../../types/constants.eden";
import { AssetMany } from "../../types/eden/tables/Asset";
import {
  type Asset,
  AssetFields,
} from "../../types/interface/tables/asset";

// Initialize the asset service with configuration
const config = loadMoneyWorksConfig();
const assetService = new AssetService(config);

export const assetRoutes = new Elysia({ prefix: "/api" }).get(
  "/assets",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await assetService.getAssets({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Asset>,
      });
    } catch (error) {
      console.error("Error in GET /assets:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(assetObject),
    }),
    detail: {
      summary: "Assets",
      description: `Get all assets. Search by: ${AssetFields.join(", ")}`,
    },
    tags: ["Assets"],
    response: AssetMany,
  },
);
