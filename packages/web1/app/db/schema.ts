import { Database } from "bun:sqlite";

export interface MWConnection {
  id: string;
  clerk_user_id: string;
  organization_id?: string; // Added for group support
  connection_name: string;
  connection_type: 'datacentre' | 'now'; // NEW: Type of connection
  mw_username: string; // encrypted
  mw_password: string; // encrypted
  mw_folder_name?: string; // encrypted
  mw_folder_password?: string; // encrypted
  mw_data_file: string; // encrypted
  mw_host: string;
  mw_port: number;
  mw_now_account_id?: string; // NEW: Reference to parent NOW account
  mw_now_file_id?: string; // NEW: Unique identifier from NOW
  mw_now_metadata?: string; // NEW: JSON for NOW-specific data
  is_default: boolean;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MWNowAccount {
  id: string;
  clerk_user_id: string;
  account_name: string;
  mw_now_username: string; // encrypted
  mw_now_password: string; // encrypted
  mw_now_token?: string; // encrypted, if NOW uses tokens
  mw_now_refresh_token?: string; // encrypted, if NOW uses OAuth
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  clerk_user_id: string;
  connection_id?: string;
  event_type: 'login' | 'logout' | 'connection_added' | 'connection_updated' | 'connection_deleted' | 'connection_used' | 'api_call' | 'auth_failed';
  event_details?: string; // JSON string
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  success: boolean;
  error_message?: string;
}

export interface UserPreference {
  id: string;
  clerk_user_id: string;
  default_connection_id?: string;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  created_at: string;
  updated_at: string;
}

// Company Grouping Interfaces
export interface Organization {
  id: string;
  name: string;
  plan_type: 'basic' | 'professional' | 'enterprise';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CompanyGroup {
  id: string;
  organization_id: string;
  parent_group_id?: string;
  name: string;
  type: 'standard' | 'holding' | 'division' | 'client';
  color_code: string;
  description?: string;
  consolidation_settings: Record<string, any>;
  sync_rules: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyGroupMember {
  id: string;
  group_id: string;
  connection_id: string;
  company_code?: string;
  is_parent_company: boolean;
  sync_settings: Record<string, any>;
  mapping_rules: Record<string, any>;
  joined_at: string;
}

export interface GroupTemplate {
  id: string;
  group_id: string;
  type: 'tax_codes' | 'chart_of_accounts' | 'suppliers' | 'customers';
  name: string;
  description?: string;
  content: Record<string, any>;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupPermission {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'manager' | 'accountant' | 'bookkeeper' | 'viewer';
  permissions: Record<string, any>;
  invited_by?: string;
  invitation_accepted_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  email: string;
  role: string;
  permissions: Record<string, any>;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

export interface GroupSyncLog {
  id: string;
  group_id: string;
  operation_type: 'sync_tax_codes' | 'sync_accounts' | 'apply_template' | 'consolidation' | 'bulk_update';
  initiated_by: string;
  affected_companies: string[]; // Array of connection IDs
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: Record<string, any>;
  started_at: string;
  completed_at?: string;
}

export const SCHEMA_SQL = `
-- MoneyWorks NOW Accounts
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

-- MoneyWorks Connections
CREATE TABLE IF NOT EXISTS mw_connections (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  organization_id TEXT, -- For group support
  connection_name TEXT NOT NULL,
  connection_type TEXT NOT NULL DEFAULT 'datacentre', -- 'datacentre' or 'now'
  mw_username TEXT NOT NULL, -- encrypted
  mw_password TEXT NOT NULL, -- encrypted
  mw_folder_name TEXT, -- encrypted
  mw_folder_password TEXT, -- encrypted
  mw_data_file TEXT NOT NULL, -- encrypted
  mw_host TEXT NOT NULL,
  mw_port INTEGER NOT NULL DEFAULT 6710,
  mw_now_account_id TEXT, -- Reference to parent NOW account
  mw_now_file_id TEXT, -- Unique identifier from NOW
  mw_now_metadata TEXT, -- JSON for NOW-specific data
  is_default BOOLEAN NOT NULL DEFAULT 0,
  last_used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(clerk_user_id, connection_name),
  FOREIGN KEY (mw_now_account_id) REFERENCES mw_now_accounts(id) ON DELETE CASCADE
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  connection_id TEXT,
  event_type TEXT NOT NULL,
  event_details TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN NOT NULL DEFAULT 1,
  error_message TEXT,
  FOREIGN KEY (connection_id) REFERENCES mw_connections(id) ON DELETE SET NULL
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  default_connection_id TEXT,
  theme TEXT,
  language TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (default_connection_id) REFERENCES mw_connections(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_connections_user ON mw_connections(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_now_account ON mw_connections(mw_now_account_id);
CREATE INDEX IF NOT EXISTS idx_now_accounts_user ON mw_now_accounts(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_event ON audit_logs(event_type);

-- Triggers to update timestamps
CREATE TRIGGER IF NOT EXISTS update_mw_connections_timestamp
AFTER UPDATE ON mw_connections
FOR EACH ROW
BEGIN
  UPDATE mw_connections SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_user_preferences_timestamp
AFTER UPDATE ON user_preferences
FOR EACH ROW
BEGIN
  UPDATE user_preferences SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_mw_now_accounts_timestamp
AFTER UPDATE ON mw_now_accounts
FOR EACH ROW
BEGIN
  UPDATE mw_now_accounts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- =====================================================
-- Company Groups Schema
-- =====================================================

-- Organizations table (the accounting firm itself)
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    plan_type TEXT DEFAULT 'basic', -- basic, professional, enterprise
    settings TEXT DEFAULT '{}', -- JSON settings
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Company groups table (supports nested groups)
CREATE TABLE IF NOT EXISTS company_groups (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    organization_id TEXT NOT NULL,
    parent_group_id TEXT, -- NULL for top-level groups
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'standard', -- standard, holding, division, client
    color_code TEXT DEFAULT '#3B82F6', -- For UI display
    description TEXT,
    consolidation_settings TEXT DEFAULT '{}', -- JSON settings for consolidation rules
    sync_rules TEXT DEFAULT '{}', -- JSON rules for what to sync
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_group_id) REFERENCES company_groups(id) ON DELETE CASCADE
);

-- Link table between groups and MoneyWorks connections
CREATE TABLE IF NOT EXISTS company_group_members (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    group_id TEXT NOT NULL,
    connection_id TEXT NOT NULL, -- References mw_connections.id
    company_code TEXT, -- For consolidation purposes (e.g., "ACME-US", "ACME-UK")
    is_parent_company BOOLEAN DEFAULT 0,
    sync_settings TEXT DEFAULT '{}', -- JSON: what to sync from parent
    mapping_rules TEXT DEFAULT '{}', -- JSON: account/code mappings
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES company_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (connection_id) REFERENCES mw_connections(id) ON DELETE CASCADE,
    UNIQUE(group_id, connection_id)
);

-- Templates for standardization
CREATE TABLE IF NOT EXISTS group_templates (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    group_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'tax_codes', 'chart_of_accounts', 'suppliers', 'customers'
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- JSON template content
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES company_groups(id) ON DELETE CASCADE
);

-- User permissions for groups
CREATE TABLE IF NOT EXISTS group_permissions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    group_id TEXT NOT NULL,
    user_id TEXT NOT NULL, -- Clerk user ID
    role TEXT NOT NULL, -- 'owner', 'admin', 'manager', 'accountant', 'bookkeeper', 'viewer'
    permissions TEXT DEFAULT '{}', -- JSON: granular permissions
    invited_by TEXT,
    invitation_accepted_at DATETIME,
    expires_at DATETIME, -- For temporary access
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES company_groups(id) ON DELETE CASCADE,
    UNIQUE(group_id, user_id)
);

-- Invitations for group access
CREATE TABLE IF NOT EXISTS group_invitations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    group_id TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    permissions TEXT DEFAULT '{}', -- JSON: granular permissions
    invited_by TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL, -- Secure random token for invitation link
    expires_at DATETIME NOT NULL,
    accepted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES company_groups(id) ON DELETE CASCADE
);

-- Sync operations log
CREATE TABLE IF NOT EXISTS group_sync_log (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    group_id TEXT NOT NULL,
    operation_type TEXT NOT NULL, -- 'sync_tax_codes', 'sync_accounts', 'apply_template', etc.
    initiated_by TEXT NOT NULL,
    affected_companies TEXT NOT NULL, -- JSON array of connection IDs
    status TEXT NOT NULL, -- 'pending', 'in_progress', 'completed', 'failed'
    details TEXT, -- JSON: operation details and results
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (group_id) REFERENCES company_groups(id) ON DELETE CASCADE
);

-- Group-related indexes
CREATE INDEX IF NOT EXISTS idx_company_groups_org ON company_groups(organization_id);
CREATE INDEX IF NOT EXISTS idx_company_groups_parent ON company_groups(parent_group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_connection ON company_group_members(connection_id);
CREATE INDEX IF NOT EXISTS idx_group_permissions_user ON group_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_group_invitations_email ON group_invitations(email);
CREATE INDEX IF NOT EXISTS idx_group_invitations_token ON group_invitations(token);
CREATE INDEX IF NOT EXISTS idx_sync_log_group ON group_sync_log(group_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON group_sync_log(status);
-- Note: Index on mw_connections.organization_id will be created after migration
`;