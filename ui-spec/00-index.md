# MoneyWorks Gold — Web Client UI Specification

> Reverse-engineered from MoneyWorks Gold desktop client (macOS)
> Target: Modernized web frontend built against Elysia JS / OpenAPI backend
> Goal: Not a clone — a better-than-desktop experience. These specs capture the functional baseline.

## Document Structure

Each spec file covers a discrete feature area of the application. Files are numbered for reading order but can be consumed independently.

### Application Shell
- [01-app-shell.md](01-app-shell.md) — Global layout, navigation, menu bar, sidebar

### Sales and Income
- [02-quotes.md](02-quotes.md) — Quote creation, listing, processing
- [03-sales-orders.md](03-sales-orders.md) — Sales order management
- [04-sales-invoices.md](04-sales-invoices.md) — Sales invoice creation and management
- [05-receivables.md](05-receivables.md) — Accounts receivable / debtor management
- [06-receipt-batch.md](06-receipt-batch.md) — Batch receipt processing

### Cash and Banking
- [07-banking.md](07-banking.md) — Bank account transactions
- [08-receipts.md](08-receipts.md) — Receipt entry
- [09-payments.md](09-payments.md) — Payment entry
- [10-funds-transfer.md](10-funds-transfer.md) — Inter-account transfers
- [11-bank-reconciliation.md](11-bank-reconciliation.md) — Bank statement reconciliation
- [12-import-bank-statement.md](12-import-bank-statement.md) — Bank statement import

### Purchases and Expenses
- [13-purchase-orders.md](13-purchase-orders.md) — Purchase order management
- [14-receive-goods.md](14-receive-goods.md) — Goods receipt processing
- [15-purchase-invoices.md](15-purchase-invoices.md) — Purchase invoice entry
- [16-payables.md](16-payables.md) — Accounts payable / creditor management
- [17-batch-payments.md](17-batch-payments.md) — Batch payment processing

### Master Data
- [18-customers.md](18-customers.md) — Customer records
- [19-suppliers.md](19-suppliers.md) — Supplier records
- [20-items-inventory.md](20-items-inventory.md) — Items and inventory management
- [21-chart-of-accounts.md](21-chart-of-accounts.md) — General ledger accounts

### Operations
- [22-housekeeping.md](22-housekeeping.md) — Period management, maintenance tasks
- [23-jobs.md](23-jobs.md) — Job/project costing
- [24-assets.md](24-assets.md) — Fixed asset register
- [25-todo.md](25-todo.md) — Task/to-do management

### Enquiries
- [26-sales-enquiry.md](26-sales-enquiry.md) — Customer/sales drill-down
- [27-account-enquiry.md](27-account-enquiry.md) — GL account drill-down
- [28-purchase-enquiry.md](28-purchase-enquiry.md) — Supplier/purchase drill-down

### Dashboards
- [29-dashboard-overview.md](29-dashboard-overview.md) — Overview dashboard
- [30-dashboard-income-expenses.md](30-dashboard-income-expenses.md) — Income & Expenses
- [31-dashboard-yoy-income.md](31-dashboard-yoy-income.md) — Year over Year Income
- [32-dashboard-ledger-chart.md](32-dashboard-ledger-chart.md) — Ledger Chart
- [33-dashboard-sales-explorer.md](33-dashboard-sales-explorer.md) — Sales Explorer
- [34-dashboard-daily-summary.md](34-dashboard-daily-summary.md) — Daily Summary
- [35-dashboard-calendar.md](35-dashboard-calendar.md) — Calendar view

### Reports
- [36-reports.md](36-reports.md) — Report engine, categories, and available reports

### System
- [37-preferences.md](37-preferences.md) — Document and application preferences
- [38-users-security.md](38-users-security.md) — User management and permissions
- [39-import-export.md](39-import-export.md) — Data import/export capabilities

### Deep-Dive: Workflows and Structure
- [42-sub-navigators.md](42-sub-navigators.md) — Detailed workflow maps for Sales, Purchases, Cash & Banking (secondary actions, adjustment paths, cross-links)
- [43-setup-entities.md](43-setup-entities.md) — Categories, Departments, Classifications, Asset Categories, Validation Lists, Auto Allocations, Off-Ledger Values, Period Names, Budgets

### API Integration
- [40-api-mapping.md](40-api-mapping.md) — Desktop activities → Elysia API endpoint mapping
- [41-show-menu-entities.md](41-show-menu-entities.md) — Complete entity registry from Show menu, Tax Rate detail, Job detail, Account Enquiry detail
- [44-screen-api-design.md](44-screen-api-design.md) — BFF screen-level API design: bounded context endpoints for each screen, action POSTs, shared lookups
- [45-data-model-from-api.md](45-data-model-from-api.md) — Real data model from live API: all field names, types, record counts, relationships, sample data
