import { ListsService } from "@moneyworks/api/src/services/tables/lists.service";
import type { Lists } from "@moneyworks/api/src/types/interface/tables/lists";
import { z } from "zod";

const listService = new ListsService();

// Consolidated list tool schema
const listToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for lists, get specific list, or list available fields",
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
		.describe("The list sequence number to retrieve (get operation only)"),
});

export const listTool = {
	description:
		"Unified tool for list operations: search lists, get specific list, or list available fields",
	inputSchema: listToolSchema,

	async execute(args: z.infer<typeof listToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Lists> = {};

				// Build search criteria
				if (args.query) {
					// Search by list ID or item
					search.ListID = args.query;
				}

				// Execute search using the existing service
				const result = await listService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					lists: result.data,
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

				const result = await listService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("List not found");
				}

				return {
					operation: "get",
					list: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { ListsFields } = await import(
					"@moneyworks/api/src/types/interface/tables/lists"
				);
				return {
					operation: "listFields",
					fields: ListsFields,
					description: "Available fields for list queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
