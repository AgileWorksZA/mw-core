# MoneyWorks Entity Guide: Advanced Storage (User2 & Allocations)

This guide covers specialized tables used for persistent storage and automation rules.

## 1. User2 File (Advanced Persistence)
The `User` table is a simple Key/Value store. The **User2** table is its "Pro" sibling, designed for developers building complex plugins.

### Key Differences vs 'User' Table
*   **DevKey**: A namespace integer. You must apply to Cognito Software to get a reserved `DevKey` range if distributing your plugin. Prevents key collisions.
*   **Typed Fields**: Instead of one giant text blob, `User2` has `Int1`..`4`, `Float1`..`4`, `Date1`..`4`, `Text1`..`4`.
*   **Indexing**: Searching `User2` by integer or date is much faster than parsing the `User` text blob.

### Schema
| Field | Type | Description |
|-------|------|-------------|
| `DevKey` | Num | Developer ID (Namespace). |
| `Key` | Text | Unique Key within DevKey. |
| `Int1`..`4` | Num | Integer storage. |
| `Float1`..`4` | Num | Decimal storage. |
| `Date1`..`4` | Date | Date storage. |
| `Text1`..`4` | Text | Short text (255 chars). |
| `Text` | Text | Long text (1020 chars). |

---

## 2. Allocation File (AutoSplit)
The **Allocation** table (internal name `AutoSplit`) stores the rules used by the "Auto-Allocate" command and Bank Import rules.

### Usage
*   **Bank Feeds**: "If description contains 'Uber', code to Travel".
*   **Recurrent Splits**: "Split Rent 50/50 between Dept A and Dept B".

### Schema
| Field | Type | Description |
|-------|------|-------------|
| `MatchFunction` | Text | The text/expression to match (e.g. `Left(Desc,4)="Uber"`). |
| `SplitAcct1`..`4` | Text | GL Accounts to split to. |
| `SplitAmount1`..`4`| Num | Amount/Percentage to allocate. |
| `Priority` | Num | Order of execution. |

### Developer Tip
If you are building a custom bank feed or expense app, you can read this table to apply the user's existing coding rules to your own data before sending it to MoneyWorks.
