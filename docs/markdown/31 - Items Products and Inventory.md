# Items, Products and Inventory

Items, Products and Inventory

provide responsive performance).

Be sure to turn on the *Run on Server if possible* option in the Report Prefs of
your custom reports. Note that reports that operate on a selection of records
need to take measures to pass the selection to the server. All standard reports
do this.

Security

If your server is accessible over the public internet, we recommend that you
enable encryption (SSL/TLS). This requires an SSL certificate, obtained from a
certificate authority. You can use the same SSL certificate for native and REST
service.

Items, Products and Inventory

Often in business you purchase or sell the same product items or services over
and over again. The MoneyWorks product/inventory system can help this.

An item is anything that you buy or sell on a regular basis. It may be something
intangible, such as consulting services, or an actual physical product, such as a
magazine. There are several different ways that items can be used, and an
organisation may use some, all or none of these.

Consumables These are items that you purchase, but they are intended for
(more or less) immediate consumption. This includes items such as
electricity, photocopy paper, office supplies etc. When you purchase
consumables, they are normally treated as an expense.

Saleables These are things which you sell. Sometimes you might sell an item

(such as courier tickets), or it might be a service that you provide
(consulting). In either case, these are normally treated as income items.

Counted Items These are items for which you just want to maintain a running

count, so when you purchase three the count increases by three, and when
you sell one it decreases by one. This is a very simple form of inventory, but
without the inventory accounting.

Inventory Items These are items that you make or purchase and hold in

inventory. Not only does MoneyWorks maintain a count of the items you
have in stock (as for counted items), but it also maintains the value of these
items. Crucially the fundamental accounting for inventoried items is
different: when these items are in stock they are normally treated as assets,
and only when sold will they be expensed.

If you keep inventoried items in several locations (for example, multiple
branches or warehouses, or even as consignment stock), then you should
consider using Location tracking.

Some inventory items, such as computers or phones, might also have serial
numbers that you want to track, and others, like drugs (hopefully the good kind)
or carpet, might have batch numbers and even expiry dates.

For more information see Locations, Serial Numbers and Batches.
Items, Products and Inventory

Creating a New Item

In MoneyWorks you can create these kinds of products and then use them in
your normal accounting transactions. You can also use the Enquiries and
Analysis features of MoneyWorks to determine what happened to these items
(for example, which customers purchased which items).

The Item File

Before you can use the item features of MoneyWorks, you need to define your
items. At the least, each item requires a code, and it will probably also have a
description. Depending upon what you want to do with the item (i.e. buy it, sell
it and/or count or stock it) certain other information is also required. Included in
this other information are the general ledger codes which MoneyWorks will use
to account for transactions involving the item.

To display the item file:

1. Choose Show>Items or press Ctrl-3/⌘-3

The Items list window will be displayed.

Time: This is intended for the various types of time that you sell. Items used

from here in the job costing will be flagged as time items in the appropriate
reports.

Ship Methods: Ship methods are the standard methods by which you send or
receive goods, and hence are items that can be bought or sold (but not
inventoried). These are used in the freight lines of the order entry system.

Other: For (non-inventoried) items that you don’t want to appear in the

previous tabs.

A sixth view (Stocktake) allows you to easily manage the physical stock count.

Creating a New Item

Item records can be created from the item list, or “on the fly” by clicking the
Newbutton on the Item Choices list. The item entry screen is a tabbed window:

The item file has views for the five different classes of product:

Products: This is the general case, and items under here can be bought, sold,

inventoried and/or manufactured.

Resources: You can sell and/or buy resources, but not stock or manufacture
them. Resources that are sold but not bought can have a standard cost.

1. Type in the product code
Items, Products and Inventory

Creating a New Item

This can be up to 31 characters long. It may not contain spaces and it must
be unique.

1. Enter any comments or custom information about the item

Comments on Invoices: Codes that start with an asterisk (“*”) are handled
specially by the forms (purchase orders, invoices etc) provided with
MoneyWorks. Specifically their code, quantity and price will not be printed,
allowing you to have comments on your forms.

Tip: If you are using forms designed with the Forms Designer, you can store long
descriptions of each item in the comments field and use the “Lookup”
function to insert it into your invoice when it is printed. In this way your
MoneyWorks file will not be made large by storing redundant item
descriptions.

2. Type in the item name

If you buy this item

This can be up to 255 characters long. It is transferred to the description in
the transaction detail line when the item is used.

3. Set the Class for the item

This determines whether the item can be inventoried or manufactured,
whether it can be used in the freight section of the order entry system, or
will be flagged as “time” in job costing.

The class can be altered later, with the proviso that it can only be changed
from a product to another class if it is not inventoried.

You can have up to four categories for each item. These are useful for searching,
and are also used in the Analysis facility.

4. Enter any categories that you require

The categories can each contain fifteen characters.

It is a good idea to ensure that like categories are put into the same field.
For example, if you are selling clothing, you might use category one for the
size, category two for the colour and so forth.

Details

The Details tab (shown previously) allows you to specify information about how
you use the item (e.g. you only buy it, you sell it or whatever). In addition you
can provide general comments (up to 1020 characters) about the item, and
there are eight custom fields available for your own use (the first two can
contain up to 255 characters, the others up to 15).

If you purchase an item, the We Buy Thischeck box must be checked and a
general ledger code provided against which the purchases can be charged (it
should be an expense account). You must do this if you want to use the item in a
purchase order, cash payment or creditor transaction. In addition, you can enter
optional information about the supplier and pricing of the item.

1. Click the We Buy Thischeck box if you purchase this item

The Expense Account when Buyingfield will be activated.

2. Enter the general ledger expense account code for recording purchases of

this item

This control account is automatically used when you generate a purchase (a
cash payment or a creditor invoice) for the item. It can be
departmentalised. If the “Append Salesperson” option is set, the
information in the salesperson field of the transaction is automatically
appended (as a department) to the account code1. This is useful if you want
to monitor transactions by salesperson —see Using Products with
Departments. You should have a complete understanding of how this
option operates before using it.

You can also set the expected purchase price and the usual supplier for
items that are purchased. The purchase price will be automatically updated
any time you buy the item.

If you sell the item: If you sell the item, the We Sell Itcheck box must be

set—you must do this if you are going to use the item in a cash receipt,
debtor invoice or sales order. Whenever you sell an item, you generate
income. Thus if you are going to sell the item you need to specify the selling
Items, Products and Inventory

price and the sales (income) general ledger code.

1.

If you are going to sell the item, set the We Sell Itcheck box

The Income Account When Selling(the Sales control account) is enabled.

2. Enter the general ledger code for the sales control account

Creating a New Item

