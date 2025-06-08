import { GeneralService } from "@moneyworks/api/src/services/tables/general.service";
import type { General } from "@moneyworks/api/src/types/interface/tables/general";
import { z } from "zod";

const generalService = new GeneralService();

// Consolidated general tool schema
const generalToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for generals, get specific general, or list available fields",
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
		.describe("The general sequence number to retrieve (get operation only)"),
	code: z
		.string()
		.optional()
		.describe("The general code to retrieve (get operation only)"),
});

export const generalTool = {
	description:
		"Unified tool for general operations: search generals, get specific general, or list available fields",
	inputSchema: generalToolSchema,

	async execute(args: z.infer<typeof generalToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<General> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await generalService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					generals: result.data,
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

				const result = await generalService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("General not found");
				}

				return {
					operation: "get",
					general: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { GeneralFields } = await import(
					"@moneyworks/api/src/types/interface/tables/general"
				);
				return {
					operation: "listFields",
					fields: GeneralFields,
					description: "Available fields for general queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
