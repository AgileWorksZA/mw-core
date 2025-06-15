# MoneyWorks API Endpoints Specification

This document catalogs all non-table endpoints and special functionality in the @moneyworks/api package that must be preserved or reimplemented when refactoring to use the @moneyworks/core package.

## 1. Expression Evaluation Endpoints

### 1.1 Evaluate Expression
**Endpoint**: `POST /api/evaluate`  
**Purpose**: Execute MoneyWorks expressions and MWScript code  
**Request Body**:
```typescript
{
  expression: string  // MoneyWorks expression to evaluate
}
```
**Response**: `string` - Result of the expression  
**Example**:
```json
// Request
{ "expression": "Count(Account)" }
// Response
"42"
```

### 1.2 Evaluate Template
**Endpoint**: `POST /api/eval/:table`  
**Purpose**: Evaluate custom template against table records  
**Path Parameters**:
- `table`: Table name (e.g., "account", "transaction")

**Request Body**:
```typescript
{
  template: string  // Template with [FieldName] placeholders
}
```
**Response**: `string[]` - Array of evaluated templates  
**Example**:
```json
// Request to /api/eval/account
{ "template": "[Code] - [Description] (Balance: $[Balance])" }
// Response
[
  "1000 - Sales (Balance: $5000.00)",
  "2000 - Expenses (Balance: $-2000.00)"
]
```

## 2. Company Information

### 2.1 Get Company Information
**Endpoint**: `GET /api/company-information`  
**Purpose**: Retrieve company-wide settings and system information  
**Query Parameters**:
- `select[]`: Optional array of specific fields to retrieve

**Response**: 
```typescript
{
  companyName: string
  companyAddress: string
  companyPhone: string
  companyFax: string
  companyEmail: string
  companyWebsite: string
  companyTaxNumber: string
  multiCurrencyEnabled: boolean
  gstEnabled: boolean
  gstRate: number
  gstName: string
  currentPeriod: number
  networkLatency: number
  // ... additional fields based on select parameter
}
```

**Implementation Notes**:
- Uses expression evaluation to fetch system-level data
- Fields are dynamically evaluated using MWScript functions like `GetCompanyName()`

## 3. Report Generation

### 3.1 Generate Report
**Endpoint**: `GET /api/report/:name`  
**Purpose**: Generate MoneyWorks reports in HTML format  
**Path Parameters**:
- `name`: Report name (e.g., "Balance Sheet", "Profit & Loss")

**Response**: HTML string  
**Special Configuration**:
```typescript
{
  format: "html",
  font: "Verdana",
  size: 10,
  leading: 8
}
```

## 4. System Labels

### 4.1 Get Table Labels
**Endpoint**: `GET /api/system-labels/:table`  
**Purpose**: Get human-readable field labels with multi-language support  
**Path Parameters**:
- `table`: Table name

**Query Parameters**:
- `language`: Language code (default: "en")

**Response**:
```typescript
{
  [fieldName: string]: string  // Field name to label mapping
}
```

**Features**:
- Response caching for performance
- Multi-language support
- Special handling for enumerated fields (e.g., color codes)

### 4.2 Generate All Labels
**Endpoint**: `POST /api/system-labels`  
**Purpose**: Pre-generate and cache labels for all tables  
**Response**:
```typescript
{
  [tableName: string]: number  // Table name to count of labels
}
```

## 5. Core Package REST Endpoints

These endpoints are provided by @moneyworks/core and should remain accessible:

### 5.1 Post Transactions
**Endpoint**: `POST /post`  
**Query Parameters**:
- `seq`: Comma-separated sequence numbers

**Response**: Success/failure status

### 5.2 Generate Forms
**Endpoint**: `GET /doform`  
**Query Parameters**:
- `form`: Form type (e.g., "invoice", "statement")
- `seq`: Sequence number
- Additional formatting parameters

**Response**: PDF buffer

### 5.3 Get Version
**Endpoint**: `GET /version`  
**Response**: Version string (e.g., "9.1.7")

