# Order Entry

Order Entry

Importing transactions with serials/batches or locations

For example in the transaction below we are writing off 2 chrome widgets, and
creating 3 bronze ones. The difference in value of these will be credited to the
designated contra account (stock adjustments).

Order Entry

Importing transactions with serials/batches
or locations

When you import transactions that for items that involve a serial/batch number
or location, neither the imported serial/batch number nor the location is
validated as part of the import (the assumption is that you have clean data
coming in from the other system). For purchasing serialised items this is as
expected, as the serial numbers will not exist. However for sales it is possible to
sell a serial number that does not exist (this can be corrected if necessary with a
Stock Transfer Journal). If a non-existent location is specified the stock will
placed into the bogus location (and you will need to manually create the
location in the “Stock Locations” validation list if you want to get it out again).

The order entry system allows you to enter sales and purchase orders, and
quotes for customers. As goods or services are supplied, the orders are turned
into invoices, with any goods outstanding remaining on backorder.

Purchase Orders

When you make a purchase of goods or services and where there is a delay
between ordering the items and the receipt of those items, the details of the
purchase should be recorded as a purchase order.

When the items are finally delivered, you should check the pricing against the
original order, and enter the quantity actually received. When you “process”
this, MoneyWorks will automatically create a creditor invoice, and if necessary
update your stock. Any items not delivered will be held as back-ordered items.

If, as sometimes happens, the items are received before you get the invoice, you
can receipt the items into stock and process the invoice later.

Entering a Purchase Order

To enter a purchase order:

1.

In the Transaction list, click the Newbutton or press Ctrl-N/⌘-N

A new transaction window will open.

2.

If necessary set the transaction Type to Purchase Order

Pressing Alt-Shift-8/Ctrl-Shift-8 is a keyboard shortcut for this.

The Purchase Order entry window will be displayed.
Order Entry

Purchase Orders

Specifying product details

You need to record details of each item that you are purchasing. This is done in
the detail lines of the purchase order. You need to record at least the quantity
and code of each product required. In addition it is a good idea to put on the
expected purchase price—the product description and price details are entered
automatically for you when you enter the product code.

8.

In the Product field, enter the code of the product or service which you
are ordering

This is your own internal product code or the item’s barcode—the
Supplier’s Product Code (if it exists) will be printed on the purchase order.

If you enter an invalid code (or leave the code blank), the product choices
window will be displayed. You can choose the product from this list, or click
the New button to record details of a new product.

The product description and price will be entered automatically for you. The
purchase price is taken from the product record, and (unless it has been
altered) is the last price paid for the item.

9. Enter the quantity you are ordering in the Order field

10.

If the expected purchase price is different from the last recorded buy
price, tab to the price field and enter the new price

11. Press return to add another detail line

If freight is to be included as part of the purchase price, you should specify the
expected freight charge in the freight area. In some situations you won’t know
this, so enter it when the goods invoice arrives.

Further processing of the order (for example, recording a deposit) can be
activated at this point by using the Process Orderpop-up menu at the bottom-
left of the entry screen.

3. Enter the supplier code into the supplier field and press tab

The supplier name details will be entered automatically, as will the Purchase
Order number.

If you do not enter a valid supplier code, the choices listwill be displayed
when you tab out of the field. Use this to find the correct code or to create
a new one.

4.

If the goods or services are not to be delivered to your normal address,
you can change the delivery address details

5.

In the Due Datefield, enter the date by which the order is required

6. Enter an optional description for the order

Depending on the design of your purchase order form, this may appear as
an annotation on your printed purchase order.

