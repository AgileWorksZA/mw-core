# GST, VAT, Sales Tax &#38; Tax Codes

GST, VAT, Sales Tax & Tax Codes

GST, VAT, Sales Tax & Tax Codes

Checking your Tax Coding

When you buy and sell goods or services, there is often a tax imposed on the
transaction. This tax can take the form of a Sales Tax (such as the in USA), or a
Value Added tax (VAT or GST), as is prevalent in Australia, EU, New Zealand and
many other countries. Parts of Canada are particularly well served in this
respect in that they have both a GST and a sales tax (PST).

The good news is that MoneyWorks can manage these taxes for you1.

Note: If you are a home user or are not registered for GST or Sales Tax, you

should have the I need to account for GST/VAT/Tax Preferenceoption
turned off. In this case this section will not be relevant to you.

When you enter a transaction in MoneyWorks, the tax code (and hence rate) is
automatically derived from the general ledger account used, or from the
customer/supplier. You can over-ride this tax code during transaction entry.

To check the tax codes used in transactions, run the Tax Coding report (in the
Audit section of reports). This lists all transaction detail lines sorted by tax code
(and summarised by currency, if any) for the nominated period range.

The Tax Coding report can also be run for just a selected tax code. Thus, for
example, if you are required to pay a USE tax, the report can be used to quickly
identify the transactions and the total upon which the tax will be based.

There are fundamental differences between a Sales Tax and a Value Added Tax:

GST and VAT

Sales Tax: This is imposed only at the end of the supply chain, and cannot

(normally) be reclaimed. When you buy something that has sales tax in it,
that tax is considered to be part of the purchase price. If you purchase an
item to be used in your production, you will have a sales tax exemption for
that item, so the supplier will not charge you sales tax. However if you
charge sales tax on your sales, you are liable to pay the tax you have
collected.

Value Added Tax: This is a percentage tax imposed at each stage of the supply

chain. When you purchase an item, the tax will be included in the price;
when you resell the item, you will add the tax to your price. You are liable to
pay the tax you have collected, less the tax you have paid (i.e. just the tax
on the value-add that you have provided).

If you are in the United States, or have just Sales tax refer to Sales Tax and PST.

If you have GST or VAT refer to GST and VAT.

If you are in Canada, you should read the section on GST. If you also have PST,
you will also have to read the section on Sales Tax. QST (in Quebec) and HST
(Harmonized Sales Tax), are essentially the same as GST (but at a higher rate); if
you are in Alberta, you (currently) have just GST.

This section discusses GST and VAT, and is also applicable to HST and QST in
Canada. For simplicity in this section, we will just refer to GST (but unless
otherwise stated, this also means VAT, QST or HST).

Note: If you are in a country that uses VAT, MoneyWorks will display “VAT”

instead of “GST”. In Canada, MoneyWorks will display “TAX” to indicate the
combined GST and PST, or “HST” for provinces with HST.

What is GST

GST is a simple tax that is applied to the inputs and the outputs of business.
Businesses themselves do not (in the normal course of events) pay GST—it is
paid by the private citizen. But businesses do collect GST on behalf of the
Government, and must remit this back to the Government on a regular basis2.

Thus almost every transaction that you make as a business will attract GST in
some form or other. If you are registered for GST you will be required to send in
a return to the Government on a regular basis—we term this the GST cycle. In
Australia this return is called the Business Activity Statement (BAS) and is sent to
the ATO; in New Zealand it is referred to as the GST Return and is sent to the
IRD; in Canada you send your GST/HST Return to the CRA.
GST, VAT, Sales Tax & Tax Codes

GST and VAT

Fortunately MoneyWorks monitors your GST for you automatically whenever
you enter a transaction. Provided your accounts are up to date, simply printing
the GST Report will tell you how much GST you owe or are owed.

The good news is that most businesses will make their returns only every few
months3, meaning that the repair company has the use of the $6 for some time,
which will help it with its cash flow.

Basically whenever an item or service is sold, it is subject to a goods and
services tax (the rate will vary by country, but it is normally 10% in Australia,
15% in New Zealand, and currently 5% in Canada). This GST is added to the price
of the goods or service, and is collected by the supplier who will subsequently
remit it to the Government.

And what of the person who had to pay for the sprongle repair? Well if the
vehicle was owned by an organisation registered for GST, it would claim back the
$16 it paid (so in effect there has been no GST paid). But if it is owned by Joe
Bloggs private citizen, the Government get to keep the $16 (i.e. Joe cannot claim
it back).

Consider for example the case of a vehicle taken in for repair. For simplicity we’ll
use the Australian GST rate of 10% in this example.

Overview of the GST Process

• The vehicle is found to need a replacement back sprongle. The repair

company orders the sprongle from the sprongle supplier, and is charged
$100 plus GST (i.e. $110).

• The company charges the vehicle owner $120 plus GST (i.e. $132) for the

sprongle.

• Fitting the sprongle takes 2 hours of mechanics’s time, which is charged at

$20 plus GST (a total of $44).

When you first set up MoneyWorks you should have set your GST structure and
cycle in the Preferences — see GST/VAT/Tax.

MoneyWorks comes pre-supplied with a number of tax codes. These are
assigned to accounts and customers, and are the basis on which the GST is
calculated for a particular transaction. The GST Guide Form uses these tax
codes. For a list of the default tax codes, see Tax Codes

The transactions are summarised in the following table:

Purchase Sprongle
Total Payments

Sell Sprongle
Labour
Total Receipts

Net

$100
$100

120
40
$160

Incomings - Outgoings

$60

GST

$10
$10

12
4
$16

$6

Gross

$110
$110

132
44
$176

$66

At the completion of the job, an invoice will be made out to the customer for
$160 plus GST (a total of $176).

For this job the repair company has paid out $10 in GST. Because the company is
GST registered, it can claim this amount back. But it also collected $16 in GST,
which must be paid. In practice the company will just pay the balance of the
receipts and the payments (in this case $6).

You can add other GST tax codes if you need them. Tax codes that you add will
appear when used on the GST Report, but you will need to alter the GST Form if
they are to appear on this.

When you create a general ledger account, you will associate a tax code with it.
When you enter a transaction and use that account, the tax code is used to
calculate the GST component for that part of the transaction. You can if
necessary override this tax code when you enter the transaction.

