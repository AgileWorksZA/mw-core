import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { LoginService } from "../services/tables/login.service";
import { loginObject } from "../types/constants.eden";
import { LoginMany } from "../types/eden/Login";
import { type Login, LoginFields } from "../types/interface/login";

// Initialize the login service with configuration
const config = loadMoneyWorksConfig();
const loginService = new LoginService(config);

export const loginRoutes = new Elysia({ prefix: "/api" }).get(
  "/logins",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await loginService.getLogins({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Login,
      });
    } catch (error) {
      console.error("Error in GET /logins:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(loginObject),
    }),
    detail: {
      summary: "Get logins.",
      description: `Get all logins. Search by: ${LoginFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    response: LoginMany,
  },
);
