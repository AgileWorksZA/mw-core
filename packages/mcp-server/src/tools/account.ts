import { z } from "zod";
import { AccountService } from "@moneyworks/api/src/services/tables/account.service";
import type { Account } from "@moneyworks/api/src/types/interface/tables/account";

const accountService = new AccountService();

const searchAccountsSchema = z.object({
  query: z
    .string()
    .optional()
    .describe("Search query for account code or description"),
  type: z
    .enum(["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"])
    .optional()
    .describe(
      "Account type filter: IN=Income, SA=Sales, EX=Expense, CS=Cost of Sales, CA=Current Asset, CL=Current Liability, FA=Fixed Asset, TA=Term Asset, TL=Term Liability, SF=Shareholders Funds",
    ),
  category: z.string().optional().describe("Category code filter"),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(50)
    .describe("Maximum number of results"),
  offset: z.number().min(0).default(0).describe("Number of results to skip"),
});

export const searchAccountsTool = {
  description:
    "Search for accounts in MoneyWorks by code, description, type, or category",
  inputSchema: searchAccountsSchema,

  async execute(args: z.infer<typeof searchAccountsSchema>) {
    const search: Partial<Account> = {};

    // Build search criteria
    if (args.query) {
      // The API might support specific search syntax - adjust as needed
      search.Code = args.query;
    }

    if (args.type) {
      search.Type = args.type;
    }

    if (args.category) {
      search.Category = args.category;
    }

    // Execute search using the existing service
    const result = await accountService.getData({
      search: Object.keys(search).length > 0 ? search : undefined,
      limit: args.limit,
      offset: args.offset,
    });

    return {
      accounts: result.data,
      total: result.pagination?.total || result.data.length,
      limit: args.limit,
      offset: args.offset,
    };
  },
};

// Get account by code
const getAccountSchema = z.object({
  code: z.string().describe("The account code to retrieve"),
});

export const getAccountTool = {
  description: "Get a specific account by its code",
  inputSchema: getAccountSchema,

  async execute(args: z.infer<typeof getAccountSchema>) {
    const result = await accountService.getData({
      search: { Code: args.code },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      throw new Error(`Account not found: ${args.code}`);
    }

    return result.data[0];
  },
};

// List account fields
const listAccountFieldsSchema = z.object({});

export const listAccountFieldsTool = {
  description: "List all available fields for accounts",
  inputSchema: listAccountFieldsSchema,

  async execute() {
    // Import the fields from the account service
    const { AccountFields } = await import(
      "@moneyworks/api/src/types/interface/tables/account"
    );
    return {
      fields: AccountFields,
      description: "Available fields for account queries and filters",
    };
  },
};
