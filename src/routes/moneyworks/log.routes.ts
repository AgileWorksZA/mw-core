import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { LogService } from "../../services/tables/log.service";
import { logObject } from "../../types/constants.eden";
import { type Log, LogFields } from "../../types/interface/tables/log";

// Initialize the log service with configuration
const config = loadMoneyWorksConfig();
const logService = new LogService(config);

export const logRoutes = new Elysia({ prefix: "/api" }).get(
  "/logs",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    const fields = format ? format.split(",") : undefined;

    try {
      return await logService.getLogs({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Log>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /logs:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(logObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Logs",
      description: `Records an audit trail of significant system events, user actions, and structural changes within the MoneyWorks document.

      Search by: ${LogFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/logs?format=SequenceNumber,Description,Who`,
    },
    tags: ["System"],
    response: { $schema: { $ref: "#/components/schemas/Logs" } },
  },
);
