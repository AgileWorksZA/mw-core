# Claude-4 Deployment Package: Ledger Entity Generation

## 🎯 Your Mission
You are Claude-4 in a parallel processing team generating MoneyWorks entities.
Generate a complete semantic TypeScript definition for the **Ledger** entity using **official MoneyWorks documentation**.

## 📋 Complete Assignment

### Entity Details
- **Entity**: Ledger
- **Priority**: Critical (general ledger core - 200+ fields)
- **Complexity**: Very High (90+ balance history fields, budget tracking)
- **Reference Pattern**: Use the Name entity pattern as your template

### 🌐 Official Documentation Access
**CRITICAL**: Access the official MoneyWorks field descriptions here:
- **Primary URL**: https://cognito.co.nz/manual/moneyworks_appendix_appendix_afield_descriptions.html
- **Search for**: "Ledger" table documentation
- **Backup search**: Use web_search tool to find MoneyWorks Ledger appendix

Use web_search like this:
```
web_search("site:cognito.co.nz ledger table fields appendix")
```

### Key Semantic Fields to Focus On
Based on your source interface, focus on these critical enums:

```typescript
export enum LedgerType {
  // Based on Type field (char_short) - find official values
}

export enum SystemAccountType {
  // Based on System field (char_short) - find official values
}

export enum DepartmentCategory {
  // Based on Department field - find official values
}
```

## 📁 COMPLETE Source API Definition
Your TypeScript interface MUST cover all these fields from your codebase (showing first 20 fields of 200+):

```typescript
export interface Ledger {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** size="8" */
  AccountCode: string;
  /** @indexed size="6" */
  Department: string;
  /** @indexed size="8" */
  Category: string;
  /** @indexed size="6" */
  Classification: string;
  /** @indexed char_short */
  Type: string;
  
  // MASSIVE BALANCE HISTORY - 91 historical balance fields
  BalanceLast91: number;
  BalanceLast90: number;
  BalanceLast89: number;
  BalanceLast88: number;
  BalanceLast87: number;
  BalanceLast86: number;
  BalanceLast85: number;
  BalanceLast84: number;
  BalanceLast83: number;
  BalanceLast82: number;
  BalanceLast81: number;
  BalanceLast80: number;
  BalanceLast79: number;
  BalanceLast78: number;
  BalanceLast77: number;
  BalanceLast76: number;
  BalanceLast75: number;
  BalanceLast74: number;
  BalanceLast73: number;
  BalanceLast72: number;
  BalanceLast71: number;
  BalanceLast70: number;
  BalanceLast69: number;
  BalanceLast68: number;
  BalanceLast67: number;
  BalanceLast66: number;
  BalanceLast65: number;
  BalanceLast64: number;
  BalanceLast63: number;
  BalanceLast62: number;
  BalanceLast61: number;
  BalanceLast60: number;
  BalanceLast59: number;
  BalanceLast58: number;
  BalanceLast57: number;
  BalanceLast56: number;
  BalanceLast55: number;
  BalanceLast54: number;
  BalanceLast53: number;
  BalanceLast52: number;
  BalanceLast51: number;
  BalanceLast50: number;
  BalanceLast49: number;
  BalanceLast48: number;
  BalanceLast47: number;
  BalanceLast46: number;
  BalanceLast45: number;
  BalanceLast44: number;
  BalanceLast43: number;
  BalanceLast42: number;
  BalanceLast41: number;
  BalanceLast40: number;
  BalanceLast39: number;
  BalanceLast38: number;
  BalanceLast37: number;
  BalanceLast36: number;
  BalanceLast35: number;
  BalanceLast34: number;
  BalanceLast33: number;
  BalanceLast32: number;
  BalanceLast31: number;
  BalanceLast30: number;
  BalanceLast29: number;
  BalanceLast28: number;
  BalanceLast27: number;
  BalanceLast26: number;
  BalanceLast25: number;
  BalanceLast24: number;
  BalanceLast23: number;
  BalanceLast22: number;
  BalanceLast21: number;
  BalanceLast20: number;
  BalanceLast19: number;
  BalanceLast18: number;
  BalanceLast17: number;
  BalanceLast16: number;
  BalanceLast15: number;
  BalanceLast14: number;
  BalanceLast13: number;
  BalanceLast12: number;
  BalanceLast11: number;
  BalanceLast10: number;
  BalanceLast09: number;
  BalanceLast08: number;
  BalanceLast07: number;
  BalanceLast06: number;
  BalanceLast05: number;
  BalanceLast04: number;
  BalanceLast03: number;
  BalanceLast02: number;
  BalanceLast01: number;
  Balance: number;
  
  // BUDGET A HISTORY - 48 budget fields
  BudgetALast29: number;
  BudgetALast28: number;
  BudgetALast27: number;
  BudgetALast26: number;
  BudgetALast25: number;
  BudgetALast24: number;
  BudgetALast23: number;
  BudgetALast22: number;
  BudgetALast21: number;
  BudgetALast20: number;
  BudgetALast19: number;
  BudgetALast18: number;
  BudgetALast17: number;
  BudgetALast16: number;
  BudgetALast15: number;
  BudgetALast14: number;
  BudgetALast13: number;
  BudgetALast12: number;
  BudgetALast11: number;
  BudgetALast10: number;
  BudgetALast09: number;
  BudgetALast08: number;
  BudgetALast07: number;
  BudgetALast06: number;
  BudgetALast05: number;
  BudgetALast04: number;
  BudgetALast03: number;
  BudgetALast02: number;
  BudgetALast01: number;
  BudgetA: number;
  BudgetANext01: number;
  BudgetANext02: number;
  BudgetANext03: number;
  BudgetANext04: number;
  BudgetANext05: number;
  BudgetANext06: number;
  BudgetANext07: number;
  BudgetANext08: number;
  BudgetANext09: number;
  BudgetANext10: number;
  BudgetANext11: number;
  BudgetANext12: number;
  BudgetANext13: number;
  BudgetANext14: number;
  BudgetANext15: number;
  BudgetANext16: number;
  BudgetANext17: number;
  BudgetANext18: number;
  
  // BUDGET B HISTORY - 48 more budget fields
  BudgetBLast29: number;
  BudgetBLast28: number;
  BudgetBLast27: number;
  BudgetBLast26: number;
  BudgetBLast25: number;
  BudgetBLast24: number;
  BudgetBLast23: number;
  BudgetBLast22: number;
  BudgetBLast21: number;
  BudgetBLast20: number;
  BudgetBLast19: number;
  BudgetBLast18: number;
  BudgetBLast17: number;
  BudgetBLast16: number;
  BudgetBLast15: number;
  BudgetBLast14: number;
  BudgetBLast13: number;
  BudgetBLast12: number;
  BudgetBLast11: number;
  BudgetBLast10: number;
  BudgetBLast09: number;
  BudgetBLast08: number;
  BudgetBLast07: number;
  BudgetBLast06: number;
  BudgetBLast05: number;
  BudgetBLast04: number;
  BudgetBLast03: number;
  BudgetBLast02: number;
  BudgetBLast01: number;
  BudgetB: number;
  BudgetBNext01: number;
  BudgetBNext02: number;
  BudgetBNext03: number;
  BudgetBNext04: number;
  BudgetBNext05: number;
  BudgetBNext06: number;
  BudgetBNext07: number;
  BudgetBNext08: number;
  BudgetBNext09: number;
  BudgetBNext10: number;
  BudgetBNext11: number;
  BudgetBNext12: number;
  BudgetBNext13: number;
  BudgetBNext14: number;
  BudgetBNext15: number;
  BudgetBNext16: number;
  BudgetBNext17: number;
  BudgetBNext18: number;
  
  // FINAL FIELDS
  /** @indexed size="14" */
  Concat: string;
  /** @indexed char_short */
  System: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}
```

