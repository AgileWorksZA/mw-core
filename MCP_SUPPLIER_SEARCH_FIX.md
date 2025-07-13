# MCP Server "Failed to search names: Unknown error" - Resolution

## Problem Summary
The MCP agent was returning "Failed to search names: Unknown error" when trying to search for suppliers. Investigation revealed the issue was with field structure discovery for the MoneyWorks Name table.

## Root Cause Analysis

### 1. MoneyWorks Connection ✅ Working
- MoneyWorks server is accessible on localhost:6710
- Database "acme.moneyworks" is available
- Basic connection and evaluation functions work correctly

### 2. Field Discovery Issue ❌ Found Problem
The MoneyWorks Name table was using XML-based field discovery instead of predefined TSV field mapping. This caused:
- Only 4 fields were being parsed (Sequencenumber, LastModifiedTime, Code, Name)
- Important fields like SupplierType and CustomerType were missing
- Code field was showing timestamps instead of proper codes
- TSV export has 97 columns but XML discovery only found the non-empty fields

### 3. Data Structure Mismatch
- XML export shows fields in one order with only populated values
- TSV export includes ALL 97 possible fields in a specific order
- The system was using XML field order for TSV column mapping

## Solution Implemented

### Added Name Table TSV Field Mapping
Created a complete field mapping for the Name table in `/packages/data/src/parsers/moneyworks-field-mappings.ts`:

```typescript
export const NAME_TSV_FIELD_MAPPING = [
  { position: 0, xmlName: 'sequencenumber', pascalName: 'Sequencenumber', dataType: 'number' as const },
  { position: 1, xmlName: 'lastmodifiedtime', pascalName: 'LastModifiedTime', dataType: 'number' as const },
  { position: 2, xmlName: '_timestamp', pascalName: '_Timestamp', dataType: 'string' as const },
  { position: 3, xmlName: 'code', pascalName: 'Code', dataType: 'string' as const },
  // ... (mapping for all 97 fields)
  { position: 40, xmlName: 'suppliertype', pascalName: 'SupplierType', dataType: 'number' as const },
  { position: 21, xmlName: 'customertype', pascalName: 'CustomerType', dataType: 'number' as const },
  // ... (continued for all fields)
];
```

Updated `getTSVFieldMapping()` function to include the Name table:
```typescript
export function getTSVFieldMapping(tableName: string) {
  switch (tableName.toUpperCase()) {
    case 'TAXRATE':
      return TAXRATE_TSV_FIELD_MAPPING;
    case 'NAME':
      return NAME_TSV_FIELD_MAPPING;  // ← Added this
    default:
      return null;
  }
}
```

## Verification Tests

### Test Results After Fix:
```javascript
// Before: 
{
  Code: "2020-06-22 15:59:43",  // ❌ Timestamp instead of code
  Name: "BSUPP",
  SupplierType: undefined       // ❌ Missing field
}

// After:
{
  Code: "BSUPP",                     // ✅ Correct supplier code
  Name: "Beetle Suppliers Limited", // ✅ Correct name
  SupplierType: 2,                  // ✅ Correct supplier type
  CustomerType: 0,                  // ✅ All fields present
  // ... (all 97 fields properly mapped)
}
```

### Direct Tool Test Results:
- ✅ getSuppliers() returns 10 suppliers with complete data
- ✅ All fields properly parsed and typed
- ✅ Supplier filtering works correctly (SupplierType > 0)
- ✅ Customer filtering works correctly  
- ✅ No compilation errors

## Status

### Fixed Components:
1. ✅ MoneyWorks database connection - Working
2. ✅ Field structure discovery for Name table - Fixed with predefined mapping
3. ✅ NameRepository.getSuppliers() method - Working correctly
4. ✅ TypeScript compilation - No errors
5. ✅ MCP server tools (when using new mapping) - Working

### Remaining Action Required:
The MCP server process needs to be restarted to pick up the new field mapping. The current running process is still using the old cached field structure.

**To complete the fix:** Restart Claude Desktop or the MCP server process to load the updated field mappings.

## Files Modified:
- `/packages/data/src/parsers/moneyworks-field-mappings.ts` - Added complete Name table field mapping

## Summary:
The core issue was incorrect field mapping for the MoneyWorks Name table. The fix provides a complete 97-field mapping that properly aligns XML field names with TSV column positions. After restarting the MCP server, the "Unknown error" should be resolved and supplier searches will work correctly.

<summary>Fixed the MCP supplier search error by adding proper Name table field mapping</summary>