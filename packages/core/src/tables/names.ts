/**
 * MoneyWorks Names Table Interface
 *
 * The Names file contains all the names used in MoneyWorks including
 * customers, suppliers, and general ledger contact information.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_names.html
 */

/**
 * Customer/Supplier type indicator
 * @description Determines whether a name record is a customer, supplier, or both
 */
export enum NameType {
	/** Not a customer or supplier (general name only) */
	Neither = 0,
	/** Customer only */
	Customer = 1,
	/** Both customer and supplier (debtor) */
	Both = 2,
}

/**
 * Color codes for visual identification
 * @description Numeric color index for UI display
 */
export enum NameColor {
	Black = 0,
	White = 1,
	Red = 2,
	Green = 3,
	Blue = 4,
	Yellow = 5,
	Magenta = 6,
	Cyan = 7,
}

/**
 * Payment methods
 * @description Tracks preferred payment method
 */
export enum PaymentMethod {
	None = 0,
	Cash = 1,
	Cheque = 2,
	Electronic = 3,
}

/**
 * Creditor balance fields
 * @description Outstanding amounts owed to suppliers by age
 */
export interface CreditorBalances {
	/** Current balance */
	Current: number;
	/** 30 days overdue */
	Days30: number;
	/** 60 days overdue */
	Days60: number;
	/** 90+ days overdue */
	Days90Plus: number;
}

/**
 * Debtor balance fields
 * @description Outstanding amounts owed by customers by age
 */
export interface DebtorBalances {
	/** Current balance */
	Current: number;
	/** 30 days overdue */
	Days30: number;
	/** 60 days overdue */
	Days60: number;
	/** 90+ days overdue */
	Days90Plus: number;
}

/**
 * MoneyWorks Names Table (Raw Interface)
 * @description Complete interface for the Names table in MoneyWorks with exact field names
 */
export interface Name {
	/**
	 * Unique identifier for the name record
	 * @minLength 1
	 * @maxLength 11
	 * @description First 10 characters are used for display
	 * @example "CUST001"
	 */
	Code: string;

	/**
	 * Full name of the entity
	 * @maxLength 255
	 * @example "Acme Corporation Ltd"
	 */
	Name: string;

	/**
	 * Customer/Supplier classification
	 * @description 0 for not a customer, 1 for customer, 2 for debtor (both customer and supplier)
	 * @default 0
	 */
	CustomerType: NameType;

	/**
	 * Primary mailing address line 1
	 * @maxLength 59
	 */
	Address1?: string;

	/**
	 * Primary mailing address line 2
	 * @maxLength 59
	 */
	Address2?: string;

	/**
	 * Primary mailing address line 3
	 * @maxLength 59
	 */
	Address3?: string;

	/**
	 * Primary mailing address line 4
	 * @maxLength 59
	 */
	Address4?: string;

	/**
	 * Delivery address line 1
	 * @maxLength 59
	 * @description Physical delivery address if different from mailing
	 */
	Delivery1?: string;

	/**
	 * Delivery address line 2
	 * @maxLength 59
	 */
	Delivery2?: string;

	/**
	 * Delivery address line 3
	 * @maxLength 59
	 */
	Delivery3?: string;

	/**
	 * Delivery address line 4
	 * @maxLength 59
	 */
	Delivery4?: string;

	/**
	 * Delivery postcode
	 * @maxLength 12
	 */
	DeliveryPostcode?: string;

	/**
	 * Delivery state/province
	 * @maxLength 4
	 */
	DeliveryState?: string;

	/**
	 * Primary contact person
	 * @maxLength 25
	 */
	Contact?: string;

	/**
	 * Secondary contact person
	 * @maxLength 29
	 */
	Contact2?: string;

	/**
	 * Main phone number
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	Phone?: string;

	/**
	 * Fax number
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	Fax?: string;

	/**
	 * Direct dial number for contact 1
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	DDI?: string;

	/**
	 * Direct dial number for contact 2
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	DDI2?: string;

	/**
	 * Mobile phone number for contact 1
	 * @maxLength 14
	 * @pattern [\d\s\-\+\(\)]+
	 */
	Mobile?: string;

