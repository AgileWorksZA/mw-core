# Fixed Assets

Fixed Assets

Fixed Assets

A fixed assetis an item with a useful life greater than one reporting period and
with a value greater than some minimum value normally set by your local tax
authority. It will be purchased for productive use, and not for resale in the short
term. Thus assets such as land, buildings, equipment, machinery, vehicles, and
leasehold improvements are fixed assets, whereas goods purchased for resale
(inventory) are not.

When a fixed asset is purchased, it cannot be treated as an expense. Instead a
portion of it is expensed over the life time of the asset. This is known as
depreciation, and the allowable rates of depreciation are normally set by the
local tax authorities, and hence differ from country to country.

The MoneyWorks Asset Register is designed to facilitate the acquisition,
depreciation and disposal of assets, both from an operating and financial
perspective. It supports straight line and diminishing value depreciation,
calculated either monthly or annually.

Overview

The asset register maintains a list of assets and relevant details about each
asset, such as purchase date and price. When an asset is purchased, and the
transaction is entered either as a payment or supplier invoice in MoneyWorks,
an entry about that asset can be automatically created in the register.
Alternatively, assets details can be entered directly into the asset list or
imported in bulk.

Each asset is allocated to an Asset Category, such as "Furniture and Fittings" or
"Motor Vehicles", and will inherit the default depreciation type and rate
associated with that category (this can be over-written for an individual asset).
Asset Categories need to be set up before you can enter any asset details. These
categories are also used for reporting purposes.

Note: You should check with your accountant or local tax authority as to what
are the allowable depreciation types and rates for asset categories in your
jurisdiction.

You can periodically do a "Depreciation Run", which calculates the depreciation
for the assets based on their current value, depreciation rate and type. Assets
can also be revalued (either up or down).

When an asset is finally sold or otherwise disposed of, there is often a
discrepancy between the depreciated value of the asset and the realised value.
MoneyWorks will put in the appropriate accounting entries for this "Gain or Loss
on Asset Disposal".

Transferring assets from an Existing Register

If you are recording existing assets, or transferring them from another register,
when you create the asset in MoneyWorks you need to also specify:

• The existing accumulated deprecation on the asset;
• The date the asset was last depreciated.

The bookvalue that you specify must be the original cost less accumulated
depreciation.

