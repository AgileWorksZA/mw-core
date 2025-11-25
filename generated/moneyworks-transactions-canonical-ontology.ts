/**
 * MoneyWorks Transactions Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_transactions.html
 * Authority: MoneyWorks Manual - Transactions and Detail Field Descriptions
 * 
 * CRITICAL ARCHITECTURAL DISCOVERIES:
 * 1. DUAL-ENTITY STRUCTURE: Transactions has a separate Detail subfile
 *    - Transaction entity: Main transaction header with 65+ fields
 *    - Detail entity: Transaction lines with 40+ fields (Detail.ParentSeq → Transaction.SequenceNumber)
 * 
 * 2. COMPREHENSIVE TRANSACTION TYPE SYSTEM:
 *    - 17 canonical transaction types covering all business scenarios
 *    - Cash transactions (CR, CP), Invoice transactions (DI, CI), Orders (SO, PO), Journals (JN, JNS)
 *    - Universal business applicability across all industries
 * 
 * 3. ENTERPRISE-GRADE FINANCIAL CONTROLS:
 *    - Dual approval system (ApprovedBy1, ApprovedBy2)
 *    - Comprehensive audit trail (EnterDate, PostedBy, LastModifiedTime)
 *    - Security levels for transaction and detail level access control
 *    - Multi-currency support with exchange rate tracking
 * 
 * 4. SOPHISTICATED RELATIONSHIP NETWORK:
 *    - Names integration via NameCode (references creditors/debtors)
 *    - Account integration via Contra and Detail.Account
 *    - Product integration via Detail.StockCode
 *    - Job costing via Detail.JobCode
 *    - Tax compliance via Detail.TaxCode
 *    - Bank reconciliation via Detail.Statement
 * 
 * 5. INVENTORY AND ORDER MANAGEMENT:
 *    - Stock tracking with location support (Detail.StockLocation)
 *    - Serial/batch number management (Detail.SerialNumber)
 *    - Order lifecycle management (OrderQty, OrderStatus, BackorderQty)
 *    - Complex pricing and discount calculations
 * 
 * 6. UNIVERSAL BUSINESS PROCESS SUPPORT:
 *    - Aging cycles for receivables/payables management
 *    - Payment method classification (Cash, Cheque, Electronic, Credit Card)
 *    - Freight and delivery management
 *    - Prompt payment discount tracking
 */

// ============================================================================
// CANONICAL MONEYWORKS TRANSACTION TYPES
// ============================================================================

/**
 * MoneyWorks canonical transaction type classification
 * Source: moneyworks_appendix_transactions.html - Transaction type codes table
 */
export enum MoneyWorksTransactionType {
  /** Creditor invoice--fully paid */
  CREDITOR_INVOICE_COMPLETE = "CIC",
  
  /** Creditor invoice--incomplete */
  CREDITOR_INVOICE_INCOMPLETE = "CII",
  
  /** Cash payment/purchase */
  CASH_PAYMENT = "CP",
  
  /** Cash payment for a creditor invoice */
  CASH_PAYMENT_CREDITOR = "CPC",
  
  /** Returned refund to debtor */
  CASH_PAYMENT_DEBTOR_REFUND = "CPD",
  
  /** Cash receipt/sale */
  CASH_RECEIPT = "CR",
  
  /** Receive refund from creditor */
  CASH_RECEIPT_CREDITOR_REFUND = "CRC",
  
  /** Receipt for a debtor invoice */
  CASH_RECEIPT_DEBTOR = "CRD",
  
  /** Debtor invoice--fully paid */
  DEBTOR_INVOICE_COMPLETE = "DIC",
  
  /** Debtor invoice--incomplete */
  DEBTOR_INVOICE_INCOMPLETE = "DII",
  
  /** General journal */
  GENERAL_JOURNAL = "JN",
  
  /** Stock journal */
  STOCK_JOURNAL = "JNS",
  
  /** Purchase order (complete) = Bought */
  PURCHASE_ORDER_COMPLETE = "POC",
  
  /** Purchase order (incomplete) */
  PURCHASE_ORDER_INCOMPLETE = "POI",
  
  /** Quote */
  QUOTE = "QU",
  
  /** Sales order (complete) = Sold */
  SALES_ORDER_COMPLETE = "SOC",
  
  /** Sales order (incomplete) */
  SALES_ORDER_INCOMPLETE = "SOI"
}

/**
 * MoneyWorks canonical transaction status classification
 * Source: moneyworks_appendix_transactions.html - Status field
 */
export enum MoneyWorksTransactionStatus {
  /** Unposted transaction */
  UNPOSTED = "U",
  
  /** Posted transaction */
  POSTED = "P"
}

/**
 * MoneyWorks canonical payment method classification
 * Source: moneyworks_appendix_transactions.html - PaymentMethod field
 */
export enum MoneyWorksPaymentMethod {
  /** None */
  NONE = 0,
  
  /** Cash */
  CASH = 1,
  
  /** Cheque */
  CHEQUE = 2,
  
  /** Electronic */
  ELECTRONIC = 3,
  
  /** Credit Card */
  CREDIT_CARD = 4,
  
  /** User defined 1 */
  USER_DEFINED_1 = 5,
  
  /** User defined 2 */
  USER_DEFINED_2 = 6,
  
  /** User defined 3 */
  USER_DEFINED_3 = 7
}

/**
 * MoneyWorks canonical transaction flags
 * Source: moneyworks_appendix_transactions.html - Transaction Flags table
 */
export enum MoneyWorksTransactionFlags {
  /** Was Cancelled */
  WAS_CANCELLED = 0x00000001,
  
