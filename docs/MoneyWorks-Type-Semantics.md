# MoneyWorks Type and Status Field Semantics

## Overview

This document captures the semantic meanings of type, status, and classification fields across MoneyWorks entities. This knowledge is critical for building domain-driven interfaces that expose accounting concepts rather than raw codes.

**IMPORTANT**: This document contains fields that need verification from MoneyWorks documentation or testing. Values marked with "NEEDS VERIFICATION" must be confirmed before implementation.

## 1. Name Table - Customer/Supplier Classification

### Primary Field: `Kind` (number)
```typescript
Kind: number;
```

**Semantics** (NEEDS VERIFICATION):
- The Kind field distinguishes between customers, suppliers, and entities that can be both
- Specific numeric values need to be confirmed from MoneyWorks documentation
- The MCP tool description suggests: "0=Customer, 1=Supplier, 2=Both" but this needs verification

### Supporting Fields
- `CustomerType`: Sub-classification of customers
- `SupplierType`: Sub-classification of suppliers
- `Hold`: Credit hold status (boolean)
- `CreditLimit`: Customer credit limit
- `DebtorTerms`: Payment terms for customers (days)
- `CreditorTerms`: Payment terms for suppliers (days)
- `DBalance`: Current balance (positive = they owe us, negative = we owe them)