item—you can only turn this option on if the class of the item is set to
Product.

1.

If you stock the item, set the We Stock Itoption

If you buy this item as well as stock it, you will purchase it into a current
asset account (as opposed to an expense account).

This must be an existing account, and should be of type Income. It can be
departmentalised. If you use the Append Salespersonoption, the
information in the Salesperson field of the transaction will be automatically
appended (as a department) to the account code when the item is sold.

If you sell this item as well as stock it, you will need to specify a cost of
goods account. When you generate a sales transaction, MoneyWorks will
automatically transfer the item from the stock account (which is an asset)
into the cost of goods account (which is an expense account),

You can also set the selling price(s) for items that are sold.

If you count the item: If you want to count the item, you need
to set the We Count It check box. If this option is on,
MoneyWorks will maintain a simple count of the item.

1.

If you count the item, set the We Countit option

The Countfield

MoneyWorks will maintain a running total (visible and alterable in the
item’s Inventorytab) of the quantity that you have. When you purchase an
item the total will increase (normally by one, but possibly by a different
quantity if the item has a Unit Conversion), and when you sell an item, the
total will decrease by one.

This form of item counting is fairly “loose”. You can turn it on or off at any
time, and alter the counted balance (in the Inventory tab). Unlike full
inventory, counted items will be expensed on purchase and not appear on
the balance sheet (unless an asset/liability account is used as the buying/
selling account). No audit trails of counted items is maintained.

If you turn on this option after turning off the We Count itoption,
MoneyWorks will offer to do a stock creation journal to bring the counted
total into stock when you click OK on the item record.

2. Enter the appropriate general ledger code into the Asset Account for Stock

field

This must be a current asset account. The account can be departmentalised,
but you need to specify the account-department code here as there is no
option to append the department code at transaction entry time.

Note: If you turn on the We Stock it ...option after turning off the We Count it
option when the count was non-zero, MoneyWorks will offer to do a stock
journal to bring the counted total into stock when you click OK on the item
record.

Similarly if you turn off the We Stock it...option when the stock on hand is
non-zero, MoneyWorks will need to do a stock journal to bring the stock on
hand value to zero.

Note: the two options We Count It and We Stock it and treat inventory as an

In both cases you will be presented with the following dialog:

asset are mutually exclusive: only one can be set for an item. If you want to
change from counting to full inventory, you will need to turn off the We
Count it, and then turn on the We Stock it.

If you stock the item: If you stock (i.e. maintain full inventory accounting) the
item, you need to set the We Stock Itcheck box. If this option is on,
MoneyWorks will maintain an inventory level and average costing for the
Items, Products and Inventory

Creating a New Item

This indicates the quantity of the item and the value that will be created or
written off. The Stock Adjustment account is normally the cost of goods sold
account for the item. You must accept this journal to be able to turn
inventory on or off.

Item’s Barcode: You can store the barcode (or alternate product code) for the
item in the Barcode field—this can be up to 19 characters long. Barcodes
can be printed on forms and reports in either EAN13 (UPC) or Code128.

The barcode can be used as an alternate product code when you are
entering transactions, provided it does not conflict with an existing item
code. When an entry is made into the code field of a transaction, the item
codes are checked to see if the entry matches; if no match is found the
barcodes are checked. If a match is found, the entered barcode is replaced
by the item code. If more than one match is found, the item choices
window is displayed with just the items that have the same barcode.

1. Right-click on the empty picture field and select Import Image

The File Open dialog will be displayed

2. Locate the picture file and click Open

MoneyWorks will create an image based on that in the file you selected.
The image will be resampled and recompressed to an optimal size2, and
saved into your custom plug-ins folder (and for networked versions,
uploaded to the MoneyWorks server)3. The image will be displayed in the
product window.

You can also just drag the image file and drop it into the picture box area

To delete the image:

Item Pictures

1. Click the small Waste Paper icon under the image

You can add an image of an item if you wish. These can be displayed on invoices
and reports, such as the item Catalogue report. To add a picture:

The previously copied image file will be permanently deleted if you click the
OKor Nextbutton.

Note: Dragging the picture out of the item window will drag a copy of the

picture only (and not delete it).

Buying Info

Information about the purchase of an item is specified in the buying info tab.
This information includes the price and supplier details.
Items, Products and Inventory

Creating a New Item

1. Enter the normal purchase price into the Buy Pricefield

This is the amount for which you will normally purchase the item. It should
not include freight, duties or other costs which are accounted for
separately. It can have up to four decimal places.

Note: If you are using more than one currency, you can select the currency of

the purchase price from the Buy in currency pop-up menu.

Note: Unless you have turned the Update Price Whenever Purchasedoption off,

the buy price and currency will be automatically updated by the system to
reflect the last undiscounted buy price whenever the item is purchased.

2. Enter the purchase units (up to 3 characters)

The units might be “Kg” for kilogram, “ea” for each and so forth.

If you both buy and sell the item, the units in which you purchase may be
different from the units in which you sell. You can use the conversion factor to
convert the units from buying to selling. This will affect the margin calculation.

3. Enter the sell units (up to 3 characters)

4. Enter the conversion factor if required

This can have up to four decimal places. As an example, if you buy in
kilograms and sell in grams, the conversion factor will be 1000 (i.e. the
number of sell units that is a single buy unit yields).

Note: For inventoried products, the stock-on-hand is always recorded in selling

units. This conversion will happen when you buy the stock.

Update Price Whenever Purchased: Turn this option off if you do not want the

last buy price to be updated whenever you purchase this item.

Override Tax code: By default, when you purchase the item, the tax (GST/VAT
etc) will be calculated based on the tax code associated with the general
ledger code of the purchase account. You can force a different tax code by
setting the tax override to a specific tax code. Note that this setting is
subservient to any tax override associated with the supplier.

Plussage

The buy price represents your normal purchase price. However there may be
additional costs, such as freight or labour, that you want included into your cost
for calculating margins.

You can store this additional cost in the Plussagefield. This is not an accounting
cost (the actual charges will be accounted for elsewhere), but is added to your
purchase price for the margin calculations when you enter the sell price(s).

1. Enter the plussage amount (if any) into the Plussagefield

This can be up to four decimal digits.

Reordering Details

If you buy the item, you can optionally record your main supplier and their
product code if you want. This will appear on the reorder reminder message and
is used in the Reorder Products command —see Batch Reordering. You can also
access this information from the Report Writer and Forms Designer if you are
designing a purchase order.

1. Enter the Normal Order Qty
Items, Products and Inventory

This is the number of the item that you would normally purchase.

2. Enter the supplier code into the Usual Supplierfield

The code must be that of an existing supplier.

