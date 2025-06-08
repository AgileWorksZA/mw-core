# MoneyWorks AI Assistant

## Overview

The MoneyWorks AI Assistant is a specialized chat interface that integrates with OpenAI's GPT-4o model and the MoneyWorks MCP (Model Context Protocol) server. It provides an AI-powered assistant specifically trained to help with MoneyWorks accounting and business management tasks.

## Features

- **Specialized AI Assistant**: Trained exclusively for MoneyWorks-related topics
- **OpenAI GPT-4o Integration**: Uses the latest GPT-4o model for intelligent responses
- **MCP Server Support**: Can connect to MoneyWorks MCP server for programmatic access
- **Real-time Chat Interface**: Built with shadcn/ui components for a modern UI
- **Error Handling**: Graceful error handling with user-friendly messages
- **Message History**: Maintains conversation context throughout the session

## Setup

### 1. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# MoneyWorks MCP Server Configuration (optional)
MW_CONFIG_PATH=/path/to/mw-config.json
MCP_SERVER_PATH=/path/to/mcp-server/src/index.ts
```

### 2. Install Dependencies

```bash
bun install
```

### 3. MCP Server Configuration (Optional)

If you want to use the MCP server integration, ensure your MoneyWorks MCP server is configured and accessible. 

#### Database Setup

The MCP server requires a SQLite database. Make sure:
1. The database file exists at the path specified in your configuration
2. The path is accessible and has proper permissions
3. The parent directory exists

#### MCP Configuration

The MCP configuration typically looks like:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "bun",
      "args": ["run", "/path/to/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/path/to/mw-config.json"
      }
    }
  }
}
```

Your `mw-config.json` should include the database path:

```json
{
  "database": {
    "path": "/path/to/your/database.db"
  }
}
```

## Usage

### Routes

The MoneyWorks AI Assistant is available at two routes:

- `/ai-assistant` - Primary route for the AI assistant
- `/chat` - Demo route for testing

### API Endpoint

The chat interface communicates with the server through:
- `POST /api/moneyworks-ai` - Handles chat completions

### Component Usage

You can also use the chat component directly in your React components:

```tsx
import { MoneyWorksAIChat } from "~/components/moneyworks-ai/moneyworks-ai-chat";

export function MyComponent() {
  return (
    <div className="h-[600px]">
      <MoneyWorksAIChat />
    </div>
  );
}
```

## Architecture

### Components

1. **MoneyWorksAIChat** (`app/components/moneyworks-ai/moneyworks-ai-chat.tsx`)
   - Main chat interface component
   - Handles message state and UI rendering
   - Communicates with the API endpoint

2. **API Route** (`app/routes/api.moneyworks-ai.ts`)
   - Server-side endpoint for OpenAI API calls
   - Integrates with MCP server (when configured)
   - Handles authentication and error responses

3. **MCP Client** (`app/lib/mcp-client.ts`)
   - Wrapper for MCP SDK
   - Manages connection to MoneyWorks MCP server
   - Provides tool calling interface

### System Prompt

The AI assistant uses a specialized system prompt that ensures it:
- Only responds to MoneyWorks-related topics
- Uses correct MoneyWorks terminology
- Politely declines off-topic questions
- Acknowledges when unsure and directs to documentation

## Security Considerations

- OpenAI API key is stored server-side only
- All API calls are proxied through the server
- No sensitive credentials are exposed to the client
- MCP server connection is optional and server-side only

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured" error**
   - Ensure `OPENAI_API_KEY` is set in your `.env` file
   - Restart the development server after setting environment variables

2. **MCP Server Connection Failed**
   - Verify `MW_CONFIG_PATH` and `MCP_SERVER_PATH` are correct
   - Ensure the MCP server is running and accessible
   - Check server logs for connection errors

3. **"SQLITE_CANTOPEN" error**
   - This means the MCP server cannot find or open the database file
   - Check that the database path in your `mw-config.json` is correct
   - Ensure the database file exists or the parent directory is writable
   - Verify file permissions allow the process to access the database

4. **Chat not responding**
   - Check browser console for errors
   - Verify the API endpoint is accessible
   - Check server logs for API errors

**Note**: The chat functionality will work even if the MCP server connection fails. MCP features are optional and enhance the assistant's capabilities but are not required for basic operation.

## Future Enhancements

- Streaming responses for better UX
- Conversation persistence across sessions
- Advanced MCP tool integration
- Custom MoneyWorks knowledge base
- Multi-user support with authentication