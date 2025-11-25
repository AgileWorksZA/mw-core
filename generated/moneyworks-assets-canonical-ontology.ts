/**
 * MoneyWorks Assets Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_assets.html
 * Authority: MoneyWorks Manual - Assets Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks Assets represents a comprehensive fixed asset register
 * with depreciation tracking, revaluation capabilities, and complete lifecycle management.
 * Associated AssetLog subfile provides detailed action audit trail.
 */

// ============================================================================
// CANONICAL MONEYWORKS ASSET TYPES
// ============================================================================

/**
 * MoneyWorks canonical asset status classification
 * Source: moneyworks_appendix_assets.html - "Status" field
 */
export enum MoneyWorksAssetStatus {
  /** New asset */
  NEW = "NEW",
  
  /** Active asset */
  ACTIVE = "ACT",
  
  /** Non-depreciable asset */
  NON_DEPRECIABLE = "NDP",
  
  /** Other status */
  OTHER = "OTH",
  
  /** Disposed asset */
  DISPOSED = "DSP"
}

/**
 * MoneyWorks canonical depreciation type classification
 * Source: moneyworks_appendix_assets.html - "Type" field
 */
export enum MoneyWorksDepreciationType {
  /** Straight line depreciation */
  STRAIGHT_LINE = "SL",
  
  /** Diminishing value depreciation */
  DIMINISHING_VALUE = "DV"
}

// ============================================================================
// CANONICAL MONEYWORKS ASSET FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks asset fields as defined in manual
 * Source: moneyworks_appendix_assets.html - Assets table
 */
