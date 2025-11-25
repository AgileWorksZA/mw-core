# MoneyWorks Function Reference

This guide categorizes the essential functions for MoneyWorks development, including database manipulation, financial calculations, and system interaction.

## 1. Database & Record Functions

| Function | Syntax | Description |
|----------|--------|-------------|
| **FindRec** | `FindRec(table, search)` | Finds the *first* record matching the search expression. Returns `true` if found. Changing the "Current Record" for that table. |
| **NextRec** | `NextRec(table)` | Moves to the next record in the current selection or table order. |
| **CreateSelection** | `CreateSelection(table, search)` | Returns a `Selection` object (list of records) matching the query. |
| **IntersectSelection** | `IntersectSelection(sel1, sel2)` | Returns records present in both selections. |
| **SelectionCount** | `SelectionCount(sel)` | Returns number of records in a selection. |
| **SumDetail** | `SumDetail(expr)` | Iterates over detail lines of the *current* transaction context, summing the expression. |
| **Lookup** | `Lookup(field, table, keyField, keyVal)` | Quick readonly fetch. "Select `field` from `table` where `keyField` = `keyVal`". |

### Example: Lookup vs FindRec
Use `Lookup` when you just need one value and don't want to change the record context.
```moneyworks
// Safe: Does not change the 'Name' cursor
Let email = Lookup("email", "Name", "Code", "CUST01")

// Unsafe: Changes 'Name' cursor to CUST01
If (FindRec("Name", "Code='CUST01'"))
   Let email = Name.email
EndIf
```

## 2. Data Modification (Write Operations)

| Function | Syntax | Description |
|----------|--------|-------------|
| **Replace** | `Replace(fieldStr, val, save)` | Updates a field in the current record. `save=true` commits to DB. |
| **Insert** | `Insert(table)` | Creates a new empty record buffer for `table`. |
| **Save** | `Save(table)` | Commits the current record buffer to the database. |
| **Delete** | `Delete(table)` | Deletes the current record from the database. |
| **Post** | `Post(trans)` | Posts (finalizes) a specific Transaction record. |

### Example: Creating a Record
```moneyworks
Insert("Name")
Replace("Name.Code", "NEWGUY", false)
Replace("Name.Name", "New Guy Inc", false)
Replace("Name.email", "hello@newguy.com", false)
If (Save("Name"))
   Alert("Created!")
Else
   Alert("Error: " + GetLastError())
EndIf
```

## 3. Financial & Ledger Functions

| Function | Syntax | Description |
|----------|--------|-------------|
| **GetBalance** | `GetBalance(acct, date)` | Returns the GL balance of `acct` as of `date`. |
| **GetMovement** | `GetMovement(acct, period)` | Returns the net movement in `acct` for `period` (e.g. `202301`). |
| **ExchangeRate** | `ExchangeRate(curr, date)` | Returns the exchange rate for currency `curr` on `date`. |
| **TaxRate** | `TaxRate(code, date)` | Returns the tax percentage for `code` on `date`. |

## 4. User Interface

| Function | Syntax | Description |
|----------|--------|-------------|
| **Alert** | `Alert(text)` | Displays a modal dialog with OK button. |
| **Ask** | `Ask(prompt, default)` | Prompts user for text input. |
| **Confirm** | `Confirm(text)` | Asks user Yes/No. Returns `true` for Yes. |
| **Select** | `Select(list, title)` | Shows a popup list for user to choose one item. |
| **Progress** | `Progress(percent, msg)` | Updates the progress bar (0-100). |

## 5. String Manipulation

| Function | Syntax | Description |
|----------|--------|-------------|
| **Left** | `Left(text, n)` | First `n` characters. |
| **Right** | `Right(text, n)` | Last `n` characters. |
| **Mid** | `Mid(text, start, len)` | Substring extraction. |
| **Length** | `Length(text)` | Character count. |
| **Trim** | `Trim(text)` | Removes whitespace. |
| **Upperc** | `Upperc(text)` | To Uppercase. |
| **Lowerc** | `Lowerc(text)` | To Lowercase. |
| **Position** | `Position(sub, text)` | Finds index of substring (1-based). 0 if not found. |
| **Replace** | `Replace(text, find, sub)` | **String replace** (Note: distinct from DB `Replace`). |

## 6. Date & Time

| Function | Syntax | Description |
|----------|--------|-------------|
| **Today** | `Today()` | Current system date. |
| **Time** | `Time()` | Current system time. |
| **Date** | `Date(d, m, y)` | Constructs a date. |
| **Day**, **Month**, **Year** | `Day(d)`... | Extracts component. |
| **Age** | `Age(date, asAt)` | Returns days elapsed between dates. |

## 7. System & Networking

| Function | Syntax | Description |
|----------|--------|-------------|
| **URLPost** | `URLPost(url, data, ...)` | Sends HTTP POST request (if privileges allow). |
| **URLGet** | `URLGet(url)` | Sends HTTP GET request. |
| **Log** | `Log(text)` | Writes to the system log (Datacentre) or console. |
| **Env** | `Env(varName)` | Reads environment variable (or special MW vars). |
| **Command** | `Command(cmd)` | Executes a CLI command (Localhost only, restricted). |

## 8. Loop Control

| Keyword | Syntax | Description |
|---------|--------|-------------|
| **Foreach** | `Foreach Rec in Selection` | Iterates through a selection. |
| **For** | `For i = 1 to 10` | Standard counter loop. |
| **While** | `While (condition)` | Standard while loop. |
| **Break** | `Break` | Exits the current loop. |

