import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AssetLogService } from "../../services/tables/asset-log.service";
import { assetLogObject } from "../../types/constants.eden";
import { AssetLogMany } from "../../types/eden/tables/AssetLog";
import {
  type AssetLog,
  AssetLogFields,
} from "../../types/interface/tables/assetlog";

// Initialize the asset log service with configuration
const config = loadMoneyWorksConfig();
const assetLogService = new AssetLogService(config);

export const assetLogRoutes = new Elysia({ prefix: "/api" }).get(
  "/asset-logs",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await assetLogService.getAssetLogs({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<AssetLog>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Asset Logs",
      description: `Get all asset logs. Search by: ${AssetLogFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/asset-logs?format=SequenceNumber,Date,Memo`,
    },
    tags: ["Assets"],
    response: { $schema: { $ref: "#/components/schemas/AssetLogs" } },
  },
);
