# Getting Started

Getting Started

Note: Firewall settings or proxy servers may block MoneyWorks from checking
for updates. If MoneyWorks consistently reports that it cannot contact the
Update server, you should check with your IT support person.

Getting Started

Note: If you have recently connected to a Datacentre server, you will get a

warning if you attempt a software update.

Datacentre users should generally not do manual Software
Updates—Instead the Datacentre server will provide updates when you log
in.

1 The manual is not automatically installed, but will be downloaded the first time
you use it.↩

2 If you register, we can tell you what your serial number is in the event that it is
lost. If you don’t register, we won’t know what it is.↩

This chapter covers how to set up MoneyWorks, and, at fourteen pages of
riveting prose, is somewhat longer than we would really like. Don’t be fooled by
this: setting up is not necessarily difficult. We’ve tried to cover every
contingency and possibility, and for the more accounting-inclined, talk about the
underlying philosophy as well. If you are just the average punter (especially if
you are a Cashbook user), you can probably ignore most of this.

But nor do we want to lull you into a false sense of security. It is important to
get the setup as correct as possible. Mistakes made here can come back to
haunt you later—get the starting bank balance wrong for example, and your
bank reconciliations will be a little tricky1.

Of course if you are starting a new company the setup is much easier: there is
no “baggage” that needs to be recorded; no historic balances or outstanding
transactions. However most people are not in that situation.

So before you start, it is important that you are well organised. In particular, you
need to have the correct information available. For Cashbook users this is
normally just a bank statement or two; for others you ought to also have the
details of any outstanding transactions (these are explained a bit later on).

Tip: If you are new to MoneyWorks and haven’t done so already, work through
the Tutorial before you attempt to set up. That way you will be able to find
your way about in MoneyWorks, create transactions and so forth. Consider
this more of an edict than a tip.

Tip: If you are setting up your file based on an existing MoneyWorks one, use

the Save a Clone ascommand.

Quick Start

If you are using MoneyWorks Cashbook, or are in a hurry, here’s an outline of
what you need to do, and where in the manual you’ll find how to do it:

1. Create a new file
Getting Started

Setup Information Required

This is just a common or garden file that sits on your computer and which
stores all the information that you have entered into MoneyWorks. You
should give it a sensible name, and make sure it is in a sensible location
(because you will want to back it up every so often!). Creating a file is
discussed in the aptly named Creating Your New File.

2. Set your financial/fiscal year

You need to tell Moneyworks when your financial/fiscal year starts—this is
normally your tax year (although for personal accounts you might prefer a
calendar year). It is important to get this right as it cannot be changed easily
later. This is discussed in Periods.

3. Optionally choose your chart of accounts

A chart of accounts is just a coding structure for allocating your income,
expenses etc. MoneyWorks comes with a number of account templates
from which you can choose, or you can create your own. If you choose one
of the pre-supplied templates, you can of course modify it later.

If you want a complete set of accounts (and most businesses do, because
(a) it is a legal requirement, and (b) you need to know this stuff if you are to
run a successful business), you should also enter in the current balances for
your existing chart of accounts (the faint hearted can defer this and leave it
to their accountant to do later if they want). This is covered in Entering your
Balance Sheet.

8. Check the Tax Table

The tax rates you use might be different from the ones that we supply. See
Check Your Tax Rates

And that’s basically all there is to it. It’s not hard, but because this is the
probably the first time you have done it, it is not necessarily easy either. Just be
careful and be methodical, and if it all gets too much, you can always get a
MoneyWorks consultant or your accountant to give you a hand.

Setup Information Required

4. Enter your opening bank balances

To start MoneyWorks successfully you will require the following:

These are taken off your bank statement(s), and can be entered as part of
the setup process (see Bank Balances).

5. Enter outstanding historic transactions

If you are using Express or Gold, you should really enter any historic
transactions that are still outstanding (and this is where things can start to
get a bit tricky). By “outstanding” we mean invoices that are not yet paid,
and cheques that have been issued but not yet presented (see Accounting
for Unpresented Itemsand Entering Opening Payables & Receivables). It is
better to enter these at the outset, otherwise they will suddenly appear on
your bank statement in the future, and you won’t know what they are for.

6. Enter your opening stock

If you are running an inventory system, you will need to enter your opening
stock on hand.

7. Enter your opening balance sheet

A start date: The Start Dateis the date from which you will be entering all

