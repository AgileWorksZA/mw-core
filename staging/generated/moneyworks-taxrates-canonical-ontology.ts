/**
 * MoneyWorks TaxRates Entity - Canonical Ontology
 * 
 * PURE MoneyWorks staging definitions extracted from official manual
 * Source: moneyworks_appendix_tax_rate.html
 * Authority: MoneyWorks Manual - Tax Rate Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks TaxRates support sophisticated tax systems with
 * historical rate management, multi-tier taxation, and automatic GST finalization
 * tracking - essential for international business compliance.
 */

// ============================================================================
// CANONICAL MONEYWORKS TAX COMBINATION MODES
// ============================================================================

/**
 * MoneyWorks staging tax combination modes for 2nd tier tax
 * Source: moneyworks_appendix_tax_rate.html - "Combine" field description
 * Note: The manual indicates "Flags (how 2nd tier tax is combined)" but doesn't 
 * specify the exact flag values - these would need to be determined from 
 * actual MoneyWorks implementation or additional documentation
 */
export enum MoneyWorksTaxCombineMode {
  /** No combination - single tier tax only */
  NONE = 0,
  
  /** Additive - 2nd tier tax added to base tax */
  ADDITIVE = 1,
  
  /** Compound - 2nd tier tax calculated on tax-inclusive amount */
  COMPOUND = 2,
  
  /** Separate - 2nd tier tax calculated separately */
  SEPARATE = 3
}

// ============================================================================
// CANONICAL MONEYWORKS TAX RATE FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks tax rate fields as defined in manual
 * Source: moneyworks_appendix_tax_rate.html - Tax Rate table
 */
