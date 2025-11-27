# Report Writing Tutorial

Report Writing Tutorial

Notes

• Not all fields in the register are available for import, and all imported assets
will have their status set to "New", allowing them to be edited prior to
depreciation (or a change to a different type of asset).

• When transferring assets from another system in MoneyWorks it is

important to ensure that the bookvalue is correct and balances to the
quantity multiplied by the cost less the accumulated depreciation.

• Where a transferred asset uses Diminishing Value, the bookvalue supplied
must be that as at the end of a financial year (so that the opening carrying
value can be correctly determined).

Report Writing Tutorial

The Report Writing Tutorial guides you through creating your own custom
report using the MoneyWorks report generator. Most of the presupplied reports
have been created as custom reports, allowing you to modify them if needed. If
you wish to create your own reports, you should work through this tutorial and
then read the Reports.

Creating Your Own Reports

MoneyWorks reports are kept as separate documents: the reports that are
supplied with MoneyWorks are kept in the Reports folder in the Standard Plug-
ins folder; any reports that you modify or create should be kept in the Reports
folder in the Custom Plug-ins folder. This keeps them separate from the pre-
supplied ones, allowing you to back them up easily and also to preserve them in
future upgrades of MoneyWorks —see Managing Your Plug-ins. Only reports in
the Reports folders in these two Plug-ins folders are displayed in the index to
reports and the Reports menu.

Because MoneyWorks reports are stored as separate documents outside of your
actual accounts, you can use the same report for different companies. You can
even use reports created by other MoneyWorks users, and they can use your
reports.

Although this tutorial is based on the tutorial file “Acme Widgets”, creating a
report is not always document specific so you can use your own document if
you wish—creating a report does not affect the MoneyWorks document itself.
However remember that the sample reports shown will look different if you
don’t use the Acme Widgets file.

Creating Reports

In this tutorial we will create a simple gross margin report as shown at right. The
report shows the current month’s sales and cost of sales with a percentage
breakdown, then last months figures and the dollar difference.
Report Writing Tutorial

The Part Settings box opens. This is used to specify what
will be printed in the part, or what action will take place.

Part label for
heading part

1. Choose File>New>New Report

An untitled Report window will open.

If the dialog box that opens does not look like the one above, you have
probably clicked in the wrong part of the report setup. Click Cancel, and
make sure you double click on the H.

This particular part of the report is currently a heading, which is appropriate
as it is the first part in the report.

A MoneyWorks report consists of parts(or rows) and columns. When you create
a new report, one part (the row labelled “Heading”) and one column (COL1) are
created with it, as shown above.

2. Type “Gross Margin Report” into the Heading field, then click OK

The window will close, and the words “Gross Margin Report” will appear in
the part we have just modified.

In a profit report, the rows will contain details of our income accounts, then
details of our expenses. The columns can contain whatever we feel is
appropriate. For example we might want to have this period’s values, year to
date figures, budgets and variances, or just the amount left in our budget.

Adding a New Part

3. Click on the Append PartToolbar button

Defining a Part

We’ll start of by changing the existing part.

1. Double click on the Part Label in the left hand margin

A new part will appear immediately under the one we
have just modified. The Append PartToolbar button adds
a new part to the end of the report.

The Append Part
button

4. Double click on the Part Label of this new part

The part settings box will open as before.
Report Writing Tutorial

5. Click on the Part Typepop-up menu to see the options available

13. Set the Totals at Bottomoption, then click OK

This is where we specify the type of Part we want to use.

The altered part will display in the report.

6. Choose Accounts of Type

Defining a Column

The options available change to reflect what is appropriate for this Part
Type. Because we have chosen Accounts of Type, we need to specify which
type. This is done in the Typepop-up menu, which contains a list of all the
available account types (Income, Expense etc.) in MoneyWorks.

In this case we want to list all of the Sales accounts. The Typepop-up menu
is already set to this, so we can just leave it.

Note: If the chart of accounts that you are using doesn’t have any Sales or Cost

of Sales accounts, use Income and Expenses instead. The net effect will be a
profit and loss report.

7.

In the options section, turn on the Column Headings at Topand the Totals
at Bottomcheck boxes

These will cause headings to be placed before the account listing, and for all
accounts appearing in the part to be summed and the total printed at the
end of the listing.

8. Click the OKbutton

The part settings window will be closed. The Part Label
we have just altered will change to RT (short for Range by
Type).

