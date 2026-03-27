/**
 * Artifact Renderer Component
 *
 * Dispatches artifact rendering to the appropriate component
 * based on the artifact type.
 *
 * ## Naming Convention
 * Artifact types use **kebab-case** as the canonical format (e.g., "department-pnl").
 * The mw_report tool parameters use **snake_case** (e.g., "department_pnl").
 * This renderer normalizes both formats to ensure compatibility.
 *
 * Examples:
 * - "department-pnl" (canonical) -> renders DepartmentPnL
 * - "department_pnl" (tool format) -> normalized to "department-pnl"
 * - "balance-sheet" (canonical) -> renders BalanceSheet
 */

import { cn } from "~/lib/utils";
import type { Artifact } from "~/lib/artifacts/types";
import {
  type DepartmentPnLData,
  type StocktakeReportData,
  type AgedPayablesData,
  isMetricData,
  isTableData,
  isPieChartData,
  isBarChartData,
  isLineChartData,
  isBalanceSheetData,
  isTrialBalanceData,
  isExecutiveSummaryData,
  isBankReconciliationStatusData,
  isDailyTransactionSummaryData,
  isLedgerReportData,
  isDepartmentPnLData,
} from "~/lib/artifacts/types";
import { MetricCard } from "./metric-card";
import { DataTable } from "./data-table";
import { PieChart } from "./pie-chart";
import { BarChart } from "./bar-chart";
import { LineChart } from "./line-chart";
import { BalanceSheet } from "./balance-sheet";
import { TrialBalance } from "./trial-balance";
import { ExecutiveSummary } from "./executive-summary";
import { BankReconciliationStatus } from "./bank-reconciliation-status";
import { DailyTransactionSummary } from "./daily-transaction-summary";
import { LedgerReport } from "./ledger-report";
import { DepartmentPnL } from "./department-pnl";
import { StocktakeReport } from "./stocktake-report";
import { AgedPayablesReport } from "./aged-payables-report";

interface ArtifactRendererProps {
  artifact: Artifact;
  className?: string;
}

/**
 * Normalize artifact type to canonical kebab-case format.
 * Converts underscores to hyphens for consistent matching.
 *
 * @example
 * normalizeArtifactType("department_pnl") // -> "department-pnl"
 * normalizeArtifactType("balance-sheet")  // -> "balance-sheet"
 */
function normalizeArtifactType(type: string): string {
  return type.replace(/_/g, "-");
}

export function ArtifactRenderer({ artifact, className }: ArtifactRendererProps) {
  const { type: rawType, data } = artifact;

  // Normalize type to kebab-case (canonical format)
  const type = normalizeArtifactType(rawType);

  // Render based on normalized type with type guards for safety
  switch (type) {
    case "metric":
      if (isMetricData(data)) {
        return <MetricCard data={data} className={className} />;
      }
      break;

    case "table":
      if (isTableData(data)) {
        return <DataTable data={data} className={className} />;
      }
      break;

    case "pie-chart":
      if (isPieChartData(data)) {
        return <PieChart data={data} className={className} />;
      }
      break;

    case "bar-chart":
      if (isBarChartData(data)) {
        return <BarChart data={data} className={className} />;
      }
      break;

    case "line-chart":
      if (isLineChartData(data)) {
        return <LineChart data={data} className={className} />;
      }
      break;

    case "balance-sheet":
      if (isBalanceSheetData(data)) {
        return <BalanceSheet data={data} className={className} />;
      }
      break;

    case "trial-balance":
      if (isTrialBalanceData(data)) {
        return <TrialBalance data={data} className={className} />;
      }
      break;

    case "executive-summary":
      if (isExecutiveSummaryData(data)) {
        return <ExecutiveSummary data={data} className={className} />;
      }
      break;

    case "bank-reconciliation-status":
      if (isBankReconciliationStatusData(data)) {
        return <BankReconciliationStatus data={data} className={className} />;
      }
      break;

    case "daily-transaction-summary":
      if (isDailyTransactionSummaryData(data)) {
        return <DailyTransactionSummary data={data} className={className} />;
      }
      break;

    case "ledger-report":
      if (isLedgerReportData(data)) {
        return <LedgerReport data={data} className={className} />;
      }
      break;

    case "department-pnl":
      // Department P&L component has defensive coding for missing fields,
      // so we render it directly without strict type guard validation.
      // This accommodates varying AI-generated data structures.
      return <DepartmentPnL data={data as DepartmentPnLData} className={className} />;

    case "stocktake-report":
      // Stocktake Report component has defensive coding for missing fields,
      // so we render it directly without strict type guard validation.
      // This accommodates varying AI-generated data structures.
      return <StocktakeReport data={data as StocktakeReportData} className={className} />;

    case "aged-payables":
      // Aged Payables Report component has defensive coding for missing fields,
      // so we render it directly without strict type guard validation.
      // This accommodates varying AI-generated data structures.
      return <AgedPayablesReport data={data as AgedPayablesData} className={className} />;
  }

  // Fallback for unknown types or type mismatches
  return (
    <div className={cn("p-4 text-sm text-muted-foreground border rounded-lg", className)}>
      <p>Unable to render artifact of type: {rawType}{rawType !== type ? ` (normalized: ${type})` : ""}</p>
      <pre className="mt-2 text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
