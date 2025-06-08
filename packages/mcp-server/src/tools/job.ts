import { JobService } from "@moneyworks/api/src/services/tables/job.service";
import type { Job } from "@moneyworks/api/src/types/interface/tables/job";
import { z } from "zod";

const jobService = new JobService();

// Consolidated job tool schema
const jobToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for jobs, get specific job, or list available fields",
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
		.describe("The job sequence number to retrieve (get operation only)"),
	code: z
		.string()
		.optional()
		.describe("The job code to retrieve (get operation only)"),
});

export const jobTool = {
	description:
		"Unified tool for job operations: search jobs, get specific job, or list available fields",
	inputSchema: jobToolSchema,

	async execute(args: z.infer<typeof jobToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Job> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await jobService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					jobs: result.data,
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

				const result = await jobService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Job not found");
				}

				return {
					operation: "get",
					job: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { JobFields } = await import(
					"@moneyworks/api/src/types/interface/tables/job"
				);
				return {
					operation: "listFields",
					fields: JobFields,
					description: "Available fields for job queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
