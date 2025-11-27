# Scripts, Automation and the REST of it

Scripts, Automation and the REST of it

Scripts, Automation and the REST
of it

MoneyWorks is an extremely powerful accounting and business information
system, but, a bit like a politician, it can please some of the people all of the
time, and all of the people some of the time, but it can't please all the of the
people all of the time. Scripts and Automation allow you, the people, to extend
the functionality of MoneyWorks, so you can get it to please you all of the time.

Automation is a technology that was implemented in MoneyWorks 2 (about
1997), when it was realised that MoneyWorks needed to talk to other programs
running on your computer, or that you wanted to extend the capabilities
somehow. The first script was the famous “PickleOdeon”, developed for a pickle
manufacturer to help manage his pickle recipes.

Automation basically allows other systems to extract information from, or
submit information to, MoneyWorks. Imagine if your costing spreadsheet could
get the cost prices direct from MoneyWorks, or your CRM system could update
customer information in MoneyWorks at the press of a button. Both these have
been possible since the early 2000s. Automation capabilities were substantially
increased in MoneyWorks 6.1 by the implementation of the REST APIs, which
allow access to MoneyWorks Datacentre from remote devices over the internet.

Scripts are a new technology, introduced into MoneyWorks Gold in the
MoneyWorks 7 release (and not available in Express or Cashbook). Scripts allow
you to automate certain operations in MoneyWorks, and can also change the
way that MoneyWorks interacts with the user. For example, when you enter an
item code into a quote, MoneyWorks will normally get the price from the item
details stored in MoneyWorks. With a script, it could get the price from
somewhere else, perhaps even look it up on your suppliers web site. Similarly
you may want to implement your own pricebook, with possible separate prices
for selected items per customer. Scripting makes this possible, without even
needing to leave the comfort of MoneyWorks.

Scripts can also be used to manage custom controls for report settings, and also
provide “library functions” for the report (see the Cash Projection Report for an
example).

Scripts

Scripts allow you to automate operations within MoneyWorks. They can read
external files (either from your local volumes, or from a web server), intercept
user-interface actions, create and update records and more.

A number of sample scripts are included in the Acme Widgets sample file. These
are turned off by default, but you can easily turn them on to see how scripts
work, and to play with the scripting language.

You can access the scripts by:

1. Choose Show>Scripts

The Scripts Management window will open.

The first time you do this the scripts window will be empty. In the example
above, there are two scripts (listed down the side). The “Test” scripts is
activated (indicated by the green tick), whereas the “Pricebook” script is
deactivated, so will not run (indicated by the red cross).

To view a particular script:

1. Click on the script in the sidebar

The script contents will be displayed in the body of the window, where it
can be edited. If you do edit a script, you will need to activate it again (see
below).
Scripts, Automation and the REST of it

To activate a script

1. Select the script in the sidebar by clicking it (if it is not already selected)

2. Click the Activatetoolbar icon

The script will be compiled, and (if there are no errors), its Load handler will
be called. Normally a script will also have other handlers that MoneyWorks
will call.

