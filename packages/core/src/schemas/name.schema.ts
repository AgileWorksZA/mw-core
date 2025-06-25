/**
 * Name table schemas for MoneyWorks MCP operations
 * 
 * Handles customers, suppliers, and other contacts
 */

import { z } from "zod";
import {
  paginationSchema,
  sortSchema,
  exportFormatSchema,
  fieldSelectionSchema,
  statusFilterSchema,
  createSearchSchema,
  createFilterSchema,
  createOperationDescription,
} from "./base.schema";

/**
 * Name type (customer/supplier/both)
 */
export const nameTypeSchema = z.enum([
  "customer",
  "supplier", 
  "both",
  "other"
], {
  description: "Contact type: customer, supplier, both, or other"
});

/**
 * Credit status
 */
export const creditStatusSchema = z.enum([
  "good",
  "warning",
  "hold",
  "all"
], {
  description: "Credit status filter"
});

/**
 * Name search fields
 */
const NAME_SEARCH_FIELDS = ["Code", "Name", "Contact", "Email", "Phone", "Address1", "Comment"];

/**
 * Main name operations schema
 */
export const nameOperationSchema = z.discriminatedUnion("operation", [
  // List names
  z.object({
    operation: z.literal("list").describe("List contacts/names"),
    ...paginationSchema.shape,
    ...sortSchema.shape,
    ...fieldSelectionSchema.shape,
    ...statusFilterSchema.shape,
    type: nameTypeSchema.optional()
      .describe("Filter by contact type"),
    withBalance: z.boolean().optional()
      .describe("Only show contacts with outstanding balance"),
    onHold: z.boolean().optional()
      .describe("Filter by credit hold status"),
  }),

  // Get single name
  z.object({
    operation: z.literal("get").describe("Get a contact by code"),
    code: z.string()
      .describe("Contact code. Example: 'CUST001' or 'ABC-CORP'"),
    includeTransactions: z.boolean().default(false)
      .describe("Include recent transactions"),
    includeContacts: z.boolean().default(false)
      .describe("Include additional contact records"),
    ...fieldSelectionSchema.shape,
  }),

  // Search names
  z.object({
    operation: z.literal("search").describe("Search contacts by text"),
    ...createSearchSchema(NAME_SEARCH_FIELDS).shape,
    ...paginationSchema.shape,
    ...sortSchema.shape,
    ...fieldSelectionSchema.shape,
    ...statusFilterSchema.shape,
    type: nameTypeSchema.optional(),
  }),

  // Count names
  z.object({
    operation: z.literal("count").describe("Count contacts"),
    ...statusFilterSchema.shape,
    type: nameTypeSchema.optional(),
    withBalance: z.boolean().optional(),
    onHold: z.boolean().optional(),
    filter: createFilterSchema(),
  }),

  // Get balances
  z.object({
    operation: z.literal("balances").describe("Get customer/supplier balances"),
    type: nameTypeSchema.default("both")
      .describe("Customer, supplier, or both"),
    onlyWithBalance: z.boolean().default(true)
      .describe("Only show contacts with balance"),
    includeCredit: z.boolean().default(true)
      .describe("Include credit limit information"),
    ...paginationSchema.shape,
    ...sortSchema.shape,
  }),

  // Credit check
  z.object({
    operation: z.literal("credit").describe("Check credit status"),
    code: z.string().optional()
      .describe("Specific contact code (omit for all)"),
    includeAvailable: z.boolean().default(true)
      .describe("Calculate available credit"),
    warningThreshold: z.number().min(0).max(100).default(80)
      .describe("Warning when credit used exceeds this percentage"),
  }),

  // Export names
  z.object({
    operation: z.literal("export").describe("Export contacts"),
    format: exportFormatSchema,
    type: nameTypeSchema.optional(),
    ...statusFilterSchema.shape,
    ...fieldSelectionSchema.shape,
    filename: z.string().optional(),
  }),

  // Find by email/phone
  z.object({
    operation: z.literal("find").describe("Find contact by email or phone"),
    email: z.string().email().optional()
      .describe("Email address to search for"),
    phone: z.string().optional()
      .describe("Phone number to search for"),
    exact: z.boolean().default(false)
      .describe("Require exact match"),
  }),

  // Mailing list
  z.object({
    operation: z.literal("mailing").describe("Get mailing list"),
    type: nameTypeSchema.optional(),
    tags: z.array(z.string()).optional()
      .describe("Filter by tags/categories"),
    excludeNoEmail: z.boolean().default(false)
      .describe("Exclude contacts without email"),
    format: z.enum(["json", "csv"]).default("json"),
  }),

  // Statement/aging
  z.object({
    operation: z.literal("aging").describe("Get aged receivables/payables"),
    type: z.enum(["customer", "supplier"]).default("customer"),
    asOfDate: z.string().optional()
      .describe("Calculate aging as of date (YYYY-MM-DD)"),
    periods: z.array(z.number()).default([30, 60, 90])
      .describe("Aging periods in days"),
    onlyOverdue: z.boolean().default(false),
  }),
]).describe(createOperationDescription("Name/Contact", {
  list: "{\"operation\": \"list\", \"type\": \"customer\"}",
  get: "{\"operation\": \"get\", \"code\": \"CUST001\"}",
  search: "{\"operation\": \"search\", \"query\": \"smith\"}",
  balances: "{\"operation\": \"balances\", \"type\": \"customer\"}",
  credit: "{\"operation\": \"credit\", \"code\": \"CUST001\"}",
  aging: "{\"operation\": \"aging\", \"type\": \"customer\"}",
}));

