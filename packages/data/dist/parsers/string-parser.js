/**
 * MoneyWorks String Parser
 *
 * @moneyworks-dsl PURE
 */
/**
 * Clean MoneyWorks string value
 */
export function cleanMWString(value) {
    if (!value)
        return '';
    return value.trim();
}
