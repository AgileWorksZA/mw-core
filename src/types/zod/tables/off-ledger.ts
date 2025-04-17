import { z } from "zod";

// --- OffLedger Enums ---

/**
 * Defines the kind of data stored in the OffLedger record.
 * CUR: Currency information (system generated/managed).
 * USR: User-defined off-ledger values (e.g., KPIs, non-financial data).
 */
export const OffLedgerKindEnum = z
  .enum(["CUR", "USR"])
  .describe(`Defines the kind of data stored in the OffLedger record.
  CUR: Currency information (system generated/managed).
  USR: User-defined off-ledger values (e.g., KPIs, non-financial data).`);

// --- OffLedger Schema ---

/**
 * Zod schema for the OffLedger record.
 * Internal file name: OffLedger
 * Stores time-series data for non-financial values (Kind=USR) or currency exchange rates (Kind=CUR).
 * The primary key is a composite of Kind and Name.
 */
export const offLedgerZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** Kind of record: 'CUR' for Currency or 'USR' for User-defined. Indexed. Max 3 chars. */
  Kind: OffLedgerKindEnum.describe(
    "Kind of record: 'CUR' for Currency or 'USR' for User-defined. Indexed. Max 3 chars.",
  ),
  /** Name/identifier for the record (e.g., currency code like 'USD', or user-defined name like 'StaffCount'). Indexed. Max 15 chars. */
  Name: z
    .string()
    .max(15)
    .describe(
      "Name/identifier for the record (e.g., currency code like 'USD', or user-defined name like 'StaffCount'). Indexed. Max 15 chars.",
    ),
  /** Description of the currency or user-defined value. Max 39 chars. */
  Description: z
    .string()
    .max(39)
    .nullable()
    .optional()
    .describe(
      "Description of the currency or user-defined value. Max 39 chars.",
    ),
  /** Bitmapped flags field (usage not explicitly detailed in appendix). */
  Flags: z
    .number()
    .describe(
      "Bitmapped flags field (usage not explicitly detailed in appendix).",
    ),
  /** Balance/Value for the 91st period prior to the current period. For CUR, this is the exchange rate. */
  Balance91: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Balance/Value for the 91st period prior to the current period. For CUR, this is the exchange rate.",
    ),
  /** Balance/Value for the 90th period prior to the current period. */
  Balance90: z
    .number()
    .nullable()
    .optional()
    .describe("Balance/Value for the 90th period prior to the current period."),
  // ... Balances for periods 89 down to 01 ... (Representing only a few for brevity)
  Balance89: z
    .number()
    .nullable()
    .optional()
    .describe("Balance/Value for the 89th period prior to the current period."),
  // Assume all BalanceLastXX fields follow the same pattern down to BalanceLast01
  Balance01: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Balance/Value for the 1st period prior to the current period (previous period).",
    ),
  /** Balance/Value for the current period (Balance00). */
  Balance00: z
    .number()
    .nullable()
    .optional()
    .describe("Balance/Value for the current period (Balance00)."), // Renamed Balance to Balance00 for consistency
  /** Budget value for the 29th period prior to the current period. */
  Budget29: z
    .number()
    .nullable()
    .optional()
    .describe("Budget value for the 29th period prior to the current period."),
  // ... Budgets for periods 28 down to 01 ... (Representing only a few for brevity)
  Budget28: z
    .number()
    .nullable()
    .optional()
    .describe("Budget value for the 28th period prior to the current period."),
  // Assume all BudgetLastXX fields follow the same pattern down to BudgetLast01
  Budget01: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Budget value for the 1st period prior to the current period (previous period).",
    ),
  /** Budget value for the current period (Budget00). */
  Budget00: z
    .number()
    .nullable()
    .optional()
    .describe("Budget value for the current period (Budget00)."), // Renamed BudgetA/B to Budget00 for consistency
  /** Budget value for the 1st future period. */
  BudgetNext01: z
    .number()
    .nullable()
    .optional()
    .describe("Budget value for the 1st future period."),
  // ... Budgets for periods Next02 to Next18 ... (Representing only a few for brevity)
  BudgetNext02: z
    .number()
    .nullable()
    .optional()
    .describe("Budget value for the 2nd future period."),
  // Assume all BudgetNextXX fields follow the same pattern up to BudgetNext18
  BudgetNext18: z
    .number()
    .nullable()
    .optional()
    .describe("Budget value for the 18th future period."),
  /** General ledger account code for unrealised currency gain/loss. Max 13 chars. */
  LinkedAccountU: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "General ledger account code for unrealised currency gain/loss. Max 13 chars.",
    ),
  /** General ledger account code for realised currency gain/loss. Max 13 chars. */
  LinkedAccountR: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "General ledger account code for realised currency gain/loss. Max 13 chars.",
    ),
  /** Preferred bank account code for receiving this currency. Max 7 chars. */
  PreferredBankCR: z
    .string()
    .max(7)
    .nullable()
    .optional()
    .describe(
      "Preferred bank account code for receiving this currency. Max 7 chars.",
    ),
  /** Preferred bank account code for paying with this currency. Max 7 chars. */
  PreferredBankCP: z
    .string()
    .max(7)
    .nullable()
    .optional()
    .describe(
      "Preferred bank account code for paying with this currency. Max 7 chars.",
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
});

/**
 * Inferred TypeScript type from the offLedgerZod schema.
 * Represents a fully validated OffLedger (Currency/User Value) record.
 */
export type OffLedgerZod = z.infer<typeof offLedgerZod>;

// Partial schema for updates
export const offLedgerPartialSchema = offLedgerZod.partial();

/**
 * Inferred TypeScript type from the offLedgerPartialSchema.
 * Represents an OffLedger record where all fields are optional.
 */
export type OffLedgerPartialZod = z.infer<typeof offLedgerPartialSchema>;
