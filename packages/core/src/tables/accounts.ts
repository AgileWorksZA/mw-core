/**
 * MoneyWorks Accounts Table Interface
 *
 * The Accounts file contains the chart of accounts - the fundamental structure
 * that defines how financial transactions are categorized and reported.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_accounts.html
 */

/**
 * Account type codes
 * @description Determines the financial statement classification
 */
export enum AccountType {
	/** Income */
	Income = "IN",
	/** Sales (subset of Income) */
	Sales = "SA",
	/** Expense */
	Expense = "EX",
	/** Cost of Sales */
	CostOfSales = "CS",
	/** Current Asset */
	CurrentAsset = "CA",
	/** Current Liability */
	CurrentLiability = "CL",
	/** Fixed Asset */
	FixedAsset = "FA",
	/** Term Asset */
	TermAsset = "TA",
	/** Term Liability */
	TermLiability = "TL",
	/** Shareholder's Funds (Equity) */
	ShareholdersFunds = "SF",
}

/**
 * System account types
 * @description Special system accounts with specific behaviors
 */
export enum SystemAccountType {
	/** Ordinary account */
	None = "  ",
	/** Bank Account */
	Bank = "BK",
	/** Profit & Loss control account */
	ProfitLoss = "PL",
	/** Accounts Receivable control */
	AccountsReceivable = "AR",
	/** Accounts Payable control */
	AccountsPayable = "AP",
	/** GST Received */
	GSTReceived = "GR",
	/** GST Paid */
	GSTPaid = "GP",
}

/**
 * Color codes for visual identification
 * @description Numeric color index for UI display
 */
export enum AccountColor {
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
 * MoneyWorks Accounts Table (Raw Interface)
 * @description Complete interface for the Accounts table with exact field names
 */
export interface Account {
	/**
	 * Account code
	 * @maxLength 7
	 * @description Unique identifier for the account
	 * @example "1000"
	 */
	Code: string;

	/**
	 * Account description
	 * @maxLength 39
	 * @description Display name for the account
	 * @example "Petty Cash"
	 */
	Description: string;

	/**
	 * Account type
	 * @maxLength 2
	 * @description Financial statement classification
	 */
	Type: AccountType;

	/**
	 * System account designation
	 * @maxLength 2
	 * @description Special system account type
	 * @default "  "
	 */
	System?: SystemAccountType;

	/**
	 * Currency code
	 * @maxLength 3
	 * @description Three-letter currency code for foreign currency accounts
	 * @relationship References Currency.Code
	 * @example "USD"
	 */
	Currency?: string;

	/**
	 * Accountant's code
	 * @maxLength 9
	 * @description Code in accountant's chart that corresponds to this account
	 */
	AccountantsCode?: string;

	/**
	 * Bank account number
	 * @maxLength 23
	 * @description For bank accounts only
	 */
	BankAccountNumber?: string;

	/**
	 * Category assignment
	 * @maxLength 7
	 * @description Blank if Category is None
	 */
	Category?: string;

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
	 * Color coding
	 * @description Visual identifier in lists
	 * @default 0
	 */
	Colour?: AccountColor;

	/**
	 * Comments/notes
	 * @maxLength 1020
	 * @description Free-form notes about this account
	 */
	Comments?: string;

	/**
	 * Creation timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	Created?: string;

	/**
	 * EBITDA indicator
	 * @maxLength 1
	 * @description Whether account is included in EBITDA calculations
	 */
	EBITDA?: string;

	/**
	 * Account group
	 * @maxLength 5
	 * @description Grouping for reporting purposes
	 */
	Group?: string;

	/**
	 * Last modification timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	LastModifiedTime?: string;

	/**
	 * Last statement import date
	 * @format date
	 * @description For bank accounts - last import date
	 */
	LastStatementImport?: Date | string;

	/**
	 * Manual cheque number
	 * @maxLength 11
	 * @description Next manual cheque number for bank accounts
	 */
	ManualChequeNumber?: string;

	/**
	 * Profit & Loss account
	 * @maxLength 7
	 * @description For balance sheet accounts - associated P&L account
	 * @relationship References Account.Code
	 */
	PandL?: string;

