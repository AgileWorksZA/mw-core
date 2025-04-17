import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { JobService } from "../../services/tables/job.service";
import { jobObject } from "../../types/constants.eden";
import { JobMany } from "../../types/eden/tables/Job";
import { type Job, JobFields } from "../../types/interface/tables/job";

// Initialize the job service with configuration
const config = loadMoneyWorksConfig();
const jobService = new JobService(config);

export const jobRoutes = new Elysia({ prefix: "/api" }).get(
  "/jobs",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await jobService.getJobs({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Job>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /jobs:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(jobObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Jobs",
      description: `Stores information about specific jobs or projects undertaken by the business, including client, status, and budget details.

      Search by: ${JobFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/jobs?format=SequenceNumber,Code,Description,Status`,
    },
    tags: ["Jobs"],
    response: { $schema: { $ref: "#/components/schemas/Jobs" } },
  },
);
