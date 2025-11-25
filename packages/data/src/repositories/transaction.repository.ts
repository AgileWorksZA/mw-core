/**
 * MoneyWorks Transaction Repository
 *
 * @moneyworks-entity Transaction
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all Transaction data operations
 * @ai-critical Use MoneyWorks Transaction terminology exclusively
 *
 * Transaction is the header entity for all financial transactions.
 * Detail lines link via Detail.ParentSeq -> Transaction.SequenceNumber
 */

import type {
	MoneyWorksTransaction,
	MoneyWorksTransactionCreateInput,
	MoneyWorksTransactionUpdateInput,
} from "@moneyworks/canonical/entities/transactions";
import type {
	MoneyWorksTransactionType,
	MoneyWorksTransactionStatus,
} from "@moneyworks/canonical/entities/transactions";
import { BaseMoneyWorksRepository } from "./base.repository";

/**
 * Repository for MoneyWorks Transaction entity
 *
 * @ai-instruction Use this for all Transaction data operations
 * @ai-term Say "TransactionRepository", NEVER "InvoiceRepository" or "PaymentRepository"
 *
 * KEY RELATIONSHIPS:
 * - Transaction is the header record for all financial transactions
 * - Detail lines link via Detail.ParentSeq -> Transaction.SequenceNumber
 * - NameCode links to Names table
 * - Contra links to Accounts table (bank or control account)
 */
export class TransactionRepository extends BaseMoneyWorksRepository<
	MoneyWorksTransaction,
	MoneyWorksTransactionCreateInput,
	MoneyWorksTransactionUpdateInput