Unless you are also registered for GST/VAT in their jurisdiction (in which case see
Paying GST/VAT in Multiple Countries, transactions with suppliers or customers
outside your country will not (normally) be subject to GST. When you export (or
import) goods you will need to override the tax code in the transaction
entry—this can be done automatically by setting an override code in the Name
record — see Override Tax Code.

When you are due to prepare your return, you print the GST Report. Before this
you must ensure that all transactions for the period have been entered and
posted. It is a good idea to set up a reminder message to come up a week or so
before the return is due so that MoneyWorks can warn you— see Reminder
GST, VAT, Sales Tax & Tax Codes

Messages4.

Having prepared your GST report, which provides a complete audit trail of how
your GST has been calculated, you can then print off your GST form5—this
shows how to fill out your return to your local tax authority.

Preparing Your GST Return

To prepare your return for a given GST cycle:

• You should have all transactions that occurred in the cycle entered and

posted into MoneyWorks. If you backdate transactions so they would have
appeared in a previous cycle, they will automatically be accounted for in the
current cycle.

• Print the GST Report. This summarises the GST paid out by you and the GST
collected—the Canadian report may also list the PST (but you should use
the Sales Tax report to determine the PST payable unless your PST cycle
matches your GST cycle). The difference in the GST column is payable to, or
refunded by, the Government.

• When (and only when) you are satisfied that your GST report is correct, it
should be finalised. This tags all the transactions in the report as having
been processed for GST. They will not appear in future GST reports (and
hence cannot be double counted). It also updates your GST cycle date ready
for your next GST return.

• Print off your GST Guide Form (optionally). This shows what to put where

on your GST return.

• If you need to pay money to the Government, you will need to write out a
cheque. This (or any refund you might receive) will need to be specially
coded — see Paying your GST.

The GST Report

The GST report prints a summary of the GST received and paid by you, broken
down by the various tax codes, and is used to calculate your GST payment or
refund. As such you must run it prior to making a return. The report is normally
printed showing a list of transactions, providing a definitive reference as to how
the GST was calculated.

To print the GST Report:

1. Choose Reports>GST Report

The GST Report setup dialog is displayed.

GST and VAT

The information at the top left of the dialog box regarding the GST period
dates and the basis for the GST calculations is taken from the Preferences —
see GST/VAT/Tax.

2.

If the information at the top left is incorrect, click the Prefsbutton to
change the preference settings

If Show Transactionsis selected, each transaction that is
included in the GST calculation is printed. You should print at
least one copy of the report with this option set, as it will
make the GST Audit trail clearer. If the option is not selected, a summary report
is printed.

Note: The GST Report operates on posted transactions only—any transactions in

the GST cycle must be posted before running this report.

If the and Detailsoption is checked, MoneyWorks will also
print details of each transaction detail line. As this may make
the report very long, it is recommended that you only use this
option if you are trying to locate a transaction whose GST amount appears to be
wrong (e.g. a GST-Free transaction that has had GST applied to it6).
GST, VAT, Sales Tax & Tax Codes

GST and VAT

3. Check that the Show Transactionsoption is on

Finalising the Return

This is how the report should normally be printed.

4. Set the output to Printerand click Print

The GST Report will be printed. You will be asked if you want to finalise the
GST report.

If you preview the report, the Finalise GST window will be displayed when
you click the Closeor Nextbutton.

5. When the report has successfully printed and you are happy that it is

correct, click Finalise, otherwise click Don’t Finalise

Finalising updates the GST cycle and the also tags each transaction as having
been processed so it won’t appear on the next GST report. Finalisation cannot
be undone, so ensure that everything is correct before clicking Finalise. The
numbers on the finalised report will be the ones that you transcribe to your
return.

Note: For most printers, printing is done “in the background”, allowing you to
continue to work on your computer while information is being printed. In
this situation the GST Finalisation request will appear before the report is
printed. You should wait until the complete report is successfully printed
on the printer before clicking Finalise.

Set the Journal to GST Holding Accountoption on if you want
to have the GST journal created and posted for you
automatically (it will also be stamped as having been
processed for GST in the current cycle). If you don’t create the journal, you will
need to do it manually — see Journalling Out the GST Accounts.

Note: The first time you set this option you will need to specify the GST Holding
account. It should normally be a Current Liability, with a tax code of “*”.

Set the Print Guide Formoption on if you want to also print
the GST guide form (this is disabled if there is no Guide form
for your country). This will help you fill out your GST Return/
BAS. You can print this later by choosing GST Guide Form from the Reports
menu.

If you Forget to Finalise

It sometimes happens that people forget to finalise their GST report, and don’t
discover this until some time later (normally when they come to prepare the
next GST return).

Should this happen to you, the first thing to do is to redo the GST return to see if
it has changed. Why would it have changed—simply because you may have
backentered or corrected transactions in that (or a previous) GST cycle7.
GST, VAT, Sales Tax & Tax Codes

So check that the totals on this are the same as the ones used on your last GST
return. If they are the same, simply finalise the report.

If they are different, you will need to do a combined report for the previous and
the current GST cycles, and subtract off the results that you used to make your
previous GST return. To achieve this, set the GST Cycle date forward to the end
of the current GST Cycle (by clicking the Prefsbutton in the GST Report Settings
window), and print the report.

Anatomy of the GST Report

The first part of the report deals with receipts made by you during the GST
period—the GST component of these must be paid to the government. The
second part of the report deals with payments made by you—the GST
component of these can be claimed back. It is therefore the difference between
these amounts that you need to pay or claim—this is shown in the Total line at
the bottom of the report.

Note: Canadian users will get a report detailing both GST and PST/QST. For QST,
just use the figures from the report; for PST, you should only use the GST
column for the GST, and run the Sales Tax reportfor the PST

GST and VAT

If you have entered your transactions correctly and not overridden any of the
GST fields the following should apply:

• The Z, E, F, I and * tax codes should have 0 in the GST column (they won’t be

shown if you haven’t used any accounts that use them).

• The amount of GST for the other tax codes divided by the GST rate

(currently 10.0% for the G and C tax code in Australia, 15% for the G code in
New Zealand) should equal the Net. Do not worry if it is a few cents
out—this is rounding error due to GST amounts of less than 1 cent.

The report operates on the following principles.

• All Posted transactions in the system that occurred on or before the GST

Cycle Date and have not previously been processed for GST will be included
in the report

• This means that the GST cycle is totally independent of your normal

financial period structure. It also means that any transactions that need to
be posted into periods already processed for GST will be handled correctly
in the next GST report.

• The GST Cycle Date is set in the Preferences dialog. It is automatically

maintained by MoneyWorks, and is updated when you Finalise your GST
report—you can change it if it is wrong.

The processing of the transactions varies depending upon whether you are
operating on a cash/payments basis or an invoice/accrual basis. You may need
to talk to your accountant to determine which you are on.

Payments/Cash Basis: All eligible cash payments and receipts are processed, as
well as any zero value invoices8. The GST is determined from the tax code of
each detail line in each cash transaction. The amount of GST is as recorded
in the GST column of the detail line.

If the payment or receipt relates to an invoice, the GST in the detail lines of
the invoice are used. Partial payments on invoices are pro-rated.
GST, VAT, Sales Tax & Tax Codes

GST and VAT

Invoice/Accruals Basis: All eligible cash payments and cash receipts that are not

repayment. This applies whether operating on an invoice or cash basis.

part of the debtors and creditors system are processed as for cash
payments above. All eligible invoices received and sent are similarly
processed.

Journals: It is not possible to determine whether a journal entry that involves a
GST account should be included in the GST report or not. Therefore any
journals that involve the GST accounts will be summarised at the end of the
report (or listed if the Show Transactions option is on). You will need to
manually adjust the return if any of these need to be included. It is for this
reason that we recommend that you do not journal through corrections to
transactions involving GST: instead cancel the original transaction, and then
create a new corrected one.

Partial payments of invoices: If operating on a payments basis, the amount of
the partial payment is pro-rated across the invoice to determine the GST.

As an example, consider that you
have received an invoice for $210
similar to that shown at right.

For some reason you paid
only 50% of the invoice, i.e. $105. Of this amount, $5.00 is considered to be
GST, being half of the total GST. If you decided to pay the non-taxable
portion and not the taxable (i.e. $100 only), MoneyWorks would assume
that you had paid 100/210.00 of the entire transaction and calculate GST
accordingly at:

100/210*10%=$4.76.

This does not arise on an accrual/invoice basis: all the GST is claimable.

Overpayment by a Debtor: If a debtor overpays his invoices (perhaps he paid
one twice by mistake), the overpayment cannot be allocated to any
particular invoice. Nor are there any supporting Tax Invoices for the
overpayment. Therefore it is considered to contain no GST.

If the overpayment is allocated to the Debtor’s account (so he has surplus
funds), and is subsequently used to pay off an invoice, the GST is calculated
at that point. However if the amount overpaid is returned to the debtor, no
Tax Invoice is generated and hence there is considered to be no GST in the

Purging Transactions: Transactions which have not been processed for GST will

not be purged if you purge the period containing them (unless the I need to
Account for GSTpreference option is off).

Reprinting a GST/VAT Report

You can reprint a previous GST/VAT Report, provided the original report was
finalised in MoneyWorks version 3 or later.

1. Choose Reports>GST Report

The GST Report settings window will open

2. Click the Oldbutton

A list of previous GST Reports will be displayed.

3. Double click the report you want to reprint
GST, VAT, Sales Tax & Tax Codes

GST and VAT

By shift-clicking you can highlight more than one old report, and reprint a
single combined report, as shown below. This is handy if you inadvertently
finalised your GST Report part way through a GST Cycle.

GST Report if the Use Reprint Figures for Guide Form option was set.

Changing the GST Parameters

You may change your GST cycle or even move from a payments to an invoice
basis. The tax rates themselves might also change — see Changing Tax Rates.

Change of assessment basis: If the way you are assessed for GST changes from

an invoice/accrual to a payments/cash basis (or vice versa) your next GST
calculation will be handled correctly — even the partially paid invoices. All
you need do is change the GST settings in the Preferences dialog box.

Change of GST Cycle: If your GST cycle changes (e.g. from 3 monthly to 1

monthly), all you need do is change the GST cycle and the GST cycle date in
the Preferences dialog box. Because each transaction is stamped when
processed for GST, MoneyWorks will handle this correctly.

Filling out your GST Return

The GST Report provides a definitive audit trail of how your GST is
calculated—this is handy for your accountant or any itinerant tax inspectors who
may drop by, but is not in a form that can be used as part of your return.

The GST Guide Formwill provide information from the GST Report in a form
suitable for transcribing to your GST Return or BAS. This prints details from the
last finalised GST Return (but is not available for all countries).

Journalling Out the GST Accounts

When you have finalised your GST return, the GST control accounts should be
cleared by means of a journal. This journal will be created and posted for you
automatically if you set the Journal to GST Holding Accountoption when you
finalise your return.

If you choose to create it manually, the journal should be made out as follows
see General Ledger Journalsfor information on creating journals:

• It should have the same date (and hence the same period) as the end of the

GST Cycle
4.

If you want to reprint the GST
Guide Form based on this
report, set the Use Reprint
Figures for Guide Form option

5. Click the Printbutton

The GST report will be reprinted.

Note: When MoneyWorks determines that adjustments (cancellations, contras

etc) will have no effect on your GST it will mark those transactions as having
been processed for GST. They may therefore appear on a reprint of a GST
report, even though they were not on the original. The final GST totals
however will be the same.

Reprinting the GST Guide Form: You can reprint the GST Guide Form at any time
by choosing GST Guide Form from the Reports menu. This will show the
results of the last finalised GST Report, or the results of the last reprinted



GST, VAT, Sales Tax & Tax Codes

Paying GST/VAT in Multiple Countries

• The total GST received as listed in the report should be debited against the

GST Received control account

• The total GST paid as listed in the report should be credited against the GST

Paid control account.

• The difference between these is the amount of GST that you owe or will

receive as a refund. You need to enter this in (as either a credit if you owe it
or a debit if it is a refund, whatever balances the journal) against a GST
Holding account.

The GST Holdingis a normal Current Liability account (i.e. it is not set up as one
of the special GST system accounts). It should have a tax code of “*”.

Paying your GST

Some time after your GST cycle end date, you will need to pay your GST to the
Government—this varies from country to country. Do this using a normal
payment transaction, with a single detail line containing the GST Holdingcode
and the amount that was journalled in to this. When this transaction is posted,
the balance in the GST Holding account should be zero.

Receiving a GST Refund

If you are in the happy position of actually receiving a refund for GST, you should
process the cheque when it arrives as a cash receipt transaction. It should be
coded to the GST Holding account, and again, after the transaction has been
posted, the balance in this account should be zero.

Paying GST/VAT in Multiple Countries

Many countries have responded to the growth in on-line international sales by
requiring vendors to collect GST/VAT on on-line sales and remit it to the relevant
tax authorities. As of version 9.0.8, MoneyWorks Gold/Datacentre can manage
your GST/VAT in multiple jurisdictions.

How it works:

• You must have Multi-Currency enabled;
• You create one or more tax codes specifically for that country to use with

sales and purchases for that country;

• If MoneyWorks has a tax guide or on-line filing for that country, you map
GST, VAT, Sales Tax & Tax Codes

Paying GST/VAT in Multiple Countries

your code onto the equivalent standard MoneyWorks tax code for that
country (for a list of standard tax codes, see Tax Codes);

• You use the Audit>Tax by Currency report to summarise your taxes over the

Note that the tax code is set for use in Australia, and maps onto the standard
"G" tax code used in the Australian GST Guide. Similarly you might set up an
"OZF" account of zero percent GST mapping to the standard Australian "F" code.

required time interval;

• Where available, the tax guide and hence on-line filing can then be directly

accessed from the bottom of the report;

• To use on-line filing in a different jurisdiction you must first run the

appropriate tax guide which is where your tax number for that jurisdiction is
entered.

As an example, let us suppose that you based in New Zealand (and hence paying
New Zealand GST), but you sell into Australia and have to pay GST on Australian
sales. You would set up a new tax code (say "OZ") for the standard GST
Australian rate:

Tip: It might pay to set up separate Tax Paid and Tax Received control accounts
for each foreign jurisdiction. See Creating a New Account, and ensure that
you set the Account Typeto "GST/VAT Received" or "GST/VAT Paid" as
appropriate.

For Australian customers (and suppliers) you would set up the Tax Override to
"OZ" (and presumably the currency to "AUD").

Determining the GST/VAT Liability

For your GST/VAT in your home country, you will keep finalising the GST/VAT
report as usual.

However this probably will not work for other jurisdictions because the time
interval might be different, or you might be on a different reporting basis (cash/
payments versus invoice/accrual). In the case of our previous example, GST filing
is every two months in New Zealand and every quarter in Australia. Further you
might be on an invoice basis in New Zealand, but a cash basis in Australia.

For other jurisdictions use the Audit>Tax by Currency report. This summarises
GST/VAT for a period range on either cash or invoice basis. The results are
cached and will be used automatically when you run one of the built-in
MoneyWorks guides or on-line filing. There are buttons at the end of the report
so the applicable guides and on-line filing can be accessed directly from the
Preview window:
GST, VAT, Sales Tax & Tax Codes

Taxable Payments Report (Australia)

The ATO are very specific in the data layout requirements for the report. In
particular make sure that in your company details (in Show>Company Details)

• The ABN Number has no spaces
• Phone and Fax numbers are of form 01 2345 6789
• Your suburb is entered into address line 3 of the postal address

For your suppliers, ensure that:

• The ABN Number has no spaces
• Phone and Fax numbers are of form 01 2345 6789
• Their suburb is entered into address line 4 of the mailing address

The following are the valid ATO codes for states:

Taxable Payments Report (Australia)

Australian businesses in the building and construction industry are required to
report to the ATO on the total amount they've paid contractors each year for
building and construction services. This is done on the Taxable payments annual
report.

Setting up the Information in MoneyWorks

Australian Capital Territory

ACT
NSW New South Wales
NT
Northern Territory
QLD Queensland
SA
TAS
VIC
WA Western Australia
OTH Overseas addresses

South Australia
Tasmania
Victoria

Running the Taxable Payments Report

To run the report:

The first step is to identify and tag the relevant suppliers in MoneyWorks. This is
achieved by using one of the category or custom fields for the tag, and selecting
a suitable tag value (such as "TPR").

1. Choose Reports>Taxable Payments (Aus)

The report settings window will open.

For example if you elect to use Custom2and the tag of "TPR", then each
supplier that needs to be included in the report should have "TPR" entered into
the Custom2field. We suggest that you label the selected field in the Document
Preferences>Fields.

Tip: If you have a lot of suppliers, highlight them in the list and use the

Select>Replace command to bulk update.

2.

In the Valuefield, enter the tag value that you have used to identify
relevant suppliers

For example, if you tagged the suppliers with "TPR", you would enter "TPR"
here.

3. Select the field that was set to this value from the in fieldpop-up menu
GST, VAT, Sales Tax & Tax Codes

WET Tax (Australia)

For example, if you tagged the suppliers in the Custom2field, you would
select Custom2here.

Changes to the Tax Table

You will need two new taxes, one for WET (which you probably won't directly
use), and a composite tax for "WET with GST lumped on top", which is the one
you will use.

In Show>Tax Rates:

1. Create a new tax with a code of WET (it must be a code of WET)

The TAX Paid and Received accounts should be the new WET Paid and
Received accounts as created above.

The current percentage is 29%.

2. Create another new tax code WG

This is because GST is applied on top of WET.

This is a "composite tax". The first tax must be WET, with the second being
your normal GST code (normally G, but you might have used something
else). Make sure the Mult(multiplicative) check box is set (otherwise the
taxes will be added, which is wrong).

If you want to create a file to upload to the ATO portal:

4. Set the Export to ATOoption

5. Enter the Referenceand Prepared byvalues

6. Select the financial year to run the report

7. Click Preview(or Print_)

If you are creating a text file for the ATO, you will be prompted for a name and
location for the file in the standard File Creation dialog.

WET Tax (Australia)

MoneyWorks will handle the Australian Wine Equalisation Tax (WET) tax,
provided the Locale is set to Australia and a tax code of WET is correctly created.

Changes to the General Ledger for WET

It is a good idea to keep the WET collected separated from your normal GST. For
this reason the first step in setting up to handle WET is to create three new tax
accounts as follows:

1. A new WET Tax HoldingAccount

This is a current liability account with a "*" tax code.

2. A new WET ReceivedAccount

This is of type GST Received

3. A new WET Paidaccount

This is of type GST Paid
GST, VAT, Sales Tax & Tax Codes

Customer Accounting (Singapore)

Special Requirements for Invoice

You will need to format your invoice to show the WET at the bottom. The
Traditional Invoiceform does this, or you can modify your existing invoice
layout.

GST Report and WET

When the WET tax is correctly set up, a second column will appear in the GST
Report which lists the WET tax on each transaction. This is summarised at the
bottom, the same as for other tax rates.

When the report is finalised, an additional field is available for the WET holding
account (which is where your WET tax will be journalled into). Enter the code of
the previously created WET Holding Accountinto this.

The BAS Guide will configure to show the WET in the appropriate boxes.

Customer Accounting (Singapore)

Accounts for handling sales and purchases involving WET

You should create new General Ledger accounts to account for transactions that
use the WET tax.

Starting in 2019, IRAS in Singapore is changing the way GST is handled on certain
Prescribed Goods(mobile phones, memory cards and similar). For details of this
please refer to the IRAS web site, or ask your accountant. MoneyWorks 8.1.4
and later are compliant for this Customer Accounting for Prescribed Goods.

You will need one for Sales, one for Cost of Sales, and, if you are running
inventory on items subject to WET, one for Stock.

Setting up Customer Accounting

The tax code on these accounts must be set to WG (not WET, as you will be
paying WET with GST on top).

Create the new products

Assign the income, expense and stock accounts to the appropriate ledger
accounts that are set to GW.

You will need to do some additional setup to handle customer accounting.

New Tax Codes

If your MoneyWorks file was created prior to 8.1.4 and you are required to use
Customer Accounting, you will need to create some new GST codes (these will
be created automatically in new files made using version 8.1.4 or later). See Tax
Codes for information on creating these.

The new codes are:
GST, VAT, Sales Tax & Tax Codes

Customer Accounting (Singapore)

Code Details
GPG
CAG
CAA

Rate
Sale of Prescribed Items
0%
Prescribed Items for Customer Accounting 7%
Purchase GST on Prescribed Items

IRAS Code
SRCA-S
TXCA

100% SRCA-C

Note: Code CAA must have the All Taxoption set.

Note: Do not use the IRAS codes shown in the above table (they are for

information only). Provided that you use the above coding structure shown,
MoneyWorks will substitute the IRAS codes when preparing the IRAS F5 and
IAF reports.

New General Ledger Code

You will also need to create a new general ledger expense code to handle the
special accounting required (this code is not included in the default account
setup as it will only be applicable to a small number of users). The account
should be called something like "GST Adjustment (Customer Accounting -
Prescribed Goods)", and have a tax code of "CAA" as shown below.

