import { z } from "zod";
import type { TicketService } from "../services/ticket-service";

let ticketService: TicketService;

export function initializeLogTicketTool(service: TicketService) {
	ticketService = service;
}

// Schema for logging tickets
const logTicketSchema = z.object({
	type: z
		.enum(["bug", "feature_request", "improvement"])
		.describe(
			"Type of ticket: bug for errors/issues, feature_request for missing functionality, improvement for enhancements",
		),

	severity: z
		.enum(["low", "medium", "high", "critical"])
		.default("medium")
		.describe("Severity of the issue: low, medium, high, or critical"),

	toolName: z
		.string()
		.optional()
		.describe("Name of the tool that caused the issue or needs the feature"),

	title: z
		.string()
		.describe("Brief title summarizing the issue or feature request"),

	description: z
		.string()
		.describe(
			"Detailed description of the problem, steps to reproduce, or feature requirements",
		),

	userPrompt: z
		.string()
		.optional()
		.describe("The original user prompt that led to this issue"),

	attemptedAction: z
		.string()
		.optional()
		.describe("What action was attempted when the issue occurred"),

	errorMessage: z.string().optional().describe("Any error message received"),

	expectedBehavior: z
		.string()
		.optional()
		.describe("What was expected to happen"),

	actualBehavior: z.string().optional().describe("What actually happened"),

	suggestedSolution: z
		.string()
		.optional()
		.describe("Any suggested solution or implementation approach"),

	context: z
		.record(z.any())
		.optional()
		.describe("Additional context data as key-value pairs"),

	tags: z
		.array(z.string())
		.optional()
		.describe(
			"Tags to categorize this ticket (e.g., 'api', 'schema', 'validation')",
		),
});

export const logTicketTool = {
	description:
		"Log a ticket for bugs, feature requests, or improvements in the MoneyWorks MCP tools",
	inputSchema: logTicketSchema,

	async execute(args: z.infer<typeof logTicketSchema>) {
		if (!ticketService) {
			throw new Error("Ticket service not initialized");
		}

		try {
			// Create the ticket
			const ticketData = {
				type: args.type,
				severity: args.severity,
				status: "open" as const,
				user_prompt: args.userPrompt || args.title,
				ai_attempted_action:
					args.attemptedAction || `Reported ${args.type}: ${args.title}`,
				mcp_tool_used: args.toolName || "manual_report",
				api_endpoint: args.toolName ? `${args.toolName} operation` : "N/A",
				error_message: args.errorMessage || args.description,
				error_stack: args.actualBehavior,
				api_response_code: args.type === "bug" ? 500 : undefined,
				api_response_body: JSON.stringify({
					expected: args.expectedBehavior,
					actual: args.actualBehavior,
					suggestion: args.suggestedSolution,
				}),
				session_id: Date.now().toString(),
				api_version: "1.0.0",
			};

			const ticketId = await ticketService.createTicket(ticketData);

			// Add context if provided
			if (args.context) {
				await ticketService.addContext(ticketId, "state", args.context);
			}

			// Add description as context
			await ticketService.addContext(ticketId, "state", {
				description: args.description,
				type: "user_description",
			});

			// Add tags
			const tags = args.tags || [];

			// Auto-add tags based on type
			if (args.type === "bug") tags.push("bug");
			if (args.type === "feature_request") tags.push("feature-request");
			if (args.type === "improvement") tags.push("enhancement");

			// Add tool-specific tag
			if (args.toolName) tags.push(args.toolName);

			// Add severity tag
			if (args.severity === "critical" || args.severity === "high") {
				tags.push("priority");
			}

			if (tags.length > 0) {
				await ticketService.addTags(ticketId, tags);
			}

			// Get the created ticket for confirmation
			const ticket = await ticketService.getTicket(ticketId);

			if (!ticket) {
				throw new Error(`Failed to retrieve created ticket #${ticketId}`);
			}

			return {
				success: true,
				ticketId,
				message: `Ticket #${ticketId} created successfully`,
				ticket: {
					id: ticket.id,
					type: ticket.type,
					severity: ticket.severity,
					status: ticket.status,
					title: args.title,
					description: args.description,
					createdAt: ticket.created_at,
					tags: tags,
				},
				nextSteps: [
					"The development team will review this ticket",
					args.type === "bug"
						? "We'll investigate and fix the issue"
						: args.type === "feature_request"
							? "We'll evaluate the feature request for implementation"
							: "We'll consider this improvement for future updates",
				],
			};
		} catch (error) {
			// Even if ticket creation fails, return a helpful response
			return {
				success: false,
				message: "Failed to create ticket, but your feedback has been noted",
				error: error instanceof Error ? error.message : "Unknown error",
				alternativeAction:
					"Please report this issue manually to the development team",
				reportedIssue: {
					type: args.type,
					title: args.title,
					description: args.description,
				},
			};
		}
	},
};
