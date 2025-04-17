import { z } from "zod";

// --- Login Enums ---
// No specific enums identified for the Login table itself based on the documentation.

// --- Login Schema ---

/**
 * Zod schema for the Login File record.
 * Internal file name: Login
 * Stores user login credentials, privileges, roles, and settings for accessing a MoneyWorks document.
 */
export const loginZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this user/login record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this user/login record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The user's unique initials (up to 3 characters). Used for logging in and tracking record changes. Indexed. */
  Initials: z
    .string()
    .max(3) // As per Appendix A, page 762
    .describe(
      "The user's unique initials (up to 3 characters). Used for logging in and tracking record changes. Indexed.",
    ),
  /** The full name of the user or role. Max 31 chars. */
  Name: z
    .string()
    .max(31) // As per Appendix A, page 762
    .describe("The full name of the user or role. Max 31 chars."),
  /** The user's password (stored encrypted). Can be empty if no password is set. Max 33 chars (encrypted length). */
  Password: z
    .string()
    .max(33) // As per Appendix A, page 762
    .nullable()
    .optional()
    .describe(
      "The user's password (stored encrypted). Can be empty if no password is set. Max 33 chars (encrypted length).",
    ),
  /** The security level assigned to the user (0-5 stars), controlling access to sensitive accounts/transactions. */
  SecurityLevel: z
    .number()
    .min(0)
    .max(5) // Security levels are 0 to 5 stars
    .describe(
      "The security level assigned to the user (0-5 stars), controlling access to sensitive accounts/transactions.",
    ),
  /** A map representing the user's specific privileges if not assigned a Role. Max 65 chars (internal representation). */
  Privileges: z
    .string()
    .max(65) // As per Appendix A, page 762
    .nullable()
    .optional() // Might be null if a Role is assigned instead
    .describe(
      "A map representing the user's specific privileges if not assigned a Role. Max 65 chars (internal representation).",
    ),
  /** The user's email address. Max 63 chars. */
  Email: z
    .string()
    .max(63) // As per Appendix A, page 762
    .email() // Added email validation
    .nullable()
    .optional()
    .describe("The user's email address. Max 63 chars."),
  /** Bitmapped flags field. Bit 0: Is a Role definition; Bit 1: Is Read Only user; Bit 3: User is logged in via MoneyWorks Now. */
  Flags: z
    .number()
    .describe(
      "Bitmapped flags field. Bit 0: Is a Role definition; Bit 1: Is Read Only user; Bit 3: User is logged in via MoneyWorks Now.",
    ),
  /** User-defined category for grouping or classifying users/roles. Max 31 chars. */
  Category: z
    .string()
    .max(31) // As per Appendix A, page 762
    .nullable()
    .optional()
    .describe(
      "User-defined category for grouping or classifying users/roles. Max 31 chars.",
    ),
  /** The name of the Role assigned to this user (if applicable). Max 31 chars (matches Login.Name size). */
  Role: z
    .string()
    .max(31) // Matching Login.Name size
    .nullable()
    .optional() // User might have direct privileges instead of a role
    .describe(
      "The name of the Role assigned to this user (if applicable). Max 31 chars.",
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
  /** Internal field potentially used by scripts like CopyUserSettings. Not in Appendix A. */
  SettingsDonor: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Internal field potentially used by scripts like CopyUserSettings. Not in Appendix A.",
    ),
});

/**
 * Inferred TypeScript type from the loginZod schema.
 * Represents a fully validated Login (User/Role) record.
 */
export type LoginZod = z.infer<typeof loginZod>;

// Partial schema for updates
export const loginPartialSchema = loginZod.partial();

/**
 * Inferred TypeScript type from the loginPartialSchema.
 * Represents a Login record where all fields are optional.
 */
export type LoginPartialZod = z.infer<typeof loginPartialSchema>;
