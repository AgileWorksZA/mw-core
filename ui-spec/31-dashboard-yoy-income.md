# Dashboard: Year over Year Income

## Overview
Compares cumulative income across multiple financial years to show growth trends. Uses a line chart with one series per year.

## Access Points
- Navigator: Dashboard → Year over Year Income

## Layout
Title: "Year over Year Income Comparison" with company name

### Chart
- **Type**: Line chart with data points
- **X-axis**: Months of fiscal year (e.g., Apr, May, Jun... through Mar)
- **Y-axis**: Cumulative income amount
- **Series**: One line per financial year (e.g., 2024/25 in red, 2023/24 in blue, 2022/23 in yellow)
- **Data**: Cumulative — each month's value includes all prior months in that year
- **Scale**: Auto-scales based on data (example shows 0 to 450,000)

### Legend
Top-right corner showing year labels with colour indicators.

## Data Source
- Income account totals aggregated by period
- Cumulative sum from fiscal year start
- Multiple years overlaid for comparison

## Web Modernization Opportunities
- Interactive tooltips showing exact values on hover
- Click-through to monthly detail
- Year selection controls (show/hide specific years)
- Toggle between cumulative and per-month views
- Export chart data
