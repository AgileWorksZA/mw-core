/**
 * MoneyWorks Names Entity - Canonical Type Definitions
 *
 * PURE MoneyWorks data types preserving exact field names and business logic
 * Source: MoneyWorks Manual - Names Field Descriptions
 *
 * @ai-instruction CRITICAL: These are canonical MW types. NEVER rename fields.
 * @ai-instruction The distinction between Customer/Debtor and Supplier/Creditor is fundamental to MW.
 */

import type { AccountCode, NameCode } from "@moneyworks/utilities";

/**
 * MoneyWorks Name entity - represents customers, suppliers, and other business entities
 *
 * @ai-critical Names can be:
 * - Customers (can buy) vs Debtors (have receivables, credit limits)
 * - Suppliers (can sell) vs Creditors (have payables, payment terms)
 * - Both or neither
 */
export interface MoneyWorksName {
	// ============= IDENTIFICATION =============
	/** Internal sequence number - unique identifier */
	SequenceNumber: number;

	/** The name code - unique identifier (max 11 chars, only first 10 used for non-sundries) */
	Code: NameCode;

	/** Company name (max 255 chars) */
	Name: string;

	/** Date and time the record was last modified (ISO format) */
	LastModifiedTime: string;

	// ============= CLASSIFICATION =============
	/** 0 = Not customer, 1 = Customer, 2 = Debtor */
	CustomerType: number;

	/** 0 = Not supplier, 1 = Supplier, 2 = Creditor */
	SupplierType: number;

	/** 0 = Template, 1 = Normal */
	Kind: number;

	// ============= POSTAL ADDRESS =============
	/** Mailing address line 1 (max 59 chars) */
	Address1: string;

	/** Mailing address line 2 (max 59 chars) */
	Address2: string;

	/** Mailing address line 3 (max 59 chars) */
	Address3: string;

	/** Mailing address line 4 (max 59 chars) */
	Address4: string;

	/** Post code (max 11 chars) */
	PostCode: string;

	/** State for postal address (max 3 chars) */
	State: string;

	// ============= DELIVERY ADDRESS =============
	/** Delivery address line 1 (max 59 chars) */
	DeliveryAddress1: string;

	/** Delivery address line 2 (max 59 chars) */
	DeliveryAddress2: string;

	/** Delivery address line 3 (max 59 chars) */
	DeliveryAddress3: string;

	/** Delivery address line 4 (max 59 chars) */
	DeliveryAddress4: string;

	/** Delivery post code (max 11 chars) */
	DeliveryPostCode: string;

	/** Delivery state (max 3 chars) */
	DeliveryState: string;

	// ============= PRIMARY CONTACT (Contact 1) =============
	/** Contact person 1 name (max 25 chars) */
	Contact: string;

	/** Position of contact 1 (max 29 chars) */
	Position: string;

	/** Salutation for contact 1 (max 39 chars) */
	Salutation: string;

	/** Main phone number (max 19 chars) */
	Phone: string;

	/** Mobile phone for contact 1 (max 14 chars) */
	Mobile: string;

	/** After hours phone for contact 1 (max 11 chars) */
	Afterhours: string;

	/** Email for contact 1 (max 80 chars) */
	email: string;

	/** Memo/notes for contact 1 (max 255 chars) */
	Memo: string;

	/** Roles for contact 1 (bit-mapped field) */
	Role: number;

	// ============= SECONDARY CONTACT (Contact 2) =============
	/** Contact person 2 name (max 29 chars) */
	Contact2: string;

	/** Position of contact 2 (max 29 chars) */
	Position2: string;

	/** Salutation for contact 2 (max 39 chars) */
	Salutation2: string;

	/** Mobile phone for contact 2 (max 13 chars) */
	Mobile2: string;

	/** After hours phone for contact 2 (max 11 chars) */
	Afterhours2: string;

	/** Email for contact 2 (max 80 chars) */
	email2: string;

	/** Memo/notes for contact 2 (max 255 chars) */
	Memo2: string;

	/** Roles for contact 2 (bit-mapped field) */
	Role2: number;

	// ============= COMMUNICATION =============
	/** Fax number (max 19 chars) */
	Fax: string;

	/** Web URL (max 63 chars) */
	WebURL: string;

	// ============= FINANCIAL =============
	/** Currency code (blank = local, max 3 chars) */
	Currency: string;

	/** Credit limit for debtor */
	CreditLimit: number;

	/** True if debtor is on hold */
	Hold: boolean;

	/** Accounts Receivable control account for debtor (max 7 chars) */
	RecAccount: AccountCode;

	/** Accounts Payable control account for creditor (max 7 chars) */
	PayAccount: AccountCode;

