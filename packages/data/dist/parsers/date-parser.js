/**
 * MoneyWorks Date Parser
 *
 * @moneyworks-dsl PURE
 */
/**
 * Parse MoneyWorks date format (YYYYMMDD string)
 */
export function parseMWDate(value) {
    if (!value || value === '')
        return null;
    // MoneyWorks dates are YYYYMMDD format
    if (/^\d{8}$/.test(value)) {
        return value;
    }
    return null;
}
/**
 * Parse MoneyWorks timestamp format
 */
export function parseMWTimestamp(value) {
    if (!value || value === '')
        return null;
    try {
        return new Date(value);
    }
    catch {
        return null;
    }
}
/**
 * Format date for MoneyWorks
 */
export function formatMWDate(date) {
    if (!date)
        return '';
    if (typeof date === 'string' && /^\d{8}$/.test(date)) {
        return date; // Already in YYYYMMDD format
    }
    if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    return '';
}
