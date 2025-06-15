/**
 * MoneyWorks OffLedger Table Interface
 *
 * The OffLedger table serves a dual purpose: it stores both currency definitions
 * and user-defined offledger records. This table is essential for multi-currency
 * operations and custom off-ledger tracking.
 *
 * Key characteristics:
 * - Currency records have codes starting with @ (e.g., @USD)
 * - Contains extensive historical balance tracking (90 periods)
 * - Supports budget tracking for past and future periods
 * - Links to GL accounts for currency gain/loss handling
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_offledgers_and_currency.html
 */

/**
 * Record type identifiers
 * @description Distinguishes between currency and user offledger records
 */
export enum OffLedgerKind {
  /** Currency record */
  Currency = "CUR",
  /** User-defined offledger */
  User = "USR",
}

/**
 * MoneyWorks OffLedger Table (Raw Interface)
 * @description Direct mapping to MoneyWorks field names
 */
export interface OffLedger {
  /**
   * Record type
   * @maxLength 3
   * @description Distinguishes currency from user offledger records
   */
  Kind: OffLedgerKind;

  /**
   * Currency or offledger name
   * @maxLength 15
   * @description For currencies, typically starts with @ (e.g., @USD)
   * @primaryKey
   */
  Name: string;

  /**
   * Description
   * @maxLength 39
   * @description Full description of the currency or offledger
   */
  Description: string;

  /**
   * Current period balance
   * @description Balance for the current accounting period
   */
  Balance00?: number;

  /**
   * Historical balances (periods 1-90)
   * @description Balance01 is previous period, Balance02 is 2 periods ago, etc.
   */
  Balance01?: number;
  Balance02?: number;
  Balance03?: number;
  Balance04?: number;
  Balance05?: number;
  Balance06?: number;
  Balance07?: number;
  Balance08?: number;
  Balance09?: number;
  Balance10?: number;
  Balance11?: number;
  Balance12?: number;
  Balance13?: number;
  Balance14?: number;
  Balance15?: number;
  Balance16?: number;
  Balance17?: number;
  Balance18?: number;
  Balance19?: number;
  Balance20?: number;
  Balance21?: number;
  Balance22?: number;
  Balance23?: number;
  Balance24?: number;
  Balance25?: number;
  Balance26?: number;
  Balance27?: number;
  Balance28?: number;
  Balance29?: number;
  Balance30?: number;
  Balance31?: number;
  Balance32?: number;
  Balance33?: number;
  Balance34?: number;
  Balance35?: number;
  Balance36?: number;
  Balance37?: number;
  Balance38?: number;
  Balance39?: number;
  Balance40?: number;
  Balance41?: number;
  Balance42?: number;
  Balance43?: number;
  Balance44?: number;
  Balance45?: number;
  Balance46?: number;
  Balance47?: number;
  Balance48?: number;
  Balance49?: number;
  Balance50?: number;
  Balance51?: number;
  Balance52?: number;
  Balance53?: number;
  Balance54?: number;
  Balance55?: number;
  Balance56?: number;
  Balance57?: number;
  Balance58?: number;
  Balance59?: number;
  Balance60?: number;
  Balance61?: number;
  Balance62?: number;
  Balance63?: number;
  Balance64?: number;
  Balance65?: number;
  Balance66?: number;
  Balance67?: number;
  Balance68?: number;
  Balance69?: number;
  Balance70?: number;
  Balance71?: number;
  Balance72?: number;
  Balance73?: number;
  Balance74?: number;
  Balance75?: number;
  Balance76?: number;
  Balance77?: number;
  Balance78?: number;
  Balance79?: number;
  Balance80?: number;
  Balance81?: number;
  Balance82?: number;
  Balance83?: number;
  Balance84?: number;
  Balance85?: number;
  Balance86?: number;
  Balance87?: number;
  Balance88?: number;
  Balance89?: number;
  Balance90?: number;

  /**
   * Current period budget
   * @description Budget for the current accounting period
   */
  Budget00?: number;