3. Enter the supplier’s product code into the Supplier’s Codefield

This can be up to 19 characters long, and is the code that the supplier uses.
You can use the “Lookup” function in the Forms Designer to find this code in
purchase orders.

4. Enter the normal lead time in days into the Lead Time field

Use this information to help you manage your stock ordering

5. Enter the purchase weight of the item into the Item Weight

You can use this to calculate shipping weights on purchase orders. The
actual units (kg, lbs, methuselahs4 etc) are up to you, but you should
maintain consistency otherwise you will be adding methuselahs to
jeroboams, which would put you in a right pickle.

Sell Prices

The sell prices for the item are maintained under this tab. MoneyWorks
supports single sell prices, multiple pricing based on the customer type, and
quantity discounts.

Creating a New Item

Single Price

With single pricing, there is only one selling price. This can be further
discounted according to the discount settings.

1. Enter the selling price into the Pricefield

This is the amount that will automatically be placed in the Unit Price field of
any debtor invoices, cash receipts or sales orders that you generate for the
item. You can enter up to four decimal places. Note that, unless otherwise
specified, this is a GST/VAT/Tax exclusive price.

2.

If the sell price is GST/VAT/Tax inclusive, set the pop-up to Tax Incl

You should only need to do this if you sell items retail and their GST
inclusive retail price results in an irrational exclusive price (e.g. it is
impossible to represent accurately the Tax inclusive amount $13.00 as a Tax
exclusive figure at 12.5% Tax rate).

3. Enter the sell units in the Unitfield

This can be up to three characters long, and represents the units (e.g. kg,
ea) in which you sell the item. This is the same Sell Unitfield as on the
Buying Info panel—if you don’t buy the item, you should set it here.
Items, Products and Inventory

Creating a New Item

Override Tax code: By default, when you sell the item, the tax (GST/VAT etc) will
be calculated based on the tax code associated with the general ledger code
of the sales account. You can force a different tax code on the sale by
setting the tax override to a specific tax code. For example if you are in
Australia and this particular item is GST Free, you would set the tax override
to "F". Note that this setting is subservient to any tax override associated
with the customer.

If you offer discounts for items sold, these can be calculated in one of three
ways (or you can set the D, E, or F sell price to be a discount, as explained later):

By Customer Use the customer discount from the debtor’s

record;

By Product Use the information in the discount field of the

item;

Add Add the product and customer discounts.

Set the discount
pop-up menu to
apply additional
customer or
product specific
discounts.

4.

If you normally sell the item at a discount, set the Discountpop-up menu
to the appropriate discount type

This determines how the default discount rate is calculated when the item
is used in a sales transaction.

5. Enter the item discount (if any) into the Discountfield

This is only used if the discount type is set to Productor Add.

Multiple Prices

Set the Multiple Pricesoption if you have different types of customer who each
have a different price structure.

• The price names (Price A, Price B etc) can be changed in the Fields tab of

the Document Preferences.

• The sell price used in a transaction or job sheet entry is
determined by the Price Codesetting in the customer
record field.

• The prices are not in any particular currency. If you want
(say) your E prices to be in Euros, change the field name
to Euro and ensure that any customers in the Euro zone
have their Price Code set to E.

The Price Code
setting in the
customer record
determines the
price.

• Prices codes D, E and F can be set to either Cost Plus or
Discount percentage amounts (or an absolute dollar
amount) by changing the associated pop-up menu.

• A Cost Plus sell price is calculated by adding the specified
percent to the last buy price at the time the transaction
is entered.

• A Discount sell price is calculated by subtracting the

specified percentage from the A Sell price at the time
the transaction is entered.

• Discounts set in the discount section apply only to prices that are not set to

Cost Plusor Discount.

Quantity Price Breaks

The A and B price levels can also have up to five different price levels dependent
upon the quantity purchased. This is activated by turning on the Quantity Price
Breaksoption.

In the example above, if I am a Price A customer and I purchase 10 or more of
the item, I will pay $14 for each one, not $15. If I purchase 20 or more items, I
will pay $12 each. B Customers must purchase 20 units to get a special price.
Items, Products and Inventory

Additional units only

If you set the Additional units onlycheck box, the quantity break pricing is
applied to only the additional units sold. This means that in the above example,
if a Price A customer purchased 13 items, she would pay $30 for the first 10,
then $28 for the next 3. If she purchased 40 items, she would pay $30 for the
first 10, $28 for the next 10, and $24 for the remainder (a total of $1080, or $27
per unit). In this situation MoneyWorks puts the weighted average price ($27)
into the detail line of the transaction as the unit price.

To set the quantity price breaks

1. Turn the Quantity price breaksoption on

The #Unitsfield will become visible

2. Enter the quantity into the #Unitsfield at which the price break will come

into effect

Price fields for Price Levels A and B will become visible, as will another
#Unitsfield (for the next price break).

• Any discounts specified by the Discountsfield will be applied to the price

break prices;

• You can override the pricing at the time of transaction entry.

Creating a New Item

Margins and Markups

The Margin section allows you to look at the margin or
markup of the sell prices, and flag those that are below a
specified threshold.

Selling prices below
the designated
markup or margin
percentage are
flagged.

3. Enter the sell prices for quantities that are greater than or equal to this

number of units

For the margin/markup calculations, the following applies:

4.

If there are additional price breaks, enter another quantity in the next
#Unitsfield and repeat

You can have up to four quantities specified. If you want to have fewer price
breaks, leave the last quantity field at zero.

5. Turn on the Additional units onlyoption if you want the pricing to apply

only on the additional units sold

A few points to bear in mind:

• The quantities specified in the #Units field should be increasing in value

from left to right;

• The quantity break is applied based on an individual detail line in the order

or invoice. It is not cumulative over the entire transaction, nor over previous
sales to the customer;
Purchase Price = Buy Price + Plussage
Sell Price = Specified Sell Price - Product Discount
Margin = (Sell Price - Purchase Price) / Sell Price
Markup = (Sell Price - Purchase Price) / Purchase Price

If the Tax Incloption is set, the Specified Sell Price is adjusted by the GST/VAT/
TAX amount in the nominated sell price.

Note: Prices are assumed to be in local currency for these calculations. If the

Buy Price is specified in a different currency, the standard cost is used (this
is the based on the last time the buy price was updated, at the then
exchange rate).



Items, Products and Inventory

Item Weight

The weight of the item being sold. The units are not specified, but you should
ensure they are consistent across items if you want to add them for shipping
purposes.

Inventory

The Inventorytab provides information about items that are inventoried,
including location and serial numbers and batches.

Note: For items

that are only
counted, the
count is
displayed
instead of
Stock on Hand.
The Count
value is modifiable by the user, whereas the Stock on Hand requires an
accounting transaction to be modified.

