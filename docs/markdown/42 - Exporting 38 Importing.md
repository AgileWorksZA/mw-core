# Exporting &#38; Importing

Exporting & Importing

report explicitly signed to them.

To increase performance on Datacentre

Exporting & Importing

Analysis reports that are run over a network can be slow, so in general it is
better to run them on the Datacentre server. To do this:

1. Turn on the Run on server if possibleoption

The report will be uploaded to the server for running, along with the
selection it is based on. Note that reports that have the Ask for Search Code
option on cannot run on the server.

Transferring data electronically from MoneyWorks for use in other applications
(such as spreadsheets or word processors) is called exporting. Bringing
electronic data into MoneyWorks is called importing.

MoneyWorks has extensive exporting and importing capabilities to allow you to
transfer data to and from other applications. Information can be transferred
either through the clipboard (using the Copy and Paste commands), through
files (using the Import and Export commands), or directly to other applications
using AppleEvents on the Mac or COM on Windows.

Setting the Help Text

Exporting

The help text is displayed whenever the report is selected in the Index to
Reports. If you are going to save the report for later use, it is good idea to
include a brief description of the report and any requirements it may have.

To set the help text click the Set Help...button. For further details see Setting
the Help Text.

1 The transaction file itself can be the source file. In this case the analysis will be
done on all highlighted transactions or, if there are none in the found set or if the
transaction window is not open, all transactions.↩

There are several ways of exporting
information from MoneyWorks. Virtually
any report or list that you print can be
exported to either an html or text file by
setting the output to an HTML or Text file. In
addition, the individual records themselves
(transactions, accounts and so forth) can be
exported by use of the Export Selectioncommand in the File menu (or by
clicking the Export Toolbar button)—The resultant file will be a tab delimited
text file which can be opened by most mainstream applications1.

The Export Toolbar
button - Windows

The Export Toolbar
button - Mac

You can also use the Copy command in the Edit menu to copy the highlighted
records in the list. They can then be pasted into another application.

Exporting When Printing

Whenever you are printing, whether it is a report from the Reports menu or just
one of the lists on the screen, the Print Settings dialog box will be displayed. Set
the Output to pop-up to HTML Fileor Text Fileas shown below. You can also
export directly to Excel, Word or the clipboard.
Exporting & Importing

Exporting

Clicking the Save As...button will display the standard File Creation dialog box,
where you name the file and choose its type (tab delimited or html).

Exporting Transactions

Transactions can be exported for use in another application or for importing into
another MoneyWorks document. A copy of the transactions are exported—the
original are not affected.

To export transactions:

1. Highlight the transactions to export in the Transactions list

2. Choose File>Export Selection...

The Export Transactions settings window is displayed.

3. Choose the format for the export

Separate record for each detail line Use this if you want to use the transactions
for analysis based on account code or some other value associated with the
detail lines of the transactions. This tells MoneyWorks to output each detail

line as a separate record. Transactions are exported with one record for
each detail line in each transaction. Data from the transaction itself (that is
not part of a detail line) is repeated in the export file for each detail line.
The first line of text contains the field names, separated by tabs.

Omit System Lines: If you do not want to exclude the system lines automatically
added to every transaction by MoneyWorks, set the Omit System Lines
option. System lines are added to handle GST, contra (bank, accounts
receivable/payable), multi-currency and inventory.

Detail lines as repeating fields Use this to export each transaction as a single

record, with the detail lines in a repeating field format compatible with the
MoneyWorks Import Transactions facility (also compatible with FileMaker
Pro repeating fields). The data is exported as tab delimited text, with the
repeating detail line fields are separated by ASCII 29. The first line of text
contains the field names, separated by tabs. Detail lines are exported as two
distinct sets of fields (denoted in the table by the prefixes u and s). The
detail lines whose field names are prefixed by u are user-entered detail lines
that are visible in the transaction entry window. Detail lines designated by s
are system detail lines that are added by MoneyWorks to balance the
transaction. In the case of cash transactions, the system detail lines affect
the bank and the appropriate GST control accounts. For invoices, the system
line affects the appropriate accounts receivable or accounts payable
account.

4. Click Continue

The standard Save File dialog box appears.

5. Name the export file and click OK

The highlighted records will be exported in the specified format.

Exporting from Other Lists

Names, Products, Jobs etc can all be exported for use in another application or
for importing into another MoneyWorks document. This takes a copy of the
information and transfers it to a new file—the original records are not affected.

To export the information:
Exporting & Importing

1. Open the appropriate list window

2. Highlight the records to export in the list

3. Choose File>Export... or click the Export Toolbar button

The standard Save File dialog box appears.

4. Name the export file and click OK

The highlighted records will be exported. The first line of the export will contain
the field names.

Exporting Account Balances and Budgets

You can export accounts, balances and budgets from MoneyWorks.

1. Choose Show>Accounts

The Accounts list will be displayed.

2. Highlight the accounts you want to export and Choose File>Export

The Export Account Details dialog box appears.

Exporting

You can select what data for the accounts will be exported—the Account
Code is always exported (you cannot deselect this item), but you can select
what other account fields, balance or budget to export.

The data will be exported as a tab-separated text file—one row of data
corresponding to a single account (or sub-ledger for departmentalised
accounts). The first row will contain column headings.

Include Category and Department Names etc

Set this option if you are intending to re-import the accounts into another
MoneyWorks document. When set, MoneyWorks will include department and
category information in the export.

3. Uncheck the fields which you do not want to export

Click in the appropriate check box if you want to export budgets or
balances. Enter the number of periods (columns) of data to export and set
the pop-up menu to the first period to export.

4. Click the Export... button
Exporting & Importing

A Save File dialog box allows you to name the file.

Note: If you are exporting the accounts for import into a new MoneyWorks file,

it may be easier to use the Save a Clone asfeature.

Importing

Importing is done either by using the appropriate File>Import command, or by
pasting the data if it has been copied in a suitable format onto the clipboard.

You can import accounts, budgets, names, products, transactions and job
information. The information can be sourced from other applications such as a
word processors, spreadsheets, databases or even other accounting programs
(provided they have an export capability). It can be simple text (csv or tab
delimited), or xml.

MoneyWorks will always check the data being imported, and will discard any
information that has errors. For most imports you have the option of rejecting
the entire import file if any errors are found, or just the records that are in error
(which are written to a new file so they can be identified and corrected).

Importing the Chart of Accounts

You can import account information for your chart of accounts. This can be done
either by importing the data from a text file, or by using the Paste command in
the Edit menu if you have previously Copied the information onto the clipboard.

To import accounts:

1. Choose File>Import>Accounts, or Choose Edit>Paste if you are pasting the

data in from the clipboard

The Import Accounts window will be displayed.

