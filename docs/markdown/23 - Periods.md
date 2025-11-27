# Periods

• If you enter a transaction with a date past the end of the current period.

You will be asked if you want to open the new period;

• If you open a MoneyWorks file whose last period ends before today.
• If the Document preference Auto open new period when opening file in

new monthis on, a new period will be silently opened when the file is first
opened in the new month (regardless of the user’s privileges), provided it is
opened within 30 days of the old period ending.

You can also explicitly open a period by using the Open/Close Periodcommand
in the Commands menu. You have to use this command to lock, close or purge a
period. The most recently opened period is known as the current period.

Note: Opening periods in advance has little effect in MoneyWorks, but is

probably better avoided.

The Period Management Dialog Box

The Period Management dialog box allows you to open, close, lock, unlock and
purge periods. To display the period management dialog box:

1. Choose Command>Open/Close Period

The Period Management dialog box will open. This dialog box displays the
current status of the periods at any one time.

Periods

Periods

Whenever you enter a transaction into MoneyWorks it is put into a specific
accounting period. Thus if you make a payment dated March, the details of that
payment will be recorded in the March period, and the expenses which the
payment represents will be reported on in March.

When you first set up MoneyWorks, you indicated how many periods you
wanted in your financial year —see Periods. Most organisations have 12 periods,
one for each calendar month in the year.

Managing your periods is important. You can only enter transactions into
periods which are open. MoneyWorks will normally manage opening your
periods for you automatically. However it is important to close periods as
well—while a period is open you can still enter transactions against it. Because
MoneyWorks stores over seven years, this means that you can back enter
transactions well into the past. But, if you have already finalised your accounts
for those periods, or even presented final results to the board, back entering
transactions in this manner will change these results.

Note:Period Management can only be done in single user mode, and the To Do
panel in the Navigator is a good place to do it.

Managing Financial Periods

In MoneyWorks, a period can have one of several states:

Open: Transactions can be entered into the period;

Locked: Transactions cannot be entered into the period, but the period can be

“unlocked” so it becomes open again;

Closed: Transactions cannot be entered into the period. Once a period is closed

it cannot be re-opened.

Purged: A closed period can be purged. Any transactions already entered into

the period are discarded. The period balances remain.

Opening a period is handled automatically for you, and will occur:
Periods

Purged periods appear in white. These are closed periods that have had all the
transaction information removed from them. The general ledger balances for
these periods are still available.

Tip: If you need to determine the internal number of a period, hold down the

shift key and these will be displayed instead of the period names.

To View the Status of a Period:

1. Click on a particular period in the bar at the top of the Period

Management dialog box

The status information will be displayed

The status of individual periods is represented by a row of cute little colour-
coded boxes, labelled above with the name of the period and below by the
name of the financial year. The legend at the right indicates the status of each
period. The right-most period is the current period.

The Open periods are displayed in green, and will be on the right hand side of
the period bar. These are the periods into which you can enter and post
transactions. You must have at least one period open.

Any locked periods will have a green cross through them, and will be to the
immediate left of the open periods. These are periods that have been
temporarily made unavailable, which is to say, transactions cannot be posted
into them until they are unlocked. You will do this to prevent accidental posting
of transactions into previous periods.

Closed periods appear in red. You cannot enter transactions into these, nor can
they be reopened. However any transactions that you had entered are still in
the system and can be viewed, printed and analysed.

From this you can determine the period end date, the number of transactions,
and when the period was opened, closed and purged.

Opening a New Period

Before you can enter transactions into a new financial period, it must be
opened. MoneyWorks will offer to open a new period when you open the
document for the first time after the end date of the previous period, or when
you date a transaction in the new period.

You can explicitly open a period at any time as follows:

1. Click the Newbutton
Periods

A confirmation dialog box is displayed.

Note: You should never need to do this. If in doubt, leave it

alone!

Locking Periods:

change the Last day
of Period.

MoneyWorks needs to know the last day of the new period.

If the new period is the first in a new financial year, a different message is
displayed —see a New Financial Year.

2. Check the date of the last day in the period

If your year operates on calendar months, this will be correct. If you do alter
this date, you will be asked for further confirmation.

You can lock periods so that you do not enter transactions into it by mistake.
This is particularly useful when you are awaiting the final accounts from the
accountant at year end.

1. Click on the period you wish to lock and click the Lockbutton

The nominated period (which must be open and cannot be the current
period), and all prior open periods, will be locked.

Automatically Locking Periods: You can specify that periods will be

automatically locked. Thus, whenever you open a new period, the previous
oldest unlocked period will be locked.

1. Set the Keep same number of unlocked periodscheck box

Thus if there are currently two unlocked periods when you open a new
period, the earlier of these will be automatically locked and you will still
have two unlocked periods.

3. Click OKto open the new period

Posting adjustments into locked periods

The new period will appear in the Period Management dialog box. The
period name will also appear in the Period pop-up menu for transaction
entry, allowing you to enter transactions for the period.

You can unlock periods at any time, but this will require that you are the
only logged in user. When periods are unlocked, any other user will also be
able to post into the unoocked periods.

The new period becomes the current period.

1. Click on the locked period you wish to unlock and click the Unlock button

Last day in period: The period-end date is critical. Whenever you enter the date

