/**
 * MoneyWorks Tax Rate Validation Functions
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction Use these validators for MW tax rate validation
 * @ai-critical Validation messages must use MoneyWorks terminology
 */
import { MoneyWorksValidationResult } from '../../common/data-types';
import { MoneyWorksTaxRate } from './types';
/**
 * Validate MoneyWorks TaxCode format
 *
 * @ai-instruction When validating TaxCode, use this function
 * @ai-term Say "TaxCode validation", NEVER "tax ID validation"
 */
export declare function validateTaxCode(taxCode: string): MoneyWorksValidationResult;
/**
 * Validate MoneyWorks tax rate values (Rate1, Rate2, CombineRate1, CombineRate2)
 *
 * @ai-instruction When validating rates, use this function
 * @ai-term Say "Rate1 validation" or "Rate2 validation", NEVER "tax percentage validation"
 */
export declare function validateTaxRateValue(rate: number, fieldName: 'Rate1' | 'Rate2' | 'CombineRate1' | 'CombineRate2'): MoneyWorksValidationResult;
/**
 * Validate MoneyWorks account references (PaidAccount, RecAccount)
 *
 * @ai-instruction When validating account references, use this function
 * @ai-term Say "PaidAccount validation", NEVER "tax payable validation"
 */
export declare function validateTaxAccountReferences(paidAccount: string, recAccount: string): MoneyWorksValidationResult;
/**
 * Validate complete MoneyWorks TaxRate entity
 *
 * @ai-instruction Use this for comprehensive TaxRate validation
 * @ai-critical All validation messages must use MoneyWorks field names
 */
export declare function validateTaxRate(taxRate: Partial<MoneyWorksTaxRate>): MoneyWorksValidationResult;
/**
 * Validate that required fields are present for creation
 *
 * @ai-instruction Use when creating new TaxRate records
 */
export declare function validateRequiredFields(taxRate: Partial<MoneyWorksTaxRate>): MoneyWorksValidationResult;
//# sourceMappingURL=validators.d.ts.map