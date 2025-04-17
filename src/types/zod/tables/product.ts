import { z } from "zod";

// --- Product Enums ---

/**
 * Defines the discount calculation mode for selling the product.
 * 1: None - No automatic discount applied beyond the base price level.
 * 2: By Customer - Use the discount specified in the Customer's Name record.
 * 3: By Product - Use the SellDiscount specified in this Product record.
 * 4: Add - Add both the Customer discount and the Product discount.
 */
export const ProductSellDiscountModeEnum = z
  .enum(["1", "2", "3", "4"])
  .describe(`Defines the discount calculation mode for selling the product.
  1: None - No automatic discount applied beyond the base price level.
  2: By Customer - Use the discount specified in the Customer's Name record.
  3: By Product - Use the SellDiscount specified in this Product record.
  4: Add - Add both the Customer discount and the Product discount.`);

/**
 * Defines the classification or type of the item.
 * P: Product - General items that can be bought, sold, inventoried, and/or manufactured. Required for inventory.
 * R: Resource - Items/services that can be bought and/or sold but not inventoried or manufactured. Can have a standard cost.
 * S: Ship Method - Represents standard shipping methods. Can be bought/sold, not inventoried. Used in order freight lines.
 * T: Time - Represents time sold as a service. Flagged as 'Time' in job costing reports.
 * O: Other - Non-inventoried items not fitting other categories. (Note: Appendix A uses 'S' for Ship, 'T' for Time, 'R' for Resource, 'P' for Product, implies 'O' or similar for Other if specified).
 */
export const ProductTypeEnum = z
  .enum(["P", "R", "S", "T", "O"]) // Assuming 'O' for Other
  .describe(`Defines the classification or type of the item.
  P: Product - General items that can be bought, sold, inventoried, and/or manufactured. Required for inventory.
  R: Resource - Items/services that can be bought and/or sold but not inventoried or manufactured. Can have a standard cost.
  S: Ship Method - Represents standard shipping methods. Can be bought/sold, not inventoried. Used in order freight lines.
  T: Time - Represents time sold as a service. Flagged as 'Time' in job costing reports.
  O: Other - Non-inventoried items not fitting other categories.`);

/**
 * Defines the pricing method used when this item is included in Job Costing.
 * 1: Use Product Sell Price - Use the standard sell price defined in the Product record.
 * 2: Apply Job Markup to Std Cost - Apply the job's default markup percentage to the item's standard cost.
 * 3: Use Undiscounted Purchase Price - Special mode where sell price is derived from UnitPrice and cost from Extension on the originating purchase transaction.
 */
export const JobPricingModeEnum = z
  .enum(["1", "2", "3"])
  .describe(`Defines the pricing method used when this item is included in Job Costing.
  1: Use Product Sell Price - Use the standard sell price defined in the Product record.
  2: Apply Job Markup to Std Cost - Apply the job's default markup percentage to the item's standard cost.
  3: Use Undiscounted Purchase Price - Special mode where sell price is derived from UnitPrice and cost from Extension on the originating purchase transaction.`);

// --- Product Schema ---

/**
 * Zod schema for the Product (Item) record.
 * Internal file name: Product
 * Stores details about products, services, resources, time, or shipping methods bought or sold.
 */
