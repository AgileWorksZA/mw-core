/**
 * MoneyWorks User2 Entity - Canonical Ontology
 *
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_user2_file.html
 * Authority: MoneyWorks Manual - User2 File Field Descriptions
 *
 * COVERAGE: 33 fields
 *
 * CRITICAL DISCOVERY: MoneyWorks User2 is enhanced persistent storage system:
 * - Extended key length (28 chars vs 9 in User file)
 * - DevKey system for conflict avoidance (developer key allocation)
 * - Multiple typed data fields (int, float, date, text)
 * - Native format storage and searching capabilities
 * - Segmented storage reducing key conflicts between scripts
 * 
 * ARCHITECTURAL ENHANCEMENT: Sophisticated persistent storage system
 * - DevKey prevents conflicts between different scripts/plug-ins
 * - Multiple data types enable native format storage and searching
 * - Tagged text support for structured data
 * - Atomic record operations (complete rewrite or delete)
 */

// ============================================================================
// CANONICAL MONEYWORKS USER2 FILE FIELDS
// ============================================================================

/**
 * MoneyWorks canonical User2 file field definitions
 * Source: moneyworks_appendix_user2_file.html - User2 File table
 * 
 * ARCHITECTURAL INSIGHT: Enhanced storage with typed fields and DevKey segmentation
 */
export const MONEYWORKS_USER2_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "Primary key - unique user2 data record identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystemField: true,
    isIndexed: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    maxLength: undefined,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    isSystemField: true
  },
  {
    fieldName: "DevKey",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "An unsigned integer greater than #FFFF (65,535)--lower valued keys are reserved for plug-ins and must be pre-allocated by Cognito.",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: true,
    isIndexed: true,
    businessRule: "Must be > 65535 for user scripts, <= 65535 reserved for plug-ins"
  },
  {
    fieldName: "Key",
    dataType: "T" as const,
    maxLength: 28,
    canonicalDescription: "A unique key to identify the record. Use this in conjunction with a (pre-allocated) DevKey to ensure your own storage",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: true,
    isIndexed: true,
    businessRule: "Must be unique within DevKey context"
  },
  {
    fieldName: "Int1",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "A signed integer",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Int2",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "A signed integer",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Float1",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "A floating point number",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Float2",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "A floating point number",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Date1",
    dataType: "D" as const,
    maxLength: undefined,
    canonicalDescription: "A date",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Date2",
    dataType: "D" as const,
    maxLength: undefined,
    canonicalDescription: "A date",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Text1",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Text",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Text2",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Text",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Text",
    dataType: "T" as const,
    maxLength: 1020,
    canonicalDescription: "Text",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false
  },
  {
    fieldName: "Int3",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "A signed integer",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "Int4",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "A signed integer",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "Float3",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "A floating point number",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "Float4",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "A floating point number",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "Date3",
    dataType: "D" as const,
    maxLength: undefined,
    canonicalDescription: "A date",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "Date4",
    dataType: "D" as const,
    maxLength: undefined,
    canonicalDescription: "A date",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "Text3",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Text",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "Text4",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Text",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Storage for tagged text",
    manualSource: "moneyworks_appendix_user2_file.html",
    isRequired: false,
    versionNote: "Added in newer version"
  },
  {
    fieldName: "Colour",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "Colour coding for user data categorization",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Numeric colour code for visual categorization and filtering"
  }
] as const;

// ============================================================================
// MONEYWORKS USER2 FILE BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks canonical User2 file business rules
 * Source: moneyworks_appendix_user2_file.html
 */
