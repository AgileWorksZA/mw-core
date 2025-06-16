/**
 * MoneyWorks Names Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_names.html
 * Authority: MoneyWorks Manual - Names Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks has hierarchical name classification:
 * - Customer vs Debtor (different types, Debtor is specific type of Customer)
 * - Supplier vs Creditor (different types, Creditor is specific type of Supplier)
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