# Dashboard: Ledger Chart

## Overview
Highly configurable financial chart that can visualize any ledger data broken down by multiple dimensions. This is the most powerful charting tool in MoneyWorks.

## Access Points
- Navigator: Dashboard → Ledger Chart

## Controls (Top Bar)
| Control | Type | Description |
|---------|------|-------------|
| Type | Dropdown | Chart metric: "Trading (Gross) Profit", "Balance Sheet", "Income", "Expenses", etc. |
| Period | Dropdown | Time range: "5 years", "2 years", "1 year", "6 months", etc. |
| Break down by | Dropdown | Dimension: "Account.Category", "Department", "None", etc. |
| Overlay | Dropdown | Additional overlay: "None", "Budget", etc. |

## Chart
- **Type**: Stacked bar chart + line overlay
- **X-axis**: Monthly periods spanning the selected time range (e.g., Apr:2022/23 through Jan:2024/25)
- **Y-axis**: Dollar amounts (auto-scaled)
- **Series** (example for Trading Profit):
  - Cost of Sales (red/pink bars, negative direction)
  - Sales (blue bars, positive direction)
  - Profit (black line overlay with data points)
- **Legend**: Top-right showing series names with colour indicators

## Data Source
- Configurable — depends on Type selection
- Aggregated by Account.Category (or other dimension)
- Budget overlay when selected

## Web Modernization Opportunities
- Interactive hover/click with tooltips
- Drill-down from bar segments to transaction list
- Save chart configurations as presets
- Export as image or data
- More chart types (waterfall, treemap, etc.)
- Real-time data refresh
