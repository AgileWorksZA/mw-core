import { InventoryService } from "@moneyworks/api/src/services/tables/inventory.service";
import type { Inventory } from "@moneyworks/api/src/types/interface/tables/inventory";
import { z } from "zod";

const inventoryService = new InventoryService();

// Consolidated inventory tool schema
const inventoryToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for inventorys, get specific inventory, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The inventory sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The inventory code to retrieve (get operation only)"),
});

export const inventoryTool = {
	description: "Unified tool for inventory operations: search inventorys, get specific inventory, or list available fields",
	inputSchema: inventoryToolSchema,

	async execute(args: z.infer<typeof inventoryToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Inventory> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await inventoryService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					inventorys: result.data,
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

				const result = await inventoryService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Inventory not found`);
				}

				return {
					operation: "get",
					inventory: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { InventoryFields } = await import(
					"@moneyworks/api/src/types/interface/tables/inventory"
				);
				return {
					operation: "listFields",
					fields: InventoryFields,
					description: "Available fields for inventory queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};