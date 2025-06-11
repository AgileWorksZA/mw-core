/**
 * MoneyWorks Jobs Table Interface
 *
 * The Jobs file contains project and job tracking information, including
 * budgets, time tracking, billing status, and project management details.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_jobs.html
 */

/**
 * Job status codes
 * @description Current state of the job/project
 */
export enum JobStatus {
	/** Quoted - pending approval */
	Quoted = "QU",
	/** Open/Active - work in progress */
	Active = "OP",
	/** Complete - job finished */
	Complete = "CO",
}

/**
 * Color codes for visual identification
 * @description Numeric color index for UI display
 */
export enum JobColor {
	Black = 0,
	White = 1,
	Red = 2,
	Green = 3,
	Blue = 4,
	Yellow = 5,
	Magenta = 6,
	Cyan = 7,
}

/**
 * MoneyWorks Jobs Table (Raw Interface)
 * @description Complete interface for the Jobs table with exact field names
 */
export interface Job {
	/**
	 * Job code
	 * @maxLength 9
	 * @description Unique identifier for the job
	 * @example "JOB001"
	 */
	Code: string;

	/**
	 * Job description
	 * @maxLength 255
	 * @description Display name/title for the job
	 * @example "Website Redesign Project"
	 */
	Description?: string;

	/**
	 * Job status
	 * @maxLength 2
	 * @description Current state of the job
	 * @default "QU"
	 */
	Status?: JobStatus;

	/**
	 * Client code
	 * @maxLength 11
	 * @description Customer for whom the job is being done
	 * @relationship References Name.Code (must be a debtor)
	 */
	Client?: string;

	/**
	 * Job manager
	 * @maxLength 3
	 * @description User responsible for the job
	 * @relationship References User.Code
	 */
	Manager?: string;

	/**
	 * Start date
	 * @format date
	 * @description When the job begins
	 */
	StartDate?: Date | string;

	/**
	 * End date
	 * @format date
	 * @description When the job was completed
	 */
	EndDate?: Date | string;

	/**
	 * Target date
	 * @format date
	 * @description Expected completion date
	 */
	TargetDate?: Date | string;

	/**
	 * Percent complete
	 * @description Job completion percentage (0-100)
	 * @minimum 0
	 * @maximum 100
	 */
	PercentComplete?: number;

	/**
	 * Quote amount
	 * @description Total amount quoted for the job
	 */
	Quote?: number;

	/**
	 * Amount billed
	 * @description Amount invoiced to date
	 * @readonly
	 */
	Billed?: number;

	/**
	 * Markup percentage
	 * @description Default markup for job-related items
	 */
	Markup?: number;

	/**
	 * Project code
	 * @maxLength 9
	 * @description Parent project if this is a sub-job
	 * @relationship References Job.Code
	 */
	Project?: string;

	/**
	 * Order number
	 * @maxLength 31
	 * @description Customer's purchase order reference
	 */
	OrderNum?: string;

	/**
	 * Contact person
	 * @maxLength 63
	 * @description Primary contact for the job
	 */
	Contact?: string;

	/**
	 * Phone number
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	Phone?: string;

	/**
	 * Comments/notes
	 * @maxLength 1020
	 * @description Free-form notes about the job
	 */
	Comment?: string;

	/**
	 * Color coding
	 * @description Visual identifier in lists
	 * @default 0
	 */
	Colour?: JobColor;

	/**
	 * User-defined category 1
	 * @maxLength 15
	 */
	Category1?: string;

	/**
	 * User-defined category 2
	 * @maxLength 15
	 */
	Category2?: string;

	/**
	 * User-defined category 3
	 * @maxLength 15
	 */
	Category3?: string;

	/**
	 * User-defined category 4
	 * @maxLength 15
	 */
	Category4?: string;

	/**
	 * User-defined custom field 1
	 * @maxLength 255
	 */
	Custom1?: string;

	/**
	 * User-defined custom field 2
	 * @maxLength 255
	 */
	Custom2?: string;

	/**
	 * User-defined custom field 3
	 * @maxLength 15
	 */
	Custom3?: string;

	/**
	 * User-defined custom field 4
	 * @maxLength 15
	 */
	Custom4?: string;

	/**
	 * User-defined custom field 5
	 * @maxLength 15
	 */
	Custom5?: string;

	/**
	 * User-defined custom field 6
	 * @maxLength 15
	 */
	Custom6?: string;

	/**
	 * User-defined custom field 7
	 * @maxLength 15
	 */
	Custom7?: string;

	/**
	 * User-defined custom field 8
	 * @maxLength 15
	 */
	Custom8?: string;

	/**
	 * Tagged text
	 * @maxLength 255
	 * @description System-defined tagged information
	 */
	TaggedText?: string;

