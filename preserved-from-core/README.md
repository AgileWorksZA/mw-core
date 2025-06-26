# Preserved Low-Level MoneyWorks Utilities

This directory contains low-level utilities and patterns preserved from the old core package. These are generic patterns that will apply to all tables as they are canonically vetted.

This isn't an official package, just old code preserved for reference.

## What's Preserved

### 📁 `/xml/`
Generic XML handling utilities:
- `parser.ts` - Parse MoneyWorks XML responses (any table)
- `schema-parser.ts` - Schema-aware XML parsing
- `builder.ts` - Build XML for imports (any table)

### 📁 `/converters/`
Generic field conversion utilities:
- `field-converter.ts` - PascalCase/camelCase conversions (works for any table)

### 📁 `/test-utils/`
Test fixtures showing response formats:
- `fixtures.ts` - Example XML/TSV response patterns

### 📁 `/constants/`
Low-level constants:
- API version, page sizes
- Field type codes
- Date formats

### 📁 `/tax-rate-template/`
Our vetted template for tax rates:
- `TSV-FIELD-MAPPING.md` - Shows the pattern for handling TSV exports

### 📄 Core Files
- `auth.ts` - Authentication patterns (applies to all API calls)
- `errors.ts` - Error handling patterns
- `MONEYWORKS-KNOWLEDGE.md` - Low-level API patterns

## Key Patterns to Reuse

### TSV Parsing Pattern
```javascript
// 1. Check if first line is headers or data
const firstFieldIsNumeric = !isNaN(Number(firstLineFields[0]));

// 2. Use table-specific field mapping if no headers
if (firstFieldIsNumeric && tableName === 'TaxRate') {
  headers = TAXRATE_TSV_FIELDS;
}

// 3. Parse lines into objects
```

### Authentication Pattern
```javascript
// URL format
const url = `http://${user}:${pass}@${host}:${port}/REST/${datafile}/export`;

// OR Header format
Authorization: Basic base64(username:password)
```

### Error Detection Pattern
```javascript
// Single word without tabs = error
if (response.indexOf('\t') === -1 && response.indexOf(' ') === -1) {
  // It's an error message
}
```

## Integration Guide

When adding a new canonically vetted table:

1. **Study the tax-rate template** in `/tax-rate-template/`
2. **Export sample data** to determine field order
3. **Create field mapping** following the pattern
4. **Use generic utilities** for XML/conversion
5. **Apply authentication patterns** from auth.ts
6. **Handle errors** using patterns from errors.ts

## NOT Included

We deliberately excluded:
- ❌ All other table definitions (not yet vetted)
- ❌ Table-specific business logic (except tax-rate template)
- ❌ Contaminated field definitions
- ❌ Non-canonical naming patterns

This keeps our codebase clean for the canonical semantics refactor.