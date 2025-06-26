# MoneyWorks Low-Level API Knowledge

This document preserves critical low-level MoneyWorks API patterns that apply to all tables.

## TSV Export Format (Critical Knowledge)

### Characteristics
- **MoneyWorks TSV NEVER includes headers** - this is by design
- Fields are tab-separated (`\t`)
- Empty values are empty strings between tabs
- First line is ALWAYS data, never headers
- Line endings are `\n`
- Field order is table-specific and must be known in advance

### The Only Way to Discover Fields
- Export 1 record as XML format to see field names and order
- XML has field names as element tags (lowercase)
- Cache the discovered structure for subsequent TSV exports
- This is the "heavy lifting" - XML discovery + TSV parsing

### Data Type Formats
- Dates: `YYYYMMDD` as string (e.g., "20231225")
- Times: `HHMMSS` as string (e.g., "143052")
- Timestamps: ISO 8601 (e.g., "2023-12-25T14:30:52Z")
- Booleans: 0/1
- Numbers: Can have up to 6 decimal places
- Empty fields: Empty string between tabs

### Tax Rate TSV Field Order (Template Example)
```
0: Sequence (internal ID)
1: Type (numeric type code)
2: LastModifiedTime
3: TaxCode (primary key)
4: PaidAccount
5: RecAccount
6: Rate1
7: Date (changeover date, often empty)
8: Rate2
... (up to 32 fields total)
```

## REST API URL Patterns

### Base URL Format
```
http://host:port/REST/username:password@datafile/endpoint
```

### Endpoints
- `/export?table=TableName` - Export data (GET)
- `/import?table=TableName` - Import data (POST)
- `/evaluate?expr=expression` - Evaluate MWScript
- `/version` - Version info
- `/list` - List tables

### Query Parameters
- `table` - Table name (required)
- `search` - Filter expression
- `start` - Starting record (0-based)
- `limit` - Maximum records
- `orderby` - Sort expression
- `format` - Export format (tsv/xml-terse/xml-verbose)
- `no_linger` - Release connection immediately

## Authentication Patterns

### Basic Authentication
```javascript
Authorization: Basic base64(username:password)
```

### Two-Level Authentication (Folder + Document)
```javascript
// Folder level
Authorization-Folder: Basic base64(folderName:folderPassword)
// Document level
Authorization: Basic base64(username:password)
```

### URL Encoding Rules
- Replace `/` with `%2f` in data file names
- URL encode username and password
- Spaces become `%20`

## XML Format Patterns

### Export Structure
```xml
<?xml version="1.0"?>
<export>
  <table name="TableName">
    <record>
      <FieldName>Value</FieldName>
    </record>
  </table>
</export>
```

### Import Structure
```xml
<?xml version="1.0"?>
<import table="TableName" mode="create">
  <record>
    <FieldName>Value</FieldName>
  </record>
</import>
```

### XML Characteristics
- Field names are lowercase in XML (unlike TSV)
- Empty elements for null values
- Special character escaping required
- Two formats: xml-terse and xml-verbose

## Error Response Patterns
- Empty response: Connection issue
- Single word without tabs/spaces: Error message
- HTTP status codes with text body
- Common errors:
  - "Unauthorized" - Auth failure
  - "Table not found" - Invalid table
  - "bad table name" - Malformed request
  - "Syntax error" - Invalid expression

## Search Expression Syntax
```
// Exact match
FieldName='Value'

// Contains
FieldName CONTAINS 'text'

// Numeric comparison
NumericField > 0

// Date comparison
DateField >= '20230101'

// Combined
Field1='A' OR Field2='B'

// Null check
FieldName = ''
```

## Common Field Patterns

### Period Encoding
```javascript
// MoneyWorks encodes periods as: 100 * year + period
const encodedPeriod = year * 100 + month;
// Example: 202312 = December 2023
```

### Sign Bit for Amounts
```javascript
const SIGN_BIT = 0x80000000;
// Used for overpayment flags in some tables
```

### Field Naming Conventions
- MoneyWorks uses PascalCase for field names
- Primary keys vary by table (not always "Code")
- Some tables use compound keys
- Subfiles reference parent via ParentSeq

## Response Size Limits
- Default timeout: 30 seconds
- Max records per request: Usually unlimited but use `limit` for performance
- Large exports should use pagination with `start` and `limit`

## Important Implementation Notes
1. Always check if first TSV line is headers or data
2. Handle both authenticated URL and header authentication
3. TSV is default format, XML requires explicit format parameter
4. Empty dates/times are empty strings, not null
5. Numeric precision varies by field type
6. Some fields are read-only and ignored on import
7. Character encoding is UTF-8