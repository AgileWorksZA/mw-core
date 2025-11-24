/**
 * MoneyWorks Name Entity - Generated from Official Documentation
 * Source: https://secure.cognito.co.nz/manual/moneyworks_appendix_names.html
 *
 * Represents customers, suppliers, and other name entities in MoneyWorks
 */

// ============================================================================
// ENUMS - Semantic Types from Documentation
// ============================================================================

/** Customer classification */
export enum CustomerType {
	/** Not a customer */
	NotCustomer = 0,
	/** Customer */
	Customer = 1,
	/** Debtor */
	Debtor = 2,
}

/** Supplier classification */
export enum SupplierType {
	/** Not a supplier */
	NotSupplier = 0,
	/** Supplier */
	Supplier = 1,
	/** Creditor */
	Creditor = 2,
}

/** Name record type */
export enum NameKind {
	/** Template record */
	Template = 0,
	/** Normal record */
	Normal = 1,
}

/** Payment methods */
export enum PaymentMethod {
	None = 0,
	Cash = 1,
	Cheque = 2,
	Electronic = 3,
	// Additional methods may exist - documentation indicates "etc"
}

/** Product pricing levels for customers */
export enum ProductPricingLevel {
	A = "A",
	B = "B",
	C = "C",
	D = "D",
	E = "E",
	F = "F",
}

/** Name flags - bit-mapped field */
export enum NameFlags {
	/** Requires order number */
	RequiresOrderNumber = 0x0001,
}

// ============================================================================
// MAIN INTERFACE
// ============================================================================

export interface Name {
	// Core identification fields
	/** Internal sequence number - unique identifier */
	SequenceNumber: number;

	/** Date and time the record was last modified */
	LastModifiedTime: string;

	/** The name code. For non-sundries, only the first ten characters are used. Max 11 chars. */
	Code: string;

	/** Name of company. Max 255 chars. */
	Name: string;

	/** The kind of Name. 0 for a template, 1 for a normal */
	Kind: NameKind;

	// Customer/Supplier Classification
	/** Customer type: 0=not customer, 1=customer, 2=debtor */
	CustomerType: CustomerType;

	/** Supplier type: 0=not supplier, 1=supplier, 2=creditor */
	SupplierType: SupplierType;

	// Address Information
	/** Mailing Address (first line). Max 59 chars. */
	Address1: string;

	/** Mailing Address (second line). Max 59 chars. */
	Address2: string;

	/** Mailing Address (third line). Max 59 chars. */
	Address3: string;

	/** Mailing Address (fourth line). Max 59 chars. */
	Address4: string;

	/** Post code. Max 11 chars. */
	PostCode: string;

	/** State (for postal address). Max 3 chars. */
	State: string;

	// Delivery Address
	/** Delivery Address (first line). Max 59 chars. */
	DeliveryAddress1: string;

	/** Delivery Address (second line). Max 59 chars. */
	DeliveryAddress2: string;

	/** Delivery Address (third line). Max 59 chars. */
	DeliveryAddress3: string;

	/** Delivery Address (fourth line). Max 59 chars. */
	DeliveryAddress4: string;

	/** Delivery post code. Max 11 chars. */
	DeliveryPostCode: string;

	/** Delivery state. Max 3 chars. */
	DeliveryState: string;

	// Contact Information - Primary Contact
	/** Contact person 1 in the company. Max 25 chars. */
	Contact: string;

	/** Position of contact person 1. Max 29 chars. */
	Position: string;

	/** Salutation for contact 1. Max 39 chars. */
	Salutation: string;

	/** Phone number. Max 19 chars. */
	Phone: string;

	/** Mobile phone number for contact 1. Max 14 chars. */
	Mobile: string;

	/** After hours phone number for contact 1. Max 11 chars. */
	Afterhours: string;

	/** email address for contact 1. Max 80 chars. */
	email: string;

	/** Memo/notes for contact 1. Max 255 chars. */
	Memo: string;

	/** Roles for contact 1. This is a bit mapped field, with each bit representing a role. */
	Role: number;

	// Contact Information - Secondary Contact
	/** Name of contact person 2. Max 29 chars. */
	Contact2: string;

	/** Position of contact 2. Max 29 chars. */
	Position2: string;

	/** Salutation for contact 2. Max 39 chars. */
	Salutation2: string;

	/** Mobile phone number for contact 2. Max 13 chars. */
	Mobile2: string;

	/** After hours phone number for contact 2. Max 11 chars. */
	Afterhours2: string;

	/** email address for contact 2. Max 80 chars. */
	email2: string;

	/** Memo/notes for contact 2. Max 255 chars. */
	Memo2: string;

	/** Roles for contact 2. This is a bit mapped field, with each bit representing a role. */
	Role2: number;

	// Communication
	/** Facsimile number. Max 19 chars. */
	Fax: string;

	/** Web URL. Max 63 chars. */
	WebURL: string;

	// Financial Information
	/** Currency of customer/supplier (blank if local). Max 3 chars. */
	Currency: string;

