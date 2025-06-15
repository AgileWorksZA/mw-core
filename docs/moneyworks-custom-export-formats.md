# MoneyWorks Custom Export Formats Guide

## Overview

MoneyWorks REST API supports powerful custom export formats that allow you to:
- Extract specific fields
- Apply MWScript expressions and calculations
- Format output with literal text
- Access related data through lookup functions
- Apply conditional logic

## Export Format Types

### 1. Built-in Formats

```typescript
// Standard formats
format: "json"         // JSON (converted from XML internally)
format: "xml-terse"    // Compact XML (omits empty fields)
format: "xml-verbose"  // Full XML (includes all fields)
format: "tsv"          // Tab-separated values
format: undefined      // Default TSV format
```

### 2. Custom Template Format

```typescript
// Custom template with expressions
format: { template: "[Field1]\t[Field2]\t[Expression]" }
```

### 3. Script Format

```typescript
// Reference to a MoneyWorks script
format: { script: "ExportScriptName" }
```

## Template Syntax

### Basic Field References

Fields are referenced using square brackets:
```
[OurRef]              // Simple field reference
[TransDate]           // Date field
[Gross]               // Numeric field
[Description]         // Text field
```

### Literal Text

Anything outside square brackets is output literally:
```
Invoice: [OurRef] - Total: $[Gross]
```

### Special Characters

Use escape sequences for special characters:
- `\t` - Tab
- `\r` - Carriage return
- `\n` - Line feed
- `\xHH` - Hex character
- `\\` - Backslash

### MWScript Expressions

#### Arithmetic Operations
```
[Gross * 0.15]                    // Calculate GST
[Gross - (Gross * 0.15)]          // Calculate net amount
[Quantity * UnitPrice]            // Calculate total
[Balance + Amount]                // Add values
```

#### String Functions
```
[Upper([Description])]            // Convert to uppercase
[Lower([Code])]                   // Convert to lowercase
[Left([Description], 20)]         // First 20 characters
[Right([Code], 4)]                // Last 4 characters
[Concat([FirstName], " ", [LastName])]  // Concatenate
```

#### Date Functions
```
[DateAdd([TransDate], 30)]        // Add 30 days
[DateDiff([DueDate], [TransDate])]  // Days between dates
[Day([TransDate])]                // Extract day
[Month([TransDate])]              // Extract month
[Year([TransDate])]               // Extract year
```

#### Lookup Functions
```
[GetNameField([NameCode], "Name")]        // Get customer name
[GetAccountField([Account], "Description")]  // Get account description
[GetProductField([ProductCode], "SellPrice")]  // Get product price
[Lookup([NameCode], "Name.Balance")]      // Alternative lookup syntax
```

#### Conditional Logic
```
[If([Status] = 1, "Posted", "Unposted")]  // Simple if-then-else
[If([Gross] > 0, "Income", "Expense")]    // Numeric comparison
[If([Type] = "DI", "Invoice", If([Type] = "DC", "Credit", "Other"))]  // Nested if
```

#### Aggregation Functions (in context)
```
[Sum([Detail.Gross])]             // Sum detail lines
[Count([Detail])]                 // Count detail lines
[Average([Detail.Gross])]         // Average of details
```

## Complex Template Examples

### Invoice Format
```typescript
const invoiceTemplate = `Invoice: [OurRef]
Date: [TransDate]
Customer: [GetNameField([NameCode], "Name")]
Due Date: [DateAdd([TransDate], [GetNameField([NameCode], "Terms")])]

Items:
{[Detail.Description]: $[Detail.Net] + $[Detail.Tax] = $[Detail.Gross]}

Subtotal: $[Net]
GST: $[Tax]
Total: $[Gross]
`;

client.export("Transaction", {
  format: { template: invoiceTemplate },
  filter: "Type = 'DI'"
});
```

### Statement Format
```typescript
const statementTemplate = `Statement for: [GetNameField([NameCode], "Name")]
As of: [TransDate]

Transaction: [Description]
Amount: $[Gross]
Running Balance: $[GetNameField([NameCode], "Balance")]

Status: [If([Status] = 1, "✓ Posted", "⚠ Pending")]
`;
```

### Custom Report Format
```typescript
const reportTemplate = `[Code]\t[Name]\t[If([Type] = 1, "Customer", If([Type] = 2, "Supplier", "Other"))]\t$[Balance]\t[If([Balance] > 0, "DR", "CR")]`;
```

## URL Encoding

When using the REST API directly, custom formats must be URL-encoded:

```javascript
// Original template
const template = "[OurRef]\t[Gross * 0.15]";

// URL-encoded for REST API
const encoded = encodeURIComponent(template);
// Result: %5BOurRef%5D%5Ct%5BGross%20*%200.15%5D
```

## Implementation in TypeScript

The MoneyWorks TypeScript client handles encoding automatically:

```typescript
// Using the client
const result = await client.export("Transaction", {
  format: { 
    template: "[OurRef] - [Description] | GST: $[Gross * 0.15]" 
  },
  limit: 10
});

// Behind the scenes, the client:
// 1. Sets format parameter to "custom"
// 2. Adds template parameter with URL-encoded template string
// 3. Constructs the URL: /export/format=custom&template=%5B...%5D
```

## Limitations and Considerations

1. **Expression Complexity**: Very complex expressions may have performance impacts
2. **Field Availability**: Not all fields may be available in all contexts
3. **Subfile Access**: Detail line access syntax `{...}` may have limitations
4. **Script Format**: Requires pre-defined scripts in MoneyWorks
5. **Return Type**: Custom formats return raw strings, not parsed data

## Error Handling

Common errors with custom formats:
- Invalid field names: Check field exists in table
- Syntax errors: Ensure brackets are balanced
- Function errors: Verify function names and parameters
- Type mismatches: Ensure operations are valid for field types

## Best Practices

1. **Test Templates**: Start simple and build complexity
2. **Use Constants**: Define templates as constants for reuse
3. **Handle Types**: Be aware that custom formats return strings
4. **Performance**: Use field selection for large datasets
5. **Documentation**: Document complex expressions

## Examples Repository

See `/test-custom-export-formats.ts` for working examples of:
- Simple field templates
- Expression templates
- Function templates
- Conditional templates
- Complex multi-line templates
- Subfile templates