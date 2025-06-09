# MoneyWorks API Layer Audit Document

## Executive Summary

This document captures the comprehensive audit of the current MoneyWorks API layer to inform the Level 0 interface design. The audit reveals a sophisticated but over-abstracted architecture that transforms MoneyWorks REST responses through multiple layers before reaching the MCP tools.

---

## 1. MoneyWorksApiService - Core API Methods

### Method Signatures and Call Types

#### A. Export Operations
```typescript
async export<T extends object = object>(
  table: string,
  params: MoneyWorksQueryParams<T> = {}
): Promise<{
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    next: number;
    prev: number;
  };
}>
```
- **Purpose**: Primary data retrieval method for all table operations
- **URL Pattern**: `/export?table={table}&{queryParams}`
- **Response Formats**: XML (default), XML-verbose, TSV (when fields specified), Custom
- **Special Handling**: Detail table redirects to transaction table with parent parameter

#### B. Evaluate Operations
```typescript
async evaluate(expression: string): Promise<string>
```
- **Purpose**: Execute MoneyWorks expressions and system functions
- **URL Pattern**: `/evaluate?expr={encodedExpression}`
- **Response Format**: Raw text string
- **Use Cases**: 
  - `GetDatabaseFiles()` - List all tables
  - `GetDatabaseFields("{table}")` - List table fields
  - `GetDatabaseFieldSize("{table}", "{field}")` - Get field type/size

#### C. Import Operations
```typescript
async import(table: string, data: string, returnSeq = false)
```
- **Purpose**: Import data into MoneyWorks
- **URL Pattern**: `/import` or `/import/return_seq=true`
- **Content-Type**: text/xml
- **Note**: Not currently exposed through MCP tools

#### D. Metadata Discovery Methods
```typescript
async getDatabaseTables(): Promise<string[]>
async getDatabaseFields(tableName: string): Promise<string[]>
async getDatabaseFieldSize(tableName: string, fieldName: string): Promise<string>
async getDatabaseFieldsWithTypes(tableName: string): Promise<Array<{
  name: string;
  type: string;
  jsType?: string;
}>>
```
- All use `evaluate()` internally with MoneyWorks functions
- Provide schema discovery capabilities

### Key Findings - API Call Patterns

1. **Only 3 REST endpoints used**: `/export`, `/evaluate`, `/import`
2. **evaluate() is versatile**: Used for metadata, system functions, and expressions
3. **export() handles all data retrieval**: With format flexibility
4. **import() exists but unused**: Potential for future Level 1 features

---

## 2. Authentication Patterns

### Dual Authentication Implementation

```typescript
private createAuthHeaders() {
  // Document auth (always required)
  const documentCredentials = `${this.config.username}:Document:${this.config.password}`;
  const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

  // Folder auth (only if configured)
  if (this.config.folderAuth) {
    const { folderName, password } = this.config.folderAuth;
    const folderCredentials = `${folderName}:Datacentre:${password}`;
    const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

    // Return dual headers as array (Axios format for duplicate header names)
    return {
      Authorization: [folderAuth, documentAuth],
    };
  }

  // Return document auth only
  return {
    Authorization: documentAuth,
  };
}
```

### Authentication Key Findings

1. **Dual-auth support**: Folder + Document authentication when needed
2. **Axios array format**: Uses array for duplicate Authorization headers
3. **Credentials format**: `{user}:{authType}:{password}` where authType is "Document" or "Datacentre"
4. **Base64 encoding**: Standard HTTP Basic auth

---

## 3. URL Construction Patterns

### Base URL Building

