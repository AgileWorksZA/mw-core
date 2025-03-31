import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { LedgerService } from "../services/tables/ledger.service";
import { LedgerMany, LedgerOne } from "../types/eden/Ledger";

// Initialize the ledger service with configuration
const config = loadMoneyWorksConfig();
const ledgerService = new LedgerService(config);

export const ledgerRoutes = new Elysia({ prefix: "/api" })
  .get(
    "/ledger",
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await ledgerService.getLedgerEntries({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as "asc" | "desc",
          search,
        });
      } catch (error) {
        console.error("Error in GET /ledger:", error);
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
        summary: "Get all ledger entries",
        tags: ["MoneyWorks Data"],
      },
      response: LedgerMany,
    },
  )
  .get(
    "/ledger/:sequenceNumber",
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await ledgerService.getLedgerEntryBySequenceNumber(
          sequenceNumber,
        );
      } catch (error) {
        console.error(`Error in GET /ledger/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric(),
      }),
      detail: {
        summary: "Get ledger entry by sequence number",
        tags: ["MoneyWorks Data"],
      },
      response: LedgerOne,
    },
  )
  .get(
    "/ledger/for-account/:accountCode",
    async ({ params }) => {
      try {
        const accountCode = params.accountCode;
        return await ledgerService.getLedgerEntriesByAccount(accountCode);
      } catch (error) {
        console.error(
          `Error in GET /ledger/for-account/${params.accountCode}:`,
          error,
        );
        throw error;
      }
    },
    {
      params: t.Object({
        accountCode: t.String(),
      }),
      detail: {
        summary: "Get ledger entries for a specific account",
        tags: ["MoneyWorks Data"],
      },
      response: LedgerMany,
    },
  )
  .get(
    "/ledger/for-transaction/:transactionId",
    async ({ params }) => {
      try {
        const transactionId = Number(params.transactionId);
        return await ledgerService.getLedgerEntriesByTransaction(transactionId);
      } catch (error) {
        console.error(
          `Error in GET /ledger/for-transaction/${params.transactionId}:`,
          error,
        );
        throw error;
      }
    },
    {
      params: t.Object({
        transactionId: t.Numeric(),
      }),
      detail: {
        summary: "Get ledger entries for a specific transaction",
        tags: ["MoneyWorks Data"],
      },
      response: LedgerMany,
    },
  );