	/**
	 * User-defined text field
	 * @maxLength 255
	 * @description Scriptable text field
	 */
	UserText?: string;

	/**
	 * User-defined numeric field
	 * @description Scriptable numeric field
	 */
	UserNum?: number;

	/**
	 * Last modification timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	LastModifiedTime?: string;

	/**
	 * User who last modified
	 * @readonly
	 * @note This field may not be present in all MoneyWorks versions
	 */
	ModUser?: string;
}

/**
 * MoneyWorks Jobs Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface JobCamel {
	/**
	 * Job code
	 * @maxLength 9
	 * @description Unique identifier for the job
	 * @example "JOB001"
	 */
	code: string;

	/**
	 * Job description
	 * @maxLength 255
	 * @description Display name/title for the job
	 * @example "Website Redesign Project"
	 */
	description?: string;

	/**
	 * Job status
	 * @maxLength 2
	 * @description Current state of the job
	 * @default "QU"
	 */
	status?: JobStatus;

	/**
	 * Client code
	 * @maxLength 11
	 * @description Customer for whom the job is being done
	 * @relationship References Name.Code (must be a debtor)
	 */
	client?: string;

	/**
	 * Job manager
	 * @maxLength 3
	 * @description User responsible for the job
	 * @relationship References User.Code
	 */
	manager?: string;

	/**
	 * Start date
	 * @format date
	 * @description When the job begins
	 */
	startDate?: Date | string;

	/**
	 * End date
	 * @format date
	 * @description When the job was completed
	 */
	endDate?: Date | string;

	/**
	 * Target date
	 * @format date
	 * @description Expected completion date
	 */
	targetDate?: Date | string;

	/**
	 * Percent complete
	 * @description Job completion percentage (0-100)
	 * @minimum 0
	 * @maximum 100
	 */
	percentComplete?: number;

	/**
	 * Quote amount
	 * @description Total amount quoted for the job
	 */
	quote?: number;

	/**
	 * Amount billed
	 * @description Amount invoiced to date
	 * @readonly
	 */
	billed?: number;

	/**
	 * Markup percentage
	 * @description Default markup for job-related items
	 */
	markup?: number;

	/**
	 * Project code
	 * @maxLength 9
	 * @description Parent project if this is a sub-job
	 * @relationship References Job.Code
	 */
	project?: string;

	/**
	 * Order number
	 * @maxLength 31
	 * @description Customer's purchase order reference
	 */
	orderNum?: string;

	/**
	 * Contact person
	 * @maxLength 63
	 * @description Primary contact for the job
	 */
	contact?: string;

	/**
	 * Phone number
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	phone?: string;

	/**
	 * Comments/notes
	 * @maxLength 1020
	 * @description Free-form notes about the job
	 */
	comment?: string;

	/**
	 * Color coding
	 * @description Visual identifier in lists
	 * @default 0
	 */
	colour?: JobColor;

	/**
	 * User-defined category 1
	 * @maxLength 15
	 */
	category1?: string;

	/**
	 * User-defined category 2
	 * @maxLength 15
	 */
	category2?: string;

	/**
	 * User-defined category 3
	 * @maxLength 15
	 */
	category3?: string;

	/**
	 * User-defined category 4
	 * @maxLength 15
	 */
	category4?: string;

	/**
	 * User-defined custom field 1
	 * @maxLength 255
	 */
	custom1?: string;

	/**
	 * User-defined custom field 2
	 * @maxLength 255
	 */
	custom2?: string;

	/**
	 * User-defined custom field 3
	 * @maxLength 15
	 */
	custom3?: string;

	/**
	 * User-defined custom field 4
	 * @maxLength 15
	 */
	custom4?: string;

	/**
	 * User-defined custom field 5
	 * @maxLength 15
	 */
	custom5?: string;

	/**
	 * User-defined custom field 6
	 * @maxLength 15
	 */
	custom6?: string;

	/**
	 * User-defined custom field 7
	 * @maxLength 15
	 */
	custom7?: string;

	/**
	 * User-defined custom field 8
	 * @maxLength 15
	 */
	custom8?: string;

	/**
	 * Tagged text
	 * @maxLength 255
	 * @description System-defined tagged information
	 */
	taggedText?: string;

	/**
	 * User-defined text field
	 * @maxLength 255
	 * @description Scriptable text field
	 */
	userText?: string;

	/**
	 * User-defined numeric field
	 * @description Scriptable numeric field
	 */
	userNum?: number;

	/**
	 * Last modification timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	lastModifiedTime?: string;

	/**
	 * User who last modified
	 * @readonly
	 * @note This field may not be present in all MoneyWorks versions
	 */
	modUser?: string;
}

/**
 * Converter utilities for Jobs table
 */
