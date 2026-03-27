# Job Costing Tutorial

Job Costing Tutorial

Because the Salespersonfield must contain a valid department, take care
that any validation list assigned to the Salesperson field only contains valid
department codes.

Job Costing Tutorial

This tutorial will take you step by step through many of the features of the
MoneyWorks job costing module. It is assumed that you are familiar with
MoneyWorks before you start—if not, you should work through the
MoneyWorks Tutorial.

An Overview of Job Costing

If you are an architect, graphics designer, mechanic, lawyer, builder or similar
your income is derived primarily by selling your skills and time. In order to
maximise your income, you need to manage and record the time you spend on
specific projects or for specific clients.

In addition to time, you may have incurred direct expenses in completing the
work (courier charges, parts, subcontractors and more). You will want to recover
these expenses from the client when you bill them, or, if you have provided a
fixed quote for the work, you will want to check that you have made a profit
when the job is completed.

The job costing within MoneyWorks allows you to keep track of time and
disbursements, and if necessary automatically invoice these.

Turning on Job Costing

We’ve assumed that you are familiar with MoneyWorks and have the Acme
Widgets Tutorial file open. Because not every business needs job costing, it is
disabled by default and needs to be turned on.

To turn the job costing features on:

1. Choose Document Preferences from the Edit menu

The MoneyWorks preferences window will open. This contains a number of
options that allow you to set MoneyWorks to work in the manner that best
suits your operations.

2. Click on the Jobstab
Job Costing Tutorial

The Preferences window will be shown.

The job costing has now been enabled and can be used.

Adding a New Job

Acme Widgets have secured a contract to refurbish a widget farm. They want to
add this job to the job file.

1. Choose Show>Jobs, or press Ctrl-4/⌘-4

The jobs list will be displayed.

2. Click the Newtoolbar button, or press Ctrl-N/⌘-N

The job entry screen will be displayed.

3. Turn the Enable Job Costing and Time Billingcheck box on

The Default Markupand Work-in-Progress Accountfields in the window will
be enabled:

Default markup Goods or services purchased specifically for a job are often
charged out at a higher rate than what was paid for them. You specify a
default markup to use here—you can override this later for specific jobs.

Default Work-in-Progress account At the end of the financial year (and indeed,
possibly at the end of each month), you will want to know how much work
you have done that has not yet been charged for. MoneyWorks can
calculate this work-in-progress amount for you, and transfer it into a
nominated account.

4.

In the Default markupfield type “20”

The markup will be 20% unless otherwise specified.

5. Type “5600” into the Default Work-in-Progressaccount field

This is the work-in-progress account code for Acme Widgets.

6. Click the OKbutton

The preferences window will close.

This contains details of the job, including information to help you manage the
project. For the purposes of this tutorial we are just going to use a few of the
available fields— see Job Controlfor a complete explanation).

3. Type “100” into the Codefield
Job Costing Tutorial

This is the unique code by which the job will be identified. Codes can be
alpha-numeric if required.

4. Type “Refurbish Widget Farm” in the Namefield

This is a brief description of the job.

5. Type “White” into the Clientfield

This is the code for the client for whom the job is being done, and must be
for a debtor (because we are going to send them an invoice at some stage).
If the client is a new one you can create a new code and enter the client
details at this point. In this case the client is an existing one.

6. Set the Billingmenu to Cost Plus

Jobs can be done either for a quoted fee, or on a
time and materials (cost plus) basis, as is the
case for this job. In this case Acme Widgets will
be charging a 25% markup on the materials used.

7. Type “25” into the Markupfield, and click OKto file the details

The job entry window will close, and the job will be shown in the job list.

Recording Time

Having set up a job we can enter time or disbursements against it. These will be
accumulated over the life of the job, and used to prepare invoices and reports.
They are recorded either directly into the_Job Sheet Items_ list, or if collated,
using the Job Timesheet entry. We’ll use the list at this point.

1. Choose Job Sheet Items from the Show menu or press Ctrl-5/⌘-5