7. Press ctrl-tab (Mac) or ctrl-` (Win) to move to the product code field of the

purchase order detail line
Order Entry

Purchase Orders

The options in this are discussed later.

12. To print or email the purchase order at this point, click

the Printer icon next to the OKbutton

The printer icon will be displayed on the Next and OK
buttons, indicating that the purchase order will be printed
immediately one of these buttons is clicked.

Set the Printer icon
to print an order
form when you
save the order.

13.

If you have more purchase orders to enter, click Next,
otherwise click OKto save this entry and return to the order entry list

If you had elected to print this purchase order, the Print Form window will
be displayed. Ensure you set the form to the desired purchase order, then
print it.

If you clicked the Nextbutton, a new purchase order entry screen will be
displayed, otherwise the purchase order list will be shown (with the current
purchase order highlighted).

If you clicked Cancel, the purchase order is not saved.

Note: As of version 9.1.7, MoneyWorks users in Singapore are able to transmit
the purchase order directly to their supplier using eInvoicing. The purchase
order will automatically appear in the supplier's purchase order list.

When the supplier sends an invoice
for the goods, it will probably also
be an eInvoice, and appear in your
invoice list when you retrieve your
eInvoices. Because the invoice has
not been generated in the normal
manner of processing order
receipts discussed below, the order
will remain unprocessed. Use
Purchase Order Matching to
manage completion of the order and to highlight discrepencies between
the original order and the invoice.

If the order is incomplete (there are backordered or unbilled items) it will stay in
the Purchase Ordersview. Once all the goods ordered have been received and
billed, the order will move to the Boughtview.

When you re-open the order, you will see that the previously receipted
quantities of goods have been transferred to the Done column. The remaining
backorder quantities show in the B/O column, and for your convenience are also
entered into the Receive column for the next shipment you receive.

Note: Purchase orders are not accounting transactions, and hence they can be

modified or deleted at (almost) any time.

Paying a Deposit with Order

If you need to pay a deposit or prepayment invoice with the order, you can
record the details on the order. This amount is held with the order, and is
credited against the final payment.

A deposit is a payment that will be made immediately; a prepayment invoice will
be recorded as an invoice to be paid later. In either case, you will be prompted
to enter the details of the deposit or invoice when the order is saved.

To Record a Cash Deposit

1. Set the Process Order1 pop-up menu to Pay deposit for order
Order Entry

Purchase Orders

You will be prompted for the deposit details when the order is saved:

To Record a Prepayment Invoice

1. Set the Process Order3 pop-up menu to Receive prepayment invoice for

goods

You will be prompted for the details of the invoice when the order is saved:

1. Enter the deposit amount, payment method, bank and date

3. Specify the special Deposit product to use

2. Enter the supplier invoice number, date and invoice amount

These are used to make the invoice transaction. The invoice number is also
recorded in the Invoice #field of the originating purchase order.

These are used to make the payment transaction.

2. Specify the special Depositproduct to use

This will be appended to the bottom of the order to adjust the total when
the goods are received. See A Note on Deposits.

3. Click OK

A new payment transaction is created, and the amount of the deposit is
recorded in the order2.

Note: The payment transaction is not linked to the order. If you cancel the

payment the order will still record the original deposit. You can reduce (or
remove) the deposit by entering a negative deposit amount.

This will be appended to the bottom of the order to adjust the total when
the goods are received. See A Note on Deposits.

4. Click OK

A new purchase invoice transaction is created and posted, and the amount
of the invoice is recorded in the order. Note that this invoice is only loosely
attached to the order: if you cancel the invoice the deposit amount
recorded on the order will not alter. You can reduce the prepayment invoice
amount by entering a negative invoice amount in another Prepayment
invoice.
Order Entry

Receiving the Goods and Invoice

The goods are received after the invoice

Purchase Orders

When the goods or services that you ordered arrive, you need to check the
quantities and prices (if known) against the original purchase order, and mark
those items as having been received.

In this situation you would have recorded the total amount paid as a
prepayment invoice or deposit, as described previously. You would then receipt
the goods through the originating purchase order.

As of MoneyWorks 9.1, it is possible to do receipt goods directly into an iPhone/
iPad using MoneyWorksGo and the Remote Warehouse MoneyWorks Service.
The order in MoneyWorks is automatically updated with the receipted
quantities (and serial/batch numbers if appropriate).

There are three possible scenarios for receiving inventoried goods: they might
come with the invoice, before the invoice, or after the invoice. You determine
which by setting the Process Orderpop-up menu. By definition, non-inventoried
items cannot be brought into stock, and hence cannot be received before the
invoice.

1. Set the Process Order pop-up menu to Receive goods after invoice

2. Enter the quantities actually received into the received column.

You should not need to alter the prices, as these will have been entered
when the invoice was processed —see Paying a Deposit with Order.
However if these have changed for some reason, you can alter them.

3. Click the OK (or Next) button

The Order Processing window will be displayed

The goods are received with the invoice

This is the usual case, and means you can enter the quantity received and the
correct price; MoneyWorks will generate a creditor invoice (or payment if
required) for the goods, which will be brought into stock when the invoice is
posted.

1. Set the Process Order4 pop-up menu to Receive goods with invoice

2. Enter the quantity received and the pricing from the invoice

This determines the quantity and the value of goods that will be brought
into stock.

3. Click the OK(or Next) button

You will be prompted for the invoice number, date and period

4. Enter the details and click the Processbutton

A purchase invoice will be generated which, when posted, will bring the
goods into stock.
4. Enter the invoice number if necessary, the date and period in which the

goods were received, and the Deposit product

The invoice number defaults to that in the Invoice #field of the purchase
order. This will be set automatically to the number of the last prepayment
invoice. The Deposit product is used to reduce the outstanding amount of
the invoice by the value of any previously paid deposits or prepayment
invoices. You should use the same Deposit product as used when the
original prepayment was made. See A Note on Deposits.

5. Click Process to complete the goods receipt



Order Entry

Purchase Orders

MoneyWorks will create a special "Goods Received" purchase invoice to
bring the items into stock. The previous payment(s) will be netted off the
invoice, which will normally leave the invoice at zero. However if you have
altered the pricing, and this is the final shipment, there may be a balance to
pay (or a credit to claim). This will appear in your normal accounts payable.

The goods are received before the invoice

In this case you can receipt any inventoried items into stock at the expected
price. When the invoice subsequently arrives, it can be recorded (using the
Receive Invoice after Goodsprocess option in the original purchase order), and
MoneyWorks will re-adjust the value of the receipted items. Note that when the
goods are received, it is important that your estimated price is realistic (in
particular, an estimated buy price of zero is generally a bad idea as it will grossly
distort your margin).

When you receive goods prior to the invoice, MoneyWorks will generate a stock
creation journal to bring the items into stock. You will need to specify “the other
side” of this journal, which will normally be a current liability (e.g. “Unbilled
Inventory”; this is because in accepting the stock you have incurred a liability to
the supplier). Note that you cannot receipt non-inventoried items before they
are invoiced.

5. Enter the unbilled inventory account, and the date and period to receipt

the items into stock

The "Unbilled Inventory" account should be a current liability.

6. Click Process

A stock creation journal will be created to put the items into stock.

When you are subsequently invoiced for the goods, use the "Receive
Invoice after Goods" option.

Note: If you are using the job system and receive goods before invoice, the

items will go into stock and not flow automatically into the jobs. You will
need to manually requisition them.

1. Set the Process Order pop-up menu to Receive goods before invoice

2. Enter the quantities actually received into the received column

Receive Invoice after Goods

3. Check the unit price for each item

It is important that these are close to the expected purchase price, as this is
the value at which the items will be brought into stock if the current stock
on hand is zero. If there is any existing stock on hand, the items will be
brought in at the existing average unit value5.

4. Click the OK(or Next) button

Only use this when you have received the goods in advance of the invoice (i.e.
Receive Goods Before Invoice above).

1. Set the Process Order pop-up menu to Receive invoice after goods

2. Enter the quantity and the value of the items on the invoice

The quantity must be less than the already received amount. If it is greater,
you will need to process the additional goods received as a Receive Goods
before Invoice prior to processing this.

You will be prompted for the "Unbilled Inventory" account to use, and the
date and period of the stock creation journal.

3. Click the OK (or Next) button

The Receive Invoice window will be displayed.
Order Entry

Purchase Orders

1.

In the Freight Codefield, enter the product code for freight-in

Freight codes are special classes of products —see Ship Methods. Note that
any GST/VAT/Tax Override on the Supplier Name is ignored: the tax is based
on that of the Freight product.

2.

If desired, record the docket number (or any other commentary) in the
Docket field

3. Enter the (Tax exclusive) freight amount into the Freight Amtfield

A Note on Deposits

When you record a deposit on an order, MoneyWorks creates the appropriate
receipt or invoice (for a sales order) or payment (for a purchase order), and also
accumulates the deposit amount in the order itself.

When the goods are shipped/received, an additional line is added to the
resultant invoice to reduce it by the deposit amount. Because orders are
inherently “product” based, all transactions involving such deposits must use a
“Deposit” product—you need to specify this the first time you make a deposit.

• You can have different Deposit products for deposits you receive and

deposits you make (or you can just use the one);

• For deposits on Sales Orders, the Deposit product is one that you sell. In the

Income account when sellingfield of the product, you should specify a
current liability account (such as Deposits Held);

• For deposits on Purchase Orders, you must buy the Deposit product. Use a

current asset account (such as Deposits Paid) for the Cost-of-goods Expense
Account;

• Do not stock the deposit product;
• Multiple deposits can be made on an order (just open the order and set the
Process Order pop-up to Pay deposit for order). If the additional deposit is
for a negative amount, the accumulated deposit is effectively reduced.
• If you need to cancel the deposit you must put through a new negative
deposit, as the deposit amount is stored on the order. Cancelling the
deposit transaction will not clear this.

• You cannot delete an order that has a deposit balance.

4. Enter the unbilled inventory account, invoice number, date and period,

and click Process

You cannot change the invoice amount, as that has been determined by the
previous screen.

MoneyWorks will create an invoice for the items specified. The previously
receipted items will be re-processed through the stock system at the
invoiced value (i.e. they will be taken out of stock at the current average
unit value and put back into stock at the correct invoiced value). If this is the
final invoice (i.e. there are no backorders, and all items that were previously
receipted have been invoiced), the order will be marked as being complete.

Note on final invoice: When the final invoice for the order is raised,

MoneyWorks will check to see if there is a residual balance in the unbilled
inventory account due to this order. This can arise when the average unit
value of the goods has changed since the stock was initial receipted and the
processing of the final invoice. If a residual balance is detected
MoneyWorks will create an additional general journal (with a description
“Correct for changed valuations on PO xxx”) to move the residue from the
unbilled inventory into the cost of sales account.

Note: If you are using job costing, the job column on the invoice will be blank,
regardless of the setting in the original order. MoneyWorks assumes that
you have already requisitioned the items for the job.

Freight charges

If freight has been charged on the shipment, you will need to enter the freight
amount so it will be transferred to the final invoice.
Order Entry

Purchase Orders

When the order is processed and an invoice (or receipt/payment) is created that
takes up the deposit, or part of the deposit, the orderDepositfield of the invoice
is set to the amount of the deposit. The amount displayed in the Gross field will
be the total processed less the deposit. If you want to see the sale/purchase
amount excluding the deposit, customise the list with a calculated column to
show gross+orderDeposit.

Landing Costs

Landing costs are the costs incurred in transporting an item from the place of
purchase to your premises. These might include freight, insurance, duties and
more.

Landing costs should be included in the value of the stock; e.g. you might pay
$100 to your supplier for an item, but it also costs a further $50 in freight. In this
case the inventoried value of your item should be $150, not the $100 purchase
price.

Once you have determined your landing costs for an order, it is relatively simple
to spread them over your initial purchase order or supplier invoice. To do this
we basically increase the total of each line item of the invoice by the additional
landing costs (by using a negative discount), and we add a single offsetting line
to the invoice that encompasses the landing cost.

For this to work, we need to create a new "product" to enter the landing costs;
for example "LANDED". We will buy and sell this product (but will not stock it),
and it will be associated with the landed costs expense account in your chart of
accounts.

Example:

We have a purchase order with the following 2 items in it:

The total of the order is $1,750 (plus tax if applicable).

Assume that the landing costs (freight, duty etc) come to $200 (in practice these
won't normally be known until the goods have arrived). Now $200 is 11.43% of
the actual cost of the goods (200/1750 x 100), so we need to increase the value
of each item by 11.43% when it comes into stock.

To do this we simply apply a NEGATIVE DISCOUNT of 11.43% to each line of the
order, then add a new line to subtract the total landing cost so that the value of
the order remains the same. The new line is entered with a quantity of minus
one, and with the unit price set to that of the total landing cost (with no
discount). Thus we would have:

Note that because of accumulated rounding error using the discount, we might
have to adjust the value of the LANDING up or down a few cents (in this case to
200.02) to ensure the value of the order stays at the original order value. So in
this example the order still has a value of $1750.

When this order is processed (and the resultant invoice posted), the buy price of
the stock items will be set to the Unit Price (so that BA100 will have a buy price
of $10), but each item will go into inventory at a value of 11.43% higher than the
buy price (i.e. each of the new BA100 items will have a stock value of 11.143,
which neatly incorporates the landing cost).
Order Entry

Sales Orders

The actual invoice(s) from the shipping/custom agents for the freight, duty etc,
get entered separately into MoneyWorks.You can code them to the LANDING
product, or to more specific general ledger codes (which will be offset by the
LANDING general ledger code).

1.

In the Transaction list, create a new transaction by clicking the New
button or pressing Ctrl-N/⌘-N

2.

If necessary set the transaction Type to Sales Order

Tip: You can have MoneyWorks calculate the discount for you by entering the

Pressing Alt-Shift-7/Ctrl-Shift-7 is a keyboard shortcut for this.

formula directly into the discount field (for MoneyWorks to recognise a
formula it must start with an “=”). In the example above we could have
entered:

=-200/1750*100

into the discount field, and when we tabbed out MoneyWorks would have
evaluated it and substituted the result as -11.4286. We could then have
copied and pasted that value into the remaining discount fields.

Note: If your supplier is represented in MoneyWorks in one currency, and the

landed costs in another, you need to convert the landed costs entered into
the Purchase Order/Invoice into the currency of the Purchase Order/
Invoice.

Sales Orders

Use a sales order to process a sale through MoneyWorks. Sales orders integrate
into the stock system, allowing backordering of goods that are out of stock.

When you enter a sales order, it is held in the system until you are ready to ship
the goods ordered (or provide the service). At this point you specify how many
goods are being shipped, and process the sales order. The processing can be
done as the orders are entered, or as a batch some time later.

Note: If you receive purchase orders from a customer they (normally) need to
be entered as sales orders in MoneyWorks. The entry of orders (or supplier
invoices) received as PDF files can be automated using Invoice Automation,
which is available as an optional MoneyWorks Service.

Entering a Sales Order

To enter a sales order:

3. Enter the customer code into the Customerfield and press tab

The customer name details will be entered automatically.

If you do not enter a valid customer code, the choices listwill be displayed
when you tab out of the field. Use this to find the correct code or to create
a new one.

4. Enter the customer order number (if any) into the Order #field

If the Requires Order Number option is set on the customer record, you will
not be able to accept the order if this filed is blank.

5. Enter the date by which the customer requires the goods or services into

the Due Datefield
Order Entry

Sales Orders

6.

If the goods or services are not to be delivered to the customer’s normal
address, change the delivery address details —see Delivery and Mail
Addresses

7. Enter an optional description for the order

Note: If Location Trackingis turned on, the quantity in the SOH(or Avail) column
is the quantity at the designated location, not the total stock on hand.

Note: Backordered items will not be shipped, but will be held over until the

items are in stock. You can override the Ship amount if need be), but you
will be warned that you are going into negative stock.

Depending on the design of your forms, this may appear as an annotation
on your printed packing slip or invoice

11. Change the price and discount if necessary

8. Press ctrl-tab (Mac) or ctrl-` (Win) to move to the Productcode field on

