/**
 * MoneyWorks Products Entity - Canonical Type Definitions
 *
 * PURE MoneyWorks data types preserving exact field names and business logic
 * Source: MoneyWorks Manual - Products Field Descriptions (moneyworks_appendix_products.html)
 *
 * @ai-instruction CRITICAL: These are canonical MW types. NEVER rename fields.
 * @ai-instruction Products use exact MoneyWorks field names: StockCode -> Code, SellPrice, CostPrice, etc.
 * @ai-instruction Products support multi-tier pricing (A-F), quantity breaks, and manufacturing/building
 */

import type { AccountCode, ProductCode, YYYYMMDD } from "@moneyworks/utilities";
import {
	type MoneyWorksJobPricingMode,
	MoneyWorksProductFlags,
	MoneyWorksProductStatus,
	type MoneyWorksProductType,
	type MoneyWorksSellDiscountMode,
} from "./enums";

/**
 * MoneyWorks Product entity - represents physical products, services, time, resources, and shipping methods
 *
 * @ai-critical Products have sophisticated multi-dimensional classification:
 * - Operational states (Hash): BUY, SELL, INVENTORY (bit-mapped)
 * - Product types (Type): P/R/T/S/O (categorical)
 * - Six-tier pricing (SellPrice A-F) with quantity breaks
 * - Manufacturing capabilities (BUILD flags)
 * - Serial/batch tracking for inventory control
 */
export interface MoneyWorksProduct {
	// ============= IDENTIFICATION =============
	/**
	 * The product code - unique identifier (max 31 chars)
	 * @ai-term ALWAYS use "Code", NEVER "StockCode" or "ProductCode" in the interface
	 * @ai-context This is the primary key for products
	 */
	Code: ProductCode;

	/**
	 * Product type classification
	 * P = Product, R = Resource, T = Time, S = Ship method, O = Other
	 */
	Type: MoneyWorksProductType;

	/**
	 * The name/description of the product (max 255 chars)
	 */
	Description: string;

	/**
	 * The item's barcode for transaction entry (max 19 chars)
	 * Can be used instead of product code in transactions
	 */
	BarCode: string;

	/**
	 * Date and time the record was last modified (ISO format)
	 */
	LastModifiedTime: string;

	// ============= OPERATIONAL STATUS =============
	/**
	 * Fast search hash for buy/sell/stock status (bit-mapped)
	 * Buy=#0002, Sell=#0004, Inventory=#0008
	 * All inventoried items will have Hash >= 8
	 * @ai-critical Use bitwise operations: (Hash & 0x0002) for buy status
	 */
	Hash: number;

	/**
	 * Product behavior flags (bit-mapped)
	 * See MoneyWorksProductFlags enum for all flag definitions
	 * @ai-critical Use bitwise operations to check/set flags
	 */
	Flags: number;

	// ============= PURCHASING =============
	/**
	 * Undiscounted buy price of one buy unit (in purchase currency)
	 * Updated automatically if 'Update price whenever purchased' is enabled
	 */
	BuyPrice: number;

	/**
	 * Currency of the last purchase (max 3 chars, blank = local currency)
	 */
	BuyPriceCurrency: string;

	/**
	 * Units in which product is purchased (max 5 chars)
	 * e.g., "ea", "kg", "ml", "dz"
	 */
	BuyUnit: string;

	/**
	 * Weight/volume of the buy unit
	 */
	BuyWeight: number;

	/**
	 * Conversion factor from buy units to sell units
	 * Purchased quantity ÷ ConversionFactor = selling units in stock
	 * @ai-context Reciprocal displayed in product entry screen
	 */
	ConversionFactor: number;

	/**
	 * Standard cost of the item in base currency
	 * For purchased items: buy price adjusted for discount, converted to base currency
	 */
	CostPrice: number;

	/**
	 * Usual supplier code (max 11 chars)
	 * Should reference a supplier in the Names list
	 */
	Supplier: string;

	/**
	 * Supplier's product code/reference (max 19 chars)
	 */
	SuppliersCode: string;

	// ============= SELLING =============
	/**
	 * "A" sell price (GST exclusive, before discounts)
	 */
	SellPrice: number;

