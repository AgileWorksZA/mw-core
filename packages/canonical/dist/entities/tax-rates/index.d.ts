/**
 * MoneyWorks Tax Rates Canonical Module
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction This is the entry point for ALL TaxRate canonical types
 * @ai-critical Import from here, not from individual files
 */
export { MoneyWorksTaxCombineMode, MoneyWorksTaxFinalizationStatus } from '@moneyworks/canonical/entities/tax-rates/enums';
export type { MoneyWorksTaxRate, MoneyWorksTaxRateCreateInput, MoneyWorksTaxRateUpdateInput } from '@moneyworks/canonical/entities/tax-rates/types';
export { MONEYWORKS_TAX_RATE_FIELDS, getFieldMetadata, getRequiredFields, getIndexedFields } from '@moneyworks/canonical/entities/tax-rates/fields';
export { MONEYWORKS_TAX_RATE_CANONICAL_TERMS, MONEYWORKS_TAX_ACTIONS, getCanonicalTerm } from '@moneyworks/canonical/entities/tax-rates/terms';
export { validateTaxCode, validateTaxRate, validateTaxAccountReferences, validateRequiredFields } from '@moneyworks/canonical/entities/tax-rates/validators';
export { getCurrentTaxRate, calculateCombinedTax, calculateTaxForRate, calculateGSTFinalization } from '@moneyworks/canonical/entities/tax-rates/calculators';
export { MoneyWorksTaxRateBusinessRules, MoneyWorksTaxRateRelationships, TaxRateOperationalRules, type MoneyWorksTaxRateOperationalRules, type getApplicableRules } from '@moneyworks/canonical/entities/tax-rates/rules';
export type { MoneyWorksFieldMetadata, MoneyWorksValidationResult } from '@moneyworks/canonical/common/data-types';
/**
 * @ai-instruction When working with TaxRates, import like this:
 * import { MoneyWorksTaxRate, MoneyWorksTaxCombineMode, validateTaxRate } from '@moneyworks/canonical/tax-rates';
 *
 * NEVER import from the individual files
 */ 
//# sourceMappingURL=index.d.ts.map