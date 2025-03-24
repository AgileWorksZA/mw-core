/**
 * Build table interface
 * file_num: 17
 */
export interface Build {
  SequenceNumber: number;
  LastModifiedTime: Date;
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
