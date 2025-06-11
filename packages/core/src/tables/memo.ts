/**
 * MoneyWorks Memo Table Interface
 *
 * The Memo table stores memos/notes with optional reminder functionality.
 * Links to Names table via NameSeq field.
 * Supports memo categorization and reminder dates.
 */

import type { BaseTable } from "../types/base";
import { createConverter } from "../utils/converter";

/**
 * Memo flags for various memo states and properties
 */
export enum MemoFlags {
  None = 0,
  // Additional flags would be defined here based on MoneyWorks documentation
  // These are placeholders until specific flag values are documented
  Important = 1 << 0,
  Completed = 1 << 1,
  Private = 1 << 2,
  HasAttachment = 1 << 3,
}

/**
 * Raw Memo interface matching MoneyWorks field names (PascalCase)
 */
export interface Memo extends BaseTable {
  /** Unique sequence number for the memo record */
  SequenceNumber: number;

  /** Timestamp of last modification */
  LastModifiedTime: string;

  /** Sequence number linking to Name record */
  "Memo.NameSeq": number;

  /** Order/priority of the memo (for sorting) */
  "Memo.Order": number;

  /** Date the memo was created */
  "Memo.Date": string;

  /** Date for memo reminder/recall */
  "Memo.RecallDate": string;

  /** Flags for memo properties (see MemoFlags enum) */
  "Memo.Flags": number;

  /** Memo text content (max 80 characters based on schema) */
  "Memo.Text": string;
}

/**
 * CamelCase version of Memo interface for easier use
 */
export interface MemoCamel {
  /** Unique sequence number for the memo record */
  sequenceNumber: number;

  /** Timestamp of last modification */
  lastModifiedTime?: string;

  /** Sequence number linking to Name record */
  nameSeq: number;

  /** Order/priority of the memo (for sorting) */
  order: number;

  /** Date the memo was created */
  date: string;

  /** Date for memo reminder/recall */
  recallDate: string;

  /** Flags for memo properties (see MemoFlags enum) */
  flags: number;

  /** Memo text content (max 80 characters based on schema) */
  text: string;
}

/**
 * Field name mappings from camelCase to PascalCase
 */
export const memoFieldMappings = {
  sequenceNumber: "SequenceNumber",
  lastModifiedTime: "LastModifiedTime",
  nameSeq: "Memo.NameSeq",
  order: "Memo.Order",
  date: "Memo.Date",
  recallDate: "Memo.RecallDate",
  flags: "Memo.Flags",
  text: "Memo.Text",
} as const;

/**
 * Converter instance for Memo table
 */
export const memoConverter = createConverter<Memo, MemoCamel>(
  memoFieldMappings,
);

/**
 * Helper function to check if a memo has a specific flag set
 */
export function hasMemoFlag(memo: Memo | MemoCamel, flag: MemoFlags): boolean {
  const flags = "flags" in memo ? memo.flags : memo["Memo.Flags"];
  return (flags & flag) === flag;
}

/**
 * Helper function to set a flag on a memo
 */
export function setMemoFlag(flags: number, flag: MemoFlags): number {
  return flags | flag;
}

/**
 * Helper function to clear a flag on a memo
 */
export function clearMemoFlag(flags: number, flag: MemoFlags): number {
  return flags & ~flag;
}

/**
 * Helper function to parse a memo date string
 */
export function parseMemoDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === "0") return null;
  // MoneyWorks dates are typically in YYYYMMDD format
  const year = Number.parseInt(dateStr.substring(0, 4));
  const month = Number.parseInt(dateStr.substring(4, 6)) - 1; // JavaScript months are 0-based
  const day = Number.parseInt(dateStr.substring(6, 8));
  return new Date(year, month, day);
}

/**
 * Helper function to format a date for MoneyWorks memo
 */
export function formatMemoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Helper function to create a new memo with defaults
 */
export function createMemo(
  nameSeq: number,
  text: string,
  options?: {
    date?: Date;
    recallDate?: Date;
    order?: number;
    flags?: number;
  },
): Partial<Memo> {
  const now = new Date();
  return {
    "Memo.NameSeq": nameSeq,
    "Memo.Text": text.substring(0, 80), // Enforce max length
    "Memo.Date": options?.date
      ? formatMemoDate(options.date)
      : formatMemoDate(now),
    "Memo.RecallDate": options?.recallDate
      ? formatMemoDate(options.recallDate)
      : "0",
    "Memo.Order": options?.order ?? 0,
    "Memo.Flags": options?.flags ?? MemoFlags.None,
  };
}

/**
 * Type guard to check if an object is a Memo
 */
export function isMemo(obj: unknown): obj is Memo {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "SequenceNumber" in obj &&
    "Memo.NameSeq" in obj &&
    "Memo.Text" in obj
  );
}

/**
 * Type guard to check if an object is a MemoCamel
 */
export function isMemoCamel(obj: unknown): obj is MemoCamel {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "sequenceNumber" in obj &&
    "nameSeq" in obj &&
    "text" in obj
  );
}
