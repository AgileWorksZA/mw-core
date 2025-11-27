/**
 * Bar Chart Component
 *
 * Renders comparative data as a bar chart using Recharts.
 * Features: axis labels, tooltips, optional stacking, legend.
 */

"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "~/lib/utils";
import type { BarChartData } from "~/lib/artifacts/types";
import { DEFAULT_CHART_COLORS, formatNumber } from "~/lib/artifacts/types";

interface BarChartProps {
  data: BarChartData;
  className?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{formatNumber(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function BarChart({ data, className, height = 300 }: BarChartProps) {
  const {
    data: chartData,
    xKey,
    yKeys,
    colors = DEFAULT_CHART_COLORS,
    stacked = false,
    showLegend = true,
    showTooltip = true,
    xAxisLabel,
    yAxisLabel,
  } = data;

  if (!chartData || chartData.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-[300px] text-muted-foreground", className)}>
        No data available
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: xAxisLabel ? 40 : 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ className: "stroke-muted" }}
            label={xAxisLabel ? {
              value: xAxisLabel,
              position: "bottom",
              offset: 10,
              style: { fontSize: 12, fill: "hsl(var(--muted-foreground))" },
            } : undefined}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ className: "stroke-muted" }}
            tickFormatter={(value) => formatNumber(value)}
            label={yAxisLabel ? {
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "hsl(var(--muted-foreground))" },
            } : undefined}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && yKeys.length > 1 && (
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
            />
          )}
          {yKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              stackId={stacked ? "stack" : undefined}
              radius={stacked ? undefined : [4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
