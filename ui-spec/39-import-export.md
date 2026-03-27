# Import and Export

## Overview
MoneyWorks supports importing and exporting data in various formats for integration with other systems, data migration, and accountant collaboration.

## Access Points
- File menu: Import → submenu
- File menu: Export Selection...
- File menu: Accountant's Export...

## Import Functions

### File → Import Submenu
| Function | Description |
|----------|-------------|
| Import data from a text file | Generic CSV/TSV/delimited import with field mapping |
| Job Sheet Items... | Import job sheet line items |
| Payments on Invoices... | Import payment allocation data |
| Names... | Import customer/supplier records |
| Address Book... | Import from macOS Address Book |
| Items... | Import product/item records |
| Jobs... | Import job/project records |
| Assets... | Import fixed asset records |
| Asset Categories... | Import asset depreciation categories |
| Budgets... | Import budget figures |
| Accounts... | Import chart of accounts |
| Tax Codes/Rates... | Import tax code definitions |
| XML... | Import MoneyWorks XML format |

### Bank Statement Import
- Command → Load Bank Statement
- Supports OFX, QIF, CSV formats
- Auto-matching and rule-based allocation

## Export Functions

### Export Selection
- Exports currently selected/filtered records
- Formats: CSV, Tab-delimited, XML
- Field selection for export

### Accountant's Export
- Comprehensive export package for accountant review
- Includes trial balance, transaction details, chart of accounts
- Standard format for accounting review

## Integration Points
- REST API (via Herman's Elysia JS backend) provides programmatic access
- XML import/export for structured data exchange
- CSV for spreadsheet interchange
- OFX/QIF for bank integration
