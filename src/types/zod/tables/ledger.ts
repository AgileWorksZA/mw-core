import { z } from "zod";
import { AccountSystemEnum, AccountTypeEnum } from "./account";

// --- Ledger Enums ---
// Re-using AccountTypeEnum and AccountSystemTypeEnum as Ledger inherits these properties.

// --- Ledger Schema ---

/**
 * Zod schema for the Ledger record.
 * Internal file name: Ledger
 * Represents the individual general ledger accounts, including subledgers for departmentalised accounts.
 * This table holds the actual balances and budgets for reporting. There is one record per
 * unique AccountCode-Department combination. Non-departmentalised accounts have an empty Department field.
 */
export const ledgerZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this ledger record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this ledger record.",
    ),
  /** Last modified timestamp. The date and time that this record's balance/budget was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record's balance/budget was last changed.",
    ),
  /** The base general ledger account code (without department suffix). Indexed. Max 7 chars. */
  AccountCode: z
    .string()
    .max(7)
    .describe(
      "The base general ledger account code (without department suffix). Indexed. Max 7 chars.",
    ),
  /** The department code associated with this ledger record (empty if not departmentalised). Indexed. Max 5 chars. */
  Department: z
    .string()
    .max(5)
    .nullable() // Department can be empty for non-departmental accounts
    .optional()
    .describe(
      "The department code associated with this ledger record (empty if not departmentalised). Indexed. Max 5 chars.",
    ),
  /** The primary category code inherited from the base Account record. Indexed. Max 7 chars. */
  Category: z
    .string()
    .max(7) // Matches Account.Category size
    .nullable()
    .optional()
    .describe(
      "The primary category code inherited from the base Account record (Account.Category1). Indexed. Max 7 chars.",
    ),
  /** The classification code inherited from the Department record (empty if no department or department has no classification). Indexed. Max 5 chars. */
  Classification: z
    .string()
    .max(5) // Matches Department.Classification size
    .nullable()
    .optional()
    .describe(
      "The classification code inherited from the Department record (empty if no department or department has no classification). Indexed. Max 5 chars.",
    ),
  /** The fundamental account type code inherited from the base Account record. Indexed. */
  Type: AccountTypeEnum.describe(
    "The fundamental account type code inherited from the base Account record. Indexed.",
  ),
  /** Closing balance for the 91st period prior to the current period. */
  BalanceLast91: z
    .number()
    .describe(
      "Closing balance for the 91st period prior to the current period.",
    ),
  /** Closing balance for the 90th period prior to the current period. */
  BalanceLast90: z
    .number()
    .describe(
      "Closing balance for the 90th period prior to the current period.",
    ),
  // ... Balances for periods 89 down to 01 ...
  /** Closing balance for the 89th period prior to the current period. */
  BalanceLast89: z
    .number()
    .describe(
      "Closing balance for the 89th period prior to the current period.",
    ),
  BalanceLast88: z
    .number()
    .describe(
      "Closing balance for the 88th period prior to the current period.",
    ),
  BalanceLast87: z
    .number()
    .describe(
      "Closing balance for the 87th period prior to the current period.",
    ),
  BalanceLast86: z
    .number()
    .describe(
      "Closing balance for the 86th period prior to the current period.",
    ),
  BalanceLast85: z
    .number()
    .describe(
      "Closing balance for the 85th period prior to the current period.",
    ),
  BalanceLast84: z
    .number()
    .describe(
      "Closing balance for the 84th period prior to the current period.",
    ),
  BalanceLast83: z
    .number()
    .describe(
      "Closing balance for the 83rd period prior to the current period.",
    ),
  BalanceLast82: z
    .number()
    .describe(
      "Closing balance for the 82nd period prior to the current period.",
    ),
  BalanceLast81: z
    .number()
    .describe(
      "Closing balance for the 81st period prior to the current period.",
    ),
  BalanceLast80: z
    .number()
    .describe(
      "Closing balance for the 80th period prior to the current period.",
    ),
  BalanceLast79: z
    .number()
    .describe(
      "Closing balance for the 79th period prior to the current period.",
    ),
  BalanceLast78: z
    .number()
    .describe(
      "Closing balance for the 78th period prior to the current period.",
    ),
  BalanceLast77: z
    .number()
    .describe(
      "Closing balance for the 77th period prior to the current period.",
    ),
  BalanceLast76: z
    .number()
    .describe(
      "Closing balance for the 76th period prior to the current period.",
    ),
  BalanceLast75: z
    .number()
    .describe(
      "Closing balance for the 75th period prior to the current period.",
    ),
  BalanceLast74: z
    .number()
    .describe(
      "Closing balance for the 74th period prior to the current period.",
    ),
  BalanceLast73: z
    .number()
    .describe(
      "Closing balance for the 73rd period prior to the current period.",
    ),
  BalanceLast72: z
    .number()
    .describe(
      "Closing balance for the 72nd period prior to the current period.",
    ),
  BalanceLast71: z
    .number()
    .describe(
      "Closing balance for the 71st period prior to the current period.",
    ),
  BalanceLast70: z
    .number()
    .describe(
      "Closing balance for the 70th period prior to the current period.",
    ),
  BalanceLast69: z
    .number()
    .describe(
      "Closing balance for the 69th period prior to the current period.",
    ),
  BalanceLast68: z
    .number()
    .describe(
      "Closing balance for the 68th period prior to the current period.",
    ),
  BalanceLast67: z
    .number()
    .describe(
      "Closing balance for the 67th period prior to the current period.",
    ),
  BalanceLast66: z
    .number()
    .describe(
      "Closing balance for the 66th period prior to the current period.",
    ),
  BalanceLast65: z
    .number()
    .describe(
      "Closing balance for the 65th period prior to the current period.",
    ),
  BalanceLast64: z
    .number()
    .describe(
      "Closing balance for the 64th period prior to the current period.",
    ),
  BalanceLast63: z
    .number()
    .describe(
      "Closing balance for the 63rd period prior to the current period.",
    ),
  BalanceLast62: z
    .number()
    .describe(
      "Closing balance for the 62nd period prior to the current period.",
    ),
  BalanceLast61: z
    .number()
    .describe(
      "Closing balance for the 61st period prior to the current period.",
    ),
  BalanceLast60: z
    .number()
    .describe(
      "Closing balance for the 60th period prior to the current period.",
    ),
  BalanceLast59: z
    .number()
    .describe(
      "Closing balance for the 59th period prior to the current period.",
    ),
  BalanceLast58: z
    .number()
    .describe(
      "Closing balance for the 58th period prior to the current period.",
    ),
  BalanceLast57: z
    .number()
    .describe(
      "Closing balance for the 57th period prior to the current period.",
    ),
  BalanceLast56: z
    .number()
    .describe(
      "Closing balance for the 56th period prior to the current period.",
    ),
  BalanceLast55: z
    .number()
    .describe(
      "Closing balance for the 55th period prior to the current period.",
    ),
  BalanceLast54: z
    .number()
    .describe(
      "Closing balance for the 54th period prior to the current period.",
    ),
  BalanceLast53: z
    .number()
    .describe(
      "Closing balance for the 53rd period prior to the current period.",
    ),
  BalanceLast52: z
    .number()
    .describe(
      "Closing balance for the 52nd period prior to the current period.",
    ),
  BalanceLast51: z
    .number()
    .describe(
      "Closing balance for the 51st period prior to the current period.",
    ),
  BalanceLast50: z
    .number()
    .describe(
      "Closing balance for the 50th period prior to the current period.",
    ),
  BalanceLast49: z
    .number()
    .describe(
      "Closing balance for the 49th period prior to the current period.",
    ),
  BalanceLast48: z
    .number()
    .describe(
      "Closing balance for the 48th period prior to the current period.",
    ),
  BalanceLast47: z
    .number()
    .describe(
      "Closing balance for the 47th period prior to the current period.",
    ),
  BalanceLast46: z
    .number()
    .describe(
      "Closing balance for the 46th period prior to the current period.",
    ),
  BalanceLast45: z
    .number()
    .describe(
      "Closing balance for the 45th period prior to the current period.",
    ),
  BalanceLast44: z
    .number()
    .describe(
      "Closing balance for the 44th period prior to the current period.",
    ),
  BalanceLast43: z
    .number()
    .describe(
      "Closing balance for the 43rd period prior to the current period.",
    ),
  BalanceLast42: z
    .number()
    .describe(
      "Closing balance for the 42nd period prior to the current period.",
    ),
  BalanceLast41: z
    .number()
    .describe(
      "Closing balance for the 41st period prior to the current period.",
    ),
  BalanceLast40: z
    .number()
    .describe(
      "Closing balance for the 40th period prior to the current period.",
    ),
  BalanceLast39: z
    .number()
    .describe(
      "Closing balance for the 39th period prior to the current period.",
    ),
  BalanceLast38: z
    .number()
    .describe(
      "Closing balance for the 38th period prior to the current period.",
    ),
  BalanceLast37: z
    .number()
    .describe(
      "Closing balance for the 37th period prior to the current period.",
    ),
  BalanceLast36: z
    .number()
    .describe(
      "Closing balance for the 36th period prior to the current period.",
    ),
  BalanceLast35: z
    .number()
    .describe(
      "Closing balance for the 35th period prior to the current period.",
    ),
  BalanceLast34: z
    .number()
    .describe(
      "Closing balance for the 34th period prior to the current period.",
    ),
  BalanceLast33: z
    .number()
    .describe(
      "Closing balance for the 33rd period prior to the current period.",
    ),
  BalanceLast32: z
    .number()
    .describe(
      "Closing balance for the 32nd period prior to the current period.",
    ),
  BalanceLast31: z
    .number()
    .describe(
      "Closing balance for the 31st period prior to the current period.",
    ),
  BalanceLast30: z
    .number()
    .describe(
      "Closing balance for the 30th period prior to the current period.",
    ),
  BalanceLast29: z
    .number()
    .describe(
      "Closing balance for the 29th period prior to the current period.",
    ),
  BalanceLast28: z
    .number()
    .describe(
      "Closing balance for the 28th period prior to the current period.",
    ),
  BalanceLast27: z
    .number()
    .describe(
      "Closing balance for the 27th period prior to the current period.",
    ),
  BalanceLast26: z
    .number()
    .describe(
      "Closing balance for the 26th period prior to the current period.",
    ),
  BalanceLast25: z
    .number()
    .describe(
      "Closing balance for the 25th period prior to the current period.",
    ),
  BalanceLast24: z
    .number()
    .describe(
      "Closing balance for the 24th period prior to the current period.",
    ),
  BalanceLast23: z
    .number()
    .describe(
      "Closing balance for the 23rd period prior to the current period.",
    ),
  BalanceLast22: z
    .number()
    .describe(
      "Closing balance for the 22nd period prior to the current period.",
    ),
  BalanceLast21: z
    .number()
    .describe(
      "Closing balance for the 21st period prior to the current period.",
    ),
  BalanceLast20: z
    .number()
    .describe(
      "Closing balance for the 20th period prior to the current period.",
    ),
  BalanceLast19: z
    .number()
    .describe(
      "Closing balance for the 19th period prior to the current period.",
    ),
  BalanceLast18: z
    .number()
    .describe(
      "Closing balance for the 18th period prior to the current period.",
    ),
  BalanceLast17: z
    .number()
    .describe(
      "Closing balance for the 17th period prior to the current period.",
    ),
  BalanceLast16: z
    .number()
    .describe(
      "Closing balance for the 16th period prior to the current period.",
    ),
  BalanceLast15: z
    .number()
    .describe(
      "Closing balance for the 15th period prior to the current period.",
    ),
  BalanceLast14: z
    .number()
    .describe(
      "Closing balance for the 14th period prior to the current period.",
    ),
  BalanceLast13: z
    .number()
    .describe(
      "Closing balance for the 13th period prior to the current period.",
    ),
  BalanceLast12: z
    .number()
    .describe(
      "Closing balance for the 12th period prior to the current period.",
    ),
  BalanceLast11: z
    .number()
    .describe(
      "Closing balance for the 11th period prior to the current period.",
    ),
  BalanceLast10: z
    .number()
    .describe(
      "Closing balance for the 10th period prior to the current period.",
    ),
  BalanceLast09: z
    .number()
    .describe(
      "Closing balance for the 9th period prior to the current period.",
    ),
  BalanceLast08: z
    .number()
    .describe(
      "Closing balance for the 8th period prior to the current period.",
    ),
  BalanceLast07: z
    .number()
    .describe(
      "Closing balance for the 7th period prior to the current period.",
    ),
  BalanceLast06: z
    .number()
    .describe(
      "Closing balance for the 6th period prior to the current period.",
    ),
  BalanceLast05: z
    .number()
    .describe(
      "Closing balance for the 5th period prior to the current period.",
    ),
  BalanceLast04: z
    .number()
    .describe(
      "Closing balance for the 4th period prior to the current period.",
    ),
  BalanceLast03: z
    .number()
    .describe(
      "Closing balance for the 3rd period prior to the current period.",
    ),
  BalanceLast02: z
    .number()
    .describe(
      "Closing balance for the 2nd period prior to the current period.",
    ),
  BalanceLast01: z
    .number()
    .describe(
      "Closing balance for the 1st period prior to the current period (previous period).",
    ),
  /** Closing balance for the current period. */
  Balance: z.number().describe("Closing balance for the current period."),
  /** Budget A for the 29th period prior to the current period. */
  BudgetALast29: z
    .number()
    .describe("Budget A for the 29th period prior to the current period."),
  // ... Budget A Last 28 down to 01 ...
  BudgetALast28: z
    .number()
    .describe("Budget A for the 28th period prior to the current period."),
  BudgetALast27: z
    .number()
    .describe("Budget A for the 27th period prior to the current period."),
  BudgetALast26: z
    .number()
    .describe("Budget A for the 26th period prior to the current period."),
  BudgetALast25: z
    .number()
    .describe("Budget A for the 25th period prior to the current period."),
  BudgetALast24: z
    .number()
    .describe("Budget A for the 24th period prior to the current period."),
  BudgetALast23: z
    .number()
    .describe("Budget A for the 23rd period prior to the current period."),
  BudgetALast22: z
    .number()
    .describe("Budget A for the 22nd period prior to the current period."),
  BudgetALast21: z
    .number()
    .describe("Budget A for the 21st period prior to the current period."),
  BudgetALast20: z
    .number()
    .describe("Budget A for the 20th period prior to the current period."),
  BudgetALast19: z
    .number()
    .describe("Budget A for the 19th period prior to the current period."),
  BudgetALast18: z
    .number()
    .describe("Budget A for the 18th period prior to the current period."),
  BudgetALast17: z
    .number()
    .describe("Budget A for the 17th period prior to the current period."),
  BudgetALast16: z
    .number()
    .describe("Budget A for the 16th period prior to the current period."),
  BudgetALast15: z
    .number()
    .describe("Budget A for the 15th period prior to the current period."),
  BudgetALast14: z
    .number()
    .describe("Budget A for the 14th period prior to the current period."),
  BudgetALast13: z
    .number()
    .describe("Budget A for the 13th period prior to the current period."),
  BudgetALast12: z
    .number()
    .describe("Budget A for the 12th period prior to the current period."),
  BudgetALast11: z
    .number()
    .describe("Budget A for the 11th period prior to the current period."),
  BudgetALast10: z
    .number()
    .describe("Budget A for the 10th period prior to the current period."),
  BudgetALast09: z
    .number()
    .describe("Budget A for the 9th period prior to the current period."),
  BudgetALast08: z
    .number()
    .describe("Budget A for the 8th period prior to the current period."),
  BudgetALast07: z
    .number()
    .describe("Budget A for the 7th period prior to the current period."),
  BudgetALast06: z
    .number()
    .describe("Budget A for the 6th period prior to the current period."),
  BudgetALast05: z
    .number()
    .describe("Budget A for the 5th period prior to the current period."),
  BudgetALast04: z
    .number()
    .describe("Budget A for the 4th period prior to the current period."),
  BudgetALast03: z
    .number()
    .describe("Budget A for the 3rd period prior to the current period."),
  BudgetALast02: z
    .number()
    .describe("Budget A for the 2nd period prior to the current period."),
  BudgetALast01: z
    .number()
    .describe(
      "Budget A for the 1st period prior to the current period (previous period).",
    ),
  /** Budget A for the current period. */
  BudgetA: z.number().describe("Budget A for the current period."),
  /** Budget A for the 1st future period. */
  BudgetANext01: z.number().describe("Budget A for the 1st future period."),
  // ... Budget A Next 02 to 18 ...
  BudgetANext02: z.number().describe("Budget A for the 2nd future period."),
  BudgetANext03: z.number().describe("Budget A for the 3rd future period."),
  BudgetANext04: z.number().describe("Budget A for the 4th future period."),
  BudgetANext05: z.number().describe("Budget A for the 5th future period."),
  BudgetANext06: z.number().describe("Budget A for the 6th future period."),
  BudgetANext07: z.number().describe("Budget A for the 7th future period."),
  BudgetANext08: z.number().describe("Budget A for the 8th future period."),
  BudgetANext09: z.number().describe("Budget A for the 9th future period."),
  BudgetANext10: z.number().describe("Budget A for the 10th future period."),
  BudgetANext11: z.number().describe("Budget A for the 11th future period."),
  BudgetANext12: z.number().describe("Budget A for the 12th future period."),
  BudgetANext13: z.number().describe("Budget A for the 13th future period."),
  BudgetANext14: z.number().describe("Budget A for the 14th future period."),
  BudgetANext15: z.number().describe("Budget A for the 15th future period."),
  BudgetANext16: z.number().describe("Budget A for the 16th future period."),
  BudgetANext17: z.number().describe("Budget A for the 17th future period."),
  BudgetANext18: z.number().describe("Budget A for the 18th future period."),
  /** Budget B for the 29th period prior to the current period. */
  BudgetBLast29: z
    .number()
    .describe("Budget B for the 29th period prior to the current period."),
  // ... Budget B Last 28 down to 01 ...
  BudgetBLast28: z
    .number()
    .describe("Budget B for the 28th period prior to the current period."),
  BudgetBLast27: z
    .number()
    .describe("Budget B for the 27th period prior to the current period."),
  BudgetBLast26: z
    .number()
    .describe("Budget B for the 26th period prior to the current period."),
  BudgetBLast25: z
    .number()
    .describe("Budget B for the 25th period prior to the current period."),
  BudgetBLast24: z
    .number()
    .describe("Budget B for the 24th period prior to the current period."),
  BudgetBLast23: z
    .number()
    .describe("Budget B for the 23rd period prior to the current period."),
  BudgetBLast22: z
    .number()
    .describe("Budget B for the 22nd period prior to the current period."),
  BudgetBLast21: z
    .number()
    .describe("Budget B for the 21st period prior to the current period."),
  BudgetBLast20: z
    .number()
    .describe("Budget B for the 20th period prior to the current period."),
  BudgetBLast19: z
    .number()
    .describe("Budget B for the 19th period prior to the current period."),
  BudgetBLast18: z
    .number()
    .describe("Budget B for the 18th period prior to the current period."),
  BudgetBLast17: z
    .number()
    .describe("Budget B for the 17th period prior to the current period."),
  BudgetBLast16: z
    .number()
    .describe("Budget B for the 16th period prior to the current period."),
  BudgetBLast15: z
    .number()
    .describe("Budget B for the 15th period prior to the current period."),
  BudgetBLast14: z
    .number()
    .describe("Budget B for the 14th period prior to the current period."),
  BudgetBLast13: z
    .number()
    .describe("Budget B for the 13th period prior to the current period."),
  BudgetBLast12: z
    .number()
    .describe("Budget B for the 12th period prior to the current period."),
  BudgetBLast11: z
    .number()
    .describe("Budget B for the 11th period prior to the current period."),
  BudgetBLast10: z
    .number()
    .describe("Budget B for the 10th period prior to the current period."),
  BudgetBLast09: z
    .number()
    .describe("Budget B for the 9th period prior to the current period."),
  BudgetBLast08: z
    .number()
    .describe("Budget B for the 8th period prior to the current period."),
  BudgetBLast07: z
    .number()
    .describe("Budget B for the 7th period prior to the current period."),
  BudgetBLast06: z
    .number()
    .describe("Budget B for the 6th period prior to the current period."),
  BudgetBLast05: z
    .number()
    .describe("Budget B for the 5th period prior to the current period."),
  BudgetBLast04: z
    .number()
    .describe("Budget B for the 4th period prior to the current period."),
  BudgetBLast03: z
    .number()
    .describe("Budget B for the 3rd period prior to the current period."),
  BudgetBLast02: z
    .number()
    .describe("Budget B for the 2nd period prior to the current period."),
  BudgetBLast01: z
    .number()
    .describe(
      "Budget B for the 1st period prior to the current period (previous period).",
    ),
  /** Budget B for the current period. */
  BudgetB: z.number().describe("Budget B for the current period."),
  /** Budget B for the 1st future period. */
  BudgetBNext01: z.number().describe("Budget B for the 1st future period."),
  // ... Budget B Next 02 to 18 ...
  BudgetBNext02: z.number().describe("Budget B for the 2nd future period."),
  BudgetBNext03: z.number().describe("Budget B for the 3rd future period."),
  BudgetBNext04: z.number().describe("Budget B for the 4th future period."),
  BudgetBNext05: z.number().describe("Budget B for the 5th future period."),
  BudgetBNext06: z.number().describe("Budget B for the 6th future period."),
  BudgetBNext07: z.number().describe("Budget B for the 7th future period."),
  BudgetBNext08: z.number().describe("Budget B for the 8th future period."),
  BudgetBNext09: z.number().describe("Budget B for the 9th future period."),
  BudgetBNext10: z.number().describe("Budget B for the 10th future period."),
  BudgetBNext11: z.number().describe("Budget B for the 11th future period."),
  BudgetBNext12: z.number().describe("Budget B for the 12th future period."),
  BudgetBNext13: z.number().describe("Budget B for the 13th future period."),
  BudgetBNext14: z.number().describe("Budget B for the 14th future period."),
  BudgetBNext15: z.number().describe("Budget B for the 15th future period."),
  BudgetBNext16: z.number().describe("Budget B for the 16th future period."),
  BudgetBNext17: z.number().describe("Budget B for the 17th future period."),
  BudgetBNext18: z.number().describe("Budget B for the 18th future period."),
  /** Concatenated AccountCode and Department (e.g., 'CODE-DEPT'). Indexed. Max 13 chars. */
  Concat: z
    .string()
    .max(13)
    .describe(
      "Concatenated AccountCode and Department (e.g., 'CODE-DEPT'). Indexed. Max 13 chars.",
    ),
  /** The system account type code (e.g., BK, AR, AP) or spaces if not a system account. Indexed. Max 2 chars. */
  System: AccountSystemEnum.nullable()
    .optional()
    .describe(
      "The system account type code (e.g., BK, AR, AP) or spaces if not a system account. Indexed.",
    ), // Allow null/optional as non-system accounts have spaces
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
});

/**
 * Inferred TypeScript type from the ledgerZod schema.
 * Represents a fully validated Ledger record.
 */
export type LedgerZod = z.infer<typeof ledgerZod>;

// Partial schema - unlikely to be updated directly often
export const ledgerPartialSchema = ledgerZod.partial();

/**
 * Inferred TypeScript type from the ledgerPartialSchema.
 * Represents a Ledger record where all fields are optional.
 */
export type LedgerPartialZod = z.infer<typeof ledgerPartialSchema>;