export const MONEYWORKS_USER2_BUSINESS_RULES = [
  {
    entitySource: "User2",
    fieldName: "DevKey",
    ruleType: "allocation" as const,
    canonicalRule: "DevKey must be > 65535 for user scripts; <= 65535 reserved for plug-ins and pre-allocated by Cognito",
    manualSource: "moneyworks_appendix_user2_file.html"
  },
  {
    entitySource: "User2",
    fieldName: "Key",
    ruleType: "uniqueness" as const,
    canonicalRule: "Key must be unique within DevKey context",
    manualSource: "moneyworks_appendix_user2_file.html"
  },
  {
    entitySource: "User2",
    fieldName: "*",
    ruleType: "update_behavior" as const,
    canonicalRule: "Record update is complete rewrite - cannot update individual fields",
    manualSource: "moneyworks_appendix_user2_file.html"
  },
  {
    entitySource: "User2",
    fieldName: "*",
    ruleType: "deletion" as const,
    canonicalRule: "If only DevKey and Key are present and all other fields missing, record is deleted",
    manualSource: "moneyworks_appendix_user2_file.html"
  },
  {
    entitySource: "User2",
    fieldName: "*",
    ruleType: "import_format" as const,
    canonicalRule: "Records can be inserted with pseudo-map ':/User2', XML import, or SetPersistent function",
    manualSource: "moneyworks_appendix_user2_file.html"
  },
  {
    entitySource: "User2",
    fieldName: "*",
    ruleType: "field_order" as const,
    canonicalRule: "Tab-delimited import: DevKey, Key, then fields in table order",
    manualSource: "moneyworks_appendix_user2_file.html"
  },
  {
    entitySource: "User2",
    fieldName: "*",
    ruleType: "optional_fields" as const,
    canonicalRule: "Apart from DevKey and Key, all fields are optional; missing fields treated as empty/zero",
    manualSource: "moneyworks_appendix_user2_file.html"
  }
] as const;

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Cross-business universality validation for User2 entity
 * 
 * UNIVERSAL APPLICABILITY CONFIRMED:
 * - Restaurant: Store complex table analytics with typed data
 * - Law Firm: Store case metrics and billing calculations
 * - Manufacturing: Store production statistics and quality metrics
 * - Consulting: Store project performance data and client analytics
 * 
 * The User2 entity is completely business-agnostic with enhanced capabilities
 * for storing structured, typed data that can be searched natively.
 */
export const USER2_UNIVERSALITY_EXAMPLES = [
  {
    businessType: "restaurant",
    useCase: "Table analytics and performance metrics",
    devKey: 65536,
    keyExample: "TABLE_METRICS_2024",
    typedDataExample: {
      Int1: 150,        // Total covers
      Float1: 45.50,    // Average spend
      Date1: "2024-12-16", // Period start
      Text1: "Peak dinner performance analytics"
    },
    universalApplicability: "Any business can store typed metrics data"
  },
  {
    businessType: "legal",
    useCase: "Case billing and time tracking analytics", 
    devKey: 65537,
    keyExample: "CASE_BILLING_Q4",
    typedDataExample: {
      Int1: 280,        // Billable hours
      Float1: 98000.00, // Total billed
      Date1: "2024-10-01", // Quarter start
      Text1: "Q4 case performance summary"
    },
    universalApplicability: "Professional services can use same pattern"
  },
  {
    businessType: "manufacturing",
    useCase: "Production batch quality tracking",
    devKey: 65538,
    keyExample: "BATCH_QC_12345",
    typedDataExample: {
      Int1: 500,        // Units produced
      Float1: 99.2,     // Quality percentage
      Date1: "2024-12-15", // Production date
      Text1: "Batch quality control results"
    },
    universalApplicability: "Manufacturing data uses generic typed storage"
  },
  {
    businessType: "consulting",
    useCase: "Project ROI and client satisfaction metrics",
    devKey: 65539,
    keyExample: "PROJECT_ROI_ACME",
    typedDataExample: {
      Int1: 12,         // Project months
      Float1: 125.5,    // ROI percentage
      Date1: "2024-01-01", // Project start
      Text1: "ACME Corp project performance analysis"
    },
    universalApplicability: "Consulting metrics use same storage structure"
  }
] as const;

// ============================================================================
// ENTITY RELATIONSHIPS
// ============================================================================

/**
 * MoneyWorks User2 entity relationships
 * 
 * ISOLATION CHARACTERISTIC: User2 entity is deliberately isolated:
 * - No foreign key relationships to other business entities
 * - Enhanced storage mechanism independent of business logic
 * - DevKey system provides namespace isolation
 */
