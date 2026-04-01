# Reports, Enquiries & Dashboards Deep Dive

> Captured from live MoneyWorks Gold desktop exploration (2026-03-30)
> Includes live data from Acme Widgets Gold.moneyworks

---

## Reports Menu — Full Hierarchy

The Reports menu contains 16 top-level categories (13 with submenus, 3 standalone) plus 4 shortcut reports at the top level.

### Top-Level Structure

| Item | Type | Notes |
|------|------|-------|
| Index to Reports | Action | Opens report index |
| Aged Receivables | Shortcut | Quick access (also in Receivables & Payables) |
| **Audit** | Submenu | 12 reports |
| **Balance Sheet** | Standalone | Single report |
| **Budget** | Submenu | 9 reports |
| **Cash** | Submenu | 8 reports (1 nested submenu) |
| **Dashboard Reports** | Submenu | 6 reports |
| **Fixed Assets** | Submenu | 2 reports |
| **Foreign Currency** | Submenu | 2 reports |
| **General Ledger** | Submenu | 9 reports |
| **GST/HST/QST Report (Canada)** | Standalone | Single report |
| **Job Costing** | Submenu | 6 reports |
| **Job Tagged Transactions** | Submenu | 4 reports |
| **Profit and Loss** | Submenu | 14+ reports (1 nested submenu) |
| Profit and Loss Comparison | Shortcut | Quick access |
| Profit and Loss for Month | Shortcut | Quick access |
| Profit and Loss for Year to Date | Shortcut | Quick access |
| **Purchases** | Submenu | 2 reports |
| **Receivables & Payables** | Submenu | 3 reports |
| **Sales** | Submenu | 4 reports (2 nested submenus) |
| **Sales Tax Report (Canada)** | Standalone | Single report |
| **Security** | Submenu | 2 reports |
| **Stock and Inventory** | Submenu | 14 reports |
| **Trial Balance** | Standalone | Single report |

---

### Audit

| Report | Description |
|--------|-------------|
| Backdated Transactions | Transactions entered with past dates |
| Bank Reconciliation Status | Status of bank reconciliation |
| Daily Transaction Summary | Summary of transactions by day |
| Ledger Report | Detailed ledger entries |
| Overpayments Report | Overpayment detection |
| Receivables and Payables Ledger | Combined R&P ledger |
| Recurring Transactions | List of recurring transactions |
| Tax by Currency | Tax analysis by currency |
| Tax Coding | Tax code validation |
| Transaction Postings | Transaction posting details |
| Trial Balance to Date | Trial balance up to specific date |

### Balance Sheet

Single report (no submenu). Settings dialog:
- **Options:** Show Account Codes, Currency dropdown
- **Period:** Single period selector
- **Output to:** Preview dropdown
- **Title:** "Balance Sheet"
- Page thumbnail with Title, Date, Page checkboxes

**Output structure:**
```
Current Assets
  1000  Main Bank Account           8,365.31
  1300  Stock On Hand               2,455.20
  1500  Accounts Receivable        52,681.57
  Total Current Assets             63,502.08

Fixed Assets
  1720  Office Equipment            5,771.74
  1730  Plant                      33,241.32
  Total Fixed Assets               39,013.06

Total Assets                      102,515.14

Current Liabilities
  2400  GST Received                   18.71
  2500  Accounts Payable           13,250.01
  2800  GST Holding                 6,712.28
  Total Current Liabilities        19,981.00

Equity
  3000  Authorised Capital          5,000.00
  3400  Retained Earnings          52,219.69
  3510  Drawings                  (41,250.00)
  Current Earnings                 66,564.45
  Total Equity                     82,534.14

Total Capital Funds                82,534.14

Liabilities and Equity            102,515.14
```

Columns: This Year, Last Year End

### Budget

| Report |
|--------|
| All Account Budgets for Financial Year |
| All Account Budgets for Next Year |
| All Account Budgets |
| Budgets by Category |
| Committed Budget |
| Fixed Assets Budgets for Financial Year |
| Profit Budget |
| Profit Financial Year Budgets |
| Profit Next Year Budgets |