Importing

This gives information on the structure of the file that can be imported. See
Importing Chart of Accountsfor details of this.

2.

If your file contains headings or other information in the first line, set the
First Line of Text File Contains Headingsoption

When this is set any information in the first line is ignored.

3.

If you are updating information in an existing account, set the Update if
account already exists option

If the account already exists in your system, it will be updated to reflect the
information being imported. Only some fields can be updated.

4. Click Continue

The Import Accounts window will close and be replaced by the standard file
open dialog box.

5. Highlight the file to import, and click Import

The import file checking window will be displayed.
Exporting & Importing

Importing the Chart of Accounts

If any errors are found in the file they will be listed here. You will need to
correct these and repeat the import procedure.

6. Click Importto import the accounts

The accounts will be imported and any necessary departments and
categories created.

If Closeis clicked no import is done.

Accounts File Format

The information required for importing is displayed in the table below. All items
of information about the account must be supplied. These fields must appear in
the order shown in the following table.

Field
Account
Code

Description
The code that identifies the account. If you wish MoneyWorks to
departmentalise the account as it is imported, the whole line should be
duplicated for each department, and the account codes should be suffixed by
a hyphen and the department code (e.g. = "1000-XYZ= "). Accounts with a
department code must have a department group code in the Department
Group field. If the account code already exists, the entire line is ignored unless
the Update if Account Already Exists option is set.

Description The name of the account
Type

The type code for the account. This must be one of:IN, SA, EX, CS, CA, CL, FA,
TL SF for Income, Sales, Expense, Cost of Sales, Current Asset, Current Liability,
Fixed Asset, Term Liability and Shareholders Funds respectively; or: BK, AR, AP,
GR, GP, PL for the system account types Bank Account, Accounts Receivable,
Accounts Payable, GST Received, GST Paid and Profit & Loss.
The code of the department group if the account is to be departmentalised.

Dept
Group

Tax Code

Category

P&L
Account

...

The tax code for the account. This must be one of the codes already present in
the tax rates table.
A category code. This can be a category that you have already created, or you
can have MoneyWorks create the new category as the accounts are imported.
If the account is an income account or an expense account (it has = "IN= " or =
"EX= " in the Type field), you need to specify which P&L account the income/
expense account will be associated with. For accounts of other types, this field
must be empty.
The remaining fields are optional, and will be imported if they exist in the file.
The position is important--if you want to import Category2 but not the
Accountants Code, there needs to be an empty field where the Accountants
code would be. You do not need to have the optional fields after the one you
wish to import.

Specifying the P&L account for IN, SA, CS and EX codes

The P&L Account specified for a new Income, Sales, Cost of Sales, or Expense
account must already be present in the chart of accounts. If, in your text file, you
use a P&L account code that is to be created by the import process, the account
definition must appear in the import file before it is used in the P&L Account
field of an Income or Expense account. A sample text file would be something
like:

WAGES
WAGES
WAGES

Profit and Loss

Type Group
Account Description
PL
900
EX
100-JF Wages
EX
100-DP Wages
EX
100-AB Wages
EX
110
EX
120
SA
150-WD Sales
Sales
150-GD
SA
Cheque Account BK
400
.

Stationery
Telephone

PCENT
PCENT

.

TC Category P&L Acc
*
E
E
E
G
G
G
G
*

FEXP
FEXP
FEXP
AEXP
AEXP
TINC
TINC

900
900
900
900
900
900
900

.

In this example notice that the Profit and Loss account appears in the file before
it is assigned to the expense and income codes 100, 110, 120 and 150. Notice
also that the type codes used for the Profit and Loss account and the bank
account are PL and BK respectively. After being imported, these accounts will
appear in the accounts list with types SF and CA, since these are the general
account types corresponding to those system account types.
Exporting & Importing

Importing into Other Files

When imported, MoneyWorks will create the department groups WAGES and
PCENT. It will also create the departments JF, DP, AB, WD and GD. JF, DP and AB
will be added to the group WAGES. WD and GD will be added to the group
PCENT. The categories FEXP, AEXP and TINC will also be created. You will need to
type in the descriptions for these — see Departments.

Importing into Other Files

The procedure for importing other files (names, transactions, products, etc.) is
the same, except that the file structure and import options will differ. For QIF
Bank Statement importing see Importing Bank Statements, and for importing
taxes see Importing Tax Rates.

1. Choose the type of information (Names, Products, etc) to import from the

Import submenu in the File menu

The File Open dialog box will be displayed

2. Locate the file you wish to import and click Open

If you used the Import XML, the XML data will be imported directly — see
XML Importing. Otherwise the Import Field Order window for the import
file is displayed.

3. Choose the import file format from the File Formatpop-up menu

The import file formats are described at Import.

4. Match the source fieldsin the data file with the destination fields you

want to import and set any options.

For specific information on field definitions and import options see the
appropriate section (transactions, payments on invoices, names, products,
or job sheet items).

MoneyWorks will not import any data that does not pass its validation checks.
How it handles errors is determined by the Skip Bad Records option:

• If the option is off (the default), MoneyWorks first scans through the entire

import file to check the data for validity. If there are problems with a record,
an error message will appear in the scrolling list with the line number that
the error occurred on. No records will be imported.

• If the option is on, MoneyWorks will check each record individually. If it is
valid, it is imported. If there is a problem it is not imported but is instead
written to a text file “Rejected Import Records.txt”. You can subsequently
correct the rejected records and re-import them.

5. Set the Skip Bad Records option if required

6. Click the Optionsbutton to specify any import options

The options vary depending on the file being imported into. For example,
when importing Products or Names, you might want to update existing
records in MoneyWorks.

7. Click OKto check and import the data

The Import Status window is displayed and the import/scan started. Any
errors found are listed2.

This shows a preview of the data in the file, allowing you to step through it, and
match the data to the MoneyWorks fields.

Note that if the information is already on your clipboard (having been copied
from a MoneyWorks document or another application), you can choose
Edit>Paste to open the Import Field Order window.
Exporting & Importing

Importing into Other Files

field names
Comma-
separated
values (CSV)

you set the Ignore First Lineoption in the File Open dialog.
This is a text format in which the fields begin and end with a quote character
(ASCII 34), and are separated by a comma (ASCII 44). Records are terminated
by a carriage return or CR/LF.

e.g. "Field One","2","Field 3".

This is not supported when importing accounts or budgets.
Merge format is the same as CSV (above) except that the first record contains
not data, but the names of the fields present in the file (and this first record
is comma-separated without quotes around the field names). This is not
supported when importing accounts or budgets.

Merge
format
(Comma-
separated
with field
names)

If you are importing transactions from FileMaker Pro, MoneyWorks supports the
FileMaker Pro repeating field export format. Each FileMaker repeating field can
be mapped onto a field in the transaction details.

