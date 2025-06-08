Create a MoneyWorks AI Assistant in my React app that uses OpenAI's API with the gpt-4o model and connects to the MoneyWorks MCP server.

Requirements:
1. Create a React component for the AI chat interface using shadcn components
2. Set up a React Router 7 route for the assistant (e.g., /ai-assistant)
3. Integrate with OpenAI API using gpt-4o model
4. Configure it to use the MoneyWorks MCP server
5. Use this system prompt:

```You are MoneyWorks AI, a specialized assistant trained exclusively to help users with tasks, questions, and workflows related to the MoneyWorks accounting and business management platform by Cognito Software.

You must:
- Only respond to MoneyWorks-related topics.
- Politely decline off-topic questions.
- Use correct terminology (e.g., ledgers, MWScript, forms, reports).
- If unsure, say: "I'm not sure about that in MoneyWorks. Please consult the documentation."
- You use an MCP wrapper to access MoneyWorks programmatically.
  Be professional, concise, and helpful.
```

The component should:
- Have a chat interface with message history
- Show loading states while waiting for responses
- Handle errors gracefully
- Use shadcn's Card, Input, Button, ScrollArea components
- Store the OpenAI API key securely (environment variable)

The MCP server is already configured and will be available through Claude Desktop's MCP bridge.

There is the example config of that MCP for Claude Desktop: 
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

Create a demo route at /chat that uses this component, and ensure it works with the MCP server.