### Cash

| Report | Notes |
|--------|-------|
| Bank Balances | |
| Bank Register | |
| **Banking** | Submenu (not explored) |
| Cash Flow Report | |
| Cash Forecast | |
| Cash Projection | |
| Statement of Cash Flows - legacy | Older format |
| Statement of Cash Flows | Current format |

### Dashboard Reports

| Report |
|--------|
| Daily Summary |
| Executive Summary |
| Income and Expense Categories |
| Ledger Chart Period by Type |
| Overview |
| Year over Year Income |

### Fixed Assets

| Report |
|--------|
| Asset Register |
| Asset Report |

### Foreign Currency

| Report |
|--------|
| Exchange Rates |
| Unrealised Gain and Loss |

### General Ledger

| Report |
|--------|
| All Account Actuals for 12 Months |
| All Account Balances for Financial Year |
| All Account Movements for Financial Year |
| All Accounts for Month |
| All Accounts for Year |
| Chart of Accounts |
| Department Listing |
| Fixed Asset Movements for Financial Year |
| Fixed Assets for Month and YTD |

### Job Costing

| Report |
|--------|
| Job Account Summary |
| Job Cost Centre Summary |
| Job Detailed |
| Job P&L Detail |
| Job P&L Summary |
| Job Resource Summary |

### Job Tagged Transactions

| Report |
|--------|
| Job Allocations |
| JT Account |
| JT Resource Usage |
| JT Resource |

### Profit and Loss

| Report | Notes |
|--------|-------|
| Category Monthly | |
| Category Yearly | |
| Cumulative Profit and Loss for Period Range | |
| Department Profit and Loss for Month | |
| Department Profit and Loss for Year to Date | |
| Profit Actuals for Rolling 12 Months | |
| Profit and Loss for Date Range | |
| Profit and Loss for Five Years | |
| Profit Forecast for Financial Year | |
| Profit Monthly Comparison | |
| Profit Movements for Financial Year | |
| Profit Yearly Comparison | |
| **Trading Reports** | Submenu (not explored) |

**Profit and Loss for Month** — Settings dialog:
- **Options:** Show Account Codes (checked), Time Interval dropdown (Monthly, Yearly, etc.)
- **Period:** Single period selector (e.g., Jan:2024/25)
- **Output to:** Preview dropdown
- **Title:** "Profit and Loss for Month"

**Output structure:**
```
Sales
  4000  Sales                    124.75        100.0

Cost of Goods Sold
  6000  Purchases                 66.32
  Total Cost of Goods Sold        66.32         53.2

Gross Margin                      58.43         46.8

Other Income
  5210  Interest Received          0.00
  Total Other Income               0.00          0.0

Net Income                        58.43         46.8

Expenses
  4100  Repairs                    0.00
  [... expense accounts ...]
  Total Expenses                 (85.21)       (68.3)

Profit (Loss)                    143.64        115.2
```

Columns: Actual, % Sales

### Purchases

| Report |
|--------|
| Item by Supplier |
| Purchases over Time |

### Receivables & Payables

| Report |
|--------|
| Age by Due Date |
| Aged Payables |
| Aged Receivables |

**Aged Receivables** — Settings dialog:
- **Options:** Age By (dropdown), Show Invoices, Show Tax, By Currency, Subtotal, Use Built-in Mode
- **Output to:** Preview dropdown

**Output structure:**
```
Code     Phone      Name                    3 months+    2 months     1 month    Current      Total
AUTUMN   123-6554   Autumn Fabrix Ltd            0.00        0.00        0.00       0.00       0.00
BROWN    123-9876   Brown Suppliers            478.86    2,885.45    2,885.45       0.00   6,249.76
[...]
CAD Total                                   25,550.75   12,569.73   14,561.09       0.00  52,681.57
Accounts Receivable as at Jan:2024/25                                                     52,681.57
```

9 customers shown in Acme Widgets sample data.

### Sales