information into MoneyWorks. It is convenient (but not necessary) if this is
the start of a financial year, so that you can use the financial statements
that your accountant has prepared as a starting point. If you are setting up
MoneyWorks shortly after the start of a financial year you might set the
start date as the beginning of the year and back-enter transactions.

You don't need to have a full balance sheet available to start MoneyWorks.
You can start with the cash book and/or payables and receivables, and enter
in the balance sheet at a later time if you wish.

Bank balance: You will need to have the opening balance as at the Start Datefor

each bank account. These are taken directly off the bank statements.

In addition, you will need to create a list of all unpresented items (i.e.
cheques and deposits that you have made before the start date but which
appear on the bank statement after the start date). As these transactions
straddle the start date, they need to be specially handled.
Getting Started

Creating Your New File

Outstanding payables, receivables: You will need to list all invoices that you

have sent out or received that have not been paid as at the start date. Like
the unpresented cheques, these straddle the start date, and hence need to
be handled differently.

Inventory: If you are intending to run a stock control system you will need to do
a stock take so that the correct stock values are available. You will also need
to have the cost price of the items available so that MoneyWorks can
correctly calculate your margins and cost of goods.

Chart of Accounts: You will also need a chart of accounts. This is basically a set
of codes against which you can categorise income, expenditure and other
transactions. MoneyWorks comes with several account templates that you
can use, or you or your accountant may already have one.

Before you start have a clear idea of what you want to achieve. Work out a
suitable chart of accounts, and keep it as simple as possible. Ask your
accountant if necessary. Systematically collect the required information in a
form suitable for entering into the computer.

Setup Definitions

For clarity, the following definitions will be used in this chapter.

Start Date: The first day of operation of your accounting system.

Close-Off Date: The day immediately prior to the Start Date. This is the last day
of use of whatever other accounting system you used, and the balances
from this will need to be transferred into your MoneyWorks document.

Start Period: The period (month) in which you want to start entering
information. The Start Datewill be the first day of this period.

Setup Period: The period (month) immediately prior to the Start Period. The
Close-Off Datewill be the last day of this period. This period will only
contain transactions that establish your opening balance. The balances at
the end of the Setup Period(the closing balances) will be the same as those
at the beginning of the Start Period(the opening balances).

Creating Your New File

The information about your company, its transactions, balances, budgets etc.
are all held in a single document or file. Although in principle you can put this
file anywhere on your hard drive, we recommend that you keep it somewhere
that is easy to backup (the My Documentsfolder in Windows for example).

To create a new document:

1. Start MoneyWorks by double clicking on the MoneyWorks application
icon (Mac) or (on Windows) by choosing MoneyWorks from the Start
menu

MoneyWorks will start and the MoneyWorks Welcome window will be
displayed (depending on your version, it may differ from the one below).

This lists recently opened MoneyWorks files, giving you easy access to all
your account files. If you have done the Tutorial, you will see the Acme file
listed (if you haven’t, we strongly recommend that you click the Sample
button and do it now). The Openbuttons are used to open an existing
document.
Setup Information

Getting Started

2. Click the NewButton

The standard File Creation dialog box is displayed. You use this to indicate
where you want the file placed on your hard drive, and what to call it. If you
are not familiar with how this operates, see your Windows or Macintosh
User Guide.

3. Type the name of the new document into the File Creation dialog, and

select where you want it stored on the disk

Your “Documents” folder (or a folder inside it) is a good place. You should
not place your document in the same folder as the MoneyWorks
application—instead keep it somewhere where it will be easy to backup.

4. Click the Savebutton to create the document

The document will be created in the indicated location and with the given
name. This may take a second or two.

The MoneyWorks setup screen will be displayed.

Setup Information

There is certain key information that is required before you can start using
MoneyWorks. The Set Up New Documentwindow enables you to enter this
quickly and easily by simply clicking on each button (in any order). Each part is
ticked as you complete it.

Company Information

This is the name and contact details of yourself or your company.
Getting Started

Setup Information

Note: If you are unsure of the details of your financial year, please talk to your
accountant. It is essential to get this information correct at the outset—it
cannot be altered after the setup.

To enter details of your financial year and periods

1. Click the Periodsbutton

The Financial Year window will open

Enter the information into the appropriate fields in the window. Do not worry if
not all the information is to hand, as you can change it later.

Note: The Tax Information varies from country to country; this is where you

record your GST, ABN, IRS, PST, VAT, Sales Tax numbers.

The Logobutton is used to paste in your company logo.

Periods

