/**
 * MoneyWorks Name Repository
 *
 * Data access layer for MoneyWorks Names entity
 * Handles CRUD operations and specialized queries
 *
 * @ai-instruction Names can be Customers/Debtors or Suppliers/Creditors
 * @ai-critical Preserve MW terminology: RecAccount, PayAccount, DCurrent, etc.
 */

import type {
	MoneyWorksCustomerType,
	MoneyWorksName,
	MoneyWorksNameFilter,
	MoneyWorksNameInput,
	MoneyWorksSupplierType,
} from "@moneyworks/canonical/names";
import {
	isCreditor,
	isDebtor,
	validateName,
} from "@moneyworks/canonical/names";
import type { NameCode } from "@moneyworks/utilities";
import type { ExportFormat } from "../client/types";
import type {
	MoneyWorksQueryParams,
	MoneyWorksResponse,
} from "../config/types";
import { BaseMoneyWorksRepository } from "./base.repository";

export class NameRepository extends BaseMoneyWorksRepository<MoneyWorksName> {
	protected readonly tableName = "Name";
	protected readonly primaryKey = "Code";

	/**
	 * Prepare data for MoneyWorks
	 * Convert typed data to MW format
	 */
	protected prepare(data: Partial<MoneyWorksName>): any {
		// For Names, most fields are already in MW format
		// Just ensure boolean fields are correct
		const prepared: any = { ...data };

		if ("Hold" in prepared && typeof prepared.Hold === "boolean") {
			prepared.Hold = prepared.Hold ? "true" : "false";
		}

		return prepared;
	}

	/**
	 * Post-process data after export
	 * Convert MW data to typed format
	 */
	protected postProcess(record: any): MoneyWorksName {
		const processed = { ...record };

		// Convert Hold from string to boolean
		if ("Hold" in processed) {
			processed.Hold = processed.Hold === "true" || processed.Hold === true;
		}

		// Ensure numeric fields are numbers
		const numericFields = [
			"SequenceNumber",
			"CustomerType",
			"SupplierType",
			"Kind",
			"CreditLimit",
			"DCurrent",
			"D30Plus",
			"D60Plus",
			"D90Plus",
			"CCurrent",
			"DebtorTerms",
			"CreditorTerms",
			"PaymentMethod",
			"LastPaymentMethod",
			"ReceiptMethod",
			"SplitPercent",
			"Colour",
			"Flags",
			"UserNum",
			"Role",
			"Role2",
		];

		numericFields.forEach((field) => {
			if (
				field in processed &&
				processed[field] !== null &&
				processed[field] !== ""
			) {
				processed[field] = Number(processed[field]);
			}
		});

		return processed as MoneyWorksName;
	}

	/**
	 * Find by key (Code)
	 */
	async findByKey(code: string): Promise<MoneyWorksName | null> {
		const records = await this.find(`Code="${code}"`);
		return records.length > 0 ? records[0] : null;
	}

	/**
	 * Find all names
	 */
	async findAll(params?: MoneyWorksQueryParams): Promise<MoneyWorksName[]> {
		return this.find(undefined, params);
	}

