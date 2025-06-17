/**
 * MoneyWorks Canonical Ontology - Pure DSL Foundation
 * 
 * This file contains ONLY canonical MoneyWorks terminology and concepts
 * as defined in the official MoneyWorks Manual. No business interpretation
 * or domain-specific terminology is included.
 * 
 * Source: MoneyWorks Manual - Appendix Field Descriptions
 * Authority: /Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/
 * Validation: Each concept verified against manual source
 */

// ============================================================================
// CANONICAL MONEYWORKS TRANSACTION TYPES
// ============================================================================

/** 
 * MoneyWorks canonical transaction type codes as defined in the manual
 * Source: moneyworks_appendix_transactions.html - "The transaction type codes are:"
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
 * MoneyWorks canonical transaction type definitions with manual explanations
 * Source: moneyworks_appendix_transactions.html
 */
export interface MoneyWorksTransactionTypeDefinition {
  code: MoneyWorksTransactionType;
  canonicalName: string;
  moneyWorksDescription: string;
  manualSource: string;
}

export const MONEYWORKS_TRANSACTION_TYPE_DEFINITIONS: MoneyWorksTransactionTypeDefinition[] = [
  {
    code: MoneyWorksTransactionType.CREDITOR_INVOICE_COMPLETE,
    canonicalName: "Creditor Invoice Complete",
    moneyWorksDescription: "Creditor invoice--fully paid",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.CREDITOR_INVOICE_INCOMPLETE,
    canonicalName: "Creditor Invoice Incomplete", 
    moneyWorksDescription: "Creditor invoice--incomplete",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.CASH_PAYMENT,
    canonicalName: "Cash Payment",
    moneyWorksDescription: "Cash payment/purchase",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.CASH_PAYMENT_CREDITOR,
    canonicalName: "Cash Payment for Creditor Invoice",
    moneyWorksDescription: "Cash payment for a creditor invoice",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.CASH_PAYMENT_DEBTOR_REFUND,
    canonicalName: "Returned Refund to Debtor",
    moneyWorksDescription: "Returned refund to debtor",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.CASH_RECEIPT,
    canonicalName: "Cash Receipt",
    moneyWorksDescription: "Cash receipt/sale",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.CASH_RECEIPT_CREDITOR_REFUND,
    canonicalName: "Receive Refund from Creditor",
    moneyWorksDescription: "Receive refund from creditor", 
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.CASH_RECEIPT_DEBTOR,
    canonicalName: "Receipt for Debtor Invoice",
    moneyWorksDescription: "Receipt for a debtor invoice",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.DEBTOR_INVOICE_COMPLETE,
    canonicalName: "Debtor Invoice Complete",
    moneyWorksDescription: "Debtor invoice--fully paid",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE,
    canonicalName: "Debtor Invoice Incomplete", 
    moneyWorksDescription: "Debtor invoice--incomplete",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.GENERAL_JOURNAL,
    canonicalName: "General Journal",
    moneyWorksDescription: "General journal",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.STOCK_JOURNAL,
    canonicalName: "Stock Journal",
    moneyWorksDescription: "Stock journal",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.PURCHASE_ORDER_COMPLETE,
    canonicalName: "Purchase Order Complete",
    moneyWorksDescription: "Purchase order (complete) = Bought",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.PURCHASE_ORDER_INCOMPLETE,
    canonicalName: "Purchase Order Incomplete",
    moneyWorksDescription: "Purchase order (incomplete)",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.QUOTE,
    canonicalName: "Quote",
    moneyWorksDescription: "Quote",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.SALES_ORDER_COMPLETE,
    canonicalName: "Sales Order Complete",
    moneyWorksDescription: "Sales order (complete) = Sold",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    code: MoneyWorksTransactionType.SALES_ORDER_INCOMPLETE,
    canonicalName: "Sales Order Incomplete",
    moneyWorksDescription: "Sales order (incomplete)",
    manualSource: "moneyworks_appendix_transactions.html"
  }
];

