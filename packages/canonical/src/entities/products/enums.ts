/**
 * MoneyWorks Products Entity - Canonical Enumerations
 *
 * PURE MoneyWorks enumerations preserving exact values and terminology
 * Source: MoneyWorks Manual - Products Field Descriptions
 *
 * @ai-instruction These enums represent MoneyWorks' canonical values. NEVER change.
 * @ai-critical Product Types use single-letter codes (P/R/T/S/O) - these are CANONICAL
 */

/**
 * MoneyWorks Product Type Classification
 *
 * Source: moneyworks_appendix_products.html - "Type" field
 * @ai-instruction Use ONLY these product type values
 * @ai-forbidden inventory-item, service-item, labor, shipping, misc
 * @ai-required PRODUCT, RESOURCE, TIME, SHIP_METHOD, OTHER
 */
export enum MoneyWorksProductType {
	/**
	 * Product - Physical or digital goods that can be bought, sold, and inventoried
	 * @moneyworks-value "P"
	 * @ai-term Say "PRODUCT type", NEVER "inventory item" or "stock item"
	 */
	PRODUCT = "P",

	/**
	 * Resource - Reusable assets or capabilities used in business operations
	 * @moneyworks-value "R"
	 * @ai-term Say "RESOURCE type", NEVER "equipment" or "asset"
	 */
	RESOURCE = "R",

	/**
	 * Time - Time-based services or labor charged by duration
	 * @moneyworks-value "T"
	 * @ai-term Say "TIME type", NEVER "labor" or "service hours"
	 */
	TIME = "T",

	/**
	 * Ship Method - Delivery or shipping options with associated costs
	 * @moneyworks-value "S"
	 * @ai-term Say "SHIP_METHOD type", NEVER "delivery" or "freight"
	 */
	SHIP_METHOD = "S",

	/**
	 * Other - Miscellaneous items that don't fit standard product categories
	 * @moneyworks-value "O"
	 * @ai-term Say "OTHER type", NEVER "miscellaneous" or "misc"
	 */
	OTHER = "O",
}

/**
 * MoneyWorks Product Status Flags (bit-mapped)
 *
 * Source: moneyworks_appendix_products.html - "Hash" field description
 * @ai-instruction Use bitwise operations to check/set status flags
 * @ai-critical Hash field uses these bit flags for fast searching: buy (#0002), sell (#0004), inventory (#0008)
 * @ai-rule All inventoried items MUST have Hash >= 8
 */
export enum MoneyWorksProductStatus {
	/**
	 * We buy it - Can purchase this product from suppliers
	 * @moneyworks-value 0x0002
	 * @ai-term Say "BUY status", NEVER "purchasable" or "can purchase"
	 */
	BUY = 0x0002,

	/**
	 * We sell it - Can sell this product to customers
	 * @moneyworks-value 0x0004
	 * @ai-term Say "SELL status", NEVER "saleable" or "can sell"
	 */
	SELL = 0x0004,

	/**
	 * We inventory it - Physical stock is tracked for this product
	 * @moneyworks-value 0x0008
	 * @ai-term Say "INVENTORY status", NEVER "stockable" or "tracked"
	 */
	INVENTORY = 0x0008,
}

/**
 * MoneyWorks Product Flags (bit-mapped)
 *
 * Source: moneyworks_appendix_products.html - "Product Flags" table
 * @ai-instruction These are bit flags - a product can have multiple flags set
 * @ai-critical Use bitwise OR to combine flags, bitwise AND to check flags
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

	/** We Build it - Manufactured/assembled product */
	WE_BUILD_IT = 0x00000400,

	/** Auto-Build Item - Automatic manufacturing */
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

	/** Price Break on Additional Units - Quantity break pricing enabled */
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

	/** Reorder Warning - Show warning when stock below reorder level */
	REORDER_WARNING = 0x00000100,

	/** Do not update Buy - Don't auto-update buy price on purchase */
	DO_NOT_UPDATE_BUY = 0x00400000,

	/** Item has serial number - Individual item tracking enabled */
	ITEM_HAS_SERIAL_NUMBER = 0x01000000,

	/** Item has batch/lot number - Batch tracking enabled */
	ITEM_HAS_BATCH_LOT_NUMBER = 0x02000000,

	/** Batch/lot expires - Expiry date management enabled */
	BATCH_LOT_EXPIRES = 0x04000000,

	/** We Count It - Include in stock take counts */
	WE_COUNT_IT = 0x08000000,
}

