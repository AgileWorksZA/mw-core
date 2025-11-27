# Users, Privileges &#38; Security

Users, Privileges & Security

Deleting Reminder Messages

1. Choose Show>Reminder Messages

The Reminder Messages list will be displayed.

2. Highlight the message that you would like to delete

3. Choose Edit>Delete Message

You will be asked for confirmation.

• Click Delete to delete the message

1 This is not how it was done in versions of MoneyWorks prior to 5.0. ↩

2 You can use the Fill Rightcommand to spread it out over the whole financial
year↩

3 Laphroaig↩

Users, Privileges & Security

For MoneyWorks Gold/Datacentre users, even if you have only one computer,
you may have more than one person who will have access to the accounts data.
In this situation it is probably desirable to control the privileges of each person.
For example, you may want to have your sales reps entering quotes and sales
orders, but you probably don't want them to be able to pay your suppliers, or
see your payroll transactions.

MoneyWorks Security

In MoneyWorks Gold/Datacentre you can:

• Set up multiple user names, each with its own password and privileges.
People can only access your accounts if they have a user name and
password. Their privileges control what types of data and what
MoneyWorks functions they can access.

• Allow only specified users to access nominated reports and forms (invoices,
purchase orders etc) by the use of Signing, and, in reports, by the Check
Privilegecontrol.

• Set up roles, each role having its own set of privileges. You then assign a
user to a role, and they will get the privileges given to that role. For
example, you might have a role called "Payables", and you would assign this
role to each member of your accounts payable team.

• Set up Security Levelson your general ledger accounts and users, so that
users cannot access certain accounts (and transactions) unless they have
the required security level.

Password Protecting your File

The first step in securing your accounting data is to password protect the file, so
that only people who know the user and password can access it. To password
protect your file:

1. Choose Users and Securityfrom the File menu

The Password Controldialog box will appear
Users, Privileges & Security

MoneyWorks Security

Note The Users and Security command is only available to a user with

administrator privileges. Other users will see the command as Change
Password.

2. Turn on the Password Protect “Document Name”check box

The dialog box will expand to show the user list.

MoneyWorks has already inserted a user called Admin who has all
privileges. The first thing you should do is assign a password to this user.
You may also want to change the user name and initials from Admin/adm to
something else.

3. Double-click the user Admin in the list

The User Privileges dialog box for Adminwill open. Admin is the Master
Administration User who always has access to everything (you can’t change
Admin’s privileges). You should at least assign a password for this user, and
you can also change the name and set the initials.

4. Change the User Nameand Initialsif desired

The initials may be up to 3 characters, and can be used in place of the User
Namewhen you log in. The initials of the currently logged-in user are
permanently recorded against every transaction or job sheet entry that user
enters and/or posts. When sharing on the network, the initials are also
recorded for the purposes of the Rollback command.
Users, Privileges & Security

MoneyWorks Security

7. Specify the user’s email address in the Email field

This will be used as the Reply To email address for emails created from
MoneyWorks (and for the BCC address for emails sent via the inbuilt
SMTP)—see Emailing.

8.

If you are connected to MoneyWorks Now(the MoneyWorks cloud
service), and want this user to also be able to access the file, turn on the
Enable MoneyWorks Now Accesscheck box

An email will be automatically sent to the user inviting
them to access the file. They must click the Activate
MoneyWorks Accessbutton in the body of the email to be
able to access the file.

Note: The check box is only available if you are connected
to a MoneyWorks Nowfile.

9. Specify an optional category for user in the Category

field

The MoneyWorks
Nowaccess
checkbox is only
available when
connected to a
MoneyWorks Now
file

This field is intended to provide information about the user that can be
accessed from reports and scripts. For example, a report may self-configure
depending on whether the user category is “SalesPerson” or “Manager”.

The category can be up to 31 characters long, allowing you to overload the
data in the field. For example, you might use a convention of
“branch:reportsTo”, so a report or script knows that user “JOE”, who has a
category of “NY:ANN”, is in the New York office and reports to “ANN”. Thus a
sales report that Joe runs could automatically print out just for New York.
Similarly a script could check that any purchase orders raised by Joe have
been approved by user ANN.