// ============================================================================
// CANONICAL MONEYWORKS ACCOUNT TYPES
// ============================================================================

/**
 * MoneyWorks canonical account type codes as defined in the manual
 * Source: moneyworks_appendix_accounts.html - "The account type. This will be one of..."
 */
export enum MoneyWorksAccountType {
  /** Income */
  INCOME = "IN",
  
  /** Sales */  
  SALES = "SA",
  
  /** Expense */
  EXPENSE = "EX",
  
  /** Cost of Sales */
  COST_OF_SALES = "CS",
  
  /** Current Asset */
  CURRENT_ASSET = "CA",
  
  /** Current Liability */
  CURRENT_LIABILITY = "CL",
  
  /** Fixed Asset */
  FIXED_ASSET = "FA",
  
  /** Term Asset */
  TERM_ASSET = "TA",
  
  /** Term Liability */
  TERM_LIABILITY = "TL",
  
  /** Shareholder's Funds */
  SHAREHOLDERS_FUNDS = "SF"
}

/**
 * MoneyWorks canonical system account types
 * Source: moneyworks_appendix_accounts.html - "The 'system' account type"
 */
export enum MoneyWorksSystemAccountType {
  /** Bank Account */
  BANK_ACCOUNT = "BK",
  
  /** Profit & Loss */
  PROFIT_LOSS = "PL", 
  
  /** Accounts Receivable */
  ACCOUNTS_RECEIVABLE = "AR",
  
  /** Accounts Payable */
  ACCOUNTS_PAYABLE = "AP",
  
  /** GST Received */
  GST_RECEIVED = "GR",
  
  /** GST Paid */
  GST_PAID = "GP",
  
  /** Ordinary account (not a system type) */
  ORDINARY = "  "
}

/**
 * MoneyWorks canonical account type definitions with manual explanations
 * Source: moneyworks_appendix_accounts.html
 */
export interface MoneyWorksAccountTypeDefinition {
  code: MoneyWorksAccountType;
  canonicalName: string;
  moneyWorksDescription: string;
  manualSource: string;
}

export const MONEYWORKS_ACCOUNT_TYPE_DEFINITIONS: MoneyWorksAccountTypeDefinition[] = [
  {
    code: MoneyWorksAccountType.INCOME,
    canonicalName: "Income",
    moneyWorksDescription: "Income",
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.SALES,
    canonicalName: "Sales", 
    moneyWorksDescription: "Sales",
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.EXPENSE,
    canonicalName: "Expense",
    moneyWorksDescription: "Expense",
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.COST_OF_SALES,
    canonicalName: "Cost of Sales",
    moneyWorksDescription: "Cost of Sales",
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.CURRENT_ASSET,
    canonicalName: "Current Asset",
    moneyWorksDescription: "Current Asset", 
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.CURRENT_LIABILITY,
    canonicalName: "Current Liability",
    moneyWorksDescription: "Current Liability",
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.FIXED_ASSET,
    canonicalName: "Fixed Asset",
    moneyWorksDescription: "Fixed Asset",
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.TERM_ASSET,
    canonicalName: "Term Asset",
    moneyWorksDescription: "Term Asset",
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.TERM_LIABILITY,
    canonicalName: "Term Liability",
    moneyWorksDescription: "Term Liability",
    manualSource: "moneyworks_appendix_accounts.html"
  },
  {
    code: MoneyWorksAccountType.SHAREHOLDERS_FUNDS,
    canonicalName: "Shareholder's Funds",
    moneyWorksDescription: "Shareholder's Funds",
    manualSource: "moneyworks_appendix_accounts.html"
  }
];

// ============================================================================
// CANONICAL MONEYWORKS FIELD DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical field definition from manual
 * Source: moneyworks_appendix_transactions.html and moneyworks_appendix_accounts.html
 */
