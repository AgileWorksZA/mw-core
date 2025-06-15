/**
 * Asset Categories table interfaces and utilities for MoneyWorks
 * Defines asset categories with GL account mappings and depreciation settings
 * @module tables/asset-categories
 */

/**
 * Depreciation type options for asset categories
 */
export enum DepreciationType {
  /** Straight Line depreciation */
  StraightLine = "SL",
  /** Declining Value (Diminishing Value) depreciation */
  DecliningValue = "DV",
}

/**
 * Raw AssetCategories record from MoneyWorks (PascalCase fields)
 * Defines asset categories with GL account mappings
 */
export interface AssetCategories {
  /** Unique code for the category (max 7 chars) */
  Code: string;

  /** Describes the asset category (max 63 chars) */
  Description: string;

  /** Fixed asset account reference (max 13 chars) */
  AssetAccount: string;

  /** Depreciation expense account (max 13 chars) */
  DepExpense: string;

  /** Accumulated depreciation account (max 13 chars) */
  AccumDep: string;

  /** Account for asset disposal gain/loss (max 13 chars) */
  GainLoss: string;

  /** Default depreciation type (SL=Straight Line, DV=Declining Value) (max 3 chars) */
  Type: string;

  /** Default depreciation rate */
  Rate: number;

  /** Custom field (max 39 chars) */
  Custom?: string;

  /** Group reference (max 7 chars) */
  Group?: string;

  /** Impairment account (max 13 chars) */
  Impairment?: string;

  /** Revaluation surplus account (max 13 chars) */
  RevalSurplus?: string;

  /** Private use gain/loss account (max 13 chars) */
  GainLossPrivate?: string;

  /** Private use depreciation expense account (max 13 chars) */
  DepExpensePrivate?: string;

  /** User-defined numeric field */
  UserNum?: number;

  /** User-defined text field (max 255 chars) */
  UserText?: string;

  /** Date the category was last depreciated */
  LastDepreciatedDate?: Date;

  /** Tagged text field (max 255 chars) */
  TaggedText?: string;

  /** Comment field (max 255 chars) */
  Comment?: string;
}

/**
 * AssetCategories record with camelCase fields for TypeScript usage
 */
export interface AssetCategoriesCamel {
  /** Unique code for the category (max 7 chars) */
  code: string;

  /** Describes the asset category (max 63 chars) */
  description: string;

  /** Fixed asset account reference (max 13 chars) */
  assetAccount: string;

  /** Depreciation expense account (max 13 chars) */
  depExpense: string;

  /** Accumulated depreciation account (max 13 chars) */
  accumDep: string;

  /** Account for asset disposal gain/loss (max 13 chars) */
  gainLoss: string;

  /** Default depreciation type (SL=Straight Line, DV=Declining Value) (max 3 chars) */
  type: string;

  /** Default depreciation rate */
  rate: number;

  /** Custom field (max 39 chars) */
  custom?: string;

  /** Group reference (max 7 chars) */
  group?: string;

  /** Impairment account (max 13 chars) */
  impairment?: string;

  /** Revaluation surplus account (max 13 chars) */
  revalSurplus?: string;

  /** Private use gain/loss account (max 13 chars) */
  gainLossPrivate?: string;

  /** Private use depreciation expense account (max 13 chars) */
  depExpensePrivate?: string;

  /** User-defined numeric field */
  userNum?: number;

  /** User-defined text field (max 255 chars) */
  userText?: string;

  /** Date the category was last depreciated */
  lastDepreciatedDate?: Date;

  /** Tagged text field (max 255 chars) */
  taggedText?: string;

  /** Comment field (max 255 chars) */
  comment?: string;
}

/**
 * Field mappings from PascalCase to camelCase
 */
export const ASSET_CATEGORIES_FIELD_MAP = {
  Code: "code",
  Description: "description",
  AssetAccount: "assetAccount",
  DepExpense: "depExpense",
  AccumDep: "accumDep",
  GainLoss: "gainLoss",
  Type: "type",
  Rate: "rate",
  Custom: "custom",
  Group: "group",
  Impairment: "impairment",
  RevalSurplus: "revalSurplus",
  GainLossPrivate: "gainLossPrivate",
  DepExpensePrivate: "depExpensePrivate",
  UserNum: "userNum",
  UserText: "userText",
  LastDepreciatedDate: "lastDepreciatedDate",
  TaggedText: "taggedText",
  Comment: "comment",
} as const;

/**
 * Converts a raw AssetCategories record to camelCase format
 */
export function toAssetCategoriesCamel(
  raw: AssetCategories,
): AssetCategoriesCamel {
  return {
    code: raw.Code,
    description: raw.Description,
    assetAccount: raw.AssetAccount,
    depExpense: raw.DepExpense,
    accumDep: raw.AccumDep,
    gainLoss: raw.GainLoss,
    type: raw.Type,
    rate: raw.Rate,
    custom: raw.Custom,
    group: raw.Group,
    impairment: raw.Impairment,
    revalSurplus: raw.RevalSurplus,
    gainLossPrivate: raw.GainLossPrivate,
    depExpensePrivate: raw.DepExpensePrivate,
    userNum: raw.UserNum,
    userText: raw.UserText,
    lastDepreciatedDate: raw.LastDepreciatedDate,
    taggedText: raw.TaggedText,
    comment: raw.Comment,
  };
}

/**
 * Converts a camelCase AssetCategories record to PascalCase format
 */