export const jobConverters = {
	/**
	 * Convert from MoneyWorks PascalCase to camelCase
	 */
	toCamelCase(raw: Job): JobCamel {
		return {
			code: raw.Code,
			description: raw.Description,
			status: raw.Status,
			client: raw.Client,
			manager: raw.Manager,
			startDate: raw.StartDate,
			endDate: raw.EndDate,
			targetDate: raw.TargetDate,
			percentComplete: raw.PercentComplete,
			quote: raw.Quote,
			billed: raw.Billed,
			markup: raw.Markup,
			project: raw.Project,
			orderNum: raw.OrderNum,
			contact: raw.Contact,
			phone: raw.Phone,
			comment: raw.Comment,
			colour: raw.Colour,
			category1: raw.Category1,
			category2: raw.Category2,
			category3: raw.Category3,
			category4: raw.Category4,
			custom1: raw.Custom1,
			custom2: raw.Custom2,
			custom3: raw.Custom3,
			custom4: raw.Custom4,
			custom5: raw.Custom5,
			custom6: raw.Custom6,
			custom7: raw.Custom7,
			custom8: raw.Custom8,
			taggedText: raw.TaggedText,
			userText: raw.UserText,
			userNum: raw.UserNum,
			lastModifiedTime: raw.LastModifiedTime,
			modUser: raw.ModUser,
		};
	},

	/**
	 * Convert from camelCase to MoneyWorks PascalCase
	 */
	fromCamelCase(camel: JobCamel): Job {
		return {
			Code: camel.code,
			Description: camel.description,
			Status: camel.status,
			Client: camel.client,
			Manager: camel.manager,
			StartDate: camel.startDate,
			EndDate: camel.endDate,
			TargetDate: camel.targetDate,
			PercentComplete: camel.percentComplete,
			Quote: camel.quote,
			Billed: camel.billed,
			Markup: camel.markup,
			Project: camel.project,
			OrderNum: camel.orderNum,
			Contact: camel.contact,
			Phone: camel.phone,
			Comment: camel.comment,
			Colour: camel.colour,
			Category1: camel.category1,
			Category2: camel.category2,
			Category3: camel.category3,
			Category4: camel.category4,
			Custom1: camel.custom1,
			Custom2: camel.custom2,
			Custom3: camel.custom3,
			Custom4: camel.custom4,
			Custom5: camel.custom5,
			Custom6: camel.custom6,
			Custom7: camel.custom7,
			Custom8: camel.custom8,
			TaggedText: camel.taggedText,
			UserText: camel.userText,
			UserNum: camel.userNum,
			LastModifiedTime: camel.lastModifiedTime,
			ModUser: camel.modUser,
		};
	},
};

/**
 * Helper functions for Jobs table
 */
export const jobHelpers = {
	/**
	 * Check if job is active
	 * @param status - The job status
	 * @returns True if the job is active
	 */
	isActive(status?: JobStatus): boolean {
		return status === JobStatus.Active;
	},

	/**
	 * Check if job is complete
	 * @param status - The job status
	 * @returns True if the job is complete
	 */
	isComplete(status?: JobStatus): boolean {
		return status === JobStatus.Complete;
	},

	/**
	 * Check if job is quoted
	 * @param status - The job status
	 * @returns True if the job is quoted
	 */
	isQuoted(status?: JobStatus): boolean {
		return status === JobStatus.Quoted;
	},

	/**
	 * Calculate unbilled amount
	 * @param quote - The quoted amount
	 * @param billed - Amount already billed
	 * @returns Unbilled amount
	 */
	calculateUnbilled(quote?: number, billed?: number): number {
		return (quote || 0) - (billed || 0);
	},

	/**
	 * Check if job is overdue
	 * @param targetDate - The target completion date
	 * @param status - The job status
	 * @returns True if the job is overdue
	 */
	isOverdue(targetDate?: Date | string, status?: JobStatus): boolean {
		if (!targetDate || status === JobStatus.Complete) return false;
		const target =
			typeof targetDate === "string" ? new Date(targetDate) : targetDate;
		return target < new Date();
	},

	/**
	 * Calculate days remaining
	 * @param targetDate - The target completion date
	 * @returns Number of days remaining (negative if overdue)
	 */
	daysRemaining(targetDate?: Date | string): number | null {
		if (!targetDate) return null;
		const target =
			typeof targetDate === "string" ? new Date(targetDate) : targetDate;
		const today = new Date();
		const diffTime = target.getTime() - today.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	},

	/**
	 * Check if job is a sub-job
	 * @param project - The project field
	 * @returns True if this job belongs to a project
	 */
	isSubJob(project?: string): boolean {
		return !!project && project.trim().length > 0;
	},
};
