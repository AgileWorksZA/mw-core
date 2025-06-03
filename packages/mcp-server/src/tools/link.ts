import { LinkService } from "@moneyworks/api/src/services/tables/link.service";
import type { Link } from "@moneyworks/api/src/types/interface/tables/link";
import { z } from "zod";

const linkService = new LinkService();

// Consolidated link tool schema
const linkToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for links, get specific link, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The link sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The link code to retrieve (get operation only)"),
});

export const linkTool = {
	description: "Unified tool for link operations: search links, get specific link, or list available fields",
	inputSchema: linkToolSchema,

	async execute(args: z.infer<typeof linkToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Link> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await linkService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					links: result.data,
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

				const result = await linkService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Link not found`);
				}

				return {
					operation: "get",
					link: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { LinkFields } = await import(
					"@moneyworks/api/src/types/interface/tables/link"
				);
				return {
					operation: "listFields",
					fields: LinkFields,
					description: "Available fields for link queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};