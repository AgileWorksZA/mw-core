# Transactions

Transactions

Transactions

Accessing and Viewing Transactions

Entering and tracking transactions is done using the Transactions list window.
This gives access to all transactions stored in the system.

To view the Transactions list:

1. Choose Show>Transactions or press Ctrl-T/⌘-T

Some of the commands in the Navigator will also take you to this list
(normally in preparation for some further operation).

2. Click on the view in the sidebar to choose which transactions to display

The left-arrow key moves to the next view; right-arrow to the previous view.

Tip: Since you can have a lot of transactions (more than seven
years worth), you may wish to use the list filter to limit
the display. You can also create your own filters —see
Creating Filters.

Tip: Press the esc key to return you to the view in which you

last highlighted a transaction.

Viewing Transaction Lines

A single transaction might be made up of one or more lines (termed “Detail
Lines”). When you look at the transaction list you see the transaction header
information, not the information on the detail lines (double-clicking a
transaction will show you these).

There is a separate list in MoneyWorks Gold that shows the details lines (and
associated transaction header information). To access this list:

1. Chose Show>Detail Line Items or press Ctrl-Shift-T/⌘-Option-T

The Detail Line Items list will be displayed.

The transaction list is organised into different views, each one displaying
different collections of transactions. The views are listed in the sidebar on the
left of the window1—clicking on one of these will cause the transactions in that
view to be displayed.

You can add transactions to the list by clicking the New toolbar icon, or pressing
Ctrl-N/⌘-N. Where possible the new transaction will be the same type as is
natural to the current view in the list, but you can change the transaction by
using the Type pop-up menu.

Tip: You can create a new transaction at almost any time by pressing ⌘-option-

N (Mac) or Ctrl-shift-N (Windows). The proviso is that there must not be a
modal window open (such as an alert box or something like a bank
reconciliation).

You can scroll through and manipulate the transactions in the list in the normal
manner —see Working with Lists. For example use Page Upand Page Downkeys
to scroll the list up and down a page at a time; use the Homekey to scroll to the
top of the list; use the Endkey to scroll to the bottom of the list.

Note: You can also view a list of the detail lines that make up the transactions.

See Viewing Transaction Lines.
Transactions

The Transaction Entry Window

This shows every line of every transaction; system lines (which don’t show in
transactions) will have the account code displayed in italics.

If you select the By Itemview, only those lines that use items will be displayed.

The list can be customised, sorted, printed etc. in the normal way —see Working
with Lists; double-clicking a line will show the originating transaction.

The Transaction Entry Window

Transaction Toolbar

Transactions are entered through the transaction entry window. For non-
journals, the window has the following general appearance (it will vary slightly
depending on the transaction type).

Along the top of each transaction window is the transaction toolbar.

Transaction Type: A pop-up menu allowing you to set the type
of a transaction. If you change the type, any existing
information in the transaction will be discarded. You can
change the type by using a keyboard shortcut. On the
Mac press Shift-Ctrl-1 for Payment2, Shift-Ctrl-2 for
Receipt etc. On Windows press Shift-Alt-1, Shift-Alt-2 etc.

Reverse: Clicking on this will reverse the signs on the

transaction (so an invoice will become a credit note for
example). Click it again to reset the signs.

Use the Typemenu
to change the type
of the transactions.
This should be done
before entering any
information.
Transactions

The Transaction Entry Window

Info: Click this to display the Get Infowindow on the transaction. This window
displays information about the transaction, such as who entered it and
when, the time posted, if the transaction has been reconciled or (for
invoices) paid.

Fields: Clicking on the Fields icon will display a pop-up menu

that allows you to change the number of entry fields in the
transaction entry screen.

Simple: The minimum number of entry fields

Show Analysis Fields: Shows the analysis, flag and Salesperson fields

Add Note: Click this to add a Sticky Noteto the transaction. The Note will be

displayed whenever the transaction is opened.

Hold: If the hold box is checked you will not be able to post the transaction. Set
this if you are unsure whether or not the transaction is correct to avoid
posting it incorrectly.

