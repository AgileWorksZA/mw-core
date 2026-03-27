# The Navigator

The Navigator

The Navigator

The MoneyWorks Navigator window provides visual access to most of the
functions within MoneyWorks, as well as “live” information such as overdue
receivables and specific dashboard information. Because common workflows
are presented in pictorial format, the Navigator is an ideal way for new users to
find their way around the program. However it replicates the menu commands,
and in general the more experienced user will find it faster to bypass the
Navigator and use the menu commands with their associated keyboard short-
cuts1.

Navigator Overview

The Navigator groups operations into functional areas in a graphical window.
This window cannot be closed (but it can be resized). The functions available
depend on which version you are using—MoneyWorks Cashbook for example
will not have functions for invoices. The standard Navigator consists of three
main sections, shown in the sidebar.

Getting Started

This section contains links to MoneyWorks help and documentation, and a visual
guide to setting up your new MoneyWorks file.

The Panel above is the “Setting Up” panel in MoneyWorks Gold, and
provides a checklist of steps to follow when setting up a new file. This is
shown when you create a new file.

Tip: Once you have finished setting up, close the Getting

Started section by clicking on the disclosure control to the
left of the section name.

Note: Help and support information is also available under the Help menu at
the top of the screen. This is somewhat more convenient as it can be
accessed from almost anywhere in MoneyWorks without having to access
the Navigator.

Navigation

The Navigation section of the Navigator contains flowcharts of typical business
workflows. There is a lot of redundancy in the design (i.e. functions may be
repeated on more than one panel), making access easier.
The Navigator

Navigator Overview

The panel above is the Day-to-Day panel in MoneyWorks Gold. This covers
most of the core functions of a typical business, and is complemented by
other more detailed panels, so (for example) a user who is solely concerned
with payables will probably use the more specialised Purchases and
Expenses panel.

Dashboard

The Dashboard section contains summary (dashboard) information about your
company. These panels are a realtime snapshot of your current position.

The Overview panel above is for the Acme Widgets Gold file. At a glance it
can be seen that they are approaching an imminent cashflow crisis (the
declining bank balance, bottom left), possibly caused by poor management
of their Receivables (bottom right).

Tip: You can configure the display on

the Income and Expense dashboard
by clicking on the company name.
This will open a settings window
where you can set the chart to be
grouped by any of the account
attributes (category, category2,
type, currency etc) for any
nominated period. This allows you
to explore how your pattern of
income and expenses have
changed over time.

Ledger Chart: This is a column chart of your ledger balances up to the current

period. The options are controlled by the pop-up menu settings:
The Calendar

• Customers broken down by: How to aggregate the customer data (by Code,

Category1, Category2, etc).

Note: To prepare the data, MoneyWorks needs to analyse your sales data
for both products and customers for the nominated time interval. For larger
data files, or longer time intervals, the analysis might require a number of
seconds.

Tips for Ledger Chart and Sales Explorer

• You can force the charts to recalculate by right-clicking in the body of the

chart and choosing Reload(Mac) or Refresh(Windows).

• On Windows, you can print the chart by right-clicking in the body of the

chart and choosing Print. You can also copy and share the chart.

The Calendar

The calendar panel provides a simple set of calendars for MoneyWorks users.

The Navigator

• Type: The type of accounts to

display (e.g. Sales, Bank accounts).
The two profit options will show
the income and expenses, with a
line for the difference (the profit).
Filters you have added to the Edit
option in the Selectpop-up menu
in the Account Enquiry window will
also appear here as custom
selections.

• Period: The number of historic periods to display. Each period will be

represented by a separate column.

• Breakdown by: Use this to segment the columns in the chart for more
granular information based on an account category, department etc.

• Overlay: Set this to add an additional line to the chart to show averages or

budgets.

Clicking on a column segment will drill down to the relevant transaction
lines (MoneyWoks Gold only).

Sales Explorer: These two bar charts allow you to explore your customer and

item sales over time. The left chart displays the item sales, and the right
displays the customer sales. Clicking on a bar in either chart updates the
other chart to show just those sales for the clicked item/customer (called
"cross filtering"). The options are controlled by the pop-up menu settings:

• Show: The data to display:

Revenue, Cost, Margin, Quantity,
Count (the number of transaction
lines), % Margin. The margin is
calculated as the average unit value
of an inventoried item, or the buy
price/standard cost for a non-
inventoried items, at the time the
transaction was posted.

