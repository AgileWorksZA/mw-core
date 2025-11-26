/**
 * MoneyWorks Reconciliation Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_reconciliation_file.html
 * Authority: MoneyWorks Manual - Reconciliation File Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks reconciliation system for bank statement matching:
 * - Stores reconciliation session metadata (dates, balances, discrepancies)
 * - Links to Account entity for which account was reconciled
 * - Tracks statement sequence numbers for audit trail
 * - Records opening/closing balances and any discrepancies found
 * - System tracking entity, not transaction data storage
 */

// ============================================================================
// CANONICAL MONEYWORKS RECONCILIATION FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks reconciliation fields as defined in manual
 * Source: moneyworks_appendix_reconciliation_file.html - Reconciliation File table
 * Internal file name: _recon
 */
export const MONEYWORKS_RECONCILIATION_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique bank reconciliation identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "Account",
    dataType: "T" as const,
    maxLength: 8,
    canonicalDescription: "The account code that was reconciled.",
    manualSource: "moneyworks_appendix_reconciliation_file.html",
    isRequired: true,
    isIndexed: true,
    relationshipTarget: "Accounts",
    relationshipRule: "Must reference valid Account code for reconciliation"
  },
  {
    fieldName: "Closing",
    dataType: "N" as const,
    canonicalDescription: "The closing balance",
    manualSource: "moneyworks_appendix_reconciliation_file.html",
    isRequired: true
  },
  {
    fieldName: "Date",
    dataType: "D" as const,
    canonicalDescription: "Statement Date",
    manualSource: "moneyworks_appendix_reconciliation_file.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Discrepancy",
    dataType: "N" as const,
    canonicalDescription: "Discrepancy in reconciliation",
    manualSource: "moneyworks_appendix_reconciliation_file.html",
    businessRule: "Tracks unresolved differences between statement and MoneyWorks balance"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_reconciliation_file.html",
    businessRule: "System-maintained audit field"
  },
  {
    fieldName: "Opening",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The opening balance.",
    manualSource: "moneyworks_appendix_reconciliation_file.html",
    isRequired: true
  },
  {
    fieldName: "Statement",
    dataType: "N" as const,
    canonicalDescription: "Statement number",
    manualSource: "moneyworks_appendix_reconciliation_file.html",
    isRequired: true,
    isIndexed: true,
    businessRule: "Sequential statement number used for audit trail and reference"
  },
  {
    fieldName: "ReconciledTime",
    dataType: "S" as const,
    canonicalDescription: "Date and time of reconciliation",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    businessRule: "Records when reconciliation session was performed"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS RECONCILIATION ENTITY METADATA
// ============================================================================

/**
 * MoneyWorks reconciliation entity comprehensive metadata
 */
export const MONEYWORKS_RECONCILIATION_ENTITY = {
  entityName: "Reconciliation",
  internalFileName: "_recon",
  manualSource: "moneyworks_appendix_reconciliation_file.html",
  totalFields: 8,
  
  // Entity Classification
  entityType: "system_tracking" as const,
  businessPurpose: "Bank reconciliation session metadata storage",
  
  // Canonical Insights
  canonicalInsights: [
    "System tracking entity for bank reconciliation sessions",
    "Stores reconciliation metadata, not transaction details",
    "Links to Accounts entity for reconciled account identification", 
    "Sequential statement numbering for audit trail",
    "Tracks discrepancies for unresolved reconciliation issues",
    "Multiple date/time fields for comprehensive audit tracking"
  ],
  
  // Entity Relationships
  entityRelationships: [
    {
      sourceField: "Account",
      targetEntity: "Accounts", 
      targetField: "Code",
      relationshipType: "required" as const,
      cardinality: "many-to-one" as const,
      businessRule: "Each reconciliation session must reference valid Account code"
    }
  ],
  
  // Cross-Business Universality Validation
  universalityValidation: {
    restaurantScenario: "Bank account reconciliation for cash deposits and supplier payments",
    legalScenario: "Trust account reconciliation for client funds management", 
    manufacturingScenario: "Operating account reconciliation for supplier payments and customer receipts",
    consultingScenario: "Business account reconciliation for project billing and expense payments",
    universalityConfirmed: true,
    universalityReasoning: "Bank reconciliation is universal requirement across all business types for financial control"
  }
} as const;

/**
 * Complete field count for validation
 */
export const RECONCILIATION_FIELD_COUNT = MONEYWORKS_RECONCILIATION_FIELDS.length;

/**
 * Field name collection for programmatic access
 */
export const RECONCILIATION_FIELD_NAMES = MONEYWORKS_RECONCILIATION_FIELDS.map(f => f.fieldName) as const;

/**
 * Required fields collection
 */
export const RECONCILIATION_REQUIRED_FIELDS = MONEYWORKS_RECONCILIATION_FIELDS
  .filter(f => f.isRequired)
  .map(f => f.fieldName) as const;

/**
 * Indexed fields collection  
 */
export const RECONCILIATION_INDEXED_FIELDS = MONEYWORKS_RECONCILIATION_FIELDS
  .filter(f => f.isIndexed)
  .map(f => f.fieldName) as const;

/**
 * Relationship fields collection
 */
export const RECONCILIATION_RELATIONSHIP_FIELDS = MONEYWORKS_RECONCILIATION_FIELDS
  .filter(f => f.relationshipTarget)
  .map(f => ({
    field: f.fieldName,
    target: f.relationshipTarget,
    rule: f.relationshipRule
  })) as const;