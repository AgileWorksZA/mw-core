# Appendix A—Field Descriptions

Appendix A—Field Descriptions

Appendix A—Field Descriptions

This appendix gives descriptions of the field names that you will see in the Find
and Sort dialog boxes, as well as when you import or prepare an analysis report.
The field and file names are also accessible from external scripts. A simplified
schema is shown at Schema.

The letter after the field name denotes the type of the field, viz:

A

B
D
N
S
T

Alphanumeric. These fields are like Text fields except that they are fixed-length and
cannot be "wildcard" searched.
Boolean. The value for a boolean field is always "True" or "False"
A date. Dates are entered in the form 'DD/MM/YY'. E.g. '21/2/68'
Numeric
Date and time (cannot be searched by equality operator)
Text. Text fields can be "wildcard" searched using the "@" character.

The number after T and A type fields is the maximum length of the field.

The internal name is the name to use in referencing the file from external
scripts. The names of indexed fields are in bold

Note: Changes to the schema introduced in MoneyWorks 8 are shown in this

form of highlighted text.

Note on UserNum and UserText fields

A number of tables have had these fields added. These are for your own use,
and can be accessed using a script or through importing. For example, if you are
importing transactions from some other system and want to store that system's
id for the transaction, then the transaction.usernum or transaction.usertext field
could be a good place.

Note on the TaggedText field

The TaggedText that has been added to many of the tables is for storing key-
value pairs, and should only be accessed using the special routines in mwScript.

Accounts

Internal Name Account.

Name
AccountantsCode

BankAccountNumber

Category

Category2
Category3
Category4
Code
Colour

Comments
Created
Currency

Description
EBITDA

Group
LastModifiedTime

LastStatementImport
ManualChequeNumber
PandL
PrintedChequeNumber
SecurityLevel
System

T

T

T
T
T
T
N

T
S
T

T
T

T
S

D
T
T
T
N
A

Type Size
T

7

9

23

Notes
Code in accountant's chart that corresponds to this
account.
For bank accounts, the number of the bank
account.
The category code for the account (blank if
Category is None).
User defined
User defined
User defined
The account code
The colour, represented internally as a numeric
index in the range 0-7 but rendered as a textual
colour name
1020 For own use

15
15
15
7

3

39
1

5

11
7
11

2

The date/time on which the account was created.
The currency code (empty for local currency
accounts)
Description shown in transaction entry and reports
Tag to specify EBITDA status of account for
reporting ("I" for Interest, "T" for Tax, "D" for
Depreciation/Amortisation, otherwise blank)
The department group code for the account.
The date and time that this account was last
changed. This means a change to the account
record itself, not a change to the account balance.
Last bank statement import cut-off date
Next manual cheque number (for bank accounts)
The Profit and Loss account.
Next batch cheque number (for bank accounts)
The security level for the account
The "system" account type. The account types Bank
Account, Profit & Loss, Accounts Receivable,
Accounts Payable, GST Received and GST Paid are
special system account types. Accounts of these
types contain the codes: "BK", "PL", "AR", "AP",
"GR", or "GP" (respectively) in the System field.
Ordinary account types have " " (2 spaces) in the
System field.
Scriptable tag storage

TaggedText

T

255
Appendix A—Field Descriptions

TaxCode
Type

UserNum
UserText

A
A

N
T

3
2

255

The tax code for the account.
The account type. This will be one of IN, SA, EX, CS,
CA, CL, FA, TA, TL or SF for Income, Sales, Expense,
Cost of Sales, Current Asset, Current Liability, Fixed
Asset, Term Asset, Term Liability or Shareholder's
Funds respectively.
Scriptable number
Scriptable text

Account Flags

Use TestFlags() to determine flags.

Do not reconcile (bank) 0x0001
0x0004
Job Code Required
0x0020
Non Discountable

Is an Unbanked Account
0x0002
Synchronise Cheque Numbers 0x0010
0x8000
Non posting account

Departments

Internal Name Department.

Type Size Notes
Field
T
Classification
T
Code
T
Custom1
T
Custom2
T
Description
LastModifiedTime S

5
5
15
9
35

UserNum
UserText
TaggedText

N
T
T

255
255

The classification code for the department.
The department code.
For your own use
For your own use
The department name.
The date that this department was last changed. This
means a change to the department record itself, not a
change to any account balance associated with the
department.
Scriptable number
Scriptable text
Scriptable tag storage

Account Categories, Department Classifications and
Groups

lookup).

Field
Code

Type Size Notes
T

5

Description
T
LastModifiedTime S

25

Transactions

The category code. The prefixes are:C for Category, D for
Classification, S for Group
The category name.
The date that this category was last changed. This means a
change to the category record itself, not a change to any
account balance associated with the category.

Internal Name Transaction. The details (transaction lines) are held in a separate
file with the internal name Detail, with Detail.ParentSeq holding the sequence
number of the parent transaction.

Field
Aging
AmtPaid

AmtWrittenOff

Analysis
ApprovedBy1

ApprovedBy2

BankJNSeq

Colour

Contra

Type Size
N
N

N

T
T

T

N

N

T

D

T

9
3

3

7

255

Notes
The aging cycle for the transaction
The amount of the invoice that has been
paid
For invoices, the amount written off in a
write-off
The analysis field.
Initials of first user to approve
transaction. This field can only be set to
the current user's initials (or blank) using
a script.
Initials of second user to approve
transaction. This field can only be set to
the current user's initials (or blank) using
a script.
The sequence number of the journal
which banked the receipt (using the
Banking command)
The colour, represented internally as a
numeric index in the range 0-7 but
rendered as a textual colour name
For CP and CR transactions, this contains
the account code of the bank that was
selected in the bank pop-up menu. For
invoices this is the accounts payable/
receivable control acct.
The date the last payment for an invoice
was made
The delivery address for this transaction.

