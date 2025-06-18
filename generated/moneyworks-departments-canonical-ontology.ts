/**
 * MoneyWorks Departments Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_departments.html
 * Authority: MoneyWorks Manual - Departments Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks departments are organizational classification units
 * used for tracking and reporting across all business entities. They enable
 * departmental cost allocation, budgeting, and performance analysis.
 * Internal Name: "Department"
 * 
 * ENTITY DEPENDENCIES AND CROSS-REFERENCES:
 * 
 * TODO: Revisit after General entity is processed
 * - Classification field references General table (Department Classifications with "D" prefix)
 * - This creates a dependency: Departments -> General (Department Classifications)
 * - Integration needed: Classification field validation against General.Code where Code startsWith("D")
 */

// ============================================================================
// CANONICAL MONEYWORKS DEPARTMENT FIELD DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical department data type definitions
 * Source: moneyworks_appendix_departments.html - Field specifications
 */
export type MoneyWorksDepartmentDataType = 
  | "T"  // Text
  | "N"  // Number  
  | "S"; // System timestamp

/**
 * Core MoneyWorks department fields as defined in manual
 * Source: moneyworks_appendix_departments.html - Departments table
 */
export const MONEYWORKS_DEPARTMENT_FIELDS = [
  {
    fieldName: "Classification",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The classification code for the department. References General table Department Classifications (prefix: D).",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: false,
    isIndexed: false,
    // TODO: Add relationship validation after General entity extraction
    entityReference: {
      referencesEntity: "General",
      referencesType: "DepartmentClassification", 
      referenceConstraint: "Must match General.Code where Code startsWith('D')",
      relationshipType: "optional_lookup"
    }
  },
  {
    fieldName: "Code",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The department code.",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Custom1",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: false,
    isIndexed: false
  },
  {
    fieldName: "Custom2",
    dataType: "T" as const,
    maxLength: 9,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: false,
    isIndexed: false
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 35,
    canonicalDescription: "The department name.",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: true,
    isIndexed: false
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    maxLength: undefined,
    canonicalDescription: "The date that this department was last changed. This means a change to the department record itself, not a change to any account balance associated with the department.",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: false,
    isIndexed: false
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "Scriptable number",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: false,
    isIndexed: false
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: false,
    isIndexed: false
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_departments.html",
    isRequired: false,
    isIndexed: false
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS DEPARTMENT FIELD COLLECTIONS
// ============================================================================

/**
 * Required department fields for entity validation
 */
export const MONEYWORKS_DEPARTMENT_REQUIRED_FIELDS = MONEYWORKS_DEPARTMENT_FIELDS
  .filter(field => field.isRequired)
  .map(field => field.fieldName);

/**
 * Indexed department fields for query optimization
 */
export const MONEYWORKS_DEPARTMENT_INDEXED_FIELDS = MONEYWORKS_DEPARTMENT_FIELDS
  .filter(field => field.isIndexed)
  .map(field => field.fieldName);

/**
 * User-customizable department fields
 */
export const MONEYWORKS_DEPARTMENT_CUSTOM_FIELDS = MONEYWORKS_DEPARTMENT_FIELDS
  .filter(field => field.fieldName.startsWith("Custom") || field.fieldName.startsWith("User"))
  .map(field => field.fieldName);

/**
 * System-managed department fields
 */
export const MONEYWORKS_DEPARTMENT_SYSTEM_FIELDS = MONEYWORKS_DEPARTMENT_FIELDS
  .filter(field => field.dataType === "S")
  .map(field => field.fieldName);

// ============================================================================
// CANONICAL MONEYWORKS DEPARTMENT ENTITY DEFINITION
// ============================================================================

/**
 * Complete MoneyWorks department entity definition
 * Represents organizational classification units for business tracking and reporting
 */
export interface MoneyWorksDepartmentEntity {
  /** Department classification code (max 5 chars) */
  Classification?: string;
  
  /** Department code - primary identifier (max 5 chars) */
  Code: string;
  
  /** Custom field 1 for user-defined purposes (max 15 chars) */
  Custom1?: string;
  
  /** Custom field 2 for user-defined purposes (max 9 chars) */
  Custom2?: string;
  
  /** Department name/description (max 35 chars) */
  Description: string;
  
  /** System timestamp of last modification */
  LastModifiedTime?: Date;
  
  /** User-scriptable numeric field */
  UserNum?: number;
  
  /** User-scriptable text field (max 255 chars) */
  UserText?: string;
  
  /** Scriptable tag storage field (max 255 chars) */
  TaggedText?: string;
}

// ============================================================================
// DEPARTMENT ENTITY RELATIONSHIPS AND INTEGRATION
// ============================================================================

/**
 * MoneyWorks department entity relationships
 * Departments are referenced by:
 * - Accounts (for departmental P&L tracking)
 * - Transactions (for departmental cost allocation)
 * - Jobs (for project departmental analysis)
 * - Names (for contact departmental assignment)
 * 
 * Departments reference:
 * - General (Department Classifications via Classification field)
 */
export const MONEYWORKS_DEPARTMENT_RELATIONSHIPS = {
  referencedBy: [
    "Accounts",
    "Transactions", 
    "Jobs",
    "Names"
  ],
  references: [
    {
      entity: "General",
      field: "Classification",
      targetType: "DepartmentClassification",
      constraint: "Code startsWith('D')",
      relationship: "optional_lookup"
    }
  ]
} as const;

/**
 * MoneyWorks department business validation rules
 * Based on canonical manual specifications
 */
export const MONEYWORKS_DEPARTMENT_VALIDATION_RULES = {
  codeUniqueness: "Department codes must be unique across all departments",
  codeRequired: "Department code is mandatory and cannot be empty",
  descriptionRequired: "Department description/name is mandatory",
  maxCodeLength: "Department code cannot exceed 5 characters",
  maxDescriptionLength: "Department description cannot exceed 35 characters",
  classificationOptional: "Classification code is optional but limited to 5 characters",
  customFieldsOptional: "All custom and user fields are optional",
  systemFieldsReadOnly: "LastModifiedTime is system-managed and read-only"
} as const;

// ============================================================================
// DEPARTMENT BUSINESS DOMAIN MAPPINGS
// ============================================================================

/**
 * Universal department concept mappings across business domains
 * Validates cross-business applicability of MoneyWorks departments
 */
export const MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS = {
  restaurant: [
    "Kitchen", "Front of House", "Bar", "Management", "Maintenance"
  ],
  legal: [
    "Litigation", "Corporate", "Family Law", "Real Estate", "Administration"
  ],
  construction: [
    "Residential", "Commercial", "Renovations", "Project Management", "Administration"
  ],
  consulting: [
    "Strategy", "Technology", "Operations", "Human Resources", "Business Development"
  ],
  manufacturing: [
    "Production", "Quality Control", "Warehouse", "R&D", "Sales"
  ],
  retail: [
    "Sales Floor", "Inventory", "Customer Service", "Marketing", "Administration"
  ]
} as const;

/**
 * Department export interface for external integrations
 */
export type MoneyWorksDepartmentExport = {
  entityType: "Department";
  fields: typeof MONEYWORKS_DEPARTMENT_FIELDS;
  requiredFields: typeof MONEYWORKS_DEPARTMENT_REQUIRED_FIELDS;
  indexedFields: typeof MONEYWORKS_DEPARTMENT_INDEXED_FIELDS;
  customFields: typeof MONEYWORKS_DEPARTMENT_CUSTOM_FIELDS;
  systemFields: typeof MONEYWORKS_DEPARTMENT_SYSTEM_FIELDS;
  relationships: typeof MONEYWORKS_DEPARTMENT_RELATIONSHIPS;
  validationRules: typeof MONEYWORKS_DEPARTMENT_VALIDATION_RULES;
  businessMappings: typeof MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS;
};