	/**
	 * Mobile phone number for contact 2
	 * @maxLength 13
	 * @pattern [\d\s\-\+\(\)]+
	 */
	Mobile2?: string;

	/**
	 * After hours phone number for contact 1
	 * @maxLength 11
	 * @pattern [\d\s\-\+\(\)]+
	 */
	Afterhours?: string;

	/**
	 * After hours phone number for contact 2
	 * @maxLength 11
	 * @pattern [\d\s\-\+\(\)]+
	 */
	Afterhours2?: string;

	/**
	 * Primary email address
	 * @maxLength 80
	 * @format email
	 * @example "accounts@example.com"
	 */
	email?: string;

	/**
	 * Secondary email address
	 * @maxLength 80
	 * @format email
	 */
	email2?: string;

	/**
	 * Website URL
	 * @maxLength 63
	 * @format uri
	 * @example "https://example.com"
	 */
	WebURL?: string;

	/**
	 * Customer's bank code
	 * @maxLength 7
	 * @relationship References Bank.Code
	 */
	Bank?: string;

	/**
	 * Bank branch identifier
	 * @maxLength 21
	 */
	BankBranch?: string;

	/**
	 * Bank account name
	 * @maxLength 21
	 * @description Name on the bank account
	 */
	"Account Name"?: string;

	/**
	 * Bank account number
	 * @maxLength 23
	 * @description Customer's bank account for payments
	 */
	BankAccountNumber?: string;

	/**
	 * Currency code
	 * @maxLength 3
	 * @description Three-letter currency code (e.g., "USD", "EUR")
	 * @relationship References Currency.Code
	 * @example "USD"
	 */
	Currency?: string;

	/**
	 * Credit limit for customers
	 * @description Maximum outstanding balance allowed. 0 = no limit
	 * @minimum 0
	 * @default 0
	 */
	CreditLimit?: number;

	/**
	 * Creditor payment terms
	 * @description Number of days for payment terms
	 */
	CreditorTerms?: number;

	/**
	 * Debtor payment terms
	 * @description Number of days for payment terms
	 */
	DebtorTerms?: number;

	/**
	 * Prompt payment discount percentage
	 * @description Discount offered for early payment
	 */
	CustPromptPaymentDiscount?: number;

	/**
	 * Prompt payment terms
	 * @description Days within which prompt payment discount applies
	 */
	CustPromptPaymentTerms?: number;

	/**
	 * Sales person code
	 * @maxLength 5
	 * @relationship References User.Code
	 */
	SalesPerson?: string;

	/**
	 * Tax identification number
	 * @maxLength 19
	 * @description GST#, VAT#, ABN etc.
	 */
	TaxNumber?: string;

	/**
	 * Tax code override
	 * @maxLength 5
	 * @description Default tax code for transactions
	 * @relationship References TaxRate.Code
	 */
	TaxCode?: string;

	/**
	 * Comments/notes
	 * @maxLength 1020
	 * @description Free-form notes about this name
	 */
	Comment?: string;

	/**
	 * Color coding
	 * @description Visual identifier in lists
	 * @default 0
	 */
	Colour?: NameColor;

	/**
	 * Status flags
	 * @description Bitwise flags for various status indicators
	 * @see nameHelpers.decodeFlags
	 */
	Flags?: number;

	/**
	 * User-defined category 1
	 * @maxLength 15
	 */
	Category1?: string;

	/**
	 * User-defined category 2
	 * @maxLength 15
	 */
	Category2?: string;

	/**
	 * User-defined category 3
	 * @maxLength 15
	 */
	Category3?: string;

	/**
	 * User-defined category 4
	 * @maxLength 15
	 */
	Category4?: string;

	/**
	 * User-defined custom field 1
	 * @maxLength 255
	 */
	Custom1?: string;

	/**
	 * User-defined custom field 2
	 * @maxLength 255
	 */
	Custom2?: string;

	/**
	 * User-defined custom field 3
	 * @maxLength 255
	 */
	Custom3?: string;

	/**
	 * User-defined custom field 4
	 * @maxLength 255
	 */
	Custom4?: string;

	/**
	 * User-defined custom field 5
	 * @maxLength 255
	 */
	Custom5?: string;

	/**
	 * User-defined custom field 6
	 * @maxLength 255
	 */
	Custom6?: string;

