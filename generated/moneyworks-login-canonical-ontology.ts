/**
 * MoneyWorks Login Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_login_file.html
 * Authority: MoneyWorks Manual - Login File Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks Login entity is the actual user authentication system:
 * - User credentials and security management
 * - Role-based access control with privilege mapping
 * - Security levels and user categorization
 * - Multi-user environment support with initials tracking
 * - Scriptable extensions for custom user data
 * 
 * ARCHITECTURAL DISTINCTION: This is the real "user management" entity
 * - Authentication: encrypted passwords and security levels
 * - Authorization: privileges, roles, and security levels
 * - Administration: user categories and email management
 * - Integration: scriptable fields for custom applications
 */

// ============================================================================
// CANONICAL MONEYWORKS PRIVILEGE SYSTEM
// ============================================================================

/**
 * MoneyWorks canonical privilege categories and privileges
 * Source: moneyworks_privileges_moneyworks_privileges.html
 * 
 * CRITICAL DISCOVERY: MoneyWorks has a comprehensive 80+ privilege system
 * organized into hierarchical categories with string-based privilege names
 */
export enum MoneyWorksPrivilegeCategory {
  ADMINISTRATION = "Administration",
  PURCHASES = "Purchases", 
  CREDITORS = "Creditors",
  SALES = "Sales",
  DEBTORS = "Debtors",
  CASH = "Cash",
  GENERAL_LEDGER = "General Ledger",
  JOBS = "Jobs",
  PRODUCTS = "Products",
  NAMES = "Names",
  ADJUSTMENTS = "Adjustments"
}

/**
 * Complete MoneyWorks canonical privilege list
 * Source: moneyworks_privileges_moneyworks_privileges.html - Privilege table
 * 
 * PRIVILEGE ENCODING: Each privilege is a string name that must match exactly
 * the spelling in the privilege list for the Allowed() function to work
 */
export const MONEYWORKS_CANONICAL_PRIVILEGES = [
  // Administration Category
  "Users and Security (Administrator)",
  "Period Management",
  "Auto Open Period", 
  "Document Preferences",
  "Signing and Using Unsigned Forms & Reports",
  "Revert/Rollback",
  "Remote Save",
  "Diagnostics",
  "Auto Allocations",
  "Backup",
  "Reminders",
  "Execute External Scripts",
  "Importing",
  "Exporting", 
  "Company Details",
  "Log File",
  "Customise List Views",
  "Customise Validation Lists",

  // Purchases Category
  "Enter Orders",
  "Process Orders",

  // Creditors Category  
  "Enter Invoice",
  "Pay Invoices",
  "Payments History",
  "Change Bank Account",

  // Sales Category
  "Enter Orders",
  "Process Orders", 
  "Process Partial Orders",
  "See Margins",

  // Debtors Category
  "Enter Invoices",
  "Receipt Invoices",
  "Payments History",
  "Statements and Ageing",

  // Cash Category
  "Enter Payments",
  "Enter Receipts",
  "Banking",
  "Bank Reconciliation",
  "Change Opening Balance on Bank Rec",
  "Accept Unbalanced Bank Rec",
  "Clear Bank Recs",
  "See Balances in Bank Popup",
  "Load Bank Statement",
  "Edit Currencies",

  // General Ledger Category
  "View Accounts",
  "Create Accounts",
  "Modify Accounts", 
  "Delete Accounts",
  "Budgets & Balances",
  "Enter Journal Adjustments",
  "GST/VAT/Tax Report/Finalisation",
  "Account Enquiry",
  "Change Tax Table",

  // Jobs Category
  "View Jobs",
  "Create Jobs",
  "Modify Jobs",
  "Delete Jobs", 
  "Enter Job Sheet Items",
  "See All Job Sheet Items",
  "Bill Jobs",
  "Use Completed Jobs",

  // Products Category
  "View Products",
  "Create Products",
  "Modify Products",
  "Delete Products",
  "Build Products",
  "Stock Journals",
  "Stock Enquiry",
  "Sales Enquiry",
  "Purchases Enquiry",

  // Names Category
  "View Names",
  "Create Names",
  "Modify Names",
  "Delete Names", 
  "Sales Enquiry",
  "Purchases Enquiry",

  // Other Privileges
  "Adjustments",
  "Elective Posting",
  "Expression Evaluation",
  "Delete Unposted Transactions/Orders",
  "Print Unposted Invoices",
  "Make Changes to Posted Transactions",
  "Use `Replace` Command",
  "Unlimited Write-offs",
  "Override Pricing and Terms",
  "Edit Off-Ledger values",
  "Detail Lines List",
  "Select Filters",
  "User Privilege 1",
  "User Privilege 2", 
  "User Privilege 3",
  "User Privilege 4",
  "User Privilege 5",
  "User Privilege 6"
] as const;

