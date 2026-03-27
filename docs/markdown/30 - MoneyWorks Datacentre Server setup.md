# MoneyWorks Datacentre Server setup

MoneyWorks Datacentre Server setup

you are uploading (it is often easier to move the MoneyWorks file to a new,
empty directory prior to opening it for upload).

1 This is controlled by the Run on server if possibleoption in the report settings.↩

MoneyWorks Datacentre Server
setup

Here's the short version of the steps to setting up MoneyWorks Datacentre
Server.

1.

Install the Datacentre server software

Mac: Open the installer: Datacentre.pkg.

Windows: Open the installer: DatacentreSetup.exe.

Also install client software from the MoneyWorks Gold installer on your
client workstations. One of these can use the full Gold serial number; the
others will be installed as Datacentre Client only.

Important: If you are installing on macOS Catalina or later, you must give
MoneyWorks Datacentre Console Full Disk Access in order for Datacentre to
work. MoneyWorks 8.1.8 or later is required for macOS Catalina
compatibility.

2. Configure the server

Use the MoneyWorks Datacentre Console application. The Windows
installer will start this for you; on Mac you can find it in /Applications.

You need to enter your serial number(s), contact email addresses, and other
configuration information. Then click Apply Changes

Make sure the computer you install MoneyWorks Datacentre on is set to
not go to sleep. If it sleeps, users may not be able to log in, or connected
users may have their connection hang. If the server is a Mac see how to
prevent sleep on a Mac.

3. Place your existing MoneyWorks document(s) in the Datacentre's

documents folder.
MoneyWorks Datacentre Server setup

Upgrading a Datacentre

On Mac, you wil also need to open the Console and allow it to set the
ownership of the files so that the server can access them.

File conversion from v8

4. For a single-company server, you will need to select the company

document to share in the Document tab of the Console.

If you are just getting started with MoneyWorks, you will first create your
accounts document(s) using the full license install of MoneyWorks Gold, then
use the Upload to Server function or place the document(s) in the server folder
when you are ready to share them.

Upgrading a Datacentre

On Windows, Datacentre 9 requires a 64-bit Windows OS. Please make sure
your Windows is 64-bit before installing v9. Type System Informationin the
Windows search box, and open the matching app. Then look for System Type in
the System Summary. It should say x64-based PC. If it says X86-based PC, you
have a 32-bit Windows version.

• If your Datacentre is on subscription (serial number has an R as the second
letter), there is nothing much to do. Upgrading to v9 from v8 is the same as
updating to any point release using Check Now in the Updates tab of the
Console.

• If your Datacentre is on maintenance (serial number has an 8 as the second
character), you will receive a new serial number (with a 9 in the second
place). Enter your new Datacentre 9 serial number into the Serial Number
field, then click on the Updates tab and click Check Now. Install the update.

File conversion from v7

If upgrading from v7, once installed, open the MoneyWorks Datacentre Console
application, select the Folders tab, and click “Upgrade Files to v9”. This will
convert files to v9 format. This may take some time if you have large files. Please
be patient.

On successful conversion. the file extension (if any) will be .moneyworks. The
old file will be renamed with”(archived)”. Files with “(archived)” in the name will
no longer be considered for conversion. You can remove these archived files if
you wish. The server will no longer access them.
Nothing to do. Databases will be upgraded the first time they are opened.

Installation

macOS

1. Download the Datacentre.pkg installer package.

2. Double-click the Datacentre.pkg icon.

3. Follow the on-screen instructions to complete the installation (you will

need to be logged in as a user with Administrator privileges, and you will
be asked to provide your password).

4. On macOS Catalina and later, you must give MoneyWorks Datacentre

Console Full Disk Access.

The Mac installation process installs the following:

• Datacentre support files are installed at: /Library/MoneyWorks/
• Console application at: /Applications/MoneyWorks Datacentre

Console.app

Windows

Note: MoneyWorks Datacentre v9 requires a 64-bit version of Windows.

1. Locate the downloaded setup program (DatacentreSetup.exe)

2. Open DatacentreSetup.exe and follow the onscreen instructions.

The Windows installation process installs the following:

• Datacentre support files and the Console application into: C:\Program

Files\MoneyWorks Datacentre\



MoneyWorks Datacentre Server setup

Upgrading a Datacentre

Note that if you are upgrading a previous installation (v7, v8) the installation
will be in the same location as the previous installation, overwriting it (i.e.
Program Files (x86)). For a new install, the install directory will be
C:\Program Files\MoneyWorks Datacentre\

• MoneyWorks Documents folder on the C:\ drive. You can relocate this in

settings.

3. The MoneyWorks Datacentre Console will start automatically at the

completion of installation.

MoneyWorks Documents Directory

Mac: On installation, a server home directory is created at /Library/

MoneyWorks/. This home directory contains a Documents subdirectory.

Windows: On installation, a data directory called MoneyWorks Documents will

be created in the root directory of the C: drive.

This directory is where you should put the MoneyWorks document(s) that you
want to share. It contains 2 subfolders called Backups and Archives. The
Datacentre will automatically place backups and archives of your data in these.
See the section Backups and Archives.

If you want to place your data files elsewhere, you can configure a different
server data directory using the Console, but if you do this, it will require careful
consideration of folder permissions.

Mac: The server’s home directory has ownership moneyworks_server:staff.
You must be in the staff group to be able to add files to the Documents
directory (all normal users are in the staff group by default). If you change
the location of the Documents directory, you will need to ensure that the
user moneyworks_server has access to the new location (including access to
all parent directories of that location; in practice this is hard to do, so we
advise not doing it unless you really know what you are doing—for an easy
life, just use the default Documents directory).

