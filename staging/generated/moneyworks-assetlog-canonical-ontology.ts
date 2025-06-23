/**
 * MoneyWorks AssetLog Entity - Canonical Ontology
 * 
 * PURE MoneyWorks staging definitions extracted from official manual
 * Source: moneyworks_appendix_assets.html - AssetLog subfile
 * Authority: MoneyWorks Manual - AssetLog Field Descriptions
 * 
 * CRITICAL DISCOVERY: AssetLog is a comprehensive audit trail subfile that tracks
 * every action in an asset's lifecycle - acquisitions, depreciation, revaluations,
 * disposals, and administrative actions. Provides complete financial history.
 */

// ============================================================================
// CANONICAL MONEYWORKS ASSETLOG ACTION TYPES
// ============================================================================

/**
 * MoneyWorks staging asset action types
 * Source: moneyworks_appendix_assets.html - AssetLog "Action" field
 */
export enum MoneyWorksAssetLogAction {
  /** Acquisition - asset purchase/addition */
  ACQUISITION = "AA",
  
  /** Disposal - complete asset disposal */
  DISPOSAL = "AD",
  
  /** Part disposal - partial asset disposal */
  PART_DISPOSAL = "AP",
  
  /** Straight line depreciation */
  STRAIGHT_LINE_DEPRECIATION = "DS",
  
  /** Diminishing value depreciation */
  DIMINISHING_VALUE_DEPRECIATION = "DD",
  
  /** Memo entry */
  MEMO = "ME",
  
  /** Revaluation */
  REVALUATION = "RV"
}

// ============================================================================
// CANONICAL MONEYWORKS ASSETLOG FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks AssetLog fields as defined in manual
 * Source: moneyworks_appendix_assets.html - AssetLog table
 */
