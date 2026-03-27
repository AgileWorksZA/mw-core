# STCK-001: Stocktake Report Artifact

## Why (Root Motivation)

Enable warehouse managers and accountants to quickly assess inventory health through AI-generated visual reports, identifying problem items (out-of-stock, negative stock) at a glance without manual spreadsheet analysis.

**5 Whys Analysis:**
1. Why? Users want to see stocktake data in the AI assistant
2. Why? MoneyWorks Stock Take Report data needs visual presentation
3. Why? Raw text tables are hard to scan for problem items
4. Why? Zero and negative stock items require immediate attention
5. Root: **Enable rapid inventory health assessment by visually highlighting problem items in AI-generated reports**

## Description

Implement a new `stocktake-report` artifact type for the MoneyWorks AI assistant. The artifact displays inventory status from a MoneyWorks Stock Take Report with:

- Company name and report date header
- Table with Code, Description, Stock On Hand columns
- Visual indicators: yellow for zero stock (out of stock), red for negative stock
- Summary statistics panel showing inventory health at a glance

### Sample Input Data
```
Acme Widgets Ltd
Stock Take Report - 2025-01-31 (showing current stock on hand)

Code    Description                         Actual SOH
BA100   Bronze Widget Medium                76
BA200   Bronze Widget Large                 0
BB100   Bronze Widget Bevelled Medium       102
BB200   Bronze Widget Bevelled Large        -53
BC100   Bronze Taper Widget Small           4
BC200   Bronze Taper Widget Medium          105
CA100   Chrome Widget Small                 62
CA200   Chrome Widget Medium                18
CB100   Chrome Bevelled Widget Large        25
CB200   Chrome Taper Widget Extra-large     58
CC100   Aluminium mini-widget               48
```

## Acceptance Criteria

- [ ] **AC-001**: StocktakeReportData interface defined in types.ts with items array (code, description, stockOnHand), company name, report date, and optional summary statistics
- [ ] **AC-002**: 'stocktake-report' added to ArtifactType union in types.ts
- [ ] **AC-003**: isStocktakeReportData() type guard function implemented in types.ts
- [ ] **AC-004**: StocktakeReport React component created in components/artifacts/stocktake-report.tsx with table layout showing Code, Description, Stock On Hand columns
- [ ] **AC-005**: Visual indicators implemented: yellow background for zero stock (out of stock), red background for negative stock
- [ ] **AC-006**: Summary statistics displayed: total items count, items with zero stock count, items with negative stock count
- [ ] **AC-007**: artifact-renderer.tsx updated with 'stocktake-report' case using defensive coding pattern (similar to department-pnl)

## Weave Knowledge

**Patterns Applied:**
- `E:artifact-implementation-5-step-pattern` - Standard 5-step artifact implementation: types, component, renderer, tool, prompt
- `E:discriminated-union-rendering-pattern` - Type-safe rendering with type guards and discriminated unions
- `E:artifact-code-block-pattern` - AI returns artifact data in fenced code blocks

**Best Practices to Follow:**
- `P:incremental-artifact-component-implementation` - Build with consistent patterns from existing components
- `P:typescript-conditional-spread-ternary` - Use ternary for conditional spreads to avoid TS2698

**Reference Implementations:**
- `department-pnl.tsx` - Defensive coding for AI-generated data with fallback defaults
- `trial-balance.tsx` - Simple table layout with visual status indicators and summary

## Implementation Notes

### Type Definition Structure
```typescript
export interface StocktakeItem {
  code: string;
  description: string;
  stockOnHand: number;
}

export interface StocktakeReportData {
  companyName?: string;
  asOf: string;  // Report date in YYYY-MM-DD format
  items: StocktakeItem[];
  summary?: {
    totalItems: number;
    zeroStockCount: number;
    negativeStockCount: number;
  };
}
```

### Visual Indicator Logic
```typescript
// Row background colors
if (stockOnHand < 0) return "bg-red-100 dark:bg-red-950/30";  // Negative stock
if (stockOnHand === 0) return "bg-amber-100 dark:bg-amber-950/30";  // Zero stock
return "";  // Normal stock
```

### Defensive Coding
Follow department-pnl pattern: assume AI may provide incomplete data, provide sensible defaults:
```typescript
const items = data.items || [];
const companyName = data.companyName || "Stock Take Report";
```

## Complexity: Simple
Estimated 2-4 hours. Single component, clear pattern to follow from existing artifacts, minimal logic.

## Priority: Medium
Useful for inventory management scenarios but not blocking other features.
