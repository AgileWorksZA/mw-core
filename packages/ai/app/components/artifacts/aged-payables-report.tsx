/**
 * Aged Payables Report Component
 *
 * Displays supplier payment aging organized by aging buckets:
 * - Current (0-29 days)
 * - 1 month (30-59 days)
 * - 2 months (60-89 days)
 * - 3+ months (90+ days)
 *
 * Features:
 * - Expandable supplier rows to show invoice details
 * - Visual indicators for overdue amounts (red for 3+mo, amber for 2mo)
 * - Summary totals row matching MoneyWorks format
 * - Accounts Payable total verification
 */

import { useState } from "react";
import { cn } from "~/lib/utils";
import type {
  AgedPayablesData,
  AgedPayablesSupplier,
  AgedPayablesInvoice,
} from "~/lib/artifacts/types";
import { formatCurrency } from "~/lib/artifacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface AgedPayablesReportProps {
  data: AgedPayablesData;
  className?: string;
}

/**
 * Safely coerce a value to number
 */
function toNum(value: number | string | undefined | null): number {
  if (value === undefined || value === null) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

/**
 * Get row styling based on aging severity
 * Red for 3+ months overdue, amber for 2 months
 */
function getAgingRowClass(supplier: AgedPayablesSupplier): string {
  if (toNum(supplier.threeMonthsPlus) > 0) {
    return "bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-950/60";
  }
  if (toNum(supplier.twoMonths) > 0) {
    return "bg-amber-100 dark:bg-amber-950/40 hover:bg-amber-200 dark:hover:bg-amber-950/60";
  }
  return "hover:bg-muted/30";
}

/**
 * Aging severity indicator icon
 */
function AgingIndicator({ supplier }: { supplier: AgedPayablesSupplier }) {
  if (toNum(supplier.threeMonthsPlus) > 0) {
    return <AlertCircle className="size-4 text-red-600" />;
  }
  if (toNum(supplier.twoMonths) > 0) {
    return <AlertTriangle className="size-4 text-amber-600" />;
  }
  return null;
}

/**
 * Invoice detail row (shown when supplier is expanded)
 */
function InvoiceRow({
  invoice,
  currency,
  isOdd,
}: {
  invoice: AgedPayablesInvoice;
  currency: string;
  isOdd: boolean;
}) {
  return (
    <tr
      className={cn(
        "border-b border-border/30 text-xs bg-muted/20",
        isOdd && "bg-muted/30"
      )}
    >
      {/* Indent + Account Code */}
      <td className="py-1.5 px-3 pl-10 font-mono text-muted-foreground">
        {invoice.accountCode}
      </td>
      {/* Line Index */}
      <td className="py-1.5 px-3 font-mono text-muted-foreground">
        {invoice.lineIndex}
      </td>
      {/* Reference */}
      <td className="py-1.5 px-3 font-mono">{invoice.reference}</td>
      {/* Date */}
      <td className="py-1.5 px-3">{invoice.date}</td>
      {/* Description */}
      <td className="py-1.5 px-3">{invoice.description}</td>
      {/* 3 Months+ */}
      <td
        className={cn(
          "py-1.5 px-3 text-right font-mono",
          toNum(invoice.threeMonthsPlus) > 0 && "text-red-600 font-semibold"
        )}
      >
        {toNum(invoice.threeMonthsPlus) !== 0
          ? formatCurrency(invoice.threeMonthsPlus, currency)
          : ""}
      </td>
      {/* 2 Months */}
      <td
        className={cn(
          "py-1.5 px-3 text-right font-mono",
          toNum(invoice.twoMonths) > 0 && "text-amber-600"
        )}
      >
        {toNum(invoice.twoMonths) !== 0
          ? formatCurrency(invoice.twoMonths, currency)
          : ""}
      </td>
      {/* 1 Month */}
      <td className="py-1.5 px-3 text-right font-mono">
        {toNum(invoice.oneMonth) !== 0
          ? formatCurrency(invoice.oneMonth, currency)
          : ""}
      </td>
      {/* Current */}
      <td className="py-1.5 px-3 text-right font-mono">
        {toNum(invoice.current) !== 0
          ? formatCurrency(invoice.current, currency)
          : ""}
      </td>
      {/* GST */}
      <td className="py-1.5 px-3 text-right font-mono text-muted-foreground">
        {formatCurrency(invoice.gst, currency)}
      </td>
      {/* Total */}
      <td className="py-1.5 px-3 text-right font-mono font-semibold">
        {formatCurrency(invoice.total, currency)}
      </td>
    </tr>
  );
}

/**
 * Supplier row (clickable to expand invoices)
 */
function SupplierRow({
  supplier,
  currency,
  isExpanded,
  onToggle,
  hasInvoices,
}: {
  supplier: AgedPayablesSupplier;
  currency: string;
  isExpanded: boolean;
  onToggle: () => void;
  hasInvoices: boolean;
}) {
  return (
    <tr
      className={cn(
        "border-b border-border/50 transition-colors cursor-pointer",
        getAgingRowClass(supplier)
      )}
      onClick={hasInvoices ? onToggle : undefined}
    >
      {/* Expand/Indicator */}
      <td className="py-2 px-3 w-8">
        <div className="flex items-center gap-1">
          {hasInvoices ? (
            isExpanded ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground" />
            )
          ) : (
            <AgingIndicator supplier={supplier} />
          )}
        </div>
      </td>
      {/* Code */}
      <td className="py-2 px-3 font-mono text-xs">{supplier.code}</td>
      {/* Phone */}
      <td className="py-2 px-3 text-xs text-muted-foreground">
        {supplier.phone || ""}
      </td>
      {/* Name */}
      <td className="py-2 px-3 font-medium">{supplier.name}</td>
      {/* Empty spacer column for invoice layout alignment */}
      <td className="py-2 px-3"></td>
      {/* 3 Months+ */}
      <td
        className={cn(
          "py-2 px-3 text-right font-mono",
          toNum(supplier.threeMonthsPlus) > 0 && "text-red-600 font-semibold"
        )}
      >
        {toNum(supplier.threeMonthsPlus) !== 0
          ? formatCurrency(supplier.threeMonthsPlus, currency)
          : ""}
      </td>
      {/* 2 Months */}
      <td
        className={cn(
          "py-2 px-3 text-right font-mono",
          toNum(supplier.twoMonths) > 0 && "text-amber-600 font-semibold"
        )}
      >
        {toNum(supplier.twoMonths) !== 0
          ? formatCurrency(supplier.twoMonths, currency)
          : ""}
      </td>
      {/* 1 Month */}
      <td className="py-2 px-3 text-right font-mono">
        {toNum(supplier.oneMonth) !== 0
          ? formatCurrency(supplier.oneMonth, currency)
          : ""}
      </td>
      {/* Current */}
      <td className="py-2 px-3 text-right font-mono">
        {toNum(supplier.current) !== 0
          ? formatCurrency(supplier.current, currency)
          : ""}
      </td>
      {/* GST */}
      <td className="py-2 px-3 text-right font-mono text-muted-foreground">
        {formatCurrency(supplier.gst, currency)}
      </td>
      {/* Total */}
      <td className="py-2 px-3 text-right font-mono font-semibold">
        {formatCurrency(supplier.total, currency)}
      </td>
    </tr>
  );
}