	/**
	 * "B" sell price (GST exclusive, before discounts)
	 */
	SellPriceB: number;

	/**
	 * "C" sell price (GST exclusive, before discounts)
	 */
	SellPriceC: number;

	/**
	 * "D" sell price (GST exclusive, before discounts)
	 */
	SellPriceD: number;

	/**
	 * "E" sell price (GST exclusive, before discounts)
	 */
	SellPriceE: number;

	/**
	 * "F" sell price (GST exclusive, before discounts)
	 */
	SellPriceF: number;

	/**
	 * Units in which product is sold (max 5 chars)
	 * e.g., "ea", "kg", "ml", "doz"
	 */
	SellUnit: string;

	/**
	 * Weight/volume of one sell unit
	 */
	SellWeight: number;

	/**
	 * Percentage discount (used only if discount mode is 1 or 3)
	 */
	SellDiscount: number;

	/**
	 * Discount mode: 1=None, 2=By customer, 3=By product, 4=Add
	 */
	SellDiscountMode: MoneyWorksSellDiscountMode;

	/**
	 * True if using multiple sell prices (A-F)
	 */
	UseMultiplePrices: boolean;

	// ============= QUANTITY BREAK PRICING =============
	/**
	 * Quantity at which first break price is used
	 */
	QtyBreak1: number;

	/**
	 * Quantity at which second break price is used
	 */
	QtyBreak2: number;

	/**
	 * Quantity at which third break price is used
	 */
	QtyBreak3: number;

	/**
	 * Quantity at which fourth break price is used
	 */
	QtyBreak4: number;

	/**
	 * A sell price if quantity >= QtyBreak1
	 */
	QtyBrkSellPriceA1: number;

	/**
	 * A sell price if quantity >= QtyBreak2
	 */
	QtyBrkSellPriceA2: number;

	/**
	 * A sell price if quantity >= QtyBreak3
	 */
	QtyBrkSellPriceA3: number;

	/**
	 * A sell price if quantity >= QtyBreak4
	 */
	QtyBrkSellPriceA4: number;

	/**
	 * B sell price if quantity >= QtyBreak1
	 */
	QtyBrkSellPriceB1: number;

	/**
	 * B sell price if quantity >= QtyBreak2
	 */
	QtyBrkSellPriceB2: number;

	/**
	 * B sell price if quantity >= QtyBreak3
	 */
	QtyBrkSellPriceB3: number;

	/**
	 * B sell price if quantity >= QtyBreak4
	 */
	QtyBrkSellPriceB4: number;

	// ============= INVENTORY MANAGEMENT =============
	/**
	 * Total stock on hand in selling units
	 * Use SOHForLocation(location) function for stock at specific location
	 */
	StockOnHand: number;

	/**
	 * Value of stock on hand (based on purchase cost)
	 */
	StockValue: number;

	/**
	 * Stock level for reordering warning (in selling units)
	 */
	ReorderLevel: number;

	/**
	 * Normal build/reorder quantity
	 */
	NormalBuildQty: number;

	/**
	 * Minimum build quantity - items must be built in multiples of this
	 */
	MinBuildQty: number;

	/**
	 * Expected lead time for delivery (in days)
	 */
	LeadTimeDays: number;

	// ============= STOCK TAKE =============
	/**
	 * Total entered stock count for a stock take
	 * Use StocktakeNewQtyForLocation(location) for location-specific count
	 */
	StockTakeNewQty: number;

	/**
	 * Total stock on hand when stock take commenced
	 * Use StockTakeStartQtyForLocation(location) for location-specific starting stock
	 */
	StockTakeStartQty: number;

	// ============= GL ACCOUNT RELATIONSHIPS =============
	/**
	 * Cost Of Goods account (max 13 chars)
	 * For purchases: Expense account debited on purchase
	 * For stock & sell: Account debited on sale
	 */
	COGAcct: AccountCode;

	/**
	 * Income account credited on sale (max 13 chars)
	 */
	SalesAcct: AccountCode;

	/**
	 * Current Asset account for inventory value (max 13 chars)
	 * Debited on purchase, credited on sale
	 */
	StockAcct: AccountCode;

