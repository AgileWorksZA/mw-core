/**
 * MoneyWorks Contact Roles - Complete Canonical Implementation
 * 
 * CORRECTED AND ENHANCED based on official MoneyWorks documentation:
 * - moneyworks_names_roles.html (Core role definitions)
 * - moneyworks_names_contacts.html (Contact system integration)
 * - moneyworks_calculations_getcontactforrole.html (Role-based retrieval functions)
 * 
 * Authority: MoneyWorks Manual - Contact Roles System
 * Purpose: Complete canonical modeling of MoneyWorks contact role bit-mapping system
 */

// ============================================================================
// CONTACT ROLES - CANONICAL BIT-MAPPED ENUMERATION (CORRECTED)
// ============================================================================

/**
 * MoneyWorks Contact Roles - Canonical 16-Bit Mapped Enumeration
 * Source: moneyworks_names_roles.html
 * 
 * VERIFIED ARCHITECTURE:
 * - 16 user-definable roles using bit-mapped flags
 * - Each role is a power of 2 (2^0, 2^1, 2^2, etc.)
 * - Roles can be combined using bitwise OR operations
 * - Role names are user-definable with 15 character limit
 * - Configured in Edit→Document Preferences→Fields panel
 * - Values stored as hexadecimal with # prefix in MoneyWorks (#01, #02, etc.)
 */
export enum MoneyWorksContactRoles {
  /** Role 1 - User-defined role (bit 0) - MoneyWorks: #01 */
  ROLE_1 = 0x01,
  
  /** Role 2 - User-defined role (bit 1) - MoneyWorks: #02 */
  ROLE_2 = 0x02,
  
  /** Role 3 - User-defined role (bit 2) - MoneyWorks: #04 */
  ROLE_3 = 0x04,
  
  /** Role 4 - User-defined role (bit 3) - MoneyWorks: #08 */
  ROLE_4 = 0x08,
  
  /** Role 5 - User-defined role (bit 4) - MoneyWorks: #10 */
  ROLE_5 = 0x10,
  
  /** Role 6 - User-defined role (bit 5) - MoneyWorks: #20 */
  ROLE_6 = 0x20,
  
  /** Role 7 - User-defined role (bit 6) - MoneyWorks: #40 */
  ROLE_7 = 0x40,
  
  /** Role 8 - User-defined role (bit 7) - MoneyWorks: #80 */
  ROLE_8 = 0x80,
  
  /** Role 9 - User-defined role (bit 8) - MoneyWorks: #100 */
  ROLE_9 = 0x100,
  
  /** Role 10 - User-defined role (bit 9) - MoneyWorks: #200 */
  ROLE_10 = 0x200,
  
  /** Role 11 - User-defined role (bit 10) - MoneyWorks: #400 */
  ROLE_11 = 0x400,
  
  /** Role 12 - User-defined role (bit 11) - MoneyWorks: #800 */
  ROLE_12 = 0x800,
  
  /** Role 13 - User-defined role (bit 12) - MoneyWorks: #1000 */
  ROLE_13 = 0x1000,
  
  /** Role 14 - User-defined role (bit 13) - MoneyWorks: #2000 */
  ROLE_14 = 0x2000,
  
  /** Role 15 - User-defined role (bit 14) - MoneyWorks: #4000 */
  ROLE_15 = 0x4000,
  
  /** Role 16 - User-defined role (bit 15) - MoneyWorks: #8000 */
  ROLE_16 = 0x8000
}

/**
 * MoneyWorks Legacy Contact Special Values
 * Source: moneyworks_names_roles.html - legacy contact handling
 * 
 * IMPORTANT: Legacy contacts (contact1, contact2) in Names entity have assumed role bits
 * that extend beyond the normal 16-bit role field for compatibility.
 */
export enum MoneyWorksLegacyContactRoles {
  /** Contact1 assumed role bit - MoneyWorks: #10000 (extends beyond 16-bit field) */
  CONTACT_1_ASSUMED = 0x10000,
  
  /** Contact2 assumed role bit - MoneyWorks: #20000 (extends beyond 16-bit field) */
  CONTACT_2_ASSUMED = 0x20000
}

