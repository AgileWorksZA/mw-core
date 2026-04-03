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

import type {
	MoneyWorksJobStatus,
	MoneyWorksJobBilling,
	MoneyWorksJobSheetStatus,
} from "./enums";

/**
 * MoneyWorks Job Entity — Complete field set
 *
 * Jobs track costs and revenue against projects. Supports hierarchical
 * jobs (Project field), two billing modes (Quote/Cost Plus), and full
 * costing via Job Sheet Items.
 */
export interface MoneyWorksJob {
	/** Primary identifier (up to 15 chars) */
	Code: string;
	/** Job name/summary (255 chars) */
	Description?: string;
	/** Full name field (255 chars) — the detailed job name */
	Name?: string;
	/** Client debtor code (references Names.Code) */
	Client?: string;
	/** Job status: A=Active, C=Completed, H=Hold */
	Status?: MoneyWorksJobStatus;
	/** Parent job code — enables hierarchical jobs */
	Project?: string;
	/** Manager/staff initials */
	Manager?: string;
	/** WIP GL account (must be current asset) */
	WIPAccount?: string;
	/** Billing mode: Q=Quote, C=Cost Plus */
	Billing?: MoneyWorksJobBilling;
	/** Quoted amount (when Billing=Quote) */
	QuotedAmount?: number;
	/** Markup percentage (when Billing=Cost Plus) */
	Markup?: number;
	/** Total billed to date (auto-updated, read-only) */
	BilledToDate?: number;
	/** User-entered completion estimate 0-100 */
	PercentComplete?: number;
	/** Budget amount */
	Budget?: number;
	/** Project start date (YYYYMMDD) */
	StartDate?: string;
	/** Target completion date (YYYYMMDD) */
	TargetDate?: string;
	/** Actual finish date (YYYYMMDD) */
	FinishDate?: string;
	/** Customer order/PO number */
	CustomerOrderNo?: string;
	/** Contact person name */
	ContactPerson?: string;
	/** Contact phone number */
	Phone?: string;
	/** Legacy contact field (references Names.Code) */
	Contact?: string;
	/** Category for grouping/reporting */
	Category?: string;
	/** Comments (1020 chars) */
	Comments?: string;
	/** Notes field (1020 chars) */
	Notes?: string;
	/** Custom fields */
	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;
	/** User-defined numeric field */
	UserNum?: number;
	/** User-defined text field */
	UserText?: string;
	/** Row colour (0-8) */
	Colour?: number;
	/** Last modified timestamp */
	LastModifiedTime?: string;
}

/**
 * MoneyWorks Job Sheet Item
 *
 * Individual cost/charge entries against a job. Created manually (timesheet),
 * automatically (from posted transactions with job codes), or as budgets.
 */
export interface MoneyWorksJobSheetItem {
	/** Sequence number (auto-assigned) */
	SequenceNumber?: number;
	/** Job code this item belongs to */
	Job: string;
	/** Date of the entry (YYYYMMDD) */
	Date: string;
	/** Quantity */
	Qty: number;
	/** Product/Resource code (references Product.Code) */
	Resource?: string;
	/** Unit of measure */
	Unit?: string;
	/** Cost amount (actual cost) */
	Cost: number;
	/** Charge amount (billable amount, may include markup) */
	Charge: number;
	/** GL account code */
	Account?: string;
	/** Memo/description */
	Memo?: string;
	/** Additional comment */
	Comment?: string;
	/** Analysis code */
	Analysis?: string;
	/** Activity code */
	ActivityCode?: string;
	/** Cost centre/department */
	CostCentre?: string;
	/** Item status: P=Pending, X=Processed, B=Budget */
	Status?: MoneyWorksJobSheetStatus;
	/** Locked flag — true if auto-created from a posted transaction */
	Locked?: boolean;
}

/**
 * Job creation input
 */
export interface MoneyWorksJobCreateInput {
	Code: string;
	Description?: string;
	Name?: string;
	Client?: string;
	Status?: MoneyWorksJobStatus;
	Project?: string;
	Manager?: string;
	WIPAccount?: string;
	Billing?: MoneyWorksJobBilling;
	QuotedAmount?: number;
	Markup?: number;
	Budget?: number;
	StartDate?: string;
	TargetDate?: string;
	CustomerOrderNo?: string;
	ContactPerson?: string;
	Phone?: string;
	Category?: string;
	Comments?: string;
	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;
	Colour?: number;
}

/**
 * Job update input
 */
export interface MoneyWorksJobUpdateInput {
	Code: string;
	Description?: string;
	Name?: string;
	Client?: string;
	Status?: MoneyWorksJobStatus;
	Project?: string;
	Manager?: string;
	WIPAccount?: string;
	Billing?: MoneyWorksJobBilling;
	QuotedAmount?: number;
	Markup?: number;
	PercentComplete?: number;
	Budget?: number;
	StartDate?: string;
	TargetDate?: string;
	FinishDate?: string;
	CustomerOrderNo?: string;
	ContactPerson?: string;
	Phone?: string;
	Category?: string;
	Comments?: string;
	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;
	UserNum?: number;
	UserText?: string;
	Colour?: number;
}

/**
 * Job filter for search/query
 */
export interface MoneyWorksJobFilter {
	code?: string;
	status?: MoneyWorksJobStatus;
	client?: string;
	category?: string;
	project?: string;
	searchText?: string;
}
