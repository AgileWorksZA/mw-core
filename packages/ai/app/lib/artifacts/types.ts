/**
 * Artifact Types for MoneyWorks AI Assistant
 *
 * Defines the structure for AI-generated artifacts that can be rendered
 * in the split-panel interface. Covers metrics, tables, charts, and
 * financial reports (balance sheet, trial balance).
 */

/**
 * Supported artifact types
 */
export type ArtifactType =
  | "metric"
  | "table"
  | "pie-chart"
  | "bar-chart"
  | "line-chart"
  | "balance-sheet"
  | "trial-balance"
  | "executive-summary"
  | "bank-reconciliation-status"
  | "daily-transaction-summary"
  | "ledger-report"
  | "department-pnl"
  | "stocktake-report"
  | "aged-payables";

/**
 * Trend direction for metric cards
 */
export type TrendDirection = "up" | "down" | "neutral";

/**
 * Data for a single metric/KPI card
 */
export interface MetricData {
  label: string;
  value: number;
  formattedValue?: string;
  format?: "currency" | "percentage" | "number";
  trend?: TrendDirection;
  previousValue?: number;
  previousFormatted?: string;
  percentageChange?: number;
  currency?: string;
}

/**
 * Column definition for tables
 */
export interface TableColumn {
  key: string;
  label: string;
  type?: "string" | "number" | "currency" | "percentage" | "date";
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
}

/**
 * Data for table artifacts
 */
export interface TableData {
  columns: TableColumn[];
  rows: Record<string, unknown>[];
  pageSize?: number;
  sortable?: boolean;
  currency?: string;
}

/**
 * Data point for pie charts
 */
export interface PieChartDataPoint {
  name: string;
  value: number;
}

/**
 * Data for pie chart artifacts
 */