export const MONEYWORKS_ASSET_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique asset identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "Code",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "A unique code for the asset",
    manualSource: "moneyworks_appendix_assets.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 63,
    canonicalDescription: "The description of the asset",
    manualSource: "moneyworks_appendix_assets.html",
    isRequired: true
  },
  {
    fieldName: "Category",
    dataType: "T" as const,
    maxLength: 7,
    canonicalDescription: "The Asset Category of the asset",
    manualSource: "moneyworks_appendix_assets.html",
    relationshipTarget: "AssetCategories",
    relationshipRule: "Must reference valid Asset Category"
  },
  {
    fieldName: "SerialNum",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "A serial number for the asset",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Qty",
    dataType: "N" as const,
    canonicalDescription: "The quantity of the asset (normally 1, but might be a set of similar assets such as desks)",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "ExpectedLife",
    dataType: "N" as const,
    canonicalDescription: "The expected life in years of the asset",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Cost",
    dataType: "N" as const,
    canonicalDescription: "The cost (per unit) of the asset",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "AccumDepreciation",
    dataType: "N" as const,
    canonicalDescription: "The accumulated depreciation recorded against the asset",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "AcquisitionDate",
    dataType: "D" as const,
    canonicalDescription: "Date on which the asset was acquired",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "LastDepreciatedDate",
    dataType: "D" as const,
    canonicalDescription: "Date on which the asset was last depreciated",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "AcquisitionSeq",
    dataType: "N" as const,
    canonicalDescription: "The sequencenumber of the purchase transaction for the asset",
    manualSource: "moneyworks_appendix_assets.html",
    relationshipTarget: "Transactions",
    relationshipRule: "References Transaction.SequenceNumber for asset acquisition"
  },
  {
    fieldName: "DisposalSeq",
    dataType: "N" as const,
    canonicalDescription: "The sequencenumber of the last disposal transaction for the asset",
    manualSource: "moneyworks_appendix_assets.html",
    relationshipTarget: "Transactions",
    relationshipRule: "References Transaction.SequenceNumber for asset disposal"
  },
  {
    fieldName: "Location",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Where the asset is kept",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Dept",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The asset department (must be a MoneyWorks Department)",
    manualSource: "moneyworks_appendix_assets.html",
    relationshipTarget: "Departments",
    relationshipRule: "Must reference valid MoneyWorks Department"
  },
  {
    fieldName: "PrivateUsePercent",
    dataType: "N" as const,
    canonicalDescription: "The percent of the asset used privately",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Status",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "The asset status (NEW, ACT - active, NDP - non-depreciable, OTH - other, DSP - disposed)",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "LastModifiedBy",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "User who last modified the asset record",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "LastRevaluedDate",
    dataType: "D" as const,
    canonicalDescription: "Date of last revaluation (blank if none)",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "ExpectedResidualValue",
    dataType: "N" as const,
    canonicalDescription: "Expected residual value",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "RevalSurplusImpairAmt",
    dataType: "N" as const,
    canonicalDescription: "Total revalued amount (positive if surplus)",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "Scriptable number",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "AccumDepnAdj",
    dataType: "N" as const,
    canonicalDescription: "Total adjustments to accumulated depreciation due to revaluations",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "BookValue",
    dataType: "N" as const,
    canonicalDescription: "The current book value",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "DisposalDate",
    dataType: "D" as const,
    canonicalDescription: "Date last disposed",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "GainLossOnDisposal",
    dataType: "N" as const,
    canonicalDescription: "The gain or loss on asset disposal",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Colour",
    dataType: "N" as const,
    canonicalDescription: "Colour of record",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Type",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "Depreciation type, SL (straight line) or DV (diminishing value)",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Rate",
    dataType: "N" as const,
    canonicalDescription: "Depreciation rate",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Comment",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Comments on asset",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Custom1",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Custom2",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Custom3",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Custom4",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_assets.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS ASSET TERMINOLOGY
// ============================================================================

/**
 * MoneyWorks canonical asset management terminology
 * Source: moneyworks_appendix_assets.html
 */
export const MONEYWORKS_ASSET_CANONICAL_TERMS = {
  // Asset classification (MoneyWorks canonical)
  FIXED_ASSET: "Fixed Asset",                    // MoneyWorks asset register entry
  ASSET_CODE: "Asset Code",                      // Unique asset identifier
  ASSET_DESCRIPTION: "Asset Description",        // Asset name/description
  ASSET_CATEGORY: "Asset Category",              // Classification grouping
  
  // Asset lifecycle (MoneyWorks canonical)
  ACQUISITION: "Acquisition",                    // Asset purchase/addition
  DEPRECIATION: "Depreciation",                  // Value reduction over time
  REVALUATION: "Revaluation",                    // Asset value reassessment
  DISPOSAL: "Disposal",                          // Asset sale/removal
  
  // Depreciation methods (MoneyWorks canonical)
  STRAIGHT_LINE: "Straight Line Depreciation",   // Even depreciation over life
  DIMINISHING_VALUE: "Diminishing Value",        // Accelerated depreciation
  
  // Asset status (MoneyWorks canonical)
  ACTIVE_ASSET: "Active Asset",                  // Currently in use
  NON_DEPRECIABLE: "Non-Depreciable Asset",      // Does not depreciate
  DISPOSED_ASSET: "Disposed Asset",              // No longer owned
  
  // Financial tracking (MoneyWorks canonical)
  BOOK_VALUE: "Book Value",                      // Current accounting value
  ACCUMULATED_DEPRECIATION: "Accumulated Depreciation", // Total depreciation to date
  EXPECTED_LIFE: "Expected Life",                // Useful life in years
  RESIDUAL_VALUE: "Expected Residual Value",     // End-of-life value
  
  // Location and management (MoneyWorks canonical)
  ASSET_LOCATION: "Asset Location",              // Physical location
  ASSET_DEPARTMENT: "Asset Department",          // Cost center assignment
  PRIVATE_USE: "Private Use Percentage",         // Personal use portion
  SERIAL_NUMBER: "Serial Number"                 // Manufacturer identifier
} as const;

// ============================================================================
// CANONICAL MONEYWORKS ASSET RELATIONSHIPS
// ============================================================================

/**
 * MoneyWorks Assets entity relationships
 * Source: moneyworks_appendix_assets.html + cross-entity analysis
 */
export const MONEYWORKS_ASSET_RELATIONSHIPS = [
  {
    relationshipType: "references" as const,
    sourceEntity: "Assets",
    targetEntity: "AssetCategories",
    sourceField: "Category",
    targetField: "Code",
    canonicalDescription: "Asset belongs to specific asset category for classification",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Asset categories group assets for reporting and management",
    cardinality: "many-to-one" as const
  },
  {
    relationshipType: "references" as const,
    sourceEntity: "Assets",
    targetEntity: "Departments",
    sourceField: "Dept",
    targetField: "Code",
    canonicalDescription: "Asset assigned to department for cost center tracking",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Department assignment enables cost allocation and responsibility tracking",
    cardinality: "many-to-one" as const
  },
  {
    relationshipType: "references" as const,
    sourceEntity: "Assets",
    targetEntity: "Transactions",
    sourceField: "AcquisitionSeq",
    targetField: "SequenceNumber",
    canonicalDescription: "Asset acquisition linked to purchase transaction",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Transaction reference provides audit trail for asset acquisition",
    cardinality: "many-to-one" as const
  },
  {
    relationshipType: "references" as const,
    sourceEntity: "Assets",
    targetEntity: "Transactions",
    sourceField: "DisposalSeq",
    targetField: "SequenceNumber",
    canonicalDescription: "Asset disposal linked to sale/disposal transaction",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Transaction reference provides audit trail for asset disposal",
    cardinality: "many-to-one" as const
  },
  {
    relationshipType: "has_many" as const,
    sourceEntity: "Assets",
    targetEntity: "AssetLog",
    sourceField: "Seq",
    targetField: "ParentSeq",
    canonicalDescription: "Asset has detailed audit trail of all lifecycle actions",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "AssetLog provides complete history of depreciation, revaluations, and transactions",
    cardinality: "one-to-many" as const
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS ASSET BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks Assets canonical business rules
 * Extracted from manual and MoneyWorks asset management logic
 */
export const MONEYWORKS_ASSET_BUSINESS_RULES = [
  {
    ruleType: "asset_identification" as const,
    canonicalRule: "Asset Code must be unique across all assets",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Code serves as primary identifier for asset tracking",
    validation: "Code field is required and must be unique within Assets table"
  },
  {
    ruleType: "depreciation_lifecycle" as const,
    canonicalRule: "Active assets depreciate according to configured method and rate",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Depreciation reduces asset value over expected life",
    validation: "Status must be ACT and Type must be SL or DV for depreciation"
  },
  {
    ruleType: "category_classification" as const,
    canonicalRule: "Asset Category must reference valid MoneyWorks Asset Category",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Categories enable asset grouping and reporting",
    validation: "Category field must match existing AssetCategories.Code"
  },
  {
    ruleType: "department_assignment" as const,
    canonicalRule: "Asset Department must reference valid MoneyWorks Department",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Department assignment enables cost center allocation",
    validation: "Dept field must match existing Departments.Code when specified"
  },
  {
    ruleType: "transaction_traceability" as const,
    canonicalRule: "Acquisition and disposal must link to actual transactions",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Transaction links provide complete audit trail",
    validation: "AcquisitionSeq/DisposalSeq must reference valid Transaction records"
  },
  {
    ruleType: "book_value_calculation" as const,
    canonicalRule: "Book value equals cost minus accumulated depreciation plus adjustments",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Book value represents current accounting value",
    validation: "BookValue = Cost - AccumDepreciation + AccumDepnAdj"
  },
  {
    ruleType: "status_lifecycle" as const,
    canonicalRule: "Asset status controls depreciation and disposal processing",
    manualSource: "moneyworks_appendix_assets.html",
    businessContext: "Status determines available operations and financial treatment",
    validation: "Status must be NEW, ACT, NDP, OTH, or DSP"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS ASSET USAGE PATTERNS
// ============================================================================

/**
 * MoneyWorks Assets canonical usage patterns
 * Universal business applications across industries
 */
export const MONEYWORKS_ASSET_USAGE_PATTERNS = [
  {
    scenario: "Fixed Asset Management",
    businessTypes: ["manufacturing", "construction", "professional services"],
    canonicalPattern: "Track depreciation and lifecycle of long-term business assets",
    example: "Office Equipment: Computers, furniture, machinery with depreciation schedules",
    moneyWorksImplementation: "Active assets with SL/DV depreciation, department allocation"
  },
  {
    scenario: "Asset Category Reporting",
    businessTypes: ["all business types"],
    canonicalPattern: "Group assets by type for financial reporting and management",
    example: "Asset Categories: Buildings, Equipment, Vehicles, IT Assets",
    moneyWorksImplementation: "Category field links to AssetCategories for grouping"
  },
  {
    scenario: "Department Cost Allocation",
    businessTypes: ["multi-department organizations"],
    canonicalPattern: "Assign assets to departments for cost center responsibility",
    example: "IT Equipment: Assets assigned to specific departments for cost tracking",
    moneyWorksImplementation: "Dept field assigns assets to cost centers"
  },
  {
    scenario: "Asset Lifecycle Tracking",
    businessTypes: ["asset-intensive businesses"],
    canonicalPattern: "Complete audit trail from acquisition through disposal",
    example: "Vehicle Fleet: Purchase, depreciation, maintenance, eventual sale",
    moneyWorksImplementation: "AcquisitionSeq/DisposalSeq link transactions, AssetLog tracks history"
  },
  {
    scenario: "Private Use Assets",
    businessTypes: ["small business", "partnerships"],
    canonicalPattern: "Track business assets with partial private use",
    example: "Company Vehicle: 70% business use, 30% personal use for tax purposes",
    moneyWorksImplementation: "PrivateUsePercent field for tax and depreciation calculations"
  },
  {
    scenario: "Asset Revaluation",
    businessTypes: ["property investment", "asset-heavy industries"],
    canonicalPattern: "Revalue assets to reflect current market values",
    example: "Real Estate: Property revaluation based on market assessments",
    moneyWorksImplementation: "RevalSurplusImpairAmt tracks revaluation adjustments"
  },
  {
    scenario: "Non-Depreciable Assets",
    businessTypes: ["art dealers", "land investors", "collectibles"],
    canonicalPattern: "Assets that maintain or appreciate in value",
    example: "Investment Art: Artwork, antiques, collectibles that don't depreciate",
    moneyWorksImplementation: "Status NDP prevents automatic depreciation"
  }
] as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate canonical MoneyWorks asset status
 */
export function validateAssetStatus(status: string): {
  isValid: boolean;
  canonicalStatus?: MoneyWorksAssetStatus;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const validStatuses = ["NEW", "ACT", "NDP", "OTH", "DSP"];
  if (!validStatuses.includes(status)) {
    warnings.push(`Invalid Asset Status "${status}". MoneyWorks canonical values: NEW, ACT (active), NDP (non-depreciable), OTH (other), DSP (disposed)`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalStatus: status as MoneyWorksAssetStatus,
    warnings
  };
}

/**
 * Validate canonical MoneyWorks depreciation type
 */
export function validateDepreciationType(type: string): {
  isValid: boolean;
  canonicalType?: MoneyWorksDepreciationType;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const validTypes = ["SL", "DV"];
  if (!validTypes.includes(type)) {
    warnings.push(`Invalid Depreciation Type "${type}". MoneyWorks canonical values: SL (straight line), DV (diminishing value)`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalType: type as MoneyWorksDepreciationType,
    warnings
  };
}

/**
 * Calculate book value using MoneyWorks canonical rules
 */
export function calculateCanonicalBookValue(cost: number, accumDepreciation: number, accumDepnAdj: number): number {
  // MoneyWorks canonical calculation: Cost - Accumulated Depreciation + Accumulated Depreciation Adjustments
  return cost - accumDepreciation + accumDepnAdj;
}

/**
 * Determine if asset requires depreciation based on status
 */
export function requiresDepreciation(status: MoneyWorksAssetStatus): boolean {
  return status === MoneyWorksAssetStatus.ACTIVE;
}

/**
 * Get canonical asset lifecycle explanation
 */
export function getCanonicalAssetLifecycle(status: MoneyWorksAssetStatus): string {
  switch (status) {
    case MoneyWorksAssetStatus.NEW:
      return "New asset - recently acquired, may not yet be in service";
    case MoneyWorksAssetStatus.ACTIVE:
      return "Active asset - in service and depreciating according to configured method";
    case MoneyWorksAssetStatus.NON_DEPRECIABLE:
      return "Non-depreciable asset - maintains original value (e.g., land, artwork)";
    case MoneyWorksAssetStatus.OTHER:
      return "Other status - special circumstances or temporary status";
    case MoneyWorksAssetStatus.DISPOSED:
      return "Disposed asset - sold, scrapped, or otherwise removed from service";
    default:
      return "Unknown asset status";
  }
}

/**
 * Validate canonical MoneyWorks asset definitions
 */
export function validateAssetCanonical(asset: {
  Code: string;
  Description: string;
  Category?: string;
  Status: string;
  Type?: string;
  Dept?: string;
  Cost?: number;
  AccumDepreciation?: number;
  AccumDepnAdj?: number;
  AcquisitionSeq?: number;
  DisposalSeq?: number;
}): {
  isValid: boolean;
  warnings: string[];
  canonicalValidation: string;
} {
  const warnings: string[] = [];
  
  // Validate Code
  if (!asset.Code || asset.Code.trim().length === 0) {
    warnings.push("Code required - must be unique asset identifier");
  }
  
  if (asset.Code && asset.Code.length > 19) {
    warnings.push("Code exceeds maximum length of 19 characters");
  }
  
  // Validate Description
  if (!asset.Description || asset.Description.trim().length === 0) {
    warnings.push("Description required - must describe the asset");
  }
  
  if (asset.Description && asset.Description.length > 63) {
    warnings.push("Description exceeds maximum length of 63 characters");
  }
  
  // Validate Status
  const statusValidation = validateAssetStatus(asset.Status);
  if (!statusValidation.isValid) {
    warnings.push(...statusValidation.warnings);
  }
  
  // Validate Type if provided
  if (asset.Type) {
    const typeValidation = validateDepreciationType(asset.Type);
    if (!typeValidation.isValid) {
      warnings.push(...typeValidation.warnings);
    }
  }
  
  // Validate relationships
  const relationshipValidation = validateAssetRelationships({
    category: asset.Category,
    dept: asset.Dept,
    acquisitionSeq: asset.AcquisitionSeq,
    disposalSeq: asset.DisposalSeq
  });
  
  if (!relationshipValidation.isValid) {
    warnings.push(...relationshipValidation.warnings);
  }
  
  // Validate book value calculation if all components present
  if (asset.Cost !== undefined && asset.AccumDepreciation !== undefined && asset.AccumDepnAdj !== undefined) {
    const calculatedBookValue = calculateCanonicalBookValue(asset.Cost, asset.AccumDepreciation, asset.AccumDepnAdj);
    if (calculatedBookValue < 0) {
      warnings.push("Calculated book value is negative - check depreciation and adjustment amounts");
    }
  }
  
  const canonicalValidation = warnings.length === 0 
    ? "Valid MoneyWorks asset - ready for asset management system"
    : "Asset validation failed - check MoneyWorks canonical requirements";
  
  return {
    isValid: warnings.length === 0,
    warnings,
    canonicalValidation
  };
}

/**
 * Get canonical MoneyWorks asset explanation
 */
export function getCanonicalAssetExplanation(code: string, description: string, status: MoneyWorksAssetStatus): string {
  const lifecycle = getCanonicalAssetLifecycle(status);
  return `MoneyWorks Asset "${code}" (${description}): ${lifecycle}`;
}

/**
 * Validate asset entity relationships
 */
export function validateAssetRelationships(asset: {
  category?: string;
  dept?: string;
  acquisitionSeq?: number;
  disposalSeq?: number;
}): {
  isValid: boolean;
  warnings: string[];
  relationshipValidation: string;
  requiredChecks: string[];
} {
  const warnings: string[] = [];
  const requiredChecks: string[] = [];
  
  if (asset.category && asset.category.length > 7) {
    warnings.push("Asset Category must reference valid MoneyWorks Asset Category (max 7 characters)");
    requiredChecks.push(`Verify Category "${asset.category}" exists in AssetCategories table`);
  } else if (asset.category) {
    requiredChecks.push(`Verify Category "${asset.category}" matches existing AssetCategories.Code`);
  }
  
  if (asset.dept && asset.dept.length > 5) {
    warnings.push("Asset Department must reference valid MoneyWorks Department (max 5 characters)");
    requiredChecks.push(`Verify Department "${asset.dept}" exists in Departments table`);
  } else if (asset.dept) {
    requiredChecks.push(`Verify Department "${asset.dept}" matches existing Departments.Code`);
  }
  
  if (asset.acquisitionSeq && asset.acquisitionSeq <= 0) {
    warnings.push("AcquisitionSeq must reference valid Transaction sequence number");
  } else if (asset.acquisitionSeq) {
    requiredChecks.push(`Verify AcquisitionSeq ${asset.acquisitionSeq} exists in Transactions table`);
  }
  
  if (asset.disposalSeq && asset.disposalSeq <= 0) {
    warnings.push("DisposalSeq must reference valid Transaction sequence number");
  } else if (asset.disposalSeq) {
    requiredChecks.push(`Verify DisposalSeq ${asset.disposalSeq} exists in Transactions table`);
  }
  
  const relationshipValidation = warnings.length === 0 
    ? "MoneyWorks Asset relationships are valid - ready for cross-entity validation"
    : "Asset relationship validation failed - check foreign key references";
  
  return {
    isValid: warnings.length === 0,
    warnings,
    relationshipValidation,
    requiredChecks
  };
}

/**
 * Calculate depreciation for asset based on method
 */
export function calculateDepreciation(
  cost: number,
  expectedLife: number,
  type: MoneyWorksDepreciationType,
  rate?: number,
  currentBookValue?: number
): {
  annualDepreciation: number;
  calculationMethod: string;
  explanation: string;
} {
  let annualDepreciation: number;
  let calculationMethod: string;
  let explanation: string;
  
  if (type === MoneyWorksDepreciationType.STRAIGHT_LINE) {
    annualDepreciation = cost / expectedLife;
    calculationMethod = "Straight Line Depreciation";
    explanation = `Annual depreciation = Cost (${cost}) / Expected Life (${expectedLife} years) = ${annualDepreciation}`;
  } else if (type === MoneyWorksDepreciationType.DIMINISHING_VALUE) {
    const depreciationRate = rate || (1 / expectedLife);
    const bookValue = currentBookValue || cost;
    annualDepreciation = bookValue * depreciationRate;
    calculationMethod = "Diminishing Value Depreciation";
    explanation = `Annual depreciation = Book Value (${bookValue}) × Rate (${depreciationRate}) = ${annualDepreciation}`;
  } else {
    annualDepreciation = 0;
    calculationMethod = "Unknown Method";
    explanation = "Invalid depreciation type specified";
  }
  
  return {
    annualDepreciation,
    calculationMethod,
    explanation
  };
}

/**
 * Get asset financial summary
 */
export function getAssetFinancialSummary(asset: {
  Code: string;
  Cost: number;
  AccumDepreciation: number;
  AccumDepnAdj: number;
  ExpectedResidualValue?: number;
}): {
  bookValue: number;
  totalDepreciation: number;
  adjustedValue: number;
  depreciationPercentage: number;
  financialSummary: string;
} {
  const bookValue = calculateCanonicalBookValue(asset.Cost, asset.AccumDepreciation, asset.AccumDepnAdj);
  const totalDepreciation = asset.AccumDepreciation - asset.AccumDepnAdj;
  const adjustedValue = asset.Cost + asset.AccumDepnAdj;
  const depreciationPercentage = (totalDepreciation / asset.Cost) * 100;
  
  const residualInfo = asset.ExpectedResidualValue 
    ? `, Expected Residual: ${asset.ExpectedResidualValue}`
    : "";
  
  const financialSummary = `Asset ${asset.Code}: Cost ${asset.Cost}, Book Value ${bookValue}, Depreciated ${depreciationPercentage.toFixed(1)}%${residualInfo}`;
  
  return {
    bookValue,
    totalDepreciation,
    adjustedValue,
    depreciationPercentage,
    financialSummary
  };
}

export default {
  MONEYWORKS_ASSET_FIELDS,
  MONEYWORKS_ASSET_CANONICAL_TERMS,
  MONEYWORKS_ASSET_RELATIONSHIPS,
  MONEYWORKS_ASSET_BUSINESS_RULES,
  MONEYWORKS_ASSET_USAGE_PATTERNS,
  MoneyWorksAssetStatus,
  MoneyWorksDepreciationType
};