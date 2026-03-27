# Dashboard: Sales Explorer

## Overview
Interactive sales analysis with side-by-side ranked bar charts showing top products and top customers. Configurable dimensions and time periods.

## Access Points
- Navigator: Dashboard → Sales Explorer

## Controls (Top Bar)
| Control | Type | Options |
|---------|------|---------|
| Show | Dropdown | "Revenue", "Quantity", "Margin", etc. |
| for | Dropdown | "Top 5", "Top 10", "Bottom 5", "All", etc. |
| for (period) | Dropdown | "12 Months", "6 Months", "This Year", etc. |
| to | Dropdown | Period end (e.g., "Jan:2024/25") |
| Products broken down by | Dropdown | "Code", "Category", "Material", etc. |
| Customers broken down by | Dropdown | "Code", "Category", "Region", etc. |

## Layout — Side-by-Side Charts

### Left Panel: Top N Products
- **Type**: Horizontal bar chart
- **Y-axis**: Product names (e.g., "Bronze Widget Bevelled Large", "Bronze Widget Medium")
- **X-axis**: Revenue amount
- **Bars**: Colour-coded (different colour per product)
- **Title**: "Top 5 Products For 12 Months to Jan:2024/25"

### Right Panel: Top N Customers
- **Type**: Horizontal bar chart
- **Y-axis**: Customer names (e.g., "White Contractors", "Brown Suppliers")
- **X-axis**: Revenue amount
- **Bars**: Colour-coded (different colour per customer — matches their assigned colour)
- **Title**: "Top 5 Customers For 12 Months to Jan:2024/25"

## Data Source
- Sales Invoice line items aggregated by Product and Customer
- Filtered by selected time period
- Ranked by selected metric (Revenue, Quantity, Margin)

## Web Modernization Opportunities
- Click bar to drill into detailed transactions
- Dynamic filtering (click a customer to see only their products)
- Combined/cross-filtered view
- Additional chart types (pie, scatter)
- Export and save views
