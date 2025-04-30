import { z } from "zod";

// --- Transaction Enums ---

/**
 * Defines the possible statuses for a transaction. Indexed.
 * U: Unposted - The transaction has been entered but not yet affected ledger balances or stock levels.
 * P: Posted - The transaction has been finalized and affects ledger balances, stock levels, and customer/supplier balances.
 */
export const TransactionStatusEnum = z
  .enum(["U", "P"])
  .describe(`Defines the possible statuses for a transaction. Indexed.
  U: Unposted - The transaction has been entered but not yet affected ledger balances or stock levels.
  P: Posted - The transaction has been finalized and affects ledger balances, stock levels, and customer/supplier balances.`);

/**
 * Defines the possible types for a transaction, indicating its nature and accounting treatment. Indexed.
 * CP: Cash payment/purchase - Direct payment from a bank account for goods/services not previously invoiced by a creditor.
 * CR: Cash receipt/sale - Direct receipt into a bank account for goods/services not previously invoiced to a debtor.
 * DI: Debtor invoice--incomplete - An invoice issued to a debtor that is not yet fully paid.
 * CI: Creditor invoice--incomplete - An invoice received from a creditor that is not yet fully paid.
 * JN: General journal - A manual journal entry for adjustments, accruals, etc.
 * SO: Sales order (incomplete) - An order received from a customer for goods/services not yet fully shipped/invoiced.
 * PO: Purchase order (incomplete) - An order placed with a supplier for goods/services not yet fully received/invoiced.
 * QU: Quote - A price quote given to a customer, not yet accepted or converted to an order/invoice.
 * JNS: Stock journal - A journal specifically for adjusting stock quantities or values (Make, Break, Write-Off, Create, Revalue, Transfer).
 * CIC: Creditor invoice--fully paid - An invoice received from a creditor that has been fully paid.
 * CII: Creditor invoice--incomplete (same as CI, listed for completeness).
 * CPD: Returned refund to debtor - A payment transaction created when refunding an overpayment or credit note to a debtor.
 * CRC: Received refund from creditor - A receipt transaction created when receiving a refund for an overpayment or credit note from a creditor.
 * CRD: Receipt for a debtor invoice - A receipt transaction specifically allocated against one or more debtor invoices (often created via Batch Debtor Receipts).
 * DIC: Debtor invoice--fully paid - An invoice issued to a debtor that has been fully paid.
 * DII: Debtor invoice--incomplete (same as DI, listed for completeness).
 * POC: Purchase order--fully paid (Bought) - A purchase order where all items have been received and invoiced.
 * POI: Purchase order--incomplete (Pending PO) - A purchase order where items are still outstanding (same as PO).
 * SOC: Sales order--fully shipped (Sold) - A sales order where all items have been shipped and invoiced.
 * SOI: Sales order--incomplete (Pending SO) - A sales order where items are still outstanding (same as SO).
 */
export const TransactionTypeEnum = z
  .enum([
    "CP",
    "CR",
    "DI",
    "CI",
    "JN",
    "SO",
    "PO",
    "QU", // Base types
    "JNS", // Stock Journal
    "CIC",
    "CII", // Creditor Invoice Complete/Incomplete
    "CPD", // Debtor Refund Payment
    "CRC", // Creditor Refund Receipt
    "CRD", // Debtor Receipt
    "DIC",
    "DII", // Debtor Invoice Complete/Incomplete
    "POC",
    "POI", // Purchase Order Complete/Incomplete
    "SOC",
    "SOI", // Sales Order Complete/Incomplete
  ])
  .describe(`Defines the possible types for a transaction, indicating its nature and accounting treatment. Indexed.
  CP: Cash payment/purchase
  CR: Cash receipt/sale
  DI: Debtor invoice--incomplete
  CI: Creditor invoice--incomplete
  JN: General journal
  SO: Sales order (incomplete)
  PO: Purchase order (incomplete)
  QU: Quote
  JNS: Stock journal
  CIC: Creditor invoice--fully paid
  CII: Creditor invoice--incomplete (same as CI, listed for completeness)
  CPD: Returned refund to debtor payment
  CRC: Received refund from creditor receipt
  CRD: Receipt for a debtor invoice (same as CR, listed for completeness)
  DIC: Debtor invoice--fully paid
  DII: Debtor invoice--incomplete (same as DI, listed for completeness)
  POC: Purchase order--fully paid (Bought)
  POI: Purchase order--incomplete (Pending PO)
  SOC: Sales order--fully shipped (Sold)
  SOI: Sales order--incomplete (Pending SO)`);

