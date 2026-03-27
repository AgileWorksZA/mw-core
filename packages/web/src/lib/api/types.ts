/** Elysia API response wrapper */
export interface ApiResponse<T> {
	data: T;
	metadata: {
		table: string;
		format: string;
		count: number;
		timestamp: string;
		requestId: string;
		pagination?: {
			limit: number;
			offset: number;
			hasMore: boolean;
		};
	};
}

/** Auth token response from POST /auth/token */
export interface AuthTokenResponse {
	accessToken: string;
	refreshToken: string;
	connectionId: string;
	company: {
		name: string;
		dataFile: string;
	};
}

// =================== Screen-level types ===================

/** Name record as returned from /tables/name (subset of 97 fields) */
export interface NameRecord {
	SequenceNumber: number;
	Code: string;
	Name: string;
	CustomerType: number;
	SupplierType: number;
	Kind: number;
	Address1: string;
	Address2: string;
	Address3: string;
	Address4: string;
	PostCode: string;
	State: string;
	DeliveryAddress1: string;
	DeliveryAddress2: string;
	DeliveryAddress3: string;
	DeliveryAddress4: string;
	DeliveryPostCode: string;
	DeliveryState: string;
	Contact: string;
	Phone: string;
	Fax: string;
	Mobile: string;
	email: string;
	WebURL: string;
	Currency: string;
	CreditLimit: number;
	Hold: boolean;
	RecAccount: string;
	PayAccount: string;
	DebtorTerms: number;
	CreditorTerms: number;
	PaymentMethod: number;
	Bank: string;
	BankBranch: string;
	'Account Name': string;
	BankAccountNumber: string;
	EInvoiceID: string;
	DCurrent: number;
	D30Plus: number;
	D60Plus: number;
	D90Plus: number;
	CCurrent: number;
	TaxCode: string;
	TaxNumber: string;
	TheirRef: string;
	ProductPricing: string;
	SalesPerson: string;
	Category1: string;
	Category2: string;
	Category3: string;
	Category4: string;
	Colour: number;
	Flags: number;
	Comment: string;
	Discount: number;
	Datelastsale: string;
	CreditCardNum: string;
	CreditCardName: string;
	CreditCardExpiry: string;
	Custom1: string;
	Custom2: string;
	Custom3: string;
	Custom4: string;
}

/** Contact sub-record from /tables/contact */
export interface ContactRecord {
	ParentSeq: number;
	SequenceNumber: number;
	Order: number;
	Role: number;
	Contact: string;
	Salutation: string;
	Position: string;
	Memo: string;
	eMail: string;
	Mobile: string;
	DDI: string;
	AfterHours: string;
	Colour: number;
}

/** Transaction record from /tables/transaction */
export interface TransactionRecord {
	Sequencenumber: number;
	Ourref: string;
	Theirref: string;
	Type: string;
	Status: string;
	Transdate: string;
	Duedate: string;
	Enterdate: string;
	Period: number;
	Namecode: string;
	Description: string;
	Gross: number;
	Taxamount: number;
	Amtpaid: number;
	Hold: boolean;
	Colour: number;
	Salesperson: string;
	Contra: string;
	Paymentmethod: number;
	Enteredby: string;
	Postedby: string;
	Currency: string;
	Exchangerate: number;
	Analysis: string;
	Freightamount: number;
	Ordertotal: number;
	Ordershipped: number;
	Deliveryaddress: string;
	Mailingaddress: string;
	Flag: string;
	Amtwrittenoff: number;
}

/** Detail (line item) record from /tables/detail */
export interface DetailRecord {
	ParentSeq: number;
	Sort: number;
	Account: string;
	Description: string;
	Debit: number;
	Credit: number;
	Tax: number;
	Gross: number;
	StockCode: string;
	StockQty: number;
	UnitPrice: number;
	CostPrice: number;
	Discount: number;
	SaleUnit: string;
	TaxCode: string;
	JobCode: string;
	TransactionType: string;
}

