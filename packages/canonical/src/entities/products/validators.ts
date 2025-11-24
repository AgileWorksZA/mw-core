/**
 * MoneyWorks Products Entity - Validation Functions
 *
 * Business rule validation following MoneyWorks requirements
 * Source: MoneyWorks Manual - Products Field Descriptions
 *
 * @ai-instruction These validators enforce MW business rules. Do not relax constraints.
 */

import {
	MoneyWorksJobPricingMode,
	MoneyWorksProductFlags,
	MoneyWorksProductStatus,
	MoneyWorksProductType,
	MoneyWorksSellDiscountMode,
} from "./enums";
import { MONEYWORKS_PRODUCT_FIELDS, getProductField } from "./fields";
import type { MoneyWorksProduct, MoneyWorksProductInput } from "./types";

export interface ValidationError {
	field: string;
	message: string;
	value?: unknown;
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
	warnings?: string[];
}

/**
 * Validate a Product against MoneyWorks business rules
 */
export function validateProduct(
	product: MoneyWorksProductInput,
): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: string[] = [];

	// Required field: Code
	if (!product.Code || product.Code.trim() === "") {
		errors.push({
			field: "Code",
			message: "Product Code is required",
			value: product.Code,
		});
	} else if (product.Code.length > 31) {
		errors.push({
			field: "Code",
			message: "Product Code cannot exceed 31 characters",
			value: product.Code,
		});
	}

	// Required field: Type
	if (!product.Type) {
		errors.push({
			field: "Type",
			message: "Product Type is required",
			value: product.Type,
		});
	} else if (!["P", "R", "T", "S", "O"].includes(product.Type)) {
		errors.push({
			field: "Type",
			message: "Product Type must be P, R, T, S, or O",
			value: product.Type,
		});
	}

	// Validate text field lengths
	validateTextFieldLength(product, "Description", 255, errors);
	validateTextFieldLength(product, "BarCode", 19, errors);
	validateTextFieldLength(product, "BuyPriceCurrency", 3, errors);
	validateTextFieldLength(product, "BuyUnit", 5, errors);
	validateTextFieldLength(product, "Supplier", 11, errors);
	validateTextFieldLength(product, "SuppliersCode", 19, errors);
	validateTextFieldLength(product, "SellUnit", 5, errors);
	validateTextFieldLength(product, "COGAcct", 13, errors);
	validateTextFieldLength(product, "SalesAcct", 13, errors);
	validateTextFieldLength(product, "StockAcct", 13, errors);
	validateTextFieldLength(product, "Category1", 15, errors);
	validateTextFieldLength(product, "Category2", 15, errors);
	validateTextFieldLength(product, "Category3", 15, errors);
	validateTextFieldLength(product, "Category4", 15, errors);
	validateTextFieldLength(product, "TaxCode", 5, errors);
	validateTextFieldLength(product, "TaxCodePurchase", 5, errors);
	validateTextFieldLength(product, "Comment", 1020, errors);
	validateTextFieldLength(product, "TaggedText", 255, errors);
	validateTextFieldLength(product, "Custom1", 255, errors);
	validateTextFieldLength(product, "Custom2", 255, errors);
	validateTextFieldLength(product, "Custom3", 15, errors);
	validateTextFieldLength(product, "Custom4", 15, errors);
	validateTextFieldLength(product, "Custom5", 15, errors);
	validateTextFieldLength(product, "Custom6", 15, errors);
	validateTextFieldLength(product, "Custom7", 15, errors);
	validateTextFieldLength(product, "Custom8", 15, errors);
	validateTextFieldLength(product, "UserText", 255, errors);

	// Validate SellDiscountMode
	if (product.SellDiscountMode !== undefined) {
		if (![1, 2, 3, 4].includes(product.SellDiscountMode)) {
			errors.push({
				field: "SellDiscountMode",
				message:
					"SellDiscountMode must be 1 (None), 2 (By Customer), 3 (By Product), or 4 (Add)",
				value: product.SellDiscountMode,
			});
		}
	}

	// Validate JobPricingMode
	if (product.JobPricingMode !== undefined) {
		if (![1, 2, 3].includes(product.JobPricingMode)) {
			errors.push({
				field: "JobPricingMode",
				message:
					"JobPricingMode must be 1 (Use Product Sell Price), 2 (Apply Job Markup), or 3 (Use Undiscounted Purchase Price)",
				value: product.JobPricingMode,
			});
		}
	}

	// Validate Colour
	if (product.Colour !== undefined) {
		if (product.Colour < 0 || product.Colour > 7) {
			errors.push({
				field: "Colour",
				message: "Colour must be between 0 and 7",
				value: product.Colour,
			});
		}
	}

	// Business rule validations

	// Pricing validation - delegate to specialized function
	const pricingResult = validatePricing(product);
	errors.push(...pricingResult.errors);
	if (pricingResult.warnings) {
		warnings.push(...pricingResult.warnings);
	}

	// Status consistency - delegate to specialized function
	const statusResult = checkProductStatus(product);
	if (statusResult.warnings) {
		warnings.push(...statusResult.warnings);
	}

	// Inventory-specific validations
	if (isInventoried(product)) {
		if (!product.StockAcct) {
			warnings.push(
				"Inventoried products should have a Stock Account (StockAcct) specified",
			);
		}

		if (product.ReorderLevel !== undefined && product.ReorderLevel < 0) {
			errors.push({
				field: "ReorderLevel",
				message: "ReorderLevel cannot be negative",
				value: product.ReorderLevel,
			});
		}
	}

	// Built/manufactured products
	if (
		product.Flags !== undefined &&
		product.Flags & MoneyWorksProductFlags.WE_BUILD_IT
	) {
		if (product.MinBuildQty !== undefined && product.MinBuildQty <= 0) {
			errors.push({
				field: "MinBuildQty",
				message: "MinBuildQty must be greater than 0 for built items",
				value: product.MinBuildQty,
			});
		}
	}

	// Conversion factor validation
	if (product.ConversionFactor !== undefined && product.ConversionFactor <= 0) {
		errors.push({
			field: "ConversionFactor",
			message: "ConversionFactor must be greater than 0",
			value: product.ConversionFactor,
		});
	}

	// Quantity break pricing validation
	if (
		product.QtyBreak1 !== undefined ||
		product.QtyBreak2 !== undefined ||
		product.QtyBreak3 !== undefined ||
		product.QtyBreak4 !== undefined
	) {
		// Ensure quantity breaks are in ascending order
		const breaks = [
			product.QtyBreak1 || 0,
			product.QtyBreak2 || 0,
			product.QtyBreak3 || 0,
			product.QtyBreak4 || 0,
		];

		for (let i = 1; i < breaks.length; i++) {
			if (breaks[i] > 0 && breaks[i] <= breaks[i - 1]) {
				warnings.push(
					`Quantity breaks should be in ascending order: QtyBreak${i + 1} should be greater than QtyBreak${i}`,
				);
			}
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings: warnings.length > 0 ? warnings : undefined,
	};
}