// --- Transaction Schema ---

export const transactionZod = z.object({
  /** Unsigned long sequence number (indexed). This is the unique internal identifier for the transaction. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). This is the unique internal identifier for the transaction.",
    ),
  /** Last modified timestamp. The date and time that this transaction record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this transaction record was last changed.",
    ),
  /** Our reference (indexed, mutable: conditionally). Varies by transaction type (cheque#, receipt#, invoice#, order#). */
  OurRef: z
    .string()
    .max(12)
    .describe(
      "Our reference (indexed, mutable: conditionally). For Cash Payments, the cheque number; for Cash Receipts, the receipt number; for Debtor Invoices, the invoice number; for Creditor Invoices, your order number. For Journals, it is the Journal number, prefixed with the type of journal (JN for general journal, JS for stock journal, BK for banking journal).",
    ),
  /** Transaction date (indexed, mutable: conditionally). Should be specified in YYYY-MM-DD format. */
  TransDate: z
    .string()
    .describe(
      "Transaction date (indexed, mutable: conditionally). The date of the transaction. Should be specified in YYYY-MM-DD format.",
    ),
  /** Date entered (indexed). Should be specified in YYYY-MM-DD format. */
  EnterDate: z
    .string()
    .describe(
      "Date entered (indexed). The date on which the transaction was entered. Should be specified in YYYY-MM-DD format.",
    ),
  /** Due date (mutable: conditionally). For invoices, the payment due date. Should be specified in YYYY-MM-DD format. */
  DueDate: z
    .string()
    .describe(
      "Due date (mutable: conditionally). For invoices, this is the date that the invoice is due for payment. Should be specified in YYYY-MM-DD format.",
    ),
  /** Period (indexed). A number representing the period of the transaction (100 * year_number + period_number). */
  Period: z
    .number()
    .describe(
      "Period (indexed). A number representing the period of the transaction (100 * year_number + period_number).",
    ),
  /** Transaction type (indexed). Defines the nature of the transaction. */
  Type: TransactionTypeEnum, // Using the defined enum
  /** Their reference . Max 32 chars. */
  TheirRef: z
    .string()
    .max(32)
    .describe(
      "Their reference . For debtor invoices, the customer's order number; for creditor invoices, the supplier's invoice number; for receipts, the cheque number.",
    ),
  /** Name code (indexed). Customer or Supplier Code associated with the transaction. Max 12 chars. */
  NameCode: z
    .string()
    .max(12)
    .describe(
      "Name code (indexed). Customer or Supplier Code associated with the transaction.",
    ),
  /** Flag . If not blank, a flag icon shows in the transaction list. Max 6 chars. */
  Flag: z
    .string()
    .max(6)
    .describe(
      "Flag . If this field is not blank, a flag icon shows up in the status column of the transaction list.",
    ),
  /** Description (mutable: conditionally). Max 1024 characters. */
  Description: z
    .string()
    .max(1024)
    .describe(
      "Description (mutable: conditionally). The description of the transaction, up to 1024 characters.",
    ),
  /** Gross amount. Must equal the sum of detail line gross values. */
  Gross: z
    .number()
    .describe(
      "Gross amount. The gross value of the transaction. This must be equal to the sum of the detail line gross values.",
    ),
  /** Analysis code . Used for tagging (e.g., batch number, user initials). Max 10 chars. */
  Analysis: z
    .string()
    .max(10)
    .describe(
      "Analysis code . Can be used to tag a transaction (e.g., batch number, user initials).",
    ),
  /** Contra account. Bank account for CP/CR, AP/AR control account for invoices. Max 8 chars. */
  Contra: z
    .string()
    .max(8)
    .describe(
      "Contra account. For CP and CR transactions, the bank account code. For invoices, the accounts payable/receivable control account.",
    ),
  /** To/From details (mutable: conditionally). Name of the other party. Max 256 chars. */
  ToFrom: z
    .string()
    .max(256)
    .describe(
      "To/From details (mutable: conditionally). The name of the person/entity the transaction is to or from. For a payment, the To field. For a receipt, the From field.",
    ),
  /** Status (indexed). U for unposted or P for posted. */
  Status: TransactionStatusEnum, // Using the defined enum
  /** Hold status (mutable: conditionally). If true, transaction cannot be posted. */
  Hold: z
    .boolean()
    .describe(
      "Hold status (mutable: conditionally). If true, transaction cannot be posted.",
    ),
  /** Date paid. Last payment date for an invoice. Should be specified in YYYY-MM-DD format. */
  DatePaid: z
    .string()
    .nullable()
    .describe(
      "Date paid. The date the last payment for an invoice was made. Should be specified in YYYY-MM-DD format.",
    ),
  /** Amount paid. Total amount paid against the invoice. */
  AmtPaid: z
    .number()
    .describe("Amount paid. The amount of the invoice that has been paid."),
  /** Payment amount. Amount allocated to pay a creditor in the next payment run. */
  PayAmount: z
    .number()
    .describe(
      "Payment amount. The amount of the invoice that you have elected to pay a creditor in the next payment run.",
    ),
  /** Aging period. The aging cycle number for the transaction. */
  Aging: z
    .number()
    .describe("Aging period. The aging cycle for the transaction."),
  /** Tax amount. Total GST/VAT/Tax amount for the transaction. */
  TaxAmount: z
    .number()
    .describe(
      "Tax amount. The amount of GST/VAT/Tax involved for the transaction.",
    ),
  /** Tax cycle. GST/VAT/Tax cycle number when processed (0 if not processed). */
  TaxCycle: z
    .number()
    .describe(
      "Tax cycle. A number representing the GST/VAT/Tax cycle in which the transaction was processed. 0 for transactions not yet processed.",
    ),
  /** Recurring transaction flag. True if set up to recur. */
  Recurring: z
    .boolean()
    .describe(
      "Recurring transaction flag. True if the transaction is set up to recur in the future.",
    ),
  /** Print status . 0 if not Printed; 1 if Printed. */
  Printed: z
    .number()
    .describe(
      "Print status . 0 if not Printed; 1 if Printed.",
    ),
  /** Flags. Bitmapped field indicating various transaction states. See documentation. */
  Flags: z
    .number()
    .describe("Flags. See Transaction Flags table in documentation."),
  /** Tax processed amount. */
  TaxProcessed: z.number().describe("Tax processed amount."),
  /** Salesperson code (mutable: conditionally). Can append department to product control accounts. Max 6 chars. */
  Salesperson: z
    .string()
    .max(6)
    .describe(
      "Salesperson code (mutable: conditionally). Can be used for appending department to product control accounts.",
    ),
  /** Display color (mutable: conditionally). Index 0-7. */
  Colour: z
    .number()
    .min(0)
    .max(7)
    .describe("Display color (mutable: conditionally). The color index, 0-7."),
  /** Bank journal sequence. Sequence number of the banking journal for a receipt. */
  BankJNSeq: z
    .number()
    .positive()
    .describe(
      "Bank journal sequence. The sequence number of the journal which banked the receipt (using the Banking command).",
    ),
  /** Payment method. 0=None, 1=Cash, 2=Cheque, 3=Electronic, 4=Credit Card, 5-7=User Defined. */
  PaymentMethod: z
    .number()
    .describe(
      "Payment method. 0=None, 1=Cash, 2=Cheque, 3=Electronic, 4=Credit Card, 5-7=User Defined.",
    ),
  /** Time posted. Date and time transaction was posted. */
  TimePosted: z
    .string()
    .describe("Time posted. Date and time transaction is posted."),
  /** Security level (indexed). Highest level of visible detail lines. */
  SecurityLevel: z
    .number()
    .describe(
      "Security level (indexed). Transaction's security level, highest of visible detail lines.",
    ),
  /** User field 1 . Max 256 chars. */
  User1: z
    .string()
    .max(256)
    .describe("User field 1 ."),
  /** User field 2 . Max 256 chars. */
  User2: z
    .string()
    .max(256)
    .describe("User field 2 ."),
  /** User field 3 . Max 256 chars. */
  User3: z
    .string()
    .max(256)
    .describe("User field 3 ."),
  /** Prompt payment date . Discount expiry date. Should be specified in YYYY-MM-DD format. */
  PromptPaymentDate: z
    .string()
    .nullable()
    .describe(
      "Prompt payment date . The date the prompt payment discount expires. Should be specified in YYYY-MM-DD format.",
    ),
  /** Prompt payment amount. Eligible discount amount. */
  PromptPaymentAmt: z
    .number()
    .describe(
      "Prompt payment amount. The amount of the eligible prompt payment discount.",
    ),
  /** Product price code. Pricing level (A-F). Max 2 chars. */
  ProdPriceCode: z
    .string()
    .max(2)
    .describe("Product price code. Pricing level (A-F)."),
  /** Mailing address (mutable: conditionally). Blank if default from name. Max 256 chars. */
  MailingAddress: z
    .string()
    .max(256)
    .describe(
      "Mailing address (mutable: conditionally). Blank if default from name.",
    ),
  /** Delivery address (mutable: conditionally). Blank if default from name. Max 256 chars. */
  DeliveryAddress: z
    .string()
    .max(256)
    .describe(
      "Delivery address (mutable: conditionally). Blank if default from name.",
    ),
  /** Freight code. Code for freight item used on orders. Max 32 chars. */
  FreightCode: z.string().max(32).describe("Freight code used for orders."),
  /** Freight amount. Freight amount on the order. */
  FreightAmount: z.number().describe("Freight amount of order."),
  /** Freight details . Max 256 chars. */
  FreightDetails: z
    .string()
    .max(256)
    .describe("Freight details ."),
  /** Special bank . Bank number for receipts. Max 32 chars. */
  SpecialBank: z
    .string()
    .max(32)
    .describe(
      "Special bank . For receipts, the bank number of the cheque/card.",
    ),
  /** Special branch . Branch for receipts. Max 32 chars. */
  SpecialBranch: z
    .string()
    .max(32)
    .describe(
      "Special branch . For receipts, the branch of the cheque/card.",
    ),
  /** Special account . Account number for receipts. Max 32 chars. */
  SpecialAccount: z
    .string()
    .max(32)
    .describe(
      "Special account . For receipts, the account number of the cheque/card.",
    ),
  /** Currency code (empty for local currency). Max 4 chars. */
  Currency: z
    .string()
    .max(4)
    .describe("Currency code (empty for local currency)."),
  /** Exchange rate (0 for base currency transactions). */
  ExchangeRate: z
    .number()
    .describe("Exchange rate (0 for base currency transactions)."),
  /** Entered by user. Initials of user who entered the transaction. Max 4 chars. */
  EnteredBy: z
    .string()
    .max(4)
    .describe("Entered by user. Initials of user who entered the transaction."),
  /** Posted by user. Initials of user who posted the transaction. Max 4 chars. */
  PostedBy: z
    .string()
    .max(4)
    .describe("Posted by user. Initials of user who posted the transaction."),
  /** Amount written off. For invoices, the amount written off. */
  AmtWrittenOff: z
    .number()
    .describe(
      "Amount written off. For invoices, the amount written off in a write-off.",
    ),
  /** Order total. The total value of the order. */
  OrderTotal: z.number().describe("Order total. The total of the order."),
  /** Order shipped amount. The value of items shipped from the order. */
  OrderShipped: z.number().describe("Order shipped amount."),
  /** Order deposit. The accumulated deposit amount paid on an order. */
  OrderDeposit: z
    .number()
    .describe("Order deposit. The accumulated deposit on an order."),
  /** Originating order sequence. Sequence number of the originating Sales/Purchase Order. */
  OriginatingOrderSeq: z
    .number()
    .positive()
    .describe(
      "Originating order sequence. The sequence number of the order that created the invoice through the ship or receive goods commands.",
    ),
  /** Currency transfer sequence. Sequence number of related currency transfer transaction. */
  CurrencyTransferSeq: z
    .number()
    .positive()
    .describe("Currency transfer sequence."),
  /** Prompt payment terms. 0=None; >0 = days; <0 = Nth day of month following. */
  PromptPaymentTerms: z
    .number()
    .describe(
      "Prompt payment terms. 0=None; >0 = days; <0 = Nth day of month following.",
    ),
  /** Prompt payment discount percentage. */
  PromptPaymentDisc: z.number().describe("Prompt payment discount percentage."),
  /** First approval user (mutable: conditionally, script-only). Initials of first approver. Max 4 chars. */
  ApprovedBy1: z
    .string()
    .max(4)
    .describe("First approval user (mutable: conditionally, script-only)."),
  /** Second approval user (mutable: conditionally, script-only). Initials of second approver. Max 4 chars. */
  ApprovedBy2: z
    .string()
    .max(4)
    .describe("Second approval user (mutable: conditionally, script-only)."),
  /** User number . User-defined numeric field. */
  UserNum: z.number().describe("User number ."),
  /** User text . User-defined text field. Max 256 chars. */
  UserText: z
    .string()
    .max(256)
    .describe("User text ."),
  /** User field 4 . User-defined text field. Max 16 chars. */
  User4: z
    .string()
    .max(16)
    .describe("User field 4 ."),
  /** User field 5 . User-defined text field. Max 16 chars. */
  User5: z
    .string()
    .max(16)
    .describe("User field 5 ."),
  /** User field 6 . User-defined text field. Max 16 chars. */
  User6: z
    .string()
    .max(16)
    .describe("User field 6 ."),
  /** User field 7 . User-defined text field. Max 16 chars. */
  User7: z
    .string()
    .max(16)
    .describe("User field 7 ."),
  /** User field 8 . User-defined text field. Max 16 chars. */
  User8: z
    .string()
    .max(16)
    .describe("User field 8 ."),
  /** Tagged text . Storage for key-value pairs used by scripts. Max 256 chars. */
  TaggedText: z
    .string()
    .max(256)
    .describe(
      "Tagged text . Scriptable tag storage.",
    ),
  /** Email status . Non-zero if the transaction has been emailed. */
  Emailed: z
    .number()
    .describe(
      "Email status . Non-zero if transaction has been emailed.",
    ),
  /** Transfer status . Non-zero if the transaction has been sent as an eInvoice. */
  Transferred: z
    .number()
    .describe(
      "Transfer status . Non-zero if transaction has been sent as eInvoice.",
    ),
});