Make Recurring: Setting the Make Recurringcheckbox or clicking on the Setup
button opens the recurring transaction window, in which you can make a
transaction into a recurring transaction (i.e. one that will automatically self
generate at future points in time—see Recurring Transactions. The recurring
properties can be altered even after the transaction has been posted.

Source Image icon: Used to add, view or delete a source image for the

transaction — see Storing Source Images. This could be a scanned invoice, a
photo or whatever. Not available in MoneyWorks Cashbook.

Show Some User Fields: Shows the first three user fields.

Transaction Fields

Show All User Fields: Shows all the available fields.

Note that the behaviour of the fields can be modified by the use of Custom
Validationsand other field attributes.

Transaction Date: The date on which the transaction occurred. Changing this

will change the period (see below), and also affects the bank reconciliation
and GST/VAT reporting (but not sales tax reporting).

Period pop-up menu: The period menu is used to determine what period the

transaction will affect in the general ledger. It contains a list of available
periods (open and unlocked), and will automatically change whenever the
Transaction Datefield is altered to the period that corresponds to the date.
Transactions

The Transaction Entry Window

If for some reason you need to post a transaction into a period that is
different from its date, you can set the period using this pop-up menu after
entering the date into the Transaction Date field.

Analysis: The analysis field is used to tag a transaction in any manner you

choose (for example, a batch number, the initials of whoever entered the
transaction, some code that you can used to analyse transactions). It can be
up to 9 characters long, and can be changed even after the transaction has
been posted.

Salesperson: The Salesperson field can be used in a similar manner to the

analysis field, or in MoneyWorks Gold it can be used to automatically assign
a Department code to item transactions —see The Salesperson Field. The
field can contain up to five characters (the maximum length of a
department code). If you type an “@” into this field and press tab you will
get the Department Choices list.

Description: This contains details of what the transaction was for, and is

appended to the ToFrom field (in parentheses) in the Transaction List
window. It can contain up to 1000 characters. You may want to put a short
memo here for your own edification, or, for invoices, you may want to use
this field to describe in detail the services rendered and have it appear on
the invoice. The field can be altered after posting.

Amount: The total amount (Tax inclusive) of the transaction. The total of the

gross column in the details lines must match this before the transaction can
be accepted.

In some types of transaction (preparing a sales invoice for example) you will
not necessarily know the total amount of the transaction until after all the
detail lines are entered. MoneyWorks will normally automatically calculate
the transaction Amount for sales for you. You can change this behaviour for
a particular transaction type by setting the Auto-Calculate Transaction Total
options in the Document preferences.

Transactions whose
flag field is non-
empty are
identified by a flag
in the transaction
list.

Flag: The flag field is used as a reminder field for the operator,
and can contain up to five characters. Transactions with a
non-empty flag field are identified in transaction lists by a
flag symbol in the Status column. The flag field can be
changed even after the transaction has been posted.

Colour: Use the colour pop-up menu to set the colour of the
transaction. How the colour option is used is up to
you—you might have all purchase orders in green, overdue accounts in red
and so forth. The colour can be changed even after the transaction has
been posted. You can also use the Set Colourcommand in the Commands
menu to change the colour for a set of highlighted transactions. The colour
names can be changed in the Document Preferences.

User1, User2, ... User8: These fields are available for your own use. They can be
relabelled (in the Document Preferences—see Fields), and can be altered
after posting.

To or From: The Tofield contains information about who the transaction was
made out to. In receipts and creditor invoices, the field is labelled From3.
This field is displayed in the Transaction list, with the transaction
Description field appended in parentheses.

Tip: Click on the total of the detail lines (at the bottom of the

Gross column) to transfer this amount into the Amount
field.

Note: If you have entered a code into the transaction’s Name
field (Supplier, Creditor etc.), and if that Name has a
Default Allocationassociated with it, the allocation on the
detail lines will automatically alter whenever you change
the Amount field.

Deposit: The deposit is for invoices and

orders only. Check the deposit box if a
deposit is being made. Invoices with
deposits will be posted automatically
and you will be prompted for the details
of the deposit, including the amount
and the bank account—see Receiving a
Deposit.

Set the deposit
option to record a
deposit made on a
debtor invoice or
order.

Paid By: For receipts and payments only, set the pop-up menu
to the type of receipt (or payment) made—cash, cheque,
credit card etc. Cash transactions are totalled and do not
appear individually on the bank deposit slip—see The

Set the receipt or
payment type in
Transactions

Transaction Entry

Banking Command. The payment method names can be
changed in the Document Preferences.

the Paid Bypop-up
menu.

Entering a Transaction

New transactions can be entered either through the Transactions list window or
through the Navigator.

The transaction will
be automatically
posted if the post
option is set.

Note: Transaction entry is non-modal, allowing you to have several transaction

entry windows open simultaneously. It is up to you to manage this—prior to
MoneyWorks 6, only one transaction window at a time could be open.

Post and Print Options: You can set the transaction to be

automatically posted on completion by clicking the post
icon. When you click on this, a post icon (small envelope)
appears on the Next, Previousand OKbuttons. If you click
on the icon again, the option will be turned off and the
transaction will not be posted (the icons will disappear off
the buttons). See Posting Transactions.

If you click on the Printer icon, a print icon will be
displayed on the Next, Previous and OK buttons and the
transaction will be printed (using the nominated form)
when it is accepted. See printing transactions using forms.
Clicking the print icon again will turn off the option.

The transaction will
be automatically
printed if the print
option is set.

When entering more than one transaction, turning these options on will
cause only that transaction to be posted/processed or printed. The option
will be reset when you accept the transaction. To make an option stay on,
double-click the icon—it will go black. Clicking it again will turn it off.

by Account/By Item/Payment on Invoice:

Set the tab to specify whether the transaction is to be coded
to the general ledger, or is for an item, and hence what information can be
entered into the detail lines. The Payment on Invoicetab (not available in
MoneyWorks Cashbook) is only available if you have entered a debtor/creditor
code into the customer/supplier field.

Detail Lines: The detail lines contain information about the allocation of the

transaction Amountto the different accounts or items. At least one detail
line must be completed for each transaction—see Entering Detail Lines.

Transaction Entry

New Transactions in the List Window

To enter a new transaction through the Transactions list window, it must be
front-most.

1. Choose Edit >New <Transaction>4 or press Ctrl-N/⌘-N or click the New

toolbar button

A new transaction entry window will open. The type of transaction is
determined by the current tab in the transaction list. If it cannot be
determined it will default to Receipt.

2.

If the transaction is not of the desired type, choose the
correct type from the Type menu

Note that changing the type of transaction will clear the
transaction of any information you may have entered.

The transaction entry window of the nominated type will
be displayed.

Tip: You can change the type by using a keyboard shortcut. On
the Mac press Shift-Ctrl-1 for Payment, Shift-Ctrl-2 for
Receipt etc. On Windows press Shift-Alt-1, Shift-Alt-2.

New Transactions in the Navigator

Use the Typemenu
to change the type
of the transactions.
This should be done
before entering any
information.

This section describes, in general, how to enter a normal transaction. Specific
details of transaction entry for individual transaction types are explained
separately for each type later in this chapter. This section is primarily concerned
with entering transactions details either by account code or by item code.

To enter a new transaction through the Navigator, click the
appropriate New button. Depending on the button, the
transaction entry screen may open or you might be taken to
Transactions

the appropriate transaction list view and prompted by means
of a coach tip to use the appropriate command.

New button in
Navigator

Clicking the Address Disclosure control again will hide the address fields.

Transaction Entry

New Transaction from almost anywhere

You can create a new transaction at almost any time by pressing ⌘-option-N
(Mac) or Ctrl-Shift-N (Windows). This will not work if there is a modal window
(such as the Bank Reconciliation) or an Alert displayed.

Delivery and Mail Addresses

Sometimes you will be asked to deliver items to a different address than that of
your customer, or send the invoice (or receipt) to a different address.
MoneyWorks allows you to specify a mailing address and a delivery address with
each transaction—these will default to that of the customer or supplier, but can
be overridden if need be.

Viewing the Address Fields

To see the mail and delivery details in the transaction entry window:

1. Click the Address Disclosure control next to the To/From field

The address fields will be displayed:

These will show the address details from the Name record, or if there is no
Name record will be empty. If the customer is a branch of a head office, the
Mail address will be that of the head office, and the delivery address will be
that of the branch. For purchase-oriented transactions (Payments, Creditor
Invoices, Purchase Orders), the delivery address defaults to your own
delivery address taken from the Company Setup.

Changing the Mailing Address

To change the Mail field:

1. Click the Mailcheckbox

The Mail field will be enabled, allowing you to type a new
postal address into it. Use the return key to split the
address over more than one line. Use the tab key to move
to the next field.

Set the Mail check
box to change the
Mail address.

Changing the Delivery Address

To change the Delivery Address field:

1. Click the Deliver Tocheckbox

The Delivery Address field will be enabled, allowing you to
type a new address into it. Use the return key to split the
address over more than one line. Use the tab key to move
to the next field.

Set the Deliver To
check box to
change the Delivery
address.

Note: Any changes you make to the address fields are not permanent and apply
only to the current transaction. If you want to make the change permanent
you need to change it in the corresponding Name record.

Note: Do not check the Mail or Deliver To check boxes unless you actually need

to change the address from that shown. If the check box is on, MoneyWorks
will save a copy of the address with the transaction regardless of whether
you have changed it or not, which is just a waste of your disk space.

Note: Custom forms will need to use the Transaction.MailingAddressand

Transaction.DeliveryAddresspseudo-fields in order to print the correct
addresses on statements, invoices and other forms.

Drop Shipping
Transactions

Transaction Entry

To order goods from a supplier and have them shipped to one of your
customers, click the Deliver To button to the right of the Delivery To address.
The Names choices will be displayed, and the delivery address of whoever you
select from this will be inserted into the transaction delivery field.

Entering Detail Lines

The total amount of the transaction needs to be allocated to one or more
accounts. This allocation is done in the detail lines of the window. Although
entering into detail lines is the same for cash and invoice transactions (see
below), each transaction type has a slightly different set of fields to be filled in at
the top of the transaction entry window.

clicking the tab for that method

The detail line section of the transaction entry window will change to reflect
the method you have chosen.

MoneyWorks will remember the selected entry method for each transaction
type. If you always use the By Itementry method for your invoices and By
Accountmethod for everything else, you will only need to select the method
once for each transaction type.

Tip: You can resize the columns in a transaction by positioning
the cursor between the columns in the column headings
(the cursor will change shape), and dragging.

For Payments see Entering Payments.

For Receipts see Entering Receipts.

For Debtor Invoices see Entering Sales Invoices.

For Creditor Invoices see Entering a Purchase Invoice.

For Purchase Orders see Entering a Purchase Order.

For Quotes and Sales Orders see Entering a Sales Order.

By Account detail line entry

Resizing columns in
the transaction
window.

For Stock Journals see Entering a Stock Journal.

For General Journals see General Ledger Journals.

In general there are two sorts of detail lines, which can be entered:

• By entering account codes directly; or
• By using item codes together with a quantity (and optional discount). The
account codes used in this case are the control accounts specified for each
item.

MoneyWorks uses the terms By Accountand By Itemfor these two methods of
detail line entry. You choose which method of entry you wish to use by choosing
the appropriate tab in the transaction entry screen.

1.

If the desired transaction entry method is not already selected, select it by

By Item detail line entry

These are the two detail line formats for item entry and account entry. The Item
entry method has fields for Item Code, Quantity, Description, Unit Price, Units,
Discount, Extension and Tax Code (and, optionally, tax amount). The Subtotal,
total tax and grand total are shown below. The Account entry method has fields
for Account Code, Account Name (display only), Description, Net Amount, Tax
Code, tax and Gross (tax inclusive) Amount. If the Show Job Columnpreference
option is set, both entry methods include a Job Code field.
Transactions

Transaction Entry

2. Click in the first column of the detail line, or press Ctrl-Tab (Mac) or Ctrl-`

(Win5) or just tab through all the header fields

When you press the Tab key, the account name and tax rate will be entered
for you.

MoneyWorks automatically creates one detail line whenever a transaction
is created. You can add more if you need to.

Now follow the steps in Entering Account Detail Lines or Entering Item Detail
Lines as appropriate.

If you leave the account field blank, or type an incorrect or incomplete one,
the account choices window will open —see Entry and Validation where a
Code is Required. Select the account you require by double-clicking on it.

If the account has a Sticky Noteassociated with it that is applicable to this
type of transaction, the note will be displayed when you exit the field.

Auto-Allocation

Detail Description

If you have set up Auto-Allocation accounts, the detail lines for By Account
transactions will be created for you automatically:

For Name Auto-Allocation When you start to enter a value into the transaction
Amount field for a transaction against a Name with an Auto-Allocation
—see Default Account;

For Manual Auto-Allocation Click the Auto-allocation icon or
press Ctrl-U/⌘-U after having entered both 1) the match
text into either the Toor the Descriptionfields and 2) the
Amount of the transaction —see Setting up an Auto-
Allocation for General Transactions.

Entering Detail Lines by Account

2. Enter a description for the monies pertaining to this account into the

Description field

The description can be up to 1000 characters. If you need to start a new line
(i.e. insert a “carriage return”), press Ctrl-↩/Option-Return6. If you run out
of space click on the down arrow icon or press Ctrl-↓/⌘-↓ to open a
separate window for typing the text.

Click the Auto-
allocateicon to
apply a named
allocation.

If the I need to Account for GST/VAT/Taxpreference option is on, there will be
separate columns for entering the Net, GST and Gross amounts for each detail
line. If the option is off MoneyWorks will not monitor Tax and only a single
Amount column will be displayed.

Using the By Account, method of detail line entry allows you to specify the
account (and department, for departmentalised accounts), and, if necessary,
override the default tax code for the account or even the actual tax amount.

1. Enter the account code into the Account field and press tab

If the account has departments (MoneyWorks Gold), you must also include
the department code after the account code. For example:“1000-JK” for
account “1000”, department “JK”.

If the transaction is a Payment or a Creditor Invoice, this account will be
debited by the net amount that you enter on this detail line. If the
Transaction is a Receipt or a Debtor Invoice, this amount will be credited by
the net amount that you enter on this detail line.

When the I need to Account for GST/VAT/Tax preferences option is on,
columns are displayed in each detail line that allow you to enter either the
Tax exclusive amount (Net) or the Tax inclusive amount (Gross)

When the I need to Account for GST/VAT/Tax preferences option is off, a
single column (Amount) is displayed, and no calculations are done for tax.

3. Click or tab into either the Grossor the Netfields and enter the amount to
Transactions

be debited or credited to the account

If you enter the net amount, the Tax and gross will be calculated. If you
enter the gross amount, the net and Tax are calculated automatically.

If the Auto-Calculate Transaction Totaloption in the Data Entrypreferences
is set, the sum of the amounts in the Gross column will be entered into the
transaction Gross field for you. This is the default for cash receipts and
debtor invoices.

Changing the GST/VAT/Tax

If the Tax for this part of the transaction is different from that calculated
using the default tax code for the account, you can overtype either the tax
code (which will cause the Tax amount to be recalculated using the net
amount and new tax code) or the Tax amount itself. If the Tax on a purchase
bears no apparent relationship to the codes, US and Canadian users can
override the total transaction tax.

Note: MoneyWorks will display a warning if you alter the amount in the Tax
field. It is only on rare occasions that you will need to do this, as for
example if the Tax rounding on an invoice is different.7

Canadian GST and PST: The aggregate GST and PST for the line is shown in the

Tax column. These are shown separately when you print the GST Report.

If the Show Job Columnoption is set in the Jobspreferences, you can also
specify the job (if any) to which the detail line refers —see Automatic Entry
from the Transaction File.

4.

If you need to allocate the remaining amount of the
transaction to further accounts, make a new detail line
by:

pressing ↩/Return or;

pressing Ctrl-N/⌘-N or;

clicking the New Detail line icon or;

Click the New Detail
lineicon to append
a new detail line, or
shift-click it to
insert a new detail
line above the
current line
Transaction Entry

tabbing through the remaining fields on the current line, but only if the
Auto Wrapoption is off.

Pressing ↩/Return when you are on the last detail line will cause a new
detail line to be added. If the insertion point is not on the last detail line
when you press ↩/return, the insertion point merely moves to the Account
field on the detail below the one you were on.

Entering Detail Lines by Item

Using the By Itemmethod of detail line entry allows you to specify an item code
and a quantity. Behind the scenes, MoneyWorks will insert the appropriate
accounts as specified in the Control Accounts section of the Item record. See
Items, Products and Inventory

Note: If you have serial/batch and/or location tracking turned on there will be
additional columns in the product entry screen to allow for the entry of
serial/batch numbers and/or location.

1. Enter the Code or Barcode of the item in the Item column, and press tab8

The item description, unit price, units, standard discount and extended
price (i.e. quantity multiplied by unit price less discount) will be
automatically entered for you into the appropriate columns.

If you do not need to alter the quantity or other line details, you can press
↩/return instead of tab to have the next detail line automatically created.

If you type in an incorrect item code, or leave it blank, the Item choices list
will be displayed. Select the item you require by double-clicking on it, or, if
it is a new item, click the Newbutton to record the item details.

If you have entered a barcode that is not unique, the item choices window
will be displayed listing all items with that barcode.

If the item has a Sticky Noteassociated with it that is applicable to this type
of transaction, the note will be displayed when you exit the field.



Transactions

Transaction Entry

If you are entering a payment or a creditors invoice for the item, and you have
not set the We Buy Thischeck box, a message will be displayed saying “You do
not buy this product”. If you want to buy the item, you will need to modify its
details in the item file -see Creating a New Item.

If you are entering a receipt or a debtors invoice for the item, and you have not
set the We Sell Itcheck box, a similar alert box with the message “You do not
sell this product” will be displayed. If you want to sell the item, you will need to
modify its details in the item file.

2.

In the Qty column, type in the quantity of the item that you are
purchasing or supplying, and then press Tab

If the Show Job Columnoption is set in the Transaction Entry preferences,
you can also specify the job (if any) for which the item is to be used.

4.

If you need to allocate the remaining amount of the
transaction to further accounts, make a new detail line
by:

pressing ↩/Return or;

pressing Ctrl-N/⌘-N or;

clicking the New Detail line icon or;

Click the New Detail
Lineicon to create a
new detail line.

The quantity can be a fractional value with up to 4 decimal places.

tabbing through the remaining fields on the current line9

3.

If you wish to change the description, unit price, discount, extension or
tax code, tab into that field and overtype the contents

Although MoneyWorks has entered the item description, unit price (based
on the customer’s price code) and discount and calculated the extension,
you can change any of these values. Note that the prices are assumed to be
in the currency of the customer/supplier or bank account.

If you change the unit price, the extension will be recalculated using the
new price and the quantity and discount already entered.

If you change the discount, the extension will be recalculated using the new
discount and the existing quantity and unit price.

If you change the extension, MoneyWorks will calculate a new discount rate
so that the formula: Extension = Qty * Unit Price * Discount% still holds.
Sometimes you will see a very small (say 0.0012%) discount showing in the
discount column. This occurs for fractional quantities or prices when the
extension is rounded to the nearest cent.

In the case of the description, you may want to click at a point in the text
and simply add or remove some text.

If the Show Tax Columnoption is set in the Transaction Entry preferences,
an extra column will be displayed showing (and allowing you to modify) the
amount of GST/VAT/Sales Tax associated with the detail line.

Pressing ↩/Return when you are on the last detail line will cause a new
detail line to be added. If the insertion point is not on the last detail line
when you press ↩/Return, a new detail line is not created—the insertion
point merely moves to the Qty field on the detail line below.

5.

If you need to enter further items, make a new detail line by:

pressing ↩/Return or

by pressing Ctrl-N/⌘-N or

by tabbing through the remaining fields on the current line

Removing detail lines

If you need to remove a detail line:

1. Ensure that the insertion point is in one of the fields on

the line

Click the Delete
Detail Lineicon to
remove the current
detail line.

2. Click the Delete Detail Lineicon, or press: Option-⌘-D (Mac) or Ctrl-Shift-

D (Windows), or choose Edit>Delete Detail Line

The line will be deleted. Note that lines without account codes are
automatically removed when the transaction is accepted (if the line has a
value, this will cause the transaction to go out of balance, and MoneyWorks
Transactions

will decline to accept it).

Alternatively, you can Right-click (option click if you must use a one button Mac
mouse) on the detail line and choose Delete Detail Linefrom the contextual
menu that appears

Inserting Detail Lines

To insert a new detail line somewhere other than the end of the line item list:

1. Click in any cell of the detail line that you want to insert

a line above

2. Hold down the Shift key and click the New Detail line

icon

A new line will be inserted above the active line and the first
cell will be activated.

Click the New Detail
lineicon while
holding the Shift
key to insert a new
detail line above
the active line.

Reordering Detail Lines

The detail lines in an unposted transaction can be reordered:

1. Position the cursor over the detail line to move and hold down the shift

and control keys (Windows) or the option key (Mac)

The cursor will change

2. With the shift-control/option key still held down, drag the detail line up or

down to its new position

Transaction Entry

Changing between By Accountand By ItemEntry

Once you have entered a transaction using the By Item entry method, you can
change its entry method to By Account by clicking on the By Accounttab. If you
do this, the detail lines will change to display the account codes, net, tax and
gross columns. If you then click the OKor Nextbutton, or press the keypad-
enter key, the following message will be displayed:

A transaction can be either By Accountor By Item. Having created it as By Item,
you are attempting to save it as By Account. MoneyWorks is warning you of this,
and giving you the option of saving it in either form. If you save it as by account,
all the item information (except the description) will be removed, and the
extended price will become the detail net value.

Note: It is possible to enter the details for an Item transaction, switch to By
Account, alter the account codes and switch back to By Item. The
transaction will be saved with the altered account codes. Care should be
taken in doing this to ensure that the altered account codes are meaningful
in the context of the transaction.

Recording Jobs in Transactions

You can assign individual transaction detail lines to jobs. This enables you to
track income and expenditure by job, which is normally totally independent of
the structure of your chart of accounts. You can then extract information about
costs for the various jobs.
Transactions

Transaction Entry

Some other accounting systems use different rounding methods (often simply
rounding all half cent values upwards), or calculate tax totals based on the
entire transaction Net, instead of by line-item. When you receive an invoice
from a supplier who uses one of these systems, the Tax total may differ by a few
cents from that calculated by MoneyWorks. In such cases, it is desirable to make
the Tax rounding (and hence the invoice total) match the invoice you have
received.

When you find that a supplier invoice total, as calculated by MoneyWorks,
differs by a few cents from the original invoice (due to Tax rounding):

1. Choose Edit>Adjust GST Rounding, or press Option-⌘-A (Mac) or Ctrl-

Shift-A (Windows)

The rounding of any half-cent GST values will be forced to match the invoice
line-item gross values to add up to the total invoice amount entered.

Sales Tax Override (USA and Canada Only)

Sometimes invoices you receive will include a sales tax total without any
indication of which items have incurred the tax and which have not. In these
situations, the automatic line-by-line tax allocation done by MoneyWorks is not
going to useful. To allocate the entire tax on a transaction:

1. Click the Down Arrow icon next to the tax total at the

bottom of the entry screen

The Tax Override window will open:

Click the Down
Arrowor the tax
amount to open the
Tax Override
Window

To assign detail lines to jobs, the Show Job Columnoption must be on —see Job
Preferences. This causes an additional column called Job to be displayed at the
right hand side of the detail lines. It also causes an extra job column to be
printed when transaction lists that show detail lines are printed.

To assign a transaction line to an individual job:

1. Create a new transaction and detail line in the usual manner

2. Enter the job code in the right-most column of the detail line

The information in the detail line will be tagged against that job. For
MoneyWorks Gold, if the Enable Job Costing and Time Billingoption is set, a
new job sheet entry will be created when the transaction is posted.

If the job code does not exist, and the Allow any value in job columnjob
preference option is off, the Job Choices window will be displayed. Double-
click the job you require in the list, or click Newto create a new job.

Note: If the Job Code Requiredoption is set in the associated account code

—see MoneyWorks Accounts, you will be required to specify a job in the
job column for transactions other than journals, otherwise it is optional.

For a full discussion on job control see Job Control.

Adjusting GST/VAT/TAX Rounding

MoneyWorks calculates GST/VAT/TAX for every line item. This makes it very easy
to enter transactions for items with different tax rates. It does also mean that
the tax gets rounded per line item.

As of MoneyWorks version 9.0.2, you can choose between Round-Half-Even and
Round-Away-From-Zero (round halves "up") for rounding half cent values.

Documents created in MoneyWorks versions before 9.0.2 will have Bankers'
rounding set by default. (Banker's Rounding (also known as Round-Half-Even,
meaning half-cent values are rounded towards an even whole number)‚ which
reduces the incidence of accumulated rounding error). New documents created
with 9.0.2 and later will default to Round Away From Zero.
Transactions

Storing Source Images

To Restore a Transaction to use the Default Taxes

1. Open the Tax Override screen by clicking on the down arrow

2. Click the Defaults button

The tax lines will be removed, and the tax restored to the default on each line.
You would only do this if you changed your mind and wanted to undo the
override on an unposted transaction.

Storing Source Images

In MoneyWorks Express, Gold and Datacentre you can store a single image with
a transaction, and view it later. A typical example would be to scan in a purchase
order from a customer and link it with your sales order. If there is a query about
the order later, you can easily retrieve the copy.

Viewing or attaching a source image is done through the Source Image icon at
the top right of the transaction entry screen.

To attach an image:

1. Click on the Source Image icon and choose Import Image

from the Source image dropdown

The standard File Open dialog will open

2. Select the image that you want to attach, and click OK

The icon will change to indicate that there is an image
associated with the transaction.

Alternatively you can simply drag the image file onto the
Source Image icon.

MoneyWorks will copy the image into the custom plug-ins10 for you, and for
network users upload it to the MoneyWorks server. This may take a few
seconds. The source image icon will change to indicate that there is an image
associated with this transaction.
2. Enter the actual tax amounts as specified on the invoice

3.

If the appropriate tax code isn’t displayed in the list, click the New icon to
add it

Only base tax codes can be used (you cannot code to a composite one—see
Sales Tax and PSTfor details of these). Unused taxes can be deleted using
the Delete (Trash) icon.

4. Click Apply to apply the taxes

Any tax will be stripped off the existing lines on the invoice, and a new line
will be added for each of the taxes specified in the Tax Override screen. The
tax codes on the existing lines will be changed to “*”, so you will not be able
to alter these tax amounts.

Note: Sales tax is normally treated as part of the cost of the item being

purchased (unless you have an exemption for the item). If the Tax Override
is used, MoneyWorks can no longer apportion the tax to each line of the
transaction; instead all tax is apportioned to the general ledger code used in
the first line of the invoice.

Note: If using an Item transaction, MoneyWorks will create a new Item “~TAX”,

and the tax lines will be allocated against this.



Transactions

To view the image:

field.

Transaction Entry Goodies

1. Click on the Source Image icon and choose Display Imagefrom the drop

To invoke an Auto-Allocation rule

down menu

The image will be displayed in the MoneyWorks report Preview window, or,
if you are on Windows and it is a PDF, in Adobe Reader if installed.

1. Choose Edit>Apply Named Allocation, press Ctrl-U/⌘-U,

or click the Auto-Allocateicon

Click the Auto-
allocateicon to
apply a named
allocation.

To delete the image:

1. Click on the Source Image icon and choose Delete Imagefrom the drop

down menu

The copy of the image will be permanently deleted.

Transaction Entry Goodies

MoneyWorks has various features to help make transaction entry faster, easier
and more accurate.

Auto-Allocation

Auto-Allocations allow MoneyWorks to assign default general ledger codes
when you enter transactions. The allocations can be associated with customers
and suppliers —see Default Account, or can be activated during transaction
entry by a text in the To/From or Description fields. They can also be used when
importing bank statements.

Example: Whenever you get charged interest by your bank, the word “Interest”

is entered into the transaction description, enabling it to be automatically
coded your Interest Expense. This is accomplished by creating an Auto-
Allocation associated with the text “Interest”.

Auto-Allocations are applied to transactions as they are being entered, and are
based on a set of pre-defined “rules” —see Setting up an Auto-Allocation for
General Transactions, each rule being identified by a unique text string. To
successfully apply a rule, you need to have entered the matching text into either
the To/From or the Description field, and the transaction amount in the Amount
The Auto-Allocation rules are searched for a rule starting
with the text in the To/From field. If no match is found, the rules are
searched for a rule starting with the text in the Description field. Detail lines
are automatically created for the accounts and breakdown specified in the
rule.

A beep is sounded if no matching rule is found.

To Change a previous applied allocation

1. Alter either the text in the To/Fromfield or Description(if the rule was

incorrect), or the Amountand press Ctrl-U/⌘-U

The new rule will be applied to the value in the Amountfield.

Entering Details by Percentage

Sometimes you may want to allocate certain percentages of the total value of a
transaction to various accounts. MoneyWorks makes this easy. If you type a
percentage (that is, a number followed by a percent (%) sign) into the Net or
Gross field of a detail line for a non-item transaction, MoneyWorks will calculate
that percentage of the transaction Amount and enter it into the detail gross
when you tab out of the field. The Net and Tax fields will be recalculated
accordingly.

For example:

1. Enter a Cash Payment with an Amount of $150



Transactions

Transaction Entry Goodies

2. Type the account code in the detail line, then tab into the Netfield. Type

“50%”

Using Calculations in Transactions

3. Press Tab

MoneyWorks calculates that 50% of the transaction gross is $75.00. It
enters this value into the detail gross field, then works out the Tax based on
the account’s tax code, (in this example giving 12.5%) and net.

As well as being able to enter numbers into transactions, you can also enter
calculations. This is particularly useful if you need to work out the value that you
want to enter.

To enter a calculation into a field:

1. Tab to the field that you need to calculate

Type in the calculation

The first character in a calculation must be the equals sign
(=).

2. When the calculation is entered correctly, tab out of the

field

Start your entry
with an '=' to
automatically
calculate the
subsequent
expression.

Press Return to create the next detail line and carry on allocating the balance of
the payment. You can use percentages again in subsequent lines if you want.

MoneyWorks will evaluate the calculation that you have entered, and
replace it with the result.

Entering the Transaction Date

When you enter a date field, a standard date picker drop down will appear
(unless you have turned off the date picker in Edit>MoneyWorks
Preferences>General). You can select the date from the picker or key it in. In the
latter case, you can enter the full date or just:

• a single number, which will be assumed to be that day of the current month

(e.g. “4” will be assumed to be the 4th of the current month);

• a day/month (or month/day if your date formats are set to American dates),
which will be assumed to be that date in the current year (e.g. “4/4” will be
assumed to be the 4th of April this year). However if you are close to the
start of a new calendar year, then an entry such as “12/12” will be assumed
to be the 12th of December last year;

• a six digit number, which will expand to a proper date (e.g. “080810” will

expand to 08/08/10);

Pressing Ctrl-rightarrow/⌘-rightarrow will nudge the day up, and Ctrl-
leftarrow/⌘-leftarrow will nudge it down.

If you enter a calculation that cannot be evaluated (either because you have
specified it incorrectly or because there is no valid answer as for example if you
divide by zero), MoneyWorks will highlight the calculation that you have entered
and beep. You will need to correct or replace it. Only the result of the
calculation is recorded, the calculation expression is discarded.

You can enter calculations into virtually any field in a MoneyWorks entry screen.
For example the result of a calculation in a date field will be converted to a date,
in a numeric field to a number, and in a text field to a character string.

Example calculations:

=(120+140)*.9

Gives 234.00

=1+2+3

Gives 6.00

='1/1/03'+90

Gives 1/4/03

=(120+3

Error, missing closing parenthesis
Transactions

Transaction Entry Goodies

=(120+10)/0

Technically an arithmetic error, but MoneyWorks will return 0.

Opening Your System Calculator

You can open the system calculator at any point in MoneyWorks, provided you
do not have a modal window open. To open the calculator:

1. Choose Edit>Show Calculator or press Ctrl-L/⌘-L

The default calculator on your computer will appear. You should be able to
copy the results of any calculations you do on this and paste back into
MoneyWorks.

Entering Long Text in Transactions

You can enter long text (i.e. more text than will fit into the field as shown on the
screen) into both the transaction description and the detail description. As you
enter the text, the field will grow vertically to accommodate it.

If you require more text than this, click the down arrow at the bottom right of
the field or press Ctrl-↓/⌘-↓. The text entry window will open.

You can type the remainder of the text into this, and then click OK(or push
keypad-enter). You can insert a carriage return character (for starting text on a
new line) by pressing ↩/return. If you click Cancel, changes that you have made
in the window will not be saved.

Changing Field Attributes

You can alter the way that many of the fields and pop-up menus in the header
part of the transaction entry screen operate. You can exclude them from the tab
order, so that they are not tabbed into as you tab round the window; you can
have them remember the last value entered and carry it over into the next new
record; and you can add Custom Validationsto ensure correct data is entered.

To change the field attributes:

1. Position the mouse over the field and right click (or control-click if you

have a single button Mac mouse)
Transactions

Modifying and Deleting Transactions

A contextual menu of field attributes appears

the margin of the current detail line is also displayed.

in transactions.

2. Select the attribute setting for the field:

Changing the Tab Order

Tab Into: Pressing the tab key in the previous field will move

you into this field;

Don’t Tab into: The field will be bypassed when you press tab.

Carrying Over the Value

Remember Value: The previous value that you typed into this field will

automatically appear in new transactions;

Clear Each Time The field will be blanked between each new transaction.

Always Today: For the transaction Date, the field will default to today’s date.

Assigning a Custom Validation

Custom Validation: Add a custom validation to the field

No Validation: Remove a custom validation

For details on custom Validations and Validation Lists see Validations.

Displaying Margin Information

When entering a sales transaction involving products (such as a debtor invoice),
it can sometimes be useful to see the margin information displayed on the
screen at the point of entry. Thus if you are working out some sort of discount
rate for example, all the information is visible.

The margin information can be displayed in the bottom part of
the transaction entry window by setting the Show Margins
option in the Transaction: Items. For Quotes and Sales Orders,

Margin Information
The Salesperson Field

The Salespersonfield is a special field in the transaction window. It can be used
in two different ways:

• as another field for recording something about the transaction—maybe a

code that indicates the salesperson in a sales transaction, or maybe
something else.

• in MoneyWorks Gold only, as a special field used for appending a

department specifier to the item account codes. This only applies if you
have departmentalised item control accounts for sales and purchases —see
Setting Append Salesperson.

You can also change the name of the Salespersonfield (e.g. to Branch or Area),
so that it more closely resembles how you want to use it. This is done in the
Document Preferences—see Fields.

No special action is required to use the Salespersonfield as an ordinary field.
However it is probably not a good idea to mix the usage of the field—if you are
using it for controlling item departments in MoneyWorks Gold, then only use it
for that.

Setting the Default Salesperson value

You can associate a default value that is entered into the Salespersonfield by
specifying it in the Names record —see Salesperson. This allows you to assign a
salesperson to a customer.

Modifying and Deleting Transactions

You can modify and delete transactions in any of the tab views of the
transaction list window. However, to maintain system integrity, there are certain
restrictions imposed on modifying and deleting transactions.



Transactions

Changing Details of Transactions

changes

Modifying and Deleting Transactions

Up until a transaction is posted, you can change any of its details. Once a
transaction has been posted you can only change the non-accounting details,
including To, From,Description, Analysis, Flag, Colour, MailTo, DeliverTo, User
fields and recurrence settings. Other fields are locked.

There are several ways to correct a posted transaction. For further information
see Adjustments

To change a transaction:

1.

In the Transactions window highlight the transaction(s) to change and
Choose Edit>Modify or press Ctrl-M/⌘-M

The transaction entry window for the first of the highlighted records will be
displayed. The fields that cannot be altered (because the transaction has
been posted) are displayed in grey.

To modify a single transaction, just double click it in the list.

The current data in the field will be highlighted ready to be overtyped. Click
the mouse to get an insertion point within the highlighted area if you only
want to add or delete a few letters.

3. Click the OKbutton to save the changes to the transaction and return to

the Transaction list window

If you are modifying a number of transactions at once, use the Nextbutton
to save the changes to the current transaction and display the next one to
be modified.

Click OKwhen you have reached the last transaction to be changed or when
you want to finish modifying transactions.

To save the current transaction and move back through the selected
transactions, click the Previousbutton.

Note: If you have altered a posted transaction, you will be asked for

confirmation. If you choose to save the changes, the transaction is tagged
as having been altered since posting (this can be seen in the Get Info
window.

Duplicating a Transaction

Sometimes you may need to enter a transaction that is the same as, or similar
to, an existing one. The Duplicate command makes this easy.

1. Highlight the transaction to be duplicated

2. Choose Edit>Duplicate «Transaction» or press Ctrl-D/⌘-D or click the
Duplicate toolbar button or right click on the transaction and choose
Duplicate

If the Askoption is set in the Duplicating Transactions preferences, and the
transaction being duplicated is not a journal, you will be asked whether you
want the new transaction to have a new reference number or the same
reference number.

2. Tab to or click on the field(s) that need to be changed and type in your
Transactions

Modifying and Deleting Transactions

Deleting Transactions

Only unposted transactions can be deleted. To correct a posted transaction you
should use the Cancelcommand.

1. Highlight the transaction(s) to be deleted

2. Choose Edit>Delete

You will be asked for confirmation.

The reference number is kept in the OurReffield —see Transactions, and
depends on the type of transaction:

Transaction Type

Reference number

Payments
Receipts
Debtor Invoices
Creditor Invoices
Quotes/Sales Orders
Purchase Orders

The cheque number
The receipt number
The invoice number
The order number
The quote number
The order number

The duplicated transaction will be displayed. As it is unposted (even if the
original was posted), you can modify any of its fields.

3. Click Deleteto delete the transactions

Posted transactions are deleted by means of the Purge command —see Purging
a Period.

Reversing Transactions

If the period of the original transaction is closed, the duplicate will be put into
the current period. Otherwise the period will remain the same.

While a transaction is being modified it can be reversed.

Note: For transactions in a non-local currency, the exchange rate for a

1. Click the Reversetransaction toolbar button, or press Shift-Ctrl-V

duplicated transaction will be taken from the system rate of the period into
which the new transaction falls. You can use the Exchange Rate button to
change this once the new transaction has been created.

(Windows) or option-⌘-V (Mac)

The numbers in the transaction will change sign. If the transaction is a
Journal, the Debit and Credit columns will be swapped.

Note: When duplicating a Quote, you will be asked if you want the new Quote
to have updated prices based on the existing prices in the Items list.

2. Click OKto accept the reversed transaction
Transactions

Information on a Transaction Record

You can find out useful information about a transaction by using the Get Info
command, or clicking the Infotransaction toolbar button. Use this to find out if
the transaction has been reconciled, what its security level is, when it was
processed for GST/VAT, the date it was entered etc.

1. Highlight the transaction in the transaction list

2. Choose Select>Get Info, or double-click the transaction

and click the Info toolbar button

The Transaction Info window will be displayed

Printing Transactions

Printing Transactions

Transactions can be printed as a list for archiving or internal purposes, or as
forms (such as invoices or cheques) for customers or suppliers.

Printing a Transaction List

You can print a list of transactions from any of the tab views. As a general
strategy, you should first find and sort the list to show the transactions that you
want to print. If you only want to print some of the transactions in the list,
highlight those transactions

The Infobutton

To print a transaction list as shown on screen:

1. Choose File>Print or press Ctrl-P/⌘-P or click the Print Listtoolbar button

The Print Configuration window for the transaction list appears.11

Don’t Show on Statement Set this option if you do not want the transaction to
be shown on a statement—this is intended for suppressing the printing of
messy fix-ups you may have done that you do not want the debtor to be
aware of. You need to make sure that you the transactions that you
suppress in this manner come to a total of zero, otherwise your statements
may not balance when printed.

2. Set the Subtotal by option to subtotal the list

This is only available is the list has been sorted by one of the columns. If
selected, a subtotal will be printed whenever the value in the sorted
column changes.
Transactions

3. Click Print/Preview/Save As/Send to output the list

The transaction list will be printed as shown on the screen, but with the
addition of Net and Tax columns.

Printing Transactions

For a discussion on printing issues —see Printing and emailing.

To print the transactions in the list as journals

1. Click the Print Details toolbar icon, or the Detailssidebar

report (they are equivalent)

The report settings window will open.

2. Set the layout to Debits and Credits

The other layout options allow you to print the transactions showing the Net,
GST (or VAT or Tax) and Gross on each line, and also the Items used on each line.
You can change this and other sidebar reports (or add your own) by using the
report writer.

Printing Invoices, Receipts and other Transaction Forms

The Print Details
icon

You can print any MoneyWorks transaction (except a journal) as an accounting
form (invoice, purchase order etc).

3. Choose if you want all the records displayed in the list printed, or just the

1.

In the Transaction list, highlight the transactions to print

ones that are highlighted

4. Click the Print/Preview button

Each account code is shown, along with the amount debited or credited to
that account. This also shows the system detail lines which are added by
MoneyWorks to balance the transaction.

For invoices only, a printer icon appears in the P (for printed) column after
they have been printed. Sorting this column in descending order will show
unprinted invoices first.

2. Choose Command>Print “Form” or press Ctrl-[/⌘-[ or click the «Form»

toolbar button («Form» will be Statement, Invoice etc, depending on the
list)

The Print configuration window will be displayed. The heading in this dialog
box will also reflect the type of transactions that are being printed—in this
case, a quote for a sales order.
Transactions

Printing Transactions

5. Click Printor Previewto continue

Printing Multiple Forms

If you often want to print a group of different forms at one time (e.g. you may
want to print customer invoices together with envelopes to put them in), you
can set up a “multi-page form” —see Creating a Form. These appear in the Use
Formpop-up menu in the same manner as any other form.

1. Choose the multi-page form from the Use Form pop-up menu

3. Choose the desired form from the Use Formpop-up menu

For a discussion of the options on this window —see emailing Invoices,
Orders and Statements. Only the “Plain” forms can be saved as text file.

Note: Apart from the “Plain” forms, MoneyWorks does not distinguish between
individual transaction form types (cash receipts and invoices for example). It
is up to the operator to choose the right form, unless the form itself is
sufficiently “smart” to determine what sort of transaction it is printing12.
However each transaction view will remember its default form.

Note: A “Plain” invoice is a basically a report created using the report writer that
is stored in the Invoices folder in the Plain folder inside the MoneyWorks
Custom Plug-ins folder.

Samples of the forms to be printed will be displayed as shown above.

2. Click Print

If this is the first time you have printed this form...

The forms will print as normal.

If this is the first time you have printed this particular form, or if you have
changed printers since you last printed it, you will need to check the paper size
and positioning of the form.

4.

If this is the first time you have printed this form on this printer, click the
Layout button

For further information see Setting the Form Size.
If a pause has been included in your meta-form, the following window will be
displayed, giving you the opportunity to change the stationery in your printer.



Transactions

Printing Transactions

Note: The forms that have already been “printed” will have been “spooled” onto
your hard drive, and probably won’t have been physically printed when this
message is displayed. You need to wait for them to be printed before you
change your stationery.

3. When you have loaded the correct stationery, click Continue

Emailing Forms

You can email the invoices, receipts, statements and order forms. The forms will
email as pdf attachments.

Note: The method of sending email is determined by the Emailing Preference. If
the default option Create Message in the system email clientoption is
selected, emails will be created in your preferred email client (Outlook, Mail
etc), and you will need to send them manually from this. If the Send
messages directly via a mail serveroption is set, the emails will be sent
immediately with no record in your email client (unless you have also set
the BCC option).

1. Start to print the transactions in the normal way

Either highlight the transactions and choose Print «Transaction» from the
Command menu, or click the Print icon on an open transaction. For
statements, use Print Statement in the Command menu.

2. Choose the form to use from the Use Formpop-up menu

3. Set the Output tooption to Email and click Send

The Mail Attachment window will be displayed. Use this
to indicate the subject message, and to whom you will be
sending it.

To email, set the
output pop-up to
email.

To send the transactions to their specified recipients

If you want to send the forms to their intended recipient (i.e. the customer/
supplier):

4. Select the Separate Emailstab

5. Enter the subject of the email into the Subject field

Providing you are emailing a proper form (i.e. a .invc or .stmt) and not a
variant of the Plain invoice (which is actually a report), you can include
merge text from the underlying file in the subject field, and, if you are using
the SMTP option, the message field. For example, when emailing an invoice
Transactions

you might have something like:

Our invoice <<ourref>> for $<<gross>> is attached

and for a statement, something like

Statement for <<name.name>>

If you are sending more than one invoice, a separate email for each debtor
will be created with the invoice enclosed as an attachment. Unless the
SMTP email option has been set, you will need to send the emails from your
emailer (MoneyWorks has made them for you, but not sent them).

Printing Transactions

To send the transactions as a batch to nominated recipients

You can include valid MoneyWorks expressions between the angle brackets,
so for a statement you could have something like the following:

You can send a batch of invoices, orders or statements to nominated recipients.
In this case each recipient will get an attachment that includes all the
transactions being emailed.

1. Select the Send Batchtab

Note: This will work for the Separate Emailsoption only, where a separate
email is generated for each transaction (or Customer, if a statement).

6. Choose the contact or role to send the email to from the Send Topop-up

menu

Note: The email will be addressed to all people who have the selected role
in the organisation. For example if the invoice is sent to the "Receivables"
role, the Send tofield of the email will be populated with the email address
of every contact with the "Receivables" role in the organisation.

A separate email will be generated for each Transaction being emailed, with
the Transaction/Statement form included as an attachment. These are not
sent by MoneyWorks, but are created in your email program. If the email
address is missing, the resultant email will be unaddressed.

7. Click Send

2. Enter the subject into the Subject field

3. Use the pop-up menu to select the contact or role that you want to which

you want to send the email

4. Either highlight the recipients in the list and click the Insertbutton, or

double-click each recipient in the list
Transactions

Posting Transactions

The email address for the indicated contact will be copied into the Send To
field. You can also type addresses directly into this field (separating email
addresses with a comma), or double-click on a Name in the list to insert the
email address(es) for that Name.

5.

If you are using the built-in SMTP option, enter a message into the
Messagefield

6. Click the Sendbutton

A single email will be generated, addressed to the specified recipient(s),
with a single attachment encompassing the transactions that were selected.
Unless you are using the built-in SMTP option, you need to send the email
from your email client (MoneyWorks has made the email for you, but not
sent them)

Posting Transactions

When all the details of the transaction are finalised, the transactions should be
posted. Once posted, the accounting information in the transaction cannot be
modified—if you need to change it use the Cancelcommand.

Transactions need to be posted to be credited or debited against the accounts
that are assigned to them, and (where appropriate) to update the stock and/or
the debtor’s or creditor’s balances. For this reason it is not possible to close a
period which contains unposted transactions.

If you use the Post optionwhen entering the transaction, it will be posted
automatically when you click the OK or Next button. If you haven’t used this,
you will need to post the transactions as follows:

1. Highlight the transaction(s) to be posted in the

Transactions list

2. Choose Command>Post Transactions or press Ctrl-K/⌘-K

3. The Post Transactions confirmation dialog box will

appear.

Unposted
transactions have a
U in the Status
column

If some of the transactions that you highlighted were already posted,
MoneyWorks will tell you so in this dialog box. You can still go ahead and
post those that are not already posted.

4. Click Postor press enter to post the transactions

The highlighted transactions are posted to the appropriate accounts. The
status flag for the transactions changes to P.

If the current tab view is Unposted, the transactions will disappear from the list
since they are no longer “unposted” transactions.13

Recurring Transactions

MoneyWorks allows you to set up transactions that will recur (as an unposted
transaction) at regular intervals. These recurring transactions can be used to
enter monthly or fortnightly salary payments, rents, hire purchases, or any other
automatic payment.

Making a Recurring Transaction

1. When creating or modifying a transaction, click the
Make Recurringcheck box or the associated Setup
button in the transaction toolbar

The Recurring
checkbox

The Define Recurring dialog box is displayed.
Transactions

Recurring Transactions

3rd
month

on the
last day
of every
quarter

every
fortnight

every
2nd
Monday

2. Specify the recurrence frequency (as in the examples below)

To recur

Settings

on the
10th day
of every
2
months

on every
10th day

on the
2nd
Friday of
every

3. Click Avoid Weekends if you want transactions which would otherwise fall

on weekends to be brought forward

4. Alter Start On(the start date) for the recurrence

The default start date is one month from the current date.

5. Specify when the transaction should stop recurring

The default is Never Finish—which really means that you will manually stop
the recurrence at you discretion. See Stopping a Recurring Transaction.

If you click and finishingand enter a date in the finishing date box, the
transaction will not recur after that date.

If you click and recurring...more timesand enter the number of times
recurring, the transaction will recur that many times only.

6. Click the Preview button to view the dates generated by these criteria
Transactions

Recurring Transactions

7. Click OKto close the Preview window

8. Click OKto save the details of the recurring transaction or click the Cancel

button to cancel them

If you need to edit the recurrence specification, click the Setupbutton to
show the Define Recurring Transaction setup box again.

9. Click OKto save the changes to the transaction

The Recurring transaction icon appears in the status
column of the transaction list to indicate that the
transaction has been set up to recur in the future.

The Recurring icon
in the status
column of the
transaction list.

A recurring (unposted) transaction will be generated by MoneyWorks when the
document is opened on or after the recurring date and the period into which it
should recur has been opened. A message is displayed in the Messages window.

Note: The recurrence property is passed on to the newly created transaction.
You will notice that the original transaction no longer appears with the
recurring transaction icon next to it. Instead, the new transaction appears
with the icon. MoneyWorks uses the new transaction as the template for
future recurrences. If you modify the transaction before it next recurs, the
change will be “inherited” by future recurrences.

Note: The period in which the transaction belongs is determined by the

transaction date (which for recurring transactions will be the specified
recurrence date). The transaction will not recur if its period has not been
opened, and a warning will be given.

When the period is opened, the transaction will recur automatically.

Entering an Automatic Reversing Transaction

You can use the Recurring transaction facility to set up a transaction which will
automatically reverse at some future date.

1.

In the Define Recurring Transaction dialog box, click the Once Onlyradio
button

The Recurring options at the top of the dialog box are dimmed. New
options appear in the Once Onlypart of the dialog.
Transactions

Setting up an Auto-Allocation for “Cash” Transactions

2. Click Reverse

Changing the Recurrence Properties

To alter the recurrence properties of an existing recurring transaction:

1. Click the recurring Setupbutton in the transaction

toolbar

The Define Recurring Transaction settings window will be
displayed.

Click the Setup
button to edit the
recurrence settings.

Stopping a Recurring Transaction

A recurring transaction will cease recurring once the finish criterion has been
reached. Depending on the settings, this will be either:

• When the specified number of recurrences have occurred;
• When the finish date is reached;
• Never.

In the case of a Never Finishsetting, you will need to manually stop the
transaction from recurring. You may want to do this even if the finishing
condition was something other than Never Finish.

To stop a transaction from recurring again:

1. Double-click the latest recurrence of the transaction

This will have the recurrence icon in the status column.

2. Turn off the Make Recurringcheck box and Click OK

The transaction will no longer appear with the recurring
transaction icon next to it. Note that you can do this even
if the transaction has been posted.

Turn the recurring
option off to stop a
transaction
occuring

Deleting an unposted recurring transaction will also stop it from recurring.

Finding Recurring Transactions

Transactions that are set to recur can be easily found by using the Find by Field
to locate recurring transactions in the current view of the transaction list, or use
the Recurring Transactions report.

Setting up an Auto-Allocation for “Cash”
Transactions

Auto-Allocation rules allow for the automatic allocation of a Payment or Receipt
transaction based on information entered into the transaction, including the To/
Fromfield, the Descriptionfield, the Amount, field or combinations of these.
The rules are maintained using the Auto-Allocation command in the Show
menu.

The rules will be automatically invoked when you Load a Bank Statement, and
can be invoked manually when you enter a Payments or Receipt transaction by
clicking on the Auto-Allocation icon or by pressing Ctrl-U/⌘-U.
Transactions

To view the Auto-Allocation rules:

1. Choose Show>Auto-Allocation...

The Auto-Allocation list window will open.

Setting up an Auto-Allocation for “Cash” Transactions

To create a rule

1. Click the New Toolbar button or press Ctrl-N/⌘-N

The Auto Allocation Rule window will open

2. Set the type of transactions to which the rule applies

By default, this will be for both Payments and Receipts.

3. Set the scope of the tests

The scopedetermines how the rules are applied, and defaults to All of
these tests. It can be altered by changing the top pop-up menu. The options
are:

• All of these tests: All of the specified tests (see Test Conditionsbelow) are

true

• Any of these tests: At least one of the specified tests is true
• This expression: The entered MoneyWorks expression is true (see This

expressionbelow)

• Auto-match outstanding invoices: For marking an invoice with the

outstanding balance as being paid. The customer/supplier code or the
invoice number should be in the imported text.

4. Set the test conditions or MoneyWorks Expression, as appropriate
Transactions

These are discussed in more detail below.

5. Select the action to take if the condition is true

There are three options:

• Allocate: Allocate the amount to the specified accounts

The amount is allocated to the specified general ledger codes (up to a
maximum of four). The split can be as a percentage, or as a dollar amount.
Any difference between the amount of the transaction and the allocated
amount will allocated to the and remainderaccount. If you over specify the
allocation amount (e.g. allocate 120%), the and remainderline for the
transaction will be negative.

• Discard Transaction: Do not import the transaction

This option only affects transactions imported using the Load Bank
Statement command (see Importing Bank Statements)—it is ignored if you
trigger the auto-allocations when entering a transaction. You would
normally set this for bank transfers and credit card payments, where the
same transaction appears on both statements. If the option is set and a
match occurs, the corresponding transaction will not be imported. For
example if you transfer funds from your main account to your term account,
the transaction will appear as a payment on the main account’s bank
statement, and as a deposit on the term account’s statement. If you are
importing both statements, you need to omit importing this transaction
from one of them (otherwise it will be in MoneyWorks twice).

• Pay Invoice(s) for: Allocate the amount to outstanding invoices. These are
identified by the following rules, in order of application: (a) if the invoice
number appears in the imported text, or (b) if the customer/supplier code
appears in the imported text, or (c) if there is just one invoice for the
amount.

Note that receipts will only be allocated to customers (debtors), and
payments to suppliers (creditors).

6. Set the Priority of the rule if necessary

Setting up an Auto-Allocation for “Cash” Transactions

It is possible to make rules that conflict. For example a rule for a memo that
contains the word “interest” will conflict with another that is searching for
“Bank interest”. MoneyWorks will allocate based on the first rule it
encounters, so it is possible that a transaction with a memo of “Bank
interest” will be matched with the “interest” rule, and not the “Bank
interest” rule.

MoneyWorks searches for matches by Priority, from highest to lowest. So to
avoid the conflict described above, just ensure that the “Bank interest” rule
has a higher priority than the “interest” rule.

7. Click OKto save the rule

The Auto Allocate Rule window will close.

Test Conditions

A rule can be composed of up to six test conditions, based on any of the
available fields.

For text based data (Memo, Payee, Reference) you can use a starts withor
contains. For example a test of Any field starts with “interest”will match a
memo of “Interest paid”, but not “Bank Interest”. If the test was changed to
containsit would match both.

Note: Text comparisons are not case sensitve, so “interest” will match with

“INTEREST”.

For the amount, the test is numeric, so you can compare whether the amount is
equal to, greater than, etc. some defined valued.

For the Bank/Contra test, you need to enter the general ledger account code of
the bank. The test compares this to the target bank (either the bank account
selected in Load Bank Statement, or, if invoking the rule during transaction
entry, the bank currently selected in the Bank pop-up menu).

Note that, if the All of these testsoption is selected, all the test conditions
specified must be true for the rule to apply. If the Any of these testsoption is
selected, the the rule is applied if any one of the tests is true.
Transactions

This expression

It is (of course) your responsibility to make sure that the script returns a sensible
value in a timely manner.

Setting up an Auto-Allocation for “Cash” Transactions

If you require more complex comparisons, then you select This expressionand
enter a MoneyWorks expression into the expression field. If the expression is
evaluated to false (or zero), the rule will not apply; any other value will be
treated as true.

The expression can reference the keywords Memo, Name, NameOrMemo, Ref,
Amountand Contra, which correspond to the available fields on the bank
statement. You would need to do this for example if you want to apply a rule
only to transactions within a given amount range:

name=`Smith@` and amount > 100 and amount < 200

would match only if the name started with “Smith” and the amount was
between $100 and $200.

For even more complex matching, you can call a public mwScript handler from
here, as in:

myscripts:checkstmt(name, ref, amount)
Manually invoked rules

When you invoke auto-allocation rules manually when entering a payments/
receipt transaction (by pressing Ctrl-U/⌘-U), the rules apply as follow:

• The Memofield matches the description field on the transaction
• The Namefield matches the to/from field on the transaction
• The Any fieldmatches both the description and the to/from transaction

fields

• The Referencematches the ourref transaction field (cheque number)
• The Bank/Contramatches the bank account selected in the Bank pop-up

menu

• The Discard transactionaction is ignored.

1 The views are similar to the tabs in MoneyWorks 5 and earlier.↩

2 In MoneyWorks 5, the keyboard shortcuts were different; the had to be changed
in MoneyWorks 6 to allow for non-modal transaction windows.↩

3 The field is technically called ToFrom, and this is how it appears in the Find
settings window, Importing, Exporting and the Forms Designer.↩

4 The “New...” command in the Edit menu changes depending on the selected
transaction type tab in the Transactions window.↩

5 In MoneyWorks 5 this was Ctrl-tab; Windows uses this to cycle through running
programs.↩

6 The exact key combination depends on the settings in your Key preferences).↩

7 MoneyWorks uses Banker’s Rounding when rounding amounts to the nearest
cent. This means that the value is rounded to the nearest even number, thus
reducing the accumulated rounding error. It is also known as “Gaussian rounding”,
and, in German, “mathematische Rundung”.↩