After loading, a green tick will appear next to the script on the sidebar
indicating that it has been activated. If there is a syntax error in the script
(i.e. some invalid text that the script compiler doesn't recognise), the script
will not activate, and a tooltip will alert you to the error and where it occurs
(and the part the script at and following the error will be coloured orange).

If you want a script to just do one thing immediately, the Load handler is the
place to do that thing. Having activated the script and had the Load handler
execute, keep in mind that the script stays loaded, and the Load handler will
execute the next time you (or anyone else) logs into the document. If you don't
want this, you should deactivate the script.

Scripts

Run Once

If you are writing a script to just do one thing (e.g. do a one-off export of some
information to a file), and do not want the script to be active for every user of
the document when they log in, you can use the Run Once button to just call
the Load and Unload handlers. The script won't remain active.

Setting breakpoints

To deactivate a script

1.

If the script is not the currently selected one, click on it in the sidebar

In MoneyWorks 9.2.1 and later you can set breakpoints by clicking in the darker
breakpoint margin. A breakpoint shows as a white blob in the margin. Click
again to clear the breakpoint. When you run the script, the debugger will be
invoked at any breakpoints you have set. See The MWScript Debugger

2. Click the Deactivate toolbar icon

If the script has an Unload handler, it will be called.

Log File

After the script is unloaded, a red cross will appear next to the script's name
in the sidebar indicating that it is no longer active.

The Log File tool will open the MoneyWorks_Gold.log file (in Console.app on
Mac, or Notepad2 on WIndows). The log file shows errors and also any output
you generate using the Syslog() function.

Note: If the script contains a public handler, any other scripts that use that
handler will also be deactivated.

Navigating to Handlers

"Running" scripts

Usually, scripts will implement Handlersthat allow the script to respond to
certain user actions (like opening a window for a record, clicking a custom
toolbar icon, or tabbing out of a particular field). The Loadhandler can be
considered the main entry point of a script in that Loadis called when you
activate the script or the script is auto-activated when you log in to the
document.

The Handlers tool contains a menu of all of the handlers in your script. Large
scripts may have many handlers, so this provides a quick way to jump to the
declaration of a particular handler.

The Search field

To find text in the current script, activate the search field with ⌘-F/Ctrl-F and
type the text to find. All matches in the current script will be highlighted. You
can jump to the next match bt pressing Return, or ⌘-G/Ctrl-G. You can also
Scripts, Automation and the REST of it

Scripts

quickly find the next occurrence or a highlighted word with ⌘-G/Ctrl-G.

Make PO Item: A script that takes an account code keyed into a purchase order

Find All

The Find All tool can search all of the scripts in the document (or only the active
ones). Click on any match in the matches window to instantly jump to that line
in the script.

and automatically makes a corresponding “Other” item;

Update Currency Rates: A script that, once a week, silently gets the exchange

rates from Yahoo and updates the rates in MoneyWorks.

See Deploying Scriptsfor details on how to move these scripts from one file to
another.

Sample Scripts:

To Create a New Script

The following sample scripts are included in the Acme Widgets file. These are
useful, fully functional scripts that extend MoneyWorks capabilities. As they may
change your data in some form, we strongly recommend that you experiment
with them in Acme Widgets (or a copy of your real data file) before using them
in a live document.

POS Rounding: Rounds an item receipt or invoice to the nearest 5 or 10 cents

(or other currency unit, depending on settings). Intended for a point of sale
environment.

1. Click the plus icon at the bottom left of the scripts window

You will be asked to enter the script name.

Note that the name must be unique (you cannot have two scripts with the
same name).

The Add a new UI Formoption is used to design and create your own
windows. This is covered in the UI Builder section.

Utilities: A set of useful utility scripts.

2. Enter the script name and click OK

Apply Landing Costs: Apportion the nominated landing cost value over a

supplier invoice to include the landing cost in any stocked items on the
invoice.

Pick List: Generate a new sales order based on the highlighted item records;

Auto Make Journal: When a manufactured item is entered into the heading of
a Make journal, automatically completes the journal with the components.
Can be modified to go several levels deep for components that are
themselves made;

Update BOM Costs: Recalculates the bill of materials costs for the highlighted

built items. By default the maximum depth for components is 5, but this can
be changed in the script;

Filter Sort: A script to reorder a nominated list filter;

A new script will be created.

As an example, copy and paste the following script into the editor for your
new script:

constant meta ="My Hello World"

on Load

Alert("Hello World!")

end

3. Click Run Once.

Your Load handler will be called and the alert will be displayed. The script
will then be unloaded. One and done.

While this is a good way to test things out, it's not useful for adding features
to MoneyWorks. For that you want the script to remain active and respond
to events.
Scripts, Automation and the REST of it

4. Now change the script to the following:

constant meta ="My better Hello World"

on Hello

Alert("Hello World!")

end

on Load

InstallMenuCommand("Hello World", "Hello")

end

If you click Run Once, nothing will (apparently) happen. The Load handler
installs a menu command but then it will be removed when the script is
auto-unloaded.

5.

Instead, click Activate in the toolbar

Your script is compiled and loaded, and remains active. Look in the
Commands menu and you will find your new command at the bottom called
"Hello World".

When you select this menu item, MoneyWorks will call your Hello handler.
Congratulations! you've added a feature to MoneyWorks.

At this point, with the script activated, if you close the script window and log out
of the document and then log back in, your Hello World command will still be
there, because the script will be reloaded when you log in. Furthermore, if you
are logged into a document on MoneyWorks Datacentre, closing the script
window (or Saving) will save the scripts to the document and when anyone else
logs in, they will also get your Hello World command! (if they were already
logged in, they will get the changes the next time they log in).

To Delete an Existing Script

1. Select the script to Delete by clicking on its name on the sidebar

2. Click on the Cogs icon on the bottom left of the script window and select

Delete Script

Scripts

You will be asked for confirmation

3. Click OK to delete the script

To Rename a Script

1. Select the script to rename by clicking on its name on the sidebar

2. Click on the Cogs icon on the bottom left of the script window and select

Rename Script

3. Enter the new script name (which must be unique) and click OK

The script will be renamed and deactivated. You will need to reactivate the
script if required.

Note: If the script contains a public handler, any other scripts that use that
handler will also be deactivated. You will need to alter the handler calls in
these other scripts to reflect the new script name.
Scripts, Automation and the REST of it

Deploying Scripts

Scripts are (normally) stored within the MoneyWorks document itself. When
you close the scripts window, any changes you have made are written to the
MoneyWorks document. All of the active scripts will be loaded by every user the
next time they log in.

The MWScript Language

be prompted to install each script separately.

• Copy Script as XML: The script will be copied to the clipboard as XML (and

can be pasted into another MoneyWorks file).

• Copy Script as Styled HTML: The script will be copied as html—handy for
documenting your script. The script below was copied in this manner:

If you want to move them to another MoneyWorks file, you can copy the text
out of the script window, then create an empty script in the other document
and paste it in there.

constant meta = "Hello World"
on Load

alert("Hello World")

end

Alternatively (and easier), scripts can be saved as an xml file. When such a file is
double-clicked in the FInder or Windows Explorer, MoneyWorks will offer to
install it into the currently open/connected document. This means you can
easily send scripts to other MoneyWorks users. As of MoneyWorks Gold 9.1.4,
you also have the option of just activating scripts in a .mwxml on your computer
without saving them into a document to be loaded by everyone. You will still
need to have the Scripting privilege for the document you are logged into
though. You can also do the same for a single script in a .mwscript file which is
just a plain text file. For the really advanced, it is also possible to "run" a
.mwscript file using the moneyworks command line tool.

To save a script for transfer to another document:

1. Select the script to deploy by clicking on its name on the sidebar

2. Click on the Cogs icon on the bottom left of the script window and select

Save Selected Script as XML

The standard file dialog will open

3. Choose the location (and name if desired) for the xml script file and click

Save

Note that the file extension must be .mwxml. A copy of the script will be
saved as a file in the nominated location.

Other options in the cogs menu:

• Save all scripts as XML: All scripts will be saved in a single .mwxml file. If

such a file is double-clicked (with a MoneyWorks document open), you will

Deploying selected scripts

You can highlight more than one script (and/or UI Form Layouts, which are also
displayed in the sidebar) by Cmd/Ctrl clicking on each one in the sidebar. The
cogs pop-up menu then has the option to save the selected scripts. You actually
don't need to travel down to the cogs menu; you can right-click on a selection of
scripts to get the menu right under your mouse.

The MWScript Language

The MWScript lnguage is designed to be easy to learn if you are already familiar
with the more advanced features of MoneyWorks report writer.
Scripts, Automation and the REST of it

The MWScript Language

The MWScript expression syntax is compatible with the existing MoneyWorks
expressions that you use in custom forms and reports. MWScript adds handlers
and statements. Flow control is closely analogous to that provided by the report
writer.

Writing a script is a lot easier than using the report writer though, because you
can simply type the statements into the script, rather than clicking to create
parts and cells.

Scripts consist of "handlers" (aka functions) containing statements. Statements
are normally one per line. The only exception to this is that string constants (as
of v9.1.8) may contain newlines which will result in a statement continuing over
multiple lines. There is no need to end a statement with a semicolon.

Types

MWScript supports the same types as are available in the report writer. As in
the report writer, the language is very weakly typed (values are freely type-
promoted as necessary).

Type Example

• Number 5.35
• Date '1/1/13' — note that single quotes are for dates, not text strings
• Text strings "mwscript" or `also a string`. You can embed one kind of
string delimiter inside a string that begins and ends with the other kind of
delimiter `string with " inside it`. You can also escape a delimiter
using a backslash. You can also include newlines and tabs using backslash
escape codes "\t\n\"".

Finally, as of v9.1.8 Nowdoc-style multiline string constants may also be used. A
nowdoc string begins with a delimiter that you define using <<DELIM and then
ends with the delimiter you defined on a line by itself: DELIM. You can also have
an inline Nowdoc string where the closing delimiter is on the same line as the
start. In this case, the initial delimiter definition ends with a space, which is not
part of the string. e,g: <<NOWDOC inline dowdoc stringNOWDOC

• Selection — create via CreateSelection(tableName, search) function.
• Table — create via CreateTable() function.
• Record — created by looping over a selection with foreach

• Associative Array — create with the CreateArray() function

Associative arrays use the syntax arrayname[key], where keycan be any text
up to 31 characters, an integer, or a date (internally, integers and dates are
represented as text formatted so that lexical sort order matches numeric/
date sort order). Data values can be any other type.

let myArray = CreateArray()
let myArray[0] = "thing"
let myArray["mykey"] = myArray[0]
let myArray['31/1/12'] = 500

Arrays, like Tables, are always passed by reference, so if you assign an array to
another variable, or pass it as a parameter to a function, you are not copying the
array. If you want to copy an array, you must allocate a new array with
CreateArray and explictly copy all of its members.

• Handle — some objects are referenced by an opaque handle. This includes
window and list handles that MoneyWorks might pass to your script, and
also File handles, JSON parser handles, XML parser handles etc that are
returned by creation functions. Where noted in the documentation for a
creation funciton, you may need to explicitly free such handles when you
are finished with them. You do not need to explicitly free tables, arrays, or
selection.

Properties

Properties are variables that last for the lifetime of the script. They are
instantiated each time the script is loaded and discarded on unload.

Properties are defined outside of message handlers.

property mytextglobal = "qwertyuiopasdfghjklzxcvbnm"

If you need a property to be persistent across sessions, you can store the value
in the database (the User2 table is appropriate for this, see the SetPersistent
and GetPersistent functions). Load the value in the script's Load handler (or
lazily load the first time it is needed), and store it in the Unload handler if it
changed. Keep in mind that every user will be executing the script with their
own copy of the properties, so you may need to take steps to stop one user
from clobbering values stored by another user, or you might use the user's login
Scripts, Automation and the REST of it

initials as part of the storage key to store per-user settings.

You can declare a simple-type property to be persistent. If you do this,
MoneyWorks will automatically save and load its value (locally, on each client)
when your script is Loaded and Unloaded.

persistent property MyPrefValue = "foo"

Note that these persistent values are stored per client machine and all scripts
for all documents the client might open or connect to are in the same
namespace. Once the script has been run once on a particular computer, keep in
mind that the value of the property at load can be different from the value that
it appears to be initialised to in the script. To store persistent values per-
document, use the SetPersistent and GetPersistent functions.

Constants

Constants are named values for use within the script.

Constants are defined outside of message handlers.

The MWScript Language

MoneyWorks will automatically call some specially-named handlers
automatically to allow you to intercept various UI functions. All you need to do
is include the handler in your active script, and MoneyWorks will call it (see the
next section, Standard Handlers).

If a parameter required by your handler is not supplied by the caller, then the
value will be NULL. Parameters are untyped, so if callers don't provide a value of
the correct type, you may need to convert the type yourself to the required type
(usually using TextToNum or NumToText), although number and date types will
be automatically promoted to the string type if you use them in an expression
that expects a string (although the automatic type conversion will be in a default
format).

Comments

Comments use the C++ form. // for a to-end-of-line comment; /* and */ to
begin and end a block comment that can span lines or within a line.

Assignment

IMPORTANT: Every script should declare a constant with the name meta, which
will be used when reporting errors the script might generate. The string should
therefore provide a way for them to contact you.

The let statement assigns the result of an expression to a new or existing
variable. If the variable has not previously been seen in the handler and is not a
property, then it is implicitly declared as a local variable in the handler.

constant meta = "Script for Something by Your Name and your URL"

let myVar = Today() + 7 // adding a number to a date adds that many
days

The meta contant will be used by MoneyWorks to identify your script to the
user. It must be a string.

Conditionals

Handlers

A handler defines a callable function with optional named parameters and an
optional return value. A handler is a peer of the built-in intrinsic functions and
can be used in expressions in the same way.

A handler is defined by the keyword on, followed by the handler name and an
optional list of parameter names. The handler body ends with the keyword end
on a line by itself.

Conditional flow control is done with if, elseif, else, and endif. Zero or
more elseif clauses are allowed for an if, followed by zero or one else
clause, followed by an endif.

Short form:

if condition

// do something

endif

And the long form:
Scripts, Automation and the REST of it

if condition

// do something

elseif anothercondition // can have any number of these

// do something else

else // up to one of these
// do other thing

endif

The long form effectively provides switch/case functionality.

While loops

General looping can do done with a while loop. Loops can make use of the
break and continue statements for early exit or short circuit (just as in C-like
languages, and the report writer).

while condition

if special_condition

break // exit the loop

endif
if another_condition

continue // go back to top of loop, skipping do stuff

endif
// do stuff

endwhile

For loops

The MWScript Language

