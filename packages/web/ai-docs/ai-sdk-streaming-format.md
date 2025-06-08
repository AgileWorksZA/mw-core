# AI SDK Streaming Format Documentation

## Overview

The Vercel AI SDK uses a specific streaming format called the "Data Stream Protocol" to send structured data from the server to the client. This format allows for real-time streaming of AI responses with support for text, tool calls, metadata, and more.

## Stream Part Prefixes

Each part of the stream is prefixed with a specific character/number followed by a colon. Here are the prefixes and their meanings:

### Core Message Parts
- **`0:`** - Text content from the LLM response
- **`f:`** - Start of a new step/message (includes messageId)
- **`e:`** - End of a step (includes finishReason and optional usage statistics)
- **`d:`** - Finish of a complete message (with finishReason)

### Tool-Related Parts
- **`9:`** - Tool call information
- **`a:`** - Tool result/response

### Additional Data
- **`2:`** - Custom JSON data added by the user
- **`g:`** - Reasoning text (for models that support reasoning)
- **`h:`** - Source information
- **`k:`** - File data (base64 encoded)

## Example Stream Format

A typical streaming response looks like this:

```
f:{"messageId":"msg_123456"}
0:"Hello! I can help you with MoneyWorks. "
0:"What would you like to know?"
e:{"finishReason":"stop","usage":{"promptTokens":45,"completionTokens":15}}
```

## How It Works

1. **Server Side**: When you use `streamText()` and call `toDataStreamResponse()`, the AI SDK automatically formats the stream parts with appropriate prefixes.

2. **Client Side**: The `useChat()` hook from `ai/react` automatically parses these stream parts and reconstructs the messages, handling:
   - Incremental text updates
   - Tool calls and results
   - Message metadata
   - Error states

## Implementation in Your Code

Your MoneyWorks AI implementation (`/app/routes/api.moneyworks-ai.ts`) uses:

```typescript
const result = await streamText({
  model: openai("gpt-4o"),
  system: getSystemPrompt(mcpTools, hasTicketTool),
  messages,
  tools: Object.keys(tools).length > 0 ? tools : undefined,
  toolChoice: "auto",
  maxSteps: 5,
});

// This converts the stream to the proper format
const response = result.toDataStreamResponse();
```

The client-side (`MoneyWorksAIChat` component) uses:

```typescript
const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
  api: "/api/moneyworks-ai",
  onError: (err) => {
    console.error("Chat error:", err);
  },
});
```

The `useChat` hook automatically handles parsing the stream format and updating the UI in real-time.

## Benefits

1. **Type Safety**: Each prefix corresponds to a specific data type
2. **Streaming Support**: Allows incremental updates without waiting for the full response
3. **Rich Data**: Supports not just text but also tool calls, metadata, and custom data
4. **Error Handling**: Built-in support for error states and finish reasons
5. **Usage Tracking**: Can include token usage information for monitoring

## Debugging

To debug streaming issues:
1. Check the Network tab to see the raw stream data
2. Look for the correct prefixes in the stream
3. Ensure the server is setting proper headers (`text/event-stream`)
4. Verify the client is using the correct API endpoint

The format is designed to be both efficient for streaming and easy to parse on the client side.