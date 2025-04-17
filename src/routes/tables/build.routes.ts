import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { BuildService } from "../../services/tables/build.service";
import { buildObject } from "../../types/constants.eden";
import { BuildMany } from "../../types/eden/tables/Build";
import { type Build, BuildFields } from "../../types/interface/tables/build";

// Initialize the build service with configuration
const config = loadMoneyWorksConfig();
const buildService = new BuildService(config);

export const buildRoutes = new Elysia({ prefix: "/api" }).get(
  "/builds",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await buildService.getBuilds({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Build>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /builds:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(buildObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Builds",
      description: `Get all builds. Search by: ${BuildFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/builds?format=SequenceNumber,ProductSeq,PartCode`,
    },
    tags: ["System"],
    response: { $schema: { $ref: "#/components/schemas/Builds" } },
  },
);