The Job Sheet Items list will be displayed.

This list contains a complete history of all activities recorded against all jobs.
Activities fall into two types: tasks that have actually been done (Actual); and a
plan of the resources required for the job (Budget). These are accessible from
the sidebar tabs, with Actual being further divided into two types, Pending and
Processed:

Pending This lists all job sheet items that have been entered but not yet charged
out. When the items are invoiced they will be automatically transferred to
the Processed tab.

Processed: This lists all job sheet items that have been charged out.

Like all MoneyWorks lists, this list can be sorted (by clicking on the column
heading), summed (Sum Selection from the Select menu), searched and printed.

Jo Bloggs, the senior widget Engineer, has spent 3 hours with the client
discussing the implementation and requirements of the project. This needs to
be recorded. We need to create a new entry—this goes into the Pendingpart of
the Job Sheets Item file.

1. Click on the Pendingsidebar tab

This shows all unbilled job items —in this case there are none.

2. Click the Newtoolbar button, or press Ctrl-N/⌘-N

The Job Sheet entry window will be displayed.
Job Costing Tutorial

Note that for the purposes of this tutorial we have ignored the Datefield. In
practice you would want this to be accurate We can also customise the
entry window to minimise tabbingor add validations.

7. Click OK

The Job Sheet Item entry window will close, and the Jobs Sheet Items list
window will be displayed, with our new entry listed.

3. Type “100” into the Jobfield and press tab

The job and client details are displayed to the right of the job field.

4. Type “3” in the Qtyfield

This is the number of hours that are being recorded.

5. Type “T80” into the Product/Resourcefield and press tab

The total amount chargeable is calculated and displayed. Jo Bloggs is
charged out at $80 per hour1, so three hours of his time is worth $240.

T80 is the code that Acme Widgets use to record staff time that is to be charged
at $80 per hour. In practice you might have different codes for each staff
member, and (if one staff member has more than one chargeout rate) you might
assign him or her more than one code.

6. Tab to the Memofield and type “Preliminary Meeting”

Helen Reeves has done 4 hours work in designing the layout of the refurbished
farm. She has also had to use a couple of widgets out of stock. These need to be
recorded.

1. Press Ctrl-N/⌘-N to create a new Job Sheet Item entry

The Job Sheet Item entry screen will be displayed.

2. Type “100” in the Jobfield and press tab

This is the code of the job for which the work was done.

3. Type “4” in the Qtyfield, and “T60” in the Product/Resourcefield

This is the chargeout code for Helen.

4. Type “Layout Design” in the Memofield

This is a description of the work that was done, and completes the entry.

This completes the entry.

5. Click the Nextbutton or press the keypad enter key
Job Costing Tutorial

The entry will be filed, and you will be able to enter a new job sheet item. In
this case we need to record the two widgets that Helen has used.

6. Type “100” in the Jobfield

7. Type “2” in the Qtyfield and “BA100” into the Product/Resourcefield,

then press the tab key

As a part of the job, Acme Widgets commissioned some consultants to
investigate the planning aspects of the refurbishment. This charge against the
job can be recorded directly against the job when the invoice from the
consultants is processed in the normal Creditor transaction system of
MoneyWorks.

1. Create a new transaction by pressing Ctrl-Shift-N/option-⌘-N

Text will be displayed on the screen indicating that this is a stocked item.

A new transaction entry window will be displayed.

BA100 is the product code for the type of widgets that Helen used. These items
are stocked items, and Helen has taken them out of the warehouse. Because
these have already been receipted into the stock system, MoneyWorks needs to
create a special accounting entry (a “stock requisition journal”) to transfer them
out of stock. This will be done when either the Nextor OKbutton is clicked.

8. Click the OKbutton

The entry is filed and, because this is a stock requisition, a journal is created
to transfer the value of the items requisitioned from a stock account to an
expense account.

Recording Disbursements