export const MONEYWORKS_ASSETLOG_FIELDS = [
  {
    fieldName: "ParentSeq",
    dataType: "N" as const,
    canonicalDescription: "Sequencenumber of asset",
    manualSource: "moneyworks_appendix_assets.html",
    isRequired: true,
    relationshipTarget: "Assets",
    relationshipRule: "References parent Asset record"
  },
  {
    fieldName: "Action",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "Type of action: AA - acquisition, AD - disposal, AP - part disposal, DS - straight line depreciation, DD - diminishing value depreciation, ME - memo, RV - revaluation",
    manualSource: "moneyworks_appendix_assets.html",
    isRequired: true
  },
  {
    fieldName: "Date",
    dataType: "D" as const,
    canonicalDescription: "Date of action",
    manualSource: "moneyworks_appendix_assets.html",
    isRequired: true
  },
  {
    fieldName: "Qty",
    dataType: "N" as const,
    canonicalDescription: "Quantity",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Depreciation",
    dataType: "N" as const,
    canonicalDescription: "Depreciation due to action",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Adjustment1",
    dataType: "N" as const,
    canonicalDescription: "Adjustments",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Adjustment2",
    dataType: "N" as const,
    canonicalDescription: "Adjustments",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "Rate",
    dataType: "N" as const,
    canonicalDescription: "Depreciation rate used",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "PrivateUsePercent",
    dataType: "N" as const,
    canonicalDescription: "Private use percent",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "AccumDepreciation",
    dataType: "N" as const,
    canonicalDescription: "Accumulated depreciation after action",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "AccumReval",
    dataType: "N" as const,
    canonicalDescription: "Accumulated revaluation after action",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "ClosingValue",
    dataType: "N" as const,
    canonicalDescription: "Book value after action",
    manualSource: "moneyworks_appendix_assets.html"
  },
  {
    fieldName: "TransactionSeq",
    dataType: "N" as const,
    canonicalDescription: "Sequencenumber of transaction associated with action",
    manualSource: "moneyworks_appendix_assets.html",
    relationshipTarget: "Transactions",
    relationshipRule: "References Transaction.SequenceNumber when action has associated transaction"
  },
  {
    fieldName: "Memo",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User memo",
    manualSource: "moneyworks_appendix_assets.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS ASSETLOG TERMINOLOGY
// ============================================================================

/**
 * MoneyWorks staging AssetLog terminology
 * Source: moneyworks_appendix_assets.html
 */
export const MONEYWORKS_ASSETLOG_CANONICAL_TERMS = {
  // Asset lifecycle actions (MoneyWorks staging)
  ACQUISITION_ACTION: "Asset Acquisition",       // AA - asset purchase/addition
  DISPOSAL_ACTION: "Asset Disposal",             // AD - complete disposal
  PART_DISPOSAL_ACTION: "Part Disposal",         // AP - partial disposal
  DEPRECIATION_ACTION: "Depreciation",           // DS/DD - value reduction
  REVALUATION_ACTION: "Revaluation",             // RV - value reassessment
  MEMO_ACTION: "Memo Entry",                     // ME - administrative note
  
  // Depreciation methods (MoneyWorks staging)
  STRAIGHT_LINE_DEPN: "Straight Line Depreciation",  // DS - even depreciation
  DIMINISHING_VALUE_DEPN: "Diminishing Value Depreciation", // DD - accelerated
  
  // Financial tracking (MoneyWorks staging)
  ACTION_DATE: "Action Date",                    // When action occurred
  DEPRECIATION_AMOUNT: "Depreciation Amount",    // Amount depreciated
  ACCUMULATED_DEPRECIATION: "Accumulated Depreciation", // Total depreciation
  ACCUMULATED_REVALUATION: "Accumulated Revaluation",   // Total revaluations
  CLOSING_VALUE: "Closing Value",                // Book value after action
  
  // Relationships (MoneyWorks staging)
  PARENT_ASSET: "Parent Asset",                  // Asset this log belongs to
  RELATED_TRANSACTION: "Related Transaction",    // Associated transaction
  
  // Adjustments (MoneyWorks staging)
  ADJUSTMENT_ONE: "Adjustment 1",                // First adjustment amount
  ADJUSTMENT_TWO: "Adjustment 2",                // Second adjustment amount
  DEPRECIATION_RATE: "Depreciation Rate",        // Rate used for calculation
  PRIVATE_USE_PERCENTAGE: "Private Use Percent", // Personal use portion
  
  // Administrative (MoneyWorks staging)
  ACTION_MEMO: "Action Memo",                    // User notes
  AUDIT_TRAIL: "Asset Audit Trail"              // Complete action history
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate staging MoneyWorks AssetLog action type
 */
export function validateAssetLogAction(action: string): {
  isValid: boolean;
  canonicalAction?: MoneyWorksAssetLogAction;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const validActions = ["AA", "AD", "AP", "DS", "DD", "ME", "RV"];
  if (!validActions.includes(action)) {
    warnings.push(`Invalid AssetLog Action "${action}". MoneyWorks canonical values: AA (acquisition), AD (disposal), AP (part disposal), DS (straight line depreciation), DD (diminishing value depreciation), ME (memo), RV (revaluation)`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalAction: action as MoneyWorksAssetLogAction,
    warnings
  };
}

/**
 * Determine if action is a depreciation action
 */
export function isDepreciationAction(action: MoneyWorksAssetLogAction): boolean {
  return action === MoneyWorksAssetLogAction.STRAIGHT_LINE_DEPRECIATION || 
         action === MoneyWorksAssetLogAction.DIMINISHING_VALUE_DEPRECIATION;
}

/**
 * Determine if action affects asset quantity
 */
export function affectsQuantity(action: MoneyWorksAssetLogAction): boolean {
  return action === MoneyWorksAssetLogAction.ACQUISITION ||
         action === MoneyWorksAssetLogAction.DISPOSAL ||
         action === MoneyWorksAssetLogAction.PART_DISPOSAL;
}

/**
 * Determine if action requires transaction reference
 */
export function requiresTransaction(action: MoneyWorksAssetLogAction): boolean {
  return action === MoneyWorksAssetLogAction.ACQUISITION ||
         action === MoneyWorksAssetLogAction.DISPOSAL ||
         action === MoneyWorksAssetLogAction.PART_DISPOSAL ||
         action === MoneyWorksAssetLogAction.REVALUATION;
}

/**
 * Get staging action explanation
 */
export function getCanonicalActionExplanation(action: MoneyWorksAssetLogAction): string {
  switch (action) {
    case MoneyWorksAssetLogAction.ACQUISITION:
      return "Asset Acquisition - recording the purchase or addition of an asset";
    case MoneyWorksAssetLogAction.DISPOSAL:
      return "Asset Disposal - recording the complete sale or removal of an asset";
    case MoneyWorksAssetLogAction.PART_DISPOSAL:
      return "Part Disposal - recording the partial sale or removal of an asset";
    case MoneyWorksAssetLogAction.STRAIGHT_LINE_DEPRECIATION:
      return "Straight Line Depreciation - recording even depreciation over asset life";
    case MoneyWorksAssetLogAction.DIMINISHING_VALUE_DEPRECIATION:
      return "Diminishing Value Depreciation - recording accelerated depreciation";
    case MoneyWorksAssetLogAction.MEMO:
      return "Memo Entry - administrative note or reminder about the asset";
    case MoneyWorksAssetLogAction.REVALUATION:
      return "Revaluation - recording adjustment to asset value based on current market";
    default:
      return "Unknown action type";
  }
}

/**
 * Validate AssetLog entity relationships
 */
export function validateAssetLogRelationships(assetLog: {
  parentSeq?: number;
  transactionSeq?: number;
  action?: string;
}): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!assetLog.parentSeq || assetLog.parentSeq <= 0) {
    warnings.push("ParentSeq is required and must reference valid Asset sequence number");
  }
  
  if (assetLog.action && requiresTransaction(assetLog.action as MoneyWorksAssetLogAction)) {
    if (!assetLog.transactionSeq || assetLog.transactionSeq <= 0) {
      warnings.push(`Action "${assetLog.action}" requires valid TransactionSeq reference`);
    }
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Calculate impact of AssetLog action on asset values
 */
export function calculateActionImpact(
  action: MoneyWorksAssetLogAction,
  depreciation: number,
  adjustment1: number,
  adjustment2: number,
  previousAccumDepreciation: number,
  previousAccumReval: number
): {
  newAccumDepreciation: number;
  newAccumReval: number;
  depreciationImpact: number;
  revaluationImpact: number;
} {
  let newAccumDepreciation = previousAccumDepreciation;
  let newAccumReval = previousAccumReval;
  let depreciationImpact = 0;
  let revaluationImpact = 0;
  
  if (isDepreciationAction(action)) {
    depreciationImpact = depreciation;
    newAccumDepreciation = previousAccumDepreciation + depreciation;
  }
  
  if (action === MoneyWorksAssetLogAction.REVALUATION) {
    revaluationImpact = adjustment1 + adjustment2;
    newAccumReval = previousAccumReval + adjustment1 + adjustment2;
  }
  
  return {
    newAccumDepreciation,
    newAccumReval,
    depreciationImpact,
    revaluationImpact
  };
}

export default {
  MONEYWORKS_ASSETLOG_FIELDS,
  MONEYWORKS_ASSETLOG_CANONICAL_TERMS,
  MoneyWorksAssetLogAction
};