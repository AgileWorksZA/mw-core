/**
 * Ledger Report Component
 *
 * General ledger report showing all transactions for each account with:
 * - Collapsible account sections
 * - Opening balance row
 * - Transaction table: Index | Type | Date | Reference | Description | GST | TC | Debit | Credit | Balance
 * - Closing balance/totals row
 * - Balance coloring: green for normal balance, red for abnormal balance
 */

import { useState } from "react";
import { cn } from "~/lib/utils";
import {
  type LedgerReportData,
  type LedgerAccount,
  type LedgerEntry,
  formatCurrency,
  formatNumber,
} from "~/lib/artifacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";

interface LedgerReportProps {
  data: LedgerReportData;
  className?: string;
}

/**
 * Format date from YYYY-MM-DD to display format
 */
function formatDisplayDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Determine if a balance is "normal" for the account type
 * Assets (BK, CA, FA, OA) and Expenses (EX, CS, OH) = debit normal
 * Liabilities (CL, LL), Equity (EQ, RE), and Income (IN, SA, OI) = credit normal
 */
function isNormalBalance(accountType: string, balanceType: "DB" | "CR"): boolean {
  const debitNormalTypes = ["BK", "CA", "FA", "OA", "EX", "CS", "OH", "AR"];
  const creditNormalTypes = ["CL", "LL", "EQ", "RE", "IN", "SA", "OI", "AP"];

  if (debitNormalTypes.includes(accountType)) {
    return balanceType === "DB";
  }
  if (creditNormalTypes.includes(accountType)) {
    return balanceType === "CR";
  }
  // Default: debit is normal for unknown types
  return balanceType === "DB";
}

/**
 * Get balance display color based on normal/abnormal status
 */
function getBalanceColor(accountType: string, balanceType: "DB" | "CR"): string {
  return isNormalBalance(accountType, balanceType)
    ? "text-emerald-600"
    : "text-red-600";
}

/**
 * Format balance with DB/CR indicator
 */
function formatBalance(amount: number, balanceType: "DB" | "CR", currency: string): string {
  const formatted = formatCurrency(Math.abs(amount), currency);
  return `${formatted} ${balanceType}`;
}

/**
 * Transaction type code display names
 */
const TRANSACTION_TYPE_NAMES: Record<string, string> = {
  CP: "Creditor Payment",
  CR: "Creditor Receipt",
  CI: "Creditor Invoice",
  CC: "Creditor Credit",
  DR: "Debtor Receipt",
  DI: "Debtor Invoice",
  DC: "Debtor Credit",
  JN: "Journal",
  BK: "Bank Entry",
  DD: "Direct Debit",
  EFT: "EFT",
};

/**
 * Single account section with collapsible header
 */
