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
      <Avatar className={cn("size-8", isUser ? "bg-blue-500" : "bg-purple-500")}>
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
          "flex-1 max-w-[85%]",
          isUser ? "ml-auto" : "mr-auto"
        )}
      >
        {/* Tool calls - show before text for assistant messages */}
        {!isUser && hasToolCalls && (
          <div className="mb-2">
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
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Tool calls after text for user messages (shouldn't happen, but just in case) */}
        {isUser && hasToolCalls && (
          <div className="mt-2">
            {message.toolCalls!.map((toolCall) => (
              <ToolCall key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
