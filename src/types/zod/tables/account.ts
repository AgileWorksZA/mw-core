import { z } from "zod";

// Define Zod enums for specific fields
const AccountTypeEnum = z
  .enum([
    "I", // IN - Income
    "S", // SA - Sales
    "E", // EX - Expense
    "C", // CS - Cost of Sales
    "A", // CA - Current Asset
    "L", // CL - Current Liability
    "F", // FA - Fixed Asset
    "T", // TA - Term Asset
    "M", // TL - Term Liability
    "H", // SF - Shareholders Funds / Equity
  ])
  .describe(`Defines the fundamental type of the account, determining its behaviour and placement in financial reports. Indexed.
  I: IN - Income (Other income)
  S: SA - Sales (Income from direct sales)
  E: EX - Expense (Other expenses)
  C: CS - Cost of Sales (Expenses directly related to sales)
  A: CA - Current Asset (e.g., bank accounts, cash, short-term assets)
  L: CL - Current Liability (Short-term obligations)
  F: FA - Fixed Asset (Long-life assets like buildings, equipment)
  T: TA - Term Asset (Longer-term assets like term deposits)
  M: TL - Term Liability (Longer-term obligations like mortgages)
  H: SF - Shareholders Funds / Equity (Owner's equity in the company)`);

const AccountSystemEnum = z
  .enum([
    "P", // GP - GST/VAT/TAX Paid control account
    "R", // GR - GST/VAT/TAX Received control account
    "K", // BK - Bank Account
    "A", // AR - Accounts Receivable control account
    "L", // AP - Accounts Payable control account
    "F", // PL - Profit & Loss account
    " ", // Not a system account
  ])
  .describe(`Indicates if the account is a system control account. Indexed.
  P: GP - GST/VAT/TAX Paid control account
  R: GR - GST/VAT/TAX Received control account
  K: BK - Bank Account
  A: AR - Accounts Receivable control account
  L: AP - Accounts Payable control account
  F: PL - Profit & Loss account
    : Not a system account`);

const AccountEBITDAEnum = z
  .enum([
    "I", // Interest
    "T", // Tax
    "D", // Depreciation/Amortization
    "", // Not classified for EBITDA
  ])
  .describe(`Classifies the account for EBITDA reporting purposes (Earnings Before Interest, Tax, Depreciation, and Amortization). Mutable: conditionally.
  I: Interest
  T: Tax
  D: Depreciation/Amortization
    : Not classified for EBITDA`);

