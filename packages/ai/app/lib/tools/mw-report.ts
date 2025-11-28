/**
 * MoneyWorks Report Tool
 *
 * Generate standard financial reports using MWScript expressions.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { queryTable, testConnection, getErrorMessage } from "../moneyworks-client.server";

/**
 * Report type definitions
 */
interface ReportDefinition {
  name: string;
  description: string;
  queryBased: boolean;
  table?: string;
  filter?: string;
  fields?: string[];
}

/**
 * MoneyWorks Transaction Type Codes:
 * - DI = Debtor Invoice (Sales Invoice)
 * - DC = Debtor Credit (Sales Credit Note)
 * - DR = Debtor Receipt (Payment received from customer)
 * - CI = Creditor Invoice (Purchase Invoice)
 * - CC = Creditor Credit (Purchase Credit Note)
 * - CP = Creditor Payment (Payment to supplier)
 * - JN = Journal Entry
 * - BK = Bank Entry
 */
const REPORT_DEFINITIONS: Record<string, ReportDefinition> = {
  balance_sheet: {
    name: "Balance Sheet",
    description: "Assets, liabilities and equity accounts with balances",
    queryBased: true,
    table: "Account",
    // MoneyWorks uses 2-letter type codes: BK=Bank, CA=Current Asset, FA=Fixed Asset,
    // CL=Current Liability, LL=Long-term Liability, EQ=Equity, RE=Retained Earnings
    // Balance sheet includes all asset, liability, and equity types
  },
  trial_balance: {
    name: "Trial Balance",
    description: "Account balances grouped by type",
    queryBased: true,
    table: "Account",
    // Don't specify fields - let it return all and we'll calculate totals
  },
  aged_receivables: {
    name: "Aged Receivables",
    description: "Outstanding customer invoices by age",
    queryBased: true,
    // DI/DII = Debtor Invoice variants, where amount paid is less than gross (unpaid)
    filter: "(Type='DI' or Type='DII') and Gross>Amtpaid",
    table: "Transaction",
  },
  aged_payables: {
    name: "Aged Payables",
    description: "Outstanding supplier invoices by age",
    queryBased: true,
    // CI/CII = Creditor Invoice variants, where amount paid is less than gross (unpaid)
    filter: "(Type='CI' or Type='CII') and Gross>Amtpaid",
    table: "Transaction",
  },
  account_balances: {
    name: "Account Balances",
    description: "Current balance for all accounts",
    queryBased: true,
    table: "Account",
    // Don't specify fields - return all to ensure proper data
  },
  customer_list: {
    name: "Customer List",
    description: "All customers with balances",
    queryBased: true,
    table: "Name",
    filter: "CustomerType>0",
  },
  supplier_list: {
    name: "Supplier List",
    description: "All suppliers with balances",
    queryBased: true,
    table: "Name",
    filter: "SupplierType>0",
  },
  product_list: {
    name: "Product List",
    description: "All products with pricing",
    queryBased: true,
    table: "Product",
  },
  tax_summary: {
    name: "Tax Summary",
    description: "Tax codes and rates",
    queryBased: true,
    table: "TaxRate",
  },
  bank_reconciliation_status: {
    name: "Bank Reconciliation Status",
    description: "Reconciliation status of all bank/cash accounts",
    queryBased: true,
    table: "Account",
    // Query accounts that could hold cash: CA=Current Asset (includes bank), BK=Bank
    // Fields: Laststatementimport, Lastimportedstatementsequence, Lastclearedbalance
  },
  daily_transaction_summary: {
    name: "Daily Transaction Summary",
    description: "Summary of transactions by type for a specific date showing Gross, GST, Nett, and Count",
    queryBased: true,
    table: "Transaction",
    // Query transactions for a specific date, group by Type (BK, CP, DR, DI, DC, CI, CC, JN)
    // Sum Gross, GST, Nett amounts and count per type
  },
  ledger_report: {
    name: "Ledger Report",
    description: "General ledger showing all transactions for each account with running balances over a date range",
    queryBased: true,
    table: "Detail",
    // Query Detail table postings grouped by account for date range
    // Calculate running balance for each transaction
    // Show opening/closing balances with DB/CR indicators
  },
};