	/**
	 * User-defined custom field 7
	 * @maxLength 255
	 */
	Custom7?: string;

	/**
	 * User-defined custom field 8
	 * @maxLength 255
	 */
	Custom8?: string;

	/**
	 * Credit card number (encrypted)
	 * @maxLength 19
	 * @description Stored encrypted for security
	 */
	CreditCardNum?: string;

	/**
	 * Credit card expiry date
	 * @format MM/YY
	 * @maxLength 5
	 */
	CreditCardExpiry?: string;

	/**
	 * Credit card name
	 * @maxLength 19
	 * @description Name on credit card
	 */
	CreditCardName?: string;

	/**
	 * Preferred payment method
	 * @description How this customer prefers to pay
	 */
	PaymentMethod?: PaymentMethod;

	/**
	 * Current creditor balance
	 * @description Current outstanding balance for suppliers
	 * @readonly
	 */
	CCurrent?: number;

	/**
	 * 30 days creditor balance
	 * @readonly
	 */
	C30Days?: number;

	/**
	 * 60 days creditor balance
	 * @readonly
	 */
	C60Days?: number;

	/**
	 * 90+ days creditor balance
	 * @readonly
	 */
	C90Plus?: number;

	/**
	 * Total creditor balance
	 * @description Sum of all creditor balances
	 * @readonly
	 */
	CBalance?: number;

	/**
	 * Current debtor balance
	 * @description Current outstanding balance for customers
	 * @readonly
	 */
	DCurrent?: number;

	/**
	 * 30 days debtor balance
	 * @readonly
	 */
	D30Plus?: number;

	/**
	 * 60 days debtor balance
	 * @readonly
	 */
	D60Plus?: number;

	/**
	 * 90+ days debtor balance
	 * @readonly
	 */
	D90Plus?: number;

	/**
	 * Total debtor balance
	 * @description Sum of all debtor balances
	 * @readonly
	 */
	DBalance?: number;

	/**
	 * Date of last sale
	 * @format date
	 * @readonly
	 */
	DateOfLastSale?: Date | string;

	/**
	 * Mac Address Book Universal ID
	 * @description Integration with Mac Address Book - set for imported entries only
	 * @platform macOS
	 */
	ABUID?: string;

	/**
	 * Last modification timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	LastModifiedTime?: string;

	/**
	 * User who last modified
	 * @readonly
	 * @note This field may not be present in all MoneyWorks versions
	 */
	ModUser?: string;
}

