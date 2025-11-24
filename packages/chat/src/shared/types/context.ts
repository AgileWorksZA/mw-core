import type { AccountCode, NameCode } from "@moneyworks/utilities";

export interface MoneyWorksChatContext {
	// Connection info (from server only)
	connectionId: string;
	companyName: string;

	// User info
	userId: string;
	userEmail?: string;
	permissions: string[];

	// Current context (can be updated by client)
	currentPeriod?: string;
	selectedAccount?: AccountCode;
	selectedEntity?: NameCode;
	selectedTaxCode?: string;

	// UI preferences
	dateFormat?: "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY";
	currencySymbol?: string;
	decimalPlaces?: number;
}

// What the client sends to the server
export interface ChatRequest {
	messages: Array<{
		role: "user" | "assistant" | "system";
		content: string;
	}>;
	context?: Partial<MoneyWorksChatContext>;
}

// Server streaming response format
export type ChatStreamResponse = {};
