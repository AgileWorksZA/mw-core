# MoneyWorks Field Reference - Manual Extract

> Source: MoneyWorks User Guide
> Extracted: 2025-11-26

## Transaction Header Fields

**Internal Table Name:** `Transaction`

| Field Name | Data Type | Required | Description | Valid Values / Format |
| :--- | :--- | :--- | :--- | :--- |
| **SequenceNumber** | Number | **Yes** | Unique internal ID for the transaction. Auto-assigned by system. | Integer. Cannot be changed. |
| **Type** | Text (3) | **Yes** | The type of transaction. | `DI`, `CI`, `CP`, `CR`, `JN`, `SO`, `PO`, `QU` |
| **OurRef** | Text (11) | Yes | The document reference number (e.g., Invoice Number). | Alphanumeric. Max 11 chars. |
| **TransDate** | Date | **Yes** | The date the transaction occurred. | `YYYYMMDD` (for XML/REST import). |
| **Period** | Number | **Yes** | The financial period. | Formula: `(Year * 100) + PeriodNumber`. e.g., `202301` |
| **NameCode** | Text (11) | Cond* | Customer or Supplier code. | Required for DI, CI. Must match Names table. |
| **Contra** | Text (7) | **Yes** | The balancing account. | Bank Account OR Control Account |
| **Gross** | Number | **Yes** | Total value (Tax Inclusive). | Must equal sum of Detail Line Gross amounts. |
| **Status** | Text (1) | **Yes** | Current state. | `U` (Unposted), `P` (Posted) |
| **Description** | Text (1000) | No | Main description/memo. | Max 1000 chars. |
| **ToFrom** | Text (200) | No | Payee/Payer name. | Auto-populated from NameCode if blank. |
| **DueDate** | Date | No | Date payment is due. | `YYYYMMDD` |
| **Hold** | Boolean | No | If true, cannot be posted. | `True`/`False` or `1`/`0` |
| **SalesPerson** | Text (5) | No | Salesperson/department code. | Max 5 chars. |
| **TheirRef** | Text (21) | No | External reference (Customer PO, etc.). | Max 21 chars. |
| **Currency** | Text (3) | No | Currency code. | `USD`, `EUR`, `AUD`, etc. |
| **ExchangeRate** | Number | Cond* | Exchange rate for foreign currency. | Required if currency is not base. |

## Detail Line Fields

**Internal Table Name:** `Detail`

| Field Name | Data Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **ParentSeq** | Number | **Yes** | The `SequenceNumber` of parent Transaction. |
| **Account** | Text (13) | **Yes** | GL Account Code (e.g., `4000-AKL`). |
| **Net** | Number | **Yes** | Tax Exclusive amount. |
| **Tax** | Number | No | Tax/GST/VAT amount. |
| **Gross** | Number | **Yes** | Tax Inclusive amount (Net + Tax). |
| **TaxCode** | Text (3) | **Yes** | Tax code (e.g., `G`, `Z`, `E`). |
| **StockCode** | Text (19) | Cond* | Item Code. Required if line is "By Item". |
| **StockQty** | Number | Cond* | Quantity. Required if StockCode present. |
| **Description** | Text (255) | No | Line item description. |
| **JobCode** | Text (9) | No | Job code for Job Costing. |
| **UnitPrice** | Number | No | Unit price of item. |
| **Discount** | Number | No | Percentage discount. |
| **Location** | Text (15) | No | Stock location (multi-location). |

## Date Formats

| Interface | Format | Notes |
| :--- | :--- | :--- |
| **Import (XML/REST)** | `YYYYMMDD` | **Strictly enforced**. Big-endian. |
| **Import (Text/CSV)** | `dd/mm/yy` | Locale-dependent. |
| **Display (UI)** | `dd/mm/yy` | OS Locale settings. |
| **Database** | Date Type | Internal date type. |

## Period Formula

```
Period = (Year * 100) + PeriodNumber
Example: 202301 = January 2023 (1st period of year 2023)
```

## Import Requirements

### Mandatory Fields
- `Type`
- `TransDate`
- `Contra`
- `Gross`

### Conditional Fields
- `NameCode` - Required for DI/CI
- `StockCode` - Required for Item transactions

### Optional Fields
- `Description`, `Analysis`, `OurRef` (auto-assigns if missing)

### Parent-Child in XML/REST

```xml
<transaction>
   <ourref>1001</ourref>
   <subfile name="Detail">
       <detail>...</detail>
       <detail>...</detail>
   </subfile>
</transaction>
```

### Validation Failures
Import fails if:
- Account/NameCodes don't exist
- Gross ≠ sum of Detail Gross (outside rounding tolerance)
- Invalid date format
- Importing to Locked/Closed period

## Status Field

| Status | Meaning | Can Edit? | Can Delete? |
| :--- | :--- | :--- | :--- |
| **U** | Unposted | **Yes** - Full editing | **Yes** - Permanent delete |
| **P** | Posted | **No** - Only non-financial fields | **No** - Must reverse |

## Posting Behavior

When Status changes U → P:

1. **Transaction Record**: Status = P, record locked
2. **Stock**: Sales decreases On Hand, Purchases increases On Hand
3. **Balances**: Debtor/Creditor balances updated
4. **GL**: Debits/Credits written to accounts

## Sequence Numbers

| Aspect | Mechanism |
| :--- | :--- |
| **SequenceNumber** | Internal PK. Auto-assigned. **Cannot be set manually.** |
| **OurRef** | User reference. Auto-increments from Document Preferences. |
| **Manual Import** | Can supply OurRef, or leave blank for auto-assign. |
| **Duplicates** | Configurable check in Preferences. |

## Key Insights

### Import Best Practices
1. Always use `YYYYMMDD` for dates in REST/XML
2. Let MW assign SequenceNumber (don't try to set it)
3. Can set OurRef manually or leave blank for auto-assign
4. Gross must match sum of Detail lines
5. Use `workItOut=true` to let MW calculate derived fields

### Credit Notes
- **DI with negative Gross** = Credit Note (stays Type DI)
- **CI with negative Gross** = Supplier Credit Note (stays Type CI)
- No need for separate DIC/CIC types!

### Period Handling
- Formula: `Year * 100 + PeriodNumber`
- Cannot import to locked/closed periods
- Check period status before bulk import
