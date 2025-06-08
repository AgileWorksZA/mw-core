import { LogService } from "@moneyworks/api/src/services/tables/log.service";
import type { Log } from "@moneyworks/api/src/types/interface/tables/log";
import { z } from "zod";

const logService = new LogService();

// Consolidated log tool schema
const logToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for logs, get specific log, or list available fields",
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
		.describe("The log sequence number to retrieve (get operation only)"),
});

export const logTool = {
	description:
		"Unified tool for log operations: search logs, get specific log, or list available fields",
	inputSchema: logToolSchema,

	async execute(args: z.infer<typeof logToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Log> = {};

				// Build search criteria
				if (args.query) {
					// Search by description
					search.Description = args.query;
				}

				// Execute search using the existing service
				const result = await logService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					logs: result.data,
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

				const result = await logService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Log not found");
				}

				return {
					operation: "get",
					log: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { LogFields } = await import(
					"@moneyworks/api/src/types/interface/tables/log"
				);
				return {
					operation: "listFields",
					fields: LogFields,
					description: "Available fields for log queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