function AccountSection({
  account,
  currency,
  defaultExpanded = true,
}: {
  account: LedgerAccount;
  currency: string;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      {/* Account Header - Clickable to expand/collapse */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-colors text-left"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
          <span className="font-mono text-sm font-medium">{account.accountCode}</span>
          <span className="font-medium">{account.accountName}</span>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-background rounded">
            {account.entries.length} entries
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Dr: <span className="font-mono">{formatCurrency(account.totalDebit, currency)}</span>
          </span>
          <span className="text-muted-foreground">
            Cr: <span className="font-mono">{formatCurrency(account.totalCredit, currency)}</span>
          </span>
          <span className={cn("font-mono font-medium", getBalanceColor(account.accountType, account.closingBalanceType))}>
            {formatBalance(account.closingBalance, account.closingBalanceType, currency)}
          </span>
        </div>
      </button>

      {/* Account Content - Transaction table */}
      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-center py-2 px-2 font-medium w-12">#</th>
                <th className="text-left py-2 px-2 font-medium w-16">Type</th>
                <th className="text-left py-2 px-2 font-medium w-24">Date</th>
                <th className="text-left py-2 px-2 font-medium w-24">Reference</th>
                <th className="text-left py-2 px-2 font-medium">Description</th>
                <th className="text-right py-2 px-2 font-medium w-20">GST</th>
                <th className="text-center py-2 px-2 font-medium w-12">TC</th>
                <th className="text-right py-2 px-2 font-medium w-24">Debit</th>
                <th className="text-right py-2 px-2 font-medium w-24">Credit</th>
                <th className="text-right py-2 px-2 font-medium w-28">Balance</th>
              </tr>
            </thead>
            <tbody>
              {/* Opening Balance Row */}
              <tr className="border-b border-border/50 bg-blue-50/50 dark:bg-blue-950/20">
                <td className="py-2 px-2 text-center"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2 font-medium text-muted-foreground italic">Opening Balance</td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className={cn("py-2 px-2 text-right font-mono font-medium", getBalanceColor(account.accountType, account.openingBalanceType))}>
                  {formatBalance(account.openingBalance, account.openingBalanceType, currency)}
                </td>
              </tr>

              {/* Transaction Entries */}
              {account.entries.map((entry, idx) => (
                <TransactionRow
                  key={idx}
                  entry={entry}
                  accountType={account.accountType}
                  currency={currency}
                />
              ))}

              {/* Closing Balance / Totals Row */}
              <tr className="border-t-2 font-semibold bg-muted/50">
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2 font-medium">Closing Balance</td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2 text-right font-mono">
                  {formatCurrency(account.totalDebit, currency)}
                </td>
                <td className="py-2 px-2 text-right font-mono">
                  {formatCurrency(account.totalCredit, currency)}
                </td>
                <td className={cn("py-2 px-2 text-right font-mono", getBalanceColor(account.accountType, account.closingBalanceType))}>
                  {formatBalance(account.closingBalance, account.closingBalanceType, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Single transaction row
 */
function TransactionRow({
  entry,
  accountType,
  currency,
}: {
  entry: LedgerEntry;
  accountType: string;
  currency: string;
}) {
  return (
    <tr className="border-b border-border/50 hover:bg-muted/30">
      <td className="py-2 px-2 text-center font-mono text-xs text-muted-foreground">
        {entry.index}
      </td>
      <td className="py-2 px-2">
        <span
          className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded"
          title={TRANSACTION_TYPE_NAMES[entry.type] || entry.type}
        >
          {entry.type}
        </span>
      </td>
      <td className="py-2 px-2 font-mono text-xs">
        {entry.date}
      </td>
      <td className="py-2 px-2 font-mono text-xs">
        {entry.reference}
      </td>
      <td className="py-2 px-2 text-sm max-w-xs truncate" title={entry.description}>
        {entry.description}
      </td>
      <td className="py-2 px-2 text-right font-mono text-xs">
        {entry.gst !== 0 ? formatCurrency(entry.gst, currency) : "-"}
      </td>
      <td className="py-2 px-2 text-center font-mono text-xs text-muted-foreground">
        {entry.taxCode || "-"}
      </td>
      <td className="py-2 px-2 text-right font-mono">
        {entry.debit > 0 ? formatCurrency(entry.debit, currency) : ""}
      </td>
      <td className="py-2 px-2 text-right font-mono">
        {entry.credit > 0 ? formatCurrency(entry.credit, currency) : ""}
      </td>
      <td className={cn("py-2 px-2 text-right font-mono", getBalanceColor(accountType, entry.balanceType))}>
        {formatBalance(entry.balance, entry.balanceType, currency)}
      </td>
    </tr>
  );
}

export function LedgerReport({ data, className }: LedgerReportProps) {
  const currency = data.currency || "NZD";
  const sameDay = data.fromDate === data.toDate;

  // Calculate grand totals
  let grandTotalDebit = 0;
  let grandTotalCredit = 0;
  for (const account of data.accounts) {
    grandTotalDebit += account.totalDebit;
    grandTotalCredit += account.totalCredit;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">{data.reportTitle}</CardTitle>
              {data.companyName && (
                <p className="text-sm text-muted-foreground mt-1">{data.companyName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            <span>
              {sameDay ? (
                formatDisplayDate(data.fromDate)
              ) : (
                <>
                  {formatDisplayDate(data.fromDate)} to {formatDisplayDate(data.toDate)}
                </>
              )}
            </span>
          </div>
          <span className="text-muted-foreground">
            {data.accounts.length} account{data.accounts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-4">
        {/* Account Sections */}
        {data.accounts.length > 0 ? (
          <>
            {data.accounts.map((account, idx) => (
              <AccountSection
                key={`${account.accountCode}-${idx}`}
                account={account}
                currency={currency}
                defaultExpanded={data.accounts.length <= 5}
              />
            ))}

            {/* Grand Totals */}
            <div className="border-t-2 pt-4 mt-4">
              <div className="flex justify-end gap-8 text-sm font-semibold">
                <span className="text-muted-foreground">
                  Total Debits: <span className="font-mono text-foreground">{formatCurrency(grandTotalDebit, currency)}</span>
                </span>
                <span className="text-muted-foreground">
                  Total Credits: <span className="font-mono text-foreground">{formatCurrency(grandTotalCredit, currency)}</span>
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No accounts found for this period.</p>
          </div>
        )}

        {/* Transaction Type Legend */}
        {data.accounts.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Transaction Type Codes:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs text-muted-foreground">
              {Object.entries(TRANSACTION_TYPE_NAMES).map(([code, name]) => (
                <div key={code} className="flex items-center gap-1">
                  <span className="font-mono bg-muted px-1 rounded">{code}</span>
                  <span>= {name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
