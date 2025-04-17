import { z } from "zod";

// --- Department Schema ---

/**
 * Zod schema for the Department record.
 * Internal file name: Department
 * Departments are used to create sub-ledgers for accounts, allowing for cost/profit center analysis.
 */
export const departmentZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this department record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this department record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The unique department code. Max 5 chars. Cannot contain '@', '?', '-'. Spaces converted to underscores. */
  Code: z
    .string()
    .max(5)
    .describe(
      "The unique department code, up to 5 alphanumeric characters. Used as suffix in departmentalised GL codes (e.g., ACCOUNT-DEPT).",
    ),
  /** The department name/description. Max 35 chars. */
  Description: z
    .string()
    .max(35)
    .describe("The department name/description, up to 35 characters."),
  /** The classification code for the department. Max 5 chars. Links to a Classification record. */
  Classification: z
    .string()
    .max(5)
    .nullable() // Classification is optional
    .optional()
    .describe(
      "The classification code for the department, used for grouping related departments. Max 5 chars.",
    ),
  /** Custom field 1 for user definition. Max 15 chars. */
  Custom1: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 1 for user definition, up to 15 characters."),
  /** Custom field 2 for user definition. Max 9 chars. */
  Custom2: z
    .string()
    .max(9)
    .nullable()
    .optional()
    .describe("Custom field 2 for user definition, up to 9 characters."),
  /** Bitmapped flags field. Includes 'Heading Only' status. */
  Flags: z
    .number()
    .describe(
      "Bitmapped flags field. Bit 0x8000: Heading Only (cannot be posted to directly).",
    ),
  /** User defined number (scriptable). */
  UserNum: z
    .number()
    .nullable()
    .optional()
    .describe("User defined number (scriptable)."),
  /** User defined text (scriptable). Max 255 chars. */
  UserText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User defined text (scriptable), up to 255 characters."),
  /** Scriptable tag storage. Max 255 chars. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage, up to 255 characters."),
});

/**
 * Inferred TypeScript type from the departmentZod schema.
 * Represents a fully validated Department record.
 */
export type DepartmentZod = z.infer<typeof departmentZod>;

// Partial schema for updates
export const departmentPartialSchema = departmentZod.partial();

/**
 * Inferred TypeScript type from the departmentPartialSchema.
 * Represents a Department record where all fields are optional.
 */
export type DepartmentPartialZod = z.infer<typeof departmentPartialSchema>;
