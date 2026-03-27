/**
 * Message List Component
 *
 * Displays chat messages with proper scrolling and auto-scroll to bottom.
 */

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Message, type ChatMessage } from "./message";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  currentTool?: string;
}

export function MessageList({ messages, isLoading = false, currentTool }: MessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto"
    >
      <div className="flex flex-col min-h-full">
        {messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground">
            <div className="text-center space-y-3">
              <p className="text-lg font-medium">MoneyWorks AI Assistant</p>
              <p className="text-sm max-w-md">
                Ask questions about your MoneyWorks data - accounts, transactions,
                customers, suppliers, and more.
              </p>
              <div className="text-xs text-muted-foreground/70 space-y-1">
                <p>Try asking:</p>
                <ul className="space-y-1">
                  <li>"Show me all accounts"</li>
                  <li>"List customers with balances over $1000"</li>
                  <li>"What's my trial balance?"</li>
                  <li>"Show tax codes and rates"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 p-4">
                <div className="size-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="size-4 text-white animate-spin" />
                </div>
                <div className="flex-1 max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="animate-pulse">
                      {currentTool ? `Running ${currentTool}` : "Thinking"}
                    </span>
                    <span className="inline-flex">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