Thus far we have seen how to enter time and stock requisitions. However jobs
also can attract expenses (disbursements), and if these are tracked they can be
recovered from the client. Helen had to drive 50 kilometres on a site visit. Acme
Widgets charge travel at a flat rate of 54 cents per kilometre.

1. Create a new job sheet entry by pressing Ctrl-N/⌘-N

2.

In the Jobfield type “100”

3.

In the Qtyfield type “50”, and in the Product/Resourcetype “KM”

4.

In the Memotype “Travel to Widget Farm”, then press OK

In situations such as this, it is appropriate to enter the expense record directly
into the job sheet items. Other examples of this might be for photocopy
recovery, tolls and so forth. However in many cases the company will be directly
charged for the expense.

2. Set the transaction type to Purchase Invoice and set its

type to By Account(if necessary)

3.

In the Creditorfield type “BSUPP”

This is the code for the consultant concerned.

4.

In the Amountfield type 4500

5. Type “2000” as the Accountcode in the detail line2

6. Type “Consultant’s Report” in the description

To associate an expense with a job you must specify the job code in the job
column.

7. Tab to the Job column and type “100”

The line should be as follows:

8. Click on the posting icon so the transaction will be

posted, then click OK

When a transaction is posted, the information in any of
the detail lines that contains a job code is automatically
transferred to the Job Sheet Items file so it can be billed out.

Click on the Post
icon
Job Costing Tutorial

9. Press Ctrl-5/⌘-5 to show the Job Sheet Items list

You will see a new entry with a product code of Job-Misc in the list. This was
automatically created when the originating accounting transaction was
posted. Note that the amount to charge has been automatically increased
by the job markup percentage.

Timesheet Entry

The job sheet list is one way to enter information about resources used on a job.
Often however the information may come already “batched” into some form—a
person’s timesheet is an obvious example, which records all the work for that
person over a set period of time. Another example is a “job bag”, where a
manual list is maintained of all the time and materials used on a particular job.

MoneyWorks has a special entry form that allows for fast input of collated data.
This is referred to as (for lack of a better name) TimeSheet Entry. To access this:

1. Choose Command>Job Timesheet or press Ctrl-Shift-J/⌘-Option-J

You set this based on how the data was collected. For example, if it was a
time sheet, you would enter it by Resource.

3. Enter “100” into the forfield and press tab

100 is the code of the job bag we are entering. All entries on this screen will
be assigned to job 100. Our job bag has the following entries:

Code
T60
T80
BA100
T60

Qty Details
3
5
1
2.5

Revised Sketches
Planning submissions
Bronze widgets
Interim Report

4.

In the Resourcecolumn, enter T60 and press tab

5.

In the Qtycolumn, enter 3 and tab to description

6.

In the Descriptioncolumn, enter “Revised Sketches” and press the return
key

The Timesheet entry window will be displayed:

The cursor will move to the next line

7. Repeat for the remaining lines on the job bag form

The final timesheet screen should be:

8. Click the Acceptbutton

The window will close and the items you have entered will appear in the job
sheet list ready for billing.

To enter the job bag for our job:

2. Set the TimeSheet bypop-up menu to Job
Job Costing Tutorial

Invoicing the Job

Thus far we have been entering time and costs incurred in doing the work. We
now need to issue an invoice for the work done. MoneyWorks will create an
invoice for us automatically.

1. Choose Bill Job from the Commands menu

The Bill Job window is displayed.

2. Type “100” into the Bill Job field and press tab

Note that as you click on each item in the list the invoice total changes.

Before we can generate the invoice, we need to specify how we want the
information grouped on the invoice and (as this is the first time we have used
this command) specify some defaults.

4. Turn on the Itemise in descriptionoption

If this is on, the information in the Memofield of the job sheet items is
transferred into the description of the invoice.

All unbilled items in the job are displayed in the list.

5. Type “1500” into the Miscellaneous Items Incomefield

Using this window we can identify the items that we want to bill out, and also
specify the total amount to invoice if it is to be different from the items we have
specified. In this case we want to invoice just the preliminary meeting and the
consultants report, so we need to turn the highlighting off for the other items.

