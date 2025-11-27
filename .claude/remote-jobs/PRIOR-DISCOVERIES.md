# Prior Discoveries from Initial Exploration

This documents what was already discovered before this job started. Build on this, don't repeat.

## Working CLI Commands

The gold automation CLI is fully functional:

```bash
# Status check
bun packages/cli/src/index.ts gold status
# Output: ✅ MoneyWorks Gold is running
#         Window: acme.moneyworks @ 192.168.68.77

# Screenshot
bun packages/cli/src/index.ts gold screenshot -o output.png

# Menu access
bun packages/cli/src/index.ts gold menu "Show/Transactions"
bun packages/cli/src/index.ts gold menu-items "Command"

# Keyboard
bun packages/cli/src/index.ts gold key "cmd+1"
bun packages/cli/src/index.ts gold key "cmd+w"
bun packages/cli/src/index.ts gold key "tab"
bun packages/cli/src/index.ts gold key "enter"

# Typing
bun packages/cli/src/index.ts gold type "CUST001"

# Clicking (requires coordinates)
bun packages/cli/src/index.ts gold click 400 300

# Window info
bun packages/cli/src/index.ts gold window
```

## Menu Structure (Already Mapped)

### Menu Bar Items
```
Apple, MoneyWorks Gold, File, Edit, Select, Command, Show, Enquiries, Reports, Window, Help
```

**Note**: There is NO "Transactions" menu in the menu bar. Transactions are accessed via `Show/Transactions`.

### Show Menu (Complete)
- Transactions
- Transactions in new window
- Accounts
- Names
- Names in new window
- Items
- Items in new window
- Jobs
- Job Sheet Items
- Detail Line Items
- Detail Line Items in a new window
- Assets
- (separator)
- Budgets
- Balances
- (separator)
- Categories
- Departments
- Department Groups
- Classifications
- Asset Categories
- (separator)
- Period Names...
- Company Details...
- Tax Rates...
- Currencies
- Off-Ledger Values
- Validation Lists
- Auto Allocations
- (separator)
- Scripts
- Log File...
- (separator)
- Today's Messages
- Reminder Messages

### Command Menu (Complete)
- Post/Ship/Receive
- Adjustments
- Set Colour
- (separator)
- Print Payment...
- Print Statements
- Age Debtor Balances...
- (separator)
- Batch Creditor Payments...
- Batch Debtor Receipts...
- (separator)
- Banking...
- Transfer Funds...
- Change Currency Rate...
- Load Bank Statement...
- Bank Reconciliation...
- Electronic Payments...
- Open/Close Period...
- (separator)
- Build Product...
- Reorder Products
- Stocktake
- Asset Register
- Job Timesheet
- Bill Job...
- Work in Progress Journal...
- (separator)
- IRD Connect...

### File Menu (Complete)
- New
- Open…
- Connect...
- Open Recent
- (separator)
- Disconnect
- Save Document
- Save a Copy As...
- Save a Backup As...
- Rollback Document...
- (separator)
- Users & Security…
- Switch User...
- Signing...
- (separator)
- Close Window
- (separator)
- Page Setup…
- Print…
- (separator)
- Import
- Export Selection...
- Accountant's Export...
- (separator)
- Manage Services…
- (separator)
- Diagnostics...

## Keyboard Shortcuts (Partially Mapped)

| Shortcut | Opens | Confirmed |
|----------|-------|-----------|
| Cmd+1 | Accounts | ✅ |
| Cmd+2 | Names | ✅ |
| Cmd+3 | Products/Items | ✅ |
| Cmd+4 | Jobs | ✅ |
| Cmd+5 | ? | ❌ Test this |
| Cmd+6 | ? | ❌ Test this |
| Cmd+7 | ? | ❌ Test this |
| Cmd+8 | ? | ❌ Test this |
| Cmd+9 | ? | ❌ Test this |
| Cmd+0 | ? | ❌ Test this |
| Cmd+W | Close Window | ✅ |
| Cmd+N | New (context-dependent) | Needs testing |

## REST API Learnings

The REST API is also working. Key learnings:

