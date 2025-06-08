/**
 * AI SDK Stream Format Utilities
 * 
 * This module provides utilities for formatting data in the AI SDK's
 * data stream protocol format for SSE streaming.
 * 
 * Data Stream Protocol Prefixes:
 * - 0: Text content
 * - 1: Function/tool call arguments
 * - 2: Custom JSON data  
 * - 3: Error messages
 * - 6: Message annotations
 * - 7: Data stream value
 * - 9: Tool call
 * - a: Tool result
 * - b: Tool call streaming start
 * - c: Tool call delta
 * - d: Finish message
 * - e: Step finish
 * - f: Step start
 * - g: Reasoning text
 * - h: Source
 * - k: File data
 */

/**
 * Formats a data stream part with the correct prefix and length encoding
 * Format: [prefix]:[data]\n
 * For JSON data: [prefix][hex_length]:[json]\n
 */
function formatDataStreamPart(prefix: string, data: string | any): string {
  if (typeof data === 'string') {
    // For text content, use the simple format
    return `${prefix}:"${data}"\n`;
  } else {
    // For JSON objects, stringify and include length
    const json = JSON.stringify(data);
    const hexLength = json.length.toString(16);
    return `${prefix}${hexLength}:${json}\n`;
  }
}

/**
 * Creates a text content message (prefix 0)
 */
export function createTextContent(text: string): string {
  return formatDataStreamPart('0', text);
}

/**
 * Creates a step start message (prefix f)
 */
export function createStepStart(messageId: string): string {
  return formatDataStreamPart('f', { messageId });
}

/**
 * Creates a tool call message (prefix 9)
 */
export function createToolCall(toolCallId: string, toolName: string, args: any): string {
  return formatDataStreamPart('9', {
    toolCallType: "function",
    toolCallId,
    toolName,
    args
  });
}

/**
 * Creates a tool result message (prefix a)
 */
export function createToolResult(toolCallId: string, result: any): string {
  return formatDataStreamPart('a', {
    toolCallId,
    result
  });
}

/**
 * Creates a step finish message (prefix e)
 */
export function createStepFinish(finishReason: string = "stop", usage?: { completionTokens: number; promptTokens: number }): string {
  return formatDataStreamPart('e', {
    finishReason,
    usage: usage || { promptTokens: null, completionTokens: null },
    isContinued: false
  });
}

/**
 * Creates a finish message (prefix d)
 */
export function createFinishMessage(finishReason: string = "stop", usage?: { completionTokens: number; promptTokens: number }): string {
  return formatDataStreamPart('d', {
    finishReason,
    usage: usage || { promptTokens: null, completionTokens: null }
  });
}

/**
 * Creates an error message (prefix 3)
 */
export function createErrorMessage(error: string): string {
  return formatDataStreamPart('3', error);
}

/**
 * Creates custom data message (prefix 2)
 */
export function createDataMessage(data: any): string {
  return formatDataStreamPart('2', data);
}

/**
 * Creates a streaming response with proper headers
 */
export function createStreamingResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }
  });
}

/**
 * Generate a message ID
 */
export function generateMessageId(): string {
  return `msg_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Example of a complete streaming sequence:
 * 
 * const encoder = new TextEncoder();
 * 
 * // Start message
 * controller.enqueue(encoder.encode(createStepStart(generateMessageId())));
 * 
 * // Stream text content
 * controller.enqueue(encoder.encode(createTextContent("Hello ")));
 * controller.enqueue(encoder.encode(createTextContent("world!")));
 * 
 * // Tool call
 * controller.enqueue(encoder.encode(createToolCall("123", "search", { query: "test" })));
 * controller.enqueue(encoder.encode(createToolResult("123", { results: ["a", "b"] })));
 * 
 * // Finish
 * controller.enqueue(encoder.encode(createStepFinish("stop", { completionTokens: 10, promptTokens: 5 })));
 * controller.enqueue(encoder.encode(createFinishMessage("stop")));
 */