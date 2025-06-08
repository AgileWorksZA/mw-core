import { TransactionService } from "@moneyworks/api/src/services/tables/transaction.service";
import type { Transaction } from "@moneyworks/api/src/types/interface/tables/transaction";
import { z } from "zod";

const transactionService = new TransactionService();

// Transaction type codes
const transactionTypes = {
	// Sales/Income types
	SI: "Sales Invoice",
	SC: "Sales Credit",
	SR: "Sales Receipt",
	SD: "Sales Deposit",
	// Purchase/Expense types
	PI: "Purchase Invoice",
	PC: "Purchase Credit",
	PP: "Purchase Payment",
	PD: "Purchase Deposit",
	// Journal types
	JN: "Journal",
	JC: "Journal Correction",
	// Bank types
	BR: "Bank Receipt",
	BP: "Bank Payment",
	BT: "Bank Transfer",
	// Other
	ST: "Stock Transfer",
	SO: "Sales Order",
	PO: "Purchase Order",
} as const;

type TransactionTypeCode = keyof typeof transactionTypes;

// Transaction status codes
const transactionStatuses = {
	OP: "Open",
	CL: "Closed",
	PA: "Partial",
	CA: "Cancelled",
	DR: "Draft",
} as const;

type TransactionStatusCode = keyof typeof transactionStatuses;

// Consolidated transaction tool schema
const transactionToolSchema = z.object({
	operation: z
		.enum(["search", "get", "getByRef", "listFields", "summary"])
		.describe(
			"The operation to perform: search transactions, get by sequence number, get by reference, list fields, or get summary",
		),

	// Search operation parameters
	query: z
		.string()
		.optional()
		.describe(
			"Search query for reference, description, or name (search operation only)",
		),
	type: z
		.enum([
			"SI",
			"SC",
			"SR",
			"SD",
			"PI",
			"PC",
			"PP",
			"PD",
			"JN",
			"JC",
			"BR",
			"BP",
			"BT",
			"ST",
			"SO",
			"PO",
		] as const)
		.optional()
		.describe(
			"Transaction type: SI=Sales Invoice, SC=Sales Credit, SR=Sales Receipt, SD=Sales Deposit, PI=Purchase Invoice, PC=Purchase Credit, PP=Purchase Payment, PD=Purchase Deposit, JN=Journal, JC=Journal Correction, BR=Bank Receipt, BP=Bank Payment, BT=Bank Transfer, ST=Stock Transfer, SO=Sales Order, PO=Purchase Order (search/summary operations)",
		),
	status: z
		.enum(["OP", "CL", "PA", "CA", "DR"] as const)
		.optional()
		.describe(
			"Transaction status: OP=Open, CL=Closed, PA=Partial, CA=Cancelled, DR=Draft (search operation only)",
		),
	nameCode: z
		.string()
		.optional()
		.describe("Customer/Supplier code filter (search/summary operations)"),
	fromDate: z
		.string()
		.optional()
		.describe(
			"Filter transactions from this date (YYYY-MM-DD) (search/summary operations)",
		),
	toDate: z
		.string()
		.optional()
		.describe(
			"Filter transactions up to this date (YYYY-MM-DD) (search/summary operations)",
		),
	period: z
		.number()
		.optional()
		.describe("Accounting period filter (search operation only)"),
	minAmount: z
		.number()
		.optional()
		.describe("Minimum transaction amount (search operation only)"),
	maxAmount: z
		.number()
		.optional()
		.describe("Maximum transaction amount (search operation only)"),
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
		.describe(
			"The transaction sequence number to retrieve (get operation only)",
		),
	reference: z
		.string()
		.optional()
		.describe(
			"The transaction reference (OurRef) to retrieve (getByRef operation only)",
		),
});

