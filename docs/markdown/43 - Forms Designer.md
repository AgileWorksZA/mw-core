# Forms Designer

Forms Designer

because the value of ourref will be worked out based on the transaction type,
which is undefined in the first example. In the second example, MoneyWorks
knows that you are importing a Debtor Invoice (Sales Invoice), so it knows how
to work out the ourref value.

1 To open the file in the target application, you should start the application and
choose Open from its File menu.↩

2 Possible errors are listed at: Transactions; Namesand Products.↩

3 If you are importing payments or receipts on invoices, you need to use the Import
Paymentson Invoicescommand.↩

4 The Mind Reading feature of MoneyWorks is still in early beta.↩

Forms Designer

A fundamental part of running a business is sending out business “forms”, such
as invoices, statements and cheques. MoneyWorks comes with a rich set of
forms, all of which have been created, and can be modified, using the built in
Forms Designer.

You can use the Forms Designer to create (amongst others):

• Invoices and Receipts
• Product Price Labels
• Cheques and Remittance Advice Slips
• Job Work Sheets
• Statements
• Mailing Labels
• Dunning Letters
• Shipping Labels

You can also use the Forms Designer to create other forms and labels such as:

• Disk Labels
• Mailing Labels
• Flyers
• Form Letters

The Forms Designer allows you to create multi-part and multi-page forms, and
to print multiple forms per page (for labels). It has drawing tools and calculation
facilities to allow you to create forms which are not only aesthetically pleasing,
but are also “smart”. Such forms, when emailed or saved as a pdf, can have “hot
links” (hyperlinks) that will go to a web site or to generate an email.

Once you have created your form, you save it into the Formsfolder in the
MoneyWorks Custom Plug-ins folder — see Managing Your Plug-ins. Once there,
the name of the form will appear in a pop-up menu called “Use Form:”
whenever you print statements, cheques, invoices, receipts etc. from
MoneyWorks. You can choose one or more of the forms in the menu and these
forms will be used to format the information that you are printing—see Printing
Invoices, Receipts and other Transaction Formsfor further information.
Forms Designer

Anatomy of forms

Before getting into the nitty-gritty of forms, let’s step back and look at the
components that make up a form.

Consider going to a conference and receiving a badge with your name and
company to wear. This is an example of a very simple form (and yes, you can
design these in the MoneyWorks Forms designer). Essentially, for each selected
name record you print the name and contact name—there is a one to one
correspondence to the items you are printing and fields on the form. You are
going to get exactly one label per record.

• Use fieldsto display simple information, such as the name on a contact

badge, that changes with each form

Anatomy of forms

Now consider a statement. This is also based on your entries in your Names list,
but is more complicated because it has an indeterminate length—typically it will
list invoices and payments, of which there might be just one, or several
hundred. Thus, depending on the number of transactions on the statement, the
statement might be just one page long, or several.

• Use liststo display repeating information such as transactions on a

statement

Fields are used in the form designer layout (on left) to produce information that changes with each
form printed.

The conference badge will also display information that is the same for each
attendee, such as the conference name and logo.

• Use the textand adornment tools for static text and graphics, such as the

company name and logo, that remain the same across forms

The list in the statement form accommodates a varying number of transactions.

An invoice is similar to a statement, but its starting point is not a name, but a
transaction. Again the length (and hence number of pages) of the invoice
depends on how many lines there were on the transaction—there might be one
line, or a thousand. And regardless of this, the invoice might always end with a
page of terms and conditions.

• Use sectionswhere a form has different pages of information, such as terms

and conditions, that need to be collated together onto the same form.

Text and adornment are used for features that do not change across forms.

A section in a form presents information on a new page in an entirely different format.
Forms Designer

Creating a Form

To create a new form:

1. Choose File>New>New Custom Form

You will be prompted for the type of form (see below), and when this is
selected the new (blank) form will be displayed in a window. You can then
add graphics and field information.

Whenever you are creating or modifying a form, you have access to the
Forms menu, which is a sub-menu in the Edit menu. This contains
commands that are specific to the Forms Designer.

There are several different form types to choose from.

Invoice/Receipt: Choose this form type if you want to create a form for printing
Debtor Invoices or Cash Receipts. You also use this type for forms for
printing Cash Payments and Purchase Orders. This form type allows you to
include information from the detail lines within a transaction.

If you give the form a name that ends in “by detail line”, the form will print
once for each detail line on a transaction. This allows you (for example) to
print an individual price label for each line item of an invoice (or, if you set

Anatomy of forms

the copies function to Detail.StockQty, a label for each item receipted). This
type of form must not have a list in it.

Statement/Mailing Label: Choose this form type if you want to create a form for
printing customer statements or mailing labels for customers or suppliers.
This form type allows you to include a list containing transactions related to
the customer (or supplier).

Cheque/Remittance Advice: Choose this form type if you want to create a form
for printing remittance advice slips for creditor payments or for printing
onto pre-printed cheque stationery. This form type allows you to include a
list of the creditor invoices that the cheque is made out for.

Product Label: Choose this form type if you want to create a form for use with

products, such as product labels.

Job Form/Label: Choose this form if you want to create a form for printing the

details of a job, such as a concise summary of the time or disbursements for
sending to a client. If the Enable Job Sheet Itemspreference option is set,
you can include a list of the job sheet items in the form.

Context-free form/report: Choose this form if you want to create a form that is
not associated with any of the MoneyWorks lists. Unlike other forms, these
must be saved in your Reports folder, and are accessed under the Reports
menu. Examples of these are the GST Forms for printing out the IRD/BAS
returns.

Asset Label: Choose this form if you want to create a form for printing labels/

barcodes for assets.

Multi-Page Form Group: Set this option if you want to make a “form group” that
is a list of other forms to print in a batch —see Printing Multiple Forms.

Note: “Plain” forms are created and modified using the Report Writer.

To Choose the Form Type:

1. Click on the radio button for the form type that you wish to create, then

click OK
Forms Designer

The Document Window

A new, untitled document window will open. If you decide against creating
a new form document at this point, you can click Cancel.

supplied with MoneyWorks), in the Forms folder in the MoneyWorks
Standard Plug-ins folder.

Modifying an Existing Form

To modify an existing form, either:

1. Highlight a record that can be used to print the form

For example, to change an invoice form, highlight a debtor invoice in the
Transaction list window, or to modify a statement form highlight a record in
the Names list window.

2. Choose Print <<Record>> from the Command menu

The standard Print Configuration window will open. Note that <<Record>>
will change depending on the type of form.

The Document Window

You draw your form in the document window. The document window contains a
white space as large as the form, the size of which can be changed.

Forms can also be composed of multiple sections (up to six), where each section
potentially has a different format or contains a different type of information.
Thus for example section 1 of an invoice might be the normal invoice details,
and section 2 might be a page of terms and conditions. By default, when you
create a new form you are working on section 1 — see sections for more
information.

MoneyWorks forms are saved as separate files outside of your MoneyWorks
data files. While you are working on a form in the document window, this file is
periodically (and silently) autosaved, so that in the event of a system failure you
will not lose (too much) work. When you next open MoneyWorks, the
autosaved form will re-open automatically, allowing you to save the changes
properly.

3. Click the Layoutbutton1

The Forms Layout window will open

4. Click the Edit this Form in the Forms Designerbutton

The form will be opened.

Or: Choose File>Open

