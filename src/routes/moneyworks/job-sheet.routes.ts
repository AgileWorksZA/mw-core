import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { JobSheetService } from "../../services/tables/job-sheet.service";
import { jobSheetObject } from "../../types/constants.eden";
import {
  type JobSheet,
  JobSheetFields,
} from "../../types/interface/tables/jobsheet";

// Initialize the job-sheet service with configuration
const config = loadMoneyWorksConfig();
const jobSheetService = new JobSheetService(config);

export const jobSheetRoutes = new Elysia({ prefix: "/api" }).get(
  "/job-sheets",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await jobSheetService.getJobSheets({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<JobSheet>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Job Sheets",
      description: `Records time, materials, and disbursements allocated to specific jobs, used for job costing and billing.

      Search by: ${JobSheetFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/job-sheets?format=SequenceNumber,Job,Resource,Qty`,
    },
    tags: ["Jobs"],
    response: { $schema: { $ref: "#/components/schemas/JobSheets" } },
  },
);
