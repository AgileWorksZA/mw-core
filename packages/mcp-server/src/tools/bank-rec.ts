import { BankRecsService } from "@moneyworks/api/src/services/tables/bank-recs.service";
import type { BankRecs } from "@moneyworks/api/src/types/interface/tables/bankrecs";
import { z } from "zod";

const bankrecService = new BankRecsService();

// Consolidated bankrec tool schema
const bankrecToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for bankrecs, get specific bankrec, or list available fields",
		),

	// Search operation parameters
	query: z.string().optional().describe("Search query (search operation only)"),
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
	sequenceNumber: z
		.number()
		.optional()
		.describe("The bankrec sequence number to retrieve (get operation only)"),
});

export const bankrecTool = {
	description:
		"Unified tool for bankrec operations: search bankrecs, get specific bankrec, or list available fields",
	inputSchema: bankrecToolSchema,

	async execute(args: z.infer<typeof bankrecToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<BankRecs> = {};

				// Build search criteria
				if (args.query) {
					// Search by account name
					search.Account = args.query;
				}

				// Execute search using the existing service
				const result = await bankrecService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					bankrecs: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				if (!args.sequenceNumber) {
					throw new Error(
						"sequenceNumber is required for get operation",
					);
				}

				const searchCriteria = { SequenceNumber: args.sequenceNumber };

				const result = await bankrecService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Bankrec not found");
				}

				return {
					operation: "get",
					bankrec: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { BankRecsFields } = await import(
					"@moneyworks/api/src/types/interface/tables/bankrecs"
				);
				return {
					operation: "listFields",
					fields: BankRecsFields,
					description: "Available fields for bankrec queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
