/**
 * MoneyWorks Detail (Transaction Line) Type Definitions
 *
 * @moneyworks-entity Detail
 * @moneyworks-table Detail
 * @moneyworks-dsl PURE
 *
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate to generic business terms.
 * @ai-forbidden lineItem, invoiceLine, orderLine
 * @ai-required ParentSeq, Sort, Account
 *
 * Detail contains transaction line items. Each Detail links to a Transaction header.
 * Relationship: Detail.ParentSeq -> Transaction.SequenceNumber
 *
 * NOTE: MoneyWorks stores these with "Detail." prefix in the API.
 * The interface uses unprefixed names for convenience.
 */

/**
 * MoneyWorks Detail field definitions
 * Source: moneyworks_appendix_transactions.html - Detail fields
 *
 * Note: Field names in MW API include "Detail." prefix (e.g., "Detail.Account")
 * This array shows the field names WITHOUT the prefix for interface mapping.
 *
 * 40+ fields covering:
 * - Identity: ParentSeq, Sort
 * - Accounting: Account, Debit, Credit, Tax
 * - Product: StockCode, StockQty, UnitPrice
 * - Order: OrderQty, OrderStatus, BackorderQty
 * - Job: JobCode, Dept
 * - Metadata: Description, TaxCode, Flags
 */
export const MONEYWORKS_DETAIL_FIELDS = [
	// Identity and relationship
	"ParentSeq",
	"Sort",
	"Period",
	"TransactionType",

	// Account fields
	"Account",
	"Dept",
	"TaxCode",

	// Value fields
	"Debit",
	"Credit",
	"Tax",
	"Gross",
	"ExpensedTax",
	"BaseCurrencyNet",

	// Product fields
	"StockCode",
	"StockQty",
	"UnitPrice",
	"CostPrice",
	"Discount",
	"SaleUnit",
	"StockLocation",
	"SerialNumber",
	"PostedQty",
	"OriginalUnitCost",

	// Order fields
	"OrderQty",
	"OrderStatus",
	"BackorderQty",
	"NonInvRcvdNotInvoicedQty",

	// Job fields
	"JobCode",

	// Description
	"Description",
	"Date",

	// Control fields
	"Flags",
	"MoreFlags",
	"SecurityLevel",
	"Statement",

	// User-defined fields
	"Custom1",
	"Custom2",
	"UserNum",
	"UserText",
	"TaggedText",
] as const;

/**
 * Type for detail field names
 */
export type MoneyWorksDetailField = (typeof MONEYWORKS_DETAIL_FIELDS)[number];

/**
 * MoneyWorks Detail Entity
 *
 * CRITICAL: Detail.ParentSeq links to Transaction.SequenceNumber
 * Composite key: (ParentSeq, Sort) uniquely identifies a line
 *
 * @ai-critical NEVER translate MoneyWorks field names
 * @ai-context Account is required - determines which ledger account is affected
 */
export interface MoneyWorksDetail {
	// =========================================================================
	// IDENTITY AND RELATIONSHIP FIELDS
	// =========================================================================

	/**
	 * Parent transaction sequence number - FOREIGN KEY
	 * @moneyworks-field Detail.ParentSeq
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "ParentSeq", NEVER "transactionId"
	 * @ai-context References Transaction.SequenceNumber - required field
	 */
	ParentSeq: number;

	/**
	 * Sort order within transaction - part of composite key
	 * @moneyworks-field Detail.Sort
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Sort", NEVER "lineNumber" or "order"
	 * @ai-context Determines display order of lines
	 */
	Sort: number;

	/**
	 * Accounting period (same as parent Transaction)
	 * @moneyworks-field Detail.Period
	 * @moneyworks-type N
	 * @ai-context Inherited from parent transaction
	 */
	Period?: number;

	/**
	 * Transaction type abbreviation (2 chars)
	 * @moneyworks-field Detail.TransactionType
	 * @moneyworks-type T(2)
	 * @ai-context First 2 chars of parent Type (CP, CR, CI, DI, JN, PO, SO, QU)
	 */
	TransactionType?: string;

	// =========================================================================
	// ACCOUNT FIELDS
	// =========================================================================

	/**
	 * Account code (may include department suffix)
	 * @moneyworks-field Detail.Account
	 * @moneyworks-type T(14)
	 * @ai-term ALWAYS use "Account", NEVER "accountCode" or "ledgerAccount"
	 * @ai-context References Accounts.Code, required field
	 */
	Account: string;

	/**
	 * Department code
	 * @moneyworks-field Detail.Dept
	 * @moneyworks-type T(5)
	 * @ai-context Cost center allocation
	 */
	Dept?: string;

	/**
	 * Tax code
	 * @moneyworks-field Detail.TaxCode
	 * @moneyworks-type A(5)
	 * @ai-term ALWAYS use "TaxCode", NEVER "vatCode" or "gstCode"
	 * @ai-context References TaxRates.TaxCode
	 */
	TaxCode?: string;

	// =========================================================================
	// VALUE FIELDS
	// =========================================================================

