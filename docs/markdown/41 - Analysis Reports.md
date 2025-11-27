# Analysis Reports

Analysis Reports

Analysis Reports

Analysis Tutorial

Whenever you enter a transaction into MoneyWorks you are recording more
than simple accounting information. For example, if you are using the debtors
and product system each sale will record information about what that customer
purchased. Over a period of time these transactions will build up, and within
MoneyWorks you will have a valuable resource of customer buying habits,
product sale patterns and so forth.

This information is not (necessarily) accounting information, but is of great
potential value for management and marketing purposes. You can access this
information at a simple level by using the Customer and Product sales enquiry
screens. Analysis reporting in MoneyWorks offers an even more powerful way of
extracting this information.

This tutorial, which takes about ten minutes, steps you through creating and
using Analysis reports, and will (hopefully) give you an appreciation of what they
are and how they can be used. Although designed to be used with the “Acme
Widgets” tutorial file, you can use this tutorial with your own accounts if you
want—there are no side effects (but you will obviously get different results).

Creating an Analysis Report

Analysis reports can provide information from either the transaction file or the
job sheet item file, both of which hold “raw data”, and hence can be usefully
analysed. In this tutorial we will use the transaction file to create an analysis
report to show who has purchased specific products.

Analysis reports are quick to set up, and produce what is basically a weighted
cross tabulation (cross tab) of selected transaction information. Cross tabs have
been used for many years to collate data for decision making purposes.

1. Choose File>New>New Analysis

The New Analysis window will be displayed.

Some of the more common sorts of analysis (e.g. customer by product, product
by customer) come presupplied with MoneyWorks. However you can create
your own reports as you need them, and save these for reuse at any time. The
sorts of analysis that you can do include (but are by no means limited to):

• Breakdown of Products Sold by Customer
• Breakdown of Costs (or Income) by Job
• Breakdown of Customer Purchases by Period
• Breakdown of Product Sold by Customer by Period
• Breakdown of resource use by job
• Breakdown of resource use over time

Note that you don’t have much control of the layout of an analysis report. If you
want more control of the formatting and layout, you can (with a bit more effort)
use the Analyse functionin a custom report.

2. Set the Basisto Transaction Details and the Source Fileto Item/Product as

shown
Analysis Reports

Analysis Tutorial

An analysis report is always based on a Source File, which is used to select
the transactions to be analysed1. In our example, we want to report on
sales of specific products, so the product file will be the source file.

The Basisindicates where the information that we are analysing comes
from. For this tutorial we want the transactions.

information that will be printed, and are currently set to Quantity and Net. We’ll
look at the default report, even though it is not quite what we want.

6. Click the Do Analysis...button

The Analysis settings window will be displayed. We use this to select the
output options and time interval for the analysis.

3. Click New

The Analysis Definition window opens.

If your’s does not look like the one above, click the Fewer Optionsbutton.

7. Click the Year to Dateradio button

We’ll look at all sales for the year to date.

8. Set the output to previewand click the Previewbutton

The analysis report will be displayed.

In this window we can specify the information that we want to appear on
the analysis, and how the report will be formatted.

4.

In the Analyse part of the window, click Sales/Income Only

As this analysis is concerned with who purchased the selected products, we
only want to look at sales.

5.

In the Arrange As section, click List

This determines how the information is displayed in the report.

The bottom part of the window displays the structure of the analysis. The fields
on which the analysis will be done are in the left hand columns. The default
setting has one label column called Code. The remaining columns show the
Analysis Reports

The report consists of three columns, each one corresponding to one of the
columns in the setup window. To prepare the report MoneyWorks did the
following (more or less):

• Stepped through each product in the product file (the source file)
• For each product, found all details lines in transactions that occurred this

financial year.

• Added up the quantity and net for the detail lines.

2. Click on the Codeheading to highlight it, type “Product” and press tab to

go to the NameCodeheading and type “Customer”

