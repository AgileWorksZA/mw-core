import { useState, useRef, useEffect } from "react";
import { Form, useNavigation, useActionData } from "react-router";
import { Send } from "lucide-react";
import type { Route } from "./+types/_index";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { MessageList } from "~/components/chat/message-list";
import { SessionStats } from "~/components/chat/session-stats";
import { SplitPanelLayout } from "~/components/layout/split-panel-layout";
import { ArtifactPanel } from "~/components/artifacts/artifact-panel";
import { runWithTools, estimateCost, type ToolCallInfo, type ChatMessage as ServerChatMessage } from "~/lib/anthropic.server";
import type { ChatMessage } from "~/components/chat/message";
import type { ToolCallData } from "~/components/chat/tool-call";
import type { Artifact } from "~/lib/artifacts/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MoneyWorks AI Assistant" },
    { name: "description", content: "Query your MoneyWorks data with AI" },
  ];
}

interface ActionResponse {
  response?: string | null;
  error?: string | null;
  toolCalls?: ToolCallData[];
  artifacts?: Artifact[];
  stats?: {
    toolCalls: number;
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResponse> {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  const historyJson = formData.get("history") as string;

  if (!message?.trim()) {
    return { error: "Message is required", response: null };
  }

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      error: "ANTHROPIC_API_KEY is not configured. Please add it to your .env file.",
      response: null,
    };
  }

  let history: ChatMessage[] = [];
  try {
    history = historyJson ? JSON.parse(historyJson) : [];
  } catch {
    // Ignore parse errors, start fresh
  }

  // Build messages array - include the new user message
  const messages: ServerChatMessage[] = [
    ...history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    console.log("[Chat] User prompt:", message);
    console.log("[Chat] History length:", history.length);

    // Run with tools using the Anthropic SDK
    const result = await runWithTools(messages);

    console.log("[Chat] Response length:", result.response.length);
    console.log("[Chat] Response preview:", result.response.substring(0, 200) + "...");
    if (result.artifacts) {
      console.log("[Chat] Artifacts:", result.artifacts.length);
    }

    // Convert ToolCallInfo to ToolCallData format for UI
    const toolCalls: ToolCallData[] = result.toolCalls.map((tc) => ({
      id: tc.id,
      name: tc.name,
      input: tc.input,
      output: tc.output,
      status: tc.status === "error" ? "error" : "success",
      durationMs: tc.durationMs,
    }));

    return {
      response: result.response,
      toolCalls,
      artifacts: result.artifacts,
      stats: {
        toolCalls: result.stats.toolCalls,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        estimatedCost: estimateCost(result.inputTokens, result.outputTokens),
      },
      error: null,
    };
  } catch (error) {
    console.error("Anthropic API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get AI response";
    return { error: errorMessage, response: null };
  }
}

export default function ChatPage() {
  const navigation = useNavigation();
  const actionData = useActionData<ActionResponse>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentArtifacts, setCurrentArtifacts] = useState<Artifact[]>([]);
  const [sessionStats, setSessionStats] = useState({
    totalToolCalls: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSubmitting = navigation.state === "submitting";

  // Handle action data (response from server)
  useEffect(() => {
    if (actionData && !actionData.error && actionData.response) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: actionData.response as string,
          toolCalls: actionData.toolCalls,
        },
      ]);

      // Update artifacts if present
      if (actionData.artifacts && actionData.artifacts.length > 0) {
        setCurrentArtifacts(actionData.artifacts);
      }

      // Update session stats
      if (actionData.stats) {
        setSessionStats((prev) => ({
          totalToolCalls: prev.totalToolCalls + actionData.stats!.toolCalls,
          totalInputTokens: prev.totalInputTokens + actionData.stats!.inputTokens,
          totalOutputTokens: prev.totalOutputTokens + actionData.stats!.outputTokens,
          totalCost: prev.totalCost + actionData.stats!.estimatedCost,
        }));
      }
    }
  }, [actionData]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!inputValue.trim()) {
      e.preventDefault();
      return;
    }

    // Add user message to state immediately (optimistic update)
    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    setInputValue("");
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  // Focus input after submission
  useEffect(() => {
    if (navigation.state === "idle" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [navigation.state]);

  // Clear session
  const handleClearSession = () => {
    setMessages([]);
    setCurrentArtifacts([]);
    setSessionStats({
      totalToolCalls: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalCost: 0,
    });
  };

  // Chat panel content
  const chatPanel = (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>MoneyWorks AI</span>
            <span className="text-xs font-normal text-muted-foreground">
              Powered by Claude
            </span>
          </CardTitle>
          <SessionStats
            toolCalls={sessionStats.totalToolCalls}
            inputTokens={sessionStats.totalInputTokens}
            outputTokens={sessionStats.totalOutputTokens}
            estimatedCost={sessionStats.totalCost}
            onClear={handleClearSession}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0">
        <MessageList messages={messages} isLoading={isSubmitting} />
      </CardContent>

      <CardFooter className="border-t p-4 flex-shrink-0">
        <Form
          ref={formRef}
          method="post"
          onSubmit={handleSubmit}
          className="flex gap-2 w-full"
        >
          <input
            type="hidden"
            name="history"
            value={JSON.stringify(messages)}
          />
          <Input
            ref={inputRef}
            name="message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about accounts, transactions, reports..."
            disabled={isSubmitting}
            autoComplete="off"
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting || !inputValue.trim()}>
            <Send className="size-4" />
            <span className="sr-only">Send</span>
          </Button>
        </Form>

        {actionData?.error && (
          <p className="text-sm text-destructive mt-2 w-full">
            {actionData.error}
          </p>
        )}
      </CardFooter>
    </Card>
  );

  // Artifact panel content
  const artifactPanel = (
    <ArtifactPanel artifacts={currentArtifacts} />
  );

  return (
    <div className="h-screen p-4">
      <SplitPanelLayout
        leftPanel={chatPanel}
        rightPanel={artifactPanel}
        showRightPanel={currentArtifacts.length > 0}
      />
    </div>
  );
}
