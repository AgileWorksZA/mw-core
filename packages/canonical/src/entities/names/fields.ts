/**
 * MoneyWorks Names Entity - Field Definitions
 *
 * Complete field metadata for the Names table
 * Source: MoneyWorks Manual - Names Field Descriptions
 *
 * @ai-instruction These are the canonical MW field definitions. Use for validation and metadata.
 */

export interface MoneyWorksNameField {
	/** MoneyWorks field name (exact) */
	fieldName: string;
	/** MW data type: T=Text, N=Number, D=Date, B=Boolean, S=Sequence */
	dataType: "T" | "N" | "D" | "B" | "S";
	/** Maximum length for text fields */
	maxLength?: number;
	/** Field description from MW manual */
	description: string;
	/** Whether field is required */
	required: boolean;
	/** Whether field is indexed for search */
	indexed?: boolean;
	/** Related entity/table */
	relatedEntity?: string;
	/** Special validation rules */
	validationRules?: string[];
}

/**
 * Complete field definitions for MoneyWorks Names entity
 * Used for validation, UI generation, and documentation
 */
export const MONEYWORKS_NAME_FIELDS: MoneyWorksNameField[] = [
	// ============= IDENTIFICATION =============
	{
		fieldName: "SequenceNumber",
		dataType: "S",
		description: "Internal sequence number - unique identifier",
		required: false,
		indexed: true,
	},
	{
		fieldName: "Code",
		dataType: "T",
		maxLength: 11,
		description:
			"The name code. For non-sundries, only the first ten characters are used",
		required: true,
		indexed: true,
		validationRules: ["First 10 chars must be unique for non-sundries"],
	},
	{
		fieldName: "Name",
		dataType: "T",
		maxLength: 255,
		description: "Name of company",
		required: true,
		indexed: true,
	},
	{
		fieldName: "LastModifiedTime",
		dataType: "D",
		description: "Date and time the record was last modified",
		required: false,
	},

	// ============= CLASSIFICATION =============
	{
		fieldName: "CustomerType",
		dataType: "N",
		description: "0 for not a customer, 1 for customer, 2 for debtor",
		required: true,
		validationRules: ["Must be 0, 1, or 2"],
	},
	{
		fieldName: "SupplierType",
		dataType: "N",
		description: "0 for not a supplier, 1 for supplier, 2 for creditor",
		required: true,
		validationRules: ["Must be 0, 1, or 2"],
	},
	{
		fieldName: "Kind",
		dataType: "N",
		description: "The kind of Name. 0 for a template, 1 for a normal",
		required: true,
		validationRules: ["Must be 0 or 1"],
	},

	// ============= POSTAL ADDRESS =============
	{
		fieldName: "Address1",
		dataType: "T",
		maxLength: 59,
		description: "Mailing Address (first line)",
		required: false,
	},
	{
		fieldName: "Address2",
		dataType: "T",
		maxLength: 59,
		description: "Mailing Address (second line)",
		required: false,
	},
	{
		fieldName: "Address3",
		dataType: "T",
		maxLength: 59,
		description: "Mailing Address (third line)",
		required: false,
	},
	{
		fieldName: "Address4",
		dataType: "T",
		maxLength: 59,
		description: "Mailing Address (fourth line)",
		required: false,
	},
	{
		fieldName: "PostCode",
		dataType: "T",
		maxLength: 11,
		description: "Post code",
		required: false,
	},
	{
		fieldName: "State",
		dataType: "T",
		maxLength: 3,
		description: "State (for postal address)",
		required: false,
	},

	// ============= DELIVERY ADDRESS =============
	{
		fieldName: "DeliveryAddress1",
		dataType: "T",
		maxLength: 59,
		description: "Delivery Address (first line)",
		required: false,
	},
	{
		fieldName: "DeliveryAddress2",
		dataType: "T",
		maxLength: 59,
		description: "Delivery Address (second line)",
		required: false,
	},
	{
		fieldName: "DeliveryAddress3",
		dataType: "T",
		maxLength: 59,
		description: "Delivery Address (third line)",
		required: false,
	},
	{
		fieldName: "DeliveryAddress4",
		dataType: "T",
		maxLength: 59,
		description: "Delivery Address (fourth line)",
		required: false,
	},
	{
		fieldName: "DeliveryPostCode",
		dataType: "T",
		maxLength: 11,
		description: "Delivery post code",
		required: false,
	},
	{
		fieldName: "DeliveryState",
		dataType: "T",
		maxLength: 3,
		description: "Delivery state",
		required: false,
	},

	// ============= PRIMARY CONTACT =============
	{
		fieldName: "Contact",
		dataType: "T",
		maxLength: 25,
		description: "Contact person 1 in the company",
		required: false,
	},
	{
		fieldName: "Position",
		dataType: "T",
		maxLength: 29,
		description: "Position of contact person 1",
		required: false,
	},
	{
		fieldName: "Salutation",
		dataType: "T",
		maxLength: 39,
		description: "Salutation for contact 1",
		required: false,
	},
	{
		fieldName: "Phone",
		dataType: "T",
		maxLength: 19,
		description: "Phone number",
		required: false,
		indexed: true,
	},
	{
		fieldName: "Mobile",
		dataType: "T",
		maxLength: 14,
		description: "Mobile phone number for contact 1",
		required: false,
	},
	{
		fieldName: "Afterhours",
		dataType: "T",
		maxLength: 11,
		description: "After hours phone number for contact 1",
		required: false,
	},
	{
		fieldName: "email",
		dataType: "T",
		maxLength: 80,
		description: "email address for contact 1",
		required: false,
		indexed: true,
	},
	{
		fieldName: "Memo",
		dataType: "T",
		maxLength: 255,
		description: "Memo/notes for contact 1",
		required: false,
	},
	{
		fieldName: "Role",
		dataType: "N",
		description: "Roles for contact 1. This is a bit mapped field",
		required: false,
	},

	// ============= SECONDARY CONTACT =============
	{
		fieldName: "Contact2",
		dataType: "T",
		maxLength: 29,
		description: "Name of contact person 2",
		required: false,
	},
	{
		fieldName: "Position2",
		dataType: "T",
		maxLength: 29,
		description: "Position of contact 2",
		required: false,
	},
	{
		fieldName: "Salutation2",
		dataType: "T",
		maxLength: 39,
		description: "Salutation for contact 2",
		required: false,
	},
	{
		fieldName: "Mobile2",
		dataType: "T",
		maxLength: 13,
		description: "Mobile phone number for contact 2",
		required: false,
	},
	{
		fieldName: "Afterhours2",
		dataType: "T",
		maxLength: 11,
		description: "After hours phone number for contact 2",
		required: false,
	},
	{
		fieldName: "email2",
		dataType: "T",
		maxLength: 80,
		description: "email address for contact 2",
		required: false,
	},
	{
		fieldName: "Memo2",
		dataType: "T",
		maxLength: 255,
		description: "Memo/notes for contact 2",
		required: false,
	},
	{
		fieldName: "Role2",
		dataType: "N",
		description: "Roles for contact 2. This is a bit mapped field",
		required: false,
	},

	// ============= COMMUNICATION =============
	{
		fieldName: "Fax",
		dataType: "T",
		maxLength: 19,
		description: "Facsimile number",
		required: false,
	},
	{
		fieldName: "WebURL",
		dataType: "T",
		maxLength: 63,
		description: "Web URL",
		required: false,
	},

	// ============= FINANCIAL =============
	{
		fieldName: "Currency",
		dataType: "T",
		maxLength: 3,
		description: "Currency of customer/supplier (blank if local)",
		required: false,
		relatedEntity: "Currencies",
	},
	{
		fieldName: "CreditLimit",
		dataType: "N",
		description: "The credit limit for a debtor",
		required: false,
		validationRules: ["Only applicable if CustomerType = 2 (Debtor)"],
	},
	{
		fieldName: "Hold",
		dataType: "B",
		description: "True if the debtor is on hold (False otherwise)",
		required: false,
		validationRules: ["Only applicable if CustomerType = 2 (Debtor)"],
	},
	{
		fieldName: "RecAccount",
		dataType: "T",
		maxLength: 7,
		description: "The Accounts Receivable control account code for a debtor",
		required: false,
		relatedEntity: "Account",
		validationRules: ["Required if CustomerType = 2 (Debtor)"],
	},
	{
		fieldName: "PayAccount",
		dataType: "T",
		maxLength: 7,
		description: "The Accounts Payable control account code for a creditor",
		required: false,
		relatedEntity: "Account",
		validationRules: ["Required if SupplierType = 2 (Creditor)"],
	},

	// ============= PAYMENT TERMS =============
	{
		fieldName: "DebtorTerms",
		dataType: "N",
		description: "If > 0, within N days; if < 0, Nth day of month following",
		required: false,
	},
	{
		fieldName: "CreditorTerms",
		dataType: "N",
		description: "If > 0, within N days; if < 0, Nth day of month following",
		required: false,
	},
	{
		fieldName: "CustPromptPaymentTerms",
		dataType: "N",
		description:
			"0 for no prompt payment; > 0 for within N days; < 0 for by Nth date of following month",
		required: false,
	},
	{
		fieldName: "CustPropmtPaymentDiscount",
		dataType: "N",
		description: "Prompt payment discount percentage",
		required: false,
	},
	{
		fieldName: "SupplierPromptPaymentTerms",
		dataType: "N",
		description:
			"0 for no prompt payment; > 0 for within N days; < 0 for by Nth date of following month",
		required: false,
	},
	{
		fieldName: "SuppPromptPaymentDiscount",
		dataType: "N",
		description:
			"Percentage amount of prompt payment discount offered by supplier",
		required: false,
	},

	// ============= PAYMENT METHODS =============
	{
		fieldName: "PaymentMethod",
		dataType: "N",
		description:
			"Payment method (0 = None, 1 = Cash, 2 = Cheque, 3 = Electronic, etc)",
		required: false,
	},
	{
		fieldName: "LastPaymentMethod",
		dataType: "N",
		description: "PaymentMethod used in previous transaction",
		required: false,
	},
	{
		fieldName: "ReceiptMethod",
		dataType: "N",
		description: "Preferred payment method of customers",
		required: false,
	},

	// ============= BANKING =============
	{
		fieldName: "Bank",
		dataType: "T",
		maxLength: 7,
		description: "The customer's bank (e.g. BNZ)",
		required: false,
	},
	{
		fieldName: "BankBranch",
		dataType: "T",
		maxLength: 21,
		description: "The bank branch (e.g. Main St.)",
		required: false,
	},
	{
		fieldName: "Account Name",
		dataType: "T",
		maxLength: 21,
		description: "The bank account name (e.g. XYZ Trading Company)",
		required: false,
	},
	{
		fieldName: "BankAccountNumber",
		dataType: "T",
		maxLength: 23,
		description:
			"The bank account number of the name, as supplied by their bank",
		required: false,
	},

	// ============= CREDIT CARD =============
	{
		fieldName: "CreditCardNum",
		dataType: "T",
		maxLength: 19,
		description: "Credit card number",
		required: false,
	},
	{
		fieldName: "CreditCardName",
		dataType: "T",
		maxLength: 19,
		description: "Name on credit card",
		required: false,
	},
	{
		fieldName: "CreditCardExpiry",
		dataType: "T",
		maxLength: 5,
		description: "Expiry date of credit card",
		required: false,
	},

	// ============= BALANCES =============
	{
		fieldName: "DCurrent",
		dataType: "N",
		description: "For a debtor, the current balance",
		required: false,
	},
	{
		fieldName: "D30Plus",
		dataType: "N",
		description: "Debtor 30 day balance (1 cycle of manual ageing)",
		required: false,
	},
	{
		fieldName: "D60Plus",
		dataType: "N",
		description: "Debtor 60 day balance (2 cycles of manual ageing)",
		required: false,
	},
	{
		fieldName: "D90Plus",
		dataType: "N",
		description: "Debtor 90 days+ balance (3 cycles of manual ageing)",
		required: false,
	},
	{
		fieldName: "CCurrent",
		dataType: "N",
		description: "For a creditor, the current balance",
		required: false,
	},

	// ============= TAX =============
	{
		fieldName: "TaxCode",
		dataType: "T",
		maxLength: 5,
		description: "Tax code override",
		required: false,
		relatedEntity: "TaxRate",
	},
	{
		fieldName: "TaxNumber",
		dataType: "T",
		maxLength: 19,
		description: "Their tax number (GST#, VAT#, ABN etc, depending on country)",
		required: false,
	},
	{
		fieldName: "EInvoiceID",
		dataType: "T",
		maxLength: 31,
		description:
			"The ID to use for the customer when eInvoicing using a Peppol Access Point",
		required: false,
	},

	// ============= REFERENCES =============
	{
		fieldName: "TheirRef",
		dataType: "T",
		maxLength: 15,
		description:
			"The reference code by which the supplier or customer refers to your company",
		required: false,
	},
	{
		fieldName: "ProductPricing",
		dataType: "T",
		maxLength: 1,
		description: "Pricing level for customer. (A-F)",
		required: false,
		validationRules: ["Must be A, B, C, D, E, or F"],
	},
	{
		fieldName: "SalesPerson",
		dataType: "T",
		maxLength: 5,
		description: "Code for salesperson for client",
		required: false,
	},

	// ============= CATEGORIES =============
	{
		fieldName: "Category1",
		dataType: "T",
		maxLength: 15,
		description: "User defined category 1",
		required: false,
	},
	{
		fieldName: "Category2",
		dataType: "T",
		maxLength: 15,
		description: "User defined category 2",
		required: false,
	},
	{
		fieldName: "Category3",
		dataType: "T",
		maxLength: 15,
		description: "User defined category 3",
		required: false,
	},
	{
		fieldName: "Category4",
		dataType: "T",
		maxLength: 15,
		description: "User defined category 4",
		required: false,
	},

	// ============= CUSTOM FIELDS =============
	{
		fieldName: "Custom1",
		dataType: "T",
		maxLength: 255,
		description: "For your own use",
		required: false,
	},
	{
		fieldName: "Custom2",
		dataType: "T",
		maxLength: 255,
		description: "For your own use",
		required: false,
	},
	{
		fieldName: "Custom3",
		dataType: "T",
		maxLength: 15,
		description: "For your own use",
		required: false,
	},
	{
		fieldName: "Custom4",
		dataType: "T",
		maxLength: 15,
		description: "For your own use",
		required: false,
	},
	{
		fieldName: "Custom5",
		dataType: "T",
		maxLength: 15,
		description: "For your own use",
		required: false,
	},
	{
		fieldName: "Custom6",
		dataType: "T",
		maxLength: 15,
		description: "For your own use",
		required: false,
	},
	{
		fieldName: "Custom7",
		dataType: "T",
		maxLength: 15,
		description: "For your own use",
		required: false,
	},
	{
		fieldName: "Custom8",
		dataType: "T",
		maxLength: 15,
		description: "For your own use",
		required: false,
	},

	// ============= SPLIT ACCOUNTING =============
	{
		fieldName: "SplitAcct1",
		dataType: "T",
		maxLength: 13,
		description: "Account code for first split account",
		required: false,
		relatedEntity: "Account",
	},
	{
		fieldName: "SplitAcct2",
		dataType: "T",
		maxLength: 13,
		description: "Account code for remainder split account",
		required: false,
		relatedEntity: "Account",
	},
	{
		fieldName: "SplitPercent",
		dataType: "N",
		description: "Percent of allocation to be put into SplitAcct1",
		required: false,
	},

	// ============= SYSTEM FIELDS =============
	{
		fieldName: "Colour",
		dataType: "N",
		description:
			"The colour, represented internally as a numeric index in the range 0-7",
		required: false,
	},
	{
		fieldName: "Flags",
		dataType: "N",
		description: "See Names Flags table - bit mapped field",
		required: false,
	},
	{
		fieldName: "Comment",
		dataType: "T",
		maxLength: 1020,
		description: "A comment",
		required: false,
	},
	{
		fieldName: "UserNum",
		dataType: "N",
		description: "User defined number",
		required: false,
	},
	{
		fieldName: "UserText",
		dataType: "T",
		maxLength: 255,
		description: "User defined text",
		required: false,
	},
	{
		fieldName: "TaggedText",
		dataType: "T",
		maxLength: 255,
		description: "Scriptable tag storage",
		required: false,
	},
	{
		fieldName: "ABUID",
		dataType: "T",
		maxLength: 255,
		description:
			"Mac Address Book Universal ID--set for imported address book entries only",
		required: false,
	},
];

/**
 * Get field definition by name
 */
export function getNameField(
	fieldName: string,
): MoneyWorksNameField | undefined {
	return MONEYWORKS_NAME_FIELDS.find((f) => f.fieldName === fieldName);
}

/**
 * Get all required fields
 */
export function getRequiredNameFields(): MoneyWorksNameField[] {
	return MONEYWORKS_NAME_FIELDS.filter((f) => f.required);
}

/**
 * Get all indexed fields
 */
export function getIndexedNameFields(): MoneyWorksNameField[] {
	return MONEYWORKS_NAME_FIELDS.filter((f) => f.indexed);
}