export function toAssetCategoriesRaw(
  camel: AssetCategoriesCamel,
): AssetCategories {
  return {
    Code: camel.code,
    Description: camel.description,
    AssetAccount: camel.assetAccount,
    DepExpense: camel.depExpense,
    AccumDep: camel.accumDep,
    GainLoss: camel.gainLoss,
    Type: camel.type,
    Rate: camel.rate,
    Custom: camel.custom,
    Group: camel.group,
    Impairment: camel.impairment,
    RevalSurplus: camel.revalSurplus,
    GainLossPrivate: camel.gainLossPrivate,
    DepExpensePrivate: camel.depExpensePrivate,
    UserNum: camel.userNum,
    UserText: camel.userText,
    LastDepreciatedDate: camel.lastDepreciatedDate,
    TaggedText: camel.taggedText,
    Comment: camel.comment,
  };
}

/**
 * Type guard to check if a depreciation type is valid
 */
export function isValidDepreciationType(
  type: string,
): type is DepreciationType {
  return Object.values(DepreciationType).includes(type as DepreciationType);
}

/**
 * Helper function to get depreciation type description
 */
export function getDepreciationTypeDescription(type: string): string {
  switch (type) {
    case DepreciationType.StraightLine:
      return "Straight Line";
    case DepreciationType.DecliningValue:
      return "Declining Value";
    default:
      return "Unknown";
  }
}

/**
 * Validates an AssetCategories record
 */
export function validateAssetCategories(
  record: Partial<AssetCategories>,
): string[] {
  const errors: string[] = [];

  if (!record.Code || record.Code.length > 7) {
    errors.push("Code is required and must be 7 characters or less");
  }

  if (!record.Description || record.Description.length > 63) {
    errors.push("Description is required and must be 63 characters or less");
  }

  if (!record.AssetAccount || record.AssetAccount.length > 13) {
    errors.push("AssetAccount is required and must be 13 characters or less");
  }

  if (!record.DepExpense || record.DepExpense.length > 13) {
    errors.push("DepExpense is required and must be 13 characters or less");
  }

  if (!record.AccumDep || record.AccumDep.length > 13) {
    errors.push("AccumDep is required and must be 13 characters or less");
  }

  if (!record.GainLoss || record.GainLoss.length > 13) {
    errors.push("GainLoss is required and must be 13 characters or less");
  }

  if (!record.Type || record.Type.length > 3) {
    errors.push("Type is required and must be 3 characters or less");
  } else if (!isValidDepreciationType(record.Type)) {
    errors.push(
      `Type must be one of: ${Object.values(DepreciationType).join(", ")}`,
    );
  }

  if (record.Rate === undefined || record.Rate === null) {
    errors.push("Rate is required");
  }

  // Optional field validations
  if (record.Custom && record.Custom.length > 39) {
    errors.push("Custom must be 39 characters or less");
  }

  if (record.Group && record.Group.length > 7) {
    errors.push("Group must be 7 characters or less");
  }

  if (record.Impairment && record.Impairment.length > 13) {
    errors.push("Impairment must be 13 characters or less");
  }

  if (record.RevalSurplus && record.RevalSurplus.length > 13) {
    errors.push("RevalSurplus must be 13 characters or less");
  }

  if (record.GainLossPrivate && record.GainLossPrivate.length > 13) {
    errors.push("GainLossPrivate must be 13 characters or less");
  }

  if (record.DepExpensePrivate && record.DepExpensePrivate.length > 13) {
    errors.push("DepExpensePrivate must be 13 characters or less");
  }

  if (record.UserText && record.UserText.length > 255) {
    errors.push("UserText must be 255 characters or less");
  }

  if (record.TaggedText && record.TaggedText.length > 255) {
    errors.push("TaggedText must be 255 characters or less");
  }

  if (record.Comment && record.Comment.length > 255) {
    errors.push("Comment must be 255 characters or less");
  }

  return errors;
}

/**
 * Creates a new AssetCategories record with defaults
 */
export function createAssetCategories(data: {
  code: string;
  description: string;
  assetAccount: string;
  depExpense: string;
  accumDep: string;
  gainLoss: string;
  type?: DepreciationType;
  rate?: number;
}): AssetCategories {
  return {
    Code: data.code,
    Description: data.description,
    AssetAccount: data.assetAccount,
    DepExpense: data.depExpense,
    AccumDep: data.accumDep,
    GainLoss: data.gainLoss,
    Type: data.type || DepreciationType.StraightLine,
    Rate: data.rate || 0,
  };
}

/**
 * MoneyWorks Asset Categories table name
 */
export const ASSET_CATEGORIES_TABLE = "AssetCategories";

/**
 * Default query fields for Asset Categories
 */
export const ASSET_CATEGORIES_DEFAULT_FIELDS = [
  "Code",
  "Description",
  "AssetAccount",
  "DepExpense",
  "AccumDep",
  "GainLoss",
  "Type",
  "Rate",
];

/**
 * All available fields for Asset Categories
 */
export const ASSET_CATEGORIES_ALL_FIELDS = [
  ...ASSET_CATEGORIES_DEFAULT_FIELDS,
  "Custom",
  "Group",
  "Impairment",
  "RevalSurplus",
  "GainLossPrivate",
  "DepExpensePrivate",
  "UserNum",
  "UserText",
  "LastDepreciatedDate",
  "TaggedText",
  "Comment",
];
