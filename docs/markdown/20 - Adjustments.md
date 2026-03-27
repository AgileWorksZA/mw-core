# Adjustments

Adjustments

Clicking Post and Update Orderwill close the Match PO window, post the
invoice (the Purchase Invoice window also closes), and update the Received
quantities for the items that appear on the original purchase order (if this
completes the order, it will be moved to the Boughttab).

Services are enabled under File>Manage Services (see MoneyWorks Services
and Maintenance).

Adjustments

In a perfect world, no one would ever make a mistake, customers would always
pay the correct amount before it was due, and there would be no bad debts.
But, even using a superlative accounting system, things do go wrong. To help
correct problems quickly and accurately, MoneyWorks has a number of special
adjustment commands. It is better (and easier) to use these than attempt to
enter a general ledger journal.

I need to correct a posted
transaction

The Cancel command will reverse a posted transaction.
Note that you can alter non-audit fields (e.g. description)
on posted transactions.

The balance of this invoice will
never get paid

The Write-Off command will write-off the balance owing
on an invoice.

I need to offset a credit note
against a previously entered
invoice

I need to repay a debtor
(customer) some money they
previously overpaid

I’ve received a reimbursement
from a creditor (supplier)
whom we overpaid

The Contra command will offset a credit note against an
invoice.

Use the Return Refund to Debtor command

Use the Receive Refund from Creditor

The Adjustments commands appear in the Adjustments submenu in the
Command menu, and are also accessible from the Adjusttoolbar button.
Adjustments

Cancel Transaction

With these, you can handle all manner of adjustments including bad debt write-
offs, prompt payment discounts, correction of incorrect entries, bounced
cheques, cancelled cheques, and so on.

Cancel Transaction

Use Cancel Transactionto cancel (reverse) a posted transaction. Unposted
transactions cannot be cancelled—you can just delete them.

You cannot cancel a transaction that has already been cancelled, nor can you
cancel a cancellation (i.e. a transaction created by the Cancel Transaction
command). If you need to do this, you should duplicate the original transaction.

Cancelling Payments: When you cancel a payment related to a sales or purchase
invoice, the cancellation process adjusts the debtor or creditor balance, and
creates and posts the appropriate reversing cash transaction. Invoices paid
by the payment will reappear in the Receivables or Payables list.

Cancelling Invoices: Invoices can be cancelled (not Cashbook) only if they are
unpaid (either in full or in part)1. If you cancel an invoice, a credit note
(negative invoice) is created and posted. Both transactions will be marked
completed so neither will appear in the Payables or Receivables lists.

If you cancel an invoice that has been processed for GST on an invoice basis,
the cancellation will be processed for GST the next time you print a GST
report. If the cancelled invoice was not processed for GST, then neither it
nor the cancelling invoices will appear on the GST report.

The reference number (invoice or cheque number) of the cancellation will be
the same as that of the original, but with a “-” (minus sign) appended to it.

To cancel a transaction:

1. Locate the transaction in the Transaction list and highlight it by clicking on

it once

2. Choose Command>Adjustment>Cancel Transaction or press Ctrl—/⌘—

(hyphen), or click the Cancel Toolbar button

The Cancel Transaction window is displayed.

If the transaction cannot be cancelled an alert will be displayed.

If you used the Cancel command without first highlighting the transaction
to be cancelled, a list of available transactions will be displayed. Locate and
highlight the transaction in this list and click Continue to display the Cancel
Transaction window.

3. Specify the date and period in which for the cancellation to occur

By default, this has the same settings as the transaction you are cancelling.
However if the period of the original transaction is not open, it will default
to today’s date and the current period.

4. Enter appropriate text in the Analysis and Description fields
Adjustments

Contra Invoices

It is a good idea to use the Description to say why the transaction is being
cancelled (e.g. “Cheque bounced”, “Returned Goods”).

A list of unpaid invoices for the debtor or creditor is displayed (or an alert is
given if there are no eligible invoices to contra against).

5.

If you do not want the original transaction and the cancellation to appear
on the customer’s statement, set the Do not show on statement option

6. Click OKor press enter

A reversed copy of the transaction will be created and posted, thus
effectively cancelling out the original transaction.

Contra Invoices

If you have a manually-entered credit note, you can contra it against an invoice
for the same debtor or creditor. This is not available in MoneyWorks Cashbook.

You cannot contra an invoice received from a creditor against an invoice sent to
a debtor, even if the debtor is the same as the creditor.2

3. Highlight the invoice that you wish to contra against the credit note and

click Continue

1. Choose Command>Adjustment>Contra Invoices or press Ctrl-+/⌘-+

You will be asked for confirmation.

A list of outstanding credit notes will be displayed.

4. Click Contrato complete the contra

At least one of the two invoices will be completed by the contra operation.
If the invoices have equal (and opposite) values, both will be completed by
the contra operation. Completed (i.e. fully-paid) invoices are removed from
the payables or receivables list.

