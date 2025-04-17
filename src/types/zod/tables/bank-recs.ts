import { z } from "zod";

/**
 * Zod schema for the Bank Reconciliation (BankRecs) record.
 * Internal file name: _recon
 */
export const bankRecsZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this reconciliation record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this reconciliation record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The general ledger account code that was reconciled. Max 8 chars. */
  Account: z
    .string()
    .max(8) // GL Account Code max size, although docs say T 8, let's assume it follows account code rules
    .describe(
      "The general ledger account code that was reconciled. Max 8 chars.",
    ),
  /** The opening balance used for the reconciliation. */
  Opening: z
    .number()
    .describe("The opening balance used for the reconciliation."),
  /** The closing balance from the bank statement used for the reconciliation. */
  Closing: z
    .number()
    .describe(
      "The closing balance from the bank statement used for the reconciliation.",
    ),
  /** The statement number from the bank statement. */
  Statement: z
    .number() // Typically an integer, but defined as N (Numeric)
    .describe("The statement number from the bank statement."),
  /** The statement date used for the reconciliation. Should be specified in YYYY-MM-DD format. */
  Date: z
    .string()
    .describe(
      "The statement date used for the reconciliation. Should be specified in YYYY-MM-DD format.",
    ),
  /** The date and time the reconciliation was finalised. */
  ReconciledTime: z // Renamed from 'Time' in docs for clarity
    .string()
    .describe("The date and time the reconciliation was finalised."),
  /** The difference between calculated closing balance and statement closing balance at finalisation. Should be zero for a successful reconciliation. */
  Discrepancy: z
    .number()
    .describe(
      "The difference between calculated closing balance and statement closing balance at finalisation. Should be zero for a successful reconciliation.",
    ),
});

/**
 * Inferred TypeScript type from the bankRecsZod schema.
 * Represents a fully validated Bank Reconciliation record.
 */
export type BankRecsZod = z.infer<typeof bankRecsZod>;

// Partial schema for updates (though these records are typically system-generated and not updated)
export const bankRecsPartialSchema = bankRecsZod.partial();

/**
 * Inferred TypeScript type from the bankRecsPartialSchema.
 * Represents a Bank Reconciliation record where all fields are optional.
 */
export type BankRecsPartialZod = z.infer<typeof bankRecsPartialSchema>;
