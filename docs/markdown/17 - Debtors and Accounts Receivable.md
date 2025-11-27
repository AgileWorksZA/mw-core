# Debtors and Accounts Receivable

Debtors and Accounts Receivable

Debtors and Accounts Receivable

Entering Sales Invoices

A debtoris someone who owes you money, normally because you have invoiced
them for goods or services supplied. The invoice details what they owe and why.
The process of managing debtors is often referred to as Accounts Receivable.

Note: This chapter does not apply to MoneyWorks Cashbook which does not

support debtors.

Operating a Debtors ledger involves up to 5 distinct processes:

• Enter the Sales Invoices
• Post the Invoices to update the balances in the debtors ledger and the

general ledger

• Print/email Invoices and send them to customers
• Process Debtor Receipts when the debtor makes payment. This updates the

balances in the debtors ledger and the general ledger

• Optionally Print/email/eInvoice and Age Statements

Each Sales Invoice transaction credits the accounts specified in the transaction
and debits the appropriate Accounts Receivable account (as specified in the
debtor record)—you don’t need to worry about this, as MoneyWorks does all
the accounting for you.

Note that there are several options in the Document Preferences which apply
directly to Sales Invoices such as your standard payment terms, an automatic
credit hold feature for overdue debtors, and the sequential invoice number —
see Sequence Nos.

To create a new sales invoice:

1.

In the Transaction list, click the Newbutton or press Ctrl-N/⌘-N

A new transaction window will open.

2.

If necessary set the transaction Type to Sales Invoice

These processes are described in this section.

Pressing Alt-Shift-4/Ctrl-Shift-4 is a keyboard shortcut for this.

Sending Invoices

When you provide some goods or services to a customer you normally expect to
be paid. Sometimes the customer will pay immediately, in which case you treat
the transaction as a Cash Sale — see Entering Receipts. On other occasions you
will give the customer an invoice indicating how much is to be paid and he or
she will pay at some future date. In this situation you would use the debtors
ledger to record the transaction as a Sales Invoice.

Note: In MoneyWorks Gold, if you recorded the sale using a Sales Order and

processed it using the Ship command, you do not need to enter the invoice
again—the invoice will have been automatically created for you when you
shipped the goods — see Shipping Goods.
Debtors and Accounts Receivable

Sending Invoices

An invoice number will be automatically assigned to the transaction in the
Invoice # field. The invoice number sequence is set in the Document
Preferences dialog box. When you first start using MoneyWorks, it will be
000001—you may want to reset the sequence in the Preferences — see
Sequence Nos.

3. Enter the code for the debtor into the Debtor field

The details of each debtor are stored as a Name record — see Names, and
each is uniquely identified by the code.

5.

If you want to override the prompt payment terms, click the downarrow
next to the Due Date field

The Discount Termswindow will open. Change the settings and click OK to
change the terms for this invoice only.

6. Enter the customer order number into the Order #field

If the Debtor already exists: If you have used the debtor code before, the name

of the debtor will automatically appear in the Tofield.

You can store up to 13 characters in this field.

If you are unsure of the code, either key in a part of the code or press the
tab key. The choices list will display a complete list of debtors and
customers. Double-click on the correct one.

You can "drill down" to see and change the debtor information by clicking
on the down arrow next to the debtors field.

If the Debtor is a new one: If the debtor is not already in your system, you will

need to create a new debtor record. To do this, enter a code for the new
debtor and press tab. As the code will not be found the choices list will be
displayed. Click the New button to create the new Names record — see
Entering details of a Names record.

If the Customer is a branch: If the customer is a branch, use the branch code. If
you have set up the corresponding head office correctly, you will be able to
receipt money paid by the head office against the branch invoice.

Note: The invoice will be in the currency associated with the debtor.

4. Tab across to the Datefield and replace the date if necessary

By default, this will contain today’s date or the last date used.

If this customer is eligible for a prompt payment discount, details of this will
be shown next to the Due Date field. The prompt payment is based on the
transaction date, not the payment date.

7. Tab through the company name which has been copied from the debtor

record into the Tofield

Usually you will not need to alter this.

If the Address is different: If the goods are to be sent to an address that is

different from the normal address of the debtor, you can enter a delivery
address for this invoice — see Delivery and Mail Addresses.

8.

If the address is hidden, click the Address Disclosureicon

The address fields will display.

9. Set the Delivery Tocheck box and type in the new

delivery address

Use the return key to split the address over more than
one line.

