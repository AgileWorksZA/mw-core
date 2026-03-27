/**
 * MoneyWorks Report Types
 *
 * UI-agnostic report data structures that can be transformed
 * into any presentation format (React components, PDF, chat artifacts, etc.)
 */

// =============================================================================
// Core Report Primitives
// =============================================================================

/**
 * Trend indicator for YoY or period-over-period comparison
 */
export type TrendDirection = 'up' | 'down' | 'flat' | 'na';

/**
 * A monetary value with optional comparison data
 */
export interface ReportValue {
  /** The primary value */
  value: number;
  /** Formatted string representation (for display) */
  formatted?: string;
  /** Percentage of a base (e.g., % of sales) */
  percentage?: number;
  /** Comparison period value */
  priorValue?: number;
  /** Comparison period percentage */
  priorPercentage?: number;
  /** Trend direction vs prior period */
  trend?: TrendDirection;
}

/**
 * A ratio or calculated metric
 */
export interface ReportMetric {
  value: number;
  formatted?: string;
  priorValue?: number;
  trend?: TrendDirection;
  /** Unit for display (e.g., "days", "times", "%") */
  unit?: string;
}

/**
 * An aging bucket for receivables/payables
 */
export interface AgingBucket {
  /** Bucket label (e.g., "Current", "30 Days", "60 Days", "90+ Days") */
  label: string;
  /** Days range start */
  daysFrom: number;
  /** Days range end (null for open-ended like 90+) */
  daysTo: number | null;
  /** Amount in this bucket */
  amount: number;
  /** Percentage of total */
  percentage: number;
}

// =============================================================================
// Report Period Definition
// =============================================================================

export interface ReportPeriod {
  /** Start date (YYYY-MM-DD) */
  startDate: string;
  /** End date (YYYY-MM-DD) */
  endDate: string;
  /** Period description (e.g., "12 Months to January 31, 2025") */
  description: string;
  /** MoneyWorks period number (Year * 100 + Period) */
  mwPeriod?: number;
}

// =============================================================================
// Report Metadata
// =============================================================================

export interface ReportMetadata {
  /** Report type identifier */
  reportType: string;
  /** Report title */
  title: string;
  /** Company/entity name */
  companyName: string;
  /** Current reporting period */
  currentPeriod: ReportPeriod;
  /** Comparison period (if applicable) */
  priorPeriod?: ReportPeriod;
  /** When the report was generated */
  generatedAt: string;
  /** Currency code (e.g., "NZD", "USD") */
  currency: string;
  /** Report version for schema evolution */
  schemaVersion: string;
}

// =============================================================================
// Executive Summary Report Sections
// =============================================================================

/**
 * Income and Profitability Section
 * Shows P&L summary with cost breakdown
 */
export interface IncomeProfitabilitySection {
  sales: ReportValue;
  costOfSales: ReportValue;
  grossMargin: ReportValue;
  otherIncome: ReportValue;
  expenses: ReportValue;
  netProfit: ReportValue;
}

/**
 * Invoice Statistics Section
 */
export interface InvoiceStatisticsSection {
  /** Number of invoices issued in period */
  invoiceCount: ReportMetric;
  /** Total value of invoices */
  totalValue: ReportValue;
  /** Average invoice value */
  averageValue: ReportMetric;
}

/**
 * Cash Flow Section
 */
export interface CashSection {
  openingBalance: ReportValue;
  cashReceived: ReportValue;
  cashSpent: ReportValue;
  surplusDeficit: ReportValue;
  adjustments: ReportValue;
  closingBalance: ReportValue;
}

/**
 * Balance Sheet Summary Section (for Executive Summary report)
 */
export interface BalanceSheetSummarySection {
  currentAssets: ReportValue;
  currentLiabilities: ReportValue;
  /** Liquidity Ratios */
  ratios: {
    /** Current Assets / Current Liabilities */
    currentRatio: ReportMetric;
    /** (Current Assets - Inventory) / Current Liabilities */
    quickRatio: ReportMetric;
    /** Cash / Current Liabilities */
    cashRatio: ReportMetric;
  };
}

/**
 * Inventory Section
 */
export interface InventorySection {
  openingStock: ReportValue;
  purchases: ReportValue;
  closingStock: ReportValue;
  costOfSales: ReportValue;
  /** Efficiency Metrics */
  metrics: {
    /** Cost of Sales / Average Inventory */
    inventoryTurnover: ReportMetric;
    /** 365 / Inventory Turnover (days to sell inventory) */
    inventoryPeriod: ReportMetric;
  };
}

/**
 * Payables and Receivables Section
 */