MoneyWorks needs to know about your accounting (financial/fiscal) year, which
varies from country to country (e.g. for most Australian businesses, it runs from
1st July to 30th June; in New Zealand it is usually from 1st April to 31st March).

The year is broken into periods. You normally have 12 periods in your financial
year, each one corresponding to a calendar month. However MoneyWorks lets
you have anywhere from two to fifteen periods.

2. Choose the start-end month range for your financial year from the

Financial Yearpop-up menu

3. Choose the year in which you first want to start using MoneyWorks from

the Start inpop-up menu.

The first period in the nominated financial year will be your Start Period.
MoneyWorks will also open an additional period one month prior to this,
which is your Setup Period.

Note: You can only open new periods into the future, not backwards. If you are
entering historic data make sure your first open period is sufficiently old to
take the earliest transactions.
Setup Information

Getting Started

4. Click the OKbutton to confirm you choice.

MoneyWorks will create a 12 month financial year starting in the
nominated period. The Start Periodand the Setup Periodare made
available for transaction entry. If the start period is near the current date,
then MoneyWorks will open periods up to the current date for you as well.
Otherwise you can open subsequent periods when you are ready using the
Open/Close Period command.

Note, it is generally best NOT to open periods in advance of the current
date.

If you are starting your accounts partway through a financial year, that’s
OK—you can just open the periods up to your start period once the setup is
finished —see Opening a New Period. If you require a more complex structure
(e.g. a 13 period year), click the More Optionsbutton (Gold only).

More Complex Financial Year

In Gold only, if you want a financial year with a different structure from normal,
click More Optionsin the Financial Year window to display the following:

In this window you can specify the number of periods you want in your financial
year, the names of the periods (and year), and the setup period.

Twelve Calendar Months: Each calendar month is equivalent to one accounting

period. This is the default setting.

Twelve Calendar Months plus End: An additional period is provided for end of
year adjustments. This period ends on the same day as the 12th period in
the financial year.

Other: Use the pop-up menu to specify the number of periods in your financial

year. You can have any number from two to fifteen.

Financial year starts: Choose the first period of the financial year. This

automatically relabels the period names for you.
Getting Started

Setup Information

First Period of operation: Choose the first period of operation (the Setup

Period) for your accounts—this can be different to the start of your financial
year.

End date: Specify the end date of your Setup Period.

Period Names: If you want to have period names different from those supplied,

click on any period name in the period names list. You will then be able to
overtype the period name provided. Pressing tab will move you through the
list. Period 1is the first period of your financial year.

Year Names: MoneyWorks has taken a guess at the year names you will want. If
you want to change these click on a year name in the Year Names list—you
will then be able to overtype the name. Pressing tab will move you through
the list. Remember that at this point, the current year is the year of your
setup period.

If you want to return to the simple financial year setup, click Fewer
Options—the guff you have entered here will be discarded.

Chart of Accounts

MoneyWorks comes pre-supplied with several charts of accounts that are
suitable for different types of organisations. You can use one of these, or set up
your own coding system. If you select one of the standard charts you will be
able to fine tune it to your own requirements by adding and deleting account
codes.

To choose your chart of accounts:

The Localisation pop-up allows you to create a file which uses the location
settings (including tax names) for a different country than your own. Some
locations have different tax rates for different states/provinces. A separate “sub-
locale” pop-up menu is provided for such locations for which MoneyWorks has
separate tax tables.

1. Click the Accountsbutton to display the available samples

2.

If necessary, set the Localisationpop-up for the file’s target country

The accounts for various types of organisation may be viewed by using the
Company Typepop-up menu. The Minimal set, as shown in the diagram, should
be used if you want to set up your own accounts from scratch—it consists of
only the accounts that MoneyWorks requires.

3. Set the pop-up menu to your choice of accounts, and click the Usebutton

The accounts QuickSetup window will close.
Getting Started

Setup Information

You can click the Accounts button again to change your choice if required. Note
however that you cannot change the chart of accounts in this manner once you
click the Acceptbutton in the Setup New Document window (although you can
make changes to the accounts you chose).

Accounting for GST, VAT or Sales Tax

If you are not registered for GST, VAT, PST or Sales Tax2, you will not want to
have MoneyWorks keep track of GST for you. You should therefore turn off the
option I need to account for GST.

If this option is off:

• The tax columns in the transaction entry will be hidden,
and no GST will be accounted for when transactions are
entered;

Turn off this option
if you are not
registered for GST

• You will be able to purge (i.e. delete) transactions that have not been

