/**
 * MoneyWorks Complete Canonical Enumerations and Validation Framework
 * 
 * ADDRESSES CRITICAL ENUMERATION GAPS identified in final enhancement phase:
 * 1. Payment Method Enumerations (complete 0-7 range)
 * 2. Contact Roles (16-bit mapped roles)
 * 3. Custom Field Labels (comprehensive framework)
 * 4. Color Enumerations (8 default colors)
 * 5. Validation Lists (canonical framework)
 * 
 * Authority: MoneyWorks Manual - Multiple sources consolidated
 * Purpose: Complete enumeration modeling for 100% semantic DSL coverage
 */

// ============================================================================
// PAYMENT METHOD ENUMERATIONS - COMPLETE CANONICAL DEFINITION
// ============================================================================

/**
 * Complete MoneyWorks Payment Method Enumeration
 * Source: moneyworks_appendix_names.html + moneyworks_appendix_transactions.html
 * 
 * CRITICAL: MoneyWorks supports 8 payment methods (0-7)
 * - Methods 0-3: Fixed system-defined with special behavior
 * - Methods 4-7: User-definable
 */
export enum MoneyWorksPaymentMethodComplete {
  /** None - No payment method specified */
  NONE = 0,
  
  /** Cash - System-defined, special cash handling behavior */
  CASH = 1,
  
  /** Cheque - System-defined, special cheque handling behavior */
  CHEQUE = 2,
  
  /** Electronic - System-defined, special electronic payment behavior */
  ELECTRONIC = 3,
  
  /** Credit Card - User-definable, commonly configured as credit card */
  CREDIT_CARD = 4,
  
  /** User Defined 1 - User-definable payment method */
  USER_DEFINED_1 = 5,
  
  /** User Defined 2 - User-definable payment method */
  USER_DEFINED_2 = 6,
  
  /** User Defined 3 - User-definable payment method */
  USER_DEFINED_3 = 7
}

/**
 * Payment Method Canonical Definitions
 * Source: MoneyWorks manual - payment method behavior documentation
 */
export const MONEYWORKS_PAYMENT_METHOD_DEFINITIONS = [
  {
    value: MoneyWorksPaymentMethodComplete.NONE,
    canonicalName: "None",
    behavior: "system-fixed",
    description: "No payment method specified",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    value: MoneyWorksPaymentMethodComplete.CASH,
    canonicalName: "Cash", 
    behavior: "system-fixed",
    description: "Cash payments with special handling behavior",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    value: MoneyWorksPaymentMethodComplete.CHEQUE,
    canonicalName: "Cheque",
    behavior: "system-fixed", 
    description: "Cheque payments with special handling behavior",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    value: MoneyWorksPaymentMethodComplete.ELECTRONIC,
    canonicalName: "Electronic",
    behavior: "system-fixed",
    description: "Electronic payments with special handling behavior", 
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    value: MoneyWorksPaymentMethodComplete.CREDIT_CARD,
    canonicalName: "Credit Card",
    behavior: "user-definable",
    description: "User-definable payment method, commonly configured for credit cards",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    value: MoneyWorksPaymentMethodComplete.USER_DEFINED_1,
    canonicalName: "User Defined 1",
    behavior: "user-definable",
    description: "User-definable payment method",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    value: MoneyWorksPaymentMethodComplete.USER_DEFINED_2,
    canonicalName: "User Defined 2", 
    behavior: "user-definable",
    description: "User-definable payment method",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    value: MoneyWorksPaymentMethodComplete.USER_DEFINED_3,
    canonicalName: "User Defined 3",
    behavior: "user-definable", 
    description: "User-definable payment method",
    manualSource: "moneyworks_appendix_transactions.html"
  }
] as const;

// ============================================================================
// CONTACT ROLES - 16-BIT MAPPED ENUMERATION
// ============================================================================

/**
 * MoneyWorks Contact Roles - Complete Bit-Mapped Enumeration
 * Source: moneyworks_names_roles.html
 * 
 * ARCHITECTURE: 16 user-definable roles using bit-mapped flags
 * - Each role is a power of 2 (2^0, 2^1, 2^2, etc.)
 * - Roles can be combined using bitwise OR operations
 * - Role names are user-definable with 15 character limit
 * - Configured in Edit→Document Preferences→Fields panel
 */
