---
name: Debugging MoneyWorks TSV Field Mapping
description: Debug and create TSV field mappings for MoneyWorks tables. MoneyWorks TSV exports have different column counts than XML, extra metadata columns, and case-sensitive field names. Use when snapshot data shows empty objects {}, field values are misaligned, diff engine shows 0 changes despite record count differences, or implementing new table export support.
---

# Debugging MoneyWorks TSV Field Mapping

MoneyWorks REST API exports data in TSV format with NO headers. The field order doesn't always match the XML schema order, and some tables have extra metadata columns. This skill documents the debugging protocol and implementation patterns for correct TSV parsing.

## Core Principle

**TSV column count differs from XML field count.** MoneyWorks adds internal metadata columns to TSV exports that don't appear in XML schemas. Always compare actual TSV column count vs XML field count before trusting automatic field discovery.

## Common Symptoms & Root Causes

| Symptom | Root Cause | Fix |
|---------|------------|-----|
| Records exported as `{}` empty objects | XML parser regex `\w+` doesn't match dot-notation fields | Change regex to `[\w.]+` |
| Diff shows 0 changes despite record count difference | Case sensitivity: `SequenceNumber` vs `Sequencenumber` | Use exact MW field name (lowercase n) |
| Field values shifted/misaligned | TSV has extra columns (metadata) not in XML | Create hardcoded TSV field mapping |
| Primary key lookup fails | Wrong case in `getPrimaryKeyField()` | Match exact MoneyWorks field casing |

## The TSV vs XML Column Mismatch Problem

MoneyWorks TSV exports typically have 2 extra columns compared to XML:

```
Position 0: _internalId (internal row ID, not in XML)
Position 1: sequencenumber (actual primary key)
Position 2: _timestamp (formatted timestamp, not in XML)
Position 3+: Actual data fields
```

**Example: Detail table**
- TSV columns: 44
- XML fields: 42
- Difference: +2 metadata columns (_internalId at 0, _timestamp at 2)

**Example: Transaction table**
- TSV columns: 74
- XML fields: 72
- Difference: +2 metadata columns

## Debugging Protocol

### Step 1: Count TSV Columns

```bash
# Export a single record as TSV and count columns
curl "http://localhost:6710/REST/table?name=Detail&limit=1&format=tsv" | head -1 | tr '\t' '\n' | wc -l
```

### Step 2: Count XML Fields

```bash
# Export same record as XML and count fields
curl "http://localhost:6710/REST/table?name=Detail&limit=1&format=xml" | grep -oE '<[a-z.]+>' | sort -u | wc -l
```

### Step 3: Compare Counts

If TSV > XML, you need a hardcoded field mapping.

### Step 4: Identify Extra Columns

Export both formats and compare:
- Position 0 is often `_internalId` (numeric)
- Position 2 is often `_timestamp` (formatted date string like "2024-12-14 10:30:00")

## Implementation: Creating Field Mappings

### File Location

`packages/data/src/parsers/moneyworks-field-mappings.ts`

### Mapping Structure

```typescript
export const TABLENAME_TSV_FIELD_MAPPING = [
  { position: 0, xmlName: "_internalId", pascalName: "_InternalId", dataType: "number" as const },
  { position: 1, xmlName: "sequencenumber", pascalName: "Sequencenumber", dataType: "number" as const },
  { position: 2, xmlName: "_timestamp", pascalName: "_Timestamp", dataType: "string" as const },
  // Continue with actual data fields...
  { position: 3, xmlName: "fieldname", pascalName: "Fieldname", dataType: "string" as const },
];
```

### Register in getTSVFieldMapping()

```typescript
export function getTSVFieldMapping(tableName: string) {
  switch (tableName.toUpperCase()) {
    case "DETAIL":
      return DETAIL_TSV_FIELD_MAPPING;
    case "TRANSACTION":
      return TRANSACTION_TSV_FIELD_MAPPING;
    // Add new table here
    default:
      return null; // Falls back to field discovery
  }
}
```

## Critical Bug Fix: Subfile Dot Notation

MoneyWorks subfile tables (Detail, Payments, Contacts) use dot-notation in XML field names:

```xml
<detail.sequencenumber>123</detail.sequencenumber>
<detail.gross>100.00</detail.gross>
```

### The Bug

Original XML parser regex `\w+` doesn't match dots:

```typescript
// ❌ WRONG - misses detail.sequencenumber
const fieldRegex = /<(\w+)(?:\s+[^>]*)?>([^<]*)<\/\1>/g;
```

### The Fix

```typescript
// ✅ CORRECT - matches detail.sequencenumber
const fieldRegex = /<([\w.]+)(?:\s+[^>]*)?>([^<]*)<\/\1>/g;
```

