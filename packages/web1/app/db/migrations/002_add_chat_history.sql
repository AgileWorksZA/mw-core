-- Migration: Add chat history tables
-- Date: 2025-07-12

-- Chat sessions table - one per conversation thread
CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    connection_id TEXT NOT NULL,
    clerk_user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    last_message_at DATETIME,
    message_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (connection_id) REFERENCES mw_connections(id) ON DELETE CASCADE
);

-- Chat messages table - individual messages within a session
CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tool_invocations TEXT, -- JSON array of tool calls
    mw_data TEXT, -- JSON for MoneyWorks data attachments
    tokens_used INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- Indexes for chat tables
CREATE INDEX IF NOT EXISTS idx_chat_sessions_connection ON chat_sessions(connection_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message ON chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- Trigger to update chat session timestamp
CREATE TRIGGER IF NOT EXISTS update_chat_sessions_timestamp AFTER UPDATE ON chat_sessions FOR EACH ROW BEGIN UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; END