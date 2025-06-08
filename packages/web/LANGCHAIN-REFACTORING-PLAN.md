# LangChain Refactoring Plan

Based on our SSE streaming analysis, here's a careful plan for refactoring to use LangChain while maintaining compatibility with the existing useChat hook.

## Current Architecture

```
Client (useChat) ---> API Route (streamText) ---> AI SDK ---> OpenAI
                           |
                           v
                    toDataStreamResponse()
                    (length-prefixed JSON)
```

## Target Architecture

```
Client (useChat) ---> API Route (LangChain) ---> Agent ---> Tools/LLM
                           |
                           v
                    Custom Stream Adapter
                    (length-prefixed JSON)
```

## Implementation Strategy

### Option 1: Minimal Change - Buffer & Stream (Recommended for Initial Implementation)

This approach executes LangChain synchronously but streams the response:

```typescript
import { StreamingTextResponse } from "ai";

export async function action({ request }: ActionFunctionArgs) {
  // 1. Execute LangChain agent (non-streaming)
  const agent = await createAgent();
  const result = await agent.invoke({
    input: userMessage,
    chat_history: history
  });
  
  // 2. Create a readable stream that outputs in AI SDK format
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // Stream the result in chunks
      const chunks = result.output.split(' ');
      for (const chunk of chunks) {
        const data = {
          type: "text-delta",
          textDelta: chunk + " "
        };
        const json = JSON.stringify(data);
        const hex = json.length.toString(16);
        controller.enqueue(encoder.encode(`${hex}:${json}\n`));
        
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Send finish event
      const finishData = {
        type: "finish",
        finishReason: "stop"
      };
      const finishJson = JSON.stringify(finishData);
      const finishHex = finishJson.length.toString(16);
      controller.enqueue(encoder.encode(`${finishHex}:${finishJson}\n`));
      
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

### Option 2: True Streaming with Callbacks

For real streaming, use LangChain callbacks:

```typescript
class StreamingCallback extends BaseCallbackHandler {
  private controller: ReadableStreamDefaultController;
  private encoder = new TextEncoder();
  
  constructor(controller: ReadableStreamDefaultController) {
    super();
    this.controller = controller;
  }
  
  async handleLLMNewToken(token: string) {
    const data = {
      type: "text-delta",
      textDelta: token
    };
    const json = JSON.stringify(data);
    const hex = json.length.toString(16);
    this.controller.enqueue(
      this.encoder.encode(`${hex}:${json}\n`)
    );
  }
  
  async handleToolStart(tool: any, input: string) {
    const data = {
      type: "tool-call",
      toolCallId: generateId(),
      toolName: tool.name,
      args: JSON.parse(input)
    };
    const json = JSON.stringify(data);
    const hex = json.length.toString(16);
    this.controller.enqueue(
      this.encoder.encode(`${hex}:${json}\n`)
    );
  }
}
```

### Option 3: Using AI SDK with LangChain Tools

Convert LangChain tools to AI SDK format:

```typescript
import { tool } from "ai";

function convertLangChainTool(langchainTool: Tool) {
  return tool({
    description: langchainTool.description,
    parameters: langchainTool.schema,
    execute: async (args) => {
      return await langchainTool._call(args);
    }
  });
}
```

## Step-by-Step Refactoring Process

### Phase 1: Create Compatibility Layer
1. Create `langchain-stream-adapter.ts` with streaming utilities
2. Implement length-prefixed JSON formatting
3. Add proper error handling

### Phase 2: Refactor API Route
1. Keep existing route as backup
2. Create new route `/api/moneyworks-ai-langchain`
3. Implement Option 1 (buffer & stream) first
4. Test with existing chat UI

### Phase 3: Add Debug Features
1. Create debug event streaming alongside main content
2. Add callbacks for agent actions
3. Implement proper error boundaries

### Phase 4: Optimize
1. Implement true streaming (Option 2)
2. Add token usage tracking
3. Implement timeout handling

## Critical Success Factors

1. **Format Compliance**: Every message MUST follow `[hex]:[json]\n` format
2. **Message Types**: Only use AI SDK message types (text-delta, tool-call, etc.)
3. **Error Handling**: Errors must be streamed as `{type: "error", error: "..."}` 
4. **Headers**: Always include SSE headers
5. **Testing**: Test with useChat hook to ensure compatibility

## Testing Checklist

- [ ] Basic message streaming works
- [ ] Tool calls are properly formatted
- [ ] Errors are handled gracefully
- [ ] Stream closes properly
- [ ] No parsing errors in useChat
- [ ] Debug events stream correctly
- [ ] Performance is acceptable

## Common Pitfalls to Avoid

1. **Don't mix formats** - No SSE "event:" syntax
2. **Don't forget hex length** - Every message needs length prefix
3. **Don't send raw JSON** - Must be length-prefixed
4. **Don't leave streams open** - Always close properly
5. **Don't buffer too much** - Stream as data becomes available

## Next Steps

1. Start with Option 1 (simplest)
2. Test thoroughly with existing UI
3. Add debug features
4. Optimize to true streaming if needed

This approach ensures we maintain compatibility with the existing useChat implementation while gaining the benefits of LangChain's agent capabilities.