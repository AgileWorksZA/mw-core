/**
 * MoneyWorks Transaction Enumerations
 *
 * @moneyworks-entity Transaction
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks transactions
 * @ai-critical NEVER create your own transaction-related enums or use generic terms
 *
 * Source: MoneyWorks Manual - moneyworks_appendix_transactions.html
 */

/**
 * MoneyWorks canonical transaction type classification
 * Source: moneyworks_appendix_transactions.html - Transaction type codes table
 *
 * 17 canonical transaction types covering all business scenarios:
 * - Cash transactions (CR, CP)
 * - Invoice transactions (DI, CI)
 * - Orders (SO, PO)
 * - Journals (JN, JNS)
 * - Quote (QU)
 *
 * @ai-instruction Use these exact codes when creating/querying transactions
 * @ai-critical NEVER translate to generic terms like "invoice" or "payment"
 */
export enum MoneyWorksTransactionType {
	/** Creditor invoice--fully paid */
	CREDITOR_INVOICE_COMPLETE = "CIC",

	/** Creditor invoice--incomplete (awaiting payment) */
	CREDITOR_INVOICE_INCOMPLETE = "CII",

	/** Cash payment/purchase */
	CASH_PAYMENT = "CP",

	/** Cash payment for a creditor invoice */
	CASH_PAYMENT_CREDITOR = "CPC",

	/** Returned refund to debtor */
	CASH_PAYMENT_DEBTOR_REFUND = "CPD",

	/** Cash receipt/sale */
	CASH_RECEIPT = "CR",

	/** Receive refund from creditor */
	CASH_RECEIPT_CREDITOR_REFUND = "CRC",

	/** Receipt for a debtor invoice */
	CASH_RECEIPT_DEBTOR = "CRD",

	/** Debtor invoice--fully paid */
	DEBTOR_INVOICE_COMPLETE = "DIC",

	/** Debtor invoice--incomplete (awaiting payment) */
	DEBTOR_INVOICE_INCOMPLETE = "DII",

	/** General journal */
	GENERAL_JOURNAL = "JN",

	/** Stock journal */
	STOCK_JOURNAL = "JNS",

	/** Purchase order (complete) = Bought */
	PURCHASE_ORDER_COMPLETE = "POC",

	/** Purchase order (incomplete) */
	PURCHASE_ORDER_INCOMPLETE = "POI",

	/** Quote */
	QUOTE = "QU",

	/** Sales order (complete) = Sold */
	SALES_ORDER_COMPLETE = "SOC",

	/** Sales order (incomplete) */
	SALES_ORDER_INCOMPLETE = "SOI",
}

/**
 * All valid transaction type codes as array
 * @ai-instruction Use for validation
 */
export const TRANSACTION_TYPE_CODES = [
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
] as const;

/**
 * MoneyWorks canonical transaction status classification
 * Source: moneyworks_appendix_transactions.html - Status field
 *
 * @ai-instruction Status determines if transaction affects accounting
 * @ai-critical Only posted (P) transactions impact financial reports
 */
export enum MoneyWorksTransactionStatus {
	/** Unposted transaction - can be edited, doesn't affect accounting */
	UNPOSTED = "U",

	/** Posted transaction - locked, affects accounting */
	POSTED = "P",
}

/**
 * MoneyWorks canonical payment method classification
 * Source: moneyworks_appendix_transactions.html - PaymentMethod field
 *
 * @ai-instruction Use for cash receipt/payment transactions
 * @ai-context Values 5-7 are user-definable
 */
export enum MoneyWorksPaymentMethod {
	/** None */
	NONE = 0,

	/** Cash */
	CASH = 1,

	/** Cheque */
	CHEQUE = 2,

	/** Electronic (EFT, BACS, etc.) */
	ELECTRONIC = 3,

	/** Credit Card */
	CREDIT_CARD = 4,

	/** User defined 1 */
	USER_DEFINED_1 = 5,

	/** User defined 2 */
	USER_DEFINED_2 = 6,

	/** User defined 3 */
	USER_DEFINED_3 = 7,
}

/**
 * MoneyWorks canonical transaction flags - bit-mapped
 * Source: moneyworks_appendix_transactions.html - Transaction Flags table
 *
 * @ai-instruction Use bitwise operations to check/set flags
 * @ai-critical Flags is a 32-bit integer field
 */
export enum MoneyWorksTransactionFlags {
	/** Was Cancelled */
	WAS_CANCELLED = 0x00000001,

	/** Is Cancellation transaction */
	IS_CANCELLATION = 0x00000002,

	/** Was Written Off */
	WAS_WRITTEN_OFF = 0x00000004,

	/** Creditor Reimburse */
	CREDITOR_REIMBURSE = 0x00000008,

	/** Debtor Reimburse */
	DEBTOR_REIMBURSE = 0x00000010,

	/** Printed */
	PRINTED = 0x00000020,

	/** Is WriteOff Dummy */
	IS_WRITEOFF_DUMMY = 0x00000040,

	/** Is Contra Dummy */
	IS_CONTRA_DUMMY = 0x00000080,

