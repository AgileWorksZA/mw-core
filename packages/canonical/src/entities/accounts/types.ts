/**
 * MoneyWorks Account Type Definitions
 *
 * @moneyworks-entity Account
 * @moneyworks-table Account
 * @moneyworks-manual moneyworks_appendix_accounts.html
 * @moneyworks-dsl PURE
 *
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate to generic business terms.
 * @ai-forbidden gl-account, ledger-account, coa-entry, chart-entry
 * @ai-required Code, Name, Type, SubType, Balance
 */

import type { AccountCode } from "@moneyworks/utilities";
import type { MoneyWorksAccountType, MoneyWorksAccountSubType } from "./enums";

/**
 * MoneyWorks Account Entity
 *
 * CRITICAL: Accounts represent the Chart of Accounts structure
 * with balance tracking, type classification, and banking integration.
 *
 * @ai-critical NEVER translate MoneyWorks field names (Code, Name, Type, SubType)
 * @ai-context Even for common terms like "GL Account", use MoneyWorks "Account"
 */
export interface MoneyWorksAccount {
	/**
	 * The account code (primary key)
	 * @moneyworks-field Code
	 * @moneyworks-type T(13)
	 * @ai-term ALWAYS use "Code", NEVER "account number", "GL code", or "account ID"
	 * @example "1000", "2100", "4000", "5000"
	 */
	Code: AccountCode;

	/**
	 * The account name/description
	 * @moneyworks-field Name
	 * @moneyworks-type T(31)
	 * @ai-term ALWAYS use "Name", NEVER "description", "title", or "account name"
	 */
	Name: string;

	/**
	 * Account type classification
	 * @moneyworks-field Type
	 * @moneyworks-type T(3)
	 * @ai-term ALWAYS use "Type", NEVER "account type" or "category"
	 * @ai-context CA, FA, TA, CL, TL, SF, INC, EXP
	 */
	Type: MoneyWorksAccountType | string;

	/**
	 * Account sub-type for further classification
	 * @moneyworks-field SubType
	 * @moneyworks-type T(20)
	 * @ai-term ALWAYS use "SubType", NEVER "sub-category" or "account sub-type"
	 */
	SubType?: MoneyWorksAccountSubType | string;

	/**
	 * Current balance of the account
	 * @moneyworks-field Balance
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Balance", NEVER "current balance" or "account balance"
	 * @ai-context Positive for assets/expenses, negative for liabilities/income
	 */
	Balance?: number;

	/**
	 * Opening balance for the period
	 * @moneyworks-field OpeningBalance
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "OpeningBalance", NEVER "starting balance" or "beginning balance"
	 */
	OpeningBalance?: number;

	/**
	 * Budget amount for the period
	 * @moneyworks-field Budget
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Budget", NEVER "budgeted amount" or "planned amount"
	 */
	Budget?: number;

	/**
	 * Budget for the entire year
	 * @moneyworks-field YearBudget
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "YearBudget", NEVER "annual budget"
	 */
	YearBudget?: number;

	// BANK ACCOUNT FIELDS

	/**
	 * Bank account number (for bank accounts)
	 * @moneyworks-field BankAccount
	 * @moneyworks-type T(23)
	 * @ai-term ALWAYS use "BankAccount", NEVER "account number" or "bank number"
	 */
	BankAccount?: string;

	/**
	 * Bank name
	 * @moneyworks-field Bank
	 * @moneyworks-type T(7)
	 * @ai-term ALWAYS use "Bank", NEVER "bank name" or "financial institution"
	 */
	Bank?: string;

	/**
	 * Bank branch
	 * @moneyworks-field BankBranch
	 * @moneyworks-type T(21)
	 * @ai-term ALWAYS use "BankBranch", NEVER "branch name" or "branch code"
	 */
	BankBranch?: string;

	/**
	 * Account name at bank
	 * @moneyworks-field BankAccountName
	 * @moneyworks-type T(21)
	 * @ai-term ALWAYS use "BankAccountName", NEVER "account holder" or "account title"
	 */
	BankAccountName?: string;

	// CONTROL ACCOUNT FIELDS

	/**
	 * Parent/control account code
	 * @moneyworks-field ControlAccount
	 * @moneyworks-type T(13)
	 * @ai-term ALWAYS use "ControlAccount", NEVER "parent account" or "summary account"
	 */
	ControlAccount?: AccountCode;

	/**
	 * Alternative account for certain operations
	 * @moneyworks-field AltAccount
	 * @moneyworks-type T(13)
	 * @ai-term ALWAYS use "AltAccount", NEVER "alternate account" or "secondary account"
	 */
	AltAccount?: AccountCode;

	// TAX/GST FIELDS

	/**
	 * Default tax code for this account
	 * @moneyworks-field TaxCode
	 * @moneyworks-type T(5)
	 * @ai-term ALWAYS use "TaxCode", NEVER "tax rate" or "GST code"
	 */
	TaxCode?: string;

	/**
	 * GST/Tax classification for reporting
	 * @moneyworks-field GSTClass
	 * @moneyworks-type T(7)
	 * @ai-term ALWAYS use "GSTClass", NEVER "tax class" or "VAT category"
	 */
	GSTClass?: string;

	// CURRENCY FIELDS

