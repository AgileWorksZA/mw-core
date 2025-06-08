import type { CreateTicketInput, TicketCategory } from "../types";

interface CreateSupportTicketOptions {
  userQuery: string;
  aiResponse?: string;
  error?: Error | unknown;
  category?: TicketCategory;
  metadata?: Record<string, any>;
}

export async function createSupportTicket({
  userQuery,
  aiResponse,
  error,
  category = "api_error",
  metadata = {},
}: CreateSupportTicketOptions): Promise<{ ticketId: string; success: boolean }> {
  try {
    // Determine title based on error or category
    let title = "MoneyWorks AI Assistant Issue";
    let description = "An issue was encountered while processing a user query.";
    let errorDetails: string | undefined;

    if (error) {
      if (error instanceof Error) {
        title = `Error: ${error.message}`;
        errorDetails = error.stack;
      } else {
        title = "Unknown Error Occurred";
        errorDetails = String(error);
      }
    } else {
      // Categorize the issue
      switch (category) {
        case "missing_feature":
          title = "Missing Feature Request";
          description = "The AI assistant was unable to fulfill this request due to missing functionality.";
          break;
        case "unclear_query":
          title = "Unclear User Query";
          description = "The AI assistant could not understand the user's request clearly.";
          break;
        case "data_issue":
          title = "Data Issue Encountered";
          description = "There was an issue with the data while processing the request.";
          break;
        case "authentication":
          title = "Authentication Issue";
          description = "An authentication problem prevented the request from being completed.";
          break;
        case "other":
        default:
          title = "General Support Request";
          description = "The AI assistant encountered an issue processing this request.";
      }
    }

    const ticketData: CreateTicketInput = {
      title,
      description,
      userQuery,
      aiResponse,
      errorDetails,
      category,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        source: "moneyworks_ai_assistant",
      },
    };

    // Create ticket via API
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        title: ticketData.title,
        description: ticketData.description,
        userQuery: ticketData.userQuery,
        aiResponse: ticketData.aiResponse || "",
        errorDetails: ticketData.errorDetails || "",
        category: ticketData.category,
        metadata: JSON.stringify(ticketData.metadata),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create ticket: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      ticketId: result.ticket.id,
      success: true,
    };
  } catch (err) {
    console.error("Failed to create support ticket:", err);
    return {
      ticketId: "",
      success: false,
    };
  }
}