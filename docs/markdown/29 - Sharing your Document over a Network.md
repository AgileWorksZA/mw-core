# Sharing your Document over a Network

Sharing your Document over a Network

Sharing your Document over a
Network

If you want simultaneous access to your MoneyWorks file by more than one
user, you will need to install MoneyWorks Datacentre. MoneyWorks Datacentre
runs in the background on a server or workstation and provides high-
performance network access to one or more MoneyWorks databases.

MoneyWorks Datacentre allows simultaneous access to an accounts database
for multiple users. This actually means two different things:

• Multiple users can work on the same set of accounts simultaneously, either
over a local area network, or remotely across the internet provided their
router is configured correctly.

• You can set up multiple user names, each with their own password and

privileges. Privileges control what data and procedures an individual user
can access.

You can use the multiple user name and password functionality even if you are
not sharing the data across a network. Likewise you can share data across a
network without employing the enhanced security of multiple user names and
passwords. Normally, however, the two go hand in hand, for obvious reasons.

What you will need

MoneyWorks Datacentre This is the serving technology that enables fast,

secure networking. There are two versions: a “single company” version,
that allows a single company file to be shared, or a “multi company”
version, that allows a number of company files to be shared simultaneously
to different users.

A designated “host” computer This is the machine onto which the Datacentre

software will be installed. It can be either a server or a desktop machine
running recent versions of Windows or Mac OS X. It does not need to be a
dedicated computer—Datacentre is invisible and runs in the background. If
you want 24/7 access, then the computer will need to be running all the
time.

Licenses In order for users on different computers to access the shared

document, each of those users will require a MoneyWorks license. This can
be either a full MoneyWorks Gold license, or a server-based concurrent
license. If you do not have the requisite number of licenses (i.e. one per
concurrent user), you will first need to contact your MoneyWorks reseller or
visit the Cognito website to obtain the necessary licenses. Note that you
only need to have licenses for the maximum number of users at any one
time.

A network You will need to have your computers networked. We strongly
recommend that the server computer has a wired connection to your
network switch.

What you will not need

You don’t need a domain controller, a dns server, a directory server or a file
server MoneyWorks uses Bonjour™ network service discovery to make it
easy to connect to a MoneyWorks server on a local area network.
MoneyWorks Datacentre does not require dedicated server hardware; it
does not require a server OS — plain macOS or Windows (64-bit) is fine; it
has no other software requirements.

Accessing a shared document

When you are sharing a document, you never open it directly (this is the job of
the Datacentre server), but always Connectto it. This is true even if you are on
the “host” computer.

The first time you attempt to access a document on a Datacentre server you will
need to do it by connecting, as described below. The connection will thereafter
be remembered and displayed in the Recent Documents list on the
MoneyWorks Welcome screen—provided you have opted to have your user and
password stored in your keychain/vault, you can simply double-click to
reconnect.

Note that you can mix Macintosh and Windows clients and servers on the same
network. It makes no difference if you are using a Mac and the server machine is
running Windows, or vice versa.
Sharing your Document over a Network

To connect to a shared document

1. Choose File>Connect or click Connecton the MoneyWorks welcome page

The Log Inwindow will open. How you use this depends on where the
MoneyWorks file you wish to access is located, and is determined by the
Connect Usingpop-up menu at the top of the window, as shown below:

administrator. See Connecting to a document on another network for
further details.

If you are using the MoneyWorks Nowcloud service: choose MoneyWorks

Now. See Connecting to MoneyWorks Now.

Accessing a shared document

Connecting to the local network

Setting the Connect Usingpop-up menu to Local Network Browserwill display a
list of the MoneyWorks servers or documents available on the local network.
The list will show the MoneyWorks document hosted by a single-company
server, or the server name(s) of multi-company server(s).

If your server is on the same local network: choose Local Network Browser.

This is discussed in Connecting to the local network.

If your server is on a different network: (for example, you are accessing it

remotely over the internet), choose Manual Using IP Address. You might
also need to use this if you are on the same network but Bonjour browsing
has been blocked/disabled on your computer or the server by a network

2.

If you see your MoneyWorks document in the list, just select it, enter your
Sharing your Document over a Network

User and Password, and click the Log inbutton

This will be the situation if you have a single company server. The file should
open for you when you click Log in.

3. Otherwise select the Datacentre Server name in the list

Generally there will only be one Server available, but some sites run
multiple Datacentre servers.

4.

If you have been given a user name and password to log into the
Datacentre Server itself, type these into the appropriate fields