/**
 * MoneyWorks Default Role Names and Structure (FROM RESEARCHER)
 * Source: Document Preferences → Fields tab → Contact Roles list
 * 
 * CANONICAL ROLE STRUCTURE:
 * Bit #1    = "Payables" (default name)
 * Bit #2    = "Receivables" (default name)  
 * Bit #4    = "Technical" (default name)
 * Bit #8    = "Management" (default name)
 * #10000    = Contact1 (legacy contact assumed role)
 * #20000    = Contact2 (legacy contact assumed role)
 */
export const MONEYWORKS_DEFAULT_ROLE_NAMES = {
  [MoneyWorksContactRoles.ROLE_1]: "Payables",
  [MoneyWorksContactRoles.ROLE_2]: "Receivables", 
  [MoneyWorksContactRoles.ROLE_3]: "Technical",
  [MoneyWorksContactRoles.ROLE_4]: "Management",
  // Roles 5-16 have no default names, are user-definable
  [MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED]: "Contact1",
  [MoneyWorksLegacyContactRoles.CONTACT_2_ASSUMED]: "Contact2"
} as const;

/**
 * MoneyWorks Role Examples from Manual and Researcher
 * Source: moneyworks_names_roles.html + researcher practical examples
 */
export const MONEYWORKS_ROLE_EXAMPLES = [
  {
    description: "Role 1 only (Payables)",
    hexValue: "#01",
    decimalValue: 0x01,
    rolesCombination: [MoneyWorksContactRoles.ROLE_1],
    defaultRoleName: "Payables"
  },
  {
    description: "Roles 1, 3, and 4 (Payables + Technical + Management)",
    hexValue: "#0D", 
    decimalValue: 0x0D,
    rolesCombination: [MoneyWorksContactRoles.ROLE_1, MoneyWorksContactRoles.ROLE_3, MoneyWorksContactRoles.ROLE_4],
    defaultRoleNames: ["Payables", "Technical", "Management"]
  },
  {
    description: "Roles 1 and 2 (Payables + Receivables)",
    hexValue: "#03",
    decimalValue: 0x03,
    rolesCombination: [MoneyWorksContactRoles.ROLE_1, MoneyWorksContactRoles.ROLE_2],
    defaultRoleNames: ["Payables", "Receivables"]
  },
  {
    description: "Payables + Technical combination (#5)",
    hexValue: "#05",
    decimalValue: 0x05,
    rolesCombination: [MoneyWorksContactRoles.ROLE_1, MoneyWorksContactRoles.ROLE_3],
    defaultRoleNames: ["Payables", "Technical"],
    researcherExample: "GetAllContactEmailsForRole(\"VENDOR02\", #5)"
  },
  {
    description: "Contact1 + Role1 + Role2 combination",
    hexValue: "#10003",
    decimalValue: 0x10003,
    rolesCombination: [MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED, MoneyWorksContactRoles.ROLE_1, MoneyWorksContactRoles.ROLE_2],
    defaultRoleNames: ["Contact1", "Payables", "Receivables"],
    researcherExample: "Multiple role bitmask example"
  },
  {
    description: "Primary contact email retrieval",
    hexValue: "#10000",
    decimalValue: 0x10000,
    rolesCombination: [MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED],
    defaultRoleName: "Contact1",
    researcherExample: "N.GetContactForRole(#10000, \"email\")"
  },
  {
    description: "Roles 1-8 (all first byte)",
    hexValue: "#FF",
    decimalValue: 0xFF,
    rolesCombination: [
      MoneyWorksContactRoles.ROLE_1, MoneyWorksContactRoles.ROLE_2, MoneyWorksContactRoles.ROLE_3, MoneyWorksContactRoles.ROLE_4,
      MoneyWorksContactRoles.ROLE_5, MoneyWorksContactRoles.ROLE_6, MoneyWorksContactRoles.ROLE_7, MoneyWorksContactRoles.ROLE_8
    ],
    defaultRoleNames: ["Payables", "Receivables", "Technical", "Management", "Role5", "Role6", "Role7", "Role8"]
  }
] as const;

// ============================================================================
// CONTACT ROLE CANONICAL FUNCTIONS (MONEYWORKS COMPATIBLE)
// ============================================================================

/**
 * Enhanced Contact Role Bit Manipulation Functions
 * Source: moneyworks_names_roles.html + moneyworks_calculations_getcontactforrole.html
 * 
 * ENHANCED with MoneyWorks canonical function support and hexadecimal compatibility
 */
export class MoneyWorksContactRoleUtils {
  /**
   * Check if a contact has a specific role
   * Source: Bit manipulation logic from MoneyWorks manual
   */
  static hasRole(roleField: number, role: MoneyWorksContactRoles): boolean {
    return (roleField & role) !== 0;
  }
  
