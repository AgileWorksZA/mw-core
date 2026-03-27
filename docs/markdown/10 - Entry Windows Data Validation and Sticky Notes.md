# Entry Windows, Data Validation and Sticky Notes

Entry Windows, Data Validation and Sticky Notes

Entry Windows, Data Validation
and Sticky Notes

Information is stored in the MoneyWorks database in records. The records can
be viewed as lists— see Working with Lists, and can be searched and sorted in
these lists.

Whenever you add or modify a record, the information will be displayed in some
sort of entry screen. You will be able to enter data into certain parts of the
screen, while other parts are for display only.

Anatomy of an Entry Window

Entry windows are customised for different types of information. However many
features are common to all windows.

Field

Macintosh Entry Window

A field is where information from the record is displayed or can be entered.
Pressing the tab key will move you from one field to the next in the window. If
you hold down the shift key and press tab, you will move to the previous field.
You can also move directly to a field by clicking on it.

Certain fields have limits on the information that you can enter. For example,
you can only enter a valid account code into a field that requires an account
code. When you leave such a field (either by tabbing, clicking in another field or
clicking a button), MoneyWorks checks on the information that you have
entered. If this is found to be incorrect, an alert of some sort will be
displayed—for fields requiring a code identifying another record (such as a
Product code), this will be a choices list —see Entry and Validation where a Code
is Required. You will not be able to leave a field if it contains invalid information.

Note: Most entry screens are non-modal (i.e. you can have more than one open

at a time). However in Windows, if you maximise your windows, the entry
screens will be modal.

Pop-up menu: Some values (such as colour) are set by means of a pop-up menu.
Windows Entry Window



Entry Windows, Data Validation and Sticky Notes

Pop-up menu or combo-box (Windows)

Pop-up menu (Mac)

To set the value in a pop-up menu (also known as a “Combo Box” on
Windows) either click or tab into the menu. To select the item you can:

• click on the item
• use the up and down arrow keys to select the item
• type the first letter of the item

Check Boxes : These are used to represent options that are either on

or off.

When the check box is ticked the option is on. Clicking on the check
box will change the value.

Radio Buttons: These are used to represent mutually

exclusive options. When one is set, the others in the
same group will be automatically reset.

Acceptance Buttons: Use the acceptance buttons to
accept/reject the information you have entered.

Windows OK button

Mac OK button

The OKbutton will accept the information that you have entered or any
modification that you have made. The entry window will be closed if this
button is clicked.

button will discard any changes that you have

The Cancel
made in that particular entry window. If you have accessed another entry
window through the current one, any changes that you made in that
window will not be cancelled. The entry window will be closed if this button
is clicked.
The Next
button has the same effect as clicking OK, except
that the entry window is not closed. If you are adding records, the entry
window is cleared and kept open for the next record.

If you hold down the shiftkey while you push Next, the information in the
entry screen is accepted but, apart from the code or reference number, the
entry screen is not cleared. This is a fast way to enter a number of records
that have several fields the same.

If you are modifying a group of records, pressing Nextwill save any changes
made to the current record and move on to the next record.

The Previous
modifying a selection of records. When pressed, it saves any changes made
to the current record and moves back to display the previous record.

(or Prev) button is only available when

Default Button: This is the button that will be actioned if you press the keypad-

enterkey. The default button is surrounded by a dark border on Windows
and it is a solid blue on the Mac. Depending on the circumstances, it can
sometimes be the OKbutton or the Nextbutton.

Tabbed Views: Many entry windows have tabbed views, where clicking on a tab
displays a different set of information. You can change the current tab to
the one on the left or right by:

• Pressing F5 or F6 on Windows
• Pressing ⌘-← or ⌘-→ on Macintosh

Changing the Field Attributes: In the transaction and job sheet entry screens,
you can change the attributes for some of the fields. The attributes are
don’t tab into this fieldand use the last value entered into this field.

• To change the attributes in the transaction entry window —see Changing

Field Attributes.

• To change the attributes in the job sheet entry window —see Configuring

the Job Sheet Entry Window.



Entry Windows, Data Validation and Sticky Notes

Drilling Down

Where a field contains the identifier code for a record in another file, you can
“drill down” and view the information in the record referred to by that code.

Fields in which this can be done have a small vertical “drill
down” arrow associated with them. This is located either
inside the field or just to the right of the field.

Clicking on this, pressing Ctrl-↓/⌘-↓ while inside the field,
or choosing View Related Record from the Edit menu will drill
down and open the associated record allowing you to view or
change the information in it.

