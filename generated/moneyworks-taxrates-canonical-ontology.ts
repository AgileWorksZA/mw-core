/**
 * MoneyWorks TaxRates Entity - Canonical Ontology
 *
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_tax_rate.html
 * Authority: MoneyWorks Manual - Tax Rate Field Descriptions
 * Enhanced: Empirical API validation (MoneyWorks Now v9.2.3)
 *
 * COVERAGE: 30 fields
 *
 * CRITICAL DISCOVERY: MoneyWorks TaxRates support sophisticated tax systems with
 * historical rate management, multi-tier taxation (GST+PST), reversed charge mechanics,
 * and automatic GST finalization tracking - essential for international business compliance.
 *
 * ENHANCED COVERAGE: Now includes PST (Provincial Sales Tax) account fields for Canadian
 * multi-jurisdiction tax compliance, tax type enumeration, combination flags, and reversed
 * charge rate fields for EU VAT compliance scenarios.
 */

// ============================================================================
// CANONICAL MONEYWORKS TAX TYPE ENUMERATION
// ============================================================================

/**
 * MoneyWorks canonical tax type enumeration
 * Source: Empirical API validation (MoneyWorks Now v9.2.3) - Type field
 *
 * Tax types distinguish between different taxation systems and their
 * accounting treatment within MoneyWorks.
 */
export enum MoneyWorksTaxType {
  /** System tax code - VAT not applicable (code: *) */
  SYSTEM = 1,

  /** Standard GST/VAT tax */
  GST = 2,

  /** Provincial Sales Tax (PST) - Canadian jurisdictions */
  PST = 3,

  /** Combined GST+PST tax */
  COMBINED = 4,

  /** Reversed charge VAT (EU) */
  REVERSED = 5
}

// ============================================================================
// CANONICAL MONEYWORKS TAX COMBINATION MODES
// ============================================================================

/**
 * MoneyWorks canonical tax combination modes for 2nd tier tax
 * Source: moneyworks_appendix_tax_rate.html - "Combine" field description
 * Enhanced: Empirical validation via Combination boolean field
 *
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
 * Enhanced: Empirical API validation (MoneyWorks Now v9.2.3)
 */
