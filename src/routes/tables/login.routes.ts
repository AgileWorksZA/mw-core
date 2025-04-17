import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { LoginService } from "../../services/tables/login.service";
import { loginObject } from "../../types/constants.eden";
import { LoginMany } from "../../types/eden/tables/Login";
import { type Login, LoginFields } from "../../types/interface/tables/login";

// Initialize the login service with configuration
const config = loadMoneyWorksConfig();
const loginService = new LoginService(config);

export const loginRoutes = new Elysia({ prefix: "/api" }).get(
  "/logins",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    const fields = format ? format.split(",") : undefined;

    try {
      return await loginService.getLogins({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Login>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Logins",
      description: `Get all logins. Search by: ${LoginFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/logins?format=SequenceNumber,Name,Email`,
    },
    tags: ["System"],
    response: { $schema: { $ref: "#/components/schemas/Logins" } },
  },
);