Import Field Matching

When importing transactions, names, products and job sheet information,
MoneyWorks allows you to specify which fields will be imported and in what
order. This is done by means of the Import Field Orderdialog box.

To specify the field order:

1. Choose the correct file format from the File Format ispop-up menu

On the left side of the Field Order dialog box is displayed the data from the
text file that you chose.The first column contains the field number. You can
use this to calculate values derived from the raw data as part of the import.

If the format of the text file is Merge File or Tab Separated with Field
Names, then the field names will appear in the Source Fieldcolumn.

The Record xcolumn displays the actual record data from the import file. If
this data does not appear correct—everything is on the first line for
example—then you may have selected the wrong file format. You can scan
through the data by clicking on the left and right pointing arrows at the top
of the Record column. The Record number will change as you scan through
the data. Scanning the data in this way will help you to identify the fields if
the File Format does not include field names.

• If you want to stop the import/scan, click the Stopbutton. Any records

already imported will remain in MoneyWorks.

• If there were no errors, and the Skip Bad Recordsoption was not set, you

will be asked if you want to import the records. Click Importto do the actual
importing of the data.

• If there are errors and the Skip Bad Records option was not set, none of the

data will be imported. You must correct the errors and start again.

• If there are errors and Skip Bad Records is set, any bad records are written
to the reject file. Click the Rejects button to view them in a text editor. You
should correct them, save them in a file with a different name, and re-
import them

• You can print the error list by clicking the Print button.
• Clicking Backwill close the progress window and return you to the import

map configuration window.

Tip: If you have a lot of records to import, turning off the MoneyWorks

preference Enable Rollback and Crash Recoverycan make importing up to
ten times as fast. Remember to turn the option back on afterwards.

Import File Format

The import data may be in one of four different text file formats:

Format
Tab-
separated
text

Tab-
separated
text with

Details
This format is common to most applications. Records have a fixed number of
variable-length fields with each field separated by a TAB character (ASCII 9),
and each record terminated by a Carriage Return character (ASCII 13) or CR/
LF.
This format is the same as Tab-separated text except that the first record in
the file contains not data, but the names of the fields present in the file. If
you are using this format when importing accounts or budgets, make sure
Exporting & Importing

Importing into Other Files

The fields within MoneyWorks into which you can import
data are listed in the Destinationcolumn. The order of
these fields can be changed by dragging them up or down
the list. The mouse cursor will change shape to indicate
that the field can be dragged. When you drag a field and
drop it in a new location (opposite the data that you want to be imported
into it), it will swap places with the field name that was in that position.

Field dragging
pointer

Load...to load it

6. Click OKto continue with the Importing

The Import Progress dialog box appears.

If no errors are found, you can import the data as described previously.

2. Modify the field order to map the data into the correct MoneyWorks

fields

Using Calculations in Imports

The data is mapped from the Source to the Destination
column wherever there is an arrow in the central column.
To activate a field for importing, click on the dotted line in
the central column. An arrow appears, indicating that
data will be imported into the field. If you do not want to
import data into a particular field, click on the arrow to
turn it off. A dotted line is displayed in place of the arrow
to indicate that no data will be imported into the field.

Data will be
imported into the
Code field, but not
the Supplier field.

Fields into which data is not being imported can be filled with calculated
data. This is shown in the Use Valuecolumn—see Using Calculations in
Imports.

3. Click Options...to change the importing options

The Options dialog box appears. The options available depend on the file
that you are importing into.

MoneyWorks will remember the last used field order and option settings, so the
next time you import the field order will default to that previously used.
However if you will be importing data from several sources, you may want to
save the import setup for later use. The map can be reloaded in subsequent
imports by using the Loadbutton.

4. To save the import map for reuse, click Save...

The standard file save dialog box is displayed. You should save the map into
the Import Maps folder in your MoneyWorks Custom Plug-insfolder.

5.

If you have a previously saved Field Order and want to use it now, click

MoneyWorks allows you to massage the data being imported. This means that if
the data is incomplete, or doesn’t quite have the right fields, it might be
possible to fix this as part of the import process.

To specify a calculation:

1. Ensure there is no import arrow in the centre column

If there is, click on it to turn it off.

2. Double-click on the value in the right hand column

Double-click on the
value to open the
Use Valuewindow.

The Use Value dialog box opens.

You can only do this if no data is being directly imported (i.e. the centre
column has no arrow in it).

3. Choose the calculation method
Exporting & Importing

Transaction Importing3

Use Value: If you have a single, known value that you want to apply to all

left(_4, positionintext(_4, " ")-1)

imported records, specify it here;

"Money", the first word of field 4

Work it Out for Me: Set this if you want MoneyWorks to provide a value. This is

not always available—see Working it Out.

Calculate Value: Set this if you want to calculate a value for the field. This is

discussed further below.

• If you use the * / - operators, MoneyWorks will attempt to coerce the

values to numeric. The + operator is for a string concatenation; if you want
addition you need to coerce the fields to number by using TextToNum. For
example if field 3 contains “10” and field 4 contains “5”

Any calculations/values supplied here are normally only applied to new records
being imported.

_3*_4 = 50 (multiplication)
_3 + _4 = 105 (string concatenation)
TextToNum(_3) + TextToNum(_4) = 15 (Addition)

4.

If you want this to also apply to the updating of existing records, turn on
Set this field when updating existing records as well

Transaction Importing3

Records are only updated if the Update if Existsimport option is set (set
using the Optionsbutton).

5. Click OK

The Use Value window will close, and your value or calculation will be
shown in the Value column of the Import Field Order window.

Calculations

Calculations can be based on the data on the record being imported, as well as
MoneyWorks functions and global variables. The calculation is entered as a
normal MoneyWorks expression either direct into the Expression field, or into
the Calculation window that opens when you click the Edit button. For
information on expressions see Calculations and things.

Note: The fields being imported can be used in an expression by their field

name. You can also refer to data in the import file that is not being directly
imported by its field number (as shown in the first column). The number is
preceded by an underscore, so “_3” would refer to field 3 of the import. For
example, if field 4 contains “Money makes the world go around”

Left(_4, 3)

"Mon", the left 3 characters of field 4

Clicking the Optionsbutton on the Import Settings window will display options
that affect how the information is imported.

Signs: MoneyWorks can adjust the signs of values imported. By default

MoneyWorks assumes that all import data will have positive values. If you
are importing (say) Cash Receipts, and the import data is negative, then you
must click the Negativeradio button in the Receipts/Debtor Invoices box.
The signs of values for these transaction types will be corrected as the
transactions are imported.

Check Invoice Nºs: Set this if you are importing Debtor Invoices and you want

