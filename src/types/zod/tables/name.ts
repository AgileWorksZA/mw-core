import { z } from "zod";

// --- Name Enums ---

/**
 * Defines the type of customer relationship.
 * 0: Not a customer
 * 1: Customer (Cash basis/no credit extended)
 * 2: Debtor (Credit extended)
 */
export const NameCustomerTypeEnum = z
  .enum(["0", "1", "2"])
  .describe(`Defines the type of customer relationship.
  0: Not a customer
  1: Customer (Cash basis/no credit extended)
  2: Debtor (Credit extended)`);

/**
 * Defines the type of supplier relationship.
 * 0: Not a supplier
 * 1: Supplier (Cash basis/no credit received)
 * 2: Creditor (Credit received)
 */
export const NameSupplierTypeEnum = z
  .enum(["0", "1", "2"])
  .describe(`Defines the type of supplier relationship.
  0: Not a supplier
  1: Supplier (Cash basis/no credit received)
  2: Creditor (Credit received)`);

/**
 * Defines the usual payment method used when paying this creditor.
 * 0: None
 * 1: Cash
 * 2: Cheque
 * 3: Electronic (Direct Credit/Online Banking)
 * 4: Credit Card
 * 5-7: User Defined Payment Methods
 */
export const NamePaymentMethodEnum = z
  .enum(["0", "1", "2", "3", "4", "5", "6", "7"])
  .describe(`Defines the usual payment method used when paying this creditor.
  0: None
  1: Cash
  2: Cheque
  3: Electronic (Direct Credit/Online Banking)
  4: Credit Card
  5-7: User Defined Payment Methods`);

/**
 * Defines the preferred payment method used by this customer when paying you.
 * 0: None
 * 1: Cash
 * 2: Cheque
 * 3: Electronic (Direct Credit/Online Banking)
 * 4: Credit Card
 * 5-7: User Defined Payment Methods
 */
export const NameReceiptMethodEnum = z
  .enum(["0", "1", "2", "3", "4", "5", "6", "7"])
  .describe(`Defines the preferred payment method used by this customer when paying you.
 0: None
 1: Cash
 2: Cheque
 3: Electronic (Direct Credit/Online Banking)
 4: Credit Card
 5-7: User Defined Payment Methods`);

/**
 * Defines the pricing level applied to this customer.
 * A-F: Corresponds to the different price levels set up in Product records.
 */
export const NameProductPricingEnum = z
  .enum(["A", "B", "C", "D", "E", "F"])
  .describe(`Defines the pricing level applied to this customer.
  A-F: Corresponds to the different price levels set up in Product records.`);

// --- Name Schema ---

/**
 * Zod schema for the Name record.
 * Internal file name: Name
 * Stores contact, address, financial terms, balances, and other details for customers, suppliers, and other contacts.
 */