Part label for a
Headingpart

The Parts down the left side of the report specify what will be printed on each
line of the report. We also need to specify what will be printed in each column.

1. Double click on the Column label (the box that says

COL1)

The Column Settings dialog box will open. If you get a
different box, cancel it and try again.

Column label
(without a
heading).

This is used to specify what is put into the columns of the report. We want
the first column to be the account code.

The part we have just created will list all our sales. We need to create another
part to list our direct cost of sales.

2. Type “Account” into the Headingfield

9. Append another part (click the Append Parttoolbar button)

10. Double click the Part Label to bring up the Part Settingsbox

11. Change the Part Type pop-up menu to Accounts of Type

12. Change the Typepop-up menu to CS: Cost of Sales
3. Set the Column Typepop-up menu to Account Codeand click OK.



Report Writing Tutorial

Adding a New Column

4. Click the Append ColumnToolbar button

Another column (COL2) will be added.

5. Show the Column settings for this new column by double

clicking on its label (where it say COL2)

The Append
Columnbutton

6. Set the Column Type pop-up to Description, and click OK

7. Use the Append ColumnToolbar button to add another column, and

double click its header to show the Column Settings box

Previewing the Report

8. Set the Column Typepop-up menu to Actual

Now that we have created a report, it would be a good idea to see what it will
look like when printed.

This will print actual ledger values in the column.

1. Click the TestToolbar button

Note that two other pop-up menus are enabled. The first one indicates
what sort of ledger information we want to show (in this case Movement
This Period), whilst the second shows the financial year (as This Year).

The Report Settings dialog box will be displayed.

We could also have used Print from the File menu to do this.

9. Set the Signspop-up menu to Adjusted

2. Ensure the Omit Zero Balancescheck box is NOT set

MoneyWorks stores debit balances as positive numbers, and credits as
negative. If we were to just print out the balances as they are stored, the
sales/income accounts (which generally have credit balances) would all be
printed as negative numbers. Selecting the Adjustedoption tells
MoneyWorks to print income balances with reversed signs, but leave
expenses balances untouched.

10. Type “Actual” into the Headingfield, then click OK

The column just created will contain the actual account balances for the
report period.

Congratulations! You have just created a report. It should look like this.

This option suppresses the printing of lines in the report that contain only
zero. When designing a report, it is a good idea to see all the lines that will
appear in the report.

3. Set the Output topop-up to Previewand click the Previewbutton

The report will be shown in the print preview window (your accounts and
numbers may be different).
Report Writing Tutorial

The account codes and the values printed in the report will depend on the
MoneyWorks document that you have open. However the sales accounts
will be listed and totalled in the top of the report, followed by the cost of
sales accounts.

4. Close the preview window

Modifying the Report

Beautiful as the report is, it could do with some improvements! For a start, the
heading could be made larger and centred.

1. Double click the Part label for the heading

The Part Settings box will open.

2. Set Boldoption, and the Alignto Centre

This will centre and bold the heading. If you want, you can choose a larger
font size or a different font by clicking the Fontbutton. Note that if you do
this, MoneyWorks will ask if you want to override the standard font—this is
because the report may not be portable (other computers might not have
that font).

3. Click OKto close the Part Settings box

Inserting a Part

We should put some space between the heading and the report body.

1. Highlight the part below the Heading by clicking on its Part Label once

The part that prints the income will be highlighted.

2. Click the Insert PartToolbar button or press Ctrl-N/⌘-N

This inserts a new Part above the highlighted one.

The Part defaults to a blank heading, which will put some
white space between the report heading and the body of
the report.

The Insert Part
button

We should also insert some space between the sales and cost of sales parts.

1. Click once on the Cost of Sales part, and insert a new part by clicking the

Insert PartToolbar button or by pressing Ctrl-N/⌘-N
Report Writing Tutorial

Let’s see the effect of the changes we have made.

1. Click on the TestToolbar button and preview the report

2. When you have finished, close the Preview window

Saving the Report

balances will increase the value of the accumulator (because they are positive),
while credit balances (being negative) will decrease the value.

4. Click OKto close the Settings box

Note that the line in the body of the report that corresponds to the
accumulator is in grey—this indicates that the Part will not be cause
anything to actually print on the report.

Before we look at the report again, it might be a good idea to save it. This is so
we can use again later (note that you cannot do this is you are using the
MoneyWorks trial version).