	/**
	 * Printed cheque number
	 * @maxLength 11
	 * @description Next printed cheque number for bank accounts
	 */
	PrintedChequeNumber?: string;

	/**
	 * Security level
	 * @description Access control level
	 */
	SecurityLevel?: number;

	/**
	 * Tagged text
	 * @maxLength 255
	 * @description System-defined tagged information
	 */
	TaggedText?: string;

	/**
	 * Default tax code
	 * @maxLength 3
	 * @description Default tax code for transactions
	 * @relationship References TaxRate.Code
	 */
	TaxCode?: string;

	/**
	 * User-defined numeric field
	 * @description Custom numeric data
	 */
	UserNum?: number;

	/**
	 * User-defined text field
	 * @maxLength 255
	 * @description Custom text data
	 */
	UserText?: string;

	/**
	 * Hidden flag
	 * @description Whether account is hidden from normal views
	 * @note This may be part of flags field
	 */
	Hidden?: boolean;

	/**
	 * Status flags
	 * @description Bitwise flags for various status indicators
	 * @see accountHelpers.decodeFlags
	 */
	Flags?: number;

	/**
	 * Current balance
	 * @description Account balance in account currency
	 * @readonly
	 */
	Balance?: number;

	/**
	 * Foreign currency balance
	 * @description Balance in foreign currency (if applicable)
	 * @readonly
	 */
	BalanceF?: number;

	/**
	 * Local currency balance
	 * @description Balance converted to local currency
	 * @readonly
	 */
	LocalBalance?: number;

	/**
	 * User who last modified
	 * @readonly
	 * @note This field may not be present in all MoneyWorks versions
	 */
	ModUser?: string;
}

/**
 * MoneyWorks Accounts Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface AccountCamel {
	/**
	 * Account code
	 * @maxLength 7
	 * @description Unique identifier for the account
	 * @example "1000"
	 */
	code: string;

	/**
	 * Account description
	 * @maxLength 39
	 * @description Display name for the account
	 * @example "Petty Cash"
	 */
	description: string;

	/**
	 * Account type
	 * @maxLength 2
	 * @description Financial statement classification
	 */
	type: AccountType;

	/**
	 * System account designation
	 * @maxLength 2
	 * @description Special system account type
	 * @default "  "
	 */
	system?: SystemAccountType;

	/**
	 * Currency code
	 * @maxLength 3
	 * @description Three-letter currency code for foreign currency accounts
	 * @relationship References Currency.Code
	 * @example "USD"
	 */
	currency?: string;

	/**
	 * Accountant's code
	 * @maxLength 9
	 * @description Code in accountant's chart that corresponds to this account
	 */
	accountantsCode?: string;

	/**
	 * Bank account number
	 * @maxLength 23
	 * @description For bank accounts only
	 */
	bankAccountNumber?: string;

	/**
	 * Category assignment
	 * @maxLength 7
	 * @description Blank if Category is None
	 */
	category?: string;

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
	 * Color coding
	 * @description Visual identifier in lists
	 * @default 0
	 */
	colour?: AccountColor;

	/**
	 * Comments/notes
	 * @maxLength 1020
	 * @description Free-form notes about this account
	 */
	comments?: string;

	/**
	 * Creation timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	created?: string;

	/**
	 * EBITDA indicator
	 * @maxLength 1
	 * @description Whether account is included in EBITDA calculations
	 */
	ebitda?: string;

	/**
	 * Account group
	 * @maxLength 5
	 * @description Grouping for reporting purposes
	 */
	group?: string;

	/**
	 * Last modification timestamp
	 * @format ISO 8601
	 * @readonly
	 */
	lastModifiedTime?: string;

	/**
	 * Last statement import date
	 * @format date
	 * @description For bank accounts - last import date
	 */
	lastStatementImport?: Date | string;

	/**
	 * Manual cheque number
	 * @maxLength 11
	 * @description Next manual cheque number for bank accounts
	 */
	manualChequeNumber?: string;

	/**
	 * Profit & Loss account
	 * @maxLength 7
	 * @description For balance sheet accounts - associated P&L account
	 * @relationship References Account.Code
	 */
	pandL?: string;

