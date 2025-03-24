/**
 * BankRecs table interface
 * file_num: 19
 */
export interface BankRecs {
  /** @indexed */
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** size="14" */
  Account: string;
  Opening: number;
  Closing: number;
  Statement: number;
  Date: Date;
  ReconciledTime: Date;
  Discrepancy: number;
}
