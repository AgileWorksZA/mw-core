/**
 * MoneyWorks Transactions Table Interface
 *
 * The Transactions file contains all financial transactions including invoices,
 * receipts, payments, journals, and orders. Each transaction has associated
 * detail lines that contain the actual account postings.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_transactions.html
 */

/**
 * Transaction type codes
 * @description Determines the type and behavior of the transaction
 */
export enum TransactionType {
	/** Cash payment/purchase */
	CashPayment = "CP",
	/** Cash receipt/sale */
	CashReceipt = "CR",
	/** Debtor invoice */
	DebtorInvoice = "DII",
	/** Debtor credit note */
	DebtorCredit = "DIC",
	/** Creditor invoice */
	CreditorInvoice = "CII",
	/** Creditor credit note */
	CreditorCredit = "CIC",
	/** General journal */
	Journal = "JN",
	/** Quote */
	Quote = "QU",
	/** Sales order */
	SalesOrder = "SO",
	/** Purchase order */
	PurchaseOrder = "PO",
	/** Stock transfer */
	StockTransfer = "ST",
	/** Stock adjustment */
	StockAdjustment = "SA",
	/** Build */
	Build = "BD",
}

/**
 * Transaction status codes
 * @description Current processing state of the transaction
 */
export enum TransactionStatus {
	/** Unposted - can be edited */
	Unposted = "U",
	/** Posted - locked for accounting */
	Posted = "P",
	/** Order status - pending */
	Pending = "O",
	/** Order status - completed */
	Completed = "C",
}

/**
 * MoneyWorks Transactions Table (Raw Interface)
 * @description Complete interface for the Transactions table with exact field names
 */
export interface Transaction {
	/**
	 * Unique transaction identifier
	 * @description Primary key - automatically assigned
	 * @readonly
	 */
	SequenceNumber: number;

	/**
	 * Transaction type code
	 * @maxLength 3
	 * @description Determines transaction behavior and available fields
	 */
	Type: TransactionType;

	/**
	 * Transaction status
	 * @maxLength 1
	 * @description Processing state of the transaction
	 * @default "U"
	 */
	Status: TransactionStatus;

	/**
	 * Transaction date
	 * @format date
	 * @description Date of the transaction
	 */
	TransDate: Date | string;

	/**
	 * Financial period
	 * @description Encoded as 100 * year + period (e.g., 2024 period 3 = 202403)
	 */
	Period: number;

	/**
	 * Transaction description
	 * @maxLength 1000
	 * @description Main description/narrative for the transaction
	 */
	Description?: string;

	/**
	 * Customer/Supplier code
	 * @maxLength 11
	 * @description Name code for AR/AP transactions
	 * @relationship References Name.Code
	 */
	NameCode?: string;

	/**
	 * Our reference
	 * @maxLength 11
	 * @description Internal reference number
	 */
	OurRef?: string;

	/**
	 * Their reference
	 * @maxLength 21
	 * @description External/customer reference
	 */
	TheirRef?: string;

	/**
	 * To/From description
	 * @maxLength 200
	 * @description Payment recipient or source
	 */
	ToFrom?: string;

	/**
	 * Gross amount
	 * @description Total transaction value including tax
	 */
	Gross?: number;

	/**
	 * Tax amount
	 * @description GST/VAT component
	 */
	TaxAmount?: number;

	/**
	 * Net amount
	 * @description Gross minus tax
	 * @readonly
	 */
	Net?: number;

	/**
	 * Amount paid
	 * @description For invoices - amount already paid
	 */
	AmtPaid?: number;

	/**
	 * Amount written off
	 * @description Bad debt write-off amount
	 */
	AmtWrittenOff?: number;

	/**
	 * Outstanding balance
	 * @description Gross - AmtPaid - AmtWrittenOff
	 * @readonly
	 */
	Balance?: number;

	/**
	 * Due date
	 * @format date
	 * @description Payment due date for invoices
	 */
	DueDate?: Date | string;

	/**
	 * Exchange rate
	 * @description Currency conversion rate
	 * @default 1
	 */
	ExchangeRate?: number;