3. Click on each of the other items in the list so that its highlighting is turned

off, as shown below

This is the account that MoneyWorks will use on the invoice if it cannot
determine the income account to use from the job sheet information.

6. Click Make Invoice

A Sales invoice entry screen will be displayed, complete with the
information from the items we have selected. We could if we want change
any of the information (such as the story) at this point.
Job Costing Tutorial

It is important to emphasis that this window contains the accounting details of
the invoice, and is not the invoice itself. This will be printed according to
whatever invoice form we choose, although it will have to draw its base
information from this screen.

7. Set the Post and Print options and click OK

The invoice will be posted and the Print Sales Invoice
settings window will be displayed.

8. Set the Use Formpop-up menu to Service Invoice 1,

You can see that the items that we have included in the invoice have been
transferred to this tab. They no longer show under the pending items. The
Processed tab will list all job items billed out.

Job Reports

MoneyWorks comes with a number of reports and forms that allow you to
monitor the costs and progress of a job. Even better, if you don’t like our
reports, and experience shows that everyone has different job reporting
requirements, you can use the report writer to design your own.

The Detailed Job History report is used to provide a definitive summary of a job.
To print this:

1. Choose Show>Jobs or press Ctrl-4/⌘-4

The job list will be displayed. To print the report for a job (or a number of
jobs), simply highlight the job(s) in the list and choose the report in the
sidebar.

In this case we wish to report on the Widget Farm job, which is still active.

Set the Postand
Printoptions

2. Click on the Activesidebar tab to display the list of active jobs, and

highlight the Widget Farm job by clicking on it once.

3. Click on Detailed Job Summaryin the Reports section of the list sidebar

The settings for the report will be displayed.

ensure that the Output tomenu is set to Preview, and click the Preview
button

The final invoice will be displayed on the screen. The layout of the invoice
will depend upon what form was selected. You can design your own forms
using the forms design features of MoneyWorks.

Note that in this instance all the information about the items used for the
job have been itemised into a single line. It may be that you want to show
the quantity of each resource used, or the date upon which work was done.
These options are available, and are set using the Itemise Bypop-up menu
in the Bill Items screen.

9. Close the Preview window

10. Click the Processedtab in the Job Items List window
Job Costing Tutorial

4. Set the settings to those displayed above

5. Click on the page setup button and set the report

orientation to landscape

6. The Job history report will be displayed

The Page Setup
button

This provides a complete summary of the job, in this case
organised by resources used. It includes details of the quantity used, their
cost and recovery, and the amount remaining to recover. It also includes a
list of any unposted disbursements against the job, so you can see
additional charges that have not yet been finalised.

Job Analysis Reports

A number of job analysis reports are also provided with MoneyWorks, and you
can access these through the choosing the appropriate one from the Job
Reports item in the Reports menu. However (and perhaps more importantly, as
job requirements vary so much from organisation to organisation), you can
create your own analysis reports3. For example, you might want a report on
who has worked on what job, or what are the actual resources used on a job as
compared to the budgeted resources.

Job Forms

Using the Forms Designer, you can also create your own job forms to help
record and retrieve information about a job. A number of job forms have been
provided for you: the Job Bag Form for example will print off an empty time
sheet for the job, whereas the Job Work Statement will print off a form that
itemises and summarises the time and disbursements against the job.

To print a job form:

1. Highlight the job(s) for which the form is to be printed in the job list

2. Choose Command>Print Job Form

The Print Job Form will be displayed.
3. Choose the form to print from the Use Form pop-up menu. In this case use

the Job Work Statement form.

4. Click Print (or preview)

A form will be printed for each job highlighted in the list.

1 GST/VAT/Sales Tax will be added to this if necessary when the job is invoiced.↩

2 You would probably have a special code called “Consultants Employed” or some
such thing. The demo file doesn’t have one of these, so we’ll just use the Purchases
account.↩

3 For details on analysis reports, see Analysis Reports. A tutorial on creating analysis
reports starts here.↩