```typescript
private getBaseUrl() {
  const protocol = this.config.protocol || "http";
  
  // If folderAuth exists, use folder path structure per MoneyWorks specification
  if (this.config.folderAuth) {
    const folderName = this.config.folderAuth.folderName;
    const folderPathEncoded = encodeURIComponent(folderName).replace('/', '%2f');
    const docNameEncoded = encodeURIComponent(this.config.dataFile);
    return `${protocol}://${this.config.host}:${this.config.port}/REST/${folderPathEncoded}%2f${docNameEncoded}`;
  }
  
  // Top-level document (no folder)
  return `${protocol}://${this.config.host}:${this.config.port}/REST/${encodeURIComponent(this.config.dataFile)}`;
}
```

### Query Parameter Building

```typescript
private buildQueryParams(params: MoneyWorksQueryParams, parent?: string): string
```

**Current Implementation Problems**:
1. **Object-based search reconstruction**: Takes `Partial<T>` and rebuilds query strings
2. **Limited to exact matching**: Only builds `Field="Value"` patterns
3. **No raw query support**: Cannot pass MoneyWorks expressions directly

**Parameter Encoding**:
- Search expressions: URL encoded
- Format strings: URL encoded with special handling for custom fields
- Numeric parameters: Direct string conversion

---

## 4. Response Format Analysis

### Format Selection Logic

#### XML Formats (Default)
```typescript
format: params.fields ? undefined : params.format || "xml-verbose"
```
- **xml-verbose**: Default, includes all fields and metadata
- **xml**: Standard XML without verbose attributes
- **xml-terse**: Minimal XML format

#### TSV/Custom Format (When fields array provided)
```typescript
if (params.fields && Array.isArray(params.fields) && params.fields.length > 0) {
  const formatStr = params.fields
    .map((field) => {
      if (parent) {
        return `[${parent}:${field}]`;
      }
      return `[${field}]`;
    })
    .join("\\t");
  
  queryParts.push(`format=${encodeURIComponent(formatStr)}%5Cn`);
}
```
- Custom field selection using MoneyWorks bracket syntax
- Tab-separated values response
- Used for performance optimization

### Response Processing

#### XML Processing
```typescript
this.parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "_",
  isArray: (name) => tableNames.includes(name),
  parseAttributeValue: true,
  processEntities: true,
});
```

#### TSV Processing
- Manual string splitting on tabs and newlines
- Direct field-to-value mapping
- No type conversion at this layer

---

## 5. Type System Analysis

### MoneyWorks Type Definitions

#### Core Configuration Types
```typescript
export interface MoneyWorksConfig {
  host: string;
  port: number;
  protocol?: "http" | "https";
  dataFile: string;
  username: string;
  password: string;
  folderAuth?: {
    folderName: string;
    password: string;
  };
}

export interface MoneyWorksQueryParams<T extends object = object> {
  limit?: number;
  start?: number;
  search?: Partial<T>;  // PROBLEM: Forces object-based search
  sort?: string;
  direction?: "ascending" | "descending";
  format?: "xml" | "xml-terse" | "xml-verbose" | string;
  fields?: string[];
}
```

### Table Type Patterns

#### Account Table Example
```typescript
export interface Account {
  SequenceNumber: number;
  LastModifiedTime: string;
  Code: string;
  Type: "I" | "S" | "E" | "C" | "A" | "L" | "F" | "T" | "M" | "H";
  System: "P" | "R" | "K" | "A" | "L" | "F" | " ";  // "K" = Bank Account
  // ... 30+ additional fields
}
```

**Type Annotations**:
- `@indexed`: Field is indexed in MoneyWorks
- `@mutable`: Mutability constraints ("free", "conditionally", "script-only")
- `@maxLength`: Maximum field length
- `@minimum/@maximum`: Numeric constraints

### Schema Definitions

```typescript
// account-schema.ts
export default {
  SequenceNumber: "integer",
  LastModifiedTime: "string",
  Code: "string",
  Type: "string",
  // ... simplified type mapping
} as Record<AccountField, string>;
```

**Schema Types**:
- `"integer"`: Whole numbers
- `"number"`: Decimal numbers
- `"string"`: Text fields
- `"boolean"`: True/false (rare in MoneyWorks)

---

## 6. TableService Base Class Analysis

### Current Abstraction Layer

```typescript
export class TableService<T extends object = object> {
  async getData(params: {
    limit?: number;
    offset?: number;
    search?: Partial<T>;  // Object-based search only
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
    skip_validation?: boolean;
  })
}
```

### Type Conversion Logic

```typescript
dataCenterJsonToTable(data: ANY): T {
  return this.fields.reduce((acc, key) => {
    const value = enforceType(
      data[String(key).toLowerCase()],
      this.schema[key] as "string",
    );
    (acc as ANY)[key] = value === "" ? null : value;
    return acc;
  }, {} as T);
}
```

**Conversion Issues**:
- Empty strings converted to null
- Case conversion (lowercase field names in XML)
- Type enforcement based on schema

---

## 7. Current Limitations & Level 0 Opportunities

### Critical Limitations

1. **No Raw Query Support**: `search?: Partial<T>` forces object-based queries
2. **Limited Query Building**: Only creates `Field="Value"` patterns
3. **Over-abstraction**: Multiple transformation layers
4. **Type Coupling**: Query parameters tied to TypeScript interfaces

### Reusable Components for Level 0

1. **Authentication Logic**: `createAuthHeaders()` method is solid
2. **URL Building**: `getBaseUrl()` handles folder/document paths well
3. **XML Parser Configuration**: Properly configured for MoneyWorks
4. **Error Handling**: `handleError()` provides good error messages
5. **HTTP Client Setup**: Axios configuration is appropriate

### Components to Replace/Simplify

1. **Query Parameter Building**: Need raw string pass-through
2. **Type Conversion**: Move to optional Level 1 feature
3. **TableService Pattern**: Too much abstraction for Level 0
4. **MCP Tool Schemas**: Need unified MoneyWorks-native parameters

---

## 8. Enumeration & Special Field Analysis

### Color Field System
```typescript
Colour: number;  // 0-7 index, user-defined labels in preferences
```

### System Account Types
```typescript
System: "P" | "R" | "K" | "A" | "L" | "F" | " ";
// K = Bank Account (BK in queries)
// A = Accounts Receivable (AR)
// L = Accounts Payable (AP)
```

### Multi-Language Support
- Labels defined per table in system preferences
- Not directly exposed through current API
- Potential Level 1 feature for label translation

### Validation Rules
- Field length constraints in type definitions
- Enum values for constrained fields
- Mutability rules in annotations

---

## 8.1 Complete Type System Analysis

### Table Type Patterns

All 33 tables follow consistent patterns:

1. **Universal Fields** (present in all tables):
   ```typescript
   SequenceNumber: number;        // Internal unique identifier
   LastModifiedTime: string;      // YYYYMMDDHHMMSS format
   ```

2. **Common Field Annotations**:
   - `@indexed`: Field is indexed for search performance
   - `@mutable`: Mutability constraints
     - `"freely, script-only"`: Editable via scripts
     - `"conditionally"`: Editable under certain conditions
     - `"conditionally, script-only"`: Conditional edit via scripts
   - `@maxLength` or `size`: Maximum field length
   - `@minimum/@maximum`: Numeric range constraints

3. **Type Mapping Patterns**:
   ```typescript
   // Schema type => TypeScript type
   "string" => string
   "integer" => number
   "number" => number (decimal)
   "boolean" => boolean
   "date" => Date (via yyyyMmDdToDate)
   "date-time" => Date (via yyyyMmDdHhMmSsToDate)
   ```

### MoneyWorks Date Format

```typescript
// Date format: YYYYMMDD
export function yyyyMmDdToDate(yyyyMmDd: string): Date {
  const year = parseInt(yyyyMmDd.slice(0, 4));
  const month = parseInt(yyyyMmDd.slice(4, 6)) - 1; // JS 0-based
  const day = parseInt(yyyyMmDd.slice(6, 8));
  return new Date(year, month, day);
}

