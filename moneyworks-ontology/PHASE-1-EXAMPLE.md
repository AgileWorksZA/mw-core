# Phase 1 Execution Example - Concrete Workflow

**Purpose:** Show exact steps for next session to add missing fields to existing entities

---

## Example 1: Account Entity - Add 10 Missing Fields

### Step 1: Read Empirical Data

From `/Users/hjonck/Development/gitprojects/AgileWorksZA/ai_cfo_poc/mpoc/data/moneyworks-schemas/2025-11-25_full-schema_now.json`:

```json
{
  "name": "Account",
  "fields": [
    "Slot",
    "SequenceNumber",
    "LastModifiedTime",
    "Code",
    "Type",
    "Group",
    "Category",
    "Description",
    "PandL",
    "TaxCode",
    "Flags",
    "System",
    "Created",
    "Category2",
    "Category3",
    "Category4",
    "AccountantCode",
    "Colour",
    "Currency",
    "SecurityLevel",
    "BankAccountNumber",
    "BalanceLimit",
    "ManualChequeNumber",
    "PrintedChequeNumber",
    "LastStatementImport",
    "Comments",
    "ManualChequeNumDigits",
    "PrintedChequeNumDigits",
    "UserNum",
    "UserText",
    "TaggedText",
    "FeedID",
    "Cashflow",
    "Cashforecast",
    "EBITDA",
    "ImportFormat"
  ],
  "fieldCount": 36,
  "sampleRecord": {
    "sequencenumber": "293",
    "lastmodifiedtime": "20251020142951",
    "code": "5105",
    "type": "CA",
    "flags": "0",
    "balancelimit": "",
    "feedid": "",
    "cashflow": "",
    "cashforecast": "",
    "importformat": ""
  }
}
```

### Step 2: Read Current Ontology

From `generated/moneyworks-accounts-canonical-ontology.ts`:

```typescript
export const MONEYWORKS_ACCOUNT_FIELDS = [
  // Currently has 26 fields
  // Missing: Slot (exclude), SequenceNumber, Flags, AccountantCode,
  //          BalanceLimit, ManualChequeNumDigits, PrintedChequeNumDigits,
  //          FeedID, Cashflow, Cashforecast, ImportFormat
]
```

### Step 3: Add Missing Fields

**Fields to ADD (10 fields):**

```typescript
// After existing fields, add:

{
  fieldName: "SequenceNumber",
  dataType: "N" as const,
  canonicalDescription: "Primary key - unique record identifier",
  manualSource: "Empirical API validation",
  isRequired: true,
  isSystem: true,
  isIndexed: true
},
{
  fieldName: "Flags",
  dataType: "N" as const,
  canonicalDescription: "Account flags bitfield",
  manualSource: "Empirical API validation",
  isRequired: false
},
{
  fieldName: "AccountantCode",  // NOTE: Fixed typo from AccountantsCode
  dataType: "T" as const,
  maxLength: 20,
  canonicalDescription: "External accountant's reference code",
  manualSource: "Empirical API validation",
  isRequired: false
},
{
  fieldName: "BalanceLimit",
  dataType: "N" as const,
  canonicalDescription: "Overdraft or balance limit for bank accounts",
  manualSource: "Empirical API validation",
  isRequired: false
},
{
  fieldName: "ManualChequeNumDigits",
  dataType: "N" as const,
  canonicalDescription: "Number of digits in manual cheque numbers",
  manualSource: "Empirical API validation",
  isRequired: false
},
{
  fieldName: "PrintedChequeNumDigits",
  dataType: "N" as const,
  canonicalDescription: "Number of digits in printed cheque numbers",
  manualSource: "Empirical API validation",
  isRequired: false
},
{
  fieldName: "FeedID",
  dataType: "T" as const,
  maxLength: 100,
  canonicalDescription: "Bank feed integration identifier",
  manualSource: "Empirical API validation",
  isRequired: false
},
{
  fieldName: "Cashflow",
  dataType: "T" as const,
  maxLength: 10,
  canonicalDescription: "Cashflow statement category",
  manualSource: "Empirical API validation",
  isRequired: false
},
{
  fieldName: "Cashforecast",
  dataType: "T" as const,
  maxLength: 10,
  canonicalDescription: "Cash forecast category",
  manualSource: "Empirical API validation",
  isRequired: false
},
{
  fieldName: "ImportFormat",
  dataType: "T" as const,
  maxLength: 50,
  canonicalDescription: "Bank statement import format specification",
  manualSource: "Empirical API validation",
  isRequired: false
}
```

