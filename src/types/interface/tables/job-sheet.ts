/**
 * JobSheet table interface
 * file_num: 18
 */
export interface JobSheet {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="10" */
  Job: string;
  /** @mutable="conditionally" */
  Qty: number;
  /** @indexed size="32" */
  Resource: string;
  /** @mutable="conditionally" */
  Date: Date;
  /** @mutable="conditionally" size="6" */
  CostCentre: string;
  /** size="8" */
  Account: string;
  Period: number;
  /** @mutable="conditionally" size="6" */
  Units: string;
  /** @mutable="conditionally" */
  CostPrice: number;
  /** @mutable="conditionally" */
  SellPrice: number;
  /** @mutable="freely, script-only" size="1024" */
  Memo: string;
  /** @mutable="freely, script-only" */
  DestTransSeq: number;
  /** @indexed */
  SourceTransSeq: number;
  DateEntered: Date;
  Flags: number;
  /** @mutable="conditionally" */
  Colour: number;
  /** @indexed @mutable="conditionally" char_short */
  Status: string;
  /** @mutable="freely, script-only" char_short */
  Type: string;
  /** @mutable="conditionally" size="10" */
  Analysis: string;
  BillValue: number;
  /** @mutable="conditionally" size="32" */
  ActivityCode: string;
  /** @mutable="freely, script-only" size="256" */
  Comments: string;
  Batch: number;
  /** @indexed size="4" */
  EnteredBy: string;
  /** size="32" */
  SerialNumber: string;
  /** size="16" */
  StockLocation: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  TimeProcessed: Date;
}

export type JobSheetField = keyof JobSheet;

export const JobSheetFields: JobSheetField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Job",
  "Qty",
  "Resource",
  "Date",
  "CostCentre",
  "Account",
  "Period",
  "Memo",
  "DestTransSeq",
  "SourceTransSeq",
  "DateEntered",
  "Flags",
  "Colour",
  "Status",
  "Type",
  "Analysis",
  "BillValue",
  "ActivityCode",
  "Comments",
  "Batch",
  "EnteredBy",
  "SerialNumber",
  "StockLocation",
  "UserNum",
  "UserText",
  "TaggedText",
  "TimeProcessed",
];
