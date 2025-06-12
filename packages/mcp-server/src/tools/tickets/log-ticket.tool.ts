/**
 * Ticket logging tool for error tracking
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TicketService } from "../../services/ticket.service";

const logTicketSchema = z.object({
  operation: z.enum(["log", "list", "update", "stats"]).describe("Operation to perform"),
  
  // For logging
  tool: z.string().optional().describe("Tool name where error occurred"),
  error: z.string().optional().describe("Error message"),
  context: z.any().optional().describe("Additional context"),
  
  // For listing
  filterTool: z.string().optional().describe("Filter by tool name"),
  filterStatus: z.enum(["open", "resolved", "ignored"]).optional().describe("Filter by status"),
  limit: z.number().optional().describe("Limit results"),
  
  // For updating
  ticketId: z.string().optional().describe("Ticket ID to update"),
  newStatus: z.enum(["open", "resolved", "ignored"]).optional().describe("New status"),
});

export function registerLogTicketTool(server: McpServer, ticketService: TicketService) {
  server.tool(
    "log_ticket",
    "Log errors, issues, and improvement suggestions for systematic tracking",
    logTicketSchema,
    async (params: unknown) => {
      const input = logTicketSchema.parse(params);
      
      try {
        switch (input.operation) {
          case "log": {
            if (!input.tool || !input.error) {
              throw new Error("Tool and error are required for logging");
            }

            const ticket = await ticketService.createTicket({
              tool: input.tool,
              error: input.error,
              context: input.context,
            });

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  ticket: {
                    id: ticket.id,
                    tool: ticket.tool,
                    error: ticket.error,
                    createdAt: ticket.createdAt,
                    status: ticket.status,
                  },
                  message: "Error ticket logged successfully",
                }, null, 2)
              }]
            };
          }

          case "list": {
            const tickets = await ticketService.getTickets({
              tool: input.filterTool,
              status: input.filterStatus,
              limit: input.limit || 50,
            });

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  count: tickets.length,
                  tickets: tickets.map(t => ({
                    id: t.id,
                    tool: t.tool,
                    error: t.error,
                    status: t.status,
                    createdAt: t.createdAt,
                  })),
                }, null, 2)
              }]
            };
          }

          case "update": {
            if (!input.ticketId || !input.newStatus) {
              throw new Error("Ticket ID and new status are required");
            }

            await ticketService.updateTicketStatus(input.ticketId, input.newStatus);

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  ticketId: input.ticketId,
                  newStatus: input.newStatus,
                  message: "Ticket status updated successfully",
                }, null, 2)
              }]
            };
          }

          case "stats": {
            const stats = await ticketService.getStats();

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  stats,
                }, null, 2)
              }]
            };
          }

          default:
            throw new Error(`Unknown operation: ${input.operation}`);
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
            }, null, 2)
          }]
        };
      }
    }
  );
}