purchased or sold. You can adjust the stock levels by using stock creation and
write-off journals, and you can revalue stock by using a stock revaluation
journal.

Creating a New Item

1. Set the Reorder Levelif required

This is the point at which you like to reorder stock.

2. Set the Warning when stock falls below this levelcheck box if you want to

be alerted when your stock is getting low

This will cause a reminder message to be created when the stock falls below
the reorder level.

3. Set the Normal Order Qty

Any orders creates using the Reorder command —see Batch Reorderingwill
be made in multiples of this. This field is a repeat of the one on the Buying
Infotab. If you manufacture the item, it is called Normal Build Qty

MoneyWorks can manage serial and batch numbers for inventoried items such
as computers or medicines. Provided you have turned on this capability in the
Document Preferences, you can enable serial/batch tracking for individual
products. See Locations, Serial Numbers and Batches for more information.

4.

5.

6.

If you want to track the serial numbers on this product, set the Serial
number trackingoption

If this product comes in batches that need tracking, set the Batch number
trackingoption

If the batches have expiry dates that need monitoring, set the Batches
expireoption

History

A transaction history for the product is available under the History tab.

The Stock on Hand, Average Unit Cost and Stock Valuefields display the current
inventory status for the item. These are maintained by MoneyWorks and cannot
be altered—they are automatically updated whenever a stocked item is
Items, Products and Inventory

Creating a New Item

Bill of Materials (BOM)

The BOMtab contains information on the components that make up an item
that is manufactured.

There are two views:

History: A list of posted transactions concerning the item;

Pending: Shows the stock status and outstanding orders.

Include Unposted: If set, the Effective Stock calculation in the Pendingview

includes the effect of any unposted transactions.

Note: On large data files, there is an option Enable this panel (large data set may
be slow).If it is taking a long time to see your history, turn this option off.

Costing

If you manufacture it

A product can be manufactured from other product items. You can build the
product whenever you require it, or it can be automatically built whenever it is
sold.

1. Set the Manufacture this Item According to Bill of Materialscheck box

The Recipe list will be enabled.

The costing tab is used to set the parameters that should be used with the
product when using job costing.

You need to specify how the item is manufactured. This includes the
manufacturing batch size and the components or recipe for the item.

If the product is purchased, the Standard Costfield will display the discounted
price per buy unit (converted to local currency if necessary) of the last purchase
of the product.

Minimum Build Qty Use the Minimum Build Qtyfield to specify the number of
units that can be physically made at one time. For example an injection
moulder may always make comedy plastic noses ten at a time, using 300g
of plastic powder. In this case enter 10 into the Minimum Build Qtyfield.
This tells MoneyWorks that it can’t auto-build just (say) three noses,
because the nose injection moulder just doesn’t work that way.
Items, Products and Inventory

Creating a New Item

Auto-Build Whenever Necessary Set this option if you want MoneyWorks to

Specifying the bill of materials

automatically build the item if it detects there is insufficient in stock to fulfil
an order. The item will be built with a Make stock journal—this will be
created (and posted) provided there are sufficient components in stock.
Note that the margin display on the transaction window is for the old
stock—the rebuilt items may have a different cost. If you have volatile
component prices and thin margins, it is probably better to use the Build
command to create the items so you can better track the actual margin.

Normal Build Qty The Normal Build Qtyfield contains the normal production
run that you would make, and must be a multiple of the Minimum Build
Qty. This is the quantity that MoneyWorks will suggest when you use the
Build Product command to create a stock transfer to represent a production
run. You probably make comedy plastic noses in runs of say 6,000, since the
nose injection moulding machine takes a bit of work to set up, and you
want to make the effort worthwhile.

The bill of materials for the manufactured item is specified in the parts list. The
parts in this list must be purchased or stocked5. Thus if you want to include a
labour component in your product, that component must have the We Buy This
option set.

2. Set the Minimum Build Quantityto the smallest number that can be

manufactured

To add a part to the list:

Note: The Minimum Build Quantityis equivalent to the Minimum Order

Quantity. You cannot therefore both buy and manufacture the item using
different minimum quantities.

3.

If you want to Auto-Build the item, turn the Auto-Build Whenever
Necessaryoption on

When you sell the item and do not have sufficient stock, MoneyWorks will
automatically build the required number based on the bill of materials
(even if there is insufficient stock of the components, which will just go into
negative stock).

Note: You cannot auto-build items that require a serial or batch number (or
whose bill of materials includes serialised products). This is because you
need to specify the serial/batch numbers of the items involved at the point
the item is manufactured.

1. Click the Addbutton

or press Ctrl-N/⌘-N

The cursor will be positioned in the next available part row.

2. Enter the qty required to build ONE unit, and the part code

The cost and sell fields are automatically filled out for you based on the
information in the part’s product record. The part code must be for an
existing item that is stocked or purchased.

3.

If required, enter a memo into the Memofield

This is for your own use, and might be some manufacturing instruction,
such as where to position the part. It can be up to 255 characters long.

4. You can remove the current part from the list by clicking the deletebutton

, or by choosing Delete Part from the Edit menu

To print the bill of materials:
Items, Products and Inventory

Modifying and Deleting Product Items and Resources

1. Click the printbutton

at the bottom right of the list

OKor Nextbutton:

The bill of materials is saved when the product record is saved.

Note: The Bill of Materials printoutprovides a listing of the bill of materials and

current costing for a range of products. You can also use the Find Related
commandto find a product’s components, or what products use this item
as a component.

Modifying and Deleting Product Items and
Resources

Product items can be modified by double-clicking in the normal manner.

You can delete a item record6 regardless of whether or not it has been used in
transactions or job sheet items. However you will not be able to post any
existing transactions that use it, and nor will you be able to select it for
analysis7. Recurring transactions that use the item will recur correctly, but you
will not be able to post them.

If you click Change Codes, MoneyWorks will change the item code in all existing
transactions to the new code—this means that your historical records
concerning the transaction will still be linked to item record.

If you click Don’t Change(or the Preference option was not set), then the old
product ceases to exist, and the new product inherits all the attributes (except
the code) of the old. Existing transactions that use the old product code are not
changed, as is the case when changing the code for an Account or Name.

Note: In multi-user mode, you can only change a product code when no other

users are connected—see Changing “code” fields.

If you change the product code or delete a product that is a component of a
manufactured item, the item will no longer be included when you build the
manufactured item. No warning is given to this effect.

If you change the price or description for an item, any recurring transactions
involving that product will use the new price, description and control accounts
when they recur provided the appropriate preferences are set in the Startup
document preferences.

