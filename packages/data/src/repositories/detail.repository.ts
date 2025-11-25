/**
 * MoneyWorks Detail (Transaction Line) Repository
 *
 * @moneyworks-entity Detail
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all Detail (line item) data operations
 * @ai-critical Use MoneyWorks Detail terminology exclusively
 *
 * Detail contains transaction line items.
 * Relationship: Detail.ParentSeq -> Transaction.SequenceNumber
 *
 * NOTE: MoneyWorks API uses "Detail." prefix for field names (e.g., "Detail.Account")
 * but returns data without the prefix.
 */

import type {
	MoneyWorksDetail,
	MoneyWorksDetailCreateInput,
	MoneyWorksDetailUpdateInput,
} from "@moneyworks/canonical/entities/details";
import { BaseMoneyWorksRepository } from "./base.repository";

/**
 * Repository for MoneyWorks Detail entity
 *
 * @ai-instruction Use this for all Detail (line item) data operations
 * @ai-term Say "DetailRepository", NEVER "LineItemRepository" or "InvoiceLineRepository"
 *
 * KEY RELATIONSHIPS:
 * - Detail.ParentSeq -> Transaction.SequenceNumber (parent transaction)
 * - Detail.Account -> Accounts.Code
 * - Detail.StockCode -> Products.Code
 * - Detail.JobCode -> Jobs.Code
 * - Detail.TaxCode -> TaxRates.TaxCode
 *
 * COMPOSITE KEY: (ParentSeq, Sort) uniquely identifies a detail line
 */
export class DetailRepository extends BaseMoneyWorksRepository<
	MoneyWorksDetail,
	MoneyWorksDetailCreateInput,
	MoneyWorksDetailUpdateInput
