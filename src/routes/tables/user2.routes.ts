import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { User2Service } from "../../services/tables/user2.service";
import { user2Object } from "../../types/constants.eden";
import { User2Many } from "../../types/eden/tables/User2";
import { type User2, User2Fields } from "../../types/interface/tables/user2";

// Initialize the user2 service with configuration
const config = loadMoneyWorksConfig();
const user2Service = new User2Service(config);

export const user2Routes = new Elysia({ prefix: "/api" }).get(
  "/user2s",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await user2Service.getUser2s({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<User2>,
      });
    } catch (error) {
      console.error("Error in GET /user2s:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(user2Object),
    }),
    detail: {
      summary: "User2s",
      description: `Get all user2s. Search by: ${User2Fields.join(", ")}`,
    },
    tags: ["System"],
    response: User2Many,
  },
);
