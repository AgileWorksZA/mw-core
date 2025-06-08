import { PaymentsService } from "@moneyworks/api/src/services/tables/payments.service";
import type { Payments } from "@moneyworks/api/src/types/interface/tables/payments";
import { z } from "zod";

const paymentService = new PaymentsService();

// Consolidated payment tool schema
const paymentToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for payments, get specific payment, or list available fields",
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
		.describe("The payment sequence number to retrieve (get operation only)"),
	invoiceId: z
		.number()
		.optional()
		.describe("The invoice ID to retrieve payments for (get operation only)"),
});

export const paymentTool = {
	description:
		"Unified tool for payment operations: search payments, get specific payment, or list available fields",
	inputSchema: paymentToolSchema,

	async execute(args: z.infer<typeof paymentToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Payments> = {};

				// Build search criteria
				if (args.query) {
					// Search by invoice ID (convert string to number if needed)
					const invoiceId = parseInt(args.query);
					if (!isNaN(invoiceId)) {
						search.InvoiceID = invoiceId;
					}
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
				// Try sequence number first, then invoiceId
				let searchCriteria;
				if (args.sequenceNumber) {
					searchCriteria = { SequenceNumber: args.sequenceNumber };
				} else if (args.invoiceId) {
					searchCriteria = { InvoiceID: args.invoiceId };
				} else {
					throw new Error(
						"Either sequenceNumber or invoiceId is required for get operation",
					);
				}

				const result = await paymentService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Payment not found");
				}

				return {
					operation: "get",
					payment: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { PaymentsFields } = await import(
					"@moneyworks/api/src/types/interface/tables/payments"
				);
				return {
					operation: "listFields",
					fields: PaymentsFields,
					description: "Available fields for payment queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
