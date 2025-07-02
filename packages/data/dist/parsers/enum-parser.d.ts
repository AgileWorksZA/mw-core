/**
 * MoneyWorks Enum Parser
 *
 * @moneyworks-dsl PURE
 */
/**
 * Parse MoneyWorks enum value
 */
export declare function parseMWEnum<T extends Record<string, any>>(value: string | number | null | undefined, enumType: T, defaultValue: T[keyof T]): T[keyof T];
//# sourceMappingURL=enum-parser.d.ts.map