# Ticketing System for MoneyWorks AI Assistant

This module provides a comprehensive ticketing system to track and manage issues, errors, and feature requests encountered by the MoneyWorks AI Assistant.

## Overview

The ticketing system helps:
- Log API errors and technical issues
- Track feature requests from users
- Document unclear queries for improvement
- Manage resolution workflow with a Kanban board
- Provide graceful error handling for the AI assistant

## Architecture

### Components

1. **Database Layer** (`db/`)
   - `schema.server.ts`: SQLite database implementation
   
2. **API Routes**
   - `/api/tickets`: Create and list tickets
   - `/api/tickets/:id`: Update individual tickets

3. **UI Components**
   - `/tickets`: Kanban board view for ticket management
   - Ticket detail modal for viewing and updating tickets

4. **Utilities**
   - `create-support-ticket.ts`: Helper function for AI to create tickets
   - `ai-instructions.md`: Guidelines for AI error handling

## Usage

### For AI Assistant Integration

```typescript
import { createSupportTicket } from "~/modules/ticketing/utils/create-support-ticket";

// When encountering an error
const { ticketId, success } = await createSupportTicket({
  userQuery: "User's original question",
  aiResponse: "Your attempted response",
  error: errorObject,
  category: "api_error",
  metadata: {
    endpoint: "/api/endpoint",
    errorCode: "TIMEOUT"
  }
});

// Respond to user
if (success) {
  return `I apologize, but I encountered an issue. I've logged this with our support team (Ticket #${ticketId})...`;
}
```

### Ticket Categories

- `api_error`: API-related issues
- `missing_feature`: Requested features not available
- `unclear_query`: Ambiguous user requests
- `data_issue`: Data quality or consistency problems
- `authentication`: Auth-related issues
- `other`: General issues

### Ticket Status Flow

1. `new`: Newly created tickets
2. `in_progress`: Being worked on
3. `blocked`: Waiting on external factors
4. `resolved`: Issue has been resolved
5. `closed`: Ticket is closed

## Development

### Database Configuration

Set database path (optional):
```bash
export TICKETING_DB_PATH="./path/to/ticketing.db"
```

### Adding New Features

1. Update types in `types.ts`
2. Implement in `schema.server.ts`
3. Update API routes as needed
4. Update UI components

## Best Practices

### For AI Integration

1. **Always provide context**: Include user query, AI response, and error details
2. **Use appropriate categories**: This helps with routing and prioritization
3. **Include metadata**: Add any relevant context (endpoints, error codes, etc.)
4. **Follow the template**: Use consistent messaging from `ai-instructions.md`

### For Support Team

1. **Update status promptly**: Move tickets through the workflow
2. **Add resolution details**: Document how issues were resolved
3. **Use filters**: Focus on specific categories or priorities
4. **Review patterns**: Look for recurring issues to improve the system

## Example AI Responses

### API Error
```
I apologize, but I encountered an error while accessing the MoneyWorks API.

I've logged this issue with our support team (Ticket #ABC123) and they will investigate.

In the meantime, you might want to check your MoneyWorks application directly.

Is there anything else I can help you with?
```

### Missing Feature
```
I understand you'd like to [feature], but this isn't available yet.

I've created a feature request (Ticket #DEF456) for our development team.

For now, you can [alternative approach] through MoneyWorks.

Can I help you with any other queries?
```

## Monitoring

The Kanban board at `/tickets` provides:
- Overview statistics (total, new, in progress, resolved)
- Visual workflow management
- Filtering by category and priority
- Quick status updates via drag-and-drop
- Detailed view with full context

## Future Enhancements

- Email notifications for high-priority tickets
- SLA tracking and alerts
- Integration with external ticketing systems
- Analytics and reporting dashboard
- Automated ticket assignment based on category