assetcat and asset. The expression must yield a selection variable for the
specified table. The loop control variable is a record, whose fields can be
accessed by suffixing the variable name by a field name (e.g. rec.ourref).
The variable used on its own will yield a 1-based index.

• the keyword text which will iterate over words or lines in comma or newline
delimited text. The delimiter is determined automatically—if there is at
least one newline, then iteration is by line, otherwise iteration is by comma.
Every line of multiline text should terminate with a newline (including the
last one!).

• the keyword textfile that will iterate over lines in a textfile loaded from the

local filesystem using the "file://" scheme, or from an HTTP server using the
"http://" or "https://" scheme. You can use the http scheme to access data
from remote data sources (e.g. REST servers. It retrieves data using the GET
operation only). If the path is supplied, it must be in the temp directory, the
custom plugins directory, MoneyWorks app support directory, or have a file
extension of .txt or .csv. If the path is specified by the user, it can be
anywhere or have any extension (but obviously should be a text file).
Anywhere outside these locations will need to be specified in a file open
dialog box by the user (which will be automatically invoked for any invalid
or empty path).

• the keyword array which will iterate over key values in an associative array

variable;

• and finally no keyword but rather a parenthesis-enclosed pair of values
defines a simple numeric range (with an optional step value). The values
can be full expressions but must be numeric. If the finish value is less than
the start value, no iterations will occur (unless the step is negative).

There are several kinds of for loops that operate on different kinds of collections
or ranges. Each kind starts with the keyword foreach and ends with endfor.

Foreach variants:

The general form is

foreach loop-control-varin type-keywordexpression

Foreach declares a local loop control variable whose scope is limited to the loop
body. Type keywords can be:

• database table names (defining a loop over a selection of records). Available

table names are: account, ledger, general, department, link,
transaction, detail, log, taxrate, message, name, payments, product
(items), job, build, jobsheet, bankrecs, autosplit, memo, user, user2,
offledger, filter, stickies, lists, login, contacts, inventory,

foreach rec in transaction CreateSelection("transaction",

"status=`P`")

foreach rec in account someSelectionICreatedEarlier
foreach word in text "foo, bar, baz"
foreach line in textfile "file://"
foreach line in textfile "http://"
foreach key in array myArrayVar
foreach i in (0, 10) // integers
foreach i in (100, 0, -10) // integers with optional step

Range Example:

// log the numbers 1...100
foreach i in (1, 100)
The MWScript Debugger

You can add, delete, and rename scripts (use the icons at the bottom of the
sidebar).

Active scripts are loaded at login and unloaded at logout, and a script is also
unloaded/reloaded when you click the Activate button in the script editor
toolbar (the old version of the script is first unloaded if it was loaded, then the
modified script is compiled and loaded).

You can keep inactive scripts in a document. They won't do anything until you
activate them.

You can use an inactive script to store boilerplate text for other purposes (such
as a mail template, html, json etc). See GetScriptText. As of v9.1.8 you can also
store such boilerplate text conveniently within your script using a Nowdoc
string.

The MWScript Debugger

MoneyWorks 9.2.1 and later has a debugger for the MWScript scripting
language. The debugger can be used to proactively debug scripts by setting
breakpoints and stepping through the script line-by-line, or it can be entered if a
runtime error occurs, or a long-running operation needs to be interrupted.

Debugging runtime errors

For a regular user who does not have the Scripting privilege, there is not much
they can do about errors in the scripts you deploy, other than reporting the bug
to you so that you can fix it. For that reason, every script you deploy should have
a constant meta declaration with a string containing your contact details. This
string will be shown to the user in error alerts.

Scripts, Automation and the REST of it

syslog(i)

endfor
// note that (100, 1) will iterate 0 times, unless you supply a

negative step

// log the numbers 100, 90, 80, ... 0
foreach i in (100, 0, -10)

syslog(i)

end for

Array Example:

// foreach in array iterates over keys; get the value by

subscripting with the key

foreach key in array anArray

syslog(key + " = " + anArray[key]) // key is always text

end for

List Example:

// comma-delimited text
foreach w in text "foo, bar, baz"

syslog(w)

endfor
// newline-delimited text
foreach line in text "firsttlinensecondtlinenlasttlinen"

syslog(line)

end for

Selection Example:

// loop control is of record type; use dot-notation to access

fields

// the naked loop contol variable is a 1-based index
foreach a in account CreateSelection("account", "code=`1@`")

syslog("record #" + a + ": " + a.code + " " + a.description)

end for

Running Scripts

You can install multiple scripts in a document and enable or disable them
individually.

Use the Show Scripts command to show and edit the scripts installed in a
document. Note that only one user at a time can make changes to scripts.
Scripts, Automation and the REST of it

The MWScript Debugger

Infinite loops

The MWScript virtual machine does not know that this is an error, so will happily
follow your script's instructions to endlessly perform a loop with no possible exit
condition, or — even worse — endlessly put up alert boxes. In the first case,
after a few seconds, MoneyWorks should show an indeterminate progress
window with a message "A script is running....". Since you have the Scripting
privilege, this window will have an enabled Stop button. You can use this to
immediately drop into the Debugger. Here you can examine the script to see
what is happening, and you can use the Debugger's Stop button to abort
execution of the current handler and return control from your script to
MoneyWorks. Stop does not deactivate the script, so MoneyWorks will continue
to call your handlers as appropriate. If it calls your handler again and you're back
in the loop, the bigger hammer is the Deactivate button, which will deactivate
the script without calling the Unload handler.

In the case of an infinite loop of alert boxes, there will be no delay long enough
for an indeterminate progress window, so in this case, hold the Ctrl+Shift
keys down when clicking a button in the alert. Prior to v9.2.1 this would offer
the opportunity to disable the script. From v9.2.1, it will enter the debugger.

Breakpoints

While developing or testing your script, you can proactively enter the debugger
from any point in your script by setting a breakpoint in the Scripts window. Click
in the darker grey breakpoint margin next to the line number of the line(s) that
you want to stop at. A white blob will be placed, indicating a breakpoint. When
your script reaches that line, the debugger will be invoked.

You must leave the script window open while debugging. Breakpoints are
discarded if you close the script window or select a different script in the Scripts
window.

When you set a breakpoint on a line that does not correspond exactly to a
virtual machine instruction, you will find that the debugger window displays the
breakpoint on the line that doescorrespond to a virtual machine instruction.

For someone who does have the Scripting privilege for the document, a runtime
error will come with the option of dropping into the debugger, or opening the
scripts window at the point of the error.

Edit selects the line in the script editor. Ignore just aborts execution of the
current handler call from MoneyWorks without unloading the script (same as
Debugger Stop button). Debugger opens the debugger at the offending line.
Scripts, Automation and the REST of it

The Debugger window

You can resize the panes by dragging the separators between them.

The MWScript Debugger

Single-stepping

If you entered the debugger via a breakpoint or interrupting the script via Stop
button etc, you can continue or single-step through the script using the toolbar
icons (or pressing the indicated key).

• Continue (c) will continue execution; if there are no further breakpoints or

fatal errors, the debugger will close

• Step Over (o) will step to the next line/instruction. Step Over will step over

a handler call.

• Step In (i) will step into handler calls. If there is no handler call on the line,

it is effectively the same as Step Over.

You cannot step into MoneyWorks intrinsic functions or calls to public
handlers in other scripts (to do that, you need to open that script and put a
breakpoint in it). <br> <br>If you are at a line with multiple handler calls in
an expression (for example an expression like: let a = Foo(5) + Bar(3)),
Step In will step into the first one (Foo); to step into Bar you will need to
use Step In when exiting Foo.

• Step Out (u) will execute until the current handler returns to its caller
• Stop will abort the current handler call chain and return control to

MoneyWorks without deactivating the script. The script will also be opened
in the Script editor at the current line

• Deactivate will Stop and deactivate the script, so MoneyWorks will not call
your handlers until you reactivate the script. If you close the Scripts window
with the script deactivated (thus saving the state to the server), the script
will also be deactivated for other users when they next log in.

Changing breakpoints

You can set or clear breakpoints from the debugger by clicking in the breakpoint
margin. When you Continue or Step Out, a breakpoint in the intervening code
will drop you back into the debugger. Breakpoints set in the debugger will
persist until you clear them or until the script is unloaded.

The Debugger contains 3 panes:

• The script with the current line of execution indicated by a ▷ in the margin
• The local variables for the current handler, along with the script's

properties. You can double-click array variables to expand, or double-click
on strings and tables to show them in a viewer window. The string viewer
will show invisible characters such as newlines and tabs and spaces, as well
as other ASCII control characters, along with the length in characters and
bytes; it will alternatively display a warning if the string is not valid UTF-8 or
if it contains a NUL character (these conditions will prevent a string from
behaving properly in most situations)

• The call stack — the sequence of handler calls that led to where you are
now. You can click on the other points in the call stack to navigate to that
point in the script and show that handler's local variables (it may be a
different script if you have scripts calling each other via public handlers)
Scripts, Automation and the REST of it

