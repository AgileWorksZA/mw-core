import { data } from "react-router";
import type { Route } from "./+types/api.test";
import { runWithTools, type ChatMessage } from "~/lib/anthropic.server";

/**
 * Test endpoint for the Claude Agent SDK
 *
 * GET /api/test?prompt=your+prompt+here
 * POST /api/test with JSON body { prompt: "your prompt here" }
 */

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const prompt = url.searchParams.get("prompt");

  if (!prompt) {
    return data({
      error: "Missing 'prompt' query parameter",
      usage: "GET /api/test?prompt=Read+the+package.json+file",
    }, { status: 400 });
  }

  return runPrompt(prompt);
}

export async function action({ request }: Route.ActionArgs) {
  const body = await request.json();
  const prompt = body.prompt;

  if (!prompt) {
    return data({
      error: "Missing 'prompt' in request body",
      usage: 'POST /api/test with JSON body { "prompt": "your prompt" }',
    }, { status: 400 });
  }

  return runPrompt(prompt);
}

async function runPrompt(prompt: string) {
  console.log("[API Test] Received prompt:", prompt);

  if (!process.env.ANTHROPIC_API_KEY) {
    return data({
      error: "ANTHROPIC_API_KEY not configured",
    }, { status: 500 });
  }

  try {
    const messages: ChatMessage[] = [
      { role: "user", content: prompt },
    ];

    const result = await runWithTools(messages);

    return data({
      success: true,
      prompt,
      response: result.response,
      toolCalls: result.toolCalls,
    });
  } catch (error) {
    console.error("[API Test] Error:", error);
    return data({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