	/**
	 * Currency code for foreign currency accounts
	 * @moneyworks-field Currency
	 * @moneyworks-type T(3)
	 * @ai-term ALWAYS use "Currency", NEVER "currency code" or "FX currency"
	 */
	Currency?: string;

	// CATEGORIZATION FIELDS

	/**
	 * User-defined category 1
	 * @moneyworks-field Category1
	 * @moneyworks-type T(15)
	 */
	Category1?: string;

	/**
	 * User-defined category 2
	 * @moneyworks-field Category2
	 * @moneyworks-type T(15)
	 */
	Category2?: string;

	/**
	 * User-defined category 3
	 * @moneyworks-field Category3
	 * @moneyworks-type T(15)
	 */
	Category3?: string;

	/**
	 * User-defined category 4
	 * @moneyworks-field Category4
	 * @moneyworks-type T(15)
	 */
	Category4?: string;

	// STATUS AND FLAGS

	/**
	 * Account flags (bitwise)
	 * @moneyworks-field Flags
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Flags", NEVER "options" or "settings"
	 * @ai-context Check individual flags with bitwise operations
	 */
	Flags?: number;

	/**
	 * Whether account is active
	 * @moneyworks-field Active
	 * @moneyworks-type B
	 * @ai-term ALWAYS use "Active", NEVER "enabled" or "is_active"
	 */
	Active?: boolean;

	// METADATA

	/**
	 * The colour of the account record
	 * @moneyworks-field Colour
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Colour" (British spelling), NEVER "color"
	 * @ai-context Numeric index 0-7
	 */
	Colour?: number;

	/**
	 * Comment/notes about the account
	 * @moneyworks-field Comment
	 * @moneyworks-type T(1020)
	 */
	Comment?: string;

	/**
	 * Date and time record was last modified
	 * @moneyworks-field LastModifiedTime
	 * @moneyworks-type S
	 */
	LastModifiedTime?: string;

	// CUSTOM FIELDS

	/**
	 * Custom field 1
	 * @moneyworks-field Custom1
	 * @moneyworks-type T(255)
	 */
	Custom1?: string;

	/**
	 * Custom field 2
	 * @moneyworks-field Custom2
	 * @moneyworks-type T(255)
	 */
	Custom2?: string;

	/**
	 * Custom field 3
	 * @moneyworks-field Custom3
	 * @moneyworks-type T(15)
	 */
	Custom3?: string;

	/**
	 * Custom field 4
	 * @moneyworks-field Custom4
	 * @moneyworks-type T(15)
	 */
	Custom4?: string;

	// USER-DEFINED FIELDS

	/**
	 * Scriptable number
	 * @moneyworks-field UserNum
	 * @moneyworks-type N
	 */
	UserNum?: number;

	/**
	 * Scriptable text
	 * @moneyworks-field UserText
	 * @moneyworks-type T(255)
	 */
	UserText?: string;

	/**
	 * Scriptable tag storage
	 * @moneyworks-field TaggedText
	 * @moneyworks-type T(255)
	 */
	TaggedText?: string;
}

/**
 * MoneyWorks Account creation input
 * Only required fields for creating a new account
 *
 * @ai-instruction When creating accounts, use this interface
 */
export interface MoneyWorksAccountCreateInput {
	Code: AccountCode;
	Name: string;
	Type: MoneyWorksAccountType | string;
	SubType?: MoneyWorksAccountSubType | string;
}

/**
 * MoneyWorks Account update input
 * All fields optional except Code for identification
 *
 * @ai-instruction When updating accounts, use this interface
 */
export interface MoneyWorksAccountUpdateInput {
	Code: AccountCode;
	Name?: string;
	Type?: MoneyWorksAccountType | string;
	SubType?: MoneyWorksAccountSubType | string;

	// Balance fields (usually read-only, but included for completeness)
	OpeningBalance?: number;
	Budget?: number;
	YearBudget?: number;

	// Bank fields
	BankAccount?: string;
	Bank?: string;
	BankBranch?: string;
	BankAccountName?: string;

	// Control fields
	ControlAccount?: AccountCode;
	AltAccount?: AccountCode;

	// Tax fields
	TaxCode?: string;
	GSTClass?: string;

	// Currency
	Currency?: string;

	// Categories
	Category1?: string;
	Category2?: string;
	Category3?: string;
	Category4?: string;

	// Status
	Flags?: number;
	Active?: boolean;

	// Metadata
	Colour?: number;
	Comment?: string;

	// Custom fields
	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;

	// User-defined
	UserNum?: number;
	UserText?: string;
	TaggedText?: string;
}

/**
 * MoneyWorks Account filter for search/query operations
 *
 * @ai-instruction When searching accounts, use this interface
 */
export interface MoneyWorksAccountFilter {
	/** Filter by account code */
	code?: AccountCode;

	/** Filter by account name (partial match) */
	name?: string;

	/** Filter by account type */
	type?: MoneyWorksAccountType | string;

	/** Filter by sub-type */
	subType?: MoneyWorksAccountSubType | string;

	/** Filter by active status */
	active?: boolean;

	/** Filter by category */
	category1?: string;
	category2?: string;
	category3?: string;
	category4?: string;

	/** Filter by currency */
	currency?: string;

	/** Filter bank accounts only */
	isBankAccount?: boolean;

	/** Filter control accounts only */
	isControlAccount?: boolean;

	/** Search text (searches Code, Name) */
	searchText?: string;
}
