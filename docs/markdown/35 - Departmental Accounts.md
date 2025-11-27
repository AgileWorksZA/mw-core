# Departmental Accounts

Departmental Accounts

Departmental Accounts

Departments are one way that MoneyWorks Gold provides to simplify your
account codes. Although not applicable to every user, they can be extremely
useful in the right situation, typically where there are a number of entities that
have a similar cost and/or revenue structure.

Departments can also simplify reporting. Most reports in MoneyWorks can be
printed for the entire company or for just selected departments.

Examples of using departments:

• You run a fleet of vehicles, and want to track the revenue and operating

costs per vehicle;

• You have a shop with a number of branches, and want to monitor the
profitability of each shop, as well as the consolidated profitability;

• You are a builder who has a number of large projects per year, and need to

track their expenses against budget;

• You want to monitor the costs (and possibly the revenue) associated with

individual staff members;

• You are an entity that is organised around departments (e.g. a school with

departments for English, Maths, French etc.)

Department Example

Consider as an example a construction company who has several major
residential and commercial projects, and also has a couple of vehicles. Each
project and vehicle can be represented as a Department (cost-centre) in
MoneyWorks.
Departments are organised into Groups, so that the projects are in a group
"Project", and our vehicles are in a group "Vehicle".

In the general ledger, the accounts that are directly concerned with project
income and expenditure are assigned to the Group Project; those that are
concerned with Vehicle costs (petrol, repairs, insurance etc) are assigned to the
Vehicle group. These are referred to as Departmentalised accounts. Other
accounts, such as office overheads, are not assigned to a group.



Departmental Accounts

When an entry is made in a transaction against a Departmentalised account, the
department must be specified. Thus if Truck2 incurs repairs, we must code the
expense as shown.

If a new Department is added to a Group, the required new ledger records are
automatically created. Thus if the construction company gets a new residential
job PROJ4, just adding this to the appropriate Group (Project) will create the
ledgers.

When an account is departmentalised in this manner, an individual ledger
account is created for each department in the group, allowing for direct coding,
budgeting and reporting.

Reporting

Most General Ledger based reports can be printed by Department (cost centre)
or type of Department (Classification).

The Report Settings allow you to run a consolidated report for the whole
company, or reports that focus on a segment of the company. These segments
include Departments and Classifications.
Departmental Accounts

Using Classificationswe can get a consolidated report by type Department. Here
we are looking at the total for Commercial projects.

Choosing Departmentdisplays a list of Departments, and we can select those
we want to report on. A separate report is generated for each Department that
is selected, with each report being pertinent to just that Department.

What are Departments?

A department is basically a further level of breakdown in an account (in
accounting parlance, a department is a subledger).

Departments are useful when the same income or expense codes are applicable
to more than one similar item. Without departments each item would need an
individual general ledger code, and potentially your chart of accounts could get
very large. With departments, the same general ledger code can be shared by
more than one item.

Departments can also be grouped for enquiry and reporting purposes by using
Classifications. In a vehicle fleet for example, some of the vehicles might be
diesel and some petrol. Some of the projects done by a builder might be
residential and some commercial. Using classifications, we can easily see how
the diesel fleet is performing compared to the petrol, or the residential side of
the business compared to the commerical.

Each department can also have its own set of budgets, and any of the budget
reports can report on actual and variance performance by department (e.g. a
specific vehicle), by classification (e.g. diesel vehicles), or consolidated for the
whole company.
Departmental Accounts

How to Use Departments

Departments

Departments

Consider using departments whenever you have several items that are
essentially the same (e.g. products, projects, staff, vehicles), and that you need
to track income or expenses individually for each one.

You need to create a Department for each item, and then put like Departments
into a Department Group—basically a container that collects the items together
(e.g. a group of projects). Every time you start a new project, you create a new
department and add it to the group, and when a project is complete, you
remove it from the group.

Departments are used to create sub-ledgers for accounts. You first define the
departments that you want to use, then group them into Department Groups.
Finally, by associating a department groupwith a set of accounts, you end up
with sub-ledgers for those accounts.

