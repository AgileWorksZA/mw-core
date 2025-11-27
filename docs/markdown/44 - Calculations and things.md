# Calculations and things

Calculations and things

Calculations and things

You use calculation formulæ in many different places in MoneyWorks:

• In any text entry box (preceded by an “=”) for a quick calculation;
• In Advanced Find;
• In Advanced Replace;
• In report Columns, Cells and Accumulator calculations;
• In the If ... Else if report Parts;
• In Form calculation and list boxes;
• In Form Visibility, list search and copies functions;
• From AppleScript, VBScript and Visual Basic.

This section describes how to write a formula.

You can write formulæ using:

• constants or values;
• mathematical, relational (comparison), and logical operators;
• built-in functions;
• references to MoneyWorks fields (where in context);
• references to the results of other calculations on the same form or report.

You combine these components into an algebraic expression using the standard
infix notation that you learnt at school.

Constants

The simplest example of an expression is a simple constant, such as:

"A text string"
457.50
'21/2/68'
#7000000

There are four different kinds of constants —string, numeric, date and
hexadecimal constants. These are shown respectively above. Notice that a string
constant must be enclosed in double quotation marks (or inch symbols), a date
constant is enclosed in single quotation marks (or foot symbols), and a
hexadecimal constant starts with a # symbol. If the string constant were not
enclosed in quotes, the expression parser would treat each word as if it were an
identifier.

Escape sequences

To include a character in a string constant which you could not otherwise
include, you need to use an escape sequence. An escape sequence consists of a
pair of characters made from the escape character \ (backslash), followed by the
escape metacharacter for the character that you want. The metacharacters used
by MoneyWorks are " (quote or inch symbol), t, n and \. Their use is shown in
the table below:

Character
quote
tab
newline
return
backslash

Esc. Seq.
\"
\t
\n
\r
\\

Example
"He said \"Fiddlesticks\""
"Column1\tColumn2\tColumn3"
"This is line 1\nThis is line 2"
"The \r of the native"
"The backslash \\ is a special character"

As an example, to replace all commas in a string with newlines, you would use
an expression such as:

Replace(theString, ",", "\n")

As well as the double quotation marks for delimiting strings, you can use
the backquote, e.g.

Replace(theString, `,`, "\n")

Having two string delimiters means that you don’t have to use the escape
sequence for expressions that involved embedded strings.

Note: Don't confuse the backquote ` with the apostrophe ' — the latter is used

to delimit dates.



Calculations and things

Operators

Operators are symbols indicating how to combine two values or subexpressions.
They include the standard arithmetic operators (+ [addition], - [subtraction], *
[multiplication], / [division]); comparison operators (=, <>, <, >, etc...); logical (or
Boolean) operators (And, Or, Not); and the parenthesis symbols for indicating
precedence.

For example:

Transaction.Gross * 1.5

"Tax Invoice " + Transaction.OurRef

Transaction.DueDate - 5

Field References and Identifiers

Operators

Global Variables

The information entered into the company dialog box of MoneyWorks (such as
company name and address details) is available for use in any calculation (these
are also listed in Report Variables).

Additionally MoneyWorks includes a set of system variables allowing you to
enquire about the computer on which you are running and the file that is open.
The variables are reasonably self explanatory. Where the result is platform
dependent (as in a file path), examples are given. Mac users should note that
there are forms for returning HFS and POSIX paths

Variable
Address1...Address4

AgingCycle

ApplicationPath

Field names are used to include the value of a field in a MoneyWorks record
(such as the description field of a transaction record). Identifiers can be used to
include the result of another calculation, or the value of a global variable.

AppSerial
AutomationFilesFolderPath

For example:

Transaction.Description

Detail.GST

GSTNUM

Field names are usually of the form <file name>.<field name>. The transaction
fields can also be used without the preceding file specifier. For example, OurRef
instead of Transaction.OurRef. In the Advanced Find, the filename is implied, so
is not specified.

BaseCurrency
BuildNumber
CacheFolderPath

CoRegName

CurrentPer

CustomPlugInsPath

Delivery1...Delivery4

DeliveryPostcode

DeliveryState
Details/Results
the company postal address (in Show>Company
Details). Address4 holds the Country value
an integer representing the current aging cycle of
transactions. It is incremented every time the Aging
command is used.
Mac: Macintosh
HD:Applications:MoneyWorks Gold.app
Win: C:\Program Files\ MoneyWorks
Gold\ MoneyWorks Gold.exe

Your 15 character serial number
Path to the default directory for writing files from
scripts
The base currency of file
The MoneyWorks build number
The directory used by File_Open to create "CACHE/"
files
The prefix for the company registration
number(determined by locale, e.g. IRD in NZ, ACN in
Australia, IRS in USA)
The current(i.e. most recently opened) period
number
Mac: Macintosh
HD:Users:guru:Documents:MoneyWorks
Custom Plug-Ins
Win: C:\Users\Public\ Documents\
MoneyWorks Custom Plug-Ins

the company delivery address (in Show>Company
Details)
postcode of company delivery address (in
Show>Company Details)
state of company delivery address (in



Calculations and things

DetailDateColumnEnabled
DocumentName

DocumentPath

DocUUID
Email

ExtendedJobCosting
Fax
GSTCycleEndDate
GSTCycleMonths
GSTCycleNum

GSTExpensesInvoiceBasis

GSTGuideName

GSTIncomeInvoiceBasis

GstNum

GSTProcessingSuppressed
GSTRegName

Have_Logo

Initials
LastAgedDebtors
LastBackup

LastStocktake
Locale

LocaleFriendlyName

LogFilePath

Show>Company Details)
Is the Show Date Column preference turned on
Mac: Acme Widgets Gold.moneyworks
Win: Acme Widgets Gold.moneyworks
Mac: Macintosh
HD:Users:guru:Documents:Acme Widgets
Gold.moneyworks
Win: C:\Users\Public\ Documents\Acme
Widgets Gold.moneyworks

A unique identifier for the document (UUID)
general company email address (in Show>Company
Details)
true if Job Costing is turned on.
company fax (in Show>Company Details)
the date the current GS/VAT/TAX ends on
the number of months in the current GST/VAT/TAX
the current GST/VAT/TAX Cycle number
(incremented by GST/VAT/TAX report finalisation)
True if GST/VAT/TAX reporting is set to invoice basis
for expenses
The name of the GST/VAT/TAX guide report to us
(determined by locale).
True if GST/VAT/TAX reporting is set to invoice basis
for income
the company's GST/VAT/ABN number (in
Show>Company Details)
true if no GST/VAT/TAX processing
the name of the GST/VAT/TAX registration
(determined by locale)
true if a logo has been stored (in Show>Company
Details)
the initials of the current logged user.
the date the debtors were last aged
the date a backup was last taken (using File>Save a
Backup)
the date of the last stocktake
Indicates the software product, version/kind, and
localisation (the first letter is a country indicator,
which indicates the document locale). e.g. N9G
Mac: NZ
Win: NZ
Mac: /Users/guru/Library/Logs/
MoneyWorks_Gold.log
Win: C:\Users\Administrator\AppData\
Roaming\Cognito\MoneyWorks Gold\

Mobile

MultiCurrencyEnabled
Name
NavigatorActive
NetworkLatency

PeriodNames
PeriodsInYear
Phone

Platform

PlatformApplicationPath

PlatformDocumentPath1

PlatformPlugInsPathString

PlatformStandardPlugInsPath

PostCode
preferredContactRole
Print_Address

RegNum

RemittanceMessage

RemoteHost
SerialTrackingEnabled
ServerMaxConcurrent

ServerRego
StandardPlugInsPath
Field References and Identifiers

MoneyWorks_Gold.log

the company's mobile contact (in Show>Company
Details)
true is the multi-currency option is on
the company name (in Show>Company Details)
True if the navigator window is frontmost
for connected users, the network latency in
milliseconds
a comma separated list of the period names.
the number of periods in the financial year
the company's general phone number (in
Show>Company Details)
Mac: Mac
Win: Windows
Mac: /Applications/MoneyWorks
Gold.app
Win: C:\Program Files\MoneyWorks
Gold\MoneyWorks Gold.exe
Mac: /Users/guru/Documents/Acme
Widgets Gold.moneyworks
Win: C:\Users\Public\Documents\Acme
Widgets Gold.moneyworks
Mac: /Users/guru/Documents/MoneyWorks
Custom Plug-Ins
Win: C:\Users\Public\Documents\
MoneyWorks Custom Plug-Ins
Mac: /Users/guru/Library/Application
Support/Cognito/MoneyWorks Gold/
MoneyWorks 7 Standard Plug-Ins
Win: C:\Users\Administrator\AppData\
Roaming\Cognito\MoneyWorks Gold\
MoneyWorks 7 Standard Plug-Ins

(in Show>Company Details)
the last role(s) chosen when last emailing
true if the Print Address option is on the Logo
section of Show>Company Details
the company's IRD/ACN/IRS number (in
Show>Company Details)
text to appear on invoices and statements for direct
credit details (in Show>Company Details)
The name of the server the client is connected to
Is Serial Number Tracking turned on
For connected users, the maximum number of
permitted concurrent users
The serial number of the MoneyWorks server
Mac: Macintosh



Calculations and things

Field References and Identifiers

HD:Applications:MoneyWorks Gold.app
Win: C:\Users\Administrator\AppData\
Roaming\Cognito\MoneyWorks Gold\
MoneyWorks 8 Standard Plug-Ins

The next sequence number for each of the files at
the start of the session (i.e. file opened in single user
mode, or client logged in). Can be used to
implement session filters or reports. For example,
SequenceNumber >=
StartupSequenceNumTransaction would
find all transactions entered since the current user
logged in.
the state/province of the postal address (in
Show>Company Details)
true if stock location tracking is turned on
the current location for a stock take as selected in
your product list toolbar Location icon
true if a stock take has been started by not finalised
The name of the main tax (e.g. GST, HST, VAT -- locale
dependent)
The name of the secondary tax (e.g. PST -- locale
dependent)
The maximum number of users than can connect the
MoneyWorks server at any one time
user is logged in with read-only privileges
The logged in name of the user
the version number of the MoneyWorks being used
(e.g. 7.0)
the URL of your website; if this is a complete URL
(i.e. includes the http://) it will be hot-linked to your
website in pdf reports and forms(in Show>Company
Details)

StartupSequenceNumJob
StartupSequenceNumJobSheet
StartupSequenceNumName
StartupSequenceNumProduct
StartupSequenceNumTransaction
StartupSequenceNumUser

State

stockLocationTracking
stocktakeLocation

StocktakeModeActive
TaxName

TaxName2

UserMaxConcurrent

UserIsReadOnly
UserName
Version

WebURL

Fields in Reports

Reports have access to variables that give the environment of the report (the
period for which it is being printed, the scope of the report etc). These are
discussed in Report Variables.

Fields in Forms

When you print forms from MoneyWorks, you generally select the records for
which the forms will be printed (these will normally be Transactions, but might
be Names, Products or Jobs). As MoneyWorks prepares to print each form, any
other records directly related to the record for which the form is being printed
will be selected automatically.

For each form type, there will be a selection of sub-records that are made
available for inclusion in list boxes on the form. The field names for these sub-
records can only be used in column calculations in a list. Fields from the
principal record (the one that you nominated to be printed) are available for use
in any calculation in the form.

The fields of subrecords are said to be out of the scope of a calculation box. If
you use an unknown or out-of-scope field name in a calculation box, you will get
an “Unknown Identifier” error when you print the form.

Lists normally refer to a “natural” related file that depends on the type of
form—when you use a file that is not native to the form, the appropriate fields
are brought into context for the list.

You can also access fields in related files (such as products or accounts) by using
the Lookupfunction. For more information on individual fields, see Appendix
A—Field Descriptions.

Invoice/Receipts: Fields from the Transactions file, the Transactions Details file

and the Names file can be used on invoice/receipt forms.

The Transaction and Name fields can be used anywhere on the form.
MoneyWorks will automatically select the Customer (or Supplier) related to
an invoice/receipt. If the Name field in a cash transaction has not been
filled in, these fields will be empty.

The Transaction Detail fields can be used in list columns. They can also be
included as part of an expression string used as a parameter to the
ExpandList or ExpandDetail functions in a calculation box.

Statements: These use fields from the Names and Transactions files.

The Name fields can be used anywhere on the form. The transaction fields
can be used in list columns. They can also be included as part of an
expression string used as a parameter to the ExpandList or ExpandDetail
functions in a calculation box.



Calculations and things

Operator Types

To determine the value of a transaction on a statement you should use the
special pseudo-field Transaction.AccRecMove. This returns the amount that
the transaction will have affected your accounts receivable. Transactions
that reduce accounts receivable (such as a cash receipt or credit note) will
have negative value in this field, whereas transactions that increase (such as
an invoice) will have a positive value.

When printing a statement, MoneyWorks will select all of the posted
transactions related to the debtor or creditor for inclusion in lists on the
form. You may use the list search expression to exclude certain transactions
if you wish (normally you will exclude transactions that are not in the
current aging cycle).

Cheque/Remittances: Cheque and remittance advice forms are printed using
the Creditors Cheque Runcommand2. In these forms you can use fields
from the Transactions file and the Names file. In addition, there is a special
cheque pseudo-file which contains cheque specific fields.

These are outlined in the table on the right, and correspond to the fields in
the payment transactions that are created on completion of creditor
payment processing

MoneyWorks will automatically select all creditor invoices (and any credit
notes) applicable to each cheque. MoneyWorks will also select the creditor
record related to the cheque. You can use the “Cheque” and Name fields in
any calculation box. The Transaction fields can only be used in list column
calculations (or with the ExpandList or ExpandDetail functions in a
calculation box).

Product forms: Product forms are printed using the Print Product Labels

command in the Command menu—this is only visible when the Products
list is top-most. The fields available are those from the Products file plus
those from the related Recipe file.

Job form fields: Job forms are printed using the Print Job Formscommand in the

Command menu—this is only visible when the Jobs list is top-most. All the
fields from the Job file are available, as are fields giving related access to the
Job Sheet Items.

Context free form fields: Context free forms have access to the global variables

and the functions. Unlike other forms, they are invoked by selecting them
from the Reports menu (and hence should be saved in your Reports folder,
not your Forms folder). They are used for creating forms such as the BAS or
GST Returns.

Form Environment Variables

There are several environment variables for use in forms:

Variable
MESSAGE

PAGE
AGINGCYCLE

COPY

Print_Copy

Omit_Zero

Omit_Credit

Have_Logo

Purpose
This is a text variable containing the text entered into the Message field in
the settings dialog box displayed prior to printing invoices/receipts or
statements.
This is the current page number of a multi-page form.
This is an integer representing the current aging cycle of transactions. You
can use this value to select transactions for inclusion in statements based on
aging. Transactions entered after the last Age Debtor Balances will have an
Aging value equal to the value of AGINGCYCLE. Transactions entered in the
previous aging cycle will have an Aging value of (AGINGCYCLE - 1) and so on.
This is the number of the current copy being printed, where the total number
of copies being printed is determined by the Copies function.
1 if Print "Copy" if Already Printedcheck box in the invoice printing dialog
box is on AND the invoice has already been printed, otherwise zero.
1 or 0 depending on value of Omit Zero Balances check box in the statement
printing dialog box in MoneyWorks.
1 or 0 depending on value of Omit Credit Balances check box in the
statement printing dialog box in MoneyWorks.
1 or 0 depending on whether the current document has a logo pasted in the
Company Details dialog Box.

Operator Types

The MoneyWorks operators are overloaded. That is, their behaviour depends on
the type of the operands that you use with them. For example, the + operator
has three different effects, depending on whether its operands are numbers,
strings, or a date and a number.

Some operators have shorthand aliases. For example ! is equivalent to Not
Calculations and things

Mathematical Operators

and, since “7” is less than “five” alphabetically, the result is true.

Operator Types

The mathematical operators are used for arithmetic involving numbers.

Symbol Operation
+

numeric addition

numeric subtraction

numeric negation

Usage
A + B
The result is the sum of A and B
A - B
The result is B subtracted from A.
-A
The result is minus A.

numeric multiplication A * B

numeric division

The result is A multiplied by B
A / B
The result is A divided by B.

-

-

*

/

Comparison (Relational) Operators

The comparison operators result in either a true or false value. The
MoneyWorks Forms Designer makes no distinction between these Boolean
values and ordinary numbers. Thus the result of a comparison operation may be
treated as a number.

True is equivalent to 1, and 0 is equivalent to false.

A = B
The result is true (1) if A is equal to B. Otherwise the result is false (0).
This applies to numbers, strings and dates. For strings, the
comparison is case-insensitive. Thus "The Same" = "THE
SAME" is true. Use the double form of the operator to avoid wildcard
searches (e.g. when searching for an email address, where the @
would otherwise be considered a wildcard character, resulting in
unwanted matches).
A <>B
The result is true (1) if A is not equal to B. Otherwise the result is false
(0).
A < B
For numbers, the result is true if A is smaller than B.For strings, the
result is true if A is alphabetically before B. Thus "Alpha" <
"Beta" is true.For dates, the result is true if the date A is earlier
than the date B.
A > B

Symbol Operation Usage
equality
=, ==

!=, <>

inequality

<

less than

>

<=

>=

greater
than
less than
or equal
to
greater
than or
equal to

A <=B

A >=B

The operands for the comparison operators must be of the same type. If you
supply operands of different types, one of the operands will be promoted to the
type of the other, according to the following rules:

Logical (Boolean) Operators

Use logical operators to build compound conditions.

If either operand is a string, the other will be converted to a string. If either
operand is a number (but neither is a string), the other will be converted to a
number.

For example, the comparison:

7 < "five"

results in the left-hand operand being converted to a string, thus:

"7" < "five"
Usage

conjunction A and B

Symbol Operation
And, &,
&&
Or, |,
||
Not, !

negation

disjunction

The result is true if both A and B are true, or false if one is false.
A or B
The result is true if either A or B is true, or false if both are false.
not A
Returns the logical negation of A.?The result is true if A is false. The
result is false if A is true.



Calculations and things

Text Operators

There are two text (string) operator (and a number of functions for the
manipulation of strings, see Functions.)

Symbol Operation
+

string
concatenation

*

replication

Usage
A + B
Returns B concatenated to A.
Both A and B must be strings:
A * n
Returns a string that repeats A n times., where n is a
number.
Handy for making simple bar charts in reports.

For example:

-

day subtraction A - B

For example: '21/2/68' + 5 gives 26/2/68.

A must be of type date, and B must be a number.
The result is a date B days before A.
For example: '21/2/68' - 5 gives 16/2/68.

Relational Searches

Note: When comparing a time with a date, the date is evaluated as midnight on

that date (i.e. time zero). Thus a search of (for example):

transaction.timeposted > '1/1/2014'

will find every transaction posted after midnight on 1st January, which will
(perhaps counter-intuitively) include all those posted on the 1st Jan. To omit
these from the search, add one to the date, e.g:

transaction.timeposted >= targetDate+1

"Bother" + " said Pooh" — results in "Bother said Pooh"

"Me" * 5 — results in "MeMeMeMeMe"

Precedence

If one of the operands is a number or a date, it will be promoted to a string.
Thus:

Each operator has a precedence. Operators with a higher precedence will be
evaluated before operators of a lower precedence. The precedence of the
operators is as follows:

5 + "6"

yields “56” (or possibly even “5.006”, depending on formatting) because the 5 is
promoted to a string and the result is concatenation rather than numeric
addition. If you want to force numeric addition in this case, you would use:

Highest precedence:

Lowest precedence:

Not,- (unary minus)
*, /
+, -
=, , <, >, ≤, ≥
And
Or

5 + TextToNum("6")

which would give a result of 11.

Date Operators

The date operators are used to perform arithmetic on dates. One of the
operands must be a number, and is treated as a number of days.

Symbol Operation
+

day addition

Usage
A + B
A must be of type date, and B must be a number.
The result is a date B days after A.

Operators with the same precedence are evaluated left to right. You can force
the evaluation order using parentheses. Subexpressions enclosed in parentheses
have the highest precedence of all.

Relational Searches

You can exploit the awesome power of the MoneyWorks relational database by
using a relational search. In its simple form, a relational search has the form:

[File:SearchExpression]
Calculations and things

So for example:

[Transaction:Type="DII"]

would find all incomplete (unpaid and/or unposted) debtor invoices.

The relational aspect comes in when you add further terms. Each term is in [...]
and must contain a file name, but the search expression is optional. Omission of
a search in the first term implies start with all records. Subsequent terms invoke
a Find Related (sort of a relational Join) from the previous term's selected
records to the new term's file, which can then be optionally filtered with the
search expression.

Thus:

[Account:Type = "CA"]

[Transaction:ourref="blah"][Payments.CashTrans][Payments.InvoiceID][Transaction]

Relational Searches

If no explicit links are given, MoneyWorks will choose the first match that
you would see in the options for Find Related between those files (If you try
a Find Related from Account to Product you will see that the first option
that gets you to Product is the sales account i.e. Products whose sales
account is the account you are starting from).

Linking to accounts: When joining to the account file, any department in the
input is ignored. Thus to find all the stock control accounts, you can use:

[product.stockAcct:hash>=8][account.code]

Even if some of the stockAcct codes were departmentalised, it will still find
the correct account (e.g. “1310-WEST” will link to account “1310”).

Negating a search: Use the Negation operator [!] to find items that are not part

will find every account which is a current asset, and:

of the related set. Thus the search:

[Account:Type = "CA"][Detail]

[product:code = "BA100"][transaction:type="DI@"][Name]

will find all the transaction lines (details) that pertain to current asset accounts.

will find every customer who has been invoiced for product BA100.

Transaction:Period > X and Period < Y][Account:Type =

[product:code = "BA100"][transaction:type="DI@"][Name][!]

"CA"][Detail]

will find the same, but restricted to transactions in the period range.

[Transaction:Type="DII"][Name:state="NSW"]

will find all Customers in NSW who have incomplet e invoices. Or, reversing it:

[Name:state="NSW"][Transaction:Type="DII"]

will find all outstanding invoices for customers in NSW.

Ambiguous Links: When the field linking one file to another is ambiguous (e.g.
[Account][Product] could use any of the product's control accounts as the
linking field), you explicitly specify which field to use. Where necessary, two
terms of the same file may be used. E.g. to go from a selection of payments
to invoices they pay, use

will find every customer who has not been invoiced for the product.

Unions and Intersections: Searches that start from different source files or
selections can be joined using the postfix push, intersection and union
operators. Having found one selection in the target file, that selection is
saved using the push operator (^). The next search is then done, and the
resulting selection is combined with the previously-saved selection using
the union (+) or intersection (*) operators, then start finding a new
selection in the target file. For example:

[Transaction:transdate = today() and type =

`DI@`][Detail]^[Product:Supplier=supplier_code][Detail]*

will find the detail lines for all debtor invoices dated today and push (^) the
result. It will then find all lines for products for supplier_code (a run-time
report or form variable). Finally the two detail line selections will be
Calculations and things

Selections

intersected (*) to get just the invoiced detail lines for supplier’s products in
today’s invoices.

Selections

Using variables in relational search expressions:

In a report cell, or in a MWScript handler when you have an existing selection in
a cell name/variable, you can reference that selection as the starting point (or
an intersection or union) in a subsequent relational search in place of a table
name (i.e. the relational search parser can access the context of the caller).

e.g. the following calculations can be done in report cells named dsel and psel:

dsel =CreateSelection("detail", "detail.stockcode =`B@`")

psel =CreateSelection("product", "[dsel][product]") //

CreateSelection can "see" dsel

or, equivalently, in MWScript:

let b = "B@"
let dsel = CreateSelection("Detail", "Detail.StockCode=b")
let psel = CreateSelection("Product", "[dsel][product]")

(note that CreateSelection can also access simple variables from the calling
context, not just selections).

Relational searches can be used in:

• Advanced Search Dialogs;
• List Filters;
• Creating selections (see below);
• Custom Report hot links;
• List options in custom forms
• Analysis Report Filters.

Note that in all cases the final term’s file must reflect the target list.

Also note: Search expressions are limited to 255 characters in length.

When using MoneyWorks, you see (and operate on) a “selection” of records.
The visual representation of these are the lists, where the records that you can
see in a list represent the “found set”. If you search the list, you will get a new
“found set”. When you highlight one or more items in the list, you have a
“highlighted selection”.

MoneyWorks allows you to create and use selections programmatically, where a
selection is basically the stored results of some search. These can be created
and used in both reports and scripts. Judicious use of such selections can make
running reports substantially faster. Because selections are stored (at least
temporarily), they can be reused without needing to repeat the search, which is
relatively expensive.

Selections created by a report can also be passed by the report back to a
Datacentre server. You will need to do this for any report that relies on some
selection on your screen, as the Datacentre server cannot see what you are
doing in a list window3.

A selection is made by using the CreateSelectionfunction, to which you pass the
MoneyWorks table name, and a search expression, e.g.

CreateSelection("transaction", "NameCode=`SPRING`", "TransDate")

creates a selection of all transactions which have a namecode of “SPRING”, and
sorts it by the transaction date. The following report cell creates a selection dsel,
which contains the detail lines of all posted sales invoices:

dsel =createSelection("detail", "[transaction:status=`P` and

type='DI@'][detail]")

This selection can then be used as the basis for creating other selections. For
example, we might want to report on sales of all products whose category1 is
“Bronze”. So we can step through the Bronze products, then find the sales
invoice lines for each one by creating a new selection, based on dsel and the
product (meaning we don’t have to repeat the expensive search for the sales
invoice lines for each product):

foreach p in product where "category1 = `BRONZE`"
Calculations and things

mysel=IntersectSelection(dsel, "detail.stockcode ='" +

p.code + "'")

We can then work through the new selection to do whatever we want to:

foreach d in detail mysel

The search expression can be a relational search or a simple one. It may also be
a meta-search mnemonic from the list below:

"*highlighted" or "**" highlighted records in the main list for the table
"*found" or "*f"
"*foundorall"
"*"

found records in the main list for the table
found if any, or all if none found
highlighted, if any; else found, if any; else all.

Note: When you create a selection in this manner, any records in the selection
are locked for deletion (so that other users can’t destroy the selection
under your feet). For this reason, you should not keep selections for longer
than you need (they will automatically be discarded when the report or
script is completed.

Functions

Functions perform calculations that cannot easily be performed using the
standard operators alone. Functions always have a list of function parameters
enclosed in parentheses.

For example:

Today()

Sum(5, 6, 7)

If(A > B, Transaction.Gross, "")

The parameters of a function need not be simple values—they can be entire
subexpressions (including other functions). Some functions (such as Sum()) can
take a variable number of parameters.

Functions

The parameters to a function are enclosed in parentheses following the function
name. Each parameter is separated by a comma. (You can’t use commas as
thousand separators when passing a constant number to a function). If the
function does not have any parameters, you must still supply the parentheses.

In this section, the function format is illustrated by example. Some functions
have optional parameters. The optional parameters in the function format are
shown inside square brackets ([ ]). These are there simply to illustrate that the
parameter in the brackets is optional. Don’t type the brackets when entering the
function in an expression.

Some functions, such as ConcatWith() and Sum() accept a variable number of
parameters. This is indicated in the function format by ellipses (...). Don’t type
the ellipses when you use the function yourself.

Except for the ExpandList() and ExpandDetail() functions, all functions have a
return type of Text, Number, Selection or Date and this return type is indicated
for each function definition. Some functions, such as If(), have a return type that
will be the same type as one of the parameters, depending on the outcome of
the function calculation.

Function and Handler Summary

The following is a brief summary of the available functions and handlers. The
functions (which are grouped into broad types) can be used in MoneyWorks
expressions in data entry, reports and forms (unless otherwise stated). Some
functions (such as GetFieldValue() or GoToNextField()) and all handlers are
specific to MWScript (see Scripting Functions). A brief outline of scripts is given
at scripts.

Numerics

Abs: Absolute value of a number
Average: Average of numbers (for ExpandList, mainly)
Int: Discard fractional part of a number (truncate)
Log10: Base 10 logarithm of a number
Log2: Base 2 logarithm of a number
LogN: Base e logarithm of a number
Max: Select the largest of the given numbers
Min: Select the lowest of the given numbers
Mod: Remainder after division
Calculations and things

Function and Handler Summary

Pow: Exponentiation
Random: Get a random number
Round: Round a number to given decimal places
Sign: Get the sign of a number
Sqrt: Square root of a number
Sum: Add the given numbers (for ExpandList, mainly)

Text and strings

ByteLength: Get the byte length of the utf-8 representation of a string
CSV: format the values as CSV
Concat: Concatenate several strings
ConcatAllWith: Concatenate several strings with a delimiter string
ConcatWith: Concatenate several strings with a delimiter string, omitting

blank input

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
InsertVars: Insert values of variables or expressions in a string
Left: Get characters from the start of a string
Length: Length in characters of a string
Lower: Lowercase a string
Mid: Get characters from the middle of a string
Pad: Pad a string to a desired length
ParseCSV: Convert a line of CSV (Comma-Separated-Value) text to tab-

delimited

PositionInText: Find the character offset of a substring within a string
Proper: Uppercase initial letters of words in a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Sort: Sort a delimited tabular string
Tail: Get some elements from the end of a delimited string
Transpose: Transpose a tabular delimited string
Trim: Remove whitespace from beginning and end of a string

URLEncode: Convert url unsafe characters in a string to "%xx”
Upper: Uppercase a string

Data Conversion

Base64Decode: String from a base64 encoding
Base64Encode: Base64 of a string
BaseName: Filename from a path
CalcDueDate: Calculate a due date for given terms
Char: A one character string from a unicode code point
Checksum: Cryptographic checksum of a string
Choose: Choose between several values based on an index
ClearFlag: Bitwise bit clear
Code128: Code128 barcode byte representation of a string
Count: Count parameters (mainly for ExpandList)
CountElements: Get the size of an associative array
CountLines: Count delimited lines/elements in a string
CreateArray: Create an empty associative array
CurrencyFormat: Format a number as a currency value with ISO code
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
DeleteElement: Remove a key from an associative array
DollarsToEnglish: Convert a currency amount to English or French
ElementExists: Check if a key exists in an associative array
HMAC: Create a keyed-hash message authentication code
HexDecode: String from hex representation of the utf-8 encoding
HexEncode: Hex representation of the utf-8 encoding of a string
If: Choose between two values based on a Boolean
Match: Find a value's parameter number in a parameter list
Month: Get the month of a date
NumToEnglish: Convert a number to English or French words
NumToPeriod: Convert a linear period offset to a period
NumToText: Format a number as a string
ParamsFromArray: Expand array values to a variable parameter list
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
PeriodToNum: Convert a period to a linear offset
Quarter: Create a lexical label for breaking down data (e.g. "Q1"..."Q4")
SetFlag: Binary OR
Calculations and things

Function and Handler Summary

TestFlags: Binary AND
TextToDate: Parse a string to a date
TextToNum: Parse a string to a number
TypeOf: Get the type enumeration of a value or variable
Unicode: Get the unicode codepoint for a character
Val: Evaluate a string as an expression
WeekOfYear: Convert a date to a week number
Year: Year of a date

Special Form Designer Functions

ExpandDetail: Expand form search result values to a parameter list
ExpandList: Expand form list values to a parameter list
SubTotal: Subtotal a form list column

Environmental

AddStatementTransaction: Add a transaction to the bank statement import
AgeByPeriod: Calculate invoice ageing
Allowed: Test a named privilege for the current user
Analyse: Run an Analysis of transaction details or job sheets
Authenticate: Test a supplied username + password
AvailableStockForBatch: Get effective SOH for a batch
CancelTransaction: Cancel a transaction
ChangePrimaryKeyCode: Change a code programmatically
CloseDocument: Close the document or connection
CloseWindow: Close a window
CopyUserSettings: Copy settings from one user to another
CurrencyConvert: Convert amount between currencies
CurrencyName: Full name or denomination of a currency
CurrentPeriod: Get the current period number
DoForm: Output a custom form to PDF
DoReport: Output a report to text, html, or PDF
Export: Export records as text/xml
ExportImage: Export an image
External: Execute an installed external function
FieldLabel: Get the name of a custom field
Find: Get formatted record data matching a search as a string
FindRecordsInListWindow: Perform a search in a list window
FirstUnlockedPeriod: Get the oldest period that is not locked
GetAllContactEmailsForRole: Get a list of email addresses for a Name
GetAppPreference: Get a named preference value
GetBalance: Get a balance from an account
GetDatabaseFieldSize: Get table field sizes from the database schema
GetDatabaseFields: Get table field names from the database schema as a

delimited string

GetDatabaseFiles: Get the MoneyWorks database table names
GetLastErrorMessage: Get the last import error message string
GetMovement: Get the movement for an account
GetMutex: Try to obtain a named mutex
GetNextReference: Allocate a reference number for a transaction type (or

job code).

GetOffBalance: Get the balance form an off ledger
GetPersistent: Load a record as an associative array from one of the user

tables

GetPlugins: Get a list of reports
GetScriptText: Get the text of a script
GetTaggedValue: Extract a value from a tagged value field
GetTaxRate: Get a tax rate
HavePicture: Test for existence of an image file related to a record
Import: Import data from an xml string
ImportImage: Import an image from a file
IncrementUserSeq: Increment a named user table value
Lookup: Lookup a field value for a primary key
Mail: Send an email with an attachment
MakeGUID: Make a globally unique identifier string
OpenDocument: Open a document or connection (use from external script)
PeriodName: Get the Name of a period
PostTransactions: Post a selection of transactions
ProductSOHForLocation: Gets the SOH for a product held at a specified

location

ReleaseMutex: Release a mutex
ReplaceField: Replace a field in records matching a search
SetAppPreference: Set a named preference value
SetBudget: Set a budget value
SetExchangeRate: Create and post an exchange rate journal
SetPersistent: Create or update a user table record using data in an

associative array

SetProgressMessage: Suggest a progress message
SetStocktakeForLocation: Update the stocktake count for a product]
SetTaggedValue: Encode data for a TaggedText field (for custom data

storage)