Click the Drill Down
arrow to see the
associated record.
The arrow can be in
or to the right of
the field.

The drill down arrow is also available in fields that can contain a large amount of
text. When you click on one of these arrows (or press Ctrl-↓/⌘-↓) a window is
opened that displays and allows you to edit all the text in the field.

Note: If you are drilling down into a name or item record while entering a

transaction, you should always close the drill-down window by clicking the
Cancelbutton. If you drill down and change any information, the pricing of
the lines will be recalculated in case the discount, tax or pricing levels have
changed.
Entry and Validation where a Code is Required

Entry and Validation where a Code is
Required

When you are entering information into MoneyWorks you may not be able to
remember what the code is for a customer, product, account or whatever.
MoneyWorks has two mechanisms to help you.

• A drop down list appears under the entry field displaying the possible

candidates based on what you have thus far typed into the field. Candidates
are selected if their code, or any word in the description/name, starts with
whatever you have typed.

• A Choices List is displayed of all candidates if you tab out of a field that

requires a code, but in which no valid code has been entered.

There is a difference in how these work. The drop down list will only appear
when the number of available candidates is manageable (less than 20), and will
only show those candidates. The choices window will show all possible choices
(subject only to the selected list filter), and attempt to match based on the first
characters of the sorted column only. Unlike the drop down lists, the Choices list
searches only on the code field.

Note: Codes whose first character is a tilde “~” are not displayed in the Choices

or drop down lists—these are considered to be no longer in use.

Note: You can set up your own drop-down lists and choices lists for non-code

fields by using Custom Validations.

Drop Down Lists

When entering into a code field (such as an account code, product code,
customer code etc), a drop down list of all items whose code starts with what
you typed (or which have a word in their description that starts with what you
have typed) will be displayed, provided there are no more than 20 possible
matches.



Entry Windows, Data Validation and Sticky Notes

Entry and Validation where a Code is Required

Drop down lists also apply to the Description field in transactions and detail
lines—in this case the most recently entered 100 descriptions entered by the
logged on user are available

Note: Drop down lists can be disabled in the MoneyWorks Preference settings

—see Show auto-fill dropdowns; you may want to do this if operating over a
slow network.

When a drop down list appears, you can down arrow or double-click on the
desired item. The code for this will be inserted into the field.

Choices Lists

When you tab out of, or type an “@” into, a field that requires a code, a Choices
Window will be displayed listing all valid codes for that field, subject to
whatever filter is set for the list. You can select the code by double-clicking on it.

The Choices list is a normal MoneyWorks list, and can have its own filters and be
sorted in the normal way by clicking on a column heading. You can also change
the order of the columns and add and remove columns —see Customising Your
List.

The Choices List is automatically displayed whenever you leave a field:

• into which you have entered an invalid code for an associated file
• which requires a code but is empty

Examples are the debtor code field when creating a debtor invoice, the product
and account code fields in a transaction detail line, and the account fields in the
product entry window.

If you know part of the code you are entering, you can type that into the field
and then press tab. The choices list will be displayed with a code that starts with
the same characters highlighted, making finding your code easier. If you type in
part of the code and terminate it with “@” (the wildcard character), the Choices
list will only display candidate records that start with the code you typed in (if
there is only one match, this will be inserted automatically into the field).
Entry Windows, Data Validation and Sticky Notes

Entry and Validation where a Code is Required

Tip When the choices list is displayed, the item in the list that best matches
what you have already keyed in will be highlighted. The match is done
against whatever column the choices list is sorted by. If you sort by (for
example) the account description, you will be able to key in the name of the
account instead of the code.

When the Choices List is displayed you can select your choice by:

Double-clicking it Use the scroll bar to move through the list to find the item

that you want and double-click that item. The list is a standard
MoneyWorks list, so you can sort it by clicking on the column headings, or
using the left and right arrow keys.

Using the Keyboard Type directly into the list to have the list automatically

position itself (e.g. if you know that the code starts with “SA”, type “SA” to
reposition the list on a record starting with “SA”).The up arrowand down
arrowkeys will move you through the list a line at a time, the homeand end
keys will take you to the top and bottom of the list respectively, while the
page upand page downkeys will move you through the list a screen at a
time. Once the record you want is highlighted, click the Use button or press
the keypad-enterkey.

If you click Cancelor press esc, no code will be entered into the field.

