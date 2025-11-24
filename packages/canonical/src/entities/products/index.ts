/**
 * MoneyWorks Products Entity - Canonical Exports
 *
 * Re-exports all product types, enums, and interfaces
 */

// Types
export type {
	MoneyWorksProduct,
	MoneyWorksProductInput,
	MoneyWorksProductFilter,
} from "./types";

// Enums
export {
	MoneyWorksProductType,
	MoneyWorksProductStatus,
	MoneyWorksProductFlags,
	MoneyWorksSellDiscountMode,
	MoneyWorksJobPricingMode,
	MoneyWorksProductPricingLevel,
} from "./enums";

// Field definitions
export {
	MONEYWORKS_PRODUCT_FIELDS,
	getProductField,
	getRequiredProductFields,
	getIndexedProductFields,
	type MoneyWorksProductField,
} from "./fields";

// Validators
export {
	validateProduct,
	validateProductCode,
	validatePricing,
	checkProductStatus,
	isKit,
	isNonStock,
	isInventoried,
	canBuy,
	canSell,
	hasSerialNumber,
	hasBatchTracking,
	getProductMargin,
	getProductMarkup,
	getEffectiveSellPrice,
	isBelowReorderLevel,
	type ValidationError,
	type ValidationResult,
} from "./validators";

// Re-export common MW terms for convenience
export const MW_PRODUCT_TERMS = {
	PRODUCT: "Product",
	RESOURCE: "Resource",
	TIME: "Time",
	SHIP_METHOD: "Ship Method",
	OTHER: "Other",
	BUY: "We buy it",
	SELL: "We sell it",
	INVENTORY: "We inventory it",
	NO_DISCOUNT: "None",
	BY_CUSTOMER: "By Customer",
	BY_PRODUCT: "By Product",
	ADD_DISCOUNT: "Add",
	USE_PRODUCT_SELL_PRICE: "Use Product Sell Price",
	APPLY_JOB_MARKUP: "Apply Job Markup to Standard Cost",
	USE_PURCHASE_PRICE: "Use Undiscounted Purchase Price",
} as const;
