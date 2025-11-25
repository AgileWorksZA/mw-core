/**
 * MoneyWorks Accounts Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_accounts.html
 * Authority: MoneyWorks Manual - Accounts Field Descriptions
 * 
 * CRITICAL ARCHITECTURAL DISCOVERIES:
 * 1. COMPREHENSIVE CHART OF ACCOUNTS SYSTEM:
 *    - 26 canonical account fields covering complete financial account management
 *    - Universal account type system: IN, SA, EX, CS, CA, CL, FA, TA, TL, SF
 *    - System account types: Bank (BK), P&L (PL), Receivables (AR), Payables (AP), Tax (GR/GP)
 * 
 * 2. SOPHISTICATED ACCOUNT CLASSIFICATION:
 *    - Primary account types (Type field): 10 canonical types covering all financial scenarios
 *    - System account designations for special functionality
 *    - Category and Group hierarchical organization
 *    - Multi-currency account support
 * 
 * 3. ENTERPRISE BANKING INTEGRATION:
 *    - Bank account management with cheque number tracking
 *    - Statement import support with cut-off dates
 *    - Reconciliation capabilities
 *    - Multi-bank account support
 * 
 * 4. ADVANCED BUSINESS CONTROLS:
 *    - 6 account flags for operational behavior control
 *    - Security level access control
 *    - Job code requirements for detailed costing
 *    - Tax code integration for compliance
 * 
 * 5. COMPREHENSIVE RELATIONSHIP NETWORK:
 *    - Category → General Classifications (Kind='C')
 *    - Group → General Classifications (Kind='G')
 *    - PandL → Accounts.Code (self-reference for year-end transfer)
 *    - TaxCode → TaxRates for tax calculations
 * 
 * 6. UNIVERSAL BUSINESS APPLICABILITY:
 *    - Standard chart of accounts works across all industries
 *    - Flexible categorization for different business needs
 *    - Support for departmental and job costing
 *    - EBITDA classification for advanced reporting
 */

// ============================================================================
// CANONICAL MONEYWORKS ACCOUNT TYPES
// ============================================================================

/**
 * MoneyWorks canonical account type classification
 * Source: moneyworks_appendix_accounts.html - Type field
 */
export enum MoneyWorksAccountType {
  /** Income */
  INCOME = "IN",
  
  /** Sales */
  SALES = "SA",
  
  /** Expense */
  EXPENSE = "EX",
  
  /** Cost of Sales */
  COST_OF_SALES = "CS",
  
  /** Current Asset */
  CURRENT_ASSET = "CA",
  
  /** Current Liability */
  CURRENT_LIABILITY = "CL",
  
  /** Fixed Asset */
  FIXED_ASSET = "FA",
  
  /** Term Asset */
  TERM_ASSET = "TA",
  
  /** Term Liability */
  TERM_LIABILITY = "TL",
  
  /** Shareholder's Funds */
  SHAREHOLDERS_FUNDS = "SF"
}

/**
 * MoneyWorks canonical system account type classification
 * Source: moneyworks_appendix_accounts.html - System field
 */
export enum MoneyWorksSystemAccountType {
  /** Bank Account */
  BANK_ACCOUNT = "BK",
  
  /** Profit & Loss */
  PROFIT_LOSS = "PL",
  
  /** Accounts Receivable */
  ACCOUNTS_RECEIVABLE = "AR",
  
  /** Accounts Payable */
  ACCOUNTS_PAYABLE = "AP",
  
  /** GST Received */
  GST_RECEIVED = "GR",
  
  /** GST Paid */
  GST_PAID = "GP",
  
  /** Ordinary account type */
  ORDINARY = "  "
}

/**
 * MoneyWorks canonical EBITDA classification
 * Source: moneyworks_appendix_accounts.html - EBITDA field
 */
export enum MoneyWorksEBITDAType {
  /** Interest */
  INTEREST = "I",
  
  /** Tax */
  TAX = "T",
  
  /** Depreciation/Amortisation */
  DEPRECIATION = "D",
  
  /** Other (blank) */
  OTHER = ""
}

/**
 * MoneyWorks canonical account flags
 * Source: moneyworks_appendix_accounts.html - Account Flags table
 */
export enum MoneyWorksAccountFlags {
  /** Do not reconcile (bank) */
  DO_NOT_RECONCILE = 0x0001,
  
