# MoneyWorks API, Payments & Expressions - Manual Extract

> Source: MoneyWorks User Guide (pages 97-99, 615-622, 641, 695, 727, 779)
> Extracted: 2025-11-26

## 1. REST API Reference

### Base URL Structure
```
http://server_address:port/REST/Document_Name/command
Example: http://myserver:6710/REST/Acme%20Widgets/export/...
```

### Authentication
- **Method**: Basic Authentication
- **Credentials**: Username and password for the specific document

### Data Formats
| Direction | Format |
|-----------|--------|
| Export | XML, HTML, Text, JSON (via custom reports) |
| Import | **XML only** |

### Available Endpoints

| Command | Description | Parameters |
| :--- | :--- | :--- |
| **export** | Retrieves data from a table | `table=<tablename>`, `search=<expression>`, `format=xml`, `sort=<field>` |
| **import** | Submits new records | Body: XML data. Returns: Success or error list |
| **post** | Posts a transaction | `seqnum=<sequence_number>` |
| **doform** | Generates PDF of form | `form=<form_name>`, `search=<expression>` |
| **image** | Get/update attached image | `ident=<product_code>` |
| **evaluate** | Evaluates MW expression | `expr=<expression>` |

---

## 2. Payment Linking

### Payments Table Structure

**Table Name**: `Payments` (Internal join table)
**Relationship**: Many-to-Many

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **CashTrans** | Number | SequenceNumber of Payment (CP/CPC) or Receipt (CR/CRD) |
| **InvoiceID** | Number | SequenceNumber of Invoice (DI/CI) being paid |
| **Amount** | Number | Amount allocated to this invoice |
| **Date** | Date | Date of payment/receipt |

### Key Behaviors

- **Partial Payments**: Creates Payments record where Amount < Invoice Total. Invoice remains "Open"
- **AmtPaid Field**: **Calculated** - sums all related Payments records
- **Overpayments**: Surplus credits to debtor's account (stored in Name record balances)

---

## 3. Batch Operations

| Command | Purpose | Creates | Effect |
| :--- | :--- | :--- | :--- |
| **Batch Debtor Receipts** | Process incoming customer payments | Individual `CR` transactions | Posts immediately, updates Payments table, DR Bank CR Receivables |
| **Batch Creditor Payments** | "Cheque Run" to suppliers | Individual `CP` transactions | Posts immediately, updates Payments table, CR Bank DR Payables |

---

## 4. Reversal / Cancellation

| Aspect | Details |
| :--- | :--- |
| **Command** | `Command > Adjustment > Cancel Transaction` |
| **Shortcut** | `Cmd+-` (hyphen) |
| **Original Transaction** | Status changes to Cancelled (flagged). Remains in database for audit. |
| **New Transaction** | Duplicate with **negated amounts**. Suffix `-` added to OurRef (e.g., `INV1001` → `INV1001-`). Auto-posted. |
| **Partial Reversal** | **NOT POSSIBLE**. Must cancel entire transaction, then re-enter correct amount. |

---

## 5. Complete Keyboard Shortcuts

### Navigation / Lists
| Win | Mac | Function |
| :--- | :--- | :--- |
| Ctrl-1 | Cmd-1 | Accounts List |
| Ctrl-2 | Cmd-2 | Names List |
| Ctrl-3 | Cmd-3 | Items/Products List |
| Ctrl-4 | Cmd-4 | Jobs List |
| Ctrl-5 | Cmd-5 | Job Sheet Items |
| Ctrl-6 | Cmd-6 | Budgets |
| Ctrl-7 | Cmd-7 | Product Sales Enquiry |
| Ctrl-8 | Cmd-8 | Customer Sales Enquiry |
| Ctrl-9 | Cmd-9 | Stock Enquiry |
| **Ctrl-0** | **Cmd-0** | **Navigator** |
| Ctrl-T | Cmd-T | Transactions List |

### General
| Win | Mac | Function |
| :--- | :--- | :--- |
| Ctrl-N | Cmd-N | New Record/Transaction |
| Ctrl-O | Cmd-O | Open Document |
| Ctrl-P | Cmd-P | Print |
| Ctrl-S | Cmd-S | Save |
| Ctrl-W | Cmd-W | Close Window |
| Ctrl-Q | Cmd-Q | Quit |
| Ctrl-Shift-S | Cmd-Shift-S | Save Copy As / Backup |

### Searching
| Win | Mac | Function |
| :--- | :--- | :--- |
| Ctrl-F | Cmd-F | Find (Advanced) |
| Ctrl-G | Cmd-G | Find Next |
| Ctrl-J | Cmd-J | Find All (Show All) |
| Ctrl-= | Cmd-= | Sum Selection |
| Ctrl-A | Cmd-A | Select All |

