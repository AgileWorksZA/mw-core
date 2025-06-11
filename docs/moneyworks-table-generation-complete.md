# MoneyWorks Table Generation - Complete Guide

## Overview

This document provides a complete guide for generating TypeScript interfaces for ALL MoneyWorks tables, including the exceptional tables that were discovered outside the initial context.

## Table Categories

### 1. Core Business Tables (Already Generated)
- `names` - Customers/Suppliers
- `accounts` - Chart of Accounts  
- `products` - Products/Services
- `transactions` - Financial transactions
- `jobs` - Job/Project tracking
- `contacts` - Contact management
- `assets` - Fixed assets
- `departments` - Department structure
- `inventory` - Stock levels
- `job-sheet-items` - Job sheet details
- `tax-rate` - Tax configurations

### 2. Exceptional Tables (New Additions)

#### Authentication & Security
- `login` - User sessions with encrypted passwords
- `user` - Script persistent storage (63 char keys)
- `user2` - Extended script storage (255 char keys)

#### Financial Transactions
- `payments` - Payment-to-invoice linking
- `reconciliation` - Bank reconciliation history
- `auto-split` - Automatic allocation rules

#### Asset Management
- `asset-log` - Asset transaction history (subfile)
- `asset-categories` - Asset classification

#### Multi-Currency
- `offledger` - Currencies & user-defined offledgers

#### Manufacturing
- `build` - Product BOMs/recipes

#### CRM
- `memo` - Notes with reminders

#### Configuration
- `general` - Multi-purpose (Categories/Classifications/Groups)

## Generation Commands

### Generate All Tables (Including Exceptional)
```bash
/project:mw-generate-all-table-types
```

### Generate Exceptional Tables Only
```bash
./scripts/generate-exceptional-tables.sh
```

### Generate Individual Table
```bash
/project:mw-generate-table-types table="table-name"
```

## Special Handling Requirements

### 1. Subfile Tables
**AssetLog** is accessed through Assets:
```typescript
const asset = await getAsset('ASSET001');
const logs = asset.Log; // Array of AssetLog entries
```

### 2. Multi-Purpose Tables
**General** table uses code prefixes:
```typescript
// Helper functions needed
function isAccountCategory(record: General): boolean {
  return record.Code.startsWith('A_');
}
function isDepartmentClassification(record: General): boolean {
  return record.Code.startsWith('D_');
}
function isGroup(record: General): boolean {
  return record.Code.startsWith('G_');
}
```

### 3. Special Encodings
**Payments.OurAmount** high bit handling:
```typescript
function decodePaymentAmount(amount: number): {
  value: number;
  isOverpayment: boolean;
} {
  const isOverpayment = (amount & 0x80000000) !== 0;
  const value = amount & 0x7FFFFFFF;
  return { value, isOverpayment };
}
```

### 4. Variable Arrays
**OffLedger.HistoricBalances** handling:
```typescript
interface OffLedger {
  // ... other fields
  HistoricBalances?: number[]; // Variable size based on periods
}
```

## File Structure

Generated interfaces are placed in:
```
packages/core/src/tables/
├── accounts.ts
├── names.ts
├── products.ts
├── transactions.ts
├── jobs.ts
├── contacts.ts
├── assets.ts
├── departments.ts
├── inventory.ts
├── job-sheet-items.ts
├── tax-rate.ts
├── login.ts              # New
├── user.ts               # New
├── user2.ts              # New
├── payments.ts           # New
├── reconciliation.ts     # New
├── auto-split.ts         # New
├── asset-log.ts          # New
├── asset-categories.ts   # New
├── offledger.ts          # New
├── build.ts              # New
├── memo.ts               # New
├── general.ts            # New
└── index.ts              # Export all interfaces
```

## Post-Generation Checklist

- [ ] All interfaces compile without TypeScript errors
- [ ] Enums created for fields with specific values
- [ ] Helper functions for special encodings
- [ ] Converter functions (PascalCase ↔ camelCase)
- [ ] Type guards for multi-purpose tables
- [ ] Documentation comments on interfaces
- [ ] Field length validations where applicable
- [ ] Optional fields properly marked
- [ ] Relationships documented
- [ ] Index.ts updated with all exports

## Maintenance Notes

1. **Script Storage Tables** (User/User2) - Maintain backward compatibility
2. **Login Security** - Handle encrypted passwords appropriately
3. **AssetLog Access** - Always through parent Asset record
4. **General Table** - Use type discriminators for the three logical tables
5. **Payment Encoding** - Decode overpayment bit when reading amounts

## Command Updates Made

1. Updated `.claude/commands/mw-generate-all-table-types.js`:
   - Added all 12 exceptional tables to `MONEYWORKS_TABLES` array
   - Organized with comments by category

2. Updated `.claude/commands/mw-generate-table-types.js`:
   - Added URLs for all exceptional tables
   - Added table-specific patterns and exceptions
   - Updated relationship mappings

3. Created `scripts/generate-exceptional-tables.sh`:
   - Standalone script for exceptional tables only
   - Includes progress tracking and post-generation reminders

## References

- Exceptional Tables Guide: `/docs/moneyworks-exceptional-tables-guide.md`
- Full Analysis: `/docs/moneyworks-additional-tables-analysis.md`
- MoneyWorks Manual: https://cognito.co.nz/manual/

## Next Steps

1. Run the generation commands to create TypeScript interfaces
2. Implement helper utilities for special cases
3. Update API services to handle exceptional tables
4. Add MCP tools for new table access
5. Update documentation with usage examples