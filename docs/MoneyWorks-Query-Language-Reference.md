# MoneyWorks Query Language Reference

## Overview

This document provides the authoritative reference for the MoneyWorks query language, compiled from verified sources including the claude_cognito project documentation and actual MoneyWorks script examples. This reference serves as the foundation for implementing the Level 0 interface with full query language support.

## Data Type Delimiters

### Strict Rules for Delimiters

1. **Dates**: ONLY single quotes allowed
   - Format: `'1/1/2024'` or `'2024-01-01'`
   - Example: `TransDate >= '1/1/2024'`

2. **Text Strings**: Double quotes OR backticks (NEVER single quotes)
   - Double quotes: `"text value"`
   - Backticks: `` `text value` ``
   - Example: `Type="SI"` or `Type=`SI``

3. **Numbers**: No delimiters
   - Integer: `1000`
   - Decimal: `1000.50`
   - Example: `Amount > 1000`

## Operators

### Comparison Operators
- `=` or `==` - Equality
- `!=` or `<>` - Inequality  
- `<` - Less than
- `>` - Greater than
- `<=` - Less than or equal
- `>=` - Greater than or equal

### Boolean Operators
All forms are valid in MoneyWorks:
- **AND**: `and` OR `&` OR `&&`
- **OR**: `or` OR `|` OR `||`
- **NOT**: `not` OR `!`

### Text Matching with Wildcards
- **Exact match**: `Description="Exact Text"`
- **Partial match**: Use `@` as wildcard character
  - `Description="@Cash@"` - Contains "Cash"
  - `Description="Cash@"` - Starts with "Cash"
  - `Description="@Cash"` - Ends with "Cash"

## Basic Query Examples

### Field Matching
```
// Text field matching (use double quotes or backticks)
Type="SI"
Type=`SI`
Code="5100"
Status=`O`

// Numeric comparisons (no delimiters)
Amount > 1000
Gross <= 5000.50
SequenceNumber = 12345

// Date filtering (single quotes ONLY)
TransDate >= '1/1/2024'
TransDate < '31/12/2024'
LastModifiedTime > '2024-01-01'
```

### Boolean Combinations
```
// Using written-out operators
Type="SI" and Status="O"
Code="51" or Code="52"
not Hold

// Using symbolic operators
Type=`SI` & Status=`O`
Code=`51` | Code=`52`
!Hold

// Complex expressions with parentheses
(Type="SI" or Type="SC") and Status="O"
Type=`A` and System=`BK` and not Code=`99`
```

### Text Partial Matching
```
// Using @ wildcard for partial matching
Description="@Cash@"      // Contains "Cash"
Comments=`@Credit Card@`  // Contains "Credit Card"
Name="@Smith"            // Ends with "Smith"
Code="51@"               // Starts with "51"
```

## Advanced Query Features

### Relational Search Expressions

MoneyWorks uses bracket notation to navigate between related tables:

**Format**: `[TableName:SearchExpression][RelatedTable:SearchExpression]`

**Examples**:
```
// Find detail lines for a specific transaction
[transaction:sequencenumber=12345][detail]

// Find all transactions for customers in NSW state
[name:state="NSW"][transaction]

// Find all products sold in posted sales invoices
[transaction:status="P" and type="SI"][detail][product]

// Alternative: Direct foreign key reference
parentseq=12345  // For detail lines of a transaction
```

### String Functions
```
// String function usage (requires verification)
left(Code,2)="51"        // First 2 characters of Code
right(Description,4)=`Cash`  // Last 4 characters
```

### Complex Date Ranges
```
// Date range with AND
TransDate >= '1/1/2024' and TransDate <= '31/12/2024'

// Date comparisons
Date > '2024-01-01' and Date < '2024-12-31'
```

## Special Query Patterns

### Meta-Search Mnemonics
These special patterns work with CreateSelection in scripts and should be supported in Level 0:
- `"**"` - Current window selection
- `"*highlight"` - Highlighted records
- `"*found"` - Found records from last search

### Account Type Queries
For account searches, the System field uses single-letter codes that expand to two letters in queries:
```
// Bank accounts
System="BK"  // or System=`BK`

// Accounts Receivable
System="AR"  // or System=`AR`

// Accounts Payable  
System="AP"  // or System=`AP`
```

## Query Language Best Practices

### 1. Delimiter Consistency
- Always use single quotes for dates
- Choose either double quotes or backticks for text (be consistent)
- Never quote numeric values

### 2. Boolean Expression Structure
- Use parentheses to clarify complex boolean logic
- Place most selective conditions first for performance
- Consider using symbolic operators for brevity

### 3. Performance Considerations
- Use indexed fields in search expressions when possible
- Limit result sets with specific criteria
- Avoid wildcard searches at the beginning of strings when possible

### 4. Error Prevention
- Verify field names match exact MoneyWorks field names
- Test date formats match MoneyWorks expectations
- Ensure text comparisons use proper delimiters

## Implementation Notes for Level 0

### Query Pass-Through Requirements

1. **No Parsing**: Queries must pass through directly to MoneyWorks
2. **No Validation**: Let MoneyWorks validate query syntax
3. **No Translation**: Preserve exact query string as provided
4. **URL Encoding**: Only encode for HTTP transport

### Example API Call
```typescript
// Level 0 query pass-through
const params = {
  search: 'Type="SI" and Status="O" and TransDate >= \'2024-01-01\'',
  limit: 100,
  start: 0,
  sort: 'TransDate',
  direction: 'descending'
};

// URL construction (direct encoding)
const url = `/export?table=transaction&search=${encodeURIComponent(params.search)}&limit=${params.limit}`;
```

### MCP Tool Query Examples
```typescript
// Account search - finding bank accounts
{
  operation: "export",
  search: 'System="BK"',  // NOT 'System="K"' - use two-letter code
  limit: 50
}

// Transaction search - complex criteria
{
  operation: "export", 
  search: 'Type="SI" and Status="O" and Gross > 1000 and TransDate >= \'2024-01-01\'',
  limit: 100,
  sort: "TransDate",
  direction: "descending"
}

// Name search - using wildcards
{
  operation: "export",
  search: 'Name="@Smith@" and Category1="Retail"',
  limit: 25
}
```

## Verified Query Syntax

The following syntax has been verified from the claude_cognito project:

### From Script Examples
```
// Selection with current window
CreateSelection("transaction", "**")

// Basic type filtering
CreateSelection("transaction", "type='SI'")

// Complex filtering with date and amount
CreateSelection("transaction", "transdate>'1/1/2024' and gross>1000")

// Relational search for detail lines
CreateSelection("detail", "[transaction:sequencenumber=12345][detail]")

// Alternative parentseq reference
CreateSelection("detail", "parentseq=" + t.sequencenumber)
```

### Key Observations
1. Scripts use single quotes for text in CreateSelection calls
2. The @ wildcard is documented but needs testing for exact behavior
3. Relational searches use bracket notation consistently
4. Both symbolic and written operators are valid

## Future Verification Needs

The following aspects require verification against a live MoneyWorks instance:

1. **@ Wildcard Behavior**: Exact matching rules for partial text searches
2. **String Functions**: Availability and syntax of left(), right(), substring()
3. **Date Format Flexibility**: Which date formats are accepted
4. **Case Sensitivity**: Whether text comparisons are case-sensitive
5. **Escape Characters**: How to handle special characters in search strings

---

**Document Status**: Production Ready
**Last Updated**: January 2025
**Next Review**: After Level 0 implementation testing