export const productZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this product record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this product record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The unique product code. Cannot contain spaces or '@'. Indexed. Max 31 chars. */
  Code: z
    .string()
    .max(31)
    .describe(
      "The unique product code. Cannot contain spaces or '@'. Indexed. Max 31 chars.",
    ),
  /** The product code used by the usual supplier for this item. Max 19 chars. */
  SuppliersCode: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe(
      "The product code used by the usual supplier for this item. Max 19 chars.",
    ),
  /** The code of the usual supplier for this item. Must be a valid Creditor code. Max 11 chars. */
  Supplier: z
    .string()
    .max(11)
    .nullable()
    .optional()
    .describe(
      "The code of the usual supplier for this item. Must be a valid Creditor code. Max 11 chars.",
    ),
  /** The name or description of the product/item. Max 255 chars. */
  Description: z
    .string()
    .max(255)
    .describe("The name or description of the product/item. Max 255 chars."),
  /** General comments about the product. Max 1020 chars. */
  Comment: z
    .string()
    .max(1020)
    .nullable()
    .optional()
    .describe("General comments about the product. Max 1020 chars."),
  /** User-defined category 1 for analysis. Max 15 chars. */
  Category1: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 1 for analysis. Max 15 chars."),
  /** User-defined category 2 for analysis. Max 15 chars. */
  Category2: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 2 for analysis. Max 15 chars."),
  /** User-defined category 3 for analysis. Max 15 chars. */
  Category3: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 3 for analysis. Max 15 chars."),
  /** User-defined category 4 for analysis. Max 15 chars. */
  Category4: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 4 for analysis. Max 15 chars."),
  /** Income GL account credited when sold. Required if sold. Max 13 chars (can include department). */
  SalesAcct: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "Income GL account credited when sold. Required if sold. Max 13 chars (can include department).",
    ),
  /** Cost Of Goods Sold GL account debited when sold (if stocked) or Expense GL account debited when bought (if not stocked). Required if bought or stocked/sold. Max 13 chars. */
  COGAcct: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "Cost Of Goods Sold GL account debited when sold (if stocked) or Expense GL account debited when bought (if not stocked). Required if bought or stocked/sold. Max 13 chars.",
    ),
  /** Stock Asset GL account debited when bought/credited when sold (if stocked). Required if stocked. Max 13 chars. */
  StockAcct: z
    .string()
    .max(13)
    .nullable()
    .optional()
    .describe(
      "Stock Asset GL account debited when bought/credited when sold (if stocked). Required if stocked. Max 13 chars.",
    ),
  /** User-defined numeric field (scriptable). */
  UserNum: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined numeric field (scriptable)."),
  /** The units in which the product is sold (e.g., 'ea', 'kg'). Max 5 chars. */
  SellUnit: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe(
      "The units in which the product is sold (e.g., 'ea', 'kg'). Max 5 chars.",
    ),
  /** The 'A' level selling price (tax exclusive by default, before discounts). */
  SellPrice: z
    .number()
    .nullable()
    .optional()
    .describe(
      "The 'A' level selling price (tax exclusive by default, before discounts).",
    ),
  /** Additional cost added to BuyPrice for margin calculations (not an accounting cost). */
  Plussage: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Additional cost added to BuyPrice for margin calculations (not an accounting cost).",
    ),
  /** Weight/volume of one buying unit (for shipping calculations). */
  BuyWeight: z
    .number()
    .nullable()
    .optional()
    .describe("Weight/volume of one buying unit (for shipping calculations)."),
  /** The units in which the product is bought. Max 5 chars. */
  BuyUnit: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe("The units in which the product is bought. Max 5 chars."),
  /** Standard cost in base currency (calculated from last BuyPrice/AvgValue). */
  CostPrice: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Standard cost in base currency (calculated from last BuyPrice/AvgValue).",
    ),
  /** Conversion factor: Sell Units = Buy Units / ConversionFactor. (Note: Reciprocal of UI value). */
  ConversionFactor: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Conversion factor: Sell Units = Buy Units / ConversionFactor. (Note: Reciprocal of UI value).",
    ),
  /** Minimum margin/markup percentage below which a warning appears in the Sell Prices tab. */
  MarginWarning: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Minimum margin/markup percentage below which a warning appears in the Sell Prices tab.",
    ),
  /** Default discount percentage applied if SellDiscountMode is 'By Product' or 'Add'. */
  SellDiscount: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Default discount percentage applied if SellDiscountMode is 'By Product' or 'Add'.",
    ),
  /** Sell discount calculation mode. */
  SellDiscountMode: ProductSellDiscountModeEnum.nullable()
    .optional()
    .describe("Sell discount calculation mode."),
  /** User-defined text field (scriptable). Max 255 chars. */
  UserText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-defined text field (scriptable). Max 255 chars."),
  /** Current total stock on hand across all locations (in selling units). Use SOHForLocation() for specific locations. */
  StockOnHand: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Current total stock on hand across all locations (in selling units). Use SOHForLocation() for specific locations.",
    ),
  /** Total value of stock on hand (based on average cost). */
  StockValue: z
    .number()
    .nullable()
    .optional()
    .describe("Total value of stock on hand (based on average cost)."),
  /** Minimum quantity that can be built in one manufacturing run. */
  MinBuildQty: z
    .number()
    .nullable()
    .optional()
    .describe("Minimum quantity that can be built in one manufacturing run."),
  /** Normal/preferred quantity for a manufacturing run or purchase reorder. */
  NormalBuildQty: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Normal/preferred quantity for a manufacturing run or purchase reorder.",
    ),
  /** Stock level (in selling units) at which a reorder warning is triggered. */
  ReorderLevel: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Stock level (in selling units) at which a reorder warning is triggered.",
    ),
  /** Job pricing mode determining how charges are calculated when used in job costing. */
  JobPricingMode: JobPricingModeEnum.nullable()
    .optional()
    .describe(
      "Job pricing mode determining how charges are calculated when used in job costing.",
    ),
  /** Bitmapped flags field. See documentation for Product Flags. */
  Flags: z
    .number()
    .describe("Bitmapped flags field. See documentation for Product Flags."),
  /** Display color index (0-7). */
  Colour: z
    .number()
    .min(0)
    .max(7)
    .nullable()
    .optional()
    .describe("Display color index (0-7)."),
  /** Flag indicating if multiple sell prices (A-F) are enabled for this product. */
  UseMultiplePrices: z
    .boolean()
    .describe(
      "Flag indicating if multiple sell prices (A-F) are enabled for this product.",
    ),
  /** Sell price level B. */
  SellPriceB: z.number().nullable().optional().describe("Sell price level B."),
  /** Sell price level C. */
  SellPriceC: z.number().nullable().optional().describe("Sell price level C."),
  /** Sell price level D (can be cost-plus or discount %). */
  SellPriceD: z
    .number()
    .nullable()
    .optional()
    .describe("Sell price level D (can be cost-plus or discount %)."),
  /** Sell price level E (can be cost-plus or discount %). */
  SellPriceE: z
    .number()
    .nullable()
    .optional()
    .describe("Sell price level E (can be cost-plus or discount %)."),
  /** Sell price level F (can be cost-plus or discount %). */
  SellPriceF: z
    .number()
    .nullable()
    .optional()
    .describe("Sell price level F (can be cost-plus or discount %)."),
  /** Quantity threshold for the first price break (levels A & B). */
  QtyBreak1: z
    .number()
    .nullable()
    .optional()
    .describe("Quantity threshold for the first price break (levels A & B)."),
  /** Quantity threshold for the second price break (levels A & B). */
  QtyBreak2: z
    .number()
    .nullable()
    .optional()
    .describe("Quantity threshold for the second price break (levels A & B)."),
  /** Quantity threshold for the third price break (levels A & B). */
  QtyBreak3: z
    .number()
    .nullable()
    .optional()
    .describe("Quantity threshold for the third price break (levels A & B)."),
  /** Quantity threshold for the fourth price break (levels A & B). */
  QtyBreak4: z
    .number()
    .nullable()
    .optional()
    .describe("Quantity threshold for the fourth price break (levels A & B)."),
  /** Price level A when quantity >= QtyBreak1. */
  QtyBrkSellPriceA1: z
    .number()
    .nullable()
    .optional()
    .describe("Price level A when quantity >= QtyBreak1."),
  /** Price level A when quantity >= QtyBreak2. */
  QtyBrkSellPriceA2: z
    .number()
    .nullable()
    .optional()
    .describe("Price level A when quantity >= QtyBreak2."),
  /** Price level A when quantity >= QtyBreak3. */
  QtyBrkSellPriceA3: z
    .number()
    .nullable()
    .optional()
    .describe("Price level A when quantity >= QtyBreak3."),
  /** Price level A when quantity >= QtyBreak4. */
  QtyBrkSellPriceA4: z
    .number()
    .nullable()
    .optional()
    .describe("Price level A when quantity >= QtyBreak4."),
  /** Price level B when quantity >= QtyBreak1. */
  QtyBrkSellPriceB1: z
    .number()
    .nullable()
    .optional()
    .describe("Price level B when quantity >= QtyBreak1."),
  /** Price level B when quantity >= QtyBreak2. */
  QtyBrkSellPriceB2: z
    .number()
    .nullable()
    .optional()
    .describe("Price level B when quantity >= QtyBreak2."),
  /** Price level B when quantity >= QtyBreak3. */
  QtyBrkSellPriceB3: z
    .number()
    .nullable()
    .optional()
    .describe("Price level B when quantity >= QtyBreak3."),
  /** Price level B when quantity >= QtyBreak4. */
  QtyBrkSellPriceB4: z
    .number()
    .nullable()
    .optional()
    .describe("Price level B when quantity >= QtyBreak4."),
  /** Item type/class (Product, Resource, Ship Method, Time, Other). Max 1 char. */
  Type: ProductTypeEnum.describe(
    "Item type/class (Product, Resource, Ship Method, Time, Other). Max 1 char.",
  ),
  /** Current count for items marked as 'We Count It' (simple count, not full inventory). */
  Count: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Current count for items marked as 'We Count It' (simple count, not full inventory).",
    ),
  /** Total quantity currently on outstanding Purchase Orders. */
  OnOrder: z
    .number()
    .nullable()
    .optional()
    .describe("Total quantity currently on outstanding Purchase Orders."),
  /** Total stock on hand recorded at the start of the current stocktake. */
  StockTakeStartQty: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Total stock on hand recorded at the start of the current stocktake.",
    ),
  /** Total value of stock recorded at the start of the current stocktake. */
  StockTakeValue: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Total value of stock recorded at the start of the current stocktake.",
    ),
  /** The physically counted stock quantity entered during the current stocktake. */
  StockTakeNewQty: z
    .number()
    .nullable()
    .optional()
    .describe(
      "The physically counted stock quantity entered during the current stocktake.",
    ),
  /** The product's barcode (UPC/EAN or other). Indexed. Max 19 chars. */
  BarCode: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe(
      "The product's barcode (UPC/EAN or other). Indexed. Max 19 chars.",
    ),
  /** The currency code for the last Buy Price update. Max 3 chars. */
  BuyPriceCurrency: z
    .string()
    .max(3)
    .nullable()
    .optional()
    .describe("The currency code for the last Buy Price update. Max 3 chars."),
  /** Last undiscounted buy price (in BuyPriceCurrency). Updated automatically unless disabled. */
  BuyPrice: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Last undiscounted buy price (in BuyPriceCurrency). Updated automatically unless disabled.",
    ),
  /** Custom field 1. Max 255 chars. */
  Custom1: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom field 1. Max 255 chars."),
  /** Custom field 2. Max 255 chars. */
  Custom2: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom field 2. Max 255 chars."),
  /** Custom field 3. Max 15 chars. */
  Custom3: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 3. Max 15 chars."),
  /** Custom field 4. Max 15 chars. */
  Custom4: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 4. Max 15 chars."),
  /** Tax code to override the default when buying this item. Max 5 chars. */
  BuyTaxCodeOverride: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe(
      "Tax code to override the default when buying this item. Max 5 chars.",
    ),
  /** Tax code to override the default when selling this item. Max 5 chars. */
  SellTaxCodeOverride: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe(
      "Tax code to override the default when selling this item. Max 5 chars.",
    ),
  /** Normal lead time in days for delivery from the usual supplier. */
  LeadTimeDays: z
    .number()
    .nullable()
    .optional()
    .describe("Normal lead time in days for delivery from the usual supplier."),
  /** Internal hash value used for indexing/searching based on Buy/Sell/Stock status. */
  Hash: z
    .number()
    .describe(
      "Internal hash value used for indexing/searching based on Buy/Sell/Stock status.",
    ),
  /** Weight/volume of one selling unit (for shipping calculations). */
  SellWeight: z
    .number()
    .nullable()
    .optional()
    .describe("Weight/volume of one selling unit (for shipping calculations)."),
  /** Custom field 5. Max 15 chars. */
  Custom5: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 5. Max 15 chars."),
  /** Custom field 6. Max 15 chars. */
  Custom6: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 6. Max 15 chars."),
  /** Custom field 7. Max 15 chars. */
  Custom7: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 7. Max 15 chars."),
  /** Custom field 8. Max 15 chars. */
  Custom8: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 8. Max 15 chars."),
  /** Scriptable tag storage for key-value pairs. Max 255 chars. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage for key-value pairs. Max 255 chars."),
});

/**
 * Inferred TypeScript type from the productZod schema.
 * Represents a fully validated Product (Item) record.
 */
export type ProductZod = z.infer<typeof productZod>;

// Partial schema for updates
export const productPartialSchema = productZod.partial();

/**
 * Inferred TypeScript type from the productPartialSchema.
 * Represents a Product record where all fields are optional.
 */
export type ProductPartialZod = z.infer<typeof productPartialSchema>;