// DateTime format: YYYYMMDDHHMMSS
export function yyyyMmDdHhMmSsToDate(yyyyMmDdHhMmSs: string): Date {
  // Similar parsing for full timestamp
}
```

### Type Enforcement Logic

```typescript
export function enforceType(
  input: string | number | boolean | Date | XMLValue,
  type: SchemaType
): TypedValue | null {
  // Handles XML attributes like _system
  // Converts empty strings to null
  // Enforces type based on schema
}
```

### Key Table Examples

#### Name Table (Customers/Suppliers)
- **Primary Key**: Code (12 chars)
- **Type Indicator**: Kind (0=Customer, 1=Supplier, 2=Both)
- **Multi-address**: Address1-4, Delivery1-4
- **Financial**: Terms, CreditLimit, Hold status
- **Categories**: Category1-4 for flexible classification

#### Product Table
- **Primary Key**: Code (32 chars - longer than most)
- **Pricing**: Multiple price levels (A-F) with quantity breaks
- **Inventory**: StockOnHand, ReorderLevel, MinBuildQty
- **Accounting**: SalesAcct, COGAcct, StockAcct
- **Units**: BuyUnit, SellUnit with ConversionFactor

#### Transaction Table
- **Complex Type**: 100+ fields for various transaction types
- **Status Tracking**: Status, Hold, Flags
- **Multi-currency**: Currency, ExchangeRate
- **Approval Workflow**: ApprovedBy1, ApprovedBy2
- **Custom Fields**: User1-8, UserText, TaggedText

### Schema Organization

```
types/
  interface/tables/     # TypeScript interfaces
    account.ts         # Account interface & field list
    transaction.ts     # Transaction interface & field list
    ...
  optimized/table/     # Runtime type schemas  
    account-schema.ts  # Field => type mapping
    transaction-schema.ts
    ...
