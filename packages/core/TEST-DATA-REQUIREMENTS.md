# MoneyWorks Test Data Requirements

## Overview

This document specifies the test data needed in MoneyWorks to support comprehensive testing of the @moneyworks/core package. Please review and create any missing data in your MoneyWorks demo file.

## Required Test Data

### 1. Accounts (Chart of Accounts)

#### Bank Accounts (Type: BA)
- [ ] **BANK-CHQ**: Main checking account
- [ ] **BANK-SAV**: Savings account  
- [ ] **BANK-USD**: Foreign currency account (USD)
- [ ] **BANK-CC**: Credit card account

#### Current Assets (Type: CA)
- [ ] **ACCT-REC**: Accounts Receivable (control account)
- [ ] **INVENTORY**: Inventory asset account
- [ ] **PREPAID**: Prepaid expenses
- [ ] **DEPOSITS**: Security deposits
- [ ] **PETTY**: Petty cash

#### Fixed Assets (Type: FA)
- [ ] **FA-EQUIP**: Equipment
- [ ] **FA-VEHICLE**: Vehicles
- [ ] **FA-BUILDING**: Buildings

#### Current Liabilities (Type: CL)
- [ ] **ACCT-PAY**: Accounts Payable (control account)
- [ ] **CC-PAYABLE**: Credit card payable
- [ ] **TAX-COLLECTED**: Tax collected
- [ ] **WAGES-PAY**: Wages payable

#### Income Accounts (Type: IN)
- [ ] **SALES-PROD**: Product sales
- [ ] **SALES-SVC**: Service income
- [ ] **SALES-EXPORT**: Export sales
- [ ] **SALES-DISC**: Sales discounts (negative income)
- [ ] **FREIGHT-IN**: Freight income

#### Expense Accounts (Type: EX)
- [ ] **EXP-WAGES**: Wages expense
- [ ] **EXP-RENT**: Rent expense
- [ ] **EXP-UTILS**: Utilities
- [ ] **EXP-FREIGHT**: Freight expense
- [ ] **EXP-OFFICE**: Office supplies

#### Special Test Cases
- [ ] **PARENT-ACCT**: Parent account with children
- [ ] **CHILD-ACCT1**: Child of PARENT-ACCT
- [ ] **CHILD-ACCT2**: Child of PARENT-ACCT
- [ ] **INACTIVE-ACCT**: Inactive account (for filtering tests)

### 2. Names (Customers & Suppliers)

#### Test Customers (Type: C)
- [ ] **CUST-001**: ABC Company Ltd
- [ ] **CUST-002**: XYZ Corporation
- [ ] **CUST-003**: Test & Special Chars Inc.
- [ ] **CUST-004**: International GmbH (foreign)
- [ ] **CUST-005**: Very Long Customer Name That Exceeds Normal Length
- [ ] **CUST-UNICODE**: Customer with unicode: 测试客户
- [ ] **CUST-INACTIVE**: Inactive customer
- [ ] **CUST-CREDIT**: Customer with credit limit
- [ ] **CUST-TERMS**: Customer with special payment terms
- [ ] **CUST-MULTI**: Customer with multiple addresses

#### Test Suppliers (Type: S)
- [ ] **SUPP-001**: Acme Supplies Ltd
- [ ] **SUPP-002**: Global Traders Inc
- [ ] **SUPP-003**: Special <Chars> & Co
- [ ] **SUPP-004**: International Supplier SARL
- [ ] **SUPP-005**: Maximum Length Supplier Name Test Case
- [ ] **SUPP-UNICODE**: 供应商测试
- [ ] **SUPP-INACTIVE**: Inactive supplier
- [ ] **SUPP-TERMS**: Supplier with payment terms

### 3. Products

#### Inventory Items
- [ ] **PROD-001**: Standard Product (sellable & buyable)
- [ ] **PROD-002**: Service Item (sellable only)
- [ ] **PROD-003**: Raw Material (buyable only)  
- [ ] **PROD-UNICODE**: Product with 中文名称
- [ ] **PROD-SPECIAL**: Product & <Special> "Chars"
- [ ] **PROD-LONG**: Product with very long description exceeding typical limits
- [ ] **PROD-MULTI**: Multi-currency product
- [ ] **PROD-TAX1**: Product with tax code 1
- [ ] **PROD-TAX2**: Product with tax code 2
- [ ] **PROD-NOTAX**: Tax-exempt product

