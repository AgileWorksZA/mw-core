/**
 * Artifact Renderer Component
 *
 * Dispatches artifact rendering to the appropriate component
 * based on the artifact type.
 */

import { cn } from "~/lib/utils";
import type { Artifact } from "~/lib/artifacts/types";
import {
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

interface ArtifactRendererProps {
  artifact: Artifact;
  className?: string;
}

export function ArtifactRenderer({ artifact, className }: ArtifactRendererProps) {
  const { type, data } = artifact;

  // Render based on type with type guards for safety
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
  }

  // Fallback for unknown types or type mismatches
  return (
    <div className={cn("p-4 text-sm text-muted-foreground border rounded-lg", className)}>
      <p>Unable to render artifact of type: {type}</p>
      <pre className="mt-2 text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
