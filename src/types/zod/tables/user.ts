import { z } from "zod";

// --- User Enums ---
// No specific enums identified for the User table itself based on the documentation.

// --- User Schema ---

/**
 * Zod schema for the User File record.
 * Internal file name: User
 * Provides a simple key-value store for scripts and plug-ins to persist data.
 * Note: Limited key length (9 chars) and single data field (245 chars).
 * For more structured or larger storage, consider the User2 table.
 */
export const userZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this user data record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this user data record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The unique key identifying this data record, defined by the script/plug-in. Indexed. Max 9 chars. */
  Key: z
    .string()
    .max(9) // As per Appendix A, page 762
    .describe(
      "The unique key identifying this data record, defined by the script/plug-in. Indexed. Max 9 chars.",
    ),
  /** The text data associated with the Key. Max 245 chars. */
  Data: z
    .string()
    .max(245) // As per Appendix A, page 762
    .describe("The text data associated with the Key. Max 245 chars."),
});

/**
 * Inferred TypeScript type from the userZod schema.
 * Represents a fully validated User File record.
 */
export type UserZod = z.infer<typeof userZod>;

// Partial schema for potential updates
export const userPartialSchema = userZod.partial();

/**
 * Inferred TypeScript type from the userPartialSchema.
 * Represents a User record where all fields are optional.
 */
export type UserPartialZod = z.infer<typeof userPartialSchema>;
