import { DetailService } from "@moneyworks/api/src/services/tables/detail.service";
import type { Detail } from "@moneyworks/api/src/types/interface/tables/detail";
import { z } from "zod";

const detailService = new DetailService();

// Consolidated detail tool schema
const detailToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for details, get specific detail, or list available fields",
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
		.describe("The detail sequence number to retrieve (get operation only)")
});

export const detailTool = {
	description:
		"Unified tool for detail operations: search details, get specific detail, or list available fields",
	inputSchema: detailToolSchema,

	async execute(args: z.infer<typeof detailToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Detail> = {};

				// Build search criteria
				if (args.query) {
					// Search by Account field
					search.Account = args.query;
				}

				// Execute search using the existing service
				const result = await detailService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					details: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				if (!args.sequenceNumber) {
					throw new Error(
						"sequenceNumber is required for get operation",
					);
				}
				const searchCriteria = { SequenceNumber: args.sequenceNumber };

				const result = await detailService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Detail not found");
				}

				return {
					operation: "get",
					detail: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { DetailFields } = await import(
					"@moneyworks/api/src/types/interface/tables/detail"
				);
				return {
					operation: "listFields",
					fields: DetailFields,
					description: "Available fields for detail queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
