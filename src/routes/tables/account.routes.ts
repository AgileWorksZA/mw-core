import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AccountService } from "../../services/tables/account.service";
import { accountObject } from "../../types/constants.eden";
import { AccountMany } from "../../types/eden/tables/Account";
import {
  type Account,
  AccountFields,
} from "../../types/interface/tables/account";

// Initialize the account service with configuration
const config = loadMoneyWorksConfig();
const accountService = new AccountService(config);

export const accountRoutes = new Elysia({ prefix: "/api" }).get(
  "/accounts",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format, skip_validation } = query;

    // Parse the format parameter as an array of field names if provided
    const fields = format ? format.split(",") : undefined;
    console.log("Format:", format, fields);

    try {
      return await accountService.getAccounts({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Account>,
        fields,
        skip_validation: skip_validation === "true" || skip_validation === true,
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
      format: t.Optional(t.String()),
      skip_validation: t.Optional(t.Boolean()),
    }),
    detail: {
      summary: "Accounts",
      description: `Get all accounts. Search by: ${AccountFields.join(", ")}. 
      Optionally specify field names with "format" parameter to retrieve only specific fields.
      Example: /api/accounts?format=Code&format=Description
      
      Use skip_validation=true to bypass field validation when using custom fields.`,
    },
    tags: ["CRM"],
    response: AccountMany,
  },
);