export interface MoneyWorksFieldDefinition {
  fieldName: string;
  dataType: "T" | "N" | "D" | "A";  // Text, Number, Date, Alphanumeric
  maxLength?: number;
  canonicalDescription: string;
  manualSource: string;
  isRequired?: boolean;
  isIndexed?: boolean;
}

/** 
 * Core MoneyWorks transaction fields as defined in manual
 * Source: moneyworks_appendix_transactions.html
 */
export const MONEYWORKS_TRANSACTION_FIELDS: MoneyWorksFieldDefinition[] = [
  {
    fieldName: "Type",
    dataType: "T",
    maxLength: 3,
    canonicalDescription: "The transaction type.--see following table.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Status",
    dataType: "A", 
    maxLength: 1,
    canonicalDescription: "The transaction status. U=unposted, P=posted.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true
  },
  {
    fieldName: "NameCode",
    dataType: "A",
    maxLength: 12,
    canonicalDescription: "Customer or Supplier Code.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "TransDate",
    dataType: "D",
    canonicalDescription: "The transaction date.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true
  },
  {
    fieldName: "EnterDate",
    dataType: "D",
    canonicalDescription: "The date on which the transaction was entered.",
    manualSource: "moneyworks_appendix_transactions.html",
    isRequired: true
  },
  {
    fieldName: "OurRef",
    dataType: "A",
    maxLength: 12,
    canonicalDescription: "The reference number of the transaction.",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    fieldName: "TheirRef",
    dataType: "A", 
    maxLength: 32,
    canonicalDescription: "For debtor invoices, customer's Order No. For creditor invoices, supplier's invoice number.",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    fieldName: "Description",
    dataType: "T",
    maxLength: 1024,
    canonicalDescription: "The description of the transaction.",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    fieldName: "Gross",
    dataType: "N",
    canonicalDescription: "The gross value of the transaction",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    fieldName: "Hold",
    dataType: "N",
    canonicalDescription: "True if the transaction is on hold",
    manualSource: "moneyworks_appendix_transactions.html"
  }
];

/**
 * Core MoneyWorks account fields as defined in manual
 * Source: moneyworks_appendix_accounts.html
 */
export const MONEYWORKS_ACCOUNT_FIELDS: MoneyWorksFieldDefinition[] = [
  {
    fieldName: "Code",
    dataType: "A",
    maxLength: 8,
    canonicalDescription: "The unique code used to identify the account (up to 7 characters, plus potentially a hyphen and department code).",
    manualSource: "moneyworks_appendix_accounts.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Type",
    dataType: "A",
    maxLength: 2,
    canonicalDescription: "The account type. This will be one of IN, SA, EX, CS, CA, CL, FA, TA, TL or SF for Income, Sales, Expense, Cost of Sales, Current Asset, Current Liability, Fixed Asset, Term Asset, Term Liability or Shareholder's Funds respectively.",
    manualSource: "moneyworks_appendix_accounts.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "System",
    dataType: "A",
    maxLength: 2,
    canonicalDescription: "The 'system' account type. The account types Bank Account, Profit & Loss, Accounts Receivable, Accounts Payable, GST Received and GST Paid are special system account types. Accounts of these types contain the codes: 'BK', 'PL', 'AR', 'AP', 'GR', or 'GP' (respectively) in the System field. Ordinary account types have '  ' (2 spaces) in the System field.",
    manualSource: "moneyworks_appendix_accounts.html",
    isIndexed: true
  },
  {
    fieldName: "Description",
    dataType: "T",
    maxLength: 64,
    canonicalDescription: "The descriptive name of the account, often displayed in reports.",
    manualSource: "moneyworks_appendix_accounts.html",
    isRequired: true
  },
  {
    fieldName: "Category",
    dataType: "A",
    maxLength: 8,
    canonicalDescription: "The primary category code for the account, used for grouping accounts for reporting and enquiry. May be empty. References the General table (Kind='C').",
    manualSource: "moneyworks_appendix_accounts.html",
    isIndexed: true
  }
];

