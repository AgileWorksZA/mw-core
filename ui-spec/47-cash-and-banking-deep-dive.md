# Cash & Banking Deep Dive — Receipts, Payments, Purchase Invoices, Bank Reconciliation, Journals

> Captured from live MoneyWorks Gold desktop exploration (2026-03-28)
> Includes live data from Acme Widgets Gold.moneyworks

## Receipt Form (Cash Receipt / Customer Payment)

### List View (Receipts)
- **Record count:** 240 (after test receipt created)
- **Columns:** Status, Reference, Bank, Name, From (Description), Period, Date, Gross
- **Toolbar:** New, Modify, Duplicate, Delete, Export, List, Related, Columns, Details, Sum, Receipt, Cancel
- Red/highlighted rows indicate multi-invoice allocations
- Description auto-populates: "{Customer Name} ({invoice numbers})" e.g. "Brown Suppliers (1871, 1875, 1880, 1884)"
- Bank column shows account code (e.g. 1000) in italics

### Receipt Form Layout

#### Header Fields
| Field | MW Field | Description |
|-------|----------|-------------|
| Customer | NameCode | Customer code with lookup. **Checkbox enables Payment-on-Invoice mode** |
| Receipt # | OurRef | Auto-assigned sequential number |
| Bank | BankAccount | Dropdown showing "code: name: balance" (e.g. "1000: Main Bank Account: 8,365.31") |
| From | TheirName | Auto-populated from customer name, editable |
| Description | Description | Free text, auto-populated with allocated invoice numbers |
| Period | Period | Period selector showing "Month:Year/FiscalYear ends YYYY-MM-DD" |
| Date | TransDate | Transaction date |
| Amount | Gross | **The cheque/payment amount received** — must be set BEFORE or match allocation total |
| Paid By | PaidBy | Dropdown: None (default), and payment method options |
| Colour | Colour | Dropdown: None, Red, Orange, etc. |

#### Toolbar Actions
- **Receipt** (with dropdown arrow for variants)
- **Reverse** — creates a reversal entry
- **Info** — opens Transaction Info panel
- **Fields** (dropdown) — shows/hides optional fields
- **Add Note** — attaches notes
- **Hold** checkbox — prevents posting
- **Make Recurring** checkbox + **Setup** button (new receipts only)
- **Image** button — attach document image

#### Three Detail Tabs

**1. By Account**
| Column | Description |
|--------|-------------|
| Account | GL account code (e.g. 1500 Accounts Receivable) |
| Account Name | Auto-populated account description |
| Description | Line description |
| Net | Net amount before tax |
| TC | Tax code |
| HST | Tax amount |
| Gross | Gross amount |

**2. By Item**
| Column | Description |
|--------|-------------|
| Item | Product/item code |
| Qty | Quantity |
| Description | Item description |
| Unit Price | Per-unit price |
| per | Unit of measure |
| Disc.% | Discount percentage |
| Extension | Line total |
| TC | Tax code |

Footer shows: Total Cost of Goods, Total Margin ($ / %), Subtot, HST, Total

**3. Payment on Invoice** (only appears when Customer checkbox is checked)
| Column | Description |
|--------|-------------|
| Invoice | Invoice number being paid |
| Order | Linked order number |
| Description | Invoice description |
| Date | Invoice date |
| Gross | Original invoice amount |
| This Payment | Amount allocated from this receipt |

For **new receipts** with customer selected, this tab shows ALL outstanding invoices:
| Column | Description |
|--------|-------------|
| Invoice | Invoice number |
| Order | Order number |
| Description | Invoice description |
| Inv Date | Invoice date |
| Gross | Original invoice gross |
| Discou...d Amt | Discount amount available |
| Expires | Discount expiry date |
| Outstanding | Remaining unpaid amount |
| Pay | Amount to allocate (editable) |
| W/O | Write-off checkbox |

Footer controls:
- **Auto Distribute** checkbox — automatically distributes payment across invoices
- **Distribute** button — triggers distribution calculation

### Critical Workflow Rules

1. **Customer checkbox** must be checked FIRST to enable Payment on Invoice mode
2. When unchecked, only By Account and By Item tabs appear (for miscellaneous receipts)
3. **Amount field must match or exceed allocation total** — error: "The amount allocated to invoices is more than the cheque amount."
4. Receipts are **auto-posted on save** (immediate POSTED status)
5. The bank balance updates immediately on the form (visible in Bank dropdown)
6. Description auto-populates with allocated invoice numbers on save