### 5.4 List Documents
**Endpoint**: `GET /list`  
**Response**: Array of document names

## 6. Advanced Export Features

### 6.1 Export Formats
**Standard Formats**:
- `json` - JSON (converted from XML internally)
- `xml-terse` - Compact XML (omits empty fields)
- `xml-verbose` - Full XML (includes all fields)
- `tsv` - Tab-separated values (default when no format specified)

**Custom Formats**:
```typescript
// Template format
{ template: "[Field1]\\t[Field2 * 0.15]\\n" }

// Script format
{ script: "MyExportScript" }
```

### 6.2 Stream Export
**Purpose**: Handle large datasets efficiently  
**Features**:
- Chunked data retrieval
- Progress callbacks
- Automatic pagination

**Usage Pattern**:
```typescript
const stream = client.exportStream(table, {
  chunkSize: 100,
  onProgress: (progress) => {
    console.log(`${progress.current}/${progress.total}`);
  }
});

for await (const batch of stream) {
  // Process batch
}
```

## 7. Import Advanced Features

### 7.1 Import Options
**Special Parameters**:
- `return_seq=true` - Returns sequence number of imported record
- `mode` - Import mode: "create", "update", "upsert"
- `workItOut` - Auto-calculate fields
- `calculated` - Custom calculated field expressions
- `continueOnError` - Don't stop on errors

## 8. Database Introspection

### 8.1 Available Functions
```typescript
getDatabaseTables(): Promise<string[]>
getDatabaseFields(tableName: string): Promise<string[]>
getDatabaseFieldSize(tableName: string, fieldName: string): Promise<string>
getDatabaseFieldsWithTypes(tableName: string): Promise<FieldInfo[]>
```

## 9. Authentication

### 9.1 Authentication Modes
**Single-level**: Document authentication only
```
Authorization: Basic base64(username:password)
```

**Two-level**: Folder + Document authentication
```
Authorization: Basic base64(username:password)
Authorization-Folder: Basic base64(folderUser:folderPassword)
```

### 9.2 URL Construction
**Pattern**: `http[s]://host:port/REST/user:password@document/endpoint`

## 10. Error Handling

### 10.1 Error Codes
```typescript
enum MoneyWorksErrorCode {
  AUTH_FAILED = "AUTH_FAILED",
  DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND",
  INVALID_REQUEST = "INVALID_REQUEST",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DUPLICATE_RECORD = "DUPLICATE_RECORD",
  RECORD_NOT_FOUND = "RECORD_NOT_FOUND",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  SERVER_ERROR = "SERVER_ERROR",
  TIMEOUT = "TIMEOUT",
  INVALID_RESPONSE = "INVALID_RESPONSE",
  UNKNOWN = "UNKNOWN"
}
```

## 11. Performance Features

### 11.1 Configuration Options
- `timeout`: Request timeout in milliseconds (default: 30000)
- `noLinger`: Release connection immediately after request

### 11.2 Optimization Strategies
- Chunked operations for large datasets
- Response caching for system labels
- Streaming exports for memory efficiency

## Migration Checklist

When refactoring to use @moneyworks/core, ensure these features are preserved:

- [ ] Expression evaluation endpoint
- [ ] Template evaluation endpoint
- [ ] Company information retrieval
- [ ] Report generation with HTML output
- [ ] System labels with caching
- [ ] Multi-language support
- [ ] Advanced export formats (custom templates)
- [ ] Stream export for large datasets
- [ ] Import with special options
- [ ] Database introspection utilities
- [ ] Two-level authentication support
- [ ] Comprehensive error handling
- [ ] Performance optimizations

## Notes

1. The @moneyworks/api package adds a REST-like layer over the core functionality
2. Some endpoints combine multiple core operations (e.g., company info uses evaluate)
3. Caching strategies are important for performance (especially for system labels)
4. The API provides higher-level abstractions that simplify client usage