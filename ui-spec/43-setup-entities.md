# Setup Entities — Classification, Structure, and Configuration

## Overview
These entities define the structural and classification framework of MoneyWorks. They are configuration/setup data, not transactional data, but they are essential for the web client to function correctly.

## Categories
Simple code-description pairs that classify GL accounts.

### List Columns
Code, Description

### Sample Data (Acme Widgets)
| Code | Description |
|------|-------------|
| ADMIN | Administration/Overhead |
| COGS | Cost of Sales |
| FA | Fixed Assets |
| FADEPN | (Fixed Asset Depreciation) |
| GST | GST |
| INC | Other Income |
| OTHER | Other Expenses |
| PROMO | Promotional |
| SALES | Sales |
| WAGES | Wages |

### Usage
- Assigned to accounts via Account.Category field
- Used for report grouping (e.g., Income & Expenses by Category dashboard)
- Used in Ledger Chart "Break down by" option

## Departments
Cost centers for multi-dimensional reporting.

### List Columns
Code, Description, Classification

### Usage
- Enable departmental accounting when assigned to accounts
- "Departmentalise Account" in CoA navigator adds department tracking to an account
- Each transaction line can be tagged with a department
- Enables P&L by department, departmental budgets

## Department Groups
Groupings of departments for aggregated reporting.

### Usage
- "Add Department to Group" in CoA navigator
- "Groups of Departments" manages group definitions
- Allows rollup reporting across related departments

## Classifications
Hierarchical classification scheme for accounts.

### List Columns
Code, Description

### Usage
- Assigned to accounts and departments via Classification field
- Enables additional report grouping beyond categories
- Supports hierarchical structures

## Asset Categories
Depreciation rule definitions for fixed assets.

### Usage
- Defines depreciation method, rate, useful life
- Links to GL accounts (Asset, Depreciation Expense, Accumulated Depreciation)
- Applied to individual assets to automate depreciation calculation
- Managed from Assets navigator or Show → Asset Categories

## Validation Lists
Custom picklists/dropdown values.

### List Columns
Item, Comment

### Structure
- Left sidebar with list groups (+ button to add groups, gear icon for settings)
- Right panel shows items in selected list
- Toolbar: New, Modify, Duplicate, Delete

### Usage
- Create custom dropdown values for fields
- Applied to custom fields on Names, Items, Transactions
- Enables data validation and consistency

## Auto Allocations
Rule engine for automating bank statement import matching.

### List Columns
Match (the match text)

### Rule Definition (Auto Allocate Rule)
| Section | Fields |
|---------|--------|
| **Transaction type** | Radio: Deposit/Receipt, Payment, Either |
| **Condition logic** | "All of these tests" / "Any of these tests" dropdown |
| **Disable Rule** | Checkbox |
| **Match criteria** (each with checkbox, field, operator, value) | |
| Any field | contains / starts with / is / etc. | "Bank - int" |
| Memo | starts with | |
| Payee | starts with | |
| Reference | starts with | |
| Amount | is | 0.00 |
| Bank/Contra | is | (account) |
| **Action** | |
| Allocate | X% to account Y (e.g., 100% to 7150 "Interest Bank") |
| And (splits) | Up to 3 additional "remainder to account" entries |
| **Discard transaction** | For non-reconciling statement imports |
| **Pay invoice(s) for** | Auto-match to customer/supplier invoices |
| **Priority** | Slider from lowest to highest |

### Usage
- Triggered during Import Bank Statement
- Automatically categorizes recurring transactions
- Reduces manual data entry for bank feeds
- Priority determines which rule wins when multiple match

## Off-Ledger Values (KPI)
Non-GL metrics for tracking KPIs.

### List Columns
Name, Description, Current value

### Usage
- Track metrics that aren't part of the general ledger
- Examples: employee count, customer satisfaction score, etc.
- Values can be referenced in reports and forms
- Updated manually or via import

## Period Names / Financial Year
Defines the fiscal calendar structure.

### Year Names Panel
| Year Number | Name | Status |
|-------------|------|--------|
| Year 0 | 2021/22 | |
| Year 1 | 2022/23 | |
| Year 2 (previous) | 2023/24 | |
| Year 3 (current) | 2024/25 | Current |
| Year 4 (next) | 2025/26 | |

### Period Names Panel
| Period No. | Name |
|-----------|------|
| Period 1 | Apr |
| Period 2 | May |
| Period 3 | Jun |
| ... | ... |
| Period 12 | Mar |

**Acme Widgets fiscal year**: April to March (NZ standard)

### Usage
- Defines all period references throughout the system
- Transaction period assignment
- Budget periods
- Report period selectors
- Dashboard period labels

## Budgets
Spreadsheet-style budget editor.

### Layout
- **Tabs**: Last Year, This Year, Next Year, All
- **Toolbar**: Fill Down, Fill Right, Distribute, Sum, Find, Budget (type dropdown)
- **Grid**: Account code + description on left, monthly period columns
- **Data**: Editable cells — click to enter budget values
- Red zeros = no budget set; black numbers = budget values

### Key Features
- Fill Down: Copy value down a column
- Fill Right: Copy value across periods
- Distribute: Spread an annual total evenly across periods
- Budget dropdown: Switch between different budget sets
- Shows all accounts in the chart of accounts

### Sample Budget Data (Acme)
| Account | Description | Typical Monthly Budget |
|---------|-------------|----------------------|
| 4000 | Sales | 20,000-32,000 |
| 4100 | Repairs | 40,000-60,000 |
| 4300 | Freight Recovered | 1,500 |
