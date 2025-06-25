/**
 * MoneyWorks Detail Table Interface
 *
 * The Detail table contains transaction line-level details and is a subfile
 * of Transaction records. Each Detail record is linked to a parent Transaction
 * via the ParentSeq field. This table stores accounting line items including
 * accounts, amounts, tax, inventory, and custom tracking fields.
 *
 * Key features:
 * - Subfile of Transaction table - no direct access
 * - Links to parent via ParentSeq field
 * - Supports both accounting and inventory details
 * - Includes custom scriptable fields
 * - Tracks department and job allocations
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_transactions.html
 */

import type { Timestamp } from "../types";

/**
 * Detail flags for various line item states and properties
 */
export enum DetailFlags {
  None = 0,
  // Placeholder flags - specific values would be determined from MoneyWorks documentation
  TaxExempt = 1 << 0,
  NonPosting = 1 << 1,
  Hidden = 1 << 2,
  Locked = 1 << 3,
}

/**
 * Raw Detail interface matching MoneyWorks field names (PascalCase)
 */
export interface Detail {
  /** Unique sequence number for the detail record */
  SequenceNumber?: number;

  /** Timestamp of last modification */
  LastModifiedTime?: Timestamp;

  /** Links to parent transaction sequence number */
  "Detail.ParentSeq": number;

  /** Account code (max 14 characters) */
  "Detail.Account": string;

  /** Debit amount */
  "Detail.Debit": number;

  /** Credit amount */
  "Detail.Credit": number;

  /** Description/narration for this line (max 255 characters) */
  "Detail.Description"?: string;

  /** Tax amount */
  "Detail.Tax"?: number;

  /** Tax code (max 7 characters) */
  "Detail.TaxCode"?: string;

  /** Department code (max 14 characters) */
  "Detail.Department"?: string;

  /** Job code (max 31 characters) */
  "Detail.Job"?: string;

  /** Product/stock code (max 19 characters) */
  "Detail.StockCode"?: string;

  /** Stock quantity */
  "Detail.StockQty"?: number;

  /** Unit price for stock */
  "Detail.UnitPrice"?: number;

  /** Cost price for stock */
  "Detail.CostPrice"?: number;

  /** Sale unit description */
  "Detail.SaleUnit"?: string;

  /** Line number/order within transaction */
  "Detail.LineNumber"?: number;

  /** Flags for line properties */
  "Detail.Flags"?: number;

  /** More flags for extended properties */
  "Detail.MoreFlags"?: number;

  /** Custom scriptable field 1 (max 255 characters) */
  "Detail.Custom1"?: string;

  /** Custom scriptable field 2 (max 255 characters) */
  "Detail.Custom2"?: string;

  /** Serial number tracking */
  "Detail.SerialNumber"?: string;

  /** Batch number for inventory */
  "Detail.BatchNumber"?: string;

  /** Discount percentage */
  "Detail.Discount"?: number;

  /** Gross amount (before tax) */
  "Detail.Gross"?: number;

  /** Net amount (after tax) */
  "Detail.Net"?: number;
}

/**
 * CamelCase version of Detail interface for easier use
 */
export interface DetailCamel {
  /** Unique sequence number for the detail record */
  sequenceNumber?: number;

  /** Timestamp of last modification */
  lastModifiedTime?: Timestamp;

  /** Links to parent transaction sequence number */
  parentSeq: number;

  /** Account code (max 14 characters) */
  account: string;

  /** Debit amount */
  debit: number;

  /** Credit amount */
  credit: number;

  /** Description/narration for this line (max 255 characters) */
  description?: string;

  /** Tax amount */
  tax?: number;

  /** Tax code (max 7 characters) */
  taxCode?: string;

  /** Department code (max 14 characters) */
  department?: string;

  /** Job code (max 31 characters) */
  job?: string;

  /** Product/stock code (max 19 characters) */
  stockCode?: string;

  /** Stock quantity */
  stockQty?: number;

  /** Unit price for stock */
  unitPrice?: number;

  /** Cost price for stock */
  costPrice?: number;

  /** Sale unit description */
  saleUnit?: string;

  /** Line number/order within transaction */
  lineNumber?: number;

  /** Flags for line properties */
  flags?: number;

  /** More flags for extended properties */
  moreFlags?: number;

  /** Custom scriptable field 1 (max 255 characters) */
  custom1?: string;

  /** Custom scriptable field 2 (max 255 characters) */
  custom2?: string;

  /** Serial number tracking */
  serialNumber?: string;

  /** Batch number for inventory */
  batchNumber?: string;

  /** Discount percentage */
  discount?: number;

  /** Gross amount (before tax) */
  gross?: number;