/**
 * MoneyWorks Names Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface NameCamel {
	/**
	 * Unique identifier for the name record
	 * @minLength 1
	 * @maxLength 11
	 * @description First 10 characters are used for display
	 * @example "CUST001"
	 */
	code: string;

	/**
	 * Full name of the entity
	 * @maxLength 255
	 * @example "Acme Corporation Ltd"
	 */
	name: string;

	/**
	 * Customer/Supplier classification
	 * @description 0 for not a customer, 1 for customer, 2 for debtor (both customer and supplier)
	 * @default 0
	 */
	customerType: NameType;

	/**
	 * Primary mailing address line 1
	 * @maxLength 59
	 */
	address1?: string;

	/**
	 * Primary mailing address line 2
	 * @maxLength 59
	 */
	address2?: string;

	/**
	 * Primary mailing address line 3
	 * @maxLength 59
	 */
	address3?: string;

	/**
	 * Primary mailing address line 4
	 * @maxLength 59
	 */
	address4?: string;

	/**
	 * Delivery address line 1
	 * @maxLength 59
	 * @description Physical delivery address if different from mailing
	 */
	delivery1?: string;

	/**
	 * Delivery address line 2
	 * @maxLength 59
	 */
	delivery2?: string;

	/**
	 * Delivery address line 3
	 * @maxLength 59
	 */
	delivery3?: string;

	/**
	 * Delivery address line 4
	 * @maxLength 59
	 */
	delivery4?: string;

	/**
	 * Delivery postcode
	 * @maxLength 12
	 */
	deliveryPostcode?: string;

	/**
	 * Delivery state/province
	 * @maxLength 4
	 */
	deliveryState?: string;

	/**
	 * Primary contact person
	 * @maxLength 25
	 */
	contact?: string;

	/**
	 * Secondary contact person
	 * @maxLength 29
	 */
	contact2?: string;

	/**
	 * Main phone number
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	phone?: string;

	/**
	 * Fax number
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	fax?: string;

	/**
	 * Direct dial number for contact 1
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	ddi?: string;

	/**
	 * Direct dial number for contact 2
	 * @maxLength 19
	 * @pattern [\d\s\-\+\(\)]+
	 */
	ddi2?: string;

	/**
	 * Mobile phone number for contact 1
	 * @maxLength 14
	 * @pattern [\d\s\-\+\(\)]+
	 */
	mobile?: string;

	/**
	 * Mobile phone number for contact 2
	 * @maxLength 13
	 * @pattern [\d\s\-\+\(\)]+
	 */
	mobile2?: string;

	/**
	 * After hours phone number for contact 1
	 * @maxLength 11
	 * @pattern [\d\s\-\+\(\)]+
	 */
	afterhours?: string;

	/**
	 * After hours phone number for contact 2
	 * @maxLength 11
	 * @pattern [\d\s\-\+\(\)]+
	 */
	afterhours2?: string;

	/**
	 * Primary email address
	 * @maxLength 80
	 * @format email
	 * @example "accounts@example.com"
	 */
	email?: string;

	/**
	 * Secondary email address
	 * @maxLength 80
	 * @format email
	 */
	email2?: string;

	/**
	 * Website URL
	 * @maxLength 63
	 * @format uri
	 * @example "https://example.com"
	 */
	webURL?: string;

	/**
	 * Customer's bank code
	 * @maxLength 7
	 * @relationship References Bank.Code
	 */
	bank?: string;

	/**
	 * Bank branch identifier
	 * @maxLength 21
	 */
	bankBranch?: string;

	/**
	 * Bank account name
	 * @maxLength 21
	 * @description Name on the bank account
	 */
	accountName?: string;

	/**
	 * Bank account number
	 * @maxLength 23
	 * @description Customer's bank account for payments
	 */
	bankAccountNumber?: string;

	/**
	 * Currency code
	 * @maxLength 3
	 * @description Three-letter currency code (e.g., "USD", "EUR")
	 * @relationship References Currency.Code
	 * @example "USD"
	 */
	currency?: string;

	/**
	 * Credit limit for customers
	 * @description Maximum outstanding balance allowed. 0 = no limit
	 * @minimum 0
	 * @default 0
	 */
	creditLimit?: number;

	/**
	 * Creditor payment terms
	 * @description Number of days for payment terms
	 */
	creditorTerms?: number;

	/**
	 * Debtor payment terms
	 * @description Number of days for payment terms
	 */
	debtorTerms?: number;

	/**
	 * Prompt payment discount percentage
	 * @description Discount offered for early payment
	 */
	custPromptPaymentDiscount?: number;

	/**
	 * Prompt payment terms
	 * @description Days within which prompt payment discount applies
	 */
	custPromptPaymentTerms?: number;

	/**
	 * Sales person code
	 * @maxLength 5
	 * @relationship References User.Code
	 */
	salesPerson?: string;

	/**
	 * Tax identification number
	 * @maxLength 19
	 * @description GST#, VAT#, ABN etc.
	 */
	taxNumber?: string;

	/**
	 * Tax code override
	 * @maxLength 5
	 * @description Default tax code for transactions
	 * @relationship References TaxRate.Code
	 */
	taxCode?: string;

	/**
	 * Comments/notes
	 * @maxLength 1020
	 * @description Free-form notes about this name
	 */
	comment?: string;

	/**
	 * Color coding
	 * @description Visual identifier in lists
	 * @default 0
	 */
	colour?: NameColor;

	/**
	 * Status flags
	 * @description Bitwise flags for various status indicators
	 * @see nameHelpers.decodeFlags
	 */
	flags?: number;

	/**
	 * User-defined category 1
	 * @maxLength 15
	 */
	category1?: string;

	/**
	 * User-defined category 2
	 * @maxLength 15
	 */
	category2?: string;

	/**
	 * User-defined category 3
	 * @maxLength 15
	 */
	category3?: string;

	/**
	 * User-defined category 4
	 * @maxLength 15
	 */
	category4?: string;

	/**
	 * User-defined custom field 1
	 * @maxLength 255
	 */
	custom1?: string;

	/**
	 * User-defined custom field 2
	 * @maxLength 255
	 */
	custom2?: string;

	/**
	 * User-defined custom field 3
	 * @maxLength 255
	 */
	custom3?: string;

	/**
	 * User-defined custom field 4
	 * @maxLength 255
	 */
	custom4?: string;

	/**
	 * User-defined custom field 5
	 * @maxLength 255
	 */
	custom5?: string;

	/**
	 * User-defined custom field 6
	 * @maxLength 255
	 */
	custom6?: string;

	/**
	 * User-defined custom field 7
	 * @maxLength 255
	 */
	custom7?: string;

	/**
	 * User-defined custom field 8
	 * @maxLength 255
	 */
	custom8?: string;

	/**
	 * Credit card number (encrypted)
	 * @maxLength 19
	 * @description Stored encrypted for security
	 */
	creditCardNum?: string;

	/**
	 * Credit card expiry date
	 * @format MM/YY
	 * @maxLength 5
	 */
	creditCardExpiry?: string;

	/**
	 * Credit card name
	 * @maxLength 19
	 * @description Name on credit card
	 */
	creditCardName?: string;

	/**
	 * Preferred payment method
	 * @description How this customer prefers to pay
	 */
	paymentMethod?: PaymentMethod;

	/**
	 * Current creditor balance
	 * @description Current outstanding balance for suppliers
	 * @readonly
	 */
	cCurrent?: number;

	/**
	 * 30 days creditor balance
	 * @readonly
	 */
	c30Days?: number;

	/**
	 * 60 days creditor balance
	 * @readonly
	 */
	c60Days?: number;

	/**
	 * 90+ days creditor balance
	 * @readonly
	 */
	c90Plus?: number;

	/**
	 * Total creditor balance
	 * @description Sum of all creditor balances
	 * @readonly
	 */
	cBalance?: number;

	/**
	 * Current debtor balance
	 * @description Current outstanding balance for customers
	 * @readonly
	 */
	dCurrent?: number;

	/**
	 * 30 days debtor balance
	 * @readonly
	 */
	d30Plus?: number;

	/**
	 * 60 days debtor balance
	 * @readonly
	 */
	d60Plus?: number;

	/**
	 * 90+ days debtor balance
	 * @readonly
	 */
	d90Plus?: number;

	/**
	 * Total debtor balance
	 * @description Sum of all debtor balances
	 * @readonly
	 */
	dBalance?: number;

	/**
	 * Date of last sale
	 * @format date
	 * @readonly
	 */
	dateOfLastSale?: Date | string;

	/**
	 * Mac Address Book Universal ID
	 * @description Integration with Mac Address Book - set for imported entries only
	 * @platform macOS
	 */
	abuid?: string;

	/**
	 * Last modification timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	lastModifiedTime?: string;

	/**
	 * User who last modified
	 * @readonly
	 * @note This field may not be present in all MoneyWorks versions
	 */
	modUser?: string;
}