### Transaction Info Panel (via Info button)
- Sequence (Audit) Number
- Security Level
- Date Entered
- Last Modified Time
- Date & Time Posted
- Reconciled against bank account(s): "{acct} not reconciled" or reconciled status
- HST Cycle
- Changes made after posting: Yes/No
- Other distinguishing marks
- Don't Show on Statement checkbox

---

## Payment Form (Supplier Payment / Cash Payment)

### List View (Payments)
- **Record count:** 348
- **Columns:** Status ("Posted"), Reference, Bank, Name, To (Description), Period, Date, Gross, Type ("Payment")
- **Toolbar:** New, Modify, Duplicate, Delete, Export, List, Related, Columns, Details, Sum, Cancel
- No "Payment" toolbar button (unlike Receipt which has a "Receipt" button)
- References use larger number series (100000+)

### Payment Form Layout

Structurally mirrors Receipt with these key naming differences:

| Receipt Term | Payment Term | MW Context |
|-------------|-------------|------------|
| Customer | **Supplier** | Creditor code field with checkbox |
| Receipt # | **Cheque #** | Payment reference number |
| From: | **To:** | Payee name |
| Payment on Invoice tab | Same behavior | Shows outstanding **purchase** invoices |

#### Detail — By Account (typical expense payment)
- Account: Expense code (e.g. 7240 Stationery, 7205 Photocopier)
- Tax codes present (TC: G for GST)
- Net + HST breakdown

#### Payments Without Supplier Code
Most payments in Acme Widgets are direct expense payments without a supplier code linked. These go directly to expense accounts (7240, 7205, etc.) without the "Payment on Invoice" allocation mechanism.

---

## Purchase Invoice Form

### List View
- **Record count:** 123
- **Columns:** Status, Order No., Invoice No., Name, From (Description), Period, Date, Gross
- **Toolbar:** New, Modify, Duplicate, Delete, Export, List, Related, Columns, Details, Sum, **Adjust** (dropdown)
- Invoice No. can be "AP" (auto-generated) or supplier's actual invoice number
- Has an **Adjust** dropdown button (not present on Sales Invoices)

### Purchase Invoice Form Layout

| Field | Notes |
|-------|-------|
| **Creditor** | Supplier code (not "Customer" or "Debtor") |
| **Invoice #** | The supplier's invoice number (can be "AP") |
| **Order #** | Internal order/sequence number |
| **Due Date** | Payment due date (EXTRA field not on Sales Invoices!) |
| From | Supplier name |
| Description | Free text description |
| Amount | Invoice total |
| Colour | Colour coding |

#### Key Differences from Sales Invoice
1. "Creditor" not "Customer/Debtor"
2. TWO number fields: Invoice # (supplier's ref) + Order # (internal ref)
3. **Due Date field** — for payment terms tracking
4. No "Paid By" field
5. Detail rows use pink/salmon stripes (vs green for receipts/payments)
6. Expense accounts in detail (7205 Photocopier, etc.) instead of income/COGS accounts
7. "Make Recurring" available on existing posted purchase invoices

#### Detail — By Account
- Account: Expense account code (e.g. 7205 Photocopier)
- Account Name: "Photocopier"
- Description: "Monthly Rental"
- Tax breakdown: Net 73.37, TC: G, HST 11.01, Gross 84.38

---

## Bank Reconciliation

### Setup Dialog
Opens via Command > Bank Reconciliation... (⌘;)

| Field | Description |
|-------|-------------|
| Bank | Bank account dropdown (e.g. "1000: Main Bank Account: 8,365.31") |
| Statement Date | Date of the bank statement being reconciled |
| Statement Number | Sequential statement number |
| Opening Balance | Previous closing balance (greyed out, "Change..." button to override) |
| Closing Balance | Bank statement closing balance (editable) |
| Include Unposted Transactions | Checkbox (default unchecked) |

Buttons: Load Old... (load previous reconciliation), Cancel, Reconcile...

### Reconciliation Screen (Dual-Panel)

**Top Panel: Reconciled Items**
| Column | Description |
|--------|-------------|
| Type | Transaction type |
| Date | Transaction date |
| Analysis | Analysis code |
| Stat | Status |
| Reference | Transaction reference |
| Deposit | Deposit amount |
| Withdrawal | Withdrawal amount |
| Balance | Running balance |

**Summary Section:**
- Amount Processed: Running total of reconciled items
- Calculated Closing: Opening + Amount Processed
- Statement Close: Target closing balance from setup
- **Difference:** Calculated Closing - Statement Close (target: 0.00)

**Bottom Panel: Unreconciled Transactions**
| Column | Description |
|--------|-------------|
| OK | Checkbox to mark as reconciled |
| Type | Transaction type |
| Date | Transaction date |
| Description | Transaction description |
| Analysis | Analysis code |
| Stat | Status |
| Reference | Transaction reference |
| Amount | Transaction amount |

