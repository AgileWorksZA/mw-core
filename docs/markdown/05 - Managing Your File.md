# Managing Your File

Managing Your File

Because the Setup account has transactions against it, it cannot just simply be
deleted. Instead, MoneyWorks allows you to merge the account with another of
the same type —see Merging Accounts. We recommend that you create a
“Suspense Account” (if none exists), and merge the Setup account(s) with this
by doing the following:

1. Display the list of accounts by pressing Ctrl-1/⌘-1

2. Highlight the Setup account(s)

3. Choose Edit>Delete Account

You will be prompted for an account code of the same type.

4. Click on the account named “Suspense Account” in the list

5. Click Merge

The opening transactions will now refer to the suspense account instead of
the Setup account. The Setup account record(s) will be removed.

1 Something like an incorrect opening bank balance can be corrected later on, so is
not a disaster. But better (and much easier) to get it right at the outset.↩

2 For simplicity, we will refer to VAT and Sales Tax as GST in the remainder of this
chapter↩

3 If you don’t use the bank balances screen to establish your bank balances, you will
need to do a special bank reconciliation to clear any journalled amounts.↩

4 If it doesn’t, check the period end date —see Managing Financial Periods.↩

Managing Your File

The information you enter into MoneyWorks for a company or entity is kept in a
document (also known as a file). Since the document contains vital accounting
information, it is important that it is managed properly and backed up regularly.

Opening Your Document

Open your document from the MoneyWorks Welcome screen by double-clicking
it in the Recent Documents list, or by using the Open Otherbutton. Alternatively
double-click the document icon in the Finder (Mac) or Windows Explorer.

Note: If you are connecting to a MoneyWorks Datacentre Server or using the
MoneyWorks Now cloud service, use the Connectinstead of Open Other.
See Accessing a shared document

Note: Unless the Multiple InstanceMoneyWorks Preference is on you will only

be able to open one MoneyWorks document at a time.

Note: MoneyWorks Gold can open any MoneyWorks Cashbook and Express

files. However MoneyWorks Cashbook can open a MoneyWorks Gold (or
Express) file only if no Gold (or Express) features, such as invoicing, have
been used in the file. Similarly Express can open all Cashbook files, but only
those Gold files which do not use Gold features (such as multi-currency,
departments and inventory).

When you open your document, MoneyWorks makes a copy of it and works on
the copy. It does this to protect your information. For example, if it has half-
written a transaction to the document and there is a power cut, the integrity of
the document would be destroyed. Because you are working on a copy, the
original document will survive unscathed if there is a power cut or system
failure1.

When you open the document, MoneyWorks also checks the document for
internal consistency to ensure that it has not been modified by some outside
agency, disk or network error. If a consistency problem is found, you will not be
able to open the document, but will need to revert to your latest backup.
Managing Your File

Mac users

Note: If you are creating or modifying a custom report, an analysis report, or a
form, the save command will save the report/form, and not the document.

If you are using a Mac, your file mustbe kept on a Mac formatted hard disk.
Non-Mac formatted disks, such as Linux or Windows drives, are not supported.

Changing Documents

Disk Space

When opening the document, MoneyWorks needs to make a temporary copy of
it. The copy will be at least the same size as the original. Hence you will only be
able to open your document if there is sufficient free disk space available, i.e.
the amount of free disk space must be greater than the size of your document.
If there isn’t enough space you will be warned, and will need to clear some
space on your disk by deleting old files before you can open your document.

Windows: Normally the temporary copy will not be visible in Windows Explorer
because it is created in the Temp directory. However if your document is
stored on a volume that does not have a Temp directory, the copy will be
created in the same directory as the original document. So if you see a file
named something like: “Accounts.temp.moneyworks”. Do not touch it!

Saving Your Document

The file is automatically saved when you exit MoneyWorks, close the document
using the Close document command, or shortly after the last user disconnects.

If you are the only user, you can force a save of your file, by using the Save
command—this will safely update the original document with your changes. To
remind you to save, you can set the automatic prompt in the Saving Preferences
so that a regular reminder message is given.

To save your document:

1. Choose File>Save or press Ctrl-S/⌘-S

The document will be saved for you. Depending on the size of your
document, this may take a few seconds.

The save command is not always available—it is disabled for example, if you are
in the middle of entering a transaction or doing a bank reconciliation.