  /**
   * Check if a contact has any of the specified roles
   * Source: GetContactForRole function behavior
   */
  static hasAnyRole(roleField: number, roles: MoneyWorksContactRoles[]): boolean {
    return roles.some(role => this.hasRole(roleField, role));
  }
  
  /**
   * Add a role to a contact's role field
   * Source: Role assignment logic from MoneyWorks manual
   */
  static addRole(roleField: number, role: MoneyWorksContactRoles): number {
    return roleField | role;
  }
  
  /**
   * Remove a role from a contact's role field
   * Source: Role removal logic from MoneyWorks manual
   */
  static removeRole(roleField: number, role: MoneyWorksContactRoles): number {
    return roleField & ~role;
  }
  
  /**
   * Get all roles assigned to a contact
   * Source: Role enumeration logic from MoneyWorks manual
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
   * Convert role field to MoneyWorks hexadecimal format
   * Source: moneyworks_names_roles.html - hex format specification
   * Returns: "#01", "#0D", "#FF", etc.
   */
  static toMoneyWorksHex(roleField: number): string {
    return `#${roleField.toString(16).toUpperCase().padStart(2, '0')}`;
  }
  
  /**
   * Parse MoneyWorks hexadecimal format to role field
   * Source: moneyworks_names_roles.html - hex format specification
   * Accepts: "#01", "#0D", "#FF", etc.
   */
  static fromMoneyWorksHex(hexString: string): number {
    // Remove # prefix if present
    const cleanHex = hexString.startsWith('#') ? hexString.slice(1) : hexString;
    return parseInt(cleanHex, 16);
  }
  
  /**
   * Convert role field to human-readable string (ENHANCED FROM RESEARCHER)
   * Source: Role display logic from MoneyWorks manual + researcher findings
   * Example: 0x0D = roles 1, 3, and 4 = "Payables, Technical, Management"
   */
  static roleFieldToString(roleField: number, customRoleNames?: Map<MoneyWorksContactRoles | MoneyWorksLegacyContactRoles, string>): string {
    const roles = this.getRoles(roleField);
    
    // Check for legacy contact roles (extend beyond 16-bit)
    const legacyRoles: MoneyWorksLegacyContactRoles[] = [];
    if (roleField & MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED) {
      legacyRoles.push(MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED);
    }
    if (roleField & MoneyWorksLegacyContactRoles.CONTACT_2_ASSUMED) {
      legacyRoles.push(MoneyWorksLegacyContactRoles.CONTACT_2_ASSUMED);
    }
    
    if (roles.length === 0 && legacyRoles.length === 0) {
      return "No roles assigned";
    }
    
    const allRoleNames: string[] = [];
    
    // Add legacy contact role names
    legacyRoles.forEach(role => {
      if (customRoleNames?.has(role)) {
        allRoleNames.push(customRoleNames.get(role)!);
      } else {
        allRoleNames.push(MONEYWORKS_DEFAULT_ROLE_NAMES[role]);
      }
    });
    
    // Add regular role names
    roles.forEach(role => {
      if (customRoleNames?.has(role)) {
        allRoleNames.push(customRoleNames.get(role)!);
      } else if (MONEYWORKS_DEFAULT_ROLE_NAMES[role]) {
        allRoleNames.push(MONEYWORKS_DEFAULT_ROLE_NAMES[role]);
      } else {
        const roleNumber = Math.log2(role) + 1;
        allRoleNames.push(`Role ${roleNumber}`);
      }
    });
    
    return allRoleNames.join(", ");
  }
  
  /**
   * Convert string role name to role bit (ADDED FROM RESEARCHER)
   * Source: Researcher findings - functions accept both numeric bitmasks and string role names
   * Supports both default role names and custom role names
   */
  static roleNameToBit(roleName: string, customRoleNames?: Map<string, MoneyWorksContactRoles | MoneyWorksLegacyContactRoles>): number {
    // Check custom role names first
    if (customRoleNames?.has(roleName)) {
      return customRoleNames.get(roleName)!;
    }
    
    // Check default role names
    for (const [bit, defaultName] of Object.entries(MONEYWORKS_DEFAULT_ROLE_NAMES)) {
      if (defaultName === roleName) {
        return parseInt(bit);
      }
    }
    
    // If not found, return 0
    return 0;
  }
  
