/**
 * Filter table interface
 * file_num: 26
 */
export interface Filter {
  SequenceNumber: number;
  LastModifiedTime: Date;
  File: number;
  TabSet: number;
  Tab: number;
  Type: number;
  /** size="4" */
  User: string;
  /** size="32" */
  Name: string;
  /** size="256" */
  FilterFunction: string;
  /** @mutable="freely, script-only" */
  Order: number;
}
