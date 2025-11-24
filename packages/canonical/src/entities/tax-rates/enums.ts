/**
 * MoneyWorks Tax Rate Enumerations
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks tax rates
 * @ai-critical NEVER create your own tax-related enums or use generic tax terms
 */

/**
 * MoneyWorks Tax Combination Modes for 2nd tier tax
 * Source: moneyworks_appendix_tax_rate.html - "Combine" field description
 *
 * @ai-instruction When discussing multi-tier tax, ALWAYS use these MoneyWorks modes
 * @ai-forbidden compound-tax, tax-on-tax, cascading-tax, cumulative-tax
 * @ai-required NONE, ADDITIVE, COMPOUND, SEPARATE
 */
export enum MoneyWorksTaxCombineMode {
	/**
	 * No combination - single tier tax only
	 * @moneyworks-value 0
	 * @ai-term Say "NONE combination mode", NEVER "single tax" or "no secondary tax"
	 */
	NONE = 0,

	/**
	 * Additive - 2nd tier tax added to base tax
	 * @moneyworks-value 1
	 * @ai-term Say "ADDITIVE combination mode", NEVER "sum of taxes" or "added together"
	 */
	ADDITIVE = 1,

	/**
	 * Compound - 2nd tier tax calculated on tax-inclusive amount
	 * @moneyworks-value 2
	 * @ai-term Say "COMPOUND combination mode", NEVER "tax on tax" or "cascading"
	 */
	COMPOUND = 2,

	/**
	 * Separate - 2nd tier tax calculated separately
	 * @moneyworks-value 3
	 * @ai-term Say "SEPARATE combination mode", NEVER "independent taxes"
	 */
	SEPARATE = 3,
}

/**
 * MoneyWorks Tax Finalization Status
 * Note: Derived from GSTPaid/GSTReceived field usage patterns
 *
 * @ai-instruction Use when discussing GST finalization state
 */
export enum MoneyWorksTaxFinalizationStatus {
	/**
	 * Not yet finalized
	 * @ai-term Say "not finalized", NEVER "pending" or "unfiled"
	 */
	NOT_FINALIZED = "NOT_FINALIZED",

	/**
	 * Finalized with values
	 * @ai-term Say "finalized", NEVER "filed" or "submitted"
	 */
	FINALIZED = "FINALIZED",
}