export const accountZod = z.object({
  /** Internal unique identifier for the account record. */
  SequenceNumber: z.number().positive(),
  /** Timestamp indicating the last time the account record was modified. */
  LastModifiedTime: z.string(),
  /** The unique code used to identify the account (up to 7 characters, plus potentially a hyphen and department code). */
  Code: z
    .string()
    .max(8)
    .describe(
      "The unique code used to identify the account (up to 7 characters, plus potentially a hyphen and department code). Indexed.",
    ),
  /** Defines the fundamental type of the account, determining its behaviour and placement in financial reports. Indexed. */
  Type: AccountTypeEnum,
  /** The code of the Department Group associated with this account, used for departmental reporting (Gold/Datacentre only). Indexed. */
  Group: z
    .string()
    .max(6)
    .describe(
      "The code of the Department Group associated with this account, used for departmental reporting (Gold/Datacentre only). Indexed.",
    ),
  /** The primary category code for the account, used for grouping accounts for reporting and enquiry. May be empty. References the General table (Kind='C'). Indexed. */
  Category: z
    .string()
    .max(8)
    .describe(
      "The primary category code for the account, used for grouping accounts for reporting and enquiry. May be empty. References the General table (Kind='C'). Indexed.",
    ),
  /** The descriptive name of the account, often displayed in reports. (Mutable: freely, script-only) */
  Description: z
    .string()
    .max(64)
    .describe(
      "The descriptive name of the account, often displayed in reports. (Mutable: freely, script-only)",
    ),
  /** For non-balance sheet accounts (Income, Sales, Expense, Cost of Sales), specifies the Profit & Loss account code into which the balance is transferred at year-end. Indexed. */
  PandL: z
    .string()
    .max(8)
    .describe(
      "For non-balance sheet accounts (Income, Sales, Expense, Cost of Sales), specifies the Profit & Loss account code into which the balance is transferred at year-end. Indexed.",
    ),
  /** The default Tax Code used for transactions involving this account. References the TaxRate table. (Mutable: conditionally) */
  TaxCode: z
    .string()
    .max(6)
    .describe(
      "The default Tax Code used for transactions involving this account. References the TaxRate table. (Mutable: conditionally)",
    ),
  /** A bitmask field storing various boolean settings/attributes for the account, such as 'Use as Heading', 'Job Code Required', 'Discountable'. */
  Flags: z
    .number()
    .int()
    .describe(
      "A bitmask field storing various boolean settings/attributes for the account, such as 'Use as Heading', 'Job Code Required', 'Discountable'.",
    ),
  /** Indicates if the account is a system control account. Indexed. */
  System: AccountSystemEnum,
  /** Timestamp indicating when the account record was created. */
  Created: z.string(),
  /** A secondary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only) */
  Category2: z
    .string()
    .max(16)
    .describe(
      "A secondary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only)",
    ),
  /** A tertiary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only) */
  Category3: z
    .string()
    .max(16)
    .describe(
      "A tertiary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only)",
    ),
  /** A quaternary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only) */
  Category4: z
    .string()
    .max(16)
    .describe(
      "A quaternary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only)",
    ),
  /** The account code used by the external accountant, for mapping purposes (e.g., in Accountant's Export). May be empty. (Mutable: freely, script-only) */
  AccountantCode: z
    .string()
    .max(10)
    .describe(
      "The account code used by the external accountant, for mapping purposes (e.g., in Accountant's Export). May be empty. (Mutable: freely, script-only)",
    ),
  /** A user-assigned colour index (0-7) for visual identification in lists. Labels are user-defined in preferences. (Mutable: conditionally) */
  Colour: z
    .number()
    .int()
    .min(0)
    .max(7)
    .describe(
      "A user-assigned colour index (0-7) for visual identification in lists. Labels are user-defined in preferences. (Mutable: conditionally)",
    ),
  /** The currency code (e.g., 'USD', 'EUR') for foreign currency accounts. Empty for base currency accounts. Requires multi-currency feature (Gold). */
  Currency: z
    .string()
    .max(4)
    .describe(
      "The currency code (e.g., 'USD', 'EUR') for foreign currency accounts. Empty for base currency accounts. Requires multi-currency feature (Gold).",
    ),
  /** Security level assigned to the account (0-5 stars), restricting access based on user security levels (Gold/Datacentre only). Indexed. */
  SecurityLevel: z
    .number()
    .int()
    .describe(
      "Security level assigned to the account (0-5 stars), restricting access based on user security levels (Gold/Datacentre only). Indexed.",
    ),
  /** The bank account number associated with this account (only applicable for Bank type accounts). Used for electronic payments. May be empty. (Mutable: freely, script-only) */
  BankAccountNumber: z
    .string()
    .max(24)
    .describe(
      "The bank account number associated with this account (only applicable for Bank type accounts). Used for electronic payments. May be empty. (Mutable: freely, script-only)",
    ),
  /** A user-defined balance limit for the account, potentially used for credit limits or overdraft warnings. */
  BalanceLimit: z
    .number()
    .nullable()
    .describe(
      "A user-defined balance limit for the account, potentially used for credit limits or overdraft warnings.",
    ),
  /** The next sequence number for manually written cheques drawn on this bank account. */
  ManualChequeNumber: z
    .string()
    .max(12)
    .describe(
      "The next sequence number for manually written cheques drawn on this bank account.",
    ),
  /** The next sequence number for cheques printed by MoneyWorks drawn on this bank account. */
  PrintedChequeNumber: z
    .string()
    .max(12)
    .describe(
      "The next sequence number for cheques printed by MoneyWorks drawn on this bank account.",
    ),
  /** Timestamp of the last imported bank statement for this account. */
  LastStatementImport: z.string(),
  /** User-entered notes or comments about the account. May be empty. (Mutable: freely, script-only) */
  Comments: z
    .string()
    .max(1024)
    .describe(
      "User-entered notes or comments about the account. May be empty. (Mutable: freely, script-only)",
    ),
  /** Specifies the number of digits for padding the ManualChequeNumber (for bank accounts). */
  ManualChequeNumDigits: z
    .number()
    .int()
    .nullable()
    .describe(
      "Specifies the number of digits for padding the ManualChequeNumber (for bank accounts).",
    ),
  /** Specifies the number of digits for padding the PrintedChequeNumber (for bank accounts). */
  PrintedChequeNumDigits: z
    .number()
    .int()
    .nullable()
    .describe(
      "Specifies the number of digits for padding the PrintedChequeNumber (for bank accounts).",
    ),
  /** A user-defined number field for custom data storage, often used by scripts. (Mutable: freely, script-only) */
  UserNum: z
    .number()
    .describe(
      "A user-defined number field for custom data storage, often used by scripts. (Mutable: freely, script-only)",
    ),
  /** A user-defined text field for custom data storage, often used by scripts. (Mutable: freely, script-only) */
  UserText: z
    .string()
    .max(256)
    .describe(
      "A user-defined text field for custom data storage, often used by scripts. (Mutable: freely, script-only)",
    ),
  /** Stores key-value pairs for custom data, primarily accessed via scripting functions GetTaggedValue/SetTaggedValue. (Mutable: freely, script-only) */
  TaggedText: z
    .string()
    .max(256)
    .describe(
      "Stores key-value pairs for custom data, primarily accessed via scripting functions GetTaggedValue/SetTaggedValue. (Mutable: freely, script-only)",
    ),
  /** Identifier related to bank feeds service for this bank account. (Mutable: freely, script-only) */
  FeedID: z
    .string()
    .max(32)
    .describe(
      "Identifier related to bank feeds service for this bank account. (Mutable: freely, script-only)",
    ),
  /** Assigns the account to a category (Operating, Investing, Financing) for the Statement of Cash Flows report. Codes typically start 'OP', 'INV', 'FIN'. (Mutable: freely, script-only) */
  Cashflow: z
    .string()
    .max(8)
    .describe(
      "Assigns the account to a category (Operating, Investing, Financing) for the Statement of Cash Flows report. Codes typically start 'OP', 'INV', 'FIN'. (Mutable: freely, script-only)",
    ),
  /** Defines the cash spread pattern (e.g., '10/60/30') for the Cash Forecast report, overriding default income/expense spreads. (Mutable: freely, script-only) */
  Cashforecast: z
    .string()
    .max(32)
    .describe(
      "Defines the cash spread pattern (e.g., '10/60/30') for the Cash Forecast report, overriding default income/expense spreads. (Mutable: freely, script-only)",
    ),
  /** Classifies the account for EBITDA reporting purposes (Earnings Before Interest, Tax, Depreciation, and Amortization). (Mutable: conditionally) */
  EBITDA: AccountEBITDAEnum,
  /** Specifies the format to use when importing bank statements for this specific bank account. */
  ImportFormat: z
    .string()
    .max(10)
    .describe(
      "Specifies the format to use when importing bank statements for this specific bank account.",
    ),
});

/**
 * Inferred TypeScript type from the accountZod schema.
 * Represents a fully validated Account record.
 */
export type AccountZod = z.infer<typeof accountZod>;
