import { z } from "zod";

/**
 * Zod schema for the Transaction Detail Line (Detail) record.
 * Internal file name: Detail
 * Represents individual lines within a transaction, linking to accounts or products.
 * This table is a subfile of the Transaction table.
 */
export const detailZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this detail line. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this detail line.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** Sequence number of the parent transaction record. */
  ParentSeq: z
    .number()
    .positive()
    .describe(
      "Sequence number of the parent transaction record (Transaction.SequenceNumber).",
    ),
  /** The order/position of this detail line within the transaction. */
  Sort: z
    .number()
    .describe("The order/position of this detail line within the transaction."),
  /** The general ledger account code, potentially including a department suffix (e.g., 'CODE-DEPT'). Max 13 chars. */
  Account: z
    .string()
    .max(13)
    .describe(
      "The general ledger account code, potentially including a department suffix (e.g., 'CODE-DEPT'). Max 13 chars.",
    ),
  /** The department code extracted from the Account field (if departmentalised). Max 5 chars. */
  Dept: z
    .string()
    .max(5)
    .describe(
      "The department code extracted from the Account field (if departmentalised). Max 5 chars.",
    ),
  /** For stock purchase transactions, the buy quantity adjusted for the product conversion factor (quantity in sell units). */
  PostedQty: z
    .number()
    .describe(
      "For stock purchase transactions, the buy quantity adjusted for the product conversion factor (quantity in sell units).",
    ),
  /** The tax code applied to this detail line. Max 5 chars. */
  TaxCode: z
    .string()
    .max(5)
    .describe("The tax code applied to this detail line."),
  /** The gross amount for the detail line (Net + Tax). */
  Gross: z
    .number()
    .describe("The gross amount for the detail line (Net + Tax)."),
  /** The GST/VAT or Sales Tax amount for the detail line. */
  Tax: z
    .number()
    .describe("The GST/VAT or Sales Tax amount for the detail line."),
  /** The debit value of the detail line (Net/Extension for CR/DI). This is the amount debited to the account when posted. */
  Debit: z
    .number()
    .describe(
      "The debit value of the detail line (Net/Extension for CR/DI). This is the amount debited to the account when posted.",
    ),
  /** The credit value of the detail line (Net/Extension for CP/CI). This is the amount credited to the account when posted. */
  Credit: z
    .number()
    .describe(
      "The credit value of the detail line (Net/Extension for CP/CI). This is the amount credited to the account when posted.",
    ),
  /** The description for the detail line. Max 1020 chars. */
  Description: z
    .string()
    .max(1020)
    .nullable() // Can be empty
    .optional()
    .describe("The description for the detail line. Max 1020 chars."),
  /** The quantity of a product bought or sold. */
  StockQty: z
    .number()
    .nullable()
    .optional()
    .describe("The quantity of a product bought or sold."),
  /** The product code of a product. Max 31 chars. */
  StockCode: z
    .string()
    .max(31)
    .nullable()
    .optional()
    .describe("The product code of a product. Max 31 chars."),
  /** The cost price of the product (average for sales, buy price for purchases). */
  CostPrice: z
    .number()
    .nullable()
    .optional()
    .describe(
      "The cost price of the product (average for sales, buy price for purchases).",
    ),
  /** The selling price of the product (exclusive of tax and discount). */
  UnitPrice: z
    .number()
    .nullable()
    .optional()
    .describe(
      "The selling price of the product (exclusive of tax and discount).",
    ),
  /** Sequence number of the reconciliation record this line was reconciled in (0 or -1 if not finalised). */
  Statement: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Sequence number of the reconciliation record this line was reconciled in (0 or -1 if not finalised).",
    ),
  /** The job code to which this detail line relates. Max 9 chars. */
  JobCode: z
    .string()
    .max(9)
    .nullable()
    .optional()
    .describe("The job code to which this detail line relates. Max 9 chars."),
  /** The selling unit of the product (e.g., 'ea', 'kg'). Max 3 chars. */
  SaleUnit: z
    .string()
    .max(3)
    .nullable()
    .optional()
    .describe(
      "The selling unit of the product (e.g., 'ea', 'kg'). Max 3 chars.",
    ),
  /** The percentage discount applied to this line. */
  Discount: z
    .number()
    .nullable()
    .optional()
    .describe("The percentage discount applied to this line."),
  /** Bitmapped flags for the detail line. See documentation for specific flags. */
  Flags: z
    .number()
    .describe(
      "Bitmapped flags for the detail line. See documentation for specific flags.",
    ),
  /** The original order quantity for this line on an order. */
  OrderQty: z
    .number()
    .nullable()
    .optional()
    .describe("The original order quantity for this line on an order."),
  /** The quantity currently on backorder for this line on an order. */
  BackorderQty: z
    .number()
    .nullable()
    .optional()
    .describe("The quantity currently on backorder for this line on an order."),
  /** The quantity previously shipped or received for this line on an order. */
  PrevShipQty: z
    .number()
    .nullable()
    .optional()
    .describe(
      "The quantity previously shipped or received for this line on an order.",
    ),
  /** The net amount of the detail line converted to the base currency. */
  BaseCurrencyNet: z
    .number()
    .nullable()
    .optional()
    .describe(
      "The net amount of the detail line converted to the base currency.",
    ),
  /** The item's serial or batch number, if applicable. Max 31 chars. */
  SerialNumber: z
    .string()
    .max(31)
    .nullable()
    .optional()
    .describe(
      "The item's serial or batch number, if applicable. Max 31 chars.",
    ),
  /** The period number this detail line belongs to (inherited from parent transaction). */
  Period: z
    .number()
    .describe(
      "The period number this detail line belongs to (inherited from parent transaction).",
    ),
  /** The first two characters of the parent transaction type (e.g., CP, DI). */
  TransactionType: z
    .string()
    .max(2) // Typically 2 chars from parent Type
    .describe(
      "The first two characters of the parent transaction type (e.g., CP, DI).",
    ),
  /** The security level of the line, inherited from the account. */
  SecurityLevel: z
    .number()
    .describe("The security level of the line, inherited from the account."),
  /** The quantity involved in a stock revaluation journal. */
  RevalueQty: z
    .number()
    .nullable()
    .optional()
    .describe("The quantity involved in a stock revaluation journal."),
  /** The stock location for this item, if location tracking is enabled. Max 15 chars. */
  StockLocation: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe(
      "The stock location for this item, if location tracking is enabled. Max 15 chars.",
    ),
  /** Order status for this line: 0 if not shipped or part shipped, 1 if fully shipped/received. */
  OrderStatus: z
    .boolean()
    .describe(
      "Order status for this line: 0 if not shipped or part shipped, 1 if fully shipped/received.",
    ),
  /** The amount of non-claimable sales tax included in the cost (e.g., for US/Canada PST). */
  ExpensedTax: z
    .number()
    .nullable()
    .optional()
    .describe(
      "The amount of non-claimable sales tax included in the cost (e.g., for US/Canada PST).",
    ),
  /** The date associated with the detail line (e.g., batch expiry date). Should be specified in YYYY-MM-DD format. */
  Date: z
    .string()
    .nullable()
    .optional()
    .describe(
      "The date associated with the detail line (e.g., batch expiry date). Should be specified in YYYY-MM-DD format.",
    ),
  /** Additional bitmapped flags for the detail line. See documentation. */
  MoreFlags: z
    .number()
    .describe(
      "Additional bitmapped flags for the detail line. See documentation.",
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
  /** Quantity of non-inventoried items on an order received but not yet invoiced. */
  NonInvRcvdNotInvoicedQty: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Quantity of non-inventoried items on an order received but not yet invoiced.",
    ),
  /** Custom field 1 (scriptable). Max 31 chars. */
  Custom1: z
    .string()
    .max(31)
    .nullable()
    .optional()
    .describe("Custom field 1 (scriptable). Max 31 chars."),
  /** Custom field 2 (scriptable). Max 31 chars. */
  Custom2: z
    .string()
    .max(31)
    .nullable()
    .optional()
    .describe("Custom field 2 (scriptable). Max 31 chars."),
  /** The unit cost of an inventoried item before the transaction was posted (used for stock replenishment adjustments). */
  OriginalUnitCost: z
    .number()
    .nullable()
    .optional()
    .describe(
      "The unit cost of an inventoried item before the transaction was posted (used for stock replenishment adjustments).",
    ),
});

/**
 * Inferred TypeScript type from the detailZod schema.
 * Represents a fully validated Transaction Detail Line record.
 */
export type DetailZod = z.infer<typeof detailZod>;

// Partial schema for updates (highly unlikely as details are part of transactions)
export const detailPartialSchema = detailZod.partial();

/**
 * Inferred TypeScript type from the detailPartialSchema.
 * Represents a Transaction Detail Line record where all fields are optional.
 */
export type DetailPartialZod = z.infer<typeof detailPartialSchema>;
