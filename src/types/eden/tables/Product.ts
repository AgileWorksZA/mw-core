import { t } from "elysia";

export const ProductOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this product record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Code: t.String({
      description: "The unique product code. Cannot contain spaces or '@'. Indexed.",
      maxLength: 31
    }),
    SuppliersCode: t.Nullable(t.String({
      description: "The product code used by the usual supplier for this item.",
      maxLength: 19
    })),
    Supplier: t.Nullable(t.String({
      description: "The code of the usual supplier for this item. Must be a valid Creditor code.",
      maxLength: 11
    })),
    Description: t.String({
      description: "The name or description of the product/item.",
      maxLength: 255
    }),
    Comment: t.Nullable(t.String({
      description: "General comments about the product.",
      maxLength: 1020
    })),
    Category1: t.Nullable(t.String({
      description: "User-defined category 1 for analysis.",
      maxLength: 15
    })),
    Category2: t.Nullable(t.String({
      description: "User-defined category 2 for analysis.",
      maxLength: 15
    })),
    Category3: t.Nullable(t.String({
      description: "User-defined category 3 for analysis.",
      maxLength: 15
    })),
    Category4: t.Nullable(t.String({
      description: "User-defined category 4 for analysis.",
      maxLength: 15
    })),
    SalesAcct: t.Nullable(t.String({
      description: "Income GL account credited when sold. Required if sold. Can include department.",
      maxLength: 13
    })),
    COGAcct: t.Nullable(t.String({
      description: "Cost Of Goods Sold GL account debited when sold (if stocked) or Expense GL account debited when bought (if not stocked). Required if bought or stocked/sold.",
      maxLength: 13
    })),
    StockAcct: t.Nullable(t.String({
      description: "Stock Asset GL account debited when bought/credited when sold (if stocked). Required if stocked.",
      maxLength: 13
    })),
    UserNum: t.Nullable(t.Number({
      description: "User-defined numeric field (scriptable)."
    })),
    SellUnit: t.Nullable(t.String({
      description: "The units in which the product is sold (e.g., 'ea', 'kg').",
      maxLength: 5
    })),
    SellPrice: t.Nullable(t.Number({
      description: "The 'A' level selling price (tax exclusive by default, before discounts)."
    })),
    Plussage: t.Nullable(t.Number({
      description: "Additional cost added to BuyPrice for margin calculations (not an accounting cost)."
    })),
    BuyWeight: t.Nullable(t.Number({
      description: "Weight/volume of one buying unit (for shipping calculations)."
    })),
    BuyUnit: t.Nullable(t.String({
      description: "The units in which the product is bought.",
      maxLength: 5
    })),
    CostPrice: t.Nullable(t.Number({
      description: "Standard cost in base currency (calculated from last BuyPrice/AvgValue)."
    })),
    ConversionFactor: t.Nullable(t.Number({
      description: "Conversion factor: Sell Units = Buy Units / ConversionFactor. (Note: Reciprocal of UI value)."
    })),
    MarginWarning: t.Nullable(t.Number({
      description: "Minimum margin/markup percentage below which a warning appears in the Sell Prices tab."
    })),
    SellDiscount: t.Nullable(t.Number({
      description: "Default discount percentage applied if SellDiscountMode is 'By Product' or 'Add'."
    })),
    SellDiscountMode: t.Nullable(t.Number({
      description: "Sell discount calculation mode. Values: 1=None, 2=By Customer, 3=By Product, 4=Add."
    })),
    UserText: t.Nullable(t.String({
      description: "User-defined text field (scriptable).",
      maxLength: 255
    })),
    StockOnHand: t.Nullable(t.Number({
      description: "Current total stock on hand across all locations (in selling units). Use SOHForLocation() for specific locations."
    })),
    StockValue: t.Nullable(t.Number({
      description: "Total value of stock on hand (based on average cost)."
    })),
    MinBuildQty: t.Nullable(t.Number({
      description: "Minimum quantity that can be built in one manufacturing run."
    })),
    NormalBuildQty: t.Nullable(t.Number({
      description: "Normal/preferred quantity for a manufacturing run or purchase reorder."
    })),
    ReorderLevel: t.Nullable(t.Number({
      description: "Stock level (in selling units) at which a reorder warning is triggered."
    })),
    JobPricingMode: t.Nullable(t.Number({
      description: "Job pricing mode determining how charges are calculated when used in job costing. Values: 1=Use Product Sell Price, 2=Apply Job Markup to Std Cost, 3=Use Undiscounted Purchase Price."
    })),
    Flags: t.Nullable(t.Number({
      description: "Bitmapped flags field. See documentation for Product Flags."
    })),
    Colour: t.Nullable(t.Number({
      description: "Display color index (0-7)."
    })),
    UseMultiplePrices: t.Nullable(t.Boolean({
      description: "Flag indicating if multiple sell prices (A-F) are enabled for this product."
    })),
    SellPriceB: t.Nullable(t.Number({
      description: "Sell price level B."
    })),
    SellPriceC: t.Nullable(t.Number({
      description: "Sell price level C."
    })),
    SellPriceD: t.Nullable(t.Number({
      description: "Sell price level D (can be cost-plus or discount %)."
    })),
    SellPriceE: t.Nullable(t.Number({
      description: "Sell price level E (can be cost-plus or discount %)."
    })),
    SellPriceF: t.Nullable(t.Number({
      description: "Sell price level F (can be cost-plus or discount %)."
    })),
    QtyBreak1: t.Nullable(t.Number({
      description: "Quantity threshold for the first price break (levels A & B)."
    })),
    QtyBreak2: t.Nullable(t.Number({
      description: "Quantity threshold for the second price break (levels A & B)."
    })),
    QtyBreak3: t.Nullable(t.Number({
      description: "Quantity threshold for the third price break (levels A & B)."
    })),
    QtyBreak4: t.Nullable(t.Number({
      description: "Quantity threshold for the fourth price break (levels A & B)."
    })),
    QtyBrkSellPriceA1: t.Nullable(t.Number({
      description: "Price level A when quantity >= QtyBreak1."
    })),
    QtyBrkSellPriceA2: t.Nullable(t.Number({
      description: "Price level A when quantity >= QtyBreak2."
    })),
    QtyBrkSellPriceA3: t.Nullable(t.Number({
      description: "Price level A when quantity >= QtyBreak3."
    })),
    QtyBrkSellPriceA4: t.Nullable(t.Number({
      description: "Price level A when quantity >= QtyBreak4."
    })),
    QtyBrkSellPriceB1: t.Nullable(t.Number({
      description: "Price level B when quantity >= QtyBreak1."
    })),
    QtyBrkSellPriceB2: t.Nullable(t.Number({
      description: "Price level B when quantity >= QtyBreak2."
    })),
    QtyBrkSellPriceB3: t.Nullable(t.Number({
      description: "Price level B when quantity >= QtyBreak3."
    })),
    QtyBrkSellPriceB4: t.Nullable(t.Number({
      description: "Price level B when quantity >= QtyBreak4."
    })),
    Type: t.Nullable(t.String({
      description: "Item type/class: P=Product, R=Resource, S=Ship Method, T=Time, O=Other.",
      maxLength: 1
    })),
    Count: t.Nullable(t.Number({
      description: "Current count for items marked as 'We Count It' (simple count, not full inventory)."
    })),
    OnOrder: t.Nullable(t.Number({
      description: "Total quantity currently on outstanding Purchase Orders."
    })),
    StockTakeStartQty: t.Nullable(t.Number({
      description: "Total stock on hand recorded at the start of the current stocktake."
    })),
    StockTakeValue: t.Nullable(t.Number({
      description: "Total value of stock recorded at the start of the current stocktake."
    })),
    StockTakeNewQty: t.Nullable(t.Number({
      description: "The physically counted stock quantity entered during the current stocktake."
    })),
    BarCode: t.Nullable(t.String({
      description: "The product's barcode (UPC/EAN or other). Indexed.",
      maxLength: 19
    })),
    BuyPriceCurrency: t.Nullable(t.String({
      description: "The currency code for the last Buy Price update.",
      maxLength: 3
    })),
    BuyPrice: t.Nullable(t.Number({
      description: "Last undiscounted buy price (in BuyPriceCurrency). Updated automatically unless disabled."
    })),
    Custom1: t.Nullable(t.String({
      description: "Custom field 1.",
      maxLength: 255
    })),
    Custom2: t.Nullable(t.String({
      description: "Custom field 2.",
      maxLength: 255
    })),
    Custom3: t.Nullable(t.String({
      description: "Custom field 3.",
      maxLength: 15
    })),
    Custom4: t.Nullable(t.String({
      description: "Custom field 4.",
      maxLength: 15
    })),
    BuyTaxCodeOverride: t.Nullable(t.String({
      description: "Tax code to override the default when buying this item.",
      maxLength: 5
    })),
    SellTaxCodeOverride: t.Nullable(t.String({
      description: "Tax code to override the default when selling this item.",
      maxLength: 5
    })),
    LeadTimeDays: t.Nullable(t.Number({
      description: "Normal lead time in days for delivery from the usual supplier."
    })),
    Hash: t.Nullable(t.Number({
      description: "Internal hash value used for indexing/searching based on Buy/Sell/Stock status."
    })),
    SellWeight: t.Nullable(t.Number({
      description: "Weight/volume of one selling unit (for shipping calculations)."
    })),
    Custom5: t.Nullable(t.String({
      description: "Custom field 5.",
      maxLength: 15
    })),
    Custom6: t.Nullable(t.String({
      description: "Custom field 6.",
      maxLength: 15
    })),
    Custom7: t.Nullable(t.String({
      description: "Custom field 7.",
      maxLength: 15
    })),
    Custom8: t.Nullable(t.String({
      description: "Custom field 8.",
      maxLength: 15
    })),
    TaggedText: t.Nullable(t.String({
      description: "Scriptable tag storage for key-value pairs.",
      maxLength: 255
    })),
  },
  { additionalProperties: true },
);