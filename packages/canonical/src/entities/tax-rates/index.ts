/**
 * MoneyWorks Tax Rates Canonical Module
 * 
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction This is the entry point for ALL TaxRate canonical types
 * @ai-critical Import from here, not from individual files
 */

// Export all enums
export {
  MoneyWorksTaxCombineMode,
  MoneyWorksTaxFinalizationStatus
} from '@moneyworks/canonical/entities/tax-rates/enums';

// Export all types
export type {
  MoneyWorksTaxRate,
  MoneyWorksTaxRateCreateInput,
  MoneyWorksTaxRateUpdateInput
} from '@moneyworks/canonical/entities/tax-rates/types';

// Export field definitions
export {
  MONEYWORKS_TAX_RATE_FIELDS,
  getFieldMetadata,
  getRequiredFields,
  getIndexedFields
} from '@moneyworks/canonical/entities/tax-rates/fields';

// Export canonical terms
export {
  MONEYWORKS_TAX_RATE_CANONICAL_TERMS,
  MONEYWORKS_TAX_ACTIONS,
  getCanonicalTerm
} from '@moneyworks/canonical/entities/tax-rates/terms';

// Export validators
export {
  validateTaxCode,
  validateTaxRate,
  validateTaxAccountReferences,
  validateRequiredFields
} from '@moneyworks/canonical/entities/tax-rates/validators';

// Export calculators
export {
  getCurrentTaxRate,
  calculateCombinedTax,
  calculateTaxForRate,
  calculateGSTFinalization
} from '@moneyworks/canonical/entities/tax-rates/calculators';

// Export business rules
export {
  MoneyWorksTaxRateBusinessRules,
  MoneyWorksTaxRateRelationships,
  TaxRateOperationalRules,
  type MoneyWorksTaxRateOperationalRules,
  type getApplicableRules
} from '@moneyworks/canonical/entities/tax-rates/rules';

// Re-export common types that are frequently used with tax rates
export type { MoneyWorksFieldMetadata, MoneyWorksValidationResult } from '@moneyworks/canonical/common/data-types';

/**
 * @ai-instruction When working with TaxRates, import like this:
 * import { MoneyWorksTaxRate, MoneyWorksTaxCombineMode, validateTaxRate } from '@moneyworks/canonical/tax-rates';
 * 
 * NEVER import from the individual files
 */