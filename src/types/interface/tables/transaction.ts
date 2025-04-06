/**
 * Transaction table interface
 * file_num: 5
 */
export interface Transaction {
  /** @indexed */
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed @mutable="conditionally" size="12" */
  OurRef: string;
  /** @indexed @mutable="conditionally" */
  TransDate: Date;
  /** @indexed */
  EnterDate: Date;
  /** @mutable="conditionally" */
  DueDate: Date;
  /** @indexed */
  Period: number;
  /** @indexed size="4" */
  Type: string;
  /** @mutable="freely, script-only" size="32" */
  TheirRef: string;
  /** @indexed size="12" */
  NameCode: string;
  /** @mutable="freely, script-only" size="6" */
  Flag: string;
  /** @mutable="conditionally" size="1024" */
  Description: string;
  Gross: number;
  /** @mutable="freely, script-only" size="10" */
  Analysis: string;
  /** size="8" */
  Contra: string;
  /** @mutable="conditionally" size="256" */
  ToFrom: string;
  /** @indexed size="2" */
  Status: string;
  /** @mutable="conditionally" */
  Hold: boolean;
  DatePaid: Date;
  AmtPaid: number;
  PayAmount: number;
  Aging: number;
  TaxAmount: number;
  TaxCycle: number;
  Recurring: boolean;
  /** @mutable="freely, script-only" */
  Printed: number;
  Flags: number;
  TaxProcessed: number;
  /** @mutable="conditionally" size="6" */
  Salesperson: string;
  /** @mutable="conditionally" */
  Colour: number;
  BankJNSeq: number;
  PaymentMethod: number;
  TimePosted: Date;
  /** @indexed */
  SecurityLevel: number;
  /** @mutable="freely, script-only" size="256" */
  User1: string;
  /** @mutable="freely, script-only" size="256" */
  User2: string;
  /** @mutable="freely, script-only" size="256" */
  User3: string;
  /** @mutable="freely, script-only" */
  PromptPaymentDate: Date;
  PromptPaymentAmt: number;
  /** size="2" */
  ProdPriceCode: string;
  /** @mutable="conditionally" size="256" */
  MailingAddress: string;
  /** @mutable="conditionally" size="256" */
  DeliveryAddress: string;
  /** size="32" */
  FreightCode: string;
  FreightAmount: number;
  /** @mutable="freely, script-only" size="256" */
  FreightDetails: string;
  /** @mutable="freely, script-only" size="32" */
  SpecialBank: string;
  /** @mutable="freely, script-only" size="32" */
  SpecialBranch: string;
  /** @mutable="freely, script-only" size="32" */
  SpecialAccount: string;
  /** size="4" */
  Currency: string;
  ExchangeRate: number;
  /** size="4" */
  EnteredBy: string;
  /** size="4" */
  PostedBy: string;
  AmtWrittenOff: number;
  OrderTotal: number;
  OrderShipped: number;
  OrderDeposit: number;
  OriginatingOrderSeq: number;
  CurrencyTransferSeq: number;
  PromptPaymentTerms: number;
  PromptPaymentDisc: number;
  /** @mutable="conditionally, script-only" size="4" */
  ApprovedBy1: string;
  /** @mutable="conditionally, script-only" size="4" */
  ApprovedBy2: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="16" */
  User4: string;
  /** @mutable="freely, script-only" size="16" */
  User5: string;
  /** @mutable="freely, script-only" size="16" */
  User6: string;
  /** @mutable="freely, script-only" size="16" */
  User7: string;
  /** @mutable="freely, script-only" size="16" */
  User8: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  /** @mutable="freely, script-only" */
  Emailed: number;
  /** @mutable="freely, script-only" */
  Transferred: number;
}

export type TransactionField = keyof Transaction;

export const TransactionFields: TransactionField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "OurRef",
  "TransDate",
  "EnterDate",
  "DueDate",
  "Period",
  "Type",
  "TheirRef",
  "NameCode",
  "Flag",
  "Description",
  "Gross",
  "Analysis",
  "Contra",
  "ToFrom",
  "Status",
  "Hold",
  "DatePaid",
  "AmtPaid",
  "PayAmount",
  "Aging",
  "TaxAmount",
  "TaxCycle",
  "Recurring",
  "Printed",
  "Flags",
  "TaxProcessed",
  "Salesperson",
  "Colour",
  "BankJNSeq",
  "PaymentMethod",
  "TimePosted",
  "SecurityLevel",
  "User1",
  "User2",
  "User3",
  "PromptPaymentDate",
  "PromptPaymentAmt",
  "ProdPriceCode",
  "MailingAddress",
  "DeliveryAddress",
  "FreightCode",
  "FreightAmount",
  "FreightDetails",
  "SpecialBank",
  "SpecialBranch",
  "SpecialAccount",
  "Currency",
  "ExchangeRate",
  "EnteredBy",
  "PostedBy",
  "AmtWrittenOff",
  "OrderTotal",
  "OrderShipped",
  "OrderDeposit",
  "OriginatingOrderSeq",
  "CurrencyTransferSeq",
  "PromptPaymentTerms",
  "PromptPaymentDisc",
  "ApprovedBy1",
  "ApprovedBy2",
  "UserNum",
  "UserText",
  "User4",
  "User5",
  "User6",
  "User7",
  "User8",
  "TaggedText",
  "Emailed",
  "Transferred",
];
