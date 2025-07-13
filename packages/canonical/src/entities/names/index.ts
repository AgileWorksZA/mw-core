/**
 * MoneyWorks Names Entity - Canonical Package Exports
 *
 * Complete implementation of MoneyWorks Names table
 * Preserves all MW terminology and business rules
 *
 * @module @moneyworks/canonical/entities/names
 */

// Types
export type {
	MoneyWorksName,
	MoneyWorksNameInput,
	MoneyWorksNameFilter,
} from "./types";

// Enums
export {
	MoneyWorksCustomerType,
	MoneyWorksSupplierType,
	MoneyWorksNameKind,
	MoneyWorksPaymentMethod,
	MoneyWorksProductPricingLevel,
	MoneyWorksNameFlags,
	MoneyWorksContactRole,
} from "./enums";

// Field definitions
export {
	MONEYWORKS_NAME_FIELDS,
	getNameField,
	getRequiredNameFields,
	getIndexedNameFields,
	type MoneyWorksNameField,
} from "./fields";

// Validators
export {
	validateName,
	validateControlAccounts,
	validateEmail,
	isCustomer,
	isDebtor,
	isSupplier,
	isCreditor,
	requiresOrderNumber,
	getDebtorBalance,
	formatPaymentTerms,
	type ValidationError,
	type ValidationResult,
} from "./validators";

// Re-export common MW terms for convenience
export const MW_NAME_TERMS = {
	CUSTOMER: "Customer",
	DEBTOR: "Debtor",
	SUPPLIER: "Supplier",
	CREDITOR: "Creditor",
	TEMPLATE: "Template",
	NORMAL: "Normal",
	ON_HOLD: "On Hold",
	RECEIVABLES_ACCOUNT: "Accounts Receivable Control Account",
	PAYABLES_ACCOUNT: "Accounts Payable Control Account",
} as const;
