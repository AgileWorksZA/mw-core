/**
 * MoneyWorks Job Type Definitions
 *
 * @moneyworks-entity Job
 * @moneyworks-table Job
 * @moneyworks-dsl PURE
 *
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate to generic business terms.
 * @ai-forbidden project, task, work-order, project-code
 * @ai-required Code, Description, Status, Budget
 */

import type { MoneyWorksJobStatus } from "./enums";

/**
 * MoneyWorks Job Entity
 *
 * Jobs are used for job costing - tracking costs and revenue against specific
 * projects, jobs, or cost centers. Products, transactions, and names can be
 * associated with jobs.
 *
 * @ai-critical NEVER translate MoneyWorks field names (Code, Description, Budget)
 * @ai-context Jobs are lookup/reference tables used for categorization
 */
export interface MoneyWorksJob {
	/**
	 * The job code - primary identifier
	 * @moneyworks-field Code
	 * @moneyworks-type T(15)
	 * @ai-term ALWAYS use "Code", NEVER "job ID", "project code", or "job number"
	 * @example "JOB001", "PROJ-2024-001", "MAINT"
	 */
	Code: string;

	/**
	 * The job description/name
	 * @moneyworks-field Description
	 * @moneyworks-type T(255)
	 * @ai-term ALWAYS use "Description", NEVER "name", "title", or "job name"
	 */
	Description?: string;

	/**
	 * Job status - controls whether job can accept new charges
	 * @moneyworks-field Status
	 * @moneyworks-type T(1)
	 * @ai-term ALWAYS use "Status", NEVER "state" or "job status"
	 * @ai-context A=Active, C=Completed, H=Hold
	 */
	Status?: MoneyWorksJobStatus;

	/**
	 * Budget amount for the job
	 * @moneyworks-field Budget
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Budget", NEVER "budgeted amount" or "allocated"
	 */
	Budget?: number;

	/**
	 * Contact/customer associated with the job
	 * @moneyworks-field Contact
	 * @moneyworks-type T(11)
	 * @ai-term ALWAYS use "Contact", NEVER "customer" or "client"
	 * @ai-context References Names.Code
	 */
	Contact?: string;

	/**
	 * Category for grouping jobs
	 * @moneyworks-field Category
	 * @moneyworks-type T(31)
	 * @ai-term ALWAYS use "Category", NEVER "type" or "classification"
	 */
	Category?: string;

	/**
	 * Additional notes about the job
	 * @moneyworks-field Notes
	 * @moneyworks-type T(1020)
	 * @ai-term ALWAYS use "Notes", NEVER "comments" or "remarks"
	 */
	Notes?: string;

	/**
	 * User-defined numeric field
	 * @moneyworks-field UserNum
	 * @moneyworks-type N
	 */
	UserNum?: number;

	/**
	 * User-defined text field
	 * @moneyworks-field UserText
	 * @moneyworks-type T(255)
	 */
	UserText?: string;

	/**
	 * Custom field 1
	 * @moneyworks-field Custom1
	 * @moneyworks-type T(255)
	 */
	Custom1?: string;

	/**
	 * Custom field 2
	 * @moneyworks-field Custom2
	 * @moneyworks-type T(255)
	 */
	Custom2?: string;

	/**
	 * The colour of the job record
	 * @moneyworks-field Colour
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Colour" (British spelling), NEVER "color"
	 */
	Colour?: number;

	/**
	 * Date and time record was last modified
	 * @moneyworks-field LastModifiedTime
	 * @moneyworks-type S
	 */
	LastModifiedTime?: string;
}

/**
 * MoneyWorks Job creation input
 * Only required fields for creating a new job
 *
 * @ai-instruction When creating jobs, use this interface
 */
export interface MoneyWorksJobCreateInput {
	Code: string;
	Description?: string;
	Status?: MoneyWorksJobStatus;
	Budget?: number;
	Contact?: string;
	Category?: string;
	Notes?: string;
}

/**
 * MoneyWorks Job update input
 * All fields optional except Code for identification
 *
 * @ai-instruction When updating jobs, use this interface
 */
export interface MoneyWorksJobUpdateInput {
	Code: string;
	Description?: string;
	Status?: MoneyWorksJobStatus;
	Budget?: number;
	Contact?: string;
	Category?: string;
	Notes?: string;
	UserNum?: number;
	UserText?: string;
	Custom1?: string;
	Custom2?: string;
	Colour?: number;
}

/**
 * MoneyWorks Job filter for search/query operations
 *
 * @ai-instruction When searching jobs, use this interface
 */
export interface MoneyWorksJobFilter {
	/** Filter by job code */
	code?: string;

	/** Filter by job status */
	status?: MoneyWorksJobStatus;

	/** Filter by contact/customer */
	contact?: string;

	/** Filter by category */
	category?: string;

	/** Search text (searches Code, Description) */
	searchText?: string;
}