/**
 * Tool definition for Anthropic API
 */
export const mwReportToolDef: Tool = {
  name: "mw_report",
  description: `Generate standard MoneyWorks reports.

Available reports:
- balance_sheet: Assets, liabilities and equity with totals
- trial_balance: Account balances grouped by type (debit/credit)
- aged_receivables: Outstanding customer invoices by age
- aged_payables: Outstanding supplier invoices by age
- account_balances: Current balance for all accounts
- customer_list: All customers with contact info and balances
- supplier_list: All suppliers with contact info and balances
- product_list: All products with pricing and stock levels
- tax_summary: Tax codes and rates
- bank_reconciliation_status: Reconciliation status of all bank/cash accounts
- daily_transaction_summary: Summary of transactions by type for a date (Gross, GST, Nett, Count)
- ledger_report: General ledger showing all transactions per account with running balances

Use asOf date (YYYYMMDD format) for historical reports where applicable.
For ledger_report, use fromDate and toDate (YYYYMMDD) for date range, and optional accountFilter to limit to specific account codes.`,
  input_schema: {
    type: "object" as const,
    properties: {
      report: {
        type: "string",
        enum: Object.keys(REPORT_DEFINITIONS),
        description: "Report type to generate",
      },
      asOf: {
        type: "string",
        description: "Report as-of date in YYYYMMDD format (optional, for historical reports)",
      },
      fromDate: {
        type: "string",
        description: "Start date in YYYYMMDD format (for ledger_report)",
      },
      toDate: {
        type: "string",
        description: "End date in YYYYMMDD format (for ledger_report)",
      },
      accountFilter: {
        type: "string",
        description: "Optional account code to filter (for ledger_report, e.g., '1000' for a single account)",
      },
      limit: {
        type: "number",
        description: "Maximum records to return (default: 500)",
      },
    },
    required: ["report"],
  },
};

/**
 * Execute the mw_report tool
 */
