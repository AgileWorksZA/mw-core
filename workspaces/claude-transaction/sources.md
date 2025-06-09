# Documentation Sources Used

## Official MoneyWorks URLs

### Primary Source - Transaction Field Descriptions
- **URL**: https://cognito.co.nz/manual/moneyworks_appendix_transactions.html
- **Description**: Official MoneyWorks Transaction appendix from Cognito Software Ltd
- **Content Type**: Complete field descriptions, transaction types, status codes, and flags

### Supporting Sources
- **Transaction Web Search Results**: Multiple searches conducted for transaction type codes and status information
- **Local Mirror Documentation**: `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_transactions.html`

## Key Information Extracted

### Transaction Type Codes (From Official Documentation)
```
CIC - Creditor invoice--fully paid
CII - Creditor invoice--incomplete  
CP  - Cash payment/purchase
CPC - Cash payment for a creditor invoice
CPD - Returned refund to debtor
CR  - Cash receipt/sale
CRC - Receive refund from creditor
CRD - Receipt for a debtor invoice
DIC - Debtor invoice--fully paid
DII - Debtor invoice--incomplete
JN  - General journal
JNS - Stock journal
POC - Purchase order (complete) = Bought
POI - Purchase order (incomplete)
QU  - Quote
SOC - Sales order (complete) = Sold
SOI - Sales order (incomplete)
```

### Transaction Status Codes
- **U**: Unposted transaction
- **P**: Posted transaction

### Payment Method Codes
```
0 = None
1 = Cash
2 = Cheque
3 = Electronic
4 = Credit Card
5-7 = User defined
```

### Field Size Constraints (From Official Documentation)
- OurRef: 11 characters max
- Type: 3 characters max
- TheirRef: 21 characters max
- NameCode: 11 characters max
- Flag: 5 characters max
- Description: 1000 characters max
- Analysis: 9 characters max
- Contra: 7 characters max
- ToFrom: 200 characters max
- Status: 1 character max
- Salesperson: 5 characters max
- And many more detailed in the interface

### Transaction Flags (From Official Documentation)
Comprehensive bit-mapped flags including:
- Was Cancelled (0x00000001)
- Is Cancellation (0x00000002)
- Was Written Off (0x00000004)
- Printed (0x00000020)
- Is Job Invoice (0x00002000)
- Funds Transfer (0x00010000)
- And 20+ additional flags

### Period Format
- Format: (100 * year_number + period_number)
- Year range: 0-99 (year 1 = first year of operation)
- Period range: 1-12 (1 = first period of financial year)

## Reference Pattern Source
- **File**: `name-reference.ts` in workspace
- **Purpose**: Gold standard pattern for MoneyWorks entity generation
- **Key Elements Followed**:
  - Semantic enum definitions with clear business meaning
  - Complete JSDoc documentation
  - Validation functions with field constraints
  - Query builder class for type-safe queries
  - Utility functions for business logic
  - Type guards for TypeScript safety

## Source Data Structure
- **File**: `transaction-source.ts` in workspace  
- **Content**: Raw Transaction interface with 70+ field definitions
- **Annotations**: Field metadata including @indexed, @mutable, size constraints
- **Field Count**: 71 total fields transformed into semantic TypeScript

## Additional Context
- **MoneyWorks Internal Name**: "Transaction" (main file), "Detail" (transaction lines)
- **File Number**: 5
- **Relationship**: Detail.ParentSeq holds sequence number of parent transaction
- **Security**: Transactions have security levels and approval workflows
- **Multi-currency**: Full support with exchange rates and currency codes