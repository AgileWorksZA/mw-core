import { z } from "zod";

// --- User2 Enums ---
// No specific enums identified for the User2 table itself based on the documentation.

// --- User2 Schema ---

/**
 * Zod schema for the User2 record.
 * Internal file name: User2
 * Provides a structured table for scripts and plug-ins to store persistent data,
 * offering more field types and better key management (using DevKey + Key) than the original User table.
 */
export const user2Zod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this User2 record. (Note: Not listed in Appendix A for User2). */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this User2 record. (Note: Not listed in Appendix A for User2).",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. (Note: Not listed in Appendix A for User2). */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed. (Note: Not listed in Appendix A for User2).",
    ),
  /** Developer Key. An unsigned integer > 65535 used to namespace keys, preventing conflicts between different scripts/plug-ins. Must be pre-allocated by Cognito for distributed solutions. */
  DevKey: z
    .number()
    .min(65536) // Must be > #FFFF (65535)
    .describe(
      "Developer Key. An unsigned integer > 65535 used to namespace keys, preventing conflicts between different scripts/plug-ins. Must be pre-allocated by Cognito for distributed solutions.",
    ),
  /** Primary key (part 2) for the record, unique within a DevKey. Max 28 chars. */
  Key: z
    .string()
    .max(28) // As per Appendix A
    .describe(
      "Primary key (part 2) for the record, unique within a DevKey. Max 28 chars.",
    ),
  /** User-defined signed integer field 1. */
  Int1: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined signed integer field 1."),
  /** User-defined signed integer field 2. */
  Int2: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined signed integer field 2."),
  /** User-defined floating-point number field 1. */
  Float1: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined floating-point number field 1."),
  /** User-defined floating-point number field 2. */
  Float2: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined floating-point number field 2."),
  /** User-defined date field 1. Should be specified in YYYY-MM-DD format. */
  Date1: z
    .string()
    .nullable()
    .optional()
    .describe(
      "User-defined date field 1. Should be specified in YYYY-MM-DD format.",
    ),
  /** User-defined date field 2. Should be specified in YYYY-MM-DD format. */
  Date2: z
    .string()
    .nullable()
    .optional()
    .describe(
      "User-defined date field 2. Should be specified in YYYY-MM-DD format.",
    ),
  /** User-defined text field 1. Max 255 chars. */
  Text1: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-defined text field 1. Max 255 chars."),
  /** User-defined text field 2. Max 255 chars. */
  Text2: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-defined text field 2. Max 255 chars."),
  /** User-defined long text field. Max 1020 chars. */
  Text: z
    .string()
    .max(1020)
    .nullable()
    .optional()
    .describe("User-defined long text field. Max 1020 chars."), // Name is 'Text' in Appendix
  /** User-defined signed integer field 3. */
  Int3: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined signed integer field 3."),
  /** User-defined signed integer field 4. */
  Int4: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined signed integer field 4."),
  /** User-defined floating-point number field 3. */
  Float3: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined floating-point number field 3."),
  /** User-defined floating-point number field 4. */
  Float4: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined floating-point number field 4."),
  /** User-defined date field 3. Should be specified in YYYY-MM-DD format. */
  Date3: z
    .string()
    .nullable()
    .optional()
    .describe(
      "User-defined date field 3. Should be specified in YYYY-MM-DD format.",
    ),
  /** User-defined date field 4. Should be specified in YYYY-MM-DD format. */
  Date4: z
    .string()
    .nullable()
    .optional()
    .describe(
      "User-defined date field 4. Should be specified in YYYY-MM-DD format.",
    ),
  /** User-defined text field 3. Max 255 chars. */
  Text3: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-defined text field 3. Max 255 chars."),
  /** User-defined text field 4. Max 255 chars. */
  Text4: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-defined text field 4. Max 255 chars."),
  /** Scriptable tag storage for key-value pairs. Max 255 chars. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage for key-value pairs. Max 255 chars."),
  /** Display color index (0-7). (Note: Not listed in Appendix A for User2). */
  Colour: z
    .number()
    .min(0)
    .max(7)
    .nullable()
    .optional()
    .describe(
      "Display color index (0-7). (Note: Not listed in Appendix A for User2).",
    ),
});

/**
 * Inferred TypeScript type from the user2Zod schema.
 * Represents a fully validated User2 record for persistent script data storage.
 */
export type User2Zod = z.infer<typeof user2Zod>;

// Partial schema for updates
export const user2PartialSchema = user2Zod.partial();

/**
 * Inferred TypeScript type from the user2PartialSchema.
 * Represents a User2 record where all fields are optional.
 */
export type User2PartialZod = z.infer<typeof user2PartialSchema>;