  /**
   * Parse multiple role specification (ADDED FROM RESEARCHER)
   * Source: Researcher examples - supports bitmask combinations
   * Handles: "Payables", "#5", "Payables+Technical", etc.
   */
  static parseRoleSpecification(roleSpec: string | number, customRoleNames?: Map<string, MoneyWorksContactRoles | MoneyWorksLegacyContactRoles>): number {
    if (typeof roleSpec === 'number') {
      return roleSpec;
    }
    
    // Handle hex format (#5, #10000, etc.)
    if (roleSpec.startsWith('#')) {
      return this.fromMoneyWorksHex(roleSpec);
    }
    
    // Handle role name
    return this.roleNameToBit(roleSpec, customRoleNames);
  }
  
  /**
   * Validate role name length (MoneyWorks constraint)
   * Source: moneyworks_names_roles.html - role name limitations
   */
  static validateRoleName(roleName: string): { isValid: boolean; error?: string } {
    if (roleName.length > 15) {
      return { 
        isValid: false, 
        error: "Role names cannot exceed 15 characters (MoneyWorks constraint)" 
      };
    }
    
    if (roleName.trim().length === 0) {
      return {
        isValid: false,
        error: "Role name cannot be empty"
      };
    }
    
    return { isValid: true };
  }
}

// ============================================================================
// MONEYWORKS CANONICAL CONTACT ROLE FUNCTIONS
// ============================================================================

/**
 * MoneyWorks Canonical Contact Role Functions (VERIFIED BY RESEARCHER)
 * Source: MoneyWorks Function and Handler Summary + Name record methods documentation
 * 
 * ✅ VERIFIED: Both functions are officially documented in MoneyWorks manual
 * ✅ CONFIRMED: Both functions are legitimate parts of MoneyWorks calculation/scripting system
 */
export interface MoneyWorksContactRoleFunctions {
  /**
   * FieldLabel - Contact Role Label Retrieval (CRITICAL MISSING FUNCTION)
   * Source: moneyworks_calculations_fieldlabel.html (DISCOVERED BY RESEARCHER)
   * 
   * ✅ PRIMARY METHOD: Use FieldLabel() function to retrieve actual role label names
   * ✅ BITFIELD SUPPORT: Automatically converts multiple bits into comma-separated role names
   * ✅ CUSTOMIZATION: Returns custom labels if set, or defaults if not
   * 
   * Usage: FieldLabel("Contacts.Role", enumeration)
   * Context: Available in both MWScript and Custom Reports
   * Purpose: Get the actual role label names configured in Document Preferences
   * Returns: Role label string (single role) or comma-separated labels (multiple roles)
   * Configuration: Document Preferences → Fields → Contact Roles list
   * 
   * EXAMPLES:
   * - FieldLabel("Contacts.Role", 1) - Returns "Payables" (or custom label)
   * - FieldLabel("Contacts.Role", 2) - Returns "Receivables" (or custom label)
   * - FieldLabel("Contacts.Role", 5) - Returns "Payables, CEO" (bits 1+4 = binary 101)
   * - FieldLabel("Contacts.Role", 8) - Returns role #4 label (Management)
   * 
   * CRITICAL: This provides programmatic access to actual role label names configured in MoneyWorks
   */
  fieldLabel: {
    context: "MWScript + Custom Reports";
    usage: "FieldLabel(\"Contacts.Role\", enumeration)";
    purpose: "Get actual role label names configured in Document Preferences";
    returns: "Role label string (single) or comma-separated labels (multiple roles)";
    bitfieldSupport: "Automatically converts multiple bits into comma-separated role names";
    customization: "Returns custom labels if set, or defaults if not";
    configurationLocation: "Document Preferences → Fields → Contact Roles list";
    examples: [
      "FieldLabel(\"Contacts.Role\", 1)",
      "FieldLabel(\"Contacts.Role\", 5)",
      "FieldLabel(\"Contacts.Role\", 8)"
    ];
    practicalUsage: [
      "var role1Label = FieldLabel(\"Contacts.Role\", 1); // \"Payables\"",
      "var emails = GetAllContactEmailsForRole(\"CUST001\", role1Label);",
      "var multiRoleLabel = FieldLabel(\"Contacts.Role\", 3); // \"Payables, Receivables\""
    ];
  };
  
