import { PaymentService } from "@moneyworks/api/src/services/tables/payment.service";
import type { Payment } from "@moneyworks/api/src/types/interface/tables/payment";
import { z } from "zod";

const paymentService = new PaymentService();

// Consolidated payment tool schema
const paymentToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for payments, get specific payment, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The payment sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The payment code to retrieve (get operation only)"),
});

export const paymentTool = {
	description: "Unified tool for payment operations: search payments, get specific payment, or list available fields",
	inputSchema: paymentToolSchema,

	async execute(args: z.infer<typeof paymentToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Payment> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await paymentService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					payments: result.data,
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

				const result = await paymentService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Payment not found`);
				}

				return {
					operation: "get",
					payment: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { PaymentFields } = await import(
					"@moneyworks/api/src/types/interface/tables/payment"
				);
				return {
					operation: "listFields",
					fields: PaymentFields,
					description: "Available fields for payment queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};