  /** Is Cancellation */
  IS_CANCELLATION = 0x00000002,
  
  /** Was Written Off */
  WAS_WRITTEN_OFF = 0x00000004,
  
  /** Creditor Reimburse */
  CREDITOR_REIMBURSE = 0x00000008,
  
  /** Debtor Reimburse */
  DEBTOR_REIMBURSE = 0x00000010,
  
  /** Printed */
  PRINTED = 0x00000020,
  
  /** Is WriteOff Dummy */
  IS_WRITEOFF_DUMMY = 0x00000040,
  
  /** Is Contra Dummy */
  IS_CONTRA_DUMMY = 0x00000080,
  
  /** Not On Statement */
  NOT_ON_STATEMENT = 0x00000800,
  
  /** Is Banking Journal */
  IS_BANKING_JOURNAL = 0x00001000,
  
  /** Is Job Invoice */
  IS_JOB_INVOICE = 0x00002000,
  
  /** Changed After Posting */
  CHANGED_AFTER_POSTING = 0x00004000,
  
  /** Prompt Discount Taken */
  PROMPT_DISCOUNT_TAKEN = 0x00008000,
  
  /** Funds Xfer */
  FUNDS_XFER = 0x00010000,
  
  /** Is Discount Credit Note */
  IS_DISCOUNT_CREDIT_NOTE = 0x00020000,
  
  /** Is Writeoff Credit Note */
  IS_WRITEOFF_CREDIT_NOTE = 0x00040000,
  
  /** Is New Style Sales Tax */
  IS_NEW_STYLE_SALES_TAX = 0x00080000,
  
  /** Has Scan */
  HAS_SCAN = 0x00100000,
  
  /** Has Outstanding Stock Receipts */
  HAS_OUTSTANDING_STOCK_RECEIPTS = 0x00200000,
  
  /** PPD Terms Locked */
  PPD_TERMS_LOCKED = 0x00400000,
  
  /** Is Deposit on Order */
  IS_DEPOSIT_ON_ORDER = 0x00800000,
  
  /** Imported transaction */
  IMPORTED_TRANSACTION = 0x01000000,
  
  /** Is a recurred transaction */
  IS_RECURRED_TRANSACTION = 0x08000000
}

/**
 * MoneyWorks canonical detail flags
 * Source: moneyworks_appendix_transactions.html - Detail Flags table
 */
export enum MoneyWorksDetailFlags {
  /** Dept in account is salesperson */
  DEPT_IS_SALESPERSON = 0x0001,
  
  /** Freight Item */
  FREIGHT_ITEM = 0x0002,
  
  /** Product Price is Tax Inclusive */
  PRODUCT_PRICE_TAX_INCLUSIVE = 0x0004,
  
  /** Tax Line */
  TAX_LINE = 0x0008,
  
  /** Tax line added by tax override */
  TAX_LINE_OVERRIDE = 0x0010,
  
  /** Is time item */
  IS_TIME_ITEM = 0x0020,
  
  /** Prompt Payment Discountable */
  PROMPT_PAYMENT_DISCOUNTABLE = 0x0040,
  
  /** Line is a foreign currency */
  FOREIGN_CURRENCY = 0x0100,
  
  /** Balancing line for above */
  BALANCING_LINE_FOREIGN = 0x0200,
  
  /** Balancing line for contra */
  BALANCING_LINE_CONTRA = 0x0400,
  
  /** Stock is ignored (for jobs) */
  STOCK_IGNORED = 0x0800,
  
  /** Banking Journal Holding Line */
  BANKING_JOURNAL_HOLDING = 0x1000,
  
  /** Banking Journal Bank Line */
  BANKING_JOURNAL_BANK = 0x2000,
  
  /** Stock Journal Line */
  STOCK_JOURNAL_LINE = 0x4000,
  
  /** System line */
  SYSTEM_LINE = 0x8000
}

/**
 * MoneyWorks canonical detail more flags
 * Source: moneyworks_appendix_transactions.html - Detail Flags table (detail.moreFlags)
 */
export enum MoneyWorksDetailMoreFlags {
  /** Requires serial number */
  REQUIRES_SERIAL_NUMBER = 0x0001,
  
  /** Requires batch number */
  REQUIRES_BATCH_NUMBER = 0x0002,
  
  /** Batch expires */
  BATCH_EXPIRES = 0x0004
}

// ============================================================================
// CANONICAL MONEYWORKS TRANSACTION FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks transaction fields as defined in manual
 * Source: moneyworks_appendix_transactions.html - Transactions table
 */