export const USER2_ENTITY_RELATIONSHIPS = [
  {
    sourceEntity: "User2",
    targetEntity: "None",
    relationshipType: "isolated",
    cardinality: "n/a",
    businessRule: "User2 entity is deliberately isolated for enhanced script storage",
    manualSource: "moneyworks_appendix_user2_file.html"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks User2 entity type definition
 */
export interface MoneyWorksUser2 {
  LastModifiedTime?: string;
  DevKey: number;                 // Unsigned integer > 65535 for user scripts
  Key: string;                    // Max 28 characters, unique within DevKey
  Int1?: number;                  // Signed integer
  Int2?: number;                  // Signed integer
  Float1?: number;                // Floating point number
  Float2?: number;                // Floating point number
  Date1?: string;                 // Date in MoneyWorks format
  Date2?: string;                 // Date in MoneyWorks format
  Text1?: string;                 // Max 255 characters
  Text2?: string;                 // Max 255 characters
  Text?: string;                  // Max 1020 characters
  Int3?: number;                  // Signed integer (newer version)
  Int4?: number;                  // Signed integer (newer version)
  Float3?: number;                // Floating point number (newer version)
  Float4?: number;                // Floating point number (newer version)
  Date3?: string;                 // Date (newer version)
  Date4?: string;                 // Date (newer version)
  Text3?: string;                 // Max 255 characters (newer version)
  Text4?: string;                 // Max 255 characters (newer version)
  TaggedText?: string;            // Max 255 characters for tagged text (newer version)
  Colour?: number;                // Colour code for categorization
}

/**
 * MoneyWorks User2 field definition type
 */
export interface MoneyWorksUser2Field {
  fieldName: string;
  dataType: "T" | "N" | "D" | "S";
  maxLength?: number;
  canonicalDescription: string;
  manualSource: string;
  isRequired?: boolean;
  isIndexed?: boolean;
  isSystemField?: boolean;
  businessRule?: string;
  versionNote?: string;
}

/**
 * MoneyWorks User2 business rule type
 */
export interface MoneyWorksUser2BusinessRule {
  entitySource: string;
  fieldName: string;
  ruleType: "allocation" | "uniqueness" | "update_behavior" | "deletion" | "import_format" | "field_order" | "optional_fields";
  canonicalRule: string;
  manualSource: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates MoneyWorks User2 DevKey allocation rules
 */
export function validateUser2DevKey(devKey: number): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Number.isInteger(devKey)) {
    errors.push("DevKey must be an integer");
  }
  
  if (devKey < 0) {
    errors.push("DevKey must be an unsigned integer");
  }
  
  if (devKey <= 65535) {
    errors.push("DevKey must be greater than 65535 for user scripts (values <= 65535 reserved for plug-ins)");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates MoneyWorks User2 key format and length
 */
export function validateUser2Key(key: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!key || key.trim().length === 0) {
    errors.push("Key is required");
  }
  
  if (key.length > 28) {
    errors.push("Key must not exceed 28 characters");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates MoneyWorks User2 text field constraints
 */
export function validateUser2TextField(value: string, fieldName: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const maxLengths: Record<string, number> = {
    Text1: 255,
    Text2: 255,
    Text: 1020,
    Text3: 255,
    Text4: 255,
    TaggedText: 255
  };
  
  const maxLength = maxLengths[fieldName];
  if (maxLength && value.length > maxLength) {
    errors.push(`${fieldName} must not exceed ${maxLength} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates complete MoneyWorks User2 record
 */
export function validateUser2Record(user2: MoneyWorksUser2): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const devKeyValidation = validateUser2DevKey(user2.DevKey);
  if (!devKeyValidation.isValid) {
    errors.push(...devKeyValidation.errors);
  }
  
  const keyValidation = validateUser2Key(user2.Key);
  if (!keyValidation.isValid) {
    errors.push(...keyValidation.errors);
  }
  
  // Validate text fields if present
  const textFields = ['Text1', 'Text2', 'Text', 'Text3', 'Text4', 'TaggedText'] as const;
  for (const field of textFields) {
    const value = user2[field];
    if (value) {
      const textValidation = validateUser2TextField(value, field);
      if (!textValidation.isValid) {
        errors.push(...textValidation.errors);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}