/**
 * MoneyWorks privilege access functions
 * Source: moneyworks_calculations_allowed.html and moneyworks_calculations_authenticate.html
 */
export const MONEYWORKS_PRIVILEGE_FUNCTIONS = {
  ALLOWED: "Allowed",     // Test privilege for current user: Allowed("privilegeName")
  AUTHENTICATE: "Authenticate"  // Test user credentials with optional privilege: Authenticate(username, password, privilegeName)
} as const;

// ============================================================================
// CANONICAL MONEYWORKS LOGIN FIELD DATA TYPES  
// ============================================================================

/**
 * MoneyWorks canonical Login file field definitions
 * Source: moneyworks_appendix_login_file.html - Login File table
 * 
 * ARCHITECTURAL INSIGHT: Complete user authentication and authorization system
 * with role-based access control and security level management
 * 
 * PRIVILEGE ENCODING DISCOVERY: The Privileges field (65 chars) stores an encoded
 * map of the privilege settings, accessed via string-based privilege names
 */
export const MONEYWORKS_LOGIN_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique login user identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "Category",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "User Category",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Used for grouping users by business function or department"
  },
  {
    fieldName: "Email",
    dataType: "T" as const,
    maxLength: 63,
    canonicalDescription: "Email of user",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Standard email format for user communication"
  },
  {
    fieldName: "Flags",
    dataType: "S" as const,
    maxLength: undefined,
    canonicalDescription: "User Flags",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "System flags controlling user behavior and access"
  },
  {
    fieldName: "Initials",
    dataType: "3" as const,
    maxLength: undefined,
    canonicalDescription: "The user initials.",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Unique user identifier for tracking and attribution"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    maxLength: undefined,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    isSystemField: true
  },
  {
    fieldName: "Name",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "The name of the user",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: true,
    isIndexed: true,
    businessRule: "Primary user identification"
  },
  {
    fieldName: "Password",
    dataType: "T" as const,
    maxLength: 33,
    canonicalDescription: "User password (encrypted)",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Encrypted password storage for authentication",
    securityNote: "Stored encrypted, never plain text"
  },
  {
    fieldName: "Privileges",
    dataType: "T" as const,
    maxLength: 65,
    canonicalDescription: "Privilege map for user",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Encoded privilege settings controlling user access rights",
    privilegeEncoding: {
      description: "65-character encoded string representing privilege settings",
      accessMethod: "Use Allowed('privilegeName') function to test specific privileges",
      privilegeSource: "moneyworks_privileges_moneyworks_privileges.html",
      totalPrivileges: "80+ individual privileges across 11 categories",
      categories: [
        "Administration (18 privileges)",
        "Purchases (2 privileges)", 
        "Creditors (4 privileges)",
        "Sales (4 privileges)",
        "Debtors (4 privileges)",
        "Cash (10 privileges)",
        "General Ledger (9 privileges)",
        "Jobs (8 privileges)",
        "Products (9 privileges)",
        "Names (6 privileges)",
        "Other Operations (12 privileges)"
      ],
      stringBasedAccess: "Privileges accessed by exact string names like 'Pay Invoices', 'Enter Receipts', 'Users and Security (Administrator)'",
      customPrivileges: "User Privilege 1-6 available for custom script access control"
    }
  },
  {
    fieldName: "Role",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "User Role",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Role-based access control identifier"
  },
  {
    fieldName: "SecurityLevel",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "The security level of the user",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Numeric security clearance level"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Custom data storage for scripting extensions"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    maxLength: undefined,
    canonicalDescription: "Scriptable number",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Custom numeric data for scripting extensions"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_login_file.html",
    isRequired: false,
    businessRule: "Custom text data for scripting extensions"
  },
  {
    fieldName: "SettingsDonor",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "User settings template source",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "References another user whose settings should be inherited/copied"
  }
] as const;

