# MoneyWorks Now

MoneyWorks Now

2 The maximum size for a MoneyWorks document is 4 Gigabytes.↩

3 If you do suffer a bout of amnesia and forget the password you will need to
contact Cognito (assuming you can remember the phone number), who can, for a
fee, remove the password for you.↩

4 On Windows, press Ctrl-P to print.↩

MoneyWorks Now

MoneyWorks Now™ is MoneyWorks hosted on our cloud servers. Your
MoneyWorks Now account is your single sign-on for all of your cloud-hosted
MoneyWorks documents.

5 Prior to MoneyWorks 7, this was called MoneyWorks Standard Plug-ins↩

If you have a group of companies, you can host them all, and access them all
with the same MoneyWorks Now account.

If you are an accountant, you may access many different companies' accounts
hosted in MoneyWorks Now, all through your one MoneyWorks Now login.

If you're just starting out, and are setting up your company in MoneyWorks with
a view to using MoneyWorks Now, you will initially set up the company accounts
in a local document on your computer (see Getting Started), and then you will
upload that document to MoneyWorks Now when the initial setup is complete
— see Migrating a MoneyWorks Document into the MoneyWorks Now cloud
MoneyWorks Now

Creating a MoneyWorks Now Account in MoneyWorks

Creating a MoneyWorks Now Account in
MoneyWorks

If you will be the Administrator for your cloud-hosting, you will need to first
create your own MoneyWorks Now account. A MoneyWorks Now account name
is always your email address.

1.

In the MoneyWorks Welcome screen, click the Connect button.

The MoneyWorks Log In Screen will be displayed.

2. Set the Connect Using:popup menu to MoneyWorks Now™

3. Ensure that the I have a MoneyWorks Now accountcheck box is turned off

(so that you can create a new account)

4. Enter your email address and preferred password. Please use lower case

for your email address.

Note: It is important that you use a stable email address. If possible don't
use an ISP-provided email address, because you might change ISPs in the
future. A company email address is preferred. You cannot change the
account name.

By default, your password will be stored in the platform password manager
(Windows Vault or Mac Keychain), and your computer will autofill it for you
in MoneyWorks. You may turn off this option if you are not using your own
computer when you set up your account, but be sure you do not forget your
password.

5. Click Create

You have now created your MoneyWorks Now account. You will receive a
confirmation email. If you don't receive it within a few minutes, be sure to
check your spam folder and mark it as being “not junk” and whitelist
moneyworks.net.nz in your email system.

At this point you have successfully logged into MoneyWorks Now. Normally
you would see a list of your MoneyWorks Now files, but as you have just
created your account there will not be any files as yet.
MoneyWorks Now

Migrating a MoneyWorks Document into the MoneyWorks Now cloud

6. Click the OK button. The Log In window will close and the MoneyWorks

Welcome page will be displayed.

Migrating a MoneyWorks Document into the
MoneyWorks Now cloud

First, you will need a MoneyWorks Now hosting account, which will be attached
to your email address. Contact Cognito to obtain this.

New company: If you are beginning with MoneyWorks and have not yet set up
your accounts, you will create and set up a company accounts document on
your local computer (this can be done with the MoneyWorks Gold trial1). When
you are ready to have it hosted and shared, you will upload it to your
MoneyWorks Now hosting account.

Existing company, single user — Gold, Express, or Cashbook: If you are already
using MoneyWorks in single user mode, and migrating to the cloud you won't
need to create a new file. If you have been using Express or Cashbook, you will
need to install the MoneyWorks Gold trial2 to use MoneyWorks Now.

Existing company, network user: If you are already using MoneyWorks with a
private Datacentre server, you will first need to get access to your .moneyworks
file and its Custom Plugins folder, so that you can open the document directly. If
you don't have filesystem or physical access to your existing server, you can log
into your MoneyWorks file and save a backup to your local hard disk (using File >
Save a Backup As, and choose Accounts Backup with Custom Plugins and
Attachments as the backup type). Open the backup and restore it and then

proceed.

1. Open the document you wish to upload to MoneyWorks Now and ensure

your company has a name under Show > Company Details.

Note: This must be a unique name. You cannot have two data files with the

same company name in MoneyWorks Now.

2. Choose File>Users and Security

3.

If not already password-protected, click Password-protect “your
document name”.

The Password Control window will open. You need to be an admin user for
the document to access this command. If you are just now enabling
password protection, then you will be the Master Admin user with default
username "Admin".

4. Ensure that the Admin user has a password and fill in your email address
(which is your previously-created MoneyWorks Now account name).

5. Click OK.

6. Click Upload to Server

You will be asked to log in to MoneyWorks Now.

7. Ensure the I have a MoneyWorks Now accountoption is on, and fill in

your MoneyWorks Now account name and password.

8. Click Log In

A list of your hosting locations will be displayed (usually only one, unless
you're an accountant).

Don't see any hosting locations?

1. Have you set up hosting with Cognito?

2. Have you activated your hosting by clicking the link in your hosting
confirmation email?
MoneyWorks Now

Migrating a MoneyWorks Document into the MoneyWorks Now cloud

9. Select the hosting location in the list and click Log in

Your document (and its MoneyWorks Custom Plug-Ins folder, if one is
present), will be uploaded to the server. MoneyWorks Now login access to
the document is automatically granted to you. You can now invite others to
access the document.

Make sure you close and archive the document you have just uploaded to
ensure you or your other users, if any, do not accidentally open and work on this
local document. You may also wish to delete the MoneyWorks recent document
list to ensure you do not accidentally open the old document. Choose File >
Open Recent > Clear Menu to do this.

Granting access to your MoneyWorks Now document

1. Choose File > Users and Security

2. Either open an existing user or create a new user for the document

3. Fill in the user's email address

If you know that the person has a MoneyWorks Now account with a
particular email address, use that. If they do not already have a
MoneyWorks Now account, one will be created using the email address you
enter.

4. Turn on Enable MoneyWorks Now Access

5. Click OK

An activation email will be sent to the person at the given email address.
They should follow the instructions in the email to activate their access.

For an existing user, their password, if any, will be replaced in the document
with a new password (they do not need to know this, as they will never use it).
Their access will be enabled via their MoneyWorks Now account. If the
document is ever removed form MoneyWorks Now and used locally or on a
private Datacentre server, you will need to obtain the password from the
MoneyWorks gateway API.

Having Access Granted

If someone else is administering your MoneyWorks Now accounts, they may
invite you to a document as described above. This will send you a notification
email, and also automatically create a MoneyWorks Now account for you
(unless you already have one). In this situation, you will receive a one-time
password which you will change to your own chosen secure password when you
MoneyWorks Now

first log in using MoneyWorks Gold.

Migrating a MoneyWorks Document into the MoneyWorks Now cloud

When you receive this email click the Activate MoneyWorks Accessbutton. A
web page will open where you can complete the activation. If a MoneyWorks
Now account has just been created for you, with a one-time password, that
should be autofilled for you. If not, just copy and paste from the email (but on
Windows, make sure you are not inadvertently copying the space following the
password in the email). If you already had a MoneyWorks Now account created,
just enter your MoneyWorks Now password and complete the activation.

If you are new to MoneyWorks and MoneyWorks Now, follow the download link
in the email to download and install MoneyWorks Gold.

You can now access the document by logging in via MoneyWorks Gold.

1. Click Connect on the Welcome Screen

2. Choose Connect Using: MoneyWorks Now™

3. Enter your MoneyWorks Now user name and password

4. Click Log In

If this is the first time you have logged in with MoneyWorks Now with an
auto-created account, you will be required to change your password.
