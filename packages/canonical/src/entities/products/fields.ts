/**
 * MoneyWorks Products Entity - Field Definitions
 *
 * Complete field metadata for the Products table
 * Source: MoneyWorks Manual - Products Field Descriptions (moneyworks_appendix_products.html)
 *
 * @ai-instruction These are the canonical MW field definitions. Use for validation and metadata.
 */

export interface MoneyWorksProductField {
	/** MoneyWorks field name (exact) */
	fieldName: string;
	/** MW data type: T=Text, N=Number, D=Date, B=Boolean, S=Timestamp */
	dataType: "T" | "N" | "D" | "B" | "S";
	/** Maximum length for text fields */
	maxLength?: number;
	/** Field description from MW manual */
	description: string;
	/** Whether field is required */
	required: boolean;
	/** Whether field is indexed for search */
	indexed?: boolean;
	/** Related entity/table */
	relatedEntity?: string;
	/** Special validation rules */
	validationRules?: string[];
}

/**
 * Complete field definitions for MoneyWorks Products entity
 * Used for validation, UI generation, and documentation
 */
export const MONEYWORKS_PRODUCT_FIELDS: MoneyWorksProductField[] = [
	// ============= IDENTIFICATION =============
	{
		fieldName: "Code",
		dataType: "T",
		maxLength: 31,
		description: "The product code - unique identifier",
		required: true,
		indexed: true,
		validationRules: ["Must be unique across all products"],
	},
	{
		fieldName: "Type",
		dataType: "T",
		maxLength: 1,
		description:
			"Product type classification: P=Product, R=Resource, T=Time, S=Ship method, O=Other",
		required: true,
		validationRules: ["Must be P, R, T, S, or O"],
	},
	{
		fieldName: "Description",
		dataType: "T",
		maxLength: 255,
		description: "The name/description of the product",
		required: false,
		indexed: true,
	},
	{
		fieldName: "BarCode",
		dataType: "T",
		maxLength: 19,
		description: "The item's barcode for transaction entry",
		required: false,
		indexed: true,
	},
	{
		fieldName: "LastModifiedTime",
		dataType: "S",
		description: "Date and time the record was last modified",
		required: false,
	},

	// ============= OPERATIONAL STATUS =============
	{
		fieldName: "Hash",
		dataType: "N",
		description:
			"Fast search hash for buy/sell/stock status: Buy=#0002, Sell=#0004, Inventory=#0008",
		required: true,
		validationRules: ["All inventoried items will have Hash >= 8"],
	},
	{
		fieldName: "Flags",
		dataType: "N",
		description: "Product behavior flags - bit mapped field",
		required: false,
		validationRules: ["Use bitwise operations to check/set flags"],
	},

	// ============= PURCHASING =============
	{
		fieldName: "BuyPrice",
		dataType: "N",
		description:
			"Undiscounted buy price of one buy unit (in purchase currency)",
		required: false,
	},
	{
		fieldName: "BuyPriceCurrency",
		dataType: "T",
		maxLength: 3,
		description: "Currency of the last purchase (blank = local currency)",
		required: false,
		relatedEntity: "Currencies",
	},
	{
		fieldName: "BuyUnit",
		dataType: "T",
		maxLength: 5,
		description: "Units in which product is purchased (e.g., ea, kg, ml, dz)",
		required: false,
	},
	{
		fieldName: "BuyWeight",
		dataType: "N",
		description: "Weight/volume of the buy unit",
		required: false,
	},
	{
		fieldName: "ConversionFactor",
		dataType: "N",
		description:
			"Conversion factor from buy units to sell units (Purchased quantity ÷ ConversionFactor = selling units)",
		required: false,
	},
	{
		fieldName: "CostPrice",
		dataType: "N",
		description:
			"Standard cost of the item in base currency (for purchased items: buy price adjusted)",
		required: false,
	},
	{
		fieldName: "Supplier",
		dataType: "T",
		maxLength: 11,
		description: "Usual supplier code",
		required: false,
		relatedEntity: "Names",
	},
	{
		fieldName: "SuppliersCode",
		dataType: "T",
		maxLength: 19,
		description: "Supplier's product code/reference",
		required: false,
	},

	// ============= SELLING =============
	{
		fieldName: "SellPrice",
		dataType: "N",
		description: "A sell price (GST exclusive, before discounts)",
		required: false,
	},
	{
		fieldName: "SellPriceB",
		dataType: "N",
		description: "B sell price (GST exclusive, before discounts)",
		required: false,
	},
	{
		fieldName: "SellPriceC",
		dataType: "N",
		description: "C sell price (GST exclusive, before discounts)",
		required: false,
	},
	{
		fieldName: "SellPriceD",
		dataType: "N",
		description: "D sell price (GST exclusive, before discounts)",
		required: false,
	},
	{
		fieldName: "SellPriceE",
		dataType: "N",
		description: "E sell price (GST exclusive, before discounts)",
		required: false,
	},
	{
		fieldName: "SellPriceF",
		dataType: "N",
		description: "F sell price (GST exclusive, before discounts)",
		required: false,
	},
	{
		fieldName: "SellUnit",
		dataType: "T",
		maxLength: 5,
		description: "Units in which product is sold (e.g., ea, kg, ml, doz)",
		required: false,
	},
	{
		fieldName: "SellWeight",
		dataType: "N",
		description: "Weight/volume of one sell unit",
		required: false,
	},
	{
		fieldName: "SellDiscount",
		dataType: "N",
		description: "Percentage discount (used only if discount mode is 1 or 3)",
		required: false,
	},
	{
		fieldName: "SellDiscountMode",
		dataType: "N",
		description: "Discount mode: 1=None, 2=By customer, 3=By product, 4=Add",
		required: false,
		validationRules: ["Must be 1, 2, 3, or 4"],
	},
	{
		fieldName: "UseMultiplePrices",
		dataType: "B",
		description: "True if using multiple sell prices (A-F)",
		required: false,
	},

	// ============= QUANTITY BREAK PRICING =============
	{
		fieldName: "QtyBreak1",
		dataType: "N",
		description: "Quantity at which first break price is used",
		required: false,
	},
	{
		fieldName: "QtyBreak2",
		dataType: "N",
		description: "Quantity at which second break price is used",
		required: false,
	},
	{
		fieldName: "QtyBreak3",
		dataType: "N",
		description: "Quantity at which third break price is used",
		required: false,
	},
	{
		fieldName: "QtyBreak4",
		dataType: "N",
		description: "Quantity at which fourth break price is used",
		required: false,
	},
	{
		fieldName: "QtyBrkSellPriceA1",
		dataType: "N",
		description: "A sell price if quantity >= QtyBreak1",
		required: false,
	},
	{
		fieldName: "QtyBrkSellPriceA2",
		dataType: "N",
		description: "A sell price if quantity >= QtyBreak2",
		required: false,
	},
	{
		fieldName: "QtyBrkSellPriceA3",
		dataType: "N",
		description: "A sell price if quantity >= QtyBreak3",
		required: false,
	},
	{
		fieldName: "QtyBrkSellPriceA4",
		dataType: "N",
		description: "A sell price if quantity >= QtyBreak4",
		required: false,
	},
	{
		fieldName: "QtyBrkSellPriceB1",
		dataType: "N",
		description: "B sell price if quantity >= QtyBreak1",
		required: false,
	},
	{
		fieldName: "QtyBrkSellPriceB2",
		dataType: "N",
		description: "B sell price if quantity >= QtyBreak2",
		required: false,
	},
	{
		fieldName: "QtyBrkSellPriceB3",
		dataType: "N",
		description: "B sell price if quantity >= QtyBreak3",
		required: false,
	},
	{
		fieldName: "QtyBrkSellPriceB4",
		dataType: "N",
		description: "B sell price if quantity >= QtyBreak4",
		required: false,
	},

	// ============= INVENTORY MANAGEMENT =============
	{
		fieldName: "StockOnHand",
		dataType: "N",
		description:
			"Total stock on hand in selling units (use SOHForLocation for specific location)",
		required: false,
	},
	{
		fieldName: "StockValue",
		dataType: "N",
		description: "Value of stock on hand (based on purchase cost)",
		required: false,
	},
	{
		fieldName: "ReorderLevel",
		dataType: "N",
		description: "Stock level for reordering warning (in selling units)",
		required: false,
	},
	{
		fieldName: "NormalBuildQty",
		dataType: "N",
		description: "Normal build/reorder quantity",
		required: false,
	},
	{
		fieldName: "MinBuildQty",
		dataType: "N",
		description:
			"Minimum build quantity - items must be built in multiples of this",
		required: false,
	},
	{
		fieldName: "LeadTimeDays",
		dataType: "N",
		description: "Expected lead time for delivery (in days)",
		required: false,
	},

	// ============= STOCK TAKE =============
	{
		fieldName: "StockTakeNewQty",
		dataType: "N",
		description: "Total entered stock count for a stock take",
		required: false,
	},
	{
		fieldName: "StockTakeStartQty",
		dataType: "N",
		description: "Total stock on hand when stock take commenced",
		required: false,
	},

	// ============= GL ACCOUNT RELATIONSHIPS =============
	{
		fieldName: "COGAcct",
		dataType: "T",
		maxLength: 13,
		description:
			"Cost Of Goods account - Expense account debited on purchase/sale",
		required: false,
		relatedEntity: "Account",
	},
	{
		fieldName: "SalesAcct",
		dataType: "T",
		maxLength: 13,
		description: "Income account credited on sale",
		required: false,
		relatedEntity: "Account",
	},
	{
		fieldName: "StockAcct",
		dataType: "T",
		maxLength: 13,
		description:
			"Current Asset account for inventory value (debited on purchase, credited on sale)",
		required: false,
		relatedEntity: "Account",
	},

	// ============= CATEGORIZATION =============
	{
		fieldName: "Category1",
		dataType: "T",
		maxLength: 15,
		description: "User-defined category 1 for analysis purposes",
		required: false,
	},
	{
		fieldName: "Category2",
		dataType: "T",
		maxLength: 15,
		description: "User-defined category 2 for analysis purposes",
		required: false,
	},
	{
		fieldName: "Category3",
		dataType: "T",
		maxLength: 15,
		description: "User-defined category 3 for analysis purposes",
		required: false,
	},
	{
		fieldName: "Category4",
		dataType: "T",
		maxLength: 15,
		description: "User-defined category 4 for analysis purposes",
		required: false,
	},

	// ============= JOB COSTING =============
	{
		fieldName: "JobPricingMode",
		dataType: "N",
		description:
			"Sell price determinator for job costing: 1=Use Product Sell Price, 2=Apply Job Markup, 3=Use Undiscounted Purchase Price",
		required: false,
		validationRules: ["Must be 1, 2, or 3"],
	},
	{
		fieldName: "MarginWarning",
		dataType: "N",
		description:
			"Minimum margin/markup level below which to show warning on Selling Price screen",
		required: false,
	},
	{
		fieldName: "Plussage",
		dataType: "N",
		description:
			"Amount to add to purchase price for margin calculations (not included in MW costs)",
		required: false,
	},

	// ============= TAX =============
	{
		fieldName: "TaxCode",
		dataType: "T",
		maxLength: 5,
		description: "Tax code for sales",
		required: false,
		relatedEntity: "TaxRate",
	},
	{
		fieldName: "TaxCodePurchase",
		dataType: "T",
		maxLength: 5,
		description: "Tax code for purchases",
		required: false,
		relatedEntity: "TaxRate",
	},

	// ============= METADATA =============
	{
		fieldName: "Colour",
		dataType: "N",
		description:
			"Color of the product record (0-7), rendered as textual color name",
		required: false,
		validationRules: ["Must be between 0 and 7"],
	},
	{
		fieldName: "Comment",
		dataType: "T",
		maxLength: 1020,
		description: "Additional information about the product",
		required: false,
	},
	{
		fieldName: "TaggedText",
		dataType: "T",
		maxLength: 255,
		description: "Scriptable tag storage",
		required: false,
	},

	// ============= CUSTOM FIELDS =============
	{
		fieldName: "Custom1",
		dataType: "T",
		maxLength: 255,
		description: "Custom field 1 - for your own use",
		required: false,
	},
	{
		fieldName: "Custom2",
		dataType: "T",
		maxLength: 255,
		description: "Custom field 2 - for your own use",
		required: false,
	},
	{
		fieldName: "Custom3",
		dataType: "T",
		maxLength: 15,
		description: "Custom field 3 - for your own use",
		required: false,
	},
	{
		fieldName: "Custom4",
		dataType: "T",
		maxLength: 15,
		description: "Custom field 4 - for your own use",
		required: false,
	},
	{
		fieldName: "Custom5",
		dataType: "T",
		maxLength: 15,
		description: "Custom field 5 - for your own use",
		required: false,
	},
	{
		fieldName: "Custom6",
		dataType: "T",
		maxLength: 15,
		description: "Custom field 6 - for your own use",
		required: false,
	},
	{
		fieldName: "Custom7",
		dataType: "T",
		maxLength: 15,
		description: "Custom field 7 - for your own use",
		required: false,
	},
	{
		fieldName: "Custom8",
		dataType: "T",
		maxLength: 15,
		description: "Custom field 8 - for your own use",
		required: false,
	},

	// ============= USER-DEFINED FIELDS =============
	{
		fieldName: "UserNum",
		dataType: "N",
		description: "Scriptable number field",
		required: false,
	},
	{
		fieldName: "UserText",
		dataType: "T",
		maxLength: 255,
		description: "Scriptable text field",
		required: false,
	},
];

/**
 * Get field definition by name
 */
export function getProductField(
	fieldName: string,
): MoneyWorksProductField | undefined {
	return MONEYWORKS_PRODUCT_FIELDS.find((f) => f.fieldName === fieldName);
}

/**
 * Get all required fields
 */
export function getRequiredProductFields(): MoneyWorksProductField[] {
	return MONEYWORKS_PRODUCT_FIELDS.filter((f) => f.required);
}

/**
 * Get all indexed fields
 */
export function getIndexedProductFields(): MoneyWorksProductField[] {
	return MONEYWORKS_PRODUCT_FIELDS.filter((f) => f.indexed);
}
