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
export * from './common/data-types';
export * from './common/business-rules';

// Export entity modules
// Each entity has its own namespace to avoid conflicts
export * as TaxRates from './entities/tax-rates';

// Future entities will be added here:
// export * as Transactions from './entities/transactions';
// export * as Accounts from './entities/accounts';
// export * as Names from './entities/names';
// etc.

/**
 * @ai-instruction Usage examples:
 * 
 * // Import specific tax rate types
 * import { TaxRates } from '@moneyworks/canonical';
 * const taxRate: TaxRates.MoneyWorksTaxRate = { ... };
 * 
 * // Or import directly from subpath
 * import { MoneyWorksTaxRate, validateTaxRate } from '@moneyworks/canonical/tax-rates';
 * 
 * // Import common types
 * import { MoneyWorksDataType, MoneyWorksValidationResult } from '@moneyworks/canonical';
 */

/**
 * Version information for the canonical package
 * This helps track which version of MoneyWorks manual was used
 */
export const CANONICAL_VERSION = {
  packageVersion: '0.1.0',
  moneyWorksManualVersion: '9.0', // Update when manual changes
  lastUpdated: '2024-01-18',
  entities: {
    taxRates: { status: 'complete', fields: 17 },
    transactions: { status: 'pending', fields: 0 },
    accounts: { status: 'pending', fields: 0 },
    names: { status: 'pending', fields: 0 }
  }
} as const;