The first column displays Product details, and the next Customer.

Analysis Tutorial

3. Click the Do Analysis...button

The Analysis settings window will be displayed.

The summary information for that product was then printed.

4. Click Preview

9. Close the preview window

The analysis report will be displayed.

The analysis setup window will be the front-most window.

Adding other breakdown fields

The report we just previewed had a single level of breakdown which was
product. We want the report to be of product by customer, so we need to add
another breakdown level.

1. Set the pop-up menu under Breakdown Levels to Two

A new column “NameCode” will be displayed.

This is a two level breakdown. The first level is for the product, and the
second is for the customer. The columns are already set to this, so we don’t
need to change them.

At the top of each column is a column heading (see diagram). The heading
defaults to the name of the column contents. We’ll change the headings for
the label columns.
For each product there is a list of all the customers (the second report
column) who purchased the product in the time period. The quantity
purchased and the amount spent (ex GST) for each customer are displayed.

5. Scroll through the report, then close the preview window

The analysis setup window will be the top-most window.



Analysis Reports

Adding additional columns

Selecting records for breakdown

Analysis Tutorial

Let’s add the percent margin that we are getting from each customer for each
product. To do this we need to add another column to the report.

At present the report is printing all products in the product file. If we only want
to do some of the products, we can highlight them in the product file and
reprint the analysis. Let’s do just bronze widgets.

1. Click the Appendtoolbar button

A new column (labelled GST) will be appended to the existing columns. We
want to set this to display the percent margin.

1. Choose Show>Products or press Ctrl-3/⌘-3

The product list window will be displayed.

2. Choose % Marginfrom the GST pop-up menu under the GST column

2. Highlight all the bronze widgets in the list

heading

Remember that to highlight more than one item in a list you hold down the
control/command key and click.

We want to leave the window open and return to the analysis window. To do
this we need to bring the analysis setup window to the front.

3.

If you can see a part of the analysis window, click on it to make it the front
window.

If you can’t see it, a list of open windows is maintained in the Windows
menu. Choose “Untitled Analysis” from this.

The number of records in the source file that will be analysed is displayed in the
top of the window. This should now say six—previously it was seventeen, being
all the records.

The column entries and heading will change to % margin

4. Preview the report and check that only the highlighted products are

3. Click Do Analysis..., then click Preview

The Analysis report will preview.

The percent margin column has been added. Notice that this is the same
regardless of who buys a particular product. This indicates that we are not
discounting these products to individual companies. The bottom line of the
report (the total over all products and customers) will show the average
margin.

included

5. Close the preview window

Changing the breakdown fields

We’ll change the breakdown slightly. Instead of breaking it down by product
code, we’ll break it down by product size. The size information has been stored
in field Category2 of the product record.

4. Close the Preview window

1. Hold the mouse down in the pop-up menu that is labelled Code in the first
Analysis Reports

column

A complete menu of available breakdown fields will be displayed.

2. Choose product.category2from the menu and Preview the report

Analysis Tutorial

5. Close the preview window

Table view

Viewing the analysis as a list is only one of four ways the analysis can be
displayed. The Report view is a slightly altered form of the list view (try setting
the Arrange Asoption to Report and look at the report).

In the table format one field is displayed horizontally across the page, with the
remainder displayed vertically down the page. Only one calculation can be
shown on the report itself.

1. Change the Arrange Asoption to Table

Notice that only one calculation value (currently quantity) can be used.

Instead of product codes, the report is broken down by size of product. This is
one way that we can use the category fields in MoneyWorks to supply useful
management information.

2. Preview the analysis

We’ll now change the report to give us a breakdown of product size by region.
Acme Widgets have put regional information into the Category1 field of their
customer records.

3. Close the preview window

4. Set the NameCode pop-up menu in the second column to

Name.Category1and Preview the analysis

Drill Down

From the preview of an analysis report, you can drill down on a data point to see
the underlying records.

1. Move the cursor over one of the table values (but not a total) until it turns

