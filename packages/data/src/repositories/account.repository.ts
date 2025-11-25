/**
 * MoneyWorks Account Repository
 *
 * @moneyworks-entity Account
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all Account data operations
 * @ai-critical Use MoneyWorks Account terminology exclusively
 */

import type {
	MoneyWorksAccount,
	MoneyWorksAccountCreateInput,
	MoneyWorksAccountUpdateInput,
	MoneyWorksAccountType,
} from "@moneyworks/canonical/entities/accounts";
import {
	BALANCE_SHEET_TYPES,
	isBalanceSheetType,
} from "@moneyworks/canonical/entities/accounts";
import { type AccountCode } from "@moneyworks/utilities";
import { BaseMoneyWorksRepository } from "./base.repository";

/**
 * Repository for MoneyWorks Account entity
 *
 * @ai-instruction Use this for all Account data operations
 * @ai-term Say "AccountRepository", NEVER "GLRepository" or "ChartOfAccountsRepository"
 */
export class AccountRepository extends BaseMoneyWorksRepository<
	MoneyWorksAccount,
	MoneyWorksAccountCreateInput,
	MoneyWorksAccountUpdateInput
> {
	/**
	 * MoneyWorks table name
	 * @ai-critical Must be exact MW table name
	 */
	protected readonly tableName = "Account";

	/**
	 * Primary key field
	 * @ai-critical Code is the primary key for Account
	 */
	protected readonly primaryKey = "Code";

	/**
	 * Post-process records to add branded types and parse MW data
	 *
	 * @ai-instruction Smart client already parsed basic types, we add branding and parse flags
	 */
	protected postProcess(record: any): MoneyWorksAccount {
		// Smart client already handled field discovery and basic parsing
		// We just need to add branded types where needed and ensure proper types

		// Parse numeric fields
		const numericFields = [
			"Balance",
			"OpeningBalance",
			"Budget",
			"YearBudget",
			"Flags",
			"Colour",
			"UserNum",
		];

		const processed: any = { ...record };

		// Parse numeric fields
		for (const field of numericFields) {
			if (
				field in processed &&
				processed[field] !== null &&
				processed[field] !== ""
			) {
				processed[field] = Number(processed[field]);
			}
		}

		// Parse boolean field
		if ("Active" in processed) {
			processed.Active =
				processed.Active === "true" ||
				processed.Active === true ||
				processed.Active === "1" ||
				processed.Active === 1;
		}

		// Add branded type for Code
		if (processed.Code) {
			processed.Code = processed.Code as AccountCode;
		}

		// Add branded types for account reference fields
		if (processed.ControlAccount) {
			processed.ControlAccount = processed.ControlAccount as AccountCode;
		}
		if (processed.AltAccount) {
			processed.AltAccount = processed.AltAccount as AccountCode;
		}

		return processed as MoneyWorksAccount;
	}

	/**
	 * Prepare data for MoneyWorks
	 *
	 * @ai-instruction Converts typed data to MW format
	 */
	protected prepare(
		data: MoneyWorksAccountCreateInput | MoneyWorksAccountUpdateInput,
	): any {
		const prepared: any = {};

		// Always include Code for identification
		if ("Code" in data) {
			prepared.Code = data.Code;
		}

		// Required fields for creation
		if ("Name" in data && data.Name !== undefined) {
			prepared.Name = data.Name;
		}
		if ("Type" in data && data.Type !== undefined) {
			prepared.Type = data.Type;
		}
		if ("SubType" in data && data.SubType !== undefined) {
			prepared.SubType = data.SubType;
		}

		// Balance fields
		if ("OpeningBalance" in data && data.OpeningBalance !== undefined) {
			prepared.OpeningBalance = data.OpeningBalance;
		}
		if ("Budget" in data && data.Budget !== undefined) {
			prepared.Budget = data.Budget;
		}
		if ("YearBudget" in data && data.YearBudget !== undefined) {
			prepared.YearBudget = data.YearBudget;
		}

		// Bank fields
		if ("BankAccount" in data && data.BankAccount !== undefined) {
			prepared.BankAccount = data.BankAccount;
		}
		if ("Bank" in data && data.Bank !== undefined) {
			prepared.Bank = data.Bank;
		}
		if ("BankBranch" in data && data.BankBranch !== undefined) {
			prepared.BankBranch = data.BankBranch;
		}
		if ("BankAccountName" in data && data.BankAccountName !== undefined) {
			prepared.BankAccountName = data.BankAccountName;
		}

		// Control account fields
		if ("ControlAccount" in data && data.ControlAccount !== undefined) {
			prepared.ControlAccount = data.ControlAccount;
		}
		if ("AltAccount" in data && data.AltAccount !== undefined) {
			prepared.AltAccount = data.AltAccount;
		}

		// Tax fields
		if ("TaxCode" in data && data.TaxCode !== undefined) {
			prepared.TaxCode = data.TaxCode;
		}
		if ("GSTClass" in data && data.GSTClass !== undefined) {
			prepared.GSTClass = data.GSTClass;
		}

		// Currency
		if ("Currency" in data && data.Currency !== undefined) {
			prepared.Currency = data.Currency;
		}

		// Category fields
		if ("Category1" in data && data.Category1 !== undefined) {
			prepared.Category1 = data.Category1;
		}
		if ("Category2" in data && data.Category2 !== undefined) {
			prepared.Category2 = data.Category2;
		}
		if ("Category3" in data && data.Category3 !== undefined) {
			prepared.Category3 = data.Category3;
		}
		if ("Category4" in data && data.Category4 !== undefined) {
			prepared.Category4 = data.Category4;
		}

		// Status fields
		if ("Flags" in data && data.Flags !== undefined) {
			prepared.Flags = data.Flags;
		}
		if ("Active" in data && data.Active !== undefined) {
			prepared.Active = data.Active ? "true" : "false";
		}

		// Metadata
		if ("Colour" in data && data.Colour !== undefined) {
			prepared.Colour = data.Colour;
		}
		if ("Comment" in data && data.Comment !== undefined) {
			prepared.Comment = data.Comment;
		}

		// Custom fields
		if ("Custom1" in data && data.Custom1 !== undefined) {
			prepared.Custom1 = data.Custom1;
		}
		if ("Custom2" in data && data.Custom2 !== undefined) {
			prepared.Custom2 = data.Custom2;
		}
		if ("Custom3" in data && data.Custom3 !== undefined) {
			prepared.Custom3 = data.Custom3;
		}
		if ("Custom4" in data && data.Custom4 !== undefined) {
			prepared.Custom4 = data.Custom4;
		}

		// User-defined fields
		if ("UserNum" in data && data.UserNum !== undefined) {
			prepared.UserNum = data.UserNum;
		}
		if ("UserText" in data && data.UserText !== undefined) {
			prepared.UserText = data.UserText;
		}
		if ("TaggedText" in data && data.TaggedText !== undefined) {
			prepared.TaggedText = data.TaggedText;
		}

		return prepared;
	}

	// ============= SPECIALIZED QUERY METHODS =============

	/**
	 * Find account by code (primary key lookup)
	 *
	 * @param code - The account code to search for
	 * @returns The account if found, null otherwise
	 *
	 * @example
	 * ```typescript
	 * const account = await repo.findByCode("1000");
	 * if (account) {
	 *   console.log(`Found: ${account.Name}`);
	 * }
	 * ```
	 *
	 * @ai-instruction Use this for single account lookups by Code
	 */
	async findByCode(code: string): Promise<MoneyWorksAccount | null> {
		const records = await this.find(`Code="${code}"`);
		return records.length > 0 ? records[0] : null;
	}

	/**
	 * Find accounts by type classification
	 *
	 * @param type - The account type (CA, FA, TA, CL, TL, SF, INC, EXP)
	 * @returns Array of accounts matching the type
	 *
	 * @example
	 * ```typescript
	 * import { MoneyWorksAccountType } from "@moneyworks/canonical/entities/accounts";
	 *
	 * // Find all current asset accounts
	 * const assets = await repo.findByType(MoneyWorksAccountType.CURRENT_ASSET);
	 *
	 * // Find all expense accounts
	 * const expenses = await repo.findByType(MoneyWorksAccountType.EXPENSE);
	 * ```
	 *
	 * @ai-instruction Use this to filter accounts by their Type field
	 */
	async findByType(
		type: MoneyWorksAccountType | string,
	): Promise<MoneyWorksAccount[]> {
		return this.find(`Type="${type}"`);
	}

	/**
	 * Find all active accounts
	 *
	 * @returns Array of accounts where Active is true
	 *
	 * @example
	 * ```typescript
	 * const activeAccounts = await repo.findActiveAccounts();
	 * console.log(`${activeAccounts.length} active accounts`);
	 * ```
	 *
	 * @ai-instruction Use this to get only accounts available for transactions
	 */
	async findActiveAccounts(): Promise<MoneyWorksAccount[]> {
		// MoneyWorks stores Active as boolean, search for true
		const allAccounts = await this.findAll();

		// Filter for active accounts
		// Some MW versions use Flags bit 8 for inactive
		return allAccounts.filter((account) => {
			// Check Active field if present
			if (account.Active !== undefined) {
				return account.Active === true;
			}
			// Fall back to checking Flags for inactive bit
			if (account.Flags !== undefined) {
				return (account.Flags & 8) === 0; // Bit 8 = inactive
			}
			// Default to active if no status indicators
			return true;
		});
	}

	/**
	 * Find all balance sheet accounts
	 *
	 * Returns accounts of types: CA, FA, TA, CL, TL, SF
	 * These are asset, liability, and equity accounts.
	 *
	 * @returns Array of balance sheet accounts
	 *
	 * @example
	 * ```typescript
	 * const bsAccounts = await repo.findBalanceSheetAccounts();
	 * console.log(`${bsAccounts.length} balance sheet accounts`);
	 * ```
	 *
	 * @ai-instruction Use this for financial reporting - balance sheet accounts
	 */
	async findBalanceSheetAccounts(): Promise<MoneyWorksAccount[]> {
		// Fetch all accounts and filter by balance sheet types
		const allAccounts = await this.findAll();

		return allAccounts.filter((account) => {
			const accountType = account.Type as MoneyWorksAccountType;
			return isBalanceSheetType(accountType);
		});
	}

	/**
	 * Find all profit & loss accounts
	 *
	 * Returns accounts of types: INC, EXP
	 * These are income and expense accounts.
	 *
	 * @returns Array of P&L accounts
	 *
	 * @example
	 * ```typescript
	 * const plAccounts = await repo.findProfitLossAccounts();
	 * console.log(`${plAccounts.length} P&L accounts`);
	 * ```
	 *
	 * @ai-instruction Use this for financial reporting - P&L accounts
	 */
	async findProfitLossAccounts(): Promise<MoneyWorksAccount[]> {
		// Fetch all accounts and filter by P&L types
		const allAccounts = await this.findAll();

		return allAccounts.filter((account) => {
			const accountType = account.Type as MoneyWorksAccountType;
			return !isBalanceSheetType(accountType);
		});
	}

	/**
	 * Search accounts by category field
	 *
	 * MoneyWorks provides 4 category fields (Category1 through Category4) for custom classification.
	 *
	 * @param categoryNumber - Which category field to search (1, 2, 3, or 4)
	 * @param value - The category value to match
	 * @returns Array of accounts in this category
	 *
	 * @example
	 * ```typescript
	 * // Find all accounts in "Operating" category
	 * const operating = await repo.findByCategory(1, "Operating");
	 *
	 * // Find all accounts in "Overhead" (Category2)
	 * const overhead = await repo.findByCategory(2, "Overhead");
	 * ```
	 *
	 * @ai-instruction Use this for custom account classification
	 * @ai-context Category fields are user-defined for analysis purposes
	 */
	async findByCategory(
		categoryNumber: 1 | 2 | 3 | 4,
		value: string,
	): Promise<MoneyWorksAccount[]> {
		const fieldName = `Category${categoryNumber}`;
		return this.find(`${fieldName}="${value}"`);
	}

	/**
	 * Find all bank accounts
	 *
	 * Returns accounts that have bank account information set.
	 *
	 * @returns Array of bank accounts
	 *
	 * @example
	 * ```typescript
	 * const bankAccounts = await repo.findBankAccounts();
	 * bankAccounts.forEach(acc => {
	 *   console.log(`${acc.Name}: ${acc.BankAccount}`);
	 * });
	 * ```
	 *
	 * @ai-instruction Use this to find accounts with banking integration
	 */
	async findBankAccounts(): Promise<MoneyWorksAccount[]> {
		// Fetch all accounts and filter for those with bank info
		const allAccounts = await this.findAll();

		return allAccounts.filter((account) => {
			// Check if has bank account number or bank subtype
			return (
				(account.BankAccount && account.BankAccount.trim() !== "") ||
				account.SubType === "Bank"
			);
		});
	}

	/**
	 * Find accounts by control account
	 *
	 * Returns all accounts that roll up to a specific control account.
	 *
	 * @param controlAccountCode - The control account code
	 * @returns Array of accounts under this control account
	 *
	 * @example
	 * ```typescript
	 * // Find all accounts under control account "1000"
	 * const subAccounts = await repo.findByControlAccount("1000");
	 * ```
	 *
	 * @ai-instruction Use this to find account hierarchies
	 */
	async findByControlAccount(
		controlAccountCode: string,
	): Promise<MoneyWorksAccount[]> {
		return this.find(`ControlAccount="${controlAccountCode}"`);
	}
}
