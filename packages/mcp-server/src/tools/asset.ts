import { AssetService } from "@moneyworks/api/src/services/tables/asset.service";
import type { Asset } from "@moneyworks/api/src/types/interface/tables/asset";
import { z } from "zod";

const assetService = new AssetService();

// Consolidated asset tool schema
const assetToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for assets, get specific asset, or list available fields",
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
		.describe("The asset sequence number to retrieve (get operation only)"),
	code: z
		.string()
		.optional()
		.describe("The asset code to retrieve (get operation only)"),
});

export const assetTool = {
	description:
		"Unified tool for asset operations: search assets, get specific asset, or list available fields",
	inputSchema: assetToolSchema,

	async execute(args: z.infer<typeof assetToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Asset> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await assetService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					assets: result.data,
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

				const result = await assetService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Asset not found");
				}

				return {
					operation: "get",
					asset: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { AssetFields } = await import(
					"@moneyworks/api/src/types/interface/tables/asset"
				);
				return {
					operation: "listFields",
					fields: AssetFields,
					description: "Available fields for asset queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
