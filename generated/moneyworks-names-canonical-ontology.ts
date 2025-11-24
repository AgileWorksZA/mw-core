/**
 * MoneyWorks Names Entity - Canonical Ontology (100% COMPLETE)
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_names.html
 * Authority: MoneyWorks Manual - Names Field Descriptions
 * 
 * COVERAGE: 96/96 fields (100%) - Complete canonical extraction
 * Enhanced: 2025-07-12 by ont1 (added 57 fields from 39 to achieve 100%)
 * 
 * CRITICAL DISCOVERIES:
 * 1. MoneyWorks has hierarchical name classification:
 *    - Customer vs Debtor (different types, Debtor is specific type of Customer)
 *    - Supplier vs Creditor (different types, Creditor is specific type of Supplier)
 * 
 * 2. DUAL-LAYER CONTACT ARCHITECTURE:
 *    Names Entity provides built-in contact management for up to 2 contacts per Name:
 *    - Contact1 fields: Contact, email, Mobile, DDI, Afterhours, Position, Salutation, Role, Memo
 *    - Contact2 fields: Contact2, email2, Mobile2, DDI2, Afterhours2, Position2, Salutation2, Role2, Memo2
 *    - Quick access for simple contact scenarios (most common business pattern)
 *    - Embedded directly in Names record for performance
 * 
 *    Contacts Entity (subfile) provides unlimited contact expansion:
 *    - References Names via ParentSeq → Names.Seq relationship
 *    - Unlimited contacts per Name entity
 *    - Enhanced role management and ordering capabilities
 *    - Used for complex organizational hierarchies
 * 
 * 3. ARCHITECTURAL USAGE PATTERNS:
 *    - Simple businesses: Use Names built-in Contact1/Contact2 fields only
 *    - Complex organizations: Use Names for primary contacts + Contacts subfile for additional
 *    - Enterprise scenarios: Contacts subfile becomes primary contact management system
 */

// ============================================================================
// CANONICAL MONEYWORKS NAME TYPES
// ============================================================================

/**
 * MoneyWorks canonical customer type classification
 * Source: moneyworks_appendix_names.html - "CustomerType" field
 */
export enum MoneyWorksCustomerType {
  /** Not a customer */
  NOT_CUSTOMER = 0,
  
  /** Customer */
  CUSTOMER = 1,
  
  /** Debtor */
  DEBTOR = 2
}

/**
 * MoneyWorks canonical supplier type classification  
 * Source: moneyworks_appendix_names.html - "SupplierType" field
 */
export enum MoneyWorksSupplierType {
  /** Not a supplier */
  NOT_SUPPLIER = 0,
  
  /** Supplier */
  SUPPLIER = 1,
  
  /** Creditor */
  CREDITOR = 2
}

/**
 * MoneyWorks canonical name kind classification
 * Source: moneyworks_appendix_names.html - "Kind" field
 */
export enum MoneyWorksNameKind {
  /** Template name */
  TEMPLATE = 0,
  
  /** Normal name */
  NORMAL = 1
}

/**
 * MoneyWorks canonical payment methods
 * Source: moneyworks_appendix_names.html - "PaymentMethod" field
 */
export enum MoneyWorksPaymentMethod {
  /** None */
  NONE = 0,
  
  /** Cash */
  CASH = 1,
  
  /** Cheque */
  CHEQUE = 2,
  
  /** Electronic */
  ELECTRONIC = 3
  
  // Note: Manual indicates "etc" - more values exist but not specified
  // #TODO - Read the PaymentMethods and complete them here.
}

/**
 * MoneyWorks canonical name flags
 * Source: moneyworks_appendix_names.html - "Name Flags" table
 */
export enum MoneyWorksNameFlags {
  /** Requires order number */
  REQUIRES_ORDER_NUMBER = 0x0001
}

// ============================================================================
// CANONICAL MONEYWORKS NAME FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks name fields as defined in manual
 * Source: moneyworks_appendix_names.html - Names table
 */
