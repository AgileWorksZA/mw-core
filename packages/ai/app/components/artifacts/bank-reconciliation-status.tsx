/**
 * Bank Reconciliation Status Component
 *
 * Displays the reconciliation status of bank accounts with visual
 * status indicators, last reconciliation info, and discrepancy alerts.
 */

import { cn } from "~/lib/utils";
import {
  type BankReconciliationStatusData,
  type ReconciliationStatus,
  formatCurrency,
} from "~/lib/artifacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface BankReconciliationStatusProps {
  data: BankReconciliationStatusData;
  className?: string;
}

const statusConfig: Record<
  ReconciliationStatus,
  { label: string; color: string; bgColor: string; icon: typeof CheckCircle }
> = {
  reconciled: {
    label: "Reconciled",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    icon: CheckCircle,
  },
  never: {
    label: "Never",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    icon: XCircle,
  },
  partial: {
    label: "Partial",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    icon: AlertTriangle,
  },
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export function BankReconciliationStatus({ data, className }: BankReconciliationStatusProps) {
  const currency = data.currency || "USD";

  // Calculate summary if not provided
  const summary = data.summary || {
    totalAccounts: data.accounts.length,
    reconciledCount: data.accounts.filter(a => a.status === "reconciled").length,
    neverReconciledCount: data.accounts.filter(a => a.status === "never").length,
    hasDiscrepancies: data.accounts.some(a => a.discrepancy && a.discrepancy !== 0),
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Bank Reconciliation Status</CardTitle>
            {data.companyName && (
              <p className="text-sm text-muted-foreground mt-1">
                {data.companyName}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            As of {data.asOf}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-2xl font-semibold">{summary.totalAccounts}</p>
            <p className="text-xs text-muted-foreground">Accounts</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50">
            <p className="text-2xl font-semibold text-emerald-700">{summary.reconciledCount}</p>
            <p className="text-xs text-emerald-600">Reconciled</p>
          </div>
          <div className={cn(
            "p-2 rounded-lg",
            summary.neverReconciledCount > 0 ? "bg-amber-50" : "bg-muted/50"
          )}>
            <p className={cn(
              "text-2xl font-semibold",
              summary.neverReconciledCount > 0 ? "text-amber-700" : "text-muted-foreground"
            )}>
              {summary.neverReconciledCount}
            </p>
            <p className={cn(
              "text-xs",
              summary.neverReconciledCount > 0 ? "text-amber-600" : "text-muted-foreground"
            )}>
              Never Reconciled
            </p>
          </div>
        </div>

        {/* Discrepancy Warning */}
        {summary.hasDiscrepancies && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 border border-red-200 text-sm">
            <AlertTriangle className="size-4 text-red-600 shrink-0" />
            <span className="text-red-700">One or more accounts have discrepancies</span>
          </div>
        )}

        {/* Accounts List */}
        <div className="space-y-2">
          {data.accounts.map((account, idx) => {
            const config = statusConfig[account.status];
            const StatusIcon = config.icon;
            const hasDiscrepancy = account.discrepancy && account.discrepancy !== 0;

            return (
              <div
                key={idx}
                className={cn(
                  "p-3 rounded-lg border",
                  hasDiscrepancy ? "border-red-200 bg-red-50/50" : "border-border bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{account.accountCode}</span>
                      <span className="text-sm truncate">{account.accountName}</span>
                    </div>

                    {/* Status and last reconciled */}
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                          config.bgColor,
                          config.color
                        )}
                      >
                        <StatusIcon className="size-3" />
                        {config.label}
                      </div>

                      {account.status === "reconciled" && account.reconciledAt && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatRelativeTime(account.reconciledAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Balances */}
                  {account.status === "reconciled" && account.closingBalance !== undefined && (
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium">
                        {formatCurrency(account.closingBalance, currency)}
                      </p>
                      {hasDiscrepancy && (
                        <p className="text-xs text-red-600 font-medium">
                          Disc: {formatCurrency(account.discrepancy!, currency)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Statement info for reconciled accounts */}
                {account.status === "reconciled" && account.statementNumber && (
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t text-xs text-muted-foreground">
                    <span>Stmt #{account.statementNumber}</span>
                    {account.statementDate && <span>{account.statementDate}</span>}
                    {account.reconciledBy && <span>by {account.reconciledBy}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
