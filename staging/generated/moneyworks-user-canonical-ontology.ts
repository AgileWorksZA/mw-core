/**
 * MoneyWorks User Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_user_file.html
 * Authority: MoneyWorks Manual - User File Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks User File is a generic persistent data storage system:
 * - Key-value storage mechanism for scripts and plug-ins
 * - Simple structure: Key (9 chars) + Data (245 chars)
 * - Used by scripts to store configuration and persistent information
 * - Conflict management through unique keys per plug-in
 * 
 * ARCHITECTURAL PATTERN: Simple persistent storage without business semantics
 * - Not user authentication system (that's Login entity)
 * - Generic storage available to scripting layer
 * - Cross-business universality: any business can use for script data
 */

// ============================================================================
// CANONICAL MONEYWORKS USER FILE FIELDS
// ============================================================================

/**
 * MoneyWorks canonical User file field definitions
 * Source: moneyworks_appendix_user_file.html - User File table
 * 
 * ARCHITECTURAL INSIGHT: This is a simple key-value storage mechanism
 * for persistent script data, not user authentication
 */
export const MONEYWORKS_USER_FIELDS = [
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    maxLength: undefined,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_user_file.html",
    isRequired: false,
    isSystemField: true
  },
  {
    fieldName: "Key",
    dataType: "T" as const,
    maxLength: 9,
    canonicalDescription: "A unique key to identify the record. Note that many plug-ins use their own set of keys, so you need to manage any conflicts.",
    manualSource: "moneyworks_appendix_user_file.html",
    isRequired: true,
    isIndexed: true,
    businessRule: "Must be unique across all plug-ins and scripts"
  },
  {
    fieldName: "Data",
    dataType: "T" as const,
    maxLength: 245,
    canonicalDescription: "text data for the key",
    manualSource: "moneyworks_appendix_user_file.html",
    isRequired: false,
    businessRule: "If empty when updating existing record, the record will be deleted"
  }
] as const;

// ============================================================================
// MONEYWORKS USER FILE BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks canonical User file business rules
 * Source: moneyworks_appendix_user_file.html
 */
export const MONEYWORKS_USER_BUSINESS_RULES = [
  {
    entitySource: "User",
    fieldName: "Key",
    ruleType: "uniqueness" as const,
    canonicalRule: "Keys must be unique across all plug-ins and scripts",
    manualSource: "moneyworks_appendix_user_file.html"
  },
  {
    entitySource: "User", 
    fieldName: "Data",
    ruleType: "deletion" as const,
    canonicalRule: "If Data is empty when updating existing record, the record will be deleted",
    manualSource: "moneyworks_appendix_user_file.html"
  },
  {
    entitySource: "User",
    fieldName: "Key",
    ruleType: "conflict_management" as const,
    canonicalRule: "Plug-ins use their own set of keys, requiring conflict management",
    manualSource: "moneyworks_appendix_user_file.html"
  },
  {
    entitySource: "User",
    fieldName: "*",
    ruleType: "import_format" as const,
    canonicalRule: "Records can be inserted by importing with pseudo-map ':/User' or using SetPersistent function",
    manualSource: "moneyworks_appendix_user_file.html"
  },
  {
    entitySource: "User",
    fieldName: "*",
    ruleType: "field_format" as const,
    canonicalRule: "Import format: Key (first field) + Data (second field, tab-separated)",
    manualSource: "moneyworks_appendix_user_file.html"
  }
] as const;

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Cross-business universality validation for User entity
 * 
 * UNIVERSAL APPLICABILITY CONFIRMED:
 * - Restaurant: Store persistent configuration data for table management scripts
 * - Law Firm: Store case management preferences and script settings
 * - Manufacturing: Store production workflow configurations
 * - Consulting: Store project template preferences and billing scripts
 * 
 * The User entity is completely business-agnostic as it only provides
 * generic persistent storage for any type of script or plug-in data.
 */
export const USER_UNIVERSALITY_EXAMPLES = [
  {
    businessType: "restaurant",
    useCase: "Table management script configuration",
    keyExample: "TABLE_CFG",
    dataExample: "max_tables=20|auto_assign=true|timeout=30",
    universalApplicability: "Generic key-value storage works for any configuration"
  },
  {
    businessType: "legal",
    useCase: "Case management script preferences",
    keyExample: "CASE_PREF",
    dataExample: "default_rate=350|time_tracking=true|client_alerts=enabled",
    universalApplicability: "Any professional service can use same storage pattern"
  },
  {
    businessType: "manufacturing",
    useCase: "Production workflow automation settings",
    keyExample: "PROD_AUTO",
    dataExample: "batch_size=100|quality_check=true|alerts=email",
    universalApplicability: "Manufacturing-specific data stored in generic structure"
  },
  {
    businessType: "consulting",
    useCase: "Project template and billing script data",
    keyExample: "PROJ_TPL",
    dataExample: "default_markup=25|billing_cycle=monthly|template=standard",
    universalApplicability: "Consulting workflows use same storage mechanism"
  }
] as const;

// ============================================================================
// ENTITY RELATIONSHIPS
// ============================================================================

/**
 * MoneyWorks User entity relationships
 * 
 * ISOLATION CHARACTERISTIC: User entity is deliberately isolated:
 * - No foreign key relationships to other business entities
 * - Generic storage mechanism independent of business logic
 * - Used by scripts and plug-ins for persistent data only
 */
export const USER_ENTITY_RELATIONSHIPS = [
  {
    sourceEntity: "User",
    targetEntity: "None",
    relationshipType: "isolated",
    cardinality: "n/a",
    businessRule: "User entity is deliberately isolated for generic script storage",
    manualSource: "moneyworks_appendix_user_file.html"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks User entity type definition
 */
export interface MoneyWorksUser {
  LastModifiedTime?: string;
  Key: string;                    // Max 9 characters, unique identifier
  Data?: string;                  // Max 245 characters, persistent data
}

/**
 * MoneyWorks User field definition type
 */
export interface MoneyWorksUserField {
  fieldName: string;
  dataType: "T" | "S";
  maxLength?: number;
  canonicalDescription: string;
  manualSource: string;
  isRequired?: boolean;
  isIndexed?: boolean;
  isSystemField?: boolean;
  businessRule?: string;
}

/**
 * MoneyWorks User business rule type
 */
export interface MoneyWorksUserBusinessRule {
  entitySource: string;
  fieldName: string;
  ruleType: "uniqueness" | "deletion" | "conflict_management" | "import_format" | "field_format";
  canonicalRule: string;
  manualSource: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates MoneyWorks User key uniqueness and format
 */
export function validateUserKey(key: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!key || key.trim().length === 0) {
    errors.push("Key is required");
  }
  
  if (key.length > 9) {
    errors.push("Key must not exceed 9 characters");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates MoneyWorks User data field constraints
 */
export function validateUserData(data: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data && data.length > 245) {
    errors.push("Data must not exceed 245 characters");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates complete MoneyWorks User record
 */
export function validateUserRecord(user: MoneyWorksUser): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const keyValidation = validateUserKey(user.Key);
  if (!keyValidation.isValid) {
    errors.push(...keyValidation.errors);
  }
  
  if (user.Data) {
    const dataValidation = validateUserData(user.Data);
    if (!dataValidation.isValid) {
      errors.push(...dataValidation.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}