/**
 * MoneyWorks Lists Entity - Canonical Ontology
 *
 * Empirical field extraction from MoneyWorks Now v9.2.3
 * Source: Full schema export 2025-11-25
 * Authority: Empirical API validation
 *
 * ENTITY PURPOSE: Validation lists and dropdown options
 * - Stores custom validation list items for data entry
 * - Provides dropdown/picklist values for form fields
 * - Supports standardized data entry and consistency
 *
 * ARCHITECTURAL NOTE: Flexible metadata system
 * - ListID groups related items together
 * - Each item can have display value and comment
 * - Scriptable fields for custom extensions
 */

// ============================================================================
// CANONICAL MONEYWORKS LISTS FIELD DATA TYPES
// ============================================================================

/**
 * MoneyWorks canonical Lists file field definitions
 * Source: Empirical schema extraction from MoneyWorks Now v9.2.3
 *
 * ARCHITECTURAL INSIGHT: Validation list and picklist management
 */
export const MONEYWORKS_LISTS_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique list item identifier",
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
    fieldName: "ListID",
    dataType: "T" as const,
    maxLength: 63,
    canonicalDescription: "List identifier grouping related items",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Identifies which validation list this item belongs to"
  },
  {
    fieldName: "Item",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "List item value",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "The actual value available for selection in dropdown"
  },
  {
    fieldName: "Comment",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Descriptive comment for list item",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Additional information or description for the item"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "Scriptable numeric field",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Custom numeric data for scripting extensions"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text field",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Custom text data for scripting extensions"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tagged text storage",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Custom data storage for scripting extensions"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks Lists entity type definition
 */
export interface MoneyWorksLists {
  SequenceNumber: number;           // Primary key (required)
  LastModifiedTime?: string;        // System modification timestamp
  ListID?: string;                  // Max 63 characters, list identifier
  Item?: string;                    // Max 255 characters, list item value
  Comment?: string;                 // Max 255 characters, item description
  UserNum?: number;                 // Scriptable numeric field
  UserText?: string;                // Max 255 characters, scriptable text
  TaggedText?: string;              // Max 255 characters, tagged text
}

/**
 * MoneyWorks Lists field definition type
 */
export interface MoneyWorksListsField {
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
 * Validates MoneyWorks Lists record
 */
export function validateListsRecord(list: MoneyWorksLists): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (list.ListID && list.ListID.length > 63) {
    errors.push("ListID must not exceed 63 characters");
  }

  if (list.Item && list.Item.length > 255) {
    errors.push("Item must not exceed 255 characters");
  }

  if (list.Comment && list.Comment.length > 255) {
    errors.push("Comment must not exceed 255 characters");
  }

  if (list.UserText && list.UserText.length > 255) {
    errors.push("UserText must not exceed 255 characters");
  }

  if (list.TaggedText && list.TaggedText.length > 255) {
    errors.push("TaggedText must not exceed 255 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets field by name
 */
export function getListsField(fieldName: string): MoneyWorksListsField | undefined {
  return MONEYWORKS_LISTS_FIELDS.find(f => f.fieldName === fieldName);
}

/**
 * Gets all scriptable extension fields
 */
export function getScriptableFields(): MoneyWorksListsField[] {
  return MONEYWORKS_LISTS_FIELDS.filter(f => ["UserNum", "UserText", "TaggedText"].includes(f.fieldName));
}
