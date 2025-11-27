# MoneyWorks Gold Complete UI Mapping Job

> **Priority**: High
> **Estimated Duration**: 2-4 hours
> **Machine Requirements**: 128GB RAM, macOS, MoneyWorks Gold installed
> **Data File**: acme.moneyworks (demo file)

## Context

We've started building UI automation for MoneyWorks Gold to enable programmatic control of the desktop application. The automation CLI is working but we need comprehensive mapping of:
1. All UI navigation paths
2. All keyboard shortcuts
3. Complete transaction workflows (step-by-step click/type sequences)
4. Field positions and tab order in dialogs
5. Validation behaviors and error dialogs

This job will be executed on a separate machine with more RAM. All findings must be documented for import back to the main development machine.

---

## Prerequisites

### 1. Clone the Repository
```bash
git clone <repo-url> mw-core
cd mw-core
bun install
```

### 2. Verify MoneyWorks Gold is Running
```bash
bun packages/cli/src/index.ts gold status
# Should show: ✅ MoneyWorks Gold is running
```

### 3. Install cliclick (optional but recommended)
```bash
brew install cliclick
```

### 4. Grant Accessibility Permissions
- System Preferences → Privacy & Security → Accessibility
- Add Terminal/iTerm to allowed apps
- May need to restart terminal after granting

### 5. Configure MoneyWorks REST API
Create `mw-config.json` in repo root:
```json
{
  "host": "localhost",
  "port": 6710,
  "dataFile": "acme.moneyworks",
  "username": "your-username",
  "password": "",
  "folderPassword": "",
  "folderName": ""
}
```

### 6. Test REST API Connection
```bash
bun packages/cli/src/index.ts test-connection
```

---

## Phase 1: Complete UI Element Mapping

### Task 1.1: Map All Keyboard Shortcuts

Test every Cmd+number combination and document what opens:

```bash
# Test each shortcut
for i in 1 2 3 4 5 6 7 8 9 0; do
  echo "=== Cmd+$i ==="
  bun packages/cli/src/index.ts gold key "cmd+$i"
  sleep 1
  bun packages/cli/src/index.ts gold window
  bun packages/cli/src/index.ts gold screenshot -o /tmp/mw-cmd$i.png
  bun packages/cli/src/index.ts gold key "cmd+w"  # Close
  sleep 0.5
done
```

**Document in this format:**
| Shortcut | Opens | Window Title | Notes |
|----------|-------|--------------|-------|
| Cmd+1 | Accounts | Accounts for acme... | Chart of accounts |
| Cmd+2 | Names | Names for acme... | Customers/suppliers |
| ... | ... | ... | ... |

Also test:
- Cmd+Shift+1 through Cmd+Shift+9
- Cmd+Option+1 through Cmd+Option+9
- Function keys F1-F12
- Cmd+N (New)
- Cmd+E (Edit?)
- Cmd+D (Duplicate?)
- Cmd+T (New Transaction?)

### Task 1.2: Map All Menu Items

```bash
# Get all menu bar items
osascript -e 'tell application "System Events" to tell process "MoneyWorks Gold" to get name of every menu bar item of menu bar 1'

# For each menu, list all items
for menu in "MoneyWorks Gold" "File" "Edit" "Select" "Command" "Show" "Enquiries" "Reports" "Window" "Help"; do
  echo "=== $menu Menu ==="
  bun packages/cli/src/index.ts gold menu-items "$menu"
done
```

**Document submenus** - many menu items have submenus. For each item that has ▶, document the submenu items.

### Task 1.3: Map Navigator Dashboard

The Navigator is the main dashboard with clickable icons. We need coordinates for each icon.

```bash
# Take a clean screenshot of Navigator
bun packages/cli/src/index.ts gold key "cmd+w"  # Close any windows
bun packages/cli/src/index.ts gold key "cmd+w"
bun packages/cli/src/index.ts gold key "cmd+w"
sleep 1
bun packages/cli/src/index.ts gold screenshot -o /tmp/navigator.png
```

**Task**: Identify and document coordinates (x, y) for each clickable icon:
- Sales and Income section icons
- Purchases section icons
- Reports section icons
- Any other clickable areas

Test clicking each icon and document what happens:
```bash
bun packages/cli/src/index.ts gold click <x> <y>
sleep 1
bun packages/cli/src/index.ts gold screenshot -o /tmp/after-click.png
bun packages/cli/src/index.ts gold window
```

### Task 1.4: Map Sidebar Navigation

When a list view is open (Transactions, Names, etc.), there's a sidebar with filter icons. Document:
- Icon positions (coordinates)
- What each icon filters/shows
- Icon names/tooltips if discoverable

