import Database from "bun:sqlite";
import { nanoid } from "nanoid";
import type {
  Ticket,
  CreateTicketInput,
  UpdateTicketInput,
  TicketFilters,
} from "../types";

// Get database path from environment or use default
const DB_PATH = process.env.TICKETING_DB_PATH || "./data/tickets.db";

export class TicketingDB {
  private db: Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.init();
  }

  private init() {
    // Create tickets table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        user_query TEXT NOT NULL,
        ai_response TEXT,
        error_details TEXT,
        category TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        priority TEXT NOT NULL DEFAULT 'medium',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        resolved_at TEXT,
        assigned_to TEXT,
        resolution TEXT,
        metadata TEXT
      )
    `);

    // Create indexes for common queries
    this.db.run(
      "CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)",
    );
    this.db.run(
      "CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category)",
    );
    this.db.run(
      "CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority)",
    );
    this.db.run(
      "CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at)",
    );
  }

  createTicket(input: CreateTicketInput): Ticket {
    const id = nanoid();
    const now = new Date().toISOString();

    const ticket: Ticket = {
      id,
      title: input.title,
      description: input.description,
      userQuery: input.userQuery,
      aiResponse: input.aiResponse,
      errorDetails: input.errorDetails,
      category: input.category,
      status: "new",
      priority: input.priority || "medium",
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata,
    };

    const stmt = this.db.prepare(`
      INSERT INTO tickets (
        id, title, description, user_query, ai_response, error_details,
        category, status, priority, created_at, updated_at, metadata
      ) VALUES (
        $id, $title, $description, $userQuery, $aiResponse, $errorDetails,
        $category, $status, $priority, $createdAt, $updatedAt, $metadata
      )
    `);

    stmt.run({
      $id: ticket.id,
      $title: ticket.title,
      $description: ticket.description,
      $userQuery: ticket.userQuery,
      $aiResponse: ticket.aiResponse || null,
      $errorDetails: ticket.errorDetails || null,
      $category: ticket.category,
      $status: ticket.status,
      $priority: ticket.priority,
      $createdAt: ticket.createdAt,
      $updatedAt: ticket.updatedAt,
      $metadata: ticket.metadata ? JSON.stringify(ticket.metadata) : null,
    });

    return ticket;
  }

  updateTicket(id: string, input: UpdateTicketInput): Ticket | null {
    const now = new Date().toISOString();
    const updates: string[] = ["updated_at = $updatedAt"];
    const params: any = { $id: id, $updatedAt: now };

    if (input.status !== undefined) {
      updates.push("status = $status");
      params.$status = input.status;

      // Set resolved_at if status is resolved or closed
      if (input.status === "resolved" || input.status === "closed") {
        updates.push("resolved_at = $resolvedAt");
        params.$resolvedAt = now;
      }
    }

    if (input.priority !== undefined) {
      updates.push("priority = $priority");
      params.$priority = input.priority;
    }

    if (input.assignedTo !== undefined) {
      updates.push("assigned_to = $assignedTo");
      params.$assignedTo = input.assignedTo;
    }

    if (input.resolution !== undefined) {
      updates.push("resolution = $resolution");
      params.$resolution = input.resolution;
    }

    if (input.category !== undefined) {
      updates.push("category = $category");
      params.$category = input.category;
    }

    const stmt = this.db.prepare(`
      UPDATE tickets
      SET ${updates.join(", ")}
      WHERE id = $id
    `);

    stmt.run(params);

    return this.getTicket(id);
  }

  getTicket(id: string): Ticket | null {
    const stmt = this.db.prepare("SELECT * FROM tickets WHERE id = $id");
    const row = stmt.get({ $id: id }) as any;

    if (!row) return null;

    return this.rowToTicket(row);
  }

  getTickets(filters?: TicketFilters): Ticket[] {
    let query = "SELECT * FROM tickets WHERE 1=1";
    const params: any = {};

    if (filters?.status && filters.status.length > 0) {
      query += ` AND status IN (${filters.status.map((_, i) => `$status${i}`).join(",")})`;
      filters.status.forEach((status, i) => {
        params[`$status${i}`] = status;
      });
    }

    if (filters?.category && filters.category.length > 0) {
      query += ` AND category IN (${filters.category.map((_, i) => `$category${i}`).join(",")})`;
      filters.category.forEach((category, i) => {
        params[`$category${i}`] = category;
      });
    }

    if (filters?.priority && filters.priority.length > 0) {
      query += ` AND priority IN (${filters.priority.map((_, i) => `$priority${i}`).join(",")})`;
      filters.priority.forEach((priority, i) => {
        params[`$priority${i}`] = priority;
      });
    }

    if (filters?.assignedTo) {
      query += " AND assigned_to = $assignedTo";
      params.$assignedTo = filters.assignedTo;
    }

    if (filters?.dateFrom) {
      query += " AND created_at >= $dateFrom";
      params.$dateFrom = filters.dateFrom;
    }

    if (filters?.dateTo) {
      query += " AND created_at <= $dateTo";
      params.$dateTo = filters.dateTo;
    }

    query += " ORDER BY created_at DESC";

    const stmt = this.db.prepare(query);
    const rows = stmt.all(params) as any[];

    return rows.map((row) => this.rowToTicket(row));
  }

  getTicketStats() {
    const stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };

    // Total count
    const totalStmt = this.db.prepare("SELECT COUNT(*) as count FROM tickets");
    stats.total = (totalStmt.get() as any).count;

    // By status
    const statusStmt = this.db.prepare(
      "SELECT status, COUNT(*) as count FROM tickets GROUP BY status",
    );
    const statusRows = statusStmt.all() as any[];
    for (const row of statusRows) {
      stats.byStatus[row.status] = row.count;
    }

    // By category
    const categoryStmt = this.db.prepare(
      "SELECT category, COUNT(*) as count FROM tickets GROUP BY category",
    );
    const categoryRows = categoryStmt.all() as any[];
    for (const row of categoryRows) {
      stats.byCategory[row.category] = row.count;
    }

    // By priority
    const priorityStmt = this.db.prepare(
      "SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority",
    );
    const priorityRows = priorityStmt.all() as any[];
    for (const row of priorityRows) {
      stats.byPriority[row.priority] = row.count;
    }

    return stats;
  }

  private rowToTicket(row: any): Ticket {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      userQuery: row.user_query,
      aiResponse: row.ai_response,
      errorDetails: row.error_details,
      category: row.category,
      status: row.status,
      priority: row.priority,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      resolvedAt: row.resolved_at,
      assignedTo: row.assigned_to,
      resolution: row.resolution,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    };
  }

  close() {
    this.db.close();
  }
}

// Export singleton instance
export const ticketingDB = new TicketingDB();
