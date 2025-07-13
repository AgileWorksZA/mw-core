# MoneyWorks Names Entity - AI Guidelines

## Critical MoneyWorks Concepts

### Customer vs Debtor Hierarchy
In MoneyWorks, these are DIFFERENT:
- **Customer** (Type 1): Can make purchases, appears in sales transactions
- **Debtor** (Type 2): Has full AR functionality - receivables, credit limits, aging, statements
- A Debtor IS a Customer, but a Customer is NOT necessarily a Debtor

### Supplier vs Creditor Hierarchy  
In MoneyWorks, these are DIFFERENT:
- **Supplier** (Type 1): Can provide goods/services, appears in purchase transactions
- **Creditor** (Type 2): Has full AP functionality - payables, payment terms, aging
- A Creditor IS a Supplier, but a Supplier is NOT necessarily a Creditor

## Field Name Preservation
NEVER translate or rename these MoneyWorks fields:
- `RecAccount` - NOT "ReceivablesAccount" or "ARAccount"
- `PayAccount` - NOT "PayablesAccount" or "APAccount"  
- `DCurrent`, `D30Plus`, `D60Plus`, `D90Plus` - Debtor aging buckets
- `CCurrent` - Creditor current balance
- `email` - lowercase 'e' is correct
- `Account Name` - With space, for bank account name

## Business Rules

### Control Accounts
- **Debtors** (CustomerType=2) MUST have a `RecAccount`
- **Creditors** (SupplierType=2) MUST have a `PayAccount`
- Regular Customers/Suppliers don't need control accounts

### Payment Terms
- Positive number: Within N days (e.g., 30 = within 30 days)
- Negative number: Nth day of following month (e.g., -15 = 15th of next month)
- Zero: No specific terms

### Flags Field
Bit-mapped field:
- 0x0001: Requires Order Number
- Other bits reserved for future use

### Contact Architecture
Names have TWO contact systems:
1. Built-in Contact1 and Contact2 (fields in Names table)
2. Unlimited Contacts via subfile (separate Contacts table linked by ParentSeq)

## Common Mistakes to Avoid

1. **Don't confuse Customer with Debtor** - They have different capabilities
2. **Don't confuse Supplier with Creditor** - They have different capabilities
3. **Don't rename MW fields** - Keep exact MoneyWorks terminology
4. **Don't ignore control accounts** - Required for Debtors/Creditors
5. **Don't assume all Names need balances** - Only Debtors have DCurrent etc.

## Query Patterns

```typescript
// Find all debtors
filter: "CustomerType=2"

// Find all creditors  
filter: "SupplierType=2"

// Find customers (including debtors)
filter: "CustomerType=1 OR CustomerType=2"

// Find suppliers (including creditors)
filter: "SupplierType=1 OR SupplierType=2"

// Find names on hold
filter: "Hold=true"

// Find by category
filter: "Category1='Retail'"
```

## Integration Points

- **Transactions**: Names appear in transactions via NameCode
- **Contacts**: Subfile relationship via ParentSeq → Name.SequenceNumber
- **Accounts**: RecAccount and PayAccount link to Account table
- **TaxRates**: TaxCode links to TaxRate table
- **Products**: ProductPricing determines which price level applies

## Implementation Checklist

When implementing Names functionality:
- [ ] Preserve exact MW field names
- [ ] Implement Customer/Debtor distinction correctly
- [ ] Implement Supplier/Creditor distinction correctly  
- [ ] Validate control accounts for Debtors/Creditors
- [ ] Handle payment terms (positive/negative/zero)
- [ ] Support both built-in contacts and Contacts subfile
- [ ] Implement proper aging bucket calculations
- [ ] Support all 8 custom fields and 4 categories