the detail line

Specifying product details

You need to record details of each item that you are selling. This is done in the
detail lines of the sales order, and includes the quantity and code of each
product required—the product description and price details are entered
automatically for you when you enter a product code.

9.

In the Productfield, enter the code of the item being sold

If you enter an invalid code (or leave the code blank), the product choices
window will be displayed. You can choose the product from this list, or click
the New button to record details of a new product. If you enter the
product’s barcode here, it will be replaced by the stock code.

The product description and price are entered automatically.

10. Enter the quantity ordered in the Orderfield

If the items are stocked goods, the current stock level is shown in the Avail
field, and the amount that can be shipped (the lesser of the order and the
avail amounts) is inserted into the Shipfield, with the amount that will be
backordered shown in the B/Ofield.

Note: The quantity shown in the SOHcolumn is the actual stock quantity from
the product record. To view the available stock (i.e. stock on hand less the
quantity marked to ship on other sales orders), click the SOHcolumn
heading. The heading will change from SOHto Avail. Click on the heading
again to change back to SOH. Note that the MoneyWorks will remember
your preference for this when entering/viewing other sales orders.

The default sell price is taken from the pricing matrix in the product record,
based on the customer’s Price Code.

Note: The margin for the line being
entered (as well as for the
transaction as a whole) is
displayed for Sales Orders and
Quotes at the bottom right of the
entry screen if the Show Marginsoption in the Document Preferences is on.
This can be disabled for individual users by resetting the Show Margins
privilege.