of a transaction, MoneyWorks scans these period dates to determine into
which period to place the transaction. To change the date for the last day of
a period:

1. Click the Period-End Enable button

The Last day in Periodfield enables, allowing you to enter
the new period-end date.

Click the Period-End
enable button to
The nominated period, and all subsequent locked periods, will be locked.

In MoneyWorks Datacentre 9.1.6 and later, you can temporarily exempt yourself
from period locking in order to post adjustments into locked periods without
unlocking them for everybody.

1. Click the Exempt me from locked period restrictioncheckbox



Periods

Locked periods will remain locked for other logged-in users, but while you
remain logged in, you will be able to enter and post transactions into
periods that are locked. The checkbox will reset when you log out, or you
can turn it off once you have backposted any necessary adjustments.

The period(s) will be closed.

Purging a Period:

Closing a Period:

You should close a period when you are sure that there are no more
transactions for the period. Until a period is closed, the financial results for the
period cannot be considered as final as they can still be changed.

Closing a period is permanent (it cannot be re-opened). For this reason a good
strategy is to Lock periods once they are operationally complete, and only close
periods in the previous financial year once they have been finalised by your
accountant for any end of year adjustments.

Closing a period does not affect any transactions in that period (but you cannot
close a period if it, or any preceding periods, have unposted transactions).

1. Click the desired period to select it and click the Closebutton

You will be asked for confirmation.

If there are unposted transactions for the period, or any
prior period, the Closebutton will be dimmed—you
cannot close a period if it (or a prior period) contains an
unposted transaction. Click the Show unposted
transactionsbutton to review the unposted transactions
in or before the highlighted period.

Purging removes all the transaction records for the period and any previous
period. The account balances remain in the MoneyWorks document until the
period is 91 periods old. A period must be closed before it can be purged.

1. Click the desired period to select it and click the Purgebutton

A confirmation dialog box will be displayed. This may take a few moments
as MoneyWorks will check to see if there are any transactions in the period
that should not be purged. Note that the period must already be closed
(otherwise the Purgebutton will be dimmed).

Click Cancelin the confirmation dialog if you have developed cold feet.

Purging does not affect the following transactions (they will be purged once
they are completed when you purge subsequent periods or if you repurge
the period):

• Incomplete invoices (i.e. ones which are not fully paid).
• Transactions that have not been processed for GST/VAT.
• Unreconciled cash transactions against a bank which has been nominated

as must be reconciled —see Bank Account Must be Reconciled.

Showing unposted
transactions

Note: The transaction records for the period are deleted permanently from the
document. For this reason, before purging a period, you may want to back
up your MoneyWorks document, print a transaction list, or export the
transactions into a text archive with the Export command.

Note: When you close a period, any prior open periods will also be closed.

Note: Purging the transactions permanently removes them from the file. The

space that they took up will be reused when new transactions are entered.
The file itself will not reduce in size. To reduce the file size, you should
compact the file —see Compacting.

Note: Once the period is closed it cannot be reopened, and you cannot enter
transactions into it. If you are unsure, consider locking the period instead.

What if I never purge? If you don’t purge transactions, they will stick around

forever. This may or may not be a good thing—it’s your call!

2. Click Closeto close the period(s)
What Do I Have To Do? If you are running a debtors or creditors ledger, it is a

good idea to print out the Payables and/or Receivables lists as they stand at
the end of the financial year. This will allow you to more easily reconcile
your closing accounts receivable and accounts payable accounts to the
actual outstanding invoices1.

To do this, simply select the appropriate tab in the View by Statusview of
the transactions list (such as Payableor Receivable) and choose Print from
the File menu. Alternatively you could print out the Aged Debtors and Aged
Creditors reports.

You should check with your accountants to find out what information they
will require They may require a stock take as at the end of year, a list of
outstanding debtors and creditors and so forth.

Once you have processed all your invoices and payments for the old
financial year, it would be a good idea to lock all the periods in it. This will
stop you inadvertently entering transactions into the old financial year. You
will unlock it when your final results are available from your accountant, as
you will need to enter some adjusting transactions (such as depreciation).

Changing Period Names

You shouldn’t ever have to do this, but if you do:

1. Choose Show>Period Names...

The period names dialog box will open.

Periods

Opening a New Financial Year

Many accounting systems require special procedures to be carried out to “roll
over” into a new financial year. In MoneyWorks, all you have to do is provide a
name for the new financial year—MoneyWorks does everything else for you.

You can open a new financial year even if you have not completed your accounts
for the previous financial year. MoneyWorks will simply carry forward anything
that is posted in the previous year.

MoneyWorks starts a new financial year if you open a new period when the
current period is the last one for the current financial year. MoneyWorks will
beep three times and display a different New Period dialog.

Note: The Last day in Periodis the date of the end of the first period in the

financial year, not the end of the financial year itself.

What Happens When I Start a New Year? When MoneyWorks opens the first
period of a new financial year, it calculates the difference between the
closing balances of the income accounts and the expense accounts. This
difference is the profit (or loss) for the year. Instead of carrying forward the
closing balances for income and expense accounts into the new year,
MoneyWorks zeros the opening balances for these accounts and adds the
profit to the Profit and Loss (PL) account(s).
