# Using Expressions in MoneyWorks Exports

## 1. Filter Expressions in Export

You can use MoneyWorks expressions in the filter/search parameter:

```bash
# Basic comparison
./mw -c ./mw-config.json export Transaction --filter "Gross > 1000"

# Multiple conditions
./mw -c ./mw-config.json export Transaction --filter "Gross > 1000 AND Type = 'DI'"

# Date expressions (MoneyWorks date format)
./mw -c ./mw-config.json export Transaction --filter "TransDate >= {d'2024-01-01'}"

# String matching
./mw -c ./mw-config.json export Transaction --filter "Description ~ 'Invoice'"

# Complex expressions
./mw -c ./mw-config.json export Transaction --filter "(Gross > 1000 OR Gross < -1000) AND Status = 1"
```

## 2. Calculated Fields in Export

While the REST API doesn't directly support calculated fields in the export format, you can:

### a) Use MoneyWorks' built-in calculated fields
Some tables have pre-defined calculated fields that are automatically included.

### b) Post-process the data
Export as JSON and calculate additional fields in your application:

```typescript
const transactions = await client.export("Transaction", {
  format: "json",
  filter: "Gross > 1000"
});

// Add calculated fields
const enriched = transactions.map(t => ({
  ...t,
  gst: t.gross * 0.15,
  net: t.gross - (t.gross * 0.15),
  margin: t.gross - t.cost
}));
```

### c) Use the MoneyWorks native client
The MoneyWorks native client supports more advanced export formats with expressions, but these aren't fully exposed through the REST API.

## 3. Using Expressions for Filtering

Common expression patterns:

- **Numeric**: `Gross > 1000`, `Balance != 0`
- **String**: `Code = 'ABC'`, `Description ~ 'pattern'`
- **Date**: `TransDate >= {d'2024-01-01'}`
- **Boolean**: `Status = 1` (posted), `Status = 0` (unposted)
- **NULL checks**: `Contra != ''`
- **IN operator**: `Type IN ('DI', 'DC')`

## 4. Limitations

The REST API's export endpoint has some limitations:
- Custom templates with expressions aren't fully supported
- The evaluate endpoint only works with simple math, not database queries
- Complex calculated fields need to be done in post-processing

## Workarounds

1. **For counts**: Use `limit=0` and parse the XML header
2. **For aggregates**: Export the data and calculate in your app
3. **For complex queries**: Use multiple exports with different filters