# Multi-currency

Multi-currency

Note: Emailed stocktake data should only be used if the normal submission

process from a device is not available for some reason (or if it is provided
from a third party).

Multi-currency

Remote Fulfilment Data Requirements

The Multi-currency feature of MoneyWorks Gold allows for purchasing and sales
to be made and tracked in more than one currency, and for bank accounts and
accounts receivable/payable to be held in a currency other than the local one.

For more information on data formats and protocols (including REST API calls),
see Remote Fulfilment Data Requirements

The steps for setting up multi-currency are simple:

1 The Process Order pop-up replaces the checkbox used in MoneyWorks 5 and
earlier.↩

2 The accumulated deposits paid on an order are held in the OrderDepositfield↩

3 The Process Order pop-up replaces the checkbox used in MoneyWorks 5 and
earlier.↩

4 The Process Order pop-up replaces the “grinder” used in MoneyWorks 5 and
earlier.↩

5 Prior to MoneyWorks 6.1, items were always brought into stock at the value
specified on the purchase order. This could lead to changes in the average unit
value, meaning that the unbilled inventory account would never be cleared.↩

6 This will happen only if the Document preference Sales Order Ship Qty Updatingis
set↩

• Enable multi-currency (it is off by default);
• Specify the new currency to use;
• Create the general ledger control accounts needed for the currency);
• Create any customers or suppliers that you deal to in the new currency;

Setting up Multi-Currency

Multi-currency is turned off by default and needs to be enabled.

1. Choose Edit>Document Preferences

The Document Preferences window will open

2. Click on the Locale/Currency tab

3. Turn on the Use multiple currencies in this document option
Multi-currency

Setting up Multi-Currency

4. Select your base currency (i.e. your local currency) from the menu.

4. Specify the Unrealised and the Realised Currency Gain/Loss accounts

5. Click OK

Note: Once you have created a currency, you will not be able to turn off the Use

multiple currencies option.

Specifying a Currency

To create a new currency:

1. Choose Show>Currencies

The currencies list window will open. Any existing currencies you have
specified (apart form your local currency) will be displayed.

2. Click the New button (or press Ctrl-N/⌘-N)

The Currency window will open

3. Choose the Currency from the Currency pop-up menu

This lists all ISO currencies, plus (at the end of the menu) you can make your
own. Note that you cannot specify the same currency twice.

This will normally be an expense account. See Unrealised Gains and Losses
for a discussion of these.

5. Specify the current exchange rate (or the rate for the first period in which

you want to enter historic transactions against the currency)

See Setting the Exchange Ratefor more information on exchange rates.

MoneyWorks will need to create a bank account for the currency, even if you
don’t have a real one. This is to facilitate payment/receipts against invoices.

MoneyWorks has suggested a new bank account code for you. You can change
this if you wish. Note that the OK button will be disabled if you attempt to
change it to an existing general ledger code.

6. Turn on the I send invoices in this currency option if you have customers

that you want to invoice in the currency.

If this option is on, you will need an Accounts Receivable control account for
the currency. You can use the code suggested, or alter it if you prefer.

7. Turn on the I receive invoices in this currency option if you receive

invoices from suppliers in the currency.

If this option is on, you will need an Accounts Payable control account for
the currency. You can use the code suggested, or alter it if you prefer.

8. Click the OKbutton to save the currency details

To Add a Control Account After Creating the Currency

It may be that when you set up the currency you didn’t realise that you would
later need to send (or receive) invoices in the currency, so you didn’t set up one
of the control accounts.

Alternatively you may have more than one bank account in this currency, or
want more than one control account for your debtors and/or creditors.

To create a control account later:
Multi-currency

1. Choose Show>Accounts or press Ctrl-1/⌘-1

The Accounts list will be displayed

MoneyWorks handles this by allowing you to change the system exchange rate
at any time (and also to specify a transaction rate for individual transactions if
you need to). A separate currency rate is held for each currency for each period.

Setting the Exchange Rate

2. Click the New button or press Ctrl-N/⌘-N

To set the currency rate

The Account entry screen is displayed

1. Choose Command>Change Currency Rate

3. Enter the code, type etc as per a normal account

The Currency Rate window will open

4. Set the Currency pop-up to the desired currency (which must have already

been created)

Note: Once you save the new account (by clicking OK or Next) you will not be

able to alter the currency, so you need to get it right. If you make a mistake,
you will need to delete the account and recreate it.

