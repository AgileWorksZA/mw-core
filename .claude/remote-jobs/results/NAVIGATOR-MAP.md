# MoneyWorks Gold - Navigator Dashboard Map

> **Captured Date**: 2025-11-26
> **MoneyWorks Version**: MoneyWorks Gold
> **Data File**: Acme Widgets Gold.moneyworks

---

## Navigator Overview

The Navigator is the main dashboard that appears when all windows are closed. It provides a visual workflow diagram showing the business process flow and quick access to key areas.

**Screenshot**: `navigator-clean2.png`

---

## Main Workflow Sections

The Navigator is organized into three main workflow sections:

### 1. Sales and Income (Top Section)
**Visual Flow**: Quotes → Sales Orders → Sales Invoices → Customers → Sales Enquiry

### 2. Cash and Banking (Middle Section)
**Visual Flow**: Funds Transfer → Bank Reconciliation → Banking → Receipts → Import Bank Statement

### 3. Purchases and Expenses (Bottom Section)
**Visual Flow**: Purchase Orders → Receive Stock → Purchase Invoices → Suppliers → Purchase Enquiry

---

## Clickable Icons - Sales and Income Section

| Icon | Description | Opens | Window Title | Screenshot |
|------|-------------|-------|--------------|------------|
| Quotes | Document icon (left) | Transactions list | Transactions for Acme... | nav-quotes-click.png |
| Sales Orders | Document with arrow | *(No response - may need manual click)* | - | nav-sales-orders.png |
| Sales Invoices | Invoice document (center) | Transactions list | Transactions for Acme... | nav-sales-invoices.png |
| Customers | People icon (right) | Names list | Names | nav-customers.png |
| Sales Enquiry | Chart/graph icon | Sales analysis | *(To be tested)* | - |

**Orange Button**: "IT HAPPENS" - Workflow indicator (non-clickable)

---

## Clickable Icons - Cash and Banking Section

| Icon | Description | Opens | Window Title | Screenshot |
|------|-------------|-------|--------------|------------|
| Funds Transfer | Transfer icon (left) | *(To be tested)* | - | - |
| Bank Reconciliation | Building with checkmark | *(To be tested)* | - | - |
| Banking | Bank building (center) | Banking dialog | Banking | nav-banking.png |
| Receipts | Receipt document | *(To be tested)* | - | - |
| Import Bank Statement | Import icon (right) | *(To be tested)* | - | - |

---

## Clickable Icons - Purchases and Expenses Section

| Icon | Description | Opens | Window Title | Screenshot |
|------|-------------|-------|--------------|------------|
| Purchase Orders | Document icon (left) | *(To be tested)* | - | - |
| Receive Stock | Box with arrow | *(To be tested)* | - | - |
| Purchase Invoices | Invoice document (center) | Transactions list | Transactions for Acme... | nav-purchase-invoices.png |
| Suppliers | People icon (right) | Names list | Names | nav-suppliers.png |
| Purchase Enquiry | Chart icon | Purchase analysis | *(To be tested)* | - |

**Orange Button**: "IT PAYS US" - Workflow indicator (non-clickable)

---

## Right Sidebar Icons

The right sidebar provides quick access to core business entities:

| Icon | Label | Opens | Window Title | Keyboard Shortcut | Screenshot |
|------|-------|-------|--------------|-------------------|------------|
| 👥 | Customers | Names (filtered to customers) | Names | Cmd+2 | nav-customers.png |
| 🏢 | Suppliers | Names (filtered to suppliers) | Names | Cmd+2 | nav-suppliers.png |
| 📋 | Items | Products/stock items | Items | Cmd+3 | nav-items.png |
| 💼 | Jobs | Jobs/projects list | Jobs | Cmd+4 | - |
| 🏦 | Banking | Banking operations | Banking | - | nav-banking.png |
| 📊 | Reports | Report index | Index to Reports | - | nav-reports.png |
| ❓ | Enquiry | Enquiry tools | *(To be tested)* | - | - |

**Note**: The sidebar icons appear to be the primary navigation method from the Navigator. They are more reliable than the workflow diagram icons.

---

## Left Sidebar - Contextual Links