12. Press ↩↩/return to add another detail line

If freight is to be included as part of the sale, you should specify the freight
charge in the freight area —see Freight charges.

13.

If you want to print the sales order at this point (e.g picking list, packing
slip or invoice), click the Printericon next to the OKbutton.

The printer icon will be displayed on the Nextand OKbuttons, indicating
that the order will be printed immediately one of these buttons is clicked.

14.

If you are going to accept a deposit for the order, or ship part or all of it,
set the Process Order pop-up to the appropriate action

If you have selected the Receive Deposit with Orderoption, you will be
prompted for the deposit details when the order is saved. As this is
analogous to the Depositon a purchase order (except that a Receipt is
generated), you should read the section on Paying a Deposit with Orderto
understand how deposits operate and how to alter their amount or cancel
them.
Order Entry

Sales Orders

15.

If you have more sales orders to enter, click Next, otherwise click OKto
save this entry and return to the sales order list

3. Ensure that quantities in the Ship column are correct

16.

If you had elected to print this order, the Print Form window will be
displayed. Set the form to the desired type, then print it.

These are the actual quantities that you are going to take out of stock (for
stocked items) and ship. Note that MoneyWorks will allow you to ship more
stock than it thinks you have if you override the ship quantity.

If you clicked the Nextbutton, a new sales order entry screen will be
displayed, otherwise the sales order list will be shown (with the current
order highlighted). If you clicked Cancel, the order is not saved.

