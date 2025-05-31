/**
 * Product table interface
 * file_num: 13
 */
export interface Product {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="32" */
  Code: string;
  /** @mutable="freely, script-only" size="40" */
  SuppliersCode: string;
  /** @mutable="conditionally" size="12" */
  Supplier: string;
  /** @mutable="freely, script-only" size="256" */
  Description: string;
  /** @mutable="freely, script-only" size="1024" */
  Comment: string;
  /** @mutable="freely, script-only" size="16" */
  Category1: string;
  /** @mutable="freely, script-only" size="16" */
  Category2: string;
  /** @mutable="freely, script-only" size="16" */
  Category3: string;
  /** @mutable="freely, script-only" size="16" */
  Category4: string;
  /** size="14" */
  SalesAcct: string;
  /** size="14" */
  COGAcct: string;
  /** size="14" */
  StockAcct: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="6" */
  SellUnit: string;
  /** @mutable="conditionally" */
  SellPrice: number;
  /** @mutable="conditionally" */
  Plussage: number;
  /** @mutable="conditionally" */
  BuyWeight: number;
  /** @mutable="freely, script-only" size="6" */
  BuyUnit: string;
  CostPrice: number;
  ConversionFactor: number;
  /** @mutable="freely, script-only" */
  MarginWarning: number;
  /** @mutable="conditionally" */
  SellDiscount: number;
  /** @mutable="conditionally" */
  SellDiscountMode: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  StockOnHand: number;
  StockValue: number;
  MinBuildQty: number;
  NormalBuildQty: number;
  /** @mutable="freely, script-only" */
  ReorderLevel: number;
  /** @mutable="conditionally" */
  JobPricingMode: number;
  /** @mutable="freely, script-only" */
  Flags: number;
  /** @mutable="conditionally" */
  Colour: number;
  /** @mutable="freely, script-only" */
  UseMultiplePrices: boolean;
  /** @mutable="conditionally" */
  SellPriceB: number;
  /** @mutable="conditionally" */
  SellPriceC: number;
  /** @mutable="conditionally" */
  SellPriceD: number;
  /** @mutable="conditionally" */
  SellPriceE: number;
  /** @mutable="conditionally" */
  SellPriceF: number;
  /** @mutable="conditionally" */
  QtyBreak1: number;
  /** @mutable="conditionally" */
  QtyBreak2: number;
  /** @mutable="conditionally" */
  QtyBreak3: number;
  /** @mutable="conditionally" */
  QtyBreak4: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceA1: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceA2: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceA3: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceA4: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceB1: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceB2: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceB3: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceB4: number;
  /** @indexed @mutable="conditionally" size="2" */
  Type: string;
  /** @mutable="conditionally" */
  Count: number;
  OnOrder: number;
  StockTakeStartQty: number;
  StockTakeValue: number;
  /** @mutable="freely, script-only" */
  StockTakeNewQty: number;
  /** @indexed @mutable="freely, script-only" size="20" */
  BarCode: string;
  /** size="4" */
  BuyPriceCurrency: string;
  /** @mutable="conditionally" */
  BuyPrice: number;
  /** @mutable="freely, script-only" size="256" */
  Custom1: string;
  /** @mutable="freely, script-only" size="256" */
  Custom2: string;
  /** @mutable="freely, script-only" size="16" */
  Custom3: string;
  /** @mutable="freely, script-only" size="16" */
  Custom4: string;
  /** @mutable="conditionally" size="6" */
  BuyTaxCodeOverride: string;
  /** @mutable="conditionally" size="6" */
  SellTaxCodeOverride: string;
  /** @mutable="freely, script-only" */
  LeadTimeDays: number;
  /** @indexed */
  Hash: number;
  /** @mutable="conditionally" */
  SellWeight: number;
  /** @mutable="freely, script-only" size="16" */
  Custom5: string;
  /** @mutable="freely, script-only" size="16" */
  Custom6: string;
  /** @mutable="freely, script-only" size="16" */
  Custom7: string;
  /** @mutable="freely, script-only" size="16" */
  Custom8: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}

export type ProductField = keyof Product;

export const ProductFields: ProductField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Code",
  "Description",
  "Comment",
  "Category1",
  "Category2",
  "Category3",
  "Category4",
  "SalesAcct",
  "COGAcct",
  "StockAcct",
  "UserNum",
  "SellUnit",
  "SellPrice",
  "Plussage",
  "BuyWeight",
  "BuyUnit",
  "CostPrice",
  "ConversionFactor",
  "MarginWarning",
  "SellDiscount",
  "SellDiscountMode",
  "UserText",
  "StockOnHand",
  "StockValue",
  "MinBuildQty",
  "NormalBuildQty",
  "ReorderLevel",
  "JobPricingMode",
  "Flags",
  "Colour",
  "UseMultiplePrices",
  "SellPriceB",
  "SellPriceC",
  "SellPriceD",
  "SellPriceE",
  "SellPriceF",
  "QtyBreak1",
  "QtyBreak2",
  "QtyBreak3",
  "QtyBreak4",
  "QtyBrkSellPriceA1",
  "QtyBrkSellPriceA2",
  "QtyBrkSellPriceA3",
  "QtyBrkSellPriceA4",
  "QtyBrkSellPriceB1",
  "QtyBrkSellPriceB2",
  "QtyBrkSellPriceB3",
  "QtyBrkSellPriceB4",
  "Type",
  "Count",
  "OnOrder",
  "StockTakeStartQty",
  "StockTakeValue",
  "StockTakeNewQty",
  "BarCode",
  "BuyPriceCurrency",
  "BuyPrice",
  "Custom1",
  "Custom2",
  "Custom3",
  "Custom4",
  "BuyTaxCodeOverride",
  "SellTaxCodeOverride",
  "LeadTimeDays",
  "Hash",
  "SellWeight",
  "Custom5",
  "Custom6",
  "Custom7",
  "Custom8",
  "TaggedText",
];