export async function runMwReport(input: {
  report: string;
  asOf?: string;
  fromDate?: string;
  toDate?: string;
  accountFilter?: string;
  limit?: number;
}): Promise<string> {
  try {
    // Verify connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return `Error: ${connectionTest.message}`;
    }

    const reportDef = REPORT_DEFINITIONS[input.report];

    if (!reportDef) {
      return `Error: Unknown report type '${input.report}'. Available: ${Object.keys(REPORT_DEFINITIONS).join(", ")}`;
    }

    const limit = input.limit ?? 500;
    let reportData: Record<string, unknown>[];
    let additionalInfo: Record<string, unknown> = {};

    if (reportDef.queryBased) {
      // Query-based report
      reportData = await queryTable(reportDef.table || "Account", {
        filter: reportDef.filter,
        fields: reportDef.fields,
        limit,
      });

      // For balance sheet, calculate balances from Detail table postings
      // MoneyWorks type codes: BK=Bank, CA=Current Asset, FA=Fixed Asset, OA=Other Asset
      // CL=Current Liability, LL=Long-term Liability, EQ=Equity, RE=Retained Earnings
      if (input.report === "balance_sheet") {
        // Get all accounts with their types
        const accounts = await queryTable("Account", {
          fields: ["Code", "Description", "Type"],
          limit: 1000,
        });

        // Get all detail postings to calculate balances
        // MoneyWorks returns lowercase field names: detail.account, detail.debit, detail.credit
        const details = await queryTable("Detail", {
          fields: ["detail.account", "detail.debit", "detail.credit"],
          limit: 10000,
        });

        // Calculate balance per account (Debit - Credit for assets, Credit - Debit for liabilities/equity)
        const accountBalances: Record<string, number> = {};
        for (const detail of details) {
          // Handle various field name formats (lowercase from XML, or capitalized)
          const account = String(detail["detail.account"] || detail["Detail.Account"] || detail.Account || "").replace(/-$/, "");
          const debit = parseFloat(String(detail["detail.debit"] || detail["Detail.Debit"] || detail.Debit || 0));
          const credit = parseFloat(String(detail["detail.credit"] || detail["Detail.Credit"] || detail.Credit || 0));
          if (!accountBalances[account]) accountBalances[account] = 0;
          accountBalances[account] += debit - credit;
        }

        // Asset types: BK (Bank), CA (Current Asset), FA (Fixed Asset), OA (Other Asset)
        const assetTypes = ["BK", "CA", "FA", "OA"];
        // Liability types: CL (Current Liability), LL (Long-term Liability)
        const liabilityTypes = ["CL", "LL"];
        // Equity types: EQ (Equity), RE (Retained Earnings)
        const equityTypes = ["EQ", "RE"];

        let totalAssets = 0;
        let totalLiabilities = 0;
        let totalEquity = 0;

        const assetsAccounts: typeof accounts = [];
        const liabilitiesAccounts: typeof accounts = [];
        const equityAccounts: typeof accounts = [];

        for (const acc of accounts) {
          const code = String(acc.Code);
          const type = String(acc.Type);
          const balance = accountBalances[code] || 0;

          if (assetTypes.includes(type)) {
            assetsAccounts.push({ ...acc, balance });
            totalAssets += balance;
          } else if (liabilityTypes.includes(type)) {
            liabilitiesAccounts.push({ ...acc, balance });
            totalLiabilities += balance;
          } else if (equityTypes.includes(type)) {
            equityAccounts.push({ ...acc, balance });
            totalEquity += balance;
          }
        }

        additionalInfo = {
          summary: {
            totalAssets,
            totalLiabilities,
            totalEquity,
            netAssets: totalAssets + totalLiabilities + totalEquity,
          },
          assets: { count: assetsAccounts.length, total: totalAssets, accounts: assetsAccounts },
          liabilities: { count: liabilitiesAccounts.length, total: totalLiabilities, accounts: liabilitiesAccounts },
          equity: { count: equityAccounts.length, total: totalEquity, accounts: equityAccounts },
        };
      }

      // For trial balance, calculate from Detail table postings
      if (input.report === "trial_balance") {
        // Get all accounts
        const accounts = await queryTable("Account", {
          fields: ["Code", "Description", "Type"],
          limit: 1000,
        });

        // Get all detail postings
        // MoneyWorks returns lowercase field names: detail.account, detail.debit, detail.credit
        const details = await queryTable("Detail", {
          fields: ["detail.account", "detail.debit", "detail.credit"],
          limit: 10000,
        });

        // Calculate balance per account
        const accountBalances: Record<string, number> = {};
        for (const detail of details) {
          // Handle various field name formats (lowercase from XML, or capitalized)
          const account = String(detail["detail.account"] || detail["Detail.Account"] || detail.Account || "").replace(/-$/, "");
          const debit = parseFloat(String(detail["detail.debit"] || detail["Detail.Debit"] || detail.Debit || 0));
          const credit = parseFloat(String(detail["detail.credit"] || detail["Detail.Credit"] || detail.Credit || 0));
          if (!accountBalances[account]) accountBalances[account] = 0;
          accountBalances[account] += debit - credit;
        }

        // Group by type
        const byType: Record<string, { count: number; total: number }> = {};
        let totalDebit = 0;
        let totalCredit = 0;

        for (const acc of accounts) {
          const code = String(acc.Code);
          const type = String(acc.Type || "Other");
          const balance = accountBalances[code] || 0;

          if (!byType[type]) byType[type] = { count: 0, total: 0 };
          byType[type].count++;
          byType[type].total += balance;

          if (balance > 0) totalDebit += balance;
          else totalCredit += Math.abs(balance);
        }

        additionalInfo = {
          byType,
          totalDebit,
          totalCredit,
          difference: totalDebit - totalCredit,
        };
      }

      // For aged receivables/payables, add aging info
      if (input.report === "aged_receivables" || input.report === "aged_payables") {
        let totalOutstanding = 0;
        for (const txn of reportData) {
          // Calculate outstanding as Gross - Amtpaid
          const gross = Number(txn.Gross) || Number(txn.gross) || 0;
          const amtpaid = Number(txn.Amtpaid) || Number(txn.amtpaid) || 0;
          totalOutstanding += (gross - amtpaid);
        }
        additionalInfo = {
          totalOutstanding,
          transactionCount: reportData.length,
        };
      }

      // For bank reconciliation status, analyze bank accounts
      if (input.report === "bank_reconciliation_status") {
        // Query all accounts with reconciliation fields
        const accounts = await queryTable("Account", {
          fields: [
            "Code",
            "Description",
            "Type",
            "Bankaccountnumber",
            "Laststatementimport",
            "Lastimportedstatementsequence",
            "Lastclearedbalance",
          ],
          limit: 500,
        });

        // Filter to bank-type accounts (CA=Current Asset includes bank, or accounts with bank numbers)
        // Bank accounts typically have Type=CA and have a Bankaccountnumber, or specific codes like 1000, 1010
        const bankAccountTypes = ["CA", "BK"];
        const bankAccounts = accounts.filter((acc) => {
          const type = String(acc.Type || "");
          const bankNum = String(acc.Bankaccountnumber || "");
          const code = String(acc.Code || "");
          const desc = String(acc.Description || "").toLowerCase();

          // Include if: has bank account number, or is a current asset with bank-related name
          return (
            bankNum.length > 0 ||
            (bankAccountTypes.includes(type) &&
              (desc.includes("bank") ||
                desc.includes("cash") ||
                desc.includes("deposit") ||
                desc.includes("visa") ||
                desc.includes("credit card") ||
                code === "1000" ||
                code === "1010" ||
                code === "1020"))
          );
        });

        // Process reconciliation status for each account
        interface BankReconAccount {
          accountCode: string;
          accountName: string;
          status: "reconciled" | "never" | "partial";
          reconciledAt?: string;
          statementNumber?: number;
          closingBalance?: number;
          bankAccountNumber?: string;
        }

        const reconAccounts: BankReconAccount[] = [];
        let reconciledCount = 0;
        let neverReconciledCount = 0;

        for (const acc of bankAccounts) {
          const lastImport = String(acc.Laststatementimport || "");
          const stmtNum = Number(acc.Lastimportedstatementsequence) || 0;
          const clearedBal = Number(acc.Lastclearedbalance) || 0;

          // Determine status
          let status: "reconciled" | "never" | "partial" = "never";
          if (lastImport && lastImport !== "0" && lastImport !== "") {
            status = "reconciled";
            reconciledCount++;
          } else {
            neverReconciledCount++;
          }

          reconAccounts.push({
            accountCode: String(acc.Code),
            accountName: String(acc.Description),
            status,
            ...(status === "reconciled" ? {
              reconciledAt: lastImport,
              statementNumber: stmtNum,
              closingBalance: clearedBal,
            } : {}),
            ...(acc.Bankaccountnumber ? {
              bankAccountNumber: String(acc.Bankaccountnumber),
            } : {}),
          });
        }

        // Override reportData with processed bank accounts
        reportData = reconAccounts as unknown as Record<string, unknown>[];

        additionalInfo = {
          summary: {
            totalAccounts: bankAccounts.length,
            reconciledCount,
            neverReconciledCount,
            hasDiscrepancies: false, // Could be enhanced to check for discrepancies
          },
          accounts: reconAccounts,
        };
      }

      // For daily transaction summary, query transactions for the date and group by type
      // Also calculate P&L summary and balance changes
      if (input.report === "daily_transaction_summary") {
        // Transaction type code to name mapping
        const TRANSACTION_TYPE_NAMES: Record<string, string> = {
          BK: "Bank Entry",
          CP: "Creditor Payment",
          DR: "Debtor Receipt",
          DI: "Debtor Invoice",
          DC: "Debtor Credit",
          CI: "Creditor Invoice",
          CC: "Creditor Credit",
          JN: "Journal Entry",
        };

        // Account type codes for P&L classification
        // MoneyWorks uses: IN=Income, EX=Expense, CS=Cost of Sales, OI=Other Income
        const incomeTypes = ["IN", "SA"]; // Sales/Income
        const costOfSalesTypes = ["CS", "CG"]; // Cost of Sales/Cost of Goods
        const otherIncomeTypes = ["OI"]; // Other Income
        const expenseTypes = ["EX", "OH"]; // Expenses/Overhead
        // Balance sheet types for balance changes
        const bankTypes = ["BK", "CA"]; // Bank accounts (Bank, Current Asset with bank names)
        const receivableTypes = ["AR"]; // Accounts Receivable
        const payableTypes = ["AP"]; // Accounts Payable

        // Use asOf date or default to today in YYYYMMDD format
        const today = new Date();
        const defaultDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
        const targetDate = input.asOf || defaultDate;

        // Format date from YYYYMMDD to YYYY-MM-DD
        const formatDate = (yyyymmdd: string): string => {
          if (yyyymmdd.length !== 8) return yyyymmdd;
          return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
        };

        // Query transactions for the target date with their sequence numbers
        // MoneyWorks uses TransDate field in YYYYMMDD format
        const transactions = await queryTable("Transaction", {
          filter: `TransDate='${targetDate}'`,
          fields: ["Type", "Gross", "GST", "Nett", "SequenceNumber"],
          limit: 5000,
        });

        // Query all accounts to get types
        const accounts = await queryTable("Account", {
          fields: ["Code", "Description", "Type"],
          limit: 1000,
        });

        // Build account type lookup
        const accountTypes: Record<string, string> = {};
        for (const acc of accounts) {
          accountTypes[String(acc.Code)] = String(acc.Type || "");
        }

        // Get transaction sequence numbers for this date
        const txnSequences = transactions.map((t) =>
          String(t.SequenceNumber || t.sequencenumber || "")
        ).filter((s) => s && s !== "0");

        // Query detail postings for transactions on this date
        // Details link to transactions via sequencenumber field
        let details: Record<string, unknown>[] = [];
        if (txnSequences.length > 0) {
          // Build filter for the transaction sequences (limit to avoid too-long query)
          // If too many transactions, we'll process in batches or skip P&L
          if (txnSequences.length <= 100) {
            const seqFilter = txnSequences.map((s) => `detail.sequencenumber='${s}'`).join(" or ");
            details = await queryTable("Detail", {
              fields: ["detail.account", "detail.debit", "detail.credit", "detail.sequencenumber"],
              filter: seqFilter,
              limit: 10000,
            });
          } else {
            // Too many transactions - query all details for date range would be expensive
            // Skip P&L calculation for very busy days
            console.log(`[mw-report] Skipping P&L calculation: ${txnSequences.length} transactions exceeds limit`);
          }
        }

        // Calculate P&L amounts by account type
        let totalSales = 0;
        let totalCostOfSales = 0;
        let totalOtherIncome = 0;
        let totalExpenses = 0;

        // Calculate balance changes by account type
        let bankChange = 0;
        let receivablesChange = 0;
        let payablesChange = 0;

        for (const detail of details) {
          const account = String(detail["detail.account"] || detail["Detail.Account"] || detail.Account || "").replace(/-$/, "");
          const debit = parseFloat(String(detail["detail.debit"] || detail["Detail.Debit"] || detail.Debit || 0));
          const credit = parseFloat(String(detail["detail.credit"] || detail["Detail.Credit"] || detail.Credit || 0));
          const accType = accountTypes[account] || "";

          // P&L accounts (credit increases income, debit increases expense)
          if (incomeTypes.includes(accType)) {
            totalSales += credit - debit; // Income is credit-positive
          } else if (costOfSalesTypes.includes(accType)) {
            totalCostOfSales += debit - credit; // Cost is debit-positive
          } else if (otherIncomeTypes.includes(accType)) {
            totalOtherIncome += credit - debit; // Other income is credit-positive
          } else if (expenseTypes.includes(accType)) {
            totalExpenses += debit - credit; // Expense is debit-positive
          }

          // Balance changes (net movement for the day)
          if (bankTypes.includes(accType)) {
            bankChange += debit - credit; // Bank is debit-positive (asset)
          } else if (receivableTypes.includes(accType)) {
            receivablesChange += debit - credit; // AR is debit-positive (asset)
          } else if (payableTypes.includes(accType)) {
            payablesChange += credit - debit; // AP is credit-positive (liability)
          }
        }

        // Calculate P&L derived values
        const grossMargin = totalSales - totalCostOfSales;
        const grossMarginPercent = totalSales !== 0 ? (grossMargin / totalSales) * 100 : 0;
        const netIncome = grossMargin + totalOtherIncome;
        const surplusDeficit = netIncome - totalExpenses;

        // Query current balances for bank, receivables, payables
        // Sum up account balances by type from all detail postings
        const allDetails = await queryTable("Detail", {
          fields: ["detail.account", "detail.debit", "detail.credit"],
          limit: 50000,
        });

        let currentBankBalance = 0;
        let currentReceivablesBalance = 0;
        let currentPayablesBalance = 0;

        for (const detail of allDetails) {
          const account = String(detail["detail.account"] || detail["Detail.Account"] || detail.Account || "").replace(/-$/, "");
          const debit = parseFloat(String(detail["detail.debit"] || detail["Detail.Debit"] || detail.Debit || 0));
          const credit = parseFloat(String(detail["detail.credit"] || detail["Detail.Credit"] || detail.Credit || 0));
          const accType = accountTypes[account] || "";

          if (bankTypes.includes(accType)) {
            currentBankBalance += debit - credit;
          } else if (receivableTypes.includes(accType)) {
            currentReceivablesBalance += debit - credit;
          } else if (payableTypes.includes(accType)) {
            currentPayablesBalance += credit - debit;
          }
        }

        // Group by transaction type and calculate totals
        interface TypeSummary {
          type: string;
          typeName: string;
          gross: number;
          gst: number;
          nett: number;
          count: number;
        }

        const summaryByType: Record<string, TypeSummary> = {};
        let totalGross = 0;
        let totalGst = 0;
        let totalNett = 0;
        let totalCount = 0;

        for (const txn of transactions) {
          const type = String(txn.Type || txn.type || "");
          if (!type) continue;

          const gross = parseFloat(String(txn.Gross || txn.gross || 0));
          const gst = parseFloat(String(txn.GST || txn.gst || 0));
          const nett = parseFloat(String(txn.Nett || txn.nett || 0));

          if (!summaryByType[type]) {
            summaryByType[type] = {
              type,
              typeName: TRANSACTION_TYPE_NAMES[type] || type,
              gross: 0,
              gst: 0,
              nett: 0,
              count: 0,
            };
          }

          summaryByType[type].gross += gross;
          summaryByType[type].gst += gst;
          summaryByType[type].nett += nett;
          summaryByType[type].count += 1;

          totalGross += gross;
          totalGst += gst;
          totalNett += nett;
          totalCount += 1;
        }

        // Convert to array sorted by type
        const summaryArray = Object.values(summaryByType).sort((a, b) =>
          a.type.localeCompare(b.type)
        );

        // Override reportData with processed summary
        reportData = summaryArray as unknown as Record<string, unknown>[];

        additionalInfo = {
          fromDate: formatDate(targetDate),
          toDate: formatDate(targetDate),
          createdAt: new Date().toISOString(),
          // P&L Summary section
          plSummary: {
            totalSales,
            totalCostOfSales,
            grossMargin,
            grossMarginPercent,
            totalOtherIncome,
            netIncome,
            totalExpenses,
            surplusDeficit,
          },
          // Balance changes section
          balanceChanges: [
            {
              type: "bank",
              label: "Bank balances",
              change: bankChange,
              currentBalance: currentBankBalance,
            },
            {
              type: "receivables",
              label: "Receivables",
              change: receivablesChange,
              currentBalance: currentReceivablesBalance,
            },
            {
              type: "payables",
              label: "Payables",
              change: payablesChange,
              currentBalance: currentPayablesBalance,
            },
          ],
          // Transaction summary section
          summaryByType: summaryArray,
          totals: {
            gross: totalGross,
            gst: totalGst,
            nett: totalNett,
            count: totalCount,
          },
        };
      }

      // For ledger_report, query Transaction with embedded Detail records
      if (input.report === "ledger_report") {
        // Transaction type code to name mapping
        const TRANSACTION_TYPE_CODES: Record<string, string> = {
          BK: "BK", // Bank Entry
          CP: "CP", // Creditor Payment
          CR: "CR", // Creditor Receipt
          DR: "DR", // Debtor Receipt
          DI: "DI", // Debtor Invoice
          DC: "DC", // Debtor Credit
          CI: "CI", // Creditor Invoice
          CC: "CC", // Creditor Credit
          JN: "JN", // Journal Entry
          DD: "DD", // Direct Debit
          EFT: "EFT", // Electronic Transfer
        };

        // Format date from YYYYMMDD to YYYY-MM-DD
        const formatDateDisplay = (yyyymmdd: string): string => {
          if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd || "";
          return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
        };

        // Get date range - default to current year if not specified
        const today = new Date();
        const yearStart = `${today.getFullYear()}0101`;
        const yearEnd = `${today.getFullYear()}1231`;
        const fromDate = input.fromDate || yearStart;
        const toDate = input.toDate || yearEnd;

        // Query all accounts
        const accounts = await queryTable("Account", {
          fields: ["Code", "Description", "Type"],
          limit: 1000,
        });

        // Build account lookup
        const accountInfo: Record<string, { name: string; type: string }> = {};
        for (const acc of accounts) {
          const code = String(acc.Code || "");
          accountInfo[code] = {
            name: String(acc.Description || code),
            type: String(acc.Type || ""),
          };
        }

        // Query transactions for the date range - they include embedded Detail records via _details
        const transactions = await queryTable("Transaction", {
          filter: `TransDate>='${fromDate}' and TransDate<='${toDate}'`,
          limit: 10000,
        });

        // Query transactions BEFORE the date range for opening balances
        const priorTransactions = await queryTable("Transaction", {
          filter: `TransDate<'${fromDate}'`,
          limit: 20000,
        });

        // Calculate opening balances from prior transactions
        const openingBalances: Record<string, number> = {};
        for (const txn of priorTransactions) {
          const details = txn._details as Record<string, unknown>[] || [];
          for (const detail of details) {
            const account = String(detail["detail.account"] || detail.Account || "").replace(/-$/, "");
            // Nested details use net field, standalone uses debit/credit
            const net = parseFloat(String(detail["detail.net"] || detail.Net || detail["detail.debit"] || detail.Debit || 0));
            // For opening balance, positive net is a debit (increases the account)
            const debit = net > 0 ? net : 0;
            const credit = net < 0 ? Math.abs(net) : 0;

            if (!openingBalances[account]) openingBalances[account] = 0;
            openingBalances[account] += debit - credit;
          }
        }

        // Collect all detail entries grouped by account
        interface DetailEntry {
          txnType: string;
          txnDate: string;
          txnRef: string;
          txnDesc: string;
          debit: number;
          credit: number;
          gst: number;
          taxCode: string;
        }

        const detailsByAccount: Record<string, DetailEntry[]> = {};

        for (const txn of transactions) {
          const txnType = String(txn.Type || txn.type || "");
          const txnDate = formatDateDisplay(String(txn.Transdate || txn.TransDate || txn.transdate || ""));
          const txnRef = String(txn.Ourref || txn.OurRef || txn.ourref || "");
          const nameCode = String(txn.Namecode || txn.NameCode || txn.namecode || txn.Tofrom || txn.tofrom || "");
          const memo = String(txn.Description || txn.description || "");
          const txnDesc = nameCode && memo ? `${nameCode}: ${memo}` : nameCode || memo || "";

          // Get embedded details from _details property
          const details = txn._details as Record<string, unknown>[] || [];

          for (const detail of details) {
            const account = String(detail["detail.account"] || detail.Account || "").replace(/-$/, "");
            // Nested details use net field, standalone uses debit/credit
            const net = parseFloat(String(detail["detail.net"] || detail.Net || detail["detail.debit"] || detail.Debit || 0));
            // Positive net is a debit, negative would be credit
            const debit = net > 0 ? net : 0;
            const credit = net < 0 ? Math.abs(net) : 0;
            const gst = parseFloat(String(detail["detail.gst"] || detail.Gst || detail["detail.tax"] || detail.Tax || 0));
            const taxCode = String(detail["detail.taxcode"] || detail.Taxcode || "");

            // Skip if account filter specified and doesn't match
            if (input.accountFilter && account !== input.accountFilter) continue;

            if (!detailsByAccount[account]) {
              detailsByAccount[account] = [];
            }
            detailsByAccount[account].push({
              txnType,
              txnDate,
              txnRef,
              txnDesc,
              debit,
              credit,
              gst,
              taxCode,
            });
          }
        }

        // Build ledger accounts structure
        interface LedgerAccountData {
          accountCode: string;
          accountName: string;
          accountType: string;
          openingBalance: number;
          openingBalanceType: "DB" | "CR";
          entries: Array<{
            index: number;
            type: string;
            date: string;
            reference: string;
            description: string;
            gst: number;
            taxCode: string;
            debit: number;
            credit: number;
            balance: number;
            balanceType: "DB" | "CR";
          }>;
          closingBalance: number;
          closingBalanceType: "DB" | "CR";
          totalDebit: number;
          totalCredit: number;
        }

        const ledgerAccounts: LedgerAccountData[] = [];

        // Process each account that has postings
        const accountCodes = input.accountFilter
          ? [input.accountFilter]
          : Object.keys(detailsByAccount).sort();

        for (const accountCode of accountCodes) {
          const accountDetails = detailsByAccount[accountCode] || [];
          if (accountDetails.length === 0 && !input.accountFilter) continue;

          const info = accountInfo[accountCode] || { name: accountCode, type: "" };
          const opening = openingBalances[accountCode] || 0;

          // Sort details by transaction date
          const sortedDetails = [...accountDetails].sort((a, b) => {
            return a.txnDate.localeCompare(b.txnDate);
          });

          // Build entries with running balance
          let runningBalance = opening;
          let totalDebit = 0;
          let totalCredit = 0;

          const entries: LedgerAccountData["entries"] = [];

          for (let i = 0; i < sortedDetails.length; i++) {
            const d = sortedDetails[i];

            runningBalance += d.debit - d.credit;
            totalDebit += d.debit;
            totalCredit += d.credit;

            entries.push({
              index: i + 1,
              type: TRANSACTION_TYPE_CODES[d.txnType] || d.txnType,
              date: d.txnDate,
              reference: d.txnRef,
              description: d.txnDesc,
              gst: d.gst,
              taxCode: d.taxCode,
              debit: d.debit,
              credit: d.credit,
              balance: Math.abs(runningBalance),
              balanceType: runningBalance >= 0 ? "DB" : "CR",
            });
          }

          const closingBalance = runningBalance;

          ledgerAccounts.push({
            accountCode,
            accountName: info.name,
            accountType: info.type,
            openingBalance: Math.abs(opening),
            openingBalanceType: opening >= 0 ? "DB" : "CR",
            entries,
            closingBalance: Math.abs(closingBalance),
            closingBalanceType: closingBalance >= 0 ? "DB" : "CR",
            totalDebit,
            totalCredit,
          });
        }

        // Override reportData with ledger accounts
        reportData = ledgerAccounts as unknown as Record<string, unknown>[];

        additionalInfo = {
          reportTitle: "General Ledger Report",
          fromDate: formatDateDisplay(fromDate),
          toDate: formatDateDisplay(toDate),
          accounts: ledgerAccounts,
        };
      }
    } else {
      reportData = [];
    }

    return JSON.stringify(
      {
        report: reportDef.name,
        description: reportDef.description,
        ...(input.asOf && { asOf: input.asOf }),
        recordCount: reportData.length,
        ...additionalInfo,
        data: reportData,
      },
      null,
      2
    );
  } catch (error) {
    return `Error generating ${input.report} report: ${getErrorMessage(error)}`;
  }
}
