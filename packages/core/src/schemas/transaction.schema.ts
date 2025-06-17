/**
 * Transaction table schemas for MoneyWorks MCP operations
 * 
 * Handles invoices, bills, payments, receipts, journals, etc.
 */

import { z } from "zod";
import {
  paginationSchema,
  sortSchema,
  exportFormatSchema,
  fieldSelectionSchema,
  dateRangeSchema,
  createSearchSchema,
  createFilterSchema,
  createOperationDescription,
} from "./base.schema";

/**
 * Transaction types in MoneyWorks
 */
export const transactionTypeSchema = z.enum([
  "CP", // Creditor Payment
  "CR", // Creditor Invoice
  "CC", // Creditor Credit
  "DP", // Debtor Receipt
  "DI", // Debtor Invoice
  "DC", // Debtor Credit
  "JL", // Journal
  "SO", // Sales Order
  "PO", // Purchase Order
], {
  description: "Transaction type code. DI=Sales Invoice, CR=Purchase Invoice, DP=Customer Receipt, CP=Supplier Payment, JL=Journal"
});

/**
 * Friendly transaction type names
 */
export const friendlyTransactionTypeSchema = z.enum([
  "sales_invoice",
  "sales_credit",
  "sales_receipt",
  "purchase_invoice",
  "purchase_credit",
  "purchase_payment",
  "journal",
  "sales_order",
  "purchase_order",
], {
  description: "Friendly transaction type names"
});

/**
 * Transaction status
 */
export const transactionStatusSchema = z.enum([
  "posted",
  "unposted",
  "all"
], {
  description: "Transaction posting status"
});

/**
 * Map friendly names to MW codes
 */
export const TRANSACTION_TYPE_MAP: Record<string, string> = {
  sales_invoice: "DI",
  sales_credit: "DC",
  sales_receipt: "DP",
  purchase_invoice: "CR",
  purchase_credit: "CC",
  purchase_payment: "CP",
  journal: "JL",
  sales_order: "SO",
  purchase_order: "PO",
};

/**
 * Transaction search fields
 */
const TRANSACTION_SEARCH_FIELDS = ["OurRef", "TheirRef", "NameCode", "Description", "Particulars"];

/**
 * Main transaction operations schema
 */
export const transactionOperationSchema = z.discriminatedUnion("operation", [
  // List transactions
  z.object({
    operation: z.literal("list").describe("List transactions with optional filters"),
    ...paginationSchema.shape,
    ...sortSchema.shape,
    ...fieldSelectionSchema.shape,
    ...dateRangeSchema.shape,
    transactionType: friendlyTransactionTypeSchema.optional()
      .describe("Filter by transaction type"),
    status: transactionStatusSchema.default("all")
      .describe("Filter by posting status"),
    nameCode: z.string().optional()
      .describe("Filter by customer/supplier code"),
    account: z.string().optional()
      .describe("Filter by account code"),
  }),

  // Get single transaction
  z.object({
    operation: z.literal("get").describe("Get a transaction by sequence number"),
    sequenceNumber: z.number()
      .describe("Transaction sequence number"),
    ...fieldSelectionSchema.shape,
  }),

  // Search transactions
  z.object({
    operation: z.literal("search").describe("Search transactions by text"),
    ...createSearchSchema(TRANSACTION_SEARCH_FIELDS).shape,
    ...paginationSchema.shape,
    ...sortSchema.shape,
    ...fieldSelectionSchema.shape,
    ...dateRangeSchema.shape,
    transactionType: friendlyTransactionTypeSchema.optional(),
    status: transactionStatusSchema.default("all"),
  }),

  // Count transactions
  z.object({
    operation: z.literal("count").describe("Count transactions matching criteria"),
    ...dateRangeSchema.shape,
    transactionType: friendlyTransactionTypeSchema.optional(),
    status: transactionStatusSchema.default("all"),
    nameCode: z.string().optional(),
    filter: createFilterSchema(),
  }),

  // Get outstanding invoices
  z.object({
    operation: z.literal("outstanding").describe("Get outstanding (unpaid) invoices"),
    type: z.enum(["sales", "purchases", "all"]).default("all")
      .describe("Type of invoices to retrieve"),
    nameCode: z.string().optional()
      .describe("Filter by specific customer/supplier"),
    asOfDate: z.string().optional()
      .describe("Calculate outstanding as of this date (YYYY-MM-DD)"),
    ...paginationSchema.shape,
    ...sortSchema.shape,
  }),

  // Get transaction totals/summary
  z.object({
    operation: z.literal("summary").describe("Get transaction summary/totals"),
    ...dateRangeSchema.shape,
    groupBy: z.enum(["type", "name", "account", "period", "day", "week", "month"])
      .default("type")
      .describe("Group summary by"),
    transactionType: friendlyTransactionTypeSchema.optional(),
    status: transactionStatusSchema.default("posted"),
  }),

  // Export transactions
  z.object({
    operation: z.literal("export").describe("Export transactions"),
    format: exportFormatSchema,
    ...dateRangeSchema.shape,
    transactionType: friendlyTransactionTypeSchema.optional(),
    status: transactionStatusSchema.default("all"),
    ...fieldSelectionSchema.shape,
    filename: z.string().optional(),
  }),

  // Get by reference
  z.object({
    operation: z.literal("find").describe("Find transaction by reference"),
    reference: z.string()
      .describe("Our reference or their reference to search for"),
    referenceType: z.enum(["our", "their", "both"]).default("both")
      .describe("Which reference field to search"),
  }),

  // Recent transactions
  z.object({
    operation: z.literal("recent").describe("Get recent transactions"),
    days: z.number().min(1).max(365).default(30)
      .describe("Number of days to look back (default: 30)"),
    transactionType: friendlyTransactionTypeSchema.optional(),
    ...paginationSchema.shape,
  }),
]).describe(createOperationDescription("Transaction", {
  list: "{\"operation\": \"list\", \"fromDate\": \"2024-01-01\", \"limit\": 20}",
  get: "{\"operation\": \"get\", \"sequenceNumber\": 12345}",
  search: "{\"operation\": \"search\", \"query\": \"ABC Corp\"}",
  outstanding: "{\"operation\": \"outstanding\", \"type\": \"sales\"}",
  recent: "{\"operation\": \"recent\", \"days\": 7}",
  summary: "{\"operation\": \"summary\", \"groupBy\": \"type\"}",
}));

