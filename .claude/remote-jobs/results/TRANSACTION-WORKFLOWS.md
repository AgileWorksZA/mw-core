# MoneyWorks Gold - Transaction Workflow Documentation

> **Captured Date**: 2025-11-26
> **MoneyWorks Version**: MoneyWorks Gold
> **Data File**: Acme Widgets Gold.moneyworks
> **Status**: Partial - Initial exploration completed

---

## Overview

This document captures the step-by-step workflows for creating transactions in MoneyWorks Gold. Workflows documented include keyboard shortcuts, menu paths, dialog navigation, and field tab order.

---

## Sales Invoice Workflow (DII - Debtor Item Invoice)

### Method 1: Via Transactions View + Edit Menu

**Prerequisites**: Transactions view must be open

**Steps:**

1. **Open Transactions View**
   - **Keyboard**: `Cmd+T`
   - **Menu**: `Show → Transactions`
   - **Result**: Transactions list window opens
   - **Screenshot**: `workflow-01-transactions-view.png`

2. **Create New Transaction**
   - **Keyboard**: `Cmd+N` (context-dependent - opens appropriate transaction type)
   - **Menu**: `Edit → New Receipt` (for sales invoice)
   - **Result**: Transaction type dialog appears
   - **Screenshot**: `workflow-02-new-transaction-dialog.png`
   - **Window Title**: Initially shows "Purchase Invoice" or similar, changes based on selection

3. **Select Transaction Type** (if needed)
   - Dialog may show last-used transaction type
   - Use `Edit → New Receipt` menu specifically for sales invoices
   - **Result**: Sales Invoice dialog opens
   - **Screenshot**: `workflow-03-sales-invoice-new.png`
   - **Window Title**: "Sales Invoice"

4. **Enter Customer** (First field - auto-focused)
   - **Field**: Namecode
   - **Type**: Lookup field
   - **Action**: Type customer code (e.g., "C001")
   - **Screenshot**: `workflow-04-customer-entered.png`

5. **Customer Lookup Dialog** (appears after typing)
   - **Trigger**: Pressing `Tab` after entering customer code
   - **Dialog**: Shows customer selection list
   - **Screenshot**: `workflow-05-after-tab.png`
   - **Columns**: Code, Name, Balance, Credit Limit, etc.
   - **Selection**: Yellow highlight indicates selected customer
   - **Actions**:
     - **Use button**: Confirm selection
     - **Cancel**: Abort selection
     - **Search field**: Filter customers by typing

6. **Confirm Customer Selection**
   - **Action**: Click "Use" button (requires manual click or user assistance)
   - **Result**: Customer populated, moves to next field
   - **Screenshot**: `workflow-07-customer-confirmed.png`

7. **Enter Transaction Date**
   - **Field**: Date field
   - **Default**: Today's date
   - **Dialog**: Date picker calendar appears
   - **Screenshot**: Shows calendar popup
   - **Action**: Press `Return` to accept default or select different date
   - **Result**: Date confirmed, moves to line items section
   - **Screenshot**: `workflow-08-date-accepted.png`

8. **Enter Line Items**
   - **Field**: Product/Item code
   - **Action**: Type item code (e.g., "WIDGET01")
   - **Screenshot**: `workflow-09-item-code-entered.png`
   - **Next**: Press `Tab` to continue
   - **Screenshot**: `workflow-10-after-item-tab.png`
   - **Note**: Item lookup dialog may appear (similar to customer lookup)

9. **Complete Line Item Entry** (To be fully documented)
   - Enter quantity
   - Enter/confirm price
   - Select tax code
   - Add description (if needed)
   - Tab through fields

10. **Add Additional Line Items** (To be documented)
    - Method to add new line
    - Repeat line item entry process

11. **Save Transaction** (To be documented)
    - **Expected**: `Cmd+S` or "Save" button
    - **Status**: U (Unposted/Draft)

12. **Post Transaction** (To be documented)
    - **Menu**: `Command → Post/Ship/Receive`
    - **Or**: Button in dialog
    - **Result**: Status changes to P (Posted)

---

## Key Findings from Workflow Exploration

### Dialog Behavior

