# Implementation Prompt — Advanced Workflows (Spec 48)

## Context
You are building the web frontend for MoneyWorks Gold accounting software. The stack is SvelteKit (frontend at port 3041) with an Elysia JS backend API at port 3400 (base path `/api/v1`). Refer to `ui-spec/48-advanced-workflows-deep-dive.md` for the full desktop reference spec. Study the existing routes in `packages/web/src/routes/` for patterns — especially `batch-receipts/`, `batch-payments/`, and `funds-transfer/` which already exist but may need enhancement.

## What Exists Already
- `/batch-receipts` — basic debtor list with checkboxes and amounts. Needs enhancement.
- `/batch-payments` — basic creditor payment screen. Needs enhancement.
- `/funds-transfer` — basic transfer form. Needs enhancement.

## What Needs Building

### Priority 1: Sales Orders & Quotes (New Routes)

**Route: `/sales-orders`** — list page + `/sales-orders/new` and `/sales-orders/[id]`

The Sales Order form is similar to the Sales Invoice form but with these unique features:
- Grid columns: Item, Order (qty), SOH (stock on hand), Ship (qty), B/O (backorder qty), Done (checkbox), Description, Unit Price, per, Disc.%, Extension, TC
- Two tabs: "All Order Lines" and "Backorders"
- Footer: Freight Code, Docket, Freight Amt, Subtot, HST, Total Cost of Goods, Total Margin, Shipment Total
- **Process Order dropdown** at the bottom with 3 stages: "Enter Order", "Receive deposit for order", "Ship goods with invoice"
- Quote/Sales Order radio toggle
- Hold checkbox, Make Recurring checkbox

The `+page.server.ts` should load orders from `/tables/transaction` with filter for sales order type codes. Use the existing `apiGet` pattern from `$lib/api/client`.

**Route: `/quotes`** — similar to sales orders but with Quote Date, Expires columns and a "Process" button to convert to Sales Order.

### Priority 2: Adjustments (New Route)

**Route: `/adjustments`** — a single page with tabs or sections for the 5 adjustment types:

1. **Cancel Transaction** — shows a filterable table of all posted transactions. User selects one and clicks "Cancel" which creates a reversal via `POST /api/v1/tables/transaction/import` with a reversed-sign copy.

2. **Contra Invoices** — two-step wizard:
   - Step 1: Show credit notes (outstanding DIC/POC type transactions)
   - Step 2: Show invoices for the same customer/supplier to offset against
   - Submits a journal-style offset

3. **Write Off** — shows outstanding receivable invoices. User selects and clicks "Write Off" which posts a write-off journal to the bad debts account.

4. **Send Refund to Debtor** — shows customers with credit balances (filter names where balance < 0). Select customer → creates a payment (CP type) to refund.

5. **Receive Refund from Creditor** — shows suppliers with credit balances. Select supplier → creates a receipt (CR type) for the refund.

Each tab should fetch its own data. Use a tabbed layout with `<button>` tab navigation.

### Priority 3: Enhance Batch Receipts

The existing `/batch-receipts` shows a simple debtor list. Enhance it to match the desktop:

1. Add **Debtor/Invoice lookup mode** toggle (radio buttons)
2. When a debtor is selected, show their **outstanding invoices** in a detail panel below (columns: Invoice, Order, Description, Inv Date, Gross, Discount Amt, Expires, Outstanding, Pay amount, W/O checkbox)
3. Add **Distribution mode** dropdown: Smart, Strict top-down, Ignore credits
4. Add **Payment Method** dropdown
5. Add a **Processed receipts** panel at the bottom showing entered-but-not-yet-accepted receipts
6. Replace single Submit with **Enter** (per receipt) + **Accept** (finalize batch) flow
7. Auto-increment Receipt No.

The server action should create individual receipt transactions via the API, not batch them all at once.

### Priority 4: Enhance Batch Payments

Enhance `/batch-payments` to match the desktop multi-step wizard:

1. **Step 1: Mark for Payment** — show all payable invoices with Full/Partial/Don't Pay buttons
2. Add **Payment Method** filter dropdown
3. Show **Total of payments to make** running total
4. **Electronic Payments Export** checkbox
5. **Step 2** (Next button) — show payment summary with bank account selection, date, reference
6. **Step 3** — confirmation and posting