/**
 * Validate product code format
 * Product codes must be unique and within length constraints
 */
export function validateProductCode(code: string): ValidationResult {
	const errors: ValidationError[] = [];

	if (!code || code.trim() === "") {
		errors.push({
			field: "Code",
			message: "Product Code cannot be empty",
			value: code,
		});
	} else if (code.length > 31) {
		errors.push({
			field: "Code",
			message: "Product Code cannot exceed 31 characters",
			value: code,
		});
	}

	// Check for invalid characters that might cause issues
	if (code && /[\r\n\t]/.test(code)) {
		errors.push({
			field: "Code",
			message: "Product Code cannot contain newlines or tabs",
			value: code,
		});
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * Validate product pricing constraints
 */
export function validatePricing(
	product: MoneyWorksProductInput,
): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: string[] = [];

	// Sell prices should be non-negative
	if (product.SellPrice !== undefined && product.SellPrice < 0) {
		errors.push({
			field: "SellPrice",
			message: "SellPrice cannot be negative",
			value: product.SellPrice,
		});
	}
	if (product.SellPriceB !== undefined && product.SellPriceB < 0) {
		errors.push({
			field: "SellPriceB",
			message: "SellPriceB cannot be negative",
			value: product.SellPriceB,
		});
	}
	if (product.SellPriceC !== undefined && product.SellPriceC < 0) {
		errors.push({
			field: "SellPriceC",
			message: "SellPriceC cannot be negative",
			value: product.SellPriceC,
		});
	}
	if (product.SellPriceD !== undefined && product.SellPriceD < 0) {
		errors.push({
			field: "SellPriceD",
			message: "SellPriceD cannot be negative",
			value: product.SellPriceD,
		});
	}
	if (product.SellPriceE !== undefined && product.SellPriceE < 0) {
		errors.push({
			field: "SellPriceE",
			message: "SellPriceE cannot be negative",
			value: product.SellPriceE,
		});
	}
	if (product.SellPriceF !== undefined && product.SellPriceF < 0) {
		errors.push({
			field: "SellPriceF",
			message: "SellPriceF cannot be negative",
			value: product.SellPriceF,
		});
	}

	// Cost price should be non-negative
	if (product.CostPrice !== undefined && product.CostPrice < 0) {
		errors.push({
			field: "CostPrice",
			message: "CostPrice cannot be negative",
			value: product.CostPrice,
		});
	}

	// Buy price should be non-negative
	if (product.BuyPrice !== undefined && product.BuyPrice < 0) {
		errors.push({
			field: "BuyPrice",
			message: "BuyPrice cannot be negative",
			value: product.BuyPrice,
		});
	}

	// Warn if sell price is below cost price
	if (product.SellPrice !== undefined && product.CostPrice !== undefined) {
		if (
			product.SellPrice > 0 &&
			product.CostPrice > 0 &&
			product.SellPrice < product.CostPrice
		) {
			warnings.push(
				"SellPrice is below CostPrice - product will be sold at a loss",
			);
		}
	}

	// Discount validation
	if (product.SellDiscount !== undefined) {
		if (product.SellDiscount < 0 || product.SellDiscount > 100) {
			errors.push({
				field: "SellDiscount",
				message: "SellDiscount must be between 0 and 100",
				value: product.SellDiscount,
			});
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings: warnings.length > 0 ? warnings : undefined,
	};
}

/**
 * Check product status consistency (Hash and Flags alignment)
 */
export function checkProductStatus(
	product: Partial<Pick<MoneyWorksProduct, "Hash" | "Flags">>,
): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: string[] = [];

	// If Hash indicates inventory, must be at least 8
	if (product.Hash !== undefined && product.Hash >= 8) {
		// Check if WE_INVENTORY_IT flag is set
		if (
			product.Flags !== undefined &&
			!(product.Flags & MoneyWorksProductFlags.WE_INVENTORY_IT)
		) {
			warnings.push(
				"Hash indicates inventory (>= 8) but WE_INVENTORY_IT flag is not set",
			);
		}
	}

	// If Hash indicates buy status
	if (
		product.Hash !== undefined &&
		product.Hash & MoneyWorksProductStatus.BUY
	) {
		if (
			product.Flags !== undefined &&
			!(product.Flags & MoneyWorksProductFlags.WE_BUY_IT)
		) {
			warnings.push("Hash indicates BUY status but WE_BUY_IT flag is not set");
		}
	}

	// If Hash indicates sell status
	if (
		product.Hash !== undefined &&
		product.Hash & MoneyWorksProductStatus.SELL
	) {
		if (
			product.Flags !== undefined &&
			!(product.Flags & MoneyWorksProductFlags.WE_SELL_IT)
		) {
			warnings.push(
				"Hash indicates SELL status but WE_SELL_IT flag is not set",
			);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings: warnings.length > 0 ? warnings : undefined,
	};
}

/**
 * Helper to validate text field length
 */
function validateTextFieldLength(
	product: MoneyWorksProductInput,
	fieldName: keyof MoneyWorksProduct,
	maxLength: number,
	errors: ValidationError[],
): void {
	const value = product[fieldName];
	if (
		value !== undefined &&
		typeof value === "string" &&
		value.length > maxLength
	) {
		errors.push({
			field: fieldName,
			message: `${fieldName} cannot exceed ${maxLength} characters`,
			value,
		});
	}
}

// ============= HELPER PREDICATES =============

/**
 * Check if a product is a kit (manufactured/built product)
 */
export function isKit(
	product: Partial<Pick<MoneyWorksProduct, "Flags">>,
): boolean {
	return (
		product.Flags !== undefined &&
		(product.Flags & MoneyWorksProductFlags.WE_BUILD_IT) !== 0
	);
}

/**
 * Check if a product is non-stock (not inventoried)
 */
export function isNonStock(
	product: Partial<Pick<MoneyWorksProduct, "Hash" | "Flags">>,
): boolean {
	// Check both Hash and Flags for inventory status
	const hashNotInventoried = product.Hash !== undefined && product.Hash < 8;
	const flagNotInventoried =
		product.Flags !== undefined &&
		(product.Flags & MoneyWorksProductFlags.WE_INVENTORY_IT) === 0;
	return hashNotInventoried && flagNotInventoried;
}

/**
 * Check if a product is inventoried (stock tracked)
 */
export function isInventoried(
	product: Partial<Pick<MoneyWorksProduct, "Hash" | "Flags">>,
): boolean {
	// Check both Hash and Flags for inventory status
	const hashInventoried = product.Hash !== undefined && product.Hash >= 8;
	const flagInventoried =
		product.Flags !== undefined &&
		(product.Flags & MoneyWorksProductFlags.WE_INVENTORY_IT) !== 0;
	return hashInventoried || flagInventoried;
}

/**
 * Check if product can be purchased
 */
export function canBuy(
	product: Partial<Pick<MoneyWorksProduct, "Hash" | "Flags">>,
): boolean {
	const hashCanBuy =
		product.Hash !== undefined &&
		(product.Hash & MoneyWorksProductStatus.BUY) !== 0;
	const flagCanBuy =
		product.Flags !== undefined &&
		(product.Flags & MoneyWorksProductFlags.WE_BUY_IT) !== 0;
	return hashCanBuy || flagCanBuy;
}

/**
 * Check if product can be sold
 */
export function canSell(
	product: Partial<Pick<MoneyWorksProduct, "Hash" | "Flags">>,
): boolean {
	const hashCanSell =
		product.Hash !== undefined &&
		(product.Hash & MoneyWorksProductStatus.SELL) !== 0;
	const flagCanSell =
		product.Flags !== undefined &&
		(product.Flags & MoneyWorksProductFlags.WE_SELL_IT) !== 0;
	return hashCanSell || flagCanSell;
}

/**
 * Check if product has serial number tracking
 */
export function hasSerialNumber(
	product: Partial<Pick<MoneyWorksProduct, "Flags">>,
): boolean {
	return (
		product.Flags !== undefined &&
		(product.Flags & MoneyWorksProductFlags.ITEM_HAS_SERIAL_NUMBER) !== 0
	);
}

/**
 * Check if product has batch/lot tracking
 */
export function hasBatchTracking(
	product: Partial<Pick<MoneyWorksProduct, "Flags">>,
): boolean {
	return (
		product.Flags !== undefined &&
		(product.Flags & MoneyWorksProductFlags.ITEM_HAS_BATCH_LOT_NUMBER) !== 0
	);
}

// ============= CALCULATION FUNCTIONS =============

/**
 * Calculate product margin as a percentage
 * Formula: (SellPrice - CostPrice) / SellPrice * 100
 * Returns undefined if either price is missing or sell price is 0
 */
export function getProductMargin(
	product: Partial<Pick<MoneyWorksProduct, "SellPrice" | "CostPrice">>,
): number | undefined {
	if (
		product.SellPrice === undefined ||
		product.CostPrice === undefined ||
		product.SellPrice === 0
	) {
		return undefined;
	}

	return ((product.SellPrice - product.CostPrice) / product.SellPrice) * 100;
}

/**
 * Calculate markup as a percentage
 * Formula: (SellPrice - CostPrice) / CostPrice * 100
 * Returns undefined if either price is missing or cost price is 0
 */
export function getProductMarkup(
	product: Partial<Pick<MoneyWorksProduct, "SellPrice" | "CostPrice">>,
): number | undefined {
	if (
		product.SellPrice === undefined ||
		product.CostPrice === undefined ||
		product.CostPrice === 0
	) {
		return undefined;
	}

	return ((product.SellPrice - product.CostPrice) / product.CostPrice) * 100;
}

/**
 * Get effective sell price for a given quantity and price level
 * Takes into account quantity break pricing
 */
export function getEffectiveSellPrice(
	product: Partial<
		Pick<
			MoneyWorksProduct,
			| "SellPrice"
			| "SellPriceB"
			| "QtyBreak1"
			| "QtyBreak2"
			| "QtyBreak3"
			| "QtyBreak4"
			| "QtyBrkSellPriceA1"
			| "QtyBrkSellPriceA2"
			| "QtyBrkSellPriceA3"
			| "QtyBrkSellPriceA4"
			| "QtyBrkSellPriceB1"
			| "QtyBrkSellPriceB2"
			| "QtyBrkSellPriceB3"
			| "QtyBrkSellPriceB4"
		>
	>,
	quantity: number,
	priceLevel: "A" | "B" = "A",
): number | undefined {
	// Get base price for the price level
	const basePrice = priceLevel === "A" ? product.SellPrice : product.SellPriceB;

	if (basePrice === undefined) {
		return undefined;
	}

	// Check quantity breaks (from highest to lowest)
	if (product.QtyBreak4 !== undefined && quantity >= product.QtyBreak4) {
		const breakPrice =
			priceLevel === "A"
				? product.QtyBrkSellPriceA4
				: product.QtyBrkSellPriceB4;
		return breakPrice !== undefined ? breakPrice : basePrice;
	}

	if (product.QtyBreak3 !== undefined && quantity >= product.QtyBreak3) {
		const breakPrice =
			priceLevel === "A"
				? product.QtyBrkSellPriceA3
				: product.QtyBrkSellPriceB3;
		return breakPrice !== undefined ? breakPrice : basePrice;
	}

	if (product.QtyBreak2 !== undefined && quantity >= product.QtyBreak2) {
		const breakPrice =
			priceLevel === "A"
				? product.QtyBrkSellPriceA2
				: product.QtyBrkSellPriceB2;
		return breakPrice !== undefined ? breakPrice : basePrice;
	}

	if (product.QtyBreak1 !== undefined && quantity >= product.QtyBreak1) {
		const breakPrice =
			priceLevel === "A"
				? product.QtyBrkSellPriceA1
				: product.QtyBrkSellPriceB1;
		return breakPrice !== undefined ? breakPrice : basePrice;
	}

	return basePrice;
}

/**
 * Check if product is below reorder level
 */
export function isBelowReorderLevel(
	product: Partial<Pick<MoneyWorksProduct, "StockOnHand" | "ReorderLevel">>,
): boolean {
	if (product.ReorderLevel === undefined || product.StockOnHand === undefined) {
		return false;
	}
	return product.StockOnHand < product.ReorderLevel;
}
