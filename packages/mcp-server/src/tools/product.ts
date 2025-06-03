import { ProductService } from "@moneyworks/api/src/services/tables/product.service";
import type { Product } from "@moneyworks/api/src/types/interface/tables/product";
import { z } from "zod";

const productService = new ProductService();

// Consolidated product tool schema
const productToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for products, get specific product, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The product sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The product code to retrieve (get operation only)"),
});

export const productTool = {
	description: "Unified tool for product operations: search products, get specific product, or list available fields",
	inputSchema: productToolSchema,

	async execute(args: z.infer<typeof productToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Product> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await productService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					products: result.data,
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

				const result = await productService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Product not found`);
				}

				return {
					operation: "get",
					product: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { ProductFields } = await import(
					"@moneyworks/api/src/types/interface/tables/product"
				);
				return {
					operation: "listFields",
					fields: ProductFields,
					description: "Available fields for product queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};