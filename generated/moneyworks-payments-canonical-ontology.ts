/**
 * MoneyWorks Payments Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_payments_file.html
 * Authority: MoneyWorks Manual - Payments Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks Payments is a JUNCTION/LINKING TABLE:
 * - This is NOT a primary business entity like Names, Products, or Jobs
 * - It's a many-to-many relationship table connecting invoices to payment transactions
 * - Enables complex payment scenarios: partial payments, multiple payments per invoice, 
 *   overpayments, payment allocations across multiple invoices
 * - Essential for payment reconciliation and audit trail tracking
 * 
 * ARCHITECTURAL ROLE:
 * - Links Transaction entities (payments/receipts) to Transaction entities (invoices)
 * - Supports sophisticated payment allocation scenarios
 * - Enables payment history and audit trail functionality
 * - Handles debtor overpayments with special encoding (negative InvoiceID + offset)
 * 
 * KEY RELATIONSHIPS:
 * - CashTrans → Transaction.Seq (payment/receipt transaction)
 * - InvoiceID → Transaction.Seq (invoice transaction) OR Names.Seq (for overpayments)
 * - Enables relational queries for payment/invoice analysis
 */

// ============================================================================
// CANONICAL MONEYWORKS PAYMENTS FIELDS
// ============================================================================

/**
 * MoneyWorks canonical Payments field definitions
 * Source: moneyworks_appendix_payments_file.html - Field table
 */