	/**
	 * Currency code
	 * @maxLength 3
	 * @description Three-letter currency code
	 * @relationship References Currency.Code
	 */
	Currency?: string;

	/**
	 * Department code
	 * @maxLength 7
	 * @description Department assignment
	 * @relationship References Department.Code
	 */
	Department?: string;

	/**
	 * Bank account
	 * @maxLength 7
	 * @description For receipts/payments - bank account used
	 * @relationship References Account.Code
	 */
	BankAccount?: string;

	/**
	 * Hold status
	 * @description Transaction is on hold
	 * @default false
	 */
	Hold?: boolean;

	/**
	 * Recurring indicator
	 * @description Transaction is part of recurring batch
	 * @default false
	 */
	Recurring?: boolean;

	/**
	 * Printed status
	 * @description Number of times printed
	 * @default 0
	 */
	Printed?: number;

	/**
	 * Transferred status
	 * @description eInvoice transfer status
	 * @default 0
	 */
	Transferred?: number;

	/**
	 * Security level
	 * @description Access control level
	 */
	SecurityLevel?: number;

	/**
	 * Entered by
	 * @maxLength 3
	 * @description User initials who created transaction
	 * @relationship References User.Code
	 * @readonly
	 */
	EnteredBy?: string;

	/**
	 * Posted by
	 * @maxLength 3
	 * @description User initials who posted transaction
	 * @relationship References User.Code
	 * @readonly
	 */
	PostedBy?: string;

	/**
	 * Entry date
	 * @format date
	 * @description Date transaction was entered
	 * @readonly
	 */
	EnterDate?: Date | string;

	/**
	 * Time posted
	 * @format ISO 8601
	 * @description Timestamp when posted
	 * @readonly
	 */
	TimePosted?: string;

	/**
	 * Creation timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	Created?: string;

	/**
	 * Last modification timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	LastModifiedTime?: string;

	/**
	 * User who last modified
	 * @readonly
	 */
	ModUser?: string;

	/**
	 * Status flags
	 * @description Bitwise flags for various status indicators
	 * @see transactionHelpers.decodeFlags
	 */
	Flags?: number;

	/**
	 * User-defined field 1
	 * @maxLength 255
	 */
	User1?: string;

	/**
	 * User-defined field 2
	 * @maxLength 255
	 */
	User2?: string;

	/**
	 * User-defined field 3
	 * @maxLength 255
	 */
	User3?: string;

	/**
	 * User-defined field 4
	 * @maxLength 255
	 */
	User4?: string;

	/**
	 * User-defined field 5
	 * @maxLength 255
	 */
	User5?: string;

	/**
	 * User-defined field 6
	 * @maxLength 255
	 */
	User6?: string;

	/**
	 * User-defined field 7
	 * @maxLength 255
	 */
	User7?: string;

	/**
	 * User-defined field 8
	 * @maxLength 255
	 */
	User8?: string;

	/**
	 * User-defined text field
	 * @maxLength 255
	 * @description Scriptable text field
	 */
	UserText?: string;

	/**
	 * User-defined numeric field
	 * @description Scriptable numeric field
	 */
	UserNum?: number;
}