Note: Each user must have a unique name and set of initials. This if both Joan
Smith and Jack Straw are set up as users, they cannot both have their
initials as “JS”.

5. Type a password into the Passwordfield

The password you type will show up as bullets (••••) or asterisks (****).

6. To make sure you got it right, type the password again into the Re-type

10. Click OK

Passwordfield.

If no-one is looking, you can turn on the Show Typingcheck box which will
let you see the password instead of •••• or ****

Note: User Names and passwords are case-insensitive in MoneyWorks.
The Master Administration User is now secured with a password. Now we
can set up additional users who will probably have different privileges.



Users, Privileges & Security

Setting up Roles

Before you set up additional users, it might be an idea to consider setting up
roles for each of your types of users (e.g. sales, payables, receivables). A role can
be assigned to different users, so if you have four sales staff for example, you
don’t need to set up their privileges separately.

To create a new role:

1.

In the Users and Security dialog box, click the Newtoolbar icon above the
users list (or press Ctrl-N/⌘-N)

A new User Privileges window will open.

MoneyWorks Security

3. Enter a unique name for the role into the Role Namefield

This is the name that you will see in the user/role list. It should be something
descriptive to indicate the type of users who should be assigned to the role.

4. Set the appropriate privileges for the role

These are the operations that users with the role can perform. A table of
privileges is provided here.

5. Click OKto save the role

Tip: If the role is largely the same as a previously created role, just duplicate the
other role, assign a new name and turn on/off the appropriate privileges.

2. Set the Typepop-up menu from “User Login” to “Role”

The contents of the window will change to show the role information.

To set up an additional user

1.

In the Users and Security dialog box, click the New toolbar icon above the
users list (or press Ctrl-N/⌘-N)

A new User Privileges window will open.
Users, Privileges & Security

MoneyWorks Security

If you want to assign a role to this user:

6. Choose the role from the Privileges or Rolepop-up menu

If you want this user to have their own privilege set:

7. Turn off any privileges that are to be denied this user

8. Click OKto accept the changes

Note: The first privilege under the Administration heading is Users and Security.
If you are denying any privileges to a user, this must be one of the ones you
deny. Otherwise the user can simply grant themselves any privileges they
want.

Another important privilege to consider is the Form & Report Signing
privilege. If access to any form or report is to be denied to a user, this
privilege must be turned off for that user. You can then use Signingto allow
particular forms or reports to be used by the user .

Typically you will allow privileges according to the job description of the user.
Someone whose responsibility is limited to entry of sales orders should probably
have all privileges denied except those under the Sales heading, and possibly
Enter Invoices. Such a user may require a signed invoice form in order to be able
to print invoices for sales. See Protecting Reports and Forms by Signingfor
further information.

Tip: You can turn off or on all of the check boxes under a heading in the list by

clicking the checkbox next to that heading. If, under any particular heading,
some of the privileges are allowed and some denied, the check box for the
heading will show a dash (Macintosh) or a grey tick (Windows).

Note: If a user attempts to access a command for which they do not have

privileges a message will be displayed.

This is a normal user. You can either assign a role (with its associated
privileges), or you give this user their own, unique privileges. A table of
privileges is provided here.

2. Ensure the Typepop-up menu is set to “User Login”

3. Type a user name, initials and (if required) a password for this user

(remember the password needs to be typed twice)

Note: It is possible to leave the password for a user blank. If security is not a

concern then feel free to do this.

4.

If this user is only going to be allowed read-only access, turn off the This
User Can Make Changescheck box

5.

If necessary, set the user’s security level

This determines what general ledger accounts and transactions they can view.
Users cannot see accounts or transactions which have a higher security level
(more stars).

Note: The category and the security are assigned to the user, not the role. So

different users with the same role can have different categories and/or
security levels.
Users, Privileges & Security

MoneyWorks Security

To delete a user or role

1. Highlight the userrole in the Users list and click the Deletetoolbar icon

The Master Administrator user cannot be deleted.

