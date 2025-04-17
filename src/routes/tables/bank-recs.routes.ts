import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { BankRecsService } from "../../services/tables/bank-recs.service";
import { bankRecsObject } from "../../types/constants.eden";
import { BankRecsMany } from "../../types/eden/tables/BankRecs";
import {
  type BankRecs,
  BankRecsFields,
} from "../../types/interface/tables/bankrecs";

// Initialize the bank-recs service with configuration
const config = loadMoneyWorksConfig();
const bankRecsService = new BankRecsService(config);

export const bankRecsRoutes = new Elysia({ prefix: "/api" }).get(
  "/bank-recs",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;

    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await bankRecsService.getBankRecs({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<BankRecs>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /bank-recs:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(bankRecsObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Bank Reconciliations",
      description: `Stores historical records of completed bank reconciliations, including statement details and balances.

      Search by: ${BankRecsFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/bank-recs?format=SequenceNumber,Account,Date`,
    },
    tags: ["Banking"],
    response: { $schema: { $ref: "#/components/schemas/BankRecs" } },
  },
);
