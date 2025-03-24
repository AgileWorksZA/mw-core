/**
 * Lists table interface
 * file_num: 28
 */
export interface Lists {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed size="16" */
  ListID: string;
  /** @indexed size="16" */
  Item: string;
  /** size="68" */
  Comment: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}
