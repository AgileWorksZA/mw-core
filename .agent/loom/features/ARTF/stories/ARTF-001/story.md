# ARTF-001: Implement Professional Artifact Display System for AI Chat

## Why (Root Motivation)

Transform AI-generated financial insights into presentation-quality reports that match professional accounting software output, enabling confident decision-making by accountants and business owners.

**5 Whys Analysis:**
1. Why? When AI generates financial reports, they appear as raw markdown text in chat - hard to read and unprofessional
2. Why? Financial data needs structure: aligned columns, charts for trends, KPI cards. Markdown tables lack authority and clarity
3. Why? MoneyWorks users are accountants/business owners making financial decisions - they expect Excel/PDF quality, not chat bubbles
4. Why? Markdown has limits: no interactive charts, no drill-down tables, no proper currency/percentage formatting
5. Root: **Enable confident business decisions through professional financial visualizations that match accounting software standards**

## Description

Transform the AI chat interface from a single-panel markdown-only display into a professional split-panel layout:

**Architecture:**
- **Left Panel (60%)**: Conversational chat messages and input (existing functionality, narrower)
- **Right Panel (40%)**: Artifact display area for structured financial reports and visualizations

**Hybrid Rendering Approach:**
- AI returns structured JSON with `artifacts` array containing typed data
- UI maps artifact types to pre-built React components
- Components handle rendering with proper financial formatting

**Artifact Types:**
- `balance_sheet` - Hierarchical financial position report
- `trial_balance` - Account listing with debit/credit columns
- `chart` - Recharts-based visualizations (pie, bar, line)
- `table` - Generic tabular data with sorting/pagination
- `metrics` - KPI cards with trends

**AI Response Structure:**
```typescript
interface AIResponse {
  message: string;  // Chat text
  artifacts?: Artifact[];
}

interface Artifact {
  id: string;
  title: string;
  type: "balance_sheet" | "trial_balance" | "chart" | "table" | "metrics";
  data: Record<string, unknown>;
}
```

**Responsive Behavior:**
- Desktop: Side-by-side panels with draggable divider
- Mobile: Artifacts inline or in modal/drawer overlay
- Panel collapses when no artifacts present

## Acceptance Criteria

- [ ] **AC-001**: Split-panel layout renders with chat on left (60% width) and artifact panel on right (40% width) on desktop viewports
- [ ] **AC-002**: Artifact panel is collapsible/hidden when no artifacts are present, expanding chat to full width
- [ ] **AC-003**: On mobile viewports (< 768px), artifacts display inline within chat or in a modal/drawer overlay
- [ ] **AC-004**: AIResponse interface includes optional artifacts array with Artifact type containing id, title, type, and data fields
- [ ] **AC-005**: MetricCard component renders single KPI values with label, value, optional trend indicator, and optional comparison
- [ ] **AC-006**: DataTable component renders tabular data with sortable columns, optional pagination, and proper financial formatting (currency, percentages)
- [ ] **AC-007**: PieChart component (using Recharts) renders categorical data with labels, tooltips, and legend
- [ ] **AC-008**: BarChart component (using Recharts) renders comparative data with axis labels, tooltips, and optional stacking
- [ ] **AC-009**: LineChart component (using Recharts) renders time-series data with axis labels, tooltips, and multiple series support
- [ ] **AC-010**: BalanceSheet artifact type renders with Assets/Liabilities/Equity sections, proper indentation, and totals
- [ ] **AC-011**: TrialBalance artifact type renders with Account/Debit/Credit columns and balanced totals row
- [ ] **AC-012**: When multiple artifacts are generated, artifact panel shows tabs or stacked cards to navigate between them
- [ ] **AC-013**: anthropic.server.ts updated to instruct Claude to return artifacts array when generating financial reports
- [ ] **AC-014**: Action response type updated to include artifacts in the response shape returned to client
- [ ] **AC-015**: Recharts library installed and configured in packages/ai/package.json
- [ ] **AC-016**: TypeScript compilation passes with zero errors for all artifact-related files
- [ ] **AC-017**: Dev server starts successfully and split-panel UI loads without errors

## Weave Knowledge

**Patterns Applied:**
- `E:react-router-7-explicit-routing-pattern` - Follow RR7 conventions for route structure
- `E:tailwind-v4-vite-plugin-pattern` - Use Tailwind v4 with Vite plugin for styling
- `E:anthropic-toolrunner-pattern` - Integrate artifact generation with existing tool runner

**Pain Points to Avoid:**
- `Q:react-radix-type-conflict-painpoint` - Use native HTML or verified shadcn components due to React 18/19 type conflicts

**Best Practices:**
- `Pi:evidence-based-ac-validation` - Collect concrete evidence for each acceptance criterion

**Reference Implementation:**
- Current chat: `packages/ai/app/routes/_index.tsx` - Transform single panel to split layout
- UI components: `packages/ai/app/components/ui/` - Existing shadcn components to extend

## Technical Notes

**Recharts Selection Rationale:**
- Lightweight (~200KB gzipped) vs alternatives (D3 ~250KB, Chart.js ~200KB)
- React-native composition model
- Excellent TypeScript support
- Built-in responsive containers
- Active maintenance and documentation

**Component Data Shapes:**

```typescript
// MetricCard
interface MetricCardData {
  label: string;
  value: number | string;
  format?: "currency" | "percentage" | "number";
  trend?: { direction: "up" | "down" | "flat"; percentage: number };
  comparison?: { label: string; value: number | string };
}

// DataTable
interface DataTableData {
  columns: Array<{ key: string; label: string; format?: string; align?: "left" | "right" }>;
  rows: Array<Record<string, unknown>>;
  pagination?: { page: number; pageSize: number; total: number };
}

// Chart (shared base)
interface ChartData {
  chartType: "pie" | "bar" | "line";
  data: Array<Record<string, unknown>>;
  config: {
    xKey?: string;
    yKey?: string;
    categoryKey?: string;
    valueKey?: string;
    series?: Array<{ key: string; name: string; color?: string }>;
  };
}

// BalanceSheet
interface BalanceSheetData {
  asOf: string;
  sections: {
    assets: { items: LineItem[]; total: number };
    liabilities: { items: LineItem[]; total: number };
    equity: { items: LineItem[]; total: number };
  };
}

// TrialBalance
interface TrialBalanceData {
  asOf: string;
  accounts: Array<{ code: string; name: string; debit: number; credit: number }>;
  totals: { debit: number; credit: number };
}
```

## Complexity: Complex
## Priority: High

---

*Story created: 2025-11-27*
*Feature: ARTF - Artifact Display System*