to ensure that imported invoice numbers do not duplicate existing ones.
Exporting & Importing

Transaction Importing3

Create Names: Set this if you want MoneyWorks to automatically create a new
Debtor or Creditor record if the Debtor Invoice or Creditor Invoice being
imported contains a Debtor or Creditor code that MoneyWorks does not
know. When this box is checked, information can be imported into the fields
designated by “Name.” in the Destination Fieldlist.

Create Jobs: Set this if you want MoneyWorks to automatically create a new
Job record if the transaction being imported contains a job code that
MoneyWorks does not know. When set, MoneyWorks will create a new
(descriptionless) job record for unknown job codes, otherwise an error will
be reported for unknown jobs.

Rounding Tolerance: MoneyWorks expects that the sum of the Detail.Gross
values will equal the transaction Gross value. If you are importing the
transaction gross value and have MoneyWorks work out the Detail.Gross
values for you, you may find that the application in which the transactions
were created rounded the GST differently, resulting in an inequality
between the sum of the individual gross values and the overall gross value.

MoneyWorks is lenient concerning the foibles of the source application.
Provided that the difference between the imported transaction gross value,
and the total gross as calculated by MoneyWorks is less than or equal to the
Rounding Tolerancespecified ($0.02 by default), MoneyWorks will adjust
the individual GST values in the detail lines as it imports the transaction so
that the detail line gross values sum up to the transaction gross value that is
imported.

Each line of text holds one whole transaction: Set this if each record in the
import file holds the information for a complete transaction. This is the
format to use if you are importing information from another MoneyWorks
document. This format is also suitable for FileMaker Pro repeating fields

Transactions are split over multiple lines of text Set this if one record in your
source file corresponds to a transaction detail line in MoneyWorks. For
MoneyWorks to know when a new transaction starts there must be a Key
field, which holds the same value for each record within a transaction.
Choose this field from the Key Fieldpop-up menu—the field you choose will
be displayed in red on the import map. Adjacent records from the imported
file with the same key field value will be amalgamated into a single
transaction.

Note: MoneyWorks will not import any transactions that are dated after the end

of the current period.

Importing embedded newlines in fields that allow them

When importing from a tab-delimited (or CSV) text file, an ASCII CR or LF is used
as a record delimiter, so cannot be included in the data to be imported. If you
want to import a newline, you need to use ASCII value 11 (Hex 0B, LINE
TABULATION). MoneyWorks will map this to a newline character (stored
internally as a CR, CARRIAGE RETURN).

Working it Out

MoneyWorks has heuristics for determining sensible values for fields that you
do not import values into. To use the heuristic, double click on the field value in
the right hand column and click the Work it Out For Meradio button. The
following table describes the fields for which the Work It Out For Meoption is
available and how they are evaluated by MoneyWorks.

Field Name
OurRef
TransDate
DueDate
Type

Gross
Contra

ToFrom
Hold

Detail.Account

Detail.TaxCode

Heuristic
If the transaction type is DI, then use the next sequential invoice number.
Use today's date.
Use the Names' payment terms to work out the due date.
If there is a debtor/creditor code present in the NameCode field, then the
transaction must be an invoice. If the account in the first detail line is an
income account then it is a Debtor Invoice (DI), otherwise it is a Creditor
Invoice (CI).If there is no debtor/creditor code then if the first detail line is
an income account then it is a Cash Receipt (CR), otherwise it is a Cash
Payment (CP).
Use the sum of the gross values in the detail lines.
For invoices, use the Accounts Receivable or Accounts payable account for
the Debtor or Creditor.For cash transactions we can't decide which bank
to use so if importing cash transactions you should not use the Work It
Out option for Contra. (MoneyWorks will insert = "no bank into the Contra
field which will generate an error.)
For invoices, use the company name of the debtor or creditor.
For debtor invoices, set to Yes if the Auto Credit Hold option is on in the
preferences and the debtor has overdue invoices or is over the credit limit
specified in the Debtor record.
Use the relevant control account for the product in Detail.StockCode. Do
not use Work it Out for this field if you are not importing product codes.
Use the tax code for the account in Detail.Account
Exporting & Importing

Transaction Importing3

Detail.Net

Detail.Gross
Detail.GST

If there is a stock code in Detail.StockCode, use Detail.UnitPrice *
Detail.StockQtyOtherwise use Detail.Gross - Detail.GST
Use Detail.Net + Detail.GST
If we know the net and the tax code, use Net * Tax Rate.If we know the
gross and the tax code, use Gross - (Gross / (1 + Tax Rate)).If we know
gross and net, use Gross - Net.
Detail.UnitPrice
If there is a stock code, look up the product sell price in the Products file
Detail.CostPrice If there is a stock code, look up the product's average stock value in the

Detail.Unit

Products file. For a transaction of type CI or CP, the buy price.
If there is a stock code, look up the product sell or buy unit in the Products
file

Transaction Field Names

The following table gives a list of any special import requirements. For a full list
of fields, refer to Appendix A—Field Descriptions.

Field
OurRef

TransDate

DueDate

Type

TheirRef

NameCode

Flag

Gross

Size Description
11

For Cash Payments, the cheque number; for Cash Receipts, the
receipt number; for Debtor Invoices, the invoice number; for
Creditor Invoices, the order number.
The date of the transaction. This should be normally specified in
dd/mm/yy format (If your system is set up for U.S. date formats,
you will need to specify dates in mm/dd/yy format).
MoneyWorks will also accept dates in d mmm yyyy format.
For invoices, this is the date that the invoice is due for payment.
For cash transactions, you should set it to the same as the
transaction date (TransDate)
CP for Cash Payment; CR for Cash ReceiptDI for Debtor Invoice;
CI for Creditor InvoiceSO for Sales Order; PO for Purchase
Order; QU for Quote
For debtor invoices, this is the customer's order number; for
creditor invoices, this is your order number; for cash
transactions, this field is not used.
For debtor invoices, this is the debtor code; for creditor
invoices, it is the creditor code.
This can be any text. If this field is not blank, a flag icon shows
up in the status column of the transaction list.
The gross amount of the transaction. This must be equal to the
sum of the detail line gross values (which it will be if you use
the Work it Out option).
The name of the person to whom the invoice or cheque is
written or from whom cash or the invoice is received. The
customer or supplier name is used if the Work it Out option is
set.

2

21

11

5

ToFrom

255

7

5

Contra

Hold
Salesperson

Recurring

n.Detail.Account
n.Detail.TaxCode
n.Detail.Net

13
3

n.Detail.Tax
n.Detail.Gross

n.Detail.Description 255
n.Detail.StockQty
n.Detail.StockCode
n.Detail.CostPrice

15