Windows: If you want to secure the files that you put in here, then you should
adjust the permissions for this directory as appropriate (The Datacentre
runs using the System account, so you do need to ensure that the System
account has read and write privileges for this directory). Per normal

Windows permissions rules, the directory cannot be on a mapped network
drive.

Installing Client Software

The MoneyWorks Datacentre client software is MoneyWorks Gold. You can
install this from the downloadable MoneyWorks Gold installer.

The first time MoneyWorks Gold is opened on a particular computer (actually
for a user account on the computer), it will ask for registration information.

One full MoneyWorks Gold installation

MoneyWorks Datacentre comes with one MoneyWorks Gold registration
number to enable full standalone functionality (in particular for creating new
accounts documents). You can enter this registration number on one computer
(it will be in the form xxG-nnnnn-nnnnn). You can use that computer for creating
new MoneyWorks accounts documents and setting them up before sharing
them with other users by placing them in the Datacentre documents folder on
the server. On this computer, select "Full functionality with local company files"
and enter your the serial number and click OK.
MoneyWorks Datacentre Server setup

All other client installations

For all other computers that you install the client software on—for use only with
the Datacentre server—no registration information is required: Select
"Demonstration Mode or Network Client" and click OK.

Updating client software

You only ever need to install the client software on a particular workstation
once. Whenever the Datacentre software is updated on the server, software
updates are delivered to clients automatically when they next log in (installing
these client updates will typically require the user to have admin privileges on
their computer).

Additional full MoneyWorks Gold Installations

If you have additional MoneyWorks Gold serial numbers, you can enable full
standalone functionality on as many computers/user accounts as you have serial
numbers. Every installation that has a full MoneyWorks Gold serial number will
have the ability to create new MoneyWorks documents and continue to use
them beyond the demo period (Clients without a serial number can create
documents, which can be accessed for 45 days in standalone mode). Logging in
to the server using these additional MoneyWorks Gold serial numbers does not
consume a concurrent client login on the server.

Starting the Datacentre

Place your documents

MoneyWorks Datacentre will serve any MoneyWorks documents that it finds in
its Document Folder. By default, this directory will be /Library/MoneyWorks/
Documents/ (on macOS), or C:\MoneyWorks Documents\ (on Windows).

You should move your MoneyWorks documents to this directory, along with
your MoneyWorks Custom Plug-Ins folder if you have custom reports and forms.
If you have several documents that use different custom forms and reports, you
can create subdirectories in the documents folder and place a MoneyWorks
Starting the Datacentre

document together with its particular MoneyWorks Custom Plug-Ins folder into
each one. When clients log in to a document for the first time, the
corresponding MoneyWorks Custom-Plug-Ins folder will automatically download
to their workstation. See Whither Plug-ins for more information.

You can put documents created by Moneyworks Cashbook or MoneyWorks
Express in the Datacentre Documents folder and these will be shared as if they
were MoneyWorks Gold documents. If you wish to use the documents in future
with MoneyWorks Express or MoneyWorks Cashbook, be sure to avoid using
any features not supported by those products (e.g. Departments, Inventory, or
extended Job Costing)

Don't file-share

The document root directory should not be available to normal users via file
sharing. This might tempt them to try to bypass the Datacentre server and open
the files directly (Client-only installations won't allow direct opening of
documents, but a user with a full Gold installation could do this). The
MoneyWorks Datacentre service will open documents on demand when clients
connect to the server.

• MoneyWorks Datacentre does not share data using the operating system’s

File Sharing facilities.

• Don’t open Datacentre-shared files directly using the Open command in

MoneyWorks Gold.

• Don’t double-click files in the folder to open them. Opening files in this way
will prevent the server from opening them and other users will not be able
to access them.

Password Protection

You should enable password protection before placing a document for sharing
by the Datacentre. If you don't do this, users will be logged in anonymously and
you will not be able to see who is logged in. Also, per-user settings will not be
stored if users are not set up.



MoneyWorks Datacentre Server setup

Start on reboot

Configuration

Configuration

There is no need to reboot the server after installation. The MoneyWorks
Datacentre is configured by default to start itself if the machine is rebooted.

The installer will start the server for you.

If you need to manually start (or stop) the server, here is how:

1. On the server, open the MoneyWorks Datacentre Console in Applications

(macOS) or in the Start menu (Windows)

2. On Mac you will need to authenticate as an Administrator by clicking the

lock icon and entering the password for your user account.

3. Click the green Start button (if the button is a blue Stop button, the

service is already running).

1. On the server, double-click the MoneyWorks Datacentre Console icon in
Applications (macOS) or in Program Files\MoneyWorks Datacentre\
(Windows)

2. On Mac you will need to authenticate as an Administrator by clicking the

lock icon and entering the password for your user account.
MoneyWorks Datacentre Server setup

Configuration

On Windows you may need to Run as Administrator (if you do not, and you
are logged in without Administrator privileges, you will be invited to reopen
the Console app with Administrator privileges)

3. Type a name for your Datacentre server in the Server Name field.

Your server will email low disk space warnings or backup failure
notifications to the admin contact address.

Cognito will email annual maintenance fee invoices to the billing contact
address.

By default, the server name is Datacentre. This is the name advertised on
Bonjour, and will also be used for the name of the folder into which custom
plugins folders are downloaded to clients.

Note: The MoneyWorks Datacentre Console is a program that configures and
starts or stops MoneyWorks Datacentre—the Console application is not the
server. Closing the Console application will not stop the server.

