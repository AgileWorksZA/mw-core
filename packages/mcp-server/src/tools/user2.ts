import { User2Service } from "@moneyworks/api/src/services/tables/user2.service";
import type { User2 } from "@moneyworks/api/src/types/interface/tables/user2";
import { z } from "zod";

const user2Service = new User2Service();

// Consolidated user2 tool schema
const user2ToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for user2s, get specific user2, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The user2 sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The user2 code to retrieve (get operation only)"),
});

export const user2Tool = {
	description: "Unified tool for user2 operations: search user2s, get specific user2, or list available fields",
	inputSchema: user2ToolSchema,

	async execute(args: z.infer<typeof user2ToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<User2> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await user2Service.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					user2s: result.data,
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

				const result = await user2Service.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`User2 not found`);
				}

				return {
					operation: "get",
					user2: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { User2Fields } = await import(
					"@moneyworks/api/src/types/interface/tables/user2"
				);
				return {
					operation: "listFields",
					fields: User2Fields,
					description: "Available fields for user2 queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};