The left sidebar contains a hierarchical list of business functions:

### Structure (from screenshot)
```
Sales and Invoicing
  └─ Quotes and Estimates
  └─ Sales Invoices
  └─ Credit Notes
  └─ Customer Statements
  └─ Point of Sale/Invoicing
Purchases and Expenses
  └─ Purchase Orders
  └─ Purchase Invoices
  └─ Supplier Statements
Cash and Banking
  └─ Receive Payment
  └─ Make Payment
  └─ Banking
  └─ Bank Reconciliation
Reports
Time Billing
Assets
Customising
etc...
```

**Status**: These appear to be collapsible sections. Clicking behavior needs testing.

---

## Automation Recommendations

### ✅ Reliable Navigation Methods

1. **Keyboard Shortcuts** (Most Reliable)
   - Cmd+T for Transactions
   - Cmd+1 for Accounts
   - Cmd+2 for Names
   - Cmd+3 for Items
   - Cmd+4 for Jobs

2. **Menu Navigation** (Very Reliable)
   - Show → Transactions
   - Show → Names
   - Show → Items
   - Command → Banking...

3. **Sidebar Icons** (Tested & Working)
   - Click sidebar icons for quick access
   - Icons respond to manual clicks
   - Coordinates may vary based on window size

### ⚠️ Less Reliable for Automation

- **Workflow diagram icons**: Some icons may not respond to programmatic clicks
- **Left sidebar links**: Click behavior inconsistent programmatically
- **Orange "IT HAPPENS/IT PAYS US" buttons**: Appear to be visual indicators, not interactive

---

## Navigator Window Detection

The Navigator window can be detected by:
- **Window Title**: "Acme Widgets Gold.moneyworks @ 192.168.68.53"
- **No other windows open**: Only 1 window in `gold window` output
- **Menu**: Window → Navigator brings it to front

---

## Coordinate Mapping Challenges

### Issues Encountered

1. **Programmatic clicks don't always register** on Navigator icons
2. **Manual clicks work** but coordinates may shift based on:
   - Window size
   - Screen resolution
   - Navigator panel zoom level

3. **Accessibility API limitations**: MoneyWorks doesn't expose UI elements fully

### Workaround

For automation requiring Navigator interaction:
1. Use keyboard shortcuts instead of clicks where possible
2. Use menu navigation as fallback
3. For unavoidable clicks, use manual verification
4. Consider using AppleScript UI scripting with manual coordinate mapping

---

## Tested Icon Coordinates

**Note**: These coordinates worked with manual clicks but may not work programmatically. They're provided for reference only.

### Sales Section
- Quotes: ~(290, 142)
- Sales Invoices: *(User-clicked)*
- Customers: *(User-clicked)*

### Cash Section
- Banking: *(User-clicked)*

### Purchases Section
- Purchase Invoices: *(User-clicked)*
- Suppliers: *(User-clicked)*

### Sidebar
- Items: *(User-clicked)*
- Reports: *(User-clicked)*

---

## Alternative Navigation Strategy

Since Navigator icon clicking is unreliable for automation, **recommended approach**:

```typescript
// ❌ Don't do this
await gold.click(425, 142); // Sales Invoices icon

// ✅ Do this instead
await gold.key("cmd+t"); // Opens Transactions
// or
await gold.menu("Show/Transactions");
```

The Navigator serves primarily as a **visual guide** for users, not as the primary automation interface.

---

## Next Steps for Complete Mapping

1. **Manual click testing** of all workflow diagram icons
2. **Document left sidebar hierarchy** fully
3. **Test collapsible sections** in left sidebar
4. **Capture coordinates** at multiple screen resolutions
5. **Identify which icons are purely visual** vs interactive

---

## Summary

**Navigator Role**: Visual workflow guide + quick access sidebar
**Best for Automation**: Keyboard shortcuts and menu navigation
**Navigator Use Case**: Human workflow understanding, not automation
**Sidebar Icons**: Most reliable clickable elements on Navigator

The Navigator is MoneyWorks' way of showing users the business process flow visually. For automation, **bypass the Navigator** and use direct keyboard shortcuts or menu commands.
