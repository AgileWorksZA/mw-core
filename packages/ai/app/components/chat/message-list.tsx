import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Message, type ChatMessage } from "./message";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-full overflow-hidden">
      <div ref={scrollRef} className="flex flex-col">
        {messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Welcome to AI Chat</p>
              <p className="text-sm">
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3 p-4">
                <div className="size-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Loader2 className="size-4 text-white animate-spin" />
                </div>
                <div className="flex-1 max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Thinking</span>
                    <span className="inline-flex">
                      <span className="animate-bounce delay-0">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
