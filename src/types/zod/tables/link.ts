import { z } from "zod";

// --- Link Enums ---
// No specific enums identified for the Link table itself based on the documentation.

// --- Link Schema ---

/**
 * Zod schema for the Link record.
 * Internal file name: Link
 * Represents the many-to-many relationship linking Departments to Department Groups.
 * Each record signifies that a specific Department is a member of a specific Group.
 */
export const linkZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this link record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this link record.",
    ),
  /** Last modified timestamp. The date and time that this link record was last changed (e.g., when a department was added/removed from a group). */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this link record was last changed.",
    ),
  /** The code of the Department being linked to the Group. Must be a valid Department code. Max 5 chars. */
  Dept: z
    .string()
    .max(5) // Matches Department.Code size
    .describe(
      "The code of the Department being linked to the Group. Must be a valid Department code. Max 5 chars.",
    ),
  /** The code of the Department Group the Department is linked to. Must be a valid Group code (stored in General table with 'S' prefix internally). Max 5 chars. */
  Group: z
    .string()
    .max(5) // Matches General.Code size for Groups
    .describe(
      "The code of the Department Group the Department is linked to. Must be a valid Group code (stored in General table with 'S' prefix internally). Max 5 chars.",
    ),
});

/**
 * Inferred TypeScript type from the linkZod schema.
 * Represents a fully validated Link record, associating a Department with a Group.
 */
export type LinkZod = z.infer<typeof linkZod>;

// Partial schema (less likely to be updated, typically created/deleted)
export const linkPartialSchema = linkZod.partial();

/**
 * Inferred TypeScript type from the linkPartialSchema.
 * Represents a Link record where all fields are optional.
 */
export type LinkPartialZod = z.infer<typeof linkPartialSchema>;
