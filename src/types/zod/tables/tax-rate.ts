import { z } from "zod";

// --- Tax Rate Enums ---

/**
 * Defines the fundamental type of the tax rate.
 * 0: GST/VAT - Standard Goods and Services Tax or Value Added Tax. Claimable on purchases.
 * 1: Sales Tax - Consumer tax applied at final sale, typically not claimable on purchases (expensed).
 * 2: Composite Tax - A tax calculated as a combination of other existing taxes (e.g., GST + PST).
 * 3: Reversed Tax - Tax where the recipient, not the supplier, accounts for the tax (e.g., Use Tax, VAT Reverse Charge).
 */
export const TaxRateTypeEnum = z
  .enum(["0", "1", "2", "3"])
  .describe(`Defines the fundamental type of the tax rate.
  0: GST/VAT - Standard Goods and Services Tax or Value Added Tax. Claimable on purchases.
  1: Sales Tax - Consumer tax applied at final sale, typically not claimable on purchases (expensed).
  2: Composite Tax - A tax calculated as a combination of other existing taxes (e.g., GST + PST).
  3: Reversed Tax - Tax where the recipient, not the supplier, accounts for the tax (e.g., Use Tax, VAT Reverse Charge).`);

/**
 * Defines how taxes are combined in a Composite Tax.
 * Note: Based on the 'Mult' checkbox description for Composite taxes (page 339).
 * 0: Additive - Each component tax is calculated on the base net amount and summed.
 * 1: Multiplicative - Subsequent taxes are calculated on the amount *including* previous component taxes.
 */
export const TaxRateCombineEnum = z
  .enum(["0", "1"]) // Inferred: 0 = Additive, 1 = Multiplicative
  .describe(`Defines how taxes are combined in a Composite Tax.
  0: Additive - Each component tax is calculated on the base net amount and summed.
  1: Multiplicative - Subsequent taxes are calculated on the amount *including* previous component taxes.`);

// --- Tax Rate Schema ---

/**
 * Zod schema for the Tax Rate record.
 * Internal file name: TaxRate
 * Stores definitions for tax codes, rates, associated accounts, and calculation rules.
 */