### Files to Update

In `packages/data/src/parsers/xml/moneyworks-xml-parser.ts`:

1. **parseMoneyWorksXML()** - Line ~57:
   ```typescript
   const fieldRegex = /<([\w.]+)(?:\s+[^>]*)?>([^<]*)<\/\1>/g;
   ```

2. **extractFieldOrder()** - Line ~131:
   ```typescript
   const fieldMatch = part.match(/^([\w.]+)(?:\s[^>]*)?>([^<]*)/);
   ```

3. **Empty element regex** - Line ~69:
   ```typescript
   const emptyFieldRegex = /<([\w.]+)\s*\/>/g;
   ```

### Strip Prefix in PascalCase Conversion

```typescript
export function xmlFieldToPascalCase(xmlField: string): string {
  // Strip table prefix if present (e.g., "detail.sequencenumber" -> "sequencenumber")
  let fieldName = xmlField;
  if (fieldName.includes(".")) {
    fieldName = fieldName.split(".").pop() || fieldName;
  }
  // Then apply PascalCase conversion...
}
```

## Critical Bug Fix: Field Name Case Sensitivity

MoneyWorks uses inconsistent casing. The REST API returns lowercase field names, but the exact casing matters for lookups.

### The Bug

```typescript
// ❌ WRONG - capital N
return "SequenceNumber";
```

### The Fix

```typescript
// ✅ CORRECT - lowercase n (actual MW field name)
return "Sequencenumber";
```

### File to Update

`packages/cli/src/commands/snapshot/types.ts`:

```typescript
export function getPrimaryKeyField(tableName: string): string {
  switch (tableName) {
    case "TaxRate":
      return "TaxCode";
    case "Account":
    case "Job":
    case "Department":
      return "Code";
    case "User":
    case "Login":
      return "Name";
    default:
      return "Sequencenumber";  // lowercase 'n'!
  }
}
```

## Verification Steps

### After Creating Field Mapping

```bash
# Take a fresh snapshot
bun packages/cli/src/index.ts snapshot my-test --tables Transaction,Detail

# Check record is not empty
cat .snapshots/my-test/Transaction.json | head -20
# Should see populated fields, not {}

# Verify field alignment
cat .snapshots/my-test/Transaction.json | jq '.[0] | {Sequencenumber, Ourref, Transdate, Type, Gross}'
# Fields should have correct values (invoice ref in Ourref, date in Transdate, etc.)
```

### After Fixing Primary Key

```bash
# Create invoice in MoneyWorks Gold
# Take before/after snapshots
bun packages/cli/src/index.ts snapshot before-test
# Create invoice
bun packages/cli/src/index.ts snapshot after-test

# Run diff - should show changes now
bun packages/cli/src/index.ts diff before-test after-test
# Should report: "Transaction: +1, Detail: +N"
```

## Tables Currently Mapped

| Table | TSV Cols | XML Fields | Status |
|-------|----------|------------|--------|
| TaxRate | 30 | 30 | Mapped |
| Name | 97 | 97 | Mapped |
| Product | 75 | 75 | Mapped |
| Job | 15 | 15 | Mapped |
| Category1 | 5 | 5 | Mapped |
| Category2 | 5 | 5 | Mapped |
| Detail | 44 | 42 | **Mapped (has extra cols)** |
| Transaction | 74 | 72 | **Mapped (has extra cols)** |
| Account | ? | ? | Uses field discovery |
| Others | ? | ? | Uses field discovery |

## Transaction-Detail Relationship

Transactions link to Details via:
- `Transaction.Sequencenumber` = `Detail.Parentseq`

```typescript
// Find all details for a transaction
const transactionSeq = 986;
const details = allDetails.filter(d => d.Parentseq === transactionSeq);
```

## Common Pitfalls

1. **Assuming XML and TSV have same columns** - They don't. TSV has metadata columns.
2. **Using SequenceNumber (capital N)** - MW uses Sequencenumber (lowercase n).
3. **Not testing with real data** - Field discovery can fail silently with empty tables.
4. **Forgetting dot notation in subfiles** - `detail.gross` not just `gross` in XML.
5. **Trusting field order from XML** - TSV order can differ, especially with metadata columns.

## When to Use This Skill

- Snapshot records show as empty `{}`
- Diff engine reports 0 changes when there are clearly changes
- Field values appear in wrong columns
- Adding support for a new table
- Debugging TSV parsing issues
- Primary key lookups fail

## Files Affected

- `packages/data/src/parsers/moneyworks-field-mappings.ts` - TSV field mappings
- `packages/data/src/parsers/xml/moneyworks-xml-parser.ts` - XML parsing with dot notation
- `packages/cli/src/commands/snapshot/types.ts` - Primary key field names
