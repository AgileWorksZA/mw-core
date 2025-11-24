/**
 * MoneyWorks Transaction Entity - Generated from Official Documentation
 * Source: https://cognito.co.nz/manual/moneyworks_appendix_transactions.html
 *
 * Represents financial transactions in MoneyWorks including invoices, payments, orders, and journals
 */

// ============================================================================
// ENUMS - Semantic Types from Documentation
// ============================================================================

/** Transaction type classification */
export enum TransactionType {
	/** Creditor invoice - fully paid */
	CreditorInvoiceComplete = "CIC",
	/** Creditor invoice - incomplete */
	CreditorInvoiceIncomplete = "CII",
	/** Cash payment/purchase */
	CashPayment = "CP",
	/** Cash payment for a creditor invoice */
	CashPaymentCreditor = "CPC",
	/** Returned refund to debtor */
	CashPaymentDebtorRefund = "CPD",
	/** Cash receipt/sale */
	CashReceipt = "CR",
	/** Receive refund from creditor */
	CashReceiptCreditorRefund = "CRC",
	/** Receipt for a debtor invoice */
	CashReceiptDebtor = "CRD",
	/** Debtor invoice - fully paid */
	DebtorInvoiceComplete = "DIC",
	/** Debtor invoice - incomplete */
	DebtorInvoiceIncomplete = "DII",
	/** General journal */
	GeneralJournal = "JN",
	/** Stock journal */
	StockJournal = "JNS",
	/** Purchase order (complete) - Bought */
	PurchaseOrderComplete = "POC",
	/** Purchase order (incomplete) */
	PurchaseOrderIncomplete = "POI",
	/** Quote */
	Quote = "QU",
	/** Sales order (complete) - Sold */
	SalesOrderComplete = "SOC",
	/** Sales order (incomplete) */
	SalesOrderIncomplete = "SOI",
}

/** Transaction status codes */
export enum TransactionStatus {
	/** Unposted transaction */
	Unposted = "U",
	/** Posted transaction */
	Posted = "P",
}

/** Payment method types */
export enum PaymentMethod {
	None = 0,
	Cash = 1,
	Cheque = 2,
	Electronic = 3,
	CreditCard = 4,
	UserDefined1 = 5,
	UserDefined2 = 6,
	UserDefined3 = 7,
}

/** Product pricing levels for transactions */
export enum ProductPricingLevel {
	A = "A",
	B = "B",
	C = "C",
	D = "D",
	E = "E",
	F = "F",
}

/** Transaction flags - bit-mapped field */
export enum TransactionFlags {
	/** Was cancelled */
	WasCancelled = 0x00000001,
	/** Is cancellation */
	IsCancellation = 0x00000002,
	/** Was written off */
	WasWrittenOff = 0x00000004,
	/** Creditor reimburse */
	CreditorReimburse = 0x00000008,
	/** Debtor reimburse */
	DebtorReimburse = 0x00000010,
	/** Printed */
	Printed = 0x00000020,
	/** Is writeoff dummy */
	IsWriteoffDummy = 0x00000040,
	/** Is contra dummy */
	IsContraDummy = 0x00000080,
	/** Not on statement */
	NotOnStatement = 0x00000800,
	/** Is banking journal */
	IsBankingJournal = 0x00001000,
	/** Is job invoice */
	IsJobInvoice = 0x00002000,
	/** Changed after posting */
	ChangedAfterPosting = 0x00004000,
	/** Prompt discount taken */
	PromptDiscountTaken = 0x00008000,
	/** Funds transfer */
	FundsTransfer = 0x00010000,
	/** Is discount credit note */
	IsDiscountCreditNote = 0x00020000,
	/** Is writeoff credit note */
	IsWriteoffCreditNote = 0x00040000,
	/** Is new style sales tax */
	IsNewStyleSalesTax = 0x00080000,
	/** Has scan */
	HasScan = 0x00100000,
	/** Has outstanding stock receipts */
	HasOutstandingStockReceipts = 0x00200000,
	/** PPD terms locked */
	PPDTermsLocked = 0x00400000,
	/** Is deposit on order */
	IsDepositOnOrder = 0x00800000,
	/** Imported transaction */
	ImportedTransaction = 0x01000000,
	/** Is a recurred transaction */
	IsRecurredTransaction = 0x08000000,
}

