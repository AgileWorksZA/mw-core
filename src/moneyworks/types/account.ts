/**
 * Account table interface
 * file_num: 0
 */
export interface Account {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed size="8" */
  Code: string;
  /** @indexed char_short */
  Type: string;
  /** @indexed size="6" */
  Group: string;
  /** @indexed size="8" */
  Category: string;
  /** @mutable="freely, script-only" size="64" */
  Description: string;
  /** @indexed size="8" */
  PandL: string;
  /** @mutable="conditionally" size="6" */
  TaxCode: string;
  Flags: number;
  /** @indexed char_short */
  System: string;
  Created: Date;
  /** @mutable="freely, script-only" size="16" */
  Category2: string;
  /** @mutable="freely, script-only" size="16" */
  Category3: string;
  /** @mutable="freely, script-only" size="16" */
  Category4: string;
  /** @mutable="freely, script-only" size="10" */
  AccountantCode: string;
  /** @mutable="conditionally" */
  Colour: number;
  /** size="4" */
  Currency: string;
  /** @indexed */
  SecurityLevel: number;
  /** @mutable="freely, script-only" size="24" */
  BankAccountNumber: string;
  BalanceLimit: number;
  /** size="12" */
  ManualChequeNumber: string;
  /** size="12" */
  PrintedChequeNumber: string;
  LastStatementImport: Date;
  /** @mutable="freely, script-only" size="1024" */
  Comments: string;
  ManualChequeNumDigits: number;
  PrintedChequeNumDigits: number;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  /** @mutable="freely, script-only" size="32" */
  FeedID: string;
  /** @mutable="freely, script-only" size="8" */
  Cashflow: string;
  /** @mutable="freely, script-only" size="32" */
  Cashforecast: string;
  /** @mutable="conditionally" size="2" */
  EBITDA: string;
  /** size="10" */
  ImportFormat: string;
}
