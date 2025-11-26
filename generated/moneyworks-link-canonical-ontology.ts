/**
 * MoneyWorks Link Entity - Canonical Ontology
 *
 * Empirical field extraction from MoneyWorks Now v9.2.3
 * Source: Full schema export 2025-11-25
 * Authority: Empirical API validation
 *
 * ENTITY PURPOSE: Department-to-Group linking table
 * - Maps departments to account groups for organizational reporting
 * - Supports multi-dimensional analysis and consolidation
 * - System configuration entity for chart of accounts structure
 *
 * ARCHITECTURAL NOTE: This is a pure linking table with minimal fields
 * - No business logic beyond the relationship mapping
 * - Part of the system configuration infrastructure
 */

// ============================================================================
// CANONICAL MONEYWORKS LINK FIELD DATA TYPES
// ============================================================================

/**
 * MoneyWorks canonical Link file field definitions
 * Source: Empirical schema extraction from MoneyWorks Now v9.2.3
 *
 * ARCHITECTURAL INSIGHT: Minimal entity for department-group relationships
 */
export const MONEYWORKS_LINK_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique link record identifier",
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
    fieldName: "Dept",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Department code reference",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    businessRule: "References Department.Code for organizational structure"
  },
  {
    fieldName: "Group",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Account group code reference",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    businessRule: "References account group for reporting consolidation"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks Link entity type definition
 */
export interface MoneyWorksLink {
  SequenceNumber: number;           // Primary key (required)
  LastModifiedTime?: string;        // System modification timestamp
  Dept: string;                     // Department code (required)
  Group: string;                    // Account group code (required)
}

/**
 * MoneyWorks Link field definition type
 */
export interface MoneyWorksLinkField {
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
 * Validates MoneyWorks Link record
 */
export function validateLinkRecord(link: MoneyWorksLink): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!link.Dept || link.Dept.trim().length === 0) {
    errors.push("Dept is required");
  }

  if (!link.Group || link.Group.trim().length === 0) {
    errors.push("Group is required");
  }

  if (link.Dept && link.Dept.length > 15) {
    errors.push("Dept must not exceed 15 characters");
  }

  if (link.Group && link.Group.length > 15) {
    errors.push("Group must not exceed 15 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets field by name
 */
export function getLinkField(fieldName: string): MoneyWorksLinkField | undefined {
  return MONEYWORKS_LINK_FIELDS.find(f => f.fieldName === fieldName);
}

/**
 * Gets all required fields
 */
export function getRequiredLinkFields(): MoneyWorksLinkField[] {
  return MONEYWORKS_LINK_FIELDS.filter(f => f.isRequired === true);
}