/** Journal type classification */
export enum JournalType {
	General = 0,
	Make = 1,
	Break = 2,
	WriteOff = 4,
	Create = 5,
	Transfer = 6,
	Revaluation = 7,
}

// ============================================================================
// MAIN INTERFACE
// ============================================================================

export interface Transaction {
	// Core identification fields
	/** Internal sequence number - unique identifier */
	SequenceNumber: number;

	/** Date and time the record was last modified */
	LastModifiedTime: string;

	/** The reference number of the transaction. Max 12 chars. */
	OurRef: string;

	/** The transaction date */
	TransDate: string;

	/** The date on which the transaction was entered */
	EnterDate: string;

	/** The date on which payment is due */
	DueDate: string;

	/** A number representing the period of the transaction */
	Period: number;

	/** The transaction type - see TransactionType enum. Max 4 chars. */
	Type: string;

	/** For debtor invoices, customer's Order No. For creditor invoices, supplier's invoice number. Max 32 chars. */
	TheirRef: string;

	/** Customer or Supplier Code. Max 12 chars. */
	NameCode: string;

	/** The flag field. Max 6 chars. */
	Flag: string;

	/** The description of the transaction. Max 1024 chars. */
	Description: string;

	/** The gross value of the transaction */
	Gross: number;

	/** The analysis field. Max 10 chars. */
	Analysis: string;

	/** For CP and CR transactions, bank account code. For invoices, control account. Max 8 chars. */
	Contra: string;

	/** For payment: To field. For receipt: From field. Max 256 chars. */
	ToFrom: string;

	/** Transaction status: "U" (unposted) or "P" (posted). Max 2 chars. */
	Status: string;

	/** True if the transaction is on hold */
	Hold: boolean;

	// Payment and Aging Information
	/** The date the last payment for an invoice was made */
	DatePaid: string;

	/** The amount of the invoice that has been paid */
	AmtPaid: number;

	/** The amount of the invoice you elect to pay a creditor in next payment run */
	PayAmount: number;

	/** The aging cycle for the transaction */
	Aging: number;

	/** The amount of GST involved for the transaction */
	TaxAmount: number;

	/** GST cycle number in which transaction was processed for GST */
	TaxCycle: number;

	/** True if the transaction is a recurring transaction */
	Recurring: boolean;

	/** 0 if not printed; 1 if printed */
	Printed: number;

	/** Transaction flags - see TransactionFlags enum */
	Flags: number;

	/** Internal tax processing indicator */
	TaxProcessed: number;

	// Sales and Personnel Information
	/** The salesperson for the transaction. Max 6 chars. */
	Salesperson: string;

	/** The colour, represented internally as numeric index 0-7 */
	Colour: number;

	/** Sequence number of journal which banked the receipt */
	BankJNSeq: number;

	/** Payment method: 0=None, 1=Cash, 2=Cheque, 3=Electronic, 4=Credit Card, 5-7=user defined */
	PaymentMethod: number;

	/** Date and time transaction is posted */
	TimePosted: string;

	/** The transaction's security level */
	SecurityLevel: number;

	// User Defined Fields
	/** User defined. Max 256 chars. */
	User1: string;

	/** User defined. Max 256 chars. */
	User2: string;

	/** User defined. Max 256 chars. */
	User3: string;

	/** The date the prompt payment discount expires */
	PromptPaymentDate: string;

	/** The amount of the eligible prompt payment discount */
	PromptPaymentAmt: number;

	/** Pricing code (A-F). Max 2 chars. */
	ProdPriceCode: string;

	// Address Information
	/** Transaction's mailing address. Blank if default from name. Max 256 chars. */
	MailingAddress: string;

	/** The delivery address for this transaction. Blank if default from name. Max 256 chars. */
	DeliveryAddress: string;

