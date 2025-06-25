/**
 * MoneyWorks Reconciliation table interface
 * Tracks bank reconciliation history
 * @see https://cognito.co.nz/manual/moneyworks_appendix_reconciliation_file.html
 */

// Type definitions for field types
type AccountCode = string; // 8 character account code
type ReconciliationDate = string; // ISO date string
type NumericAmount = number;
type ReconciliationTime = string; // Date/time string
type StatementNumber = number;

/**
 * Raw Reconciliation interface matching MoneyWorks field names (PascalCase)
 * Tracks bank reconciliation history and discrepancies
 */
export interface Reconciliation {
  /** Account code that was reconciled (max 8 chars) - links to bank/financial account */
  Account: AccountCode;

  /** Closing balance of the account after reconciliation */
  Closing: NumericAmount;

  /** Statement date - when bank statement was processed */
  Date: ReconciliationDate;

  /** Difference in reconciliation - highlights potential accounting mismatches */
  Discrepancy: NumericAmount;

  /** Date and time record was last changed - audit trail */
  LastModifiedTime: ReconciliationTime;

  /** Opening balance before reconciliation (max 5 chars in MW, but stored as text) */
  Opening: string;

  /** Statement number - unique identifier for reconciliation event */
  Statement: StatementNumber;

  /** Date and time of reconciliation - precise timing of process */
  Time: ReconciliationTime;
}

/**
 * CamelCase version of Reconciliation interface for TypeScript usage
 */
export interface ReconciliationCamel {
  /** Account code that was reconciled (max 8 chars) - links to bank/financial account */
  account: AccountCode;

  /** Closing balance of the account after reconciliation */
  closing: NumericAmount;

  /** Statement date - when bank statement was processed */
  date: ReconciliationDate;

  /** Difference in reconciliation - highlights potential accounting mismatches */
  discrepancy: NumericAmount;

  /** Date and time record was last changed - audit trail */
  lastModifiedTime: ReconciliationTime;

  /** Opening balance before reconciliation */
  opening: string;

  /** Statement number - unique identifier for reconciliation event */
  statement: StatementNumber;

  /** Date and time of reconciliation - precise timing of process */
  time: ReconciliationTime;
}

/**
 * Converter from raw MoneyWorks format to camelCase
 */
export function fromMoneyWorksReconciliation(
  raw: Reconciliation,
): ReconciliationCamel {
  return {
    account: raw.Account,
    closing: raw.Closing,
    date: raw.Date,
    discrepancy: raw.Discrepancy,
    lastModifiedTime: raw.LastModifiedTime,
    opening: raw.Opening,
    statement: raw.Statement,
    time: raw.Time,
  };
}

/**
 * Converter from camelCase to MoneyWorks format
 */
export function toMoneyWorksReconciliation(
  camel: ReconciliationCamel,
): Reconciliation {
  return {
    Account: camel.account,
    Closing: camel.closing,
    Date: camel.date,
    Discrepancy: camel.discrepancy,
    LastModifiedTime: camel.lastModifiedTime,
    Opening: camel.opening,
    Statement: camel.statement,
    Time: camel.time,
  };
}

/**
 * Type guard to check if an object is a valid Reconciliation
 */
export function isReconciliation(obj: unknown): obj is Reconciliation {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "Account" in obj &&
    "Closing" in obj &&
    "Date" in obj &&
    "Discrepancy" in obj &&
    "LastModifiedTime" in obj &&
    "Opening" in obj &&
    "Statement" in obj &&
    "Time" in obj
  );
}

/**
 * Type guard to check if an object is a valid ReconciliationCamel
 */
export function isReconciliationCamel(
  obj: unknown,
): obj is ReconciliationCamel {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "account" in obj &&
    "closing" in obj &&
    "date" in obj &&
    "discrepancy" in obj &&
    "lastModifiedTime" in obj &&
    "opening" in obj &&
    "statement" in obj &&
    "time" in obj
  );
}

/**
 * Utility to parse opening balance from string to number
 * MoneyWorks stores this as text but it represents a numeric value
 */
export function parseOpeningBalance(opening: string): number {
  const parsed = Number.parseFloat(opening);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Utility to check if a reconciliation has a discrepancy
 */
export function hasDiscrepancy(
  reconciliation: Reconciliation | ReconciliationCamel,
): boolean {
  const discrepancy =
    "Discrepancy" in reconciliation
      ? reconciliation.Discrepancy
      : reconciliation.discrepancy;
  return Math.abs(discrepancy) > 0.001; // Allow for small floating point differences
}

/**
 * Utility to calculate the change in balance during reconciliation
 */
export function calculateBalanceChange(
  reconciliation: Reconciliation | ReconciliationCamel,
): number {
  if ("Closing" in reconciliation) {
    const opening = parseOpeningBalance(reconciliation.Opening);
    return reconciliation.Closing - opening;
  }
  const opening = parseOpeningBalance(reconciliation.opening);
  return reconciliation.closing - opening;
}

/**
 * Default values for creating a new Reconciliation record
 */
export const defaultReconciliation: Partial<Reconciliation> = {
  Closing: 0,
  Discrepancy: 0,
  Opening: "0",
};

/**
 * Default values for creating a new ReconciliationCamel record
 */
export const defaultReconciliationCamel: Partial<ReconciliationCamel> = {
  closing: 0,
  discrepancy: 0,
  opening: "0",
};

/**
 * Formats a reconciliation for display
 */
export function formatReconciliationSummary(
  rec: Reconciliation | ReconciliationCamel,
): string {
  const account = "Account" in rec ? rec.Account : rec.account;
  const date = "Date" in rec ? rec.Date : rec.date;
  const discrepancy = "Discrepancy" in rec ? rec.Discrepancy : rec.discrepancy;
  const hasDisc = hasDiscrepancy(rec);

  return `Account ${account} reconciled on ${date}${hasDisc ? ` (discrepancy: ${discrepancy})` : ""}`;
}
