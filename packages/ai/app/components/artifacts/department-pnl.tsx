/**
 * Department Profit & Loss Report Component
 *
 * Multi-period P&L report with collapsible sections showing:
 * - Sales (Income accounts)
 * - Cost of Sales
 * - Gross Margin (calculated)
 * - Other Income
 * - Net Income (calculated)
 * - Expenses
 * - Profit/Loss (calculated)
 *
 * Features:
 * - Expandable/collapsible sections
 * - Multi-period columns
 * - YoY percent change with color coding
 * - Calculated rows highlighted
 */

import { useState } from "react";
import { cn } from "~/lib/utils";
import {
  type DepartmentPnLData,
  type PnLSection,
  type PnLLineItem,
  formatCurrency,
} from "~/lib/artifacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  Building2,
} from "lucide-react";

interface DepartmentPnLProps {
  data: DepartmentPnLData;
  className?: string;
}

/**
 * Format percent change with sign and color
 */
function formatPercentChange(value: number | undefined): {
  text: string;
  colorClass: string;
  icon: React.ReactNode;
} | null {
  if (value === undefined || isNaN(value)) return null;

  const isPositive = value >= 0;
  const text = `${isPositive ? "+" : ""}${value.toFixed(1)}%`;
  const colorClass = isPositive ? "text-emerald-600" : "text-red-600";
  const icon = isPositive ? (
    <TrendingUp className="size-3" />
  ) : (
    <TrendingDown className="size-3" />
  );

  return { text, colorClass, icon };
}

/**
 * Single line item row
 */
function LineItemRow({
  item,
  periods,
  currency,
  isOdd,
}: {
  item: PnLLineItem;
  periods: string[];
  currency: string;
  isOdd: boolean;
}) {
  const percentInfo = formatPercentChange(item.percentChange);

  return (
    <tr
      className={cn(
        "border-b border-border/30 hover:bg-muted/30 transition-colors",
        isOdd && "bg-muted/10",
        item.isTotal && "font-semibold bg-muted/40",
        item.isCalculated && "font-semibold bg-blue-50/50 dark:bg-blue-950/20"
      )}
    >
      {/* Account Code */}
      <td className="py-2 px-3 font-mono text-xs text-muted-foreground w-20">
        {item.code || ""}
      </td>

      {/* Account Name */}
      <td
        className={cn(
          "py-2 px-3",
          item.isTotal && "font-semibold",
          item.isCalculated && "font-semibold italic"
        )}
      >
        {item.name}
      </td>

      {/* Period Values */}
      {item.values.map((value, idx) => (
        <td
          key={idx}
          className={cn(
            "py-2 px-3 text-right font-mono",
            value < 0 && "text-red-600"
          )}
        >
          {formatCurrency(value, currency)}
        </td>
      ))}

      {/* Percent Change */}
      <td className="py-2 px-3 text-right w-24">
        {percentInfo && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              percentInfo.colorClass
            )}
          >
            {percentInfo.icon}
            {percentInfo.text}
          </span>
        )}
      </td>
    </tr>
  );
}

/**
 * Collapsible P&L Section
 */
