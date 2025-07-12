import { getDatabaseAsync } from "~/db/client";
import type { ChatSession, ChatMessage } from "~/db/schema";
import type { MoneyWorksMessage } from "@moneyworks/chat";

export class ChatService {
  /**
   * Create a new chat session
   */
  static async createSession(
    connectionId: string,
    userId: string,
    title?: string
  ): Promise<ChatSession> {
    const db = await getDatabaseAsync();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const sessionTitle = title || `Chat - ${new Date().toLocaleDateString()}`;
    
    try {
      db.prepare(`
        INSERT INTO chat_sessions (
          id, connection_id, clerk_user_id, title,
          created_at, updated_at, message_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, connectionId, userId, sessionTitle, now, now, 0);
      console.log(`[ChatService] Created session ${id} for connection ${connectionId}`);
    } catch (error) {
      console.error('[ChatService] Error creating session:', error);
      throw error;
    }
    
    return {
      id,
      connection_id: connectionId,
      clerk_user_id: userId,
      title: sessionTitle,
      message_count: 0,
      created_at: now,
      updated_at: now
    };
  }

  /**
   * Get all sessions for a connection
   */
  static async getSessionsByConnection(
    connectionId: string,
    userId: string
  ): Promise<ChatSession[]> {
    const db = await getDatabaseAsync();
    
    const sessions = db.prepare(`
      SELECT * FROM chat_sessions
      WHERE connection_id = ? AND clerk_user_id = ?
      ORDER BY last_message_at DESC, created_at DESC
    `).all(connectionId, userId) as ChatSession[];
    
    return sessions;
  }

  /**
   * Get a specific session
   */
  static async getSession(sessionId: string): Promise<ChatSession | null> {
    const db = await getDatabaseAsync();
    
    const session = db.prepare(`
      SELECT * FROM chat_sessions WHERE id = ?
    `).get(sessionId) as ChatSession | undefined;
    
    return session || null;
  }

  /**
   * Update session after a new message
   */
  static async updateSessionActivity(
    sessionId: string,
    messageCount: number
  ): Promise<void> {
    const db = await getDatabaseAsync();
    const now = new Date().toISOString();
    
    db.prepare(`
      UPDATE chat_sessions
      SET last_message_at = ?, message_count = ?, updated_at = ?
      WHERE id = ?
    `).run(now, messageCount, now, sessionId);
  }

  /**
   * Save a message to the database
   */
  static async saveMessage(
    sessionId: string,
    message: MoneyWorksMessage
  ): Promise<ChatMessage> {
    const db = await getDatabaseAsync();
    const id = message.id || crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Serialize tool invocations and MW data
    const toolInvocations = message.toolInvocations 
      ? JSON.stringify(message.toolInvocations) 
      : null;
    const mwData = message.mwData 
      ? JSON.stringify(message.mwData) 
      : null;
    
    db.prepare(`
      INSERT INTO chat_messages (
        id, session_id, role, content,
        tool_invocations, mw_data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, sessionId, message.role, message.content,
      toolInvocations, mwData, now
    );
    
    // Update session activity
    const session = await this.getSession(sessionId);
    if (session) {
      await this.updateSessionActivity(sessionId, session.message_count + 1);
    }
    
    return {
      id,
      session_id: sessionId,
      role: message.role,
      content: message.content,
      tool_invocations: toolInvocations || undefined,
      mw_data: mwData || undefined,
      created_at: now
    };
  }

  /**
   * Get all messages for a session
   */
  static async getSessionMessages(sessionId: string): Promise<MoneyWorksMessage[]> {
    const db = await getDatabaseAsync();
    
    const messages = db.prepare(`
      SELECT * FROM chat_messages
      WHERE session_id = ?
      ORDER BY created_at ASC
    `).all(sessionId) as ChatMessage[];
    
    // Convert to MoneyWorksMessage format
    return messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      toolInvocations: msg.tool_invocations 
        ? JSON.parse(msg.tool_invocations) 
        : undefined,
      mwData: msg.mw_data 
        ? JSON.parse(msg.mw_data) 
        : undefined
    }));
  }

  /**
   * Delete a session and all its messages
   */
  static async deleteSession(sessionId: string): Promise<void> {
    const db = await getDatabaseAsync();
    
    db.prepare(`
      DELETE FROM chat_sessions WHERE id = ?
    `).run(sessionId);
    
    // Messages are deleted automatically due to CASCADE
  }

  /**
   * Generate a title for a session based on first message
   */
  static async generateSessionTitle(
    sessionId: string,
    firstMessage: string
  ): Promise<void> {
    const db = await getDatabaseAsync();
    
    // Simple title generation - take first 50 chars of message
    const title = firstMessage.length > 50 
      ? firstMessage.substring(0, 47) + "..."
      : firstMessage;
    
    db.prepare(`
      UPDATE chat_sessions
      SET title = ?, updated_at = ?
      WHERE id = ?
    `).run(title, new Date().toISOString(), sessionId);
  }

  /**
   * Get or create a session for a connection
   */
  static async getOrCreateSession(
    connectionId: string,
    userId: string
  ): Promise<ChatSession> {
    // Get existing sessions
    const sessions = await this.getSessionsByConnection(connectionId, userId);
    
    // If there's a recent session (within last hour), use it
    if (sessions.length > 0 && sessions[0].last_message_at) {
      const lastMessageTime = new Date(sessions[0].last_message_at);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (lastMessageTime > hourAgo) {
        return sessions[0];
      }
    }
    
    // Otherwise create a new session
    return await this.createSession(connectionId, userId);
  }
}