n.Detail.SaleUnit
n.Detail.UnitPrice
n.Detail.JobCode
Name.CustType

3

9

Name.SuppType

Name.Terms

Name.Hold

For Cash Payments, the account code of the bank account from
which the payment is made; For Cash Receipts, the account
code of the bank to which the receipt will be deposited; For
Debtor Invoices, the Accounts Receivable control account; For
Creditor Invoices, the Accounts Payable control acct.
Yes or No, 1 or 0, true or false
The salesperson field. This is the field that can be used for
appending a department to product control accounts during
data entry. Transaction importing will append this value to the
Detail.Account field only if you have the Work It Out option set
for Detail.Account and the product's control account has the
Append Salesperson option set.
A pseudo field for setting the recurrenceof a transaction. The
parameters are encoded with whitespace separating the 5
parameters (start d m w finish). Examples:
"3/8/07 3 2 * *" -- 3rd day of every second month
"1/8/07 14 * * *" -- every 14th day
"31/7/07 2 * 3 *" -- every second wednesday
"22/8/07 3 1 5 *" -- 3rd friday of every month
"31/7/7 32 1 * *" -- last day of every month
"1/8/07 7 * * 31/12/08" -- every 7 days, finishing 31/
12/08
"1/8/07 7 * * 5" -- every 7 days, recurring 5 times
The account code for the detail line
The tax code for the detail line.
The net amount for the detail line. This will be the extended
amount for a product transaction.
The GST/VAT or Sales Tax amount for the detail line
The gross amount for the detail line. This must be equal to the
sum of the Net and the tax
The description for the detail line
The quantity of a product bought or sold
The product code of a product
The cost price of the product. Use this for purchase
transactions.
The selling unit of the product
The selling price of the product. Use this for sales transactions.
The job code of the job to which the item relates
The type of customer: 0 for not a customer; 1 for a customer; 2
for a debtor.
The type of supplier: 0 for not a supplier; 1 for a supplier; 2 for
a creditor.
The payment terms for a creditor. A positive number N, denotes
N days. A negative number -N, denotes Nth day of month
following.
0 for No, 1 for Yes. This corresponds to the Hold check box for
Exporting & Importing

debtors.

Importing into Detail Lines

The transaction detail line fields appear in the field list as N.Detail.FieldName
where N is a number denoting that the fields with that number belong to the
same detail line definition. You can have many detail line definitions. When you
use a field in the last detail line definition, MoneyWorks automatically appends
a new set of detail line fields to the bottom of the field list. You do not have to
use the new set if you do not need them.

Importing Serial Numbers and Locations

Values imported into the n.detail.serialnumberand n.detail.stocklocationfields
are not validated by MoneyWorks (the assumption is that you have clean data
coming in from the other system). For purchasing serialised items this is as
expected, as the serial numbers will not exist. However for sales it is possible to
sell a serial number that does not exist in MoneyWorks (this can be corrected if
necessary with a Stock Transfer Journal).

If a non-existent location is imported on a detail line, it will be used in the
imported transaction, but no corresponding new location will be created in the
“Stock Locations” validation list. You will need to create this location yourself if
you want to use the bogus location.

Repeating Fields

If you are importing repeating fields from FileMaker Pro, the repetitions will
appear in the data list with slashes (/) between them. This slash actually
represents the ASCII value 29 (Hex 1D, INFORMATION SEPARATOR THREE) that
FileMaker inserts between exported repeating fields. Repeating fields can only
be imported into detail line fields.

When repeating fields are imported into a transaction detail line, as many detail
lines as there are repetitions of the repeating fields will be created. Each
repeating field must have the same number of repetitions.

Note: If you elect to place a constant value into a detail line field, and other

fields of that detail line have repeating values imported into them, the same
constant value will be inserted for each of the lines thus created.

Transaction Importing3

Importing General Journals

Journals in MoneyWorks are always debiting/crediting the detail.net value, and
do not have a GST/VAT/Tax component, and hence the detail.gross value is not
strictly defined. For this reason you should always set the detail.tax to 0, and
both the detail.taxcode and detail.gross to "work-it_out". This applies whether
using an import map or xml.

Transaction Import Errors

The Error Messages Table lists the possible error messages that you may get
when attempting to import transactions along with an explanation and/or
suggested remedy.

Message
"<CODE>" is not
a creditor

"<CODE>" is not
a debtor

"<TYPE>" is not a
valid transaction
type
Account Code
not specified
Bad field type
(<Field Text>)

Contra account
"<CODE>" does
not exist
Contra account
"<CODE>" is not
a bank account
Contra account
"<CODE>" is not

Explanation
The transaction is a Creditor Invoice, but the NameCode supplied does not
correspond to a creditor. It may correspond to a debtor, in which case you will
need to open the debtor in the Debtors/Creditors list and click in the Creditor
check box.
The transaction is a Debtor Invoice, but the NameCode supplied does not
correspond to a debtor. It may correspond to a creditor, in which case you will
need to open the creditor in the Debtors/Creditors list and click in the Debtor
check box.
Transaction type must be one of CR, CP, DI, CI., JN, SO, PO or QU

The Detail.Account field is blank.

You may get this error if MoneyWorks was expecting a number or a date, and
the text was not a valid number or date. You should check the field ordering
because you may be importing information into the wrong fields.
The value supplied for the Contra field is not a valid account code.

For cash transactions, the Contra field must contain a bank account code.

For Creditor Invoices, the Contra field must contain an Accounts Payable
account.
Exporting & Importing

Transaction Importing3

an accounts
payable account
Contra account
"<CODE>" is not
an accounts
receivable
account
Could not
determine
transaction type.
Couldn't adjust
for rounding
error. Transaction
not written

Debtor/creditor
code missing
Detail line does
not balance
Details don't
match gross

Field dependency
too complex

Field too long
(<Field Text>)
Invalid character
Invalid record
format
Invalid
transaction date
The Name "XXX"
is not of the
correct type
Not enough
fields
Record too long

Run out of disk
space!

For Debtor Invoices, the Contra field must contain an Accounts Receivable
account.

There was not enough information for the Work It Out heuristic to determine
the transaction type. Typically this is because there were no detail lines for
the transaction.
If there is serious sunspot activity and Venus is in Sagittarius it may happen
that MoneyWorks cannot adjust the GST values in the detail lines to make the
sum of the detail line grosses match the transaction gross. This "cannot
happen", but if it does this error will occur during the import phase (not the
check phase). The transaction will need to be corrected in the source
application.
When importing invoices, you must supply a debtor or creditor code.

Detail.Net + Detail.GST does not equal Detail.Gross

