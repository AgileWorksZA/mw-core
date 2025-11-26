/**
 * MoneyWorks AssetCat Entity - Canonical Ontology
 *
 * PURPOSE: Asset categories with depreciation rules for fixed asset management
 * Source: Empirical API validation (MoneyWorks Now v9.2.3)
 * Date: 2025-11-25
 *
 * ARCHITECTURE:
 * - Defines depreciation methods (Straight Line, Diminishing Value) and rates
 * - Maps to GL accounts for asset accounting (Asset, Depreciation Expense, Accumulated Depreciation)
 * - Controls asset lifecycle behavior and depreciation calculations
 * - Supports revaluation, impairment, and gain/loss tracking
 * - Enables daily depreciation calculations
 *
 * KEY RELATIONSHIPS:
 * - AssetAccount (FK to Account.Code - asset GL account)
 * - DepExpense (FK to Account.Code - depreciation expense account)
 * - AccumDep (FK to Account.Code - accumulated depreciation account)
 * - GainLoss (FK to Account.Code - gain/loss on disposal account)
 * - Impairment (FK to Account.Code - impairment account)
 * - RevalSurplus (FK to Account.Code - revaluation surplus account)
 * - GainLossPrivate (FK to Account.Code - private use gain/loss account)
 * - DepExpensePrivate (FK to Account.Code - private use depreciation expense account)
 *
 * DEPRECIATION METHODS:
 * - SL: Straight Line (constant amount per period)
 * - DV: Diminishing Value (reducing balance/declining balance)
 *
 * BUSINESS LOGIC:
 * - Rate: For SL, typically represents percentage of cost per year
 * - Rate: For DV, typically represents percentage of book value per year
 * - LastDepreciatedDate: Tracks when category was last processed
 * - DailyDepreciation: Boolean flag to enable daily depreciation calculations
 * - Group: Optional grouping for reporting and classification
 *
 * COVERAGE: 23/23 fields (100%)
 * FOREIGN KEYS: 8/8 documented
 */

export enum MoneyWorksAssetCatType {
  SL = "SL",  // Straight Line depreciation
  DV = "DV"   // Diminishing Value (reducing balance)
}