5. Click the Append PartToolbar button to append a new part, and open the

Part Settings for the new part

1. Choose File>Save Report

The standard Save File dialog box is displayed—this will be pointing at the
Reportsfolder in your MoneyWorks Custom Plug-insfolder (which will have
been created for you if necessary).

6. From the Part Typepop-up, choose Accumulator Op

7. Set the accumulator Operationpop-up menu to Show

This will cause the accumulator values to be printed.

2. Call the report “Gross Margin Report” and click Save

Working with Accumulators

The report thus far shows the sales and cost of sales. We’ll extend it so that it
prints the gross margin, i.e. total sales less cost of sales.

8.

In the Show text box, type “TOTAL” and click OKto close the Part Settings
dialog box

We must specify the accumulator name to indicate which accumulator to
print. If we specify one that doesn’t exist, MoneyWorks will create one with
that name, set its values to zero, and make it start accumulating.

9. Preview the report on screen again to see the result, then close the

1.

Insert a new Part above the Sales part, then bring up that part’s settings

preview window

2. From the Part Typepop-up menu, choose Accumulator Op

An accumulator is a way of adding up data in the Account Parts.

3. Type “TOTAL” into the text box adjacent to the pop-up menu

Every accumulator has to have a name—this is because you can use more
than one accumulator in a report. There is nothing special about the name
“TOTAL”—it’s just a bit more descriptive than, say, “FRED”.

Note that the accumulator total is printed for the Actual column, but it has the
wrong sign (it should be positive, as the income is greater than the expenses).
This is because it is the sum of the sales accounts (which are negative), added to
the sum of the cost of sales accounts (which are positive). We need to reverse
the accumulator sign for it to print out correctly. We should also put some
additional space between it and the previous line, and also a description saying
what it is.

1. Double-click the Show Accumulator part and change its operation to Show

Reversed, and its Adornmentto Overscore

Note that the accumulator options pop-up menu is set to On,Clear. This option
activates the accumulator, and sets its values to zero. The data from every
report line from here on will be added to the accumulator. This means that debit

When the accumulator is shown in the report, it will be shown with
reversed signs (the actual contents will not change).
Report Writing Tutorial

2.

Insert a new part above the Show Accumulator part

This will default to a blank heading, which is fine for achieving some blank
space in the report.

3. Preview the report, then close the preview window

Cells

To put text into the accumulator line when it is printed, we must put it into one
of the cells of the report. A cell is the intersection of a part and a column. Cells
can contain text or formulæ. Any value in a cell overwrites the information that
would have otherwise been printed1.

We’ve got the basic part settings correct for the report now. We want to put in
comparative results for the previous period, which means having an additional
column.

We want each column to have the name of the period to which it refers.
However this will vary depending upon for which periods it is printed, so we
can’t just type in for example “June” as a column heading. Instead we use a
report variable. This is calculated whenever the report is printed. The variable
for the name of a period for a column is ColPer.

1. Open the Actual (COL3) column by double-clicking its label

Putting the month as a column heading

1. Double click on the cell that is in the intersection of the Show

2.

In the Heading, type “=ColPer” as shown below, and click OK

Accumulator part and the COL2 column

The Cell Settings dialog box will open.

The equals sign is to indicate that an expression follows which MoneyWorks
will evaluate when the report is printed (don’t type the quote marks
though).

We now want to make another column for the previous period—apart from
the period, this will be essentially the same as the column we have just
worked on, so we’ll use copy and paste.

3. Highlight the Column (COL3) by clicking once on the column heading, and

Choose Edit>Copy or press Ctrl-C/⌘-C

The column information will be copied to the clipboard

4. Click in the white area to the right of the report parts so that no portion of

the report is highlighted

2. Type “Gross Margin” into the Value field and set the Boldoption

5. Choose Edit>Paste or press Ctrl-V/⌘-V

3. Click OKto save the cell settings

A copy of the column is added to the right of the existing columns.

Preview the report, and close the preview window when finished

6. Open up the Column Settings for the new column (COL4) by double
Report Writing Tutorial

clicking the column label

We want this column to refer to the previous period.

7. Change the Valuepop-up from Movement This Periodto Movement Last

Periodand click OK

8. Preview the report, closing it when finished

Adjusting Column Widths

