import { z } from "zod";

// --- Lists Enums ---
// No specific enums identified for the Lists table itself based on the documentation.

// --- Lists Schema ---

/**
 * Zod schema for the Lists record.
 * Internal file name: Lists
 * Stores the individual items within user-defined Validation Lists used for custom dropdowns and choices.
 */
export const listsZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this list item record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this list item record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The identifier of the Validation List to which this item belongs. Max 15 chars. */
  ListID: z
    .string()
    .max(15) // Based on Item field size, often used for list identifiers
    .describe(
      "The identifier of the Validation List to which this item belongs. Max 15 chars.",
    ),
  /** The actual value or code of the list item. Max 15 chars. */
  Item: z
    .string()
    .max(15) // As per documentation on page 84
    .describe("The actual value or code of the list item. Max 15 chars."),
  /** The description associated with the list item, displayed in choices lists. Max 255 chars (assumed). */
  Comment: z // Corresponds to 'Description' field in UI (page 84)
    .string()
    .max(255) // Assuming standard description length
    .nullable()
    .optional()
    .describe(
      "The description associated with the list item, displayed in choices lists. Max 255 chars (assumed).",
    ),
  /** User-defined numeric field (scriptable). */
  UserNum: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined numeric field (scriptable)."),
  /** User-defined text field (scriptable). Max 255 chars. */
  UserText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-defined text field (scriptable). Max 255 chars."),
  /** Scriptable tag storage for key-value pairs. Max 255 chars. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage for key-value pairs. Max 255 chars."),
});

/**
 * Inferred TypeScript type from the listsZod schema.
 * Represents a fully validated Lists (Validation List Item) record.
 */
export type ListsZod = z.infer<typeof listsZod>;

// Partial schema for potential updates
export const listsPartialSchema = listsZod.partial();

/**
 * Inferred TypeScript type from the listsPartialSchema.
 * Represents a Lists record where all fields are optional.
 */
export type ListsPartialZod = z.infer<typeof listsPartialSchema>;