Alternatively, you can click the Deliver to... button to show
the Names choices window, and select the delivery
address from an existing customer or supplier.

10. Enter a description for the invoice into the Description

field

Mac and Windows
disclosure icons

Set the Deliver To
check box to type in
the delivery
address, or click the
Deliver to... button
to select an existing
address.
Debtors and Accounts Receivable

Sending Invoices

This description is shown in the transaction list window and helps you
identify the transaction. Depending upon how your invoice form is
designed, it may also appear on the printed invoice.

Note that if the Auto-Calculate Transaction Totaloption is off in the
Document Preferences, the OK and Next buttons remain dimmed until the
transaction Amount and the total of the detail lines balance.

11.

[optional] Enter the invoice total into the Amountfield

15. When the transaction is complete click Nextor press keypad-enter

This amount will be in the currency of the debtor.

If the Auto-Calculate Transaction Totaloption is on (which it will be by
default) in the Document Preferences, you will not need to fill in the
Amountfield for sales invoices—it will be calculated for you based on the
values in the detail lines of the invoice transaction. This means that your
invoices do not have to be pre-calculated before you can enter them.

If this option is off, the OKand Nextbuttons dim when an amount is
entered into the Amount field. The transaction is not complete until the
total amount is allocated to one or more accounts.

12.

If the customer is making a deposit at the time of purchase, set the
Depositcheck box

The Make Depositwindow will be displayed when you accept the
transaction. Note that if the deposit box is set, the invoice will be posted
when you click OKor Next.

13. Check the due date for payment in the Due Datefield

The due date for the invoice is automatically calculated based on the
payment terms set in the debtors name record, but can be overridden.

