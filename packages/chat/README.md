# @moneyworks/chat

AI-powered chat interface for MoneyWorks accounting software, built with TypeScript, React, and the Vercel AI SDK.

## Features

- 🤖 **AI-Powered Assistant**: Claude-based chat interface specialized for MoneyWorks
- 🔄 **Real-time Streaming**: Server-sent events for responsive chat experience
- 🛠️ **MCP Tool Integration**: Direct access to MoneyWorks operations
- 📊 **Rich Data Display**: Custom renderers for transactions, reports, and tax rates
- 🔒 **Secure Architecture**: Clear client/server separation, no API keys in browser
- 🎨 **Tailwind Styling**: Beautiful, responsive UI components
- 📝 **TypeScript First**: Full type safety across client and server

## Architecture

The package is structured with clear separation between client and server code:

```
packages/chat/
├── src/
│   ├── client/          # Browser-side code only
│   │   ├── components/  # React components
│   │   ├── hooks/       # React hooks
│   │   └── utils/       # Client utilities
│   ├── server/          # Server-side code only
│   │   ├── chat-service.ts    # AI integration
│   │   ├── tools.ts           # MCP tools
│   │   └── stream-handler.ts  # SSE handling
│   └── shared/          # Shared types
│       └── types/       # TypeScript definitions
```

## Installation

```bash
bun add @moneyworks/chat
```

## Usage

### Server Setup (React Router Action)

```typescript
// app/routes/api.chat.tsx
import { type ActionFunctionArgs } from "react-router";
import { createChatStreamHandler, createSSEResponse } from "@moneyworks/chat/server";
import type { ChatRequest, MoneyWorksChatContext } from "@moneyworks/chat";

export async function action({ request }: ActionFunctionArgs) {
  // Get user and connection details
  const user = await requireUser(request);
  const connection = await getActiveConnection(user.id);
  
  // Parse chat request
  const formData = await request.formData();
  const chatRequest: ChatRequest = JSON.parse(formData.get('request'));
  
  // Create MW client config (keep on server only!)
  const mwClientConfig = {
    host: connection.mw_host,
    port: connection.mw_port,
    dataFile: connection.mw_data_file,
    username: connection.mw_username,
    password: connection.mw_password,
  };
  
  // Create chat context
  const chatContext: MoneyWorksChatContext = {
    connectionId: connection.id,
    companyName: connection.company_name,
    userId: user.id,
    permissions: user.permissions,
  };
  
  // Create handler
  const handler = createChatStreamHandler(
    {
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      model: 'claude-3-5-sonnet-20241022',
    },
    mwClientConfig
  );
  
  // Stream response
  const stream = await handler(chatRequest, chatContext);
  return createSSEResponse(stream);
}
```

### Client Setup (React Component)

```typescript
// app/routes/chat.tsx
import { MoneyWorksChat, MWChatContextProvider } from "@moneyworks/chat/client";
import type { MoneyWorksChatContext } from "@moneyworks/chat";

export default function ChatPage() {
  const { chatContext } = useLoaderData<typeof loader>();
  
  return (
    <MWChatContextProvider value={chatContext}>
      <MoneyWorksChat
        apiEndpoint="/api/chat"
        welcomeMessage="Welcome to MoneyWorks Assistant!"
        className="h-[600px]"
      />
    </MWChatContextProvider>
  );
}
```

### Custom Hook Usage

```typescript
import { useMoneyWorksChat } from "@moneyworks/chat/client";

function CustomChatComponent() {
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    clearMessages,
    cancelStream
  } = useMoneyWorksChat({
    apiEndpoint: '/api/chat',
    onError: (error) => console.error('Chat error:', error),
    onMessage: (message) => console.log('New message:', message)
  });
  
  // Build your own UI
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input onSubmit={(e) => sendMessage(e.target.value)} />
    </div>
  );
}
```

## Available Tools

The chat service includes several MoneyWorks-specific tools:

### 1. Get Transactions
```typescript
// Searches transactions with filtering
getTransactions({
  type: 'DII',              // Transaction type
  dateFrom: '2024-01-01',   // Start date
  dateTo: '2024-12-31',     // End date
  nameCode: 'CUST001',      // Customer/supplier code
  status: 'P',              // Posted status
  limit: 20                 // Max results
})
```

### 2. Get Tax Rate
```typescript
// Retrieves tax rate details
getTaxRate({
  taxCode: 'GST10'
})
```

### 3. Search Names
```typescript
// Searches customers/suppliers
searchNames({
  query: 'Smith',
  type: 'customer',  // 'customer', 'supplier', or 'both'
  limit: 10
})
```

### 4. Run Reports
```typescript
// Generates financial reports
runReport({
  reportType: 'aged_receivables',
  period: '202401'
})
```

## Message Renderers

The package includes specialized renderers for MoneyWorks data:

- **TransactionDisplay**: Rich display of invoices and bills
- **ReportDisplay**: Formatted financial reports with charts
- **TaxRateDisplay**: Tax rate details with calculations

## Security Considerations

1. **API Keys**: Never expose API keys to the client. Keep them in server-side environment variables.
2. **Connection Details**: MoneyWorks credentials stay on the server, only non-sensitive context goes to client.
3. **Permissions**: Implement proper permission checks in your action handlers.

## Environment Variables

Required server-side environment variables:

```env
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Customization

### Custom Message Renderers

```typescript
import { MoneyWorksMessage } from "@moneyworks/chat";

function CustomMessageRenderer({ message }: { message: MoneyWorksMessage }) {
  if (message.mwData?.type === 'custom') {
    return <CustomDisplay data={message.mwData.data} />;
  }
  
  return <DefaultMessage message={message} />;
}
```

### Adding New Tools

```typescript
// In your server-side tools configuration
export function createCustomTools(client: SmartMoneyWorksClient) {
  return {
    customTool: tool({
      description: 'Custom MoneyWorks operation',
      parameters: z.object({
        param: z.string()
      }),
      execute: async ({ param }) => {
        return await client.customOperation(param);
      }
    })
  };
}
```

## Best Practices

1. **Context Management**: Use the MWChatContextProvider to share context across components
2. **Error Handling**: Always handle streaming errors gracefully
3. **Loading States**: Show appropriate feedback during tool execution
4. **Message Limits**: Consider implementing pagination for long conversations
5. **Rate Limiting**: Implement rate limiting on your API endpoints

## Development

```bash
# Install dependencies
bun install

# Build the package
bun run build

# Run type checking
bun run typecheck
```

## License

MIT