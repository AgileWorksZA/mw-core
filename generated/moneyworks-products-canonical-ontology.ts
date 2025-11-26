/**
 * MoneyWorks Products Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_products.html
 * Authority: MoneyWorks Manual - Products Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks Products are not just "items" - they represent
 * a sophisticated multi-dimensional classification system with inventory management,
 * pricing matrices, job costing, and manufacturing capabilities.
 */

// ============================================================================
// CANONICAL MONEYWORKS PRODUCT TYPES
// ============================================================================

/**
 * MoneyWorks canonical product type classification
 * Source: moneyworks_appendix_products.html - "Type" field
 */
export enum MoneyWorksProductType {
  /** Product */
  PRODUCT = "P",
  
  /** Resource */
  RESOURCE = "R",
  
  /** Time */
  TIME = "T",
  
  /** Ship method */
  SHIP_METHOD = "S",
  
  /** Other */
  OTHER = "O"
}

/**
 * MoneyWorks canonical product status flags
 * Source: moneyworks_appendix_products.html - "Hash" field description
 */
export enum MoneyWorksProductStatus {
  /** We buy it */
  BUY = 0x0002,
  
  /** We sell it */
  SELL = 0x0004,
  
  /** We inventory it */
  INVENTORY = 0x0008
}

/**
 * MoneyWorks canonical sell price discount modes
 * Source: moneyworks_appendix_products.html - "SellDiscountMode" field
 */
export enum MoneyWorksSellDiscountMode {
  /** None */
  NONE = 1,
  
  /** By customer */
  BY_CUSTOMER = 2,
  
  /** By product */
  BY_PRODUCT = 3,
  
  /** Add */
  ADD = 4
}

/**
 * MoneyWorks canonical job pricing modes
 * Source: moneyworks_appendix_products.html - "JobPricingMode" field
 */
export enum MoneyWorksJobPricingMode {
  /** Use Product Sell Price */
  USE_PRODUCT_SELL_PRICE = 1,
  
  /** Apply Job Markup to Standard Cost */
  APPLY_JOB_MARKUP_TO_STANDARD_COST = 2,
  
  /** Use Undiscounted Purchase Price */
  USE_UNDISCOUNTED_PURCHASE_PRICE = 3
}

// ============================================================================
// CANONICAL MONEYWORKS PRODUCT FLAGS
// ============================================================================

/**
 * MoneyWorks canonical product flags as defined in manual
 * Source: moneyworks_appendix_products.html - "Product Flags" table
 */
export enum MoneyWorksProductFlags {
  /** We buy it */
  WE_BUY_IT = 0x00000002,
  
  /** We sell it */
  WE_SELL_IT = 0x00000004,
  
  /** We inventory it */
  WE_INVENTORY_IT = 0x00000008,
  
  /** Job Cost is Tax Inclusive */
  JOB_COST_TAX_INCLUSIVE = 0x00000010,
  
  /** Append Salesperson - Expense */
  APPEND_SALESPERSON_EXPENSE = 0x00000020,
  
  /** Append Salesperson - Sales */
  APPEND_SALESPERSON_SALES = 0x00000040,
  
  /** Price A is Tax Inclusive */
  PRICE_A_TAX_INCLUSIVE = 0x00000200,
  
  /** We Build it */
  WE_BUILD_IT = 0x00000400,
  
  /** Auto-Build Item */
  AUTO_BUILD_ITEM = 0x00000800,
  
  /** Price B is Tax Inclusive */
  PRICE_B_TAX_INCLUSIVE = 0x00000001,
  
  /** Price C is Tax Inclusive */
  PRICE_C_TAX_INCLUSIVE = 0x00000080,
  
  /** Price D is Tax Inclusive */
  PRICE_D_TAX_INCLUSIVE = 0x00001000,
  
  /** Price E is Tax Inclusive */
  PRICE_E_TAX_INCLUSIVE = 0x00002000,
  
  /** Price F is Tax Inclusive */
  PRICE_F_TAX_INCLUSIVE = 0x00004000,
  