COL3 and COL4 are the column names (not to be confused with the column
titles). These appear in the top of each column, and are used to reference
the column.

1. Move the mouse so that it lies on the boundary between the column label

of the Account column and the next column

5. Preview the report, closing when finished

Percentage Breakdowns

The cursor will change into a column adjustment tool.

2. Hold the mouse button down and drag to the left

The column will narrow. Dragging right will increase it’s
size.

Column Calculations

We’ll now take the dollar difference of the this month and last month, to see
how much performance has improved (or otherwise).

1. Use the Append ColumnToolbar button to add a new column

2. Open up the Column Settings of the new column and set the Column Type

to Calculation

This indicates that this column will be based on the values of other columns
or MoneyWorks variables

3. Set the Heading to “$ Change”

4. Type “Col3-Col4” into the Formula, and click OK

It is often useful to look at percentage breakdowns on a report. For example,
what percentage of total sales are purchases, or what percentage of income is
derived from consulting.

Such details are not difficult to prepare in MoneyWorks. However before we can
calculate an item as a percentage of another item (such as sales), we need to
determine what the total for the other item is. Thus we will create an invisible
section of the report that calculates the total sales, and we will use this to work
out percentage of sales figures.

1.

Insert 3 new parts above the Activate and Clear Accumulator part

2. Make the topmost of these new parts an Accumulator with a name of

“PCT”, and the operation On, Clear

We will total the income into this new accumulator

3. Set the next part to Accounts of Type Sales, and set the

Invisiblecheck box

The invisible option means that no information is printed
for the part, allowing us to use parts in calculations and
not have them appear on the page. In this case, because
the PCT accumulator is activated, the total income will be placed into this
accumulator.

Set the Invisible
option to hide a
report Part.
Report Writing Tutorial

We need to turn the accumulator off so it won’t keep accumulating as we print
out the actual income.

The Cell Settings dialog box will open. We can if want put text or a formula
into this, but we will just leave it blank.

4. Make the remaining new part an Accumulator with a name of “PCT”, and

10. Click OK, and preview the report

the operation Off

We have now set up an accumulator that pre-calculates the total sales—it does
this for each column in the report. We will now insert a column in our report
that displays each income item as a percentage of the total income.

The Cell Settings box will close, and the cell will have a
diagonal line in the top right corner, indicating a cell
setting. This overrides the column setting, effectively
blanking it out.

A Diagonal line
indicates a cell
setting

5. Highlight the COL4 column (last month), and click the Insertbutton

If you need to remove a cell, highlight it and click the Deletebutton.

A new part will be inserted to the left of COL4

Report Settings

When you print a report, you set a period range for which the report is to be
printed (one copy of the report is printed for each period). This report prints out
information for two periods, and hence it may be more sensible to have only
one period available. We use the Report Preferences to do this.

1. Click the Settingstoolbar button

The Report Settings window will open This allows us to
specify what run-time options will be available for the
report. These can include custom parameters.

The Settingsbutton

6. Open the part, set the heading to “% Sales” and the column type to

Calculation with the following settings

Recall that COL3 contained the totals for the month. PCT.COL3 refers to
COL3 in the accumulator called PCT. You will recall that PCT contains the
total income (and further that this, being a credit, was a negative
number—hence the negative sign at the start of the formula).

Note: You’ll get an error message when you accept this calculation. This is

because the accumulator PCT may not have been created when you come
to do the column calculation. In this case it will be, so just ignore the
warning.

7. Set the “%” check-box, and click OK

This will append a % symbol to each value in the column.

8. Preview the report, closing when finished

You’ll note in preview that the percentage of sales is also applied to the cost of
sales. You can suppress this if you want by using a blank cell.

9. Double click on the cell at the intersection of the Accounts of Type CSpart

and the COL6column.
Report Writing Tutorial

You can put an expression into a heading (or into a cell). In this case we are
using a report variable called PerEnd, which will display the end date of the
period for which the report is being printed. For a complete list of these
variables —see Report Variables.

3. Preview the report, closing when finished

The report should have headings above the Sales and the Cost of Sales sections.
We’ll leave these as an exercise! Don’t forget to save your report—you’ll be able
to use it when you run your actual accounts.

The Final Report

The final report should appear as shown below

2. Set the option Choose One Period Onlyand click OK

3. Click the Testtoolbar button to open the print settings

Note that there is now only one menu for period selection.

Heading Expressions

