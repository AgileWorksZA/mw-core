# MoneyWorks Entity Guide: Login (Users & Security)

## Architectural Overview
The **Login** entity stores the actual user accounts that can authenticate into the MoneyWorks file. It manages credentials, roles, and granular privileges.

> **Distinction**: Do not confuse with the `User` table (generic key-value storage). The `Login` table is for Authentication (AuthN) and Authorization (AuthZ).

### Critical Concepts

#### 1. Privileges String
Privileges are not stored as individual boolean fields. They are stored in a **Privileges** string (65 chars), which is an encoded map of what the user can do (e.g., "Can Post", "Can Sign Checks").
*   *Access*: You rarely parse this string directly. You use the `Allowed()` function in scripts to test permissions.

#### 2. Role-Based Access
Users can be assigned a `Role` (e.g., "ADM", "ACC"). This simplifies privilege management by inheriting defaults, though individual overrides are possible.

#### 3. Security Levels
Every user has a numeric `SecurityLevel` (0-10). This is used to gate access to:
*   **Reports**: "Level 5 required".
*   **Forms**: "Level 9 required".
*   **Signing**: "Limit $1000 for Level 1".

---

## Canonical Schemas

### Login Fields

| Field | Type | Max | Required | Description |
|-------|------|-----|----------|-------------|
| `Name` | Text | 31 | **Yes** | Username (Login ID). |
| `Password` | Text | 33 | - | Encrypted Password Hash. |
| `Initials` | Text | 3 | - | Unique Initials (used for Audit Trails). |
| `Email` | Text | 63 | - | User email. |
| `Role` | Text | 3 | - | Role Code. |
| `SecurityLevel`| Num | - | - | 0-10 Access Level. |
| `Privileges` | Text | 65 | - | Encoded Privilege Map. |
| `Category` | Text | 31 | - | Department/Group (for grouping users). |

---

## Developer Tips

### 1. The "Initials" Field is Critical
Throughout MoneyWorks (Transactions, Jobs, Messages), the "User" is referred to by their **Initials**, not their full Name or ID.
*   *Example*: `Transaction.EnteredBy` stores "JDW", which maps to `Login.Initials`.

### 2. Testing Permissions in Scripts
Never try to decode the `Privileges` string manually.
*   *Wrong*: `If (Mid(Login.Privileges, 5, 1) = "1")`
*   *Right*: `If (Allowed("Post Transactions"))`

### 3. Custom User Data
Like many MoneyWorks entities, `Login` has `UserNum`, `UserText`, and `TaggedText` fields. You can use these to store custom user preferences or API keys for your integrations.
