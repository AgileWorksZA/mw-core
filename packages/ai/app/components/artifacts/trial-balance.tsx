/**
 * Trial Balance Component
 *
 * Professional trial balance display with:
 * - Account Code, Account Name, Debit, Credit columns
 * - Balanced totals row at bottom
 * - Visual indication if unbalanced
 */

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";
import type { TrialBalanceData } from "~/lib/artifacts/types";
import { formatCurrency } from "~/lib/artifacts/types";

interface TrialBalanceProps {
  data: TrialBalanceData;
  className?: string;
}

export function TrialBalance({ data, className }: TrialBalanceProps) {
  const {
    asOf,
    currency = "USD",
    items,
    totalDebit,
    totalCredit,
    isBalanced,
  } = data;

  const difference = Math.abs(totalDebit - totalCredit);

  return (
    <div className={cn("w-full p-4", className)}>
      {/* Header */}
      <div className="mb-4 text-center border-b pb-4">
        <h3 className="text-lg font-bold">Trial Balance</h3>
        <p className="text-sm text-muted-foreground">As of {asOf}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2">
              <th className="text-left py-2 px-2 font-semibold w-24">Code</th>
              <th className="text-left py-2 px-2 font-semibold">Account</th>
              <th className="text-right py-2 px-2 font-semibold w-28">Debit</th>
              <th className="text-right py-2 px-2 font-semibold w-28">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  No accounts to display
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="hover:bg-muted/30">
                  <td className="py-2 px-2 font-mono text-xs text-muted-foreground">
                    {item.accountCode}
                  </td>
                  <td className="py-2 px-2">{item.accountName}</td>
                  <td className="py-2 px-2 text-right tabular-nums">
                    {item.debit > 0 ? formatCurrency(item.debit, currency) : ""}
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums">
                    {item.credit > 0 ? formatCurrency(item.credit, currency) : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            {/* Totals row */}
            <tr className="border-t-2 font-bold">
              <td className="py-3 px-2"></td>
              <td className="py-3 px-2">TOTALS</td>
              <td className={cn(
                "py-3 px-2 text-right tabular-nums",
                !isBalanced && "text-red-600"
              )}>
                {formatCurrency(totalDebit, currency)}
              </td>
              <td className={cn(
                "py-3 px-2 text-right tabular-nums",
                !isBalanced && "text-red-600"
              )}>
                {formatCurrency(totalCredit, currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Balance status */}
      <div className={cn(
        "mt-4 flex items-center justify-center gap-2 py-2 px-4 rounded text-sm",
        isBalanced
          ? "bg-emerald-100 text-emerald-800"
          : "bg-red-100 text-red-800"
      )}>
        {isBalanced ? (
          <>
            <CheckCircle2 className="size-4" />
            <span>Trial balance is balanced</span>
          </>
        ) : (
          <>
            <AlertCircle className="size-4" />
            <span>
              Out of balance by {formatCurrency(difference, currency)}
              {totalDebit > totalCredit ? " (Debit heavy)" : " (Credit heavy)"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