## 🔍 Research Process
1. **Access official docs** using web_search with MoneyWorks site
2. **Find Ledger appendix** with complete field descriptions
3. **Document enum values** from official sources (not guessed)
4. **Extract balance history meanings** and budget structures
5. **Map size constraints** exactly from documentation

## 🎯 Special Ledger Challenges
- **200+ fields**: Largest entity in MoneyWorks
- **Historical tracking**: 91 balance periods + 96 budget periods
- **Complex relationships**: Department, Category, Classification
- **Performance critical**: Core to all accounting operations

## ✅ Success Criteria Checklist
Before submitting your work, verify:

- [ ] **Accessed official MoneyWorks documentation** via web_search
- [ ] **Found Ledger table appendix** with enum values
- [ ] **All 200+ fields included** with correct types from source interface
- [ ] **Semantic enums sourced from docs** (LedgerType, SystemType, etc.)
- [ ] **Complete JSDoc documentation** with exact size constraints
- [ ] **Validation functions** with documented field limits
- [ ] **Query builder class** for type-safe ledger queries  
- [ ] **Utility functions** (getBalance, getBudgetVariance, isSystem, etc.)
- [ ] **TypeScript compiles** without errors
- [ ] **Generated file**: `generated/ledger.ts`

## 🚀 Begin Immediately
1. Use web_search to access MoneyWorks documentation
2. Find official Ledger field descriptions and enums
3. Generate complete semantic TypeScript following Name pattern
4. Use only documented enum values (never guess)
5. Save as `generated/ledger.ts`

**Focus on balance history accuracy. This entity is the foundation of all MoneyWorks accounting.** 