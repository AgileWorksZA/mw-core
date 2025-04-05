/**
 * TaxRate table interface
 * file_num: 8
 */
export interface TaxRate {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** size="6" */
  TaxCode: string;
  /** size="8" */
  PaidAccount: string;
  /** size="8" */
  RecAccount: string;
  Rate1: number;
  Date: Date;
  Rate2: number;
  Combine: number;
  CombineRate1: number;
  CombineRate2: number;
  GSTReceived: number;
  NetReceived: number;
  GSTPaid: number;
  NetPaid: number;
  /** size="60" */
  RateName: string;
  ReportCycleStart: number;
  ReportCycleEnd: number;
  ReportDate: Date;
  PSTReceived: number;
  PSTPaid: number;
  Type: number;
  /** size="32" */
  Combination: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  /** @mutable="freely, script-only" size="6" */
  AliasCode: string;
  /** @mutable="freely, script-only" size="4" */
  AliasCountry: string;
  ReversedRate1: number;
  ReversedRate2: number;
}

export type TaxRateField = keyof TaxRate;

export const TaxRateFields: TaxRateField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "TaxCode",
  "PaidAccount",
  "RecAccount",
  "Rate1",
  "Date",
  "Rate2",
  "Combine",
  "CombineRate1",
  "CombineRate2",
  "GSTReceived",
  "NetReceived",
  "GSTPaid",
  "NetPaid",
  "RateName",
  "ReportCycleStart",
  "ReportCycleEnd",
  "ReportDate",
  "PSTReceived",
  "PSTPaid",
  "Type",
  "Combination",
  "UserNum",
  "UserText",
  "TaggedText",
  "AliasCode",
  "AliasCountry",
  "ReversedRate1",
  "ReversedRate2",
];
