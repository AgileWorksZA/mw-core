import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { ListsService } from "../../services/tables/lists.service";
import { listObject } from "../../types/constants.eden";
import { ListMany } from "../../types/eden/tables/List";
import { type Lists, ListsFields } from "../../types/interface/tables/lists";

// Initialize the lists service with configuration
const config = loadMoneyWorksConfig();
const listsService = new ListsService(config);

export const listsRoutes = new Elysia({ prefix: "/api" }).get(
  "/lists",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await listsService.getLists({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Lists>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Lists",
      description: `Get all lists. Search by: ${ListsFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/lists?format=SequenceNumber,ListID,Item,Comment`,
    },
    tags: ["CRM"],
    response: ListMany,
  },
);
