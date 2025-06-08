export interface KnowledgeCard {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown content
  examples?: {
    correct?: string[];
    incorrect?: string[];
  };
  tags: string[];
  category: CardCategory;
  mcpTools?: string[]; // Associated MCP tools
  priority: Priority;
  active: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastModifiedBy?: string;
}

export type CardCategory = 
  | "concept" // Domain concepts and terminology
  | "calculation" // How calculations work
  | "workflow" // Business processes
  | "data-structure" // Data relationships
  | "best-practice" // Domain best practices
  | "common-mistake" // Common misconceptions
  | "integration" // Integration patterns
  | "mwscript"; // MWScript specific knowledge

export type Priority = "low" | "medium" | "high" | "critical";

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  category?: string;
}

export interface KnowledgeCardFilter {
  search?: string;
  tags?: string[];
  categories?: CardCategory[];
  mcpTools?: string[];
  active?: boolean;
  priority?: Priority[];
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  cardIds: string[];
  isDefault?: boolean;
  maxTokens?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardUsageStats {
  cardId: string;
  usageCount: number;
  lastUsed: Date;
  effectiveness?: number; // 0-1 score based on user feedback
}

export interface KnowledgeAlignmentConfig {
  enableAutoInjection: boolean;
  maxCardsPerPrompt: number;
  tokenBudget: number;
  priorityWeights: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}