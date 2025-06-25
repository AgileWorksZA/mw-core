/**
 * Base schemas and utilities for MoneyWorks MCP operations
 * 
 * These schemas are designed to be:
 * 1. Self-documenting with clear descriptions
 * 2. Provide examples in descriptions
 * 3. Have sensible defaults
 * 4. Be progressively complex (simple operations first)
 */

import { z } from "zod";

/**
 * Common operation types across all tables
 */
export const baseOperationSchema = z.enum([
  "list",      // Simple list all records
  "get",       // Get single record by ID
  "search",    // Search with filters
  "count",     // Count records
  "export",    // Export to different formats
], {
  description: "Operation to perform. Start with 'list' to see all records."
});

/**
 * Pagination schema used across all list operations
 */
export const paginationSchema = z.object({
  limit: z.number()
    .min(1)
    .max(1000)
    .default(100)
    .describe("Maximum number of records to return (1-1000, default: 100)"),
  offset: z.number()
    .min(0)
    .default(0)
    .describe("Number of records to skip (for pagination, default: 0)"),
}).describe("Pagination options for list operations");

/**
 * Common sort options
 */
export const sortSchema = z.object({
  orderBy: z.string()
    .optional()
    .describe("Field to sort by (e.g., 'Code', 'Name', 'Date'). Add ' DESC' for reverse order."),
  sortDirection: z.enum(["ASC", "DESC"])
    .optional()
    .default("ASC")
    .describe("Sort direction (ASC or DESC)"),
}).describe("Sorting options");

/**
 * Export format options
 */
export const exportFormatSchema = z.enum([
  "json",
  "csv", 
  "xml",
  "tab"
], {
  description: "Export format. JSON is easiest to work with."
}).default("json");

/**
 * Field selection schema
 */
export const fieldSelectionSchema = z.object({
  fields: z.array(z.string())
    .optional()
    .describe("Specific fields to return. Leave empty for all fields. Example: ['Code', 'Name', 'Balance']"),
  exclude: z.array(z.string())
    .optional()
    .describe("Fields to exclude from results. Example: ['ModTime', 'ModUser']"),
}).describe("Control which fields are returned");

/**
 * Date range schema for filtering
 */
export const dateRangeSchema = z.object({
  fromDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe("Start date in YYYY-MM-DD format. Example: '2024-01-01'"),
  toDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe("End date in YYYY-MM-DD format. Example: '2024-12-31'"),
}).describe("Date range for filtering records");

/**
 * Common status filters
 */
export const statusFilterSchema = z.object({
  includeInactive: z.boolean()
    .default(false)
    .describe("Include inactive/disabled records (default: false - active only)"),
  onlyInactive: z.boolean()
    .default(false)
    .describe("Show only inactive records (default: false)"),
}).describe("Filter by active/inactive status");

/**
 * Create a success response schema
 */
export function createSuccessSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    count: z.number().optional().describe("Number of records returned"),
    totalCount: z.number().optional().describe("Total records available"),
    hasMore: z.boolean().optional().describe("Whether more records exist"),
  });
}

/**
 * Error response schema
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().describe("Error message"),
  code: z.string().optional().describe("Error code"),
  details: z.any().optional().describe("Additional error details"),
});

/**
 * Create operation-specific examples
 */
export const OPERATION_EXAMPLES = {
  list: "List all records: {\"operation\": \"list\"}",
  get: "Get by ID: {\"operation\": \"get\", \"code\": \"1000\"}",
  search: "Search records: {\"operation\": \"search\", \"query\": \"bank\"}",
  count: "Count records: {\"operation\": \"count\"}",
  export: "Export to CSV: {\"operation\": \"export\", \"format\": \"csv\"}",
};

/**
 * Helper to create operation description with examples
 */
export function createOperationDescription(
  tableName: string,
  examples: Record<string, string>
): string {
  const exampleList = Object.entries(examples)
    .map(([op, ex]) => `• ${op}: ${ex}`)
    .join("\n");
    
  return `Operations for ${tableName} table.\n\nExamples:\n${exampleList}`;
}

/**
 * Create a standard search schema for any table
 */
export function createSearchSchema(searchableFields: string[]) {
  return z.object({
    query: z.string()
      .min(1)
      .describe(`Search text. Searches in: ${searchableFields.join(", ")}. Use "*" for all records.`),
    searchIn: z.array(z.string())
      .optional()
      .describe(`Specific fields to search in. Default: ${JSON.stringify(searchableFields)}`),
    exactMatch: z.boolean()
      .default(false)
      .describe("Require exact match instead of partial match (default: false)"),
  }).describe("Search options");
}

/**
 * Helper to create a filter schema with MoneyWorks expression support
 */
export function createFilterSchema(description: string = "MoneyWorks filter expression") {
  return z.string()
    .optional()
    .describe(`${description}. Examples: 'Balance>0', 'Type="IN"', 'Code~"1"'`);
}