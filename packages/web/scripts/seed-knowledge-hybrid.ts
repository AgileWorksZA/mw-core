#!/usr/bin/env bun

import { knowledgeDB } from "../app/modules/knowledge-alignment/db/schema.server";

console.log("Seeding Knowledge Alignment System with hybrid approach examples...");

// Clear existing data
console.log("Clearing existing data...");
const existingCards = knowledgeDB.searchCards();
for (const card of existingCards) {
  knowledgeDB.deleteCard(card.id);
}

const existingTemplates = knowledgeDB.getAllTemplates();
for (const template of existingTemplates) {
  knowledgeDB.deleteTemplate(template.id);
}

// Comprehensive knowledge cards for hybrid approach
const knowledgeCards = [
  // ===== TOOL COMPANION CARDS =====
  {
    title: "Names Tool: Customer vs Supplier Identification",
    summary: "Companion knowledge for the 'names' MCP tool - explains business context for technical parameters",
    content: `## Understanding Names in MoneyWorks

The 'names' tool queries the Names table which contains all business entities. While the tool description shows you HOW to filter (NameType='C'), this card explains WHY and WHEN.

### Business Context
- **Customers**: Entities you invoice for goods/services (revenue generators)
- **Suppliers**: Entities that invoice you (expense sources)  
- **Both**: B2B relationships where you buy AND sell

### Common Scenarios
1. **Credit Management**: Check customer credit limits before new sales
2. **Cash Flow**: Monitor supplier payment terms
3. **Reconciliation**: Match names to bank statement entries

### Edge Cases
- Employees can be suppliers (expense reimbursements)
- Inter-company entities might need special handling
- Inactive vs deleted entities affect historical reports`,
    category: "tool-companion",
    priority: "high",
    tags: ["names", "customers", "suppliers", "entities", "tool-names"],
    mcpTools: ["names"],
    examples: {
      correct: [
        "Query active customers only: filter=\"NameType='C' AND Active=true\"",
        "Find overdue suppliers: filter=\"NameType='S' AND Balance<0\""
      ],
      incorrect: [
        "Don't use: filter=\"Type='Customer'\" (field doesn't exist)",
        "Avoid: filter=\"Customer=true\" (not how MoneyWorks structures data)"
      ]
    },
    active: true
  },

  {
    title: "Transactions Tool: Understanding Status Codes",
    summary: "Business meaning behind transaction status codes used in the transactions tool",
    content: `## Transaction Lifecycle in MoneyWorks

While the MCP tool uses status codes like 'OP' and 'CL', understanding their business implications is crucial.

### Status Flow
1. **Draft (DR)** → Entry in progress, not affecting accounts
2. **Open (OP)** → Posted but unpaid/unallocated
3. **Partial (PA)** → Partially paid/allocated
4. **Closed (CL)** → Fully paid/allocated
5. **Cancelled (CA)** → Voided, keeping audit trail

### Business Implications
- **OP Invoices**: Money owed to/by you
- **PA Payments**: Follow up on remaining balance
- **CL Transactions**: Historical record, affects reports

### Audit Considerations
- Never delete transactions, use cancel instead
- Status changes create audit log entries
- Backdated status changes may affect closed periods`,
    category: "tool-companion",
    priority: "critical",
    tags: ["transactions", "status", "lifecycle", "tool-transactions"],
    mcpTools: ["transactions"],
    active: true
  },

  // ===== BUSINESS RULES =====
  {
    title: "MoneyWorks Period Locking Rules",
    summary: "Business rules governing when accounting periods can be modified",
    content: `## Period Locking in MoneyWorks

### Key Rules
1. **Locked Periods**: No transaction modifications allowed
2. **Restricted Periods**: Only authorized users can modify
3. **Open Periods**: Normal transaction entry

### Business Impact
- Ensures financial statement integrity
- Prevents accidental historical changes
- Supports audit compliance

### Common Issues
- "Period is locked" errors
- Need to unlock for corrections
- Year-end adjustment procedures

### Best Practices
- Lock periods after month-end reconciliation
- Document any unlocking with reason
- Use journal entries for prior period adjustments`,
    category: "business-rule",
    priority: "high",
    tags: ["periods", "locking", "compliance", "audit"],
    active: true
  },

  // ===== CONCEPTS =====
  {
    title: "MoneyWorks Double-Entry Accounting",
    summary: "Core concept of how MoneyWorks maintains balanced books",
    content: `## Double-Entry Principles in MoneyWorks

### Fundamental Rule
Every transaction affects at least two accounts, maintaining the equation:
**Assets = Liabilities + Equity**

### Account Types & Normal Balances
- **Assets**: Debit balance (increases with debits)
- **Liabilities**: Credit balance (increases with credits)
- **Equity**: Credit balance
- **Income**: Credit balance
- **Expenses**: Debit balance

### How MoneyWorks Enforces This
1. Transaction entry requires balancing debits/credits
2. Automatic double-entry for invoices/bills
3. Journal entries must balance to post

### Practical Examples
- Sales Invoice: Debit AR, Credit Income
- Purchase Payment: Debit Expense, Credit Bank
- Depreciation: Debit Expense, Credit Asset`,
    category: "concept",
    priority: "high",
    tags: ["accounting", "double-entry", "fundamentals", "concepts"],
    active: true
  },

  // ===== WORKFLOWS =====
  {
    title: "Month-End Closing Workflow",
    summary: "Step-by-step process for closing accounting periods in MoneyWorks",
    content: `## Month-End Closing Process

### Pre-Closing Checklist
1. Post all transactions for the period
2. Complete bank reconciliations
3. Review suspense accounts
4. Process recurring transactions

### Closing Steps
1. **Run Trial Balance**: Verify debits = credits
2. **Review GL**: Check for unusual entries
3. **Reconcile Subledgers**: AR/AP match control accounts
4. **Post Adjustments**: Accruals, prepayments
5. **Generate Reports**: P&L, Balance Sheet
6. **Lock Period**: Prevent changes

### Post-Closing
- Backup database
- Distribute reports
- Plan for next period

### Common Issues
- Unreconciled transactions
- Missing accruals
- Inter-company balancing`,
    category: "workflow",
    priority: "high",
    tags: ["month-end", "closing", "workflow", "procedures"],
    active: true
  },

  // ===== COMMON MISTAKES =====
  {
    title: "Avoid These MoneyWorks Mistakes",
    summary: "Common errors that lead to data integrity issues",
    content: `## Top MoneyWorks Mistakes to Avoid

### 1. Deleting Instead of Cancelling
**Wrong**: Deleting posted transactions
**Right**: Use cancel/void to maintain audit trail

### 2. Mixing Tax Codes
**Wrong**: Using wrong GST/VAT codes
**Right**: Verify tax code before posting

### 3. Wrong Period Entry
**Wrong**: Backdating into locked periods
**Right**: Use journal entries with proper documentation

### 4. Duplicate Entries
**Wrong**: Re-entering without checking
**Right**: Search before creating new records

### 5. Unbalanced Journals
**Wrong**: Forcing unbalanced entries
**Right**: Ensure debits = credits always

### Prevention Tips
- Use templates for repetitive entries
- Regular reconciliation catches errors early
- Train users on proper procedures`,
    category: "common-mistake",
    priority: "high",
    tags: ["mistakes", "errors", "best-practices", "training"],
    active: true
  },

  // ===== DATA STRUCTURES =====
  {
    title: "MoneyWorks Database Relationships",
    summary: "How tables connect in the MoneyWorks schema",
    content: `## Key Table Relationships

### Core Relationships
1. **Names ↔ Transactions**: Via NameCode field
2. **Accounts ↔ Transactions**: Via AccountCode in detail lines
3. **Products ↔ Transaction Details**: Via ProductCode

### Important Links
- Transaction.OurRef: Unique transaction identifier
- Detail.ParentTrans: Links to parent transaction
- Name.Code: Primary key for entities

### Referential Integrity
- Can't delete Names with transactions
- Can't delete Accounts in use
- Products can be inactive but not deleted

### Query Optimization
- Index on frequently searched fields
- Use appropriate joins for reports
- Avoid SELECT * for performance`,
    category: "data-structure",
    priority: "medium",
    tags: ["database", "schema", "relationships", "technical"],
    active: true
  },

  // ===== TROUBLESHOOTING =====
  {
    title: "Diagnosing Transaction Imbalances",
    summary: "How to find and fix out-of-balance transactions",
    content: `## Troubleshooting Transaction Imbalances

### Symptoms
- "Transaction doesn't balance" error
- Trial balance doesn't balance
- Suspense account has balance

### Diagnostic Steps
1. **Check Transaction Details**
   - Sum all debit lines
   - Sum all credit lines
   - Verify they match

2. **Common Causes**
   - Rounding errors in calculations
   - Missing detail lines
   - Incorrect tax calculations
   - Currency conversion issues

3. **Using MWScript**
   \`\`\`
   GetFieldValue("Transaction", "Gross", "OurRef='INV12345'")
   SumSelection(CreateSelection("Detail", "ParentTrans='INV12345'"), "Amount")
   \`\`\`

### Resolution
- Identify missing/incorrect amounts
- Adjust via journal entry if posted
- Recalculate if still draft`,
    category: "troubleshooting",
    priority: "medium",
    tags: ["debugging", "balance", "errors", "troubleshooting"],
    mcpTools: ["transactions", "mwscript"],
    active: true
  },

  // ===== INTEGRATION =====
  {
    title: "Bank Feed Integration Patterns",
    summary: "Best practices for integrating bank feeds with MoneyWorks",
    content: `## Bank Feed Integration

### Matching Strategy
1. **Exact Match**: Amount + date + reference
2. **Fuzzy Match**: Amount within date range
3. **Manual Match**: User intervention required

### Common Patterns
- **Receipts**: Match to open invoices
- **Payments**: Match to bills or allocate to expenses
- **Fees**: Auto-create expense transactions

### Data Mapping
- Bank description → MoneyWorks reference
- Bank date → Transaction date (consider clearance)
- Bank amount → Gross amount (check signs)

### Error Handling
- Duplicate detection
- Unmatched transactions queue
- Reconciliation differences`,
    category: "integration",
    priority: "medium",
    tags: ["banking", "integration", "automation", "feeds"],
    active: true
  },

  // ===== MWSCRIPT =====
  {
    title: "MWScript for Custom Validations",
    summary: "Using MWScript to enforce business rules",
    content: `## Custom Validation with MWScript

### Before-Post Validations
\`\`\`mwscript
// Prevent posting if customer over credit limit
If(GetFieldValue("Name", "Balance", "Code=[@NameCode]") + [@Gross] > 
   GetFieldValue("Name", "CreditLimit", "Code=[@NameCode]"), 
   Abort("Customer exceeds credit limit"), 
   true)
\`\`\`

### Data Integrity Checks
\`\`\`mwscript
// Ensure project code exists
If(CountSelection(CreateSelection("Project", "Code='[@ProjectCode]'")) = 0,
   Abort("Invalid project code"),
   true)
\`\`\`

### Automated Calculations
\`\`\`mwscript
// Calculate commission on invoice
SetFieldValue("Transaction", "UserNum1", [@Gross] * 0.05, "OurRef=[@OurRef]")
\`\`\`

### Best Practices
- Test in sandbox first
- Document script purpose
- Handle edge cases
- Consider performance impact`,
    category: "mwscript",
    priority: "medium",
    tags: ["mwscript", "scripting", "validation", "automation"],
    active: true
  }
];

