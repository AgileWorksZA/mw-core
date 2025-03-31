import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { MemoService } from "../services/tables/memo.service";
import { MemoMany, MemoOne } from "../types/eden/Memo";

// Initialize the memo service with configuration
const config = loadMoneyWorksConfig();
const memoService = new MemoService(config);

export const memoRoutes = new Elysia({ prefix: "/api" })
  .get(
    "/memos",
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await memoService.getMemos({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as "asc" | "desc",
          search,
        });
      } catch (error) {
        console.error("Error in GET /memos:", error);
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
        summary: "Get all memos",
        tags: ["MoneyWorks Data"],
      },
      response: MemoMany,
    },
  )
  .get(
    "/memos/:sequenceNumber",
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await memoService.getMemoBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /memos/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric(),
      }),
      detail: {
        summary: "Get memo by sequence number",
        tags: ["MoneyWorks Data"],
      },
      response: MemoOne,
    },
  )
  .get(
    "/memos/for/:recordType/:recordId",
    async ({ params }) => {
      try {
        const { recordType, recordId } = params;
        return await memoService.getMemosByRecord(recordType, recordId);
      } catch (error) {
        console.error(
          `Error in GET /memos/for/${params.recordType}/${params.recordId}:`,
          error,
        );
        throw error;
      }
    },
    {
      params: t.Object({
        recordType: t.String(),
        recordId: t.String(),
      }),
      detail: {
        summary: "Get memos for a specific record",
        tags: ["MoneyWorks Data"],
      },
      response: MemoMany,
    },
  );
