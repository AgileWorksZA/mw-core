/**
 * Report Generation Command
 *
 * Generate MoneyWorks reports in JSON format
 */

import { parseArgs } from "node:util";
import { Reports } from "@moneyworks/canonical";
import type { SmartMoneyWorksClient, GlobalOptions } from "@moneyworks/data";

const {
  buildExecutiveSummaryFromData,
  createSampleExecutiveSummaryData,
  buildBalanceSheetFromData,
  createSampleBalanceSheetData,
  getDefaultBalanceSheetOptions,
} = Reports;

export async function reportCommand(
  client: SmartMoneyWorksClient,
  args: string[],
  _globalOptions: GlobalOptions,
): Promise<void> {
  if (args.length === 0) {
    console.error("Usage: mw report <report-type> [options]");
    console.error("");
    console.error("Available Reports:");
    console.error("  executive-summary    Comprehensive business overview with KPIs");
    console.error("  balance-sheet        Assets, Liabilities, and Equity snapshot");
    console.error("");
    console.error("Common Options:");
    console.error("  --as-of <date>       Report end date (YYYY-MM-DD, default: today)");
    console.error("  --demo               Use demo data instead of live MoneyWorks data");
    console.error("  -o, --output <file>  Output to file");
    console.error("  --compact            Compact JSON (no formatting)");
    console.error("");
    console.error("Executive Summary Options:");
    console.error("  --months <number>    Period length in months (default: 12)");
    console.error("");
    console.error("Balance Sheet Options:");
    console.error("  --period <period>    MoneyWorks period (e.g., 'Jan:2024/25')");
    console.error("  --omit-zero          Omit zero balance accounts (default: true)");
    console.error("  --include-unposted   Include unposted transactions");
    console.error("  --show-codes         Show account codes");
    process.exit(1);
  }

  const reportType = args[0];

  // Parse options
  const { values } = parseArgs({
    args: args.slice(1),
    options: {
      "as-of": { type: "string" },
      months: { type: "string" },
      period: { type: "string" },
      demo: { type: "boolean", default: false },
      output: { type: "string", short: "o" },
      pretty: { type: "boolean", default: true },
      compact: { type: "boolean", default: false },
      "omit-zero": { type: "boolean", default: true },
      "include-unposted": { type: "boolean", default: false },
      "show-codes": { type: "boolean", default: false },
    },
    strict: false,
  });

  switch (reportType) {
    case "executive-summary":
      await generateExecutiveSummary(client, values, _globalOptions);
      break;
    case "balance-sheet":
      await generateBalanceSheet(client, values, _globalOptions);
      break;
    default:
      console.error(`Unknown report type: ${reportType}`);
      console.error("Available: executive-summary, balance-sheet");
      process.exit(1);
  }
}

async function generateExecutiveSummary(
  client: SmartMoneyWorksClient,
  values: Record<string, unknown>,
  _globalOptions: GlobalOptions,
): Promise<void> {
  const asOfDate = (values["as-of"] as string) || new Date().toISOString().split("T")[0];
  const months = values.months ? Number.parseInt(values.months as string) : 12;
  const useDemo = values.demo as boolean;
  const outputFile = values.output as string | undefined;
  const compact = values.compact as boolean;

  if (_globalOptions.debug) {
    console.log(`Debug: Generating Executive Summary`);
    console.log(`Debug: As of: ${asOfDate}, Months: ${months}`);
    console.log(`Debug: Demo mode: ${useDemo}`);
  }

  let rawData: Reports.ExecutiveSummaryRawData;

  if (useDemo) {
    // Use sample data for demonstration
    rawData = createSampleExecutiveSummaryData();
  } else {
    // Query MoneyWorks for real data
    rawData = await fetchExecutiveSummaryData(client, asOfDate, months);
  }

  // Build the report
  const report = buildExecutiveSummaryFromData(rawData, {
    asOfDate,
    months,
    includeComparison: true,
    currency: "NZD",
  });

  // Format output
  const jsonOutput = compact
    ? JSON.stringify(report)
    : JSON.stringify(report, null, 2);

  if (outputFile) {
    await Bun.write(outputFile, jsonOutput);
    console.log(`Report written to ${outputFile}`);
  } else {
    console.log(jsonOutput);
  }
}

/**
 * Fetch Executive Summary data from MoneyWorks
 *
 * Queries Ledger for P&L, Transaction for invoices/cash, and calculates metrics.
 */
