/**
 * Payments table interface
 * file_num: 11
 */
export interface Payments {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed */
  InvoiceID: number;
  /** @indexed */
  CashTrans: number;
  Date: Date;
  GSTCycle: number;
  Amount: number;
}