export const MONEYWORKS_NAME_FIELDS = [
  {
    fieldName: "Code",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "The name code. For non-sundries, only the first ten characters are used.",
    manualSource: "moneyworks_appendix_names.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Name", 
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Name of company",
    manualSource: "moneyworks_appendix_names.html",
    isRequired: true
  },
  {
    fieldName: "CustomerType",
    dataType: "N" as const,
    canonicalDescription: "0 for not a customer, 1 for customer, 2 for debtor",
    manualSource: "moneyworks_appendix_names.html",
    isRequired: true
  },
  {
    fieldName: "SupplierType", 
    dataType: "N" as const,
    canonicalDescription: "0 for not a supplier, 1 for supplier, 2 for creditor",
    manualSource: "moneyworks_appendix_names.html", 
    isRequired: true
  },
  {
    fieldName: "Kind",
    dataType: "N" as const,
    canonicalDescription: "The kind of Name. 0 for a template, 1 for a normal",
    manualSource: "moneyworks_appendix_names.html",
    isRequired: true
  },
  {
    fieldName: "Hold",
    dataType: "B" as const,
    canonicalDescription: "\"True\" if the debtor is on hold (\"False\" otherwise)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "RecAccount",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The Accounts Receivable control account code for a debtor.",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "PayAccount",
    dataType: "T" as const, 
    maxLength: 7,
    canonicalDescription: "The Accounts Payable control account code for a creditor.",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "CreditLimit",
    dataType: "N" as const,
    canonicalDescription: "The credit limit for a debtor",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "CCurrent",
    dataType: "N" as const,
    canonicalDescription: "For a creditor, the current balance.",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "DCurrent",
    dataType: "N" as const,
    canonicalDescription: "For a debtor, the current balance. The total balance for the debtor is the sum of all the balance fields.",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "DebtorTerms",
    dataType: "N" as const,
    canonicalDescription: "If > 0, within N days; if < 0, Nth day of month following",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "CreditorTerms",
    dataType: "N" as const,
    canonicalDescription: "If > 0, within N days; if < 0, Nth day of month following", 
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "PaymentMethod",
    dataType: "N" as const,
    canonicalDescription: "Payment method (0 = None, 1 = Cash, 2 = Cheque, 3 = Electronic, etc).",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // CONTACT PERSON NAMES (DUAL-LAYER ARCHITECTURE: NAMES BUILT-IN CONTACTS)
  // ============================================================================
  
  {
    fieldName: "Contact",
    dataType: "T" as const,
    maxLength: 25,
    canonicalDescription: "Contact person 1 in the company",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Contact",
    relationshipRule: "Primary contact can be supplemented by Contacts subfile for unlimited contacts"
  },
  {
    fieldName: "Contact2", 
    dataType: "T" as const,
    maxLength: 29,
    canonicalDescription: "Name of contact person 2",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Contact",
    relationshipRule: "Secondary contact can be supplemented by Contacts subfile for unlimited contacts"
  },

  // ============================================================================
  // COMMUNICATION FIELDS (DUAL-LAYER ARCHITECTURE: NAMES BUILT-IN COMMUNICATION)
  // ============================================================================
  
  {
    fieldName: "email",
    dataType: "T" as const,
    maxLength: 80,
    canonicalDescription: "email address for contact 1",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.eMail",
    relationshipRule: "Built-in email field (max 80 chars) vs Contacts.eMail (max 63 chars) - Names provides more capacity"
  },
  {
    fieldName: "email2",
    dataType: "T" as const, 
    maxLength: 80,
    canonicalDescription: "email address for contact 2",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.eMail",
    relationshipRule: "Built-in email field (max 80 chars) vs Contacts.eMail (max 63 chars) - Names provides more capacity"
  },
  {
    fieldName: "Mobile",
    dataType: "T" as const,
    maxLength: 14,
    canonicalDescription: "Mobile phone number for contact 1", 
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Mobile",
    relationshipRule: "Built-in mobile field (max 14 chars) vs Contacts.Mobile (max 19 chars) - Contacts provides more capacity"
  },
  {
    fieldName: "Mobile2",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "Mobile phone number for contact 2",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Mobile", 
    relationshipRule: "Built-in mobile field (max 13 chars) vs Contacts.Mobile (max 19 chars) - Contacts provides more capacity"
  },
  {
    fieldName: "DDI",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "Direct dial number for contact 1",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.DDI",
    relationshipRule: "Built-in DDI field - same 19 char capacity as Contacts.DDI"
  },
  {
    fieldName: "DDI2",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "Direct dial number for contact 2",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.DDI",
    relationshipRule: "Built-in DDI field - same 19 char capacity as Contacts.DDI"
  },
  {
    fieldName: "Afterhours",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "After hours phone number for contact 1",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.AfterHours",
    relationshipRule: "Built-in afterhours field (max 11 chars) vs Contacts.AfterHours (max 19 chars) - Contacts provides more capacity"
  },
  {
    fieldName: "Afterhours2",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "After hours phone number for contact 2",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.AfterHours",
    relationshipRule: "Built-in afterhours field (max 11 chars) vs Contacts.AfterHours (max 19 chars) - Contacts provides more capacity"
  },
  {
    fieldName: "Phone",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "Phone number",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Fax",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "Facsimile number",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // PROFESSIONAL CONTACT INFORMATION (DUAL-LAYER ARCHITECTURE)
  // ============================================================================
  
  {
    fieldName: "Position",
    dataType: "T" as const,
    maxLength: 29,
    canonicalDescription: "Position of contact person 1",
    manualSource: "moneyworks_appendix_names.html", 
    relationshipTarget: "Contacts.Position",
    relationshipRule: "Built-in position field (max 29 chars) vs Contacts.Position (max 39 chars) - Contacts provides more capacity"
  },
  {
    fieldName: "Position2",
    dataType: "T" as const,
    maxLength: 29,
    canonicalDescription: "Position of contact 2",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Position",
    relationshipRule: "Built-in position field (max 29 chars) vs Contacts.Position (max 39 chars) - Contacts provides more capacity"
  },
  {
    fieldName: "Salutation",
    dataType: "T" as const,
    maxLength: 39,
    canonicalDescription: "Salutation for contact 1",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Salutation",
    relationshipRule: "Built-in salutation field - same 39 char capacity as Contacts.Salutation"
  },
  {
    fieldName: "Salutation2",
    dataType: "T" as const,
    maxLength: 39,
    canonicalDescription: "Salutation for contact 2",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Salutation",
    relationshipRule: "Built-in salutation field - same 39 char capacity as Contacts.Salutation"
  },

  // ============================================================================
  // ROLE AND MEMO FIELDS (DUAL-LAYER ARCHITECTURE) 
  // ============================================================================
  
  {
    fieldName: "Role",
    dataType: "N" as const,
    canonicalDescription: "Roles for contact 1. This is a bit mapped field, with each bit representing a role.",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Role",
    relationshipRule: "Built-in role field - same bit-mapped functionality as Contacts.Role"
  },
  {
    fieldName: "Role2",
    dataType: "N" as const,
    canonicalDescription: "Roles for contact 2. This is a bit mapped field, with each bit representing a role.",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Role",
    relationshipRule: "Built-in role field - same bit-mapped functionality as Contacts.Role"
  },
  {
    fieldName: "Memo",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Memo/notes for contact 1",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Memo",
    relationshipRule: "Built-in memo field - same 255 char capacity as Contacts.Memo"
  },
  {
    fieldName: "Memo2",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Memo/notes for contact 2",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Contacts.Memo",
    relationshipRule: "Built-in memo field - same 255 char capacity as Contacts.Memo"
  },

  // ============================================================================
  // ADDRESS AND LOCATION FIELDS
  // ============================================================================
  
  {
    fieldName: "Address1",
    dataType: "T" as const,
    maxLength: 59,
    canonicalDescription: "Mailing Address (first line)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Address2",
    dataType: "T" as const,
    maxLength: 59,
    canonicalDescription: "Mailing Address (second line)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Address3",
    dataType: "T" as const,
    maxLength: 59,
    canonicalDescription: "Mailing Address (third line)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Address4",
    dataType: "T" as const,
    maxLength: 59,
    canonicalDescription: "Mailing Address (fourth line)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "PostCode",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "Post code",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "State",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "State (for postal address)",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // DELIVERY ADDRESS FIELDS
  // ============================================================================
  
  {
    fieldName: "Delivery1",
    dataType: "T" as const,
    maxLength: 59,
    canonicalDescription: "Delivery address (first line)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Delivery2",
    dataType: "T" as const,
    maxLength: 59,
    canonicalDescription: "Delivery address (second line)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Delivery3",
    dataType: "T" as const,
    maxLength: 59,
    canonicalDescription: "Delivery address (third line)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Delivery4",
    dataType: "T" as const,
    maxLength: 59,
    canonicalDescription: "Delivery address (fourth line)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "DeliveryPostcode",
    dataType: "T" as const,
    maxLength: 12,
    canonicalDescription: "Postcode/zipcode of delivery address",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "DeliveryState",
    dataType: "T" as const,
    maxLength: 4,
    canonicalDescription: "Sate of delivery address",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // FINANCIAL AND BUSINESS FIELDS
  // ============================================================================
  
  {
    fieldName: "Currency",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "Currency of customer/supplier (blank if local)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "TaxCode",
    dataType: "A" as const,
    maxLength: 5,
    canonicalDescription: "Tax code override",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "TaxRates.Code",
    relationshipRule: "References TaxRates entity for tax calculation overrides"
  },
  {
    fieldName: "TaxNumber",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "Their tax number (GST#, VAT#, ABN etc, depending on country)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "TheirRef",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "The reference code by which the supplier or customer refers to your company.",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Discount",
    dataType: "N" as const,
    canonicalDescription: "Discount field for a customer",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "ProductPricing",
    dataType: "T" as const,
    maxLength: 1,
    canonicalDescription: "Pricing level for customer. (A-F)",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // AGING AND BALANCE FIELDS
  // ============================================================================
  
  {
    fieldName: "D30Plus",
    dataType: "N" as const,
    canonicalDescription: "Debtor 30 day balance (1 cycle of manual ageing).",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "D60Plus",
    dataType: "N" as const,
    canonicalDescription: "Debtor 60 day balance (2 cycles of manual ageing).",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "D90Plus",
    dataType: "N" as const,
    canonicalDescription: "Debtor 90 days+ balance (3 cycles of manual ageing).",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "DBalance",
    dataType: "N" as const,
    canonicalDescription: "Sum of D90Plus, D60Plus, D30Plus and DCurrent",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // BANK AND PAYMENT FIELDS
  // ============================================================================
  
  {
    fieldName: "Bank",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The customer's bank (e.g. BNZ)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "BankAccountNumber",
    dataType: "T" as const,
    maxLength: 23,
    canonicalDescription: "The bank account number of the name, as supplied by their bank",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "BankBranch",
    dataType: "T" as const,
    maxLength: 21,
    canonicalDescription: "The bank branch (e.g. Main St.)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "AccountName",
    dataType: "T" as const,
    maxLength: 21,
    canonicalDescription: "The bank account name (e.g. XYZ Trading Company)",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "ReceiptMethod",
    dataType: "N" as const,
    canonicalDescription: "Preferred payment method of customers. 1 = Cash, 2 = Cheque etc.",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "LastPaymentMethod",
    dataType: "N" as const,
    canonicalDescription: "PaymentMethod used in previous transaction",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // SALES AND BUSINESS MANAGEMENT FIELDS
  // ============================================================================
  
  {
    fieldName: "SalesPerson",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "Code for salesperson for client--automatically copied to the transaction.salesperson field.",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "DateOfLastSale",
    dataType: "D" as const,
    canonicalDescription: "Date of last invoice or cash sale",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "WebURL",
    dataType: "T" as const,
    maxLength: 63,
    canonicalDescription: "Web URL",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // USER-DEFINED AND CATEGORY FIELDS
  // ============================================================================
  
  {
    fieldName: "Category1",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Category2",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Category3",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Category4",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // SYSTEM AND METADATA FIELDS
  // ============================================================================
  
  {
    fieldName: "Flags",
    dataType: "N" as const,
    canonicalDescription: "See Names Flags table below",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Colour",
    dataType: "N" as const,
    canonicalDescription: "The colour, represented internally as a numeric index in the range 0-7 but rendered as a textual colour name",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "Date and Time the record was last modified",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Comment",
    dataType: "T" as const,
    maxLength: 1020,
    canonicalDescription: "A comment",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // MODERN E-COMMERCE AND INTEGRATION FIELDS
  // ============================================================================
  
  {
    fieldName: "EInvoiceID",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "The ID to use for the customer when eInvoicing using a Peppol Access Point (e.g. ABN in Australia, NZBN in New Zealand)",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // EXTENDED CUSTOM FIELDS (NEW IN RECENT VERSIONS)
  // ============================================================================
  
  {
    fieldName: "Custom1",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Custom2",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Custom3",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Custom4",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Custom5",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Custom6",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Custom7",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "Custom8",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // PROMPT PAYMENT AND DISCOUNT FIELDS
  // ============================================================================
  
  {
    fieldName: "CustPropmtPaymentDiscount",
    dataType: "N" as const,
    canonicalDescription: "Prompt payment discount percentage",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "CustPromptPaymentTerms",
    dataType: "N" as const,
    canonicalDescription: "0 for no prompt payment; > 0 for within N days; < 0 for by Nth date of following month",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "SuppPromptPaymentDiscount",
    dataType: "N" as const,
    canonicalDescription: "Percentage amount of prompt payment discount offered by supplier",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "SupplierPromptPaymentTerms",
    dataType: "N" as const,
    canonicalDescription: "0 for no prompt payment; > 0 for within N days; < 0 for by Nth date of following month",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // SPLIT ACCOUNT ALLOCATION FIELDS
  // ============================================================================
  
  {
    fieldName: "SplitAcct1",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "Account code for first split account",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Accounts.Code",
    relationshipRule: "References Accounts entity for split allocation account 1"
  },
  {
    fieldName: "SplitAcct2",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "Account code for remainder split account",
    manualSource: "moneyworks_appendix_names.html",
    relationshipTarget: "Accounts.Code",
    relationshipRule: "References Accounts entity for split allocation remainder account"
  },
  {
    fieldName: "SplitPercent",
    dataType: "N" as const,
    canonicalDescription: "Percent of allocation to be put into SplitAcct1",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // CREDIT CARD FIELDS
  // ============================================================================
  
  {
    fieldName: "CreditCardExpiry",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "Expiry date of credit card",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "CreditCardName",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "Name on credit card",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    fieldName: "CreditCardNum",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "Credit card number",
    manualSource: "moneyworks_appendix_names.html"
  },

  // ============================================================================
  // LEGACY SYSTEM FIELDS (FOR COMPLETENESS)
  // ============================================================================
  
  {
    fieldName: "ABUID",
    dataType: "S" as const,
    canonicalDescription: "Mac Address Book Universal ID--set for imported address book entries only",
    manualSource: "moneyworks_appendix_names.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS NAME TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical name type definitions with manual explanations
 */
export interface MoneyWorksNameTypeDefinition {
  type: MoneyWorksCustomerType | MoneyWorksSupplierType;
  canonicalName: string;
  moneyWorksDescription: string;
  manualSource: string;
  businessContext: string;
}

export const MONEYWORKS_CUSTOMER_TYPE_DEFINITIONS: MoneyWorksNameTypeDefinition[] = [
  {
    type: MoneyWorksCustomerType.NOT_CUSTOMER,
    canonicalName: "Not a Customer",
    moneyWorksDescription: "0 for not a customer",
    manualSource: "moneyworks_appendix_names.html",
    businessContext: "Name is not involved in sales transactions"
  },
  {
    type: MoneyWorksCustomerType.CUSTOMER,
    canonicalName: "Customer", 
    moneyWorksDescription: "1 for customer",
    manualSource: "moneyworks_appendix_names.html",
    businessContext: "Name can participate in sales transactions"
  },
  {
    type: MoneyWorksCustomerType.DEBTOR,
    canonicalName: "Debtor",
    moneyWorksDescription: "2 for debtor", 
    manualSource: "moneyworks_appendix_names.html",
    businessContext: "Name has outstanding receivables and full debtor functionality (aging, credit limits, etc.)"
  }
];

export const MONEYWORKS_SUPPLIER_TYPE_DEFINITIONS: MoneyWorksNameTypeDefinition[] = [
  {
    type: MoneyWorksSupplierType.NOT_SUPPLIER,
    canonicalName: "Not a Supplier",
    moneyWorksDescription: "0 for not a supplier",
    manualSource: "moneyworks_appendix_names.html", 
    businessContext: "Name is not involved in purchase transactions"
  },
  {
    type: MoneyWorksSupplierType.SUPPLIER,
    canonicalName: "Supplier",
    moneyWorksDescription: "1 for supplier",
    manualSource: "moneyworks_appendix_names.html",
    businessContext: "Name can participate in purchase transactions"
  },
  {
    type: MoneyWorksSupplierType.CREDITOR,
    canonicalName: "Creditor",
    moneyWorksDescription: "2 for creditor",
    manualSource: "moneyworks_appendix_names.html",
    businessContext: "Name has outstanding payables and full creditor functionality (aging, payment terms, etc.)"
  }
];

// ============================================================================
// CANONICAL MONEYWORKS TERMINOLOGY CLARIFICATION
// ============================================================================

/**
 * CRITICAL ARCHITECTURAL INSIGHT:
 * 
 * MoneyWorks canonical terminology distinguishes between:
 * 
 * CUSTOMER vs DEBTOR:
 * - Customer (Type 1): Can make purchases, basic sales functionality
 * - Debtor (Type 2): Has receivables, full credit management, aging, credit limits
 * 
 * SUPPLIER vs CREDITOR:
 * - Supplier (Type 1): Can provide goods/services, basic purchase functionality  
 * - Creditor (Type 2): Has payables, full payment management, aging, payment terms
 * 
 * This means our semantic implementations must respect this hierarchy:
 * - "Debtor" is MORE SPECIFIC than "Customer" in MoneyWorks
 * - "Creditor" is MORE SPECIFIC than "Supplier" in MoneyWorks
 */

export const MONEYWORKS_NAME_CANONICAL_TERMS = {
  // Primary classifications (MoneyWorks canonical)
  CUSTOMER: "Customer",           // Type 1 - basic sales functionality
  DEBTOR: "Debtor",               // Type 2 - full receivables management
  SUPPLIER: "Supplier",           // Type 1 - basic purchase functionality  
  CREDITOR: "Creditor",           // Type 2 - full payables management
  
  // Name management (MoneyWorks canonical)
  NAME_CODE: "Name Code",         // Unique identifier for name
  NORMAL_NAME: "Normal Name",     // Regular business entity
  TEMPLATE_NAME: "Template Name", // Template for creating new names
  
  // Account relationships (MoneyWorks canonical)
  RECEIVABLES_ACCOUNT: "Accounts Receivable Control Account",  // For debtors
  PAYABLES_ACCOUNT: "Accounts Payable Control Account",        // For creditors
  
  // Status management (MoneyWorks canonical)
  ON_HOLD: "On Hold",             // Debtor transaction restriction
  CREDIT_LIMIT: "Credit Limit",   // Debtor spending limit
  PAYMENT_TERMS: "Payment Terms", // Days or date-based terms
  
  // Balance tracking (MoneyWorks canonical)
  DEBTOR_CURRENT: "Debtor Current Balance",    // Current outstanding
  CREDITOR_CURRENT: "Creditor Current Balance", // Current payable
  AGING_BALANCE: "Aging Balance"                // Age-based balance tracking
} as const;

// ============================================================================
// DUAL-LAYER CONTACT ARCHITECTURE - BUSINESS RULES AND PATTERNS
// ============================================================================

/**
 * MoneyWorks Dual-Layer Contact Architecture Business Rules
 * Source: moneyworks_appendix_names.html + moneyworks_appendix_contacts.html
 * 
 * ARCHITECTURAL INSIGHT: MoneyWorks provides two complementary contact management systems:
 * 1. Names Entity: Built-in Contact1/Contact2 fields (embedded, fast access)
 * 2. Contacts Entity: Unlimited contacts via subfile (hierarchical, extensible)
 */
export const MONEYWORKS_DUAL_CONTACT_BUSINESS_RULES = [
  {
    entitySource: "Names + Contacts",
    ruleType: "architectural" as const,
    canonicalRule: "Names provides built-in contact fields for up to 2 contacts, Contacts subfile provides unlimited expansion",
    manualSource: "moneyworks_appendix_names.html + moneyworks_appendix_contacts.html",
    businessContext: "Dual-layer architecture optimizes for common case (1-2 contacts) while supporting complex hierarchies"
  },
  
  {
    entitySource: "Names",
    fieldName: "Contact vs Contact2",
    ruleType: "capacity" as const,
    canonicalRule: "Names.Contact (25 chars) vs Names.Contact2 (29 chars) - different field capacities within same entity",
    manualSource: "moneyworks_appendix_names.html",
    businessContext: "Contact2 provides slightly more capacity than Contact1"
  },
  
  {
    entitySource: "Names vs Contacts",
    fieldName: "email vs eMail",
    ruleType: "capacity" as const,
    canonicalRule: "Names.email (80 chars) vs Contacts.eMail (63 chars) - Names provides more email capacity",
    manualSource: "moneyworks_appendix_names.html + moneyworks_appendix_contacts.html",
    businessContext: "Built-in Names email fields optimized for longer email addresses"
  },
  
  {
    entitySource: "Names vs Contacts",
    fieldName: "Mobile capacity",
    ruleType: "capacity" as const,
    canonicalRule: "Names.Mobile (14 chars), Names.Mobile2 (13 chars) vs Contacts.Mobile (19 chars) - Contacts provides more mobile capacity",
    manualSource: "moneyworks_appendix_names.html + moneyworks_appendix_contacts.html",
    businessContext: "Contacts subfile optimized for longer international mobile numbers"
  },
  
  {
    entitySource: "Names vs Contacts",
    fieldName: "Position capacity",
    ruleType: "capacity" as const,
    canonicalRule: "Names.Position/Position2 (29 chars) vs Contacts.Position (39 chars) - Contacts provides more position capacity",
    manualSource: "moneyworks_appendix_names.html + moneyworks_appendix_contacts.html",
    businessContext: "Contacts subfile supports longer professional titles"
  },
  
  {
    entitySource: "Names vs Contacts",
    fieldName: "Contact name capacity",
    ruleType: "capacity" as const,
    canonicalRule: "Names.Contact (25 chars), Names.Contact2 (29 chars) vs Contacts.Contact (39 chars) - Contacts provides most capacity",
    manualSource: "moneyworks_appendix_names.html + moneyworks_appendix_contacts.html",
    businessContext: "Contacts subfile supports longer contact names for international scenarios"
  }
];

/**
 * Dual-Layer Contact Architecture Usage Patterns
 * Canonical recommendations for when to use Names vs Contacts
 */
export const MONEYWORKS_DUAL_CONTACT_USAGE_PATTERNS = [
  {
    scenario: "Simple Business Operations",
    recommendation: "Use Names built-in Contact1/Contact2 fields only",
    reasoning: "Most businesses need only 1-2 contacts per Name, built-in fields provide fastest access",
    businessTypes: ["small retail", "simple service providers", "basic suppliers"],
    canonicalApproach: "Names.Contact + Names.Contact2 + communication fields"
  },
  
  {
    scenario: "Medium Complexity Organizations", 
    recommendation: "Use Names for primary contacts + Contacts subfile for additional",
    reasoning: "Primary contacts in Names for fast access, additional contacts in Contacts for full details",
    businessTypes: ["medium enterprises", "multi-department organizations", "professional services"],
    canonicalApproach: "Names.Contact/Contact2 + Contacts subfile for 3+ contacts"
  },
  
  {
    scenario: "Enterprise Complex Hierarchies",
    recommendation: "Use Contacts subfile as primary contact management system",
    reasoning: "Complex role management, contact ordering, and unlimited expansion required",
    businessTypes: ["large corporations", "government entities", "complex suppliers"],
    canonicalApproach: "Contacts subfile with role-based management, Names fields optional"
  },
  
  {
    scenario: "International Operations",
    recommendation: "Use Contacts subfile for enhanced field capacities",
    reasoning: "Longer international names, mobile numbers, positions require Contacts field capacities",
    businessTypes: ["multinational companies", "international suppliers", "global customers"],
    canonicalApproach: "Contacts subfile for extended field lengths and character support"
  }
];

/**
 * Field Capacity Comparison Matrix
 * Names vs Contacts field capacity analysis for architectural decisions
 */
export const MONEYWORKS_CONTACT_FIELD_CAPACITY_MATRIX = {
  contactName: {
    names: { Contact: 25, Contact2: 29 },
    contacts: { Contact: 39 },
    recommendation: "Use Contacts for longer contact names"
  },
  
  email: {
    names: { email: 80, email2: 80 },
    contacts: { eMail: 63 },
    recommendation: "Use Names for longer email addresses"
  },
  
  mobile: {
    names: { Mobile: 14, Mobile2: 13 },
    contacts: { Mobile: 19 },
    recommendation: "Use Contacts for international mobile numbers"
  },
  
  position: {
    names: { Position: 29, Position2: 29 },
    contacts: { Position: 39 },
    recommendation: "Use Contacts for longer professional titles"
  },
  
  afterhours: {
    names: { Afterhours: 11, Afterhours2: 11 },
    contacts: { AfterHours: 19 },
    recommendation: "Use Contacts for longer after-hours numbers"
  },
  
  consistent: {
    names: { DDI: 19, DDI2: 19, Salutation: 39, Salutation2: 39, Memo: 255, Memo2: 255 },
    contacts: { DDI: 19, Salutation: 39, Memo: 255 },
    recommendation: "Same capacity - use based on architectural needs"
  }
};

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate canonical MoneyWorks name type definitions
 */
export function validateNameTypeCanonical(customerType: number, supplierType: number): {
  isValid: boolean;
  canonicalCustomerType?: MoneyWorksCustomerType;
  canonicalSupplierType?: MoneyWorksSupplierType;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Validate customer type
  const validCustomerTypes = [0, 1, 2];
  if (!validCustomerTypes.includes(customerType)) {
    warnings.push(`Invalid CustomerType ${customerType}. MoneyWorks canonical values: 0 (not customer), 1 (customer), 2 (debtor)`);
  }
  
  // Validate supplier type
  const validSupplierTypes = [0, 1, 2];
  if (!validSupplierTypes.includes(supplierType)) {
    warnings.push(`Invalid SupplierType ${supplierType}. MoneyWorks canonical values: 0 (not supplier), 1 (supplier), 2 (creditor)`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalCustomerType: customerType as MoneyWorksCustomerType,
    canonicalSupplierType: supplierType as MoneyWorksSupplierType,
    warnings
  };
}

/**
 * Get canonical MoneyWorks name type explanation
 */
export function getCanonicalNameTypeExplanation(customerType: MoneyWorksCustomerType, supplierType: MoneyWorksSupplierType): string {
  const customerDef = MONEYWORKS_CUSTOMER_TYPE_DEFINITIONS.find(def => def.type === customerType);
  const supplierDef = MONEYWORKS_SUPPLIER_TYPE_DEFINITIONS.find(def => def.type === supplierType);
  
  const customerDesc = customerDef ? `${customerDef.canonicalName} (${customerDef.businessContext})` : "Unknown customer type";
  const supplierDesc = supplierDef ? `${supplierDef.canonicalName} (${supplierDef.businessContext})` : "Unknown supplier type";
  
  return `MoneyWorks Name: ${customerDesc} and ${supplierDesc}`;
}

/**
 * Determine if name is a debtor (has receivables functionality)
 */
export function isCanonicalDebtor(customerType: MoneyWorksCustomerType): boolean {
  return customerType === MoneyWorksCustomerType.DEBTOR;
}

/**
 * Determine if name is a creditor (has payables functionality)  
 */
export function isCanonicalCreditor(supplierType: MoneyWorksSupplierType): boolean {
  return supplierType === MoneyWorksSupplierType.CREDITOR;
}

/**
 * Get canonical account relationships for name
 */
export function getCanonicalAccountRelationships(customerType: MoneyWorksCustomerType, supplierType: MoneyWorksSupplierType): {
  needsReceivablesAccount: boolean;
  needsPayablesAccount: boolean;
  explanation: string;
} {
  const needsReceivables = isCanonicalDebtor(customerType);
  const needsPayables = isCanonicalCreditor(supplierType);
  
  let explanation = "MoneyWorks account relationships: ";
  if (needsReceivables) explanation += "Requires RecAccount (Accounts Receivable control account for debtor). ";
  if (needsPayables) explanation += "Requires PayAccount (Accounts Payable control account for creditor). ";
  if (!needsReceivables && !needsPayables) explanation += "No control account requirements.";
  
  return {
    needsReceivablesAccount: needsReceivables,
    needsPayablesAccount: needsPayables,
    explanation
  };
}

export default {
  MONEYWORKS_CUSTOMER_TYPE_DEFINITIONS,
  MONEYWORKS_SUPPLIER_TYPE_DEFINITIONS,
  MONEYWORKS_NAME_FIELDS,
  MONEYWORKS_NAME_CANONICAL_TERMS
};