---

## Phase 2: Transaction Entry Workflow Mapping

### Task 2.1: Create New Sales Invoice (DII)

**Goal**: Document every step to create a sales invoice from scratch.

```bash
# 1. Open Transactions view
bun packages/cli/src/index.ts gold menu "Show/Transactions"
sleep 1

# 2. Find "New" button or use Cmd+N
bun packages/cli/src/index.ts gold key "cmd+n"
sleep 1
bun packages/cli/src/index.ts gold screenshot -o /tmp/new-txn-dialog.png
```

**Document the New Transaction dialog:**
- What type selector appears?
- How to select "Debtor Invoice" or "Sales Invoice"?
- Tab order through fields
- Required fields highlighted?

**Complete workflow to document:**
1. Open new transaction dialog
2. Select transaction type (DII - Debtor Item Invoice)
3. Select customer (Namecode field)
4. Enter date
5. Add line items (product, quantity, price)
6. Save (what button/shortcut?)
7. Post (if separate step)

**Screenshot at each step!**

### Task 2.2: Create Payment Receipt (CRD)

Document the workflow for recording a customer payment:
1. Find unpaid invoice
2. Right-click → Receipt (or menu path)
3. Receipt dialog fields
4. Confirm/OK

### Task 2.3: Create Credit Note

Two methods to document:
1. **Reverse method** (in-place modification)
   - Open existing invoice
   - Click Reverse button
   - Document what changes

2. **New credit note method** (separate DIC transaction)
   - File → New → Credit Note (if exists)
   - Or: New Transaction → select Credit type

### Task 2.4: Create Journal Entry (JNL)

```bash
# Try to create a manual journal
bun packages/cli/src/index.ts gold key "cmd+n"
# Select Journal type
# Document multi-line entry process
```

### Task 2.5: Stock Adjustment / Stocktake

```bash
bun packages/cli/src/index.ts gold menu "Command/Stocktake"
# Document the stocktake wizard/dialog
```

---

## Phase 3: Dialog Field Mapping

For each transaction type dialog, document:

### Invoice Dialog Fields
| Field Name | Tab Order | Type | Required | Default | Notes |
|------------|-----------|------|----------|---------|-------|
| Customer | 1 | Lookup | Yes | - | Namecode |
| Date | 2 | Date | Yes | Today | |
| Due Date | 3 | Date | No | Calculated | |
| ... | ... | ... | ... | ... | ... |

### Line Item Entry
| Field | Tab Order | Type | Notes |
|-------|-----------|------|-------|
| Product Code | 1 | Lookup | |
| Description | 2 | Text | Auto-fills from product |
| Quantity | 3 | Number | |
| Unit Price | 4 | Currency | |
| Tax Code | 5 | Lookup | |
| ... | ... | ... | ... |

**Document how to:**
- Add new line item
- Delete line item
- Move between lines
- Access line item details

---

## Phase 4: Export All Data

### Task 4.1: Take Complete Snapshot

```bash
# Create baseline snapshot of all tables
bun packages/cli/src/index.ts snapshot remote-baseline

# List what was captured
ls -la .snapshots/remote-baseline/
```

### Task 4.2: Export via REST API

```bash
# Export key tables to JSON
for table in Transaction Detail Name Product Account TaxRate Job; do
  bun packages/cli/src/index.ts export $table --output .snapshots/remote-export/$table.json
done
```

### Task 4.3: Export via MoneyWorks Gold UI

Document the UI export process:
```bash
bun packages/cli/src/index.ts gold menu "File/Export Selection..."
# Screenshot the export dialog
# Document export options
```

---

## Phase 5: Error Handling & Edge Cases

### Task 5.1: Document Error Dialogs

Trigger and screenshot various error conditions:
- Try to save invalid data
- Try to post already-posted transaction
- Try to delete posted transaction
- Try duplicate invoice number
- Try invalid customer code

### Task 5.2: Document Validation Behaviors

- What happens when required field is empty?
- What happens with invalid date?
- What happens with negative quantities?
- How are calculation errors shown?

### Task 5.3: Document Confirmation Dialogs

- Post confirmation
- Delete confirmation
- Close without saving
- Any other confirmations

---

## Phase 6: Advanced Operations

### Task 6.1: Batch Operations

```bash
bun packages/cli/src/index.ts gold menu "Command/Batch Creditor Payments..."
bun packages/cli/src/index.ts gold menu "Command/Batch Debtor Receipts..."
```

Document these wizards step by step.

### Task 6.2: Banking Operations

