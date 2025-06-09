# MoneyWorks Format Strategy - Leveraging Server-Side Optimization

## Executive Summary

MoneyWorks provides powerful server-side format capabilities that can dramatically optimize data retrieval and reduce network overhead. The current codebase partially implements these features but doesn't expose their full power. This document outlines a comprehensive strategy for leveraging MoneyWorks' format parameter across Level 0 (raw pass-through), Level 1 (basic abstractions), and Level 2 (advanced features) interfaces.

## MoneyWorks Format Capabilities

### 1. Response Format Types

MoneyWorks supports multiple response formats via the `format` parameter:

#### A. XML Formats
- **`xml`** - Terse XML format, omits empty fields (most compact XML)
- **`xml-verbose`** - Includes all fields even if empty (current default)

#### B. Native TSV Format (Default)
- **No format parameter** - Tab-separated values with all fields
- Most efficient for full data retrieval
- Raw format that MoneyWorks uses internally
- **Important**: TSV returns no header row - field order matches TypeScript definitions

#### C. Custom Format with Functions
- **`format="[Expression1],[Expression2],literal text,[Expression3]"`**
- Combines field selection, functions, and literal text
- Returns custom-formatted text (not TSV)
- Text outside brackets is returned as-is

#### D. Server-Side Function Examples
- **Field selection**: `[Code]` - Simple field value
- **Lookups**: `[Lookup(NameCode,"Name.Name")]` - Resolve foreign key
- **String functions**: `[Left(Description,20)]` - Truncate text
- **Calculations**: `[Gross*1.1]` - Mathematical operations
- **Conditionals**: `[if(Status="O","Open","Closed")]` - Logic
- **Mixed with text**: `"Invoice: [OurRef] - Total: [Gross]"`

### 2. Current Implementation Analysis

The current codebase implements:
- ✅ XML-verbose as default (inefficient for large datasets)
- ✅ Basic custom field selection with `fields` array converting to `[Field]\t[Field]`
- ❌ No server-side function support
- ❌ No explicit TSV format option (though available by omitting format)
- ❌ No format optimization based on use case

### 3. TSV Header Management

Since TSV returns no headers, we must rely on:
- **TypeScript definitions**: Our source of truth for field order
- **Runtime validation**: Use MoneyWorks functions to verify:
  - `GetDatabaseFields(table)` - List of fields in order
  - `GetDatabaseFieldSize(table, field)` - Field types and sizes
- **Type safety**: Ensure 100% alignment between TypeScript and MoneyWorks

## Proposed Architecture

### Level 0: Raw Pass-Through Interface

**Purpose**: Direct access to all MoneyWorks format capabilities

```typescript
interface Level0FormatOptions {
  format?: string;  // Raw format string passed directly to MoneyWorks
}

// Examples:
{ format: "xml" }           // Terse XML (omits empty fields)
{ format: "xml-verbose" }   // All fields XML
{ format: undefined }       // Native TSV (no format parameter)
{ format: "[Code],[Description],Total: [Gross*1.1]" }  // Custom with text and calculation
```

**Benefits**:
- Full access to MoneyWorks power
- No abstraction overhead
- Direct server-side optimization

### Level 1: Field Selection Interface

**Purpose**: Simple field selection with type safety

```typescript
interface Level1FormatOptions {
  fields?: string[];        // Simple field names
  format?: "xml" | "xml-verbose" | "tsv";
  separator?: string;       // For custom field lists (default: tab)
}

// Level 1 Service Implementation
class Level1Service {
  buildFormat(options: Level1FormatOptions): string | undefined {
    if (options.fields) {
      // Convert to MoneyWorks bracket notation with separator
      const sep = options.separator || "\t";
      return options.fields.map(f => `[${f}]`).join(sep);
    }
    
    if (options.format === "tsv") return undefined;  // No format param
    if (options.format === "xml") return "xml";      // Terse XML
    return "xml-verbose";  // Default
  }
}
```

**Benefits**:
- Type-safe field selection
- Automatic format optimization
- Backward compatible

### Level 2: Advanced Format Interface

**Purpose**: Server-side functions and optimizations

```typescript
interface Level2Expression {
  type: "field" | "lookup" | "function" | "calculation";
  value: string;
}

interface Level2FormatOptions {
  expressions?: Level2Expression[];
  optimize?: boolean;  // Auto-optimize based on query
}

// Examples of Level 2 usage:
{
  expressions: [
    { type: "field", value: "Code" },
    { type: "lookup", value: 'Lookup(NameCode,"Name.Name")' },
    { type: "calculation", value: "Gross*1.1" },
    { type: "function", value: 'if(Status="O","Open","Closed")' }
  ]
}
```

**Server-Side Function Library**:
```typescript
class MoneyWorksFunctions {
  // Lookups - resolve foreign keys server-side
  static lookup(field: string, target: string) {
    return `Lookup(${field},"${target}")`;
  }
  
  // String functions
  static left(field: string, length: number) {
    return `Left(${field},${length})`;
  }
  
  // Date formatting
  static formatDate(field: string, format: string) {
    return `DateToText(${field},"${format}")`;
  }
  
  // Calculations
  static calculate(expression: string) {
    return expression;  // Direct pass-through
  }
  
  // Conditional logic
  static conditional(test: string, ifTrue: string, ifFalse: string) {
    return `if(${test},"${ifTrue}","${ifFalse}")`;
  }
}
```