  /**
   * GetContactForRole - Custom Reports Only
   * Source: MoneyWorks calculation reference
   * 
   * Usage: N.GetContactForRole(rolebits [, requestedfieldname])
   * Context: Must be used within Name record loop (ForEach N in Name)
   * Returns: First contact with any of the requested role bits set
   * Field Selection: All fields tab-delimited, or specific field if requested
   * Special: Use "*" for ALL fields of matching contacts
   * Sorting: Results sorted by Order field
   * 
   * EXAMPLES:
   * - N.GetContactForRole(1, "email") - gets email for role #1
   * - N.GetContactForRole(#10000, "email") - gets email for Contact1
   * - N.GetContactForRole(#5) - gets all fields for roles #1 + #4 (Payables + Technical)
   * 
   * RESTRICTION: Available in Custom Reports only, NOT in MWScript
   */
  getContactForRole: {
    context: "Custom Reports Only";
    usage: "N.GetContactForRole(rolebits [, requestedfieldname])";
    requiredContext: "ForEach N in Name";
    returns: "First contact with matching role bits";
    sorting: "By Order field";
    fieldSelection: "All fields (tab-delimited), specific field, or '*' for all matching contacts";
    restriction: "NOT available in MWScript";
    examples: [
      "N.GetContactForRole(1, \"email\")",
      "N.GetContactForRole(#10000, \"email\")", 
      "N.GetContactForRole(#5)"
    ];
  };
  
  /**
   * GetAllContactEmailsForRole - MWScript (Primary) + Custom Reports
   * Source: MoneyWorks Function and Handler Summary (VERIFIED BY RESEARCHER)
   * 
   * ✅ OFFICIAL FUNCTION: Listed in Function and Handler Summary
   * ✅ VERIFIED PURPOSE: "Get a list of email addresses for a Name"
   * ✅ CORRECTED AVAILABILITY: MWScript (not limited to custom reports)
   * 
   * Usage: GetAllContactEmailsForRole(nameCode, role [, detailed])
   * Context: Available in MWScript - This is the MWScript alternative to GetContactForRole
   * Purpose: Gets email addresses for specific roles from a Name record
   * Returns: Comma-delimited email list, or full contact details if detailed specified
   * Role Input: Accepts both numeric bitmasks and string role names
   * 
   * EXAMPLES:
   * - GetAllContactEmailsForRole("CUST001", "Payables")
   * - GetAllContactEmailsForRole("SUPPLIER01", "Payables") 
   * - GetAllContactEmailsForRole("VENDOR02", #5) - Payables + Technical
   * - GetAllContactEmailsForRole("CLIENT03", "Management", "*") - full contact details
   * 
   * KEY ADVANTAGE: Available in MWScript (unlike GetContactForRole which is Custom Reports only)
   */
  getAllContactEmailsForRole: {
    context: "MWScript (Primary) + Custom Reports";
    usage: "GetAllContactEmailsForRole(nameCode, role [, detailed])";
    officialPurpose: "Get a list of email addresses for a Name";
    returns: "Comma-delimited email list, or full contact details if detailed specified";
    roleInput: "Accepts both numeric bitmasks and string role names";
    keyAdvantage: "Available in MWScript (unlike GetContactForRole which is Custom Reports only)";
    verification: "Listed in MoneyWorks Function and Handler Summary";
    examples: [
      "GetAllContactEmailsForRole(\"CUST001\", \"Payables\")",
      "GetAllContactEmailsForRole(\"VENDOR02\", #5)",
      "GetAllContactEmailsForRole(\"CLIENT03\", \"Management\", \"*\")"
    ];
  };
}

/**
 * Contact Role Function Availability Matrix (VERIFIED BY RESEARCHER)
 * Source: MoneyWorks Function and Handler Summary + Name record methods documentation
 * 
 * ✅ VERIFICATION: Both functions officially documented and legitimate
 */
export const MONEYWORKS_CONTACT_ROLE_FUNCTION_AVAILABILITY = {
  customReports: {
    available: ["GetContactForRole", "GetAllContactEmailsForRole", "FieldLabel"],
    restrictions: ["GetContactForRole must be within ForEach N in Name context"],
    documentation: "GetContactForRole listed under Name record methods"
  },
  mwScript: {
    available: ["GetAllContactEmailsForRole", "FieldLabel"],
    restrictions: ["Cannot use GetContactForRole (Custom Reports only)"],
    documentation: "GetAllContactEmailsForRole listed in Function and Handler Summary"
  }
} as const;