  /**
   * Historical budgets (periods 1-29)
   * @description Budget01 is previous period, Budget02 is 2 periods ago, etc.
   */
  Budget01?: number;
  Budget02?: number;
  Budget03?: number;
  Budget04?: number;
  Budget05?: number;
  Budget06?: number;
  Budget07?: number;
  Budget08?: number;
  Budget09?: number;
  Budget10?: number;
  Budget11?: number;
  Budget12?: number;
  Budget13?: number;
  Budget14?: number;
  Budget15?: number;
  Budget16?: number;
  Budget17?: number;
  Budget18?: number;
  Budget19?: number;
  Budget20?: number;
  Budget21?: number;
  Budget22?: number;
  Budget23?: number;
  Budget24?: number;
  Budget25?: number;
  Budget26?: number;
  Budget27?: number;
  Budget28?: number;
  Budget29?: number;

  /**
   * Future budgets (periods 1-18)
   * @description BudgetNext01 is next period, BudgetNext02 is 2 periods ahead, etc.
   */
  BudgetNext01?: number;
  BudgetNext02?: number;
  BudgetNext03?: number;
  BudgetNext04?: number;
  BudgetNext05?: number;
  BudgetNext06?: number;
  BudgetNext07?: number;
  BudgetNext08?: number;
  BudgetNext09?: number;
  BudgetNext10?: number;
  BudgetNext11?: number;
  BudgetNext12?: number;
  BudgetNext13?: number;
  BudgetNext14?: number;
  BudgetNext15?: number;
  BudgetNext16?: number;
  BudgetNext17?: number;
  BudgetNext18?: number;

  /**
   * Unrealized gain GL account
   * @maxLength 7
   * @description Account for unrealized currency gains/losses
   * @relationship References Account.Code
   */
  LinkedAccountU?: string;

  /**
   * Realized gain GL account
   * @maxLength 7
   * @description Account for realized currency gains/losses
   * @relationship References Account.Code
   */
  LinkedAccountR?: string;

  /**
   * Preferred bank account for receipts
   * @maxLength 7
   * @description Default bank account for currency receipts
   * @relationship References Account.Code
   */
  PreferredBankCR?: string;

  /**
   * Preferred bank account for payments
   * @maxLength 7
   * @description Default bank account for currency payments
   * @relationship References Account.Code
   */
  PreferredBankCP?: string;

  /**
   * User-defined numeric field
   * @description Custom numeric data for scripts
   */
  UserNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Custom text data for scripts
   */
  UserText?: string;

  /**
   * Tagged text field
   * @maxLength 255
   * @description XML-tagged custom data
   */
  TaggedText?: string;

  /**
   * ISO currency code
   * @maxLength 3
   * @description Three-letter ISO 4217 currency code (e.g., USD, EUR)
   * @note Only applicable for currency records (Kind = 'CUR')
   */
  ISO?: string;

  /**
   * Current exchange rate
   * @description Exchange rate to base currency
   * @note Only applicable for currency records (Kind = 'CUR')
   */
  ExchangeRate?: number;

  /**
   * Opening balance
   * @description Initial balance when setting up the currency/offledger
   */
  OpeningBalance?: number;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @readonly
   */
  LastModifiedTime?: string;
}

