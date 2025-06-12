/**
 * MoneyWorks MCP Schemas
 * 
 * Comprehensive, self-documenting schemas for all MCP operations.
 * These schemas are designed to work with the MCP SDK and provide
 * clear parameter documentation and examples.
 * 
 * Usage in MCP tools:
 * ```typescript
 * import { accountOperationSchema } from "@moneyworks/core/schemas";
 * 
 * server.tool(
 *   "account_operations",
 *   "Account operations", 
 *   accountOperationSchema,
 *   async (params) => {
 *     const input = accountOperationSchema.parse(params);
 *     // ... handle operation
 *   }
 * );
 * ```
 */

// Base schemas and utilities
export * from "./base.schema";

// Table operation schemas
export * from "./account.schema";
export * from "./transaction.schema";
export * from "./name.schema";
export * from "./build.schema";

// System operation schemas
export * from "./core.schema";
export * from "./ticket.schema";

// Legacy type for backward compatibility
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