1. **Context-Dependent New (Cmd+N)**
   - Opens transaction type based on current context
   - From Transactions view: May open last-used type or default
   - Use specific menu path for guaranteed transaction type

2. **Lookup Dialogs**
   - Triggered automatically when tabbing from lookup fields
   - Customer lookup: Shows filtered list of names
   - Item lookup: Shows product catalog (assumed)
   - **Use button**: Confirms selection
   - Search functionality built into dialogs

3. **Date Pickers**
   - Appear automatically on date fields
   - Show calendar popup
   - Default to today's date
   - `Return` key accepts current selection

4. **Field Navigation**
   - `Tab`: Move to next field
   - `Shift+Tab`: Move to previous field (assumed)
   - Some fields trigger dialogs when tabbed from

### Automation Challenges

1. **Dialog Button Clicks**:
   - "Use" button in lookups requires click (not keyboard accessible)
   - May need user assistance or AppleScript UI automation

2. **Lookup Fields**:
   - Can type codes directly
   - Or use lookup dialog for selection
   - Direct code entry + `Return` may be faster for automation

3. **Field Tab Order**:
   - Not fully linear - some fields trigger dialogs
   - Need to handle dialog popup/dismiss in automation

---

## Alternative Transaction Creation Methods

### Method 2: Direct Menu Path

**Path**: `Edit → New Receipt`
- Opens Sales Invoice dialog directly
- No transaction type selection needed
- Faster than Cmd+N from Navigator

### Method 3: Navigator Icons

**Path**: Click Sales Invoices icon on Navigator
- Opens Transactions view filtered to invoices
- Then use Cmd+N or Edit → New Receipt
- Less reliable for automation

---

## Transaction Types Reference

| Type Code | Menu Path | Window Title | Description |
|-----------|-----------|--------------|-------------|
| DII | Edit → New Receipt | Sales Invoice | Debtor Item Invoice (Sales) |
| CII | *(To be determined)* | Purchase Invoice | Creditor Item Invoice (Purchases) |
| CRD | *(To be determined)* | Receipt | Cash Receipt Debtor (Customer Payment) |
| DIC | *(To be determined)* | Credit Note | Debtor Item Credit |

---

## Field Mapping - Sales Invoice Dialog

### Header Fields

| Field Name | Position | Tab Order | Type | Required | Default | Notes |
|------------|----------|-----------|------|----------|---------|-------|
| Namecode | Top-left | 1 | Lookup | Yes | - | Customer code |
| Date | After Namecode | 2 | Date | Yes | Today | Transaction date |
| Due Date | After Date | 3 | Date | No | Calculated | Payment due date |
| Our Ref | *(TBD)* | *(TBD)* | Text | No | Auto-generated | Invoice number |
| Your Ref | *(TBD)* | *(TBD)* | Text | No | - | Customer PO number |

### Line Item Fields

| Field | Tab Order | Type | Required | Notes |
|-------|-----------|------|----------|-------|
| Code | 1 | Lookup | Yes | Product/Item code |
| Description | 2 | Text | No | Auto-fills from item |
| Quantity | 3 | Number | Yes | |
| Unit Price | 4 | Currency | Yes | Auto-fills from item |
| Tax Code | 5 | Lookup | No | Auto-fills from item |
| Discount | *(TBD)* | Percentage | No | |

---

## Screenshots Reference

All workflow screenshots stored in `/tmp/mw-screenshots/`:

| Screenshot | Step | Description |
|------------|------|-------------|
| workflow-01-transactions-view.png | 1 | Transactions list view |
| workflow-02-new-transaction-dialog.png | 2 | New transaction dialog (Cmd+N result) |
| workflow-03-sales-invoice-new.png | 3 | Empty sales invoice dialog |
| workflow-04-customer-entered.png | 4 | Customer code typed in |
| workflow-05-after-tab.png | 5 | Customer lookup dialog |
| workflow-07-customer-confirmed.png | 6 | After selecting customer |
| workflow-08-date-accepted.png | 7 | Date confirmed, in line items |
| workflow-09-item-code-entered.png | 8 | Item code typed |
| workflow-10-after-item-tab.png | 9 | After tabbing from item code |