Sqlite3_Close: Closes a connection to a Sqlite3 database
Sqlite3_Exec: Executes a SQL query on a Sqlite3 database



Calculations and things

Function and Handler Summary

Sqlite3_Open: Opens a connection to a new or existing Sqlite3 database
SuggestNameCode: Suggest a Name Code given a company name
SumDetail: Add up a field for details matching a search
SumSelection: Add up a field for records matching a search
SyncTransactionImage: Set the image flag for a transaction
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
TransferFunds: Create a funds transfer payment between two bank

accounts

TryPutBackReference: Try to return an unused reference number (allocated

by GetNextReference) to the reference number allocator.
UpdateOrderLines: Change ship quantities in an existing order
WaitMilliseconds: pause script execution

Record Selection

CreateSelection: Create a selection of records
IntersectSelection: Intersect a selection with the result of another search
RecordsSelected: Count records in a selection or resulting from a (meta)

search

UnionSelection: Add the result of another search to a selection

Table Handling

CreateTable: Create an empty accumulator table
TableAccumulate: Accumulate numeric column data for a key
TableAccumulateColumn: Accumulate data in one column for a key
TableFind: Look up a key in the table
TableGet: Extract data for a key or index found with TableFind

User interface

AddListLine: Add a row to an editable list
AddSafePath: UI to add a safe path to the preferences
Alert: Display an alert with up to 3 buttons
AppendColumnToStdEditList: Customise a standard edit list
AppendPopupItems: Build a popup menu
Ask: Very simple dialog box with controls
AutoFillAcctDeptField: Apply auto-complete to a departmental account

code edit field

AutoFillField: Apply auto-complete to a code edit field
CheckCodeField: Validate a code edit field
ChooseFromList: Very simple list dialog box
Clicks: Get the current click count
CreateListWindow: Instantiate a modeless custom database table list

window

CreateWindow: Instantiate a modeless custom window
DeleteListLine: Delete a row from an editable list
DeletePopupItems: Remove items from a popup menu
DisplaySelection: Display standard list window for a given selection of

records

DisplayStickyNote: Open sticky notes for a record
ExchangeListRows: Swap rows in an editable list
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetClipboardText: Get the text on the clipboard
GetDialogHandle: Get a window reference from a list reference
GetFieldCount: Get the number of controls in a window (standard or

custom)

GetFieldName: Get the symbolic identifier string for a standard or custom

field or control

GetFieldNumber: Get an index from a symbolic field/control name
GetFieldValue: Get the value/contents of a field or control
GetListContents: Get a tab-delimited string with the contents of a simple list
GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
GetRecordForListRow: Get list row record as array
GetUIField: Get value from a standard UI field
GetWindowByID: Gets a handle to the first window instance that has the

given identifer

GetWindowID: Get the ident of a window from a window handle
GetWindowName: Get the title of a window
GetWindowProperty: Retrieve data previously stored for a windowHandle
GotoField: Set keyboard focus on a field
GotoListField: Set keyboard focus on a cell of an editable list
GotoNextField: Advance keyboard focus
InsertEditListObject: Initialise editable list object in a window
InsertListObject: Initialise selectable list object in a window



Calculations and things

Function and Handler Summary

InstallMenuCommand: Install a command at the bottom of the Command

File Handling

menu

InstallToolbarIcon: Install a toolbar icon
LoadHTMLInWebView: Load HTML into a custom web view control
LoadPicture: Load a picture into a picture object in a custom window
LoadURLInWebView: Load a URL into a custom web view control
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
ModalJobsheetEntryWindow: Run a modal Jobsheet entry modify/create

window

ModalListWindow: Instantiate a modal custom database table list window
ModalTransactionWindow: Run a modal transaction modify/create window
ModalWindow: Instantiate a modal custom window
Navigator: Execute a navigator click and/or post a coach tip window
NotifyChanged: Update any list windows containing records from the

CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

named database tables

Debugging and performance

PutClipboardText: Copy text to the clipboard
PutRecordForListRow: Put mutable fields from array to list row record
ReadCurrentRecordForWindow: Load a record in custom UI, or tagged fields

in standard UI

SavePicture: Create an image file with the contents of a picture control
Say: Speak some text
SelectWindow: Bring a window to the front
SetFieldEnabling: Enable or disable a custom control
SetFieldValue: Set the value of a field, checkbox, popup, etc
SetFieldVisibility: Show or hide a custom control
SetListContents: Populate a simple list with data from tab-delimited text
SetListField: Set the text of an editable list field
SetListSelect: Highlight a row in a list
SetOptionsForEditList: Set options for the list
SetReportColumnWidth: Tweak a report column
SetSidebarColour: Set a custom sidebar colour for a window
SetWindowProperty: Store data related to a window
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateFieldWithValidationString: Programmatically apply a custom

validation expression to a field

WebViewControl: Set option(s) on a web view control (links load externally

or not)

WriteCurrentRecordForWindow: Save a record in custom UI, or save tagged

fields in standard UI

GetProfile: Get the execution timing profile for the current script
SysLog: Write message to MoneyWorks_Gold.log
_NTDump: Get a textual dump of identifiers and values from the

MoneyWorks nametable

JSON parsing

JSON_AsXML: Convert JSON to XML
JSON_Free: Free a parsed JSON structure
JSON_Get: Extract object from parsed JSON
JSON_Parse: Parse JSON text

XML parsing

AddXMLElement: Write an element to an XML document handle
BeginXMLElement: Write an opening tag to an XML document handle
CreateXMLDoc: Create an XML document handle
EndXMLElement: Write a closing tag to an XML document
FinaliseXMLDoc: Get the finished XML as a string
XMLFree: Free an XML document
XMLParseFile: Parse an XML file to an XML document
XMLParseString: Parse an XML string to an XML document
XML_Free: Release an Expat parser
XML_Parse: Parse an XML string using an Expat parser
XML_ParserCreate: Create an Expat parser for parsing XML
XML_SetCharacterDataHandler: Set a character data Handler (callback) for

an Expat parser
Calculations and things

Function and Handler Summary

XML_SetElementHandler: Set an element Handler (callback) for an Expat

Name record methods

parser

XPathEval: Extract a node or value from an XML document using XPath

GetContactForRole: Get contacts from a Name record

notation.

Networking

Curl_Close: Finish with a CURL session
Curl_Exec: Execute a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_Init: Start a CURL session
Curl_SetOpt: Add options to a CURL session
Curl_StrError: Get an error message from a CURL object

Script Handlers

After: The window is closing or the record is advancing and the window

content has changed

AllowDeleteRecords: Control whether a user can delete a selection
AllowPostTransactions: Control whether a user can post a selection
Before: The window has just opened or the record has just advanced or the

view in a list has just changed
Cancel: The window is being cancelled
Close: The window is closing (with either OK or Cancel)
Dawdle: Do idle processing in a custom window
EnterCell: A cell in an editable list has just gained focus
EnterField: A field has just gained focus
ExitedCell: A cell in an editable list has just lost focus
ExitedField: A field has just lost focus
ItemHit: A field has had a keydown or a control value has changed
Load: Script just loaded
PostedTransactions: Post-process transactions that were just posted
SetupReport: Use to tweak a report layout.
TweakColumnList: Use to add custom columns to a standard editable list.
Unload: Script is about to unload
UserLoggedIn: User just connected
UserLoggingOut: User is about to disconnect
Validate: Control whether the window can be OK'd
ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

ValidateField: Control whether the content of a field is acceptable and the

field can be exited

Product record methods

SOHForLocation: Get Stock on Hand for a product at a location
StocktakeNewQtyForLocation: Get the current stocktake quantity for a

product for a given location

StocktakeStartQtyForLocation: Get the stocktake starting snapshot quantity

for a product for a given location

Abs (number)

Result Type: Number

Definition: Returns the absolute value of the parameter.

Examples: Abs(47)

returns 47

Abs(-20.5)

returns 20.5

AgeByPeriod (per, relativeToPer)

Result Type: Number

Definition: Returns the number of periods between per and relativeToPer,

where these are periods (such as you get from Transaction.Period). It is
smart enough not to count an End period in 13 period year (use
PeriodtoNum if you want to include the 13th period). If the two arguments
are the same, zero is returned.

Examples: AgeByPeriod (transaction.period, CurrentPeriod())

returns -1, if transaction.period is equivalent to Jun:2000 and the current
period is equivalent to Jul:2000; returns -2 if the current period is Aug:2000,
and so on.
Calculations and things

Allowed (privilegeName)

Result Type: Number

Definition: Returns 1 (true) if the user privilege privilegeName is on for the

currently logged in user, otherwise returns zero (false). PrivilegeName must
have the identical spelling to that listed in the privilege list in Users and
Security. Will always returns true on Express and Cashbook or if password
protection is not turned on.

Examples: Allowed(“Pay Invoices”)

returns 1 if the user can pay (creditor) invoices, otherwise 0.

Analyse (basis, sourceFile, searchExpression,
breakDownFields, outputFields, fromDate, toDate [, kind]
[, filterFunct])

Result Type: table of tab/newline delimited text

Definition: The Analyse function performs a transaction or job sheet analysis
using the parameters you specify. If possible, the result will be table-
formatted (i.e. second breakdown level in columns), otherwise it will be list-
formatted. The format is simplified to better allow programmatic
manipulation of the result (especially using Head, Tail, Slice, etc). The first
line of the returned table contains series names; and the first column
contains categories/keys

basis: "Transaction" or "JobSheet", or (from v9.1.8) "Ledger"

sourceFile: a file name (e.g. "Product", "Name", "Transaction")

searchExpression: a search expression to be applied to the source file to
find records to analyse.

breakdownFields: text containing a comma-delimited list of the field names
to analyse by, e.g. “Name.Category1,Name.Code". You may specify a
breakdown calculation inside brackets instead of a field name. E.g.
"Name.Category1,[Left(Name.Code, 2)]"

Function and Handler Summary

outputFields: text containing a comma-delimited list of output values,
where 1 = count, 2 = qty, 3 = Net, 4 = GST, 5 = Gross etc. (see the output
value popups in the Analysis editor). e.g. "2,3" will give you Qty and Net
columns. For a single output field, you can follow the field number with a
"#", which denotes that the resulting table should include a total column.

fromDate: a start date or start period for the range of transactions or job
sheet entries to analyse.

toDate: an end date or end period

kind: (optional) character codes denoting what kind of analysis. e.g. "IEU"
denotes analyse Income and Expenses, including unposted.

I = Income; E = Expense; B = Billed; U = Unbilled (or Unposted)

Default is "IEUB"

filterFunct: (optional) a filter function to filter out detail lines or job sheet
entries that you don't want to analyse.

Examples:

analysis = Analyse ("Transaction", "Name", "customertype <> 0",

"Transaction.NameCode,Transaction.Period", "3#",
PeriodOffset(CurrentPer, -7), PeriodOffset(CurrentPer, -1))

Analyses transactions for Names. SearchExpressionyields customers. Breaks
down by NameCode and Period. Only one output field (Net), so will get
table format with Periods as column headings. Analyses the last 7 periods.
The result can be further refined:

top = head(sort(analysis, -1, 1, 1, 1), 6, "\n")

Gets the top 5 Names of the Analysis by total value over all periods (total is
rightmost column, hence sorting by column -1). A descending, numeric sort
which skips the first (heading) line brings the top 5 customers. If we want to
chart the result (in the Chart part of a custom report) with a period series
for each name, we would need to transpose it, and get rid of the total
column (last line after transposing)

tochart = head(transpose(top), -1, "\n")
Calculations and things

Running Analyse() on the server:

Since Analyse() runs on the client, it can be time consuming for complex
analyses or large data sets because it makes many individual database requests.
In MoneyWorks 9.1.8 and later you can use the Val()function with the new
runOnServer option to run your analyse function on the server for much better
performance.

AvailableStockForBatch (productSeq, batchNum, location,
exclOrderSeqNum)

Result Type: Number

Example: Base64Decode("SGVsbG8gV29ybGQh") — returns "Hello World!".

In MoneyWorks 9 and later the function is tolerant of newlines (CR, LF, or a
combination thereof) anywhere in the base64 string.

Function and Handler Summary

See Also:

Base64Encode: Base64 of a string
Curl_Close: Finish with a CURL session
Curl_Exec: Execute a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_Init: Start a CURL session
Curl_StrError: Get an error message from a CURL object
URLEncode: Convert url unsafe characters in a string to "%xx”

Definition: Calculates the available stock for an inventoried batch/serial/
location-tracked product. Available stock is the stock-on-hand less
committed stock (i.e. stock already allocated to sales orders excluding the
order identified by exclOrderSeqNum).

Base64Encode (text [, boolBreakLines])

Result type: text

Average (number, ...)

Result Type: Number

Definition: Returns the average value of the parameters. If no parameters are

supplied, returns zero. All parameters must be numbers.

Examples: Average(5, 6, 10)

returns 7

Average()

returns 0

Base64Decode (base64text)

Result type: text

Definition: Decodes base64-encoded data to a string.

Definition: Encodes text as a base64-encoded string. Some web services (such
as Basic Authentication to REST services) require base64-encoded data.

In MoneyWorks 9 and later you can specify true for the optional
boolBreakLines parameter which will insert a CRLF every 76 characters,
appropriate for SMTP-compatible Base64 encoding.

Example: Base64Encode("Hello World!") — returns "SGVsbG8gV29ybGQh".

Availability: available within MWScript handlers.

See Also:

Base64Decode: String from a base64 encoding
Curl_Close: Finish with a CURL session
Curl_Exec: Execute a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_Init: Start a CURL session
Curl_StrError: Get an error message from a CURL object
URLEncode: Convert url unsafe characters in a string to "%xx”
Calculations and things

BaseName (path)

Result type: text

CalcDueDate (date, terms)

Result Type: Date

Function and Handler Summary

Definition: Returns the filename part of a filesystem path. Assumes the path is

Definition: Adds the terms to the date. For a positive value of terms, that

in the native format for the platform.

Example: BaseName("/Users/admin/Documents/somefile.txt") — returns

"somefile.txt".

Availability: MoneyWorks 9.2.1 and later.

See Also:

AddSafePath: UI to add a safe path to the preferences
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

ByteLength (text)

Result type: number

Definition: Returns the length, in bytes (reflecting the utf-8 encoding of non-

ASCII characters), of a string. This may be different from Length() which
returns the length in characters.

Example: ByteLength("™") — returns 3 (whereas Length("™") is 1).

Availability: available within MWScript handlers.

number of days is added to date. For a negative value of terms (-1...-31), the
calculated due date is the (absolute value of the) day of the month
following. If the month does not have that many days, the day is limited to
the number of days in the month. For negative values in the range
(-101...-131) the due date will be the (mod 100) day of month in the second
month following. For negative values in the range (-201...-231) the due date
will be the day of month in the second month following.

Examples: CalcDueDate('1/1/2024', -20)

returns '20/2/2024'.

CalcDueDate('1/1/2024', 30)

returns '31/1/2024'.

CalcDueDate('1/1/2024', -120)

returns '20/03/2024'.

See Also:

CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Calculations and things

Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

Char (num)

Result Type: String

Definition: Returns a string containing the character with the given numerical

codepoint.

Examples: Char(65)

returns "A"

Char(9)

returns "\t" (the tab character)

Char(0)

is an error — NUL characters are not allowed in MoneyWorks text values

Note: In MoneyWorks 6 and earlier, the encoding was assumed to be the system
default 8-bit encoding (typically MacRoman on Mac or Windows-1252 on
Windows, but may have been different depending on your locale). You can
assume that characters in the 7-bit ASCII range (1-127) will continue to
behave the same.

Checksum (text [, hash])

Result Type: String

Function and Handler Summary

In v9 and later, you can optionally pass the name of the hash you require.
Supported hashes are "md5" (default), "sha1", "sha256", "sha512"). You
can also use this function to compute cryptographic hashes that might be
required for certain online APIs. See also HMAC if you need a keyed-hash
message authentication code.

Examples:

Checksum("some text")

returns "552e21cd4cd9918678e3c1a0df491bc3"

If you are iterating over data (detail lines of a transaction, say), you can add
the previously calculated checksum by appending it to the input text (in this
example, CS is a cell name inside a for loop in a report)

CS = Checksum(D.StockCode + D.StockQty + D.Gross + CS)

Checksum("some text", "sha1")

returns "37aa63c77398d954473262e1a0057c1e632eda77"

See Also:

HMAC: Create a keyed-hash message authentication code

Choose (selector, ...)

Result Type: depends on parameters

Definition: Returns the value of the (selector + 1)th parameter. If selector is
outside the range of parameters supplied, returns the empty string.

Examples: Choose(3, "Fi", "Fie", "Fo", "Fum")

Definition: Returns a text string containing a hexadecimal representation of the

cryptographic hash of the given text. On v8 and earlier, the hash used will
be md5. This is a reasonably reliable way of testing to see if there has been
any change in a largish amount of data since you last checksummed it
(because the checksum is small enough to store).

returns “Fo”.

Choose(X, "ten", 100, 1000, "huge")

where X has the value 1, returns “ten”.
Calculations and things

ClearFlag (num, mask)

Result Type: Number

Definition: Returns the bitwise AND of num and the ones-complement of mask.
This function can be used in the Advanced Replace to clear certain flags.
Supports up to 32 bits.

