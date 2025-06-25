/**
 * MoneyWorks String Parser
 * 
 * @moneyworks-dsl PURE
 */

/**
 * Clean MoneyWorks string value
 */
export function cleanMWString(value: string | null | undefined): string {
  if (!value) return '';
  return value.trim();
}