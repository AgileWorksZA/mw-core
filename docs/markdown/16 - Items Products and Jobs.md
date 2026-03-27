# Items, Products and Jobs

Items, Products and Jobs

Items, Products and Jobs

Often in business you purchase or sell the same items or services over and over
again. The item and product system within MoneyWorks can facilitate this
process by allowing you assign descriptions and prices to commonly used items.
A further advantage is that you can then track item sales and purchasing trends
over time, see what sort of customers purchase what type of products etc.

The Items File

An item is anything that you buy or sell on a regular basis. It may be something
intangible, such as consulting services, or an actual physical product, such as a
magazine. In MoneyWorks you can create items and then use them in your
normal accounting transactions. You can also use the Enquiry and Analysis
features to determine what happened to these items (for example, which
customers purchased which products).

Note: This section refers to MoneyWorks Cashbook and MoneyWorks Express

only. MoneyWorks Gold has much more extensive product options than are
described here, and users should refer to Items, Products and Inventory.

Before you can use the item features of MoneyWorks, you need to define your
items. At the least, each item requires a code, and it will probably also have a
description and a price. You will also need to indicate which general ledger
codes will be used to account for transactions involving the item.

You can also create items “on the fly” as you enter a transaction — see Creating
a Record “On the Fly”.

To display the items file1:

1. Choose Items from the Show menu or press Ctrl-3/⌘-3

The Items list window will be displayed.

Creating a New Item

To create a new item:

1. Choose New Item from the File menu or press Ctrl-N/⌘-N

The Item Entry window will open.

2. Enter a code for the item in the Codefield
Items, Products and Jobs

The code is used to uniquely identify the item. It can be up to 31
alphanumeric characters long.

3. Type the description of the item in the Namefield

This can be up to 255 characters long, and will be transferred to the
description field of the detail line of a transaction whenever the item is
used in a transaction.

The Items File

This can be two characters (e.g. “Ea” for each, “Kg” for kilogram)

9.

If the sell price includes GST, set the Tax Inclusivecheck box

Override Tax code: You can force a different tax code on the sale by setting the

tax override to a specific tax code. For example if you are in Australia and
this particular item is GST Free, you would set the tax override to "F". Note
that this setting is subservient to any tax override associated with the
customer.

The categories are used for analysing how the item is used, and you can use
them how you wish. For example, in the first field you might enter “TIME” if the
item represents a staff member’s time, or “MAT” if it represents material.

If you buy this item

4. Type any comments in the Commentfield, and set the Colourif desired

10. Set the Buy this Itemcheck box

If you sell this item

5. Set the Sell this Itemcheck box

The selling information fields for the item will be enabled.

The Sell this Itemcheckbox must be set otherwise you will not be able to
use the item in receipt (sales) transactions.

6.

In the Income Account when Sellingfield, specify the general ledger
account code that will be credited when the item is sold

You must fill in this field with a valid general ledger code. If you tab through
the field, the account choices window will be displayed. You should
normally specify an income account here.

The default GST/VAT or Sales Tax used in the sales transaction is based on
the tax code that is associated with this selling account.

7. Enter the selling price into the Sell Pricefield

This is the default price that will be displayed when the item is used in a
cash receipt transaction.

8. Enter the units of sale into the Perfield

The fields requiring information for buying the item will enable.

The Buy this Itemcheckbox must be set otherwise you will not be able to
use the item in payment (purchase) transactions.

11.

In the Expense Account when Buyingfield, specify the general ledger
account code that will be debited when the item is purchased

You must fill in this field with a valid general ledger code. If you tab through
the field, the account choices window will be displayed. You should
normally specify an expense account here.

The default GST/VAT or Sales Tax used in the purchase transaction is based
on the tax code that is associated with this purchase account. Note that
unlike GST or VAT, Sales Tax (such as PST in Canada) will be automatically
included into the cost of the item by MoneyWorks for purchases.

Override Tax code: You can force a different tax code by setting the tax override

to a specific tax code. Note that this setting is subservient to any tax
override associated with the supplier.

12. Enter the purchase price into the Buy Pricefield

This is the default price that will be displayed when the item is used in a
cash payment transaction.
Items, Products and Jobs

The Items File

The buy unit is defined to be the same as the sell unit. If you want to change this
(and you do not buy the item) you need to set the Sell this Itemoption, change
the units, and then reset the Sell option.

Printing a Product List

To print an item/product list:

13. Click the Nextbutton (or press keypad-enter) to save this entry and create

another, or click OKto save the entry and return to the item list

1.

If the item list is not displayed, choose Items from the Show menu, or
press Ctrl-3/⌘-3

