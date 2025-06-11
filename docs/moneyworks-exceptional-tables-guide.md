# MoneyWorks Exceptional Tables Generation Guide

This guide documents the additional MoneyWorks tables that require special handling and provides a reproducible process for generating their TypeScript interfaces.

## Overview

These tables were discovered outside the initial context and have unique characteristics that require special treatment:

### 1. Authentication & Security Tables
- **Login** - User session management with encrypted passwords
- **User** - Script persistent storage (key up to 63 chars)
- **User2** - Extended script storage (key up to 255 chars)

### 2. Financial Transaction Tables  
- **Payments** - Links payments to invoices (many-to-many)
- **Reconciliation** - Bank reconciliation history
- **AutoSplit** - Automatic allocation rules

### 3. Asset Management Tables
- **AssetLog** - Subfile of Assets tracking lifecycle
- **AssetCategories** - Asset classification

### 4. Multi-Currency & Off-Ledger
- **OffLedger** - Combined currency definitions and user-defined offledgers

### 5. Manufacturing & Inventory
- **Build** - Product assembly BOMs/recipes

### 6. CRM & Documentation
- **Memo** - Notes with reminders linked to Names

### 7. Configuration Tables
- **General** - Three logical tables in one (Categories, Classifications, Groups)

## Special Handling Requirements

### 1. Tables Without Explicit Primary Keys
Many of these tables don't define primary keys in documentation:
- Login, User, User2, Payments, Reconciliation, AutoSplit, AssetLog, OffLedger, Build, Memo

**Solution**: Use composite keys or internal identifiers based on usage patterns.

### 2. Subfile Tables
- **AssetLog** is a subfile of Assets
- Access via: `Asset.Log[index]`

**Solution**: Generate as nested interface within parent table.

### 3. Multi-Purpose Tables
- **General** table serves three purposes based on Code prefix:
  - "A_" = Account Categories
  - "D_" = Department Classifications  
  - "G_" = Groups

**Solution**: Create type discriminators and helper functions.

### 4. Special Encodings
- **Payments.OurAmount**: High bit indicates overpayment
- **OffLedger.HistoricBalances**: Variable array size

**Solution**: Create decoder/encoder utilities.

## Generation Process

### Step 1: Update Table Registry

Add these tables to `.claude/commands/mw-generate-all-table-types.js`:

```javascript
const MONEYWORKS_TABLES = [
  // ... existing tables ...
  'login',
  'user',
  'user2', 
  'payments',
  'offledger',
  'memo',
  'asset-log',
  'asset-categories',
  'build',
  'auto-split',
  'reconciliation',
  'general'
];
```

### Step 2: Update URL Mappings

Add to `.claude/commands/mw-generate-table-types.js`:

```javascript
const TABLE_URLS = {
  // ... existing URLs ...
  login: "https://cognito.co.nz/manual/moneyworks_appendix_login_file.html",
  user: "https://cognito.co.nz/manual/moneyworks_appendix_user_file.html",
  user2: "https://cognito.co.nz/manual/moneyworks_appendix_user2_file.html",
  payments: "https://cognito.co.nz/manual/moneyworks_appendix_payments_file.html",
  offledger: "https://cognito.co.nz/manual/moneyworks_appendix_offledgers_and_currency.html",
  memo: "https://cognito.co.nz/manual/moneyworks_appendix_memo_file.html",
  "asset-log": "https://cognito.co.nz/manual/moneyworks_appendix_assets.html#assetlog",
  "asset-categories": "https://cognito.co.nz/manual/moneyworks_appendix_asset_categories.html",
  build: "https://cognito.co.nz/manual/moneyworks_appendix_build_file.html",
  "auto-split": "https://cognito.co.nz/manual/moneyworks_appendix_allocation_file.html#autosplit",
  reconciliation: "https://cognito.co.nz/manual/moneyworks_appendix_reconciliation_file.html",
  general: "https://cognito.co.nz/manual/moneyworks_appendix_account_categories__department_classifications_and_groups.html"
};
```

### Step 3: Add Table-Specific Patterns

```javascript
const TABLE_PATTERNS = {
  // ... existing patterns ...
  login: {
    noCodeField: true,
    hasEncryption: true,
    exceptionalFields: {
      Password: "Encrypted field",
      Privileges: "Encoded as string but represents access rights"
    }
  },
  user: {
    scriptStorage: true,
    keyField: "Key",
    keyLength: 63
  },
  user2: {
    scriptStorage: true,
    keyField: "Key", 
    keyLength: 255,
    extendedFields: true
  },
  payments: {
    noCodeField: true,
    manyToMany: true,
    exceptionalFields: {
      OurAmount: "High bit indicates overpayment"
    }
  },
  offledger: {
    dualPurpose: true,
    variableArrays: true,
    currencySupport: true
  },
  memo: {
    hasReminders: true,
    linkedToNames: true
  },
  "asset-log": {
    isSubfile: true,
    parentTable: "assets",
    noDirectAccess: true
  },
  build: {
    isBOM: true,
    linkedToProducts: true
  },
  "auto-split": {
    hasRules: true,
    percentageAllocation: true
  },
  reconciliation: {
    noCodeField: true,
    bankIntegration: true
  },
  general: {
    multiPurpose: true,
    codePrefix: ["A_", "D_", "G_"],
    logicalTables: ["Categories", "Classifications", "Groups"]
  }
};
```

### Step 4: Generate Interfaces

Run the generation command for each exceptional table:

```bash
# Generate all exceptional tables
for table in login user user2 payments offledger memo asset-log asset-categories build auto-split reconciliation general; do
  /project:mw-generate-table-types table="$table"
done
```

### Step 5: Post-Generation Tasks

1. **Create Helper Utilities**
   - Password encryption/decryption for Login
   - Overpayment bit handling for Payments
   - Code prefix discrimination for General
   - Array size handling for OffLedger

2. **Add Relationship Mappings**
   - AssetLog → Assets (subfile)
   - Payments → Transactions (many-to-many)
   - Memo → Names (linked)
   - Build → Products (BOM)

3. **Create Type Guards**
   ```typescript
   // For General table
   export function isAccountCategory(record: General): boolean {
     return record.Code.startsWith('A_');
   }
   ```

4. **Document Access Patterns**
   ```typescript
   // AssetLog is accessed through Asset
   const assetLogs = asset.Log; // Array of AssetLog entries
   ```

## Testing Checklist

- [ ] All interfaces compile without errors
- [ ] Enums for special values are created
- [ ] Helper functions for encoding/decoding work correctly
- [ ] Subfile relationships are properly typed
- [ ] Multi-purpose tables have proper discriminators
- [ ] Import/export formats are documented
- [ ] Field length constraints are enforced
- [ ] Optional fields are properly marked
- [ ] Timestamp fields use consistent types

## Maintenance Notes

1. These tables may change less frequently as they're often system tables
2. User/User2 tables are for script storage - ensure backward compatibility
3. Login table security features may require special handling in API
4. General table's multi-purpose nature requires careful type discrimination
5. AssetLog being a subfile means it's always accessed through Assets

## References

- Full analysis: `/docs/moneyworks-additional-tables-analysis.md`
- MoneyWorks manual: https://cognito.co.nz/manual/
- Original table generation: `.claude/commands/mw-generate-table-types.js`