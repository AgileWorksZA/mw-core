/**
 * MoneyWorks Account Enumerations
 *
 * @moneyworks-entity Account
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks accounts
 * @ai-critical NEVER create your own account-related enums or use generic terms
 */

/**
 * MoneyWorks Account Type Classification
 * Source: MoneyWorks Account documentation - "Type" field
 *
 * @ai-instruction When discussing account types, ALWAYS use these MoneyWorks classifications
 * @ai-forbidden account-category, ledger-type, gl-type
 * @ai-required Use exact MW type codes (CA, FA, TA, CL, TL, SF, INC, EXP)
 */
export enum MoneyWorksAccountType {
	/**
	 * Current Assets - short-term assets (cash, receivables, inventory)
	 * @moneyworks-value "CA"
	 * @ai-term Say "Current Asset", NEVER "short-term asset" or "liquid asset"
	 */
	CURRENT_ASSET = "CA",

	/**
	 * Fixed Assets - long-term tangible assets (equipment, property)
	 * @moneyworks-value "FA"
	 * @ai-term Say "Fixed Asset", NEVER "non-current asset" or "capital asset"
	 */
	FIXED_ASSET = "FA",

	/**
	 * Trade Accounts - Accounts Receivable (Debtors)
	 * @moneyworks-value "TA"
	 * @ai-term Say "Trade Account" or "Accounts Receivable", NEVER "AR" or "debtors ledger"
	 */
	TRADE_ACCOUNT = "TA",

	/**
	 * Current Liabilities - short-term obligations (payables, accruals)
	 * @moneyworks-value "CL"
	 * @ai-term Say "Current Liability", NEVER "short-term debt" or "current debt"
	 */
	CURRENT_LIABILITY = "CL",

	/**
	 * Trade Liabilities - Accounts Payable (Creditors)
	 * @moneyworks-value "TL"
	 * @ai-term Say "Trade Liability" or "Accounts Payable", NEVER "AP" or "creditors ledger"
	 */
	TRADE_LIABILITY = "TL",

	/**
	 * Shareholders Funds / Equity - ownership stake and retained earnings
	 * @moneyworks-value "SF"
	 * @ai-term Say "Shareholders Funds" or "Equity", NEVER "net worth" or "owner's equity"
	 */
	SHAREHOLDERS_FUNDS = "SF",

	/**
	 * Income - revenue accounts
	 * @moneyworks-value "INC"
	 * @ai-term Say "Income", NEVER "revenue" or "sales account"
	 */
	INCOME = "INC",

	/**
	 * Expense - cost and expense accounts
	 * @moneyworks-value "EXP"
	 * @ai-term Say "Expense", NEVER "cost" or "expenditure"
	 */
	EXPENSE = "EXP",
}

/**
 * Account Sub-Types for more granular classification
 * These vary by account type
 *
 * @ai-instruction SubType provides additional classification within account types
 */
export enum MoneyWorksAccountSubType {
	/**
	 * Bank account (CA subtype)
	 * @ai-term Say "Bank", NEVER "checking" or "savings"
	 */
	BANK = "Bank",

	/**
	 * Cash on hand (CA subtype)
	 * @ai-term Say "Cash", NEVER "petty cash" or "cash drawer"
	 */
	CASH = "Cash",

	/**
	 * Credit Card account (CL subtype)
	 * @ai-term Say "Credit Card", NEVER "CC" or "card account"
	 */
	CREDIT_CARD = "Credit Card",

	/**
	 * GST/VAT Control account
	 * @ai-term Say "GST Control", NEVER "tax account" or "VAT control"
	 */
	GST_CONTROL = "GST",

	/**
	 * Retained Earnings (SF subtype)
	 * @ai-term Say "Retained Earnings", NEVER "accumulated profit" or "reserves"
	 */
	RETAINED_EARNINGS = "Retained Earnings",

	/**
	 * Standard/General account (no specific subtype)
	 */
	STANDARD = "",
}

/**
 * MoneyWorks Account Status
 *
 * @ai-instruction Use when discussing account availability
 */
export enum MoneyWorksAccountStatus {
	/**
	 * Active and available for transactions
	 * @ai-term Say "active", NEVER "enabled" or "open"
	 */
	ACTIVE = "ACTIVE",

	/**
	 * Inactive/discontinued - not available for new transactions
	 * @ai-term Say "inactive", NEVER "disabled", "closed", or "archived"
	 */
	INACTIVE = "INACTIVE",
}

/**
 * MoneyWorks Account Flags (bitwise)
 * Control various account behaviors
 *
 * @ai-instruction Use bitwise operations to check account flags
 */
export enum MoneyWorksAccountFlags {
	/**
	 * No special flags
	 */
	NONE = 0,

	/**
	 * Account is a control/summary account
	 * @ai-term Say "control account", NEVER "summary account" or "parent account"
	 */
	CONTROL_ACCOUNT = 1,

	/**
	 * Account is a bank account
	 * @ai-term Say "bank account", NEVER "cash account"
	 */
	BANK_ACCOUNT = 2,

	/**
	 * Account tracks foreign currency
	 * @ai-term Say "foreign currency", NEVER "multi-currency" or "FX"
	 */
	FOREIGN_CURRENCY = 4,

	/**
	 * Account is inactive
	 * @ai-term Say "inactive", NEVER "disabled"
	 */
	INACTIVE = 8,
}

/**
 * Balance Sheet Account Types
 * Used for financial reporting - includes all asset, liability, and equity types
 *
 * @ai-instruction Use this array to identify balance sheet accounts
 */
export const BALANCE_SHEET_TYPES: MoneyWorksAccountType[] = [
	MoneyWorksAccountType.CURRENT_ASSET,
	MoneyWorksAccountType.FIXED_ASSET,
	MoneyWorksAccountType.TRADE_ACCOUNT,
	MoneyWorksAccountType.CURRENT_LIABILITY,
	MoneyWorksAccountType.TRADE_LIABILITY,
	MoneyWorksAccountType.SHAREHOLDERS_FUNDS,
];

/**
 * Profit & Loss Account Types
 * Used for financial reporting - includes income and expense types
 *
 * @ai-instruction Use this array to identify P&L accounts
 */
export const PROFIT_LOSS_TYPES: MoneyWorksAccountType[] = [
	MoneyWorksAccountType.INCOME,
	MoneyWorksAccountType.EXPENSE,
];

/**
 * Check if account type is a balance sheet type
 */
export function isBalanceSheetType(type: MoneyWorksAccountType): boolean {
	return BALANCE_SHEET_TYPES.includes(type);
}

/**
 * Check if account type is a profit & loss type
 */
export function isProfitLossType(type: MoneyWorksAccountType): boolean {
	return PROFIT_LOSS_TYPES.includes(type);
}