Internal Name General. This one file holds three logical files, with the first
character of the code field being a one letter prefix to indicate the file (you don't
see this in MoneyWorks, but will need it to extract the description using

DatePaid

DeliveryAddress
Appendix A—Field Descriptions

Description
Detail.Account

Detail.BackorderQty

Detail.BaseCurrencyNet

Detail.CostPrice

Detail.Credit

Detail.Date

Detail.Custom1
Detail.Custom2
Detail.Debit

Detail.Dept
Detail.Description
Detail.Discount
Detail.ExpensedTax

Detail.Flags

T
T

N

N

N

N

D

T
T
N

T
T
N
N

N

N
Detail.Gross
T
Detail.JobCode
Detail.MoreFlags
N
Detail.NonInvRcvdNotInvoicedQty N

31
31

Blank if default from name.
1000 The description of the transaction.
A text string containing the account
14
code- (or account-department code)
from the detail line
The amount currently on backorder for
an order
The detail.net amount converted to the
base currency
This is the base currency buy-price of the
product. It is represented as dollars per
buying unit for a purchase or as dollars
per selling unit. for a sale. For a sale, the
cost price is taken from the AverageValue
of the product.
The credit value of the detail line. This is
the amount by which the account is
credited when the transaction gets
posted. It corresponds to the Net or
Extension for a CP or CI.
The date on the detail line (also the
expiry date for time-limited batches)
Scriptable text
Scriptable text
The debit value of the detail line. This is
the amount by which the account is
debited when the transaction gets
posted. It corresponds to the Net or
Extension for a CR or DI.
The department code

5
1020 The description for the detail line.
The percent discount for the line.
The amount of non-claimable sales tax
on the line (only set for transactions of
type CI and CP that involve sales tax).
When a line is saved, the net is adjusted
up by this amount and the tax down;
when the transaction is viewed, the
reverse happens.
See Detail Flags table below, and
detail.moreFlags
The gross value of the detail line.
This is the job code for the detail line.
For more flags, see flags table below
The quantity of non-inventoried items on
an order received but not invoiced

9

Detail.OrderQty
Detail.OrderStatus

Detail.OriginalUnitCost

Detail.ParentSeq

Detail.Period
Detail.PostedQty

Detail.SaleUnit

Detail.SecurityLevel

Detail.SerialNumber
Detail.Statement

Detail.StockCode

Detail.StockLocation
Detail.StockQty

Detail.Sort

Detail.TaggedText
Detail.Tax

Detail.TaxCode
Detail.TransactionType

N
B

N

N

N
N

A

N

N
N

T

T
N

N

T
N

A

The original order quantity for an order
0 if not shipped or part shipped, 1 if fully
shipped
The unit cost of an inventoried item
before the transaction was posted
(available for some lines involving stock
replenishment)
The sequence number of the parent
transaction
Same as the transaction Period field
For stock purchase transactions, the buy
quantity adjusted for the product
conversion factor, gives the qty in sell
units, which is the posted qty.
For product transaction detail lines, this
is the selling unit of measure as copied
from the product record.
The security level of the line (inherited
from the account's security level)
The items's serial/batch number
The sequence number for the
reconciliation record for which this detail
line was reconciled. It is normally only
used for detail lines which specify a bank
account. If the item is not yet reconciled
it contains a 0 (or a -1 if the
reconciliation has been saved but not
finalised).
The product code for the detail line. This
will be blank if the transaction is a
service-type transaction.
The item's location
The quantity of the product specified by
Detail.StockCode that is being purchased
or sold. The units correspond to either
the buyUnits for the product or the
SellUnits for the product depending on
whether this is a purchase (CP/CI) or a
sale (CR/DI) transaction.
The order of the detail lines as displayed
in a transaction.
Scriptable tag storage
The tax (GST, VAT etc) amount of the
detail line.
The tax code of the account.
The first two characters of the
transaction type (i.e. CP, CR, CI, DI, JN,

3

19

15

255

5
Appendix A—Field Descriptions

Detail.UnitPrice

Detail.UserNum
Detail.UserText
DueDate
Emailed
EnterDate

EnteredBy

ExchangeRate

Flag
Flags
FreightAmount
FreightCode
FreightDetails
Gross
Hold
LastModifiedTime

MailingAddress

NameCode
OrderDeposit
OrderShipped
OrderTotal
OriginatingOrderSeq

OurRef

PayAmount

N

N
T
D
N
D

A

N

T
N
N
T
T
N
B
S

T

T
N
N
N
N

T

N

255

3

5

15
255

255

11

11

PO, SO, QU)
For a purchase, this is the same as the
cost price. For a sale, this is the unit
selling price of the product exclusive of
GST and discount.
Scriptable number
Scriptable text
The date on which payment is due
Non zero if transaction has been emailed
The date on which the transaction was
entered.
Initials of user who entered the
transaction
The exchange rate (0 for base currency
transactions)
The flag field.
See Transaction Flags table below
Freight amount of order
Freight code used for orders
Details of freight for order
The gross value of the transaction.
True if the transaction is on hold
The date that the transaction was last
changed.
Transaction's mailing address. Blank if
default from name.
Customer or Supplier Code
The accumulated deposit on an order
The amount shipped of an order
The total of the order
The sequence number of the order that
created the invoice through the ship or
receive goods commands
The reference number of the transaction.
For Cash Payments, this is the cheque
number. For Cash Receipts it is the
receipt number. For Debtor Invoices, it is
the invoice number and for Creditor
Invoices it is your order number. For
Journals, it is the Journal number,
prefixed with the type of journal (JN for
general journal, JS for stock journal, BK
for banking journal).
The amount of the invoice that you have
elected to pay a creditor in the next

PaymentMethod

Period

PostedBy

Printed
ProdPriceCode
PromptPaymentAmt

PromptPaymentDate

Recurring

SalesPerson

SecurityLevel

SequenceNumber
SpecialAccount

SpecialBank

SpecialBranch
Status

TaggedText
TaxAmount

TaxCycle
N

N

A

N
T
N

D

B

T

N

N

T

T
N

N

payment run.
The payment method for the transaction
(0 = None, 1 = Cash, 2 = Cheque, 3 =
Electronic, 4 = Credit Card, 5-7 = user
defined)
A number representing the period of the
transaction. This number will be (100 *
year_number + period_number), where
year_number is a number in the range
0-99, with year 1 being the first year of
operation for your MoneyWorks
document, and period_number is a
number in the range 1-12, with 1
representing the first period of your
financial year.
Initials of user who posted the
transaction
0 if not Printed; 1 if Printed
Pricing code (A--F)
The amount of the eligible prompt
payment discount
The date the prompt payment discount
expires
"True" if the transaction is a recurring
transaction. "False" if it isn't.
The salesperson for the transaction. If
the transaction involves any products
with the "Append Salesperson" attribute
set, the value of this field will be
appended to that products sales and/or
cost of goods account code.
The transaction's security level. This is
set to the highest security level of the
visible detail lines.
The sequence number of the transaction.
For receipts, the bank account of the
cheque
For receipts, the bank number of the
cheque
For receipts, the branch of the cheque
This will be either a "U" (for unposted) or
"P" (for posted).
Scriptable tag storage
The amount of GST involved for the
transaction.
A number representing the GST cycle in
which the transaction was processed for

3

1

5

1

255



GST. This is 0 for transactions not yet
processed for GST.
For debtor invoices, the customer's
Order No. For creditor invoices, the
supplier's invoice number. For receipts,
the cheque number
Date and time transaction is posted.
For a payment, the To field. For a receipt,
the From field.
The transaction date.
Non zero if transaction has been sent as
eInvoice
The transaction type.--see following
table.
User defined
User defined
User defined
User defined
User defined
User defined
User defined
User defined
Scriptable number
Scriptable text

Appendix A—Field Descriptions

TheirRef

T

21

TimePosted
ToFrom

TransDate
Transferred

Type

User1
User2
User3
User4
User5
User6
User7
User8
UserNum
UserText

S
T

D
N

T

T
T
T
T
T
T
T
T
N
T

200

3

255
255
255
15
15
15
15
15

255

The transaction type codes are:

Code Description
CIC
CII
CP
CPC
CPD
CR
CRC
CRD
DIC
DII
JN
JNS
POC
POI
QU

Creditor invoice--fully paid
Creditor invoice--incomplete
Cash payment/purchase
Cash payment for a creditor invoice
Returned refund to debtor
Cash receipt/sale
Receive refund from creditor
Receipt for a debtor invoice
Debtor invoice--fully paid
Debtor invoice--incomplete
General journal
Stock journal
Purchase order (complete) = Bought
Purchase order (incomplete)
Quote

SOC
SOI

Sales order (complete) = Sold
Sales order (incomplete)

Transaction Flags

Use TestFlags() to determine flags.

Was Cancelled
Is Cancellation
Was Written Off
Creditor Reimburse
Debtor Reimburse
Printed
Is WriteOff Dummy
Is Contra Dummy
Journal Type (3 bits)
General = 0; Make = 1;
Break = 2; WriteOff = 4;
Create = 5; Transfer = 6;
Revaluation = 7.
Not On Statement
Is Banking Journal
Is a recurred transaction
(from version 9.1.6)

Detail Flags

0x00000001
0x00000002
0x00000004
0x00000008
0x00000010
0x00000020
0x00000040
0x00000080
0x00000700

0x00002000
Is Job Invoice
0x00004000
Changed After Posting
0x00008000
Prompt Discount Taken
0x00010000
Funds Xfer
0x00020000
Is Discount Credit Note
0x00040000
Is Writeoff Credit Note
0x00080000
Is New Style Sales Tax
0x00100000
Has Scan
Has Outstanding Stock Receipts 0x00200000

0x00000800
0x00001000
0x08000000

PPD Terms Locked
Is Deposit on Order
Imported transaction
(from version 9.1.6)

0x00400000
0x00800000
0x01000000

Flags for detail lines are contained in two fields, detail.flags and
detail.moreFlags. Use TestFlags() to determine flags.

detail.flags
0x8000
System line
0x4000
Stock Journal Line
0x2000
Banking Journal Bank Line
0x1000
Banking Journal Holding Line
0x0008
Tax Line
0x0004
Product Price is Tax Inclusive
Freight Item
0x0002
Dept in account is salesperson 0x0001
detail.moreFlags
Requires serial number

0x0001

0x0100
Line is a foreign currency
0x0200
Balancing line for above
0x0400
Balancing line for contra
0x0800
Stock is ignored (for jobs)
0x0010
Tax line added by tax override
Is time item
0x0020
Prompt Payment Discountable 0x0040

Batch expires

0x0004
Appendix A—Field Descriptions

Requires batch number

0x0002

Names

Internal name Name.

Field
ABUID

Type Size
S

Account Name

Address1
Address2
Address3
Address4
Afterhours
Afterhours2
Bank
BankAccountNumber

BankBranch
Category1
Category2
Category3
Category4
CCurrent
Code

Colour

Comment
Contact
Contact2
CreditCardExpiry
CreditCardName
CreditCardNum
CreditLimit
CreditorTerms

Currency

T

T
T
T
T
T
T
T
T

T
T
T
T
T
N
T

N

T
T
T
T
T
T
N
N

T

21

59
59
59
59
11
11
7
23

21
15
15
15
15

11

Notes
Mac Address Book Universal ID--set for
imported address book entries only
The bank account name (e.g. XYZ Trading
Company)
Mailing Address (first line)
Mailing Address (second line)
Mailing Address (third line)
Mailing Address (fourth line)
After hours phone number for contact 1
After hours phone number for contact 2
The customer's bank (e.g. BNZ)
The bank account number of the name, as
supplied by their bank
The bank branch (e.g. Main St.)
User defined
User defined
User defined
User defined
For a creditor, the current balance.
The name code. For non-sundries, only the
first ten characters are used.
The colour, represented internally as a
numeric index in the range 0-7 but rendered
as a textual colour name

1020 A comment
25
29
5
19
19

Contact person 1 in the company
Name of contact person 2
Expiry date of credit card
Name on credit card
Credit card number
The credit limit for a debtor
If > 0, within N days; if < 0, Nth day of month
following
Currency of customer/supplier (blank if
local)

3

Custom1
Custom2
Custom3
Custom4
Custom5
Custom6
Custom7
Custom8
CustomerType

CustPropmtPaymentDiscount
CustPromptPaymentTerms

D30Plus

D60Plus

D90Plus

DateOfLastSale
DBalance

DCurrent

DDI
DDI2
DebtorTerms

Delivery1
Delivery2
Delivery3
Delivery4
DeliveryPostcode
DeliveryState
Discount
EInvoiceID

email
email2
Fax
Flags
Hold

T
T
T
T
T
T
T
T
N

N
N

N

N

N

D
N

N

T
T
N

T
T
T
T
T
T
N
T

T
T
T
N
B

255
255
15
15
15
15
15
15

19
19

59
59
59
59
12
4

31

80
80
19

For your own use
For your own use
For your own use
For your own use
For your own use
For your own use
For your own use
For your own use
0 for not a customer, 1 for customer, 2 for
debtor
Prompt payment discount percentage
0 for no prompt payment; > 0 for within N
days; < 0 for by Nth date of following month
Debtor 30 day balance (1 cycle of manual
ageing).
Debtor 60 day balance (2 cycles of manual
ageing).
Debtor 90 days+ balance (3 cycles of manual
ageing).
Date of last invoice or cash sale
Sum of D90Plus, D60Plus, D30Plus and
DCurrent
For a debtor, the current balance. The total
balance for the debtor is the sum of all the
balance fields.
Direct dial number for contact 1
Direct dial number for contact 2
If > 0, within N days; if < 0, Nth day of month
following
Delivery address (first line)
Delivery address (second line)
Delivery address (third line)
Delivery address (fourth line)
Postcode/zipcode of delivery address
Sate of delivery address
Discount field for a customer
The ID to use for the customer when
eInvoicing using a Peppol Access Point (e.g.
ABN in Australia, NZBN in New Zealand)
email address for contact 1
email address for contact 2
Facsimile number
See Names Flags table below
"True" if the debtor is on hold ("False"
Appendix A—Field Descriptions

Kind

LastModifiedTime
LastPaymentMethod

Memo
Memo2
Mobile
Mobile2
Name
PayAccount

PaymentMethod

Phone
Position
Position2
PostCode
ProductPricing
RecAccount

ReceiptMethod

Role

Role2

SalesPerson

Salutation
Salutation2
SplitAcct1
SplitAcct2
SplitPercent

State
SupplierType

N

S
N

T
T
T
T
T
T

N

T
T
T
T
T
T

N

N

N

T

T
T
T
T
N

T
N

SuppPromptPaymentDiscount N

SupplierPromptPaymentTerms

255 Memo/notes for contact 1
255 Memo/notes for contact 2
14
13
255
7

otherwise)
The kind of Name. 0 for a template, 1 for a
normal
Date and Time the record was last modified
PaymentMethod used in previous
transaction

Mobile phone number for contact 1
Mobile phone number for contact 2
Name of company
The Accounts Payable control account code
for a creditor.
Payment method (0 = None, 1 = Cash, 2 =
Cheque, 3 = Electronic, etc).
Phone number
Position of contact person 1
Position of contact 2
Post code
Pricing level for customer. (A-F)
The Accounts Receivable control account
code for a debtor.
Preferred payment method of customers. 1 =
Cash, 2 = Cheque etc.
Roles for contact 1. This is a bit mapped
field, with each bit representing a role.
Roles for contact 2. This is a bit mapped
field, with each bit representing a role.
Code for salesperson for client--
automatically copied to the
transaction.salesperson field.
Salutation for contact 1
Salutation for contact 2
Account code for first split account
Account code for remainder split account
Percent of allocation to be put into
SplitAcct1
State (for postal address)
0 for not a supplier, 1 for supplier, 2 for
creditor
Percentage amount of prompt payment
discount offered by supplier
0 for no prompt payment; > 0 for within N
days; < 0 for by Nth date of following month

19
29
29
11
1
7

5

39
39
13
13

3

TaggedText
TaxCode
TaxNumber

TheirRef

UserNum
UserText
WebURL

Name Flags

T
A
T

T

N
T
T

255
5
19

15

255
63

Scriptable tag storage
Tax code override
Their tax number (GST#, VAT#, ABN etc,
depending on country)
The reference code by which the supplier or
customer refers to your company.
User defined
User defined
Web URL

Use TestFlags(), Setflag(), and ClearFlag() functions for flags.

Requires order number

0x0001

Contacts

Internal name Contacts

The Contacts table is a subfile of the Name table.

19
39
19
63

Contact's after hours number
Contact's name
Contact's direct dial
Contact's email address
Date and Time the record was last modified

255 Memo/notes on contact
Contact's mobile number
19
The order of the contact
Sequencenumber of the Name record for the contact
Contact's position
Roles for the contact. This is a bit mapped field, with each bit
representing a role.
Contact's salutation

39

39
255 Scriptable tag storage

Scriptable number

255 Scriptable text

T
AfterHours
T
Contact
T
DDI
eMail
T
LastModifiedTime S
T
Memo
T
Mobile
N
Order
N
ParentSeq
T
Position
N
Role

Salutation
TaggedText
UserNum
UserText

T
T
N
T
Appendix A—Field Descriptions

Products (Items)

Internal name Product

Field
BarCode

Build....
BuyPrice

Type Size
T

19

N

BuyPriceCurrency
BuyUnit

T
T

3
5

BuyWeight
Category1
Category2
Category3
Category4
Code
COGAcct

Colour

Comment
ConversionFactor

CostPrice

Custom1
Custom2
Custom3

N
T
T
T
T
T
T

N

T
N

N

T
T
T

Notes
The item's barcode. This can be used in transaction entry
instead of the product code
Subfile: Refer to Build file
The undiscounted buy price of one buy unit of the item
(in the currency of the purchase). This is updated
automatically by MoneyWorks if "Update price whenever
purchased" option is on
The currency of the last purchase of the item
The units in which you buy the product. e.g. "ea", "kg",
"ml", "dz". If the buy units are different from the sell
units, you must supply a scalar conversion factor in the
ConversionFactor field that will convert from buy units to
sell units.
The weight/volume of the buy unit of the item
Any value. This can be used for analysis purposes.
Any value. This can be used for analysis purposes.
Any value. This can be used for analysis purposes.
Any value. This can be used for analysis purposes.
The product code.
Cost Of Goods account. If you only buy the product, this
is the Expense account that is debited each time you
purchase this product. If you stock and sell the product,
this account is debited when you sell the product.
The colour of the product record (not necessarily of the
actual product), represented internally as a numeric
index in the range 0-7 but rendered as a textual colour
name

15
15
15
15
31
13

1020 Any additional information about the product.

This is used to calculate the number of sell units that
equate to one buy unit. When you purchase product, the
quantity purchased is divided by this conversion factor to
calculate the number of selling units of stock on hand.
Note that the reciprocal of the conversion factor is
displayed on the product entry screen.
The standard cost of the item. For purchased items, this
is the purchase price (adjusted for discount if any)
converted to the base currency.
For your own use
For your own use
For your own use

255
255
15
Custom4
Custom5
Custom6
Custom7
Custom8
Description
Flags
Hash

JobPricingMode

LastModifiedTime
LeadTimeDays
MarginWarning

MinBuildQty

NormalBuildQty
Plussage

T
T
T
T
T
T
N
N

N

S
N
N

N

N
N

N
QtyBreak1
N
QtyBreak2
N
QtyBreak3
QtyBreak4
N
QtyBrkSellPriceA1 N

QtyBrkSellPriceA2 N

QtyBrkSellPriceA3 N

QtyBrkSellPriceA4 N

QtyBrkSellPriceB1 N

QtyBrkSellPriceB2 N

QtyBrkSellPriceB3 N

QtyBrkSellPriceB4 N

15
15
15
15
15
255

For your own use
For your own use
For your own use
For your own use
For your own use
The name of the product.
See Product Flags table below
For fast searching of products by buy/sell/stock. A bit is
set for each status: If buy, #0002; if sell, #0004, if
inventory, #0008, Thus all inventoried items will have
Hash >= 8.
Sell price determinator for job costing: 1 = Use Product
Sell Price, 2 = Apply Job Markup to Standard Cost, 3 =
Use Undiscounted Purchase Price
Date and Time the record was last modified
The expected lead time e for the delivery of the product
The minimum margin/markup level for the product
below which to show a warning on the Selling Price
screen
The minimum build quantity--items must be built in
multiples of this
The normal build/reorder quantity
Amount to add to the purchase price for margin
calculations within the product sell matrix. Not included
in the costs maintained by MoneyWorks
Quantity at which the first break price is used
Quantity at which the second break price is used
Quantity at which the third break price is used
Quantity at which the fourth break price is used
The A sell price, if the quantity is greater than or equal to
QtyBreak1
The A sell price, if the quantity is greater than or equal to
QtyBreak2
The A sell price, if the quantity is greater than or equal to
QtyBreak3
The A sell price, if the quantity is greater than or equal to
QtyBreak4
The B sell price, if the quantity is greater than or equal to
QtyBreak1
The B sell price, if the quantity is greater than or equal to
QtyBreak2
The B sell price, if the quantity is greater than or equal to
QtyBreak3
The B sell price, if the quantity is greater than or equal to
QtyBreak4



13

5

13

Appendix A—Field Descriptions

ReorderLevel

SalesAcct

SellDiscount

N

T

N

SellDiscountMode N

SellPrice

SellPriceB
SellPriceC
SellPriceD
SellPriceE
SellPriceF
SellWeight
SellUnit

StockAcct

StockOnHand

N

N
N
N
N
N
N
T

T

N

StockTakeNewQty N

StockTakeStartQty N

StockValue
Supplier

SuppliersCode

TaggedText
Type

N
T

T

T
T

UseMultiplePrices B
N
UserNum
T
UserText

11

19

255
1

255

The stock level at which a reordering warning should be
given. (in selling units)
The Income account that is credited whenever the
product is sold.
The percentage discount. This is used only if the discount
mode is 1 or 3
A number representing the discount mode as selected in
the discount mode pop-up menu in the product entry
window. 1=None; 2 = by customer; 3 = by product;
4=Add
The "A" sell price at which you sell the product. This is
GST exclusive and exclusive of any discount that you may
apply.
The B sell price (before GST and discounts)
The C sell price (before GST and discounts)
The D sell price (before GST and discounts)
The E sell price (before GST and discounts)
The F sell price (before GST and discounts)
The weight/volume of one sell unit
The units in which you sell the product. e.g. "ea", "kg",
"ml", "doz"
The Current Asset account that is debited whenever you
buy a product that you stock and is credited whenever
you sell it.
The total number of items of stock of the product that
you have on hand. This is represented in the selling units
for the product. Use the SOHForLocation(location)
function for the stock at a given location
The total entered stock count for a stock take. Use the
StocktakeNewQtyForLocation(location) function for the
entered stock count at a given location
The total stock on hand when a stock take is
commenced. Use the
StockTakeStartQtyForLocation(location) function for the
commencing stock at a given location
The value of the stock on hand (based on purchase cost)
The supplier code of your usual supplier. If present, this
should be the code of a supplier in the names list.
The product code that your usual supplier uses to refer
to the product.
Scriptable tag storage
P = product; R = resource; T = time; S = ship method;
O=other.
True if using multiple sell prices
User Defined
User Defined

Product Flags

Use TestFlags(), Setflag(), and ClearFlag() functions for flags.

We buy it
We sell it
We inventory it
Job Cost is Tax Inclusive
Append Salesperson -
Expense
Append Salesperson - Sales
Price Break on Additional
Units
Reorder Warning
Price A is Tax Inclusive
We Build it
Auto-Build Item
Price B is Tax Inclusive

0x00000002
0x00000004
0x00000008
0x00000010
0x00000020

Price C is Tax Inclusive
Price D is Tax Inclusive
Price E is Tax Inclusive
Price F is Tax Inclusive
Price D is Cost Plus

0x00000040
0x00008000

Price E is Cost Plus
Price F is Cost Plus

0x00000100
0x00000200
0x00000400
0x00000800
0x00000001

Price D is Discount
Price E is Discount
Price F is Discount
Do not update Buy
Item has serial number
Item has batch/lot
number
Batch/lot expires

0x00000080
0x00001000
0x00002000
0x00004000
0x00010000

0x00020000
0x00040000

0x00080000
0x00100000
0x00200000
0x00400000
0x01000000
0x02000000

0x04000000

Inventory

Internal name Inventory

The inventory table is a subfile of Product, and stores the stock on hand of an
item for each serial/batch and location combination.

Expiry
Identifier
LastModifiedTime
Location
ProductSeq

D
The expiry date for expiring batches
31 31 The serial/batch number of the item
S
T
N

15 The location

Date and time the record was last altered

The sequencenumber of the product master record for the
item
The qty (stock on hand) of the item at this location. Use the
SOHForLocation(location) function for the stock at a given
location.
The total entered stock count for a stock take. Use the
StocktakeNewQtyForLocation(location) function for the stock
at a given location.
The total stock on hand when a stock take is commenced. Use

Qty

N

StockTakeNewQty N

StockTakeStartQty N
Appendix A—Field Descriptions

Jobs

Internal Name Job.

the StocktakeStartQtyForLocation(location) function for the
stock at a given location.

Field
Billed
Category1
Category2
Category3
Category4
Client

Code
Colour

Type Size
N
T
T
T
T
T

15
15
15
15
11

9

T
N

Notes
The amount billed to date for the job.
Any value. This can be used for analysis purposes.
Any value. This can be used for analysis purposes.
Any value. This can be used for analysis purposes.
Any value. This can be used for analysis purposes.
The code of the client for whom the job is being done.
Must be a debtor.
The job code.
The colour, represented internally as a numeric index in
the range 0-7 but rendered as a textual colour name

T
Comment
T
Contact
T
Custom1
T
Custom2
T
Custom3
T
Custom4
T
Custom5
T
Custom6
T
Custom7
T
Custom8
T
Description
EndDate
D
LastModifiedTime S

T
Manager
N
Markup
T
OrderNum
PercentComplete N
T
Phone
T
Project
N
Quote
D
StartDate
A
Status

1020 Comments on the job
The contact for the job
63
For your own use
255
For your own use
255
For your own use
15
For your own use
15
For your own use
15
For your own use
15
For your own use
15
For your own use
15
The job name.
255
The expected end date
The date that this job record was last changed.
Transactions related to the job do not change the
modification date of the job record
The manager for the job
The percent markup applied to items used on the job.
The client's order number for the job
Percent that the job is complete
The contact's phone number
Job code of project to which this belongs
The amount quoted for the job.
The start date of the job
The status of the job. "QU" for quoted, "OP" for active,

19
9

31

3

2

TaggedText
TargetDate
UserNum
UserText

"CO" for complete
Scriptable tag storage
Target date for job
User defined
User defined

255

255

T
D
N
T

Job Sheet Items

Internal name JobSheet.

Field
Account
ActivityCode
Analysis
Batch

Colour

Comments
CostCentre
CostPrice
Date
DateEntered
DestTransSeq

EnteredBy
Flags

N

T
T
N
D
D
N

T
N

Job
T
LastModifiedTime S
T
Memo
N
Period

Type Size Notes
T
T
T
N

7
9
9

The general ledger expense code for the resource
A free-form activity code
The analysis field
For jobsheets entered using a Timesheet, the
sequencenumber of the first jobsheet created when the
Timesheet is accepted. This forms a unique batch number
to identify all jobsheets entered on that time-share.
The colour, represented internally as a numeric index in
the range 0-7 but rendered as a textual colour name

255 General comments on the entry
5

The cost centre for which the resource was used
The cost price of the resource used.
The date the resource was used
The date the job sheet item was entered.
The sequence number of the invoice on which this item
was billed out.
User who entered the job sheet record
Accessible via the Testflags function. 1 = Time, 2 =
Material
The job code.
The date that this job sheet item record was last changed.

3

9

255 A description of the job sheet item.

A number representing the period of the job sheet item.
This is determined automatically by the Date field, and is
stored in the same manner as the period field in the
transaction file.
The quantity of the resource used
The code of the resource
The estimated sell value of the resource used, based on
the job markup.
Serial/Batch number of the item
The sequence number of the originating transaction

Qty
Resource
SellPrice

SerialNumber
SourceTransSeq

N
T
N

T
N

19

31
Appendix A—Field Descriptions

Status

StockLocation
TaggedText
TimeProcessed
Type
Units
UserNum
UserText

A

T
T
S
A
T
N
T

2

15
255
15
2
3

255

The status field. "PE" if the item is pending (unbilled), "PR"
if it is processed, "BU" if it is a budget entry.
The location of the item
Scriptable tag storage
Timestamp for when the job sheet was processed
The type of entry. "IN" for income, "EX" for expense.
The units of resource used.
Scriptable number
Scriptable text

Reconciliation File

The reconciliation file (internal name _recon) stores details of each
reconciliation. The sequence number of the corresponding reconciliation is used
in the detail.statement field.

8

Type Size Notes
Field
T
Account
N
Closing
D
Date
Discrepancy
N
LastModifiedTime S
T
Opening
N
Statement
S
Time

5

The account code that was reconciled.
The closing balance
Statement Date
Discrepancy in reconciliation
The date and time that this record was last changed.
The opening balance.
Statement number
Date and time of reconciliation

Allocation File

The allocation file (internal name AutoSplit) stores details of the auto-allocation
breakdowns used in the bank statement import and the Auto-Allocation
command.

Type Size Notes

Field
LastModifiedTime S
T
MatchFunction
T
MatchName
N
Priority
T
SplitAcct1
T
SplitAcct2
T
SplitAcct3
T
SplitAcct4

The date and time that this record was last changed.
The matching text/function that involves the split
The name of the rule
Priority of the rule
The first split account
The second split account
The third split account
The fourth split account

255
11

13
13
13
13

SplitAmount1
SplitAmount2
SplitAmount3
SplitMode

N
N
N
N

Percent or amount to allocate to first split account
Second split amount to allocate
Third split amount to allocate
The type of split

Build File

The build file (internal name Build) stores the recipes for the products.

Type Size Notes

Field
LastModifiedTime S
T
Build.Memo
N
Build.ProductSeq

The date and time that this record was last changed.

255 Memo for the component

The sequence number of the Product record to which the
recipe belongs
Quantity of component required
Code of component

Build.Qty
Build.PartCode

N
T

19

Asset Categories

Internal name assetcat.

Field
Code
Description
AssetAccount
DepExpense
AccumDep
GainLoss
Custom
Group
Type
Impairment

Rate
RevalSurplus

Type Size Notes
T
T
T
T
T
T
T
T
T
T

7
63
13
13
13
13
39
7
3
13

N
T

13

13
13

255

Unique code for the category
Description of category
The fixed asset account
Depreciation expense account
Accumulated depreciation account
Account for gain/loss on asset disposal
For your own use
For your own use
Default depreciation type, SL or DV
An expense account for asset impairment (when assets
are revalued down)
Default depreciation rate
An equity (shareholder funds) account for upwards
revaluations
Account for private portion gain/loss on sale
Account for private portion depreciation
Scriptable number storage
Scriptable text storage
Date of last depreciation run for category

T
GainLossPrivate
T
DepExpensePrivate
N
UserNum
UserText
T
LastDepreciatedDate D
Appendix A—Field Descriptions

TaggedText
Comment

T
T

255
Scriptable tag storage
255 Comments on the category

Assets

Internal name Asset.

Field
Code
Description
Category
SerialNum
Qty

Type Size Notes
T
T
T
T
N

19
63
7
31

A unique code for the asset
The description of the asset
The Asset Category of the asset
A serial number for the asset
The quantity of the asset (normally 1, but might be a
set of similar assets such as desks)
The expected life in years of the asset
The cost (per unit) of the asset
The accumulated depreciation recorded against the
asset
Date on which the asset was acquired
Date on which the asset was last depreciated
The sequencenumber of the purchase transaction
for the asset
The sequencenumber of the last disposal transaction
for the asset

15 Where the asset is kept
5

3

3

255

The asset department (must be a MoneyWorks
Department)
The percent of the asset used privately
The asset status (NEW, ACT - active, NDP - non-
depreciable, OTH - other, DSP - disposed)
User who last modified the asset record
Date of last revaluation (blank if none)
Expected residual value
Total revalued amount (positive if surplus)
Scriptable number
Scriptable text
Total adjustments to accumulated depreciation due
to revaluations
The current book value
Date last disposed
The gain or loss on asset disposal
Colour of record

ExpectedLife
Cost
AccumDepreciation

AcquisitionDate
LastDepreciatedDate
AcquisitionSeq

DisposalSeq

Location
Dept

PrivateUsePercent
Status

N
N
N

D
D
N

N

T
T

N
T

T
LastModifiedBy
D
LastRevaluedDate
ExpectedResidualValue N
RevalSurplusImpairAmt N
N
UserNum
T
UserText
N
AccumDepnAdj

BookValue
DisposalDate
GainLossOnDisposal
Colour

N
D
N
N

TaggedText
Type

Rate
Comment
Custom1
Custom2
Custom3
Custom4

Assetlog:

T
T

N
T
T
T
T
T

255
3

Scriptable tag storage
Depreciation type, SL (straight line) or DV
(diminishing value)
Depreciation rate

255 Comments on asset
255
255
255
255

For your own use
For your own use
For your own use
For your own use

Associated with each asset is the assetlog subfile, which is a log of each action
(depreciation, revaluations etc) in the life of the asset.

Field
ParentSeq
Action

Type Size Notes
N
T

3

Sequencenumber of asset
Type of action: AA - acquisition, AD - disposal, AP - part
disposal, DS - straight line depreciation, DD - diminishing
value depreciation, ME - memo, RV - revaluation
Date of action
Quantity
Depreciation due to action
Adjustments
Adjustments
Depreciation rate used
Private use percent
Accumulated depreciation after action
Accumulated revaluation after action
Book value after action
Sequencenumber of transaction associated with action

255 User memo

D
Date
N
Qty
N
Depreciation
N
Adjustment1
N
Adjustment2
N
Rate
PrivateUsePercent
N
AccumDepreciation N
N
AccumReval
N
ClosingValue
N
TransactionSeq
T
Memo

Memo File

This file (internal name Memo) stores the memo records for the names file.

Type Size Notes

Field
LastModifiedTime S
N
Memo.NameSeq

The date and time that this record was last changed.
The sequence number of the Name record to which the
memo belongs
Date of memo

Memo.Date

D
Appendix A—Field Descriptions

Memo.RecallDate D
T
Memo.Text

Date of reminder
The memo text

255

Tax Rate

The tax rate file (internal name TaxRate) stores the tax rates.

Type Size Notes

Field
LastModifiedTime S
T
TaxCode
T
PaidAccount
T
RecAccount
Date
D
Combine
CombineRate1
CombineRate2
GSTPaid
GSTReceived
NetPaid
NetReceived
Rate1
Rate2
UserNum
UserText
TaggedText

N
N
N
N
N
N
N
N
N
T
T

The date and time that this record was last changed.
The tax code
The control account for GST paid out under this rate
The control account for GST received out under this rate
Tax rate changeover date
Flags (how 2nd tier tax is combined)
2nd tier rate used before changeover date (PST)
2nd tier rate used after changeover date (PST)
Total GST paid for taxcode in last GST finalisation
Total GST received for taxcode in last GST finalisation
Net paid for taxcode in last GST finalisation
Net received for taxcode in last GST finalisation
Rate used before changeover date
Rate used on or after changeover date
Scriptable number
Scriptable text
Scriptable tag storage

5
7
7

255
255

Offledgers and Currency

N

...Budget29
BudgetNext01 ...
BudgetNext18
T
LinkedAccountU
LinkedAccountR
T
PreferredBankCR T
PreferredBankCP T
N
UserNum
T
UserText
T
TaggedText

period, Budget01 is the previous period, etc.
19 periods of future budgets. BudgetNext01 is the budget
for next period, BudgetNext02 for the subsequent, etc.
The currency unrealised gain general ledger account
The currency realised gain general ledger account
Preferred bank receipts account for currency
Preferred bank payments account for currency
Scriptable number
Scriptable text
Scriptable tag storage

13
13
7
7

255
255

Payments File

This file (internal name Payments) is the many-to-many link between invoices
and their associated payment transaction(s), and vice versa.

Type Size Notes

Field
LastModifiedTime S
N
CashTrans
N
InvoiceID

Amount

GSTCycle

Date

N

N

D

The date and time that this record was last changed.
The sequencenumber of the payment/receipt
The sequence number of the invoice that is being paid.
For a debtor overpayment (where no invoice is available)
this stores the sequencenumber of the namecode, with
the high bit set, making it negative (add 2147483648 to it
to get the namecode sequencenumber).
The amount of the receipt that was allocated to the
invoice
The tax cycle when the receipt was processed for GST/
VAT/Tax by the GST Report. This will be negative if
processed on an invoice/accruals basis.
The receipt date

The offledger and currency information is held in this file (internal name
OffLedger). Note that a different naming convention was using in MoneyWorks 6
and earlier.

Use a relational search to easily locate the payments associated with an invoice
(or vice versa). For example:

Field
Kind

Name
Description
Balance00 ...
Balance90

Budget00

Type Size Notes
T

3

Kind of record: ‘CUR' is currency, ‘USR' is user created
offledger record.
The name of the currency/offledger record
Description of currency/offledger record
90 periods of historic values. Balance00 is the current
period, Balance01 is the previous period, and Balance90 is
90 periods ago.
30 periods of historic budgets. Budget00 is the current

15
39

T
T
N

N

[transaction:ourref=`10`][payments.invoiceID][payments.cashtrans]

[transaction]

will find all payments against invoice number "10" (in fact all invoices numbered
"10", so the transaction search would need to be more tightly specified).
Appendix A—Field Descriptions

User File

This file (internal name User) is available for scripts to store persistent user data
See also the User2file.

Type Size Notes

Field
LastModifiedTime S
T
Key

9

Data

T

245

The date and time that this record was last changed.
A unique key to identify the record. Note that many
plug-ins use their own set of keys, so you need to
manage any conflicts.
text data for the key

Records can be inserted into the table by importing them, either as XML or with
the pseudo-map ":/User", or using the SetPersistentfunction (see the
mwScripting reference guide). The first field is the key, and the second
(separated by a tab) is the data. If the key already exists in the table, the record
will be overwritten (otherwise a new record will be created), unless the data is
empty, in which case the existing record will be deleted.

User2 File

This file (internal name User2) is, like the User file, available for scripts to store
persistent user data. It has the advantage that it has a much longer key, dates
and numbers can be stored (and hence searched) in native format, and data can
be segmented by the use of the devkey field, reducing the likelihood of key
clashes by different scripts and plug-ins.

Type Size

Field
LastModifiedTime S
N
DevKey

Key

Int1
Int2
Float1
Float2
Date1
Date2

28

T

N
N
N
N
D
D

Notes
The date and time that this record was last changed.
An unsigned integer greater than #FFFF (65,535)--lower
valued keys are reserved for plug-ins and must be pre-
allocated by Cognito.
A unique key to identify the record. Use this in
conjunction with a (pre-allocated) DevKey to ensure your
own storage
A signed integer
A signed integer
A floating point number
A floating point number
A date
A date
Text1
Text2
Text
Int3
Int4
Float3
Float4
Date3
Date4
Text3
Text4
TaggedText

T
T
T
N
N
N
N
D
D
T
T
T

Text
255
255
Text
1020 Text

A signed integer
A signed integer
A floating point number
A floating point number
A date
A date
Text
Text
Storage for tagged text

255
255
255

Records can be inserted into the table by importing them, with the pseudo-map
":/User2" or as xml, or using the SetPersistent function. For the psuedo-map,
the data is tab-delimited, with devkey and key being the first two fields and the
subsequent fields listed in the order above. Apart from the two key fields, the
other fields are optional, and any fields not present will be treated as empty and
set to zero or equivalent. If the record exists, it is entirely rewritten, meaning
you cannot update individual fields. If only the DevKey and the Key are present,
and all other fields are missing, the existing record (if any) is deleted (if it
doesn't exist it is created).

Login File

This file (internal name Login) contain information on user login and privileges.

31
63

Type Size Notes
Field
T
Category
T
Email
S
Flags
Initials
3
LastModifiedTime S
T
Name
T
Password
T
Privileges
T
Role
N
SecurityLevel
T
TaggedText
N
UserNum
T
UserText

User Category
Email of user
User Flags
The user initials.
The date and time that this record was last changed.
The name of the user
User password (encrypted)
Privilege map for user
User Role
The security level of the user
Scriptable tag storage
Scriptable number
Scriptable text

31
33
65
3

255

255



Appendix A—Field Descriptions

Simplified Schema

A note on colours and colour searching

apply to custom names.

The colour field is usually rendered as text using the custom colour name for the
field, as specified in the Document Preferences Fields tab.

As a special case, when searching using the search parser, the right hand side of
a comparison with a colour field may be any one of [the default english colour
name, the custom colour name (these can be specified for each different table
that has a colour field), or a numeric colour index]. The search parser is used for
expressions passed to functions such as CreateSelection() and Find(); the search
expression in a ForEach part in a report; or in the Advanced Find dialog. Even
then there is a caveat that this only applies if the search parser is able to
optimise the search into a series of raw single-field database queries (this
usually requires that the expression be a simple series of field comparisons
separated by ANDs or ORs (and not a mixture thereof)). In this case it will
interpret the right hand side to determine the colour index to search for and will
search the raw numeric colour field for a colour index match. If the search
expression is too complex to optimise, then the entire expression will be
evaluated per-record using the general expression parser and in that case it will
end up doing a text compare with the custom colour name because the colour
field will have been rendered as text. Note that this means that if the right hand
side is text containing a wildcard (@), the results will differ depending on
whether the search was optimised or not. In a numeric colour index search,
"B@" will be interpreted as Blue (being the first colour in a top down search of
the default colour name table that matches the given name), whereas in a
textual search, "B@" will match both "Blue" and "Brown". The same would

When deploying a report or script where the custom colour names in the
document will not be known, it is necessary to understand this distinction to be
able to use the default name or index with reliable results.

Simplified Schema

Simplified schema of MoneyWorks Database