You should give your Datacentre server a unique name. (e.g. XYZ Corp
Datacentre).

Firewall

If you are a MoneyWorks consultant/support provider we strongly advise that
you give each Datacentre you install a unique name. This will have the effect of
keeping custom plugins downloaded from each site separate on your client
computer.

4. Enter your Datacentre Serial number in the Serial No. field. Your

Datacentre serial number looks like:

C9D-NNNNN-NNNNN or CRD-NNNNN-NNNNN

(C represents your country code, and the N's are digits. The third letter will
be a 'D'). Note: The code in a retail box may begin with ACT—If you have an
ACT code, type it in and click Fetch Serial Number to fetch your serial
number from the Cognito activation server.

5.

If you have a user key to extend the number of concurrent users, type it
into the User Key field. User Keys look like:

C9U-NNNnn-NNNNN

The nn part specifies the number of additional concurrent users.

6. Enter email addresses for technical and billing contacts.

Cognito will email the admin contact address with notification of software
updates.

On Windows, the installer will add MoneyWorks Datacentre to the Firewall
exceptions list automatically.

Backups

It is very important that have a backup regime in place to protect you from:

1. storage device failure (the SSD or hard disk in your server may fail)

2. fire, flood, theft, or other disaster (the whole computer may be destroyed

or lost)

3.

inadvertent or malicious deletion/corruption of data

The Backups tab is the place to configure the local backup and archive locations.

Auto Backup and Archive

You should have this option checked. If unchecked, no backups or archives are
made automatically.

When checked, documents will get automatically backed up whenever they
close.

If a new period has been opened, then the backup also goes into the Archives
folder and is dated so that it will not get overwritten. Otherwise backups go into
the backups folder and are stamped with the day of week (1-7). Week-old
MoneyWorks Datacentre Server setup

backups will therefore get overwritten.

Prior to v9, the Archive backup would be insteadof the regular backup. In v9
both are done.

In v9, a backup is only made if the database was changed. Backup frequency
may also be limited by the "Don't back up again within N hours" setting in the
Advanced tab of the Console. This is to prevent loading the serer with excessive
backup tasks when the database may be getting accessed regularly robots.

Also, in v9, the folder hierarchy and folder security (i.e. the folder.conf files) will
be backed up nightly into files of the form !folder config backup.n.mwgz.

If you open several periods in advance, you won't get archives for those periods.
Don't open periods in advance.

These auto-created backup files offer some protection from scenario #3, above.
What about #1 and #2? If your MoneyWorks Datacentre is hosted in a Virtual
Private Server, and your hosting provider is backing up the entire server image
nightly, and you trust that your hosting provider will not disappear, then that
may be enough. Otherwise, an off-server backup is strongly advised.

Off-server/off-site backups

By default, the Backups and Archive folders reside in the same location as the
documents. This makes it easy to locate backups if you need to go back to an old
version of a database for some reason however it offers no protection against
storage device failure or server theft or destruction. You must set up some
mechanism to back up data on another device, and in another location.

You can change the Backup and Archive paths to point to a location on another
device, preferably on another computer. This will provide protection from
disaster scenario #1 (storage device failure). However, on Windows, see
Network Backup paths on Windows,

Backup Path: Path to the directory where backups will be written. By default
this is the Backups folder inside the MoneyWorks Documents folder.

Archive Path: Path to the directory where archives will be written. By default
this is the Archives folder inside the MoneyWorks Documents folder.

Configuration

Either of these can be changed. Click the ... browse button next to the path
field to select the desired location. If the path in the field is invalid, a warning
icon will be displayed next to it.

Important: You must ensure that the Backup and Archive paths are valid and are
writable by the service. Verifying this is especially important if you have chosen
to write backups to a file server volume. Specifying a location on a file server
that is not always available will probably result in failed backups. You will not get
any notification of failure to write backups other than a log entry. With a
Windows server, the Save a Backup As command will fail on clients if the Backup
directory is not valid or writable.

What else should I back up?

For a quicker recovery from a catastrophic server loss, you may also want to
back up your Datacentre server settings. On Mac, these are at: /Library/
MoneyWorks/Library/Preferences/, and on Windows, they are at:
C:\ProgramData\Cognito\MoneyWorks Datacentre\. This folder also contains
Pids and Logs folders which do not need to be backed up.

Easy cloud data backup using Dropbox, OneDrive, Google Drive, or
iCloud drive

The easiest way to get a reliable off-site backup is to have the auto-created
backups stored in a cloud-backed folder such as a Dropbox folder. These
instructions apply just as well to OneDrive or Google Drive.

1.

If necessary, install and configure your preferred cloud storage service
client software on the computer

2. Create Backup and Archive folders in a subfolder of your cloud storage

folder

3. Set the Datacentre Backup and Archive paths to those folders

This will be something like /Users/you/Dropbox/MWBackups/Backups or
C:\Users\you\Dropbox\MWBackups\Backups. Likwise Archives.

4. Make sure the cloud storage account you use has enough storage capacity
MoneyWorks Datacentre Server setup

for your backups.

Restoring a multi-folder Datacentre backup

Configuration

Important: DO NOT use 3rd party backup software to back up the entire main
Datacentre Documents folder ESPECIALLY on Windows. Windows backup
software may lock files it is backing up and interfere with the operation of the
Datacentre server. You should only back up the Backups and Archives folders.
Don't allow antivirus software to scan MoneyWorks files. This may prevent
Datacentre from accessing files and lead to data loss.

Network Backup paths on Windows