processed in the GST report.

You can turn the option on later if required in the Document Preferences —see
GST/VAT/Tax.

Note that even if this option is turned off, MoneyWorks will still create two GST
control accounts. You cannot delete these accounts, and should not use them.

If you do account for GST/VAT/Sales Tax

Set the options as appropriate for your GST basis, specifically:

• If your GST is done on a payments or cash basis, set the Payments Basis
option; if it is done on an invoice or accrual basis, set the Invoice Basis
option;

• Set the GST Cycle to the frequency with which you make your GST/BAS

return to the government;

If, as is most common, you need to account for GST, you need to set up your GST
details in Moneyworks. If you don’t know some of the details, you can set this
up or change it later —see GST/VAT/Tax.

• Set the Next cycle ends ondate to your Close-Off Date. This is because it is

advisable to run a special GST report once the setup has been completed to
mark the setup transactions as having been processed for GST.

1. Click the GST Setupbutton to display the GST Settings window

Note: Any general ledger accounts with a "*" tax code are considered to be
outside the tax system, and cannot have tax applied to them. Do not use
this tax code for day to day accounts, such as sales, inventory or fixed
assets.

For a discussion on GST, —see GST, VAT, Sales Tax & Tax Codes.
Getting Started

Accepting Your Setup

After specifying your company details, period structure, and selecting a chart of
accounts, you can move onto the next phase of the setup. The Acceptbutton
will only be enabled if you set your financial year in step two of the setup. When
a step is completed, it will be ticked.

To confirm your setup:

1. Click the Acceptbutton in the Setup New Document window

The window will close, and a new window will be displayed into which you
can enter your bank balances.

Once you have clicked the Acceptbutton you will not be able to change the
structure of your financial year, or choose a different set of accounts (you can of
course modify the chart you have selected).

The Setup Account

The pre-supplied charts of accounts have a special account with an account
code of SETUP. This account is intended to be used in setting up your opening
balances.

The setup account will receive:

• opening receivable (debtor) and payable (creditor) balances;
• opening bank balances, and adjustments for unpresented items;
• opening stock;
• opening GST adjustment.