> {
	/**
	 * MoneyWorks table name
	 * @ai-critical Must be exact MW table name
	 */
	protected readonly tableName = "Transaction";

	/**
	 * Primary key field
	 * @ai-critical SequenceNumber is the primary key for Transaction
	 */
	protected readonly primaryKey = "SequenceNumber";

	/**
	 * Post-process records to parse MW data types
	 *
	 * Parses:
	 * - Numeric fields (amounts, flags, sequence numbers)
	 * - Boolean fields (Hold, Recurring)
	 * - Date fields are kept as strings (YYYYMMDD format)
	 */
	protected postProcess(record: any): MoneyWorksTransaction {
		const processed: any = { ...record };

		// Numeric fields - amounts and values
		const numericFields = [
			"SequenceNumber",
			"Gross",
			"TaxAmount",
			"AmtPaid",
			"AmtWrittenOff",
			"PayAmount",
			"ExchangeRate",
			"PromptPaymentAmt",
			"OrderTotal",
			"OrderShipped",
			"OrderDeposit",
			"FreightAmount",
			"OriginatingOrderSeq",
			"Period",
			"Aging",
			"TaxCycle",
			"Colour",
			"PaymentMethod",
			"SecurityLevel",
			"Flags",
			"Printed",
			"Emailed",
			"Transferred",
			"BankJNSeq",
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
		const booleanFields = ["Hold", "Recurring"];

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

		return processed as MoneyWorksTransaction;
	}

	/**
	 * Prepare data for MoneyWorks
	 *
	 * Converts typed data to MW format
	 */
	protected prepare(
		data: MoneyWorksTransactionCreateInput | MoneyWorksTransactionUpdateInput,
	): any {
		const prepared: any = {};

		// Type and Period (for creation)
		if ("Type" in data && data.Type !== undefined) {
			prepared.Type = data.Type;
		}
		if ("Period" in data && data.Period !== undefined) {
			prepared.Period = data.Period;
		}

		// Reference fields
		if ("OurRef" in data && data.OurRef !== undefined) {
			prepared.OurRef = data.OurRef;
		}
		if ("TheirRef" in data && data.TheirRef !== undefined) {
			prepared.TheirRef = data.TheirRef;
		}

		// Date fields
		if ("TransDate" in data && data.TransDate !== undefined) {
			prepared.TransDate = data.TransDate;
		}
		if ("DueDate" in data && data.DueDate !== undefined) {
			prepared.DueDate = data.DueDate;
		}

		// Party fields
		if ("NameCode" in data && data.NameCode !== undefined) {
			prepared.NameCode = data.NameCode;
		}
		if ("Contra" in data && data.Contra !== undefined) {
			prepared.Contra = data.Contra;
		}
		if ("SalesPerson" in data && data.SalesPerson !== undefined) {
			prepared.SalesPerson = data.SalesPerson;
		}
		if ("ToFrom" in data && data.ToFrom !== undefined) {
			prepared.ToFrom = data.ToFrom;
		}

		// Description fields
		if ("Description" in data && data.Description !== undefined) {
			prepared.Description = data.Description;
		}
		if ("Analysis" in data && data.Analysis !== undefined) {
			prepared.Analysis = data.Analysis;
		}
		if ("Flag" in data && data.Flag !== undefined) {
			prepared.Flag = data.Flag;
		}

		// Financial fields
		if ("Gross" in data && data.Gross !== undefined) {
			prepared.Gross = data.Gross;
		}
		if ("FreightAmount" in data && data.FreightAmount !== undefined) {
			prepared.FreightAmount = data.FreightAmount;
		}

		// Address fields
		if ("DeliveryAddress" in data && data.DeliveryAddress !== undefined) {
			prepared.DeliveryAddress = data.DeliveryAddress;
		}
		if ("MailingAddress" in data && data.MailingAddress !== undefined) {
			prepared.MailingAddress = data.MailingAddress;
		}

		// Control fields
		if ("PaymentMethod" in data && data.PaymentMethod !== undefined) {
			prepared.PaymentMethod = data.PaymentMethod;
		}
		if ("ProdPriceCode" in data && data.ProdPriceCode !== undefined) {
			prepared.ProdPriceCode = data.ProdPriceCode;
		}
		if ("Hold" in data && data.Hold !== undefined) {
			prepared.Hold = data.Hold ? "true" : "false";
		}
		if ("Colour" in data && data.Colour !== undefined) {
			prepared.Colour = data.Colour;
		}

		// Freight fields
		if ("FreightCode" in data && data.FreightCode !== undefined) {
			prepared.FreightCode = data.FreightCode;
		}
		if ("FreightDetails" in data && data.FreightDetails !== undefined) {
			prepared.FreightDetails = data.FreightDetails;
		}

		// Approval fields (update only)
		if ("ApprovedBy1" in data && data.ApprovedBy1 !== undefined) {
			prepared.ApprovedBy1 = data.ApprovedBy1;
		}
		if ("ApprovedBy2" in data && data.ApprovedBy2 !== undefined) {
			prepared.ApprovedBy2 = data.ApprovedBy2;
		}

		// User-defined fields
		if ("User1" in data && data.User1 !== undefined) {
			prepared.User1 = data.User1;
		}
		if ("User2" in data && data.User2 !== undefined) {
			prepared.User2 = data.User2;
		}
		if ("User3" in data && data.User3 !== undefined) {
			prepared.User3 = data.User3;
		}
		if ("User4" in data && data.User4 !== undefined) {
			prepared.User4 = data.User4;
		}
		if ("User5" in data && data.User5 !== undefined) {
			prepared.User5 = data.User5;
		}
		if ("User6" in data && data.User6 !== undefined) {
			prepared.User6 = data.User6;
		}
		if ("User7" in data && data.User7 !== undefined) {
			prepared.User7 = data.User7;
		}
		if ("User8" in data && data.User8 !== undefined) {
			prepared.User8 = data.User8;
		}
		if ("UserNum" in data && data.UserNum !== undefined) {
			prepared.UserNum = data.UserNum;
		}
		if ("UserText" in data && data.UserText !== undefined) {
			prepared.UserText = data.UserText;
		}
		if ("TaggedText" in data && data.TaggedText !== undefined) {
			prepared.TaggedText = data.TaggedText;
		}

		return prepared;
	}

	// =========================================================================
	// SPECIALIZED QUERY METHODS
	// =========================================================================

	/**
	 * Find transactions by type
	 *
	 * @param type - Transaction type code (e.g., "DII", "CR", "JN")
	 * @returns Array of transactions of that type
	 *
	 * @example
	 * ```typescript
	 * // Get all debtor invoices (incomplete)
	 * const invoices = await repo.findByType("DII");
	 * ```
	 *
	 * @ai-instruction Use MoneyWorksTransactionType enum values
	 */
	async findByType(
		type: MoneyWorksTransactionType | string,
	): Promise<MoneyWorksTransaction[]> {
		return this.find(`Type="${type}"`);
	}

	/**
	 * Find transactions by customer/supplier code
	 *
	 * @param nameCode - The Name code from Names table
	 * @returns Array of transactions for that name
	 *
	 * @example
	 * ```typescript
	 * // Get all transactions for customer "CUST001"
	 * const transactions = await repo.findByNameCode("CUST001");
	 * ```
	 *
	 * @ai-instruction Use for customer/supplier transaction history
	 */
	async findByNameCode(nameCode: string): Promise<MoneyWorksTransaction[]> {
		return this.find(`NameCode="${nameCode}"`);
	}

	/**
	 * Find transactions by status
	 *
	 * @param status - Transaction status (U=unposted, P=posted)
	 * @returns Array of transactions with that status
	 *
	 * @example
	 * ```typescript
	 * // Get all unposted transactions
	 * const unposted = await repo.findByStatus("U");
	 * ```
	 *
	 * @ai-instruction Unposted (U) can be edited, Posted (P) cannot
	 */
	async findByStatus(
		status: MoneyWorksTransactionStatus | string,
	): Promise<MoneyWorksTransaction[]> {
		return this.find(`Status="${status}"`);
	}

	/**
	 * Find all posted transactions
	 *
	 * @returns Array of posted transactions
	 *
	 * @ai-instruction Posted transactions affect financial reports
	 */
	async findPosted(): Promise<MoneyWorksTransaction[]> {
		return this.findByStatus("P");
	}

	/**
	 * Find all unposted transactions
	 *
	 * @returns Array of unposted transactions
	 *
	 * @ai-instruction Unposted transactions can still be edited
	 */
	async findUnposted(): Promise<MoneyWorksTransaction[]> {
		return this.findByStatus("U");
	}

	/**
	 * Find transactions by date range
	 *
	 * @param startDate - Start date (YYYYMMDD format)
	 * @param endDate - End date (YYYYMMDD format)
	 * @returns Array of transactions within date range
	 *
	 * @example
	 * ```typescript
	 * // Get transactions for November 2024
	 * const txns = await repo.findByDateRange("20241101", "20241130");
	 * ```
	 *
	 * @ai-instruction Uses TransDate field
	 */
	async findByDateRange(
		startDate: string,
		endDate: string,
	): Promise<MoneyWorksTransaction[]> {
		return this.find(`TransDate>="${startDate}" AND TransDate<="${endDate}"`);
	}

	/**
	 * Find transaction by our reference
	 *
	 * @param ourRef - Our reference number (invoice/receipt/cheque number)
	 * @returns Array of matching transactions (usually 1)
	 *
	 * @example
	 * ```typescript
	 * // Find invoice by number
	 * const invoice = await repo.findByOurRef("INV-00123");
	 * ```
	 *
	 * @ai-instruction OurRef is typically unique but not enforced
	 */
	async findByOurRef(ourRef: string): Promise<MoneyWorksTransaction[]> {
		return this.find(`OurRef="${ourRef}"`);
	}

	/**
	 * Find transactions by accounting period
	 *
	 * @param period - Period number (100 * year_number + period_number)
	 * @returns Array of transactions in that period
	 *
	 * @example
	 * ```typescript
	 * // Get transactions for period 1 of year 25
	 * const txns = await repo.findByPeriod(2501);
	 * ```
	 *
	 * @ai-instruction Period format: 100*year + period (e.g., 2501 = year 25, period 1)
	 */
	async findByPeriod(period: number): Promise<MoneyWorksTransaction[]> {
		return this.find(`Period=${period}`);
	}

	/**
	 * Find transactions by type and status
	 *
	 * @param type - Transaction type
	 * @param status - Transaction status
	 * @returns Array of matching transactions
	 *
	 * @example
	 * ```typescript
	 * // Get all unposted debtor invoices
	 * const drafts = await repo.findByTypeAndStatus("DII", "U");
	 * ```
	 */
	async findByTypeAndStatus(
		type: MoneyWorksTransactionType | string,
		status: MoneyWorksTransactionStatus | string,
	): Promise<MoneyWorksTransaction[]> {
		return this.find(`Type="${type}" AND Status="${status}"`);
	}

	/**
	 * Find transactions by type and name
	 *
	 * @param type - Transaction type
	 * @param nameCode - Customer/supplier code
	 * @returns Array of matching transactions
	 *
	 * @example
	 * ```typescript
	 * // Get all invoices for a customer
	 * const invoices = await repo.findByTypeAndNameCode("DII", "CUST001");
	 * ```
	 */
	async findByTypeAndNameCode(
		type: MoneyWorksTransactionType | string,
		nameCode: string,
	): Promise<MoneyWorksTransaction[]> {
		return this.find(`Type="${type}" AND NameCode="${nameCode}"`);
	}

	/**
	 * Find transactions on hold
	 *
	 * @returns Array of transactions with Hold=true
	 *
	 * @ai-instruction Held transactions won't be processed
	 */
	async findOnHold(): Promise<MoneyWorksTransaction[]> {
		return this.find("Hold=true");
	}

	/**
	 * Find recurring transaction templates
	 *
	 * @returns Array of recurring transaction templates
	 *
	 * @ai-instruction Recurring transactions are templates, not actual transactions
	 */
	async findRecurring(): Promise<MoneyWorksTransaction[]> {
		return this.find("Recurring=true");
	}

	/**
	 * Find outstanding invoices for a customer/supplier
	 *
	 * @param nameCode - Customer/supplier code
	 * @param isDebtor - true for debtor (customer), false for creditor (supplier)
	 * @returns Array of unpaid/partially paid invoices
	 *
	 * @example
	 * ```typescript
	 * // Get outstanding debtor invoices
	 * const outstanding = await repo.findOutstandingInvoices("CUST001", true);
	 * ```
	 */
	async findOutstandingInvoices(
		nameCode: string,
		isDebtor: boolean = true,
	): Promise<MoneyWorksTransaction[]> {
		const typePrefix = isDebtor ? "DI" : "CI";
		// Outstanding = Type ends with I (incomplete) - not fully paid
		return this.find(
			`NameCode="${nameCode}" AND Type CONTAINS "${typePrefix}" AND Type NOT CONTAINS "C"`,
		);
	}

	/**
	 * Search transactions by description
	 *
	 * @param searchText - Text to search for
	 * @returns Array of transactions with matching description
	 */
	async searchByDescription(
		searchText: string,
	): Promise<MoneyWorksTransaction[]> {
		return this.find(`Description CONTAINS "${searchText}"`);
	}
}