## Implementation Strategy

### Phase 1: Level 0 Enhancement
1. Add raw format parameter to Level 0 interface
2. Document all format options
3. Create format examples library

### Phase 2: Level 1 Optimization
1. Implement intelligent format selection:
   - Use TSV for full data exports
   - Use XML only when needed
   - Use custom format for field subsets
2. Add format optimization based on query:
   ```typescript
   // If selecting few fields from large table
   if (fields.length < 5 && estimatedRows > 1000) {
     useCustomFormat = true;
   }
   ```

### Phase 3: Level 2 Advanced Features
1. Build server-side function library
2. Implement expression builder
3. Add relationship navigation support
4. Create optimization analyzer

## Use Case Examples

### 1. Dashboard Summary (Level 2)
```typescript
// Get account summary with calculated values
const format = "Account: [Code] - [Description], Balance: [GetBalance(Code)], This Month: [GetMovement(Code,CurrentPeriod()-1,CurrentPeriod())]";

// Returns formatted text with labels and calculations
```

### 2. Foreign Key Resolution (Level 2)
```typescript
// Get transactions with customer names (not just codes)
const format = [
  "[OurRef]",
  "[TransDate]",
  '[Lookup(NameCode,"Name.Name")]',  // Customer name
  "[Gross]"
].join("\t");

// Avoids N+1 queries for name lookups
```

### 3. Large Export Optimization (Level 1)
```typescript
// Export 10,000 transactions efficiently
if (params.limit > 1000 && !params.fields) {
  // Omit format parameter to get native TSV
  delete params.format;
}
```

### 4. Conditional Formatting (Level 2)
```typescript
// Status with human-readable values
const format = '[Code]\t[if(Status="O","Open",if(Status="C","Closed","Other"))]\t[Gross]';
```

### 5. Report-Style Output (Level 2)
```typescript
// Generate formatted text output
const format = 'Invoice #[OurRef] dated [DateToText(TransDate,"dd/mm/yyyy")] for [Lookup(NameCode,"Name.Name")] - Amount: $[Gross]';

// Returns: "Invoice #INV001 dated 15/01/2024 for Acme Corp - Amount: $1500.00"
```

### 6. CSV-Style Export (Level 2)
```typescript
// Custom CSV with comma separation
const format = '[Code],[Description],[Type],[GetBalance(Code)]';

// Note: Returns text, not true CSV - would need escaping for commas in data
```

## Performance Considerations

### Current Inefficiencies
1. **XML-verbose default**: Sends all fields even if empty
2. **Client-side filtering**: Fetches all data then filters
3. **Multiple queries**: Separate calls for related data
4. **Large payloads**: No field selection optimization
5. **Missing TSV headers**: Must maintain field order alignment

### Optimization Opportunities
1. **TSV for bulk operations**: 50-70% smaller than XML
2. **Field selection**: Reduce payload by 80%+ for dashboards
3. **Server-side calculations**: Eliminate post-processing
4. **Relationship resolution**: Avoid N+1 queries
5. **Custom formatting**: Direct text output for reports

### Benchmarks (Estimated)
```
Operation                Current        Optimized     Improvement
-----------------------------------------------------------------
1000 transactions       2.5 MB XML     0.8 MB TSV    68% smaller
Dashboard (5 fields)    2.5 MB XML     0.3 MB Custom  88% smaller
With calculations       Multiple calls  Single call   90% faster
Foreign key lookups     N+1 queries    1 query       99% faster
```

## Migration Strategy

### Level 0 (Immediate)
- Add format parameter to unified schema
- Document in query language reference
- No breaking changes

### Level 1 (Short-term)
- Add intelligent defaults
- Optimize existing field selection
- Maintain backward compatibility

### Level 2 (Long-term)
- New expression-based API
- Advanced optimization engine
- Performance monitoring

## Best Practices

### 1. Format Selection Guidelines
- **Use XML-verbose**: Only when you need all fields including empty ones
- **Use XML** (terse): When you need most fields but want smaller payload (omits empty)
- **Use TSV** (no format): For bulk exports or when processing all fields
- **Use Custom format**: For specific field subsets, calculations, or formatted output

### 2. Optimization Rules
- Always use custom format for < 10 fields from large tables
- Use server-side lookups instead of client-side joins
- Leverage calculations for derived values
- Prefer TSV (no format param) for exports > 1000 records
- Remember TSV has no headers - rely on TypeScript field order

### 3. Security Considerations
- Validate expressions to prevent injection
- Limit complex calculations
- Monitor performance impact
- Cache commonly used formats

### 4. Type Safety Requirements
- Maintain 100% alignment between TypeScript definitions and MoneyWorks
- Regularly validate field order using `GetDatabaseFields()`
- Test TSV parsing against TypeScript field arrays
- Document any field order dependencies

## Conclusion

MoneyWorks' format parameter is a powerful optimization tool that's currently underutilized. By implementing this three-level strategy:

1. **Level 0** provides raw power for advanced users
2. **Level 1** offers simple optimizations for common cases
3. **Level 2** enables sophisticated server-side processing

This approach can reduce payload sizes by 50-90% and eliminate many performance bottlenecks while maintaining backward compatibility.

---

**Status**: Design Complete
**Next Steps**: Implement Level 0 format parameter support
**Priority**: High - significant performance impact