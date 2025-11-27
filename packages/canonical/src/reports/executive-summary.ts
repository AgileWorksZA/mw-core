/**
 * Executive Summary Report Generator
 *
 * Generates a comprehensive business summary including:
 * - Income and Profitability
 * - Invoice Statistics
 * - Cash Flow
 * - Balance Sheet Summary
 * - Inventory Analysis
 * - Payables and Receivables Aging
 *
 * @ai-instruction This report requires querying multiple MoneyWorks tables
 * and performing calculations. The data layer will handle the actual queries.
 */

import type {
  ExecutiveSummaryReport,
  ExecutiveSummaryOptions,
  ReportValue,
  ReportMetric,
  TrendDirection,
  AgingBucket,
  IncomeProfitabilitySection,
  InvoiceStatisticsSection,
  CashSection,
  BalanceSheetSummarySection,
  InventorySection,
  PayablesReceivablesSection,
} from './types';

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Determine trend direction based on current vs prior value
 */
export function calculateTrend(
  current: number,
  prior: number | undefined | null
): TrendDirection {
  if (prior === undefined || prior === null) return 'na';
  if (current > prior) return 'up';
  if (current < prior) return 'down';
  return 'flat';
}

/**
 * Calculate percentage of base value
 */
export function calculatePercentage(value: number, base: number): number {
  if (base === 0) return 0;
  return Math.round((value / base) * 1000) / 10; // One decimal place
}

/**
 * Format a number as currency string
 */