export const MONEYWORKS_TAX_RATE_FIELDS = [
  // ============================================================================
  // SYSTEM FIELDS
  // ============================================================================
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique tax rate identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_tax_rate.html"
  },

  // ============================================================================
  // TAX CODE IDENTIFICATION
  // ============================================================================
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
    fieldName: "RateName",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Display name for the tax rate (e.g., 'System (VAT n/a)', 'Standard VAT 15%')",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },
  {
    fieldName: "Type",
    dataType: "N" as const,
    canonicalDescription: "Tax rate type enumeration (1=System/VAT n/a, 2=GST, 3=PST, 4=Combined, 5=Reversed)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    defaultValue: 2
  },

  // ============================================================================
  // GST/VAT CONTROL ACCOUNTS
  // ============================================================================
  {
    fieldName: "PaidAccount",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The control account for GST paid out under this rate",
    manualSource: "moneyworks_appendix_tax_rate.html",
    isRequired: true,
    foreignKey: "Account.Code"
  },
  {
    fieldName: "RecAccount",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The control account for GST received out under this rate",
    manualSource: "moneyworks_appendix_tax_rate.html",
    isRequired: true,
    foreignKey: "Account.Code"
  },

  // ============================================================================
  // PST CONTROL ACCOUNTS (Canadian Multi-Jurisdiction Tax)
  // ============================================================================
  {
    fieldName: "PSTReceived",
    dataType: "N" as const,
    canonicalDescription: "PST (Provincial Sales Tax) control account for receipts - used in Canadian multi-tier tax jurisdictions where PST is tracked separately from GST",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: "Account.Code",
    semanticNote: "Canada uses GST+PST system where federal GST and provincial PST require separate accounting"
  },
  {
    fieldName: "PSTPaid",
    dataType: "N" as const,
    canonicalDescription: "PST (Provincial Sales Tax) control account for payments - used in Canadian multi-tier tax jurisdictions where PST is tracked separately from GST",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: "Account.Code",
    semanticNote: "Canada uses GST+PST system where federal GST and provincial PST require separate accounting"
  },

  // ============================================================================
  // TAX RATE CONFIGURATION - PRIMARY TIER (GST/VAT)
  // ============================================================================
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

  // ============================================================================
  // TAX RATE CONFIGURATION - SECONDARY TIER (PST/REGIONAL)
  // ============================================================================
  {
    fieldName: "Combination",
    dataType: "N" as const,
    canonicalDescription: "Boolean flag indicating whether this is a combined tax rate (GST+PST or similar multi-tier configuration)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    defaultValue: 0,
    notes: "Stored as numeric 0 (false) or 1 (true)"
  },
  {
    fieldName: "Combine",
    dataType: "N" as const,
    canonicalDescription: "Flags (how 2nd tier tax is combined) - determines calculation method for multi-tier taxation",
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

  // ============================================================================
  // REVERSED CHARGE RATES (EU VAT Compliance)
  // ============================================================================
  {
    fieldName: "ReversedRate1",
    dataType: "N" as const,
    canonicalDescription: "First reversed charge rate - used for EU VAT reverse charge mechanism where buyer accounts for VAT instead of supplier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    defaultValue: 0,
    semanticNote: "EU reverse charge: supplier invoices without VAT, buyer self-assesses and accounts for VAT"
  },
  {
    fieldName: "ReversedRate2",
    dataType: "N" as const,
    canonicalDescription: "Second reversed charge rate - used for EU VAT reverse charge mechanism with multiple rate tiers",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    defaultValue: 0,
    semanticNote: "Allows for rate changes in reversed charge scenarios, similar to Rate1/Rate2 structure"
  },

  // ============================================================================
  // GST FINALIZATION TRACKING
  // ============================================================================
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

  // ============================================================================
  // TAX REPORTING CYCLE
  // ============================================================================
  {
    fieldName: "ReportCycleStart",
    dataType: "D" as const,
    canonicalDescription: "Tax reporting cycle start date",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },
  {
    fieldName: "ReportCycleEnd",
    dataType: "D" as const,
    canonicalDescription: "Tax reporting cycle end date",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },
  {
    fieldName: "ReportDate",
    dataType: "D" as const,
    canonicalDescription: "Next tax report due date",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },

  // ============================================================================
  // CROSS-BORDER TAX HANDLING
  // ============================================================================
  {
    fieldName: "AliasCode",
    dataType: "T" as const,
    maxLength: 4,
    canonicalDescription: "Alternative tax code (for cross-border transactions)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },
  {
    fieldName: "AliasCountry",
    dataType: "A" as const,
    maxLength: 2,
    canonicalDescription: "Country code for alias tax code (ISO 3166-1 alpha-2)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },

  // ============================================================================
  // SCRIPTABLE FIELDS
  // ============================================================================
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
 * MoneyWorks canonical tax rate business rules interface
 */
export interface MoneyWorksTaxRateBusinessRules {
  /** Tax code must be unique within the system */
  uniqueTaxCode: boolean;

  /** PaidAccount must reference valid Account.Code */
  validPaidAccount: boolean;

  /** RecAccount must reference valid Account.Code */
  validRecAccount: boolean;

  /** PSTReceived must reference valid Account.Code if specified */
  validPSTReceivedAccount: boolean;

  /** PSTPaid must reference valid Account.Code if specified */
  validPSTPaidAccount: boolean;

  /** Rate1 and Rate2 must be valid percentage values (0-100) */
  validRates: boolean;

  /** CombineRate1 and CombineRate2 must be valid if Combine flags set */
  validCombineRates: boolean;

  /** ReversedRate1 and ReversedRate2 must be valid percentage values if specified */
  validReversedRates: boolean;

  /** Changeover date determines which rate to use */
  dateBasedRateSelection: boolean;

  /** If Combination is true, must have valid combine rates and PST accounts */
  validCombinationConfiguration: boolean;

  /** Type must be valid MoneyWorksTaxType enumeration value */
  validTaxType: boolean;
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
 * MULTI-TIER TAX SUPPORT (GST+PST):
 * - Primary tax rates (Rate1/Rate2) - typically GST/VAT
 * - Secondary tax rates (CombineRate1/CombineRate2) - typically PST/regional tax
 * - Combine flags determine calculation method (additive, compound, separate)
 * - Separate PST account fields (PSTReceived/PSTPaid) for Canadian jurisdictions
 * - Combination boolean flag indicates multi-tier configuration
 *
 * REVERSED CHARGE MECHANISM (EU VAT):
 * - ReversedRate1/ReversedRate2 support EU reverse charge scenarios
 * - Buyer accounts for VAT instead of supplier in B2B cross-border transactions
 * - Dual rate structure allows for rate changes over time
 *
 * ACCOUNT INTEGRATION:
 * - PaidAccount: Control account for GST tax paid out (AP-type account)
 * - RecAccount: Control account for GST tax received (AR-type account)
 * - PSTPaid: Control account for PST tax paid out (Canadian jurisdictions)
 * - PSTReceived: Control account for PST tax received (Canadian jurisdictions)
 * - Automatic posting to appropriate accounts during transactions
 *
 * GST FINALIZATION TRACKING:
 * - Automatic tracking of tax totals for government reporting
 * - Net amounts calculated for BAS/VAT return preparation
 * - Historical finalization data maintained
 * - Reporting cycle management with start/end/due dates
 *
 * TAX TYPE CLASSIFICATION:
 * - Type field distinguishes System, GST, PST, Combined, and Reversed charge taxes
 * - RateName provides human-readable description
 * - Supports complex international tax compliance scenarios
 *
 * This demonstrates MoneyWorks as enterprise-grade international accounting system
 * with comprehensive tax compliance capabilities for multiple jurisdictions including
 * Canada (GST+PST), EU (reversed charge), Australia (BAS), and New Zealand (GST).
 */

export const MONEYWORKS_TAX_RATE_CANONICAL_TERMS = {
  // Tax code management (MoneyWorks canonical)
  TAX_CODE: "Tax Code",                     // Unique identifier for tax rate
  TAX_RATE: "Tax Rate",                     // Percentage rate value
  CHANGEOVER_DATE: "Changeover Date",       // Date when rate changes
  RATE_NAME: "Rate Name",                   // Display name for tax rate
  TAX_TYPE: "Tax Type",                     // Type enumeration field

  // Dual rate system (MoneyWorks canonical)
  RATE_BEFORE_CHANGEOVER: "Rate Before Changeover",   // Rate1 field
  RATE_AFTER_CHANGEOVER: "Rate After Changeover",     // Rate2 field
  HISTORICAL_RATE: "Historical Rate",                 // Rate1 when past changeover
  CURRENT_RATE: "Current Rate",                       // Rate2 when past changeover

  // Multi-tier taxation (MoneyWorks canonical)
  PRIMARY_TAX_RATE: "Primary Tax Rate",               // Main tax (GST/VAT)
  SECONDARY_TAX_RATE: "Secondary Tax Rate",           // Additional tax (PST)
  TAX_COMBINATION_MODE: "Tax Combination Mode",       // How taxes are combined
  COMBINED_TAX_CALCULATION: "Combined Tax Calculation", // Total tax calculation
  COMBINATION_FLAG: "Combination Flag",               // Boolean for combined rates

  // GST/VAT account relationships (MoneyWorks canonical)
  GST_PAID_ACCOUNT: "GST Paid Account",               // PaidAccount field
  GST_RECEIVED_ACCOUNT: "GST Received Account",       // RecAccount field

  // PST account relationships (Canadian multi-tier tax)
  PST_PAID_ACCOUNT: "PST Paid Account",               // PSTPaid field
  PST_RECEIVED_ACCOUNT: "PST Received Account",       // PSTReceived field
  TAX_CONTROL_ACCOUNT: "Tax Control Account",         // General term for all

  // Reversed charge (EU VAT compliance)
  REVERSED_CHARGE_RATE: "Reversed Charge Rate",       // ReversedRate1/2 fields
  REVERSE_CHARGE_MECHANISM: "Reverse Charge Mechanism", // EU VAT reverse charge
  BUYER_ACCOUNTS_VAT: "Buyer Accounts for VAT",       // Reverse charge concept

  // GST finalization (MoneyWorks canonical)
  GST_FINALIZATION: "GST Finalization",               // Tax period closing
  GST_PAID_TOTAL: "GST Paid Total",                   // GSTPaid field
  GST_RECEIVED_TOTAL: "GST Received Total",           // GSTReceived field
  NET_TAX_PAID: "Net Tax Paid",                       // NetPaid field
  NET_TAX_RECEIVED: "Net Tax Received",               // NetReceived field

  // International tax terms (MoneyWorks canonical usage)
  GST: "GST",                                         // Goods and Services Tax
  PST: "PST",                                         // Provincial Sales Tax
  VAT: "VAT",                                         // Value Added Tax
  SALES_TAX: "Sales Tax",                             // General sales tax
  HST: "HST",                                         // Harmonized Sales Tax (Canada)

  // Tax calculation concepts (MoneyWorks canonical)
  TAX_INCLUSIVE: "Tax Inclusive",                     // Price includes tax
  TAX_EXCLUSIVE: "Tax Exclusive",                     // Tax added to price
  TAX_BASIS: "Tax Basis",                             // Amount tax is calculated on
  TAX_AMOUNT: "Tax Amount",                           // Calculated tax value

  // Compliance and reporting (MoneyWorks canonical)
  BAS_REPORTING: "BAS Reporting",                     // Business Activity Statement
  VAT_RETURN: "VAT Return",                           // VAT return preparation
  TAX_PERIOD: "Tax Period",                           // Reporting period
  TAX_RECONCILIATION: "Tax Reconciliation",           // Account reconciliation
  REPORT_CYCLE: "Report Cycle",                       // Tax reporting cycle

  // Cross-border tax (MoneyWorks canonical)
  ALIAS_TAX_CODE: "Alias Tax Code",                   // Alternative code
  TAX_JURISDICTION: "Tax Jurisdiction"                // Country/region
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate canonical MoneyWorks tax code format
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
  if (!/^[A-Za-z0-9*]*$/.test(taxCode)) {
    warnings.push("Tax code should contain only alphanumeric characters or asterisk (*)");
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Validate canonical MoneyWorks tax rate values
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
 * Validate MoneyWorks tax type enumeration
 */
export function validateTaxType(type: number): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  const validTypes = Object.values(MoneyWorksTaxType).filter(v => typeof v === 'number');

  if (!validTypes.includes(type)) {
    warnings.push(`Tax type ${type} is not a valid MoneyWorksTaxType enumeration value`);
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
 * Enhanced to support PST and reversed charge scenarios
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
      // Secondary tax on original amount (Canadian GST+PST model)
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
    [MoneyWorksTaxCombineMode.ADDITIVE]: 'Additive (GST+PST)',
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
 * Get canonical MoneyWorks account relationships for tax rates
 * Enhanced to include PST account requirements
 */
export function getCanonicalTaxAccountRelationships(isCombined: boolean = false): {
  needsPaidAccount: boolean;
  needsRecAccount: boolean;
  needsPSTPaidAccount: boolean;
  needsPSTReceivedAccount: boolean;
  explanation: string;
} {
  return {
    needsPaidAccount: true,
    needsRecAccount: true,
    needsPSTPaidAccount: isCombined,
    needsPSTReceivedAccount: isCombined,
    explanation: isCombined
      ? "MoneyWorks combined tax rates require GST accounts (PaidAccount/RecAccount) and PST accounts (PSTPaid/PSTReceived) for proper multi-tier tax tracking in jurisdictions like Canada."
      : "MoneyWorks tax rates require both PaidAccount (for GST paid out) and RecAccount (for GST received) control accounts for proper tax tracking and compliance reporting."
  };
}

/**
 * Validate MoneyWorks tax rate account references
 * Enhanced to validate PST accounts for combined tax rates
 */
export function validateTaxAccountReferences(
  paidAccount: string,
  recAccount: string,
  pstPaid?: number,
  pstReceived?: number,
  isCombined: boolean = false
): {
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

  if (isCombined) {
    if (!pstPaid || pstPaid === 0) {
      warnings.push("PSTPaid account is required for combined tax rates");
    }

    if (!pstReceived || pstReceived === 0) {
      warnings.push("PSTReceived account is required for combined tax rates");
    }

    if (pstPaid && pstReceived && pstPaid === pstReceived) {
      warnings.push("PSTPaid and PSTReceived should be different accounts");
    }
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Validate reversed charge rate configuration
 */
export function validateReversedChargeRates(reversedRate1: number, reversedRate2: number): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  const rate1Validation = validateTaxRateCanonical(reversedRate1);
  const rate2Validation = validateTaxRateCanonical(reversedRate2);

  warnings.push(...rate1Validation.warnings.map(w => `ReversedRate1: ${w}`));
  warnings.push(...rate2Validation.warnings.map(w => `ReversedRate2: ${w}`));

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

export default {
  MONEYWORKS_TAX_RATE_FIELDS,
  MONEYWORKS_TAX_RATE_CANONICAL_TERMS,
  MoneyWorksTaxType,
  MoneyWorksTaxCombineMode
};