14. Press Ctrl-tab (Mac) or Ctrl-` (Win) to move to the first detail line

The gross total for the invoice needs to be allocated to one or more
accounts before the transaction can be entered. Create a new detail line for
each account or product to be credited with part of the total amount.

To find out how to enter detail lines by account code or by product code —
see Entering Detail Lines.

The transaction is saved a new one is displayed. Click the OKbutton if this is
the last transaction to be entered.

Credit Notes

In MoneyWorks a credit note to a customer is entered as a negative sales
invoice—the window title will change to Debtor’s Credit Note. It will (when
posted) appear in the receivables list until it is offset against another invoice
from the same debtor — see Contra Invoices.

For a credit note involving products, you should enter a negative quantity—if
these are stocked items, they will be brought back into stock (at their current
stock average value) when the credit note is posted.
Debtors and Accounts Receivable

Receiving a Deposit

Sometimes a customer will part pay for the goods when he or she is supplied
them. Such a part payment is called a deposit.

To record a deposit when creating an invoice:

1. Fill out the details on the invoice in the normal manner,

but make sure the Depositoption is set

The post option will be automatically set when you set
the Depositoption—transactions involving a deposit must
be posted.

To record a deposit
when raising an
invoice, set the
Depositoption.

2. Click OKor Next(or press keypad-enter)

The Enter Depositwindow will be displayed.

Sending Invoices

3. Enter the Deposit Amount

This must be no greater than the invoice total.

4.

If necessary enter the Payment Method

Cash receipts (i.e. the folding stuff) are amalgamated into a single total on
deposit slips printed using the Bankingcommand.

5. Set the Bank Accountand other details if necessary

6. Click OK

A partial payment for the amount indicated will be automatically created
and posted.
Debtors and Accounts Receivable

Sending Invoices

If No Depositis clicked, the partial payment is not created (although the
original invoice will still have been posted).

Note: The tax handling of prompt payment discounts is determined by the PPD

Preferences, and varies from country to country.

Overriding the Prompt Payment Terms

Putting a Sales Invoice on Hold

The default prompt payment terms for an invoice are taken from the Prompt
Payment details on the customer/supplier Name record. To override these for a
particular invoice:

MoneyWorks has several ways to help you manage debtors who may be
overdue in paying accounts or over their credit limit.

1. Click the Down Arrow icon next to the Due Date

The Discount Terms window will open

When an invoice is put on hold—that is, the Holdcheck box
on the invoice is checked—MoneyWorks will not allow the
invoice to be posted.

If you also want subsequent invoices for the debtor to
automatically be put on hold, set the Holdoption in the Name
record. If the Auto Credit Holdcheck box in the Preferences
dialog box has been turned on, you will be alerted as you enter a transaction for
a debtor that has an invoice outstanding beyond the number of days you specify
or is over the credit limit specified in the Debtor record. (A zero limit is assumed
to be unlimited.)

Setting the Hold
check box means
the invoice cannot
be posted.

2. Turn on the Special discount for this invoice option

3. Set the prompt payment term and discount percent

4. Click OK

The special terms will be recorded for this invoice only.

You can reinstate the default terms by re-opening the Discount Terms window
and turning off the Special discount terms option.

Note that the Prompt Payment details can be overridden only for users for
whom the Override Pricing and Terms privilege has been set.
Clicking Hold in either of these instances will set the Hold check box for the
invoice. This can also be set manually.

Invoices on hold cannot be posted.



Debtors and Accounts Receivable

Printing and emailing Sales Invoices

There are two ways to print/email sales invoices:

• By setting the Printoption on while the transaction is open on the screen.

When the transaction is accepted, the print process will commence;
• By highlighting the invoice(s) in the Transactions list and choosing Print

Sales Invoice from the Command menu (or press Ctrl-[/⌘-[), or clicking the
Print Invoice toolbar button.

Note: Users who have the MoneyWorks Privilege option Print Unposted Invoice
turned off will not be able to print an invoice unless it has been posted.

Note: Transactions that have been printed (or emailed) have a printer icon in

the P (for Printed) column of the Transactions list. Click on the field heading
to sort the invoices—the unprinted invoices will be at the top of the list if it
is sorted in descending order.

Another way to send invoices is to eInvoice using the PEPPOL standard (not
available in all countries). E-invoicing means that the invoice you send will
automatically appear in your customer's accounting system (even if they are not
enlightened enough to be using MoneyWorks), provided that the customer is
also using e-invoicing. See E-Invoicing.

When printing/emailing an invoice, the Print Sales Invoices window will open.

1. Choose the form to be used for formatting the invoice from the Use Form

pop-up menu

Sending Invoices

2. Enter any text in the optional Message edit box

This message will be printed on all the invoices being printed. You can type
up to 80 characters into this edit box.

3. Check the Print “Copy” if Already Printedoption if you are reprinting an

invoice

If this option is checked and the invoice has already been printed, the words
“Copy of” appear next to Tax Invoice1. This is useful if the debtor requests
another copy of the invoice.

If the invoice has not already been printed this is ignored.

Note: If this is the first time that you have printed an invoice, you should click

the Layoutbutton to check the positioning and paper size.

4. Click Printto print the invoice

The standard Print dialog box will be displayed, allowing you to set the
number of copies.

If you are using a Plain invoice, and if the Print this Logoand/or Print
Address & Phone Nosoptions in the Company Setupwindow have been
checked, the company logo and/or address details will be printed at the top
of the invoice. You may want to print the invoice on letterhead which
contains these details. In this case, you should ensure that the options are
off and that the top margin in the page setup is large enough that your
letterhead is not overprinted.

For further information on printing see Printing Invoices, Receipts and other
Transaction Forms
Debtors and Accounts Receivable

To email invoices

1. Choose your invoice from the Use Formpop-up, select

the email output option and click Send

The Mail Attachment window will be displayed.

2. Proceed as described in Emailing Forms

Creating Multiple Sales Invoices

The Duplicate Multiplecommand is used to generate multiple copies of a sales
invoice. This is useful where you have a standard invoice that needs to be sent
to a large number of debtors. A school sending invoices to all its pupils for
school fees, or a business invoicing subscribers to a service are examples of this.

1.

In the Sales Invoice tab view of the Transactions window, highlight the
invoice to be used as a template

You can only use the Duplicate Multiple command in this tab view.

This invoice transaction should contain all the details that need to be
duplicated for a number of other debtors.

2. Choose Edit>Duplicate Multiple

The Duplicate Multiple window is displayed. All the debtors in your file
(excluding templates) will appear in the list.

Sending Invoices

3. Highlight the debtors for whom you require a duplicate copy of the

invoice

Use the Shift or Control/Command keys to select a number of debtors. The
number of invoices that will be created is displayed at the bottom left of the
list (the other number is a count of the Names record showing in the list).

If you have a large number of debtors on file, click the Find button to search
the debtors that match some defined criterion.

4. Click the Duplicatebutton

An unposted copy of the highlighted invoice will be generated for each of
the highlighted debtors. The date and period for the new invoices will be
the same as that of the original.

Click the Cancelbutton to cancel this process.
Debtors and Accounts Receivable

Receiving Payment for Sales Invoices

The new invoices are unposted and can be modified or deleted as necessary.

Receiving Payment for Sales Invoices

When you issue an invoice, you expect that at some time in the future it will be
paid. There are two ways such payments can be handled in MoneyWorks:

• As a receipt coded against the debtor in question;
• Using the <EquationVariables>Batch Debtors Receipts</EquationVariables>
command. This is the efficient way to enter a large number of receipts at
one time.

Note: If the receipt is being made for an already issued invoice, all you need to
do is tell MoneyWorks how much of the invoice has been paid. So you are
not allocating the receipt to any income accounts; instead you are assigning
it to one or more existing invoices.

If you have just one or two invoice receipts to process you can use the receipts
entry screen. In general, it is faster to use the Batch Debtors Receiptscommand.

Note that the Receivablesview in the Transaction list shows a complete list of
posted invoices that have not been fully paid.

Invoice Receipts as Receipt Transactions

If you have just a few invoice receipts to process, use the following method:

1. Create a new receipt transaction

This is essential so that MoneyWorks can check for outstanding invoices for
the debtor. The Fromfield will be automatically filled in with the customer
name, and a list of outstanding invoices will be shown under the Payment
on Invoicetab.

If the payment is from a head office, enter the head office code—any
invoices made out to it or to any of its branches will be made available for
paying — see Head Office Billing.

3. Check that the bank account and date are set correctly

To do this you should have the transactions window topmost and press Ctrl-
N/⌘-N., and if necessary set the type of the new transaction.

If you are not going to bank the money immediately, you should receipt the
money into a banking holding account and use the Banking commandwhen
you actually bank the money.

Tip: To receive payment against a particular invoice, right-click on the invoice in

the Receivables list and choose Receipt this Invoice.

If you leave the Description field blank, MoneyWorks will put in a list of the
invoices you are paying when the transaction is saved.

2. Click the Customercheck box and type in the debtor code

4. Type the amount of the receipt in the Amountfield

5. Set the payment method in the Paid Bypop-up menu
Debtors and Accounts Receivable

Receiving Payment for Sales Invoices

If you don’t care about the payment method you can leave this set to None.
However if you are using the Banking command to print a deposit slip, you
will want to differentiate cash from cheques.

To record the cheque/credit card details:

6. Click the down arrow next to the Paid By pop-up menu

If the Paid By pop-up menu is itself highlighted, you can press Ctrl-
downarrow/⌘-downarrow.

The Receipt details screen will be displayed—the details of this depend on
whether you are processing a credit card or another form of payment.

Enter the details of the receipt. Note that you only need to enter the
cheque/card details if they differ from those stored on the customer record
(as displayed next to the customer code).

7. Press Ctrl-tab (Mac) or Ctrl-` (Win) to move to the Paycolumn of the first

