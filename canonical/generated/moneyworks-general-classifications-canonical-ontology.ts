/**
 * MoneyWorks General Classifications Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_account_categories__department_classifications_and_groups.html
 * Authority: MoneyWorks Manual - General File (Account Categories, Department Classifications and Groups)
 * 
 * CRITICAL DISCOVERY: MoneyWorks uses ONE file (Internal Name: "General") to store THREE logical entities:
 * - Account Categories (prefix: C) - Grouping mechanism for accounts
 * - Department Classifications (prefix: D) - Grouping mechanism for departments  
 * - Department Groups (prefix: S) - Collections of departments for account association
 * 
 * The prefix system allows efficient storage while maintaining logical separation.
 */

// ============================================================================
// CANONICAL MONEYWORKS GENERAL CLASSIFICATION TYPES
// ============================================================================

/**
 * MoneyWorks canonical prefix types for General file
 * Source: moneyworks_appendix_account_categories__department_classifications_and_groups.html
 */
export enum MoneyWorksGeneralPrefix {
  /** Account Category */
  ACCOUNT_CATEGORY = "C",
  
  /** Department Classification */
  DEPARTMENT_CLASSIFICATION = "D",
  
  /** Department Group (the 'S' stands for "Group") */
  DEPARTMENT_GROUP = "S"
}

/**
 * MoneyWorks canonical general classification type enumeration
 * Maps prefixes to their semantic meaning
 */
export enum MoneyWorksGeneralClassificationType {
  /** Account Categories - Grouping mechanism for accounts */
  ACCOUNT_CATEGORY = "ACCOUNT_CATEGORY",
  
  /** Department Classifications - Grouping mechanism for departments */
  DEPARTMENT_CLASSIFICATION = "DEPARTMENT_CLASSIFICATION",
  
  /** Department Groups - Collections of departments for account association */
  DEPARTMENT_GROUP = "DEPARTMENT_GROUP"
}

// ============================================================================
// CANONICAL MONEYWORKS GENERAL FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks General file fields as defined in manual
 * Source: moneyworks_appendix_account_categories__department_classifications_and_groups.html
 */
