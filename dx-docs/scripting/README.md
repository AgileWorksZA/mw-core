# MoneyWorks Scripting Guide: Core Concepts

## Overview
MoneyWorks scripting (MWScript) is a powerful tool for automating business logic, enforcing validation rules, and creating custom workflows. Scripts run *inside* the MoneyWorks application context.

## 1. Where Scripts Run (Context Hooks)
Scripts are not standalone programs; they attach to specific "hooks" in the MoneyWorks workflow.

### User Interface Hooks
*   **Validation Handler**: Runs when a user exits a field or saves a record. Used to enforce business rules (e.g., "PO Number required for Acme Corp").
*   **Button Handler**: Runs when a user clicks a script button on a form.
*   **Before Post**: Runs immediately before a transaction is posted. Last line of defense for data integrity.

### System Hooks
*   **Import/Export**: Scripts can transform data during import or export operations.
*   **Scheduled Scripts**: Run at specific times (requires Datacentre).
*   **Rest API**: You can expose script handlers as custom API endpoints.

## 2. The Language
MWScript is a functional-like language.
*   **Case Insensitive**: `Alert()` is same as `alert()`.
*   **Types**: Text, Number, Date, Selection (List).
*   **Variables**:
    *   `Global`: Persist for the session.
    *   `Local`: Exist only within the handler.
    *   `Let`: Defines a variable (e.g., `Let myVar = 10`).

## 3. Accessing Data
You can read data from the current record context or look up data from other tables.

*   **Current Record**: `Transaction.Gross` accesses the Gross field of the transaction currently on screen.
*   **Lookups**: `FindRec(table, searchExpr)` allows you to fetch related data.
    *   *Example*: `FindRec('Names', 'Code="ACME"')`

## 4. Key Limitations
*   **UI Blocking**: Most scripts run synchronously and block the UI. Keep them fast.
*   **No External Access**: Scripts generally cannot access the filesystem or internet directly (except via specific restricted functions like `URLPost` if enabled).

---

## Hello World Example
A simple validation script that ensures a description is entered.

```moneyworks
Handle Validate_Description
   If (Length(Transaction.Description) = 0)
      Alert("You must enter a description!")
      Return false
   EndIf
   Return true
EndHandler
```
