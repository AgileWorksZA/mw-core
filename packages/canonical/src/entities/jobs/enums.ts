/**
 * MoneyWorks Job Enumerations
 *
 * @moneyworks-entity Job
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks jobs
 * @ai-critical NEVER create your own job-related enums or use generic terms
 */

/**
 * MoneyWorks Job Status
 * Controls whether a job is active, completed, or on hold
 */
export enum MoneyWorksJobStatus {
	/** Active job - work can be charged to it */
	ACTIVE = "A",
	/** Completed job - no new work */
	COMPLETED = "C",
	/** On hold - temporarily suspended */
	HOLD = "H",
}

/**
 * MoneyWorks Job Billing Mode
 * Determines how job is invoiced
 */
export enum MoneyWorksJobBilling {
	/** Fixed quote - invoice for agreed amount */
	QUOTE = "Q",
	/** Cost plus markup - invoice at cost + markup % */
	COST_PLUS = "C",
}

/**
 * MoneyWorks Job Sheet Item Status
 */
export enum MoneyWorksJobSheetStatus {
	/** Pending - not yet billed */
	PENDING = "P",
	/** Processed - billed via Bill Job */
	PROCESSED = "X",
	/** Budget entry */
	BUDGET = "B",
}

/**
 * MoneyWorks Job Itemise By modes for Bill Job
 */
export enum MoneyWorksJobItemiseBy {
	SIMPLE = "S",
	DATE_AND_RESOURCE = "D",
	RESOURCE = "R",
	ACCOUNT = "A",
	COST_CENTRE = "C",
}
