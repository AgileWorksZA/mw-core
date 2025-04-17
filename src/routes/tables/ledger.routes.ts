import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { LedgerService } from "../../services/tables/ledger.service";
import { ledgerObject } from "../../types/constants.eden";
import { LedgerMany } from "../../types/eden/tables/Ledger";
import { type Ledger, LedgerFields } from "../../types/interface/tables/ledger";

// Initialize the ledger service with configuration
const config = loadMoneyWorksConfig();
const ledgerService = new LedgerService(config);

export const ledgerRoutes = new Elysia({ prefix: "/api" }).get(
  "/ledgers",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await ledgerService.getLedgers({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Ledger>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /ledgers:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(ledgerObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Ledgers",
      description: `Get all ledgers. Search by: ${LedgerFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/ledgers?format=SequenceNumber,AccountCode,Balance,Type`,
    },
    tags: ["Transaction"],
    response: { $schema: { $ref: "#/components/schemas/Ledgers" } },
  },
);
