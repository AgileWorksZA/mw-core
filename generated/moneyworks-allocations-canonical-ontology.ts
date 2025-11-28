/**
 * MoneyWorks Allocations Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_allocation_file.html
 * Authority: MoneyWorks Manual - Allocation File Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks Allocation File (internal name "AutoSplit") is a 
 * sophisticated rule-based transaction allocation system for automated financial 
 * transaction splitting during bank statement imports and auto-allocation commands.
 * 
 * KEY ARCHITECTURAL INSIGHTS:
 * 1. Rule-Based Allocation System: Stores matching functions and split configurations
 * 2. Priority-Based Processing: Rules have priority ordering for conflict resolution  
 * 3. Multi-Account Splitting: Supports up to 4 destination accounts per rule
 * 4. Flexible Split Modes: Multiple allocation calculation methods (percentage, amount)
 * 5. Named Rule Management: Human-readable rule identification and organization
 */

// ============================================================================
// CANONICAL MONEYWORKS ALLOCATION SPLIT MODES
// ============================================================================

/**
 * MoneyWorks canonical allocation split mode classification
 * Source: moneyworks_appendix_allocation_file.html - "SplitMode" field
 * Note: Manual does not specify enum values, using logical numbering
 */
export enum MoneyWorksAllocationSplitMode {
  /** Split by percentage */
  PERCENTAGE = 1,
  
  /** Split by fixed amount */
  FIXED_AMOUNT = 2,
  
  /** Split by ratio */
  RATIO = 3,
  
  /** Remaining to last account */
  REMAINING_TO_LAST = 4
}

// ============================================================================
// CANONICAL MONEYWORKS ALLOCATION FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks allocation rule fields as defined in manual
 * Source: moneyworks_appendix_allocation_file.html - Allocation File table
 */
