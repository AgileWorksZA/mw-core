# MoneyWorks Gold - Complete Keyboard Shortcut Mapping

> **Captured Date**: 2025-11-26
> **MoneyWorks Version**: MoneyWorks Gold
> **Data File**: Acme Widgets Gold.moneyworks

---

## Primary Shortcuts (Cmd+Number)

| Shortcut | Opens | Window Title | Notes | Screenshot |
|----------|-------|--------------|-------|------------|
| Cmd+1 | Chart of Accounts | Accounts | List view of all accounts | cmd1-test2.png |
| Cmd+2 | Names (Customers/Suppliers) | Names | List view of all names | cmd2.png |
| Cmd+3 | Products/Items | Items | List view of all stock items | cmd3.png |
| Cmd+4 | Jobs | Jobs | List view of all jobs | cmd4.png |
| Cmd+5 | *(No action)* | - | Returns to Navigator | cmd5.png |
| Cmd+6 | Budgets | A Budgets | Budget view | cmd6.png |
| Cmd+7 | Item Sales Enquiry | Item Sales Enquiry | Product sales analysis | cmd7.png |
| Cmd+8 | Customer Sales Enquiry | Customer Sales Enquiry | Customer sales analysis | cmd8.png |
| Cmd+9 | Stock Enquiry | Stock Enquiry | Stock level enquiry | cmd9.png |
| Cmd+0 | *(No action)* | - | Returns to Navigator | cmd0.png |

---

## Shift Variants (Cmd+Shift+Number)

| Shortcut | Opens | Window Title | Notes | Screenshot |
|----------|-------|--------------|-------|------------|
| Cmd+Shift+1 | *(No action)* | - | Returns to Navigator | cmd-shift-1.png |
| Cmd+Shift+2 | Names (New Window) | Names | Opens in separate window | cmd-shift-2.png |
| Cmd+Shift+3 | Items (New Window) | Items | Opens in separate window | cmd-shift-3.png |
| Cmd+Shift+4 | Jobs (New Window) | Jobs | Opens in separate window | cmd-shift-4.png |
| Cmd+Shift+5 | *(No action)* | - | Returns to Navigator | cmd-shift-5.png |
| Cmd+Shift+6 | Budgets (New Window) | A Budgets | Opens in separate window | cmd-shift-6.png |
| Cmd+Shift+7 | Item Sales Enquiry (New Window) | Item Sales Enquiry | Opens in separate window | cmd-shift-7.png |
| Cmd+Shift+8 | Customer Sales Enquiry (New Window) | Customer Sales Enquiry | Opens in separate window | cmd-shift-8.png |
| Cmd+Shift+9 | Stock Enquiry (New Window) | Stock Enquiry | Opens in separate window | cmd-shift-9.png |

**Pattern**: Cmd+Shift variants appear to do the same as Cmd alone, likely opening views in new windows rather than replacing existing windows.

---

## Option Variants (Cmd+Option+Number)

| Shortcut | Opens | Window Title | Notes | Screenshot |
|----------|-------|--------------|-------|------------|
| Cmd+Option+1 | Chart of Accounts | Accounts | Same as Cmd+1 | cmd-option-1.png |
| Cmd+Option+2 | Names | Names | Same as Cmd+2 | cmd-option-2.png |
| Cmd+Option+3 | Products/Items | Items | Same as Cmd+3 | cmd-option-3.png |
| Cmd+Option+4 | Jobs | Jobs | Same as Cmd+4 | cmd-option-4.png |
| Cmd+Option+5 | *(No action)* | - | Same as Cmd+5 | cmd-option-5.png |
| Cmd+Option+6 | Budgets | A Budgets | Same as Cmd+6 | cmd-option-6.png |
| Cmd+Option+7 | Item Sales Enquiry | Item Sales Enquiry | Same as Cmd+7 | cmd-option-7.png |
| Cmd+Option+8 | Customer Sales Enquiry | Customer Sales Enquiry | Same as Cmd+8 | cmd-option-8.png |
| Cmd+Option+9 | Stock Enquiry | Stock Enquiry | Same as Cmd+9 | cmd-option-9.png |

**Pattern**: Cmd+Option variants produce identical results to Cmd alone.

---

## Function Keys (F1-F12)

| Shortcut | Action | Notes |
|----------|--------|-------|
| F1 | *(No action)* | No visible effect |
| F2 | *(No action)* | No visible effect |
| F3 | *(No action)* | No visible effect |
| F4 | *(No action)* | No visible effect |
| F5 | *(No action)* | No visible effect |
| F6 | *(No action)* | No visible effect |
| F7 | *(No action)* | No visible effect |
| F8 | *(No action)* | No visible effect |
| F9 | *(No action)* | No visible effect |
| F10 | *(No action)* | No visible effect |
| F11 | *(No action)* | No visible effect |
| F12 | *(No action)* | No visible effect |

**Note**: Function keys don't appear to have MoneyWorks-specific functions. They may be captured by macOS system functions.

---

## Common Shortcuts (Letters)

