/**
 * MoneyWorks Product Type Definitions
 *
 * @moneyworks-entity Product
 * @moneyworks-table Product
 * @moneyworks-manual moneyworks_appendix_products.html
 * @moneyworks-dsl PURE
 *
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate to generic business terms.
 * @ai-forbidden SKU, item-id, unit-price, stock-quantity, cogs-account, revenue-account, asset-account
 * @ai-required Code, Type, Description, BuyPrice, SellPrice, COGAcct, SalesAcct, StockAcct
 */

import type { AccountCode } from "@moneyworks/utilities";
import type {
	MoneyWorksProductType,
	MoneyWorksProductFlags,
	MoneyWorksSellDiscountMode,
	MoneyWorksJobPricingMode,
} from "./enums";

/**
 * MoneyWorks Product Entity
 *
 * CRITICAL: Products represent a sophisticated multi-dimensional classification system
 * with inventory management, pricing matrices, job costing, and manufacturing capabilities.
 *
 * @ai-critical NEVER translate MoneyWorks field names (Code, Type, COGAcct, SalesAcct, StockAcct)
 * @ai-context Even for common terms like "SKU", use MoneyWorks "Code"
 */
export interface MoneyWorksProduct {
	/**
	 * The product code
	 * @moneyworks-field Code
	 * @moneyworks-type T(31)
	 * @ai-term ALWAYS use "Code", NEVER "SKU", "product ID", or "item code"
	 * @example "PROD-001", "SERV-CONSULT", "SHIP-STANDARD"
	 */
	Code: string;

	/**
	 * Product type classification
	 * @moneyworks-field Type
	 * @moneyworks-type T(1)
	 * @ai-term ALWAYS use "Type", NEVER "product category" or "item type"
	 * @ai-context P=product, R=resource, T=time, S=ship method, O=other
	 */
	Type: MoneyWorksProductType;

	/**
	 * The name of the product
	 * @moneyworks-field Description
	 * @moneyworks-type T(255)
	 * @ai-term ALWAYS use "Description", NEVER "name", "title", or "product name"
	 */
	Description: string;

	/**
	 * The item's barcode
	 * @moneyworks-field BarCode
	 * @moneyworks-type T(19)
	 * @ai-term ALWAYS use "BarCode", NEVER "barcode" (different casing)
	 * @ai-context Can be used in transaction entry instead of product code
	 */
	BarCode?: string;

	/**
	 * Hash for fast searching by buy/sell/stock status
	 * @moneyworks-field Hash
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Hash", NEVER "status flags" or "operational status"
	 * @ai-context Binary flags: buy=#0002, sell=#0004, inventory=#0008
	 */
	Hash: number;

	/**
	 * Product operational flags
	 * @moneyworks-field Flags
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Flags", NEVER "features" or "options"
	 * @ai-context See MoneyWorksProductFlags enum
	 */
	Flags?: number;

	// PURCHASING FIELDS

	/**
	 * The undiscounted buy price
	 * @moneyworks-field BuyPrice
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "BuyPrice", NEVER "purchase price", "cost", or "unit cost"
	 * @ai-context Updated automatically if 'Update price whenever purchased' option is on
	 */
	BuyPrice?: number;

	/**
	 * The currency of the last purchase
	 * @moneyworks-field BuyPriceCurrency
	 * @moneyworks-type T(3)
	 * @ai-term ALWAYS use "BuyPriceCurrency", NEVER "purchase currency"
	 */
	BuyPriceCurrency?: string;

	/**
	 * The units in which you buy the product
	 * @moneyworks-field BuyUnit
	 * @moneyworks-type T(5)
	 * @ai-term ALWAYS use "BuyUnit", NEVER "purchase unit"
	 * @example "ea", "kg", "ml", "dz"
	 */
	BuyUnit?: string;

	/**
	 * The weight/volume of the buy unit
	 * @moneyworks-field BuyWeight
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "BuyWeight", NEVER "unit weight"
	 */
	BuyWeight?: number;

