# Dashboard: Overview

## Overview
The Company Overview dashboard provides a high-level snapshot of business health with four key charts.

## Access Points
- Navigator: Dashboard → Overview

## Layout
Title: "Company Overview" with subtitle "Acme Widgets Ltd, Year to Jan:2024/25"

Four charts in a 2x2 grid:

### Top-Left: Profit
- **Type**: Combined bar + line chart
- **X-axis**: Months (e.g., F, M, A, M, J, J, A, S, O, N, D, J)
- **Y-axis**: Dollar amount
- **Series**:
  - Income (pink/red bars)
  - Expenses (blue line with data points)
  - Profit (yellow/gold line with data points)
- **Scale**: Configurable, shown example ranges from -10,000 to 70,000

### Top-Right: Current Ratio
- **Type**: Line chart
- **X-axis**: Months (Feb through Jan)
- **Y-axis**: Ratio value (0 to 4+)
- **Series**: Single line (coral/salmon colour) showing current ratio over time
- **Purpose**: Liquidity indicator (current assets / current liabilities)

### Bottom-Left: Bank Balances: Current Accounts
- **Type**: Bar chart
- **X-axis**: Months
- **Y-axis**: Dollar amount
- **Series**: Bar per bank account (legend shows account codes, e.g., "1000")
- **Colour**: Pink/red bars

### Bottom-Right: Debtors
- **Type**: Bar chart (aging buckets)
- **X-axis**: Aging categories: "3 months +", "2 months", "1 month", "Current"
- **Y-axis**: Dollar amount (can show negative for credits)
- **Colour**: Pink/red bars
- **Purpose**: Quick view of debtor aging health

## Interaction
- Charts are display-only (no drill-down from dashboard)
- Period can be adjusted (arrow buttons next to period label)
- Data refreshes from posted transactions