The standard file open dialog box will be displayed. You need to use this to
locate and open the form. The forms are normally held in the Forms folder
in the MoneyWorks Custom Plug-ins folder (or, if you are modifying one
The form type, in this case “Invoice/Receipt”, is shown near the top of the
window. There is a palette of tools and controls down the left hand side. The
rulers are always displayed in centimetres, measured from the top, left hand
corner of the paper2.



Forms Designer

The Document Window

Before you start to draw elements on your form, you should set the form size.

3. Click OKto save the new form layout settings, or Cancelto discard them

Tip: Use the Zoom toolbar buttons to scale the form up or

down on the screen for easier working. Onscreen zooming
does not affect the size of the resultant form.

Setting the Form Size

Zoomtoolbar
buttons

The default form size will depend upon your printer, but in general is A4 with
1.5cm margins. Both the size of the form and the margins can be changed. You
can lay out the page so that more than one form will be printed per page. This is
especially useful for making labels.

1. Click the Layouttoolbar button

The Layout dialog box will open.

The Layout dialog box contains a representation of the
current page size for your printer. If you want to set up
the form to be printed on a different size of paper, you
need to click the Page Setup button in order to select the
desired paper size.

The Layouttoolbar
button opens the
Form Layout
Window

Auto-scale to paper size: Set this option on if you want your form to

automatically scale depending on the size of paper that is being printed.
This allows you for example to print forms designed on A4 onto US Letter.
Some distortion may result,

The Form Rectangle

The form itself is represented by the patterned rectangle.

To change the size of the form, either key the measurements
into the Form Size fields or:

1. Click and hold the mouse button inside the form resize

handle

The form resize
handle
This is the black square in the bottom right of the form rectangle

2. Drag the mouse until the form is the desired size, then release the mouse

button

The form rectangle will change size as you drag, with the current size being
displayed continuously on the right of the window.

If you make the form smaller so that more than one form could fit inside the
area bounded by the margins, multiple form rectangles will be displayed. This is
how you create mailing labels or any other type of form that is to be printed
more than one to the page.

The printable areaof the page is represented by a dotted or grey rectangle.
You cannot use any of the page outside of the printable area.

2. Make the changes to the form layout (see below)
Forms Designer

Form Spacing

When there are multiple form rectangles on the
page, you can change the spacing between the
form rectangles.

To change the spacing either key the values into
the Spacing fields or:

1. Click and hold the mouse button on one of
the extra form rectangles (any except the
patterned form rectangle)

2. Drag the mouse and release the mouse
button when the desired spacing is
achieved

The current form size and spacing is displayed in centimetres at the right of the
dialog box.

Auto-scale to paper size: Set this to have the
form automatically scale to fit whatever
size stationery is actually used. For
example, a form designed for A4 will be
truncated if printed on US Letter. If the
Auto-scale option is set however, it will be
proportionately scaled down to fit.

The Top-Left Margin

The top and left margins are controlled by the location of the form rectangle
itself, and can be changed by either keying the value into the appropriate margin
field or:

1. Drag the form rectangle to the desired location

The Document Window

Note that the top-left margin cannot go outside
the printable area of the page and you cannot
make the top-left margins so big that the form
will extend beyond the bottom-right margin.

The margin settings are displayed on the right
hand side of the window. The measuring units
(cms, inches or points) are chosen from the Unitspop-up menu at the bottom
left of the window.

The Bottom-right Margin

The bottom and right margins are controlled by a cross-hair which appears
towards the lower-right of the page.

To change the bottom and right margins, either key the values
into the appropriate margin fields or:

1. Click on the small black box of the cross hair (or just

below and to the right of it)

The bottom right
margin cross-hair

2. Drag the cross hair and release the mouse button at the desired point

Just as for the top-left margin, you cannot drag the margin marker outside
of the printable area of the page. Nor can you move the margin inside the
form area.

The Print Order controls

When the form is set up to print more than one
per page (such as labels), you can control the
sequence in which the forms will print—either
in horizontal or vertical bands.

To change the printing order for multiple-forms-
per-page:

Horizontal Print Orderselected

1. Click on the Print Ordericon representing the order you want
Forms Designer

Sections

MoneyWorks has the facility whereby it can prompt you to start at a certain
label. This is useful if you have partly used label sheets.

To create a new section

2. Set the Ask for Label to Start Atoption if you want to be prompted for the

first label to use when the form is printed

When set, a prompt is given when the first page of the form is printed —
see Choosing the start label.

1. Select Addfrom the Section pop-up menu in the tool

palette

A new section will be created for the form. This will be blank,
allowing you to add your own objects. You can have up to six
sections on a form.

Sections

A form can be composed of more than one section, and each section can have
an entirely different layout to other sections on the same form (but they all have
the same page size, as determined by the form size. Sections lend themselves
to, for example, printing an invoice with a followup up page of terms and
conditions. They are probably best avoided for things like cheques, where
special stationery is required.

A section in a form presents information on a new page in an entirely different format.

When printing a multi-section form, all sections will be output together (i.e
collated). Similarly when PDFing, all sections will be output to the same PDF file.
This differs from form groups, which are collated separately, since they may use
different stationery.
To change the section that you are working
on

Adding a new
section

1. Select the number of the desired section from the section pop-up in the

tool palette

That section of the form will be displayed.

Tip: Where objects are common to more than one section, copy and paste them
between sections, but make sure that, where calculations and lists have
names, you change these names (names must be unique across the form).

To delete a section

1. Change to the section that you want to delete

2. Choose Deletefrom the Section pop-up menu in the tool palette

If there are any objects on the section you will be asked for confirmation (the
action cannot be undone).

3. Click Delete Sectionto delete the section

Subsequent sections will be renumbered (so if you delete section 3, the old
section 4 will become section 3).



Forms Designer

Conditional printing of sections

It may be that you only want a section to print under certain conditions (for
example, only new customers get the terms and conditions added to their
invoice). This can be achieved using the Section functionin the Form Options.

Notes on sections

• Calculations in one section of the form can reference calculations and lists
on other sections (regardless of whether the section is skipped or not).
• Variable and list names must be unique across sections. Thus if you have a
list with the name of "List" in section 1, and another list with the name of
"list" in section 2, you will get an error when you print the form.

Sections

The tool palette
Forms Designer

Tools and Controls

The icon will go dark and the cursor will become an arrow.

After you use another tool the arrow tool is automatically selected for you.

Tools and Controls

You draw and manipulate the form elements using the tools and functions
provided in the Tool palette.

2. To select an object, click on it with the arrow

Note: Before you start to draw the form, you should have set the form size and

layout — see Setting the Form Size.

You can draw seven different kinds of graphic objects using the tools, and you
can paste or drag and drop graphics as well — see Graphics and Logosfor
supported formats. The two most important objects are the Calculation box,
and the List box. These are used to display the information from the record that
is being printed.

If you will be printing the form on plain paper (rather than on pre-printed
stationery), you may also want to embellish the form with lines, boxes, text and
pictures.

You place an object on the form by selecting the tool for that object and clicking
and dragging on the form.

Tip Click the Find toolbar button (or just press Ctrl-F/⌘-F) to

find the next occurrence of a specified piece of text in the
form. Pressing Ctrl-G/⌘-G will repeat the search to find
the next occurrence. Note that finding on just a number
will also find the item on the form with that object
number.

The Selection Arrow Tool

You select, deselect, move and resize objects using the Selection Arrowtool
(also known simply as the Arrow Tool).

Selecting an Object

Select an object by clicking on it with the selection arrow tool.

1. To select the arrow tool, click on the selection arrow tool icon

Resize handleswill appear at the corners or end-points of the object to
indicate that it is selected. If there were any previously selected objects,
those objects will be deselected.

If you want previously-selected objects to remain selected, hold down the Shift
key when you click. The clicked object will be selected without the other objects
being deselected.

Selected objects on left, unselected on right

While an object is selected, you can change other properties of the object, such
as its fill colour or transparency, its border colour or line width etc.

Moving an Object

1. To move an object, click anywhere on the object’s boundary (except on

the resize handles), and drag to the new location

Provided the object is not transparent, you can click anywhere inside the
object. The object does not have to be selected before you begin—the act
of clicking on it will select it.

As you drag the rulers will also show an outline of the object’s position with
respect to the top-left hand corner of the paper, as a guide for more precise
positioning. When the object is aligned with the edges of other objects on
the form, red guide-lines will be displayed.

You can also use the arrow keys to move items that have been selected.
The Findtoolbar
button

Use the arrow tool to drag the object to a new location or resize it.



Forms Designer

Resizing an Object

Use the resize handles of a selected object to change the object’s size.

1. To resize an object, you must first click on it to select it

2. Click on any of the object’s resize handles and drag

As you drag, the object will grow with the mouse position.

Note: If you have more than one object selected, each object that is selected

will be resized. If you just want to resize the one object, hold down the Ctrl/
Option key.

Tip: Hold down the Control key (Windows) or the ⌘ key (Mac) while pressing an
arrow key to change the size of the object (down/right for bigger, left/up for
smaller).

Selecting Multiple Objects

You can select several objects at a time. Any changes you make will affect all of
the selected objects.

You can select multiple objects on the form by holding down the shift key and
clicking on each of the desired objects. Alternatively you can select all objects in
a rectangular area by dragging:

1. With the arrow tool click on the white
space of the form and drag the mouse

A blue rectangle will appear with one corner at
the original point clicked and the other corner
following the mouse.

2. When the rectangle encloses the objects

that you want to select, release the mouse

The objects totally enclosed by the dotted
rectangle will be selected.

Note that only objects completely enclosed by the rectangle are selected. If you
want to include objects that are only partially enclosed by the rectangle, hold
down the Ctrl key (Windows) or the option key (Mac) when releasing the mouse
button.

Tools and Controls

Duplicating Objects

To duplicate objects:

1. Use the arrow tool to select the objects to be duplicated

2. Choose Edit>Duplicate Object or press Ctrl-D/⌘-D

A duplicate of each object appears just below and to the right of the
original. The originals are deselected and the duplicates are selected.

If you move the duplicate objects to a new position and then duplicate them
again, the next set of duplicates will be placed at the same offset from the first
set as the first set are from the originals. You can use this feature to easily make
a row of identical, evenly-spaced objects.

The Rectangle Tools

To draw a rectangle:

1. Select the rectangle tool or the round-cornered rectangle tool as

appropriate

Click where you want one corner of the rectangle to be

2. Drag to where the diagonally opposite corner is to be and release the

mouse button

The rectangle will be drawn using the current border and fill colours and the
current line width. See Formatting Objectsfor more information on these
properties.
Forms Designer

The Picture Tool

Use the Picture tool to place a picture on the form3. The picture can be an
imported image (such as a jpeg, psd or gif), the company logo, a product image,
or a barcode.

To draw a picture:

1. Select the Picture tool

Tip: If you are designing a Navigator panel, hold down the Control key

(Windows) or the Option key (Mac) and double click the image to get the
Navigator Properties settings

Tools and Controls

The Line Tool

To draw a line at any angle, use the line tool.

1. Select the line tool

The mouse pointer will become a cross-hair when over the form.

The cursor becomes a cross hair when it is over the form

2. Click where you want one corner of the picture to be and drag to where

2. Click where you want the line to start and drag to where the end of the

the diagonally adjacent corner

line is to be, then release the mouse button

The picture placement will be shown on the form (you can move or resize it
later), and the Image Options dialog will be displayed, as shown below.

The line will be drawn using the currently selected pen colour and line
width.Note that guides will appear when the line is horizontal or vertical.

The Text Tool

Use the text tool to place static text on the form.

To make a new text area:

1. Select the Text tool

2. Click on the place where you want one corner of the text area rectangle to

be

3. Drag the mouse and release it when the desired width of the text area has

been obtained

A dotted rectangular outline will follow the mouse as you drag it. When you
release the mouse, a text box of the width that you have drawn will be
created. There will be a flashing insertion point inside the box.

4. Type the desired text

3. Choose the source of the image

For Product Images and Barcodes, you will need to enter an expression that
resolves to a product code or barcode respectively — see barcode
expressions.

Note that you can also import an image by dragging or pasting it onto the
form. The image must be in a format recognised by MoneyWorks.
Forms Designer

The height of the text box will be the height of one line of text
in the current font and size. If you type more text than will fit
in a single line, the text box grows downwards so that the text
will fit.

5. Click outside the text box or press the Enter key to deactivate the text box

Tools and Controls

Since the text box sizes itself vertically to the text that you type in, you may have
problems if the expression result is longer than the expression itself such that
the resulting text takes more lines to display than the original text. To get
around this, you can add some return characters to the end of the text to force
the text box to a greater size.

For example if description is long, such as “Lorem ipsum dolor sit ... volutpat.”:

Formatting the text: You can change the font, style and size of
the text by selecting the text object and clicking the Type
Styletoolbar button. This applies to the entire block of
text (i.e. you cannot have mixed fonts/styles or sizes
within the one text block).

The Type Style
toolbar button

results in:

The new text object will always set to Transparent. See
Formatting Objectsfor more information on changing these and other
properties.

Embedded Expressions

Whereas this:

You can embed an expression inside a text box. Simply enclose the expression
inside double angle brackets (<< >>).

For example the following text box has a simple expression embedded in it
(consisting of just a field of the transaction file). When the form prints, the
result of the expression—i.e. the due date of the transaction—will be
substituted:

gives:

results in

Use embedded expressions in text boxes as a short-cut when you need the
result of the expression to be included neatly inside some other text.

Expressions are discussed in detail in Calculations and things.
Forms Designer

The Calculation Box Tool

The Calculation Box object is at the heart of the Forms designer.

Use a Calculation Box wherever you need to place information that will be
different each time the form is printed.

Creating a New Calculation Box

A calculation box is “drawn” on the form just like a rectangle:

1. Select the Calculation Box tool

2. Click where you want one corner of the box to be

3. Drag to where the diagonally opposite corner is to be and release the

mouse button

The Calculation dialog box will open immediately

The calculation box will be created with a transparent fill and borders, but
with the currently selected font, size and pen width. The vertical size of the
box will “snap” to an integral number of line-heights for the currently
selected font and size.

If you don’t want the calculation dialog box to open when you release the
mouse button, hold down the ctrl key (Windows) or the option key (Mac) as
you do so. A blank calculation box will be created which you can come back
to later to add the calculation formula and other settings.

Tools and Controls

The Calculation dialog box is used to specify the calculation (formula) for the
object, and (optionally) a result name, format and other settings.

Entering a Formula: You type the calculation formula into the Calculation box.
To make things easier, all of the accessible field names, operators and
functions are included at the top of the dialog box.

The “accessible” field names are those that are appropriate to the context
of the form. An invoice form, for example, allows you to use the transaction
and name fields. The transaction detail fields are also shown but these can
only be used as parameters to the ExpandDetail function. This is because
there will be several different values of each detail line field as invoices can
have multiple detail lines. To include detail lines in an invoice form, use a
List Box object.

See Calculations and thingsfor more information on how to write a
formula.

4. Type the formula into the formula box, or select the item from the options

above (double-click a field or function name)

MoneyWorks will check the formula for syntactic correctness when you
click OK. If there is a problem, an alert box will appear to let you know what
the problem is. See Errorsfor more information.

Result Name: The result of a calculation box can be included as part of the

formula for other calculations on the form. In order to use the result of a
calculation in this way, you need to give the calculation a name.
Forms Designer

Tools and Controls

5. To name a calculation box, type the name into the Result box

Always Calculate option: You need to set this option if the form may span

The name can be up to 30 characters. It must not start with a digit.

It is an error to include a calculation’s own name within it’s formula, or to
use the name of another calculation that will in turn use the name of the
first. This is called a circular reference.

Warning: Do not use the same name for more than one calculation box. If you
do this, the results of all but the top-most calculation box will be incorrect.
You will be warned of duplicates when you try to preview, print or save.

Apply Format: Use the Apply Formatpop-up menu to apply a date or numeric
format to the result. The formatyou choose will be used to format the
result of the calculation provided that the result is of a type appropriate to
the format.

The format will also be used whenever the calculation involves an implicit
type conversion to the type for which the chosen format applies. For
example, if the calculation is:

"Please pay by " + DueDate

then the selected date format (if any) will be used to convert DueDateto
text so that it can be concatenated to the literal text. In this case, the final
calculation result is Text, so no additional formatting is applied to this.

There are two check boxes for setting options that control the evaluation and
appearance of the calculation and result.

Word Wrap: Set the Word Wrap check box if you want the text of the calculation

result to be “wrapped” inside the text box. Text can only be wrapped if the
box is more than one line high. The box will not grow to accommodate the
text.If the word wrap option is off, and the text will not fit inside the box, it
will be truncated to fit and an ellipsis (...) will be added to show that this
has been done.

multiple pages and the calculation includes the PAGE number or the
SubTotal function or anything else that may cause the calculation result to
be different for each page of a multi-page form.

The reason for this is that calculation boxes are normally evaluated once for
each record being printed—before anything is actually printed. The same
result is then output for each page if the form spans multiple pages. If the
result may be different, the calculation needs to be redone for each page
and you should set the Always Calculate option.

If you use the Always Calculateoption, the calculation result will always be
printed on top of any other objects that overlap the calculation box, i.e. an
Always Calculate calculation box is forced to the front. This is because it is
not evaluated until the other objects have been output to the printer.

Modifying a Calculation

To get back into the Calculation dialog box for a calculation box, double-click on
the Calculation box, or select it and choose Modify Object from the Edit menu.

Errors

When you click the OK button in the Calculation dialog box, the Forms Designer
will check that your formula is syntactically correct. That is, that the formula
“makes sense”.

There are three possible kinds of error: Syntax Errors(where the mathematical
grammar of the formula is wrong), Scope Errors(where a field or identifier name
is used that does not exist or is not appropriate to use), and Semantic Errors
(where the formula tries to evaluate something that cannot be evaluated).

Syntax Errors: For example the following is correct

"Minimum Payment Due: " + (Gross - AmtPaid) / 10

If you want numeric data to be correctly aligned on the right, you should
turn the Word Wrapoption off.

whereas the following is missing a bracket:

Note: If this option is off, the text will be vertically centred inside the box.

"Minimum Payment Due: " + (Gross - AmtPaid / 10
Forms Designer

Tools and Controls

There is no way that the formula can be evaluated if its syntax is incorrect
just as you can’t understand an english sentence if syntax incorrect, its is?
(well maybe you can at a pinch, but you are considerably smarter than any
computer program). Instead an error message is given, in this case:

Error: Expected a )

After you click the OKbutton in the error alert, MoneyWorks will highlight
the point in the formula where it thinks the error is.

Scope Errors: Another kind of error that is checked for is the non-existence of

identifiers used in the formula. For example, the formula

"Minimum Payment Due: " + (Gross - AmountPaid) / 10

is incorrect. This is because the identifier “AmountPaid” is not recognised.
In this case, the error alert box allows you to exit from the dialog box
because you may be planning to create another calculation box whose
name will be “AmountPaid”. If not, you can click Edit to return to the
Calculation dialog box and correct the error.

Semantic Errors: Often, semantic errors will not be detected until you actually
try to print the form, because they are usually associated with the actual
data operated on by the formula. For example:

A / B

is erroneous only if B is zero, causing a print-time “Divide by Zero” error.

Table of Errors

The following table lists common errors that you may encounter.

Error

Explanation

Can’t add two
dates
Circular
reference

Column not
found

Dates cannot be added together (although you can add a number to a
date.)
This error will occur at print-time if a formula includes its own name or
includes the name of another formula that includes the name of the first
formula.
This error occurs if the column name passed to the SubTotal function
does not exist in the list.

Date required

Divide by zero
Expected a (

Expected a )

Expression too
complex

List not found

Subtotal
unavailable
Syntax error
Type conversion
failed

Unknown
identifier

Unterminated
quote
Wrong number
of arguments

This error will occur if you pass a number as a parameter to a function
that expects a date.
You cannot divide by zero.
You will get this error if you do not have an opening parenthesis following
a function name.
You will get this error if you do not have the same number of closing
parentheses as there are opening parentheses in the formula.
You may get this error if a formula is too complicated. Try breaking the
formula up into sub-expressions and putting them into separate, named,
invisible calculation boxes.
This error will occur if the list name that you supply to the SubTotal or
ExpandList function is not known. Lists that are referred to in this way
need to be named using the List Options command.
This error will occur at print-time if the calculation box does not have the
Always Calculate option set.
This error will occur if the syntax of the formula is not correct.
This error will occur if you try to display the result of an ExpandDetail or
ExpandList function. These functions return a special list type that can
only be used as a parameter to a function that accepts a variable number
of arguments.
The identifier is not known or is not available in the current scope. Check
that the identifier is spelt correctly and that you are not trying to use a
field from a subrecord in the main part of a form.
A literal text string did not have a terminating quote mark (").

A function was given the wrong number of parameters (arguments).

The List Box Tool

Use a List Box when you want to include:

• The detail lines of an invoice, payment or receipt.
• The individual transactions of a statement
• The invoices paid with a cheque (or remittance advice)

First, here are some important points to remember about list boxes:

• The type of form determines what information will be displayed in list boxes
on the form. MoneyWorks will automatically select the correct records for
you.

• You can specify a subset of the records that MoneyWorks finds to be

displayed in a list.
Forms Designer

• A single list box can show multiple columns of information.
• You can have more than one list box on a form.
• If there is more information to be displayed in a list than will fit,

MoneyWorks can automatically print another page of the form to
accommodate the information (this is optional).

• Where a list extends over more than one page, the list can start higher up
the page on the first page than subsequent pages, and end higher on the
last page than previous pages, as shown below.

To create a new list:

1. Select the List tool

2. Click and drag a rectangle that will be the bounds of the list

A new list box will be created with a
single column. The list box will be
active. This means that you can
modify the content of the list. When
a list is active, its border is outlined.

If you click outside the list rectangle, the
list will be deactivated, and will behave
like any other object (so it can be moved,
resized etc).

To activate an inactive list box so that you can edit it:

Tools and Controls

1. With the list tool, click once on the list or with the arrow tool, double-click

on the list

The list will activate (indicated by its border being outlined)—it must be
active to manipulate its columns.

To add a column to the
currently active list box:

1. Choose Edit>New Column
or press Ctrl-N/⌘-N

The new column will be
added on the right hand
side of the list. It will be
selected (black).

The Dynamic Column: Notice that the first column has been
shrunk to make room for the new column. In fact, when
adding or duplicating a column, it is the dynamic column
that is resized to make room for the new column. This
column is indicated by a small left-pointing arrow on its
right hand edge.

The dynamic
column indicator

You can select which column is the dynamic one by holding down the
option key (Mac) or the Ctrl key (Windows) and clicking on the column.

To resize a column:

1. Move the mouse over the right hand edge of the column

The mouse pointer will change shape.

Column resizing
pointer
Forms Designer

2. Click and drag the column
edge until the column is
the desired width, then
release the mouse button

Notice that the column
adjacent to the one being
resized also resizes. When
you shrink one column, its
neighbour grows to fill up
the space.

Ctrl/Option-Resizing:

If you don’t want the
neighbouring column to grow
or shrink when you resize a
column, hold down the ctrl key
(Windows) or the option key
(Mac) as you do so. The
columns to the right of the one
being resized will move as you
drag the mouse.

Tools and Controls

To resize the List Header:

1. Move the mouse over the bottom of the

list header until it changes shape

2. Click and drag to resize the header

To remove the heading, drag the bottom of the header right to the top of
the list.

To reduce the list size on the first and last pages

Lists have First Page Startsand Last Page Endsmarkers, allowing your lists to
start and end at different locations on different pages. You cannot see these
markers when you create a list as they are, respectively, at the very top and
bottom of the list box. You need to option/ctrl drag the top or bottom of the list
towards the list centre to expose them.

Caution: In attempting to move the markers, it is relatively easy to inadvertently
resize or move the entire list. If this happens just release the mouse and
press Ctrl-Z/⌘-Z to undo the change.

A shaded area will appear at the right-hand side of the list box. This free
area will be used up if you add more columns. If you deactivate the list
while there is free space in the list, the list box will shrink.

Note: If you resize an inactive list so that the width of the list box changes, the

dynamic column changes in width by the same amount that the list’s width
changed. No other columns will be affected. You cannot make a list box any
smaller than reduction of the dynamic column will allow.

To move a column:

1. Move the cursor over the column until it changes into a hand

2. Drag the column to its new location

The column will move as the hand crosses column boundaries.

To reduce the list size on the first page:

1. Position the cursor at the top of the list

This is the line that marks the top of the
list, and is above the list header.

2. Hold down the option key (Mac) or the ctrl

key (Windows)

3. Click and drag the top of the list down

The First Page Startsmarker should move
down, pushing the body of the list (and list
header) down and leaving a blank space at
the top of the list box. List items will not be
printed in this blank area on the first page
of the form, but will on every subsequent page.
Forms Designer

Tools and Controls

4. To move the First Page Startsmarker again, hold down the option/ctrl key

and drag the marker up or down.

To reduce the list size on the last page:

1. Position the cursor at the bottom of the list

If you want to refer to the calculation result from another column or from a
calculation box elsewhere on the form, you may want to give the column a
meaningful name in the Result field

If you want to refer to the column from outside the list, you will need to
name the list using the List Optionsbutton.

2. Hold down the option key (Mac) or the ctrl key (Windows)

3. Enter a column heading if required

3. Click and drag the bottom of the list up

The column heading is only displayed if the List Heading is exposed.

The Last Page Endsmarker should move up, pushing the body of the list
upward and leaving a blank space at the bottom of the list box. List items
will not be printed in this blank area on on the last page, but will on every
other page.

The column heading can be include text expressions within << and >> that will
be calculated at runtime.

4. Set the formatting options as you would for a calculation box

To Change Column Calculations, Formats and Headings

1. Double-click the column

The Calculation dialog box for the column will open. This is slightly different
from the dialog box for an ordinary calculation—it has an extra field for
specifying the column heading.

Remember than columns showing figures should have the Word Wrap
option off for correct decimal alignment. Turn the Word wrap option on if
you want the text in the column to be wrapped over multiple lines. The data
in any non-word-wrapped columns to the right of a word-wrapped column
will align with the last line of text in the word-wrapped column.

To change the text alignment of a column:

1. Highlight the column by clicking on it

The alignment
buttons

2. Choose the desired text alignment from the Edit>Form>Alignment sub-
menu, or click the appropriate alignment button in the Tools Palette

2. Enter the formula for the data to be displayed in the column as you would

for a calculation box

For an invoice/receipt form, the information will usually come from the
Detail fields. For a statement or remittance advice, it will usually come from
the Transaction fields. These are the records that repeat in the list.
Forms Designer

List Options

Use the List Options dialog box if you want to:

• Name the list so that its contents can be

accessed from calculation boxes;

• Exclude records from appearing in the list

using a search function;

• Choose a different list format;
• Change the formatting options for the list;
• List records from a different file (e.g. detail

lines on a statement) or

• List data from some other source, such as a

table or external database.

To open the List Options window:

1. Highlight or activate the list

2. Right-click on the list and choose List Optionsfrom the menu, or Choose

Edit>Form>List Options, or press Shift-Ctrl-L/Option-⌘-L

3.

If you need to name the list, type a name into the List Namefield

You must name a list if you want to extract summary information from the
list using the ExpandList or the SubTotal function. The name can be up to 31
characters, cannot include any spaces, and must not begin with a digit.

4. From the List Records pop-up menu, choose the source file for the records

that are to appear in the list

Choosing a file different to the default makes all records from that file
available. To filter them based on the context in which the form is being
printed, use a Relational Search.

Calculated Row Count: Select this if you are drawing your data from a source
other than a MoneyWorks list. The number of rows to output is then
entered instead of a search expression.

5.

If you want to exclude some records from the list when it prints, enter a

Tools and Controls

search formula into the Search Function box

The search function that you supply will be evaluated for each record that
MoneyWorks selects for inclusion in the list. If it evaluates to False (or zero)
for a record, then that record will not be printed in the list.

For example, if you want to exclude the freight item from the list in a
product invoice and place it in a separate box below the list, you might use
a search function such as:

Detail.StockCode <> "FREIGHT"

which specifically excludes any lines with a product named “Freight”, or:

Lookup(Detail.StockCode, "Product.Type") != "S"

which excludes any products which are “Ship Methods” from the list, or:

="[Transaction:NameCode=`" + Name.code + "`][Detail]"

would find all detail lines for the currently printing statement name. Note
that in this situation the search expression will be different for each
statement, and hence must be calculated each time. Thus when we are
printing a statement for SMITH, we get a search expression of:

[Transaction:NameCode=`SMITH`][Detail]

Whereas for BROWN we get:

[Transaction:NameCode=`BROWN`][Detail]

Clicking the Editorbutton displays the formula editor window which can be
used to help create the search function.

Note: If you are using your own data source and the Calculated row count

option in the List Records selector, you should set the search expression to
the number of rows to print. In the list itself, use the variable indexto
determine the row number being printed. Note that this starts at zero (so
row one has index 0, row 2 has index 1 and so on).

6.

If you want to specify a particular order for the records to appear in the
list, set the Sorted byoption
Forms Designer

Two types of sort are available.

Sorted by Fields: Select the sort fields for the list from those in the pop-up

menu (these are the fields in the selected MoneyWorks list). The sort can
be ascending or descending, and two levels of sort are available.

Sorted by Calculation: The calculation is evaluated for each row in the list, and
the list is sorted according to the result (thus the calculation should return
something different for each row). The type of sort (i.e. numeric, date or
text) is determined by the type returned when the sort expression is
applied to the first row—you should ensure that the calculations returns
the same type for all rows (i.e. they should all return a numeric value, a
date or text, but not a mixture). No sort is done if the result of the
calculation is not one of these types.

7.

If you want to change the printing format for the list, click on the
combination of icons that make up your desired list appearance:

Tools and Controls

This option is on by default.

10.

If you are showing the list heading section and want your headings
vertically centred, set the Vertically Centre Headingscheck box

This list option will centre single-line headings within the heading region of a list
object, giving a much tidier layout. If you need headings to wrap over several
lines, then leave this option off.

Lists and Multi-page Forms

There may be more information to be displayed
in a list box than the size of the list box will
allow. If the list’s Allow Multiple Pagesoption is
set, MoneyWorks will automatically print extra
pages of the form until all of the list data has
been output

No box or column separation lines. Use this format if you are printing on pre-
printed form stationery. The other options are turned off if this option is
selected.

Bounding box and heading separation line. Use this to draw a frame around
the list. The border colour and pen width for the list are used to draw the
lines.

Column separators. Use this to draw a vertical line between columns in the
list. The border colour and pen width for the list are used to draw the lines.

Record separators. Use this to draw a horizontal line between each record in
the list. The colour and pen width for the list are used to draw the lines.

Normally, all non-list objects are simply
repeated on the extra pages. You can, however, control the visibility of these
items based on whether the page is the first one or the last one. This feature is
illustrated in the example above, which has “Continued...” printed on every page
other than the last one and shows subtotals on these pages. The last page has a
grand total and GST total. See Page-based Visibility.

If you want a calculation to be different for each page, you need to set the
Always Calculateoption for the calculation, otherwise it will be calculated only
once before the first page is printed.

Pyjama stripes. Use this to show alternating lines of text in the list a different
colour. The pyjama stripes use the fill colour and transparency, with one stripe
per line of text.

Product Images in Lists

8.

If you want a blank line between each record, click the Gap Between
Itemscheck box

Note that the Leading setting also affects list spacing.

To insert a product image into a list (typically an invoice or quote), the
calculation for the column needs to resolve to “<<prodimg:code>>”, where code
is the product code of the item to print. Thus the following formula in a list
column for an invoice-type form will display the item’s picture if any.

9.

If you want multiple pages to be printed when there are more records to
be shown in the list than will fit on one page, set the Allow Multiple Pages
check box

="<<prodimg:"+detail.stockcode+">>"

Note that Word Wrap for the column should be on.
Forms Designer

The Show toolbar button

The Show toolbar button activates a menu
containing options affecting the display and
operation of the Forms Designer. Most of the
options are turned on by default, as indicated
by the check mark next to the option. To turn
an option off, choose the option from the
Options sub-menu.

Show Formulas: When this is on, calculation
boxes and list columns will be displayed
on screen with the formula text in the box. When this option is off, the
calculation result name or column name is shown instead.

Show Field Baselines: When this is on, the text baseline for calculation boxes is
drawn. This is to help with lining up objects whose text size or font differs.

Show Invisibles: When this is off, objects whose global visibility attribute is
Always Invisiblewill not be drawn on-screen. The objects can still be
selected and manipulated.

Show Conditional Invisibles: When this is off, objects whose global visibility

attribute is Conditionalwill not be drawn on-screen. The objects can still be
selected and manipulated.

Show Object Numbers: When turned on, the number of each object is displayed

in the top left hand corner of the object. This is useful for finding an object
with a run-time error—object numbers are reported in the errors dialog box
when you try to print a form that has errors.

Show Guides: When on, alignment guides will appear on screen when you move
or resize objects and one of their edges is aligned with the edge of another
object. You will also get alignment guides when drawing lines if they are
strictly horizontal or vertical.

Formatting Objects

Formatting Objects

Each object on the form has graphical properties. Not all of the properties apply
to all kinds of objects. The following table shows which properties can be
changed for each type of object.

Property

Lines Rectangles Text Calculation List Pic

Yes
Yes

Yes
Yes
Yes

Yes
Yes
Yes
Yes
Yes
Yes
Yes

Border Colour
Border Transparency
Fill Colour
Fill Transparency
Pen Width
Visibility
Shadow
Text Font
Text Size
Text Style
Text Colour

Yes
Yes
Yes
Yes
Yes
Yes
Yes
Yes
Yes
Yes
Yes

Yes
Yes
Yes
Yes
Yes
Yes

Yes
Yes
Yes
Yes

Yes

Yes
Yes

Yes
Yes
Yes
Yes
Yes
Yes

Yes
Yes
Yes
Yes

All of these are set using the commands in the Edit>Form menu—the Text style
options are set using the Type Style command or the Type Style Toolbar button.

Whenever you set one of these properties (or formats) for an object, the format
that you choose becomes the default and will then be used for any new objects
that you create. (The default fill and border properties are not applied to new
text and calculation objects).

Variations on a line: Use different colours, widths, transparency, shadow, arrows, dashes and end
styles to achieve the perfect line.
Forms Designer

Borders, Fills and Pen Widths

Rectangles, text boxes, calculation boxes and lists have both a borderand an
interior. The border colour, border transparency and pen width are used for
drawing the border of these objects, and the fill colour and fill transparency are
used for drawing the interior.

The border and fill attributes can be set from the tool palette or from
commands in the Edit>Form menu.

Changing Border and Fill Colours

Border colours apply to all objects except pasted pictures. Fill
colours apply to all objects except pasted pictures and lines. To
change the Border or Fill colour:

1. Select the objects

Filland Lineset
colour buttons

If you just want to change the default border or fill colour, you don’t need
to select any objects.

2. Click the Border (Line) or Fill Set Colour button as appropriate

The colour picker for your platform will be displayed.

Formatting Objects

Windows colour picker

Mac colour picker

3. Select the desired colour from the colour picker

The objects will be redrawn with the new properties. The selected border
or fill colour becomes the default for newly created objects.
Forms Designer

Changing the Pen Width and Pattern

Pen widths and patterns (solid, dotted or
dashed) apply to all objects except pasted
pictures. To these:

1. Select the objects to be affected

If you just want to change the default
pen width, you don’t need to select
any objects.

2. Select the desired pen width from

the Pen Attributes menu in the Tool
Palette

The objects will be redrawn with the
new pen width. The selected pen
width becomes the default for newly
created objects.

Note: The Butt, Round and Square Cap will

affect the ends of any dashes or dots
in dashed or dotted lines.

Drawing Arrows

Any line (but not rectangle) can be
converted into a single or double
arrow by selecting the line and
choosing one of the Arrow options
from the Pen Attributes menu.

Shadows

2. Choose Shadow from the Pen Attributes menu in the Tool Palette

Formatting Objects

Transparency

Border and fill colours, as well as images can have
varying levels of transparency. To change the
transparency:

1. Select the objects

If you just want to change the default border
or fill transparency, you don’t need to select
any objects.

2. Click the Border or Fill Set Transparency

button as appropriate

The transparency for the items will be altered.

Font, Size, Style, Text Colour and Alignment

Calculation boxes, Lists and Text boxes can all have their text font, size, style and
colour varied. You need to select the text object (and not just highlight some of
the text) to apply these settings.

Alignment

You can set the text alignment (Left, right or centred) for a
calculation box or a text box by highlighting the object and
clicking the appropriate alignment button. You can’t change the text alignment
for an entire List box—you need to activate the list and set the alignment for
each column separately.

The alignment
buttons

Font, size and style

Rectangles, lines, images and text objects (but not calculation boxes or lists) can
have a subtle shadow added for that added je ne sais quoi. To add a shadow:

1. Select the object(s)

To change the text attributes for a selection of objects:

1. Select the object(s) to be affected

The Type Style
toolbar button
Forms Designer

Formatting Objects

If you just want to change the default value for one of the properties, you
don’t need to select any objects.

Conditional Visibility: the object will only be printed if a formula that you

supply evaluates to TRUE (i.e. to any number except 0)

2. Click the Type Style Toolbar button or Choose Edit>Forms Designer>Type

To change the global visibility of a selection of objects:

Style

3. The Type Style window will be displayed

1. Select the objects to be affected

2. Choose Edit>Forms Designer>Visibility, or right click and select Visibility

4. Make the appropriate settings and click OK

from the contextual menu

The Visibility dialog box will open

The Text Colourtool

Text Colour

To change the text colour for a selection of objects:

1. Select the object(s) to be changed

2. Click the Text Colour button

The colour picker will be displayed.

3. Select the colour from the colour picker

The text will change colour when the colour picker closes

Visibility

You can control the visibility of individual objects on the form. Visibility
attributes can be global (i.e they apply for all pages of a multi-page form) or they
can be page-based (or a mixture of both).

Global Visibility

There are three kinds of global visibility property:

Always Visible: the object will always be printed on the form.

Always Invisible: the object will never be printed. Use this option if you want to

have a calculation box that you don’t want to be printed.

The current visibility settings for the selected objects will be shown in the
dialog box. If there is more than one object selected, and the settings for all
the selected objects are not the same, then none of the options will be
selected in the dialog box. If you do not wish to change the visibility settings
you should click Cancel.

3. Click on the radio button for the desired visibility option

If you choose Conditional visibility, the text box labelled “Visibility =” will be
enabled. Into this box you should type a calculation that evaluates to true
when the object is to be visible and false when it is to be invisible.

4. For conditional visibility, type the visibility calculation

Example: To have an object appear only if the transaction value is negative,
you would type

Gross < 0

You can click the Editor button and use the calculation editor to help
construct your visibility calculation.
Forms Designer

5. Click OKto accept the changes

Page-based Visibility

You can control whether an object is visible on each page of a multi-page form.

For example, you may have a statement form whose list has the Allow Multiple
Pages attribute set. This form may conceivably be printed over several pages if
the customer for whom it is printed has enough transactions. On this form, you
may want to have the word “Continued...” printed at the bottom of each page
except the last one. Or you may want the phrase “End of Statement” printed on
just the last page; or you may want a subtotal printed on each page with a
grand-total on the last page only.

All of these things are possible using the settings in the Attributes(Attr) button
on the tools palette.

To set Page-based Visibility Attributes:

1. Select the objects

Formatting Objects

As an example, you may want a coloured box to be drawn behind a field on
a form, but you have already made the field. When you draw the box, it
obscures the field, as shown below at left. The solution is to select the
coloured box and use the Send to Backcommand.

If Show Object Numbersis turned on, you will notice that
the object number changes when the order changes.

Ordering tools

Aligning Objects: For a tidy form, the
objects on it should, where appropriate, be
neatly aligned. There are special commands
for quickly aligning a selection of objects.

To align the edges or centres of a group
of objects:

Alignment tools

1. Select the objects to be aligned

2. Choose the desired alignment command from the Arrange sub-menu or

click the corresponding alignment tool palette button

Align Top Edges

Align Centres Vertically

2. Choose the attribute required from the Attrbutton on

the tool palette

The Attributes
button

The attribute is set for the objects. No visible change will be apparent for
the objects. However, if you click the Attributes button again, the attribute
item will be checked.

Examples:

Before

Arranging Objects

The Edit>Forms Designer>Arrange sub-menu contains commands for ordering
and aligning objects. For convenience, each of the commands in the Arrange
sub-menu has an icon button equivalent in the tools palette.

Ordering Objects: You can control the front-to-back ordering of

objects. When objects are drawn on the page, they are drawn
from the back to the front. If objects overlap, the one in front will
be drawn on top of the one behind. As a shortcut to using the
commands in the Arrange sub-menu, you can use the ordering
control icons in the tool palette.
Forms Designer

After

Form Options

Form options take effect when the form is printed. These are
set in the Form Options window.

1. Click on the Optionstoolbar button or Choose

Edit>Forms Designer>Form Options...

The Optionsbutton

The Copies Function: The Copies Function determines how many copies of the
form will be printed, and is normally simply the number 1. This means that
one copy of the form will be printed for each record that you cause to be
printed from MoneyWorks. If it is zero, no form is printed
Form Options

The copies function need not be a number. It can be a calculation just like
any other calculation in a form. It is evaluated before the form is printed for
each record that is to be printed using the form.

Note: The number of copies to be printed is also affected by the settings in the

Print Job dialog box when you come to print the form. The number
specified here is in effect multiplied by that of the Copies Function in the
form itself to give the number of forms actually printed. Therefore, as a rule
of thumb, the number of copies should be built into the form itself, and not
in the print dialog.

Example 1: Your company produces two kinds of invoices: one for services and
one for products. The forms are completely different but you do not want
to have to choose the correct form every time you print an invoice.

One solution is to create a Form Group— see Printing Multiple Forms)
containing the two forms. The copies function of each form is set up to
evaluate to 1 if the invoice is of the type relevant to the form and zero if
not. The result is that only the correct form will print, no matter what the
invoice type.

The copies function to use to achieve this for a product invoice are:

If(Length(Concat(ExpandDetail("Detail.StockCode"))) > 0, 1, 0)

and for the service invoice:

If(Length(Concat(ExpandDetail("Detail.StockCode"))) = 0, 1, 0)

These functions work by testing the length of the text string formed by
concatenating all the product codes in the invoice detail lines. If the
resulting text string is empty, then there are no product codes, which
implies that the invoice is a service invoice.

Another solution is to create a single invoice form with two (or more)
sections. The first section could be laid out for services, and the second for
products. The above formulas could then be placed in the relelvant Section
functionto determine which section was appropriate to print.



Forms Designer

Testing Your Form

Example 2: A manufacturing company needs to produce a label for each product
that it produces in a batch. The number of products in a batch (and hence
the number of labels required) varies for each product, and is stored in the
NormalBuildQty field of the Product record. By using a product label form
with a copies function of:

Product.NormalBuildQty

the required number of copies of each label will be printed when the Print
Product Labels command in the Command menu is used.

Important: The Copies function is entirely independent of the Copies box in the
Print job dialog box that you get when you print. The Copies box allows you
to print multiple copies of each page of a document. The Copies function
for a form lets you print multiple copies of a Form. For labels in particular,
the number of pages and the number of forms printed is not necessarily the
same.

Includes function for section:

This determines the number of copies that will be printed for the section
selected in the pop-up menu. Each section can have its own copies
function, allowing you to skip sections if certain conditions are meet.

Note that this is subservient to the form Copies statement—if this is set to 0
you will get no sections printed, regardless of the value of the Section
function.

Attachment Name template:

In MoneyWorks 9.1.7 and later, you can specify the name that MoneyWorks
should (try to) use when creating PDF attachments for emailing. The
template can include expressions in double angle brackets. Don't include
.pdf in the name; that will be added automatically. You can leave this blank
and MoneyWorks will choose a default name depending on the type of
form (or transaction) being PDFed.

Example for an invoice form: <<Name>> Invoice <<OurRef>> will give e.g.
Acme Widgets Invoice 10123.pdf

Example for a statement form: Statement for account <<Name.Code>>
will give e.g. Statement for account SMITH

Require Confirmation after Printing: If you are designing cheque stationery, you
will want MoneyWorks to confirm that the cheque print run was completed
correctly — see Printing Cheques. Setting this check box (which is only
available for cheque/remittance forms) causes the Cheque Confirmation
dialog box to be displayed after the form is printed

Silently substitute missing fonts: If set, and the form uses fonts that are not

installed on your computer, alternative fonts will be used with no warning.

Testing Your Form

While you are designing the form, you will want to try printing it to check page
alignment and to see how it looks. You can print off the form layout, or, by
highlighting representative sample records in the source file, use actual test data
to see how the form will operate in practice.

To print a form from the Forms Designer:

1. Click the Test Toolbarbutton or Choose File>Print

The Test Form Printing windows will be displayed.

The Testtoolbar
icon

2. Click the Print /Preview button to print or preview the form.

The options on this are:

Print Form Layout with Formulae: The form is printed as it appears in the

designer (with the fields outlined), with the objects and their formulæ listed
on subsequent pages.
Forms Designer

Securing Your Form

Print Form using data from document: The form will be printed using the

highlighted records in the source file appropriate to the type of the form. If
the source file is not open or has no highlighted records, MoneyWorks will
select all records in the file. If there are no records to provide data for
printing, this option will be disabled. The number of records to be printed is
shown in the window.

Stop after one page: This option restricts printing to one page only, and is
on by default. You should leave this option on if you have not highlighted
any records from the source file to use to test your form (otherwise it will
print every record in the source file).

Note: Printing actual data will expose any logical errors you have made in your
form—such errors will be displayed in a dialog box showing the errors and
object numbers concerned. You should correct the errors before using the
form — see a list of errors.

Print a page full of labels: Use this for printing labels that are all the same and

do not include any information from MoneyWorks (disk labels for example).
Enough copies of the form are printed to fill one page.

Securing Your Form

It may be that you do not want everyone to be able to use the form you have
created. For example, a cheque form should only be able to be printed by
authorised personnel. The signing mechanism in MoneyWorks allows specific
forms (and reports) to be “signed”, and for only signed users to be able to access
them. To sign the form:

1. Click the Signing toolbar icon

The signing window will be displayed.

For more information on this see Protecting Reports and
Forms by Signing.

The Signingtoolbar
icon

Printing Multiple Forms

Multiple forms can be printed at one time by creating a Form Group—this is
basically a list of forms to print in a single operation. As an example, you may
want to print customer invoices together with envelopes to put them in, or
maybe you laser-print your invoices for your customers and for some odd
reason print your own copy on a dot matrix printer. You may even have different
invoice forms to use depending on the type of customer—this can be
accomplished by a combination of a form group and use of the Copiesfunction.

To create a multi-page form group:

1. Choose File>New>New Custom Form

The New Custom Form window will be displayed.

2. Set the Form Typeto the type of form (e.g. Invoice/Receipt), set the Multi-

Page Form Groupoption, then click OK

The Form Chain window will be displayed

This contains a list of available forms of the required type. The forms that
will be printed when we use this form group are listed in the right hand
column. For new groups this will be empty.

3. Highlight the first form you want printed in the left hand column, and click

the Copybutton, transferring it to the right hand side.
Forms Designer

4. Repeat with the other forms that are to be printed

The above group will print packing slips and invoices, then it will pause so that
envelopes can be loaded into the printer, and then it will print these.

All of a component form is printed first, before any of the next form in the list
are printed. Thus in the example above, packing slips are printed for all the
highlighted transactions, then invoices, then (after a pause) envelopes.

To change the order of printing: Drag a form (in the right hand list) up or down.

The forms at the top of the list will print first.

To pause in a print run: Click the Ins Pausebutton to insert a pause. Use this

when you need to change stationery.

To remove a form: Highlight the form (in the right hand list) and click the

Removebutton. The form will be removed from the list.

To edit a form: Highlight the form and click the Openbutton under that list.

5. Close the Form Chain window when the group is complete

You will be prompted for a name of the group.

Adding a Hot Link (Hyperlink) to a Form

You can embed a URL into a form or report which, when clicked in the Preview
window or (more usefully) on a pdf of the form, will take you to a designated
web site or create a new email in the recipient’s email program. (Note that on
Windows, embedding links in PDFs does not work if you use the MS Print to PDF
option).

To add a hot link to an element on the form:

1. Hold down the ctrl key (Windows) or the option key (Mac) and double

click an element on the form

The properties window for the element will open.

Adding a Hot Link (Hyperlink) to a Form

2. Enter the URL into the Hot Link field

You can link to a website or other form of URL from the report. This will be
active in the preview window or in a saved pdf. The entire hot link must
constitute a valid URL. For example the following will link to a website in
your default browser:

http://www.cognito.co.nz

The following will create an email in your email program:

mailto:info@myemail.com?subject=Response to mailout

3. Click OKto save the link

The hot link can be a formula, starting with an equals sign, that is calculated
from other elements on the form (in fact if the URL is long, you will need to have
a calculation here, as the length of what you can type in is limited). This means
that the URL can be different for every form printed, for example each invoice
could link to a payments page and automatically populate the payment amounts
and invoice number on the page, as in this example:
Forms Designer

Customising the Navigator

="https://accounts.xyz.co/pay_invoice.php?invoice_&num="

+ourref+"&amount="+gross

the folders and panels (.invc files) in this Navigator folder.

which links to a (hypothetical) payment site and populates the invoice_num and
amount fields on the payment page with the invoice number (ourref) and
amount (gross) from the MoneyWorks invoice transaction.

Hot links are used extensively in the MoneyWorks Navigator (see next section),
the layout of which was done entirely in the Forms Designer (and hence can be
customised if desired).

Tip: If your hotlink formula gets too long, split it into components by calculating

sections of it in invisible calculation fields, e.g.

URL="https://accounts.xyz.co/pay_invoice.php"
params = "?invoice_&num="+ourref+"&amount="+gross
hotlink = URL + params

Customising the Navigator

The MoneyWorks Navigator consists of a set of forms4 kept in the Navigator
folder of the MoneyWorks Standard Plug-ins. If, when you open or connect to a
MoneyWorks document, MoneyWorks detects a Navigator folder in the Custom
Plug-ins folder, it will use that folder instead of the one in the Standard Plug-ins.

Note: After doing this copy, or making any other structural change to the

Navigator such as adding or removing a folder or file, you will need to close
and re-open your MoneyWorks document for the changes to take effect

To modify a Navigator panel:

1. Double click the .invc file in the Finder or Windows Explorer

The form will open in the MoneyWorks Forms Designer. Make any changes
and save the form. Note that you will need to refresh the panel to see any
changes (do this by moving to a different panel, then back to the changed
one).

Tips:

• When building or modifying a Navigator panel, you can use all the tools of

the Forms Designer;

• Avoid computationally heavy calculations, as they will make the Navigator

sluggish;

• Copy and paste the elements off the standard navigator panels to replicate

them in yours;

• Text and graphic elements can be conditionally visible, so that they only

appear if certain condition are met;

• To view or modify an element’s hot link), hold down the ctrl key (Windows)

or the option key (Mac) and double click the element;

• You can paste your own graphics onto the form, or use the ones built-in to
MoneyWorks. The latter are accessible by the Built-in setting in the Image
options (double click the required image in the standard Navigator to view
the built-in name);

The easiest way to build you own custom Navigator is to alter a copy of the
standard one that comes with MoneyWorks5. The first step then is to put a copy
of the Navigator folder in the Standard Plug-ins into the Custom Plug-ins folder,
which you do in Windows Explorer or the Mac Finder (to locate these folders,
see Managing Your Plug-ins. The structure of your Navigator is determined by
Forms Designer

Customising the Navigator

4 Or in fact reports, as in the Dashboard section of the Navigator↩

5 If you alter the Standard Custom Plug-ins/Navigator folder directly, any changes
made will be lost when MoneyWorks is updated↩

• If you want to deploy your Navigator to users who do not have the privilege
Signing and Using Unsigned Forms and Reports, you will need to sign each
Navigator panel to them — see Protecting Reports and Forms by Signing;

• Folders and panels are displayed in the Navigator alphabetically by file

name. If the file/folder name is prefixed by a number of the form “99.”, this
is removed from the MoneyWorks display, allowing you to order the
Navigator as you wish;

• You can have an optional icon appear next to your panel name by including

a png file with the same file name as that of the panel (except for the
extension).

1 As a shortcut, hold down the Ctrl key (Windows) or the option key (Mac). The
Layout button changes to Edit, which, when clicked, will open the Forms window.↩

2 This differs from earlier versions where the origin was the top left of the form
area.↩

3 For inserting product images in the list part of an invoice/quote, see Product
Images in Lists↩
