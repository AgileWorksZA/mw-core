import { StickieService } from "@moneyworks/api/src/services/tables/stickie.service";
import type { Stickie } from "@moneyworks/api/src/types/interface/tables/stickie";
import { z } from "zod";

const stickieService = new StickieService();

// Consolidated stickie tool schema
const stickieToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for stickies, get specific stickie, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The stickie sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The stickie code to retrieve (get operation only)"),
});

export const stickieTool = {
	description: "Unified tool for stickie operations: search stickies, get specific stickie, or list available fields",
	inputSchema: stickieToolSchema,

	async execute(args: z.infer<typeof stickieToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Stickie> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await stickieService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					stickies: result.data,
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

				const result = await stickieService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Stickie not found`);
				}

				return {
					operation: "get",
					stickie: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { StickieFields } = await import(
					"@moneyworks/api/src/types/interface/tables/stickie"
				);
				return {
					operation: "listFields",
					fields: StickieFields,
					description: "Available fields for stickie queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};