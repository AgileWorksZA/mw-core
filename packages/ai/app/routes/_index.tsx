import { useState, useRef, useEffect } from "react";
import { Form, useNavigation, useActionData } from "react-router";
import { Send } from "lucide-react";
import type { Route } from "./+types/_index";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { MessageList } from "~/components/chat/message-list";
import { runWithTools, type ToolCallInfo, type ChatMessage as ServerChatMessage } from "~/lib/anthropic.server";
import type { ChatMessage } from "~/components/chat/message";
import type { ToolCallData } from "~/components/chat/tool-call";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Chat - MoneyWorks" },
    { name: "description", content: "Chat with AI powered by Claude - with tool capabilities" },
  ];
}

interface ActionResponse {
  response?: string | null;
  error?: string | null;
  toolCalls?: ToolCallData[];
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
    // Run with tools using the toolRunner
    const result = await runWithTools(messages);

    // Convert ToolCallInfo to ToolCallData format for UI
    const toolCalls: ToolCallData[] = result.toolCalls.map((tc) => ({
      id: tc.id,
      name: tc.name,
      input: tc.input,
      output: tc.output,
      status: tc.status === "error" ? "error" : "success",
    }));

    return {
      response: result.response,
      toolCalls,
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

  return (
    <div className="h-screen flex flex-col p-4 max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <span>AI Chat</span>
            <span className="text-xs font-normal text-muted-foreground">
              Powered by Claude with Tools
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <MessageList messages={messages} isLoading={isSubmitting} />
        </CardContent>

        <CardFooter className="border-t p-4">
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
              placeholder="Ask me to read files, search code, or run commands..."
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
    </div>
  );
}