/**
 * MoneyWorks OffLedger Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface OffLedgerCamel {
  /**
   * Record type
   * @maxLength 3
   * @description Distinguishes currency from user offledger records
   */
  kind: OffLedgerKind;

  /**
   * Currency or offledger name
   * @maxLength 15
   * @description For currencies, typically starts with @ (e.g., @USD)
   * @primaryKey
   */
  name: string;

  /**
   * Description
   * @maxLength 39
   * @description Full description of the currency or offledger
   */
  description: string;

  /**
   * Historical balances array
   * @description Array of balances from current (index 0) to 90 periods ago (index 90)
   */
  balances: number[];

  /**
   * Historical budgets array
   * @description Array of budgets from current (index 0) to 29 periods ago (index 29)
   */
  budgets: number[];

  /**
   * Future budgets array
   * @description Array of future budgets from next period (index 0) to 18 periods ahead (index 17)
   */
  futureBudgets: number[];

  /**
   * Unrealized gain GL account
   * @maxLength 7
   * @description Account for unrealized currency gains/losses
   * @relationship References Account.Code
   */
  linkedAccountU?: string;

  /**
   * Realized gain GL account
   * @maxLength 7
   * @description Account for realized currency gains/losses
   * @relationship References Account.Code
   */
  linkedAccountR?: string;

  /**
   * Preferred bank account for receipts
   * @maxLength 7
   * @description Default bank account for currency receipts
   * @relationship References Account.Code
   */
  preferredBankCR?: string;

  /**
   * Preferred bank account for payments
   * @maxLength 7
   * @description Default bank account for currency payments
   * @relationship References Account.Code
   */
  preferredBankCP?: string;

  /**
   * User-defined numeric field
   * @description Custom numeric data for scripts
   */
  userNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Custom text data for scripts
   */
  userText?: string;

  /**
   * Tagged text field
   * @maxLength 255
   * @description XML-tagged custom data
   */
  taggedText?: string;

  /**
   * ISO currency code
   * @maxLength 3
   * @description Three-letter ISO 4217 currency code (e.g., USD, EUR)
   * @note Only applicable for currency records (kind = 'CUR')
   */
  iso?: string;

  /**
   * Current exchange rate
   * @description Exchange rate to base currency
   * @note Only applicable for currency records (kind = 'CUR')
   */
  exchangeRate?: number;

  /**
   * Opening balance
   * @description Initial balance when setting up the currency/offledger
   */
  openingBalance?: number;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @readonly
   */
  lastModifiedTime?: string;
}

/**
 * Helper utilities for OffLedger table
 */
export const offLedgerHelpers = {
  /**
   * Check if a record is a currency
   */
  isCurrency(record: OffLedger | OffLedgerCamel): boolean {
    const kind = "Kind" in record ? record.Kind : record.kind;
    return kind === OffLedgerKind.Currency;
  },

  /**
   * Check if a name represents a currency (starts with @)
   */
  isCurrencyName(name: string): boolean {
    return name.startsWith("@");
  },

  /**
   * Extract currency code from currency name
   * @example "@USD" → "USD"
   */
  extractCurrencyCode(name: string): string {
    return name.startsWith("@") ? name.substring(1) : name;
  },

  /**
   * Format currency name from ISO code
   * @example "USD" → "@USD"
   */
  formatCurrencyName(isoCode: string): string {
    return `@${isoCode}`;
  },

  /**
   * Extract balance array from raw record
   */
  extractBalances(record: OffLedger): number[] {
    const balances: number[] = [];
    for (let i = 0; i <= 90; i++) {
      const key = `Balance${i.toString().padStart(2, "0")}` as keyof OffLedger;
      balances.push((record[key] as number) || 0);
    }
    return balances;
  },

  /**
   * Extract budget array from raw record
   */
  extractBudgets(record: OffLedger): number[] {
    const budgets: number[] = [];
    for (let i = 0; i <= 29; i++) {
      const key = `Budget${i.toString().padStart(2, "0")}` as keyof OffLedger;
      budgets.push((record[key] as number) || 0);
    }
    return budgets;
  },

  /**
   * Extract future budget array from raw record
   */
  extractFutureBudgets(record: OffLedger): number[] {
    const futureBudgets: number[] = [];
    for (let i = 1; i <= 18; i++) {
      const key =
        `BudgetNext${i.toString().padStart(2, "0")}` as keyof OffLedger;
      futureBudgets.push((record[key] as number) || 0);
    }
    return futureBudgets;
  },

  /**
   * Set balance value for specific period
   */
  setBalance(record: OffLedger, period: number, value: number): void {
    if (period < 0 || period > 90) {
      throw new Error("Period must be between 0 and 90");
    }
    const key =
      `Balance${period.toString().padStart(2, "0")}` as keyof OffLedger;
    (record[key] as number) = value;
  },

  /**
   * Set budget value for specific period
   */
  setBudget(record: OffLedger, period: number, value: number): void {
    if (period < 0 || period > 29) {
      throw new Error("Period must be between 0 and 29");
    }
    const key =
      `Budget${period.toString().padStart(2, "0")}` as keyof OffLedger;
    (record[key] as number) = value;
  },

  /**
   * Set future budget value for specific period
   */
  setFutureBudget(record: OffLedger, period: number, value: number): void {
    if (period < 1 || period > 18) {
      throw new Error("Period must be between 1 and 18");
    }
    const key =
      `BudgetNext${period.toString().padStart(2, "0")}` as keyof OffLedger;
    (record[key] as number) = value;
  },
};