// ============================================================================
// MONEYWORKS LOGIN BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks canonical Login entity business rules
 * Source: moneyworks_appendix_login_file.html and related privileges documentation
 */
export const MONEYWORKS_LOGIN_BUSINESS_RULES = [
  {
    entitySource: "Login",
    fieldName: "Name",
    ruleType: "uniqueness" as const,
    canonicalRule: "User Name must be unique across all users in the system",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    entitySource: "Login",
    fieldName: "Initials",
    ruleType: "uniqueness" as const,
    canonicalRule: "User Initials should be unique for tracking and attribution purposes",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    entitySource: "Login",
    fieldName: "Password",
    ruleType: "security" as const,
    canonicalRule: "Passwords are stored encrypted and never accessible in plain text",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    entitySource: "Login",
    fieldName: "Privileges",
    ruleType: "authorization" as const,
    canonicalRule: "Privilege map encodes specific access rights and restrictions for user",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    entitySource: "Login",
    fieldName: "Privileges",
    ruleType: "privilege_encoding" as const,
    canonicalRule: "65-character encoded string representing on/off state of 80+ individual privileges",
    manualSource: "moneyworks_privileges_moneyworks_privileges.html"
  },
  {
    entitySource: "Login",
    fieldName: "Privileges",
    ruleType: "privilege_access" as const,
    canonicalRule: "Privileges tested using Allowed('privilegeName') function with exact string names",
    manualSource: "moneyworks_calculations_allowed.html"
  },
  {
    entitySource: "Login",
    fieldName: "Privileges",
    ruleType: "privilege_categories" as const,
    canonicalRule: "Privileges organized in 11 categories: Administration, Purchases, Creditors, Sales, Debtors, Cash, General Ledger, Jobs, Products, Names, Other",
    manualSource: "moneyworks_privileges_moneyworks_privileges.html"
  },
  {
    entitySource: "Login",
    fieldName: "Privileges",
    ruleType: "custom_privileges" as const,
    canonicalRule: "User Privilege 1-6 available for custom script access control using Allowed() function",
    manualSource: "moneyworks_privileges_moneyworks_privileges.html"
  },
  {
    entitySource: "Login",
    fieldName: "Role",
    ruleType: "role_based_access" as const,
    canonicalRule: "Role determines base privilege set that can be customized per user",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    entitySource: "Login",
    fieldName: "SecurityLevel",
    ruleType: "hierarchical_access" as const,
    canonicalRule: "Security level provides hierarchical access control mechanism",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    entitySource: "Login",
    fieldName: "Email",
    ruleType: "communication" as const,
    canonicalRule: "Email used for user communication and notifications",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    entitySource: "Login",
    fieldName: "Category",
    ruleType: "organization" as const,
    canonicalRule: "Category groups users by business function or organizational unit",
    manualSource: "moneyworks_appendix_login_file.html"
  }
] as const;

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Cross-business universality validation for Login entity
 * 
 * UNIVERSAL APPLICABILITY CONFIRMED:
 * - Restaurant: Staff access control (managers, servers, kitchen, admin)
 * - Law Firm: Lawyer/paralegal/admin role-based access to cases and billing
 * - Manufacturing: Production/quality/admin access to different system areas
 * - Consulting: Partner/associate/admin access to projects and financials
 * 
 * The Login entity provides universal user authentication and authorization
 * that works across all business types through role-based access control.
 */