4. Click OK(or Nextif you are processing more than one order)

The Process Order window is displayed.

The order you have created will remain in your sales system until either you ship
the goods or delete the sales order. Once all the goods ordered have been
shipped, the order will appear in the Soldtab.

Note: Sales orders are not accounting transactions, and hence they can be

modified or deleted at any time (provided there is no attached deposit).

Shipping Goods

You can “ship” whatever goods are available from the open order by selecting
Ship Goods with Invoicefrom the Process Orderpop-up menu. This causes
MoneyWorks to create and post a sales invoice for the items, which in turn
reduces stock levels for any stocked items.

As of MoneyWorks 9.1, it is possible to do pick goods for an order using an
iPhone/iPad using MoneyWorksGo and the Remote Warehouse MoneyWorks
Service. The order in MoneyWorks is automatically updated with the picked
quantities.

To ship the goods for a single sales order:

1. Open the sales order by double clicking it

You may be prompted to update the ship quantities (see Updating the Ship
Quantities on a Sales Orderfor what this means).

2. Set the Process Orderpop-up menu to Ship Goods with Invoice

The process icon will be displayed on the OKand Nextbutton, indicating
that the goods will be shipped when either of these buttons are clicked.

This is used to specify how the order will be transferred into a sale for
accounting purposes.