Windows Services (such as MoneyWorks Datacentre) do not, by default, have
access to network shares. Therefore if you want backups and archives to be
written to a volume that is not locally attached to the server that Datacentre is
running on, you will need to set MoneyWorks Datacentre to run as a user who
has privileges to access the network volume to which you wish backups to be
written.

In Services, right-click on the MoneyWorks Datacentre service, and click the Log
On tab. Here you can specify a user name and password of a user that the
service will run as. Note that this user must also have read/write access to the
files that the Datacentre will be serving, otherwise it will of course not be able
to access them.

In addition, any network paths should be specified in UNC format (\\server\
share\directory), not with a drive letter. Note that there is no trailing \ on the
end of the path to the folder.

Restoring a Backup

To restore a single document backup, open the desired .MWGZ backup file in
MoneyWorks Gold. You will be asked for the location to save the restored file. If
restoring a backup for access via the server, save it back into the server's
Documents folder. To ensure convenient access for clients using their existing
Recent shortcuts, you should restore it using the original filename.

If your server had many documents in many folders and you need to restore the
entire server's MoneyWorks data after a complete server loss and rebuild, you
can use the moneyworks command line tool to restore the most recentbackup
of each file in a Backups directory (which you had an off-server backup of, and
have restored from that backup). This will also recreate the folder hierarchy and
folder security (latest folder.conf files) for the server from the latest folder config
backup.

Use the CLI restore command for this.

First, after reinstalling MoneyWorks Datacentre and restoring the Backups folder
from your off-server backup. Then you can reconstruct the Documents hierarchy
with one CLI command (your paths may be different; these assume the default
location for backups):

Mac:

moneyworks -e 'restore source="/Library/MoneyWorks/Documents/

Backups" dest="/Library/MoneyWorks/Documents"'

Windows:

moneyworks.exe -e 'restore source="C:\MoneyWorks Documents\Backups"

dest="C:\MoneyWorks Documents"'

OneDrive

If your backups are configured to be saved in a cloud drive such as OneDrive,
you should first set up OneDrive on the new server; download all of the files
from OneDrive using the Download All OneDrive Files Now button in the
OneDrive settings; then run the restore command:

moneyworks -e 'restore source="/Users/server/Library/CloudStorage/

OneDrive-Business/Backups" dest="/Library/MoneyWorks/Documents"'
Starting

MoneyWorks Datacentre Server setup

Starting

1. On the server, double-click the MoneyWorks Datacentre Console icon in

Program Files\MoneyWorks Datacentre\.

If you have just run the installer, the console app should have been started
for you.

2.

If you want to share documents from a directory other than the default
one, type the path of the directory you want into the Document Folder
field. Or you can click the browse button (...) to select a directory.

3. You must enter the Serial Number. Also the User Key if you have

purchased additional users beyond the standard 3.

4. Enter email addresses technical and billing contacts.

5. Click Start to start the Datacentre if it is not running.

Service Control

You can also start and stop the service using the Window Services control panel.

1. Open Start→Settings→Control Panel. Double-click Administrative Tools,

and then double-click Services.

2. Find the MoneyWorks Datacentre service in the Services list.

3. Right click on the MoneyWorks Datacentre service and select Start from

the contextual menu.
MoneyWorks Datacentre Server setup

Datacentre Services

Datacentre Service Port

This is the TCP port to run the Datacentre service on. Default is 6699.

If you want to use SSL security, you can supply a certificate and private key PEM
block by clicking the SSL settings button. For more information see
http://cognito.co.nz/developer/datacentre-ssl/
Database ports start at

Datacentre Services

Off by default. Datacentre uses a TCP port for each active (open) document that
is being served. Datacentre will respect the sharing port set in a document by
MoneyWorks Gold if it can. If that port is in use, the next port will be tried until
a free port is found. You can override this and specify a starting port for the
server to use if you wish. This can be useful if your LAN has multiple Datacentre
servers and you need to configure incoming NAT redirection of port ranges to
each server.

Software Update Service Port

This is the TCP/HTTP port that will serve client software updates.

REST Service

MoneyWorks Datacentre 6.1 and later can provide a REST API to allow
programmatic access to databases from HTTP clients, as well as locally-hosted
javascript web apps. Default port is 6710.

For developer documentation, see the manpage at x-man-page//moneyworks-
rest (Mac) or on the web at http://cognito.co.nz/developer/category/REST

MoneyWorks Datacentre may also be accessed from a local command line
client. For developer documentation, see the manpage at x-man-
page//moneyworks (Mac) or on the web at http://cognito.co.nz/developer/cli-
manual/

Note that logging in via CLI or REST will consume a concurrent login. If all
concurrent logins are currently in use, any additional connection will be refused.
If you wish to guarantee that you can log in via these interfaces, you can supply
a unique Gold serial number (other than the one supplied as standard with the
server), that is not used by any other user. Special REST-only serials are also
available.



MoneyWorks Datacentre Server setup

Enabling SSL encrypted connections

This will generate a private key that is not password protected, so it will be
installable in the server as-is.

Datacentre Services

To enable SSL encrypted connections, you will need to install an SSL certificate
on the server.

3. Open the directory in the Finder

Obtaining an SSL certificate

Generate a private key for your server, and a Certificate Signing Request.

If you have openssl available on your computer (i.e. if you are using a Mac, or
Windows 10 with a WSL linux distribution installed), here are the commands
that you can enter into Terminal to generate these using openssl.

1. Create a directory for the files

mkdir MyCertFiles
cd MyCertFiles

2. Generate the private key and csr.

You will need to fill out the details for your certificate, the most important
one being Common Name. This will be the Fully Qualified Domain Name for
your server (e.g. yourserver.yourcompany.com). If you just hit return, the
default value in [ ] will be used.

