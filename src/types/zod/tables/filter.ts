import { z } from "zod";

// --- Filter Enums ---

/**
 * Defines the file/table to which the filter applies.
 * Note: These are common table names; the actual numeric value stored might differ.
 * Using strings here for clarity in the absence of documented numeric codes for this context.
 */
export const FilterFileEnum = z
  .enum([
    "Transaction",
    "Account",
    "Name",
    "Product", // Represents Items table
    "Job",
    "JobSheet",
    "Detail", // Represents Detail Line Items
    // Add other potential filterable tables if known
  ])
  .describe("The MoneyWorks internal table name to which this filter applies.");

/**
 * Defines the type of filter.
 * Note: Numeric values are used, but specific meanings aren't documented in Appendix A.
 * Common types relate to how the filter is applied (e.g., preset, user-prompted).
 * 0 might represent a standard filter, others could indicate specific behaviors.
 */
// Using number for now as specific enum values are not documented here.
// export const FilterTypeEnum = z.enum([...]);

// --- Filter Schema ---

/**
 * Zod schema for the Filter record.
 * Internal file name: Filter
 * Stores user-defined list filters for various MoneyWorks list windows.
 */
export const filterZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this filter record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this filter record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** Numeric code representing the internal file/table the filter applies to. */
  File: z
    .number() // Represented as number in provided schema, map to enum if codes known
    .describe(
      "Numeric code representing the internal file/table the filter applies to (e.g., Transaction, Account). See FilterFileEnum for typical targets.",
    ),
  /** Numeric code representing the Tab Set (e.g., 'View by Status', 'View by Type') for tabbed lists like Transactions. 0 if not applicable. */
  TabSet: z
    .number()
    .describe(
      "Numeric code representing the Tab Set (e.g., 'View by Status', 'View by Type') for tabbed lists like Transactions. 0 if not applicable.",
    ),
  /** Numeric code representing the specific Tab within a Tab Set the filter applies to (e.g., 'All', 'Invoices', 'Payments'). 0 for all tabs in the set or if not applicable. */
  Tab: z
    .number()
    .describe(
      "Numeric code representing the specific Tab within a Tab Set the filter applies to (e.g., 'All', 'Invoices', 'Payments'). 0 for all tabs in the set or if not applicable.",
    ),
  /** Numeric code representing the type or behavior of the filter (e.g., simple filter, preset search, ask for code). */
  Type: z
    .number()
    .describe(
      "Numeric code representing the type or behavior of the filter (e.g., simple filter, preset search, ask for code).",
    ),
  /** User initials identifying the user who owns this filter. Filters are user-specific. Max 3 chars. */
  User: z
    .string()
    .max(3) // Standard user initials size
    .describe(
      "User initials identifying the user who owns this filter. Filters are user-specific. Max 3 chars.",
    ),
  /** The name of the filter as it appears in the filter dropdown menu. Max 63 chars (educated guess based on other descriptions). */
  Name: z
    .string()
    .max(63) // Assuming a reasonable max length
    .describe(
      "The name of the filter as it appears in the filter dropdown menu.",
    ),
  /** The MoneyWorks search expression defining the filter criteria. Max 1024 chars (educated guess). */
  FilterFunction: z
    .string()
    .max(1024) // Assuming a generous max length
    .describe("The MoneyWorks search expression defining the filter criteria."),
  /** The display order of the filter within the dropdown menu for the user. */
  Order: z
    .number()
    .describe(
      "The display order of the filter within the dropdown menu for the user.",
    ),
});

/**
 * Inferred TypeScript type from the filterZod schema.
 * Represents a fully validated Filter record.
 */
export type FilterZod = z.infer<typeof filterZod>;

// Partial schema for potential updates
export const filterPartialSchema = filterZod.partial();

/**
 * Inferred TypeScript type from the filterPartialSchema.
 * Represents a Filter record where all fields are optional.
 */
export type FilterPartialZod = z.infer<typeof filterPartialSchema>;