Note: If the two invoices involved have proportionally different GST/VAT

amounts, a zero-valued Payment or Receipt record will be created. This
transaction is required for proper GST processing under a payments basis.

Note: A credit note can be effectively “contra-ed” against a number of invoices
from the same Debtor/Creditor by generating a zero-valued payment.

Contra shortcut: If you are adventurous, you can also contra transactions

directly from the main transactions list.

2. Highlight the credit note to contra, and click Continue

1. Highlight the two invoices in the Transactions list
Adjustments

Write Off Command

It is normally easier to do this from the Payablestab (for purchase invoices)
or the Receivablestab (for sales invoices). One of the invoices must be
negative (i.e: a credit note), and must be to the same customer/supplier.

2. Choose Command>Adjustments>Contra Invoices

The Contra Invoices confirmation is displayed.

3. Click Contra

Write Off Command

Use the Write Off command (not available in MoneyWorks Cashbook) when you
need to complete an invoice that will not otherwise be paid. For example:

• It is a bad debt and you need to write it off for tax purposes
• The outstanding balance is uneconomic to complete. It is better to use the
Write Offoption when recording the receipt—see Write Off Option—use
the following method only if you forget to do it there.

To Write off one or more invoices:

1. Locate the invoice(s) to be written off in the Payables or Receivables list,

and highlight it by clicking on it once

You can highlight more than one invoice in the list by shift or control/
command clicking.

2. Choose Command>Adjustments>Write Off or press Ctrl-*/⌘-*

The Write Off Invoices dialog box is displayed.

MoneyWorks “writes-off” an invoice by creating a credit note (negative
invoice) for the outstanding balance of the invoice, and then contra-ing this
against the original invoice.

If you are writing off Sales Invoices, you will be required to enter an account
code for a Debtor write off account (e.g. a bad debts account). Similarly, if
you are writing off Purchase Invoices, you will be required to enter an
account code for a Creditor write off account. If you have selected both
types of invoice for writing off, you need to specify one of each type of
write off account.

If you used the Write Off command without first highlighting the
transaction to be written off, a list of available transactions will be
displayed. Locate and highlight the transaction in this list and click Continue
to display the Write Off window.

3. Specify the appropriate write off account(s) plus the date, period and

description of the write off transaction

4. Click WriteOff

The credit notes will be created, and the written-off invoices will be removed
from the Payables or Receivables lists.

Note: If the original invoice contained GST, this is pro-rated over the amount
written off and included in the credit note so that GST is correctly
accounted for. It does this regardless of the tax code associated with the
write off account. For this reason it is a good idea for the tax code of the
Adjustments

Return Refund to Debtor

write-off account to be the same as those used on the invoice, otherwise
the transaction may be flagged as an anomaly on your GST report. Note
also that the write off account cannot have a tax code of “*”.

Return Refund to Debtor

Use the Return Refund to Debtor3 command (not available in MoneyWorks
Cashbook) when a debtor has overpaid you or when you have issued a credit
note to a debtor and wish to clear their credit balance by paying them.

1. Choose Command>Adjustments>Return Refund to Debtor

A list of debtors who have outstanding credit notes or overpayments will be
displayed:

Any outstanding credit notes plus any unallocated overpayments that have
been received from the debtor will be displayed and highlighted in the list
on the right-hand side of the dialog box.

3.

If you do not wish to refund the full amount that the debtor has in credit,
click on any credit notes or overpayments in the list that you do not want
to include

The items that you click on will be unhighlighted and the refund amount
will reduce accordingly—click on an item again to rehighlight it. If the
amount you want to refund is not represented exactly by one or more of
these entries, you will have to enter a special credit note/debit note pair
and use the new credit note here.

Note that the Owing column displays the total customer balance, not the
amount of individual credits.

4. Choose the bank and period for the payment that will be created

You can also change the date, cheque #, analysis and description.

2. Highlight the debtor that you wish to refund and click Continue

5. Click OK

The Return Refund dialog box is displayed.

A Payment transaction made out to the debtor will be created and posted.
It will credit the nominated bank account and debit the Accounts
Receivable control account for the debtor. If paying the refund by cheque, it
will need to be hand-written.
Adjustments

Receive Refund from Creditor

Note: Overpayments, by definition, do not include GST/VAT, and hence any

payments you return will not include any GST/VAT. Payment returned for a
credit note will include any GST/VAT specified in the credit note.

Receive Refund from Creditor

The Receive Refund from Creditor4 command is the complement of the Return
Refund to Debtor command (and is not available in MoneyWorks Cashbook).
Use this command where you have overpaid a creditor (supplier) and are
processing the refund; if the creditor invoiced you incorrectly and is now making
good; or if the amount that you hand-wrote a cheque for was in excess of the
amount that you entered for the payment in MoneyWorks.