	// Freight Information
	/** Freight code used for orders. Max 32 chars. */
	FreightCode: string;

	/** Freight amount of order */
	FreightAmount: number;

	/** Details of freight for order. Max 256 chars. */
	FreightDetails: string;

	// Banking Information
	/** For receipts, the bank number of the cheque. Max 32 chars. */
	SpecialBank: string;

	/** For receipts, the branch of the cheque. Max 32 chars. */
	SpecialBranch: string;

	/** For receipts, the bank account of the cheque. Max 32 chars. */
	SpecialAccount: string;

	// Currency Information
	/** Currency code. Max 4 chars. */
	Currency: string;

	/** The exchange rate (0 for base currency transactions) */
	ExchangeRate: number;

	// Audit Information
	/** Initials of user who entered the transaction. Max 4 chars. */
	EnteredBy: string;

	/** Initials of user who posted the transaction. Max 4 chars. */
	PostedBy: string;

	// Order Information
	/** For invoices, the amount written off in a write-off */
	AmtWrittenOff: number;

	/** The total of the order */
	OrderTotal: number;

	/** The amount shipped of an order */
	OrderShipped: number;

	/** The accumulated deposit on an order */
	OrderDeposit: number;

	/** Sequence number of order that created invoice through ship or receive goods commands */
	OriginatingOrderSeq: number;

	/** Internal currency transfer sequence number */
	CurrencyTransferSeq: number;

	// Payment Terms
	/** Prompt payment terms */
	PromptPaymentTerms: number;

	/** Prompt payment discount percentage */
	PromptPaymentDisc: number;

	// Approval Information
	/** Initials of first user to approve transaction. Max 4 chars. */
	ApprovedBy1: string;

	/** Initials of second user to approve transaction. Max 4 chars. */
	ApprovedBy2: string;

	// Additional User Fields
	/** Scriptable number */
	UserNum: number;

	/** Scriptable text. Max 256 chars. */
	UserText: string;

	/** User defined. Max 16 chars. */
	User4: string;

	/** User defined. Max 16 chars. */
	User5: string;

	/** User defined. Max 16 chars. */
	User6: string;

	/** User defined. Max 16 chars. */
	User7: string;

	/** User defined. Max 16 chars. */
	User8: string;

	/** Scriptable tag storage. Max 256 chars. */
	TaggedText: string;

	/** Non zero if transaction has been emailed */
	Emailed: number;

