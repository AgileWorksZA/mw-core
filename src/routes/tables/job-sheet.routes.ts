import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { JobSheetService } from "../../services/tables/job-sheet.service";
import { jobSheetObject } from "../../types/constants.eden";
import { JobSheetMany } from "../../types/eden/tables/JobSheet";
import {
  type JobSheet,
  JobSheetFields,
} from "../../types/interface/tables/job-sheet";

// Initialize the job-sheet service with configuration
const config = loadMoneyWorksConfig();
const jobSheetService = new JobSheetService(config);

export const jobSheetRoutes = new Elysia({ prefix: "/api" }).get(
  "/job-sheets",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await jobSheetService.getJobSheets({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<JobSheet>,
      });
    } catch (error) {
      console.error("Error in GET /job-sheets:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(jobSheetObject),
    }),
    detail: {
      summary: "Job Sheets",
      description: `Get all job-sheets. Search by: ${JobSheetFields.join(", ")}`,
    },
    tags: ["Jobs"],
    response: JobSheetMany,
  },
);
