# MoneyWorks MCP Server - AI Assistant Tool Documentation

## Overview

This documentation provides comprehensive guidance for AI assistants on how to effectively use the MoneyWorks MCP (Model Context Protocol) server tools. The MCP server provides read-only access to MoneyWorks accounting data through a structured set of tools organized by functional areas.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Concepts](#core-concepts)
3. [Tool Categories](#tool-categories)
4. [Data Access Patterns](#data-access-patterns)
5. [Error Handling](#error-handling)
6. [Performance Guidelines](#performance-guidelines)
7. [Tool Reference](#tool-reference)
8. [Best Practices](#best-practices)
9. [Common Use Cases](#common-use-cases)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

The MoneyWorks MCP server is built using the Model Context Protocol SDK and provides access to MoneyWorks accounting data through a collection of specialized tools. The server follows these key principles:

- **Read-only access**: All tools provide read-only access to data
- **Structured queries**: Tools use Zod schemas for input validation
- **Consistent patterns**: Similar tools follow consistent naming and parameter patterns
- **Error tracking**: Built-in error tracking and ticket generation system
- **Performance optimization**: Pagination and filtering support for large datasets

### Key Components

- **MCP Server**: Main server instance handling tool requests
- **Service Layer**: Business logic for data access
- **Tools**: Individual tools for specific functionality
- **Ticket Service**: Error tracking and logging system
- **Data Types**: Strongly typed interfaces for all data structures

## Core Concepts

### Tool Structure

Every tool follows a consistent structure:

```typescript
{
  description: string,          // Human-readable description
  inputSchema: ZodSchema,       // Input validation schema
  execute: async function       // Implementation function
}
```

### Common Parameters

Most tools support these standard parameters:

- **limit**: Maximum number of results (1-100, default 50)
- **offset**: Number of results to skip for pagination
- **query**: General search query string
- **search criteria**: Specific field filters

### Response Patterns

Tools return structured responses with:

- **data**: The actual results
- **total**: Total number of matching records
- **pagination**: Pagination information
- **metadata**: Additional context information

## Tool Categories

### 1. Data Table Tools

These tools provide access to core MoneyWorks data tables:

#### Account Tools
- **searchAccounts**: Search accounts by code, description, type, or category
- **getAccount**: Get specific account by code
- **listAccountFields**: List available account fields

#### Transaction Tools
- **searchTransactions**: Search transactions with various filters
- **getTransaction**: Get transaction by sequence number
- **getTransactionByRef**: Get transaction by reference
- **getTransactionSummary**: Get transaction summary with totals
- **listTransactionFields**: List available transaction fields

#### Name (Customer/Supplier) Tools
- **searchNames**: Search customers and suppliers
- **getName**: Get specific name record
- **listNameFields**: List available name fields

#### Product Tools
- **searchProducts**: Search product catalog
- **getProduct**: Get specific product
- **listProductFields**: List available product fields

#### Inventory Tools
- **searchInventory**: Search inventory items
- **getInventoryItem**: Get specific inventory item
- **listInventoryFields**: List available inventory fields

#### Job Tools
- **searchJobs**: Search job records
- **getJob**: Get specific job
- **listJobFields**: List available job fields

#### Payment Tools
- **searchPayments**: Search payment records
- **getPayment**: Get specific payment
- **getPaymentsByInvoice**: Get payments for specific invoice
- **getPaymentsByCashTrans**: Get payments by cash transaction
- **getPaymentSummary**: Get payment summary statistics
- **listPaymentFields**: List available payment fields

#### Ledger Tools
- **searchLedger**: Search general ledger entries
- **getLedgerEntry**: Get specific ledger entry
- **listLedgerFields**: List available ledger fields

#### Off-Ledger Tools
- **searchOffLedger**: Search off-ledger entries
- **getOffLedgerEntry**: Get specific off-ledger entry
- **listOffLedgerFields**: List available off-ledger fields

#### Detail Tools
- **searchDetails**: Search transaction detail lines
- **getDetail**: Get specific detail line
- **listDetailFields**: List available detail fields

### 2. Configuration and Settings Tools

#### General Settings Tools
- **searchGeneral**: Search general configuration entries
- **getGeneralSetting**: Get specific configuration setting
- **listGeneralFields**: List available general fields

#### Department Tools
- **searchDepartments**: Search department records
- **getDepartment**: Get specific department
- **listDepartmentFields**: List available department fields

#### Tax Rate Tools
- **searchTaxRates**: Search tax rate configurations
- **getTaxRate**: Get specific tax rate
- **listTaxRateFields**: List available tax rate fields

#### Currency Info Tools
- **getCurrencyInfo**: Get currency information
- **getCurrencyFormatting**: Get currency formatting rules
- **getExchangeRates**: Get exchange rate information
- **convertCurrency**: Convert between currencies
- **getMoneyWorksCurrencySettings**: Get MoneyWorks currency settings

### 3. System and Metadata Tools

#### System Information Tools
- **getSystemInfo**: Get comprehensive system information
- **getApiCapabilities**: Get API capabilities and features
- **getSystemStatus**: Get current system status and health

#### Table Schema Tools
- **listTables**: List all available tables
- **describeTableSchema**: Get detailed schema for a table
- **getFieldMetadata**: Get metadata for specific fields
- **getTableRelationships**: Get table relationship information

#### API Endpoints Tools
- **listEndpoints**: List all available API endpoints
- **describeEndpoint**: Get detailed endpoint information

#### Validation Rules Tools
- **getValidationRules**: Get system validation rules
- **getTableValidationRules**: Get validation rules for specific table
- **getBusinessRules**: Get business logic rules

#### Enum Values Tools
- **getEnumValues**: Get enumeration values for fields
- **getTableEnumFields**: Get enum fields for specific table
- **searchEnumValues**: Search enum values
- **getEnumUsagePatterns**: Get enum usage patterns

#### Date Formats Tools
- **getDateFormats**: Get supported date formats
- **getTableDateFields**: Get date fields for specific table
- **getSupportedDateFormats**: Get all supported date formats
- **parseDateString**: Parse date strings with format detection

#### Permission Info Tools
- **getPermissionInfo**: Get user permission information
- **getTablePermissions**: Get table-specific permissions
- **getUserRoles**: Get user role information
- **checkUserPermissions**: Check specific user permissions
- **getSecurityAuditInfo**: Get security audit information

### 4. Evaluation and Reporting Tools

#### Evaluation Tools
- **evaluateExpression**: Evaluate MoneyWorks expressions
- **evaluateTemplate**: Evaluate custom templates against tables
- **listCommonExpressions**: List common expressions and functions

#### Report Tools
- **generateReport**: Generate MoneyWorks reports
- **getReportParameters**: Get parameters for specific report
- **listCommonReports**: List commonly used reports

### 5. Company and User Tools

#### Company Information Tools
- **getCompanyInformation**: Get company details and settings
- **listCompanyInformationFields**: List available company fields

#### User Tools
- **searchUsers**: Search user accounts
- **getUser**: Get specific user information
- **listUserFields**: List available user fields

#### User2 Tools (Extended User Information)
- **searchUser2s**: Search extended user information
- **getUser2**: Get specific extended user data
- **listUser2Fields**: List available user2 fields

#### Login Tools
- **searchLogins**: Search login records
- **getLogin**: Get specific login information
- **listLoginFields**: List available login fields

### 6. Asset Management Tools

#### Asset Tools
- **searchAssets**: Search fixed assets
- **getAsset**: Get specific asset
- **listAssetFields**: List available asset fields

#### Asset Category Tools
- **searchAssetCats**: Search asset categories
- **getAssetCat**: Get specific asset category
- **listAssetCatFields**: List available asset category fields

#### Asset Log Tools
- **searchAssetLogs**: Search asset transaction logs
- **getAssetLog**: Get specific asset log entry
- **listAssetLogFields**: List available asset log fields

### 7. Banking and Financial Tools

#### Bank Reconciliation Tools
- **searchBankRecs**: Search bank reconciliation records
- **getBankRec**: Get specific bank reconciliation
- **listBankRecFields**: List available bank reconciliation fields

#### Auto Split Tools
- **searchAutoSplits**: Search automatic split configurations
- **getAutoSplit**: Get specific auto split rule
- **listAutoSplitFields**: List available auto split fields

### 8. Workflow and Communication Tools

#### Job Sheet Tools
- **searchJobSheets**: Search job sheet records
- **getJobSheet**: Get specific job sheet
- **listJobSheetFields**: List available job sheet fields

#### Message Tools
- **searchMessages**: Search system messages
- **getMessage**: Get specific message
- **listMessageFields**: List available message fields

#### Memo Tools
- **searchMemos**: Search memo records
- **getMemo**: Get specific memo
- **listMemoFields**: List available memo fields

#### Stickie (Notes) Tools
- **searchStickies**: Search sticky note records
- **getStickie**: Get specific sticky note
- **listStickieFields**: List available stickie fields

### 9. Contact and Communication Tools

#### Contact Tools
- **searchContacts**: Search contact records
- **getContact**: Get specific contact
- **listContactFields**: List available contact fields

#### Link Tools
- **searchLinks**: Search link records
- **getLink**: Get specific link
- **listLinkFields**: List available link fields

### 10. System Management Tools

#### List Tools
- **searchLists**: Search system lists
- **getList**: Get specific list
- **listListFields**: List available list fields

#### Filter Tools
- **searchFilters**: Search filter configurations
- **getFilter**: Get specific filter
- **listFilterFields**: List available filter fields

#### Log Tools
- **searchLogs**: Search system logs
- **getLog**: Get specific log entry
- **listLogFields**: List available log fields

#### Build Tools
- **searchBuilds**: Search build records
- **getBuild**: Get specific build
- **listBuildFields**: List available build fields

#### System Labels Tools
- **listAvailableTables**: List tables with label support
- **getTableLabels**: Get labels for specific table
- **listSupportedLanguages**: List supported languages
- **generateAllLabels**: Generate labels for all tables

## Data Access Patterns

### 1. Search Pattern

Most tools follow a consistent search pattern:

```typescript
// Search with filters
const result = await tool.execute({
  query: "search term",      // General search
  type: "specific_type",     // Type filter
  limit: 25,                 // Results per page
  offset: 0,                 // Skip results
  // Additional specific filters...
});
```

### 2. Get by Key Pattern

For retrieving specific records:

```typescript
// Get by primary key
const record = await tool.execute({
  code: "ACCOUNT_CODE",      // or id, sequenceNumber, etc.
});
```

### 3. List Fields Pattern

To discover available fields:

```typescript
// Get field metadata
const fields = await tool.execute({});
// Returns: { fields: [...], description: "..." }
```

### 4. Date Range Filtering

Many tools support date range filtering:

```typescript
const result = await tool.execute({
  fromDate: "2024-01-01",    // YYYY-MM-DD format
  toDate: "2024-12-31",      // YYYY-MM-DD format
  // other filters...
});
```

### 5. Amount Range Filtering

Financial tools often support amount filtering:

```typescript
const result = await tool.execute({
  minAmount: 100.00,
  maxAmount: 1000.00,
  // other filters...
});
```

## Error Handling

### Error Types

The MCP server handles several types of errors:

1. **Validation Errors**: Invalid input parameters
2. **Not Found Errors**: Record not found
3. **API Errors**: MoneyWorks API communication issues
4. **System Errors**: Server or configuration issues

### Error Response Format

```typescript
{
  error: string,           // Error message
  code: string,           // Error code
  details?: any,          // Additional error details
  timestamp: string       // ISO timestamp
}
```

### Error Tracking

All errors are automatically tracked in the ticket system with:

- Tool name and parameters
- Error message and stack trace
- Session information
- Timestamp and context

### Recovery Strategies

When encountering errors:

1. **Validation Errors**: Check parameter format and values
2. **Not Found**: Verify the key/code exists using search tools
3. **API Errors**: Check system status and retry
4. **Rate Limits**: Implement delays between requests

## Performance Guidelines

### 1. Use Appropriate Limits

- Start with small limits (10-25) for exploratory queries
- Use larger limits (50-100) for data export scenarios
- Implement pagination for large datasets

### 2. Leverage Filtering

- Use specific filters instead of broad searches
- Combine multiple filters to narrow results
- Use date ranges to limit time-based queries

### 3. Field Selection

- Use listFields tools to understand available data
- Only request fields you need for analysis
- Consider field relationships when joining data

### 4. Caching Considerations

- System metadata (schemas, field lists) rarely changes
- Configuration data changes infrequently
- Transaction data is more dynamic

### 5. Batch Operations

- Group related queries when possible
- Use summary tools instead of detailed queries when appropriate
- Prefer specific get operations over search when key is known

## Tool Reference

### Search Tools

All search tools support these common parameters:

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| query | string | General search term | - |
| limit | number | Max results (1-100) | 50 |
| offset | number | Results to skip | 0 |

#### Account Search Types

| Type | Description |
|------|-------------|
| IN | Income |
| SA | Sales |
| EX | Expense |
| CS | Cost of Sales |
| CA | Current Asset |
| CL | Current Liability |
| FA | Fixed Asset |
| TA | Term Asset |
| TL | Term Liability |
| SF | Shareholders Funds |

#### Transaction Types

| Type | Description |
|------|-------------|
| SI | Sales Invoice |
| SC | Sales Credit |
| SR | Sales Receipt |
| SD | Sales Deposit |
| PI | Purchase Invoice |
| PC | Purchase Credit |
| PP | Purchase Payment |
| PD | Purchase Deposit |
| JN | Journal |
| JC | Journal Correction |
| BR | Bank Receipt |
| BP | Bank Payment |
| BT | Bank Transfer |
| ST | Stock Transfer |
| SO | Sales Order |
| PO | Purchase Order |

#### Transaction Statuses

| Status | Description |
|--------|-------------|
| OP | Open |
| CL | Closed |
| PA | Partial |
| CA | Cancelled |
| DR | Draft |

### Evaluation Tool Reference

#### Common MoneyWorks Expressions

**System Functions:**
- `GetPeriod()` - Current accounting period
- `CurrentUser()` - Current user name
- `Date()` - Current date
- `Time()` - Current time
- `Version()` - MoneyWorks version

**Date Functions:**
- `Today()` - Today's date
- `Month(date)` - Extract month
- `Year(date)` - Extract year
- `DayOfWeek(date)` - Day of week (1-7)
- `DateAdd(date, days)` - Add days to date

**Text Functions:**
- `Upper(text)` - Convert to uppercase
- `Lower(text)` - Convert to lowercase
- `Trim(text)` - Remove leading/trailing spaces
- `Left(text, n)` - First n characters
- `Right(text, n)` - Last n characters

**Math Functions:**
- `Round(value, decimals)` - Round to decimal places
- `Abs(value)` - Absolute value
- `Min(a, b)` - Minimum of two values
- `Max(a, b)` - Maximum of two values
- `Sum(field)` - Sum of field values

**Lookup Functions:**
- `Lookup(table, keyField, keyValue, returnField)` - Lookup value
- `Count(table, criteria)` - Count matching records
- `Sum(table.field, criteria)` - Sum field with criteria
- `Average(table.field, criteria)` - Average with criteria

## Best Practices

### 1. Tool Selection

**For Data Discovery:**
1. Start with `listTables` to understand available data
2. Use `describeTableSchema` for detailed field information
3. Use `listFields` tools for specific table fields

**For Data Access:**
1. Use search tools for exploration and filtering
2. Use get tools when you have specific keys
3. Use summary tools for aggregated information

**For System Information:**
1. Use `getSystemInfo` for comprehensive system overview
2. Use `getApiCapabilities` to understand limitations
3. Use `getSystemStatus` for health monitoring

### 2. Query Optimization

**Start Broad, Then Narrow:**
```typescript
// 1. Explore available data
const tables = await listTables.execute({});

// 2. Understand schema
const schema = await describeTableSchema.execute({
  tableName: "transaction"
});

// 3. Search with filters
const transactions = await searchTransactions.execute({
  type: "SI",
  status: "OP",
  limit: 25
});
```

**Use Appropriate Granularity:**
```typescript
// For overview - use summary
const summary = await getTransactionSummary.execute({
  type: "SI",
  fromDate: "2024-01-01",
  toDate: "2024-12-31"
});

// For details - use search with filters
const details = await searchTransactions.execute({
  type: "SI",
  status: "OP",
  limit: 50
});
```

### 3. Error Handling

**Graceful Degradation:**
```typescript
try {
  const account = await getAccount.execute({ code: "1000" });
  return account;
} catch (error) {
  // Fall back to search if direct access fails
  const results = await searchAccounts.execute({ 
    query: "1000",
    limit: 1 
  });
  return results.accounts[0] || null;
}
```

**Validation Before Use:**
```typescript
// Validate required fields exist
const fields = await listAccountFields.execute({});
const hasBalanceField = fields.fields.includes("Balance");

if (hasBalanceField) {
  // Proceed with balance-related operations
}
```

### 4. Data Interpretation

**Understand Data Types:**
- Use field metadata to understand data formats
- Check enum values for valid options
- Understand date formats and timezone handling

**Context Awareness:**
- Consider accounting period when analyzing data
- Understand multi-currency implications
- Be aware of user permission limitations

### 5. Response Processing

**Efficient Data Processing:**
```typescript
// Process large datasets in chunks
let offset = 0;
const limit = 100;
let allTransactions = [];

while (true) {
  const result = await searchTransactions.execute({
    limit,
    offset,
    type: "SI"
  });
  
  allTransactions.push(...result.transactions);
  
  if (result.transactions.length < limit) {
    break; // No more data
  }
  
  offset += limit;
}
```

## Common Use Cases

### 1. Financial Analysis

**Account Balances:**
```typescript
// Get all asset accounts
const assets = await searchAccounts.execute({
  type: "CA", // Current Assets
  limit: 100
});

// Analyze balance trends
for (const account of assets.accounts) {
  console.log(`${account.Code}: ${account.Description} = ${account.Balance}`);
}
```

**Transaction Analysis:**
```typescript
// Get sales performance
const salesSummary = await getTransactionSummary.execute({
  type: "SI",
  fromDate: "2024-01-01",
  toDate: "2024-12-31"
});

console.log(`Total Sales: ${salesSummary.grandTotal}`);
console.log(`Outstanding: ${salesSummary.outstandingTotal}`);
```

### 2. Customer Analysis

**Customer Information:**
```typescript
// Find customer
const customers = await searchNames.execute({
  query: "ACME Corp",
  limit: 10
});

// Get customer transactions
const customerTrans = await searchTransactions.execute({
  nameCode: customers.names[0].Code,
  type: "SI",
  limit: 50
});
```

### 3. Inventory Management

**Product Analysis:**
```typescript
// Low stock items
const products = await searchProducts.execute({
  limit: 100
});

// Filter by stock levels (post-processing)
const lowStock = products.products.filter(p => 
  p.StockOnHand < p.ReorderLevel
);
```

### 4. System Administration

**System Health Check:**
```typescript
// Comprehensive system overview
const systemInfo = await getSystemInfo.execute({
  includePerformance: true,
  includeEnvironment: true,
  includeDatabase: true
});

const status = await getSystemStatus.execute({
  includeHealth: true
});

console.log(`System Status: ${status.status.overall}`);
console.log(`Response Time: ${systemInfo.system.performance.responseTime}ms`);
```

### 5. Data Discovery

**Schema Exploration:**
```typescript
// Discover all tables
const tables = await listTables.execute({});

// Get detailed schema for interesting tables
for (const table of tables.tables) {
  const schema = await describeTableSchema.execute({
    tableName: table.name
  });
  
  console.log(`Table: ${table.name}`);
  console.log(`Fields: ${schema.schema.fields.length}`);
  console.log(`Primary Key: ${schema.schema.primaryKey}`);
}
```

### 6. Report Generation

**Custom Reports:**
```typescript
// List available reports
const reports = await listCommonReports.execute({});

// Generate specific report
const reportParams = await getReportParameters.execute({
  reportName: "Trial Balance"
});

const report = await generateReport.execute({
  reportName: "Trial Balance",
  parameters: {
    period: 12,
    includeZeroBalances: false
  }
});
```

### 7. Currency and Localization

**Multi-Currency Support:**
```typescript
// Get currency information
const currencyInfo = await getCurrencyInfo.execute({});

// Convert amounts
const converted = await convertCurrency.execute({
  amount: 1000,
  fromCurrency: "USD",
  toCurrency: "EUR"
});

// Get formatting rules
const formatting = await getCurrencyFormatting.execute({
  currency: "USD"
});
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Tool Not Found

**Problem:** Tool name not recognized
**Solution:** 
- Check tool name spelling
- Use `listEndpoints` to see available tools
- Verify MCP server is running correctly

#### 2. Invalid Parameters

**Problem:** Parameter validation fails
**Solution:**
- Check parameter types and formats
- Use field listing tools to understand valid values
- Review date format requirements (YYYY-MM-DD)

#### 3. No Results Returned

**Problem:** Search returns empty results
**Solution:**
- Broaden search criteria
- Check if data exists using different filters
- Verify case sensitivity in search terms
- Use exact matches for codes

#### 4. Performance Issues

**Problem:** Slow response times
**Solution:**
- Reduce result limits
- Add more specific filters
- Check system status
- Use summary tools instead of detailed queries

#### 5. Permission Denied

**Problem:** Access denied errors
**Solution:**
- Check user permissions with `getUserRoles`
- Verify table permissions with `getTablePermissions`
- Contact system administrator for access

#### 6. Data Format Issues

**Problem:** Unexpected data formats
**Solution:**
- Use `getDateFormats` for date formatting
- Check `getCurrencyFormatting` for number formats
- Review field metadata for data types

### Debugging Strategies

#### 1. Progressive Refinement

Start with basic queries and progressively add filters:

```typescript
// 1. Basic search
let result = await searchTransactions.execute({ limit: 5 });

// 2. Add type filter
result = await searchTransactions.execute({ 
  type: "SI", 
  limit: 5 
});

// 3. Add date filter
result = await searchTransactions.execute({ 
  type: "SI",
  fromDate: "2024-01-01",
  limit: 5 
});
```

#### 2. Schema Verification

Always verify available fields before complex queries:

```typescript
// Check what fields are available
const fields = await listTransactionFields.execute({});
console.log("Available fields:", fields.fields);

// Then use appropriate fields in queries
```

#### 3. System Status Checks

When experiencing issues, check system health:

```typescript
const status = await getSystemStatus.execute({});
if (status.status.overall !== "healthy") {
  console.log("System issues detected:", status.alerts);
}
```

### Error Code Reference

| Error Code | Description | Solution |
|------------|-------------|----------|
| VALIDATION_ERROR | Invalid parameters | Check parameter format |
| NOT_FOUND | Record not found | Verify key exists |
| API_ERROR | MoneyWorks API issue | Check system status |
| PERMISSION_DENIED | Access denied | Check user permissions |
| RATE_LIMITED | Too many requests | Implement delays |
| SYSTEM_ERROR | Server error | Check logs, retry |

### Performance Optimization

#### 1. Query Optimization

- Use specific filters instead of broad searches
- Implement proper pagination for large datasets
- Combine related queries when possible

#### 2. Caching Strategy

- Cache schema and metadata information
- Store frequently used configuration data
- Refresh dynamic data appropriately

#### 3. Monitoring

- Track response times for different tool types
- Monitor error rates and patterns
- Use system status tools for health checks

## Conclusion

This documentation provides comprehensive guidance for AI assistants working with the MoneyWorks MCP server. The key to effective use is understanding the data model, following consistent patterns, and implementing proper error handling and performance optimization strategies.

For additional support:
- Review the MCP server logs for detailed error information
- Use the ticket system for tracking and resolving issues
- Consult MoneyWorks documentation for business logic details
- Monitor system health and performance regularly

Remember that this is a read-only API focused on data access and analysis. All tools are designed to provide comprehensive access to MoneyWorks data while maintaining system security and performance.