into a magnifying glass, and click
Analysis Reports

Analysis Tutorial

The Detail Line Items list window will be displayed with just the lines of the
transaction that comprise the results.

2. Close the Detail Lines list window, then the preview window

Chart View

You can also view your analysis as a chart:

1. Change the Arrange As option to Chart and Preview the analysis

Preselecting the source records

To select the source records (products) that we wanted to analyse, we
highlighted them in their list window, and then did the analysis. This is useful for
doing ad hoc reports, but we can also preset the search pattern so that we can
use the report again for the same records.

1. Set the Use Preset Searchoption under Source Selection

The Find window will open.

We can specify a search based on any attributes in the source file. We’ll set
this report to do all small widgets. The size is stored in the category2 field.

2. Set the left hand menu to Category2and type “Small”
Analysis Reports

Analysis Tutorial

The search pattern should read “Category2 Starts with Small”.

4. Set the relationship pop-up menu to =

3. Click OKto close the Find window, then click Preview

5. Click OK

It will only include those products with “Small” in the category2 field.

The Setup Search window will close.

4. Close the Preview window

6. Click the Do Analysis...button

You can change the search criteria by clicking the Specify button. Try setting the
search to “Category1 is not Bronze” and redoing the analysis.

The Analysis Criterion window will be displayed.

Specifying the source records at print time

The third way that source records can be specified is to have MoneyWorks ask at
the time the report is to be printed.

1. Set the Ask for Search Codeoption under the Source Selection

The Setup Search window will be displayed.

In this you can specify the text of a message to ask when the report is
selected for printing, and also which field to search on and how to search.

2.

In the Prompt Textfield type “Please enter the size”

3. Set the Search field popup menu to Category2
7. Type “Large” and click OK, then click Preview

The analysis will be done for large widgets only.

8. Close the preview window, and redo the analysis this time typing “small”

when prompted.

9. Close the preview window

Saving an Analysis Report

Once you have created the analysis report you can save it for later use.

1. Close the Untitled Analysis window

You will be asked if you want to save the analysis

2. Click Save

The standard file creation dialog box will be displayed.



Analysis Reports

Printing An Existing Analysis Report

The report should be saved in the Reportsfolder in the MoneyWorks
Custom Plug-insfolder—the file creation dialog box should already be
“pointing at” to this.

Both the source file and the number of records in it that are being analysed are
shown in the Analysis Settings window which is displayed after you start the
analysis. You should always check these before continuing with an analysis.

You can also save the report in a folder located in the Reportsfolder. If you
do this the report will be in the hierarchical menu in the Reports menu that
corresponds to that folder.

To print from an existing analysis setup:

Printing from selected records

3. Type “My Analysis” as the report name and click Save

1. Display the appropriate Source file by selecting it from the Show menu

The Analysis Definition window will close. The report will be saved and is
now accessible from the Reports menu.

The list of records in the file will be displayed.

4. Choose Reports>My Analysis and preview the analysis

You will need to enter the size when prompted.

If you want to change the layout or specifications of the report, you need to
open the report by using the Open command in the File menu.

Congratulations!

You have successfully created an analysis report.

Printing An Existing Analysis Report

2.

Isolate the records you want to analyse in the Source file

You can do this by using the Findcommand or highlighting the records by
holding down the control/command key and clicking on the items you want
to select.

3. Select the required analysis report from the Reports menu

The analysis settings dialog box will be displayed.

4. Go to step 4 below

To print using a preset search

Analysis reports are designed to be printed “in context” starting from a selection
of records in a source file (Products or Jobs, for example). When you print an
analysis report the source file is always used to establish which records you
require for analysis. There are three ways in which records are selected from the
source file, the method for selection being specified when the analysis report is
created.

1. Select the required analysis report from the Reports menu

The analysis settings dialog box will be displayed.

The number of records in the source file that match the preset search
criterion is displayed in the top portion of the window.

