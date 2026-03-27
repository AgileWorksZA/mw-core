# App Shell — Global Layout and Navigation

## Overview
MoneyWorks Gold uses a single-window MDI (Multiple Document Interface) design. The main window contains a navigator sidebar on the left and a content area on the right. Child windows (transaction lists, forms, dashboards) open as separate floating windows within the application.

## Main Window Layout

### Title Bar
- Shows current document name: `"{Company Name}.moneyworks"`
- Standard window controls (close, minimize, zoom)

### Menu Bar
Top-level menus: **File**, **Edit**, **Select**, **Command**, **Show**, **Enquiries**, **Reports**, **Window**, **Help**

### Navigator Sidebar (Left Panel)
Persistent left sidebar (~180px wide) with a tree structure. Background: pink/salmon tone. Contains the MoneyWorks Gold logo at top.

#### Getting Started
- Help and Documentation
- Setting up

#### Navigation (Main Feature Areas)
- **Day-to-day** — Default home view; shows visual workflow diagram in content area
- **Sales and Income** — Sub-navigator for sales workflows
- **Purchases and Expenses** — Sub-navigator for purchasing workflows
- **Cash and Banking** — Sub-navigator for banking workflows
- **Customers and Suppliers** — Opens name/contact list
- **Items and Inventory** — Opens item list
- **Chart of Accounts** — Opens GL accounts list
- **Housekeeping** — Period management, maintenance
- **Jobs** — Job/project costing
- **Assets** — Fixed asset register
- **To Do** — Task list

#### Dashboard
- Overview
- Income and Expenses
- Year over Year Income
- Ledger Chart
- Sales Explorer
- Daily Summary
- Calendar

### Day-to-day Content Area (Home View)
When "Day-to-day" is selected, the content area shows a visual workflow diagram divided into three horizontal bands:

#### Sales and Income Band
Visual flow: `Quotes ↔ Sales Orders → Process Order → Sales Invoices → Receivables → Receipt Batch`
- Badge on Receivables: "96 overdue" (red badge showing count)

#### Cash and Banking Band
Visual flow: `Funds Transfer ← Bank Reconciliation ← Banking ← Receipts` and `Payments` feeds into Banking
- Also shows: Import Bank Statement

#### Purchases and Expenses Band
Visual flow: `Purchase Orders → Receive Goods → Purchase Invoices → Payables → Batch Payments`
- Badge on Payables: "17 overdue" (red badge showing count)

### Quick-Access Sidebar (Right Panel)
Icon buttons providing shortcuts to frequently used features:
- **Customers** — Opens customer list
- **Sales Enquiry** — Opens sales enquiry
- **Items** — Opens item list
- **Reports** — Opens report chooser
- **Account Enquiry** — Opens GL account enquiry
- **Suppliers** — Opens supplier list
- **Purchase Enquiry** — Opens purchase enquiry

## Menu Structure

### File Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| New | → submenu | Create new document |
| Open... | ⌘O | Open existing file |
| Connect... | | Connect to server (greyed when local) |
| Open Recent | → submenu | Recently opened files |
| Close "{filename}" | | Close current document |
| Save "{filename}" | ⌘S | Save current document |
| Save a Copy As... | | Save as new file |
| Save a Backup As... | | Create backup copy |
| Rollback "{filename}" | | Revert to last saved |
| Users & Security... | | User/permission management |
| Switch User... | | Change active user |
| Signing... | | Digital signing settings |
| Close Window | ⌘W | Close active child window |
| Page Setup... | | Print page configuration |
| Print... | ⌘P | Print current view |
| **Import** | → submenu | Data import functions |
| Export Selection... | | Export selected records |
| Accountant's Export... | | Export for accountant |
| Manage Services... | | External service connections |
| Diagnostics... | | Database diagnostic tools |

#### File > Import Submenu
| Item | Notes |
|------|-------|
| Import data from a text file | Generic delimited text import |
| Job Sheet Items... | Import job sheet line items |
| Payments on Invoices... | Import payment allocations |
| Names... | Import customer/supplier names |
| Address Book... | Import from system address book |
| Items... | Import inventory items |
| Jobs... | Import job records |
| Assets... | Import fixed assets |
| Asset Categories... | Import asset category definitions |
| Budgets... | Import budget figures |
| Accounts... | Import chart of accounts |
| Tax Codes/Rates... | Import tax code definitions |
| XML... | Import MoneyWorks XML format |

