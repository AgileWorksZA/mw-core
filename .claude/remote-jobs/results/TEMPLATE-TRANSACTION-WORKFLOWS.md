# Transaction Workflows - MoneyWorks Gold

> Step-by-step UI automation sequences for common transactions

## 1. Create Sales Invoice (DII)

### Prerequisites
- MoneyWorks Gold running with acme.moneyworks open
- At least one customer exists (e.g., "WHITE")
- At least one product exists (e.g., "CB100")

### Steps

| Step | Action | Value | Screenshot | Notes |
|------|--------|-------|------------|-------|
| 1 | menu | Show/Transactions | `01-transactions-list.png` | Opens transaction list |
| 2 | sleep | 500ms | | Wait for window |
| 3 | key | cmd+n | `02-new-dialog.png` | Opens new transaction dialog |
| 4 | sleep | 500ms | | Wait for dialog |
| 5 | ??? | Select Invoice type | `03-type-selected.png` | How? Click? Dropdown? |
| 6 | ??? | Enter customer | `04-customer.png` | Field name? Tab order? |
| 7 | key | tab | | Move to next field |
| 8 | ??? | Enter date | `05-date.png` | Date field behavior |
| 9 | ??? | Add line item | `06-line-item.png` | How to add lines? |
| 10 | type | CB100 | `07-product.png` | Product code |
| 11 | key | tab | | |
| 12 | type | 5 | `08-quantity.png` | Quantity |
| 13 | ??? | Save/OK | `09-saved.png` | Save button or shortcut? |
| 14 | ??? | Post | `10-posted.png` | Post if separate step |

### Automation Sequence
```typescript
const createSalesInvoice = async (client, customer: string, lines: LineItem[]) => {
  await gold.menu("Show/Transactions");
  await sleep(500);
  await gold.key("cmd+n");
  await sleep(500);
  // TODO: Complete sequence based on mapping
};
```

### Field Tab Order
| Order | Field | Type | Required |
|-------|-------|------|----------|
| 1 | Type | Dropdown | Yes |
| 2 | Customer | Lookup | Yes |
| 3 | Date | Date | Yes |
| ... | ... | ... | ... |

---

## 2. Record Customer Payment (CRD)

### Prerequisites
- Unpaid invoice exists

### Method A: From Invoice Context Menu

| Step | Action | Value | Screenshot | Notes |
|------|--------|-------|------------|-------|
| 1 | menu | Show/Transactions | | |
| 2 | ??? | Find unpaid invoice | | How to filter? |
| 3 | ??? | Right-click invoice | | Or menu? |
| 4 | ??? | Select "Receipt" | | |
| 5 | ??? | Receipt dialog | | Document fields |
| 6 | ??? | OK/Confirm | | |

### Method B: From Command Menu

| Step | Action | Value | Screenshot | Notes |
|------|--------|-------|------------|-------|
| 1 | menu | Command/Batch Debtor Receipts... | | |
| 2 | ??? | ... | | Document wizard |

### Receipt Dialog Fields
| Field | Tab Order | Type | Default | Notes |
|-------|-----------|------|---------|-------|
| Amount | | Currency | Full amount | |
| Date | | Date | Today | |
| Bank Account | | Lookup | Default bank | |
| Reference | | Text | Empty | Cheque number, etc. |

---

## 3. Create Credit Note

### Method A: Reverse Existing Invoice (In-Place)

| Step | Action | Value | Screenshot | Notes |
|------|--------|-------|------------|-------|
| 1 | ??? | Open invoice | | Double-click? |
| 2 | ??? | Click Reverse | | Toolbar button? Where? |
| 3 | ??? | Confirm reversal | | Dialog? |
| 4 | ??? | Post | | |

**Result**: Original invoice Type stays DII, Gross becomes negative.

### Method B: Create Separate Credit Note (DIC)

| Step | Action | Value | Screenshot | Notes |
|------|--------|-------|------------|-------|
| 1 | key | cmd+n | | New transaction |
| 2 | ??? | Select Credit Note type | | DIC |
| 3 | ??? | Complete entry | | Same as invoice? |

---

## 4. Create Journal Entry (JNL)

| Step | Action | Value | Screenshot | Notes |
|------|--------|-------|------------|-------|
| 1 | key | cmd+n | | New transaction |
| 2 | ??? | Select Journal type | | |
| 3 | ??? | Enter debit line | | |
| 4 | ??? | Enter credit line | | |
| 5 | ??? | Must balance | | What happens if not? |
| 6 | ??? | Save & Post | | |

### Journal Fields
| Field | Notes |
|-------|-------|
| Description | Header description |
| Date | |
| Period | |
| Line: Account | Account code |
| Line: Debit | Amount |
| Line: Credit | Amount |
| Line: Description | Line description |

---

## 5. Stocktake / Stock Adjustment

| Step | Action | Value | Screenshot | Notes |
|------|--------|-------|------------|-------|
| 1 | menu | Command/Stocktake | | |
| 2 | ??? | Document wizard | | |

---

## Common UI Patterns

### Opening a Transaction for Edit
```
Double-click in list
  OR
Select + Cmd+E (?)
  OR
Select + Enter (?)
```

### Adding Line Items
```
Tab to line area
  OR
Click "+ Add" button at coordinates (?, ?)
  OR
Press specific key
```

### Saving Without Posting
```
Cmd+S (?)
  OR
Click Save button at (?, ?)
```

### Posting Transaction
```
Click Post button at (?, ?)
  OR
Cmd+? shortcut
  OR
Menu: Command/Post/Ship/Receive
```

### Canceling/Closing Dialog
```
Cmd+.
  OR
Escape
  OR
Click Cancel at (?, ?)
```

---

## Timing Requirements

| Action | Minimum Wait After |
|--------|-------------------|
| Open menu | 300ms |
| Click menu item | 500ms |
| Open dialog | 500ms |
| Type text | 100ms |
| Press tab | 100ms |
| Save action | 1000ms |
| Post action | 1000ms |

---

## Error Scenarios to Document

| Scenario | Expected Behavior | Screenshot |
|----------|-------------------|------------|
| Save with empty required field | | |
| Post already posted | | |
| Invalid customer code | | |
| Invalid product code | | |
| Negative quantity | | |
| Date in closed period | | |