Use Selected Records: Analyse the highlighted records in the source file.

2. Go to step 4 below

Use Preset Search Use an embedded search function in the report to locate the

records in the source file to analyse.

To print using a user specifiable search

Ask for Search Code Use an embedded search function to locate the records in

the source file, but prompt the user for the value to search for.

1. Select the required analysis report from the Reports menu

The Analysis Criterion window will be displayed.
Analysis Reports

Printing An Existing Analysis Report

click More Options.

Simple Settings

The simple settings (as displayed above) allow you to specify the time options
for printing the report. Only those transactions that fall in the indicated date
range will be used in the report.

The Use Selectionoption is only available when the source file is the same as
the base file (i.e. is Transactions). In this case the time range is determined by
the selection itself.

The Specifybutton only appears in reports which are created using the Ask for
Search Codeoption, and is used to specify the search pattern.

2. Enter the search pattern that you wish to use and click OK

The Analysis Settings window will open. MoneyWorks will find all records in
the source file that match the code you entered, and the number of records
found will be displayed in the top left of the window.

The information that you enter depends on how the search was specified.
In the example above, we should enter a debtor code. Note that you can
use the wildcard characters “@” and “?”—for information on these see
Account Code Patterns.

3.

If you need to redo the search, click the Specifybutton

The Analysis Criterion settings window will be displayed again.

4. Set the options for the Analysis

These options are discussed in the next section. For page and output
options see Output Settings

5. Click the Print, Preview, Save As, or emailbutton as appropriate to print

the Analysis report

More Settings

The Analysis report will be prepared and either printed, previewed or
exported, depending upon the Output options settings.

Transaction Based Analysis Settings

The Analysis Settings window is displayed whenever an analysis report is
printed. There are two forms of settings of the settings window, one of which is
simpler than the other. The settings window that was last used will be used next
time the analysis is printed—to change to the more complex settings window,
The second form of the Analysis Settings provides additional options.

In this window you can specify either period or date ranges. Only transactions
that fall in the indicated time range will be included.

Include Unposted Unposted as well as posted transactions will be included in

the analysis. Normally only posted transactions are analysed.



Analysis Reports

Anatomy of an Analysis Report

Show Full Names When set, both the code and descriptions are shown on the
report (making the report wider). By default, only codes are shown

Only processed (i.e. invoiced) job sheet items will be used.

Show Transactions The individual transactions that make up each analysis line

will be listed under that line.

Clicking Fewer Optionschanges to the simpler settings window. Note that the
options set in the more complex window will still apply—they are merely hidden
in the simple window.

Both

Both pending and processed job sheet items will be used.

To change to the more complex form, click More Options.

More Settings

Job Sheet Based Analysis Settings

The Analysis Settings options for Job Sheet based analysis reports operate in a
similar manner to those for transactions.

The second form of the Analysis Settings provides more options and allows you
to specify time ranges. These operate in the same manner as in the settings box
for the transaction analyses. Clicking Fewer Optionschanges to the simple
settings window.

Simple Settings

Anatomy of an Analysis Report

The simple settings allows you to specify which job sheet records you want to
include in the report.

Pending

Only pending (i.e. unbilled) job sheet items will be used.

Processed
An analysis report will produce what is basically a cross tabulation (or cross tab)
of selected transaction or job sheet information. Cross tabs are commonly used
to collate data for decision making purposes.

When you create an analysis report you specify which is the source file. When
the analysis is done every transaction detail record (or job sheet item) in the
nominated time interval that uses one of the selected source records is located.
The summary information (e.g. count, quantity, net) from the detail or job sheet
records is calculated and summarised.

In the following we are doing a Product by Customer analysis, i.e. who has
purchased the specified products:

1. The source file is determined by what information is required. Here we
require sales information by product, so the source file is Products. Three
products have been highlighted to analyse.



Analysis Reports

Creating a New Analysis