• For: The top (or bottom) number of
items and customers to display.

• For: The duration of the sales data (1 Month, Quarter, Year to Date etc).
• To: The end period of the data to display.
• Products broken down by: How to aggregate the product data (by Code,

Category1, Category2, etc).

• The calendar is stand-alone. It does not integrate with iCal, outlook or any

other electronic almanac. This makes it very easy to use.

• The calendar does not reflect any messages in the Reminder system, nor

will it pop up alerts.
The Navigator

The Calendar

• By default there is a company-wide calendar (available to all users), and a

separate one for each user (only available to that user). Additional
calendars can be created for company resources, such as meeting rooms,
equipments etc.

To record or modify an event in the calendar

1. Click on the cell corresponding to the event date (below the date)

The calendar entry window will open. Any existing events will be displayed.

Events for the day

The changed event will be displayed on the calendar in the selected day.

To label a day

Provided you have the privileges to do an Account Enquiry, you can label special
days such as holidays. The appear next to the date in red:

1. Click on the date itself

The Set Day Name window will be displayed.

A "named" day

2.

If you are adding a new event, enter it into the bottom field (a maximum
of six entries can be made per day).

3.

If you are modifying an event, make any changes to it

4.

If you want to delete an event, delete all the text in the field.

5. Click OK

2. Key in the name of the day.
The Navigator

Using the Navigator

Note: This can only be done on the main Company calendar, and the named

days will appear on all other calendars.

To switch between calendars

To change from the company to your personal calendar, click on the company
name. Your name and initials will be displayed instead of the company name. To
change back again, click on these.

If there are more than two calendars (see below), clicking on the company name
will display a choices list of the available calendars. Select the calendar you want
to use from this.

Accessing the Calendar through mwScript

As of MoneyWorks 9.1.7, it is possible for a script to access the contents of the
calendar. For example, a scheduling script could check in a nominated calendar
to see if it was a holiday, and not schedule deliveries for that day.

To access the calendar:

let entries = cal:getEntries(forDate, calendarName)

returns all entires for the specified calendar and date as newline delimited text.

• For the main calendar, calendarName should be empty, i.e. ""
• To get entries for all calendars, use "@" as the calendar name. The text

returned will be tab delimited, with the calendar name in the first column
and the entry in the second. The calendar name will be prepended with a
"U" or a "C", depending on whether it is a user calendar of one created in
the Calendars validation list.

Using the Navigator

Each section is divided into a number of panels.

• Click on a panel in the sidebar to select it;
• To move to the panel above or below, press the left or right arrow key

respectively;
To create additional calendars

Additional calendars can be created using a special validation list called
"Calendars". For example, the validation list settings below create two new
calendars for meeting rooms.



The Navigator

Using the Navigator

• The panels in the Navigation section are numbered starting from 0. Pressing
0 will take you to the Day-to-Day panel, 1 to the one below that and so
forth;

• Click on the disclosure control preceding the section name to show/hide

the topics in that section;

• Click on an icon on panel to perform some operation—often this will take
you to the relevant MoneyWorks list and a coach tip will appear to coach
you on what to do next. Coach tips disappear as soon as you click anywhere
or type anything—you do not need to click on the coach tip itself to dismiss
it.

• Hold the mouse over an icon to see more information

about that function. If there is a keyboard shortcut for the
function that will also be displayed.

Tip: You can make the Navigator the front window from almost anywhere in

Moneyworks by pressing Ctrl-0/⌘-0 (zero)

Many Navigator icons/buttons give access to MoneyWorks
Lists —see Working with Lists. Such icons are usually shown
with a small blue + icon attached at the bottom, right corner:

• To display the list, click the list icon itself
• To add a new record to the list, click the associated blue +

icon.

Click the blue + icon
to add a record to
the list

Customising the Navigator

In MoneyWorks Gold, it is possible to customise the Navigator: remove unused
panels; create new panels with your own workflow; create your own
Dashboards, etc. To do this you need to first copy the Navigator folder from the
Standard to the Custom plug-ins folder. Customisation is done using the
MoneyWorks Forms Designerand (for dashboard graphs and reports), the
MoneyWorks Report Writer. You can also change the cloud background image
by replacing the background.jpg file in the Custom Plug-ins/Navigator/
Navigation folder.
Improving the results with a tropical background.

1 Which is why this manual refers to list and menu commands, largely ignoring the
Navigator.↩



