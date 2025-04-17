import { z } from "zod";

// --- Asset Log Enums ---

/**
 * Defines the type of action recorded in the asset log.
 * AA: Acquisition - Initial purchase or bringing the asset into the register.
 * AD: Disposal - Full disposal (sale or write-off) of the asset.
 * AP: Part Disposal - Disposal of a portion of a grouped asset (e.g., selling some chairs from a set).
 * DS: Straight Line Depreciation - Depreciation calculated using the straight-line method.
 * DD: Diminishing Value Depreciation - Depreciation calculated using the diminishing value method.
 * ME: Memo - A user-entered memo related to the asset.
 * RV: Revaluation - An adjustment to the asset's value (up or down).
 */
export const AssetLogActionEnum = z
  .enum(["AA", "AD", "AP", "DS", "DD", "ME", "RV"])
  .describe(`Defines the type of action recorded in the asset log.
  AA: Acquisition - Initial purchase or bringing the asset into the register.
  AD: Disposal - Full disposal (sale or write-off) of the asset.
  AP: Part Disposal - Disposal of a portion of a grouped asset (e.g., selling some chairs from a set).
  DS: Straight Line Depreciation - Depreciation calculated using the straight-line method.
  DD: Diminishing Value Depreciation - Depreciation calculated using the diminishing value method.
  ME: Memo - A user-entered memo related to the asset.
  RV: Revaluation - An adjustment to the asset's value (up or down).`);

// --- Asset Log Schema ---

export const assetLogZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for the asset log entry. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for the asset log entry.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** Sequence number of the parent asset record. */
  ParentSeq: z
    .number()
    .positive()
    .describe(
      "Sequence number of the parent asset record (Asset.SequenceNumber).",
    ),
  /** Type of action recorded. */
  Action: AssetLogActionEnum.describe(
    "Type of action recorded (e.g., Acquisition, Disposal, Depreciation).",
  ),
  /** Date of the action. Should be specified in YYYY-MM-DD format. */
  Date: z
    .string()
    .describe("Date of the action. Should be specified in YYYY-MM-DD format."),
  /** Quantity involved in the action (e.g., quantity disposed). */
  Qty: z
    .number()
    .nullable()
    .optional()
    .describe("Quantity involved in the action (e.g., quantity disposed)."),
  /** Depreciation amount calculated or applied in this action. */
  Depreciation: z
    .number()
    .nullable()
    .optional()
    .describe("Depreciation amount calculated or applied in this action."),
  /** Adjustment 1 amount (specific usage depends on action type). */
  Adjustment1: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Adjustment 1 amount (specific usage depends on action type). Potentially used in revaluations or complex disposals.",
    ),
  /** Adjustment 2 amount (specific usage depends on action type). */
  Adjustment2: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Adjustment 2 amount (specific usage depends on action type). Potentially used in revaluations or complex disposals.",
    ),
  /** Depreciation rate used for this action (if applicable). */
  Rate: z
    .number()
    .nullable()
    .optional()
    .describe("Depreciation rate used for this action (if applicable)."),
  /** Private use percentage at the time of this action. */
  PrivateUsePercent: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .describe("Private use percentage at the time of this action."),
  /** Accumulated depreciation *after* this action. */
  AccumDepreciation: z
    .number()
    .describe("Accumulated depreciation *after* this action."),
  /** Accumulated revaluation surplus/impairment *after* this action. */
  AccumReval: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Accumulated revaluation surplus/impairment *after* this action.",
    ),
  /** Book value of the asset *after* this action. */
  ClosingValue: z
    .number()
    .describe("Book value of the asset *after* this action."),
  /** Sequence number of the related MoneyWorks transaction (e.g., purchase invoice, disposal journal). */
  TransactionSeq: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe(
      "Sequence number of the related MoneyWorks transaction (e.g., purchase invoice, disposal journal).",
    ),
  /** User-entered memo for this specific log entry. Max 255 chars. */
  Memo: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-entered memo for this specific log entry. Max 255 chars."),
});

/**
 * Inferred TypeScript type from the assetLogZod schema.
 * Represents a fully validated Asset Log record.
 */
export type AssetLogZod = z.infer<typeof assetLogZod>;

export const assetLogPartialSchema = assetLogZod.partial();

/**
 * Inferred TypeScript type from the assetLogPartialSchema.
 * Represents an Asset Log record where all fields are optional.
 */
export type AssetLogPartialZod = z.infer<typeof assetLogPartialSchema>;
