import { z } from "zod";

// --- Stickies Enums ---

/**
 * Defines the type of file/table the sticky note is attached to.
 * Note: Numeric values are inferred, documentation doesn't explicitly list them for the Stickies table.
 * Common targets for sticky notes are Transaction, Name, Account, Product, Job.
 * Assuming 0=Transaction, 1=Name, 2=Account, 3=Product, 4=Job (adjust if specific codes are known).
 */
export const StickyFileNumEnum = z
  .enum([
    "0", // Transaction
    "1", // Name
    "2", // Account
    "3", // Product (Item)
    "4", // Job
  ])
  .describe(`Defines the type of file/table the sticky note is attached to.
  0: Transaction
  1: Name
  2: Account
  3: Product (Item)
  4: Job`);

/**
 * Defines the display conditions for the sticky note, typically controlled via flags.
 * Bit 0 (Value 1): Display When Selling
 * Bit 1 (Value 2): Display When Buying
 * Bit 2 (Value 4): Display When Opening Record
 * (These are interpretations based on the UI shown on page 87).
 */
// Representing flags as a number, description explains common bits.
// export const StickyFlagsEnum = z.enum([...]);

// --- Stickies Schema ---

/**
 * Zod schema for the Sticky Note record.
 * Internal file name: Stickies (Assumed)
 * Stores sticky notes attached to other records (Transactions, Names, Accounts, Products, Jobs).
 */
export const stickiesZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this sticky note record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this sticky note record.",
    ),
  /** Last modified timestamp. The date and time that this sticky note was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this sticky note was last changed.",
    ),
  /** Numeric code indicating the file/table the sticky note is attached to (e.g., Transaction, Name). */
  FileNum: z
    .number() // Kept as number, description references inferred enum values
    .describe(
      "Numeric code indicating the file/table the sticky note is attached to (e.g., 0=Transaction, 1=Name, 2=Account, 3=Product, 4=Job).",
    ),
  /** Display color index for the sticky note (0-7). */
  Colour: z
    .number()
    .min(0)
    .max(7)
    .describe("Display color index for the sticky note (0-7)."),
  /** User initials (up to 3 chars) who created/last modified the sticky note. */
  User: z
    .string()
    .max(3) // Standard user initials size
    .describe(
      "User initials (up to 3 chars) who created/last modified the sticky note.",
    ),
  /** Sequence number of the owner record (in the table specified by FileNum) to which this sticky note is attached. */
  OwnerSeq: z
    .number()
    .positive()
    .describe(
      "Sequence number of the owner record (in the table specified by FileNum) to which this sticky note is attached.",
    ),
  /** The text content of the sticky note message. Max 255 chars (assumed). */
  Message: z
    .string()
    .max(255) // Assuming standard text length
    .describe(
      "The text content of the sticky note message. Max 255 chars (assumed).",
    ),
  /** Bitmapped flags determining when the sticky note is displayed (e.g., on sale, on purchase, on open). */
  Flags: z
    .number()
    .describe(
      "Bitmapped flags determining when the sticky note is displayed (e.g., Bit 0: Display When Selling, Bit 1: Display When Buying, Bit 2: Display When Opening Record).",
    ),
});

/**
 * Inferred TypeScript type from the stickiesZod schema.
 * Represents a fully validated Sticky Note record.
 */
export type StickiesZod = z.infer<typeof stickiesZod>;

// Partial schema for potential updates (e.g., changing the message or flags)
export const stickiesPartialSchema = stickiesZod.partial();

/**
 * Inferred TypeScript type from the stickiesPartialSchema.
 * Represents a Stickies record where all fields are optional.
 */
export type StickiesPartialZod = z.infer<typeof stickiesPartialSchema>;
