# Sales Enquiry

## Overview
Sales Enquiry provides drill-down analysis into customer and item sales activity. Two separate enquiry screens share the same layout pattern but focus on different dimensions.

## Access Points
- Enquiries menu: Customer Sales (⌘8), Item Sales (⌘7)
- Right sidebar: Sales Enquiry icon
- Sales and Income sub-navigator: Customer Sales, Item Sales, Stock enquiry icons

## Customer Sales Enquiry (⌘8)

### Controls
| Control | Type | Description |
|---------|------|-------------|
| Select | Dropdown | "Name Code" (or Name, Category, Region, etc.) |
| Code field | Text + lookup | Customer code to enquire on |
| Calculate Now | Button | Execute the query |
| Include Unposted | Checkbox | Include unposted transactions |
| Metric | Dropdown | "Sales" (can change to Purchases, etc.) |

### Customer Name Display
Shows resolved customer name below the code (e.g., "White Contractors")

### Tabs

#### Monthly Tab
| Column | Description |
|--------|-------------|
| Period | Accounting period (e.g., "Dec:2024/25") |
| Value | Sales value for that period |

#### Graph Tab
- Line/bar chart of sales over time
- From/to period selectors
- Same chart controls as Account Enquiry Graph

#### Movements Tab
Individual transaction listing for the selected customer.
| Column | Description |
|--------|-------------|
| Status | Transaction status |
| P | Posted indicator |
| Invoice | Invoice number |
| Name | Customer name |
| Description | Transaction description |
| Period | Accounting period |
| Date | Transaction date |
| Value | Transaction amount |

Additional toolbar: Related (drill to transaction), Sum

#### Orders Tab
Outstanding sales orders for this customer.

## Item Sales Enquiry (⌘7)

### Controls
Same pattern as Customer Sales but with "Item Code" selector.

### Tabs

#### Monthly Tab (Enhanced)
| Column | Description |
|--------|-------------|
| Period | Accounting period |
| Qty | Units sold |
| Value | Revenue |
| Cost | Cost of goods |
| Margin | Value - Cost |
| Margin (%) | Margin as percentage |

#### Graph Tab
Same as Customer Sales.

#### Movements Tab
Same pattern — individual sale transactions for the item.

#### Orders Tab
Outstanding orders containing this item.

### Sample Data (BA100 Bronze Widget Medium)
| Period | Qty | Value | Cost | Margin | Margin (%) |
|--------|-----|-------|------|--------|------------|
| Dec:2024/25 | 86 | 2,099.04 | 1,140.79 | 958.25 | 45.65% |
| Nov:2024/25 | 68 | 1,659.72 | 902.02 | 757.70 | 45.65% |
| Aug:2024/25 | 109 | 2,660.42 | 1,445.89 | 1,214.53 | 45.65% |

## Stock Enquiry (⌘9)
Inventory level enquiry — shows SOH, committed, available, on order.

## Web Modernization Opportunities
- Combined customer + item cross-analysis
- Interactive charts with drill-down
- Export/download data
- Comparative analysis (customer A vs B)
- Trend lines and forecasting