Usually no user name or password is required for the initial connection and
document listing for a local Datacentre Server (the username and password
fields will be disabled), but if the username and password fields are
enabled, you will need to supply these.

5. Click Log In

The list of accounts documents on the selected server will be displayed.

6. Select the document you want to access

If the document has users/passwords, you will need to supply your user
name and password for this document.

7. Click the Log inbutton

You will be connected to the MoneyWorks document.

Accessing a shared document

If you want to connect to a MoneyWorks server running on another network or
at another location, you will not see the server in the Local Network Browser
(Bonjour only looks on the local network, and some WIndows networks may
have Bonjour browsing blocked by overzealous network admins).

Connecting to a document on another network

1. Enter the network address of the computer running Datacentre server

Setting the Connect Usingpop-up menu to Manual using IP addresswill display
the following:

This may be an IP address (four numbers separated by dots e.g.
123.456.78.9), a local computer name (e.g. Accounts-Server), or a fully-
qualified domain name (cloudserver.hostingprovider.com).

2.

If you know that the server is running on a different TCP port from the
default (6699), enter the port number in the port field

Normally you leave this unchanged.
Sharing your Document over a Network

Accessing a shared document

3.

If the Datacentre has a security certificate installed, set the Use SSLcheck
box

Note: if you connect using SSL with an IP address instead of a server name,
the veracity of the security certificate will not be checked (but the
connection will still be encrypted). If you connect with a server name, the
server name must match the security certificate of the server.

4.

If your Datacentre has been password protected, enter the Datacentre
User nameand Password

By default, Datacentre servers are not password protected, so you would
normally just leave these blank.

5. Click Log In

A list of available MoneyWorks documents will be displayed.

If you provided a username/password in step 3, you will only see the
documents relevant to those credentials.

6. Select the desired document by clicking on it

7. Enter your user name and password for the document

8. Click Log in

The document will open.

Connecting to MoneyWorks Now

MoneyWorks Now is a distributed cloud service that provides MoneyWorks
hosting in multiple locations worldwide, and also provides a single sign-on to
access accounts for multiple companies so that you don't need to remember
usernames and logins for all of them (if you are an accountant, you may have
logins to many companies on MoneyWorks Now).

Setting the Connect Usingpop-up menu to MoneyWorks Nowwill display the
following:

If you have a MoneyWorks Now account:

Ensure that the I have a MoneyWorks Now accountcheck box is ticked, and
enter your MoneyWorks Now user name (your email address) and
password, and click Log in. Double-click the file you wish to access from the
list presented in the next screen and it will open for you.

If you don’t have a MoneyWorks Now account:
Sharing your Document over a Network

Accessing a shared document

Enter your email address as the user name for the account you will create
and your desired password and click Create. You will receive an email which
you need to action to complete the account creation. Having done this, the
administrator of the MoneyWorks document will be able to grant access to
you, after which you will be able to connect to the document as described
above. Note that the password must be at least nine characters long, and
should be one that you are not going to forget (The MoneyWorks Now
password is used to secure your access to all MoneyWorks Now documents
that you have access to. Forgetting the password will require document
admins to regrant access).

The server closed the connection: Connection closed by remote host: The

most likely cause is that the SSL settings connection settings are incorrect.
Toggle the SSL checkbox and try again.

The server refused the connection: Incorrect password for Datacentre user:

The Datacentre is password protected and you have provided an incorrect
username and/or password. See your system administrator to get a correct
password.

Closing a connection to a Server

Important: By default, your password will be stored in the Keychain/Vault of
the computer that you create the account on. If it is not your computer,
deselect the Add Password to Keychain/Vaultcheckbox.

When you are logged in as a client, you log out using the Disconnect command
rather than Close.

1. Choose Disconnect from the File menu

You will be disconnected from the server.

Or you can just Quit/Exit MoneyWorks.

If you sleep your computer while connected (by closing your laptop lid, for
example), MoneyWorks will try to log you out before the computer goes to
sleep. If this fails, it will take 5 minutes or more for the server to notice that you
have gone away, during which you'll still be consuming a login to the server. It is
best to avoid sleeping your computer while connected.

To see who is connected

If password protection is turned on, any user who has Administrator privileges
can use the Users & Securitycommand to see who is logged in. This can be done
from any client.

Common Connection Errors

If your network is set up correctly, things should “just work”. However issues
may arise when people tinker with firewall or network settings. Often if a
computer is replaced by a new one, the settings on the new computer might be
different.