invoice

8. Allocate the Amount to the outstanding invoices

See Allocating Receipts to Invoicesfor details.

9. When all the money has been allocated, click the OKor Nextbuttons to

accept the transaction

Clicking Cancelwill discard the transaction.

Note: The receipt transaction will be automatically posted. You will not be able
to change it once it is accepted, although if it is incorrect you will be able to
cancel it and reprocess the receipt.

If some of the invoices are marked to be written-off or you have allowed prompt
payment discounts, the following dialog box will be displayed when you click the
OKor the Nextbutton:
Debtors and Accounts Receivable

Receiving Payment for Sales Invoices

When you click the Acceptbutton, a Receipt transaction is created for each
receipt that you have entered. These debit the specified bank account (which
you nominate in the Confirmation dialog box after you click Accept) and credit
the accounts receivable account(s) for the debtors (and adjusts each debtor’s
balance accordingly).

Note:

All receipts in a batch must be in the same currency.

1. Choose Command>Batch Debtor Receipts... or press Ctrl-R/⌘-R

The Batch Debtor Receipts window appears.

You need to nominate the writeoff and/or the prompt payment discount
account (if you cannot remember the code, press tab to display the account
choices). Click Accept & Postto process the receipt, or Cancelto take you back
to the receipt window.

Batch Debtor Receipts

Use the Batch Debtor Receiptscommand in the Commands menu to enter a
batch of payments for debtor invoices. This allows you to enter, print and, if
necessary, correct any errors before committing (whereas individual receipts
must be posted immediately). A restriction is that you cannot enter more than
one receipt for the same debtor in the same batch2.

