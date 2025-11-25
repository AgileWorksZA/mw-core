/**
 * Detail Controller
 * Handles Detail (transaction line item) entity operations for the API
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Details are line items linked to Transactions via ParentSeq
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { DetailRepository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class DetailController extends BaseTableController {
	readonly tableName = "Detail";
	readonly displayName = "Transaction Details";
	readonly description =
		"Transaction line items (the actual accounting entries)";
	private repo: DetailRepository;

	constructor(client: SmartMoneyWorksClient) {
		super(client);
		this.repo = new DetailRepository(client);
	}

	/**
	 * Get primary key for Detail table
	 * Note: Detail has composite key (ParentSeq, Sort)
	 * but ParentSeq is the main lookup key
	 */
	protected getPrimaryKey(): string {
		return "ParentSeq";
	}

	/**
	 * Additional validation specific to Detail
	 */
	protected validateTableSpecific(params: TableExportParams): void {
		// Validate orderBy field if provided
		if (params.orderBy) {
			const validFields = [
				"ParentSeq",
				"Sort",
				"Account",
				"Debit",
				"Credit",
				"Tax",
				"Gross",
				"StockCode",
				"StockQty",
				"UnitPrice",
				"JobCode",
				"TaxCode",
				"Description",
				"Period",
			];
			const field = params.orderBy.split(" ")[0]; // Handle "field DESC"

			// Handle Detail. prefix
			const cleanField = field.startsWith("Detail.")
				? field.substring(7)
				: field;

			if (!validFields.includes(cleanField)) {
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
