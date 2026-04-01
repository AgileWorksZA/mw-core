# Implementation Prompt — Reports, Enquiries & Dashboards (Spec 49)

## Context
You are building the web frontend for MoneyWorks Gold accounting software. The stack is SvelteKit (frontend at port 3041) with an Elysia JS backend API at port 3400 (base path `/api/v1`). Refer to `ui-spec/49-reports-and-enquiries-deep-dive.md` for the full desktop reference spec. Study the existing routes in `packages/web/src/routes/` for patterns.

## What Exists Already
- Dashboard sidebar navigation items exist but may not have full implementations
- `$lib/api/client` has `apiGet`, `apiPost`, `apiEvalBatch` utilities
- Account, Name, Transaction table endpoints are available

## What Needs Building

### Priority 1: Account Enquiry (New Route)

**Route: `/enquiries/account`**

An interactive account drill-down screen with three tabs.

**Header:**
- Select dropdown: "Account Code" (default), other lookup modes
- Account code text input with lookup (search icon)
- "Calculate Now" button
- "Include Unposted" checkbox
- Shows account name and Current Balance after selection

**Tab 1 — Balances:**
- Table with columns: Period, Opening, This Period, Closing, Budget, Annual Budget, Amt Left
- Show all periods for current and prior financial year
- Data: Use `apiEvalBatch` with `GetBalance` expressions for each period

**Tab 2 — Graph:**
- Line/bar chart of account balance over time
- from/to period selectors
- "Show Average" and "Show Budgets" checkboxes
- Toggle between line and bar chart
- Use Recharts or Chart.js

**Tab 3 — Movements:**
- Transaction list for the account
- Columns: Reference, Type, Date, Status, Pd, Description, Analysis, Tax, Debit, Credit
- from/to period selectors
- Related button (opens related transaction)
- Sum button (shows running total)

**`+page.server.ts`:**
```typescript
// Load account list for dropdown/autocomplete
const accounts = await apiGet('/tables/account', { token, limit: 500, fields: 'Code,Description,System' });
// If account code provided in URL params, calculate balances
```

**`+page.svelte`:**
- Reactive: when account code changes, fetch balances and movements
- Use `invalidateAll()` or client-side fetch for tab data

### Priority 2: Trial Balance (New Route)

**Route: `/reports/trial-balance`**

**Settings Form:**
- Omit Zero Balances checkbox (default: checked)
- Show Departments checkbox
- By Accountant Code checkbox
- Print Movements checkbox
- Include Unposted checkbox
- Show Closing Balance Only checkbox
- From period dropdown, To period dropdown
- Title text field (default: "Trial Balance")

**Report Output:**
- Table: Code, Description, Opening (Debit/Credit), Movement (Debit/Credit), Closing (Debit/Credit)
- Totals row at bottom — all columns must balance (Opening Debit = Opening Credit, etc.)
- "Preview" generates the report, "PDF" exports

**`+page.server.ts`:**
```typescript
// Fetch all accounts
const accounts = await apiGet('/tables/account', { token, limit: 500 });

// For each account, calculate Opening and Closing balances
const balanceExprs: Record<string, string> = {};
const fromDate = '20240201'; // From period start
const toDate = '20250131';   // To period end

for (const a of accounts.data) {
  balanceExprs[`${a.Code}_open`] = `GetBalance("AccountCode=\\"${a.Code}\\"", "${fromDate}")`;
  balanceExprs[`${a.Code}_close`] = `GetBalance("AccountCode=\\"${a.Code}\\"", "${toDate}")`;
}
const balances = await apiEvalBatch(balanceExprs, token);

// Movement = Closing - Opening
// Debit/Credit split: positive = Debit for assets/expenses, Credit for liabilities/equity/income
```

### Priority 3: Profit and Loss Report (New Route)

**Route: `/reports/profit-and-loss`**

**Settings Form:**
- Show Account Codes checkbox
- Time Interval dropdown: Monthly, Yearly, Quarterly
- Period selector
- Title text field

**Report Output:**
Structure follows the standard P&L format:
```
Sales
  [Sales accounts]
  Total Sales

Cost of Goods Sold
  [COGS accounts]
  Total COGS

Gross Margin (Sales - COGS)

Other Income
  [Other income accounts]

Net Income (Gross Margin + Other Income)

Expenses
  [Expense accounts]
  Total Expenses

Profit (Loss) (Net Income - Expenses)
```

Columns: Actual, % Sales

**Account categorization:** Use account code ranges:
- 4000-4999: Sales/Income
- 5000-5999: Other Income
- 6000-6999: Cost of Goods Sold / Purchases
- 7000-7999: Expenses

### Priority 4: Balance Sheet Report (New Route)

**Route: `/reports/balance-sheet`**

**Settings Form:**
- Show Account Codes checkbox
- Currency dropdown
- Period selector
- Title text field

**Report Output:**
```
Current Assets → Fixed Assets → Total Assets
Current Liabilities → Equity (including Current Earnings) → Total Capital Funds
Liabilities and Equity (must equal Total Assets)
```

Columns: This Year, Last Year End

**Account categorization:** Use account System or code ranges:
- 1000-1499: Current Assets
- 1500-1999: Fixed Assets (or use account flags)
- 2000-2999: Liabilities
- 3000-3999: Equity

### Priority 5: Aged Receivables Report (New Route)

**Route: `/reports/aged-receivables`**

**Settings Form:**
- Age By dropdown (Invoice Date, Due Date)
- Show Invoices checkbox
- Show Tax checkbox
- By Currency checkbox
- Subtotal dropdown
- Use Built-in Mode checkbox