2. Choosing New Analysis from the New hierarchical menu in the File menu
displays the New Analysis window in which the source and base files are
selected. Here we want the source file to be Item/Product, as this is our
starting point.

Creating a New Analysis

You can define your own analysis reports and use them just once or save them
as a template for repeated use in the future. Each analysis is based on a source
file, which you specify when you create the analysis. You also need to indicate
the basisfor the analysis, which can be either transaction detail lines or job
sheet items. To create an analysis report:

1. Choose File>New>New Analysis

The New Analysis window will be displayed.

3. Clicking Newdisplays the analysis definition window in which the details
of the analysis are specified. The following schematic shows how this works.
Analysis Reports

Creating a New Analysis

5. Change any of the options as required

For further information on these options see Analysis Definition Options.

6. Change the number and type of the columns if required

2. Choose the file to be the Basis for the Analysis

See Changing the Number of Label Columnsfor information on this.

This file determines where the records that are analysed are found.

You will choose Transaction Details if you are preparing an analysis that is
based on the information in the transaction file (for example, if you want
anything to do with sales).

You will choose Job Sheet Items if you are preparing an analysis based on
the items that have been entered in the Job Sheet Item file (for example,
who has worked on what project, what resources were used in a specific
project).

7.

If you are saving the report for subsequent reuse, you should set the help
text.

For information on this see Setting the Help Text.

8. Click Do Analysis...to start preparing the Analysis report

The Analysis Settings window will be displayed. See Printing An Existing
Analysis Reportfor details of this.

9. When you have finished with the analysis, close the Analysis Definition

3. Choose the Source File for the Analysis

window

The Source File determines how you specify what can be analysed. For
example, if you want to analyse sales by customer, the source file will be
Name. If you want to analyse sales for a particular range of products, the
source file will be Product.

4. Click the New button

The Analysis Definition window is displayed.

You will be asked if you want to save the analysis.

10.

If you want to reuse the analysis, click Save

The standard file creation dialog box will be displayed. You need to enter
the report name in here, and also ensure that it is saved in the
MoneyWorks Reports folder (or a folder contained within this folder) so
that it will appear in the Reports menu.
Analysis Reports

Creating a New Analysis

You may like to devise some name coding scheme for the names of the
analysis so that you can readily identify what the source file is for each. For
example analyses starting with P could refer to the Product file, J to the Job
file and so forth.

Modifying an Analysis Definition

You can modify existing analysis definitions, in much the same way that you can
modify report templates.

1. Choose File>Open

The standard file open dialog box will be displayed, listing the analysis and
report definitions (which are stored in the MoneyWorks Reports folder).

2. Open the Analysis file that needs modification

The Analysis Definition window will open for the analysis.

Analysis Definition Options

In the Analysis definition window, you can define the information that you want
to appear in the Analysis. The window is laid out in much the same way as the
analysis will appear when printed, and defaults to a single label column and 2
columns of data.

Analysis reports consist of a set of columns across the page. There are two types
of columns, label columnsand data columns. The label columns always contain
information indicating what is in the data columns (for example, a product or
debtor code); the data column contains a calculated value (the net amount or
the number of occurrences for example). The first column will usually be a label
and will probably contain information from the source file (the job code for
example). Depending upon the level of breakdown, there may be up to two
additional label columns, drawn from either the source file or another file.

You cannot change the fonts, the column width or the formatting of numbers in
an analysis report. However you can export the report and import it into either
a spreadsheet or word-processor for subsequent reformatting.

If a report definition opens instead of an analysis, you have chosen a report
instead of an analysis file. Close the report by clicking in the close box at the
top left of the window, and repeat from step 1.

The options in the window are:

3. Make any changes that are required

be included in the analysis.

Analyse: Determines the type of transaction or job sheet item records that will

4. Reset the Page Setup and margins if required

For transaction based analyses these are:

5. Choose File>Save Analysis to save the new definition

• Sales/Income Only: Only cash sales and debtor invoice transactions will be

