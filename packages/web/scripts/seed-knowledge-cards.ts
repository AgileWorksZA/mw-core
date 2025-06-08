#!/usr/bin/env bun

import { knowledgeDB } from "../app/modules/knowledge-alignment/db/schema.server";

console.log("Seeding knowledge cards...");

// Sample knowledge cards for MoneyWorks
const sampleCards = [
  {
    title: "Understanding Transaction Status Codes",
    summary: "MoneyWorks uses specific status codes to track transaction states throughout their lifecycle",
    content: `MoneyWorks transaction status codes are critical for understanding the state of financial records:

- **OP (Open)**: Unposted transactions that haven't been finalized in the ledger
- **CL (Closed)**: Posted and fully paid/reconciled transactions
- **PA (Partial)**: Partially paid or allocated transactions
- **CA (Cancelled)**: Voided or cancelled transactions
- **DR (Draft)**: Preliminary transactions not yet approved

When searching for "unposted" transactions, always use status:"OP" not status:"unposted".`,
    category: "data-structure",
    priority: "critical",
    tags: ["transactions", "status", "unposted", "invoices"],
    examples: {
      correct: [
        'To find unposted invoices: {"operation": "search", "type": "SI", "status": "OP"}',
        'To find all open transactions: {"operation": "search", "status": "OP"}'
      ],
      incorrect: [
        'Wrong: {"operation": "search", "status": "unposted"}',
        'Wrong: {"operation": "search", "filter": "status=unposted"}'
      ]
    },
    mcpTools: ["transactions"],
    active: true
  },
  {
    title: "MoneyWorks Transaction Type Codes",
    summary: "Complete reference for all transaction type codes used in MoneyWorks",
    content: `MoneyWorks uses two-letter codes to identify transaction types:

**Sales Transactions:**
- SI = Sales Invoice (customer invoice)
- SC = Sales Credit (credit note to customer)
- SR = Sales Receipt (payment from customer)
- SD = Sales Deposit (advance payment from customer)

**Purchase Transactions:**
- PI = Purchase Invoice (supplier bill)
- PC = Purchase Credit (credit from supplier)
- PP = Purchase Payment (payment to supplier)
- PD = Purchase Deposit (advance payment to supplier)

**Banking & Other:**
- BR = Bank Receipt
- BP = Bank Payment
- BT = Bank Transfer
- JN = General Journal
- JC = Journal Correction
- ST = Stock Transfer
- SO = Sales Order
- PO = Purchase Order`,
    category: "data-structure",
    priority: "high",
    tags: ["transactions", "types", "invoices", "bills", "payments"],
    mcpTools: ["transactions"],
    active: true
  },
  {
    title: "Account Type Classifications",
    summary: "MoneyWorks account types determine how accounts behave in financial reports",
    content: `MoneyWorks uses single-letter codes for account types:

**Balance Sheet Accounts:**
- A = Current Asset (e.g., Bank, Accounts Receivable)
- L = Current Liability (e.g., Accounts Payable, GST Collected)
- F = Fixed Asset (e.g., Equipment, Buildings)
- T = Term Liability (e.g., Loans, Mortgages)
- E = Equity (e.g., Retained Earnings, Capital)

**Profit & Loss Accounts:**
- I = Income (e.g., Sales Revenue)
- S = Sales (similar to Income but for product sales)
- X = Expense (e.g., Rent, Utilities)
- C = Cost of Sales (e.g., Cost of Goods Sold)

**Special Types:**
- O = Other Income
- P = Other Expense`,
    category: "concept",
    priority: "high",
    tags: ["accounts", "chart-of-accounts", "types"],
    mcpTools: ["accounts"],
    active: true
  },
  {
    title: "Date Filtering Best Practices",
    summary: "How to properly filter transactions by date in MoneyWorks queries",
    content: `When filtering transactions by date, use the fromDate and toDate parameters:

- Dates must be in YYYY-MM-DD format
- fromDate is inclusive (>=)
- toDate is inclusive (<=)
- For "last month", calculate dates based on today's date
- For fiscal periods, use the period parameter instead

The system will automatically handle date parsing and timezone considerations.`,
    category: "best-practice",
    priority: "medium",
    tags: ["dates", "filtering", "transactions", "search"],
    examples: {
      correct: [
        'Last 30 days: {"fromDate": "2024-12-15", "toDate": "2025-01-14"}',
        'Specific month: {"fromDate": "2024-12-01", "toDate": "2024-12-31"}'
      ],
      incorrect: [
        'Wrong: {"date": "last month"}',
        'Wrong: {"startDate": "2024-12-01", "endDate": "2024-12-31"}'
      ]
    },
    mcpTools: ["transactions"],
    active: true
  },
  {
    title: "MWScript Expression Basics",
    summary: "Essential MWScript expressions for querying MoneyWorks data",
    content: `MWScript is MoneyWorks' proprietary scripting language. Key functions:

**Data Queries:**
- CreateSelection("Table", "Filter") - Create a record selection
- CountSelection(selection) - Count records
- SumSelection(selection, "Field") - Sum field values
- GetFieldValue("Table", "Field", "Filter") - Get single value

**System Functions:**
- GetCompanyName() - Current company name
- GetPeriod() - Current accounting period
- Today() - Current date
- GetVersion() - MoneyWorks version

Always quote string values in filters and use proper field names.`,
    category: "mwscript",
    priority: "medium",
    tags: ["mwscript", "scripting", "expressions", "queries"],
    examples: {
      correct: [
        'Count customers: CountSelection(CreateSelection("Name", "Kind=1"))',
        'Get balance: GetFieldValue("Name", "DBalance", "Code=\'CUST001\'")'
      ]
    },
    active: true
  }
];

// Insert sample cards
for (const card of sampleCards) {
  try {
    const id = knowledgeDB.createCard(card);
    console.log(`✓ Created card: ${card.title} (${id})`);
  } catch (error) {
    console.error(`✗ Failed to create card: ${card.title}`, error);
  }
}

console.log("\nKnowledge cards seeded successfully!");
console.log(`Total cards: ${knowledgeDB.searchCards().length}`);