### Step 4: Fix Typo

Find and replace in same file:
```typescript
// OLD (WRONG):
{
  fieldName: "AccountantsCode",
  ...
}

// NEW (CORRECT):
{
  fieldName: "AccountantCode",
  ...
}
```

---

## Example 2: Create Detail Entity (NEW FILE)

### Step 1: Extract Detail Fields from Empirical

From empirical JSON:
```json
{
  "name": "Detail",
  "fields": [
    "Slot",
    "Detail.SequenceNumber",
    "Detail.LastModifiedTime",
    "Detail.ParentSeq",
    "Detail.Sort",
    "Detail.Account",
    "Detail.Dept",
    "Detail.PostedQty",
    "Detail.TaxCode",
    "Detail.Gross",
    "Detail.Tax",
    "Detail.Debit",
    "Detail.Credit",
    "Detail.Description",
    "Detail.StockQty",
    "Detail.StockCode",
    "Detail.CostPrice",
    "Detail.UnitPrice",
    "Detail.Statement",
    "Detail.JobCode",
    "Detail.SaleUnit",
    "Detail.Discount",
    "Detail.Flags",
    "Detail.OrderQty",
    "Detail.BackorderQty",
    "Detail.PrevShipQty",
    "Detail.BaseCurrencyNet",
    "Detail.SerialNumber",
    "Detail.Period",
    "Detail.TransactionType",
    "Detail.SecurityLevel",
    "Detail.RevalueQty",
    "Detail.StockLocation",
    "Detail.OrderStatus",
    "Detail.ExpensedTax",
    "Detail.Date",
    "Detail.MoreFlags",
    "Detail.UserNum",
    "Detail.UserText",
    "Detail.TaggedText",
    "Detail.NonInvRcvdNotInvoicedQty",
    "Detail.Custom1",
    "Detail.Custom2",
    "Detail.OriginalUnitCost"
  ],
  "fieldCount": 44
}
```

### Step 2: Create New File

Create `generated/moneyworks-detail-canonical-ontology.ts`:

```typescript
/**
 * MoneyWorks Detail Entity - Canonical Ontology
 *
 * CRITICAL: Detail is a SUBFILE of Transaction
 * Source: Empirical API validation (MoneyWorks Now v9.2.3)
 *
 * FIELD NAMING CONVENTION:
 * - API returns fields with "Detail." prefix
 * - This ontology documents bare field names
 * - Relationship: Detail.ParentSeq → Transaction.SequenceNumber
 *
 * COVERAGE: 44/44 fields (100%)
 */

// Enumerations
export enum MoneyWorksDetailOrderStatus {
  // TODO: Extract from empirical data or manual
}

// Field Definitions
export const MONEYWORKS_DETAIL_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Detail line primary key",
    manualSource: "Empirical API validation",
    isRequired: true,
    isSystem: true,
    isIndexed: true,
    apiFieldName: "Detail.SequenceNumber"
  },
  {
    fieldName: "ParentSeq",
    dataType: "N" as const,
    canonicalDescription: "Foreign key to Transaction.SequenceNumber",
    manualSource: "Empirical API validation",
    isRequired: true,
    isIndexed: true,
    foreignKey: {
      targetEntity: "Transaction",
      targetField: "SequenceNumber",
      relationship: "many-to-one"
    },
    apiFieldName: "Detail.ParentSeq"
  },
  {
    fieldName: "Sort",
    dataType: "N" as const,
    canonicalDescription: "Line sort order within transaction",
    manualSource: "Empirical API validation",
    isRequired: true,
    apiFieldName: "Detail.Sort"
  },
  {
    fieldName: "Account",
    dataType: "T" as const,
    maxLength: 18,
    canonicalDescription: "GL account code (FK to Account.Code)",
    manualSource: "Empirical API validation",
    isRequired: true,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    apiFieldName: "Detail.Account"
  },
  // ... (continue for all 44 fields)
]
```

