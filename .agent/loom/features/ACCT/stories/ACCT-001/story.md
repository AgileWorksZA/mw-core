# ACCT-001: Implement MoneyWorks Account Entity (Backend)

## Why (Root Motivation)

Enable complete financial data access and account-aware workflows throughout the MoneyWorks SDK ecosystem. Products reference Account codes (COGAcct, SalesAcct, StockAcct) and we need to access, validate, and display account information.

**5 Whys Analysis:**
1. Why? To access MoneyWorks Chart of Accounts data from the SDK
2. Why? Because Products reference Account codes and we need to validate/display them
3. Why? To enable full accounting workflows with account balances, types, relationships
4. Why? To maintain feature parity with Product and Name entities
5. Root: **Enable complete financial data access and account-aware workflows**

## Description

Implement the MoneyWorks Account entity with full backend parity to the existing Product implementation:

1. **Canonical Layer** - Pure MoneyWorks type definitions
2. **Data Layer** - Repository with CRUD and specialized queries
3. **API Layer** - Controller registered in TableRegistry

This follows the established pattern from Product (PROD-001) and Name entities.

## Acceptance Criteria

- [ ] **AC-001**: Canonical types defined in `packages/canonical/src/entities/accounts/` with MoneyWorksAccount interface, enums (AccountType, AccountStatus), and branded AccountCode type
- [ ] **AC-002**: AccountRepository extends BaseMoneyWorksRepository with postProcess() for numeric/boolean parsing and branded types, prepare() for MW format conversion
- [ ] **AC-003**: AccountRepository includes specialized query methods: findByCode(), findByType(), findActiveAccounts(), findBalanceSheetAccounts(), findByCategory()
- [ ] **AC-004**: AccountController extends BaseTableController and is registered in TableRegistry - Account appears in GET /api/v1/tables 'available' list
- [ ] **AC-005**: TypeScript compilation passes with zero errors (bun run typecheck)

## Weave Knowledge

**Patterns Applied:**
- `E:pattern-repository-base` - BaseMoneyWorksRepository extension pattern
- `E:pattern-canonical-pure-dsl` - Pure MoneyWorks DSL terminology preservation

**Pain Points to Avoid:**
- `Q:painpoint-controller-registration` - MUST register controller in TableRegistry or entity stays in 'upcoming'

**Obligations:**
- `Δ:obligation-full-stack-entity` - Include ALL required layers (canonical, data, API)

## Reference Implementation

**Product Entity Pattern:**
- Canonical: `packages/canonical/src/entities/products/` (types.ts, enums.ts, index.ts)
- Repository: `packages/data/src/repositories/product.repository.ts`
- Controller: `packages/api/src/controllers/product.ts`
- Registration: `packages/api/src/registry/table-registry.ts` line 34

## MoneyWorks Account Fields (Expected)

Based on MoneyWorks documentation:
- **Code** - Account code (primary key, branded type AccountCode)
- **Name** - Account name/description
- **Type** - Account type (Asset, Liability, Equity, Income, Expense)
- **SubType** - Sub-classification within type
- **Balance** - Current balance
- **OpeningBalance** - Opening balance for period
- **BankAccount** - Bank account number (for bank accounts)
- **Category1-4** - User-defined categories
- **Active** - Whether account is active
- **ControlAccount** - For control/summary accounts
- **GST/Tax fields** - For tax tracking

## Complexity: Moderate
## Priority: High

## Notes

- Scope limited to backend only (no web UI)
- Web UI routes can be added in a future story (ACCT-002)
- Account entity is fundamental - referenced by Product, TaxRate, Transaction entities
