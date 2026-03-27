/**
 * Pie Chart Component
 *
 * Renders categorical data as a pie chart using Recharts.
 * Features: labels, tooltips, legend, responsive sizing.
 */

"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { cn } from "~/lib/utils";
import type { PieChartData } from "~/lib/artifacts/types";
import { DEFAULT_CHART_COLORS, formatNumber } from "~/lib/artifacts/types";

interface PieChartProps {
  data: PieChartData;
  className?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { name: string; value: number };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="font-medium">{item.payload.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatNumber(item.value)}
      </p>
    </div>
  );
}

function renderLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  // Handle undefined values
  if (
    typeof cx !== 'number' ||
    typeof cy !== 'number' ||
    typeof midAngle !== 'number' ||
    typeof innerRadius !== 'number' ||
    typeof outerRadius !== 'number' ||
    typeof percent !== 'number'
  ) {
    return null;
  }

  if (percent < 0.05) return null; // Don't show labels for tiny slices

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function PieChart({ data, className, height = 300 }: PieChartProps) {
  const {
    data: chartData,
    colors = DEFAULT_CHART_COLORS,
    showLabels = true,
    showLegend = true,
    showTooltip = true,
    innerRadius = 0,
    outerRadius = 80,
  } = data;

  if (!chartData || chartData.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-[300px] text-muted-foreground", className)}>
        No data available
      </div>
    );
  }

  // Convert to format Recharts expects (with index signature)
  const pieData = chartData.map(item => ({ ...item }));

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? renderLabel : undefined}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 20 }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