	// ============= CATEGORIZATION =============
	/**
	 * User-defined category 1 (max 15 chars)
	 * For analysis purposes
	 */
	Category1: string;

	/**
	 * User-defined category 2 (max 15 chars)
	 * For analysis purposes
	 */
	Category2: string;

	/**
	 * User-defined category 3 (max 15 chars)
	 * For analysis purposes
	 */
	Category3: string;

	/**
	 * User-defined category 4 (max 15 chars)
	 * For analysis purposes
	 */
	Category4: string;

	// ============= JOB COSTING =============
	/**
	 * Sell price determinator for job costing
	 * 1 = Use Product Sell Price
	 * 2 = Apply Job Markup to Standard Cost
	 * 3 = Use Undiscounted Purchase Price
	 */
	JobPricingMode: MoneyWorksJobPricingMode;

	/**
	 * Minimum margin/markup level below which to show warning on Selling Price screen
	 */
	MarginWarning: number;

	/**
	 * Amount to add to purchase price for margin calculations
	 * Not included in costs maintained by MoneyWorks
	 */
	Plussage: number;

	// ============= TAX =============
	/**
	 * Tax code for sales (max 5 chars)
	 */
	TaxCode: string;

	/**
	 * Tax code for purchases (max 5 chars)
	 */
	TaxCodePurchase: string;

	// ============= METADATA =============
	/**
	 * Color of the product record (0-7)
	 * Rendered as textual color name
	 */
	Colour: number;

	/**
	 * Additional information about the product (max 1020 chars)
	 */
	Comment: string;

	/**
	 * Scriptable tag storage (max 255 chars)
	 */
	TaggedText: string;

	// ============= CUSTOM FIELDS =============
	/**
	 * Custom field 1 (max 255 chars)
	 */
	Custom1: string;

	/**
	 * Custom field 2 (max 255 chars)
	 */
	Custom2: string;

	/**
	 * Custom field 3 (max 15 chars)
	 */
	Custom3: string;

	/**
	 * Custom field 4 (max 15 chars)
	 */
	Custom4: string;

	/**
	 * Custom field 5 (max 15 chars)
	 */
	Custom5: string;

	/**
	 * Custom field 6 (max 15 chars)
	 */
	Custom6: string;

	/**
	 * Custom field 7 (max 15 chars)
	 */
	Custom7: string;

	/**
	 * Custom field 8 (max 15 chars)
	 */
	Custom8: string;

	// ============= USER-DEFINED FIELDS =============
	/**
	 * Scriptable number field
	 */
	UserNum: number;

	/**
	 * Scriptable text field (max 255 chars)
	 */
	UserText: string;
}

/**
 * Optional fields for creating/updating a Product
 * Only Code and Type are required when creating
 *
 * @ai-instruction When creating products, only Code and Type are mandatory
 */
export type MoneyWorksProductInput = Partial<MoneyWorksProduct> & {
	Code: ProductCode;
	Type: MoneyWorksProductType;
};

/**
 * Fields that can be used to filter Products
 *
 * @ai-instruction Use these fields for searching and filtering products
 */
export interface MoneyWorksProductFilter {
	/** Filter by product code */
	Code?: ProductCode;

	/** Filter by product type (P/R/T/S/O) */
	Type?: MoneyWorksProductType;

	/** Filter by description (partial match) */
	Description?: string;

	/** Filter by barcode */
	BarCode?: string;

	/** Filter by operational status (buy/sell/inventory) */
	Hash?: number;

	/** Filter by supplier code */
	Supplier?: string;

	/** Filter by category 1 */
	Category1?: string;

	/** Filter by category 2 */
	Category2?: string;

	/** Filter by category 3 */
	Category3?: string;

	/** Filter by category 4 */
	Category4?: string;

	/** Filter by sell unit */
	SellUnit?: string;

	/** Filter by buy unit */
	BuyUnit?: string;

	/** Filter by tax code */
	TaxCode?: string;

	/** Filter by color index */
	Colour?: number;

	/** Filter products below reorder level */
	BelowReorderLevel?: boolean;

	/** Filter by multiple price usage */
	UseMultiplePrices?: boolean;
}