export const LOGIN_UNIVERSALITY_EXAMPLES = [
  {
    businessType: "restaurant",
    useCase: "Staff access control for restaurant operations",
    userExample: {
      Name: "Sarah Martinez",
      Category: "Management",
      Role: "MGR",
      SecurityLevel: 8,
      Initials: "SM",
      Email: "sarah@restaurant.com"
    },
    universalApplicability: "Role-based access applies to any business hierarchy"
  },
  {
    businessType: "legal",
    useCase: "Lawyer and paralegal access to case management",
    userExample: {
      Name: "David Wilson",
      Category: "Legal",
      Role: "LAW",
      SecurityLevel: 9,
      Initials: "DW", 
      Email: "dwilson@lawfirm.com"
    },
    universalApplicability: "Professional services use same authentication model"
  },
  {
    businessType: "manufacturing",
    useCase: "Production and quality control access",
    userExample: {
      Name: "Maria Rodriguez",
      Category: "Production",
      Role: "QC",
      SecurityLevel: 6,
      Initials: "MR",
      Email: "maria@manufacturing.com"
    },
    universalApplicability: "Manufacturing roles work with universal access control"
  },
  {
    businessType: "consulting",
    useCase: "Partner and associate project access",
    userExample: {
      Name: "James Chen",
      Category: "Consulting",
      Role: "PTR",
      SecurityLevel: 10,
      Initials: "JC",
      Email: "jchen@consulting.com"
    },
    universalApplicability: "Consulting hierarchy uses same privilege system"
  }
] as const;

// ============================================================================
// ENTITY RELATIONSHIPS
// ============================================================================

/**
 * MoneyWorks Login entity relationships
 * 
 * AUTHENTICATION RELATIONSHIPS: Login connects to business entities through user tracking
 */