openssl genrsa -out private_key.pem 2048
openssl req -out mydomain.csr -key private_key.pem -new

Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:California
Locality Name (eg, city) []:San Francisco
Organization Name (eg, company) [Internet Widgits Pty Ltd]:My
Company
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:
yourserver.yourcompany.com
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:

open .

4. Submit the CSR file to your chosen Certificate Authority

They will provide a .crt certificate file. If asked what kind of server you have,
just specify apache/openssl (this should get you a .crt pem format
certificate).

Installing the SSL certificate

Your certificate should be in the form of a PEM text block (starts with ——-BEGIN
CERTIFICATE——-)

Your private key is in the form of a PEM text block (starts with ——-BEGIN RSA
PRIVATE KEY——-)

1. Open thes certificate file in a text editor and copy and paste the text from
the into the Certificate and Private Key PEM field of the SSL settings

2. Open the private key file in a text editor and copy and paste the private
key after the the certificate block in the Certificate and Private Key PEM
field of the SSL settings

Installing the intermediate certificate

Certificates from most Certificate Authorities will also require one or more
Intermediate Certificates to complete the Chain of Trust to a trusted root known
to the operating system that clients are running. These certificates will be
downloadable (or copyable) from your Certificate Authority's website. You
should have received a link to them along with your certificate.

1. Open the intermediate certificate bundle (usually called CA Bundle) in a
text editor and copy and paste the text into the lower field of the SSL
Settings dialog box.
MoneyWorks Datacentre Server setup

Datacentre Services

The SSL Settings dialog should display "Certificate Valid", along with the
issuer and expiry date for the certificate.

Web Apps

When the REST service is enabled you can access the supplied default web
app(s) or your own custom web app using a web browser pointed at the REST
port of your server.

http://myserver:6710/

or

https://myserver:6710/ (if SSL is enabled)

WebApps are served from the WebApps subfolder at /Library/MoneyWorks/
Library/WebApps (Mac) or :\Program Files\MoneyWorks Datacentre\
WebApps\ (Windows). The default installation is shown below. Accessing the root
of the server (as above) will automatically redirect browsers to the /default/
directory (via a 302). You can disable the default web app by creating a blank
index.html file in WebApps/. Likewise you can override the default web app by
implementing your own webapp in index.html. You can place any number of
support files in WebApps. Just keep in mind that the update installer will
overwrite the “default” directory and favicon.ico. Any other files will be
untouched by the installer.

default install
MoneyWorks Datacentre Server setup

Datacentre Services

installing your own custom web app

Note that on Mac, you must set the ownership of files to moneyworks_server.

Unless you require compatibility with old clients that do not support TLS, you
should leave the Use only TLS option checked. This disables older and not very
secure SSL2 and SSL3 protocols and enables Perfect Forward Secrecy in TLS
which is required for iOS 9 and later clients to access REST services.

Advanced settings

More complex web apps

These change some aspects of server operation. You should not change them
arbitrarily.

The built in web app server is the same simple HTTP server that drives the REST
interface. It is capable of serving simple javascript web apps. If you wish to
develop and deploy a web app using a server-side scripting engine (PHP etc)
then of course you can do that, but you will need to deploy the app on a
separate web server. Your web app can communicate with the REST interface of
MoneyWorks Datacentre from its back end.

Your web server can be quite remote from the Datacentre server, but if your
web app will make frequent calls to the REST interface, then it would be
desirable to have as little network latency as possible between the servers. You
may even mix and match the various ways of accessing your Datacentre server.
e.g:

Server startup timeout seconds

The time in seconds allowed for opening a document. If opening takes longer
than this it will be considered an error and reported as such to the user logging
in. Default is 30 seconds. Only make this higher if your document(s) are very
large and your server is very slow.

Idle time before close: seconds

This is the time to wait after the last client logs out of a document before the
document should be closed (and possibly backed-up). Default is 60 seconds. If
all clients log out, and then somebody logs in again within this time, then the
document will not need to be reopened, and rollback will still be possible.
MoneyWorks Datacentre Server setup

Datacentre Services

REST API users take note: If you will be using the REST API with your server and
you will be making frequent REST requests (e.g. every minute or two) then
you SHOULD change this setting to something longer, otherwise your
document may be constantly opening and closing for every REST request
which may put a very high load on your server and cause problems if a
request needs to be serviced while the document close and backup is
happening.

Login grace time: seconds

Don't change this except under the direction of technical support. Default is 30.

Disconnect idle clients after: minutes

Defines how long the server should let a client remain idle before forcibly
disconnecting them. A client is considered to be idle if the network connection
is good but they make no requests of the database. Default is 120
minutes—should be long enough for a long lunch.

Close stale connections after: minutes

Defines how long we should let a stale client retain their connection before
forcibly disconnecting them. A client can be stale if either they crash (in which
case we want a short threshold) or if their network connection goes down (or
maybe the lid of the laptop the client is running on is closed and the laptop
sleeps before MoneyWorks Gold can automatically disconnect). Default is 5
minutes.

Don't back up again within: hours

When the server is set to auto-backup documents on close, and this setting is 0,
then a backup will be made every timethe document closes. If you have
automated processes accessing the server which may cause the document to be
opened and closed many times a day, then you should set this to something
higher (say 4 hours) so that the document does not needlessly get backed up
multiple times per day.

Verbose Logging

Logging Verbosity. Default is off.

Moneyworks Datacentre writes diagnostics to its own log file. On macOS,
diagnostics are also written to the system log. Further diagnostics may also be
written to log files named after MoneyWorks documents that you open.