async function fetchExecutiveSummaryData(
  client: SmartMoneyWorksClient,
  asOfDate: string,
  months: number,
): Promise<Reports.ExecutiveSummaryRawData> {
  try {
    // Get company name
    let companyName = 'Unknown Company';
    try {
      const companyResult = await client.evaluate('Company()');
      companyName = companyResult || 'Unknown Company';
    } catch {
      // Use default
    }

    // Query Ledger for P&L and Balance Sheet data
    const ledgerXml = await client.exportWithFormat('Ledger', 'xml-verbose', {}) as string;
    const ledgerRecords = parseXMLRecords(ledgerXml, 'ledger', (xml) => ({
      code: xmlField(xml, 'accountcode'),
      type: xmlField(xml, 'type'),
      balance: parseFloat(xmlField(xml, 'balance')) || 0,
    }));

    // Calculate P&L totals
    // MoneyWorks types: SA=Sales, IN=Other Income, CS=Cost of Sales, EX=Expenses
    let sales = 0, otherIncome = 0, costOfSales = 0, expenses = 0;
    let currentAssets = 0, currentLiabilities = 0;
    let stockOnHand = 0, openingStock = 0;
    let accountsReceivable = 0, accountsPayable = 0;
    let cashBalance = 0;

    for (const ledger of ledgerRecords) {
      const balance = ledger.balance;
      switch (ledger.type) {
        case 'SA': // Sales
          sales -= balance; // Credits are negative
          break;
        case 'IN': // Other Income
          otherIncome -= balance;
          break;
        case 'CS': // Cost of Sales
          costOfSales += balance;
          break;
        case 'EX': // Expenses
          expenses += balance;
          break;
        case 'CA': // Current Assets
          currentAssets += balance;
          // Track specific accounts
          if (ledger.code === '1300') stockOnHand = balance; // Stock On Hand
          if (ledger.code === '1500') accountsReceivable = balance; // AR
          if (ledger.code === '1000') cashBalance = balance; // Main Bank
          break;
        case 'CL': // Current Liabilities
          currentLiabilities -= balance; // Flip sign
          if (ledger.code === '2000') accountsPayable = -balance; // AP
          break;
      }
    }

    // Query Transaction table for invoice and cash stats
    const txnXml = await client.exportWithFormat('Transaction', 'xml-verbose', {}) as string;
    const txnRecords = parseXMLRecords(txnXml, 'transaction', (xml) => ({
      type: xmlField(xml, 'type'),
      gross: parseFloat(xmlField(xml, 'gross')) || 0,
      aging: parseInt(xmlField(xml, 'aging')) || 0,
    }));

    // Calculate invoice statistics (DII = Debtor Invoice Item)
    let invoiceCount = 0, invoiceTotal = 0;
    let cashReceived = 0, cashSpent = 0;

    // Aging buckets for receivables and payables
    const receivablesAging = { current: 0, days30: 0, days60: 0, days90plus: 0 };
    const payablesAging = { current: 0, days30: 0, days60: 0, days90plus: 0 };

    for (const txn of txnRecords) {
      switch (txn.type) {
        case 'DII': // Debtor Invoice Item
          invoiceCount++;
          invoiceTotal += txn.gross;
          // Aging for receivables
          if (txn.aging <= 0) receivablesAging.current += txn.gross;
          else if (txn.aging <= 30) receivablesAging.days30 += txn.gross;
          else if (txn.aging <= 60) receivablesAging.days60 += txn.gross;
          else receivablesAging.days90plus += txn.gross;
          break;
        case 'CR': // Cash Receipt
          cashReceived += txn.gross;
          break;
        case 'CP': // Cash Payment
          cashSpent += txn.gross;
          break;
        case 'CII': // Creditor Invoice Item
          // Aging for payables
          if (txn.aging <= 0) payablesAging.current += txn.gross;
          else if (txn.aging <= 30) payablesAging.days30 += txn.gross;
          else if (txn.aging <= 60) payablesAging.days60 += txn.gross;
          else payablesAging.days90plus += txn.gross;
          break;
      }
    }

    // Calculate derived metrics
    const grossMargin = sales - costOfSales;
    const netProfit = grossMargin + otherIncome - expenses;
    const avgInvoiceValue = invoiceCount > 0 ? invoiceTotal / invoiceCount : 0;

    // Ratios
    const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;
    const quickRatio = currentLiabilities !== 0 ? (currentAssets - stockOnHand) / currentLiabilities : 0;
    const cashRatio = currentLiabilities !== 0 ? cashBalance / currentLiabilities : 0;

    // Inventory metrics
    const avgInventory = (openingStock + stockOnHand) / 2 || stockOnHand;
    const inventoryTurnover = avgInventory !== 0 ? costOfSales / avgInventory : 0;
    const inventoryPeriod = inventoryTurnover !== 0 ? 365 / inventoryTurnover : 0;

    // Receivables metrics
    const receivablesTurnover = accountsReceivable !== 0 ? invoiceTotal / accountsReceivable : 0;
    const avgCollectionDays = receivablesTurnover !== 0 ? 365 / receivablesTurnover : 0;

    // Build aging buckets
    const totalReceivables = accountsReceivable || (receivablesAging.current + receivablesAging.days30 + receivablesAging.days60 + receivablesAging.days90plus);
    const totalPayables = accountsPayable || (payablesAging.current + payablesAging.days30 + payablesAging.days60 + payablesAging.days90plus);

    const buildAgingBuckets = (aging: typeof receivablesAging, total: number): Reports.AgingBucket[] => [
      { label: 'Current', daysFrom: 0, daysTo: 0, amount: aging.current, percentage: total ? Math.round(aging.current / total * 100) : 0 },
      { label: '30 Days', daysFrom: 1, daysTo: 30, amount: aging.days30, percentage: total ? Math.round(aging.days30 / total * 100) : 0 },
      { label: '60 Days', daysFrom: 31, daysTo: 60, amount: aging.days60, percentage: total ? Math.round(aging.days60 / total * 100) : 0 },
      { label: '90+ Days', daysFrom: 61, daysTo: null, amount: aging.days90plus, percentage: total ? Math.round(aging.days90plus / total * 100) : 0 },
    ];

    return {
      companyName,
      current: {
        // Income & Profitability
        sales,
        costOfSales,
        grossMargin,
        otherIncome,
        expenses,
        netProfit,

        // Invoice Statistics
        invoiceCount,
        invoiceTotalValue: invoiceTotal,
        invoiceAverageValue: avgInvoiceValue,

        // Cash
        openingCash: cashBalance + cashSpent - cashReceived, // Derive opening from closing
        cashReceived,
        cashSpent,
        cashSurplusDeficit: cashReceived - cashSpent,
        cashAdjustments: 0,
        closingCash: cashBalance,

        // Balance Sheet
        currentAssets,
        currentLiabilities,
        currentRatio,
        quickRatio,
        cashRatio,

        // Inventory
        openingStock,
        purchases: costOfSales + stockOnHand - openingStock,
        closingStock: stockOnHand,
        inventoryCostOfSales: costOfSales,
        inventoryTurnover,
        inventoryPeriod,

        // Payables/Receivables
        payables: accountsPayable,
        receivables: accountsReceivable,
        creditSales: invoiceTotal,
        receivablesTurnover,
        averageCollectionDays: avgCollectionDays,
        payablesAging: buildAgingBuckets(payablesAging, totalPayables),
        receivablesAging: buildAgingBuckets(receivablesAging, totalReceivables),
      },
      // Prior period would require historical queries - omit for now
      prior: undefined,
    };
  } catch (error) {
    console.warn("Warning: Failed to fetch live data. Using demo data.");
    console.warn(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return createSampleExecutiveSummaryData();
  }
}

async function generateBalanceSheet(
  client: SmartMoneyWorksClient,
  values: Record<string, unknown>,
  _globalOptions: GlobalOptions,
): Promise<void> {
  const asOfDate = (values["as-of"] as string) || new Date().toISOString().split("T")[0];
  const period = values.period as string | undefined;
  const useDemo = values.demo as boolean;
  const outputFile = values.output as string | undefined;
  const compact = values.compact as boolean;

  // Build options
  const options: Reports.BalanceSheetOptions = {
    ...getDefaultBalanceSheetOptions(asOfDate),
    period,
    omitZeroBalance: values["omit-zero"] !== false,
    includeUnposted: values["include-unposted"] === true,
    showAccountCodes: values["show-codes"] === true,
  };

  if (_globalOptions.debug) {
    console.log(`Debug: Generating Balance Sheet`);
    console.log(`Debug: As of: ${asOfDate}, Period: ${period || 'current'}`);
    console.log(`Debug: Options:`, options);
  }

  let rawData: Reports.BalanceSheetRawData;

  if (useDemo) {
    rawData = createSampleBalanceSheetData();
  } else {
    rawData = await fetchBalanceSheetData(client, options);
  }

  // Build the report
  const report = buildBalanceSheetFromData(rawData, options);

  // Format output
  const jsonOutput = compact
    ? JSON.stringify(report)
    : JSON.stringify(report, null, 2);

  if (outputFile) {
    await Bun.write(outputFile, jsonOutput);
    console.log(`Report written to ${outputFile}`);
  } else {
    console.log(jsonOutput);
  }
}

/**
 * Map MoneyWorks account type to Balance Sheet category
 *
 * @param type - MoneyWorks account type code
 * @returns Balance Sheet category name
 */
function mapAccountTypeToCategory(type: string): Reports.AccountData['category'] | null {
  switch (type) {
    case 'CA': // Current Asset
    case 'TA': // Trade Account (AR)
      return 'CURRENT ASSETS';
    case 'FA': // Fixed Asset
      return 'FIXED ASSETS';
    case 'CL': // Current Liability
    case 'TL': // Trade Liability (AP)
      return 'CURRENT LIABILITIES';
    case 'SF': // Shareholders Funds
      return 'EQUITY';
    default:
      // INC, EXP are P&L accounts, not balance sheet
      return null;
  }
}

/**
 * Parse XML verbose export into structured data
 */
function parseXMLRecords<T>(
  xml: string,
  recordTag: string,
  fieldExtractor: (recordXml: string) => T | null
): T[] {
  const records: T[] = [];
  const regex = new RegExp(`<${recordTag}>([\\s\\S]*?)<\\/${recordTag}>`, 'g');
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const record = fieldExtractor(match[1]);
    if (record) records.push(record);
  }

  return records;
}

