/**
 * Type definitions and interfaces for data validation
 * (Note: This package uses pure TypeScript types instead of runtime validation)
 */

// Common type definitions
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
