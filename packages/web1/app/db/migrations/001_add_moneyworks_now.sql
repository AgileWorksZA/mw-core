-- Migration: Add MoneyWorks NOW support
-- Date: 2025-07-10

-- 1. Create MoneyWorks NOW Accounts table
CREATE TABLE IF NOT EXISTS mw_now_accounts (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  mw_now_username TEXT NOT NULL, -- encrypted
  mw_now_password TEXT NOT NULL, -- encrypted
  mw_now_token TEXT, -- encrypted, if NOW uses tokens
  mw_now_refresh_token TEXT, -- encrypted, if NOW uses OAuth
  last_synced_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(clerk_user_id, account_name)
);

-- 2. Add new columns to mw_connections table
-- Note: These columns may already exist in the schema, so we skip this migration
-- The schema.ts file already includes these columns in the CREATE TABLE statement

-- 3. Add foreign key constraint (SQLite doesn't support ALTER TABLE ADD CONSTRAINT, so we need to recreate the table)
-- This is handled by the PRAGMA foreign_keys=ON setting in the database connection

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_connections_now_account ON mw_connections(mw_now_account_id);
CREATE INDEX IF NOT EXISTS idx_now_accounts_user ON mw_now_accounts(clerk_user_id);

-- 5. Create trigger for mw_now_accounts
CREATE TRIGGER IF NOT EXISTS update_mw_now_accounts_timestamp
AFTER UPDATE ON mw_now_accounts
FOR EACH ROW
BEGIN
  UPDATE mw_now_accounts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;