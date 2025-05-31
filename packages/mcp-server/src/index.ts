#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TicketService } from "./services/ticket-service";
import {
	getAccountTool,
	listAccountFieldsTool,
	searchAccountsTool,
} from "./tools/account";

// Configuration
const TICKETS_DB_PATH = process.env.TICKETS_DB_PATH || "./data/tickets.db";

// Initialize services
const ticketService = new TicketService(TICKETS_DB_PATH);

// Session tracking
const sessionId = Date.now().toString();

// Initialize MCP server
const server = new McpServer({
	name: "moneyworks-assistant",
	version: "1.0.0",
});

// Register searchAccounts tool
server.tool(
	"searchAccounts",
	"Search for accounts in MoneyWorks by code, description, type, or category",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for account code or description"),
		type: z
			.enum(["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"])
			.optional()
			.describe(
				"Account type filter: IN=Income, SA=Sales, EX=Expense, CS=Cost of Sales, CA=Current Asset, CL=Current Liability, FA=Fixed Asset, TA=Term Asset, TL=Term Liability, SF=Shareholders Funds",
			),
		category: z.string().optional().describe("Category code filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchAccountsTool.execute(args);
			return {
				content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
			};
		} catch (error) {
			return await handleToolError("searchAccounts", args, error);
		}
	},
);

// Register getAccount tool
server.tool(
	"getAccount",
	"Get a specific account by its code",
	{
		code: z.string().describe("The account code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getAccountTool.execute(args);
			return {
				content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
			};
		} catch (error) {
			return await handleToolError("getAccount", args, error);
		}
	},
);

// Register listAccountFields tool
server.tool(
	"listAccountFields",
	"List all available fields for accounts",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listAccountFieldsTool.execute();
			return {
				content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
			};
		} catch (error) {
			return await handleToolError("listAccountFields", {}, error);
		}
	},
);

// Helper function to handle tool errors and log to ticketing system
async function handleToolError(
	toolName: string,
	args: unknown,
	error: unknown,
) {
	const err = error as Error & { code?: number; details?: unknown };
	const errorType = err.code === 404 ? "feature_request" : "bug";
	const severity = err.code && err.code >= 500 ? "high" : "medium";

	// Log error to ticket system
	const ticketId = await ticketService.createTicket({
		type: errorType,
		severity,
		status: "open",
		user_prompt: JSON.stringify(args),
		ai_attempted_action: `Execute tool: ${toolName}`,
		mcp_tool_used: toolName,
		api_endpoint: `${toolName} operation`,
		error_message: err.message || "Unknown error",
		error_stack: err.stack,
		api_response_code: err.code,
		api_response_body: JSON.stringify(err.details || err),
		session_id: sessionId,
		api_version: "1.0.0",
	});

	// Add context
	await ticketService.addContext(ticketId, "request", args);
	if (err.details) {
		await ticketService.addContext(ticketId, "response", err.details);
	}

	// Add tags based on error type
	const tags = [toolName];
	if (err.code === 404) tags.push("not-found");
	if (err.code === 401) tags.push("auth-error");
	if (err.code && err.code >= 500) tags.push("server-error");
	if (err.message?.includes("not found")) tags.push("missing-feature");
	await ticketService.addTags(ticketId, tags);

	// Return user-friendly error
	return {
		content: [
			{
				type: "text" as const,
				text: `Error executing ${toolName}: ${err.message}. This issue has been logged for improvement (Ticket #${ticketId}).`,
			},
		],
		isError: true,
	};
}

// Start server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("MoneyWorks MCP server started");
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
