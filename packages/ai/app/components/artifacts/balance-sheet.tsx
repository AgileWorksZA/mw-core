/**
 * Balance Sheet Component
 *
 * Professional balance sheet display with proper accounting conventions:
 * - Assets (Current / Non-Current)
 * - Liabilities (Current / Non-Current)
 * - Equity
 * - Proper indentation, subtotals, and grand totals
 */

import { cn } from "~/lib/utils";
import type { BalanceSheetData, BalanceSheetSection } from "~/lib/artifacts/types";
import { formatCurrency } from "~/lib/artifacts/types";

interface BalanceSheetProps {
  data: BalanceSheetData;
  className?: string;
}

interface SectionProps {
  section: BalanceSheetSection;
  currency: string;
}

function Section({ section, currency }: SectionProps) {
  return (
    <div className="mb-4">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
        {section.title}
      </h4>
      <div className="space-y-1">
        {section.items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex justify-between items-baseline text-sm",
              item.indent && "pl-4",
              item.isSubtotal && "font-medium border-t pt-1 mt-1",
              item.isTotal && "font-bold border-t-2 border-double pt-1 mt-2"
            )}
          >
            <span className={cn(item.code && "flex items-baseline gap-2")}>
              {item.code && (
                <span className="text-muted-foreground text-xs font-mono">
                  {item.code}
                </span>
              )}
              <span>{item.name}</span>
            </span>
            <span className={cn(
              "tabular-nums",
              item.amount < 0 && "text-red-600"
            )}>
              {formatCurrency(Math.abs(item.amount), currency)}
              {item.amount < 0 && " CR"}
            </span>
          </div>
        ))}
        {section.subtotal !== undefined && (
          <div className="flex justify-between items-baseline text-sm font-medium border-t pt-1 mt-1">
            <span>Total {section.title}</span>
            <span className={cn(
              "tabular-nums",
              section.subtotal < 0 && "text-red-600"
            )}>
              {formatCurrency(Math.abs(section.subtotal), currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function BalanceSheet({ data, className }: BalanceSheetProps) {
  const {
    asOf,
    currency = "USD",
    currentAssets,
    nonCurrentAssets,
    totalAssets,
    currentLiabilities,
    nonCurrentLiabilities,
    totalLiabilities,
    equity,
    totalEquity,
  } = data;

  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

  return (
    <div className={cn("w-full p-4", className)}>
      {/* Header */}
      <div className="mb-6 text-center border-b pb-4">
        <h3 className="text-lg font-bold">Balance Sheet</h3>
        <p className="text-sm text-muted-foreground">As of {asOf}</p>
      </div>

      {/* Assets Section */}
      <div className="mb-6">
        <h3 className="text-base font-bold mb-3 pb-1 border-b">ASSETS</h3>

        {currentAssets && <Section section={currentAssets} currency={currency} />}
        {nonCurrentAssets && <Section section={nonCurrentAssets} currency={currency} />}

        <div className="flex justify-between items-baseline font-bold text-sm border-t-2 border-double pt-2 mt-4">
          <span>TOTAL ASSETS</span>
          <span className="tabular-nums">{formatCurrency(totalAssets, currency)}</span>
        </div>
      </div>

      {/* Liabilities Section */}
      <div className="mb-6">
        <h3 className="text-base font-bold mb-3 pb-1 border-b">LIABILITIES</h3>

        {currentLiabilities && <Section section={currentLiabilities} currency={currency} />}
        {nonCurrentLiabilities && <Section section={nonCurrentLiabilities} currency={currency} />}

        <div className="flex justify-between items-baseline font-bold text-sm border-t-2 border-double pt-2 mt-4">
          <span>TOTAL LIABILITIES</span>
          <span className="tabular-nums">{formatCurrency(totalLiabilities, currency)}</span>
        </div>
      </div>

      {/* Equity Section */}
      <div className="mb-6">
        <h3 className="text-base font-bold mb-3 pb-1 border-b">EQUITY</h3>

        {equity && <Section section={equity} currency={currency} />}

        <div className="flex justify-between items-baseline font-bold text-sm border-t-2 border-double pt-2 mt-4">
          <span>TOTAL EQUITY</span>
          <span className="tabular-nums">{formatCurrency(totalEquity, currency)}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="border-t-4 border-double pt-3 mt-6">
        <div className="flex justify-between items-baseline font-bold">
          <span>TOTAL LIABILITIES & EQUITY</span>
          <span className="tabular-nums">
            {formatCurrency(totalLiabilities + totalEquity, currency)}
          </span>
        </div>

        {/* Balance indicator */}
        <div className={cn(
          "mt-3 text-xs text-center py-1 rounded",
          isBalanced
            ? "bg-emerald-100 text-emerald-800"
            : "bg-red-100 text-red-800"
        )}>
          {isBalanced ? (
            "Assets = Liabilities + Equity (Balanced)"
          ) : (
            `Out of balance by ${formatCurrency(Math.abs(totalAssets - (totalLiabilities + totalEquity)), currency)}`
          )}
        </div>
      </div>
    </div>
  );
}
