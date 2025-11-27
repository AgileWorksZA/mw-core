# Enquiries

The Account Enquiry dialog box is displayed.

Enquiries

Enquiries

The enquiry screens offer a quick way to retrieve and display information in a
useful format from MoneyWorks. There are five types of enquiry:

Account Enquiry: Used to display and graph balance and budget information

from the general ledger;

Payments History: Used to see if invoices have been paid, and how payments

have been allocated. Not available in Cashbook;

Product Sales: Used to display and graph information about product sales or

purchases;

Customer Sales: Used to display and graph information about customer sales

and supplier purchases;

2. Set the Selectpop-up to the type of enquiry

Stock Enquiry: Used to extract information on the status of stocked items

(MoneyWorks Gold only).This is discussed in Stock Enquiries.

The enquiries are all activated from the Enquiries menu, and can also be
accessed from Toolbar buttons in the appropriate list windows.

Account Enquiries

Enquiries can be made about the balances in an account or a range of
accounts—or the transactions in unpurged periods for an account.

These enquiries can be made at any time using the Account Enquiry command
under the Enquiries menu.

The information in the window can be printed out using the Print command in
the File menu.

Finding Account Balances

1. Choose Enquiries>Account Enquiry or press Ctrl-E/⌘-E

The default is for a single account code, but you can also
enquire on ranges of accounts. The options are:

Account Code: An enquiry on a single account code (as

specified in the Account Code field).

Range of Account Codes: As selected from the Range of

Accounts Window.

The Selectmenu
allows you to make
a simple or complex
enquiry.

Find: A search of the ledger using the simple Find command — see Finding

Records using the Search Box.

Advanced Find: A ledger search using the Findoptions.

Selection: Accounts you have highlighted — see Selecting Records in a Listin the

Accounts list.

Edit: A list filter you have specified —see List Filters. This allows you store pre-

defined enquiries.

3. Specify the account(s) and press enter or click Calculate Now

If you enter an invalid code into the Codefield, the choices window will be
displayed — see Entry and Validation where a Code is Required).
Enquiries

Account Enquiries

Graphing Account Balances

To display the tabular information in graphical form:

1. Click the Graphtab

The information will be displayed as a graph, with the periods displayed
horizontally and the values vertically.

The historic opening, current, and closing balances for the nominated
accounts are displayed in the first three columns, with budget information
in the right hand three1. The periods are organised in descending order,
with the current period in the top row.

Include unposted: The balances shown are the current general ledger balances.
If you want to see the effect of any unposted transactions, click in the
Include Unpostedcheck box.

For enquiries on a single account code, if the account is departmentalised (Gold
only), you can specify either just the account code (which will give totals for the
account with all departments), or the code with a department suffix for a
specific department.

4. To view information for another account, enter the account code and

press enter, or for a complex enquiry click the Specifybutton

Tip: Pressing Ctrl-Shift-E (Windows) or ⌘-Option-E (Mac) will open a new

account enquiry window, allowing you to do side-by-side comparisons of
multiple enquiries.

Drilling down

You can “drill down” and see the individual transactions that affect the account
in a specific period:

1. Move the mouse over the row for the period whose

transactions you want to see

The cursor changes to a magnifying glass.

2. Click the mouse button

By default the graph displays information for the last twelve periods and
automatically selects the units on the y-axis and scales itself to fit in the
window.

Click on a row to
drill down

The values shown will be monthly movements for income and expense
accounts, and closing balances for balance sheet items.

The transactions for the nominated period will be displayed.

This is equivalent to clicking the Movementstab, but it only displays the period
that you click on.

To select the graph type: The information can be displayed as
a column or line graph by clicking the Columnand Line
Graphbuttons respectively.

To change the periods: You can select the range of periods

that you want on the graph by adjusting the From and To
period pop-up menus.

The graph buttons
determine the
chart type
Enquiries

To see a balance or drill down: Hold the cursor over the

