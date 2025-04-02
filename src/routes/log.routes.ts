import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { LogService } from "../services/tables/log.service";
import { logObject } from "../types/constants.eden";
import { type Log, LogFields } from "../types/interface/log";

// Initialize the log service with configuration
const config = loadMoneyWorksConfig();
const logService = new LogService(config);

export const logRoutes = new Elysia({ prefix: "/api" }).get(
  "/logs",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await logService.getLogs({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Log,
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
    }),
    detail: {
      summary: "Get logs.",
      description: `Get all logs. Search by: ${LogFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    // response: LogMany,
  },
);
