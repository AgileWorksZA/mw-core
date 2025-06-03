import { OffLedgerService } from "@moneyworks/api/src/services/tables/offledger.service";
import type { OffLedger } from "@moneyworks/api/src/types/interface/tables/offledger";
import { z } from "zod";

const offledgerService = new OffLedgerService();

// Consolidated offledger tool schema
const offledgerToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for offledgers, get specific offledger, or list available fields"),
	
	// Search operation parameters
	query: z
		.string()
		.optional()
		.describe("Search query (search operation only)"),
	limit: z
		.number()
		.min(1)
		.max(100)
		.default(50)
		.describe("Maximum number of results (search operation only)"),
	offset: z.number().min(0).default(0).describe("Number of results to skip (search operation only)"),
	
	// Get operation parameters (adjust based on primary key)
	sequenceNumber: z.number().optional().describe("The offledger sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The offledger code to retrieve (get operation only)"),
});

export const offledgerTool = {
	description: "Unified tool for offledger operations: search offledgers, get specific offledger, or list available fields",
	inputSchema: offledgerToolSchema,

	async execute(args: z.infer<typeof offledgerToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<OffLedger> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await offledgerService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					offledgers: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				// Try sequence number first, then code
				let searchCriteria;
				if (args.sequenceNumber) {
					searchCriteria = { SequenceNumber: args.sequenceNumber };
				} else if (args.code) {
					searchCriteria = { Code: args.code };
				} else {
					throw new Error("Either sequenceNumber or code is required for get operation");
				}

				const result = await offledgerService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Offledger not found`);
				}

				return {
					operation: "get",
					offledger: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { OffLedgerFields } = await import(
					"@moneyworks/api/src/types/interface/tables/offledger"
				);
				return {
					operation: "listFields",
					fields: OffLedgerFields,
					description: "Available fields for offledger queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};