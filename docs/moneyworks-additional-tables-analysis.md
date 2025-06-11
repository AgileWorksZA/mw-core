# MoneyWorks Additional Tables Analysis

This document analyzes the additional MoneyWorks tables that were outside the original context.

## 1. Login Table

**Internal Name:** Login  
**Primary Key:** Not explicitly defined (possibly Name or combination)

### Fields:
- `Category` (Text, 31): User Category
- `Email` (Text, 63): User email
- `Flags` (Short): User flags
- `Initials` (Text, 3): User initials
- `LastModifiedTime` (Short): Date/time of last record change
- `Name` (Text, 31): User name
- `Password` (Text, 33): User password (encrypted)
- `Privileges` (Text, 65): Privilege map for user
- `Role` (Text, 3): User role
- `SecurityLevel` (Numeric): Security level
- `TaggedText` (Text, 255): Scriptable tag storage
- `UserNum` (Numeric): Scriptable number
- `UserText` (Text, 255): Scriptable text

### Characteristics:
- Stores user authentication and authorization data
- Password field is encrypted
- Includes scriptable fields for extensibility
- No foreign key relationships documented

## 2. User2 Table

**Internal Name:** User2  
**Primary Key:** Composite key of `DevKey` + `Key`

### Fields:
- `DevKey` (Unsigned Integer > 65,535): Developer/segment key
- `Key` (Text, 28): Record key
- `LastModifiedTime` (String): Last modification timestamp
- `Int1` to `Int4` (Signed Integer): Integer storage fields
- `Float1` to `Float4` (Float): Floating point storage fields
- `Date1` to `Date4` (Date): Date storage fields
- `Text1` to `Text4` (Text, 255): Text storage fields
- `Text` (Text, 1020): Large text field
- `TaggedText` (Text, 255): Tagged text storage

### Characteristics:
- Designed for persistent script data storage
- Supports native format storage for dates/numbers
- Lower DevKey values reserved for plug-ins
- Entire record rewritten on update
- Delete by sending only DevKey and Key with no other fields

## 3. User Table

**Internal Name:** User  
**Primary Key:** `Key` (Text, 9)

### Fields:
- `Key` (Text, 9): Unique identifier
- `Data` (Text, 245): Text data associated with key
- `LastModifiedTime` (String): Last modification timestamp

### Characteristics:
- Simpler version of User2 for basic persistent storage
- Uses SetPersistent function for management
- Empty data deletes existing record
- Shorter key length than User2

## 4. Payments Table

**Internal Name:** _Payments_  
**Primary Key:** Not explicitly defined (likely composite)

### Fields:
- `LastModifiedTime` (String): Last modification timestamp
- `CashTrans` (Number): Payment/receipt sequence number
- `InvoiceID` (Number): Invoice sequence number
- `Amount` (Number): Receipt amount allocated to invoice
- `GSTCycle` (Number): Tax cycle when receipt was processed
- `Date` (Date): Receipt date

### Characteristics:
- Many-to-many link between invoices and payments
- For debtor overpayments, InvoiceID stores namecode with high bit set
- GSTCycle can be negative if processed on invoice/accruals basis
- Supports relational searches between payments and invoices

## 5. OffLedger Table (Offledgers/Currency)

**Internal Name:** _OffLedger_  
**Primary Key:** Not explicitly defined (likely Name)

### Fields:
- `Kind` (Text, 3): Record type ('CUR' or 'USR')
- `Name` (Text, 15): Currency/offledger name
- `Description` (Text, 39): Description
- `Balance00` to `Balance90` (Numeric): 90 historical balance periods
- `Budget00` to `Budget29` (Numeric): 30 historical budget periods
- `BudgetNext01` to `BudgetNext18` (Numeric): 19 future budget periods
- `LinkedAccountU` (Text): Unrealized gain GL account
- `LinkedAccountR` (Text): Realized gain GL account
- `PreferredBankCR` (Text): Receipts bank account
- `PreferredBankCP` (Text): Payments bank account
- `UserNum` (Numeric): Scriptable number
- `UserText` (Text, 255): Scriptable text
- `TaggedText` (Text, 255): Tagged text

### Characteristics:
- Stores both currency and user-defined offledger records
- Extensive historical and future budget tracking
- Links to GL accounts for currency gains/losses

## 6. Memo Table

**Internal Name:** _Memo_  
**Primary Key:** Not explicitly defined (likely composite)

### Fields:
- `LastModifiedTime` (String): Last modification timestamp
- `Memo.NameSeq` (Numeric): Link to Name record
- `Memo.Date` (Date): Memo date
- `Memo.RecallDate` (Date): Reminder date
- `Memo.Text` (Text, 255): Memo content

### Characteristics:
- Stores memo records for names
- Includes reminder functionality
- Direct relationship to Names table via NameSeq

## 7. AssetLog Table

**Internal Name:** Assetlog  
**Primary Key:** Not explicitly defined (likely uses ParentSeq + Date/Action)

