import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { ListsService } from "../services/tables/lists.service";
import { listObject } from "../types/constants.eden";
import { type Lists, ListsFields } from "../types/interface/lists";

// Initialize the lists service with configuration
const config = loadMoneyWorksConfig();
const listsService = new ListsService(config);

export const listsRoutes = new Elysia({ prefix: "/api" }).get(
  "/lists",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await listsService.getLists({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Lists,
      });
    } catch (error) {
      console.error("Error in GET /lists:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(listObject),
    }),
    detail: {
      summary: "Get lists.",
      description: `Get all lists. Search by: ${ListsFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    tags: ["CRM"],
    // response: ListMany,
  },
);
