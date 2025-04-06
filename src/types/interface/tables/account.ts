/**
 * Represents a record in the General Ledger Accounts table in MoneyWorks.
 * Internal Name: Account.
 * File Number: 0
 */
export interface Account {
  /** Internal unique identifier for the account record. */
  SequenceNumber: number;
  /** Timestamp indicating the last time the account record was modified. */
  LastModifiedTime: string;
  /**
   * The unique code used to identify the account (up to 7 characters, plus potentially a hyphen and department code).
   * @indexed
   * @maxLength 8
   */
  Code: string;
  /**
   * Defines the fundamental type of the account, determining its behaviour and placement in financial reports. Indexed.
   * I: IN - Income (Other income)
   * S: SA - Sales (Income from direct sales)
   * E: EX - Expense (Other expenses)
   * C: CS - Cost of Sales (Expenses directly related to sales)
   * A: CA - Current Asset (e.g., bank accounts, cash, short-term assets)
   * L: CL - Current Liability (Short-term obligations)
   * F: FA - Fixed Asset (Long-life assets like buildings, equipment)
   * T: TA - Term Asset (Longer-term assets like term deposits)
   * M: TL - Term Liability (Longer-term obligations like mortgages)
   * H: SF - Shareholders Funds / Equity (Owner's equity in the company)
   * @indexed
   * @maxLength 1
   */
  Type: "I" | "S" | "E" | "C" | "A" | "L" | "F" | "T" | "M" | "H";
  /**
   * The code of the Department Group associated with this account, used for departmental reporting (Gold/Datacentre only). Indexed.
   * @indexed
   * @maxLength 6
   */
  Group: string;
  /**
   * The primary category code for the account, used for grouping accounts for reporting and enquiry. May be empty. References the General table (Kind='C'). Indexed.
   * @indexed
   * @maxLength 8
   */
  Category: string;
  /**
   * The descriptive name of the account, often displayed in reports.
   * @mutable free, script-only
   * @maxLength 64
   */
  Description: string;
  /**
   * For non-balance sheet accounts (Income, Sales, Expense, Cost of Sales), specifies the Profit & Loss account code into which the balance is transferred at year-end. Indexed.
   * @indexed
   * @maxLength 8
   */
  PandL: string;
  /**
   * The default Tax Code used for transactions involving this account. References the TaxRate table.
   * @mutable conditionally
   * @maxLength 6
   */
  TaxCode: string;
  /** A bitmask field storing various boolean settings/attributes for the account, such as 'Use as Heading', 'Job Code Required', 'Discountable'. */
  Flags: number;
  /**
   * Indicates if the account is a system control account. Indexed.
   * P: GP - GST/VAT/TAX Paid control account
   * R: GR - GST/VAT/TAX Received control account
   * K: BK - Bank Account
   * A: AR - Accounts Receivable control account
   * L: AP - Accounts Payable control account
   * F: PL - Profit & Loss account
   *  : Not a system account
   * @indexed
   * @maxLength 1
   */
  System: "P" | "R" | "K" | "A" | "L" | "F" | " ";
  /** Timestamp indicating when the account record was created. */
  Created: Date;
  /**
   * A secondary user-defined category code for reporting and analysis. May be empty.
   * @mutable free, script-only
   * @maxLength 16
   */
  Category2: string;
  /**
   * A tertiary user-defined category code for reporting and analysis. May be empty.
   * @mutable free, script-only
   * @maxLength 16
   */
  Category3: string;
  /**
   * A quaternary user-defined category code for reporting and analysis. May be empty.
   * @mutable free, script-only
   * @maxLength 16
   */
  Category4: string;
  /**
   * The account code used by the external accountant, for mapping purposes (e.g., in Accountant's Export). May be empty.
   * @mutable free, script-only
   * @maxLength 10
   */
  AccountantCode: string;
  /**
   * A user-assigned colour index (0-7) for visual identification in lists. Labels are user-defined in preferences.
   * @mutable conditionally
   * @minimum 0
   * @maximum 7
   */
  Colour: number;
  /**
   * The currency code (e.g., 'USD', 'EUR') for foreign currency accounts. Empty for base currency accounts. Requires multi-currency feature (Gold).
   * @maxLength 4
   */
  Currency: string;
  /**
   * Security level assigned to the account (0-5 stars), restricting access based on user security levels (Gold/Datacentre only). Indexed.
   * @indexed
   */
  SecurityLevel: number;
  /**
   * The bank account number associated with this account (only applicable for Bank type accounts). Used for electronic payments. May be empty.
   * @mutable free, script-only
   * @maxLength 24
   */
  BankAccountNumber: string;
  /** A user-defined balance limit for the account, potentially used for credit limits or overdraft warnings. */
  BalanceLimit: number | null;
  /**
   * The next sequence number for manually written cheques drawn on this bank account.
   * @maxLength 12
   */
  ManualChequeNumber: string;
  /**
   * The next sequence number for cheques printed by MoneyWorks drawn on this bank account.
   * @maxLength 12
   */
  PrintedChequeNumber: string;
  /** Timestamp of the last imported bank statement for this account. */
  LastStatementImport: Date;
  /**
   * User-entered notes or comments about the account. May be empty.
   * @mutable free, script-only
   * @maxLength 1024
   */
  Comments: string;
  /** Specifies the number of digits for padding the ManualChequeNumber (for bank accounts). */
  ManualChequeNumDigits: number | null;
  /** Specifies the number of digits for padding the PrintedChequeNumber (for bank accounts). */
  PrintedChequeNumDigits: number | null;
  /**
   * A user-defined number field for custom data storage, often used by scripts.
   * @mutable free, script-only
   */
  UserNum: number;
  /**
   * A user-defined text field for custom data storage, often used by scripts.
   * @mutable free, script-only
   * @maxLength 256
   */
  UserText: string;
  /**
   * Stores key-value pairs for custom data, primarily accessed via scripting functions GetTaggedValue/SetTaggedValue.
   * @mutable free, script-only
   * @maxLength 256
   */
  TaggedText: string;
  /**
   * Identifier related to bank feeds service for this bank account.
   * @mutable free, script-only
   * @maxLength 32
   */
  FeedID: string;
  /**
   * Assigns the account to a category (Operating, Investing, Financing) for the Statement of Cash Flows report. Codes typically start 'OP', 'INV', 'FIN'.
   * @mutable free, script-only
   * @maxLength 8
   */
  Cashflow: string;
  /**
   * Defines the cash spread pattern (e.g., '10/60/30') for the Cash Forecast report, overriding default income/expense spreads.
   * @mutable free, script-only
   * @maxLength 32
   */
  Cashforecast: string;
  /**
   * Classifies the account for EBITDA reporting purposes (Earnings Before Interest, Tax, Depreciation, and Amortization).
   * I: Interest
   * T: Tax
   * D: Depreciation/Amortization
   *  : Not classified for EBITDA
   * @mutable conditionally
   * @maxLength 2
   */
  EBITDA: "I" | "T" | "D" | "";
  /**
   * Specifies the format to use when importing bank statements for this specific bank account.
   * @maxLength 10
   */
  ImportFormat: string;
}

/**
 * Represents the fields available in the Account table.
 */
export type AccountField = keyof Account;

/**
 * Array of all field names in the Account table.
 */
export const AccountFields: AccountField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Code",
  "Type",
  "Group",
  "Category",
  "Description",
  "PandL",
  "TaxCode",
  "Flags",
  "System",
  "Created",
  "Category2",
  "Category3",
  "Category4",
  "AccountantCode",
  "Colour",
  "Currency",
  "SecurityLevel",
  "BankAccountNumber",
  "BalanceLimit",
  "ManualChequeNumber",
  "PrintedChequeNumber",
  "LastStatementImport",
  "Comments",
  "ManualChequeNumDigits",
  "PrintedChequeNumDigits",
  "UserNum",
  "UserText",
  "TaggedText",
  "FeedID",
  "Cashflow",
  "Cashforecast",
  "EBITDA",
  "ImportFormat",
];

/**
 * Represents an Account object where all values are strings.
 * This is useful for generic handling or specific import/export scenarios.
 */
export type AccountObject = Record<AccountField, string>;
