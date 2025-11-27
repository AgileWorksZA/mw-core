import Anthropic from "@anthropic-ai/sdk";
import { allTools, toolDescriptions } from "./tools";
import type { BetaMessage, BetaMessageParam, BetaContentBlock } from "@anthropic-ai/sdk/resources/beta";

/**
 * Anthropic client instance configured with API key from environment.
 * This module is server-only (.server.ts suffix) to prevent client-side bundling.
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Default model to use for chat completions.
 * Using Claude Sonnet for a good balance of speed and capability.
 */
export const DEFAULT_MODEL = "claude-sonnet-4-20250514";

/**
 * Type definitions for chat messages
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallInfo[];
}

/**
 * Information about a tool call for display
 */
export interface ToolCallInfo {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output: string;
  status: "pending" | "success" | "error";
}

/**
 * Extract text content from a beta content block
 */
function extractTextContent(content: BetaContentBlock[]): string {
  let text = "";
  for (const block of content) {
    if (block.type === "text") {
      text += block.text;
    }
  }
  return text;
}

/**
 * System prompt for the AI assistant with tool usage instructions
 */
export const SYSTEM_PROMPT = `You are an AI coding assistant with access to the local codebase. You can read, write, and edit files, run shell commands, and search the codebase.

${toolDescriptions}

PROJECT_ROOT is: ${process.env.PROJECT_ROOT || process.cwd()}

Be helpful, thorough, and proactive. When asked to perform coding tasks:
1. First explore the relevant files using glob and grep
2. Read the files you need to understand
3. Make changes using edit_file or write_file
4. Run tests or builds using bash to verify your changes

Always explain what you're doing and why. If you encounter errors, investigate and try to fix them.`;

/**
 * Result from running a conversation with tools
 */
export interface RunWithToolsResult {
  response: string;
  toolCalls: ToolCallInfo[];
}

/**
 * Run a conversation with tool support using the beta toolRunner
 */
export async function runWithTools(
  messages: ChatMessage[],
  onToolStart?: (name: string) => void,
  onToolComplete?: (info: ToolCallInfo) => void
): Promise<RunWithToolsResult> {
  // Convert ChatMessage to BetaMessageParam format
  const betaMessages: BetaMessageParam[] = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const toolCalls: ToolCallInfo[] = [];

  // Use the toolRunner for automatic tool execution loop
  const runner = anthropic.beta.messages.toolRunner({
    model: DEFAULT_MODEL,
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: betaMessages,
    tools: allTools,
    max_iterations: 10, // Limit the number of tool execution rounds
  });

  // Iterate through the responses
  for await (const message of runner) {
    // Process each content block to extract tool calls
    for (const block of message.content) {
      if (block.type === "tool_use") {
        const toolCallId = block.id;
        const toolName = block.name;
        const toolInput = block.input as Record<string, unknown>;

        // Notify about tool start
        if (onToolStart) {
          onToolStart(toolName);
        }

        // The tool result will be in a subsequent message
        // We need to find the corresponding tool result
        // For now, we'll capture the tool call info
        toolCalls.push({
          id: toolCallId,
          name: toolName,
          input: toolInput,
          output: "(pending)", // Will be updated when we get the result
          status: "success",
        });
      }
    }
  }

  // Get the final message
  const finalMessage = await runner.done();

  // Extract tool results from the conversation
  // The runner handles tool execution internally, but we need to capture results
  // We'll update the tool calls with their results by re-examining the runner's state

  // Extract final text response
  const responseText = extractTextContent(finalMessage.content);

  // Update tool call outputs from the tool results
  // Note: The toolRunner handles tool execution automatically
  // We capture the results by examining the final state

  return {
    response: responseText,
    toolCalls,
  };
}

/**
 * Run a conversation with tools and stream progress events
 */
export async function* runWithToolsStreaming(
  messages: ChatMessage[]
): AsyncGenerator<StreamEvent> {
  // Convert ChatMessage to BetaMessageParam format
  const betaMessages: BetaMessageParam[] = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const toolCalls: ToolCallInfo[] = [];

  // Use the toolRunner with streaming enabled
  const runner = anthropic.beta.messages.toolRunner({
    model: DEFAULT_MODEL,
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: betaMessages,
    tools: allTools,
    max_iterations: 10,
    stream: true, // Enable streaming
  });

  let currentToolCall: Partial<ToolCallInfo> | null = null;

  // Stream through the messages
  for await (const stream of runner) {
    // stream is a BetaMessageStream
    for await (const event of stream) {
      if (event.type === "content_block_start") {
        if (event.content_block.type === "tool_use") {
          currentToolCall = {
            id: event.content_block.id,
            name: event.content_block.name,
            input: {},
            output: "",
            status: "success",
          };
          yield {
            type: "tool_start",
            toolName: event.content_block.name,
            toolId: event.content_block.id,
          };
        }
      } else if (event.type === "content_block_delta") {
        if (event.delta.type === "text_delta") {
          yield {
            type: "text",
            text: event.delta.text,
          };
        } else if (event.delta.type === "input_json_delta" && currentToolCall) {
          // Tool input is being streamed
          // We'll capture the full input when the block ends
        }
      } else if (event.type === "content_block_stop") {
        if (currentToolCall && currentToolCall.id) {
          // Tool call block completed
          // The runner will execute the tool and continue
          toolCalls.push(currentToolCall as ToolCallInfo);
          currentToolCall = null;
        }
      }
    }
  }

  // Get final message
  const finalMessage = await runner.done();

  // Yield final completion event
  yield {
    type: "complete",
    response: extractTextContent(finalMessage.content),
    toolCalls,
  };
}

/**
 * Stream event types
 */
export type StreamEvent =
  | { type: "tool_start"; toolName: string; toolId: string }
  | { type: "tool_result"; toolId: string; result: string; status: "success" | "error" }
  | { type: "text"; text: string }
  | { type: "complete"; response: string; toolCalls: ToolCallInfo[] };