Deleting a Currency

If you set up a currency by mistake, you can delete it provided no transactions
have been entered against it. To delete the currency you need to first delete any
control accounts (such as the bank account) that were created with the
currency. You do this in the Accounts list —see Deleting an Account. Having
done this, you can delete the currency from the Currency list.

Setting the Exchange Rate

One of the problems with currencies is that their relative value changes all the
time. Thus the 10,000 Nakfa stashed into your Eritrean bank account which
were worth $1,100, suddenly become worth just $1,020.

2.

In the Currency menu, select the currency whose rate you want to change

3. Specify the date for which you want the rate to apply (this will

automatically set the period)

You can change the rate for any open (unlocked) period, but you should be
circumspect about changing prior periods as it will generate currency gains/
losses, which will affect your P&L.

4. Set the new exchange rate

Exchange rates are always expressed in terms of how many units of the
foreign currency will be purchased by one unit of the local currency.

5. Click OK to save the new rate
Multi-currency

Transferring funds to/from a foreign bank account

At this point a journal will be created to reflect the gain or loss that has
occurred because of the rate change. Generally the change in value of the
balance due on unpaid invoices in the currency will be posted to the
Unrealised Gain/Loss account, and that of any bank accounts will be posted
to the Realised Currency Gain/Loss account.

2. Use the From Account pop-up menu to choose the account from which

funds are being taken

3. Use the To Account pop-up menu to choose the account into which the

funds will be deposited

Note: If you are changing the rate in a prior period, two journals will be created:

the first is to journal in the currency gain/loss in the period of the change;
the second is to reverse this out in the subsequent period. If you wonder
why this is necessary, have a think about what would happen if we have
entered the same rate for Jan and Feb, and then change the rate in Jan.

Tip: Use the exchange rate report to view historic rates (or customise the

currency list to see them on screen).

Transferring funds to/from a foreign bank
account

To record a transfer of funds from one bank account to another that is in a
different currency, you use the Transfer Funds command.

1. Choose Command>Transfer Funds

The Funds Transfer window will be displayed

If the currencies of the selected bank accounts are different, the window
will extend to allow you to specify the amount received in the destination
bank, or the exchange rate.

4.

In the Amount field, specify the amount being transferred out of the From
Account

5. Specify a reference number (if any), the date and a description for the

transaction

6.

In the Amount Received field specify the amount received in the currency
of the receiving bank account

The Rate will alter to show the effective rate

Alternatively if you know the rate, specify this in the Rate field, and the
Amount Received will alter

7. Click Transfer to record the transfer

A cash payment will be created and posted out of the From Account, into
the To Account.

Note: If the amount received is different from that expected (as determined by
the system exchange rate for the period), an adjustment is made to the
currency gain/loss accounts.

Sending and Receiving Invoices in a Different Currency

When you enter an invoice, it is deemed to be in the currency of the customer
/supplier. Therefore if you want to send an invoice in a non-local currency, you
need to set up the supplier to be in that currency.

Note: Once set, the currency for a debtor/creditor cannot be altered
Multi-currency

Entering a Foreign Currency Transaction

To create a debtor/creditor in a different currency:

transaction.

1. Create the Name record in the usual manner —see Creating a New Name

The Transaction Exchange Rate

2. Set the Currency pop-up on the Pricing & Terms panel to the desired

currency

By default, the exchange rate of a currency is determined by the rate for the
period into which it is posted, and the rate is set when the transaction is posted.
Thus if a transaction is entered when the exchange rate is x, and is posted after
the rate has been reset to y, the transaction will have an exchange rate of y.

Note: If the customer/supplier is offshore, there will probably be no GST/VAT/
Sales Tax. If so, set the Override Tax Code to an appropriate tax code.

Once a customer or a supplier is assigned a currency, all transactions entered for
them will be in that currency.

The current exchange
rate is displayed on the
Exchange Rate button
on the top right of the
transaction. The
converted rate of the
transaction in local
currency is displayed
beneath this.

To lock an exchange rate into a transaction:

1. Click the Exchange Rate button

Note: You will only be able to use the head office billing facilityif both the head

office and the branch have the same currency.

The transaction Currency Rate window will open

Entering a Foreign Currency Transaction

Foreign currency transactions are entered in the same manner as other
transactions. The key point to note is that the transaction currency is
determined by:

• The currency of the debtor/creditor for an invoice, or a payment on invoice;
• The currency of the bank account for a receipt/payment.

Note that all values on the transaction are considered to be in that currency.
Thus an invoice for 100 units of currency made out to a US customer is
considered to be USD 100, whereas an invoice for 100 units of currency made
out to a Canadian customer is considered to be CAN 100. The transaction
currency (and rate) is shown on the Exchange Rate button in the top right of the

2. Turn off the Use system rate at posting time option

3. Enter the desired transaction rate into the rate field

4. Click OK
Multi-currency

Entering a Foreign Currency Transaction

Note: A transaction that, at the time of posting, has a different transaction rate
to the system rate will result in the recording of a realised or unrealised
currency gain or loss. This is done by adding additional lines to the
transaction, which you can see if you print the transaction using the Print
Detailstoolbar button.

Note: You cannot specify the transaction rate for the payment or receipt of an

invoice.

You can restore the system rate by opening the window and setting the Use
system rate at posting time option.

Warning: When you post a backdated multi-currency transaction, MoneyWorks
will check for exchange rate changes in subsequent periods. For each such
rate change a journal will be created to account for any realised or
unrealised gains/losses on the new transaction. To minimise this, try to
avoid entering historic foreign currency transactions.

Duplicating and recurring foreign currency transactions

When a foreign currency transaction is duplicated or recurs, the resultant
transaction will inherit the system rate of whatever period it is created in, and
not the rate of the original transaction.

Paying a Foreign Currency Invoice

Payment against a foreign currency invoice may be made in any currency.
However for accounting clarity, MoneyWorks will always pass it through the
currency bank account of the originating invoice. This is why, even if you don’t
have a real bank account for the currency, you must set one up in MoneyWorks.

Payment and receipting is done through the bank account in the same manner
as other transactions. All receipts/payments in a batch (using the Batch Debtors
Receipt or Batch Creditor Payments command) must be in a single currency.

If you receipt into (or pay out of) a bank account that is in a different currency to
the originating invoice, you will be prompted for the amount that was received/
paid in the currency of that bank account:

MoneyWorks will generate a receipt into the nominated clearing account (which
will be in the same currency as the original invoice), and then a funds transfer
from this into the target bank account for the amount specified; this makes the
adjustments for currency gains/losses. Unless you want to account for bank
charges separately, subsume them into the amount (and hence into the
currency gain/loss).

If you know that the invoice has been paid, but do not yet know how much it is
in your local currency, use the bank account that is in the currency of the invoice
(even if this is only nominal), and when you know the amount that was actually
receipted or paid, use the Funds Transfer command to transfer that amount to/
from the actual bank account used. For example, to pay an invoice for
$USD1,000 when you are unsure of the amount actually charged to your local
bank account:

1. Pay the invoice (using a normal Payment transaction) from the USD Bank

Account

The USD Bank Account will now be “in overdraft”

2. When you know the amount that was actually withdrawn from your bank
account (say $1500), transfer this amount to the USD Bank Account,
receiving $USD1000 into the bank account

You can just net off any bank charges involving the transfer of funds from
the total. If you really care, you can of course enter them as a separate
transaction.
Multi-currency

Purchasing Items

When you purchase an item, both the currency used and the purchase price are
recorded in the product record. The product.buyprice is the actual buy price in
the currency, and this is converted at the transaction rate to give the local
currency cost price, product.costprice. If the purchase is tagged to a job, it is the
local product.costprice that is transferred to the job system.

If a subsequent purchase is made in a different currency, the last purchase price
used is converted to that currency and used as the default price on the new
transaction.

Realised and Unrealised Gains and Losses

When the exchange rate changes, any invoices you hold in that currency will
have a different value as a result of the change. Thus if I have invoiced someone
for 1,000 Euros, it is worth $2,000 at an exchange rate of $1.00 = 0.5 Euros. If
the rate changes so that $1.00 = 0.55 Euros, my 1,000 Euro invoice is now only
worth $1,818.18. I have in effect made a loss of $181.82. This is termed an
unrealised loss (or gain, if it went the other way).

The same thing would happen if I had 1,000 Euros stashed in a bank account. In
this case it is termed a realised loss.

When you change the exchange rate in MoneyWorks, a journal is automatically
created to account for the unrealised and realised gains/losses. If you change
the rate in a prior period, several journals may be created.