The Verbose logging option will cause Datacentre to write many more
diagnostics (rather than just errors) to the logs. This can put more load on the
server, so should not be used unless you need it.

Log file locations

Mac:

/Library/MoneyWorks/Library/Logs/moneyworks_datacentre.log
/Library/MoneyWorks/Library/Logs/document.log

Windows:

C:\Documents and Settings\All Users\Application Data\Cognito\

MoneyWorks Datacentre\moneyworks_datacentre.log

C:\Documents and Settings\All Users\Application Data\Cognito\

MoneyWorks Datacentre\Logs\document.log

Use the Show Log File and Show Logs Folder buttons in the Advanced tab of the
console to easily display log files. If you need to send log files to Cognito Support
for troubleshooting purposes, you can use the Send to Support... button.

Important: You should leave this option off unless you are experiencing
problems with the service. Verbose logging can significantly degrade
performance. Additionally, logged information may include passwords passed in
REST requests.
MoneyWorks Datacentre Server setup

Troubleshooting

Can see server but connection fails

Software Update for clients fails with “Could not contact Software
Updates Server”

Troubleshooting

Check the firewall on the server

Check the firewall on the server

Your server’s firewall is blocking access to port 6700

If you can see the Datacentre service when you connect from a client using
the local network browser (Bonjour), but the connection fails, this almost
certainly means that the server computer is running a firewall that is
blocking access to the service (You can see the service because the firewall
is allowing access to standard services such as Bonjour on port 5353). You
will need to allow connections to the same ports as for the Remote
Connections

Can’t see server in the Local Network Browser (Bonjour)

Is the service running? Look in the MoneyWorks Datacentre Console on the
server.

Is your client on the same LAN subnet? Bonjour browsing does not normally
work across subnets. In this case you would need to use the Manual
connection method and type in the server name or address. Also see the
note above about server firewall.

Error -54 or -49 when trying to log in

Transient errors: If a client attempts to connect to a document that is in the
middle of closing down/backing up, the client will see a -54 or -49 error.
This is normal. In this case, the client should just wait for a minute, then try
again.

Persistent error: The Datacentre service cannot open the file because it is
already in use—probably someone is using a local MoneyWorks Gold on the
server to open the file directly.

Using the Folders tab

The folders tab can be used to examine/modify the folder/document hierarchy
and set passwords on folders.

Check the firewall on the server

Partitioning Users

Is port 5353 (UDP) blocked by the firewall? This is the multicast DNS port
and is required for network browsing.

When using MoneyWorks Datacentre as an ASP solution, you can partition users
so that they only see one subfolder of the Datacentre documents folder.

Is Bonjour/mDNS turned off in the Console?

The name of the subfolder will be the username with which the user will initially
log in to the Datacentre.

Can’t connect from a remote client over the internet

To set this up:

See the Remote Connections section

1. Set the Require Folder Name and Password to Connect checkbox in the

Folders tab of the Console.

2. Set a password for the root folder by selecting it and typing a password in

the Password field.
MoneyWorks Datacentre Server setup

Using the Folders tab

You can also set the maximum number of concurrent connections allowed
across all documents in that folder.

5. Click the Show Folder button to reveal the folder so that you can place

documents in it.

You can also create folders within folders.

Note: Folder settings (including the plaintext password) are stored in a file
named folder.conf file inside the folder (another reason you don’t want end
users having file share access to the documents folder).

Removing empty folders

You can remove an empty folder by selecting it and clicking the “-” button.

Show Active Documents

Displays a red “active” indicator on documents that are currently active

After all users have logged out of a document, the document will close and the
activity indicator will be removed.

You can use this facility to check that all documents are inactive before installing
a software update. Note: It is best not to leave this option turned on as it
continuously polls the server for status information and may degrade server
performance.

Show All Documents

Displays the documents within the folder hierarchy.

3. Create subfolders within the document root folder by selecting the root

folder in the list and clicking the + button below the folder list.

Name the new folder

4. Type a password for the new folder in the Password field.
Updating the Datacentre software

MoneyWorks Datacentre Server setup

URL shortcuts

When MoneyWorks Datacentre is set up to require login itself (ASP mode), you
will need to pass the document username and password as part of the ?doc=
part of the URL. e.g.:

moneyworks://UserA:userA_pass@server:6699?doc=Doc1User:Doc1Pass@UserA/

Some%20Document.moneyworks

If you just supply the folder login and no document, e.g.:

moneyworks://foldername:folderpass@server:6699

MoneyWorks will immediately log in to the folder and display the documents
list. The user can then just supply their username and password for the
document that they are logging in to.

Updating the Datacentre software

To update the Datacentre software, use the Updates tab in the MoneyWorks
Datacentre Console application.

First, make sure that all users are logged out and that no documents are active.
You can check whether documents are active by looking in the Folders tab, with
the Show Active Documents option selected. Active documents will be shown
with a red active indicator. Get all users to log out and wait until all documents
are inactive (will take 1-2 minutes after last user logs out).

1. Select the Updates tab and click Check Now

If there is an update available, it will be shown:

Updates are available only if your software maintenance subscription is up to
date.

2. Click Install to install the update. This will stop the service and restart it

after installing (and will restart the console application).

On macOS, the install will just proceed; on Windows, you will see a standard
installer interface. You should follow the on screen instructions.
MoneyWorks Datacentre Server setup

Using MoneyWorks Datacentre

Note: You should ensure that all connected users have logged out before
updating.

From this point the login process is the same as for connecting to an ordinary
MoneyWorks Gold server (see the section Connecting to a shared document in
the MoneyWorks Gold User Guide).

