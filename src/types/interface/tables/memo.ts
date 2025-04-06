/**
 * Memo table interface
 * file_num: 23
 */
export interface Memo {
  SequenceNumber: number;
  LastModifiedTime: string;
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

export type MemoField = keyof Memo;

export const MemoFields: MemoField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "NameSeq",
  "Order",
  "Date",
  "RecallDate",
  "Flags",
  "Text",
];

