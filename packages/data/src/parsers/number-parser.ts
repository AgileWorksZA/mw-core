/**
 * MoneyWorks Number Parser
 *
 * @moneyworks-dsl PURE
 */

/**
 * Parse MoneyWorks number format
 */
export function parseMWNumber(
	value: string | number | null | undefined,
): number {
	if (value === null || value === undefined || value === "") {
		return 0;
	}

	if (typeof value === "number") {
		return value;
	}

	const parsed = Number.parseFloat(value);
	return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Format number for MoneyWorks
 */
export function formatMWNumber(
	value: number | null | undefined,
	decimals = 2,
): string {
	if (value === null || value === undefined) {
		return "0";
	}

	return value.toFixed(decimals);
}
