/**
 * General table interface
 * file_num: 2
 */
export interface General {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed size="10" */
  Code: string;
  /** size="32" */
  Description: string;
  Date: Date;
  Long: number;
}