The supplied transaction gross value does not match the sum of the detail line
gross values (actually, the difference is larger than the specified rounding
tolerance). The gross value supplied may not include all of the detail lines that
you are importing or you may be importing the wrong gross values (are you
importing net values into the Detail.Gross field for example?)
MoneyWorks could not determine a value for one of the Work it Out fields.
You may have a circular dependency. This will happen if, for example, you
specify Work It Out for all of the Net, GST and Gross fields of a detail line.
MoneyWorks does not have enough information to work out sensible values.
The text is too long to fit into the field. Text fields in MoneyWorks are limited
in length. You must shorten the text in the source file.
You have included a space or an @ sign in the debtor or creditor code.
The data in the text file does not correspond to the format that was specified.

The transaction date is not a valid date. Make sure that the dates in the
import file match the local date formatting
You are attempting to import a sales invoice to a name that is not a debtor, or
a purchase invoice to a name that is not a creditor. You need to change the
settings in the original name record.
There are less fields in the import file than were specified to be imported. The
source application may not be exporting records in a consistent format.
The record is larger than MoneyWorks' import buffer. The only solution to this
problem, should you encounter it, is to reduce the amount of information in
the record.
There is no room on the disk to make more transactions. You need to quit
from MoneyWorks and make more space available on your hard disk. If this
happens, you will get this error during the import phase (not the check

Specified period
not open

Stock journals
cannot be
imported
System account
not allowed

Tax cannot be
applied to a *
account
transaction
The account
"<CODE>" does
not exist
The Debtor/
Creditor field
must be empty
for cash
transactions
The debtor/
creditor
"<CODE>" does
not exist
The invoice
number:
<NUMBER> is
already used

The Tax Code
"<CODE>" does
not exist
Too many fields

Transaction is
dated after
current period
Warning - Tax
code missing

phase). The import will stop.
MoneyWorks determines the transaction period from the transaction date.
The transaction date may be beyond the end date of the most recent period.
You will need to open a new period before you can perform the import.
MoneyWorks does not allow you to import stock journal transactions.
General journals are OK, using JN for the transaction type. and a negative
detail.net for a credit. Tax must be zero.
You cannot include "system" accounts in imported transactions. System
accounts include bank accounts, accounts payable/receivable, profit and loss,
and GST control accounts. MoneyWorks automatically inserts an "invisible"
detail line for the contra account, which is always a system account (either BK,
AR or AP). You can see this detail line when you print transactions with the
Print Full Details option.
The Detail.GST field is non-zero and the tax code for the detail line is *. The *
tax code must not have tax applied to it.

The account code in one of the detail lines is not a valid account code.

You have imported a value into the NameCode field (or used a constant value)
and the transaction type is not CI or DI. The NameCode field must be blank
for cash transactions. You cannot import receipts or payments that
correspond to invoices using transactions--see Importing Payments/Receipts
on Invoices
The debtor or creditor code supplied in the NameCode field does not
correspond to an existing debtor or creditor. To have MoneyWorks create new
creditors when an unknown creditor code is encountered, click the Create
Namescheck box in the Options dialog box when setting up the import.
If the Check Invoice N°s option is being used, you will get this error if the
invoice number (OurRef field) being imported is the same as the invoice
number of an existing invoice. If you are using the Work It Out option for
OurRef, you may need to set the next Invoice Number correctly in the
Preferences (see Sequence Nos).
The tax code is not present in the tax table. This is most likely a fault in the
source file, but you can also correct this problem by adding the code to the
tax table using the Tax Codes command.
There are more fields in the import file than were specified to be imported.
The source application may not be exporting records in a consistent format.
The transaction date is after the end of the current period. You need to open
the new period(s) before you can import the transactions.

The Detail.Tax Code field was empty. You will get away with this warning only
if the Detail.GST field is zero. You should really ensure that the tax code is
supplied. This can be done easily by using the Work It Out option.
Exporting & Importing

Importing Payments/Receipts on Invoices

Payment.Amount

N

Importing Payments/Receipts on Invoices

The amount of the payment/receipt to be allocated to invoice
InvID. For payments, this must be less than the outstanding
invoice amt. For receipts, any surplus will be handled as an
overpayment.If this field is set to Work it Out, the minimum of
the outstanding balance of the invoice and the residual
amount from the gross is allocated.

Importing payments on invoices is similar to importing other transactions except
that the imported payments are automatically posted. You can import
payments/receipts on invoices by choosing File>Import>Payments on Invoice, or
if you have the information on the clipboard, you can hold down the option key
(Mac), or the shift key (Windows) and choose Edit>Paste Records.

