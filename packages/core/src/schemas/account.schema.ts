/**
 * Account table schemas for MoneyWorks MCP operations
 * 
 * Provides intuitive, self-documenting schemas for account operations
 * with examples and clear parameter descriptions.
 */

import { z } from "zod";
import {
  baseOperationSchema,
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
 * Account type codes with friendly names
 */
export const accountTypeSchema = z.enum([
  "IN",  // Income
  "SA",  // Sales
  "EX",  // Expense
  "CS",  // Cost of Sales
  "CA",  // Current Asset
  "CL",  // Current Liability
  "FA",  // Fixed Asset
  "TA",  // Term Asset
  "TL",  // Term Liability
  "SF",  // Shareholder's Funds
], {
  description: "Account type code. IN=Income, EX=Expense, CA=Current Asset, CL=Current Liability, etc."
});

/**
 * Friendly account type names for better UX
 */
export const friendlyAccountTypeSchema = z.enum([
  "income",
  "sales",
  "expense",
  "cost_of_sales",
  "current_asset",
  "current_liability",
  "fixed_asset",
  "term_asset",
  "term_liability",
  "equity",
], {
  description: "Friendly account type names. Use 'income', 'expense', 'current_asset', etc."
});

/**
 * Map friendly names to MoneyWorks codes
 */
export const ACCOUNT_TYPE_MAP: Record<string, string> = {
  income: "IN",
  sales: "SA",
  expense: "EX",
  cost_of_sales: "CS",
  current_asset: "CA",
  current_liability: "CL",
  fixed_asset: "FA",
  term_asset: "TA",
  term_liability: "TL",
  equity: "SF",
  shareholder_funds: "SF",
};

/**
 * Account-specific search fields
 */
const ACCOUNT_SEARCH_FIELDS = ["Code", "Description", "Comment"];

/**
 * Simple operations that don't require parameters
 */
export const simpleAccountOperationSchema = z.enum([
  "list_all",        // List all accounts
  "count_all",       // Count total accounts
  "list_active",     // List only active accounts
  "list_inactive",   // List only inactive accounts
  "list_with_balance", // List accounts with non-zero balance
  "get_types",       // Get account type information
], {
  description: "Simple operations that don't require additional parameters"
});

/**
 * Main account operations schema
 */
export const accountOperationSchema = z.discriminatedUnion("operation", [
  // Simple list operation - no parameters needed
  z.object({
    operation: z.literal("list").describe("List accounts. Use filters to narrow results."),
    ...paginationSchema.shape,
    ...sortSchema.shape,
    ...fieldSelectionSchema.shape,
    ...statusFilterSchema.shape,
    accountType: friendlyAccountTypeSchema.optional()
      .describe("Filter by account type (e.g., 'income', 'expense', 'current_asset')"),
    withBalance: z.boolean().optional()
      .describe("Only show accounts with non-zero balance"),
    parentCode: z.string().optional()
      .describe("Filter by parent account code (for sub-accounts)"),
  }),

  // Get single account
  z.object({
    operation: z.literal("get").describe("Get a single account by code"),
    code: z.string()
      .describe("Account code to retrieve. Example: '1000' or 'BANK-CHQ'"),
    ...fieldSelectionSchema.shape,
  }),

  // Search accounts
  z.object({
    operation: z.literal("search").describe("Search accounts by text in code, description, or comment"),
    ...createSearchSchema(ACCOUNT_SEARCH_FIELDS).shape,
    ...paginationSchema.shape,
    ...sortSchema.shape,
    ...fieldSelectionSchema.shape,
    ...statusFilterSchema.shape,
    accountType: friendlyAccountTypeSchema.optional(),
    withBalance: z.boolean().optional(),
  }),

  // Count accounts
  z.object({
    operation: z.literal("count").describe("Count accounts matching criteria"),
    ...statusFilterSchema.shape,
    accountType: friendlyAccountTypeSchema.optional(),
    withBalance: z.boolean().optional(),
    filter: createFilterSchema("Optional MoneyWorks filter expression"),
  }),

  // Export accounts
  z.object({
    operation: z.literal("export").describe("Export accounts to various formats"),
    format: exportFormatSchema,
    ...statusFilterSchema.shape,
    accountType: friendlyAccountTypeSchema.optional(),
    withBalance: z.boolean().optional(),
    ...fieldSelectionSchema.shape,
    filename: z.string().optional()
      .describe("Output filename (without extension)"),
  }),

  // Get account types info
  z.object({
    operation: z.literal("types").describe("Get information about account types"),
  }),

  // Get account hierarchy
  z.object({
    operation: z.literal("hierarchy").describe("Get account hierarchy (parent-child relationships)"),
    parentCode: z.string().optional()
      .describe("Start from specific parent (omit for full hierarchy)"),
    depth: z.number().min(1).max(10).default(3)
      .describe("Maximum depth to traverse (1-10, default: 3)"),
  }),

  // Account balance summary
  z.object({
    operation: z.literal("balances").describe("Get account balances summary"),
    accountType: friendlyAccountTypeSchema.optional(),
    groupBy: z.enum(["type", "parent", "none"]).default("type")
      .describe("Group balances by type or parent account"),
    includeZero: z.boolean().default(false)
      .describe("Include accounts with zero balance"),
  }),
]).describe(createOperationDescription("Account", {
  list: "{\"operation\": \"list\", \"limit\": 10}",
  get: "{\"operation\": \"get\", \"code\": \"1000\"}",
  search: "{\"operation\": \"search\", \"query\": \"bank\"}",
  count: "{\"operation\": \"count\", \"accountType\": \"expense\"}",
  balances: "{\"operation\": \"balances\", \"groupBy\": \"type\"}",
}));

/**
 * Simplified account schemas for common operations
 */
export const getAccountSchema = z.object({
  code: z.string().describe("Account code. Example: '1000' or 'BANK-CHQ'"),
}).describe("Get a single account by its code");

export const listAccountsSchema = z.object({
  accountType: friendlyAccountTypeSchema.optional()
    .describe("Filter by type: 'income', 'expense', 'current_asset', etc."),
  activeOnly: z.boolean().default(true)
    .describe("Only show active accounts (default: true)"),
  withBalance: z.boolean().optional()
    .describe("Only show accounts with non-zero balance"),
  limit: z.number().min(1).max(1000).default(100),
}).describe("List accounts with optional filters");

export const searchAccountsSchema = z.object({
  query: z.string()
    .describe("Search text. Use '*' for all. Searches code, description, and comments."),
  accountType: friendlyAccountTypeSchema.optional(),
  limit: z.number().min(1).max(1000).default(100),
}).describe("Search accounts by text");

/**
 * Account record schema (for responses)
 */
export const accountRecordSchema = z.object({
  code: z.string(),
  description: z.string(),
  type: z.string(),
  typeDisplay: z.string().optional(),
  balance: z.number(),
  inactive: z.boolean(),
  parentAccount: z.string().optional(),
  bankAccount: z.string().optional(),
  taxCode: z.string().optional(),
  comment: z.string().optional(),
  // Add more fields as needed
});

/**
 * Response schemas
 */
export const accountListResponseSchema = z.object({
  success: z.literal(true),
  accounts: z.array(accountRecordSchema),
  count: z.number(),
  totalCount: z.number().optional(),
  hasMore: z.boolean(),
});

export const accountSingleResponseSchema = z.object({
  success: z.literal(true),
  account: accountRecordSchema,
});

export const accountTypesResponseSchema = z.object({
  success: z.literal(true),
  types: z.array(z.object({
    code: z.string(),
    name: z.string(),
    friendlyName: z.string(),
    description: z.string(),
    statementType: z.enum(["income", "balance_sheet"]),
  })),
});

/**
 * Helper to convert friendly type to MW code
 */
export function getAccountTypeCode(friendlyType: string): string {
  return ACCOUNT_TYPE_MAP[friendlyType] || friendlyType;
}

/**
 * Example operations for documentation
 */
export const ACCOUNT_OPERATION_EXAMPLES = {
  // Simple operations
  listAll: {
    operation: "list",
    description: "List all active accounts",
    example: { operation: "list" },
  },
  listFirst10: {
    operation: "list", 
    description: "List first 10 accounts",
    example: { operation: "list", limit: 10 },
  },
  getAccount: {
    operation: "get",
    description: "Get specific account",
    example: { operation: "get", code: "1000" },
  },
  
  // Filtered lists
  listIncomeAccounts: {
    operation: "list",
    description: "List all income accounts",
    example: { operation: "list", accountType: "income" },
  },
  listWithBalance: {
    operation: "list",
    description: "List accounts with balance",
    example: { operation: "list", withBalance: true },
  },
  
  // Search operations
  searchBank: {
    operation: "search",
    description: "Search for bank accounts",
    example: { operation: "search", query: "bank" },
  },
  searchAll: {
    operation: "search",
    description: "Search all accounts",
    example: { operation: "search", query: "*" },
  },
  
  // Analysis operations
  countByType: {
    operation: "count",
    description: "Count expense accounts",
    example: { operation: "count", accountType: "expense" },
  },
  getBalances: {
    operation: "balances",
    description: "Get balance summary by type",
    example: { operation: "balances", groupBy: "type" },
  },
  
  // Export operations
  exportToCSV: {
    operation: "export",
    description: "Export all accounts to CSV",
    example: { operation: "export", format: "csv" },
  },
};