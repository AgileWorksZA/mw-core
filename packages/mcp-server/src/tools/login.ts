import { LoginService } from "@moneyworks/api/src/services/tables/login.service";
import type { Login } from "@moneyworks/api/src/types/interface/tables/login";
import { z } from "zod";

const loginService = new LoginService();

// Consolidated login tool schema
const loginToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for logins, get specific login, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The login sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The login code to retrieve (get operation only)"),
});

export const loginTool = {
	description: "Unified tool for login operations: search logins, get specific login, or list available fields",
	inputSchema: loginToolSchema,

	async execute(args: z.infer<typeof loginToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Login> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await loginService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					logins: result.data,
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

				const result = await loginService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Login not found`);
				}

				return {
					operation: "get",
					login: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { LoginFields } = await import(
					"@moneyworks/api/src/types/interface/tables/login"
				);
				return {
					operation: "listFields",
					fields: LoginFields,
					description: "Available fields for login queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};