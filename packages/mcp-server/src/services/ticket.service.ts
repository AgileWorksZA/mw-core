/**
 * Ticket service for error tracking with SQLite support
 */

import Database from "better-sqlite3";
import path from "path";
import { promises as fs } from "fs";

export interface Ticket {
  id: number;
  tool: string;
  operation?: string;
  error: string;
  context?: string;
  created_at: string;
  status: "open" | "resolved" | "ignored";
}

export class TicketService {
  private db: Database.Database | null = null;
  private dbPath: string;
  private inMemoryTickets: Map<string, any> = new Map();
  private useInMemory = false;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Try to load better-sqlite3
      const Database = await import("better-sqlite3").then(m => m.default);
      
      // Ensure directory exists
      const dir = path.dirname(this.dbPath);
      await fs.mkdir(dir, { recursive: true }).catch(() => {});

      // Initialize SQLite database
      this.db = new Database(this.dbPath);
      
      // Create tables if they don't exist
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS tickets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tool TEXT NOT NULL,
          operation TEXT,
          error TEXT NOT NULL,
          context TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'open',
          CHECK (status IN ('open', 'resolved', 'ignored'))
        );

        CREATE INDEX IF NOT EXISTS idx_tickets_tool ON tickets(tool);
        CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
        CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at);
      `);

      console.log(`Ticket database initialized at: ${this.dbPath}`);
    } catch (error) {
      console.warn("SQLite not available, using in-memory storage:", error);
      this.useInMemory = true;
    }
  }

  async createTicket(data: {
    tool: string;
    operation?: string;
    error: string;
    context?: any;
  }): Promise<Ticket> {
    if (this.useInMemory) {
      const ticket = {
        id: Date.now(),
        ...data,
        context: JSON.stringify(data.context),
        created_at: new Date().toISOString(),
        status: "open" as const,
      };
      this.inMemoryTickets.set(ticket.id.toString(), ticket);
      return ticket;
    }

    const stmt = this.db!.prepare(`
      INSERT INTO tickets (tool, operation, error, context)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.tool,
      data.operation || null,
      data.error,
      data.context ? JSON.stringify(data.context) : null
    );

    return this.getTicketById(result.lastInsertRowid as number)!;
  }

  async getTickets(filter?: {
    tool?: string;
    status?: Ticket["status"];
    limit?: number;
  }): Promise<Ticket[]> {
    if (this.useInMemory) {
      let tickets = Array.from(this.inMemoryTickets.values());
      
      if (filter?.tool) {
        tickets = tickets.filter(t => t.tool === filter.tool);
      }
      if (filter?.status) {
        tickets = tickets.filter(t => t.status === filter.status);
      }
      
      tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      if (filter?.limit) {
        tickets = tickets.slice(0, filter.limit);
      }
      
      return tickets;
    }

    let query = "SELECT * FROM tickets WHERE 1=1";
    const params: any[] = [];

    if (filter?.tool) {
      query += " AND tool = ?";
      params.push(filter.tool);
    }

    if (filter?.status) {
      query += " AND status = ?";
      params.push(filter.status);
    }

    query += " ORDER BY created_at DESC";

    if (filter?.limit) {
      query += " LIMIT ?";
      params.push(filter.limit);
    }

    const stmt = this.db!.prepare(query);
    const rows = stmt.all(...params) as Ticket[];
    
    // Parse context JSON
    return rows.map(row => ({
      ...row,
      context: row.context ? JSON.parse(row.context as string) : undefined,
    }));
  }

  async getTicketById(id: number): Promise<Ticket | null> {
    if (this.useInMemory) {
      return this.inMemoryTickets.get(id.toString()) || null;
    }

    const stmt = this.db!.prepare("SELECT * FROM tickets WHERE id = ?");
    const row = stmt.get(id) as Ticket | undefined;
    
    if (!row) return null;
    
    return {
      ...row,
      context: row.context ? JSON.parse(row.context as string) : undefined,
    };
  }

  async updateTicketStatus(id: number | string, status: Ticket["status"]): Promise<void> {
    if (this.useInMemory) {
      const ticket = this.inMemoryTickets.get(id.toString());
      if (ticket) {
        ticket.status = status;
      }
      return;
    }

    const stmt = this.db!.prepare("UPDATE tickets SET status = ? WHERE id = ?");
    stmt.run(status, id);
  }

  async getStats(): Promise<{
    total: number;
    open: number;
    resolved: number;
    ignored: number;
    byTool: Record<string, number>;
  }> {
    if (this.useInMemory) {
      const tickets = Array.from(this.inMemoryTickets.values());
      const stats = {
        total: tickets.length,
        open: 0,
        resolved: 0,
        ignored: 0,
        byTool: {} as Record<string, number>,
      };

      for (const ticket of tickets) {
        stats[ticket.status]++;
        stats.byTool[ticket.tool] = (stats.byTool[ticket.tool] || 0) + 1;
      }

      return stats;
    }

    const statsQuery = this.db!.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'ignored' THEN 1 ELSE 0 END) as ignored
      FROM tickets
    `).get() as any;

    const byToolQuery = this.db!.prepare(`
      SELECT tool, COUNT(*) as count
      FROM tickets
      GROUP BY tool
    `).all() as Array<{ tool: string; count: number }>;

    const byTool: Record<string, number> = {};
    for (const row of byToolQuery) {
      byTool[row.tool] = row.count;
    }

    return {
      total: statsQuery.total,
      open: statsQuery.open,
      resolved: statsQuery.resolved,
      ignored: statsQuery.ignored,
      byTool,
    };
  }

  close() {
    if (this.db && !this.useInMemory) {
      this.db.close();
    }
  }
}