# Names

Names

5 MoneyWorks supports QIF, OFX (SGML and XML), QBO, QFX formats, the most
common ones used by banks.↩

Names

6 This menu can also be augmented with custom importing scripts to import any
format you wish, including CSV-based formats (in fact the OFX-XML importer is
implemented using an open-source mwscript).↩

7 A reconcilable bank account has the Bank Account must be Reconciledoption
set↩

8 Is this an oxymoron?↩

9 The list only shows those reconciliations done using MoneyWorks 3 or later. If you
want to reconstitute an earlier bank rec, hold down the Ctrlkey (Windows) or the
Optionkey (Mac) when you click the Load Oldbutton. Note that MoneyWorks does
not know the opening and closing balances of these earlier reconciliations.↩

In the course of operating your business, you will be in contact with other
people and organisations. MoneyWorks stores the details of these contacts in
the Namesfile, which is a list of organisations and contacts, with a set of tabs to
organise it into type—customer, supplier, creditor etc. To view the Names list:

1. Choose Show>Names or press Ctrl-2/⌘-2

What’s in a Name?

A name recordstores contact and address information about customers,
suppliers and other people or organisations that you might contact from time to
time. In MoneyWorks we refer to these as Names. Each Name is referenced by a
unique code, and the record is referred to for details whenever you make a
transaction involving that person or organisation.

Each Name can have multiple contacts (i.e. individuals in the organisation), and
you can store contact details, such as phone and email addresses, against these.
The number of contacts per Name is effectively unlimited. Additionally contacts
can be assigned a role, such as "Purchasing" or "Accounts".

As well as address information, the Name also stores aged balances for debtors,
and the current owing for creditors. If you store bank account details, you can
print out bank deposit slips for money received, or for creditors, create direct
payment files for submitting to your bank’s on-line payment system1.
Names

Creating a New Name

Using Name records can also speed up data entry. Not only can the customer or
supplier name and address be automatically looked up, but a default general
ledger allocation can be entered for you.

You can also keep a record of phone calls, meetings etc. that you have made
with the Name, and have MoneyWorks remind you when follow-up action is
required. This forms a simple CRM (Customer Relationship Management)
system.

Note: If you are transferring information from another accounting or database
system, you can probably import the information —see Exporting and
Importing.

Creating a New Name

You can create a new Name directly in the Names list, or you can create one “on
the fly” when you enter a new Name code into a transaction by clicking the New
button in the choices list —see Creating a Record “On the Fly”.

The name record is organised into tabs as shown:

1. Enter the code for the Name

This can be up to eleven characters long, and is used to uniquely identify
the Name. It is a good idea for the code to start with the same letters as the
actual company’s or person’s name. This makes the code easier to
remember or guess if you don’t have it to hand (e.g. SMITH for Smith Print
Ltd is easier to remember than 17802).

In MoneyWorks Express and Gold, you can automatically
create a unique code using the Code Assignment options
in the TermsPanel of the Document Preferences. The
code will automatically be created using the letters you
type in when creating the Name (just use the first few
letters of the actual name). This will then be padded to
the specified number of digits with a unique number. E.g.

You can
automatically
append a unique
number onto a new
name code by
setting Code
Names

Creating a New Name

the first time you create a code 'SMI' it will be padded to
'SMI000', the next one will be 'SMI001' and so forth.

Template; The Template check box is used to create a

Assignmentoptions
in the Terms panel
of the Document
preferences.

template record for new contacts in Gold and Express. You cannot use the
template record itself, but if you enter the template’s code into a new
transaction, a new Name record will be created automatically with the
same information as in the template record. A number will be appended to
the template code to make it unique.

2. Enter the organisation or person’s name into the Name field

3. Set the Colourif you want

You can use this to easily identify names. For example, you might have your
customers of doubtful financial means in red.

4.

If necessary, set the type of Name from the check boxes along the top of
the window

These will be automatically set for you, depending upon the context in
which the name is made. Note that a Creditor is a Supplier who gives you
credit, and a Debtor is a Customer to whom you extend credit. Creditors
and Debtors are not available in Cashbook.

Details

The Detailstab contains basic address and the categorisation information.

1. Enter the Postal, Delivery, Phone and Fax information

If the postal and delivery addresses are the same, use the
transfer button to copy the postal address into the
delivery address.

