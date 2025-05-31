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
	ai_attempted_action: z.string().optional(),
	mcp_tool_used: z.string().optional(),
	api_endpoint: z.string().optional(),

	// Error details
	error_message: z.string().optional(),
	error_stack: z.string().optional(),
	api_response_code: z.number().optional(),
	api_response_body: z.string().optional(),

	// Resolution
	resolution_notes: z.string().optional(),
	resolved_by: z.string().optional(),
	resolved_at: z.string().optional(),

	// Metadata
	session_id: z.string().optional(),
	moneyworks_version: z.string().optional(),
	api_version: z.string().optional(),
});

export type Issue = z.infer<typeof IssueSchema>;