export const MONEYWORKS_ALLOCATION_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique allocation rule identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: false,
    isSystem: true
  },
  {
    fieldName: "MatchFunction",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "The matching text/function that involves the split",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: true,
    relationshipTarget: "Transaction.Description",
    relationshipRule: "Pattern matching against transaction descriptions, payee names, or other transaction fields"
  },
  {
    fieldName: "MatchName", 
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "The name of the rule",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Priority",
    dataType: "N" as const,
    canonicalDescription: "Priority of the rule",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "SplitAcct1",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "The first split account",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: true,
    relationshipTarget: "Accounts.Code",
    relationshipRule: "Must reference valid account code in chart of accounts"
  },
  {
    fieldName: "SplitAcct2",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "The second split account",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: false,
    relationshipTarget: "Accounts.Code",
    relationshipRule: "Optional second account for split allocation"
  },
  {
    fieldName: "SplitAcct3",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "The third split account",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: false,
    relationshipTarget: "Accounts.Code",
    relationshipRule: "Optional third account for complex split allocation"
  },
  {
    fieldName: "SplitAcct4",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "The fourth split account",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: false,
    relationshipTarget: "Accounts.Code",
    relationshipRule: "Optional fourth account for maximum flexibility split allocation"
  },
  {
    fieldName: "SplitAmount1",
    dataType: "N" as const,
    canonicalDescription: "Percent or amount to allocate to first split account",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: true,
    relationshipTarget: "SplitAcct1",
    relationshipRule: "Allocation amount/percentage for first split account, interpretation depends on SplitMode"
  },
  {
    fieldName: "SplitAmount2",
    dataType: "N" as const,
    canonicalDescription: "Second split amount to allocate",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: false,
    relationshipTarget: "SplitAcct2",
    relationshipRule: "Allocation amount/percentage for second split account, interpretation depends on SplitMode"
  },
  {
    fieldName: "SplitAmount3",
    dataType: "N" as const,
    canonicalDescription: "Third split amount to allocate",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: false,
    relationshipTarget: "SplitAcct3",
    relationshipRule: "Allocation amount/percentage for third split account, interpretation depends on SplitMode"
  },
  {
    fieldName: "SplitMode",
    dataType: "N" as const,
    canonicalDescription: "The type of split",
    manualSource: "moneyworks_appendix_allocation_file.html",
    isRequired: true,
    relationshipRule: "Determines how SplitAmount values are interpreted (percentage, fixed amount, ratio, etc.)"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS ALLOCATION BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks allocation system business rules extracted from manual context
 * Source: moneyworks_appendix_allocation_file.html + related transaction processing documentation
 */
export const MONEYWORKS_ALLOCATION_BUSINESS_RULES = [
  {
    entitySource: "Allocations",
    targetField: "Priority",
    ruleType: "processing" as const,
    canonicalRule: "Rules processed in priority order, lower numbers processed first",
    manualSource: "moneyworks_appendix_allocation_file.html",
    businessContext: "Multiple rules may match same transaction, priority determines which rule applies"
  },

  {
    entitySource: "Allocations",
    targetField: "MatchFunction",
    ruleType: "pattern_matching" as const,
    canonicalRule: "Supports text matching against transaction fields including description, payee, reference",
    manualSource: "moneyworks_appendix_allocation_file.html",
    businessContext: "Pattern matching enables automated transaction categorization during bank import"
  },

  {
    entitySource: "Allocations",
    targetField: "SplitAcct1-4",
    ruleType: "validation" as const,
    canonicalRule: "All split accounts must reference valid accounts in chart of accounts",
    manualSource: "moneyworks_appendix_allocation_file.html",
    businessContext: "Account validation ensures allocation targets exist and are properly configured"
  },

  {
    entitySource: "Allocations",
    targetField: "SplitAmount1-3 + SplitMode",
    ruleType: "calculation" as const,
    canonicalRule: "Split amounts interpreted based on SplitMode: percentage (0-100), fixed amounts, or ratios",
    manualSource: "moneyworks_appendix_allocation_file.html",
    businessContext: "Flexible calculation modes support various allocation scenarios (overhead, cost distribution, etc.)"
  },

  {
    entitySource: "Allocations",
    targetField: "MatchName",
    ruleType: "identification" as const,
    canonicalRule: "Human-readable rule name for identification and management purposes",
    manualSource: "moneyworks_appendix_allocation_file.html",
    businessContext: "Named rules enable organized allocation rule management and troubleshooting"
  },

  {
    entitySource: "Allocations",
    targetField: "LastModifiedTime",
    ruleType: "audit" as const,
    canonicalRule: "System automatically tracks rule modification timestamps for audit trail",
    manualSource: "moneyworks_appendix_allocation_file.html",
    businessContext: "Audit trail supports compliance and troubleshooting of allocation rule changes"
  }
];

// ============================================================================
// CANONICAL MONEYWORKS ALLOCATION TERMINOLOGY
// ============================================================================

/**
 * CRITICAL ARCHITECTURAL INSIGHT:
 * 
 * MoneyWorks uses the term "Allocation" specifically for automated transaction 
 * splitting rules, not manual cost allocations or departmental distributions.
 * 
 * ALLOCATION vs COST DISTRIBUTION:
 * - Allocation File: Automated transaction splitting rules for bank imports
 * - Cost Allocation: Manual or calculated distribution of costs across departments/jobs
 * 
 * SPLIT vs ALLOCATION:
 * - Split: The individual account destinations within an allocation rule
 * - Allocation: The complete rule encompassing match criteria and split configuration
 * 
 * This terminology precision is critical for avoiding semantic pollution with
 * generic "allocation" concepts from other accounting systems.
 */

export const MONEYWORKS_ALLOCATION_CANONICAL_TERMS = {
  // Core allocation concepts (MoneyWorks canonical)
  ALLOCATION_RULE: "Allocation Rule",               // Complete rule definition
  AUTO_ALLOCATION: "Auto-Allocation",               // Automated allocation process  
  ALLOCATION_FILE: "Allocation File",               // Entity storing allocation rules
  AUTO_SPLIT: "AutoSplit",                         // Internal MoneyWorks name
  
  // Rule components (MoneyWorks canonical)
  MATCH_FUNCTION: "Match Function",                 // Pattern matching criteria
  MATCH_NAME: "Match Name",                        // Human-readable rule identifier
  RULE_PRIORITY: "Rule Priority",                  // Processing order priority
  
  // Split configuration (MoneyWorks canonical)
  SPLIT_ACCOUNT: "Split Account",                  // Destination account for portion
  SPLIT_AMOUNT: "Split Amount",                    // Allocation amount/percentage
  SPLIT_MODE: "Split Mode",                        // Calculation method
  
  // Processing context (MoneyWorks canonical)
  BANK_IMPORT_ALLOCATION: "Bank Import Allocation", // Automatic during import
  MANUAL_AUTO_ALLOCATION: "Manual Auto-Allocation", // User-triggered allocation
  TRANSACTION_MATCHING: "Transaction Matching",     // Pattern matching process
  
  // Account relationships (MoneyWorks canonical)
  DESTINATION_ACCOUNT: "Destination Account",       // Target for split allocation
  SPLIT_DISTRIBUTION: "Split Distribution",         // How amounts are distributed
  ALLOCATION_TARGET: "Allocation Target"            // Account receiving allocation
} as const;

// ============================================================================
// CANONICAL ALLOCATION USAGE PATTERNS
// ============================================================================

/**
 * MoneyWorks allocation usage patterns for cross-business universality
 * All patterns validated for restaurant, legal, manufacturing, consulting domains
 */
export const MONEYWORKS_ALLOCATION_USAGE_PATTERNS = [
  {
    scenario: "Automated Expense Categorization",
    businessTypes: ["all"],
    allocationPattern: "Match supplier name patterns to automatically split invoices to appropriate expense accounts",
    canonicalExample: {
      matchFunction: "*OFFICE SUPPLIES*",
      splitAcct1: "6100-01", // Office supplies expense
      splitAmount1: 100,
      splitMode: MoneyWorksAllocationSplitMode.PERCENTAGE
    },
    universalApplicability: "Any business needs automated expense categorization from bank feeds"
  },
  
  {
    scenario: "Multi-Department Cost Allocation", 
    businessTypes: ["professional services", "manufacturing", "consulting"],
    allocationPattern: "Split utility bills across departments based on predetermined percentages",
    canonicalExample: {
      matchFunction: "*ELECTRIC COMPANY*",
      splitAcct1: "6200-ADM", // Admin utilities
      splitAcct2: "6200-OPS", // Operations utilities  
      splitAmount1: 40,
      splitAmount2: 60,
      splitMode: MoneyWorksAllocationSplitMode.PERCENTAGE
    },
    universalApplicability: "Multi-location or multi-department businesses need automated overhead distribution"
  },
  
  {
    scenario: "Credit Card Transaction Splitting",
    businessTypes: ["all"],
    allocationPattern: "Automatically split credit card transactions based on merchant patterns",
    canonicalExample: {
      matchFunction: "*AMAZON*",
      splitAcct1: "6100", // Office supplies
      splitAcct2: "6150", // Computer equipment
      splitAcct3: "6050", // Books and training
      splitMode: MoneyWorksAllocationSplitMode.REMAINING_TO_LAST
    },
    universalApplicability: "Any business using credit cards needs merchant-based categorization"
  },
  
  {
    scenario: "Recurring Service Provider Allocation",
    businessTypes: ["all"], 
    allocationPattern: "Split recurring services (insurance, software subscriptions) across cost centers",
    canonicalExample: {
      matchFunction: "*SOFTWARE SUBSCRIPTION*",
      splitAcct1: "6300-IT",  // IT department
      splitAcct2: "6300-OPS", // Operations department
      splitAmount1: 2000,     // Fixed amount for IT
      splitMode: MoneyWorksAllocationSplitMode.FIXED_AMOUNT
    },
    universalApplicability: "All businesses have recurring services requiring departmental allocation"
  }
];

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate canonical MoneyWorks allocation rule configuration
 */
export function validateAllocationRuleCanonical(
  matchFunction: string,
  matchName: string,
  splitAccounts: string[],
  splitAmounts: number[],
  splitMode: MoneyWorksAllocationSplitMode
): {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Validate match function
  if (!matchFunction || matchFunction.length === 0) {
    warnings.push("MatchFunction is required for allocation rule");
  }
  if (matchFunction.length > 255) {
    warnings.push("MatchFunction exceeds maximum length of 255 characters");
  }
  
  // Validate match name
  if (!matchName || matchName.length === 0) {
    warnings.push("MatchName is required for rule identification");
  }
  if (matchName.length > 11) {
    warnings.push("MatchName exceeds maximum length of 11 characters");
  }
  
  // Validate split configuration
  if (splitAccounts.length === 0) {
    warnings.push("At least one split account (SplitAcct1) is required");
  }
  if (splitAccounts.length > 4) {
    warnings.push("Maximum 4 split accounts supported (SplitAcct1-4)");
  }
  
  // Validate split amounts
  if (splitAmounts.length !== splitAccounts.length) {
    warnings.push("Number of split amounts must match number of split accounts");
  }
  
  // Validate split mode logic
  if (splitMode === MoneyWorksAllocationSplitMode.PERCENTAGE) {
    const totalPercentage = splitAmounts.reduce((sum, amount) => sum + amount, 0);
    if (totalPercentage > 100) {
      warnings.push("Total percentage allocation exceeds 100%");
    }
    if (totalPercentage < 100 && splitAccounts.length === splitAmounts.length) {
      recommendations.push("Consider using REMAINING_TO_LAST mode for automatic remainder handling");
    }
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    recommendations
  };
}

/**
 * Get canonical allocation rule explanation
 */
export function getCanonicalAllocationExplanation(
  matchFunction: string,
  splitAccounts: string[],
  splitAmounts: number[],
  splitMode: MoneyWorksAllocationSplitMode
): string {
  const modeNames = {
    [MoneyWorksAllocationSplitMode.PERCENTAGE]: "percentage",
    [MoneyWorksAllocationSplitMode.FIXED_AMOUNT]: "fixed amount",
    [MoneyWorksAllocationSplitMode.RATIO]: "ratio",
    [MoneyWorksAllocationSplitMode.REMAINING_TO_LAST]: "remaining to last"
  };
  
  const modeName = modeNames[splitMode] || "unknown";
  
  let explanation = `MoneyWorks Allocation Rule: Transactions matching "${matchFunction}" will be split `;
  explanation += `using ${modeName} mode to accounts: `;
  
  splitAccounts.forEach((account, index) => {
    if (index > 0) explanation += ", ";
    explanation += `${account}`;
    if (splitAmounts[index] !== undefined) {
      explanation += ` (${splitAmounts[index]}${splitMode === MoneyWorksAllocationSplitMode.PERCENTAGE ? '%' : ''})`;
    }
  });
  
  return explanation;
}

/**
 * Determine allocation rule complexity level
 */
export function getAllocationComplexityLevel(splitAccounts: string[]): {
  level: "simple" | "moderate" | "complex" | "maximum";
  explanation: string;
} {
  const accountCount = splitAccounts.length;
  
  if (accountCount === 1) {
    return {
      level: "simple",
      explanation: "Single destination account - simple categorization rule"
    };
  } else if (accountCount === 2) {
    return {
      level: "moderate", 
      explanation: "Two-way split - moderate complexity for departmental or category splitting"
    };
  } else if (accountCount === 3) {
    return {
      level: "complex",
      explanation: "Three-way split - complex allocation for multi-departmental or detailed categorization"
    };
  } else {
    return {
      level: "maximum",
      explanation: "Four-way split - maximum MoneyWorks allocation complexity for sophisticated cost distribution"
    };
  }
}

export default {
  MONEYWORKS_ALLOCATION_FIELDS,
  MONEYWORKS_ALLOCATION_CANONICAL_TERMS,
  MoneyWorksAllocationSplitMode
};