### Business Rules (NEEDS VERIFICATION)
- Relationship between Kind values and customer/supplier-related fields
- Which fields are relevant for each Kind value
- How Kind=2 (if that's the correct value for "both") affects field usage

## 2. Account Table - GL Account Classification

### Primary Field: `Type` (string)
```typescript
Type: string;
```

**Semantics** (NEEDS VERIFICATION):
- Account type field for GL account classification
- Expected to contain codes representing different account categories
- Common accounting categories include Income, Expense, Assets, Liabilities, Equity
- Specific codes and their meanings need to be confirmed from MoneyWorks documentation
- Examples seen in code comments suggest single-letter codes but need verification

### System Field: `System` (string)
```typescript
System: string;
```

**Semantics** (NEEDS VERIFICATION):
- System field identifies special accounts with specific behaviors
- Examples from actual usage show "BK" for bank accounts in queries
- Need to verify:
  - Complete list of system codes
  - Whether internal storage uses single letters vs query format (e.g., "K" vs "BK")
  - Special behaviors and restrictions for each system account type

### Business Rules (NEEDS VERIFICATION)
- Which account types belong to Balance Sheet vs P&L
- Special behaviors and restrictions for system accounts
- How bank accounts are used for reconciliation
- Relationship between Type and System fields

## 3. Transaction Table - Document Types

### Primary Field: `Type` (string, size 4)
**Transaction Types** (NEEDS VERIFICATION):
- Field size suggests up to 4-character codes
- Common transaction types expected to include:
  - Sales transactions (invoices, credits, receipts)
  - Purchase transactions (invoices, credits, payments)
  - Journal entries
  - Bank transactions
  - Orders
- Specific codes and complete list need verification from MoneyWorks documentation

### Status Field: `Status` (string, size 2)
**Transaction Status Codes** (NEEDS VERIFICATION):
- Field size suggests 2-character codes
- Expected statuses include:
  - Open/outstanding transactions
  - Closed/completed transactions
  - Posted vs unposted states
  - Draft states
  - Cancelled states
- Specific codes and their meanings need verification

### Supporting Fields
- `Hold`: Transaction on hold (boolean)
- `Flags`: Bitmask for various attributes
- `Period`: Accounting period number
- `NameCode`: Links to Name table (customer/supplier)

### Business Rules (NEEDS VERIFICATION)
- Edit restrictions for posted transactions
- Relationship between Open/Closed status and payment state
- How draft transactions affect the GL
- Field requirements for different transaction types
- Valid status transitions and workflows

## 4. Product Table - Product Types

### Primary Field: `Type` (string)
**Product Type Codes** (NEEDS VERIFICATION):
- Product categorization field
- Expected to distinguish between:
  - Inventory/stocked items
  - Service items
  - Kits or assembled products
  - Labor/time-based items
  - Other product categories
- Specific codes and their meanings need verification

### Business Rules (NEEDS VERIFICATION)
- Which product types track inventory levels
- How service items differ from physical products
- Kit assembly and component relationships
- GL posting rules for different product types

## 5. Additional Semantic Fields

### Color Field (multiple tables)
- `Colour`: number (0-7)
- User-defined color coding system
- Labels defined in system preferences

### Security Levels (multiple tables)
- `SecurityLevel`: number (0-5)
- Star-based security system
- Controls user access to records

### Payment Methods
- `PaymentMethod`: number
- References system-defined payment types
- Used in Name and Transaction tables

## Implementation Recommendations

### 1. TypeScript Discriminated Unions (PENDING VERIFICATION)

```typescript
// NOTE: These type definitions are examples pending verification of actual values

// Name entity types (Kind values need verification)
type Customer = Name & { Kind: number }; // Verify actual value
type Supplier = Name & { Kind: number }; // Verify actual value
type CustomerSupplier = Name & { Kind: number }; // Verify actual value

// Account categories (Type codes need verification)
type IncomeAccount = Account & { Type: string }; // Verify actual codes
type ExpenseAccount = Account & { Type: string }; // Verify actual codes
type AssetAccount = Account & { Type: string }; // Verify actual codes
type LiabilityAccount = Account & { Type: string }; // Verify actual codes
type EquityAccount = Account & { Type: string }; // Verify actual codes

// Special accounts (System codes need verification)
type BankAccount = Account & { System: string }; // Verify actual code
type ARAccount = Account & { System: string }; // Verify actual code
type APAccount = Account & { System: string }; // Verify actual code
```

### 2. Domain Query Helpers (PENDING VERIFICATION)

```typescript
// NOTE: These query examples need verification of actual field values

// Customer queries (Kind values need verification)
const customerQuery = 'Kind=?'; // Verify customer value
const activeCustomerQuery = 'Kind=? and Hold=0'; // Verify values
const creditHoldCustomerQuery = 'Kind=? and Hold=1'; // Verify values

// Account queries (codes need verification)
const bankAccountQuery = 'System="BK"'; // Seen in actual usage, but verify
const revenueAccountQuery = 'Type=? or Type=?'; // Verify income type codes
const balanceSheetQuery = 'Type=? or Type=? or ...'; // Verify asset/liability codes

// Transaction queries (codes need verification)  
const openInvoicesQuery = 'Type=? and Status=?'; // Verify invoice and open codes
const postedTransactionsQuery = 'Status=?'; // Verify posted status code
const salesDocumentsQuery = 'Type=? or Type=? or Type=?'; // Verify sales type codes
```

### 3. Semantic Method Names (PENDING VERIFICATION)

```typescript
// NOTE: These methods need underlying query values verified

class DomainNameService {
  getCustomers() { /* Verify Kind value for customers */ }
  getSuppliers() { /* Verify Kind value for suppliers */ }
  getActiveCustomers() { /* Verify Kind and Hold values */ }
}

class DomainAccountService {
  getBankAccounts() { /* Verify System code for banks */ }
  getRevenueAccounts() { /* Verify Type codes for income */ }
  getExpenseAccounts() { /* Verify Type codes for expenses */ }
}

class DomainTransactionService {
  getSalesInvoices() { /* Verify Type code for sales invoices */ }
  getOpenInvoices() { /* Verify Type and Status codes */ }
  getPostedTransactions() { /* Verify Status code for posted */ }
}
```

## Next Steps

1. **Verify All Type Fields**: Get actual values from MoneyWorks documentation or testing
   - Name.Kind values (customer/supplier/both)
   - Account.Type codes (income/expense/asset/liability classifications)
   - Account.System codes (special accounts like bank, AR, AP)
   - Transaction.Type codes (complete list of document types)
   - Transaction.Status codes (workflow states)
   - Product.Type codes (inventory/service/kit classifications)

2. **Test Query Formats**: Verify query syntax for each field
   - Whether System field uses single-letter storage vs two-letter queries
   - Date format requirements
   - String delimiter rules

3. **Document Workflows**: Map valid status transitions and business rules

4. **Build Type Guards**: Create runtime type checking functions once values are verified

5. **Design Query Builders**: Semantic query construction based on verified values

## Notes

- **DO NOT ASSUME**: All field values in this document need verification
- The Kind field in Names appears to be numeric based on TypeScript interface
- System="BK" was observed in actual usage for bank accounts
- Some fields like Color and SecurityLevel are user-configurable

---

**Status**: Placeholder documentation - ALL VALUES NEED VERIFICATION
**Todo**: Verify all type/status field values against MoneyWorks documentation
**Priority**: Critical for Level 1/2 design - cannot proceed without verified values