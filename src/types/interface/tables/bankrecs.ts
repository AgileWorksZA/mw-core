/**
 * BankRecs table interface
 * file_num: 19
 */
export interface BankRecs {
  /** @indexed */
  SequenceNumber: number;
  LastModifiedTime: string;
  /** size="14" */
  Account: string;
  Opening: number;
  Closing: number;
  Statement: number;
  Date: Date;
  ReconciledTime: Date;
  Discrepancy: number;
}

export type BankRecsField = keyof BankRecs;

export const BankRecsFields: BankRecsField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Account",
  "Opening",
  "Closing",
  "Statement",
  "Date",
  "ReconciledTime",
  "Discrepancy",
];