When you enter the debtor code, a list of all the outstanding invoices for that
debtor is displayed, enabling you to allocate the total cheque amount as
payment received for particular invoices. Partial payments, prompt payment
discounts, overpayments and underpayments can all be catered for. You can
modify any of the receipts entered in the session to correct mistakes.

2. Enter the debtor code or invoice number into the Debtor/Invoicefield and

press Tab

All outstanding invoices that are not on Hold for the debtor will be listed.
Debtors and Accounts Receivable

Receiving Payment for Sales Invoices

See Allocating Receipts to Invoicesfor details.

7. When the amounts have been distributed to each invoice being paid, click
the Enterbutton, or press the keypad-enter key on the keyboard to enter
these invoice payments

The information entered for this receipt is added to the summary list at the
bottom of the dialog box and the fields at the top of the dialog box are
cleared ready for you to enter the next receipt.

If the amount allocated to the invoices is greater than the cheque amount,
the Enterbutton will be dimmed.

If the allocated amount is less than the cheque amount, the balance will be
credited to the debtor’s account as an overpayment. Debtors with
overpayments have a “•” in the O/P column in the debtors list. This balance
can be reallocated against future transactions for that debtor. See the next
section for more information.

If the debtor has overpaid or underpaid by some trivial amount, you may
want to “write off” the difference. This will also be the case if you have
offered a prompt-payment discount and the customer has taken advantage
of it— see Write Off Option.

Using a Previous Over-payment to Pay a New Invoice

Next time you come to enter a receipt for a debtor who has previously overpaid,
a dialog box will appear to inform you that there are unallocated overpayments,
and showing these in a list.

If the payment is from a head office, enter the head office code—any
invoices made out to it or to any of its branches will be made available for
paying - see Head Office Billing.

If you type in an invoice number, MoneyWorks will recognise it as such and
will replace it with the code for the debtor to whom the invoice was sent. If
you want to enter an invoice number that happens to be the same as a
debtor code, you need to click the Invoiceradio button to force
MoneyWorks to treat the number as an invoice rather than as a debtor
code.

If you are not sure of the debtor code press Tab to bring up a list of debtors,
then double-click on the desired debtor to enter it.

At this point, MoneyWorks will enter the debtor code into the Receipt Nº
field. If you want serial receipt numbers to be entered instead, just overtype
this with the number. MoneyWorks will automatically increment the receipt
number for the next receipt that you enter. Receipt numbers can be
prefixed by one or more non-numeric characters (e.g. CR101).

If you choose the Process Debtor Receipts command while you have some
highlighted debtors in the Names list, MoneyWorks will automatically fill in
the Debtor code in the Debtor Receipts dialog box for you. When you press
keypad-enter after each receipt, the next code will be entered ready for the
next receipt.

3. Enter the total cheque amount into the Amountfield

This amount will need to be allocated to the unpaid invoices— see
Allocating Receipts to Invoices.

4. Enter the receipt date into the Datefield

This is used to calculate the prompt payment discount.

5. Select the Payment Method

If paying by cheque or credit card, you can enter the cheque/card detailsby
clicking the down arrow next to this menu.

6. Allocate the Amount to the outstanding invoices
Debtors and Accounts Receivable

Receiving Payment for Sales Invoices

The debtor code, cheque total, receipt number and list of invoices with
allocated payments appear in the top part of the dialog box.

2. Click on or Tab into the field to be changed and enter the new data

Enter New Receipt If you click Enter New Receipt, you will be able to enter a
receipt as normal. The overpayment will not be used to pay invoices.

Use Previous Surplus If you click Use Previous Surplus, MoneyWorks will fill in

the receipt Amount field with the value of the overpayment that is
highlighted in the overpayment list (only one overpayment may be
highlighted). You can then use that amount to pay or partially pay one or
more of the new invoices for the debtor. If you actually have a new cheque
from the debtor as well, you will need to enter it as part of a new batch of
receipts (do this by choosing the Process Debtor Receipts command again
after you have accepted this batch).

You can click Cancelif you want to go back and process a different debtor.

When the changes have been made click the Enter button, or press the keypad-
enter key on the keyboard to enter the changes

Modifying Receipts That Have Been Entered

Printing an Allocation Summary

Until you click the Accept button, the receipt data that you have entered is not
permanently stored. You can modify the information just as you can modify
unposted transactions.

To modify the details for one of the receipts that you have entered:

When you have finished entering a batch of receipts, you may wish to print an
allocation summary. If you require a bank deposit slip, you should receipt the
money into a banking holding account and print the deposit slip from the
Banking command when you actually bank the money — see The Banking
Command.

