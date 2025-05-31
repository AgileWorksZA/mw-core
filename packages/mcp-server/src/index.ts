#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
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

// Initialize MCP server
const server = new Server(
  {
    name: "moneyworks-assistant",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Tool registry
const tools = {
  searchAccounts: searchAccountsTool,
  getAccount: getAccountTool,
  listAccountFields: listAccountFieldsTool,
  // More tools will be added here for other tables
};

// Session tracking
const sessionId = Date.now().toString();

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(tools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  const tool = tools[name as keyof typeof tools];
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    // Validate input
    const validatedArgs = tool.inputSchema.parse(args);

    // Execute tool
    const result = await tool.execute(validatedArgs);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    // Determine error details
    const isApiError = error.message?.includes("MoneyWorks") || error.code;
    const errorType = error.code === 404 ? "feature_request" : "bug";
    const severity = error.code >= 500 ? "high" : "medium";

    // Log error to ticket system
    const ticketId = await ticketService.createTicket({
      type: errorType,
      severity,
      status: "open",
      user_prompt: JSON.stringify(args),
      ai_attempted_action: `Execute tool: ${name}`,
      mcp_tool_used: name,
      api_endpoint: `${name} operation`,
      error_message: error.message || "Unknown error",
      error_stack: error.stack,
      api_response_code: error.code,
      api_response_body: JSON.stringify(error.details || error),
      session_id: sessionId,
      api_version: "1.0.0",
    });

    // Add context
    await ticketService.addContext(ticketId, "request", args);
    if (error.details) {
      await ticketService.addContext(ticketId, "response", error.details);
    }

    // Add tags based on error type
    const tags = [name];
    if (error.code === 404) tags.push("not-found");
    if (error.code === 401) tags.push("auth-error");
    if (error.code >= 500) tags.push("server-error");
    if (error.message?.includes("not found")) tags.push("missing-feature");
    await ticketService.addTags(ticketId, tags);

    // Return user-friendly error
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${error.message}. This issue has been logged for improvement (Ticket #${ticketId}).`,
        },
      ],
      isError: true,
    };
  }
});

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
