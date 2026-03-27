# Locations, Serial Numbers and Batches

Locations, Serial Numbers and Batches

Locations, Serial Numbers and
Batches

tracking is enabled.

Additional columns for location and serial numbers

MoneyWorks allows the tracking of inventoried items by location, and also
items that have serial numbers or batch/lot numbers. This functionality is off by
default, and needs to be turned on in the MoneyWorks Document Preferences.

Locations

To enable location or serial/batch tracking:

1. Open the MoneyWorks Preferences by choosing Edit>Document

Preferences

2. On the Data Entry panel turn on Stock Location Trackingfor location
tracking, and/or Serial Number Trackingfor serial/batch tracking.

You should only turn these options on if you need the functionality, as they
impose extra disciplines in data entry and stock taking. When Stock Location
Tracking is enabled, an additional Location column is displayed on the
transaction entry screen. Similarly a serial/batch column is displayed if batch
Locations are normally physical locations, such as warehouses or branches. But
locations can also be used for consignment stock.

When location tracking is enabled, all stock is considered to kept in a specific
location. So when an inventoried item is purchased or sold, the stock location
needs to be specified. Stock items can be transferred between locations using a
Stock Transfer Journal.

When you turn on Location tracking, all your existing stock (if any) is assigned to
the default location. The default location is a location with no code.

Specifying Locations

Before you can move stock to a different location, the location must be defined.
There is no effective limit on the number of stock locations that you can have.

To define a new stock location:

1. Choose Show>Validation Lists

The Validation List window will open.

There should be a list called Stock Locations. This was created automatically
(if it didn’t already exist) when you turned on the Stock Location Tracking
preference. If for some reason it is not there you will need to add it
manually as described in Creating a Validation List—note that it mustbe
called “Stock Locations”.

Note: There will be a default location in the list—this is one with no code, and is

where all existing inventoried items will be located.



Locations, Serial Numbers and Batches

2. Click the Newtoolbar icon

The list item entry window will open.

3. Enter a code for the location and a description

The code is used when entering transactions to identify the source/
destination of the item. The code can be up to 15 characters long, but you
may want to keep it shorter. It may contain spaces, but must not start or
end with a space.

4. Click OKto save the code (or Nextto save the code and enter another

one).

Note: As of MoneyWorks 9.1.4, you cannot delete a stock location, or change its

code, if there are items in stock at that location.

Specifying locations on transactions

To purchase into a location, or sell from a location, the location needs to be
specified in the locationfield of the transaction entry screen, as shown below.

The location of each item is specified in the Locationcolumn. In this example the first item is being
taken from New York, and the second from the default location.

Notes on Location tracking

• When entering a transaction, MoneyWorks will remember the last location

code that you typed in, and use this as the default on all further
transactions (until it is changed again). This behaviour can be modified
Locations

using mwScript.

• When entering a sales order, the SOH(or Avail) column shows the stock on

hand (or available) at the designated location.

• The main location will not have a location code (just leave the Locationfield
blank). Thus you can start using the MoneyWorks inventory system from a
single location without location tracking, and when you turn location
tracking on you just need to add the new location(s).

• The stock on hand at each location can be seen on the Inventorytab of the

product record.

• A given product code will always have the same average unit value across all
locations. Thus if I have one unit of item “X” with a value of $10 in location
“A”, and I buy 1 more “X” for location “B” at $12, I will have a total of 2
items in stock with a value of $22. The average unit value of “X”, and hence
the value of the item in location “A”, is therefore $11.

• Products that are set to Autobuildwill be built out of components taken
from the same location as the autobuilt product. Thus if, on one sales
transaction, you have autobuilt items coming from different locations, each
product may trigger an autobuild for each specified location (and any
inventoried components will be taken out of each location's stock).

• Negative stock is allowed in any (or all) locations.
• If you inadvertently post a transaction that has the wrong location, you can
either correct the transaction (by Canceland Duplicate), or use a stock
transfer journal. For example the following corrects the receipt of 2 items
that were incorrectly receipted into PARIS when they should have been
receipted into NY:

• If you are using the job system, an additional location field is displayed in

both the job sheet entry window and the time sheet entry.

• To view the stock levels or values by all or nominated location use the Stock
by Locationreport. This can list up to 20 locations across the page, which is
great if you who have the eyesight of an eighteen year old.



Locations, Serial Numbers and Batches

Serial Numbers and Batches

Serial number and batch tracking are where items are tracked by either a serial
number or as a batch. Serial numbers are (or should be) unique to the product,
so a phone for a specific brand will have a unique serial number within that
brand. Thus the quantity of a specific serial number that can be purchased or
sold is one.

Batch (or lot) numbers can come in any quantity, and you can sell up to the
maximum number items that you have in that one batch. For example, if you
purchase 1000 packets of a drug, and 400 are from batch 1 and 600 are from
batch 2, you can't (or shouldn't) resell 800 packets from batch 1 (instead it
would be a maximum of 400 packets from batch 1, with the balance from batch
2).