1. Click on the receipt in the summary list (bottom of the window)

1. Click the Printbutton
Debtors and Accounts Receivable

The summary will list each receipt and the invoice(s) it paid.

Accepting the Batch of Debtor Receipts

When you have entered all of the receipts, you need to Accept the batch. This
will create the actual Receipt transactions and automatically post them.

1. When all the receipts have been entered, click the Acceptbutton

If you are not going to bank this money immediately, choose a Bank Holding
account into which to place the money. Use the Banking commandwhen
you finally bank the money

Receiving Payment for Sales Invoices

3. Select the period into which the receipt transactions will be posted

This will default to the current period, as determined by today’s date. Every
receipt in the batch, regardless of the individual receipt date, will be posted
into this period.

The Acceptbutton will be disabled if there is an unfinished receipt in the
top half of the dialog box.

4.

If required, set the Analysis field

A confirmation dialog box appears.

This is an optional batch number that is placed into the Analysis field of
each receipt in the batch. By default MoneyWorks puts the total value of
the batch (in cents) into the analysis field for you.

5.

If you have written off any over/under payments, or allowed any prompt
payment discounts, you will need to enter the general ledger code that
should be used for these

These default to the previous ones used.

6. Click OKto complete the processing

At this point MoneyWorks creates the Receipt transactions and posts them,
thus updating the balances in the Debtors ledger, Accounts Receivable and
bank accounts.

Clicking Cancelwill return you to the Debtor Receipts dialog box.

Bank Confirmation

If you have more than one bank account, MoneyWorks will ask for confirmation
that you have chosen the correct bank account when you process debtor
receipts or creditor payments3. This is to minimise the possibility of receipting
the money into the wrong bank account.

2. Choose the Bank account into which these funds will be deposited from

the Deposit topop-up menu
Debtors and Accounts Receivable

Cancelling the Batch of Debtor Receipts

If you click the Cancel button in the Debtor Receipts dialog box (instead of
Accept), all of the information that you have entered for the batch will be
discarded. MoneyWorks prompts you for confirmation before doing this with an
alert box. Click Keepin this alert box to return to the Debtor Receipts box
without discarding the information that you have entered.

Allocating Receipts to Invoices

Whether you are using a receipt transaction or the batch debtor receipts
command, you need to allocate the payment to individual invoices. The method
used is the same in each case.

Open Item Invoices

If you want you can run MoneyWorks as an “open item” system, so that each
receipt from a debtor is allocated to its originating invoice.

You can use the Tab key to move through the Pay amount fields and enter the
amount paid against each invoice manually. You will need to do this to enter a
partial or other unusual payment

Alternatively, click on the Outstanding amount, and it will be automatically
transferred into the Pay column.

Allocating to Topmost Invoice First

Receiving Payment for Sales Invoices

The way that the Distribute button allocates the cheque amount to invoices is
determined by the pop-up menu next to the Distribute button4. Note that the
distribution takes account of any unexpired prompt payment discounts.

Smart: Incorporates the value of any credit balances into the allocation amount.
Thus credit notes are marked as being “paid”, and the credit balance is
allocated to other outstanding invoices (starting at the top of the list).

Strict top down: Beginning at the top of the list, the allocation amount is

applied until it runs out. If a credit note is encountered before this, it is
marked as paid and its value is available to pay subsequent invoices
(otherwise the credit note is ignored). This is the method used when you
import receipts against invoices.

Ignore Credits: Same as Strict top down, but credit notes are ignored. You will

need to manually contra these.

If you tab to or click in the Pay field for an invoice other than the first one in the
list and then click the Distributebutton, MoneyWorks will begin allocating from
that invoice.

The Auto-distributeoption saves you from having to invoke
the Distribute facility manually.

Click the Autocheck box to automatically distribute the total
payments (based on the settings in the Distribute pop-up) as
you type in the amount—MoneyWorks will “click” the
Distributebutton for you. This is very useful if most of the
receipts are for the full amount of the oldest (or only) invoice for the debtor.

The Autooption
saves you having to
invoke the
Distribute facility
manually.

You can also allocate the receipts to the topmost invoices. This is normally the
oldest, but can be altered by clicking on a column heading to sort the list.

Partial Payments

1. Click the Distributebutton to automatically allocate the total cheque

amount to the invoices in the list

Pressing Ctrl-downarrow/⌘-downarrow is a shortcut for clicking the
Distributebutton

