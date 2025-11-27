/**
 * Daily Transaction Summary Component
 *
 * Displays a summary of transactions by type for a date range,
 * showing Gross, GST, Nett, and Count columns with totals.
 */

import { cn } from "~/lib/utils";
import {
  type DailyTransactionSummaryData,
  formatCurrency,
  formatNumber,
} from "~/lib/artifacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";

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

export function DailyTransactionSummary({ data, className }: DailyTransactionSummaryProps) {
  const currency = data.currency || "NZD";
  const sameDay = data.fromDate === data.toDate;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Daily Transaction Summary</CardTitle>
            {data.companyName && (
              <p className="text-sm text-muted-foreground mt-1">
                {data.companyName}
              </p>
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
                <>From: {formatDisplayDate(data.fromDate)} To: {formatDisplayDate(data.toDate)}</>
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

      <CardContent className="space-y-4">
        {/* Summary Table */}
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

        {/* Transaction Type Legend */}
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
      </CardContent>
    </Card>
  );
}