You search the list by clicking the Findtoolbar button (or press Ctrl-F/⌘-F)—this
brings up the standard Find window. Only the records that match Find request
will be displayed in the list. Press Ctrl-J/⌘-J (Find All) to display all the candidate
records.

When a departmentalised account is selected in the left-hand list, the
departments associated with the account are displayed in the right-hand list.
Use the tab key to move the selection between the left and right lists, or simply
double-click on the required department in the right-hand list.

Note: Accounts and Departments marked as Heading Onlywill be greyed out in

the choices list and cannot be selected.

Accounts Choices List

Choices and the Job Column

The choices list for the Accounts file has two panels, the one on the left for the
account itself and the one on the right for any departments within the account.

The job column field in transaction detail lines (if displayed) is optional. Tabbing
through it will only bring up the choices list if the Job Code Requiredoption is
set for the associated general ledger code. If the option is not set, you can force
the choices list to display by typing an “@”.
Entry Windows, Data Validation and Sticky Notes

Creating a Record “On the Fly”

Sometimes when you are entering transactions you might find that the
customer, supplier, product or account code that you need does not exist. In this
situation you can easily create the item then and there.

To create an item “on the fly”:

1. Enter a code for the item and press tab, or just tab out of the field

The code that you enter should be one that does not already exist, so the
choices listwill be displayed. If the code you entered does already exist the
details of the item will be displayed—you should shift-tab back into the field
and enter a new code.

2. Click the Newtoolbar button or press Ctrl-N/⌘-N

The entry screen for the item that you are creating will be displayed.

3. Fill out the details of the item and click OK

Creating a Record “On the Fly”

A validation expression is a formula that is evaluated when the field is exited. If
it evaluates to true, the entry is allowed. Otherwise a message is displayed and
the field cannot be exited. An example would be where the text in the field must
be exactly 4 characters long.

A new record cannot be saved until all the fields with custom validations have a
valid entry. Note that:

• Custom Validations are applicable only when entering information through
the relevant entry screen. They do not apply for importing, replacing or
other forms of data creation that bypass the user interface.

• A Custom Validation applied to a field in a transaction entry window will

only apply to that type of entry (e.g. Payment, Debtor Invoice). This allows
you to have different validations for different types of transaction.
• Custom Validations are stored by User, allowing you to have different

validation lists for different users.

Note: Take care where assigning a custom validation to the transaction

Salespersonfield when you are also using the product Append Salesperson
option. The validation list should only consist of a subset of the valid
departments (otherwise it will be impossible to make a valid entry).

The new item will be created and the details will be displayed.If you Cancel
out of the item window the item will not be created.

Creating a Validation List

The validation lists can be created and maintained2 by choosing
Show>Validation Lists. This window displays the Validation Lists down the
sidebar on the left, and the contents of the selected list (which are themselves a
list) in the body. The toolbar icons along the top of the window are to maintain
the contents; use the icons at the bottom left to add and remove Validation Lists
to the sidebar.

Custom Validation Lists

Often when entering information, you want to restrict the entry to a limited
number of possibilities, or to ensure that it meets some particular criteria. The
Custom Validations in MoneyWorks allow you to do this, either by specifying a
list of acceptable values, or a formula that checks the validity of the entry.1

A validation list is basically a list of acceptable entries that can be made in a
particular field. Thus if we want to tag transactions or customers by country, we
first need to make a list of valid countries (the Validation List), and then
associate this with whatever data entry field(s) we want the country to be
entered in. When the user starts typing into the field, a drop-down list of valid
matches is displayed. When the field is exited, its contents are checked against
the item values in the validation list, and if no match is found a choices list is
displayed.
Entry Windows, Data Validation and Sticky Notes

Custom Validation Lists

To Delete an existing list

1. Highlight the list in the sidebar

2. Click the Cogs icon on the bottom left of the window and choose Delete

List

To add an item to a Validation List

1. Highlight the list in the left hand panel

The existing contents if any will be displayed in the body of the window

1. Click the New toolbar icon, or press Ctrl-N/⌘-N

The List Item entry window will open

To create a new Validation List:

1. Click the + icon at the bottom left of the window

The List window will open

2. Enter the item code (up to 15 characters) to be used in the list, and a

description

3. Click Next to add another List Item, or OK to finish.

2. Enter the name for the Validation List and click OK
Entry Windows, Data Validation and Sticky Notes

Assigning a validation to an entry field

