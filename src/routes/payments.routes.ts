import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { PaymentsService } from "../services/tables/payments.service";
import { paymentsObject } from "../types/constants.eden";
import { PaymentsMany } from "../types/eden/Payments";
import { type Payments, PaymentsFields } from "../types/interface/payments";

// Initialize the payments service with configuration
const config = loadMoneyWorksConfig();
const paymentsService = new PaymentsService(config);

export const paymentsRoutes = new Elysia({ prefix: "/api" }).get(
  "/payments",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await paymentsService.getPayments({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Payments,
      });
    } catch (error) {
      console.error("Error in GET /payments:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(paymentsObject),
    }),
    detail: {
      summary: "Get payments.",
      description: `Get all payments. Search by: ${PaymentsFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    tags: ["Financial"],
    // response: PaymentsMany,
  },
);