export const MONEYWORKS_ASSETCAT_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique identifier for asset category",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "T" as const,
    maxLength: 14,
    canonicalDescription: "Timestamp of last modification (YYYYMMDDHHmmSS format)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isSystem: true
  },
  {
    fieldName: "Code",
    dataType: "T" as const,
    maxLength: 10,
    canonicalDescription: "Asset category code (primary business identifier)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isIndexed: true,
    notes: "User-defined code for asset category classification"
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Asset category description/name",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    notes: "Human-readable name for the asset category"
  },
  {
    fieldName: "AssetAccount",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "FK to Account.Code - Asset GL account for balance sheet presentation",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    notes: "Balance sheet account where asset cost is recorded"
  },
  {
    fieldName: "DepExpense",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "FK to Account.Code - Depreciation expense GL account for P&L",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    notes: "P&L account where depreciation expense is recorded"
  },
  {
    fieldName: "AccumDep",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "FK to Account.Code - Accumulated depreciation GL account (contra-asset)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    notes: "Contra-asset account where accumulated depreciation is recorded"
  },
  {
    fieldName: "GainLoss",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "FK to Account.Code - Gain/loss on disposal GL account",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    notes: "P&L account for gain or loss when asset is disposed"
  },
  {
    fieldName: "Custom",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Custom field for user-defined data",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    notes: "Free-form text field for custom classification or notes"
  },
  {
    fieldName: "Group",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Asset category group for classification and reporting",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    notes: "Optional grouping for reporting and analysis"
  },
  {
    fieldName: "Type",
    dataType: "A" as const,
    maxLength: 2,
    canonicalDescription: "Depreciation method: SL (Straight Line) or DV (Diminishing Value)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    enumValues: ["SL", "DV"],
    notes: "Determines how depreciation is calculated"
  },
  {
    fieldName: "Impairment",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "FK to Account.Code - Impairment expense GL account",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    notes: "Account for recording asset impairment losses"
  },
  {
    fieldName: "Rate",
    dataType: "N" as const,
    canonicalDescription: "Depreciation rate (percentage or absolute amount depending on Type)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    notes: "For SL: % of cost per year; For DV: % of book value per year"
  },
  {
    fieldName: "RevalSurplus",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "FK to Account.Code - Revaluation surplus/reserve GL account",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    notes: "Equity account for asset revaluation surplus"
  },
  {
    fieldName: "GainLossPrivate",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "FK to Account.Code - Gain/loss on disposal GL account for private use portion",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    notes: "Separate account for private use component of gain/loss"
  },
  {
    fieldName: "DepExpensePrivate",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "FK to Account.Code - Depreciation expense GL account for private use portion",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    notes: "Separate expense account for private use depreciation"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "User-defined numeric field for custom data",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    notes: "Extensibility field for custom numeric data"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User-defined text field for custom data",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    notes: "Extensibility field for custom text data"
  },
  {
    fieldName: "LastDepreciatedDate",
    dataType: "D" as const,
    canonicalDescription: "Date when assets in this category were last depreciated (YYYYMMDD format)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    isSystem: true,
    notes: "Tracks last depreciation run for assets in this category"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 65535,
    canonicalDescription: "Tagged/structured text field for extended metadata (XML/JSON)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    notes: "Extensibility field for structured data (key-value pairs, XML, JSON)"
  },
  {
    fieldName: "Comment",
    dataType: "T" as const,
    maxLength: 65535,
    canonicalDescription: "Free-form comments/notes about the asset category",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    notes: "Long-form text field for detailed notes and documentation"
  },
  {
    fieldName: "DailyDepreciation",
    dataType: "B" as const,
    canonicalDescription: "Boolean flag to enable daily depreciation calculations (vs. period-based)",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    notes: "When true, depreciation is calculated daily rather than at period end"
  }
] as const;

/**
 * ENTITY RELATIONSHIPS:
 *
 * AssetCat → Account (AssetAccount)
 * - Each asset category has one asset GL account
 * - Many asset categories can use the same asset account
 *
 * AssetCat → Account (DepExpense)
 * - Each asset category has one depreciation expense GL account
 * - Many asset categories can use the same expense account
 *
 * AssetCat → Account (AccumDep)
 * - Each asset category has one accumulated depreciation GL account
 * - Many asset categories can use the same accumulated depreciation account
 *
 * AssetCat → Account (GainLoss)
 * - Each asset category has one gain/loss on disposal GL account
 * - Many asset categories can use the same gain/loss account
 *
 * AssetCat → Account (Impairment)
 * - Each asset category has one impairment expense GL account
 * - Many asset categories can use the same impairment account
 *
 * AssetCat → Account (RevalSurplus)
 * - Each asset category has one revaluation surplus GL account
 * - Many asset categories can use the same surplus account
 *
 * AssetCat → Account (GainLossPrivate)
 * - Each asset category has one private use gain/loss GL account
 * - Many asset categories can use the same private gain/loss account
 *
 * AssetCat → Account (DepExpensePrivate)
 * - Each asset category has one private use depreciation expense GL account
 * - Many asset categories can use the same private expense account
 *
 * Asset → AssetCat (Category)
 * - Each asset belongs to one asset category
 * - One asset category can have many assets
 */

/**
 * DEPRECIATION CALCULATION LOGIC:
 *
 * Straight Line (SL):
 * - Annual Depreciation = (Cost - Residual Value) × Rate / 100
 * - Constant amount per period
 * - Rate typically represents % of depreciable amount per year
 *
 * Diminishing Value (DV):
 * - Annual Depreciation = Book Value × Rate / 100
 * - Decreasing amount per period
 * - Rate typically represents % of current book value per year
 *
 * Daily Depreciation:
 * - When DailyDepreciation flag is true
 * - Depreciation calculated on a daily basis
 * - More accurate for mid-period acquisitions and disposals
 *
 * Private Use:
 * - DepExpensePrivate and GainLossPrivate handle partial private use
 * - Allows split accounting for assets used partly for business, partly private
 */