/**
 * Simplified schemas for common operations
 */
export const getTransactionSchema = z.object({
  sequenceNumber: z.number().describe("Transaction sequence number"),
}).describe("Get a transaction by its sequence number");

export const listTransactionsSchema = z.object({
  fromDate: z.string().optional()
    .describe("Start date (YYYY-MM-DD)"),
  toDate: z.string().optional()
    .describe("End date (YYYY-MM-DD)"), 
  type: friendlyTransactionTypeSchema.optional()
    .describe("Transaction type filter"),
  postedOnly: z.boolean().default(false)
    .describe("Only show posted transactions"),
  limit: z.number().min(1).max(1000).default(100),
}).describe("List transactions with date and type filters");

export const findInvoiceSchema = z.object({
  invoiceNumber: z.string()
    .describe("Invoice number to find"),
  type: z.enum(["sales", "purchase"]).optional()
    .describe("Invoice type (sales or purchase)"),
}).describe("Find invoice by number");

/**
 * Transaction record schema
 */
export const transactionRecordSchema = z.object({
  sequenceNumber: z.number(),
  transDate: z.string(),
  transType: z.string(),
  typeDisplay: z.string().optional(),
  status: z.string(),
  ourRef: z.string().optional(),
  theirRef: z.string().optional(),
  nameCode: z.string().optional(),
  description: z.string().optional(),
  gross: z.number(),
  net: z.number(),
  tax: z.number(),
  outstanding: z.number().optional(),
  period: z.number(),
  // Add more fields as needed
});

/**
 * Outstanding invoice schema
 */
export const outstandingInvoiceSchema = z.object({
  sequenceNumber: z.number(),
  transDate: z.string(),
  dueDate: z.string().optional(),
  nameCode: z.string(),
  nameDisplay: z.string().optional(),
  ourRef: z.string(),
  gross: z.number(),
  outstanding: z.number(),
  daysOverdue: z.number().optional(),
});

/**
 * Transaction summary schema
 */
export const transactionSummarySchema = z.object({
  group: z.string(),
  count: z.number(),
  gross: z.number(),
  net: z.number(),
  tax: z.number(),
  outstanding: z.number().optional(),
});

/**
 * Response schemas
 */
export const transactionListResponseSchema = z.object({
  success: z.literal(true),
  transactions: z.array(transactionRecordSchema),
  count: z.number(),
  totalCount: z.number().optional(),
  hasMore: z.boolean(),
  totals: z.object({
    gross: z.number(),
    net: z.number(),
    tax: z.number(),
  }).optional(),
});

export const transactionSingleResponseSchema = z.object({
  success: z.literal(true),
  transaction: transactionRecordSchema,
  details: z.array(z.any()).optional(), // Transaction details/lines
});

export const outstandingResponseSchema = z.object({
  success: z.literal(true),
  invoices: z.array(outstandingInvoiceSchema),
  count: z.number(),
  totalOutstanding: z.number(),
  byAge: z.object({
    current: z.number(),
    days30: z.number(),
    days60: z.number(),
    days90: z.number(),
    older: z.number(),
  }).optional(),
});

/**
 * Example operations
 */
export const TRANSACTION_OPERATION_EXAMPLES = {
  // Basic operations
  listRecent: {
    operation: "recent",
    description: "List transactions from last 7 days",
    example: { operation: "recent", days: 7 },
  },
  getTransaction: {
    operation: "get",
    description: "Get specific transaction",
    example: { operation: "get", sequenceNumber: 12345 },
  },
  
  // Filtered lists
  listSalesInvoices: {
    operation: "list",
    description: "List sales invoices for current month",
    example: { 
      operation: "list", 
      transactionType: "sales_invoice",
      fromDate: "2024-01-01",
      toDate: "2024-01-31"
    },
  },
  
  // Outstanding
  outstandingSales: {
    operation: "outstanding",
    description: "Get unpaid sales invoices",
    example: { operation: "outstanding", type: "sales" },
  },
  
  // Search
  findByReference: {
    operation: "find",
    description: "Find by invoice number",
    example: { operation: "find", reference: "INV-001" },
  },
  searchCustomer: {
    operation: "search",
    description: "Search transactions for a customer",
    example: { operation: "search", query: "ABC Corp" },
  },
  
  // Analysis
  monthlySummary: {
    operation: "summary",
    description: "Get monthly transaction summary",
    example: { 
      operation: "summary", 
      groupBy: "month",
      fromDate: "2024-01-01",
      toDate: "2024-12-31"
    },
  },
};