> {
	/**
	 * MoneyWorks table name
	 * @ai-critical Must be exact MW table name
	 */
	protected readonly tableName = "Detail";

	/**
	 * Primary key field
	 * @ai-critical ParentSeq is part of composite key with Sort
	 * @ai-context Use findByParentSeq for line lookup
	 */
	protected readonly primaryKey = "ParentSeq";

	/**
	 * Post-process records to parse MW data types
	 *
	 * Handles:
	 * - Stripping "Detail." prefix from field names (if present)
	 * - Parsing numeric fields
	 * - Parsing boolean fields
	 */
	protected postProcess(record: any): MoneyWorksDetail {
		const processed: any = {};

		// Copy and strip "Detail." prefix if present
		for (const [key, value] of Object.entries(record)) {
			const cleanKey = key.startsWith("Detail.") ? key.substring(7) : key;
			processed[cleanKey] = value;
		}

		// Numeric fields
		const numericFields = [
			"ParentSeq",
			"Sort",
			"Period",
			"Debit",
			"Credit",
			"Tax",
			"Gross",
			"ExpensedTax",
			"BaseCurrencyNet",
			"StockQty",
			"UnitPrice",
			"CostPrice",
			"Discount",
			"PostedQty",
			"OriginalUnitCost",
			"OrderQty",
			"BackorderQty",
			"NonInvRcvdNotInvoicedQty",
			"SerialNumber",
			"Flags",
			"MoreFlags",
			"SecurityLevel",
			"Statement",
			"UserNum",
		];

		for (const field of numericFields) {
			if (
				field in processed &&
				processed[field] !== null &&
				processed[field] !== ""
			) {
				processed[field] = Number(processed[field]);
			}
		}

		// Boolean fields
		const booleanFields = ["OrderStatus"];

		for (const field of booleanFields) {
			if (field in processed) {
				if (typeof processed[field] === "string") {
					processed[field] =
						processed[field].toLowerCase() === "true" ||
						processed[field] === "1";
				} else if (typeof processed[field] === "number") {
					processed[field] = processed[field] !== 0;
				}
			}
		}

		return processed as MoneyWorksDetail;
	}

	/**
	 * Prepare data for MoneyWorks
	 *
	 * Converts typed data to MW format
	 * Note: MW API expects "Detail." prefix for imports
	 */
	protected prepare(
		data: MoneyWorksDetailCreateInput | MoneyWorksDetailUpdateInput,
	): any {
		const prepared: any = {};

		// Identity fields (for creation)
		if ("ParentSeq" in data && data.ParentSeq !== undefined) {
			prepared["Detail.ParentSeq"] = data.ParentSeq;
		}
		if ("Sort" in data && data.Sort !== undefined) {
			prepared["Detail.Sort"] = data.Sort;
		}

		// Account fields
		if ("Account" in data && data.Account !== undefined) {
			prepared["Detail.Account"] = data.Account;
		}
		if ("Dept" in data && data.Dept !== undefined) {
			prepared["Detail.Dept"] = data.Dept;
		}
		if ("TaxCode" in data && data.TaxCode !== undefined) {
			prepared["Detail.TaxCode"] = data.TaxCode;
		}

		// Value fields
		if ("Debit" in data && data.Debit !== undefined) {
			prepared["Detail.Debit"] = data.Debit;
		}
		if ("Credit" in data && data.Credit !== undefined) {
			prepared["Detail.Credit"] = data.Credit;
		}
		if ("Tax" in data && data.Tax !== undefined) {
			prepared["Detail.Tax"] = data.Tax;
		}

		// Product fields
		if ("StockCode" in data && data.StockCode !== undefined) {
			prepared["Detail.StockCode"] = data.StockCode;
		}
		if ("StockQty" in data && data.StockQty !== undefined) {
			prepared["Detail.StockQty"] = data.StockQty;
		}
		if ("UnitPrice" in data && data.UnitPrice !== undefined) {
			prepared["Detail.UnitPrice"] = data.UnitPrice;
		}
		if ("Discount" in data && data.Discount !== undefined) {
			prepared["Detail.Discount"] = data.Discount;
		}
		if ("StockLocation" in data && data.StockLocation !== undefined) {
			prepared["Detail.StockLocation"] = data.StockLocation;
		}

		// Job fields
		if ("JobCode" in data && data.JobCode !== undefined) {
			prepared["Detail.JobCode"] = data.JobCode;
		}

		// Description
		if ("Description" in data && data.Description !== undefined) {
			prepared["Detail.Description"] = data.Description;
		}

		// User-defined fields
		if ("Custom1" in data && data.Custom1 !== undefined) {
			prepared["Detail.Custom1"] = data.Custom1;
		}
		if ("Custom2" in data && data.Custom2 !== undefined) {
			prepared["Detail.Custom2"] = data.Custom2;
		}
		if ("UserNum" in data && data.UserNum !== undefined) {
			prepared["Detail.UserNum"] = data.UserNum;
		}
		if ("UserText" in data && data.UserText !== undefined) {
			prepared["Detail.UserText"] = data.UserText;
		}
		if ("TaggedText" in data && data.TaggedText !== undefined) {
			prepared["Detail.TaggedText"] = data.TaggedText;
		}

		return prepared;
	}

	// =========================================================================
	// SPECIALIZED QUERY METHODS
	// =========================================================================

	/**
	 * Find all detail lines for a transaction by ParentSeq
	 *
	 * @param parentSeq - The SequenceNumber of the parent Transaction
	 * @returns Array of detail lines for the transaction
	 *
	 * @example
	 * ```typescript
	 * // Get all lines for transaction with SequenceNumber 12345
	 * const lines = await repo.findByParentSeq(12345);
	 * for (const line of lines) {
	 *   console.log(`${line.Account}: ${line.Debit || line.Credit}`);
	 * }
	 * ```
	 *
	 * @ai-instruction This is the primary way to get detail lines
	 * @ai-context Results ordered by Sort field
	 */
	async findByParentSeq(parentSeq: number): Promise<MoneyWorksDetail[]> {
		const results = await this.find(`Detail.ParentSeq=${parentSeq}`);
		// Sort by Sort field
		return results.sort((a, b) => (a.Sort || 0) - (b.Sort || 0));
	}

	/**
	 * Find all detail lines for a transaction
	 * Alias for findByParentSeq for clarity
	 *
	 * @param transactionSeq - The SequenceNumber of the parent Transaction
	 * @returns Array of detail lines
	 *
	 * @ai-instruction Use when you have a Transaction.SequenceNumber
	 */
	async findByTransaction(transactionSeq: number): Promise<MoneyWorksDetail[]> {
		return this.findByParentSeq(transactionSeq);
	}

	/**
	 * Find detail lines by account code
	 *
	 * @param accountCode - The account code
	 * @returns Array of detail lines for that account
	 *
	 * @example
	 * ```typescript
	 * // Get all detail lines for Sales account
	 * const salesLines = await repo.findByAccount("4000");
	 * ```
	 *
	 * @ai-instruction Useful for account-level analysis
	 */
	async findByAccount(accountCode: string): Promise<MoneyWorksDetail[]> {
		return this.find(`Detail.Account="${accountCode}"`);
	}

	/**
	 * Find detail lines by product code
	 *
	 * @param stockCode - The product/stock code
	 * @returns Array of detail lines for that product
	 *
	 * @example
	 * ```typescript
	 * // Get all transactions involving product "WIDGET-001"
	 * const lines = await repo.findByProduct("WIDGET-001");
	 * ```
	 *
	 * @ai-instruction Use for product movement analysis
	 */
	async findByProduct(stockCode: string): Promise<MoneyWorksDetail[]> {
		return this.find(`Detail.StockCode="${stockCode}"`);
	}

	/**
	 * Find detail lines by job code
	 *
	 * @param jobCode - The job code
	 * @returns Array of detail lines for that job
	 *
	 * @example
	 * ```typescript
	 * // Get all lines costed to job "JOB-001"
	 * const lines = await repo.findByJob("JOB-001");
	 * ```
	 *
	 * @ai-instruction Use for job costing reports
	 */
	async findByJob(jobCode: string): Promise<MoneyWorksDetail[]> {
		return this.find(`Detail.JobCode="${jobCode}"`);
	}

	/**
	 * Find detail lines by tax code
	 *
	 * @param taxCode - The tax code
	 * @returns Array of detail lines with that tax code
	 *
	 * @example
	 * ```typescript
	 * // Get all lines with GST tax code
	 * const gstLines = await repo.findByTaxCode("S");
	 * ```
	 *
	 * @ai-instruction Use for tax analysis
	 */
	async findByTaxCode(taxCode: string): Promise<MoneyWorksDetail[]> {
		return this.find(`Detail.TaxCode="${taxCode}"`);
	}

	/**
	 * Find detail lines by period
	 *
	 * @param period - The accounting period (100 * year + period)
	 * @returns Array of detail lines in that period
	 *
	 * @ai-instruction Detail.Period matches parent Transaction.Period
	 */
	async findByPeriod(period: number): Promise<MoneyWorksDetail[]> {
		return this.find(`Detail.Period=${period}`);
	}

	/**
	 * Find detail lines for an account within a date range
	 *
	 * Note: Requires joining with Transaction table for date filter.
	 * This is a helper that queries Detail directly by period range.
	 *
	 * @param accountCode - The account code
	 * @param startPeriod - Start period
	 * @param endPeriod - End period
	 * @returns Array of detail lines
	 */
	async findByAccountAndPeriodRange(
		accountCode: string,
		startPeriod: number,
		endPeriod: number,
	): Promise<MoneyWorksDetail[]> {
		return this.find(
			`Detail.Account="${accountCode}" AND Detail.Period>=${startPeriod} AND Detail.Period<=${endPeriod}`,
		);
	}

	/**
	 * Find detail lines that are unreconciled (for bank accounts)
	 *
	 * @param accountCode - The bank account code
	 * @returns Array of unreconciled detail lines
	 *
	 * @ai-instruction Statement=0 means unreconciled
	 */
	async findUnreconciled(accountCode: string): Promise<MoneyWorksDetail[]> {
		return this.find(
			`Detail.Account="${accountCode}" AND Detail.Statement=0`,
		);
	}

	/**
	 * Find detail lines with outstanding backorder
	 *
	 * @returns Array of detail lines with BackorderQty > 0
	 *
	 * @ai-instruction Use for backorder management
	 */
	async findWithBackorder(): Promise<MoneyWorksDetail[]> {
		return this.find("Detail.BackorderQty>0");
	}

	/**
	 * Search detail lines by description
	 *
	 * @param searchText - Text to search for
	 * @returns Array of detail lines with matching description
	 */
	async searchByDescription(searchText: string): Promise<MoneyWorksDetail[]> {
		return this.find(`Detail.Description CONTAINS "${searchText}"`);
	}

	/**
	 * Get total debits/credits for an account in a period
	 *
	 * Note: This returns detail lines; sum Debit/Credit in application code.
	 *
	 * @param accountCode - The account code
	 * @param period - The accounting period
	 * @returns Array of detail lines for aggregation
	 */
	async findForAccountTotal(
		accountCode: string,
		period: number,
	): Promise<MoneyWorksDetail[]> {
		return this.find(
			`Detail.Account="${accountCode}" AND Detail.Period=${period}`,
		);
	}
}