	/**
	 * Debit amount
	 * @moneyworks-field Detail.Debit
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Debit"
	 * @ai-context Amount credited to account when posted (CR, DI)
	 */
	Debit?: number;

	/**
	 * Credit amount
	 * @moneyworks-field Detail.Credit
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Credit"
	 * @ai-context Amount debited from account when posted (CP, CI)
	 */
	Credit?: number;

	/**
	 * Tax amount on line
	 * @moneyworks-field Detail.Tax
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Tax", NEVER "gst" or "vat"
	 */
	Tax?: number;

	/**
	 * Gross value of line
	 * @moneyworks-field Detail.Gross
	 * @moneyworks-type N
	 * @ai-context Line total including tax
	 */
	Gross?: number;

	/**
	 * Non-claimable (expensed) tax
	 * @moneyworks-field Detail.ExpensedTax
	 * @moneyworks-type N
	 * @ai-context For CI/CP with non-recoverable tax
	 */
	ExpensedTax?: number;

	/**
	 * Net amount in base currency
	 * @moneyworks-field Detail.BaseCurrencyNet
	 * @moneyworks-type N
	 * @ai-context For multi-currency transactions
	 */
	BaseCurrencyNet?: number;

	// =========================================================================
	// PRODUCT FIELDS
	// =========================================================================

	/**
	 * Product code
	 * @moneyworks-field Detail.StockCode
	 * @moneyworks-type T(19)
	 * @ai-term ALWAYS use "StockCode", NEVER "productCode" or "sku"
	 * @ai-context References Products.Code, blank for service items
	 */
	StockCode?: string;

	/**
	 * Quantity
	 * @moneyworks-field Detail.StockQty
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "StockQty", NEVER "quantity" or "qty"
	 * @ai-context In buy units (CI/CP) or sell units (CR/DI)
	 */
	StockQty?: number;

	/**
	 * Unit price (exclusive of tax and discount)
	 * @moneyworks-field Detail.UnitPrice
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "UnitPrice", NEVER "price"
	 */
	UnitPrice?: number;

	/**
	 * Cost price
	 * @moneyworks-field Detail.CostPrice
	 * @moneyworks-type N
	 * @ai-context Buy price (purchase) or average value (sale)
	 */
	CostPrice?: number;

	/**
	 * Discount percentage
	 * @moneyworks-field Detail.Discount
	 * @moneyworks-type N
	 * @ai-context Line-level discount percent
	 */
	Discount?: number;

	/**
	 * Selling unit of measure
	 * @moneyworks-field Detail.SaleUnit
	 * @moneyworks-type A(3)
	 * @ai-context Copied from product record
	 */
	SaleUnit?: string;

	/**
	 * Stock location
	 * @moneyworks-field Detail.StockLocation
	 * @moneyworks-type T(15)
	 * @ai-context For multi-location inventory
	 */
	StockLocation?: string;

	/**
	 * Serial or batch number
	 * @moneyworks-field Detail.SerialNumber
	 * @moneyworks-type N
	 * @ai-context For inventory traceability
	 */
	SerialNumber?: number;

	/**
	 * Posted quantity (in sell units)
	 * @moneyworks-field Detail.PostedQty
	 * @moneyworks-type N
	 * @ai-context Quantity adjusted for conversion factor
	 */
	PostedQty?: number;

	/**
	 * Original unit cost before posting
	 * @moneyworks-field Detail.OriginalUnitCost
	 * @moneyworks-type N
	 * @ai-context For stock replenishment tracking
	 */
	OriginalUnitCost?: number;

	// =========================================================================
	// ORDER FIELDS
	// =========================================================================

	/**
	 * Original order quantity
	 * @moneyworks-field Detail.OrderQty
	 * @moneyworks-type N
	 * @ai-context For order tracking
	 */
	OrderQty?: number;

	/**
	 * Order line status
	 * @moneyworks-field Detail.OrderStatus
	 * @moneyworks-type B
	 * @ai-context 0=not shipped/part shipped, 1=fully shipped
	 */
	OrderStatus?: boolean;

	/**
	 * Backorder quantity
	 * @moneyworks-field Detail.BackorderQty
	 * @moneyworks-type N
	 * @ai-context Quantity on backorder
	 */
	BackorderQty?: number;

	/**
	 * Non-inventory items received but not invoiced
	 * @moneyworks-field Detail.NonInvRcvdNotInvoicedQty
	 * @moneyworks-type N
	 */
	NonInvRcvdNotInvoicedQty?: number;

	// =========================================================================
	// JOB FIELDS
	// =========================================================================

	/**
	 * Job code
	 * @moneyworks-field Detail.JobCode
	 * @moneyworks-type T(9)
	 * @ai-term ALWAYS use "JobCode", NEVER "projectCode"
	 * @ai-context References Jobs.Code for job costing
	 */
	JobCode?: string;

	// =========================================================================
	// DESCRIPTION FIELDS
	// =========================================================================