| Report | Notes |
|--------|-------|
| **By Customer** | Submenu |
| **By Item** | Submenu |
| Commission Report | |
| Top Sales | |

**Sales > By Customer:**
- Customer by Item
- Customer Sales by Month
- Customer Summary

**Sales > By Item:**
- Item by Customer
- Item by Month
- Item Summary

### Security

| Report |
|--------|
| Privileges Summary |
| Reports and Form Access |

### Stock and Inventory

| Report |
|--------|
| Backorder Summary by Customer |
| Backorder Summary by Product |
| Bill of Materials Costing |
| Bill of Materials Report |
| Committed Stock |
| Detailed Stock List |
| Reorder List |
| Serialised Stock |
| Stock by Location |
| Stock History Report |
| Stock on Hand History for Location |
| Stock Valuation Report |
| Stocktake List |
| Stocktake Report |

### Trial Balance

Settings dialog:
- **Options:** Omit Zero Balances (checked by default), Show Departments, By Accountant Code, Print Movements, Include Unposted, Show Closing Balance Only
- **From/To:** Period range selectors (e.g., Jan:2024/25 to Jan:2024/25)
- **Output to:** Preview dropdown
- **Title:** "Trial Balance"
- Page thumbnail with Title, Date, Page checkboxes

**Output structure:**
```
Trial Balance
Acme Widgets Ltd
Report for Period: Jan:2024/25 to Jan:2024/25

Code  Description              Opening          Movement           Closing
                            Debit    Credit   Debit    Credit   Debit     Credit
1000  Main Bank Account    8,221.85    0.00   143.46     0.00   8,365.31    0.00
1300  Stock On Hand        2,521.52    0.00     0.00    66.32   2,455.20    0.00
1500  Accounts Receivable 52,681.57    0.00     0.00     0.00  52,681.57    0.00
[...]
7290  Wages               11,506.25    0.00     0.00     0.00  11,506.25    0.00

Totals:                  492,977.87 492,977.87 209.78  209.78 493,121.33 493,121.33
```

30 accounts shown (with Omit Zero Balances on). Account codes range from 1000-7290.

---

## Report Settings Dialog Patterns

All reports share a common settings dialog structure:

### Standard Elements
1. **Title bar:** "Settings for '{Report Name}'"
2. **Options panel** (left side) — report-specific checkboxes and dropdowns
3. **Preview/Cancel buttons** (top right)
4. **Output to dropdown** — Preview, Print, PDF, Email
5. **Page thumbnail** (bottom right) with:
   - Title checkbox
   - Date checkbox
   - Page checkbox
6. **Title text field** — editable report title

### Common Options by Report Type

| Option | Found In |
|--------|----------|
| Show Account Codes | Balance Sheet, P&L |
| Omit Zero Balances | Trial Balance, Receivables |
| Show Departments | Trial Balance |
| Include Unposted | Trial Balance, Enquiries |
| Time Interval | P&L reports |
| Currency dropdown | Balance Sheet |
| Period selector(s) | All reports |
| From/To range | Trial Balance, movements reports |
| Age By dropdown | Aged Receivables |
| Show Invoices | Aged Receivables |
| Show Tax | Aged Receivables |
| By Currency | Aged Receivables |
| Subtotal | Aged Receivables |
| Use Built-in Mode | Aged Receivables |

### Preview Window Toolbar

All report previews share a common toolbar:
- **Print** — send to printer
- **PDF** — export as PDF
- **Email** — email the report
- **Zoom Out / Zoom In** — adjust preview zoom
- **Fit** — fit to window
- **Own Window** — pop out to separate window
- **Refresh** — regenerate the report
- **Search** — text search within report
- **Page navigation** — "Page N of M" with prev/next

---

## Enquiries Menu

The Enquiries menu provides 5 drill-down enquiry screens:

| Enquiry | Shortcut | Description |
|---------|----------|-------------|
| Account Enquiry | ⌘E | GL account drill-down |
| Payments History | ⌥⇧⌘H | Payment history lookup |
| Item Sales | ⌘7 | Item sales drill-down |
| Customer Sales | ⌘8 | Customer sales drill-down |
| Stock Enquiry | ⌘9 | Stock/inventory lookup |