Fatal error

Window/UI event handlers

Standard Handlers

If you entered the debugger due to a fatal runtime error in your script, you
cannot Continue execution, but you can examine the call stack and variable
values to determine the cause of the error before either Stopping or
Deactivating the script. Fatal errors include things like passing the wrong
number of parameters to an intrinsic function or a NULL or invalid handle to a
function. These are conditions that your script should not allow to happen. If a
user without the Scripting privilege gets a fatal error, that will Stop the script for
them, but they won't be able to fix the error.

Navigating in the script

As with the Script Editor, you can search the script within the debugger using ⌘-
F/Ctrl-F. Highlighted matches can be stepped through with the return key (shift-
return to step backwards). Press tab to exit the search field. When the script is
active use ⌘-G/Ctrl-G to find the next instance of the highlighted text (Find
Selected), or Shift-⌘-G to Find Selected Backwards. Since the text is read-only
you can also just use g or shift-G.

Standard Handlers

User-interface helper handlers with specific names are called automatically for
active scripts. Handlers that implement these standard messages (and variants
thereof) will be called in all active document scripts. By implementing these
handlers in your script, you can override or extend the behaviour of
MoneyWorks.

General event handlers

The standard handlers for general events are Load, Unload, UserLoggedIn,
UserLoggingOut, AllowPostTransactions, PostedTransactions, and
AllowDeleteRecords.

For overriding window behaviour, there are standard window handlers: Before,
ItemHit, Validate, After, Cancel, Close, EnterField, ValidateField, ExitedField,
EnterCell, ValidateCell, ExitedCell, URLCallback, Dawdle, TweakColumnList.

For adding custom columns to the Transaction entry window or the Timesheet
window, you can implement a TweakColumnList handler.

Report tweaking

There is also a SetupReport handler for tweaking reports before they are
executed.

Mailing

You can implement a custom SendSMTPMail handler to customise the way
SMTP emails are sent.

Standard window handlers are passed a windowRef identifying the specific
instance of the window from which the message was sent. You can use this to
access content of the specific window. Each kind of window is identified by a
class name (or windowID) but this class name is not passed to the handler.
Window handlers will usually be implemented with windowID-specific handler
names incorporating the windowID (see Specific UI Element Handler Names), so
its value is usually implicit. If you use a general handler, you can get the
windowID from the windowRef using the GetWindowID(winRef) function.

Load

The MWScript main entry point.

Automatically called: When your script is loaded. Scripts in the document are
usually loaded when you open or connect to a MoneyWorks document.

Use for: To do any necessary initialisation you need (such as installing a menu
command in the Command menu), or, if your script is to be manually
invoked from the Script Editor, this is the main entry point for your script.
Scripts, Automation and the REST of it

Return value: ignored

Example :

on Load

Alert("Hello World!")

end

Note: You should not normally do anything that invokes a modal user interface
(like Alert), or making database requests in a Load handler for a script that will
load every time you log into the document. The exception would be if you are
just testing something out (as in the example above). In this case, you should
use Run Once to Load and Unload the script so that it will not be saved as active
and run for everyone when they log in.

Unload

Automatically called: When the script is about to be unloaded. Script unloading
happens when you deactivate the script in the script editor (including the
implicit deactivate that happens when you change and reactivate the
script), or—more usually—when you log out of the document.

