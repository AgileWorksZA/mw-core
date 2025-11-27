/**
 * Balance Sheet Report Generator
 *
 * Generates a standard balance sheet showing:
 * - Assets (Current and Fixed)
 * - Liabilities (Current and Long-term)
 * - Equity
 *
 * Options:
 * - Omit Zero Balance: Hide accounts with no balance
 * - Include Unposted: Include draft transactions
 * - Print Movements: Show debit/credit columns
 * - Show Departments: Break down by department
 * - Cash Basis: Cash vs accrual accounting
 */

import type {
  BalanceSheetReport,
  BalanceSheetOptions,
  BalanceSheetSection,
  BalanceSheetLineItem,
  ReportValue,
} from './types';

import { createReportValue, formatCurrency, formatDateForDisplay } from './executive-summary';

// Re-export the helper for use here
export { formatDateForDisplay };

// =============================================================================
// Balance Sheet Builder
// =============================================================================

/**
 * Build Balance Sheet from raw query results
 */
export function buildBalanceSheetFromData(
  data: BalanceSheetRawData,
  options: BalanceSheetOptions
): BalanceSheetReport {
  const { accounts, companyName } = data;

  // Group accounts by type
  const currentAssets = accounts.filter(a => a.category === 'CURRENT ASSETS');
  const fixedAssets = accounts.filter(a => a.category === 'FIXED ASSETS');
  const currentLiabilities = accounts.filter(a => a.category === 'CURRENT LIABILITIES');
  const equity = accounts.filter(a => a.category === 'EQUITY');

  // Build sections
  const currentAssetsSection = buildSection('CURRENT ASSETS', currentAssets, options);
  const fixedAssetsSection = buildSection('FIXED ASSETS', fixedAssets, options);
  const currentLiabilitiesSection = buildSection('CURRENT LIABILITIES', currentLiabilities, options);
  const equitySection = buildSection('EQUITY', equity, options);

  // Calculate totals
  const totalAssets = currentAssetsSection.subtotal.thisYear.value + fixedAssetsSection.subtotal.thisYear.value;
  const totalAssetsLastYear = (currentAssetsSection.subtotal.lastYearEnd?.value || 0) +
                              (fixedAssetsSection.subtotal.lastYearEnd?.value || 0);

  const totalLiabilities = currentLiabilitiesSection.subtotal.thisYear.value;
  const totalEquityBase = equitySection.subtotal.thisYear.value;

  // Current year surplus = Total Assets - Total Liabilities - Base Equity
  const currentYearSurplus = data.currentYearSurplus || (totalAssets - totalLiabilities - totalEquityBase);
  const priorYearSurplus = data.priorYearSurplus;

  const totalCapitalFunds = totalEquityBase + currentYearSurplus;
  const liabilitiesAndEquity = totalLiabilities + totalCapitalFunds;

  return {
    metadata: {
      reportType: 'balance-sheet',
      title: 'Balance Sheet',
      companyName,
      currentPeriod: {
        startDate: '',
        endDate: options.asOfDate,
        description: `As at ${formatDateForDisplay(options.asOfDate)}`,
        mwPeriod: options.period ? parseMWPeriod(options.period) : undefined,
      },
      generatedAt: new Date().toISOString(),
      currency: options.currency || 'NZD',
      schemaVersion: '1.0.0',
    },

    options,

    assets: {
      currentAssets: currentAssetsSection,
      fixedAssets: fixedAssetsSection,
      total: createLineItem('TOTAL ASSETS', totalAssets, totalAssetsLastYear, { isTotal: true }),
    },

    liabilities: {
      currentLiabilities: currentLiabilitiesSection,
    },

    equity: {
      section: equitySection,
      currentYearSurplus: createLineItem(
        'Plus Current Year Operating Surplus/(Deficit)',
        currentYearSurplus,
        priorYearSurplus,
        { indentLevel: 1 }
      ),
      totalCapitalFunds: createLineItem(
        'TOTAL CAPITAL FUNDS',
        totalCapitalFunds,
        (equitySection.subtotal.lastYearEnd?.value || 0) + (priorYearSurplus || 0),
        { isTotal: true }
      ),
    },

    liabilitiesAndEquity: createLineItem(
      'LIABILITIES AND EQUITY',
      liabilitiesAndEquity,
      (currentLiabilitiesSection.subtotal.lastYearEnd?.value || 0) +
        (equitySection.subtotal.lastYearEnd?.value || 0) + (priorYearSurplus || 0),
      { isTotal: true }
    ),

    isBalanced: Math.abs(totalAssets - liabilitiesAndEquity) < 0.01,
  };
}

/**
 * Build a section from account data
 */
