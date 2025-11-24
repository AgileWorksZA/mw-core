import {
	AccountCode,
	NameCode,
	TransactionSeq,
	YYYYMMDD,
} from "@moneyworks/utilities";

export interface BaseMessage {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	timestamp: Date;
}

export interface MoneyWorksDataAttachment {
	type: "transaction" | "account" | "report" | "taxRate" | "name" | "invoice";
	data: any; // Will be properly typed based on type
	metadata?: {
		count?: number;
		totalAmount?: number;
		period?: string;
	};
}

export interface MoneyWorksMessage extends BaseMessage {
	mwData?: MoneyWorksDataAttachment;
	toolInvocations?: MoneyWorksToolInvocation[];
	streaming?: boolean;
}

export interface MoneyWorksToolInvocation {
	toolName: string;
	args: Record<string, any>;
	state: "pending" | "completed" | "failed";
	result?: {
		success: boolean;
		data?: any;
		error?: string;
	};
}

// Streaming message chunks
export interface StreamingChunk {
	type: "text" | "tool_start" | "tool_result" | "mw_data" | "error" | "done";
	content?: string;
	toolName?: string;
	toolArgs?: Record<string, any>;
	toolResult?: any;
	mwData?: MoneyWorksDataAttachment;
	error?: string;
}