The Departments command in the Show menu displays a list of all the
departments set up for your system. If no departments exist, the list will be
empty.

You can of course have several groups. You might have a group of projects and a
group of vehicles. Some of the expenses that are incurred will be specific to a
vehicle (for example Insurance, Repairs and Maintenance), and some will be
specific to a project (for example Material Usage).

Adding a new Department

1. Choose Show>Departments

In your chart of accounts you will have a single code for each of the main
activities. You then identify which Department Group is appropriate for each of
the account codes. So you will assign the group Projectsto account Material
Usage, and the group Vehiclesto Vehicle Insuranceas well as Repairs and
Maintenance.

When you assign a Department Group to an account code MoneyWorks Gold
automatically creates a subledger for each department that is a member of that
group. Thus if there are four vehicles in our vehicles group, we would get four
subledgers in each of our vehicle insurance and vehicle repairs and maintenance
accounts. If we add more vehicles to the group, new subledgers are built for us
automatically.

When an account is departmentalised like this, you access individual subledgers
through a suffix on the general ledger code. Thus if we had a department code
of “RED” for the red Toyota, and a code of “320” for Vehicle Expenses, we would
use “320-RED” to identify Vehicle Expenses for the Red Toyota. The hyphen is
used to separate the general ledger code from the suffix.

The list of departments in your system will be displayed.

2. Choose Edit>New Department or press Ctrl-N/⌘-N

The Department entry window will be displayed.

3. Enter the department code into the Code field

This code is used to identify the department, and is appended to the
account code when transactions are entered.
Departmental Accounts

Departments

It may be up to 5 characters in length. Characters can be either
alphanumeric, and letters are automatically capitalised and spaces
converted to underscores. The characters “@”, “?” and “-” are not
permitted.

4. Enter a description for the department into the Description field

5.

If you have previously defined departmental classifications, assign the
classification to this department using the pop-up menu

A classification is an optional way of grouping departments together for
reporting purposes. You can add or change classificationsat any time.

6. Enter any details in the custom fields.

These are for your own use.

7.

If you want the department to be used as a heading in a subsummary
report, set the Heading Only checkbox.

You will not be able to use the department in transactions.

Assigning to a Group

If you have already created Departmental Groups, you can add the department
to the appropriate group at this point.

To add the department to a group:

8. Click the Add... button

9. Highlight the group(s) to which you want the department to belong

10. Click the Addbutton

The department will be added to the nominated groups.

If you have not already created Departmental Groups, departments can be
added to Groups when the groups are created or they can be assigned later.

11. Click OKor Nextto save the information

Modifying a Department

Any of the department information can be altered at any time—including the
code. If you do alter a departmental code, any transactions that use that
department will be updated (this may take some time).

To modify a department, double click it in the Department list.

The Add to Groups window will be displayed.

Note: You can only change a department, group, or classification code in single

user mode—.

Removing a department from a group

To remove a department from a group:

1. Double-click the department in the Department list
Departmental Accounts

The department entry window will open.

2. Highlight the group(s) in the department entry window and click Remove

A dialog box asks you to choose which of the other departments in the
group will receive the historic balances and any transactions for the
department being removed.

Department Groups

Department Groups

A Department Group is a collection of departments, and is used to associate the
member departments with accounts, thus creating sub-ledgers for the accounts.
Only department groups can be associated with accounts—not individual
departments.

A department can belong to any number of different groups. A group must
contain at least one department before it can be associated with an account.

Creating a Departmental Group

1. Choose Show>Department Groups

The list of department groups in your system will be displayed.

2. Choose Edit>New Group or press Ctrl-N/⌘-N

3. Click on the departmental code and click Transferto continue

The Department Group entry window will be displayed.

All accounts associated with the group from which the department has
been removed will have that subledger deleted, and any balances for the
removed subledger will be transferred to the subledger of the nominated
department.

All transactions, including posted transactions, that use the account-
department are changed to have the nominated department instead of the
removed one.