	/**
	 * Conversion factor from buy units to sell units
	 * @moneyworks-field ConversionFactor
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "ConversionFactor", NEVER "conversion rate" or "unit conversion"
	 * @ai-context Quantity purchased is divided by this to get selling units
	 */
	ConversionFactor?: number;

	/**
	 * The standard cost of the item
	 * @moneyworks-field CostPrice
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "CostPrice", NEVER "standard cost" or "base cost"
	 * @ai-context For purchased items, this is purchase price adjusted for discount
	 */
	CostPrice?: number;

	/**
	 * The usual supplier code
	 * @moneyworks-field Supplier
	 * @moneyworks-type T(11)
	 * @ai-term ALWAYS use "Supplier", NEVER "vendor" or "supplier ID"
	 * @ai-context Should reference a code in the Names list
	 */
	Supplier?: string;

	/**
	 * The supplier's product code
	 * @moneyworks-field SuppliersCode
	 * @moneyworks-type T(19)
	 * @ai-term ALWAYS use "SuppliersCode", NEVER "vendor SKU" or "supplier product ID"
	 */
	SuppliersCode?: string;

	// SELLING FIELDS

	/**
	 * The "A" sell price
	 * @moneyworks-field SellPrice
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "SellPrice", NEVER "retail price", "unit price", or "price"
	 * @ai-context GST exclusive, before discounts
	 */
	SellPrice?: number;

	/**
	 * The B sell price
	 * @moneyworks-field SellPriceB
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "SellPriceB", NEVER "price tier 2" or "alternative price"
	 */
	SellPriceB?: number;

	/**
	 * The C sell price
	 * @moneyworks-field SellPriceC
	 * @moneyworks-type N
	 */
	SellPriceC?: number;

	/**
	 * The D sell price
	 * @moneyworks-field SellPriceD
	 * @moneyworks-type N
	 */
	SellPriceD?: number;

	/**
	 * The E sell price
	 * @moneyworks-field SellPriceE
	 * @moneyworks-type N
	 */
	SellPriceE?: number;

	/**
	 * The F sell price
	 * @moneyworks-field SellPriceF
	 * @moneyworks-type N
	 */
	SellPriceF?: number;

	/**
	 * The units in which you sell the product
	 * @moneyworks-field SellUnit
	 * @moneyworks-type T(5)
	 * @ai-term ALWAYS use "SellUnit", NEVER "sale unit"
	 * @example "ea", "kg", "ml", "doz"
	 */
	SellUnit?: string;

	/**
	 * The weight/volume of one sell unit
	 * @moneyworks-field SellWeight
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "SellWeight", NEVER "unit weight"
	 */
	SellWeight?: number;

	/**
	 * The percentage discount
	 * @moneyworks-field SellDiscount
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "SellDiscount", NEVER "discount rate"
	 * @ai-context Used only if discount mode is 1 or 3
	 */
	SellDiscount?: number;

	/**
	 * The discount mode
	 * @moneyworks-field SellDiscountMode
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "SellDiscountMode", NEVER "discount type"
	 * @ai-context 1=None, 2=by customer, 3=by product, 4=Add
	 */
	SellDiscountMode?: MoneyWorksSellDiscountMode;

	/**
	 * True if using multiple sell prices
	 * @moneyworks-field UseMultiplePrices
	 * @moneyworks-type B
	 * @ai-term ALWAYS use "UseMultiplePrices", NEVER "has multiple prices"
	 */
	UseMultiplePrices?: boolean;

	// QUANTITY BREAK PRICING

	/**
	 * Quantity at which first break price is used
	 * @moneyworks-field QtyBreak1
	 * @moneyworks-type N
	 */
	QtyBreak1?: number;

	QtyBreak2?: number;
	QtyBreak3?: number;
	QtyBreak4?: number;

	QtyBrkSellPriceA1?: number;
	QtyBrkSellPriceA2?: number;
	QtyBrkSellPriceA3?: number;
	QtyBrkSellPriceA4?: number;

