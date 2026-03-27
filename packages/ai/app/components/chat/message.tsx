/**
 * Message Component
 *
 * Displays a single chat message with markdown rendering and tool calls.
 */

import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { ToolCall, type ToolCallData } from "./tool-call";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallData[];
}

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("size-8 flex-shrink-0", isUser ? "bg-blue-500" : "bg-purple-500")}>
        <AvatarFallback
          className={cn(
            "text-white",
            isUser ? "bg-blue-500" : "bg-purple-500"
          )}
        >
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex-1 max-w-[85%] space-y-2",
          isUser ? "ml-auto" : "mr-auto"
        )}
      >
        {/* Tool calls - show before text for assistant messages */}
        {!isUser && hasToolCalls && (
          <div className="space-y-1">
            {message.toolCalls!.map((toolCall) => (
              <ToolCall key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}

        {/* Message content */}
        {message.content && (
          <div
            className={cn(
              "rounded-lg px-4 py-2",
              isUser
                ? "bg-blue-500 text-white"
                : "bg-muted text-foreground"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-background prose-pre:text-foreground prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom table styling
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-2">
                        <table className="min-w-full border-collapse border border-border text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border bg-muted px-3 py-1.5 text-left font-medium">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border px-3 py-1.5">
                        {children}
                      </td>
                    ),
                    // Code blocks
                    pre: ({ children }) => (
                      <pre className="bg-background border rounded p-3 overflow-x-auto text-xs">
                        {children}
                      </pre>
                    ),
                    code: ({ className, children, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className={cn("font-mono text-xs", className)} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Lists
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 my-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 my-2">
                        {children}
                      </ol>
                    ),
                    // Paragraphs
                    p: ({ children }) => (
                      <p className="my-2 first:mt-0 last:mb-0">
                        {children}
                      </p>
                    ),
                    // Headers
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mt-3 mb-2 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-bold mt-2 mb-1 first:mt-0">
                        {children}
                      </h3>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Tool calls after text for user messages (shouldn't happen, but just in case) */}
        {isUser && hasToolCalls && (
          <div className="space-y-1">
            {message.toolCalls!.map((toolCall) => (
              <ToolCall key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