### Transaction Processing
| Win | Mac | Function |
| :--- | :--- | :--- |
| **Ctrl-K** | **Cmd-K** | **Post Transactions** |
| **Ctrl--** | **Cmd--** | **Cancel Transaction** |
| Ctrl-[ | Cmd-[ | Print Form |
| Ctrl-\ | Cmd-\ | Bill Job |
| Ctrl-R | Cmd-R | Batch Debtor Receipts |
| Ctrl-Y | Cmd-Y | Batch Creditor Payments |
| Shift-Ctrl-N | Opt-Cmd-N | New Transaction (from anywhere) |

---

## 6. MWScript / Expressions

### Basic Syntax

| Data Type | Syntax | Example |
| :--- | :--- | :--- |
| Text | Double quotes | `NameCode = "ACME"` |
| Numbers | Raw digits | `Gross > 1000.00` |
| Dates | Single quotes | `TransDate >= '01/04/23'` |
| Booleans | 1/0 | `Hold = 1` |

### Operators

| Symbol | Function | Example |
| :--- | :--- | :--- |
| `=` | Equals | `Type = "DI"` |
| `<>` or `!=` | Not Equals | `Status <> "P"` |
| `>`, `<`, `>=`, `<=` | Comparison | `Gross > 500` |
| `&` or `AND` | Logical AND | `Type="DI" & Gross > 0` |
| `\|` or `OR` | Logical OR | `Type="DI" \| Type="CI"` |
| `!` or `NOT` | Logical NOT | `!Hold` |
| `( )` | Grouping | `(Gross > 100 OR Tax > 10) AND Type="DI"` |

### Wildcards

| Symbol | Function | Example | Matches |
| :--- | :--- | :--- | :--- |
| `@` | Starts With | `NameCode = "ABC@"` | ABCD, ABCE |
| `@...@` | Contains | `Description = "@service@"` | Any containing "service" |
| `?` | Single Char | `Code = "A?C"` | ABC, ADC, AXC |

### Relational Searches

Search related tables with: `[Table: Expression]`

| Goal | Formula |
| :--- | :--- |
| Find by Detail Line | `[Detail: StockCode="WIDGET"]` |
| Find by Customer Location | `[Name: City="Auckland"]` |
| Find by Job | `[Detail: JobCode="JOB101"]` |

**Chained**: `[Name: [Transaction: [Detail: StockCode="Product X"]]]`
**Negated**: `[Transaction: [Detail: StockCode="Product X"]][!]` (Never bought)

### Meta Keywords

| Keyword | Description |
| :--- | :--- |
| `*highlighted` | Currently selected records |
| `*found` | Current found set |
| `*foundorall` | Found set or all if no search active |

### Common Functions

| Function | Description | Example |
| :--- | :--- | :--- |
| `Left(text, n)` | First n chars | `Left(Description, 5)` |
| `Trim(text)` | Remove whitespace | `Trim(Name)` |
| `If(cond, t, f)` | Conditional | `If(Gross>0, "Sale", "Refund")` |
| `Lookup(code, field)` | Lookup related | `Lookup(NameCode, "Name.Phone")` |
| `Sum(val1, ...)` | Sum values | `Sum(Detail.Net)` |
| `Today()` | Current date | `TransDate = Today()` |

---

## 7. URL Encoding for REST API

### Two Layers of Escaping
1. **MoneyWorks Expression Escaping**
2. **URL Encoding**

### String Delimiters

| Delimiter | Use Case |
| :--- | :--- |
| `"` (double quotes) | Standard |
| `` ` `` (backticks) | When value contains quotes |

### Escape Sequences

| Character | Escape |
| :--- | :--- |
| `"` | `\"` |
| `\` | `\\` |
| `` ` `` | `` \` `` |

### Esc() Function
For dynamic strings in MWScript:
```
search = "Name=" + char(34) + Esc(user_input) + char(34)
```

### URL Encoding Reference

| Char | Encoded |
| :--- | :--- |
| Space | `%20` |
| `"` | `%22` |
| `` ` `` | `%60` |
| `=` | `%3D` |
| `\` | `%5C` |
| `'` | `%27` |

### Examples

**Simple**: `NameCode="ACME"` → `NameCode%3D%22ACME%22`

**With Spaces**: `Name="Acme Widgets"` → `Name%3D%22Acme%20Widgets%22`

**With Quotes (backticks)**: `Description=`6" Pipe`` → `Description%3D%606%22%20Pipe%60`

**Date**: `TransDate='20230131'` → `TransDate%3D%2720230131%27`

---

## Key Insights

### Shortcuts We Were Missing
- **Cmd+0** = Navigator (not Cmd+5!)
- **Cmd+5** = Job Sheet Items
- **Cmd+K** = Post Transactions
- **Cmd+-** = Cancel/Reverse Transaction
- **Cmd+R** = Batch Debtor Receipts
- **Cmd+Y** = Batch Creditor Payments

### API Import Limitation
- **XML only** for import via REST
- No TSV/JSON import through REST

### Payments Architecture
- Separate join table, not embedded in Transaction
- AmtPaid is **calculated**, not stored
- Enables partial payments and multi-invoice allocation

### Reversal Creates New Transaction
- Original stays (flagged as cancelled)
- New transaction with negated amounts
- OurRef gets `-` suffix
- Cannot partial reverse