	/**
	 * Find names by MoneyWorks search expression
	 */
	async find(
		search?: string,
		params?: MoneyWorksQueryParams,
	): Promise<MoneyWorksName[]> {
		// Check if we're in mock mode
		if (process.env.MONEYWORKS_MOCK_MODE === "true") {
			console.log("[NameRepository] Using mock mode for search:", search);

			// Return mock supplier data if search indicates suppliers
			if (
				search?.toLowerCase().includes("supplier") ||
				search?.toLowerCase().includes("creditor") ||
				params?.search?.toLowerCase().includes("supplier") ||
				params?.search?.toLowerCase().includes("creditor")
			) {
				const mockSuppliers = [
					{
						Code: "SUP001",
						Name: "Acme Supplies Ltd",
						Phone: "+1 555-0100",
						Email: "orders@acmesupplies.com",
						CustomerType: 0,
						SupplierType: 1,
						Kind: 1,
						Hold: false,
					},
					{
						Code: "SUP002",
						Name: "Global Materials Inc",
						Phone: "+1 555-0200",
						Email: "sales@globalmaterials.com",
						CustomerType: 0,
						SupplierType: 1,
						Kind: 1,
						Hold: false,
					},
					{
						Code: "SUP003",
						Name: "Premium Parts Co",
						Phone: "+1 555-0300",
						Email: "info@premiumparts.com",
						CustomerType: 0,
						SupplierType: 1,
						Kind: 1,
						Hold: false,
					},
					{
						Code: "CRED001",
						Name: "Tech Solutions Provider",
						Phone: "+1 555-0400",
						Email: "billing@techsolutions.com",
						CustomerType: 0,
						SupplierType: 2,
						Kind: 1,
						Hold: false,
					},
					{
						Code: "CRED002",
						Name: "Office Essentials Direct",
						Phone: "+1 555-0500",
						Email: "accounts@officeessentials.com",
						CustomerType: 0,
						SupplierType: 2,
						Kind: 1,
						Hold: false,
					},
				];

				return mockSuppliers.map((record) => this.postProcess(record));
			}

			// Return empty array for other searches in mock mode
			return [];
		}

		// Use smartExport which returns objects by default
		console.log(
			"[NameRepository.find] Calling smartExport with search:",
			search,
			"params:",
			params,
		);

		try {
			const result = await this.client.smartExport(this.tableName, {
				search,
				...params,
				exportFormat: "full",
			});

			// smartExport returns an array of objects when exportFormat is 'full'
			if (!Array.isArray(result)) {
				console.error(
					"[NameRepository.find] Unexpected response format:",
					result,
				);
				throw new Error("Unexpected response format");
			}

			console.log(
				"[NameRepository.find] Got",
				result.length,
				"records from MoneyWorks",
			);
			return result.map((record) => this.postProcess(record));
		} catch (error) {
			console.error("[NameRepository.find] Error from smartExport:", error);
			throw error;
		}
	}

	/**
	 * Create a new name
	 */
	async create(data: Partial<MoneyWorksName>): Promise<MoneyWorksName> {
		// Validate input
		const validation = validateName(data as MoneyWorksNameInput);
		if (!validation.isValid) {
			throw new Error(
				`Validation failed: ${validation.errors.map((e) => e.message).join(", ")}`,
			);
		}

		// Set defaults
		const nameData = {
			Kind: 1, // Normal (not template)
			CustomerType: 0, // Not a customer by default
			SupplierType: 0, // Not a supplier by default
			Hold: false,
			Currency: "", // Local currency
			...data,
		};

		// Validate control accounts
		if (
			isDebtor({ CustomerType: nameData.CustomerType! }) &&
			!nameData.RecAccount
		) {
			throw new Error(
				"Receivables Account (RecAccount) is required for Debtors",
			);
		}

		if (
			isCreditor({ SupplierType: nameData.SupplierType! }) &&
			!nameData.PayAccount
		) {
			throw new Error(
				"Payables Account (PayAccount) is required for Creditors",
			);
		}

		const prepared = this.prepare(nameData);
		const result = await this.client.import(this.tableName, [prepared], {
			mode: "insert",
		});

		if (result.errors > 0 || !result.created) {
			throw new Error(
				result.errorDetails?.[0]?.message || "Failed to create name",
			);
		}

		// Fetch the created record
		const created = await this.findByKey(data.Code as string);
		if (!created) {
			throw new Error("Name created but could not be retrieved");
		}

		return created;
	}

