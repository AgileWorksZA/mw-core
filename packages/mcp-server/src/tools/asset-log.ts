import { AssetLogService } from "@moneyworks/api/src/services/tables/assetlog.service";
import type { AssetLog } from "@moneyworks/api/src/types/interface/tables/assetlog";
import { z } from "zod";

const assetlogService = new AssetLogService();

// Consolidated assetlog tool schema
const assetlogToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for assetlogs, get specific assetlog, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The assetlog sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The assetlog code to retrieve (get operation only)"),
});

export const assetlogTool = {
	description: "Unified tool for assetlog operations: search assetlogs, get specific assetlog, or list available fields",
	inputSchema: assetlogToolSchema,

	async execute(args: z.infer<typeof assetlogToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<AssetLog> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await assetlogService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					assetlogs: result.data,
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

				const result = await assetlogService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Assetlog not found`);
				}

				return {
					operation: "get",
					assetlog: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { AssetLogFields } = await import(
					"@moneyworks/api/src/types/interface/tables/assetlog"
				);
				return {
					operation: "listFields",
					fields: AssetLogFields,
					description: "Available fields for assetlog queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};