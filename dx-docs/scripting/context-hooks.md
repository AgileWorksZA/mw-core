# MoneyWorks Context Hooks

Hooks determine *when* your script runs. A script without a hook is just a library of dormant functions.

## 1. Field Validation Hooks
These handlers trigger when a user interacts with a specific field on a form.
*   **Naming Convention**: `Validate_TableName_FieldName`
*   **Trigger**: When the user tabs out of the field or saves the record.
*   **Return Value**: `true` (accept change) or `false` (reject change, keep focus in field).

### Example
```moneyworks
Handle Validate_Transaction_Description
   If (Length(Transaction.Description) < 5)
      Alert("Description must be at least 5 chars.")
      Return false
   EndIf
   Return true
EndHandler
```

## 2. Record Validation Hooks (The "Save" Hook)
These trigger when the user attempts to Save (OK) a record.
*   **Naming Convention**: `Validate_TableName` (e.g., `Validate_Transaction`)
*   **Trigger**: Clicking OK/Save button.
*   **Return Value**: `true` (allow save) or `false` (block save).

### Example
```moneyworks
Handle Validate_Transaction
   If (Transaction.Gross > 10000 AND Transaction.ApprovedBy1 = "")
      Alert("Transactions over 10k require approval.")
      Return false
   EndIf
   Return true
EndHandler
```

## 3. The "Before Post" Hook
Specific to Transactions. Runs immediately before the transaction is committed to the ledger (Posted).
*   **Naming Convention**: `BeforePost`
*   **Trigger**: User clicks "Post" or runs a batch post.
*   **Context**: The `Transaction` record is available.
*   **Return Value**: `true` (allow post) or `false` (block post).

> **Critical Note**: This is the best place for financial compliance rules (e.g., preventing posting to locked periods).

## 4. Parameter Handler (Reports)
Used in Custom Reports to prompt the user for input before the report runs.
*   **Naming Convention**: `Report_Parameters`
*   **Usage**: Define `control` variables to create UI widgets.

```moneyworks
Handle Report_Parameters
   Control start_date type="date" label="Start Date"
   Control end_date type="date" label="End Date"
EndHandler
```

## 5. Web/API Hooks (REST)
Used to expose custom logic via the Datacentre REST API.
*   **Naming Convention**: `On_Request_CommandName`
*   **Trigger**: An HTTP request to `/custom/CommandName`.
*   **Usage**: Read `request` variables, perform logic, return XML/JSON.

```moneyworks
Handle On_Request_Hello
   Write('<response>Hello World</response>')
EndHandler
```
