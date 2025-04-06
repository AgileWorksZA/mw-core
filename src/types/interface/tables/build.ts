/**
 * Build table interface
 * file_num: 17
 */
export interface Build {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed */
  ProductSeq: number;
  Order: number;
  Qty: number;
  /** size="32" */
  PartCode: string;
  Flags: number;
  /** @mutable="freely, script-only" size="256" */
  Memo: string;
}

export type BuildField = keyof Build;

export const BuildFields: BuildField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "ProductSeq",
  "Order",
  "Qty",
  "PartCode",
  "Flags",
  "Memo",
];