	/**
	 * Update an existing name
	 */
	async update(
		code: string,
		data: Partial<MoneyWorksName>,
	): Promise<MoneyWorksName> {
		// Get existing name
		const existing = await this.findByKey(code);
		if (!existing) {
			throw new Error(`Name with code ${code} not found`);
		}

		// Merge updates
		const updated = { ...existing, ...data };

		// Validate
		const validation = validateName(updated as MoneyWorksNameInput);
		if (!validation.isValid) {
			throw new Error(
				`Validation failed: ${validation.errors.map((e) => e.message).join(", ")}`,
			);
		}

		// Validate control accounts if type changed
		if (
			isDebtor({ CustomerType: updated.CustomerType }) &&
			!updated.RecAccount
		) {
			throw new Error(
				"Receivables Account (RecAccount) is required for Debtors",
			);
		}

		if (
			isCreditor({ SupplierType: updated.SupplierType }) &&
			!updated.PayAccount
		) {
			throw new Error(
				"Payables Account (PayAccount) is required for Creditors",
			);
		}

		const prepared = this.prepare(updated);
		const result = await this.client.import(this.tableName, [prepared], {
			mode: "update",
		});

		if (result.errors > 0) {
			throw new Error(
				result.errorDetails?.[0]?.message || "Failed to update name",
			);
		}

		// Fetch the updated record
		const updatedRecord = await this.findByKey(code);
		if (!updatedRecord) {
			throw new Error("Name updated but could not be retrieved");
		}

		return updatedRecord;
	}

	/**
	 * Delete a name
	 */
	async delete(code: string): Promise<void> {
		// MoneyWorks doesn't support direct deletion via REST API
		// Names are typically marked inactive or archived
		throw new Error(
			"Name deletion is not supported. Consider marking the name as inactive instead.",
		);
	}

	// ============= SPECIALIZED QUERIES =============

