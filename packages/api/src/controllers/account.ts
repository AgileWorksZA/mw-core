/**
 * Account Controller
 * Handles Account entity operations for the API
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Accounts are the foundation of MoneyWorks - all transactions post to accounts
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { AccountRepository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class AccountController extends BaseTableController {
	readonly tableName = "Account";
	readonly displayName = "Accounts";
	readonly description =
		"Chart of Accounts - all accounts used for financial transactions in MoneyWorks";
	private repo: AccountRepository;

	constructor(client: SmartMoneyWorksClient) {
		super(client);
		this.repo = new AccountRepository(client);
	}

	/**
	 * Get primary key for Account table
	 */
	protected getPrimaryKey(): string {
		return "Code";
	}

	/**
	 * Additional validation specific to Account
	 */
	protected validateTableSpecific(params: TableExportParams): void {
		// Validate orderBy field if provided
		if (params.orderBy) {
			const validFields = [
				"Code",
				"Name",
				"Type",
				"Balance",
				"CurrentBalance",
				"Header",
				"ParentCode",
			];
			const field = params.orderBy.split(" ")[0]; // Handle "field DESC"

			if (!validFields.includes(field)) {
				throw new Error(
					`Invalid orderBy field: ${field}. Valid fields: ${validFields.join(", ")}`,
				);
			}
		}

		// Validate filter expressions if needed
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
