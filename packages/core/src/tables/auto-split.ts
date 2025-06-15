/**
 * MoneyWorks AutoSplit table interface
 * Defines automatic transaction allocation rules for bank reconciliation
 */

/**
 * Raw AutoSplit interface matching MoneyWorks field names
 */
export interface AutoSplit {
  /** Timestamp when the record was last modified */
  LastModifiedTime?: string;

  /** Matching text/function for split rule - conditions to test against memo, payee, amount, bank account */
  MatchFunction?: string;

  /** Name of the allocation rule (max 11 chars) */
  MatchName?: string;

  /** Rule priority for processing order - higher priority rules are processed first */
  Priority?: number;

  /** First target account for allocation (max 13 chars) */
  SplitAcct1?: string;

  /** Second target account for allocation (max 13 chars) */
  SplitAcct2?: string;

  /** Third target account for allocation (max 13 chars) */
  SplitAcct3?: string;

  /** Fourth target account for allocation (max 13 chars) */
  SplitAcct4?: string;

  /** First allocation amount - can be percentage (0-100) or fixed amount */
  SplitAmount1?: number;

  /** Second allocation amount - can be percentage (0-100) or fixed amount */
  SplitAmount2?: number;

  /** Third allocation amount - can be percentage (0-100) or fixed amount */
  SplitAmount3?: number;

  /** Fourth allocation amount - can be percentage (0-100) or fixed amount */
  SplitAmount4?: number;

  /** Department code for first split */
  SplitDept1?: string;

  /** Department code for second split */
  SplitDept2?: string;

  /** Department code for third split */
  SplitDept3?: string;

  /** Department code for fourth split */
  SplitDept4?: string;

  /** Split mode - 'P' for percentage, 'A' for absolute amount */
  SplitMode?: SplitModeType;

  /** Account to allocate any remainder amount */
  RemainderAccount?: string;

  /** Department for remainder allocation */
  RemainderDept?: string;

  /** Whether this rule is active */
  Active?: boolean;

  /** Bank account this rule applies to */
  BankAccount?: string;
}

/**
 * Camel case AutoSplit interface
 */
export interface AutoSplitCamel {
  /** Timestamp when the record was last modified */
  lastModifiedTime?: string;

  /** Matching text/function for split rule - conditions to test against memo, payee, amount, bank account */
  matchFunction?: string;

  /** Name of the allocation rule (max 11 chars) */
  matchName?: string;

  /** Rule priority for processing order - higher priority rules are processed first */
  priority?: number;

  /** First target account for allocation (max 13 chars) */
  splitAcct1?: string;

  /** Second target account for allocation (max 13 chars) */
  splitAcct2?: string;

  /** Third target account for allocation (max 13 chars) */
  splitAcct3?: string;

  /** Fourth target account for allocation (max 13 chars) */
  splitAcct4?: string;

  /** First allocation amount - can be percentage (0-100) or fixed amount */
  splitAmount1?: number;

  /** Second allocation amount - can be percentage (0-100) or fixed amount */
  splitAmount2?: number;

  /** Third allocation amount - can be percentage (0-100) or fixed amount */
  splitAmount3?: number;

  /** Fourth allocation amount - can be percentage (0-100) or fixed amount */
  splitAmount4?: number;

  /** Department code for first split */
  splitDept1?: string;

  /** Department code for second split */
  splitDept2?: string;

  /** Department code for third split */
  splitDept3?: string;

  /** Department code for fourth split */
  splitDept4?: string;

  /** Split mode - 'P' for percentage, 'A' for absolute amount */
  splitMode?: SplitModeType;

  /** Account to allocate any remainder amount */
  remainderAccount?: string;

  /** Department for remainder allocation */
  remainderDept?: string;

  /** Whether this rule is active */
  active?: boolean;

  /** Bank account this rule applies to */
  bankAccount?: string;
}

/**
 * Split mode types
 */
export enum SplitModeType {
  /** Percentage-based allocation */
  PERCENTAGE = "P",
  /** Absolute/fixed amount allocation */
  AMOUNT = "A",
}

/**
 * Split allocation entry for easier manipulation
 */
export interface SplitAllocation {
  account: string;
  amount: number;
  department?: string;
  isPercentage: boolean;
}

/**
 * Converts raw AutoSplit to camelCase
 */
export function autoSplitToCamel(raw: AutoSplit): AutoSplitCamel {
  return {
    lastModifiedTime: raw.LastModifiedTime,
    matchFunction: raw.MatchFunction,
    matchName: raw.MatchName,
    priority: raw.Priority,
    splitAcct1: raw.SplitAcct1,
    splitAcct2: raw.SplitAcct2,
    splitAcct3: raw.SplitAcct3,
    splitAcct4: raw.SplitAcct4,
    splitAmount1: raw.SplitAmount1,
    splitAmount2: raw.SplitAmount2,
    splitAmount3: raw.SplitAmount3,
    splitAmount4: raw.SplitAmount4,
    splitDept1: raw.SplitDept1,
    splitDept2: raw.SplitDept2,
    splitDept3: raw.SplitDept3,
    splitDept4: raw.SplitDept4,
    splitMode: raw.SplitMode,
    remainderAccount: raw.RemainderAccount,
    remainderDept: raw.RemainderDept,
    active: raw.Active,
    bankAccount: raw.BankAccount,
  };
}

