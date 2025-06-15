/**
 * AssetLog subfile interfaces and utilities for MoneyWorks
 *
 * The AssetLog subfile is directly associated with each asset record and tracks
 * the complete lifecycle of an asset including acquisitions, disposals, depreciation,
 * and revaluations. This subfile is accessed through the parent Asset record via Asset.Log.
 *
 * Key features:
 * - No direct access - only through parent Asset record
 * - Tracks all financial changes and lifecycle events
 * - Links to transactions via TransactionSeq field
 * - Maintains running totals of depreciation and book values
 */

import { z } from "zod";
import { TypeConverters } from "../converters/key-converter";

/**
 * AssetLog action types enum
 */
export enum AssetLogAction {
  /** Asset Acquisition */
  ACQUISITION = "AA",
  /** Asset Disposal */
  DISPOSAL = "AD",
  /** Asset Partial disposal */
  PARTIAL_DISPOSAL = "AP",
  /** Straight line depreciation */
  STRAIGHT_LINE_DEPRECIATION = "DS",
  /** Diminishing value depreciation */
  DIMINISHING_VALUE_DEPRECIATION = "DD",
  /** Memo entry */
  MEMO = "ME",
  /** Revaluation */
  REVALUATION = "RV",
}

/**
 * Raw AssetLog interface matching MoneyWorks field names (PascalCase)
 * This is a subfile of the Assets table, accessed via Asset.Log
 */
export interface AssetLog {
  /** Links to the parent asset's sequence number */
  ParentSeq: number;

  /** The type of action performed (AA, AD, AP, DS, DD, ME, RV) */
  Action: string;

  /** The date when the action occurred */
  Date: Date;

  /** The quantity involved in the action */
  Qty: number;

  /** The depreciation amount for this action */
  Depreciation: number;

  /** First adjustment amount */
  Adjustment1: number;

  /** Second adjustment amount */
  Adjustment2: number;

  /** The depreciation rate used (as a percentage) */
  Rate: number;

  /** The percentage of private use for this period */
  PrivateUsePercent: number;

  /** The accumulated depreciation after this action */
  AccumDepreciation: number;

  /** The accumulated revaluation after this action */
  AccumReval: number;

  /** The book value (closing value) after this action */
  ClosingValue: number;

  /** Links to the transaction sequence number for this action */
  TransactionSeq: number;

  /** User-added notes about this action (max 255 chars) */
  Memo: string;
}

/**
 * CamelCase AssetLog interface for TypeScript usage
 */
export interface AssetLogCamel {
  /** Links to the parent asset's sequence number */
  parentSeq: number;

  /** The type of action performed (AA, AD, AP, DS, DD, ME, RV) */
  action: string;

  /** The date when the action occurred */
  date: Date;

  /** The quantity involved in the action */
  qty: number;

  /** The depreciation amount for this action */
  depreciation: number;

  /** First adjustment amount */
  adjustment1: number;

  /** Second adjustment amount */
  adjustment2: number;

  /** The depreciation rate used (as a percentage) */
  rate: number;

  /** The percentage of private use for this period */
  privateUsePercent: number;

  /** The accumulated depreciation after this action */
  accumDepreciation: number;

  /** The accumulated revaluation after this action */
  accumReval: number;

  /** The book value (closing value) after this action */
  closingValue: number;

  /** Links to the transaction sequence number for this action */
  transactionSeq: number;

  /** User-added notes about this action (max 255 chars) */
  memo: string;
}

/**
 * Zod schema for AssetLog validation
 */
export const AssetLogSchema = z.object({
  ParentSeq: z.number(),
  Action: z.string().max(3),
  Date: z.date(),
  Qty: z.number(),
  Depreciation: z.number(),
  Adjustment1: z.number(),
  Adjustment2: z.number(),
  Rate: z.number(),
  PrivateUsePercent: z.number(),
  AccumDepreciation: z.number(),
  AccumReval: z.number(),
  ClosingValue: z.number(),
  TransactionSeq: z.number(),
  Memo: z.string().max(255),
});

/**
 * Zod schema for camelCase AssetLog validation
 */
