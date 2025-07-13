/**
 * Name Controller
 * Handles Name entity operations for the API
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Names can be Customers/Debtors or Suppliers/Creditors
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { NameRepository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class NameController extends BaseTableController {
	readonly tableName = "Name";
	readonly displayName = "Names";
	readonly description =
		"Customers, suppliers, debtors, and creditors in MoneyWorks";
	private repo: NameRepository;

	constructor(client: SmartMoneyWorksClient) {
		super(client);
		this.repo = new NameRepository(client);
	}

	/**
	 * Get primary key for Name table
	 */
	protected getPrimaryKey(): string {
		return "Code";
	}
}