/** Product record from /tables/product */
export interface ProductRecord {
	Code: string;
	Description: string;
	Sellprice: number;
	Costprice: number;
	Taxcode: string;
	Sellunit: string;
	Supplier: string;
	Supplierscode: string;
	Comment: string;
	Category1: string;
	Category2: string;
	Category3: string;
	Category4: string;
	Salesacct: string;
	Cogacct: string;
	Stockacct: string;
	Buyunit: string;
	Buyprice: number;
	Buytaxcodeoverride: string;
	Selltaxcodeoverride: string;
	Plussage: number;
	Stockonhand: number;
	Stockvalue: number;
	Reorderlevel: number;
	Flags: number;
	Colour: number;
	Type: string;
	Usemultipleprices: number;
	Sellpriceb: number;
	Sellpricec: number;
	Sellpriced: number;
	Sellpricee: number;
	Sellpricef: number;
	Selldiscount: number;
	Barcode: string;
	Conversionfactor: number;
	Marginwarning: number;
	Sellweight: number;
	Leadtimedays: number;
}

/** Tax rate record from /tables/taxrate */
export interface TaxRateRecord {
	TaxCode: string;
	Ratename: string;
	Rate1: number;
	Rate2: number;
	Type: number;
}

/** Account record from /tables/account */
export interface AccountRecord {
	Code: string;
	Description: string;
	Type: string;
	Group: string;
	Category: string;
	Category2: string;
	Category3: string;
	Category4: string;
	Pandl: string;
	TaxCode: string;
	Flags: number;
	System: string;
	Colour: number;
	Currency: string;
	BankAccountNumber: string;
	Accountantcode: string;
	Comments: string;
	SecurityLevel: number;
}

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
	CA: 'Current Asset',
	FA: 'Fixed Asset',
	CL: 'Current Liability',
	SF: 'Equity',
	IN: 'Income',
	CS: 'Cost of Sales',
	EX: 'Expense',
	SA: 'Other Income/Exp'
};

export interface AccountListItem {
	code: string;
	description: string;
	type: string;
	typeLabel: string;
	group: string;
	category: string;
	taxCode: string;
	colour: number;
	system: string;
	bankAccountNumber: string;
}

// =================== BFF Screen shapes ===================

export interface NameScreenData {
	name: {
		header: {
			code: string;
			name: string;
			colour: number;
			flags: {
				customer: boolean;
				supplier: boolean;
				debtor: boolean;
				creditor: boolean;
			};
		};
		details: {
			mailing: string[];
			delivery: string[];
			postCode: string;
			state: string;
			deliveryPostCode: string;
			deliveryState: string;
			phone: string;
			fax: string;
			mobile: string;
			email: string;
			webUrl: string;
			gstNo: string;
			theirRef: string;
			comment: string;
			category1: string;
			category2: string;
			category3: string;
			category4: string;
		};
		pricingTerms: {
			discount: number;
			priceCode: string;
			taxCode: string;
			currency: string;
			creditHold: boolean;
			salesPerson: string;
			creditLimit: number;
			debtorTerms: number;
			creditorTerms: number;
			recAccount: string;
			payAccount: string;
		};
		bankEdi: {
			payBy: number;
			bank: string;
			branch: string;
			accountName: string;
			accountNumber: string;
			eInvoicingId: string;
			cardNumber: string;
			cardName: string;
			cardExpiry: string;
		};
		balances: {
			debtor: {
				threeOrMore: number;
				twoCycles: number;
				oneCycle: number;
				current: number;
				theyOwe: number;
			};
			creditor: {
				weOwe: number;
			};
			dateOfLastSale: string;
		};
		contacts: Array<{
			name: string;
			role: number;
			salutation: string;
			position: string;
			phone: string;
			mobile: string;
			email: string;
			memo: string;
		}>;
	};
	transactionHistory: Array<{
		status: string;
		type: string;
		ourRef: string;
		description: string;
		period: number;
		date: string;
		gross: number;
	}>;
	lookups: {
		taxCodes: Array<{ code: string; name: string; rate: number }>;
		accounts: Array<{ code: string; description: string; type: string }>;
	};
}

