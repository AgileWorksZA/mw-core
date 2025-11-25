/**
 * MoneyWorks Detail (Transaction Line) Enumerations
 *
 * @moneyworks-entity Detail
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks detail lines
 * @ai-critical NEVER create your own detail-related enums
 *
 * Source: MoneyWorks Manual - moneyworks_appendix_transactions.html
 *
 * Detail is the line item entity for transactions.
 * Relationship: Detail.ParentSeq -> Transaction.SequenceNumber
 */

/**
 * MoneyWorks Detail flags - bit-mapped
 * Source: moneyworks_appendix_transactions.html - Detail Flags table
 *
 * @ai-instruction Use bitwise operations to check/set flags
 * @ai-critical Flags is a 16-bit integer field
 */
export enum MoneyWorksDetailFlags {
	/** Department in account is salesperson code */
	DEPT_IS_SALESPERSON = 0x0001,

	/** Line is a freight item */
	FREIGHT_ITEM = 0x0002,

	/** Product price is tax inclusive */
	PRODUCT_PRICE_TAX_INCLUSIVE = 0x0004,

	/** Line is a tax line */
	TAX_LINE = 0x0008,

	/** Tax line added by tax override */
	TAX_LINE_OVERRIDE = 0x0010,

	/** Line is a time item */
	IS_TIME_ITEM = 0x0020,

	/** Line is eligible for prompt payment discount */
	PROMPT_PAYMENT_DISCOUNTABLE = 0x0040,

	/** Line is in a foreign currency */
	FOREIGN_CURRENCY = 0x0100,

	/** Balancing line for foreign currency */
	BALANCING_LINE_FOREIGN = 0x0200,

	/** Balancing line for contra */
	BALANCING_LINE_CONTRA = 0x0400,

	/** Stock is ignored (for jobs) */
	STOCK_IGNORED = 0x0800,

	/** Banking journal holding line */
	BANKING_JOURNAL_HOLDING = 0x1000,

	/** Banking journal bank line */
	BANKING_JOURNAL_BANK = 0x2000,

	/** Stock journal line */
	STOCK_JOURNAL_LINE = 0x4000,

	/** System-generated line */
	SYSTEM_LINE = 0x8000,
}

/**
 * MoneyWorks Detail more flags - bit-mapped
 * Source: moneyworks_appendix_transactions.html - detail.moreFlags
 *
 * @ai-instruction Use for serial/batch number tracking
 */
export enum MoneyWorksDetailMoreFlags {
	/** Product requires serial number */
	REQUIRES_SERIAL_NUMBER = 0x0001,

	/** Product requires batch number */
	REQUIRES_BATCH_NUMBER = 0x0002,

	/** Batch expires (has expiry date) */
	BATCH_EXPIRES = 0x0004,
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a detail line has a specific flag set
 *
 * @param flags - The Flags field value
 * @param flag - The flag to check for
 * @returns true if flag is set
 *
 * @example
 * ```typescript
 * hasDetailFlag(detail.Flags, MoneyWorksDetailFlags.TAX_LINE)
 * ```
 */
export function hasDetailFlag(flags: number, flag: MoneyWorksDetailFlags): boolean {
	return (flags & flag) !== 0;
}

/**
 * Check if a detail line has a specific more flag set
 *
 * @param moreFlags - The MoreFlags field value
 * @param flag - The flag to check for
 * @returns true if flag is set
 */
export function hasDetailMoreFlag(moreFlags: number, flag: MoneyWorksDetailMoreFlags): boolean {
	return (moreFlags & flag) !== 0;
}

/**
 * Decode detail flags into array of flag names
 *
 * @param flags - The Flags field value
 * @returns Array of flag names that are set
 */
export function decodeDetailFlags(flags: number): string[] {
	const result: string[] = [];
	const flagEntries = Object.entries(MoneyWorksDetailFlags).filter(
		([key, value]) => typeof value === "number"
	);

	for (const [name, value] of flagEntries) {
		if (typeof value === "number" && (flags & value) !== 0) {
			result.push(name);
		}
	}

	return result;
}

/**
 * Decode detail more flags into array of flag names
 *
 * @param moreFlags - The MoreFlags field value
 * @returns Array of flag names that are set
 */
export function decodeDetailMoreFlags(moreFlags: number): string[] {
	const result: string[] = [];
	const flagEntries = Object.entries(MoneyWorksDetailMoreFlags).filter(
		([key, value]) => typeof value === "number"
	);

	for (const [name, value] of flagEntries) {
		if (typeof value === "number" && (moreFlags & value) !== 0) {
			result.push(name);
		}
	}

	return result;
}

/**
 * Check if detail line is a tax line
 *
 * @param flags - The Flags field value
 * @returns true if this is a tax line
 */
export function isTaxLine(flags: number): boolean {
	return hasDetailFlag(flags, MoneyWorksDetailFlags.TAX_LINE);
}

/**
 * Check if detail line is a system-generated line
 *
 * @param flags - The Flags field value
 * @returns true if this is a system line
 */
export function isSystemLine(flags: number): boolean {
	return hasDetailFlag(flags, MoneyWorksDetailFlags.SYSTEM_LINE);
}

/**
 * Check if detail line involves inventory
 *
 * @param flags - The Flags field value
 * @returns true if stock should be processed
 */
export function isStockLine(flags: number): boolean {
	// Not a stock line if stock is ignored
	return !hasDetailFlag(flags, MoneyWorksDetailFlags.STOCK_IGNORED);
}

/**
 * Check if detail line requires serial/batch tracking
 *
 * @param moreFlags - The MoreFlags field value
 * @returns true if serial or batch number required
 */
export function requiresTracking(moreFlags: number): boolean {
	return (
		hasDetailMoreFlag(moreFlags, MoneyWorksDetailMoreFlags.REQUIRES_SERIAL_NUMBER) ||
		hasDetailMoreFlag(moreFlags, MoneyWorksDetailMoreFlags.REQUIRES_BATCH_NUMBER)
	);
}