/**
 * Name flags interface
 * @description Decoded representation of the flags field
 */
export interface NameFlags {
	/** Requires order number (0x0001) */
	requiresOrderNumber: boolean;
	/** Customer is on hold - no new transactions allowed */
	onHold: boolean;
	/** Customer is tax exempt */
	taxExempt: boolean;
	/** Print statements for this customer */
	printStatements: boolean;
	/** Customer has agreed to electronic invoicing */
	electronicInvoicing: boolean;
	/** Customer is inactive */
	inactive: boolean;
	/** Suppress reminders for this customer */
	suppressReminders: boolean;
}

/**
 * Converter utilities for Names table
 */
export const nameConverters = {
	/**
	 * Convert from MoneyWorks PascalCase to camelCase
	 */
	toCamelCase(raw: Name): NameCamel {
		return {
			code: raw.Code,
			name: raw.Name,
			customerType: raw.CustomerType,
			address1: raw.Address1,
			address2: raw.Address2,
			address3: raw.Address3,
			address4: raw.Address4,
			delivery1: raw.Delivery1,
			delivery2: raw.Delivery2,
			delivery3: raw.Delivery3,
			delivery4: raw.Delivery4,
			deliveryPostcode: raw.DeliveryPostcode,
			deliveryState: raw.DeliveryState,
			contact: raw.Contact,
			contact2: raw.Contact2,
			phone: raw.Phone,
			fax: raw.Fax,
			ddi: raw.DDI,
			ddi2: raw.DDI2,
			mobile: raw.Mobile,
			mobile2: raw.Mobile2,
			afterhours: raw.Afterhours,
			afterhours2: raw.Afterhours2,
			email: raw.email,
			email2: raw.email2,
			webURL: raw.WebURL,
			bank: raw.Bank,
			bankBranch: raw.BankBranch,
			accountName: raw["Account Name"],
			bankAccountNumber: raw.BankAccountNumber,
			currency: raw.Currency,
			creditLimit: raw.CreditLimit,
			creditorTerms: raw.CreditorTerms,
			debtorTerms: raw.DebtorTerms,
			custPromptPaymentDiscount: raw.CustPromptPaymentDiscount,
			custPromptPaymentTerms: raw.CustPromptPaymentTerms,
			salesPerson: raw.SalesPerson,
			taxNumber: raw.TaxNumber,
			taxCode: raw.TaxCode,
			comment: raw.Comment,
			colour: raw.Colour,
			flags: raw.Flags,
			category1: raw.Category1,
			category2: raw.Category2,
			category3: raw.Category3,
			category4: raw.Category4,
			custom1: raw.Custom1,
			custom2: raw.Custom2,
			custom3: raw.Custom3,
			custom4: raw.Custom4,
			custom5: raw.Custom5,
			custom6: raw.Custom6,
			custom7: raw.Custom7,
			custom8: raw.Custom8,
			creditCardNum: raw.CreditCardNum,
			creditCardExpiry: raw.CreditCardExpiry,
			creditCardName: raw.CreditCardName,
			paymentMethod: raw.PaymentMethod,
			cCurrent: raw.CCurrent,
			c30Days: raw.C30Days,
			c60Days: raw.C60Days,
			c90Plus: raw.C90Plus,
			cBalance: raw.CBalance,
			dCurrent: raw.DCurrent,
			d30Plus: raw.D30Plus,
			d60Plus: raw.D60Plus,
			d90Plus: raw.D90Plus,
			dBalance: raw.DBalance,
			dateOfLastSale: raw.DateOfLastSale,
			abuid: raw.ABUID,
			lastModifiedTime: raw.LastModifiedTime,
			modUser: raw.ModUser,
		};
	},

	/**
	 * Convert from camelCase to MoneyWorks PascalCase
	 */
	fromCamelCase(camel: NameCamel): Name {
		return {
			Code: camel.code,
			Name: camel.name,
			CustomerType: camel.customerType,
			Address1: camel.address1,
			Address2: camel.address2,
			Address3: camel.address3,
			Address4: camel.address4,
			Delivery1: camel.delivery1,
			Delivery2: camel.delivery2,
			Delivery3: camel.delivery3,
			Delivery4: camel.delivery4,
			DeliveryPostcode: camel.deliveryPostcode,
			DeliveryState: camel.deliveryState,
			Contact: camel.contact,
			Contact2: camel.contact2,
			Phone: camel.phone,
			Fax: camel.fax,
			DDI: camel.ddi,
			DDI2: camel.ddi2,
			Mobile: camel.mobile,
			Mobile2: camel.mobile2,
			Afterhours: camel.afterhours,
			Afterhours2: camel.afterhours2,
			email: camel.email,
			email2: camel.email2,
			WebURL: camel.webURL,
			Bank: camel.bank,
			BankBranch: camel.bankBranch,
			"Account Name": camel.accountName,
			BankAccountNumber: camel.bankAccountNumber,
			Currency: camel.currency,
			CreditLimit: camel.creditLimit,
			CreditorTerms: camel.creditorTerms,
			DebtorTerms: camel.debtorTerms,
			CustPromptPaymentDiscount: camel.custPromptPaymentDiscount,
			CustPromptPaymentTerms: camel.custPromptPaymentTerms,
			SalesPerson: camel.salesPerson,
			TaxNumber: camel.taxNumber,
			TaxCode: camel.taxCode,
			Comment: camel.comment,
			Colour: camel.colour,
			Flags: camel.flags,
			Category1: camel.category1,
			Category2: camel.category2,
			Category3: camel.category3,
			Category4: camel.category4,
			Custom1: camel.custom1,
			Custom2: camel.custom2,
			Custom3: camel.custom3,
			Custom4: camel.custom4,
			Custom5: camel.custom5,
			Custom6: camel.custom6,
			Custom7: camel.custom7,
			Custom8: camel.custom8,
			CreditCardNum: camel.creditCardNum,
			CreditCardExpiry: camel.creditCardExpiry,
			CreditCardName: camel.creditCardName,
			PaymentMethod: camel.paymentMethod,
			CCurrent: camel.cCurrent,
			C30Days: camel.c30Days,
			C60Days: camel.c60Days,
			C90Plus: camel.c90Plus,
			CBalance: camel.cBalance,
			DCurrent: camel.dCurrent,
			D30Plus: camel.d30Plus,
			D60Plus: camel.d60Plus,
			D90Plus: camel.d90Plus,
			DBalance: camel.dBalance,
			DateOfLastSale: camel.dateOfLastSale,
			ABUID: camel.abuid,
			LastModifiedTime: camel.lastModifiedTime,
			ModUser: camel.modUser,
		};
	},
};

