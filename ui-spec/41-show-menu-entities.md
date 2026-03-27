# Show Menu — All Data Entities

## Overview
The Show menu reveals every data entity/register in MoneyWorks. This is the definitive list of all data tables the web client needs to support.

## Entity Registry (Show Menu)

### Core Data Registers
| Menu Item | Shortcut | Description | API Table |
|-----------|----------|-------------|-----------|
| Transactions | ⌘T | All transaction types (invoices, payments, receipts, orders, quotes, journals) | `transaction` |
| Accounts | ⌘1 | Chart of Accounts (GL) | `account` |
| Names | ⌘2 | Customers and Suppliers (unified register) | `name` |
| Items | ⌘3 | Products, Resources, Time entries, Ship Methods | `product` |
| Jobs | ⌘4 | Project/job costing records | *upcoming* |
| Job Sheet Items | | Line items from job timesheets | — |
| Detail Line Items | ⌥⌘T | Transaction line items (detail rows) | `detail` |
| Assets | | Fixed asset register | — |

### Financial Setup
| Menu Item | Shortcut | Description |
|-----------|----------|-------------|
| Budgets | ⌘6 | Budget entries by account/period |
| Balances | | Opening balances |

### Classification & Structure
| Menu Item | Shortcut | Description |
|-----------|----------|-------------|
| Categories | ⌘⇧1 | Account category definitions |
| Departments | ⌘⇧2 | Cost center/department definitions |
| Department Groups | ⌘⇧3 | Department groupings |
| Classifications | ⌘⇧4 | Account classification hierarchy |
| Asset Categories | | Depreciation rule categories for assets |

### Configuration
| Menu Item | Shortcut | Description |
|-----------|----------|-------------|
| Period Names... | ⌘⇧5 | Define accounting period names and dates |
| Company Details... | ⌘⇧6 | Company information (name, address, tax numbers) |
| Tax Rates... | ⌘⇧7 | Tax code definitions with rates and GL accounts |
| Currencies | | Multi-currency definitions |
| Off-Ledger Values | | KPI and off-ledger tracking values |
| Validation Lists | | Custom picklist/dropdown definitions |
| Auto Allocations | | Automatic allocation rules for bank imports |

### System
| Menu Item | Shortcut | Description |
|-----------|----------|-------------|
| Scripts | ⌥⌘⇧8 | Custom MWScript scripts |
| Log File... | ⌥⌘⇧8 | System log viewer |
| Today's Messages | | System messages for today |
| Reminder Messages | | Upcoming reminder notifications |

## Tax Rate Entity (Detail)

### List Columns
| Column | Description |
|--------|-------------|
| Code | Tax code identifier (e.g., "G", "V", "E") |
| Name | Tax name (e.g., "Normal GST", "VAT", "Exempt") |
| Rate | Tax rate percentage |

### Tax Rate Record
| Field | Type | Description |
|-------|------|-------------|
| Code | Text | Unique tax code |
| Name | Text | Tax name |
| Tax Type | Dropdown | "G.S.T. or V.A.T." |
| Tax Paid Account | Account lookup | GL account for tax paid (e.g., 1400) |
| Tax Received Account | Account lookup | GL account for tax received (e.g., 2400) |
| **Rate calculation** | Radio | Percentage Rate or All Tax |
| Rate 1 | Percentage | Rate before changeover date |
| Changeover Date | Date | Date when rate changed |
| Rate 2 | Percentage | Rate on/after changeover date |
| All Tax | Radio | 100% tax (Net amount is always zero) |

### Toolbar Actions
New, Modify, Duplicate, Delete, Print, Change Code

## Job Entity (Detail)

### List Columns
Code, Client, Description

### Job Record
| Field | Type | Description |
|-------|------|-------------|
| Code | Text | Auto-generated job code (e.g., "000002") |
| Name | Text | Job name |
| Client | Lookup | Customer/client code |
| Colour | Dropdown | Colour tag |
| Category1-4 | Text | Custom category fields |
| Note | Button | Attach note |

### Job Reports (sidebar)
- Job Detailed
- Job P&L by Account
- Job P&L by Cost Centre
- Job P&L by Resource
- Job P&L Detailed
- Job P&L Summary

## Account Enquiry (Detail)

### Layout
| Component | Description |
|-----------|-------------|
| Select by | Dropdown: "Account Code" (can also select by name, category, etc.) |
| Account code | Text field with lookup |
| Calculate Now | Button — triggers data calculation |
| Include Unposted | Checkbox |

### Balances Tab
| Column | Description |
|--------|-------------|
| Period | Period name (e.g., "Jan:2024/25") |
| Opening | Opening balance for period |
| This Period | Net movement in period |
| Closing | Closing balance |
| Budget | Budget amount for period |
| Annual Budget | Full year budget |
| Amt Left | Budget remaining (Annual Budget - YTD actual) |

### Graph Tab
- Line/bar chart of account balance over time
- Controls: from/to period selectors, Show Average, Show Budgets, chart type toggle, Copy button

### Movements Tab
| Column | Description |
|--------|-------------|
| Reference | Transaction reference number |
| Type | Transaction type code (Rcpt, etc.) |
| Date | Transaction date |
| Status | P (Posted) |
| Pd | Period abbreviation |
| Description | Transaction description |
| Analysis | Analysis/job code |
| Tax | Tax amount |
| Debit | Debit amount |
| Credit | Credit amount |

- Additional toolbar: Related, Sum buttons
- Double-click drills into source transaction
