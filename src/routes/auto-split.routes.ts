import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { AutoSplitService } from "../services/tables/auto-split.service";
import { AutoSplitMany, AutoSplitOne } from "../types/eden/AutoSplit";
import { autoSplitZodKeys } from "../types/enums";
import { AutoSplitFields } from "../types/interface/auto-split";

// Initialize the auto-split service with configuration
const config = loadMoneyWorksConfig();
const autoSplitService = new AutoSplitService(config);

export const autoSplitRoutes = new Elysia({ prefix: "/api" })
  .get(
    "/auto-splits",
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await autoSplitService.getAutoSplits({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as "asc" | "desc",
          search,
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
        search: t.Optional(t.String()),
      }),
      detail: {
        summary: "Get all auto splits",
        tags: ["MoneyWorks Data"],
      },
      response: AutoSplitMany,
    },
  )
  .get(
    "/auto-splits/:by/:value",
    async ({ params }) => {
      try {
        const by = params.by;
        const value = params.value;

        return await autoSplitService.getAutoSplitBy(by, value);
      } catch (error) {
        console.error(
          `Error in GET /auto-splits/${params.by}/${params.value}:`,
          error,
        );
        throw error;
      }
    },
    {
      params: t.Object({
        by: t.String({ enum: autoSplitZodKeys }),
        value: t.String(),
      }),
      detail: {
        summary: `Get auto-splits by field: ${AutoSplitFields.join(", ")}`,
        tags: ["MoneyWorks Data"],
      },
      response: AutoSplitOne,
    },
  );