export const MONEYWORKS_GENERAL_FIELDS = [
  {
    fieldName: "Code",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The category code. The prefixes are: C for Category, D for Classification, S for Group",
    manualSource: "moneyworks_appendix_account_categories__department_classifications_and_groups.html",
    isRequired: true,
    isIndexed: true,
    businessRule: "First character must be C, D, or S to indicate classification type"
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 25,
    canonicalDescription: "The category name.",
    manualSource: "moneyworks_appendix_account_categories__department_classifications_and_groups.html",
    isRequired: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date that this category was last changed. This means a change to the category record itself, not a change to any account balance associated with the category.",
    manualSource: "moneyworks_appendix_account_categories__department_classifications_and_groups.html",
    isRequired: false
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS ACCOUNT CATEGORY DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical account category definition
 * Source: moneyworks_accounts_account_categories.html
 */
export interface MoneyWorksAccountCategoryDefinition {
  code: string;                     // Must start with 'C'
  description: string;
  lastModifiedTime?: Date;
  canonicalType: MoneyWorksGeneralClassificationType.ACCOUNT_CATEGORY;
  businessContext: string;
}

/**
 * Account Categories canonical business rules
 * Source: moneyworks_accounts_account_categories.html
 */
export const MONEYWORKS_ACCOUNT_CATEGORY_RULES = {
  PURPOSE: "Grouping mechanism for accounts",
  USAGE: "Each account code can optionally be associated with one or more Category codes",
  EXAMPLES: "Phone, tolls, email, post and courier accounts with category 'COMMS' for Communications",
  BUSINESS_VALUE: "Easily ascertain total outgoings for grouped account types",
  FLEXIBILITY: "Categories can be created and changed at any time - labels for grouping accounts",
  PREDEFINED_VS_FREEFORM: "Two types: predefined (for first category field) and free-form (remaining three fields)",
  REPORTING: "Can condense or subtotal reports by category using subsummary reports",
  REPORT_BREAKDOWNS: "In MoneyWorks Gold, predefined categories can be used in report breakdowns",
  CODE_CONSTRAINTS: "Maximum 5 characters, alphanumeric, letters auto-capitalised, spaces converted to underscores, '@' not permitted",
  PREFIX_REQUIREMENT: "Must start with 'C' prefix in General file storage"
} as const;

// ============================================================================
// CANONICAL MONEYWORKS DEPARTMENT CLASSIFICATION DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical department classification definition
 * Source: moneyworks_departments_department_classifications.html
 */
export interface MoneyWorksDepartmentClassificationDefinition {
  code: string;                     // Must start with 'D'
  description: string;
  lastModifiedTime?: Date;
  canonicalType: MoneyWorksGeneralClassificationType.DEPARTMENT_CLASSIFICATION;
  businessContext: string;
}

/**
 * Department Classifications canonical business rules
 * Source: moneyworks_departments_department_classifications.html
 */
export const MONEYWORKS_DEPARTMENT_CLASSIFICATION_RULES = {
  PURPOSE: "Grouping mechanism for departments",
  RELATIONSHIP: "Classifications are to departments what pre-defined categories are to accounts",
  USAGE: "Used to group related departments together for reporting purposes",
  CARDINALITY: "A department can be associated with one classification",
  FLEXIBILITY: "Classification association can be altered at any time",
  REPORTING: "Enables department grouping for analytical and reporting purposes",
  PREFIX_REQUIREMENT: "Must start with 'D' prefix in General file storage"
} as const;

// ============================================================================
// CANONICAL MONEYWORKS DEPARTMENT GROUP DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical department group definition
 * Source: moneyworks_departments_department_groups.html
 */
export interface MoneyWorksDepartmentGroupDefinition {
  code: string;                     // Must start with 'S'
  description: string;
  lastModifiedTime?: Date;
  canonicalType: MoneyWorksGeneralClassificationType.DEPARTMENT_GROUP;
  businessContext: string;
}

/**
 * Department Groups canonical business rules
 * Source: moneyworks_departments_department_groups.html
 */
export const MONEYWORKS_DEPARTMENT_GROUP_RULES = {
  PURPOSE: "Collections of departments for account association and sub-ledger creation",
  DEFINITION: "A collection of departments used to associate member departments with accounts",
  SUB_LEDGER_CREATION: "Creates sub-ledgers for accounts through department association",
  ACCOUNT_ASSOCIATION: "Only department groups can be associated with accounts—not individual departments",
  MEMBERSHIP_FLEXIBILITY: "A department can belong to any number of different groups",
  MINIMUM_REQUIREMENT: "A group must contain at least one department before it can be associated with an account",
  BUSINESS_VALUE: "Enables sophisticated departmental cost tracking and analysis through account association",
  PREFIX_REQUIREMENT: "Must start with 'S' prefix in General file storage (S stands for 'Group')"
} as const;

// ============================================================================
// CANONICAL MONEYWORKS GENERAL TERMINOLOGY
// ============================================================================

export const MONEYWORKS_GENERAL_CANONICAL_TERMS = {
  // File structure (MoneyWorks canonical)
  INTERNAL_NAME: "General",                    // MoneyWorks internal file name
  LOGICAL_SEPARATION: "Prefix-based Logical Files", // Three logical files in one physical file
  
  // Account Categories (MoneyWorks canonical)
  ACCOUNT_CATEGORY: "Account Category",        // Grouping mechanism for accounts
  ACCOUNT_GROUPING: "Account Grouping",        // Business purpose of categories
  PREDEFINED_CATEGORY: "Predefined Category",  // First category field type
  FREEFORM_CATEGORY: "Free-form Category",     // Remaining category fields type
  
  // Department Classifications (MoneyWorks canonical)
  DEPARTMENT_CLASSIFICATION: "Department Classification", // Grouping mechanism for departments
  DEPARTMENT_GROUPING: "Department Grouping",             // Business purpose of classifications
  
  // Department Groups (MoneyWorks canonical)
  DEPARTMENT_GROUP: "Department Group",        // Collection of departments
  SUB_LEDGER: "Sub-ledger",                   // Account association result
  DEPARTMENT_COLLECTION: "Department Collection", // Group composition
  
  // Universal concepts (MoneyWorks canonical)
  CATEGORY_CODE: "Category Code",              // Identifier with prefix
  CATEGORY_NAME: "Category Name",              // Human-readable description
  LAST_MODIFIED: "Last Modified Time",         // Change tracking
  PREFIX_SYSTEM: "Prefix System",              // Logical separation mechanism
  GROUPING_MECHANISM: "Grouping Mechanism",    // Universal classification purpose
  REPORTING_DIMENSION: "Reporting Dimension"   // Analysis and reporting purpose
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate MoneyWorks General classification prefix
 */
export function validateGeneralPrefix(code: string): {
  isValid: boolean;
  prefix?: MoneyWorksGeneralPrefix;
  classificationType?: MoneyWorksGeneralClassificationType;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!code || code.length === 0) {
    warnings.push("Code cannot be empty");
    return { isValid: false, warnings };
  }
  
  const prefix = code.charAt(0).toUpperCase();
  
  switch (prefix) {
    case MoneyWorksGeneralPrefix.ACCOUNT_CATEGORY:
      return {
        isValid: true,
        prefix: MoneyWorksGeneralPrefix.ACCOUNT_CATEGORY,
        classificationType: MoneyWorksGeneralClassificationType.ACCOUNT_CATEGORY,
        warnings
      };
    case MoneyWorksGeneralPrefix.DEPARTMENT_CLASSIFICATION:
      return {
        isValid: true,
        prefix: MoneyWorksGeneralPrefix.DEPARTMENT_CLASSIFICATION,
        classificationType: MoneyWorksGeneralClassificationType.DEPARTMENT_CLASSIFICATION,
        warnings
      };
    case MoneyWorksGeneralPrefix.DEPARTMENT_GROUP:
      return {
        isValid: true,
        prefix: MoneyWorksGeneralPrefix.DEPARTMENT_GROUP,
        classificationType: MoneyWorksGeneralClassificationType.DEPARTMENT_GROUP,
        warnings
      };
    default:
      warnings.push(`Invalid prefix '${prefix}'. MoneyWorks canonical prefixes: C (Account Category), D (Department Classification), S (Department Group)`);
      return { isValid: false, warnings };
  }
}

/**
 * Get canonical MoneyWorks classification type explanation
 */
export function getCanonicalClassificationExplanation(
  classificationType: MoneyWorksGeneralClassificationType
): string {
  switch (classificationType) {
    case MoneyWorksGeneralClassificationType.ACCOUNT_CATEGORY:
      return "Account Category: Grouping mechanism for accounts. Used to group like accounts together for reporting and analysis (e.g., 'COMMS' for communication-related accounts).";
    case MoneyWorksGeneralClassificationType.DEPARTMENT_CLASSIFICATION:
      return "Department Classification: Grouping mechanism for departments. Used to group related departments together for reporting purposes (similar to how categories group accounts).";
    case MoneyWorksGeneralClassificationType.DEPARTMENT_GROUP:
      return "Department Group: Collection of departments for account association. Creates sub-ledgers for accounts through department association. Only groups (not individual departments) can be associated with accounts.";
    default:
      return "Unknown classification type";
  }
}

/**
 * Parse MoneyWorks General file code into components
 */
export function parseGeneralCode(code: string): {
  isValid: boolean;
  prefix?: MoneyWorksGeneralPrefix;
  classificationType?: MoneyWorksGeneralClassificationType;
  codeWithoutPrefix?: string;
  explanation?: string;
  warnings: string[];
} {
  const validation = validateGeneralPrefix(code);
  
  if (!validation.isValid) {
    return {
      isValid: false,
      warnings: validation.warnings
    };
  }
  
  const codeWithoutPrefix = code.substring(1);
  const explanation = validation.classificationType ? 
    getCanonicalClassificationExplanation(validation.classificationType) : 
    undefined;
  
  return {
    isValid: true,
    prefix: validation.prefix,
    classificationType: validation.classificationType,
    codeWithoutPrefix,
    explanation,
    warnings: validation.warnings
  };
}

/**
 * Create properly formatted MoneyWorks General code
 */
export function createGeneralCode(
  prefix: MoneyWorksGeneralPrefix,
  codeValue: string
): {
  isValid: boolean;
  formattedCode?: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Validate code value constraints
  if (!codeValue || codeValue.length === 0) {
    warnings.push("Code value cannot be empty");
    return { isValid: false, warnings };
  }
  
  if (codeValue.length > 4) {
    warnings.push("Code value (without prefix) cannot exceed 4 characters (total code max 5 characters)");
    return { isValid: false, warnings };
  }
  
  if (codeValue.includes('@')) {
    warnings.push("The '@' character is not permitted in MoneyWorks codes");
    return { isValid: false, warnings };
  }
  
  // Apply MoneyWorks formatting rules
  const formattedValue = codeValue
    .toUpperCase()                    // Letters automatically capitalised
    .replace(/\s+/g, '_');           // Spaces converted to underscores
  
  const formattedCode = prefix + formattedValue;
  
  return {
    isValid: true,
    formattedCode,
    warnings
  };
}

/**
 * Validate cross-business universality for General classifications
 */
export function validateGeneralUniversality(
  classificationType: MoneyWorksGeneralClassificationType,
  businessScenarios: string[]
): {
  isUniversal: boolean;
  applicableScenarios: string[];
  limitations: string[];
} {
  const limitations: string[] = [];
  
  switch (classificationType) {
    case MoneyWorksGeneralClassificationType.ACCOUNT_CATEGORY:
      // Account Categories are universal - any business needs to group accounts
      return {
        isUniversal: true,
        applicableScenarios: [
          "Restaurant: Group 'FOOD_COSTS', 'UTILITIES', 'COMMS' for expense analysis",
          "Law Firm: Group 'CLIENT_COSTS', 'OFFICE_EXP', 'PROFESSIONAL' for practice management",
          "Manufacturing: Group 'RAW_MAT', 'LABOR', 'OVERHEAD' for cost analysis",
          "Consulting: Group 'TRAVEL', 'TOOLS', 'MARKETING' for project profitability"
        ],
        limitations
      };
      
    case MoneyWorksGeneralClassificationType.DEPARTMENT_CLASSIFICATION:
      // Department Classifications are universal - any business with departments needs grouping
      return {
        isUniversal: true,
        applicableScenarios: [
          "Restaurant: Classify 'FRONT_OF_HOUSE', 'BACK_OF_HOUSE', 'ADMIN' departments",
          "Law Firm: Classify 'LITIGATION', 'CORPORATE', 'SUPPORT' departments",
          "Manufacturing: Classify 'PRODUCTION', 'QUALITY', 'ADMIN' departments",
          "Consulting: Classify 'DELIVERY', 'SALES', 'OPERATIONS' departments"
        ],
        limitations
      };
      
    case MoneyWorksGeneralClassificationType.DEPARTMENT_GROUP:
      // Department Groups are universal - any business needs department-account associations
      return {
        isUniversal: true,
        applicableScenarios: [
          "Restaurant: Group kitchen + service departments for 'OPERATIONS' cost tracking",
          "Law Firm: Group practice departments for 'BILLABLE_SERVICES' revenue tracking",
          "Manufacturing: Group production departments for 'MANUFACTURING' cost centers",
          "Consulting: Group project departments for 'CLIENT_DELIVERY' profitability"
        ],
        limitations
      };
      
    default:
      limitations.push("Unknown classification type");
      return {
        isUniversal: false,
        applicableScenarios: [],
        limitations
      };
  }
}

export default {
  MONEYWORKS_GENERAL_FIELDS,
  MONEYWORKS_GENERAL_CANONICAL_TERMS,
  MONEYWORKS_ACCOUNT_CATEGORY_RULES,
  MONEYWORKS_DEPARTMENT_CLASSIFICATION_RULES,
  MONEYWORKS_DEPARTMENT_GROUP_RULES
};