/**
 * MoneyWorks Sell Discount Mode
 *
 * Source: moneyworks_appendix_products.html - "SellDiscountMode" field
 * @ai-instruction Controls how discounts are calculated for product sales
 * @ai-forbidden percentage-discount, flat-discount, tiered-discount
 * @ai-required NONE, BY_CUSTOMER, BY_PRODUCT, ADD
 */
export enum MoneyWorksSellDiscountMode {
	/**
	 * None - No discount applied
	 * @moneyworks-value 1
	 * @ai-term Say "NONE discount mode", NEVER "no discount"
	 */
	NONE = 1,

	/**
	 * By Customer - Discount determined by customer/debtor settings
	 * @moneyworks-value 2
	 * @ai-term Say "BY_CUSTOMER discount mode", NEVER "customer discount"
	 */
	BY_CUSTOMER = 2,

	/**
	 * By Product - Discount determined by product settings
	 * @moneyworks-value 3
	 * @ai-term Say "BY_PRODUCT discount mode", NEVER "product discount"
	 */
	BY_PRODUCT = 3,

	/**
	 * Add - Additive discount calculation
	 * @moneyworks-value 4
	 * @ai-term Say "ADD discount mode", NEVER "additive discount"
	 */
	ADD = 4,
}

/**
 * MoneyWorks Job Pricing Mode
 *
 * Source: moneyworks_appendix_products.html - "JobPricingMode" field
 * @ai-instruction Determines how job costing calculates sell price
 * @ai-forbidden standard-cost, markup, cost-plus
 * @ai-required USE_PRODUCT_SELL_PRICE, APPLY_JOB_MARKUP_TO_STANDARD_COST, USE_UNDISCOUNTED_PURCHASE_PRICE
 */
export enum MoneyWorksJobPricingMode {
	/**
	 * Use Product Sell Price - Job uses standard product pricing
	 * @moneyworks-value 1
	 * @ai-term Say "USE_PRODUCT_SELL_PRICE mode", NEVER "standard pricing"
	 */
	USE_PRODUCT_SELL_PRICE = 1,

	/**
	 * Apply Job Markup to Standard Cost - Job applies markup to cost
	 * @moneyworks-value 2
	 * @ai-term Say "APPLY_JOB_MARKUP_TO_STANDARD_COST mode", NEVER "cost plus markup"
	 */
	APPLY_JOB_MARKUP_TO_STANDARD_COST = 2,

	/**
	 * Use Undiscounted Purchase Price - Job uses actual purchase price
	 * @moneyworks-value 3
	 * @ai-term Say "USE_UNDISCOUNTED_PURCHASE_PRICE mode", NEVER "actual cost"
	 */
	USE_UNDISCOUNTED_PURCHASE_PRICE = 3,
}

/**
 * MoneyWorks Product Pricing Levels
 *
 * Used to determine which price level applies to a sale
 * Inherited from Names entity for consistency
 *
 * @ai-instruction Use these price level codes when working with multi-tier pricing
 */
export enum MoneyWorksProductPricingLevel {
	/** Price level A - Primary/default pricing tier */
	A = "A",

	/** Price level B - Secondary pricing tier */
	B = "B",

	/** Price level C - Third pricing tier */
	C = "C",

	/** Price level D - Fourth pricing tier */
	D = "D",

	/** Price level E - Fifth pricing tier */
	E = "E",

	/** Price level F - Sixth pricing tier */
	F = "F",
}
