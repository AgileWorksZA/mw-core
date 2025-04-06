/**
 * Asset Log table interface
 * file_num: 13
 */
export interface AssetLog {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @mutable="conditionally" */
  ParentSeq: number;
  /** @mutable="conditionally" char_short */
  Action: string;
  /** @mutable="conditionally" */
  Date: Date;
  /** @mutable="conditionally" */
  Qty: number | null;
  /** @mutable="conditionally" */
  Depreciation: number | null;
  /** @mutable="conditionally" */
  Adjustment1: number | null;
  /** @mutable="conditionally" */
  Adjustment2: number | null;
  /** @mutable="conditionally" */
  Rate: number | null;
  /** @mutable="conditionally" */
  PrivateUsePercent: number | null;
  /** @mutable="conditionally" */
  AccumDepreciation: number;
  /** @mutable="conditionally" */
  AccumReval: number | null;
  /** @mutable="conditionally" */
  ClosingValue: number;
  /** @mutable="conditionally" */
  TransactionSeq: number | null;
  /** @mutable="freely" size="255" */
  Memo: string | null;
}

export type AssetLogField = keyof AssetLog;

export const AssetLogFields: AssetLogField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "ParentSeq",
  "Action",
  "Date",
  "Qty",
  "Depreciation",
  "Adjustment1",
  "Adjustment2",
  "Rate",
  "PrivateUsePercent",
  "AccumDepreciation",
  "AccumReval",
  "ClosingValue",
  "TransactionSeq",
  "Memo",
];

export type AssetLogObject = Record<AssetLogField, string>;
