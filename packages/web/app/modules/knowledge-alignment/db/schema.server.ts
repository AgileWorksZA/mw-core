import Database from "bun:sqlite";
import { nanoid } from "nanoid";
import type {
  KnowledgeCard,
  Tag,
  PromptTemplate,
  CardUsageStats,
  KnowledgeCardFilter,
  KnowledgeAlignmentConfig,
} from "../types";

const DB_PATH = process.env.KNOWLEDGE_DB_PATH || "./data/knowledge-alignment.db";

export class KnowledgeAlignmentDB {
  private db: Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.init();
  }

  private init() {
    // Enable foreign keys
    this.db.exec("PRAGMA foreign_keys = ON");

    // Create tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge_cards (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        examples TEXT, -- JSON
        tags TEXT NOT NULL, -- JSON array
        category TEXT NOT NULL,
        mcp_tools TEXT, -- JSON array
        priority TEXT NOT NULL DEFAULT 'medium',
        active INTEGER NOT NULL DEFAULT 1,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        created_by TEXT,
        last_modified_by TEXT
      );

      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        color TEXT,
        category TEXT
      );

      CREATE TABLE IF NOT EXISTS prompt_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        card_ids TEXT NOT NULL, -- JSON array
        is_default INTEGER DEFAULT 0,
        max_tokens INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS card_usage_stats (
        card_id TEXT PRIMARY KEY,
        usage_count INTEGER NOT NULL DEFAULT 0,
        last_used TEXT,
        effectiveness REAL,
        FOREIGN KEY (card_id) REFERENCES knowledge_cards(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS knowledge_config (
        id TEXT PRIMARY KEY DEFAULT 'default',
        config TEXT NOT NULL -- JSON
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_cards_category ON knowledge_cards(category);
      CREATE INDEX IF NOT EXISTS idx_cards_priority ON knowledge_cards(priority);
      CREATE INDEX IF NOT EXISTS idx_cards_active ON knowledge_cards(active);
      CREATE INDEX IF NOT EXISTS idx_cards_updated ON knowledge_cards(updated_at);
      CREATE INDEX IF NOT EXISTS idx_stats_usage ON card_usage_stats(usage_count DESC);
    `);

    // Initialize default config if not exists
    const config = this.db.query("SELECT * FROM knowledge_config WHERE id = 'default'").get();
    if (!config) {
      const defaultConfig: KnowledgeAlignmentConfig = {
        enableAutoInjection: true,
        maxCardsPerPrompt: 10,
        tokenBudget: 2000,
        priorityWeights: {
          critical: 1.0,
          high: 0.8,
          medium: 0.5,
          low: 0.3,
        },
      };
      this.db.query("INSERT INTO knowledge_config (id, config) VALUES ('default', ?)").run(
        JSON.stringify(defaultConfig)
      );
    }
  }

  // Knowledge Card Operations
  createCard(card: Omit<KnowledgeCard, "id" | "createdAt" | "updatedAt" | "version">): KnowledgeCard {
    const id = nanoid();
    const now = new Date().toISOString();
    
    const newCard: KnowledgeCard = {
      ...card,
      id,
      version: 1,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    this.db.query(`
      INSERT INTO knowledge_cards (
        id, title, summary, content, examples, tags, category,
        mcp_tools, priority, active, version, created_at, updated_at,
        created_by, last_modified_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newCard.id,
      newCard.title,
      newCard.summary,
      newCard.content,
      JSON.stringify(newCard.examples || null),
      JSON.stringify(newCard.tags),
      newCard.category,
      JSON.stringify(newCard.mcpTools || null),
      newCard.priority,
      newCard.active ? 1 : 0,
      newCard.version,
      now,
      now,
      newCard.createdBy || null,
      newCard.lastModifiedBy || null
    );

    // Initialize usage stats
    this.db.query("INSERT INTO card_usage_stats (card_id) VALUES (?)").run(id);

    return newCard;
  }

  updateCard(id: string, updates: Partial<KnowledgeCard>): KnowledgeCard | null {
    const existing = this.getCard(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...updates,
      id, // Ensure ID can't be changed
      version: existing.version + 1,
      updatedAt: new Date(now),
    };

    this.db.query(`
      UPDATE knowledge_cards SET
        title = ?, summary = ?, content = ?, examples = ?, tags = ?,
        category = ?, mcp_tools = ?, priority = ?, active = ?,
        version = ?, updated_at = ?, last_modified_by = ?
      WHERE id = ?
    `).run(
      updated.title,
      updated.summary,
      updated.content,
      JSON.stringify(updated.examples || null),
      JSON.stringify(updated.tags),
      updated.category,
      JSON.stringify(updated.mcpTools || null),
      updated.priority,
      updated.active ? 1 : 0,
      updated.version,
      now,
      updates.lastModifiedBy || null,
      id
    );

    return updated;
  }

  getCard(id: string): KnowledgeCard | null {
    const row = this.db.query("SELECT * FROM knowledge_cards WHERE id = ?").get(id) as any;
    if (!row) return null;
    
    return this.rowToCard(row);
  }

  searchCards(filter: KnowledgeCardFilter = {}): KnowledgeCard[] {
    let query = "SELECT * FROM knowledge_cards WHERE 1=1";
    const params: any[] = [];

    if (filter.active !== undefined) {
      query += " AND active = ?";
      params.push(filter.active ? 1 : 0);
    }

    if (filter.categories && filter.categories.length > 0) {
      query += ` AND category IN (${filter.categories.map(() => "?").join(",")})`;
      params.push(...filter.categories);
    }

    if (filter.priority && filter.priority.length > 0) {
      query += ` AND priority IN (${filter.priority.map(() => "?").join(",")})`;
      params.push(...filter.priority);
    }

    if (filter.search) {
      query += " AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)";
      const searchTerm = `%${filter.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Handle JSON array filters
    if (filter.tags && filter.tags.length > 0) {
      // This is a simple implementation - for production, consider full-text search
      query += " AND (";
      const tagConditions = filter.tags.map(() => "tags LIKE ?").join(" OR ");
      query += tagConditions + ")";
      params.push(...filter.tags.map(tag => `%"${tag}"%`));
    }

    if (filter.mcpTools && filter.mcpTools.length > 0) {
      query += " AND (";
      const toolConditions = filter.mcpTools.map(() => "mcp_tools LIKE ?").join(" OR ");
      query += toolConditions + ")";
      params.push(...filter.mcpTools.map(tool => `%"${tool}"%`));
    }

    query += " ORDER BY priority DESC, updated_at DESC";

    const rows = this.db.query(query).all(...params) as any[];
    return rows.map(row => this.rowToCard(row));
  }

  deleteCard(id: string): boolean {
    const result = this.db.query("DELETE FROM knowledge_cards WHERE id = ?").run(id);
    return result.changes > 0;
  }

  // Tag Operations
  createTag(tag: Omit<Tag, "id">): Tag {
    const id = nanoid();
    const newTag = { ...tag, id };

    this.db.query(`
      INSERT INTO tags (id, name, description, color, category)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, newTag.name, newTag.description || null, newTag.color || null, newTag.category || null);

    return newTag;
  }

  getAllTags(): Tag[] {
    const rows = this.db.query("SELECT * FROM tags ORDER BY name").all() as any[];
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      color: row.color,
      category: row.category,
    }));
  }

  // Prompt Template Operations
  createTemplate(template: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">): PromptTemplate {
    const id = nanoid();
    const now = new Date().toISOString();
    
    const newTemplate: PromptTemplate = {
      ...template,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    this.db.query(`
      INSERT INTO prompt_templates (id, name, description, card_ids, is_default, max_tokens, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      newTemplate.name,
      newTemplate.description,
      JSON.stringify(newTemplate.cardIds),
      newTemplate.isDefault ? 1 : 0,
      newTemplate.maxTokens || null,
      now,
      now
    );

    return newTemplate;
  }

  getTemplate(id: string): PromptTemplate | null {
    const row = this.db.query("SELECT * FROM prompt_templates WHERE id = ?").get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      cardIds: JSON.parse(row.card_ids),
      isDefault: Boolean(row.is_default),
      maxTokens: row.max_tokens,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  getDefaultTemplate(): PromptTemplate | null {
    const row = this.db.query("SELECT * FROM prompt_templates WHERE is_default = 1").get() as any;
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      cardIds: JSON.parse(row.card_ids),
      isDefault: true,
      maxTokens: row.max_tokens,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  // Usage Statistics
  recordCardUsage(cardId: string): void {
    const now = new Date().toISOString();
    this.db.query(`
      UPDATE card_usage_stats 
      SET usage_count = usage_count + 1, last_used = ?
      WHERE card_id = ?
    `).run(now, cardId);
  }

  getCardStats(cardId: string): CardUsageStats | null {
    const row = this.db.query("SELECT * FROM card_usage_stats WHERE card_id = ?").get(cardId) as any;
    if (!row) return null;

    return {
      cardId: row.card_id,
      usageCount: row.usage_count,
      lastUsed: new Date(row.last_used),
      effectiveness: row.effectiveness,
    };
  }

  getMostUsedCards(limit: number = 10): KnowledgeCard[] {
    const rows = this.db.query(`
      SELECT kc.* FROM knowledge_cards kc
      JOIN card_usage_stats cus ON kc.id = cus.card_id
      WHERE kc.active = 1
      ORDER BY cus.usage_count DESC
      LIMIT ?
    `).all(limit) as any[];

    return rows.map(row => this.rowToCard(row));
  }

  // Configuration
  getConfig(): KnowledgeAlignmentConfig {
    const row = this.db.query("SELECT config FROM knowledge_config WHERE id = 'default'").get() as any;
    return JSON.parse(row.config);
  }

  updateConfig(config: Partial<KnowledgeAlignmentConfig>): KnowledgeAlignmentConfig {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    
    this.db.query("UPDATE knowledge_config SET config = ? WHERE id = 'default'").run(
      JSON.stringify(updated)
    );
    
    return updated;
  }

  // Prompt Template Operations
  createTemplate(template: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">): PromptTemplate {
    const id = nanoid();
    const now = new Date().toISOString();
    
    const newTemplate: PromptTemplate = {
      ...template,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    this.db.query(`
      INSERT INTO prompt_templates (
        id, name, description, card_ids, is_default, max_tokens, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newTemplate.id,
      newTemplate.name,
      newTemplate.description,
      JSON.stringify(newTemplate.cardIds),
      newTemplate.isDefault ? 1 : 0,
      newTemplate.maxTokens || null,
      now,
      now
    );

    return newTemplate;
  }

  updateTemplate(id: string, updates: Partial<PromptTemplate>): PromptTemplate | null {
    const existing = this.getTemplate(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(now),
    };

    this.db.query(`
      UPDATE prompt_templates SET
        name = ?, description = ?, card_ids = ?, is_default = ?, max_tokens = ?, updated_at = ?
      WHERE id = ?
    `).run(
      updated.name,
      updated.description,
      JSON.stringify(updated.cardIds),
      updated.isDefault ? 1 : 0,
      updated.maxTokens || null,
      now,
      id
    );

    return updated;
  }

  deleteTemplate(id: string): boolean {
    const result = this.db.query("DELETE FROM prompt_templates WHERE id = ?").run(id);
    return result.changes > 0;
  }

  getTemplate(id: string): PromptTemplate | null {
    const row = this.db.query("SELECT * FROM prompt_templates WHERE id = ?").get(id) as any;
    return row ? this.rowToTemplate(row) : null;
  }

  getAllTemplates(): PromptTemplate[] {
    const rows = this.db.query("SELECT * FROM prompt_templates ORDER BY name").all() as any[];
    return rows.map(row => this.rowToTemplate(row));
  }

  getDefaultTemplate(): PromptTemplate | null {
    const row = this.db.query("SELECT * FROM prompt_templates WHERE is_default = 1").get() as any;
    return row ? this.rowToTemplate(row) : null;
  }

  setDefaultTemplate(id: string): boolean {
    // First, unset any existing default
    this.db.query("UPDATE prompt_templates SET is_default = 0 WHERE is_default = 1").run();
    
    // Then set the new default
    const result = this.db.query("UPDATE prompt_templates SET is_default = 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  // Helper method to convert database row to KnowledgeCard
  private rowToCard(row: any): KnowledgeCard {
    return {
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      examples: row.examples ? JSON.parse(row.examples) : undefined,
      tags: JSON.parse(row.tags),
      category: row.category,
      mcpTools: row.mcp_tools ? JSON.parse(row.mcp_tools) : undefined,
      priority: row.priority,
      active: Boolean(row.active),
      version: row.version,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      createdBy: row.created_by,
      lastModifiedBy: row.last_modified_by,
    };
  }

  // Helper method to convert database row to PromptTemplate
  private rowToTemplate(row: any): PromptTemplate {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      cardIds: JSON.parse(row.card_ids),
      isDefault: Boolean(row.is_default),
      maxTokens: row.max_tokens,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  close() {
    this.db.close();
  }
}

// Export singleton instance
export const knowledgeDB = new KnowledgeAlignmentDB();