/**
 * EPISTEMIC GROUNDING:
 *
 * EITOLOGY (Essence):
 * - AssetCat represents the classification and depreciation rules for fixed assets
 * - Fundamental concept: Asset categories standardize depreciation treatment
 * - Core essence: GL account mapping + depreciation method + rate
 *
 * AXIOLOGY (Value):
 * - Ensures consistent depreciation treatment across asset groups
 * - Simplifies asset setup by defining category-level defaults
 * - Enables compliance with accounting standards (IAS 16, GAAP)
 * - Supports tax depreciation reporting requirements
 *
 * TELEOLOGY (Purpose):
 * - Primary: Define depreciation rules for asset groups
 * - Secondary: Map assets to correct GL accounts automatically
 * - Tertiary: Support revaluation and impairment tracking
 * - Quaternary: Enable private use accounting for mixed-use assets
 *
 * MEREOLOGICAL COHERENCE:
 * - Part-of: Accounting system → Asset management → Asset categories
 * - Depends-on: Chart of accounts (Account entity)
 * - Used-by: Asset register (Asset entity)
 * - Constrains: Depreciation calculations in AssetLog
 */

export type MoneyWorksAssetCatRecord = {
  Slot?: number;
  SequenceNumber: number;
  LastModifiedTime?: string;
  Code: string;
  Description?: string;
  AssetAccount?: string;
  DepExpense?: string;
  AccumDep?: string;
  GainLoss?: string;
  Custom?: string;
  Group?: string;
  Type: MoneyWorksAssetCatType;
  Impairment?: string;
  Rate: number;
  RevalSurplus?: string;
  GainLossPrivate?: string;
  DepExpensePrivate?: string;
  UserNum?: number;
  UserText?: string;
  LastDepreciatedDate?: string;
  TaggedText?: string;
  Comment?: string;
  DailyDepreciation?: boolean;
};

/**
 * VALIDATION RULES:
 *
 * Business Rules:
 * 1. Code must be unique across all asset categories
 * 2. Type must be either "SL" or "DV"
 * 3. Rate must be > 0 and <= 100 (percentage)
 * 4. All GL account codes must exist in Account entity
 * 5. Asset account should be a balance sheet asset account
 * 6. DepExpense should be a P&L expense account
 * 7. AccumDep should be a contra-asset account
 * 8. Cannot delete category if assets exist with that category
 *
 * Data Integrity:
 * 1. Foreign key constraints to Account.Code for all GL account fields
 * 2. Type enum constraint (SL|DV)
 * 3. Rate range validation
 * 4. LastDepreciatedDate should not be in the future
 */

/**
 * USAGE EXAMPLES:
 *
 * Example 1: Computer Equipment (Straight Line, 3-year life)
 * {
 *   Code: "COMP",
 *   Description: "Computer Equipment",
 *   Type: "SL",
 *   Rate: 33.33,  // 100% / 3 years
 *   AssetAccount: "1600",
 *   DepExpense: "6100",
 *   AccumDep: "1601"
 * }
 *
 * Example 2: Motor Vehicles (Diminishing Value, 25% p.a.)
 * {
 *   Code: "VEH",
 *   Description: "Motor Vehicles",
 *   Type: "DV",
 *   Rate: 25.00,
 *   AssetAccount: "1650",
 *   DepExpense: "6150",
 *   AccumDep: "1651",
 *   GainLoss: "8100"
 * }
 *
 * Example 3: Office Equipment with Private Use
 * {
 *   Code: "OFFICE",
 *   Description: "Office Equipment",
 *   Type: "SL",
 *   Rate: 20.00,
 *   AssetAccount: "1620",
 *   DepExpense: "6120",
 *   DepExpensePrivate: "6125",
 *   AccumDep: "1621",
 *   DailyDepreciation: true
 * }
 */
