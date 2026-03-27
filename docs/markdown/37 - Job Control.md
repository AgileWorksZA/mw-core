# Job Control

Job Control

Job Control

Tracking expenses, time and other resources associated with job or project work
is easy in MoneyWorks.

There are several levels of job tracking available, and your own needs will
determine which is most appropriate.

Job Tagging:

You can tag transaction detail lines with a job code. Thus if you purchase
something specifically for a job, or prepare an invoice for a job, the appropriate
parts of the transaction can be tagged to the job. Subsequently you can use an
analysis report to look at the revenue and/or costs for the job.

Job tagging only operates on actual accounting transactions. When you make a
purchase or a sale, you tag it to a specific job. Time sheets and stock requisitions
cannot be entered.

To enable job tagging you must set the Show Job column in transaction entry
windowoption in the Job Control preferences. Job tagging is discussed in The
Job file—this chapter deals primarily with Job Tracking.

Job Tracking

You maintain a job file, and a job sheet for each job. The job sheet can record
resources used in the job such as labour, disbursements and stock requisitions.
Any accounting transactions that are tagged to the job will automatically be
entered into the job sheet when the transaction is posted.

Thus the job sheet will accumulate a complete history of all expenses and
income related to a job, as well as all resources used. Summary reports can be
printed from the job file to help invoicing, or you can use the Bill Jobcommand.

To enable job tracking you must set the Enable Job Costing and Time Billing
option in the Job Control preferences.

Note: Because of the large volume of information which must be kept for full
job tracking, your MoneyWorks file may become very large. To keep your
file size at a reasonable level, you should consider deleting each job as soon
as possible after you no longer require to report on it.

Setting up Your Jobs

You need to specify in the Job Control Preferences that you want to do job
control, and what degree of job control you want.

Job Preferences

Before you can start using jobs, it must be enabled in the Preferences.

1. Choose Edit>Document Preferences

The preferences will be displayed.

2. Click on the Jobstab

The Job Control preferences will be displayed.

The job control preference options are:
Job Control

The Job file

Show Job column in transaction entry window: If set, an additional column, the
Job column, will be displayed in the detail line area of the transaction entry
screen. This column can be used to enter a job code to tag that detail line as
being associated with a job.

Treat Job-Related Income as Pre-Payments Turning on this option will cause job

related income transactions to be transferred as pending (instead of
processed) job sheet items. Turn this on if you create invoices (or receipts)
coded to the job before work on the job has been done (e.g. a deposit or
pre-payment on a job), and this income needs to be offset against
subsequent work.1

The additional job column will appear in all transactions except journals. It
is not possible to associate a journal with a job.

The Job file

You must set this option for job tagging.

Allow any value in job column: Normally when you type an entry into the job

column of a transactions detail line MoneyWorks will check to see that the
entry refers to a valid job. If the Allow any value in job columnoption is set,
you will be able to type any value into the job column. This option and the
Enable Job Costing and Time Billingoption are mutually exclusive.

The job file contains summary details about particular jobs and is presented as a
list, with sidebar tabs representing the possible status for a job. For job tagging
there is only one tab, whereas for job tracking there are a set of tabs that
represent the job progress.

To view the Job list:

1. Choose Show>Jobs or press Ctrl-4/⌘-4

This option cannot be set if you want to do job tracking.

The Jobs list will be displayed

Enable Job Costing and Time Billing: With this option set, any transaction detail

lines that are tagged to a job will be transferred to the Job Sheet file when
the transaction is posted, thus automatically tracking direct costs associated
with a job. In addition various job billing facilities become available.

Setting the Enable Job Costing and Time Billingoption enables full job
tracking.

Default Markup: The default percentage markup applied to the cost of items

used in the job.

Default Work-in-Progress Account: Any work done on a job that can be (but
which has not yet been) invoiced out is called work in progress. This is an
asset for your organisation, because at some stage in the future it can be
converted into cash.

As an asset, it can appear on the balance sheet, and you can transfer it
there by using the Work-in-Progress Journalcommand. The default work in
progress accountis the default account code for new jobs.

The sidebar tabs are:

Quoted: This is for jobs or projects for which you have quoted or tendered, but

for which the quotes or tenders have not yet been accepted (or declined)
by the customer. When new jobs are created they are automatically made
as Quoted.

Active: This is for jobs which are currently in progress. Charges and job sheet
entries can be made against active jobs, and they can also be billed out.
When a charge or job sheet entry is made against a quoted job, it
Job Control

automatically becomes active.

Completed: This is for jobs which are essentially complete. A job becomes

complete when an invoice is created for it with the Final Invoiceoption set.
You can only make charges and job sheet items against a completed job if
you have the Use Completed Job privilege set — see MoneyWorks
Privileges.

All Jobs: All jobs are listed under this tab (this is the only one available if full job

tracking is not on).

Creating a New Job