For convenience, items that require a serial or batch number will be referred to
as Serialised Items.

Notes on serialised items:

• Serial or batch numbers are allocated when you purchase/manufacture an

item, or otherwise bring it into stock.

• When you sell serialised items, you must specify the serial/batch number at

the time of sale.

• Serialised items cannot be autobuilt, and should not be components of
another autobuilt item. MoneyWorks will ignore autobuilds that contain
serialised items, so autobuilt item will just go into negative stock.

• A serialised item will have the same average unit value across all serial/

batches (just like locations).

Specifying that a product is to be tracked by serial/batch

Unlike location tracking (which applies to all inventoried items), serial and batch
tracking is an attribute of each product, and needs to be turned in the product
record itself.

To turn on serial/batch tracking for an item:

1. Create a new item, or locate the item in the Item Listand open it by

double-clicking

Serial Numbers and Batches

2. On the Inventorytab, turn on the Serial Number Trackingor Batch

Number Trackingas appropriate

Only one of these can be enabled. Note that these are only available for
items that are inventoried (i.e. the option We Stock It and treat inventory as
an assetis set on the Detailstab).

Note: You cannot enable serial/batch tracking for an item unless its stock on

hand is zero at all locations.

Note: If you have location tracking turned on, MoneyWorks will need to

calculate the total stock on hand for the serialised item in each location.
This will be expensive if there are thousands of the item in stock, potentially
introducing a delay in displaying the location count. In this situation, turn
Locations, Serial Numbers and Batches

off the Show Totals by Locationoption to speed things up.

3.

If you are tracking by batch number and want to record the expiry date of
the batches, turn on the Batches expireoption.

Serial Numbers and Batches

If this option is on, you should record the batch expiry date in the Date
column whenever you purchase/manufacture a new batch.

This indicates that when you tab out of this field (or click the icon) the line will
split, allowing you to enter (or scan) the serial number of the next item ...

Allocating serial and batch numbers

Serial and batch numbers need to be specified when the item is purchased or
otherwise receipted into stock.

For purchase orders: When any of the Receive Goods...options are selected.

The serial/batch numbers must be entered in the Serial/Batch column (one
number per line), for all lines where the quantity received is not zero. You
will not be able to receive the goods if a required serial/batch is missing;

For purchase invoices and payments: When the item is posted the serial/batch
numbers must be present, again one number per line. You will not be able
to post the transaction if a required serial/batch is missing.

For Manufacturing: If any of the components or the manufactured item itself

are serialised, you will need to use a Stock Transferjournal. Using
Command>Build Product will create an (unposted) stock transfer journal
into which you can enter the required serial/batch number.

