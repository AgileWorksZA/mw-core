# Cash Transactions

Cash Transactions

8 Prior to MoneyWorks 6, the Qtyand Item(then called Product) fields were the
other way.↩

Cash Transactions

9 This will not work if the Always Wrapoption is on.↩

10 Images go into the Pictures folder —see Managing Your Plug-ins.↩

11 In MoneyWorks 6 and earlier, this dialog contained additional print options.
These have been moved into the sidebar of the transaction list, and, for Details, as a
separate toolbar icon.↩

12 To find out just how awesomely smart MoneyWorks custom forms can be see
Forms Designer.↩

Cash transactions are transactions that directly affect one of your bank
accounts1. We use the term “Cash” somewhat loosely here to represent not
only those transactions that involve the “folding stuff”, but also cheques, credit
cards, automatic payments and so forth—in fact any financial transaction that is
not an invoice.

There are two types of cash transactions: receipts and payments, and each type
has its own tab view in the Transactions window. In addition, you can transfer
funds between bank accounts with the Transfer Fundscommand.

13 In MoneyWorks 7, the Treat Job-Related Income as Pre-Paymentsposting option
was moved to the Jobs panel in the Document Preferences.↩

Entering Payments

A Paymentrepresents money that has left one of your bank accounts. If the
payment is for an invoice that has already been entered into MoneyWorks it will
need to be processed specially— see Paying Your Creditors.

If the payment is for a cash purchase of some sort, proceed as follows:

1.

In the Transactions window press Ctrl-N/⌘-N, or Choose Edit>New
Payment, or click the Newtoolbar button

A transaction entry window will open.

2.

If necessary use the transaction type menu to set the transaction to the
desired type

Tip: Use the keyboard shortcut to change the type:

• For a Payment press Alt-Shift-1/Ctrl-Shift-1
• For a Receipt press Alt-Shift-2/Ctrl-Shift-2

Note: MoneyWorks will (after confirmation) clear any

information in a transaction when the type is altered.
Use the Typemenu



Cash Transactions

Entering Payments

to set the
transaction type.

Bankpop-up menu

The pop-up menu will be displaying the default bank account for the
transaction type. Set the pin next to the bank menu to change the default

7. Type the payee details into the Tofield

If you have entered a supplier code into the Supplierfield, the Tofield will
already contain the supplier’s name.

8. Type a text description if required into the Descriptionfield

You can enter up to 1000 characters into this field.

9. Type the total being paid into the Amountfield

The OKand Nextbuttons dim when an amount is entered into the Amount
field. The transaction is not complete until you have allocated the total
amount to one or more accounts.

3.

If the payment is made to a supplier whose details are recorded in the
Names file, set the Suppliercheck box and key the supplier code into the
Supplier field

This indicates the method of the transaction (cheque, cash etc.)—for
payments this is purely for your own information.

10. Set the Paid Bypop-up

The supplier’s name will appear in the Tofield. If you have the address
fields showing, the address will also be displayed. If payment is being made
for an invoice see Paying Your Creditors2.

Additional fields may be shown on the entry screen. These are
controlled by the Viewstoolbar button. See Fieldsfurther
details of these fields.

4. Enter the cheque number into the Cheque #field

MoneyWorks will have inserted a reference number one greater than the
previously entered one. If this is correct, you need not type anything in.
Historically this was the cheque number, but if you are not using cheques
any more then it is just a reference number.

5. Tab across to the Datefield and enter the date of the transaction

11. Set the details tab to Serviceor Product, depending on

the type of transaction

If the Supplierfield has a creditor code in it, this will have
defaulted to Payment on Invoice(not MoneyWorks Cashbook).

Use the Views
menu to alter the
number of fields.

The Amount for the payment needs to be allocated to one or more accounts
before the transaction can be entered.

By default, this will contain today’s date or the last date used.

