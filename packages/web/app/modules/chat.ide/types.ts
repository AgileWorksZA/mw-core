export interface ChatMessage {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export interface ChatSession {
	id: string;
	title: string;
	messages: ChatMessage[];
	createdAt: Date;
	updatedAt: Date;
	metadata?: {
		model?: string;
		temperature?: number;
		maxTokens?: number;
	};
}

export interface ChatContext extends ChatSession {
	// Current session state
	currentSessionId: string | null;
	sessions: ChatSession[];
	isLoading: boolean;
	error: Error | null;
}

export interface ChatEventPayloads {
	"session:create": {
		session: ChatSession;
	};
	"session:update": {
		sessionId: string;
		updates: Partial<ChatSession>;
	};
	"session:delete": {
		sessionId: string;
	};
	"session:select": {
		sessionId: string;
	};
	"message:add": {
		sessionId: string;
		message: ChatMessage;
	};
	"message:update": {
		sessionId: string;
		messageId: string;
		content: string;
	};
	"message:delete": {
		sessionId: string;
		messageId: string;
	};
	"chat:start": {
		sessionId: string;
	};
	"chat:complete": {
		sessionId: string;
	};
	"chat:error": {
		sessionId: string;
		error: Error;
	};
}

export interface ChatEmitPayloads {
	"session:created": undefined;
	"session:updated": undefined;
	"session:deleted": undefined;
	"session:selected": undefined;
	"message:added": undefined;
	"message:updated": undefined;
	"message:deleted": undefined;
	"chat:started": undefined;
	"chat:completed": undefined;
	"chat:errored": undefined;
	update: undefined;
}

export interface ChatConfig {
	id: string;
	path: string;
	context: ChatContext;
}
