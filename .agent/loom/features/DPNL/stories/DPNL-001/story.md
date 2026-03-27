# DPNL-001: Department Profit & Loss Report Artifact

## Why (Root Motivation)

Enable data-driven management decisions by providing comparative departmental performance visibility directly in the AI assistant, eliminating the friction of exporting to Excel for multi-period P&L analysis.

**5 Whys Analysis:**
1. Why? We need a Department Profit and Loss report - to see financial performance broken down by business units
2. Why? Department-level visibility is important - to identify which parts of the business are profitable vs. underperforming
3. Why? Management needs this - to make informed resource allocation and strategic decisions
4. Why? This is a priority now - users need multi-period comparisons (YTD across years) without exporting to Excel
5. Root: **Enable data-driven management decisions through comparative departmental P&L visibility**

## Description

Implement a 'department-pnl' artifact type for the MoneyWorks AI assistant that displays a multi-period Profit & Loss report by department. The report follows the standard MoneyWorks P&L structure:

**Report Structure:**
- Header with company name and report title
- Multiple period columns (e.g., Mar:2022/23, Mar:2023/24, Jan:2024/25)
- Sections:
  - **SALES** (4xxx accounts) - income accounts
  - **COST OF SALES** (6xxx accounts) - direct costs
  - **GROSS MARGIN** (Sales - COS) - calculated
  - **OTHER INCOME** (5xxx accounts)
  - **NET INCOME** (Gross Margin + Other Income) - calculated
  - **EXPENSES** (7xxx accounts)
  - **PROFIT/LOSS** (Net Income - Expenses) - calculated
- Each section shows:
  - Individual accounts with code, name, and values per period
  - Section subtotals
  - Percent change from previous year (where applicable)

**Features:**
- Configurable number of comparison periods (default 3 years YTD)
- Optional department filtering (company-wide if no departments)
- Collapsible/expandable sections
- Semantic coloring (green for positive, red for negative)
- Responsive multi-period column layout

## Acceptance Criteria

- [ ] **AC-001**: ArtifactType union in types.ts includes 'department-pnl'
- [ ] **AC-002**: PnLLineItem interface defines: code, name, values[], percentChange
- [ ] **AC-003**: DepartmentPnLData interface defines: companyName, reportTitle, periods[], department?, currency, sections
- [ ] **AC-004**: Component displays header with company name, title, and period columns
- [ ] **AC-005**: Component renders expandable P&L sections (Sales, COS, Gross Margin, Other Income, Net Income, Expenses, Profit/Loss)
- [ ] **AC-006**: Each section shows account rows with code, name, period values, plus subtotal
- [ ] **AC-007**: Percent change column with semantic coloring (green positive, red negative)
- [ ] **AC-008**: ArtifactRenderer.tsx includes 'department-pnl' case with type guard
- [ ] **AC-009**: mw_report tool includes 'department_pnl' with numberOfPeriods, department, asOf parameters
- [ ] **AC-010**: Report correctly categorizes accounts (IN/SA=Sales, CS/CG=COS, OI=Other Income, EX/OH=Expenses)
- [ ] **AC-011**: Report calculates: Gross Margin, Net Income, Profit/Loss
- [ ] **AC-012**: Department filtering works when department parameter provided
- [ ] **AC-013**: System prompt documents department-pnl artifact with example JSON
- [ ] **AC-014**: TypeScript compilation passes with zero errors
- [ ] **AC-015**: AI generates department P&L via natural language with configurable periods

## Weave Knowledge

**Patterns Applied:**
- `E:artifact-implementation-5-step-pattern` - Standard 5-step artifact implementation workflow
- `E:discriminated-union-rendering-pattern` - Type-safe component selection via union types
- `E:artifact-code-block-pattern` - Code block transport for structured artifact data
- `E:canonical-dsl-pattern` - Preserve MoneyWorks terminology (GST, account codes)

**Best Practices Followed:**
- `Q:preserve-canonical-dsl` - Use exact MW account type codes (IN, SA, CS, EX, etc.)
- `Q:multi-format-support` - Support multiple period configurations
- `Pi:incremental-artifact-component-implementation` - Build on established artifact patterns

**Reference Implementation:**
- `ledger-report.tsx` - Collapsible sections, multi-column layout
- `daily-transaction-summary.tsx` - P&L summary calculations
- `balance-sheet.tsx` - Financial statement structure

## Tasks

| ID | Title | Agent | Dependencies | Status |
|----|-------|-------|--------------|--------|
| T-001 | Add DepartmentPnLData interfaces to types.ts | backend-dev | - | pending |
| T-002 | Create DepartmentPnL React component | frontend-dev | T-001 | pending |
| T-003 | Integrate component into ArtifactRenderer | frontend-dev | T-001, T-002 | pending |
| T-004 | Add department_pnl definition to mw-report.ts | backend-dev | - | pending |
| T-005 | Implement department_pnl report generation | backend-dev | T-004 | pending |
| T-006 | Update system prompt documentation | backend-dev | T-001 | pending |
| T-007 | TypeScript compilation verification | qa | T-001-T-006 | pending |
| T-008 | Integration test: AI artifact generation | qa | T-007 | pending |

## Technical Notes

**MoneyWorks Account Type Codes:**
- IN, SA = Sales/Income (P&L)
- CS, CG = Cost of Sales/Cost of Goods (P&L)
- OI = Other Income (P&L)
- EX, OH = Expenses/Overhead (P&L)

**Period Calculation:**
- YTD calculation: From fiscal year start to asOf date
- Period labels format: "MMM:YYYY/YY" (e.g., "Mar:2023/24")
- Support fiscal year boundaries different from calendar year

**Department Filtering:**
- If MoneyWorks file has departments configured, filter Detail postings by department code
- If no departments, show company-wide totals
- Department parameter is optional

## Complexity: Moderate
## Priority: High
