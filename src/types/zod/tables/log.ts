import { z } from "zod";

// --- Log Enums ---
// No specific enums identified for the Log table itself based on the documentation.

// --- Log Schema ---

/**
 * Zod schema for the Log File record.
 * Internal file name: Log
 * Stores an audit trail of major events and structural changes within the MoneyWorks document.
 */
export const logZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this log entry. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this log entry.",
    ),
  /** Timestamp of when the log entry was created. */
  LastModifiedTime: z // Documentation uses 'S' type, implying Timestamp
    .string()
    .datetime({ offset: true })
    .describe("Timestamp of when the log entry was created."),
  /** A description of the event or change that occurred. Max 63 chars. */
  Description: z
    .string()
    .max(63) // As per Appendix A, page 762
    .describe(
      "A description of the event or change that occurred. Max 63 chars.",
    ),
  /** The initials of the user who performed the action. Max 3 chars. */
  Who: z
    .string()
    .max(3) // As per Appendix A, page 762
    .describe(
      "The initials of the user who performed the action. Max 3 chars.",
    ),
  /** Additional contextual information field 1. Max 31 chars. */
  Info1: z
    .string()
    .max(31) // As per Appendix A, page 762
    .nullable()
    .optional() // Info fields might not always be populated
    .describe("Additional contextual information field 1. Max 31 chars."),
  /** Additional contextual information field 2. Max 31 chars. */
  Info2: z
    .string()
    .max(31) // As per Appendix A, page 762
    .nullable()
    .optional()
    .describe("Additional contextual information field 2. Max 31 chars."),
  /** Additional contextual information field 3. Max 31 chars. */
  Info3: z
    .string()
    .max(31) // As per Appendix A, page 762
    .nullable()
    .optional()
    .describe("Additional contextual information field 3. Max 31 chars."),
});

/**
 * Inferred TypeScript type from the logZod schema.
 * Represents a fully validated Log record.
 */
export type LogZod = z.infer<typeof logZod>;

// Partial schema (Log records are typically not updated)
export const logPartialSchema = logZod.partial();

/**
 * Inferred TypeScript type from the logPartialSchema.
 * Represents a Log record where all fields are optional.
 */
export type LogPartialZod = z.infer<typeof logPartialSchema>;
