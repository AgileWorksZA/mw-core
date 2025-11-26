/**
 * MoneyWorks Log Entity - Canonical Ontology
 *
 * Empirical field extraction from MoneyWorks Now v9.2.3
 * Source: Full schema export 2025-11-25
 * Authority: Empirical API validation
 *
 * ENTITY PURPOSE: System audit log for tracking user actions
 * - Records significant system events and user activities
 * - Supports compliance and audit trail requirements
 * - Enables troubleshooting and activity monitoring
 *
 * ARCHITECTURAL NOTE: Append-only audit trail
 * - Immutable record of system actions
 * - Links to user via initials (Who field)
 * - Flexible info fields for action-specific data
 */

// ============================================================================
// CANONICAL MONEYWORKS LOG FIELD DATA TYPES
// ============================================================================

/**
 * MoneyWorks canonical Log file field definitions
 * Source: Empirical schema extraction from MoneyWorks Now v9.2.3
 *
 * ARCHITECTURAL INSIGHT: System audit and activity tracking entity
 */
export const MONEYWORKS_LOG_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique log entry identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this record was last changed",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    isSystem: true
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Description of the logged action or event",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Human-readable description of what action was performed"
  },
  {
    fieldName: "Who",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "User initials of who performed the action",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "References Login.Initials for user attribution"
  },
  {
    fieldName: "Info1",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Additional information field 1",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Action-specific data (e.g., account code, record ID)"
  },
  {
    fieldName: "Info2",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Additional information field 2",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Action-specific data (e.g., transaction number, secondary reference)"
  },
  {
    fieldName: "Info3",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Additional information field 3",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Action-specific data for additional context"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks Log entity type definition
 */
export interface MoneyWorksLog {
  SequenceNumber: number;           // Primary key (required)
  LastModifiedTime?: string;        // System modification timestamp
  Description?: string;             // Max 255 characters, action description
  Who?: string;                     // Max 3 characters, user initials
  Info1?: string;                   // Max 255 characters, additional info
  Info2?: string;                   // Max 255 characters, additional info
  Info3?: string;                   // Max 255 characters, additional info
}

/**
 * MoneyWorks Log field definition type
 */
export interface MoneyWorksLogField {
  fieldName: string;
  dataType: "T" | "N" | "S";
  maxLength?: number;
  canonicalDescription: string;
  manualSource: string;
  isRequired?: boolean;
  isSystem?: boolean;
  isIndexed?: boolean;
  businessRule?: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates MoneyWorks Log record
 */
export function validateLogRecord(log: MoneyWorksLog): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (log.Description && log.Description.length > 255) {
    errors.push("Description must not exceed 255 characters");
  }

  if (log.Who && log.Who.length > 3) {
    errors.push("Who must not exceed 3 characters");
  }

  if (log.Info1 && log.Info1.length > 255) {
    errors.push("Info1 must not exceed 255 characters");
  }

  if (log.Info2 && log.Info2.length > 255) {
    errors.push("Info2 must not exceed 255 characters");
  }

  if (log.Info3 && log.Info3.length > 255) {
    errors.push("Info3 must not exceed 255 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets field by name
 */
export function getLogField(fieldName: string): MoneyWorksLogField | undefined {
  return MONEYWORKS_LOG_FIELDS.find(f => f.fieldName === fieldName);
}

/**
 * Gets all system fields
 */
export function getSystemLogFields(): MoneyWorksLogField[] {
  return MONEYWORKS_LOG_FIELDS.filter(f => f.isSystem === true);
}
