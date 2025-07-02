/**
 * MoneyWorks Enum Parser
 *
 * @moneyworks-dsl PURE
 */
/**
 * Parse MoneyWorks enum value
 */
export function parseMWEnum(value, enumType, defaultValue) {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    const stringValue = String(value);
    // Check if value exists in enum
    if (Object.values(enumType).includes(stringValue)) {
        return stringValue;
    }
    // Try numeric value
    const numValue = parseInt(stringValue, 10);
    if (!isNaN(numValue) && Object.values(enumType).includes(numValue)) {
        return numValue;
    }
    return defaultValue;
}