Example: ClearFlag(#FFFF, #0001)

returns 65534 (#FFFE)

In the Advanced Replace for the Product list:

Set Flags to ClearFlag(Flags, #400000)

Note: When displaying a barcode in a list on a form you must have word wrap

Function and Handler Summary

on for the column.

Concat (text, ...)

Result Type: text

Definition: Concatenates the text strings passed as parameters. This is the

equivalent of using the “+” operator with the text strings

Examples: Concat(3, " blind", " mice")

returns “3.00 blind mice”. The number 3 is converted to a string "3.00"
before concatenation, using the current format settings.

clears the flag that controls the Update price when purchased setting in a
Product, effectively turning the checkbox on.

ConcatAllWith (separator, text, ...)

Result Type: text

See Also:

SetFlag: Binary OR
TestFlags: Binary AND

Code128 (text)

Encodes the given text in the encoding required for Code128 (GS1)
barcodes. The encoding will be optimised to use Code128A, Code128B, or
Code128C encoding or a combination thereof. The only use for this function
is to use the result in a barcode object on a form or in a barcode cell on a
report. For a barcode to appear in a column in a list on a form you need to
embed the function in “<<code128:” and “>>”. For example the following
would print an item’s barcode in an invoice:

Definition: Concatenates the text strings passed as parameters, separating each

by separator. This is equivalent to using the “+” operator.

Examples: ConcatAllWith(", ", "Finn", "Conan", "", "Diarmaid")

returns “Finn, Conan, , Diarmaid".

ConcatAllWith(", ", ExpandDetail("Detail.ProductCode"))

returns “MW100, FD100, CONGCC" if there are three detail lines in the
transaction containing those three product codes.

ConcatWith (separator, text, ...)

"<<code128:"+code128(lookup(detail.stockcode,

"Product.barcode"))+">>"

Result Type: text

The enthusiastic can bypass this function and hand-encode barcodes using
the Char() function.

Definition: Concatenates the text strings passed as parameters, separating each

by separator. This is similar to using the “+” operator.

Examples: ConcatWith(", ", "Finn", "Conan", "", "Diarmaid")
Calculations and things

Function and Handler Summary

returns “Finn, Conan, Diarmaid". Notice that no separator is used to
separate an empty string from its neighbour.

ConcatWith(", ", ExpandDetail("Detail.ProductCode"))

returns “MW100, FD100, CONGCC" if there are three detail lines in the
transaction containing those three product codes.

Count (value, ...)

Result Type: Number

DeleteElement: Remove a key from an associative array
ElementExists: Check if a key exists in an associative array
ParamsFromArray: Expand array values to a variable parameter list

CountLines (text [, asciiDelimiter])

Result Type: number

Definition: Returns the number of lines in the text string. By default the end of
line character is "\n", but a different character can be used if passed as the
optional second parameter.

Definition: Returns the count of the number of arguments.

Examples: Where text = "Line 1\tA\nLine2\tB\nLine 3\tC"

Examples: Count(5, 3, "one", '10/4/93')

CountLines(text)

returns 4.

returns 3 (the number of lines)

Count(ExpandDetail("Detail.ProductCode"))

CountLines(text, "\t")

returns 3 if there are three detail lines in the transaction.

returns 4 (there are 3 tab characters, giving 4 "lines")

CountElements (array)

Result Type: Number

Definition: Returns the number of elements in the array.

Example:

let x = CreateArray()
let x[1] = "foo"
let x[2] = "bar"
let c = CountElements(x)

c will be 2.

Availability: MWScript in MoneyWorks Gold 8.1.8 and later

See Also:

CreateArray: Create an empty associative array

CountLines(text+"\t", "\t")

returns 4. The last character is a trailing delimiter and does not count as
another column. That is so that the common case of counting

"one\n
two\n
three\n"

and

"one\n
two\n
three"

both return 3. This may catch you out if you use CountLines to count columns
and the last column may blank but you do expect it to count. In this case
(assuming tab column delimiters) it may pay to use the idiom
CountLines(text+"\n", "\t") so that a final, empty, tab-delimited column is
counted.
Calculations and things

Function and Handler Summary

CreateSelection (tableName, searchExpr, [sortExpr],
[descending])

Example:

CreateTable()

Result Type: Selection

Creates and returns a table.

Definition: Creates a new selection of records which can be used in a foreach

CreateTable(6)

loop. SortExpr can be a field name or a more complex expression. Pass 1 for
the 4th parameter for a descending sort. The default (0) is ascending.

Creates and returns a table with 6 columns (excluding the key).

Example:

See Also:

CreateSelection("transaction", "NameCode=`SPRING`", "TransDate")

Creates a selection of all transactions with a Namecode of “SPRING”, sorted
by transaction date.

Note: The search expression can also be one of the meta-search
mnemonics *found and *highlight, to display the found and highlighted sets
respectively.

See Also:

DisplaySelection: Display standard list window for a given selection of

records

IntersectSelection: Intersect a selection with the result of another search
RecordsSelected: Count records in a selection or resulting from a (meta)

search

SumDetail: Add up a field for details matching a search
SumSelection: Add up a field for records matching a search
UnionSelection: Add the result of another search to a selection

CreateTable ([numberOfColumns])

Result Type: Table

Definition: Creates a table for using with TableAccumulate and

TableAccumulateColumn. If numberOfColumns is specified, the table will
have that number of columns (required if using TableAccumulateColumn).
Otherwise the table will have the number of columns specified in the first
TableAccumulate call.

Sort: Sort a delimited tabular string
TableAccumulate: Accumulate numeric column data for a key
TableAccumulateColumn: Accumulate data in one column for a key
TableFind: Look up a key in the table
TableGet: Extract data for a key or index found with TableFind
Transpose: Transpose a tabular delimited string

CSV (values, ...)

Result Type: text

Definition: Concatenates the values separated by commas, with any textual
value containing commas, quotes, newlines or tabs quoted. Embedded
quotes within a field are doubled.

Examples: CSV("one", 2, "thirty four")

returns “one,2,thirty four".

CSV(1997,Ford,E350,"Super, \"luxurious\" truck")

returns “1997,Ford,E350,"Super, ""luxurious"" truck"".

CurrencyConvert (amount, FromCurrency, ToCurrency [,
periodOrDate])

Result Type: Number
Calculations and things

Function and Handler Summary

Definition: Converts the amountin FromCurrencyto the equivalent amount in
ToCurrency, at the given period or date. FromCurrency and ToCurrency are
ISO currency codes. If no period or date is specified, the current period is
assumed. Note that currency conversion is applied using the rates you have
supplied in the MoneyWorks currency table.

Examples: CurrencyConvert(1000, “NZD”, “AUD”, '21/10/06’)

Returns the Australian value of $1,000 of New Zealand currency, a
disappointingly small number.

See Also:

CurrencyName: Full name or denomination of a currency
SetExchangeRate: Create and post an exchange rate journal

CurrencyName("NZD", true) — returns "New Zealand Dollars".

Availability: MoneyWorks 9.2.1 and later.

See Also:

CurrencyConvert: Convert amount between currencies
SetExchangeRate: Create and post an exchange rate journal

CurrentPeriod ()

Result Type: Number

Definition: Returns the internal period number of the current period. Suitable as

an argument to AgeByPeriod or for searching by period

CurrencyFormat (amt, currencycode)

Examples: if (transaction.period = CurrentPeriod(), “Current”,

Result Type: Text

Definition: Formats a currency value with an indication of what currency it is.

Base currency amounts will use the system or preference symbolic currency
format as specified in the Locale document preferences. Other currencies
currently use ISO code.

Examples: CurrencyFormat(1000, "") — returns "$1,000.00"

CurrencyFormat(1000, "USD") — returns "USD 1,000.00"

CurrencyName ([isoCode], [bLongForm])

Result type: text

Definition: Returns the unit name for a given ISO currency code. if bLongForm
is true, returns the fully-qualified name for currencies whose denomination
is otherwise ambiguous.

If no parameters are supplied, or the first parameter is an empty string, the
currency is assumed to be the base currncy for the document.

Example: CurrencyName("NZD") — returns "Dollars".
“Overdue”)

See Also:

CalcDueDate: Calculate a due date for given terms
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date



Calculations and things

Date (day, month, year)

Result Type: Date

Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

Function and Handler Summary

Definition: Returns a date made from the supplied day number, month number

DateToPeriod (date)

and year.

Examples: Date(21, 2, 2008)

returns 21/2/2008.

Date(1, 1, Year(Today) + 1)

returns the first day of next year.

Notes: A 2 digit year between 41 and 99 will be assumed to be 1900 + the year
value. A 2 digit year between 0 and 40 will be assumed to mean 2000 + the
year value. You should use 4 digit years. Results for day values outside the
range (1-number of days in the month) are not defined. Results for month
values outside the range (1-12) are not defined prior to MoneyWorks 9.1.7.
From 9.1.7 onwards, months <= 0 or > 12 will make a date in a year relative
to the one specified (e.g. month 0 will give you December in year - 1; month
13 will give you January in year + 1).

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Result Type: Number

Definition: Converts the supplied date to the period (i.e. the internal

representation of a period in MoneyWorks). This period number can then
be used to search the Transaction.Periodfield.

Examples: DateToPeriod('21/2/97')

returns 202 if the financial year started in January and 1997 is the second
year of operation.

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date



Calculations and things

DateToText (date, [format])

Result Type: Text

Definition: Converts the supplied dateto text in the requested format. Formatis
a name or value from the table below—the sample output shown is for the
31st January 2016 with the date format in the system settings being "dd/
mm/yy".

Name
DateFormShort
DateFormLong
DateFormAbbrev
DateFormLongDateAndTime
DateFormAbbrevDateAndTime
DateFormShortDateAndTime
DateFormTimeOnly
DateFormTimeOnlyNoSecs

Value Sample Output
31/01/16
Sunday, 31 January 2016
31 January 2016
Sunday, 31 January 2016 12:00:00 am
31 January 2016 12:00:00 am
31/01/16 12:00:00 am
12:00:00 am
12:00 am

0
1
2
-1
-2
-3
-4
-5

The following formats are not affected by your system settings
DateFormDDMMYYHHMMSSTT
DateFormDDMMYY
DateFormYYYYMMDD
DateFormYYYYMMDDHHMMSS
DateFormISO
DateFormDateTimeBigEndian

31/1/2016 12:00:00 A
31/1/2016
20160131
20160131000000
2016-01-31
2016-01-31 HH:MM:SS

-6
3
-8
-7
-9
-13

In v9.1 and later, the format parameter may be a POSIX strftime format
string. Note that Mac and Windows have differing support for strftime
format specifiers.

Examples: DateToText('21/2/68')

returns 21/2/68 (but the format may differ depending on the calculation
box format).

gives Wednesday, 21 February, 1968.

DateToText('21/2/68', 2) or DateToText('21/2/68', DateFormAbbrev)

Function and Handler Summary

returns Wed, Feb 21, 1968

DateToText('21/2/68', "%Y-%B-%d")

In v9.1 and later, returns 1968-February-21 (depending on platform's locale)

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

Day (date)

Result Type: Number

DateToText('21/2/68', 0) or DateToText('21/2/68', DateFormShort)

Definition: Returns the day-of-month of the date.

returns 21/2/68.

DateToText('21/2/68', 1) or DateToText('21/2/68', DateFormLong)

Examples: Day('21/2/68')

returns 21.
Calculations and things

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

DayOfWeek (date)

Result Type: Number

Definition: Returns the day of the week of the date, with Monday being 1

Examples: DayOfWeek('21/2/68')

returns 3 (Wednesday).

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date

Function and Handler Summary

PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

Dice (table, rownum, colnum)

Result Type: Text

Definition: Returns the value of the item in the rownum’th row of the colnum’th

column of table.

Examples: If MyTable is:

A

B

C

1

3

5

2

4

6

Dice(MyTable, 1,1) — returns “A”

Dice(MyTable, 2, 3) — returns “4”

See Also:

Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Calculations and things

Function and Handler Summary

Regex_SearchStr: Find the first match of a regular expression in a string and

returns "Douze mille trois cent quarante-cinq dollars et 67/100"

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

DollarsToEnglish (amount [, CurrencyCode] [,
languageCode])

Result Type: Text

Definition: Returns the dollar amount expressed in English words. Use this

function for printing the dollar amount on cheques. If your local currency is
GBP, EUR or NPR you will get “Pounds” and “pence” etc, other currencies
will get “Dollars” and “cents”. You can force this by passing the optional
CurrencyCode.

The optional languageCodeparameter specifies the language for output.
English is the default, and currently only French is supported; passing "fr" as
the languagecode will return a French-language result.

Examples: DollarsToEnglish(99)

returns “Ninety nine dollars only”.

DollarsToEnglish(12147.95)

returns “Twelve thousand, one hundred and forty seven dollars and ninety
five cents”.

DollarsToEnglish(0.05, "GBP")

returns “Five pence”.

=DollarsToEnglish(12345.67, "CAD", "fr")

Esc (text)

Result Type: String

Definition: Returns a string that has any string quotes or backslashes in the

input string escaped with \.

Use this function when building a search string that incorporates quoted
data from the database or other user input that may itself contain quotes or
backslashes. If these characters are not escaped when constructing a search
string, the search will fail with a syntax error.

Examples:

Esc("a backquote ` character")

returns "a backquote \` character"

CreateSelection("account", "code = `" + Esc(userVal) + "`")

This sanitises userVal in case it contains a backquote or backslash
character.

ExpandDetail (expressionText [, searchExpression] [,
rangeStart][, rangeEnd])

Result Type: List

Definition: Only available in Forms.

Returns a list of results obtained from evaluating expressionTextin the
context of each of the records in the list subfile for the form. The result of
this function is a list of values and cannot be used in another calculation or
printed on the form. You must pass the result of the function to another
function that accepts a variable number of parameters, such as Count() or
Sum().
Calculations and things

Function and Handler Summary

If the optional searchExpressionparameter is supplied, it is used as a search
function to narrow the selection of list subrecords to which the expression
is applied. searchExpressionshould be a string containing an expression
that evaluates to True or False depending on the values in the list
subrecord.

See Also:

ExpandList: Expand form list values to a parameter list
SubTotal: Subtotal a form list column

ExpandList (listName, expressionText)

If the optional rangeStartand rangeEndparameters are supplied, they are
used to narrow the result to values from only those records in the range.
RangeStartand rangeEndshould be numbers in the range 1-32767. If the
specified range is, for example, 2 for the start and 4 for the end of the
range, then the function result will have 3 values, being the results of the
calculation specified by expressionText for the 2nd, 3rd and 4th records in
the list. (If there are less than four records in the list, then the number of
values in the result will be correspondingly less.)

Note that although the parameters will be evaluated as expressions, you
must pass them to the function as text strings. The ExpandDetail function
itself will evaluate the expressions.

The ExpandDetail function operates on the default selection of subrecords
for the form, and is not affected by the any of the other lists on the form.

Result Type: List

Definition: Only available in Forms.

Returns a list of results obtained from evaluating expressionText in the
context of each of the records in the user selection of the list subfile for the
list whose name is listName. The result of this function is a list of values and
cannot be used in another calculation or printed on the form. You must pass
the result of the function to another function that accepts a variable
number of parameters, such as Count() or Sum().

Note that although the parameters will be evaluated as expressions, you
must pass them to the function as text strings. The ExpandList function
itself will evaluate the expressions.

You cannot use this function in a list column calculation.

Examples: Count(ExpandDetail("Detail.Account"))

returns the number of subrecords in the list subfile.

You cannot use this function in a list column calculation.

Examples: Sum(ExpandList("List1", "Detail.Net"))

returns the sum of the net column of the list named “List1”.

Sum(ExpandDetail("Detail.Net", "Detail.Account = \"1200\""))

ConcatWith(", ", ExpandList("CustCopy", "Detail.Description"))

returns the sum of the net values of all detail lines whose account code is
1200. Notice that the quotation marks in the searchExpressionare escaped
using the backslash.

Sum(ExpandDetail("PayAmount", "1", 1, 15))

can be used to get the sum of the pay amounts for the first 15 invoices in a
cheque remittance advice. Notice that in order to specify the range
parameters, a place-holding search function parameter also had to be
supplied. The value 1 (= true) was used to cause all eligible records to be
selected by the search function.

returns the a string containing the text from all of the detail lines for the
transaction—each one separated by a comma and a space.

See Also:

ExpandDetail: Expand form search result values to a parameter list
SubTotal: Subtotal a form list column

FieldLabel (fieldnametxt [, enumeration])

Result Type: String
Calculations and things

Function and Handler Summary

Definition: Returns the label name of the specified table.fieldname, as

redefined in the Fields section of the MoneyWorks Document Preferences
(see Fields). If no label is found, the fieldname is returned.

If the field is an enumerated field with custom names (such as
Transaction.PaymentMethod or Product.Colour, or Contacts.Role, then you may
supply an enumeration value to get the custom enumeration name.

Examples: FieldLabel("Product.Category1")

Would return “Style”, if the field label has been set to this in the
Preferences, or “Category1” if it is not set.

FieldLabel("Name.Colour", 2)

Would return (in the default case) “Red”, the name of the second colour. If
the colour name for the Name table has been customised then the custom
name will be returned.

FieldLabel("Contacts.Role", 5)

returns the phone number of the earliest name record which has a code
that starts with “A”

Find("product.code", "barcode = '12345'")

returns the product code of a product whose barcode is "12345". This
would be useful when updating product records from a supplier file that
does not use our internal product code.

Find("transaction.sequencenumber", "type = `DI@` and ourref =

`12345@`", 10, "\t")

returns a tab delimited list of the first ten debtor invoices with a number
starting with “12345”

Find("transaction.ourref", "type = `DI@`", 10, ",",

"sequencenumber-")

returns the invoice numbers of the ten most recently entered debtor
invoices as a comma delimited list

Might return "Payables, CEO" (Note that roleis a bitfield rather than an
enumeration—5 is binary 101 indicating two roles).

Find("product.barcode", "code = `12345`")

Find (fileName.fieldNameText, searchFnText [, limit] [,
delim] [, sortFieldText] [, runOnServer])

Result Type: Text (but see below for variant with numeric result)

returns the barcode for a product with code “12345”. This is equivalent to
Lookup(“12345”, “product.barcode”)

Note The fieldnameTextcan be any valid MoneyWorks expression (a simple field

name being itself a simple expression). Thus:

find("transaction.DateToText(TimePosted, -6)", "Status=`P`", 1,

Definition: Returns as a delim separated string the first limit values of the

",", "sequencenumber-")

specified file.fieldnameTextas found by the searchfunction when the file is
sorted by sortFieldText. If limit is not specified, only the first item is
returned; if delimis not specified, the text will be comma separated; if
sortFieldTextis specified, the data will be selected from the first limit
records of the sorted file. If a “-” is appended to SortFieldTextthe file will be
sorted in descending order.

Examples: Find("name.phone", "code = `A@`")

will return a string containing the time of the most recent transaction
posting.

Variant for getting a result count only

Find (fileNameText, searchFnText)

Result Type: Number
Calculations and things

Function and Handler Summary

Definition: Returns a count of the number of records found in file fileNameText
by the search expression. This variant is differentiation from the general
version by not having a dot in the first parameter.

Examples: Find("transaction", "type=`DII` and dueDate < today()")

returns the number of overdue invoices payable to you.

Note: Find("Filename", "1") is optimised to get the number of records in a
file (which otherwise can be quite time consuming for the general).

RunOnServer mode:

In MoneyWorks Datacentre 8.1.9 and later, you can pass true as the 6th
parameter. In this case, Find can construct the resulting text entirely on the
server if more than one record is found. This can improve network performance
for scripts or forms that run on the client, BUT it may behave differently with
respect to numeric or date formats or any undefined behaviour of the
expression in fieldNameTextor the search expression. Be circumspect about
using this option. Be particularly wary of search functions that calculate a
numeric value and compare it to a textual value.

FirstUnlockedPeriod ()

Result Type: Number

Definition: Returns the internal period number of the oldest period that isn't
locked (and can therefore be posted into without unlocking any periods)

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period

TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

GetAllContactEmailsForRole ( nameCode, role [, detailed] )

Result Type: string

Definition: Gets the contact email addresses from the Name identified by
nameCode, for the contact role(s) specified by the role parameter. The
result is a comma-delimited list of email addresses. The role parameter can
be a numeric bitmask specifying multiple roles, or it can be a string
containing a single role name.

Valid role bit values are the powers of 2 from #1 to #8000, and the special
values #10000 for Contact1 and #20000 for Contact2. E.g. #10003 gets
email addresses (if present) for Contact1 and the first and second named
roles (Payables and Receivables, by default)

Valid role names are those from the Document Preferences Fields tab
(Contact Roles list)

If you pass "*" for the optional detailed param, the list will be a tab-and-
newline-delimited table containing all of the contact fields for the matching
contacts, not just the email addresses.

GetAppPreference (preferenceName)

Result Type: text

Definition: Gets application preference values (such as smtp settings) by name.
These are the preferences that live in the registry (on Windows) or the
nz.co.cognito.MoneyWorks.Gold.plist (Mac).

Example: GetAppPreference("useSmtp")
Calculations and things

Function and Handler Summary

Returns 1 (true) if the MoneyWorks Preference "Send emails directly via a
mail server" is on (i.e. using your own smtp, instead of the local mail client).
Otherwise returns 0.

L.GetBalance(today(), "A")

Same as above, but returns the A budget instead of the balance.

GetBalance (searchExpression, PeriodorDate [, Budget])

Availability: In custom reports

Result Type: Number

GetContactForRole (rolebits [, requestedfieldname])

Definition: Returns the balance of the ledger records identified by the search-
Expressionat the end of the period (or the period in which balDate falls).
Note that the Ledger file (not the Accounts file) is searched, so the search
expression has to contain valid ledger fields (AccountCode, Department,
Category, Classification, Type, or Concat). If you want to get budget
information instead of actual, the optional Budget parameter should be “A”
or “B” to indicate the desired budget.

Examples: GetBalance("Type = `IN`", '31/12/2012')

returns the balance of all income accounts at the end of the period which
contains 31/12/2012.

Note: For efficiency when writing reports that iterate over Ledger records, there

is a Ledger method variant of the GetBalance function that applies
specifically to a single, loaded Ledger record.

ledger.GetBalance (DateOrPeriod [, Budget])

Result Type: Number

Definition: Must be used in the context of a selection of ledger records, i.e.
within a ForEach L in Ledgerloop in a report. Returns the balance of the
ledger as at the end of the specified period (or the period identified by the
date). The function will respect the “Include Unposted”, “Cash Basis” and
Breakdown setting when the report is run. If the Budget parameter is
specified (as “A” or “B”), the budget is returned instead of the actual.

Examples: L.GetBalance(today())

returns the balance as at the end of the current period for whatever ledger
account L is referencing (which would be set in a preceding for loop).

Result Type: String

Definition: Must be used in the context of a selection of Name records, i.e.
within a ForEach N in Nameloop in a report. Returns the first contact
(sorted by Order) with any of the requested role bits set. contact1 and
contact2 are assumed to have bit #10000 / #20000 set (even though the
actual role field is only 16 bits).

The result is all fields tab delimited unless a valid field name is supplied, in
which case only that field is returned.

If the field name is "*", then ALL fields of all matching contacts are
returned, tab and newline delimited

Examples: N.GetContactForRole(1, "email")

returns the email address for role1 of whatever name record N is pointing
to. If there is no role1 defined for N, an empty string is returned. If there is
more than one contact defined as a role1, only the first is returned.

Availability: In custom reports (note notin MWScript. In MWScript use

GetAllContactEmailsForRole)

GetDatabaseFields (fileName)

Result Type: text

Definition: Returns a list, separated by "\n", of the fields in the MoneyWorks

internal file fileName.

Example: GetDatabaseFields("transaction")
Calculations and things

Function and Handler Summary

returns a list of the fields in the Transaction table.

Definition: Returns the movement from the period (or the period that which

See Also:

GetDatabaseFieldSize: Get table field sizes from the database schema

GetDatabaseFieldSize (fileName, fieldName)

Result Type: Number

Definition: Returns the type, or if the field is text, the maximum length of the

fieldNamein the internal MoneyWorks file fileName.

Examples: GetDatabaseFieldSize("transaction", "namecode")

returns 11, the maximum length of a namecode in MoneyWorks.

GetDatabaseFieldSize("name", "colour")

returns SHORT, colours being stored as a number in MoneyWorks.

See Also:

GetDatabaseFields: Get table field names from the database schema as a

delimited string

GetDatabaseFiles

Result Type: text

Definition: Returns a list, separated by "\n", of the internal files in MoneyWorks.

Example: GetDatabaseFiles()

GetMovement (searchExpression, fromPeriodOrDate,
toPeriodOrDate[, Budget])

Result Type: Number

contains the from Date) to the period (or the period that contains to Date),
for the Ledger records that match the searchExpression. If you want to get
budget information instead of actual, the optional Budget parameter should
be “A” or “B” to indicate the desired budget.

Examples: GetMovement("Type = `Ex` and Category = `CS`", '1/7/2004',

'31/12/2004', "A")

returns the budgeted movement (for the A budget) from the Jul to Dec
2004 period for expense accounts whose category is CS. Note that the
Ledger file (not the Accounts file) is searched—Category in the ledger file
has the same value as Category1 in the Accounts file.

GetMovement("Type = `IN`", '1/1/2000', today())

returns the movement up to now of all income accounts since Jan 2000
period.

Note: For efficiency when writing reports that iterate over Ledger records, there

is a Ledger method variant of the GetBalance function that applies
specifically to a single, loaded Ledger record._

ledger.GetMovement (fromDateOrPeriod, toDateorPeriod [, Budget])

Result Type: Number

Definition: Must be used in the context of a selection of ledger records, i.e.

within a ForEach L in Ledgerloop in a report. Returns the movement of the
ledger between the specified periods (or the periods identified by the date).
The function will respect the “Include Unposted”, “Cash Basis” and
Breakdown setting when the report is run. If the Budget parameter is
specified (as “A” or “B”), the budget is returned instead of the actual.

Examples: L.GetMovement(periodOffset(CurrentPeriod(), -3),

CurrentPeriod())

returns the change in ledger L’s value (movement) between the current
period, and three periods before, for whatever ledger account L is
referencing (which would be set in a preceding for loop).
Calculations and things

GetOffBalance (searchExpression, dateOrPeriod [,
doBudget])

Result Type: Number

Definition: Returns the sum of the balances of the Offledger records as

identified by the searchExpression. The balances are as at the date or
period specified. If doBudget is non-zero, the budget figures are used.

Definition: Given a tax code and a date, returns the tax rate for that code on

that date.

Function and Handler Summary

From v9.1.1, A "reversed" tax type will return zero from this function (since
reversed rates are not calculated on transactions). You can obtain the actual
reversed rate for reporting purposes by passing TRUE for the third
parameter.

Examples: GetTaxRate("G", today())

Examples: GetOffBalance ("Name=`Student-Junior`", '1/6/6')

Returns the rate for the "G" taxcode as at today, for example 0.15 (15%).

GetOffBalance ("Name=`Student-@`", '1/6/6')

GetTaxRate("G", '1/1/10')

The second example returns the total for all records whose name starts
with “Student-”.

Returns the rate for the "G" taxcode as at 1st January 2010, for example
0.125 (12.5%).

GetPlugins (pluginType, which [, extension])

Result Type: Text

Note: Because the rate is determined by the ChangeOver Datefor the tax in the
Tax Rate table, the function is not able to determine the correct rate for tax
changes prior to the date of a tax change (if any) before the last tax rate
change.

Definition: Returns a list, separated by "\n", of the designated plug-ins.

pluginTypemust be either "reports" or "forms", and whichmust be one of
"all", "standard" or "user". extensionis required to specify the type of form
(e.g. invc for invoices, stmt for statements).

GetUIField (windowID, fieldname)

Result Type: Text

Example: GetPlugins("reports", "user")

Returns a list of custom reports (as found in the MoneyWorks Custom Plug-
ins/Reports folder).

GetPlugins("forms", "all", "invc")

Returns a list of all available invoice forms.

GetTaxRate (taxCode, date [,bReversed])

Result Type: Number

Definition: Gets the value out of a user-interface field. Useful for context-

sensitive filter functions such as "products the purchase's supplier sells”.
See GetFieldName for details on how to get field names.

In v9 and later, the windowID can be the symbolic identifier for the window (e.g.
"F_TIMESHEET"). In earlier versions, the windowID had to be numeric, and the
numeric IDs were not documented.

Examples: When you are entering a purchase order, you may want the product
list to display only the products supplied by the supplier on whom the order
is being placed. This involves a filter for the product choices list which needs
to get the supplier code out of the open transaction window.

Search Expr (for They Supply item choices filter): Supplier =
GetUIField("F_TRANS", `E_NAME`)
Calculations and things

Function and Handler Summary

To filter product choices for the timesheet to only show products that are
budgetted for the job:

[Jobsheet:job=GetUIField("F_TIMESHEET", "E_CODE") and

status="BU"][product]

Definition: Returns the first N items from a textual list of items. The list can be

delimited by any ascii (not unicode) character, as specified by the delimiter
parameter. If numberOfItemsis negative, then Head returns all but the last
abs(numberOfItems) items of the list. This can be useful for chopping off
the total line of an analysis

See Also: GetFieldValue is preferred for scripts. GetFieldValue takes a

Examples: Head ("foo,bar,baz", 2, ",")

windowRef and a symbolic or numeric field id. However, GetUIField can be
used from ordinary expressions (whereas GetFieldValue is only available in
scripts).

returns the first 2 elements of the comma-delimited list: i.e: "foo,bar".

HavePicture (mnemonic)

Result Type: Boolean

Definition: Tests for existence of an image file related to a record identified by

an image mnemonic. Image mnemonics are a string beginning with
"transaction:", "product:", or "key:" and followed by a key value. The special
mnemonic "logo:" is also supported to identify the company logo for the
document.

Examples:

HavePicture("product:BC100")

returns true if product BC100 has a product image.

HavePicture("transaction:1234")

returns true if transaction sequence number 1234 has an attached image.

HavePicture("logo:")

returns true if the document has a company logo.

Head (listText, numberOfItems, asciiDelimiter)

Result Type: Text

Head("a,b,c,d,e,f,g,h", -2, ",")

returns "a,b,c,d,e,f".

See Also:

Dice: Get a subcomponent of a delimited tabular string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

HexDecode (hextext)

Result Type: Text

Definition: hextext is a string containing hexadecimal data. Output will be a
string consisting of bytes corresponding to the hexadecimal data.

Example: HexDecode("48656c6c6f00")
Calculations and things

Result: "Hello"

HexEncode (text)

Result Type: Text

Definition: Returns a hexadecimal-encoded string corresponding to the bytes in

text.

Example: HexEncode("Hello")

Result: "48656c6c6f00"

HMAC (data, key, hash)

Result Type: Text

Definition: Returns a string containing the HMAC (keyed-hash message

authentication code) for the given data and key and named hash function.
The hash may be one of "sha256", "sha512", "sha1", or "md5" (case-
sensitive). An HMAC-SHA1 is required for the OAuth1 protocol. See also
Checksum if you just need a simple hash.

The result is hex-encoded. If you need the hash in binary form (say to re-
encode as Base64), you can use HexDecode, provided you are running v9.1
or later.

Example: HMAC("my message", "my key", "sha256")

Result:
"59847ff865a5613884824dd37a34a8c0862d9ce76b9a1baa150921b447dd8760"

See Also:

Checksum: Cryptographic checksum of a string

If (condition, result1, result2)

Result Type: depends on parameters

Function and Handler Summary

Definition: If condition is “true”, returns the value of result1, otherwise returns
the value of result2. Condition may be a Boolean value or a numeric value.
A numeric value is considered to represent “true” if it is not zero. Result1
and result2 do not have to be of the same type.

Examples: If(6 > 5, "Normal Universe", "Start Worrying")

should return “Normal Universe”.

If(Transaction.Gross >= 0, "Invoice", "Credit Note")

returns “Invoice” or “Credit Note” depending on whether Gross is positive
or negative.

Note: It is important to realise that this is just a function; It is not a flow-control
construct. Thus, all parameters will be evaluated, regardless of the truth
value of the first parameter. Thus

=if(X <> 0, Mod(10, X), 0)

will always give a divide-by-zero error if X is 0. To work around this, use the
Valfunction to “defer” evaluating the parameter:

=val(if(X <> 0, "Mod(10, X)", 0)

This avoids ever trying to take a Modulo 0.

Import (text [, mapname])

Result Type: Number

Definition: Imports the text into the MoneyWorks file using the map mapname
(which must be installed). If the text is XML, the mapname can be omitted.
The sequence number of the last record imported is returned, or -1 if an
error occurred.

Examples:

Import(someText, "myMap.impo")

Import(someXML)
Calculations and things

IncrementUserSeq (key)

Result Type: string

Definition: Atomically increments the User.Data value of a user record identified
by key (creating the record with a data value of 0 if it does not already
exist). Returns the incremented value. Although User.Data is a text field,
IncrementUserSeq will increment the numeric part of it if it has a non-
numeric prefix or suffix.

To set an initial value for a sequence, you can use SetPersistent("user",
key, NULL, CreateArray("Data", initialValue))

Example:

constant key = "MYSEQ"

on Load

// set initial value
SetPersistent("user", key, NULL, CreateArray("Data",

"XY-998-Z"))

// increment 3 times
Syslog(IncrementUserSeq(key))
Syslog(IncrementUserSeq(key))
Syslog(IncrementUserSeq(key))

//    values returned:
//
//    XY-999-Z
//    XY-1000-Z
//    XY-1001-Z

end

Int (number)

Result Type: Number

Definition: Returns the integer part of number.

Examples: Int(3.1415926)

returns 3.

Int(-57.9999)

returns -57.

Function and Handler Summary

IntersectSelection (sel1, sel2OrExprText, [sortExpr],
[descending])

Result Type: Selection

Definition: Returns a new selection which is the intersection of the given

selections. The new selection may optionally be sorted by passing a sort
expression. The first selection must be a selection variable; the second one
may be an existing selection variable or can be specified on the fly using a
search expression. Obviously, both selections must be for the same table.

Examples: IntersectSelection(t1, "type = `DI@`")

returns a selection containing the transactions in the previous created
selection t1 which are debtor/sales invoices.

intersectSelection(d1, "detail.stockcode=`B@`")

returns a selection containing all detail lines in the existing selection d1
which have a product code starting with B.

See Also:

CreateSelection: Create a selection of records
DisplaySelection: Display standard list window for a given selection of

records

RecordsSelected: Count records in a selection or resulting from a (meta)

search

SumDetail: Add up a field for details matching a search
SumSelection: Add up a field for records matching a search
UnionSelection: Add the result of another search to a selection

Left (string, count [, boolInBytes])

Result Type: Text

Definition: Returns the left-most count characters from string.
Calculations and things

Function and Handler Summary

Examples: Left("nybble", 3) — returns “nyb”.

returns 0.

If boolInBytesis true or IN_BYTES (which is a constant with value true), then the
count is regarded as bytes, not characters. This option should only be used
when the string is known to be pure ASCII. It is much faster because it does not
account for multibyte unicode characters.

Log10 (number)

Result Type: Number

See Also:

Definition: Returns the base 10 logarithm of the number.

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

Example: Log10(1000)

Returns 3

Log2 (number)

Result Type: Number

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Length (string [, boolInBytes])

Result Type: Number

Definition: Returns the length, in characters, of string.

If boolInBytesis true or IN_BYTES (which is a constant with value true), then the
return value is a byte count instead of a character count. This option should only
be used when the string is known to be pure ASCII. It is much faster because it
does not account for multibyte unicode characters. See also ByteLength

Definition: Returns the base 2 logarithm of the number.

Example: Log2(8)

Returns 3

LogN (number)

Result Type: Number

Definition: Returns the natural logarithm of the number(i.e. a logarithm to the

base e(2.71828...).

Example: LogN(2.71828)

Returns 0.99999933

Lookup (code, fieldname)

Examples: Length("Ban Antidisestablishmentarianism!")

Result Type: depends on type of field identified by fieldname.

returns 33.

Length("")
Calculations and things

Function and Handler Summary

Definition: Returns the value of the field identified by fieldname, where

Examples: Lower("BANG!")

fieldname is a string of the form "file.field" which identifies a field in one of
the MoneyWorks database files. MoneyWorks finds the record in the file
whose code matches the code parameter and returns the value of the
requested field from that record. The files which can be looked-up are:
Account, Department, Names, Product, Job, Login, User and TaxRate.
Transaction and BankRecs can also be looked up, but only by specifying a
sequencenumber for the fieldname. A lookup on the Log file will always
return the latest entry for a valid key. The fields available are those listed in
Appendix A—Field Descriptions. The Findfunction offers a more flexible
form of lookup based on a MoneyWorks search expression.

returns “bang!”.

See Also:

Proper: Uppercase initial letters of words in a string
Upper: Uppercase a string

MakeGUID ()

Result Type: string

Examples: Lookup("BANK1", "Account.Description")

Definition: Returns a 36-character Globally Unique Identifier.

returns “Main Bank Account” (assuming that account exists and has that
name).

Lookup(If(PositionInText(Detail.Account, "-"),

Left(Detail.Account, PositionInText (Detail.Account, "-") - 1),

Availability: Version 8.1 and later

Match (number, number, ...)

Detail.Account), "Account.Description")

Result Type: Number

returns the account description of the account code in the current detail
line. The somewhat complex first argument extracts the basic account code,
since the Detail.Account field may have a department suffix. You could use a
similar technique to extract the department code and look up the
department description.

Definition: Returns the position of the parameter that matches the first

parameter

Examples: Match(17, 4, 17, 6, 5)

Lookup("N", "TaxRate.Rate2" )

returns 12.5, which is the current GST rate.

Lookup("CUR/USD", "Offledger.Description")

Returns the description of the Currency “USD”. Note that for the Offledger
file, the key is KIND/NAME. User entered records have a kind of “USR”.

Lower (string)

Result Type: Text

Definition: Returns string converted to lower case.
returns 2.

Max (number, ...)

Result Type: Number

Definition: Returns the highest of the numbers passed as parameters.

Examples: Max(5, -1000, 10)

returns 10.



Calculations and things

Function and Handler Summary

Mid (string, start, count [, boolInBytes])

returns -1000.

Result Type: Text

Mod (dividend, divisor)

Definition: Returns a substring of string starting at startof length count.

Result Type: Number

Examples: Mid("Fish and chips", 6, 3)

Definition: Returns the remainder when dividend is divided by divisor.

returns “and”.

If boolInBytesis true or IN_BYTES (which is a constant with value true), then the
start and count are regarded as byte offsets, not characters. This option should
only be used when the string is known to be pure ASCII. It is much faster
because it does not account for multibyte unicode characters.

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Min (number, ...)

Result Type: Number

Definition: Returns the lowest of the numbers passed as parameters.

Examples: Min(5, -1000, 10)

Examples: Mod(10, 8)

returns 2.

Month (date)

Result Type: Number

Definition: Returns the month-of-year of the date.

Examples: Month('8/12/57')

returns 12.

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
Calculations and things

WeekOfYear: Convert a date to a week number
Year: Year of a date

NumToEnglish (integer [, language])

Result Type: Text

Function and Handler Summary

NumToText (number [, format])

Result Type: Text

Definition: Converts the given number to a text string using the numeric

formatting selected for the calculation box, or that specified in the optional
formatparameter (see table).

Definition: Returns the number (which must be a positive integer) expressed in
words in the nominated language (by default English). The only other
language currently supported is French.

Examples: NumToText(30 + 6, 4)

returns “36 DB”.

Examples: NumToEnglish(1427)

returns “One thousand, four hundred and twenty seven”.

NumToEnglish(1427, “Français”)

returns “Mille quatre cent vingt-sept”,

as does NumToEnglish(1427, “Fr”)

NumToPeriod (PeriodIndex)

Result Type: Period

Pad (text, width [, padChar] [, justify = "L|R"])

Result Type: Text

Definition: Pads text to the specified width. By default, if text is a numeric
string, it is padded to the right with leading zeroes; otherwise it is left
padded with spaces. This can be overridden by specifying padChar and
justify. If text is longer than width it is truncated.

Maximum pad width is 255.

Examples: Pad("1", 4)

Definition: Returns the internal period number of the period indexed by

returns “0001”

PeriodIndex. The first period has a period index of 1 (but will have a period
number based on y*100+p, where y is the number of the financial year in
MoneyWorks, and p is the number of the period in that year, with the first
period being 1.

Examples: NumToPeriod(1)

Returns the first available period.

NumToPeriod(periodtonum(currentper)-3)

Returns the period number of the period 3 periods before the current
period. This is equivalent to PeriodOffset(CurrentPer, -3)

Pad("1", 4, "0", "L")

returns “1000”

Pad("A", 4)

returns “A ”

Pad("1", 4, " ", "L")

returns “ 1”
Calculations and things

ParseCSV (csvtext [, fieldSeparator] )

Result Type: Text

Definition: Manually parsing CSV is tricky, because it may contain quoted fields
that themselves contain commas and possibly even quoted quotes. This
function converts such CSV to easily sliceable tab-delimited text. By default
the field separator is assumed to be a comma (the C in CSV), but in some
locales it is also common to use a semicolon to separate fields in case
comma is used as a decimal separator. You can optionally pass a single ASCII
character as the second parameter and that will be used as the separator.

Examples: ParseCSV(`1, 2.50, "three, four", 5\n`)

returns “1\t2.50\tthree, four\t5\n”

Availability: v9.1.6 and later.

PeriodName (period)

Result Type: String

Definition: Returns the name of period (including the financial year name).

Examples: PeriodName(Transaction.Period)

returns "Apr:2010/11"

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period

Function and Handler Summary

TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

PeriodOffset (period, offset)

Result Type: period

Definition: Returns the period number that is offset periods from period.

Because periods are based on (Year * 100 + period), you can’t just subtract
1 from a period number to give you the previous period (e.g. in the 12
period financial year the last period for year 5 is 512; the following period is
601).

Examples: PeriodOffset(CurrentPer, -6)

returns the internal number of the period that is 6 periods before the
current period.

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Calculations and things

Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

PeriodToDate (period)

Result Type: Date

Definition: Returns the last day of the nominated period.

Examples: PeriodtoDate(CurrentPer)

returns the date of the last day of the current period.

PeriodtoDate(transaction.period)

Returns the last date of the period for transaction.

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

Function and Handler Summary

PeriodToNum (period)

Result Type: Integer

Definition: Returns a period index. This is suitable for doing ageing calculations,

and can also be used to iterate through report For loops.

Examples: PeriodtoNum(CurrentPeriod) -
PeriodtoNum(transaction.period)

returns 1 if transaction.period is equivalent to Jun:2006 and the current
period is equivalent to Jul:2006; returns 2 if the current period is Aug:2006,
and so on.

In a report For loop, the following:

Per ="1..." +periodtonum(currentper)

will step through each period. Within the loop you can then get the internal
period number by NumToPeriod(Per).

PositionInText (string, pattern [, startChar] [, boolInBytes])

Result Type: Number

Definition: Returns the (1-based) character position of the first occurrence of
patternin string. If startCharis specified, the characters in string up to
startCharare not tested for pattern. If the text is not found, returns 0.

If boolInBytesis true or IN_BYTES (which is a constant with value true), then the
startChar and the return value are in bytes, not characters. This option should
only be used when the string is known to be pure ASCII. It is much faster
because it does not account for multibyte unicode characters.

Examples: PositionInText("Birthday", "day")

returns 6.

PositionInText(song, colour, PositionInText(song, colour) + 1)
Calculations and things

Function and Handler Summary

Given that song contains “Red, red wine”, and colour contains “red”, this
will return 6, which is the position of the second occurrence of “red” in
“Red, red wine”.

Note: When searching for a text constant, the equality operator can be used

with the pattern enclosed in “@” symbols, e.g. "@day@". For example, if
myString = "MoneyWorks rocks!", then the comparison:

myString = "@works@"

would return 1 (true).

Pow (value, exponent)

Result Type: Number

Definition: Returns the result of value raised to the exponent power.

Examples: Pow (10, 3)

returns 1000.

Pow (10, -2)

returns 0.01.

ProductSOHForLocation(prodcode [, loc])

Result Type: number

Definition: Get the current SOH for the product at the specified location. An

empty string for location denotes the Default Location. For all locations, you
can pass "@" or omit the location parameter (but this is the same as
Product.SOHCurrent so you should use that instead if you want total SOH).

Proper (string)

Result Type: Text

Definition: Returns string with the first letter of every word capitalised, and all

other characters in lower case.

Examples: Proper("JOSEPH SMITH")

returns “Joseph Smith”.

See Also:

Lower: Lowercase a string
Upper: Uppercase a string

Quarter (DateOrPeriod [, numQuarters=4] [, prefix="Q"])

Result Type: Text

Definition: Returns a "quarter label" corresponding to the given period or date.
For dates the quarter is based on the calendar year; for periods it is based
on the financial year. It can also be used for half-years etc. using the
optional parameters. These labels make useful calculated breakdown values
in the Analyse function or Analysis reports.

Examples: (note: dates are d/m/y)

Quarter('1/4/05') — returns "2005:Q1", .

Quarter('23/7/05’) — returns "2005:Q3"

Quarter('1/11/05', 2, "H") — returns "2005:H2"

Quarter(Transaction.Period) — returns the financial year quarter into
which the transaction was/will be posted.

Quarter(Transaction.TransDate) — returns the calendar year quarter

Random (modulus)

Result Type: Number

Definition: Returns a random integer uniformly distributed between 0 and

modulus - 1.
Calculations and things

Examples: Random(5)

will return a random number between 0 and 4.

RecordsSelected (selection)

Result Type: Number

Definition: Returns the number of records found in named selection.

Examples: RecordsSelected(tSel)

returns the number of records in the selection tSel, which would have
previously been created using the createSelectionor intersectSelection
function, as in the following:

returns the number of highlighted records in the Names file, or, if none are
highlighted, the number of name records in the found set, or, if the names
list window is not open, the total number of name records in the file.

Function and Handler Summary

This is exactly the same behaviour as Find(filename, search) — a case of
convergent evolution where two functions have expanded their functionality
until they end up doing the same thing.

See Also:

CreateSelection: Create a selection of records
DisplaySelection: Display standard list window for a given selection of

records

IntersectSelection: Intersect a selection with the result of another search
SumDetail: Add up a field for details matching a search
SumSelection: Add up a field for records matching a search
UnionSelection: Add the result of another search to a selection

tSel = createSelection("Transaction", "type = 'DII' and

status='P'")

Regex_Match (string, regex)

which creates a selection of the outstanding (posted) sales invoices.

Result Type: Boolean

Variant of RecordsSelected that duplicates the functionality of the variant of
Find()

RecordsSelected (file, metaSearch)

Result Type: Number

Definition: Returns the number of records found in the file that match

metaSearch (see metasearch mnemonics). MetaSearch is one of “*” or “**”,
whose function is explained in the two examples below. See also the first
form of Find().

Examples: RecordsSelected("Transaction", "**")

returns the number of highlighted transactions (or 0 if none are
highlighted).

RecordsSelected("Name", "*")

Definition: Returns 1 if the string matches the regular expression regex. This

function calls through to the standard C++ regex_match function using the
default regex mode. Matching is case-sensitive, and the regular expression
must match the entire string.

In v9.1.3 and later, you can put (?i) at the start of your regular expression to
request case-insensitive matching.

Examples: Regex_Match("foo.txt", ".*\.(txt|TXT)")

returns 1.

Availability: v8.1.7 and later.

Warning: Some people, when confronted with a problem, think "I know, I'll use

regular expressions". Now they have two problems—Jamie Zawinski
(attributed)
Calculations and things

Function and Handler Summary

If you just want a simple, case-insensitive text match, use the = or == operators
(the former may have an @ wildcard at the end, or start and end; the latter
ignores @ wildcards).

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Regex_GetMatches (string, regex)

Result Type: Array

Definition: Returns an array of tokens that match the parenthesised

subexpressions in the regular expression

Examples:

on Parse_File(f)

foreach line in textfile f

let a = Regex_GetMatches(line,

"([0-9]+)\t([^\t]*).*\t([^\t]*)")    // get first, second, and last
tab-delimited fields from line, only when first field is numeric

if CountElements(a)

// a[0] is the full match
syslog(a[1] + " : " + a[2] + " : " + a[3])

endif

endfor

end

parsing this file:

heading
-----------
1    foo    bar    baz    this
2    foo    bar    baz    is
3    foo    bar    baz    the
ignore    this line
4    foo    bar    last
5    foo    token

outputs

1 : foo : this
2 : foo : is
3 : foo : the
4 : foo : last
5 : foo : token

Availability: In MWScript in v9.1 and later.

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Regex_Replace (string, regex, replacementex)

Result Type: Text
Calculations and things

Function and Handler Summary

Definition: Returns stringwith every occurrence of regexreplaced with
replacementex. Regexis a regular expression. Replacementexis an
expression whihc can contain metacharacters referring to the sequences
matched in the regualr expression. This function calls through to the
standard C++ regex_replace function using the default regex mode.

Definition: Returns the 1-based position in the string where the first match for
the given regular expression is found, or 0 if there is no match. To find
additional matches, you can specify a 1-based offset specifying which
character to start searching from. The result will still be an offset from the
start of the string.

Examples: Regex_Replace("Quick brown fox", "a|e|i|o|u", "[$0]")

Examples: Regex_Search("Some 45 text 876335 more text", " [0-9]{5}")

returns “Q[u][i]ck br[o]wn f[o]x”.

returns 13 (the regex matches a space followed by at least 5 digits).

Availability: v8.1.7 and later.

Availability: v9 and later.

Warning: Some people, when confronted with a problem, think "I know, I'll use

See Also:

regular expressions". Now they have two problems—Jamie Zawinski
(attributed)

If you just want a simple (non-regex) text replacement, see Replace

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Regex_Search (string, regex [, startOffset])

Result Type: Number

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Regex_SearchStr (string, regex)

Result Type: String

Definition: Returns the matching text in the string for the first match for the

given regular expression, or an empty string if there is no match.

Examples: Regex_SearchStr("Some 45 text 876335 more text", "

[0-9]{5}")

returns " 87633"(the regex matches a space followed by at least 5 digits).
Calculations and things

Availability: v9.1 and later.

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Function and Handler Summary

Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

RemoveTrailing (string, count [, boolInBytes])

Result Type: Text

Definition: Truncates a string, removing the rightmost count characters

RemoveLeading (string, count [, boolInBytes])

Examples: RemoveTrailing("nybble is half a byte", 3) — returns “nybble

Result Type: Text

Definition: Returns the remainder of the string after removing the specified

number of characters from the beginning.

Examples: RemoveLeading("nybble", 3) — returns “ble”.

If boolInBytesis true or IN_BYTES (which is a constant with value true), then the
count is regarded as bytes, not characters. This option should only be used
when the string is known to be pure ASCII. It is much faster because it does not
account for multibyte unicode characters.

Availability: v9.0.8 and later

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string

is half a b”.

If boolInBytesis true or IN_BYTES (which is a constant with value true), then the
count is regarded as bytes, not characters. This option should only be used
when the string is known to be pure ASCII. It is much faster because it does not
account for multibyte unicode characters.

Availability: v9.0.8 and later

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string
Calculations and things

Function and Handler Summary

RemoveLeading: Remove characters from the start of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Replace (string, pattern, txt)

Result Type: Text

Definition: Analogous to the Advanced Replace command, this replaces the

values in the specified field by the result of the expression, for the records
identified by the searchxExprTextor in the selection.

Examples:

ReplaceField("product.sellPrice", "category1=`BRONZE`",

"sellPrice*1.20")

increases the sell price for all products whose category1 is "BRONZE" by
20%. The return value is the number of products that were changed.

Definition: Returns stringwith every occurrence of patternreplaced with txt.

ReplaceField("transaction.colour", "gross>10000", "`red`")

Examples: Replace("Munger rhymes with plunger", "ung", "ov")

returns “Mover rhymes with plover”.

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Sets the colour of all transactions with a gross more than $10,000 to red.
The number of transactions that were changed is returned.

Note: As this function changes data (and there is no undo), it should be used

with extreme caution.

Developer Note: If you are automating updates to individual records using

Replacefield from a script (or REST client), such that you will be executing it
a lot, be sure to use a search on an indexed, unique field of the record you
are updating. Generating many automated searches of a non-indexed field
would cause unnecessary server load.

Right (string, count [, boolInBytes])

Result Type: Text

Definition: Returns the right-most count characters from string.

Examples: Right("Right or Left", 4)

returns “Left”.

ReplaceField (fileDotFieldname, selection |
searchxExprText, expression)

Result Type: Number

If boolInBytesis true or IN_BYTES (which is a constant with value true), then the
count is regarded as bytes, not characters. This option should only be used
when the string is known to be pure ASCII. It is much faster because it does not
account for multibyte unicode characters.
Calculations and things

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

Round (number, places [, mode])

Result Type: Number

Definition: Returns number rounded to placesdecimal places. Bankers rounding

is used by default.

Examples: Round(457.9865, 2)

returns 457.99.

Round(457.9865, 0)

returns 458.

Round(457.9865, -1)

returns 460.

In v9.0.1 and later, the optional mode parameter can be used to specify how to
treat halves (i.e. an exact 5 at the place to be rounded away). Valid mode
parameters are `RoundHalfEven` (i.e. Banker's or Gaussian rounding, the
default), and `RoundHalfAwayFromZero` (primary school rounding; effectively
Function and Handler Summary

always rounding a half cent "up").

SetAppPreference (preferenceName, value)

Result Type: none

Definition: Sets application preference values (such as smtp settings) by name.
These are the preferences that live in the registry (on Windows) or the
nz.co.cognito.MoneyWorks.Gold.plist (Mac). Note: This function cannot set
the safe scripting paths preference; the user needs to do that.

Example: SetAppPreference("useSmtp", true)

Availability: MWScript in v9.2.1 and later

SetBudget (Budget, LedgerCode, Date, Value)

Definition: Sets the nominated Budget for the nominated LedgerCode in the

period determined by the Date to Value. If the account is departmentalised,
the department must be specified as a suffix (e.g. “3600-JB”)

This command is only available to scripts.

Examples: SetBudget( "A", "10", '1/4/14', 240)

Sets the A budget for account “10” to 240 for the Apr 14 period.

SetFlag (num, num)

Result Type: Number

Definition: Returns the bitwise OR of the two integers. Use this function in

Advanced Replace to set certain flags.

Example: SetFlag(#8000, #0001)

returns 37269 (#8001)

If used in the Advanced Replacefor the Product list:



Calculations and things

Function and Handler Summary

Replace: Set Flags to SetFlag(Flags, #400000)

See Also:

Sets the flag that controls the Update price when purchased setting in a
Product, turning the checkbox off (because of reverse logic of this particular
flag).

See Also:

ClearFlag: Bitwise bit clear
TestFlags: Binary AND

Sign (num)

Result Type: Number

Definition: Returns -1 if num is less than zero, and +1 if num is greater than or

equal to zero

Examples: sign(-3.2)

returns -1

Slice (listText, itemNumber, delimiter)

Result Type: Text

Definition: Returns one item from a textual list of items. The list can be

delimited by any ASCII character. A delimiter of "\n" is useful for slicing out
a row from the result of the Analyse() function.

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Tail: Get some elements from the end of a delimited string
Trim: Remove whitespace from beginning and end of a string

SOHForLocation (location)

Result Type: Number, being the stock on hand at the indicated location

Definition: Given the context of a product "p", such as in a foreach p in

product loop, returns the stock on hand for the product referenced by p at
the specified location. For the default location, use an empty string as the
parameter.

Examples: p.SOHForLocation("NY")

Examples: Slice ("foo,bar,baz", 2, ",")

returns the stock on hand for the product referenced by p at location "NY".

returns the second element (“bar”) of the comma-delimited list.

Note: Use p.stockonhand to get the total stock on hand across all locations.

Note The "\n" delimiter behaves slightly differently, in that it is not removed

from the element returned. Thus

Availability: In custom reports. In a script, use ProductSOHForLocation(p.code,

loc)

Slice ("one\ttwo\tfoo\nthree\tfour\tbar\nfive\tsix\tbaz", 2,

StocktakeNewQtyForLocation (location)

"\n")

returns “three\tfour\tbar\n”.

Result Type: Number, being the new stock quantity at the indicated location
Calculations and things

Function and Handler Summary

Definition: Given the context of a product "p", such as in a foreach p in
product loop in a report, returns the new stock take quantity for the
product referenced by p at the specified location. For the default location,
use an empty string as the parameter.

Examples: p.StocktakeNewQtyForLocation("")

returns the new stock take quantity for the product referenced by p at the
default location.

Availability: In custom reports.

Note: Use p.StockTakeNewQty to get the new stock take count across all

locations.

See Also:

SetStocktakeForLocation: Update the stocktake count for a product]
StocktakeStartQtyForLocation: Get the stocktake starting snapshot quantity

for a product for a given location

StocktakeStartQtyForLocation (location)

Result Type: Number, being the start stock take at the indicated location

Definition: Given the context of a product "p", such as in a foreach p in
product loop in a report, returns the start stock take quantity for the
product referenced by p at the specified location. For the default location,
use an empty string as the parameter.

Examples: p.StocktakeStartQtyForLocation("Auckland")

returns the start stock take quantity for the product referenced by p at
location "Auckland".

Availability: In custom reports.

Note: Use p.StockTakeStartQty to get the start stock take count across all

locations.

See Also:

SetStocktakeForLocation: Update the stocktake count for a product]

StocktakeNewQtyForLocation: Get the current stocktake quantity for a

product for a given location

Sort (tabDelimTable, sortColumn1, [sortType],
[descending], [skipfirst])

Result Type: A tab/newline delimited table such as is returned from Analyse()

Definition: Sorts a tab/newline delimited table. sortColumn is the column

number to sort by, where 1 = leftmost column, and a negative value counts
from the right (i.e -1 = rightmost column). If descending is 0, the table is
sorted in ascending order, otherwise it is sorted in descending. For an
alphabetic sort, set sortType to SortCaseSensitive or
SortCaseInsensitive; to treat the column as numeric, set sortType to
SortNumeric. If skipfirst is true, the first row of the table is not sorted (i.e.
first row stays at the top of the table—use when the table has headings).

As a special case, if the first parameter is a table type (from CreateTable),
the Sort function will convert it to tabular text, sort it, and then convert the
result back to a table type.

Note: In MoneyWorks versions prior to 9.2, the sortType parameter was a

boolean with true (1) indicating numeric and 0 indicating case insensitive
alphabetic. Case insensitivity applies only to the ASCII codepoint range.

Examples: If MyTable is “A\t1\t2\nB\t3\t4\n\C\t5\t6”, as shown below:

A

B

C

1

3

5

2

4

6

Sort(MyTable, 2, 1, 1) returns

C

B

5

3

6

4
Calculations and things

A

1

2

Sort(MyTable, 2, 1, 1, 1) returns

A

C

B

1

5

3

2

6

4

i.e. first row was heading.

See Also:

CreateTable: Create an empty accumulator table
TableAccumulate: Accumulate numeric column data for a key
TableAccumulateColumn: Accumulate data in one column for a key
TableFind: Look up a key in the table
TableGet: Extract data for a key or index found with TableFind
Transpose: Transpose a tabular delimited string

Sqrt (num)

Result Type: Number

Definition: Returns the square root of num, where num >= 0.

Examples: sqrt(2)

returns 1.41421...

SuggestNameCode (Name)

Result Type: text

Definition: Given a customer/supplier Name, returns the next available name
code in the sequence. The code is constructed according to the "Code
assignment for new names" settings in the Terms Preferences. This function
is intended to facilitate importing.

Function and Handler Summary

Example: SuggestNameCode("Smith and Brown)

Returns for example SMI00.

Note: As a new code is returned regardless of whether the customer/supplier
name exists or not, it is up to you to determine that this is in fact a new
customer/supplier. You can use the Find() function to achieve this.

SubTotal (listNameDotColumnName)

Result Type: Number

Definition: Only available in forms.

Returns the total of all numbers printed in the named column of a list for
the current record. The column must contain numeric data. ColumnName
should be a string of the form: "listname.columnName". You must name the
list using the List Options command so that you can refer to it.

You must set the Always Calculate check box for a calculation that uses the
SubTotal function, since the value of the function will be different for each
page of a multi-page form.

Examples: SubTotal("myList.Column2")

returns the current subtotal for the column whose result name is
“Column2” in the list named “myList”.

See Also:

ExpandDetail: Expand form search result values to a parameter list
ExpandList: Expand form list values to a parameter list

Sum (number, ...)

Result Type: Number

Definition: Returns the sum of the parameters, which should all be numbers.

Examples: Sum(14, 2, 6.35)
Calculations and things

returns 22.35.

SumSelection ("filename.expression", searchExprOrSel)

Function and Handler Summary

Sum(ExpandDetail("Detail.Net"))

Result Type: Number

returns the sum of all of the detail.net values in an invoice/receipt form.

SumDetail ("expression", detail.searchExpr [,
transaction.searchExpr])

Definition: Returns the sum of the nominated expression (which should be
numeric) for the search expression for the specified filename. You may
alternatively pass a selection variable instead of a string containing a search
expression. When summing detail lines, use the SumDetail function.

Result Type: Number

Examples:

Definition: Used to get the sum of the nominated expression (which should

return a numeric result) for the found detail lines of the found transactions.
The detail lines to be found are identified in the first search expression,
whereas the second expression identifies which transactions to choose. If
the transaction search is not specified, all transactions will be searched.

Examples:

SumDetail("detail.stockqty", "detail.stockcode = \"CA100\"",

"type = \"CI@\" and transdate > '30/4/06')")

Returns the quantity of product CA100 purchased since April 06.

SumDetail("detail.stockqty*(detail.unitprice -

detail.costprice)", "detail.stockcode = \"B@\"", "type = \"DI@\"

and period = datetoperiod('30/4/06')")

Returns the total margin on all products starting with “B” that were
invoiced in April 2006.

See Also:

SumSelection("transaction.gross-amtpaid", "type = \"DII\"")

Returns the sum of all outstanding invoices (including unposted).

SumSelection("Name.dbalance", "D90Plus > 0")

Returns the total outstanding for all debtors who have invoices over 90 days
old.

SumSelection("Name.dbalance-dcurrent", "DBalance > D.Current")

Returns the total overdue for all debtors with overdue amounts.

MWScript:

let sel = CreateSelection("Name", "*highlight")
let sum = SumSelection("Name.dbalance-dcurrent", sel)

See Also:

CreateSelection: Create a selection of records
DisplaySelection: Display standard list window for a given selection of

records

CreateSelection: Create a selection of records
DisplaySelection: Display standard list window for a given selection of

IntersectSelection: Intersect a selection with the result of another search
RecordsSelected: Count records in a selection or resulting from a (meta)

records

search

IntersectSelection: Intersect a selection with the result of another search
RecordsSelected: Count records in a selection or resulting from a (meta)

SumDetail: Add up a field for details matching a search
UnionSelection: Add the result of another search to a selection

search

SumSelection: Add up a field for records matching a search
UnionSelection: Add the result of another search to a selection
Calculations and things

TableAccumulate (tab, key, value1, ...)

Transpose: Transpose a tabular delimited string

Function and Handler Summary

Result Type: Table

TableAccumulateColumn (table, key, columnNum, value)

Definition: Accumulates values into a table of key/value(s) vectors, allowing you
to build your own analysis tables. Each time TableAccumulate is called, it
locates the row in table tab whose first value is key, and adds the specified
values to it. If no row is found, one is created. You would normally use
TableAccumulate in a report Forloop when you are stepping through a
range of records. Note that the first row of the resultant table contains a
heading.

Examples: The following shows how you would use this in a report, with each
calculation being a cell calculation with an Ident of MyTable. The first
calculation initialises the table; the subsequent ones accumulate a count
and a value.

myTable = CreateTable()
myTable=TableAccumulate(MyTable, "A", 1, 3.5)
myTable=TableAccumulate(MyTable, "B", 1, 4)
myTable=TableAccumulate(MyTable, "A", 1, 2.5)

Result Type: Table

Definition: Accumulates the value into the specified column of a table. The
table must already have been dimensioned to have sufficient columns.

You can pre-dimension a table on creation by passing the number of
columns to the CreateTable function e.g. let myTable = CreateTable(5).
Otherwise, the table must have been dimensioned by a previous call to
TableAccumulate() with the full complement of columns values.

Example: If using mytable from above:

myTable = TableAccumulateColumn(MyTable, "B", 2, 10)

Adds 10 to column 2 of row "B". The resulting table is:

Resulting table is

Value

Value

A

B

2

1

6

4

Note: The simple form of tableAccumulate(tab) will take a tab and new line

delimited text string and return it as a table. The first "column" in the text
string will be the keys, and all other "columns" should be numeric.

See Also:

CreateTable: Create an empty accumulator table
Sort: Sort a delimited tabular string
TableAccumulateColumn: Accumulate data in one column for a key
TableFind: Look up a key in the table
TableGet: Extract data for a key or index found with TableFind

Value

Value

A

B

2

1

6

14

See Also:

CreateTable: Create an empty accumulator table
Sort: Sort a delimited tabular string
TableAccumulate: Accumulate numeric column data for a key
TableFind: Look up a key in the table
TableGet: Extract data for a key or index found with TableFind
Transpose: Transpose a tabular delimited string

TableFind (table, key)

Result Type: Number
Calculations and things

Function and Handler Summary

Definition: Find the row number in the table identified by key. The first row is
considered a heading, and is ignored. You can use Slice or Dice to extract
data.

Examples: If MyTable is “A\t1\t2\nB\t3\t4\n\C\t5\t6”, as shown below:

A

B

C

1

3

5

2

4

6

Examples: If MyTable is as shown below:

Head

Head

A

B

C

1

3

5

2

4

6

TableGet(MyTable) — returns 3 (the number of rows)

TableFind(MyTable, "C") — returns 3

TableGet(MyTable, "B", 1) — returns 3

TableFind(MyTable, "D") — returns 0 (not found)

TableGet(MyTable, 2, 0) — returns “B”

See Also:

TableGet(MyTable, 2, 1) — returns 3

CreateTable: Create an empty accumulator table
Sort: Sort a delimited tabular string
TableAccumulate: Accumulate numeric column data for a key
TableAccumulateColumn: Accumulate data in one column for a key
TableGet: Extract data for a key or index found with TableFind
Transpose: Transpose a tabular delimited string

Note: While you can pass a block of tab-delimited text to TableGet, you

shouldn't. If you do this, MoneyWorks will laboriously convert the block of
tab-delimited text to a table object for you. This is very time consuming and
will make your report run very slowly—defeating the purpose of the
TableGet function, which is to quickly extract data from an object that is
already a table.

TableGet (table [, IndexOrKey, Colnum])

See Also:

Result Type: number or text

Definition: Used to extract a value or key out of a table (that has been built with

CreateTable, TableAccumulate). It has three forms:

TableGet(table) returns the number of rows in table

TableGet(table, key, colnum) returns the value in the Colnum’th column of
the row in table with a key of key. Key is text.

TableGet(table, index, colnum) If Colnum is 0, the key of row index of table
is returned as text, otherwise the value of the column Colnum of row index
of table is returned as a number.
CreateTable: Create an empty accumulator table
Sort: Sort a delimited tabular string
TableAccumulate: Accumulate numeric column data for a key
TableAccumulateColumn: Accumulate data in one column for a key
TableFind: Look up a key in the table
Transpose: Transpose a tabular delimited string

Tail (listText, numberOfItems, asciiDelimiter)

Result Type: Text



Calculations and things

Function and Handler Summary

Definition: Returns the last numberOfItems items from a textual list of items.

See Also:

The list can be delimited by any ascii (not unicode) character you like. If
numberOfItems is negative, then Tail returns all but the first
abs(numberOfItems) items of the list

Examples: Tail ("foo,bar,baz", 2, ",")

ClearFlag: Bitwise bit clear
SetFlag: Binary OR

TextToDate (text [, format])

returns the last 2 items ("bar, baz") of the comma-delimited list.

Result Type: Date

Tail ("a,b,c,d,e,f,g,h", -2, ",")

returns "c,d,e,f,g,h".

See Also:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Trim: Remove whitespace from beginning and end of a string

TestFlags (number, mask)

Result Type: Boolean

Definition: Returns the bitwise AND of the arguments. Used for testing the Flags

field in records.

Examples: testflags(JobSheet.Flags, 1)

returns true if the resource in the job sheet entry is a Time item.
Definition: Converts the given text into a value of type date. Use this if, for
example, you have a textual value representing a date, and you want to
perform date arithmetic on it. If you don’t explicitly convert the text value
to a date value first, the date arithmetic won’t work—you will get string
concatenation or an error. The format can be one of:

DateFormShort little-/middle-/big-endian order depends on locale

DateFormDDMMYY always little-endian date order

DateFormYYYYMMDD always big-endian date order

DateFormYYYYMMDDHHMMSS always big-endian date order

DateFormISO always big-endian date order

DateFormISO8601Time always big-endian date order*

If no format parameter is provided, the system's local short date format is
assumed. Note: if you do not provide a format, and your expression is
evaluated on a server, the local date format on the server may not be the
same as the client, so results may not be what you expect. Therefore you
should always provide a format parameter. There is no way to force middle-
endian date order conversion other than through locale setting).

If the text consists of exactly 8 digits with no separators, the format will be
assumed to be YYYYMMDD. If the text contsists of exactly 14 digits with no
separators, the format will be assumed to be YYYYMMDDHHMMSS

Examples: TextToDate("14/3/93", DateFormDDMMYY) + 2

returns 16/3/93. Compare this with "14/3/93" + 2, which gives a result of
“14/3/932”.



Calculations and things

Time Zones

In MoneyWorks 9 and later, parsing a date using the DateFormISO8601Time
format will interpret the time zone indicator and convert the resulting
DateTime to the local time zone. In earlier versions, the time zone was
ignored (and still is for most formats). E.g. parsing "2020-11-16T20:10:57Z"
(UTC) will yield the actual DateTime 2020-11-17 09:17:50 (i.e.
2020-11-17T09:17:50+1300) if evaluated in the NZDT timezone.
MoneyWorks recognises the Z (Zulu, UTC), +HHMM, and -HHMM time zone
formats. Use DateFormISO8601Time to parse typical JSON timestamps
(JSON_Get does not parse timestamps for you).

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

TextToNum (text [, specialFormat])

Result Type: Number

Definition: Converts the given text to a numeric value. Use this when you need

to perform arithmetic on the value.

Examples: TextToNum("42") + 2 — returns 44.

Compare this with "42" + 2, which gives a result of “422”.

Function and Handler Summary

In MoneyWorks 9.1.4 and later, you can supply an optional specialFormat
parameter to have this function parse the text as a hexadecimal value.
Values for this parameter may be one of
NumFormHex16,NumFormHex32,NumFormHex16LE,NumFormHex32LE.

In MoneyWorks 9.1.8 and later, you can specify the optional specialFormat
parameter as NumFormPrintf to have the text parsed as a non-localised
number (i.e. always . decimal). Use this for parsing output from the
Analyse function, which is always non-localised.

Time ()

Result Type: DateTime

Definition: Same as Today() except not rounded down to nearest midnight (i.e.
has second accuracy). To be useful you need to format as text using a
format that includes hours, minutes and seconds.

Examples: DateToText(Time(), -4) — returns 3:12:37 PM

DateToText(Time(), -7) — returns 20060830151237

Note this example will not work as expected in Acme Widgets, since Acme

Widgets exists in a time warp, with a demo date

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
Calculations and things

Function and Handler Summary

PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

TimeAdd (datetime, secs)

Result Type: DateTime

TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

TimeDiff (datetime1, datetime2)

Result Type: Number

Definition: Find the number of seconds between two DateTimes

Examples: TimeDiff(Today(), Time()) — returns the number of seconds

Definition: Computes a new Date and Time by adding seconds to a given

since midnight today

DateTime

Examples:

Note this example will not work as expected in Acme Widgets, since Acme

Widgets exists in a time warp, with a demo date

TimeAdd(Time(), 1800) — yields the current time plus half an hour

See Also:

Note Time() + 1 adds one day

Note that this example will not work as expected in Acme Widgets, since Acme

Widgets exists in a time warp, with a demo date

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date



Calculations and things

Timestamp ( [zone] [, format])

Result Type: string

Definition: Returns a millisecond-resolution timestamp string. Zone may be
TSZ_UTC, or TSZ_Local. Format may be TSF_Default, TSF_ISO8601. By
default, the local timezone is used; you may pass TSZ_UTC as a first
parameter to get UTC.

Examples:

TimeStamp() — "2021-10-07 15:23:27.708" same as
TimeStamp(TSZ_LOCAL, TSF_Default)

TimeStamp(TSZ_LOCAL, TSF_Default) — "2021-10-07 15:23:27.708"

TimeStamp(TSZ_UTC, TSF_Default) — "2021-10-07 02:23:27.707Z"

TimeStamp(TSZ_UTC, TSF_ISO8601) — "2021-10-07T02:23:27.707Z"

TimeStamp(TSZ_LOCAL, TSF_ISO8601) — "2021-10-07T15:23:27.708"

In v9.1 and later, TimeStamp also supports Unix epoch timestamps using formats
TSF_Unix, TSF_Unix_ms, and TSF_Unix_us, or a POSIX strftime format string. On
Windows versions prior to 10, millisecond- and microsecond-resolution might
be optimistic.

Examples:

TimeStamp(TSZ_UTC, TSF_Unix) — "1658941040"

TimeStamp(TSZ_UTC, TSF_Unix_ms) — "1658941040.189"

TimeStamp(TSZ_UTC, TSF_Unix_us) — "1658941040.189736"

Function and Handler Summary

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Today: Today's date
WeekOfYear: Convert a date to a week number
Year: Year of a date

Today ()

Result Type: Date

Definition: Returns today’s date.

Examples: Today()

would return 7/10/93 for any form that was printed on the same day that
this manual entry was written.

Note this example will not work as expected in Acme Widgets, since Acme

Widgets exists in a time warp, with a demo date

TimeStamp(TSZ_LOCAL, "%Y-%m-%d %H:%M:%S") — "2022-07-29 10:18:42"

Availability: available in MoneyWorks 9.0.4 and later; Unix Epoch and strftime

format in v9.1 and later. Note that Mac and Windows have differing support
for strftime format specifiers; if you're deploying on both platforms, make
sure you only use format specifiers that are supported on both platforms.

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
Calculations and things

Function and Handler Summary

DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
WeekOfYear: Convert a date to a week number
Year: Year of a date

Transpose (table)

Result Type: Tab/newline delimited table

Definition: Transposes a tab/newline delimited table. This is useful to convert a
table that has series data in rows—such as the results of the Analyse
function—to one that has series data in columns, which is the format
required for chart data. You can also use it if you need to use Head and Tail
on columns—transpose the table so that columns become rows; now you
can use Head or Tail to get the rows you want; Transpose back again.

A

B

C

D

E

F

See Also:

CreateTable: Create an empty accumulator table
Sort: Sort a delimited tabular string
TableAccumulate: Accumulate numeric column data for a key
TableAccumulateColumn: Accumulate data in one column for a key
TableFind: Look up a key in the table
TableGet: Extract data for a key or index found with TableFind

Trim (string [, boolNewlinesAndTabsToo])

Result Type: Text

Definition: Returns string with leading and trailing spaces removed. From v8.1.5

you can pass true for the optional second parameter to also trim newlines
and tabs).

Examples: Trim(" Bang! Bang! ")

returns “Bang! Bang!”.

Examples: Transpose ("A\tB\tC\nD\tE\tF\n")

See Also:

returns "A\tD\nB\tE\nC\tF\n"

i.e this table

A

D

B

E

C

F

transposes to:

Dice: Get a subcomponent of a delimited tabular string
Head: Get some elements from the start of a delimited string
Left: Get characters from the start of a string
Mid: Get characters from the middle of a string
Regex_GetMatches: Find tokens using a regular expression
Regex_Match: Test whether a string matches a regular expression
Regex_Replace: Replace text in a string using a regular expression
Regex_Search: Find the first match of a regular expression in a string
Regex_SearchStr: Find the first match of a regular expression in a string and

return the matching string

RemoveLeading: Remove characters from the start of a string
RemoveTrailing: Remove characters from the end of a string
Calculations and things

Function and Handler Summary

Replace: Replace matching text in a string with new text
Right: Get characters from the end of a string
Slice: Get a component of a delimited string
Tail: Get some elements from the end of a delimited string

TypeOf (variable)

Result Type: Number

Definition Returns a number indicating the type of the variable parameter.

_NTDump: Get a textual dump of identifiers and values from the

MoneyWorks nametable

Unicode (string)

Result Type: Number

Definition: Opposite of Char(). Converts the character (first char of string) to its

numeric unicode codepoint.

Example: UniCode("élan")

Constant

Notes

Example

returns 233, being the unicode codepoint for "é"

TypeText

Variable is a string

s= "3.141"
typeof(s) // TypeText

TypeNumber

Variable is numeric

n = 3.141
typeof(n) // TypeNumber

TypeDate

Variable is a date

n = '6/7/17'
typeof(n) // TypeDate

TypeTable

Variable is a table

t = createTable()
typeOf(t) // TypeTable

UnionSelection (sel1, sel2 | searchxExprText, [sortExpr],
[descending])

Result Type: Selection

Definition: Creates a union of the two selections (which must be from the same

internal file). The second parameter can be specified as an existing
selection, or as a search that results in a selection. The resultant selection
can be optionally sorted in the same way as createSelection().

TypeSelection

Variable is a
selection

s = createSelection("name", 1)
typeof(s) // TypeSelection

Example: If sel1 is a selection created by

createSelection("transaction", "type=`CP`"),

TypeArray

Variable is an array
Scripts only

let a = createArray()
typeof(a) // TypeArray

i.e. of cash payments

TypeHandle

Variable is a
handle
Scripts only

Let t = GetListHandle (w, "By
Item")
typeof(t) // TypeHandle

Note Arrays and handles are only available in scripts.

See Also:

SysLog: Write message to MoneyWorks_Gold.log

unionSelection(sel1, "type=`CR`")

returns a selection containing both cash payments and receipts, and is
equivalent to createSelection("transaction", "type=`CP` or type =
`CR`)

unionSelection(sel1, "type=`CR`", "transdate")
Calculations and things

Function and Handler Summary

Same as previously, except the selection is sorted into ascending order of
transaction date (for descending order, pass a fourth parameter with a
value of 1).

See Also:

CreateSelection: Create a selection of records
DisplaySelection: Display standard list window for a given selection of

records

IntersectSelection: Intersect a selection with the result of another search
RecordsSelected: Count records in a selection or resulting from a (meta)

search

SumDetail: Add up a field for details matching a search
SumSelection: Add up a field for records matching a search

Upper (string)

Result Type: Text

Definition: Returns string converted to upper case.

Examples: Upper("Bang!")

returns “BANG!”.

See Also:

Lower: Lowercase a string
Proper: Uppercase initial letters of words in a string

URLEncode (text [, optDelim])

Return type: text

Definition: Returns a URL-encoded version of the supplied text. Specifically, any

non-alphanumeric characters are converted to %xx

Example: alert("api.php?arg=" + URLEncode("2016/12/15")) displays

"api.php?arg=2016%2f12%2f15"

See Also:

Base64Decode: String from a base64 encoding
Base64Encode: Base64 of a string
Curl_Close: Finish with a CURL session
Curl_Exec: Execute a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_Init: Start a CURL session
Curl_StrError: Get an error message from a CURL object

Val (exprText [, bRunOnServer])

Result Type: The result of exprText

Definition: Takes a text string containing an expression. Returns the result of the
expression. This provides a way of deferring the evaluation of expensive
calculations, or ones with side effects, on either side of an If function.

Examples: val(if(c, "calculate:nthPrime(n)", "0"))

will only calculate the nth Prime if c is true. Without the val() the
(presumably expensive) calculation would happen regardless of the value of
c, with the result being discarded if c was false. This is because if() is a
function, so all parameters will be evaluated.

In MoneyWorks 9.1.8 and later, there is also an option to have the expression
evaluated on the server when using MoneyWorks Datacentre. This is useful if
the expression is a very database-intensive function such as Analyse() or
SumSelection(). The expression will only be evaluated on the server if the
network latency is high. Pass true for the second parameter to enable
evaluaiton on the server. Note that you cannot call script handlers using this
mode.

In MoneyWorks 9 and later, you can supply an optional single-byte delimiter to
use as a hex delimiter instead of the default %. E.g. for encoding mail body
content for SMTP you would use URLEncode(body, "=")

WeekOfYear (Date)

Result Type: Number

Definition: Returns ISO 8601:1988 week number for a date
Calculations and things

Examples: WeekOfYear('2020-03-23') — returns 12.

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked
Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
Year: Year of a date

Year (date)

Result Type: Number

Definition: Returns the year of date.

Examples: Year('7/10/6') — returns 2006.

See Also:

CalcDueDate: Calculate a due date for given terms
CurrentPeriod: Get the current period number
Date: Convert d,m,y to a date
DateToPeriod: Convert a date to a period
DateToText: Format a date as a string
Day: Get the Day of month of a date
DayOfWeek: Get The weekday of a date
FirstUnlockedPeriod: Get the oldest period that is not locked

Script-only Functions

Month: Get the month of a date
PeriodName: Get the Name of a period
PeriodOffset: Difference between two periods
PeriodToDate: Get the end date of a period
TextToDate: Parse a string to a date
Time: The current Datetime
TimeAdd: Add seconds to a DateTime
TimeDiff: The difference, in seconds, between two DateTimes
Timestamp: A timestamp string
Today: Today's date
WeekOfYear: Convert a date to a week number

Script-only Functions

Some of the intrinsic functions in MoneyWorks are only appropriate for (and
only available to) MWScript scripts. These functions cannot be used in forms,
reports (except in an embedded report script control), or in-field calculations.

AddListLine (listRef)

Adds a line to the end of an editable list, provided the list is mutable. You’ll get
an error if you try to add a line to e.g. a posted transaction. Returns the new
row number.

See Also:

DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
Calculations and things

Script-only Functions

SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

AddStatementTransaction (ref, date, tofrom, desc, amt)

Definition: Use this function to add a transaction to a bank statement import.

The function only works when a Load Statement dialog is open, so can only
be used from a statement loading script.

Statement Loading Scripts

Statement Loading in MoneyWorks supports well-defined bank statement
formats (QIF and OFX/QBO). Some banks only provide CSV format and the
problem is that CSV is not a format as such, but merely a field delimiter
specification (namely commas between fields). The fields themselves will be
arbitrary. Bank statements in CSV format will differ between banks. Statements
may also be available in other formats. This is where Statement Loading Scripts
are useful.

You may place an external .mwscript file in MoneyWorks Standard Plugins/
Scripts/Bank Statement Importers. These scripts will show up as format options
in the Bank Statement loading window...

When you select the importer script and click Load Statement File, MoneyWorks
will load your script and execute the Loadhandler. The Load handler should
open a text file, parse it, and call AddStatementTransaction for each transaction
it finds in the file.

And here is an example for importing tab-delimited data scraped from a
Kiwibank PDF bank statement using Tabula.

constant meta = "Kiwibank scraped PDF statement as Tab separated.
http://cognito.co.nz"

on TrimQuotes(str)

if Left(str, 1) = "$"

let str = Right(str, Length(str) - 1)

endif
if Left(str, 1) = "\"" and Right(str, 1) = "\""

return Mid(str, 2, Length(str) - 2)

endif
return str

end

on Load

foreach line in textfile ""         // no filename -> present a

file open dialog

let transdate = TrimQuotes(Slice(line, 1, "\t"))    //

slice automatically trims whitespace

let procdate = TrimQuotes(Slice(line, 2, "\t"))
let card = TrimQuotes(Slice(line, 3, "\t"))
let desc = TrimQuotes(Slice(line, 4, "\t"))
let credit = TrimQuotes(Slice(line, 5, "\t"))
let debit = TrimQuotes(Slice(line, 6, "\t"))
let amt = TextToNum(credit) - TextToNum(debit)
if transdate = "" // skip currency conversion lines

continue

endif
AddStatementTransaction("", TextToDate(transdate), desc,

"", amt)

endfor

end

Availability: MoneyWorks 7.2 and later (including Express and Cashbook).

AddSafePath (prompt)

Result type: string
Calculations and things

Script-only Functions

Definition: Displays a folder chooser dialog for the user to add a folder to the

Example:

"safe paths" list in the preferences.

The return value is the folder path, or empty string if the user cancels.

"Approve", "Don't Approve")

let r = Alert("Approve transaction?", "You have the power",

Availability: MWScript in MoneyWorks 9.1 and later.

See Also:

BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

Alert (message1, message2, ok, cancel, other, timeoutsecs)

Result type: number

Definition: The Alert function displays an alert window with up to 3 buttons.

Both message strings will be included in the alert box (on Mac, the first message
is larger and bolder).

ok, cancel, and other are optional button names. If supplied, buttons with
those names will be included. If those parameters are omitted, the default alert
has two buttons ("OK", and "Cancel"). To get just one button, pass "" for the
Cancel button name. To get 3 buttons, provide names for all three.

If timeoutsecs is provided, the alert will auto-dismiss after that many seconds,
as if the Cancel button was pressed.

Help button: Alerts posted by this function in a script will include a help button.
Clicking that help button will display another alert that identifies the script
name and its meta string. Clicking the help button in thatalert will bring you to
this manual page via the manual search function. Clicking the help button in an
alert posted from a non-script expression will go directly to the manual search.

Getting out of an endless alert loop: If you have written a script that is
continuously posting alerts in a loop, you can force the script to stop by holding
down the Control key when you click one of the alert's (non-help) buttons
(provided that you have the Scripting privilege).

Availability: available anywhere, but should usually only be used from

MWScript handlers.

See Also:

Ask: Very simple dialog box with controls
ChooseFromList: Very simple list dialog box
Say: Speak some text

AppendColumnToStdEditList (listHandle,
columnFieldName, columnDefinition)

Result Type: none

Definition: Call from a TweakColumnList handler to append a custom column to

a standard edit list. Pass the list handle that is provided to the
TweakColumnList handler. The columnFieldName may be the name of a
script-mutable field of the appropriate table (either Details or JobSheet), or
it can be a "tagged field" using a short name of your choice prepended by
an underscore. Such fields are automatically stored in the TaggedText field
of the record. The columnDefinition defines the column heading, width in
points and alignment of the column (using the same notation is for
InsertEditListObject)

The return value is a button number. 1 is OK, 2 is cancel, 3 is other. If the alert
timed out, the result is 2.

Example:
Calculations and things

Script-only Functions

on TweakColumnList:F_TRANS(win, list)

AppendColumnToStdEditList(list, "Detail.Custom1", "Cust1|40|L")
AppendColumnToStdEditList(list, "_myfield", "Mine|60|L")

end

Availability: available within MWScript handlers in v9 and later. Use only from a

TweakColumnList handler.

See Also:

ControlTypes are “static”, “text”, “password”, “number”, “date”, “checkbox”,
“popup”, “radio”, “title” and “invis”. These are case-sensitive strings. If you use
any other string for controlType, that will be taken as the name (i.e. content) for
a static text control. The text, password, number, date, radio, and checkbox
types have a name and a value (static just has a name). The popup type has a
name, a value, and a definition. The title type has a single value, which will be
used as the window title. The function knows how many following parameters
to expect after each controltype parameter.

TweakColumnList: Use to add custom columns to a standard editable list.

The buttons are always OK and Cancel.

AppendPopupItems (windowRef, itemID, itemString)

Example:

Result Type: none

Definition: Adds items to the popup menu control with id itemID as specified
by the itemString. The string should be a semicolon-delimited list of item
names. Any item name beginning with a ( will be disabled. Use (- for a
separator item.

Example: AppendPopupItems(windowRef, "M_MYPOPUP", "Item one;Item

two;(-;(Disabled;(-;Last")

If the item string is "#PER" the menu will be populated with periods.

If the item string is "#COLOUR" you will get a colour menu (using the transaction
colour names by default). For a colour menu using the custom colour names for
a particular table, append the table name after a colon. e.g. "#COLOUR:account"

Availability: available within MWScript handlers.

See Also:

DeletePopupItems: Remove items from a popup menu

Ask (controlType, name, value, definition, …)

Result type: array

Definition: The Ask function provides a simple custom UI for data capture. It
takes a variable number of parameters that define the custom controls to
appear in the dialog box. The general form is:

let result = Ask("This is a prompt", "number", "Number of Coins", 5,

"checkbox", "They are Gold", 0, "title", "My big ask")

The function result is an associative array whose keys are the control names
(with spaces replaced by underscores, in the same manner as custom controls
for reports). There is also a key-value with key "ok" and value 0 or 1 denoting
whether the OK button was clicked.

e.g. result["Choose_one"] → "bar"
Calculations and things

result["Number_of_Coins"] → 5

result["They_are_Gold"] → 0

To implement validation handlers for the Ask dialog box, you must pass an
invisible control with the name "ident", thus:

... "invis", "ident", "com_yourdomain_My_Ask"

This defines an invisible control with the special name "ident" which becomes
the dialog box's symbolic identifier for the purposes of message interception.

IMPORTANT: Since every Ask dialog will be different, but all loaded scripts
receive UI messages for dialogs, the handlers for validating them must be
unique across all scripts that could possibly be installed in the same document).
You MUST choose a globally unique identifier (do not use the one in this
example). It is recommended that you use the reverse domain name convention
to derive a globally unique name. For example, I would use names in the form
nz_co_cognito_rowan_myscript_ask. This should provide reasonable assurance
that no-one else's scripts will try to trap messages for the ask dialog in my script.

Keep in mind the 63-character limit on handler names.

Example:

on Load

let a = Ask("text","Some Text","Default","invis","ident",

"nz_co_cognito_MyAsk")

if a["OK"]

alert(a["Some_Text"])

else

say("cancelled")

endif

end

on Before:unique_MyAsk(w)

let formlist = "None;(-;"+replace(GetPlugIns("forms", "all",

"invc"), "\n", ";")

AppendPopupItems(w, "Invoice", formlist)

Script-only Functions

end

on Load

let result = Ask("Choose Form", "popup", "Invoice", "", "",

"invis","ident", "unique_MyAsk")
end

Availability: within an MWScript handler

See Also:

Alert: Display an alert with up to 3 buttons
ChooseFromList: Very simple list dialog box
Say: Speak some text

Authenticate (username, password [, privilegeName])

Result Type: Boolean (0 or 1)

Definition: Returns 1 if the user exists and the password is correct for that user,
otherwise returns 0. If a privilege name string is supplied, then the user
must also have that privilege to get a true result.

You might use this function to allow temporary privilege escalation within a
script, by asking for an administrator's credentials. Your script is responsible for
enforcing privilege restrictions in this way when you perform privileged
operations within an elevated handler.

Availability: available within MWScript handlers.

on ValidateField:nz_co_cognito_MyAsk:Some_text(winref, fieldID,
value)

See Also:

Allowed: Test a named privilege for the current user

say(value)

end

Note: Ask() parameters will be truncated to 255 characters. To include a long

menu, use AppendPopupItems in the Beforehandler of the Ask dialog. For
example, the following will display a menu of available invoice forms:

AutoFillAcctDeptField (windowRef, itemID, bWantDept)

Definition: Invokes an autocomplete dropdown in a text entry field. Pass true

for bWantDept to require a department code for departmentalised
accounts.
Calculations and things

Call this from an ItemHit handler for an account code field.

Example:

on ItemHit:F_MYWINDOW:E_MYCODE(windowRef, itemID)

AutoFillAcctDeptField(windowRef, itemID, true)

end

Availability: available within MWScript handlers.

See Also:

AutoFillField: Apply auto-complete to a code edit field
CheckCodeField: Validate a code edit field
ValidateFieldWithValidationString: Programmatically apply a custom

validation expression to a field

AutoFillField (windowRef, itemID, tablename)

Definition: Call this from an ItemHit handler for a code field to invoke an

autocomplete dropdown. TableNamemay be one of "account", "ledger",
"product", "job", "department", "name", "list".

Example: Autocompleting against values from a database table.

on ItemHit:F_TRANS:E_USER1(w, f)

AutoFillField(w, f, "department")

end

Note: the list name in "List:branches" above is case-sensitive. Be sure to match
the case of your list name.

Script-only Functions

Supplying full calculated autocomplete data:

Also as of v8.1.8 the third parameter may be an associative array of codes
and descriptions, or a specially formatted tab-delimited table with entries in
the form: spacecode tabspacedescription newline. In these cases the
supplied validation data is used to match the input for autocompletion.

property mytext

// autocomplete only AUD control accounts

on Load

let mytext = Find("account.` `+code+`\t `+description",

"currency = `AUD`", 9999, "\n")
end

on ItemHit:F_TRANS:E_USER1(w, f)

AutoFillField(w, f, mytext)

end

If building autocomplete data this way, you should do it once per session
and cache it in a property. Do not build it every time you call AutoFillField as
that will not scale.

Availability: available within MWScript handlers.

Programmed autocomplete for a validation list:

See Also:

As of v8.1.8 the third parameter may be a mnemonic indicating a validation
list. I.e. a string of the form "List:listname" where listnameis the name of a
validation list. This allows list validations to be applied programmatically for
all users rather than manually setting up autocompletion for fields for each
user.

on ItemHit:F_TRANS:E_USER1(w, f)

AutoFillField(w, f, "List:branches") // where branches is a

defined validation list
end

AutoFillAcctDeptField: Apply auto-complete to a departmental account

code edit field

CheckCodeField: Validate a code edit field
ValidateFieldWithValidationString: Programmatically apply a custom

validation expression to a field

ValidateFieldWithValidationString (windowRef, itemID,
validationDefinition)

Definition: Call this from a ValidateField handler for a code field to validate the
field value against an expression or a validation list. This is a programmatic
alternative to setting up a custom validation on the field for each user in the
Calculations and things

UI.

on ValidateField:F_TRANS:E_USER1(w, f, v)

return ValidateFieldWithValidationString(w, f,

"Expr:_value=`abc@`;must start with abc")
end

Definition: Change a tax rate's identifying code and update all usages in the

database. Requires single user mode.

Script-only Functions

Returns true on success. On failure (false return), check
GetLastErrorMessage() for an explanation.

on ValidateField:F_TRANS:E_USER2(w, f, v)

return ValidateFieldWithValidationString(w, f,

"List:branches")    // validate against the validation list named
branches
end

In MoneyWorks 9.1.5, this function supports only changing tax codes. It will
be expanded in future.

Example: ChangePrimaryKeyCode("taxrate", "N", "G")

Note that this only validates the field value on exit; it does not offer
autocomplete. To also implement autocomplete, use AutoFillField.

Updates every instance of N tax code in the database to be G. This may take
some time.

Availability: available within MWScript handlers in v8.1.8 and later.

Availability: MWScript in MoneyWorks 9.1.5 and later.

In v9.0.1 and later, the itemID may be a list item (or a list handle), in which case
this will validate the active cell (if any) of that list. This is particularly useful
when you have added custom columns to a list and need to validate them.

See Also:

AutoFillAcctDeptField: Apply auto-complete to a departmental account

code edit field

AutoFillField: Apply auto-complete to a code edit field
CheckCodeField: Validate a code edit field

CancelTransaction (seqNum [, optionalDescription,
optionalDate])

Result type: none

Definition: Cancels the transaction identified by seqNum, if possible. An
optional description and transaction date for the cancellation may be
supplied.

Availability: available within MWScript handlers.

ChangePrimaryKeyCode (table, oldCode, newCode)

Result type: Boolean

CheckCodeField (windowRef, itemID, tableName, ...)

Definition: This function has 4 variants for the different codes that it will check.
If the text field identified by windowRef+itemID contains a valid code for
the named table, then the function returns true without doing anything
further.

If the code is not valid, then the function will pop up the standard Choices
window for that table. If the user selects a record, then the function returns
true. If the user cancels, the function returns false.

Variants:

• CheckCodeField(windowRef, itemID, "account", boolWantDept,

boolAllowDept, optionalRequiredType)

• CheckCodeField(windowRef, itemID, "name", custType, suppType)
• CheckCodeField(windowRef, itemID, "product", boolWantShipMeth)
• CheckCodeField(windowRef, itemID, "job")

For "account", you can specify boolWantDept = true to require a dept code for
departmentalised accounts. You can specify boolWantDept false and
boolAllowDept if the field can have a departmentalised account without the
department code being present. The optionalRequiredType parameter can be a
two character account type code or system type code or "**" for IN/EX
accounts. If no type is specified, then any type is allowed.
Calculations and things

Script-only Functions

For "name" custType should be 0, 1 or 2 for not customers, customers or
debtors, respectively. SuppType should be 0, 1 or 2 for not suppliers, suppliers
or creditors, respectively. e.g. for Debtor codes only, specify
CheckCodeField(windowRef, itemID, "name", 2, 0)

Use this function from a ValidateField or ValidateCell handler to validate a code
in the field.

Availability: available within MWScript handlers.

See Also:

AutoFillAcctDeptField: Apply auto-complete to a departmental account

code edit field

AutoFillField: Apply auto-complete to a code edit field
ValidateFieldWithValidationString: Programmatically apply a custom

validation expression to a field

ChooseFromList (prompt, tabularText [, mode])

Presents the tabular data in a list, from which the user may select a row. Return
value is normally the text of the selected row. The optional mode parameter can
contain keywords that affect the behaviour of the list: 

Clicks ()

Definition: Returns the current click count. For a list with mode

fListMode_DoubleclickItemHit you can use this in an ItemHit handler to
determine if the user double-clicked a row—Clicks() will return 2 in this
case.

Availability: available within MWScript handlers.

CloseDocument ()

Closes or disconnects from the document. Returns 1 on success, 0 on failure.

Availability: Available only to scripts loaded from the Scripts folder. A document
script cannot open another document, since that would unload the calling
script.

See Also:

OpenDocument: Open a document or connection (use from external script)

CloseWindow (windowRef)

"Drag" allows the user to reorder the list rows. 

Result Type: none

"All" will return all rows regardless of highlight (can combine "drag,all"). 

Definition: Closes the window.

"Multiple" allows multiple rows to be selected (cannot combine). 

Availability: MWScript handlers

See Also:

Alert: Display an alert with up to 3 buttons
Ask: Very simple dialog box with controls
Say: Speak some text

Normally, a script should not need to close a window. The user will do that
via the close box, or the OK or Cancel buttons. If you do need a window to
close without explicit user interaction, you can use CloseWindow. In the
case of modal windows, CloseWindow can only be used with the topmost
window. CloseWindow is usually asynchronous i.e. the window will not
close immediately the function is called, but when it is safe to do so.
Although you should not rely on the validity of the window handle after
calling CloseWindow, may still get handler calls for the window.

Availability: available within MWScript handlers.
Calculations and things

Script-only Functions

CopyUserSettings (srcUserInitials, destUserInitials)

let myArray["mykey"] = myArray[0]
let myArray['31/1/12'] = 500

Definition: Imposes settings from one user on another user. This will replace

the destination user's custom columns, validations, selected filters etc. One
or other of the parameters can be the empty string, which implies the
currently logged in user. If copying settings to a user by specifying their
login initials, they should not be logged in at the time (attempting to do this
will have no effect, since the user's current settings will clobber the change
when the log out). A user can copy settings from another user to
themselves while logged in by specifying "" for the destUserInitials.

Example:

on UserLoggedIn

// if this user has a _donor tag in login.taggedText, grab

settings from that user

let tagged = Lookup(Initials, "Login.TaggedText")
let settingsDonor = GetTaggedValue(tagged, "_donor")
if settingsDonor != ""

CopyUserSettings(settingsDonor, "")
let tagged = SetTaggedValue(tagged, "_donor", "")
// clear the donor tag so will not clobber again
ReplaceField("Login.TaggedText", "Initials =

`"+Initials+"`", tagged)

endif

end

Availability: available in MWScript in v9 and later when logged into a

Datacentre server.

CreateArray ( [key, value, ... ])

Result type: array.

In the current implementation, insertion into an associative array is O(N).
Retrieval is O(log N).

Arrays, like Tables, are always passed by reference, so if you assign an array to
another variable, or pass it as a parameter to a function, you are not copying the
array. If you want to copy an array, you must allocate a new array with
CreateArray and explictly copy all of its members.

In MoneyWorks 9 and later, you can provide parameters for initialising the array.

let myArray = CreateArray(0, "thing", "mykey", "thing", '31/1/

12', 500)

syslog(myarray[0])
syslog(myarray["mykey"])
syslog(myarray['31/1/12'])

This is particularly useful for passing to functions that require an array
parameter. E.g. BeginXMLElement(xml, "import", CreateArray("table",
"transaction"))

Availability: available within MWScript handlers.

See Also:

CountElements: Get the size of an associative array
DeleteElement: Remove a key from an associative array
ElementExists: Check if a key exists in an associative array
ParamsFromArray: Expand array values to a variable parameter list

CreateFolder (parentFolderPath, newFolderName)

Definition: Without parameters, creates an empty associative array object.

Result type: Boolean

Associative arrays use the syntax arrayname[key], where key can be any text up
to 31 characters, an integer, or a date (internally, integers and dates are
represented as text formatted so that lexical sort order matches numeric/date
sort order). Data values can be any other type.

let myArray = CreateArray() 
let myArray[0] = "thing"

Definition: Creates a new folder in the specified location.

parentFolderPath must be inside an existing "safe path" directory.

Returns true to indicate success (the folder now exists, due to being created
or already existing), false for failure (the folder could not be created or is
not accessible).
Calculations and things

Availability: MWScript in MoneyWorks 9.1 and later.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

CreateListWindow (id, recordFormID, table, search,
headingString, columnsString [, modes [, properties] ])

Definition: A variant of CreateWindow for displaying a list of records much like

the built-in MoneyWorks list windows.

The window's first control (object #1) should be a list object. It will be replaced
with a record list for the requested database table named by the table
parameter. The list will be filtered according to the search string.

If recordFormID is not the empty string, then double-clicking a record will
automatically instantiate an instance of that window with appropriate record
locking so that you can read and (for allowable tables) write records safely (see
ReadCurrentRecordForWindow and WriteCurrentRecordForWindow).

The headingString is a tab-delimited list of column headings. Each column
heading may optionally be followed by specifiers for the column width; and the
column alignment. These specifiers are separated by vertical bar characters (|).

headingString = Heading_Text | width * | alignment

Script-only Functions

The * after the width is optional and denotes that the column will resize if the
columns widths do not add up to the list width. Default is 80 and the first
column is the resizable one by default.

Alignment can be one of 'L', 'C', 'R' for left, centre or right alignment. Default is
left.

Examples:

"My Heading" — a left aligned cell (by default, 80 points wide)

"My Heading|100" — 100 points wide column

"My Heading|80|R" — right-aligned column

The columnsString is a tab-delimited list of custom column calculations that may
reference the field names for the database table.

The optional modes can specify behaviour of the list. This is a bitfield which can
include a combination of the following constants added together:
fListMode_Selectable, fListMode_OnlyOne, fListMode_DoubleclickAccept,
fListMode_DoubleclickItemHit, fListMode_ToggleSelection. If it is omitted,
selectable is on my default.

In v9 and later, you can provide an optional propertiesassociative array which
will be used to initialise the properties of the window (that you would otherwise
set and get with SetWindowProperty and GetWindowProperty. This removes
the need to use global properties to pass parameters to window handlers. Note
that to provide properties this way you must also provide a modes parameter
(use 0 if you don't need special modes).

Availability: available within MWScript handlers.

See Also:

CreateWindow: Instantiate a modeless custom window
GetWindowProperty: Retrieve data previously stored for a windowHandle
ModalJobsheetEntryWindow: Run a modal Jobsheet entry modify/create

window

ModalListWindow: Instantiate a modal custom database table list window
ModalTransactionWindow: Run a modal transaction modify/create window
ModalWindow: Instantiate a modal custom window
Calculations and things

Script-only Functions

ReadCurrentRecordForWindow: Load a record in custom UI, or tagged fields

in standard UI

SetWindowProperty: Store data related to a window
WriteCurrentRecordForWindow: Save a record in custom UI, or save tagged

fields in standard UI

ModalListWindow: Instantiate a modal custom database table list window
ModalTransactionWindow: Run a modal transaction modify/create window
ModalWindow: Instantiate a modal custom window

Curl_Close (curlhandle)

CreateWindow (your_wind_id [, mode [, properties]])

Result Type: no return value

Result Type: a windowRef

Definition: Instantiates a modeless window using the UI form with identifier
your_wind_id (i.e. the name you gave the form in the script editor). The
window will have a close box to close it.

The return value of CreateWindow will be a window handle. You can use this to
do further setup of controls in the window, and/or you can write a Before
handler named Before:your_wind_id(windowRef) in which you can set up the
state of the window's controls.

If you pass fWindowMode_Floating for the optional mode parameter, the
window will be a floating window (it will stay above all other windows; you can
use this for a tool palette).

Windows automatically remember their last size and location (this information
is written into a file named script_id.properties. You can set the values of
the properties your_wind_id_left, your_wind_id_top, your_wind_id_right,
and your_wind_id_bottom before instantiating the window to override the size
and location.

In v9 and later, you can provide an optional propertiesassociative array which
will be used to initialise the properties of the window (that you would otherwise
set and get with SetWindowProperty and GetWindowProperty. This removes
the need to use global properties to pass parameters to window handlers. Note
that to provide properties this way you must also provide a modes parameter
(use 0 if you don't need special modes).

Availability: available within MWScript handlers.

See Also:

ModalJobsheetEntryWindow: Run a modal Jobsheet entry modify/create

window
Definition: Releases the curl handle. Call this when you are finished with the

handle (if you fail to do so, it will be garbage collected automatically when
the script is unloaded).

Availability: available within MWScript handlers.

See Also:

Base64Decode: String from a base64 encoding
Base64Encode: Base64 of a string
Curl_Exec: Execute a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_Init: Start a CURL session
Curl_StrError: Get an error message from a CURL object
URLEncode: Convert url unsafe characters in a string to "%xx”

Curl_Exec (curlhandle)

Result Type: string or CURLcode number

Definition: Performs the CURL operation for the given curl object, and (usually)
returns the response as a string. If you supply a write callback to collect
response data, the result will be the completion CURLcode value.

The curlhandle will previously have been initialised with Curl_Init and had
options set on it with Curl_SetOpt.

Example: Just getting the data

let ch = curl_init("http://cognito.co.nz/")
let data = curl_exec(ch)
syslog("data = " + data)



Calculations and things

Script-only Functions

Example: Getting a result code as well. There are many ways a network request

can fail, and it is useful to know why. While debugging, you can also check
the log file for CURL errors.

property retval = ""

on MyWriteCallback(someData)

let retval = retval + someData
// optionally return false to abort

end

on Load

let ch = curl_init("http://cognito.co.nz")
curl_setopt(ch, CURLOPT_FOLLOWLOCATION, 1)
// by supplying a write callback, curl_exec will return
// a curl result code instead of the retrieved data
curl_setopt(ch, CURLOPT_WRITEFUNCTION,

"MyWriteCallback")

let errorCode = curl_exec(ch)
syslog("CURL result = " + errorCode)
syslog("data = " + retval)

end

Availability: available within MWScript handlers.

See Also:

Base64Decode: String from a base64 encoding
Base64Encode: Base64 of a string
Curl_Close: Finish with a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_Init: Start a CURL session
Curl_StrError: Get an error message from a CURL object
URLEncode: Convert url unsafe characters in a string to "%xx”

Curl_GetInfo (curlhandle, info)

Definition: After calling Curl_Exec, you can get information about the transfer
using Curl_GetInfo. This is a convenient way to get the HTTP status of the
transfer, particularly when Curl_Exec is returning the payload as its function
result.

Currently supported information types are: CURLINFO_EFFECTIVE_METHOD,
CURLINFO_CONTENT_TYPE, CURLINFO_PRIMARY_IP,
CURLINFO_EFFECTIVE_URL, CURLINFO_PROXY_ERROR, CURLINFO_OS_ERRNO,
CURLINFO_NUM_CONNECTS, CURLINFO_SSL_VERIFYRESULT,
CURLINFO_REQUEST_SIZE, CURLINFO_REDIRECT_COUNT, CURLINFO_FILETIME,
CURLINFO_HTTP_CONNECTCODE, CURLINFO_HEADER_SIZE,
CURLINFO_RESPONSE_CODE, CURLINFO_APPCONNECT_TIME,
CURLINFO_PRETRANSFER_TIME, CURLINFO_STARTTRANSFER_TIME,
CURLINFO_REDIRECT_TIME, CURLINFO_NAMELOOKUP_TIME,
CURLINFO_SIZE_UPLOAD, CURLINFO_SIZE_DOWNLOAD,
CURLINFO_SPEED_DOWNLOAD, CURLINFO_SPEED_UPLOAD,
CURLINFO_TOTAL_TIME.

You can also get the libcurl version with Curl_GetInfo(NULL, NULL)

Examples:

on Load

let ch = Curl_Init();
curl_setopt(ch, CURLOPT_URL, "https://secure.cognito.co.nz/")
let result = curl_exec(ch) // result will get the html content
syslog("HTTP status = " + curl_getinfo(ch,

CURLINFO_RESPONSE_CODE))

syslog("IP = " + curl_getinfo(ch, CURLINFO_PRIMARY_IP))
syslog("Eff URL = " + curl_getinfo(ch, CURLINFO_EFFECTIVE_URL))
syslog("pre xfer = " + curl_getinfo(ch,

CURLINFO_PRETRANSFER_TIME))

syslog("size = " + curl_getinfo(ch, CURLINFO_SIZE_DOWNLOAD))
syslog("speed = " + curl_getinfo(ch, CURLINFO_SPEED_DOWNLOAD))
syslog("total time = " + curl_getinfo(ch, CURLINFO_TOTAL_TIME))
syslog("header size = " + curl_getinfo(ch,

CURLINFO_HEADER_SIZE))
curl_close(ch)

end

Availability: available within MWScript handlers in MoneyWorks 9 and later

See Also:

Base64Decode: String from a base64 encoding
Base64Encode: Base64 of a string
Curl_Close: Finish with a CURL session
Curl_Exec: Execute a CURL session
Curl_Init: Start a CURL session
Curl_StrError: Get an error message from a CURL object
URLEncode: Convert url unsafe characters in a string to "%xx”



Calculations and things

Curl_Init ([optional_url])

Result Type: A curl handle

Definition: Starts a CURL session. Returns a curl handle for use with the other

Curl_ functions. The functions closely follow (indeed are wrappers for) the
standard curl easy API. For additional background on curl, see the curl
project website.

Including a url in curl_init is equivalent to doing a curl_setopt(ch,
CURLOPT_URL, url).

Example:

let ch = curl_init("http://download.finance.yahoo.com/d/
quotes.csv?s=NZDUSD=X&f=sl1d1t1ba&e=.csv")

Availability: available within MWScript handlers.

See Also:

Base64Decode: String from a base64 encoding
Base64Encode: Base64 of a string
Curl_Close: Finish with a CURL session
Curl_Exec: Execute a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_StrError: Get an error message from a CURL object
URLEncode: Convert url unsafe characters in a string to "%xx”

Curl_SetOpt (curlhandle, option, value)

Definition: Sets options on the handle. See the official curl documentation for
more information on the options. Options that take a stringlist should be
given an indexed array parameter (with numeric indexes atarting at 0).
Options that take a callback should be given the name of the callback
handler as a string. All other options take a number or string parameter.

Currently supported options are: CURLOPT_WRITEDATA, CURLOPT_URL,
CURLOPT_PORT, CURLOPT_PROXY, CURLOPT_USERPWD, CURLOPT_PROXYUSERPWD,
CURLOPT_RANGE, CURLOPT_READDATA, CURLOPT_ERRORBUFFER,
CURLOPT_WRITEFUNCTION, CURLOPT_READFUNCTION, CURLOPT_TIMEOUT,

Script-only Functions

CURLOPT_INFILESIZE, CURLOPT_POSTFIELDS, CURLOPT_REFERER,
CURLOPT_FTPPORT, CURLOPT_USERAGENT, CURLOPT_LOW_SPEED_LIMIT,
CURLOPT_LOW_SPEED_TIME, CURLOPT_RESUME_FROM, CURLOPT_COOKIE,
CURLOPT_HTTPHEADER, CURLOPT_HTTPPOST, CURLOPT_SSLCERT,
CURLOPT_KEYPASSWD, CURLOPT_CRLF, CURLOPT_QUOTE, CURLOPT_HEADERDATA,
CURLOPT_COOKIEFILE, CURLOPT_SSLVERSION, CURLOPT_TIMECONDITION,
CURLOPT_TIMEVALUE, CURLOPT_CUSTOMREQUEST, CURLOPT_STDERR,
CURLOPT_POSTQUOTE, CURLOPT_VERBOSE, CURLOPT_HEADER, CURLOPT_NOPROGRESS,
CURLOPT_NOBODY, CURLOPT_FAILONERROR, CURLOPT_UPLOAD, CURLOPT_POST,
CURLOPT_DIRLISTONLY, CURLOPT_APPEND, CURLOPT_NETRC,
CURLOPT_FOLLOWLOCATION, CURLOPT_TRANSFERTEXT, CURLOPT_PUT,
CURLOPT_AUTOREFERER, CURLOPT_PROXYPORT, CURLOPT_POSTFIELDSIZE,
CURLOPT_HTTPPROXYTUNNEL, CURLOPT_INTERFACE, CURLOPT_KRBLEVEL,
CURLOPT_SSL_VERIFYPEER, CURLOPT_CAINFO, CURLOPT_MAXREDIRS,
CURLOPT_FILETIME, CURLOPT_TELNETOPTIONS, CURLOPT_MAXCONNECTS,
CURLOPT_FRESH_CONNECT, CURLOPT_FORBID_REUSE, CURLOPT_RANDOM_FILE,
CURLOPT_EGDSOCKET, CURLOPT_CONNECTTIMEOUT, CURLOPT_HEADERFUNCTION,
CURLOPT_HTTPGET, CURLOPT_SSL_VERIFYHOST, CURLOPT_COOKIEJAR,
CURLOPT_SSL_CIPHER_LIST, CURLOPT_HTTP_VERSION, CURLOPT_FTP_USE_EPSV,
CURLOPT_SSLCERTTYPE, CURLOPT_SSLKEY, CURLOPT_SSLKEYTYPE,
CURLOPT_SSLENGINE, CURLOPT_SSLENGINE_DEFAULT,
CURLOPT_DNS_USE_GLOBAL_CACHE, CURLOPT_DNS_CACHE_TIMEOUT,
CURLOPT_PREQUOTE, CURLOPT_COOKIESESSION, CURLOPT_CAPATH,
CURLOPT_BUFFERSIZE, CURLOPT_NOSIGNAL, CURLOPT_SHARE, CURLOPT_PROXYTYPE,
CURLOPT_ACCEPT_ENCODING, CURLOPT_HTTP200ALIASES,
CURLOPT_UNRESTRICTED_AUTH, CURLOPT_HTTPAUTH,
CURLOPT_FTP_CREATE_MISSING_DIRS, CURLOPT_PROXYAUTH,
CURLOPT_FTP_RESPONSE_TIMEOUT, CURLOPT_SERVER_RESPONSE_TIMEOUT,
CURLOPT_IPRESOLVE, CURLOPT_MAXFILESIZE, CURLOPT_NETRC_FILE,
CURLOPT_TCP_NODELAY, CURLOPT_FTPSSLAUTH, CURLOPT_FTP_ACCOUNT,
CURLOPT_COPYPOSTFIELDS.

As of v8.1.7, CURLOPT_MAIL_FROM, CURLOPT_MAIL_RCPT, CURLOPT_MAIL_AUTH,
CURLOPT_USERNAME, and CURLOPT_PASSWORD, CURLOPT_TIMEOUT_MS,
CURLOPT_CONNECTTIMEOUT_MS, CURLOPT_USE_SSL, CURLOPT_SSL_OPTIONS are
also supported.

Examples:

let fd = file_open("picture.jpg")
let ch = curl_init();
Calculations and things

Script-only Functions

curl_setopt(ch, CURLOPT_URL, "https://myserver:6710/REST/
Acme.moneyworks/image/product=BA100")
//    datacentre with folder login requires dual-domain Auth headers
let headers = CreateArray()
let headers[0] = "Authorization: Basic " +
base64encode("root:Datacentre:myrootpassword")
let headers[1] = "Authorization: Basic " +
base64encode("Admin:Document:docpass")
let headers[2] = "Content-Type: image/jpeg"
curl_setopt(ch, CURLOPT_HTTPHEADER, headers)
curl_setopt(ch, CURLOPT_PUT, 1)
curl_setopt(ch, CURLOPT_READDATA, fd)    // simplest: let default
callback read the file
let result = curl_exec(ch)
file_close(fd)
curl_close(ch)

Note on callbacks: To use a callback function (with CURLOPT_READFUNCTION or
CURLOPT_HEADERFUNCTION or CURLOPT_WRITEFUNCTION) for reading or
writing data, you supply a string containing the name of the callback
handler in your script. A header or write callback receives a string
parameter containing some amount of data that curl has read from the
server. You can return FALSE to cancel the operation. A read callback
receives the number of bytes to produce as the first parameter and the
second parameter is the file handle you provide to the CURLOPT_READDATA
option.

Example callback functions:

on MyHeaderCallback(aHeader)

let headers = headers + Replace(aHeader, "\r", "")    //

convert \r\n to \n

// optionally return false to abort

end

on MyWriteCallback(someData)

let retval = retval + someData
// optionally return false to abort

end

on MyReadCallback(maxBytesToProvide, readDataFrom)

// file_read automatically restricts count to not go beyond end

of file

// when at end of file, will return empty string, which return
// value signals end of data to curl
let s = file_read(readDataFrom, maxBytesToProvide)
return s

end

Installing a read callback function: Ths will generate data to PUT to the server

curl_setopt(ch, CURLOPT_PUT, 1)
curl_setopt(ch, CURLOPT_READDATA, fd)    // will be passed to

our callback

curl_setopt(ch, CURLOPT_READFUNCTION, "MyReadCallback")    //

our callback reads file

Availability: available within MWScript handlers.

See Also:

Base64Decode: String from a base64 encoding
Base64Encode: Base64 of a string
Curl_Close: Finish with a CURL session
Curl_Exec: Execute a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_Init: Start a CURL session
Curl_StrError: Get an error message from a CURL object
File_Open: Open a file
URLEncode: Convert url unsafe characters in a string to "%xx”

Curl_StrError (CURLError)

Result Type: String

Definition: Returns an error message string corresponding to a CURLError code
as returned from Curl_Exec when it is using a callback to receive transferred
data.

Example: Curl_StrError(28) — returns the string "Timeout was reached".

Availability: available within MWScript handlers in v9 and later

See Also:

Base64Decode: String from a base64 encoding
Base64Encode: Base64 of a string
Curl_Close: Finish with a CURL session
Curl_Exec: Execute a CURL session
Curl_GetInfo: Get information about a CURL transfer
Curl_Init: Start a CURL session
Calculations and things

Script-only Functions

URLEncode: Convert url unsafe characters in a string to "%xx”

GetActiveListColumn: Get the column number of an edit list that has

DeleteElement (array, key)

Result type: Boolean (0, or 1)

Definition: Removes an element from an array (note that arrays are passed by

reference). Returns true if the element was found and removed. Returns
false if no element with the key was found.

Example:

let a = CreateArray();
let a["key1"] = 5
let a["key2"] = "foo"
alert(ElementExists(a, "key1")) // displays 1
DeleteElement(a, "key1")
alert(ElementExists(a, "key1")) // displays 0

Availability: available within MWScript handlers.

See Also:

CountElements: Get the size of an associative array
CreateArray: Create an empty associative array
ElementExists: Check if a key exists in an associative array
ParamsFromArray: Expand array values to a variable parameter list

DeleteListLine (listRef, rowNum)

Result Type: none

Definition: Deletes a row of an editable list, provided the list is mutable. You’ll
get an error if you try to delete a line from e.g. a posted transaction.

Availability: available within MWScript handlers.

See Also:

AddListLine: Add a row to an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

DeletePopupItems (windowRef, itemID)

Result Type: none

Definition: Deletes all items from the popup menu control so you can rebuild it

using AppendPopupItems.

Availability: available within MWScript handlers.

See Also:

AppendPopupItems: Build a popup menu

DisplaySelection (sel, viewName)

Definition: Opens the list window for the given selection, selects the named
view and finds the records in the selection (which will necessarily be
intersected with the view). Will have the side effect of resetting the view's
filter to No Filter (assuming such a change is allowed by the current user's
privileges (or the script's elevated privileges)).

Availability: available within MWScript handlers.

See Also:

CreateSelection: Create a selection of records
Calculations and things

Script-only Functions

IntersectSelection: Intersect a selection with the result of another search
RecordsSelected: Count records in a selection or resulting from a (meta)

search

SumDetail: Add up a field for details matching a search
SumSelection: Add up a field for records matching a search
UnionSelection: Add the result of another search to a selection

DisplayStickyNote (winRef, tableName, seqNum)

Definition: Displays the sticky note(s) belonging to the record in tableName

having the given sequence number. E.g. DisplayStickyNote(ref, "Name", 27)
displays any notes for Name record with sequence number 27.

Availability: available within MWScript handlers.

DoForm (formName, format, search [, parameters, ...])

Result Type: a path string

Parameters (for the form) should be strings in the form
"paramName=paramValue". An associative array is also acceptable. If the
form makes use of an ephemeral system variable such as MESSAGE (which
is set only when the Print Invoice command is used), you must set a value
for those variables in the parameters (because if no invoice has yet been
printed in the session, MESSAGE will not yet exist).

If generating statements, branches will normally be excluded. To include
brabches, pass Include_Branches with a value of 1.

Example:

let path = DoForm("Product Invoice 1", "pdf", "sequencenumber=992",
"message=", "print_copy=0")

If multiple records are selected, all output still goes to the same PDF.

Availability: MWScript handlers. This function is closely analogous to the

command line and REST doform commands.

Definition: Generates a pdf file containing custom form output.

DoReport (reportName, format, title, parameters...)

Format will usually be "pdf". The return value in this case is the path to a
temporary file that will be deleted when you quit.

Result Type: a path string

From MoneyWorks 8.0, the format may also be "preview", in which case the
output will be displayed in the preview window. If you intend previewed
statement forms to be emailed, you can supply an integer parameter
named contactRole with bit(s) set for the contact(s) whose addresses you
want to encode in the Preview for subsequent emailing.

From MoneyWorks 9.1.1, the return value will begin with "[ERROR]" if the
operation failed. Previously a failure (such as formName specifying a non-
existent form) would result in an empty PDF file.

Also, from MoneyWorks 9.1.1, the search expression can access the in-
scope variables of the calling handler, so can e.g. reference a selection
variable: "[transaction:mySel]" or ordinary variable "ourref=myRefStr"

Definition: Generates a report, either returning the text of the report, or a path

to the generated output file.

Format can be "pdf", "html", "text", "preview" or "". For the first 3, the return
value is the path to a temporary file that will be deleted when you quit. For a an
empty or unknown format string, the function will return the actual tab-
delimited report output instead of a path.

Parameters should be strings in the form "paramName=paramValue".
Parameters are inserted into the name table and are available to the report. An
associative array is also acceptable—each element of the array will be inserted
into the name table with its key as the variable name. Use an associative array if
you have a parameter that is a selection.

To specify the period range for a financial report you must supply parameters
named from and to which may be dates (as yyyymmdd) or period numbers
(dates will be mapped to periods). The report will run for each period in the
Calculations and things

range. If no period range is specified, the current date will be assumed.

Examples:

doreport("Balance Sheet", "preview", "Balance Sheet",
"from=20160331", "to=20160331", "include_unposted=1") // to preview
let t = doreport("Balance Sheet", "", "Balance Sheet",
"from=20160331", "to=20160331") // to tab-delim text string
let h = doreport("Balance Sheet", "html", "Balance Sheet",
"from=20160331", "to=20160331") // to html file

By default, any custom control variables will take on the values last saved in the
report document. You can pass values for custom controls defined in the report,
but to have your passed values override those last stored in the report
document, you must include an additional parameter
"override_doc_custom=1".

As a network client. you can force the report to run on the server (even when
latency is low) by passing "prefer_remote=1".

Example: In this case, the_name_code is the name of a custom control, so we
must pass "override_doc_custom=1" as well in order to override the value
stored in the report.

let pdfPath = DoReport("Statement.crep", "pdf", "Statement",
"the_name_code=" + n.code, "override_doc_custom=1")

Availability: MWScript handlers. This function is closely analogous to the

command line and REST doreport commands. A similar DoReport command
is also available to Applescript/COM.

Script-only Functions

• Lines in the report are ended with "\n"
• Lines in the report should be no longer than 80 characters. Lines longer

than this will be truncated.

• Tab characters ("\t") can be used in the text provided you have a Cols

directive (see below)

• A line with a single hyphen/dash, will output a line across the page

Lines starting with a # are treated as directives to the report

• #Page: Force a page break
• #Cols=w1,w2, ... : will set columns of the specified width in the report for

lines with tab characters. These will be left justified unless an "R" is
appended to the width. For example #cols=10,10R will give two columns,
the second being right justified. The output will be undefined if the number
of tabs on a line is greater than the number of columns.

• #Other text: Any other line starting with a # will output in bold.

Example:

let myText = "#cols=35,33R\n#Production Report\

t"+datetotext(time(), DateFormShortDateAndTime)+"\n#Shift: One\n"
let myText = myText + "\n-\nThis is what we did today\n"
let myText = myText +"\n#cols=10,40,8R,8R\n#\tItem\tOrder\tMake\

n\n"

let myText = myText + "\tBA100\t25\t15\n"
let myText = myText + "\tBB100\t40\t40\n"
let myText = myText + "\tBC100\t5\t0\n"
let mytext = mytext + "-\n#Page"
doReport("~TextReport", "preview", "Production Report",

createArray("Contents", myText))

Printing Formatted Text:

Will result in the following:

As of version 9.1.7, there is a special built-in report "~textreport" that allows you
to present text in a semi-formatted fashion, obviating the need to make your
own custom report. Your text is passed as a parameter to the report, which will
output it in a mono-spaced font. To use, pass your text in the "Contents"
parameter:

doReport("~TextReport", "preview", "Report Display Name",
createArray("Contents", myText))

A few points to note:
Calculations and things

Script-only Functions

Use this to automate the arrangement of rows in list.

Availability: available within MWScript handlers.

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

External (command, parameters, ...)

Definition: Executes an external helper command which must be installed in

~/Library/Application Support/Cognito/MoneyWorks Gold/Externals
(Mac) or "C:\Users\USERNAME\AppData\Roaming\Cognito\MoneyWorks
Gold\Externals" (Windows) (prior to v 7.1.6 it was the Standard plugins
Scripts folder). The parameters are passed to the executable and the return
value of the function is the helper's stdout output.

On Mac, the external command can be any unix executable (typically it will be a
shell script). Be sure to set the executable bit when installing. If you want to
implement your external using Applescript, you can make an Applescript-as-
shell-script using

ElementExists (array, key)

Result type: Boolean (0, or 1)

Definition: Returns true if an element with the given key exists in the array.

Returns false if no element with the key exists.

Example:

let a = CreateArray();
let a["key1"] = 5
let a["key2"] = "foo"
alert(ElementExists(a, "key1")) // displays 1
DeleteElement(a, "key1")
alert(ElementExists(a, "key1")) // displays 0

Availability: available within MWScript handlers.

See Also:

CountElements: Get the size of an associative array
CreateArray: Create an empty associative array
DeleteElement: Remove a key from an associative array
ParamsFromArray: Expand array values to a variable parameter list

ExchangeListRows (listRef, rowA, rowB)

Definition: Exchanges the two rows in the editable list identified by listRef. The

#!/usr/bin/osascript

row numbers start from 1.
Calculations and things

on the first line.

On Windows, the external command can be a .exe, a .vbs, .js, or a .bat. A VBS
script will be executed in console mode.

Support for javascript externals on Windows is new in v8.

Example:

let r = External("myhelper.exe", "param1", "param2")

On Windows, externals cannot receive parameters that contain a quotation
mark (U+0022), due to limitations of the Windows command line system. For
these externals, MoneyWorks 7.1.5 and later will replace any quote characters
with the trigraph ??'. Your external will need to transform these trigraphs in
each argument to the quote character. e.g. in vbs, Replace(strArg,"??'",chr(34)).
Either that or avoid using quotes.

Availability: The External function is available in MWScript in version 7.1 and

later. The location for Externals changed in v7.1.6

Export (table, format, output [, search, sort, dir, start,
limit])

Result Type: string

Definition: Exports formatted data from the given table in the database. If there

is no search parameter, you will get all records in the table, otherwise only
those matching the search expression.

Using "=" as the search expression will export a single "record" containing just
the field names for the file. The table name may include a sort specifier (e.g.
"Name.Code-"); you can also sort by passing a comma, delimited string
containing fields names to sort by and a sort direction (SortAscending or
SortDescending).

To export with a particular format, use the format parameter. Everything in the
format string is returned verbatim except for anything inside [...] which is
treated as an expression which can reference the fields of the file being
exported. Thus if you want tab-delimited, then put tabs between the
Script-only Functions

expressions. You can use metacharacters \t \r \n \xHH (hex) or \\. e.g.
"[Code],[Phone]\n".

In addition to the search expression for selecting the records to output, you can
limit the range of records in this result that are output, This allows "pages" of
results to be obtained (although you will incur the search and sort cost for each
additional call even if only the start and limit counts change. No state is
retained).

You can also export xml by specifying "xml" as the format. By default, the xml
will be terse (also specifiable by "xml-terse" as format) in that any blank or zero
fields will be omitted, as will system detail lines for transactions and system
(non-importable) fields. To get all fields, specify "xml-verbose" as the format. In
verbose format, system detail line records and non-importable fields will include
a "system" attribute in their opening tag.

If the output parameter is not supplied, the data is sent to stdout, otherwise a
file is created using the full path supplied and the data is written there. The path
must be in a "safe" directory location (see File_Open). If you supply an output
parameter and no format parameter, you will get the format equivalent to a
manual export, otherwise you get all fields. Using a format parameter is strongly
recommended, since default export formats are subject to change.

As a special case, an output path of "tmp" will create a temp file for you and
return the path of that file.

Examples:

export("account", "xml", "") exports all accounts as xml

export("product.code-", "[code]\t[description]\n", "prods.txt")

This writes tab-delimited products and descriptions to prods.txt in the
MoneyWorks Automation directory.

export("transaction", "xml", "", "enterdate=today()",

"sequencenumber", SortAscending, 0, 10)

returns the first 10 transactions entered today as xml.



Calculations and things

Script-only Functions

Availability: This function is available within MWScript handlers. Note that this

function is exactly analogous to the command line and REST export
commands. There is also a similar export command available to AppleScript
and COM. Some of the apparent weirdness (like two ways of sorting) is
down to over 20 years of backwardly-compatible evolution.

let fd = File_Open("a file in the MoneyWorks Automation dir.txt")
if fd <> NULL

let content = File_read(fd) // read the entire file
File_Close(fd)

endif

ExportImage (domain, ident)

Result type: string (a path)

Definition: Exports an image attached to a transaction, product, or other key to

a temporary file.

The domain parameter may be "product", "name", or "key". The ident should
be a sequence number of a transaction, a product code, or a user defined key,
respectively.

If an image exists for the given domain and identifer, it will be copied into a new
file in the system temp directory, and the path to the file will be returned.

If there is no image, the return value will be 1. You should test for this before
using the return value as a path.

Example:

let path = ExportImage("transaction", 1234)
File_Move(path, "Your Image.jpg") // moves to MoneyWorks Automation
folder

Availability: available within MWScript handlers.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_GetLength (filehandle)

Result Type: number

Definition: Gets the length of the file in bytes.

Availability: available within MWScript handlers.

Example:

File_Close (filehandle)

Result Type: no result

let fd = File_Open("a file in the MoneyWorks Automation dir.txt")
if fd <> NULL

let len = File_GetLength(fd)
File_Close(fd)

endif

Definition: Closes the file and releases the file handle. You should close file

handles when you are finished with the file. If you fail to close a file, it will
be closed automatically when the script is unloaded.

Example:

Availability: available within MWScript handlers.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
Calculations and things

Script-only Functions

CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_GetMark (filehandle)

Result Type: number

Definition: Gets the current position (byte offset from beginning) in the file.

Availability: available within MWScript handlers.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_Move (srcPath, destPath)

Result Type: numeric error code; 0 on success, non-zero on failure

Definition: This function operates on closed files (it will work on open files on
Mac, but not on Windows, as per those OS's conventions). The file at
srcPath is renamed (moved) to destPath. Returns 0 on success or non-zero
to indicate failure.

The paths must be in script-accessible ("safe") locations. Additional safe
locations can be specified by the user in their application preferences.

If the destPathis blank (empty string), the function will present a Save As
dialog, with which the user may choose a destination path anywhere.

Files may be moved across volumes.

Availability: available within MWScript handlers.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_Open (path [, mode="r"])

Result Type: A file handle or NULL

Definition: Opens an existing file or, if the mode is "w" or "a", creates a new

file. On success, a file handle is returned which you can use with the other
File_ functions, otherwise a value of NULL is returned. When creating a
new file, any existing file at the given path is replaced. File handles may be
compared to 0 but are otherwise opaque.
Calculations and things

Script-only Functions

The path may be a fully-qualified path (but see note below), or if it is a
simple file name or partial path it will be assumed to be located withing the
default script files directory.

If path is the empty string, a file open/save panel is presented to get the
file location. If the user cancels this dialog, the return value of the function
is 0.

valid modes:

• "r" Open file for reading (the default)
• "w" Truncate to zero length or create file for writing.
• "a" Append; open or create file for writing at end-of-file.
• "r+" Open file for update (reading and writing).

Example:

let fd = File_Open("a file in the MoneyWorks Automation dir.txt")
if fd <> NULL

let content = File_read(fd) // read the entire file
File_Close(fd)

endif

• the `Automation Files` directory in the application support folder (open it
with Help -> Support Info -> Automation Files). This is the new default
location s of v9.1.3. Otherwise the `MoneyWorks Automation` directory in
~/Desktop (if the automation files folder was created in MoneyWorks 9.1.2
or earlier)

• the user's system-defined temp directory (this is the default location for

creating files via `DoForm()` and `DoReport()`.

• the custom plugins directory (excluding the `Scripts` subdirectory)
• the standard plugins directory (excluding the `Scripts` and `Externals`

subdirectories)

• Any path specified by the user in an Open or Save panel.

On Windows, you can't access files with file extensions that denote executable
files.

Note: If you change the safe paths in the app preferences, make sure the first
safe path is a writeable directory. Do not make the first path C:\ on
Windows because that is not writeable, and many scripts may fail when
they try to create files in that location.

Availability: available within MWScript handlers.

Default script files directory and safe paths

See Also:

The default location for files created by scripts (where a fully-qualified path
name is not supplied) is a folder named "Automation Files" inside the user's app
support folder. This folder will be created automatically if it does not exist.

The user can specify a list of safe directories in their application preferences, the
first of which will be used as the default location for partial paths supplied to
`File_Open()`. If no directories are specified, the default location (as above) is
used.

If you supply a fully-qualified path (beginning at root), it must resolve to a
directory that is one of the default "safe" directories, or to a directory that the
user has added to the safe script access directory list in their application
preferences. Accessing a path that is not designated safe will result in your script
receiving a privilege violation error (so you should never attempt to access
unsafe paths).

The default "safe" directories are:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_Path (fd)

Result Type: text
Calculations and things

Definition: Gets the full path of a file created or opened by File_Open.

Availability: available within MWScript handlers in MoneyWorks Gold 8.1.5 and

later.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_Read (filehandle [, optionalCount])

Result Type: string

Definition: Returns a string containing either the entire contents of the file
(from the current mark), or the requested byte count from the mark.

Example:

let fd = File_Open("a file in the MoneyWorks Automation dir.txt")
if fd <> NULL

let content = File_read(fd) // read the entire file
File_Close(fd)

endif

Availability: available within MWScript handlers.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder

Script-only Functions

File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_ReadLine (filehandle)

Result Type: string

Definition: Reads and returns a string containing one line of the file from the
current mark up to the next \n, \r or \r\n. The string contains the line
ending character, but if the line ending is \r\n the trailing \n is excluded and
you will only get the \r.

At the end of the file, the return value will be an empty string (an empty line in
the file would return with the newline)

Example:

let fd = File_Open("a file in the MoneyWorks Automation dir.txt")
if fd <> NULL

while true

let line = File_ReadLine(fd)
if line == ""
break

endif
syslog(line)

endwhile
File_Close(fd)

endif

Limits: Maximum line length is 4K. If you need to read lines of arbitrary length,

use File_Read.

Availability: available within MWScript handlers.

See Also:
Calculations and things

Script-only Functions

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_SetMark (filehandle, offset)

Result Type: no result

Definition: Sets the current position in the file to offset (the offset is always a
byte count form the beginning of the file). Subsequent reads or writes will
start at this position.

Availability: available within MWScript handlers.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_Write: Write text at current position
WriteToTempFile: Create a temp file containing the string

File_Write (filehandle, string)

Result Type: number (system error code)

Definition: Writes the string to the file at the current mark. Return value is zero

if successful.

Example:

let fd = File_Open("a file.txt", "w") // creates in ~/Desktop/
MoneyWorks Automation/
if fd <> NULL

File_Write(fd, "my text")
File_Close(fd)

endif

Availability: available within MWScript handlers.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
WriteToTempFile: Create a temp file containing the string

FindRecordsInListWindow (winRef, searchExpr)

Result Type: none

Definition: Applies a search to a standard or custom list window (just as if the

user had manually executed an Advanced Find).

Availability: MWScript in MoneyWorks Gold 8.0.5 and later
Calculations and things

GetActiveListColumn (listRef)

Result Type: number

Definition: Returns the column number (0-based) of the active cell (has

keyboard focus) of the editable list. If the keyboard focus is not in the list,
the return value is -1.

Note that (particulalry on Windows) clicking a button or other control may
remove keyboard focus from the list, so you may need to store the value in
a property in an EnterCell handler for the list if you want to use the list
column that wasactive when a button was clicked.

Availability: MWScript handlers in MoneyWorks Gold 8.1.3 and later

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

GetActiveListRow (listRef)

Result Type: number

Script-only Functions

Definition: Returns the row number (0-based) of the active cell (has keyboard
focus) of the editable list. If the keyboard focus is not in the list, the return
value is -1.

Note that (particulalry on Windows) clicking a button or other control may
remove keyboard focus from the list, so you may need to store the value in
a property in an EnterCell handler for the list if you want to use the list row
that wasactive when a button was clicked.

Availability: MWScript handlers in MoneyWorks Gold 8.1.3 and later

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

GetClipboardText ()

Result Type: string

Definition: Gets the text on the clipboard. The first time a script uses the

function, the user will be asked to approve clipboard access for the script.
They will have the option of approving once, or always, or declining.

Availability: available within MWScript handlers in v9.0.5r1 and later
Calculations and things

See Also:

PutClipboardText: Copy text to the clipboard

GetDialogHandle (listRef)

Result Type: a windowRef

Definition: Gets a windowRef from a listRef.

Availability: available within MWScript handlers.

GetFieldCount (windowRef)

Result Type: number

Definition: Returns number of UI objects in a window (note that you can't use
GetFieldValue and SetFieldValue on all of them, and some may not have
symbolic names).

Availability: available within MWScript handlers.

Script-only Functions

The window ID is F_TRANS
1 L_LINE
2 M_TABS
3 L_LIST
4 L_ENTRY
5 T_WOFFACCTDESC
6 T_PRODDESC
7 E_NAME
8 E_USERREF
9 E_DATE
10 M_PERIOD
11 M_BANK
12 E_ORDERNUM
....

Another way, assuming you are only interested in edit fields:

on EnterField(win, item)

Navigator("", item)

end

This will display a tooltip for every field in every window† as the field is
activated.

†Note that the Script Editor window itself does not receive script events.

GetFieldName (windowRef, fieldNum)

Availability: available within MWScript handlers.

Result Type: text

See Also:

GetFieldCount: Get the number of controls in a window (standard or

Definition: Get the symbolic name for a UI field from its index.

custom)

Allows you to get symbolic names of fields by iterating over the field numbers.

GetFieldNumber (windowRef, fieldNameString)

Example: To get a list of all of the symbolic field names in a window, activate

the following script and then open the window of interest; then look in the
log file (and deactivate the script).

on Before(w)

Syslog(The window ID is " + GetWindowID(w))
foreach f in (1, GetFieldCount(w))

syslog(f + " " + GetFieldName(w, f))

endfor

end

For the standard Transaction entry window, you'll get something like:

Result Type: number

Definition: Convert the symbolic name of a UI object in a window to its index

number.

Availability: available within MWScript handlers.

See Also:

GetFieldName: Get the symbolic identifier string for a standard or custom

field or control
Calculations and things

GetFieldValue (windowRef, fieldNumOrName [,
boolPeriodDecode])

Result Type: text

Definition: Gets the value of a field as a string. Works with check boxes and

popups as well.

The field can be identified by number or its symbolic name. Using the symbolic
name is very strongly recommended because it is possible for field numbers to
change between versions of MoneyWorks. The only reason to use the field
number is if you are iterating over all the fields in a window (possibly to find out
what their symbolic IDs are).

For a popup control, the result is the text of the selected item. For a radio
button or checkbox control, the result will be "1" if the control is set, otherwise
"0".

Example:

Script-only Functions

Availability: available within MWScript handlers.

GetLastErrorMessage ()

Result type: text

Definition: Returns the last error message that MoneyWorks utput to its log
file. If you are scripting an import, this can be useful to figure out why an
import failed, for example. Note that it is only useful to call this function in
response to some other function call failing that you know outputs a
message to the log. Otherwise you will likely just receive a stale, unrelated
message.

GetListContents (listRef [, bSelectedOnly] [, bAsSelection])

Definition: Gets the current contents of a list instantiated with InsertListObject
or InsertEditListObject. For a selectable list object, you can specify true for
the selectedOnly parameter to get only the highlighted rows.

TextToDate(GetFieldValue(win, "E_DATE")) gets the transaction date from
the transaction window referred to by win.

You can also use this function with lists that are part of the standard
MoneyWorks user-interface.

Notes:

You can use a field number of -1 to get the window title.

For a record entry window, you can use a field number of -2 to get the sequence
number of the record being modified in the window ("0" will be returned if it is
a new record, as the sequence number has not yet been allocated). Note that
the return value is a string containing the sequence number in decimal.

In MoneyWorks Gold 8.1.5 and later, you can use a field number of -3 in a record
entry window to get the locked state of the record being modified in the
window (if the window is read-only due to another user having the record
locked, this will return "1", otherwise "0").

In MoneyWorks 9.0.8 and later, you can pass TRUE as a third parameter to
decode a period menu to the period number instead of retrieving the text of the
selected item.

In MoneyWorks 9.1.4 and later, if the list is a list of database records, passing
TRUE for both bSelectedOnly and bAsSelection will cause the function to return
the highlighted records as a selection instead of as tab-delimited text.

Availability: available within MWScript handlers.

See Also:

InsertListObject: Initialise selectable list object in a window
SetListSelect: Highlight a row in a list
SetOptionsForEditList: Set options for the list

GetListField (listRef, rowNum, columnNumOrName)

Gets the text of a cell in an editable list (such as the transaction detail list). You
can get a listRef using the GetListHandle function, or it will be passed to you as a
parameter to certain handlers, such as ExitedCell.
Calculations and things

RowNum is zero-based. To reduce fragility of scripts over software versions,
avoid using column numbers. Use column names.

Availability: within an MWScript handler

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

GetListHandle (windowRef, listName)

Get the named list (prior to MoneyWorks 8, the name is the name in the tab
that the list is embedded in (e.g. "By Account", "Payment on Invoice", ...). If the
requested list is not visible, return value is a NULL handle. Otherwise the
returned list handle can be used in the list accessor functions. When used with a
tab name, this function will only work for the transaction detail lists.

From MoneyWorks 8, the listName parameter can be the symbolic ID of the list
object. In this usage, any list handle may be obtained (for standard or custom
windows).

See Also:

AddListLine: Add a row to an editable list

Script-only Functions

DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

GetListLineCount (listRef)

Result Type: anumber

Gets the number of rows in the list.

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
Calculations and things

Script-only Functions

SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

Use this when you need to ensure that some operation will only be executed by
one client.

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

Example usage:

can be exited

GetListName (listRef)

Result Type: string

// only do once per week
if GetMutex("rate_update")    // make sure only one client at a

time runs this code

let values = GetPersistent("user2", kMyDevKey,

"last_currency_update")

if values["date1"] < Today() - 7 and DateToPeriod(Today())

Definition: Gets the name of the tab that the list lives under. Works in the

transaction entry window to allow you to detrmine whihc tab is selected.

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

= CurrentPeriod()

GetRates()

let values["date1"] = Today()
SetPersistent("user2", kMyDevKey,

"last_currency_update", values)

endif
ReleaseMutex("rate_update")

endif

Availability: MWScript handlers

keyboard focus

See Also:

GetActiveListRow: Get the row number of an edit list that has keyboard

ReleaseMutex: Release a mutex

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

GetMutex (name)

Definition: Attempts to obtain a named mutex from the server. If another user
already has the named mutex, returns 0, else 1 if successful. Always
successful on a single user system.

GetNextReference (transType [, bank])

Result Type: string

Definition: Gets a reference number from the reference number service. This is
an atomic operation, so no other user will receive the same reference
number (so long as it is a numeric autoincrementing reference number).
Call this when you are going to create a transaction (say an invoice) via
importing and want a reference number from the invoice number
sequence. If you need to relinquish the reference number, you can use
TryPutBackReference. Supported values for the transType are "AP"
('Electronic' payments), "RT" (debtor receipts), "CR" (cash sales), "CP" (cash
payments), "CQ" (cheque run payments), "DI", "PO", "CI", "QU", "SO", "JB"
(job). For transaction types involving a bank account, you must supply a
bank account code as well. Do not use "BK" or "JN".

See Also:
Calculations and things

Script-only Functions

TryPutBackReference: Try to return an unused reference number (allocated

Note: Using GetProfile has a performance impact itself, so don't leave it in

by GetNextReference) to the reference number allocator.

GetPersistent (table, key1, key2)

Result Type: Boolean (0 or 1)

Definition: Loads values from a record in one of the user-definable persistent
storage tables ("user", "user2", "lists", and "offledger"). Returns an
associative array that contains the field values keyed by the field names
(does not include they keys—you already know those).

Example

on Load

if GetMutex("rate_update")

let values = GetPersistent("user2", kMyDevKey,

"last_update")

if values["date1"] < Today() - 7

GetRates()    // do weekly thing

scripts that you want to run as fast as possible. In v9, the MWScript runtime
will only collect performance data if the GetProfile function is encountered
by the compiler.

_NTDump ()

Result type: string

Definition: Returns a list of identifiers from the nametables in the MWScript
language virtual machine along with their types and values (including
symbolic constants). The dump will begin in the caller's scope and continue
to the global nametable. This is mostly useful for introspection of the
MWScript language. You can use it, for example, to obtain a list of
supported constants and their values (such as CURLOPT constants).

See Also:

SysLog: Write message to MoneyWorks_Gold.log
TypeOf: Get the type enumeration of a value or variable

let values["date1"] = Today()
SetPersistent("user2", kMyDevKey, "last_update", values)

GetRecordForListRow (listHandle, rowNumZeroBased)

endif
ReleaseMutex("rate_update")

endif

end

See Also:

SetPersistent: Create or update a user table record using data in an

associative array

GetProfile ()

Result type: string

Definition: Obtains a report on the running time of each line of the script that

the function is called from. Every line with a running time of 1ms or more is
included. Use this function to diagnose performance problems in your script
(i.e to answer the question: "what part of my script is taking so long?").

Result type: array

Definition: Returns the entire in-memory record corresponding to an editable

list row as an associative array. You can use this in a script to obtain field
values of detail line records in the transaction entry window that are not
otherwise visible.

Example:

on ExitedCell:F_TRANS:By_Item(w, l, r, c, v)
let rec = GetRecordForListRow(l, r)
syslog(rec)

end

See Also:

PutRecordForListRow: Put mutable fields from array to list row record
Calculations and things

GetScriptText (scriptName)

Result type: text

Availability: available within MWScript handlers.

GetWindowID (windowRef)

Script-only Functions

Definition: Returns the text of a named MWScript as a string. Why on earth
would you need this? Well, you can store text other than actual scripts in
the Script editor. For example, some boilerplate html, xml, or JSON data.
Obviously such text will not compile as an MWScript if you attempt to
activate, but it can be useful to be able to load such text for use in another
script (e.g. some html and javascript for displaying a javascript chart).

The windowID is a string denoting the class of the window. E.g. transaction
entry windows have a windowID of “F_TRANS”. Window messages will usually
be implemented with window-specific handler names incorporating the
windowID, so its value is usually implicit. If you use a general handler, you can
get the windowID from the windowRef using the GetWindowID() function.

GetTaggedValue (taggedTextString, tag)

Result type: text

Definition: Returns the value from a tagged key-value string.

Example:

GetTaggedValue("_size: Sm; _style: LS; _colour: black;",

"_size")

returns "Sm".

Rationale: The TaggedText field is normally used with

ReadCurentRecordForWindow and WriteCurrentRecordForWindow, but you
may need to display a tagged value in a custom column of a list. This is what
GetTaggedValue() is for.

Availability: within an MWScript handler

GetWindowName (windowRef)

Result Type: string

Definition: Gets the window title.

Availability: within an MWScript handler

GetWindowProperty (windowRef, propertyName)

Result Type: varies

Definition: Retrieves data previously stored in a window using

SetWindowProperty. The data will retain the type it was stored with.

Availability: within an MWScript handler in MoneyWorks Gold 8.1.8 and later

See Also:

SetTaggedValue: Encode data for a TaggedText field (for custom data

See Also:

storage)

GetWindowByID (idString)

Result Type: a WindowRef or NULL

ReadCurrentRecordForWindow: Load a record in custom UI, or tagged fields

in standard UI

SetWindowProperty: Store data related to a window
WriteCurrentRecordForWindow: Save a record in custom UI, or save tagged

fields in standard UI

Definition: Gets a handle to the first window instance that has the given

GotoField (windowRef, fieldID, [selStart], [selEnd])

identifer.

Definition: Moves the keyboard focus to the nominated field, if possible.
Calculations and things

Script-only Functions

The field parameter can be a string with the field's symbolic identifier, or it can
be the numeric field number. Optionally specify a character range to select.

Availability: available within MWScript handlers in MoneyWorks Gold 9.2 and

later.

You can call this from a Before handler to set a desired initially focussed field.
You might also call it from an ItemHit handler to set an appropriate field in
response to a checkbox or popup menu changing.

GotoNextField (windowRef)

Result Type: none

Example

on Before:F_TRANS:DI(w)

GotoField(w, "E_DESC")    // always go to Description field

when openeing a debtor invoice
end

Do not call it from a handler involved with the normal flow of focus, such as
ExitedField, EnterField, ValidateField, etc.

Availability: available within MWScript handlers.

GotoListField (listRef, rowNum0, columnNum0OrName,
[selStart], [selEnd])

Definition: Attempts to advance the focus to the next field in the window

identified by windowRef. This would be as if the user had pressed the tab
key. If the current field does not validate, then the focus may not change.

ImportImage (domain, ident, path)

Definition: Loads an image file and attaches it to a transaction, item, asset, or

other record.

domain may be “transaction”, “product” or (from version 8) "key"

ident is the sequencenumber for a transaction or product code for a product or
any identifier of your choosing for key

Definition: Moves the keyboard focus to the nominated cell of the list, if

possible. Optionally specify a character range to select.

path is the filesystem path to the image file to import and attach to the record
(a POSIX path on Mac).

Example: Checks that locations are not blank in a debtor invoice, and selects

the first blank field when validating the transaction.

Image files are stored in a "Pictures for Companyname" directory in the
MoneyWorks Custom Plugins folder.

on Validate:F_TRANS:DI(w)

let list = GetListHandle(w, "By Item")
if list <> NULL

foreach row in (0, GetListLineCount(list) - 1)

if GetListField(list, row, "Location") = ""
GotoListField(list, row, "Location")
Navigator("", "Please enter a location")
return false

endif

endfor

endif
return true

end

Do not call it from a handler involved with the normal flow of focus, such as
ExitedCell, EnterCell, ValidateCell, etc.
If the path is an empty string, any existing image for the domain+ident will be
deleted.

Availability: The ImportImage function is available in MWScript in version 7.2

and later

The keyusage is new in version 8. Use this to store images with arbitrary
identifiers that may or may not correspond to records in the database. It is up to
you to use an identifier scheme that will guarantee unique identifiers for any
image you may store (and won't collide with image identifiers for any other
scripts you may install). Do not use numeric-only key identifiers—these are
reserved for asset images in v9, so you should use a prefix unique to your use-
case to ensure not collision of keys. e.g. "key:MYPREFIX_"+actual_key



Calculations and things

Script-only Functions

InsertEditListObject (windowHandle, itemID,
column_definition, optional_initial_data, optional_mode)

"|||r" — column with blank heading, default width, default alignment and
read-only

Definition: Instantiates an editable list object in a custom window (which has
itself been instantiated with ModalWindow() or CreateWindow()). The
custom window will already have a placeholder object for the list, but that
will be blank until a list is actually instantiated. Use this function in the
Before handler for your custom window to instantiate your list object. You
must have inserted the list before you attempt to get or use a handle to the
list object.

The itemID is the item number or identifier string for the placeholder item in the
custom form.

The column definition is a tab-delimited list of column headings. Each column
heading may optionally be followed by specifiers for the column width; the
column alignment; and whether or not the column is read-only. These specifiers
are separated by vertical bar characters (|). The list should be terminated with a
newline character (\n).

column_definition = Heading_Text | width * | alignment | writeability

The * after the width is optional and denotes that the column will resize if the
columns widths do not add up to the list width. Default is 80 and the first
column is the resizable one by default.

Alignment can be one of 'L', 'C', 'R' for left, centre or right alignment. Default is
left.

Writeability can be 'w' or 'r' for writeable or read-only. Writeable is the default,
so only needs to be specified for read-only columns.

Examples:

"My Heading" — a left aligned cell (by default, 80 points wide)

"My Heading|100" — 100 points wide column

"My Heading|80|R" — right-aligned column

"My Heading|30|C|r" — centred read-only column
Note that the headings will define the specific messages that you will get for
handlers such as ExitedCell. e.g. ExitedCell:F_FORM:L_LIST:My_Heading(...)

The optional_initial_data can be a tab- and newline-delimited table of data
which should have the same number of columns as the column definition. This
will be used to populate the initial content of the editable list. If it is omitted the
list will be empty. You can add rows to the list later using AddListLine().

The optional_mode can specify behaviour of the list. Currently the only support
mode is "autoadd" which adds a new row to the bottom of the list when the
user presses return when on the last line. This mode is off by default.

Example usage:

on Before:F_FORM(w)

InsertEditListObject(w, "L_LIST", "Head1\

tHead2|99*\tHead3|30|C|r\tHead4|70|R\n",

"FOO\tBar\tN\t123.45\nBAZ\t\t*\t99.00\n")

end

You can extract modified data using GetListField on each cell, or you get get the
entire table back as tab/newline-delimited text using
GetListContents(listHandle).

Availability: available within MWScript handlers.

InsertListObject (windowHandle, itemID,
column_definition, optional_initial_data, optional_mode)

Definition: Instantiates a selectable list object in a custom window (which has
itself been instantiated with ModalWindow() or CreateWindow()). The
custom window will already have a placeholder object for the list, but that
will be blank until a list is actually instantiated. Use this function in the
Before handler for your custom window to instantiate your list object. You
must have inserted the list before you attempt to get or use a handle to the
list object.



Calculations and things

Script-only Functions

The itemID is the item number or identifier string for the placeholder item in the
custom form.

The column definition is a tab-delimited list of column headings. Each column
heading may optionally be followed by specifiers for the column width; and the
column alignment. These specifiers are separated by vertical bar characters (|).
The list should be terminated with a newline character (\n).

column_definition = Heading_Text | width * | alignment

The * after the width is optional and denotes that the column will resize if the
columns widths do not add up to the list width. Default is 80 and the first
column is the resizable one by default.

Alignment can be one of 'L', 'C', 'R' for left, centre or right alignment. Default is
left.

on Before:F_FORM(w)

InsertListObject(w, "L_LIST2", "Head|99*\tHead2|99\tHead3|30|C\

tHead4|70|R\n",

"Blah\tBlah\t*\t0.00\nFoo\tBar\tn\t99.00\n" * 10,

"multiple")
end

You get the entire table back as tab/newline-delimited text using
GetListContents(listHandle) (useful if the user has reorderd the rows by
dragging), or just the highlighted rows using GetListContents(listHandle, 1).

Availability: available within MWScript handlers.

See Also:

GetListContents: Get a tab-delimited string with the contents of a simple list
SetListSelect: Highlight a row in a list
SetOptionsForEditList: Set options for the list

Examples:

InsertVars (string [, startdelim, enddelim])

"My Heading" — a left aligned cell (by default, 80 points wide)

"My Heading|100" — 100 points wide column

"My Heading|80|R" — right-aligned column

The optional_initial_data can be a tab- and newline-delimited table of data
which should have the same number of columns as the column definition. This
will be used to populate the content of the list.

The optional_mode can specify behaviour of the list. This should be a number
consisting of bit flags using the constants `fListMode_Selectable`,
`fListMode_OnlyOne`, `fListMode_ContinuousItemHit`,
`fListMode_DoubleclickAccept`, `fListMode_DoubleclickItemHit`,
`fListMode_ToggleSelection`, `fListMode_Draggable`.

Deprecated: Alternatively the mode can be a comma-delimited string containing
keywords: It can include the keyword "drag" for a reorderable list (equivalent to
fListMode_Draggable), or "multiple" to allow selecting more than one line at a
time (opposite to fListMode_OnlyOne).

Example usage:
Definition: Returns a string with instances of <<varname>>or <<expression>>
in the input string replaced with the actual value of the in-scope variable or
expression. You can optionally specify a pair or alternative delimiter stinrgs
to use instead of << and >>. In-scope variables include any local variables
instantiated in the handler, script properties, or system global variables.

Examples:

InsertVars("The name of the company is <<NAME>>")

returns "The name of the company is Acme Widgets Ltd" (NAME is a system
global variable containing the company name for the document)

let localvar = Today()
let result = InsertVars("Tomorrow is <<localvar + 1>>")
Alert(result)



Calculations and things

InstallMenuCommand (menuItemText,
handlerNameString)

Install a command in the scripts section of the Command menu. The handler will
be called when the command is selected. You can remove the item by calling
again with an empty handler name. Your handler does not need to be declared
public since the script context is known at the time of installation.

InstallToolbarIcon (windowRef, handlerNameString)

For supported windows (currently the transaction entry window, and list
windows), adds an icon to the toolbar. The icon name will be the same as the
handler name. When clicked, the handler will be called with the windowRef
passed as a parameter. Returns true (1) on success, 0 if no icon was added (due
to unsupported window, or toolbar full). Your handler does not need to be
declared public since the script context is known at the time of installation.

JSON_AsXML (jsonString)

Result type: text

Definition: Returns the JSON data as XML data.

Example:

SysLog(JSON_AsXML(`{ "id": 1, "name": "Widget", "price": 12.50,

"tags": ["bronze", "medium"]}`)

outputs:

<?xml version="1.0" encoding="UTF-8"?>
<JsonItem type="json:object">

<id type="json:number" name="id">1</id>
<name type="json:string" name="name">Widget</name>
<price type="json:number" name="price">12.5</price>
<tags type="json:array" name="tags">

<JsonItem type="json:string">bronze</JsonItem>
<JsonItem type="json:string">medium</JsonItem>

</tags>
</JsonItem>

Script-only Functions

See Also:

JSON_Free: Free a parsed JSON structure

JSON_Free (handle)

Result type: none

Definition: Frees a JSON object handle allocated by JSON_Parse() or

JSON_Get(). Call this when you are done accessing the JSON data.

See Also:

JSON_AsXML: Convert JSON to XML

JSON_Get (JSON_object, id [, id, ... ])

Result type: text, number, or JSON object handle depending on JSON object

contents

Definition: Extracts data or a sub-object from a JSON object obtained from
JSON_Parse() or JSON_Get(). The extracted data is identified by the
sequence of id identifiers, which will be textual id names, or, if the JSON
structure being accessed is an array, a numeric index.

It is assumed that you know the structure of the JSON data in advance. If
the element specified does not exist, the result will be NULL. When
accessing an array by index, if the index is out of range, the return value will
be NULL, thus you can iterate with an increasing index until you get a NULL
result.

If JSON_Get returns an object or array reference (vs a string, number, or
boolean value), you must free the reference when you are finished with it,
using JSON_Free()s.

Example:

on AddJSONTransactions(json)

let t = 0
let jObj = JSON_Parse(json)

if not jObj    // the JSON is bad

alert(GetLastErrorMessage())
Calculations and things

return NULL

endif

foreach i in (0, 9999)    // we don't know how big the array

is; assume no more than this

let jtrans = JSON_Get(jObj, "transaction", i)    // array

index is 0-based

if jtrans == NULL    // exit loop at end of array

break

endif
let n = JSON_Get(jtrans, "amount", "amount")    // get

amount element from amount subobject

JSON_Free(jtrans)    // this is an object reference, so it

must be freed

let t = t + n

endfor
JSON_Free(jObj)
return t

end

See Also:

JSON_AsXML: Convert JSON to XML
JSON_Free: Free a parsed JSON structure
ParamsFromArray: Expand array values to a variable parameter list

JSON_Parse (jsonText)

Result type: JSON object handle

Script-only Functions

"transaction": [
{

"CONTAINER": "bank",
"id": 2829798,
"amount": {

"amount": 12345.12,
"currency": "USD"

},
"description":{

"original": "0150 Amazon  Santa Ana CA 55.73USD",
"consumer": "Electronic Purchases",
"simple": "Amazon Purchase"

}

}
]

}

Free the JSON object handle with JSON_Free() when you are finished with
it.

See Also:

JSON_AsXML: Convert JSON to XML
JSON_Free: Free a parsed JSON structure
ParamsFromArray: Expand array values to a variable parameter list

LoadHTMLInWebView (windowRef, itemID, html)

Definition: Loads html text into the specified web view object.

Definition: Parses the JSON and returns a JSON object handle that can be used

to query the resulting object.

Availability: available within MWScript handlers.

Example:

// get original description from JSON transaction (see below)
let jsonObjectHandle = JSON_Parse(jsontext)
// access description from item 0 in the transaction array
let subObject = JSON_Get(jsonObjectHandle, "transaction", 0,

"description")

let s = JSON_Get(subObject, "original")
JSON_Free(subObject)
JSON_Free(jsonObjectHandle)

Returns "0150 Amazon Santa Ana CA 55.73USD" when jsontext is:

{

See Also:

LoadURLInWebView: Load a URL into a custom web view control
WebViewControl: Set option(s) on a web view control (links load externally

or not)

LoadPicture (windowRef, itemID, pictureSpec)

Loads a picture into a picture object. PictureSpec can be one of
"product:<code>", "file:<path>", "transaction:<seq>", "key:<key>", or
"builtin:<name>".

Example:
Calculations and things

on Before:My_Wind(w)

LoadPicture(w, "P_MYPICITEM", "product:BA100")

end

In MoneyWorks 9 and later you can specify "no_pic" to display a placeholder
indicating that an image can be dropped/pasted. The picture object will adopt
behaviour similar to the Product entry window picture object.

Availability: available within MWScript handlers.

LoadURLInWebView (windowRef, itemID, url)

Definition: Loads the URL into the specified web view object. The url should

already have any necessary URL-encoding.

Note: Scripts with URL-encoded parameters in the URL may need to be

updated. Prior to version 9 a properly URL-encoded URL (with % escapes)
would have the percent characters themselves re-encoded as %25 on
macOS, effectively breaking such URLs. This behaviour has been fixed in v9,
but old scripts that themselves worked around this Mac problem, will need
to check the MoneyWorks version and behave appropriately if the script
needs to run on both v8 and v9.

Availability: available within MWScript handlers.

See Also:

LoadHTMLInWebView: Load HTML into a custom web view control
WebViewControl: Set option(s) on a web view control (links load externally

or not)

Mail (to, subject, content, attachmentName,
attachmentPath)

Definition: Create or send an email according to the email preferences (note

that if the email preference is to create an email in the default email client,
the message content parameter may be ignored, depending on the email
client).

Note: if the attachmentName is not "", the file referenced by attachmentPath

will be renamed to attachmentName (if the interface to the email system
allows it).

Script-only Functions

Availability: MWScript handlers

from v7.3 onwards, the attachmentPath is optional (you can create an email
with no attachment). Prior to 7.3 an invalid attachment path may result in no
email being created.

In MoneyWorks 8 and later, if a file already exists in the same location with the
requested attachmentName, that file will be deleted first (otherwise the rename
would fail). Therefore you should not use this option with mail clients that
expect the attachment file to continue to exist after the message is created
(Entourage on Mac, for example).

MergeOrderLines (windowRef, lineNum)

Merges the detail line with the one after it provided that the product codes are
the same; and at least one of the serial numbers is blank (actually, we'll blank
it).

If they are order lines, also merges the order qties and the prevShip Qties.

You can use this to help automate the assignment of serial numbers in an order.

Availability: available within MWScript handlers in MoneyWorks 8 and later

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
Calculations and things

Script-only Functions

GetListName: Selected tab name for Transaction entry details list
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

ModalListWindow (id, table, search, headingString,
columnsString [, modes] [, properties])

Definition: A variant of CreateListWindow for displaying a list of records in a

modal window. ModalListWindow does not automatically provide double-
click-to-edit-in-a-new-window functionality.

The window's first control (object #1) should be a list object. It will be replaced
with a record list for the requested database table named by the table
parameter. The list will be filtered according to the search string.

See CreateListWindow for the definition of the remaining parameters.

The window should have OK and Cancel buttons. The return value is the
identifier of the last button clicked.

In v9 and later, you can provide an optional propertiesassociative array which
will be used to initialise the properties of the window (that you would otherwise
set and get with SetWindowProperty and GetWindowProperty. This removes
the need to use global properties to pass parameters to window handlers. Note
that to provide properties this way you must also provide a modes parameter
(use 0 if you don't need special modes).

Availability: available within MWScript handlers.

See Also:

CreateWindow: Instantiate a modeless custom window
ModalJobsheetEntryWindow: Run a modal Jobsheet entry modify/create

window

ModalTransactionWindow: Run a modal transaction modify/create window
ModalWindow: Instantiate a modal custom window

ModalWindow (your_wind_id [, property_array])

Result Type: string

Definition: Instantiates a modal window using the UI form with identifier

your_wind_id (i.e. the name you gave the form in the script editor). Your
window definition should include a default (OK) button and usually a Cancel
button. The user clicking either of these will cause the window to close. If
neither of these buttons is present, the window will have a close box which
will have a similiar effect to Cancel.

In v9 and later, you can provide an optional propertiesassociative array which
will be used to initialise the properties of the window (that you would otherwise
set and get with SetWindowProperty and GetWindowProperty. This removes
the need to use global properties to pass parameters to window handlers.

The return value of ModalWindow will be the identifier of the last control hit
(generally this will be the id of the cancel button or the OK button).

The window will receive the usual window-related messages. e.g: You can write
a Before handler named Before:your_wind_id(windowRef) in which you can
set up the state of the window's controls.

Windows automatically remember their last size and location (this information
is written into a file named script_id.properties. You can set the values of
the properties your_wind_id_left, your_wind_id_top, your_wind_id_right,
and your_wind_id_bottom before instantiating the window to override the size
and location.

Availability: available within MWScript handlers.

See Also:

CreateWindow: Instantiate a modeless custom window
ModalJobsheetEntryWindow: Run a modal Jobsheet entry modify/create

window

ModalListWindow: Instantiate a modal custom database table list window
ModalTransactionWindow: Run a modal transaction modify/create window
Calculations and things

Script-only Functions

ModalJobsheetEntryWindow (slotOrSelOrType [,
property_array])

ModalTransactionWindow (seqOrSelOrType [,
property_array])

Result Type: boolean

Result Type: boolean

Definition: Opens a modal jobsheet entry window to allow the user to view/
edit an existing jobsheet entry or selection of jobsheet entries, or enter a
new one.

Definition: Opens a modal transaction entry window to allow the user to view/
edit an existing transaction or selection of transactions, or enter a new
transaction.

The parameter slotOrSelOrType may be a number, a selection, or a string.

The parameter seqOrSelOrType may be a number, a selection, or a string.

Provide a slot/record number (param type is number) of an existing
jobsheet record to allow viewing/editing of that record.

Provide a sequence number (param type is number) of an existing
transaction to allow viewing/editing of that transaction.

Provide a selection of jobsheet records (param type is selection) to modify
that selection (the Next and Prev buttons will be available).

Provide a selection of transactions (param type is selection) to modify that
selection (the Next and Prev buttons will be available).

Provide a type code (param type is string) (one of "PE" or "BU") to create a
pending or budget jobsheet record.

You can provide an optional propertiesassociative array which will be used
to initialise the properties array of the window. You can used other script
handlers specialised for the F_JOBSHTEENT window to access them via
GetWindowProperty.

The return value of ModalJobsheetEntryWindow will be non-zero if the user
did not cancel.

Availability: available within MWScript handlers in MoneyWorks Gold v9.1.4

and later.

See Also:

CreateWindow: Instantiate a modeless custom window
ModalListWindow: Instantiate a modal custom database table list window
ModalTransactionWindow: Run a modal transaction modify/create window
ModalWindow: Instantiate a modal custom window

Provide a transaction type code (param type is string) (one of "CR", "CP",
"DI", "CI", "JN", "SO", "PO", "QU") to create a new transaction of that type.
Note that the user can change the type of the transaction.

If the paremeter is a different type or an invalid transaction type code, the
default is to make a new transaction with the default (last used) transaction
type.

You can provide an optional propertiesassociative array which will be used
to initialise the properties array of the window. You can used other script
handlers specialised for the F_TRANS window to access them via
GetWindowProperty.

The return value of ModalTransactionWindow will be non-zero if the user
did not cancel.

Availability: available within MWScript handlers in v9.1 and later.

See Also:

CreateWindow: Instantiate a modeless custom window
ModalJobsheetEntryWindow: Run a modal Jobsheet entry modify/create

window

ModalListWindow: Instantiate a modal custom database table list window
Calculations and things

Script-only Functions

ModalWindow: Instantiate a modal custom window

see the JSON_Parse example

Navigator (hotlink, coachtip)

let jsonObjectHandle = JSON_Parse(jsontext)

Execute the hotlink (privileges and window modality permitting). The optional
coachtip text will be displayed after successful execution. You can also use this
to just display a coachtip by passing an empty hotlink string.

Availability: available in a MWScript handler. The hotlink may be ignored if it
would be inappropriate (e.g. there is a modal dialog up).

NotifyChanged (tablename, ...)

let a = CreateArray()
let a[0] = "transaction"
let a[1]= 0
let a[2] = "description"
let a[3] = "original"

let s = JSON_Get(jsonObjectHandle, ParamsFromArray(a))

Limitation: The number of parameters expanded must not exceed the stack
space for the script. If it's going to be more than a few dozen, choose
another method.

If you've imported or changed records from a script and want the changes to be
displayed immediately in any open windows, call NotifyChanged with the name
of the database table(s).

Availability: available in a MWScript handler.

See Also:

CountElements: Get the size of an associative array
CreateArray: Create an empty associative array
DeleteElement: Remove a key from an associative array
ElementExists: Check if a key exists in an associative array

OpenDocument (pathOrURL)

PostTransactions (selection)

Opens a document or connects to a url (beginning with "moneyworks://".
Returns 1 on success, 0 on failure.

Availability: Available only to scripts loaded from the Scripts folder. A document
script cannot open another document, since that would unload the calling
script.

Definition: Posts the transactions in the selection. The selection must be a

transaction selection.

Example:

PostTransactions(CreateSelection("transaction", "status=`U`"))

ParamsFromArray (array)

Return type: a variable patameter list

This will post all of the currently-unposted transactions.

Availability: available within MWScript handlers

Definition: converts the array values to a variable number of parameter values.
This kind of "var-arg" type may only be passed to functions that take a
variable number of parameters, such as Count(...) or JSON_Get(obj, ...). In
fact this function is specifically intended for use with JSON_Get() where the
identifier accessors need to be determined programmatically.

PutClipboardText (text)

Result Type: string

Definition: Sets the text on the clipboard.

Example:

Availability: available within MWScript handlers in v9.0.5r1 and later
Calculations and things

See Also:

GetClipboardText: Get the text on the clipboard

PutRecordForListRow (listHandle, rowNumZeroBased,
array)

Result type: none

Definition: Updates script-mutable fields in the in-memory record associated

with an editable list, using values from the array.

Example:

on ExitedCell:F_TRANS:By_Item(w, l, r, c, v)

// ...
// store some values in "hidden" fields of the detail line
PutRecordForListRow(l, r, CreateArray("_tagged1", "foo",

"Detail.Custom1", "bar"))
end

See Also:

GetRecordForListRow: Get list row record as array

ReadCurrentRecordForWindow (windowRef)

Result type: array

Script-only Functions

For custom record editing windows only, operating on User, User2, OffLedger or
Lists, you can use WriteCurrentRecordForWindow to write changed values back
to the database.

For a standard record editing window, such as the transaction entry window, the
record is already loaded and locked; this function merely copies the original
loaded field values into the array. The array values do not change if the UI field
content changes while the window is open.

In v9, ReadCurrentRecordForWindow makes the returned value a window
property, so multiple scripts operating on the same window will see the same
result (i.e. get a reference to the exact same array).

Availability: available within MWScript handlers.

See Also:

GetWindowProperty: Retrieve data previously stored for a windowHandle
SetWindowProperty: Store data related to a window
WriteCurrentRecordForWindow: Save a record in custom UI, or save tagged

fields in standard UI

ReleaseMutex (name)

Definition: Releases the named mutex previously obtained by a call to

GetMutex. If the client logs out before releasing a mutex, the mutex is
automatically released.

Definition: This function may only be used in a record-editing window. Either a
custom window that is automatically instantiated via the second parameter
of CreateListWindow or one of the standard MoneyWorks ones.

For a custom window, the function loads the current record in the selection
associated with the window, and locks it to prevent other users writing it. It
returns an associative array containing the value of every field in the record (the
keys of the array are the field names). If the record has a tags field, each tag is
parsed out into a separate array element.

Availability: MWScript handlers

See Also:

GetMutex: Try to obtain a named mutex

SavePicture (window, itemID)

Resulttype: string (a path)

Call this function from the Before handler of your record editing window to get
the data to populate your window controls with.

Definition: Saves the image in the Picture control identified by itemID, into a

new temporary file and returns the path to the file.

Availability: available within MWScript handlers.
Calculations and things

Say (text)

Return type: none

Definition: Speaks the text using the system voice. Can be useful for debugging

scripts or user alerts.

Example: Say("Mary had a little lamb")

See Also:

Alert: Display an alert with up to 3 buttons
Ask: Very simple dialog box with controls
ChooseFromList: Very simple list dialog box

SelectWindow (windowRef)

Result Type: none

Definition: Brings the window to the front, if possible.

Availability: available within MWScript handlers.

SetExchangeRate (currency, date, period, newRate)

foreach row in textfile url

let rates = rates + Right(Left(Slice(row, 1, ","), 7), 3) +

Script-only Functions

"\t" + Slice(row, 2, ",") + "\n"

endfor
foreach rate in text rates

let cur = Slice(rate, 1, "\t")
let xr = TextToNum(Slice(rate, 2, "\t"))
syslog("setting " + cur + " to " + xr)
SetExchangeRate(cur, Today(), CurrentPeriod(), xr)

endfor

end

Availability: within an MWScript handler

See Also:

CurrencyConvert: Convert amount between currencies
CurrencyName: Full name or denomination of a currency

SetFieldEnabling (windowRef, fieldNameOrIndex, enabled)

Enable or disable a custom control (in report setup dialog or in a custom Ask
dialog). The enabled parameter should be 1 to enable or 0 to disable. This can
only be used on custom controls that you have created; not on built-in controls.

In MoneyWorks 8, this function also applies to any control in a custom window.

Definition: Sets the currency rate and creates the associated journal entry.

SetFieldVisibility: Show or hide a custom control

See Also:

Example:

on GetRates

let url = "http://download.finance.yahoo.com/d/quotes.csv?s="
let currencyCount = 0
foreach cur in offledger CreateSelection("offledger",

"kind=`CUR`")

let url = url + BaseCurrency + cur.Name + "=X+"
let currencyCount = currencyCount + 1

endfor
if currencyCount = 0

return

endif

SetFieldValue (windowRef, fieldNumOrName, stringValue)

Attempts to set the user interface field to the given value. Further validation
may be invoked. The actual value set in the field is returned by the function.
Works with check boxes and popups as well.

For editable text fields, this will set the content of the field to stringValue.

For popup menu controls, it will select the item matching stringValue. You can
include an @ wildcard at the end of a partial item name.

let url = url + "&f=sl1d1t1ba&e=.csv"

Setting a button's value to "1" is equivalent to clicking the button.

let rates = ""
Calculations and things

Script-only Functions

For buttons, checkboxes, and radio buttons, you must only set a value of "1" or
"0". Any other value will set the title of the control.

Availability: within an MWScript handler

SetFieldVisibility (windowRef, itemID, visible)

Definition: Sets the visibility of an item in a custom window. the item must be a
custom control. You cannot control the visibility of standard MoneyWorks
UI controls.

Availability: available within MWScript handlers.

See Also:

SetFieldEnabling: Enable or disable a custom control

SetListContents (listHandle, data)

Definition: Sets the current contents of a list (previously instantiated with

InsertListObject or InsertEditListObject). Data should be tab and newline-
delimited text.

If you don't otherwise hane the list handle, you can use
GetListHandle(windowHandle, listID)

Availability: available within MWScript handlers.

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListContents: Get a tab-delimited string with the contents of a simple list
GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident

GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
InsertListObject: Initialise selectable list object in a window
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SetListSelect: Highlight a row in a list
SetOptionsForEditList: Set options for the list
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

SetListField (listRef, rowNum, columnNumOrName, value)

Attempts to set the text of a cell in an editable list (such as the transaction detail
list). Additional validation may cause your text to be rejected. You can get a
listRef using the GetListHandle function, or it will be passed to you as a
parameter to certain handlers, such as ValidateCell.

RowNum is zero-based. To reduce fragility of scripts over software versions,
avoid using column numbers. Use column names. Normal validation will be
applied to whatever value you set, just as if the user had typed it.

Availability: within an MWScript handler

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
Calculations and things

Script-only Functions

MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

SetListSelect (listHandle, zeroBasedRowNum,
bClearOldSel)

Definition: Highlights the indicated row in a list. if the bClearOldSel is false,

then any existing highlight is kept.

Availability: available within MWScript handlers in v9 and later.

See Also:

GetListContents: Get a tab-delimited string with the contents of a simple list
InsertListObject: Initialise selectable list object in a window
SetOptionsForEditList: Set options for the list

SetProgressMessage (message)

Sets a progress message that will show in the indeterminate progress dialog ifit
happens to show while executing the handler that the function is called from
(including in any handlers/functions that that handler calls). Otherwise the
message is the default "A script is running...".

When the handler exits, the default progress message is restored.

If the progress window is already visible when this function is called, the
progress message is changed to the new message.

Use to indicate to the user what is happening during a time-consuming script
process.

Availability: within an MWScript handler in v9 and later

SetStocktakeForLocation (productCode, count [, location] [,
batchNum])

SetOptionsForEditList (listHandle, optionsArray)

Return Type: Boolean; true on success; false on error

Definition: Sets options for an edit list (either custom or standard). You can use
this to e.g. prevent additions/deletions or sorting of the transaction details
list (say for a partially processed order where the user should not change
the order). Pass an array of boolean values with key values from
"allowSorting", "allowAdditions", "allowDeletions". You do not need to
supply all values. Only the supplied option values will be changed.

Example:

SetOptionForEditList(listhandle, createArray("allowSorting",

false, "allowAdditions", false, "allowDeletions", false))

Availability: available within MWScript handlers in v9.1.7 and later.

See Also:

GetListContents: Get a tab-delimited string with the contents of a simple list
InsertListObject: Initialise selectable list object in a window
SetListSelect: Highlight a row in a list

Definition: Updates the stocktake count for a product at a given location, and/

or for a batch number.

A stocktake must be in progress. Normally you can use the Replace command or
ReplaceField function to set a stocktake count for a product when multi-location
inventory and batch numbered inventory is not in use. When they are, the stock
for a location or batch is stored in a separate table from the product table, and
new records may need to be created in that table. This function does that for
you. The function can be used to implement a scripted import of stocktake data.
It can be used for stock that does not have multiple locations or batches as well.
The 3rd and 4th parameters are optional. When no location is supplied, the
Default location is assumed.

It is an error to pass a non-existent or non-inventoried product; to call when a
stocktake is not active; or for the batchNum parameter to be inconsistent with
the batch-tracking status of the product.

Availability: within an MWScript handler in MoneyWorks Gold 8.1.8 and later
Calculations and things

See Also:

StocktakeNewQtyForLocation: Get the current stocktake quantity for a

product for a given location

StocktakeStartQtyForLocation: Get the stocktake starting snapshot quantity

for a product for a given location

SetWindowProperty (windowRef, propertyName, value)

Result Type: none

Definition: Store property data for a window handle for later retrieval by
GetWindowProperty. This effectively provides per-object storage for
windows. This is particularly useful for scripts that deal with multiple
instances of the same class of window (like Transaction windows). The
property data is automatically released when the window closes.

Example:

on Before:My_Window(w)

SetWindowProperty(w, "my_wind_fields",

ReadCurrentRecordForWindow(w))
end

on After:My_Window(w)

let a = GetWindowProperty(w, "my_wind_fields")
// .. set values in a
WriteCurrentRecordForWindow(w, a)

end

Availability: within an MWScript handler in MoneyWorks Gold 8.1.8 and later

See Also:

GetWindowProperty: Retrieve data previously stored for a windowHandle
ReadCurrentRecordForWindow: Load a record in custom UI, or tagged fields

in standard UI

WriteCurrentRecordForWindow: Save a record in custom UI, or save tagged

fields in standard UI

SetPersistent (table, key1, key2, array)

Definition: Updates a record with values from an associative array using the key

values as for GetPersistent().
Script-only Functions

Here is an example of using a mutex and persistent storage to execute
something at most once a week by only one user without risk of a race
condition whereby two users might look at the user2 persistent storage record
at the same time:

on Load

if GetMutex("rate_update")

let values = GetPersistent("user2", kMyDevKey,

"last_update")

if values["date1"] < Today() - 7

GetRates() // do weekly thing
let values["date1"] = Today()
SetPersistent("user2", kMyDevKey, "last_update", values)

endif
ReleaseMutex("rate_update")

endif

end

See the table below for tables and fields supported by GetPersistent and
SetPersistent.

table
user

user2

lists

key1
7 character key of your
choosing
32 bit numeric
developer key. You may
use any value from
#80000000-#8FFFFFFF
for internal projects. For
projects that you wish to
distribute to others,
please contact Cognito
for a key range that you
can use exclusively.
15 char listID(may or
may not be a listID
known to the Validation
Lists list)

offledger must be "USR" (you can

Get the "CUR" (currency)
records if you wish, but
you may not Set them)

key2
none

fields
data

27
character
key of
your
choosing

15
character
list item

15
character
name

int1, int2, float1, float2,
date1, date2, text1, text2,
text

comment

description,
balance91..balance00,
budget29..budget00,
budgetnext01..budgetnext18



Calculations and things

Script-only Functions

In MoneyWorks 7.1 and later, the fourth parameter may be omitted: this will
cause the record identified by the key(s) to be deleted. In this case the return
value is a boolean indicating success or failure. If the key parameters contain
wildcards, then allmatching records will be deleted.

on Load

SetSidebarColour(#ff0000)

end

Availability: available within MWScript handlers.

Availability: MWScript

SetTaggedValue (taggedTextString, tag, value)

SetReportColumnWidth (ColName, points)

Result type: text

Definition: Sets the width of the named report column to the number of points
specified. This function can only be used from an MWScript SetupReport
handler.

Example:

on SetupReport

Definition: Returns a new tagged text string containing the given tag and value
inserted into the provided taggedTextString. The tag must begin with an
underscore. If the tag already exists in taggedTextString, the value is
replaced. If the value is an empty string, the tag is removed.

Example:

SetReportColumnWidth("TAXCOL", if(Val("Show_Tax"), 80, 0))

end

let taggedText = SetTaggedValue("", "_colour", "Bronze")
let taggedText = SetTaggedValue(taggedText, "_size", "Small")

If the Show_Tax report control is true, the width of column TAXCOL is set to 80
points, otherwise it is set to zero (i.e. it is hidden).

Sets taggedText to "_colour: Bronze; _size: Small; ".

Availability: Only within a SetupReport handler

SetSidebarColour (colour)

Result Type: none

Definition: Sets the sidebar colour (for all windows that have them), to a
desaturated version of the supplied colour. The colour can either be a
number in the range 0..7 in which case it is regarded as one of the standard
MoneyWorks colours (0 = the default sidebar colour, 1 = orange, 2 = red, 3 =
magenta, 4 = cyan, 5 = blue, 6 = green, 7 = brown). If the colour is a number
greater than 7 it is assumed to be a 24-bit rgb value. The highlight colour in
the sidebar will be the actual colour value supplied.

Rationale: To customise the sidebar colour on a document-by-document basis

(to make it easier to discern which of several companies you are working
in). Just add a simple 3 line script to each document, using a unique colour.

Example:
Rationale: The TaggedText field is normally used with

ReadCurentRecordForWindow and WriteCurrentRecordForWindow, but you
may need to set values programmatically using ReplaceField.

Availability: available within MWScript handlers in MoneyWorks Gold 8.1.4 and

later.

See Also:

GetTaggedValue: Extract a value from a tagged value field

SortListByColumn (listRef, colNumOrName [, direction])

Definition: Sorts the editable list as if the user had clicked in the column

heading. colNumOrName may be the column name, or a zero-based column
number.

The default sort direction will be ascending, but you can pass an optional third
parameter of SortDescending for a descending sort.



Calculations and things

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

SplitOrderLine (windowRef, lineNum, qty)

Splits the transaction detail line into two, setting the first line's stockQty to qty
and the second line's stockQty to the original qty minus the specified qty.

For an order, the orderQty is similarly split (qty must be <= orderQty).

If the line has a prevShipQty, splits that so that prevShipQty <= orderQty for
both lines.

You can use this to help automate the assignment of serial numbers in an order.

Availability: available within MWScript handlers.

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list

Script-only Functions

ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

Sqlite3_Open (databaseName)

Result Type: sqlite connection handle

Definition: Opens a connection to a new pr existing sqlite3 database. This will

be completely separate form the MoneyWorks database, but you can use it
to access or store any information your script needs to.

You can: create and use temporary in-memory sqlite databases in MWScript for
data analysis and tabulation (as a more powerful alternative to TableAccumulate
etc); create and/or open local sqlite databases from MWScript on a
MoneyWorks client for storing client-local data, or for importing data from a
sqlite.db; create and use shared sqlite databases that reside on a MoneyWorks
Datacentre server and access the data from all MoneyWorks clients. This allows
MWScript to be used to create bespoke databases and user interfaces for them
within MoneyWorks

Using Sqlite3_Open("filename.db") will open an existing—or create a
new—database file in the Automation Files/Sqlitedirectory of the MoneyWorks
client. Using Sqlite3_Open("/full/path/to/filename.db") will open an
existing—or create a new—database file on the local client, provided that the
path is allowed by the safe scripting paths in the app preferences. You can call
Sqlite3_Open on the same file more than once to get additional connections to
the database file (this might happen if different scripts access the same
database for example). You need to close each handle thus allocated when you
Calculations and things

are finished with it.

Using Sqlite3_Open("shared:filename.db") or Sqlite3_Open("shared-
public:filename.db") will open an existing—or create a new—database file in
the MoneyWorks Custom Plugins/Sqlitedirectory on the MoneyWorks
Datacentre Server (or, if you are not connected to a server, in the MoneyWorks
Custom Plugins/Sqlitedirectory for the MoneyWorks file you have open (this
mode will fail if running a MWScript outside of a MoneyWorks document). All
MoneyWorks files that share the custom plugins folder can access the same .db
file. Using Sqlite3_Open("shared-private:filename.db") will open an
existing—or create a new—database file in the MoneyWorks Custom Plugins/
Pictures/company-name/Sqlitedirectory on the MoneyWorks Datacentre Server
(or, if you are not connected to a server, in the MoneyWorks Custom Plugins/
Pictures/company-name/Sqlitedirectory for the MoneyWorks file you have
open. Only that company file will have access to such .db files. Note that in this
case the sqlite .db will be backed up with the Pictures folder (may be a separate
backup depending on server prefs).

For more information see Using Sqlite3 with MoneyWorks and
https://www.sqlite.org/

Sqlite3_Close (sqlite3_handle)

Result Type: none

Definition: Closes a connection to a sqlite3 database. You should close sqlite3

handles when you are finished with them.

The Sqlite3_Exec function allows parameter binding, binding the values passed
in as additional parameters into the query wherever it contains a ?. This
removes the need to deal with escaping special characters in the data to avoid
accidental SQL injection from user-supplied data.

Script-only Functions

Example

on Load

let s = sqlite3_open("") // temporary in-memory  DB
let r = sqlite3_exec(s, "CREATE TABLE cars ( make TEXT, model

TEXT, colour TEXT, registration TEXT, mileage REAL);")

let sql = "INSERT INTO cars VALUES ( 'Subaru', 'Outback',

'Gold', 'XYZ999', 36000);

INSERT INTO cars VALUES ( 'Toyota', 'Corolla',

'White', 'ABC123', 46899);

INSERT INTO cars VALUES ( 'BYD', 'Shark', 'Grey',

'ZZZ000', 1);"

let r = sqlite3_exec(s, sql)
let r = sqlite3_exec(s, "SELECT * FROM cars ORDER BY mileage

DESC;")

syslog(r)
sqlite3_close(s)

end

Output format

By default, the output format is the same as the Sqlite default format: tab
separated column values and newline terminated rows. You can modify the
output format mode using a query consisting of a .separator directive in the
form .separator colsep opt_rowsep. Either separator may be enclosed in
single quotes.

For more information see Using Sqlite3 with MoneyWorks and
https://www.sqlite.org/

Example

Sqlite3_Exec (sqlite3_handle, query, [bindArgs...])

Result Type: text

Sqlite3_Exec(s, ".separator | ''") — set the column separator to |
and the row separator to nothing

For more information see Using Sqlite3 with MoneyWorks and
https://www.sqlite.org/

Definition: Executes a SQL query on the database. Any SQL supported by Sqlite3
may be used (CREATE TABLE, SELECT, INSERT, UPDATE, PRAGMA, etc). A
SELECT query will return the entire result of the query as delimited tabular
text.

SyncTransactionImage (seqnum)

Return type: Boolean
Calculations and things

Script-only Functions

Definition: Checks to see if there is an image for the transaction with the given
sequence number in the Pictures/Transactions folder of the Custom Plugins
folder (i.e. the storage location for all attached images). If there is an image
named <em>seqnum.ext</em> (where <em>ext</em> can be .jpg, .png,
.pdf) the the fHasScan bit of the transaction's flags field is set and the
return value is TRUE. If no image is found for the transaction, the flag is
reset and the return value is FALSE.

Will return an error if the transaction is currently locked for editing.

Use this function to sync the flag after you have manually added a transaction
image to the Pictures/Transactions directory.

See Also:

ImportImage: Import an image from a file

SysLog (text)

Return type: none

Definition: Creates a funds transfer payment between two bank accounts.
recAmountmust be supplied if the banks are different currencies. Each
amount is specified in that bank’s currency. The return value is the
sequence number of the payment transaction.

Availability: available within MWScript handlers in MoneyWorks 8.1.5 and later.

TryPutBackReference (transType, refnum [, bank])

Result Type: Boolean

Definition: If you have allocated a reference number with GetNextReference

and for some reason will not be using it, you can use this function to try to
put it back for subsequent allocation. If the reference number sequence has
moved on, this operation may fail (and return false) or the reference
number may be queued locally for possible use by the same logged-in
client. Otherwise it may be discarded and never used.

See Also:

GetNextReference: Allocate a reference number for a transaction type (or

Definition: Writes the text to the log file (preceded by a date/time stamp).

job code).

Useful for debugging scripts. Note that MoneyWorks also sometimes writes
things (error messages, typically) to the log file. On Mac, log file output is
also copied to the system.log.

UpdateOrderLines (orderSeq, prod_qty_array [,
linktoInvSeq])

You can easily show the log file by clicking the Log File icon in the Script Editor
toolbar.

Return type: a status code, and the array is modified

The parameter passed to syslog will be type-converted to text. You can even
pass an associative array to log all elements of the array.

See Also:

TypeOf: Get the type enumeration of a value or variable
_NTDump: Get a textual dump of identifiers and values from the

MoneyWorks nametable

TransferFunds (fromBank, toBank, date, period, ref,
analysis, description, amount [, recAmount])

Return type: number
Definition: Use this function to programmatically process an order for which

you have imported or otherwise created a corresponding invoice, or to just
update intended ship quantities (this latter use would only be for Sales
Orders where you want to programmatically allocate new stock to
backorders).

Identify the order to be updated by specifying its sequence number in
orderSeq.

Pass an associative array of quantities, where the array keys are product
codes.



Calculations and things

Script-only Functions

Optionally pass the sequence number of a posted invoice that SHOULD
correspond to the products/quantities being updated (however, agreement
with the invoice is not enforced).

Definition: Script execution pauses for the specified period (up to 10,000

milliseconds). If the pause is long enough (or if you call WaitMilliseconds
multiple times) the script will put up an indeterminate progress dialog.

If you pass an invoice sequence number, the order lines will have the
specified quantities transferred from backordered to previously shipped. In
the event that all lines on the order are completed, the order will be
marked as complete. The invoice will be updated to link back to the order
(via the originatingOrderSeq field). See also special cases below.

If no invoice sequence is specified, the function will just update the Ship Qty
column, and the order can then be processed manually.

The prod_qty_array quantities will be adjusted downward by the quantity
"used" by the order. If the quantity specified is greater than the backorder
quantity for the product on the order, the remaining quantity will be left in
the array. Otherwise the used element will be deleted from the array when
its quantity is fully "used". Array elements whose key does not match an
ordered product on the order will be ignored. Thus on exit, the array will
contain unprocessed products/quantities. This means in the simple case (no
invoice sequence) you could pass the same array of newly received stock
quantities to subsequent invocations for a series of orders, and the stock
will be allocated in the order the orders are processed, until it is depleted.

Special cases for linktoInvSeq:

• If the order is completed (i.e. there remain no backordered items), and the
linktoInvSeq is specified as -1, the order will be marked as completed (so
will appear in the Bought/Sold list).

• Set the linktoInvSeq to -2 to force the order to be completed.

The function will return 0 on successful completion. If there is an error, a
non-zero status will be returned. Further information on the error can be
obtained from GetLastErrorMessage().

Availability: available within MWScript handlers in MoneyWorks 9 and later

WaitMilliseconds (ms)

Return type: none

Useful for an unattended or external script that might need to retry an
operation after a delay.

Availability: available within MWScript handlers in MoneyWorks 9.0.4 and later

WebViewControl (window, item, commandString)

Sets options on a custom web view control in a window. commandString is a
string consisting of a command followed by parameters in the form
name='value'. Currently the only command is options and the available
options are openLinksInExternalBrowser and wantCallbacks which take a
value of 'true' or 'false' (all case-sensitive).

Also, on Mac allowBackForward, and on Windows with v9.0.3 and later:
reportErrors.

Examples:

WebViewControl(w, "L_WEB", "options

openLinksInExternalBrowser='true'")

WebViewControl(w, "L_WEB", "options

openLinksInExternalBrowser='false'")

WebViewControl(w, "L_WEB", "options wantURLCallback='true'")

WebViewControl(w, "L_WEB", "options wantURLCallback='false'")

WebViewControl(w, "L_WEB", "options allowBackForward='true'") // Mac

WebViewControl(w, "L_WEB", "options allowBackForward='false'")

WebViewControl(w, "L_WEB", "options reportErrors='true'") // Win

WebViewControl(w, "L_WEB", "options reportErrors='false'")
Calculations and things

Script-only Functions

The openLinksInExternalBrowser setting determines whether opening a link will
open it in the webview control itself or in an external browser. Note that on
Windows, this also controls whether iframes open inline or externally. If you are
displaying a web page that contains iframes on Windows, you will need to set
the option to false at least until the page has been loaded. You may then set the
option to true. Even better, avoid content with iframes on Windows.

Availability: available within MWScript handlers in MoneyWorks 8 and later.

The wantURLCallback option requires v8.1

See Also:

LoadHTMLInWebView: Load HTML into a custom web view control
LoadURLInWebView: Load a URL into a custom web view control

WriteCurrentRecordForWindow (windowRef, fieldArray)

Availability: available within MWScript handlers.

See Also:

GetWindowProperty: Retrieve data previously stored for a windowHandle
ReadCurrentRecordForWindow: Load a record in custom UI, or tagged fields

in standard UI

SetWindowProperty: Store data related to a window

WriteToTempFile (text [, filename])

Result type: string (a filesystem path)

Definition: Creates a new text file in the temp directory and writes the given

text to it. Return value is the path to the temp file (filename is automatically
generated).

Result type: none

Availability: MWScript scripts in MoneyWorks Gold v7.1.5 and later

Definition: This function is normally used in the After handler of a custom
record editing window, operating on User, User2, OffLedger or Lists. The
window will have been instantiated automatically via the second parameter
of CreateListWindow in response to a New or Modify command.

The function writes the current record in the selection associated with the
window (or creates a new record, as appropriate). FieldArray is an associative
array containing the value of every field in the record (the keys of the array are
the field names). Usually, you will pass back a modified version of the array you
got from ReadCurrentRecordForWindow.

Call this function from the After handler of your record editing window to save
changes to the data.

Updating UserNum and UserText and tagged fields on other tables

An alternative use of this function is in a Validate (or ItemHit) handler for a
standard entry window. In this case the only fields to be updated will be
UserNum and UserText. You must call the function before MoneyWorks writes
the record (the After handler would be too late in this case). Calling this function
will mark the window as changed and force MoneyWorks to save the record in
the standard After phase. (Note, however, that the Validate handler will only be
called if the user changed a value in the window).

In MoneyWorks 9 and later, you may supply an optional second parameter to
specify the name to use. If you do this, the file will be written in the
MoneyWorks Automation folder (or the first available safe location specified in
the app preferences) instead of the system temp directory. Additionally, you can
prefix the specified name with "TMP/" or "CACHE/" to put the file in the temp
directory with the given name, or in the cache directory.

Note: On macOS Catalina and later, files written to the system temp directory
may not be accessible by other processes, so the cache directory is
recommended if you are passing the path to another process for further action.

See Also:

AddSafePath: UI to add a safe path to the preferences
BaseName: Filename from a path
CreateFolder: Create a new folder
File_Close: File functions for creating/reading/writing text files
File_GetLength: File length in bytes
File_GetMark: Get current read/write position
File_Move: Rename/move a file
File_Open: Open a file
File_Path: Get the full path of an open file
File_Read: Read text from current position
Calculations and things

File_ReadLine: Read to end of line from current position
File_SetMark: Set Current read/write position
File_Write: Write text at current position

XML_Free (expatParserHandle)

Result type: none

Definition: Frees an Expat parser object that was created with

XML_ParserCreate

Availability: MWScript scripts in MoneyWorks Gold v8.1 and later

Suite: This function is part of the Expat XML parsing suite of functions.

See Also:

XML_Parse: Parse an XML string using an Expat parser
XML_ParserCreate: Create an Expat parser for parsing XML
XML_SetCharacterDataHandler: Set a character data Handler (callback) for

an Expat parser

Script-only Functions

Availability: MWScript scripts in MoneyWorks Gold v8.1 and later

Suite: This function is part of the Expat XML parsing suite of functions.

See Also:

XML_Free: Release an Expat parser
XML_ParserCreate: Create an Expat parser for parsing XML
XML_SetCharacterDataHandler: Set a character data Handler (callback) for

an Expat parser

XML_SetElementHandler: Set an element Handler (callback) for an Expat

parser

XML_ParserCreate ()

Result type: An Expat parser handle.

Definition: Creates a new Expat parser object

Availability: MWScript scripts in MoneyWorks Gold v8.1 and later

XML_SetElementHandler: Set an element Handler (callback) for an Expat

Suite: This function is part of the Expat XML parsing suite of functions.

parser

XML_Parse (expatParserHandle, xmlText, boolIsFinal)

Result type: number (0 on error)

Definition: Parses the XML in the string ``xmlText`. The Expat parser is a non-
validating, 'event-based' parser. Event-based means it focuses on xml
content, not on structure. XML data is analysed as a series of elements, and
as each element is encountered, your startElement and endElement
handlers will be called. You specify the names of your handlers using the
XML_SetElementHandler and XML_SetCharacterDataHandler functions.
Your charData handler will be called with any character data contained
within element start and end Tags.

See Also:

XML_Free: Release an Expat parser
XML_Parse: Parse an XML string using an Expat parser
XML_SetCharacterDataHandler: Set a character data Handler (callback) for

an Expat parser

XML_SetElementHandler: Set an element Handler (callback) for an Expat

parser

XML_SetElementHandler (expatParserHandle,
startHandlerName, endHandlerName)

Definition: Specify handlers to be called when the parser encounters start and

end tags for elements.

You may call XML_Parse multiple times with segments of the XML that you wish
to parse. If supplying the complete XML text ir when calling with the final
segment of XML, pass true for the boolIsFinal parameter, otherwise pass false if
there will be more XML data to come.

Your start handler should be written as on MyStartHandler(tagName, attrs).
tagName will be the element name and attrs will be an associative array
containing any attributes for the element. You end handler should be decalred
as on MyEndHandler(tagName).
Calculations and things

Create an expatParserHandle using XML_ParserCreate.

XMLFree (libXMLDocOrXpathNodeHandle)

Script-only Functions

Availability: MWScript scripts in MoneyWorks Gold v8.1 and later

Result type: none

Suite: This function is part of the Expat XML parsing suite of functions.

See Also:

XML_Free: Release an Expat parser
XML_Parse: Parse an XML string using an Expat parser
XML_ParserCreate: Create an Expat parser for parsing XML
XML_SetCharacterDataHandler: Set a character data Handler (callback) for

an Expat parser

XML_SetCharacterDataHandler (expatParserHandle,
handlerName)

Definition: Specify a handler to be called when the parser encounters character

data in the XML.

Your character data handler should be written as on MyCharHandler(data). You
would normally just append the data string to a string property that you clear in
the start element handler and use in the end element handler. The character
data handler may be called multiple times with partial character data for a single
element.

Create an expatParserHandle using XML_ParserCreate.

Availability: MWScript scripts in MoneyWorks Gold v8.1 and later

Suite: This function is part of the Expat XML parsing suite of functions.

See Also:

XML_Free: Release an Expat parser
XML_Parse: Parse an XML string using an Expat parser
XML_ParserCreate: Create an Expat parser for parsing XML
XML_SetElementHandler: Set an element Handler (callback) for an Expat

parser

Definition: Frees an XML document that was created with XMLParseFile or

XMLParseString or an XPath node or nodeset handle that was returned by
XPathEval

Availability: MWScript scripts in MoneyWorks Gold v8.1.1 and later

Suite: This function is part of the LibXML/Xpath XML parsing suite of functions.

See Also:

XMLParseFile: Parse an XML file to an XML document
XMLParseString: Parse an XML string to an XML document
XPathEval: Extract a node or value from an XML document using XPath

notation.

XMLParseFile (path [, nsList])

Result type: An XML document handle

Definition: Parses the XML file. Call this once to parse an entire XML file which
you may then navigate using XPathEval. When finished with the document,
free it with XMLFree.

If the XML document uses namespaces, evaluating XPaths on it will require
the namespaces to be registered. You can provide the namespaces in a
space separated list in a string with entries in the form ns=uri (e.g.
"svg=http://www.w3.org/2000/svg dc=http://purl.org/dc/elements/
1.1/").

Availability: MWScript scripts in MoneyWorks Gold v8.1.1 and later

Suite: This function is part of the LibXML/Xpath XML parsing suite of functions.

See Also:

XMLFree: Free an XML document
XMLParseString: Parse an XML string to an XML document
Calculations and things

Script-only Functions

XPathEval: Extract a node or value from an XML document using XPath

notation.

XMLParseString (xmlstring [, nsList])

Result type: An XML document handle

Definition: Parses the XML in xmlstring. Call this once to parse an entire block

of XML which you may then navigate using XPathEval. When finished with
the document, free it with XMLFree.

If the XML document uses namespaces, evaluating XPaths on it will require
the namespaces to be registered. You can provide the namespaces in a
space separated list in a string with entries in the form ns=uri (e.g.
"svg=http://www.w3.org/2000/svg dc=http://purl.org/dc/elements/
1.1/").

If the XPath expression identifies an element or set of elements, then the
function result wil be a node handle that you can use with subsequent calls
to XPathEval.

If the XPath expression explicitly requests a string or number (or boolean)
result (e.g. using string(...), number(...) or .text()) then the return
value will be a string or a number.

If the Xpath node handle you provide is actually a set of nodes, you should
provide an index parameter to indicate which node in the set you want to
be the anchor for the relative XPath. Otherwise the first node will be
assumed. The index is 1-based.

As a special case you can use XPathEval(nodeSetHdl, "count") to get the
number of nodes in a nodeset.

Example:

Availability: MWScript scripts in MoneyWorks Gold v8.1.1 and later

Getting indexed elements using the XPath [] notation.

Suite: This function is part of the LibXML/Xpath XML parsing suite of functions.

See Also:

XMLFree: Free an XML document
XMLParseFile: Parse an XML file to an XML document
XPathEval: Extract a node or value from an XML document using XPath

notation.

XPathEval (XMLDocumentHandleOrXpathNodeHandle,
XpathString [, index])

let doc = XmlParseFile("transactions.xml")    // filename only

= use safe path (MoneyWorks Automation folder)

let numTrans = XPathEval(doc, "count(/table/transaction)") //

count nodes using XPath

foreach i in (1, numTrans)

let t = XPathEval(doc, "/table/transaction["+i+"]") //

return a singleton nodeset handle

syslog(XPathEval(t, "string(./ourref)"))
syslog(XPathEval(t, "string(./description)"))
syslog(XPathEval(t, "number(./gross)"))
XmlFree(t)

endfor
XmlFree(doc)

Result type: An XPath node handle, or a string, or a number — depending on

the XPath expression

Getting indexed elements from a nodeset using an index parameter to
XPathEval

Definition: Evaluates an XPath in the context of an XML document that has

been parsed with XMLParseFile or XMLParseString or relative to a node in
that document that has been found with a previous call to XPathEval. When
evaluating against the document, use an XPath anchored at the root node
/. When evaluating against a previously found node, use an XPath anchored
at the "current node" ./.

let doc = XmlParseFile("transactions.xml")    // filename only

= use safe path (MoneyWorks Automation folder)

let transSet = XPathEval(doc, "//table/transaction") // returns

a nodeset with multiple elements

let numTrans = XPathEval(transSet, "count") // special case to

get nodeset count

foreach i in (1, numTrans)

syslog(XPathEval(transSet, "string(./ourref)", i))
syslog(XPathEval(transSet, "string(./description)", i))
Calculations and things

Script-only Functions

syslog(XPathEval(transSet, "number(./gross)", i))

"transaction"))

endfor
XmlFree(doc)

Availability: MWScript scripts in MoneyWorks Gold v8.1.1 and later

Suite: This function is part of the LibXML/Xpath XML parsing suite of functions.

See Also:

XMLFree: Free an XML document
XMLParseFile: Parse an XML file to an XML document
XMLParseString: Parse an XML string to an XML document

CreateXMLDoc ()

Result type: An XML document handle

Definition: Creates an XML document that you can use to generate XML. Use
this API to help ensure that the XML you generate is properly entity-
encoded and cleanly formatted.

See Also:

AddXMLElement: Write an element to an XML document handle
BeginXMLElement: Write an opening tag to an XML document handle
EndXMLElement: Write a closing tag to an XML document
FinaliseXMLDoc: Get the finished XML as a string

BeginXMLElement (xml_hndl, element_name [,
attributesArray])

Result type: none

Definition: Emit an opening element tag, optionally with attributes.

Example:

let xml = CreateXMLDoc() // currently no output path, get as

string via FinaliseXMLDoc

BeginXMLElement(xml, "import", CreateArray("table",
BeginXMLElement(xml, "transaction")
AddXMLElement(xml, "ourref", "12345")
AddXMLElement(xml, "transdate", Today())
AddXMLElement(xml, "lastmodifiedtime", Time())
AddXMLElement(xml, "gross", 12345.67,
CreateArray("arbitrary_attribute", "decimal"))

AddXMLElement(xml, "description", "Something with < & > in it

and also some ctrl characters\n\n\tand formatting.")

AddXMLElement(xml, "description", "Something with < & > in it

and also some ctrl characters\n\n\tand formatting.", NULL, true) //
encapsulate as CDATA

EndXMLElement(xml, "transaction")
EndXMLElement(xml, "import")
let t = FinaliseXMLDoc(xml)

xmltext is formatted thus:

<?xml version="1.0"?>
<import table="transaction">

<transaction>

<ourref>12345</ourref>
<transdate>20250131</transdate>
<lastmodifiedtime>20200925145334</lastmodifiedtime>
<gross arbitrary_attribute="decimal">12345.67</gross>
<description>Something with &lt; &amp; &gt; in it and also

some ctrl characters&#10;&#10;&#9;and formatting.</description>

<description><![CDATA[Something with < & > in it and also

some ctrl characters

and formatting.]]></description>
</transaction>

</import>

Note that numbers are formatted in POSIX format (decimal point and no
thousands separators), and times and dates are big-endian.

See Also:

AddXMLElement: Write an element to an XML document handle
CreateXMLDoc: Create an XML document handle
EndXMLElement: Write a closing tag to an XML document
FinaliseXMLDoc: Get the finished XML as a string



Script-only Functions

1 PlatformDocumentPath returns an empty string if document is not local↩

2 Note that a Cheque/Remittance form can only be used with a Payment
transaction if the form is printed from the open transaction window (i.e. one
payment at a time).↩

3 If you don't send the selection to Datacentre, the report will need to run on your
machine, which will be significantly slower because of the large number of network
requests it will probably need to make.↩

See Also:

AddXMLElement: Write an element to an XML document handle
BeginXMLElement: Write an opening tag to an XML document handle
CreateXMLDoc: Create an XML document handle
EndXMLElement: Write a closing tag to an XML document

Calculations and things

AddXMLElement (xml_hndl, element_name, value [,
attributesArray] [,boolCDATA])

Result type: none

Definition: Emit a complete XML element, with opening tag (with optional

attributes, entity-encoded value, and closing tag. If the value is empty then
this emits a self-closing tag. If you pass true for the 5th parameter, the value
will be enclosed in CDATA delimiters. Value can be text, a number, or a date
or time. Dates and times are formatted big-endian (as required by
MoneyWorks when it imports data in XML format).

See Also:

BeginXMLElement: Write an opening tag to an XML document handle
CreateXMLDoc: Create an XML document handle
EndXMLElement: Write a closing tag to an XML document
FinaliseXMLDoc: Get the finished XML as a string

EndXMLElement (xml_hndl, element_name)

Result type: none

Definition: Emit a closing tag. It is up to you to match closing tags to opening

tags.

See Also:

AddXMLElement: Write an element to an XML document handle
BeginXMLElement: Write an opening tag to an XML document handle
CreateXMLDoc: Create an XML document handle
FinaliseXMLDoc: Get the finished XML as a string

FinaliseXMLDoc (xml_hndl)

Result type: string

Definition: Returns the complete XML document as a string, and disposes the

document handle.
