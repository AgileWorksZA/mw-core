# Advanced Workflows Deep Dive — Adjustments, Order Processing, Batch Operations, Recurring, Statements, Funds Transfer

> Captured from live MoneyWorks Gold desktop exploration (2026-03-29)
> Includes live data from Acme Widgets Gold.moneyworks

---

## Adjustments Submenu (Command > Adjustments)

Five adjustment actions are available from the Command menu:

### 1. Cancel Transaction

Opens a "Cancel Transaction..." dialog listing all posted transactions eligible for cancellation.

| Column | Description |
|--------|-------------|
| Status | Transaction status |
| Type | Transaction type code (DI, CR, CP, Jnl, etc.) |
| Reference | Transaction reference number |
| Description | Transaction description |
| Period | Accounting period |
| Date | Transaction date |
| Gross | Transaction gross amount |

**Workflow:** Select transaction → dialog creates a reversal entry (equal and opposite posting).

### 2. Contra Invoices

Two-step wizard for offsetting a credit note against an invoice.

**Step 1:** Select the credit note to apply
| Column | Description |
|--------|-------------|
| Name | Customer/Supplier name |
| Due Date | Due date |
| Order No. | Order number |
| Invoice No. | Invoice number |
| To/From | Description |
| Total | Total amount |
| Outstanding | Remaining balance |

**Step 2:** Select the invoice to offset against (same columns).

**Buttons:** Continue... (after selection), Cancel

**Note:** In Acme Widgets, this list was empty — no credit notes exist in the sample data.

### 3. Write Off (⌘*)

Opens "Write Off Bad Debts..." dialog showing outstanding sales invoices eligible for bad debt write-off.

| Column | Description |
|--------|-------------|
| Status | Post status |
| P | Priority/flag |
| Ref | Transaction reference |
| Name | Customer name |
| Description | Transaction description |
| Period | Accounting period |
| Date | Transaction date |
| Value | Outstanding amount |

### 4. Send Refund to Debtor

**Dialog title:** "Send Refund to debtor..."
**Instruction:** "Please select the debtor to whom you wish to refund any overpayment or clearing of a credit note. Then click Continue..."

| Column | Description |
|--------|-------------|
| Code | Customer code |
| Name | Customer name |
| Category | Customer category |
| Hold | Hold flag |
| Phone | Phone number |
| OF | Overflow/flag column |
| Owing | Amount owing (sort arrow) |

**Buttons:** Continue..., Cancel

**Live data:** Only WINTER (The Winter Bakery, North category, phone 123-7656, Owing $4,707.47) appeared as eligible.

### 5. Receive Refund from Creditor

**Dialog title:** "Receive Refund from Creditor..."
**Instruction:** "Please select the creditor from whom you have received reimbursement of an overpayment. You should already have entered a credit note for the creditor to match the receipt."

| Column | Description |
|--------|-------------|
| Code | Supplier code |
| Name | Supplier name |
| Category | Supplier category |
| Hold | Hold flag |
| Phone | Phone number |
| Owed | Amount owed (sort arrow) |

**Buttons:** Continue..., Cancel

**Live data:** Empty — no creditors with credit balances in sample data.

---

## Sales Order Form

### List View
- **Record count:** 0 (no sales orders exist in Acme Widgets sample)
- **Columns:** Quote No., Order No., Name, To (Description), Date, Gross
- **Toolbar:** New, Modify, Duplicate, Delete, Export, List, Related, Columns, Details, **Ship**, **Reorder**, **Order**, Sum

### Sales Order Form Layout

#### Header Fields
| Field | Description |
|-------|-------------|
| Customer | Customer code with lookup |
| Quote/SO # | Auto-assigned (e.g. "0008") |
| Order # | Internal order number |
| To: | Customer name (auto-populated) |
| Description | Free text |
| Order Total | Calculated total |
| Date | Order date (default: today) |
| Due Date | Due date (default: today) |
| Colour | Colour dropdown (None, Red, Orange...) |