export const AssetLogCamelSchema = z.object({
  parentSeq: z.number(),
  action: z.string().max(3),
  date: z.date(),
  qty: z.number(),
  depreciation: z.number(),
  adjustment1: z.number(),
  adjustment2: z.number(),
  rate: z.number(),
  privateUsePercent: z.number(),
  accumDepreciation: z.number(),
  accumReval: z.number(),
  closingValue: z.number(),
  transactionSeq: z.number(),
  memo: z.string().max(255),
});

/**
 * Convert AssetLog from PascalCase to camelCase
 */
export function assetLogToCamel(assetLog: AssetLog): AssetLogCamel {
  return TypeConverters.toCamelCase(assetLog) as unknown as AssetLogCamel;
}

/**
 * Convert AssetLog from camelCase to PascalCase
 */
export function assetLogToPascal(assetLog: AssetLogCamel): AssetLog {
  return TypeConverters.toPascalCase(assetLog) as unknown as AssetLog;
}

/**
 * Type guard to check if a value is a valid AssetLog
 */
export function isAssetLog(value: unknown): value is AssetLog {
  return AssetLogSchema.safeParse(value).success;
}

/**
 * Type guard to check if a value is a valid AssetLogCamel
 */
export function isAssetLogCamel(value: unknown): value is AssetLogCamel {
  return AssetLogCamelSchema.safeParse(value).success;
}

/**
 * Helper function to check if an action is a depreciation action
 */
export function isDepreciationAction(action: string): boolean {
  return (
    action === AssetLogAction.STRAIGHT_LINE_DEPRECIATION ||
    action === AssetLogAction.DIMINISHING_VALUE_DEPRECIATION
  );
}

/**
 * Helper function to check if an action is a disposal action
 */
export function isDisposalAction(action: string): boolean {
  return (
    action === AssetLogAction.DISPOSAL ||
    action === AssetLogAction.PARTIAL_DISPOSAL
  );
}

/**
 * Helper function to get a human-readable description of an action
 */
export function getActionDescription(action: string): string {
  switch (action) {
    case AssetLogAction.ACQUISITION:
      return "Asset Acquisition";
    case AssetLogAction.DISPOSAL:
      return "Asset Disposal";
    case AssetLogAction.PARTIAL_DISPOSAL:
      return "Partial Disposal";
    case AssetLogAction.STRAIGHT_LINE_DEPRECIATION:
      return "Straight Line Depreciation";
    case AssetLogAction.DIMINISHING_VALUE_DEPRECIATION:
      return "Diminishing Value Depreciation";
    case AssetLogAction.MEMO:
      return "Memo";
    case AssetLogAction.REVALUATION:
      return "Revaluation";
    default:
      return `Unknown Action (${action})`;
  }
}

/**
 * Helper function to calculate net book value change from an AssetLog entry
 */
export function calculateNetBookValueChange(
  log: AssetLog | AssetLogCamel,
): number {
  const depreciation =
    "Depreciation" in log ? log.Depreciation : log.depreciation;
  const adjustment1 = "Adjustment1" in log ? log.Adjustment1 : log.adjustment1;
  const adjustment2 = "Adjustment2" in log ? log.Adjustment2 : log.adjustment2;

  return -(depreciation + adjustment1 + adjustment2);
}

/**
 * Default values for creating a new AssetLog entry
 */
export const defaultAssetLog: Partial<AssetLog> = {
  Qty: 0,
  Depreciation: 0,
  Adjustment1: 0,
  Adjustment2: 0,
  Rate: 0,
  PrivateUsePercent: 0,
  AccumDepreciation: 0,
  AccumReval: 0,
  ClosingValue: 0,
  TransactionSeq: 0,
  Memo: "",
};

/**
 * Default values for creating a new AssetLog entry (camelCase)
 */
export const defaultAssetLogCamel: Partial<AssetLogCamel> = {
  qty: 0,
  depreciation: 0,
  adjustment1: 0,
  adjustment2: 0,
  rate: 0,
  privateUsePercent: 0,
  accumDepreciation: 0,
  accumReval: 0,
  closingValue: 0,
  transactionSeq: 0,
  memo: "",
};
