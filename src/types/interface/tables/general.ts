/**
 * General table interface
 * file_num: 2
 */
export interface General {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="10" */
  Code: string;
  /** size="32" */
  Description: string;
  Date: Date;
  Long: number;
}

export type GeneralField = keyof General;

export const GeneralFields: GeneralField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Code",
  "Description",
  "Date",
  "Long",
];
