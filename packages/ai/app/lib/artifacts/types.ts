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
  | "daily-transaction-summary";

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
 * Data for daily transaction summary artifacts
 * Displays transaction totals by type for a specific date
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
  | DailyTransactionSummaryData;

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
