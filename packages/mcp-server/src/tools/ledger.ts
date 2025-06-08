import { LedgerService } from "@moneyworks/api/src/services/tables/ledger.service";
import type { Ledger } from "@moneyworks/api/src/types/interface/tables/ledger";
import { z } from "zod";

const ledgerService = new LedgerService();

// Consolidated ledger tool schema
const ledgerToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for ledgers, get specific ledger, or list available fields",
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
		.describe("The ledger sequence number to retrieve (get operation only)"),
});

export const ledgerTool = {
	description:
		"Unified tool for ledger operations: search ledgers, get specific ledger, or list available fields",
	inputSchema: ledgerToolSchema,

	async execute(args: z.infer<typeof ledgerToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Ledger> = {};

				// Build search criteria
				if (args.query) {
					// Search by AccountCode field
					search.AccountCode = args.query;
				}

				// Execute search using the existing service
				const result = await ledgerService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					ledgers: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				// Only use sequence number for get operation
				if (!args.sequenceNumber) {
					throw new Error(
						"sequenceNumber is required for get operation",
					);
				}
				
				const searchCriteria = { SequenceNumber: args.sequenceNumber };

				const result = await ledgerService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Ledger not found");
				}

				return {
					operation: "get",
					ledger: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { LedgerFields } = await import(
					"@moneyworks/api/src/types/interface/tables/ledger"
				);
				return {
					operation: "listFields",
					fields: LedgerFields,
					description: "Available fields for ledger queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