	/** Not On Statement */
	NOT_ON_STATEMENT = 0x00000800,

	/** Is Banking Journal */
	IS_BANKING_JOURNAL = 0x00001000,

	/** Is Job Invoice */
	IS_JOB_INVOICE = 0x00002000,

	/** Changed After Posting */
	CHANGED_AFTER_POSTING = 0x00004000,

	/** Prompt Discount Taken */
	PROMPT_DISCOUNT_TAKEN = 0x00008000,

	/** Funds Transfer */
	FUNDS_XFER = 0x00010000,

	/** Is Discount Credit Note */
	IS_DISCOUNT_CREDIT_NOTE = 0x00020000,

	/** Is Writeoff Credit Note */
	IS_WRITEOFF_CREDIT_NOTE = 0x00040000,

	/** Is New Style Sales Tax */
	IS_NEW_STYLE_SALES_TAX = 0x00080000,

	/** Has Scan */
	HAS_SCAN = 0x00100000,

	/** Has Outstanding Stock Receipts */
	HAS_OUTSTANDING_STOCK_RECEIPTS = 0x00200000,

	/** PPD Terms Locked */
	PPD_TERMS_LOCKED = 0x00400000,

	/** Is Deposit on Order */
	IS_DEPOSIT_ON_ORDER = 0x00800000,

	/** Imported transaction */
	IMPORTED_TRANSACTION = 0x01000000,

	/** Is a recurred transaction */
	IS_RECURRED_TRANSACTION = 0x08000000,
}

// =============================================================================
// VALIDATION AND HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a string is a valid MoneyWorks transaction type code
 *
 * @param type - The type code to validate
 * @returns true if valid MoneyWorks transaction type
 *
 * @example
 * ```typescript
 * isValidTransactionType("DII") // true
 * isValidTransactionType("INV") // false
 * ```
 *
 * @ai-instruction Use for input validation before creating transactions
 */
export function isValidTransactionType(type: string): type is MoneyWorksTransactionType {
	return TRANSACTION_TYPE_CODES.includes(type as any);
}

/**
 * Get human-readable description for a transaction type
 *
 * @param type - The transaction type code
 * @returns Description string
 *
 * @example
 * ```typescript
 * getTransactionTypeDescription("DII") // "Debtor Invoice (Incomplete)"
 * ```
 */
export function getTransactionTypeDescription(type: MoneyWorksTransactionType | string): string {
	const descriptions: Record<string, string> = {
		[MoneyWorksTransactionType.CREDITOR_INVOICE_COMPLETE]: "Creditor Invoice (Complete)",
		[MoneyWorksTransactionType.CREDITOR_INVOICE_INCOMPLETE]: "Creditor Invoice (Incomplete)",
		[MoneyWorksTransactionType.CASH_PAYMENT]: "Cash Payment/Purchase",
		[MoneyWorksTransactionType.CASH_PAYMENT_CREDITOR]: "Cash Payment for Creditor Invoice",
		[MoneyWorksTransactionType.CASH_PAYMENT_DEBTOR_REFUND]: "Cash Refund to Debtor",
		[MoneyWorksTransactionType.CASH_RECEIPT]: "Cash Receipt/Sale",
		[MoneyWorksTransactionType.CASH_RECEIPT_CREDITOR_REFUND]: "Cash Refund from Creditor",
		[MoneyWorksTransactionType.CASH_RECEIPT_DEBTOR]: "Cash Receipt for Debtor Invoice",
		[MoneyWorksTransactionType.DEBTOR_INVOICE_COMPLETE]: "Debtor Invoice (Complete)",
		[MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE]: "Debtor Invoice (Incomplete)",
		[MoneyWorksTransactionType.GENERAL_JOURNAL]: "General Journal",
		[MoneyWorksTransactionType.STOCK_JOURNAL]: "Stock Journal",
		[MoneyWorksTransactionType.PURCHASE_ORDER_COMPLETE]: "Purchase Order (Complete)",
		[MoneyWorksTransactionType.PURCHASE_ORDER_INCOMPLETE]: "Purchase Order (Incomplete)",
		[MoneyWorksTransactionType.QUOTE]: "Quote",
		[MoneyWorksTransactionType.SALES_ORDER_COMPLETE]: "Sales Order (Complete)",
		[MoneyWorksTransactionType.SALES_ORDER_INCOMPLETE]: "Sales Order (Incomplete)",
	};
	return descriptions[type] || `Unknown Type: ${type}`;
}

/**
 * Determine if transaction type creates receivable (debtor owing money)
 *
 * @param type - The transaction type
 * @returns true if transaction creates a receivable
 *
 * @ai-instruction Receivable transactions affect Accounts Receivable
 */
export function isReceivableTransaction(type: MoneyWorksTransactionType | string): boolean {
	return [
		MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE,
		MoneyWorksTransactionType.DEBTOR_INVOICE_COMPLETE,
		MoneyWorksTransactionType.SALES_ORDER_INCOMPLETE,
		MoneyWorksTransactionType.SALES_ORDER_COMPLETE,
	].includes(type as MoneyWorksTransactionType);
}