### Edit Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| Undo | ⌘Z | |
| Redo | ⇧⌘Z | |
| Cut | ⌘X | |
| Copy | ⌘C | |
| Paste | ⌘V | |
| Delete | | |
| Select All | ⌘A | |
| Budgets | | Open budget editor |
| Report Editor | → submenu | Custom report design |
| Forms Designer | → submenu | Custom form design |
| New Recent Item | ⌘N | |
| Modify Recent Item... | ⌘M | |
| Delete Recent Item | ⌘⌫ | |
| Duplicate Recent Item | ⌘D | |
| Duplicate Multiple | ⌘⇧M | |
| New Transaction | ⌘⇧N | Create new transaction |
| Add Note... | | Attach note to record |
| View Related Record | ⌘⇩ | Navigate to related record |
| Apply Auto Allocation | ⌘U | Auto-allocate transaction |
| Make Auto Allocation Rule... | ⌘E | Create allocation rule |
| Adjust HST Rounding | ⌘⇧A | Tax rounding adjustment |
| Reverse | ⌘⇧V | Reverse a transaction |
| Show Calculator | ⌘L | Built-in calculator |
| Document Preferences... | | Per-document settings |
| MoneyWorks Preferences... | | Application-wide settings |
| Customise List View... | | Configure visible columns |

### Select Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| Find | ⌘F | Quick search |
| Find Selected | ⌘G | Find using current selection |
| Find All | ⌘J | Show all records |
| Advanced Find... | ⌥⌘F | Complex search criteria |
| Replace... | | Find and replace |
| Advanced Replace... | | Complex replace |
| Find Related... | ⌘⇧R | Find related records |
| Invert Selection | | Toggle selection |
| Sort... | | Sort current list |
| Sum Selection | ⌘= | Sum selected values |
| Get Info | ⌘I | Record details |
| Speak... | | Text-to-speech |

### Command Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| Post/Ship/Receive | ⌘K | Post transactions |
| Adjustments | → submenu | Stock/value adjustments |
| Set Colour | → submenu | Colour-code transactions |
| Print Invoices... | ⌘⇧I | Batch print invoices |
| Print Statements | ⌘⇧! | Print customer statements |
| Age Debtor Balances... | | Recalculate debtor aging |
| Batch Creditor Payments... | ⌘Y | Create batch payment run |
| Batch Debtor Receipts... | ⌘⇧! | Create batch receipt run |
| Banking... | ⌘B | Open banking screen |
| Transfer Funds... | ⌘⇧F | Inter-account transfer |
| Change Currency Rate... | | Update exchange rates |
| Load Bank Statement... | | Import bank statement file |
| Bank Reconciliation... | ⌘⇧ | Start reconciliation |
| Electronic Payments... | | Generate e-payment files |
| Open/Close Period... | ⌥⌘O | Period management |
| Build Product... | | Manufacturing/assembly |
| Reorder Products | | Generate reorder suggestions |
| Stocktake | → submenu | Inventory count functions |
| Asset Register | → submenu | Asset management |
| Job Timesheet | ⌘⇧J | Time entry for jobs |
| Bill Job... | ⌘⇧! | Invoice a job |
| Work in Progress Journal... | | WIP journal entries |

### Enquiries Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| Account Enquiry | ⌘E | GL account drill-down |
| Payments History | ⌥⇧⌘H | Payment history view |
| Item Sales | ⌘7 | Item sales analysis |
| Customer Sales | ⌘8 | Customer sales analysis |
| Stock Enquiry | ⌘9 | Inventory levels |

## Common UI Patterns

### Transaction List View
All transaction lists share a common layout:
- **Toolbar**: New, Modify, Duplicate, Delete, Export, List, Related, Columns, Details, Process, [Type], Sum
- **Search**: Search field top-right with record count display
- **Sidebar filter panel** (left):
  - Transactions by Type (Payments, Receipts, Purchase Invoices, Sales Invoices, Journals)
  - Transactions by Status (Unposted, Posted, Payable, Receivable, Entered Today, All)
  - Orders (Purchase Orders, Sales Orders, Quotes, Bought, Sold)
  - Transactions by Period (Recent months, fiscal years)
  - Report on selection... (run report on filtered set)
- **Column headers**: Sortable, customizable via Columns button
- **Record count**: "X records; Y found" shown top-right

### Transaction Form (Shared Structure)
Transaction entry forms follow a consistent layout:
- **Top toolbar**: Type selector dropdown, Reverse, Info, Fields toggle, Add Note, Hold checkbox, Image attachment area
- **Header fields**: Customer/Supplier, Reference, Request #, To, Description, Date, Due Date
- **Colour tag**: Dropdown with colour options (None, and various colours)
- **Line items grid**: Item, Qty, Description, Unit Price, per, Disc.%, Extension, TC columns
- **Footer**: Freight Code, Docket, Freight Amt, Subtot, HST, Total, Total Cost of Goods, Total Margin
- **Process bar**: Shows workflow stage (e.g., "Process Quote: Enter Quote"), radio buttons for output type
- **Navigation**: Prev, Next, Cancel, OK buttons plus print button

### Keyboard Shortcuts
The application makes heavy use of keyboard shortcuts. All shortcuts should be mapped to web equivalents where possible.