The period for which the report is being printed should be in the report heading.
However as this is determined by the period you choose when you run the
report, you cannot “hard-wire” the period name into the title. You can however
use a report variable that will insert it for you.

1. Open the Part Settings for the report heading

This is the very first part in the report specification.

2. Replace the text in the heading field with:

Closing the Report

When finished, you will need to close your report.

1. Close the report window (press Ctrl-W/⌘-W)

You will be asked if you want to save the changes. Click Save.
Report Writing Tutorial

A Quick Customer Report

If you want to print your report again, you do not need to re-open it. The report
should be listed in the Reports menu.

3. Set the options as shown below

Extending the Report

If you want, you could extend the report into a full profit and loss report. As a
guide to how to do this, you simply need to:

• Add a part to get other income (accounts of type Income);
• Show (Reversed) the TOTAL accumulator (this is your net income)
• Add a part to get other expenses (accounts of type Expense);
• Show (Reversed) the TOTAL accumulator (this is your Net Profit/Loss);
• Pretty it up with a few headings

As you can see, the reporting in MoneyWorks is very rich and powerful, and not
too difficult to understand. We recommend that you experiment and create
your own reports, see what they produce, change them, enhance them. You
might like to look at some of the standard reports that come with MoneyWorks
(to find out how to open an existing report, see Custom Reports.

But you can do an awful lot more than just look at the general ledger ...

A Quick Customer Report

We can in fact design reports around any file in MoneyWorks, allowing for
Customer, Product and Job reports amongst others. To illustrate this, we’ll write
a quick report to show our top debtors.

This is going to step through each customer (i.e. each record in the Name
file) which has a DBalancevalue greater than zero (i.e. they owe us
something). This is sorted by the amount owed (note that we have set the

sort to
processed CUST so that we can refer to it in later calculations.

descending). We have named the current record being

4. Click OKto close the For Eachpart

5. Append another heading part, but don’t open it. Instead double-click on

the cell in COL1 of that part, to open the Cell window

6.

In the Valuefield, type “=CUST.Code” (without the quotes), set the Align
to Left, and click OK

When the report is printed, MoneyWorks will evaluate this formula, which
will give us the value of the code field in the name record being processed.

We’ll put the name and balance in columns 2 and 3 of the report—if you
are creating a new report, you will need to append a couple of columns.

To do this you can either create a new custom report (choose File>New>New
Custom Report), or just append the required parts onto the bottom of the
report we have just created.

7. Set the Valueof the COL2 cell to “=CUST.Name”, and Alignto Left

8. Set the Valueof the COL3 cell to “=CUST.DBalance”

1. Create a new Heading part with a heading of “Top Debtors”

You should have something like:

In the previous section we only looked at the general ledger. Now we want to
step through each of our customers. To do this we use the For Eachpart, which
steps through each record of the nominated file that meets a specified criteria.

2. Create a new part and set its type to For Each

9. Append another part to the report and set it to End For
Report Writing Tutorial

A Quick Customer Report

16. Key in a suitable value into the MinBalfield and preview the report

The report only lists customers who owe more than the balance entered.

From this, you should have got a hint of the awesome power and flexibility that
is available to you in report design in MoneyWorks. We’ve only skimmed the
surface—for a more technical discussion see Custom Reports.

1 Actually this is not quite true—if you have a “Null formula” (i.e. just =), the font
attributes of the cell will be used instead of the Part style, leaving the underlying
information unchanged.↩

This is where the For Loopterminates. Basically every report part between
the For Eachand the End Foris processed for each record found in the file
(or list) that the For Loopis traversing.

10. Click the TestButton and preview the report.

You should get a list of everyone who owes you anything. We want to limit the
report to just those who owe more than a specified amount, which we will enter
when the report runs. Such a custom setting is done in the report Settings.

11. Click the Settingstoolbar button to open the Settings window

12. Turn off the Standard Settingsand the Time Interval Spec, and turn on the

Custom Settings, then click the + button

A My Checkboxcustom setting will appear in the list

13. Double click My Checkbox, set the Controlpop-up to Number, the Name

to MinBal, then close the Control and the Settings windows

When we run the report, we can now enter a number into MinBal. We just need
to change the For Eachloop to only search for balances that exceed this value.

14. Double click the For Eachpart and change the whereformula to:

15. Click the Testbutton to open the Report Settingswindow
