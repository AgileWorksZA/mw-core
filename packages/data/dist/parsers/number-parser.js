/**
 * MoneyWorks Number Parser
 *
 * @moneyworks-dsl PURE
 */
/**
 * Parse MoneyWorks number format
 */
export function parseMWNumber(value) {
    if (value === null || value === undefined || value === '') {
        return 0;
    }
    if (typeof value === 'number') {
        return value;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}
/**
 * Format number for MoneyWorks
 */
export function formatMWNumber(value, decimals = 2) {
    if (value === null || value === undefined) {
        return '0';
    }
    return value.toFixed(decimals);
}
