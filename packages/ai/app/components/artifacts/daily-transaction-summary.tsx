/**
 * Daily Transaction Summary Component
 *
 * Full daily summary report matching MoneyWorks format:
 * 1. P&L Summary (Sales, Cost of Sales, Gross Margin, Income, Expenses, Surplus/Deficit)
 * 2. Balance Changes (Bank, Receivables, Payables)
 * 3. Transaction Summary by Type (Gross, GST, Nett, Count)
 */

import { cn } from "~/lib/utils";
import {
  type DailyTransactionSummaryData,
  type DailyPLSummary,
  type BalanceChange,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "~/lib/artifacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  CalendarDays,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Banknote,
  Receipt,
  CreditCard,
} from "lucide-react";

interface DailyTransactionSummaryProps {
  data: DailyTransactionSummaryData;
  className?: string;
}

/**
 * Map of transaction type codes to full names
 */
const TRANSACTION_TYPE_NAMES: Record<string, string> = {
  BK: "Bank Entry",
  CP: "Creditor Payment",
  DR: "Debtor Receipt",
  DI: "Debtor Invoice",
  DC: "Debtor Credit",
  CI: "Creditor Invoice",
  CC: "Creditor Credit",
  JN: "Journal Entry",
};

/**
 * Get display name for transaction type
 */
function getTypeName(type: string, providedName?: string): string {
  if (providedName) return providedName;
  return TRANSACTION_TYPE_NAMES[type] || type;
}

/**
 * Format date from YYYY-MM-DD to display format
 */
function formatDisplayDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "long",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format timestamp for display
 */
