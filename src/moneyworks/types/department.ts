/**
 * Department table interface
 * file_num: 3
 */
export interface Department {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed size="6" */
  Code: string;
  /** @mutable="freely, script-only" size="36" */
  Description: string;
  /** size="6" */
  Classification: string;
  /** @mutable="freely, script-only" size="16" */
  Custom1: string;
  /** @mutable="freely, script-only" size="10" */
  Custom2: string;
  Flags: number;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}