  /** Price Break on Additional Units */
  PRICE_BREAK_ADDITIONAL_UNITS = 0x00008000,
  
  /** Price D is Cost Plus */
  PRICE_D_COST_PLUS = 0x00010000,
  
  /** Price E is Cost Plus */
  PRICE_E_COST_PLUS = 0x00020000,
  
  /** Price F is Cost Plus */
  PRICE_F_COST_PLUS = 0x00040000,
  
  /** Price D is Discount */
  PRICE_D_DISCOUNT = 0x00080000,
  
  /** Price E is Discount */
  PRICE_E_DISCOUNT = 0x00100000,
  
  /** Price F is Discount */
  PRICE_F_DISCOUNT = 0x00200000,
  
  /** Reorder Warning */
  REORDER_WARNING = 0x00000100,
  
  /** Do not update Buy */
  DO_NOT_UPDATE_BUY = 0x00400000,
  
  /** Item has serial number */
  ITEM_HAS_SERIAL_NUMBER = 0x01000000,
  
  /** Item has batch/lot number */
  ITEM_HAS_BATCH_LOT_NUMBER = 0x02000000,
  
  /** Batch/lot expires */
  BATCH_LOT_EXPIRES = 0x04000000,
  
  /** We Count It */
  WE_COUNT_IT = 0x08000000
}

// ============================================================================
// CANONICAL MONEYWORKS PRODUCT FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks product fields as defined in manual
 * Source: moneyworks_appendix_products.html - Products table
 */