#### Toolbar Actions
- **Sales Order** (with dropdown arrow)
- **Reverse** — create reversal
- **Info** — transaction info panel
- **Fields** dropdown:
  - Simple [no extra fields] (default)
  - Show Analysis Fields
  - Show Some User Fields
  - Show All User Fields
- **Add Note**
- **Hold** checkbox
- **Make Recurring** checkbox + **Setup** button
- **Image** — attach document image

#### Detail Grid — Order Lines
| Column | Description |
|--------|-------------|
| Item | Product/item code |
| Order | Quantity ordered |
| SOH | Stock on hand |
| Ship | Quantity to ship |
| B/O | Back order quantity |
| Done | Completion flag |
| Description | Item description |
| Unit Price | Per-unit price |
| per | Unit of measure |
| Disc.% | Discount percentage |
| Extension | Line total |
| TC | Tax code |

**Tabs:** All Order Lines, Backorders

#### Footer
- Freight Code, Docket fields
- Freight Amt, Subtot, HST, Total Cost of Goods, Total Margin, Shipment Total

#### Radio Selection
- **Quote** — transaction is a quote
- **Sales Order** — transaction is a sales order (default for new from Sales Orders view)

### Process Order Pipeline (Critical)

The **"Process Order"** dropdown at the bottom of the Sales Order form controls the order lifecycle:

| Stage | Description |
|-------|-------------|
| **Enter Order** | Initial order entry (default for new orders) |
| **Receive deposit for order** | Collect deposit payment against the order |
| **Ship goods with invoice** | Convert order to invoice and ship goods |

**Workflow:**
1. Create order with "Enter Order" selected → save
2. Reopen order → change to "Receive deposit for order" → enter deposit details
3. Reopen order → change to "Ship goods with invoice" → this creates a Sales Invoice from the order

**Navigation:** Prev / Next buttons to cycle through orders; Cancel / OK to save.

---

## Quotes Form

### List View
- **Record count:** 0 (no quotes in sample data)
- **Columns:** Quote No., Name, To (Description), Quote Date, Expires, Analysis/Job, Gross
- **Toolbar:** New, Modify, Duplicate, Delete, Export, List, Related, Columns, Details, **Process**, **Quote**, Sum

The **Process** toolbar button is unique to quotes — it converts an accepted quote into a Sales Order.

---

## Batch Debtor Receipts (⌘R)

### Screen Layout

**Title:** Debtor Receipts

#### Header
| Field | Description |
|-------|-------------|
| Lookup Mode | Radio: **Debtor** / **Invoice** — choose whether to search by debtor code or invoice number |
| Code/Number | Text field with lookup arrow |
| Amount | Payment amount to enter |
| Date | Receipt date (e.g. 2025-01-3) |
| Receipt No. | Auto-incremented receipt number (e.g. 218) |
| **Enter** | Button — enters/posts the receipt (greyed until valid data) |
| Distribute | Button — triggers payment distribution across invoices |
| Distribution Mode | Dropdown: **Smart** / **Strict top-down** / **Ignore credits** |
| Auto | Checkbox — auto-distribute on amount entry |
| Payment Method | Dropdown: None (and other payment methods) |

#### Customer Details
Shows "ANZ, Newton, White Contractors" style address info after debtor lookup.

#### Top Panel — Outstanding Invoices
| Column | Description |
|--------|-------------|
| Invoice | Invoice number |
| Order | Order number |
| Description | Invoice description |
| Inv Date | Invoice date |
| Gross | Original gross amount |
| Disco...d Amt | Discount amount available |
| Expires | Discount expiry date |
| Outstanding | Remaining unpaid amount |
| Pay | Amount to pay (editable) |
| W/O | Write-off checkbox |

**Footer totals:** Gross, Outstanding, Pay

**Live data for WHITE:** 9 outstanding invoices (1977, 1992, 1993, 2003, 2004, 2013, 2011, 2020, 2023), total Outstanding $15,766.17

#### Bottom Panel — Processed Receipts
Shows receipts already entered in the current batch session.

