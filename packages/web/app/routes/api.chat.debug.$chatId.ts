import type { LoaderFunctionArgs } from "react-router";
import { data as json } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { chatId } = params;

  if (!chatId) {
    return json({ error: "Chat ID is required" }, { status: 400 });
  }

  // Generate debug information for the chat
  const debugInfo = {
    chatId,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      env: {
        MW_API_MODE: process.env.MW_API_MODE || "not set",
        MW_API_BASE_URL: process.env.MW_API_BASE_URL || "not set",
        MW_CONFIG_PATH: process.env.MW_CONFIG_PATH || "not set",
        MCP_SERVER_PATH: process.env.MCP_SERVER_PATH || "not set",
        MW_BEARER_TOKEN: process.env.MW_BEARER_TOKEN
          ? "set (hidden)"
          : "not set",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "set (hidden)" : "not set",
      },
    },
    mcpStatus: {
      // This would be populated from actual MCP status
      initialized: false,
      toolsAvailable: 0,
      lastError: null,
    },
    debugUrl: `${process.env.NODE_ENV === "production" ? "https" : "http"}://${params.request?.headers.get("host") || "localhost:5173"}/api/chat/debug/${chatId}`,
    instructions: [
      "1. Copy this debug URL",
      "2. Share it with the developer/debugger",
      "3. The debug endpoint provides environment and configuration details",
      "4. No sensitive data (tokens/keys) are exposed, only their presence is indicated",
    ],
  };

  return json(debugInfo, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