You cannot delete a product that is stocked (or make it unstocked) unless it has
zero stock on hand8.

Printing a Product List

Use the Classpop-up menu to change the product’s type (e.g. Resourceto
Time). Stocked items must be a Product.

Changing a Product Code

The item list window can be printed by clicking the Print Listtool-bar button,
choosing Print from the File menu, or pressing Ctrl-P/⌘-P. The list, or optionally
just the highlighted records in the list, will print as shown on screen, including
any customised columns. If the list is sorted, it can be subtotalled by the sorted
column.9

You can change the code for a product if you wish. What happens then is
governed by the Ask to alter existing transaction recordsPreference option. If
the option is on, the message on the right will be displayed when you click the
Items, Products and Inventory

Updating Inventory

There are a number of reports in the list sidebar that will also print the items
showing or highlighted in the list. These include:

Updating Inventory

Stock Valuation Report: This prints each product with its purchase price,
quantity in stock, purchase valuation, sell price and sell valuation.

For items that you stock, the stock information held in the item file is only
updated when a transaction involving that item is posted.

Reorder List: This prints each product with its current stock on hand,

committed, ordered, effective stock on hand and re-order level. Use it to
help decide what items and what quantities need to be re-ordered.

Note: The result of posting a stock item is different if the Enable Job Costing and
Time Billingpreference option is set and the job code column is filled in the
transaction line. These are discussed separately below.

Bill of Materials: Prints the “bill of materials” for each highlighted item. The

Note: When you post any transaction that involves an inventoried item, the cost

