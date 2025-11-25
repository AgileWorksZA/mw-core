# TXNS-001: Implement MoneyWorks Transaction and Detail Entities (API-Only)

## Why (Root Motivation)

Enable complete financial transaction data access, empowering developers to build invoicing, purchasing, banking, and financial reporting workflows on top of the MoneyWorks SDK. Transactions are the fundamental unit of all accounting activity.

**5 Whys Analysis:**
1. Why add Transaction/Detail entities? Products and Contacts reference transactions, but we cannot access transaction data.
2. Why is transaction access important? All financial activity in MoneyWorks flows through transactions - invoices, payments, journals.
3. Why does that matter for developers? Without transaction access, the SDK cannot support core accounting use cases like invoice lookup or payment tracking.
4. Why is this a priority now? We have established the entity implementation pattern (ACCT-001, CONT-001) and this is the next logical step for SDK completeness.
5. Root: **Transactions are the core financial data type - without them, the SDK cannot support meaningful accounting workflows.**

## Description

Full backend implementation of MoneyWorks Transaction (header) and Detail (line items) entities following the established 9-step entity implementation pattern. This is the most complex entity implementation requiring TWO coordinated entities:

### Transaction (Header)
- Contains: who (NameCode), when (TransDate), totals (Gross, Tax, Nett)
- Primary key: SequenceNumber (auto-generated)
- 65+ fields including type codes, status flags, payment methods
- 17 transaction types: CIC, CII, CP, CPC, CR, DII, JN, JNS, SO, PO, etc.

### Detail (Line Items)
- Contains: what (Account, Product), how much (Gross, Tax, Nett per line)
- Primary key: ParentSeq + Sort (composite)
- Foreign key: ParentSeq -> Transaction.SequenceNumber
- 40+ fields including quantity, discount, department, job

### Architecture
```
Transaction (header)
  |
  +-- Detail[0] (line 1)
  +-- Detail[1] (line 2)
  +-- Detail[n] (line n)
```

## Acceptance Criteria

- [ ] **AC-001**: Canonical types for Transaction defined in packages/canonical/src/entities/transactions/ with MoneyWorksTransaction interface, MoneyWorksTransactionType enum (17 types), MoneyWorksTransactionStatus enum, MoneyWorksPaymentMethod enum, and MoneyWorksTransactionFlags bitmask
- [ ] **AC-002**: Canonical types for Detail defined in packages/canonical/src/entities/details/ with MoneyWorksDetail interface, MoneyWorksDetailFlags bitmask, and MONEYWORKS_DETAIL_FIELDS array (40+ fields)
- [ ] **AC-003**: TransactionRepository with postProcess() parsing 65+ fields, prepare(), and specialized queries: findByType(), findByNameCode(), findByStatus(), findByDateRange(), findPosted(), findUnposted()
- [ ] **AC-004**: DetailRepository with postProcess() parsing 40+ fields, prepare(), and specialized queries: findByParentSeq(), findByTransaction(), findByAccount(), findByProduct()
- [ ] **AC-005**: TransactionController and DetailController registered in TableRegistry - both appear in 'available' list
- [ ] **AC-006**: TypeScript compilation passes with zero errors
- [ ] **AC-007**: Transaction type code validation utilities available

## Weave Knowledge

**Patterns Applied:**
- `E:9-step-entity-implementation-pattern` - Follow 9-step checklist for each entity (18 steps total)
- `E:triple-export-registration-pattern` - Repository exports in 3 locations
- `E:canonical-dsl-pattern` - Preserve exact MoneyWorks field names
- `E:sequence-number-vs-code-primary-key-pattern` - Transaction uses SequenceNumber, Detail uses composite key
- `E:table-registry-registration-pattern` - Must register controllers for API availability

**Pain Points to Avoid:**
- `Q:triple-export-registration-pain` - Triple-check all export locations
- Follow reference implementation (CONT-001) to avoid missing steps

**Reference Implementation:**
- Use CONT-001 (Contact entity) as reference - similar parent-child architecture
- Contact.ParentSeq -> Name.SequenceNumber parallels Detail.ParentSeq -> Transaction.SequenceNumber

## Complexity: Complex

Justification:
- TWO entities required (Transaction AND Detail)
- Most fields of any entity (65+ for Transaction, 40+ for Detail)
- Complex enums (17 transaction types, multiple flag bitmasks)
- Parent-child relationship requiring coordinated queries
- Estimated 12-18 tasks, 1-2 day implementation

## Priority: High

Transactions are the core financial data type. Product references (COGAcct, SalesAcct) and Name relationships all flow through transactions.

## Notes

### Key Implementation Considerations

1. **Transaction Types (17 codes):**
   - Sales: CII (Customer Invoice), SO (Sales Order)
   - Purchases: DII (Supplier Invoice), PO (Purchase Order)
   - Payments: CP (Customer Payment), CR (Customer Receipt), CPC (Supplier Payment)
   - Journals: JN (Journal), JNS (Journal System)
   - Banking: CIC (Bank Deposit)

2. **Status Lifecycle:**
   - U = Unposted (editable)
   - P = Posted (locked)

3. **Flag Fields (bitwise):**
   - TransactionFlags: includes print status, email status, reversal indicators
   - DetailFlags: includes tax handling, discount application

4. **Date Fields:**
   - All dates in YYYYMMDD format (branded type)
   - TransDate, DueDate, EnteredDate, PrintedDate, etc.

5. **Contra Field Logic:**
   - For customer transactions: Contra = DebtorControl account
   - For supplier transactions: Contra = CreditorControl account
   - For journals: Contra may be empty