/**
 * MoneyWorks Transactions Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface TransactionCamel {
	/**
	 * Unique transaction identifier
	 * @description Primary key - automatically assigned
	 * @readonly
	 */
	sequenceNumber: number;

	/**
	 * Transaction type code
	 * @maxLength 3
	 * @description Determines transaction behavior and available fields
	 */
	type: TransactionType;

	/**
	 * Transaction status
	 * @maxLength 1
	 * @description Processing state of the transaction
	 * @default "U"
	 */
	status: TransactionStatus;

	/**
	 * Transaction date
	 * @format date
	 * @description Date of the transaction
	 */
	transDate: Date | string;

	/**
	 * Financial period
	 * @description Encoded as 100 * year + period (e.g., 2024 period 3 = 202403)
	 */
	period: number;

	/**
	 * Transaction description
	 * @maxLength 1000
	 * @description Main description/narrative for the transaction
	 */
	description?: string;

	/**
	 * Customer/Supplier code
	 * @maxLength 11
	 * @description Name code for AR/AP transactions
	 * @relationship References Name.Code
	 */
	nameCode?: string;

	/**
	 * Our reference
	 * @maxLength 11
	 * @description Internal reference number
	 */
	ourRef?: string;

	/**
	 * Their reference
	 * @maxLength 21
	 * @description External/customer reference
	 */
	theirRef?: string;

	/**
	 * To/From description
	 * @maxLength 200
	 * @description Payment recipient or source
	 */
	toFrom?: string;

	/**
	 * Gross amount
	 * @description Total transaction value including tax
	 */
	gross?: number;

	/**
	 * Tax amount
	 * @description GST/VAT component
	 */
	taxAmount?: number;

	/**
	 * Net amount
	 * @description Gross minus tax
	 * @readonly
	 */
	net?: number;

	/**
	 * Amount paid
	 * @description For invoices - amount already paid
	 */
	amtPaid?: number;

	/**
	 * Amount written off
	 * @description Bad debt write-off amount
	 */
	amtWrittenOff?: number;

	/**
	 * Outstanding balance
	 * @description Gross - AmtPaid - AmtWrittenOff
	 * @readonly
	 */
	balance?: number;

	/**
	 * Due date
	 * @format date
	 * @description Payment due date for invoices
	 */
	dueDate?: Date | string;

	/**
	 * Exchange rate
	 * @description Currency conversion rate
	 * @default 1
	 */
	exchangeRate?: number;

	/**
	 * Currency code
	 * @maxLength 3
	 * @description Three-letter currency code
	 * @relationship References Currency.Code
	 */
	currency?: string;

	/**
	 * Department code
	 * @maxLength 7
	 * @description Department assignment
	 * @relationship References Department.Code
	 */
	department?: string;

	/**
	 * Bank account
	 * @maxLength 7
	 * @description For receipts/payments - bank account used
	 * @relationship References Account.Code
	 */
	bankAccount?: string;

	/**
	 * Hold status
	 * @description Transaction is on hold
	 * @default false
	 */
	hold?: boolean;

	/**
	 * Recurring indicator
	 * @description Transaction is part of recurring batch
	 * @default false
	 */
	recurring?: boolean;

	/**
	 * Printed status
	 * @description Number of times printed
	 * @default 0
	 */
	printed?: number;

	/**
	 * Transferred status
	 * @description eInvoice transfer status
	 * @default 0
	 */
	transferred?: number;

	/**
	 * Security level
	 * @description Access control level
	 */
	securityLevel?: number;

	/**
	 * Entered by
	 * @maxLength 3
	 * @description User initials who created transaction
	 * @relationship References User.Code
	 * @readonly
	 */
	enteredBy?: string;

	/**
	 * Posted by
	 * @maxLength 3
	 * @description User initials who posted transaction
	 * @relationship References User.Code
	 * @readonly
	 */
	postedBy?: string;

	/**
	 * Entry date
	 * @format date
	 * @description Date transaction was entered
	 * @readonly
	 */
	enterDate?: Date | string;

	/**
	 * Time posted
	 * @format ISO 8601
	 * @description Timestamp when posted
	 * @readonly
	 */
	timePosted?: string;

	/**
	 * Creation timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	created?: string;

	/**
	 * Last modification timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	lastModifiedTime?: string;

	/**
	 * User who last modified
	 * @readonly
	 */
	modUser?: string;

	/**
	 * Status flags
	 * @description Bitwise flags for various status indicators
	 * @see transactionHelpers.decodeFlags
	 */
	flags?: number;

	/**
	 * User-defined field 1
	 * @maxLength 255
	 */
	user1?: string;

	/**
	 * User-defined field 2
	 * @maxLength 255
	 */
	user2?: string;

	/**
	 * User-defined field 3
	 * @maxLength 255
	 */
	user3?: string;

	/**
	 * User-defined field 4
	 * @maxLength 255
	 */
	user4?: string;

	/**
	 * User-defined field 5
	 * @maxLength 255
	 */
	user5?: string;

	/**
	 * User-defined field 6
	 * @maxLength 255
	 */
	user6?: string;

	/**
	 * User-defined field 7
	 * @maxLength 255
	 */
	user7?: string;

	/**
	 * User-defined field 8
	 * @maxLength 255
	 */
	user8?: string;

	/**
	 * User-defined text field
	 * @maxLength 255
	 * @description Scriptable text field
	 */
	userText?: string;

	/**
	 * User-defined numeric field
	 * @description Scriptable numeric field
	 */
	userNum?: number;
}

