/**
 * Metric Card Component
 *
 * Displays a single KPI/metric value with optional trend indicator
 * and comparison to previous value.
 */

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { MetricData, TrendDirection } from "~/lib/artifacts/types";
import { formatCurrency, formatPercentage, formatNumber } from "~/lib/artifacts/types";

interface MetricCardProps {
  data: MetricData;
  className?: string;
}

function getTrendIcon(trend: TrendDirection) {
  switch (trend) {
    case "up":
      return <TrendingUp className="size-4" />;
    case "down":
      return <TrendingDown className="size-4" />;
    case "neutral":
    default:
      return <Minus className="size-4" />;
  }
}

function getTrendColor(trend: TrendDirection) {
  switch (trend) {
    case "up":
      return "text-emerald-600";
    case "down":
      return "text-red-600";
    case "neutral":
    default:
      return "text-muted-foreground";
  }
}

function formatValue(value: number, format?: string, currency = "USD"): string {
  switch (format) {
    case "currency":
      return formatCurrency(value, currency);
    case "percentage":
      return formatPercentage(value);
    default:
      return formatNumber(value);
  }
}

export function MetricCard({ data, className }: MetricCardProps) {
  const {
    label,
    value,
    formattedValue,
    format,
    trend,
    previousValue,
    previousFormatted,
    percentageChange,
    currency = "USD",
  } = data;

  const displayValue = formattedValue ?? formatValue(value, format, currency);
  const displayPrevious = previousFormatted ?? (previousValue !== undefined ? formatValue(previousValue, format, currency) : undefined);

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">
            {displayValue}
          </span>

          {trend && (
            <span className={cn("flex items-center gap-1", getTrendColor(trend))}>
              {getTrendIcon(trend)}
              {percentageChange !== undefined && (
                <span className="text-sm font-medium">
                  {percentageChange > 0 ? "+" : ""}
                  {percentageChange.toFixed(1)}%
                </span>
              )}
            </span>
          )}
        </div>

        {displayPrevious && (
          <p className="mt-1 text-xs text-muted-foreground">
            vs {displayPrevious} previous
          </p>
        )}
      </CardContent>
    </Card>
  );
}