Invoice Sale: A sales invoice will be generated for this sale.

Cash Sale: A receipt against the nominated bank account will be generated.

Post: Set this if you want the resultant transaction to be posted. Inventory levels

will not be adjusted until the transaction is posted.

Transaction Details: If you want the resulting transaction to have a different

date or period than the current date, you can set these here.
Order Entry

Quotes

Include backordered... If set, a line will be shown on the invoice/receipt for

1. Highlight the Orders in the Sales Orders list

each backordered item, showing that they are backordered.

Only on first shipment... If set, the backordered lines will only be shown on the
invoice/receipt for the first shipment of the goods. Subsequent transactions
will not show the backordered lines.

Include previously shipped ... If set, any previously completed lines will be

shown on the resulting invoice/receipt. These are otherwise suppressed.

No freight charges on backorders: If set, freight (as specified in the freight

section of the order) will only be charged on the first shipment, and not on
any backordered items.

5. Set the options as appropriate and click the Processbutton

An invoice (or receipt) will be raised for the sale (and optionally posted),
causing any inventoried items to be removed from stock. If this completes
the order, it will be moved from the Sales Order tab and to the Sold tab.

Updating the Ship Quantities on a Sales Order

Between the time that an order is entered and the time you come to ship it, the
stock levels for the items on order may have changed.

When you open a sales order (e.g. by double-
clicking it), MoneyWorks will check if there are
any backorders in the order, and also check the
stock availability. If it can ship more (or less)
than when the order was saved, you will be
prompted to update the ship quantities6.

Clicking Updatewill adjust the ship quantities based on current stock availability.
Note that MoneyWorks will allow you to manually override the shipping
quantities, so that you can (if you want) ship more than MoneyWorks thinks it
has in stock. This will make the stock on hand for the item negative.

To update the ship quantities on multiple sales orders:

The orders with the highest priority should be at the top
of the list.

2. Choose Command>Ship Orders

The Ship Orders dialog will be displayed

3. Hold down the Option key (Mac) or the Shift key

(Windows), and the Process button will change to
Update

Change the Process
button to Update
by holding down
the Option key
(Mac) or the Shift
key (Windows).

4. With the Option or Shift key held down, click the Update button

MoneyWorks will update the ship quantities on the highlighted sales orders,
starting with the first highlighted order and working down.

Caution: Make sure the Option or Shift key is held down and the button is
labelled Update before clicking, otherwise you will process the orders.

Quotes

Preparing a quote for the supply of goods or services is similar to preparing a
sales order—in fact quotes and (unprocessed) sales orders are interchangeable.

To prepare a quote:

1.

In the Transaction list, click the Newbutton or press Ctrl-N/⌘-N

A new transaction window will open.

2.

If necessary set the transaction Type to Quote

Pressing Alt-Shift-6/Ctrl-Shift-6 is a keyboard shortcut for this.
Order Entry

Quotes

6. Ensure that the Use Formpop-up is set to your preferred Quote Form

before clicking the print or preview button

Note: For details on emailing the quote refer to Emailing Forms.

When a Quote is Accepted

If your quote is accepted, you can turn the quote into a sales order or into a job,
depending on what is necessary to fulfil the quote.

3. Enter the details as for a sales order

Note that there are no available, shipor backordercolumns.

To print the quote...

4. Click the Printericon next to the OKbutton.

The printer icon will be displayed on the Nextand OKbuttons, indicating
that the quote will be printed immediately when the button is clicked.

5. Click the OK(or Next) button

To turn the quote into a sales order

1. Open the quote by double-clicking

2. Click the Sales Orderradio button, and click OK

The quote will be changed to a sales order, and will be
found under the sales order tab.

