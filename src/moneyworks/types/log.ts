/**
 * Log table interface
 * file_num: 7
 */
export interface Log {
  SequenceNumber: number;
  LastModifiedTime: Date;
  Description: string;
  /** size="4" */
  Who: string;
  /** size="16" */
  Info1: string;
  /** size="16" */
  Info2: string;
  /** size="16" */
  Info3: string;
}