	/**
	 * Printed cheque number
	 * @maxLength 11
	 * @description Next printed cheque number for bank accounts
	 */
	printedChequeNumber?: string;

	/**
	 * Security level
	 * @description Access control level
	 */
	securityLevel?: number;

	/**
	 * Tagged text
	 * @maxLength 255
	 * @description System-defined tagged information
	 */
	taggedText?: string;

	/**
	 * Default tax code
	 * @maxLength 3
	 * @description Default tax code for transactions
	 * @relationship References TaxRate.Code
	 */
	taxCode?: string;

	/**
	 * User-defined numeric field
	 * @description Custom numeric data
	 */
	userNum?: number;

	/**
	 * User-defined text field
	 * @maxLength 255
	 * @description Custom text data
	 */
	userText?: string;

	/**
	 * Hidden flag
	 * @description Whether account is hidden from normal views
	 * @note This may be part of flags field
	 */
	hidden?: boolean;

	/**
	 * Status flags
	 * @description Bitwise flags for various status indicators
	 * @see accountHelpers.decodeFlags
	 */
	flags?: number;

	/**
	 * Current balance
	 * @description Account balance in account currency
	 * @readonly
	 */
	balance?: number;

	/**
	 * Foreign currency balance
	 * @description Balance in foreign currency (if applicable)
	 * @readonly
	 */
	balanceF?: number;

	/**
	 * Local currency balance
	 * @description Balance converted to local currency
	 * @readonly
	 */
	localBalance?: number;

	/**
	 * User who last modified
	 * @readonly
	 * @note This field may not be present in all MoneyWorks versions
	 */
	modUser?: string;
}

/**
 * Account flags interface
 * @description Decoded representation of the flags field
 */
export interface AccountFlags {
	/** Do not reconcile (bank accounts) */
	doNotReconcile: boolean;
	/** Unbanked account */
	unbankedAccount: boolean;
	/** Job code required for transactions */
	jobCodeRequired: boolean;
	/** Account is hidden from normal views */
	hidden: boolean;
	/** Account is locked */
	locked: boolean;
	/** Suppress zero balances in reports */
	suppressZeroBalances: boolean;
}

/**
 * Converter utilities for Accounts table
 */
export const accountConverters = {
	/**
	 * Convert from MoneyWorks PascalCase to camelCase
	 */
	toCamelCase(raw: Account): AccountCamel {
		return {
			code: raw.Code,
			description: raw.Description,
			type: raw.Type,
			system: raw.System,
			currency: raw.Currency,
			accountantsCode: raw.AccountantsCode,
			bankAccountNumber: raw.BankAccountNumber,
			category: raw.Category,
			category2: raw.Category2,
			category3: raw.Category3,
			category4: raw.Category4,
			colour: raw.Colour,
			comments: raw.Comments,
			created: raw.Created,
			ebitda: raw.EBITDA,
			group: raw.Group,
			lastModifiedTime: raw.LastModifiedTime,
			lastStatementImport: raw.LastStatementImport,
			manualChequeNumber: raw.ManualChequeNumber,
			pandL: raw.PandL,
			printedChequeNumber: raw.PrintedChequeNumber,
			securityLevel: raw.SecurityLevel,
			taggedText: raw.TaggedText,
			taxCode: raw.TaxCode,
			userNum: raw.UserNum,
			userText: raw.UserText,
			hidden: raw.Hidden,
			flags: raw.Flags,
			balance: raw.Balance,
			balanceF: raw.BalanceF,
			localBalance: raw.LocalBalance,
			modUser: raw.ModUser,
		};
	},

	/**
	 * Convert from camelCase to MoneyWorks PascalCase
	 */
	fromCamelCase(camel: AccountCamel): Account {
		return {
			Code: camel.code,
			Description: camel.description,
			Type: camel.type,
			System: camel.system,
			Currency: camel.currency,
			AccountantsCode: camel.accountantsCode,
			BankAccountNumber: camel.bankAccountNumber,
			Category: camel.category,
			Category2: camel.category2,
			Category3: camel.category3,
			Category4: camel.category4,
			Colour: camel.colour,
			Comments: camel.comments,
			Created: camel.created,
			EBITDA: camel.ebitda,
			Group: camel.group,
			LastModifiedTime: camel.lastModifiedTime,
			LastStatementImport: camel.lastStatementImport,
			ManualChequeNumber: camel.manualChequeNumber,
			PandL: camel.pandL,
			PrintedChequeNumber: camel.printedChequeNumber,
			SecurityLevel: camel.securityLevel,
			TaggedText: camel.taggedText,
			TaxCode: camel.taxCode,
			UserNum: camel.userNum,
			UserText: camel.userText,
			Hidden: camel.hidden,
			Flags: camel.flags,
			Balance: camel.balance,
			BalanceF: camel.balanceF,
			LocalBalance: camel.localBalance,
			ModUser: camel.modUser,
		};
	},
};

