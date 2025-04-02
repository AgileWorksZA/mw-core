import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { JobService } from "../services/tables/job.service";
import { jobObject } from "../types/constants.eden";
import { type Job, JobFields } from "../types/interface/job";

// Initialize the job service with configuration
const config = loadMoneyWorksConfig();
const jobService = new JobService(config);

export const jobRoutes = new Elysia({ prefix: "/api" }).get(
  "/jobs",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await jobService.getJobs({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Job,
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
    }),
    detail: {
      summary: "Get jobs.",
      description: `Get all jobs. Search by: ${JobFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    // response: JobMany,
  },
);