/**
 * Helper functions for Names table
 */
export const nameHelpers = {
	/**
	 * Decode bitwise flags field into boolean properties
	 * @param flags - The numeric flags value from MoneyWorks
	 * @returns Object with individual flag states
	 */
	decodeFlags(flags: number): NameFlags {
		return {
			requiresOrderNumber: (flags & 0x0001) !== 0,
			onHold: (flags & 0x0002) !== 0,
			taxExempt: (flags & 0x0004) !== 0,
			printStatements: (flags & 0x0008) !== 0,
			electronicInvoicing: (flags & 0x0010) !== 0,
			inactive: (flags & 0x0020) !== 0,
			suppressReminders: (flags & 0x0040) !== 0,
		};
	},

	/**
	 * Encode boolean flags into bitwise numeric value
	 * @param flags - Object with individual flag states
	 * @returns Numeric value for MoneyWorks flags field
	 */
	encodeFlags(flags: NameFlags): number {
		let result = 0;
		if (flags.requiresOrderNumber) result |= 0x0001;
		if (flags.onHold) result |= 0x0002;
		if (flags.taxExempt) result |= 0x0004;
		if (flags.printStatements) result |= 0x0008;
		if (flags.electronicInvoicing) result |= 0x0010;
		if (flags.inactive) result |= 0x0020;
		if (flags.suppressReminders) result |= 0x0040;
		return result;
	},

	/**
	 * Check if a name is a customer
	 * @param type - The customer type value
	 * @returns True if the name can be used as a customer
	 */
	isCustomer(type: NameType): boolean {
		return type === NameType.Customer || type === NameType.Both;
	},

	/**
	 * Check if a name is a supplier
	 * @param type - The customer type value
	 * @returns True if the name can be used as a supplier
	 */
	isSupplier(type: NameType): boolean {
		return type === NameType.Both;
	},

	/**
	 * Format a name code to standard 10-character display format
	 * @param code - The raw code value
	 * @returns Formatted code (max 10 characters)
	 */
	formatCode(code: string): string {
		return code.substring(0, 10);
	},

	/**
	 * Get creditor balances as a grouped object
	 * @param name - The name record
	 * @returns Creditor balance object
	 */
	getCreditorBalances(name: Name): CreditorBalances {
		return {
			Current: name.CCurrent || 0,
			Days30: name.C30Days || 0,
			Days60: name.C60Days || 0,
			Days90Plus: name.C90Plus || 0,
		};
	},

	/**
	 * Get debtor balances as a grouped object
	 * @param name - The name record
	 * @returns Debtor balance object
	 */
	getDebtorBalances(name: Name): DebtorBalances {
		return {
			Current: name.DCurrent || 0,
			Days30: name.D30Plus || 0,
			Days60: name.D60Plus || 0,
			Days90Plus: name.D90Plus || 0,
		};
	},
};
