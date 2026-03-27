/**
 * Executive Summary Component
 *
 * Displays a comprehensive financial summary with health status,
 * key metrics, insights, and optional breakdown chart.
 */

import { cn } from "~/lib/utils";
import {
  type ExecutiveSummaryData,
  type HealthStatus,
  formatCurrency,
  formatPercentage,
  formatNumber,
  DEFAULT_CHART_COLORS,
} from "~/lib/artifacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryData;
  className?: string;
}

const healthConfig: Record<
  HealthStatus,
  { label: string; color: string; bgColor: string; icon: typeof CheckCircle }
> = {
  excellent: {
    label: "Excellent",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    icon: CheckCircle,
  },
  good: {
    label: "Good",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: CheckCircle,
  },
  fair: {
    label: "Fair",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    icon: AlertCircle,
  },
  poor: {
    label: "Poor",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    icon: AlertTriangle,
  },
  critical: {
    label: "Critical",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: XCircle,
  },
};

const insightConfig = {
  positive: {
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: TrendingUp,
  },
  negative: {
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: TrendingDown,
  },
  neutral: {
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: Info,
  },
  warning: {
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: AlertTriangle,
  },
};

export function ExecutiveSummary({ data, className }: ExecutiveSummaryProps) {
  const health = healthConfig[data.healthStatus];
  const HealthIcon = health.icon;
  const currency = data.currency || "USD";

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "currency":
        return formatCurrency(value, currency);
      case "percentage":
        return formatPercentage(value);
      default:
        return formatNumber(value);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Executive Summary</CardTitle>
            {data.companyName && (
              <p className="text-sm text-muted-foreground mt-1">
                {data.companyName}
              </p>
            )}
          </div>
          <div className="text-right">
            {/* Health Status Badge */}
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                health.bgColor,
                health.color
              )}
            >
              <HealthIcon className="size-3.5" />
              {health.label}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              As of {data.asOf}
              {data.period && ` | ${data.period}`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Health Score */}
        {data.healthScore !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  data.healthScore >= 80
                    ? "bg-emerald-500"
                    : data.healthScore >= 60
                      ? "bg-green-500"
                      : data.healthScore >= 40
                        ? "bg-yellow-500"
                        : data.healthScore >= 20
                          ? "bg-orange-500"
                          : "bg-red-500"
                )}
                style={{ width: `${data.healthScore}%` }}
              />
            </div>
            <span className="text-sm font-medium w-12 text-right">
              {data.healthScore}%
            </span>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {data.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-muted/50 border border-border"
            >
              <p className="text-xs text-muted-foreground truncate">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">
                  {formatValue(metric.value, metric.format)}
                </span>
                {metric.trend && metric.percentageChange !== undefined && (
                  <span
                    className={cn(
                      "text-xs flex items-center gap-0.5",
                      metric.trend === "up"
                        ? "text-emerald-600"
                        : metric.trend === "down"
                          ? "text-red-600"
                          : "text-gray-500"
                    )}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="size-3" />
                    ) : metric.trend === "down" ? (
                      <TrendingDown className="size-3" />
                    ) : (
                      <Minus className="size-3" />
                    )}
                    {Math.abs(metric.percentageChange).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        {data.insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Insights</h4>
            <div className="space-y-2">
              {data.insights.map((insight, idx) => {
                const config = insightConfig[insight.type];
                const InsightIcon = config.icon;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-2 p-2 rounded-md border text-sm",
                      config.bgColor,
                      config.borderColor
                    )}
                  >
                    <InsightIcon
                      className={cn("size-4 mt-0.5 shrink-0", config.color)}
                    />
                    <span className={config.color}>{insight.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Breakdown Pie Chart */}
        {data.breakdown && data.breakdown.data.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">{data.breakdown.label}</h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={data.breakdown.data.map(item => ({ ...item }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {data.breakdown.data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          DEFAULT_CHART_COLORS[
                            index % DEFAULT_CHART_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, currency)}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
