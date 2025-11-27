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

Use asOf date (YYYYMMDD format) for historical reports where applicable.`,
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

        // Use asOf date or default to today in YYYYMMDD format
        const today = new Date();
        const defaultDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
        const targetDate = input.asOf || defaultDate;

        // Query transactions for the target date
        // MoneyWorks uses TransDate field in YYYYMMDD format
        const transactions = await queryTable("Transaction", {
          filter: `TransDate='${targetDate}'`,
          fields: ["Type", "Gross", "GST", "Nett"],
          limit: 5000,
        });

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

        // Format date from YYYYMMDD to YYYY-MM-DD
        const formatDate = (yyyymmdd: string): string => {
          if (yyyymmdd.length !== 8) return yyyymmdd;
          return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
        };

        // Override reportData with processed summary
        reportData = summaryArray as unknown as Record<string, unknown>[];

        additionalInfo = {
          fromDate: formatDate(targetDate),
          toDate: formatDate(targetDate),
          createdAt: new Date().toISOString(),
          summaryByType: summaryArray,
          totals: {
            gross: totalGross,
            gst: totalGst,
            nett: totalNett,
            count: totalCount,
          },
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
