/**
 * MoneyWorks Names Tools for MCP
 *
 * Provides specialized tools for working with Names (customers, suppliers, debtors, creditors)
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Names can be Customers/Debtors or Suppliers/Creditors
 */

import type { MoneyWorksName } from "@moneyworks/canonical/names";
import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { NameRepository } from "@moneyworks/data";
import type { NameCode } from "@moneyworks/utilities";

interface SearchNamesParams {
	searchText: string;
	searchFields?: ("Code" | "Name" | "Phone" | "email" | "Contact")[];
	customerType?: "all" | "customers" | "debtors" | "none";
	supplierType?: "all" | "suppliers" | "creditors" | "none";
	limit?: number;
	offset?: number;
}

interface BalancesSummaryResult {
	totalDebtors: number;
	totalCreditors: number;
	debtorsCurrent: number;
	debtors30Plus: number;
	debtors60Plus: number;
	debtors90Plus: number;
	creditorsTotal: number;
}

/**
 * Search Names tool
 * Find names by text search across multiple fields
 */
export const searchNamesTool = {
	definition: {
		name: "mw_search_names",
		description: "Search MoneyWorks names by text across multiple fields",
		inputSchema: {
			type: "object",
			properties: {
				searchText: {
					type: "string",
					description: "Text to search for",
				},
				searchFields: {
					type: "array",
					items: {
						type: "string",
						enum: ["Code", "Name", "Phone", "email", "Contact"],
					},
					description: "Fields to search in (default: Code, Name)",
					default: ["Code", "Name"],
				},
				customerType: {
					type: "string",
					enum: ["all", "customers", "debtors", "none"],
					description: "Filter by customer type",
					default: "all",
				},
				supplierType: {
					type: "string",
					enum: ["all", "suppliers", "creditors", "none"],
					description: "Filter by supplier type",
					default: "all",
				},
				limit: {
					type: "number",
					description: "Maximum number of records to return",
					minimum: 1,
					maximum: 1000,
				},
				offset: {
					type: "number",
					description: "Number of records to skip",
					minimum: 0,
				},
			},
			required: ["searchText"],
		},
	},

	async handler(client: SmartMoneyWorksClient, params: SearchNamesParams) {
		const repo = new NameRepository(client);
		const results = await repo.search(params.searchText, {
			searchFields: params.searchFields || ["Code", "Name"],
			customerType: params.customerType || "all",
			supplierType: params.supplierType || "all",
			limit: params.limit,
			offset: params.offset,
		});

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							results,
							count: results.length,
							searchText: params.searchText,
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Get Customers tool
 * Retrieve all customers (including debtors)
 */
export const getCustomersTool = {
	definition: {
		name: "mw_get_customers",
		description: "Get all MoneyWorks customers (including debtors)",
		inputSchema: {
			type: "object",
			properties: {
				includeOnHold: {
					type: "boolean",
					description: "Include customers on hold",
					default: false,
				},
				orderBy: {
					type: "string",
					description: "Field to order by (default: Name)",
					default: "Name",
				},
				limit: {
					type: "number",
					description: "Maximum number of records",
					minimum: 1,
					maximum: 1000,
				},
				offset: {
					type: "number",
					description: "Number of records to skip",
					minimum: 0,
				},
			},
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: {
			includeOnHold?: boolean;
			orderBy?: string;
			limit?: number;
			offset?: number;
		},
	) {
		const repo = new NameRepository(client);
		const customers = await repo.getCustomers(params);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							customers,
							count: customers.length,
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Get Debtors tool
 * Retrieve debtors only (customers with receivables)
 */
export const getDebtorsTool = {
	definition: {
		name: "mw_get_debtors",
		description: "Get MoneyWorks debtors (customers with receivables)",
		inputSchema: {
			type: "object",
			properties: {
				includeOnHold: {
					type: "boolean",
					description: "Include debtors on hold",
					default: false,
				},
				withBalancesOnly: {
					type: "boolean",
					description: "Only return debtors with outstanding balances",
					default: false,
				},
				orderBy: {
					type: "string",
					description: "Field to order by (default: Name)",
					default: "Name",
				},
				limit: {
					type: "number",
					description: "Maximum number of records",
					minimum: 1,
					maximum: 1000,
				},
				offset: {
					type: "number",
					description: "Number of records to skip",
					minimum: 0,
				},
			},
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: {
			includeOnHold?: boolean;
			withBalancesOnly?: boolean;
			orderBy?: string;
			limit?: number;
			offset?: number;
		},
	) {
		const repo = new NameRepository(client);
		const debtors = await repo.getDebtors(params);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							debtors,
							count: debtors.length,
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Get Suppliers tool
 * Retrieve all suppliers (including creditors)
 */
export const getSuppliersTool = {
	definition: {
		name: "mw_get_suppliers",
		description: "Get all MoneyWorks suppliers (including creditors)",
		inputSchema: {
			type: "object",
			properties: {
				orderBy: {
					type: "string",
					description: "Field to order by (default: Name)",
					default: "Name",
				},
				limit: {
					type: "number",
					description: "Maximum number of records",
					minimum: 1,
					maximum: 1000,
				},
				offset: {
					type: "number",
					description: "Number of records to skip",
					minimum: 0,
				},
			},
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: {
			orderBy?: string;
			limit?: number;
			offset?: number;
		},
	) {
		const repo = new NameRepository(client);
		const suppliers = await repo.getSuppliers(params);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							suppliers,
							count: suppliers.length,
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Get Creditors tool
 * Retrieve creditors only (suppliers with payables)
 */
export const getCreditorsTool = {
	definition: {
		name: "mw_get_creditors",
		description: "Get MoneyWorks creditors (suppliers with payables)",
		inputSchema: {
			type: "object",
			properties: {
				withBalancesOnly: {
					type: "boolean",
					description: "Only return creditors with outstanding balances",
					default: false,
				},
				orderBy: {
					type: "string",
					description: "Field to order by (default: Name)",
					default: "Name",
				},
				limit: {
					type: "number",
					description: "Maximum number of records",
					minimum: 1,
					maximum: 1000,
				},
				offset: {
					type: "number",
					description: "Number of records to skip",
					minimum: 0,
				},
			},
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: {
			withBalancesOnly?: boolean;
			orderBy?: string;
			limit?: number;
			offset?: number;
		},
	) {
		const repo = new NameRepository(client);
		const creditors = await repo.getCreditors(params);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							creditors,
							count: creditors.length,
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Get Overdue Debtors tool
 * Find debtors with overdue balances
 */
export const getOverdueDebtorsTool = {
	definition: {
		name: "mw_get_overdue_debtors",
		description: "Get MoneyWorks debtors with overdue balances",
		inputSchema: {
			type: "object",
			properties: {
				daysOverdue: {
					type: "number",
					description:
						"Minimum days overdue (0 = any overdue, 30 = 30+ days, etc.)",
					minimum: 0,
					default: 0,
				},
			},
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: { daysOverdue?: number },
	) {
		const repo = new NameRepository(client);
		const overdueDebtors = await repo.getOverdueDebtors(
			params.daysOverdue || 0,
		);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							overdueDebtors,
							count: overdueDebtors.length,
							daysOverdue: params.daysOverdue || 0,
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Get Balances Summary tool
 * Get summary of all debtor and creditor balances
 */
export const getBalancesSummaryTool = {
	definition: {
		name: "mw_get_balances_summary",
		description: "Get summary of all MoneyWorks debtor and creditor balances",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},

	async handler(client: SmartMoneyWorksClient, params: Record<string, never>) {
		const repo = new NameRepository(client);
		const summary = await repo.getBalancesSummary();

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(summary, null, 2),
				},
			],
		};
	},
};

/**
 * Get Name by Code tool
 * Retrieve a specific name by its code
 */
export const getNameByCodeTool = {
	definition: {
		name: "mw_get_name_by_code",
		description: "Get a specific MoneyWorks name by its code",
		inputSchema: {
			type: "object",
			properties: {
				code: {
					type: "string",
					description: "The name code to retrieve",
				},
			},
			required: ["code"],
		},
	},

	async handler(client: SmartMoneyWorksClient, params: { code: string }) {
		const repo = new NameRepository(client);
		const name = await repo.findByKey(params.code);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							name,
							found: name !== null,
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Get Names by Category tool
 * Find names by category assignment
 */
export const getNamesByCategoryTool = {
	definition: {
		name: "mw_get_names_by_category",
		description: "Get MoneyWorks names by category assignment",
		inputSchema: {
			type: "object",
			properties: {
				category: {
					type: "string",
					description: "Category name to filter by",
				},
				categoryNumber: {
					type: "number",
					description: "Category number (1-4)",
					minimum: 1,
					maximum: 4,
					default: 1,
				},
			},
			required: ["category"],
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: { category: string; categoryNumber?: 1 | 2 | 3 | 4 },
	) {
		const repo = new NameRepository(client);
		const names = await repo.getByCategory(
			params.category,
			params.categoryNumber || 1,
		);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							names,
							count: names.length,
							category: params.category,
							categoryNumber: params.categoryNumber || 1,
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Update Name Hold Status tool
 * Put a name on hold or release from hold
 */
export const updateNameHoldStatusTool = {
	definition: {
		name: "mw_update_name_hold_status",
		description: "Put a MoneyWorks name on hold or release from hold",
		inputSchema: {
			type: "object",
			properties: {
				code: {
					type: "string",
					description: "The name code to update",
				},
				onHold: {
					type: "boolean",
					description: "True to put on hold, false to release",
				},
			},
			required: ["code", "onHold"],
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: { code: string; onHold: boolean },
	) {
		const repo = new NameRepository(client);
		const updatedName = await repo.putOnHold(
			params.code as NameCode,
			params.onHold,
		);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							updatedName,
							status: params.onHold ? "put on hold" : "released from hold",
						},
						null,
						2,
					),
				},
			],
		};
	},
};

/**
 * Update Credit Limit tool
 * Update the credit limit for a debtor
 */
export const updateCreditLimitTool = {
	definition: {
		name: "mw_update_credit_limit",
		description: "Update the credit limit for a MoneyWorks debtor",
		inputSchema: {
			type: "object",
			properties: {
				code: {
					type: "string",
					description: "The debtor code to update",
				},
				creditLimit: {
					type: "number",
					description: "New credit limit amount",
					minimum: 0,
				},
			},
			required: ["code", "creditLimit"],
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: { code: string; creditLimit: number },
	) {
		const repo = new NameRepository(client);
		const updatedName = await repo.updateCreditLimit(
			params.code as NameCode,
			params.creditLimit,
		);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							updatedName,
							newCreditLimit: params.creditLimit,
						},
						null,
						2,
					),
				},
			],
		};
	},
};
