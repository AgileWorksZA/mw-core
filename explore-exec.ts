import { createSmartClient } from "@moneyworks/data";
import { readFileSync } from "fs";

const config = JSON.parse(readFileSync("mw-config.json", "utf8"));
const client = createSmartClient(config);

function xmlField(xml: string, field: string): string {
  const match = xml.match(new RegExp(`<${field}>(.*?)</${field}>`));
  return match?.[1] || '';
}

async function explore() {
  // Get transaction type distribution
  console.log("=== Transaction Types ===");
  const txnXml = await client.exportWithFormat('Transaction', 'xml-verbose', {}) as string;
  const txnRegex = /<transaction>([\s\S]*?)<\/transaction>/g;
  let match;

  const typeCount: Record<string, number> = {};
  let invoiceCount = 0;
  let invoiceTotal = 0;

  while ((match = txnRegex.exec(txnXml)) !== null) {
    const type = xmlField(match[1], 'type');
    const gross = parseFloat(xmlField(match[1], 'gross')) || 0;
    typeCount[type] = (typeCount[type] || 0) + 1;

    // DII = Debtor Invoice Item (the actual invoices)
    if (type === 'DII') {
      invoiceCount++;
      invoiceTotal += gross;
    }
  }
  console.log("Types found:", typeCount);
  console.log("\nInvoice count (DII):", invoiceCount);
  console.log("Invoice total:", invoiceTotal.toFixed(2));

  // Get bank account balances for cash section
  console.log("\n=== Cash Analysis ===");
  // Get cash received (CR) and cash paid (CP) transactions
  const crCount = typeCount['CR'] || 0;
  const cpCount = typeCount['CP'] || 0;
  console.log("Cash Receipts (CR):", crCount);
  console.log("Cash Payments (CP):", cpCount);

  // Get P&L totals from Ledger with correct type codes
  console.log("\n=== P&L from Ledger ===");
  const ledgerXml = await client.exportWithFormat('Ledger', 'xml-verbose', {}) as string;
  const ledgerRegex = /<ledger>([\s\S]*?)<\/ledger>/g;

  let income = 0, expenses = 0, cos = 0, sales = 0;

  while ((match = ledgerRegex.exec(ledgerXml)) !== null) {
    const type = xmlField(match[1], 'type');
    const balance = parseFloat(xmlField(match[1], 'balance')) || 0;
    const code = xmlField(match[1], 'accountcode');

    if (type === 'IN') {
      income -= balance;
      console.log("  IN " + code + ": " + (-balance));
    } else if (type === 'SA') {
      sales -= balance;
      console.log("  SA " + code + ": " + (-balance));
    } else if (type === 'EX') {
      expenses += balance;
    } else if (type === 'CS') {
      cos += balance;
      console.log("  CS " + code + ": " + balance);
    }
  }

  console.log("\nTotal Sales (SA):", sales.toFixed(2));
  console.log("Total Other Income (IN):", income.toFixed(2));
  console.log("Total COS (CS):", cos.toFixed(2));
  console.log("Total Expenses (EX):", expenses.toFixed(2));
  console.log("Gross Margin:", (sales - cos).toFixed(2));
  console.log("Net Profit:", (sales + income - cos - expenses).toFixed(2));
}

explore();
