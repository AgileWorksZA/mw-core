/**
 * MoneyWorks Account Parser
 *
 * @moneyworks-dsl PURE
 */
/**
 * Parse MoneyWorks account code
 */
export function parseMWAccountCode(value) {
    if (!value)
        return null;
    const stringValue = String(value).trim();
    if (stringValue === '')
        return null;
    return stringValue;
}
