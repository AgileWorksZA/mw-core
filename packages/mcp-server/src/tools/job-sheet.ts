import { JobSheetService } from "@moneyworks/api/src/services/tables/jobsheet.service";
import type { JobSheet } from "@moneyworks/api/src/types/interface/tables/jobsheet";
import { z } from "zod";

const jobsheetService = new JobSheetService();

// Consolidated jobsheet tool schema
const jobsheetToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for jobsheets, get specific jobsheet, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The jobsheet sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The jobsheet code to retrieve (get operation only)"),
});

export const jobsheetTool = {
	description: "Unified tool for jobsheet operations: search jobsheets, get specific jobsheet, or list available fields",
	inputSchema: jobsheetToolSchema,

	async execute(args: z.infer<typeof jobsheetToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<JobSheet> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await jobsheetService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					jobsheets: result.data,
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

				const result = await jobsheetService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Jobsheet not found`);
				}

				return {
					operation: "get",
					jobsheet: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { JobSheetFields } = await import(
					"@moneyworks/api/src/types/interface/tables/jobsheet"
				);
				return {
					operation: "listFields",
					fields: JobSheetFields,
					description: "Available fields for jobsheet queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};