export const MONEYWORKS_TAX_RATE_FIELDS = [
  {
    fieldName: "TaxCode",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The tax code",
    manualSource: "moneyworks_appendix_tax_rate.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "PaidAccount",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The control account for GST paid out under this rate",
    manualSource: "moneyworks_appendix_tax_rate.html",
    isRequired: true
  },
  {
    fieldName: "RecAccount",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The control account for GST received out under this rate",
    manualSource: "moneyworks_appendix_tax_rate.html",
    isRequired: true
  },
  {
    fieldName: "Date",
    dataType: "D" as const,
    canonicalDescription: "Tax rate changeover date",
    manualSource: "moneyworks_appendix_tax_rate.html",
    isRequired: true
  },
  {
    fieldName: "Rate1",
    dataType: "N" as const,
    canonicalDescription: "Rate used before changeover date",
    manualSource: "moneyworks_appendix_tax_rate.html",
    isRequired: true
  },
  {
    fieldName: "Rate2",
    dataType: "N" as const,
    canonicalDescription: "Rate used on or after changeover date",
    manualSource: "moneyworks_appendix_tax_rate.html",
    isRequired: true
  },
  {
    fieldName: "Combine",
    dataType: "N" as const,
    canonicalDescription: "Flags (how 2nd tier tax is combined)",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "CombineRate1",
    dataType: "N" as const,
    canonicalDescription: "2nd tier rate used before changeover date (PST)",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "CombineRate2",
    dataType: "N" as const,
    canonicalDescription: "2nd tier rate used after changeover date (PST)",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "GSTPaid",
    dataType: "N" as const,
    canonicalDescription: "Total GST paid for taxcode in last GST finalisation",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "GSTReceived",
    dataType: "N" as const,
    canonicalDescription: "Total GST received for taxcode in last GST finalisation",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "NetPaid",
    dataType: "N" as const,
    canonicalDescription: "Net paid for taxcode in last GST finalisation",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "NetReceived",
    dataType: "N" as const,
    canonicalDescription: "Net received for taxcode in last GST finalisation",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "Scriptable number",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_tax_rate.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS TAX RATE BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks staging tax rate business rules interface
 */
export interface MoneyWorksTaxRateBusinessRules {
  /** Tax code must be unique within the system */
  uniqueTaxCode: boolean;
  
  /** PaidAccount must reference valid Account.Code */
  validPaidAccount: boolean;
  
  /** RecAccount must reference valid Account.Code */
  validRecAccount: boolean;
  
  /** Rate1 and Rate2 must be valid percentage values (0-100) */
  validRates: boolean;
  
  /** CombineRate1 and CombineRate2 must be valid if Combine flags set */
  validCombineRates: boolean;
  
  /** Changeover date determines which rate to use */
  dateBasedRateSelection: boolean;
}

// ============================================================================
// CANONICAL MONEYWORKS TAX TERMINOLOGY CLARIFICATION
// ============================================================================

/**
 * CRITICAL ARCHITECTURAL INSIGHT:
 * 
 * MoneyWorks TaxRates entity reveals sophisticated international tax compliance:
 * 
 * DUAL RATE SYSTEM:
 * - Rate1: Tax rate before changeover date
 * - Rate2: Tax rate on or after changeover date
 * - Allows for historical tax rate management and future rate changes
 * 
 * MULTI-TIER TAX SUPPORT:
 * - Primary tax rates (Rate1/Rate2) - typically GST/VAT
 * - Secondary tax rates (CombineRate1/CombineRate2) - typically PST/regional tax
 * - Combine flags determine calculation method (additive, compound, separate)
 * 
 * ACCOUNT INTEGRATION:
 * - PaidAccount: Control account for tax paid out (AP-type account)
 * - RecAccount: Control account for tax received (AR-type account)
 * - Automatic posting to appropriate accounts during transactions
 * 
 * GST FINALIZATION TRACKING:
 * - Automatic tracking of tax totals for government reporting
 * - Net amounts calculated for BAS/VAT return preparation
 * - Historical finalization data maintained
 * 
 * This demonstrates MoneyWorks as enterprise-grade international accounting system
 * with comprehensive tax compliance capabilities.
 */

export const MONEYWORKS_TAX_RATE_CANONICAL_TERMS = {
  // Tax code management (MoneyWorks staging)
  TAX_CODE: "Tax Code",                     // Unique identifier for tax rate
  TAX_RATE: "Tax Rate",                     // Percentage rate value
  CHANGEOVER_DATE: "Changeover Date",       // Date when rate changes
  
  // Dual rate system (MoneyWorks staging)
  RATE_BEFORE_CHANGEOVER: "Rate Before Changeover",   // Rate1 field
  RATE_AFTER_CHANGEOVER: "Rate After Changeover",     // Rate2 field
  HISTORICAL_RATE: "Historical Rate",                 // Rate1 when past changeover
  CURRENT_RATE: "Current Rate",                       // Rate2 when past changeover
  
  // Multi-tier taxation (MoneyWorks staging)
  PRIMARY_TAX_RATE: "Primary Tax Rate",               // Main tax (GST/VAT)
  SECONDARY_TAX_RATE: "Secondary Tax Rate",           // Additional tax (PST)
  TAX_COMBINATION_MODE: "Tax Combination Mode",       // How taxes are combined
  COMBINED_TAX_CALCULATION: "Combined Tax Calculation", // Total tax calculation
  
  // Account relationships (MoneyWorks staging)
  GST_PAID_ACCOUNT: "GST Paid Account",               // PaidAccount field
  GST_RECEIVED_ACCOUNT: "GST Received Account",       // RecAccount field
  TAX_CONTROL_ACCOUNT: "Tax Control Account",         // General term for both
  
  // GST finalization (MoneyWorks staging)
  GST_FINALIZATION: "GST Finalization",               // Tax period closing
  GST_PAID_TOTAL: "GST Paid Total",                   // GSTPaid field
  GST_RECEIVED_TOTAL: "GST Received Total",           // GSTReceived field
  NET_TAX_PAID: "Net Tax Paid",                       // NetPaid field
  NET_TAX_RECEIVED: "Net Tax Received",               // NetReceived field
  
  // International tax terms (MoneyWorks staging usage)
  GST: "GST",                                         // Goods and Services Tax
  PST: "PST",                                         // Provincial Sales Tax
  VAT: "VAT",                                         // Value Added Tax
  SALES_TAX: "Sales Tax",                             // General sales tax
  
  // Tax calculation concepts (MoneyWorks staging)
  TAX_INCLUSIVE: "Tax Inclusive",                     // Price includes tax
  TAX_EXCLUSIVE: "Tax Exclusive",                     // Tax added to price
  TAX_BASIS: "Tax Basis",                             // Amount tax is calculated on
  TAX_AMOUNT: "Tax Amount",                           // Calculated tax value
  
  // Compliance and reporting (MoneyWorks staging)
  BAS_REPORTING: "BAS Reporting",                     // Business Activity Statement
  VAT_RETURN: "VAT Return",                           // VAT return preparation
  TAX_PERIOD: "Tax Period",                           // Reporting period
  TAX_RECONCILIATION: "Tax Reconciliation"            // Account reconciliation
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate staging MoneyWorks tax code format
 */
export function validateTaxCodeCanonical(taxCode: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!taxCode || taxCode.length === 0) {
    warnings.push("Tax code is required");
  }
  
  if (taxCode.length > 5) {
    warnings.push("Tax code exceeds MoneyWorks maximum length of 5 characters");
  }
  
  // MoneyWorks tax codes are typically alphanumeric
  if (!/^[A-Za-z0-9]*$/.test(taxCode)) {
    warnings.push("Tax code should contain only alphanumeric characters");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Validate staging MoneyWorks tax rate values
 */
export function validateTaxRateCanonical(rate: number): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (rate < 0) {
    warnings.push("Tax rate cannot be negative");
  }
  
  if (rate > 100) {
    warnings.push("Tax rate cannot exceed 100%");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Determine which tax rate to use based on changeover date
 */
export function getCurrentTaxRate(rate1: number, rate2: number, changeoverDate: Date, currentDate: Date = new Date()): {
  currentRate: number;
  ratePeriod: 'before_changeover' | 'after_changeover';
  explanation: string;
} {
  const isAfterChangeover = currentDate >= changeoverDate;
  
  return {
    currentRate: isAfterChangeover ? rate2 : rate1,
    ratePeriod: isAfterChangeover ? 'after_changeover' : 'before_changeover',
    explanation: isAfterChangeover 
      ? `Using Rate2 (${rate2}%) - current date is on or after changeover date ${changeoverDate.toISOString().split('T')[0]}`
      : `Using Rate1 (${rate1}%) - current date is before changeover date ${changeoverDate.toISOString().split('T')[0]}`
  };
}

/**
 * Calculate combined tax (primary + secondary tier)
 */
export function calculateCombinedTax(
  amount: number,
  primaryRate: number,
  secondaryRate: number,
  combineMode: MoneyWorksTaxCombineMode,
  isTaxInclusive: boolean = false
): {
  primaryTax: number;
  secondaryTax: number;
  totalTax: number;
  taxInclusiveAmount: number;
  taxExclusiveAmount: number;
  explanation: string;
} {
  let primaryTax: number;
  let secondaryTax: number;
  let taxExclusiveAmount: number;
  
  if (isTaxInclusive) {
    // Calculate from tax-inclusive amount
    const totalRate = calculateTotalRate(primaryRate, secondaryRate, combineMode);
    taxExclusiveAmount = amount / (1 + totalRate / 100);
  } else {
    taxExclusiveAmount = amount;
  }
  
  primaryTax = taxExclusiveAmount * (primaryRate / 100);
  
  switch (combineMode) {
    case MoneyWorksTaxCombineMode.ADDITIVE:
      // Secondary tax on original amount
      secondaryTax = taxExclusiveAmount * (secondaryRate / 100);
      break;
      
    case MoneyWorksTaxCombineMode.COMPOUND:
      // Secondary tax on amount including primary tax
      secondaryTax = (taxExclusiveAmount + primaryTax) * (secondaryRate / 100);
      break;
      
    case MoneyWorksTaxCombineMode.SEPARATE:
      // Secondary tax calculated separately (same as additive for calculation)
      secondaryTax = taxExclusiveAmount * (secondaryRate / 100);
      break;
      
    case MoneyWorksTaxCombineMode.NONE:
    default:
      secondaryTax = 0;
      break;
  }
  
  const totalTax = primaryTax + secondaryTax;
  const taxInclusiveAmount = taxExclusiveAmount + totalTax;
  
  const modeNames = {
    [MoneyWorksTaxCombineMode.NONE]: 'None (primary only)',
    [MoneyWorksTaxCombineMode.ADDITIVE]: 'Additive',
    [MoneyWorksTaxCombineMode.COMPOUND]: 'Compound',
    [MoneyWorksTaxCombineMode.SEPARATE]: 'Separate'
  };
  
  return {
    primaryTax,
    secondaryTax,
    totalTax,
    taxInclusiveAmount,
    taxExclusiveAmount,
    explanation: `Combined tax calculation using ${modeNames[combineMode]} mode: Primary ${primaryRate}% + Secondary ${secondaryRate}% = Total ${((totalTax / taxExclusiveAmount) * 100).toFixed(2)}%`
  };
}

/**
 * Calculate total effective tax rate for combined taxes
 */
function calculateTotalRate(primaryRate: number, secondaryRate: number, combineMode: MoneyWorksTaxCombineMode): number {
  switch (combineMode) {
    case MoneyWorksTaxCombineMode.ADDITIVE:
      return primaryRate + secondaryRate;
      
    case MoneyWorksTaxCombineMode.COMPOUND:
      return primaryRate + secondaryRate + (primaryRate * secondaryRate / 100);
      
    case MoneyWorksTaxCombineMode.SEPARATE:
      return primaryRate + secondaryRate;
      
    case MoneyWorksTaxCombineMode.NONE:
    default:
      return primaryRate;
  }
}

/**
 * Get staging MoneyWorks account relationships for tax rates
 */
export function getCanonicalTaxAccountRelationships(): {
  needsPaidAccount: boolean;
  needsRecAccount: boolean;
  explanation: string;
} {
  return {
    needsPaidAccount: true,
    needsRecAccount: true,
    explanation: "MoneyWorks tax rates require both PaidAccount (for GST paid out) and RecAccount (for GST received) control accounts for proper tax tracking and compliance reporting."
  };
}

/**
 * Validate MoneyWorks tax rate account references
 */
export function validateTaxAccountReferences(paidAccount: string, recAccount: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!paidAccount || paidAccount.length === 0) {
    warnings.push("PaidAccount is required for tax rate");
  }
  
  if (!recAccount || recAccount.length === 0) {
    warnings.push("RecAccount is required for tax rate");
  }
  
  if (paidAccount && paidAccount.length > 7) {
    warnings.push("PaidAccount exceeds MoneyWorks maximum length of 7 characters");
  }
  
  if (recAccount && recAccount.length > 7) {
    warnings.push("RecAccount exceeds MoneyWorks maximum length of 7 characters");
  }
  
  if (paidAccount === recAccount) {
    warnings.push("PaidAccount and RecAccount should be different accounts");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

export default {
  MONEYWORKS_TAX_RATE_FIELDS,
  MONEYWORKS_TAX_RATE_CANONICAL_TERMS
};