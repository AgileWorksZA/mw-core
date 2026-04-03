/**
 * Autocode: Generate next code for new Name records.
 *
 * MoneyWorks convention: codes are padded to N chars, incremented from the
 * highest existing code. Supports both numeric and alpha-numeric templates.
 *
 * @example
 * generateNextCode(['CUST001', 'CUST002', 'CUST003'], 'CUST', 7) → 'CUST004'
 * generateNextCode(['100', '101', '102'], '', 5) → '00103'
 */

/**
 * Generate the next auto-incremented code.
 * @param existingCodes - All existing codes in the table
 * @param prefix - Optional prefix (e.g., 'CUST', 'SUP')
 * @param padLength - Total length of the code (padded with zeros)
 */
export function generateNextCode(
	existingCodes: string[],
	prefix: string = '',
	padLength: number = 5
): string {
	// Filter to codes matching the prefix
	const matching = prefix
		? existingCodes.filter(c => c.startsWith(prefix))
		: existingCodes;

	// Extract numeric suffixes
	let maxNum = 0;
	for (const code of matching) {
		const suffix = code.slice(prefix.length);
		const num = parseInt(suffix, 10);
		if (!isNaN(num) && num > maxNum) {
			maxNum = num;
		}
	}

	const nextNum = maxNum + 1;
	const numStr = String(nextNum);
	const padSize = Math.max(0, padLength - prefix.length);
	const paddedNum = numStr.padStart(padSize, '0');

	return prefix + paddedNum;
}

/**
 * Generate code from a Name's name field.
 * Takes first N characters of the name, uppercased, stripped of special chars.
 * If collision, appends incrementing number.
 *
 * @example
 * generateCodeFromName('John Smith', ['JOHNS', 'JOHNSO'], 6) → 'JOHNSM'
 * generateCodeFromName('John Smith', ['JOHNSM'], 6) → 'JOHN01'
 */
export function generateCodeFromName(
	name: string,
	existingCodes: string[],
	maxLength: number = 6
): string {
	const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
	const base = clean.slice(0, maxLength);

	if (!existingCodes.includes(base)) return base;

	// Try truncated base + incrementing number
	const shortBase = clean.slice(0, maxLength - 2);
	for (let i = 1; i <= 99; i++) {
		const candidate = shortBase + String(i).padStart(2, '0');
		if (!existingCodes.includes(candidate)) return candidate;
	}

	// Fallback: full numeric
	return generateNextCode(existingCodes, '', maxLength);
}