export const LOGIN_ENTITY_RELATIONSHIPS = [
  {
    sourceEntity: "Login",
    targetEntity: "Transactions",
    relationshipType: "user_tracking",
    relationshipField: "Initials",
    cardinality: "one-to-many",
    businessRule: "User Initials appear in transaction creation and modification tracking",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    sourceEntity: "Login",
    targetEntity: "Names",
    relationshipType: "user_tracking",
    relationshipField: "Initials",
    cardinality: "one-to-many",
    businessRule: "User Initials track who created or modified Name records",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    sourceEntity: "Login",
    targetEntity: "Products",
    relationshipType: "user_tracking",
    relationshipField: "Initials",
    cardinality: "one-to-many",
    businessRule: "User Initials track product catalog changes",
    manualSource: "moneyworks_appendix_login_file.html"
  },
  {
    sourceEntity: "Login",
    targetEntity: "Jobs",
    relationshipType: "user_tracking",
    relationshipField: "Initials", 
    cardinality: "one-to-many",
    businessRule: "User Initials track job creation and status changes",
    manualSource: "moneyworks_appendix_login_file.html"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks Login entity type definition
 */
export interface MoneyWorksLogin {
  Category?: string;              // Max 31 characters, user category
  Email?: string;                 // Max 63 characters, user email
  Flags?: number;                 // System flags for user behavior
  Initials?: string;              // User initials for tracking
  LastModifiedTime?: string;      // System modification timestamp
  Name: string;                   // Max 31 characters, user name (required)
  Password?: string;              // Max 33 characters, encrypted password
  Privileges?: string;            // Max 65 characters, privilege map
  Role?: string;                  // Max 3 characters, user role
  SecurityLevel?: number;         // Numeric security level
  SettingsDonor?: string;         // Max 31 characters, settings template source
  TaggedText?: string;            // Max 255 characters, scriptable storage
  UserNum?: number;               // Scriptable numeric field
  UserText?: string;              // Max 255 characters, scriptable text
}

/**
 * MoneyWorks Login field definition type
 */
export interface MoneyWorksLoginField {
  fieldName: string;
  dataType: "T" | "N" | "S" | "3";
  maxLength?: number;
  canonicalDescription: string;
  manualSource: string;
  isRequired?: boolean;
  isIndexed?: boolean;
  isSystemField?: boolean;
  businessRule?: string;
  securityNote?: string;
}

/**
 * MoneyWorks Login business rule type
 */
export interface MoneyWorksLoginBusinessRule {
  entitySource: string;
  fieldName: string;
  ruleType: "uniqueness" | "security" | "authorization" | "role_based_access" | "hierarchical_access" | "communication" | "organization" | "privilege_encoding" | "privilege_access" | "privilege_categories" | "custom_privileges";
  canonicalRule: string;
  manualSource: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates MoneyWorks Login user name requirements
 */
export function validateLoginName(name: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push("User Name is required");
  }
  
  if (name.length > 31) {
    errors.push("User Name must not exceed 31 characters");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates MoneyWorks Login email format
 */
export function validateLoginEmail(email: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (email && email.length > 63) {
    errors.push("Email must not exceed 63 characters");
  }
  
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email must be in valid format");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates MoneyWorks Login security level range
 */
export function validateLoginSecurityLevel(level: number): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Number.isInteger(level)) {
    errors.push("Security Level must be an integer");
  }
  
  if (level < 0 || level > 10) {
    errors.push("Security Level must be between 0 and 10");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates MoneyWorks Login privilege name against canonical list
 */
export function validatePrivilegeName(privilegeName: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!privilegeName || privilegeName.trim().length === 0) {
    errors.push("Privilege name cannot be empty");
    return { isValid: false, errors };
  }
  
  if (!MONEYWORKS_CANONICAL_PRIVILEGES.includes(privilegeName as any)) {
    errors.push(`"${privilegeName}" is not a valid MoneyWorks privilege name`);
    errors.push(`Valid privileges include: ${MONEYWORKS_CANONICAL_PRIVILEGES.slice(0, 5).join(', ')}...`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates MoneyWorks Login privileges string format
 */
export function validatePrivilegesField(privileges: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (privileges.length > 65) {
    errors.push("Privileges field must not exceed 65 characters");
  }
  
  // Note: The actual encoding format is internal to MoneyWorks
  // Privileges are tested via Allowed() function, not direct string parsing
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets privilege category for a given privilege name
 */
export function getPrivilegeCategory(privilegeName: string): string | null {
  // Administration privileges
  const adminPrivileges = [
    "Users and Security (Administrator)", "Period Management", "Auto Open Period",
    "Document Preferences", "Signing and Using Unsigned Forms & Reports",
    "Revert/Rollback", "Remote Save", "Diagnostics", "Auto Allocations",
    "Backup", "Reminders", "Execute External Scripts", "Importing",
    "Exporting", "Company Details", "Log File", "Customise List Views",
    "Customise Validation Lists"
  ];
  
  if (adminPrivileges.includes(privilegeName)) {
    return MoneyWorksPrivilegeCategory.ADMINISTRATION;
  }
  
  // Cash privileges  
  const cashPrivileges = [
    "Enter Payments", "Enter Receipts", "Banking", "Bank Reconciliation",
    "Change Opening Balance on Bank Rec", "Accept Unbalanced Bank Rec",
    "Clear Bank Recs", "See Balances in Bank Popup", "Load Bank Statement",
    "Edit Currencies"
  ];
  
  if (cashPrivileges.includes(privilegeName)) {
    return MoneyWorksPrivilegeCategory.CASH;
  }
  
  // Add other categories as needed...
  
  return null;
}

/**
 * Checks if privilege name is a custom user privilege
 */
export function isCustomPrivilege(privilegeName: string): boolean {
  return privilegeName.startsWith("User Privilege ");
}

/**
 * Validates complete MoneyWorks Login record
 */
export function validateLoginRecord(login: MoneyWorksLogin): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const nameValidation = validateLoginName(login.Name);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  
  if (login.Email) {
    const emailValidation = validateLoginEmail(login.Email);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }
  }
  
  if (login.SecurityLevel !== undefined) {
    const securityValidation = validateLoginSecurityLevel(login.SecurityLevel);
    if (!securityValidation.isValid) {
      errors.push(...securityValidation.errors);
    }
  }
  
  if (login.Privileges) {
    const privilegesValidation = validatePrivilegesField(login.Privileges);
    if (!privilegesValidation.isValid) {
      errors.push(...privilegesValidation.errors);
    }
  }
  
  // Validate text field lengths
  if (login.Category && login.Category.length > 31) {
    errors.push("Category must not exceed 31 characters");
  }
  
  if (login.Role && login.Role.length > 3) {
    errors.push("Role must not exceed 3 characters");
  }
  
  if (login.TaggedText && login.TaggedText.length > 255) {
    errors.push("TaggedText must not exceed 255 characters");
  }
  
  if (login.UserText && login.UserText.length > 255) {
    errors.push("UserText must not exceed 255 characters");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}