The server is not responding. Either there is no server running at the address/
port specified, or a FIREWALL may be blocking network traffic to this port.
Means what it says. Check that the IP address provided was correct, that
there is a Datacentre running on the computer at that address, and that
there is not a firewall blocking access.

The server is not responding. Either there is no server running at the address/
port specified, or MoneyWorks may not have permission to access the
local network. Since macOS Sequoia, you may get this error if you have not
granted Local Network access to MoneyWorks. This permission can be lost
after a system software update so you may need to go back to System
Settings → Privacy and Security → Local Network and regrant the
permission.

The server refused the connection: Your version of MoneyWorks Gold is too
new for this server. The server should be updated. Your client version of
MoneyWorks has been updated and no longer works with the server
version. You need to update the Datacentre server software.
Sharing your Document over a Network

What’s different when you are Sharing

The user list in Users & Securityshows the machine name or IP address of any
computers that are connected. The example above shows that two people are
logged in—User Admin from a computer at IP address 192.168.1.14 and user
Fred from a computer called GRANTB047/1.

3. Click the Uploadtab in the Signing Dialog box

4.

If uploading a single report or form (e.g. one you have just signed), select
it in the list, and click the Upload Onebutton

Sending a Broadcast Message to Other Users

5. Click Upload Allto upload the entire Custom Plug-ins folder

When logged in to a shared document, an administrator can send a short
message to all other users who are currently logged in to that document.

1. Choose File>Users & Security

The Password Control window will open.

2. Click the Broadcastbutton at the bottom of the window

The Broadcast Messagewindow will open.

3. Type your message and click Send

Other MoneyWorks users currently connected to the document will have the
message displayed as an alert.

Uploading Reports and Forms

You can create or modify reports and forms on your local computer, and, once
they are completed, upload them to the Datacentre server. Other users will then
receive the modified forms/reports the next time they connect. You can upload
either a single report or form, or the entire custom plug-ins folder.

To upload:

1. Choose File>Users & Security

2. Click the Signingbutton at the bottom left of the Password Control

window

Note that users who do not have the Signing privilege will need the reports
and forms to be signed for their use. See Protecting Reports and Forms by
Signing

Server-Side Reporting on Datacentre

If the network latency is high (i.e. higher than a wired
network), most reports will attempt to run on the server
instead of the client when using Datacentre1. In general this
will be much faster because it saves a great many database
requests from having to run over the network.

When a report is running on the server the following progress
window is displayed. Click Cancelto safely stop the report
preparation.

A double-arrow is
displayed above the
Outputpop-up
menu if the report
is going to be
prepared on the
server instead of
the client.

What’s different when you are Sharing

A multi-user database management system has to do rather a lot of work
behind the scenes to maintain the integrity of the database in the face of
multiple users all trying to change things at once. Fortunately, you don’t need to
worry about this as Datacentre will do all the hard work without any guidance
from you. You might, however, see the effects of this when MoneyWorks won’t
let you do something that always would have been allowed if you were the only
user.
Sharing your Document over a Network

What’s different when you are Sharing

Indeed for some operations that involve extensive updates to the MoneyWorks
database, you must be the only connected user, and other users will not be able
to connect until the operation is complete—this is referred to as being in
“single-user mode”.

may also involve modifying thousands of other records in the database, and
the process might fail if another user is modifying one of those records.

In this situation when you double-click a record, the code field is disabled; if
you click on it, the following coach tip is displayed

Single-User mode operations

When you are the only user and commence an operation that requires Single-
user mode, the following coachtip will be displayed to warn you:

While you are in single-user mode, other users will not be able to connect. You
should therefore complete the operation as quickly as possible—in particular
you should not wander off for morning tea or lunch half way through, as this will
lock other users out, possibly resulting in some unpleasantness.

While the database is locked in single-user mode, you will get a warning every
15 seconds or so. This is intended to be moderately annoying.

The following can only be done when there is only one user connected.

Opening a New Period: You cannot open, close or lock periods if there are other

users connected. If you are the only user connected, choosing
Command>Open/Close Period will force the database into single-user mode
for as long as the Period Management window is open.

Provided you have the Auto-open new period when opening fileStartup
preference turned on, and it is not the start of a new financial year,
MoneyWorks will automatically open a new period (if required) the first
time any user connects.

To alter the code field you must hold down the Option key (Mac) or the Ctrl
key (Windows) and when you click the toolbar Modify button or double-
click the record, the server will enter single-user mode allow you to alter
the code field. A coach-tip is displayed to this effect.