When a Validation is associated with a data entry field, the corresponding
record cannot be accepted unless the field is populated by data that conforms
to the validation (i.e. is a member of the associated list, or matches the criterion
specified by the formula). To assign a validation to a field:

1. Right Click in the field and choose Custom Validation

Custom Validation Lists

The Field Validation window will open showing your Custom Validation lists

To assign a Validation List:

1. Choose the List to validate against and click OK, or select Make a New List

to create a new validation list

If you choose to make a list, you will be able to give the list a name and
specify the values. You will need to subsequently edit the list to provide
descriptions.

The list will be strictly enforced when associated with a new record; it will not
be enforced if you are modifying an existing record, unless you explicitly modify
the field associated with the list. Strict enforcement means that the value
entered in the field must exactly match (except for case) an item in the list.

Note: Where a custom validation is longer than that permitted in a field, the

validation will be truncated and accepted.
Entry Windows, Data Validation and Sticky Notes

To assign a Validation Formula:

1. Set the pop-up menu to Require value to match formula

The List will be replaced by a text box

2. Enter the formula as a standard MoneyWorks expression into the text box

The variable _value in the expression will reference the text entered. If the
formula evaluates to zero (false) the value will be rejected and a warning
message displayed. Any other result will be accepted. For example

length(_Value) = 4

Will only accept an entry that is exactly four characters in length.

This will appear in the list as:

Custom Validation Lists

To include an optional message to display on non-acceptance, terminate the
formula with a semi-colon and enter the message text after this. e.g.

length(_Value) = 4;Entry must be exactly four characters

3. Click the OKbutton

If the formula is syntactically correct it will be saved. It can be edited
subsequently by again right-clicking on the field and choosing Custom Validation

To make an optional Validation List

Because the lists are strictly enforced, to make one optional you simply need to
have an entry in your validation list with an empty item field. It is a good idea
though to put something in the description, so it is clear when choosing the
item from the Choices window.

To remove validation from a field

1. Right click in the list and choose No Validation

Note: the various types of transaction entry (Payment, Sales Order etc) can
have different validation lists associated with the same field.
Entry Windows, Data Validation and Sticky Notes

Sticky Notes

A sticky note is a transitory message that can be attached to an individual
transaction, name, account, product or job. For example, you might have a note
attached to the Name record of a querulous customer, so that whenever you sell
something to her the note pops up warning you to be careful. Notes will
automatically appear when the record is open or the item is used, and will
disappear when the main window to which they are attached is closed.

Only use notes to remind you take certain action or to check something. They
should not be used to record information that is to appear on a report or a form
such as an invoice.

Example: The product “BLUEBURGER” has a note attached that will appear

whenever the item is sold. It appears in a sales transaction as shown:

To create a note for a record:

1.

If the record already exists, open it by double-clicking it in the appropriate
list

2. Click the Add Note icon, or choose Edit>Add Note

The Sticky Note entry window will be displayed

Sticky Notes

3. Type the note text, and select the colour

Notes that are for accounts, names and products can also appear when entering
a transaction. Some notes might be applicable only for sales transactions, and
others for just purchases.

4.

If you want the note to be displayed when used directly on a transaction,
set the appropriate Display When options

5. To save the note, click the Save Note button

The Sticky Note entry window will close.

When activated, the Note will be displayed in a floating window. If there is more
than one note, they will be joined. The source of the note is indicated by the
note icon
Entry Windows, Data Validation and Sticky Notes

Sticky Notes

To dismiss a note

2. Click Edit to modify the note

The Sticky Note entry window will be displayed

3. Click the x(the delete icon) to delete the note

1. Click the close box in the Note window title bar, or press F4 (Windows) or

⌘-/ (Mac)

Note: On a transaction window, the sticky notes for related items (such as the

customer, or the item) will only appear when the entry is made or modified.
They will not be redisplayed if the transaction is merely opened.

1 In MoneyWorks Gold, you can also use Scriptsto do more complex validations.↩

2 Creation and changing validation lists is controlled by a user privilege↩

The note window will close (leaving the original note intact).

To edit or delete a note from the transaction window

You cannot edit or delete a note directly from the transaction window; instead
you must drill down to the original note:

1. Hover the mouse over the bottom right hand corner of the note

The drill down arrow will appear (if it doesn't, click on the title bar of the
note and then hover over the bottom right hand corner).

2. Click the drill down arrow

The originating master record and note will be displayed

To edit or delete a note from its master record

1. Hover the mouse over the bottom right corner of the note

The Edit and Delete buttons will appear