### Fields:
- `ParentSeq` (Number): Parent asset sequence number
- `Action` (Text, 3): Action type (AA=acquisition, AD=disposal, etc.)
- `Date` (Date): Action date
- `Qty` (Number): Quantity
- `Depreciation` (Number): Depreciation amount
- `Adjustment1` (Number): First adjustment
- `Adjustment2` (Number): Second adjustment
- `Rate` (Number): Rate applied
- `PrivateUsePercent` (Number): Private use percentage
- `AccumDepreciation` (Number): Accumulated depreciation
- `AccumReval` (Number): Accumulated revaluation
- `ClosingValue` (Number): Closing value
- `TransactionSeq` (Number): Related transaction
- `Memo` (Text, 255): Memo text

### Characteristics:
- Subfile of Assets table
- Tracks complete asset lifecycle
- Records all financial changes to assets

## 8. Asset Categories Table

**Internal Name:** assetcat  
**Primary Key:** `Code` (Text, 7)

### Fields:
- `Code` (Text, 7): Unique category identifier
- `Description` (Text, 63): Category description
- `AssetAccount` (Text, 13): Fixed asset account
- `DepExpense` (Text, 13): Depreciation expense account
- `AccumDep` (Text, 13): Accumulated depreciation account
- `GainLoss` (Text, 13): Disposal gain/loss account
- `Custom` (Text, 39): User-defined field
- `Group` (Text, 7): User-defined grouping
- `Type` (Text, 3): Depreciation type (SL/DV)
- `Impairment` (Text, 13): Impairment expense account
- `Rate` (Numeric): Default depreciation rate
- `RevalSurplus` (Text, 13): Revaluation surplus account
- Additional private use and scriptable fields

### Characteristics:
- Defines categories for asset management
- Links to multiple GL accounts
- Supports both standard and private asset tracking

## 9. Build Table

**Internal Name:** _Build_  
**Primary Key:** Not explicitly defined

### Fields:
- `LastModifiedTime` (String): Last modification timestamp
- `Build.Memo` (Text, 255): Component memo
- `Build.ProductSeq` (Numeric): Link to Product record
- `Build.Qty` (Numeric): Component quantity required
- `Build.PartCode` (Text, 19): Component code

### Characteristics:
- Stores product build recipes/BOMs
- Links to Products table via ProductSeq
- Defines component requirements

## 10. AutoSplit Table (Allocation File)

**Internal Name:** _AutoSplit_  
**Primary Key:** Not explicitly defined (possibly MatchName)

### Fields:
- `LastModifiedTime` (String): Last modification timestamp
- `MatchFunction` (Text, 255): Matching text/function
- `MatchName` (Text, 11): Rule name
- `Priority` (Numeric): Rule priority
- `SplitAcct1` to `SplitAcct4` (Text, 13): Split accounts
- `SplitAmount1` to `SplitAmount3` (Numeric): Allocation amounts/percentages
- `SplitMode` (Numeric): Split type

### Characteristics:
- Stores auto-allocation rules for bank imports
- Supports multiple split accounts
- Priority-based rule application

## 11. Reconciliation Table

**Internal Name:** _recon_  
**Primary Key:** Not explicitly defined

### Fields:
- `Account` (Text, 8): Account code reconciled
- `Closing` (Numeric): Closing balance
- `Date` (Date): Statement date
- `Discrepancy` (Numeric): Reconciliation discrepancy
- `LastModifiedTime` (String): Last modification timestamp
- `Opening` (Text, 5): Opening balance
- `Statement` (Numeric): Statement number
- `Time` (String): Reconciliation date and time

### Characteristics:
- Tracks bank reconciliation history
- Records discrepancies
- Links to account codes

## 12. Account Categories/Groups Table

**Internal Name:** General  
**Primary Key:** `Code` (Text, 5)

### Fields:
- `Code` (Text, 5): Code with prefix (C/D/S)
- `Description` (Text, 25): Category name
- `LastModifiedTime` (System date): Last change timestamp

### Characteristics:
- Single file contains three logical files
- Prefix determines type:
  - C: Category
  - D: Classification  
  - S: Group
- LastModifiedTime tracks category changes, not balance changes

## Key Observations

1. **Primary Keys**: Many tables don't have explicitly defined primary keys, suggesting they may use composite keys or internal sequence numbers.

2. **Common Patterns**:
   - Most tables include `LastModifiedTime` field
   - Many support scriptable/extensible fields (UserNum, UserText, TaggedText)
   - Several tables use sequence numbers to link to parent records

3. **Special Tables**:
   - User/User2: Persistent storage for scripts
   - Login: Authentication and authorization
   - Payments: Many-to-many relationship table
   - OffLedger: Handles both currency and custom offledgers
   - General: Single file acting as three logical files

4. **Relationships**:
   - AssetLog → Assets (via ParentSeq)
   - Build → Products (via ProductSeq)
   - Memo → Names (via NameSeq)
   - Payments → Transactions (via CashTrans, InvoiceID)

5. **Unique Behaviors**:
   - User2 supports deletion via empty field submission
   - Payments uses high bit for special encoding
   - General uses prefix to determine logical file type
   - Several tables support import via XML or pseudo-map formats