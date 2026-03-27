# Data Model — Real Field Names from API

> Generated from live API queries against Acme Widgets Gold.moneyworks
> API: http://studio.local:3400/api/v1

## Record Counts (Acme Widgets)
| Table | Records | Fields |
|-------|---------|--------|
| Name | 21 | 97 |
| Product | 15 | 75 |
| Account | 78 | ~40 |
| TaxRate | 10 | 30 |
| Transaction | 981+ | 74 |
| Detail | 3,821+ | ~40 |
| Contact | (sub-records of Name) | ~20 |

## Company Info (from /company)
```json
{
  "name": "Acme Widgets Ltd",
  "address": { "line1": "P.O. Box 5", "line2": "NEWTON" },
  "contact": { "phone": "02-123-5678", "fax": "02-123-5679", "email": "acmewidgets@newtonnet.co" },
  "accounting": { "periodsInYear": 12, "currentPeriod": 401, "baseCurrency": "CAD", "multiCurrencyEnabled": true },
  "tax": { "gstCycleMonths": 3, "gstRegistrationNumber": "123-456-78" },
  "system": { "version": "9.2.1b5" }
}
```

## TaxRate Table (30 fields)
| Field | Type | Description |
|-------|------|-------------|
| Sequencenumber | number | Internal sequence ID |
| LastModifiedTime | number | Last modification timestamp |
| _Timestamp | string | ISO timestamp |
| TaxCode | string | Tax code identifier (e.g., "G", "V", "Z") |
| PaidAccount | string | GL account for tax paid (e.g., "1400") |
| RecAccount | string | GL account for tax received (e.g., "2400") |
| Rate1 | number | Rate before changeover (e.g., 12.5) |
| Date | date | Changeover date |
| Rate2 | number | Rate after changeover (e.g., 15.0) |
| CombineRate1 | number | Combined rate 1 (for two-tier HST) |
| CombineRate2 | number | Combined rate 2 |
| GSTReceived | number | GST received this cycle |
| NetReceived | number | Net received this cycle |
| GSTPaid | number | GST paid this cycle |
| NetPaid | number | Net paid this cycle |
| Ratename | string | Display name (e.g., "Normal GST") |
| Type | number | Tax type code |
| Combination | string | Combination code |
| UserNum | number | Custom numeric field |
| UserText | string | Custom text field |
| TaggedText | string | Tagged text |
| Aliascode | string | Alias code (for international tax mapping) |
| Aliascountry | string | Alias country |
| Reversedrate1 | number | Reversed rate 1 |
| Reversedrate2 | number | Reversed rate 2 |

## Name Table (97 fields)
| Field | Type | Description |
|-------|------|-------------|
| Code | string | Unique name code (e.g., "WHITE") |
| Name | string | Full name |
| Contact | string | Primary contact name |
| Position | string | Contact position |
| Address1-4 | string | Postal address lines |
| Delivery1-4 | string | Delivery address lines |
| Phone | string | Phone number |
| Fax | string | Fax number |
| Category1-4 | string | Custom categories |
| CustomerType | string | Customer type label |
| SupplierType | string | Supplier type label |
| D90Plus | number | Debtor aging: 90+ days |
| D60Plus | number | Debtor aging: 60+ days |
| D30Plus | number | Debtor aging: 30+ days |
| DCurrent | number | Debtor aging: current |
| CCurrent | number | Creditor: current |
| DebtorTerms | string | Payment terms for debtor |
| CreditorTerms | string | Payment terms for creditor |
| Bank | string | Bank name |
| AccountName | string | Bank account name |
| BankBranch | string | Bank branch |
| TheirRef | string | Their reference for us |
| Hold | boolean | Credit hold flag |
| RecAccount | string | Receivables GL account |
| PayAccount | string | Payables GL account |
| Kind | string | Type flags (Customer/Supplier/Debtor/Creditor) |
| CreditLimit | number | Credit limit |
| Discount | number | Default discount % |
| Comment | string | Free text comments |
| Colour | string | Colour code |
| Salesperson | string | Assigned salesperson |
| TaxCode | string | Default tax code |
| Postcode | string | Postal code |
| State | string | State/province |
| BankAccountNumber | string | Bank account number (for e-payments) |
| Currency | string | Default currency |
| PaymentMethod | string | Default payment method |
| DBalance | number | Total debtor balance |
| CBalance | number | Total creditor balance |
| DDI | string | Direct dial-in phone |
| Email | string | Email address |
| Mobile | string | Mobile phone |
| AfterHours | string | After-hours phone |
| Contact2-6 | string | Additional contact names |
| WebURL | string | Website URL |
| GSTNumber | string | Tax registration number |
| PriceCode | string | Price list code (Retail, Wholesale, etc.) |
| Custom1-8 | string | Custom fields |
| Datelastsale | date | Date of last sale |
| Datelastpurchase | date | Date of last purchase |