### Priority 5: Recurring Transaction Setup (Component)

Create a reusable `RecurringSetup.svelte` component that can be embedded in any transaction form:

**Props:** `transactionId: string`, `onSave: (config) => void`, `onCancel: () => void`

**Fields:**
- Mode: Regular / Once Only (radio)
- Regular: day number (1-31), day type (Day/Mon/Tue/Wed/Thu/Fri/Sat/Sun), month interval, start date, avoid weekends, end condition (finish date / n more times / never finish)
- Once Only: date, reverse checkbox
- Preview button (shows next N recurrence dates)

This component saves recurring metadata. The actual recurrence engine runs server-side on document open (or via a scheduled job in the web version).

### Priority 6: Print Statements (New Route)

**Route: `/statements`**

- Form selection dropdown (we only have "Plain" for now)
- Checkboxes: Include Remittance Advice, Omit Zero Balances, Omit Credit Balances
- Statement Date picker
- Customer selection (or "All")
- Optional Message textarea
- **Preview** button → generates PDF/HTML statement preview
- Note: "After printing, run Age Debtor Balances"

The server action should:
1. Fetch all customers with receivable balances
2. For each customer, fetch their outstanding transactions
3. Generate statement output (HTML preview or PDF)

### Priority 7: Enhance Funds Transfer

The existing `/funds-transfer` needs:
- **From Account** dropdown showing "code: name: balance" format (fetch bank accounts with live balances)
- **To Account** dropdown (same format)
- Validation: From and To must be different accounts
- Amount, Reference (auto-generated), Date, Period, Analysis, Description fields
- **Transfer** button (disabled if From == To)
- The transfer creates and immediately posts a CP transaction

## Technical Notes

### API Patterns
- GET data: `apiGet<T>('/tables/{table}', { token, filter, limit, fields })`
- POST/import: `apiPost('/tables/{table}/import', { token, body: { ... } })`
- Eval expressions: `apiEvalBatch(expressions[], { token })`
- Bank balance: Use `apiEvalBatch(['GetBalance("1000", "20250131")'])` with explicit date string

### Transaction Type Codes
- Sales Order: SO
- Quote: QU
- Sales Invoice: DII (unposted), DIC (credit note)
- Purchase Invoice: POI (unposted), POC (credit note)
- Receipt: CR, CRC (with customer), CRD (allocation)
- Payment: CP, CPC (with supplier), CPD (allocation)
- Journal: JN, JNS (system)

### SvelteKit Patterns (follow existing code)
- Use `$props()` for page data
- Use `$state()` and `$derived()` for reactive state
- Use `invalidateAll()` after mutations
- Use `showToast()` and `showError()` from `$lib/stores/toast`
- Use `PageHeader` component
- Use `CurrencyDisplay` component for monetary values
- Use `ConfirmDialog` component for destructive actions

### Styling
- Tailwind CSS
- Follow the existing table/form patterns in `batch-receipts` and `batch-payments`
- Use consistent spacing, colors and typography

## File Structure for New Routes
```
packages/web/src/routes/
  sales-orders/
    +page.server.ts    (list loader)
    +page.svelte       (list view)
    new/
      +page.server.ts  (new order loader - accounts, items, tax codes)
      +page.svelte     (order form)
      +server.ts       (POST handler)
    [id]/
      +page.server.ts  (edit loader)
      +page.svelte     (edit form)
      +server.ts       (PUT handler)
  quotes/
    (same structure as sales-orders)
  adjustments/
    +page.server.ts    (loads posted transactions, outstanding invoices, debtors, creditors)
    +page.svelte       (tabbed UI)
    +server.ts         (POST handlers for each adjustment type)
  statements/
    +page.server.ts    (loads customers with balances)
    +page.svelte       (form + preview)
    +server.ts         (POST to generate statement)
```

## Deliverables
1. All new routes listed above
2. Enhanced existing routes (batch-receipts, batch-payments, funds-transfer)
3. RecurringSetup.svelte component
4. All forms functional with real API data (no mock data)
5. Error handling and toast notifications
6. Responsive layout

Start with Priority 1 (Sales Orders) and work down. Commit after each priority is complete.