### Account Enquiry (⌘E)

**Title:** Account Enquiry

**Header:**
| Element | Description |
|---------|-------------|
| Select dropdown | "Account Code" (could also select by name, etc.) |
| Code text field | Enter account code (e.g., "1000") |
| Lookup button | Search for accounts |
| Calculate Now | Refresh/calculate data |
| Include Unposted | Checkbox |

After entering an account code, shows:
- **Account Name** (e.g., "Main Bank Account")
- **Current Balance** (e.g., 8,365.31)

**Three tabs:**

#### Balances Tab
| Column | Description |
|--------|-------------|
| Period | Accounting period (e.g., Jan:2024/25) |
| Opening | Opening balance for period |
| This Period | Movement during period |
| Closing | Closing balance for period |
| Budget | Budget for period |
| Annual Budget | Annual budget amount |
| Amt Left | Budget remaining |

Shows all periods for the financial year and prior year. Toolbar: Page Setup, Print.

#### Graph Tab
- Line/bar chart of account balance over time
- **from/to** period selectors
- **Show Average** checkbox
- **Show Budgets** checkbox
- Line chart / Bar chart toggle icons
- Toolbar: Page Setup, Print, Copy

#### Movements Tab
Shows individual transactions affecting the account.

| Column | Description |
|--------|-------------|
| Reference | Transaction reference number |
| Type | Transaction type (e.g., Rcpt) |
| Date | Transaction date (YYYY-MM-DD format) |
| Status | P = Posted |
| Pd | Accounting period |
| Description | Transaction description |
| Analysis | Analysis code |
| Tax | Tax amount |
| Debit | Debit amount |
| Credit | Credit amount |

- **from/to** period selectors
- Toolbar: Page Setup, Print, Related, Sum

### Customer Sales Enquiry (⌘8)

**Title:** Customer Sales Enquiry

**Header:**
| Element | Description |
|---------|-------------|
| Select dropdown | "Name Code" |
| Code text field | Enter customer code |
| Lookup button | Search for customers |
| Calculate Now | Refresh/calculate |
| Include Unposted | Checkbox |
| Sales dropdown | Filter type (Sales, could switch to other transaction types) |

**Four tabs:**

#### Monthly Tab
| Column | Description |
|--------|-------------|
| Period | Accounting period |
| Value | Sales value for that period |

#### Graph Tab
Chart visualization of sales over time.

#### Movements Tab
Individual sales transactions for the selected customer.

#### Orders Tab
Outstanding orders for the selected customer.

### Item Sales Enquiry (⌘7)

Similar structure to Customer Sales Enquiry but keyed by product/item code.

### Stock Enquiry (⌘9)

Stock level and movement enquiry for inventory items.

### Payments History (⌥⇧⌘H)

Payment history lookup — tracks payment history for customers/suppliers.

---

## Dashboards

The sidebar Navigation section lists 7 dashboard views:

### Overview Dashboard

**Title:** Company Overview — "Acme Widgets Ltd, Year to Jan:2024/25"

Four chart panels in a 2×2 grid:

1. **Profit** (top-left)
   - Combined bar + line chart
   - Three series: Income (red bars), Expenses (blue line), Profit (yellow line)
   - X-axis: months (F, M, A, M, J, J, A, S, O, N, D, J)
   - Y-axis: dollar amounts (-10,000 to 70,000)

2. **Current Ratio** (top-right)
   - Line chart showing current ratio over months
   - X-axis: Feb through Jan
   - Y-axis: ratio (0 to 4)

3. **Bank Balances: Current Accounts** (bottom-left)
   - Bar chart for each bank account (Account 1000)
   - X-axis: months
   - Y-axis: dollar amounts (0 to 50,000)

4. **Debtors** (bottom-right)
   - Bar chart with aging buckets
   - X-axis: 3 months+, 2 months, 1 month, Current
   - Y-axis: dollar amounts (-40,000 to 80,000)

