import { z } from "zod";

// Issue types
export const IssueType = z.enum(["bug", "feature_request", "improvement"]);
export const IssueSeverity = z.enum(["low", "medium", "high", "critical"]);
export const IssueStatus = z.enum([
	"open",
	"in_progress",
	"resolved",
	"closed",
]);

export const IssueSchema = z.object({
	id: z.number().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),

	// Categorization
	type: IssueType,
	severity: IssueSeverity,
	status: IssueStatus.default("open"),

	// Context
	user_prompt: z.string(),
	ai_attempted_action: z.string().nullable().optional(),
	mcp_tool_used: z.string().nullable().optional(),
	api_endpoint: z.string().nullable().optional(),

	// Error details
	error_message: z.string().nullable().optional(),
	error_stack: z.string().nullable().optional(),
	api_response_code: z.number().nullable().optional(),
	api_response_body: z.string().nullable().optional(),

	// Resolution
	resolution_notes: z.string().nullable().optional(),
	resolved_by: z.string().nullable().optional(),
	resolved_at: z.string().nullable().optional(),

	// Metadata
	session_id: z.string().nullable().optional(),
	moneyworks_version: z.string().nullable().optional(),
	api_version: z.string().nullable().optional(),
});

export type Issue = z.infer<typeof IssueSchema>;

// Tool type for MCP tools
export interface Tool<T> {
	name: string;
	description: string;
	inputSchema: z.ZodSchema<T>;
	execute: (args: T) => Promise<unknown>;
}
