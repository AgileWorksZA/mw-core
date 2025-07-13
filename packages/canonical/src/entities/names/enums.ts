/**
 * MoneyWorks Names Entity - Canonical Enumerations
 *
 * PURE MoneyWorks enumerations preserving exact values and terminology
 * Source: MoneyWorks Manual - Names Field Descriptions
 *
 * @ai-instruction These enums represent MoneyWorks' canonical values. NEVER change.
 * @ai-critical Customer vs Debtor and Supplier vs Creditor are DIFFERENT in MW!
 */

/**
 * MoneyWorks Customer Type Classification
 *
 * @ai-critical In MoneyWorks:
 * - Customer: Can make purchases, basic sales functionality
 * - Debtor: Has receivables, credit limits, aging, full AR features
 * - Debtor is MORE SPECIFIC than Customer
 */
export enum MoneyWorksCustomerType {
	/** Not a customer - cannot appear in sales transactions */
	NOT_CUSTOMER = 0,

	/** Customer - can make purchases, appears in sales */
	CUSTOMER = 1,

	/** Debtor - full AR functionality, credit management, aging */
	DEBTOR = 2,
}

/**
 * MoneyWorks Supplier Type Classification
 *
 * @ai-critical In MoneyWorks:
 * - Supplier: Can provide goods/services, basic purchase functionality
 * - Creditor: Has payables, payment terms, aging, full AP features
 * - Creditor is MORE SPECIFIC than Supplier
 */
export enum MoneyWorksSupplierType {
	/** Not a supplier - cannot appear in purchase transactions */
	NOT_SUPPLIER = 0,

	/** Supplier - can provide goods/services, appears in purchases */
	SUPPLIER = 1,

	/** Creditor - full AP functionality, payment management, aging */
	CREDITOR = 2,
}

/**
 * MoneyWorks Name Kind Classification
 */
export enum MoneyWorksNameKind {
	/** Template name - used as basis for creating new names */
	TEMPLATE = 0,

	/** Normal name - regular business entity */
	NORMAL = 1,
}

/**
 * MoneyWorks Payment Methods
 *
 * @ai-instruction Manual indicates "etc" - more values may exist
 * @todo Complete list from MoneyWorks PaymentMethods table
 */
export enum MoneyWorksPaymentMethod {
	/** No payment method specified */
	NONE = 0,

	/** Cash payment */
	CASH = 1,

	/** Cheque payment */
	CHEQUE = 2,

	/** Electronic/bank transfer */
	ELECTRONIC = 3,
}

/**
 * MoneyWorks Product Pricing Levels
 * Used to determine which price level applies to a customer
 */
export enum MoneyWorksProductPricingLevel {
	/** Price level A */
	A = "A",

	/** Price level B */
	B = "B",

	/** Price level C */
	C = "C",

	/** Price level D */
	D = "D",

	/** Price level E */
	E = "E",

	/** Price level F */
	F = "F",
}

/**
 * MoneyWorks Name Flags (bit-mapped)
 *
 * @ai-instruction Use bitwise operations to check/set flags
 */
export enum MoneyWorksNameFlags {
	/** Requires order number on transactions */
	REQUIRES_ORDER_NUMBER = 0x0001,
}

/**
 * MoneyWorks Contact Roles (bit-mapped)
 *
 * @ai-instruction These are bit flags - a contact can have multiple roles
 * @todo Complete list from MoneyWorks ContactRoles
 */
export enum MoneyWorksContactRole {
	/** Primary contact */
	PRIMARY = 0x0001,

	/** Accounts contact */
	ACCOUNTS = 0x0002,

	/** Sales contact */
	SALES = 0x0004,

	/** Purchasing contact */
	PURCHASING = 0x0008,
}