/**
 * Converts camelCase AutoSplit to raw
 */
export function autoSplitToRaw(camel: AutoSplitCamel): AutoSplit {
  return {
    LastModifiedTime: camel.lastModifiedTime,
    MatchFunction: camel.matchFunction,
    MatchName: camel.matchName,
    Priority: camel.priority,
    SplitAcct1: camel.splitAcct1,
    SplitAcct2: camel.splitAcct2,
    SplitAcct3: camel.splitAcct3,
    SplitAcct4: camel.splitAcct4,
    SplitAmount1: camel.splitAmount1,
    SplitAmount2: camel.splitAmount2,
    SplitAmount3: camel.splitAmount3,
    SplitAmount4: camel.splitAmount4,
    SplitDept1: camel.splitDept1,
    SplitDept2: camel.splitDept2,
    SplitDept3: camel.splitDept3,
    SplitDept4: camel.splitDept4,
    SplitMode: camel.splitMode,
    RemainderAccount: camel.remainderAccount,
    RemainderDept: camel.remainderDept,
    Active: camel.active,
    BankAccount: camel.bankAccount,
  };
}

/**
 * Helper to extract split allocations from AutoSplit into a more manageable array
 */
export function extractSplitAllocations(
  autoSplit: AutoSplit,
): SplitAllocation[] {
  const allocations: SplitAllocation[] = [];
  const isPercentageMode = autoSplit.SplitMode === SplitModeType.PERCENTAGE;

  // Extract up to 4 split allocations
  for (let i = 1; i <= 4; i++) {
    const account = autoSplit[`SplitAcct${i}` as keyof AutoSplit] as
      | string
      | undefined;
    const amount = autoSplit[`SplitAmount${i}` as keyof AutoSplit] as
      | number
      | undefined;
    const department = autoSplit[`SplitDept${i}` as keyof AutoSplit] as
      | string
      | undefined;

    if (account && amount !== undefined) {
      allocations.push({
        account,
        amount,
        department,
        isPercentage: isPercentageMode,
      });
    }
  }

  return allocations;
}

/**
 * Helper to build AutoSplit from allocations array
 */
export function buildAutoSplitFromAllocations(
  baseSplit: Partial<AutoSplit>,
  allocations: SplitAllocation[],
): AutoSplit {
  const result: AutoSplit = { ...baseSplit };

  // Clear existing allocations
  for (let i = 1; i <= 4; i++) {
    delete result[`SplitAcct${i}` as keyof AutoSplit];
    delete result[`SplitAmount${i}` as keyof AutoSplit];
    delete result[`SplitDept${i}` as keyof AutoSplit];
  }

  // Set new allocations (up to 4)
  allocations.slice(0, 4).forEach((allocation, index) => {
    const i = index + 1;
    (result as Record<string, unknown>)[`SplitAcct${i}`] = allocation.account;
    (result as Record<string, unknown>)[`SplitAmount${i}`] = allocation.amount;
    if (allocation.department) {
      (result as Record<string, unknown>)[`SplitDept${i}`] =
        allocation.department;
    }
  });

  // Set split mode based on first allocation
  if (allocations.length > 0 && allocations[0]) {
    result.SplitMode = allocations[0].isPercentage
      ? SplitModeType.PERCENTAGE
      : SplitModeType.AMOUNT;
  }

  return result;
}

/**
 * Validates that percentage allocations don't exceed 100%
 */
export function validatePercentageAllocations(
  allocations: SplitAllocation[],
): boolean {
  const percentageAllocations = allocations.filter((a) => a.isPercentage);
  const totalPercentage = percentageAllocations.reduce(
    (sum, a) => sum + a.amount,
    0,
  );
  return totalPercentage <= 100;
}

/**
 * Calculate remainder amount for a transaction
 */
export function calculateRemainder(
  transactionAmount: number,
  allocations: SplitAllocation[],
): number {
  let allocated = 0;

  for (const allocation of allocations) {
    if (allocation.isPercentage && allocation.amount !== undefined) {
      allocated += (transactionAmount * allocation.amount) / 100;
    } else if (allocation.amount !== undefined) {
      allocated += allocation.amount;
    }
  }

  return transactionAmount - allocated;
}

/**
 * Creates a default AutoSplit rule
 */
export function createDefaultAutoSplit(): AutoSplit {
  return {
    MatchName: "",
    MatchFunction: "",
    Priority: 0,
    SplitMode: SplitModeType.PERCENTAGE,
    Active: true,
  };
}
