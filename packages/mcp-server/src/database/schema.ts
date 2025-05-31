export const SCHEMA = `
-- Issues table for tracking failures and feature requests
CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Issue categorization
    type TEXT NOT NULL CHECK(type IN ('bug', 'feature_request', 'improvement')),
    severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
    
    -- Context information
    user_prompt TEXT NOT NULL,
    ai_attempted_action TEXT,
    mcp_tool_used TEXT,
    api_endpoint TEXT,
    
    -- Error details
    error_message TEXT,
    error_stack TEXT,
    api_response_code INTEGER,
    api_response_body TEXT,
    
    -- Resolution tracking
    resolution_notes TEXT,
    resolved_by TEXT,
    resolved_at DATETIME,
    
    -- Metadata
    session_id TEXT,
    moneyworks_version TEXT,
    api_version TEXT
);

-- Context table for additional request/response data
CREATE TABLE IF NOT EXISTS issue_context (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL,
    context_type TEXT NOT NULL CHECK(context_type IN ('request', 'response', 'state')),
    context_data TEXT NOT NULL, -- JSON data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id)
);

-- Tags for categorizing and searching issues
CREATE TABLE IF NOT EXISTS issue_tags (
    issue_id INTEGER NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY (issue_id, tag),
    FOREIGN KEY (issue_id) REFERENCES issues(id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(type);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at);
CREATE INDEX IF NOT EXISTS idx_issue_tags_tag ON issue_tags(tag);

-- Trigger to update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_issues_timestamp 
AFTER UPDATE ON issues
BEGIN
    UPDATE issues SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
`;