export interface PayablesReceivablesSection {
  payables: {
    total: ReportValue;
    aging: AgingBucket[];
  };
  receivables: {
    total: ReportValue;
    aging: AgingBucket[];
    /** Credit sales for the period */
    creditSales: ReportValue;
    /** Receivables Turnover = Credit Sales / Avg Receivables */
    turnover: ReportMetric;
    /** Average Collection Days = 365 / Turnover */
    averageCollectionDays: ReportMetric;
  };
}

// =============================================================================
// Complete Executive Summary Report
// =============================================================================

export interface ExecutiveSummaryReport {
  /** Report metadata */
  metadata: ReportMetadata;

  /** Income and Profitability */
  incomeProfitability: IncomeProfitabilitySection;

  /** Invoice Statistics */
  invoiceStatistics: InvoiceStatisticsSection;

  /** Cash Flow */
  cash: CashSection;

  /** Balance Sheet Summary */
  balanceSheet: BalanceSheetSummarySection;

  /** Inventory */
  inventory: InventorySection;

  /** Payables and Receivables */
  payablesReceivables: PayablesReceivablesSection;
}

// =============================================================================
// Report Generation Options
// =============================================================================

export interface ExecutiveSummaryOptions {
  /** End date for the report (YYYY-MM-DD) */
  asOfDate: string;
  /** Number of months to include (default: 12) */
  months?: number;
  /** Include comparison period (default: true) */
  includeComparison?: boolean;
  /** Currency for formatting */
  currency?: string;
}

// =============================================================================
// Balance Sheet Report
// =============================================================================

/**
 * A line item in the balance sheet (account with balances)
 */
export interface BalanceSheetLineItem {
  /** Account code (e.g., "1000-") */
  accountCode?: string;
  /** Account name (e.g., "Main Bank Account") */
  accountName: string;
  /** Current period balance */
  thisYear: ReportValue;
  /** Prior period balance (last year end) */
  lastYearEnd?: ReportValue;
  /** Movement during period (if Print Movements enabled) */
  movement?: {
    debit: ReportValue;
    credit: ReportValue;
  };
  /** Department breakdown (if Show Departments enabled) */
  departments?: Record<string, ReportValue>;
  /** Indent level for display (0 = top level, 1 = sub-item) */
  indentLevel: number;
  /** Is this a subtotal row? */
  isSubtotal?: boolean;
  /** Is this a total row? */
  isTotal?: boolean;
}

/**
 * A section in the balance sheet (e.g., CURRENT ASSETS, FIXED ASSETS)
 */
export interface BalanceSheetSection {
  /** Section title (e.g., "CURRENT ASSETS") */
  title: string;
  /** Line items in this section */
  items: BalanceSheetLineItem[];
  /** Section subtotal */
  subtotal: BalanceSheetLineItem;
}

/**
 * Complete Balance Sheet Report
 */
export interface BalanceSheetReport {
  /** Report metadata */
  metadata: ReportMetadata;

  /** Report options used to generate */
  options: BalanceSheetOptions;

  /** Assets sections */
  assets: {
    currentAssets: BalanceSheetSection;
    fixedAssets: BalanceSheetSection;
    /** Other asset sections if present */
    other?: BalanceSheetSection[];
    /** Total Assets line */
    total: BalanceSheetLineItem;
  };

  /** Liabilities sections */
  liabilities: {
    currentLiabilities: BalanceSheetSection;
    /** Long-term liabilities if present */
    longTermLiabilities?: BalanceSheetSection;
    /** Other liability sections if present */
    other?: BalanceSheetSection[];
  };

  /** Equity section */
  equity: {
    section: BalanceSheetSection;
    /** Current year surplus/deficit */
    currentYearSurplus: BalanceSheetLineItem;
    /** Total Capital Funds */
    totalCapitalFunds: BalanceSheetLineItem;
  };

  /** Final balancing line (should equal Total Assets) */
  liabilitiesAndEquity: BalanceSheetLineItem;

  /** Validation: Assets should equal Liabilities + Equity */
  isBalanced: boolean;
}

/**
 * Balance Sheet generation options
 */
export interface BalanceSheetOptions {
  /** Report end date (YYYY-MM-DD) */
  asOfDate: string;
  /** MoneyWorks period (e.g., "Jan:2024/25") */
  period?: string;
  /** Omit accounts with zero balance */
  omitZeroBalance: boolean;
  /** Include unposted transactions */
  includeUnposted: boolean;
  /** Show movement columns (debit/credit) */
  printMovements: boolean;
  /** Break down by department */
  showDepartments: boolean;
  /** Cash basis accounting (vs accrual) */
  cashBasis: boolean;
  /** Show account codes in output */
  showAccountCodes: boolean;
  /** Sort order */
  sort: 'accountCode' | 'accountName';
  /** Currency for formatting */
  currency?: string;
}
