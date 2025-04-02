import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { UserService } from "../services/tables/user.service";
import { userObject } from "../types/constants.eden";
import { UserMany } from "../types/eden/User";
import { type User, UserFields } from "../types/interface/user";

// Initialize the user service with configuration
const config = loadMoneyWorksConfig();
const userService = new UserService(config);

export const userRoutes = new Elysia({ prefix: "/api" }).get(
  "/users",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await userService.getUsers({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as User,
      });
    } catch (error) {
      console.error("Error in GET /users:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(userObject),
    }),
    detail: {
      summary: "Get users.",
      description: `Get all users. Search by: ${UserFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    response: UserMany,
  },
);
