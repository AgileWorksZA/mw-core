import { z } from "zod";

export const transactionZod = z.object({
  /** Unsigned long sequence number (indexed) */
  SequenceNumber: z
    .number()
    .int()
    .positive()
    .describe("Unsigned long sequence number (indexed)"),
  /** Last modified timestamp */
  LastModifiedTime: z.string().describe("Last modified timestamp"),
  /** Our reference (indexed, mutable: conditionally) */
  OurRef: z
    .string()
    .max(12)
    .describe("Our reference (indexed, mutable: conditionally)"),
  /** Transaction string (indexed, mutable: conditionally) */
  TransDate: z
    .string()
    .describe("Transaction string (indexed, mutable: conditionally)"),
  /** Date entered (indexed) */
  EnterDate: z.string().describe("Date entered (indexed)"),
  /** Due string (mutable: conditionally) */
  DueDate: z.string().describe("Due string (mutable: conditionally)"),
  /** Period (indexed) */
  Period: z.number().int().describe("Period (indexed)"),
  /** Transaction type (indexed) */
  Type: z.string().max(4).describe("Transaction type (indexed)"),
  /** Their reference (mutable: freely, script-only) */
  TheirRef: z
    .string()
    .max(32)
    .describe("Their reference (mutable: freely, script-only)"),
  /** Name code (indexed) */
  NameCode: z.string().max(12).describe("Name code (indexed)"),
  /** Flag (mutable: freely, script-only) */
  Flag: z.string().max(6).describe("Flag (mutable: freely, script-only)"),
  /** Description (mutable: conditionally) */
  Description: z
    .string()
    .max(1024)
    .describe("Description (mutable: conditionally)"),
  /** Gross amount */
  Gross: z.number().describe("Gross amount"),
  /** Analysis code (mutable: freely, script-only) */
  Analysis: z
    .string()
    .max(10)
    .describe("Analysis code (mutable: freely, script-only)"),
  /** Contra account */
  Contra: z.string().max(8).describe("Contra account"),
  /** To/From details (mutable: conditionally) */
  ToFrom: z
    .string()
    .max(256)
    .describe("To/From details (mutable: conditionally)"),
  /** Status (indexed) */
  Status: z.string().max(2).describe("Status (indexed)"),
  /** Hold status (mutable: conditionally) */
  Hold: z.boolean().describe("Hold status (mutable: conditionally)"),
  /** Date paid */
  DatePaid: z.string().nullable().describe("Date paid"),
  /** Amount paid */
  AmtPaid: z.number().describe("Amount paid"),
  /** Payment amount */
  PayAmount: z.number().describe("Payment amount"),
  /** Aging period */
  Aging: z.number().int().describe("Aging period"),
  /** Tax amount */
  TaxAmount: z.number().describe("Tax amount"),
  /** Tax cycle */
  TaxCycle: z.number().int().describe("Tax cycle"),
  /** Recurring transaction flag */
  Recurring: z.boolean().describe("Recurring transaction flag"),
  /** Print status (mutable: freely, script-only) */
  Printed: z
    .number()
    .int()
    .describe("Print status (mutable: freely, script-only)"),
  /** Flags */
  Flags: z.number().int().describe("Flags"),
  /** Tax processed amount */
  TaxProcessed: z.number().describe("Tax processed amount"),
  /** Salesperson code (mutable: conditionally) */
  Salesperson: z
    .string()
    .max(6)
    .describe("Salesperson code (mutable: conditionally)"),
  /** Display color (mutable: conditionally) */
  Colour: z.number().int().describe("Display color (mutable: conditionally)"),
  /** Bank journal sequence */
  BankJNSeq: z.number().int().positive().describe("Bank journal sequence"),
  /** Payment method */
  PaymentMethod: z.number().int().describe("Payment method"),
  /** Time posted */
  TimePosted: z.string().describe("Time posted"),
  /** Security level (indexed) */
  SecurityLevel: z.number().int().describe("Security level (indexed)"),
  /** User field 1 (mutable: freely, script-only) */
  User1: z
    .string()
    .max(256)
    .describe("User field 1 (mutable: freely, script-only)"),
  /** User field 2 (mutable: freely, script-only) */
  User2: z
    .string()
    .max(256)
    .describe("User field 2 (mutable: freely, script-only)"),
  /** User field 3 (mutable: freely, script-only) */
  User3: z
    .string()
    .max(256)
    .describe("User field 3 (mutable: freely, script-only)"),
  /** Prompt payment string (mutable: freely, script-only) */
  PromptPaymentDate: z
    .string()
    .nullable()
    .describe("Prompt payment string (mutable: freely, script-only)"),
  /** Prompt payment amount */
  PromptPaymentAmt: z.number().describe("Prompt payment amount"),
  /** Product price code */
  ProdPriceCode: z.string().max(2).describe("Product price code"),
  /** Mailing address (mutable: conditionally) */
  MailingAddress: z
    .string()
    .max(256)
    .describe("Mailing address (mutable: conditionally)"),
  /** Delivery address (mutable: conditionally) */
  DeliveryAddress: z
    .string()
    .max(256)
    .describe("Delivery address (mutable: conditionally)"),
  /** Freight code */
  FreightCode: z.string().max(32).describe("Freight code"),
  /** Freight amount */
  FreightAmount: z.number().describe("Freight amount"),
  /** Freight details (mutable: freely, script-only) */
  FreightDetails: z
    .string()
    .max(256)
    .describe("Freight details (mutable: freely, script-only)"),
  /** Special bank (mutable: freely, script-only) */
  SpecialBank: z
    .string()
    .max(32)
    .describe("Special bank (mutable: freely, script-only)"),
  /** Special branch (mutable: freely, script-only) */
  SpecialBranch: z
    .string()
    .max(32)
    .describe("Special branch (mutable: freely, script-only)"),
  /** Special account (mutable: freely, script-only) */
  SpecialAccount: z
    .string()
    .max(32)
    .describe("Special account (mutable: freely, script-only)"),
  /** Currency */
  Currency: z.string().max(4).describe("Currency"),
  /** Exchange rate */
  ExchangeRate: z.number().describe("Exchange rate"),
  /** Entered by user */
  EnteredBy: z.string().max(4).describe("Entered by user"),
  /** Posted by user */
  PostedBy: z.string().max(4).describe("Posted by user"),
  /** Amount written off */
  AmtWrittenOff: z.number().describe("Amount written off"),
  /** Order total */
  OrderTotal: z.number().describe("Order total"),
  /** Order shipped amount */
  OrderShipped: z.number().describe("Order shipped amount"),
  /** Order deposit */
  OrderDeposit: z.number().describe("Order deposit"),
  /** Originating order sequence */
  OriginatingOrderSeq: z
    .number()
    .int()
    .positive()
    .describe("Originating order sequence"),
  /** Currency transfer sequence */
  CurrencyTransferSeq: z
    .number()
    .int()
    .positive()
    .describe("Currency transfer sequence"),
  /** Prompt payment terms */
  PromptPaymentTerms: z.number().int().describe("Prompt payment terms"),
  /** Prompt payment discount */
  PromptPaymentDisc: z.number().describe("Prompt payment discount"),
  /** First approval user (mutable: conditionally, script-only) */
  ApprovedBy1: z
    .string()
    .max(4)
    .describe("First approval user (mutable: conditionally, script-only)"),
  /** Second approval user (mutable: conditionally, script-only) */
  ApprovedBy2: z
    .string()
    .max(4)
    .describe("Second approval user (mutable: conditionally, script-only)"),
  /** User number (mutable: freely, script-only) */
  UserNum: z.number().describe("User number (mutable: freely, script-only)"),
  /** User text (mutable: freely, script-only) */
  UserText: z
    .string()
    .max(256)
    .describe("User text (mutable: freely, script-only)"),
  /** User field 4 (mutable: freely, script-only) */
  User4: z
    .string()
    .max(16)
    .describe("User field 4 (mutable: freely, script-only)"),
  /** User field 5 (mutable: freely, script-only) */
  User5: z
    .string()
    .max(16)
    .describe("User field 5 (mutable: freely, script-only)"),
  /** User field 6 (mutable: freely, script-only) */
  User6: z
    .string()
    .max(16)
    .describe("User field 6 (mutable: freely, script-only)"),
  /** User field 7 (mutable: freely, script-only) */
  User7: z
    .string()
    .max(16)
    .describe("User field 7 (mutable: freely, script-only)"),
  /** User field 8 (mutable: freely, script-only) */
  User8: z
    .string()
    .max(16)
    .describe("User field 8 (mutable: freely, script-only)"),
  /** Tagged text (mutable: freely, script-only) */
  TaggedText: z
    .string()
    .max(256)
    .describe("Tagged text (mutable: freely, script-only)"),
  /** Email status (mutable: freely, script-only) */
  Emailed: z
    .number()
    .int()
    .describe("Email status (mutable: freely, script-only)"),
  /** Transfer status (mutable: freely, script-only) */
  Transferred: z
    .number()
    .int()
    .describe("Transfer status (mutable: freely, script-only)"),
});

/**
 * Inferred TypeScript type from the transactionZod schema.
 * Represents a fully validated Transaction record.
 */
export type TransactionZod = z.infer<typeof transactionZod>;