Unless the Multiple InstanceMoneyWorks Preference is on, you will only be
able to have one MoneyWorks document open at a time. If you are working on
one document and wish to start using another, you need to first close your
current document and then open the new one.

To close the current document:

1. Choose File>Close «Document Name»

The document will closed and the MoneyWorks welcome screen will be
displayed. Any changes made to the document are automatically saved
when the document is closed.

To open the new document:

2. Choose File>Open or click the Openbutton on the Navigator

The standard File Open dialog box will be displayed. You will need to locate
your file in this and open it in the normal manner.

To open a recently used document:

1. Choose File>Open Recent>«DocumentName»

or: Right Click on the Welcome screen and choose the document

Document Rollback or Revert

You can revert your document to the last saved version, or (if you have the
Enable Rollback and Crash RecoveryFile Preference option set, restore it to a
particular point in time since the last save. This is useful if you find you have
made some catastrophic error, such as posting heaps of incorrect transactions or
inadvertently deleting all your customers.
Managing Your File

If you have a session file:

To rollback your file:

1. Choose File>Rollback “Document Name”

You will be presented with a list of changes made since you opened (or last
saved) the document.

Document File Size

Your document will be closed and re-opened, and the changes up to the
nominated point restored. Changes after this are discarded.

Note: You can only Rollback once, so you need to “get it right” the first time.

If you want to revert your document to how it was when you opened it (or last
saved), click Revert All.

If you don’t have Rollback enabled:

To revert your document:

1. Choose File>Revert “Document Name”

You will be asked for confirmation.

2. Click on the last change that you wish to be restored to your document

The changes after this will not be highlighted.

In the above example, we are restoring everything to as it was before we
processed the creditor payments.

3. Click Rollback

2. Click Revert

Your document will revert to how it was when you opened it or when you last
saved it. Any changes you have made will be discarded.

Document File Size

As you work with your document, adding transactions, customers and so forth,
the size of your document will increase. The size will be roughly determined by
the amount of information stored in the document. Most MoneyWorks
documents are less than fifty megabytes, but (if you have a lot of information),
there is no reason why your document size can’t expand to a couple of gigabytes
Managing Your File

or more2.

There are two ways of restricting the size of your document:

Purging: Use the Purge feature in the period maintenance to remove

transactions from old periods. The space taken by these old transactions
will be used by new transactions, so your document size will not grow
unduly until all the space used by the old transactions is reused — See
Purging a Period.

Unless your transaction volume is unusually large, you should not need to
purge for several years.

Compacting: When you have purged you can release the space taken by the

purged transactions and hence reduce the file size. This will make opening
and saving faster.

Note: You cannot compact a file if you are Datacentre or MoneyWorks Now
client. Instead, save a backup of the file to your local hard drive using
File>Save a Backup As..., then open that backup file and follow the
instructions below (and, having compacted the file, upload it back to the
server again if need be).

To compact a file:

1. Choose File>Save a Copy As

The Save a Copy As window will be displayed.

Protecting Your Document

2. Set the Save a Compacted Copyoption and click Continue

The standard File Creation dialog box will open.

3. Type in the name of the compacted file and click Save

The name must not be the same as the current file.

A new, compacted file will be created with the new name—this may take
some time. This operation is only worthwhile if you have purged a period or
otherwise deleted a large number of records.

Protecting Your Document

In MoneyWorks Cashbook and Express, you can protect the information in your
document from casual prying eyes by giving the document a password.

Note: MoneyWorks Gold and Datacentre have extensive security options so that
user access can be limited to specific functions (e.g. Salespeople can only
put in orders). These users should refer to Users and Privileges.
Managing Your File

Creating a Password

1. Choose File>Security

The Change Password window will open

The Enter Password window will be displayed—you cannot alter passwords
unless you know the Document password.

Protecting Your Document

2. Enter your Document password and click OK

The Change Password window will open.

3. Enter the new password into the New Passwordand Verificationfields

4. Click Change

Removing a Password

1. Choose File>Security

The Enter Password window will be displayed—you cannot remove
passwords unless you know the Document password.

2. Enter your Document password and click OK

The Change Password window will open.

2. Type the new password for the document into the New Passwordfield

3. Click Changewithout entering a password

Click the Show Typing check box if you want to be able to see what you are
typing, otherwise the characters you type are not shown.

3. Repeat the new password in the Verificationfield

If the password you type in here is not identical to the one typed into the
New Password field, the Change button will be dimmed.

4. Click Changeto assign the password to your document

Note: Once you close the document, you will only be able to open it if you type

in the password, so do not forget your password3.

Changing a Password

1. Choose File>Security
You will be warned that you are about to remove the password.

4. Click OK

Opening a Document with a Password

When you open a document which has a password, you must enter the
password before the document will open (in Gold you will also have a User
Name).



Managing Your File

Backing Up Your Document

If the password is incorrect, an alert box follows. You will need to open the
document again and re-enter the password. Note that, if you enter the Order
Entry password, you will only get limited access.

Add to Keychain: For Mac only, if you set this option the Password will be added
to your keychain. In future, if you have logged into your Mac using your
keychain, you will not need to re-enter this password to gain access to your
MoneyWorks document.

1. Click Back Upto backup your document

The Standard File Save dialog will be displayed.

Creating a Backup Copy

MoneyWorks has inbuilt backup to compress your file and create a backup copy.
The resultant file is called an mwgzfile, and has the suffix .mwgz. It can be read
on both Windows and Mac computers.

Show Typing: If set, your password will show as plain text.

1. Choose File>Save a Backup as...

Backing Up Your Document

Your MoneyWorks document contains vital information about your business,
and for this reason it could be catastrophic if the file is lost or damaged. Hence it
is essential that you back up the file regularly.

By backing up, we mean take a copy of the file off your computer and store it in
a safe place. If your computer is stolen, gets submerged in a flood or is
otherwise made inoperable you will at least have a reasonably up-to-date copy
of your accounts (so you can still chase up those people who haven’t paid their
invoices).

Automatic Reminders: MoneyWorks can remind you to back up when you close
your document—you can set the frequency of reminders to Daily, Weekly or
Monthly in the Saving Tabof the MoneyWorks Preferences. See
Automatically Prompt for Backup.
If you have made any changes in your document, you will be prompted to
save—the file must be current before you back up.

The Standard File Save dialog will be displayed. Use this to select where the
backup copy should be saved, the format (with or without the Custom Plug-
ins folder and—if downloading from a server—image attachments), and
what name it will have. The name will default to that of your current
document, with the date encoded in square brackets in the form [yymmdd].

The compressed file will be between one-fifth and one-third of the size of
the original.

Note: The backup should normally be saved on a removable device (e.g. CD, zip
disk) that can be taken off-site. There must be sufficient room on the device
for the compressed backup copy—MoneyWorks will not split the file across
multiple disks.



Managing Your File

The Log File

Note: Your MoneyWorks Custom Plug-insfolder (which contains your reports
and forms) can also be backed up by choosing Accounts Backup with
Custom Plug-ins from the Formatpop-up (Mac) or the Save as typepop-up
(Win) in the standard File Save dialog box.

Note: The restored file is automatically opened for you, unless you already have

a document open (in which case close your current document and use the
File>Open command to open it).

Note: The MoneyWorks Custom Plug-insfolder will also be restored if it was

Note: The backup file, if re-opened, will share any currentMoneyWorks services

saved as part of the backup. This may overwrite the current one.

with the original file.

Backup Strategy

We recommend that you take frequent backups, and always ensure that a
recent backup is held off-site. Depending on the volume of transactions, you
might want to take a backup every day, or at the end of every week. In either
situation, you should have several backup disks that you rotate—you should
never be backing up onto the same disk as you used last time.

When the backup disk fills up, you should delete the oldest backup on it. You
can tell at a glance which is the oldest because MoneyWorks has helpfully dated
the backup for you.

emailing a Backup File

You can email a backup copy of your MoneyWorks file by using the Accountant’s
Exportcommand, and setting the Email Tooption. A backup copy will be created
as an attachment to a new email in your Out box.

To Restore a Backup

To restore a backup copy made using the Backup command:

1. Choose File>Open

The standard file open dialog box will be displayed—use this to locate and
open your file.

Note: Never open a MoneyWorks file directly from a USB flash drive, which are

slow and prone to corruption. Always copy the file to the hard drive first.

The Log File

MoneyWorks maintains an internal Log File that provides an audit trail of major
events in the life of your document—this includes any structural changes made
to your chart of accounts, as well as routine accounting operations performed
(bank reconciliations, debtor aging, and GST finalisation).

To view the log file:

1. Choose Show>Log File

The log file will be displayed.

This is a normal MoneyWorks list, and can be sorted and printed4.
Managing Your File

Adding a memo to the log file

You can add a short comment to the log file. Once added, the comment cannot
be edited or removed (it is part of the audit trail).

To add a comment to the Log file:

1. Hold down the option key (Mac) or the Ctrl key (Windows)

An Add...button will appear in the bottom left of the Log window

2. Click the Add... button

The Permanent Memo window will be displayed.

Moving Your File to a Different Platform

The easiest way to move your document is to make a backup of it using the Save
a Backup Ascommand, then move the backup to the other computer. The
backup file will be double-clickable provided you have installed a copy of
MoneyWorks on that machine.

Note: When you move reports or forms between computers, make sure that

they are put into the Reports or Forms folder in the MoneyWorks Custom
Plug-insfolder of the destination machine. Scripts are platform dependent
and cannot be moved.

Moving from Mac to Windows: You may need to add the appropriate Windows
file extensions for the type of file you are transferring (see table). For
example, a document called “My Accounts”, would need to be changed to
“My Accounts.moneyworks”.

3. Type in your permanent memo, and click OK

The memo can be up to 25 characters long. If you need to make a longer
entry, spread it over several memo entries.

Moving Your File to a Different Platform

MoneyWorks documents can be run on both Windows and Macintosh platforms
without any file conversion. Similarly custom reports and forms can be moved
between platforms. However you will need to make sure that MoneyWorks can
recognise the file as being a MoneyWorks file.

File
MoneyWorks Document file
MoneyWorks Backup
Custom Report
Chain Report
Analysis Report
Invoice/Receipt Form
Statement
Cheque/Remittance
Product Labels
Job Forms
Context-free form (e.g. GST Guide Form)
Import Map

Extension
.moneyworks
.mwgz
.crep
.rchn
.adf_
.invc
.stmt
.remt
.prod
.job_
.rept
.impo

Moving from Windows to Mac: The files you move will already have the

Windows extension as part of the file name. Simply copy the files onto the
Mac, start MoneyWorks and use the File>Open command to open the file.
You will not be able to double click a Windows file until it has been saved
from within MoneyWorks on the Mac.

Platform Issues: There are some basic differences between Macintosh and

Windows that you need to be aware of in moving files between platforms.

• Any MoneyWorks preferences (Fonts, keyboard settings etc.) are machine

specific and are not transferred with the document.

• Company Logos that are pasted into your MoneyWorks document may not

be available if the document is moved to another platform. They will
Managing Your File

Communicating with Your Accountant

however be preserved and re-appear if the document is moved back to the
original platform.

• The same fonts are not always available on both platforms (indeed, the
same fonts may not be available on different machines of the same
platform). If the font of the same name cannot be found on the new
computer, another font will be substituted. MoneyWorks maintains a font
substitution table for the common fonts, so that Helvetica on the Mac for
example will map to Arial on Windows.

• When fonts are substituted, the size of the characters will be different. This

may mean that you have to resize your text elements in the form.

• Pictures and graphics that you have pasted into a form may be lost when

you move the form to a different platform (depends on format).

• When you move a form or report from one platform to another you will

need to reset the page layout for it.

Licencing Issues: Please remember that your copy of MoneyWorks is licenced to
be used on only one machine, and hence cannot be loaded onto another.

Communicating with Your Accountant

Unless you are one of those people who do their entire accounting and
statutory returns themselves, you will from time to time need to send
information to your accountant. The easiest thing to do is to send them a
backup copy of your MoneyWorks document—unfortunately this presupposes
that they have MoneyWorks, and not all accountants have the necessary degree
of enlightenment for this.

If your accountant just wants a report, you can simply print or email one
directly. Typically they will be interested in the Trial Balance, Profit & Loss, and
Debtors/Creditors reconciliation reports. They might also want a detailed
breakdown of one or more accounts—use the Account Enquiry for this, printing
out the movements from this screen, or, even better, highlight the required
accounts in the Accounts list and click on the Ledger Report sidebar report.

Accountant’s Export

You can also export your complete accounts in a format that is suitable for
importing into the major accounting practice systems. To do this:

1. Choose File>Accountant’s Export

The Accountant’s Export settings window will open

2. Choose the file format to use

If your accountant uses MoneyWorks, choose the MoneyWorks file format
to create a backup copy of your accounts.

3. Choose the period range

All posted transactions for the period range selected will be exported. This
is not available for the MoneyWorks export option.

For Bank: If you just want to give your accountant details for a specific bank
account, choose the account from the For Bankmenu. Only posted
transactions that used the nominated bank account will be exported. Note
that some accountant’s systems, unused to dealing with more sophisticated
programs such as MoneyWorks, expect a separate file for each bank
account. If this is the case, it is not possible to transfer a lot of the
information that is in MoneyWorks (such as your accounts receivable/
Managing Your File

payable).

Note: If you choose the All Banksoption, MoneyWorks will export any invoices

as if your accounts payable and receivable accounts were bank accounts.

4. Choose the Bank Account if just providing details for a single bank account

Use Accountant’s Codes: If you have stored your accountant’s codes in your
chart of accounts, you can set the Use Accountant’s GL Codesto export
your accounts with their codes instead of yours. This option is only available
if the accountant’s code is set for all your accounts.

Send as Email: You can email the files directly to your

accountant—MoneyWorks will make an email with the accountant’s files
attached, and put in your Out box ready for sending the next time you go on
line (you will still need to address the email).

5. Set the Send as Email option if you want to email the files

6. Click Continue

Diagnostics

two people must not open the document at the same time. Otherwise you will
end up with the dreaded Dropbox "(conflicted copy)" situation.

To help avoid this, MoneyWorks 8 and later will detect that a file is in a Dropbox
shared folder and will create a semaphore file whenever you open it. This
semaphore file will also be mirrored to other Dropbox users sharing the folder
(provided they are connected to the internet). If they try to open your accounts
document while the semaphore file is present, MoneyWorks will know that the
document is in use elsewhere and will prevent it from being simultaneously
used elsewhere.

Once again, if you want bulletproof shared access, that is what MoneyWorks
Datacentre or MoneyWorks Now are for.

Diagnostics

MoneyWorks takes great pains to preserve the integrity of your data. However
from time to time the unexpected happens. If your document starts behaving
oddly, check it out with the diagnostics.

You will be prompted for the file name and location. Make sure that you
choose some sensible location for this on your hard drive so you can find
the file again easily.

If you elected to email the file, your email program should appear with the
newly created file as an attachment.

1. Choose File>Diagnostics

The diagnostics window will open.

2. Click Startto start the diagnostics

Dropbox Sharing

If you want multiple people to access your accounts simultaneously, you'll use a
MoneyWorks Datacentre server.

But what if you just want a couple of people to have access to your accounts
document from different computers but not at the same time? For example,
you might want your accountant to be able to open your file and run off some
reports when you're not using the accounts yourself.

You can achieve this simply and cost-effectively by keeping your accounts
document in a shared Dropbox folder. Every time you save or close, the file will
be mirrored to other computers that share the folder. However, in this scenario,
The diagnostics will run—a summary is displayed as the diagnostics progress.

If there is a problem

If a fault is found, please contact Cognito Software technical support to ascertain
what (if anything) can be done. Note that you may have to revert to an older
backup copy of your file. It is therefore important not to destroy these by taking
a backup of the (possibly) damaged file.



Managing Your File

Clear Printer Settings

Because MoneyWorks remembers the last printer (and settings) you used for
each report/form, it can get confused when you change computers/printers and
the drivers are not compatible. Clicking Clear Printer Settings removes all print
settings for the document (i.e. for hardcoded “reports” like bank rec summary
etc), and may solve driver-induced printing issues.

Graphics and Logos

In MoneyWorks you can store your company logo in the Company Details
screen. Express and Gold allow you to place graphics onto Forms.

If possible you should use a common bitmap graphic format such as PNG, JPG,
as these are supported on both platforms. So if you add a PNG on Mac, it will be
visible on Windows.

Graphics and Logos

Note: It is important not to put forms/reports that you create into the Standard
Plug-ins folder as MoneyWorks may over-write this when new versions are
released. This will destroy the existing contents.

Note: The Custom Plug-ins folder contains four sub-folders, for holding Reports,

Forms, Scripts and Import Maps.

MoneyWorks Standard Plug-ins Folder

On the Mac the Standard Plugins are created in the Application Support folder in
the user domain:

MoneyWorks also supports PDF on Mac. Avoid using PDF graphics if your forms
will be printed from Windows computers.

~/Library/Application Support/Cognito/MoneyWorks Gold/MoneyWorks

9 Standard Plug-Ins

Managing Your Plug-ins

Reports and forms (invoice layouts etc) are provided as plug-ins, allowing you to
share ones you have created with other users. To be seen by MoneyWorks they
must be stored in the correct location (MoneyWorks will normally manage all
this for you).

Standard Reports and Forms supplied as part of MoneyWorks reside in the
MoneyWorks 9 Standard Plug-ins folder5. This is automatically made for you
when you install MoneyWorks.

Reports and Forms that you create (or modify), as well as Pictures (item pictures
or transaction images) reside in the MoneyWorks Custom Plug-ins folder. This
will be automatically created for you when you first create a report or form, or
you can make it in the Index to Reports (see Creating a Custom Plug-ins Folder).
You can also access these folders from the Data section of the Housekeeping
panel in Navigator, as shown below:

On Windows, they are created in the APPDATA folder, typically something like:

C:\Documents and Settings\USERNAME\Application Data\Cognito

\MoneyWorks Gold\MoneyWorks 9 Standard Plug-Ins

To locate the folder, click on the link in the Data section of the Housekeeping
Navigator panel or use Reports>Index to Reports.

Note:

• If you delete the standard plug-ins folder, MoneyWorks will recreate it.
• If you update the MoneyWorks software, MoneyWorks may overwrite any
of the standard plugins files with new versions without warning (so if you
change any of these files the changes should be saved in Custom plugins).
• If you do not want MoneyWorks to recreate the contents of the standard

plugins folder, you may place an empty file at the top level of the Standard
Plug-Ins folder called "No Standard Plugins". If MoneyWorks sees this it will
not recreate standard plugins, even after a software update.
Managing Your File

MoneyWorks Custom Plug-ins Folder

The location of this varies, depending on whether you are hosting MoneyWorks
on your computer, or are connecting to another machine using Gold or
Datacentre. To locate the folder for the currently open document, click on the
link in the Data section of the Housekeeping Navigator panel or use
Reports>Index to Reports.

For a local document:

In the same folder as the document

For a document you connect to on a Gold server:

In the same location as the standard plugins folder (see above)

For a document you connect to on a Datacentre server:

If there is a custom plugins folder for the document on the server, it will
automatically be downloaded to (Mac):

~/Library/Application Support/Cognito/MoneyWorks Gold/

<datacentre_name>/<subfolders>/MoneyWorks Custom Plug-Ins

or on Windows to:

C:\Documents and Settings\USERNAME\Application Data\Cognito\

MoneyWorks Gold\<datacentre_name>\<subfolders>\MoneyWorks Custom

Plug-Ins

where <datacentre_name> is the name of the Datacentre server as set in its
configuration page, and <subfolders> is the subfolder hierarchy (if any) that the
document resides in within the Datacentre document root folder on the server.

Creating a Custom Plug-ins Folder

1. Choose Reports>Index to Reports

2. Click the Make Custom Plug-insbutton

Managing Your Plug-ins

This is only present if there is no custom plug-ins folder for the currently
open file.

Note: MoneyWorks will automatically create the MoneyWorks Custom Plug-ins
folder for you the first time you need it (e.g. saving a custom report or
form).

To Reveal the Standard or Custom Plug-ins Folder

The easiest way is just to click on the link in the Data section of the
Housekeeping Navigator panel, but it can also be located using Reports>Index to
Reports:

1. Choose Reports>Index to Reports

2. Set the pop-up menu at top left from All Reportsto

Standard Reportsor Custom Reports

3. Click the folder icon next to the pop-up menu

The selected folder will be revealed in the Finder (Mac) or Windows
Explorer.

To remove your Custom Plug-ins Folder on Datacentre

1. Choose Reports>Index to Reports

2. Set the pop-up menu at top left from All Reports to Custom Reports

3. Click the Remove Custom Plugins button

Confirmation will be requested. If you delete your local Datacentre Custom
Plug-ins folder, a new copy will be downloaded from the Datacentre server
the next time you connect.

1 Unless you have turned the Session file option off — see Enable Rollback and
Crash Recovery, MoneyWorks will have kept a record of any changes you have made
prior to the crash, and you will be able to recover most of the work done.↩
