/**
 * MoneyWorks Filter Entity - Canonical Ontology
 *
 * Empirical field extraction from MoneyWorks Now v9.2.3
 * Source: Full schema export 2025-11-25
 * Authority: Empirical API validation
 *
 * COVERAGE: 12 fields
 *
 * ENTITY PURPOSE: User-defined filters for list view customization
 * - Stores saved filter expressions for data views
 * - Supports per-user and per-file filter preferences
 * - Enables custom tab-based filtering in UI
 *
 * ARCHITECTURAL NOTE: UI configuration and personalization
 * - Filter expressions stored as MoneyWorks formula syntax
 * - Multi-level organization (File > TabSet > Tab)
 * - User-specific or shared filter configurations
 */

// ============================================================================
// CANONICAL MONEYWORKS FILTER FIELD DATA TYPES
// ============================================================================

/**
 * MoneyWorks canonical Filter file field definitions
 * Source: Empirical schema extraction from MoneyWorks Now v9.2.3
 *
 * ARCHITECTURAL INSIGHT: User interface customization and saved views
 */
export const MONEYWORKS_FILTER_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique filter identifier",
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
    fieldName: "File",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "Target file/table name for filter",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "MoneyWorks table name (e.g., Transaction, Name, Product)"
  },
  {
    fieldName: "TabSet",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "Tab set grouping for filter organization",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Groups related tabs together in UI"
  },
  {
    fieldName: "Tab",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "Tab name within tab set",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Individual tab identifier for filter display"
  },
  {
    fieldName: "Type",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Filter type classification",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Type of filter (user, system, shared)"
  },
  {
    fieldName: "User",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "Owner user for user-specific filters",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Empty for shared filters, user name for personal filters"
  },
  {
    fieldName: "Name",
    dataType: "T" as const,
    maxLength: 63,
    canonicalDescription: "Display name of the filter",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Human-readable filter name shown in UI"
  },
  {
    fieldName: "FilterFunction",
    dataType: "T" as const,
    maxLength: 1024,
    canonicalDescription: "Filter expression in MoneyWorks formula syntax",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Boolean expression evaluated for each record (e.g., 'Status = \"OP\"')"
  },
  {
    fieldName: "Order",
    dataType: "N" as const,
    canonicalDescription: "Display order within tab set",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Sort order for filter tabs (lower numbers first)"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks Filter entity type definition
 */
export interface MoneyWorksFilter {
  SequenceNumber: number;           // Primary key (required)
  LastModifiedTime?: string;        // System modification timestamp
  File?: string;                    // Max 31 characters, target table name
  TabSet?: string;                  // Max 31 characters, tab set grouping
  Tab?: string;                     // Max 31 characters, tab name
  Type?: string;                    // Max 15 characters, filter type
  User?: string;                    // Max 31 characters, owner user
  Name?: string;                    // Max 63 characters, display name
  FilterFunction?: string;          // Max 1024 characters, filter expression
  Order?: number;                   // Display order
}

/**
 * MoneyWorks Filter field definition type
 */
export interface MoneyWorksFilterField {
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
 * Validates MoneyWorks Filter record
 */
export function validateFilterRecord(filter: MoneyWorksFilter): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (filter.File && filter.File.length > 31) {
    errors.push("File must not exceed 31 characters");
  }

  if (filter.TabSet && filter.TabSet.length > 31) {
    errors.push("TabSet must not exceed 31 characters");
  }

  if (filter.Tab && filter.Tab.length > 31) {
    errors.push("Tab must not exceed 31 characters");
  }

  if (filter.Type && filter.Type.length > 15) {
    errors.push("Type must not exceed 15 characters");
  }

  if (filter.User && filter.User.length > 31) {
    errors.push("User must not exceed 31 characters");
  }

  if (filter.Name && filter.Name.length > 63) {
    errors.push("Name must not exceed 63 characters");
  }

  if (filter.FilterFunction && filter.FilterFunction.length > 1024) {
    errors.push("FilterFunction must not exceed 1024 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets field by name
 */
export function getFilterField(fieldName: string): MoneyWorksFilterField | undefined {
  return MONEYWORKS_FILTER_FIELDS.find(f => f.fieldName === fieldName);
}

/**
 * Checks if filter is user-specific
 */
export function isUserFilter(filter: MoneyWorksFilter): boolean {
  return !!filter.User && filter.User.trim().length > 0;
}

/**
 * Checks if filter is shared/system
 */
export function isSharedFilter(filter: MoneyWorksFilter): boolean {
  return !filter.User || filter.User.trim().length === 0;
}
