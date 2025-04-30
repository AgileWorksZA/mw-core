import { t } from "elysia";

export const AccountOne = t.Object(
  {
    SequenceNumber: t.Nullable(t.Number({
      description: "Internal unique identifier for the account record."
    })),
    LastModifiedTime: t.Nullable(t.String({
      description: "Timestamp indicating the last time the account record was modified."
    })),
    Code: t.String({
      description:
        "The unique code used to identify the account (up to 7 characters, plus potentially a hyphen and department code). Indexed.",
      maxLength: 8,
    }),
    Type: t.Nullable(t.String({
      description: "Defines the fundamental type of the account, determining its behaviour and placement in financial reports. Values: I: IN - Income (Other income), S: SA - Sales (Income from direct sales), E: EX - Expense (Other expenses), C: CS - Cost of Sales, A: CA - Current Asset, L: CL - Current Liability, F: FA - Fixed Asset, T: TA - Term Asset, M: TL - Term Liability, H: SF - Shareholders Funds / Equity."
    })),
    Group: t.Nullable(t.String({
      description: "The code of the Department Group associated with this account, used for departmental reporting (Gold/Datacentre only). Indexed.",
      maxLength: 6
    })),
    Category: t.Nullable(t.String({
      description: "The primary category code for the account, used for grouping accounts for reporting and enquiry. May be empty. References the General table (Kind='C'). Indexed.",
      maxLength: 8
    })),
    Description: t.Nullable(t.String({
      description: "The descriptive name of the account, often displayed in reports. (Mutable: freely, script-only)",
      maxLength: 64
    })),
    PandL: t.Nullable(t.String({
      description: "For non-balance sheet accounts (Income, Sales, Expense, Cost of Sales), specifies the Profit & Loss account code into which the balance is transferred at year-end. Indexed.",
      maxLength: 8
    })),
    TaxCode: t.Nullable(t.String({
      description: "The default Tax Code used for transactions involving this account. References the TaxRate table. (Mutable: conditionally)",
      maxLength: 6
    })),
    Flags: t.Nullable(t.Number({
      description: "A bitmask field storing various boolean settings/attributes for the account, such as 'Use as Heading', 'Job Code Required', 'Discountable'."
    })),
    System: t.Nullable(t.String({
      description: "Indicates if the account is a system control account. Values: P: GP - GST/VAT/TAX Paid control account, R: GR - GST/VAT/TAX Received control account, K: BK - Bank Account, A: AR - Accounts Receivable control account, L: AP - Accounts Payable control account, F: PL - Profit & Loss account,  : Not a system account"
    })),
    Created: t.Nullable(t.Date({
      description: "Timestamp indicating when the account record was created."
    })),
    Category2: t.Nullable(t.String({
      description: "A secondary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only)",
      maxLength: 16
    })),
    Category3: t.Nullable(t.String({
      description: "A tertiary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only)",
      maxLength: 16
    })),
    Category4: t.Nullable(t.String({
      description: "A quaternary user-defined category code for reporting and analysis. May be empty. (Mutable: freely, script-only)",
      maxLength: 16
    })),
    AccountantCode: t.Nullable(t.String({
      description: "The account code used by the external accountant, for mapping purposes (e.g., in Accountant's Export). May be empty. (Mutable: freely, script-only)",
      maxLength: 10
    })),
    Colour: t.Nullable(t.Number({
      description: "A user-assigned colour index (0-7) for visual identification in lists. Labels are user-defined in preferences. (Mutable: conditionally)",
      minimum: 0,
      maximum: 7
    })),
    Currency: t.Nullable(t.String({
      description: "The currency code (e.g., 'USD', 'EUR') for foreign currency accounts. Empty for base currency accounts. Requires multi-currency feature (Gold).",
      maxLength: 4
    })),
    SecurityLevel: t.Nullable(t.Number({
      description: "Security level assigned to the account (0-5 stars), restricting access based on user security levels (Gold/Datacentre only). Indexed."
    })),
    BankAccountNumber: t.Nullable(t.String({
      description: "The bank account number associated with this account (only applicable for Bank type accounts). Used for electronic payments. May be empty. (Mutable: freely, script-only)",
      maxLength: 24
    })),
    BalanceLimit: t.Nullable(t.Nullable(t.Number({
      description: "A user-defined balance limit for the account, potentially used for credit limits or overdraft warnings."
    }))),
    ManualChequeNumber: t.Nullable(t.String({
      description: "The next sequence number for manually written cheques drawn on this bank account.",
      maxLength: 12
    })),
    PrintedChequeNumber: t.Nullable(t.String({
      description: "The next sequence number for cheques printed by MoneyWorks drawn on this bank account.",
      maxLength: 12
    })),
    LastStatementImport: t.Nullable(t.Date({
      description: "Timestamp of the last imported bank statement for this account."
    })),
    Comments: t.Nullable(t.String({
      description: "User-entered notes or comments about the account. May be empty. (Mutable: freely, script-only)",
      maxLength: 1024
    })),
    ManualChequeNumDigits: t.Nullable(t.Nullable(t.Number({
      description: "Specifies the number of digits for padding the ManualChequeNumber (for bank accounts)."
    }))),
    PrintedChequeNumDigits: t.Nullable(t.Nullable(t.Number({
      description: "Specifies the number of digits for padding the PrintedChequeNumber (for bank accounts)."
    }))),
    UserNum: t.Nullable(t.Number({
      description: "A user-defined number field for custom data storage, often used by scripts. (Mutable: freely, script-only)"
    })),
    UserText: t.Nullable(t.String({
      description: "A user-defined text field for custom data storage, often used by scripts. (Mutable: freely, script-only)",
      maxLength: 256
    })),
    TaggedText: t.Nullable(t.String({
      description: "Stores key-value pairs for custom data, primarily accessed via scripting functions GetTaggedValue/SetTaggedValue. (Mutable: freely, script-only)",
      maxLength: 256
    })),
    FeedID: t.Nullable(t.String({
      description: "Identifier related to bank feeds service for this bank account. (Mutable: freely, script-only)",
      maxLength: 32
    })),
    Cashflow: t.Nullable(t.String({
      description: "Assigns the account to a category (Operating, Investing, Financing) for the Statement of Cash Flows report. Codes typically start 'OP', 'INV', 'FIN'. (Mutable: freely, script-only)",
      maxLength: 8
    })),
    Cashforecast: t.Nullable(t.String({
      description: "Defines the cash spread pattern (e.g., '10/60/30') for the Cash Forecast report, overriding default income/expense spreads. (Mutable: freely, script-only)",
      maxLength: 32
    })),
    EBITDA: t.Nullable(t.String({
      description: "Classifies the account for EBITDA reporting purposes (Earnings Before Interest, Tax, Depreciation, and Amortization). Values: I: Interest, T: Tax, D: Depreciation/Amortization,  : Not classified for EBITDA"
    })),
    ImportFormat: t.Nullable(t.String({
      description: "Specifies the format to use when importing bank statements for this specific bank account.",
      maxLength: 10
    })),
  },
  { additionalProperties: true },
);
