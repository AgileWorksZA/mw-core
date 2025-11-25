# MoneyWorks Entity Guide: User File

## Architectural Overview
The **User** entity is **NOT** the login user table (that is `Login`). The User table is a **generic key-value store** for scripts, plugins, and persistent data.

### Critical Concepts

#### 1. The "Cookies" of MoneyWorks
Think of the User table as the `localStorage` or `cookies` for your scripts. It allows you to store data that persists between sessions.
*   **Scripts**: Store configuration settings (e.g., "LastRunDate", "APIKey").
*   **Plugins**: Store preferences.
*   **Reports**: Store default parameters.

#### 2. Conflict Management
Since all scripts share this single table, key collision is a risk.
*   **Convention**: Prefix your keys with your plugin/script name (e.g., `MYAPP_Config`, `MYAPP_LastSync`).

#### 3. Structure
It's extremely simple: just a **Key** (9 chars) and **Data** (245 chars).

---

## Canonical Schemas

### User Fields

| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `Key` | Text | 9 | **Yes** | Unique Identifier. | Primary Key |
| `Data` | Text | 245 | - | The stored value. | - |
| `LastModifiedTime`| Text | - | - | Timestamp. | - |

---

## Developer Tips

### 1. Reading/Writing via Script
MWScript provides dedicated functions for this:
*   `GetPersistent(key)`: Reads the `Data` field.
*   `SetPersistent(key, value)`: Writes to the `Data` field.

### 2. Length Limitations
*   **Key**: 9 characters is very short! Be concise (e.g., `Z_CONFIG` rather than `MyScriptConfig`).
*   **Data**: 245 characters is small. If you need to store JSON, it will likely get truncated. Store minimal config only.

### 3. "Login" vs "User"
Do not confuse this table with the actual user accounts.
*   **`User` Table**: Generic storage.
*   **`Login` Table**: Actual MoneyWorks users (authentication).
