import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { MemoService } from "../services/tables/memo.service";
import { memoObject } from "../types/constants.eden";
import { MemoMany } from "../types/eden/Memo";
import { type Memo, MemoFields } from "../types/interface/memo";

// Initialize the memo service with configuration
const config = loadMoneyWorksConfig();
const memoService = new MemoService(config);

export const memoRoutes = new Elysia({ prefix: "/api" }).get(
  "/memos",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await memoService.getMemos({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Memo,
      });
    } catch (error) {
      console.error("Error in GET /memos:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(memoObject),
    }),
    detail: {
      summary: "Get memos.",
      description: `Get all memos. Search by: ${MemoFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    response: MemoMany,
  },
);