## Product Table (75 fields)
| Field | Type | Description |
|-------|------|-------------|
| Code | string | Item code (e.g., "BA100") |
| Description | string | Item name |
| Supplierscode | string | Supplier's item code |
| Supplier | string | Default supplier code |
| Comment | string | Comments |
| Category1-4 | string | Categories (Material, Size, Style, etc.) |
| Salesacct | string | Income GL account (e.g., "4000") |
| Cogacct | string | COGS GL account (e.g., "6000") |
| Stockacct | string | Stock asset GL account (e.g., "1300") |
| Sellunit | string | Selling unit of measure |
| Sellprice | number | Primary selling price |
| Costprice | number | Current cost price |
| Plussage | number | Landed cost addition |
| Buyunit | string | Buying unit of measure |
| Buyweight | number | Buy weight per unit |
| Conversionfactor | number | Buy-to-sell unit conversion |
| Marginwarning | number | Minimum margin warning % |
| Selldiscount | number | Default selling discount |
| Stockonhand | number | Current stock on hand |
| Stockvalue | number | Current stock value |
| Reorderlevel | number | Reorder trigger level |
| Flags | string | Item flags (WeBuy, WeSell, WeStock, WeCount) |
| Colour | string | Colour code |
| Usemultipleprices | boolean | Multiple price tiers enabled |
| Sellpriceb-f | number | Price tiers B through F |
| Qtybreak1-4 | number | Quantity break points |
| Barcode | string | Barcode |
| Custom1-8 | string | Custom fields |
| Taxcode | string | Default selling tax code |
| Buytaxcode | string | Default buying tax code |

## Transaction Table (74 fields)
| Field | Type | Description |
|-------|------|-------------|
| Sequencenumber | number | Internal sequence |
| Ourref | string | Our reference number |
| Transdate | date | Transaction date |
| Enterdate | date | Date entered |
| Duedate | date | Due date |
| Period | number | Accounting period code |
| Type | string | Transaction type (DI, CI, CR, CP, JN, SO, PO, QU) |
| Theirref | string | Their reference (order #, cheque #) |
| Namecode | string | Customer/supplier code |
| Flag | string | Custom flag field |
| Description | string | Transaction description |
| Gross | number | Gross total |
| Analysis | string | Analysis/job code |
| Contra | string | Contra bank account |
| Tofrom | string | To/From address |
| Status | string | Status (P=Posted, etc.) |
| Hold | boolean | On hold flag |
| Datepaid | date | Date fully paid |
| Amtpaid | number | Amount paid to date |
| Payamount | number | Payment amount |
| Aging | number | Aging bucket |
| Taxamount | number | Tax total |
| Recurring | string | Recurring schedule |
| Printed | boolean | Has been printed |
| Flags | string | Status flags |
| Salesperson | string | Salesperson code |
| Colour | string | Colour tag |
| Paymentmethod | string | Payment method |
| User1-3 | string | Custom fields |
| Freightcode | string | Freight method code |
| Freightamount | number | Freight charge |
| Currency | string | Currency code |
| Exchangerate | number | Exchange rate |
| Enteredby | string | User who entered |
| Postedby | string | User who posted |
| Amtwrittenoff | number | Written off amount |
| Ordertotal | number | Original order total |
| Ordershipped | number | Shipped amount |
| Mailingaddress | string | Customer mailing address |
| Deliveryaddress | string | Delivery address |

## Account Table (~40 fields)
| Field | Type | Description |
|-------|------|-------------|
| Code | string | Account code (e.g., "1000") |
| Description | string | Account name |
| Category1 | string | Primary category |
| Category2-4 | string | Additional categories |
| Colour | string | Colour code |
| Classification | string | Classification code |
| Department | string | Department code |
| Type | string | Account type (CA, EX, SF, IN, CS, SA, CL, FA) |
| TaxCode | string | Default tax code |
| Heading | boolean | Heading-only flag |
| SecurityLevel | string | Access level |
| AccountantsCode | string | External reference |
| BankAccountNumber | string | Bank account # |
| BankAccountType | string | Bank type (Current, Savings, Credit Card) |
| MustReconcile | boolean | Requires reconciliation |

## Key Relationships
```
Transaction.Namecode → Name.Code
Transaction.Contra → Account.Code (bank account)
Transaction.Sequencenumber → Detail.SequenceNumber (parent)
Detail.Account → Account.Code
Detail.StockCode → Product.Code
Name.RecAccount → Account.Code (receivables)
Name.PayAccount → Account.Code (payables)
Product.Salesacct → Account.Code
Product.Cogacct → Account.Code
Product.Stockacct → Account.Code
TaxRate.PaidAccount → Account.Code
TaxRate.RecAccount → Account.Code
```

## Transaction Type Codes (confirmed from data)
| Type | Desktop Label |
|------|--------------|
| DI | Sales Invoice (Debtor Invoice) |
| CI | Purchase Invoice (Creditor Invoice) |
| CR | Receipt (Cash Receipt) |
| CP | Payment (Cash Payment) |
| JN | Journal |
| SO | Sales Order |
| PO | Purchase Order |
| QU | Quote |