A role can only be deleted if there are no users assigned to it.

To change or remove a password

As a user: You can change your own password by choosing Change Passwordin
the File menu. This displays the Change Password dialog described below.

As an administrator: Provided you have the Users and Securityprivilege on, you
can change or remove other user’s passwords by clicking the Change
Passwordbutton in the User Privileges window—this displays the Change
Password dialog.

1. Enter the new password in both the New Passwordand Verificationfields,

and click OK

The password you enter must be the same.

To remove an existing password leave these two fields empty.

To change a user’s privileges or role

1. Double-click the user in the Users list

2.

3.

If the user has been assigned a role, change the role in the Privileges or
Rolepop-up menu

If the user has individual preferences, click the check boxes to change
privileges

4. Click OKto accept the changes to the user

If the user is currently logged in over the network, their privileges will be
updated pretty much immediately. If you have changed their user name or
initials, these changes will not take effect until they next log in—their old initials
will still be recorded against transactions they enter/post.

To change the privileges for a role

1. Double-click the role in the Users list

The privileges set for that role will be displayed

2. Change the privileges as required

3. Click OKto save the new privilege set

When users with that role next log in, they will get the altered privileges.

Note that you can also change the name of the role without affecting the
membership of that role.
Users, Privileges & Security

Logging in when you Open a document

Logging in when you Open a document

When a document has the Password Protect option set you must supply a user
name (and password, if one has been specified), every time you Open or
Connect to the document. In this situation, the Log Indialog will appear

1.

In the User Namefield type your user name or initials

MoneyWorks will remember the last user name you logged in with on this
computer and enter it for you.

2.

In the Passwordfield, type your password

Note: User Names and passwords are case-insensitive in MoneyWorks.

Note: If your password is stored in your keychain (Mac) or your Vault (Windows)
and this is unlocked, your password will be entered for you when you tab
out of the User namefield. If your keychain/vault is locked, MoneyWorks
will invite you to unlock it. If your User Name was also pre-entered for you
then there’s nothing to do - just click Log In.

Additional options are available if you click Show Options

Connect in Read Only Mode This opens or connects to the document with read-
only privileges. You will not be able to make changes. Note that this is not
the same as opening a read-only document (one that is locked or stored on
a read-only volume), since the file will still be updated and some changes
may be made automatically by MoneyWorks—such as creating recurring
transactions.

Don’t Hide Password This makes the text in the Password field readable (instead
of •••• or ****). Use this option to check that you are typing what you
think you are typing, for example if a log in fails due to an incorrect
password. If you get unexpected characters showing when you try to type
your password, check carefully that there is not a book resting on your
keyboard and that none of the keys on your keyboard are stuck down.

Add Password to Keychain/Vault Click this if you want to store the password
you have typed in your keychain (Mac) or vault (Windows). The password
will be associated with the document you are opening and the user name
you have typed.

3. Click Log In

The document will open.

Now that you are logged in, MoneyWorks will enforce any privileges, or rather,
lack of privileges that you might have. If you try to perform any operation that is
not allowed in your privileges list, you will get a message informing you that you
do not have privileges for the operation.
Users, Privileges & Security

Protecting Reports and Forms by Signing

Protecting Reports and Forms by Signing

2. Click the Signingbutton to display the Signing dialog box

Since MoneyWorks allows so much customisability of reports and forms, to the
extent of being able to include information from pretty much anywhere in the
database, it is necessary to be able to secure this avenue of data extraction.

The administrator can restrict access to reports and forms for particular users by
a mechanism known as signing. This is controlled by the Signing and Using
Unsigned Forms and Reportsadministration privilege. If you do not want a user
to have access to reports and forms, you should turn this privilege off for that
user. You can then make specific reports and forms available to that user (for the
current document) by signing them for that user.

Note: Forms and Reports are signed to be used by particular users with a

particular document.

Note: A user who does have the Signing and Using Unsigned Forms and Reports
privilege may print any report or form without it having to be signed first,
provided the report is not subject to a Check Privilegecontrol.

Where do custom forms and reports go?

