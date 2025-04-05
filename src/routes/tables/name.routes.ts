import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { NameService } from "../../services/tables/name.service";
import { nameObject } from "../../types/constants.eden";
import { NameMany } from "../../types/eden/tables/Name";
import { type Name, NameFields } from "../../types/interface/tables/name";

// Initialize the name service with configuration
const config = loadMoneyWorksConfig();
const nameService = new NameService(config);

export const nameRoutes = new Elysia({ prefix: "/api" }).get(
  "/names",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await nameService.getNames({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Name>,
      });
    } catch (error) {
      console.error("Error in GET /names:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(nameObject),
    }),
    detail: {
      summary: "Names",
      description: `Get all names. Search by: ${NameFields.join(", ")}`,
    },
    tags: ["CRM"],
    response: NameMany,
  },
);