export function formatCurrency(value: number, currency = 'NZD'): string {
  const formatter = new Intl.NumberFormat('en-NZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Handle negative values with parentheses
  if (value < 0) {
    return `(${formatter.format(Math.abs(value))})`;
  }
  return formatter.format(value);
}

/**
 * Format a ratio/metric value
 */
export function formatMetric(value: number, decimals = 2): string {
  if (!isFinite(value) || isNaN(value)) return '-';
  return value.toFixed(decimals);
}

/**
 * Create a ReportValue with all computed fields
 */
export function createReportValue(
  value: number,
  baseValue?: number,
  priorValue?: number,
  priorBaseValue?: number,
  currency = 'NZD'
): ReportValue {
  const percentage = baseValue !== undefined
    ? calculatePercentage(value, baseValue)
    : undefined;

  const priorPercentage = priorBaseValue !== undefined && priorValue !== undefined
    ? calculatePercentage(priorValue, priorBaseValue)
    : undefined;

  return {
    value,
    formatted: formatCurrency(value, currency),
    percentage,
    priorValue,
    priorPercentage,
    trend: calculateTrend(value, priorValue),
  };
}

/**
 * Create a ReportMetric with computed fields
 */
export function createReportMetric(
  value: number,
  priorValue?: number,
  unit?: string
): ReportMetric {
  return {
    value,
    formatted: formatMetric(value),
    priorValue,
    trend: calculateTrend(value, priorValue),
    unit,
  };
}

// =============================================================================
// Sample Data Builder (for demonstration)
// =============================================================================

/**
 * Build Executive Summary from raw query results
 *
 * This function transforms raw MoneyWorks data into the report structure.
 * The actual queries will be performed by the data layer.
 */
export function buildExecutiveSummaryFromData(
  data: ExecutiveSummaryRawData,
  options: ExecutiveSummaryOptions
): ExecutiveSummaryReport {
  const { current, prior } = data;

  // Calculate base values for percentages
  const currentSales = current.sales;
  const priorSales = prior?.sales || 0;

  return {
    metadata: {
      reportType: 'executive-summary',
      title: 'Executive Summary',
      companyName: data.companyName,
      currentPeriod: {
        startDate: options.asOfDate.slice(0, 4) + '-' +
                   String(13 - (options.months || 12)).padStart(2, '0') + '-01',
        endDate: options.asOfDate,
        description: `${options.months || 12} Months to ${formatDateForDisplay(options.asOfDate)}`,
      },
      priorPeriod: prior ? {
        startDate: '', // Calculate from prior year
        endDate: '', // Calculate from prior year
        description: `${options.months || 12} Months Ending ${formatDateForDisplay(getPriorYearDate(options.asOfDate))}`,
      } : undefined,
      generatedAt: new Date().toISOString(),
      currency: options.currency || 'NZD',
      schemaVersion: '1.0.0',
    },

    incomeProfitability: {
      sales: createReportValue(current.sales, currentSales, prior?.sales, priorSales),
      costOfSales: createReportValue(current.costOfSales, currentSales, prior?.costOfSales, priorSales),
      grossMargin: createReportValue(current.grossMargin, currentSales, prior?.grossMargin, priorSales),
      otherIncome: createReportValue(current.otherIncome, currentSales, prior?.otherIncome, priorSales),
      expenses: createReportValue(current.expenses, currentSales, prior?.expenses, priorSales),
      netProfit: createReportValue(current.netProfit, currentSales, prior?.netProfit, priorSales),
    },

    invoiceStatistics: {
      invoiceCount: createReportMetric(current.invoiceCount, prior?.invoiceCount),
      totalValue: createReportValue(current.invoiceTotalValue, undefined, prior?.invoiceTotalValue),
      averageValue: createReportMetric(current.invoiceAverageValue, prior?.invoiceAverageValue),
    },

    cash: {
      openingBalance: createReportValue(current.openingCash, undefined, prior?.openingCash),
      cashReceived: createReportValue(current.cashReceived, undefined, prior?.cashReceived),
      cashSpent: createReportValue(current.cashSpent, undefined, prior?.cashSpent),
      surplusDeficit: createReportValue(current.cashSurplusDeficit, undefined, prior?.cashSurplusDeficit),
      adjustments: createReportValue(current.cashAdjustments, undefined, prior?.cashAdjustments),
      closingBalance: createReportValue(current.closingCash, undefined, prior?.closingCash),
    },

    balanceSheet: {
      currentAssets: createReportValue(current.currentAssets, undefined, prior?.currentAssets),
      currentLiabilities: createReportValue(current.currentLiabilities, undefined, prior?.currentLiabilities),
      ratios: {
        currentRatio: createReportMetric(current.currentRatio, prior?.currentRatio),
        quickRatio: createReportMetric(current.quickRatio, prior?.quickRatio),
        cashRatio: createReportMetric(current.cashRatio, prior?.cashRatio),
      },
    },

    inventory: {
      openingStock: createReportValue(current.openingStock, undefined, prior?.openingStock),
      purchases: createReportValue(current.purchases, undefined, prior?.purchases),
      closingStock: createReportValue(current.closingStock, undefined, prior?.closingStock),
      costOfSales: createReportValue(current.inventoryCostOfSales, undefined, prior?.inventoryCostOfSales),
      metrics: {
        inventoryTurnover: createReportMetric(current.inventoryTurnover, prior?.inventoryTurnover, 'times'),
        inventoryPeriod: createReportMetric(current.inventoryPeriod, prior?.inventoryPeriod, 'days'),
      },
    },

    payablesReceivables: {
      payables: {
        total: createReportValue(current.payables, undefined, prior?.payables),
        aging: current.payablesAging,
      },
      receivables: {
        total: createReportValue(current.receivables, undefined, prior?.receivables),
        aging: current.receivablesAging,
        creditSales: createReportValue(current.creditSales, undefined, prior?.creditSales),
        turnover: createReportMetric(current.receivablesTurnover, prior?.receivablesTurnover, 'times'),
        averageCollectionDays: createReportMetric(current.averageCollectionDays, prior?.averageCollectionDays, 'days'),
      },
    },
  };
}

// =============================================================================
// Raw Data Interface (what the data layer provides)
// =============================================================================

/**
 * Raw period data from MoneyWorks queries
 */
export interface PeriodData {
  // Income & Profitability
  sales: number;
  costOfSales: number;
  grossMargin: number;
  otherIncome: number;
  expenses: number;
  netProfit: number;

  // Invoice Statistics
  invoiceCount: number;
  invoiceTotalValue: number;
  invoiceAverageValue: number;

  // Cash
  openingCash: number;
  cashReceived: number;
  cashSpent: number;
  cashSurplusDeficit: number;
  cashAdjustments: number;
  closingCash: number;

  // Balance Sheet
  currentAssets: number;
  currentLiabilities: number;
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;

  // Inventory
  openingStock: number;
  purchases: number;
  closingStock: number;
  inventoryCostOfSales: number;
  inventoryTurnover: number;
  inventoryPeriod: number;

  // Payables/Receivables
  payables: number;
  receivables: number;
  creditSales: number;
  receivablesTurnover: number;
  averageCollectionDays: number;
  payablesAging: AgingBucket[];
  receivablesAging: AgingBucket[];
}

export interface ExecutiveSummaryRawData {
  companyName: string;
  current: PeriodData;
  prior?: PeriodData;
}

// =============================================================================
// Helper Functions
// =============================================================================

export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function getPriorYearDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().split('T')[0];
}