  /** Net amount (after tax) */
  net?: number;
}

/**
 * Field name mappings from camelCase to PascalCase
 */
export const detailFieldMappings = {
  sequenceNumber: "SequenceNumber",
  lastModifiedTime: "LastModifiedTime",
  parentSeq: "Detail.ParentSeq",
  account: "Detail.Account",
  debit: "Detail.Debit",
  credit: "Detail.Credit",
  description: "Detail.Description",
  tax: "Detail.Tax",
  taxCode: "Detail.TaxCode",
  department: "Detail.Department",
  job: "Detail.Job",
  stockCode: "Detail.StockCode",
  stockQty: "Detail.StockQty",
  unitPrice: "Detail.UnitPrice",
  costPrice: "Detail.CostPrice",
  saleUnit: "Detail.SaleUnit",
  lineNumber: "Detail.LineNumber",
  flags: "Detail.Flags",
  moreFlags: "Detail.MoreFlags",
  custom1: "Detail.Custom1",
  custom2: "Detail.Custom2",
  serialNumber: "Detail.SerialNumber",
  batchNumber: "Detail.BatchNumber",
  discount: "Detail.Discount",
  gross: "Detail.Gross",
  net: "Detail.Net",
} as const;

/**
 * Converter utilities for Detail table
 */
export const detailConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: Detail): DetailCamel {
    return {
      sequenceNumber: raw.SequenceNumber,
      lastModifiedTime: raw.LastModifiedTime,
      parentSeq: raw["Detail.ParentSeq"],
      account: raw["Detail.Account"],
      debit: raw["Detail.Debit"],
      credit: raw["Detail.Credit"],
      description: raw["Detail.Description"],
      tax: raw["Detail.Tax"],
      taxCode: raw["Detail.TaxCode"],
      department: raw["Detail.Department"],
      job: raw["Detail.Job"],
      stockCode: raw["Detail.StockCode"],
      stockQty: raw["Detail.StockQty"],
      unitPrice: raw["Detail.UnitPrice"],
      costPrice: raw["Detail.CostPrice"],
      saleUnit: raw["Detail.SaleUnit"],
      lineNumber: raw["Detail.LineNumber"],
      flags: raw["Detail.Flags"],
      moreFlags: raw["Detail.MoreFlags"],
      custom1: raw["Detail.Custom1"],
      custom2: raw["Detail.Custom2"],
      serialNumber: raw["Detail.SerialNumber"],
      batchNumber: raw["Detail.BatchNumber"],
      discount: raw["Detail.Discount"],
      gross: raw["Detail.Gross"],
      net: raw["Detail.Net"],
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: DetailCamel): Detail {
    return {
      SequenceNumber: camel.sequenceNumber,
      LastModifiedTime: camel.lastModifiedTime,
      "Detail.ParentSeq": camel.parentSeq,
      "Detail.Account": camel.account,
      "Detail.Debit": camel.debit,
      "Detail.Credit": camel.credit,
      "Detail.Description": camel.description,
      "Detail.Tax": camel.tax,
      "Detail.TaxCode": camel.taxCode,
      "Detail.Department": camel.department,
      "Detail.Job": camel.job,
      "Detail.StockCode": camel.stockCode,
      "Detail.StockQty": camel.stockQty,
      "Detail.UnitPrice": camel.unitPrice,
      "Detail.CostPrice": camel.costPrice,
      "Detail.SaleUnit": camel.saleUnit,
      "Detail.LineNumber": camel.lineNumber,
      "Detail.Flags": camel.flags,
      "Detail.MoreFlags": camel.moreFlags,
      "Detail.Custom1": camel.custom1,
      "Detail.Custom2": camel.custom2,
      "Detail.SerialNumber": camel.serialNumber,
      "Detail.BatchNumber": camel.batchNumber,
      "Detail.Discount": camel.discount,
      "Detail.Gross": camel.gross,
      "Detail.Net": camel.net,
    };
  },
};

/**
 * Helper functions for Detail table
 */