export const taxRateZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this tax rate record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this tax rate record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The unique code for the tax rate (e.g., 'G', 'E', 'PST', 'VPA'). Indexed. Max 5 chars. */
  TaxCode: z
    .string()
    .max(5)
    .describe(
      "The unique code for the tax rate (e.g., 'G', 'E', 'PST', 'VPA'). Indexed. Max 5 chars.",
    ),
  /** The GL control account code for tax paid using this rate. Max 7 chars. */
  PaidAccount: z
    .string()
    .max(7) // GL Account Code size
    .nullable()
    .optional() // May not be applicable for all tax types (e.g., pure sales tax collected)
    .describe(
      "The GL control account code for tax paid using this rate (e.g., GST/VAT Paid). Max 7 chars.",
    ),
  /** The GL control account code for tax received/collected using this rate. Max 7 chars. */
  RecAccount: z
    .string()
    .max(7) // GL Account Code size
    .nullable()
    .optional() // May not be applicable for all tax types (e.g., Use Tax paid)
    .describe(
      "The GL control account code for tax received/collected using this rate (e.g., GST/VAT Received). Max 7 chars.",
    ),
  /** The tax percentage rate used *before* the changeover date. */
  Rate1: z
    .number()
    .describe("The tax percentage rate used *before* the changeover date."),
  /** The date when the tax rate changes from Rate1 to Rate2. Should be specified in YYYY-MM-DD format. */
  Date: z
    .string()
    .nullable()
    .optional() // Optional if the rate has never changed
    .describe(
      "The date when the tax rate changes from Rate1 to Rate2. Should be specified in YYYY-MM-DD format.",
    ),
  /** The tax percentage rate used *on or after* the changeover date (current rate). */
  Rate2: z
    .number()
    .describe(
      "The tax percentage rate used *on or after* the changeover date (current rate).",
    ),
  /** Flags indicating how second-tier tax is combined in composite taxes (0=Additive, 1=Multiplicative). */
  Combine: TaxRateCombineEnum.nullable()
    .optional()
    .describe(
      "Flags indicating how second-tier tax is combined in composite taxes (0=Additive, 1=Multiplicative).",
    ),
  /** Second-tier tax rate used before changeover date (legacy PST/specific composites). */
  CombineRate1: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Second-tier tax rate used before changeover date (legacy PST/specific composites).",
    ),
  /** Second-tier tax rate used on or after changeover date (legacy PST/specific composites). */
  CombineRate2: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Second-tier tax rate used on or after changeover date (legacy PST/specific composites).",
    ),
  /** Total GST/VAT received amount reported in the last finalised tax report for this code. */
  GSTReceived: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Total GST/VAT received amount reported in the last finalised tax report for this code.",
    ),
  /** Total Net amount associated with GST/VAT received in the last finalised tax report. */
  NetReceived: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Total Net amount associated with GST/VAT received in the last finalised tax report.",
    ),
  /** Total GST/VAT paid amount reported in the last finalised tax report for this code. */
  GSTPaid: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Total GST/VAT paid amount reported in the last finalised tax report for this code.",
    ),
  /** Total Net amount associated with GST/VAT paid in the last finalised tax report. */
  NetPaid: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Total Net amount associated with GST/VAT paid in the last finalised tax report.",
    ),
  /** The description/name of the tax rate. Max 25 chars. */
  RateName: z
    .string()
    .max(25) // As per Appendix A
    .describe("The description/name of the tax rate. Max 25 chars."),
  /** Start period number of the last finalised tax report cycle this code was included in. */
  ReportCycleStart: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Start period number of the last finalised tax report cycle this code was included in.",
    ),
  /** End period number of the last finalised tax report cycle this code was included in. */
  ReportCycleEnd: z
    .number()
    .nullable()
    .optional()
    .describe(
      "End period number of the last finalised tax report cycle this code was included in.",
    ),
  /** End date of the last finalised tax report cycle this code was included in. Should be specified in YYYY-MM-DD format. */
  ReportDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "End date of the last finalised tax report cycle this code was included in. Should be specified in YYYY-MM-DD format.",
    ),
  /** PST Received amount (legacy/Canada specific). */
  PSTReceived: z
    .number()
    .nullable()
    .optional()
    .describe("PST Received amount (legacy/Canada specific)."),
  /** PST Paid amount (legacy/Canada specific). */
  PSTPaid: z
    .number()
    .nullable()
    .optional()
    .describe("PST Paid amount (legacy/Canada specific)."),
  /** Numeric type indicator for the tax rate (0=GST/VAT, 1=Sales, 2=Composite, 3=Reversed). */
  Type: TaxRateTypeEnum.describe(
    "Numeric type indicator for the tax rate (0=GST/VAT, 1=Sales, 2=Composite, 3=Reversed).",
  ),
  /** String representation of the components for a Composite tax (e.g., 'WET+G'). Max 31 chars. */
  Combination: z
    .string()
    .max(31) // As per Appendix A
    .nullable()
    .optional()
    .describe(
      "String representation of the components for a Composite tax (e.g., 'WET+G'). Max 31 chars.",
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
  /** Alias code used for mapping this tax code in specific country guides or online filing. Max 3 chars. */
  AliasCode: z
    .string()
    .max(3) // As per Appendix A
    .nullable()
    .optional()
    .describe(
      "Alias code used for mapping this tax code in specific country guides or online filing. Max 3 chars.",
    ),
  /** Country code associated with the AliasCode mapping. Max 3 chars. */
  AliasCountry: z
    .string()
    .max(3) // As per Appendix A
    .nullable()
    .optional()
    .describe(
      "Country code associated with the AliasCode mapping. Max 3 chars.",
    ),
  /** Rate used for Reversed tax calculations before the changeover date. */
  ReversedRate1: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Rate used for Reversed tax calculations before the changeover date.",
    ),
  /** Rate used for Reversed tax calculations on or after the changeover date. */
  ReversedRate2: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Rate used for Reversed tax calculations on or after the changeover date.",
    ),
  /** Bitmapped flags field. Bit 0 (value 1): Tax is 100% (All Tax). */
  Flags: z
    .number()
    .describe("Bitmapped flags field. Bit 0 (value 1): Tax is 100% (All Tax)."),
});

/**
 * Inferred TypeScript type from the taxRateZod schema.
 * Represents a fully validated Tax Rate record.
 */
export type TaxRateZod = z.infer<typeof taxRateZod>;

// Partial schema for updates
export const taxRatePartialSchema = taxRateZod.partial();

/**
 * Inferred TypeScript type from the taxRatePartialSchema.
 * Represents a TaxRate record where all fields are optional.
 */
export type TaxRatePartialZod = z.infer<typeof taxRatePartialSchema>;