For information on creating account (general ledger) codes see Creating a New
Account.

New Item

If you are purchasing prescribed goods as items (as opposed to "By Account"),
you will need a new Item to handle the customer accounting calculation. This
will be an item that your purchase (you won't sell it), and it will have the
Expense account when buyingaccount set to the GL account created above (i.e.
one with a tax code of "CAA"), as shown below:
GST, VAT, Sales Tax & Tax Codes

Postponed VAT Accounting (UK)

For information on creating a new item see Creating a New Item.

Note that in the "By Item" example, you must enter the negative GST amount in
the GST column for the GST Adjustment.

Tip: Put a sticky note on the items that you purchase as prescribed goods to
remind you about the special coding required and the threshold.

Purchasing Prescribed Goods

Selling Prescribed Goods

When you purchase prescribed goods you do not pay GST to the supplier, but
rather you will be responsible for paying it to IRAS. For MoneyWorks to
automatically do the GST accounting required, it is important that:

When you sell prescribed items, GST is not charged. You must use the GPG tax
code to indicate that this is the sale of prescribed goods. This does not apply if
you are selling to the end user (normal GST applies).

1. The purchase line of the invoice has a tax code of CAG.

GST will be added to this line at the standard rate.

2. The GST is netted of with a negative line with a tax code of CAA.

To achieve this use either the general ledger code or the item code created
above (for By Accountor By Itemtransactions respectively).

Thus a "By Account" purchase invoice will be coded in MoneyWorks as:

A "By Item" purchase invoice will be coded as:
Note: When prescribed goods are sold, the invoice must display the special text
"Sale made under customer accounting. Customer to account for GST if
$xxx". The "Prescribed Goods (Singapore)" template does this, and others
can be customised.

Postponed VAT Accounting (UK)

This is a scheme introduced on January 1st 2021. Also known as "Accounting for
import VAT on your VAT Return", it means you’ll declare and recover import VAT
on the same VAT Return, rather than having to pay it upfront and recover it later,



Postponed VAT Accounting (UK)

GST, VAT, Sales Tax & Tax Codes

thus easing your cashflow.

When you belong to the scheme you will be able to retrieve a Monthly
postponed import VAT statementfrom HMRC as outlined in Get Your Postponed
Import VAT Statement on the HMRC website. This needs to be entered into
MoneyWorks.

Before you can do this, some additional setup is required:

Special Tax Code

To record the postponed VAT, you will need a new VAT code. This is set up as
follows:

1. Choose Show>Tax Rates

The Tax Rateslist window will be displayed.

2. Click the Newtoolbar button

The tax rate entry window will be displayed.

3. Enter a tax code for Postponed VAT (we suggest "VPA")

Note: The tax code must start with "V", or whatever letter is the first
character of your normal VAT code(s) if you have changed it.

4. Give it a description of "Postponed VAT", ensure the Tax Typeis "G.S.T. or
V.A.T.", and tab through the two account fields which will auto-populate
with your default VAT accounts

5. Leave the tax rates as zero, but set the All Taxradio button
GST, VAT, Sales Tax & Tax Codes

Postponed VAT Accounting (UK)

For convenience it would pay to have the code near the VAT Paid control (so
give it the next code in sequence to that). In practice it doesn't matter what
the code is (so "PVAT" or similar is fine).

4. Set the Account Typeto "Current Liability"

5. Set the Tax Codeto "VPA" (or whatever tax code you created above).

6. Click OKto save the new tax rate

Special General Ledger Codes

You will need a general ledger account to handle the postponed VAT. If you are
processing your postponed VAT correctly this should always have a value of zero.
To make the account:

1. Choose Show>Accounts

The Accountslist window will be displayed.

2. Click the Newtoolbar button

The account entry window will be displayed.

3. Enter an account code for the new account and give it a description of

"Postponed VAT"
6. Click OKto save the new account.

For convenience down the track, we are going to need a clearing or offset
account. So create another new account similar to the above, but with a
description "Postponed VAT Clearing" and, critically, a tax code of "*".



GST, VAT, Sales Tax & Tax Codes

Postponed VAT Accounting (UK)

HMRC needs to be both a debtor and a creditor

If they are not set up as both a Debtor and Debtor, you will need to change
them (single user mode is required for Datacentre users).

If HMRC is not already set up, you will need to create them:

1. Choose Show>Names

The Names list window will be displayed.

2. Click the Newtoolbar button

The Name entry window will be displayed.

3. Enter a Code("HMRC" or "HMRC-PVA" spring to mind), and a Name

4. Turn on both the Debtor (we give credit)and the Creditor (they give

credit)check boxes, and click OK

Recording your Postponed VAT

To record your Postponed VAT two transactions are required, a purchase invoice
(or payment) to record the nominal VAT asset, and a sales invoice (or receipt) to
record the nominal VAT liability. These will exactly cancel each other out.

Note: MoneyWorks determines the nature of the VAT by the transaction type.

Don't try and be clever by reducing this to a single transaction.

To record the VAT liability we make a new purchase invoice to HMRC:

1. Choose Show>Transactions, click on the Purchase Invoicessidebar tab

then click the Newbutton

A new purchase invoice entry screen will be displayed.
Special debtor/creditor code

The Postponed VAT will be recorded in an invoice (in fact two invoices—we
shouldn't do things by half) to HMRC, so we need an appropriate debtor and
creditor.

Note: You can also record the Postponed VAT as a payment/receipt. You will

need to do this if you are using MoneyWorks Cashbook, as this doesn't have
invoices. However an invoice seems tidier.

If you already have HMRC set up as a customer/supplier, check in your Names
list (Show>Names) that they are set up as both a Creditor and a Debtor:



GST, VAT, Sales Tax & Tax Codes

Alternatively make a new Payment if you aren't using invoices.

2. Enter your HMRC name code in the Creditorfield, check the date is

correct, and enter a description such as "Postponed VAT"

3. Leave the Amountas zero, and if necessary set the transaction type to By

Account

4. Enter your Postponed VAT GL code (created above) in the Accountfield

5. Enter the amount of Postponed VAT from your postponed VAT statement

into the Netfield

When you tab out of the Net, the amount should transfer automatically into the
VATfield, with the Net becoming zero. If it does not then either you have used
the wrong GL code, the GL Code doesn't have the tax code "VPA", or the "VPA"
code has not been set to 100%. You should cancel out of the transaction and fix
the error and try again.

6. Tab through fields until you are in the Accountfield of the next line

7. Enter the code for the Postponed VAT Clearing account, as created above.

8. Depending on your Document Preference Settings, this line might self

balance forcing the transaction to have a zero balance. If it doesn't, enter
the negative of the Postponed VAT amount into the Netfield

9. Check that the tax code on this line is "*" and the VAT amount is zero

The transaction should look something like the following:

Postponed VAT Accounting (UK)

10. Check the amount, date and coding and post the transaction.

Tip: As you are required to keep copies of the Postponed VAT Statements from

HMRC, you should store the statement (which is supplied as a PDF) as an
attached image on this transaction.

Now repeat the process, but this time make a Sales Invoice (or receipt). The
date and coding on this transaction must be identical to that on the original
Purchase Invoice (or payment).

Note: If you are using a Payment/Receipt you can opt to omit the second

clearing line on each transaction as the payment and receipt will cancel out
if done properly (but will still appear on your bank reconciliation, so should
be marked off together). Any local currency bank account can be used,
provided it is not an "Unbanked" account.

The VAT Guide and MTD

Having recorded the Postponed VAT as above there is nothing else you need do.
The transactions will automatically adjust boxes 1 and 4 of the VAT return (and
be included in the VAT summary for MTD).
GST, VAT, Sales Tax & Tax Codes

Making Tax Digital (UK)

The value of the imported goods will be recorded when you enter the invoice/
payment into MoneyWorks (and hence reflect in Box 7). These invoices/
payments will not be recorded with VAT.

Making Tax Digital (UK)

Making Tax Digital (MTD)is an initiative by the UK Government to enable
organisations in the UK to file their VAT returns electronically direct from their
accounting software.

As of version 8.1.6, MTD is incorporated into MoneyWorks as an additional step
after you have finalised your VAT Report. The results of the latest finalisation are
displayed, and can be uploaded direct to HMRC by clicking the Submitbutton.
Additionally previous returns can be displayed, as can your obligations,
payments and liabilities.

When you first use MTD, MoneyWorks will prompt you to login to your
Government Gateway account so you can grant MoneyWorks access to view and
update your VAT details at HMRC.

You will need to successfully navigate this login process before you can use MTD
in MoneyWorks.

Using MTD in MoneyWorks

To start the MTD process, choose Command>MTD Connect...to open the HMRC
Connectwindow. This may take a few seconds, as MoneyWorks will check the
HMRC system and display your VAT Obligations when the window opens.

Note: The MTD Connect...command is only available to users who have the

VAT Report/FinalisationUser Privilege turned on.

Note: You can also connect to HMRC by clicking the Connectbutton in the

Preview of the VAT Guide:
GST, VAT, Sales Tax & Tax Codes

Making Tax Digital (UK)

If this is the first time you have used the MTD Connect command, you will
prompted to enter some required settings:

The following information is required:

VAT Code: This is the first character of your VAT codes, normally "V". The report

picks up all transactions with a tax code starting with this code (so you can
have, for example, a code VR for reduced VAT).

EU Code: This is the code (normally "EU") you use for VAT on purchases from

other EU countries. All transactions with codes starting with this will be
included in the EU VAT calculations.

Flat Rate Scheme: Turn this on only if you are on the Flat Rate Scheme and

enter your VAT rate into the VAT Ratefield.
VAT Transaction Type: The type of MoneyWorks transaction to make to

represent the return to HMRC. You can choose Nonefor no transaction,
Paymentfor a Payment transaction, and Invoicefor a purchase invoice
(which you will pay later).

VAT Holding: This is your VAT Holding account. It should be the same as that

used in the VAT Finalisation section of the VAT Report. You need to specify
this if you choose Paymentor Invoicefor the VAT Transaction Type.

Bank Acct: If you make a Paymenttransaction, specify the bank account from

which you are going to make the VAT payment.

HMRC Code: The creditor code for HMRC if you elect to make a Purchase

Invoice. You will need to set up HMRC as a creditor in MoneyWorks. When
you submit a return using MTD, a creditor invoice will be created which you
can mark off as being paid once you have actually paid your VAT (or
received a refund).

If you need to alter your settings subsequently, click the Settingsbutton in the
HMRC Connectwindow.

Notes on Flat Rate Scheme

Certain capital expenditure transactions need to be reported in this scheme. To
include such transactions (for example the Capital expenditure above £2000)
put the code "FRI" (Flate Rate Include) in the category2 field of the Account
record. These transactions are reported only, not included in calculation of flat
rate VAT payable. To exclude capital expenditure transactions from the report,
use an account code with "FRE" (Flat Rate Exclude) in the account's category2
field. Capital expenditures of less than £2000 for example do not need to be
reported.

Example: If you buy a vehicle for £1500 then this should be coded to a GL
account which has the code "FRE" in category2 field, so as to exclude it
from the report. Alternatively, if the vehicle was bought for say £2500, then
it should be coded to a GL account with the code "FRI" in category2, as this
is above the limit.



GST, VAT, Sales Tax & Tax Codes

Making Tax Digital (UK)

Hence the implementation of flat VAT may require you to have two different
account codes (for the same type of item, such as Vehicle) with the codes "FRE"
and "FRI" in their category2 fields.

Liabilities: Click on this tab to display your current VAT liabilities as recorded by
HMRC. Note that there will be a delay of a few seconds while MoneyWorks
retrieves the data from HMRC.

HMRC Connect window

Information about your latest VAT information, as well as information accessed
from the HMRC site, is displayed in this window:

Payments: Click on this tab to see your payments as recorded by HMRC. Note

that there will be a delay of a few seconds while MoneyWorks retrieves the
data from HMRC.

VRN Number: This is the VAT number as specified in Show>Company Details in

MoneyWorks.

History/Obligations: This information is retrieved from the HMRC site and
shows your history and obligations over the last twelve months.

MoneyWorks VAT: These are the numbers from your last Finalised VAT return in
MoneyWorks. It is these numbers that will be uploaded to HMRC if you click
the Submitbutton.
GST, VAT, Sales Tax & Tax Codes

Making Tax Digital (UK)

Previous: Click on this tab to view a previous VAT return. Select the VAT period

from the Periodpop-up menu and click the View Oldbutton.

Login: Click this button only if you need to force a re-login to the HMRC system
again. MoneyWorks will automatically log you in whenever you choose
Command>HMRC Connect, but there may be circumstances when you want
to force a new login.

Note: MoneyWorks will preserve the login information (a token supplied by
HMRC when you first successfully login) across sessions. Clicking this Login
button will clear this token, and you will need to re-enter your HMRC
Credentials.

Submitting your VAT

To submit your VAT:

1. Review the VAT information displayed in the MoneyWorks VATtab of the

Connect window

This is the information that will be sent HMRC and is based on your last
finalised VAT return.

Note that there will be a delay of a few seconds while MoneyWorks retrieves
the data from HMRC. The information from the selected submission (if any) will
be displayed in the list.

2.

If the VAT information is correct, click the Submitbutton

You will be asked for confirmation:
GST, VAT, Sales Tax & Tax Codes

Making Tax Digital (UK)

Warning: When you submit a VAT return electronically you are making a
legal declaration. Clicking Agree & Submit_ confirms your acceptance of
this.

Note that MoneyWorks checks that its cycle end date is the same as that
expected by HMRC. If it isn't the following alert will display. You will need to
decide what to do (if you submit, it will use the period from HMRC, not that
from MoneyWorks). As an example, you will get this alert if you have
forgotten to Finalise your VAT report since you last submitted.

If the submission is accepted, an alert will be displayed showing the HMRC
response code (ID) and the reference number (sequencenumber) of the
associated transaction created in MoneyWorks if any (you can view this
transaction in Entered Today).

If you get an alert saying "Possible Submission Error", as shown below, this does
not necessarily mean that the submission has failed, but that the HMRC system
failed to return a proper ID.
GST, VAT, Sales Tax & Tax Codes

Making Tax Digital (UK)

In principle this should never happen, but in practice it does. You should login to
the HMRC website and check that the submission is there (in all recorded
instances of this message, the submission has been successful). MoneyWorks
will not make a transaction for this return in this instance, so if you want a
transaction you will need to manually enter it.

Note that, when an ID is returned, it is stamped on the transaction should you
need it:

Fixing the VAT information

If the VAT information displayed is incorrect, you will need to fix it before
submitting the return. You need to locate the incorrect transactions and cancel
and re-enter them, or enter any transactions that are missing. In principle you
should have done this before finalising your VAT Report, however we all make
mistakes!

Because your VAT Report has been finalised, you will need to do a bit of
additional work to get these corrections included in your VAT Submission.
Basically, having entered and checked and posted the corrections:

1. Set the VAT Cycle end date in MoneyWorks back to end date of the last
finalisation (it will have been incremented as part of the finalisation
process).

This is done in Edit>Document Preferences>VAT, where you reset the value
of the Next cycle ends ondate.

2. Rerun the VAT report.

This picks up all posted transactions that have not been previously
processed for VATand which are dated on or before the cycle end date. In
other words it should contain just your corrections.

The successful submission is also recorded in the MoneyWorks Log file
(Show>Log File).

The submission might be rejected. In this case an alert will be displayed showing
the reason that HMRC gave for the rejection.
IRD Connect (New Zealand)

GST, VAT, Sales Tax & Tax Codes

3. When you are satisfied this is correct, finalise the VAT Report.

4. Now re-run the VAT Report, and this time click the Load Oldoption,

highlight the two (or more, if you have been really having a bad day) most
recent reports and click Use.

5. To amalgamate these individual reports into a single return, turn on the
Use Reprint Figures for Guide Formoption, then print or preview the
report.

This will be a combined report that amalgamates the data in the highlighted
reports.

6.

If you now go back to HMRC Connect, or preview the VAT Guide, you
should see the revised figures.

For more information on combining VAT Reports see Reprinting a VAT Report

IRD Connect (New Zealand)

The IRD Connect facility in MoneyWorks, introduced in version 8.1.6, allows
New Zealand users to file their GST returns directly to the IRD, obviating the
need to reenter the numbers into the IRD website.

Note that you will need a myIRD account to be able to use this.

Note: The IRD Connect...command is only available to users who have the GST

Report/FinalisationUser Privilege turned on.

Important: The facility enables you to submit your GST Return directly to IRD,

but does not enable payment. If you are using a direct debit to pay your
GST, you will will still need to log into myIRD to authorise payment.

Note: You can also connect to the IRD by clicking the Connectbutton in the

Preview of the GST Guide:

Using IRD Connect in MoneyWorks

To start the IRD Connect process, choose Command>IRD Connect...to open the
IRD Loginwindow:

Note: A connection to the IRD will expire after about fifteen minutes of no

activity, and you will need to re-login.
GST, VAT, Sales Tax & Tax Codes

IRD Connect (New Zealand)

Note: You must have your IRD number set in the IRD# field in Show>Company

IRD Creditor Code: The creditor code for IRD. You will need to set up IRD as a

details. This is a nine digit number (normally the same as your GST number,
but with a leading zero if required).

If this is the first time you have used the IRD Connect command, you will be
prompted to enter some required settings – these determine what type of
MoneyWorks transaction, if any, will be created when you Submit your GST:

creditor in MoneyWorks if you want to create an invoice. When you submit
a return using IRD Connect, a creditor invoice will be created which you can
mark off as being paid once you have actually paid your GST (or received a
refund).

Prov Tax Acct: If you are on the Ratio Method, this is the account for the
provisional tax portion of your payment. If you leave it blank the GST
Holding will be used.

If you need to alter your settings subsequently, click the Settingsbutton in the
IRD Connectwindow.

IRD Connect window

Information about your last finalised GST, as well as information accessed from
the IRD site, is displayed in this window:

The following information is required:

GST Transaction Type: The type of transaction to create when you submit using
IRD Connect. If this is set to "None", no transaction will be created (and no
other fields need to be entered in the Settings). If set to "Payment", a
payment transaction will be created against the nominated bank account. If
set to "Invoice", a supplier invoice will be created for the nominated IRD
creditor code.

GST Holding: This is your GST Holding account. It should be the same as that

used in the GST Finalisation section of the GST Report.

Payment Bank: The bank account against which the payment is to be made.
GST, VAT, Sales Tax & Tax Codes

IRD Connect (New Zealand)

IRD Number: This is the IRD number, as specified in Show>Company Details in

MoneyWorks.

This is the information that will be sent to the IRD and is based on your last
finalised GST return.

IRD Information: This information is retrieved from the IRD site and shows your

current obligations and status.

2.

If you need to make adjustments, click the Showbutton on the
appropriate adjustment line

MoneyWorks GST: These are the numbers from your last Finalised GST return
in MoneyWorks. It is these numbers that will be uploaded to the IRD if you
click the Submitbutton.

Entering adjustments is described below.

3.

If the GST information is correct, click the Submitbutton

If you are registered for the Ratio method, additional information is shown:

You will be asked for confirmation:

Note that MoneyWorks checks that its cycle end date is the same as that
expected by IRD. If it isn't, the following alert will display, and you will need
to decide what to do (if you submit, it will use the period from the IRD, not
that from MoneyWorks). As an example, you will get this alert if you have
forgotten to Finalise your GST report since you last submitted.

Submitting your GST

To submit your GST:

1. Review the GST information displayed in the MoneyWorks GSTsection of

the Connect window
GST, VAT, Sales Tax & Tax Codes

IRD Connect (New Zealand)

If the submission is accepted, an alert will be displayed showing the IRD
response code (you don't need to record this as it will be noted in Show>Log).

The submission might be rejected. In this case an alert will be displayed showing
the reason that IRD gave for the rejection.

Note: The Submit button will be disabled once you have submitted a return.

If, in the settings, you have elected to make a transaction, this is also created.
The example below is from a submission for a company on a ratio basis:

Clicking the Statusbutton will retrieve the updated status. This will have
changed to "Submitted" if your submission was successful.
GST, VAT, Sales Tax & Tax Codes

Adjustments

If you need to include GST adjustments:

1. Click the appropriate Showbutton on the adjustments line.

The Adjustments window will be displayed:

Debit Adjustments

Credit Adjustments

2. Click in the appropriate Amtcell and enter the adjustment

3. Click OK

The adjustments will be included in the numbers submitted to the IRD, and, if
you have elected to generate an accounting transaction in MoneyWorks, it will
be accounted for in this (coded against the nominated GST Holding account).

Important: You may have entered adjustment information when you previewed
the GST Guide. This information is not carried through to the IRD Connect
window and must be re-entered.

Fixing the GST information

If the GST information displayed is incorrect, you will need to fix it before
submitting the return. You need to locate the incorrect transactions and cancel
and re-enter them, or enter any transactions that are missing. In principle you
should have done this before finalising your GST Report, however we all make

IRD Connect (New Zealand)

mistakes!

Because your GST Report has been finalised, you will need to do a bit of
additional work to get these corrections included in your GST Submission.
Basically, having entered and checked and posted the corrections:

1. Set the GST Cycle end datein MoneyWorks back to the end date of the

last finalisation (it will have been incremented as part of the finalisation
process).

This is done in Edit>Document Preferences>GST, where you reset the value
of the Next cycle ends ondate.

2. Rerun the GST report.

This picks up all posted transactions that have not been previously
processed for GSTand which are dated on or before the cycle end date. In
other words it should contain just your corrections.

3. When you are satisfied this is correct, finalise the GST Report.

4. Now re-run the GST Report, and this time click the Load Oldoption,

highlight the two (or more, if you have been really having a bad day) most
recent reports and click Use.

5. To amalgamate these individual reports into a single return, turn on the
Use Reprint Figures for Guide Formoption, then print or preview the
report.

This will be a combined report that amalgamates the data in the highlighted
reports.

6.

If you now go back to IRD Connect, or preview the GST Guide, you should
see the revised figures.

For more information on combining GST Reports see Reprinting a GST Report

Making an Amended return

If you have already submitted a GST return and realise that you need to amend
it:
GST, VAT, Sales Tax & Tax Codes

Singapore On-Line Filing

1.

If necessary, make the necessary amending transactions in MoneyWorks
and rerun the GST reports, as described above

2. Choose Command>IRD Connect to re-login to the IRD

Note that you will get a warning, as the current GST cycle in MoneyWorks
will have a different end date that that of the IRD.

3. Turn on the Amended Returncheck box, and state the reason for the

amendment (required information by the IRD)

1. Choose Command>IRAS Connect ...

You will be prompted for the form to file.

2. Choose F5 for the normal filing, F7 if this is an amendment, F8 if you are

no longer subject to GST and this is your final return.

3. The Iras Connect window will open

This contains a summary of your GST based on your last finalised GST
Report:

4. Click Submit

The changed data and amendment reason will be submitted to the IRD.

Note: If, in the Settings, you have elected to create a transaction, a new

transaction is created at this point. If you created an invoice, the previously
created invoice will be automatically cancelled (provided it has not been
paid); if you created a payment, you will need to manually cancel the
original.

Singapore On-Line Filing

As of version 9.0.8, MoneyWorks users in Singapore can file their GST on-line
(forms F5, F7 and F8) direct to IRAS.

To submit the last finalised GST return:
GST, VAT, Sales Tax & Tax Codes

Singapore On-Line Filing

Note that zero is not a valid value for these fields.

5. Additional information may be requested if certain conditions are

detected.

For example, if Box 1 is greater than zero and Box 6 is less than zero, the
following will be displayed:

You should check the numbers carefully.

Note: The values of boxes marked with an * can be amended by double-
clicking.

Note: For F7 submissions the results from the last F5 submission are
displayed, or, if the Use last finalised GST informationcheckbox is on, the
results of the last finalised report. Use the latter option if you have
corrected the transactions in MoneyWorks and prepared a combined GST
report that incorporated the changes. In either case, you can alter any of
the numbers in the report prior to submission.

4.

If applicable, check any of the options down the right hand side and enter
the amount into the field that will be displayed
In these situations if you select Otheryou must provide a reason.

6. When the form is correctly filled out, click the Submitbutton

If no inconsistencies are detected, the Declaration window will be
displayed:



GST, VAT, Sales Tax & Tax Codes

Singapore On-Line Filing

8. Use your Singpass or User/Password to connect to IRAS and follow the

instructions given.

Note: Depending on load, the login and submission process can take a long
time. Be patient.

9.

In the final submission screen, clicking the Allowbutton will submit the
data:

When the data has been accepted by IRAS an alert will be displayed:

7. Complete the declaration and click Submit

The IRAS login window will open:

At this point the process is complete and you can close the IRAS Connect
window.

If an error is detected by IRAS during the submission process this will be
displayed, for example:
GST, VAT, Sales Tax & Tax Codes

Singapore GST InvoiceNow

A new InvoiceNow command will be added to the Command menu. Use this
to setup and manage your InvoiceNow requirements.

Note: You must have successfully setup eInvoicing before you turn on

InvoiceNow.

The above makes InvoiceNow available, but it is not yet activated. To activate:

1. Choose Command>InvoiceNow

The InvoiceNow Management window will open

You will need to correct this and resubmit.

Singapore GST InvoiceNow

In 2025, IMDA and IRAS are rolling out a new scheme called InvoiceNow for
submitting invoices for better detection of GST fraud or other handling errors.
This is based on eInvoicing, and in essence when you send an eInvoice, IRAS will
also receive a copy. Ultimately GST-registered businesses in Singapore will be
required to use InvoiceNow solutions to transmit the invoice data directly to
IRAS for tax administration.

Activating and Deactivating InvoiceNow

2. Click Initiate C5

Before you can use InvoiceNow, you must turn on the eInvoicing MoneyWorks
Service (see eInvoicing). Having set up your eInvoicing, you can turn on
InvoiceNow by:

The window will close and a request will be sent to activate InvoiceNow.

You will receive an email with further instructions. Follow the steps on the
email, and, once activation is confirmed

1. Choosing Command>eInvoicing Settings

The eInvoicing settings window will open

2. Turn on the Enable InvoiceNowcheckbox

3. Click OKto save the Settings

3. Choose Command>InvoiceNow

The InvoiceNow Management window will open
GST, VAT, Sales Tax & Tax Codes

Singapore GST InvoiceNow

4. Click the Enable C5button

The window will close and additional InvoiceNow features will be enabled
in MoneyWorks. Note that GST InvoiceNow will have been turned on
regardless of this last step (so eInvoices will be submitted to IRAS), however
you can only meet all the InvoiceNow requirements by completing this last
step in MoneyWorks.

5.

If you didn't complete the addtional steps in the email and wish to not
proceed, click the Terminatebutton.

Once InvoiceNow has been confirmed, you can apply to deactivate it by clicking
the Deactivate C5button which will show in the GST InvoiceNow window. Again
you will receive an email with further instructions.

Submitting data to GST InvoiceNow

Periodically you need to transmit data that has not been eInvoiced to IRAS. This
includes direct sales to consumers, "petty cash" purchases and any purchase
invoices that have not been e-Invoiced. How often you submit this is up to you
(IRAS suggest weekly), but should be done before submitting your GST.

Sending this additional data is done through the InvoiceNow window, which will
now appear as:

To send new data to IRAS:

1. Click the Send to IRASbutton

You will be prompted to send all new relevant data, or just selected data.

2. Choose what to send and click OK

You can select Allto send all required data, or you can choose to send each
type of data separately if you wish (these are described below). The
advantage of doing it separately is that you will see a summary of the GST
before having to submit the data:
GST, VAT, Sales Tax & Tax Codes

Singapore GST InvoiceNow

Highlighted Only: You can send specific purchase invoices to IRAS by
highlighting them in the transaction list, choosing Command>GST
InvoiceNow, and choosing this option.

Clicking Cancel will leave the candidate transactions displayed in the transaction
list window.

IRAS log

A log is maintained of transactions submitted to IRAS. This can be viewed by
clicking the Show IRAS Logbutton in the GST InvoiceNow window. The Log lists
all transactions sent to IRAS, either via Peppol (eInvoicing) or submitted direct
from MoneyWorks.

Entries in the log with a Reference starting with "TR_" are transactions
submitted to IRAS. Double clicking such a transaction record display that
transaction.

Entries in the log starting with "B2C" or "PCP" represent aggregate uploads of
consumer sales and petty cash purchases respectively. Double clicking one of
these records will display a list of the transactions that made up the submission.

The data sent is based on transactions posted since the last time you
submitted that type of data.

Note: The submission may take some time is there is a lot of data.

Submission Types

B2C transactions: Business to Consumer (B2C) invoices or cash sales will not be
sent by eInvoice as consumers will not have access to eInvoicing. Instead
you must send a summary of these separately via InvoiceNow (check with
IRAS for how often you need to do this). A B2C transaction is deemed to be
one where the recipient is not set up for eInvoicing, or is a straight "cash"
receipt.

PCP transactions: Petty Cash Purchases (PCP) are direct "cash" payments in

MoneyWorks, i.e. they are not invoice payments.

Purchase Invoices: These are purchase invoices that have been not been sent
via eInvoicing (eInvoices invoices are automatically sent to IRAS once C5 is
enabled).
Fiji VAT Monitoring System

VMS Configuration

Before you can configure MoneyWorks for VMS, you need to arrange with FRCS
which type you will be using (possibly both), and get and install the necessary
security certificates for V-SDC, or hardware for E-SDC. Note that any supplied
security certificates will need to be installed on each machine that is running
MoneyWorks.

Having got these preliminaries sorted, you will be ready to set up VMS in
MoneyWorks.

VMS settings

To configure VMS in MoneyWorks:

1. Choose Command>Fiji VMS settings

The VMS Settings window will open:

GST, VAT, Sales Tax & Tax Codes

Note: IRAS data for eInvoices is not automatically attached to
the originating MoneyWorks transaction (this is because it
is uncertain how long it might take for IRAS to process the
invoice). To retrieve the IRAS status and other
information, open the invoice and click the IRAS Status
button under the eInvoice Response section.

Fiji VAT Monitoring System

The VAT Monitoring System (VMS)is an initiative by the Government of Fiji that
requires organisations to calculate the VAT on sales transactions correctly by
submitting sales to a central electronic system. This process is called
"Fiscalisation".

There are two ways that VMS can be implemented:

V-SDC: Which sends each sales transaction over the internet to a central
system;

E-SDC: Which sends each transaction to a local device so doesn't require a
live internet connection. The device can be a network device, or plug into a
computer's serial port.

MoneyWorks supports both V-SDC and the networked version of E-SDC.

As of MoneyWorks 8.2, VMS will be automatically loaded for Fijian users of
MoneyWorks, but not enabled (the latter can only be done when you have done
the necessary setup). VMS is not available to users outside of Fiji.

The nature of VMS imposes a number of restrictions on how you can use
MoneyWorks. For example, final invoices or receipts must be fiscalised before
issuing, and certain information must be displayed on the printed form. It
follows that a sales transaction must be fiscalised just before posting (so it
cannot be subsequently altered), which means that there are now restrictions
on posting these transactions. Additionally special invoice layouts are required
to be used when printing a sales invoice or docket.
GST, VAT, Sales Tax & Tax Codes

Fiji VAT Monitoring System

4.

If you are using E-SDC, click the E-SDC option and enter:

IP Address of E-SDC device on your local network (e.g. 192.168.1.30);

Port Number of E-SDC device (default is 8888)

Email address of administrator (optional). Whenever MoneyWorks detects
that an E-SDC audit is required an email will be prepared to this address.
Depending on your email settings in MoneyWorks Preferences, this will
either open in your email client, or (if using SMTP) be sent silently.

5. Click the E-SDC Statusbutton to display a summary of the current status of
the E-SDC device. This will also trigger an email if the email address is
present and an audit is required (card more than 75% full)

6.

If you are using both V-SDC and E-SDC, leave the radio button set to your
preferred default

If you need to change methods later, just change the radio button setting.

Other options:

Show Tax Code Column on Invoice: This will display the VMS tax code (A, B etc)
in a separate column on the supplied VMS compliant tax invoice form.

Show SDC Invoice as Barcode: The SDC Invoice number is a special code

returned by VMS which is required to printed on each invoice. If this option
is set, it will also also print as a barcode so can be easily scanned in (if
issuing a refund, you need to reference this number).

Training Mode: Puts the MoneyWorks VMS system into a special training mode.
Invoices submitted to VMS will be marked as "Training" (i.e. not real). As
these are real posted transactions in MoneyWorks, it is important that you
reverse these out before the training session is complete (you don't want to
do it after, as VMS will treat the reversals as real transactions).

Allow VMS Override: Allows users to bypass VMS processing on selected

transactions. You would only enable this if you are entering transactions
from another system, such as a stand alone POS, which has already
fiscalised the transaction. Transactions that are bypassed will be marked as
such (with the user initials) for audit purposes. Note that the setting and

2. Map your internal MoneyWorks Tax Codes to the VMS standard codes

The Tax Code Mappings list displays the VAT codes used in your
MoneyWorks file. VMS requires standardised codes, which are displayed in
the list underneath. You need to enter the corresponding VMS code for
each of your codes (this is done in the right hand column). For example the
tax code "Z" is used in MoneyWorks for zero rated exports, and the
corresponding VMS code is "B". You can enter more than one VMS code per
MoneyWorks tax code, provided they are separated by commas and there
are no spaces.

3.

If you are using V-SDC, click on the V-SDC option and enter:

Security Certificate Name: The certificate (along with instructions on how
to install it) is supplied by FRCS.

PAC: A code supplied by FRCS.
GST, VAT, Sales Tax & Tax Codes

Fiji VAT Monitoring System

resetting of this option will be recorded immutably in MoneyWorks for
audit purposes.

Enable VMS: This turns the VMS system on permanently (it cannot be turned

off again, but you will get a couple of warnings about this). Do not turn this
on until you are ready with VMS.

Changes in MoneyWorks Operations

The following are the main changes in MoneyWorks operations imposed by
VMS.

The VAT column must be displayed on item sales

This is so that MoneyWorks can modify the VAT if it needs to be altered by the
VMS system. To show the VAT column, choose Edit>Document Preferences and
turn on the Show Tax Columnoption. When VMS is enabled you will not be able
to turn this off.

Cashier TINs are required

VMS requires the TIN of the cashier who made the transaction. For each login
you will need to make a corresponding name record (this can be of type Other)
with the same code as the cashier's initials and their TIN in the VAT Reg Nofield.

Thus if Annabell has login initials "AA", her corresponding name record would
be:
GST, VAT, Sales Tax & Tax Codes

Fiji VAT Monitoring System

Posting a Sales Invoice or Sales receipts

You can only post a Sales Invoice or Sales Receipt from an
open transaction window (by clicking the Post icon, then OK or
Next). You can no longer batch post from the transaction list if
the batch contains a sales invoice or receipt. Posting a batch of
transactions that does not contain a sales transaction is not
affected.

Use the Posticon in
the transaction
window to post
sales transactions.

When a sales transaction is posted in this way there will be a
slight delay while its details are sent to VMS and its VAT is recalculated if
necessary based on the gross value of each line. Note that if the VAT is different
this will be replaced in the open transaction, and you will get the following
warning:

This is a standard MoneyWorks feature to alert you to possible inadvertent
changes in the VAT amount. To avoid the warning re-appearing in the current
session, click Just Beep.

Sales transactions cannot have mixed signs

Each line on a sales transaction must have the same sign (i.e. all lines are either
positive, for a sale, or negative, for a refund/credit note). If you attempt to post
a sales transaction with mixed signs the following will be displayed:
GST, VAT, Sales Tax & Tax Codes

Fiji VAT Monitoring System

Refunds and Credit Notes need to be fiscalised

When you fiscalise a refund (a negative Receipt) or a credit note (a negative
Sales Invoice) you are required to tie it back to the original transaction. A list of
previous fiscalised transactions for that customer will be displayed:

Double click the original from the list, or key/scan in the Invoice-ID printed on
the original. If the original predates fiscalisation, leave the field blank. If you
submit an unrecognised Invoice-ID the request will be rejected by VMS with the
following message:
GST, VAT, Sales Tax & Tax Codes

Fiji VAT Monitoring System

MoneyWorks deposit feature is not available

You can no longer receive a deposit as part of processing a sales order (using
Deposit on Order) or invoice (setting the Depositcheckbox). This is in part
because the Deposit transaction itself needs to be fiscalised, but also deposits
on orders will generate a negative line, which is no longer permissable.
Attempting to use the deposit feature will result in an alert:

Receiving Deposits on Orders: To lodge a deposit on a sales order you will need
to create a separate receipt for the customer for the deposit amount and an
associated credit note as described below. Unfortunately these cannot be
linked to the original order (but you could put a sticky note on the order to
remind you).

1. Raise a separate invoice for the customer for the deposit (it will

presumably be coded to some Deposits in Advance liability account). FRCS
recommend that you label this something along the lines of "40% of an
Item".

2. Post the invoice (which will fiscalise it)

3. Receipt the deposit amount against the invoice

4. Duplicate the invoice using the Duplicatetoolbar button, then reverse it

using Reversetoolbar button.

5. Post the invoice, which will fiscalise it. As the invoice is a "refund", you
will need to identify the original transaction (see Refunds and Credit
Notes), so choose it from the list of candidates displayed.

This has the effect of leaving the customer with a credit, which can be
contra-ed off their final invoice payment.

6.

Receiving Deposits on Invoices: For posted sales invoices, you can just do a

normal receipt against the invoice. If the invoice is not posted you need to
follow the steps for Deposits on Orders above.

Cancellations on sales transactions are not permitted

Just when you think it couldn't get worse, you can no longer use the Cancel
command to cancel a posted sales transaction because the cancelling
transaction itself has to be fiscalised (you can still use it to cancel a receipt
against invoice).

Instead of Cancel, use the Duplicate command to duplicate the original posted
(and hence fiscalised) transaction, click the Reverse toolbar icon, then post the
transaction, which will cause it to be fiscalised as a refund transaction. Then
GST, VAT, Sales Tax & Tax Codes

contra this negative invoice against the original.

Unposted sales transactions will be treated as "Pro Forma"

You can fiscalise an unposted sales transaction (i.e. a sales order, or unposted
invoice/receipt) if needed. To do this open the transaction and click the VMS
ProFormatoolbar icon. The details will be sent to the VMS system and the VAT
on the transaction adjusted if necessary.

When a transaction has been fiscalised, the Invoice-ID returned by VMS is
displayed on the transaction, as shown above.

No Rollback

Rolling back you file is no longer permitted. This is because it may contains
fiscalised transactions, and it is not apparent what the consequences would be if
you re-fiscalised them.

Using E-SDC

E-SDC differs from V-SDC in that the fiscalisation is done on a device located on
your premises, and not over the internet to central server. Whenever you start
MoneyWorks and fiscalise a transaction, you will need to enter the E-SDC
devices PIN number:

Fiji VAT Monitoring System

MoneyWorks will also check the device's status at this point and if there are
potential issues will display a warning:

If an audit is required and there is a valid email address in the E-SDC settings,
and warning email will be prepared.
GST, VAT, Sales Tax & Tax Codes

Bypassing VMS

When the transaction is re-opened it will display the following, instead of the
Invoice ID.

Fiji VAT Monitoring System

If the Allow VMS OverrideVMS Setting is on, it is possible to bypass VMS
processing for selected transactions. Only users with the "User Privilege 3"
privilege turned on will be able to do this.

Important: You should only do this if you need to enter transactions that have
already been fiscalised in a different system, such as a stand alone POS.
Such transactions when printed will show as This is not a fiscal receipt.

Note that you cannot set the No VMSoverride and save the transaction for later
posting. You must set the override and immediately post the transaction.

To bypass a transaction:

Printing Fiscal invoices

1. Click the No VMScheck box in the top right of the transaction screen

You might need to widen the transaction slightly if this is not visible the first
time you try to use it.

VMS requires that certain information be included on a printed sales docket/
invoice. Two invoice layouts are provided (these need to be installed into
MoneyWorks Custom Plug-ins/Forms folder, and if using Datacentre uploaded to
the server).

VMS Fiji Invoice: This will print both invoices that either "By Item" or "By

Account", and is based on the existing forms in MoneyWorks.

VMS Text Invoice: This will print the "journal" received from the VMS system,

part of which is shown below:

A warning will be displayed.

2. Turn on the Posticon and then click OK

The transaction will be posted without sending through the VMS system.
GST, VAT, Sales Tax & Tax Codes

Sales Tax and PST

If you are collecting Sales Tax, you will need to add the tax to any sales you make
(except where the customer is exempt from sales tax). Although purchases may
have sales tax added to them, you will not be able to reclaim these (instead the
sales tax portion needs to be included into the purchase price, which
MoneyWorks can do automatically for you).

When you first set up MoneyWorks, you therefore need to make sure that the
tax rates in the tax table — see Tax Codesare set up for your location.
MoneyWorks comes pre-loaded with the sales tax rates for PST in Canada, but
not for the myriad of possibilities in the US.

Sales tax on a transaction line is determined by the tax code on the line, and this
in turn is normally determined by the settings in the general ledger (although
this can be overridden for specific customers and suppliers). Thus your sales
general ledger codes will normally all have a tax code on them to make them
taxable — see Tax Code.

Although you pay sales tax on purchases, you have to include it in the cost of the
item. In MoneyWorks, if there is a sales tax on a purchase/expense transaction,
the sales tax portion will automatically be allocated to the general ledger code
used on the line. It is therefore possible to have a sales tax code on purchase/
expense codes, which can dramatically streamline the entry of these
transactions (because each line of the source docket is normally recorded net of
tax, with the total tax given at the bottom).

The Sales Tax Report

The sales tax report is used to itemise and summarise your sales tax liability. You
will run this at the end of each period for which you need to report on sales tax.
To run the report:

1. Choose Reports>Sales Tax

The Sales Tax report settings will open

Also provided is a form "VMS Invoice Elements". This contains the necessary
elements, such as the QR code, that need to be added to any customised forms
you might have. You can copy and paste the elements from this form onto your
custom form using the MoneyWorks Forms Designer. Note that you might have
to get your resultant form approved as being compliant by FRCS.

Sales Tax and PST

Sales tax is a consumer tax that is charged at the end of the supply chain. It is
used in many US states, and also in some Canadian provinces.
GST, VAT, Sales Tax & Tax Codes

Sales Tax and PST

4. Click the Preview (or Print) button to view the report

The report will list every posted Sales transaction (i.e. debtor invoice, and
receipts that are not paying invoices) in the nominated reporting period, along
with its sales tax. The report will also list any sales transactions from prior
periods that were posted in the reporting period, allowing prior period
adjustments to be automatically included.

At the end of the report, the total sales tax is broken down into its component
parts (e.g. State and County).

Note: Transactions entered prior to MoneyWorks 5.2 are shown in blue (the
sales tax handling was different in older versions). The sales tax on these
cannot be broken down into its component parts, so the total is listed at the
end of the report.

2. Set the Mode pop-up to Sales

Individual sales are listed at the top of the report, and the total sales taxes
collected are summarised at the bottam (by tax code).

If Mode is set to Documentation, the report (when run) will produce a
description of the output it would normally produce.

Sales Tax Report and Purchases

3. Set the From and To pop-ups to the periods that encompass your

reporting cycle

If you are reporting on just one period, these will be set to the same

Show Details: If this option is on, each transaction line will also be shown on the
report. This will make the report longer, but it may be useful if you find that
your sales tax figures don’t seem to make sense.

The Sales Tax report has a Purchases mode. If set to this, the report will look at
purchase transactions (i.e. creditor invoice and direct payments) that were
made in nominated time period using versions of MoneyWorks prior to 5.2.
Sales tax on these transactions was not automatically “expensed”, and you
needed to put through a journal at month end to adjust for this. The report will
list the transactions, and the required journal.
GST, VAT, Sales Tax & Tax Codes

Refunds and Sales Tax

Because the Sales Tax report only considers “Sales” transactions (i.e. Debtor
Invoices and direct Receipts that bypass the Debtors system), it will not
recognise refunds that you have put through as payments.

Refunds in MoneyWorks should always be done by applying a Return Refund to
Debtoron a previously raised credit note (i.e. negative debtor invoice). Apart
from ensuring this will be picked up correctly for Sales tax purposes, it will also
ensure that any associated inventoried items on the sale are returned to stock at
the correct valuation9. Refunds can also be achieved by using a negative Receipt
(although counter-intuitive, this is a sales reversal, and the inventory and tax will
be handled correctly).

Paying your Sales Tax

Having determined your sales tax liability, you just need to pay it.

This will be a payment coded to the appropriate Tax Received accounts (you can
have different control accounts for different component taxes if you wish). So to
pay the tax in the above report, my transaction would be something like:
Tax Codes

Tax Codes

MoneyWorks has a built-in table of tax codes and rates. These tax codes are
associated with Accounts or Names, and the corresponding rate is used to
calculate the GST or sales tax whenever a transaction is entered. You can modify
the standard codes (except *) if you wish, or add new codes for special
situations (e.g. special rates for rest homes, out of state sales, beverage and
accommodation taxes etc). The default tax codes are:

Default Codes (most countries, not USA)
GST/VAT exempt [not Australia]
E
Zero-rated items [not Australia].
Z
100% GST/VAT (for customs)
A
Standard VAT (UK, Eurozone, South Africa, Nepal, Fiji)
V
Standard GST (Australia, New Zealand, Singapore, Canada)
G
*
MoneyWorks System code for transactions "outside of tax system"
Additional Canada GST Codes
Standard HST (rate varies by province)
H
PST (rate varies by province)
P
GST + PST (rate varies)
T
Q
QST
Default Australian Codes
G
I
C
F
X
W
P
U
Additional UK Codes
VR
EU
Default Singapore Codes
Note: Rates will increase to 8% on 1 Jan 2023 and 9% on 1 Jan 2024
G
E
Z
A
IM
ME

Standard GST
Input taxed
Capital acquisitions
GST-free
Exports
Salary and Wage Payments
Amounts withheld from wages
Amounts withheld where no ABN quoted

GST (SR/TX7)
Exempt (ES33/EP)
Zero Rated (ZR/ZP)
GST on Imports (IM)
Imported Goods
Major Importes Scheme

Reduced VAT
Sales/Purchases made in Northern Ireland from EU Member States

0%
0%
100%

0%

9.975%

10%
0%
10%
0%
0%
0%
0%
48.5%

5%
0%

7%
0%
0%
100%
7%
0%



GST, VAT, Sales Tax & Tax Codes

Tax Codes

BL
NR
OP
E33
EN3
RE
ESN
DS
OS
IGD
RCM
GPG
CAA
CAG
LVRC

LVRC-

Not Claimable
Non-registered
Purchases outside GST Scope
Reg 33 Exempt Purchases
Non Reg 33 Exempt Purchases
Residual Input Tax
Non Reg 33 Exempt Sales
Deemed Supplies
Sales Outside GST Scope
Import Deferment(IGDS)
Reg 33 Exempt Sales Financial
SRCA-S Customer accounting supply made by the supplier
SRCA-C CA supply made by the customer on supplier's behalf
TXCA Std-rated purchase of prescribed gds subject to CA
Claimable portion of low-value services subject to GST under reverse
charge (Box 14)
Non-claimable portion of low-value services subject to GST under
reverse charge (Box 14)

Imported low-value goods supplied (Box 16)

EMREM Remote services supplied by electronic marketplace operator (Box 15)
LVRED
LVOWN Own supply of imported low-value goods (Box 17)
USA Sales Taxes
STA
CIT
CTY
USE
ZER
EXE
TAX

State Tax
City Tax
County Tax
Use Tax
Zero Tax
Exempt Tax
Combined Tax (STA+CTY+CIT)

7%
0%
0%
7%
7%
7%
0%
7%
0%
7%
0%
0%
100%
7%
-

0%

8%
8%
8%

Note: You can only modify tax codes if you are the only user on the system. If
there is more than one user, the Modifybutton will show as View.

Note: As well as managing the taxes through the Tax Rate screen, you can also
import taxes to create new ones or update existing rates (see Importing Tax
Rates).

Adding a New Tax Code

Note: The "*" tax code is used for accounts that are outside the tax system

(such as bank accounts). If you use it on other accounts you will not be able
to override it when entering a transaction involving those accounts.

1. Click the Newtoolbar button or press Ctrl-N/⌘-N

The Tax Code entry window will be displayed.

To see the tax table:

1. Choose Show>Tax Rates

The Tax Rates table will be displayed:
GST, VAT, Sales Tax & Tax Codes

Tax Codes

New tax rates need to be associated with accounts specifically set up to deal
with the tax. Unless you have set up additional GST/TAX accounts in your Chart
of Accounts you will only have access to the two standard system accounts that
MoneyWorks automatically sets up.

5. Enter the Tax control account codes for the accounts that handle incoming
and (if required) outgoing Tax into the Tax Paid Accountand Tax Received
Accountfields

Simply tabbing through the fields will automatically insert the default
codes. If more than one code is available, tabbing through the fields will
display the Account Choices list.

6. Enter the tax rate into the Rate 2 field

Unless you know details of a change to the tax rate, leave the Changeover
and Rate 1 fields as they are.

If the rate is for 100% Tax

You will normally never come across 100% Tax transactions unless you are an
importer. In this case you may get a bill for Tax from Customs.

7. Set the All GST/TAXradio button if this rate represents 100% GST

8. Click OKto accept these entries

Clicking Cancel will put the dialog box away without storing any of the
changes that you have made.

Note: If you have multi-currency enabled in MoneyWorks Gold/Datacentre, an
additional Tax code is for different countryoption is available. Turn this on
only if you are setting up this code for a different country. See Paying GST/
VAT in Multiple Countriesfor more information.

2. Type the code that will identify the new rate into the Codefield

This can be up to five characters long, and must not be already in use.

3. Type a brief description of the rate in the Name field

Composite Taxes

4. Set the Tax Type

A tax can be either GST or VAT10, a Sales Tax, a Composite Tax(a
combination of other taxes), or a Reversed Tax(where the supplier is liable
for the tax).

The Composite Tax option allows you to specify a tax that is calculated from
other predefined taxes11.
GST, VAT, Sales Tax & Tax Codes

Tax Codes

• If a tax is based on a GST/VAT tax, these must be the first taxes in the
calculation. For example, GST + PST is allowed, but PST + GST is not;

• A maximum of two GST/VAT taxes can be used in a composite tax;
• Composite taxes cannot be modified once they have been used. You can

change the rate of the components, but not the structure itself;

• Composite taxes are calculated strictly top-down. Thus:

To include a tax in the calculation:

1. Click the New icon

A new line will be added

is calculated as (G1 + G2) * CTY, and not as G1 + (G2 * CTY).

Note: MoneyWorks Express and MoneyWorks Gold let you create your own

forms (invoices, statements etc). Special fields are available in your invoice
design to isolate the GST and PST amounts:

Click the Newicon
to add a new line

• For the GST content on a transaction line use detail.tax1amt
• For the balance of the tax content on a transaction line use detail.tax2amt

2. Enter the code of the tax to include in the Code field

The name and rate will be displayed. Note that this must not be the code
for another composite tax.

3.

If the tax is multiplicative (i.e. is also levied on the previous taxes in the
composite tax calculation, such as QST in Quebec, or PST in PEI), set the
Mult check box

If this is not set, the taxes will be simply added, i.e. each tax is calculated on
the Net amount.

4. To delete a tax from the calculation, click the Trash icon

When a composite tax is used in a transaction, an additional (hidden) detail line
is added for each component tax used (unless the tax is a Sales Tax and has been
“expensed” as part of a purchase).

There are some rules and restrictions for composite taxes:
Reversed Tax

A Reversed Taxis where the purchase (or sale) of an item or service has no tax
levied, but the recipient (or supplier) is required to assess and pay the tax.
Examples of this include:

• Singapore: imported services subject to GST under Reverse Charge;
• USA: the Use Tax, where the purchaser calculates and pays the tax;
• UK: the Vat reverse charge.

When you use a reversed tax in MoneyWorks, the transaction will show with a
tax rate of zero. The reverse tax amount is not stored, but needs to be calculated
(normally in a report) by multiplying the net amount by the reverse tax rate. The
latter can be determined using the GetTaxRate() function.



A subsequent change in the GST rate can be made by putting the current GST
rate (still in the Rate 2 field after the previous change) into the Rate 1 field and
adding the new change over details as before.

Note that a composite tax will respect the dates of rate changes in its
components.

Tax Codes

Changing a Tax code

In MoneyWorks Gold/Datacentre, you can change an existing tax code.

1. Highlight the tax to change by clicking on it once

2. Click the Change Codetoolbar icon

The Change Tax Code window will open

GST, VAT, Sales Tax & Tax Codes

Changing a Tax Rate

MoneyWorks allows you to enter the details of a change to the Tax rates at any
time and uses a specific change-over date to determine which rate to apply to
particular transactions. Transactions dated before the changeover date will
attract the Rate 1 rate, while those on or after that date will attract the Rate 2
rate.

If the tax rates change, you will need to alter the tax rate table.

1. Choose Show>Tax Rates

The Tax Rates dialog box opens.

2. As the current rate is stored in the Rate 2 field, you will need to move the

current rate into the Rate 1 field

3. Enter the date on which the rate changes into the Changeover field for the

tax code

4. Enter the new rate into the Rate 2 field

Repeat steps 2, 3 and 4 for all of the tax codes that need to be changed. If
you only have the default tax codes, you only need to change the G tax
code.

5. Click OKto store the changes and close the dialog box

For example, the GST rate in New Zealand increased from 12.5% to 15% on 1st
October 2010. This would be represented in the tax table as:

3. Enter the replacement code and clock Change Code

The code in the tax table will be updated, as well as all occurrences of code in
the MoneyWorks file (e.g. transactions, tax overrides, accounts). This might take
a while.
1099 Forms (US)

3 Normally quarterly in Australia, two-monthly in New Zealand, quarterly or
annually in Canada↩

4 The reminder messages will only show when MoneyWorks is running. If you do
not use MoneyWorks regularly the reminder message may not show in time.↩

5 Not available in all countries.↩

6 This particular example can only occur if the GST amount in the transaction was
explicitly changed by the operator.↩

7 Had you finalised the previous return, these corrections would have appeared
automatically on the next one, so in the normal course of events they wouldn’t be
an issue.↩

8 A 100% deposit on an order for example will generate a zero valued invoice when
the items are shipped. These will affect on your GST if the deposit was coded to an
exempt GST account.↩

9 If you use a payment transaction (as might seem logical), you are effectively
buying the inventory back but at the price for which you sold them. This will upset
your inventory valuation.↩

10 Not available in the US version↩

11 This replaces the “Two-Tier GST” option in versions of MoneyWorks prior to
5.2↩

GST, VAT, Sales Tax & Tax Codes

1099 Forms (US)

A template 1099 form is included as a MoneyWorks statement. This calculates
all (posted) payments made in the calendar year, and puts the total into box 3.
To print the 1099:

1.

In the Names list, highlight those vendors/suppliers who require a 1099

You can use one of the category fields to easily identify who needs a form
(e.g. put “1099” into Category4 on the name record, then search for
Category4 is 1099).

1. Choose Command>Print Statements

1. Select the “1099 Form (US)” in the Use Form popup list

If you need to amend the form (tweak the alignment or layout), you can at
this point open the form in the Forms Designerby clicking the Layout
button, followed by the Edit this form in the Forms Designer button.

1. Enter the last day of the calendar year for which you are preparing the

form in the Statement Datefield

This should always be 31st December. The form will print for all payments
made from the 1st January of that year to the date specified.

2. Click Print (or Preview) to print the forms (one page per supplier)

1 The US version of MoneyWorks can only handle Sales Tax. You need the
international version to handle GST/VAT, or a mix of GST and Sales Tax.↩

2 Strictly speaking, it is the balance of GST collected and GST paid that is
remitted.↩
