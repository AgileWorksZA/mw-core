/**
 * AutoSplit table interface
 * file_num: 22
 */
export interface AutoSplit {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** size="256" */
  MatchFunction: string;
  SplitMode: number;
  /** size="14" */
  SplitAcct1: string;
  /** size="14" */
  SplitAcct2: string;
  SplitAmount1: number;
  SplitAmount2: number;
  /** size="14" */
  SplitAcct3: string;
  /** size="14" */
  SplitAcct4: string;
  SplitAmount3: number;
  /** size="12" */
  MatchName: string;
  /** @mutable="freely, script-only" */
  Priority: number;
}

export type AutoSplitField = keyof AutoSplit;

export const AutoSplitFields: AutoSplitField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "MatchFunction",
  "SplitMode",
  "SplitAcct1",
  "SplitAcct2",
  "SplitAmount1",
  "SplitAmount2",
  "SplitAcct3",
  "SplitAcct4",
  "SplitAmount3",
  "MatchName",
  "Priority",
];
