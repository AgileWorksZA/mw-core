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
    const { limit = 10, offset = 0, sort, order, search, format, skip_validation } = query;

    // Parse the format parameter as an array of field names if provided
    const fields = format ? format.split(",") : undefined;

    try {
      return await user2Service.getUser2s({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<User2>,
        fields,
        skip_validation: skip_validation === "true" || skip_validation === true,
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
      format: t.Optional(t.String()),
      skip_validation: t.Optional(t.Boolean()),
    }),
    detail: {
      summary: "User2s",
      description: `Get all user2s. Search by: ${User2Fields.join(", ")}.
      Optionally specify field names with "format" parameter to retrieve only specific fields.
      Example: /api/user2s?format=Key,Text
      
      Use skip_validation=true to bypass field validation when using custom fields.`,
    },
    tags: ["System"],
    response: User2Many,
  },
);
