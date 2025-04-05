import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { TaxRateService } from "../services/tables/tax-rate.service";
import { taxRateObject } from "../types/constants.eden";
import { TaxRateMany } from "../types/eden/TaxRate";
import { type TaxRate, TaxRateFields } from "../types/interface/tax-rate";

// Initialize the tax-rate service with configuration
const config = loadMoneyWorksConfig();
const taxRateService = new TaxRateService(config);

export const taxRateRoutes = new Elysia({ prefix: "/api" }).get(
  "/tax-rates",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await taxRateService.getTaxRates({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as TaxRate,
      });
    } catch (error) {
      console.error("Error in GET /tax-rates:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(taxRateObject),
    }),
    detail: {
      summary: "Get tax-rates.",
      description: `Get all tax-rates. Search by: ${TaxRateFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    tags: ["Tax"],
    // response: TaxRateMany,
  },
);