	/**
	 * Get all customers (including debtors)
	 */
	async getCustomers(
		options: {
			includeOnHold?: boolean;
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksName[]> {
		let search = "(CustomerType=1 OR CustomerType=2)";

		if (!options.includeOnHold) {
			search += " AND Hold=false";
		}

		return this.find(search, {
			sort: options.orderBy || "Name",
			limit: options.limit,
			offset: options.offset,
		});
	}

	/**
	 * Get debtors only (have receivables)
	 */
	async getDebtors(
		options: {
			includeOnHold?: boolean;
			withBalancesOnly?: boolean;
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksName[]> {
		let search = "CustomerType=2";

		if (!options.includeOnHold) {
			search += " AND Hold=false";
		}

		if (options.withBalancesOnly) {
			search += " AND (DCurrent<>0 OR D30Plus<>0 OR D60Plus<>0 OR D90Plus<>0)";
		}

		return this.find(search, {
			sort: options.orderBy || "Name",
			limit: options.limit,
			offset: options.offset,
		});
	}

	/**
	 * Get all suppliers (including creditors)
	 */
	async getSuppliers(
		options: {
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksName[]> {
		const search = "(SupplierType=1 OR SupplierType=2)";

		return this.find(search, {
			sort: options.orderBy || "Name",
			limit: options.limit,
			offset: options.offset,
		});
	}

	/**
	 * Get creditors only (have payables)
	 */
	async getCreditors(
		options: {
			withBalancesOnly?: boolean;
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksName[]> {
		let search = "SupplierType=2";

		if (options.withBalancesOnly) {
			search += " AND CCurrent<>0";
		}

		return this.find(search, {
			sort: options.orderBy || "Name",
			limit: options.limit,
			offset: options.offset,
		});
	}

	/**
	 * Search names by text
	 */
	async search(
		searchText: string,
		options: {
			searchFields?: ("Code" | "Name" | "Phone" | "email" | "Contact")[];
			customerType?: "all" | "customers" | "debtors" | "none";
			supplierType?: "all" | "suppliers" | "creditors" | "none";
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksName[]> {
		// MoneyWorks search expressions are very limited - only exact matches work
		// For text search, we need to fetch data and filter in JavaScript

		let baseFilter = "";

		// Build MoneyWorks filter for type constraints only
		const typeFilters = [];

		// Add customer type filter
		if (options.customerType === "customers") {
			typeFilters.push("(CustomerType=1 OR CustomerType=2)");
		} else if (options.customerType === "debtors") {
			typeFilters.push("CustomerType=2");
		} else if (options.customerType === "none") {
			typeFilters.push("CustomerType=0");
		}

		// Add supplier type filter
		if (options.supplierType === "suppliers") {
			typeFilters.push("(SupplierType=1 OR SupplierType=2)");
		} else if (options.supplierType === "creditors") {
			typeFilters.push("SupplierType=2");
		} else if (options.supplierType === "none") {
			typeFilters.push("SupplierType=0");
		}

		if (typeFilters.length > 0) {
			baseFilter = typeFilters.join(" AND ");
		}

		// Fetch records with type filter only
		// Use a reasonable limit to avoid fetching too many records
		const fetchLimit = Math.max(options.limit || 100, 1000);
		const allRecords = await this.find(baseFilter || undefined, {
			limit: fetchLimit,
		});

		// Now filter by search text in JavaScript
		const searchFields = options.searchFields || ["Code", "Name"];
		const searchTextLower = searchText.toLowerCase();

		let filteredRecords = allRecords;

		// Only apply text search if searchText is provided
		if (searchText.trim()) {
			filteredRecords = allRecords.filter((record) => {
				return searchFields.some((field) => {
					const fieldValue = record[field as keyof MoneyWorksName];
					if (typeof fieldValue === "string") {
						return fieldValue.toLowerCase().includes(searchTextLower);
					}
					return false;
				});
			});
		}

		// Apply offset and limit
		const offset = options.offset || 0;
		const limit = options.limit || filteredRecords.length;

		return filteredRecords.slice(offset, offset + limit);
	}

	/**
	 * Get names by category
	 */
	async getByCategory(
		category: string,
		categoryNumber: 1 | 2 | 3 | 4 = 1,
	): Promise<MoneyWorksName[]> {
		const search = `Category${categoryNumber}="${category}"`;
		return this.find(search, { sort: "Name" });
	}

	/**
	 * Get names with overdue balances
	 */
	async getOverdueDebtors(daysOverdue = 0): Promise<MoneyWorksName[]> {
		let search = "CustomerType=2 AND Hold=false";

		if (daysOverdue <= 30) {
			search += " AND (D30Plus<>0 OR D60Plus<>0 OR D90Plus<>0)";
		} else if (daysOverdue <= 60) {
			search += " AND (D60Plus<>0 OR D90Plus<>0)";
		} else {
			search += " AND D90Plus<>0";
		}

		return this.find(search, { sort: "Name" });
	}

	/**
	 * Put a name on hold
	 */
	async putOnHold(code: NameCode, onHold = true): Promise<MoneyWorksName> {
		return this.update(code, { Hold: onHold });
	}

	/**
	 * Update credit limit for a debtor
	 */
	async updateCreditLimit(
		code: NameCode,
		creditLimit: number,
	): Promise<MoneyWorksName> {
		const name = await this.findByKey(code);
		if (!name) {
			throw new Error(`Name with code ${code} not found`);
		}

		if (!isDebtor(name)) {
			throw new Error("Credit limits can only be set for Debtors");
		}

		return this.update(code, { CreditLimit: creditLimit });
	}

	/**
	 * Get total balances summary
	 */
	async getBalancesSummary(): Promise<{
		totalDebtors: number;
		totalCreditors: number;
		debtorsCurrent: number;
		debtors30Plus: number;
		debtors60Plus: number;
		debtors90Plus: number;
		creditorsTotal: number;
	}> {
		// Get all debtors with balances
		const debtors = await this.find("CustomerType=2");

		// Get all creditors with balances
		const creditors = await this.find("SupplierType=2");

		// Calculate totals
		const summary = {
			totalDebtors: debtors.length,
			totalCreditors: creditors.length,
			debtorsCurrent: 0,
			debtors30Plus: 0,
			debtors60Plus: 0,
			debtors90Plus: 0,
			creditorsTotal: 0,
		};

		debtors.forEach((debtor) => {
			summary.debtorsCurrent += debtor.DCurrent || 0;
			summary.debtors30Plus += debtor.D30Plus || 0;
			summary.debtors60Plus += debtor.D60Plus || 0;
			summary.debtors90Plus += debtor.D90Plus || 0;
		});

		creditors.forEach((creditor) => {
			summary.creditorsTotal += creditor.CCurrent || 0;
		});

		return summary;
	}
}
