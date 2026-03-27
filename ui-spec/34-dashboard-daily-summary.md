# Dashboard: Daily Summary

## Overview
A daily snapshot dashboard showing P&L activity and balance sheet positions with period comparisons. Provides a quick health check of the business for today.

## Access Points
- Navigator: Dashboard → Daily Summary

## Layout

### Header
"Daily Dashboard for {date}" with company name

### Section 1: Value of Transactions Entered

Three comparison columns: **Today** (exact date), **Previous 7 Days**, **Previous 30 Days**

| Metric | Description |
|--------|-------------|
| Sales | Total sales invoiced |
| Less: Cost of sales | COGS for those sales |
| **Gross Margin** | Sales - COGS |
| Add: Other Income | Non-sales income |
| **Net Income** | Gross Margin + Other Income |
| Less: Other Expenses | Non-COGS expenses |
| **Surplus (Deficit)** | Net Income - Other Expenses (bold, key metric) |
| Gross Margin % | Percentage calculation |
| Orders Booked | Value of new sales orders |

### Section 2: Balances

Four columns: **Balance** (current total), **Today** (change), **7 Day Change**, **30 Day Change**

| Metric | Balance (example) | Description |
|--------|-------------------|-------------|
| Current Bank Balances | 8,222 | Sum of all bank accounts |
| Receivables | 52,682 | Total outstanding receivables |
| Payables | 13,250 | Total outstanding payables |

Each row has an icon (cash register for Sales, bank for Bank Balances, people icons for Receivables/Payables).

## Data Source
- Transactions grouped by date ranges
- Balance sheet accounts for current positions
- All data from posted transactions

## Web Modernization Opportunities
- Real-time updates (auto-refresh throughout the day)
- Sparkline mini-charts for trends
- Click-through to transaction details
- Configurable comparison periods
- Add more KPIs (cash runway, DSO, DPO)