export interface NameListItem {
	code: string;
	name: string;
	phone: string;
	category: string;
	colour: number;
	customerType: number;
	supplierType: number;
	hold: boolean;
	dBalance: number;
	cBalance: number;
}

// =================== Transaction Screen types ===================

export const TX_TYPE_LABELS: Record<string, string> = {
	DI: 'Sales Invoice',
	CI: 'Purchase Invoice',
	CR: 'Receipt',
	CP: 'Payment',
	JN: 'Journal',
	SO: 'Sales Order',
	PO: 'Purchase Order',
	QU: 'Quote'
};

export interface TransactionListItem {
	id: number;
	type: string;
	typeLabel: string;
	status: string;
	ourRef: string;
	theirRef: string;
	nameCode: string;
	description: string;
	date: string;
	dueDate: string;
	period: number;
	gross: number;
	amtPaid: number;
	outstanding: number;
	colour: number;
	hold: boolean;
}

export interface TransactionScreenData {
	transaction: {
		header: {
			id: number;
			type: string;
			typeLabel: string;
			status: string;
			ourRef: string;
			theirRef: string;
			date: string;
			dueDate: string;
			period: number;
			colour: number;
			hold: boolean;
			description: string;
			analysis: string;
			salesPerson: string;
			contra: string;
			paymentMethod: number;
			currency: string;
			exchangeRate: number;
			deliveryAddress: string;
			mailingAddress: string;
			enteredBy: string;
			postedBy: string;
			enterDate: string;
			flag: string;
		};
		name: {
			code: string;
			name: string;
			colour: number;
		};
		lineItems: Array<{
			sort: number;
			account: string;
			accountDescription: string;
			description: string;
			debit: number;
			credit: number;
			tax: number;
			gross: number;
			stockCode: string;
			stockQty: number;
			unitPrice: number;
			discount: number;
			unit: string;
			taxCode: string;
			jobCode: string;
		}>;
		totals: {
			subtotal: number;
			tax: number;
			gross: number;
			amtPaid: number;
			outstanding: number;
			lineCount: number;
		};
	};
	lookups: {
		taxCodes: Array<{ code: string; name: string; rate: number }>;
		accounts: Array<{ code: string; description: string; type: string }>;
		products: Array<{ code: string; description: string; price: number; unit: string }>;
	};
}

// =================== Items Screen types ===================

export interface ItemListItem {
	code: string;
	description: string;
	sellPrice: number;
	unit: string;
	stockOnHand: number;
	colour: number;
	type: string;
	supplier: string;
	category1: string;
}

export interface ItemScreenData {
	item: {
		header: {
			code: string;
			description: string;
			type: string;
			colour: number;
			category1: string;
			category2: string;
			category3: string;
			category4: string;
			barcode: string;
			comment: string;
		};
		flags: {
			weBuy: boolean;
			weSell: boolean;
			weCount: boolean;
			weStock: boolean;
		};
		controlAccounts: {
			salesAcct: string;
			salesAcctDesc: string;
			cogsAcct: string;
			cogsAcctDesc: string;
			stockAcct: string;
			stockAcctDesc: string;
		};
		buying: {
			supplier: string;
			supplierCode: string;
			buyPrice: number;
			buyUnit: string;
			buyTaxCode: string;
			plussage: number;
			reorderLevel: number;
			leadTimeDays: number;
			conversionFactor: number;
		};
		selling: {
			sellPrice: number;
			sellUnit: string;
			sellTaxCode: string;
			discount: number;
			marginWarning: number;
			sellWeight: number;
			useMultiplePrices: boolean;
			priceB: number;
			priceC: number;
			priceD: number;
			priceE: number;
			priceF: number;
		};
		inventory: {
			stockOnHand: number;
			stockValue: number;
			costPrice: number;
		};
	};
	lookups: {
		taxCodes: Array<{ code: string; name: string; rate: number }>;
		accounts: Array<{ code: string; description: string; type: string }>;
	};
}
