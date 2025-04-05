# System Labels Feature

## 2 Methods (routes)

### System Labels Post Route

This route is used to cache all the display labels for all MoneyWorks tables in the MoneyWorks API via the evaluate endpoint, similar to company-information.

Each table will be cached in a local file in english, then the following languages will be added using the `translate` package:

- French
- German
- Spanish
- Italian
- Portuguese
- Dutch
- Swedish
- Danish
- Norwegian
- Finnish
- Russian
- Afrikaans
- Arabic

### System Labels Get Route

This route is used to retrieve the cached labels for a specific table for a specific language, english by default.

The cache is read locally from `cache/TableName-labels-lang.json`.

## Purpose

Cache all the display labels for all MoneyWorks tables in the MoneyWorks API via the evaluate endpoint, similar to company-information.

Loop through all the fields of all the tables and cache the display labels for each field in a local file in english.

Hint: Each table name is stored in a constant called `tableNames` in `src/types/constants.ts` and each table has a field
constant called `TableNameFields` respectively in `src/types/interface/tables/TableName.ts`.

All fields' values are read via the function `FieldLabel` in the expression passed to `api.evaluate`. Concat 30 fields at a time, similar to company-information.

There are exceptions to the fields in the next section.

## Field Values for MoneyWorks `FieldLabel()` Function

The `FieldLabel()` function retrieves user-customized labels for specific fields or enumerated values, as defined in **Edit > Document Preferences > Fields**.

Here are the types of `fieldname` parameters you can use:

### 1. User-Defined Fields

These are generic fields available in various tables that users can rename.

*   **Transaction:**
    *   `Transaction.User1`
    *   `Transaction.User2`
    *   `Transaction.User3`
    *   `Transaction.User4`
    *   `Transaction.User5`
    *   `Transaction.User6`
    *   `Transaction.User7`
    *   `Transaction.User8`
*   **Detail (Transaction Lines):**
    *   `Detail.User1`
    *   `Detail.User2`
    *   `Detail.User3`
    *   `Detail.User4`
    *   `Detail.User5`
    *   `Detail.User6`
    *   `Detail.User7`
    *   `Detail.User8`
*   **Name (Customers/Suppliers):**
    *   `Name.User1`
    *   `Name.User2`
    *   `Name.User3`
    *   `Name.User4`
    *   `Name.User5`
    *   `Name.User6`
    *   `Name.User7`
    *   `Name.User8`
*   **Product (Items):**
    *   `Product.User1`
    *   `Product.User2`
    *   `Product.User3`
    *   `Product.User4`
    *   `Product.User5`
    *   `Product.User6`
    *   `Product.User7`
    *   `Product.User8`
*   **Job:**
    *   `Job.User1`
    *   `Job.User2`
    *   `Job.User3`
    *   `Job.User4`
    *   `Job.User5`
    *   `Job.User6`
    *   `Job.User7`
    *   `Job.User8`
*   **JobSheet (Job Sheet Items):**
    *   `JobSheet.UserNum`
    *   `JobSheet.UserText`
*   **Account:**
    *   `Account.UserNum`
    *   `Account.UserText`
*   **Asset:**
    *   `Asset.UserNum`
    *   `Asset.UserText`
*   **AssetCat (Asset Categories):**
    *   `AssetCat.Custom`
*   **Department:**
    *   `Department.Custom1`
    *   `Department.Custom2`
*   **OffLedger:**
    *   `OffLedger.UserNum`
    *   `OffLedger.UserText`

### 2. Salesperson Field

*   `Transaction.Salesperson`

### 3. Payment Methods (Enumerated)

*Requires the second `enumeration` parameter (numeric index 0-7).*
*   `Transaction.PaymentMethod`
    *   *Example:* `FieldLabel("Transaction.PaymentMethod", 3)`

### 4. Contact Roles (Enumerated - Bitmask)

*Requires the second `enumeration` parameter (numeric bitmask).*
*   `Contacts.Role`
    *   *Example:* `FieldLabel("Contacts.Role", 1)` (gets label for first role)
    *   *Example:* `FieldLabel("Contacts.Role", 5)` (gets comma-separated labels for roles 1 and 3)

### 5. Colours (Enumerated)

*Requires the second `enumeration` parameter (numeric index 0-7).*
*   `Transaction.Colour`
*   `Name.Colour`
*   `Product.Colour`
*   `Job.Colour`
*   `Account.Colour`
*   `Asset.Colour`
    *   *Example:* `FieldLabel("Name.Colour", 2)`

**Important Notes:**

*   **Table Context Matters:** For enumerated types (`Colour`, `PaymentMethod`, `Role`), the label returned depends on the table prefix (e.g., `Name.Colour` vs `Transaction.Colour`).
*   **Case Sensitivity:** Use the exact field names as listed (likely case-sensitive).
*   **No Custom Label:** If a user hasn't set a custom label, `FieldLabel()` returns the default internal field name (e.g., "User1").
*   **Enumeration Parameter Required:** Remember to supply the second numeric parameter for enumerated types.