/**
 * Transaction flags interface
 * @description Decoded representation of the flags field
 */
export interface TransactionFlags {
	/** Transaction has been reconciled */
	reconciled: boolean;
	/** Transaction has attachments */
	hasAttachments: boolean;
	/** Transaction is approved */
	approved: boolean;
	/** Transaction needs approval */
	needsApproval: boolean;
	/** Transaction has been exported */
	exported: boolean;
	/** Transaction is locked */
	locked: boolean;
}

/**
 * Converter utilities for Transactions table
 */
export const transactionConverters = {
	/**
	 * Convert from MoneyWorks PascalCase to camelCase
	 */
	toCamelCase(raw: Transaction): TransactionCamel {
		return {
			sequenceNumber: raw.SequenceNumber,
			type: raw.Type,
			status: raw.Status,
			transDate: raw.TransDate,
			period: raw.Period,
			description: raw.Description,
			nameCode: raw.NameCode,
			ourRef: raw.OurRef,
			theirRef: raw.TheirRef,
			toFrom: raw.ToFrom,
			gross: raw.Gross,
			taxAmount: raw.TaxAmount,
			net: raw.Net,
			amtPaid: raw.AmtPaid,
			amtWrittenOff: raw.AmtWrittenOff,
			balance: raw.Balance,
			dueDate: raw.DueDate,
			exchangeRate: raw.ExchangeRate,
			currency: raw.Currency,
			department: raw.Department,
			bankAccount: raw.BankAccount,
			hold: raw.Hold,
			recurring: raw.Recurring,
			printed: raw.Printed,
			transferred: raw.Transferred,
			securityLevel: raw.SecurityLevel,
			enteredBy: raw.EnteredBy,
			postedBy: raw.PostedBy,
			enterDate: raw.EnterDate,
			timePosted: raw.TimePosted,
			created: raw.Created,
			lastModifiedTime: raw.LastModifiedTime,
			modUser: raw.ModUser,
			flags: raw.Flags,
			user1: raw.User1,
			user2: raw.User2,
			user3: raw.User3,
			user4: raw.User4,
			user5: raw.User5,
			user6: raw.User6,
			user7: raw.User7,
			user8: raw.User8,
			userText: raw.UserText,
			userNum: raw.UserNum,
		};
	},

	/**
	 * Convert from camelCase to MoneyWorks PascalCase
	 */
	fromCamelCase(camel: TransactionCamel): Transaction {
		return {
			SequenceNumber: camel.sequenceNumber,
			Type: camel.type,
			Status: camel.status,
			TransDate: camel.transDate,
			Period: camel.period,
			Description: camel.description,
			NameCode: camel.nameCode,
			OurRef: camel.ourRef,
			TheirRef: camel.theirRef,
			ToFrom: camel.toFrom,
			Gross: camel.gross,
			TaxAmount: camel.taxAmount,
			Net: camel.net,
			AmtPaid: camel.amtPaid,
			AmtWrittenOff: camel.amtWrittenOff,
			Balance: camel.balance,
			DueDate: camel.dueDate,
			ExchangeRate: camel.exchangeRate,
			Currency: camel.currency,
			Department: camel.department,
			BankAccount: camel.bankAccount,
			Hold: camel.hold,
			Recurring: camel.recurring,
			Printed: camel.printed,
			Transferred: camel.transferred,
			SecurityLevel: camel.securityLevel,
			EnteredBy: camel.enteredBy,
			PostedBy: camel.postedBy,
			EnterDate: camel.enterDate,
			TimePosted: camel.timePosted,
			Created: camel.created,
			LastModifiedTime: camel.lastModifiedTime,
			ModUser: camel.modUser,
			Flags: camel.flags,
			User1: camel.user1,
			User2: camel.user2,
			User3: camel.user3,
			User4: camel.user4,
			User5: camel.user5,
			User6: camel.user6,
			User7: camel.user7,
			User8: camel.user8,
			UserText: camel.userText,
			UserNum: camel.userNum,
		};
	},
};

