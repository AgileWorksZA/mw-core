import { z } from "zod";

// --- Asset Category Enums ---

/**
 * Defines the possible depreciation methods for an asset category.
 * SL: Straight Line depreciation. Depreciates evenly over the asset's life.
 * DV: Diminishing Value depreciation. Depreciates by a fixed percentage of the remaining book value each year.
 */
export const DepreciationMethodEnum = z
  .enum(["SL", "DV"])
  .describe(`Defines the possible depreciation methods for an asset category.
  SL: Straight Line depreciation. Depreciates evenly over the asset's life.
  DV: Diminishing Value depreciation. Depreciates by a fixed percentage of the remaining book value each year.`);

// --- Asset Category Schema ---

export const assetCatZod = z.object({
  /** Unsigned long sequence number (indexed) */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for the asset category record.",
    ),
  /** Last modified timestamp */
  LastModifiedTime: z
    .string()
    .nullable() // Assuming this might not always be populated on creation?
    .optional()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** Unique code for the category */
  Code: z
    .string()
    .max(7)
    .describe("Unique code for the category, up to 7 characters."),
  /** Description of category */
  Description: z
    .string()
    .max(63)
    .describe("Description of category, up to 63 characters."),
  /** The fixed asset general ledger account code */
  AssetAccount: z
    .string()
    .max(13) // Account codes can have department suffixes
    .describe(
      "The fixed asset general ledger account code used for assets in this category.",
    ),
  /** Depreciation expense general ledger account code */
  DepExpense: z
    .string()
    .max(13)
    .describe("Depreciation expense general ledger account code."),
  /** Accumulated depreciation general ledger account code */
  AccumDep: z
    .string()
    .max(13)
    .describe(
      "Accumulated depreciation general ledger account code (must be a Fixed Asset type).",
    ),
  /** General ledger account code for gain/loss on asset disposal */
  GainLoss: z
    .string()
    .max(13)
    .describe(
      "General ledger account code for gain/loss on asset disposal (Income or Expense type).",
    ),
  /** Custom field for user definition */
  Custom: z
    .string()
    .max(39) // Documentation size for Category.Custom field (though AssetCat doesn't explicitly list size, using related field size)
    .nullable()
    .optional()
    .describe("Custom field for user definition, up to 39 characters."),
  /** Group code for user-defined grouping */
  Group: z
    .string()
    .max(7) // Documentation size for Category.Group field
    .nullable()
    .optional()
    .describe("Group code for user-defined grouping, up to 7 characters."),
  /** Default depreciation type for assets in this category */
  Type: DepreciationMethodEnum.describe(
    "Default depreciation type for assets in this category: SL (Straight Line) or DV (Diminishing Value).",
  ),
  /** Expense account for asset impairment (downward revaluations) */
  Impairment: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "An expense account for asset impairment (when assets are revalued down).",
    ),
  /** Default depreciation rate percentage */
  Rate: z
    .number()
    .describe("Default annual depreciation rate percentage for this category."),
  /** Equity account for revaluation surplus (upward revaluations) */
  RevalSurplus: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "An equity (shareholder funds) account for upwards asset revaluations.",
    ),
  /** Account for the private use portion of gain/loss on disposal */
  GainLossPrivate: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "Account for the private use portion of gain/loss on asset disposal.",
    ),
  /** Account for the private use portion of depreciation expense */
  DepExpensePrivate: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe("Account for the private use portion of depreciation expense."),
  /** User defined number (scriptable) */
  UserNum: z
    .number()
    .nullable()
    .optional()
    .describe("User defined number (scriptable)."),
  /** User defined text (scriptable) */
  UserText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User defined text (scriptable), up to 255 characters."),
  /** Date of last depreciation run for this category */
  LastDepreciatedDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Date of last depreciation run for this category. Should be specified in YYYY-MM-DD format.",
    ),
  /** Scriptable tag storage */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage, up to 255 characters."),
  /** Bitmapped flags field */
  Flags: z
    .number()
    .describe(
      "Bitmapped flags field. Flag 0x01: Assets can have personal/private use. Flag 0x02: Calculate depreciation on a daily basis.",
    ),
});

/**
 * Inferred TypeScript type from the assetCatZod schema.
 * Represents a fully validated Asset Category record.
 */
export type AssetCatZod = z.infer<typeof assetCatZod>;

export const assetCatPartialSchema = assetCatZod.partial();

/**
 * Inferred TypeScript type from the assetCatPartialSchema.
 * Represents an Asset Category record where all fields are optional.
 */
export type AssetCatPartialZod = z.infer<typeof assetCatPartialSchema>;