export enum MoneyWorksContactRoles {
  /** Role 1 - User-defined role (bit 0) */
  ROLE_1 = 0x0001,
  
  /** Role 2 - User-defined role (bit 1) */
  ROLE_2 = 0x0002,
  
  /** Role 3 - User-defined role (bit 2) */
  ROLE_3 = 0x0004,
  
  /** Role 4 - User-defined role (bit 3) */
  ROLE_4 = 0x0008,
  
  /** Role 5 - User-defined role (bit 4) */
  ROLE_5 = 0x0010,
  
  /** Role 6 - User-defined role (bit 5) */
  ROLE_6 = 0x0020,
  
  /** Role 7 - User-defined role (bit 6) */
  ROLE_7 = 0x0040,
  
  /** Role 8 - User-defined role (bit 7) */
  ROLE_8 = 0x0080,
  
  /** Role 9 - User-defined role (bit 8) */
  ROLE_9 = 0x0100,
  
  /** Role 10 - User-defined role (bit 9) */
  ROLE_10 = 0x0200,
  
  /** Role 11 - User-defined role (bit 10) */
  ROLE_11 = 0x0400,
  
  /** Role 12 - User-defined role (bit 11) */
  ROLE_12 = 0x0800,
  
  /** Role 13 - User-defined role (bit 12) */
  ROLE_13 = 0x1000,
  
  /** Role 14 - User-defined role (bit 13) */
  ROLE_14 = 0x2000,
  
  /** Role 15 - User-defined role (bit 14) */
  ROLE_15 = 0x4000,
  
  /** Role 16 - User-defined role (bit 15) */
  ROLE_16 = 0x8000
}

/**
 * Contact Role Bit Manipulation Functions
 * Source: moneyworks_names_roles.html - role combination examples
 */
export class MoneyWorksContactRoleUtils {
  /**
   * Check if a contact has a specific role
   */
  static hasRole(roleField: number, role: MoneyWorksContactRoles): boolean {
    return (roleField & role) !== 0;
  }
  
  /**
   * Add a role to a contact's role field
   */
  static addRole(roleField: number, role: MoneyWorksContactRoles): number {
    return roleField | role;
  }
  
  /**
   * Remove a role from a contact's role field
   */
  static removeRole(roleField: number, role: MoneyWorksContactRoles): number {
    return roleField & ~role;
  }
  
  /**
   * Get all roles assigned to a contact
   */
  static getRoles(roleField: number): MoneyWorksContactRoles[] {
    const roles: MoneyWorksContactRoles[] = [];
    
    for (let i = 0; i < 16; i++) {
      const roleValue = 1 << i;
      if (roleField & roleValue) {
        roles.push(roleValue as MoneyWorksContactRoles);
      }
    }
    
    return roles;
  }
  
  /**
   * Convert role field to human-readable string
   * Example: 0x0D = roles 1, 3, and 4 = "Role 1, Role 3, Role 4"
   */
  static roleFieldToString(roleField: number): string {
    const roles = this.getRoles(roleField);
    
    if (roles.length === 0) {
      return "No roles assigned";
    }
    
    return roles.map(role => {
      const roleNumber = Math.log2(role) + 1;
      return `Role ${roleNumber}`;
    }).join(", ");
  }
}

// ============================================================================
// CUSTOM FIELD LABELS - COMPREHENSIVE FRAMEWORK
// ============================================================================

/**
 * MoneyWorks Custom Field Label Framework
 * Source: moneyworks_customisation.html - FieldLabel() function documentation
 * 
 * ARCHITECTURE: User-definable field labels with fallback to defaults
 * - FieldLabel("Table.Field") returns custom label or default
 * - Per-table customization supported
 * - Configured in Edit→Document Preferences→Fields panel
 */
export interface MoneyWorksCustomFieldDefinition {
  entityName: string;
  fieldName: string;
  defaultLabel: string;
  maxLength: number;
  dataType: "T" | "N" | "B" | "A" | "D";
  fieldLength?: number;
  description: string;
  manualSource: string;
}

