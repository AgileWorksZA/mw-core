/**
 * Transaction Controller
 * Handles Transaction entity operations for the API
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Transactions are the header records for all financial transactions
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { TransactionRepository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class TransactionController extends BaseTableController {
	readonly tableName = "Transaction";
	readonly displayName = "Transactions";
	readonly description =
		"Financial transactions (invoices, payments, journals, orders)";
	private repo: TransactionRepository;

	constructor(client: SmartMoneyWorksClient) {
		super(client);
		this.repo = new TransactionRepository(client);
	}

	/**
	 * Get primary key for Transaction table
	 */
	protected getPrimaryKey(): string {
		return "SequenceNumber";
	}

	/**
	 * Additional validation specific to Transaction
	 */
	protected validateTableSpecific(params: TableExportParams): void {
		// Validate orderBy field if provided
		if (params.orderBy) {
			const validFields = [
				"SequenceNumber",
				"Type",
				"Status",
				"TransDate",
				"DueDate",
				"OurRef",
				"TheirRef",
				"NameCode",
				"Gross",
				"TaxAmount",
				"Period",
				"EnterDate",
				"Description",
				"Contra",
				"SalesPerson",
				"Colour",
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

		// Validate type filter if used
		if (params.filter && params.filter.includes("Type=")) {
			const validTypes = [
				"CIC",
				"CII",
				"CP",
				"CPC",
				"CPD",
				"CR",
				"CRC",
				"CRD",
				"DIC",
				"DII",
				"JN",
				"JNS",
				"POC",
				"POI",
				"QU",
				"SOC",
				"SOI",
			];

			// Extract type value from filter
			const typeMatch = params.filter.match(/Type\s*=\s*["']?(\w+)["']?/);
			if (typeMatch && !validTypes.includes(typeMatch[1])) {
				throw new Error(
					`Invalid transaction type: ${typeMatch[1]}. Valid types: ${validTypes.join(", ")}`,
				);
			}
		}

		// Validate status filter if used
		if (params.filter && params.filter.includes("Status=")) {
			const validStatuses = ["U", "P"];

			const statusMatch = params.filter.match(/Status\s*=\s*["']?(\w)["']?/);
			if (statusMatch && !validStatuses.includes(statusMatch[1])) {
				throw new Error(
					`Invalid transaction status: ${statusMatch[1]}. Valid statuses: U (unposted), P (posted)`,
				);
			}
		}
	}
}
