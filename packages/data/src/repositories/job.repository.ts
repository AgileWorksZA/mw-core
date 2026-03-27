/**
 * MoneyWorks Job Repository
 *
 * @moneyworks-entity Job
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all Job data operations
 * @ai-critical Use MoneyWorks Job terminology exclusively
 */

import type {
	MoneyWorksJob,
	MoneyWorksJobCreateInput,
	MoneyWorksJobUpdateInput,
	MoneyWorksJobStatus,
} from "@moneyworks/canonical/entities/jobs";
import { formatMWNumber } from "../parsers/number-parser";
import { BaseMoneyWorksRepository } from "./base.repository";

/**
 * Repository for MoneyWorks Job entity
 *
 * @ai-instruction Use this for all Job data operations
 * @ai-term Say "JobRepository", NEVER "ProjectRepository" or "WorkOrderRepository"
 */
export class JobRepository extends BaseMoneyWorksRepository<
	MoneyWorksJob,
	MoneyWorksJobCreateInput,
	MoneyWorksJobUpdateInput
> {
	/**
	 * MoneyWorks table name
	 * @ai-critical Must be exact MW table name
	 */
	protected readonly tableName = "Job";

	/**
	 * Primary key field
	 * @ai-critical Code is the primary key for Job
	 */
	protected readonly primaryKey = "Code";

	/**
	 * Post-process records to add branded types and parse MW data
	 *
	 * @ai-instruction Smart client already parsed basic types, we add branding and parse flags
	 */
	protected postProcess(record: any): MoneyWorksJob {
		// Smart client already handled field discovery and basic parsing
		// We just need to ensure proper types

		// Parse numeric fields
		const numericFields = ["Budget", "UserNum", "Colour"];

		const processed: any = { ...record };

		// Parse numeric fields
		for (const field of numericFields) {
			if (
				field in processed &&
				processed[field] !== null &&
				processed[field] !== ""
			) {
				processed[field] = Number(processed[field]);
			}
		}

		return processed as MoneyWorksJob;
	}

	/**
	 * Prepare data for MoneyWorks
	 *
	 * @ai-instruction Converts typed data to MW format
	 */
	protected prepare(
		data: MoneyWorksJobCreateInput | MoneyWorksJobUpdateInput,
	): any {
		const prepared: any = {};

		// Always include Code for identification
		if ("Code" in data) {
			prepared.Code = data.Code;
		}

		// Optional fields
		if ("Description" in data && data.Description !== undefined) {
			prepared.Description = data.Description;
		}
		if ("Status" in data && data.Status !== undefined) {
			// Convert enum to MW format (first letter: A, C, H)
			const statusMap: Record<MoneyWorksJobStatus, string> = {
				ACTIVE: "A",
				COMPLETED: "C",
				HOLD: "H",
			};
			prepared.Status = statusMap[data.Status] || data.Status;
		}
		if ("Budget" in data && data.Budget !== undefined) {
			prepared.Budget = formatMWNumber(data.Budget);
		}
		if ("Contact" in data && data.Contact !== undefined) {
			prepared.Contact = data.Contact;
		}
		if ("Category" in data && data.Category !== undefined) {
			prepared.Category = data.Category;
		}
		if ("Notes" in data && data.Notes !== undefined) {
			prepared.Notes = data.Notes;
		}
		if ("UserNum" in data && data.UserNum !== undefined) {
			prepared.UserNum = formatMWNumber(data.UserNum);
		}
		if ("UserText" in data && data.UserText !== undefined) {
			prepared.UserText = data.UserText;
		}
		if ("Custom1" in data && data.Custom1 !== undefined) {
			prepared.Custom1 = data.Custom1;
		}
		if ("Custom2" in data && data.Custom2 !== undefined) {
			prepared.Custom2 = data.Custom2;
		}
		if ("Colour" in data && data.Colour !== undefined) {
			prepared.Colour = data.Colour;
		}

		return prepared;
	}

	/**
	 * Find job by code (primary key lookup)
	 *
	 * @param code - The job code to search for
	 * @returns The job if found, null otherwise
	 *
	 * @example
	 * ```typescript
	 * const job = await repo.findByCode("JOB001");
	 * if (job) {
	 *   console.log(`Found: ${job.Description}`);
	 * }
	 * ```
	 *
	 * @ai-instruction Use this for single job lookups by Code
	 */
	async findByCode(code: string): Promise<MoneyWorksJob | null> {
		const records = await this.find(`Code="${code}"`);
		return records.length > 0 ? records[0] : null;
	}

	/**
	 * Find all active jobs
	 *
	 * @returns Array of jobs with ACTIVE status
	 *
	 * @example
	 * ```typescript
	 * const activeJobs = await repo.findActiveJobs();
	 * console.log(`${activeJobs.length} active jobs`);
	 * ```
	 *
	 * @ai-instruction Use this to find jobs that can accept new charges
	 */
	async findActiveJobs(): Promise<MoneyWorksJob[]> {
		return this.find('Status="A"');
	}

	/**
	 * Find jobs by status
	 *
	 * @param status - The job status to filter by
	 * @returns Array of jobs matching the status
	 *
	 * @example
	 * ```typescript
	 * import { MoneyWorksJobStatus } from "@moneyworks/canonical/entities/jobs";
	 *
	 * // Find all completed jobs
	 * const completed = await repo.findByStatus(MoneyWorksJobStatus.COMPLETED);
	 *
	 * // Find all on-hold jobs
	 * const onHold = await repo.findByStatus(MoneyWorksJobStatus.HOLD);
	 * ```
	 *
	 * @ai-instruction Use this to filter jobs by their Status field
	 */
	async findByStatus(status: MoneyWorksJobStatus): Promise<MoneyWorksJob[]> {
		const statusMap: Record<MoneyWorksJobStatus, string> = {
			ACTIVE: "A",
			COMPLETED: "C",
			HOLD: "H",
		};
		const mwStatus = statusMap[status] || status;
		return this.find(`Status="${mwStatus}"`);
	}

	/**
	 * Find jobs by contact/customer
	 *
	 * @param contactCode - The contact code from Names table
	 * @returns Array of jobs for this contact
	 *
	 * @example
	 * ```typescript
	 * const customerJobs = await repo.findByContact("CUST001");
	 * ```
	 *
	 * @ai-instruction Use this to find jobs for a specific customer/contact
	 */
	async findByContact(contactCode: string): Promise<MoneyWorksJob[]> {
		return this.find(`Contact="${contactCode}"`);
	}

	/**
	 * Find jobs by category
	 *
	 * @param category - The category value to match
	 * @returns Array of jobs in this category
	 *
	 * @example
	 * ```typescript
	 * const maintenanceJobs = await repo.findByCategory("MAINTENANCE");
	 * ```
	 *
	 * @ai-instruction Use this for custom job classification
	 */
	async findByCategory(category: string): Promise<MoneyWorksJob[]> {
		return this.find(`Category="${category}"`);
	}
}
