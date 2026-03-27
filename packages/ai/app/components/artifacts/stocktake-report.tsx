/**
 * Stocktake Report Component
 *
 * Displays inventory/stock status with visual indicators:
 * - Yellow background for zero stock (out of stock)
 * - Red background for negative stock (oversold/inventory error)
 *
 * Features:
 * - Table with Code, Description, Stock On Hand columns
 * - Summary statistics card
 * - Visual status indicators for problem items
 */

import { cn } from "~/lib/utils";
import type { StocktakeReportData } from "~/lib/artifacts/types";
import { formatNumber } from "~/lib/artifacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface StocktakeReportProps {
  data: StocktakeReportData;
  className?: string;
}

/**
 * Get row styling based on stock level
 */
function getStockRowClass(stockOnHand: number): string {
  if (stockOnHand < 0) {
    // Negative stock - red background
    return "bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-950/60";
  }
  if (stockOnHand === 0) {
    // Zero stock - yellow/amber background
    return "bg-amber-100 dark:bg-amber-950/40 hover:bg-amber-200 dark:hover:bg-amber-950/60";
  }
  // Normal stock
  return "hover:bg-muted/30";
}

/**
 * Get stock status icon
 */
function StockStatusIcon({ stockOnHand }: { stockOnHand: number }) {
  if (stockOnHand < 0) {
    return <AlertCircle className="size-4 text-red-600" />;
  }
  if (stockOnHand === 0) {
    return <AlertTriangle className="size-4 text-amber-600" />;
  }
  return null;
}

export function StocktakeReport({ data, className }: StocktakeReportProps) {
  // Defensive coding: ensure arrays and objects exist
  const items = data.items || [];
  const reportTitle = data.reportTitle || "Stocktake Report";
  const companyName = data.companyName || "";
  const reportDate = data.reportDate || new Date().toISOString().split("T")[0];

  // Calculate summary if not provided
  const summary = data.summary || {
    totalItems: items.length,
    zeroStockCount: items.filter(item => item.stockOnHand === 0).length,
    negativeStockCount: items.filter(item => item.stockOnHand < 0).length,
    totalStock: items.reduce((sum, item) => sum + item.stockOnHand, 0),
  };

  const hasProblems = summary.zeroStockCount > 0 || summary.negativeStockCount > 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">{reportTitle}</CardTitle>
              {companyName && (
                <p className="text-sm text-muted-foreground mt-1">
                  {companyName}
                </p>
              )}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            As of {reportDate}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{summary.totalItems}</div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </div>
          <div className={cn(
            "rounded-lg p-3 text-center",
            summary.zeroStockCount > 0
              ? "bg-amber-100 dark:bg-amber-950/40"
              : "bg-muted/30"
          )}>
            <div className={cn(
              "text-2xl font-bold",
              summary.zeroStockCount > 0 && "text-amber-700 dark:text-amber-400"
            )}>
              {summary.zeroStockCount}
            </div>
            <div className="text-xs text-muted-foreground">Out of Stock</div>
          </div>
          <div className={cn(
            "rounded-lg p-3 text-center",
            summary.negativeStockCount > 0
              ? "bg-red-100 dark:bg-red-950/40"
              : "bg-muted/30"
          )}>
            <div className={cn(
              "text-2xl font-bold",
              summary.negativeStockCount > 0 && "text-red-700 dark:text-red-400"
            )}>
              {summary.negativeStockCount}
            </div>
            <div className="text-xs text-muted-foreground">Negative Stock</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{formatNumber(summary.totalStock)}</div>
            <div className="text-xs text-muted-foreground">Total Stock</div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className={cn(
          "mb-4 flex items-center justify-center gap-2 py-2 px-4 rounded text-sm",
          hasProblems
            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
        )}>
          {hasProblems ? (
            <>
              <AlertTriangle className="size-4" />
              <span>
                {summary.zeroStockCount + summary.negativeStockCount} item
                {(summary.zeroStockCount + summary.negativeStockCount) !== 1 ? "s" : ""} require attention
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" />
              <span>All items have positive stock levels</span>
            </>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 font-semibold w-8"></th>
                <th className="text-left py-2 px-3 font-semibold w-32">Code</th>
                <th className="text-left py-2 px-3 font-semibold">Description</th>
                <th className="text-right py-2 px-3 font-semibold w-32">Stock On Hand</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No items to display
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.code || index}
                    className={cn(
                      "transition-colors",
                      getStockRowClass(item.stockOnHand)
                    )}
                  >
                    <td className="py-2 px-3">
                      <StockStatusIcon stockOnHand={item.stockOnHand} />
                    </td>
                    <td className="py-2 px-3 font-mono text-xs">
                      {item.code}
                    </td>
                    <td className="py-2 px-3">
                      {item.description}
                    </td>
                    <td className={cn(
                      "py-2 px-3 text-right tabular-nums font-mono",
                      item.stockOnHand < 0 && "text-red-700 dark:text-red-400 font-semibold",
                      item.stockOnHand === 0 && "text-amber-700 dark:text-amber-400 font-semibold"
                    )}>
                      {formatNumber(item.stockOnHand)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t mt-4 text-xs text-muted-foreground flex justify-between">
          <span>
            Generated: {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : new Date().toLocaleString()}
          </span>
          <span>{items.length} item{items.length !== 1 ? "s" : ""}</span>
        </div>
      </CardContent>
    </Card>
  );
}
