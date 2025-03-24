/**
 * Detail table interface
 * file_num: 6
 */
export interface Detail {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed */
  ParentSeq: number;
  Sort: number;
  /** @indexed size="14" */
  Account: string;
  /** size="6" */
  Dept: string;
  PostedQty: number;
  /** size="6" */
  TaxCode: string;
  Gross: number;
  Tax: number;
  Debit: number;
  Credit: number;
  /** size="1024" */
  Description: string;
  StockQty: number;
  /** @indexed size="32" */
  StockCode: string;
  CostPrice: number;
  UnitPrice: number;
  /** @indexed */
  Statement: number;
  /** @indexed size="10" */
  JobCode: string;
  /** size="6" */
  SaleUnit: string;
  Discount: number;
  Flags: number;
  OrderQty: number;
  BackorderQty: number;
  PrevShipQty: number;
  BaseCurrencyNet: number;
  /** size="32" */
  SerialNumber: string;
  Period: number;
  TransactionType: string;
  /** @indexed */
  SecurityLevel: number;
  RevalueQty: number;
  /** size="16" */
  StockLocation: string;
  OrderStatus: boolean;
  ExpensedTax: number;
  Date: Date;
  MoreFlags: number;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  NonInvRcvdNotInvoicedQty: number;
  /** @mutable="freely, script-only" size="32" */
  Custom1: string;
  /** @mutable="freely, script-only" size="32" */
  Custom2: string;
  OriginalUnitCost: number;
}