To turn a quote into a job...

The Print Quotessettings window is displayed.

1. Open the quote by double-clicking it

2. Set the Process Quotepop-up menu to Create Job from Quote
Order Entry

Batch Processing of Sales Orders and Quotes

The process icon will be displayed on the OKand Nextbuttons, indicating
that the Quote will be “processed” when either of these is clicked.

• Set up list filters—see Creating Filtersso you can easily view just your

template quotes, and just your real quotes;

3. Click the OKbutton

The Create Job confirmation window will be displayed.

By default, a new job will be created with the next available job code. If you
want to incorporate the details of this quote into an existing job, select the Add
quote to existing job optionand enter the code for that job (if you enter an
invalid code, the Job choices list will be displayed).

4. Click OK

The job will (if necessary) be created against the customer in the quote. The
total of the quote (ex Tax) will be transferred to the total quoted for the job.
The individual detail lines on the quote will be transferred to the budget for
the job.

The original quote (which remains in the quotes list) is updated to show the
job number in the Analysisfield and in the job column of each line.

Quote Templates

You can use an existing quote as a template for others, allowing you to build a
library of “standard” quotes. There are various ways you can manage this, but
some suggestions are:

• Put Quotes that are templates on Hold. This means they cannot accidentally

be processed;

• Make a dummy customer for the template quotes, so they are easily

distinguishable from real ones. Perhaps even have a special colour for them;
• When you base a real quote on a template, duplicate the templateto create

a new quote, and change any details on the new quote.

Note: When you duplicate an existing quote, you will be asked if you want to

update the sell prices. Clicking Update will change all pricing on the Quote
to reflect the current prices in the product file.

Batch Processing of Sales Orders and Quotes

Sales orders and quotes can be processed individually by opening each one and
clicking on the Process icon as described above, or can be batch processed from
the list itself. This is analogous to posting transactions.

To Batch Process:

1. Highlight the sales orders or quotes to be processed

Use the Ctrl/⌘ key to make your selection.

If you are processing Quotes

1. Choose Command>Accept Quotes as Jobs

2. Click Create in the confirmation dialog box that is displayed.

A separate job and appropriate budgets will be created for each quote that
was selected.

If you are processing Sales Orders

1. Choose Command>Ship Orders

The Process Orders dialog box will be displayed—see Shipping Goodsfor
details of this. This is used to specify how the order will be transferred into
a sale for accounting purposes.



Order Entry

Batch Reordering

Note: You can only specify the sale type if you are processing a single order. If

you are processing more than one order, the sales will be treated as Invoice
sales.

Determining Backorders

There are several ways for you to determine what is on backorder:

• Double click a sales/purchase order and review the BackOrder column;
• The Product and Customer/Supplier Enquiriesare useful for ad hoc

enquiries on particular products, customers or suppliers;

• The Stock Enquirywill show the stock status (including on-order and

backorders) for a specified product;

• The Backorder Summary reports (in the Reports menu) can be done for all
backordered products, or for selected product or customers. These reports
can also show the effect of any unposted invoices;

• The Committed Stock report will show the current effective stock based on
outstanding sales and purchase orders (and optionally unposted invoices).

Batch Reordering

You can automatically generate purchase orders for products whose effective
stock is less than the products’ re-order level(s). This can be done either by
selecting a range of products, or by selecting a range of Sales Orders.

1.

In the Products list, highlight those products that you want to reorder

or: in the Sales Order list highlight the Sales Orders for which you want to

reorder stock

2. Choose Command>Reorder Products

Purchase orders will be generated for the products or sales orders highlighted.
The following applies:

• Purchase orders are only generated for bought products.
• Purchase orders are generated for the supplier in the “Usual Supplier” field.

If no supplier is specified, no order is created.

• The effective stock holding of a product is the Stock on Hand from the

product record (this will be zero for non-stocked items), plus any existing
unfulfilled purchase orders, less any unfulfilled orders. An order is only
created if the effective stock holding is less than the re-order point.
• The number re-ordered is the greater of 1) the difference between the

effective stock holding and the re-order point and 2) the re-order quantity.

• You will get an order (equal to the re-order quantity) for any non-stocked

items that you have highlighted, provided the reorder quantity greater than
zero.

• Where you generate one or more purchase orders from a single, highlighted
sales order, the purchase orders are linked (related) back to the originating
sales orders, and can be located using the Find Related command. Linking is
not possible when more than one sales order is highlighted.
Order Entry

Remote Warehousing

Remote Warehousing is MoneyWorks Service
that enables warehousing data to be submitted
from the MoneyWorks Go app for iPhone/iPad
(or other compliant third party systems). This
gives you hand-held scanners to facilitate order
fulfilment and warehouse management. It
provides the following following functions:

