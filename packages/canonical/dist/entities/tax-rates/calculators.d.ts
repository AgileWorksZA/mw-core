/**
 * MoneyWorks Tax Rate Calculation Functions
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction Use these for ALL MoneyWorks tax calculations
 * @ai-critical ALWAYS use MoneyWorks terminology in results
 */
import { YYYYMMDD } from '@moneyworks/utilities';
import { MoneyWorksTaxCombineMode } from './enums';
import { MoneyWorksTaxRate } from './types';
/**
 * Determine which tax rate to use based on changeover Date
 *
 * @ai-instruction Use this to determine current applicable rate
 * @ai-term Say "current rate based on changeover", NEVER "effective rate"
 */
export declare function getCurrentTaxRate(rate1: number, rate2: number, changeoverDate: YYYYMMDD, currentDate?: YYYYMMDD): {
    currentRate: number;
    ratePeriod: 'before_changeover' | 'after_changeover';
    explanation: string;
};
/**
 * Calculate combined tax with MoneyWorks 2nd tier logic
 *
 * @ai-instruction Use for all multi-tier tax calculations
 * @ai-term Say "2nd tier tax", NEVER "secondary tax" or "additional tax"
 */
export declare function calculateCombinedTax(amount: number, primaryRate: number, secondaryRate: number, combineMode: MoneyWorksTaxCombineMode, isTaxInclusive?: boolean): {
    primaryTax: number;
    secondaryTax: number;
    totalTax: number;
    taxInclusiveAmount: number;
    taxExclusiveAmount: number;
    explanation: string;
};
/**
 * Calculate tax for a MoneyWorks TaxRate entity
 *
 * @ai-instruction Primary function for TaxRate calculations
 * @ai-critical Use MoneyWorks field names in the result
 */
export declare function calculateTaxForRate(taxRate: MoneyWorksTaxRate, amount: number, options?: {
    date?: YYYYMMDD;
    isTaxInclusive?: boolean;
}): {
    TaxCode: string;
    amount: number;
    primaryRate: number;
    secondaryRate: number;
    primaryTax: number;
    secondaryTax: number;
    totalTax: number;
    taxInclusiveAmount: number;
    taxExclusiveAmount: number;
    ratePeriod: 'before_changeover' | 'after_changeover';
    explanation: string;
};
/**
 * Calculate GST amounts for finalisation
 *
 * @ai-instruction Use when explaining GST finalisation
 * @ai-term Say "GST finalisation", NEVER "tax filing" or "VAT return"
 */
export declare function calculateGSTFinalization(transactions: Array<{
    amount: number;
    tax: number;
    type: 'paid' | 'received';
}>): {
    GSTPaid: number;
    GSTReceived: number;
    NetPaid: number;
    NetReceived: number;
    explanation: string;
};
//# sourceMappingURL=calculators.d.ts.map