appropriate data point or bar, and the period and balance
will be displayed. Click to drill down to the underlying
transaction lines.

To show budgets: Set the Show Budgetscheck box to display a

combined graph of actual and budget balances. A legend
is automatically provided.

Click a point or a
bar on the graph to
drill down

To show the average: Set the Show Averagecheck box to display a line

representing the average value of the actual balances displayed, calculated
over the selected period range. If sufficient data is available, a moving
average will also be displayed to indicate trends.

To print the graph: Click the Printbutton or press Ctrl-P/⌘-P. The graph will be

printed with the same aspect ratio as on the screen.

To copy the graph: Click the Copybutton and the graph will be copied onto the
clipboard for pasting into another application. Choosing Copy from the Edit
menu (or pressing Ctrl-C/⌘-C) copies the text from the account field.

To change the aspect ratio: Drag the graph resize handle (at top right of graph.

The graph size on the screen can be changed by resizing the enquiry
window in the normal manner.

Account Enquiries

Showing Account Movements

To display a list of account movements instead of balances or a graph:

1. Click the Movementstab

A list of all transactions against the account will be displayed.

Click on the column headings to sort the list. Double-click an item to view
the transaction.

Note: The account code column (if shown) will display in italics for system

lines—you cannot see system lines in the transaction itself (they show in
transaction list printouts—see To print the transactions in the list as
journals.

To change the period range: Use the from and to pop-up menus to adjust the

period range for which the transactions will be displayed.

To locate a transaction in the Transaction list: Highlight one or more

transactions and click the Related button.

To print the movements: Click the Printicon (or press Ctrl-P/⌘-P.). The list will
print out as shown on screen, including any columns you have added using
Customise List View. More detailed information, including a running
balance, can be printed using the Ledger Report2.
Enquiries

Account Enquiries

Finding Account Balances for a Range of Accounts

4. To select a new range, click the Specifybutton

You can extract summary figures for a range of accounts by account type,
category, classification, department or by matching the code against a pattern.

Account Code Matching

1.

In the Account Enquiry window, set the Selectmenu to Account Range

The Select Range of Accounts dialog box appears.

2. Use the pop-up menus to specify the accounts you want

MoneyWorks will include only those accounts which match all of the criteria
that you specify. If you don’t want to use a particular criterion in the
matching process, leave its pop-up menu set to Any(in the case of Code,
leave an “@” in the Code box).

For example, to obtain figures for all income accounts with a category of
XYZ, choose Incomefrom the Typepop-up menu and choose the category
XYZfrom the Categorypop-up menu. Leave the other pop-ups showing
“Any” and leave the wildcard character “@” in the Code box.

3. Click OK

MoneyWorks will add up the figures for all accounts matching the specified
criteria and display them in the historic balance grid.

To obtain figures for accounts whose account code matches a particular pattern,
type a code that includes the wildcard characters “@” and/or “?” into the Code
box (leaving the menus set to Any). The pattern can include a question mark (?)
wherever you want MoneyWorks to match any single character when searching
for account codes. For example, the pattern “?100” will select all 4-character
account codes ending with “100” (e.g. 1100, 2100, 3100, 4100, 5100 etc.).

An “@” symbol at the end of the pattern will match any sequence of zero or
more characters. For example, the pattern “?1@” will match all account codes
with a “1” as the second digit (e.g. 1100, 1101, 110223, 210100 etc).

The pattern can include a department specification as well. E.g. “1??0-?@” will
match all (4-digit) departmentalised account codes beginning with a “1” and
ending with a “0”. Note that the pattern “1??0-@” (without a “?” following the
hyphen) would match both departmentalised and non-departmentalised
accounts, since the “@” can match a zero character sequence (as in the code
“1000-”, which is recognised as the non-departmentalised account “1000”).

The same account code pattern matching facility is available in the Report
Generator—see Account Code.

Finding Balances for an ad hoc Selection of Accounts

You can use the Account Enquirycommand in conjunction with the Accounts list
to determine the balances for the current selection of accounts in the list. You
can choose the Selectionoption (which will open the Accounts list), or start at
the Accounts list (by choosing Show>Accounts, or pressing Ctrl-1/⌘-1). Then

1. Highlight the accounts for which you wish to show the balances

Use the Ctrl/⌘ key to make a non-contiguous selection.

2. Click the Enquirytoolbar button, or press Ctrl-E/⌘-E

The Account Enquiry window will open, displaying the aggregate balance
for the highlighted accounts. This may take a few seconds to calculate.
Enquiries

Product Enquiry

1. Choose Enquiries>;Product Sales or press Ctrl-7/⌘-7

The Product Enquiry window will be displayed.

2. For an enquiry on a single product, enter the product code and press enter
(or click Calculate Now); for an enquiry on more than one product use the
Selectmenu

This works in a similar manner to the Accounts Selectmenu.

The Graphand Movementstabs also operate on the selected accounts.

If you click the Specifybutton you will return to the Accounts list.

Tip: For a quick graph of your Profit and Loss, select the Profit and Loss sidebar,
highlight all the accounts in this by pressing Ctrl-A/⌘-A, and click the
Enquiriestoolbar icon.

Multiple Currencies

In Gold only, if you do an enquiry on a foreign currency
account, the amounts will show in the currency of the
account. Setting the Base Currency check box will display the
balances in the local currency.

Set the Base
Currencycheck box
to display in local
currency.

If you do an enquiry on accounts of mixed currency, they will display converted
to the local currency.

The sales information, including margins if available, will be displayed for
the product on a period by period basis. If you want to see the effect of any
unposted transactions, click in the Include Unpostedcheck box.

If you type in an incorrect code the product choices window will be
displayed. Double-click on the product required to enter it.

You can drill down to see the transactions for a particular period by holding
the mouse over the row for the period and clicking.

Product Enquiry

Viewing Product Purchases

You can enquire about the past sales and purchases of a particular product or
product range. The Product Enquiry operates in a similar manner to the Account
Enquiry, to which you should refer for a complete discussion.

The same screen can be used for either sales or purchases.

1. Change the Salespop-up menu to Purchases

To make a sales enquiry for a particular product:
Enquiries

The purchases for the product will be displayed.

Graphing Product Sales or Purchases

To graph the information on the enquiry screen:

1. Click the Graphtab

A graph of the product sales/purchases is shown.

The pop-up menu
determines
whether to show
sales or purchases.

Product Enquiry

You can print, sort, sum, and rearrange this list in the normal manner. To adjust
the period range, use the from and to pop-up menus.

Showing Backorders for the Product (Gold only)

1. Click the OrdersTab

Any incomplete orders for the product will be listed—the Qty is the
backorder quantity (i.e. ordered but not shipped).

2. Choose the data to graph from the Graph ofpop-up menu

You can graph quantity, cost, net sales in dollars, the dollar margin and the
percent margin for sales. For purchases you can graph the quantity or the
cost. You can drill down to see the transactions behind a data point on the
graph by clicking on it.

Showing Product Transactions

1. Click the Movementstab

A list of all transactions for the product will be displayed.
Enquiries

Customer & Supplier Enquiry

Customer & Supplier Enquiry

Payments History

Use the Customer Sales enquiry to see the past sales to a particular customer or
purchases from a particular supplier. This operates in a similar manner to the
Account Enquiry, and you should refer to that section for a complete discussion.

The Payments History enquiry (not available in Cashbook) enables you to find
information regarding invoices and payments (or receipts). Specifically:

To make a sales enquiry for a specified customer:

1. Choose Enquiries>Customer Sales or press Ctrl-8/⌘-8

The Customer Sales Enquiry window will be displayed.

• Find payments made on a nominated invoice
• Find invoices associated with a nominated payment (or receipt)
• Find invoices for a debtor or creditor
• Find payments to or receipts from a creditor or debtor
• Show a complete list of transactions for the debtor or creditor

To display the payments history window:

1. Choose Enquiries>Payments History or press Ctrl-H/Shift-⌘-H

The Payments History enquiry window will be displayed.

2. For an enquiry on a single customer, enter the customer code and press

enter (or click Calculate Now); for an enquiry on more than one customer
use the Selectmenu

This works in a similar manner to the Accounts Selectmenu

The net sales value will be displayed for the customer on a period by period
basis. You can drill down to see the transactions for a particular period by
clicking on the row for the period.

For a discussion on the various options —see Product Enquiry.

When you type a reference number or code into the Payments History,
MoneyWorks will check the Names file to see if the code is that of a valid debtor
or creditor. If not, MoneyWorks will attempt to find an invoice whose number
matches the code, and failing this, a cheque number that matches the code. If a
match is made, the appropriate transactions are listed, with the newest ones at
the top of the list.
Enquiries

Payments History

You can help MoneyWorks locate the information if you set the Look up bypop-
up menu to the type of item you are looking for (debtor code, creditor code,
invoice number or receipt number).

2. Type in the code of the name or the reference number of the transaction

and press keypad-enter or click the “tick” button

If you have already entered a reference number or code, and this is not a
valid debtor (creditor) code, the Names choices box will be displayed.

2. Type the debtor (or creditor) code and press tab or keypad-enter

The invoices and payments for the debtor /creditor will be listed.

The transactions that match the code that you specified will be displayed.
The transaction type is displayed in the left hand column, where “DI” is a
debtor invoice, “CI” is a creditor invoice, “CP” is a cash payment and “CR” is
a cash receipt.

Any associated transactions, such as payments on an invoice, or the invoice
relating to a cheque, are displayed under the transaction with their
transaction type indented slightly.

Order of Display

You can choose to display by invoice, by payment, or as a simple list.

By Invoice: Select the Invoicestab to have all invoices for the debtor shown with
the corresponding payments or receipts under each one, as shown above.

You cannot sort or sum the items in this list.

Finding Payments made on a Debtor or Creditor Invoice

1. Set the Look up bypop-up menu to Invoice Number

2. Type the invoice number and press tab or keypad-enter

The invoice and any associated receipt/payments will be listed.

Finding Invoices Paid with a Particular Cheque

1. Set the Look up bypop-up menu to Cheque or Receipt #

2. Type in your cheque number and press tab or keypad-enter

If the cheque number uniquely identifies one transaction, it will appear at
the top of the list followed by the invoices that it paid.

Finding Invoices or Payments for a Debtor (or Creditor)

1. Set the Look up bypop-up menu to Debtor Code (or Creditor Code)

If you are looking for unpaid invoices you will need to use this view, since
unpaid invoices do not show in the Payments view. Set the Incomplete Only
check box, to have only unpaid (or partly paid) invoices displayed.

Note that payments made for more than one invoice will appear multiple
times (once for each invoice).
Enquiries

Payments History

By Payment: Select the Paymentstab to have all payments made by the debtor

shown with the associated invoices under each one.

You must use by Paymentto find overpayments as they do not show in the
list by Invoice. In fact if you set the Incomplete Onlycheck box, only
overpayments for the debtor will be displayed.

Note that invoices that have been paid by more than one transaction will
appear multiple times (once for each payment).

All transactions: Select the Alltab to display all transactions related to the

debtor/creditor as a simple list, which can be sorted and customised
(additional columns displayed) in the normal manner.

Tip: If you want a report with a running balance of the outstanding amount for
a debtor, use the Balance History from Datestatement form. You can print
this in the same manner as any other statement — see Printing and
emailing Statements, but enter the start date into the Statement Date field.

1 The budget information is taken from the A Budget — see Entering Budget
Data.↩

2 Prior to MoneyWorks 7, a report similar to the ledger report could be printed
from the Account Enquiry.↩