	/**
	 * Line description
	 * @moneyworks-field Detail.Description
	 * @moneyworks-type T(1020)
	 * @ai-term ALWAYS use "Description"
	 */
	Description?: string;

	/**
	 * Line date (also batch expiry date)
	 * @moneyworks-field Detail.Date
	 * @moneyworks-type D
	 */
	Date?: string;

	// =========================================================================
	// CONTROL FIELDS
	// =========================================================================

	/**
	 * Detail flags (bitmask)
	 * @moneyworks-field Detail.Flags
	 * @moneyworks-type N
	 * @ai-context See MoneyWorksDetailFlags
	 */
	Flags?: number;

	/**
	 * More detail flags (bitmask)
	 * @moneyworks-field Detail.MoreFlags
	 * @moneyworks-type N
	 * @ai-context See MoneyWorksDetailMoreFlags
	 */
	MoreFlags?: number;

	/**
	 * Security level (inherited from account)
	 * @moneyworks-field Detail.SecurityLevel
	 * @moneyworks-type N
	 */
	SecurityLevel?: number;

	/**
	 * Reconciliation statement sequence
	 * @moneyworks-field Detail.Statement
	 * @moneyworks-type N
	 * @ai-context 0=not reconciled, -1=saved but not finalized
	 */
	Statement?: number;

	// =========================================================================
	// USER-DEFINED FIELDS
	// =========================================================================

	/**
	 * Custom field 1
	 * @moneyworks-field Detail.Custom1
	 * @moneyworks-type T(31)
	 */
	Custom1?: string;

	/**
	 * Custom field 2
	 * @moneyworks-field Detail.Custom2
	 * @moneyworks-type T(31)
	 */
	Custom2?: string;

	/**
	 * Scriptable number
	 * @moneyworks-field Detail.UserNum
	 * @moneyworks-type N
	 */
	UserNum?: number;

	/**
	 * Scriptable text
	 * @moneyworks-field Detail.UserText
	 * @moneyworks-type T(255)
	 */
	UserText?: string;

	/**
	 * Scriptable tag storage
	 * @moneyworks-field Detail.TaggedText
	 * @moneyworks-type T(255)
	 */
	TaggedText?: string;
}

/**
 * MoneyWorks Detail creation input
 * Required fields for creating a new detail line
 *
 * @ai-instruction ParentSeq and Account are required
 */
export interface MoneyWorksDetailCreateInput {
	/**
	 * Required: Parent transaction sequence number
	 */
	ParentSeq: number;

	/**
	 * Required: Account code
	 */
	Account: string;

	/**
	 * Optional: Sort order (auto-assigned if not provided)
	 */
	Sort?: number;

	/**
	 * Optional: Debit amount
	 */
	Debit?: number;

	/**
	 * Optional: Credit amount
	 */
	Credit?: number;

	/**
	 * Optional: Tax amount
	 */
	Tax?: number;

	/**
	 * Optional: Tax code
	 */
	TaxCode?: string;

	/**
	 * Optional: Description
	 */
	Description?: string;

	/**
	 * Optional: Product code
	 */
	StockCode?: string;

	/**
	 * Optional: Quantity
	 */
	StockQty?: number;

	/**
	 * Optional: Unit price
	 */
	UnitPrice?: number;

	/**
	 * Optional: Discount percent
	 */
	Discount?: number;

	/**
	 * Optional: Job code
	 */
	JobCode?: string;

	/**
	 * Optional: Department
	 */
	Dept?: string;

	/**
	 * Optional: Stock location
	 */
	StockLocation?: string;

	/**
	 * Optional: Custom fields
	 */
	Custom1?: string;
	Custom2?: string;
	UserNum?: number;
	UserText?: string;
	TaggedText?: string;
}

/**
 * MoneyWorks Detail update input
 * All fields optional - only include fields being changed
 *
 * @ai-instruction Note: ParentSeq and Sort cannot be changed
 */
export interface MoneyWorksDetailUpdateInput {
	Account?: string;
	Debit?: number;
	Credit?: number;
	Tax?: number;
	TaxCode?: string;
	Description?: string;
	StockCode?: string;
	StockQty?: number;
	UnitPrice?: number;
	Discount?: number;
	JobCode?: string;
	Dept?: string;
	StockLocation?: string;
	Custom1?: string;
	Custom2?: string;
	UserNum?: number;
	UserText?: string;
	TaggedText?: string;
}

/**
 * MoneyWorks Detail filter for search/query operations
 *
 * @ai-instruction Use for querying detail lines
 */
export interface MoneyWorksDetailFilter {
	/**
	 * Filter by parent transaction
	 */
	parentSeq?: number;

	/**
	 * Filter by account code
	 */
	account?: string;

	/**
	 * Filter by product code
	 */
	stockCode?: string;

	/**
	 * Filter by job code
	 */
	jobCode?: string;

	/**
	 * Filter by tax code
	 */
	taxCode?: string;

	/**
	 * Filter by period
	 */
	period?: number;

	/**
	 * Search text (searches Description)
	 */
	searchText?: string;
}