/**
 * Inferred TypeScript type from the transactionZod schema.
 * Represents a fully validated Transaction record.
 */
export type TransactionZod = z.infer<typeof transactionZod>;

// --- Asset Enums ---

/**
 * Defines the possible statuses for a fixed asset. Indexed.
 * NEW: Newly entered asset, not yet depreciated. Can be modified/deleted.
 * ACT: Active asset, has been depreciated. Cannot be modified/deleted easily.
 * NDP: Non-depreciable asset. Acquired and disposed but not depreciated.
 * OTH: Other asset type for record keeping. Can be modified/deleted, not depreciated.
 * DSP: Disposed asset. Has been sold or written off. Can be deleted.
 */
export const AssetStatusEnum = z
  .enum(["NEW", "ACT", "NDP", "OTH", "DSP"])
  .describe(`Defines the possible statuses for a fixed asset. Indexed.
  NEW: Newly entered asset, not yet depreciated. Can be modified/deleted.
  ACT: Active asset, has been depreciated. Cannot be modified/deleted easily.
  NDP: Non-depreciable asset. Acquired and disposed but not depreciated.
  OTH: Other asset type for record keeping. Can be modified/deleted, not depreciated.
  DSP: Disposed asset. Has been sold or written off. Can be deleted.`);

/**
 * Defines the possible depreciation methods for a fixed asset.
 * SL: Straight Line depreciation. Depreciates evenly over the asset's life.
 * DV: Diminishing Value depreciation. Depreciates by a fixed percentage of the remaining book value each year.
 */
