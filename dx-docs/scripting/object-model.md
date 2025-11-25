# MoneyWorks Object Model & Context

Understanding how MoneyWorks handles data context is the single most important concept in MWScript. Unlike SQL or standard ORMs, MoneyWorks uses a concept of "Current Selection" and "Current Record".

## 1. The "Current Record" Concept
At any given moment, the script has a "focus" on a specific record for each table.
*   **Context**: When a script runs on a form (e.g., a Validation handler), the "Current Record" is the record being edited.
*   **Access**: You access fields directly using `TableName.FieldName`.

```moneyworks
// If running on a Transaction form
Alert("Current Gross is: " + Transaction.Gross)
```

## 2. Iterating Detail Lines
Transactions in MoneyWorks are Header/Detail structures. To process the lines (Details) of the *current* transaction, you use the `Foreach` loop with the `Detail` keyword.

```moneyworks
// Calculate total weight of all items in current invoice
Let totalWeight = 0
Foreach Detail
    // Inside this loop, 'Detail' refers to the current line
    Let totalWeight = totalWeight + (Detail.StockQty * Detail.UnitWeight)
EndFor
Alert("Total Weight: " + totalWeight)
```

> **Important**: You cannot use `FindRec` on the Detail table directly to find lines of the *current* unposted transaction because they haven't been saved to the DB yet. You *must* use `Foreach Detail`.

## 3. Finding and Switching Context (`FindRec`)
When you use `FindRec`, you are effectively moving the "cursor" for that table to a new record.

```moneyworks
// Initially, 'Name' might point to the Customer of the current invoice
Alert("Customer: " + Name.Code) 

// Look up a different name
If (FindRec("Name", "Code='SUPPLIER-01'"))
    // Now 'Name' points to SUPPLIER-01
    Alert("Found Supplier: " + Name.email)
EndIf

// Warning: 'Name' still points to SUPPLIER-01 here! 
// The original context is lost unless you save/restore it.
```

### Saving/Restoring Context
If you need to look something up without losing your place, use a `Save` block (if available in your version) or manually track it. However, MWScript is often linear.

## 4. Selections (Lists of Records)
A **Selection** is a temporary list of records found by a search. You can iterate through them.

```moneyworks
// 1. Create a selection of high-value invoices
Let myInvoices = CreateSelection("Transaction", "Type='DII' and Gross > 1000")

// 2. Iterate through them
Foreach Transaction in myInvoices
    // Now 'Transaction' points to the record in the loop
    Replace("Transaction.User1", "High Value", true) 
    // The 'true' parameter saves the record back to DB
EndFor
```

## 5. The "Replace" Function (Updating Records)
To update a record in the database, you don't just assign a value (`Transaction.User1 = "foo"`). You must use the `Replace` command/function.

*   **Syntax**: `Replace(field, value, [save?])`
*   **Field**: String name of the field ("Transaction.User1").
*   **Value**: The new value.
*   **Save?**: `true` to commit immediately, `false` to just update memory (e.g. if you are going to save later).

```moneyworks
// Update the current customer's email
FindRec("Name", "Code='CUST01'")
Replace("Name.email", "new@example.com", true)
```

## 6. Global vs Local Variables
*   **Local (`Let`)**: `Let x = 1`
    *   Scope: Only visible inside the current Handler.
    *   Lifetime: Dies when Handler ends.
*   **Global (`Global`)**: `Global gUserCount`
    *   Scope: Visible to all scripts in the session.
    *   Lifetime: Persists until MoneyWorks is closed or user logs out.

## Summary Checklist
1.  **Detail Loop**: Always use `Foreach Detail` to read invoice lines.
2.  **Context**: `FindRec` changes the global pointer for that table.
3.  **Updating**: Use `Replace()` to write changes to the DB.
