import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { LinkService } from "../../services/tables/link.service";
import { linkObject } from "../../types/constants.eden";
import { LinkMany } from "../../types/eden/tables/Link";
import { type Link, LinkFields } from "../../types/interface/tables/link";

// Initialize the link service with configuration
const config = loadMoneyWorksConfig();
const linkService = new LinkService(config);

export const linkRoutes = new Elysia({ prefix: "/api" }).get(
  "/links",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await linkService.getLinks({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Link>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /links:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(linkObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Links",
      description: `Get all links. Search by: ${LinkFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/links?format=SequenceNumber,Dept,Group`,
    },
    tags: ["CRM"],
    response: LinkMany,
  },
);