/**
 * Converter utilities for OffLedger table
 */
export const offLedgerConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: OffLedger): OffLedgerCamel {
    return {
      kind: raw.Kind,
      name: raw.Name,
      description: raw.Description,
      balances: offLedgerHelpers.extractBalances(raw),
      budgets: offLedgerHelpers.extractBudgets(raw),
      futureBudgets: offLedgerHelpers.extractFutureBudgets(raw),
      linkedAccountU: raw.LinkedAccountU,
      linkedAccountR: raw.LinkedAccountR,
      preferredBankCR: raw.PreferredBankCR,
      preferredBankCP: raw.PreferredBankCP,
      userNum: raw.UserNum,
      userText: raw.UserText,
      taggedText: raw.TaggedText,
      iso: raw.ISO,
      exchangeRate: raw.ExchangeRate,
      openingBalance: raw.OpeningBalance,
      lastModifiedTime: raw.LastModifiedTime,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  toPascalCase(camel: OffLedgerCamel): OffLedger {
    const raw: OffLedger = {
      Kind: camel.kind,
      Name: camel.name,
      Description: camel.description,
      LinkedAccountU: camel.linkedAccountU,
      LinkedAccountR: camel.linkedAccountR,
      PreferredBankCR: camel.preferredBankCR,
      PreferredBankCP: camel.preferredBankCP,
      UserNum: camel.userNum,
      UserText: camel.userText,
      TaggedText: camel.taggedText,
      ISO: camel.iso,
      ExchangeRate: camel.exchangeRate,
      OpeningBalance: camel.openingBalance,
      LastModifiedTime: camel.lastModifiedTime,
    };

    // Set balance fields
    camel.balances.forEach((balance, i) => {
      if (i <= 90) {
        offLedgerHelpers.setBalance(raw, i, balance);
      }
    });

    // Set budget fields
    camel.budgets.forEach((budget, i) => {
      if (i <= 29) {
        offLedgerHelpers.setBudget(raw, i, budget);
      }
    });

    // Set future budget fields
    camel.futureBudgets.forEach((budget, i) => {
      if (i < 18) {
        offLedgerHelpers.setFutureBudget(raw, i + 1, budget);
      }
    });

    return raw;
  },
};

/**
 * Type guard to check if a record is an OffLedger
 */
export function isOffLedger(record: unknown): record is OffLedger {
  return (
    record !== null &&
    typeof record === "object" &&
    "Kind" in record &&
    "Name" in record &&
    "Description" in record &&
    ((record as OffLedger).Kind === OffLedgerKind.Currency ||
      (record as OffLedger).Kind === OffLedgerKind.User)
  );
}

/**
 * Type guard to check if a record is an OffLedgerCamel
 */
export function isOffLedgerCamel(record: unknown): record is OffLedgerCamel {
  return (
    record !== null &&
    typeof record === "object" &&
    "kind" in record &&
    "name" in record &&
    "description" in record &&
    Array.isArray((record as OffLedgerCamel).balances) &&
    Array.isArray((record as OffLedgerCamel).budgets) &&
    Array.isArray((record as OffLedgerCamel).futureBudgets) &&
    ((record as OffLedgerCamel).kind === OffLedgerKind.Currency ||
      (record as OffLedgerCamel).kind === OffLedgerKind.User)
  );
}