function PnLSectionComponent({
  section,
  periods,
  currency,
  defaultExpanded = true,
}: {
  section: PnLSection;
  periods: string[];
  currency: string;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-2">
      {/* Section Header - Clickable */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/50 hover:bg-muted/70 transition-colors text-left rounded-t border border-b-0"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
          <span className="font-semibold text-sm">{section.name}</span>
          <span className="text-xs text-muted-foreground">
            ({section.items.length} account{section.items.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Show section totals in header when collapsed */}
          {!isExpanded && (
            <div className="flex gap-4 text-xs">
              {section.total.values.map((value, idx) => (
                <span
                  key={idx}
                  className={cn("font-mono", value < 0 && "text-red-600")}
                >
                  {formatCurrency(value, currency)}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="border border-t-0 rounded-b overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {section.items.map((item, idx) => (
                <LineItemRow
                  key={item.code || idx}
                  item={item}
                  periods={periods}
                  currency={currency}
                  isOdd={idx % 2 === 1}
                />
              ))}
              {/* Section Total */}
              <LineItemRow
                item={section.total}
                periods={periods}
                currency={currency}
                isOdd={false}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Calculated Row (Gross Margin, Net Income, Profit/Loss)
 * Displayed outside of sections, visually distinct
 */
function CalculatedRow({
  item,
  periods,
  currency,
  variant = "normal",
}: {
  item: PnLLineItem;
  periods: string[];
  currency: string;
  variant?: "normal" | "final";
}) {
  const percentInfo = formatPercentChange(item.percentChange);

  return (
    <div
      className={cn(
        "border rounded mb-2",
        variant === "final"
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800"
          : "bg-muted/30"
      )}
    >
      <table className="w-full text-sm">
        <tbody>
          <tr>
            {/* Empty code column */}
            <td className="py-3 px-3 w-20"></td>

            {/* Name */}
            <td
              className={cn(
                "py-3 px-3 font-semibold",
                variant === "final" && "text-base"
              )}
            >
              {item.name}
            </td>

            {/* Values */}
            {item.values.map((value, idx) => (
              <td
                key={idx}
                className={cn(
                  "py-3 px-3 text-right font-mono font-semibold",
                  value < 0 && "text-red-600",
                  variant === "final" && "text-base"
                )}
              >
                {formatCurrency(value, currency)}
              </td>
            ))}

            {/* Percent Change */}
            <td className="py-3 px-3 text-right w-24">
              {percentInfo && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    percentInfo.colorClass
                  )}
                >
                  {percentInfo.icon}
                  {percentInfo.text}
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function DepartmentPnL({ data, className }: DepartmentPnLProps) {
  const currency = data.currency || "NZD";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">{data.reportTitle}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {data.companyName}
              </p>
            </div>
          </div>
          {data.department && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              <Building2 className="size-4" />
              <span>Dept: {data.department}</span>
            </div>
          )}
        </div>

        {/* Period Headers */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 text-left font-medium w-20">Code</th>
                <th className="py-2 px-3 text-left font-medium">Account</th>
                {data.periods.map((period, idx) => (
                  <th key={idx} className="py-2 px-3 text-right font-medium">
                    {period}
                  </th>
                ))}
                <th className="py-2 px-3 text-right font-medium w-24">
                  % Change
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-2">
        {/* Sales Section */}
        <PnLSectionComponent
          section={data.sections.sales}
          periods={data.periods}
          currency={currency}
        />

        {/* Cost of Sales Section */}
        <PnLSectionComponent
          section={data.sections.costOfSales}
          periods={data.periods}
          currency={currency}
        />

        {/* Gross Margin (Calculated) */}
        <CalculatedRow
          item={data.sections.grossMargin}
          periods={data.periods}
          currency={currency}
        />

        {/* Other Income Section */}
        <PnLSectionComponent
          section={data.sections.otherIncome}
          periods={data.periods}
          currency={currency}
          defaultExpanded={data.sections.otherIncome.items.length > 0}
        />

        {/* Net Income (Calculated) */}
        <CalculatedRow
          item={data.sections.netIncome}
          periods={data.periods}
          currency={currency}
        />

        {/* Expenses Section */}
        <PnLSectionComponent
          section={data.sections.expenses}
          periods={data.periods}
          currency={currency}
        />

        {/* Profit/Loss (Final Calculated Row) */}
        <CalculatedRow
          item={data.sections.profitLoss}
          periods={data.periods}
          currency={currency}
          variant="final"
        />

        {/* Report Footer */}
        <div className="pt-4 border-t text-xs text-muted-foreground flex justify-between">
          <span>
            Generated: {new Date(data.generatedAt).toLocaleString()}
          </span>
          <span>Currency: {currency}</span>
        </div>
      </CardContent>
    </Card>
  );
}
