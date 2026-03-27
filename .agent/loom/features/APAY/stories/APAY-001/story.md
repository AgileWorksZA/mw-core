# APAY-001: Aged Payables Report Artifact

## Why (Root Motivation)

Enable proactive cash flow management by providing clear visibility into payment obligations organized by aging buckets - helping users prioritize payments, maintain supplier relationships, avoid late payment penalties, and understand their payables position at a glance.

**5 Whys Analysis:**
1. Why? We need to display supplier payment aging in the AI assistant
2. Why? Users need to understand which supplier invoices are overdue and by how long
3. Why? To prioritize payments, maintain supplier relationships, and manage cash flow
4. Why? Late payments incur penalties, damage supplier relationships, and indicate poor financial health
5. Root: **Enable proactive cash flow management through clear visibility into payment obligations**

## Description

Implement a new 'aged-payables' artifact type for the AI assistant that displays supplier payment aging organized by aging buckets (Current, 1 month, 2 months, 3+ months). The report follows the MoneyWorks Aged Payables report format with:

- **Summary View**: One row per supplier showing aging bucket totals
- **Detailed View**: Expandable supplier rows showing individual invoices when invoice data is provided
- **Visual Indicators**: Progressive urgency styling (red for 3+ months, amber for 2 months)
- **Totals Row**: Summary totals matching MoneyWorks "Accounts Payable as at" figure

### MoneyWorks Report Format Reference

Based on `docs/ms-wreports/aged-payables-*.txt`:

**Columns**: Code | Phone | Name | 3 months+ | 2 months | 1 month | Current | GST | Total

**Report Options** (from settings screenshots):
- Age By: Period (default)
- Show Invoices: Toggle detail view
- Show Tax: Toggle GST column
- Omit Zero Balances: Hide suppliers with no outstanding balance
- By Currency: Group by currency for multi-currency files

## Acceptance Criteria

- [ ] **AC-001**: AgedPayablesData interface defined in types.ts with supplier array containing: code, name, phone, aging buckets (current, oneMonth, twoMonths, threeMonthsPlus), gst, and total fields

- [ ] **AC-002**: AgedPayablesSupplier interface supports optional invoices array for detailed view - each invoice has: accountCode, lineIndex, reference, date, description, aging bucket amounts, gst, and total

- [ ] **AC-003**: 'aged-payables' added to ArtifactType union in types.ts

- [ ] **AC-004**: isAgedPayablesData() type guard function implemented in types.ts checking for 'suppliers' array and 'asAt' field

- [ ] **AC-005**: AgedPayablesReport React component displays table with columns: Code, Phone, Name, 3 months+, 2 months, 1 month, Current, GST, Total - matching MoneyWorks report format

- [ ] **AC-006**: Visual indicators implemented: red/warning background for 3+ months overdue amounts, amber for 2 months, progressive urgency styling

- [ ] **AC-007**: Expandable supplier rows when invoices are provided - clicking supplier expands to show individual invoice details with same aging columns

- [ ] **AC-008**: Summary totals row displayed at bottom with aging bucket totals and grand total matching 'Accounts Payable as at' figure from MoneyWorks

## Weave Knowledge

**Patterns Applied:**
- `E:artifact-implementation-5-step-pattern` - Standard artifact creation workflow
- `E:discriminated-union-rendering-pattern` - Type-safe artifact rendering
- `E:artifact-code-block-pattern` - AI-generated artifact code blocks

**Reference Implementations:**
- `department-pnl.tsx` - Expandable/collapsible sections pattern
- `stocktake-report.tsx` - Visual indicators (red/amber backgrounds)
- `aged-payables-3.txt` - MoneyWorks report format with invoice details

## Data Structure

```typescript
interface AgedPayablesInvoice {
  accountCode: string;      // e.g., "2500"
  lineIndex: number;        // MoneyWorks line index
  reference: string;        // Invoice reference
  date: string;             // YYYY-MM-DD format
  description: string;      // "Supplier Name Memo"
  threeMonthsPlus: number;  // 3+ months bucket
  twoMonths: number;        // 2 months bucket
  oneMonth: number;         // 1 month bucket
  current: number;          // Current bucket
  gst: number;              // GST/Tax amount
  total: number;            // Invoice total
}

interface AgedPayablesSupplier {
  code: string;             // Supplier code (e.g., "BSUPP")
  name: string;             // Supplier name
  phone?: string;           // Contact phone
  threeMonthsPlus: number;  // 3+ months bucket total
  twoMonths: number;        // 2 months bucket total
  oneMonth: number;         // 1 month bucket total
  current: number;          // Current bucket total
  gst: number;              // Total GST
  total: number;            // Total outstanding
  invoices?: AgedPayablesInvoice[];  // Optional invoice details
}

interface AgedPayablesData {
  companyName?: string;
  reportTitle?: string;
  asAt: string;             // "Jan:2024/25" or "2025-01-31"
  currency?: string;
  suppliers: AgedPayablesSupplier[];
  totals: {
    threeMonthsPlus: number;
    twoMonths: number;
    oneMonth: number;
    current: number;
    gst: number;
    total: number;
  };
  accountsPayableTotal?: number;  // "Accounts Payable as at" verification
  generatedAt?: string;
}
```

## Complexity: Moderate
## Priority: Medium

**Rationale**:
- Similar complexity to department-pnl (expandable sections)
- Adds stocktake-style visual indicators
- Follows established artifact patterns
- Estimated 4-6 hours including testing