/**
 * Extract field value from XML
 */
function xmlField(xml: string, field: string): string {
  const match = xml.match(new RegExp(`<${field}>(.*?)<\\/${field}>`));
  return match?.[1] || '';
}

/**
 * Fetch Balance Sheet data from MoneyWorks
 *
 * Queries the Ledger table for current balances and Account table for descriptions.
 * Falls back to sample data if no real data is available.
 */
async function fetchBalanceSheetData(
  client: SmartMoneyWorksClient,
  options: Reports.BalanceSheetOptions,
): Promise<Reports.BalanceSheetRawData> {
  try {
    // Get company name
    let companyName = 'Unknown Company';
    try {
      const companyResult = await client.evaluate('Company()');
      companyName = companyResult || 'Unknown Company';
    } catch {
      // Use default
    }

    // Query Ledger table for current balances (this has the actual balance values)
    const ledgerXml = await client.exportWithFormat('Ledger', 'xml-verbose', {});
    const ledgerRecords = parseXMLRecords(ledgerXml as string, 'ledger', (xml) => ({
      accountcode: xmlField(xml, 'accountcode'),
      type: xmlField(xml, 'type'),
      balance: parseFloat(xmlField(xml, 'balance')) || 0,
    }));

    // Query Account table for descriptions
    const accountXml = await client.exportWithFormat('Account', 'xml-verbose', {});
    const accountRecords = parseXMLRecords(accountXml as string, 'account', (xml) => ({
      code: xmlField(xml, 'code'),
      description: xmlField(xml, 'description'),
    }));

    // Build lookup map for account descriptions
    const accountDescriptions = new Map<string, string>();
    for (const acc of accountRecords) {
      accountDescriptions.set(acc.code, acc.description);
    }

    if (!ledgerRecords || ledgerRecords.length === 0) {
      console.warn("Warning: No ledger records found. Using demo data.");
      return createSampleBalanceSheetData();
    }

    // Process ledger records
    const balanceSheetAccounts: Reports.AccountData[] = [];
    let hasNonZeroBalance = false;

    for (const ledger of ledgerRecords) {
      // Get account type and map to category
      const category = mapAccountTypeToCategory(ledger.type);

      // Skip non-balance sheet accounts (INC, EXP)
      if (!category) continue;

      const code = ledger.accountcode;
      if (!code) continue;

      const name = accountDescriptions.get(code) || code;

      // MoneyWorks stores liabilities and equity with opposite signs
      // (debits positive, credits negative). Flip for balance sheet display.
      const isLiabilityOrEquity = ['CL', 'TL', 'SF'].includes(ledger.type);
      const thisYearBalance = isLiabilityOrEquity ? -ledger.balance : ledger.balance;

      if (thisYearBalance !== 0) {
        hasNonZeroBalance = true;
      }

      balanceSheetAccounts.push({
        code,
        name,
        category,
        thisYear: thisYearBalance,
        // Note: Ledger table only has current balance, not prior year
        // Would need to query with period filter for historical data
        lastYearEnd: undefined,
      });
    }

    // If no balances found, warn and use demo data
    if (!hasNonZeroBalance) {
      console.warn("Warning: All account balances are zero.");
      console.warn("Using demo data for demonstration purposes.");
      return createSampleBalanceSheetData();
    }

    // Calculate current year surplus from P&L accounts in Ledger
    // Income is stored as negative (credit), expenses as positive (debit)
    let currentYearSurplus = 0;
    for (const ledger of ledgerRecords) {
      if (ledger.type === 'INC') {
        currentYearSurplus -= ledger.balance; // Income is negative in ledger, flip it
      } else if (ledger.type === 'EXP') {
        currentYearSurplus -= ledger.balance; // Expenses reduce profit
      }
    }

    return {
      companyName,
      accounts: balanceSheetAccounts,
      currentYearSurplus,
      priorYearSurplus: undefined,
    };
  } catch (error) {
    console.warn("Warning: Failed to fetch live data. Using demo data.");
    console.warn(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return createSampleBalanceSheetData();
  }
}