export const detailHelpers = {
  /**
   * Check if a detail has a specific flag set
   */
  hasFlag(detail: Detail | DetailCamel, flag: DetailFlags): boolean {
    const flags =
      "flags" in detail ? detail.flags : (detail as Detail)["Detail.Flags"];
    return (flags && (flags & flag) === flag) || false;
  },

  /**
   * Set a flag on detail flags
   */
  setFlag(flags: number, flag: DetailFlags): number {
    return flags | flag;
  },

  /**
   * Clear a flag from detail flags
   */
  clearFlag(flags: number, flag: DetailFlags): number {
    return flags & ~flag;
  },

  /**
   * Calculate net amount from gross and tax
   */
  calculateNet(gross: number, tax: number): number {
    return gross - tax;
  },

  /**
   * Calculate gross amount from net and tax
   */
  calculateGross(net: number, tax: number): number {
    return net + tax;
  },

  /**
   * Check if detail is for an inventory item
   */
  isInventoryDetail(detail: Detail | DetailCamel): boolean {
    const stockCode =
      "stockCode" in detail
        ? detail.stockCode
        : (detail as Detail)["Detail.StockCode"];
    return !!stockCode && stockCode.length > 0;
  },

  /**
   * Check if detail is for accounting only (no inventory)
   */
  isAccountingDetail(detail: Detail | DetailCamel): boolean {
    return !detailHelpers.isInventoryDetail(detail);
  },

  /**
   * Get the amount for a detail line (debit - credit)
   */
  getAmount(detail: Detail | DetailCamel): number {
    const debit =
      "debit" in detail ? detail.debit : (detail as Detail)["Detail.Debit"];
    const credit =
      "credit" in detail ? detail.credit : (detail as Detail)["Detail.Credit"];
    return debit - credit;
  },

  /**
   * Create a new detail with defaults
   */
  createDetail(
    parentSeq: number,
    account: string,
    amount: number,
    options?: {
      description?: string;
      taxCode?: string;
      department?: string;
      job?: string;
      stockCode?: string;
      stockQty?: number;
      unitPrice?: number;
    },
  ): Partial<Detail> {
    const isDebit = amount >= 0;
    return {
      "Detail.ParentSeq": parentSeq,
      "Detail.Account": account,
      "Detail.Debit": isDebit ? amount : 0,
      "Detail.Credit": isDebit ? 0 : Math.abs(amount),
      "Detail.Description": options?.description,
      "Detail.TaxCode": options?.taxCode,
      "Detail.Department": options?.department,
      "Detail.Job": options?.job,
      "Detail.StockCode": options?.stockCode,
      "Detail.StockQty": options?.stockQty,
      "Detail.UnitPrice": options?.unitPrice,
      "Detail.Flags": DetailFlags.None,
    };
  },

  /**
   * Format detail for display
   */
  formatDetail(detail: DetailCamel): string {
    const parts: string[] = [];

    if (detail.account) {
      parts.push(`Account: ${detail.account}`);
    }

    const amount = detailHelpers.getAmount(detail);
    if (amount !== 0) {
      parts.push(`Amount: ${amount.toFixed(2)}`);
    }

    if (detail.description) {
      parts.push(`Desc: ${detail.description}`);
    }

    if (detail.stockCode) {
      parts.push(`Stock: ${detail.stockCode} x ${detail.stockQty || 0}`);
    }

    return parts.join(" | ");
  },
};

/**
 * Type guard to check if an object is a Detail
 */
export function isDetail(obj: unknown): obj is Detail {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "Detail.ParentSeq" in obj &&
    "Detail.Account" in obj &&
    "Detail.Debit" in obj &&
    "Detail.Credit" in obj
  );
}

/**
 * Type guard to check if an object is a DetailCamel
 */
export function isDetailCamel(obj: unknown): obj is DetailCamel {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "parentSeq" in obj &&
    "account" in obj &&
    "debit" in obj &&
    "credit" in obj
  );
}

/**
 * Validate Detail field lengths
 */
export function validateDetailFieldLengths(detail: Detail): string[] {
  const errors: string[] = [];

  if (detail["Detail.Account"] && detail["Detail.Account"].length > 14) {
    errors.push("Account exceeds 14 character limit");
  }

  if (
    detail["Detail.Description"] &&
    detail["Detail.Description"].length > 255
  ) {
    errors.push("Description exceeds 255 character limit");
  }

  if (detail["Detail.TaxCode"] && detail["Detail.TaxCode"].length > 7) {
    errors.push("TaxCode exceeds 7 character limit");
  }

  if (detail["Detail.Department"] && detail["Detail.Department"].length > 14) {
    errors.push("Department exceeds 14 character limit");
  }

  if (detail["Detail.Job"] && detail["Detail.Job"].length > 31) {
    errors.push("Job exceeds 31 character limit");
  }

  if (detail["Detail.StockCode"] && detail["Detail.StockCode"].length > 19) {
    errors.push("StockCode exceeds 19 character limit");
  }

  if (detail["Detail.Custom1"] && detail["Detail.Custom1"].length > 255) {
    errors.push("Custom1 exceeds 255 character limit");
  }

  if (detail["Detail.Custom2"] && detail["Detail.Custom2"].length > 255) {
    errors.push("Custom2 exceeds 255 character limit");
  }

  return errors;
}