#### Special Cases
- [ ] **PROD-KIT**: Kit/bundle product
- [ ] **PROD-VARIANT**: Product with variants
- [ ] **PROD-INACTIVE**: Inactive product
- [ ] **PROD-ZERO**: Zero-priced product
- [ ] **PROD-DECIMAL**: Product with decimal quantities

### 4. Transactions

#### Sales Transactions
- [ ] **At least 10 posted sales invoices (DI)**
  - Various dates across multiple periods
  - Different customers
  - Multiple line items
  - Some with discounts
  
- [ ] **At least 5 unposted sales invoices**
  - For testing status filters
  
- [ ] **At least 3 sales credits (DC)**
  - Linked to original invoices
  
- [ ] **At least 5 customer payments (DP)**
  - Some partial payments
  - Some overpayments

#### Purchase Transactions  
- [ ] **At least 10 posted purchase invoices (CI)**
  - Various suppliers
  - Different periods
  - Multiple line items
  
- [ ] **At least 3 purchase credits (CC)**

- [ ] **At least 5 supplier payments (CP)**

#### Banking Transactions
- [ ] **At least 5 bank receipts (BR)**
- [ ] **At least 5 bank payments (BP)**
- [ ] **At least 2 bank transfers (BT)**

#### Journal Entries
- [ ] **At least 10 journal entries (JO)**
  - Various types (accrual, depreciation, etc.)
  - Multi-line journals
  - Some with descriptions containing special characters

#### Special Test Cases
- [ ] **Transaction with maximum line items (99+)**
- [ ] **Transaction dated in closed period**
- [ ] **Future-dated transaction**
- [ ] **Foreign currency transaction**
- [ ] **Transaction with very long description**
- [ ] **Transaction with unicode characters**

### 5. Other Required Data

#### Tax Rates
- [ ] **TAX-STD**: Standard tax rate (e.g., 10%)
- [ ] **TAX-ZERO**: Zero tax rate
- [ ] **TAX-EXPORT**: Export tax rate

#### Currencies (if multi-currency enabled)
- [ ] **USD**: US Dollar
- [ ] **EUR**: Euro
- [ ] **GBP**: British Pound

#### Custom Fields
- [ ] At least one custom field on Names
- [ ] At least one custom field on Products
- [ ] At least one custom field on Transactions

### 6. Edge Cases & Error Scenarios

#### Data Integrity Tests
- [ ] **Orphaned transaction** (references deleted customer)
- [ ] **Circular account references** (if possible)
- [ ] **Maximum field lengths**:
  - Account code at limit (15 chars)
  - Description at limit (255 chars)
  - Name at limit

#### Special Characters
- [ ] Records with `&`, `<`, `>`, `"`, `'` in descriptions
- [ ] Records with line breaks in text fields
- [ ] Records with tabs in descriptions

#### Numeric Edge Cases
- [ ] Transactions with amounts near maximum (999,999,999.99)
- [ ] Transactions with maximum decimal places
- [ ] Negative quantities
- [ ] Zero amount transactions

## Data Creation Script

To help create this test data, here's a suggested order:

1. **Create Accounts** (in order):
   - Bank accounts first
   - Control accounts (AR/AP)
   - Income/Expense accounts
   - Parent/child relationships last

2. **Create Tax Rates**

3. **Create Names**:
   - Customers with various attributes
   - Suppliers with various attributes
   - Include special characters and unicode

4. **Create Products**:
   - Various types and tax codes
   - Include edge cases

5. **Create Transactions**:
   - Start with simple invoices
   - Add payments to create outstanding balances
   - Add journals and bank transactions
   - Create edge cases last

## Validation Checklist

After creating test data, run these checks:

- [ ] Each account type has at least 3 examples
- [ ] At least 100 total transactions exist
- [ ] Transactions span at least 3 periods
- [ ] Special characters are properly stored
- [ ] All transaction types are represented
- [ ] Some transactions are unposted
- [ ] Some invoices have outstanding balances
- [ ] Parent-child relationships work correctly
- [ ] Inactive records can be filtered

## Notes for Test Implementation

1. **Consistent Codes**: Use predictable codes (CUST-001, PROD-001) for easy test writing
2. **Meaningful Data**: Use descriptive names that indicate the test purpose
3. **Repeatable**: Document any specific amounts or dates used for assertions
4. **Isolation**: Prefix all test data codes with TEST- in production environments

This test data will enable comprehensive testing of:
- CRUD operations
- Filtering and searching  
- Data validation
- Edge cases and error handling
- Performance with realistic data volumes
- Integration scenarios