If the amount received is less than the outstanding amount for a particular
invoice, enter the amount received into the Pay amount. The balance of the
invoice will be displayed in red and will remain unpaid (unless you choose to
write it off— see Write Off Optionif you want to write it off straight away, or, if
you need to write it off at a later stage, refer to Write Off Command.
Debtors and Accounts Receivable

Prompt Payment Discounts

If your customers have been set up with a prompt payment discount, any
eligible discounts (as determined by the receipt date) will be honoured (the Disc
check box will be ticked).

Receiving Payment for Sales Invoices

When a prompt payment discount is accepted, MoneyWorks raises a credit note
(against the nominated discount account) for each affected invoice to account
for the discount. If you don’t wish to honour the discount, reset the Disc
checkbox: the invoice will be marked as part paid, and no credit note will be
raised.

When you complete a receipt (or a batch of receipts) where you have taken up a
prompt payment discount you will be prompted for the general ledger code for
the discount (this will default to the one used previously).

Note: The GST/VAT/Tax portion of the discount is determined by the Tax code of
the discount account—you should check with your accountant as to the
status of Tax on prompt payment discounts.

Note: The prompt payment amount on an invoice will exclude lines coded to

general ledger accounts which are not marked as Discountable.

Handling Overpayments

If a debtor overpays—that is, sends you a payment for more than the total of
their outstanding invoices—you will not be able to allocate the whole amount to
the invoices. In this case, MoneyWorks will ask you if you want to credit the
debtor’s account with the amount by which they have overpaid.

In MoneyWorks 9.1.5 and later, there are two ways of doing this:

Simply credit the account and hold the amount for later allocation. No GST/VAT
is calculated on the overpayment using this method. This is the method
MoneyWorks has used for debtor overpayments since 1992.

Or, you can have MoneyWorks create a debit note/credit note pair for the
amount and use the receipt to pay the debit note, leaving the credit note
outstanding. Using this method, GST/VAT will be calculated according to the tax
code of the suspense account you nominate.

If the amount by which the debtor has overpaid is slight (a few cents, say), you
may want to use the write-off feature to “forget” the overpayment— see Write
Off Option.

If you want the debtor's account to be credited for later allocation to an invoice,
select the Record as an overpaymentradio button, and then click the Record
Overpaymentbutton if. No GST/VAT will be calculated on the overpaid amount.
Debtors and Accounts Receivable

Receiving Payment for Sales Invoices

If you want to record the credit as a credit note (and a paid debit note), select
the Record as a credit with a debit/credit note pairradio button, enter a
suspense account to use on the debit/credit note. GST/VAT will be calculated
according to the tax code for the suspense account. Then click the Record Credit
button.

You have two options: You could follow up the underpayment with the debtor
and demand the extra 96 cents. You would then process this 96 cent receipt in
the normal way when you receive it and the invoice will thus be completed.
Alternatively, you may want to forget about the 96 cents and just complete the
(slightly underpaid) invoice now. MoneyWorks makes this easy.

If you have made a mistake and want to correct the details of the receipt, click
Go Back.

Note: In MoneyWorks Gold, a Preference optionallows you to limit the amount

that can be written-off in this manner.

Since, when receipts are processed, the Accounts Receivable account for the
debtor is credited by the full amount of the receipt (not just the amount
allocated), the overpayment will appear on your balance sheet as a
liability—that is, a credit to the Accounts Receivable account.

If the debtor has overpaid in error, and you want to send back the difference,
use the Return Refund To Debtorcommand. This can be used with either type of
overpayment credit.

If a debtor has an overpayment credit (as opposed to a credit note) recorded
against them, you will be alerted the next time you process a receipt for that
debtor. At that stage you will have the choice of allocating the existing
overpayment or a new payment received.

If they have a credit note, that will appear in the list of outstanding invoices to
be paid the next time you enter a receipt.

Write Off Option

You can have MoneyWorks perform a write-off of an outstanding balance on a
debtor invoice as you enter the receipt for that debtor. Use this feature if the
debtor has overpaid or underpaid by some trivial amount that is not worth
following up.

Let’s say you have a debtor with three outstanding invoices. You have received a
cheque for one of these to the value of $450.00. The invoice was for 450.96. If
you just enter 450.00 as the pay amount when you process this receipt, the
invoice will not be considered to be fully paid. It will come up again next time
you process a receipt for this debtor.

1.

In the Debtor Receipts dialog box, enter the amount received into the
appropriate place in the pay column

In this case, the entry would be 450.00.

2. Click the check box in the W/Ocolumn

W/Ostands for Write Off. Clicking in this
box tells MoneyWorks to consider the
invoice completely paid.

When you complete the receipt or the batch of receipts, you will need to enter
the Write-off Account code

For a batch of receipts, MoneyWorks prompts you for bank and period
information for the receipts as usual. In addition, you will be required to specify
a Writeoff account. You should already have created a suitable account (usually
an expense account) to account for writeoffs.

For a Receipt, you will be prompted for the Write-off account.

3. Type the code of the writeoff account into the Writeoff A/cfield

If you can’t remember the code just press tab, and MoneyWorks will bring
up the Account Choices box for you to find the account code.

For each invoice whose remaining balance you have “Written-off”,
MoneyWorks will create a credit note with the description “Write Off”. The
credit note will credit the debtor’s Accounts Receivable control account and
debit the nominated write off account by the amount written off. It will also
include any adjustments that need to be made for GST.
Debtors and Accounts Receivable

Printing and emailing Statements

Note: Only one write-off account can be specified per batch of debtor receipts
processed. MoneyWorks will remember the writeoff account that you
supply and enter it for you next time you use the Write Off feature.

Printing and emailing Statements

The statement forms that are shipped with MoneyWorks allow you to print both
open-item and balance forward statements. Most are designed to print on plain
paper or letterhead.

You can print statements for all debtors, or just selected debtors.

1. To print statements for selected debtors, highlight the debtor(s) in the

Names list

If no individual debtors are highlighted, or if the Names list is not open,
statements will be prepared for all debtors in your system.

2. Choose Command>Print Statements or press Ctrl-]/⌘-].