The balance of these will be journalled out when the opening balance sheet is
entered. Once the setup is complete, the SETUP account can be deleted (for
information on how to delete an account —see Deleting an Account.

There is only one setup account supplied with the standard accounts. If your
setup looks to be complicated, you might consider creating additional ones for
each of receivables, payables, stock and GST (you can do this by simply
duplicating the existing SETUP one, and call them SETUPR, SETUPP and SETUPS).
The pre-supplied SETUP account is required by MoneyWorks for the automatic

Setup Information

entry of the bank balances.

Bank Balances

A fundamental reason for running an accounting system is to look after your
money. To do this accurately, the accounting system needs to know how much
money is in each of your bank accounts. The Bank Balances screen, which is
displayed when you click the Acceptbutton, lets you enter this information.

The Bank Balances screen displays a list of all the bank accounts in your chosen
chart of accounts. Some of these may not be relevant to you (for example, you
may only have one bank account), and you may also want to change the names
of the accounts.

If you don’t want to set up your bank accounts at this point, click the Skip
button—the MoneyWorks navigator will open and no opening bank balance
journal transaction will be created. You will need to manually set up your bank
accounts and their balances —see Manually Entered Bank Balances.

Removing a bank account

To remove a bank account that you do not require:

1. Uncheck the Use Acctcheck box beside the appropriate account
Getting Started

Check Your Tax Rates

You can turn on the check box again if required. Note you must have at least
one bank account, so you cannot uncheck the first check box.

Changing an account’s name

To change the name of a bank account:

1. Type the new name into the appropriate Namefield

Specifying opening balances

If you have a complete balance sheet (which includes the bank balances)
available at setup time, you will not want to enter any opening balances at this
point. Rather you will journal in your complete balance sheet —see General
Ledger Journals3.

If however you just want to get started, and (possibly) enter in the balance
sheet at a later point, you can enter the opening balance for each bank account.
If you do this MoneyWorks will automatically create a journal to establish the
bank balance(s).

To enter the opening bank balance:

1. Type the balance as at the end of the Close-Off Date (taken from your
bank statement) into the appropriate Opening Balance field. If the
account is overdrawn, set the O/D check box

The journal that is created will be dated with the Close-off Dateand will be in
the Setup Period(or in your initial period if you used the More Optionsperiod
button). It will be posted and will not appear on your bank reconciliations. The
balancing account for the journal will be the SETUPaccount.

To confirm the bank details:

1. Click the OKbutton.

MoneyWorks will change the account names, delete any unwanted bank
accounts, and (if appropriate) generate an opening journal so that your
bank accounts are set up with the correct balances.

Clicking the Skipbutton will discard any entries you have made in the Bank
Balances window and the Navigator will be displayed.

This completes the first stage of the setup. You can now start using MoneyWorks
as a cashbook and a payables and receivables ledger. If you want to take your
accounts through to full balance sheet, you will need to enter the opening
balances (this can be done at a subsequent time).

You may also want to add or delete accounts at this stage —see Creating a new
Account.

Manually Entered Bank Balances

If you clicked the Skipbutton in the Bank Balances entry window, you will need
to manually set up your bank accounts. To do this you should:

• Create any additional bank accounts that you may need —see Bank
Settings, or delete ones that are surplus to your requirements —see
Deleting an Account.

• Manually journal in your opening bank balances taken from your bank

statement. To do this you need to create a journal —see General Ledger
Journalsand debit the bank accounts with their opening balances and
credit a balancing account (probably just the setup or suspense account,
but check with your accountant). If a bank account is overdrawn, it should
be credited.

• Do a special bank reconciliation —see Bank Reconciliation. This reconciles
all the historic transactions that make up the opening balance, and hence
will have a zero opening balance and a closing balance of whatever the
actual bank balance was.

Check Your Tax Rates

The Bank Balances window will close and the MoneyWorks Navigator will
be displayed.

As part of your setup, MoneyWorks will have created a tax table for you based
on the VAT, GST or Sales Tax rates in your location. It is important that you check
this—we do not supply tax rates for every location, and the rates in your
Getting Started

Entering Outstanding Information

location may have changed since your version of MoneyWorks was created.

Entering Outstanding Information

To check your tax rates:

1. Display the Tax table by choosing Tax Rates from the Show menu

2. Double click a rate to modify it

For more information on tax tables, see Tax Codes

3. Click the OKbutton to save any changes made and close the Tax Rate

window

Tip: If you have need to enter a lot of tax codes, they can be imported from a

text file (see Importing Tax Rates).

Unless your business is just starting, there will be transactions entered prior to
the Start Datewhich do not get completed until after the Close-off Date. For
example you may have received an invoice and not paid it until the end of the
following month.

These incomplete transactions need to be handled specially. We are not
interested in the detail of the transaction because it occurred prior to the Start
Date. However we do need to record enough information so that details of its
completion can be recorded (e.g. when you finally pay the unpaid invoice).

A few points to note on entering incomplete transactions:

• They will all be dated before your Start Date and will appear in your Setup

Period

• MoneyWorks is not interested in the finer details of what the transaction

was for, but only that it is not yet completed. Hence these transactions are
not coded to income or expense accounts (this has presumably already
been done outside MoneyWorks). We code all incomplete transactions to
the Setupaccount.

• These transactions will all affect your balance sheet in some way
• The transactions should have the same GST, VAT or Sales Tax as the original

GST, VAT, Sales Tax and the Setup Account

It is important that taxes on the opening transactions are correctly handled.
Normally you will have accounted for any such tax in your previous system, so
you want to be careful not to double count it. However if someone doesn’t pay
one of the outstanding invoices, you will want to reclaim the tax.

Also, where you are reporting for GST or VAT on a payments/cash basis,
MoneyWorks will look at the original invoice to determine the GST/VAT
component of the payment. Hence it is important that the GST/VAT component
of these is correctly stated.

For these reasons the Setup accounts should be always be setup to reflect the
rate on the original transactions, and thus will have a “TAX” rate in North
America, a “G” tax rate GST countries, and a “V” rate in VAT countries. You
Getting Started

Entering Outstanding Information

should check in the Accounts list —see Modifying an Accountthat the Setup
account(s) match your local tax requirements.

Entering Opening Payables & Receivables

The following sections should be used as a guide to entering your opening
balances. Bear in mind that situations do vary, and this general “recipe” may not
work for you. If in doubt ask your accountant.

Accounting for Unpresented Items

It is probable that some of the cheques that you wrote out prior to the Start
Dateare presented to the bank after the Close-Off Date. This may even be true
for some deposits received by you if you are not in the habit of daily banking.
You need to identify these transactions, and handle them specially.

Before you start, you should make a list of all unpresented cheques as at the
Start Date. These are cheques that were written out before the Start Date, but
were not presented (i.e. do not appear on your bank statement) until on or after
the Start Date.

Enter each cheque as a cash payment as follows:

1. Create a new Payment

2. Check that the bank account is set correctly, and enter the cheque

number, date, and payee for the cheque

This information should be on the cheque butt.

3. Type “Unpresented item” in the description

4. Code the amount of the cheque to the SetupAccount

5. Click the Nextbutton to enter the next cheque, or OKfor the last

It is important to check your work. Make sure that the amount of the cheques
entered into MoneyWorks is the same as the total of unpresented cheques on
your list —use the Sum Selectioncommand. Also make sure that they are all
dated prior to your startup date, and appear in your Setup Period.

This is required for MoneyWorks Express and MoneyWorks Gold only.

You need to enter any invoices that you sent or received prior to the
MoneyWorks Start Date.You might have subsequently paid these, but the key
thing is that they were outstanding on your Start Date.

As an example, assume that you are setting up MoneyWorks to start on April
1st. At the close of trading on March 31st, you would probably have some
outstanding invoices—you might not yet have paid the phone account for
February or a supplier for goods received in early March. Similarly some of your
customers may not have paid you for goods or services provided, even though
they were invoiced in March or earlier. It is these invoices, outstanding on the
31st March that constitute the opening balances for receivables (i.e.
debtors—people who owe you money) and payables (i.e. creditors—people to
whom you owe money).

These opening receivable and payable invoices need to be entered into
MoneyWorks. Because they occurred prior to the period of interest, they need
to be treated specially. The best way to handle these opening balances is to
enter all of the outstanding invoices. These will go into the Setup Period, so that
in the example above, they would be entered as March transactions.

Normally when you enter invoices you indicate what income or expense
accounts will be affected by the invoice. However, for the opening invoices,
these will be accounted for elsewhere. All we want is the total owing or owed
for each invoice. Therefore we will code them to the Setupaccount (trust us, we
do know what we are talking about!).

Entering Opening Receivables

Before you start to do this, you should ensure that you have copies of every
invoice that was sent out prior to your startup date and which have not been
paid at the startup date.

If you have a lot of opening invoices that are already in electronic format it may
be possible to import them instead of having to rekey them. See Exporting &
Importingfor a discussion on importing.
Getting Started

To enter your Opening Receivables:

1. Create a new Sales Invoice

If you are unsure of how to create a new sales invoice, please work through
the tutorial, or see Entering Sales Invoices.

2. Type the customer code into the Debtor field and press tab

As this is the first time you have used this code, it will not be recognised so
the choices list will be displayed —see Entry and Validation where a Code is
Required.

3. Click the Newbutton to create a new Name entry for this debtor

The Debtor entry screen will be displayed.

Fill out the information in this screen —see Creating a New Name. Most of
the details will be on the invoice. You should have the name and address,
and it is also useful to put in the phone and fax. When all the details are
entered, click OK.

4. Type in the original invoice number

5. Enter the invoice date

The period menu should set itself to the Setup Period4.

The final entry should look something like this.

Entering Outstanding Information

Note: The SETUP account has been set up at the normal tax rate, and tax is

automatically subtracted from the gross. If the invoice was taxed at a
different rate, change the Tax Column to reflect that rate (for example if it
had no tax, you will need to key the amount of the invoice into the Net
column and set the tax code (TC) column to “E” (NZ, UK or Canada), “F”
(Australia), “EXE” (USA) and so forth).

6. Key in the customer order number if appropriate

10. Click the Nextbutton or press keypad-enter to enter the next invoice

7.

In the Description field, type “Opening Balance”

This is for your reference only.

Check your entries

8. Type the total amount of the invoice into the Gross field and press tab to

move to the account field in the first detail line

9. Type “SETUP” and press tab

SETUP is the code for the setup account. If you have created a special one
for opening receivables, use that code.

It is important to check that you have entered all these invoices correctly. To
check the amount, you should add up the total amount (tax inclusive) of all the
invoices. You should then compare this amount against the total of the invoices
in MoneyWorks. Use the Sum Selectioncommand to do this.

Check the total in MoneyWorks against the manual total of the actual invoices.
If they are not the same, you need to check your entries.
Getting Started

Entering Outstanding Information

You also need to check that all the opening balance invoices occur in the Setup
Period. If your Start Dateis April 1st, all these transactions should be in the
March period.

The simplest way to check this is just to “eyeball” the period column when the
Sales Invoices list is displayed in the Transaction window.

Entering Aged Invoices

If you want to maintain the ageing of your receivables, then once all invoices
were entered (and posted):

1. Choose Command>Age Debtor Balances

The Age Debtor Balances window will be displayed.

The posted invoices dated before the date will be aged one cycle. Ones
dated after the date will not be affected.

4. Repeat steps 1-3 for the subsequent two months

Entering Opening Payables

Before you commence, you should make sure that you have a copy of every
invoice that you had received prior to the Start Datebut that was paid on or
after the Start Date, or is still unpaid.

Entering your opening payables is analogous to entering your opening
receivables, except that you enter them in as Purchase Invoicetransactions.
Thus an opening purchase invoice will look something like this:

2. Turn on the Do not age invoices entered afteroption, and enter the cut-off

Points to note:

date for the oldest invoices

For example, if you are starting in April, this will be three months prior, so
enter 31 January.

3. Click Age

1. You will need to enter the name and address details for each creditor (i.e.
supplier or vendor) as the transaction is entered—this should be on the
supplier’s invoice.

2. The transaction date should be before the Start Date, and the period must
Getting Started

be the Setup Period

3. The invoice is coded to the Setupaccount

4.

In a GST/VAT environment, the tax amount on the entry should
correspond to the tax amount on the original invoice (for pure sales tax,
this is not important as the tax is not reclaimable)

5. You need to check the total of the invoices entered against the actual total

6. When you are satisfied that all is correct, you should Post the transactions

Entering your Opening Stock

If you intend to use the inventory system in MoneyWorks Gold, you will need to
have done a stock take as at the close of trade on your Close-Off Date. You will
then need to enter this, either by means of a Stock Journal or by using the
MoneyWorks stocktake feature.

Using a Stock Creation Journal

Although you can specify the products as you create each line in the journal, it is
a better idea to enter your products into MoneyWorks before you attempt the
journal —see Creating a New Item. Remember that the buy and sell prices that
you enter will be those as at your Start Date.

Entering Outstanding Information

2. Ensure the Date is set to the Close-Off Date

3. Set the Contra Account to SETUP

If you have created a special stock setup account, set it to that.

4. Type “Opening Stock” as the Description

5. For each product, enter the quantity on hand at your stock take, and its

unit value

The opening stock is entered through a Stock Creation Journal. For ease of entry,
limit the number of items in each stock journal to about 50.

Each product code will take up one detail line

1. Create a new journal and set its type to Create

This is used to “create” stock out of nothing.

You should total up the value from your stock take and compare this with the
total value of the stock creation journal(s). Note that these figures are GST
exclusive. The stock quantities can be checked by printing off the stock list —see
Printing a Product List.

When you have checked that the stock is entered correctly, post the journal(s).
Getting Started

Using a MoneyWorks Stocktake

The MoneyWorks Stocktake feature allows you to enter just the quantities on
hand in a list view. Points to note:

• The items will be brought into stock at the average unit value from the

product record (or the last Buy Price, if there are no items in stock as in this
case). You must ensure that this price is correct;

• The stock take date is the Close-Off Date;
• For the special case of setting up only, the stock adjustment account will be
the inventory account (a current asset). Normally it will be an expense/cost
of sales account.

The Setup GST Report

Note: This is not required for pure sales tax countries such as the USA.

If you have been entering opening balances as described in the previous
sections, MoneyWorks will have been keeping track of your GST for you.
However you will already have accounted for this GST elsewhere, so we need to
clear it. We need therefore to do a special one-off GST report from
MoneyWorks, and journal out this GST. Otherwise we are in danger of double
counting it.

Note: You should do this GST report after all your opening transactions have
been entered (the opening journal can if necessary be entered after).

1. Choose Reports>GST Report

The GST Report Setup window will be displayed. Check that it is reporting
on the correct basis (payments or invoice), that the GST report date is set to
the close-off date, and that the Show Transactionsoption is set.

2. Print the Report

You will be asked if you want to finalise it. Before you do this, check that all
the transactions that appear on the report appear correct.

Entering Outstanding Information

The only GST that should appear in the report is that for unpresented items
and unpaid invoices—all other transactions listed should have zero GST
components. If you haven’t claimed back this GST previously (which would
be the normal case), you will need to manually adjust the results of your
next report to account for it.

If there are any errors you should not finalise the report. Rather correct the
transactions by entering adjustments —see Cancel Transactionand redo the
GST report.

3.

If the report appears correct, ensure the “Journal to Holding Account”
option is turned off (as in this instance we don’t want a journal), and click
Finalise

The transactions on the report will be tagged as having been processed for
GST. They will not appear in future GST returns. We assume (of course) that
the GST has been calculated for these in the previous system.

Note: If the Close-Off Datedoes not coincide with the end of your GST cycle,

you will need to reset the Next Cycle Ends Ondate in the GST preferences
to the date the next GST cycle ends after your Start Date.

Entering your Balance Sheet

The balance sheet is a list of all the assets and liabilities of the organisation, and
will probably have been prepared by your accountant. Remember that the
balance sheet that is required is as at the Close-Off Date, and constitutes the
opening balance of your accounts for MoneyWorks. The balance sheet may not
be available until some time after you have commenced using MoneyWorks.

Before you start entering the balance sheet, you should ensure that all the
necessary accounts have been created in your chart of accounts. The balance
sheet will have accounts on it that you don’t normally use, such as “Issued &
Paid Up Capital” to represent your share holding.

Some of the information (such as your opening receivables, payables, and bank
balance) will have been already entered in the preceding steps. If this is the
case, you should put these balances against the Setupaccount. This effectively
cancels out the balances that were previously entered against the Setup
account. When you have entered (and posted) the opening journal, the balance
Getting Started

Entering Outstanding Information

in the Setup account at the end of the setup period should be zero (make sure
you check this).

When you have entered the last line, the debits and credits should balance.

6. When the journal is balanced, click OK

To enter the balance sheet:

1. Create a new journal transaction

2. Ensure the Generaltab is selected

To debit or to credit: For non-accountants, it can be tricky to know whether to

debit or credit an item. MoneyWorks normally takes care of this for you, but
it cannot do so in journals. Here are some guidelines to help you decide for
your opening journal:

The journal will be a standard general ledger journal, not a stock journal.

• Current Assets (stock, receivables etc.) are normally entered as debits. Thus

3. Ensure that the journal date is the same as the Close-Offdate

This will ensure that it is put into the Setup Period.

4. The journal description should read “Opening Balances” or similar

5. For each entry in your balance sheet, create a detail line in the journal

with the appropriate general ledger code, and the balance sheet amount
debited or credited as appropriate

Remember that any lines referring to balances that have already been
entered (such as Accounts Payable and Accounts Receivable, and possibly
Bank and Stock) will be put against the appropriate Setupaccount.

• If you have used the Bank Balances window (or a previous journal) to enter

bank balances, use the SETUP account instead of the bank account.

• If you didn’t use the Bank Balance window, debit the correct bank accounts
with the balances. You must do a Bank Reconciliation to account for the
opening transaction —see Bank Reconciliation.

• The accounts payable from your balance sheet will be represented by a
credit to the SETUP account (or the SETUPP account, if you used that for
opening payables). If you entered your opening invoices as GSTable, you
need to credit the SETUP account by the net amount, and the GSTPaid
account by the GST amount.

• The accounts receivables from your balance sheet will be represented by a
debit to the SETUP account (or the SETUPD account). If you entered your
opening invoices as GSTable, you need to debit the SETUP account by the
net amount, and the GSTRec account by the GST amount.

• The stock on your balance sheet will be represented by a debit to the SETUP

account (or the SETUPS account).
your bank account balance will be entered as a debit (unless you are
overdrawn, in which case it will be a credit).

• Current Liabilities are entered as credits.
• Fixed Assets (computers, office equipment) are entered as debits.
• Term Liabilities (bank loans, mortgages) are entered as credits.
• Shareholders funds (share capital, retained earnings) are credits.

If you enter the journal the “wrong way round”, use the Reverse command in
the Edit menu to reverse it (Windows users press Ctrl-Shift-V).

Checking the Journal: Once the journal is entered, you should check the balance
sheet. The easiest way to do this is to print the Balance Sheet reportas at
the end of the Setup Period, and have the “Include Unposted” option set.
This will treat the as yet unposted opening journal as if it had been posted.

Although the information in the report will probably be laid out differently,
the actual values should be the same for each account. In particular the
SetupAccount(s) should have a zero balance.

When you are satisfied that the Journal is correct, you should post it.

Lock the Setup Period: As this will complete the setup process, you should close

(or at least lock) the Setup Period—see Closing a Period.

Removing the Setup Account

Once the setup is complete, you will no longer require the Setupaccount(s), and
it should be removed. Before doing this you should check that it has a zero
balance by using the Account Enquiry—see Finding Account Balances.



