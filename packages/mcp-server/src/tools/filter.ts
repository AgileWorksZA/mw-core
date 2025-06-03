import { FilterService } from "@moneyworks/api/src/services/tables/filter.service";
import type { Filter } from "@moneyworks/api/src/types/interface/tables/filter";
import { z } from "zod";

const filterService = new FilterService();

// Consolidated filter tool schema
const filterToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for filters, get specific filter, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The filter sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The filter code to retrieve (get operation only)"),
});

export const filterTool = {
	description: "Unified tool for filter operations: search filters, get specific filter, or list available fields",
	inputSchema: filterToolSchema,

	async execute(args: z.infer<typeof filterToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Filter> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await filterService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					filters: result.data,
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

				const result = await filterService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Filter not found`);
				}

				return {
					operation: "get",
					filter: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { FilterFields } = await import(
					"@moneyworks/api/src/types/interface/tables/filter"
				);
				return {
					operation: "listFields",
					fields: FilterFields,
					description: "Available fields for filter queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};