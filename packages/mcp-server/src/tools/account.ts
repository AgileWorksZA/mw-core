import { AccountService } from "@moneyworks/api/src/services/tables/account.service";
import type { Account } from "@moneyworks/api/src/types/interface/tables/account";
import { z } from "zod";

const accountService = new AccountService();

// Map from full type names to MoneyWorks type codes
const typeMapping: Record<string, string> = {
	IN: "I", // Income
	SA: "S", // Sales
	EX: "E", // Expense
	CS: "C", // Cost of Sales
	CA: "A", // Current Asset
	CL: "L", // Current Liability
	FA: "F", // Fixed Asset
	TA: "T", // Term Asset
	TL: "M", // Term Liability
	SF: "H", // Shareholders Funds
};

// Consolidated account tool schema
const accountToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for accounts, get specific account, or list available fields",
		),

	// Search operation parameters
	query: z
		.string()
		.optional()
		.describe(
			"Search query for account code or description (search operation only)",
		),
	type: z
		.enum(["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"])
		.optional()
		.describe(
			"Account type filter: IN=Income, SA=Sales, EX=Expense, CS=Cost of Sales, CA=Current Asset, CL=Current Liability, FA=Fixed Asset, TA=Term Asset, TL=Term Liability, SF=Shareholders Funds (search operation only)",
		),
	category: z
		.string()
		.optional()
		.describe("Category code filter (search operation only)"),
	limit: z
		.number()
		.min(1)
		.max(100)
		.default(50)
		.describe("Maximum number of results (search operation only)"),
	offset: z
		.number()
		.min(0)
		.default(0)
		.describe("Number of results to skip (search operation only)"),

	// Get operation parameters
	code: z
		.string()
		.optional()
		.describe("The account code to retrieve (get operation only)"),
});

export const accountTool = {
	description:
		"Unified tool for account operations: search accounts, get specific account, or list available fields",
	inputSchema: accountToolSchema,

	async execute(args: z.infer<typeof accountToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Account> = {};

				// Build search criteria
				if (args.query) {
					// The API might support specific search syntax - adjust as needed
					search.Code = args.query;
				}

				if (args.type) {
					search.Type = typeMapping[args.type] as Account["Type"];
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
					operation: "search",
					accounts: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				if (!args.code) {
					throw new Error("code is required for get operation");
				}

				const result = await accountService.getData({
					search: { Code: args.code },
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Account not found: ${args.code}`);
				}

				return {
					operation: "get",
					account: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the account service
				const { AccountFields } = await import(
					"@moneyworks/api/src/types/interface/tables/account"
				);
				return {
					operation: "listFields",
					fields: AccountFields,
					description: "Available fields for account queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