```

---

## 8.2 Type Conversion Flow Analysis

### TableService Conversion Process

1. **Two Conversion Methods**:
   ```typescript
   dataCenterJsonToTable(data: ANY): T {
     // For XML responses - handles lowercase field names
     data[String(key).toLowerCase()]
   }
   
   dataCenterJsonToTableUsingFields(fields: FIELD[], data: ANY): T {
     // For TSV responses - uses exact field names
     data[key]
   }
   ```

2. **Key Conversion Issues**:
   - **Case Sensitivity**: XML returns lowercase field names, requiring conversion
   - **Empty String Handling**: `value === "" ? null : value`
   - **Type Enforcement**: Uses schema to determine target type
   - **Missing Field Warnings**: Logs but doesn't fail on missing fields

3. **Parameter Transformation**:
   ```typescript
   // API Layer => MoneyWorks
   offset => start
   order: "asc"/"desc" => direction: "ascending"/"descending"
   ```

### MCP Tool Post-Processing

Current MCP tools add additional filtering **after** API calls:

```typescript
// Date filtering (should be in query)
if (args.fromDate || args.toDate) {
  filteredData = filteredData.filter((trans) => {
    const transDate = new Date(trans.TransDate);
    // Client-side filtering
  });
}

// Amount filtering (should be in query)
if (args.minAmount || args.maxAmount) {
  filteredData = filteredData.filter((trans) => {
    // Client-side filtering
  });
}
```

**Problem**: This fetches all data then filters client-side instead of using MoneyWorks query language.

---

## 8.3 Reusable Components for Level 0

### Definitely Reusable

1. **Authentication System**
   ```typescript
   private createAuthHeaders()
   // Solid dual-auth implementation
   // No changes needed for Level 0
   ```

2. **URL Building**
   ```typescript
   private getBaseUrl()
   // Handles folder/document paths correctly
   // Direct reuse in Level 0
   ```

3. **HTTP Infrastructure**
   ```typescript
   // Axios configuration
   // Error handling with isAxiosError
   // Response type handling (text vs parsed)
   ```

4. **XML Parser Configuration**
   ```typescript
   new XMLParser({
     ignoreAttributes: false,
     attributeNamePrefix: "_",
     isArray: (name) => tableNames.includes(name),
     parseAttributeValue: true,
     processEntities: true,
   })
   ```

5. **MoneyWorks Config Type**
   ```typescript
   export interface MoneyWorksConfig
   // Complete and well-structured
   ```

### Components to Simplify/Replace

1. **Query Building** - Replace with raw pass-through
2. **Type Conversion** - Make optional for Level 1
3. **TableService Pattern** - Too much abstraction
4. **MCP Parameter Schemas** - Unify to MoneyWorks-native
5. **Client-side Filtering** - Use MoneyWorks queries instead

### Components to Enhance

1. **MoneyWorksQueryParams**
   ```typescript
   // Current
   search?: Partial<T>;  // Object-based only
   
   // Level 0 Enhancement
   search?: string;      // Raw MoneyWorks expression
   ```

2. **Error Messages**
   - Keep error structure
   - Add query syntax validation errors
   - Improve MoneyWorks error translation

---

## 9. Backlog Questions & Observations

### Questions for MoneyWorks Documentation

1. **Query Language Syntax**: Need complete syntax reference for:
   - String functions (left, right, substring)
   - Date functions and formatting
   - Numeric operators and functions
   - Boolean expression precedence
   - Relational search expressions (bracket notation)

2. **Format Specifications**: Document all supported format strings beyond XML/TSV

3. **Performance Characteristics**: Query complexity vs response time

4. **Field Relationships**: Foreign key relationships not explicitly defined

### Architecture Observations

1. **33 Table Types**: All follow similar interface pattern
2. **Consistent Field Patterns**: SequenceNumber, LastModifiedTime universal
3. **Special Tables**: Detail redirects to Transaction with parent
4. **Security Levels**: 0-5 star system on multiple tables

### Implementation Priorities

1. **Phase 1**: Create Level 0 service with raw query support
2. **Phase 2**: Preserve authentication and HTTP infrastructure
3. **Phase 3**: Build unified MCP tool interface
4. **Phase 4**: Optional type safety in Level 1

---

## Next Steps

1. Complete MoneyWorks query language documentation
2. Design Level 0 MoneyWorksService interface
3. Create migration plan from current TableService
4. Build query validation test suite
5. Implement unified MCP tool factory

---

**Audit Date**: January 2025
**Next Review**: After MoneyWorks syntax verification session