If the Payment.InvoiceID is set to Work it Out, MoneyWorks will choose which
invoice to allocate the amount to based on the Credit Handling pop-up in the
Import Options (for a discussion of the options, see Accepting the Batch of
Debtor Receipts.

The import fields are:

Field
OurRef

TransDate

Size Description
11

Type
NameCode[Required
field]
Flag

2
9

5

Description
Gross[Required
field]

Analysis
ToFrom

255

9
255

Salesperson
Payment.InvoiceID

5
7

For Cash Payments, the cheque number;for Cash Receipts, the
receipt number;
The date of the transaction. This should be normally specified
in dd/mm/yy format (If your system is set up for U.S. date
formats, you will need to specify dates in mm/dd/yy
format)MoneyWorks will also accept dates in d mmm yyyy
format. Work it out will insert today's date.
CP for Cash Payment; CR for Cash Receipt
For debtor invoices, this is the debtor code;for creditor
invoices, it is the creditor code.
This can be any text. If this field is not blank, a flag icon shows
up in the status column of the transaction list.
The transaction description.
The amount of the transaction. This must equal the sum of the
payment amounts. It will be set automatically to the sum of
the payments/receipts if the Work it out option is set.
Any text you like.
The name of the other party. This will be set to the creditor or
debtor name if the Work it Out option is set.
The salesperson field.
For receipts, this is your invoice number (which must be
unique). For payments, this can either be your order number
(which ought to be unique), or the creditors invoice number
(which ought to be unique for that creditor)--this choice is set
in the import Options.If this field is set to Work it Out,
payments are allocated based on the Credit Handlingpop-up
in the Import Options.

A note on exporting Payments/Receipts on Invoices

You cannot export payments/receipts on invoices in a manner that is suitable for
importing back into MoneyWorks. However you achieve the same result by
using a variant of Edit>Copy. To export payments or receipts on invoices:

1.

In the Transaction list, highlight the payments/receipts to export

2. Hold down the optionkey (Mac) or the shiftkey (Windows) and choose

Copy from the Edit menu

MoneyWorks will copy the highlighted payments/receipts against invoices
to the clipboard, ignoring those that are not payments/receipts against
invoices. The format used is tab delimited with repeating fields.

You can paste this into a spreadsheet or word-processor, and save the
resulting document as a text file if you wish, or option/shift paste it into a
another MoneyWorks document.

To paste into another MoneyWorks document

1. Open the transaction list in the other MoneyWorks document

2. Hold down the optionkey (Mac) or the shiftkey (Windows) and choose

Paste from the Edit menu

The import map for Payments on Invoices will be displayed.

Note: The target MoneyWorks document must have the same invoices (and

Names) as the originating one, with unique invoice numbers.
Exporting & Importing

Product Importing

Flags

This is used to set the various selling price options for the
products, each of which is represented by a bit.

Product Importing

To view or set the product import options click the Optionsbutton in the Import
Field Order window.

Update if Exists: If set, MoneyWorks will update the data for any records whose
product code matches the code of the record being imported. Calculated
values are imported only if the updateoption in the Use Value window is
on. If the Update if Existsoption is off, then MoneyWorks will report an
error if the code for a record being imported matches an existing code.

Sell Prices are Tax Inclusive: If set, all sell prices imported are stored as GST

Inclusive, otherwise they are stored as GST Exclusive, unless overridden by a
setting in the Flags field.

Field Descriptions for Products

fBreakAdd = #00008000
fReorderWarn = #00000100
fPriceTaxInclusiveA = #00000200
fPriceTaxInclusiveB = #00000001
fPriceTaxInclusiveC = #00000080
fPriceTaxInclusiveD = #00001000
fPriceTaxInclusiveE = #00002000
fPriceTaxInclusiveF = #00004000
fCostPlusD = #00010000
fCostPlusE = #00020000
fCostPlusF = #00040000
fDiscountD = #00080000
fDiscountE = #00100000
fDiscountF = #00200000

Note that the Buy, Sell, and Inventory options will be set according to which
control account fields you supply. This can only be done when importing new
products, not when updating existing ones. If you supply an asset account to
make a product inventoried, the Type must be P (in fact it will be forced to P).

The following fields may need special consideration when importing into
MoneyWorks. For a full description of product fields see Products (Items).

Product Import Errors

Size Description
15

11

13

13

13

Field
Code

Supplier

SalesAcct

StockAcct

COGAcct

SellPrice
BuyPrice
AverageValue
ConversionFactor

SellDiscount
SellDiscountMode

Type

Code to identify product. Must be unique (unless updating) Can
not contain spaces or @.
The creditor who normally supplies this product. If present must
be a valid creditor code.
Income account to be credited when the product is sold. Not
required if you do not sell the product.
Current Asset account to be credited when product is sold. Not
required if you do not stock the product.
Expense account to be debited when the product is sold. If you
are not stocking the product, this is the purchase expense
account.
The unit sell prices. See the Flags for GST/Discount settings
Price you normally pay per buy unit
Average per-unit stock value; you cannot alter this
Sell units = ConversionFactor * BuyUnits. Note that this is the
reciprocal of what is on the entry screen.
Sell discount percentage (0..100)
Discount mode. A number in the range 1..4 corresponding to the
discount mode menu items.
P, S, T, or R. Inventoried products must be P

Message
The product code
"<CODE>" is already in
use

Sales account
"<CODE>" not found
or wrong type
Stock account
"<CODE>" not found
or wrong type
Product code missing
COGS account
"<CODE>"not found or
wrong type

Explanation
Product code is not unique. Check that there is no existing code in your
product file and that the code does not appear twice in the import file. If
you are trying to update existing products, you need to set Update if
Exists.
Sales account must be an Income account.

Stock account must be Current Asset

You must supply a product code
COG/Purchase account must be Expense.
Exporting & Importing

Names Importing

Import Names Error Messages

Names Importing

To view or set the Name import options click the Optionsbutton in the Import
Field Order window. Note that Mac users can import their Mac Address Book
directly using the File>Import>Address Bookcommand.

Update if Exists:

If you set this option, MoneyWorks will update the data for any records whose
code matches the code of the record being imported. Only imported fields are
updated—default values and Work-it-Out values will be updated only if the Set
this field when updating existing records as well option is set — see Update if
exists.

If this option is off, then MoneyWorks will report an error if the code for a
record being imported matches that of an existing record.

This feature could be used to update customer address lists from an external
database.

Name Field Descriptions

The following Names fields need special consideration when importing. For a
complete list of fields, see Names.

Field
Code

Size Description
11

Unique code to identify debtor or creditor. Can be set to "Work it
Out" to create a unique name code based on the current settings for
Code Assignment for New Namesin the Terms panel of the
Document preferences
0 for not a customer, 1 for customer, 2 for debtor
0 for not a supplier, 1 for supplier, 2 for creditor
The payment terms for a debtor. A positive number N, denotes N
days. A negative number -N, denotes Nth day of month following.
The payment terms for a creditor. Settings as for DebtorTerms.
0 = Not hold, 1 = Hold. This corresponds to the Hold check box for
debtors.
Credit limit for a debtor
Accounts Receivable control account for a debtor.
Accounts Payable control account for a creditor.

CustomerType 1
SupplierType
1
DebtorTerms

CreditorTerms
Hold

CreditLimit
RecAccount
PayAccount

7
7

Explanation
The Accounts Receivable control account is not valid--missing or wrong
type.

The Accounts Payable control account is not valid--missing or wrong
type.

This is a warning only. You can still import if you get this error.

This is a warning only. You can still import if you get this error.

Message
The Accounts
Receivable control
account is not valid--
missing or wrong
type.
The Accounts Payable
control account is not
valid--missing or
wrong type.
The debtor/creditor
code is longer than 6
characters. It will be
truncated.
The debtor/creditor
code has spaces or
wildcards. They will be
converted to
underscores.

Job Importing

There is only one Job import option, Update if Exists. To view or set this click the
Optionsbutton in the Import Field Order window.

If Update if Existsis set, MoneyWorks will update the data for any records
whose code matches the code of the record being imported. Only imported
fields are updated—default values and Work-it-Out values are ignored and these
fields retain their original information.

If this option is off, then MoneyWorks will report an error if the code for a
record being imported matches that of an existing record.

The fields that may require special consideration when importing are outlined
below. For a full list of fields see Jobs.

Size Description
9

Field
Job
Client 11 Must be a valid debtor code.

The job code. This must be unique.
Exporting & Importing

Job Sheet Item Importing

There are no options for job sheet items.

The fields that may require special consideration when importing are outlined
below. For a full list of fields see Job Sheet Items.

15
3

Field
Job
Qty
Resource
Units
Date
CostCentre 5
CostPrice
Sell Price
Status

Size Description
9

The job code. It must already exist.
The quantity of the resource or product used.
The code for the resource or product. It must already exist.
The units of the resource or product (e.g. Hr, Kg, Km).
The date of the job sheet item,.
The cost centre. If specified it must be a valid Department code.
The cost of the product or resource used (ex GST).
The anticipated charged value of the product or resource used (ex GST).
Must be "Actual" or "Budget".

Note: As for manual entries in the job sheet, MoneyWorks will make and post a
stock requisition journal for any imported job sheet entries whose resource
code is that of an inventoried product.

Importing Tax Rates

In MoneyWorks Gold/Datacentre, you can import taxes from a tabbed or
comma delimited (CSV) file to create new tax codes or to update the rates on
existing codes. The format for importing taxes is fixed as follows, and all fields
must be present:

Field
Tax Code

Tax Name
Type

Rate1
Changeover
date
Rate2

Description
The new code (maximum of five characters), or the existing code to
update.
A brief description of the tax.
The type of tax. Use "S" or sales tax, or "G" or "V" or GST/Value Added
taxes.
The percent rate for the tax to use before the changeover date.
The date at which Rate2 will be used instead of Rate1.

The rate to use for transactions dated on or after the changeover date.

Job Sheet Item Importing

To import tax codes, choose File>Import>Tax Codes/Rates.

Notes

• If a tax code exists, that tax will have its details updated, otherwise a new

tax will be created.

• If there is no changeover date, set the date to today's date and make the

two rates the same.

• Composite taxes cannot be imported.
• Imported taxes cannot be All Tax.
• The Tax code is for a different countrysettings cannot be set or changed by

importing.

• You must be the only user connected to MoneyWorks to import tax rates

(the database is locked so other users cannot connect)

Importing Direct from other Applications

MoneyWorks supports importing by AppleEvents on the Mac and COM on
Windows, as well as through the REST API. This allows the seamless transfer of
information from other applications into MoneyWorks, even across a network.
For example, an Excel spreadsheet can submit data directly to (and suck
information directly out of) a MoneyWorks document.

MoneyWorks Datacentre also allows for communication through the command
line interface (CLI) and REST APIs. This allows remote websites to query
MoneyWorks (and also submit transactions and other information) using
common tools such as PHP.

For more information on this please see:

http://www.cognito.co.nz/developer/

XML Importing

MoneyWorks supports import and export of xml-formatted data. This removes
the need to preconfigure an import map when building automated importing
scripts (although you will still need to understand import maps). XML is the only
import format supported by the REST interface.
Exporting & Importing

XML Importing

For manually invoked XML import, there is an XML option to the Import menu,
and you can also drag & drop .xml files into list windows to invoke an import
(provided there are no errors, it will just happen). You can also copy XML text
and paste it directly into a MoneyWorks list.

XML files to be imported must be valid XML and must provide the necessary
fields to specify valid record data for MoneyWorks. For example, if importing a
transaction, the transaction line items must add up and agree with the
transaction total; the transaction type and necessary fields such as Contra must
be specified. This is no more or less that you would do with an Import Map. You
can’t just throw some partial data in and expect MoneyWorks to read your mind
about what it means4.

XML file format

The import format is compatible with the XML export format that MoneyWorks
produces. You can export a table using the REST APIs, e.g.

http:// ... /REST/Acme%20Widgets/export/table=name&format=xml

and also from the command line with, e.g:

moneyworks -e 'export table="transaction" format="xml"'

document.moneyworks

This exports the entire transaction table to stdout.

The import file may contain a single <table> element, or may contain an
<import> element with multiple <table> elements within it. The <table>
elements can be for different tables.

The <table> element must have a name attribute specifying the target table for
the import.

The <table> element will contain multiple record elements, whose element
name will be the table name (e.g. <transaction>). Each record element will
contain a set of field elements whose names are valid fieldnames from the
MoneyWorks schema (e.g. <ourref>). See Appendix A—Field Descriptionsfor
table and field names.

Note that localised formats are not used for date and numbers. Dates must be
specified in YYYYMMDD format. Numbers must be formatted without thousands
separators and non-integers must use '.' as the decimal separator.

As a special case, transaction elements will also contain a <subfile> element,
which will contain multiple <detail> elements specifying the line items for the
transaction.

The Work-it-Out facility for fields that support it can be invoked with an empty
field name tag with the attribute work-it-out=”true” (you can determine such
support by checking the relevant field in the usual importing configuration
dialog - if the field options support work-it-out there, then it is supported by the
XML importer). E.g:

<transdate work-it-out="true" />
Exporting & Importing

XML Importing

Likewise, calculations can be done using the calculated attribute. In this case the
text within the element is treated as an expression whose result is used as the
actual import data for the element. If you are referencing imported fields, those
fields must have appeared earlier in the xml file. E.g:

<user1 calculated="true">Lookup(NameCode,

"name.Category2")</user1>

Fields and subrecords with the attribute system=”true” will be ignored by the
importer.

Additional table attributes for controlling the import

Where appropriate, the same import options available in the regular import can
be specified as attributes of the table element.

The following attributes may be specified for the transactions table. They
correspond to the equivalent setting in the Transaction import options dialog or
the parameter to the regular scripted import:

• create_names="true"
• create_jobs="true"
• rounding_tolerance="D" - (where D is a dollar amount. 0.02 is the default)
• negate_in="true"
• negate_out="true"
• update="true" seqnum="N" - where N is a sequence number. Allows
Debtor Invoices to be "recalled" (replaced or cancelled and replaced
depending on whether posted or not).

• return_seq="true" - response of the import command will be a sequence

number of last record imported instead of a success notification

• post="true" seqnum="N" - where N is a sequence number
• discard="true" seqnum="N" - where N is a sequence number of unposted

trans to be deleted. This usage is deprecated

For Importing Names, Jobs, and Products (Items)

• update="true" - General update case for non-transaction tables (Items,

Jobs, Names) - updates the provided fields

Payments on invoices

The XML format for importing payments on invoices is slightly non-obvious. The
table name attribute for the import needs to be “payments”, but the top-level
records that you import are <transaction>, with subrecords of <payments>.

E.g:

<?xml version="1.0"?>
<table name="payments">

<transaction>
<namecode>GREEN</namecode>
<ourref>123456</ourref>

<transdate>20101030</transdate>
<gross>380.25</gross>
<contra>1001</contra>
<subfile name="payments">

<payments>

<invoiceid>2041</invoiceid>
<amount>380.25</amount>

</payments>

</subfile>
</transaction>

</table>

Note:

Unlike an import map, the order of the fields is important. Thus in importing a
transaction the following

<?xml version="1.0"?>
<table name="transaction">

<transaction>
<ourref work-it-out="true" />
<type>DI</type>

...

will not produce the same value for ourref as:

<?xml version="1.0"?>
<table name="transaction">
<transaction>

<type>DI</type>
<ourref work-it-out="true" />

...