**Report Output:**
- Table: Code, Phone, Name, 3 months+, 2 months, 1 month, Current, Total
- Totals row at bottom
- Footer: "Accounts Receivable as at {period}"

**`+page.server.ts`:**
```typescript
// Fetch debtors
const names = await apiGet('/tables/name', {
  token, filter: 'CustomerType>="2"', limit: 500
});

// Fetch outstanding invoices for aging calculation
const invoices = await apiGet('/tables/transaction', {
  token,
  filter: 'Type="DI" AND Status="P" AND Outstanding>0',
  limit: 5000
});

// Calculate aging buckets based on invoice dates vs report date
```

### Priority 6: Customer Sales Enquiry (New Route)

**Route: `/enquiries/customer-sales`**

**Header:**
- Select: Name Code dropdown, text input, lookup, Calculate Now
- Include Unposted checkbox
- Sales/Purchases filter dropdown

**Four tabs:**
1. **Monthly** — Period, Value table (sales per month)
2. **Graph** — Chart of sales over time
3. **Movements** — Individual invoice/transaction list
4. **Orders** — Outstanding orders for customer

### Priority 7: Overview Dashboard (Enhance Existing)

**Route: `/dashboard/overview` (or enhance existing Overview)**

Four chart panels in 2×2 grid:

1. **Profit** — Combined bar+line: Income (bars), Expenses (line), Profit (line) by month
2. **Current Ratio** — Line chart: Current Assets / Current Liabilities by month
3. **Bank Balances** — Bar chart: bank account balances by month
4. **Debtors** — Bar chart: aging buckets (3 months+, 2 months, 1 month, Current)

Use Recharts or Chart.js. All charts need period data calculated via `apiEvalBatch`.

### Priority 8: Reports Index (New Route)

**Route: `/reports`**

Landing page listing all available reports organized by category. Each report links to its settings/generation page.

Categories to display:
- Audit, Balance Sheet, Budget, Cash, Dashboard Reports, Fixed Assets, Foreign Currency, General Ledger, GST/HST/QST, Job Costing, Job Tagged Transactions, Profit and Loss, Purchases, Receivables & Payables, Sales, Security, Stock and Inventory, Trial Balance

Start with the 5 core reports implemented above, show remaining as "Coming Soon" with disabled links.

## Technical Notes

### Period Handling
- Periods are formatted as "Mon:YYYY/YY" (e.g., "Jan:2024/25")
- Financial year runs from a configurable start month
- API dates use YYYYMMDD format for `GetBalance` expressions
- Period dropdown should show all periods for current + prior year

### Balance Calculation
```typescript
// Get balance at a specific date
const expr = `GetBalance("AccountCode=\\"1000\\"", "20250131")`;

// Get balance for a period range
const openExpr = `GetBalance("AccountCode=\\"1000\\"", "20250101")`;
const closeExpr = `GetBalance("AccountCode=\\"1000\\"", "20250131")`;
// Movement = close - open
```

### Account Type Detection
Accounts have a `System` field and code ranges that determine their type:
- Bank accounts: `System === 'BK'` or `System === 'CC'`
- Asset accounts: codes starting with 1
- Liability accounts: codes starting with 2
- Equity accounts: codes starting with 3
- Income accounts: codes starting with 4
- Other Income: codes starting with 5
- COGS/Purchases: codes starting with 6
- Expense accounts: codes starting with 7

### Chart Libraries
Use consistent charting across all reports and dashboards. Recommended: Recharts (already available) or install Chart.js.

### Debit/Credit Logic
- Assets (1xxx) and Expenses (6xxx, 7xxx): Positive = Debit
- Liabilities (2xxx), Equity (3xxx), Income (4xxx, 5xxx): Positive = Credit
- Trial Balance must show the natural debit/credit split

### SvelteKit Patterns
- Use `$props()` for page data
- Use `$state()` and `$derived()` for reactive state
- Tab navigation: use `<button>` elements with active state
- Use `showToast()` and `showError()` from `$lib/stores/toast`
- Use `PageHeader` component
- Use `CurrencyDisplay` for monetary values
- Charts: create reusable chart components

### Styling
- Tailwind CSS
- Report output: use monospace font for tabular number alignment
- Use consistent table styling from existing routes
- Charts: consistent color palette (red for income/bars, blue for expenses, yellow/gold for profit)

## File Structure
```
packages/web/src/routes/
  reports/
    +page.svelte              (reports index/landing page)
    trial-balance/
      +page.server.ts         (fetch accounts, calculate balances)
      +page.svelte             (settings form + report output)
    profit-and-loss/
      +page.server.ts
      +page.svelte
    balance-sheet/
      +page.server.ts
      +page.svelte
    aged-receivables/
      +page.server.ts
      +page.svelte
  enquiries/
    account/
      +page.server.ts         (fetch account list, initial data)
      +page.svelte             (interactive enquiry with 3 tabs)
    customer-sales/
      +page.server.ts
      +page.svelte             (interactive enquiry with 4 tabs)
  dashboard/
    overview/
      +page.server.ts         (fetch all dashboard data)
      +page.svelte             (4-chart grid)
```

## Deliverables
1. Account Enquiry with Balances/Graph/Movements tabs
2. Trial Balance report with settings and output
3. Profit and Loss report
4. Balance Sheet report
5. Aged Receivables report
6. Customer Sales Enquiry
7. Overview Dashboard with 4 charts
8. Reports index page
9. All using real API data (no mock data)
10. Error handling and toast notifications
11. Responsive layout

Start with Priority 1 (Account Enquiry) and work down. Commit after each priority is complete.