/**
 * Simplified schemas
 */
export const getContactSchema = z.object({
  code: z.string().describe("Contact code. Example: 'CUST001'"),
}).describe("Get a contact by code");

export const listContactsSchema = z.object({
  type: nameTypeSchema.optional()
    .describe("Filter by type: customer, supplier, both"),
  activeOnly: z.boolean().default(true),
  limit: z.number().min(1).max(1000).default(100),
}).describe("List contacts with optional filters");

export const searchContactsSchema = z.object({
  query: z.string()
    .describe("Search text. Searches name, email, phone, address"),
  type: nameTypeSchema.optional(),
  limit: z.number().min(1).max(1000).default(100),
}).describe("Search contacts by text");

/**
 * Name/Contact record schema
 */
export const nameRecordSchema = z.object({
  code: z.string(),
  name: z.string(),
  contact: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  address3: z.string().optional(),
  address4: z.string().optional(),
  postcode: z.string().optional(),
  customerType: z.boolean(),
  supplierType: z.boolean(),
  balance: z.number().optional(),
  creditLimit: z.number().optional(),
  discount: z.number().optional(),
  taxNumber: z.string().optional(),
  comment: z.string().optional(),
  hold: z.boolean(),
  inactive: z.boolean(),
});

/**
 * Balance summary schema
 */
export const balanceSummarySchema = z.object({
  code: z.string(),
  name: z.string(),
  balance: z.number(),
  creditLimit: z.number(),
  creditUsed: z.number(),
  creditAvailable: z.number(),
  isOverLimit: z.boolean(),
  percentUsed: z.number(),
  hold: z.boolean(),
});

/**
 * Aging bucket schema
 */
export const agingBucketSchema = z.object({
  code: z.string(),
  name: z.string(),
  current: z.number(),
  period1: z.number(), // e.g., 1-30 days
  period2: z.number(), // e.g., 31-60 days
  period3: z.number(), // e.g., 61-90 days
  older: z.number(),   // e.g., >90 days
  total: z.number(),
});

/**
 * Response schemas
 */
export const nameListResponseSchema = z.object({
  success: z.literal(true),
  contacts: z.array(nameRecordSchema),
  count: z.number(),
  totalCount: z.number().optional(),
  hasMore: z.boolean(),
});

export const nameSingleResponseSchema = z.object({
  success: z.literal(true),
  contact: nameRecordSchema,
  transactions: z.array(z.any()).optional(),
  contacts: z.array(z.any()).optional(),
});

export const balancesResponseSchema = z.object({
  success: z.literal(true),
  balances: z.array(balanceSummarySchema),
  count: z.number(),
  totals: z.object({
    totalBalance: z.number(),
    totalCredit: z.number(),
    totalOverLimit: z.number(),
    countOnHold: z.number(),
  }),
});

export const agingResponseSchema = z.object({
  success: z.literal(true),
  aging: z.array(agingBucketSchema),
  count: z.number(),
  totals: z.object({
    current: z.number(),
    period1: z.number(),
    period2: z.number(), 
    period3: z.number(),
    older: z.number(),
    total: z.number(),
  }),
  periods: z.array(z.string()),
});

/**
 * Example operations
 */
export const NAME_OPERATION_EXAMPLES = {
  // Basic operations
  listCustomers: {
    operation: "list",
    description: "List all customers",
    example: { operation: "list", type: "customer" },
  },
  getContact: {
    operation: "get",
    description: "Get specific contact",
    example: { operation: "get", code: "CUST001" },
  },
  
  // Search operations
  searchByName: {
    operation: "search",
    description: "Search contacts by name",
    example: { operation: "search", query: "smith" },
  },
  findByEmail: {
    operation: "find",
    description: "Find contact by email",
    example: { operation: "find", email: "john@example.com" },
  },
  
  // Balance operations
  customerBalances: {
    operation: "balances",
    description: "Get customer balances",
    example: { operation: "balances", type: "customer" },
  },
  creditCheck: {
    operation: "credit",
    description: "Check credit status",
    example: { operation: "credit", code: "CUST001" },
  },
  
  // Reporting
  agedReceivables: {
    operation: "aging",
    description: "Get aged receivables",
    example: { operation: "aging", type: "customer" },
  },
  mailingList: {
    operation: "mailing",
    description: "Get customer mailing list",
    example: { operation: "mailing", type: "customer", excludeNoEmail: true },
  },
};