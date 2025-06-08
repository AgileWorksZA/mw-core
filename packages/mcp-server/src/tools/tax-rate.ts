import { TaxRateService } from "@moneyworks/api/src/services/tables/tax-rate.service";
import type { TaxRate } from "@moneyworks/api/src/types/interface/tables/taxrate";
import { z } from "zod";

const taxrateService = new TaxRateService();

// Consolidated taxrate tool schema
const taxrateToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for taxrates, get specific taxrate, or list available fields",
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
		.describe("The taxrate sequence number to retrieve (get operation only)"),
	taxCode: z
		.string()
		.optional()
		.describe("The tax code to retrieve (get operation only)"),
});

export const taxrateTool = {
	description:
		"Unified tool for taxrate operations: search taxrates, get specific taxrate, or list available fields",
	inputSchema: taxrateToolSchema,

	async execute(args: z.infer<typeof taxrateToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<TaxRate> = {};

				// Build search criteria
				if (args.query) {
					// Search by tax code
					search.TaxCode = args.query;
				}

				// Execute search using the existing service
				const result = await taxrateService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					taxrates: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				// Try sequence number first, then taxCode
				let searchCriteria;
				if (args.sequenceNumber) {
					searchCriteria = { SequenceNumber: args.sequenceNumber };
				} else if (args.taxCode) {
					searchCriteria = { TaxCode: args.taxCode };
				} else {
					throw new Error(
						"Either sequenceNumber or taxCode is required for get operation",
					);
				}

				const result = await taxrateService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Taxrate not found");
				}

				return {
					operation: "get",
					taxrate: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { TaxRateFields } = await import(
					"@moneyworks/api/src/types/interface/tables/taxrate"
				);
				return {
					operation: "listFields",
					fields: TaxRateFields,
					description: "Available fields for taxrate queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