Jobs can be created automatically from quotes using the Accept Quotes as Jobs
command — see To turn a quote into a job.

To manually create a new job from the Job list:

1. Choose Edit>New Job or press Ctrl-N/⌘-N

The Job entry screen will open

The Job file

This is where you can enter or view the details of a job. The window is
tabbed—the background information to the job is contained in the Job Details
tab, while general comments can be entered under the Commentstab. The
other tabs show pending, processed and budgeted work against the job.

Code: A unique code to identify the job—up to nine alphanumeric characters.

Name: A brief (255 character) summary of the job.

Client: The code of the client for whom the job is being done. You must specify

this, and the client must be a debtor (so you can invoice them).

Colour: Colour is for your own use to easily identify jobs (e.g. Red for urgent).

Status: The status of a job can be Quoted, Active or Complete, and determines
the tab in the Job list under which the job is displayed. This is normally
maintained by MoneyWorks, defaulting to Quoted for new jobs, and
changing to Active when a job sheet item is put against the job.

Categories: These are used in the same way as Product and Name categories for

reporting, analysis and enquiries.

Project: If the job is a part of another job, the parent job code can be specified

here. If used, the job must already exist.

Manager: The initials of whoever in your organisation is responsible for the job.

Work-in-Progress account: This will be by default the work-in-progress account
specified in the job preferences. If you change it, it must be a current asset
account. It is only used by the Work-in-Progress Journalcommand.

Billing: The Billing field reflects the basis on which you intend

to invoice the job. There are two billing methods:

Quote: Used where you have provided a fixed price
quotation for the job. The amount of the quote is entered into the Quoted
field.

Cost Plus: Used where you intend charging for resources and products use
in a job at a rate based on their cost. The percent markup that you will add
to resources is entered into the markup field. For new jobs this will default
Job Control

to the value that you set in the Job Control preferences.

Note that MoneyWorks always tracks the costs of the job, regardless of
what billing method you have selected.

Billed to Date: You cannot alter the Billed to Date amount—it is updated

automatically whenever a sales invoice is posted that contains a detail line
tagged to the job.

Note that if you change the job code2, the job will be disassociated from any
existing job sheet items and you will not be able to invoice or delete these
items.

The Job Sheet File

Deleting a Job

A job can only be deleted when its status is Completed. To delete a job:

% Complete: For your own information, the percent of the job that has actually

1. Set the tab in the Job list window to Completed

2. Highlight the job(s) to be deleted

3. Choose Edit>Delete Job

You will be asked for confirmation before the job is deleted.

Note: When the job is deleted, all associated Job Sheet entries, whether billed
or not, will also be deleted. You should check that a job has been fully
invoiced before deleting it. Transactions associated with the job are not
affected when the job is deleted.

The Job Sheet File

The job sheet file records individual entries and budgets against jobs. It is only
available if the Enable Job Costing and Time Billingjob preference option is set.
The entries are displayed in a standard tabbed list view.

been compete. This is not maintained by the system.

Start Date: The date on which the job starts. Will default to today’s date.

Target Date: The expected end date of the job.

Finish Date: The required end date of the job.

Customer Order No: The client’s order number for the job.

Contact Person: Who (at the client’s organisation) has responsibility for the job.

Phone: The phone number of the contact person.

Custom: Four fields for your own use. The first two can hold 255 characters, the

last two 15 characters each.

Comments: Any comments (up to 1020 characters) about the job. This field is

available under the Commentstab of the Job entry screen.

Modifying a Job

To change information about a job:

1. Locate the job in the Job file list and double-click it to open

2. Change any information that you require

3. Click OK
Job Control

The Job Sheet File

Entries against a job can include resources used such as time, disbursements,
stock and products. These can be actual or budgeted amounts.

The sidebar tabs in the view are:

Actual: All actual job sheet items (both Pending and Processed).

Pending: All actual job sheet entries that have been entered but not invoiced.

Processed: All actual job sheet entries that have been invoiced to the client.

Budget: All budgeted job sheet items.

Actual job sheet entries can be entered into any of the Actualsidebar tabs, or
can be created automatically when a transaction tagged to a job is posted.
Budget job sheet entries can only be entered in the Budgetsidebar tab, or
created automatically when a Quote is accepted as a Job — see When a quote is
accepted.

To Manually Enter a Job Entry

1. Choose Show>Job Sheet Items or press Ctrl-5/⌘-5

The Job Sheet Items file will be displayed.

2. Make sure the sidebar tab is not set to Budget

3. Choose Edit>New Job Sheet Item or press Ctrl-N/⌘-N

The Job Sheet entry window will be displayed.

4. Type in the Job Code for the entry and press tab

The job description will be displayed, and any selling Sticky Notes
associated with job will appear.

If you enter an invalid code the choices window will be displayed, allowing
you to select the correct code or create a new job by clicking New.

5.