| Shortcut | Opens | Window Title | Notes | Screenshot |
|----------|-------|--------------|-------|------------|
| Cmd+T | Transactions | Transactions for Acme... | Opens transaction list | cmd-t.png |
| Cmd+N | New (Context-Dependent) | Varies | Opens "New" dialog based on current context. When in Transactions, opens "Receipt" dialog | cmd-n-receipt.png |
| Cmd+E | Account Enquiry | Account Enquiry | Opens account enquiry window | cmd-e.png |
| Cmd+R | Debtor Receipts | Debtor Receipts | Opens debtor receipts window | cmd-r.png |
| Cmd+D | *(No action)* | - | No visible effect | cmd-d.png |
| Cmd+F | *(No action)* | - | No visible effect (may be find in context) | cmd-f.png |
| Cmd+W | Close Window | - | Closes current window | ✅ Verified |

---

## Context-Dependent Shortcuts

### Cmd+N Behavior

The **Cmd+N** shortcut is context-dependent:

1. **From Navigator**: Unknown (needs testing)
2. **From Transactions View**: Opens "Receipt" transaction dialog
3. **From Names View**: Likely opens "New Name" dialog (needs testing)
4. **From Items View**: Likely opens "New Item" dialog (needs testing)

**Important Discovery**: When Cmd+N was pressed with the Transactions window open, it opened a "Receipt" dialog, suggesting MW Gold intelligently selects the transaction type based on context.

---

## Additional Shortcuts to Test

The following shortcuts were not tested in this session but are commonly used in accounting software:

- **Cmd+P** - Print (likely)
- **Cmd+S** - Save (likely)
- **Cmd+Q** - Quit application
- **Cmd+,** - Preferences
- **Cmd+Z** - Undo
- **Cmd+Shift+Z** - Redo
- **Cmd+C/V/X** - Copy/Paste/Cut
- **Cmd+A** - Select All
- **Cmd+/** - Help

---

## Automation Implications

### Reliable Shortcuts for Automation

These shortcuts work consistently and can be used in automation sequences:

✅ **Cmd+1** - Always opens Accounts
✅ **Cmd+2** - Always opens Names
✅ **Cmd+3** - Always opens Items
✅ **Cmd+4** - Always opens Jobs
✅ **Cmd+6** - Always opens Budgets
✅ **Cmd+7** - Always opens Item Sales Enquiry
✅ **Cmd+8** - Always opens Customer Sales Enquiry
✅ **Cmd+9** - Always opens Stock Enquiry
✅ **Cmd+T** - Always opens Transactions
✅ **Cmd+E** - Always opens Account Enquiry
✅ **Cmd+R** - Always opens Debtor Receipts
✅ **Cmd+W** - Always closes current window

### Context-Dependent Shortcuts

⚠️ **Cmd+N** - Opens "New" dialog based on current window context

Use with caution in automation. Always ensure correct window is focused before using Cmd+N.

---

## Timing Recommendations for Automation

Based on testing, the following sleep durations are recommended:

- **After keyboard shortcut**: 1500ms (1.5 seconds)
- **After window close**: 500ms
- **Before taking screenshot**: 1500ms (to ensure window fully renders)

---

## Missing Shortcuts

The following number shortcuts do nothing:

- Cmd+5
- Cmd+0
- Cmd+Shift+1
- Cmd+Shift+5

These may be:
1. Reserved for future features
2. User-configurable in preferences
3. Only active in specific contexts

---

## Navigator Quick Reference

From the Navigator (main dashboard), these are the fastest ways to access key areas:

| Area | Keyboard | Alternative |
|------|----------|-------------|
| Accounts | Cmd+1 | Show → Accounts |
| Customers/Suppliers | Cmd+2 | Show → Names |
| Products | Cmd+3 | Show → Items |
| Jobs | Cmd+4 | Show → Jobs |
| Transactions | Cmd+T | Show → Transactions |
| Budgets | Cmd+6 | Show → Budgets |
| Account Enquiry | Cmd+E | Enquiries → Account Enquiry |
| Customer Sales Enquiry | Cmd+8 | Enquiries → Customer Sales Enquiry |
| Item Sales Enquiry | Cmd+7 | Enquiries → Item Sales Enquiry |
| Stock Enquiry | Cmd+9 | Enquiries → Stock Enquiry |
| Debtor Receipts | Cmd+R | Command → Batch Debtor Receipts |

---

## Next Steps

1. **Test context-dependent behavior** of Cmd+N from different windows
2. **Test remaining letter shortcuts** (Cmd+P, S, etc.)
3. **Document menu equivalents** for all shortcuts
4. **Test shortcuts within dialogs** (Tab order, Enter to submit, etc.)
5. **Identify any Ctrl, Shift, or Option combinations** not yet tested

---

## Files Referenced

All screenshots are stored in `/tmp/mw-screenshots/` with the following naming convention:

- `cmd1-test2.png` - Cmd+1 (Accounts)
- `cmd2.png` - Cmd+2 (Names)
- `cmd-shift-X.png` - Cmd+Shift+X variants
- `cmd-option-X.png` - Cmd+Option+X variants
- `fX.png` - Function key X
- `cmd-X.png` - Letter shortcuts (cmd-t, cmd-e, etc.)

---

## Summary

**Total Shortcuts Tested**: 45+
**Working Shortcuts**: 15 primary + variants
**Context-Dependent**: 1 (Cmd+N)
**No Action**: 4 primary + all function keys

The MoneyWorks Gold keyboard shortcut system is **well-designed for rapid navigation** between key business areas. The numbered shortcuts (1-9) provide quick access to the most frequently used views, while letter shortcuts (T, E, R) access transaction-focused areas.