### Transaction Types
| Type | Name | Description |
|------|------|-------------|
| DII | Debtor Item Invoice | Sales invoice |
| DIC | Debtor Item Credit | Credit note |
| CRD | Cash Receipt Debtor | Customer payment |
| CPD | Cash Payment Debtor | Refund to customer |
| CII | Creditor Item Invoice | Purchase invoice |
| CIC | Creditor Item Credit | Supplier credit |
| CRC | Cash Receipt Creditor | Refund from supplier |
| CPC | Cash Payment Creditor | Payment to supplier |
| CP | Cash Payment | General payment |
| JNL | Journal | Manual journal |

### Transaction Status
| Status | Meaning |
|--------|---------|
| U | Unposted (draft) |
| P | Posted (live) |

### Key Fields
- `Sequencenumber` - Primary key (auto-generated)
- `Ourref` - Invoice/document number
- `Namecode` - Customer/supplier code
- `Transdate` - Transaction date (YYYYMMDD format for import!)
- `Period` - Accounting period number
- `Gross` - Total amount (negative for credits/reversals)
- `Amtpaid` - Amount paid (for invoices)
- `Status` - U or P

### Important Discovery: Credit Notes
MoneyWorks "Reverse" operation does **in-place modification**:
- Type stays DII
- Gross becomes negative
- No new transaction created

This is different from creating a separate DIC credit note.

## Snapshots Already Taken

These snapshots exist (on the original machine):
- `baseline-scenarios` - Clean starting point
- `after-post-invoice` - After posting invoice 2131
- `after-payment` - After recording payment for 2131
- `after-credit-note` - After reversing invoice 2130

## Files Created

### Automation Code
- `packages/cli/src/commands/gold/automation.ts` - Core automation functions
- `packages/cli/src/commands/gold/index.ts` - CLI command handlers

### Skills Documentation
- `.claude/skills/moneyworks-data-import/SKILL.md` - Main import skill
- `.claude/skills/moneyworks-data-import/LEARNINGS.md` - All REST API learnings
- `.claude/skills/moneyworks-data-import/INVOICE-DUPLICATION.md` - Invoice copy workflow
- `.claude/skills/moneyworks-data-import/PAYMENT-RECEIPT.md` - Payment recording
- `.claude/skills/moneyworks-data-import/CREDIT-NOTE.md` - Credit note creation

## What Needs Discovery

1. **Complete keyboard shortcut mapping** (Cmd+5 through Cmd+0, function keys, etc.)

2. **Navigator dashboard icon coordinates** - The main dashboard has clickable icons but we don't have coordinates

3. **Transaction dialog field mapping** - What fields appear, in what order, for each transaction type

4. **New transaction workflow** - Exact steps to create invoice from scratch via UI

5. **Sidebar filter icons** - What the sidebar icons filter when viewing lists

6. **Dialog button locations** - OK, Cancel, Post, Save button coordinates/names

7. **Error dialogs** - What they look like, how to dismiss

8. **Submenus** - Some menu items have submenus (indicated by ▶) that need expansion

## Known Issues

1. **Accessibility API limitations** - MoneyWorks doesn't expose all UI elements via accessibility. Most buttons show as "missing value". We can see window titles but not button names.

2. **Window size reporting** - Window bounds sometimes report incorrectly (width=0).

3. **Menu timing** - Need sleep after menu operations. 500ms seems safe.

4. **Screenshot captures entire screen** - Window-specific capture sometimes fails, falls back to full screen.

## Tips for the Remote Agent

1. **Always screenshot after actions** - Visual confirmation is more reliable than accessibility API

2. **Use keyboard shortcuts when possible** - More reliable than clicking

3. **Close windows between tests** - Cmd+W to avoid window stacking confusion

4. **If stuck, try Cmd+.** - This often cancels dialogs

5. **Document failures too** - Knowing what doesn't work is valuable

6. **Test timing** - If something fails, try adding more sleep time

7. **The Navigator** - When all windows are closed, the main Navigator dashboard shows. This has clickable icons but we need coordinates.