When a foreign currency invoice is paid, the accumulated unrealised Gain/Loss
on the invoice brought about by movements in the exchange rate is transferred
to a Realised Gain/Loss. This happens automatically.

Contra-ing invoices: Foreign currency invoices and credit notes can be contra-ed

in the normal manner. Because of exchange rate changes you might not be
contra-ing invoices of equal value in the base currency—such differences
are treated as realised gains/losses.

Write-offs: When a foreign currency invoice is written off, an adjustment is
made to counter any unrealised gains recorded against the invoice.

Realised and Unrealised Gains and Losses

Overpayments: Overpayments in foreign currencies are not allowed. Instead

enter a debit note and a credit note pair, and assign the overpayment to the
debit note.

Tip: To see the Unrealised Gains/Losses at a point in time, use the Unrealised

Gains and Lossesreport.

Multi-currencies: Behind the Scenes

Although deceptively simple looking, multi-currency is in fact fiendishly
complicated. For the enthusiasts, the following section explains the
implementation in MoneyWorks.

Ledger Balances

One issue when working with different currencies is that they are no longer
additive. For example if I add one US Dollar to one Australian Dollar I don’t come
up with a sensible answer of two.

In the MoneyWorks general ledger, a foreign currency account is represented as
two separate amounts: the value in the foreign currency, and the value of the
difference between that currency and the base currency. The difference is
stored in a (normally hidden) account called a “delta account”, so that the
following is always true:

Base Currency Value = Foreign Currency Value + Delta Value

For simplicity, we’ll refer to this as the Currency Ratio (even though its not
technically a ratio).

Thus if I transfer $100 from my currency to a bank account in currency X, and
the exchange rate is 1.5, I will end up with $X150. In the general ledger this is
represented as:

$X Bank Account            $150

$X Bank Delta Account       -50

Thus the sum of a foreign currency account and its delta account will always give
the local dollar equivalent at the current exchange rate.
Multi-currency

Multi-currencies: Behind the Scenes

Currency Gain/Loss

As we have just seen, a movement in the exchange rate will normally produce
some sort of currency gain or loss. In the previous example, what we paid $100
for is now worth $107.14. The good news is that we have made a “profit” of
$7.14; the bad news is that in many jurisdictions this may be taxable (which is
why you need accounting advice for this sort of stuff).

MoneyWorks recognizes two types of currency gain/loss: invoices in a foreign
currency result in an “Unrealised Gain/Loss”; cash (bank accounts) result in a
“Realised Gain/Loss”. The GL accounts to accumulate these are nominated as
part of the currency setup, and are always in the local currency. You can specify
different gain/loss GL accounts per currency if you want to track these by
currency. You can also have the same GL account for Realised and Unrealised
gains/losses, which will remove the distinction between them.

A currency gain/loss is recorded in MoneyWorks in two circumstances:

• when the currency rate is altered. This is recorded as a journal;
• when a transaction is posted that has an exchange rate that is different

from the system exchange rate. This is recorded as additional lines in the
transaction, and can be seen by printing the transaction using the Print
Details toolbar button.

To see the realised or unrealised gain/losses for prior period, use the Account
Enquiry.

In MoneyWorks the Delta accounts have a special code, basically the code of the
corresponding account with -~~DEL appended. In the normal course of events,
you will not see these.

Exchange Rates

Exchange Rates do of course fluctuate. MoneyWorks stores one exchange rate
per currency per period. The exchange rate (R) is stored as the number of
foreign currency units the base currency is worth, i.e.

$X = R * $Local

When the exchange rate is changed (using the Change Currency Rate
command), MoneyWorks will preserve the Currency Ratio. It does this by (in
effect) recalculating what the balance in the delta account should be to preserve
the ratio, and transferring the difference to a currency gain/loss account.

Thus if we revalue the exchange rate in the previous example from 1.5 to 1.4:

Our $X150 are now worth 150/1.4 = $107.14, so we need to change the
amount in our delta account by 7.14 to maintain the Currency Ratio.

Thus we debit the delta account 7.14, and credit the currency gain account
by 7.14. The balances in our $X bank accounts are now:

$X Bank Account             $150.00

$X Bank Delta Account       - 42.86

Which is sensible, because we still have $X150, even though the rate may have
changed. The magic thing is that our exchange rate is preserved:

$X = R * $Local

R = $X/$Local

= 150/107.14

= 1.4