---

## Automation Sequence - Sales Invoice (Partial)

```typescript
// Create Sales Invoice - Partial Automation Sequence
const createSalesInvoice = [
  // Open Transactions
  { action: "key", value: "cmd+t" },
  { action: "sleep", value: 1500 },

  // Create New (via menu for reliability)
  { action: "menu", value: "Edit/New Receipt" },
  { action: "sleep", value: 1500 },

  // Enter Customer
  { action: "type", value: "C001" }, // Customer code
  { action: "key", value: "tab" },
  { action: "sleep", value: 1000 },

  // SELECT CUSTOMER IN LOOKUP DIALOG
  // Problem: Requires clicking "Use" button
  // Solution: User assistance or AppleScript click
  { action: "say", value: "Please click the Use button to select the customer" },
  { action: "sleep", value: 15000 }, // Wait for user

  // Accept Date
  { action: "key", value: "return" },
  { action: "sleep", value: 500 },

  // Enter Line Item
  { action: "type", value: "WIDGET01" }, // Item code
  { action: "key", value: "tab" },
  { action: "sleep", value: 1000 },

  // HANDLE ITEM LOOKUP (if needed)
  // Similar challenge to customer lookup

  // Continue with quantity, price, etc.
  // ... TO BE COMPLETED
];
```

---

## Remaining Workflow Documentation Needed

### Sales Transactions
- [ ] Complete line item entry process
- [ ] Add multiple line items
- [ ] Calculate totals
- [ ] Save draft invoice
- [ ] Post invoice
- [ ] Print invoice

### Payment Transactions
- [ ] Create customer payment (CRD)
- [ ] Link payment to invoice
- [ ] Handle partial payments
- [ ] Handle overpayments

### Credit Notes
- [ ] Create credit note (DIC)
- [ ] Reverse existing invoice (in-place)
- [ ] Credit note vs reversal differences

### Purchase Transactions
- [ ] Create purchase invoice (CII)
- [ ] Create supplier payment (CPC)
- [ ] Receive stock

### Journal Entries
- [ ] Create manual journal (JNL)
- [ ] Multi-line entry process
- [ ] Account selection

---

## Dialog Dimensions & Button Locations

### Customer Lookup Dialog
- **Window Title**: "Customers" (approx)
- **Position**: Centered on invoice dialog
- **Columns**: Code, Name, Balance, Credit Limit, YTD Sales, etc.
- **Buttons**:
  - "Use" - Bottom right
  - "Cancel" - Bottom right
  - Search field - Top

### Date Picker
- **Type**: Calendar popup
- **Default**: Today (highlighted)
- **Navigation**: Arrow keys, click, or type date

---

## Best Practices for Automation

### ✅ Reliable Methods

1. Use **menu paths** for transaction creation (more predictable than Cmd+N)
2. Use **keyboard shortcuts** for opening views (Cmd+T, Cmd+1, etc.)
3. Use **direct code entry** when possible (avoid lookup dialogs)
4. Add generous **sleep delays** (1000-1500ms) after navigation actions

### ⚠️ Challenges

1. **Lookup dialog buttons** require clicking (not keyboard accessible)
2. **Tab order** varies based on transaction type
3. **Field auto-population** can interfere with scripted entry
4. **Validation dialogs** may appear unexpectedly

---

## Next Steps

1. Complete full sales invoice workflow (all fields)
2. Test alternative transaction types (Purchase, Payment, Credit)
3. Document Post/Ship/Receive process
4. Map sidebar filter icons in transaction views
5. Document error handling (invalid codes, required fields, etc.)
6. Capture confirmation dialogs (Post, Delete, etc.)

---

## Summary

**Status**: Initial workflow exploration complete
**Key Discovery**: Lookup dialogs require user assistance or AppleScript for button clicks
**Recommendation**: For automation, use direct code entry where possible, bypass lookup dialogs
**Next Priority**: Complete end-to-end sales invoice creation and posting

The Sales Invoice workflow follows a standard pattern: Header fields → Line items → Save/Post. The main automation challenge is handling lookup dialog confirmations, which may require hybrid automation (keyboard + user clicks).
