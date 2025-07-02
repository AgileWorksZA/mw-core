/**
 * MoneyWorks Tax Rate Calculation Functions
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction Use these for ALL MoneyWorks tax calculations
 * @ai-critical ALWAYS use MoneyWorks terminology in results
 */
import { d } from '@moneyworks/utilities';
import { MoneyWorksTaxCombineMode } from './enums';
/**
 * Determine which tax rate to use based on changeover Date
 *
 * @ai-instruction Use this to determine current applicable rate
 * @ai-term Say "current rate based on changeover", NEVER "effective rate"
 */
export function getCurrentTaxRate(rate1, rate2, changeoverDate, currentDate = d `${new Date()}`) {
    const isAfterChangeover = currentDate >= changeoverDate;
    return {
        currentRate: isAfterChangeover ? rate2 : rate1,
        ratePeriod: isAfterChangeover ? 'after_changeover' : 'before_changeover',
        explanation: isAfterChangeover
            ? `Using Rate2 (${rate2}%) - current date is on or after changeover Date ${changeoverDate}`
            : `Using Rate1 (${rate1}%) - current date is before changeover Date ${changeoverDate}`
    };
}
/**
 * Calculate combined tax with MoneyWorks 2nd tier logic
 *
 * @ai-instruction Use for all multi-tier tax calculations
 * @ai-term Say "2nd tier tax", NEVER "secondary tax" or "additional tax"
 */
export function calculateCombinedTax(amount, primaryRate, secondaryRate, combineMode, isTaxInclusive = false) {
    let primaryTax;
    let secondaryTax;
    let taxExclusiveAmount;
    if (isTaxInclusive) {
        // Calculate from tax-inclusive amount
        const totalRate = calculateTotalEffectiveRate(primaryRate, secondaryRate, combineMode);
        taxExclusiveAmount = amount / (1 + totalRate / 100);
    }
    else {
        taxExclusiveAmount = amount;
    }
    // Calculate primary tax (always on exclusive amount)
    primaryTax = taxExclusiveAmount * (primaryRate / 100);
    // Calculate 2nd tier based on Combine mode
    switch (combineMode) {
        case MoneyWorksTaxCombineMode.ADDITIVE:
            // 2nd tier tax on original amount
            secondaryTax = taxExclusiveAmount * (secondaryRate / 100);
            break;
        case MoneyWorksTaxCombineMode.COMPOUND:
            // 2nd tier tax on amount including primary tax
            secondaryTax = (taxExclusiveAmount + primaryTax) * (secondaryRate / 100);
            break;
        case MoneyWorksTaxCombineMode.SEPARATE:
            // 2nd tier tax calculated separately (same as additive for calculation)
            secondaryTax = taxExclusiveAmount * (secondaryRate / 100);
            break;
        case MoneyWorksTaxCombineMode.NONE:
        default:
            secondaryTax = 0;
            break;
    }
    const totalTax = primaryTax + secondaryTax;
    const taxInclusiveAmount = taxExclusiveAmount + totalTax;
    // MoneyWorks terminology for modes
    const modeDescriptions = {
        [MoneyWorksTaxCombineMode.NONE]: 'NONE (primary only)',
        [MoneyWorksTaxCombineMode.ADDITIVE]: 'ADDITIVE',
        [MoneyWorksTaxCombineMode.COMPOUND]: 'COMPOUND',
        [MoneyWorksTaxCombineMode.SEPARATE]: 'SEPARATE'
    };
    return {
        primaryTax: Math.round(primaryTax * 100) / 100,
        secondaryTax: Math.round(secondaryTax * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        taxInclusiveAmount: Math.round(taxInclusiveAmount * 100) / 100,
        taxExclusiveAmount: Math.round(taxExclusiveAmount * 100) / 100,
        explanation: `MoneyWorks tax calculation using ${modeDescriptions[combineMode]} Combine mode: ` +
            `Primary rate ${primaryRate}% + 2nd tier rate ${secondaryRate}% = ` +
            `Total effective rate ${((totalTax / taxExclusiveAmount) * 100).toFixed(4)}%`
    };
}
/**
 * Calculate tax for a MoneyWorks TaxRate entity
 *
 * @ai-instruction Primary function for TaxRate calculations
 * @ai-critical Use MoneyWorks field names in the result
 */
export function calculateTaxForRate(taxRate, amount, options = {}) {
    const currentDate = options.date || d `${new Date()}`;
    // Determine which rates to use
    const { currentRate: primaryRate, ratePeriod } = getCurrentTaxRate(taxRate.Rate1, taxRate.Rate2, taxRate.Date, currentDate);
    // Get 2nd tier rate if applicable
    const secondaryRate = ratePeriod === 'after_changeover'
        ? (taxRate.CombineRate2 || 0)
        : (taxRate.CombineRate1 || 0);
    // Calculate tax
    const calculation = calculateCombinedTax(amount, primaryRate, secondaryRate, taxRate.Combine || MoneyWorksTaxCombineMode.NONE, options.isTaxInclusive || false);
    return {
        TaxCode: taxRate.TaxCode,
        amount,
        primaryRate,
        secondaryRate,
        ...calculation,
        ratePeriod,
        explanation: `TaxCode '${taxRate.TaxCode}' ${ratePeriod}: ${calculation.explanation}`
    };
}
/**
 * Calculate the total effective rate for combined taxes
 *
 * @ai-instruction Internal helper for rate calculations
 */
function calculateTotalEffectiveRate(primaryRate, secondaryRate, combineMode) {
    switch (combineMode) {
        case MoneyWorksTaxCombineMode.ADDITIVE:
        case MoneyWorksTaxCombineMode.SEPARATE:
            return primaryRate + secondaryRate;
        case MoneyWorksTaxCombineMode.COMPOUND:
            // Compound: secondary is on tax-inclusive amount
            return primaryRate + secondaryRate + (primaryRate * secondaryRate / 100);
        case MoneyWorksTaxCombineMode.NONE:
        default:
            return primaryRate;
    }
}
/**
 * Calculate GST amounts for finalisation
 *
 * @ai-instruction Use when explaining GST finalisation
 * @ai-term Say "GST finalisation", NEVER "tax filing" or "VAT return"
 */
export function calculateGSTFinalization(transactions) {
    const paid = transactions.filter(t => t.type === 'paid');
    const received = transactions.filter(t => t.type === 'received');
    const GSTPaid = paid.reduce((sum, t) => sum + t.tax, 0);
    const GSTReceived = received.reduce((sum, t) => sum + t.tax, 0);
    const NetPaid = paid.reduce((sum, t) => sum + t.amount, 0);
    const NetReceived = received.reduce((sum, t) => sum + t.amount, 0);
    return {
        GSTPaid: Math.round(GSTPaid * 100) / 100,
        GSTReceived: Math.round(GSTReceived * 100) / 100,
        NetPaid: Math.round(NetPaid * 100) / 100,
        NetReceived: Math.round(NetReceived * 100) / 100,
        explanation: `MoneyWorks GST finalisation: GSTPaid ${GSTPaid.toFixed(2)}, ` +
            `GSTReceived ${GSTReceived.toFixed(2)}, ` +
            `Net GST ${(GSTReceived - GSTPaid).toFixed(2)}`
    };
}