Other users will not be able to connect until you have closed the record
(using OK, Next, Previousor Cancel).

Deleting Accounts, Names, Jobs etc These records cannot be deleted in multi-
user mode as it may invoke a major database update. However if only you
are logged in, it will temporarily enter single user mode to do this.

Changing Account Types: The type of an account cannot be changed in multi-

user mode. Likewise departmentalisation of accounts etc.

Operations that may be affected by other users

Changing “code” fields: Changing the code in a Product, Account, Name, Job or
other master records can be done from any (authorised) user, provided
there are no other users connected. This is because a change to any code

When more than one user is using MoneyWorks, their actions may affect what
you are trying to do. In particular:
Sharing your Document over a Network

Uploading a File to Datacentre or MoneyWorks Now

• Only one user can modify a given record at a time. It does not make sense
for more than one user to make changes to the same record at the same
time. If you try, you will see something like this:

Uploading a File to Datacentre or
MoneyWorks Now

To upload a MoneyWorks file stored locally to either your Datacentre or
MoneyWorks Now:

1. Open the file using the Openbutton on the MoneyWorks Welcome page

2. Choose File>Users & Security

The Password Controlwindow will open

The first person who opens a particular record or starts an operation that
may require a record to be changed will automatically and invisibly obtain a
server lock on that record, preventing anyone else from make changes to it.
If this were not the case, the first user’s changes might get obliterated by
another user, compromising the database integrity. The server lock is
automatically released when the first user is finished with the record.

• You can’t delete any record (even an unposted transaction) if another user
is looking at it. The definition of “looking at” in this case is actually rather
technical (for example, the record might be in another user’s list view), so
we won’t bore you with it. Suffice to say, if you try to delete a record and
MoneyWorks tells you it is locked, just try again later or ask other users to
log out or close list windows.

• If you are running a report, and someone else posts a transaction, the
report will offer to abort. Why? Because the ledger balances have just
changed, so the report may not balance—reports need to run to
completion without critical ledger data changing.

3.

If the file is not password protected, you will need to password protect
your file by turning on the Password Protect <Document> checkbox.

You will also need to ensure that the user you are logged in as has a
password (a blank password is not allowed).

4. Click the Upload to Serverbutton
Sharing your Document over a Network

Uploading a File to Datacentre or MoneyWorks Now

If your username does not have a password, set up a password first. To do
that, double-click your username (Admin if you have only just enabled
password protection) and set a password.

If uploading to a remote MoneyWorks Datacentre

• Choose Connect using Manual using IP Addressand enter the IP address of

domain name of the server.

The standard MoneyWorks network login window will open

• If there is a security certificate on the remote Datacentre, turn on the SSL

option.

• If the Datacentre is running in ASP Mode, you will need to enter the

Datacente User (Target directory) and Password.

• Click the Log Inbutton and the file (and any custom plug-ins) will upload.

If uploading to MoneyWorks Now

• Choose Connect using MoneyWorks Nowand enter your MoneyWorks Now

login credentials.

• A Log Inwindow will be displayed showing you the list of folders that you

own (you can only upload to a folder that you own). Choose the folder and
click Log In. The file will upload.

Note: Before uploading a file to MoneyWorks Now, you should ensure that
you have a sensible company name in Show>Company Details. This is the
name that will be displayed when you log in to the file on MoneyWorks
Now.

Notes on uploading files

It is a good idea to make sure that your file has a sensible name. Avoid names
like “Backup of backup of XYZ Accounts [20170331].moneyworks” (rename the
file before opening it for upload).

When you upload a file, it—along with any custom plug-ins—is compressed and
uploaded to the selected server. If a file of the same name exists on the server,
you will asked if you want to replace it.

You should not upload two different documents with the same company name,
but if you do, the second one will have the filename appended in your
documents list so that you can differentiate them.

If you do not want to upload the Custom Plug-ins along with the file (these will
replace any existing ones in the targeted directory on the server), ensure that
there is no MoneyWorks Custom Plug-insfolder in the same location as the file

If uploading to a MoneyWorks Datacentre on the local network

• Choose Connect using Local Network Browserand select the Datacentre
from the list of available Datacentres (normally there will just be one).
• The Datacentre must be running in ASP Mode. You will need to enter the
Datacente User (Target directory) and Password. This will identify the
subfolder that you will upload to. If uploading to the top level of the
Documents root, use "root" as the username.

• Click the Log Inbutton and the file (and any custom plug-ins) will upload.
