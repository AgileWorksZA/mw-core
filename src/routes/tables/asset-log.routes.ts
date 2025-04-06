import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AssetLogService } from "../../services/tables/asset-log.service";
import { assetLogObject } from "../../types/constants.eden";
import { AssetLogMany } from "../../types/eden/tables/AssetLog";
import {
  type AssetLog,
  AssetLogFields,
} from "../../types/interface/tables/asset-log";

// Initialize the asset log service with configuration
const config = loadMoneyWorksConfig();
const assetLogService = new AssetLogService(config);

export const assetLogRoutes = new Elysia({ prefix: "/api" }).get(
  "/asset-logs",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await assetLogService.getAssetLogs({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<AssetLog>,
      });
    } catch (error) {
      console.error("Error in GET /asset-logs:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(assetLogObject),
    }),
    detail: {
      summary: "Asset Logs",
      description: `Get all asset logs. Search by: ${AssetLogFields.join(", ")}`,
    },
    tags: ["Assets"],
    response: AssetLogMany,
  },
);