Assets that have been depreciated using diminishing value need to have their
bookvalue specified as at the end of a financial year (this is necessary because it
is used to calculate the following year's depreciation).

Asset Categories

Asset Categories are used to group assets together for reporting purposes, and
are also a quick way to assign the depreciation type and rate to an individual
asset. Because every asset must be associated with a category, the asset
categories need to be specified before assets can be entered.

To view the asset categories:

1. Choose Show>Asset Categories

The asset category list will be displayed. Asset categories can be added or
modified in the usual manner.
Fixed Assets

Asset Categories

The Asset Category Window

In addition to grouping the assets for reporting purposes, the Category of an
asset determines which general ledger codes are used for depreciation,
accumulated depreciation, gain/loss on disposal etc. A newly created asset will
inherit the depreciation type and the rate specified in the category as its default.

The Category fields are:

Code: A short code to reference the Category. This can be up to seven

characters in length.

Description: A description (up to sixty characters) of the asset category.

Group: For your own use in grouping Categories, for example a standard

industry code that might be used in your jurisdiction. The Asset Register
report can be subtotalled by group.
Fixed Assets

Custom: For your own use.

Comments: Your comments on the category or its use.

General ledger codes: The general ledger codes to be used by MoneyWorks for

handling depreciation etc on assets in this category.

Ledger
Asset
Accumulated Depreciation Business
Revaluation Surplus Reserve
Impairment Loss

Type Ledger
FA
FA
SF
EX

Depreciation
Depreciation Personal
Disposal Gain/Loss
Disposal Gain/Loss Personal

Type
EX
EX
IN or EX
IN or EX

Note that, if the Depreciation expense account is departmentalised,
individual assets that belong to the asset category can be assigned a
department from the associated Department Group (this allows the
depreciation expense to be assigned to a particular department or cost
centre). The department is derived from the "Department" field on the
asset record itself. If other accounts are departmentalised, then they should
belong to a Department Group that contains the asset's department.

Personal Use Accounts: If assets in the group can be used for personal use, turn
on the Assets in this category can have personal/private usecheck box. You
will need to specify the depreciation expense and disposal gain/loss
accounts to use for the personal proportion of the asset. The percent
personal use is specified in each asset.

Depreciation Type: Two types are supported in MoneyWorks:

• Straight Line Method (SL), and
• Diminishing Value Method (DV).

Depreciation Rate: The applicable annual percent depreciation rate for this

category of asset. Note that allowable depreciation rates and type will differ
in each jurisdication. If in doubt, check with your accountant.

Last Depreciated: The date the category was last depreciated to.

Calculate depreciation on a daily basis: Turn this on if you want depreciation to
be calculated for assets in this category based on the days in month (instead
of strictly monthly). Some jurisdictions require this. If set, the monthly
depreciation will be calculated as annual depreciation x days in the

Asset List

month ÷ days in year (so leap days are accounted for). Otherwise the
monthly depreciation is one twelve of the annual depreciation

Note: Daily depreciation means that if your periods align to calendar months,
the depreciation will be slightly different each period, but the annual
depreciation will be the correct percentage. Similarly if you have custom
periods (such as 4, 4, 5 week periods, or a special End period), the
depreciation results will reflect the number of days in the periods being
depreciated.

Caution: You cannot reset the Calculation depreciation on a daily basisoption
once you have started depreciating assets in that category (the results
would not be pretty!).

Asset List

The assets themselves are maintained in the Asset List, and can be added or
modified in the usual manner.

1. Choose Show>Assets

The asset list will be displayed

The list has separate tabs for easy viewing assets by type/status:
Fixed Assets

Asset List

• New: assets that have been entered but not yet depreciated. These assets

can be modified or deleted;

• Active: assets that have been depreciated. These assets cannot be modified

or deleted except by special operation;

• Non-depreciable: A class of assets that are not depreciated. They must be

acquired and disposed of, so are reflected in the general ledger;

• Other: other assets or similar that you might want to keep a record of.

These can be modified and deleted, but not depreciated.

• Disposed: assets that have been disposed of. These may be deleted.

To create a new asset:

1. Click the New toolbar button or press Ctrl-N/⌘-N

A new asset window will open.

2. Enter the details of the asset and click OK

Note that, once the asset has been depreciated, you cannot make changes to
certain fields such as original cost, last depreciated date, acquisition date,
accumulated depreciation, category of the asset, expected life etc. Such fields
will be greyed out. It is important to ensure that the information you entered is
correct before the asset is depreciated.

To modify an existing asset:

1. Locate the asset in the list and double-click it

The details of the asset will be displayed.

2. Make the required changes and click OK

The Asset Window

The asset window displays information about an asset such as its cost, last
depreciated date, accumulated depreciation, asset category, expected life,
private use percentage etc.

Asset Code: A unique code, upto nineteen characters long, that is used to

identify the asset. MoneyWorks will supply a new code when creating an
asset, but you might want to override this with something more
meaningful.

Status: The status of the asset. This is set to Newfor newly created assets, but

can be changed to Non Depreciableor Other. When a depreciation run is
done, any eligible Newassets will become Active.

Colour: Colour to show the asset in the list.

Description: A short description (up to 63 characters) of the asset.

Location: The physical location of the asset (can be any value).
Fixed Assets

Serial Number: The serial number (if any) for the asset.

Asset Category: The category for the asset. The default depreciation settings for
the category will show alongside. Every asset must belong to a category.

Department: The department for the asset. This must be a valid MoneyWorks
department, and will be appended to any of the account codes in the
associated category that require a department. The Asset Registerreport
can be run for a nominated department.

Depreciation Settings

These determine how the asset will be depreciated.

Method: The depreciation method, one of Straight Line or Diminishing Value.

Depn Rate: Actual rate of the depreciation for the asset (this, along with the
Method, is inherited from the assigned Asset Category but can be altered
for individual assets).

Expected life: The expected life of the asset in years. This is for information only

and is not used in any calculations.

Residual Value: This is the expected value of the asset remaining at the end of
its life after all the depreciation. It is for information only, and has no effect
on any calculations.

Private Use: The percent of the asset that is for private use. This will affect the
depreciation calculation, and can only be used where the associated
Category allows for private use.

Cost and Bookvalue

The fields in this area can only be altered when an asset is New. Once an asset is
active, this also displays a summary calculation of the current book value.

Asset List

Cost (per unit): The cost of the asset. Normally each asset is represented

individually, so this is the acquisition cost of the asset. Where a group of like
assets are purchased, for example 10 board room chairs, the cost is of the
individual asset (i.e. chair), and not the total cost of all the chairs.

Quantity: The quantity of assets represented. Normally this will be 1, but in the

previous example of the board room chairs, it would be 10.

Accum Depn: The accumulated depreciation for the asset. For new assets this

will be zero, but if you are entering assets from another system it will be the
total accumulated depreciation.

Last Depreciated: The date of last depreciation. For new assets leave this blank.
The date is automatically updated whenever the asset is depreciated. For
assets entered from another system, it will be the last depreciation date (if
the asset is being depreciated using Diminishing Value, this date must be
that of the end of the previous financial year, which forms the opening book
value for the current year).

Book Value: The book value of the asset. When entering newly purchased

assets this will be the total net cost. For assets that are being transferred
from another system, this must be the same as the cost multiplied by the
quantity, less the accumulated depreciation.

Acquisition & Disposal
Fixed Assets

Acquired Date: Date the asset was acquired.

Asset List

Link Invoice: Used to link the asset to an existing invoice/payment (see below)

Last Disposed: Date the asset (or some of a group of like assets) was last

disposed. See next section for details.

The custom fields (Custom1 ... Custom4) are available for your own use.

The tabbed area at the bottom of the screen is divided into three sections:

Comments: General comments about the asset.

History: Shows the accounting history of the asset (acquisition, depreciation,

revaluations etc).

Click the New Memobutton to add a memo. Once added, memos cannot
be altered or deleted.

The Image area at the bottom right of the screen allows a picture of the asset to
be stored. Right-click on the field to add or paste an image.

Double-clicking an entry in the list will open the associated accounting
transaction (if any).

Memos: User memos about the asset.
Link Invoice

For new assets only. Once the acquired date (and cost) is set, you can link the
acquisition to an existing invoice or payment by clicking the Link Invoicebutton.
MoneyWorks will display a list of invoices and payments dated on the
acquisition date which are coded to a fixed asset account, and have an
unallocated amount more than the cost price of the asset.



Fixed Assets

Depreciation

To start a depreciation run:

1. Choose Command>Asset Register>Depreciation Run

or, to depreciate just selected categories:

1. Choose Show>Asset Categories to display the Asset

Categories, highlight the categories to depreciate, and
click the Depreciation Runtoolbar button

The depreciation settings window will open

The Depreciation
Runtoolbar icon

The Available column shows the amount of the invoice coded to a fixed asset
account that has not been allocated through the Link Invoice to another asset.

Double-click a transaction in the list to view it.

To allocate an invoice, highlight it in the list and click OK. When a transaction has
been linked to an asset, the sequence number of the transaction is displayed
beneath the Link Invoicebutton.

To unlink an invoice, click the Remove Linkbutton.

Depreciation

MoneyWorks allows you to depreciate all assets, or just selected Asset
Categories. You can depreciate the assets per period, per quarter or per year in
MoneyWorks. You must depreciate assets at the end of each financial year (they
cannot be depreciated in subsequent years unless this is done).

When depreciating by less that a full financial year (e.g. by period or by quarter),
the depreciation for the entire financial year is calculated and this is pro-rated
over the number of months in the periods being depreciated. If the Calculate
depreciation on a daily basisis set for the asset category, the calculation is
based on the number of days in the relevant months (and length of year).

2. Select the period for the depreciation run from the Period pop-up menu

3.

If you only want to depreciate the highlighted Categories, turn on the
Highlighted Onlycheckbox.

4. Click OK

Any assets in the highlighted Categories (or all assets, if Highlighted Only
was not set) that have not previously been depreciated to that period will
be checked to see if they can be depreciated. If for some reason any assets
can't be depreciated (for example, a bad department code) the offending
assets will be displayed in a list along with the reason they can't be
Fixed Assets

Asset Revaluation

depreciated. You need to correct the problems and try the depreciation run
again (click the Printbutton to print the error list). For example the
following is displayed if you haven't depreciated some of the assets at the
end of the previous financial year:

In this situation you need to depreciate the relevant asset categories again
as at the end of the financial year (only assets not already depreciated at
that point will be depreciated, other assets will remain untouched).

If no problems are detected the Depreciation Schedule will be displayed:

5. Click the Printbutton if you want this as a report

The report opens in the Preview window. Close this or click Continueto
return to the Depreciation Schedule.

6.

If the Depreciation Schedule is correct, click Acceptto create and post the
required depreciation journal.

Click Discardto reject the schedule.

Note that clicking Acceptis final and cannot be undone. As well as creating the
journal, the affected assets are stamped with the new depreciation date and
values.

Asset Revaluation

Asset can be revalued, normally based on their market value versus the book
value (which is the purchase price of the asset less the accumulated
depreciation). You should check with your accountant before revaluing assets.
MoneyWorks uses the Revaluation Method of revaluing.

To revalue an asset

1. Choose Show>Assets

The asset list will be displayed.

2. Highlight the asset being revalued

Each asset must be revalued individually.

3. Click the Revaluetoolbar button

The Asset Revaluation dialog will be displayed

The Schedule lists each asset and its calculated depreciation amount, along
with the total accumulated depreciation adjustment for all the listed assets.
Fixed Assets

Asset Revaluation

4. Set the new depreciation rate

The structure of the journal will differ depending on whether the asset is
increasing or decreasing in value.

This needs to be recalculated based on the expected remaining life of the
asset. MoneyWorks leaves this as an exercise for the user.

6. Change the Revaluation or Impairment account code if necessary

5. Enter the new value for the asset

These default to those specified in the asset category.

The current book value of the asset will be displayed by default—change
this to the new value of the asset. When you tab out the field, and if the
value has changed, the proposed journal that will be created is displayed:

7. Click Revalueto revalue the asset

The asset revaluation journal will be created and posted. The book value of the
asset will be the new value specified, and its accumulated depreciation will be
set to zero.
Asset Disposal and Write-offs

Fixed Assets

Asset Disposal and Write-offs

When an asset is disposed off, either by selling it or by writing it off, this needs
to be recorded in MoneyWorks. Because asset disposal necessitates several
accounting adjustments, assets must be disposed of as outlined below. Assets
will continue to be depreciated until they are disposed. Note that only local
currency can be used.

Note: In practice, the asset sale might already be recorded in MoneyWorks. In
that case you would use the Journal option as the disposal transaction, and
the contra account would be whatever was on the receipt/invoice recording
the asset sale.

1. Choose Show>Assets

The Asset list will be displayed.

2. Highlight the asset being disposed of

Each asset must be disposed of individually.

3. Click on Disposetoolbar button

The Sell/Dispose Asset dialog will appear. This contains a sales analysis on
the right, and the accounting transactions that will be generated at the
bottom. These update automatically depending on the information that you
enter.

4. Enter the date of disposal

5. Select the type of sale transaction

The sale can be made as a receipt (where you are receiving "cash"), as an
invoice, or recorded as a journal. Depending on the type selected, you will
need to select a destination bank account, specify a customer code, or
specify a contra general ledger account for journals.

6.

If you are selling a group of assets (such as desks), enter the quantity
being sold
Fixed Assets

Asset Reports

The appropriate journal and sales transaction (if any) will be created, and the
status of the asset will be set as being disposed. The sales transaction will
appear in the History list of the asset.

Note: The sell price of the asset is taken as being tax exclusive. Any tax applied
will be taken from the tax code of the associated fixed asset general ledger
code, possibly overridden by the customer's tax settings for invoiced sales.

7. Enter the sell price of the asset

This is the total being received for the asset (or group of assets) and
excludes tax. This defaults to the asset's current value. Set it to zero if you
are writing off the asset.

8. Make sure that the general ledger codes for Gain/Loss account (and

private) are correct.

These default to those specified in the associated asset category record.

Asset Reports

If the asset has been revalued upward, you can choose to adjust the revaluation
surplus account (this adjustment is put to retained earnings).

There are two main reports supplied for assets. You can of course use the
MoneyWorks report write to customise these, or to create your own reports.

9. Turn on the Transfer Revaluation Surpluscheckbox to transfer any

revaluation surplus

Asset Report

This lists the assets and their values as at today. The assets are ordered the
same as they are in the Asset list, and you have the option to just report on the
highlighted asset(s).

Show History: Turn this on to show the history of each asset (acquisition,

depreciation runs, revaluations, memos etc).

Asset Register

This only appears if the asset has been revalued and if there is a revaluation
surplus. The journal display will adjust. Turning the checkbox off again will
suppress the transfer.

This lists the assets and their values for the nominated Asset Categories at a
point in time. You would typically use this report in your formal reporting.

10. Click the Disposebutton
Fixed Assets

Importing

For Department: To just list the assets for a nominated department, select the
department from the pop-up menu. This is based on the Department field
in each asset record.

Non Depreciable: By default, the report only includes assets that were active
(or new) in the reporting interval. Turn this option on to include Non
Depreciable assets.

Other Assets: Similar to Non Depreciable, turn this on to include other assets.

Importing

Assets and Asset Categories can be imported provided they are in a suitably
formatted tab delimited text file (importing using XML is not supported).

Importing Asset Categories

1. Choose File>Import>Asset Categories

The Asset Category Import field order will open. This displays the required
order of the import fields.

At: The period for the asset values. The report will list the opening bookvalue of
the asset at the start of that financial year, and the closing value at the end
of that period. Any asset acquisitions, revaluations or disposals in that
interval will also be listed.

Highlighted Category Only: If you only want to report on particular categories,

highlight them in the Asset Category list and turn this option on.

By Group: Turn this on if you want the major headings to be the Asset Category
group. Each group will be listed, and then the categories within that group.
Fixed Assets

Importing

The standard file open dialog will be displayed. Use it to navigate to and
open the text file containing the asset information.

2. The Asset Import Field Order window will be displayed

2.

If the first line of your text file is for headings, set the First row is heading
checkbox

3. Click OK

The standard file open dialog will be displayed. Use it to navigate to and
open the text file

If any errors are detected an alert will be displayed, and no categories will be
imported.

Note: You can also paste suitably formatted tab delimited text directly into the

Asset Category list.

Importing Assets

1. Choose File>Import>Assets

Use this is align the MoneyWorks asset fields on the right to the fields in
your text file (see Importing into other Filesfor information on Import
Maps).

3. Click OK

MoneyWorks will check and import the assets.