	/** The credit limit for a debtor */
	CreditLimit: number;

	/** True if the debtor is on hold (False otherwise) */
	Hold: boolean;

	// Customer Terms
	/** If > 0, within N days; if < 0, Nth day of month following */
	CreditorTerms: number;

	/** 0 for no prompt payment; > 0 for within N days; < 0 for by Nth date of following month */
	CustPromptPaymentTerms: number;

	/** Prompt payment discount percentage */
	CustPropmtPaymentDiscount: number;

	// Supplier Terms
	/** 0 for no prompt payment; > 0 for within N days; < 0 for by Nth date of following month */
	SupplierPromptPaymentTerms: number;

	/** Percentage amount of prompt payment discount offered by supplier */
	SuppPromptPaymentDiscount: number;

	// Payment Information
	/** Payment method (0 = None, 1 = Cash, 2 = Cheque, 3 = Electronic, etc). */
	PaymentMethod: PaymentMethod;

	/** PaymentMethod used in previous transaction */
	LastPaymentMethod: PaymentMethod;

	/** Preferred payment method of customers. 1 = Cash, 2 = Cheque etc. */
	ReceiptMethod: PaymentMethod;

	// Banking Information
	/** The customer's bank (e.g. BNZ). Max 7 chars. */
	Bank: string;

	/** The bank branch (e.g. Main St.). Max 21 chars. */
	BankBranch: string;

	/** The bank account name (e.g. XYZ Trading Company). Max 21 chars. */
	"Account Name": string;

	/** The bank account number of the name, as supplied by their bank. Max 23 chars. */
	BankAccountNumber: string;

	// Credit Card Information
	/** Credit card number. Max 19 chars. */
	CreditCardNum: string;

	/** Name on credit card. Max 19 chars. */
	CreditCardName: string;

	/** Expiry date of credit card. Max 5 chars. */
	CreditCardExpiry: string;

	// Account References
	/** The Accounts Receivable control account code for a debtor. Max 7 chars. */
	RecAccount: string;

	/** The Accounts Payable control account code for a creditor. Max 7 chars. */
	PayAccount: string;

	// Pricing and Sales
	/** Pricing level for customer. (A-F) */
	ProductPricing: ProductPricingLevel;

	/** Code for salesperson for client--automatically copied to the transaction.salesperson field. Max 5 chars. */
	SalesPerson: string;

	// Aging Information (Debtors)
	/** Current balance for a debtor */
	DCurrent: number;

	/** Debtor 30 day balance (1 cycle of manual ageing). */
	D30Plus: number;

	/** Debtor 60 day balance (2 cycles of manual ageing). */
	D60Plus: number;

	/** Debtor 90 days+ balance (3 cycles of manual ageing). */
	D90Plus: number;

	// Aging Information (Creditors)
	/** For a creditor, the current balance. */
	CCurrent: number;

	// Tax Information
	/** Tax code override. Max 5 chars. */
	TaxCode: string;

	/** Their tax number (GST#, VAT#, ABN etc, depending on country). Max 19 chars. */
	TaxNumber: string;

	// eInvoicing
	/** The ID to use for the customer when eInvoicing using a Peppol Access Point (e.g. ABN in Australia, NZBN in New Zealand). Max 31 chars. */
	EInvoiceID: string;

	// References
	/** The reference code by which the supplier or customer refers to your company. Max 15 chars. */
	TheirRef: string;

	// Categories - User Defined
	/** User defined. Max 15 chars. */
	Category1: string;

	/** User defined. Max 15 chars. */
	Category2: string;

	/** User defined. Max 15 chars. */
	Category3: string;

	/** User defined. Max 15 chars. */
	Category4: string;

	// Custom Fields
	/** For your own use. Max 255 chars. */
	Custom1: string;

	/** For your own use. Max 255 chars. */
	Custom2: string;

	/** For your own use. Max 15 chars. */
	Custom3: string;

	/** For your own use. Max 15 chars. */
	Custom4: string;

	/** For your own use. Max 15 chars. */
	Custom5: string;

	/** For your own use. Max 15 chars. */
	Custom6: string;

	/** For your own use. Max 15 chars. */
	Custom7: string;

	/** For your own use. Max 15 chars. */
	Custom8: string;

	// Split Accounting
	/** Account code for first split account. Max 13 chars. */
	SplitAcct1: string;

	/** Account code for remainder split account. Max 13 chars. */
	SplitAcct2: string;

	/** Percent of allocation to be put into SplitAcct1 */
	SplitPercent: number;

	// System Fields
	/** The colour, represented internally as a numeric index in the range 0-7 */
	Colour: number;

	/** See Names Flags table - bit mapped field */
	Flags: number;

	/** A comment. Max 1020 chars. */
	Comment: string;

	/** User defined */
	UserNum: number;

	/** User defined. Max 255 chars. */
	UserText: string;

	/** Scriptable tag storage. Max 255 chars. */
	TaggedText: string;

