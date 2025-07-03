import { Database } from "bun:sqlite";

export interface MWConnection {
  id: string;
  clerk_user_id: string;
  connection_name: string;
  mw_username: string; // encrypted
  mw_password: string; // encrypted
  mw_folder_name?: string; // encrypted
  mw_folder_password?: string; // encrypted
  mw_data_file: string; // encrypted
  mw_host: string;
  mw_port: number;
  is_default: boolean;
  last_used_at?: string;
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

export const SCHEMA_SQL = `
-- MoneyWorks Connections
CREATE TABLE IF NOT EXISTS mw_connections (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  connection_name TEXT NOT NULL,
  mw_username TEXT NOT NULL, -- encrypted
  mw_password TEXT NOT NULL, -- encrypted
  mw_folder_name TEXT, -- encrypted
  mw_folder_password TEXT, -- encrypted
  mw_data_file TEXT NOT NULL, -- encrypted
  mw_host TEXT NOT NULL,
  mw_port INTEGER NOT NULL DEFAULT 6710,
  is_default BOOLEAN NOT NULL DEFAULT 0,
  last_used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(clerk_user_id, connection_name)
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
`;