function formatTimestamp(isoStr: string): string {
  try {
    const date = new Date(isoStr);
    return date.toLocaleString("en-NZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return isoStr;
  }
}

/**
 * P&L Summary Section Component
 */
function PLSummarySection({
  plSummary,
  currency,
}: {
  plSummary: DailyPLSummary;
  currency: string;
}) {
  return (
    <div className="space-y-1">
      {/* Sales */}
      <div className="flex justify-between py-1">
        <span className="font-medium">Sales</span>
        <span></span>
      </div>
      <div className="flex justify-between py-0.5 pl-4 text-sm">
        <span className="text-muted-foreground">Total Sales</span>
        <span className="font-mono">{formatCurrency(plSummary.totalSales, currency)}</span>
      </div>

      {/* Cost of Sales */}
      <div className="flex justify-between py-1 mt-2">
        <span className="font-medium">Less: Cost of Sales</span>
        <span></span>
      </div>
      <div className="flex justify-between py-0.5 pl-4 text-sm">
        <span className="text-muted-foreground">Total Cost of Sales</span>
        <span className="font-mono">{formatCurrency(plSummary.totalCostOfSales, currency)}</span>
      </div>

      {/* Gross Margin */}
      <div className="flex justify-between py-1 mt-2 border-t pt-2">
        <span className="font-medium">
          Gross Margin
          {plSummary.grossMarginPercent !== undefined && (
            <span className="text-muted-foreground text-sm ml-1">
              ({formatPercentage(plSummary.grossMarginPercent)})
            </span>
          )}
        </span>
        <span className="font-mono font-medium">
          {formatCurrency(plSummary.grossMargin, currency)}
        </span>
      </div>

      {/* Other Income */}
      <div className="flex justify-between py-1 mt-2">
        <span className="font-medium">Other Income</span>
        <span></span>
      </div>
      <div className="flex justify-between py-0.5 pl-4 text-sm">
        <span className="text-muted-foreground">Total Other Income</span>
        <span className="font-mono">{formatCurrency(plSummary.totalOtherIncome, currency)}</span>
      </div>

      {/* Net Income */}
      <div className="flex justify-between py-1 mt-2 border-t pt-2">
        <span className="font-medium">Net Income</span>
        <span className="font-mono font-medium">
          {formatCurrency(plSummary.netIncome, currency)}
        </span>
      </div>

      {/* Expenses */}
      <div className="flex justify-between py-1 mt-2">
        <span className="font-medium">Expenses</span>
        <span></span>
      </div>
      <div className="flex justify-between py-0.5 pl-4 text-sm">
        <span className="text-muted-foreground">Total Expenses</span>
        <span className="font-mono">{formatCurrency(plSummary.totalExpenses, currency)}</span>
      </div>

      {/* Surplus/Deficit */}
      <div
        className={cn(
          "flex justify-between py-2 mt-2 border-t-2 font-semibold",
          plSummary.surplusDeficit >= 0 ? "text-emerald-700" : "text-red-600"
        )}
      >
        <span>Surplus (Deficit)</span>
        <span className="font-mono">{formatCurrency(plSummary.surplusDeficit, currency)}</span>
      </div>
    </div>
  );
}

/**
 * Balance Changes Section Component
 */
function BalanceChangesSection({
  balanceChanges,
  currency,
}: {
  balanceChanges: BalanceChange[];
  currency: string;
}) {
  const getIcon = (type: BalanceChange["type"]) => {
    switch (type) {
      case "bank":
        return Banknote;
      case "receivables":
        return Receipt;
      case "payables":
        return CreditCard;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
  };

  const getChangeText = (change: number, type: BalanceChange["type"]) => {
    const direction = change > 0 ? "increased" : change < 0 ? "decreased" : "unchanged";
    return `${type === "bank" ? "Bank balances" : type === "receivables" ? "Receivables" : "Payables"} ${direction} by`;
  };

  return (
    <div className="space-y-2">
      {balanceChanges.map((item, idx) => {
        const Icon = getIcon(item.type);
        const ChangeIcon = getChangeIcon(item.change);
        const changeColor =
          item.change > 0
            ? item.type === "payables"
              ? "text-red-600"
              : "text-emerald-600"
            : item.change < 0
              ? item.type === "payables"
                ? "text-emerald-600"
                : "text-red-600"
              : "text-muted-foreground";

        return (
          <div
            key={idx}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <Icon className="size-4 text-muted-foreground" />
              <div>
                <span className={cn("text-sm", changeColor)}>
                  {getChangeText(item.change, item.type)}{" "}
                  <span className="font-mono font-medium">
                    {formatCurrency(Math.abs(item.change), currency)}
                  </span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-medium">
                {formatCurrency(item.currentBalance, currency)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DailyTransactionSummary({
  data,
  className,
}: DailyTransactionSummaryProps) {
  const currency = data.currency || "NZD";
  const sameDay = data.fromDate === data.toDate;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Daily Summary Report</CardTitle>
            {data.companyName && (
              <p className="text-sm text-muted-foreground mt-1">{data.companyName}</p>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            <span>
              {sameDay ? (
                formatDisplayDate(data.fromDate)
              ) : (
                <>
                  From: {formatDisplayDate(data.fromDate)} To:{" "}
                  {formatDisplayDate(data.toDate)}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Created timestamp */}
        {data.createdAt && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Clock className="size-3" />
            <span>Created: {formatTimestamp(data.createdAt)}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Section 1: P&L Summary */}
        {data.plSummary && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Profit & Loss Summary
            </h3>
            <PLSummarySection plSummary={data.plSummary} currency={currency} />
          </div>
        )}

        {/* Section 2: Balance Changes */}
        {data.balanceChanges && data.balanceChanges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Balance Changes
            </h3>
            <BalanceChangesSection balanceChanges={data.balanceChanges} currency={currency} />
          </div>
        )}

        {/* Section 3: Transaction Summary */}
        {data.summaryByType && data.summaryByType.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Transaction Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Type</th>
                    <th className="text-right py-2 px-2 font-medium">Gross</th>
                    <th className="text-right py-2 px-2 font-medium">GST</th>
                    <th className="text-right py-2 px-2 font-medium">Nett</th>
                    <th className="text-right py-2 px-2 font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.summaryByType.map((row, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        "border-b border-border/50 hover:bg-muted/30",
                        row.gross < 0 && "text-red-600"
                      )}
                    >
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            {row.type}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {getTypeName(row.type, row.typeName)}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-2 px-2 font-mono">
                        {formatCurrency(row.gross, currency)}
                      </td>
                      <td className="text-right py-2 px-2 font-mono">
                        {formatCurrency(row.gst, currency)}
                      </td>
                      <td className="text-right py-2 px-2 font-mono">
                        {formatCurrency(row.nett, currency)}
                      </td>
                      <td className="text-right py-2 px-2 font-mono">
                        {formatNumber(row.count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold bg-muted/50">
                    <td className="py-2 px-2">Totals:</td>
                    <td className="text-right py-2 px-2 font-mono">
                      {formatCurrency(data.totals.gross, currency)}
                    </td>
                    <td className="text-right py-2 px-2 font-mono">
                      {formatCurrency(data.totals.gst, currency)}
                    </td>
                    <td className="text-right py-2 px-2 font-mono">
                      {formatCurrency(data.totals.nett, currency)}
                    </td>
                    <td className="text-right py-2 px-2 font-mono">
                      {formatNumber(data.totals.count)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!data.summaryByType || data.summaryByType.length === 0) &&
          !data.plSummary &&
          (!data.balanceChanges || data.balanceChanges.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found for this date.</p>
            </div>
          )}

        {/* Transaction Type Legend */}
        {data.summaryByType && data.summaryByType.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Transaction Type Codes:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs text-muted-foreground">
              {Object.entries(TRANSACTION_TYPE_NAMES).map(([code, name]) => (
                <div key={code} className="flex items-center gap-1">
                  <span className="font-mono bg-muted px-1 rounded">{code}</span>
                  <span>= {name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