export const MONEYWORKS_PRODUCT_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique product identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "Code",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "The product code.",
    manualSource: "moneyworks_appendix_products.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Type",
    dataType: "T" as const,
    maxLength: 1,
    canonicalDescription: "P = product; R = resource; T = time; S = ship method; O=other.",
    manualSource: "moneyworks_appendix_products.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Count",
    dataType: "N" as const,
    canonicalDescription: "Product count field for tracking purposes",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "OnOrder",
    dataType: "N" as const,
    canonicalDescription: "Quantity currently on order from suppliers",
    manualSource: "Empirical API validation",
    isRequired: false
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "The name of the product.",
    manualSource: "moneyworks_appendix_products.html",
    isRequired: true
  },
  {
    fieldName: "BarCode",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "The item's barcode. This can be used in transaction entry instead of the product code",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Hash",
    dataType: "N" as const,
    canonicalDescription: "For fast searching of products by buy/sell/stock. A bit is set for each status: If buy, #0002; if sell, #0004, if inventory, #0008, Thus all inventoried items will have Hash >= 8.",
    manualSource: "moneyworks_appendix_products.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Flags",
    dataType: "N" as const,
    canonicalDescription: "See Product Flags table below",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // PURCHASING FIELDS
  {
    fieldName: "BuyPrice",
    dataType: "N" as const,
    canonicalDescription: "The undiscounted buy price of one buy unit of the item (in the currency of the purchase). This is updated automatically by MoneyWorks if 'Update price whenever purchased' option is on",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "BuyPriceCurrency",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "The currency of the last purchase of the item",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "BuyUnit",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The units in which you buy the product. e.g. \"ea\", \"kg\", \"ml\", \"dz\". If the buy units are different from the sell units, you must supply a scalar conversion factor in the ConversionFactor field that will convert from buy units to sell units.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "BuyWeight",
    dataType: "N" as const,
    canonicalDescription: "The weight/volume of the buy unit of the item",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "ConversionFactor",
    dataType: "N" as const,
    canonicalDescription: "This is used to calculate the number of sell units that equate to one buy unit. When you purchase product, the quantity purchased is divided by this conversion factor to calculate the number of selling units of stock on hand. Note that the reciprocal of the conversion factor is displayed on the product entry screen.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "CostPrice",
    dataType: "N" as const,
    canonicalDescription: "The standard cost of the item. For purchased items, this is the purchase price (adjusted for discount if any) converted to the base currency.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Supplier",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "The supplier code of your usual supplier. If present, this should be the code of a supplier in the names list.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SuppliersCode",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "The product code that your usual supplier uses to refer to the product.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "BuyTaxCodeOverride",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "Optional tax code override for purchases of this product. When set, this tax code will be used instead of the default supplier tax code when purchasing this product. Allows product-specific tax treatment for procurement.",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },

  // SELLING FIELDS
  {
    fieldName: "SellPrice",
    dataType: "N" as const,
    canonicalDescription: "The \"A\" sell price at which you sell the product. This is GST exclusive and exclusive of any discount that you may apply.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellPriceB",
    dataType: "N" as const,
    canonicalDescription: "The B sell price (before GST and discounts)",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellPriceC",
    dataType: "N" as const,
    canonicalDescription: "The C sell price (before GST and discounts)",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellPriceD",
    dataType: "N" as const,
    canonicalDescription: "The D sell price (before GST and discounts)",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellPriceE",
    dataType: "N" as const,
    canonicalDescription: "The E sell price (before GST and discounts)",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellPriceF",
    dataType: "N" as const,
    canonicalDescription: "The F sell price (before GST and discounts)",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellUnit",
    dataType: "T" as const,
    maxLength: 5,
    canonicalDescription: "The units in which you sell the product. e.g. \"ea\", \"kg\", \"ml\", \"doz\"",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellWeight",
    dataType: "N" as const,
    canonicalDescription: "The weight/volume of one sell unit",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellDiscount",
    dataType: "N" as const,
    canonicalDescription: "The percentage discount. This is used only if the discount mode is 1 or 3",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellDiscountMode",
    dataType: "N" as const,
    canonicalDescription: "A number representing the discount mode as selected in the discount mode pop-up menu in the product entry window. 1=None; 2 = by customer; 3 = by product; 4=Add",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "UseMultiplePrices",
    dataType: "B" as const,
    canonicalDescription: "True if using multiple sell prices",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SellTaxCodeOverride",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "Optional tax code override for sales of this product. When set, this tax code will be used instead of the default customer tax code when selling this product. Enables product-specific tax treatment for sales (e.g., VAT-exempt goods, reduced rates).",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },

  // QUANTITY BREAK PRICING
  {
    fieldName: "QtyBreak1",
    dataType: "N" as const,
    canonicalDescription: "Quantity at which the first break price is used",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBreak2",
    dataType: "N" as const,
    canonicalDescription: "Quantity at which the second break price is used",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBreak3",
    dataType: "N" as const,
    canonicalDescription: "Quantity at which the third break price is used",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBreak4",
    dataType: "N" as const,
    canonicalDescription: "Quantity at which the fourth break price is used",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBrkSellPriceA1",
    dataType: "N" as const,
    canonicalDescription: "The A sell price, if the quantity is greater than or equal to QtyBreak1",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBrkSellPriceA2",
    dataType: "N" as const,
    canonicalDescription: "The A sell price, if the quantity is greater than or equal to QtyBreak2",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBrkSellPriceA3",
    dataType: "N" as const,
    canonicalDescription: "The A sell price, if the quantity is greater than or equal to QtyBreak3",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBrkSellPriceA4",
    dataType: "N" as const,
    canonicalDescription: "The A sell price, if the quantity is greater than or equal to QtyBreak4",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBrkSellPriceB1",
    dataType: "N" as const,
    canonicalDescription: "The B sell price, if the quantity is greater than or equal to QtyBreak1",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBrkSellPriceB2",
    dataType: "N" as const,
    canonicalDescription: "The B sell price, if the quantity is greater than or equal to QtyBreak2",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBrkSellPriceB3",
    dataType: "N" as const,
    canonicalDescription: "The B sell price, if the quantity is greater than or equal to QtyBreak3",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "QtyBrkSellPriceB4",
    dataType: "N" as const,
    canonicalDescription: "The B sell price, if the quantity is greater than or equal to QtyBreak4",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // INVENTORY MANAGEMENT
  {
    fieldName: "StockOnHand",
    dataType: "N" as const,
    canonicalDescription: "The total number of items of stock of the product that you have on hand. This is represented in the selling units for the product. Use the SOHForLocation(location) function for the stock at a given location",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "StockValue",
    dataType: "N" as const,
    canonicalDescription: "The value of the stock on hand (based on purchase cost)",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "AverageValue",
    dataType: "N" as const,
    canonicalDescription: "Average per-unit stock value; you cannot alter this. NOTE: This field appears in the manual but is NOT present in empirical MoneyWorks Now v9.2.3 schema (2025-11-25). May be deprecated or version-specific. Verify with documentation before use.",
    manualSource: "moneyworks_export_import_field_descriptions_for_products.html",
    isRequired: false
  },
  {
    fieldName: "ReorderLevel",
    dataType: "N" as const,
    canonicalDescription: "The stock level at which a reordering warning should be given. (in selling units)",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "NormalBuildQty",
    dataType: "N" as const,
    canonicalDescription: "The normal build/reorder quantity",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "MinBuildQty",
    dataType: "N" as const,
    canonicalDescription: "The minimum build quantity--items must be built in multiples of this",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "LeadTimeDays",
    dataType: "N" as const,
    canonicalDescription: "The expected lead time e for the delivery of the product",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // STOCK TAKE FIELDS
  {
    fieldName: "StockTakeNewQty",
    dataType: "N" as const,
    canonicalDescription: "The total entered stock count for a stock take. Use the StocktakeNewQtyForLocation(location) function for the entered stock count at a given location",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "StockTakeStartQty",
    dataType: "N" as const,
    canonicalDescription: "The total stock on hand when a stock take is commenced. Use the StockTakeStartQtyForLocation(location) function for the commencing stock at a given location",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "StockTakeValue",
    dataType: "N" as const,
    canonicalDescription: "The monetary value of stock at the time of stock take commencement, calculated based on cost price. Used for reconciliation and variance analysis during physical inventory counts.",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false
  },
  
  // ACCOUNT RELATIONSHIPS
  {
    fieldName: "COGAcct",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "Cost Of Goods account. If you only buy the product, this is the Expense account that is debited each time you purchase this product. If you stock and sell the product, this account is debited when you sell the product.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "SalesAcct",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "The Income account that is credited whenever the product is sold.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "StockAcct",
    dataType: "T" as const,
    maxLength: 13,
    canonicalDescription: "The Current Asset account that is debited whenever you buy a product that you stock and is credited whenever you sell it.",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // CATEGORIZATION FIELDS
  {
    fieldName: "Category1",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Any value. This can be used for analysis purposes.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Category2",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Any value. This can be used for analysis purposes.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Category3",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Any value. This can be used for analysis purposes.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Category4",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Any value. This can be used for analysis purposes.",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // JOB COSTING FIELDS
  {
    fieldName: "JobPricingMode",
    dataType: "N" as const,
    canonicalDescription: "Sell price determinator for job costing: 1 = Use Product Sell Price, 2 = Apply Job Markup to Standard Cost, 3 = Use Undiscounted Purchase Price",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "MarginWarning",
    dataType: "N" as const,
    canonicalDescription: "The minimum margin/markup level for the product below which to show a warning on the Selling Price screen",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Plussage",
    dataType: "N" as const,
    canonicalDescription: "Amount to add to the purchase price for margin calculations within the product sell matrix. Not included in the costs maintained by MoneyWorks",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // METADATA AND EXTENSIBILITY
  {
    fieldName: "Colour",
    dataType: "N" as const,
    canonicalDescription: "The colour of the product record (not necessarily of the actual product), represented internally as a numeric index in the range 0-7 but rendered as a textual colour name",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Comment",
    dataType: "T" as const,
    maxLength: 1020,
    canonicalDescription: "Any additional information about the product.",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "Date and Time the record was last modified",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // CUSTOM FIELDS
  {
    fieldName: "Custom1",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Custom2",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Custom3",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Custom4",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Custom5",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Custom6",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Custom7",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "Custom8",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_products.html"
  },
  
  // USER-DEFINED FIELDS
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "User Defined",
    manualSource: "moneyworks_appendix_products.html"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User Defined",
    manualSource: "moneyworks_appendix_products.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS PRODUCT TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks canonical product type definitions with manual explanations
 */
export interface MoneyWorksProductTypeDefinition {
  type: MoneyWorksProductType;
  canonicalName: string;
  moneyWorksDescription: string;
  manualSource: string;
  businessContext: string;
}

export const MONEYWORKS_PRODUCT_TYPE_DEFINITIONS: MoneyWorksProductTypeDefinition[] = [
  {
    type: MoneyWorksProductType.PRODUCT,
    canonicalName: "Product",
    moneyWorksDescription: "P = product",
    manualSource: "moneyworks_appendix_products.html",
    businessContext: "Physical or digital goods that can be bought, sold, and inventoried"
  },
  {
    type: MoneyWorksProductType.RESOURCE,
    canonicalName: "Resource",
    moneyWorksDescription: "R = resource",
    manualSource: "moneyworks_appendix_products.html",
    businessContext: "Reusable assets or capabilities used in business operations"
  },
  {
    type: MoneyWorksProductType.TIME,
    canonicalName: "Time",
    moneyWorksDescription: "T = time",
    manualSource: "moneyworks_appendix_products.html",
    businessContext: "Time-based services or labor charged by duration"
  },
  {
    type: MoneyWorksProductType.SHIP_METHOD,
    canonicalName: "Ship Method",
    moneyWorksDescription: "S = ship method",
    manualSource: "moneyworks_appendix_products.html",
    businessContext: "Delivery or shipping options with associated costs"
  },
  {
    type: MoneyWorksProductType.OTHER,
    canonicalName: "Other",
    moneyWorksDescription: "O = other",
    manualSource: "moneyworks_appendix_products.html",
    businessContext: "Miscellaneous items that don't fit standard product categories"
  }
];

// ============================================================================
// CANONICAL MONEYWORKS TERMINOLOGY CLARIFICATION
// ============================================================================

/**
 * CRITICAL ARCHITECTURAL INSIGHT:
 * 
 * MoneyWorks Products entity reveals sophisticated multi-dimensional classification:
 * 
 * PRODUCT OPERATIONAL STATES (Hash field - Binary flags):
 * - BUY (0x0002): Can be purchased from suppliers/creditors
 * - SELL (0x0004): Can be sold to customers/debtors  
 * - INVENTORY (0x0008): Physical stock is tracked
 * 
 * PRODUCT TYPES (Type field - Categorical):
 * - Product (P): Standard goods with inventory tracking
 * - Resource (R): Reusable business assets
 * - Time (T): Time-based services
 * - Ship Method (S): Delivery options
 * - Other (O): Miscellaneous items
 * 
 * PRICING COMPLEXITY:
 * - Six sell price levels (A, B, C, D, E, F)
 * - Quantity break pricing (4 break levels per price tier)
 * - Tax inclusion modes per price level
 * - Cost plus and discount pricing modes
 * - Customer-specific or product-specific discounting
 * 
 * ACCOUNT INTEGRATION:
 * - COGAcct: Cost of Goods Sold account (Expense for purchases, COGS for sales)
 * - SalesAcct: Income account credited on sales
 * - StockAcct: Current Asset account for inventory value
 * 
 * This reveals MoneyWorks as enterprise-grade inventory management system,
 * not just basic product catalog.
 */

export const MONEYWORKS_PRODUCT_CANONICAL_TERMS = {
  // Product operational states (MoneyWorks canonical)
  BUY_PRODUCT: "Buy Product",           // Can purchase this product
  SELL_PRODUCT: "Sell Product",         // Can sell this product  
  INVENTORY_PRODUCT: "Inventory Product", // Track stock on hand
  BUILD_PRODUCT: "Build Product",       // Manufactured/assembled product
  
  // Product classifications (MoneyWorks canonical)
  PRODUCT_TYPE: "Product Type",         // P/R/T/S/O classification
  PRODUCT_CODE: "Product Code",         // Unique identifier
  BARCODE: "Barcode",                   // Alternative identification
  
  // Unit management (MoneyWorks canonical)
  BUY_UNIT: "Buy Unit",                 // Units for purchasing (kg, ea, dz)
  SELL_UNIT: "Sell Unit",               // Units for selling (kg, ea, dz)
  CONVERSION_FACTOR: "Conversion Factor", // Buy unit to sell unit conversion
  
  // Pricing structure (MoneyWorks canonical)
  SELL_PRICE_A: "Sell Price A",         // Primary selling price
  SELL_PRICE_B: "Sell Price B",         // Secondary selling price
  SELL_PRICE_C: "Sell Price C",         // Tertiary selling price
  QUANTITY_BREAK_PRICING: "Quantity Break Pricing", // Volume discounting
  
  // Cost management (MoneyWorks canonical)
  BUY_PRICE: "Buy Price",               // Purchase cost
  COST_PRICE: "Cost Price",             // Standard cost (base currency)
  MARGIN_WARNING: "Margin Warning",     // Minimum acceptable margin
  
  // Inventory control (MoneyWorks canonical)
  STOCK_ON_HAND: "Stock On Hand",       // Current inventory quantity
  STOCK_VALUE: "Stock Value",           // Current inventory value
  REORDER_LEVEL: "Reorder Level",       // Minimum stock threshold
  LEAD_TIME: "Lead Time",               // Delivery time in days
  
  // Account relationships (MoneyWorks canonical)
  COST_OF_GOODS_ACCOUNT: "Cost Of Goods Account",   // COGAcct field
  SALES_ACCOUNT: "Sales Account",                   // SalesAcct field  
  STOCK_ACCOUNT: "Stock Account",                   // StockAcct field
  
  // Supplier relationships (MoneyWorks canonical - note terminology)
  SUPPLIER_CODE: "Supplier Code",       // References Names.Code where SupplierType > 0
  SUPPLIERS_CODE: "Suppliers Code",     // Supplier's product reference
  
  // Manufacturing and building (MoneyWorks canonical)
  BUILD_QUANTITY: "Build Quantity",     // Manufacturing quantity
  AUTO_BUILD: "Auto-Build",             // Automatic manufacturing
  
  // Job costing integration (MoneyWorks canonical)
  JOB_PRICING_MODE: "Job Pricing Mode", // How job costs are calculated
  JOB_COST_TAX_INCLUSIVE: "Job Cost Tax Inclusive", // Tax treatment in jobs
  
  // Stock management (MoneyWorks canonical)
  STOCK_TAKE: "Stock Take",             // Physical inventory count
  SERIAL_NUMBER: "Serial Number",       // Individual item tracking
  BATCH_LOT_NUMBER: "Batch Lot Number", // Batch tracking
  
  // Analysis and categorization (MoneyWorks canonical)
  PRODUCT_CATEGORY: "Product Category", // Category1-4 fields
  PRODUCT_COLOUR: "Product Colour",     // Visual classification
  PRODUCT_COMMENT: "Product Comment"    // Additional information
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate that product operational status uses canonical MoneyWorks hash values
 */
export function validateProductStatusCanonical(hash: number): {
  isValid: boolean;
  canBuy: boolean;
  canSell: boolean;
  isInventoried: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const canBuy = !!(hash & MoneyWorksProductStatus.BUY);
  const canSell = !!(hash & MoneyWorksProductStatus.SELL);
  const isInventoried = !!(hash & MoneyWorksProductStatus.INVENTORY);
  
  // Validate canonical MoneyWorks business rules
  if (isInventoried && hash < 8) {
    warnings.push("MoneyWorks canonical rule: All inventoried items must have Hash >= 8");
  }
  
  if (isInventoried && !canBuy && !canSell) {
    warnings.push("MoneyWorks business logic: Inventoried products should be buyable and/or sellable");
  }
  
  return {
    isValid: warnings.length === 0,
    canBuy,
    canSell,
    isInventoried,
    warnings
  };
}

/**
 * Validate canonical MoneyWorks product type
 */
export function validateProductTypeCanonical(type: string): {
  isValid: boolean;
  canonicalType?: MoneyWorksProductType;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  const validTypes = ["P", "R", "T", "S", "O"];
  if (!validTypes.includes(type)) {
    warnings.push(`Invalid ProductType ${type}. MoneyWorks canonical values: P (product), R (resource), T (time), S (ship method), O (other)`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalType: type as MoneyWorksProductType,
    warnings
  };
}

/**
 * Get canonical MoneyWorks product type explanation
 */
export function getCanonicalProductTypeExplanation(type: MoneyWorksProductType): string {
  const typeDef = MONEYWORKS_PRODUCT_TYPE_DEFINITIONS.find(def => def.type === type);
  return typeDef ? `${typeDef.canonicalName}: ${typeDef.businessContext}` : "Unknown product type";
}

/**
 * Validate MoneyWorks product account relationships
 */
export function getCanonicalProductAccountRelationships(hash: number): {
  needsCOGAccount: boolean;
  needsSalesAccount: boolean;
  needsStockAccount: boolean;
  explanation: string;
} {
  const status = validateProductStatusCanonical(hash);
  
  const needsCOG = status.canBuy || status.canSell;
  const needsSales = status.canSell;
  const needsStock = status.isInventoried;
  
  let explanation = "MoneyWorks product account requirements: ";
  if (needsCOG) explanation += "Requires COGAcct (Cost of Goods account). ";
  if (needsSales) explanation += "Requires SalesAcct (Income account for sales). ";
  if (needsStock) explanation += "Requires StockAcct (Current Asset account for inventory). ";
  if (!needsCOG && !needsSales && !needsStock) explanation += "No account requirements.";
  
  return {
    needsCOGAccount: needsCOG,
    needsSalesAccount: needsSales,
    needsStockAccount: needsStock,
    explanation
  };
}

/**
 * Validate MoneyWorks sell discount mode
 */
export function validateSellDiscountModeCanonical(mode: number): {
  isValid: boolean;
  canonicalMode?: MoneyWorksSellDiscountMode;
  explanation: string;
} {
  const validModes = [1, 2, 3, 4];
  const isValid = validModes.includes(mode);
  
  const explanations = {
    1: "None - No discount applied",
    2: "By Customer - Discount determined by customer/debtor settings",
    3: "By Product - Discount determined by product settings", 
    4: "Add - Additive discount calculation"
  };
  
  return {
    isValid,
    canonicalMode: mode as MoneyWorksSellDiscountMode,
    explanation: explanations[mode as keyof typeof explanations] || "Invalid discount mode"
  };
}

/**
 * Check if product has MoneyWorks quantity break pricing
 */
export function hasQuantityBreakPricing(flags: number): boolean {
  return !!(flags & MoneyWorksProductFlags.PRICE_BREAK_ADDITIONAL_UNITS);
}

/**
 * Check if product is a MoneyWorks build item (manufactured)
 */
export function isBuildProduct(flags: number): boolean {
  return !!(flags & MoneyWorksProductFlags.WE_BUILD_IT);
}

/**
 * Check if product has serial number tracking
 */
export function hasSerialNumberTracking(flags: number): boolean {
  return !!(flags & MoneyWorksProductFlags.ITEM_HAS_SERIAL_NUMBER);
}

/**
 * Check if product has batch/lot tracking
 */
export function hasBatchLotTracking(flags: number): boolean {
  return !!(flags & MoneyWorksProductFlags.ITEM_HAS_BATCH_LOT_NUMBER);
}

export default {
  MONEYWORKS_PRODUCT_TYPE_DEFINITIONS,
  MONEYWORKS_PRODUCT_FIELDS,
  MONEYWORKS_PRODUCT_CANONICAL_TERMS
};