	// Special Fields
	/** Mac Address Book Universal ID--set for imported address book entries only */
	ABUID: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Check if a name is a customer */
export function isCustomer(name: Name): boolean {
	return (
		name.CustomerType === CustomerType.Customer ||
		name.CustomerType === CustomerType.Debtor
	);
}

/** Check if a name is a supplier */
export function isSupplier(name: Name): boolean {
	return (
		name.SupplierType === SupplierType.Supplier ||
		name.SupplierType === SupplierType.Creditor
	);
}

/** Check if a name requires an order number */
export function requiresOrderNumber(name: Name): boolean {
	return (name.Flags & NameFlags.RequiresOrderNumber) !== 0;
}

/** Get human-readable customer type */
export function getCustomerTypeLabel(type: CustomerType): string {
	switch (type) {
		case CustomerType.NotCustomer:
			return "Not a Customer";
		case CustomerType.Customer:
			return "Customer";
		case CustomerType.Debtor:
			return "Debtor";
		default:
			return "Unknown";
	}
}

/** Get human-readable supplier type */
export function getSupplierTypeLabel(type: SupplierType): string {
	switch (type) {
		case SupplierType.NotSupplier:
			return "Not a Supplier";
		case SupplierType.Supplier:
			return "Supplier";
		case SupplierType.Creditor:
			return "Creditor";
		default:
			return "Unknown";
	}
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

/** Validate a Name object against MoneyWorks constraints */
export function validateName(name: Partial<Name>): ValidationResult {
	const errors: ValidationError[] = [];

	// Required fields
	if (!name.Code) {
		errors.push({
			field: "Code",
			message: "Code is required",
			value: name.Code,
		});
	}

	// Field length validations
	if (name.Code && name.Code.length > 11) {
		errors.push({
			field: "Code",
			message: "Code cannot exceed 11 characters",
			value: name.Code,
		});
	}

	if (name.Name && name.Name.length > 255) {
		errors.push({
			field: "Name",
			message: "Name cannot exceed 255 characters",
			value: name.Name,
		});
	}

	if (name.Address1 && name.Address1.length > 59) {
		errors.push({
			field: "Address1",
			message: "Address1 cannot exceed 59 characters",
			value: name.Address1,
		});
	}

	// Enum validations
	if (
		name.CustomerType !== undefined &&
		!Object.values(CustomerType).includes(name.CustomerType)
	) {
		errors.push({
			field: "CustomerType",
			message: "Invalid CustomerType",
			value: name.CustomerType,
		});
	}

	if (
		name.SupplierType !== undefined &&
		!Object.values(SupplierType).includes(name.SupplierType)
	) {
		errors.push({
			field: "SupplierType",
			message: "Invalid SupplierType",
			value: name.SupplierType,
		});
	}

	if (
		name.ProductPricing &&
		!Object.values(ProductPricingLevel).includes(name.ProductPricing)
	) {
		errors.push({
			field: "ProductPricing",
			message: "Invalid ProductPricing level",
			value: name.ProductPricing,
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

export class NameQueryBuilder {
	private conditions: string[] = [];

	/** Filter by customer type */
	customerType(type: CustomerType): this {
		this.conditions.push(`CustomerType=${type}`);
		return this;
	}

	/** Filter by supplier type */
	supplierType(type: SupplierType): this {
		this.conditions.push(`SupplierType=${type}`);
		return this;
	}

	/** Filter by name code */
	code(code: string): this {
		this.conditions.push(`Code="${code}"`);
		return this;
	}

	/** Filter by company name (partial match) */
	nameContains(text: string): this {
		this.conditions.push(`Name LIKE "*${text}*"`);
		return this;
	}

	/** Filter by hold status */
	onHold(hold = true): this {
		this.conditions.push(`Hold=${hold ? "True" : "False"}`);
		return this;
	}

	/** Filter customers only */
	customersOnly(): this {
		this.conditions.push("(CustomerType=1 OR CustomerType=2)");
		return this;
	}

	/** Filter suppliers only */
	suppliersOnly(): this {
		this.conditions.push("(SupplierType=1 OR SupplierType=2)");
		return this;
	}

	/** Build the search expression */
	build(): string {
		return this.conditions.join(" AND ");
	}
}

/** Create a new name query builder */
export function queryNames(): NameQueryBuilder {
	return new NameQueryBuilder();
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/** Type guard to check if a name has customer fields */
export function hasCustomerData(
	name: Partial<Name>,
): name is Partial<Name> & { CustomerType: CustomerType } {
	return (
		name.CustomerType !== undefined &&
		name.CustomerType !== CustomerType.NotCustomer
	);
}

/** Type guard to check if a name has supplier fields */
export function hasSupplierData(
	name: Partial<Name>,
): name is Partial<Name> & { SupplierType: SupplierType } {
	return (
		name.SupplierType !== undefined &&
		name.SupplierType !== SupplierType.NotSupplier
	);
}
