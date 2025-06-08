import { MemoService } from "@moneyworks/api/src/services/tables/memo.service";
import type { Memo } from "@moneyworks/api/src/types/interface/tables/memo";
import { z } from "zod";

const memoService = new MemoService();

// Consolidated memo tool schema
const memoToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for memos, get specific memo, or list available fields",
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
		.describe("The memo sequence number to retrieve (get operation only)"),
	nameSeq: z
		.number()
		.optional()
		.describe("The memo name sequence to retrieve (get operation only)"),
});

export const memoTool = {
	description:
		"Unified tool for memo operations: search memos, get specific memo, or list available fields",
	inputSchema: memoToolSchema,

	async execute(args: z.infer<typeof memoToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Memo> = {};

				// Build search criteria
				if (args.query) {
					// Search by text content
					search.Text = args.query;
				}

				// Execute search using the existing service
				const result = await memoService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					memos: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				// Try sequence number first, then nameSeq
				let searchCriteria;
				if (args.sequenceNumber) {
					searchCriteria = { SequenceNumber: args.sequenceNumber };
				} else if (args.nameSeq) {
					searchCriteria = { NameSeq: args.nameSeq };
				} else {
					throw new Error(
						"Either sequenceNumber or nameSeq is required for get operation",
					);
				}

				const result = await memoService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Memo not found");
				}

				return {
					operation: "get",
					memo: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { MemoFields } = await import(
					"@moneyworks/api/src/types/interface/tables/memo"
				);
				return {
					operation: "listFields",
					fields: MemoFields,
					description: "Available fields for memo queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