/**
 * Determine if transaction type creates payable (creditor owed money)
 *
 * @param type - The transaction type
 * @returns true if transaction creates a payable
 *
 * @ai-instruction Payable transactions affect Accounts Payable
 */
export function isPayableTransaction(type: MoneyWorksTransactionType | string): boolean {
	return [
		MoneyWorksTransactionType.CREDITOR_INVOICE_INCOMPLETE,
		MoneyWorksTransactionType.CREDITOR_INVOICE_COMPLETE,
		MoneyWorksTransactionType.PURCHASE_ORDER_INCOMPLETE,
		MoneyWorksTransactionType.PURCHASE_ORDER_COMPLETE,
	].includes(type as MoneyWorksTransactionType);
}

/**
 * Determine if transaction type involves cash movement
 *
 * @param type - The transaction type
 * @returns true if transaction involves cash/bank account
 *
 * @ai-instruction Cash transactions affect bank accounts directly
 */
export function isCashTransaction(type: MoneyWorksTransactionType | string): boolean {
	return [
		MoneyWorksTransactionType.CASH_RECEIPT,
		MoneyWorksTransactionType.CASH_PAYMENT,
		MoneyWorksTransactionType.CASH_RECEIPT_DEBTOR,
		MoneyWorksTransactionType.CASH_PAYMENT_CREDITOR,
		MoneyWorksTransactionType.CASH_RECEIPT_CREDITOR_REFUND,
		MoneyWorksTransactionType.CASH_PAYMENT_DEBTOR_REFUND,
	].includes(type as MoneyWorksTransactionType);
}

/**
 * Determine if transaction type is a journal entry
 *
 * @param type - The transaction type
 * @returns true if transaction is a journal
 */
export function isJournalTransaction(type: MoneyWorksTransactionType | string): boolean {
	return [
		MoneyWorksTransactionType.GENERAL_JOURNAL,
		MoneyWorksTransactionType.STOCK_JOURNAL,
	].includes(type as MoneyWorksTransactionType);
}

/**
 * Determine if transaction type is an order (not yet invoiced)
 *
 * @param type - The transaction type
 * @returns true if transaction is an order
 */
export function isOrderTransaction(type: MoneyWorksTransactionType | string): boolean {
	return [
		MoneyWorksTransactionType.SALES_ORDER_INCOMPLETE,
		MoneyWorksTransactionType.SALES_ORDER_COMPLETE,
		MoneyWorksTransactionType.PURCHASE_ORDER_INCOMPLETE,
		MoneyWorksTransactionType.PURCHASE_ORDER_COMPLETE,
		MoneyWorksTransactionType.QUOTE,
	].includes(type as MoneyWorksTransactionType);
}

/**
 * Get the base type prefix (2 chars) for a transaction type
 *
 * @param type - The full transaction type code
 * @returns 2-character base type (CP, CR, CI, DI, JN, PO, SO, QU)
 *
 * @example
 * ```typescript
 * getBaseType("DII") // "DI"
 * getBaseType("CRD") // "CR"
 * ```
 */
export function getBaseType(type: MoneyWorksTransactionType | string): string {
	return type.substring(0, 2);
}

/**
 * Check if a transaction has a specific flag set
 *
 * @param flags - The Flags field value
 * @param flag - The flag to check for
 * @returns true if flag is set
 *
 * @example
 * ```typescript
 * hasTransactionFlag(transaction.Flags, MoneyWorksTransactionFlags.PRINTED)
 * ```
 */
export function hasTransactionFlag(flags: number, flag: MoneyWorksTransactionFlags): boolean {
	return (flags & flag) !== 0;
}

/**
 * Decode transaction flags into array of flag names
 *
 * @param flags - The Flags field value
 * @returns Array of flag names that are set
 */
export function decodeTransactionFlags(flags: number): string[] {
	const result: string[] = [];
	const flagEntries = Object.entries(MoneyWorksTransactionFlags).filter(
		([key, value]) => typeof value === "number"
	);

	for (const [name, value] of flagEntries) {
		if (typeof value === "number" && (flags & value) !== 0) {
			result.push(name);
		}
	}

	return result;
}

/**
 * Get payment method description
 *
 * @param method - The payment method value
 * @returns Description string
 */
export function getPaymentMethodDescription(method: MoneyWorksPaymentMethod | number): string {
	const descriptions: Record<number, string> = {
		[MoneyWorksPaymentMethod.NONE]: "None",
		[MoneyWorksPaymentMethod.CASH]: "Cash",
		[MoneyWorksPaymentMethod.CHEQUE]: "Cheque",
		[MoneyWorksPaymentMethod.ELECTRONIC]: "Electronic",
		[MoneyWorksPaymentMethod.CREDIT_CARD]: "Credit Card",
		[MoneyWorksPaymentMethod.USER_DEFINED_1]: "User Defined 1",
		[MoneyWorksPaymentMethod.USER_DEFINED_2]: "User Defined 2",
		[MoneyWorksPaymentMethod.USER_DEFINED_3]: "User Defined 3",
	};
	return descriptions[method] || `Unknown Method: ${method}`;
}