#### Footer
- Total of receipts processed: running total
- **Print...** — print receipt batch summary
- **Cancel** — discard and close
- **Accept...** — finalize all entered receipts

### Distribution Modes
| Mode | Behaviour |
|------|-----------|
| **Smart** | Intelligent distribution considering discounts and dates |
| **Strict top-down** | Allocate to oldest invoices first |
| **Ignore credits** | Skip credit notes in the allocation |

### Workflow
1. Select Debtor (or Invoice) radio mode
2. Enter debtor code → outstanding invoices appear
3. Enter amount → click Distribute (or use Auto)
4. Adjust Pay amounts per invoice as needed
5. Click **Enter** → receipt is created and posted
6. Repeat for next debtor
7. Click **Accept...** to finalize all receipts in batch

---

## Batch Creditor Payments (⌘Y) — Pay Creditors

### Multi-Step Wizard

#### Step 1: Mark Invoices for Payment

**Title:** Pay Creditors — "Mark Invoices for Payment..."
**Instruction:** "To mark invoices for payment in full, highlight them and click Full. If you only want to partially pay an invoice, highlight it and click Partial. To set it not to be paid at this time, highlight it and click Don't Pay."

**Header:**
- Payment Method: **All** (dropdown filter)
- List / Details toggle buttons
- Search field
- Record count display (e.g. "17 records; 0 h/l")
- **Full** — mark selected invoices for full payment
- **Partial...** — opens dialog for partial payment amount
- **Don't Pay** — exclude selected from this payment run

**Columns:**
| Column | Description |
|--------|-------------|
| Creditor | Supplier code |
| Due Date | Payment due date |
| Order No. | Internal order number |
| Invoice No. | Supplier's invoice number |
| From (Description) | Supplier name and description |
| Gross | Invoice gross amount |
| Outstanding | Remaining unpaid |
| Disc Amt | Discount amount available |
| Expires | Discount expiry |
| Pay Amount | Amount to pay (0.00 until marked) |

**Live data:** 17 outstanding purchase invoices from 7 creditors (BSUPP, CSUPP, CANON, TCOM, NEWHER, NEWSTAT, NEWPOW)

**Footer:**
- Total of payments to make: running total
- **Do Electronic Payments Export Step** checkbox
- **Close** — cancel wizard
- **Next** — proceed to step 2

#### Step 2 (not explored)
Would show payment details, bank account selection, and confirmation.

---

## Recurring Transaction Setup

### Access
Available on any transaction form via **Make Recurring** checkbox + **Setup** button.
Available on both new and existing posted transactions (e.g., purchase invoices).

### Recurring Setup Dialog

**Title:** Recurring Setup — "Define Recurring Transaction..."

#### Regular Mode (radio selected)
| Field | Description |
|-------|-------------|
| Every | Day number (1-31) for monthly, or specific day |
| Day Type | Dropdown: **Day**, Mon, Tues, Wed, Thurs, Fri, Sat, Sun |
| of every | Checkbox + months interval (e.g. "of every 1 months") |
| Last | Radio — use last day of month instead of specific day |
| Starting on | Start date (e.g. 2024-09-17) |
| Avoid Weekends | Checkbox — skip weekends |

**End condition (radio group):**
| Option | Description |
|--------|-------------|
| and finishing: | Specific end date |
| and recurring: [n] more times | Fixed number of recurrences |
| **never finish** | Recur indefinitely (default in sample) |

#### Once Only Mode (radio)
| Field | Description |
|-------|-------------|
| On or after | Date for single recurrence |
| Reverse | Checkbox — create a reversal entry |

#### Buttons
- **Preview** — shows upcoming recurrence dates
- **Cancel** — discard changes
- **OK** — save recurring setup

#### Live Example (Canon Photocopier)
- Regular: Every 17th Day of every 1 months
- Starting on: 2024-09-17
- Never finish
- Warning displayed: "Start date is in the past. Will recur next time file is opened."

**Behaviour note:** "The transaction will recur (be duplicated automatically) when you open the document on or after the 'Starting On' date, which should normally be some time in the future."