If you don’t want to save the changes, close the window by clicking in the
close box at the top left of the window, and click the No button when asked
if you want to save the changes.

If you want to keep the original analysis definition as well as the one you
have changed, choose Save Analysis As from the File menu instead of Save
Analysis. You will be prompted for a file name, and the changes will be
saved into a file of that name.

included in the analysis.

• Purchases/Expenses Only: Only cash purchases and creditor invoices will be

included in the analysis.

• Sales minus Purchases: All sales and purchases will be included in the
analysis. Transactions representing purchases will be represented as
negative values, whilst those corresponding to sales will be represented as
positive.

For Job Sheet Item analyses these are:

• Incomings: Only job sheet lines created as a result of a debtor invoice or a

cash sale will be included in the analysis.

• Outgoings: Only job sheet items directly entered into the job sheet item file
Analysis Reports

Creating a New Analysis

or created as a result of an expense will be included.

• In - Out: All job sheet items will be included. Those representing incomings
will be treated as positive, and those representing outgoings will be treated
as negative (but will not be printed as such). The net result will represent a
surplus or deficit for the analysed fields.

Breakdown Levels: This is the number of levels that the analysis will be printed
for, and can range from none (total only) to three. There will be a label
column for each level of breakdown.

Arrange As: This determines how the report is laid out.

List: The report is presented down the page. Totals are given after each change

in the Label columns.

Report: Similar to the list format, but a separate heading is given for each

change in the left hand most Label column.

Two additional options are available for this format. If No Grand Totalis
selected the printing of the grand total at the end of the report is
suppressed. If Page Breaksis selected, a new page is started whenever the
left most field value alters.

Table: The right most label in the analysis definition window is printed

horizontally across the page, and the remaining labels are printed vertically
as for a list. Only one numeric value can be analysed in this format.

Chart: Similar to table, but the information is presented as a chart. By default
this will be a column chart as shown, but you can select a different chart
type by clicking the chart icon and selecting from the pop-up menu. You can
also append the curve-type meta-characters (|S |L |C |Mn |P) — (see
Chart) to the column heading to get a different form of graph. For example
a heading of “Quantity|P” will produce a pie chart, whereas “Quantity|L”
produces a line graph.
Analysis Reports

Creating a New Analysis

The preset search may be altered by clicking the Specifybutton. If the
option key is held down and the Specify button is clicked the complex
search window is displayed see Find by Formula.

Ask for Search Code: Causes the Setup Search window to be displayed.

This allows you to specify some prompt text, and the basis of the search
criteria. When the report is run, a window is displayed with the prompt text
and a field into which the user can enter a pattern to complete the search
criterion.

The source file is then searched for the matching records.

Source Selection

The Source Selection options determine how the source file records are
selected.

Use Selected Records: If this is set, the user must identify the records in the

source file to be analysed before the analysis report is printed. The records
are selected by highlighting them in the source file list. If the source file list
window is not open, all records in the file will be analysed. If the source file
list window is open but no records are highlighted, all the records currently
displayed in the list the found setwill be analysed.

Use Preset Search: Selecting this option causes the standard Find window to be
displayed see Find by Field. You set the search criteria in this, and this
criteria is saved with the report. Whenever the report is printed, a search of
the source file is undertaken using the criteria, and those records found will
be analysed.
Analysis Reports

Filter

DayOfWeek (lookup(Detail.ParentSeq, "Transaction. transdate"))

Creating a New Analysis

The optional filter function will filter the candidate detail or job sheet records
based on the search expression. Only those records that match the source
selection and the filter will be included in the analysis. When you select the
filter option, the Advanced Find windowis displayed for you to enter the search
expression for the filter. If a relational searchis used, it must terminate with
[detail] or [Jobsheet].

Analysis Column Settings

The information that will be appear in the analysis is determined by the settings
in each of the columns in the analysis report.

To change the settings for a column, hold the mouse down on the pop-up menu
immediately below the column heading, and select the item required.