export const MONEYWORKS_PAYMENTS_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique payment allocation identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_payments_file.html",
    isSystem: true
  },
  {
    fieldName: "CashTrans",
    dataType: "N" as const,
    canonicalDescription: "The sequencenumber of the payment/receipt",
    manualSource: "moneyworks_appendix_payments_file.html",
    isRequired: true,
    isIndexed: true,
    relationshipTarget: "Transaction",
    relationshipRule: "Must reference valid payment/receipt Transaction.Seq"
  },
  {
    fieldName: "InvoiceID", 
    dataType: "N" as const,
    canonicalDescription: "The sequence number of the invoice that is being paid. For a debtor overpayment (where no invoice is available) this stores the sequencenumber of the namecode, with the high bit set, making it negative (add 2147483648 to it to get the namecode sequencenumber).",
    manualSource: "moneyworks_appendix_payments_file.html",
    isRequired: true,
    isIndexed: true,
    relationshipTarget: "Transaction OR Names",
    relationshipRule: "Positive: Transaction.Seq (invoice), Negative: Names.Seq + 2147483648 (overpayment)"
  },
  {
    fieldName: "Amount",
    dataType: "N" as const,
    canonicalDescription: "The amount of the receipt that was allocated to the invoice",
    manualSource: "moneyworks_appendix_payments_file.html",
    isRequired: true
  },
  {
    fieldName: "GSTCycle",
    dataType: "N" as const,
    canonicalDescription: "The tax cycle when the receipt was processed for GST/VAT/Tax by the GST Report. This will be negative if processed on an invoice/accruals basis.",
    manualSource: "moneyworks_appendix_payments_file.html"
  },
  {
    fieldName: "Date",
    dataType: "D" as const,
    canonicalDescription: "The receipt date",
    manualSource: "moneyworks_appendix_payments_file.html",
    isRequired: true
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS PAYMENTS BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks canonical Payments business rules
 * Source: moneyworks_appendix_payments_file.html - Business logic descriptions
 */
export const MONEYWORKS_PAYMENTS_BUSINESS_RULES = [
  {
    ruleName: "PAYMENT_INVOICE_LINKING",
    ruleType: "relationship" as const,
    entitySource: "Payments",
    fieldName: "CashTrans,InvoiceID",
    canonicalRule: "Payments table creates many-to-many relationship between payment transactions and invoices",
    manualSource: "moneyworks_appendix_payments_file.html"
  },
  {
    ruleName: "OVERPAYMENT_ENCODING",
    ruleType: "constraint" as const,
    entitySource: "Payments", 
    fieldName: "InvoiceID",
    canonicalRule: "For debtor overpayments where no invoice exists, InvoiceID stores Names.Seq with high bit set (negative value = Names.Seq + 2147483648)",
    manualSource: "moneyworks_appendix_payments_file.html"
  },
  {
    ruleName: "ALLOCATION_TRACKING",
    ruleType: "validation" as const,
    entitySource: "Payments",
    fieldName: "Amount",
    canonicalRule: "Amount represents portion of payment allocated to specific invoice, enabling partial and multiple payment scenarios",
    manualSource: "moneyworks_appendix_payments_file.html"
  },
  {
    ruleName: "TAX_CYCLE_TRACKING", 
    ruleType: "validation" as const,
    entitySource: "Payments",
    fieldName: "GSTCycle",
    canonicalRule: "GSTCycle tracks when payment was processed for tax reporting. Negative values indicate invoice/accruals basis processing",
    manualSource: "moneyworks_appendix_payments_file.html"
  },
  {
    ruleName: "RELATIONAL_SEARCH_CAPABILITY",
    ruleType: "validation" as const,
    entitySource: "Payments",
    fieldName: "CashTrans,InvoiceID", 
    canonicalRule: "Payments table enables relational searches to find all payments for an invoice or all invoices for a payment",
    manualSource: "moneyworks_appendix_payments_file.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS PAYMENTS ENTITY RELATIONSHIPS  
// ============================================================================

/**
 * MoneyWorks canonical Payments entity relationships
 * Source: moneyworks_appendix_payments_file.html - Field descriptions and business logic
 */
export const MONEYWORKS_PAYMENTS_RELATIONSHIPS = [
  {
    sourceEntity: "Payments",
    sourceField: "CashTrans", 
    targetEntity: "Transaction",
    targetField: "Seq",
    relationshipType: "many-to-one" as const,
    cardinality: "required" as const,
    businessRule: "Each payment record must reference a valid payment/receipt transaction",
    manualSource: "moneyworks_appendix_payments_file.html"
  },
  {
    sourceEntity: "Payments",
    sourceField: "InvoiceID",
    targetEntity: "Transaction",
    targetField: "Seq", 
    relationshipType: "many-to-one" as const,
    cardinality: "conditional" as const,
    businessRule: "When positive, InvoiceID references invoice Transaction.Seq",
    manualSource: "moneyworks_appendix_payments_file.html"
  },
  {
    sourceEntity: "Payments",
    sourceField: "InvoiceID",
    targetEntity: "Names",
    targetField: "Seq",
    relationshipType: "many-to-one" as const, 
    cardinality: "conditional" as const,
    businessRule: "When negative, InvoiceID references Names.Seq (overpayment scenario) = Names.Seq + 2147483648",
    manualSource: "moneyworks_appendix_payments_file.html"
  }
] as const;

// ============================================================================
// MONEYWORKS PAYMENTS CANONICAL VALIDATION
// ============================================================================

/**
 * MoneyWorks canonical Payments validation rules
 */
export const MONEYWORKS_PAYMENTS_VALIDATION = {
  validatePaymentRecord: (payment: any) => {
    const errors: string[] = [];
    
    // Required field validation
    if (!payment.CashTrans) {
      errors.push("CashTrans is required - must reference payment/receipt transaction");
    }
    
    if (!payment.InvoiceID) {
      errors.push("InvoiceID is required - must reference invoice or indicate overpayment");
    }
    
    if (payment.Amount === undefined || payment.Amount === null) {
      errors.push("Amount is required - must specify allocated payment amount");
    }
    
    if (!payment.Date) {
      errors.push("Date is required - must specify receipt date");
    }
    
    // Business rule validation
    if (payment.InvoiceID < 0) {
      // Overpayment scenario validation
      const nameSeq = payment.InvoiceID + 2147483648;
      if (nameSeq <= 0) {
        errors.push("Invalid overpayment InvoiceID - cannot decode Names.Seq");
      }
    }
    
    if (payment.GSTCycle < 0) {
      // Negative GST cycle indicates invoice/accruals basis - valid scenario
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
} as const;

export default {
  MONEYWORKS_PAYMENTS_FIELDS,
  MONEYWORKS_PAYMENTS_BUSINESS_RULES,
  MONEYWORKS_PAYMENTS_RELATIONSHIPS,
  MONEYWORKS_PAYMENTS_VALIDATION
};