/**
 * Helper functions for Accounts table
 */
export const accountHelpers = {
	/**
	 * Decode bitwise flags field into boolean properties
	 * @param flags - The numeric flags value from MoneyWorks
	 * @returns Object with individual flag states
	 */
	decodeFlags(flags: number): AccountFlags {
		return {
			doNotReconcile: (flags & 0x0001) !== 0,
			unbankedAccount: (flags & 0x0002) !== 0,
			jobCodeRequired: (flags & 0x0004) !== 0,
			hidden: (flags & 0x0008) !== 0,
			locked: (flags & 0x0010) !== 0,
			suppressZeroBalances: (flags & 0x0020) !== 0,
		};
	},

	/**
	 * Encode boolean flags into bitwise numeric value
	 * @param flags - Object with individual flag states
	 * @returns Numeric value for MoneyWorks flags field
	 */
	encodeFlags(flags: AccountFlags): number {
		let result = 0;
		if (flags.doNotReconcile) result |= 0x0001;
		if (flags.unbankedAccount) result |= 0x0002;
		if (flags.jobCodeRequired) result |= 0x0004;
		if (flags.hidden) result |= 0x0008;
		if (flags.locked) result |= 0x0010;
		if (flags.suppressZeroBalances) result |= 0x0020;
		return result;
	},

	/**
	 * Check if account is a bank account
	 * @param system - The system field value
	 * @returns True if the account is a bank account
	 */
	isBankAccount(system?: SystemAccountType): boolean {
		return system === SystemAccountType.Bank;
	},

	/**
	 * Check if account is an income account
	 * @param type - The account type
	 * @returns True if the account is income or sales
	 */
	isIncomeAccount(type: AccountType): boolean {
		return type === AccountType.Income || type === AccountType.Sales;
	},

	/**
	 * Check if account is an expense account
	 * @param type - The account type
	 * @returns True if the account is expense or cost of sales
	 */
	isExpenseAccount(type: AccountType): boolean {
		return type === AccountType.Expense || type === AccountType.CostOfSales;
	},

	/**
	 * Check if account is an asset account
	 * @param type - The account type
	 * @returns True if the account is any type of asset
	 */
	isAssetAccount(type: AccountType): boolean {
		return (
			type === AccountType.CurrentAsset ||
			type === AccountType.FixedAsset ||
			type === AccountType.TermAsset
		);
	},

	/**
	 * Check if account is a liability account
	 * @param type - The account type
	 * @returns True if the account is any type of liability
	 */
	isLiabilityAccount(type: AccountType): boolean {
		return (
			type === AccountType.CurrentLiability ||
			type === AccountType.TermLiability
		);
	},

	/**
	 * Check if account is a balance sheet account
	 * @param type - The account type
	 * @returns True if the account appears on the balance sheet
	 */
	isBalanceSheetAccount(type: AccountType): boolean {
		return (
			this.isAssetAccount(type) ||
			this.isLiabilityAccount(type) ||
			type === AccountType.ShareholdersFunds
		);
	},

	/**
	 * Check if account is a profit & loss account
	 * @param type - The account type
	 * @returns True if the account appears on the P&L statement
	 */
	isProfitLossAccount(type: AccountType): boolean {
		return this.isIncomeAccount(type) || this.isExpenseAccount(type);
	},
};