The statement dialog box appears.

4. Type in an optional message to appear on the statement

5. Set any options that may be appropriate.

These are discussed below.

6. Select the output method to determine whether the statements will be

printed, previewed or emailed

7. Click the Print/_Preview_/_Send_ button

For emailing, the Mail Attachment window opens — see Emailing Formsfor
more information.

Include Remittance Advice: This is only available for the “Plain” statements. If
set, a remittance advice will be printed at the end of the statement.

Omit Zero Balances: Set this option if you do not want to print statements for

debtors with zero balances.

Omit Credit Balances: Set this option if you do not want to print statements for

debtors with credit balances.

Statement Date: Normally the cut-off date for new invoices—invoices dated

after this will not be shown on the statement. But does depend on how the
statement form was designed.

Note: After you have successfully printed statements for all your debtors you
should age the balances for the debtors. This will maintain the ages
balances in the debtor’s Name record. If this is not done, the next time you
print statements the same transactions may appear again (together with
any new invoices or receipts).

Ageing Debtor Balances

You should age the outstanding debtor balances after printing statements. If you
do not print statements, then ageing is optional, but you may like to do it on a
regular monthly basis anyway. You can also “age on the fly”.

3. Choose the Statement form from the Use Formpop-up menu

Ageing debtors performs a dual purpose:
Debtors and Accounts Receivable

Ageing Debtor Balances

• “Current” invoices and receipts become non-current. In general this means
that they will not appear on subsequent statements—the exception is
unpaid invoices, which will continue to appear on open-item type
statements.

• The “manual aging” balances for each debtor (as shown in the Balancestab
of the Names record and in the payments history) are moved left one place,
eventually accumulating in the 3 or morecycles section.

Before Ageing

After Ageing

Note: Ageing is necessary for proper production of most forms of statements. If
you do not require statements for customers, you can have MoneyWorks
produce aged-debtor reports for your own use automatically.

To age debtor balances:

1. Choose Command>Age Debtor Balances...

An alert box will appear asking for confirmation

2.

If you have entered new debtor invoices dated after the cut-off date for
ageing, set the Do not age invoices dated aftercheckbox and enter the
cutoff date

Invoices dated after this will not be aged.

3. Click Ageto age the debtor balances

All debtors are aged.

If you don’t have many debtors, the ageing may be pretty much
instantaneous, so don’t be tempted to think that nothing has happened.

Aged Debtor/Aged Receivables Report

For information on printing an aged receivables/debtor report — see Aged
Receivables. This can be printed for prior periods (although it might take
considerably longer), and used as a reconciliation report. Using the Report
Writerin MoneyWorks Gold, you can modify this report or create your own
aged debtors (or creditors) report if you wish.

1 On customisedinvoices, this will only work if it has been explicitly catered for in
the logic.↩