function buildSection(
  title: string,
  accounts: AccountData[],
  options: BalanceSheetOptions
): BalanceSheetSection {
  const items: BalanceSheetLineItem[] = [];
  let subtotalThisYear = 0;
  let subtotalLastYear = 0;

  for (const account of accounts) {
    // Skip zero balance if option set
    if (options.omitZeroBalance && account.thisYear === 0 && (account.lastYearEnd || 0) === 0) {
      continue;
    }

    items.push(createLineItem(
      account.name,
      account.thisYear,
      account.lastYearEnd,
      {
        accountCode: options.showAccountCodes ? account.code : undefined,
        indentLevel: 1,
      }
    ));

    subtotalThisYear += account.thisYear;
    subtotalLastYear += account.lastYearEnd || 0;
  }

  return {
    title,
    items,
    subtotal: createLineItem('', subtotalThisYear, subtotalLastYear, { isSubtotal: true }),
  };
}

/**
 * Create a line item with proper formatting
 */
function createLineItem(
  name: string,
  thisYear: number,
  lastYearEnd?: number,
  opts: {
    accountCode?: string;
    indentLevel?: number;
    isSubtotal?: boolean;
    isTotal?: boolean;
  } = {}
): BalanceSheetLineItem {
  return {
    accountCode: opts.accountCode,
    accountName: name,
    thisYear: {
      value: thisYear,
      formatted: formatCurrency(thisYear),
    },
    lastYearEnd: lastYearEnd !== undefined ? {
      value: lastYearEnd,
      formatted: formatCurrency(lastYearEnd),
    } : undefined,
    indentLevel: opts.indentLevel ?? 0,
    isSubtotal: opts.isSubtotal,
    isTotal: opts.isTotal,
  };
}

/**
 * Parse MoneyWorks period string (e.g., "Jan:2024/25") to period number
 */
function parseMWPeriod(period: string): number | undefined {
  const match = period.match(/(\w+):(\d{4})\/(\d{2})/);
  if (!match) return undefined;

  const months: Record<string, number> = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
  };

  const monthNum = months[match[1]] || 1;
  const year = parseInt(match[2]);
  return year * 100 + monthNum;
}

// =============================================================================
// Raw Data Interface
// =============================================================================

export interface AccountData {
  code: string;
  name: string;
  category: 'CURRENT ASSETS' | 'FIXED ASSETS' | 'CURRENT LIABILITIES' | 'LONG-TERM LIABILITIES' | 'EQUITY';
  thisYear: number;
  lastYearEnd?: number;
  movement?: { debit: number; credit: number };
  departments?: Record<string, number>;
}

export interface BalanceSheetRawData {
  companyName: string;
  accounts: AccountData[];
  currentYearSurplus?: number;
  priorYearSurplus?: number;
}

// =============================================================================
// Sample Data (matching the provided Balance Sheet)
// =============================================================================

export function createSampleBalanceSheetData(): BalanceSheetRawData {
  return {
    companyName: 'Acme Widgets Ltd',
    accounts: [
      // CURRENT ASSETS
      { code: '1000-', name: 'Main Bank Account', category: 'CURRENT ASSETS', thisYear: 8221.85, lastYearEnd: 42239.72 },
      { code: '1300-', name: 'Stock On Hand', category: 'CURRENT ASSETS', thisYear: 2521.52, lastYearEnd: 1523.37 },
      { code: '1400-', name: 'GST Paid', category: 'CURRENT ASSETS', thisYear: 0, lastYearEnd: 18466.40 },
      { code: '1500-', name: 'Accounts Receivable', category: 'CURRENT ASSETS', thisYear: 52681.57, lastYearEnd: 12557.90 },

      // FIXED ASSETS
      { code: '1600-', name: 'Office Equipment', category: 'FIXED ASSETS', thisYear: 5771.74, lastYearEnd: 0 },
      { code: '1700-', name: 'Plant', category: 'FIXED ASSETS', thisYear: 33241.32, lastYearEnd: 8310.33 },

      // CURRENT LIABILITIES
      { code: '2100-', name: 'GST Received', category: 'CURRENT LIABILITIES', thisYear: 0, lastYearEnd: 25406.54 },
      { code: '2000-', name: 'Accounts Payable', category: 'CURRENT LIABILITIES', thisYear: 13250.01, lastYearEnd: 6096.49 },
      { code: '2400-', name: 'GST Holding', category: 'CURRENT LIABILITIES', thisYear: 6712.28, lastYearEnd: 0 },

      // EQUITY
      { code: '3000-', name: 'Authorised Capital', category: 'EQUITY', thisYear: 5000.00, lastYearEnd: 5000.00 },
      { code: '3100-', name: 'Retained Earnings', category: 'EQUITY', thisYear: 52219.69, lastYearEnd: 0 },
      { code: '3200-', name: 'Drawings', category: 'EQUITY', thisYear: -41250.00, lastYearEnd: -5625.00 },
    ],
    currentYearSurplus: 66506.02,
    priorYearSurplus: 52219.69,
  };
}

/**
 * Default options for Balance Sheet
 */
export function getDefaultBalanceSheetOptions(asOfDate: string): BalanceSheetOptions {
  return {
    asOfDate,
    omitZeroBalance: true,
    includeUnposted: false,
    printMovements: false,
    showDepartments: false,
    cashBasis: false,
    showAccountCodes: false,
    sort: 'accountCode',
    currency: 'NZD',
  };
}