export function AgedPayablesReport({ data, className }: AgedPayablesReportProps) {
  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(
    new Set()
  );

  // Defensive coding: ensure arrays and objects exist
  const suppliers = data.suppliers || [];
  const currency = data.currency || "NZD";
  const companyName = data.companyName || "";
  const asAt = data.asAt || "";
  const reportTitle = data.reportTitle || "Outstanding Balances for Payables";

  // Calculate totals if not provided (with defensive coercion)
  const totals = data.totals || {
    threeMonthsPlus: suppliers.reduce((sum, s) => sum + toNum(s.threeMonthsPlus), 0),
    twoMonths: suppliers.reduce((sum, s) => sum + toNum(s.twoMonths), 0),
    oneMonth: suppliers.reduce((sum, s) => sum + toNum(s.oneMonth), 0),
    current: suppliers.reduce((sum, s) => sum + toNum(s.current), 0),
    gst: suppliers.reduce((sum, s) => sum + toNum(s.gst), 0),
    total: suppliers.reduce((sum, s) => sum + toNum(s.total), 0),
  };

  const toggleSupplier = (code: string) => {
    setExpandedSuppliers((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  // Count suppliers with overdue amounts (with defensive coercion)
  const overdueCount = suppliers.filter(
    (s) => toNum(s.threeMonthsPlus) > 0 || toNum(s.twoMonths) > 0
  ).length;
  const criticalCount = suppliers.filter((s) => toNum(s.threeMonthsPlus) > 0).length;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">{reportTitle}</CardTitle>
              {companyName && (
                <p className="text-sm text-muted-foreground mt-1">
                  {companyName}
                </p>
              )}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">as at {asAt}</div>
        </div>

        {/* Status Summary */}
        {overdueCount > 0 && (
          <div className="mt-3 flex items-center gap-4">
            {criticalCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-red-600 bg-red-100 dark:bg-red-950/40 px-2 py-1 rounded">
                <AlertCircle className="size-4" />
                <span>
                  {criticalCount} supplier{criticalCount !== 1 ? "s" : ""} 90+
                  days overdue
                </span>
              </div>
            )}
            {overdueCount - criticalCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-100 dark:bg-amber-950/40 px-2 py-1 rounded">
                <AlertTriangle className="size-4" />
                <span>
                  {overdueCount - criticalCount} supplier
                  {overdueCount - criticalCount !== 1 ? "s" : ""} 60+ days
                  overdue
                </span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {/* Data Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 font-semibold w-8"></th>
                <th className="text-left py-2 px-3 font-semibold">Code</th>
                <th className="text-left py-2 px-3 font-semibold">Phone</th>
                <th className="text-left py-2 px-3 font-semibold">Name</th>
                <th className="text-left py-2 px-3 font-semibold"></th>
                <th className="text-right py-2 px-3 font-semibold text-red-700 dark:text-red-400">
                  3 months+
                </th>
                <th className="text-right py-2 px-3 font-semibold text-amber-700 dark:text-amber-400">
                  2 months
                </th>
                <th className="text-right py-2 px-3 font-semibold">1 month</th>
                <th className="text-right py-2 px-3 font-semibold">Current</th>
                <th className="text-right py-2 px-3 font-semibold">GST</th>
                <th className="text-right py-2 px-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {suppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No outstanding payables
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => {
                  const hasInvoices =
                    supplier.invoices && supplier.invoices.length > 0;
                  const isExpanded = expandedSuppliers.has(supplier.code);

                  return (
                    <tbody key={supplier.code}>
                      <SupplierRow
                        supplier={supplier}
                        currency={currency}
                        isExpanded={isExpanded}
                        onToggle={() => toggleSupplier(supplier.code)}
                        hasInvoices={!!hasInvoices}
                      />
                      {/* Invoice Details (when expanded) */}
                      {isExpanded &&
                        hasInvoices &&
                        supplier.invoices!.map((invoice, idx) => (
                          <InvoiceRow
                            key={`${supplier.code}-${invoice.lineIndex}`}
                            invoice={invoice}
                            currency={currency}
                            isOdd={idx % 2 === 1}
                          />
                        ))}
                    </tbody>
                  );
                })
              )}
            </tbody>
            {/* Totals Footer */}
            <tfoot>
              <tr className="border-t-2 bg-muted/50 font-semibold">
                <td className="py-3 px-3"></td>
                <td className="py-3 px-3" colSpan={4}>
                  {currency} Total
                </td>
                <td
                  className={cn(
                    "py-3 px-3 text-right font-mono",
                    toNum(totals.threeMonthsPlus) > 0 && "text-red-600"
                  )}
                >
                  {formatCurrency(totals.threeMonthsPlus, currency)}
                </td>
                <td
                  className={cn(
                    "py-3 px-3 text-right font-mono",
                    toNum(totals.twoMonths) > 0 && "text-amber-600"
                  )}
                >
                  {formatCurrency(totals.twoMonths, currency)}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatCurrency(totals.oneMonth, currency)}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatCurrency(totals.current, currency)}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatCurrency(totals.gst, currency)}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatCurrency(totals.total, currency)}
                </td>
              </tr>
              {/* Accounts Payable as at row */}
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <td className="py-3 px-3"></td>
                <td className="py-3 px-3 font-semibold" colSpan={9}>
                  Accounts Payable as at {asAt}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-base">
                  {formatCurrency(
                    data.accountsPayableTotal ?? totals.total,
                    currency
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t mt-4 text-xs text-muted-foreground flex justify-between">
          <span>
            Generated:{" "}
            {data.generatedAt
              ? new Date(data.generatedAt).toLocaleString()
              : new Date().toLocaleString()}
          </span>
          <span>
            {suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""} |
            Currency: {currency}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
