/**
 * MoneyWorks Account Parser
 *
 * @moneyworks-dsl PURE
 */

import type { AccountCode } from "@moneyworks/utilities";

/**
 * Parse MoneyWorks account code
 */
export function parseMWAccountCode(
	value: string | number | null | undefined,
): AccountCode | null {
	if (!value) return null;

	const stringValue = String(value).trim();
	if (stringValue === "") return null;

	return stringValue as AccountCode;
}
