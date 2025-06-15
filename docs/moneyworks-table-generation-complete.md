# MoneyWorks Table Generation - Complete Guide

## Overview

This document provides a complete guide for generating TypeScript interfaces for ALL MoneyWorks tables, including the exceptional tables that were discovered outside the initial context.

## Important: Field Mapping Requirements

### Key Discovery
MoneyWorks REST API returns field names in **lowercase** format in XML/TSV exports, not in PascalCase as documented. This requires special handling in our TypeScript system.

### Required Implementations

1. **Field Converter Updates** (`src/converters/field-converter.ts`):
   - Each table needs a custom converter function to map lowercase MW fields to camelCase TS fields
   - Special cases like `type` → `typeCode` for transactions, `description` → `name` for accounts
   - Handle XML attributes with underscore (e.g., `{_: value, system: "true"}`)

2. **Export Builder Updates** (`src/export/builder.ts`):
   - The `getMWFieldName()` method must map camelCase to lowercase MW field names
   - Required for `whereField()` and `orderBy()` to generate correct filters

3. **XML Parser Considerations**:
   - MoneyWorks includes `count` and `found` attributes in table responses
   - `found` = total matching records, `count` = returned records (affected by limit)

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

## Field Mapping Examples

### Account Table
```typescript
// MoneyWorks returns: {type: "CA", description: "Assets", taxcode: "*"}
// We need: {accountType: "CA", name: "Assets", taxCode: "*"}

const fieldMap = {
  'type': 'accountType',
  'description': 'name',  // In accounts, description is the name
  'taxcode': 'taxCode',
  'bankaccountnumber': 'bankAccountNumber',
  // ... etc
}
```

### Transaction Table
```typescript
// MoneyWorks returns: {type: "DII", ourref: "INV001", namecode: "CUST001"}
// We need: {typeCode: "DII", ourRef: "INV001", nameCode: "CUST001"}

const fieldMap = {
  'type': 'typeCode',  // type → typeCode for transactions
  'ourref': 'ourRef',
  'namecode': 'nameCode',
  'transdate': 'transDate',
  // ... etc
}
```

### Detail Table (Special Case)
```typescript
// MoneyWorks returns Detail fields with "Detail." prefix
// {Detail.Account: "4100", Detail.Debit: 100}
// We need: {account: "4100", debit: 100}
```

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

## Field Mapping Implementation

### Step 1: Update field-converter.ts
After generating a new table, add its converter function:

```typescript
function convertTableNameToCamel(record: any): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(record)) {
    let camelKey = key;
    
    if (key === key.toLowerCase()) {
      const fieldMap: Record<string, string> = {
        // Add all field mappings for this table
        'fieldname': 'fieldName',
        // Special cases
        'type': 'specificType', // if 'type' means something specific
      };
      camelKey = fieldMap[key] || key;
    }
    
    // Handle XML attributes
    if (typeof value === 'object' && '_' in value) {
      result[camelKey] = value._;
    } else {
      result[camelKey] = value;
    }
  }
  
  return result;
}
```

### Step 2: Update convertPascalToCamel switch
```typescript
case 'TableName':
  return convertTableNameToCamel(record as any) as Partial<TableMapCamel[T]>;
```

### Step 3: Update export builder getMWFieldName
Add table-specific field mappings to the fieldMap object.

### Step 4: Test the mapping
```typescript
// Test export
const records = await client.export('TableName', { format: 'json' });
// Verify fields are properly mapped to camelCase
```

## Post-Generation Checklist

- [ ] All interfaces compile without TypeScript errors
- [ ] Enums created for fields with specific values
- [ ] Helper functions for special encodings
- [ ] **Field converter function added to field-converter.ts**
- [ ] **Field mappings added to export builder getMWFieldName()**
- [ ] Converter functions (PascalCase ↔ camelCase)
- [ ] Type guards for multi-purpose tables
- [ ] Documentation comments on interfaces
- [ ] Field length validations where applicable
- [ ] Optional fields properly marked
- [ ] Relationships documented
- [ ] Index.ts updated with all exports
- [ ] **Tested export returns properly mapped camelCase fields**

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