• Inwards Goods: Receipting of inwards

goods into a location, and the automatic
updating of the original PO in MoneyWorks
with the receipted quantities (and and
serial/batch numbers);

• Outwards Goods: Picking of a released
sales order. When a MoneyWorks sales
order is released, it can be retrieved by a
device and the picked quantities (with any
serial/batch numbers) entered. When
picking is complete the picked data is sent
back to MoneyWorks and the sales order
automatically updated.

• Stock Transfers: Transferring of stock

between locations;

• Stock Requisitions: Requisitioning an item
for a nominated job. The item is removed
from stock and entered into the
MoneyWorks job system ready for invoicing.

MoneyWorksGo Remote Warehouse

• Stocktake: Stocktake information is uploaded to the device and the stock
counts can be scanned or entered. Upon completion the stocktake counts
(including serial/batch numbers) are uploaded to MoneyWorks.

Inwards Goods

When goods arrive at the warehouse, the PO number is entered on the device.
The items and quantities received are then entered, either by scanning or keying
in the product code (or using the find facility on the device), along with any
serial/batches.
Upon completion, the receipted data is uploaded to MoneyWorks, and the PO
will turn green, indicating that the goods have been receipted in the warehouse.
Opening the PO will offer to update the received quantities with those
submitted from the warehouse.

Remote Warehousing

Note that whatever is entered as receipted goods into the device will be
submitted (and additional lines will be added to the PO if the receipted items
weren't on the order).

To facilitate the receipting, it would probably be useful to have a printout of the
original order available. If the product codes on this are also displayed as
barcodes, they can be easily scanned.

Outwards Goods

For shipping, the MoneyWorks sales order must first be released by setting the
Warehouse Statusto "Released". Released orders will appear on the the
device's screen where they can be fulfilled (once it appears on one device, its
status changes to "In Warehouse" to minimise the risk of other devices also
receiving the order).

All lines from the order are shown on the device, and the quantities picked (plus
any required serial/batch numbers) are entered. Once all available items are
picked, the details are sent back to MoneyWorks (at this point the colour of the
sales order will change to Orange if part picked, and Green if fully picked—in the
latter case the status changes to "Done").

When the order is opened in MoneyWorks, a prompt is given as shown above to
update the ship quantities with the data sent from the device.



Order Entry

Stock Transfers and Requisitions

Stock transfers initiated from a device will appear automatically in MoneyWorks
as posted stock transfer journals, and stock requisitions as a pending Job Sheet
Item. No further action is required.

Stocktake

The Remote Stocktaketoolbar button in the Items list window (which is only
visible if the user has stocktake privileges) is used to manage remote stocktakes.

There are two types of stocktake that can be undertaken from a remote device:

Full Stocktake: Where a stocktake is started in MoneyWorks, the count can be
done on the device by tapping the Start Stocktake button. The submitted
item count will be processed into the Counted field of the stocktake when
actioned in the Remote Stocktake Management window.

Quick Stocktake: This allows a stocktake of selected items only. The items are

selected in the Remote Stocktaketoolbar button, but the item count will be
submitted as a stock transfer journal.

When the Remote Stocktaketoolbar button is clicked the Remote Stocktake
Window is displayed. Apart from the Stock Adjustment account (a required
general ledger account for items being created or written off), the window is
divided into two parts, depending on the type of stocktake being performed:

Remote Warehousing

For a full stocktake, you can process submitted item counts for a specified
location, or all locations, using the Updatebutton. This takes the submitted date
and updates the Counted field in the normal MoneyWorks stocktake list. If the
counted data has been emailed (which is one of the options in the remote
warehousing stocktake), it can be imported using the Importbutton..

For a quick stocktake, you need to identify the items to be included in the
stocktake. This is done by highlighting the items in the list beforeyou open the
Remote StockTake Management window, and the highlighted items can be
included in the quick stocktake by clicking the Markbutton (the items will be
added to any already marked for the stocktake). The Showbutton will display
the marked items, and the Clearbutton will clear any that are marked (it will not
clear it of any devices that have started a quick stocktake). If the counted data
has been emailed (which is one of the options in the remote warehousing
stocktake), it can be imported using the Importbutton.

The remote warehousing allows the emailing of stocktake data which can be
imported via the Remote Stocktake Management window. This is intended as a
backup regime for long stock takes which might take several days, and if the
device is lost/broken in the meantime it would be problematic for stocktake
integrity. However there is no reason that stocktake data prepared from other
sources (such as a spreadheet) cannot be imported in this manner provided it is
in the correct format.