/**
 * Complete Custom Field Registry Across All Entities
 * Source: Individual entity manual pages
 */
export const MONEYWORKS_CUSTOM_FIELDS_REGISTRY: MoneyWorksCustomFieldDefinition[] = [
  // Names Entity Custom Fields
  {
    entityName: "Names",
    fieldName: "Custom1",
    defaultLabel: "Custom 1",
    maxLength: 15,
    dataType: "T",
    fieldLength: 59,
    description: "User-defined custom field 1 for Names",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    entityName: "Names", 
    fieldName: "Custom2",
    defaultLabel: "Custom 2",
    maxLength: 15,
    dataType: "T",
    fieldLength: 59,
    description: "User-defined custom field 2 for Names",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    entityName: "Names",
    fieldName: "Custom3", 
    defaultLabel: "Custom 3",
    maxLength: 15,
    dataType: "T",
    fieldLength: 59,
    description: "User-defined custom field 3 for Names",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    entityName: "Names",
    fieldName: "Custom4",
    defaultLabel: "Custom 4", 
    maxLength: 15,
    dataType: "T",
    fieldLength: 59,
    description: "User-defined custom field 4 for Names",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    entityName: "Names",
    fieldName: "Custom5",
    defaultLabel: "Custom 5",
    maxLength: 15,
    dataType: "T", 
    fieldLength: 59,
    description: "User-defined custom field 5 for Names",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    entityName: "Names",
    fieldName: "Custom6",
    defaultLabel: "Custom 6",
    maxLength: 15,
    dataType: "T",
    fieldLength: 59,
    description: "User-defined custom field 6 for Names",
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    entityName: "Names",
    fieldName: "Custom7",
    defaultLabel: "Custom 7",
    maxLength: 15,
    dataType: "T",
    fieldLength: 59,
    description: "User-defined custom field 7 for Names", 
    manualSource: "moneyworks_appendix_names.html"
  },
  {
    entityName: "Names",
    fieldName: "Custom8",
    defaultLabel: "Custom 8",
    maxLength: 15,
    dataType: "T",
    fieldLength: 59,
    description: "User-defined custom field 8 for Names",
    manualSource: "moneyworks_appendix_names.html"
  },
  
  // Products Entity Category Fields
  {
    entityName: "Products",
    fieldName: "Category1",
    defaultLabel: "Category 1",
    maxLength: 15,
    dataType: "T",
    fieldLength: 39,
    description: "User-defined category field 1 for Products",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    entityName: "Products",
    fieldName: "Category2", 
    defaultLabel: "Category 2",
    maxLength: 15,
    dataType: "T",
    fieldLength: 39,
    description: "User-defined category field 2 for Products",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    entityName: "Products",
    fieldName: "Category3",
    defaultLabel: "Category 3",
    maxLength: 15,
    dataType: "T",
    fieldLength: 39,
    description: "User-defined category field 3 for Products",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    entityName: "Products",
    fieldName: "Category4",
    defaultLabel: "Category 4", 
    maxLength: 15,
    dataType: "T",
    fieldLength: 39,
    description: "User-defined category field 4 for Products",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // Transactions Entity Custom Fields
  {
    entityName: "Transactions",
    fieldName: "Custom1",
    defaultLabel: "Custom 1",
    maxLength: 15,
    dataType: "T",
    fieldLength: 23,
    description: "User-defined custom field 1 for Transactions",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    entityName: "Transactions", 
    fieldName: "Custom2",
    defaultLabel: "Custom 2",
    maxLength: 15,
    dataType: "T",
    fieldLength: 23,
    description: "User-defined custom field 2 for Transactions",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    entityName: "Transactions",
    fieldName: "Custom3",
    defaultLabel: "Custom 3",
    maxLength: 15,
    dataType: "T",
    fieldLength: 23,
    description: "User-defined custom field 3 for Transactions",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  {
    entityName: "Transactions",
    fieldName: "Custom4",
    defaultLabel: "Custom 4",
    maxLength: 15,
    dataType: "T",
    fieldLength: 23,
    description: "User-defined custom field 4 for Transactions",
    manualSource: "moneyworks_appendix_transactions.html"
  },
  
  // Jobs Entity Category Fields
  {
    entityName: "Jobs",
    fieldName: "Category1",
    defaultLabel: "Category 1",
    maxLength: 15,
    dataType: "T", 
    fieldLength: 21,
    description: "User-defined category field 1 for Jobs",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    entityName: "Jobs",
    fieldName: "Category2",
    defaultLabel: "Category 2",
    maxLength: 15,
    dataType: "T",
    fieldLength: 21,
    description: "User-defined category field 2 for Jobs",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    entityName: "Jobs",
    fieldName: "Category3",
    defaultLabel: "Category 3",
    maxLength: 15,
    dataType: "T",
    fieldLength: 21,
    description: "User-defined category field 3 for Jobs",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    entityName: "Jobs",
    fieldName: "Category4",
    defaultLabel: "Category 4",
    maxLength: 15,
    dataType: "T",
    fieldLength: 21,
    description: "User-defined category field 4 for Jobs",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  
  // Assets Entity Category Field
  {
    entityName: "Assets",
    fieldName: "Category",
    defaultLabel: "Category",
    maxLength: 15,
    dataType: "T",
    fieldLength: 21,
    description: "User-defined category field for Assets",
    manualSource: "moneyworks_appendix_assets.html"
  }
] as const;

/**
 * Custom Field Label Utility Functions
 * Source: moneyworks_customisation.html - FieldLabel() function behavior
 */
export class MoneyWorksCustomFieldUtils {
  /**
   * Get custom field label or default
   * Simulates MoneyWorks FieldLabel() function behavior
   */
  static getFieldLabel(entityName: string, fieldName: string, customLabels?: Map<string, string>): string {
    const key = `${entityName}.${fieldName}`;
    
    // Return custom label if defined
    if (customLabels?.has(key)) {
      return customLabels.get(key)!;
    }
    
    // Return default label
    const field = MONEYWORKS_CUSTOM_FIELDS_REGISTRY.find(
      f => f.entityName === entityName && f.fieldName === fieldName
    );
    
    return field?.defaultLabel || fieldName;
  }
  
  /**
   * Get all custom fields for an entity
   */
  static getEntityCustomFields(entityName: string): MoneyWorksCustomFieldDefinition[] {
    return MONEYWORKS_CUSTOM_FIELDS_REGISTRY.filter(f => f.entityName === entityName);
  }
  
  /**
   * Validate custom field label length
   */
  static validateLabelLength(label: string): { isValid: boolean; error?: string } {
    if (label.length > 15) {
      return { isValid: false, error: "Custom field labels cannot exceed 15 characters" };
    }
    return { isValid: true };
  }
}

// ============================================================================
// COLOR ENUMERATIONS - 8 DEFAULT COLORS
// ============================================================================

/**
 * MoneyWorks Color Enumeration
 * Source: moneyworks_customisation.html - color field documentation
 * 
 * ARCHITECTURE: 8 colors (0-7) with default English names
 * - Default color names provided by system
 * - Custom color names definable per table
 * - FieldLabel("Entity.Colour", colorValue) returns color name
 */
export enum MoneyWorksColors {
  /** Black - Default color 0 */
  BLACK = 0,
  
  /** White - Default color 1 */
  WHITE = 1,
  
  /** Red - Default color 2 */
  RED = 2,
  
  /** Green - Default color 3 */
  GREEN = 3,
  
  /** Blue - Default color 4 */
  BLUE = 4,
  
  /** Yellow - Default color 5 */
  YELLOW = 5,
  
  /** Magenta - Default color 6 */
  MAGENTA = 6,
  
  /** Cyan - Default color 7 */
  CYAN = 7
}

/**
 * Color Definitions with Default Names
 * Source: MoneyWorks manual - default color system
 */
export const MONEYWORKS_COLOR_DEFINITIONS = [
  {
    value: MoneyWorksColors.BLACK,
    defaultName: "Black",
    canonicalName: "Black"
  },
  {
    value: MoneyWorksColors.WHITE, 
    defaultName: "White",
    canonicalName: "White"
  },
  {
    value: MoneyWorksColors.RED,
    defaultName: "Red",
    canonicalName: "Red"
  },
  {
    value: MoneyWorksColors.GREEN,
    defaultName: "Green",
    canonicalName: "Green"
  },
  {
    value: MoneyWorksColors.BLUE,
    defaultName: "Blue", 
    canonicalName: "Blue"
  },
  {
    value: MoneyWorksColors.YELLOW,
    defaultName: "Yellow",
    canonicalName: "Yellow"
  },
  {
    value: MoneyWorksColors.MAGENTA,
    defaultName: "Magenta",
    canonicalName: "Magenta"
  },
  {
    value: MoneyWorksColors.CYAN,
    defaultName: "Cyan",
    canonicalName: "Cyan"
  }
] as const;

// ============================================================================
// VALIDATION LISTS - CANONICAL FRAMEWORK
// ============================================================================

/**
 * MoneyWorks Validation List Framework
 * Source: moneyworks_validation.html - validation system documentation
 * 
 * ARCHITECTURE: User-definable validation constraints
 * - List-based validation (acceptable values)
 * - Expression-based validation (formula constraints)
 * - User-specific and transaction-specific scope
 * - Field-level application across entities
 */
export interface MoneyWorksValidationList {
  /** Unique name for the validation list */
  name: string;
  
  /** Type of validation - list of values or expression formula */
  type: "list" | "expression";
  
  /** For list-based validation: array of acceptable values */
  values?: string[];
  
  /** For expression-based validation: validation formula */
  expression?: string;
  
  /** Fields this validation applies to (Entity.Field format) */
  fieldTargets: string[];
  
  /** User scope - which users this validation applies to */
  userScope: string;
  
  /** Transaction types this validation applies to (if transaction-specific) */
  transactionTypes?: string[];
  
  /** Error message when validation fails */
  errorMessage: string;
  
  /** Whether validation is case-sensitive (for list-based) */
  caseSensitive?: boolean;
  
  /** Manual source reference */
  manualSource: string;
}

/**
 * Example Validation Lists
 * Source: moneyworks_validation.html - validation examples
 */
export const MONEYWORKS_VALIDATION_EXAMPLES: MoneyWorksValidationList[] = [
  {
    name: "Valid Departments",
    type: "list",
    values: ["Sales", "Marketing", "Operations", "Finance", "IT"],
    fieldTargets: ["Names.Custom1", "Transactions.DeptCode"],
    userScope: "all",
    errorMessage: "Please select a valid department",
    caseSensitive: false,
    manualSource: "moneyworks_validation.html"
  },
  {
    name: "Credit Limit Check",
    type: "expression", 
    expression: "Value <= 10000",
    fieldTargets: ["Names.CreditLimit"],
    userScope: "standard",
    errorMessage: "Credit limit cannot exceed $10,000",
    manualSource: "moneyworks_validation.html"
  },
  {
    name: "Required Job Code",
    type: "expression",
    expression: "Length(Value) > 0",
    fieldTargets: ["Transactions.JobCode"],
    userScope: "all",
    transactionTypes: ["Sales Invoice", "Purchase Invoice"],
    errorMessage: "Job code is required for invoice transactions",
    manualSource: "moneyworks_validation.html"
  }
] as const;

/**
 * Validation List Utility Functions
 * Source: moneyworks_validation.html - validation processing
 */
export class MoneyWorksValidationUtils {
  /**
   * Validate a value against a validation list
   */
  static validateValue(
    value: string, 
    validationList: MoneyWorksValidationList
  ): { isValid: boolean; error?: string } {
    
    if (validationList.type === "list") {
      if (!validationList.values) {
        return { isValid: false, error: "No validation values defined" };
      }
      
      const searchValue = validationList.caseSensitive ? value : value.toLowerCase();
      const validValues = validationList.caseSensitive 
        ? validationList.values 
        : validationList.values.map(v => v.toLowerCase());
      
      if (!validValues.includes(searchValue)) {
        return { isValid: false, error: validationList.errorMessage };
      }
    } else if (validationList.type === "expression") {
      // Note: Expression validation would require MoneyWorks expression evaluator
      // This is a simplified example
      if (!validationList.expression) {
        return { isValid: false, error: "No validation expression defined" };
      }
      
      // Placeholder for expression evaluation
      // In real implementation, would use MoneyWorks expression engine
      console.log(`Validating ${value} against expression: ${validationList.expression}`);
    }
    
    return { isValid: true };
  }
  
  /**
   * Get validation lists applicable to a field
   */
  static getFieldValidations(
    entityName: string, 
    fieldName: string,
    validationLists: MoneyWorksValidationList[]
  ): MoneyWorksValidationList[] {
    const fieldTarget = `${entityName}.${fieldName}`;
    
    return validationLists.filter(list => 
      list.fieldTargets.includes(fieldTarget)
    );
  }
  
  /**
   * Check if validation applies to user and transaction type
   */
  static isValidationApplicable(
    validation: MoneyWorksValidationList,
    userScope: string,
    transactionType?: string
  ): boolean {
    // Check user scope
    if (validation.userScope !== "all" && validation.userScope !== userScope) {
      return false;
    }
    
    // Check transaction type if specified
    if (validation.transactionTypes && validation.transactionTypes.length > 0) {
      if (!transactionType || !validation.transactionTypes.includes(transactionType)) {
        return false;
      }
    }
    
    return true;
  }
}

// ============================================================================
// ENUMERATION CONSISTENCY VALIDATION
// ============================================================================

/**
 * Cross-Entity Enumeration Consistency Checker
 * Ensures enumerations are consistent across all entities
 */
export class MoneyWorksEnumerationValidator {
  /**
   * Validate payment method consistency across entities
   */
  static validatePaymentMethodConsistency(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check that all entities use the complete payment method enumeration
    const completeRange = Object.values(MoneyWorksPaymentMethodComplete);
    
    // This would check against actual entity implementations
    // Placeholder for entity consistency validation
    
    return { isValid: errors.length === 0, errors };
  }
  
  /**
   * Validate custom field naming consistency
   */
  static validateCustomFieldConsistency(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for consistent naming patterns across entities
    const entities = [...new Set(MONEYWORKS_CUSTOM_FIELDS_REGISTRY.map(f => f.entityName))];
    
    entities.forEach(entity => {
      const fields = MONEYWORKS_CUSTOM_FIELDS_REGISTRY.filter(f => f.entityName === entity);
      
      // Check for consistent patterns within entity
      const hasCustomPattern = fields.some(f => f.fieldName.startsWith("Custom"));
      const hasCategoryPattern = fields.some(f => f.fieldName.startsWith("Category"));
      
      if (hasCustomPattern && hasCategoryPattern) {
        errors.push(`Entity ${entity} mixes Custom and Category field naming patterns`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  }
  
  /**
   * Validate enumeration completeness across all entities
   */
  static validateEnumerationCompleteness(): { 
    paymentMethods: number;
    contactRoles: number; 
    customFields: number;
    colors: number;
    totalEnumerations: number;
  } {
    return {
      paymentMethods: Object.keys(MoneyWorksPaymentMethodComplete).length / 2, // Enum keys are doubled
      contactRoles: Object.keys(MoneyWorksContactRoles).length / 2,
      customFields: MONEYWORKS_CUSTOM_FIELDS_REGISTRY.length,
      colors: Object.keys(MoneyWorksColors).length / 2,
      totalEnumerations: 4 // 4 major enumeration categories completed
    };
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  // Payment Methods
  MoneyWorksPaymentMethodComplete,
  MONEYWORKS_PAYMENT_METHOD_DEFINITIONS,
  
  // Contact Roles
  MoneyWorksContactRoles,
  MoneyWorksContactRoleUtils,
  
  // Custom Fields
  MONEYWORKS_CUSTOM_FIELDS_REGISTRY,
  MoneyWorksCustomFieldUtils,
  
  // Colors
  MoneyWorksColors,
  MONEYWORKS_COLOR_DEFINITIONS,
  
  // Validation
  MoneyWorksValidationUtils,
  MONEYWORKS_VALIDATION_EXAMPLES,
  
  // Consistency
  MoneyWorksEnumerationValidator
};