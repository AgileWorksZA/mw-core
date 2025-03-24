/**
 * Memo table interface
 * file_num: 23
 */
export interface Memo {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed */
  NameSeq: number;
  Order: number;
  /** @mutable="freely, script-only" */
  Date: Date;
  /** @indexed @mutable="freely, script-only" */
  RecallDate: Date;
  Flags: number;
  /** @mutable="freely, script-only" size="256" */
  Text: string;
}