/**
 * Helper functions for Transactions table
 */
export const transactionHelpers = {
	/**
	 * Decode bitwise flags field into boolean properties
	 * @param flags - The numeric flags value from MoneyWorks
	 * @returns Object with individual flag states
	 */
	decodeFlags(flags: number): TransactionFlags {
		return {
			reconciled: (flags & 0x0001) !== 0,
			hasAttachments: (flags & 0x0002) !== 0,
			approved: (flags & 0x0004) !== 0,
			needsApproval: (flags & 0x0008) !== 0,
			exported: (flags & 0x0010) !== 0,
			locked: (flags & 0x0020) !== 0,
		};
	},

	/**
	 * Encode boolean flags into bitwise numeric value
	 * @param flags - Object with individual flag states
	 * @returns Numeric value for MoneyWorks flags field
	 */
	encodeFlags(flags: TransactionFlags): number {
		let result = 0;
		if (flags.reconciled) result |= 0x0001;
		if (flags.hasAttachments) result |= 0x0002;
		if (flags.approved) result |= 0x0004;
		if (flags.needsApproval) result |= 0x0008;
		if (flags.exported) result |= 0x0010;
		if (flags.locked) result |= 0x0020;
		return result;
	},

	/**
	 * Check if transaction is posted
	 * @param status - The transaction status
	 * @returns True if the transaction is posted
	 */
	isPosted(status: TransactionStatus): boolean {
		return status === TransactionStatus.Posted;
	},

	/**
	 * Check if transaction is an invoice
	 * @param type - The transaction type
	 * @returns True if the transaction is any type of invoice
	 */
	isInvoice(type: TransactionType): boolean {
		return [
			TransactionType.DebtorInvoice,
			TransactionType.DebtorCredit,
			TransactionType.CreditorInvoice,
			TransactionType.CreditorCredit,
		].includes(type);
	},

	/**
	 * Check if transaction is a payment
	 * @param type - The transaction type
	 * @returns True if the transaction is a payment or receipt
	 */
	isPayment(type: TransactionType): boolean {
		return (
			type === TransactionType.CashPayment ||
			type === TransactionType.CashReceipt
		);
	},

	/**
	 * Check if transaction is an order
	 * @param type - The transaction type
	 * @returns True if the transaction is an order or quote
	 */
	isOrder(type: TransactionType): boolean {
		return [
			TransactionType.Quote,
			TransactionType.SalesOrder,
			TransactionType.PurchaseOrder,
		].includes(type);
	},

	/**
	 * Encode period from year and period number
	 * @param year - The year (e.g., 2024)
	 * @param period - The period number (1-12)
	 * @returns Encoded period value
	 */
	encodePeriod(year: number, period: number): number {
		const yearNumber = year % 100; // Get last 2 digits
		return 100 * yearNumber + period;
	},

	/**
	 * Decode period into year and period number
	 * @param encoded - The encoded period value
	 * @returns Object with year and period
	 */
	decodePeriod(encoded: number): { year: number; period: number } {
		const period = encoded % 100;
		const yearNumber = Math.floor(encoded / 100);
		// Assume 2000s for year numbers < 50, 1900s otherwise
		const year = yearNumber < 50 ? 2000 + yearNumber : 1900 + yearNumber;
		return { year, period };
	},

	/**
	 * Calculate net amount from gross and tax
	 * @param gross - The gross amount
	 * @param tax - The tax amount
	 * @returns Net amount
	 */
	calculateNet(gross: number, tax: number): number {
		return gross - tax;
	},

	/**
	 * Calculate outstanding balance
	 * @param gross - The gross amount
	 * @param paid - Amount paid
	 * @param writtenOff - Amount written off
	 * @returns Outstanding balance
	 */
	calculateBalance(gross: number, paid = 0, writtenOff = 0): number {
		return gross - paid - writtenOff;
	},
};