export const nameZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this Name record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this Name record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** Unique code identifying the Name (customer, supplier, etc.). Indexed. Max 11 chars. */
  Code: z
    .string()
    .max(11)
    .describe(
      "Unique code identifying the Name (customer, supplier, etc.). Indexed. Max 11 chars.",
    ),
  /** Name of the company or person. Max 255 chars. */
  Name: z
    .string()
    .max(255) // Increased from appendix based on Name field common usage
    .describe("Name of the company or person. Max 255 chars."),
  /** Primary contact person's name. Max 25 chars. */
  Contact: z
    .string()
    .max(25) // As per Appendix A
    .nullable()
    .optional()
    .describe("Primary contact person's name. Max 25 chars."),
  /** Primary contact person's position. Max 29 chars. */
  Position: z
    .string()
    .max(29) // As per Appendix A
    .nullable()
    .optional()
    .describe("Primary contact person's position. Max 29 chars."),
  /** Mailing Address line 1. Max 59 chars. */
  Address1: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Mailing Address line 1. Max 59 chars."),
  /** Mailing Address line 2. Max 59 chars. */
  Address2: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Mailing Address line 2. Max 59 chars."),
  /** Mailing Address line 3. Max 59 chars. */
  Address3: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Mailing Address line 3. Max 59 chars."),
  /** Mailing Address line 4 (often Country). Max 59 chars. */
  Address4: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Mailing Address line 4 (often Country). Max 59 chars."),
  /** Delivery Address line 1. Max 59 chars. */
  Delivery1: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Delivery Address line 1. Max 59 chars."),
  /** Delivery Address line 2. Max 59 chars. */
  Delivery2: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Delivery Address line 2. Max 59 chars."),
  /** Delivery Address line 3. Max 59 chars. */
  Delivery3: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Delivery Address line 3. Max 59 chars."),
  /** Delivery Address line 4 (often Country). Max 59 chars. */
  Delivery4: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Delivery Address line 4 (often Country). Max 59 chars."),
  /** Main phone number. Max 19 chars. */
  Phone: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe("Main phone number. Max 19 chars."),
  /** Main fax number. Max 19 chars. */
  Fax: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe("Main fax number. Max 19 chars."),
  /** User-defined category 1. Max 15 chars. */
  Category1: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 1. Max 15 chars."),
  /** User-defined category 2. Max 15 chars. */
  Category2: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 2. Max 15 chars."),
  /** User-defined category 3. Max 15 chars. */
  Category3: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 3. Max 15 chars."),
  /** User-defined category 4. Max 15 chars. */
  Category4: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 4. Max 15 chars."),
  /** Customer type: 0=Not Customer, 1=Customer, 2=Debtor. */
  CustomerType: NameCustomerTypeEnum.describe(
    "Customer type: 0=Not Customer, 1=Customer, 2=Debtor.",
  ),
  /** Debtor balance aged 90+ days/cycles. */
  D90Plus: z.number().describe("Debtor balance aged 90+ days/cycles."),
  /** Debtor balance aged 60-89 days/cycles. */
  D60Plus: z.number().describe("Debtor balance aged 60-89 days/cycles."),
  /** Debtor balance aged 30-59 days/cycles. */
  D30Plus: z.number().describe("Debtor balance aged 30-59 days/cycles."),
  /** Debtor balance aged less than 30 days/cycles (current). */
  DCurrent: z
    .number()
    .describe("Debtor balance aged less than 30 days/cycles (current)."),
  /** Creditor current balance (total amount owing). */
  CCurrent: z
    .number()
    .describe("Creditor current balance (total amount owing)."),
  /** Debtor payment terms: positive N = N days, negative -N = Nth day of following month. */
  DebtorTerms: z
    .number()
    .describe(
      "Debtor payment terms: positive N = N days, negative -N = Nth day of following month.",
    ),
  /** Creditor payment terms: positive N = N days, negative -N = Nth day of following month. */
  CreditorTerms: z
    .number()
    .describe(
      "Creditor payment terms: positive N = N days, negative -N = Nth day of following month.",
    ),
  /** Customer's bank name (used for deposit slips). Max 7 chars. */
  Bank: z
    .string()
    .max(7)
    .nullable()
    .optional()
    .describe("Customer's bank name (used for deposit slips). Max 7 chars."),
  /** Customer's bank account name (used for deposit slips). Max 21 chars. */
  AccountName: z
    .string()
    .max(21)
    .nullable()
    .optional()
    .describe(
      "Customer's bank account name (used for deposit slips). Max 21 chars.",
    ),
  /** Customer's bank branch (used for deposit slips). Max 21 chars. */
  BankBranch: z
    .string()
    .max(21)
    .nullable()
    .optional()
    .describe("Customer's bank branch (used for deposit slips). Max 21 chars."),
  /** Their reference code for your company. Max 15 chars. */
  TheirRef: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Their reference code for your company. Max 15 chars."),
  /** Hold flag. If true, transactions for this Name default to 'Hold'. */
  Hold: z
    .boolean()
    .describe(
      "Hold flag. If true, transactions for this Name default to 'Hold'.",
    ),
  /** Accounts Receivable control GL account code for this debtor. Max 7 chars. */
  RecAccount: z
    .string()
    .max(7)
    .nullable()
    .optional()
    .describe(
      "Accounts Receivable control GL account code for this debtor. Max 7 chars.",
    ),
  /** Accounts Payable control GL account code for this creditor. Max 7 chars. */
  PayAccount: z
    .string()
    .max(7)
    .nullable()
    .optional()
    .describe(
      "Accounts Payable control GL account code for this creditor. Max 7 chars.",
    ),
  /** Kind of Name: 0=Template, 1=Normal. */
  Kind: z
    .number()
    .min(0)
    .max(1)
    .describe("Kind of Name: 0=Template, 1=Normal."),
  /** Credit limit extended to this debtor (0 = unlimited). */
  CreditLimit: z
    .number()
    .describe("Credit limit extended to this debtor (0 = unlimited)."),
  /** Default discount percentage for this customer. */
  Discount: z
    .number()
    .describe("Default discount percentage for this customer."),
  /** General comment field. Max 1020 chars. */
  Comment: z
    .string()
    .max(1020)
    .nullable()
    .optional()
    .describe("General comment field. Max 1020 chars."),
  /** Supplier type: 0=Not Supplier, 1=Supplier, 2=Creditor. */
  SupplierType: NameSupplierTypeEnum.describe(
    "Supplier type: 0=Not Supplier, 1=Supplier, 2=Creditor.",
  ),
  /** Display color index (0-7). */
  Colour: z
    .number()
    .min(0)
    .max(7)
    .nullable()
    .optional()
    .describe("Display color index (0-7)."),
  /** Default salesperson code associated with this Name. Max 5 chars. */
  Salesperson: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe(
      "Default salesperson code associated with this Name. Max 5 chars.",
    ),
  /** Override tax code applied to transactions for this Name. Max 5 chars. */
  TaxCode: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe(
      "Override tax code applied to transactions for this Name. Max 5 chars.",
    ),
  /** Auto-allocation split mode (not explicitly documented in Appendix A). */
  SplitMode: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Auto-allocation split mode (not explicitly documented in Appendix A).",
    ),
  /** Postal code/zip code for mailing address. Max 11 chars. */
  PostCode: z
    .string()
    .max(11)
    .nullable()
    .optional()
    .describe("Postal code/zip code for mailing address. Max 11 chars."),
  /** State/province for mailing address. Max 3 chars. */
  State: z
    .string()
    .max(3)
    .nullable()
    .optional()
    .describe("State/province for mailing address. Max 3 chars."),
  /** Bank account number for electronic payments (creditor) or direct debits (debtor). Max 23 chars. */
  BankAccountNumber: z
    .string()
    .max(23)
    .nullable()
    .optional()
    .describe(
      "Bank account number for electronic payments (creditor) or direct debits (debtor). Max 23 chars.",
    ),
  /** Default currency code for this Name (empty if base currency). Max 3 chars. */
  Currency: z
    .string()
    .max(3)
    .nullable()
    .optional()
    .describe(
      "Default currency code for this Name (empty if base currency). Max 3 chars.",
    ),
  /** Default payment method when paying this creditor. */
  PaymentMethod: NamePaymentMethodEnum.nullable()
    .optional()
    .describe("Default payment method when paying this creditor."),
  /** Total debtor balance (sum of DCurrent, D30Plus, D60Plus, D90Plus). */
  DBalance: z
    .number()
    .describe(
      "Total debtor balance (sum of DCurrent, D30Plus, D60Plus, D90Plus).",
    ),
  /** Direct dial phone number for primary contact. Max 19 chars. */
  DDI: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe("Direct dial phone number for primary contact. Max 19 chars."),
  /** Email address for primary contact. Max 80 chars. */
  eMail: z
    .string()
    .max(80)
    .email()
    .nullable()
    .optional()
    .describe("Email address for primary contact. Max 80 chars."),
  /** Mobile phone number for primary contact. Max 14 chars. */
  Mobile: z
    .string()
    .max(14)
    .nullable()
    .optional()
    .describe("Mobile phone number for primary contact. Max 14 chars."),
  /** After hours phone number for primary contact. Max 11 chars. */
  AfterHours: z
    .string()
    .max(11)
    .nullable()
    .optional()
    .describe("After hours phone number for primary contact. Max 11 chars."),
  /** Secondary contact person's name. Max 29 chars. */
  Contact2: z
    .string()
    .max(29)
    .nullable()
    .optional()
    .describe("Secondary contact person's name. Max 29 chars."),
  /** Secondary contact person's position. Max 29 chars. */
  Position2: z
    .string()
    .max(29)
    .nullable()
    .optional()
    .describe("Secondary contact person's position. Max 29 chars."),
  /** Direct dial phone number for secondary contact. Max 19 chars. */
  DDI2: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe("Direct dial phone number for secondary contact. Max 19 chars."),
  /** Email address for secondary contact. Max 80 chars. */
  eMail2: z
    .string()
    .max(80)
    .email()
    .nullable()
    .optional()
    .describe("Email address for secondary contact. Max 80 chars."),
  /** Mobile phone number for secondary contact. Max 13 chars. */
  Mobile2: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe("Mobile phone number for secondary contact. Max 13 chars."),
  /** After hours phone number for secondary contact. Max 11 chars. */
  AfterHours2: z
    .string()
    .max(11)
    .nullable()
    .optional()
    .describe("After hours phone number for secondary contact. Max 11 chars."),
  /** Website URL. Max 63 chars. */
  WebURL: z
    .string()
    .max(63)
    .url()
    .nullable()
    .optional()
    .describe("Website URL. Max 63 chars."),
  /** Product pricing level (A-F) for this customer. Max 1 char. */
  ProductPricing: NameProductPricingEnum.nullable()
    .optional()
    .describe("Product pricing level (A-F) for this customer."),
  /** Date of the last sales invoice or cash sale to this customer. Should be specified in YYYY-MM-DD format. */
  DateOfLastSale: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Date of the last sales invoice or cash sale to this customer. Should be specified in YYYY-MM-DD format.",
    ),
  /** First account code for auto-allocation split. Max 13 chars. */
  SplitAcct1: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe("First account code for auto-allocation split. Max 13 chars."),
  /** Second (remainder) account code for auto-allocation split. Max 13 chars. */
  SplitAcct2: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "Second (remainder) account code for auto-allocation split. Max 13 chars.",
    ),
  /** Percentage allocation to SplitAcct1 for auto-allocation. */
  SplitPercent: z
    .number()
    .nullable()
    .optional()
    .describe("Percentage allocation to SplitAcct1 for auto-allocation."),
  // SplitAmount is not listed in Appendix A for the Name table, only SplitPercent. Removed.
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
  /** Customer prompt payment terms: positive N = N days, negative -N = Nth day of following month. */
  CustPromptPaymentTerms: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Customer prompt payment terms: positive N = N days, negative -N = Nth day of following month.",
    ),
  /** Customer prompt payment discount percentage. */
  CustPromptPaymentDiscount: z
    .number()
    .nullable()
    .optional()
    .describe("Customer prompt payment discount percentage."),
  /** Supplier prompt payment terms: positive N = N days, negative -N = Nth day of following month. */
  SuppPromptPaymentTerms: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Supplier prompt payment terms: positive N = N days, negative -N = Nth day of following month.",
    ),
  /** Supplier prompt payment discount percentage offered. */
  SuppPromptPaymentDiscount: z
    .number()
    .nullable()
    .optional()
    .describe("Supplier prompt payment discount percentage offered."),
  /** Payment method used in the last transaction with this Name. */
  LastPaymentMethod: NamePaymentMethodEnum.nullable()
    .optional()
    .describe("Payment method used in the last transaction with this Name."),
  /** Credit card number. Max 19 chars. */
  CreditCardNum: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe("Credit card number. Max 19 chars."),
  /** Credit card expiry date (e.g., MM/YY). Max 5 chars. */
  CreditCardExpiry: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe("Credit card expiry date (e.g., MM/YY). Max 5 chars."),
  /** Name on credit card. Max 19 chars. */
  CreditCardName: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe("Name on credit card. Max 19 chars."),
  /** Their tax registration number (GST#, VAT#, ABN, etc.). Max 19 chars. */
  TaxNumber: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe(
      "Their tax registration number (GST#, VAT#, ABN, etc.). Max 19 chars.",
    ),
  /** Custom field 1. Max 255 chars. */
  Custom1: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom field 1. Max 255 chars."),
  /** Custom field 2. Max 255 chars. */
  Custom2: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom field 2. Max 255 chars."),
  /** Custom field 3. Max 15 chars. */
  Custom3: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 3. Max 15 chars."),
  /** Custom field 4. Max 15 chars. */
  Custom4: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 4. Max 15 chars."),
  /** Postcode/zip code for delivery address. Max 12 chars. */
  DeliveryPostcode: z
    .string()
    .max(12)
    .nullable()
    .optional()
    .describe("Postcode/zip code for delivery address. Max 12 chars."),
  /** State/province for delivery address. Max 4 chars. */
  DeliveryState: z
    .string()
    .max(4)
    .nullable()
    .optional()
    .describe("State/province for delivery address. Max 4 chars."),
  /** Country for mailing address (from Address4). Max 59 chars. */
  AddressCountry: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Country for mailing address (from Address4). Max 59 chars."),
  /** Country for delivery address (from Delivery4). Max 59 chars. */
  DeliveryCountry: z
    .string()
    .max(59)
    .nullable()
    .optional()
    .describe("Country for delivery address (from Delivery4). Max 59 chars."),
  /** Preferred payment method used by this customer. */
  ReceiptMethod: NameReceiptMethodEnum.nullable()
    .optional()
    .describe("Preferred payment method used by this customer."),
  /** Mac Address Book Universal ID (set only if imported from Address Book). */
  ABUID: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Mac Address Book Universal ID (set only if imported from Address Book).",
    ),
  /** Bank particulars/reference for electronic payments. Max 32 chars (educated guess). */
  BankParticulars: z
    .string()
    .max(32)
    .nullable()
    .optional()
    .describe(
      "Bank particulars/reference for electronic payments. Max 32 chars (educated guess).",
    ),
  /** Bitmapped flags field. See documentation for Name Flags. */
  Flags: z
    .number()
    .describe("Bitmapped flags field. See documentation for Name Flags."),
  /** Salutation for primary contact. Max 39 chars. */
  Salutation: z
    .string()
    .max(39)
    .nullable()
    .optional()
    .describe("Salutation for primary contact. Max 39 chars."),
  /** Salutation for secondary contact. Max 39 chars. */
  Salutation2: z
    .string()
    .max(39)
    .nullable()
    .optional()
    .describe("Salutation for secondary contact. Max 39 chars."),
  /** Memo/notes for primary contact. Max 255 chars. */
  Memo: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Memo/notes for primary contact. Max 255 chars."),
  /** Memo/notes for secondary contact. Max 255 chars. */
  Memo2: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Memo/notes for secondary contact. Max 255 chars."),
  /** Bitmapped field representing roles assigned to primary contact. */
  Role: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Bitmapped field representing roles assigned to primary contact.",
    ),
  /** Bitmapped field representing roles assigned to secondary contact. */
  Role2: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Bitmapped field representing roles assigned to secondary contact.",
    ),
  /** Custom field 5. Max 15 chars. */
  Custom5: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 5. Max 15 chars."),
  /** Custom field 6. Max 15 chars. */
  Custom6: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 6. Max 15 chars."),
  /** Custom field 7. Max 15 chars. */
  Custom7: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 7. Max 15 chars."),
  /** Custom field 8. Max 15 chars. */
  Custom8: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 8. Max 15 chars."),
  /** Scriptable tag storage for key-value pairs. Max 255 chars. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage for key-value pairs. Max 255 chars."),
  /** eInvoicing ID (e.g., ABN, NZBN, UEN, VAT#) for Peppol network. Max 31 chars. */
  EInvoicingID: z
    .string()
    .max(31)
    .nullable()
    .optional()
    .describe(
      "eInvoicing ID (e.g., ABN, NZBN, UEN, VAT#) for Peppol network. Max 31 chars.",
    ),
});

/**
 * Inferred TypeScript type from the nameZod schema.
 * Represents a fully validated Name record.
 */
export type NameZod = z.infer<typeof nameZod>;