```bash
bun packages/cli/src/index.ts gold menu "Command/Banking..."
bun packages/cli/src/index.ts gold menu "Command/Bank Reconciliation..."
```

### Task 6.3: Reports

```bash
bun packages/cli/src/index.ts gold menu-items Reports
# For key reports, document how to generate them
```

---

## Deliverables

Create the following files in `.claude/remote-jobs/results/`:

### 1. KEYBOARD-SHORTCUTS.md
Complete mapping of all keyboard shortcuts.

### 2. MENU-STRUCTURE.md
Complete menu hierarchy with all items and submenus.

### 3. NAVIGATOR-MAP.md
Coordinates and descriptions of all Navigator icons.

### 4. TRANSACTION-WORKFLOWS.md
Step-by-step workflows for each transaction type with:
- Screenshots at each step (reference paths)
- Exact click coordinates or keyboard sequences
- Field tab order
- Timing requirements (sleep durations needed)

### 5. DIALOG-FIELDS.md
Field mappings for all major dialogs.

### 6. ERROR-CATALOG.md
Screenshots and descriptions of error/warning dialogs.

### 7. SIDEBAR-FILTERS.md
Sidebar filter icons and their functions.

### 8. DATA-EXPORT.tar.gz
Archived snapshots and exports:
- .snapshots/remote-baseline/
- .snapshots/remote-export/

### 9. SCREENSHOTS.tar.gz
All screenshots taken during mapping.

### 10. AUTOMATION-SEQUENCES.md
Ready-to-use automation sequences in this format:

```typescript
// Create Sales Invoice
const createSalesInvoice = [
  { action: "menu", value: "Show/Transactions" },
  { action: "sleep", value: 500 },
  { action: "key", value: "cmd+n" },
  { action: "sleep", value: 500 },
  { action: "click", value: { x: 123, y: 456 } },  // Invoice type
  { action: "sleep", value: 200 },
  { action: "type", value: "CUST001" },  // Customer code
  { action: "key", value: "tab" },
  // ... continue for complete sequence
];
```

---

## Execution Notes

### Timing
- Always add sleep after menu/click/key actions
- 500ms minimum after menu opens
- 200ms minimum after key press
- 1000ms after dialog opens
- Increase if actions fail

### Screenshot Naming Convention
```
/tmp/mw-{phase}-{task}-{step}.png
Example: /tmp/mw-p2-invoice-01-new-dialog.png
```

### If Something Fails
1. Take a screenshot of current state
2. Document what was expected vs what happened
3. Try alternative approach
4. Document workaround if found

### Window Management
- Close windows between tests: `cmd+w`
- If stuck, try `cmd+.` to cancel
- If really stuck: `cmd+q` and restart MoneyWorks Gold

---

## Questions to Answer

While mapping, try to answer these questions:

1. **How does MW Gold handle multi-user?** Can two users edit same transaction?

2. **What's the posting workflow?**
   - Can you edit posted transactions?
   - Can you unpost?
   - What gets locked after posting?

3. **How are sequences generated?**
   - Invoice numbers (Ourref)
   - Transaction sequence numbers
   - Are they configurable?

4. **What's the period handling?**
   - Can you post to closed period?
   - How do you open/close periods?

5. **What integrations exist?**
   - IRD Connect (NZ tax)?
   - Bank feeds?
   - Other?

6. **What customization options exist?**
   - Custom fields?
   - Scripts?
   - Forms?

---

## Return Instructions

When complete:

1. **Commit all results to git:**
```bash
git add .claude/remote-jobs/results/
git add .snapshots/remote-baseline/
git add .snapshots/remote-export/
git commit -m "feat: Complete MW Gold UI mapping from remote agent"
```

2. **Create summary file:**
`.claude/remote-jobs/results/SUMMARY.md` with:
- What was completed
- What failed/couldn't be mapped
- Key discoveries
- Recommended next steps

3. **Push to feature branch:**
```bash
git checkout -b feature/mw-gold-mapping
git push origin feature/mw-gold-mapping
```

Or if same repo, just commit to current branch.

---

## Success Criteria

The job is complete when:

- [ ] All keyboard shortcuts Cmd+1 through Cmd+9 mapped
- [ ] All menu items documented
- [ ] Navigator icon coordinates captured
- [ ] At least 3 transaction workflows fully documented (Invoice, Payment, Credit Note)
- [ ] Complete data export of acme file
- [ ] All screenshots organized and archived
- [ ] SUMMARY.md written with findings

---

## Contact

If you encounter issues or have questions:
- Document the issue with screenshots
- Continue with other tasks
- Include in SUMMARY.md

Good luck! 🚀