export interface PieChartData {
  data: PieChartDataPoint[];
  colors?: string[];
  showLabels?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

/**
 * Data point for bar/line charts
 */
export interface ChartDataPoint {
  [key: string]: string | number;
}

/**
 * Data for bar chart artifacts
 */
export interface BarChartData {
  data: ChartDataPoint[];
  xKey: string;
  yKeys: string[];
  colors?: string[];
  stacked?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

/**
 * Data for line chart artifacts
 */
export interface LineChartData {
  data: ChartDataPoint[];
  xKey: string;
  yKeys: string[];
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  curved?: boolean;
}

/**
 * Balance sheet line item
 */
export interface BalanceSheetItem {
  code?: string;
  name: string;
  amount: number;
  indent?: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
}

/**
 * Balance sheet section (Assets, Liabilities, Equity)
 */
export interface BalanceSheetSection {
  title: string;
  items: BalanceSheetItem[];
  subtotal?: number;
}

/**
 * Data for balance sheet artifacts
 */
export interface BalanceSheetData {
  asOf: string;
  currency?: string;
  currentAssets?: BalanceSheetSection;
  nonCurrentAssets?: BalanceSheetSection;
  totalAssets: number;
  currentLiabilities?: BalanceSheetSection;
  nonCurrentLiabilities?: BalanceSheetSection;
  totalLiabilities: number;
  equity?: BalanceSheetSection;
  totalEquity: number;
}

/**
 * Trial balance line item
 */
export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

/**
 * Data for trial balance artifacts
 */
export interface TrialBalanceData {
  asOf: string;
  currency?: string;
  items: TrialBalanceItem[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

/**
 * Health status for executive summary
 */
export type HealthStatus = "excellent" | "good" | "fair" | "poor" | "critical";

/**
 * Key insight for executive summary
 */
export interface ExecutiveInsight {
  type: "positive" | "negative" | "neutral" | "warning";
  text: string;
  metric?: string;
  value?: number;
}

/**
 * Summary metric for executive summary grid
 */
export interface SummaryMetric {
  label: string;
  value: number;
  format: "currency" | "percentage" | "number";
  trend?: TrendDirection;
  percentageChange?: number;
}

/**
 * Data for executive summary artifacts
 */
export interface ExecutiveSummaryData {
  asOf: string;
  currency?: string;
  companyName?: string;
  period?: string;
  healthStatus: HealthStatus;
  healthScore?: number;
  metrics: SummaryMetric[];
  insights: ExecutiveInsight[];
  breakdown?: {
    label: string;
    data: PieChartDataPoint[];
  };
}

/**
 * Reconciliation status for a bank account
 */
export type ReconciliationStatus = "reconciled" | "never" | "partial";

/**
 * Bank account reconciliation details
 */
export interface BankReconciliationAccount {
  accountCode: string;
  accountName: string;
  status: ReconciliationStatus;
  reconciledAt?: string;
  reconciledBy?: string;
  statementNumber?: number;
  statementDate?: string;
  openingBalance?: number;
  closingBalance?: number;
  discrepancy?: number;
}

/**
 * Data for bank reconciliation status artifacts
 */
export interface BankReconciliationStatusData {
  asOf: string;
  currency?: string;
  companyName?: string;
  accounts: BankReconciliationAccount[];
  summary?: {
    totalAccounts: number;
    reconciledCount: number;
    neverReconciledCount: number;
    hasDiscrepancies: boolean;
  };
}

/**
 * Transaction type row for daily transaction summary
 * Maps to MoneyWorks transaction type codes (BK, CP, DR, DI, DC, CI, CC, JN)
 */
export interface TransactionTypeSummary {
  /** MoneyWorks transaction type code */
  type: string;
  /** Full name of transaction type */
  typeName: string;
  /** Gross amount (before GST) */
  gross: number;
  /** GST/Tax amount */
  gst: number;
  /** Net amount (after GST) */
  nett: number;
  /** Number of transactions */
  count: number;
}

/**
 * P&L Summary section for daily summary report
 */
export interface DailyPLSummary {
  /** Total sales revenue */
  totalSales: number;
  /** Total cost of sales */
  totalCostOfSales: number;
  /** Gross margin (Sales - Cost of Sales) */
  grossMargin: number;
  /** Gross margin percentage */
  grossMarginPercent?: number;
  /** Total other income */
  totalOtherIncome: number;
  /** Net income (Gross margin + Other income) */
  netIncome: number;
  /** Total expenses */
  totalExpenses: number;
  /** Surplus/Deficit (Net income - Expenses) */
  surplusDeficit: number;
}

/**
 * Balance change item for daily summary report
 */
export interface BalanceChange {
  /** Type of balance (bank, receivables, payables) */
  type: "bank" | "receivables" | "payables";
  /** Label for display */
  label: string;
  /** Change amount (positive = increased, negative = decreased) */
  change: number;
  /** Current balance as of report date */
  currentBalance: number;
}

/**
 * Data for daily transaction summary artifacts
 * Full daily summary report with P&L, balance changes, and transaction breakdown
 */
export interface DailyTransactionSummaryData {
  /** Date range start in YYYY-MM-DD format */
  fromDate: string;
  /** Date range end in YYYY-MM-DD format */
  toDate: string;
  /** When the report was generated */
  createdAt: string;
  /** Currency code (e.g., "NZD") */
  currency?: string;
  /** Company name */
  companyName?: string;
  /** P&L Summary section */
  plSummary?: DailyPLSummary;
  /** Balance changes section */
  balanceChanges?: BalanceChange[];
  /** Summary rows by transaction type */
  summaryByType: TransactionTypeSummary[];
  /** Totals row */
  totals: {
    gross: number;
    gst: number;
    nett: number;
    count: number;
  };
}

/**
 * Transaction entry in a ledger report
 * Type codes: CP=Creditor Payment, CR=Creditor Credit, DI=Debtor Invoice,
 * CI=Creditor Invoice, JN=Journal, DD=Direct Debit, EFT=Electronic Transfer
 */
export interface LedgerEntry {
  /** Transaction line index */
  index: number;
  /** Transaction type code (CP, CR, DI, CI, JN, DD, EFT, etc.) */
  type: string;
  /** Transaction date in YYYY-MM-DD format */
  date: string;
  /** Transaction reference/document number */
  reference: string;
  /** Transaction description (Name:Memo pattern) */
  description: string;
  /** GST/Tax amount */
  gst: number;
  /** Tax code applied */
  taxCode: string;
  /** Debit amount */
  debit: number;
  /** Credit amount */
  credit: number;
  /** Running balance */
  balance: number;
  /** Balance type indicator: DB=Debit, CR=Credit */
  balanceType: "DB" | "CR";
}

/**
 * Account section in a ledger report
 */
export interface LedgerAccount {
  /** Account code */
  accountCode: string;
  /** Account name/description */
  accountName: string;
  /** Account type code (BK, CA, FA, CL, LL, EQ, IN, EX, etc.) */
  accountType: string;
  /** Opening balance for the period */
  openingBalance: number;
  /** Opening balance type: DB=Debit, CR=Credit */
  openingBalanceType: "DB" | "CR";
  /** Transaction entries for this account */
  entries: LedgerEntry[];
  /** Closing balance for the period */
  closingBalance: number;
  /** Closing balance type: DB=Debit, CR=Credit */
  closingBalanceType: "DB" | "CR";
  /** Total debits for the period */
  totalDebit: number;
  /** Total credits for the period */
  totalCredit: number;
}

/**
 * Data for ledger report artifacts
 * General ledger showing all transactions for each account with running balances
 */
export interface LedgerReportData {
  /** Company name */
  companyName?: string;
  /** Report title */
  reportTitle: string;
  /** Period start date in YYYY-MM-DD format */
  fromDate: string;
  /** Period end date in YYYY-MM-DD format */
  toDate: string;
  /** Currency code */
  currency?: string;
  /** Accounts with their transactions */
  accounts: LedgerAccount[];
}

/**
 * P&L Line Item (individual account or calculated row)
 * Represents a single row in the P&L report - either an account or a calculated total
 */
export interface PnLLineItem {
  /** Account code (e.g., "4000") or empty for totals/calculated rows */
  code: string;
  /** Account name (e.g., "Sales") or section name for totals */
  name: string;
  /** Values for each period (matches periods array length) */
  values: number[];
  /** Year-over-year change percentage (comparing last two periods) */
  percentChange?: number;
  /** True for subtotal/total rows */
  isTotal?: boolean;
  /** True for calculated rows like Gross Margin, Net Income, Profit/Loss */
  isCalculated?: boolean;
}

/**
 * P&L Section (Sales, Cost of Sales, Other Income, Expenses)
 * Groups related accounts with a section total
 */
export interface PnLSection {
  /** Section name (e.g., "SALES", "COST OF SALES", "EXPENSES") */
  name: string;
  /** Individual account line items in this section */
  items: PnLLineItem[];
  /** Section total row */
  total: PnLLineItem;
}

/**
 * Department Profit & Loss Report Data
 * Multi-period P&L with standard sections and calculated rows
 */
export interface DepartmentPnLData {
  /** Company name */
  companyName: string;
  /** Report title (e.g., "Profit & Loss Statement") */
  reportTitle: string;
  /** Period labels (e.g., ["Mar:2022/23", "Mar:2023/24", "Mar:2024/25"]) */
  periods: string[];
  /** Optional department filter applied */
  department?: string;
  /** Currency code (e.g., "NZD") */
  currency?: string;
  /** P&L sections with calculated rows */
  sections: {
    /** Sales/Revenue section (account types IN, SA) */
    sales: PnLSection;
    /** Cost of Sales section (account types CS, CG) */
    costOfSales: PnLSection;
    /** Gross Margin = Sales - Cost of Sales */
    grossMargin: PnLLineItem;
    /** Other Income section (account type OI) */
    otherIncome: PnLSection;
    /** Net Income = Gross Margin + Other Income */
    netIncome: PnLLineItem;
    /** Expenses section (account types EX, OH) */
    expenses: PnLSection;
    /** Profit/Loss = Net Income - Expenses */
    profitLoss: PnLLineItem;
  };
  /** When the report was generated */
  generatedAt: string;
}

/**
 * Stocktake report line item
 * Represents a single product/item in the stocktake
 */
export interface StocktakeReportItem {
  /** Product/item code */
  code: string;
  /** Product/item description */
  description: string;
  /** Current stock on hand quantity */
  stockOnHand: number;
}

/**
 * Data for stocktake report artifacts
 * Displays inventory status with visual indicators for stock levels
 */
export interface StocktakeReportData {
  /** Company name */
  companyName?: string;
  /** Report date in YYYY-MM-DD format */
  reportDate: string;
  /** Optional report title */
  reportTitle?: string;
  /** Currency code (for potential value display) */
  currency?: string;
  /** Stock items to display */
  items: StocktakeReportItem[];
  /** Summary statistics */
  summary?: {
    /** Total number of items in the report */
    totalItems: number;
    /** Count of items with zero stock */
    zeroStockCount: number;
    /** Count of items with negative stock */
    negativeStockCount: number;
    /** Total stock on hand across all items */
    totalStock: number;
  };
  /** When the report was generated */
  generatedAt?: string;
}

// =============================================================================
// Aged Payables Report Types
// =============================================================================

/**
 * Individual invoice line in aged payables report
 * Represents a single creditor invoice with aging breakdown
 */
export interface AgedPayablesInvoice {
  /** Account code (e.g., "2500" for creditors) */
  accountCode: string;
  /** Transaction line index */
  lineIndex: number;
  /** Invoice reference/number */
  reference: string;
  /** Invoice date in YYYY-MM-DD format */
  date: string;
  /** Description (typically supplier name + memo) */
  description: string;
  /** Amount in 90+ days bucket */
  threeMonthsPlus: number;
  /** Amount in 60-89 days bucket */
  twoMonths: number;
  /** Amount in 30-59 days bucket */
  oneMonth: number;
  /** Amount in 0-29 days bucket */
  current: number;
  /** GST/Tax amount */
  gst: number;
  /** Total outstanding amount */
  total: number;
}

/**
 * Supplier summary row in aged payables report
 * Contains aging totals and optional invoice details for drill-down
 */
export interface AgedPayablesSupplier {
  /** Supplier code */
  code: string;
  /** Supplier name */
  name: string;
  /** Phone number (optional) */
  phone?: string;
  /** Amount in 90+ days bucket */
  threeMonthsPlus: number;
  /** Amount in 60-89 days bucket */
  twoMonths: number;
  /** Amount in 30-59 days bucket */
  oneMonth: number;
  /** Amount in 0-29 days bucket */
  current: number;
  /** GST/Tax amount */
  gst: number;
  /** Total outstanding amount */
  total: number;
  /** Optional invoice details for expandable view */
  invoices?: AgedPayablesInvoice[];
}

/**
 * Complete aged payables report data
 * Displays supplier payment aging organized by aging buckets
 */
export interface AgedPayablesData {
  /** Report date reference (e.g., "Jan:2024/25") */
  asAt: string;
  /** Company name */
  companyName?: string;
  /** Report title (optional) */
  reportTitle?: string;
  /** Currency code (e.g., "NZD") */
  currency?: string;
  /** Supplier rows with aging data */
  suppliers: AgedPayablesSupplier[];
  /** Grand totals for each aging bucket */
  totals: {
    /** Total 90+ days */
    threeMonthsPlus: number;
    /** Total 60-89 days */
    twoMonths: number;
    /** Total 30-59 days */
    oneMonth: number;
    /** Total 0-29 days */
    current: number;
    /** Total GST */
    gst: number;
    /** Grand total */
    total: number;
  };
  /** Accounts Payable balance as at date (should match total) */
  accountsPayableTotal?: number;
  /** When the report was generated */
  generatedAt?: string;
}

/**
 * Union type for all artifact data types
 */
export type ArtifactData =
  | MetricData
  | TableData
  | PieChartData
  | BarChartData
  | LineChartData
  | BalanceSheetData
  | TrialBalanceData
  | ExecutiveSummaryData
  | BankReconciliationStatusData
  | DailyTransactionSummaryData
  | LedgerReportData
  | DepartmentPnLData
  | StocktakeReportData
  | AgedPayablesData;

/**
 * Main Artifact interface
 */
export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  data: ArtifactData;
  description?: string;
}

/**
 * Extended AI response that includes artifacts
 */
export interface AIResponseWithArtifacts {
  text: string;
  artifacts?: Artifact[];
}

/**
 * Type guards for artifact data
 */
export function isMetricData(data: ArtifactData): data is MetricData {
  return "label" in data && "value" in data && !("columns" in data);
}

export function isTableData(data: ArtifactData): data is TableData {
  return "columns" in data && "rows" in data;
}

export function isPieChartData(data: ArtifactData): data is PieChartData {
  return "data" in data && Array.isArray((data as PieChartData).data) &&
    (data as PieChartData).data.length > 0 &&
    "name" in (data as PieChartData).data[0] &&
    !("xKey" in data);
}

export function isBarChartData(data: ArtifactData): data is BarChartData {
  return "xKey" in data && "yKeys" in data && "stacked" in data ||
    ("xKey" in data && "yKeys" in data && !("curved" in data));
}

export function isLineChartData(data: ArtifactData): data is LineChartData {
  return "xKey" in data && "yKeys" in data && ("curved" in data || !("stacked" in data));
}

export function isBalanceSheetData(data: ArtifactData): data is BalanceSheetData {
  return "totalAssets" in data && "totalLiabilities" in data && "totalEquity" in data;
}

export function isTrialBalanceData(data: ArtifactData): data is TrialBalanceData {
  return "totalDebit" in data && "totalCredit" in data && "isBalanced" in data;
}

export function isExecutiveSummaryData(data: ArtifactData): data is ExecutiveSummaryData {
  return "healthStatus" in data && "metrics" in data && "insights" in data;
}

export function isBankReconciliationStatusData(data: ArtifactData): data is BankReconciliationStatusData {
  return "accounts" in data && Array.isArray((data as BankReconciliationStatusData).accounts);
}

export function isDailyTransactionSummaryData(data: ArtifactData): data is DailyTransactionSummaryData {
  return "summaryByType" in data && "fromDate" in data && "toDate" in data;
}

export function isLedgerReportData(data: ArtifactData): data is LedgerReportData {
  return "accounts" in data && "reportTitle" in data && "fromDate" in data && "toDate" in data;
}

export function isDepartmentPnLData(data: ArtifactData): data is DepartmentPnLData {
  return "sections" in data && "periods" in data && "reportTitle" in data && "generatedAt" in data;
}

export function isStocktakeReportData(data: ArtifactData): data is StocktakeReportData {
  return "items" in data && "reportDate" in data && Array.isArray((data as StocktakeReportData).items);
}

export function isAgedPayablesData(data: ArtifactData): data is AgedPayablesData {
  return "suppliers" in data && "asAt" in data && Array.isArray((data as AgedPayablesData).suppliers);
}

/**
 * Default chart colors (professional palette)
 */
export const DEFAULT_CHART_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#84cc16", // lime-500
];

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

/**
 * Format a number with locale formatting
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
