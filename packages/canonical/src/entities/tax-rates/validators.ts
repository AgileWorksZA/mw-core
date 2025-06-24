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
import { YYYYMMDD } from '@moneyworks/utilities';

/**
 * Validate MoneyWorks TaxCode format
 * 
 * @ai-instruction When validating TaxCode, use this function
 * @ai-term Say "TaxCode validation", NEVER "tax ID validation"
 */
export function validateTaxCode(taxCode: string): MoneyWorksValidationResult {
  const warnings: string[] = [];
  
  if (!taxCode || taxCode.length === 0) {
    warnings.push("TaxCode is required");
  }
  
  if (taxCode.length > 5) {
    warnings.push("TaxCode exceeds MoneyWorks maximum length of 5 characters");
  }
  
  // MoneyWorks tax codes are typically alphanumeric
  if (!/^[A-Za-z0-9]*$/.test(taxCode)) {
    warnings.push("TaxCode should contain only alphanumeric characters");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    context: { TaxCode: taxCode }
  };
}

/**
 * Validate MoneyWorks tax rate values (Rate1, Rate2, CombineRate1, CombineRate2)
 * 
 * @ai-instruction When validating rates, use this function
 * @ai-term Say "Rate1 validation" or "Rate2 validation", NEVER "tax percentage validation"
 */
export function validateTaxRate(rate: number, fieldName: 'Rate1' | 'Rate2' | 'CombineRate1' | 'CombineRate2'): MoneyWorksValidationResult {
  const warnings: string[] = [];
  
  if (rate < 0) {
    warnings.push(`${fieldName} cannot be negative in MoneyWorks`);
  }
  
  if (rate > 100) {
    warnings.push(`${fieldName} cannot exceed 100 in MoneyWorks`);
  }
  
  // MoneyWorks typically uses up to 4 decimal places for rates
  const decimalPlaces = (rate.toString().split('.')[1] || '').length;
  if (decimalPlaces > 4) {
    warnings.push(`${fieldName} should not exceed 4 decimal places in MoneyWorks`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    context: { [fieldName]: rate }
  };
}

/**
 * Validate MoneyWorks account references (PaidAccount, RecAccount)
 * 
 * @ai-instruction When validating account references, use this function
 * @ai-term Say "PaidAccount validation", NEVER "tax payable validation"
 */
export function validateTaxAccountReferences(paidAccount: string, recAccount: string): MoneyWorksValidationResult {
  const warnings: string[] = [];
  
  if (!paidAccount || paidAccount.length === 0) {
    warnings.push("PaidAccount is required for MoneyWorks TaxRate");
  }
  
  if (!recAccount || recAccount.length === 0) {
    warnings.push("RecAccount is required for MoneyWorks TaxRate");
  }
  
  if (paidAccount && paidAccount.length > 7) {
    warnings.push("PaidAccount exceeds MoneyWorks maximum length of 7 characters");
  }
  
  if (recAccount && recAccount.length > 7) {
    warnings.push("RecAccount exceeds MoneyWorks maximum length of 7 characters");
  }
  
  if (paidAccount === recAccount) {
    warnings.push("PaidAccount and RecAccount should be different in MoneyWorks");
  }
  
  // MoneyWorks account codes follow specific patterns
  const accountPattern = /^[0-9]+-[0-9]+$/;
  if (paidAccount && !accountPattern.test(paidAccount)) {
    warnings.push("PaidAccount should follow MoneyWorks format (e.g., '2-1520')");
  }
  
  if (recAccount && !accountPattern.test(recAccount)) {
    warnings.push("RecAccount should follow MoneyWorks format (e.g., '2-1510')");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    context: { PaidAccount: paidAccount, RecAccount: recAccount }
  };
}

/**
 * Validate complete MoneyWorks TaxRate entity
 * 
 * @ai-instruction Use this for comprehensive TaxRate validation
 * @ai-critical All validation messages must use MoneyWorks field names
 */
export function validateTaxRate(taxRate: Partial<MoneyWorksTaxRate>): MoneyWorksValidationResult {
  const warnings: string[] = [];
  
  // Validate TaxCode
  if (taxRate.TaxCode !== undefined) {
    const codeValidation = validateTaxCode(taxRate.TaxCode);
    warnings.push(...codeValidation.warnings);
  }
  
  // Validate account references
  if (taxRate.PaidAccount !== undefined || taxRate.RecAccount !== undefined) {
    const accountValidation = validateTaxAccountReferences(
      taxRate.PaidAccount || '',
      taxRate.RecAccount || ''
    );
    warnings.push(...accountValidation.warnings);
  }
  
  // Validate rates
  if (taxRate.Rate1 !== undefined) {
    const rate1Validation = validateTaxRate(taxRate.Rate1, 'Rate1');
    warnings.push(...rate1Validation.warnings);
  }
  
  if (taxRate.Rate2 !== undefined) {
    const rate2Validation = validateTaxRate(taxRate.Rate2, 'Rate2');
    warnings.push(...rate2Validation.warnings);
  }
  
  if (taxRate.CombineRate1 !== undefined) {
    const combineRate1Validation = validateTaxRate(taxRate.CombineRate1, 'CombineRate1');
    warnings.push(...combineRate1Validation.warnings);
  }
  
  if (taxRate.CombineRate2 !== undefined) {
    const combineRate2Validation = validateTaxRate(taxRate.CombineRate2, 'CombineRate2');
    warnings.push(...combineRate2Validation.warnings);
  }
  
  // Validate Date field
  if (taxRate.Date !== undefined) {
    try {
      // The YYYYMMDD type validates itself
      const dateStr = taxRate.Date.toString();
      if (dateStr.length !== 8) {
        warnings.push("Date must be in YYYYMMDD format for MoneyWorks");
      }
    } catch {
      warnings.push("Invalid Date format for MoneyWorks");
    }
  }
  
  // Validate GST finalization fields (should be read-only)
  if (taxRate.GSTPaid !== undefined || taxRate.GSTReceived !== undefined) {
    warnings.push("GSTPaid and GSTReceived are set by MoneyWorks finalisation process");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    context: taxRate
  };
}

/**
 * Validate that required fields are present for creation
 * 
 * @ai-instruction Use when creating new TaxRate records
 */
export function validateRequiredFields(taxRate: Partial<MoneyWorksTaxRate>): MoneyWorksValidationResult {
  const warnings: string[] = [];
  const required = ['TaxCode', 'PaidAccount', 'RecAccount', 'Date', 'Rate1', 'Rate2'];
  
  for (const field of required) {
    if (!(field in taxRate)) {
      warnings.push(`${field} is required for MoneyWorks TaxRate`);
    }
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    context: { requiredFields: required, provided: Object.keys(taxRate) }
  };
}