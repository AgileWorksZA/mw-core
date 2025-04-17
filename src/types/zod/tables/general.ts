import { z } from "zod";

// --- General Enums ---

/**
 * Defines the type of record stored in the General table, determined by the prefix of the Code field.
 * C: Account Category - Used for grouping accounts in reports and enquiries.
 * D: Department Classification - Used for grouping departments for reporting.
 * S: Department Group - A collection of departments used to associate departments with accounts (creating subledgers).
 */
export const GeneralRecordTypeEnum = z
  .enum(["C", "D", "S"])
  .describe(`Defines the type of record stored in the General table, determined by the prefix of the Code field.
 C: Account Category - Used for grouping accounts in reports and enquiries.
 D: Department Classification - Used for grouping departments for reporting.
 S: Department Group - A collection of departments used to associate departments with accounts (creating subledgers).`);

// --- General Schema ---

/**
 * Zod schema for the General record.
 * Internal file name: General
 * This table stores Account Categories, Department Classifications, and Department Groups,
 * differentiated by a prefix character in the Code field ('C', 'D', or 'S' respectively).
 */
export const generalZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The unique code for the Category, Classification, or Group. Max 5 chars. The first character indicates the type (C, D, S). */
  Code: z
    .string()
    .max(5) // As per documentation T 5
    .describe(
      "The unique code for the Category, Classification, or Group. Max 5 chars. The first character indicates the type (C, D, S).",
    ),
  /** The description or name of the Category, Classification, or Group. Max 25 chars. */
  Description: z
    .string()
    .max(25) // As per documentation T 25
    .describe(
      "The description or name of the Category, Classification, or Group. Max 25 chars.",
    ),
  // Note: The 'Date' and 'Long' fields from the input schema are not present
  // in the Appendix A documentation for the 'General' table (page 750)
  // and have been removed for accuracy based on the provided source document.
});

/**
 * Inferred TypeScript type from the generalZod schema.
 * Represents a fully validated General (Category/Classification/Group) record.
 */
export type GeneralZod = z.infer<typeof generalZod>;

// Partial schema for potential updates
export const generalPartialSchema = generalZod.partial();

/**
 * Inferred TypeScript type from the generalPartialSchema.
 * Represents a General record where all fields are optional.
 */
export type GeneralPartialZod = z.infer<typeof generalPartialSchema>;
