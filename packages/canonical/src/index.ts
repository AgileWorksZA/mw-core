/**
 * MoneyWorks Canonical Types Package
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This package contains ONLY pure MoneyWorks types and logic
 * @ai-critical NEVER add business domain concepts to this package
 *
 * This is the foundation of MoneyWorks semantic accuracy.
 * Every type, enum, and function here uses ONLY MoneyWorks terminology.
 */

// Export common types and utilities
export * from "./common/data-types";
export * from "./common/business-rules";

// Export entity modules
// Each entity has its own namespace to avoid conflicts
export * as TaxRates from "./entities/tax-rates";
export * as Names from "./entities/names";
export * as Products from "./entities/products";
export * as Accounts from "./entities/accounts";
export * as Contacts from "./entities/contacts";
export * as Transactions from "./entities/transactions";
export * as Details from "./entities/details";

/**
 * @ai-instruction Usage examples:
 *
 * // Import specific tax rate types
 * import { TaxRates } from '@moneyworks/canonical';
 * const taxRate: TaxRates.MoneyWorksTaxRate = { ... };
 *
 * // Import specific name types
 * import { Names } from '@moneyworks/canonical';
 * const name: Names.MoneyWorksName = { ... };
 *
 * // Or import directly from subpath
 * import { MoneyWorksTaxRate, validateTaxRate } from '@moneyworks/canonical/tax-rates';
 * import { MoneyWorksName, validateName } from '@moneyworks/canonical/names';
 *
 * // Import common types
 * import { MoneyWorksDataType, MoneyWorksValidationResult } from '@moneyworks/canonical';
 */

/**
 * Version information for the canonical package
 * This helps track which version of MoneyWorks manual was used
 */
export const CANONICAL_VERSION = {
	packageVersion: "0.1.0",
	moneyWorksManualVersion: "9.0", // Update when manual changes
	lastUpdated: "2025-11-25",
	entities: {
		taxRates: { status: "complete", fields: 17 },
		names: { status: "complete", fields: 94 },
		products: { status: "complete", fields: 70 },
		accounts: { status: "complete", fields: 35 },
		contacts: { status: "complete", fields: 16 },
		transactions: { status: "complete", fields: 65 },
		details: { status: "complete", fields: 40 },
	},
} as const;
