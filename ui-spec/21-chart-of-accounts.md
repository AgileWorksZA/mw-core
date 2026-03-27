# Chart of Accounts

## Overview
The Chart of Accounts manages the general ledger structure — accounts, departments, categories, tax rates, currencies, and classifications. It also provides access to journals, budgets, balances, and financial reports.

## Access Points
- Navigator: Chart of Accounts (dedicated navigator view)

## Navigator View
The CoA has its own visual workflow navigator (not a list view), showing interconnected entities:

### Entity Icons (Clickable)
| Entity | Description |
|--------|-------------|
| **Edit HST Rates** | Tax code/rate management |
| **Categories** | Account category definitions |
| **Currencies** | Multi-currency setup |
| **Classifications** | Account classification hierarchy |
| **Departments** | Cost center/department definitions |
| **Groups of Departments** | Department groupings |
| **Add Department to Group** | Assign departments to groups |
| **Departmentalise Account** | Enable department tracking on accounts |
| **Accounts** | GL account list (central entity) |
| **Auto-Allocations** | Automatic allocation rules |
| **Add Bank or Credit Card account** | Quick-add bank account wizard |
| **Balances** | Opening balance entry |
| **Budgets** | Budget entry and management |
| **Journals** | Manual journal entry |
| **Accountant's Export** | Export data for accountant |
| **Off-ledger (KPI)** | Off-ledger KPI tracking |

### Reports Section (Bottom of Navigator)
| Category | Reports |
|----------|---------|
| **Financial** | Profit This Month, Profit This Year, Profit Comparison, Balance Sheet, Account Movements, Accounts List |
| **Audit** | Trial Balance, Ledger Report, Transaction Posting |
| **Budget** | Financial Year, Forecast |
| **Structure** | Chart of Accounts, Departments |
| **Quick Access** | Account Enquiry (icon) |

## Accounts List

### Columns
| Column | Description |
|--------|-------------|
| Code | Account code (numeric, e.g., "1000", "7500") |
| Type | Account type code: CA (Current Asset), EX (Expense), SF (Shareholders' Funds), IN (Income), CS (Cost of Sales), SA (Savings/Asset), CL (Current Liability), FA (Fixed Asset) |
| Description | Account name |
| TC | Tax code |
| Category | Category assignment |
| Group | Department group |

### Filter Sidebar
| Section | Items |
|---------|-------|
| **All** | All accounts |
| **Balance Sheet** | Assets, Liabilities, Shareholders' Funds |
| **Profit and Loss** | Sales and Income, Cost of Sales and Expenses |
| **Bank Accounts** | Bank/cash accounts only |
| **System Accounts** | System-controlled accounts |
| **Report on selection...** | |
| Ledger Daily Chart | Daily ledger chart report |

### Toolbar
Standard list toolbar plus **Enquiry** button for account drill-down.

## Account Record Form

### Header
| Field | Type | Description |
|-------|------|-------------|
| Code | Text | Numeric account code |
| Description | Text | Account name |
| Account Type | Dropdown | Bank Account, Expense, Income, Current Asset, Fixed Asset, Current Liability, Shareholders' Funds, Cost of Sales |
| Security Level | Dropdown | unprotected, protected, etc. |
| Note icon | Button | Attach note |

### Tabs

#### Details Tab
| Field | Type | Description |
|-------|------|-------------|
| Tax Code | Dropdown | Default tax code (e.g., "*") |
| Category | Dropdown | Primary category (e.g., "None") |
| Category2 | Text | Secondary category |
| Category3 | Text | Tertiary category |
| Category4 | Text | Quaternary category |
| Dept Group | Dropdown | Department group assignment |
| Classification | Dropdown | Account classification |
| Colour | Dropdown | Colour tag |
| Accountant's Code | Text | External accountant's reference |
| Heading only | Checkbox | Account is a heading (no transactions) |
| Discountable | Checkbox | Can be included in discount calculations |

#### Bank Settings Tab (Bank Accounts only)
| Field | Type | Description |
|-------|------|-------------|
| Account Number | Text | Bank account number |
| Bank Account Must be Reconciled | Checkbox | Require reconciliation |
| Receipts-for-Banking Holding Account | Checkbox | Staging account for deposits |
| Bank Account is | Dropdown | Current Account, Savings, Credit Card, etc. |
| Change Cheque Number Sequence | Checkbox | |
| Printed Cheque N° | Text + Digits spinner | Starting cheque number |
| Handwritten Cheque N° | Text + Digits spinner | Handwritten cheque sequence |
| Sync | Checkbox | Sync cheque numbers |

#### Comments Tab
- Free-text notes/comments area

#### Cashflow Reporting Tab
- Configuration for cashflow report categorization

## Account Types Reference
| Code | Full Name | Balance Sheet / P&L |
|------|-----------|---------------------|
| CA | Current Asset | Balance Sheet |
| FA | Fixed Asset | Balance Sheet |
| CL | Current Liability | Balance Sheet |
| SF | Shareholders' Funds | Balance Sheet |
| SA | Savings/Asset | Balance Sheet |
| IN | Income | P&L |
| EX | Expense | P&L |
| CS | Cost of Sales | P&L |

## Business Rules
- Account codes are typically numeric, can be up to 7 characters
- Account Type determines report placement and behavior
- Bank accounts have additional settings (reconciliation, cheque numbering)
- Heading-only accounts group related accounts in reports
- Departments enable multi-dimensional reporting
- Categories provide additional classification for custom reporting
- Security Level controls who can post to the account
- Accountant's Code maps to external accounting software
