import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { AccountService } from "../services/tables/account.service";
import { accountObject } from "../types/constants.eden";
import { AccountMany } from "../types/eden/Account";
import { type Account, AccountFields } from "../types/interface/account";

// Initialize the account service with configuration
const config = loadMoneyWorksConfig();
const accountService = new AccountService(config);

export const accountRoutes = new Elysia({ prefix: "/api" }).get(
  "/accounts",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await accountService.getAccounts({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Account,
      });
    } catch (error) {
      console.error("Error in GET /accounts:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(accountObject),
    }),
    detail: {
      summary: "Get accounts.",
      description: `Get all accounts. Search by: ${AccountFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    response: AccountMany,
  },
);