Clicking Cancelwill discard the entry or any changes made.

If you want to count this item

14. Set the Count this item check box

When this option is set, a count will be kept of the number of items you
purchase, less the number that you sell. In theory this will be the number of
items that you actually have. Note that this is a simple count, which you can
modify at any time by changing the count value, and that no inventory
accounting is done (for that you need the full inventory feature in
MoneyWorks Gold, as described in Stock Control.

Modifying and Deleting Items

You can modify a item entry by double-clicking on it in the normal manner.

You can delete a item regardless of whether or not it has been used in
transactions. However if a item is deleted, you will not be able to post any
existing transactions that use it2. Recurring transactions that use the item will
recur correctly, but you will not be able to post them.

You can change the code for an item if you wish. The old item ceases to exist,
and the new item inherits all the attributes (except the code) of the old. Existing
transactions that use the old item code are not changed, as is the case when
changing the code for an account or name.

If you change the price or description for a item, any recurring transactions
involving that item will use the new price, description and control accounts
when they recur.

At this point, you may like to use the search and sort functions (under the
Select menu) to isolate the items that you wish to print.

Tip: The report you print will have the same columns as shown on the screen, so
if you customise the list — see Customising Your Listyou can configure your
own report.

1. Select Print from the File menu, or click the Print Listtoolbar icon, press

Ctrl-P/⌘-P

The Print dialog box will be displayed.

2.

If you only want to print the highlighted transactions, set the Print
Highlighted Records Onlycheck box

3. Set the Output topop-up to Printer(or Preview, emailetc)

4. Click the Print(or Preview, Sendetc) button

The product list will be printed. If Cancelis clicked, no list is printed.
Items, Products and Jobs

Item Reports and Enquiries

Creating a New Job

The Job file

Use the Item Sales enquiry (in the Reports menu in Cashbook and Express) to
see details and patterns of selling (or buying) behaviour for individual items or
groups of items. This is discussed in Product Enquiry.

To create a new job (not Cashbook):

1. Choose Show>Jobs or press Ctrl-4/⌘-4

There are also a number of product reports in the list sidebar. These work on
the highlighted item(s) in the item list, or all items if you have not highlighted
any.

The Jobs list will be displayed

2. Choose Edit>New Job or press Ctrl-N/⌘-N

The Job file

The Job entry screen will open

If you are in a service based industry you may be selling time, and need to track
direct expenses made in the course of doing jobs. MoneyWorks allows you to
tag each line of a transaction with a job code to facilitate tracking of
disbursements and costs. In addition, it provides a job list which contains
summary details about particular jobs (this is not available in Cashbook).

MoneyWorks Express supports limited “job tagging”, whereby individual
transaction lines can be associated with specific jobs.

MoneyWorks Gold supports job tagging and a comprehensive job tracking,
which includes entry and recording of time data, automatic trapping of
disbursements, and the automatic generation of invoices.

Note: This section covers job tagging only—for details of the full job costing

system — see Job Control.

Job code This is the code to identify the job. It can be up to seven alphanumeric

characters long. You must specify a unique code for every job.

Name This is intended to provide a brief (255 character) summary of the job.

Client The code of the client for whom the job is being done. You must specify
this, and the client must be a debtor (otherwise you will not be able to
invoice them).

Colour Colour is for your own use to easily identify jobs (e.g. Red for urgent).

Categories These are used in the same way as Item and Name categories for

reporting, analysis and enquiries.

Modifying a Job

To change information about a job:
Items, Products and Jobs

The Job file

1. Locate the job in the Job file list and double-click it

1 In MoneyWorks 5 and earlier, this was referred to as the Products file.↩

2 If you do inadvertently delete a item, you can re-enter it.↩

The job window will open.

2. Change any information that you require

3. Click OK

Note that if you change the job code, the job will be disassociated from any
existing job sheet items and you will not be able to invoice or delete these
items.

Deleting a Job

To delete a job:

1. Highlight the job(s) to be deleted

2. Choose Edit>Delete Job or click the Deletetoolbar button

You will be asked for confirmation before the job is deleted.

Note: Transactions associated with the job are not affected when the job is

deleted.

Job Tagging Reports

The reports with the prefix “JT” are used for Job Tagging. These are based on
transactions whose detail lines have been tagged to a job.

JT Account Provides a list of the account codes used on the highlighted jobs,

with the net amount allocated to each account, separated into Income and
Expenses.

JT Resource Shows the income by resource used on the highlighted jobs. Both

the quantity and the net is shown.

JT Resource Usage For each of the specified resources, shows the quantity and

net that have been invoiced out by job.
