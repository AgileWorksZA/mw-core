export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContext {
  id: string;
  title: string;
  currentSessionId: string | null;
  sessions: ChatSession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatEventPayloads {
  "session:create": { session?: ChatSession };
  "session:delete": { sessionId: string };
  "session:select": { sessionId: string };
  "session:update": { sessionId: string; updates: Partial<ChatSession> };
  "message:add": { sessionId: string; message: ChatMessage };
  "message:clear": { sessionId: string };
}