current stock on hand, average value and cost price of the components is
listed, along with the quantity that can be built based on the current stock
level of the components (ignoring any minimum build quantity restrictions

of goods and stock information within the transaction is updated to reflect
the current stock valuation within MoneyWorks at the time of posting. This
may be different from the valuation when you first entered the transaction.

Stock History: Prints a complete history of all stock movements back to the start
of a nominated date. As well as showing the quantities in and out, the
report also shows the costings, inventory levels and valuation. The report
should be printed in landscape.

Note: You can use this report to reconcile your stock levels back to a
nominated point in time. However the calculations are based on the time
the transaction was posted, not on the transaction date. If you have
entered stock transactions out of order, the results will not necessarily be
correct.

Price List: Prints a list of highlighted products with their sell price (either Tax

exclusive or inclusive) for the nominated price level. The Tax is determined
by the tax code of the sales account.

Individual Price List: This report, which is available in the sidebar of the Names
list, prepares a separate price list for each of the highlighted records in the
names list (or all names if none highlighted), for each of the highlighted
items in the items list (or all items if none highlighted).

Product Catalogue: Prints the highlighted items as a catalogue, with prices for

the selected price level, images, descriptions and barcodes.

Note: When you purchase a stock item, the normal accounting transaction is to

debit stock and to credit bank or accounts payable. However if you
purchase an item that is in negative stock, MoneyWorks will also put in a
correction to account for any difference in the estimated cost of goods
when the item was sold, and the actual cost of goods when it was
subsequently replaced. This is why you will see purchase transactions when
you do an account enquiry on the cost of goods account.

Note: All stock values are held in the local currency.

Posting stock transactions without Enable Job Costing &
Time Billing

When you post a transaction involving a product that you stock:

• The stock level is adjusted by the quantity in the transaction. If you are

buying the product, the stock adjustment is the buy quantity multiplied by
the conversion factor (since stock on hand is maintained in sell units).
• When you purchase stock items, they are treated as assets (they will be

stored somewhere until used). Their value will not be expensed until they
are sold. The stock account will increase (be debited) by the price of the
stock items, and the stock quantity will increase by the quantity purchased
multiplied10 by the conversion factor. The average price of the item will be
recalculated.

• If you purchase a stock item whose current inventory level is less than zero,
Items, Products and Inventory

Updating Inventory

and the cost of that item is different to the nominal cost of the items in
negative stock, MoneyWorks will automatically adjust the stock values to
account for the discrepancy.

• Selling transactions involving stock items will generate additional

accounting entries within MoneyWorks. Specifically when you sell an item
your income increases, and so does your bank or accounts receivable
account (in accounting terms, your income account is credited and your
bank account or accounts receivable is debited). However at the same time
the value of your stock has been reduced, and the amount that you had
invested in the asset (i.e. the item sitting on your shelves) can now be
treated as an expense (in accounting terms, the stock account is credited
and the cost of goods account is debited). Thus there are actually four
components to this transaction, not the normal two. However you don’t
need to worry about this, as MoneyWorks will look after it for you—you can
see the extra detail lines when you print a transaction listing with the Print
Detailstoolbar icon. Selling stock items will also reduce the number of
items in stock.

• If the stock level falls below the reorder point and the reorder warnings

check box is set, a warning is given.

If you click the Remindersbutton, a message is created to remind you to
reorder the product. These messages appear automatically when you open
the file, or you can view them using the Show Today’s Messages command.

Warning: Never “sell” stock using a negative quantity on a creditor invoice (or
payment). This will credit your stock account, and not your sales account.
Also, unless the transaction sell value is the same as the average stock
value, you will force your stock general ledger to be out of balance with the
stock total as recorded in the product file. This does not apply to cancelled
transactions, which MoneyWorks will handle correctly for you.

Posting stock transactions with Enable Job Costing & Time
Billing

If you have set the Enable Job Costing and Time Billingin the Job preferences
and you have entered a job code into the job column of a transaction detail line
involving a stocked item, it is assumed that the item is being purchased for
direct use in the job and is not going into stock. If the item is being sold, it is
assumed that its use has already been accounted for in the job sheet file (where
a stock requisition journal was created).

Therefore when the transaction is posted it is not put into stock. Thus:

• The product file is not updated in any way.
• If the item is being purchased, the Expense Account when buyinggeneral
ledger account is debited. This expenses (along with other job expenses)
can be transferred to a current asset by use of the Work-In-Progress Journal
command.

• If the item is being sold, the Income Account when Sellinggeneral ledger

account is credited.

Note: There is one exception to this. When a purchase order is made out to a
job and the goods are received before the invoice, they will be placed into
stock and need to be manually requisitioned —see The goods are received
before the invoice. A warning is displayed in the Process Order screen in this
situation.

Negative stock

If you post a transaction involving inventoried items and if there is insufficient
stock on hand to fulfil the transaction’s stock requirements, the stock on hand
for the item will become negative, and the following will apply:

• The value of the negative stock will be based on the current average value

(or the buy price, if the stock level started at zero).

• When the stock is replaced, the transaction that replenishes the stock will
also automatically adjust the cost (and stock valuation) for the out of stock
items if the replacement price is different from the value used when they
went out of stock.
Items, Products and Inventory

Stock Journals

The result is that when you once again hold non-negative values of the item, the
correct accounting entries have been made by MoneyWorks.

Note: You can control who can put inventory into negative stock with a script.

Stock Valuation

The value of the items in stock will always be reflected in the balance of the
stock account. Two “values” are held for each individual product: the buy price
and the total stock value. Both these figures are automatically adjusted
whenever you purchase stock. The buy price represents the latest price that you
paid for the item, and the stock value is the total of what was paid for the stock.
The average price is always the total stock valuation divided by the stock on
hand. If you start off with no items, the average price will be the same as the
buy price.

Example You buy 5 units of a new stock item for $10 each. The buy price is $10,
the stock value is (5 * 10) = $50, and the average cost is 50 / 5 = $10. You
then purchase 5 more for $12. The buy price is now $12, and the stock
value increases by (5 * 12) = $60 to $110. The average cost is now 110 / 10
= $11.

Write-Off: This is used to write off stock. The value of the listed items will be
written off to the nominated general ledger account (usually an expense
account). Use this when your stock reduces through means other than sales
(e.g. shrinkage, obsolescence etc.). Stock requisitions made through the job
sheet file will automatically create a write off journal against the item’s cost-
of goods account.

Create: This is the opposite of a write-off journal. It creates the specified

products and puts them into stock. The nominated general ledger account
code is credited—this will normally be an income account.

Revalue: This is used when the value of a stock item changes. The new value
(per unit) is specified, and the stock account is debited (or credited if the
value is reduced) with the difference. The nominated general ledger
account is credited (or debited) with the difference.

Transfer: This is for fixing botch-ups in the handling of serial numbers, batches
and location (e.g. stock is receipted into the wrong location; the serial
number on an item is wrong). For further information see Stock Tranfers.

Entering a Stock Journal

The average cost is used as the cost of goods when stock is sold. The buy price
represents replacement cost.

1.

In the Transactions list, select the Journals sidebar tab and click the New
toolbar button or press Ctrl-N/⌘-N

Stock Journals

The Journal entry screen is displayed.

A stock system is always difficult to maintain. Unexpected things can happen.
For example, some stock items may decay or be destroyed, some may vanish
altogether, while some may spontaneously appear (presumably due to
miscounting at stocktake time). The accounting for these is done by means of
stock journals, of which there are five types:

Make: This builds the quantity of the nominated product from the specified
components. If you use the Build command to create a product, or if a
product is Auto-Built, a Makejournal is created automatically.

Break: This is the opposite of a Makejournal. The product is “disassembled”

into its components.
Items, Products and Inventory

2. Enter the transaction date and description

3. Click on the tab that represents the type of journal you need

The entry screen will change depending upon the type of journal.

The information required for a stock journal depends on the type of journal.
Each journal type is discussed separately below.

MakeJournal

A Makejournal (shown above) manufactures a quantity of a stocked item from
the specified components. This will increase the stock on hand of the product
manufactured and decrease the stock of each stocked component.

1. Enter the product code of the item to make into the Productfield

Stock Journals

When the Makejournal is posted, the stock quantity of the item being produced
is increased by the amount given, and the quantities of the components are
decreased. In addition, the stock general ledger code for the produced item is
debited by the Total Transfer value. If a component is stocked, its stock account
is credited, otherwise its cost of goods account is credited. The average unit
value of the manufactured item is also recalculated.

Tip: The Auto Make Journalscript, if activated, will automatically fill the journal

with the components of a built item, potentially to several levels of
componentry, if installed and activated. See Scripts.

Note: If you are using location tracking, the stock will be built into , and the

components taken out of, the default (empty) location. Use a Stock Transfer
Journal if you want to specify locations.

Note: If the finished item, or any components, are serialised, you will need to

use a Stock Transfer Journal.

This must be a stocked item. If you enter an invalid product code the
choices list will be displayed.

BreakJournal

2. Enter the quantity you wish to manufacture in the Qtyfield

3.

In the Item Codefield of the detail line enter the code of the part that will
be used

The part must be stocked or purchased. If it is out of stock a warning will be
displayed (but you will still be able to post the journal).

4.

In the Qtyfield of the detail line, enter the quantity required of the first
component that is used in the product creation

You cannot alter the unit value or extension fields—these are determined
by the value of the components you are using.

5.

If other components are used, press ↩↩/return to add another detail line
and enter the additional details.

6. When all the details are correct, click OK

A Breakjournal is the opposite of a Makejournal. It disassembles a quantity of a
stocked item into specified components. This will decrease the quantity of the
item being disassembled and increase the quantity of each stocked component.

1. Enter the code of the item you are disassembling into the Productfield

This must be a stocked item. If you enter an invalid product code the
choices list will be displayed.

2. Enter the quantity you wish to disassemble in the Qtyfield
Items, Products and Inventory

Stock Journals

In the Qtyfield of the detail line, enter the quantity of the first component
that will be created

the items

3.

4.

2.

In the Codefield of the detail line enter the product code of the product
that is being written off

The product must be a stock item. The unit value and extension fields are
determined by the value of the items being written off.

In the Qtyfield of the detail line, enter the quantity of the first item that is
to be written off

If other products are to be written off, press ↩↩/return to add another
detail line and enter the additional details.

3.

4.

5. When all the details are correct, click OK

When the Write Offjournal is posted, the stock quantity of each item being
written of is decreased by the amount given (based on the average unit value at
the time of posting the transaction), and the stock general ledger account for
the items is credited by the value. The nominated contra account is debited by
the total amount written off.

Note: If you have Stock Location Tracking or Serial/Batch Number tracking
turned on, additional columns will appear in the journal for recording
serial/batch numbers and/or locations.

CreateJournal

A Creationjournal is the opposite of a Write Offjournal. It creates quantities of
stock, increasing the stock holdings for the nominated items and crediting the
increase in stock value to the nominated account.

In the Item Codefield of the detail line enter the code of the product that
will be created

The product must be a stock item, or one that is purchased.

5.

If other components are created, press ↩↩/return to add another detail
line and enter the additional details.

6. When all the details are correct, click OK

When the Breakjournal is posted, the stock quantity of the item being
disassembled is decreased by the amount given, and the quantities of the
inventoried components are increased. In addition, the stock general ledger
account for the disassembled item is credited by the Total Transfer value, and
the stock accounts for the components are debited (or, for unstocked
components, the cost-of-goods account). The average value of the components
will also be recalculated.

Note: If any of the items are serialised, or you want to use a location different
from the default location, you will need to use a Stock Transfer Journal.

Write OffJournal

A Write Offjournal removes items from the stock system, so they effectively
cease to exist. This decreases the stock holdings for the items. The loss in the
stock value is debited to the nominated contra account.

1. Enter the account code (normally an expense) to be debited by the loss of
Items, Products and Inventory

Stock Journals

1. Enter the account code which will be credited by the increase in the value

of the stock into the Contra Acctfield

2.

In the Codefield of the detail line enter the product code of the product
that is being created

The product must be a stock item.

3.

In the Qtyfield of the detail line, enter the quantity of the first product
that is to be created

4.

In the Unit Valuefield, specify the value of the item being created

By default, this will be the stored buy price of the item (if any).

5.

If other products are to be created, press ↩↩/return to add another detail
line and enter the additional details

6. When all the details are correct, click OK

When the Creationjournal is posted, the stock quantity of the each item being
created is increased by the amount given, and the stock general ledger account
for the items is debited by the value. The nominated contra account is credited
by the total amount of stock being created. The average unit price of the
products are also recalculated.

Note: If you have Stock Location Tracking or Serial/Batch Number tracking
turned on, additional columns will appear in the journal for recording
serial/batch numbers and/or locations.

RevalueJournal

A Revaluationjournal revalues the nominated stock items. The change in the
value of the stock is credited or debited (depending on whether it is an increase
or a decrease) to the nominated contra account.

1. Enter the account code which will be adjusted by the change in the value

of the stock into the Contra Acctfield

2.

In the Codefield of the detail line enter the code of the product that is
being revalued

The product must be a stock item—its description and current unit value
will be displayed. You cannot alter the current unit value field. The net
change is the difference (multiplied by the stock quantity on hand) between
the old current unit price and the new unit value you enter.

3.

In the New Unit Valfield, enter the revised unit cost

The change in value in your stock for the item is calculated and displayed in
the Net Changefield. If you have no stock the net change is zero. Negative
stock can be revalued.

4.

If other products are to be revalued, press ↩↩/return to add another detail
line and enter the additional details

5. When all the details are correct, click OK

When the Revaluationjournal is posted, the average unit price of the stock
items is altered to the New Unit Val (which is recalculated based on the stock
valuation at posting time), and the new stock value is calculated. The difference
in the new stock value is debited or credited to the nominated contra account.
Items, Products and Inventory

Building Products

If the product or parts are inventoried by location, you need to select the
location.

Building Products

You can set up a product that can be manufactured from a set of components,
known as a recipe or a bill of materials —see If you manufacture it. The
components themselves must be stocked or purchased items. You can then
manufacture the product either automatically whenever it is sold —see Auto-
Build Whenever Necessary, or by using the Build Productcommand.

When a product is built, the stock level of any inventoried components is
reduced, and the stock level of the item itself is increased. This is accomplished
by means of a Makejournal, which is created automatically.

To build a product using the Build Products command:

1. Choose Command>Build Product

The Build Products window will be displayed:

2. Enter the code of the item to be built and press tab

The maximum quantity of the item that can be built without putting any of
the components out of stock will be calculated and displayed, along with
the component parts that limit the production to this amount.

If you elect to build more items than the maximum quantity, one or more of
the components will go into negative inventory.

3. Enter the quantity to build, and click the Buildbutton

The Build Products window will close and a Make journal will be created
and posted to build the specified quantity of the product.
Building serial-tracked products or using serial-tracked parts

If the product to be built or its parts are serial/batch tracked, the Build Products
window will expand to show a list of all of the parts or finished products
requiring a serial or batch number to be specified. For finished products, you
allocate the serial number. For parts, you choose the serial/or batch number
from existing stock (the serial/batch number picker will open when you tab out
of the Serial/Batchcolumn). You can also specify an expiry date if your newly
manufactured product batch requires it.

In this case the journal will be a Stock Transfer journal, with the contra account
set to the cost of sales account of the item being built. Normally the journal will
be zero valued, but sometimes if you are building a number of serialised items
there might be slight rounding differences. In this case these differences will be
put to the cost of sales account.

Stock Enquiries

The Stock Enquiries window allows you to determine the status of any
inventoried item. You can view historic sales, purchases and transfers of the
item, ordered and backordered items, and (for stocked items) the current stock
holding. You can also “build” manufactured items.

To display the Stock Enquiry window:

1. Choose Enquiries>Stock Enquiry or press Ctrl-9/⌘-9

The stock enquiry window will be displayed:



Items, Products and Inventory

Stocktaking

Stock on hand The stock figure taken from the product record. This stock figure
is automatically maintained by MoneyWorks whenever a transaction
affecting the stock is posted.

Committed The total quantity of backordered/unshipped Sales Orders that
involve the stock item. These are listed under the Committedtab.

On Order The total quantity of all backordered/unshipped Purchase Orders
involving the stock item. These are listed under the On Ordertab.

On Transfer The total quantity of all unposted stock journals involving the item.

These transactions are listed under the On Transfertab.

Note: If the Include Unpostedoption is on, unposted stock purchases and sales

will be included in the Effective Stock calculation.

2. Type in the product code and press keypad enter, or click the Calculate

Nowbutton

To Build more of a stocked item:

The stock holdings of the item will be calculated and displayed, with the
transactions affecting the stock holding displayed in the bottom portion of
the window. The list can be sorted and summed, and you can double-click
an item in it to view or modify it

If the product code is incorrect, the choices window will be displayed.
Double click on an item to select it.

3. To view the status of another item, type in its code and press keypad-

enter

The information about the new item will be displayed.

Effective Stock Calculation

Click the Build more of this itembutton to open the Build Product
window—Building Products.

Historic Stock Transactions:

To view a list of all unpurged, complete (posted) historic
transactions concerning this product, choose Historicfrom the
Pendingpop-up menu

The historic transactions will be listed in under the tabs
Outgoing(for posted receipts and debtor invoices), Incoming
(for posted payments and creditor invoices) and Transfers(for
posted stock journals).

Viewing historic
transactions

The theoretical effective stock is calculated in the top right hand section of the
window as follows:

Stocktaking

Effective Stock = Stock on hand - Committed + On Order - On

Transfer

A stocktake is a physical count of your inventoried items, and is necessary on a
periodic basis because, no matter how careful you are, the actual items that you
hold will differ from those in MoneyWorks. You are normally required to do a
physical stocktake at year end.
Items, Products and Inventory

The stocktake facility in MoneyWorks allows you to do as many stocktakes as
you require, either in whole or in part. Larger organisations for example might
do a rotating stocktake, where a stocktake is done on one category of product
one month, another category the next month and so forth.

2.

If necessary, search the list to display just the products for which you are
doing the stocktake

Stocktaking

3. Sort the list into the required order

As of MoneyWorks 9.1, it is possible to do stocktakes on an iPhone/iPad using
MoneyWorksGo and the Remote Warehouse MoneyWorks Service.

4. Choose Reports>Stock>Stocktake List, or click Stocktake Liston the list

sidebar

Overview of a MoneyWorks stocktake

The stocktake facility in MoneyWorks takes a snapshot of your current stock on
hand and value at a point in time (normally close of business for the stocktake
day). You then need to physically count your stock (which is time critical), and,
as soon as practicable thereafter, enter this physical count into MoneyWorks.
Once this is done MoneyWorks will generate the appropriate stock adjustment
journals (i.e. the difference between the snapshot and the counted stock).

To Start a Stocktake

1. Choose Command>Stocktake>Start Stocktake

If you have Location Trackingenabled, you will need to select the location
from the report settings.

If you turn on the Show Serials/Batchesoption in the report settings, the
stocktake list will show the available batch/serial numbers at the location
and their respective count.

A list of the highlighted items (for the nominated location) will be printed,
optionally showing the stock level (at the time of the last stocktake
snapshot) and bin location, with room for entering the new stock level.

Entering your new stock counts

You can also initiate a stocktake from the Stocktake view in the Items list by
clicking the Start Stocktake toolbar icon.

A snapshot of the current stock levels is taken (and an entry made in the log
file). Only items that are marked "We stock it" are included in the stocktake.

The new stock count is entered into the Stocktake view of the Items list.

1. Choose Show>Items (or press Ctrl-3/⌘-3) and click on the Stocktake

sidebar view

2.

If necessary, search and sort the list to get the required products showing

To Print off a Stocktake List

You can print off a selection of products by highlighting them in the item List.
They will appear in whatever order they are sorted, allowing you to select and
sort according to your requirements. The Stocktake view in the items list is a
good place to do this.

1. Choose Show>Items (or press Ctrl-3/⌘-3) and click on the Stocktake

sidebar view

A list of all stocked products will be displayed

If you have Location Trackingenabled, you can choose a stock
location from the Locationtoolbar menu. The Countedcolumn
is the count for that location.

The new count can be entered directly into the Counted
column of the list. By the default, this contains the quantity of
the last snapshot, so you only need to enter the count for
products for which there is a variance.

Choose the location
from the Location
toolbar menu

3. Double click on the Counted cell of the product that you wish to amend

If the item is non-serialised (i.e. does not require a serial or batch number), the
field will highlight.
Items, Products and Inventory

Stocktaking

Enter in the new stock quantity from the physical stock count, and press
tab or enter to accept the value

If the item is serialised: The product window will open at on the inventory tab

The actual stock on hand quantities in MoneyWorks are not updated until you
Commit the stocktake, so you can interrupt the stock count updating at any
time. This allows plenty of time to enter and check that the new stock counts
are entered correctly.

Committing the Stocktake

Once you have entered and checked the new stock count figures, you can
commit the completed part of the stocktake. Again this can be done for the
entire stocktake, or just for parts of it. When you commit the stocktake,
appropriate stock write-off or creation journals will be created to adjust the
stock levels.

Note: Unless you want to do the stocktake in stages, or have different product
classes that you want to write off to different stock adjustment accounts,
you don't need to use the Commit feature—instead finalising it will have
commit all the stock adjustments for you.

To commit a partial stocktake

1.

In the Stocktake view of the Items list, highlight the records for which the
stock count has been entered (and checked)

2. Click the Commit Selected toolbar icon (or choose

Command>Stocktake>Commit Selected)

The Commit Stocktake confirmation dialog will be displayed.

Enter the count for the required batch or serial, and click OKto close the
window.

The difference from the Snapshot count will be shown in the Difference column,
and the field immediately below in the list will be selected

Note: Use the tab, enter, keypad enter or down arrow key to move down the
list; use shift-tab, shift-enter or the up arrow key to move up the list.

3. Enter the date and period in which the journal should be created

This should normally be the same period as the stocktake snapshot.
Items, Products and Inventory

4. Enter the Stock Adjustment Account

This is the general ledger code that the stock items will be written off
against. You might have a special Stock-Writeoff account for this, or you
might elect to use the cost of sales account code. When writing-off stock,
this account will be debited, and the stock asset account credited (and vice
versa for a stock creation).

5. Click the Commit button

The stock journals will be created, and the Snapshot quantity replaced by
the counted value.

Provided the stocktake has not been completed, you can (if needed)
subsequently correct the stock count by changing the counted value in the
Stocktake list and recommitting the corrected records.

To complete the stocktake

1. Click the Finish Stocktake toolbar icon in the Stocktake view of the Items

list, or choose Command>Stocktake>Finish Stocktake

The Commit Stocktake window will be displayed again (as above) so that
any remaining uncommitted stock count changes can be adjusted.

Once you have finished a stocktake, you can no longer adjust the Counted field
in the stocktake view.

Accounting Note

The stock journals will write-off the stock at the average unit price of the items
when the journal is created (and not the average cost when the snap shot was
taken). There is a good reason for this: consider you have 2 items in stock of
product X with a unit value of $3 when you do a snapshot. You subsequently
revalue these to $1 per item. You then find you have only 1 in stock and so set
the count to 1. If the original unit value was used, you would be left with one
item in stock but with a value of negative $1.

Stock creations are done at the original value if possible.
Stocktake Report

Use the Stocktake Report (in Reports>Stock Reports) to report on the status of
the current stocktake (whether it is in progress or has been completed). The
report lists the stocktake and adjustments, with an optional reconciliation back
to the general stock accounts.

Stocktaking

1 If the Append Salespersonoption is set, and the item is used in the job sheet file
with the Enable Job Costing and Time Billing option set, the department is taken
from the Cost Centre field of the job sheet entry.↩

3 The pictures go into the Pictures folder—see Managing Your Plug-insfor details↩

4 Tip: If you are dropping off some of the liquid stuff to express your thanks for such
a fine accounting system, a methuselah is better than a bottle, but a bottle is just
dandy!↩

5 This is so that there is a valid cost of goods account for correct cost accounting.↩

7 If you do inadvertently delete a product record, you can re-enter it.↩

8 You can transfer the stock using a Makeor Breakjournal, or write it off using a
stock write-off journal. Once the stock on hand is zero you can delete the product or
make it an unstocked item.↩

9 The additional options that were available in this dialog in MoneyWorks 6 and
earlier can be accessed from the Reports section of the list sidebar.↩

10 If you are importing or exporting product records, it is important to realise that
MoneyWorks stores the reciprocal of the conversion that you entered. Technically
the quantity purchased is divided by this stored conversion factor, which is the same
as multiplying by the visible factor.↩



