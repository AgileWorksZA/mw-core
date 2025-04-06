/**
 * Asset Category table interface
 * file_num: 14
 */
export interface AssetCat {
  SequenceNumber: number;
  LastModifiedTime?: string | null;
  /** @indexed size="7" */
  Code: string;
  /** @mutable="freely" size="63" */
  Description: string;
  /** @mutable="conditionally" size="13" */
  AssetAccount: string;
  /** @mutable="conditionally" size="13" */
  DepExpense: string;
  /** @mutable="conditionally" size="13" */
  AccumDep: string;
  /** @mutable="conditionally" size="13" */
  GainLoss: string;
  /** @mutable="freely" size="39" */
  Custom: string;
  /** @mutable="freely" size="7" */
  Group: string;
  /** @mutable="conditionally" char_short */
  Type: string;
  /** @mutable="conditionally" size="13" */
  Impairment: string;
  /** @mutable="conditionally" */
  Rate: number;
  /** @mutable="conditionally" size="13" */
  RevalSurplus: string;
  /** @mutable="conditionally" size="13" */
  GainLossPrivate: string;
  /** @mutable="conditionally" size="13" */
  DepExpensePrivate: string;
  /** @mutable="freely" */
  UserNum: number;
  /** @mutable="freely" size="255" */
  UserText: string;
  /** @mutable="conditionally" */
  LastDepreciatedDate: string;
  /** @mutable="freely" size="255" */
  TaggedText: string;
  /** @mutable="conditionally" */
  Flags: number | null;
}

export type AssetCatField = keyof AssetCat;

export const AssetCatFields: AssetCatField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Code",
  "Description",
  "AssetAccount",
  "DepExpense",
  "AccumDep",
  "GainLoss",
  "Custom",
  "Group",
  "Type",
  "Impairment",
  "Rate",
  "RevalSurplus",
  "GainLossPrivate",
  "DepExpensePrivate",
  "UserNum",
  "UserText",
  "LastDepreciatedDate",
  "TaggedText",
  "Flags",
];

export type AssetCatObject = Record<AssetCatField, string>;