---

## Print Statements (⌘])

### Print Dialog

| Field | Description |
|-------|-------------|
| Use Form | Form template dropdown (e.g. "Plain") |
| Include Remittance Advice | Checkbox |
| Omit Zero Balances | Checkbox |
| Omit Credit Balances | Checkbox |
| Statement Date | Date for the statement (e.g. 2025-01-31) |
| Print Highlighted Records Only | Checkbox — only print selected debtors |
| Optional Message | Free text message (appears on custom forms only) |
| Output to... | Dropdown: **Preview** (and other options) |

**Buttons:** Preview (generates preview), Cancel

**Page thumbnail preview** shown on right side of dialog.

**Critical note:** "After printing statements for all debtors, you must use the Age Debtor Balances command to ensure that subsequent statements do not include transactions printed on these statements."

---

## Funds Transfer (Command > Transfer Funds...)

### Dialog Layout

**Title:** Funds Transfer
**Description:** "This will create and post a payment transaction to represent a transfer of money from one bank account to another."

| Field | Description |
|-------|-------------|
| From Account | Bank account dropdown showing "code: name: balance" (e.g. "1000: Main Bank Account: 8,365.31") |
| To Account | Bank account dropdown (same format) |
| Amount | Transfer amount (default 1.00) |
| Reference | Auto-generated reference number (e.g. 100754) |
| Date | Transfer date |
| Period | Accounting period dropdown |
| Analysis | Analysis code (optional) |
| Description | Free text description |

**Buttons:** Cancel, **Transfer** (greyed if From == To account)

**Behaviour:** Creates and immediately posts a payment transaction representing the inter-account transfer.

---

## Transaction List — Sidebar Filters

The transaction list view includes a comprehensive left sidebar for filtering:

### Transactions by Type
- Payments
- Receipts
- Purchase Invoices
- Sales Invoices
- Journals

### Transactions by Status
- Unposted
- Posted
- Payable
- Receivable
- Entered Today
- **All** (shows all 983 transactions)

### Orders
- Purchase Orders
- Sales Orders
- Quotes
- Bought
- Sold

### Transactions by Period > Recent
- Jan:2024/25
- Dec:2024/25
- Nov:2024/25
- (and earlier periods)

---

## Sales and Income Navigator — Workflow Map

The "Sales and Income" navigator page shows the complete workflow:

```
Quotes ↔ Sales Orders → Process Order → Sales Invoices → Receivables → Receipts
                                                  ↓                        ↑
                                         Credit Note/Return          Receipt Batch
                                         Contra Credits             One off Receipt
                                         Cancel Invoice
                                         Write-off Invoice
                                                  ↓
                                         Print Statements → Age Debtors

Sales Orders → Order stock for pending sales → Purchasing

                                         Refund / Cancel Receipt
                                              ↓
                                         Customers
```

### Reports Section (bottom of Sales and Income page)
**Item Sales:** Summary, by Month, by Customer
**Customer Sales:** Summary, by Month, by Item
**Receivables:** Aged Receivables

### Quick-Access Icons
- Customer Sales (enquiry)
- Item Sales (enquiry)
- Stock (enquiry)

---

## Command Menu — Context Sensitivity

The Command menu changes based on the current view context:

| Context | Menu Label Changes |
|---------|-------------------|
| Sales Invoices | "Post/Ship/Receive", "Print Invoices..." |
| Purchase Invoices | "Post Transactions", "Print Purchase Invoice..." |
| General | Standard labels |

---

## Payables View (Transactions by Status > Payable)

Shows outstanding creditor invoices with:
| Column | Description |
|--------|-------------|
| Creditor | Supplier code |
| Due Date | Payment due date |
| Order No. | Internal order number |
| Invoice No. | Supplier's invoice number |
| From (Description) | Supplier name and description |
| Gross | Invoice gross amount |
| Outstanding | Remaining unpaid |
| Pay Amount | Marked payment amount (0.00 = unmarked) |

**Live data:** 17 payable records from 7 creditors.
