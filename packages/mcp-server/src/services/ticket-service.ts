import { Database } from "bun:sqlite";
import { type Issue, IssueSchema } from "../types";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export class TicketService {
	private db: Database;

	constructor(dbPath: string) {
		// Ensure the directory exists
		try {
			mkdirSync(dirname(dbPath), { recursive: true });
		} catch (error) {
			// Directory might already exist, that's fine
		}
		
		this.db = new Database(dbPath);
		this.db.exec("PRAGMA journal_mode = WAL");
		this.db.exec("PRAGMA foreign_keys = ON");
		
		// Run migrations to ensure tables exist
		this.runMigrations();
	}
	
	private runMigrations(): void {
		// Create tables if they don't exist
		this.db.exec(`
			CREATE TABLE IF NOT EXISTS issues (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type TEXT NOT NULL CHECK(type IN ('bug', 'feature_request', 'improvement')),
				severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
				status TEXT NOT NULL CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
				user_prompt TEXT NOT NULL,
				ai_attempted_action TEXT,
				mcp_tool_used TEXT,
				api_endpoint TEXT,
				error_message TEXT,
				error_stack TEXT,
				api_response_code INTEGER,
				api_response_body TEXT,
				session_id TEXT,
				moneyworks_version TEXT,
				api_version TEXT,
				resolution_notes TEXT,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				resolved_at DATETIME
			);

			CREATE TABLE IF NOT EXISTS issue_context (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				issue_id INTEGER NOT NULL,
				context_type TEXT NOT NULL CHECK(context_type IN ('request', 'response', 'state')),
				context_data TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
			);

			CREATE TABLE IF NOT EXISTS issue_tags (
				issue_id INTEGER NOT NULL,
				tag TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY (issue_id, tag),
				FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
			);

			CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
			CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(type);
			CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
			CREATE INDEX IF NOT EXISTS idx_issues_session ON issues(session_id);
			CREATE INDEX IF NOT EXISTS idx_issue_tags_tag ON issue_tags(tag);
		`);
	}

	async createTicket(
		issue: Omit<Issue, "id" | "created_at" | "updated_at">,
	): Promise<number> {
		const validated = IssueSchema.omit({
			id: true,
			created_at: true,
			updated_at: true,
		}).parse(issue);

		const stmt = this.db.prepare(`
      INSERT INTO issues (
        type, severity, status, user_prompt, ai_attempted_action,
        mcp_tool_used, api_endpoint, error_message, error_stack,
        api_response_code, api_response_body, session_id,
        moneyworks_version, api_version
      ) VALUES (
        $type, $severity, $status, $user_prompt, $ai_attempted_action,
        $mcp_tool_used, $api_endpoint, $error_message, $error_stack,
        $api_response_code, $api_response_body, $session_id,
        $moneyworks_version, $api_version
      )
    `);

		const info = stmt.run(validated);
		return info.lastInsertRowid as number;
	}

	async addContext(
		issueId: number,
		contextType: "request" | "response" | "state",
		data: unknown,
	): Promise<void> {
		const stmt = this.db.prepare(`
      INSERT INTO issue_context (issue_id, context_type, context_data)
      VALUES (?, ?, ?)
    `);

		stmt.run(issueId, contextType, JSON.stringify(data));
	}

	async addTags(issueId: number, tags: string[]): Promise<void> {
		const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO issue_tags (issue_id, tag)
      VALUES (?, ?)
    `);

		const transaction = this.db.transaction((tags: string[]) => {
			for (const tag of tags) {
				stmt.run(issueId, tag);
			}
		});

		transaction(tags);
	}

	async getTicket(id: number): Promise<Issue | null> {
		const stmt = this.db.prepare(`
      SELECT * FROM issues WHERE id = ?
    `);

		const result = stmt.get(id) as unknown;
		return result ? IssueSchema.parse(result) : null;
	}

	async getOpenTickets(): Promise<Issue[]> {
		const stmt = this.db.prepare(`
      SELECT * FROM issues 
      WHERE status IN ('open', 'in_progress')
      ORDER BY 
        CASE severity 
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        created_at DESC
    `);

		return (stmt.all() as unknown[]).map((row) => IssueSchema.parse(row));
	}

	async updateStatus(
		id: number,
		status: Issue["status"],
		resolution?: string,
	): Promise<void> {
		const stmt = this.db.prepare(`
      UPDATE issues 
      SET status = ?, 
          resolution_notes = COALESCE(?, resolution_notes),
          resolved_at = CASE WHEN ? IN ('resolved', 'closed') THEN CURRENT_TIMESTAMP ELSE resolved_at END
      WHERE id = ?
    `);

		stmt.run(status, resolution || null, status, id);
	}

	close(): void {
		this.db.close();
	}
}
