/**
 * Job Controller
 * Handles Job entity operations for the API
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Jobs are used for job costing - tracking costs and revenue
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { JobRepository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class JobController extends BaseTableController {
	readonly tableName = "Job";
	readonly displayName = "Jobs";
	readonly description =
		"Job costing entries for tracking project costs and revenue in MoneyWorks";
	private repo: JobRepository;

	constructor(client: SmartMoneyWorksClient) {
		super(client);
		this.repo = new JobRepository(client);
	}

	/**
	 * Get primary key for Job table
	 */
	protected getPrimaryKey(): string {
		return "Code";
	}

	/**
	 * Additional validation specific to Job
	 */
	protected validateTableSpecific(params: TableExportParams): void {
		// Validate orderBy field if provided
		if (params.orderBy) {
			const validFields = [
				"Code",
				"Description",
				"Status",
				"Budget",
				"Contact",
				"Category",
			];
			const field = params.orderBy.split(" ")[0]; // Handle "field DESC"

			if (!validFields.includes(field)) {
				throw new Error(
					`Invalid orderBy field: ${field}. Valid fields: ${validFields.join(", ")}`,
				);
			}
		}

		// Validate filter expressions
		if (params.filter) {
			// Basic validation - check for SQL injection patterns
			const dangerousPatterns = [";", "--", "/*", "*/"];
			for (const pattern of dangerousPatterns) {
				if (params.filter.includes(pattern)) {
					throw new Error("Invalid filter expression");
				}
			}
		}
	}
}