export const DepreciationMethodEnum = z
  .enum(["SL", "DV"])
  .describe(`Defines the possible depreciation methods for a fixed asset.
  SL: Straight Line depreciation. Depreciates evenly over the asset's life.
  DV: Diminishing Value depreciation. Depreciates by a fixed percentage of the remaining book value each year.`);

// --- Asset Schema ---

export const assetZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for the asset record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for the asset record.",
    ),
  /** Last modified timestamp. The date and time that this asset record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this asset record was last changed.",
    ),
  /** A unique code for the asset, up to 19 characters long. */
  Code: z
    .string()
    .max(19)
    .describe("A unique code for the asset, up to 19 characters long."),
  /** The description of the asset, up to 63 characters. */
  Description: z
    .string()
    .max(63)
    .describe("The description of the asset, up to 63 characters."),
  /** The Asset Category of the asset. Must correspond to an existing Asset Category code. Max 7 chars. */
  Category: z
    .string()
    .max(7)
    .describe(
      "The Asset Category of the asset. Must correspond to an existing Asset Category code.",
    ),
  /** A serial number for the asset, up to 31 characters. */
  SerialNum: z
    .string()
    .max(31)
    .nullable()
    .optional()
    .describe("A serial number for the asset, up to 31 characters."),
  /** The quantity of the asset (normally 1, but can be a set). */
  Qty: z
    .number()
    .describe("The quantity of the asset (normally 1, but can be a set)."),
  /** The expected life in years of the asset (informational). */
  ExpectedLife: z
    .number()
    .nullable()
    .optional()
    .describe("The expected life in years of the asset (informational)."),
  /** The cost (per unit) of the asset. For new assets, this is the acquisition cost. */
  Cost: z
    .number()
    .describe(
      "The cost (per unit) of the asset. For new assets, this is the acquisition cost.",
    ),
  /** The accumulated depreciation recorded against the asset. */
  AccumDepreciation: z
    .number()
    .describe("The accumulated depreciation recorded against the asset."),
  /** Date on which the asset was acquired. Should be specified in YYYY-MM-DD format. */
  AcquisitionDate: z
    .string()
    .describe(
      "Date on which the asset was acquired. Should be specified in YYYY-MM-DD format.",
    ),
  /** Date on which the asset was last depreciated. Should be specified in YYYY-MM-DD format. Blank for new assets. */
  LastDepreciatedDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Date on which the asset was last depreciated. Should be specified in YYYY-MM-DD format. Blank for new assets.",
    ),
  /** The sequencenumber of the purchase transaction for the asset. Can be linked via 'Link Invoice'. */
  AcquisitionSeq: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe(
      "The sequencenumber of the purchase transaction for the asset. Can be linked via 'Link Invoice'.",
    ),
  /** The sequencenumber of the last disposal transaction for the asset. */
  DisposalSeq: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe(
      "The sequencenumber of the last disposal transaction for the asset.",
    ),
  /** Where the asset is kept, up to 15 characters. */
  Location: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Where the asset is kept, up to 15 characters."),
  /** The asset department (must be a MoneyWorks Department code). Max 5 chars. */
  Dept: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe("The asset department (must be a MoneyWorks Department code)."),
  /** The percent of the asset used privately (0-100). Only applicable if Category allows private use. */
  PrivateUsePercent: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .describe(
      "The percent of the asset used privately (0-100). Only applicable if Category allows private use.",
    ),
  /** The asset status. */
  Status: AssetStatusEnum, // Using the defined enum
  /** User initials (up to 3 chars) who last modified the asset record. */
  LastModifiedBy: z
    .string()
    .max(3)
    .nullable()
    .optional()
    .describe(
      "User initials (up to 3 chars) who last modified the asset record.",
    ),
  /** Date of last revaluation (blank if none). Should be specified in YYYY-MM-DD format. */
  LastRevaluedDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Date of last revaluation (blank if none). Should be specified in YYYY-MM-DD format.",
    ),
  /** Expected residual value at end of life (informational). */
  ExpectedResidualValue: z
    .number()
    .nullable()
    .optional()
    .describe("Expected residual value at end of life (informational)."),
  /** Total revalued amount (positive if surplus, negative if impairment). */
  RevalSurplusImpairAmt: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Total revalued amount (positive if surplus, negative if impairment).",
    ),
  /** User defined number (scriptable). */
  UserNum: z
    .number()
    .nullable()
    .optional()
    .describe("User defined number (scriptable)."),
  /** User defined text (scriptable), up to 255 characters. */
  UserText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User defined text (scriptable), up to 255 characters."),
  /** Total adjustments to accumulated depreciation due to revaluations. */
  AccumDepnAdj: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Total adjustments to accumulated depreciation due to revaluations.",
    ),
  /** The current book value (Cost * Qty - AccumDepreciation). */
  BookValue: z
    .number()
    .describe("The current book value (Cost * Qty - AccumDepreciation)."),
  /** Date last disposed. Should be specified in YYYY-MM-DD format. */
  DisposalDate: z
    .string()
    .nullable()
    .optional()
    .describe("Date last disposed. Should be specified in YYYY-MM-DD format."),
  /** The gain or loss on asset disposal. */
  GainLossOnDisposal: z
    .number()
    .nullable()
    .optional()
    .describe("The gain or loss on asset disposal."),
  /** Colour of record (0-7 index). */
  Colour: z
    .number()
    .min(0)
    .max(7)
    .nullable()
    .optional()
    .describe("Colour of record (0-7 index)."),
  /** Scriptable tag storage, up to 255 characters. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage, up to 255 characters."),
  /** Depreciation type: SL (straight line) or DV (diminishing value). */
  Type: DepreciationMethodEnum, // Using the defined enum
  /** Depreciation rate percentage. */
  Rate: z.number().describe("Depreciation rate percentage."),
  /** Comments on asset, up to 1020 characters. */
  Comment: z
    .string()
    .max(1020)
    .nullable()
    .optional()
    .describe("Comments on asset, up to 1020 characters."),
  /** Custom field 1, up to 255 characters. */
  Custom1: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom field 1, up to 255 characters."),
  /** Custom field 2, up to 255 characters. */
  Custom2: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom field 2, up to 255 characters."),
  /** Custom field 3, up to 15 characters. */
  Custom3: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 3, up to 15 characters."),
  /** Custom field 4, up to 15 characters. */
  Custom4: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 4, up to 15 characters."),
});

/**
 * Inferred TypeScript type from the assetZod schema.
 * Represents a fully validated Asset record.
 */
export type AssetZod = z.infer<typeof assetZod>;

export const assetPartialSchema = assetZod.partial();

/**
 * Inferred TypeScript type from the assetPartialSchema.
 * Represents an Asset record where all fields are optional.
 */
export type AssetPartialZod = z.infer<typeof assetPartialSchema>;