4. Click OKto accept these changes

3. Enter the group code into the Code field

Clicking Cancel will close the window without saving the changes.

Deleting a Department

Departments may only be deleted if they do not belong to a Department Group.
If the department that you wish to delete is a member of one or more
Department Groups, you must remove it from these first).

This code is used to identify the group and may be a maximum of 5
characters in length—characters can be alphanumeric—letters are
automatically capitalised and spaces are converted to underscores—the
“@” character is not permitted.

4. Enter a description for the group into the Description field
Departmental Accounts

Assigning Departments to the Group

Modifying a Group

Department Groups

If you have previously defined departments in your system, add departments to
the group at this point. If you have not already created Departments, groups can
be assigned to departments as they are created.

You can alter any information about a group simply by double-clicking the
Department Group in the Department Group list. You can add more
departments to the Group by using the Add button as described above.

To assign a department to a group:

5. Click the Add...button

Removing a Department from the Group

1. Highlight the department in the list of departments in the Group window

The Add to Group window will be displayed.

and click Remove

A dialog box asks you to choose which of the other departments in the
group will receive the historic balances and any transactions for the
department being removed.

6. Highlight the departments that you want to add to the group and then

click the Addbutton

2. Click on the department code and then click Transfer

Once you have clicked the Add button you will not be able to change the
code of the group and the Cancel button is dimmed. If you find that you
need to change the code of the group, accept the record as is and modify it
later. See the following section for details.

7. Click the OKor Nextbutton to save the changes

All accounts associated with the group from which the department has
been removed will have that sub-ledger deleted, and any balances will be
transferred to the nominated department.

All transactions (including posted) that use the account-department are
changed to have the nominated department instead of the removed one.

Clicking Cancel leaves the department in the group.

3. Click OKto accept these changes
Departmental Accounts

Associating Departments with Accounts

Clicking Cancelwill close the window without saving the changes.

you to choose:

Deleting a Department Group

Department Groups may only be deleted if they have not been assigned to an
account. If a Group is assigned to an account, you will be warned when you
attempt to delete the Group, and will need to go into the account(s) concerned
and change the group.

Associating Departments with Accounts

Departments cannot directly be associated with general ledger accounts.
Instead you associate a Department Groupwith the account—the account is
then automatically split into separate accounts (subledgers), one for each group.
We call this departmentalising an account.

To Departmentalise an Account

When you departmentalise an account, it is split into a set of
subledgers, one subledger for each department in the group.
As the account itself no longer exists as a single entity, its
balances are transferred to one of the subledgers. The change
will be recorded in the Log File.

To assign the new group to the account:

1. Double-click the account to be changed in the Accounts

list

The Account entry window is displayed.

To Departmentalise
an account, choose
the Group from the
Dept Group pop-up
menu.

4. Select the department to which to transfer existing balances and

transaction

All transactions, including posted transactions, that use the account are
changed to reflect this, so that detail lines for the account will now include
the nominated department code. This may take some time.

If necessary, you can use a journal to redistribute the balances for the
departments in the new group once the changeover is completed.
Alternatively you may want to have a special “general” department in the
group whose sole function is to take on the historic balances.

Removing a Group Assigned to an Account

To “undepartmentalise” a departmentalised account, you disassociate the
account’s department group from the account. This causes all the subledgers in
the account to be consolidated into the account itself.

All transactions that use the account, including posted transactions, will be
modified to reflect the fact that the account no longer has departments. The
change will also be recorded in the Log File.

2. Choose the Group from the Dept Grouppop-up menu

To Undepartmentalise an Account:

3. Click OKin the Account window to make the change (or Cancelto discard)

1. Double-click the account that you want to change in the Accounts list

MoneyWorks Gold splits the account into sub-ledgers, one for each
department in the chosen department group. Because you are splitting an
existing account, MoneyWorks will need to know into which of the new
subledgers to place any existing balances and transactions. It will prompt

The Account entry window is displayed.

