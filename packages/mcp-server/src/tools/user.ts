import { UserService } from "@moneyworks/api/src/services/tables/user.service";
import type { User } from "@moneyworks/api/src/types/interface/tables/user";
import { z } from "zod";

const userService = new UserService();

// Consolidated user tool schema
const userToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for users, get specific user, or list available fields",
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
		.describe("The user sequence number to retrieve (get operation only)"),
	key: z
		.string()
		.optional()
		.describe("The user key to retrieve (get operation only)"),
});

export const userTool = {
	description:
		"Unified tool for user operations: search users, get specific user, or list available fields",
	inputSchema: userToolSchema,

	async execute(args: z.infer<typeof userToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<User> = {};

				// Build search criteria
				if (args.query) {
					// Search by key
					search.Key = args.query;
				}

				// Execute search using the existing service
				const result = await userService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					users: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				// Try sequence number first, then key
				let searchCriteria;
				if (args.sequenceNumber) {
					searchCriteria = { SequenceNumber: args.sequenceNumber };
				} else if (args.key) {
					searchCriteria = { Key: args.key };
				} else {
					throw new Error(
						"Either sequenceNumber or key is required for get operation",
					);
				}

				const result = await userService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("User not found");
				}

				return {
					operation: "get",
					user: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { UserFields } = await import(
					"@moneyworks/api/src/types/interface/tables/user"
				);
				return {
					operation: "listFields",
					fields: UserFields,
					description: "Available fields for user queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
