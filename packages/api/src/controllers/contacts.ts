/**
 * Contacts Controller
 * Handles Contacts entity operations for the API
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Contacts are a subfile of Names, linked via ParentSeq field
 * @ai-critical Table name is PLURAL: "Contacts" not "Contact"
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { ContactsRepository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class ContactsController extends BaseTableController {
	readonly tableName = "Contacts"; // PLURAL - subfile table
	readonly displayName = "Contacts";
	readonly description =
		"Additional contacts linked to Names (customers/suppliers)";
	private repo: ContactsRepository;

	constructor(client: SmartMoneyWorksClient) {
		super(client);
		this.repo = new ContactsRepository(client);
	}

	/**
	 * Get primary key for Contact table
	 */
	protected getPrimaryKey(): string {
		return "SequenceNumber";
	}

	/**
	 * Additional validation specific to Contact
	 */
	protected validateTableSpecific(params: TableExportParams): void {
		// Validate orderBy field if provided
		if (params.orderBy) {
			const validFields = [
				"SequenceNumber",
				"ParentSeq",
				"Contact",
				"eMail",
				"Position",
				"Role",
				"Order",
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