// =============================================================================
// Example/Demo Data
// =============================================================================

/**
 * Create sample data matching the provided executive summary
 * This demonstrates the expected data structure
 */
export function createSampleExecutiveSummaryData(): ExecutiveSummaryRawData {
  return {
    companyName: 'Acme Widgets Ltd',
    current: {
      // Income & Profitability
      sales: 533379,
      costOfSales: 149486,
      grossMargin: 383893,
      otherIncome: 822,
      expenses: 279650,
      netProfit: 105066,

      // Invoice Statistics
      invoiceCount: 237,
      invoiceTotalValue: 126449,
      invoiceAverageValue: 534,

      // Cash
      openingCash: 16184,
      cashReceived: 572381,
      cashSpent: 580342,
      cashSurplusDeficit: -7962,
      cashAdjustments: 0,
      closingCash: 8222,

      // Balance Sheet
      currentAssets: 63425,
      currentLiabilities: 19962,
      currentRatio: 3.18,
      quickRatio: 3.05,
      cashRatio: 0.41,

      // Inventory
      openingStock: 1512,
      purchases: 47938,
      closingStock: 2522,
      inventoryCostOfSales: 46928,
      inventoryTurnover: 23.27,
      inventoryPeriod: 16,

      // Payables/Receivables
      payables: 13250,
      receivables: 52682,
      creditSales: 126449,
      receivablesTurnover: 3.98,
      averageCollectionDays: 91.70,

      payablesAging: [
        { label: 'Current', daysFrom: 0, daysTo: 0, amount: 0, percentage: 0 },
        { label: '30 Days', daysFrom: 1, daysTo: 30, amount: 824, percentage: 6 },
        { label: '60 Days', daysFrom: 31, daysTo: 60, amount: 6111, percentage: 46 },
        { label: '90+ Days', daysFrom: 61, daysTo: null, amount: 6315, percentage: 48 },
      ],

      receivablesAging: [
        { label: 'Current', daysFrom: 0, daysTo: 0, amount: 0, percentage: 0 },
        { label: '30 Days', daysFrom: 1, daysTo: 30, amount: 14561, percentage: 27 },
        { label: '60 Days', daysFrom: 31, daysTo: 60, amount: 12570, percentage: 24 },
        { label: '90+ Days', daysFrom: 61, daysTo: null, amount: 26128, percentage: 49 },
      ],
    },

    prior: {
      // Income & Profitability
      sales: 50971,
      costOfSales: 29433,
      grossMargin: 21538,
      otherIncome: 0,
      expenses: 7878,
      netProfit: 13659,

      // Invoice Statistics
      invoiceCount: 0,
      invoiceTotalValue: 0,
      invoiceAverageValue: 0,

      // Cash
      openingCash: 0,
      cashReceived: 0,
      cashSpent: 0,
      cashSurplusDeficit: 0,
      cashAdjustments: 16184,
      closingCash: 16184,

      // Balance Sheet
      currentAssets: 34144,
      currentLiabilities: 15485,
      currentRatio: 2.20,
      quickRatio: 2.11,
      cashRatio: 1.05,

      // Inventory
      openingStock: 0,
      purchases: 0,
      closingStock: 1512,
      inventoryCostOfSales: -1512,
      inventoryTurnover: -2.00,
      inventoryPeriod: -182.50,

      // Payables/Receivables
      payables: 7839,
      receivables: 10854,
      creditSales: 10854,
      receivablesTurnover: 2.00,
      averageCollectionDays: 182.50,

      payablesAging: [
        { label: 'Current', daysFrom: 0, daysTo: 0, amount: 0, percentage: 0 },
        { label: '30 Days', daysFrom: 1, daysTo: 30, amount: 0, percentage: 0 },
        { label: '60 Days', daysFrom: 31, daysTo: 60, amount: 0, percentage: 0 },
        { label: '90+ Days', daysFrom: 61, daysTo: null, amount: 7839, percentage: 100 },
      ],

      receivablesAging: [
        { label: 'Current', daysFrom: 0, daysTo: 0, amount: 0, percentage: 0 },
        { label: '30 Days', daysFrom: 1, daysTo: 30, amount: 0, percentage: 0 },
        { label: '60 Days', daysFrom: 31, daysTo: 60, amount: 0, percentage: 0 },
        { label: '90+ Days', daysFrom: 61, daysTo: null, amount: 10854, percentage: 100 },
      ],
    },
  };
}
