/**
 * MoneyWorks Product Enumerations
 *
 * @moneyworks-entity Product
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks products
 * @ai-critical NEVER create your own product-related enums or use generic terms
 */

/**
 * MoneyWorks Product Type Classification
 * Source: MoneyWorks Product documentation - "Type" field
 *
 * @ai-instruction When discussing product types, ALWAYS use these MoneyWorks classifications
 * @ai-forbidden item-type, product-category, sku-type
 * @ai-required PRODUCT, SERVICE, ASSEMBLY
 */
export enum MoneyWorksProductType {
	/**
	 * Stock/Physical Product - tracked in inventory
	 * @moneyworks-value 0
	 * @ai-term Say "PRODUCT type" or "Stock", NEVER "physical item" or "goods"
	 */
	PRODUCT = 0,

	/**
	 * Service - non-physical, not inventoried
	 * @moneyworks-value 1
	 * @ai-term Say "SERVICE type", NEVER "intangible" or "non-inventory"
	 */
	SERVICE = 1,

	/**
	 * Assembly - build-to-order item with bill of materials
	 * @moneyworks-value 2
	 * @ai-term Say "ASSEMBLY type", NEVER "kit" or "bundle"
	 */
	ASSEMBLY = 2,
}

/**
 * MoneyWorks Product Status
 * Derived from Active field and usage patterns
 *
 * @ai-instruction Use when discussing product availability
 */
export enum MoneyWorksProductStatus {
	/**
	 * Active and available for use
	 * @ai-term Say "active", NEVER "enabled" or "available"
	 */
	ACTIVE = "ACTIVE",

	/**
	 * Inactive/discontinued
	 * @ai-term Say "inactive", NEVER "disabled" or "archived"
	 */
	INACTIVE = "INACTIVE",
}

/**
 * MoneyWorks Sell Price Discount Mode
 * Controls how discounts are applied to products
 *
 * @ai-instruction Use when discussing product pricing and discounts
 * @ai-forbidden discount-type, price-reduction-mode
 */
export enum MoneyWorksSellDiscountMode {
	/**
	 * No discount
	 * @moneyworks-value 0
	 * @ai-term Say "no discount", NEVER "full price" or "regular price"
	 */
	NONE = 0,

	/**
	 * Percentage discount
	 * @moneyworks-value 1
	 * @ai-term Say "percentage discount", NEVER "percent off"
	 */
	PERCENTAGE = 1,

	/**
	 * Fixed amount discount
	 * @moneyworks-value 2
	 * @ai-term Say "fixed discount", NEVER "dollar off" or "amount reduction"
	 */
	FIXED = 2,
}

/**
 * MoneyWorks Job Pricing Mode
 * Controls how products are priced when used in jobs
 *
 * @ai-instruction Use when discussing job costing and product pricing
 * @ai-forbidden job-price-type, costing-mode
 */
export enum MoneyWorksJobPricingMode {
	/**
	 * Use standard sell price
	 * @moneyworks-value 0
	 * @ai-term Say "standard pricing", NEVER "regular price" or "list price"
	 */
	STANDARD = 0,

	/**
	 * Use cost plus markup
	 * @moneyworks-value 1
	 * @ai-term Say "cost-plus pricing", NEVER "markup pricing"
	 */
	COST_PLUS = 1,

	/**
	 * Use custom price
	 * @moneyworks-value 2
	 * @ai-term Say "custom pricing", NEVER "override price" or "special price"
	 */
	CUSTOM = 2,
}

/**
 * MoneyWorks Product Flags (bitwise Hash field)
 * The Hash field uses bitwise flags to control product behavior
 *
 * @ai-instruction When checking product capabilities, use bitwise operations with these flags
 * @ai-critical Hash >= 8 means inventoried, Hash & MoneyWorksProductFlags.SERIALIZED checks serialization
 * @ai-forbidden product-features, item-options
 */
export enum MoneyWorksProductFlags {
	/**
	 * Not inventoried (Hash < 8)
	 * @ai-term Say "not inventoried", NEVER "non-stock" or "virtual"
	 */
	NOT_INVENTORIED = 0,

	/**
	 * Inventoried - tracked in stock (Hash >= 8)
	 * @moneyworks-value 8
	 * @ai-term Say "inventoried", NEVER "stock-tracked" or "inventory-managed"
	 */
	INVENTORIED = 8,

	/**
	 * Serial number tracking enabled
	 * @moneyworks-value (Hash & 16)
	 * @ai-term Say "serialized", NEVER "serial-tracked" or "unique-identified"
	 */
	SERIALIZED = 16,

	/**
	 * Use multiple price levels
	 * @ai-term Say "multiple price levels", NEVER "tiered pricing" or "price matrix"
	 */
	MULTIPLE_PRICES = 32,
}
