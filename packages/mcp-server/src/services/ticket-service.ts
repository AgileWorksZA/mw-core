import { Database } from "bun:sqlite";
import { type Issue, IssueSchema } from "../types";

export class TicketService {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec("PRAGMA foreign_keys = ON");
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
    data: any,
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

    const result = stmt.get(id) as any;
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

    return (stmt.all() as any[]).map((row) => IssueSchema.parse(row));
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

    stmt.run(status, resolution, status, id);
  }

  close(): void {
    this.db.close();
  }
}