Label Columns

For Label columns, the pop-up menu will contain a list of field names from a
variety of files. Select the field name that you wish to use (for further
information on these fields see Appendix A—Field Descriptions). All records in
the base file will be grouped by this field, and each occurrence of it in the base
file will appear as a line in the report.

Calculated Value: Choosing Calculated Value (at the top of the menu) allows you
to specify your own calculated breakdown in the Calculation window that
opens. Calculations must be correctly formed expressions — see
Calculations and things— pertaining to the basis and source files. The
following expression for example will do a sales analysis by day of week:
Value Columns

The pop-up menu for value columns contains a list of values that can appear in
the report. These values will be aggregated for each combination of the label
columns, as shown in the following table.

Base File

Value

Description

Transaction
Details

Count
Quantity
Net

GST/VAT/tax
Gross

UnitPrice

CostPrice

The count of the number of detail lines.
The sum of the product quantity field.
The sum of the values in the Net field, or (for a product transaction),
the Extension field.
The sum of the values in the tax field.
The sum of the values in the Gross field, or (for a product
transaction), the extended price including GST/VAT/Tax (this does not
show on the transaction entry screen).
The average of the unit selling price field for product transactions
(this will be zero in service transactions).
The average of the unit cost price for product selling transactions,
representing the average unit cost of goods. For buying transactions,
it has the same value as the unitprice, so that margin calculations will
be correct, and for service transactions it is zero.

ExtCostPrice The sum of the unit cost price multiplied by the quantity for product

Job Sheet
Item

selling transactions. This represents the total cost of goods for the
detail line.
The difference between the Net and the ExtCostPrice.
The sum of the total discount for the detail line.
$Margin/Net displayed as a percentage.
The count of the number of job sheet item records.
The sum of the quantity field.
The sum of the cost field.
The sum of the value field.
The sum of the value field minus the sum of the cost field.
The $ margin divided by the sum of the value field.
The sum of the budget (cost) field.
Budget - Cost.

Budget Variance divided by budget shown as a percentage.

$ Margin
$Discount
% Margin
Count
Quantity
Cost
Value
$ Margin
% Margin
Budget
Budget
Variance
Budget
Variance



Analysis Reports

Changing the Number of Label Columns

An analysis report can have between zero and three
label columns (levels of breakdown). Zero columns
corresponds to printing only totals.

To change the number of label columns use the
Breakdown Levels pop-up menu.

Changing the Number of Value Columns

Use the Appendand Remove Columntoolbar buttons to change the number of
value columns in the report. A report can have between one and ten value
columns—a table can have many more.

By default the Auto Scale option (set in the Margins window) is on for analysis
reports. This will scale the report to fit, regardless of the number of columns. To
keep very wide reports legible, you should set the page orientation to
landscape.

Creating a New Analysis

Report Preferences

The Report Preferencesallow you to customise the presentation of transaction
(or jobsheet) lines in your report, and also protect it from unauthorised use
without signing. To access the preferences:

1. Click the Settingsbutton

The report preferences window will open.

The Settingsbutton

Column Headings

To customise the presentation of transaction/jobsheet lines:

Each column in the report is assigned a heading.

1. Turn on the Custom Trans Formatoption

To change a column heading, click on the existing heading and type in a new
one. Although headings can be up to 31 characters long, they will be truncated if
they are too long to fit on the printed report.

A small custom report will open that prints the line. Customise this as
required (see Custom Trans Format).

You can edit an existing custom format by clicking the Editbutton.

To restrict who can run your report

1. Click the “+” button at the bottom of the Require Privilegeslist

2. Select the privilege that an unsigned user must have to access the report.

For example, a user might need to have the Sales Enquiry privilege to access
a report of sales by customer. If you add more than one privilege, a user
must have all those privileges.Note that users who do not have the Signing
and Using Unsigned Forms and Reportsprivilege will still need to have the
