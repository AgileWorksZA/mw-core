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

export type PaymentsField = keyof Payments;

export const PaymentsFields: PaymentsField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "InvoiceID",
  "CashTrans",
  "Date",
  "GSTCycle",
  "Amount",
];