**Workflow:**
1. Check "OK" on transactions matching bank statement entries
2. Matched items move from bottom to top panel
3. Work toward Difference = 0.00
4. Click "Finish" when balanced

**Action Buttons:**
- Start Over — reset all reconciled marks
- Finish Later — save partial reconciliation
- Cancel — abandon
- Print — print reconciliation report
- Finish — complete and lock reconciliation

**Mouse modes:**
- Select (cursor icon) — default selection
- Reconcile (green checkmark) — click to toggle reconciliation status

---

## Journals

### List View
- **Record count:** 14
- **Columns:** Status, Type ("Jnl"), Reference, Description, Period, Date, Gross
- **Toolbar:** New, Modify, Duplicate, Delete, Export, List, Related, Columns, Details (simpler than other types)

### Journal Types Observed
1. **GST/HST Settlement Journals** — Reference: JN000001-JN000004
   - Description: "GST for 2 Mths; Cycle 1/2/3/4"
   - Periodic tax settlement entries

2. **Banking Journals** — Reference: BK000001-BK000010
   - Description: "Banking"
   - Bank-related adjustment entries
   - Monthly entries with varying gross amounts

---

## Command Menu — Complete Action List

Captured from Command menu (important for BFF action endpoint design):

| Action | Shortcut | Notes |
|--------|----------|-------|
| Post/Ship/Receive | ⌘K | Post unposted transactions |
| Adjustments | → submenu | Credit notes, write-offs etc. |
| Set Colour | → submenu | Colour-code transactions |
| Print Transaction... | ⌘[ | Print current transaction |
| Print Statements | ⌘] | Print customer/supplier statements |
| Age Debtor Balances... | | Recalculate debtor ageing |
| Batch Creditor Payments... | ⌘Y | Mass supplier payment run |
| Batch Debtor Receipts... | ⌘R | Mass customer receipt processing |
| Banking... | ⌘B | Open banking view |
| Transfer Funds... | | Inter-account transfer |
| Change Currency Rate... | | (greyed when not applicable) |
| Load Bank Statement... | | Import bank statement file |
| Bank Reconciliation... | ⌘; | Reconcile bank account |
| Electronic Payments... | | (greyed in this file) |
| Open/Close Period... | ⌥⌘O | Manage accounting periods |
| Build Product... | | Manufacturing/assembly |
| Reorder Products | | (greyed) stock reorder |
| Stocktake | → submenu | Physical inventory count |
| Asset Register | → submenu | Fixed asset management |
| Job Timesheet | ⌥⌘J | Time tracking for jobs |
| Bill Job... | ⌘\ | Invoice a job |
| Work in Progress Journal... | | WIP accounting entries |

---

## Transaction Type Summary (All Types)

| View | Record Count | MW Type Codes | Key Fields |
|------|-------------|---------------|------------|
| Sales Invoices | 258 | DII (incomplete), DIC (complete) | Customer, Invoice No., Order No. |
| Purchase Invoices | 123 | POI (incomplete), POC (complete) | Creditor, Invoice #, Order #, Due Date |
| Receipts | 240 | CR (receipt), CRC/CRD (complete/detail) | Customer checkbox, Receipt #, Bank, Amount |
| Payments | 348 | CP (payment), CPC/CPD (complete/detail) | Supplier checkbox, Cheque #, Bank, Amount |
| Journals | 14 | JN (journal), JNS (journal special) | Reference, Type |
| **Totals** | **983** | | |

---

## Live Test: Receipt Creation Against Invoice #2129

### Steps Performed
1. Opened Receipts list → clicked New
2. **Checkbox next to Customer field must be checked** to enable Payment on Invoice mode
3. Typed "WHITE" → Tab → resolved to "ANZ, Newton, White Contractors"
4. "Payment on Invoice" tab appeared showing ALL outstanding invoices for WHITE (total: $15,909.63 outstanding)
5. Scrolled to invoice #2129 (Gross 143.46, Outstanding 143.46)
6. Entered 143.46 in Pay column for invoice #2129
7. Set Amount header field to 143.46
8. Clicked OK → receipt #351 created and auto-posted
9. Bank balance updated from 8,221.85 to 8,365.31 (+143.46)
10. Description auto-populated: "2129"

### Validation Rule Discovered
If Amount header < sum of Pay allocations → error: "The amount allocated to invoices is more than the cheque amount."

### Auto-Behaviours
- Receipt # auto-incremented (351)
- Bank balance updates immediately on form
- Description auto-set to invoice numbers
- Receipt auto-posted on save (no separate post step needed)
- "From:" auto-populated from customer name