Client updating Gotcha (Windows)

On Windows, it is easy to run multiple instances of an application (a new one
may start every time you choose the program from the Start menu—depending
on the Multiple Instance preference in the MoneyWorks Preferences). If you are
running more than one instance of MoneyWorks Gold on a client, and you
connect to the Datacentre and it wants to update your client software, you must
quit from any other instances of MoneyWorks Gold running on your machine
(such as ones that have local files open), otherwise the client update cannot
proceed.

3. Select the document you wish to connect to

4. Type your user name and password for that document

If the document is not password protected you can leave these fields blank.
They will be ignored.

5. Click Log In

If you are the first user to connect to the document, the server will need to
open it first, in which case there will be a slight delay while this happens.

Using MoneyWorks Datacentre

Saving and Rollback

1. Start up MoneyWorks Gold and click Connect on the navigator welcome

page.

2. Provided that the Datacentre server is on the same subnet as you, and

you do not have firewalls blocking DNS-SD (Bonjour), it will appear in the
Local Network Browser servers list. Select the Datacentre you want to
connect to and click Log In.

If the Datacentre server is on a different subnet, you will need to connect
manually.

Select Manual Using IP Address from the Connect Using popup menu, and
type in the server's DNS name or IP address. Then click Log In. If the server
is configured to use SSL, you must use the servers fully qualified domain
name rather than its numeric IP address and you must set the SSL checkbox.

If the Datacentre server itself is configured to require log in, you will first
need to type your Datacentre user name and password. If you found the
server using the Local Network browser, the user name and password fields
will have been enabled only if the server requires them.

A list of documents available on the server will be displayed.

With MoneyWorks Datacentre it is (usually) not necessary to manually invoke
the Save command to permanently update the database. This is because the
Datacentre will normally close any open documents once everyone has logged
off (and, by default, will forcibly log them off once they have been idle for 2
hours).

With Datacentre, sufficiently privileged remote clients can manually invoke the
Save and Rollback commands (you must be the only user logged in to the
document to use Rollback). With MoneyWorks Gold, only the server operator
can do these.

Backups and Archives

If the auto backup option is on, documents will get automatically backed up
every time they close (or the Save command is used).

If a new period has been opened, the automatic backup goes into the Archives
folder and is dated so that it will not get overwritten. Otherwise backups go into
the Backups folder and are stamped with the day of week (1-7). Week-old
backups will therefore get overwritten.
MoneyWorks Datacentre Server setup

Using MoneyWorks Datacentre

Clients can download a backup to their workstation using the Save a Backup
command (provided that they have the Backup and Remote Save privileges).
This means that they can also use the Accountants Export command to "export"
in MoneyWorks format. A side effect of using either of these at a client is that a
save and backup is forced on the server at that time. This backup will include/
exclude custom plugins for that document as requested by the client.

Off-site backups

Your general server backup system should back up the Backups folder and
Archives folder. The .mwgz backup files created by MoneyWorks are generally
20-25% the size of the original documents, thus saving space on the removable
backup media, plus the DC will only have the backup files open for writing when
it is actually creating them.

Tip: For super-easy off-site backups, set your Backup Path to be in a DropBox,
Google Drive, or OneDrive folder.

If you want to, you can manually delete elderly items in the Archives folder if/
when you feel you no longer need them and you need the disk space.

Important: The automatic backups and archives made by the DC should be
further backed-up to external removable media. At the very least, back up to a
different device to protect against failure of the main storage device (hard disk).
Back up to removable media and remove the media to an offsite location to
protect against fire/theft. Rotate the removable media—one backup copy is not
enough. All your backups should not be on-site at the same time.

Do not configure backup systems to back up the live data folder. This may
interfere with the operation of the server by locking files and could lead to data
loss.

Backing up to network volumes on Windows

Windows Services (such as MoneyWorks Datacentre) do not, by default, have
access to network shares. Therefore if you want backups and archives to be
written to a volume that is not locally attached to the server that Datacentre is
running on, you will need to set MoneyWorks Datacentre to run as a user who
has privileges to access the network volume to which you wish backups to be
written.

In Services, right-click on the MoneyWorks Datacentre service, and click the Log
On tab. Here you can specify a user name and password of a user that the
service will run as. Note that this user must also have read/write access to the
files that the Datacentre will be serving, otherwise it will of course not be able
to access them.

In addition, any network paths should be specified in UNC format (\\server\
share\directory), not with a drive letter (actually drive letters set up for the user
may work). Note that there is no trailing \ on the end of the path to the folder.

Warning: DO NOT keep the live data files (MoneyWorks Documents folder) on a
remote network volume. This will severely impact performance and reliability.

Document Maintenance

MoneyWorks Datacentre allows you to perform all day-to-day activities with
your accounts data by logging in as a client, however there will be some
activities that require direct single-user access using a full-license copy of
MoneyWorks Gold.

Creating a new file

MoneyWorks Datacentre does not have a facility for creating new documents.
To create a new file, use the New command in MoneyWorks Gold. We
recommend that you do the bulk of the setup of a new file in single user mode.
When your new set of accounts is ready for prime-time, use Upload to Server to
upload it to the server.

Customising Forms and Reports

You can develop and test new forms and reports while logged in to the
Datacentre as a client.

If there is no MoneyWorks Custom Plug-Ins folder on the server, you can make a
local MoneyWorks Custom Plug-Ins folder on the client using the button in Index
to Reports or in the Housekeeping section of the Navigator. A folder made this
way may be uploaded to the server. A corresponding folder will be created on
the server if it does not already exist.
MoneyWorks Datacentre Server setup