### Income and Expenses Dashboard

Detailed breakdown of income and expense accounts.

### Year over Year Income Dashboard

Comparison of income across financial years.

### Ledger Chart Dashboard

Visual chart of the chart of accounts.

### Sales Explorer Dashboard

Sales analysis with drill-down capabilities.

### Daily Summary Dashboard

Day-by-day transaction summary.

### Calendar Dashboard

Calendar-based view of financial events.

---

## API Mapping for Reports

### Report Generation Approach

Reports in the desktop app are rendered server-side. For the web frontend, we need a BFF (Backend-for-Frontend) approach:

1. **Data-driven reports** — Fetch raw data via API, render in the browser
   - Trial Balance: Fetch all accounts with `apiGet('/tables/account')`, calculate balances with `apiEvalBatch`
   - Aged Receivables: Fetch names with `filter: 'CustomerType>="2"'`, calculate aging from outstanding invoices
   - P&L: Fetch income/expense accounts, calculate period movements
   - Balance Sheet: Fetch all accounts, categorize by type

2. **Expression-based calculations** — Use `apiEvalBatch` for complex calculations
   - `GetBalance("AccountCode=\"1000\"", "20250131")` — account balance at date
   - Period-based balance calculations
   - Aging bucket calculations

3. **Enquiry screens** — Direct API queries
   - Account Enquiry: `apiGet('/tables/account')` + transaction list
   - Customer Sales: `apiGet('/tables/name')` + filtered transaction list
   - Movements: `apiGet('/tables/transaction', { filter: 'AccountCode="1000"' })`

### Key API Patterns

```typescript
// Trial Balance
const accounts = await apiGet('/tables/account', { token, limit: 500 });
const balanceExprs: Record<string, string> = {};
for (const account of accounts.data) {
  balanceExprs[`${account.Code}_open`] = `GetBalance("AccountCode=\\"${account.Code}\\"", "${fromDate}")`;
  balanceExprs[`${account.Code}_close`] = `GetBalance("AccountCode=\\"${account.Code}\\"", "${toDate}")`;
}
const balances = await apiEvalBatch(balanceExprs, token);

// Aged Receivables
const names = await apiGet('/tables/name', { token, filter: 'CustomerType>="2"', limit: 500 });
// Calculate aging from transaction data or use Expression evaluator

// P&L
// Fetch income accounts (4xxx) and expense accounts (5xxx, 6xxx, 7xxx)
// Calculate period movements using GetBalance with period start/end dates

// Account Enquiry - Movements
const transactions = await apiGet('/tables/transaction', {
  token,
  filter: `AccountCode="${accountCode}"`,
  limit: 1000
});
```

---

## Report Setting Types

Reports can be categorized by their settings dialog pattern:

### Single Period Reports
- Balance Sheet
- P&L for Month
- Aged Receivables

### Period Range Reports
- Trial Balance (From/To)
- P&L for Date Range
- Account Enquiry movements

### Time Series Reports
- All Account Actuals for 12 Months
- Rolling 12 Months
- Monthly Comparison
- Yearly Comparison

### Filter-Based Reports
- By Customer/Item
- By Department
- By Category

---

## Total Report Count

Approximate total: **80+ distinct reports** across all categories.

| Category | Count |
|----------|-------|
| Audit | 11 |
| Balance Sheet | 1 |
| Budget | 9 |
| Cash | 8+ |
| Dashboard Reports | 6 |
| Fixed Assets | 2 |
| Foreign Currency | 2 |
| General Ledger | 9 |
| GST/HST/QST | 1 |
| Job Costing | 6 |
| Job Tagged Transactions | 4 |
| Profit and Loss | 14+ |
| Purchases | 2 |
| Receivables & Payables | 3 |
| Sales | 8 |
| Sales Tax | 1 |
| Security | 2 |
| Stock and Inventory | 14 |
| Trial Balance | 1 |
| **Total** | **~92** |