With single-user MoneyWorks, customised forms and reports are stored in a
folder called MoneyWorks Custom Plug-Ins that is in the same directory as the
MoneyWorks accounts data file.

With multi-user MoneyWorks, the accounts data file resides on the server, and
cannot be seen from a client computer. Therefore, for clients who connect to a
shared MoneyWorks document, MoneyWorks will provide access to custom
reports and forms that it finds in the MoneyWorks Custom Plug-Ins folder—see
Managing Your Plug-insfor information on this). If you are logging into a
document hosted by MoneyWorks Datacentre, the server will deliver any
custom plug-ins automatically.

To Sign Forms and Reports

3. Select the user(s) for whom you wish to sign files

4. Select the report and form files that you wish to sign.

The list will show all of the custom and standard forms and reports residing
in the MoneyWorks Standard Plug-Ins and MoneyWorks Custom Plug-Ins
folders on the computer that you are sitting at. You cannot sign standard
reports, but note that access to these is generally controlled by one of user
privileges. For example you cannot run reports based on the general ledger
unless you have the Account Enquiry privilege.

5. Click the Signbutton

To see which users of the current document the form/report is currently
signed for, select the file and click Check Signature.

Note: The form is signed on the local machine only. You will need to upload
it to Datacentre (Uploading Reports and Forms) or manually copy it to Gold
workstations.

1. On the users computers, log in to the document using your administrator

user name, and choose File>Users and Security

To unsign a document You can unsign a document for particular users by
following the steps for signing, but click Unsigninstead of Sign.
Users, Privileges & Security

MoneyWorks Security Levels

If you are doing the signing on a computer other than the one that will be used
by the unprivileged user, you will need to copy the files that you have signed
into the MoneyWorks Custom Plug-Ins folder on that user’s computer.

If you are using MoneyWorks Datacentre you can use the Uploadtab to upload
the signed file to the server for automatic distribution to clients the next time
they log in. See Uploading Reports and Forms.

The Revoke Allbutton will revoke all signatures ever issued for the accounts
document.

Note: If changes are made to forms and reports (even using an earlier version of
MoneyWorks which does not know about signing) this will invalidate the
signature. They will need to be re-signed before they can be used by
unprivileged users.

MoneyWorks Security Levels

Privileges protect functional areas of your MoneyWorks file from being accessed
by unauthorised users. So for example a purchasing officer might be able to only
view/modify purchase orders, purchase invoices and payments.

But payments encompass more than just purchases. For example a payroll
transaction is normally recorded as payment, and you don’t necessarily want
your purchasing officer to have access to your payroll.

The account’s security level is also stamped onto each line of each transaction,
and the transaction’s security level is set to the highest security level of the
enteredlines. This means that a user cannot see transactions that use accounts
with a higher security setting.

Note: The security check on transactions applies to entered lines only, not the
contra account (bank account, payable/receivable control account), or any
lines added automatically by MoneyWorks, such as GST/VAT/Tax lines, stock
adjustments and currency lines.

Security levels for accounts (and hence transactions) are set and maintained in
the Account List.

Important: When you change the security level on an account, MoneyWorks

needs to update the security level on all detail lines that use that account,
and their corresponding transactions—depending on the size of your data
file, this may take some time to apply the changes.

MoneyWorks Privileges

The table below lists the privileges.

Tip: You can set up “generic” users, and duplicate these, so (for example) users

in the same department have the same privileges.

Note: If you are converting from MoneyWorks 4, you will need to set up your

This is where security levels come in. They “cut across” the functional parts to
provide an additional layer of protection to general ledger accounts and to any
transactions that use them. Thus a user with a security level of:

privileges again.

Privilege

Notes

cannot see or access accounts with a higher security level (more stars), such as:

Administration
Users and
Security
(Administrator)
Period
Management
Auto Open
Period
Document
Preferences
Signing and
Using
This gives access to the privileges setup, and hence should be turned off for
all users except administrator.

User can open a period while entering a transaction by entering a date
beyond the current period.

Users without this privilege can only print forms and reports that are signed
to them.



Users, Privileges & Security

MoneyWorks Privileges