2. Choose Nonefrom the Dept Grouppop-up menu
Departmental Accounts

You will be asked for confirmation.

3. Click Yesto remove the group

4. Click OKto save this change to the account

Historic balances from the sub-ledgers for each of the departments in the group
are consolidated into a single account code. The department code suffixes will
be removed from the detail lines of any transactions. This process may take
some time.

Changing the Dept Group of an Account

2. Choose Edit>New Classification or press Ctrl-N/⌘-N

The Classification entry window will be displayed.

Department Classifications

Changing an account from one Departmental Group to another is a two step
operation.

3. Type the classification code into the Codefield

1. Modify the account to remove the existing department group as

previously explained

This may be a maximum of 5 characters in length—characters can be
alphanumeric—letters are automatically capitalised and spaces are
converted to underscores—the “@” character is not permitted.

2. Modify the account again and assign it the new department, as explained

above

4. Type a description for the classification into the Descriptionfield

Department Classifications

5. Click the OKor Nextbutton

Classifications are to departments what the pre-defined categories are to
accounts—they are used to group related departments together for reporting
purposes. A department can be associated with one classification, and this can
be altered at any time.

The Classifications command in the Show menu displays a list of all the
departmental classifications set up for your system. If none exist, the list will be
empty.

Adding a New Classification

1. Choose Show>Classifications

The list of classifications in your system will be displayed.

Classifications can only be assigned to Departments in the Department entry
window — see Adding a new Department.

Once assigned the codes and descriptions of the departments assigned to a
particular classification appear in the scrolling list at the bottom-left of the
Classification entry screen.

Modifying a Classification: You can change the details of a Classification at any
time by double-clicking on its record in the Classification list window.

Deleting a Classification: A Classification can only be deleted if no Departments

are assigned to it. You will be warned if you attempt to delete a
classification that has departments assigned to it—you need to change the
Classification for the departments concerned, and then delete the
classification
Departmental Accounts

Using Products with Departments

The product account codes within MoneyWorks can be set up so that the code
in the Salespersonfield of each transaction is automatically appended as a
department to the control account for the product. Thus if you have
departmentalised your sales accounts by salesperson (perhaps using their
initials as the department code), you can enter the initials into the Salesperson
field and these will be appended where appropriate to the base sales account.

To do this, use the Append Salespersoncheck box in the Control Accounts
section of the Product entry screen. Then, whenever you create a product
transaction, you need only to record the salesperson’s initials (the department
code) into the Salesperson field and the transaction will be “charged” to the
correct subledgers.

Setting Append Salesperson

You set the Append Salespersonoption in the Product file for either (or both of)
the income account when selling and the expense account when buying.

1. Choose Show>Products or press Ctrl-3/⌘-3 to show the Product list

2.

If the product already exists, double click on it, otherwise create the
product in the normal manner

The product entry screen will be displayed.

3. Specify whether you will buy, sell and/or stock the item

This determines which control accounts are required.

4. Set the Append Salespersonoption for the account by clicking on the

check box

Using Products with Departments

The cursor will move to the account field

5. Type in the account code and press tab

The account must be departmentalised, but do not enter a department at
this point (e.g. enter “1000”, not “1000-DEPT”).

The Appendbutton will reset itself if the account is not departmentalised.

If you enter the code for a departmentalised account without having set the
Append option, the account choices window will open because it wants a
complete code with department. Click Cancel and then set the Append option,
or choose the account-dept combination from this.

Invalid Salesperson Entries

The Salesperson field in a transaction will affect any transaction that involves a
product that has a control account set up with the Append option. Whenever
one of these is encountered, MoneyWorks will append the code in the field onto
the end of the account in the transaction. If the resulting code is not a valid
account-department combination, an error message will be displayed:

Clicking Try Againallows you to rekey the product.

Clicking Choosewill display a choices list of valid departments for the product’s
control account.

Note: The name of the Salesperson field can be changed in the Document

Preferences;

You will not be able to see the Salesperson field on the transaction entry
screen if the Field view is set to Simple.
