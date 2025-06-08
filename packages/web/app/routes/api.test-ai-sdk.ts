import type { ActionFunctionArgs } from "react-router";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * Test route using AI SDK directly to verify compatibility
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { messages } = await request.json();
  
  // Use a simple echo model for testing
  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: "You are a test assistant. Keep responses brief."
      },
      ...messages
    ],
    maxTokens: 50,
  });

  // This is the correct way to return streaming responses
  return result.toDataStreamResponse();
}