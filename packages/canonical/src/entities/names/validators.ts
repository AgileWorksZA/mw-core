/**
 * MoneyWorks Names Entity - Validation Functions
 *
 * Business rule validation following MoneyWorks requirements
 * Source: MoneyWorks Manual - Names Field Descriptions
 *
 * @ai-instruction These validators enforce MW business rules. Do not relax constraints.
 */

import {
	MoneyWorksCustomerType,
	MoneyWorksNameKind,
	MoneyWorksProductPricingLevel,
	MoneyWorksSupplierType,
} from "./enums";
import { MONEYWORKS_NAME_FIELDS, getNameField } from "./fields";
import type { MoneyWorksName, MoneyWorksNameInput } from "./types";

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
 * Validate a Name against MoneyWorks business rules
 */
export function validateName(name: MoneyWorksNameInput): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: string[] = [];

	// Required field: Code
	if (!name.Code || name.Code.trim() === "") {
		errors.push({
			field: "Code",
			message: "Name Code is required",
			value: name.Code,
		});
	} else if (name.Code.length > 11) {
		errors.push({
			field: "Code",
			message: "Name Code cannot exceed 11 characters",
			value: name.Code,
		});
	}

	// Validate text field lengths
	validateTextFieldLength(name, "Name", 255, errors);
	validateTextFieldLength(name, "Address1", 59, errors);
	validateTextFieldLength(name, "Address2", 59, errors);
	validateTextFieldLength(name, "Address3", 59, errors);
	validateTextFieldLength(name, "Address4", 59, errors);
	validateTextFieldLength(name, "PostCode", 11, errors);
	validateTextFieldLength(name, "State", 3, errors);
	validateTextFieldLength(name, "Contact", 25, errors);
	validateTextFieldLength(name, "email", 80, errors);
	validateTextFieldLength(name, "Phone", 19, errors);
	validateTextFieldLength(name, "Currency", 3, errors);
	validateTextFieldLength(name, "TaxCode", 5, errors);
	validateTextFieldLength(name, "TaxNumber", 19, errors);

	// Validate enums
	if (name.CustomerType !== undefined) {
		if (![0, 1, 2].includes(name.CustomerType)) {
			errors.push({
				field: "CustomerType",
				message:
					"CustomerType must be 0 (Not Customer), 1 (Customer), or 2 (Debtor)",
				value: name.CustomerType,
			});
		}
	}

	if (name.SupplierType !== undefined) {
		if (![0, 1, 2].includes(name.SupplierType)) {
			errors.push({
				field: "SupplierType",
				message:
					"SupplierType must be 0 (Not Supplier), 1 (Supplier), or 2 (Creditor)",
				value: name.SupplierType,
			});
		}
	}

	if (name.Kind !== undefined) {
		if (![0, 1].includes(name.Kind)) {
			errors.push({
				field: "Kind",
				message: "Kind must be 0 (Template) or 1 (Normal)",
				value: name.Kind,
			});
		}
	}

	// Validate ProductPricing level
	if (name.ProductPricing !== undefined && name.ProductPricing !== "") {
		if (!["A", "B", "C", "D", "E", "F"].includes(name.ProductPricing)) {
			errors.push({
				field: "ProductPricing",
				message: "ProductPricing must be A, B, C, D, E, or F",
				value: name.ProductPricing,
			});
		}
	}

	// Business rule validations

	// Debtor-specific validations
	if (name.CustomerType === MoneyWorksCustomerType.DEBTOR) {
		if (!name.RecAccount) {
			warnings.push(
				"Debtors should have a Receivables Account (RecAccount) specified",
			);
		}

		if (name.CreditLimit === undefined || name.CreditLimit === 0) {
			warnings.push("Debtors typically have a credit limit set");
		}
	}

	// Creditor-specific validations
	if (name.SupplierType === MoneyWorksSupplierType.CREDITOR) {
		if (!name.PayAccount) {
			warnings.push(
				"Creditors should have a Payables Account (PayAccount) specified",
			);
		}
	}

	// Account code validations
	if (name.RecAccount && name.RecAccount.length > 7) {
		errors.push({
			field: "RecAccount",
			message: "RecAccount cannot exceed 7 characters",
			value: name.RecAccount,
		});
	}

	if (name.PayAccount && name.PayAccount.length > 7) {
		errors.push({
			field: "PayAccount",
			message: "PayAccount cannot exceed 7 characters",
			value: name.PayAccount,
		});
	}

	// Payment terms validation
	if (name.SplitPercent !== undefined) {
		if (name.SplitPercent < 0 || name.SplitPercent > 100) {
			errors.push({
				field: "SplitPercent",
				message: "SplitPercent must be between 0 and 100",
				value: name.SplitPercent,
			});
		}
	}

	// Colour validation
	if (name.Colour !== undefined) {
		if (name.Colour < 0 || name.Colour > 7) {
			errors.push({
				field: "Colour",
				message: "Colour must be between 0 and 7",
				value: name.Colour,
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
 * Helper to validate text field length
 */
function validateTextFieldLength(
	name: MoneyWorksNameInput,
	fieldName: keyof MoneyWorksName,
	maxLength: number,
	errors: ValidationError[],
): void {
	const value = name[fieldName];
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

/**
 * Check if a name is a customer (can appear in sales)
 */
export function isCustomer(
	name: Pick<MoneyWorksName, "CustomerType">,
): boolean {
	return (
		name.CustomerType === MoneyWorksCustomerType.CUSTOMER ||
		name.CustomerType === MoneyWorksCustomerType.DEBTOR
	);
}

/**
 * Check if a name is a debtor (has receivables)
 */
export function isDebtor(name: Pick<MoneyWorksName, "CustomerType">): boolean {
	return name.CustomerType === MoneyWorksCustomerType.DEBTOR;
}

/**
 * Check if a name is a supplier (can appear in purchases)
 */
export function isSupplier(
	name: Pick<MoneyWorksName, "SupplierType">,
): boolean {
	return (
		name.SupplierType === MoneyWorksSupplierType.SUPPLIER ||
		name.SupplierType === MoneyWorksSupplierType.CREDITOR
	);
}

/**
 * Check if a name is a creditor (has payables)
 */
export function isCreditor(
	name: Pick<MoneyWorksName, "SupplierType">,
): boolean {
	return name.SupplierType === MoneyWorksSupplierType.CREDITOR;
}

/**
 * Check if a name requires an order number
 */
export function requiresOrderNumber(
	name: Pick<MoneyWorksName, "Flags">,
): boolean {
	return (name.Flags & 0x0001) !== 0;
}

/**
 * Get total debtor balance
 */
export function getDebtorBalance(
	name: Pick<MoneyWorksName, "DCurrent" | "D30Plus" | "D60Plus" | "D90Plus">,
): number {
	return (
		(name.DCurrent || 0) +
		(name.D30Plus || 0) +
		(name.D60Plus || 0) +
		(name.D90Plus || 0)
	);
}

/**
 * Format payment terms for display
 */
export function formatPaymentTerms(terms: number): string {
	if (terms === 0) return "None";
	if (terms > 0) return `Within ${terms} days`;
	return `${Math.abs(terms)}th day of following month`;
}

/**
 * Validate email format (basic check)
 */
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate that required control accounts are set
 */
export function validateControlAccounts(
	name: MoneyWorksNameInput,
): ValidationResult {
	const errors: ValidationError[] = [];

	// Debtor must have RecAccount
	if (name.CustomerType === MoneyWorksCustomerType.DEBTOR && !name.RecAccount) {
		errors.push({
			field: "RecAccount",
			message: "Receivables Account is required for Debtors",
		});
	}

	// Creditor must have PayAccount
	if (
		name.SupplierType === MoneyWorksSupplierType.CREDITOR &&
		!name.PayAccount
	) {
		errors.push({
			field: "PayAccount",
			message: "Payables Account is required for Creditors",
		});
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