/**
 * Contact Role Function Comparison Table (FROM RESEARCHER VERIFICATION)
 * Source: Researcher analysis of official MoneyWorks documentation
 */
export const MONEYWORKS_CONTACT_ROLE_FUNCTION_COMPARISON = [
  {
    function: "FieldLabel",
    context: "MWScript + Custom Reports",
    usage: "FieldLabel(\"Contacts.Role\", enumeration)",
    returns: "Role label names",
    purpose: "Get actual role label names",
    officialStatus: "✅ Listed in Function and Handler Summary",
    verification: "Discovered by researcher - provides programmatic access to role labels"
  },
  {
    function: "GetAllContactEmailsForRole",
    context: "MWScript + Custom Reports", 
    usage: "GetAllContactEmailsForRole(nameCode, role [, detailed])",
    returns: "Comma-delimited emails",
    purpose: "Get emails for specific roles",
    officialStatus: "✅ Listed in Function and Handler Summary",
    verification: "Confirmed legitimate MoneyWorks function"
  },
  {
    function: "GetContactForRole", 
    context: "Custom Reports Only",
    usage: "N.GetContactForRole(rolebits [, requestedfieldname])",
    returns: "Single contact data",
    purpose: "Get contact data within Name record loop",
    officialStatus: "✅ Listed under Name record methods",
    verification: "Confirmed legitimate MoneyWorks function"
  }
] as const;

/**
 * Role Parameter Support (VERIFIED BY RESEARCHER)
 * Source: Official MoneyWorks documentation verification
 */
export const MONEYWORKS_ROLE_PARAMETER_SUPPORT = {
  bothFunctionsAccept: {
    numericBitmasks: ["#1", "#2", "#10000", "etc."],
    stringRoleNames: ["Payables", "Receivables", "etc."],
    verification: "Confirmed by researcher analysis of official documentation"
  },
  comprehensiveSupport: "Both functions provide comprehensive contact role management capabilities in MoneyWorks"
} as const;

// ============================================================================
// CONTACT ROLE BUSINESS RULES AND CONSTRAINTS
// ============================================================================

/**
 * MoneyWorks Contact Role Business Rules
 * Source: moneyworks_names_roles.html - role management rules
 */
export const MONEYWORKS_CONTACT_ROLE_BUSINESS_RULES = [
  {
    rule: "Role Definition Limit",
    description: "Maximum 16 roles can be defined per document",
    source: "moneyworks_names_roles.html",
    constraint: "16 roles maximum"
  },
  {
    rule: "Role Name Length",
    description: "Role names cannot exceed 15 characters",
    source: "moneyworks_names_roles.html", 
    constraint: "15 character maximum"
  },
  {
    rule: "Role Configuration Location",
    description: "Roles are defined in Edit→Document Preferences→Fields panel",
    source: "moneyworks_names_roles.html",
    constraint: "Document-level configuration"
  },
  {
    rule: "Role Assignment Interface",
    description: "Roles assigned via Role pop-up menu in contact interface",
    source: "moneyworks_names_roles.html",
    constraint: "UI-based assignment"
  },
  {
    rule: "Role Persistence Dependency",
    description: "Role changes only saved when Name record is saved",
    source: "moneyworks_names_roles.html",
    constraint: "Requires Name record save"
  },
  {
    rule: "Import Format",
    description: "Roles imported by specifying role 'index' as hex bit values",
    source: "moneyworks_names_roles.html",
    constraint: "Hexadecimal import format"
  },
  {
    rule: "Legacy Contact Compatibility",
    description: "contact1 and contact2 have assumed role bits #10000 and #20000",
    source: "moneyworks_names_roles.html",
    constraint: "Legacy compatibility requirement"
  },
  {
    rule: "Bit Field Storage",
    description: "Role membership stored as 16-bit field with bit flags",
    source: "moneyworks_names_roles.html",
    constraint: "16-bit storage limitation"
  }
] as const;

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  // Enumerations
  MoneyWorksContactRoles,
  MoneyWorksLegacyContactRoles,
  
  // Examples and References
  MONEYWORKS_ROLE_EXAMPLES,
  MONEYWORKS_CONTACT_ROLE_BUSINESS_RULES,
  MONEYWORKS_CONTACT_ROLE_FUNCTION_AVAILABILITY,
  
  // Utilities
  MoneyWorksContactRoleUtils
};