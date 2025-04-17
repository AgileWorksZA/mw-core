import { z } from "zod";

// --- Memo Enums ---
// No specific enums identified for the Memo table itself based on the documentation.

// --- Memo Schema ---

/**
 * Zod schema for the Memo File record.
 * Internal file name: Memo
 * Stores contact history memos and recall dates associated with Name records (customers, suppliers, etc.).
 * This table is a subfile of the Name table.
 */
export const memoZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this memo record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this memo record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The sequence number of the parent Name record to which this memo belongs. */
  NameSeq: z
    .number()
    .positive()
    .describe(
      "The sequence number of the parent Name record (Name.SequenceNumber) to which this memo belongs.",
    ),
  /** The display order of this memo within the list for the parent Name record. */
  Order: z
    .number()
    .describe(
      "The display order of this memo within the list for the parent Name record.",
    ),
  /** The date the memo was created or the contact occurred. Should be specified in YYYY-MM-DD format. */
  Date: z
    .string()
    .describe(
      "The date the memo was created or the contact occurred. Should be specified in YYYY-MM-DD format.",
    ),
  /** The date for a follow-up reminder. If set, a reminder appears in MoneyWorks on or after this date. Should be specified in YYYY-MM-DD format. */
  RecallDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "The date for a follow-up reminder. If set, a reminder appears in MoneyWorks on or after this date. Should be specified in YYYY-MM-DD format.",
    ),
  /** Bitmapped flags field (usage not explicitly detailed in appendix). */
  Flags: z
    .number()
    .describe(
      "Bitmapped flags field (usage not explicitly detailed in appendix).",
    ),
  /** The text content of the memo. Max 255 chars. */
  Text: z
    .string()
    .max(255) // As per Appendix A, page 760
    .nullable()
    .optional() // A memo might just be a recall date with no text
    .describe("The text content of the memo. Max 255 chars."),
});

/**
 * Inferred TypeScript type from the memoZod schema.
 * Represents a fully validated Memo record.
 */
export type MemoZod = z.infer<typeof memoZod>;

// Partial schema for potential updates (e.g., clearing RecallDate)
export const memoPartialSchema = memoZod.partial();

/**
 * Inferred TypeScript type from the memoPartialSchema.
 * Represents a Memo record where all fields are optional.
 */
export type MemoPartialZod = z.infer<typeof memoPartialSchema>;
