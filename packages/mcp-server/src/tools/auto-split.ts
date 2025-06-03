import { AutoSplitService } from "@moneyworks/api/src/services/tables/autosplit.service";
import type { AutoSplit } from "@moneyworks/api/src/types/interface/tables/autosplit";
import { z } from "zod";

const autosplitService = new AutoSplitService();

// Consolidated autosplit tool schema
const autosplitToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for autosplits, get specific autosplit, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The autosplit sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The autosplit code to retrieve (get operation only)"),
});

export const autosplitTool = {
	description: "Unified tool for autosplit operations: search autosplits, get specific autosplit, or list available fields",
	inputSchema: autosplitToolSchema,

	async execute(args: z.infer<typeof autosplitToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<AutoSplit> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await autosplitService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					autosplits: result.data,
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

				const result = await autosplitService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Autosplit not found`);
				}

				return {
					operation: "get",
					autosplit: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { AutoSplitFields } = await import(
					"@moneyworks/api/src/types/interface/tables/autosplit"
				);
				return {
					operation: "listFields",
					fields: AutoSplitFields,
					description: "Available fields for autosplit queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};