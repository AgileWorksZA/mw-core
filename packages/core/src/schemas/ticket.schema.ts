/**
 * Ticket/Error logging schemas for MoneyWorks MCP
 * 
 * Used for tracking errors, issues, and improvement suggestions
 */

import { z } from "zod";
import { paginationSchema, createOperationDescription } from "./base.schema";

/**
 * Ticket type
 */
export const ticketTypeSchema = z.enum([
  "error",
  "bug",
  "feature_request",
  "improvement",
  "question"
], {
  description: "Type of ticket/issue"
});

/**
 * Ticket severity
 */
export const ticketSeveritySchema = z.enum([
  "low",
  "medium", 
  "high",
  "critical"
], {
  description: "Issue severity"
});

/**
 * Ticket status
 */
export const ticketStatusSchema = z.enum([
  "open",
  "resolved",
  "ignored"
], {
  description: "Ticket status"
});

/**
 * Main ticket operations schema
 */
export const ticketOperationSchema = z.discriminatedUnion("operation", [
  // Create/log ticket
  z.object({
    operation: z.literal("create").describe("Log a new ticket/issue"),
    type: ticketTypeSchema.default("error"),
    severity: ticketSeveritySchema.default("medium"),
    tool: z.string()
      .describe("Tool/operation where issue occurred. Example: 'account_operations'"),
    operation: z.string().optional()
      .describe("Specific operation. Example: 'search'"),
    error: z.string()
      .describe("Error message or issue description"),
    context: z.any().optional()
      .describe("Additional context (request params, stack trace, etc.)"),
    suggestion: z.string().optional()
      .describe("Suggested fix or improvement"),
  }),

  // List tickets
  z.object({
    operation: z.literal("list").describe("List logged tickets"),
    ...paginationSchema.shape,
    status: ticketStatusSchema.optional()
      .describe("Filter by status"),
    type: ticketTypeSchema.optional()
      .describe("Filter by type"),
    severity: ticketSeveritySchema.optional()
      .describe("Filter by severity"),
    tool: z.string().optional()
      .describe("Filter by tool name"),
    sortBy: z.enum(["created_at", "severity", "tool"]).default("created_at"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),

  // Get single ticket
  z.object({
    operation: z.literal("get").describe("Get ticket details"),
    id: z.number()
      .describe("Ticket ID"),
  }),

  // Update ticket status
  z.object({
    operation: z.literal("update").describe("Update ticket status"),
    id: z.number()
      .describe("Ticket ID"),
    status: ticketStatusSchema
      .describe("New status"),
    resolution: z.string().optional()
      .describe("Resolution notes"),
  }),

  // Get statistics
  z.object({
    operation: z.literal("stats").describe("Get ticket statistics"),
    groupBy: z.enum(["status", "type", "severity", "tool"]).optional()
      .describe("Group statistics by field"),
    includeTrends: z.boolean().default(false)
      .describe("Include trend data"),
  }),

  // Search tickets
  z.object({
    operation: z.literal("search").describe("Search tickets by text"),
    query: z.string()
      .describe("Search in error messages and context"),
    ...paginationSchema.shape,
    status: ticketStatusSchema.optional(),
  }),
]).describe(createOperationDescription("Ticket/Error Logging", {
  create: "{\"operation\": \"create\", \"type\": \"error\", \"tool\": \"account_operations\", \"error\": \"Invalid filter expression\"}",
  list: "{\"operation\": \"list\", \"status\": \"open\", \"limit\": 10}",
  stats: "{\"operation\": \"stats\", \"groupBy\": \"tool\"}",
  update: "{\"operation\": \"update\", \"id\": 123, \"status\": \"resolved\"}",
}));

/**
 * Simplified ticket creation schema
 */
export const logErrorSchema = z.object({
  tool: z.string().describe("Tool where error occurred"),
  error: z.string().describe("Error message"),
  context: z.any().optional().describe("Error context/details"),
}).describe("Log an error for improvement tracking");

export const logFeatureRequestSchema = z.object({
  tool: z.string().describe("Tool to improve"),
  feature: z.string().describe("Feature description"),
  useCase: z.string().optional().describe("Example use case"),
}).describe("Log a feature request");

/**
 * Ticket record schema
 */
export const ticketRecordSchema = z.object({
  id: z.number(),
  type: ticketTypeSchema,
  severity: ticketSeveritySchema,
  status: ticketStatusSchema,
  tool: z.string(),
  operation: z.string().optional(),
  error: z.string(),
  context: z.any().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  resolution: z.string().optional(),
});

/**
 * Statistics schema
 */
export const ticketStatsSchema = z.object({
  total: z.number(),
  open: z.number(),
  resolved: z.number(),
  ignored: z.number(),
  byType: z.record(z.number()).optional(),
  bySeverity: z.record(z.number()).optional(),
  byTool: z.record(z.number()).optional(),
  trends: z.object({
    daily: z.array(z.object({
      date: z.string(),
      count: z.number(),
    })).optional(),
    topErrors: z.array(z.object({
      error: z.string(),
      count: z.number(),
      lastOccurred: z.string(),
    })).optional(),
  }).optional(),
});

/**
 * Response schemas
 */
export const ticketCreateResponseSchema = z.object({
  success: z.literal(true),
  ticket: ticketRecordSchema,
  message: z.string().optional(),
});

export const ticketListResponseSchema = z.object({
  success: z.literal(true),
  tickets: z.array(ticketRecordSchema),
  count: z.number(),
  totalCount: z.number(),
  hasMore: z.boolean(),
});

export const ticketStatsResponseSchema = z.object({
  success: z.literal(true),
  stats: ticketStatsSchema,
  period: z.string().optional(),
});

/**
 * Example operations
 */
export const TICKET_OPERATION_EXAMPLES = {
  // Logging examples
  logError: {
    operation: "create",
    description: "Log an error",
    example: {
      operation: "create",
      type: "error",
      tool: "account_operations",
      error: "Invalid filter expression: Balance>'abc'",
      context: { filter: "Balance>'abc'" }
    },
  },
  logFeature: {
    operation: "create",
    description: "Request a feature",
    example: {
      operation: "create",
      type: "feature_request",
      tool: "transaction_operations",
      error: "Add bulk update capability",
      suggestion: "Allow updating multiple transactions at once"
    },
  },
  
  // Viewing examples
  listOpen: {
    operation: "list",
    description: "List open tickets",
    example: { operation: "list", status: "open", limit: 20 },
  },
  getStats: {
    operation: "stats",
    description: "Get ticket statistics",
    example: { operation: "stats", groupBy: "tool", includeTrends: true },
  },
  
  // Management examples
  resolveTicket: {
    operation: "update",
    description: "Resolve a ticket",
    example: {
      operation: "update",
      id: 123,
      status: "resolved",
      resolution: "Fixed in version 2.1"
    },
  },
};