// ============================================================================
// MONEYWORKS CANONICAL TERMINOLOGY GLOSSARY
// ============================================================================

/**
 * MoneyWorks canonical terminology as used throughout the manual
 * This ensures we use MoneyWorks terms consistently
 */
export const MONEYWORKS_CANONICAL_TERMS = {
  // Parties (MoneyWorks canonical terms)
  CREDITOR: "Creditor",           // Not "Supplier" - MoneyWorks canonical term
  DEBTOR: "Debtor",               // Not "Customer" - MoneyWorks canonical term
  
  // Transaction states (MoneyWorks canonical terms)
  UNPOSTED: "Unposted",           // Status = "U"
  POSTED: "Posted",               // Status = "P"
  INCOMPLETE: "Incomplete",       // Unfinished transaction
  COMPLETE: "Complete",           // Fully processed transaction
  
  // Account classifications (MoneyWorks canonical terms)
  SYSTEM_ACCOUNT: "System Account",
  ORDINARY_ACCOUNT: "Ordinary Account",
  
  // Financial concepts (MoneyWorks canonical terms)
  CHART_OF_ACCOUNTS: "Chart of Accounts",
  GENERAL_LEDGER: "General Ledger",
  
  // Special MoneyWorks terminology
  ON_HOLD: "On Hold",             // Transaction hold status
  CASH_TRANSACTION: "Cash Transaction",
  INVOICE_TRANSACTION: "Invoice Transaction",
  JOURNAL_TRANSACTION: "Journal Transaction",
  ORDER_TRANSACTION: "Order Transaction"
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate that a concept uses canonical MoneyWorks terminology
 */
export function validateCanonicalTerminology(concept: string, context: string): {
  isCanonical: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check for non-canonical terms
  if (concept.toLowerCase().includes("supplier")) {
    issues.push("Uses 'Supplier' instead of MoneyWorks canonical term 'Creditor'");
    suggestions.push("Replace 'Supplier' with 'Creditor' to match MoneyWorks terminology");
  }
  
  if (concept.toLowerCase().includes("customer")) {
    issues.push("Uses 'Customer' instead of MoneyWorks canonical term 'Debtor'");
    suggestions.push("Replace 'Customer' with 'Debtor' to match MoneyWorks terminology");
  }
  
  if (concept.toLowerCase().includes("vendor")) {
    issues.push("Uses 'Vendor' instead of MoneyWorks canonical term 'Creditor'");
    suggestions.push("Replace 'Vendor' with 'Creditor' to match MoneyWorks terminology");
  }
  
  return {
    isCanonical: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Get canonical MoneyWorks definition for a transaction type
 */
export function getCanonicalTransactionTypeDefinition(
  code: string
): MoneyWorksTransactionTypeDefinition | null {
  return MONEYWORKS_TRANSACTION_TYPE_DEFINITIONS.find(def => def.code === code) || null;
}

/**
 * Get canonical MoneyWorks definition for an account type
 */
export function getCanonicalAccountTypeDefinition(
  code: string
): MoneyWorksAccountTypeDefinition | null {
  return MONEYWORKS_ACCOUNT_TYPE_DEFINITIONS.find(def => def.code === code) || null;
}

/**
 * Verify that a field definition matches MoneyWorks canonical specification
 */
export function validateFieldDefinition(
  fieldName: string,
  definition: any
): { isValid: boolean; errors: string[] } {
  const canonicalField = [...MONEYWORKS_TRANSACTION_FIELDS, ...MONEYWORKS_ACCOUNT_FIELDS]
    .find(field => field.fieldName === fieldName);
    
  if (!canonicalField) {
    return { isValid: false, errors: [`Field '${fieldName}' not found in MoneyWorks canonical specification`] };
  }
  
  const errors: string[] = [];
  
  if (definition.maxLength && canonicalField.maxLength && definition.maxLength > canonicalField.maxLength) {
    errors.push(`Field '${fieldName}' max length ${definition.maxLength} exceeds MoneyWorks canonical max ${canonicalField.maxLength}`);
  }
  
  return { isValid: errors.length === 0, errors };
}

// ============================================================================
// NAMES ENTITY INTEGRATION
// ============================================================================

// Import Names canonical definitions including dual-layer contact architecture
export {
  MoneyWorksCustomerType,
  MoneyWorksSupplierType,
  MoneyWorksNameKind,
  MONEYWORKS_CUSTOMER_TYPE_DEFINITIONS,
  MONEYWORKS_SUPPLIER_TYPE_DEFINITIONS,
  MONEYWORKS_NAME_FIELDS,
  MONEYWORKS_NAME_CANONICAL_TERMS,
  MONEYWORKS_DUAL_CONTACT_BUSINESS_RULES,
  MONEYWORKS_DUAL_CONTACT_USAGE_PATTERNS,
  MONEYWORKS_CONTACT_FIELD_CAPACITY_MATRIX
} from "./moneyworks-names-canonical-ontology";

// ============================================================================
// PRODUCTS ENTITY INTEGRATION
// ============================================================================

// Import Products canonical definitions
export {
  MoneyWorksProductType,
  MoneyWorksProductStatus,
  MoneyWorksSellDiscountMode,
  MoneyWorksJobPricingMode,
  MoneyWorksProductFlags,
  MONEYWORKS_PRODUCT_TYPE_DEFINITIONS,
  MONEYWORKS_PRODUCT_FIELDS,
  MONEYWORKS_PRODUCT_CANONICAL_TERMS
} from "./moneyworks-products-canonical-ontology";

// ============================================================================
// TAXRATES ENTITY INTEGRATION
// ============================================================================

// Import TaxRates canonical definitions
export {
  MoneyWorksTaxCombineMode,
  MONEYWORKS_TAX_RATE_FIELDS,
  MONEYWORKS_TAX_RATE_CANONICAL_TERMS
} from "./moneyworks-taxrates-canonical-ontology";

// ============================================================================
// JOBS ENTITY INTEGRATION
// ============================================================================

// Import Jobs canonical definitions
export {
  MoneyWorksJobStatus,
  MoneyWorksJobColour,
  MONEYWORKS_JOB_STATUS_DEFINITIONS,
  MONEYWORKS_JOB_FIELDS,
  MONEYWORKS_JOB_CANONICAL_TERMS
} from "./moneyworks-jobs-canonical-ontology";

// ============================================================================
// DEPARTMENTS ENTITY INTEGRATION
// ============================================================================

// Import Departments canonical definitions
export {
  MONEYWORKS_DEPARTMENT_FIELDS,
  MONEYWORKS_DEPARTMENT_REQUIRED_FIELDS,
  MONEYWORKS_DEPARTMENT_INDEXED_FIELDS,
  MONEYWORKS_DEPARTMENT_CUSTOM_FIELDS,
  MONEYWORKS_DEPARTMENT_SYSTEM_FIELDS,
  MONEYWORKS_DEPARTMENT_RELATIONSHIPS,
  MONEYWORKS_DEPARTMENT_VALIDATION_RULES,
  MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS,
  MoneyWorksDepartmentEntity,
  MoneyWorksDepartmentDataType
} from "./moneyworks-departments-canonical-ontology";

// ============================================================================
// GENERAL CLASSIFICATIONS ENTITY INTEGRATION
// ============================================================================

// Import General Classifications canonical definitions (Account Categories, Department Classifications, Department Groups)
export {
  MoneyWorksGeneralPrefix,
  MoneyWorksGeneralClassificationType,
  MoneyWorksAccountCategoryDefinition,
  MoneyWorksDepartmentClassificationDefinition,
  MoneyWorksDepartmentGroupDefinition,
  MONEYWORKS_GENERAL_FIELDS,
  MONEYWORKS_GENERAL_CANONICAL_TERMS,
  MONEYWORKS_ACCOUNT_CATEGORY_RULES,
  MONEYWORKS_DEPARTMENT_CLASSIFICATION_RULES,
  MONEYWORKS_DEPARTMENT_GROUP_RULES,
  validateGeneralPrefix,
  getCanonicalClassificationExplanation,
  parseGeneralCode,
  createGeneralCode,
  validateGeneralUniversality
} from "./moneyworks-general-classifications-canonical-ontology";

// ============================================================================
// ASSETS ENTITY INTEGRATION
// ============================================================================

// Import Assets canonical definitions
export {
  MoneyWorksAssetStatus,
  MoneyWorksDepreciationType,
  MONEYWORKS_ASSET_FIELDS,
  MONEYWORKS_ASSET_CANONICAL_TERMS,
  validateAssetStatus,
  validateDepreciationType,
  calculateCanonicalBookValue,
  requiresDepreciation,
  getCanonicalAssetLifecycle,
  validateAssetRelationships
} from "./moneyworks-assets-canonical-ontology";

// ============================================================================
// ASSETLOG ENTITY INTEGRATION
// ============================================================================

// Import AssetLog canonical definitions
export {
  MoneyWorksAssetLogAction,
  MONEYWORKS_ASSETLOG_FIELDS,
  MONEYWORKS_ASSETLOG_CANONICAL_TERMS,
  validateAssetLogAction,
  isDepreciationAction,
  affectsQuantity,
  requiresTransaction,
  getCanonicalActionExplanation,
  validateAssetLogRelationships,
  calculateActionImpact
} from "./moneyworks-assetlog-canonical-ontology";

// ============================================================================
// CONTACTS ENTITY INTEGRATION
// ============================================================================

// Import Contacts canonical definitions
export {
  MONEYWORKS_CONTACTS_FIELDS,
  MONEYWORKS_CONTACTS_BUSINESS_RULES,
  MONEYWORKS_CONTACTS_RELATIONSHIPS,
  MONEYWORKS_CONTACTS_CANONICAL_SUMMARY,
  CONTACTS_FIELDS,
  CONTACTS_BUSINESS_RULES,
  CONTACTS_RELATIONSHIPS,
  CONTACTS_CANONICAL_SUMMARY
} from "./moneyworks-contacts-canonical-ontology";

// ============================================================================
// INVENTORY ENTITY INTEGRATION
// ============================================================================

// Import Inventory canonical definitions
export {
  MoneyWorksInventoryRelationshipType,
  MoneyWorksInventoryTrackingMode,
  MoneyWorksStockTakeState,
  MONEYWORKS_INVENTORY_FIELDS,
  MONEYWORKS_INVENTORY_FUNCTIONS,
  MONEYWORKS_INVENTORY_CANONICAL_TERMS,
  validateInventoryLocationCanonical,
  validateInventoryIdentifierCanonical,
  validateStockTakeQuantitiesCanonical,
  validateProductSequenceRelationship,
  generateInventoryRecordKey,
  parseInventoryRecordKey,
  calculateStockVariance,
  supportsExpiryTracking
} from "./moneyworks-inventory-canonical-ontology";

// ============================================================================
// PAYMENTS ENTITY INTEGRATION
// ============================================================================

// Import Payments canonical definitions
export {
  MONEYWORKS_PAYMENTS_FIELDS,
  MONEYWORKS_PAYMENTS_BUSINESS_RULES,
  MONEYWORKS_PAYMENTS_RELATIONSHIPS,
  MONEYWORKS_PAYMENTS_VALIDATION
} from "./moneyworks-payments-canonical-ontology";

export default {
  MONEYWORKS_TRANSACTION_TYPE_DEFINITIONS,
  MONEYWORKS_ACCOUNT_TYPE_DEFINITIONS,
  MONEYWORKS_TRANSACTION_FIELDS,
  MONEYWORKS_ACCOUNT_FIELDS,
  MONEYWORKS_CANONICAL_TERMS
};