12. Press Ctrl-tab (Mac) or Ctrl-` (Win) to move to the first detail line

6. Choose the bank account from which the payment is being made from the

13. See the section Entering Detail Linesto find out how to enter detail lines

by account code or by product code
Cash Transactions

Entering Receipts

Note that the OKand Nextbuttons remain dimmed until the total gross
amount and the total of the detail lines balance.

14. Set the printand/or postoptions if you want to print out
a payment advice/cheque, or post the transaction when
it is accepted

15. When the details of the transaction are complete, click

the Nextbutton or press the keypad-enter key to enter this transaction
and bring up a new Payment form

Click OKif this is the last payment to be entered. Clicking Canceldiscards
the transaction.

Entering Receipts

A Receiptrepresents money that has entered one of your bank accounts, or at
least has been received for banking at a later time.

If the receipt is for payment of an invoice that you have already entered into
MoneyWorks it will need to be processed specially— see Receiving Payment for
Sales Invoices. If the receipt is for a cash sale of some sort, or for other income
(such as interest earned), proceed as follows:

1.

In the Transactions window press Ctrl-N/⌘-N (or Choose Edit>New
Receipt), or click the Newtoolbar button

The new transaction window will open.

2.

If necessary set the type to receipt using the typemenu

3.

If the receipt is from a customer whose details are recorded in the Names
file, or if it is for an invoice you have previously sent out, set the Customer
check box and key the customer code into the Customerfield

The customer’s name will automatically appear in the Fromfield.

4. Enter the receipt number into the Receipt #field

MoneyWorks will have inserted a number one greater than the previously
used one. If this is correct, you need not type anything in.

If you want, your receipt numbers can be prefixed by non-numeric
characters. When MoneyWorks inserts the next receipt number for you, the
non-numeric characters (and any leading zeros) will be prepended to the
number. For example: If you previously entered “CR00405”, MoneyWorks
will enter “CR00406” for you in the next Receipt transaction.

5. Tab across to the Datefield and replace the date if necessary

By default, this will contain today’s date or the last date used.
Cash Transactions

6. Choose the bank account to which the receipt is being

made from the Bankpop-up menu

To record the cheque/credit card details

The pop-up menu will be displaying the default bank
account for the transaction type. Set the pin next to the
bank menu to change the default.

Click the pin to set
the default bank
account.

11. Click the down arrow next to the Paid By pop-up menu

If the Paid By pop-up menu is itself highlighted, you can
press Ctrl-downarrow/⌘-downarrow.

Entering Receipts

Click the down
arrow next to the
Paid Bymenu.

The Receipt Details screen will be displayed—the details
of this depend on whether you are processing a credit card or another form
of payment.

Note: If you accumulate receipts for subsequent banking, you should use a bank
holding accounting for the receipt. When you finally come to bank the
money, use the Banking command.

Note: In MoneyWorks Gold the display of the bank balance is controlled by the

See Balances in Bank Pop-upuser privilege — see Multiuser

7. Type the payer details into the Fromfield

You can enter up to 200 characters into this field. Entering a customer code
into the Customerfield, automatically fills out the Fromfield.

If the payer details do not fit on a single line, or you want to
enter address details, click the address disclosure control to
show the full mail and delivery addresses — see Viewing the
Address Fields.

8. Enter a text description if required into the Description

field

Mac and Windows
disclosure icons

You can enter up to 1000 characters into this field—press Ctrl-
downarrow/⌘-downarrow to see the full description field.

Enter the receipt details—you only need to do this if they differ from those
displayed next to the customer code (i.e. on the customer record).

9. Enter the total amount being received into the Amountfield

Additional fields can be displayed using the Viewstoolbar button.

The OKand Nextbuttons dim when an amount is entered into the Amount
field. The transaction is not complete until you have allocated the amount
to one or more accounts.

10. Set the Paid Bypop-up

Setting this determines how the transaction will be printed on the deposit
slip in the banking command. “Cash” transactions are aggregated as a single
figure. Other transactions are listed individually.

12. Set the details tab to Serviceor Product, depending on the type of

transaction

The total Amount of the Receipt needs to be allocated to one or more accounts
before the transaction can be entered.

13. Press Ctrl-tab (Mac) or Ctrl-~ (Win) to move to the first detail line

14. See the section Entering Detail Linesto find out how to enter detail lines

by account code or by product code
Cash Transactions

Printing Tax Receipts

Note that the OKand Nextbuttons remain dimmed until the total gross
amount and the total of the detail lines balance.

pop-up menu

3. Enter any text in the optional Messagetext box

This message will be printed on all the receipts being printed.

4. Check the Print “Copy” if Already Printedoption if you are reprinting a

the print and post
options.

receipt

15. Set the printand postoptions if you want to print out a
tax receipt form or post the transaction when it is
accepted

16. When the details of the transaction are complete, click
the Nextbutton or press the keypad-enter key to enter
this transaction and bring up a new Receipt window

Click the OKbutton if this is the last payment to be entered. Clicking Cancel
discards the transaction.

Printing Tax Receipts

You can print a tax receipt when you enter a transaction by setting the Print
option. You can also print a Tax Receipt for any existing receipt(s).

1.

In the Receipts list, highlight the receipt(s) to be printed and Choose
Commands>Print Receipts or press Ctrl-[/⌘-[

The Print Receipts dialog box will open.

If this option is checked and the receipt has already been printed, the words
“Copy of” appear on it. If the receipt has not already been printed this is
ignored.

Note: If this is the first time that you have printed this form, you should check

the positioning and paper size — see Output Settings.

5. Click Printto print, or set the Output Topop-up to email and click Sendif

you want to email the receipt

When emailing, the Mail Attachment window will be displayed. See
Emailing Formsfor information on this.

For “Plain” forms, if the Print this Logoand/or Print Address & Phone Nos
options in the Company Setupwindow have been checked, the company logo
and/or address details will be printed at the top of the receipt. If you want to
print the receipt on letterhead which contains these details, you should ensure
that the options are off and that the top margin in the page setup is large
enough that your letterhead is not overprinted.

For further information on printing, see Printing Invoices, Receipts and other
Transaction Forms.

Bank to Bank Transfers

If you have more than one bank account, you may need to transfer funds from
one to the other. You can accomplish this by a single payment transaction, which
will credit the source bank and debit the destination bank3. However it is easier
to use the Transfer Funds command

2. Choose the form to be used for formatting the receipt from the Use Form

1. Choose Command>Transfer Funds
Cash Transactions

The Funds Transfer window will be displayed.

The Banking Command

though in practice there might be only one deposit transaction on your bank
statement). However if you receipt the transactions into a bank holding account,
they can be transferred to the actual bank account by using the Banking
command. Thus the amount of the deposit will appear as a single deposit
transaction (Banking Journal) on your bank reconciliation.

To transfer money from a bank holding account into an actual bank account:

1. Choose Command>Banking or press Ctrl-B/⌘-B

The Banking window will be displayed.

2. Set the Fromand Tobank accounts, and specify the amount, date, period

and description

3. Click Transfer

A payment transaction will be created (and posted) from the source bank
account to the destination.

Note that, if the currencies differ, you will be able to specify the exchange rate
see [Transferring funds to/from a foreign bank account].

The Banking Command

The Banking command is used to transfer funds from a bank holding accountto
a “real” bank account.

For example, in the normal daily running of your business you might receive
funds throughout the entire working day. If you receipt these into a “real”
MoneyWorks bank account, you will need to reconcile each receipt (even
This lists (and highlights) all transactions in the holding account.

2. Click on any transactions that you do not wish to bank

The status of the highlight is toggled by clicking on a transaction in the list.
Only highlighted transactions will be banked.

There are two transfer options that you can use:



Cash Transactions

The Banking Command

Transfer .. of cash to: This allows transfer of the specified amount of cash to a
different “bank” account. For example you might be holding some money
back for your petty cash or till float. The amount that you can transfer
cannot exceed the total amount of cash receipted (i.e. receipts whose
payment method was Cash).

Transfer .. deposit fees to: This allows transfer of a specified amount of deposit

fees to the nominated account.

3.

4.

If you are holding some of the cash to put into another “bank” account
(such as petty cash or a till float), set the Transfer .. of cash tooption, and
specify the amount of money and the alternate bank account

If you wish to record deposit fees as part of the transaction, set the
Transfer .. deposit fees tooption and specify the amount of deposit fees
and the general ledger account code

Do this only if your bank subtracts the bank fees from the deposit amount.
If in doubt, or if your bank shows deposit fees as a separate item on the
bank statement it is better to enter a separate payment transaction to
record the payment of the fee.

5. Choose the bank account into which the deposit is being made from the

Deposit topop-up menu

6.

If you wish to print a deposit slip, click the Printbutton

The deposit slip will itemise all non-cash transactions, and accumulate cash
ones into a single amount. It will include the bank/branch and account
name from the transaction or customer/debtor record — see Names.

7. Click OKto do the banking

The Banking Journalwindow will be displayed.

The Banking Journal window summarises the banking transactions and
allows you to specify the date and period of the journal.

8. Change the Date, Period, Descriptionand Analysisfields if required

9. Click OKto create the journal.

A banking journal4 will be created to effect the transfer of funds from the
holding account to the nominated bank account(s). If Cancelis clicked, the
Banking window will be displayed again.

To View the Items in a Banking

After you have created the banking journal, you can view the individual
transactions that made up the journal.

1. Highlight the banking journal in the transactions list window

The journal can be found under the Journalstab.
Cash Transactions

Manual Electronic Payments

2. Click the Relatedtoolbar button, or Choose Select>Find Related

marked as being ready for reconciliation.

The Find Related window will be displayed.

3. Set the Banked Receiptsand Make Found Setoptions, and click Go

The transactions that make up the banking will be displayed.

Manual Electronic Payments

MoneyWorks can create text files of payments for batch loading into on-line
banking software. You would normally do this using the Batch Creditor
Payments command see Paying a number of creditors. However you can create
manual batches, as described below.

Note: You need to have the appropriate software installed to do electronic

transfers—call your bank for details.

To create a payments file for transferring via an on-line banking service:

1. Highlight the posted transactions to transfer in the Payments view of the

Transactions list window

You can use the Find command to locate the records see Lists.

2. Choose Command>Electronic Payments

The Electronic Payments dialog box will be displayed— see Electronic
Paymentsfor detail of how this operates.

Importing Bank Statements

Most banks provide a facility for their customers to download bank statements
as QIF or OFX files.

MoneyWorks allows you to import these bank statements5, and can
automatically code them as they are imported. It provides an easy way to
preview the transactions, allowing you to modify the coding, or apply payments
to outstanding invoices. You can also elect to omit transactions, or have them

In Australia and New Zealand, you can also use Bank Feeds to fetch bank
transactions automatically.

Note: Bank statements should be downloaded from your bank as QIF or OFX
files. If your bank does not support these formats, they probably support
simple text files such as CSV or tab delimited. These can also be imported
into MoneyWorks using the standard Import Transactionscommand — see
Importing into Other Files. However you may have to remove extraneous
information (such as account number and opening balances) from the
downloaded file.

To import a previously downloaded bank statement

1. Choose Command>Load Bank Statement

The Statement Coding window will open.

This allows you to specify the bank account that you are importing, as well as
other details pertinent to the import.

Bank: The MoneyWorks bank account into which you want to import the bank

statement transactions
Cash Transactions

Importing Bank Statements

Default Income A/c The account code to use for any deposits that cannot be
coded using one of the auto-allocation rules. It is good practice to use a
special account for this, such as a suspense account or an “Unallocated”
account. This makes finding unallocated transactions much easier.

Default Expense A/c The account code to use for any withdrawals that cannot
be coded using one of the auto-allocation rules. Again it is good practice to
use an “Unallocated” account code (this can be the same as that for
deposits)

Source The kind of statement file to import. QIF/QBO/OFX to import Quicken

interchange file or old-style Quickbooks OFX files provided by most banks.
OFX-XML to import modern OFX files (in actual fact if you choose the wrong
one here, MoneyWorks will work out the file type for you). Generic CSV will
import a csv or tab delimited file, while Bank Feeds will fetch statements
using Yodlee (after setting up a feed subscription and linking accounts). 6

Exclude items before: Any transactions in the file being imported that are dated
before this date will be excluded from the import. This defaults to the date
of the last transaction in the prior statement import for this bank.

And after: Any transactions in the file being imported that are dated after this

date will be excluded from the import

Auto-Reconcile: If set, each transaction will be compared against existing

transactions, and if found to already exist in MoneyWorks will be marked to
be omitted. New transactions will be marked as being reconciled.

Swap Payee and Memo: Setting this swaps the Payee and Memo fields around,

as some banks get it around the wrong way.

2. Choose from the Bankpop-up menu the bank account for which you are

loading the statement

The transaction information you have downloaded from the bank refers to
one bank account. You need to indicate which one it is.

3.

If necessary, set the Default Incomeand Default Expenseaccounts

These will be remembered from your last bank statement import, but will
need to be set the first time you import a bank statement.

4. Set the cut-off dates if required

Transactions on the bank statement that are outside of the date range will
be ignored. This allows you to download your bank statements and not
worry about overlapping dates. When the import is accepted, the before
date gets transferred to the after date, ready for the next import.

5.

If you want to have the transactions automatically marked as being
reconciled, set the Auto-Reconcile option

Transactions on the bank statement that can be identified as being already
in MoneyWorks will be marked to be omitted, with the existing transaction
marked as reconciled; other transactions will be marked as reconciled.

6. To import the file, click the Load Statement Filebutton

The standard File Open dialog window will be displayed. Use this to
navigate to and open your downloaded bank statement file.

Any transactions inside the nominated date range are imported and listed.
Transactions are allocated to the specified default accounts, unless an
applicable auto-allocation rule was found, in which case the allocation is
made on the basis of the rule. This is shown in the Status column.

7. Having made your allocations (see below), click Accept

The transactions will be created with the specified allocations.
Cash Transactions

Importing CSV files

OFX and QIF files have a defined structure and layout, which allows
MoneyWorks to dissect them. CSV (comma delimited files) on the other hand
has no set layout, but is just a set of field data separated by commas.
MoneyWorks has no idea what each column actually represents.

The Generic CSV bank import option allows you to specify what data is in what
column, and to save those settings for later reuse.

When you select Generic CSV, you will be prompted to locate the downloaded
csv file in the normal manner, and then will be presented with the following CSV
Settings window.

Importing Bank Statements

2.

If there is a heading row, set the Has Heading Rowcheckbox

3. Set the field pop-up menus (Date, Reference etc) to the column number

that contains the associated data

In our sample file we have found a data record and can hence determine
what columns the data is in.

We therefore set the Date to column 1, the Reference to column 4 and so
on.

4. Check the date format on an actual data record

Dates are important in accounting, and have different formats depending
on where you are and the whim of the bank.

This is used to specify the columns in the csv file that is to be imported.

1. Use the right and left arrow keys to step through the records in the csv file

until you find the heading row or first data row

There can be a lot of cruft in bank csv files, and you need to step through
this until you get to the transaction data.
Cash Transactions

Importing Bank Statements

If you need to amend a saved format, click on it to select it, make the required
changes, then click the Savebutton and save it with the same name (this will
silently replace the existing one).

Highlight a format and click the Deletebutton to remove it.

Editing the imported transactions

Once imported, the transactions can be edited in the list. Typically this will
involve specifying a correct allocation code for those transactions that couldn’t
be allocated automatically. You cannot change the amount of a transaction here
(it is after all on your bank statement), and nor can you add new transactions.

To change the allocation code: Click in the Accountfield (or use the tab key),
and type in the correct account code. If you delete the account code, or
enter an invalid one, the account choices list will be displayed when you
attempt to move out of the field, allowing you to select an account code.

To make a split allocation: A split allocation is where the transaction is coded to
more than one account code. Simply change the amount to be allocated to
the first account code, and press tab. A new line is inserted containing the
balance of the transaction. Change the allocation code on this to the
desired code.

In this example the date is of the form yyyy/mm/dd, so we would set the
date format pop-up to use that form.

Note: Don't worry about the date delimiter (it might be a slash, a dash or a

dot), MoneyWorks will use whatever is in the actual data. The important
thing is that it knows the order of the day, month and year.

Note: Some statements might have the sign of the transaction reversed (for
example some credit card statements). In this case set the Reverse Sign
option, otherwise your payments will appear as receipts.

Once you have the fields aligned, and the heading row and date options set
correctly, click the Savebutton. You will be prompted for a name for the saved
format.

5. Click the Importbutton to import the csv file.

To split the amount ...

Important: As we have seen, bank csv files can contain more than just

transaction data. The Generic CSV will skip any records which have fewer
fields than the highest field number in the import settings. If the Has
Heading Rowoption is on, the first eligible record is also skipped.

Note: Lines in the text file that are missing a date or an amount will be skipped

(it appears that there are some really weird bank formats!).

... key in the part allocation amount ...

Saved Formats

Previously saved formats are displayed in the top, left list. Just click the format
to use, then click Importto load the data.
Importing Bank Statements

To change an existing auto-allocation rule: Click on the Edit Rules toolbar

button to display the list of existing rules, and double click on the rule that
you want to modify.

To omit (skip) a transaction: Imported transactions can be omitted by clicking in
the Status column. The status will be shown as Skip, and the transaction will
be greyed out. Any splits made to the transaction are cleared. Click the
status column again to have the (unsplit) transaction included.

Allocating against invoices

In MoneyWorks Gold and Express, if the transaction is for payment against an
already entered invoice, you must not allocate it to a general ledger code.
Instead you need to indicate which invoice(s) to mark off as being paid:

1. Enter the debtor code (for deposits) or the creditor code (for payments)

into the Name column, and press tab

If you can’t remember the code, type “@” and press tab to display the
Choices list. This will also be displayed if you have entered an invalid code

If the transaction is a withdrawal: The Allocate Payment window is shown:

Cash Transactions

... and press tab to insert a new row

Repeat the process if there is more than one split.

To delete a split allocation: Select a field in the line to be deleted by clicking on

it (or tabbing to it), then click the Delete Splittoolbar button. The line will
be deleted, and the allocation amount added to the previous line. Note that
you cannot remove the original line, as this would have the effect of
deleting the transaction.

To change the Ref, Date, Payee or Memo fields: For speed of entry, pressing the
tab key will only take you through the Accountand Amountsfields, as these
are the ones that you will normally be changing. You can edit some of the
other fields by clicking in them. The fields with blue text (such as deposit
and withdrawal) cannot be altered.

To create a new auto-allocation rule: Select the text in the line (in the payee or

memo fields) that is the basis for the rule, and click the New Ruletoolbar
button. A new Auto-allocate Rule window will be displayed — see Setting
up an Auto-Allocation for General Transactions. The percentage amounts
and allocations in this new rule are based on the information in the current
transaction, so if you have already split and allocated, the new rule will by
default respect this allocation. If necessary, modify the percentages and
codes, and click OKto save the new rule. Note that you need to apply the
new rule yourself (see below).

To apply an auto-allocation rule: With the cursor in the line to
which you want the rule applied, click the Apply Rule icon,
or press Ctrl-U/⌘-U. The rule applied (if any) will be
displayed as a coach tip in the bottom right of the
Statement Coding window. Transactions that have been
auto-allocated have a status of Auto.

Use Apply Ruleto
use an auto-
allocation code
Cash Transactions

Importing Bank Statements

Allocate the payment to the appropriate invoices in the normal manner see
Paying Creditors Individually.

If the transaction is a deposit: The Allocate Receipt window will be displayed:

To alter an allocation to invoices:~Click the word <Invoices>in
the account field. The Allocation window will open allowing
you to alter the allocation.

To clear the allocation of invoices: Delete the code previously entered into the
Name Code field. The normal allocation code will be shown, and the
transaction will no longer be applied against invoices.

Auto-Reconcile

The Auto-Reconcile facility is a convenient way to speed up your bank
reconciliation, in that it identifies new transactions imported and (because they
agree with the bank statement), marks them as being correct for reconciliation
purposes. Existing transactions are marked to be omitted, so will not duplicated.

Note: The Auto-Reconcile option must be set before the Load
Statement File button is clicked. If you get it wrong, set
(or reset) the option, and click the Load Statement File
button again.

Important: Using Auto-Reconcile is not a replacement for

doing your bank reconciliation. You should still complete
the bank reconciliation process.

Determining if a transaction exists

To determine if a transaction on the bank statement already
exists, MoneyWorks does the following:

With the Auto-
Reconcileoption
on, new
transactions are
marked with a tick,
indi- cating they are
correct for
reconciliation
purposes. Existing
transactions are
marked Skipand
are greyed out.

• If a single transaction is found in MoneyWorks with the same date, amount
and reference (e.g. cheque number), the imported one is marked to be
omitted, and the existing one will be marked as reconciled.

• If more than one transaction is found with the same reference number,
then provided one of them has the same date and the same value, it is
marked as being reconciled.

Allocate the receipt to the appropriate invoices in the normal manner —
see Receiving Payment for Sales Invoices, allowing for any prompt payment
discounts that may have been taken. Any unallocated amount will be
treated as an overpayment.

2. When the allocation is complete, click the Applybutton

The allocation window will close allowing you to continue processing your
bank statement. The allocation account will show as “<Invoice>”.

It is important to realise that you have only marked the invoices for payment.
There is nothing to stop another user paying the same invoice (or even
cancelling it) while you are processing the remainder of the bank statement. If
this happens you will be alerted when you attempt to Accept the Bank
Statement, and you will need to redo your allocation for the affected
transaction(s).
Cash Transactions

Fine tuning the Auto-Reconcile

Omitted transactions are marked “Skip”. Clicking on “Skip” will cause the
transaction to be included.

Transactions marked for reconciliation are ticked—you can mark a transaction
not be reconciled by resetting the tick.

Cautionary notes

Importing your bank statement makes for easy entry of cash transactions, but:

• Unless you have a mechanism for checking your transactions, you are

relying on the bank having processed the transactions correctly...and we all
know that banks never make mistakes.

• If you are entering all your transactions into MoneyWorks, your accounts
will be largely up to date. Importing your bank statement means you may
have to delete transactions that were previously entered, unless they can
be successfully matched. There is considerable scope for having duplicate
transactions if you are not careful.

• You still need to do your bank reconciliation!

Bank Feeds

A bank feed is an automated way to obtain statement transactions from your
bank's website. Instead of manually downloading your bank statement and then
importing it, MoneyWorks can use an aggregation service to fetch the
transactions for you with one click.

Some important points about Bank Feeds:

• Bank Feeds are provided through MoneyWorks in partnership with Yodlee/
Envestnet, a US company whose business is providing bank information. As
such there is an added fee for using Bank Feeds in MoneyWorks;

• To access your bank account, you will need to provide the logon details for
your bank account. There is an element of risk in doing this, and banks
frown about sharing these details (although it could be argued that,
because banks don't make the service available themselves, they are
actively encouraging such sharing).

Bank Feeds

• MoneyWorks does not see or store your bank login details—these are all

managed by Yodlee. However if a third party gets hold of your MoneyWorks
file they will be able to see your bank transactions. For this reason your
MoneyWorks file must be password protected for you to use bank feeds.
• Cognito Software Ltd has taken every care to protect your bank feed data
and neither it nor Yodlee will be responsible for any losses or damages
caused directly or indirectly through the use of Bank Feeds.

• At present Bank Feeds are only available in Australia and New Zealand.

Other jurisdictions will be added later.

Linking a bank account with a MoneyWorks GL bank
account

Before you can use bank feeds you need to link your MoneyWorks bank account
to the corresponding real bank account. To do this:

1. Choose Command>Load Bank Statement

The Statement Coding window will open

2. Select the MoneyWorks Bank Account to link in the Bankpop-up menu

3. Set the Source pop-up menu to Bank Feeds

If you have not previously used Bank Feeds, the button will change to Set up
Bank Feeds.
Cash Transactions

4. Click the Set up Bank Feedsbutton

If you have not used bank feeds before for this company, you will be asked
to subscribe.

Bank Feeds

The first month is free. After that you will need to attach a credit card to
your bank feed subscription.

5. Follow the steps on screen to make your account.

Once your account is successfully created the Bank feed accountswindow
will be displayed. This will be empty as this is your first linked account.

7.

If you are not using an Australian bank, or the bank is not listed, click the
Don't see your instituion? Search herelink at the bottom of the page.

A search window will be displayed. Key in the bank name (e.g. ASB, BNZ,
Westpac) and select the bank from the list selected (make sure the URL of
the bank is for your country).

8. The Yodlee Log In window will be displayed

6. Click the Link New Accountbutton

The Yodlee bank account selection will open, listing the main Australian
banks

9. Enter your bank login and password
Cash Transactions

Bank Reconciliation

Yodlee will retrieve your security information. This might take some time.

Bank Reconciliation

Periodically you will receive a bank statement from your bank. You need to
check that this agrees with the information that you have entered into
MoneyWorks. This is called a Bank Reconciliation.

It is important that you do your bank reconciliations. If you don’t, your
accountant will do them (and charge you accordingly).

Any MoneyWorks bank account can be reconciled, provided the Bank Account
must be Reconciledoption is set in the account record — see Bank Settings.
Thus you can use this feature for your petty cash, credit cards etc.

1. Choose Command>Bank Reconciliation

The Bank Reconciliation dialog box will be displayed.

10. All being well, a list of your accounts at that institution will be displayed.
Select the bank account that corresponds to the MoneyWorks bank
account.

The Link Bank Account windowwill close and the account will be displayed
on the Bank feeds accountlist.

11. Click Get Transactionsto bring in the newest bank transactions

Note: You may get a warning message from your bank when you sign up. They
are alerting you to a possible unauthorised use of your bank account.

Using Bank Feeds

Once the bank account is linked, you bring in new transactions by choosing
Command>Load Bank Statement, selecting the relevant bank account, and
clicking the Fetch Transactionsbutton.

From time to time, additional authentication may be required, in which case a
window will pop up to obtain a current password or answer to a security
question for the account. When this happens, fill in the required information,
click close, and then wait a few minutes for the bank site to be revisited before
clicking Get Transactions again.

Notes:

• Auto-allocation rules will be applied to downloaded transactions;
• Only the latest three months of transactions are available. If you want older
transactions you will need to download the corresponding bank statement;

• The bank transaction data is updated daily. There is no point in trying to

download new transactions using bank feeds more than once a day. If you
want verification that a customer has paid you within the last hour, you will
need to log into your bank's web site.
Cash Transactions

2. Choose the bank account to be reconciled from the Bank

pop-up menu

All the reconcilable bank accounts7 in your system appear
in the pop-up menu. If you choose Other, you will be able
to select any account for reconciliation.

Choose the Other
option to reconcile
an account that is
not a bank account.

3. Enter the statement date as it appears on the statement

Transactions dated after this will not show in the reconciliation.

4. Enter the statement number from the bank statement

Each page of your bank statement should be reconciled separately.

5. Enter the closing balance for this page of the bank statement

This will be found on the bank statement.

The Opening Balance is automatically maintained for you based on the
previous reconciliations. You should never (and we mean never, never,
never!) need to change it—if you do (and you can accomplish this by
clicking the Changebutton), you have probably missed out a reconciliation
or made some other error.

6.

If you have not yet posted some of the transactions that are to be
reconciled, set the IncludeUnposted Transactionscheck box

If this is set, MoneyWorks will display unposted as well as posted
transactions in the bank reconciliation list— see Reconciling Unposted
Transactions.

7. Click Reconcileto start the reconciliation

The Bank Reconciliation window is displayed. This is divided into two panes:
reconciled transactions in the top pane, and all eligible transactions in the
bottom. Eligible transactions are those (normally posted) payment, receipt
and journal transactions against the nominated bank account which
occurred on or before the statement date, and which have not previously
been reconciled.

Bank Reconciliation

To mark a transaction as having been reconciled, locate it in the bottom pane
and click on it—the transaction will be listed in the top pane (and greyed out in
the bottom pane).

Note: If you have imported your statement with the Auto Reconcileoption set,

the imported transactions will already be in the top pane.

The bottom pane consists of a normal MoneyWorks list that you can sort and
customise in the usual manner — see Sorting Recordsand Customising Your List.
It will most accurately approximate8 the order on your bank statement if sorted
by date.

The Bank reconciliation window has two “modes” of operation, Reconcile and
Select. In the Reconcile mode, you can mark transactions as being reconciled (or
not); in the Select mode you can open transactions for viewing or, if they are
unposted, modification. You can also add transactions. When the Bank
Reconciliation window first opens it will be in Reconcile mode.
Cash Transactions

8. Click on each transaction (in the lower list) which appears in the

statement

The transaction will be appended to the list in the top pane, and the one in
the bottom will be greyed out, and a face icon placed in the OK column (it
will be smiling if it was a receipt).

Bank Reconciliation

You should start at the top of the bank statement and work systematically down.
Note that the top pane contains a running balance which you can compare with
that on your bank statement.

Reconciled transactions are added to the Amount Processed which is shown in
the summary area at the bottom of the top pane. This is the total of the marked
movements in and out of the account.

This total is subtracted from the opening balance entered in the first stage of
the reconciliation and checked against the closing balance for the current
statement page. Any discrepancy appears as the Differencefigure in the
summary.

9. When the reconciliation is complete (i.e. the Differencefigure is zero),
click the Printbutton to print the bank reconciliation summary report

This lists the opening and closing bank balances, the reconciled transactions
and the unpresented cheques. It should be filed with your bank statement
as proof that your accounts match the bank’s.

Pressing Ctrl-P/⌘-P will print all the transactions listed in the dialog box
without any summary data.

10. Click Finaliseto complete the reconciliation

Any unposted transactions that you marked will be posted. The marked
transactions will not appear in future reconciliations. Clicking Cancel discards
the reconciliation—you can come back and do it later.

You will be prompted if you have not printed the summary report.

To unmark a transaction, click on it again (in the lower pane).

Reconciling a batch of transactions

Tip: Although you can’t sort the top list, you can drag the transactions up and
down. This means that you can (if you wish) get them into the same order
as they appear on the bank statement.

Tip: You can use the up and down arrow keys and the space-bar to accomplish

the reconciliation from your keyboard. The arrow keys move the current
selection (identified by dotted lines) up or down; the space-bar marks the
record as being reconciled (or unreconciled if it was already reconciled).
Sometimes what is represented as one transaction on your bank statement is in
fact made up of several individual transactions in MoneyWorks. For example,
depending on your bank, a creditor payment schedule submitted electronically
to the bank might appear on your bank statement as just one payment instead
of one payment per creditor.



Cash Transactions

Bank Reconciliation

For bank reconciliation purposes, transactions with the same value in the
Analysisfield can be treated as a “group” or batch of transactions (which is why
you can enter a batch number as the final step in an electronic payments run).

A reversing transaction will be created and posted for you — see Cancel
Transaction. You will then need to re-enter the transaction with the
appropriate changes (see below)

You can reconcile such a group of transactions with a single click by holding
down the Optionkey (Mac) or the Ctrland Altkeys (Windows) when you click on
one of the transactions in the group. MoneyWorks will prompt you as to
whether you want to reconcile just the transaction you clicked, or all the eligible
unreconciled transactions with the same value in Analysisfield:

Click Mark Groupto reconcile all transactions with the same analysis code, or
Just this oneto just reconcile the clicked transaction.

If a transaction has been entered incorrectly

1. Click on the Selecticon to change the mode

You can add and modify (unposted) transactions in this
mode. You can also cancel posted transactions and re-
enter them.

If the offending transaction is unposted, double click it,
make any changes, and click OK

Clicking Select
allows you to add
or change
transactions.

If the offending transaction is posted, highlight it and click the Cancel
toolbar icon

2.

3.
4. Click the Reconcilebutton to return to reconciliation mode

If the transaction is missing

If you have not put the transaction in, you can do so at this point. However
before you do this, you should check that the transaction has not really been
entered already. Specifically, it might be entered against the wrong bank
account, or with an incorrect date (both of these will prevent it showing in your
reconciliation list). To check this, you may have to click the Finish Laterbutton to
leave the reconciliation and try to locate the transaction in the Transaction list.

To create a new transaction while doing a bank reconciliation:

1.

If you are not in the Select mode, click the Selectbutton

2. Click the Newtoolbar button

3. Choose the appropriate transaction type from the Typemenu

4. Enter the transaction in the normal way

It is very important to ensure when you enter the transaction that it is made
out against the bank account you are reconciling and that it is dated
correctly (before the statement date), otherwise the new transaction will
not appear in your reconciliation list.

Reconciling Unposted Transactions

Unposted transactions will be included in the bank reconciliation if you set the
Include Unposted Transactionscheck box in the bank reconciliation setup. If you
have marked any unposted transactions as being reconciled, an alert will be
displayed when you click the Finishbutton.



Cash Transactions

Bank Reconciliation

If you click Proceed, MoneyWorks will attempt to post the transactions. If for
some reason it can’t, a warning will be displayed and you will not be able to
finalise the reconciliation. Instead you should save it, correct the problem, and
repeat the reconciliation.

Any unposted transactions that were not reconciled will be listed at the end of
the bank reconciliation report.

Saving a Reconciliation

If you want to interrupt a bank reconciliation session and return to it at a later
time, you can save the reconciliation.

1. To save the state of the reconciliation after reconciling part of your bank

statement, click the Finish Laterbutton

The bank reconciliation window will close. When you next use the Bank
Reconciliation command, the transactions that you previously reconciled
will still have the face next to them.

MoneyWorks remembers the opening and closing balances, statement number
and date that you last typed into the Bank Reconciliation setup dialog box and
fills in these values for you when you next choose the Bank Reconciliation
command. This saves you from retyping these values when returning to a saved
reconciliation.

Reviewing and Reprinting a Previous Reconciliation

To reprint a previously completed reconciliation report:

1. Choose Command>Bank Reconciliation

The Bank Reconciliation settings window will open.

2. Choose the bank concerned from the Bankpop-up menu

3. Click the Load Old...button

The Choices window will open, listing previous
reconciliations9.

Click Load Oldto
view a previous
Bank Rec.

4. Double-Click the reconciliation of interest, and click View

The reconciliation window will open, showing the transactions reconciled
previously and any unpresented items. You cannot modify this.

Clicking the New button will start a new reconciliation.

5. Click Print Summaryto reprint the Reconciliation report

Note that the unpresented items in the reconciliation report may include
transactions entered since you did the original bank reconciliation. Also, the
reconstituted bank reconciliation will not be correct if any of the original
transactions have been purged.

Problems with Bank Reconciliations

In principle the bank reconciliation is simple and foolproof. However in practice
things may not work out quite so easily. The most common problems with bank
reconciliations are:

A transaction is not being shown

The bank reconciliation list displays only transactions against the nominated
bank account that are dated on or before the statement date and have not
previously been reconciled. Therefore you need to locate the transaction in the
Transactions list (not in the Bank Reconciliation list) and check its date and bank
account number (which you can do by double clicking it if the information is not
visible in the list), and also whether it has been previously reconciled (use the
<EquationVariables>Get Info</EquationVariables>) command to do this.
Cash Transactions

Bank Reconciliation

If a receipt shows “Banked on Banking Journal” next to the receipt number (you
need to double click it to see this), it was originally entered against a bank
holding account. Hence the transaction itself will not be reconcilable, but the
banking journal will.

If you cannot locate the transaction, it probably hasn’t been entered.

A transaction is shown that has already been reconciled

If a transaction that you know you have already reconciled is showing in the list,
then you are clearly mistaken, and you have not previously reconciled the
transaction (MoneyWorks would not lie to you). You have almost certainly
entered the transaction twice, and have reconciled one of them but not the
other. Confirm that the transaction is not in the list, and cancel the unreconciled
one (use the Get Infocommand to see which is not reconciled.)

The Difference calculation is zero, but it doesn’t agree with the
ledger balance

There are at least two possible causes of this:

The first is that the opening balance that was used was incorrect. Check this
against your bank statement. If it was incorrect, save the bank reconciliation,
start another bank reconciliation and use the Change button to alter the
opening balance. However you should ask yourself why MoneyWorks had an
incorrect opening balance (perhaps you’ve missed out a statement, or you did
not set an opening balance for this account when you set up MoneyWorks).

The second is that, in previous reconciliations, transactions have been
reconciled that shouldn’t have been, or transactions weren’t reconciled that
should have been. You will need to look at your previous reconciliation reports
to find where the error first appeared, and then decide how to fix it. The most
common cause of this incidentally is not reconciling the original opening bank
balance that was entered— see Manually Entered Bank Balances.

Tip: The Bank Reconciliation Statusreport (in Reports>Audit) lists the

reconciliation status and (optionally) history of all active bank accounts. Use
this to determine whether previous reconciliations were completed
correctly.

Clearing Old Bank Reconciliations

When things have gone seriously wrong with a prior bank reconciliation (despite
the warnings that MoneyWorks provide, people do insist on trying to force the
bank balances), it is sometimes easier just to clear the old bank reconciliations
and redo them. To clear old bank reconciliations:

1. Select the bank reconciliation that you want to clear using the Load Old

button as described in Reviewing and Reprinting a Previous Reconciliation

2. Click on the Cog button that appears, and select Clear all reconciliations

from this one

You will be asked for confirmation. Note that all subsequent reconciliations
done against that bank account will also be cleared.

3. Check that the Date and Closing Bank balance are correct, and continue

the reconciliation in the normal manner

Presumably you will attempt not to repeat whatever mistakes were made in the
previous attempt.

1 Including a holding account.↩

2 Invoices are not available in MoneyWorks Cashbook.↩

3 When the bank processes this transaction they will do the opposite, debit the
source account and credit the destination account. When you deposit money with
the bank, it a liability for them, so they record it as a credit. However it is an asset
for you, so you record it as a debit. Confused? That’s why we have accountants.↩

4 A banking journal is a special type of general ledger journal. It credits the bank
holding account and debits the nominated bank account(s).↩
