import { BuildService } from "@moneyworks/api/src/services/tables/build.service";
import type { Build } from "@moneyworks/api/src/types/interface/tables/build";
import { z } from "zod";

const buildService = new BuildService();

// Consolidated build tool schema
const buildToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for builds, get specific build, or list available fields"),
	
	// Search operation parameters
	productSeq: z
		.number()
		.optional()
		.describe("Filter by product sequence number (search operation only)"),
	partCode: z.string().optional().describe("Search by part code (search operation only)"),
	order: z.number().optional().describe("Filter by order number (search operation only)"),
	limit: z
		.number()
		.min(1)
		.max(100)
		.default(50)
		.describe("Maximum number of results (search operation only)"),
	offset: z.number().min(0).default(0).describe("Number of results to skip (search operation only)"),
	
	// Get operation parameters
	sequenceNumber: z.number().optional().describe("The build sequence number to retrieve (get operation only)"),
});

export const buildTool = {
	description: "Unified tool for build operations: search builds, get specific build, or list available fields",
	inputSchema: buildToolSchema,

	async execute(args: z.infer<typeof buildToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Build> = {};

				// Build search criteria
				if (args.productSeq !== undefined) {
					search.ProductSeq = args.productSeq;
				}

				if (args.partCode) {
					search.PartCode = args.partCode;
				}

				if (args.order !== undefined) {
					search.Order = args.order;
				}

				// Execute search using the existing service
				const result = await buildService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					builds: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				if (!args.sequenceNumber) {
					throw new Error("sequenceNumber is required for get operation");
				}

				const result = await buildService.getData({
					search: { SequenceNumber: args.sequenceNumber },
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Build not found: ${args.sequenceNumber}`);
				}

				return {
					operation: "get",
					build: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the build interface
				const { BuildFields } = await import(
					"@moneyworks/api/src/types/interface/tables/build"
				);
				return {
					operation: "listFields",
					fields: BuildFields,
					description: "Available fields for build queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};