export const MONEYWORKS_TRANSACTION_FIELDS = [
  {
    fieldName: "Aging",
    dataType: "N" as const,
    canonicalDescription: "The aging cycle for the transaction",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "aging system",
    relationshipRule: "Tracks receivables/payables aging cycles"
  },
  {
    fieldName: "AmtPaid",
    dataType: "N" as const,
    canonicalDescription: "The amount of the invoice that has been paid",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Payments.Amount",
    relationshipRule: "Tracks partial payments against invoices"
  },
  {
    fieldName: "AmtWrittenOff",
    dataType: "N" as const,
    canonicalDescription: "For invoices, the amount written off in a write-off",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "write-off transactions",
    relationshipRule: "Tracks bad debt write-offs"
  },
  {
    fieldName: "Analysis",
    dataType: "T" as const,
    maxLength: 9,
    canonicalDescription: "The analysis field.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "analysis reporting",
    relationshipRule: "User-defined analysis categorization"
  },
  {
    fieldName: "ApprovedBy1",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "Initials of first user to approve transaction. This field can only be set to the current user's initials (or blank) using a script.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Login.Initials",
    relationshipRule: "First approval in dual-approval workflow"
  },
  {
    fieldName: "ApprovedBy2",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "Initials of second user to approve transaction. This field can only be set to the current user's initials (or blank) using a script.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Login.Initials",
    relationshipRule: "Second approval in dual-approval workflow"
  },
  {
    fieldName: "BankJNSeq",
    dataType: "N" as const,
    canonicalDescription: "The sequence number of the journal which banked the receipt (using the Banking command)",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Transaction.SequenceNumber",
    relationshipRule: "References banking journal that processed receipt"
  },
  {
    fieldName: "Colour",
    dataType: "N" as const,
    canonicalDescription: "The colour, represented internally as a numeric index in the range 0-7 but rendered as a textual colour name",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "colour system",
    relationshipRule: "Visual categorization using predefined colour palette"
  },
  {
    fieldName: "Contra",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "For CP and CR transactions, this contains the account code of the bank that was selected in the bank pop-up menu. For invoices this is the accounts payable/receivable control acct.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Accounts.Code",
    relationshipRule: "References bank account for cash transactions or control account for invoices"
  },
  {
    fieldName: "DatePaid",
    dataType: "D" as const,
    canonicalDescription: "The date the last payment for an invoice was made",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "payment tracking",
    relationshipRule: "Tracks when invoice was fully/partially paid"
  },
  {
    fieldName: "DeliveryAddress",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "The delivery address for this transaction. Blank if default from name.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Names address fields",
    relationshipRule: "Override address for specific transaction delivery"
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 1000,
    canonicalDescription: "The description of the transaction.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "transaction narrative",
    relationshipRule: "Primary description for transaction purpose"
  },
  {
    fieldName: "DueDate",
    dataType: "D" as const,
    canonicalDescription: "The date on which payment is due",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Names payment terms",
    relationshipRule: "Calculated from transaction date and payment terms"
  },
  {
    fieldName: "Emailed",
    dataType: "N" as const,
    canonicalDescription: "Non zero if transaction has been emailed",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "email tracking",
    relationshipRule: "Tracks if transaction document has been emailed"
  },
  {
    fieldName: "EnterDate",
    dataType: "D" as const,
    canonicalDescription: "The date on which the transaction was entered.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "audit trail",
    relationshipRule: "Automatic system date when transaction created"
  },
  {
    fieldName: "EnteredBy",
    dataType: "A" as const,
    maxLength: 3,
    canonicalDescription: "Initials of user who entered the transaction",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Login.Initials",
    relationshipRule: "Audit trail of transaction creator"
  },
  {
    fieldName: "ExchangeRate",
    dataType: "N" as const,
    canonicalDescription: "The exchange rate (0 for base currency transactions)",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "currency system",
    relationshipRule: "Multi-currency transaction support"
  },
  {
    fieldName: "Flag",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The flag field.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user flagging",
    relationshipRule: "User-defined text flag for categorization"
  },
  {
    fieldName: "Flags",
    dataType: "N" as const,
    canonicalDescription: "See Transaction Flags table",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "MoneyWorksTransactionFlags",
    relationshipRule: "Bit-mapped flags for transaction state and attributes"
  },
  {
    fieldName: "FreightAmount",
    dataType: "N" as const,
    canonicalDescription: "Freight amount of order",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "freight calculation",
    relationshipRule: "Freight charges for order transactions"
  },
  {
    fieldName: "FreightCode",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Freight code used for orders",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "freight classification",
    relationshipRule: "Freight method classification for orders"
  },
  {
    fieldName: "FreightDetails",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Details of freight for order",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "freight information",
    relationshipRule: "Detailed freight information for orders"
  },
  {
    fieldName: "Gross",
    dataType: "N" as const,
    canonicalDescription: "The gross value of the transaction.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "financial totals",
    relationshipRule: "Total transaction value including tax"
  },
  {
    fieldName: "Hold",
    dataType: "B" as const,
    canonicalDescription: "True if the transaction is on hold",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "transaction status",
    relationshipRule: "Prevents processing of held transactions"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date that the transaction was last changed.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "audit trail",
    relationshipRule: "Automatic timestamp of last modification"
  },
  {
    fieldName: "MailingAddress",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Transaction's mailing address. Blank if default from name.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Names address fields",
    relationshipRule: "Override address for transaction correspondence"
  },
  {
    fieldName: "NameCode",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "Customer or Supplier Code",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "Names.Code",
    relationshipRule: "References creditor (supplier) or debtor (customer) from Names entity"
  },
  {
    fieldName: "OrderDeposit",
    dataType: "N" as const,
    canonicalDescription: "The accumulated deposit on an order",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "order management",
    relationshipRule: "Tracks deposits received against orders"
  },
  {
    fieldName: "OrderShipped",
    dataType: "N" as const,
    canonicalDescription: "The amount shipped of an order",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "order fulfillment",
    relationshipRule: "Tracks shipped portion of order value"
  },
  {
    fieldName: "OrderTotal",
    dataType: "N" as const,
    canonicalDescription: "The total of the order",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "order management",
    relationshipRule: "Total order value for tracking fulfillment"
  },
  {
    fieldName: "OriginatingOrderSeq",
    dataType: "N" as const,
    canonicalDescription: "The sequence number of the order that created the invoice through the ship or receive goods commands",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Transaction.SequenceNumber",
    relationshipRule: "Links invoices back to originating orders"
  },
  {
    fieldName: "OurRef",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "The reference number of the transaction. For Cash Payments, this is the cheque number. For Cash Receipts it is the receipt number. For Debtor Invoices, it is the invoice number and for Creditor Invoices it is your order number. For Journals, it is the Journal number, prefixed with the type of journal (JN for general journal, JS for stock journal, BK for banking journal).",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "document numbering",
    relationshipRule: "Internal reference number for transaction document"
  },
  {
    fieldName: "PayAmount",
    dataType: "N" as const,
    canonicalDescription: "The amount of the invoice that you have elected to pay a creditor in the next payment run.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "payment scheduling",
    relationshipRule: "Creditor payment batch processing"
  },
  {
    fieldName: "PaymentMethod",
    dataType: "N" as const,
    canonicalDescription: "The payment method for the transaction (0 = None, 1 = Cash, 2 = Cheque, 3 = Electronic, 4 = Credit Card, 5-7 = user defined)",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "MoneyWorksPaymentMethod",
    relationshipRule: "Canonical payment method classification"
  },
  {
    fieldName: "Period",
    dataType: "N" as const,
    canonicalDescription: "A number representing the period of the transaction. This number will be (100 * year_number + period_number), where year_number is a number in the range 0-99, with year 1 being the first year of operation for your MoneyWorks document, and period_number is a number in the range 1-12, with 1 representing the first period of your financial year.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "accounting periods",
    relationshipRule: "Financial reporting period classification"
  },
  {
    fieldName: "PostedBy",
    dataType: "A" as const,
    maxLength: 3,
    canonicalDescription: "Initials of user who posted the transaction",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Login.Initials",
    relationshipRule: "Audit trail of transaction posting"
  },
  {
    fieldName: "Printed",
    dataType: "N" as const,
    canonicalDescription: "0 if not Printed; 1 if Printed",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "document status",
    relationshipRule: "Tracks if transaction document has been printed"
  },
  {
    fieldName: "ProdPriceCode",
    dataType: "T" as const,
    maxLength: 1,
    canonicalDescription: "Pricing code (A--F)",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Products pricing",
    relationshipRule: "Product pricing matrix selection"
  },
  {
    fieldName: "PromptPaymentAmt",
    dataType: "N" as const,
    canonicalDescription: "The amount of the eligible prompt payment discount",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "payment terms",
    relationshipRule: "Early payment discount calculation"
  },
  {
    fieldName: "PromptPaymentDate",
    dataType: "D" as const,
    canonicalDescription: "The date the prompt payment discount expires",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "payment terms",
    relationshipRule: "Early payment discount deadline"
  },
  {
    fieldName: "Recurring",
    dataType: "B" as const,
    canonicalDescription: "\"True\" if the transaction is a recurring transaction. \"False\" if it isn't.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "recurring transactions",
    relationshipRule: "Marks transaction as recurring template"
  },
  {
    fieldName: "Salesperson",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The salesperson for the transaction. If the transaction involves any products with the \"Append Salesperson\" attribute set, the value of this field will be appended to that products sales and/or cost of goods account code.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "salesperson tracking",
    relationshipRule: "Sales attribution and account code modification"
  },
  {
    fieldName: "SecurityLevel",
    dataType: "N" as const,
    canonicalDescription: "The transaction's security level. This is set to the highest security level of the visible detail lines.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "security system",
    relationshipRule: "Access control based on detail line security levels"
  },
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "The sequence number of the transaction.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    isIndexed: true,
    relationshipTarget: "unique identifier",
    relationshipRule: "Primary key for transaction entity"
  },
  {
    fieldName: "SpecialAccount",
    dataType: "T" as const,
    canonicalDescription: "For receipts, the bank account of the cheque",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "bank account",
    relationshipRule: "Cheque bank account details for receipts"
  },
  {
    fieldName: "SpecialBank",
    dataType: "T" as const,
    canonicalDescription: "For receipts, the bank number of the cheque",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "bank routing",
    relationshipRule: "Cheque bank routing details for receipts"
  },
  {
    fieldName: "SpecialBranch",
    dataType: "T" as const,
    canonicalDescription: "For receipts, the branch of the cheque",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "bank branch",
    relationshipRule: "Cheque bank branch details for receipts"
  },
  {
    fieldName: "Status",
    dataType: "T" as const,
    maxLength: 1,
    canonicalDescription: "This will be either a \"U\" (for unposted) or \"P\" (for posted).",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "MoneyWorksTransactionStatus",
    relationshipRule: "Transaction posting status"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable data storage for custom applications"
  },
  {
    fieldName: "TaxAmount",
    dataType: "N" as const,
    canonicalDescription: "The amount of GST involved for the transaction.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "tax calculation",
    relationshipRule: "Total tax amount for transaction"
  },
  {
    fieldName: "TaxCycle",
    dataType: "N" as const,
    canonicalDescription: "A number representing the GST cycle in which the transaction was processed for GST. This is 0 for transactions not yet processed for GST.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "tax reporting",
    relationshipRule: "Tax reporting cycle identification"
  },
  {
    fieldName: "TheirRef",
    dataType: "T" as const,
    maxLength: 21,
    canonicalDescription: "For debtor invoices, the customer's Order No. For creditor invoices, the supplier's invoice number. For receipts, the cheque number",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "external reference",
    relationshipRule: "External party's reference number for transaction"
  },
  {
    fieldName: "TimePosted",
    dataType: "S" as const,
    canonicalDescription: "Date and time transaction is posted.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "audit trail",
    relationshipRule: "Precise timestamp of transaction posting"
  },
  {
    fieldName: "ToFrom",
    dataType: "T" as const,
    maxLength: 200,
    canonicalDescription: "For a payment, the To field. For a receipt, the From field.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "payment details",
    relationshipRule: "Payment recipient or receipt source information"
  },
  {
    fieldName: "TransDate",
    dataType: "D" as const,
    canonicalDescription: "The transaction date.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "accounting date",
    relationshipRule: "Financial reporting date for transaction"
  },
  {
    fieldName: "Transferred",
    dataType: "N" as const,
    canonicalDescription: "Non zero if transaction has been sent as eInvoice",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "eInvoice system",
    relationshipRule: "Tracks electronic invoice transmission"
  },
  {
    fieldName: "Type",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "The transaction type.--see following table.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "MoneyWorksTransactionType",
    relationshipRule: "Canonical transaction type classification"
  },
  {
    fieldName: "User1",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user customization",
    relationshipRule: "User-defined text field 1"
  },
  {
    fieldName: "User2",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user customization",
    relationshipRule: "User-defined text field 2"
  },
  {
    fieldName: "User3",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user customization",
    relationshipRule: "User-defined text field 3"
  },
  {
    fieldName: "User4",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user customization",
    relationshipRule: "User-defined text field 4"
  },
  {
    fieldName: "User5",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user customization",
    relationshipRule: "User-defined text field 5"
  },
  {
    fieldName: "User6",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user customization",
    relationshipRule: "User-defined text field 6"
  },
  {
    fieldName: "User7",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user customization",
    relationshipRule: "User-defined text field 7"
  },
  {
    fieldName: "User8",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "user customization",
    relationshipRule: "User-defined text field 8"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "Scriptable number",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable numeric data storage"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable text data storage"
  },
  {
    fieldName: "TaxProcessed",
    dataType: "N" as const,
    canonicalDescription: "GST/VAT processing status flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },
  {
    fieldName: "Currency",
    dataType: "A" as const,
    maxLength: 3,
    canonicalDescription: "Transaction currency code (multi-currency support)",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "CurrencyTransferSeq",
    dataType: "N" as const,
    canonicalDescription: "Foreign exchange transfer transaction reference",
    manualSource: "Empirical API validation",
    isRequired: false,
    foreignKey: {
      targetEntity: "Transaction",
      targetField: "SequenceNumber",
      relationship: "many-to-one"
    }
  },
  {
    fieldName: "PromptPaymentTerms",
    dataType: "N" as const,
    canonicalDescription: "Early payment discount terms (days)",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "PromptPaymentDisc",
    dataType: "N" as const,
    canonicalDescription: "Early payment discount percentage",
    manualSource: "Empirical API validation",
    isRequired: false
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS DETAIL (TRANSACTION LINES) FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks transaction detail fields as defined in manual
 * Source: moneyworks_appendix_transactions.html - Detail fields
 * 
 * ARCHITECTURAL INSIGHT: Detail is a separate entity with ParentSeq → Transaction.SequenceNumber
 */
export const MONEYWORKS_DETAIL_FIELDS = [
  {
    fieldName: "Detail.Account",
    dataType: "T" as const,
    maxLength: 14,
    canonicalDescription: "A text string containing the account code- (or account-department code) from the detail line",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    relationshipTarget: "Accounts.Code",
    relationshipRule: "References chart of accounts, may include department suffix"
  },
  {
    fieldName: "Detail.BackorderQty",
    dataType: "N" as const,
    canonicalDescription: "The amount currently on backorder for an order",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "order management",
    relationshipRule: "Tracks unfulfilled order quantities"
  },
  {
    fieldName: "Detail.BaseCurrencyNet",
    dataType: "N" as const,
    canonicalDescription: "The detail.net amount converted to the base currency",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "currency conversion",
    relationshipRule: "Multi-currency transaction support"
  },
  {
    fieldName: "Detail.CostPrice",
    dataType: "N" as const,
    canonicalDescription: "This is the base currency buy-price of the product. It is represented as dollars per buying unit for a purchase or as dollars per selling unit. for a sale. For a sale, the cost price is taken from the AverageValue of the product.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Products.AverageValue",
    relationshipRule: "Product costing for inventory valuation"
  },
  {
    fieldName: "Detail.Credit",
    dataType: "N" as const,
    canonicalDescription: "The credit value of the detail line. This is the amount by which the account is credited when the transaction gets posted. It corresponds to the Net or Extension for a CP or CI.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "accounting entries",
    relationshipRule: "Credit side of double-entry bookkeeping"
  },
  {
    fieldName: "Detail.Date",
    dataType: "D" as const,
    canonicalDescription: "The date on the detail line (also the expiry date for time-limited batches)",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "batch management",
    relationshipRule: "Line-specific dates and batch expiry tracking"
  },
  {
    fieldName: "Detail.Custom1",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable custom field 1"
  },
  {
    fieldName: "Detail.Custom2",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable custom field 2"
  },
  {
    fieldName: "Detail.Debit",
    dataType: "N" as const,
    canonicalDescription: "The debit value of the detail line. This is the amount by which the account is debited when the transaction gets posted. It corresponds to the Net or Extension for a CR or DI.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "accounting entries",
    relationshipRule: "Debit side of double-entry bookkeeping"
  },
  {
    fieldName: "Detail.Dept",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The department code",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Departments.Code",
    relationshipRule: "Cost center allocation for detailed reporting"
  },
  {
    fieldName: "Detail.Description",
    dataType: "T" as const,
    maxLength: 1020,
    canonicalDescription: "The description for the detail line.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "line description",
    relationshipRule: "Detailed narrative for transaction line"
  },
  {
    fieldName: "Detail.Discount",
    dataType: "N" as const,
    canonicalDescription: "The percent discount for the line.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "pricing calculation",
    relationshipRule: "Line-level discount percentage"
  },
  {
    fieldName: "Detail.ExpensedTax",
    dataType: "N" as const,
    canonicalDescription: "The amount of non-claimable sales tax on the line (only set for transactions of type CI and CP that involve sales tax). When a line is saved, the net is adjusted up by this amount and the tax down; when the transaction is viewed, the reverse happens.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "tax calculation",
    relationshipRule: "Non-recoverable tax handling for expense transactions"
  },
  {
    fieldName: "Detail.Flags",
    dataType: "N" as const,
    canonicalDescription: "See Detail Flags table",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "MoneyWorksDetailFlags",
    relationshipRule: "Bit-mapped flags for detail line attributes"
  },
  {
    fieldName: "Detail.Gross",
    dataType: "N" as const,
    canonicalDescription: "The gross value of the detail line.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "line totals",
    relationshipRule: "Line total including tax"
  },
  {
    fieldName: "Detail.JobCode",
    dataType: "T" as const,
    maxLength: 9,
    canonicalDescription: "This is the job code for the detail line.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Jobs.Code",
    relationshipRule: "Job costing allocation for project tracking"
  },
  {
    fieldName: "Detail.MoreFlags",
    dataType: "N" as const,
    canonicalDescription: "For more flags, see flags table",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "MoneyWorksDetailMoreFlags",
    relationshipRule: "Extended bit-mapped flags for detail line attributes"
  },
  {
    fieldName: "Detail.NonInvRcvdNotInvoicedQty",
    dataType: "N" as const,
    canonicalDescription: "The quantity of non-inventoried items on an order received but not invoiced",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "order processing",
    relationshipRule: "Tracks non-inventory items received but not yet invoiced"
  },
  {
    fieldName: "Detail.OrderQty",
    dataType: "N" as const,
    canonicalDescription: "The original order quantity for an order",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "order management",
    relationshipRule: "Original quantity ordered for fulfillment tracking"
  },
  {
    fieldName: "Detail.OrderStatus",
    dataType: "B" as const,
    canonicalDescription: "0 if not shipped or part shipped, 1 if fully shipped",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "order fulfillment",
    relationshipRule: "Binary status for order line completion"
  },
  {
    fieldName: "Detail.OriginalUnitCost",
    dataType: "N" as const,
    canonicalDescription: "The unit cost of an inventoried item before the transaction was posted (available for some lines involving stock replenishment)",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "inventory costing",
    relationshipRule: "Historical cost tracking for inventory valuation"
  },
  {
    fieldName: "Detail.ParentSeq",
    dataType: "N" as const,
    canonicalDescription: "The sequence number of the parent transaction",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    isIndexed: true,
    relationshipTarget: "Transaction.SequenceNumber",
    relationshipRule: "Foreign key linking detail lines to parent transaction"
  },
  {
    fieldName: "Detail.Period",
    dataType: "N" as const,
    canonicalDescription: "Same as the transaction Period field",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Transaction.Period",
    relationshipRule: "Inherited period from parent transaction"
  },
  {
    fieldName: "Detail.PostedQty",
    dataType: "N" as const,
    canonicalDescription: "For stock purchase transactions, the buy quantity adjusted for the product conversion factor, gives the qty in sell units, which is the posted qty.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "inventory management",
    relationshipRule: "Stock quantity in selling units for inventory posting"
  },
  {
    fieldName: "Detail.SaleUnit",
    dataType: "A" as const,
    maxLength: 3,
    canonicalDescription: "For product transaction detail lines, this is the selling unit of measure as copied from the product record.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Products.SellUnit",
    relationshipRule: "Unit of measure for product sales"
  },
  {
    fieldName: "Detail.SecurityLevel",
    dataType: "N" as const,
    canonicalDescription: "The security level of the line (inherited from the account's security level)",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Accounts.SecurityLevel",
    relationshipRule: "Access control inherited from account"
  },
  {
    fieldName: "Detail.SerialNumber",
    dataType: "N" as const,
    canonicalDescription: "The items's serial/batch number",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "inventory tracking",
    relationshipRule: "Serial number or batch number for inventory traceability"
  },
  {
    fieldName: "Detail.Statement",
    dataType: "N" as const,
    canonicalDescription: "The sequence number for the reconciliation record for which this detail line was reconciled. It is normally only used for detail lines which specify a bank account. If the item is not yet reconciled it contains a 0 (or a -1 if the reconciliation has been saved but not finalised).",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Reconciliation.SequenceNumber",
    relationshipRule: "Bank reconciliation linking for bank account detail lines"
  },
  {
    fieldName: "Detail.StockCode",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "The product code for the detail line. This will be blank if the transaction is a service-type transaction.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Products.Code",
    relationshipRule: "Product reference for inventory transactions"
  },
  {
    fieldName: "Detail.StockLocation",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "The item's location",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Inventory.Location",
    relationshipRule: "Stock location for multi-location inventory management"
  },
  {
    fieldName: "Detail.StockQty",
    dataType: "N" as const,
    canonicalDescription: "The quantity of the product specified by Detail.StockCode that is being purchased or sold. The units correspond to either the buyUnits for the product or the SellUnits for the product depending on whether this is a purchase (CP/CI) or a sale (CR/DI) transaction.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "inventory management",
    relationshipRule: "Product quantity in appropriate units (buy/sell units)"
  },
  {
    fieldName: "Detail.Sort",
    dataType: "N" as const,
    canonicalDescription: "The order of the detail lines as displayed in a transaction.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "display order",
    relationshipRule: "Sort order for detail line display"
  },
  {
    fieldName: "Detail.TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable data storage for custom applications"
  },
  {
    fieldName: "Detail.Tax",
    dataType: "N" as const,
    canonicalDescription: "The tax (GST, VAT etc) amount of the detail line.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "tax calculation",
    relationshipRule: "Line-level tax amount"
  },
  {
    fieldName: "Detail.TaxCode",
    dataType: "A" as const,
    maxLength: 5,
    canonicalDescription: "The tax code of the account.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "TaxRates.TaxCode",
    relationshipRule: "Tax rate classification for line-level tax calculation"
  },
  {
    fieldName: "Detail.TransactionType",
    dataType: "T" as const,
    maxLength: 2,
    canonicalDescription: "The first two characters of the transaction type (i.e. CP, CR, CI, DI, JN, PO, SO, QU)",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "Transaction.Type",
    relationshipRule: "Abbreviated transaction type for detail line processing"
  },
  {
    fieldName: "Detail.UnitPrice",
    dataType: "N" as const,
    canonicalDescription: "For a purchase, this is the same as the cost price. For a sale, this is the unit selling price of the product exclusive of GST and discount.",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "pricing calculation",
    relationshipRule: "Unit price for quantity-based calculations"
  },
  {
    fieldName: "Detail.UserNum",
    dataType: "N" as const,
    canonicalDescription: "Scriptable number",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable numeric data storage"
  },
  {
    fieldName: "Detail.UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_transactions.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable text data storage"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS TRANSACTION TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical transaction type definitions with manual explanations
 */
export interface MoneyWorksTransactionTypeDefinition {
  type: MoneyWorksTransactionType;
  canonicalName: string;
  moneyWorksDescription: string;
  manualSource: string;
  businessContext: string;
  universalApplicability: string[];
}

export const MONEYWORKS_TRANSACTION_TYPE_DEFINITIONS: MoneyWorksTransactionTypeDefinition[] = [
  {
    type: MoneyWorksTransactionType.CASH_RECEIPT,
    canonicalName: "Cash Receipt/Sale",
    moneyWorksDescription: "Cash receipt/sale",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Immediate payment received for goods/services",
    universalApplicability: ["restaurant", "retail", "consulting", "medical", "legal"]
  },
  {
    type: MoneyWorksTransactionType.CASH_PAYMENT,
    canonicalName: "Cash Payment/Purchase",
    moneyWorksDescription: "Cash payment/purchase",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Immediate payment made for goods/services",
    universalApplicability: ["restaurant", "retail", "consulting", "medical", "legal"]
  },
  {
    type: MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE,
    canonicalName: "Debtor Invoice Incomplete",
    moneyWorksDescription: "Debtor invoice--incomplete",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Invoice issued to debtor awaiting payment",
    universalApplicability: ["consulting", "legal", "medical", "manufacturing", "services"]
  },
  {
    type: MoneyWorksTransactionType.DEBTOR_INVOICE_COMPLETE,
    canonicalName: "Debtor Invoice Complete",
    moneyWorksDescription: "Debtor invoice--fully paid",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Invoice issued to debtor that has been fully paid",
    universalApplicability: ["consulting", "legal", "medical", "manufacturing", "services"]
  },
  {
    type: MoneyWorksTransactionType.CREDITOR_INVOICE_INCOMPLETE,
    canonicalName: "Creditor Invoice Incomplete",
    moneyWorksDescription: "Creditor invoice--incomplete",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Invoice received from creditor awaiting payment",
    universalApplicability: ["restaurant", "retail", "consulting", "medical", "legal"]
  },
  {
    type: MoneyWorksTransactionType.CREDITOR_INVOICE_COMPLETE,
    canonicalName: "Creditor Invoice Complete",
    moneyWorksDescription: "Creditor invoice--fully paid",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Invoice received from creditor that has been fully paid",
    universalApplicability: ["restaurant", "retail", "consulting", "medical", "legal"]
  },
  {
    type: MoneyWorksTransactionType.GENERAL_JOURNAL,
    canonicalName: "General Journal",
    moneyWorksDescription: "General journal",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "General accounting entries for adjustments and corrections",
    universalApplicability: ["all business types"]
  },
  {
    type: MoneyWorksTransactionType.STOCK_JOURNAL,
    canonicalName: "Stock Journal",
    moneyWorksDescription: "Stock journal",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Inventory adjustments and stock movements",
    universalApplicability: ["retail", "manufacturing", "medical", "restaurant"]
  },
  {
    type: MoneyWorksTransactionType.SALES_ORDER_INCOMPLETE,
    canonicalName: "Sales Order Incomplete",
    moneyWorksDescription: "Sales order (incomplete)",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Sales order awaiting fulfillment",
    universalApplicability: ["retail", "manufacturing", "medical", "restaurant"]
  },
  {
    type: MoneyWorksTransactionType.SALES_ORDER_COMPLETE,
    canonicalName: "Sales Order Complete",
    moneyWorksDescription: "Sales order (complete) = Sold",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Sales order fully fulfilled",
    universalApplicability: ["retail", "manufacturing", "medical", "restaurant"]
  },
  {
    type: MoneyWorksTransactionType.PURCHASE_ORDER_INCOMPLETE,
    canonicalName: "Purchase Order Incomplete",
    moneyWorksDescription: "Purchase order (incomplete)",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Purchase order awaiting receipt",
    universalApplicability: ["retail", "manufacturing", "medical", "restaurant"]
  },
  {
    type: MoneyWorksTransactionType.PURCHASE_ORDER_COMPLETE,
    canonicalName: "Purchase Order Complete",
    moneyWorksDescription: "Purchase order (complete) = Bought",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Purchase order fully received",
    universalApplicability: ["retail", "manufacturing", "medical", "restaurant"]
  },
  {
    type: MoneyWorksTransactionType.QUOTE,
    canonicalName: "Quote",
    moneyWorksDescription: "Quote",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Price quotation to potential debtor",
    universalApplicability: ["consulting", "legal", "medical", "manufacturing", "services"]
  },
  {
    type: MoneyWorksTransactionType.CASH_RECEIPT_DEBTOR,
    canonicalName: "Cash Receipt for Debtor",
    moneyWorksDescription: "Receipt for a debtor invoice",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Payment received against debtor invoice",
    universalApplicability: ["consulting", "legal", "medical", "manufacturing", "services"]
  },
  {
    type: MoneyWorksTransactionType.CASH_PAYMENT_CREDITOR,
    canonicalName: "Cash Payment for Creditor",
    moneyWorksDescription: "Cash payment for a creditor invoice",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Payment made against creditor invoice",
    universalApplicability: ["restaurant", "retail", "consulting", "medical", "legal"]
  },
  {
    type: MoneyWorksTransactionType.CASH_RECEIPT_CREDITOR_REFUND,
    canonicalName: "Cash Receipt Creditor Refund",
    moneyWorksDescription: "Receive refund from creditor",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Refund received from creditor",
    universalApplicability: ["restaurant", "retail", "consulting", "medical", "legal"]
  },
  {
    type: MoneyWorksTransactionType.CASH_PAYMENT_DEBTOR_REFUND,
    canonicalName: "Cash Payment Debtor Refund",
    moneyWorksDescription: "Returned refund to debtor",
    manualSource: "moneyworks_appendix_transactions.html",
    businessContext: "Refund made to debtor",
    universalApplicability: ["consulting", "legal", "medical", "manufacturing", "services"]
  }
];

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate canonical MoneyWorks transaction type
 */
export function validateTransactionTypeCanonical(type: string): {
  isValid: boolean;
  canonicalType?: MoneyWorksTransactionType;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const validTypes = Object.values(MoneyWorksTransactionType);
  if (!validTypes.includes(type as MoneyWorksTransactionType)) {
    warnings.push(`Invalid transaction type ${type}. MoneyWorks canonical types: ${validTypes.join(', ')}`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalType: type as MoneyWorksTransactionType,
    warnings
  };
}

/**
 * Validate canonical MoneyWorks transaction status
 */
export function validateTransactionStatusCanonical(status: string): {
  isValid: boolean;
  canonicalStatus?: MoneyWorksTransactionStatus;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const validStatuses = Object.values(MoneyWorksTransactionStatus);
  if (!validStatuses.includes(status as MoneyWorksTransactionStatus)) {
    warnings.push(`Invalid transaction status ${status}. MoneyWorks canonical statuses: U (unposted), P (posted)`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalStatus: status as MoneyWorksTransactionStatus,
    warnings
  };
}

/**
 * Get canonical MoneyWorks transaction type explanation
 */
export function getCanonicalTransactionTypeExplanation(type: MoneyWorksTransactionType): string {
  const typeDef = MONEYWORKS_TRANSACTION_TYPE_DEFINITIONS.find(def => def.type === type);
  if (!typeDef) {
    return `Unknown transaction type: ${type}`;
  }
  
  return `${typeDef.canonicalName}: ${typeDef.businessContext}. Universal applicability: ${typeDef.universalApplicability.join(', ')}`;
}

/**
 * Determine if transaction creates receivable (debtor owing money)
 */
export function isCanonicalReceivableTransaction(type: MoneyWorksTransactionType): boolean {
  return [
    MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE,
    MoneyWorksTransactionType.DEBTOR_INVOICE_COMPLETE,
    MoneyWorksTransactionType.SALES_ORDER_INCOMPLETE,
    MoneyWorksTransactionType.SALES_ORDER_COMPLETE
  ].includes(type);
}

/**
 * Determine if transaction creates payable (creditor owed money)
 */
export function isCanonicalPayableTransaction(type: MoneyWorksTransactionType): boolean {
  return [
    MoneyWorksTransactionType.CREDITOR_INVOICE_INCOMPLETE,
    MoneyWorksTransactionType.CREDITOR_INVOICE_COMPLETE,
    MoneyWorksTransactionType.PURCHASE_ORDER_INCOMPLETE,
    MoneyWorksTransactionType.PURCHASE_ORDER_COMPLETE
  ].includes(type);
}

/**
 * Determine if transaction involves cash movement
 */
export function isCanonicalCashTransaction(type: MoneyWorksTransactionType): boolean {
  return [
    MoneyWorksTransactionType.CASH_RECEIPT,
    MoneyWorksTransactionType.CASH_PAYMENT,
    MoneyWorksTransactionType.CASH_RECEIPT_DEBTOR,
    MoneyWorksTransactionType.CASH_PAYMENT_CREDITOR,
    MoneyWorksTransactionType.CASH_RECEIPT_CREDITOR_REFUND,
    MoneyWorksTransactionType.CASH_PAYMENT_DEBTOR_REFUND
  ].includes(type);
}

export default {
  MONEYWORKS_TRANSACTION_TYPE_DEFINITIONS,
  MONEYWORKS_TRANSACTION_FIELDS,
  MONEYWORKS_DETAIL_FIELDS,
  MoneyWorksTransactionType,
  MoneyWorksTransactionStatus,
  MoneyWorksPaymentMethod,
  MoneyWorksTransactionFlags,
  MoneyWorksDetailFlags,
  MoneyWorksDetailMoreFlags
};