	QtyBrkSellPriceB1?: number;
	QtyBrkSellPriceB2?: number;
	QtyBrkSellPriceB3?: number;
	QtyBrkSellPriceB4?: number;

	// INVENTORY MANAGEMENT

	/**
	 * Total stock on hand in selling units
	 * @moneyworks-field StockOnHand
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "StockOnHand", NEVER "quantity on hand", "inventory", or "stock level"
	 */
	StockOnHand?: number;

	/**
	 * The value of stock on hand
	 * @moneyworks-field StockValue
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "StockValue", NEVER "inventory value"
	 * @ai-context Based on purchase cost
	 */
	StockValue?: number;

	/**
	 * Average per-unit stock value
	 * @moneyworks-field AverageValue
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "AverageValue", NEVER "average cost"
	 * @ai-context Cannot be altered by user
	 */
	AverageValue?: number;

	/**
	 * Stock level for reorder warning
	 * @moneyworks-field ReorderLevel
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "ReorderLevel", NEVER "minimum stock" or "reorder point"
	 * @ai-context In selling units
	 */
	ReorderLevel?: number;

	/**
	 * Normal build/reorder quantity
	 * @moneyworks-field NormalBuildQty
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "NormalBuildQty", NEVER "order quantity"
	 */
	NormalBuildQty?: number;

	/**
	 * Minimum build quantity
	 * @moneyworks-field MinBuildQty
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "MinBuildQty", NEVER "minimum order"
	 * @ai-context Items must be built in multiples of this
	 */
	MinBuildQty?: number;

	/**
	 * Expected lead time for delivery
	 * @moneyworks-field LeadTimeDays
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "LeadTimeDays", NEVER "lead time"
	 */
	LeadTimeDays?: number;

	// STOCK TAKE FIELDS

	/**
	 * Total entered stock count for stock take
	 * @moneyworks-field StockTakeNewQty
	 * @moneyworks-type N
	 */
	StockTakeNewQty?: number;

	/**
	 * Total stock on hand when stock take commenced
	 * @moneyworks-field StockTakeStartQty
	 * @moneyworks-type N
	 */
	StockTakeStartQty?: number;

	// ACCOUNT RELATIONSHIPS

	/**
	 * Cost Of Goods account
	 * @moneyworks-field COGAcct
	 * @moneyworks-type T(13)
	 * @ai-term ALWAYS use "COGAcct", NEVER "COGS account", "cost account", or "expense account"
	 * @ai-context Expense account debited on purchase (non-stock) or sale (stock)
	 */
	COGAcct?: AccountCode;

	/**
	 * The Income account credited on sale
	 * @moneyworks-field SalesAcct
	 * @moneyworks-type T(13)
	 * @ai-term ALWAYS use "SalesAcct", NEVER "revenue account", "income account", or "sales account"
	 */
	SalesAcct?: AccountCode;

	/**
	 * The Current Asset account for inventory
	 * @moneyworks-field StockAcct
	 * @moneyworks-type T(13)
	 * @ai-term ALWAYS use "StockAcct", NEVER "inventory account", "asset account", or "stock account"
	 * @ai-context Debited on buy, credited on sell
	 */
	StockAcct?: AccountCode;

	// CATEGORIZATION FIELDS

	Category1?: string;
	Category2?: string;
	Category3?: string;
	Category4?: string;

	// JOB COSTING FIELDS

	/**
	 * Sell price determinator for job costing
	 * @moneyworks-field JobPricingMode
	 * @moneyworks-type N
	 * @ai-context 1=Use Product Sell Price, 2=Apply Job Markup to Standard Cost, 3=Use Undiscounted Purchase Price
	 */
	JobPricingMode?: MoneyWorksJobPricingMode;

	/**
	 * Minimum margin/markup level warning threshold
	 * @moneyworks-field MarginWarning
	 * @moneyworks-type N
	 */
	MarginWarning?: number;

	/**
	 * Amount to add to purchase price for margin calculations
	 * @moneyworks-field Plussage
	 * @moneyworks-type N
	 * @ai-context Not included in costs maintained by MoneyWorks
	 */
	Plussage?: number;