Because you will need to record one batch/serial number per line of a
transaction, MoneyWorks provides an easy way to split lines. Consider the
following purchase order, where we have indicated that we are receiving 5
serialised items (and note the serial # required warning in the serial/batch field)

... and so on until they are all entered:

Notice that the order quantity and receive quantity of the new line are
corresponding reduced. For serial numbers, the received quantity on the
original line will be set to one. For batches, you need to enter the actual
received quantity for each batch number, and the balance carried down is the
difference in the outstanding order quantity and the received quantities already
entered.

So we have ordered 100 units of a product, and have been shipped 60 units
from BATCH1:

As the serial number of the first item is being entered, a "Split" icon appears in
the right of the Serial/Batch field.

MoneyWorks does not know at this point if this is just a partial shipment (so you
are receiving only 60 units this time), or whether there are different batches
involved. If the latter, you need to force a the line to split by clicking on the split
icon in the batch field. When the line splits, the balance of 40 remains to be
entered with its batch number:
Locations, Serial Numbers and Batches

Serials, Batches and Jobs

The process is repeated until all batches are receipts.

Note: When purchasing products with batch numbers that are marked as

expiring, you will need to enter the expiry date of the batch into the Date
field. If this date differs from a previously entered expiry for the same batch,
the new date will be used as the expiry date.

Assigning serial and batch numbers to sales

Whenever you sell a serialised item, you will need to specify the serial or batch
number for the item. This can be entered when the transaction is created (if it is
not known), but must be entered before goods can be shipped (if on an order),
or before the transaction is posted (if a sales order or receipt).

To specify a serial/batch number, simply scan or type it into the serial/batch
field on the transaction line, or click the split icon to bring up the Serial/Batch
picker (this will also display if you enter a non-existent serial or batch number).

The Serial/Batch Picker

The picker is displayed whenever you are required to enter a serial/batch
number, have entered a serial/batch that is not available, or click on the split
icon in the serial/batch entry field where the field does not contain a valid serial.

Points to note:

• The list displays the available serial/batch numbers based on the current

stock on hand and adjusted for those already allocated on this transaction.
If another user allocates the same serial/batch in a different transaction at
the same time, or if the number has been pre-allocated in a different
transaction, it will still appear as available.

• If Location Trackingis also enabled, the list will be segmented by location

(and default to the location specified on the transaction line). If you choose
a serial/batch from a different location, the location on the transaction line
will be updated to reflect that location.

• Negative stock is only loosely enforced. MoneyWorks will attempt to

prevent negative stock (selling a serial number twice for example, leading to
a stock on hand for the item of -1). But if you really try, experience tells us
that you will probably succeed—you can fix these sorts of issues using a
Stock Transfer journal.

• For items that are not tracked by serial/batch number, the serial/batch field
on a transaction entry screen is available for general use. You can enter up
to 31 characters of text, and this is recorded on the transaction but not
validated in any way. Note that the location field is always validated, so
cannot be used like this.

Serials, Batches and Jobs

The serial/batch picker. Double-click an item to use its serial/batch number.

Note: The second line in the example above has a qty of [-90]=0. This indicates
that 90 units of that batch have already been allocated on this order,
leaving 0 remaining.

If location tracking or serial/batch tracking are enabled, additional fields are
available in the job sheet entry window. For serialised items you must specify
the location and/or serial/batch number when you make a stock requisition in a
job.
Locations, Serial Numbers and Batches

Stock Transfer Journals

2. Enter the transaction date and description

3. Click on the Transfertab

4.

In the Contrafield, enter a general ledger code

When requisitioning serialised items, you must specify the serial/batch number.

A serial/Batch number is also available in the Time Sheet entry window.

Stock Transfer Journals

The net dollar difference of the credits and debits created by the journal will be
posted to this account, which would normally be some sort of expense account.

In practice, if you are transferring the same item but just correcting for an
invalid location or serial/batch number, the journal will always have a net value
of zero.

Stock transfer journals can be used to fix a variety of errors concerning serial
numbers, batches and locations.

5. Type the code of the item in Codefield of the first line

6. Type the quantity of the item to adjust in the Qtycolumn

A negative quantity indicates that that many of the item is to be removed from
stock; a positive quantity indicates that that quantity will be put into stock.

7. Enter the serial/batch number (if any) into the Serial/Batchfield

This is the serial/batch that will be removed (if Qty if negative) or added to
stock.

8. Enter a location (if any) in to the Locationfield

This is the location from which the item will be removed from (if the Qty is
negative) or put into stock.

9. Continue adding lines for items that need to be transferred/corrected

If you are moving the same item between locations (or fixing a batch/serial
number) the total of the journal should be zero (as no value is being created or
lost). If however you have moved more items out of stock than in, then you are
effectively doing a stock write-off (and conversely a stock creation if more items
are coming in than going out). In this case the total of the journal will be non-
zero, and the contra account will be debited (for a “stock creation”) or credited
(for a “stock write-off”) by this value.

Stock transfer journal

To make a transfer journal:

1.

In the Transactions list, select the Journals sidebar tab and click the New
toolbar button or press Ctrl-N/⌘-N

The Journal entry screen is displayed.
