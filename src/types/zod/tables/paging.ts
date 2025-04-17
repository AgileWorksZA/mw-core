import { z } from "zod";

/**
 * Zod schema for representing full pagination state, often returned by APIs.
 */
export const pagingSchema = z.object({
  /** The total number of records available across all pages. */
  total: z
    .number()
    .nonnegative() // Total cannot be negative
    .describe("The total number of records available across all pages."),
  /** The maximum number of records requested or returned per page. */
  limit: z
    .number()
    .positive() // Limit should generally be positive
    .describe("The maximum number of records requested or returned per page."),
  /** The starting index (0-based) of the records returned in the current page. */
  offset: z
    .number()
    .nonnegative() // Offset cannot be negative
    .describe(
      "The starting index (0-based) of the records returned in the current page.",
    ),
  /** The offset for the next page of results, or null/undefined if this is the last page. */
  next: z
    .number()
    .positive() // Next offset should be positive if it exists
    .nullable() // Can be null or absent on the last page
    .optional()
    .describe(
      "The offset for the next page of results, or null/undefined if this is the last page.",
    ),
  /** The offset for the previous page of results, or null/undefined if this is the first page. */
  prev: z
    .number()
    .nonnegative() // Previous offset can be 0
    .nullable() // Can be null or absent on the first page
    .optional()
    .describe(
      "The offset for the previous page of results, or null/undefined if this is the first page.",
    ),
});

/**
 * Zod schema often used for *requesting* a specific page of data.
 */
export const pagingSelectionSchema = z.object({
  /** The maximum number of records requested per page. */
  limit: z
    .number()
    .positive() // Limit should generally be positive
    .describe("The maximum number of records requested per page."),
  /** The starting index (0-based) for the requested page of records. */
  offset: z
    .number()
    .nonnegative() // Offset cannot be negative
    .describe(
      "The starting index (0-based) for the requested page of records.",
    ),
});

/**
 * Inferred TypeScript type from the pagingSchema.
 * Represents the full pagination state.
 */
export type PagingSchema = z.infer<typeof pagingSchema>;

/**
 * Inferred TypeScript type from the pagingSelectionSchema.
 * Represents the parameters used to request a specific page.
 */
export type PagingSelectionSchema = z.infer<typeof pagingSelectionSchema>; // Added type export for consistency