Use for: Use this kiss-off as an opportunity to e.g. save persistent values in the
database (although note that in MoneyWorks 8, simple properties can be
persistent on clients using a persistent property declaration.

Return value: ignored

Example :

on Unload

Say("Goodbye!")

end

UserLoggedIn

Standard Handlers

Use for: You can use this opportunity to load user-specific state. From v7, you
get this message even if password protection is not turned on. From v7.1
and later, you can also use this handler to abort the login by returning 0.
Older scripts will still work due to the default return value for any handler
being 1. The user can be identified by the global variables Initials or
UserName.

Return value: Return FALSE to abort the login (i.e. to prevent the user from

logging in).

Example 1 :

on UserLoggedIn

if UserName = "Rowan" and Day(Today()) >= 6

Alert("Login denied", "No weekend logins")
return FALSE // deny login

endif

end

Example 2 :

on UserLoggedIn

// record the login time in the UserText field
ReplaceField ("Login.UserText", "Initials=`" + Initials+"`",

"`Last login:" + DateToText(Time(), DateFormShortDateAndTime)+"`")
end

UserLoggingOut

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When the user is logging out (either disconnecting,

switching user, or closing a local file).

Use for: You can use this opportunity to save user-specific state. The current
user can be identified by the global variables Initials or UserName.

A script handler you can implement to override standard MoneyWorks
behaviour.

Return value: ignored

Automatically called: The user has just logged in (network or local) and also

when Switch User is used to switch logins when already in a file.
Scripts, Automation and the REST of it

AllowPostTransactions (selection)

A script handler you can implement to override standard MoneyWorks
behaviour.

This will be called for both electively and non-electively posted transactions.

Standard Handlers

Use for: To do any post-processing you might want to apply after transaction

posting. You might, for example, want to transfer some data to another
database, or tag the transactions in same way.

Automatically called: When the user is about to (electively) post transactions.

Return value: ignored

Use for: To implement programmatic control over whether a user is allowed to
post transactions. Return 0 to abort posting. If you return 0, none of the
transactions in the selection will be posted.

Notes: Avoid iterating over the records in the selection one at a time, as this
may be very time consuming if you are connected to a remote server.
Where possible, make the decision based on a search of the selection using
IntersectSelection.

Example:

on AllowPostTransactions(toPost)

let notMine = IntersectSelection(toPost, `EnteredBy <>

Initials`)

if RecordsSelected(notMine) > 0

Alert("Can't post", "You can only post transactions that

you entered")

return false

endif
return true

end

Return value: Return 1 (or TRUE) if the selection of transactions should be

allowed to be posted. Return 0 (or FALSE) to prevent the user from posting
them. If you deny posting in this way, you should present some user
interface (such as an alert) to explain what is happening. The default return
value (for all handlers) is 1 (TRUE).

PostedTransactions (selection)

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When the user has just posted the transactions.

AllowDeleteRecords(tableName, selection)

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When the user is about to delete records from a list.

Use for: To exercise finer control over whether the current user is allowed to

delete certain records. Return TRUE if all of the records in the selection may
be deleted. Return FALSE to prevent any of the records in the selection
being deleted.

Notes: Avoid iterating over the records in the selection one at a time, as this
may be very time consuming if you are connected to a remote server.
Where possible, make the decision based on a search of the selection using
IntersectSelection.

Example:

on AllowDeleteRecords(table, sel)
if table = "transaction"

let no_del = IntersectSelection(sel, `type = "QU@" and

analysis = "PRICE"`)

if RecordsSelected(no_del) > 0

Alert("Cannot delete", "The selection contains quotes

used for your price book")

return false

endif

endif

end

Return value: boolean
Scripts, Automation and the REST of it

Validate (windowRef)

Before (windowRef)

Standard Handlers

A script handler you can implement to override standard MoneyWorks
behaviour.

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When the user clicks OK or Next on a record that has had
changes made to it (if no fields have been changed, the handler may not be
called). Use the windowRef to access information from the window.

Automatically called: When a window opens or when a new record is loaded in

the window (when the user clicks the Next or Prev button). For list
windows, this will be called when the user changes the view in the sidebar.

Use for: To control whether the data in the window can be saved as-is. The

handler should return 1 (true) or 0 (false) to indicate whether the window
content should be accepted. Returning 0 will prevent the window from
closing. IMPORTANT: If you do this you should provide an explanation to the
user via an alert or coachtip. Users will be very unhappy if they don't know
why the OK button is not working!

Specific Naming: You can and should implement a Validate handler that is
specific to the particular window ID of interest. In the case of the
Transaction entry window, the handler can also be specific to the 2-letter
transaction type. If you do not use a window ID-specific name, you must
test the window ID returned from GetWindowID(windowRef)

Use for: To set the initial field values of a custom window; To perform any kind
of setup your script needs to do for a standard window; For a list window,
install Toolbar commands.

Specific Naming: You can and should implement a Before handler that is
specific to the particular window ID of interest. In the case of the
Transaction entry window, the handler can also be specific to the 2-letter
transaction type. If you do not use a window ID-specific name, you must
test the window ID returned from GetWindowID(windowRef). A non-
specific before handler would be called for every Window.

e.g. Before:<WindowId>:<TransactionType>

Example:

Example 1:

on Validate:F_TRANS:DI(windowRef) // only called to validate Debtor
Invoice transaction window

if GetFieldValue(windowRef, "E_DEPT") = ""
Alert("Salesperson must be specified")
return false

on Before:F_TRANS:DI(windowRef) // only called when a Debtor
Invoice is loaded into a transaction window
if GetFieldValue(windowRef, -2) = 0

Navigator("", "This is a new invoice")
// do something that is actually more useful for new

endif

end

Return value: Boolean. TRUE indicates that the contents of the window are
valid and acceptable and the record can be saved. An After message will
follow. FALSE indicates that the contents of the window are unacceptable
and the record will not be saved and the window will not close. An After
message will not follow.

invoices...

endif

end

Example 2:

on MySum

let s = SumSelection("transaction.Gross - AmtPaid",

"*highlight")

Alert("Outstanding Total = " + s)

end

on Before:F_TRANSLIST(windowRef)

InstallToolbarIcon(windowRef, "MySum") // Install toolbar icon

in list
Scripts, Automation and the REST of it

end

After (windowRef)

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: Called when a window is closing or when a new record is
about to be loaded into it. May not be called if no content was modified.

Use for: Reacting to the user clicking OK

Specific Naming: You can and should implement an After handler that is specific

to the particular window ID of interest. e.g.
After:<WindowId>:<TransactionType> (the last of these applies only when
the WindowID is F_TRANS)

Cancel (windowRef)

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When a window is closed via the Cancel button.

Use for: Reacting to the user clicking Cancel

Specific Naming: You can and should implement a Close handler that is specific

to the particular window ID of interest. e.g.
Cancel:<WindowId>:<TransactionType> (the last of these applies only when
the WindowID is F_TRANS)

Close (windowRef)

Use for: Cleaning up regardless of how the user closes the window (Cancel, OK,

close box)

Specific Naming: You can and should implement an Close handler that is

specific to the particular window ID of interest. e.g. Close:<WindowId>

Standard Handlers

ItemHit (windowRef, fieldNameString)

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: Whenever the contents of a field changes. This includes

typing a a character into an edit field; clicking a checkbox; changing a popup
menu.

Use for: Reacting immediately to a control change or as a chance to call AutoFill

on a code field

Specific Naming: You can and should implement an Itemhit handler that is

specific to the particular window ID and itemID of interest. e.g.
Itemhit:<WindowId>:ItemID:TransactionType (the last of these applies only
when the WindowID is F_TRANS)

ItemHit handlers for editable list cells can have more detailed specific naming
(down to the column name of the active cell) and will receive additional
parameters (namely the list handle, the current row number, and the current
column number). e.g. on ItemHit:F_TRANS:L_LIST:DI:Location(winRef,
listId, listHdl, rownum, colnum) for an ItemHit handler that responds only
to kepresses in the location column of Debtor Invoices. Note that for the
transaction entry form, you must supply the type specifier. Note also that due to
backwards compatibility, the list is identified by its underlying identifier L_LIST
rather than a tab name like By_Item. This does have the benefit that you can
respond to, eg, the job column in either the By_Item or By_Account tabs using
the same specific handler (since v9.0.9).

A script handler you can implement to override standard MoneyWorks
behaviour.

Dawdle (windowRef)

Automatically called: When a window is closed. Use this to dispose any

persistent data you may have created for the window (to "dispose" an array,
assign 0 to it).

A script handler you can implement to receive periodic events in a custom
MWScript window.
Scripts, Automation and the REST of it

Automatically called: Approximately every 10 seconds while your custom

window is frontmost.

Use for: Updating information that may change over time. Avoid performing
any tasks that may take a long time. If you make a web request using the
Curl API, make sure you set a short connection timeout.

Availability: MWScript in MoneyWorks Gold 8.1.5 and later.

Standard Handlers

Use for: Validating the contents of a field. You can also call CheckCodeField to
present a code choices dialog box if the field is not a valid code for a
particular table.

Specific Naming: You can and should implement an ValidateField handler that is

specific to the particular window ID and itemID of interest. e.g.
ValidateField:<WindowId>:ItemID:<TransactionType> (the last of these
applies only when the WindowID is F_TRANS)

EnterField (windowRef, fieldNameString, fieldValueString)

ExitedField (windowRef, fieldNameString, fieldValueString)

A script handler you can implement to override standard MoneyWorks
behaviour.

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When a field becomes active by being tabbed into or

Automatically called: When a field has been exitted.

clicked.

Use for: Preflighting a field (maybe to save the contents before the user

changes them).

Return value: ignored

Specific Naming: You can and should implement an EnterField handler that is

specific to the particular window ID and itemID of interest. e.g.
EnterField:<WindowId>:ItemID:<TransactionType> (the last of these applies
only when the WindowID is F_TRANS)

ValidateField (windowRef, fieldNameString,
fieldValueString)

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When a field is about to be exitted. Return 0 if the field
value is not acceptable: this will keep the focus in the field. IMPORTANT: If
you do this you should provide an explanation to the user via an alert or
coachtip. Users will be very unhappy if they don't know why they can't exit
a field!

Return value: Boolean

Use for: Reacting to the user tabbing out of a field

Specific Naming: You can and should implement an ExitedField handler that is

specific to the particular window ID and itemID of interest. e.g.
ExitedField:<WindowId>:ItemID:<TransactionType> (the last of these
applies only when the WindowID is F_TRANS)

EnterCell (windowRef, listRef, rowNum, columnNum,
cellValueString)

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When a cell in an editable list (such as the detail line

entry list) is activated by tabbing into it or clicking into it.

Use for: You can use this opportunity to keep track of which cell is active
(knowledge you may need in an ItemHit handler, for example).

Return value: none

Specific Naming: You can and should implement an EnterCell handler that is
specific to the particular window ID, itemID and possible column name of
interest. e.g. EnterCell:<WindowId>:ListItemID:ColumnName.
Scripts, Automation and the REST of it

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

ValidateCell (windowRef, listRef, rowNum, columnNum,
cellValueString)

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: When a cell in an editable list (such as the detail line

entry list) is about to be exitted. Row and column numbers are zero-based.
Return 0 if the cell value is not acceptable: this will keep the focus in the
cell. IMPORTANT: If you do this you should provide an explanation to the
user via an alert or coachtip. Users will be very unhappy if they don't know
why they can't exit a cell!

Use for: Validating the content of a cell.

Return value: Boolean

Specific Naming: You can and should implement a ValidateCell handler that is
specific to the particular window ID, itemID and column name of interest.
e.g. ValidateCell:<WindowId>:ListItemID:ColumnName.

Standard Handlers

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
ExitedCell: A cell in an editable list has just lost focus
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ExitedCell (windowRef, listRef, row, column,
cellValueString)

A script handler you can implement to change/augment standard MoneyWorks
behaviour.

Automatically called: When a cell of an editable list view is exited. Analogous to

ExitedField for editable list cells.

Return value: none

Specific Naming: You can and should implement an ExitedCell handler that is
specific to the particular window ID, itemID and possible column name of
interest. e.g.
ExitedCell:<WindowId>:ListItemID:ColumnName:<TransactionType>.
Scripts, Automation and the REST of it

See Also:

AddListLine: Add a row to an editable list
DeleteListLine: Delete a row from an editable list
EnterCell: A cell in an editable list has just gained focus
ExchangeListRows: Swap rows in an editable list
GetActiveListColumn: Get the column number of an edit list that has

keyboard focus

GetActiveListRow: Get the row number of an edit list that has keyboard

focus

GetListField: Get the text of an editable list field
GetListHandle: Get list handle from window handle and list ident
GetListLineCount: Get number of rows in a list
GetListName: Selected tab name for Transaction entry details list
MergeOrderLines: Merge order lines (opposite of SplitOrderLines)
SetListField: Set the text of an editable list field
SortListByColumn: Sort an editable list by a column
SplitOrderLine: Duplicate a line item on an order, splitting the order qty (for

serial entry)

ValidateCell: Control whether the content of a cell is acceptable and the cell

can be exited

URLCallback (window, webviewitemID, url)

A script handler you can implement to act on the URL of a web view changing.

Automatically called: When the current location in a custom Web View that has

requested callbacks changes. The new location is provided in the url
parameter. To request callbacks, you must call WebViewControl(winRef,
itemID, "options wantCallbacks='true'") on the web view.

Use for: Intended to facilitate handling of OAuth logins. You can parse the login

token from the URL.

Availability: MoneyWorks Gold 8.1 and later.

SendSMTPMail (recipients, attachmentPath, subject,
message, attachmentFileName)

A script handler that takes over the job of sending SMTP mail.
Standard Handlers

When MoneyWorks has an email + attachment to send and the preferences are
set to send via SMTP, MoneyWorks calls the Built_In:__SendSMTPMail script to
send the email. This is an open-source MWScript that uses the CURL library to
cummunicate with the SMTP server to get the mail delivered.

In v8.1.7 and later, if there is a script handler named SendSMTPMail, then that
handler will be called instead (note: if there are multiple such handlers, they will
all be called, potentially resulting in the message being sent multiple times)

recipientsmay be a single recipient or a comma-delimited list

attachmentPathis the posix or windows path to the file to be attached

subjectis the email subject

messageis the plain text message; may be blank

attachmentFileNameis a suggested attachment name which may differ
from the actual filename of the attachmentPath (e.g. "Invoice 1234.pdf")

Your SendSMTPMail handler can call internal handlers
Built_In:__SendSMTPMail(to, path, subject, message_text,
attachmentName) or Built_In:__SendSMTPMail_WithCredentials(to, path,
subject, message_text, attachmentName, server, replyTo, authUser,
authPass) to do the heavy lifting for you. Note that these handlers are open
source and can be found in the Preload_Built_In.mwscript file in the Standard
Plugins Scripts/Autoload folder.

Note that prior to v9, if there was no user defined handler, an external
executable (sendEmail) was used. SendEmail(.exe) is no longer installed with
MoneyWorks 9, so if you have scripts that rely on it, you may need to update
them.

Automatically called: When a message needs to be sent via SMTP

Use for: Customising SMTP sending behaviour

Availability: MoneyWorks Gold 8.1.7 and later.



Scripts, Automation and the REST of it

SetupReport

TweakColumnList (windowRef, listRef)

Standard Handlers

A script handler you can implement to override standard MoneyWorks
behaviour.

A script handler you can implement to override standard MoneyWorks
behaviour.

Automatically called: Immediately before running a report (but after the report

settings dialog has been OK'd).

Use for: You can use this opportunity to tweak the report (in particular, you can
use SetReportColumnWidth to modify tab stops in the report to hide or
show columns. You can also abort generation of the report by returning
FALSE from this handler.

Return value: Boolean: return FALSE to cancel the report.

Your handler can call the AppendColumnToStdEditList function to append
custom columns to allow entry into additional custom fields or tagged fields in
the Details or JobSheet table.

Automatically called: When instantiating an editable column list in the

transaction entry window or the timesheet window. Do not do anything
else in your handler other than appending columns to the list. Do not
present any UI.

Example: The following handlers add columns to the transaction and timesheet

Example: The built-in Details report in Standard Plugins/Reports/~Transaction/

windows.

uses a SetupReport handler to configure the columns of the report
according to the user's selection of Debits & Credits, Net, Tax, Gross or
Items & Qty:

on SetupReport

let dc = Val("Debits_and_Credits")
let iq = Val("Items_and_Qty")
SetReportColumnWidth("COL7", 190)
if dc

SetReportColumnWidth("COLPRICE", 0)
SetReportColumnWidth("COLUNIT", 0)

elseif not iq

SetReportColumnWidth("COLPRICE", 80)
SetReportColumnWidth("COLUNIT", 0)

else

SetReportColumnWidth("COLPRICE", 80)
SetReportColumnWidth("COLUNIT", 30)

endif

end

Note: Although report custom controls are automatically instantiated as

variables for the report, note that when a report script control is compiled,
the custom controls are not yet available, but they will be available when
the script runs, hence the use of Val(control_name) to get the values of
the radio button controls.

Specific Naming: None, but this handler will generally only be implemented in a

script control that is local to the report.
on TweakColumnList:F_TRANS(win, list)

AppendColumnToStdEditList(list, "Detail.Custom1", "Cust1|40|L")
AppendColumnToStdEditList(list, "Detail.Custom2", "Cust2|60|L")
AppendColumnToStdEditList(list, "Detail.UserText", "UText|80|L")
AppendColumnToStdEditList(list, "Detail.UserNum", "UNum|40|R")

AppendColumnToStdEditList(list, "_foo", "foo|50|L")
AppendColumnToStdEditList(list, "_bar", "bar|50|L")
AppendColumnToStdEditList(list, "_baz", "baz|50|L")

end

on TweakColumnList:F_TIMESHEET(win, list)

AppendColumnToStdEditList(list, "UserText", "UText|80|L")
AppendColumnToStdEditList(list, "UserNum", "UNum|40|R")

end

Specific Naming: The handler should be specific to either the F_TRANS or

F_TIMESHEET window identifier, and may also be specific to the selected
detail tab in the transaction window and to a specific transaction type (e.g.
TweakColumnList:F_TRANS:By_Item:DI will only apply to the By Item tab for
Debtor (Sales) Invoices).

See Also:

AppendColumnToStdEditList: Customise a standard edit list



Scripts, Automation and the REST of it

Specific UI Element Handler Names

Since common UI handlers tend to need to be implemented for specific window
classes or fields, there is an easy way to implement these handlers for their
specific target.

For the following handlers, you can write a handler that specifies its windowID
class and optional additional scope in the handler name:

• Before:windowID:transtype
• ItemHit:windowID:itemIdent:transtype
• ItemHit:windowID:listIdent:transtype:columnName (alternate form for list

cells)

• Validate:windowID:transtype
• After:windowID:transtype
• Cancel:windowID:transtype
• Close:windowID:transtype
• ValidateField:windowID:fieldindent:transtype
• EnterField:_windowID:fieldindent:transtype
• ExitedField:windowID:fieldindent:transtype
• EnterCell:windowID:listname:columnname:transtype
• ValidateCell:windowID:listname:columnname:transtype
• ExitedCell:windowID:listname:columnname:transtype

The transtype specifier only applies to the Transaction entry window and the
transaction list window and will not be present for any other kind of window.
Your handler will only be called if all of the specifiers match. To have your
handler called more generally, simply use fewer specifiers (note that the
specifiers are necessarily positional, so you can only reduce specificity by
dropping specifiers from the end). If there are multiple handlers for the same
message in your script that match, they will all be called, beginning with the
most specific. E.g. if you have ValidateField:f_trans:e_user1:DI and also
ValidateField:f_trans, they will both be called, in that order (assuming the first
one does not return false, in which case the call sequence would stop at that
point).

Example:

Specific UI Element Handler Names

say("validate trans field")

return 1
end

// will only be called for transaction user1 field for a sales

invoice

on ValidateField:f_trans:e_user1:DI
say("validate sales invoice user1")
return 1
end

Note: You SHOULD always return a value (0 or 1) for these validation handlers,
however, if you fail to do so, 1 is the default return value.

Important: You should generally never implement a non-specific handler (such
as Before or Validate, with no window id) unless you take great care to limit your
functionality appropriately. Remember that even the script editor receives these
messages.

Invoking handlers from menus, toolbars, and other places

You can install a handler in the Command menu using the InstallMenuCommand
function. You would normally do this from your script's Load handler. The
command will be uninstalled automatically when the script is unloaded (or you
can do so explicitly by calling the InstallMenuCommand function again with an
empty handler name).

You can install a handler in the Transaction Entry and list windows using the
InstallToolbarIcon function. Do this from the Before handler for the window. The
icon will be automatically uninstalled prior to another Before (so you should
reinstall it for every Before message). This is so that you can easily install a
transaction-type-specific toolbar icon. Lists will get a Before every time the
toolbar changes (such as for a change of selected view).

Public handlers

To make a handler accessible to reports, forms, the evaluate external command,
different scripts, or the entry field expression parser, use the publicattribute in
the handler declaration.

// will be called for all transaction entry window fields
on ValidateField:f_trans

on MyHandlerName(myParam) public

say("This is the public handler " + myParam)
Scripts, Automation and the REST of it

end

External invocations of the message will need to use its public name, consisting
of the script name, a colon, and the handler name (e.g.
My_Script:MyHandlerName(x)). If the script is not currently loaded, you won't
be able to compile a script that calls it.

Elevating privileges

Scripts normally run with the privileges of the logged-in user. You can have a
handler run with admin privileges by adding the elevatedattribute to the
handler declaration. Note that the extra privilege is dropped when the handler
exits, so the operation requiring the privilege will have to be completed in its
entirety.

on MyHandlerName(myParam) elevated

say("I'm running with admin privileges")
// hmm what would be useful to do here?
//   • post without elective posting privilege?
//   • override the extension field with a discounted value
//   • replace a value in a selection?
//   • Clear the hold checkbox with SetFieldValue()?

end

Uses statement for forward declarations

The compiler will normally only recognise your handlers that have already been
defined earlier in your script (or for public handlers in other scripts, which must
be currently loaded). In order to include calls to handlers that have not yet been
defined, or are in other scripts that are not currently loaded, you can use a uses
declaration to declare the name of a handler. It is up to you to make sure the
handler is defined/loaded when the calling script code executes, otherwise you
will get a runtime error.

This is somewhat like an extern declaration in C, or a forward declaration in
Pascal, except no parameter list declaration is required since MWScript does no
compile-time parameter checking.

e.g.

uses MyHandlerName
uses OtherScript:PublicHandler
Adding a custom user interface to your scripts

on Foo

MyHandlerName()    // not yet defined in script

end

on MyHandlerName    // now it is

OtherScript:PublicHandler() // might not be loaded at compile

time
end

Adding a custom user interface to your scripts

The scripting that we implemented in MoneyWorks 7 has proven to be
immensely beneficial to a large number of users, so in MoneyWorks 8 we
decided to incorporate the ability to augment the scripts with your own user-
interface windows and elements.

For example, you could build a list window to display a list of properties you
own or manage:

And a property entry window, which opens when you create a new property or
double click one in the list:



Scripts, Automation and the REST of it

What can be Built

Building Windows

Windows are created and laid out in the Script Editor window (choose
Show>Scripts.to open this). Below is the design window for the property
window displayed above.

As you can see, the windows can have a full set of controls (check boxes, radio
buttons, pop-up menus etc.), as well as entry fields, tabbed areas, image
placement and more.

What can be Built

You can design modal and non-modal windows, list windows, floating windows,
and can even extend the built-in MoneyWorks windows.

Windows are (normally) based on some data source, which will typically be a
MoneyWorks table, but might also be an external SQL database, another
MoneyWorks file (using the REST APIs), or even a query on a website.

You can't however alter the basic layout and functioning of the built-in
MoneyWorks windows (although you can extend them) as that might break
things. But if you don’t like our window, you can with a bit of work (actually
quite a lot of work), create your own replacement ones.
Note: It is important to realise that Windows and scripting go hand in

hand—only a script can open a window.

To design a new window:

1. Click the plus icon at the bottom left of the scripts window

You will be asked to enter the script name.

2. Set the Add a new UI Formoption, enter the name of the new window

and click OK



Scripts, Automation and the REST of it

Building Windows

window, and then take whatever action is required when the window is closed.

Form Tools

The tools for laying out the form elements are arranged down the left hand side
of the window:

Title: The window title (appears at the top of the window).

Growable: If this option is on, the user will be able to change the window size;

Add Control: Click this to add a new element to form. This is discussed below.

Z-Order: Changes the z-order of the selected elements (e.g. bringing to front or

sending to back.

Text: For specifying the text alignment of the selected element(s). Respectively

align left, centre and right.

H Sizing: Determines the horizontal sizingof the element if the window is

widened. Options are Fixed Left, Fixed Right, and Elastic.

V Sizing: Determines the vertical sizingof the element if the window's height is

altered. Options are Fixed Top, Fixed Bottom, and Elastic.

Small/Regular: The size of the text displayed in the selected element.

Bold/Italic: The style of the text displayed in the selected element.

Show Ident: Display the element’s Symbolic ID in the top right of the element.

The ID is how you reference the element in a script.

Show Z Order: Displays the Z order of the element in the top left. The higher the

number, the closer to the front. The Z order is important in that it
determines the tab order for the controls.

A new form window will be created, as shown below:

All you need to do now is to lay out the fields, buttons text etc that you want on
the window (which is drawn in outline in the right hand half of the screen), and
write the associated scripts to open the window, populate the fields on the
Scripts, Automation and the REST of it

Building Windows

Text box with Z level and ID displayed

Snap to Guides: If set, when an element is moved on the form, guidelines will

appear when its edges match the edges of adjacent elements on the forms.
This allows for more precise layout.

Sort Edit Controls: Sorts the Z-Order of the text edit fields so that tabbing will
move from the field at top left down through to the field at bottom right.

Element types

To add an element to the form:

1. Click the Add Controlbutton.

A new Untitledbutton will appear on the form. You can drag the element to
where ever you want it positioned, and resize it by dragging its resize box at
the bottom-right corner.

To change the type of the element:

1. Double-click the element

The Item Propertieswindow will open.

The type, ID and other details about the element are specified here.

Item kind: The type of the item

(button, pop-up menu, editable
text etc. These are discussed in
more detail below.

Symbolic ID: The ID of the item. Each

item that you want to access from
a script will need an ID. The ID is
text and must also be unique for
that form.

Horiz Sizing: How the location and size

of the element will change if the
window is widened by user.
Options are Fixed Left, Fixed Right
and Elastic.

Vertical Sizing: How the vertical

location and size of the element
will change if the height of the
window is changed by the user. Options are Fixed Top, Fixed Bottom and
Elastic.

Autosize Height:
Scripts, Automation and the REST of it

Autosize Width:

Visible: If this is off, the item will not be visible by default when the form is

displayed. Enabling can also be managed programmatically using the
SetFieldVisibility() function.

Enabled: If this is off, the item will not be enabled by default when the form is

displayed (you can't type into a disabled text field, or select from a disabled
pop-up menu). Visibility can also be managed programmatically using the
SetFieldEnabling() function.

Title: The title of the item (for example, the name that appears on a button, or

the label next to a pop-up menu).

Text: The text for static and edit text items. This can also be set
programmatically using the SetFieldValue() function.

Tooltip: Help text that will be displayed if the mouse hovers over the item.

Group ID: Radio buttons with the same Group ID will act as one radion button

set (so turning one on will turn another off).

Building Windows

Item Types

Default Button

The default button (activated when enter/return is pressed). By default, this will
be titled “OK” with an ID of “B_OK”.

When clicked, a Validate message is sent to the window, followed by an After
message (provided the Validate returned true). For User2 table records, you
should save any changes to the record in the After handler. For overlays to
standard forms, you can update tagged fields in the UserText from the Validate
handler (MoneyWorks itself will save the record before your After handler is
called).

The Cancel Button

The Cancel button closes the window without sending a Validate message (so
changes are not saved). By default this will be titled “Cancel” and the ID is
“B_CANCEL”.

Frame/Fill: For boxes allows you to select a fill (white, instead of the default

Pressing the esckey is the same as clicking on the Cancel button.

grey) and frame (grey or none), and for lines just the line colour (any colour
as long as it is grey).

Plain Button

Image Name: For pictures, the name of the image to be displayed. This can also

be set programmatically using the LoadPicture() function

A button for you own use to activate some procedure or open another window.
When the button is clicked an itemHit() message is sent to the window.

URL: For web views, the URL of the web page to display. This can also be set set

programmically using the LoadHTMLInWebView() and
LoadURLInWebView() functions.

Check Box

Tabs: For panels with tabs, the tab labels separated by a semi-colon (for

example “First Tab;Middle Tab;Last Tab”).

A check box. When clicked an itemHit() message is sent to the window, or you
can read/set the value using the getFieldValue() and setFieldValue() functions
respectively.
Scripts, Automation and the REST of it

Radio Button

Editable text

Building Windows

Radio buttons are assigned to a group id (using the Group ID field), so that when
one button in the group is turned on, the previously set button will be turned
off. Like check boxes, an itemHit() message is sent to the window when the
button is clicked, or the value can be read/set using the getFieldValue() and
setFieldValue() functions respectively.

Pop-up menu

For static popup menus, the allowable values should be set in the Textfield,
each value separated by a semi-colon (e.g. “Option A; Option B; Options C”).
Again an itemHit() message is sent to the window when the popup is selected,
and the value can be read/set using the getFieldValue() and setFieldValue()
functions respectively.

Any item name beginning with a “(” will be disabled, and you can use “(-” for a
separator item.

If you want a dynamic pop-up menu (one whose contents changes depending
on the context) use the AppendPopupItems() function to add items, and
DeletePopupItems() to clear the menu.

Static text

Editable text items are essentially fields into which the user can enter text. As
such, whenever a character is entered into an edit text field, an itemHit()
message is sent. Similarly when the user tabs out of the field, a validateField()
message is sent, enabling you to validate the entered data.

By default, an edit field's length is limited to 255 characters.

You can set (or prepend) metasymbols inside angle brackets in the default text
of field to change its behaviour:

<SBAR>      The text field will have a scroll bar
<SBA2>      The text field will be scrollable and support tabs,
with monospaced font
<LEN=nnn>   Specifies a maximum length in bytes
<PASS>      The field hides input with bullets (password field)
<CODE>      The field will autocapitalise and not allow spaces or
wildcards
<IDEN>      The field will not allow spaces or wildcards
<ARTN>      The field will allow newlines to be typed with
option-Return/Ctrl-Return
<READ>      The field will not allow typing, but will be selectable
for copying (9.0.3 and later)
<TIME>      The field will not generate an ItemHit until the user
pauses typing

You can include several metasymbols inside the same set of angle brackets. E.g.
<SBARARTNLEN=1000>

This is for text items on the window, such as labels and instructions, that cannot
be altered by the user. Using the text alignment and adornment tools, the text
can be large or small, plain, bold or italic. And, just like a certain automobile, you
can have the text in any colour provided it is black.

Box

Line

Because static text cannot be altered by the user, no itemHit() message is sent if
it is clicked on. Although the user cannot change the text, you can change it
programmatically using the setFieldValue() function. To do this you will need to
give it an ID.

You can select line and box styles from the Frame and Fill popups. Boxes can
have an optional title.
Scripts, Automation and the REST of it

List

A List is a set of rows and
columns. The structure of the
list (the columns) and it’s
contents are defined
programmatically when the list
is created, using either the
InsertListObject() or the
InsertEditListObject() function.

The contents of a list can be got
by using the GetListContents()
function, and replaced by using
the SetListContents() function.

Clicking on a list can also generate an itemHit() message, the Clicks() function
can be used to determine if a double-click occurred.

Note: To create full list windows, like the Transaction or Names list, use the

ModalListWindow(), or CreateListWindow() functions.

Picture

A Picture element will display an image.

The name of the picture can be specified in the Img Namefield. The name is of
the form keyword:identifier, structured as follows:

Identifier
Product code

KeyWord
product
transaction sequencenumber
path
file
name of builtin image builtin:enquiry
builtin
company logo
logo

builtin:logo

Example
product:BA100
transaction:1001
file:/Users/fred/documents/pictures/image.png

Pictures can also be loaded programmatically by using the LoadPicture()
function.
Web Viewer

Building Windows

A Web Viewer element is for viewing websites (or html), just a like a browser.

You can hard-wire a URL or html into the URL box, or load it dynamically using
either the LoadURLInWebView() or LoadHTMLInWebView() function
respectively.

Tab Panel

A Tab Panel is a
tabbed area on the
window as shown.

The tab names are
specified in the Tabs
field, with each
name, including the
last, being followed
by a semi-colon (so in
the example, the
names were entered
as “A;B;C;”).

When a tab is clicked upon, an itemHit() message is sent to the tab panel. You
can determine which tab by using getFieldValue(), which returns the name of
the tab (“A”, “B” or “C” in the example). Note that you will need to
programmatically set the visibility of the items on the tab depending on which
tab is current, for example.

on Load

createWindow("Sample_Window")

end

on itemhit:sample_window:tab_A(w, i)
let tabname = getFieldValue(w, i)
setFieldVisibility(w, "S_Gizmo", tabName = "A")
setFieldVisibility(w, "E_Gizmo", tabName = "A")
setFieldVisibility(w, "E_FieldonB", tabName = "B")

end



Scripts, Automation and the REST of it

Opening and Closing Windows

Opening and Closing Windows

Window Extensions

You can add additional fields and controls to existing MoneyWorks windows by
using “overlays”—these are small windows that can be tacked onto the right
hand side of many of the built in MoneyWorks windows. For example, the
Quote entry screen shown below has had a followup call log section added:

This was done by designing the window below:

Windows need to be specifically opened from a script. This is done by a call to
one of the following:

ModalWindow(): Displays the window with the given id. The window will be

modal. It should have an OK (Default) button and a Cancel button. If it lacks
at least one of these, then it will have a close box to dismiss it. For example:

let last_item = modalWindow("my_window")

Will open the window you name "my_window" as a modal window.

You will typically write a `Before` handler for your window that will set the
values of fields and controls (using SetFieldValue), and an After handler
to collect any changed values.

The ModalWindow function will not return until the window is closed,
usually by the user clicking OK or Cancel. The return value will be the
symbolic name of the last item hit (usually "B_CANCEL" or "B_OK").

CreateWindow(): Similar to ModalWindow, but displays the window modelessly.

CreateListWindow(): Opens a list window (similar to the Names or Product lists)

in which you can display selected records from a MoneyWorks table.

ModalListWindow(): The same as CreateListWindow, except the window

opened is modal (so it has to be closed before you access other parts of
MoneyWorks).

Normally the user will close the window (via OK/Cancel or the close box), but if
you need to close it programmatically, you can use CloseWindow().

To activate a window that may have gone into the background use
SelectWindow()—if possible, the window will be brought to the front.
Scripts, Automation and the REST of it

Window Extensions

Keep in mind that the user may have other scripts which also have
extensions. Each extension will be added under the previous one, so there
is limited vertical space.

To add an extension to an entry window, you simple set a value to one the of the
special overlay properties.

Entry screen Property
Transaction:
Name:
Product:
Account:
Job:
Jobsheet:

F_trans_overlay
F_nameform_overlay
F_prodform_overlay
F_acct_overlay
F_jobform_overlay
F_jobShtEEnt_overlay

For example:

property F_trans_overlay = "my_window"

To extend a standard window, you first need to design a window that contains
the elements you want. This is the same as designing any other window, except
that:

• You should make sure that your objects have IDs that are not the same as

any built-in objects on the window that you might also wish to access from
your script.

• Items on the window should have an H Sizingof Fixed Right, so that they

stick to the right hand side of the window as it is resized.

will make “my_window” an extension to the transaction window.

MoneyWorks looks at the current value of the property at the time the window
is instantiated, so you can change the value prior to instantiating a window. e.g.:

let F_TRANS_overlay = ""

will stop the extension being added to new transaction windows.

Note:

• You will need to write scripts to load and save data from your overlay.
• Messages are sent to the main window, not the overlay, so use for example:

• The window should be as compact as practicable

on itemhit:f_trans:ob_myButton(w, i)

MoneyWorks will widen the standard window to accommodate the
extension. If your extension is unnecessarily wide, the window may no
longer fit on the screen.

not

on itemhit:my_window:ob_myButton(w, i)

MoneyWorks will not increase the height of the standard window. If your
extension is too high it will be chopped off, with possible unexpected
consequences.

For more information on building windows and scripts, refer to the
MoneyWorks Developers webpage.
MoneyWorks Automation

Close: Close the currently open document or connection

Export: Export a selection of records from the specified table using an optional

search.

Import: Import one or more records into MoneyWorks, optionally updating any

existing records.

Evaluate: Evaluate a MoneyWorks Expression.

DoReport: Run a nominated MoneyWorks report with the specified parameters.

For more information on MoneyWorks Automation, see:

http://cognito.co.nz/developer/

MoneyWorks REST APIs

The MoneyWorks Datacentre REST API provides a simple, platform-neutral, high
performance stateless network interface to MoneyWorks Datacentre. Or, in
layman’s terms, using the REST APIs allows you to talk to MoneyWorks over a
network (including the internet), direct from your browser or other remote
application. MoneyWorks does not need to be running on the device you are
using.

As examples of the capabilities of REST, two sample web apps are included with
MoneyWorks Datacentre. These run in most browsers (but not ancient versions
of Internet Explorer), and hence will run on iPhone, iPad and Android devices, as
well as desktop computers. The supplied examples are:

Scripts, Automation and the REST of it

MoneyWorks Automation

MoneyWorks Automation provides MoneyWorks with the ability to
communicate with other programs on the same computer1, allowing
MoneyWorks to be interrogated by other systems, and data to be submitted by
these systems to MoneyWorks.

It was provided because we realised that MoneyWorks cannot be all things to all
people, and that there are things people need that MoneyWorks does not
provide, but that other systems do.

Automation is designed to facilitate data exchange in real time with other
systems running on the same desktop, and hence its use is platform-specific. If
you are manipulating data within a MoneyWorks document, it is preferable to
use MWScript.

Using automation allows you to do things like:

• integrate MoneyWorks into Excel for reporting and budgeting
• have external consolidation routines for multiple MoneyWorks documents;
• interact with a FileMaker Pro database;
• automate the import of invoices and price books from suppliers (although

this can probably be more easily accomplished using MWScript);

Because it needs to communicate with other applications running outside of
MoneyWorks, Automation is platform specific. Thus you will need to develop
different automation solutions to achieve the same result on Mac and Windows.

To create extensions using MoneyWorks automation you need (on Windows) a
COM enabled development system such as vbScript, .net, VB, Delphi, RealBasic.
On Mac you need to be able to send and receive AppleEvents—AppleScript is an
ideal solution for simple scripting, RealBasic for more complex systems.

In addition there are free plug-ins available for MoneyWorks Automation for
FileMaker Pro. These provide cross-platform compatibility (i.e. a single database
solution should run on both Mac and Windows).

The basic Automation operations are:

Open: Open or connect to the specified file or MoneyWorks server.
1 If you want to communicate with systems on a different computer, or over the
internet, use the MoneyWorks REST APIs.↩

MoneyWorks REST APIs

Scripts, Automation and the REST of it

Reports: Allows you to pull up almost any MoneyWorks

report, including ones you have designed yourself, onto
your mobile device. Reports are secured by standard
MoneyWorks report and signing permissions, so only
authorised users can access particular reports.

Timer: The job Timer app provides a simple

way of recording time and material used
on jobs through a mobile device, and is
ideal for anyone who needs to record
time on jobs, whether outside or inside
the office. Any information entered
updates the MoneyWorks job system in
real time, ready for instant collation and
billing. For more information see
MoneyWorks Timer App.

These examples are written in Javascript, so
can be modified to meet individual needs. They are located in the Webapps/
default directory of your Datacentre installation.

The available REST commands roughly parallel those in MoneyWorks
Automation (see above), with the addition of:

Post: Post an identified transaction.

DoForm: Prepare a nominated MoneyWorks Form (invoice, statement etc) for

selected records;

Image: Retrieve or update a transaction or product image in MoneyWorks.

For more information on the MoneyWorks REST APIs visit:

http://cognito.co.nz/developer/

Note: The MoneyWorks REST services must be turned on in the MoneyWorks

Datacentre Console app before you can use the REST APIs. For information
on this see the Datacentre Administrators Guide.
