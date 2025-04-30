/**
 * Asset table interface
 * file_num: 12
 */
export interface Asset {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="19" */
  Code: string;
  /** @mutable="freely" size="63" */
  Description: string;
  /** @indexed size="7" */
  Category: string;
  /** @mutable="freely" size="31" */
  SerialNum: string | null;
  /** @mutable="freely" */
  Qty: number;
  /** @mutable="freely" */
  ExpectedLife: number | null;
  /** @mutable="freely" */
  Cost: number;
  /** @mutable="conditionally" */
  AccumDepreciation: number;
  /** @mutable="freely" */
  AcquisitionDate: string;
  /** @mutable="conditionally" */
  LastDepreciatedDate: string | null;
  /** @mutable="conditionally" */
  AcquisitionSeq: number | null;
  /** @mutable="conditionally" */
  DisposalSeq: number | null;
  /** @mutable="freely" size="15" */
  Location: string | null;
  /** @indexed size="5" */
  Dept: string | null;
  /** @mutable="freely" */
  PrivateUsePercent: number | null;
  /** @mutable="conditionally" char_short */
  Status: string;
  /** @mutable="automatically" size="3" */
  LastModifiedBy: string | null;
  LastRevaluedDate: string | null;
  /** @mutable="freely" */
  ExpectedResidualValue: number | null;
  /** @mutable="conditionally" */
  RevalSurplusImpairAmt: number | null;
  /** @mutable="freely" */
  UserNum: number | null;
  /** @mutable="freely" size="255" */
  UserText: string | null;
  /** @mutable="conditionally" */
  AccumDepnAdj: number | null;
  /** @mutable="conditionally" */
  BookValue: number;
  /** @mutable="conditionally" */
  DisposalDate: string | null;
  /** @mutable="conditionally" */
  GainLossOnDisposal: number | null;
  /** @mutable="freely" */
  Colour: number | null;
  /** @mutable="freely" size="255" */
  TaggedText: string | null;
  /** @mutable="conditionally" char_short */
  Type: string;
  /** @mutable="conditionally" */
  Rate: number;
  /** @mutable="freely" size="255" */
  Comment: string | null;
  /** @mutable="freely" size="255" */
  Custom1: string | null;
  /** @mutable="freely" size="255" */
  Custom2: string | null;
  /** @mutable="freely" size="255" */
  Custom3: string | null;
  /** @mutable="freely" size="255" */
  Custom4: string | null;
}

export type AssetField = keyof Asset;

export const AssetFields: AssetField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Code",
  "Description",
  "Category",
  "SerialNum",
  "Qty",
  "ExpectedLife",
  "Cost",
  "AccumDepreciation",
  "AcquisitionDate",
  "LastDepreciatedDate",
  "AcquisitionSeq",
  "DisposalSeq",
  "Location",
  "Dept",
  "PrivateUsePercent",
  "Status",
  "LastModifiedBy",
  "LastRevaluedDate",
  "ExpectedResidualValue",
  "RevalSurplusImpairAmt",
  "UserNum",
  "UserText",
  "AccumDepnAdj",
  "BookValue",
  "DisposalDate",
  "GainLossOnDisposal",
  "Colour",
  "TaggedText",
  "Type",
  "Rate",
  "Comment",
  "Custom1",
  "Custom2",
  "Custom3",
  "Custom4",
];