	// METADATA AND EXTENSIBILITY

	/**
	 * The colour of the product record
	 * @moneyworks-field Colour
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Colour" (British spelling), NEVER "color"
	 * @ai-context Numeric index 0-7, rendered as textual color name
	 */
	Colour?: number;

	/**
	 * Additional information about the product
	 * @moneyworks-field Comment
	 * @moneyworks-type T(1020)
	 */
	Comment?: string;

	/**
	 * Date and time record was last modified
	 * @moneyworks-field LastModifiedTime
	 * @moneyworks-type S
	 */
	LastModifiedTime?: string;

	/**
	 * Scriptable tag storage
	 * @moneyworks-field TaggedText
	 * @moneyworks-type T(255)
	 */
	TaggedText?: string;

	// CUSTOM FIELDS

	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;
	Custom5?: string;
	Custom6?: string;
	Custom7?: string;
	Custom8?: string;

	// USER-DEFINED FIELDS

	/**
	 * Scriptable number
	 * @moneyworks-field UserNum
	 * @moneyworks-type N
	 */
	UserNum?: number;

	/**
	 * Scriptable text
	 * @moneyworks-field UserText
	 * @moneyworks-type T(255)
	 */
	UserText?: string;
}

/**
 * MoneyWorks Product creation input
 * Only required fields for creating a new product
 *
 * @ai-instruction When creating products, use this interface
 */
export interface MoneyWorksProductCreateInput {
	Code: string;
	Type: MoneyWorksProductType;
	Description: string;
	Hash: number;
}

/**
 * MoneyWorks Product update input
 * All fields optional except Code for identification
 *
 * @ai-instruction When updating products, use this interface
 */
export interface MoneyWorksProductUpdateInput {
	Code: string;
	Type?: MoneyWorksProductType;
	Description?: string;
	BarCode?: string;
	Hash?: number;
	Flags?: number;

	// Purchasing
	BuyPrice?: number;
	BuyPriceCurrency?: string;
	BuyUnit?: string;
	BuyWeight?: number;
	ConversionFactor?: number;
	CostPrice?: number;
	Supplier?: string;
	SuppliersCode?: string;

	// Selling
	SellPrice?: number;
	SellPriceB?: number;
	SellPriceC?: number;
	SellPriceD?: number;
	SellPriceE?: number;
	SellPriceF?: number;
	SellUnit?: string;
	SellWeight?: number;
	SellDiscount?: number;
	SellDiscountMode?: MoneyWorksSellDiscountMode;
	UseMultiplePrices?: boolean;

	// Inventory
	ReorderLevel?: number;
	NormalBuildQty?: number;
	MinBuildQty?: number;
	LeadTimeDays?: number;

	// Accounts
	COGAcct?: AccountCode;
	SalesAcct?: AccountCode;
	StockAcct?: AccountCode;

	// Categories
	Category1?: string;
	Category2?: string;
	Category3?: string;
	Category4?: string;

	// Job Costing
	JobPricingMode?: MoneyWorksJobPricingMode;
	MarginWarning?: number;
	Plussage?: number;

	// Metadata
	Colour?: number;
	Comment?: string;

	// Custom
	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;
	Custom5?: string;
	Custom6?: string;
	Custom7?: string;
	Custom8?: string;

	// User-defined
	UserNum?: number;
	UserText?: string;
	TaggedText?: string;
}

/**
 * MoneyWorks Product filter for search/query operations
 *
 * @ai-instruction When searching products, use this interface
 */
export interface MoneyWorksProductFilter {
	/** Filter by product code */
	code?: string;

	/** Filter by product type */
	type?: MoneyWorksProductType;

	/** Filter by supplier */
	supplier?: string;

	/** Filter by category */
	category1?: string;
	category2?: string;
	category3?: string;
	category4?: string;

	/** Filter by inventory status */
	isInventoried?: boolean;
	hasLowStock?: boolean;

	/** Search text (searches Code, Description) */
	searchText?: string;
}
