import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { JobSheetService } from "../services/tables/job-sheet.service";
import { JobSheetMany, JobSheetOne } from "../types/eden/JobSheet";

// Initialize the job-sheet service with configuration
const config = loadMoneyWorksConfig();
const jobSheetService = new JobSheetService(config);

export const jobSheetRoutes = new Elysia({ prefix: "/api" })
  .get(
    "/job-sheets",
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await jobSheetService.getJobSheets({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as "asc" | "desc",
          search,
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
        search: t.Optional(t.String()),
      }),
      detail: {
        summary: "Get all job sheets",
        tags: ["MoneyWorks Data"],
      },
      response: JobSheetMany,
    },
  )
  .get(
    "/job-sheets/:sequenceNumber",
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await jobSheetService.getJobSheetBySequenceNumber(
          sequenceNumber,
        );
      } catch (error) {
        console.error(
          `Error in GET /job-sheets/${params.sequenceNumber}:`,
          error,
        );
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric(),
      }),
      detail: {
        summary: "Get job sheet by sequence number",
        tags: ["MoneyWorks Data"],
      },
      response: JobSheetOne,
    },
  )
  .get(
    "/job-sheets/for-job/:jobCode",
    async ({ params }) => {
      try {
        return await jobSheetService.getJobSheetsByJob(params.jobCode);
      } catch (error) {
        console.error(
          `Error in GET /job-sheets/for-job/${params.jobCode}:`,
          error,
        );
        throw error;
      }
    },
    {
      params: t.Object({
        jobCode: t.String(),
      }),
      detail: {
        summary: "Get job sheets for a specific job",
        tags: ["MoneyWorks Data"],
      },
      response: JobSheetMany,
    },
  );