Using MoneyWorks Datacentre

When you have completed the changes you wish to make to your forms and
reports, you can upload the entire changed MoneyWorks Custom Plug-Ins folder
to the server using the Upload All button in the Signing window (in Users and
Security). This will replace the folder on the server with a copy of your folder.
Obviously, you require the Signing privilege to get to that command in the first
place. The changes will be seen by other users next time they log in. You can
also select a single file and click Upload One.

different Datacentres separate, provided the Datacentres have unique server
names.

In the diagram below, you can see how the Custom Plug-Ins folders are
replicated from the server to the client. When a client is using Document One or
Document Two, plugins folder A will be used. When using Other Document,
plugins folder B will be used.

Note: If you manually change files in the Plugins folder on the server, these
changes will not be seen by clients until the server closes down and starts up
again (2 minutes after the last client logs out).

Whither Plugins

When you open a local document in MoneyWorks, Custom Plug-ins are normally
loaded from a MoneyWorks Custom Plug-Ins folder located in the same folder as
the document you open. This allows different sets of Custom Plug-Ins (reports,
forms etc) to be used with different documents by putting the documents and
their attendant plugins folders into different folders.

With MoneyWorks Datacentre, clients do not have direct access to the folder on
the server from which documents are being served. Therefore when you log in
to a document on Datacentre that has a Custom Plug-Ins folder residing in the
same folder (on the server), then that Custom Plug-Ins folder will be
automatically downloaded to the client workstation at login time. Note that the
folder is not downloaded every time you log in—just the first time and any time
thereafter if the contents of the folder on the server are changed.

Where does the downloaded Plug-Ins folder go?

The MoneyWorks Gold client will create a folder with the same name as the
Datacentre (by default this is "Datacentre") in the user's Application Support
folder (Application Data on Windows). Inside this folder it will place any
downloaded Custom Plug-Ins folder(s). If the document that you log in to on the
server resides in a subfolder of the MoneyWorks Documents folder on the
server, and has a Custom Plug-Ins folder in that subfolder, then the client will
create a subfolder of the same name within it's own Datacentre folder and put
the Custom Plug-Ins folder there. Thus you can maintain separate Custom Plug-
Ins folders for every document if you wish. Also, portable clients who might log
in to more than one Datacentre server will be able to keep the plugins for
If any files are changed in plugins folder B on the server, it will be replicated to
clients the next time they log in to ABC’s Document. Note, however, that if files
are deleted from the plugins folder on the server, they will not be deleted on
the client.

Standard Plugins are loaded from the folder "MoneyWorks Standard Plug-Ins"
that is also expected to be in the Application Support/AppData directory
(MoneyWorks recreates this folder is it is not found).

Non-MoneyWorks Gold files

MoneyWorks Datacentre will share MoneyWorks Gold, MoneyWorks Express or
MoneyWorks Cashbook documents. Note that using product features not
supported by Cashbook or Express will make documents no-longer openable in
those products (e.g. using Inventory or Departments).



MoneyWorks Datacentre Server setup

Uninstalling

If you need to remove the Datacentre server from a computer, this may be done
from the command line.

Mac uninstallation

In Terminal.app, type (without line breaks):

sudo /Applications/MoneyWorks\ Datacentre\ Console.app/Contents/

Resources/uninstall

You will be asked for the admin password. This unix shell script will stop the
server and delete the following items:

- /Library/LaunchDaemons/nz.co.cognito.moneyworks.datacentre.plist

- /Applications/MoneyWorks Datacentre Console.app

Note: The /Library/MoneyWorks folder is not deleted. You may delete this
manually using Admin privileges, or to delete this folder and all of its contents
and remove the moneyworks_server user from the system, use:

sudo /Applications/MoneyWorks\ Datacentre\ Console.app/Contents/

Resources/uninstall -k

Windows uninstallation

Use the Add/Remove programs facility

Remote Connections

Since it is “always on”, it is possible to connect to a MoneyWorks Datacentre
server over the Internet. Performance will be somewhat dependent on the
latency (round-trip message time a.k.a. ping-time) which on the public
internet is typically up to 100 times higher than a local area network.

Remote Connections

Requirements

If you install the server on a computer in your office, you will need a static IP
address for your connection. Talk to your ISP about this. They should be able to
tell you what your IP number is. A domain name for the IP is not required unless
you wish to use SSL.

Depending on their ISP, remote clients who want to connect may also need
static IPs. Some ISPs rotate dynamic IPs very frequently (e.g. every 30 minutes).
This has the effect of hanging any open connections.

Alternatively, you can install the server on a hosted Virtual Private Server or a
colocated server. These always provide static IPs, and will generally provide
remote desktop access and a control panel for setting up port forwarding, thus
the setup will essentially be the same as for an on-premise server.

Setup

If your Internet router performs Network Address Translation or has a firewall,
you will need to configure it to allow the following ports to be forwarded to the
server running MoneyWorks Datacentre:

Purpose

Port
6674-6698 Data Ports. One port for each data file that is active
6699
6700
6710

The MoneyWorks Datacentre service port
The MoneyWorks Datacentre software update http service
REST API port plus web apps

For simplicity, you should forward the entire range of ports 6674-6710.

The Datacentre ports can also be configured in the Datacentre Console. You
should only adjust the port settings if you have a conflict with other server
software running on the same computer.

Performance

For best performance over the Internet, a VDSL2 or Fibre connection or
equivalent is strongly recommended (cellular or satellite connections will be
higher latency). And the server should be located geographically close to the
clients that will connect to it (locating your servr in another country will not