	// ============= PAYMENT TERMS =============
	/** Debtor terms: >0 = within N days, <0 = Nth day of following month */
	DebtorTerms: number;

	/** Creditor terms: >0 = within N days, <0 = Nth day of following month */
	CreditorTerms: number;

	/** Customer prompt payment terms (same rules as above) */
	CustPromptPaymentTerms: number;

	/** Customer prompt payment discount percentage */
	CustPropmtPaymentDiscount: number;

	/** Supplier prompt payment terms */
	SupplierPromptPaymentTerms: number;

	/** Supplier prompt payment discount percentage */
	SuppPromptPaymentDiscount: number;

	// ============= PAYMENT METHODS =============
	/** Payment method (0=None, 1=Cash, 2=Cheque, 3=Electronic, etc) */
	PaymentMethod: number;

	/** Payment method used in previous transaction */
	LastPaymentMethod: number;

	/** Preferred receipt method for customers */
	ReceiptMethod: number;

	// ============= BANKING =============
	/** Bank name (max 7 chars) */
	Bank: string;

	/** Bank branch (max 21 chars) */
	BankBranch: string;

	/** Bank account name (max 21 chars) */
	"Account Name": string;

	/** Bank account number (max 23 chars) */
	BankAccountNumber: string;

	// ============= CREDIT CARD =============
	/** Credit card number (max 19 chars) */
	CreditCardNum: string;

	/** Name on credit card (max 19 chars) */
	CreditCardName: string;

	/** Credit card expiry date (max 5 chars) */
	CreditCardExpiry: string;

	// ============= BALANCES =============
	/** Debtor current balance */
	DCurrent: number;

	/** Debtor 30+ days balance */
	D30Plus: number;

	/** Debtor 60+ days balance */
	D60Plus: number;

	/** Debtor 90+ days balance */
	D90Plus: number;

	/** Creditor current balance */
	CCurrent: number;

	// ============= TAX =============
	/** Tax code override (max 5 chars) */
	TaxCode: string;

	/** Tax number (GST#, VAT#, ABN, etc) (max 19 chars) */
	TaxNumber: string;

	/** eInvoicing ID (Peppol) (max 31 chars) */
	EInvoiceID: string;

	// ============= REFERENCES =============
	/** Their reference code for your company (max 15 chars) */
	TheirRef: string;

	/** Product pricing level (A-F) */
	ProductPricing: string;

	/** Salesperson code (max 5 chars) */
	SalesPerson: string;

	// ============= CATEGORIES =============
	/** User-defined category 1 (max 15 chars) */
	Category1: string;

	/** User-defined category 2 (max 15 chars) */
	Category2: string;

	/** User-defined category 3 (max 15 chars) */
	Category3: string;

	/** User-defined category 4 (max 15 chars) */
	Category4: string;

	// ============= CUSTOM FIELDS =============
	/** Custom field 1 (max 255 chars) */
	Custom1: string;

	/** Custom field 2 (max 255 chars) */
	Custom2: string;

	/** Custom field 3 (max 15 chars) */
	Custom3: string;

	/** Custom field 4 (max 15 chars) */
	Custom4: string;

	/** Custom field 5 (max 15 chars) */
	Custom5: string;

	/** Custom field 6 (max 15 chars) */
	Custom6: string;

	/** Custom field 7 (max 15 chars) */
	Custom7: string;

	/** Custom field 8 (max 15 chars) */
	Custom8: string;

	// ============= SPLIT ACCOUNTING =============
	/** Split account 1 code (max 13 chars) */
	SplitAcct1: string;

	/** Split account 2 code (max 13 chars) */
	SplitAcct2: string;

	/** Percentage allocation to SplitAcct1 */
	SplitPercent: number;

	// ============= SYSTEM FIELDS =============
	/** Color index (0-7) */
	Colour: number;

	/** Bit-mapped flags field */
	Flags: number;

	/** Comment/notes (max 1020 chars) */
	Comment: string;

	/** User-defined number */
	UserNum: number;

	/** User-defined text (max 255 chars) */
	UserText: string;

	/** Scriptable tag storage (max 255 chars) */
	TaggedText: string;

	/** Mac Address Book Universal ID */
	ABUID: string;
}

/**
 * Optional fields for creating/updating a Name
 * All fields except Code are optional when creating
 */
export type MoneyWorksNameInput = Partial<MoneyWorksName> & {
	Code: NameCode;
};

/**
 * Fields that can be used to filter Names
 */
export interface MoneyWorksNameFilter {
	Code?: NameCode;
	Name?: string;
	CustomerType?: number;
	SupplierType?: number;
	Kind?: number;
	Hold?: boolean;
	Currency?: string;
	Category1?: string;
	Category2?: string;
	Category3?: string;
	Category4?: string;
}