export const transactionTool = {
	description:
		"Unified tool for transaction operations: search, get by sequence/reference, list fields, or get summary",
	inputSchema: transactionToolSchema,

	async execute(args: z.infer<typeof transactionToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Transaction> = {};

				// Build search criteria
				if (args.query) {
					// This might need to be adjusted based on API capabilities
					search.OurRef = args.query;
				}

				if (args.type) {
					search.Type = args.type;
				}

				if (args.status) {
					search.Status = args.status;
				}

				if (args.nameCode) {
					search.NameCode = args.nameCode;
				}

				if (args.period) {
					search.Period = args.period;
				}

				// Execute search using the existing service
				const result = await transactionService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				// Post-process for date and amount filtering if needed
				let filteredData = result.data;

				if (args.fromDate || args.toDate) {
					filteredData = filteredData.filter((trans) => {
						const transDate = new Date(trans.TransDate);
						if (args.fromDate && transDate < new Date(args.fromDate))
							return false;
						if (args.toDate && transDate > new Date(args.toDate)) return false;
						return true;
					});
				}

				if (args.minAmount !== undefined || args.maxAmount !== undefined) {
					filteredData = filteredData.filter((trans) => {
						if (args.minAmount !== undefined && trans.Gross < args.minAmount)
							return false;
						if (args.maxAmount !== undefined && trans.Gross > args.maxAmount)
							return false;
						return true;
					});
				}

				return {
					operation: "search",
					transactions: filteredData,
					total: result.pagination?.total || filteredData.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				if (!args.sequenceNumber) {
					throw new Error("sequenceNumber is required for get operation");
				}

				const result = await transactionService.getData({
					search: { SequenceNumber: args.sequenceNumber },
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Transaction not found: ${args.sequenceNumber}`);
				}

				return {
					operation: "get",
					transaction: result.data[0],
				};
			}

			case "getByRef": {
				if (!args.reference) {
					throw new Error("reference is required for getByRef operation");
				}

				const result = await transactionService.getData({
					search: { OurRef: args.reference },
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(
						`Transaction not found with reference: ${args.reference}`,
					);
				}

				return {
					operation: "getByRef",
					transaction: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the transaction service
				const { TransactionFields } = await import(
					"@moneyworks/api/src/types/interface/tables/transaction"
				);
				return {
					operation: "listFields",
					fields: TransactionFields,
					description: "Available fields for transaction queries and filters",
					types: Object.entries(transactionTypes).map(([code, desc]) => ({
						code,
						description: desc,
					})),
					statuses: Object.entries(transactionStatuses).map(([code, desc]) => ({
						code,
						description: desc,
					})),
				};
			}

			case "summary": {
				const search: Partial<Transaction> = {};

				if (args.nameCode) {
					search.NameCode = args.nameCode;
				}

				if (args.type) {
					search.Type = args.type;
				}

				// Fetch all matching transactions
				const result = await transactionService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: 1000, // Get more records for summary
					offset: 0,
				});

				// Filter by date if needed
				let transactions = result.data;
				if (args.fromDate || args.toDate) {
					transactions = transactions.filter((trans) => {
						const transDate = new Date(trans.TransDate);
						if (args.fromDate && transDate < new Date(args.fromDate))
							return false;
						if (args.toDate && transDate > new Date(args.toDate)) return false;
						return true;
					});
				}

				// Calculate summaries
				const summary = {
					operation: "summary",
					totalCount: transactions.length,
					byType: {} as Record<string, { count: number; total: number }>,
					byStatus: {} as Record<string, { count: number; total: number }>,
					grandTotal: 0,
					outstandingTotal: 0,
				};

				for (const trans of transactions) {
					// By type
					if (!summary.byType[trans.Type]) {
						summary.byType[trans.Type] = { count: 0, total: 0 };
					}
					summary.byType[trans.Type].count++;
					summary.byType[trans.Type].total += trans.Gross;

					// By status
					if (!summary.byStatus[trans.Status]) {
						summary.byStatus[trans.Status] = { count: 0, total: 0 };
					}
					summary.byStatus[trans.Status].count++;
					summary.byStatus[trans.Status].total += trans.Gross;

					// Totals
					summary.grandTotal += trans.Gross;
					if (trans.Status === "OP" || trans.Status === "PA") {
						const outstanding = trans.Gross - trans.AmtPaid;
						summary.outstandingTotal += outstanding;
					}
				}

				return summary;
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