You will need a credit note (i.e. negative Purchase Invoice) for the value of the
cheque that you have received from the creditor—if you have deliberately
overpaid (see Overpaying a Creditor), MoneyWorks will have created this for
you, otherwise you will need to create it yourself. If the creditor has sent you a
cheque with an incorrect amount (not enough, for example), you should enter a
credit note for the amount that they have sent you, and another for the amount
that they still owe you—this is because MoneyWorks will only accept complete
payments on creditor credit notes.

To receive a cheque from a creditor:

1. Choose Command>Adjustments>Receive Refund from Creditor

A list of creditors who have outstanding credit notes is displayed.

Note that the amount shown is their total balance, not the credit amount.

2. Highlight the creditor from whom you received the cheque and click

Continue

The Receive Refund from Creditor dialog box is displayed.

If no credit note exists for the creditor, an alert is given. You must enter the
credit note before you choose Receive Refund from Creditor.
Adjustments

General Ledger Journals

Any outstanding credit notes for the creditor will be displayed and
highlighted in the list on the right-hand side of the dialog box.

Note: You cannot attach a job code to a journal detail line.

3.

If the cheque that you have received does not correspond to all the credit
notes in the list, click on any credit notes in the list that you do not want
to include

The items that you click on will be unhighlighted and the cheque amount
will reduce accordingly. You can click on an item again to rehighlight it.

If the credit notes in the list do not correspond to the amount of the
cheque, you will need to enter a correction (either another credit note, or a
normal positive invoice).

4. Choose the bank, date, period and analysis for the Receipt

5. Click OK

The Cash Receipt will be created and posted. This will debit the nominated
bank account and credit the creditor’s Accounts Payable control account.

The GST component of this cheque will correspond to that specified in the
credit note.

General Ledger Journals

Use journal transactions to transfer balances from one account to another, for
accruals and for end of year adjustments.

Note: Avoid using journals to correct entries made with other transaction types;

instead use the Cancel Transactioncommand to cancel the incorrect
transaction and then re-enter a correct one. As well as being more difficult
to work out (unless you are an accountant), journals are treated differently
for the purposes of GST and cashflow reporting.

Note: You cannot use a journal transaction to make adjustments to the Accounts
Receivable or Accounts Payable control accounts. If you need to make
adjustments of this kind, use the Adjustments commands (Cancel
Transaction, Contra Invoices, Write Off etc.), or use an invoice transaction.

1.

In the Transaction list, click the Newbutton or press Ctrl-N/⌘-N to create
a new transaction

2.

If necessary set the transaction Type to Journal

Pressing Alt-Shift-5/Ctrl-Shift-5 is a keyboard shortcut for this

The Reference number is set automatically, and cannot be altered5.

3. Ensure the journal type tab is set to General

For information on stock journals see Stock Journals.

4. Type the date for the Journal into the Date field

5.

If necessary you can change the period into which the journal is to be
posted using the Period pop-up menu

6. Enter a description for the journal into the Description field

7. Press Ctrl-tab (Mac) or Ctrl-` (Win) to go to the first detail line
Adjustments

General Ledger Journals

8. Enter the first account code to be debited or credited into the Account

field

9. Enter a description into the Description field

2 To contra a sales invoice against a purchase invoice (or even two invoices from
different debtors/creditors), create credit notes for both invoices. These will be for
the same amount, and will both be coded to the same suspense account. Contra
these against their respective invoices.↩

10. Click or Tab into either the Debit or the Credit fields and enter the amount

to be debited or credited to the account

3 This was Return Cheque to Debtorin MoneyWorks 6 and earlier↩

4 This was Receive Cheque from Creditorin MoneyWorks 6 and earlier↩

5 The Journal Number is sequential. However if you create a journal and then delete
it without posting it, it will leave a gap in the sequence.↩

11. Press the ↩↩/return key to create a new detail line

Enter the details of the next account to be credited or debited.

If you accidentally create extra detail lines, they will be removed
automatically when you save the transaction provided there is no account
code in the Account field.

The OKand Nextbuttons remain dimmed until the total of the debits is
equal to the total of credits. A tooltip will show the amount needed to
balance the journal.

12. When the details of the journal entry are complete, click OK

The sum of the amounts in the debit column must be equal to the sum of the
amounts in the credit column. You may not enter an amount into both the debit
and credit column on the same line.

Note: To automatically add one more line to make the journal balance, click
either of the totals in the footer. If the debits and credits are not already
equal, MoneyWorks will add a line for you to make them so. You just need
to add the relevant account code. (MoneyWorks 9.1.5 and later)

Some accounting systems allow you to do a “one legged” journal (one that does
not balance) in order to correct an out-of-balance condition in the general
ledger. Proper accounting systems (such as, for example, MoneyWorks) don’t let
your ledger get out of balance, and hence don’t need one legged journals.

1 If the invoice has been paid, you can still effect the desired result by manually
entering a credit note. To do this, use the Duplicate command to duplicate the
invoice, then use the Reverse command to reverse it before saving it.↩