---

## Example 3: Create Ledger Entity (NEW FILE)

### Step 1: Understand Ledger Structure

From empirical JSON - Ledger has 201 fields:
- AccountCode, Department, Category, Type (4 identifying fields)
- Balance91 → Balance (92 balance fields for 91 past periods + current)
- BudgetALast29 → BudgetANext18 (48 budget A fields)
- BudgetBLast29 → BudgetBNext18 (48 budget B fields)
- System, UserNum, UserText, TaggedText (metadata)

**Key Insight:** This is a PIVOT table structure - one record per account/dept/category combo

### Step 2: Create Ontology File

Create `generated/moneyworks-ledger-canonical-ontology.ts`:

```typescript
/**
 * MoneyWorks Ledger Entity - Canonical Ontology
 *
 * CRITICAL DISCOVERY: Ledger is the PERIOD BALANCE PIVOT TABLE
 * Source: Empirical API validation (MoneyWorks Now v9.2.3)
 *
 * PURPOSE:
 * - Stores historical and current balances by period
 * - Stores budget forecasts (A and B scenarios)
 * - One record per Account+Department+Category combination
 *
 * ARCHITECTURE:
 * - Period balances: Last91 → Last01 → Current (92 periods)
 * - Budget A: Last29 → Current → Next18 (48 periods)
 * - Budget B: Last29 → Current → Next18 (48 periods)
 *
 * COVERAGE: 201/201 fields (100%)
 */

export const MONEYWORKS_LEDGER_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Ledger record primary key",
    manualSource: "Empirical API validation",
    isRequired: true,
    isSystem: true
  },
  {
    fieldName: "AccountCode",
    dataType: "T" as const,
    maxLength: 18,
    canonicalDescription: "FK to Account.Code",
    manualSource: "Empirical API validation",
    isRequired: true,
    isIndexed: true,
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code"
    }
  },
  {
    fieldName: "Department",
    dataType: "T" as const,
    maxLength: 6,
    canonicalDescription: "FK to Department.Code",
    manualSource: "Empirical API validation",
    foreignKey: {
      targetEntity: "Department",
      targetField: "Code"
    }
  },
  {
    fieldName: "Type",
    dataType: "A" as const,
    maxLength: 2,
    canonicalDescription: "Account type (CA, AR, AP, etc.)",
    manualSource: "Empirical API validation"
  },

  // Balance fields (92 total)
  {
    fieldName: "BalanceLast91",
    dataType: "N" as const,
    canonicalDescription: "Balance 91 periods ago",
    manualSource: "Empirical API validation",
    isCalculated: true
  },
  // ... BalanceLast90 through BalanceLast01
  {
    fieldName: "Balance",
    dataType: "N" as const,
    canonicalDescription: "Current period balance",
    manualSource: "Empirical API validation",
    isCalculated: true
  },

  // Budget A fields (48 total)
  {
    fieldName: "BudgetALast29",
    dataType: "N" as const,
    canonicalDescription: "Budget A for 29 periods ago",
    manualSource: "Empirical API validation"
  },
  // ... continue through BudgetANext18

  // Budget B fields (48 total)
  // ... same pattern
]
```

---

## Workflow Summary

**For each entity:**

1. **Read empirical JSON** → Get field list
2. **Read current ontology** → Get existing fields
3. **Compare** → Identify missing fields
4. **Extract** → Use sampleRecord to infer types
5. **Add fields** → Use template pattern
6. **Fix typos** → Correct any misnamed fields

**After all entities updated:**

1. **Run verification:** `npx tsx scripts/verify-empirical-schema.ts`
2. **Check output:** Should show 0 missing fields
3. **Update state.yaml:** Set empirical_field_coverage to 1.0 (100%)
4. **Create qualia doc:** Document session outcomes

**Success criteria:**
- Verification script reports 24/31 perfect matches
- 0 fields missing in ontology
- Coverage = 100%
