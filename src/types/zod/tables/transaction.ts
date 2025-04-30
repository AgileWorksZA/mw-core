import { z } from "zod";

export const transactionZod = z.object({
  /** Unsigned long sequence number (indexed) */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). This is the unique internal identifier for the transaction.",
    ),
  /** Last modified timestamp */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this transaction record was last changed.",
    ),
  /** Our reference (indexed, mutable: conditionally) */
  OurRef: z
    .string()
    .max(12)
    .describe(
      "Our reference (indexed, mutable: conditionally). For Cash Payments, the cheque number; for Cash Receipts, the receipt number; for Debtor Invoices, the invoice number; for Creditor Invoices, your order number. For Journals, it is the Journal number, prefixed with the type of journal (JN for general journal, JS for stock journal, BK for banking journal).",
    ),
  /** Transaction date (indexed, mutable: conditionally) */
  TransDate: z
    .string()
    .describe(
      "Transaction date (indexed, mutable: conditionally). The date of the transaction. Should be specified in YYYY-MM-DD format.",
    ),
  /** Date entered (indexed) */
  EnterDate: z
    .string()
    .describe(
      "Date entered (indexed). The date on which the transaction was entered. Should be specified in YYYY-MM-DD format.",
    ),
  /** Due date (mutable: conditionally) */
  DueDate: z
    .string()
    .describe(
      "Due date (mutable: conditionally). For invoices, this is the date that the invoice is due for payment. Should be specified in YYYY-MM-DD format.",
    ),
  /** Period (indexed) */
  Period: z
    .number()
    .describe(
      "Period (indexed). A number representing the period of the transaction (100 * year_number + period_number).",
    ),
  /** Transaction type (indexed) */
  Type: z
    .enum([
      "CP", // Cash payment/purchase
      "CR", // Cash receipt/sale
      "DI", // Debtor invoice--incomplete
      "CI", // Creditor invoice--incomplete
      "JN", // General journal
      "SO", // Sales order (incomplete)
      "PO", // Purchase order (incomplete)
      "QU", // Quote
      "JNS", // Stock journal
      "CIC", // Creditor invoice--fully paid
      "CII", // Creditor invoice--incomplete (redundant with CI, but listed)
      "CPD", // Returned refund to debtor
      "CRC", // Receive refund from creditor
      "CRD", // Receipt for a debtor invoice (redundant with CR, but listed)
      "DIC", // Debtor invoice--fully paid
      "DII", // Debtor invoice--incomplete (redundant with DI, but listed)
      "POC", // Purchase order--fully paid (Bought)
      "POI", // Purchase order--incomplete (Pending PO)
      "SOC", // Sales order--fully shipped (Sold)
      "SOI", // Sales order--incomplete (Pending SO)
    ])
    .describe(
      "Transaction type (indexed). Defines the nature of the transaction.",
    ),
  /** Their reference  */
  TheirRef: z
    .string()
    .max(32)
    .describe(
      "Their reference . For debtor invoices, the customer's order number; for creditor invoices, the supplier's invoice number; for receipts, the cheque number.",
    ),
  /** Name code (indexed) */
  NameCode: z
    .string()
    .max(12)
    .describe(
      "Name code (indexed). Customer or Supplier Code associated with the transaction.",
    ),
  /** Flag  */
  Flag: z
    .string()
    .max(6)
    .describe(
      "Flag . If this field is not blank, a flag icon shows up in the status column of the transaction list.",
    ),
  /** Description (mutable: conditionally) */
  Description: z
    .string()
    .max(1024)
    .describe(
      "Description (mutable: conditionally). The description of the transaction, up to 1024 characters.",
    ),
  /** Gross amount */
  Gross: z
    .number()
    .describe(
      "Gross amount. The gross value of the transaction. This must be equal to the sum of the detail line gross values.",
    ),
  /** Analysis code  */
  Analysis: z
    .string()
    .max(10)
    .describe(
      "Analysis code . Can be used to tag a transaction (e.g., batch number, user initials).",
    ),
  /** Contra account */
  Contra: z
    .string()
    .max(8)
    .describe(
      "Contra account. For CP and CR transactions, the bank account code. For invoices, the accounts payable/receivable control account.",
    ),
  /** To/From details (mutable: conditionally) */
  ToFrom: z
    .string()
    .max(256)
    .describe(
      "To/From details (mutable: conditionally). The name of the person/entity the transaction is to or from. For a payment, the To field. For a receipt, the From field.",
    ),
  /** Status (indexed) */
  Status: z
    .enum(["U", "P"])
    .describe("Status (indexed). U for unposted or P for posted."),
  /** Hold status (mutable: conditionally) */
  Hold: z
    .boolean()
    .describe(
      "Hold status (mutable: conditionally). If true, transaction cannot be posted.",
    ),
  /** Date paid */
  DatePaid: z
    .string()
    .nullable()
    .describe(
      "Date paid. The date the last payment for an invoice was made. Should be specified in YYYY-MM-DD format.",
    ),
  /** Amount paid */
  AmtPaid: z
    .number()
    .describe("Amount paid. The amount of the invoice that has been paid."),
  /** Payment amount */
  PayAmount: z
    .number()
    .describe(
      "Payment amount. The amount of the invoice that you have elected to pay a creditor in the next payment run.",
    ),
  /** Aging period */
  Aging: z
    .number()
    .describe("Aging period. The aging cycle for the transaction."),
  /** Tax amount */
  TaxAmount: z
    .number()
    .describe(
      "Tax amount. The amount of GST/VAT/Tax involved for the transaction.",
    ),
  /** Tax cycle */
  TaxCycle: z
    .number()
    .describe(
      "Tax cycle. A number representing the GST/VAT/Tax cycle in which the transaction was processed. 0 for transactions not yet processed.",
    ),
  /** Recurring transaction flag */
  Recurring: z
    .boolean()
    .describe(
      "Recurring transaction flag. True if the transaction is set up to recur in the future.",
    ),
  /** Print status  */
  Printed: z
    .number()
    .describe(
      "Print status . 0 if not Printed; 1 if Printed.",
    ),
  /** Flags */
  Flags: z
    .number()
    .describe("Flags. See Transaction Flags table in documentation."),
  /** Tax processed amount */
  TaxProcessed: z.number().describe("Tax processed amount."),
  /** Salesperson code (mutable: conditionally) */
  Salesperson: z
    .string()
    .max(6)
    .describe(
      "Salesperson code (mutable: conditionally). Can be used for appending department to product control accounts.",
    ),
  /** Display color (mutable: conditionally) */
  Colour: z
    .number()
    .describe("Display color (mutable: conditionally). The color index, 0-7."),
  /** Bank journal sequence */
  BankJNSeq: z
    .number()
    .positive()
    .describe(
      "Bank journal sequence. The sequence number of the journal which banked the receipt (using the Banking command).",
    ),
  /** Payment method */
  PaymentMethod: z
    .number()
    .describe(
      "Payment method. 0=None, 1=Cash, 2=Cheque, 3=Electronic, 4=Credit Card, 5-7=User Defined.",
    ),
  /** Time posted */
  TimePosted: z
    .string()
    .describe("Time posted. Date and time transaction is posted."),
  /** Security level (indexed) */
  SecurityLevel: z
    .number()
    .describe(
      "Security level (indexed). Transaction's security level, highest of visible detail lines.",
    ),
  /** User field 1  */
  User1: z
    .string()
    .max(256)
    .describe("User field 1 ."),
  /** User field 2  */
  User2: z
    .string()
    .max(256)
    .describe("User field 2 ."),
  /** User field 3  */
  User3: z
    .string()
    .max(256)
    .describe("User field 3 ."),
  /** Prompt payment date  */
  PromptPaymentDate: z
    .string()
    .nullable()
    .describe(
      "Prompt payment date . The date the prompt payment discount expires. Should be specified in YYYY-MM-DD format.",
    ),
  /** Prompt payment amount */
  PromptPaymentAmt: z
    .number()
    .describe(
      "Prompt payment amount. The amount of the eligible prompt payment discount.",
    ),
  /** Product price code */
  ProdPriceCode: z
    .string()
    .max(2)
    .describe("Product price code. Pricing level (A-F)."),
  /** Mailing address (mutable: conditionally) */
  MailingAddress: z
    .string()
    .max(256)
    .describe(
      "Mailing address (mutable: conditionally). Blank if default from name.",
    ),
  /** Delivery address (mutable: conditionally) */
  DeliveryAddress: z
    .string()
    .max(256)
    .describe(
      "Delivery address (mutable: conditionally). Blank if default from name.",
    ),
  /** Freight code */
  FreightCode: z.string().max(32).describe("Freight code used for orders."),
  /** Freight amount */
  FreightAmount: z.number().describe("Freight amount of order."),
  /** Freight details  */
  FreightDetails: z
    .string()
    .max(256)
    .describe("Freight details ."),
  /** Special bank  */
  SpecialBank: z
    .string()
    .max(32)
    .describe(
      "Special bank . For receipts, the bank number of the cheque/card.",
    ),
  /** Special branch  */
  SpecialBranch: z
    .string()
    .max(32)
    .describe(
      "Special branch . For receipts, the branch of the cheque/card.",
    ),
  /** Special account  */
  SpecialAccount: z
    .string()
    .max(32)
    .describe(
      "Special account . For receipts, the account number of the cheque/card.",
    ),
  /** Currency */
  Currency: z
    .string()
    .max(4)
    .describe("Currency code (empty for local currency)."),
  /** Exchange rate */
  ExchangeRate: z
    .number()
    .describe("Exchange rate (0 for base currency transactions)."),
  /** Entered by user */
  EnteredBy: z
    .string()
    .max(4)
    .describe("Entered by user. Initials of user who entered the transaction."),
  /** Posted by user */
  PostedBy: z
    .string()
    .max(4)
    .describe("Posted by user. Initials of user who posted the transaction."),
  /** Amount written off */
  AmtWrittenOff: z
    .number()
    .describe(
      "Amount written off. For invoices, the amount written off in a write-off.",
    ),
  /** Order total */
  OrderTotal: z.number().describe("Order total. The total of the order."),
  /** Order shipped amount */
  OrderShipped: z.number().describe("Order shipped amount."),
  /** Order deposit */
  OrderDeposit: z
    .number()
    .describe("Order deposit. The accumulated deposit on an order."),
  /** Originating order sequence */
  OriginatingOrderSeq: z
    .number()
    .positive()
    .describe(
      "Originating order sequence. The sequence number of the order that created the invoice through the ship or receive goods commands.",
    ),
  /** Currency transfer sequence */
  CurrencyTransferSeq: z
    .number()
    .positive()
    .describe("Currency transfer sequence."),
  /** Prompt payment terms */
  PromptPaymentTerms: z
    .number()
    .describe(
      "Prompt payment terms. 0=None; >0 = days; <0 = Nth day of month following.",
    ),
  /** Prompt payment discount */
  PromptPaymentDisc: z.number().describe("Prompt payment discount percentage."),
  /** First approval user (mutable: conditionally, script-only) */
  ApprovedBy1: z
    .string()
    .max(4)
    .describe("First approval user (mutable: conditionally, script-only)."),
  /** Second approval user (mutable: conditionally, script-only) */
  ApprovedBy2: z
    .string()
    .max(4)
    .describe("Second approval user (mutable: conditionally, script-only)."),
  /** User number  */
  UserNum: z.number().describe("User number ."),
  /** User text  */
  UserText: z
    .string()
    .max(256)
    .describe("User text ."),
  /** User field 4  */
  User4: z
    .string()
    .max(16)
    .describe("User field 4 ."),
  /** User field 5  */
  User5: z
    .string()
    .max(16)
    .describe("User field 5 ."),
  /** User field 6  */
  User6: z
    .string()
    .max(16)
    .describe("User field 6 ."),
  /** User field 7  */
  User7: z
    .string()
    .max(16)
    .describe("User field 7 ."),
  /** User field 8  */
  User8: z
    .string()
    .max(16)
    .describe("User field 8 ."),
  /** Tagged text  */
  TaggedText: z
    .string()
    .max(256)
    .describe(
      "Tagged text . Scriptable tag storage.",
    ),
  /** Email status  */
  Emailed: z
    .number()
    .describe(
      "Email status . Non-zero if transaction has been emailed.",
    ),
  /** Transfer status  */
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