In the Qtyfield, type in the quantity of the item used

This can be any class of product that you sell.

6.

In the Product/Resourcefield, enter the code for the item used

The item description, sell unit, memo and the pricing details will be
displayed. This field must be filled in for every job sheet entry.

If you enter an incorrect code, the choices window will be displayed. Select
the correct item by double clicking, or click Newto create a new product.
Note that the item’s barcode can be used instead of its code.

If the product is a stock item, a message is displayed in the window and
special action is taken by MoneyWorks — see Stock requisitions.
Job Control

The Job Sheet File

Note: If you have Location Tracking turned on, a Locationfield will be available
to enter the location from which the stocked item was taken (leave empty
for the default location.

The Cost, Chargeand Accountfields will be filled out automatically for you
based on the resource used, and can be altered if required. Costs and charges
are always assumed to be in the local currency.

Similarly if you have Serial/Batch tracking enabled a Serial/Batch field will
be available for the serial/batch number of the serialised inventoried items.

12. Enter any additional comments into the Comment field

This is for internal use only, and will not appear on any invoice.

7. Change the Datefield if necessary

This is the date that the resource was used on the job.

8. Enter whatever you wish is the Analysisfield

The analysis field can be used for whatever you require—e.g. the initials of
the person whose job sheet is being entered. Note that this and the Activity
Code field can be controlled by Custom Validations.

9. Enter an Activity Code, if any

Unless associated with a custom validation, this is a free form code.

10. Enter the Cost Centrefor the product if desired

The cost centre must be a valid department code. If the Income Account
when Sellingfield of the item is set to a departmentalised account, this
department will be automatically entered into the Cost Centre field.

11. Change the Memofield if required

This defaults to the description of the resource entered. It can be up to 255
characters long, and is a description of what the entry is for. It will appear
on the invoice if the Itemise in Descriptionoption is set in the Bill Job
window.

13. Click the Nextbutton or press keypad-enter to save the entry and display

a new entry screen, or OKto save and close the window

If Cancelis clicked, the entry is not saved.

Configuring the Job Sheet Entry Window: You may not wish to use all the fields
in the Job Sheet entry window, or, if you are entering batched information,
a given field might always contain the same information. You can configure
the Job, Product/Resource, Analysis and Cost Centre fields to retain their
value and/or to be omitted when you tab through the fields. To configure a
field. You can also configure the Analysis and Activity Codes to require
custom validations:

1. Right click in the field, or if you are persevering with a single button Mac

mouse, hold down the control key and click in the field

A pop-up menu with configuration options will be displayed.

2. Select the option you require and release the mouse

The available options are:

Tab Into: Pressing tab while in the previous field will move you into this field;

Don’t Tab into: The field will be bypassed when you press tab;

Remember Value: The previous value that you typed into this field will

automatically appear in a new job sheet entry;

Clear Each Time

The field will be blanked between each new entry.
Job Control

Automatic Entry from the Transaction File

Transaction.Analysis
Detail.AccountCode

Analysis
Account

The Job Sheet File

When the Enable Job Costing and Time BillingJob preference item is set, details
from each transaction detail line that is tagged to a job will be automatically
transferred to the Job Sheet list when the transaction is posted., e.g. the line:

when posted creates the following Job Sheet Entry:

Entries that are automatically created from a transaction in this manner should
not normally be altered or deleted—this is signified by the display of a padlock
in the right hand column of the Job Sheet Items list. The following is transferred:

Transaction Record

Job Sheet Entry

Transaction.TransDate
Detail.JobCode
Detail.Qty
Detail.StockCode
Detail.Unit
Detail.Description
The department suffix from the detail. account (if any) Cost Centre

Date
Job
Qty
Resource
Unit
Memo
The Cost will always be the current standard cost of the item. The Charge will
vary according to the Job Pricingsettings in the product .

Transferring from service transactions: It is mandatory to specify a product in
the Job Sheet Entry file. However in a service transaction no product
information is given. When the detail line from a service transaction is
transferred, MoneyWorks will give it a product code “JOB_MISC”, and a
quantity of 0.

If the product JOB_MISC does not exist, it will be automatically created. The
cost of the item will be taken from the transaction detail line, and the
standard markup for the job (or the default markup if the job is on a
quotation basis) will be used to determine the charge price for the job.

If you want to use a different pricing regime for these items, you should
create the JOB_MISC product yourself, and set its job pricing as desired.

You can enforce the entry of a job code in a service transaction by setting
the Job Code Required option in the Accounts entry screen.

Transferring from transactions involving inventory: If you tag a transaction

detail line that refers to a stocked product, the inventory levels for the item
on the detail line will not be affected. If the item is purchased, it is assumed
that it is being purchased specifically for the job, so the item’s cost of goods
account is debited instead of the stock account3; if it is being sold, it is
assumed that the item has already been requisitioned from stock through
the job sheet items, so the incomeaccount for the job is credited instead of
the stock account. But see Stock Requisitionsfor the exception to this.

Transferring from Income Transactions: Normally tagged income detail lines will
be transferred as processed job sheet items, on the assumption that the
work has already been done for the job. This is what normally happens
when you post an invoice created by the Bill Jobcommand. However if, for
example, a deposit has been prepaid on a job, this may not be true. Income
detail lines can be transferred as pending job sheet items if the preference
option Treat Job Related Income as Pre-Paymentsis set. This allows you to
offset previous income against work done.



Timesheet Entry

A confirmation box will be displayed

3. Click OKto delete the records

Job Sheet Entries are also deleted when the job is deleted. Note that you should
not delete a Job until you no longer require reports on it.

Timesheet Entry

As well as entering Job Sheet items individually through the Job Sheet Item list,
MoneyWorks allows “batch” entries through the job “timesheet”. Although
termed a “timesheet”, information can be entered by resource (user), job, date
and cost centre. To enter job sheet information by a timesheet:

The Timesheet Entry window can also be used as an easy way to enter job
budgets.

1. Choose Command>Job Timesheet

The Timesheet entry window will open

Job Control

Modifying Job Sheet Entries

Pending job sheet items can be modified or deleted, although entries that have
been automatically created from a transaction record (shown with a grey
padlock next to them) should not need to be modified or deleted (if they are,
the job sheet summary will no longer be the same as the accounting record).
Entries that have been processed (billed) cannot be modified, but they can be
deleted.

Note: Pending job sheet entries that involve stocked products can be deleted,
even though a stock requisition journal was made (and posted) when the
entry was made. If the item was returned to stock, make a correcting job
sheet entry with a negative quantity instead of deleting the original.

To modify job sheet entries:

1. Highlight the record(s) to modify in the Job Sheet Entries list

2. Choose Edit>Modify or press Ctrl-M/⌘-M

Double click a single record to modify it.

3. Make the required changes to the record

4. Click OKor Nextto save the changes

An alert will show if the record cannot be modified.

Note: If you change the code in a job sheet item that was created when a
transaction was posted, the code in the appropriate detail line of the
originating transaction will also be updated.

Deleting Job Sheet Items

There are certain restrictions (discussed above) to deleting job sheet records.

1. Highlight the record(s) to delete in the Job Sheet Entries list

key value into the for field, and press tab

2. Set the Timesheet by pop-up to the desired main entry method, enter the

2. Choose Edit>Delete Job Sheet Items
Job Control

Stock Requisitions

For example, if you are entering your time you would set the pop-up to
Resourceand the for field to your code for time; if you have used the Job
Bagform to collect information about a single job, you would set the pop-
up to Job, and put the job code into the for field.

Note that the entry columns are determined by the setting of the pop-up
menu. Pressing tab would have taken you to the first line, provided that you
had made a valid entry in the for field (if you entered an invalid code, the
Choices window would have been displayed).

3. Enter the required details into each field

Tips on Timesheet Entry

• Use the return key to move to the start of the next line (saves tabbing to

the end). If necessary a new line will be created;

• Use the Up and Down arrow keys to move vertically through lines on the

timesheet screen;

• Click the Deleteicon, or press Ctrl-Shift-D/⌘-Delete, to delete the current

line:

• You can have more than one timesheet open at once—simply choose

Command>Job Timesheet

Use the tab key to move you between fields (shift tab to go backwards). The
return key will move you to the next line, creating it if need be.

Stock Requisitions

The fields are described in To Manually Enter a Job Entry.

Note: Cost and charge amounts are always assumed to be in the local currency.

Note: Once you have entered data into the timesheet, you cannot change the

Timesheetpop-up until you Acceptor Discardthe current entries.

4. When all the details are entered on the timesheet, click Save Entries as

Actuals

The entries will be checked—if there is anything that needs fixing (such as a
blank required field), a notification will be displayed. You need to correct
these before the timesheet can be accepted.

Note: If you are entering job budgets instead of actual time sheet entries, click

the Save Entries as Budgetsbutton.

Clicking Discard will, after prompting, discard the entries.

When a timesheet is accepted, individual job sheet records are created for each
line on the timesheet form; these can be seen in the Pendingsidebar tab of the
Job Sheet Items list. Note that the original timesheet entry window cannot be
recreated (it is for batch entry only, not for subsequent editing). Instead if
necessary edit the items in the job sheet items list.

It is often necessary to requisition stock items for use in a job. For example, a
sail maker you will have stock of sail cloth. When making a sail for a client, the
necessary cloth will be extracted from the store room and used for the job.

Stock requisitions can be handled by simply creating an entry in the job sheet
file for the quantity of the item used. When a stock item is used in this manner,
a message is displayed in the job sheet entry window:

When the OKor Nextbutton is clicked, a stock requisition journal is
automatically created and posted (even if the stock item is out of stock), so that
the stock level is reduced4. The journal will be have the same date as that on the
job sheet item. Because of the accounting transaction associated with it, care
should be taken in subsequently modifying or deleting such a job sheet item.

Stock items entered into the Job Timesheet window will also generate a stock
requisition, but no warning is given.

Note: If the item is serialised, you will need the enter the serial/batch number

into the serial number field. Similarly a location field will be visible if the
Stock Location trackingoption is on.
Job Control

Cost and Sell Pricing

Important: In general, transaction detail lines involving stock items that are

tagged to a job will have no effect on the actual stock level. For purchases, it
is assumed the item is being purchased specifically for the job. For sales, it
is assumed that a stock requisition has been made through the job sheet
file as described above, and is just now being invoiced out. The one
exception to this is stocked items that are received before the invoice is
processed: these go into stock and must be requisitioned separately.

Cost and Sell Pricing

Maintaining correct costs and chargeouts is critical to job costing. When you
enter a job sheet item, MoneyWorks automatically enters the cost and sell price
for the item.

Note: All prices that are used in the job sheet file are GST/VAT/Tax

exclusive—this will be added (if appropriate) when you invoice the job.

Note: Costs and prices are converted into the local currency in the job system. If

you bill the job to a client using a different currency, the invoice is
generated in the client’s currency based on the system exchange rate.

Sell Price

The sell price is what you expect or normally sell the item for. It is entered in the
job sheet for information only, and is not a commitment to sell the product or
resource at that price. It is based on the client’s Price Code, discount and
quantity price breaks at the time of entry.

The real sell price is determined when you invoice the job out, and may bear no
relationship to the calculated sell price for the job. Indeed the individual items
that have been entered in the job sheet may not appear at all on the final
invoice, and hence may not have a real sell price. Only the total job itself will
have a value.

The Standard Costs fields relate to costing information, while the Job Pricing
pop-up menu is used to determine charges for the item.

Standard Cost: This is the standard cost that will be used in job costing. If the

product is purchased the last discounted purchase price of the item is used.
For non-purchased items you can specify a “standard cost”. This represents
the estimated cost to you of providing the item—determining a standard
cost is something of a black art.

Cost Account: This is the cost account for the item for work in progress

purposes, which can be specified here for non-purchased items. For
purchased items, this will be set to the cost of goods account as specified in
the Detailstab.

Note: This account is used to create the work in progress journal. If there is
no cost account specified then costs associated with this resource will not
be considered as work in progress.

Costs with Job Tracking

Use Product Sell Price: The sell price is that of the sell price in the product file.

How the costs and markup are calculated for products and resources when the
Job Control preference Enable Job Costing and Time Billingis set is determined
by the settings in the Costing panel of the Product entry-screen.

If the product is entered into the job sheet file directly, the buy price of the
product is used to determine the cost price, and the sell price of the
product determines the sell price. If the item is a stocked product, the
Job Control

The Work-in-Progress Journal

average unit price is used to determine the cost price (and a stock
requisition journal is created).

line. The first of these is shown below.

If the product is entered into a transaction detail line associated with a job,
the cost price is the actual price paid as specified in the detail line, even if
the product is a stocked item.

Use Job Markup applied to Std Cost: The sell price is determined by applying
the standard markup for the job to the cost. The cost is determined in the
same manner as in the Use Product Sell Priceoption.

Use Undiscounted Purchase Price: This only affects products entered through a
transaction, and not through the job sheet entry. The product must be
purchased and sold, and not a stock item.

Consider the following: Part of the service of an interior decorator is the
supply of fabric. Conceivably each possible fabric could be entered as a
product, with its own code and price. However with thousands of possible
fabrics, each with a different colour, width and price, and with designs being
added and discontinued each day, the maintenance of such a product file
would be immense. The Use Undiscounted Purchase Priceoption is
designed for this situation.

Following on from the example above, a generic product with a code of
FABRIC could be used, with no buy or sell price specified (these would vary
depending fabric type), with the Job Pricing set to Use Undiscounted
Purchase Price. Let’s say we purchase two lots of fabric for job 102. We
enter the purchase as either a creditor invoice or a cash payment
(depending upon how we paid for it). The detail lines of the transaction will
be:

Here we have entered the recommended retail price of the fabric (per unit)
into the Unit Price field. This is how much we intend to charge the client for
it, and hence this will become the sell price. However we actually pay less
than this for the fabric, and we enter the total amount paid (less GST/VAT/
Tax) into the extension column. This becomes the cost price of the item.
When the transaction is posted, a job sheet item is created, for each detail

In summary, when products with Use Undiscounted Purchase Priceset are
transferred from a transaction to a Job Sheet, the sell price is determined by
the UnitPrice x Qty, and the cost is set to the (discounted) Extension.

The Work-in-Progress Journal

A Work-in-Progress journal can be created at any time. This is a reversing journal
that determines the value of your work-in-progress at a point in time. You will
need to do this at the end of the financial year, and possibly at each month end.

The journal is created by scanning all pending job sheet items dated on or
before the journal date. The expense items in these are summarised by account
code and by work-in-progress account. The journal debits the work-in-progress
account(s), and credits the expense accounts. Entries with no expense account
code will be ignored.

The journal will be set to automatically reverse at the start of the next period,
crediting the work-in-progress account and debiting the expense items. Thus the
work-in-progress journal will correctly carry forward unbilled jobs to the next
financial year.

To create the Work-in-Progress journal:

1. Choose Command>Work-in-Progress Journal
Job Control

Job Billing

The Job WIP Journal Creation window will be shown.

Creating an Invoice for a Job

2. Set the Periodfor the work-in-progress journal

This will normally be the current period. The journal will be dated on the
last day of the period.

3. Click Do It

The unposted journal will be created and displayed. This is a standard
general ledger journal which is set to reverse on the first day of the next
period. It includes all unprocessed job sheet items dated prior to the last
day of the selected period that have an associated expense account.

4. Click OKto save the journal, or Cancelto discard

If you also set the post option the journal will be posted.

Job Billing

At some point you will want to create an invoice for the job. This can be done at
any stage after you have created the job in MoneyWorks, and you can raise as
many invoices for a job as you want— there might, for example, be a pre-
payment on the job, the job might be invoiced out in a number of
predetermined amounts, or there might be a single invoice for the whole job.

When you bill a job, you are asked what items to include in the invoice, how
much to invoice and what form the invoice should take. The invoice is then
generated for you (as an unposted transaction), and you have the opportunity
to alter it if you need to.

To create an invoice for a job:

1. Choose Command>Bill Job or press Ctrl-\/⌘-\

The Bill Job window will be displayed.

2. Enter the code for the job you wish to invoice and press tab

A list of unprocessed job sheet items will be displayed. These are the items
that have not yet been accounted for in previous invoices. Items in this list
that are highlighted (they are all highlighted by default) will be included in
the next invoice.

Note: If there are any outstanding purchase orders or unposted transactions
against the job, a warning message will be displayed at the bottom of the
window.

Note: If the job code is also a project code, any job sheet items for jobs

belonging directly to the project will be included and able to be billed out.
However the warning for unposted/incomplete will only be shown for
Job Control

transactions that relate to the project, not to the sub-jobs.

3. Click on any items in the list that you do not wish to invoice

Whenever you click on an item, its highlighting will be turned off. Clicking
on the item again turns the highlighting on.

Itemise by: There are many different ways in which you can create an invoice.

You might for example just want a simple invoice that says “As per
quotation”, or alternatively you might want to itemise every item used. This
is determined by the itemise bypop-up menu, whose options are:

simple: A single line service invoice will be created. The income account will
be that specified in the miscellaneous items income account. When the
invoice is created you will need to enter the text to appear on the invoice,
unless the Itemise in descriptionoption is set (see below).

date and resource: Each job sheet item is presented on the invoice in date
order.

resource: Job sheet items are accumulated by resource, and a single invoice
line is generated for each resource used in the job.

account: Job sheet items are accumulated by (income) account, and a single
invoice line is generated for each account used in the job.

cost centre: Job sheet items are accumulated by cost centre, and a single
invoice line is generated for each cost centre—you must supply a
departmentalised account whose group contains the cost centres.

Job Billing

The memos made in the job sheet items will be gathered together and will
appear on the appropriate invoice lines. This option is not available for all
invoice types.

Miscellaneous Items Income Account: There will be situations where the

income account for an item cannot be identified from the information in
the job sheet items. The obvious example of this is where you are creating a
single line service invoice—MoneyWorks needs to be told which income
account to use. Other instances will arise where (for example) the cost
centre used is not a valid department for the specified account.

To overcome this possibility, you must specify a default general ledger
income account when you are preparing an invoice.

6. Enter the miscellaneous items income account code

This is the default income account that MoneyWorks will use if it cannot
determine which income account to use. It must be an income account, and
if it is departmentalised, the department must be specified.

This Invoice Amount: The this invoice amountfield contains by default the sum
of the job sheet items that are highlighted. It may be that you do not wish
to invoice this exact amount out (for example, there were some problems
with aspects of the job that caused costs which you cannot pass on).

You can change the amount of the invoice by entering an amount into the
this invoice amountfield.

7.

If you want to make the invoice for a different amount than that
calculated, enter the amount into the this invoice amountfield

4. Choose the type of invoice you want to generate from the Itemise bypop-

up menu

This is the amount that will appear on the invoice.

Itemise in Description: It may be that you want to summarise the job sheet

Balance by: If you change the invoice amount, the generated invoice may no

items memo fields on your invoice. For example:

To: Meeting with John; Site Visit; Preparation of Plans

5. Set the Itemise in Descriptionoption if you want the memo descriptions

carried through to the invoice

longer add up and will need to be adjusted. You specify how the adjustment
will be done using the Balance byoptions:

pro rata detail lines: The net value in each detail line in the transaction is
multiplied by a constant so that the sum of the detail lines agrees with the
altered invoice amount.
Job Control

Job Billing

add miscellaneous items line: An additional detail line is added to the
invoice. The amount of this line is the difference between the sum of the
highlighted job sheet lines and the invoice amount entered. It will be
positive if you have increased the amount of the invoice and negative if you
have decreased the amount. You can enter whatever text you want in the
invoice to explain the adjustment.

carry difference forward: Similar to “add miscellaneous line item”, except
that a new pending job sheet item is also created for the difference. This
can be billed out in a future Bill Job, either reducing or increasing the size of
that invoice. You can use this for pre-billing, with the amount being carried
forward to offset against work done.

8.

If you have altered the invoice amount, set the Balance byoption to how
you want the invoice to be adjusted.

Final Invoice: If set, moves the job from Active to Completed

9.

If this is the last invoice that you will be issuing for this job, set the Final
Invoiceoption

The job will be transferred from active to complete after the invoice is
made. Note that this does not preclude you from raising further invoices (or
entering additional costs) into the job should it be necessary.

10. Click Make Invoiceto generate the invoice

A debtor invoice will be created (to the customer specified in the job in the
job file) and displayed on the screen.

Note: If the client does not use the local currency, the charges on the invoice
will be converted to the client’s currency at the system exchange rate.

You can change this invoice if required. However if you create additional
detail lines in the invoice be sure to make sure that the new lines are tagged
to the job, otherwise they will not be transferred through to the job sheet
items file and your job profit reports will be incorrect.

Note : If you are billing items out that require a serial/batch number and which
were requisitioned, the serial/batch number is notcarried through onto the
invoice transaction (and should not be entered there). This is to avoid

double counting the item’s serial number (the same applies to stock
locations).

If you need to show the serial/batch number on the invoice, you can modify
the invoice form to include a Find() function that gets the serial/batch
numbers from the original job sheet lines. The following for example, when
inserted into a column of the form (with word-wrap on), will list up to 100
serial numbers for each product billed on the job:

find("jobsheet.serialnumber", "resource = `"+detail.stockcode+"`

and DestTransSeq = "+transaction.sequencenumber, 100, "\r")

See the MoneyWorks Forms Designer for more information on creating and
modifying invoice forms.

11. Click OKto save this invoice

The invoice will be saved as an unposted transaction (or posted if you have
set the post option), and all job sheet items included in the invoice will be
transferred from pending to processed (so they won’t be invoiced again).

If you click Cancel, the invoice will not be saved and you will be returned to
the Bill Invoice screen where you can tinker further.

Project Billing

If you enter a project code when you use Bill Job, all job sheet items for jobs
that are in the project will be displayed (but not sub-jobs for these jobs). This
allows you to bill a number of jobs (the debtor is the project client) in one go.

A side effect of this is that the invoice will be tagged to the project, and not to
the individual jobs. Thus the income will not be recognised by the job report for
the jobs (but will appear in the job report for the project).

Writing off a job

There will be occasions when work has been done on a job, and all or part of the
job cannot be invoiced. To write off job sheet items concerning a job:

1. Highlight the job items to write off in the job sheet list
Job Control

Job Budgets

Only those job sheet items that you want to write off should be selected.

2. Either: choose Edit>Delete Job Sheet Items

The highlighted items will be deleted. This leaves no record of them.

or: Choose Command>Move to Processed without Billing (or press Ctrl-K/⌘-K)

The highlighted items will be moved from Pending to Processed. This allows
you to mark items as being processed without raising an invoice.

Job Budgets

Cost budgets can be specified for each job by manually creating budget job
sheet items. These contain similar information to job sheet items, except that
the requirements on entering the information have been relaxed.

These can also be created automatically from Quotes by using the Accept
Quotes as Jobcommand — see Quotes.

Job budgets can also be entered “in bulk” by using the Job Timesheet. Just click
the Save Entries as Budgetsinstead of Save Entries as Actuals.

Entering a Job Sheet Budget

To enter a job sheet budget:

1. Choose Show>Job Sheet Items or press Ctrl-5/⌘-5

The job sheet items list will be displayed.

2. Click on the Budgets sidebar tab

Any existing budget records will be displayed.

3. Choose Edit>New Job Entry or press Ctrl-N/⌘-N

The job sheet budget entry screen will be displayed.

4. Enter the job code into the Job field

You must specify the job code for the budgeted item. If you enter an
incorrect code the choices list will be displayed.

The type of information that you will enter depends on to what level you have
done your budgeting. For example if you have a budget for every single resource
used in a job, you will need to enter the budgeted quantities and resource codes
for each of these. Alternatively, if you are budgeting by cost centre, you will
need to enter a budget record for each cost centre involved in the project
(leaving the resource empty).

Another factor to consider when entering budgets is their timing. You can use
the date field to indicate when approximately the budgeted resource will be
used. If there is a single budget for the entire duration of the product, your
budgets will be dated the same. If the budget is monthly, you will have several
entries (each dated differently) for each resource or cost centre for each month.

5. Enter the budget items and figures for this level of budget

6. Click Nextto save these and enter another level of budget

Click OK if this is the last item in your budget.
Job Control

Job Reports

Job Budget Reporting: You can report on budget figures in the job analysis

reports — see Value Columns. However it is important to realise that these
reports will only pick up the budget figures for the breakdown level of the
report.

As an example, consider the case where you have budgeted for every
resource used in a project. If you print out a report based on Cost Centre,
the budgets will show as zero. This is because there are no budgets for the
cost centres (they are for products). In this instance to get correct results
you need to print out a report based on products.

Job Reports

The standard job reports that are provided with MoneyWorks are located under
Job Reports in the Reports menu. You can modify many of these or you can
design you own reports to meet your own specific requirements—see Custom
Reportsand Analysis Reports.

You can also print some of the reports for selected jobs by highlighting the jobs
in the Job list and clicking the required report in the list sidebar.

The Job Tracking reports are based on the information in the Job Sheet Items
file. Reports with the prefix “JT” are used for Job Tagging and are discussed in
Job Tagging Reports—these are based on transactions whose detail lines have
been tagged to a job and do not refer to the Job Sheet file.

Active Job List: Provides a single line summary for each active job showing start
date, amount quoted, amount billed to date and amount pending (work
that is not yet billed).

Job Detailed: Prints a detailed report of the active or highlighted jobs. This is the

definitive report of how a job is progressing.

If the report is run with the Summary by History, it shows each job sheet
item that is used on the job, and these can be subtotalled by Resource,
Account, Analysis, Cost Centre, Type (income and expenses), Colour or
Activity.

For each job sheet item, it reports the quantity used (if appropriate), the
cost, the markup and intended charge out, the amount recovered and the
balance to recover. Any unposted transactions or purchase orders tagged to
the job are printed after the Job Sheet details for each job.

If the Summary by Budgetoption is selected, the report shows budgeted
and actual costs for each job sheet item, along with projected costs (based
on the percentage complete), and the current job profit or loss.

Job P & L: Job analysis report that summarises and shows the income and

expenditure for the highlighted job(s) in the Job list. The report lists the
quantity of each resource used on the job, its actual and budget cost, the
variance, the theoretical resale value and the profit or loss on the item.
Totals for the job itself are provided.

Job P & L Summary: Prints a summary of the highlighted job(s) in the Job list.

showing the total incomings, outgoings and the difference.

Job Resource Summary: Prints a summary of the resources used for the

highlighted job(s) in the Job list. Gives the quantity of each resource used in
a job with its actual cost, estimated value and the difference.
Job Control

Job Reports

Job Cost Centre Summary: Prints a summary showing outgoings by Cost Centre
for the highlighted job(s) in the Job list. For each cost centre it shows the
actual cost of the work done, its estimated value and the difference.

Job Work Statement List: A shortened version of the Job Work Statement,

showing just the summary portion for each job.

Job Account Summary: Prints a summary showing outgoings by general ledger
Account code for the highlighted job(s) in the Job list. For each account
code gives the actual cost of work done, its estimated value and the
difference.

1 In MoneyWorks 6 and earlier this option was set in the Posting confirmation
window.↩

2 This cannot be done in multi-user mode— see Changing “code” fields.↩

Job Forms

Job Forms may be printed for selected jobs by highlighting the jobs in the Jobs
list, and choosing Print Job Form from the Command menu (or press Ctrl-[/⌘-[).
The Print Job Forms dialog is displayed.

3 You can transfer this to work-in-progress by using the Work-in-Progress Journal
command.↩

4 The product’s expense account is debited. and it’s stock account credited. This can
be transferred to work-in-progress by the Work-in-Progress Journal command.↩

Choose the form to use from the Use Formpop-up menu—a number of forms
have been provided, and these are described below. You can modify these or
create your own by using the Forms Designer.

Job Bag Form: An empty form suitable for the hand recording of time and other

resources used on the job.

Job Items Pending: A form containing a list of pending (unbilled) items for the

job, along with their sell value.

Job Performance: A summary of the income and outgoings for each job, along
with profit to date and a performance indicator (the ratio of income to
expenses).

Job Work Statement: An itemised list of time and disbursements used on a job,
with a summary of time and disbursements already billed and remaining to
bill. The Adjustments amount on the form is the difference between the
amount processed and the amount actually invoiced.