Unsigned
Forms &
Reports
Revert/
Rollback
Remote Save
Diagnostics
Auto
Allocations
Backup

Reminders

Execute
External
Scripts

Importing
Exporting
Company
Details
Log File
Customise List
Views
Customise
Validation Lists

Purchases

Enter Orders
Process Orders

Creditors

Enter Invoice
Pay Invoices
Payments
History
Change Bank
Account

Sales

Enter Orders
Process Orders
Process Partial
Orders
See Margins

This privilege controls ability to Save on Datacentre (i.e. commit changes).

This disables the ability to define auto-allocations--they can still be used.

Controls the ability to save a backup. Both this and Remote Save are required
for backup to client on Datacentre.
This controls access to creating reminders; not seeing them. The ability to see
Overdue debtors/creditors auto messages is controlled by the “Debtors” and
“Creditors” privileges.
Turn this on for users who need any COM/AE interaction, such as
communicating with FileMaker or Excel, or starting Scripts in the Command
menu. Note that external scripts can export any information in the database,
and hence for maximum security, this privilege should be denied unless it is
really needed.

Controls the capability of changing the electronic bank account details (for
creditor payments).

Turn this off if you don't want the user to see product margins when entering
transactions.
Debtors

Enter Invoices
Receipt
Invoices
Payments
History
Statements
and Ageing

Cash

Enter
Payments
Enter Receipts
Banking
Bank
Reconciliation
Change
Opening
Balance on
Bank Rec
Accept
Unbalanced
Bank Rec
Clear Bank
Recs
See Balances
in Bank Popup
Load Bank
Statement
Edit Currencies

General Ledger

View Accounts
Create
Accounts
Modify
Accounts
Delete
Accounts
Budgets &
Balances
Enter Journal
Adjustments
GST/VAT/Tax
Report/
Finalisation
Account

Turning this off suppressing the bank balance display in the bank pop-up
menu



Users, Privileges & Security

MoneyWorks Privileges

Enquiry
Change Tax
Table

Jobs

View Jobs
Create Jobs
Modify Jobs
Delete Jobs
Enter Job
Sheet Items
See All Job
Sheet Items
Bill Jobs
Use
Completed
Jobs
Products

View Products
Create
Products
Modify
Products
Delete
Products
Build Products
Stock Journals
Stock Enquiry
Sales Enquiry
Purchases
Enquiry

Names

View Names
Create Names
Modify Names
Delete Names
Sales Enquiry
Purchases
Enquiry
Adjustments
Elective Posting

Expression
Evaluation
Delete Unposted

If this is off, the user will only be able to see the job sheet entries that they
themselves have made.

Transactions/
Orders
Print Unposted
Invoices
Make Changes to
Posted
Transactions
Use `Replace`
Command
Unlimited Write-
offs

Override Pricing
and Terms

Edit Off-Ledger
values
Detail Lines List

Select Filters

User Privilege
1...6

If this is off, the amount that the user can write-off when processing an
invoice is limited to the Limit on the fly write-off amount specified in the
Terms panel of the Document Preferences.
If this is off, the user will not be able to override discounts and terms when
entering transactions (discounts on imported transactions can still be over-
ridden).

If this is off, the user will not be able to access the Detail Line list in the Show
menu.
If this is off, the user will not be able to change filters, and thus will be
constrained by whatever filters are in operation when the user was set up.
These are for your own use, and can be used to control access to reports and
scripts using the Allowed()function.

Copying Settings between users

If you are connected to Datacentre, you can copy user settings (customised
columns, filter settings, custom validations, preferred forms, default accounts,
tab order, etc) from one user to another.

To copy these preferencess from user A to
user B:

1. Make sure user B is logged out

2.

In Users & Security, double-click user
A

If this is Off, the user will not be able to post transactions (except those
automatically posted, such as adjustments).
If this is off, the user cannot enter an expression (i.e. something starting with
=) into a MoneyWorks field, or customise a list using a calculated value.

3. Click the gear button and choose Copy User Preferences

4. Close the dialog for user A

5. Double-click user B (the one for whom you want impose the settings)
