import { z } from "zod";

// --- Payments Enums ---
// No specific enums identified for the Payments table itself based on the documentation.

// --- Payments Schema ---

/**
 * Zod schema for the Payments record.
 * Internal file name: Payments
 * Represents the many-to-many link between invoice transactions (Debtor or Creditor)
 * and the corresponding payment/receipt transactions that were allocated against them.
 * Each record links a specific payment/receipt transaction to a specific invoice transaction
 * and records the amount allocated.
 */
export const paymentsZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this payment allocation record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this payment allocation record.",
    ),
  /** Last modified timestamp. The date and time that this allocation record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this allocation record was last changed.",
    ),
  /** The sequence number of the Invoice transaction (DI or CI) that is being paid/credited by the CashTrans. Indexed. */
  InvoiceID: z
    .number()
    .positive()
    .describe(
      "The sequence number of the Invoice transaction (DI or CI) that is being paid/credited by the CashTrans. Indexed.",
    ),
  /** The sequence number of the Payment or Receipt transaction (CP, CR, CPD, CRC, CRD) being allocated to the InvoiceID. Indexed. */
  CashTrans: z
    .number()
    .positive()
    .describe(
      "The sequence number of the Payment or Receipt transaction (CP, CR, CPD, CRC, CRD) being allocated to the InvoiceID. Indexed.",
    ),
  /** The date the payment/receipt allocation occurred (usually the date of the CashTrans). Should be specified in YYYY-MM-DD format. */
  Date: z
    .string()
    .describe(
      "The date the payment/receipt allocation occurred (usually the date of the CashTrans). Should be specified in YYYY-MM-DD format.",
    ),
  /** The tax cycle number when this allocation was processed for GST/VAT/Tax (relevant for cash basis reporting). 0 if not processed. */
  GSTCycle: z
    .number()
    .describe(
      "The tax cycle number when this allocation was processed for GST/VAT/Tax (relevant for cash basis reporting). 0 if not processed.",
    ),
  /** The amount of the CashTrans transaction that was specifically allocated to this InvoiceID. */
  Amount: z
    .number()
    .describe(
      "The amount of the CashTrans transaction that was specifically allocated to this InvoiceID.",
    ),
});

/**
 * Inferred TypeScript type from the paymentsZod schema.
 * Represents a fully validated Payment Allocation record.
 */
export type PaymentsZod = z.infer<typeof paymentsZod>;

// Partial schema (less likely to be updated directly)
export const paymentsPartialSchema = paymentsZod.partial();

/**
 * Inferred TypeScript type from the paymentsPartialSchema.
 * Represents a Payments record where all fields are optional.
 */
export type PaymentsPartialZod = z.infer<typeof paymentsPartialSchema>;
