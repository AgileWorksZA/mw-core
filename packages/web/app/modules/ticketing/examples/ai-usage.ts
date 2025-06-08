import { createSupportTicket } from "../utils/create-support-ticket";

// Example 1: API Error
export async function handleAPIError(userQuery: string, error: Error) {
  const { ticketId, success } = await createSupportTicket({
    userQuery,
    error,
    category: "api_error",
    metadata: {
      endpoint: "/api/moneyworks/transactions",
      errorCode: "NETWORK_ERROR",
    },
  });

  if (success) {
    return `I apologize, but I encountered an error while accessing the MoneyWorks API. 

The API returned an error: "${error.message}"

I've logged this issue with our support team (Ticket #${ticketId}) and they will investigate the problem. 

In the meantime, you might want to check your MoneyWorks application directly to ensure your data is syncing properly.

Is there anything else I can help you with?`;
  }

  return "I encountered an error and was unable to log it properly. Please try again later or contact support directly.";
}

// Example 2: Missing Feature
export async function handleMissingFeature(userQuery: string, requestedFeature: string) {
  const { ticketId, success } = await createSupportTicket({
    userQuery,
    aiResponse: `User requested ${requestedFeature} which is not currently available.`,
    category: "missing_feature",
    metadata: {
      feature: requestedFeature,
      userIntent: "automation",
    },
  });

  if (success) {
    return `I understand you'd like to ${requestedFeature}, but this functionality isn't available in the AI assistant yet.

I've created a feature request (Ticket #${ticketId}) for our development team to consider adding this capability.

For now, you can perform this action through the MoneyWorks application by navigating to the relevant section.

Can I help you with any other MoneyWorks queries?`;
  }

  return "This feature is not currently available. Please check back later or use the MoneyWorks application directly.";
}

// Example 3: Unclear Query
export async function handleUnclearQuery(userQuery: string, clarificationNeeded: string) {
  const { ticketId, success } = await createSupportTicket({
    userQuery,
    aiResponse: "Unable to understand the user's request clearly.",
    category: "unclear_query",
    metadata: {
      clarificationNeeded,
      attemptedInterpretations: ["interpretation1", "interpretation2"],
    },
  });

  if (success) {
    return `I'm having difficulty understanding exactly what you're looking for. Could you provide more details about ${clarificationNeeded}?

I've logged this interaction (Ticket #${ticketId}) to help improve my understanding of similar requests in the future.

Perhaps you could try rephrasing your question or breaking it down into smaller parts? For example:
- Are you looking for transaction data?
- Do you need help with reports?
- Are you trying to manage accounts?

What specific aspect of MoneyWorks would you like help with?`;
  }

  return "I'm having trouble understanding your request. Could you please rephrase or provide more details?";
}

// Example 4: Data Issue
export async function handleDataIssue(userQuery: string, dataIssue: string) {
  const { ticketId, success } = await createSupportTicket({
    userQuery,
    aiResponse: `Encountered data issue: ${dataIssue}`,
    category: "data_issue",
    metadata: {
      issueType: "missing_data",
      affectedRecords: "transactions",
    },
  });

  if (success) {
    return `I noticed an issue with the data while processing your request: ${dataIssue}

I've reported this issue to our support team (Ticket #${ticketId}) for investigation.

To help resolve this:
1. Please ensure your MoneyWorks data is fully synchronized
2. Check if there are any pending updates in the application
3. Verify that all required fields are properly filled

Would you like me to help you with something else while this is being resolved?`;
  }

  return "There appears to be an issue with the data. Please ensure your MoneyWorks data is fully synchronized and try again.";
}

// Example 5: Authentication Issue
export async function handleAuthenticationIssue(userQuery: string) {
  const { ticketId, success } = await createSupportTicket({
    userQuery,
    category: "authentication",
    metadata: {
      authType: "api_key",
      timestamp: new Date().toISOString(),
    },
  });

  if (success) {
    return `I'm having trouble authenticating with the MoneyWorks API. This might be due to:
- Expired credentials
- Invalid API key
- Permission restrictions

I've logged this issue (Ticket #${ticketId}) for immediate attention.

Please try:
1. Checking your MoneyWorks connection settings
2. Ensuring your API credentials are up to date
3. Verifying your account has the necessary permissions

Can I assist you with anything else?`;
  }

  return "Authentication failed. Please check your MoneyWorks credentials and try again.";
}