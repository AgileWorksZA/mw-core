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
 *
 * @ai-instruction Use when discussing job availability and state
 * @ai-forbidden project-status, task-status, work-status
 */
export enum MoneyWorksJobStatus {
	/**
	 * Active job - work can be charged to it
	 * @ai-term Say "active", NEVER "open" or "in-progress"
	 */
	ACTIVE = "ACTIVE",

	/**
	 * Completed job - no new work
	 * @ai-term Say "completed", NEVER "closed" or "finished"
	 */
	COMPLETED = "COMPLETED",

	/**
	 * On hold - temporarily suspended
	 * @ai-term Say "on hold", NEVER "paused" or "suspended"
	 */
	HOLD = "HOLD",
}
