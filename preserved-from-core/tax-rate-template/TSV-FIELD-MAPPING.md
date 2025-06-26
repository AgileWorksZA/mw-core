# Tax Rate TSV Field Mapping Template

This is our vetted template for handling MoneyWorks TSV exports. Use this pattern for other tables as they are canonically vetted.

## TSV Field Order for TaxRate

Based on actual MoneyWorks export analysis:

```javascript
const TAXRATE_TSV_FIELDS = [
  'Sequence',           // 0: Internal sequence number
  'Type',               // 1: Type code (142, 141, etc)
  'LastModifiedTime',   // 2: Timestamp
  'TaxCode',            // 3: Tax code (Z, V, etc) - PRIMARY KEY
  'PaidAccount',        // 4: Account code for paid
  'RecAccount',         // 5: Account code for received
  'Rate1',              // 6: First tax rate
  'Date',               // 7: Changeover date (often empty)
  'Rate2',              // 8: Second tax rate
  'Combine',            // 9: Combine method
  'CombineRate1',       // 10: Combined rate 1
  'CombineRate2',       // 11: Combined rate 2
  'GSTPaid',            // 12: GST paid amount
  'GSTReceived',        // 13: GST received amount
  'NetPaid',            // 14: Net paid amount
  'NetReceived',        // 15: Net received amount
  'Description',        // 16: Tax description
  'UserNum',            // 17: User number field
  'Colour',             // 18: Color code
  'UserText',           // 19: User text field
  'GSTPaidBasis',       // 20: GST paid basis
  'GSTReceivedBasis',   // 21: GST received basis
  'Custom1',            // 22: Custom field 1
  'TaggedText',         // 23: Tagged text
  'Rate1Fraction',      // 24: Rate 1 fraction
  'Custom2',            // 25: Custom field 2
  'Custom3',            // 26: Custom field 3
  'Custom4',            // 27: Custom field 4
  'Custom5',            // 28: Custom field 5
  'Rate2Fraction',      // 29: Rate 2 fraction
  'CombineRate1Fraction', // 30: Combine rate 1 fraction
  'CombineRate2Fraction'  // 31: Combine rate 2 fraction
];
```

## Pattern for Future Tables

When adding new canonically vetted tables:

1. **Export a sample** from MoneyWorks to determine field order
2. **Create field mapping** array like above
3. **Update the TSV parser** to handle the new table:

```javascript
// In TSV parser
if (tableName === 'TaxRate') {
  headers = TAXRATE_TSV_FIELDS;
} else if (tableName === 'Account') {
  headers = ACCOUNT_TSV_FIELDS; // Define when Account is vetted
} else {
  // Fallback or error
}
```

4. **Map to canonical types** in the repository parser

## Key Observations

- Field 0 is often an internal sequence/ID
- Primary key position varies (TaxCode is field 3)
- Empty fields are common (e.g., Date field)
- Numeric fields include precision (0.000000)
- Read-only fields still appear in exports