// Seed all knowledge cards
const createdCardIds: string[] = [];
for (const card of knowledgeCards) {
  try {
    const created = knowledgeDB.createCard(card);
    createdCardIds.push(created.id);
    console.log(`✓ Created card: ${card.title} (${card.category})`);
  } catch (error) {
    console.error(`✗ Failed to create card: ${card.title}`, error);
  }
}

console.log(`\nCreated ${createdCardIds.length} knowledge cards`);

// Create templates for different use cases
const templates = [
  {
    name: "Tool Companion Cards",
    description: "All cards that provide business context for MCP tools",
    cardIds: createdCardIds.filter((id, index) => 
      knowledgeCards[index].category === "tool-companion"
    ),
    isDefault: false,
    maxTokens: 2000,
  },
  {
    name: "Complete MoneyWorks Knowledge",
    description: "Comprehensive knowledge base including all categories",
    cardIds: createdCardIds,
    isDefault: true,
    maxTokens: 4000,
  },
  {
    name: "Troubleshooting Kit",
    description: "Cards focused on debugging and problem-solving",
    cardIds: createdCardIds.filter((id, index) => 
      ["troubleshooting", "common-mistake", "tool-companion"].includes(knowledgeCards[index].category)
    ),
    isDefault: false,
    maxTokens: 2500,
  },
  {
    name: "Business User Essentials",
    description: "Core concepts and workflows for non-technical users",
    cardIds: createdCardIds.filter((id, index) => 
      ["concept", "workflow", "business-rule", "best-practice"].includes(knowledgeCards[index].category)
    ),
    isDefault: false,
    maxTokens: 3000,
  }
];

console.log("\nCreating templates...");
for (const template of templates) {
  try {
    const created = knowledgeDB.createTemplate(template);
    if (template.isDefault) {
      knowledgeDB.setDefaultTemplate(created.id);
    }
    console.log(`✓ Created template: ${template.name}${template.isDefault ? " (default)" : ""}`);
  } catch (error) {
    console.error(`✗ Failed to create template: ${template.name}`, error);
  }
}

console.log(`\nKnowledge Alignment System seeded successfully!`);
console.log(`Total cards: ${knowledgeDB.searchCards().length}`);
console.log(`Total templates: ${knowledgeDB.getAllTemplates().length}`);
console.log(`\nThe system is now configured for the hybrid approach:`);
console.log(`- Tool Companion cards provide business context for MCP tools`);
console.log(`- Conceptual cards explain MoneyWorks fundamentals`);
console.log(`- Workflow cards guide through procedures`);
console.log(`- Troubleshooting cards help diagnose issues`);