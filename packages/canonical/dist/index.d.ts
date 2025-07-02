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
export * from './common/data-types';
export * from './common/business-rules';
export * as TaxRates from './entities/tax-rates';
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
export declare const CANONICAL_VERSION: {
    readonly packageVersion: "0.1.0";
    readonly moneyWorksManualVersion: "9.0";
    readonly lastUpdated: "2024-01-18";
    readonly entities: {
        readonly taxRates: {
            readonly status: "complete";
            readonly fields: 17;
        };
        readonly transactions: {
            readonly status: "pending";
            readonly fields: 0;
        };
        readonly accounts: {
            readonly status: "pending";
            readonly fields: 0;
        };
        readonly names: {
            readonly status: "pending";
            readonly fields: 0;
        };
    };
};
//# sourceMappingURL=index.d.ts.map