	/** Non zero if transaction has been sent as eInvoice */
	Transferred: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Check if a transaction is posted */
export function isPosted(transaction: Transaction): boolean {
	return transaction.Status === TransactionStatus.Posted;
}

/** Check if a transaction is unposted */
export function isUnposted(transaction: Transaction): boolean {
	return transaction.Status === TransactionStatus.Unposted;
}

/** Check if a transaction is on hold */
export function isOnHold(transaction: Transaction): boolean {
	return transaction.Hold;
}

/** Check if a transaction is an invoice */
export function isInvoice(transaction: Transaction): boolean {
	return transaction.Type.startsWith("DI") || transaction.Type.startsWith("CI");
}

/** Check if a transaction is a cash transaction */
export function isCashTransaction(transaction: Transaction): boolean {
	return transaction.Type.startsWith("CP") || transaction.Type.startsWith("CR");
}

/** Check if a transaction is an order */
export function isOrder(transaction: Transaction): boolean {
	return transaction.Type.startsWith("PO") || transaction.Type.startsWith("SO");
}

/** Check if a transaction is a journal */
export function isJournal(transaction: Transaction): boolean {
	return transaction.Type.startsWith("JN");
}

/** Check if a transaction has a specific flag */
export function hasFlag(
	transaction: Transaction,
	flag: TransactionFlags,
): boolean {
	return (transaction.Flags & flag) !== 0;
}

/** Get human-readable transaction type */
export function getTransactionTypeLabel(type: TransactionType): string {
	switch (type) {
		case TransactionType.CashPayment:
			return "Cash Payment";
		case TransactionType.CashReceipt:
			return "Cash Receipt";
		case TransactionType.DebtorInvoiceComplete:
			return "Customer Invoice (Complete)";
		case TransactionType.DebtorInvoiceIncomplete:
			return "Customer Invoice (Incomplete)";
		case TransactionType.CreditorInvoiceComplete:
			return "Supplier Invoice (Complete)";
		case TransactionType.CreditorInvoiceIncomplete:
			return "Supplier Invoice (Incomplete)";
		case TransactionType.GeneralJournal:
			return "General Journal";
		case TransactionType.StockJournal:
			return "Stock Journal";
		case TransactionType.PurchaseOrderComplete:
			return "Purchase Order (Complete)";
		case TransactionType.PurchaseOrderIncomplete:
			return "Purchase Order (Incomplete)";
		case TransactionType.SalesOrderComplete:
			return "Sales Order (Complete)";
		case TransactionType.SalesOrderIncomplete:
			return "Sales Order (Incomplete)";
		case TransactionType.Quote:
			return "Quote";
		default:
			return "Unknown";
	}
}

/** Get human-readable payment method */
export function getPaymentMethodLabel(method: PaymentMethod): string {
	switch (method) {
		case PaymentMethod.None:
			return "None";
		case PaymentMethod.Cash:
			return "Cash";
		case PaymentMethod.Cheque:
			return "Cheque";
		case PaymentMethod.Electronic:
			return "Electronic";
		case PaymentMethod.CreditCard:
			return "Credit Card";
		case PaymentMethod.UserDefined1:
			return "User Defined 1";
		case PaymentMethod.UserDefined2:
			return "User Defined 2";
		case PaymentMethod.UserDefined3:
			return "User Defined 3";
		default:
			return "Unknown";
	}
}

/** Calculate outstanding amount for an invoice */
export function getOutstandingAmount(transaction: Transaction): number {
	if (!isInvoice(transaction)) {
		return 0;
	}
	return transaction.Gross - transaction.AmtPaid - transaction.AmtWrittenOff;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationError {
	field: string;
	message: string;
	value: any;
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
}

/** Validate a Transaction object against MoneyWorks constraints */
export function validateTransaction(
	transaction: Partial<Transaction>,
): ValidationResult {
	const errors: ValidationError[] = [];

	// Required fields
	if (!transaction.Type) {
		errors.push({
			field: "Type",
			message: "Transaction type is required",
			value: transaction.Type,
		});
	}

	if (!transaction.NameCode) {
		errors.push({
			field: "NameCode",
			message: "Name code is required",
			value: transaction.NameCode,
		});
	}

	if (!transaction.TransDate) {
		errors.push({
			field: "TransDate",
			message: "Transaction date is required",
			value: transaction.TransDate,
		});
	}

	// Field length validations
	if (transaction.OurRef && transaction.OurRef.length > 12) {
		errors.push({
			field: "OurRef",
			message: "OurRef cannot exceed 12 characters",
			value: transaction.OurRef,
		});
	}

	if (transaction.Type && transaction.Type.length > 4) {
		errors.push({
			field: "Type",
			message: "Type cannot exceed 4 characters",
			value: transaction.Type,
		});
	}

	if (transaction.TheirRef && transaction.TheirRef.length > 32) {
		errors.push({
			field: "TheirRef",
			message: "TheirRef cannot exceed 32 characters",
			value: transaction.TheirRef,
		});
	}

	if (transaction.NameCode && transaction.NameCode.length > 12) {
		errors.push({
			field: "NameCode",
			message: "NameCode cannot exceed 12 characters",
			value: transaction.NameCode,
		});
	}

	if (transaction.Description && transaction.Description.length > 1024) {
		errors.push({
			field: "Description",
			message: "Description cannot exceed 1024 characters",
			value: transaction.Description,
		});
	}

	// Enum validations
	if (
		transaction.Status &&
		![TransactionStatus.Unposted, TransactionStatus.Posted].includes(
			transaction.Status as TransactionStatus,
		)
	) {
		errors.push({
			field: "Status",
			message: "Invalid transaction status",
			value: transaction.Status,
		});
	}

	if (
		transaction.PaymentMethod !== undefined &&
		!Object.values(PaymentMethod).includes(transaction.PaymentMethod)
	) {
		errors.push({
			field: "PaymentMethod",
			message: "Invalid payment method",
			value: transaction.PaymentMethod,
		});
	}

	// Business logic validations
	if (
		transaction.Gross !== undefined &&
		transaction.Gross < 0 &&
		!isJournal(transaction as Transaction)
	) {
		errors.push({
			field: "Gross",
			message: "Gross amount cannot be negative for non-journal transactions",
			value: transaction.Gross,
		});
	}

	if (
		transaction.Period !== undefined &&
		(transaction.Period < 101 || transaction.Period > 9912)
	) {
		errors.push({
			field: "Period",
			message: "Period must be between 101 and 9912 (format: 100*year+period)",
			value: transaction.Period,
		});
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

// ============================================================================
// QUERY BUILDERS
// ============================================================================

export class TransactionQueryBuilder {
	private conditions: string[] = [];

	/** Filter by transaction type */
	type(type: TransactionType): this {
		this.conditions.push(`Type="${type}"`);
		return this;
	}

	/** Filter by transaction status */
	status(status: TransactionStatus): this {
		this.conditions.push(`Status="${status}"`);
		return this;
	}

	/** Filter by name code */
	nameCode(code: string): this {
		this.conditions.push(`NameCode="${code}"`);
		return this;
	}

	/** Filter by transaction reference */
	ourRef(ref: string): this {
		this.conditions.push(`OurRef="${ref}"`);
		return this;
	}

	/** Filter by date range */
	dateRange(from: string, to: string): this {
		this.conditions.push(`TransDate>="${from}" AND TransDate<="${to}"`);
		return this;
	}

	/** Filter by period */
	period(period: number): this {
		this.conditions.push(`Period=${period}`);
		return this;
	}

	/** Filter by hold status */
	onHold(hold = true): this {
		this.conditions.push(`Hold=${hold ? "True" : "False"}`);
		return this;
	}

	/** Filter posted transactions only */
	postedOnly(): this {
		this.conditions.push(`Status="P"`);
		return this;
	}

	/** Filter unposted transactions only */
	unpostedOnly(): this {
		this.conditions.push(`Status="U"`);
		return this;
	}

	/** Filter invoices only */
	invoicesOnly(): this {
		this.conditions.push(`(Type LIKE "DI%" OR Type LIKE "CI%")`);
		return this;
	}

	/** Filter cash transactions only */
	cashOnly(): this {
		this.conditions.push(`(Type LIKE "CP%" OR Type LIKE "CR%")`);
		return this;
	}

	/** Filter orders only */
	ordersOnly(): this {
		this.conditions.push(`(Type LIKE "PO%" OR Type LIKE "SO%")`);
		return this;
	}

	/** Filter by gross amount range */
	grossAmountRange(min: number, max: number): this {
		this.conditions.push(`Gross>=${min} AND Gross<=${max}`);
		return this;
	}

	/** Build the search expression */
	build(): string {
		return this.conditions.join(" AND ");
	}
}

/** Create a new transaction query builder */
export function queryTransactions(): TransactionQueryBuilder {
	return new TransactionQueryBuilder();
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/** Type guard to check if a transaction is a customer invoice */
export function isCustomerInvoice(
	transaction: Partial<Transaction>,
): transaction is Partial<Transaction> & { Type: string } {
	return transaction.Type?.startsWith("DI");
}

/** Type guard to check if a transaction is a supplier invoice */
export function isSupplierInvoice(
	transaction: Partial<Transaction>,
): transaction is Partial<Transaction> & { Type: string } {
	return transaction.Type?.startsWith("CI");
}

/** Type guard to check if a transaction has payment information */
export function hasPaymentInfo(
	transaction: Partial<Transaction>,
): transaction is Partial<Transaction> & { PaymentMethod: number } {
	return (
		transaction.PaymentMethod !== undefined &&
		transaction.PaymentMethod !== PaymentMethod.None
	);
}
