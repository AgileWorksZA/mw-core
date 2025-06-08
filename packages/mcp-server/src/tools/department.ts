import { DepartmentService } from "@moneyworks/api/src/services/tables/department.service";
import type { Department } from "@moneyworks/api/src/types/interface/tables/department";
import { z } from "zod";

const departmentService = new DepartmentService();

// Consolidated department tool schema
const departmentToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for departments, get specific department, or list available fields",
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
		.describe(
			"The department sequence number to retrieve (get operation only)",
		),
	code: z
		.string()
		.optional()
		.describe("The department code to retrieve (get operation only)"),
});

export const departmentTool = {
	description:
		"Unified tool for department operations: search departments, get specific department, or list available fields",
	inputSchema: departmentToolSchema,

	async execute(args: z.infer<typeof departmentToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Department> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await departmentService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					departments: result.data,
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

				const result = await departmentService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Department not found");
				}

				return {
					operation: "get",
					department: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { DepartmentFields } = await import(
					"@moneyworks/api/src/types/interface/tables/department"
				);
				return {
					operation: "listFields",
					fields: DepartmentFields,
					description: "Available fields for department queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
