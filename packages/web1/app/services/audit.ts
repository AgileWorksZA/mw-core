import { getDatabaseAsync } from "~/db/client";
import type { AuditLog } from "~/db/schema";
import { randomUUID } from "crypto";

export interface CreateAuditLogInput {
  clerk_user_id: string;
  connection_id?: string;
  event_type: AuditLog['event_type'];
  event_details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  success?: boolean;
  error_message?: string;
}

export class AuditService {
  private async getDb() {
    return await getDatabaseAsync();
  }
  
  async log(input: CreateAuditLogInput): Promise<void> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      INSERT INTO audit_logs (
        id, clerk_user_id, connection_id, event_type, event_details,
        ip_address, user_agent, success, error_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      randomUUID(),
      input.clerk_user_id,
      input.connection_id || null,
      input.event_type,
      input.event_details ? JSON.stringify(input.event_details) : null,
      input.ip_address || null,
      input.user_agent || null,
      input.success !== false ? 1 : 0,
      input.error_message || null
    );
  }
  
  async getRecentLogs(userId: string, limit: number = 50): Promise<AuditLog[]> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM audit_logs 
      WHERE clerk_user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    
    return stmt.all(userId, limit) as AuditLog[];
  }
  
  async getLogsByConnection(userId: string, connectionId: string, limit: number = 50): Promise<AuditLog[]> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM audit_logs 
      WHERE clerk_user_id = ? AND connection_id = ?
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    
    return stmt.all(userId, connectionId, limit) as AuditLog[];
  }
  
  async getLoginHistory(userId: string, limit: number = 20): Promise<AuditLog[]> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM audit_logs 
      WHERE clerk_user_id = ? AND event_type IN ('login', 'logout')
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    
    return stmt.all(userId, limit) as AuditLog[];
  }
  
  async getFailedAttempts(userId: string, since: Date): Promise<number> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM audit_logs 
      WHERE clerk_user_id = ? 
        AND success = 0 
        AND timestamp >= ?
    `);
    
    const result = stmt.get(userId, since.toISOString()) as { count: number };
    return result.count;
  }
}

export const auditService = new AuditService();