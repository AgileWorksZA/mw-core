# SSE Streaming Guide for React Router & AI SDK

## Overview

This document explains how Server-Sent Events (SSE) streaming works in our application, specifically with React Router and the Vercel AI SDK. Understanding these patterns is crucial for successful refactoring.

## How SSE Works with React Router

### 1. Server-Side (API Route)

React Router API routes can return streaming responses by:
- Returning a `Response` object with appropriate headers
- Setting `Content-Type: text/event-stream`
- Using a `ReadableStream` for the body

```typescript
export async function action({ request }: ActionFunctionArgs) {
  // Create a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // Send data in SSE format
      controller.enqueue(encoder.encode("data: Hello\n\n"));
      controller.enqueue(encoder.encode("data: World\n\n"));
      
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }
  });
}
```

### 2. Client-Side Consumption

The client can consume SSE streams using:
- Native `EventSource` API
- Fetch API with stream reading
- Libraries like `@ai-sdk/react`'s `useChat` hook

## AI SDK Data Stream Protocol

### 1. Format Specification

The AI SDK uses a **data stream protocol** with prefixed messages:

```
[prefix][optional_hex_length]:[data]\n
```

For text content (prefix 0):
```
0:"Hello world"\n
```

For JSON data (includes hex length):
```
f1f:{"messageId":"msg_abc123"}\n
```

Key prefixes:
- `0`: Text content - format: `0:"text"`
- `f`: Step start - format: `f[hex]:{messageId}`
- `e`: Step finish - format: `e[hex]:{finishReason,usage}`
- `d`: Finish - format: `d[hex]:{finishReason,usage}`
- `9`: Tool call - format: `9[hex]:{toolCall}`
- `a`: Tool result - format: `a[hex]:{toolResult}`
- `3`: Error - format: `3:"error message"`

### 2. Message Types

The AI SDK supports these streaming message types:

```typescript
type TextStreamPart = 
  | { type: "text-delta"; textDelta: string }
  | { type: "tool-call"; toolCallId: string; toolName: string; args: any }
  | { type: "tool-result"; toolCallId: string; result: any }
  | { type: "finish"; finishReason: string; usage?: TokenUsage }
  | { type: "error"; error: string }
  | { type: "step-start"; stepType: string; metadata: any }
  | { type: "step-finish"; stepType: string; metadata: any };
```

### 3. Using AI SDK's Built-in Streaming

The **correct** way to implement streaming with AI SDK:

```typescript
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function action({ request }: ActionFunctionArgs) {
  const { messages } = await request.json();
  
  // Create streaming result
  const result = await streamText({
    model: openai("gpt-4"),
    messages,
  });
  
  // Convert to SSE response - this handles ALL formatting
  return result.toDataStreamResponse();
}
```

**Important**: `toDataStreamResponse()` automatically:
- Formats messages in the length-prefixed format
- Sets correct SSE headers
- Handles all message types (text, tools, errors)
- Manages the stream lifecycle

### 4. Client-Side with useChat

The `useChat` hook expects the exact format produced by `toDataStreamResponse()`:

```typescript
const { messages, input, handleSubmit, isLoading } = useChat({
  api: "/api/chat",  // Must return result.toDataStreamResponse()
  body: { 
    // Additional data sent with each request
    sessionId: "123" 
  },
  onFinish: (message) => {
    // Called when streaming completes
  },
  onError: (error) => {
    // Handle errors
  }
});
```

## Rules to Honor When Refactoring

### ✅ DO:

1. **Always use `toDataStreamResponse()`** when using AI SDK's `streamText`
   ```typescript
   const result = await streamText({ ... });
   return result.toDataStreamResponse();
   ```

2. **Keep the response headers intact** if manually streaming
   ```typescript
   headers: {
     "Content-Type": "text/event-stream",
     "Cache-Control": "no-cache", 
     "Connection": "keep-alive",
   }
   ```

3. **Use the length-prefixed format** for manual streaming
   ```typescript
   const data = { type: "text-delta", textDelta: "Hello" };
   const json = JSON.stringify(data);
   const hex = json.length.toString(16);
   controller.enqueue(encoder.encode(`${hex}:${json}\n`));
   ```

4. **Handle errors gracefully** in the stream
   ```typescript
   try {
     // streaming logic
   } catch (error) {
     const errorData = { type: "error", error: error.message };
     // Send error in correct format
   }
   ```

### ❌ DON'T:

1. **Don't mix SSE event format with AI SDK format**
   ```typescript
   // WRONG - SSE event format
   controller.enqueue(encoder.encode("event: message\ndata: {}\n\n"));
   
   // RIGHT - AI SDK format
   controller.enqueue(encoder.encode("2d:{\"type\":\"text-delta\"}\n"));
   ```

2. **Don't manually construct streams when using AI SDK**
   ```typescript
   // WRONG - Manual streaming with AI SDK
   const stream = new ReadableStream({ ... });
   return new Response(stream, { ... });
   
   // RIGHT - Use built-in
   return result.toDataStreamResponse();
   ```

3. **Don't forget to handle streaming lifecycle**
   - Always close the stream when done
   - Handle client disconnections
   - Clean up resources

## LangChain Integration Considerations

When integrating LangChain with the AI SDK streaming:

1. **Option 1: Use LangChain's built-in streaming** (if available)
   ```typescript
   const stream = await agent.stream({ ... });
   // Convert LangChain stream to AI SDK format
   ```

2. **Option 2: Buffer and convert**
   ```typescript
   const result = await agent.invoke({ ... });
   // Use AI SDK's StreamingTextResponse to stream the result
   ```

3. **Option 3: Custom streaming adapter**
   ```typescript
   // Create a custom stream that converts LangChain events 
   // to AI SDK data stream format
   ```

## Testing Streaming

To test if streaming is working correctly:

1. Check browser DevTools Network tab:
   - Response type should be `eventstream`
   - You should see chunks arriving over time

2. Use curl to test:
   ```bash
   curl -X POST http://localhost:5173/api/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Hello"}]}' \
     --no-buffer
   ```

3. Look for the length-prefixed format:
   ```
   2d:{"type":"text-delta","textDelta":"Hello"}\n
   ```

## Common Issues and Solutions

1. **"Failed to parse stream string"** - Not using AI SDK format
   - Solution: Use `toDataStreamResponse()` or follow the format exactly

2. **No streaming, full response at once** - Response buffering
   - Solution: Ensure `no-cache` header and proper stream handling

3. **Connection drops** - Missing keep-alive
   - Solution: Add `Connection: keep-alive` header

4. **Mixed formats** - Combining SSE events with AI SDK format
   - Solution: Use only one format consistently

## Summary

The key to successful streaming with React Router and AI SDK is:
1. Use `toDataStreamResponse()` when possible
2. Follow the length-prefixed JSON format exactly
3. Set correct SSE headers
4. Handle the streaming lifecycle properly
5. Test thoroughly with proper tools

When refactoring to use LangChain, we need to either:
- Adapt LangChain's output to AI SDK's format
- Create a custom streaming implementation that follows these rules
- Use a compatibility layer that handles the conversion