  /** Is an Unbanked Account */
  UNBANKED_ACCOUNT = 0x0002,
  
  /** Job Code Required */
  JOB_CODE_REQUIRED = 0x0004,
  
  /** Synchronise Cheque Numbers */
  SYNCHRONISE_CHEQUE_NUMBERS = 0x0010,
  
  /** Non Discountable */
  NON_DISCOUNTABLE = 0x0020,
  
  /** Non posting account */
  NON_POSTING_ACCOUNT = 0x8000
}

// ============================================================================
// CANONICAL MONEYWORKS ACCOUNT FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks account fields as defined in manual
 * Source: moneyworks_appendix_accounts.html - Accounts table
 */
export const MONEYWORKS_ACCOUNT_FIELDS = [
  {
    fieldName: "AccountantCode",
    dataType: "T" as const,
    maxLength: 9,
    canonicalDescription: "Code in accountant's chart that corresponds to this account.",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "external mapping",
    relationshipRule: "Maps to external accountant's chart of accounts"
  },
  {
    fieldName: "BankAccountNumber",
    dataType: "T" as const,
    maxLength: 23,
    canonicalDescription: "For bank accounts, the number of the bank account.",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "banking system",
    relationshipRule: "Bank account identification for system accounts"
  },
  {
    fieldName: "Category",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The category code for the account (blank if Category is None).",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "General.Code",
    relationshipRule: "References General Classifications with Kind='C' for account categorization"
  },
  {
    fieldName: "Category2",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "user categorization",
    relationshipRule: "User-defined category field for custom classification"
  },
  {
    fieldName: "Category3",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "user categorization",
    relationshipRule: "User-defined category field for custom classification"
  },
  {
    fieldName: "Category4",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "user categorization",
    relationshipRule: "User-defined category field for custom classification"
  },
  {
    fieldName: "Code",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The account code",
    manualSource: "moneyworks_appendix_accounts.html",
    isRequired: true,
    isIndexed: true,
    relationshipTarget: "unique identifier",
    relationshipRule: "Primary key for account entity, referenced by transactions"
  },
  {
    fieldName: "Colour",
    dataType: "N" as const,
    canonicalDescription: "The colour, represented internally as a numeric index in the range 0-7 but rendered as a textual colour name",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "visual identification",
    relationshipRule: "Visual categorization using predefined colour palette"
  },
  {
    fieldName: "Comments",
    dataType: "T" as const,
    maxLength: 1020,
    canonicalDescription: "For own use",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "user notes",
    relationshipRule: "User-defined notes and comments for account"
  },
  {
    fieldName: "Created",
    dataType: "S" as const,
    canonicalDescription: "The date/time on which the account was created.",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "audit trail",
    relationshipRule: "Automatic timestamp of account creation for audit trail"
  },
  {
    fieldName: "Currency",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "The currency code (empty for local currency accounts)",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "currency system",
    relationshipRule: "Multi-currency account support, empty for base currency"
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 39,
    canonicalDescription: "Description shown in transaction entry and reports",
    manualSource: "moneyworks_appendix_accounts.html",
    isRequired: true,
    relationshipTarget: "user interface",
    relationshipRule: "Human-readable account name for transactions and reports"
  },
  {
    fieldName: "EBITDA",
    dataType: "T" as const,
    maxLength: 1,
    canonicalDescription: "Tag to specify EBITDA status of account for reporting (\"I\" for Interest, \"T\" for Tax, \"D\" for Depreciation/Amortisation, otherwise blank)",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "MoneyWorksEBITDAType",
    relationshipRule: "EBITDA classification for advanced financial reporting"
  },
  {
    fieldName: "Group",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The department group code for the account.",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "General.Code",
    relationshipRule: "References General Classifications with Kind='G' for departmental grouping"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this account was last changed. This means a change to the account record itself, not a change to the account balance.",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "audit trail",
    relationshipRule: "Automatic timestamp of last account modification"
  },
  {
    fieldName: "LastStatementImport",
    dataType: "D" as const,
    canonicalDescription: "Last bank statement import cut-off date",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "bank statement processing",
    relationshipRule: "Tracks last bank statement import for reconciliation"
  },
  {
    fieldName: "ManualChequeNumber",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "Next manual cheque number (for bank accounts)",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "cheque management",
    relationshipRule: "Sequential cheque numbering for manual cheques"
  },
  {
    fieldName: "PandL",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The Profit and Loss account.",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "Accounts.Code",
    relationshipRule: "Self-reference to P&L account for year-end transfer"
  },
  {
    fieldName: "PrintedChequeNumber",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "Next batch cheque number (for bank accounts)",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "cheque management",
    relationshipRule: "Sequential cheque numbering for printed cheques"
  },
  {
    fieldName: "SecurityLevel",
    dataType: "N" as const,
    canonicalDescription: "The security level for the account",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "security system",
    relationshipRule: "Access control level for account visibility and modification"
  },
  {
    fieldName: "System",
    dataType: "A" as const,
    maxLength: 2,
    canonicalDescription: "The \"system\" account type. The account types Bank Account, Profit & Loss, Accounts Receivable, Accounts Payable, GST Received and GST Paid are special system account types. Accounts of these types contain the codes: \"BK\", \"PL\", \"AR\", \"AP\", \"GR\", or \"GP\" (respectively) in the System field. Ordinary account types have \"  \" (2 spaces) in the System field.",
    manualSource: "moneyworks_appendix_accounts.html",
    isRequired: true,
    relationshipTarget: "MoneyWorksSystemAccountType",
    relationshipRule: "System account designation for special MoneyWorks functionality"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable data storage for custom applications"
  },
  {
    fieldName: "TaxCode",
    dataType: "A" as const,
    maxLength: 3,
    canonicalDescription: "The tax code for the account.",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "TaxRates.TaxCode",
    relationshipRule: "Default tax rate for transactions using this account"
  },
  {
    fieldName: "Type",
    dataType: "A" as const,
    maxLength: 2,
    canonicalDescription: "The account type. This will be one of IN, SA, EX, CS, CA, CL, FA, TA, TL or SF for Income, Sales, Expense, Cost of Sales, Current Asset, Current Liability, Fixed Asset, Term Asset, Term Liability or Shareholder's Funds respectively.",
    manualSource: "moneyworks_appendix_accounts.html",
    isRequired: true,
    relationshipTarget: "MoneyWorksAccountType",
    relationshipRule: "Primary account classification for financial reporting"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "Scriptable number",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable numeric data storage"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_accounts.html",
    relationshipTarget: "scripting system",
    relationshipRule: "Scriptable text data storage"
  },
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique record identifier for FK references",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "Flags",
    dataType: "N" as const,
    canonicalDescription: "Account flags bitfield",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "BalanceLimit",
    dataType: "N" as const,
    canonicalDescription: "Overdraft or balance limit for bank accounts",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "ManualChequeNumDigits",
    dataType: "N" as const,
    canonicalDescription: "Number of digits in manual cheque numbers",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "PrintedChequeNumDigits",
    dataType: "N" as const,
    canonicalDescription: "Number of digits in printed cheque numbers",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "FeedID",
    dataType: "T" as const,
    maxLength: 100,
    canonicalDescription: "Bank feed integration identifier",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "Cashflow",
    dataType: "T" as const,
    maxLength: 10,
    canonicalDescription: "Cashflow statement category code",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "Cashforecast",
    dataType: "T" as const,
    maxLength: 10,
    canonicalDescription: "Cash forecast category code",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "ImportFormat",
    dataType: "T" as const,
    maxLength: 50,
    canonicalDescription: "Bank statement import format specification",
    manualSource: "Empirical API validation",
    isRequired: false
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS ACCOUNT TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical account type definitions with manual explanations
 */
export interface MoneyWorksAccountTypeDefinition {
  type: MoneyWorksAccountType;
  canonicalName: string;
  moneyWorksDescription: string;
  manualSource: string;
  businessContext: string;
  universalApplicability: string[];
  financialStatementSection: string;
}

export const MONEYWORKS_ACCOUNT_TYPE_DEFINITIONS: MoneyWorksAccountTypeDefinition[] = [
  {
    type: MoneyWorksAccountType.INCOME,
    canonicalName: "Income",
    moneyWorksDescription: "Income",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Non-operating income and other income sources",
    universalApplicability: ["consulting", "legal", "medical", "manufacturing", "retail"],
    financialStatementSection: "Income Statement - Other Income"
  },
  {
    type: MoneyWorksAccountType.SALES,
    canonicalName: "Sales",
    moneyWorksDescription: "Sales",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Primary revenue from goods and services sold",
    universalApplicability: ["restaurant", "retail", "manufacturing", "medical", "services"],
    financialStatementSection: "Income Statement - Revenue"
  },
  {
    type: MoneyWorksAccountType.EXPENSE,
    canonicalName: "Expense",
    moneyWorksDescription: "Expense",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Operating expenses and administrative costs",
    universalApplicability: ["all business types"],
    financialStatementSection: "Income Statement - Operating Expenses"
  },
  {
    type: MoneyWorksAccountType.COST_OF_SALES,
    canonicalName: "Cost of Sales",
    moneyWorksDescription: "Cost of Sales",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Direct costs associated with producing goods or services sold",
    universalApplicability: ["restaurant", "retail", "manufacturing", "medical"],
    financialStatementSection: "Income Statement - Cost of Goods Sold"
  },
  {
    type: MoneyWorksAccountType.CURRENT_ASSET,
    canonicalName: "Current Asset",
    moneyWorksDescription: "Current Asset",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Assets expected to be converted to cash within one year",
    universalApplicability: ["all business types"],
    financialStatementSection: "Balance Sheet - Current Assets"
  },
  {
    type: MoneyWorksAccountType.CURRENT_LIABILITY,
    canonicalName: "Current Liability",
    moneyWorksDescription: "Current Liability",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Debts and obligations due within one year",
    universalApplicability: ["all business types"],
    financialStatementSection: "Balance Sheet - Current Liabilities"
  },
  {
    type: MoneyWorksAccountType.FIXED_ASSET,
    canonicalName: "Fixed Asset",
    moneyWorksDescription: "Fixed Asset",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Long-term assets used in business operations",
    universalApplicability: ["consulting", "legal", "medical", "manufacturing", "retail"],
    financialStatementSection: "Balance Sheet - Fixed Assets"
  },
  {
    type: MoneyWorksAccountType.TERM_ASSET,
    canonicalName: "Term Asset",
    moneyWorksDescription: "Term Asset",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Long-term investments and term deposits",
    universalApplicability: ["all business types"],
    financialStatementSection: "Balance Sheet - Long-term Assets"
  },
  {
    type: MoneyWorksAccountType.TERM_LIABILITY,
    canonicalName: "Term Liability",
    moneyWorksDescription: "Term Liability",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Long-term debts and obligations due after one year",
    universalApplicability: ["all business types"],
    financialStatementSection: "Balance Sheet - Long-term Liabilities"
  },
  {
    type: MoneyWorksAccountType.SHAREHOLDERS_FUNDS,
    canonicalName: "Shareholder's Funds",
    moneyWorksDescription: "Shareholder's Funds",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Owner's equity, capital, and retained earnings",
    universalApplicability: ["all business types"],
    financialStatementSection: "Balance Sheet - Equity"
  }
];

/**
 * MoneyWorks canonical system account type definitions with manual explanations
 */
export interface MoneyWorksSystemAccountTypeDefinition {
  type: MoneyWorksSystemAccountType;
  canonicalName: string;
  moneyWorksDescription: string;
  manualSource: string;
  businessContext: string;
  systemFunctionality: string;
}

export const MONEYWORKS_SYSTEM_ACCOUNT_TYPE_DEFINITIONS: MoneyWorksSystemAccountTypeDefinition[] = [
  {
    type: MoneyWorksSystemAccountType.BANK_ACCOUNT,
    canonicalName: "Bank Account",
    moneyWorksDescription: "Bank Account (BK)",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Bank accounts for cash management and reconciliation",
    systemFunctionality: "Enables bank reconciliation, cheque management, and statement import"
  },
  {
    type: MoneyWorksSystemAccountType.PROFIT_LOSS,
    canonicalName: "Profit & Loss",
    moneyWorksDescription: "Profit & Loss (PL)",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Year-end profit and loss transfer account",
    systemFunctionality: "Automatic year-end transfer destination for income and expense accounts"
  },
  {
    type: MoneyWorksSystemAccountType.ACCOUNTS_RECEIVABLE,
    canonicalName: "Accounts Receivable",
    moneyWorksDescription: "Accounts Receivable (AR)",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Control account for debtor transactions",
    systemFunctionality: "Automatic posting for debtor invoices and receipts"
  },
  {
    type: MoneyWorksSystemAccountType.ACCOUNTS_PAYABLE,
    canonicalName: "Accounts Payable",
    moneyWorksDescription: "Accounts Payable (AP)",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Control account for creditor transactions",
    systemFunctionality: "Automatic posting for creditor invoices and payments"
  },
  {
    type: MoneyWorksSystemAccountType.GST_RECEIVED,
    canonicalName: "GST Received",
    moneyWorksDescription: "GST Received (GR)",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Tax collected on sales transactions",
    systemFunctionality: "Automatic GST/VAT collection tracking for tax reporting"
  },
  {
    type: MoneyWorksSystemAccountType.GST_PAID,
    canonicalName: "GST Paid",
    moneyWorksDescription: "GST Paid (GP)",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Tax paid on purchase transactions",
    systemFunctionality: "Automatic GST/VAT payment tracking for tax reporting"
  },
  {
    type: MoneyWorksSystemAccountType.ORDINARY,
    canonicalName: "Ordinary Account",
    moneyWorksDescription: "Ordinary account type (  )",
    manualSource: "moneyworks_appendix_accounts.html",
    businessContext: "Standard accounts without special system functionality",
    systemFunctionality: "Regular account behavior without automatic posting rules"
  }
];

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate canonical MoneyWorks account type
 */
export function validateAccountTypeCanonical(type: string): {
  isValid: boolean;
  canonicalType?: MoneyWorksAccountType;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const validTypes = Object.values(MoneyWorksAccountType);
  if (!validTypes.includes(type as MoneyWorksAccountType)) {
    warnings.push(`Invalid account type ${type}. MoneyWorks canonical types: ${validTypes.join(', ')}`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalType: type as MoneyWorksAccountType,
    warnings
  };
}

/**
 * Validate canonical MoneyWorks system account type
 */
export function validateSystemAccountTypeCanonical(system: string): {
  isValid: boolean;
  canonicalSystemType?: MoneyWorksSystemAccountType;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const validSystemTypes = Object.values(MoneyWorksSystemAccountType);
  if (!validSystemTypes.includes(system as MoneyWorksSystemAccountType)) {
    warnings.push(`Invalid system account type ${system}. MoneyWorks canonical system types: ${validSystemTypes.join(', ')}`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalSystemType: system as MoneyWorksSystemAccountType,
    warnings
  };
}

/**
 * Get canonical MoneyWorks account type explanation
 */
export function getCanonicalAccountTypeExplanation(type: MoneyWorksAccountType): string {
  const typeDef = MONEYWORKS_ACCOUNT_TYPE_DEFINITIONS.find(def => def.type === type);
  if (!typeDef) {
    return `Unknown account type: ${type}`;
  }
  
  return `${typeDef.canonicalName}: ${typeDef.businessContext}. Financial Statement: ${typeDef.financialStatementSection}. Universal applicability: ${typeDef.universalApplicability.join(', ')}`;
}

/**
 * Get canonical MoneyWorks system account type explanation
 */
export function getCanonicalSystemAccountTypeExplanation(systemType: MoneyWorksSystemAccountType): string {
  const systemDef = MONEYWORKS_SYSTEM_ACCOUNT_TYPE_DEFINITIONS.find(def => def.type === systemType);
  if (!systemDef) {
    return `Unknown system account type: ${systemType}`;
  }
  
  return `${systemDef.canonicalName}: ${systemDef.businessContext}. System Functionality: ${systemDef.systemFunctionality}`;
}

/**
 * Determine if account is a balance sheet account
 */
export function isCanonicalBalanceSheetAccount(type: MoneyWorksAccountType): boolean {
  return [
    MoneyWorksAccountType.CURRENT_ASSET,
    MoneyWorksAccountType.FIXED_ASSET,
    MoneyWorksAccountType.TERM_ASSET,
    MoneyWorksAccountType.CURRENT_LIABILITY,
    MoneyWorksAccountType.TERM_LIABILITY,
    MoneyWorksAccountType.SHAREHOLDERS_FUNDS
  ].includes(type);
}

/**
 * Determine if account is an income statement account
 */
export function isCanonicalIncomeStatementAccount(type: MoneyWorksAccountType): boolean {
  return [
    MoneyWorksAccountType.INCOME,
    MoneyWorksAccountType.SALES,
    MoneyWorksAccountType.EXPENSE,
    MoneyWorksAccountType.COST_OF_SALES
  ].includes(type);
}

/**
 * Determine if account is an asset account
 */
export function isCanonicalAssetAccount(type: MoneyWorksAccountType): boolean {
  return [
    MoneyWorksAccountType.CURRENT_ASSET,
    MoneyWorksAccountType.FIXED_ASSET,
    MoneyWorksAccountType.TERM_ASSET
  ].includes(type);
}

/**
 * Determine if account is a liability account
 */
export function isCanonicalLiabilityAccount(type: MoneyWorksAccountType): boolean {
  return [
    MoneyWorksAccountType.CURRENT_LIABILITY,
    MoneyWorksAccountType.TERM_LIABILITY
  ].includes(type);
}

/**
 * Determine if account increases with debits
 */
export function increasesWithDebits(type: MoneyWorksAccountType): boolean {
  // Assets and Expenses increase with debits
  return isCanonicalAssetAccount(type) || 
         type === MoneyWorksAccountType.EXPENSE || 
         type === MoneyWorksAccountType.COST_OF_SALES;
}

/**
 * Determine if account increases with credits
 */
export function increasesWithCredits(type: MoneyWorksAccountType): boolean {
  // Liabilities, Equity, and Income increase with credits
  return isCanonicalLiabilityAccount(type) || 
         type === MoneyWorksAccountType.SHAREHOLDERS_FUNDS ||
         type === MoneyWorksAccountType.INCOME ||
         type === MoneyWorksAccountType.SALES;
}

/**
 * Get canonical account normal balance side
 */
export function getCanonicalAccountNormalBalance(type: MoneyWorksAccountType): 'debit' | 'credit' {
  return increasesWithDebits(type) ? 'debit' : 'credit';
}

/**
 * Get canonical financial statement section
 */
export function getCanonicalFinancialStatementSection(type: MoneyWorksAccountType): string {
  const typeDef = MONEYWORKS_ACCOUNT_TYPE_DEFINITIONS.find(def => def.type === type);
  return typeDef ? typeDef.financialStatementSection : 'Unknown';
}

/**
 * Validate account flag using TestFlags pattern
 */
export function testAccountFlag(flags: number, flag: MoneyWorksAccountFlags): boolean {
  return (flags & flag) !== 0;
}

/**
 * Get all set account flags
 */
export function getSetAccountFlags(flags: number): MoneyWorksAccountFlags[] {
  const setFlags: MoneyWorksAccountFlags[] = [];
  
  for (const flag of Object.values(MoneyWorksAccountFlags)) {
    if (typeof flag === 'number' && testAccountFlag(flags, flag)) {
      setFlags.push(flag);
    }
  }
  
  return setFlags;
}

/**
 * Get account flag descriptions
 */
export function getAccountFlagDescriptions(flags: number): string[] {
  const descriptions: string[] = [];
  
  if (testAccountFlag(flags, MoneyWorksAccountFlags.DO_NOT_RECONCILE)) {
    descriptions.push("Do not reconcile (bank)");
  }
  if (testAccountFlag(flags, MoneyWorksAccountFlags.UNBANKED_ACCOUNT)) {
    descriptions.push("Is an Unbanked Account");
  }
  if (testAccountFlag(flags, MoneyWorksAccountFlags.JOB_CODE_REQUIRED)) {
    descriptions.push("Job Code Required");
  }
  if (testAccountFlag(flags, MoneyWorksAccountFlags.SYNCHRONISE_CHEQUE_NUMBERS)) {
    descriptions.push("Synchronise Cheque Numbers");
  }
  if (testAccountFlag(flags, MoneyWorksAccountFlags.NON_DISCOUNTABLE)) {
    descriptions.push("Non Discountable");
  }
  if (testAccountFlag(flags, MoneyWorksAccountFlags.NON_POSTING_ACCOUNT)) {
    descriptions.push("Non posting account");
  }
  
  return descriptions;
}

export default {
  MONEYWORKS_ACCOUNT_TYPE_DEFINITIONS,
  MONEYWORKS_SYSTEM_ACCOUNT_TYPE_DEFINITIONS,
  MONEYWORKS_ACCOUNT_FIELDS,
  MoneyWorksAccountType,
  MoneyWorksSystemAccountType,
  MoneyWorksEBITDAType,
  MoneyWorksAccountFlags
};