The Transferbutton
copies the postal
address to the
delivery address.

2. Enter the GST#, VAT#, ABN or other tax number of the entity

Some jurisdictions require you to store the tax number of your suppliers
and/or customers.

3. Enter the Web URL if known
Clicking the Gobutton will activate your browser and take you to the
site—handy for accessing on-line price lists.

4. Enter their code for you in the Their Reffield

This can be used on statements and direct credit banking files.

5. Enter any text comments into the Comments field

You can store up to 255 characters in this field.

The category fields can be used to analyse sales (or purchases) for the Name by
whatever criteria you choose to store, e.g. a regional code in one category, or a
code to identify low or high volume customers, wholesale or retail.

You should be consistent about what information is stored in the category fields.
For example, if you are storing a regional code in the first category field then
always use it for this—don’t be tempted to put other information such as size of
business into the field. The powerful analysis reports in MoneyWorks can
summarise purchasing and sales information for you by these fields—see
Analysis Reportsfor further information.

6. Enter up to four categories to be associated with the contact in the

Categoryfields

You can enter up to 7 characters into these fields. By default, the first of
these categories displays in the Names list window (you can customise the
list to remove this, or add the others—see Customising Your List.

The Customfields are for your own use. The first two fields can contain up to
255 characters each, and the others up to 15.

Pricing and Terms

The Pricing and Termstab is where you set the pricing for customers, and the
details for debtors and creditors. In Cashbook it is called Pricing and Coding, and
is used for specifying tax-overrides and default allocations.



Names

Creating a New Name

Pricing and Coding (Cashbook)

Pricing and Terms (Express and Gold)

Customer Discount: The customer discount is an additional discount that the

customer can use above and beyond that determined by the price code, for
any product that has its discount field set to “Customer” or “Customer and
Product” —see Sell Prices.

Price Code: Use the price code setting to determine the default product pricing
level which the customer will attract —see Multiple Prices. This can be
overridden at transaction entry time, and only applies if you have set up
multiple prices.

Override Tax Code: In certain instances you might want to override the default
tax code used in transaction entry (e.g. if the Customer/Supplier is located
overseas there will probably be no GST/VAT or local Sales Tax). Set the pop-
Names

Creating a New Name

up menu to the Tax code you want applied to all transactions from the
contact. Note that this does not override the * code, or the Tax on the
Freight Codeproduct of an order.

Creditor Terms: For creditors only: the payment terms that you are given by the
creditor. These are used to calculate the due date of invoices received, and
operate in the same manner as debtor terms (see above).

Currency: In MoneyWorks Gold, if you have defined more than one currency
(see Multi-Currency), you will be able to specify the currency of the
customer/supplier. All transactions for that customer/supplier will be
deemed to be in that currency. Note that once the record has been saved,
you will not be able to change this.

Requires Order Number: If set, you will not be able to enter a sales order/

invoice from this customer unless there is a value in the order number field.

Accounts Payable Control Account: The general ledger account which will be

credited whenever an invoice is received from the creditor. You can create
more than one control account if required, although one will suffice for
most businesses.

Payment Method: The usual method by which you will pay the creditor. This is
particularly useful if you are paying by direct credit through your bank’s on-
line banking service —see Manual Electronic Payments.

Debtor Terms: For debtors only, the terms that you are giving them. These are

used to calculate the due date of invoices sent. The type of terms are set by
the Termspop-up menu, and can be either on a certain day of the following
month, or within so many days. If the Overdue Warnings at Startupoption
is set in the Terms Preferences, you will be alerted when you start
MoneyWorks if there are any overdue invoices.

Prompt Payment Discount: Use this to specify the prompt payment discount
terms and percentage (if any) you have been offered by this supplier. The
discount is expressed as a percentage, and is applied to the transaction
total based on the transaction date. It can expire on a given day of the
following month, or last for the specified number of days. For details on
accepting the discount, see Paying Creditors Individually.

Credit Limit: The amount of credit that you will extend to the debtor. A zero

value represents unlimited credit. If the Auto Credit Holdoption is set in the
Terms Preferences, you will be alerted if the debtor exceeds the credit limit.
If you don’t extend credit, make the Name a Customerand not a Debtor
(which will limit transactions to cash ones).

Prompt Payment Discount: Use this to specify the prompt payment discount

terms and percentage (if any) you are giving to this debtor. The discount is
expressed as a percentage, and is applied to the transaction total based on
the transaction date. It can expire on a given day of the following month, or
last for the specified number of days. For details on receipting the
discounts, see Prompt Payment Discounts.

Note: It is important that your prompt payments are correctly set up for
your region. Please see the PPD preference settings.

Hold: If the Holdcheckbox is set, any transaction created against the Name will
also have its Holdbox set, so it cannot be posted. You can uncheck the hold
box on the transaction if you do want to accept the transaction. This is a
good way of giving discretionary control over whether you deal with certain
contacts.

Salesperson: Set this field to the value that you want to be automatically
transferred to the salesperson field when you use this Name in a
transaction.

Note: It is important that your prompt payments are correctly set up for
your region. Please see the PPD preference settings.

Bank

Accounts Receivable Control Account: The general ledger account which will be
debited whenever an invoice is raised against the debtor. You can create
more than one control account if required, although one will suffice for
most businesses.

The bank details for the contact are maintained in the Bank tab. The first set of
bank details are intended for creditors, and this is the information that will
appear on the bank deposit slip when we bank money from the creditor.
Names

Creating a New Name

Balances/History

This tab displays a list of historic transactions against the name, and in
MoneyWorks Express and Gold, the current debtor/creditor balances.

They Pay by: This is the payment method that the debtor normally uses to pay
us. Whenever money is receipted from the debtor, the Paid Byof the
receipt will default to this.

Bank, Branch and Account Name: These details are used for preparing bank

deposit formswhen the customer pays by cheque. The details are displayed
on the entry screen when receipting cash, so you can check at the time of
entry whether they are using a different bank account. These can be
overriddenon individual transactions.

Electronic banking details for when we pay them: The actual bank account
number that is used when preparing files for electronic banking. The
account number should be filled out in the format indicated and will be
automatically zero-filled if required —see Account Number. The ability to
enter/edit this is a user privilege.

Credit Card Details: Their credit card details. When they pay by credit card these

will be used unless overwritten on the transaction.

Debtor: This displays the aged balances for the debtor. You cannot alter these
values—the balances are automatically increased whenever an invoice is
posted, and reduced whenever payment is received. The aging is controlled
by the Age Debtor Balancescommand—you can also calculate aged
balances for various different aging intervals using the Aged Receivables
report.

Creditor: This displays the current balance for the creditor (i.e. how much you
owe this creditor). It cannot be altered. It is automatically increased
whenever you post an invoice received from the creditor, and reduced
when payment is made. The Aged Payables reportwill print out an aged
listing of creditors.
Names

Creating a New Name

Transaction History: This displays a list of all transactions against the Name. It
can be sorted by clicking on any of the column headings, and the columns
can be changed to show other information if required —See Customising
Your List. You cannot search this list or double-click a transaction to view it.

Incomplete Only: Click this if you want to see just the outstanding invoices.

Contacts

MoneyWorks allows you to have as many contacts for an organisation (Name) as
you want. These are managed under the Contactstab of the Name record.

Prior to MoneyWorks 8, only two contacts were available in MoneyWorks. These
appear as the first and second contacts in the list (and are labelled 1 and 2).

Important: Changes and additions or deletions that you make to the contacts

list are not saved until (and unless) the OKor Nextbutton on the Name
window itself is clicked. Clicking Cancelwill discard any changes/additions
to the contacts.

To add a contact

1. Click the Newicon on the right of the contacts list

A new (empty) contact will be added.

2. Fill out the appropriate details in the fields on the right

Name:The person’s name

Salutation:The person’s salutation

Position:Their position within the organisation

Phone/DDI:Their phone number

Mobile:Their mobile number

After Hours:Their after hours number

eMail:Their eMail address

Memo:Free form notes about the contact

The Newand
Deleteicons are
used to create and
remove contacts.

The contacts tab displays the contact details for people who belong to the
organisation, as well as a list of recent contacts made.

To modify a contact

3.

If the contact has a specific Role, assign it from the role pop-up menu

1. Click on the contact in the list
Names

Creating a New Name

The details for the contact will appear in the fields on the right

Defining Roles

2. Change any of the information as required.

To delete a contact

1. Highlight the contact in the list

2. Click the Deleteicon to the right of the list

The contact will be deleted.

To re-order the contacts

1. Drag a contact record up or down in the list to change the order of the list

Note: Deleting one of the first two contacts in the list, or changing their order by
dragging, will have the side effect of updating the name.contact1 and/or
contact2 fields.

Roles

Roles are used to help manage your contacts and your communications with
them. They are essentially labels that you can optionally assign to a contact.
Thus you might assign a role of “Payables” to a person at each of your
suppliers—when you make payment, you would send the email remittance
advice to people with the “Payables” role.

You can define up to 16 roles (in Edit>Document Preferences, see below), and
more than one contact within the same organisation can have the same role.
Similarly a contact might have more than one role (for example, they might have
roles of both “Payables” and “Receivables”.

Roles are defined in the Document Preferences

1. Choose Edit>Document Preferences to open the

Document Preferences window

2. Click on the Fields panel

The Contact Rolescan be seen at the bottom right of the
window

3. Click on one of the 16 roles

Roles are named on
the Fields panel in
the Document
Preferences

4. Type the name (up to 15 characters) into the Role name field.

Note that, changing the name of a role does not affect the contacts who have
been assigned that role (their role is merely relabelled as well).

Assigning roles to a contact

Roles are assigned (and unassigned) to contacts using the Rolepop-up menu. In
the example below, Freda has both the CEO and the CFO role.

To assign a role, select it from the Rolepop-up menu. The role will be added to
the existing roles (if any) for that contact, and will be ticked in the pop-up menu.

To remove a role (one that is ticked in the Rolepop-up menu), reselect it from
the menu.
Names

Note that the changes only come into effect when the Name itself is saved.

To Add a Contact Memo

A Note on importing contacts

1. Click the Newbutton, or press Ctrl-N/⌘-N

For compatibility reasons, the original contact1 and contact2 details are stored
as before in the nametable (these appear at the top of the contacts list, and are
labelled 1 and 2). You can use the name.contact fields to import into these.

A new contact note will be created

2. Type the details of the contact into the Memofield

Creating a New Name

Click the Newicon
to create a new
contact memo.

Any additional contacts are stored in the Contactstable in MoneyWorks, and
will need to be imported into that table (you will need the code of the
customer/supplier to be part of the import).

Roles are imported by specifying their role “index” — this maps onto the role
names as specified in the Preferences. Because there are 16 roles, and a contact
can conceivably have several roles, membership of a role is identified as a bit
setting in a 16-bit Rolefield. Thus #012 is role 1, #02 is role 2, #04 is role 3, #08 is
role 4, and #0D is roles 1, 3 and 4).

3.

If you wish to take follow-up action at some future date, type a date into
the Recall Datefield

A reminder message will be generated for you when MoneyWorks is next
opened on or after that date.

To Delete a Contact Memo

1. Click on one of the fields of the Memo

Click the Delete
icon to delete a
contact memo.

Importing updates to existing roles: To update an existing role for a contact, you

The field you clicked on will be selected

must uniquely identify the contact record. Use the
contact.sequencenumber for this. Note that contact1 and contact2 can be
updated using the name.contact fields.

Contact History

The contact history is a list of contacts made to the client. Use this list to record
contacts made, or remind you of contacts to make in the future.

2. Click the Deletebutton

The note will be deleted.

To Set a Reminder

1. Enter the date that you want to be reminded into the Recall Datefield

When you start up MoneyWorks on or after that date, a messages will be
displayed if there are any recalls that are due on this date.

To print the list of memos, click the Print icon.
Names

Creating a New Name

AutoCode

The AutoCode tab allows you to specify an automatic allocation that is applied
to a new transaction for the customer or (more normally) the supplier:

Double clicking on the message will take you to a list of the Name records that
need to be followed up. Note that you will have to clear the subsequent recall
date to stop the recall from coming up every day.

To Clear a Recall

Unless you clear a recall, you will keep getting reminders every
time you start MoneyWorks.

Click the Clear
Recallicon to clear
all old recall dates.

1. Delete the recall datefrom the memo

You can clear all the old messages (i.e. recall dates on or before today) for the
name by clicking the Clear Recallicon.

To reorder the memos

You cannot sort the memo list. However you can re-order the list in the same
way that you can re-order detail lines by holding down the option key (Mac) or
the Ctrl and Shift keys (Windows) and dragging a memo line up or down.

For example, if the Name record is for your electricity supplier you would set the
allocation account to your Electricity Expense Account. Then, whenever you
enter the name code into a transaction, the allocation will be automatically
done to the electricity account for you.

Allocate Enter the percentage of the transaction amount that is to be allocated

to the default account.

Default Account The general ledger code that will be automatically inserted into

the first detail line of the transaction.

Other Account If the Allocate percentage was not 100%, enter the general

ledger code for the balance of the amount. This will be automatically put
into the second detail line of the transaction.
Names

Modifying and Deleting Names

As an example, if you can only claim 30% of your electricity for business
purposes (you have a home office), you would enter 30% in the Allocate
amount, and have the Other Account set to Drawings, as shown.

Note: The Auto-Allocation is done whenever the value of the Amountfield of

the transaction is changed.

Modifying and Deleting Names

Most of the information in a Name record can be changed at any time. However
you can only change the code when you are the only user —see Changing
“code” fields. This is because a changed name Code will be automatically
reflected in every transaction that uses that code.

You can only delete a Name provided it has a zero balance and there are no
transactions for it. If you try to delete a Name that does not meet these criteria,
you will be asked to merge it with one of the same type (debtor, creditor etc.).

Type the code into which the name will be merged, or select it by clicking on it
in the list. All the transactions associated with the original name will now be
made out to the one with which it was merged.

Tip: Codes whose first character is a tilde (“~”) will not appear in the Choices

list. Set up a code such as “~OLD”, and merge your old names into this.

Head Office Billing

You can set up your debtors so that invoices and/or packing slips can be sent to
a particular branch, but the payment can be made by a head office. Similarly for
Creditors, you can purchase from individual branches and make payment to the
head office. This is not available in MoneyWorks Cashbook.

Head office billing is implemented by means of a coding convention for the
names involved. The rules are as follows:

The code for a Head Office must end in a period.

E.g. MITRE10. (Note the dot)

Branch codes consist of the head office code and an appropriate suffix.

E.g. MITRE10.AKL, MITRE10.WTN

You can change the codes at any time (which means you can easily assemble
existing names into branches and head offices).

Invoicing: Invoices are made out to each branch (e.g. MITRE10.AKL). When
printed, the invoice will have the head office address, and the delivery
address of the branch3. The head office can itself be treated as a normal
debtor for invoicing purposes if required.

Statements: Statements can be printed for either the head office or an

individual branch. If a head office is selected, all relevant transactions for its
branches (and any for the head office) will be included in the statement.

Receipts: When a head office code is typed into the code field in the Batch

Debtor Receipts or a cash receipt, all outstanding invoices for it and any
branches will be displayed and can be marked off.

Creditor Invoices: Creditor invoices can be put to a branch, and payment made
either to the branch or to the head office through the Batch Creditor
Paymentscommand or the cash payment entry screen.
Names

Importing your Address Book

If you pay invoices to several branches of the creditor using the Batch
Creditor Payments command, only one cheque will be raised. If you need to
pay just one branch creditor, use a Payment and enter the full branch code
into the Supplier field.

Note that a Creditor is a Supplier who gives you credit, and a Debtor is a
Customer to whom you extend credit. Creditors and Debtors are not
available in Cashbook.

4. Click Import

Importing your Address Book

On the Mac only, you can import the address book direct into MoneyWorks.
New entries in the address book will be added, and changed entries will be
updated.

1. Choose File>Import>Address Book

The Import Address Book settings will be displayed

The information in your address book will be transferred into MoneyWorks,
with any previously imported entries being updated. Codes for the new
entries will be automatically created based on the first few letters of the
name.

2 A constant preceded by a # represents a value in hexadecimal (base 16). That #0F,
#10, #11 represent decimal 15, 16 and 17 respectively.↩

1 For supported banks only.↩

3 Invoice and statement forms should use the Transaction.MailingAddress and
Transaction.DeliveryAddress magic fields to take advantage of head office billing.↩

2. Unless you want to import all entries, set the Group pop-up to the

Address Book group you wish to import

3.

Indicate the type of Name record to create in MoneyWorks
