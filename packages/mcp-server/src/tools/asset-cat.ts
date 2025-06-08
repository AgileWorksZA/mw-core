import { AssetCatService } from "@moneyworks/api/src/services/tables/asset-cat.service";
import type { AssetCat } from "@moneyworks/api/src/types/interface/tables/assetcat";
import { z } from "zod";

const assetcatService = new AssetCatService();

// Consolidated assetcat tool schema
const assetcatToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for assetcats, get specific assetcat, or list available fields",
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

	// Get operation parameters (adjust based on primary key)
	sequenceNumber: z
		.number()
		.optional()
		.describe("The assetcat sequence number to retrieve (get operation only)"),
	code: z
		.string()
		.optional()
		.describe("The assetcat code to retrieve (get operation only)"),
});

export const assetcatTool = {
	description:
		"Unified tool for assetcat operations: search assetcats, get specific assetcat, or list available fields",
	inputSchema: assetcatToolSchema,

	async execute(args: z.infer<typeof assetcatToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<AssetCat> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await assetcatService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					assetcats: result.data,
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
					throw new Error(
						"Either sequenceNumber or code is required for get operation",
					);
				}

				const result = await assetcatService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Assetcat not found");
				}

				return {
					operation: "get",
					assetcat: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { AssetCatFields } = await import(
					"@moneyworks/api/src/types/interface/tables/assetcat"
				);
				return {
					operation: "listFields",
					fields: AssetCatFields,
					description: "Available fields for assetcat queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
