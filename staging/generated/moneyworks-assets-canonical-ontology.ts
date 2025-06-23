/**
 * MoneyWorks Assets Entity - Canonical Ontology
 * 
 * PURE MoneyWorks staging definitions extracted from official manual
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
 * MoneyWorks staging asset status classification
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
 * MoneyWorks staging depreciation type classification
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
 * MoneyWorks staging asset management terminology
 * Source: moneyworks_appendix_assets.html
 */
export const MONEYWORKS_ASSET_CANONICAL_TERMS = {
  // Asset classification (MoneyWorks staging)
  FIXED_ASSET: "Fixed Asset",                    // MoneyWorks asset register entry
  ASSET_CODE: "Asset Code",                      // Unique asset identifier
  ASSET_DESCRIPTION: "Asset Description",        // Asset name/description
  ASSET_CATEGORY: "Asset Category",              // Classification grouping
  
  // Asset lifecycle (MoneyWorks staging)
  ACQUISITION: "Acquisition",                    // Asset purchase/addition
  DEPRECIATION: "Depreciation",                  // Value reduction over time
  REVALUATION: "Revaluation",                    // Asset value reassessment
  DISPOSAL: "Disposal",                          // Asset sale/removal
  
  // Depreciation methods (MoneyWorks staging)
  STRAIGHT_LINE: "Straight Line Depreciation",   // Even depreciation over life
  DIMINISHING_VALUE: "Diminishing Value",        // Accelerated depreciation
  
  // Asset status (MoneyWorks staging)
  ACTIVE_ASSET: "Active Asset",                  // Currently in use
  NON_DEPRECIABLE: "Non-Depreciable Asset",      // Does not depreciate
  DISPOSED_ASSET: "Disposed Asset",              // No longer owned
  
  // Financial tracking (MoneyWorks staging)
  BOOK_VALUE: "Book Value",                      // Current accounting value
  ACCUMULATED_DEPRECIATION: "Accumulated Depreciation", // Total depreciation to date
  EXPECTED_LIFE: "Expected Life",                // Useful life in years
  RESIDUAL_VALUE: "Expected Residual Value",     // End-of-life value
  
  // Location and management (MoneyWorks staging)
  ASSET_LOCATION: "Asset Location",              // Physical location
  ASSET_DEPARTMENT: "Asset Department",          // Cost center assignment
  PRIVATE_USE: "Private Use Percentage",         // Personal use portion
  SERIAL_NUMBER: "Serial Number"                 // Manufacturer identifier
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate staging MoneyWorks asset status
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
 * Validate staging MoneyWorks depreciation type
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
 * Calculate book value using MoneyWorks staging rules
 */
export function calculateCanonicalBookValue(cost: number, accumDepreciation: number, accumDepnAdj: number): number {
  // MoneyWorks staging calculation: Cost - Accumulated Depreciation + Accumulated Depreciation Adjustments
  return cost - accumDepreciation + accumDepnAdj;
}

/**
 * Determine if asset requires depreciation based on status
 */
export function requiresDepreciation(status: MoneyWorksAssetStatus): boolean {
  return status === MoneyWorksAssetStatus.ACTIVE;
}

/**
 * Get staging asset lifecycle explanation
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
} {
  const warnings: string[] = [];
  
  if (asset.category && asset.category.length > 7) {
    warnings.push("Asset Category must reference valid MoneyWorks Asset Category (max 7 characters)");
  }
  
  if (asset.dept && asset.dept.length > 5) {
    warnings.push("Asset Department must reference valid MoneyWorks Department (max 5 characters)");
  }
  
  if (asset.acquisitionSeq && asset.acquisitionSeq <= 0) {
    warnings.push("AcquisitionSeq must reference valid Transaction sequence number");
  }
  
  if (asset.disposalSeq && asset.disposalSeq <= 0) {
    warnings.push("DisposalSeq must reference valid Transaction sequence number");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

export default {
  MONEYWORKS_ASSET_FIELDS,
  MONEYWORKS_ASSET_CANONICAL_TERMS,
  MoneyWorksAssetStatus,
  MoneyWorksDepreciationType
};